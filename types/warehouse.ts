export type RobotStatus = 'moving' | 'waiting' | 'blocked' | 'charging' | 'failed' | 'bidding';
export type Heading = 'N' | 'S' | 'E' | 'W';

export interface GridPosition {
  x: number;
  y: number;
}

export interface PathStep extends GridPosition {
  t: number; // Space-time step index (horizon)
}

export interface RobotState {
  id: string;
  name: string;
  x: number;
  y: number;
  heading: Heading;
  status: RobotStatus;
  battery: number;
  current_task_id: string | null;
  planned_path: PathStep[];
  last_heartbeat: string;
  deadlock_ticks?: number;
  color?: string;
  payload?: string | null;
}

export type TaskStatus = 'pending' | 'bidding' | 'assigned' | 'in_progress' | 'done';

export interface WarehouseTask {
  id: string;
  pickup_cell: GridPosition;
  dropoff_cell: GridPosition;
  status: TaskStatus;
  assigned_robot_id: string | null;
  previous_failed_robot_id?: string | null;
  bids: Record<string, number>; // robot_id -> computed bid score
  created_at?: string;
  completed_at?: string | null;
  duration_ticks?: number;
}

export type EventType =
  | 'conflict'
  | 'reroute'
  | 'failure'
  | 'reassignment'
  | 'task_complete'
  | 'bid_won'
  | 'deadlock_break'
  | 'system';

export interface WarehouseEvent {
  id: string;
  type: EventType;
  robot_id: string | null;
  message: string;
  created_at: string;
}

export interface MapBlock {
  id: string;
  cell_x: number;
  cell_y: number;
  blocked: boolean;
  created_at?: string;
}

// Decentralized peer-to-peer broadcast message payload
export type PeerMessageType =
  | 'heartbeat'
  | 'intent'
  | 'bid'
  | 'task_claim'
  | 'obstacle_alert'
  | 'failure_alert';

export interface PeerBroadcastMessage {
  type: PeerMessageType;
  robotId: string;
  timestamp: number;
  x?: number;
  y?: number;
  heading?: Heading;
  battery?: number;
  status?: RobotStatus;
  plannedPath?: PathStep[];
  taskId?: string;
  bidValue?: number;
  blockedCell?: GridPosition;
}

// Comparative metrics
export interface FleetMetrics {
  collisions: number;
  completedTasksCount: number;
  averageTaskCompletionTime: number; // in ticks or seconds
  totalConflictsResolved: number;
  totalReroutesCount: number;
  deadlocksBroken: number;
  activeRobotsCount: number;
  // Baseline comparison metrics (Decentralized vs Stop-and-Wait)
  baselineAverageCompletionTime: number;
  speedupPercentage: number;
  negotiationMode: 'decentralized' | 'stop_and_wait';
}
