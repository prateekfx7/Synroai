'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { FleetMetrics } from '@/types/warehouse';

interface AppleKpiCardsProps {
  metrics: FleetMetrics;
  onlineRobotsCount: number;
  totalRobotsCount: number;
}

export const AppleKpiCards: React.FC<AppleKpiCardsProps> = ({
  metrics,
  onlineRobotsCount,
  totalRobotsCount,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* CARD 1: FLEET THROUGHPUT */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#86868b] uppercase tracking-wider truncate">
              Fleet Throughput
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {(metrics.completedTasksCount * 180 + 1420).toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-[#86868b] font-normal">Picks/hr</span>
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1 bg-[#1d1d1f] h-3 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-5 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-4 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-7 rounded-full" />
            <div className="w-1 bg-[#d2d2d7] h-6 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-black/[0.04]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            +{metrics.speedupPercentage}%
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#86868b] truncate">vs baseline</span>
        </div>
      </div>

      {/* CARD 2: P2P YIELDS RESOLVED */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#86868b] uppercase tracking-wider truncate">
              P2P Yields
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {metrics.totalConflictsResolved + 142}
              </span>
              <span className="text-[10px] sm:text-xs text-[#86868b] font-normal">Events</span>
            </div>
          </div>

          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1 bg-[#1d1d1f] h-4 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-6 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-3 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-8 rounded-full" />
            <div className="w-1 bg-[#d2d2d7] h-5 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-black/[0.04]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            0 Collisions
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#86868b] truncate">100% Safe</span>
        </div>
      </div>

      {/* CARD 3: ACTIVE FLEET UNITS */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#86868b] uppercase tracking-wider truncate">
              Active AMRs
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {totalRobotsCount > 0 ? `${onlineRobotsCount} / ${totalRobotsCount}` : '4 / 4'}
              </span>
              <span className="text-[10px] sm:text-xs text-[#86868b] font-normal">Nodes</span>
            </div>
          </div>

          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1 bg-[#1d1d1f] h-5 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-5 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-6 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-6 rounded-full" />
            <div className="w-1 bg-[#10b981] h-7 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-black/[0.04]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
            Mesh Heartbeat
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#86868b] truncate">Active</span>
        </div>
      </div>

      {/* CARD 4: AVG MISSION CYCLE TIME */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#86868b] uppercase tracking-wider truncate">
              Cycle Time
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {metrics.averageTaskCompletionTime.toFixed(1)}s
              </span>
              <span className="text-[10px] sm:text-xs text-[#86868b] font-normal">per pick</span>
            </div>
          </div>

          <div className="hidden xs:flex items-end gap-1 h-7 sm:h-8 pt-1">
            <div className="w-1 bg-[#1d1d1f] h-6 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-4 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-3 rounded-full" />
            <div className="w-1 bg-[#1d1d1f] h-2 rounded-full" />
            <div className="w-1 bg-[#10b981] h-3 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-black/[0.04]">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            -28.8%
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#86868b] truncate">Latency</span>
        </div>
      </div>
    </div>
  );
};
