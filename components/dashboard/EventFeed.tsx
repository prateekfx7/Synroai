'use client';

import React from 'react';
import { WarehouseEvent, EventType } from '@/types/warehouse';
import {
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  CheckCircle,
  Gavel,
  Radio,
  Sparkles,
} from 'lucide-react';

interface EventFeedProps {
  events: WarehouseEvent[];
}

export const EventFeed: React.FC<EventFeedProps> = ({ events }) => {
  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'conflict':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          bg: 'bg-amber-950/60 border-amber-800/80 text-amber-300',
          label: 'CONFLICT NEGOTIATED',
        };
      case 'reroute':
        return {
          icon: <GitBranch className="w-3.5 h-3.5 text-cyan-400" />,
          bg: 'bg-cyan-950/60 border-cyan-800/80 text-cyan-300',
          label: 'LOCAL REROUTE',
        };
      case 'failure':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />,
          bg: 'bg-red-950/60 border-red-800/80 text-red-300',
          label: 'NODE FAILURE',
        };
      case 'bid_won':
        return {
          icon: <Gavel className="w-3.5 h-3.5 text-purple-400" />,
          bg: 'bg-purple-950/60 border-purple-800/80 text-purple-300',
          label: 'AUCTION WON',
        };
      case 'task_complete':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
          bg: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300',
          label: 'DELIVERED',
        };
      case 'deadlock_break':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
          bg: 'bg-pink-950/60 border-pink-800/80 text-pink-300',
          label: 'DEADLOCK BROKEN',
        };
      default:
        return {
          icon: <Radio className="w-3.5 h-3.5 text-blue-400" />,
          bg: 'bg-slate-900 border-slate-800 text-slate-300',
          label: 'BROADCAST',
        };
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toTimeString().split(' ')[0];
    } catch {
      return '';
    }
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-xl flex flex-col h-full max-h-[640px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">
            Decentralized Event Audit Feed
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {events.length} Events Logged
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {events.length === 0 ? (
          <div className="text-center text-slate-600 py-8">
            Awaiting mesh coordination events...
          </div>
        ) : (
          events.map((evt) => {
            const badge = getEventBadge(evt.type);
            return (
              <div
                key={evt.id}
                className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                    {evt.robot_id && (
                      <span className="text-[11px] font-semibold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {evt.robot_id}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {formatTime(evt.created_at)}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed pl-1">
                  {evt.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
