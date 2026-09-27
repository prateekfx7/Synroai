'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Menu,
  Plus,
  Grid,
  ChevronDown,
} from 'lucide-react';
import { SynroUser } from '@/lib/auth/auth-state';
import { SynroLogo } from '@/components/common/SynroLogo';

export type ModernTab = 'overview' | 'map' | 'fleet' | 'consensus' | 'tasks' | 'benchmark' | 'settings';

interface ModernHeaderProps {
  activeTab: ModernTab;
  setActiveTab: (tab: ModernTab) => void;
  user: SynroUser | null;
  onOpenNewTask: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenOperatorModal: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenNewTask,
  onOpenSearch,
  onOpenNotifications,
  onOpenMenu,
  onOpenOperatorModal,
}) => {
  const tabs: { id: ModernTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'map', label: 'Floor Map' },
    { id: 'fleet', label: 'AMR Fleet' },
    { id: 'consensus', label: 'Consensus Feed' },
    { id: 'tasks', label: 'Task Queue' },
    { id: 'benchmark', label: 'Benchmark' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#edf0f4]/90 backdrop-blur-md transition-all py-3 px-2 sm:px-0 border-b border-slate-200/60 mb-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-full">
        {/* Top or Left Bar: Logo, Operator Pill & Right Action Buttons on Mobile */}
        <div className="flex items-center justify-between gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Red App Icon with Official Synro Mark */}
            <SynroLogo
              variant="badge"
              size="md"
              onClick={() => setActiveTab('overview')}
              title="Synro Autonomous Fleet System — Overview"
            />

            {/* Dark Workspace / Operator Pill matching image [ ::: Shahzaib ] */}
            <button
              type="button"
              onClick={onOpenOperatorModal}
              className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Switch operator workspace"
            >
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              <span className="tracking-tight">{user?.name || 'Shahzaib'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 -ml-0.5 opacity-70" />
            </button>
          </div>

          {/* On mobile screens < md, show the action buttons here */}
          <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenNewTask}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ff334b] hover:bg-[#eb283f] text-white text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New</span>
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border border-[#e2e8f0] flex items-center justify-center text-slate-600 transition-all shadow-2xs"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border border-[#e2e8f0] flex items-center justify-center text-slate-600 transition-all shadow-2xs relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff334b]" />
            </button>
          </div>
        </div>

        {/* Center: Floating Capsule Navigation Pill Container — ALWAYS visible and interactive */}
        <nav
          aria-label="Dashboard views"
          className="flex items-center bg-white border border-[#e2e8f0] p-1 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none flex-nowrap min-w-0"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`navbar-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer select-none font-medium flex-shrink-0 ${
                  isActive
                    ? 'bg-[#0f172a] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right on Desktop (>= md): + New Red Pill Button, Search, Bell, Menu */}
        <div className="hidden md:flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* + New Red Pill Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#ff334b] hover:bg-[#eb283f] text-white text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New</span>
          </button>

          {/* Search Icon Circle */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-slate-50 border border-[#e2e8f0] flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
            title="Search (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bell / Notification Icon Circle */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-slate-50 border border-[#e2e8f0] flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-2xs relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ff334b]" />
          </button>

          {/* Menu / Hamburger Icon Circle */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-slate-50 border border-[#e2e8f0] flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
            title="Workspace Menu & Controls"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
