'use client';

import React from 'react';
import Link from 'next/link';
import { useSynroAuth } from '@/lib/auth/use-synro-auth';
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Layers,
  Radio,
  BarChart2,
  Box,
  Zap,
  Sliders,
  LifeBuoy,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  LogIn,
} from 'lucide-react';

interface AppleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  activeRobotCount: number;
  totalTasks: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenOperatorModal?: () => void;
  onOpenProtocolSpec?: () => void;
  onOpenStorageRacks?: () => void;
  onOpenChargingBays?: () => void;
  onOpenDocksPickups?: () => void;
  onOpenChaosLab?: () => void;
}

export const AppleSidebar: React.FC<AppleSidebarProps> = ({
  activeTab,
  setActiveTab,
  activeRobotCount,
  totalTasks,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  onOpenOperatorModal,
  onOpenProtocolSpec,
  onOpenStorageRacks,
  onOpenChargingBays,
  onOpenDocksPickups,
  onOpenChaosLab,
}) => {
  const { user } = useSynroAuth();

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container - Clay Surface Soft (#faf5e8) */}
      <aside
        className={`bg-[#faf5e8] border-r border-[#e5e5e5] min-h-screen flex flex-col justify-between p-4 select-none transition-all duration-300 z-50
          /* Mobile styles: Off-canvas Drawer */
          fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl md:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          /* Desktop styles: Static in-flow */
          md:static md:min-h-screen
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        <div className="space-y-6">
          {/* Brand Header & Close / Collapse Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-[#e5e5e5] shadow-xs">
            <div
              onClick={() => handleTabClick('overview')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0a0a0a] flex items-center justify-center text-white shadow-xs flex-shrink-0 font-black text-sm tracking-wider">
                S
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-extrabold text-[#0a0a0a] leading-tight tracking-tight">Synro</h2>
                    {isMobileOpen ? (
                      <span className="text-[10px] font-mono text-[#0a0a0a] font-semibold bg-[#faf5e8] border border-[#e5e5e5] px-1.5 py-0.5 rounded">
                        ID: {user?.id || 'OP-8492'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-[#ffb084]/30 text-[#0a0a0a] border border-[#ffb084]/60 px-1.5 py-0.2 rounded-full uppercase" title="Simulated P2P/MQTT layer via Supabase Realtime DB">
                        P2P / Realtime
                      </span>
                    )}
                  </div>
                  {!isMobileOpen && (
                    <p className="text-[10px] text-[#6a6a6a] leading-tight font-medium">Autonomous AMR Fleet</p>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Collapse / Mobile Close Button */}
            <div className="flex items-center">
              {/* Mobile Close X button */}
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-[#6a6a6a] hover:text-[#0a0a0a] hover:bg-[#faf5e8] md:hidden"
                title="Close menu"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Desktop Collapse button */}
              <button
                onClick={onToggleCollapse}
                className="hidden md:block p-1 rounded-lg text-[#6a6a6a] hover:text-[#0a0a0a] hover:bg-[#faf5e8] transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Close sidebar'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-[#0a0a0a]" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-[#6a6a6a] hover:text-[#0a0a0a]" />
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Main Menu */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <p className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider px-3 mb-2">
                Main Menu
              </p>
            )}
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('overview')}
                title="Dashboard Overview"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#0a0a0a] text-white font-semibold shadow-xs'
                    : 'text-[#3a3a3a] hover:text-[#0a0a0a] hover:bg-[#f5f0e0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Dashboard</span>}
                </div>
              </button>

              <button
                onClick={() => handleTabClick('map')}
                title="Floor Grid Map"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'map'
                    ? 'bg-[#0a0a0a] text-white font-semibold shadow-xs'
                    : 'text-[#3a3a3a] hover:text-[#0a0a0a] hover:bg-[#f5f0e0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${activeTab === 'map' ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Floor Grid Map</span>}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    activeTab === 'map' ? 'bg-[#a4d4c5] text-[#0a0a0a]' : 'bg-[#a4d4c5]/40 text-[#0a0a0a]'
                  }`}>
                    Live
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('fleet')}
                title="AMR Fleet Units"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'fleet'
                    ? 'bg-[#0a0a0a] text-white font-semibold shadow-xs'
                    : 'text-[#3a3a3a] hover:text-[#0a0a0a] hover:bg-[#f5f0e0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-4 h-4 ${activeTab === 'fleet' ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>AMR Fleet Units</span>}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'fleet' ? 'bg-[#ffb084] text-[#0a0a0a]' : 'bg-[#f5f0e0] text-[#0a0a0a] border border-[#e5e5e5]'
                  }`}>
                    {activeRobotCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('consensus')}
                title="P2P Gossip Feed"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'consensus'
                    ? 'bg-[#0a0a0a] text-white font-semibold shadow-xs'
                    : 'text-[#3a3a3a] hover:text-[#0a0a0a] hover:bg-[#f5f0e0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radio className={`w-4 h-4 ${activeTab === 'consensus' ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>P2P Gossip Feed</span>}
                </div>
              </button>

              <button
                onClick={() => handleTabClick('tasks')}
                title="Task Dispatch"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-[#0a0a0a] text-white font-semibold shadow-xs'
                    : 'text-[#3a3a3a] hover:text-[#0a0a0a] hover:bg-[#f5f0e0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Box className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Task Dispatch</span>}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'tasks' ? 'bg-[#b8a4ed] text-[#0a0a0a]' : 'bg-[#b8a4ed]/40 text-[#0a0a0a]'
                  }`}>
                    {totalTasks}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('benchmark')}
                title="Speedup Benchmark"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'benchmark'
                    ? 'bg-[#0a0a0a] text-white font-semibold shadow-xs'
                    : 'text-[#3a3a3a] hover:text-[#0a0a0a] hover:bg-[#f5f0e0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className={`w-4 h-4 ${activeTab === 'benchmark' ? 'text-white' : 'text-[#6a6a6a]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Speedup Benchmark</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Warehouse Zones */}
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <p className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider px-3 mb-2">
                Warehouse Zones
              </p>
              <div className="space-y-1 text-xs text-[#3a3a3a]">
                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenStorageRacks) onOpenStorageRacks();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all text-left group shadow-2xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-[#0a0a0a]">
                    <Layers className="w-3.5 h-3.5 text-[#1a3a3a] group-hover:scale-110 transition-transform" />
                    Storage Racks A–D
                  </span>
                  <span className="text-[10px] text-[#6a6a6a] bg-[#faf5e8] px-2 py-0.5 rounded-md font-mono">
                    32 Shelves
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenChargingBays) onOpenChargingBays();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all text-left group shadow-2xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-[#0a0a0a]">
                    <Zap className="w-3.5 h-3.5 text-[#22c55e] group-hover:scale-110 transition-transform" />
                    Charging Bays
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md font-bold">
                    4 Ready
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenDocksPickups) onOpenDocksPickups();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all text-left group shadow-2xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-[#0a0a0a]">
                    <Box className="w-3.5 h-3.5 text-[#ffb084] group-hover:scale-110 transition-transform" />
                    Docks &amp; Pickups
                  </span>
                  <span className="text-[10px] text-[#6a6a6a] bg-[#faf5e8] px-2 py-0.5 rounded-md font-mono">
                    9 Stations
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Section 3: System & Support */}
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <p className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider px-3 mb-2">
                System &amp; Support
              </p>
              <div className="space-y-1 text-xs text-[#3a3a3a]">
                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenProtocolSpec) onOpenProtocolSpec();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all text-left group font-semibold text-[#0a0a0a] shadow-2xs"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-[#1a3a3a] group-hover:scale-110 transition-transform" />
                  <span>Protocol Specification</span>
                </button>

                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenChaosLab) onOpenChaosLab();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all text-left group font-semibold text-[#0a0a0a] shadow-2xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span>Chaos Lab Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Profile Card */}
        <div className="pt-4 border-t border-[#e5e5e5] space-y-2">
          <div
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenOperatorModal) onOpenOperatorModal();
            }}
            className={`flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2' : 'justify-between p-2'} bg-white rounded-2xl border border-[#e5e5e5] shadow-xs cursor-pointer hover:border-[#0a0a0a] transition-all group`}
            title="Click to view operator profile"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {user?.initials || 'SP'}
                </div>
                <span className="w-2 h-2 rounded-full bg-[#22c55e] ring-2 ring-white absolute bottom-0 right-0" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate">
                  <p className="text-xs font-bold text-[#0a0a0a] leading-tight truncate group-hover:underline">
                    {user?.name || 'Salung Prastyo'}
                  </p>
                  <p className="text-[10px] text-[#6a6a6a] leading-tight truncate">
                    {user?.role || 'Fleet Operator'}
                  </p>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <ChevronDown className="w-3.5 h-3.5 text-[#6a6a6a] group-hover:text-[#0a0a0a]" />
            )}
          </div>

          {/* Quick Switch / Sign In Link */}
          {(!isCollapsed || isMobileOpen) && (
            <div className="px-2 flex items-center justify-between text-[11px] text-[#6a6a6a]">
              <Link
                href="/login"
                className="hover:text-[#0a0a0a] flex items-center gap-1 transition-colors font-semibold"
              >
                <LogIn className="w-3 h-3 text-[#6a6a6a]" />
                <span>Switch / Sign In</span>
              </Link>
              <span className="font-mono text-[10px] text-[#9a9a9a]">
                {user?.id || 'OP-8492'}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
