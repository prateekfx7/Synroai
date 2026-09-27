import {
  GridPosition,
  Heading,
  PathStep,
  PeerBroadcastMessage,
  RobotState,
  RobotStatus,
  WarehouseTask,
} from '@/types/warehouse';
import { findPathAStar, buildObstacleKey, ObstacleMap } from '@/lib/pathfinding/astar';
import { getHeading, isStaticShelf, manhattanDistance } from '@/lib/warehouse/grid';
import { meshBus } from '@/lib/supabase/mesh-bus';

export interface PeerRecord {
  robotId: string;
  x: number;
  y: number;
  heading: Heading;
  status: RobotStatus;
  plannedPath: PathStep[];
  lastHeartbeat: number;
  currentTaskId: string | null;
}

export class RobotAgent {
  public readonly id: string;
  public readonly name: string;
  public readonly color: string;

  // Local agent state
  public x: number;
  public y: number;
  public heading: Heading;
  public status: RobotStatus;
  public battery: number;
  public currentTaskId: string | null = null;
  public plannedPath: PathStep[] = [];
  public payload: string | null = null;
  public isFailed: boolean = false;
  public deadlockTicks: number = 0;

  // Simulation mode: 'decentralized' vs 'stop_and_wait'
  public mode: 'decentralized' | 'stop_and_wait' = 'decentralized';

  // Internal local belief state
  private localBeliefObstacles: ObstacleMap = {};
  private peerBeliefs = new Map<string, PeerRecord>();
  private pendingBidsSent = new Set<string>();
  private unsubscribeMesh: (() => void) | null = null;
  private currentGoal: GridPosition | null = null;

  constructor(
    id: string,
    name: string,
    initialPos: GridPosition,
    initialHeading: Heading = 'E',
    color: string = '#10b981'
  ) {
    this.id = id;
    this.name = name;
    this.x = initialPos.x;
    this.y = initialPos.y;
    this.heading = initialHeading;
    this.status = 'waiting';
    this.battery = 95.0;
    this.color = color;

    // Subscribe to decentralized peer-to-peer broadcast medium
    this.unsubscribeMesh = meshBus.subscribePeer(this.handlePeerBroadcast.bind(this));
  }

  public destroy() {
    if (this.unsubscribeMesh) {
      this.unsubscribeMesh();
    }
  }

  /**
   * Receive and process a message broadcast by a peer robot or system sensor
   */
  public handlePeerBroadcast(msg: PeerBroadcastMessage) {
    if (this.isFailed) return;
    if (msg.robotId === this.id) return; // Ignore own echoes

    // Update peer belief cache
    if (msg.type === 'heartbeat' || msg.type === 'intent') {
      if (msg.x !== undefined && msg.y !== undefined) {
        this.peerBeliefs.set(msg.robotId, {
          robotId: msg.robotId,
          x: msg.x,
          y: msg.y,
          heading: msg.heading || 'N',
          status: msg.status || 'moving',
          plannedPath: msg.plannedPath || [],
          lastHeartbeat: msg.timestamp,
          currentTaskId: msg.taskId || null,
        });

        // If peer was previously marked as an obstacle (e.g. recovered), clear it
        const key = buildObstacleKey(msg.x, msg.y);
        if (msg.status !== 'failed' && this.localBeliefObstacles[key]) {
          delete this.localBeliefObstacles[key];
        }
      }
    } else if (msg.type === 'obstacle_alert' && msg.blockedCell) {
      // Local agent incorporates new dynamic obstacle information
      const key = buildObstacleKey(msg.blockedCell.x, msg.blockedCell.y);
      this.localBeliefObstacles[key] = true;

      // Check if current planned path crosses this obstacle
      const pathIntersect = this.plannedPath.some(
        (p) => p.x === msg.blockedCell!.x && p.y === msg.blockedCell!.y
      );

      if (pathIntersect && this.currentGoal) {
        meshBus.pushEvent(
          'reroute',
          this.id,
          `${this.id} detected blocked aisle at (${msg.blockedCell.x}, ${msg.blockedCell.y}). Recomputing path...`
        );
        this.replanPath(this.currentGoal);
      }
    }
  }

