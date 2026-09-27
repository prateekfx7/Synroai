'use client';

import React from 'react';
import {
  X,
  Battery,
  Navigation,
  Package,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { RobotState, WarehouseTask } from '@/types/warehouse';

interface RobotInspectorDrawerProps {
  robot: RobotState | null;
  onClose: () => void;
  onToggleFailure: (robotId: string) => void;
  tasks: WarehouseTask[];
}

export const RobotInspectorDrawer: React.FC<RobotInspectorDrawerProps> = ({
  robot,
  onClose,
  onToggleFailure,
  tasks,
}) => {
  if (!robot) return null;

  const isFailed = robot.status === 'failed';
  const isWaiting = robot.status === 'waiting' || robot.status === 'blocked';
  const currentTask = tasks.find((t) => t.id === robot.current_task_id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-black/[0.08] p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm font-bold text-sm"
                style={{ backgroundColor: robot.color || '#0071e3' }}
              >
                {robot.id.replace('AMR-', '')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1d1d1f]">{robot.id}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isFailed
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isWaiting
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {robot.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#86868b]">{robot.name}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
              <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider block mb-1">
                Coordinates
              </span>
              <p className="text-lg font-bold text-[#1d1d1f] font-mono">
                ({robot.x}, {robot.y})
              </p>
              <span className="text-[11px] text-[#6e6e73]">Heading: {robot.heading}</span>
            </div>

            <div className="p-3.5 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
              <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider block mb-1">
                Battery Level
              </span>
              <p className="text-lg font-bold text-[#1d1d1f] font-mono">
                {Math.round(robot.battery)}%
              </p>
              <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    robot.battery > 40
                      ? 'bg-emerald-500'
                      : robot.battery > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${robot.battery}%` }}
                />
              </div>
            </div>
          </div>

          {/* Assigned Mission Information */}
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1d1d1f]">Assigned Mission</span>
              <span className="text-[10px] font-mono text-[#0071e3] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                {robot.current_task_id || 'IDLE'}
              </span>
            </div>
            {currentTask ? (
              <div className="text-xs text-[#6e6e73] space-y-1 pt-1">
                <p>
                  <strong>Pickup Station:</strong> ({currentTask.pickup_cell.x},{' '}
                  {currentTask.pickup_cell.y})
                </p>
                <p>
                  <strong>Dropoff Dock:</strong> ({currentTask.dropoff_cell.x},{' '}
                  {currentTask.dropoff_cell.y})
                </p>
                <p>
                  <strong>Payload:</strong> {robot.payload || 'Standard Pallet #402'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#86868b] pt-1">
                No active assignment. Autonomous auction engine will allocate on task broadcast.
              </p>
            )}
          </div>

          {/* Planned Space-Time Waypoints */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1d1d1f]">
                Planned Space-Time Path ({robot.planned_path?.length || 0} Steps)
              </span>
              <span className="text-[10px] text-[#86868b]">Horizon = 12</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 bg-[#fafafa] p-2.5 rounded-2xl border border-black/[0.04] text-xs font-mono text-[#6e6e73]">
              {robot.planned_path && robot.planned_path.length > 0 ? (
                robot.planned_path.map((step, idx) => (
                  <div
                    key={`step-${idx}`}
                    className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-neutral-100"
                  >
                    <span>Step {idx + 1}</span>
                    <span className="font-bold text-[#1d1d1f]">
                      ({step.x}, {step.y})
                    </span>
                    <span className="text-[10px] text-[#86868b]">t+{step.t || idx}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[#a1a1a6]">No waypoints queued</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-black/[0.06] space-y-2">
          <button
            onClick={() => onToggleFailure(robot.id)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isFailed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            {isFailed ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Recover / Reboot AMR</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Hardware Disruption</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
