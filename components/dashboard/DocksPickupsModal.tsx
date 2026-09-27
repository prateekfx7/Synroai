'use client';

import React from 'react';
import { X, Box, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PICKUP_STATIONS, DROPOFF_STATIONS } from '@/lib/warehouse/grid';

interface DocksPickupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawnTask?: () => void;
}

export const DocksPickupsModal: React.FC<DocksPickupsModalProps> = ({
  isOpen,
  onClose,
  onSpawnTask,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-black/[0.08] rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-black/[0.06] pr-8">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1d1d1f]">Docks &amp; Pickup Stations</h3>
              <span className="text-[10px] font-semibold bg-blue-50 text-[#0071e3] px-2 py-0.5 rounded-full border border-blue-200">
                9 Stations
              </span>
            </div>
            <p className="text-xs text-[#86868b]">North inbound pickup bays &amp; South outbound dropoff docks</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Pickup Stations */}
          <div>
            <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5 mb-2">
              <ArrowDownRight className="w-4 h-4 text-amber-500" />
              <span>Inbound Pickup Stations (5 Bays)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PICKUP_STATIONS.map((p, idx) => (
                <div
                  key={`pick-${idx}`}
                  className="p-2.5 bg-[#fefce8] border border-amber-200/70 rounded-xl flex items-center justify-between"
                >
                  <span className="font-semibold text-amber-900">Pickup Bay {idx + 1}</span>
                  <span className="font-mono text-[11px] text-amber-700">({p.x}, {p.y})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dropoff Docks */}
          <div>
            <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5 mb-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <span>Outbound Dropoff Docks (4 Docks)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DROPOFF_STATIONS.map((d, idx) => (
                <div
                  key={`drop-${idx}`}
                  className="p-2.5 bg-[#eff6ff] border border-blue-200/70 rounded-xl flex items-center justify-between"
                >
                  <span className="font-semibold text-blue-900">Dock {idx + 1}</span>
                  <span className="font-mono text-[11px] text-blue-700">({d.x}, {d.y})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {onSpawnTask && (
            <button
              onClick={() => {
                onClose();
                onSpawnTask();
              }}
              className="flex-1 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              + Dispatch Mission Here
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
