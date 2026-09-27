'use client';

import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { WarehouseEvent } from '@/types/warehouse';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: WarehouseEvent[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  events,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-black/[0.08] p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#f5f5f7] flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-[#1d1d1f]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1d1d1f]">Fleet Notifications</h3>
                <p className="text-[10px] text-[#86868b]">{events.length} system events</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
            {events.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#86868b]">
                No unread notifications.
              </div>
            ) : (
              events.slice(0, 15).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-[#f8fafc] hover:bg-[#f1f3f5] rounded-xl border border-black/[0.04] transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1d1d1f]">{evt.type.toUpperCase()}</span>
                    <span suppressHydrationWarning className="text-[10px] font-mono text-[#86868b]">
                      {new Date(evt.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6e6e73] leading-snug">{evt.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-black/[0.06]">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#eef0f3] text-xs font-semibold text-[#1d1d1f] transition-colors"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};
