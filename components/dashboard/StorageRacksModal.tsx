'use client';

import React from 'react';
import { X, Layers, Box, CheckCircle2, ArrowRight } from 'lucide-react';
import { STATIC_SHELVES } from '@/lib/warehouse/grid';

interface StorageRacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRack?: (x: number, y: number) => void;
}

export const StorageRacksModal: React.FC<StorageRacksModalProps> = ({
  isOpen,
  onClose,
  onSelectRack,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-black/[0.08] rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-black/[0.06] pr-8">
          <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] flex items-center justify-center text-[#1d1d1f] flex-shrink-0">
            <Layers className="w-5 h-5 text-[#0071e3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1d1d1f]">Storage Racks (Aisles A–D)</h3>
              <span className="text-[10px] font-semibold bg-blue-50 text-[#0071e3] px-2 py-0.5 rounded-full border border-blue-200">
                32 Shelves
              </span>
            </div>
            <p className="text-xs text-[#86868b]">High-density pallet inventory racks with AMR aisle clearance</p>
          </div>
        </div>

        {/* Rack Inventory Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] text-center">
            <span className="text-[10px] text-[#86868b] block font-medium">Aisle A</span>
            <span className="font-bold text-[#1d1d1f]">8 Shelves</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Occupied: 94%</span>
          </div>
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] text-center">
            <span className="text-[10px] text-[#86868b] block font-medium">Aisle B</span>
            <span className="font-bold text-[#1d1d1f]">8 Shelves</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Occupied: 88%</span>
          </div>
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] text-center">
            <span className="text-[10px] text-[#86868b] block font-medium">Aisle C</span>
            <span className="font-bold text-[#1d1d1f]">8 Shelves</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Occupied: 90%</span>
          </div>
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] text-center">
            <span className="text-[10px] text-[#86868b] block font-medium">Aisle D</span>
            <span className="font-bold text-[#1d1d1f]">8 Shelves</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Occupied: 92%</span>
          </div>
        </div>

        {/* Grid coordinates of shelves */}
        <div>
          <label className="text-xs font-semibold text-[#1d1d1f] block mb-2">
            Static Shelf Coordinates (A* Static Obstacles):
          </label>
          <div className="max-h-48 overflow-y-auto p-2 bg-[#fafafa] rounded-2xl border border-black/[0.04] grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-mono text-[#6e6e73]">
            {STATIC_SHELVES.map((s, idx) => (
              <div
                key={`shelf-${idx}`}
                className="p-1.5 bg-white border border-black/[0.04] rounded-lg text-center shadow-xs"
              >
                <span>Shelf {idx + 1}</span>
                <span className="block font-bold text-[#1d1d1f]">({s.x}, {s.y})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Close Rack Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
