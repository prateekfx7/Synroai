'use client';

import React from 'react';
import { RobotState } from '@/types/warehouse';
import {
  Battery,
  Navigation,
  Package,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface RobotCardProps {
  robot: RobotState;
  onToggleFailure: (robotId: string) => void;
}

export const RobotCard: React.FC<RobotCardProps> = ({ robot, onToggleFailure }) => {
  const isFailed = robot.status === 'failed';
  const isWaiting = robot.status === 'waiting' || robot.status === 'blocked';
  const isMoving = robot.status === 'moving';

  const getStatusBadge = () => {
    if (isFailed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          Hardware Fault
        </span>
      );
    }
    if (isWaiting) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Yielding / P2P
        </span>
      );
    }
    if (isMoving) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En Route
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
        Standby
      </span>
    );
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 bg-white ${
        isFailed
          ? 'border-rose-300 shadow-[0_4px_16px_rgba(244,63,94,0.1)]'
          : isWaiting
          ? 'border-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.08)]'
          : 'border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: robot.color || '#0071e3' }}
          />
          <div>
            <h3 className="text-xs font-bold text-[#1d1d1f] tracking-tight">
              {robot.id}
            </h3>
            <p className="text-[10px] text-[#86868b]">{robot.name}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        {/* Position & Heading */}
        <div className="bg-[#f5f6f8] p-2.5 rounded-xl border border-black/[0.04]">
          <span className="text-[10px] text-[#86868b] font-medium block mb-0.5">LOCATION</span>
          <div className="flex items-center justify-between text-[#1d1d1f] font-mono">
            <span>({robot.x}, {robot.y})</span>
            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-black/[0.06] text-[#1d1d1f] font-bold">
              {robot.heading}
            </span>
          </div>
        </div>

        {/* Battery */}
        <div className="bg-[#f5f6f8] p-2.5 rounded-xl border border-black/[0.04]">
          <span className="text-[10px] text-[#86868b] font-medium block mb-0.5">BATTERY</span>
          <div className="flex items-center justify-between text-[#1d1d1f] font-mono">
            <span>{Math.round(robot.battery)}%</span>
            <Battery
              className={`w-3.5 h-3.5 ${
                robot.battery > 30 ? 'text-emerald-600' : 'text-rose-600 animate-pulse'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Task & Payload Status */}
      <div className="bg-[#f5f6f8] p-2.5 rounded-xl border border-black/[0.04] text-xs mb-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#86868b]">MISSION</span>
          <span className="text-[#1d1d1f] font-semibold text-[11px]">
            {robot.current_task_id || 'Idle'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#86868b]">PAYLOAD</span>
          <span className="text-[#1d1d1f] flex items-center gap-1 text-[11px]">
            {robot.payload ? (
              <>
                <Package className="w-3 h-3 text-[#0071e3]" />
                <span>{robot.payload}</span>
              </>
            ) : (
              <span className="text-[#a1a1a6]">None</span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#86868b]">WAYPOINTS</span>
          <span className="text-[#6e6e73] font-mono text-[11px]">
            {robot.planned_path?.length > 1 ? `${robot.planned_path.length - 1} steps` : '0'}
          </span>
        </div>
      </div>

      {/* Fault Injection Button */}
      <button
        onClick={() => onToggleFailure(robot.id)}
        className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
          isFailed
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
        }`}
      >
        {isFailed ? (
          <>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reboot Node</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Fault</span>
          </>
        )}
      </button>
    </div>
  );
};
