'use client';

import React from 'react';
import { X, Zap, Battery, CheckCircle2 } from 'lucide-react';
import { CHARGING_PADS } from '@/lib/warehouse/grid';
import { RobotState } from '@/types/warehouse';

interface ChargingBaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  robots: RobotState[];
  onSendToCharger?: (robotId: string) => void;
}

export const ChargingBaysModal: React.FC<ChargingBaysModalProps> = ({
  isOpen,
  onClose,
  robots,
  onSendToCharger,
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
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1d1d1f]">Inductive Charging Bays</h3>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                4 Ready
              </span>
            </div>
            <p className="text-xs text-[#86868b]">Fast wireless induction charging pads along West perimeter</p>
          </div>
        </div>

        {/* 4 Charging Bays Details */}
        <div className="space-y-2.5 mb-6">
          {CHARGING_PADS.map((pad, idx) => {
            const occupyingRobot = robots.find(
              (r) => r.x === pad.x && r.y === pad.y
            );

            return (
              <div
                key={`pad-${idx}`}
                className="p-3 bg-[#f8fafc] rounded-2xl border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/60 flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1d1d1f] block">Charging Pad {idx + 1}</span>
                    <span className="text-[11px] font-mono text-[#86868b]">Coord: ({pad.x}, {pad.y}) • 48V / 60A</span>
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  {occupyingRobot ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Charging {occupyingRobot.id} ({Math.round(occupyingRobot.battery)}%)
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-emerald-600 bg-white border border-emerald-200 px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap">
                      Available (Ready)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
