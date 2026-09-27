'use client';

import React, { useEffect, useState } from 'react';
import { SimulationManager } from '@/lib/simulation/simulation-manager';
import { meshBus } from '@/lib/supabase/mesh-bus';
import {
  RobotState,
  WarehouseTask,
  WarehouseEvent,
  MapBlock,
  FleetMetrics,
} from '@/types/warehouse';
import { WarehouseMap } from '@/components/dashboard/WarehouseMap';
import { AppleSidebar } from '@/components/dashboard/AppleSidebar';
import { AppleKpiCards } from '@/components/dashboard/AppleKpiCards';
import { ActivityMatrixChart } from '@/components/dashboard/ActivityMatrixChart';
import { ConsensusBreakdownCard } from '@/components/dashboard/ConsensusBreakdownCard';
import { FleetTelemetryTable } from '@/components/dashboard/FleetTelemetryTable';
import { AppleEventFeed } from '@/components/dashboard/AppleEventFeed';
import { SupabaseStatus } from '@/components/dashboard/SupabaseStatus';
import { RobotCard } from '@/components/dashboard/RobotCard';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { RobotInspectorDrawer } from '@/components/dashboard/RobotInspectorDrawer';
import { DispatchMissionModal } from '@/components/dashboard/DispatchMissionModal';
import { NotificationDrawer } from '@/components/dashboard/NotificationDrawer';
import { OperatorProfileModal } from '@/components/dashboard/OperatorProfileModal';
import { MeshSecurityModal } from '@/components/dashboard/MeshSecurityModal';
import { ProtocolSpecModal } from '@/components/dashboard/ProtocolSpecModal';
import { StorageRacksModal } from '@/components/dashboard/StorageRacksModal';
import { ChargingBaysModal } from '@/components/dashboard/ChargingBaysModal';
import { DocksPickupsModal } from '@/components/dashboard/DocksPickupsModal';
import { ChaosLabModal } from '@/components/dashboard/ChaosLabModal';
import {
  Search,
  Calendar,
  Download,
  Play,
  Pause,
  RotateCcw,
  Zap,
  AlertOctagon,
  PlusCircle,
  Bell,
  Shield,
  Layers,
  Box,
  CheckCircle2,
  ChevronDown,
  Check,
  PanelLeftOpen,
  Menu,
} from 'lucide-react';

