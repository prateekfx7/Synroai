'use client';

import React, { useState } from 'react';
import { X, Box, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { PICKUP_STATIONS, DROPOFF_STATIONS } from '@/lib/warehouse/grid';

interface DispatchMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawnTask: (pickup?: { x: number; y: number }, dropoff?: { x: number; y: number }) => void;
}

export const DispatchMissionModal: React.FC<DispatchMissionModalProps> = ({
  isOpen,
  onClose,
  onSpawnTask,
}) => {
  const [selectedPickup, setSelectedPickup] = useState(0);
  const [selectedDropoff, setSelectedDropoff] = useState(0);
  const [priority, setPriority] = useState<'normal' | 'express'>('normal');

  if (!isOpen) return null;

  const pickup = PICKUP_STATIONS[selectedPickup] || PICKUP_STATIONS[0];
  const dropoff = DROPOFF_STATIONS[selectedDropoff] || DROPOFF_STATIONS[0];

  const distance = Math.abs(pickup.x - dropoff.x) + Math.abs(pickup.y - dropoff.y);
  const estSeconds = Math.round(distance * 1.4 + 4);

  const handleDispatch = () => {
    onSpawnTask(pickup, dropoff);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-black/[0.08] rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] flex items-center justify-center flex-shrink-0">
            <Box className="w-5 h-5 text-[#0071e3]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f]">Dispatch Warehouse Mission</h3>
            <p className="text-xs text-[#86868b]">Broadcast task for distributed priority allocation</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Pickup Station Selection */}
          <div>
            <label className="text-xs font-semibold text-[#1d1d1f] block mb-1.5">
              Pickup Station
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PICKUP_STATIONS.slice(0, 3).map((st, idx) => (
                <button
                  key={`pickup-${idx}`}
                  onClick={() => setSelectedPickup(idx)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    selectedPickup === idx
                      ? 'border-[#0071e3] bg-blue-50/50 text-[#0071e3] font-semibold'
                      : 'border-black/[0.06] hover:bg-[#f5f6f8] text-[#1d1d1f]'
                  }`}
                >
                  <span className="block font-medium">Bay {idx + 1}</span>
                  <span className="text-[10px] text-[#86868b] font-mono">({st.x}, {st.y})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dropoff Dock Selection */}
          <div>
            <label className="text-xs font-semibold text-[#1d1d1f] block mb-1.5">
              Dropoff Dock
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DROPOFF_STATIONS.map((dk, idx) => (
                <button
                  key={`dock-${idx}`}
                  onClick={() => setSelectedDropoff(idx)}
                  className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                    selectedDropoff === idx
                      ? 'border-[#0071e3] bg-blue-50/50 text-[#0071e3] font-semibold'
                      : 'border-black/[0.06] hover:bg-[#f5f6f8] text-[#1d1d1f]'
                  }`}
                >
                  <span className="block font-medium">Dock {idx + 1}</span>
                  <span className="text-[10px] text-[#86868b] font-mono">({dk.x}, {dk.y})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Pill */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Mission Priority
              </label>
              <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 font-mono">
                urgency + waiting + battery risk
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPriority('normal')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                  priority === 'normal'
                    ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white'
                    : 'border-black/[0.06] text-[#6e6e73] hover:bg-[#f5f6f8]'
                }`}
              >
                Standard Allocation
              </button>
              <button
                onClick={() => setPriority('express')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                  priority === 'express'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                    : 'border-black/[0.06] text-[#6e6e73] hover:bg-[#f5f6f8]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Rush Priority
              </button>
            </div>
          </div>

          {/* Route Summary */}
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] flex items-center justify-between text-xs text-[#6e6e73]">
            <div className="flex items-center gap-2">
              <span className="font-mono">({pickup.x},{pickup.y})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#86868b]" />
              <span className="font-mono">({dropoff.x},{dropoff.y})</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#1d1d1f]">{estSeconds}s</span> est. duration
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-black/[0.08] text-xs font-medium text-[#6e6e73] hover:bg-[#f5f6f8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            className="flex-1 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Dispatch to Fleet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
