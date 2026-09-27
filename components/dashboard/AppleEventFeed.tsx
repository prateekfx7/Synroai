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
  RotateCcw,
} from 'lucide-react';

interface AppleEventFeedProps {
  events: WarehouseEvent[];
}

export const AppleEventFeed: React.FC<AppleEventFeedProps> = ({ events }) => {
  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'reassignment':
        return {
          icon: <RotateCcw className="w-3.5 h-3.5 text-amber-700" />,
          bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          label: 'Task Reassigned',
        };
      case 'conflict':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          label: 'P2P Conflict',
        };
      case 'reroute':
        return {
          icon: <GitBranch className="w-3.5 h-3.5 text-blue-600" />,
          bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
          label: 'A* Reroute',
        };
      case 'failure':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
          bg: 'bg-rose-50 text-rose-800 border-rose-200/80',
          label: 'Hardware Fault',
        };
      case 'bid_won':
        return {
          icon: <Gavel className="w-3.5 h-3.5 text-purple-600" />,
          bg: 'bg-purple-50 text-purple-800 border-purple-200/80',
          label: 'Task Allocated',
        };
      case 'task_complete':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          label: 'Delivered',
        };
      case 'deadlock_break':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-pink-600" />,
          bg: 'bg-pink-50 text-pink-800 border-pink-200/80',
          label: 'Deadlock Broken',
        };
      default:
        return {
          icon: <Radio className="w-3.5 h-3.5 text-neutral-600" />,
          bg: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          label: 'P2P Gossip',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
            Real-Time P2P Consensus Stream
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-full border border-black/[0.04]">
          {events.length} Events Logged
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#86868b]">
            Listening for peer broadcasts on Supabase (Realtime DB) — simulated P2P/MQTT message layer...
          </div>
        ) : (
          events.slice(0, 15).map((event) => {
            const badge = getEventBadge(event.type);
            const time = new Date(event.created_at).toLocaleTimeString([], {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={event.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#fafafa] hover:bg-[#f5f6f8] border border-black/[0.03] transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                  <span className="text-[#1d1d1f] font-medium truncate">
                    {event.message}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#86868b] ml-3 flex-shrink-0">
                  {event.robot_id && (
                    <span className="font-semibold text-[#1d1d1f]">{event.robot_id}</span>
                  )}
                  <span suppressHydrationWarning>{time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
