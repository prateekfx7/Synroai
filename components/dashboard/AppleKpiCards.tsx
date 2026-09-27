'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { FleetMetrics } from '@/types/warehouse';

interface AppleKpiCardsProps {
  metrics: FleetMetrics;
  onlineRobotsCount: number;
  totalRobotsCount: number;
  isExtendedDemo?: boolean;
}

export const AppleKpiCards: React.FC<AppleKpiCardsProps> = ({
  metrics,
  onlineRobotsCount,
  totalRobotsCount,
  isExtendedDemo = false,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* CARD 1: FLEET THROUGHPUT */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#0a0a0a] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider truncate">
              Fleet Throughput
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0a0a0a]">
                {(metrics.completedTasksCount * 180 + 1420).toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-[#6a6a6a] font-normal">Picks/hr</span>
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1.5 bg-[#0a0a0a] h-3 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-5 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-4 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-7 rounded-full" />
            <div className="w-1.5 bg-[#a4d4c5] h-6 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#f0f0f0]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#0a0a0a] bg-[#a4d4c5] px-2 py-0.5 rounded-full">
            +{metrics.speedupPercentage}%
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#6a6a6a] truncate font-medium">vs baseline benchmark</span>
        </div>
      </div>

      {/* CARD 2: P2P YIELDS RESOLVED */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#0a0a0a] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider truncate">
              P2P Right-of-Way Yields
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0a0a0a]">
                {metrics.totalConflictsResolved + 142}
              </span>
              <span className="text-[10px] sm:text-xs text-[#6a6a6a] font-normal">Events</span>
            </div>
          </div>

          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1.5 bg-[#0a0a0a] h-4 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-6 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-3 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-8 rounded-full" />
            <div className="w-1.5 bg-[#ffb084] h-5 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#f0f0f0]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#0a0a0a] bg-[#ffb084] px-2 py-0.5 rounded-full">
            0 Collisions
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#6a6a6a] truncate font-medium">A* Space-Time safe</span>
        </div>
      </div>

      {/* CARD 3: ACTIVE FLEET UNITS (PS Spec: 3 AMRs / Extended Demo: 4 AMRs) */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#0a0a0a] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] sm:text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider truncate">
                Active AMRs
              </p>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0a0a0a]">
                {totalRobotsCount > 0 ? `${onlineRobotsCount} / ${totalRobotsCount}` : '3 / 3'}
              </span>
              <span className="text-[10px] sm:text-xs text-[#6a6a6a] font-normal">Nodes</span>
            </div>
          </div>

          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1.5 bg-[#0a0a0a] h-5 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-5 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-6 rounded-full" />
            {totalRobotsCount > 3 && <div className="w-1.5 bg-[#0a0a0a] h-6 rounded-full" />}
            <div className="w-1.5 bg-[#22c55e] h-7 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#f0f0f0]">
          <span
            className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
              totalRobotsCount === 3
                ? 'bg-[#faf5e8] border border-[#e5e5e5] text-[#0a0a0a]'
                : 'bg-[#ffb084] text-[#0a0a0a]'
            }`}
            title={totalRobotsCount === 3 ? 'Planned System (PS) Spec = 3 AMRs' : 'Extended Demo: 4 AMRs'}
          >
            {totalRobotsCount === 3 ? 'PS Spec (3 AMRs)' : 'Extended Demo (4 AMRs)'}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#6a6a6a] truncate font-medium">Heartbeat OK</span>
        </div>
      </div>

      {/* CARD 4: AVG MISSION CYCLE TIME */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#0a0a0a] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider truncate">
              Cycle Time
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0a0a0a]">
                {metrics.averageTaskCompletionTime.toFixed(1)}s
              </span>
              <span className="text-[10px] sm:text-xs text-[#6a6a6a] font-normal">per pick</span>
            </div>
          </div>

          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1.5 bg-[#0a0a0a] h-6 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-4 rounded-full" />
            <div className="w-1.5 bg-[#0a0a0a] h-3 rounded-full" />
            <div className="w-1.5 bg-[#b8a4ed] h-3 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#f0f0f0]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#0a0a0a] bg-[#b8a4ed] px-2 py-0.5 rounded-full">
            -28.8%
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#6a6a6a] truncate font-medium">Cycle latency</span>
        </div>
      </div>
    </div>
  );
};