  /**
   * Main Autonomous Decision Loop (executed on each tick)
   * This is entirely self-contained within this robot.
   */
  public step(allTasks: WarehouseTask[], allMapBlocks: ObstacleMap) {
    if (this.isFailed) {
      this.status = 'failed';
      return;
    }

    // Ingest dynamic map blocks into local belief
    for (const [k, v] of Object.entries(allMapBlocks)) {
      if (v) this.localBeliefObstacles[k] = true;
    }

    // Step 1: Monitor Peer Liveness (Missed Heartbeat Detection)
    this.checkPeerHeartbeats(allTasks);

    // Step 2: Task Allocation & Bidding (Decentralized Auction)
    this.evaluateTasksAndBid(allTasks);

    // Step 3: Navigate towards current task goal
    this.progressCurrentTask(allTasks);

    // Step 4: Broadcast own state to peer channel
    this.broadcastState();
  }

  /**
   * Decentralized Peer Liveness Check
   * Detects if any peer stopped transmitting heartbeats.
   */
  private checkPeerHeartbeats(allTasks: WarehouseTask[]) {
    const now = Date.now();
    const HEARTBEAT_TIMEOUT_MS = 4000; // 4 seconds without heartbeat = robot failure

    for (const [peerId, peer] of Array.from(this.peerBeliefs.entries())) {
      if (peer.status !== 'failed' && now - peer.lastHeartbeat > HEARTBEAT_TIMEOUT_MS) {
        // Peer has failed!
        peer.status = 'failed';

        // 1. Mark its last position as dynamic obstacle
        const obstacleKey = buildObstacleKey(peer.x, peer.y);
        this.localBeliefObstacles[obstacleKey] = true;

        meshBus.pushEvent(
          'failure',
          this.id,
          `${this.id} detected missed heartbeat from ${peerId} at (${peer.x}, ${peer.y}). Marked position as obstacle.`
        );

        // 2. If the failed peer had an active task, trigger decentralized reassignment
        if (peer.currentTaskId) {
          const failedTask = allTasks.find((t) => t.id === peer.currentTaskId);
          if (failedTask && failedTask.status !== 'done') {
            meshBus.pushEvent(
              'reassignment',
              this.id,
              `${this.id} initiated task re-auction for ${failedTask.id} (previously held by failed ${peerId}).`
            );
            failedTask.status = 'pending';
            failedTask.assigned_robot_id = null;
            failedTask.bids = {};
            meshBus.syncTaskState(failedTask);
          }
        }
      }
    }
  }

  /**
   * Decentralized Auction Bidding
   * Each idle robot evaluates pending tasks and bids based on distance, battery, and queue.
   */
  private evaluateTasksAndBid(allTasks: WarehouseTask[]) {
    if (this.currentTaskId !== null || this.battery < 15) {
      return; // Busy or low battery
    }

    // Find pending or bidding tasks
    const availableTasks = allTasks.filter(
      (t) => t.status === 'pending' || t.status === 'bidding'
    );

    for (const task of availableTasks) {
      // If we haven't bid on this task yet
      if (!this.pendingBidsSent.has(task.id)) {
        // Calculate bid score: lower score is better
        // Formula: dist(robot, pickup) + (100 - battery) * 0.1
        const dist = manhattanDistance({ x: this.x, y: this.y }, task.pickup_cell);
        const batteryPenalty = (100 - this.battery) * 0.1;
        const bidScore = Math.round((dist + batteryPenalty) * 10) / 10;

        task.bids = task.bids || {};
        task.bids[this.id] = bidScore;
        task.status = 'bidding';
        this.pendingBidsSent.add(task.id);

        meshBus.broadcastPeer({
          type: 'bid',
          robotId: this.id,
          timestamp: Date.now(),
          taskId: task.id,
          bidValue: bidScore,
        });

        meshBus.syncTaskState(task);
      } else if (task.status === 'bidding') {
        // Check if bidding has collected bids and this robot has lowest bid
        const bidEntries = Object.entries(task.bids);
        if (bidEntries.length >= 1) {
          // Sort bids ascending
          bidEntries.sort((a, b) => {
            if (a[1] === b[1]) {
              return a[0].localeCompare(b[0]); // Deterministic tie-breaker
            }
            return a[1] - b[1];
          });

          const [winningRobotId, winningBid] = bidEntries[0];
          if (winningRobotId === this.id) {
            // We won the auction!
            task.status = 'assigned';
            task.assigned_robot_id = this.id;
            this.currentTaskId = task.id;
            this.currentGoal = task.pickup_cell;
            this.status = 'moving';

            meshBus.pushEvent(
              'bid_won',
              this.id,
              `${this.id} won task ${task.id} auction with lowest bid score ${winningBid}. Navigating to pickup (${task.pickup_cell.x}, ${task.pickup_cell.y}).`
            );

            meshBus.syncTaskState(task);
            this.replanPath(this.currentGoal);
            break;
          }
        }
      }
    }
  }

