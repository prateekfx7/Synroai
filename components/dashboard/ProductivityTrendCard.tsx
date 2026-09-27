'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductivityTrendCardProps {
  speedupPercentage?: number;
}

export const ProductivityTrendCard: React.FC<ProductivityTrendCardProps> = ({
  speedupPercentage = 29,
}) => {
  const [selectedRange, setSelectedRange] = useState('Weekly');
  const [showDropdown, setShowDropdown] = useState(false);

  const days = [
    { day: 'Mon', val: 18, isHighlight: false },
    { day: 'Tue', val: 24, isHighlight: false },
    { day: 'Wed', val: 15, isHighlight: false },
    { day: 'Thu', val: 20, isHighlight: false },
    { day: 'Fri', val: 26, isHighlight: true, tooltip: 'Hours 17' },
    { day: 'Sat', val: 12, isHighlight: false },
    { day: 'Sun', val: 14, isHighlight: false },
  ];

  return (
    <div className="bg-white rounded-[22px] border border-[#e2e8f0] p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold tracking-tight text-slate-900">
          Productivity Trend
        </h3>

        {/* Weekly Dropdown Pill matching screenshot */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            <span>{selectedRange}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-1 w-24 animate-in fade-in">
              {['Weekly', 'Daily', 'Monthly'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedRange(opt);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-medium ${
                    selectedRange === opt ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas with Y-Axis and Day Bars */}
      <div className="flex items-end gap-2 h-44 pt-6 pb-1">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-full text-[10px] text-slate-300 font-medium pb-5 pr-1 select-none">
          <span>30h</span>
          <span>25h</span>
          <span>20h</span>
          <span>15h</span>
          <span>10h</span>
          <span>5h</span>
          <span>0h</span>
        </div>

        {/* Day Bars */}
        <div className="flex-1 flex items-end justify-between gap-2 h-full pb-5 border-b border-slate-100">
          {days.map((item) => {
            const heightPercent = (item.val / 30) * 100;
            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center justify-end h-full relative group"
              >
                {/* Friday Tooltip matching screenshot */}
                {item.isHighlight && (
                  <div className="absolute -top-7 z-10 flex flex-col items-center pointer-events-none animate-bounce">
                    <div className="bg-[#0f172a] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
                      Hours 17
                    </div>
                    <div className="w-1.5 h-1.5 bg-[#0f172a] rotate-45 -mt-0.5" />
                  </div>
                )}

                {/* Vertical Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-xl transition-all ${
                    item.isHighlight
                      ? 'bg-[#ff334b] shadow-[0_4px_12px_rgba(255,51,75,0.3)]'
                      : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}
                />

                {/* Day Label */}
                <span
                  className={`absolute -bottom-5 text-[10px] font-medium transition-colors ${
                    item.isHighlight ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
