'use client';

import React from 'react';

interface StorageOverviewCardProps {
  totalUsedGb?: number;
  maxGb?: number;
  percentage?: number;
}

export const StorageOverviewCard: React.FC<StorageOverviewCardProps> = ({
  totalUsedGb = 19,
  maxGb = 28,
  percentage = 68,
}) => {
  return (
    <div className="bg-white rounded-[22px] border border-[#e2e8f0] p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold tracking-tight text-slate-900">
          Storage Overview
        </h3>
      </div>

      {/* Total Used Pill Display matching screenshot */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-auto">
        <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
          Total Used
        </span>
        <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          19 GB <span className="text-slate-400 font-semibold text-base sm:text-lg">({percentage}% of 28 GB)</span>
        </div>
      </div>

      {/* Segmented Bar & Values */}
      <div className="mt-3">
        {/* Segment Values */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5 px-0.5">
          <span>10.4 GB</span>
          <span>1.4 GB</span>
          <span>5.4 GB</span>
          <span>2.4 GB</span>
        </div>

        {/* Segmented Color Bar matching screenshot */}
        <div className="w-full h-2.5 rounded-full overflow-hidden flex gap-1 bg-slate-100 p-0.5">
          {/* Black: Documents */}
          <div className="h-full bg-slate-900 rounded-full" style={{ width: '52%' }} />
          {/* Red: Images */}
          <div className="h-full bg-[#ff334b] rounded-full" style={{ width: '10%' }} />
          {/* Green: Videos */}
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24%' }} />
          {/* Blue: Others */}
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '14%' }} />
        </div>

        {/* Legend matching screenshot */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-slate-500 mt-3 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <span>Documents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff334b]" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Videos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Others</span>
          </div>
        </div>
      </div>
    </div>
  );
};
