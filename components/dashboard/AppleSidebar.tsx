'use client';

import React from 'react';
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

      {/* Sidebar Container */}
      <aside
        className={`bg-[#f4f5f7] border-r border-black/[0.05] min-h-screen flex flex-col justify-between p-4 select-none transition-all duration-300 z-50
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
          <div className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div
              onClick={() => handleTabClick('overview')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#1d1d1f] flex items-center justify-center text-white shadow-sm flex-shrink-0 font-black text-sm tracking-wider">
                S
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-extrabold text-[#1d1d1f] leading-tight tracking-tight">Synro</h2>
                    {isMobileOpen ? (
                      <span className="text-[10px] font-mono text-[#1d1d1f] font-semibold bg-[#f5f5f7] border border-black/[0.06] px-1.5 py-0.5 rounded">
                        ID: OP-8492
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-blue-50 text-[#0071e3] border border-blue-200/80 px-1.5 py-0.2 rounded-full uppercase">
                        Mesh
                      </span>
                    )}
                  </div>
                  {!isMobileOpen && (
                    <p className="text-[10px] text-[#86868b] leading-tight font-medium">Autonomous AMR Fleet</p>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Collapse / Mobile Close Button */}
            <div className="flex items-center">
              {/* Mobile Close X button */}
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] md:hidden"
                title="Close menu"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Desktop Collapse button */}
              <button
                onClick={onToggleCollapse}
                className="hidden md:block p-1 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Close sidebar'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-[#0071e3]" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-[#86868b] hover:text-[#1d1d1f]" />
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Main Menu */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider px-3 mb-2">
                Main Menu
              </p>
            )}
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('overview')}
                title="Dashboard Overview"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Dashboard</span>}
                </div>
              </button>

              <button
                onClick={() => handleTabClick('map')}
                title="Floor Grid Map"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'map'
                    ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${activeTab === 'map' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Floor Grid Map</span>}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.2 rounded-full">
                    Live
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('fleet')}
                title="AMR Fleet Units"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'fleet'
                    ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-4 h-4 ${activeTab === 'fleet' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>AMR Fleet Units</span>}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-[10px] bg-neutral-200 text-[#1d1d1f] font-medium px-1.5 py-0.2 rounded-full">
                    {activeRobotCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('consensus')}
                title="P2P Gossip Feed"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'consensus'
                    ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radio className={`w-4 h-4 ${activeTab === 'consensus' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>P2P Gossip Feed</span>}
                </div>
              </button>

              <button
                onClick={() => handleTabClick('tasks')}
                title="Task Dispatch"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Box className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Task Dispatch</span>}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-1.5 py-0.2 rounded-full">
                    {totalTasks}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('benchmark')}
                title="Speedup Benchmark"
                className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all ${
                  activeTab === 'benchmark'
                    ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className={`w-4 h-4 ${activeTab === 'benchmark' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  {(!isCollapsed || isMobileOpen) && <span>Speedup Benchmark</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Warehouse Zones */}
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider px-3 mb-2">
                Warehouse Zones
              </p>
              <div className="space-y-1 text-xs text-[#6e6e73]">
                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenStorageRacks) onOpenStorageRacks();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-black/[0.04] transition-all text-left group"
                >
                  <span className="flex items-center gap-2 font-medium text-[#1d1d1f]">
                    <Layers className="w-3.5 h-3.5 text-[#0071e3] group-hover:scale-110 transition-transform" />
                    Storage Racks A–D
                  </span>
                  <span className="text-[10px] text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-md font-mono">
                    32 Shelves
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenChargingBays) onOpenChargingBays();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-black/[0.04] transition-all text-left group"
                >
                  <span className="flex items-center gap-2 font-medium text-[#1d1d1f]">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    Charging Bays
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-semibold">
                    4 Ready
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenDocksPickups) onOpenDocksPickups();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-black/[0.04] transition-all text-left group"
                >
                  <span className="flex items-center gap-2 font-medium text-[#1d1d1f]">
                    <Box className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                    Docks &amp; Pickups
                  </span>
                  <span className="text-[10px] text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-md font-mono">
                    9 Stations
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Section 3: System & Support */}
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider px-3 mb-2">
                System &amp; Support
              </p>
              <div className="space-y-1 text-xs text-[#6e6e73]">
                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenProtocolSpec) onOpenProtocolSpec();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-black/[0.04] transition-all text-left group font-medium text-[#1d1d1f]"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-[#0071e3] group-hover:scale-110 transition-transform" />
                  <span>P2P Protocol Spec</span>
                </button>

                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenChaosLab) onOpenChaosLab();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-black/[0.04] transition-all text-left group font-medium text-[#1d1d1f]"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span>Chaos Lab Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Profile Pill */}
        <div className="pt-4 border-t border-black/[0.04]">
          <div
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenOperatorModal) onOpenOperatorModal();
            }}
            className={`flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center p-2' : 'justify-between p-2'} bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] cursor-pointer hover:border-black/[0.12] transition-all group`}
            title="Click to view operator profile"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  SP
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate">
                  <p className="text-xs font-bold text-[#1d1d1f] leading-tight truncate group-hover:text-[#0071e3] transition-colors">
                    Salung Prastyo
                  </p>
                  <p className="text-[10px] text-[#86868b] leading-tight">Fleet Operator</p>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <ChevronDown className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#1d1d1f]" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
