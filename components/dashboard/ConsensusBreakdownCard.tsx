'use client';

import React, { useState } from 'react';
import { Info, Sparkles, ChevronDown, CheckCircle2, Zap, ArrowUpRight, Check } from 'lucide-react';
import { FleetMetrics } from '@/types/warehouse';

interface ConsensusBreakdownCardProps {
  metrics: FleetMetrics;
  onToggleBaseline: () => void;
  onApplyOptimization?: () => void;
}

export const ConsensusBreakdownCard: React.FC<ConsensusBreakdownCardProps> = ({
  metrics,
  onToggleBaseline,
  onApplyOptimization,
}) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [hasAppliedOptimization, setHasAppliedOptimization] = useState(false);
  const isDecentralized = metrics.negotiationMode === 'decentralized';

  const barData = [
    { label: 'C1', decentralized: 16.2, baseline: 25.1 },
    { label: 'C2', decentralized: 17.0, baseline: 24.8 },
    { label: 'C3', decentralized: 18.4, baseline: 26.3 },
    { label: 'C4', decentralized: 15.9, baseline: 23.9 },
    { label: 'C5', decentralized: 17.5, baseline: 25.4 },
    { label: 'C6', decentralized: 19.1, baseline: 27.2 },
    { label: 'C7', decentralized: 16.8, baseline: 24.6 },
    { label: 'C8', decentralized: 17.4, baseline: 25.0 },
    { label: 'C9', decentralized: 18.0, baseline: 26.1 },
    { label: 'C10', decentralized: 17.1, baseline: 24.9 },
  ];

  const handleApply = () => {
    if (onApplyOptimization) onApplyOptimization();
    setHasAppliedOptimization(true);
    setTimeout(() => setHasAppliedOptimization(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between h-full">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#86868b] uppercase">
            <span>Mesh Consensus Breakdown</span>
            <Info className="w-3 h-3 text-[#a1a1a6]" />
          </div>
          <div className="flex items-center gap-1.5 bg-[#f5f5f7] border border-black/[0.04] px-2 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-[#1d1d1f] font-medium">Edge P2P</span>
          </div>
        </div>

        {/* Speedup Metric */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-[#86868b] block mb-0.5">Speedup vs Baseline:</span>
            <div className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
              +{metrics.speedupPercentage}%
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#6e6e73] bg-[#f5f5f7] border border-black/[0.04] px-2.5 py-1 rounded-full">
            <span>Cycle Latency</span>
            <ChevronDown className="w-3 h-3 text-[#86868b]" />
          </div>
        </div>

        {/* Apple AI Insight Capsule Banner - matching reference image */}
        <button
          onClick={() => setShowAiModal(!showAiModal)}
          className="w-full mb-4 flex items-center justify-between p-2.5 rounded-xl bg-[#f5f6f8] hover:bg-[#eef0f3] border border-black/[0.06] transition-all group text-left shadow-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
              Get AI insight for fleet bottlenecks
            </span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0071e3] transition-colors" />
        </button>

        {/* AI Insight Drawer with 1-tap optimization */}
        {showAiModal && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 border border-blue-200/80 text-xs text-neutral-700 animate-in fade-in duration-200 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between font-semibold text-blue-900">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Apple Intelligence Fleet Copilot</span>
              </div>
              <span className="text-[10px] text-blue-600 font-mono">Live Rec</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#475569]">
              Decentralized yield protocol predicted a potential corridor bottleneck in Aisle 2.
              Applying proactive spatial reservation will save <strong>4.8 seconds</strong> on the next 3 delivery cycles.
            </p>

            <button
              onClick={handleApply}
              disabled={hasAppliedOptimization}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                hasAppliedOptimization
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0071e3] hover:bg-[#0077ed] text-white active:scale-98'
              }`}
            >
              {hasAppliedOptimization ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Optimization Applied Live</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Autonomous Optimization</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Vertical Bar Chart matching the image */}
        <div className="relative pt-2 pb-2">
          <div className="h-32 flex items-end justify-between gap-2 px-1">
            {barData.map((item, idx) => (
              <div key={item.label} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Decentralized Bar (Dark) */}
                  <div
                    style={{ height: `${(item.decentralized / 30) * 100}%` }}
                    className="w-2 bg-[#1d1d1f] rounded-t-sm group-hover:bg-[#0071e3] transition-colors"
                    title={`Decentralized: ${item.decentralized}s`}
                  />
                  {/* Baseline Bar (Light Grey) */}
                  <div
                    style={{ height: `${(item.baseline / 30) * 100}%` }}
                    className="w-1.5 bg-[#e5e5e7] rounded-t-sm group-hover:bg-[#cbd5e1] transition-colors"
                    title={`Stop-and-Wait: ${item.baseline}s`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Time axis range */}
          <div className="flex items-center justify-between text-[10px] text-[#86868b] mt-2 pt-2 border-t border-black/[0.04]">
            <span>Cycle 1</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-[2px] bg-[#1d1d1f]" /> P2P Edge
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-[2px] bg-[#e5e5e7]" /> Baseline
              </span>
            </div>
            <span>Cycle 10</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Button */}
      <div className="pt-3 border-t border-black/[0.04] mt-2">
        <button
          onClick={onToggleBaseline}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
            isDecentralized
              ? 'bg-[#f5f6f8] text-[#1d1d1f] border-black/[0.08] hover:bg-[#eceef2]'
              : 'bg-amber-500 text-white border-amber-600 shadow-sm'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Mode: {isDecentralized ? 'Decentralized P2P Active' : 'Stop-and-Wait Baseline'}</span>
        </button>
      </div>
    </div>
  );
};
