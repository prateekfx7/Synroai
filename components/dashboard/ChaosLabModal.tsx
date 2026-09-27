'use client';

import React, { useState } from 'react';
import { X, Sliders, Zap, AlertOctagon, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface ChaosLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForceConflict: () => void;
  onBlockAisle: () => void;
  onFailRobot: (id?: string) => void;
  onReset: () => void;
  onShowToast: (msg: string) => void;
}

export const ChaosLabModal: React.FC<ChaosLabModalProps> = ({
  isOpen,
  onClose,
  onForceConflict,
  onBlockAisle,
  onFailRobot,
  onReset,
  onShowToast,
}) => {
  const [packetLoss, setPacketLoss] = useState(0);
  const [jitterMs, setJitterMs] = useState(12);

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
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1d1d1f]">Chaos Engineering Lab</h3>
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                Stress Simulation
              </span>
            </div>
            <p className="text-xs text-[#86868b]">Inject synthetic faults, corridor deadlocks, and network noise</p>
          </div>
        </div>

        <div className="space-y-4 mb-6 text-xs">
          {/* Quick Scenario Triggers */}
          <div>
            <label className="text-xs font-semibold text-[#1d1d1f] block mb-2">
              Instant Scenario Injections:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onForceConflict();
                  onShowToast('Injected Intersection Conflict between AMR-01 and AMR-02');
                }}
                className="p-3 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition-colors flex items-center gap-2.5"
              >
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">Force Conflict</span>
                  <span className="text-[10px] text-[#6e6e73]">Crossing paths at (9, 5)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onBlockAisle();
                  onShowToast('Toggled Corridor Block at cell (9, 5)');
                }}
                className="p-3 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-left transition-colors flex items-center gap-2.5"
              >
                <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">Block Aisle (9, 5)</span>
                  <span className="text-[10px] text-[#6e6e73]">Dynamic physical obstacle</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onFailRobot('AMR-02');
                  onShowToast('Injected Hardware Disruption on AMR-02');
                }}
                className="p-3 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-left transition-colors flex items-center gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">Fault AMR-02</span>
                  <span className="text-[10px] text-[#6e6e73]">Cease gossip heartbeats</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onReset();
                  onShowToast('Reset all simulation nodes to initial state');
                }}
                className="p-3 rounded-2xl border border-black/[0.06] bg-[#f5f6f8] hover:bg-[#eceef2] text-left transition-colors flex items-center gap-2.5"
              >
                <RotateCcw className="w-4 h-4 text-[#1d1d1f] flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">Reset Fleet</span>
                  <span className="text-[10px] text-[#6e6e73]">Return to home quadrants</span>
                </div>
              </button>
            </div>
          </div>

          {/* Network Latency Jitter */}
          <div className="p-3.5 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between font-medium text-[#1d1d1f]">
              <span>Simulated P2P Latency Jitter</span>
              <span className="font-mono text-[11px] text-[#0071e3] font-bold">{jitterMs} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={jitterMs}
              onChange={(e) => setJitterMs(Number(e.target.value))}
              className="w-full accent-[#0071e3] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#86868b]">
              <span>0 ms (Local Bus)</span>
              <span>150 ms (Congested Mesh)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onShowToast(`Chaos parameters applied (Jitter: ${jitterMs}ms)`);
            onClose();
          }}
          className="w-full py-2.5 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          Save &amp; Apply Chaos Parameters
        </button>
      </div>
    </div>
  );
};
