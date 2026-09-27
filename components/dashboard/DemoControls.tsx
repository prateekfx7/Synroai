'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  AlertOctagon,
  ShieldAlert,
  PlusCircle,
  Gauge,
  GitCompare,
} from 'lucide-react';

interface DemoControlsProps {
  isRunning: boolean;
  speedMultiplier: number;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
  onForceConflict: () => void;
  onBlockAisle: () => void;
  onFailRobot: () => void;
  onSpawnTask: () => void;
  onToggleBaseline: () => void;
  onReset: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  isRunning,
  speedMultiplier,
  onTogglePlay,
  onSetSpeed,
  onForceConflict,
  onBlockAisle,
  onFailRobot,
  onSpawnTask,
  onToggleBaseline,
  onReset,
}) => {
  return (
    <div className="rounded-[28px] bg-white border border-[#e5e5e5] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#1a3a3a] animate-pulse" />
          <h2 className="text-xs font-bold tracking-wider text-[#0a0a0a] uppercase">
            Simulation Control &amp; Demo Scenarios
          </h2>
        </div>

        {/* Playback & Speed Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              isRunning
                ? 'bg-[#ffb084] hover:bg-[#ffa26e] text-[#0a0a0a]'
                : 'bg-[#0a0a0a] hover:bg-[#262626] text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume
              </>
            )}
          </button>

          {/* Speed Pills */}
          <div className="flex items-center bg-[#faf5e8] border border-[#e5e5e5] rounded-xl p-0.5 text-xs font-mono">
            {[1, 2, 3].map((speed) => (
              <button
                key={`speed-${speed}`}
                onClick={() => onSetSpeed(speed)}
                className={`px-2.5 py-1 rounded-lg transition-colors font-semibold ${
                  speedMultiplier === speed
                    ? 'bg-[#0a0a0a] text-white'
                    : 'text-[#737373] hover:text-[#0a0a0a]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#faf5e8] hover:bg-[#f5eed9] text-[#0a0a0a] border border-[#e5e5e5] rounded-xl text-xs font-semibold transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#737373]" />
            Reset
          </button>
        </div>
      </div>

      {/* Demo Scenario Action Triggers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Scenario 1: Force Intersection Conflict */}
        <button
          onClick={onForceConflict}
          className="group relative flex flex-col items-start p-3.5 rounded-2xl bg-[#faf5e8] border border-[#e5e5e5] hover:border-[#ffb084] hover:bg-[#ffb084]/15 transition-all text-left shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-[#ffb084]/30 text-[#0a0a0a] mb-2 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-[#d97706]" />
          </div>
          <span className="text-xs font-bold text-[#0a0a0a] block mb-0.5">
            1. Force Conflict
          </span>
          <span className="text-[11px] text-[#737373] leading-tight">
            AMR-01 &amp; 02 cross paths at intersection via A*
          </span>
        </button>

        {/* Scenario 2: Block Warehouse Aisle */}
        <button
          onClick={onBlockAisle}
          className="group relative flex flex-col items-start p-3.5 rounded-2xl bg-[#faf5e8] border border-[#e5e5e5] hover:border-[#ff6b5a] hover:bg-[#ff6b5a]/15 transition-all text-left shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-[#ff6b5a]/25 text-[#991b1b] mb-2 group-hover:scale-105 transition-transform">
            <AlertOctagon className="w-4 h-4 text-[#ff6b5a]" />
          </div>
          <span className="text-xs font-bold text-[#0a0a0a] block mb-0.5">
            2. Block Aisle
          </span>
          <span className="text-[11px] text-[#737373] leading-tight">
            Barrier at (9, 5); watch robots replan with A*
          </span>
        </button>

        {/* Scenario 3: Fail Robot */}
        <button
          onClick={onFailRobot}
          className="group relative flex flex-col items-start p-3.5 rounded-2xl bg-[#faf5e8] border border-[#e5e5e5] hover:border-[#b8a4ed] hover:bg-[#b8a4ed]/25 transition-all text-left shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-[#b8a4ed]/30 text-[#4c1d95] mb-2 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4 text-[#7c3aed]" />
          </div>
          <span className="text-xs font-bold text-[#0a0a0a] block mb-0.5">
            3. Simulate Failure
          </span>
          <span className="text-[11px] text-[#737373] leading-tight">
            Heartbeat lost; triggers task handoff &amp; reassignment
          </span>
        </button>

        {/* Scenario 4: Spawn New Task */}
        <button
          onClick={onSpawnTask}
          className="group relative flex flex-col items-start p-3.5 rounded-2xl bg-[#faf5e8] border border-[#e5e5e5] hover:border-[#a4d4c5] hover:bg-[#a4d4c5]/25 transition-all text-left shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-[#a4d4c5]/35 text-[#1a3a3a] mb-2 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-4 h-4 text-[#1a3a3a]" />
          </div>
          <span className="text-xs font-bold text-[#0a0a0a] block mb-0.5">
            4. Spawn Task
          </span>
          <span className="text-[11px] text-[#737373] leading-tight">
            Creates order; triggers priority-formula allocation
          </span>
        </button>

        {/* Scenario 5: Toggle Baseline Benchmark */}
        <button
          onClick={onToggleBaseline}
          className="group relative flex flex-col items-start p-3.5 rounded-2xl bg-[#faf5e8] border border-[#e5e5e5] hover:border-[#0a0a0a] hover:bg-white transition-all text-left shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-[#0a0a0a] text-white mb-2 group-hover:scale-105 transition-transform">
            <GitCompare className="w-4 h-4 text-[#faf5e8]" />
          </div>
          <span className="text-xs font-bold text-[#0a0a0a] block mb-0.5">
            5. Baseline Mode
          </span>
          <span className="text-[11px] text-[#737373] leading-tight">
            Toggle naive stop-and-wait to demonstrate ≥20% speedup
          </span>
        </button>
      </div>
    </div>
  );
};
