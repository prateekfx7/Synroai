'use client';

import React from 'react';
import { Bot, Cpu, GitFork, Radio, ShieldCheck } from 'lucide-react';

interface AutomationProtocolsCardProps {
  onSeeMore?: () => void;
}

export const AutomationProtocolsCard: React.FC<AutomationProtocolsCardProps> = ({
  onSeeMore,
}) => {
  const workflows = [
    {
      id: 'wf-1',
      title: 'Auto Task Dispatcher',
      desc: 'Priority = urgency + wait + battery risk',
      time: '1m Ago',
      icon: Cpu,
    },
    {
      id: 'wf-2',
      title: 'A* Path Space-Time Reservation',
      desc: 'Collision-free coordinate reservation grid',
      time: '10m Ago',
      icon: GitFork,
    },
    {
      id: 'wf-3',
      title: 'P2P Gossip State Sync',
      desc: 'Simulated P2P/MQTT (Supabase Realtime)',
      time: '2m Ago',
      icon: Radio,
    },
    {
      id: 'wf-4',
      title: 'Autonomous Fault Recovery',
      desc: 'Instant peer task reassignment on heartbeat loss',
      time: '12m Ago',
      icon: ShieldCheck,
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

      {/* List with red icons matching screenshot */}
      <div className="space-y-3.5">
        {workflows.map((wf) => {
          const Icon = wf.icon;
          return (
            <div key={wf.id} className="flex items-center justify-between gap-3 group cursor-pointer">
              <div className="flex items-center gap-3 min-w-0">
                {/* Vibrant Red Icon Box */}
                <div className="w-8 h-8 rounded-xl bg-[#ff334b] text-white flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#ff334b] transition-colors">
                    {wf.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {wf.desc}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex-shrink-0">
                {wf.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
