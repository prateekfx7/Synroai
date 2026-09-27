import { supabase, isSupabaseConfigured } from './client';
import {
  PeerBroadcastMessage,
  RobotState,
  WarehouseTask,
  WarehouseEvent,
  MapBlock,
} from '@/types/warehouse';

type BroadcastCallback = (msg: PeerBroadcastMessage) => void;
type StateSyncCallback = (data: {
  robots: RobotState[];
  tasks: WarehouseTask[];
  events: WarehouseEvent[];
  mapBlocks: MapBlock[];
}) => void;

/**
 * Supabase (Realtime DB) — Simulated P2P/MQTT-style Message Layer
 * Emulates the peer-to-peer / MQTT-style broadcast layer via Supabase Realtime Broadcast.
 * Also syncs with Supabase Postgres tables if credentials are provided.
 */
class MeshBus {
  private peerSubscribers: Set<BroadcastCallback> = new Set();
  private stateSubscribers: Set<StateSyncCallback> = new Set();
  private supabaseChannel: any = null;
  private isInitialized = false;

  // In-memory decentralized cache
  private robotsMap = new Map<string, RobotState>();
  private tasksMap = new Map<string, WarehouseTask>();
  private eventsList: WarehouseEvent[] = [];
  private mapBlocksMap = new Map<string, MapBlock>();

  constructor() {
    this.init();
  }

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (isSupabaseConfigured && supabase) {
      try {
        // Subscribe to Realtime broadcast channel
        this.supabaseChannel = supabase.channel('warehouse:mesh', {
          config: { broadcast: { self: false } },
        });

        this.supabaseChannel
          .on('broadcast', { event: 'peer_msg' }, ({ payload }: { payload: PeerBroadcastMessage }) => {
            this.handleIncomingBroadcast(payload, false);
          })
          .subscribe();

        // Also subscribe to postgres_changes for dashboard updates if tables change
        supabase
          .channel('warehouse:db-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'robots' },
            (payload) => {
              if (payload.new && (payload.new as any).id) {
                const r = payload.new as RobotState;
                this.robotsMap.set(r.id, r);
                this.notifyStateSubscribers();
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks' },
            (payload) => {
              if (payload.new && (payload.new as any).id) {
                const t = payload.new as WarehouseTask;
                this.tasksMap.set(t.id, t);
                this.notifyStateSubscribers();
              }
            }
          )
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'events' },
            (payload) => {
              if (payload.new) {
                this.eventsList.unshift(payload.new as WarehouseEvent);
                if (this.eventsList.length > 50) this.eventsList.pop();
                this.notifyStateSubscribers();
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'map_blocks' },
            (payload) => {
              if (payload.new && (payload.new as any).id) {
                const b = payload.new as MapBlock;
                this.mapBlocksMap.set(b.id, b);
                this.notifyStateSubscribers();
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Supabase Realtime subscription error, using local mesh bus:', err);
      }
    }
  }

  /**
   * Robots call this to broadcast peer messages (heartbeat, intent, bid, alert)
   */
  public broadcastPeer(msg: PeerBroadcastMessage) {
    this.handleIncomingBroadcast(msg, true);

    // Relay through Supabase Realtime broadcast channel to any remote instances
    if (this.supabaseChannel && isSupabaseConfigured) {
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'peer_msg',
          payload: msg,
        });
      } catch (err) {
        // Silently ignore network hiccup in broadcast
      }
    }
  }

  private handleIncomingBroadcast(msg: PeerBroadcastMessage, isLocalOrigin: boolean) {
    // Deliver to all peer agent listeners
    for (const callback of this.peerSubscribers) {
      try {
        callback(msg);
      } catch (e) {
        console.error('Error in peer broadcast handler:', e);
      }
    }
  }

  /**
   * Subscribe an independent robot agent to the peer-to-peer broadcast medium
   */
  public subscribePeer(callback: BroadcastCallback): () => void {
    this.peerSubscribers.add(callback);
    return () => this.peerSubscribers.delete(callback);
  }

  /**
   * Subscribe dashboard to state updates
   */
  public subscribeState(callback: StateSyncCallback): () => void {
    this.stateSubscribers.add(callback);
    // Initial emit
    callback(this.getSnapshot());
    return () => this.stateSubscribers.delete(callback);
  }

