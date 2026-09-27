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
    <div className="bg-white rounded-[28px] border border-[#e5e5e5] shadow-xs p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#737373] uppercase">
            <span>P2P Consensus Breakdown</span>
            <span title="Simulated P2P/MQTT Message Layer (Supabase Realtime DB)">
              <Info className="w-3 h-3 text-[#a3a3a3]" />
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#faf5e8] border border-[#e5e5e5] px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#1a3a3a] animate-pulse" />
            <span className="text-[10px] font-mono text-[#0a0a0a] font-semibold">Simulated P2P</span>
          </div>
        </div>

        {/* Speedup Metric */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-[#737373] block mb-0.5">Speedup vs Baseline:</span>
            <div className="text-3xl font-extrabold tracking-tight text-[#0a0a0a]">
              +{metrics.speedupPercentage}%
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#525252] bg-[#faf5e8] border border-[#e5e5e5] px-2.5 py-1 rounded-full font-medium">
            <span>Cycle Latency</span>
            <ChevronDown className="w-3 h-3 text-[#737373]" />
          </div>
        </div>

        {/* Clay AI Insight Capsule Banner */}
        <button
          onClick={() => setShowAiModal(!showAiModal)}
          className="w-full mb-4 flex items-center justify-between p-2.5 rounded-2xl bg-[#faf5e8] hover:bg-[#f5eed9] border border-[#e5e5e5] transition-all group text-left shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#0a0a0a] flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#faf5e8]" />
            </div>
            <span className="text-xs font-semibold text-[#0a0a0a] group-hover:text-[#1a3a3a] transition-colors">
              Get AI insight for fleet bottlenecks
            </span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#0a0a0a] transition-colors" />
        </button>

        {/* AI Insight Drawer with 1-tap optimization */}
        {showAiModal && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#faf5e8] border border-[#ffb084] text-xs text-[#0a0a0a] animate-in fade-in duration-200 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between font-bold text-[#0a0a0a]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1a3a3a]" />
                <span>Synro Fleet Copilot</span>
              </div>
              <span className="text-[10px] text-[#1a3a3a] font-mono font-bold bg-[#a4d4c5]/40 px-2 py-0.5 rounded-full">Live Rec</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#525252]">
              Decentralized yield protocol predicted a potential corridor bottleneck in Aisle 2.
              Applying proactive spatial reservation will save <strong>4.8 seconds</strong> on the next 3 delivery cycles.
            </p>

            <button
              onClick={handleApply}
              disabled={hasAppliedOptimization}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                hasAppliedOptimization
                  ? 'bg-[#1a3a3a] text-white'
                  : 'bg-[#0a0a0a] hover:bg-[#262626] text-white active:scale-98'
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
                    className="w-2 bg-[#0a0a0a] rounded-t-sm group-hover:bg-[#1a3a3a] transition-colors"
                    title={`Decentralized: ${item.decentralized}s`}
                  />
                  {/* Baseline Bar (Warm grey) */}
                  <div
                    style={{ height: `${(item.baseline / 30) * 100}%` }}
                    className="w-1.5 bg-[#e5e5e5] rounded-t-sm group-hover:bg-[#d4d4d4] transition-colors"
                    title={`Stop-and-Wait: ${item.baseline}s`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Time axis range */}
          <div className="flex items-center justify-between text-[10px] text-[#737373] mt-2 pt-2 border-t border-[#e5e5e5]">
            <span>Cycle 1</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-[2px] bg-[#0a0a0a]" /> P2P Edge
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-[2px] bg-[#e5e5e5]" /> Baseline
              </span>
            </div>
            <span>Cycle 10</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Button */}
      <div className="pt-3 border-t border-[#e5e5e5] mt-2">
        <button
          onClick={onToggleBaseline}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
            isDecentralized
              ? 'bg-[#faf5e8] text-[#0a0a0a] border-[#e5e5e5] hover:border-[#0a0a0a]'
              : 'bg-[#ffb084] text-[#0a0a0a] border-[#0a0a0a] shadow-xs'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Mode: {isDecentralized ? 'Decentralized P2P Active' : 'Stop-and-Wait Baseline'}</span>
        </button>
      </div>
    </div>
  );
};