type TabView = 'overview' | 'map' | 'fleet' | 'consensus' | 'tasks' | 'benchmark';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabView>('overview');
  const [middleView, setMiddleView] = useState<'map' | 'chart'>('map');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [robots, setRobots] = useState<RobotState[]>([]);
  const [tasks, setTasks] = useState<WarehouseTask[]>([]);
  const [events, setEvents] = useState<WarehouseEvent[]>([]);
  const [mapBlocks, setMapBlocks] = useState<MapBlock[]>([]);
  const [metrics, setMetrics] = useState<FleetMetrics>({
    collisions: 0,
    completedTasksCount: 0,
    averageTaskCompletionTime: 17.6,
    totalConflictsResolved: 0,
    totalReroutesCount: 0,
    deadlocksBroken: 0,
    activeRobotsCount: 4,
    baselineAverageCompletionTime: 24.8,
    speedupPercentage: 29.0,
    negotiationMode: 'decentralized',
  });

  const [isRunning, setIsRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [simManager, setSimManager] = useState<SimulationManager | null>(null);

  // Synro Interactive Modals & Drawers States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [isStorageRacksOpen, setIsStorageRacksOpen] = useState(false);
  const [isChargingBaysOpen, setIsChargingBaysOpen] = useState(false);
  const [isDocksPickupsOpen, setIsDocksPickupsOpen] = useState(false);
  const [isChaosLabOpen, setIsChaosLabOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeframeDropdown, setTimeframeDropdown] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Daily' | 'Shift 1' | 'Real-Time'>('Real-Time');
  const [calendarPopover, setCalendarPopover] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const manager = SimulationManager.getInstance();
    setSimManager(manager);

    manager.setMetricsListener((newMetrics) => {
      setMetrics({ ...newMetrics });
    });

    // Ensure initial snapshot is populated immediately
    const initialSnap = meshBus.getSnapshot();
    if (initialSnap.robots.length === 0) {
      manager.initFleet();
    } else {
      setRobots([...initialSnap.robots]);
      setTasks([...initialSnap.tasks]);
      setEvents([...initialSnap.events]);
      setMapBlocks([...initialSnap.mapBlocks]);
    }

    const unsubState = meshBus.subscribeState((snapshot) => {
      setRobots([...snapshot.robots]);
      setTasks([...snapshot.tasks]);
      setEvents([...snapshot.events]);
      setMapBlocks([...snapshot.mapBlocks]);
    });

    // Keyboard shortcut listener for Command Palette (⌘K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubState();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Demo Control Handlers
  const handleTogglePlay = () => {
    if (!simManager) return;
    if (isRunning) {
      simManager.pause();
      setIsRunning(false);
      showToast('Simulation paused');
    } else {
      simManager.resume();
      setIsRunning(true);
      showToast('Simulation resumed');
    }
  };

  const handleSetSpeed = (speed: number) => {
    if (!simManager) return;
    setSpeedMultiplier(speed);
    simManager.setSpeed(speed);
    showToast(`Simulation speed set to ${speed}x`);
  };

  const handleForceConflict = () => {
    if (!simManager) return;
    simManager.triggerIntersectionConflict();
    showToast('Forced intersection conflict between AMR-01 and AMR-02');
  };

  const handleBlockAisle = () => {
    if (!simManager) return;
    simManager.triggerBlockAisle(9, 5);
    showToast('Toggled dynamic corridor block at (9, 5)');
  };

  const handleFailRobot = (robotId: string = 'AMR-02') => {
    if (!simManager) return;
    simManager.triggerRobotFailure(robotId);
    showToast(`Toggled disruption state for ${robotId}`);
  };

  const handleSpawnTask = (pickup?: { x: number; y: number }, dropoff?: { x: number; y: number }) => {
    if (!simManager) return;
    simManager.spawnTask(pickup, dropoff);
    showToast('New mission broadcasted to Synro auction pool');
  };

  const handleToggleBaseline = () => {
    if (!simManager) return;
    simManager.toggleBaselineMode();
    showToast(`Mode switched to: ${metrics.negotiationMode === 'decentralized' ? 'Stop-and-Wait Baseline' : 'Decentralized P2P'}`);
  };

  const handleApplyOptimization = () => {
    if (!simManager) return;
    simManager.applyAutonomousOptimization();
    showToast('Synro Copilot: Autonomous optimization applied across active AMR fleet!');
  };

  const handleReset = () => {
    if (!simManager) return;
    simManager.resetSimulation();
    showToast('Simulation reset to initial state');
  };

  const handleCellClick = (x: number, y: number) => {
    if (!simManager) return;
    simManager.triggerBlockAisle(x, y);
    showToast(`Toggled corridor cell (${x}, ${y})`);
  };

  const handleRobotClick = (id: string) => {
    setSelectedRobotId(id);
  };

  const handleExportCsv = () => {
    const headers = ['RobotID', 'Name', 'Status', 'Battery', 'Coordinates', 'Heading', 'MissionID'];
    const rows = robots.map((r) => [
      r.id,
      r.name,
      r.status,
      `${Math.round(r.battery)}%`,
      `"(${r.x},${r.y})"`,
      r.heading,
      r.current_task_id || 'Idle',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synro_fleet_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Synro fleet telemetry CSV successfully');
  };

  const onlineRobotsCount = robots.filter((r) => r.status !== 'failed').length;
  const inspectedRobot = robots.find((r) => r.id === selectedRobotId) || null;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1d1d1f] flex font-sans antialiased selection:bg-[#0071e3]/20 relative">
      {/* 1. Left Sidebar: Synro */}
      <AppleSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRobotCount={robots.length}
        totalTasks={tasks.filter((t) => t.status !== 'done').length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenOperatorModal={() => setIsOperatorModalOpen(true)}
        onOpenProtocolSpec={() => setIsProtocolModalOpen(true)}
        onOpenStorageRacks={() => setIsStorageRacksOpen(true)}
        onOpenChargingBays={() => setIsChargingBaysOpen(true)}
        onOpenDocksPickups={() => setIsDocksPickupsOpen(true)}
        onOpenChaosLab={() => setIsChaosLabOpen(true)}
      />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#f5f6f8]/80 backdrop-blur-md px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-black/[0.04]">
          <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1600px] mx-auto w-full">
            {/* Left: Mobile (Menu + Logo) / Desktop (Breadcrumb) */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              {/* Mobile Hamburger Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 -ml-1 rounded-xl text-[#1d1d1f] hover:bg-black/[0.04] md:hidden flex items-center justify-center flex-shrink-0"
                title="Open navigation menu"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Logo: Clean & Simple */}
              <div
                onClick={() => setActiveTab('overview')}
                className="flex md:hidden items-center gap-2 cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#1d1d1f] flex items-center justify-center text-white shadow-xs font-black text-xs">
                  S
                </div>
                <span className="text-sm font-extrabold tracking-tight text-[#1d1d1f]">Synro</span>
              </div>

              {/* Desktop Sidebar Expand Trigger if Collapsed */}
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="hidden md:flex p-1 rounded-lg bg-white border border-black/[0.06] text-[#0071e3] hover:bg-neutral-50 shadow-xs mr-1"
                  title="Open sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}

              {/* Desktop Breadcrumbs */}
              <div className="hidden md:flex items-center gap-2 text-xs text-[#86868b]">
                <span
                  onClick={() => setActiveTab('overview')}
                  className="cursor-pointer hover:text-[#1d1d1f] transition-colors font-semibold text-[#1d1d1f]"
                >
                  Synro
                </span>
                <span className="text-[#a1a1a6]">&gt;</span>
                <span className="text-[#1d1d1f] font-semibold capitalize truncate">
                  {activeTab === 'overview' ? 'Fleet Operations' : activeTab}
                </span>
              </div>
            </div>

            {/* Right on Mobile: ONLY ID Pill */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOperatorModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-black/[0.06] shadow-xs text-xs font-medium text-[#1d1d1f] hover:bg-neutral-50 active:scale-95 transition-all"
                title="Operator ID"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-[#1d1d1f]">ID: OP-8492</span>
              </button>
            </div>

            {/* Right on Desktop: Search & Utilities */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              {/* Desktop Search Bar - Click opens Command Palette */}
              <div
                onClick={() => setIsCommandPaletteOpen(true)}
                className="relative flex items-center cursor-pointer group"
              >
                <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#0071e3] transition-colors" />
                <div className="pl-8 pr-12 py-1.5 rounded-full bg-white border border-black/[0.06] text-xs text-[#86868b] w-64 shadow-[0_1px_3px_rgba(0,0,0,0.03)] group-hover:border-black/[0.15] transition-all">
                  Search Synro robot, task...
                </div>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#86868b] bg-[#f5f5f7] border border-black/[0.06] px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </span>
              </div>

              {/* Notification Center Bell */}
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="p-2 rounded-full bg-white border border-black/[0.06] text-[#6e6e73] hover:text-[#1d1d1f] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative"
                title="Synro Notification Center"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* Security Shield Action */}
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="p-2 rounded-full bg-white border border-black/[0.06] text-[#6e6e73] hover:text-[#1d1d1f] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                title="Synro Mesh Cryptographic Security"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <SupabaseStatus />
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-3.5 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-4 sm:space-y-6">
          {/* Header Greeting & Controls Row: Welcome back only shown on Overview! */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              {activeTab === 'overview' ? (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
                      Welcome back, Salung
                    </h1>
                    <span className="text-[10px] font-bold bg-blue-50 text-[#0071e3] border border-blue-200/80 px-2 py-0.5 rounded-full uppercase">
                      Synro Core
                    </span>
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Decentralized Autonomous Mobile Robot Fleet • Real-time P2P Space-Time Consensus
                  </p>
                </>
              ) : activeTab === 'map' ? (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    Warehouse Floor Grid Map
                  </h1>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Live 18×12 Space-Time Multi-Agent Fleet Navigation
                  </p>
                </>
              ) : activeTab === 'fleet' ? (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    AMR Fleet Units &amp; Telemetry
                  </h1>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Autonomous Mobile Robot Edge Nodes • Hardware Status &amp; Diagnostics
                  </p>
                </>
              ) : activeTab === 'consensus' ? (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    P2P Gossip Feed &amp; Event Stream
                  </h1>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Decentralized Space-Time Reservation Logs • Zero Central Coordinator
                  </p>
                </>
              ) : activeTab === 'tasks' ? (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    Task Queue &amp; Distributed Auctions
                  </h1>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Vickrey-Clarke-Groves Autonomous Task Allocation Standard
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    Fleet Benchmark &amp; Baseline Verification
                  </h1>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Decentralized Edge P2P vs Stop-and-Wait Baseline Comparison
                  </p>
                </>
              )}
            </div>

            {/* Action Pills Strip - Touch swipeable on mobile */}
            <div className="w-full md:w-auto overflow-x-auto pb-1.5 -mb-1.5 flex items-center gap-2 touch-pan-x flex-nowrap md:flex-wrap flex-shrink-0">
              {/* Daily Filter Pill with working Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setTimeframeDropdown(!timeframeDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/[0.06] rounded-xl text-xs font-medium text-[#1d1d1f] shadow-sm hover:bg-neutral-50 transition-colors whitespace-nowrap"
                >
                  <span>{selectedTimeframe}</span>
                  <ChevronDown className="w-3 h-3 text-[#86868b]" />
                </button>

                {timeframeDropdown && (
                  <div className="absolute top-full mt-1.5 left-0 z-40 bg-white border border-black/[0.08] rounded-2xl shadow-xl p-1 w-32 animate-in fade-in duration-100">
                    {(['Real-Time', 'Daily', 'Shift 1'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setSelectedTimeframe(mode);
                          setTimeframeDropdown(false);
                          showToast(`Timeframe switched to ${mode}`);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedTimeframe === mode ? 'bg-[#f5f6f8] text-[#0071e3] font-semibold' : 'text-[#1d1d1f] hover:bg-neutral-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Pill with Calendar Popover */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setCalendarPopover(!calendarPopover)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/[0.06] rounded-xl text-xs font-medium text-[#1d1d1f] shadow-sm hover:bg-neutral-50 transition-colors whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#86868b]" />
                  <span>26 Sep 2026</span>
                </button>

                {calendarPopover && (
                  <div className="absolute top-full mt-1.5 right-0 z-40 bg-white border border-black/[0.08] rounded-2xl shadow-xl p-3 w-56 text-xs text-[#1d1d1f] animate-in fade-in duration-100">
                    <p className="font-semibold mb-2">Live Synro Shift</p>
                    <div className="text-[11px] text-[#6e6e73] space-y-1">
                      <p>Start: Today 08:00 AM</p>
                      <p>Uptime: 14h 22m (Continuous)</p>
                      <p>Mesh Heartbeats: 18,420</p>
                    </div>
                    <button
                      onClick={() => setCalendarPopover(false)}
                      className="mt-3 w-full py-1 bg-[#1d1d1f] text-white rounded-lg text-[11px] font-medium"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Simulation Play/Pause Toggle Pill */}
              <button
                onClick={handleTogglePlay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm flex-shrink-0 whitespace-nowrap ${
                  isRunning
                    ? 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pause Sim</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Sim</span>
                  </>
                )}
              </button>

              {/* Speed Multiplier Pills */}
              <div className="flex items-center bg-white border border-black/[0.06] rounded-xl p-0.5 shadow-sm text-xs flex-shrink-0">
                {[1, 2, 3].map((speed) => (
                  <button
                    key={`speed-${speed}`}
                    onClick={() => handleSetSpeed(speed)}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      speedMultiplier === speed
                        ? 'bg-[#1d1d1f] text-white font-semibold'
                        : 'text-[#86868b] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="p-1.5 bg-white border border-black/[0.06] rounded-xl text-[#86868b] hover:text-[#1d1d1f] shadow-sm transition-all flex-shrink-0"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Export CSV Pill Button - matching reference image */}
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex-shrink-0 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* OVERVIEW / UNIFIED DASHBOARD (Main View matching reference image) */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* 3. Top Row: 4 Metric KPI Cards */}
              <AppleKpiCards
                metrics={metrics}
                onlineRobotsCount={onlineRobotsCount}
                totalRobotsCount={robots.length}
              />

              {/* 4. Middle Row: 2 Columns (65% / 35%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                {/* Left Card: Warehouse Floor Grid & Trend Switcher */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-5 flex flex-col justify-between">
                  {/* Card Sub-header & View Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
                        Warehouse Fleet Floor &amp; Activity
                      </h2>
                      <p className="text-xs text-[#86868b]">
                        Live 18×12 Space-Time Grid • Space-Time Reservation Protocol
                      </p>
                    </div>

                    {/* View Switcher Pills */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#f5f5f7] p-0.5 rounded-xl border border-black/[0.04] text-xs font-medium w-full sm:w-auto justify-between sm:justify-start">
                        <button
                          onClick={() => setMiddleView('map')}
                          className={`px-3 py-1 rounded-lg transition-all text-center flex-1 sm:flex-initial ${
                            middleView === 'map'
                              ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                              : 'text-[#86868b] hover:text-[#1d1d1f]'
                          }`}
                        >
                          Floor Grid (Live SVG)
                        </button>
                        <button
                          onClick={() => setMiddleView('chart')}
                          className={`px-3 py-1 rounded-lg transition-all text-center flex-1 sm:flex-initial ${
                            middleView === 'chart'
                              ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                              : 'text-[#86868b] hover:text-[#1d1d1f]'
                          }`}
                        >
                          Activity Matrix (Dots)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Chaos Quick Action Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 mb-4 bg-[#f8fafc] border border-black/[0.04] rounded-xl text-xs overflow-x-auto touch-pan-x">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-[#86868b] font-medium text-[11px]">Chaos Triggers:</span>
                      <button
                        onClick={handleForceConflict}
                        className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap"
                      >
                        <Zap className="w-3 h-3 text-amber-600" />
                        Trigger Conflict
                      </button>
                      <button
                        onClick={handleBlockAisle}
                        className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap"
                      >
                        <AlertOctagon className="w-3 h-3 text-rose-600" />
                        Block Aisle (9,5)
                      </button>
                      <button
                        onClick={() => setIsDispatchModalOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap"
                      >
                        <PlusCircle className="w-3 h-3 text-emerald-600" />
                        Dispatch Task
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#86868b] flex-shrink-0">
                      <span>
                        Blocked Aisle Cells:{' '}
                        <strong className="text-[#1d1d1f]">
                          {mapBlocks.filter((b) => b.blocked).length}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Inner Content depending on selected middleView */}
                  {middleView === 'map' ? (
                    <WarehouseMap
                      robots={robots}
                      tasks={tasks}
                      mapBlocks={mapBlocks}
                      onCellClick={handleCellClick}
                      onRobotClick={handleRobotClick}
                    />
                  ) : (
                    <div className="py-2">
                      <ActivityMatrixChart totalCount={metrics.completedTasksCount * 180 + 10320} />
                    </div>
                  )}
                </div>

                {/* Right Card: Consensus Breakdown Card (Matching reference image) */}
                <div className="lg:col-span-4">
                  <ConsensusBreakdownCard
                    metrics={metrics}
                    onToggleBaseline={handleToggleBaseline}
                    onApplyOptimization={handleApplyOptimization}
                  />
                </div>
              </div>

              {/* 5. Bottom Row: Active Fleet Telemetry Table */}
              <FleetTelemetryTable
                robots={robots}
                tasks={tasks}
                onFailRobot={(id) => handleFailRobot(id)}
                onSpawnTask={() => setIsDispatchModalOpen(true)}
                onInspectRobot={(id) => setSelectedRobotId(id)}
              />

              {/* 6. Real-Time P2P Consensus Stream */}
              <AppleEventFeed events={events} />
            </div>
          )}

          {/* VIEW 2: FULL FLOOR GRID */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-[#1d1d1f]">Synro Floor Grid (Full Focus)</h2>
                  <p className="text-xs text-[#86868b]">Click any cell to block/clear aisles. Click AMRs to inspect or trigger fault injection.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleForceConflict}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold whitespace-nowrap"
                  >
                    Force Intersection Conflict
                  </button>
                  <button
                    onClick={handleBlockAisle}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold whitespace-nowrap"
                  >
                    Block Aisle (9,5)
                  </button>
                  <button
                    onClick={() => setIsDispatchModalOpen(true)}
                    className="px-3 py-1.5 bg-[#1d1d1f] hover:bg-[#333336] text-white rounded-xl text-xs font-semibold whitespace-nowrap"
                  >
                    + Dispatch Mission
                  </button>
                </div>
              </div>
              <WarehouseMap
                robots={robots}
                tasks={tasks}
                mapBlocks={mapBlocks}
                onCellClick={handleCellClick}
                onRobotClick={handleRobotClick}
              />
            </div>
          )}

          {/* VIEW 3: AMR FLEET UNITS */}
          {activeTab === 'fleet' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {robots.map((robot) => (
                  <RobotCard
                    key={robot.id}
                    robot={robot}
                    onToggleFailure={(id) => handleFailRobot(id)}
                  />
                ))}
              </div>
              <FleetTelemetryTable
                robots={robots}
                tasks={tasks}
                onFailRobot={(id) => handleFailRobot(id)}
                onSpawnTask={() => setIsDispatchModalOpen(true)}
                onInspectRobot={(id) => setSelectedRobotId(id)}
              />
            </div>
          )}

          {/* VIEW 4: P2P CONSENSUS GOSSIP */}
          {activeTab === 'consensus' && (
            <div className="space-y-6">
              <AppleEventFeed events={events} />
              <div className="p-4 bg-white border border-black/[0.06] rounded-2xl text-xs text-[#6e6e73] space-y-2">
                <h4 className="font-semibold text-[#1d1d1f]">Synro Decentralized Gossip Flow:</h4>
                <p>
                  1. <strong>Space-Time Reservation:</strong> Before stepping forward, each AMR broadcasts its intended coordinate reservation.
                </p>
                <p>
                  2. <strong>Priority-Driven Yielding:</strong> If two robots predict an overlapping space-time point, the AMR with higher task priority proceeds; the other recalculates its trajectory in-place.
                </p>
                <p>
                  3. <strong>Distributed Vickrey Auction:</strong> Tasks announced to the bus are evaluated locally by each AMR. The robot with the lowest cost (distance + battery) claims the payload without centralized intervention.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 5: TASK DISPATCH */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-black/[0.06] shadow-sm gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Synro Task Queue &amp; Auctions</h3>
                  <p className="text-xs text-[#86868b]">{tasks.filter((t) => t.status !== 'done').length} active warehouse tasks</p>
                </div>
                <button
                  onClick={() => setIsDispatchModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
                >
                  + Dispatch New Mission
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Pending & Bidding */}
                <div className="rounded-2xl bg-white border border-black/[0.06] p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/[0.04]">
                    <h4 className="text-xs font-bold text-amber-700 uppercase">1. Bidding / Auction</h4>
                    <span className="text-xs font-semibold text-[#86868b]">
                      {tasks.filter((t) => t.status === 'pending' || t.status === 'bidding').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.status === 'pending' || t.status === 'bidding')
                      .map((t) => (
                        <div key={t.id} className="p-3 bg-[#fafafa] border border-amber-200/60 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-semibold text-[#1d1d1f]">
                            <span>{t.id}</span>
                            <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                              {t.status}
                            </span>
                          </div>
                          <p className="text-[#86868b] text-[11px]">
                            Pickup: ({t.pickup_cell.x},{t.pickup_cell.y}) → Drop: ({t.dropoff_cell.x},{t.dropoff_cell.y})
                          </p>
                        </div>
                      ))}
                    {tasks.filter((t) => t.status === 'pending' || t.status === 'bidding').length === 0 && (
                      <p className="text-center text-xs text-[#a1a1a6] py-6">No pending auctions.</p>
                    )}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="rounded-2xl bg-white border border-black/[0.06] p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/[0.04]">
                    <h4 className="text-xs font-bold text-blue-700 uppercase">2. Active Transport</h4>
                    <span className="text-xs font-semibold text-[#86868b]">
                      {tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.status === 'assigned' || t.status === 'in_progress')
                      .map((t) => (
                        <div key={t.id} className="p-3 bg-[#fafafa] border border-blue-200/60 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-semibold text-[#1d1d1f]">
                            <span>{t.id}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                              {t.status}
                            </span>
                          </div>
                          <p className="text-[#86868b] text-[11px]">
                            Carrier: <strong className="text-[#1d1d1f]">{t.assigned_robot_id}</strong>
                          </p>
                          <p className="text-[#86868b] text-[11px]">
                            Destination: ({t.dropoff_cell.x},{t.dropoff_cell.y})
                          </p>
                        </div>
                      ))}
                    {tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length === 0 && (
                      <p className="text-center text-xs text-[#a1a1a6] py-6">No active transports.</p>
                    )}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="rounded-2xl bg-white border border-black/[0.06] p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/[0.04]">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase">3. Delivered</h4>
                    <span className="text-xs font-semibold text-[#86868b]">
                      {tasks.filter((t) => t.status === 'done').length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-[360px] overflow-y-auto">
                    {tasks
                      .filter((t) => t.status === 'done')
                      .map((t) => (
                        <div key={t.id} className="p-2.5 bg-[#fafafa] border border-black/[0.04] rounded-xl text-xs flex items-center justify-between">
                          <span className="font-medium text-[#1d1d1f]">{t.id}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: SPEEDUP BENCHMARK */}
          {activeTab === 'benchmark' && (
            <div className="space-y-6">
              <MetricsPanel metrics={metrics} onToggleBaseline={handleToggleBaseline} />
              <ActivityMatrixChart totalCount={metrics.completedTasksCount * 180 + 10320} />
            </div>
          )}
        </main>
      </div>

      {/* --- WORLD CLASS INTERACTIVE DRAWERS & MODALS --- */}

      {/* 1. Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        robots={robots}
        onSelectRobot={(id) => setSelectedRobotId(id)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onTogglePlay={handleTogglePlay}
        isRunning={isRunning}
        onForceConflict={handleForceConflict}
        onBlockAisle={handleBlockAisle}
        onSpawnTask={() => setIsDispatchModalOpen(true)}
        onReset={handleReset}
        onExportCsv={handleExportCsv}
      />

      {/* 2. AMR Inspector Drawer */}
      <RobotInspectorDrawer
        robot={inspectedRobot}
        onClose={() => setSelectedRobotId(null)}
        onToggleFailure={handleFailRobot}
        tasks={tasks}
      />

      {/* 3. Dispatch Mission Modal */}
      <DispatchMissionModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onSpawnTask={handleSpawnTask}
      />

      {/* 4. Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        events={events}
      />

      {/* 5. Operator Profile Modal (Salung Prastyo) */}
      <OperatorProfileModal
        isOpen={isOperatorModalOpen}
        onClose={() => setIsOperatorModalOpen(false)}
        onShowToast={showToast}
      />

      {/* 6. Mesh Security Modal */}
      <MeshSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onShowToast={showToast}
      />

      {/* 7. P2P Protocol Specification Modal */}
      <ProtocolSpecModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
      />

      {/* 8. Storage Racks Modal (Screenshot button) */}
      <StorageRacksModal
        isOpen={isStorageRacksOpen}
        onClose={() => setIsStorageRacksOpen(false)}
      />

      {/* 9. Charging Bays Modal (Screenshot button) */}
      <ChargingBaysModal
        isOpen={isChargingBaysOpen}
        onClose={() => setIsChargingBaysOpen(false)}
        robots={robots}
      />

      {/* 10. Docks & Pickups Modal (Screenshot button) */}
      <DocksPickupsModal
        isOpen={isDocksPickupsOpen}
        onClose={() => setIsDocksPickupsOpen(false)}
        onSpawnTask={() => setIsDispatchModalOpen(true)}
      />

      {/* 11. Chaos Lab Modal (Screenshot button) */}
      <ChaosLabModal
        isOpen={isChaosLabOpen}
        onClose={() => setIsChaosLabOpen(false)}
        onForceConflict={handleForceConflict}
        onBlockAisle={handleBlockAisle}
        onFailRobot={handleFailRobot}
        onReset={handleReset}
        onShowToast={showToast}
      />

      {/* 12. Live Apple Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-[#1d1d1f] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-xs font-medium flex items-center justify-between sm:justify-start gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-200 max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
