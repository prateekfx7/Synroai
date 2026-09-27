'use client';

import React, { useState } from 'react';
import {
  RobotState,
  WarehouseTask,
  MapBlock,
  GridPosition,
} from '@/types/warehouse';
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  STATIC_SHELVES,
  CHARGING_PADS,
  PICKUP_STATIONS,
  DROPOFF_STATIONS,
} from '@/lib/warehouse/grid';
import {
  Zap,
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface WarehouseMapProps {
  robots: RobotState[];
  tasks: WarehouseTask[];
  mapBlocks: MapBlock[];
  onCellClick: (x: number, y: number) => void;
  onRobotClick: (robotId: string) => void;
}

export const WarehouseMap: React.FC<WarehouseMapProps> = ({
  robots,
  tasks,
  mapBlocks,
  onCellClick,
  onRobotClick,
}) => {
  const [hoveredCell, setHoveredCell] = useState<GridPosition | null>(null);

  // Cell dimensions in SVG coordinates
  const CELL_SIZE = 48;
  const MAP_WIDTH = GRID_WIDTH * CELL_SIZE;
  const MAP_HEIGHT = GRID_HEIGHT * CELL_SIZE;

  const isShelf = (x: number, y: number) =>
    STATIC_SHELVES.some((s) => s.x === x && s.y === y);

  const isCharging = (x: number, y: number) =>
    CHARGING_PADS.some((c) => c.x === x && c.y === y);

  const isPickup = (x: number, y: number) =>
    PICKUP_STATIONS.some((p) => p.x === x && p.y === y);

  const isDropoff = (x: number, y: number) =>
    DROPOFF_STATIONS.some((d) => d.x === x && d.y === y);

  const isBlocked = (x: number, y: number) =>
    mapBlocks.some((b) => b.cell_x === x && b.cell_y === y && b.blocked);

  // Direction rotation helper
  const getHeadingRotation = (heading: string) => {
    switch (heading) {
      case 'N':
        return 0;
      case 'E':
        return 90;
      case 'S':
        return 180;
      case 'W':
        return 270;
      default:
        return 0;
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3 sm:p-5 overflow-hidden">
      {/* Map Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-[#1d1d1f] truncate">
            Warehouse Floor Grid (18 × 12)
          </h2>
          <span className="text-[10px] sm:text-[11px] font-medium text-[#6e6e73] bg-[#f5f5f7] border border-black/[0.06] px-2 py-0.5 rounded-full truncate">
            P2P Spatial Mesh
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[#6e6e73]">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-md bg-[#e2e8f0] border border-[#cbd5e1]" />
            <span>Shelves</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-md bg-[#ecfdf5] border border-[#10b981]" />
            <span>Charging</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-md bg-[#fffbeb] border border-[#f59e0b]" />
            <span>Pickup</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-md bg-[#eff6ff] border border-[#3b82f6]" />
            <span>Dropoff</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-md bg-rose-100 border border-rose-500" />
            <span className="text-rose-600 font-medium">Blocked</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container with Touch Momentum */}
      <div className="w-full overflow-x-auto flex justify-start sm:justify-center bg-[#fbfcfd] rounded-xl p-2 sm:p-3 border border-black/[0.04] touch-pan-x">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full max-w-5xl h-auto select-none"
          style={{ minWidth: '740px' }}
        >
          <defs>
            {/* Caution Hazard Pattern for Blocked Aisles */}
            <pattern
              id="hazardStripeLight"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="5" height="10" fill="#fee2e2" />
              <rect x="5" width="5" height="10" fill="#ef4444" />
            </pattern>

            {/* Apple Soft Drop Shadows */}
            <filter id="appleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" floodColor="#000000" />
            </filter>
            <filter id="puckShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.18" floodColor="#000000" />
            </filter>
          </defs>

          {/* Grid Background & Floor Cells */}
          {Array.from({ length: GRID_HEIGHT }).map((_, y) =>
            Array.from({ length: GRID_WIDTH }).map((_, x) => {
              const shelf = isShelf(x, y);
              const charging = isCharging(x, y);
              const pickup = isPickup(x, y);
              const dropoff = isDropoff(x, y);
              const blocked = isBlocked(x, y);
              const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

              let fillColor = '#ffffff';
              let strokeColor = '#f1f2f4';

              if (shelf) {
                fillColor = '#eef1f5';
                strokeColor = '#cbd5e1';
              } else if (charging) {
                fillColor = '#ecfdf5';
                strokeColor = '#10b981';
              } else if (pickup) {
                fillColor = '#fffbeb';
                strokeColor = '#f59e0b';
              } else if (dropoff) {
                fillColor = '#eff6ff';
                strokeColor = '#3b82f6';
              }

              return (
                <g
                  key={`cell-${x}-${y}`}
                  onClick={() => onCellClick(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="cursor-pointer transition-colors duration-150"
                >
                  <rect
                    x={x * CELL_SIZE}
                    y={y * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill={blocked ? 'url(#hazardStripeLight)' : fillColor}
                    stroke={blocked ? '#ef4444' : isHovered ? '#0071e3' : strokeColor}
                    strokeWidth={isHovered ? 2 : 1}
                    rx="3"
                    className="transition-all"
                  />

                  {/* Cell Coordinate subtle text */}
                  {!shelf && !blocked && (
                    <text
                      x={x * CELL_SIZE + 4}
                      y={y * CELL_SIZE + 10}
                      fill="#94a3b8"
                      fontSize="7"
                      fontFamily="-apple-system, sans-serif"
                      opacity="0.65"
                    >
                      {x},{y}
                    </text>
                  )}

                  {/* Shelf Graphic Details */}
                  {shelf && (
                    <g>
                      <rect
                        x={x * CELL_SIZE + 5}
                        y={y * CELL_SIZE + 5}
                        width={CELL_SIZE - 10}
                        height={CELL_SIZE - 10}
                        rx="4"
                        fill="#e2e8f0"
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />
                      <line
                        x1={x * CELL_SIZE + 9}
                        y1={y * CELL_SIZE + CELL_SIZE / 2}
                        x2={x * CELL_SIZE + CELL_SIZE - 9}
                        y2={y * CELL_SIZE + CELL_SIZE / 2}
                        stroke="#64748b"
                        strokeWidth="1.2"
                      />
                    </g>
                  )}

                  {/* Charging Pad Icon */}
                  {charging && (
                    <g transform={`translate(${x * CELL_SIZE + 17}, ${y * CELL_SIZE + 16})`}>
                      <path
                        d="M7 0L1 8H6L4 14L11 6H6L8 0H7Z"
                        fill="#059669"
                        transform="scale(0.85)"
                      />
                    </g>
                  )}

                  {/* Pickup Station Marker */}
                  {pickup && (
                    <g transform={`translate(${x * CELL_SIZE + 14}, ${y * CELL_SIZE + 14})`}>
                      <rect
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        rx="4"
                        fill="#fef3c7"
                        stroke="#f59e0b"
                        strokeWidth="1"
                      />
                      <text
                        x="10"
                        y="14"
                        fill="#b45309"
                        fontSize="8"
                        fontWeight="700"
                        textAnchor="middle"
                        fontFamily="-apple-system, sans-serif"
                      >
                        PICK
                      </text>
                    </g>
                  )}

                  {/* Dropoff Station Marker */}
                  {dropoff && (
                    <g transform={`translate(${x * CELL_SIZE + 14}, ${y * CELL_SIZE + 14})`}>
                      <rect
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        rx="4"
                        fill="#dbeafe"
                        stroke="#2563eb"
                        strokeWidth="1"
                      />
                      <text
                        x="10"
                        y="14"
                        fill="#1d4ed8"
                        fontSize="8"
                        fontWeight="700"
                        textAnchor="middle"
                        fontFamily="-apple-system, sans-serif"
                      >
                        DROP
                      </text>
                    </g>
                  )}

                  {/* Blocked Aisle Warning */}
                  {blocked && (
                    <g transform={`translate(${x * CELL_SIZE + 14}, ${y * CELL_SIZE + 14})`}>
                      <circle cx="10" cy="10" r="11" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
                      <line x1="6" y1="6" x2="14" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                      <line x1="14" y1="6" x2="6" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              );
            })
          )}

          {/* Active Tasks Indicators (Pickup & Dropoff glow markers) */}
          {tasks
            .filter((t) => t.status === 'assigned' || t.status === 'in_progress')
            .map((task) => (
              <g key={`task-marker-${task.id}`}>
                {/* Pickup pulse */}
                <circle
                  cx={task.pickup_cell.x * CELL_SIZE + CELL_SIZE / 2}
                  cy={task.pickup_cell.y * CELL_SIZE + CELL_SIZE / 2}
                  r="19"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
                {/* Dropoff pulse */}
                <circle
                  cx={task.dropoff_cell.x * CELL_SIZE + CELL_SIZE / 2}
                  cy={task.dropoff_cell.y * CELL_SIZE + CELL_SIZE / 2}
                  r="19"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
              </g>
            ))}

          {/* Render Planned Route Breadcrumbs for each robot */}
          {robots.map((robot) => {
            if (robot.status === 'failed' || !robot.planned_path || robot.planned_path.length <= 1) {
              return null;
            }

            const points = robot.planned_path
              .map((p) => `${p.x * CELL_SIZE + CELL_SIZE / 2},${p.y * CELL_SIZE + CELL_SIZE / 2}`)
              .join(' ');

            return (
              <g key={`path-${robot.id}`}>
                {/* Path line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={robot.color || '#0071e3'}
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  opacity="0.75"
                />
                {/* Waypoint dots */}
                {robot.planned_path.map((step, idx) => (
                  <circle
                    key={`step-${robot.id}-${idx}`}
                    cx={step.x * CELL_SIZE + CELL_SIZE / 2}
                    cy={step.y * CELL_SIZE + CELL_SIZE / 2}
                    r="3.5"
                    fill={robot.color || '#0071e3'}
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity={0.9}
                  />
                ))}
              </g>
            );
          })}

          {/* Render Autonomous Mobile Robots (AMRs) */}
          {robots.map((robot) => {
            const cx = robot.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = robot.y * CELL_SIZE + CELL_SIZE / 2;
            const rotation = getHeadingRotation(robot.heading);

            const isFailed = robot.status === 'failed';
            const isWaiting = robot.status === 'waiting' || robot.status === 'blocked';
            const isCarrying = Boolean(robot.payload);

            return (
              <g
                key={`robot-${robot.id}`}
                onClick={() => onRobotClick(robot.id)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                {/* Conflict / Deadlock Alert Aura */}
                {isWaiting && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="24"
                    fill="#fef3c7"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}

                {/* Failure Red Aura */}
                {isFailed && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="25"
                    fill="#fee2e2"
                    stroke="#ef4444"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}

                {/* Main AMR Robot Body - Sleek Apple Puck */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="16"
                  fill={isFailed ? '#fef2f2' : '#ffffff'}
                  stroke={isFailed ? '#ef4444' : isWaiting ? '#f59e0b' : robot.color || '#0071e3'}
                  strokeWidth="3"
                  filter="url(#puckShadow)"
                />

                {/* Center Core */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="9"
                  fill={isFailed ? '#fee2e2' : '#f5f5f7'}
                  stroke={isFailed ? '#ef4444' : '#e5e5e7'}
                  strokeWidth="1"
                />

                {/* Heading Arrow Chevron (Rotated) */}
                <g transform={`rotate(${rotation}, ${cx}, ${cy})`}>
                  <polygon
                    points={`${cx},${cy - 12} ${cx - 4},${cy - 6} ${cx + 4},${cy - 6}`}
                    fill={isFailed ? '#ef4444' : robot.color || '#0071e3'}
                  />
                </g>

                {/* Payload Cargo Box Icon if carrying */}
                {isCarrying && (
                  <rect
                    x={cx - 4}
                    y={cy - 4}
                    width="8"
                    height="8"
                    fill="#0284c7"
                    rx="1.5"
                  />
                )}

                {/* AMR ID Badge Tag */}
                <rect
                  x={cx - 19}
                  y={cy + 19}
                  width="38"
                  height="14"
                  rx="7"
                  fill="#1d1d1f"
                  filter="url(#appleShadow)"
                />
                <text
                  x={cx}
                  y={cy + 29}
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="-apple-system, sans-serif"
                >
                  {robot.id}
                </text>

                {/* Battery Bar Mini */}
                <rect
                  x={cx - 13}
                  y={cy + 35}
                  width="26"
                  height="3"
                  rx="1.5"
                  fill="#e5e7eb"
                />
                <rect
                  x={cx - 13}
                  y={cy + 35}
                  width={Math.max(2, (robot.battery / 100) * 26)}
                  height="3"
                  rx="1.5"
                  fill={robot.battery > 30 ? '#10b981' : '#ef4444'}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Helper */}
      <div className="flex flex-wrap items-center justify-between mt-3 text-xs text-[#86868b]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Click any aisle cell to place or remove a temporary obstacle block.</span>
        </div>
        <div>
          <span>Click any AMR puck to simulate a localized hardware fault.</span>
        </div>
      </div>
    </div>
  );
};