  public notifyStateSubscribers() {
    const snapshot = this.getSnapshot();
    for (const cb of this.stateSubscribers) {
      try {
        cb(snapshot);
      } catch (e) {
        console.error('Error in state sync callback:', e);
      }
    }
  }

  public getSnapshot() {
    return {
      robots: Array.from(this.robotsMap.values()),
      tasks: Array.from(this.tasksMap.values()),
      events: [...this.eventsList],
      mapBlocks: Array.from(this.mapBlocksMap.values()),
    };
  }

  /**
   * Update robot state in store and sync to Supabase table
   */
  public syncRobotState(robot: RobotState) {
    this.robotsMap.set(robot.id, { ...robot });
    this.notifyStateSubscribers();

    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from('robots')
          .upsert({
            id: robot.id,
            name: robot.name,
            x: robot.x,
            y: robot.y,
            heading: robot.heading,
            status: robot.status,
            battery: robot.battery,
            current_task_id: robot.current_task_id,
            planned_path: robot.planned_path,
            last_heartbeat: robot.last_heartbeat,
            deadlock_ticks: robot.deadlock_ticks || 0,
          })
      ).catch(() => {});
    }
  }

  /**
   * Update task state in store and sync to Supabase table
   */
  public syncTaskState(task: WarehouseTask) {
    this.tasksMap.set(task.id, { ...task });
    this.notifyStateSubscribers();

    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from('tasks')
          .upsert({
            id: task.id,
            pickup_cell: task.pickup_cell,
            dropoff_cell: task.dropoff_cell,
            status: task.status,
            assigned_robot_id: task.assigned_robot_id,
            bids: task.bids,
            completed_at: task.completed_at,
          })
      ).catch(() => {});
    }
  }

  /**
   * Record an event to feed and sync to Supabase
   */
  public pushEvent(type: WarehouseEvent['type'], robot_id: string | null, message: string) {
    const event: WarehouseEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      robot_id,
      message,
      created_at: new Date().toISOString(),
    };

    this.eventsList.unshift(event);
    if (this.eventsList.length > 50) this.eventsList.pop();
    this.notifyStateSubscribers();

    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from('events')
          .insert({
            type: event.type,
            robot_id: event.robot_id,
            message: event.message,
          })
      ).catch(() => {});
    }
  }

  /**
   * Toggle or update dynamic map obstacle
   */
  public setMapBlock(cellX: number, cellY: number, blocked: boolean) {
    const id = `block_${cellX}_${cellY}`;
    const block: MapBlock = {
      id,
      cell_x: cellX,
      cell_y: cellY,
      blocked,
      created_at: new Date().toISOString(),
    };

    if (blocked) {
      this.mapBlocksMap.set(id, block);
    } else {
      this.mapBlocksMap.delete(id);
    }

    this.notifyStateSubscribers();

    // Broadcast obstacle alert over peer channel
    this.broadcastPeer({
      type: 'obstacle_alert',
      robotId: 'SYSTEM',
      timestamp: Date.now(),
      blockedCell: { x: cellX, y: cellY },
    });

    if (isSupabaseConfigured && supabase) {
      if (blocked) {
        Promise.resolve(supabase.from('map_blocks').upsert(block)).catch(() => {});
      } else {
        Promise.resolve(supabase.from('map_blocks').delete().eq('id', id)).catch(() => {});
      }
    }
  }

  public clearMapBlocks() {
    this.mapBlocksMap.clear();
    this.notifyStateSubscribers();
    if (isSupabaseConfigured && supabase) {
      Promise.resolve(supabase.from('map_blocks').delete().neq('id', '')).catch(() => {});
    }
  }

  public resetFleet(initialRobots: RobotState[], initialTasks: WarehouseTask[]) {
    this.robotsMap.clear();
    this.tasksMap.clear();
    this.eventsList = [];
    this.mapBlocksMap.clear();

    for (const r of initialRobots) {
      this.robotsMap.set(r.id, { ...r });
    }
    for (const t of initialTasks) {
      this.tasksMap.set(t.id, { ...t });
    }

    this.pushEvent('system', 'FLEET', 'Simulation reset to pristine initial state.');
    this.notifyStateSubscribers();
  }
}

export const meshBus = new MeshBus();
