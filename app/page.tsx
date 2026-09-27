'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSynroAuth } from '@/lib/auth/use-synro-auth';
import { SimulationManager } from '@/lib/simulation/simulation-manager';
import { meshBus } from '@/lib/supabase/mesh-bus';
import {
  RobotState,
  WarehouseTask,
  WarehouseEvent,
  MapBlock,
  FleetMetrics,
} from '@/types/warehouse';

// Modern Reference UI Components
import { ModernHeader, ModernTab } from '@/components/dashboard/ModernHeader';
import { ModernKpiCards } from '@/components/dashboard/ModernKpiCards';
import { RecentMissionsCard } from '@/components/dashboard/RecentMissionsCard';
import { AutomationProtocolsCard } from '@/components/dashboard/AutomationProtocolsCard';
import { StorageOverviewCard } from '@/components/dashboard/StorageOverviewCard';
import { GlowingCopilotCard } from '@/components/dashboard/GlowingCopilotCard';
import { ProductivityTrendCard } from '@/components/dashboard/ProductivityTrendCard';
import { MissionFilesCard } from '@/components/dashboard/MissionFilesCard';

// Core Warehouse Simulation & Interactive Panels
import { WarehouseMap } from '@/components/dashboard/WarehouseMap';
import { FleetTelemetryTable } from '@/components/dashboard/FleetTelemetryTable';
import { AppleEventFeed } from '@/components/dashboard/AppleEventFeed';
import { RobotCard } from '@/components/dashboard/RobotCard';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { DemoControls } from '@/components/dashboard/DemoControls';

// Interactive Drawers & Modals
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { RobotInspectorDrawer } from '@/components/dashboard/RobotInspectorDrawer';
import { DispatchMissionModal } from '@/components/dashboard/DispatchMissionModal';
import { NotificationDrawer } from '@/components/dashboard/NotificationDrawer';
import { OperatorProfileModal } from '@/components/dashboard/OperatorProfileModal';
import { MeshSecurityModal } from '@/components/dashboard/MeshSecurityModal';
import { ProtocolSpecModal } from '@/components/dashboard/ProtocolSpecModal';
import { ChaosLabModal } from '@/components/dashboard/ChaosLabModal';
import { StorageRacksModal } from '@/components/dashboard/StorageRacksModal';
import { ChargingBaysModal } from '@/components/dashboard/ChargingBaysModal';
import { DocksPickupsModal } from '@/components/dashboard/DocksPickupsModal';

