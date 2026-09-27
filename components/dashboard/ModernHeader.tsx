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
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { SynroUser } from '@/lib/auth/auth-state';
import { SynroLogo } from '@/components/common/SynroLogo';

interface ModernHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: SynroUser | null;
  onOpenNewTask: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenOperatorModal: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  user,
  onOpenNewTask,
  onOpenSearch,
  onOpenNotifications,
  onOpenMenu,
  onOpenOperatorModal,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#edf0f4]/90 backdrop-blur-md transition-all py-3 px-2 sm:px-0 border-b border-slate-200/60 mb-2">
      <div className="flex items-center justify-between gap-3 max-w-full">
        {/* Left: Sidebar Open/Close Toggle + Brand Logo + Operator Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {/* Sidebar Open/Close Toggle Button */}
          <button
            type="button"
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-50 border border-[#e2e8f0] flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-2xs active:scale-95 cursor-pointer"
            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-slate-700" />
            ) : (
              <PanelLeft className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Official Synro Logo Mark */}
          <div className="flex items-center gap-2 cursor-pointer">
            <SynroLogo
              variant="badge"
              size="md"
              title="Synro Autonomous Fleet System"
            />
            <div className="hidden sm:block">
              <SynroLogo variant="full" size="sm" />
            </div>
          </div>

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

        {/* Right: + New Red Pill Button, Search, Bell, Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* + New Red Pill Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-[#ff334b] hover:bg-[#eb283f] text-white text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
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
