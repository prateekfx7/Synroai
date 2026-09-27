import { GridPosition, PathStep } from '@/types/warehouse';
import { GRID_HEIGHT, GRID_WIDTH, isStaticShelf, isWithinBounds, manhattanDistance } from '@/lib/warehouse/grid';

interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

export interface ObstacleMap {
  [coordKey: string]: boolean;
}

export function buildObstacleKey(x: number, y: number): string {
  return `${x},${y}`;
}

/**
 * Finds shortest collision-free path using A*
 * @param start Starting grid coordinate
 * @param goal Destination grid coordinate
 * @param dynamicObstacles Obstacle map including dynamic map_blocks, failed robots, or peer locations
 * @param reservedPositions Space-time reservations to avoid if possible
 */
export function findPathAStar(
  start: GridPosition,
  goal: GridPosition,
  dynamicObstacles: ObstacleMap = {},
  reservedPositions: { [key: string]: number } = {} // key: `${x},${y}@${t}`
): PathStep[] {
  if (start.x === goal.x && start.y === goal.y) {
    return [{ x: start.x, y: start.y, t: 0 }];
  }

  const openSet: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: manhattanDistance(start, goal),
    f: manhattanDistance(start, goal),
    parent: null,
  };

  openSet.push(startNode);

  const neighbors = [
    { dx: 0, dy: -1 }, // North
    { dx: 0, dy: 1 },  // South
    { dx: 1, dy: 0 },  // East
    { dx: -1, dy: 0 }, // West
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 600;

  while (openSet.length > 0 && iterations++ < MAX_ITERATIONS) {
    // Pop lowest f
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const currentKey = `${current.x},${current.y}`;

    if (current.x === goal.x && current.y === goal.y) {
      // Reconstruct path
      const path: PathStep[] = [];
      let curr: Node | null = current;
      while (curr !== null) {
        path.unshift({ x: curr.x, y: curr.y, t: 0 });
        curr = curr.parent;
      }
      // Assign relative time steps
      return path.map((step, idx) => ({ ...step, t: idx }));
    }

    closedSet.add(currentKey);

    for (const offset of neighbors) {
      const nx = current.x + offset.dx;
      const ny = current.y + offset.dy;
      const neighborKey = `${nx},${ny}`;

      if (!isWithinBounds(nx, ny)) continue;
      if (closedSet.has(neighborKey)) continue;

      // Check static shelves
      if (isStaticShelf(nx, ny)) continue;

      // Check dynamic obstacles (unless it's the goal itself and goal is reachable)
      if (dynamicObstacles[neighborKey] && !(nx === goal.x && ny === goal.y)) {
        continue;
      }

      // Check space-time reservation penalty if applicable
      const nextTime = current.g + 1;
      const isReserved = reservedPositions[`${neighborKey}@${nextTime}`];
      const reservationCost = isReserved ? 5 : 0;

      const tentativeG = current.g + 1 + reservationCost;
      const existing = openSet.find((n) => n.x === nx && n.y === ny);

      if (!existing) {
        const h = manhattanDistance({ x: nx, y: ny }, goal);
        openSet.push({
          x: nx,
          y: ny,
          g: tentativeG,
          h,
          f: tentativeG + h,
          parent: current,
        });
      } else if (tentativeG < existing.g) {
        existing.g = tentativeG;
        existing.f = tentativeG + existing.h;
        existing.parent = current;
      }
    }
  }

  // If no path found directly, return current position as a 1-step wait
  return [{ x: start.x, y: start.y, t: 0 }];
}