import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Zap,
  AlertOctagon,
  PlusCircle,
  CheckCircle2,
  Calendar,
  ChevronDown,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useSynroAuth();
  const [activeTab, setActiveTab] = useState<ModernTab>('overview');

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
    activeRobotsCount: 3,
    baselineAverageCompletionTime: 24.8,
    speedupPercentage: 29.0,
    negotiationMode: 'decentralized',
  });

  const [isRunning, setIsRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [simManager, setSimManager] = useState<SimulationManager | null>(null);
  const [isExtendedDemo, setIsExtendedDemo] = useState(false);

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [isChaosLabOpen, setIsChaosLabOpen] = useState(false);
  const [isStorageRacksOpen, setIsStorageRacksOpen] = useState(false);
  const [isChargingBaysOpen, setIsChargingBaysOpen] = useState(false);
  const [isDocksPickupsOpen, setIsDocksPickupsOpen] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reassignmentAlert, setReassignmentAlert] = useState<string | null>(null);
  const lastReassignmentIdRef = useRef<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const manager = SimulationManager.getInstance();
    setSimManager(manager);
    setIsExtendedDemo(manager.isExtendedDemo);

    manager.setMetricsListener((newMetrics) => {
      setMetrics({ ...newMetrics });
    });

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

      // Detect failure hand-off & task reassignment events to trigger visible alert
      const latestReassignment = snapshot.events.find((e) => e.type === 'reassignment');
      if (latestReassignment && latestReassignment.id !== lastReassignmentIdRef.current) {
        lastReassignmentIdRef.current = latestReassignment.id;
        setReassignmentAlert(latestReassignment.message);
        showToast(`🚨 ${latestReassignment.message}`);
      }
    });

    // Keyboard shortcut (⌘K or Ctrl+K)
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

  const handleToggleExtendedDemo = () => {
    if (!simManager) return;
    const nextVal = simManager.toggleExtendedDemo();
    setIsExtendedDemo(nextVal);
    showToast(
      nextVal
        ? 'Extended Demo: 4 AMRs simulated (PS spec = 3)'
        : 'PS Specification Mode: 3 AMRs active'
    );
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
    showToast('New mission broadcasted for distributed priority allocation');
  };

  const handleToggleBaseline = () => {
    if (!simManager) return;
    simManager.toggleBaselineMode();
    showToast(`Mode switched to: ${metrics.negotiationMode === 'decentralized' ? 'Stop-and-Wait Baseline' : 'Decentralized P2P'}`);
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
    <div className="min-h-screen bg-[#edf0f4] text-slate-900 font-sans antialiased selection:bg-[#ff334b] selection:text-white pb-12">
      {/* Outer Centered Shell */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* ================= 1. TOP NAVBAR (Matching Reference Image) ================= */}
        <ModernHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenNewTask={() => setIsDispatchModalOpen(true)}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenMenu={() => setIsChaosLabOpen(true)}
          onOpenOperatorModal={() => setIsOperatorModalOpen(true)}
        />


        {/* ================= 2. GREETING & STATUS BAR ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Good morning,
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Here&apos;s what&apos;s happening in your workspace today.
            </p>
          </div>

          {/* Quick Controls Bar: PS Spec Toggle, Sim Controls, CSV Export */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PS Spec 3 AMR Toggle Pill */}
            <button
              onClick={handleToggleExtendedDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-2xs whitespace-nowrap ${
                isExtendedDemo
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-[#e2e8f0] hover:border-slate-400'
              }`}
              title="Click to toggle between PS Spec (3 AMRs) and Extended Demo (4 AMRs)"
            >
              <span className={`w-2 h-2 rounded-full ${isExtendedDemo ? 'bg-amber-500 animate-pulse' : 'bg-[#ff334b]'}`} />
              <span>
                {isExtendedDemo ? 'Extended Demo: 4 AMRs (PS spec = 3)' : 'PS Spec: 3 AMRs'}
              </span>
            </button>

            {/* Sim Play/Pause */}
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                isRunning
                  ? 'bg-white text-slate-700 border border-[#e2e8f0] hover:border-slate-400'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Speed Pills */}
            <div className="flex items-center bg-white border border-[#e2e8f0] rounded-xl p-0.5 shadow-2xs text-xs font-semibold">
              {[1, 2, 3].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSetSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    speedMultiplier === speed ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Reset Sim */}
            <button
              onClick={handleReset}
              className="p-2 bg-white border border-[#e2e8f0] rounded-xl text-slate-500 hover:text-slate-900 transition-all shadow-2xs"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2e8f0] hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
              title="Export CSV Telemetry"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ================= TASK REASSIGNMENT ALERT BANNER ================= */}
        {reassignmentAlert && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-slate-900 flex items-center justify-between gap-3 shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff334b] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                !
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                    Task Reassigned • Disruption Recovery
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-red-200 text-red-600 font-bold">
                    P2P Consensus Hand-off
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {reassignmentAlert}
                </p>
              </div>
            </div>
            <button
              onClick={() => setReassignmentAlert(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW (EXACT SCREENSHOT DASHBOARD) ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-5">
            {/* ROW 1: 4 Metric Cards with Sparklines */}
            <ModernKpiCards
              metrics={metrics}
              onlineRobotsCount={onlineRobotsCount}
              totalRobotsCount={robots.length}
              isExtendedDemo={isExtendedDemo}
            />

            {/* ROW 2: 3 Columns (Recent Missions, Automation Protocols, Storage Overview) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RecentMissionsCard
                tasks={tasks}
                events={events}
                onSeeMore={() => setActiveTab('tasks')}
                onSelectTask={(id) => showToast(`Selected mission ${id}`)}
              />
              <AutomationProtocolsCard
                onSeeMore={() => setActiveTab('consensus')}
              />
              <StorageOverviewCard />
            </div>

            {/* ROW 3: 3 Columns (Glowing Dark Copilot Card, Productivity Trend Bar Chart, Mission Files) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <GlowingCopilotCard
                onAnalyzeData={() => showToast('Synro Copilot: All A* trajectories verified for zero collision.')}
                onSummarizeDoc={() => showToast('Synro Copilot: PS spec verified (3 AMRs, A* routing, priority formula).')}
                onSendMessage={(msg) => showToast(`Copilot received: ${msg}`)}
              />
              <ProductivityTrendCard speedupPercentage={metrics.speedupPercentage} />
              <MissionFilesCard onSeeMore={() => setActiveTab('tasks')} />
            </div>

            {/* ROW 4: Live Warehouse Grid & Scenario Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Warehouse Floor Grid &amp; Multi-Agent A* Pathing
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Space-Time Reservation Protocol • Live 18×12 Obstacle Avoidance
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleForceConflict}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#e2e8f0] rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    Force Conflict
                  </button>
                  <button
                    onClick={handleBlockAisle}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#e2e8f0] rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    Block Aisle (9,5)
                  </button>
                  <button
                    onClick={() => setIsDispatchModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#ff334b] hover:bg-[#e02438] text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    + Dispatch Mission
                  </button>
                </div>
              </div>

              {/* Floor Map */}
              <WarehouseMap
                robots={robots}
                tasks={tasks}
                mapBlocks={mapBlocks}
                onCellClick={handleCellClick}
                onRobotClick={(id) => setSelectedRobotId(id)}
              />

              {/* Fleet Telemetry Table */}
              <FleetTelemetryTable
                robots={robots}
                tasks={tasks}
                onFailRobot={(id) => handleFailRobot(id)}
                onSpawnTask={() => setIsDispatchModalOpen(true)}
                onInspectRobot={(id) => setSelectedRobotId(id)}
              />

              {/* Real-time P2P Consensus Stream */}
              <AppleEventFeed events={events} />
            </div>
          </div>
        )}

        {/* ================= TAB 2: FLOOR MAP ================= */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[22px] border border-[#e2e8f0] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Synro Warehouse Floor Grid (18×12)</h2>
                <p className="text-xs text-slate-500 font-medium">Click any corridor cell to inject obstacles. Click AMRs to inspect or simulate disruption.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleForceConflict}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold"
                >
                  Force Intersection Conflict
                </button>
                <button
                  onClick={handleBlockAisle}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold"
                >
                  Block Aisle (9,5)
                </button>
                <button
                  onClick={() => setIsDispatchModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#ff334b] hover:bg-[#e02438] text-white rounded-xl text-xs font-bold shadow-xs"
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
              onRobotClick={(id) => setSelectedRobotId(id)}
            />
          </div>
        )}

        {/* ================= TAB 3: AMR FLEET ================= */}
        {activeTab === 'fleet' && (
          <div className="space-y-5">
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

        {/* ================= TAB 4: CONSENSUS FEED ================= */}
        {activeTab === 'consensus' && (
          <div className="space-y-5">
            <AppleEventFeed events={events} />

            <div className="p-5 bg-white border border-[#e2e8f0] rounded-[22px] text-xs text-slate-600 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-sm">Decentralized Coordination Architecture:</h4>
              <p>
                1. <strong>A* Routing with Space-Time Reservation:</strong> AMRs compute trajectories locally via A* pathfinding and broadcast reservation tokens across the grid to avoid vertex and edge collisions.
              </p>
              <p>
                2. <strong>Priority-Driven Yielding:</strong> When trajectories overlap, the AMR with higher task priority proceeds; yielding robots replan with A* without stopping.
              </p>
              <p>
                3. <strong>Priority Allocation Model:</strong> <code>Priority = urgency + waiting time + battery risk</code> evaluated locally across the Supabase Realtime simulated P2P/MQTT layer.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 5: TASK QUEUE ================= */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-[22px] border border-[#e2e8f0] shadow-sm gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Task Allocation Queue</h3>
                <p className="text-xs text-slate-500 font-medium">{tasks.filter((t) => t.status !== 'done').length} active warehouse tasks</p>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(true)}
                className="px-4 py-2 bg-[#ff334b] hover:bg-[#e02438] text-white text-xs font-bold rounded-xl shadow-xs transition-all whitespace-nowrap"
              >
                + Dispatch New Mission
              </button>
            </div>

            {/* Priority Formula Display Banner */}
            <div className="p-4 bg-white rounded-[22px] border border-[#e2e8f0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff334b] animate-pulse" />
                <span className="text-xs font-bold text-slate-900">Priority Allocation Model:</span>
                <span className="font-mono text-xs font-bold text-[#ff334b] bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                  Priority = urgency + waiting time + battery risk
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Supabase (Realtime DB) — simulated P2P/MQTT message layer
              </span>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: Bidding / Allocation */}
              <div className="rounded-[22px] bg-white border border-[#e2e8f0] p-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-amber-700 uppercase">1. Bidding / Allocation</h4>
                  <span className="text-xs font-semibold text-slate-400">
                    {tasks.filter((t) => t.status === 'pending' || t.status === 'bidding').length}
                  </span>
                </div>
                <div className="space-y-2">
                  {tasks
                    .filter((t) => t.status === 'pending' || t.status === 'bidding')
                    .map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-900">
                          <span>{t.id}</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
                            {t.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Pickup: ({t.pickup_cell.x},{t.pickup_cell.y}) → Drop: ({t.dropoff_cell.x},{t.dropoff_cell.y})
                        </p>
                      </div>
                    ))}
                  {tasks.filter((t) => t.status === 'pending' || t.status === 'bidding').length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No pending tasks awaiting allocation.</p>
                  )}
                </div>
              </div>

              {/* Column 2: Active Transport */}
              <div className="rounded-[22px] bg-white border border-[#e2e8f0] p-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-blue-700 uppercase">2. Active Transport</h4>
                  <span className="text-xs font-semibold text-slate-400">
                    {tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="space-y-2">
                  {tasks
                    .filter((t) => t.status === 'assigned' || t.status === 'in_progress')
                    .map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-900">
                          <span>{t.id}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                            {t.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Carrier: <strong className="text-slate-900">{t.assigned_robot_id}</strong>
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Destination: ({t.dropoff_cell.x},{t.dropoff_cell.y})
                        </p>
                      </div>
                    ))}
                  {tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No active transports.</p>
                  )}
                </div>
              </div>

              {/* Column 3: Delivered */}
              <div className="rounded-[22px] bg-white border border-[#e2e8f0] p-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase">3. Delivered</h4>
                  <span className="text-xs font-semibold text-slate-400">
                    {tasks.filter((t) => t.status === 'done').length}
                  </span>
                </div>
                <div className="space-y-2 max-h-[360px] overflow-y-auto">
                  {tasks
                    .filter((t) => t.status === 'done')
                    .map((t) => (
                      <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{t.id}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: SPEEDUP BENCHMARK ================= */}
        {activeTab === 'benchmark' && (
          <div className="space-y-5">
            <MetricsPanel metrics={metrics} onToggleBaseline={handleToggleBaseline} />
          </div>
        )}

        {/* ================= TAB 7: SETTINGS & CHAOS LAB ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <DemoControls
              isRunning={isRunning}
              speedMultiplier={speedMultiplier}
              onTogglePlay={handleTogglePlay}
              onSetSpeed={handleSetSpeed}
              onForceConflict={handleForceConflict}
              onBlockAisle={handleBlockAisle}
              onFailRobot={handleFailRobot}
              onSpawnTask={() => setIsDispatchModalOpen(true)}
              onToggleBaseline={handleToggleBaseline}
              onReset={handleReset}
            />
          </div>
        )}

      </div>

      {/* ================= INTERACTIVE MODALS & DRAWERS ================= */}
      {/* 1. Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        robots={robots}
        onSelectRobot={(id) => setSelectedRobotId(id)}
        onNavigateTab={(tab) => setActiveTab(tab as ModernTab)}
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

      {/* 5. Operator Profile Modal */}
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

      {/* 7. Protocol Specification Modal */}
      <ProtocolSpecModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
      />

      {/* 8. Chaos Lab Modal */}
      <ChaosLabModal
        isOpen={isChaosLabOpen}
        onClose={() => setIsChaosLabOpen(false)}
        onForceConflict={handleForceConflict}
        onBlockAisle={handleBlockAisle}
        onFailRobot={handleFailRobot}
        onReset={handleReset}
        onShowToast={showToast}
      />

      {/* 9. Storage Racks Modal */}
      <StorageRacksModal
        isOpen={isStorageRacksOpen}
        onClose={() => setIsStorageRacksOpen(false)}
      />

      {/* 10. Charging Bays Modal */}
      <ChargingBaysModal
        isOpen={isChargingBaysOpen}
        onClose={() => setIsChargingBaysOpen(false)}
        robots={robots}
      />

      {/* 11. Docks & Pickups Modal */}
      <DocksPickupsModal
        isOpen={isDocksPickupsOpen}
        onClose={() => setIsDocksPickupsOpen(false)}
        onSpawnTask={() => setIsDispatchModalOpen(true)}
      />

      {/* Live Toast Floating Pill Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <div className="w-2 h-2 rounded-full bg-[#ff334b] animate-pulse flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
