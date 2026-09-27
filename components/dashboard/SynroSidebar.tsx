'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  MapPin,
  Bot,
  Radio,
  CheckSquare,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Plus,
  Shield,
  LifeBuoy,
  Sliders,
  ChevronRight,
  Sparkles,
  LogIn,
} from 'lucide-react';
import { SynroLogo } from '@/components/common/SynroLogo';
import { SynroUser } from '@/lib/auth/auth-state';

export type ModernTab = 'overview' | 'map' | 'fleet' | 'consensus' | 'tasks' | 'benchmark' | 'settings';

interface SynroSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  activeTab: ModernTab;
  setActiveTab: (tab: ModernTab) => void;
  user: SynroUser | null;
  activeRobotCount: number;
  totalTasks: number;
  onOpenNewTask: () => void;
  onOpenProtocolSpec?: () => void;
  onOpenChaosLab?: () => void;
  onOpenOperatorModal?: () => void;
}

export const SynroSidebar: React.FC<SynroSidebarProps> = ({
  isOpen,
  onClose,
  onToggle,
  activeTab,
  setActiveTab,
  user,
  activeRobotCount,
  totalTasks,
  onOpenNewTask,
  onOpenProtocolSpec,
  onOpenChaosLab,
  onOpenOperatorModal,
}) => {
  const navItems: {
    id: ModernTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'map',
      label: 'Floor Map',
      icon: MapPin,
      badge: '18×12',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'fleet',
      label: 'AMR Fleet',
      icon: Bot,
      badge: `${activeRobotCount} Active`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'consensus',
      label: 'Consensus Feed',
      icon: Radio,
      badge: 'Live',
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse',
    },
    {
      id: 'tasks',
      label: 'Task Queue',
      icon: CheckSquare,
      badge: `${totalTasks}`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'benchmark',
      label: 'Benchmark',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleSelectTab = (tab: ModernTab) => {
    setActiveTab(tab);
    // On small screens, automatically close drawer after selection
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (only on < lg) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Panel Container */}
      <aside
        aria-label="Sidebar Navigation"
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-[#e2e8f0] flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)] ${
          isOpen
            ? 'w-[270px] translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:pointer-events-none lg:border-r-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4">
          {/* ================= 1. SIDEBAR HEADER ================= */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            {/* Synro Brand Logo */}
            <div
              onClick={() => handleSelectTab('overview')}
              className="flex items-center cursor-pointer group"
              title="Synro Autonomous Fleet System"
            >
              <SynroLogo variant="full" size="md" />
            </div>

            {/* Close / Collapse Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4 hidden lg:block" />
              <X className="w-4 h-4 lg:hidden" />
            </button>
          </div>

          {/* ================= 2. QUICK ACTION: + NEW MISSION ================= */}
          <div className="mb-4">
            <button
              type="button"
              onClick={onOpenNewTask}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#ff334b] hover:bg-[#eb283f] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Mission</span>
            </button>
          </div>

          {/* ================= 3. MAIN NAVIGATION ITEMS ================= */}
          <div className="space-y-1 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1.5">
              Platform Views
            </span>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f172a] text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ================= 4. PROTOCOL & LAB CONTROLS ================= */}
          <div className="space-y-1 mb-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1.5">
              Tools &amp; Simulation
            </span>

            {onOpenProtocolSpec && (
              <button
                type="button"
                onClick={onOpenProtocolSpec}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LifeBuoy className="w-4 h-4 text-slate-400" />
                  <span>Protocol Spec</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">PS v2.4</span>
              </button>
            )}

            {onOpenChaosLab && (
              <button
                type="button"
                onClick={onOpenChaosLab}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  <span>Chaos Lab</span>
                </div>
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                  Faults
                </span>
              </button>
            )}

            <Link
              href="/landing"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Hero Landing Page</span>
              </div>
              <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                Live
              </span>
            </Link>
          </div>

          {/* ================= 5. FOOTER: OPERATOR PROFILE CARD ================= */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div
              onClick={onOpenOperatorModal}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 cursor-pointer transition-colors group"
              title="View operator workspace"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user?.initials || 'SH'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {user?.name || 'Shahzaib'}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate">
                    {user?.role || 'Fleet Operator'}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors flex-shrink-0" />
            </div>

            <div className="mt-2.5 px-2 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono">P2P Realtime Mesh</span>
              <Link
                href="/login"
                className="hover:text-slate-900 flex items-center gap-1 font-semibold transition-colors"
              >
                <LogIn className="w-3 h-3" />
                <span>Switch</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
