'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { FleetMetrics } from '@/types/warehouse';

interface ModernKpiCardsProps {
  metrics: FleetMetrics;
  onlineRobotsCount: number;
  totalRobotsCount: number;
  isExtendedDemo?: boolean;
}

export const ModernKpiCards: React.FC<ModernKpiCardsProps> = ({
  metrics,
  onlineRobotsCount,
  totalRobotsCount,
  isExtendedDemo = false,
}) => {
  const cards = [
    {
      title: 'Active AMRs',
      value: isExtendedDemo ? `${totalRobotsCount} Units` : '3 Units',
      note: isExtendedDemo ? 'Extended Demo Active' : 'PS Spec: 3 AMR Base',
      change: '+16% vs last month',
      changePositive: true,
      bars: [45, 75, 95, 60, 85, 100],
    },
    {
      title: 'Tasks Delivered',
      value: (1420 + metrics.completedTasksCount).toLocaleString(),
      note: 'Autonomous Transport',
      change: '+10% vs last month',
      changePositive: true,
      bars: [50, 40, 70, 90, 80, 95],
    },
    {
      title: 'A* P2P Consensuses',
      value: (34 + metrics.totalConflictsResolved).toString(),
      note: 'Space-Time Reservations',
      change: '+25% vs last month',
      changePositive: true,
      bars: [30, 60, 45, 75, 90, 100],
    },
    {
      title: 'Time Saved (A*)',
      value: '18.5h',
      note: `+${metrics.speedupPercentage}% vs Baseline`,
      change: '+19% vs last month',
      changePositive: true,
      bars: [65, 80, 55, 95, 70, 85],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[22px] border border-[#e2e8f0] p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          {/* Top Half: Title, Value and Mini Vertical Bar Sparkline */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                {card.title}
              </span>
              <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                {card.value}
              </div>
            </div>

            {/* Mini Sparkline Bar Chart (Matching reference image) */}
            <div className="flex items-end gap-1 h-8 pt-1 flex-shrink-0">
              {card.bars.map((height, barIdx) => (
                <div
                  key={barIdx}
                  className="w-1 bg-slate-800 rounded-full transition-all group-hover:bg-[#ff334b]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Half: Percentage Badge & 3-Dots */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-emerald-600">
                {card.change}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                • {card.note}
              </span>
            </div>
            <button
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-md hover:bg-slate-50"
              title="Metric details"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
