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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            En Route
          </span>
        );
      case 'waiting':
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Yielding / P2P
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Fault Injected
          </span>
        );
      case 'charging':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Docked Charging
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Standby / Bidding
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-5">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
            Synro AMR Fleet &amp; Mission Telemetry
          </h3>
          <p className="text-xs text-[#86868b]">
            Edge Peer-to-Peer Heartbeats • Autonomous Rerouting Status
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AMR ID, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#f5f6f8] border border-black/[0.06] text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all w-full sm:w-52"
            />
          </div>

          {/* Add Mission Pill Button */}
          <button
            onClick={onSpawnTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-medium transition-all shadow-sm active:scale-95 whitespace-nowrap flex-shrink-0"
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
            <tr className="border-b border-black/[0.04] text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={selectedRobots.length === robots.length && robots.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-neutral-300 text-[#0071e3] focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">AMR ID</th>
              <th className="py-2.5 px-3">Unit Model</th>
              <th className="py-2.5 px-3">Assigned Mission</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Battery</th>
              <th className="py-2.5 px-3">Position</th>
              <th className="py-2.5 px-3">P2P Health</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] text-xs">
            {filteredRobots.map((robot) => {
              const isSelected = selectedRobots.includes(robot.id);
              const activeTask = tasks.find((t) => t.id === robot.current_task_id);
              const isMenuOpen = activeMenuRobotId === robot.id;

              return (
                <tr
                  key={robot.id}
                  className={`hover:bg-[#f9fafb] transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRobot(robot.id)}
                      className="rounded border-neutral-300 text-[#0071e3] focus:ring-0 cursor-pointer"
                    />
                  </td>
                  <td
                    onClick={() => onInspectRobot && onInspectRobot(robot.id)}
                    className="py-3 px-3 font-semibold text-[#1d1d1f] cursor-pointer hover:text-[#0071e3] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: robot.color || '#0071e3' }}
                      />
                      <span>{robot.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#1d1d1f]">
                    {robot.name}
                  </td>
                  <td className="py-3 px-3 text-[#6e6e73]">
                    {activeTask ? (
                      <span className="font-mono text-[11px] text-[#1d1d1f] bg-[#f5f5f7] px-2 py-0.5 rounded border border-black/[0.04]">
                        {activeTask.id} (→ {activeTask.dropoff_cell.x},{activeTask.dropoff_cell.y})
                      </span>
                    ) : robot.payload ? (
                      <span className="text-[#6e6e73]">{robot.payload}</span>
                    ) : (
                      <span className="text-[#a1a1a6]">Idle / Awaiting Auction</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(robot.status)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            robot.battery > 40
                              ? 'bg-emerald-500'
                              : robot.battery > 20
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#6e6e73] font-medium">
                        {Math.round(robot.battery)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#6e6e73]">
                    ({robot.x}, {robot.y}) • {robot.heading}
                  </td>
                  <td className="py-3 px-3 text-[#6e6e73]">
                    <span className="text-emerald-600 font-medium">Optimal</span>
                  </td>
                  <td className="py-3 px-3 text-right relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onFailRobot(robot.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          robot.status === 'failed'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        }`}
                        title="Simulate Hardware Disruption"
                      >
                        {robot.status === 'failed' ? 'Recover' : 'Simulate Fault'}
                      </button>

                      {/* Dropdown Menu Trigger */}
                      <button
                        onClick={() => setActiveMenuRobotId(isMenuOpen ? null : robot.id)}
                        className="p-1 rounded-lg hover:bg-neutral-100 text-[#86868b] transition-colors relative"
                        title="More Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Working Row Dropdown */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-10 z-40 bg-white border border-black/[0.08] rounded-2xl shadow-xl p-1.5 w-40 text-left text-xs space-y-0.5 animate-in fade-in duration-100">
                          <button
                            onClick={() => {
                              if (onInspectRobot) onInspectRobot(robot.id);
                              setActiveMenuRobotId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-[#1d1d1f]"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                            <span>Inspect Node</span>
                          </button>
                          <button
                            onClick={() => {
                              onFailRobot(robot.id);
                              setActiveMenuRobotId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-rose-600"
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
