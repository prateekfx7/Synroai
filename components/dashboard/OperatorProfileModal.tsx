'use client';

import React, { useState } from 'react';
import { X, User, Shield, Key, LogOut, CheckCircle2, Clock, Award } from 'lucide-react';

interface OperatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const OperatorProfileModal: React.FC<OperatorProfileModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [operatorName, setOperatorName] = useState('Salung Prastyo');
  const [role, setRole] = useState('Senior Fleet Controller');

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

        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-black/[0.06]">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-base shadow-sm">
              SP
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1d1d1f]">{operatorName}</h3>
            <p className="text-xs text-[#86868b]">{role} • Synro Edge</p>
          </div>
        </div>

        {/* Operator Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
            <span className="text-[10px] text-[#86868b] uppercase tracking-wider block mb-0.5">Shift Duty</span>
            <div className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Shift 01 (Active)</span>
            </div>
          </div>
          <div className="p-3 bg-[#f5f6f8] rounded-2xl border border-black/[0.04]">
            <span className="text-[10px] text-[#86868b] uppercase tracking-wider block mb-0.5">Authorization</span>
            <div className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Mesh Admin</span>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => {
              onShowToast('Operator credentials refreshed.');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#fafafa] hover:bg-[#f5f6f8] text-xs font-medium text-[#1d1d1f] border border-black/[0.04] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-[#86868b]" />
              Cryptographic Mesh Keys
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
          </button>

          <button
            onClick={() => {
              onShowToast('Switched to Auditor Mode');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#fafafa] hover:bg-[#f5f6f8] text-xs font-medium text-[#1d1d1f] border border-black/[0.04] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#86868b]" />
              Shift Audit Logs
            </span>
            <span className="text-[10px] text-[#86868b]">View &gt;</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
