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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fee2e2] text-[#b91c1c] border border-[#ef4444]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
          Hardware Fault
        </span>
      );
    }
    if (isWaiting) {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffb084]/30 text-[#0a0a0a] border border-[#ffb084]"
          title="Space-time reservation conflict avoidance active"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b5a] animate-pulse" />
          A* Yielding
        </span>
      );
    }
    if (isMoving) {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#a4d4c5]/40 text-[#0a0a0a] border border-[#a4d4c5]"
          title="Navigating via A* Routing with Space-Time Reservation"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          A* En Route
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#faf5e8] text-[#6a6a6a] border border-[#e5e5e5]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9a9a9a]" />
        Standby
      </span>
    );
  };

  return (
    <div
      className={`rounded-[24px] border p-4 transition-all duration-200 bg-white ${
        isFailed
          ? 'border-[#ff4d8b] shadow-[0_4px_16px_rgba(255,77,139,0.15)]'
          : isWaiting
          ? 'border-[#ffb084] shadow-[0_4px_16px_rgba(255,176,132,0.15)]'
          : 'border-[#e5e5e5] shadow-xs hover:border-[#0a0a0a]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
            style={{ backgroundColor: robot.color || '#0a0a0a' }}
          />
          <div>
            <h3 className="text-xs font-black text-[#0a0a0a] tracking-tight">
              {robot.id}
            </h3>
            <p className="text-[10px] text-[#6a6a6a] font-medium">{robot.name}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        {/* Position & Heading */}
        <div className="bg-[#faf5e8] p-2.5 rounded-xl border border-[#e5e5e5]">
          <span className="text-[10px] text-[#6a6a6a] font-bold block mb-0.5 uppercase tracking-wider">LOCATION</span>
          <div className="flex items-center justify-between text-[#0a0a0a] font-mono">
            <span>({robot.x}, {robot.y})</span>
            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-[#e5e5e5] text-[#0a0a0a] font-bold">
              {robot.heading}
            </span>
          </div>
        </div>

        {/* Battery */}
        <div className="bg-[#faf5e8] p-2.5 rounded-xl border border-[#e5e5e5]">
          <span className="text-[10px] text-[#6a6a6a] font-bold block mb-0.5 uppercase tracking-wider">BATTERY</span>
          <div className="flex items-center justify-between text-[#0a0a0a] font-mono">
            <span>{Math.round(robot.battery)}%</span>
            <Battery
              className={`w-3.5 h-3.5 ${
                robot.battery > 30 ? 'text-[#22c55e]' : 'text-[#ef4444] animate-pulse'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Task & Payload Status */}
      <div className="bg-[#faf5e8] p-2.5 rounded-xl border border-[#e5e5e5] text-xs mb-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#6a6a6a] font-semibold">MISSION</span>
          <span className="text-[#0a0a0a] font-bold text-[11px]">
            {robot.current_task_id || 'Idle'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#6a6a6a] font-semibold">PAYLOAD</span>
          <span className="text-[#0a0a0a] flex items-center gap-1 text-[11px] font-medium">
            {robot.payload ? (
              <>
                <Package className="w-3 h-3 text-[#1a3a3a]" />
                <span>{robot.payload}</span>
              </>
            ) : (
              <span className="text-[#9a9a9a]">None</span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#6a6a6a] font-semibold" title="A* Routing with Space-Time Collision Reservation">
            A* ROUTE (SPACE-TIME)
          </span>
          <span className="text-[#0a0a0a] font-mono text-[11px] font-bold">
            {robot.planned_path?.length > 1 ? `${robot.planned_path.length - 1} steps` : '0 steps'}
          </span>
        </div>
      </div>

      {/* Fault Injection Button */}
      <button
        onClick={() => onToggleFailure(robot.id)}
        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
          isFailed
            ? 'bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white'
            : 'bg-[#fee2e2]/60 hover:bg-[#fee2e2] text-[#b91c1c] border border-[#ef4444]/30'
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
