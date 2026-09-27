'use client';

import React from 'react';
import { ArrowUpRight, RotateCcw, ShieldAlert, Zap, Truck } from 'lucide-react';
import { WarehouseEvent, WarehouseTask } from '@/types/warehouse';

interface RecentMissionsCardProps {
  tasks?: WarehouseTask[];
  events?: WarehouseEvent[];
  onSeeMore?: () => void;
  onSelectTask?: (taskId: string) => void;
}

export const RecentMissionsCard: React.FC<RecentMissionsCardProps> = ({
  tasks = [],
  events = [],
  onSeeMore,
  onSelectTask,
}) => {
  const items = [
    {
      id: 'task-1',
      title: 'Pallet Transit A-104',
      desc: 'En route to Dropoff Bay 3 via A* pathing',
      time: '2m Ago',
      icon: Truck,
    },
    {
      id: 'task-2',
      title: 'Intersection Yield Protocol',
      desc: 'Space-time reservation priority granted to AMR-01',
      time: '5h Ago',
      icon: Zap,
    },
    {
      id: 'task-3',
      title: 'Autonomous Task Reassigned',
      desc: 'Disruption recovery: Handed off from AMR-02 to AMR-03',
      time: '2h Ago',
      icon: ShieldAlert,
    },
    {
      id: 'task-4',
      title: 'Bay 1 Automated Docking',
      desc: 'Battery replenishment cycle completed (94%)',
      time: '19h Ago',
      icon: RotateCcw,
    },
  ];

  return (
    <div className="bg-white rounded-[22px] border border-[#e2e8f0] p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-tight text-slate-900">
          Recent Missions
        </h3>
        <button
          onClick={onSeeMore}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
        >
          <span>See More</span>
        </button>
      </div>

      {/* List Items matching image layout */}
      <div className="space-y-3.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectTask && onSelectTask(item.id)}
              className="flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Dark Rounded Icon Box */}
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff334b] transition-colors shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Title & Description */}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#ff334b] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex-shrink-0">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
