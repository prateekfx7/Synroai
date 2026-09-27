'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Battery,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Truck,
  Zap,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { RobotState, WarehouseTask } from '@/types/warehouse';

interface FleetTelemetryTableProps {
  robots: RobotState[];
  tasks: WarehouseTask[];
  onFailRobot: (robotId: string) => void;
  onSpawnTask: () => void;
  onInspectRobot?: (robotId: string) => void;
}

export const FleetTelemetryTable: React.FC<FleetTelemetryTableProps> = ({
  robots,
  tasks,
  onFailRobot,
  onSpawnTask,
  onInspectRobot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRobots, setSelectedRobots] = useState<string[]>([]);
  const [activeMenuRobotId, setActiveMenuRobotId] = useState<string | null>(null);

  const filteredRobots = robots.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedRobots.length === robots.length) {
      setSelectedRobots([]);
    } else {
      setSelectedRobots(robots.map((r) => r.id));
    }
  };

  const toggleSelectRobot = (id: string) => {
    if (selectedRobots.includes(id)) {
      setSelectedRobots(selectedRobots.filter((item) => item !== id));
    } else {
      setSelectedRobots([...selectedRobots, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'moving':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#a4d4c5]/25 text-[#1a3a3a] border border-[#a4d4c5]/50" title="Navigating via A* Routing">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a3a] animate-pulse" />
            A* En Route
          </span>
        );
      case 'waiting':
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]" title="Space-time reservation yield active">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
            A* Yielding
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ff6b5a]/15 text-[#991b1b] border border-[#ff6b5a]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b5a]" />
            Fault Injected
          </span>
        );
      case 'charging':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#b8a4ed]/20 text-[#4c1d95] border border-[#b8a4ed]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
            Docked Charging
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#faf5e8] text-[#525252] border border-[#e5e5e5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]" />
            Standby / Bidding
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[28px] border border-[#e5e5e5] shadow-xs p-4 sm:p-6">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#0a0a0a]">
            Synro AMR Fleet &amp; Mission Telemetry
          </h3>
          <p className="text-xs text-[#737373]">
            Edge Peer-to-Peer Heartbeats • Autonomous A* Rerouting Status
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AMR ID, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#faf5e8] border border-[#e5e5e5] text-xs text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#1a3a3a]/20 focus:border-[#0a0a0a] transition-all w-full sm:w-52"
            />
          </div>

          {/* Add Mission Pill Button */}
          <button
            onClick={onSpawnTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0a0a0a] hover:bg-[#262626] text-[#faf5e8] text-xs font-semibold transition-all shadow-xs active:scale-95 whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Mission</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto -mx-3.5 px-3.5 sm:mx-0 sm:px-0 touch-pan-x">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[11px] font-semibold text-[#737373] uppercase tracking-wider bg-[#faf5e8]/50">
              <th className="py-2.5 px-3 w-8 rounded-l-xl">
                <input
                  type="checkbox"
                  checked={selectedRobots.length === robots.length && robots.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#e5e5e5] text-[#0a0a0a] focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">AMR ID</th>
              <th className="py-2.5 px-3">Unit Model</th>
              <th className="py-2.5 px-3">Assigned Mission</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Battery</th>
              <th className="py-2.5 px-3">Position</th>
              <th className="py-2.5 px-3">P2P Health</th>
              <th className="py-2.5 px-3 text-right rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]/80 text-xs">
            {filteredRobots.map((robot) => {
              const isSelected = selectedRobots.includes(robot.id);
              const activeTask = tasks.find((t) => t.id === robot.current_task_id);
              const isMenuOpen = activeMenuRobotId === robot.id;

              return (
                <tr
                  key={robot.id}
                  className={`hover:bg-[#faf5e8]/40 transition-colors ${
                    isSelected ? 'bg-[#ffb084]/15' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRobot(robot.id)}
                      className="rounded border-[#e5e5e5] text-[#0a0a0a] focus:ring-0 cursor-pointer"
                    />
                  </td>
                  <td
                    onClick={() => onInspectRobot && onInspectRobot(robot.id)}
                    className="py-3 px-3 font-semibold text-[#0a0a0a] cursor-pointer hover:text-[#1a3a3a] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-[#0a0a0a]/10"
                        style={{ backgroundColor: robot.color || '#1a3a3a' }}
                      />
                      <span>{robot.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#0a0a0a]">
                    {robot.name}
                  </td>
                  <td className="py-3 px-3 text-[#525252]">
                    {activeTask ? (
                      <span className="font-mono text-[11px] text-[#0a0a0a] bg-[#faf5e8] px-2 py-0.5 rounded-md border border-[#e5e5e5]">
                        {activeTask.id} (→ {activeTask.dropoff_cell.x},{activeTask.dropoff_cell.y})
                      </span>
                    ) : robot.payload ? (
                      <span className="text-[#525252]">{robot.payload}</span>
                    ) : (
                      <span className="text-[#a3a3a3]">Idle / Awaiting Allocation</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(robot.status)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-[#faf5e8] border border-[#e5e5e5] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            robot.battery > 40
                              ? 'bg-[#1a3a3a]'
                              : robot.battery > 20
                              ? 'bg-[#f59e0b]'
                              : 'bg-[#ff6b5a]'
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#525252] font-semibold">
                        {Math.round(robot.battery)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#525252]">
                    ({robot.x}, {robot.y}) • {robot.heading}
                  </td>
                  <td className="py-3 px-3 text-[#525252]">
                    <span className="text-[#1a3a3a] font-semibold">Optimal</span>
                  </td>
                  <td className="py-3 px-3 text-right relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onFailRobot(robot.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                          robot.status === 'failed'
                            ? 'bg-[#a4d4c5]/30 text-[#1a3a3a] hover:bg-[#a4d4c5]/50 border-[#a4d4c5]'
                            : 'bg-[#ff6b5a]/15 text-[#991b1b] hover:bg-[#ff6b5a]/30 border-[#ff6b5a]/40'
                        }`}
                        title="Simulate Hardware Disruption"
                      >
                        {robot.status === 'failed' ? 'Recover' : 'Simulate Fault'}
                      </button>

                      {/* Dropdown Menu Trigger */}
                      <button
                        onClick={() => setActiveMenuRobotId(isMenuOpen ? null : robot.id)}
                        className="p-1 rounded-lg hover:bg-[#faf5e8] text-[#737373] transition-colors relative"
                        title="More Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Working Row Dropdown */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-10 z-40 bg-[#faf5e8] border border-[#e5e5e5] rounded-2xl shadow-xl p-1.5 w-40 text-left text-xs space-y-0.5 animate-in fade-in duration-100">
                          <button
                            onClick={() => {
                              if (onInspectRobot) onInspectRobot(robot.id);
                              setActiveMenuRobotId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white text-[#0a0a0a]"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#1a3a3a]" />
                            <span>Inspect Node</span>
                          </button>
                          <button
                            onClick={() => {
                              onFailRobot(robot.id);
                              setActiveMenuRobotId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white text-[#ff6b5a]"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{robot.status === 'failed' ? 'Reboot' : 'Fault Test'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
