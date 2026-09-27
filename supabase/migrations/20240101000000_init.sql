-- Autonomous Mobile Robots (AMR) Decentralized Fleet Coordination Schema
-- Database tables for Supabase

-- 1. Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Robots Table
-- Holds the latest broadcast state of each AMR
CREATE TABLE IF NOT EXISTS public.robots (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    x INTEGER NOT NULL DEFAULT 1,
    y INTEGER NOT NULL DEFAULT 1,
    heading TEXT NOT NULL DEFAULT 'E', -- 'N', 'S', 'E', 'W'
    status TEXT NOT NULL DEFAULT 'waiting', -- 'moving', 'waiting', 'blocked', 'charging', 'failed'
    battery NUMERIC NOT NULL DEFAULT 100.0,
    current_task_id TEXT,
    planned_path JSONB DEFAULT '[]'::jsonb, -- Array of {x, y, t}
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    deadlock_ticks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tasks Table
-- Holds warehouse transport tasks (pick -> drop)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    pickup_cell JSONB NOT NULL, -- {x: int, y: int}
    dropoff_cell JSONB NOT NULL, -- {x: int, y: int}
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'bidding', 'assigned', 'in_progress', 'done'
    assigned_robot_id TEXT REFERENCES public.robots(id) ON DELETE SET NULL,
    bids JSONB DEFAULT '{}'::jsonb, -- { "AMR-01": 12.5, "AMR-02": 18.0 }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 4. Events Table
-- Real-time audit log of fleet coordination events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'conflict', 'reroute', 'failure', 'reassignment', 'task_complete', 'bid_won', 'deadlock_break'
    robot_id TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Map Blocks Table
-- Dynamic obstacles such as blocked aisles, fallen pallets, or maintenance zones
CREATE TABLE IF NOT EXISTS public.map_blocks (
    id TEXT PRIMARY KEY,
    cell_x INTEGER NOT NULL,
    cell_y INTEGER NOT NULL,
    blocked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) - Permissive for prototype/demo
ALTER TABLE public.robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_blocks ENABLE ROW LEVEL SECURITY;

-- Create open access policies for public demo
CREATE POLICY "Public read robots" ON public.robots FOR SELECT USING (true);
CREATE POLICY "Public write robots" ON public.robots FOR ALL USING (true);

CREATE POLICY "Public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public write tasks" ON public.tasks FOR ALL USING (true);

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public write events" ON public.events FOR ALL USING (true);

CREATE POLICY "Public read map_blocks" ON public.map_blocks FOR SELECT USING (true);
CREATE POLICY "Public write map_blocks" ON public.map_blocks FOR ALL USING (true);

-- 7. Enable Supabase Realtime publication on all tables
-- This allows peer agents and the dashboard to receive real-time postgres_changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.robots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.map_blocks;

-- 8. Seed Initial AMR Fleet
INSERT INTO public.robots (id, name, x, y, heading, status, battery, current_task_id, planned_path, last_heartbeat)
VALUES
    ('AMR-01', 'Apex Rover 01', 1, 1, 'E', 'waiting', 95.0, NULL, '[]'::jsonb, NOW()),
    ('AMR-02', 'Titan Bot 02', 16, 1, 'W', 'waiting', 90.0, NULL, '[]'::jsonb, NOW()),
    ('AMR-03', 'Scout Cart 03', 1, 10, 'E', 'waiting', 88.0, NULL, '[]'::jsonb, NOW()),
    ('AMR-04', 'Vanguard 04', 16, 10, 'W', 'waiting', 98.0, NULL, '[]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Initial Warehouse Tasks
INSERT INTO public.tasks (id, pickup_cell, dropoff_cell, status, assigned_robot_id, bids)
VALUES
    ('TASK-101', '{"x": 4, "y": 3}', '{"x": 16, "y": 10}', 'pending', NULL, '{}'::jsonb),
    ('TASK-102', '{"x": 13, "y": 7}', '{"x": 2, "y": 1}', 'pending', NULL, '{}'::jsonb),
    ('TASK-103', '{"x": 7, "y": 5}', '{"x": 16, "y": 2}', 'pending', NULL, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 10. Initial Welcome Event
INSERT INTO public.events (type, robot_id, message)
VALUES
    ('system', 'FLEET', 'Decentralized AMR Fleet Simulation initialized with 4 autonomous agents.');
