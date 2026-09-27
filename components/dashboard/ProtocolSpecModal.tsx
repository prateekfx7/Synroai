'use client';

import React from 'react';
import { X, BookOpen, Layers, Radio, CheckCircle2 } from 'lucide-react';

interface ProtocolSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolSpecModal: React.FC<ProtocolSpecModalProps> = ({
  isOpen,
  onClose,
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

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-black/[0.06]">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0071e3]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f]">Synro Protocol Specification</h3>
            <p className="text-xs text-[#86868b]">
              Simulated P2P/MQTT Message Layer (Supabase Realtime DB)
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-[#6e6e73] mb-6">
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
            <h4 className="font-semibold text-[#1d1d1f] mb-1">1. A* Routing with Space-Time Reservation</h4>
            <p className="text-[11px] leading-relaxed">
              Every AMR independently computes optimal route trajectories using A* pathfinding across coordinate space and discrete time steps (x, y, t). Space-time reservations avoid collisions; when planned paths intersect, the lower-priority robot yields dynamically and replans using A*.
            </p>
          </div>

          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
            <h4 className="font-semibold text-[#1d1d1f] mb-1">2. Priority-Based Task Allocation</h4>
            <p className="text-[11px] leading-relaxed mb-1">
              New warehouse pickup orders are broadcast over the simulated P2P/MQTT message layer. Available robots evaluate tasks using the priority formula:
            </p>
            <div className="bg-white p-2 rounded-xl border border-black/[0.06] text-center font-mono text-[11px] text-[#1d1d1f] font-semibold">
              Priority = urgency + waiting time + battery risk
            </div>
          </div>

          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
            <h4 className="font-semibold text-[#1d1d1f] mb-1">3. Simulated P2P/MQTT Heartbeat &amp; Dynamic Obstacles</h4>
            <p className="text-[11px] leading-relaxed">
              If an AMR node ceases broadcasting heartbeats for &gt;4 seconds over the message layer, neighboring robots flag its last coordinates as a dynamic obstacle and immediately trigger task reassignment to another AMR.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold shadow-sm transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
