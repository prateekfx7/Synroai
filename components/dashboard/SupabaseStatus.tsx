'use client';

import React, { useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Database, Wifi, Info, X, CheckCircle, ExternalLink } from 'lucide-react';

export const SupabaseStatus: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-black/[0.15] transition-all text-xs"
        >
          {isSupabaseConfigured ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#1d1d1f] font-medium">Supabase (Realtime DB)</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
              <span className="text-[#1d1d1f] font-medium">Simulated P2P/MQTT Layer</span>
            </>
          )}
          <Info className="w-3.5 h-3.5 text-[#86868b]" />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-black/[0.08] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.06]">
                <Database className="w-5 h-5 text-[#0071e3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Communication &amp; Coordination Layer
                </h3>
                <p className="text-xs text-[#86868b]">
                  Supabase (Realtime DB) — Simulated P2P/MQTT-Style Message Layer
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#6e6e73] leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-[#f5f6f8] border border-black/[0.04]">
                <div className="flex items-center gap-2 text-[#1d1d1f] font-semibold mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {isSupabaseConfigured
                    ? 'Connected to Live Supabase Backend'
                    : 'Simulated P2P/MQTT Message Layer Active (Zero-Latency Demo)'}
                </div>
                <p className="text-[#86868b] text-[11px]">
                  {isSupabaseConfigured
                    ? 'Each autonomous robot broadcasts its intent to the Supabase (Realtime DB) simulated P2P/MQTT message layer and persists telemetry to PostgreSQL.'
                    : 'Robots communicate via a simulated P2P/MQTT-style message layer (backed by Supabase Realtime broadcast channels or high-frequency in-memory bus) without a central coordinator.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f5f6f8] border border-black/[0.04] space-y-1">
                <span className="font-semibold text-[#1d1d1f]">System Architecture Highlights:</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[#6e6e73] pt-1">
                  <li>Zero Central Point of Failure: Edge robots plan routes and arbitrate right-of-way.</li>
                  <li>A* Routing with Space-Time Reservation: AMRs compute collision-free paths using A* combined with space-time reservation coordinate tokens.</li>
                  <li>Priority-Based Task Allocation: Evaluated via <code>Priority = urgency + waiting time + battery risk</code>.</li>
                  <li>Simulated P2P/MQTT Layer: Supabase Realtime DB provides the underlying pub/sub transport.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
