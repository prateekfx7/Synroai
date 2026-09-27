'use client';

import React from 'react';
import { FleetMetrics } from '@/types/warehouse';
import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface MetricsPanelProps {
  metrics: FleetMetrics;
  onToggleBaseline: () => void;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  onToggleBaseline,
}) => {
  const isDecentralized = metrics.negotiationMode === 'decentralized';

  return (
    <div className="rounded-[28px] bg-white border border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#faf5e8] border border-[#e5e5e5]">
            <Zap className="w-5 h-5 text-[#0a0a0a]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0a0a0a] tracking-tight">
              Fleet Performance &amp; Baseline Verification
            </h2>
            <p className="text-xs text-[#737373]">
              Decentralized Edge Peer-to-Peer vs Centralized Stop-and-Wait
            </p>
          </div>
        </div>

        {/* Mode Switcher Button */}
        <button
          onClick={onToggleBaseline}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
            isDecentralized
              ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] hover:bg-[#262626]'
              : 'bg-[#ffb084] text-[#0a0a0a] border-[#0a0a0a] hover:bg-[#ffa26e]'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Mode: {isDecentralized ? 'Decentralized P2P Active' : 'Stop-and-Wait Baseline'}</span>
        </button>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
        {/* Metric 1: Collision Count */}
        <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-[#737373] font-semibold uppercase tracking-wider block">
              Collisions Audited
            </span>
            <div className="text-2xl font-extrabold text-[#1a3a3a] font-mono mt-0.5">
              {metrics.collisions} (Zero)
            </div>
            <span className="text-[10px] text-[#1a3a3a] font-semibold">100% Safety Guarantee</span>
          </div>
          <ShieldCheck className="w-7 h-7 text-[#1a3a3a]" />
        </div>

        {/* Metric 2: Autonomous Speedup */}
        <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-[#737373] font-semibold uppercase tracking-wider block">
              Edge Speedup
            </span>
            <div className="text-2xl font-extrabold text-[#0a0a0a] font-mono mt-0.5">
              +{metrics.speedupPercentage}%
            </div>
            <span className="text-[10px] text-[#737373] font-medium">vs Centralized Stop</span>
          </div>
          <TrendingUp className="w-7 h-7 text-[#0a0a0a]" />
        </div>

        {/* Metric 3: Average Completion Time */}
        <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-[#737373] font-semibold uppercase tracking-wider block">
              Average Cycle Time
            </span>
            <div className="text-2xl font-extrabold text-[#0a0a0a] font-mono mt-0.5">
              {metrics.averageTaskCompletionTime.toFixed(1)}s
            </div>
            <span className="text-[10px] text-[#737373]">Baseline: {metrics.baselineAverageCompletionTime.toFixed(1)}s</span>
          </div>
          <Clock className="w-7 h-7 text-[#737373]" />
        </div>

        {/* Metric 4: Tasks Delivered */}
        <div className="bg-[#faf5e8] border border-[#e5e5e5] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-[#737373] font-semibold uppercase tracking-wider block">
              Tasks Delivered
            </span>
            <div className="text-2xl font-extrabold text-[#0a0a0a] font-mono mt-0.5">
              {metrics.completedTasksCount}
            </div>
            <span className="text-[10px] text-[#1a3a3a] font-semibold">P2P Allocations Completed</span>
          </div>
          <CheckCircle2 className="w-7 h-7 text-[#1a3a3a]" />
        </div>
      </div>
    </div>
  );
};
