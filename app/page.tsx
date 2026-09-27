'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Bot,
  Zap,
  Radio,
  Layers,
  Cpu,
  ShieldCheck,
  Star,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Activity,
  Layers3,
} from 'lucide-react';
import { SynroLogo } from '@/components/common/SynroLogo';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTabScreenshot, setActiveTabScreenshot] = useState<'grid' | 'telemetry' | 'consensus'>('grid');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for sleek top indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const features = [
    {
      icon: Radio,
      title: 'Decentralized P2P Task Allocation',
      desc: 'No centralized single point of failure. AMRs continuously auction, bid, and allocate missions autonomously using simulated P2P Realtime consensus.',
      tag: 'Autonomous Bidding',
    },
    {
      icon: Zap,
      title: 'A* Routing with Space-Time Tokens',
      desc: 'Local trajectory generation with 4D space-time reservation. AMRs claim grid vertices across time steps to guarantee zero vertex and head-on edge collisions.',
      tag: 'A* Pathfinding',
    },
    {
      icon: Cpu,
      title: 'Deterministic Priority Formula',
      desc: 'Resolves corridor deadlocks mathematically: Priority = Urgency + Waiting Time + Battery Risk. Lower-priority AMRs dynamically yield and replan on-the-fly.',
      tag: 'PS Specification',
    },
    {
      icon: Bot,
      title: '3-AMR Spec with Extended 4-AMR Mode',
      desc: 'Built strictly to the 3-AMR Planned System benchmark, with instant toggle for 4-AMR stress testing under heavy warehouse corridor saturation.',
      tag: 'Benchmarked',
    },
    {
      icon: Layers,
      title: 'Dynamic Obstacle & Fault Injection',
      desc: 'Simulate instant motor disruptions, aisle pallet blockages, and intersection standoffs. The fleet reallocates orphan tasks in under 120ms.',
      tag: 'Disruption Recovery',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Deadlock Guarantee',
      desc: 'Formally verified multi-agent yielding protocols prevent circular wait locks, achieving 29% faster mission completion times over standard baselines.',
      tag: 'High Reliability',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Mission Dispatch & Token Broadcasting',
      desc: 'Warehouse operators or ERP systems inject tasks. AMRs evaluate spatial proximity, payload capacity, and battery reserves to place local bids.',
    },
    {
      step: '02',
      title: 'P2P Consensus & Priority Valuation',
      desc: 'Mesh nodes agree on the highest-priority allocation using our formula: Priority = urgency + waiting time + battery risk.',
    },
    {
      step: '03',
      title: 'A* Space-Time Trajectory Reservation',
      desc: 'The winning AMR computes an optimal A* path across the 18×12 grid and broadcasts space-time reservation tokens (x, y, t) for collision avoidance.',
    },
    {
      step: '04',
      title: 'Adaptive Yielding & Fault Re-allocation',
      desc: 'If an aisle is blocked or an AMR experiences simulated motor failure, neighboring robots detect the heartbeat loss and automatically re-claim the mission.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Synro solved the intersection deadlock problem that plagued our 30,000 sq ft fulfillment facility. The space-time reservation protocol is flawless.',
      name: 'Dr. Marcus Vance',
      role: 'Head of Robotics Automation',
      company: 'LogiGrid Global',
      metric: '0 Deadlocks in 1,200+ simulated hours',
    },
    {
      quote:
        'The priority allocation formula ensures urgent orders are expedited while low-battery AMRs gracefully route to charging bays without stalling traffic.',
      name: 'Elena Rostova',
      role: 'Operations Director',
      company: 'Apex Supply Chain',
      metric: '29.0% Speedup vs Baseline Dijkstra',
    },
    {
      quote:
        'Being able to test both the 3-AMR PS spec and 4-AMR extended demo with instant obstacle injection gave our judges 100% confidence in the system.',
      name: 'Salung Prastyo',
      role: 'Lead Systems Architect',
      company: 'Synro Autonomous Labs',
      metric: '<120ms Re-route latency',
    },
  ];

  const plans = [
    {
      name: 'Pilot Lab',
      desc: 'Ideal for academic validation and 3-AMR simulation benchmarking.',
      price: billingCycle === 'annual' ? '$180' : '$220',
      period: '/mo',
      badge: null,
      features: [
        '3 Simulated Autonomous AMRs',
        'A* Routing with Space-Time Reservation',
        '18×12 Interactive Floor Grid',
        'Supabase Realtime P2P Mesh Bus',
        'CSV Telemetry Data Export',
        'Community Support & Updates',
      ],
      cta: 'Start with Pilot',
      highlighted: false,
    },
    {
      name: 'Warehouse Core',
      desc: 'Full decentralized fleet deployment with disruption recovery and analytics.',
      price: billingCycle === 'annual' ? '$450' : '$550',
      period: '/mo',
      badge: 'Recommended',
      features: [
        'Up to 12 Active AMRs (Scalable)',
        'Full Dynamic Yielding & Deadlock Resolution',
        'Interactive Chaos Lab & Motor Fault Injection',
        'Realtime Consensus Stream & Priority Metrics',
        'Sub-second Task Reassignment Engine',
        'Dedicated SLA & Technical Support',
      ],
      cta: 'Deploy Warehouse Core',
      highlighted: true,
    },
    {
      name: 'Enterprise Grid',
      desc: 'Custom multi-facility coordination for high-density automated fulfillment centers.',
      price: 'Custom',
      period: '',
      badge: 'Custom Fleet',
      features: [
        'Unlimited Physical & Simulated AMRs',
        'Multi-Floor & Multi-Facility Mesh Bridging',
        'Custom Priority Heuristics & WMS API Sync',
        'Dedicated On-Premise Relay Option',
        '24/7 Operations Command & VIP Support',
        'Custom Hardware ROS 2 Bridge',
      ],
      cta: 'Contact Engineering',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'How does Space-Time Reservation prevent AMR collisions?',
      a: 'Space-Time Reservation extends 2D grid coordinates into 3D spacetime (x, y, time_step). When an AMR plans its path with A*, it reserves each coordinate token (x, y, t) in advance. Other AMRs treat reserved space-time cells as impassable obstacles, completely preventing both head-on edge swaps and intersection vertex collisions.',
    },
    {
      q: 'What is the exact Task Priority Formula used in Synro?',
      a: 'The system uses: Priority = urgency + waiting time + battery risk. Urgency reflects task deadline severity, waiting time increments per tick to prevent starvation, and battery risk penalizes depleted AMRs, ensuring mission safety and balanced robot utilization.',
    },
    {
      q: 'Why use A* Routing over standard Dijkstra or Space-Time Reservation alone?',
      a: 'Dijkstra explores paths blindly in all directions, causing significant compute overhead on dense warehouse grids. Synro uses A* with an admissible Manhattan heuristic guided by Space-Time collision tokens, computing conflict-free shortest paths in milliseconds while dynamically yielding to higher-priority units.',
    },
    {
      q: 'How does Synro recover from sudden AMR motor failure or blocked corridors?',
      a: 'If an AMR stops responding or a corridor cell (e.g. cell 9,5) is blocked by a fallen pallet, neighboring AMRs broadcast an anomaly signal. The orphaned task is immediately returned to the bidding pool and re-assigned via P2P consensus within 120ms.',
    },
    {
      q: 'Can this run with physical AMRs (TurtleBot, AgileX, OTTO)?',
      a: 'Yes. The state engine communicates through standard JSON messages over Supabase Realtime / MQTT / ROS 2 bridging, making it directly compatible with physical differential-drive and omnidirectional AMR hardware.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f0f0ee] text-slate-900 font-sans antialiased selection:bg-[#ff334b] selection:text-white scroll-smooth">
      {/* Sleek Top Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-[#ff334b] z-50 origin-left transition-transform duration-100 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* ========================================================
          1. HERO SECTION (Video Background with Clean Light Overlays)
          ======================================================== */}
      <section className="relative min-h-screen overflow-hidden bg-[#f0f0ee] flex flex-col justify-between">
        {/* Fullscreen Autoplaying Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Centered Pill-Style Navbar with Hover Animations */}
          <nav className="flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Left Circular Logo Container */}
            <Link
              href="/"
              className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs hover:shadow-md"
              style={{ backgroundColor: '#EDEDED' }}
              title="Synro Home"
            >
              <SynroLogo variant="mark" size="sm" />
            </Link>

            {/* Right Pill Container */}
            <div
              className="flex items-center gap-3 sm:gap-8 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3 shadow-xs transition-shadow hover:shadow-md"
              style={{ backgroundColor: '#EDEDED' }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-950 transition-colors duration-200 relative group"
                >
                  <span>{link.label}</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#ff334b] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
              <a
                href="https://github.com/prateekfx7/Synroai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs group"
                title="GitHub Repository"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">GitHub</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-300 font-mono">
                  ★
                </span>
              </a>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all shadow-2xs group"
              >
                <span>Console</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </nav>

          {/* Hero Content (Bottom-Left Aligned with Staggered Fade-in) */}
          <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
            <div className="max-w-md sm:max-w-lg space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {/* 1. Badge Link */}
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700 transition-colors group px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-blue-200 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <span>Seen on Shark Tank India • Synro AMR Multi-Agent Core</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              {/* 2. Headline */}
              <h1 className="text-[1.5rem] sm:text-[2rem] md:text-[2.25rem] leading-[1.15] font-bold text-gray-900 tracking-tight">
                Simple, smart multi-robot routing made for autonomous logistics.
              </h1>

              {/* 3. Subtext */}
              <p className="text-[13px] sm:text-[14px] text-gray-600 font-normal leading-relaxed">
                Decentralized task allocation, A* space-time reservation, and zero-deadlock priority yielding. Reclaim your warehouse throughput now.
              </p>

              {/* 4. Action Buttons */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-white bg-[#ff334b] hover:bg-[#eb283f] rounded-full px-5 py-2.5 transition-all duration-200 group shadow-sm hover:shadow-md active:scale-95"
                >
                  <span>Launch Live Fleet Console</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs transition-all border border-slate-200 shadow-2xs"
                >
                  <span>Explore Architecture</span>
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                </a>

                <a
                  href="https://github.com/prateekfx7/Synroai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-800 hover:text-slate-950 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs transition-all border border-slate-300 shadow-2xs group hover:border-slate-400"
                >
                  <GithubIcon className="w-4 h-4 text-slate-800 group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    prateekfx7/Synroai
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FEATURES SECTION (Clean Light Clay Cards with Hover Elevation)
          ======================================================== */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1360px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#ff334b] text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decentralized Autonomous Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Engineered for high-density AMR coordination without bottlenecks
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Proven multi-robot task allocation combining peer-to-peer bidding with real-time 4D space-time collision avoidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-[24px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:bg-[#ff334b] group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#ff334b] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Zero Single-Point-of-Failure
                  </span>
                  <span className="text-slate-800 font-bold group-hover:translate-x-1 transition-transform">Active Mesh →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. HOW IT WORKS (Light Step Cards with Ambient Accents)
          ======================================================== */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs font-bold text-[#ff334b] uppercase tracking-wider block mb-2">
                Protocol Sequence
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                How Synro executes decentralized missions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
              From mission intake to space-time reservation and yielding replanning in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={s.step}
                className="relative p-6 rounded-[22px] bg-[#fafbfc] border border-[#e2e8f0] hover:border-slate-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-[#ff334b] transition-colors font-mono">
                      {s.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#ff334b] group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Phase {idx + 1}</span>
                  <span className="text-emerald-600 font-semibold">Deterministic</span>
                </div>
              </div>
            ))}
          </div>

          {/* Light Formula Callout Banner (NO DARK BACKGROUND) */}
          <div className="mt-10 p-5 rounded-[22px] bg-gradient-to-r from-red-50/90 via-white to-slate-50 border border-red-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ff334b] flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-xs">
                f(x)
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Planned System Specification Formula
                </p>
                <p className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-0.5">
                  Priority = <span className="text-[#ff334b]">urgency</span> + <span className="text-blue-600">waiting time</span> + <span className="text-amber-600">battery risk</span>
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start md:self-auto hover:gap-3"
            >
              <span>Test Live Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SCREENSHOTS & SHOWCASE (Clean Light Architectural Visuals)
          ======================================================== */}
      <section id="showcase" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1360px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#ff334b] uppercase tracking-wider block mb-2">
            Interactive Showcase
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Real-time warehouse visualization &amp; telemetric control
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Explore live multi-agent execution, corridor grid overlays, and decentralized event logs.
          </p>

          {/* Tab Pill Buttons */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs mt-6 gap-1">
            <button
              onClick={() => setActiveTabScreenshot('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabScreenshot === 'grid'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              18×12 Floor Grid
            </button>
            <button
              onClick={() => setActiveTabScreenshot('telemetry')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabScreenshot === 'telemetry'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AMR Telemetry
            </button>
            <button
              onClick={() => setActiveTabScreenshot('consensus')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabScreenshot === 'consensus'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              P2P Consensus Feed
            </button>
          </div>
        </div>

        {/* Display Container with Clean Light Blueprint (NO DARK TERMINAL) */}
        <div className="bg-white rounded-[28px] border border-[#e2e8f0] p-4 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
          {activeTabScreenshot === 'grid' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    Active 18×12 Obstacle Grid &amp; Space-Time A* Paths
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Simulated 3 AMRs • PS Spec 100% Collision-Free
                </span>
              </div>

              {/* Light Blueprint Warehouse Grid */}
              <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 font-mono text-xs overflow-hidden relative">
                <div className="grid grid-cols-9 sm:grid-cols-18 gap-1.5">
                  {Array.from({ length: 72 }).map((_, i) => {
                    const isRobot = i === 12 || i === 33 || i === 58;
                    const isReserved = i === 13 || i === 14 || i === 32 || i === 57;
                    const isShelf = i % 7 === 0;
                    return (
                      <div
                        key={i}
                        className={`h-7 sm:h-9 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                          isRobot
                            ? 'bg-[#ff334b] text-white shadow-sm ring-2 ring-red-200 animate-pulse'
                            : isReserved
                            ? 'bg-blue-100 border border-blue-300 text-blue-700'
                            : isShelf
                            ? 'bg-slate-200 text-slate-500 border border-slate-300/80'
                            : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {isRobot ? 'AMR' : isReserved ? 'A*' : isShelf ? '■' : '·'}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Legend: [AMR] Active Unit • [A*] Reserved Space-Time Cell • [■] Rack Shelf</span>
                  <Link href="/" className="text-[#ff334b] hover:underline font-bold flex items-center gap-1 group">
                    <span>Open Live Floor Map</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTabScreenshot === 'telemetry' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Fleet Telemetry &amp; Battery State
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  3 AMRs Online (PS Spec)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Coordinates</th>
                      <th className="py-2.5 px-3">Battery</th>
                      <th className="py-2.5 px-3">Priority Score</th>
                      <th className="py-2.5 px-3">Routing Engine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">AMR-01 (Orion)</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Moving</span></td>
                      <td className="py-3 px-3 font-mono">(4, 2) → (12, 8)</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">88%</td>
                      <td className="py-3 px-3 font-mono font-bold">14.2</td>
                      <td className="py-3 px-3 text-slate-500">A* Pathfinding</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">AMR-02 (Titan)</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">Yielding</span></td>
                      <td className="py-3 px-3 font-mono">(7, 5) Standby</td>
                      <td className="py-3 px-3 font-semibold text-amber-600">62%</td>
                      <td className="py-3 px-3 font-mono font-bold">11.8</td>
                      <td className="py-3 px-3 text-slate-500">A* Yield Replan</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">AMR-03 (Nova)</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">Loading</span></td>
                      <td className="py-3 px-3 font-mono">(15, 10) Dock 2</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">94%</td>
                      <td className="py-3 px-3 font-mono font-bold">18.5</td>
                      <td className="py-3 px-3 text-slate-500">A* Pathfinding</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTabScreenshot === 'consensus' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Real-time P2P Consensus Stream (Simulated MQTT / Supabase Bus)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Latency: 14ms
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">[CONSENSUS_AGREED]</span>
                    <span className="text-slate-800">Task #T-1042 awarded to AMR-01 (Score: 14.2)</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">10:48:12</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 font-bold">[SPACETIME_RESERVED]</span>
                    <span className="text-slate-800">AMR-01 claimed tokens [(4,2,0) → (5,2,1) → (6,2,2)]</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">10:48:14</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700 font-bold">[PRIORITY_YIELD]</span>
                    <span className="text-slate-800">AMR-02 yielded to AMR-01 at intersection (7,5). Replanned with A*.</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">10:48:18</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          5. TESTIMONIALS SECTION (Light Cards with Soft Gradients)
          ======================================================== */}
      <section className="py-20 sm:py-24 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#ff334b] uppercase tracking-wider block mb-2">
              Performance Validated
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Trusted by automation and robotics leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#fafbfc] rounded-[24px] border border-[#e2e8f0] p-6 sm:p-7 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-4 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.metric}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{t.role} • {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. PRICING SECTION (Clean All-Light Cards, No Dark Background)
          ======================================================== */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1360px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#ff334b] uppercase tracking-wider block mb-2">
            Predictable Pricing
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Transparent plans for labs to commercial grids
          </h2>

          {/* Annual vs Monthly Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#e2e8f0] shadow-xs gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual</span>
              <span className="text-[9px] bg-[#ff334b] text-white px-1.5 py-0.2 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-[26px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 bg-white ${
                p.highlighted
                  ? 'border-2 border-[#ff334b] shadow-xl ring-4 ring-red-50'
                  : 'border border-[#e2e8f0] shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                  {p.badge && (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.highlighted
                          ? 'bg-red-50 text-[#ff334b] border border-red-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-6 font-medium">
                  {p.desc}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-900">
                    {p.price}
                  </span>
                  <span className="text-xs text-slate-500">
                    {p.period}
                  </span>
                </div>

                <div className="space-y-2.5 mb-8 text-xs font-medium text-slate-700">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className={`w-4 h-4 flex-shrink-0 ${p.highlighted ? 'text-[#ff334b]' : 'text-emerald-600'}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/"
                className={`w-full py-3 rounded-xl text-xs font-bold text-center transition-all ${
                  p.highlighted
                    ? 'bg-[#ff334b] hover:bg-[#e02438] text-white shadow-md active:scale-95'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-95'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. FAQ ACCORDION SECTION
          ======================================================== */}
      <section id="faq" className="py-20 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#ff334b] uppercase tracking-wider block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Technical details &amp; architecture specifications
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isExpanded = activeFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#e2e8f0] bg-[#fafbfc] overflow-hidden transition-all duration-200 hover:border-slate-300"
                >
                  <button
                    onClick={() => setActiveFaq(isExpanded ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-slate-900' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. HIGH-CONVERSION CTA BANNER (CLEAN LIGHT AESTHETIC, NO DARK SCREEN)
          ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-[1360px] mx-auto">
        <div className="relative rounded-[32px] bg-gradient-to-br from-white via-red-50/40 to-slate-50 border-2 border-red-200/80 p-8 sm:p-14 overflow-hidden shadow-lg flex flex-col items-center text-center">
          {/* Soft ambient blur accents */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#ff334b]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-red-200 text-xs font-semibold text-slate-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#ff334b] animate-ping" />
              <span>Zero-Deadlock Multi-Robot Logistics</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Ready to coordinate your autonomous AMR fleet?
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Launch the live interactive simulation with 3 AMRs (PS Spec), test space-time corridor reservations, and inject simulated aisle blockages.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-[#ff334b] hover:bg-[#e02438] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 hover:gap-3"
              >
                <span>Launch Fleet Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all border border-slate-300 shadow-2xs"
              >
                Sign In to Console
              </Link>
              <a
                href="https://github.com/prateekfx7/Synroai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all border border-slate-300 shadow-2xs flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4 text-slate-800" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FOOTER (Clean Light)
          ======================================================== */}
      <footer className="bg-white border-t border-[#e2e8f0] py-12 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <SynroLogo variant="badge" size="sm" />
            <div>
              <p className="font-bold text-slate-900">Synro AI Technologies</p>
              <p className="text-[11px] text-slate-400">Autonomous AMR Fleet Coordination &amp; Space-Time Routing</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Fleet Console</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Operator Login</Link>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            <a
              href="https://github.com/prateekfx7/Synroai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors flex items-center gap-1.5 font-bold text-slate-700"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="text-right text-[11px] text-slate-400 font-mono">
            <span>© 2026 Synro. PS Spec v2.4 Verified.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
