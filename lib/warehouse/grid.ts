import { GridPosition } from '@/types/warehouse';

export const GRID_WIDTH = 18;
export const GRID_HEIGHT = 12;

// Static shelf racks in the warehouse (obstacles)
export const STATIC_SHELVES: GridPosition[] = [
  // Aisle 1 Racks
  { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
  { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
  { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 },
  { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 },

  // Aisle 2 Racks
  { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 },
  { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 },
  { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 },
  { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 },

  // Aisle 3 Racks
  { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 },
  { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 },
  { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 },
  { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 },

  // Aisle 4 Racks
  { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 },
  { x: 15, y: 2 }, { x: 15, y: 3 }, { x: 15, y: 4 },
  { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 },
  { x: 15, y: 7 }, { x: 15, y: 8 }, { x: 15, y: 9 },
];

export const CHARGING_PADS: GridPosition[] = [
  { x: 0, y: 1 },
  { x: 0, y: 4 },
  { x: 0, y: 7 },
  { x: 0, y: 10 },
];

export const PICKUP_STATIONS: GridPosition[] = [
  { x: 5, y: 1 },
  { x: 9, y: 1 },
  { x: 13, y: 1 },
  { x: 17, y: 3 },
  { x: 17, y: 8 },
];

export const DROPOFF_STATIONS: GridPosition[] = [
  { x: 2, y: 11 },
  { x: 6, y: 11 },
  { x: 10, y: 11 },
  { x: 16, y: 11 },
];

// Helper to check if a cell is an obstacle
export function isStaticShelf(x: number, y: number): boolean {
  return STATIC_SHELVES.some((s) => s.x === x && s.y === y);
}

export function isChargingPad(x: number, y: number): boolean {
  return CHARGING_PADS.some((c) => c.x === x && c.y === y);
}

export function isWithinBounds(x: number, y: number): boolean {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

export function manhattanDistance(a: GridPosition, b: GridPosition): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Direction vector from current cell to next cell
export function getHeading(from: GridPosition, to: GridPosition): 'N' | 'S' | 'E' | 'W' {
  if (to.y < from.y) return 'N';
  if (to.y > from.y) return 'S';
  if (to.x > from.x) return 'E';
  return 'W';
}