  /**
   * Plan or re-plan route using local A*
   */
  public replanPath(goal: GridPosition) {
    this.currentGoal = goal;
    const path = findPathAStar(
      { x: this.x, y: this.y },
      goal,
      this.localBeliefObstacles
    );
    this.plannedPath = path;
  }

  /**
   * Progress task: move to pickup, pick payload, move to dropoff, complete task
   */
  private progressCurrentTask(allTasks: WarehouseTask[]) {
    if (!this.currentTaskId) {
      if (this.plannedPath.length <= 1) {
        this.status = 'waiting';
      }
      return;
    }

    const task = allTasks.find((t) => t.id === this.currentTaskId);
    if (!task) {
      this.currentTaskId = null;
      this.status = 'waiting';
      return;
    }

    // Check if at pickup
    if (!this.payload && this.x === task.pickup_cell.x && this.y === task.pickup_cell.y) {
      this.payload = `Payload-${task.id.slice(-3)}`;
      task.status = 'in_progress';
      meshBus.syncTaskState(task);
      meshBus.pushEvent(
        'system',
        this.id,
        `${this.id} picked up payload for ${task.id}. En route to dropoff (${task.dropoff_cell.x}, ${task.dropoff_cell.y}).`
      );
      this.replanPath(task.dropoff_cell);
      return;
    }

    // Check if at dropoff
    if (this.payload && this.x === task.dropoff_cell.x && this.y === task.dropoff_cell.y) {
      this.payload = null;
      task.status = 'done';
      task.completed_at = new Date().toISOString();
      meshBus.syncTaskState(task);
      meshBus.pushEvent(
        'task_complete',
        this.id,
        `${this.id} successfully delivered ${task.id} to dropoff (${task.dropoff_cell.x}, ${task.dropoff_cell.y})!`
      );
      this.currentTaskId = null;
      this.currentGoal = null;
      this.status = 'waiting';
      this.plannedPath = [];
      return;
    }

    // Execute path movement with decentralized conflict resolution
    this.executeStepAlongPath();
  }

