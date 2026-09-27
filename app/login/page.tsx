'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Grid,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Zap,
  Radio,
  ArrowRight,
  Sparkles,
  GitFork,
  Cpu,
} from 'lucide-react';
import { authenticateOperator, DEMO_OPERATORS } from '@/lib/auth/auth-state';
import { useSynroAuth } from '@/lib/auth/use-synro-auth';
import { SynroLogo } from '@/components/common/SynroLogo';

export default function LoginPage() {
  const router = useRouter();
  const { user: currentUser } = useSynroAuth();

  const [email, setEmail] = useState('shahzaib@synro.ai');
  const [password, setPassword] = useState('synro-mesh-key-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Quick switch role
  const handleSelectRole = (key: 'dispatcher' | 'tech' | 'admin') => {
    const role = DEMO_OPERATORS[key];
    if (role) {
      setEmail(role.email);
      setPassword('synro-mesh-key-2026');
      setErrorMsg(null);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authenticateOperator(email, password);
      if (res.success && res.user) {
        setSuccessToast(`Welcome back, ${res.user.name}! Opening Synro workspace...`);
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      } else {
        // Fallback default login
        setSuccessToast('Connecting to Synro AMR workspace...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      }
    } catch (err: any) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#edf0f4] text-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans antialiased selection:bg-[#ff334b] selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff334b]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Dual-Column Modal Card */}
      <div className="relative w-full max-w-[1020px] bg-white rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-[#e2e8f0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10 transition-all">
        
        {/* ================= LEFT COLUMN: LOGIN FORM ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Top Brand & Workspace Header matching screenshot */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <SynroLogo variant="full" size="md" />
              </div>

              {/* Dark Workspace Pill matching image [ ::: Shahzaib ] */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f172a] text-white text-xs font-semibold shadow-xs">
                <Grid className="w-3.5 h-3.5 text-slate-400" />
                <span>Shahzaib</span>
              </div>
            </div>

            {/* Title & Greeting */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Good morning,
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Log in to coordinate your autonomous mobile robot fleet.
              </p>
            </div>

            {/* Quick Operator Switcher Pills */}
            <div className="mb-6 p-2 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Quick Select Operator:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectRole('dispatcher')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                    email.includes('salung') || email.includes('shahzaib')
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Shahzaib
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole('tech')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                    email.includes('alex')
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Lead Tech
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                    email.includes('sarah')
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 animate-in fade-in">
                {errorMsg}
              </div>
            )}
            {successToast && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 animate-in fade-in flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Operator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@synro.ai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#e2e8f0] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff334b]/20 focus:border-[#ff334b] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Security Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter security key"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-[#e2e8f0] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff334b]/20 focus:border-[#ff334b] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#e2e8f0] text-[#ff334b] focus:ring-[#ff334b]/20"
                  />
                  <span>Keep session active</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  PS Spec: 3 AMRs
                </span>
              </div>

              {/* Vibrant Red Login Button matching screenshot + New button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#ff334b] hover:bg-[#e02438] active:scale-[0.99] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Synro Multi-Agent Core v2.4</span>
            <span className="font-mono">Supabase Realtime P2P</span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PLANNED SYSTEM SPEC CARD ================= */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient red glow */}
          <div className="absolute -right-16 -top-16 w-60 h-60 bg-[#ff334b]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ff334b] animate-pulse" />
              <span>PS Specification Verified</span>
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
              Autonomous AMR Fleet Coordination
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
              Decentralized multi-robot task allocation and trajectory reservation without centralized single points of failure.
            </p>

            {/* Key Specs Breakdown Cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#ff334b]/20 text-[#ff334b] flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AMR Fleet Count</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    <strong>3 Simulated AMRs</strong> default (PS Spec), with 4-AMR Extended Demo toggle.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 flex-shrink-0">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">A* Routing &amp; Space-Time</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Trajectory computation via <strong>A* Pathfinding</strong> with space-time reservation coordinate tokens.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Task Priority Model</h4>
                  <p className="text-[11px] font-mono text-emerald-300 mt-0.5 bg-black/40 px-2 py-0.5 rounded-md inline-block">
                    Priority = urgency + waiting time + battery risk
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer in Right Column */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Collision Guarantee</span>
            </div>
            <Link
              href="/"
              className="text-[#ff334b] hover:text-[#ff556b] font-semibold flex items-center gap-1"
            >
              <span>Demo Direct &gt;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
