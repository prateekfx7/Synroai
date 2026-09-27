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
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">
            Simulation Control & Demo Scenarios
          </h2>
        </div>

        {/* Playback & Speed Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {[1, 2, 3].map((speed) => (
              <button
                key={`speed-${speed}`}
                onClick={() => onSetSpeed(speed)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  speedMultiplier === speed
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Demo Scenario Action Triggers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {/* Scenario 1: Force Intersection Conflict */}
        <button
          onClick={onForceConflict}
          className="group relative flex flex-col items-start p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/20 transition-all text-left"
        >
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-2 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 block mb-0.5">
            1. Force Conflict
          </span>
          <span className="text-[10px] text-slate-400 leading-tight">
            Commands AMR-01 & 02 to cross paths at intersection
          </span>
        </button>

        {/* Scenario 2: Block Warehouse Aisle */}
        <button
          onClick={onBlockAisle}
          className="group relative flex flex-col items-start p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/60 hover:bg-red-950/20 transition-all text-left"
        >
          <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 mb-2 group-hover:scale-110 transition-transform">
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 block mb-0.5">
            2. Block Aisle
          </span>
          <span className="text-[10px] text-slate-400 leading-tight">
            Injects barrier at (9, 5); watch robots replan live
          </span>
        </button>

        {/* Scenario 3: Fail Robot */}
        <button
          onClick={onFailRobot}
          className="group relative flex flex-col items-start p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left"
        >
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-2 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 block mb-0.5">
            3. Simulate Failure
          </span>
          <span className="text-[10px] text-slate-400 leading-tight">
            Cuts AMR heartbeat; peers re-auction its task
          </span>
        </button>

        {/* Scenario 4: Spawn New Task */}
        <button
          onClick={onSpawnTask}
          className="group relative flex flex-col items-start p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 transition-all text-left"
        >
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-2 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 block mb-0.5">
            4. Spawn Task
          </span>
          <span className="text-[10px] text-slate-400 leading-tight">
            Creates new order; triggers peer auction bidding
          </span>
        </button>

        {/* Scenario 5: Toggle Baseline Benchmark */}
        <button
          onClick={onToggleBaseline}
          className="group relative flex flex-col items-start p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/20 transition-all text-left"
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-2 group-hover:scale-110 transition-transform">
            <GitCompare className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 block mb-0.5">
            5. Baseline Mode
          </span>
          <span className="text-[10px] text-slate-400 leading-tight">
            Toggle naive stop-and-wait to demonstrate ≥20% speedup
          </span>
        </button>
      </div>
    </div>
  );
};
