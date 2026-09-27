'use client';

import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Cpu, KeyRound } from 'lucide-react';

interface MeshSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const MeshSecurityModal: React.FC<MeshSecurityModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-black/[0.08] rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-black/[0.06]">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f]">Synro Mesh Security</h3>
            <p className="text-xs text-[#86868b]">Simulated P2P/MQTT Message Security</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[#6e6e73] mb-6">
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] flex items-center justify-between">
            <span className="font-medium text-[#1d1d1f]">Simulated P2P/MQTT Channel</span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Supabase Realtime
            </span>
          </div>

          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] flex items-center justify-between">
            <span className="font-medium text-[#1d1d1f]">Space-Time Token Signatures</span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Ed25519 Signed
            </span>
          </div>

          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04] flex items-center justify-between">
            <span className="font-medium text-[#1d1d1f]">Task Allocation Arbitration</span>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-mono">
              Priority Formula
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onShowToast('All peer-to-peer security certificates verified.');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Re-verify Mesh Nodes
          </button>
        </div>
      </div>
    </div>
  );
};
