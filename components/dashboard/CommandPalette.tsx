'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Truck,
  Zap,
  AlertOctagon,
  Download,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  LayoutDashboard,
  MapPin,
  Radio,
  BarChart2,
  X,
  ArrowRight,
} from 'lucide-react';
import { RobotState } from '@/types/warehouse';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  robots: RobotState[];
  onSelectRobot: (robotId: string) => void;
  onNavigateTab: (tab: any) => void;
  onTogglePlay: () => void;
  isRunning: boolean;
  onForceConflict: () => void;
  onBlockAisle: () => void;
  onSpawnTask: () => void;
  onReset: () => void;
  onExportCsv: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  robots,
  onSelectRobot,
  onNavigateTab,
  onTogglePlay,
  isRunning,
  onForceConflict,
  onBlockAisle,
  onSpawnTask,
  onReset,
  onExportCsv,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'dispatch',
      title: 'Dispatch New Mission',
      category: 'Actions',
      icon: <PlusCircle className="w-4 h-4 text-emerald-600" />,
      perform: () => {
        onSpawnTask();
        onClose();
      },
    },
    {
      id: 'conflict',
      title: 'Force Intersection Conflict (Chaos Test)',
      category: 'Chaos Lab',
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      perform: () => {
        onForceConflict();
        onClose();
      },
    },
    {
      id: 'block',
      title: 'Block Aisle Cell (9, 5)',
      category: 'Chaos Lab',
      icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
      perform: () => {
        onBlockAisle();
        onClose();
      },
    },
    {
      id: 'play_pause',
      title: isRunning ? 'Pause Simulation' : 'Resume Simulation',
      category: 'Controls',
      icon: isRunning ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />,
      perform: () => {
        onTogglePlay();
        onClose();
      },
    },
    {
      id: 'export_csv',
      title: 'Export Fleet Telemetry (CSV)',
      category: 'Data',
      icon: <Download className="w-4 h-4 text-blue-600" />,
      perform: () => {
        onExportCsv();
        onClose();
      },
    },
    {
      id: 'reset',
      title: 'Reset Fleet Simulation',
      category: 'Controls',
      icon: <RotateCcw className="w-4 h-4 text-neutral-600" />,
      perform: () => {
        onReset();
        onClose();
      },
    },
    {
      id: 'view_overview',
      title: 'Go to Dashboard Overview',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-neutral-600" />,
      perform: () => {
        onNavigateTab('overview');
        onClose();
      },
    },
    {
      id: 'view_map',
      title: 'Go to Floor Grid Map',
      category: 'Navigation',
      icon: <MapPin className="w-4 h-4 text-neutral-600" />,
      perform: () => {
        onNavigateTab('map');
        onClose();
      },
    },
    {
      id: 'view_fleet',
      title: 'Go to AMR Fleet Units',
      category: 'Navigation',
      icon: <Truck className="w-4 h-4 text-neutral-600" />,
      perform: () => {
        onNavigateTab('fleet');
        onClose();
      },
    },
    {
      id: 'view_consensus',
      title: 'Go to P2P Gossip Feed',
      category: 'Navigation',
      icon: <Radio className="w-4 h-4 text-neutral-600" />,
      perform: () => {
        onNavigateTab('consensus');
        onClose();
      },
    },
    {
      id: 'view_benchmark',
      title: 'Go to Speedup Benchmark',
      category: 'Navigation',
      icon: <BarChart2 className="w-4 h-4 text-neutral-600" />,
      perform: () => {
        onNavigateTab('benchmark');
        onClose();
      },
    },
  ];

  const filteredRobots = robots.filter(
    (r) =>
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-24 bg-black/35 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-black/[0.08] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-black/[0.06]">
          <Search className="w-4 h-4 text-[#86868b] mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command, action, or robot ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full py-3.5 sm:py-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[65vh] sm:max-h-80 overflow-y-auto p-2 space-y-4">
          {/* Robots List */}
          {filteredRobots.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider px-3 mb-1">
                AMR Fleet Nodes
              </p>
              <div className="space-y-0.5">
                {filteredRobots.map((robot) => (
                  <button
                    key={robot.id}
                    onClick={() => {
                      onSelectRobot(robot.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-[#f5f6f8] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: robot.color || '#0071e3' }}
                      />
                      <span className="font-semibold text-[#1d1d1f]">{robot.id}</span>
                      <span className="text-[#86868b]">{robot.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
                      <span>{Math.round(robot.battery)}%</span>
                      <ArrowRight className="w-3 h-3 text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions List */}
          {filteredActions.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider px-3 mb-1">
                Commands & Scenarios
              </p>
              <div className="space-y-0.5">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.perform}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-[#f5f6f8] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      {action.icon}
                      <span className="text-[#1d1d1f] font-medium">{action.title}</span>
                    </div>
                    <span className="text-[10px] text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-full border border-black/[0.04]">
                      {action.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredRobots.length === 0 && filteredActions.length === 0 && (
            <div className="py-8 text-center text-xs text-[#86868b]">
              No commands matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#f5f5f7] border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#86868b]">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