  /**
   * Decentralized Conflict Resolution & Collision Avoidance
   */
  private executeStepAlongPath() {
    if (this.plannedPath.length <= 1) {
      if (this.currentGoal && (this.x !== this.currentGoal.x || this.y !== this.currentGoal.y)) {
        this.replanPath(this.currentGoal);
      }
      return;
    }

    const nextStep = this.plannedPath[1]; // The intended next cell

    // Detect potential space-time collision with any peer
    const conflict = this.detectConflict(nextStep);

    if (conflict) {
      if (this.mode === 'stop_and_wait') {
        // BASELINE MODE: Naive stop-and-wait
        // Both robots halt until the path is completely cleared
        this.status = 'blocked';
        return; // Do not move
      }

      // DECENTRALIZED NEGOTIATED MODE:
      // Priority rule: Lower robot ID or earlier claim has priority
      const higherPriorityPeer = conflict.peerId < this.id;

      if (higherPriorityPeer) {
        // We must yield to peer!
        this.deadlockTicks++;
        this.status = 'waiting';

        if (this.deadlockTicks >= 3) {
          // DEADLOCK BREAKER: mutually blocked for >= 3 ticks
          meshBus.pushEvent(
            'deadlock_break',
            this.id,
            `${this.id} broke deadlock with ${conflict.peerId} via forced lateral detour.`
          );
          this.deadlockTicks = 0;
          this.attemptSidestepDetour(nextStep);
          return;
        }

        meshBus.pushEvent(
          'conflict',
          this.id,
          `Conflict at (${nextStep.x}, ${nextStep.y}) resolved: ${this.id} yielding right-of-way to ${conflict.peerId}.`
        );
        return; // Yield this tick
      } else {
        // We have higher priority! Proceed forward
        this.deadlockTicks = 0;
      }
    } else {
      this.deadlockTicks = 0;
    }

    // Move to next step
    this.heading = getHeading({ x: this.x, y: this.y }, nextStep);
    this.x = nextStep.x;
    this.y = nextStep.y;
    this.plannedPath.shift(); // Remove current cell from path
    this.status = 'moving';

    // Battery depletion
    this.battery = Math.max(10, Math.round((this.battery - 0.08) * 100) / 100);
  }

  /**
   * Check if intended next cell causes collision with any peer
   */
  private detectConflict(nextStep: PathStep): { peerId: string } | null {
    for (const [peerId, peer] of Array.from(this.peerBeliefs.entries())) {
      if (peer.status === 'failed') continue;

      // 1. Direct occupation: peer is currently sitting on next cell and not moving
      if (peer.x === nextStep.x && peer.y === nextStep.y && peer.plannedPath.length <= 1) {
        return { peerId };
      }

      // 2. Vertex conflict: peer's next step is the exact same cell
      const peerNextStep = peer.plannedPath.length > 1 ? peer.plannedPath[1] : null;
      if (peerNextStep && peerNextStep.x === nextStep.x && peerNextStep.y === nextStep.y) {
        return { peerId };
      }

      // 3. Swap / Edge conflict: peer is at nextStep and moving to my current position
      if (peer.x === nextStep.x && peer.y === nextStep.y) {
        if (peerNextStep && peerNextStep.x === this.x && peerNextStep.y === this.y) {
          return { peerId };
        }
      }
    }
    return null;
  }

  /**
   * Sidestep detour to break deadlocks
   */
  private attemptSidestepDetour(blockedTarget: PathStep) {
    if (!this.currentGoal) return;

    // Temporarily mark the blocked cell as an obstacle
    const tempKey = buildObstacleKey(blockedTarget.x, blockedTarget.y);
    const obstaclesWithTemp = { ...this.localBeliefObstacles, [tempKey]: true };

    const newPath = findPathAStar(
      { x: this.x, y: this.y },
      this.currentGoal,
      obstaclesWithTemp
    );

    if (newPath.length > 1) {
      this.plannedPath = newPath;
      this.executeStepAlongPath();
    }
  }

  /**
   * Broadcast state and intent to peer communication layer
   */
  public broadcastState() {
    const state: RobotState = {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      heading: this.heading,
      status: this.status,
      battery: this.battery,
      current_task_id: this.currentTaskId,
      planned_path: this.plannedPath,
      last_heartbeat: new Date().toISOString(),
      deadlock_ticks: this.deadlockTicks,
      color: this.color,
      payload: this.payload,
    };

    meshBus.broadcastPeer({
      type: 'heartbeat',
      robotId: this.id,
      timestamp: Date.now(),
      x: this.x,
      y: this.y,
      heading: this.heading,
      battery: this.battery,
      status: this.status,
      plannedPath: this.plannedPath,
      taskId: this.currentTaskId || undefined,
    });

    meshBus.syncRobotState(state);
  }

  /**
   * Inject simulated hardware/network failure
   */
  public triggerFailure() {
    this.isFailed = true;
    this.status = 'failed';
    this.broadcastState();
  }

  public recover() {
    this.isFailed = false;
    this.status = 'waiting';
    this.deadlockTicks = 0;
    this.broadcastState();
  }
}
