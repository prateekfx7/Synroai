'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface ActivityMatrixChartProps {
  totalCount?: number;
}

export const ActivityMatrixChart: React.FC<ActivityMatrixChartProps> = ({
  totalCount = 10320,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(5); // default June hovered

  // 12 months data with dot matrix density
  const monthsData = [
    { label: 'JAN', reroutes: 12, yields: 8, total: '20k' },
    { label: 'FEB', reroutes: 18, yields: 10, total: '28k' },
    { label: 'MAR', reroutes: 14, yields: 12, total: '26k' },
    { label: 'APR', reroutes: 22, yields: 14, total: '36k' },
    { label: 'MAY', reroutes: 28, yields: 16, total: '44k' },
    { label: 'JUN', reroutes: 38, yields: 18, total: '56k' },
    { label: 'JUL', reroutes: 24, yields: 15, total: '39k' },
    { label: 'AUG', reroutes: 20, yields: 12, total: '32k' },
    { label: 'SEP', reroutes: 30, yields: 16, total: '46k' },
    { label: 'OCT', reroutes: 26, yields: 14, total: '40k' },
    { label: 'NOV', reroutes: 34, yields: 20, total: '54k' },
    { label: 'DEC', reroutes: 40, yields: 22, total: '62k' },
  ];

  return (
    <div className="relative w-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#86868b] uppercase">
            <span>Fleet Activity Trend</span>
            <Info className="w-3 h-3 text-[#a1a1a6]" />
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-xs text-[#86868b]">Total Processed:</span>
            <span className="text-xl font-bold tracking-tight text-[#1d1d1f]">
              {totalCount.toLocaleString()} <span className="text-xs font-normal text-[#86868b]">Events</span>
            </span>
          </div>
        </div>

        {/* Legend & Timeframe Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-[#6e6e73]">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#1d1d1f]" />
              Autonomous Reroute
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#d2d2d7]" />
              P2P Yield
            </span>
          </div>

          <div className="flex items-center bg-[#f5f5f7] p-0.5 rounded-lg border border-black/[0.04] text-xs font-medium">
            {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  timeframe === period
                    ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dot Matrix Graphic */}
      <div className="relative pt-6 pb-2 overflow-x-auto touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
        <div className="min-w-[480px]">
          {/* Y Axis Guide Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-neutral-200 w-full flex items-center justify-between text-[10px] text-[#a1a1a6]">
              <span>60k</span>
            </div>
            <div className="border-b border-dashed border-neutral-200 w-full flex items-center justify-between text-[10px] text-[#a1a1a6]">
              <span>40k</span>
            </div>
            <div className="border-b border-dashed border-neutral-200 w-full flex items-center justify-between text-[10px] text-[#a1a1a6]">
              <span>20k</span>
            </div>
            <div className="border-b border-neutral-200 w-full flex items-center justify-between text-[10px] text-[#a1a1a6]">
              <span>0k</span>
            </div>
          </div>

          {/* Matrix Columns */}
          <div className="relative h-44 sm:h-48 flex items-end justify-between px-2 sm:px-4 z-10">
            {monthsData.map((item, idx) => {
              const isHovered = hoveredMonth === idx;
              // Generate matrix blocks (up to 12 rows of dots)
              const totalDots = 14;
              const darkCount = Math.round((item.reroutes / 45) * totalDots);
              const lightCount = Math.round((item.yields / 45) * totalDots);

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredMonth(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Hover Tooltip - Apple style like the image */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 bg-white border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-xl px-2.5 py-1.5 text-left pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] sm:text-[11px] font-bold text-[#1d1d1f] mb-0.5">
                        {item.label} 2026
                      </p>
                      <div className="space-y-0.5 text-[9px] sm:text-[10px]">
                        <div className="flex items-center gap-1.5 text-[#6e6e73]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]" />
                          <span>Reroutes:</span>
                          <strong className="text-[#1d1d1f] font-semibold">{item.reroutes}k</strong>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6e6e73]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1a6]" />
                          <span>Yields:</span>
                          <strong className="text-[#1d1d1f] font-semibold">{item.yields}k</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vertical Dotted Guideline when hovered */}
                  {isHovered && (
                    <div className="absolute top-0 bottom-6 w-px border-l border-dashed border-neutral-400 pointer-events-none" />
                  )}

                  {/* Stack of Matrix Squares/Dots */}
                  <div className="flex flex-col-reverse gap-1 items-center pb-2">
                    {Array.from({ length: totalDots }).map((_, dotIdx) => {
                      let dotColor = '#f0f2f5'; // empty dot
                      if (dotIdx < darkCount) {
                        dotColor = '#1d1d1f'; // dark dot
                      } else if (dotIdx < darkCount + lightCount) {
                        dotColor = '#c7c7cc'; // light dot
                      }

                      return (
                        <div
                          key={`dot-${idx}-${dotIdx}`}
                          style={{ backgroundColor: dotColor }}
                          className={`w-2 sm:w-2.5 h-1 sm:h-1.5 rounded-[1.5px] transition-all duration-150 ${
                            isHovered ? 'scale-110 shadow-sm' : ''
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* X Axis Month Label */}
                  <span
                    className={`text-[9px] sm:text-[10px] font-medium transition-colors ${
                      isHovered ? 'text-[#1d1d1f] font-bold' : 'text-[#86868b]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
