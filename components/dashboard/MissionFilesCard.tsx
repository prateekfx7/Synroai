'use client';

import React from 'react';
import { FileText, FileSpreadsheet, Layers, Presentation } from 'lucide-react';

interface MissionFilesCardProps {
  onSeeMore?: () => void;
}

export const MissionFilesCard: React.FC<MissionFilesCardProps> = ({
  onSeeMore,
}) => {
  const files = [
    {
      id: 'f-1',
      name: 'Project Proposal.pdf',
      meta: '2.4 MB · PDF',
      time: '10m Ago',
      icon: FileText,
      bgColor: 'bg-red-50 text-red-600 border-red-100',
    },
    {
      id: 'f-2',
      name: 'Market Research.xlsx',
      meta: '1.8 MB · Excel',
      time: 'Yesterday',
      icon: FileSpreadsheet,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'f-3',
      name: 'Design Mockup.fig',
      meta: '4.2 MB · Figma',
      time: 'Tomorrow',
      icon: Layers,
      bgColor: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      id: 'f-4',
      name: 'Presentation.pptx',
      meta: '8.3 MB · PowerPoint',
      time: '1m Ago',
      icon: Presentation,
      bgColor: 'bg-orange-50 text-orange-600 border-orange-100',
    },
  ];

  return (
    <div className="bg-white rounded-[22px] border border-[#e2e8f0] p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-tight text-slate-900">
          Automation Workflows
        </h3>
        <button
          onClick={onSeeMore}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
        >
          See More
        </button>
      </div>

      {/* File List matching screenshot */}
      <div className="space-y-3.5">
        {files.map((file) => {
          const Icon = file.icon;
          return (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Specific Colored Document Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-105 ${file.bgColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#ff334b] transition-colors">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {file.meta}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex-shrink-0">
                {file.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
