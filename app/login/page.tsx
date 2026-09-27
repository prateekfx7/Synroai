'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  ArrowUpCircle,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Zap,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { authenticateOperator, DEMO_OPERATORS, SynroUser } from '@/lib/auth/auth-state';
import { useSynroAuth } from '@/lib/auth/use-synro-auth';

export default function LoginPage() {
  const router = useRouter();
  const { user: currentUser } = useSynroAuth();

  const [email, setEmail] = useState('salung.prastyo@synro.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Quick Trial Modal State
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');
  const [trialSuccess, setTrialSuccess] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('salung.prastyo@synro.ai');
  const [forgotSent, setForgotSent] = useState(false);

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
        setSuccessToast(`Welcome back, ${res.user.name}! Connecting to Mesh...`);
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please verify your operator email.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg('Authentication error. Falling back to local mesh profile.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf0f5] text-[#111827] flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans antialiased relative selection:bg-black selection:text-white">
      {/* Background Subtle Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      {/* Main Dual-Column Modal Card matching reference image */}
      <div className="relative w-full max-w-[1040px] bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.12)] border border-black/[0.06] overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10 transition-all">
        
        {/* ================= LEFT COLUMN: LOGIN FORM (Light/White) ================= */}
        <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white relative">
          <div>
            {/* Top Logo Icon (Geometric faceted brand mark matching reference) */}
            <div className="flex flex-col items-center sm:items-center text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 mb-4 relative flex items-center justify-center">
                {/* Modern Geometric Dual-Facet Logo */}
                <svg
                  className="w-10 h-10 text-[#0f1115] hover:scale-105 transition-transform duration-300"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 6L24 12V36L14 30V6Z"
                    fill="currentColor"
                  />
                  <path
                    d="M34 18L24 12V36L34 42V18Z"
                    fill="currentColor"
                    fillOpacity="0.82"
                  />
                  <path
                    d="M14 6L24 12L34 18L24 24L14 6Z"
                    fill="#3b82f6"
                    fillOpacity="0.4"
                  />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f1115] leading-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-[#6b7280] mt-1 font-medium">
                Please enter your details.
              </p>

              {/* Demo Operator Fast Role Selectors */}
              <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mr-1">
                  Demo:
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectRole('dispatcher')}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                    email.includes('salung')
                      ? 'bg-[#0f1115] text-white shadow-xs'
                      : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'
                  }`}
                  title="Salung Prastyo - Senior Fleet Controller"
                >
                  Dispatcher
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole('tech')}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                    email.includes('elena')
                      ? 'bg-[#0f1115] text-white shadow-xs'
                      : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'
                  }`}
                  title="Elena Rostova - Lead Hardware Tech"
                >
                  Fleet Tech
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                    email.includes('aris')
                      ? 'bg-[#0f1115] text-white shadow-xs'
                      : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'
                  }`}
                  title="Dr. Aris Thorne - Mesh Systems Director"
                >
                  Mesh Admin
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-sm mx-auto">
              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[#374151]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@synro.ai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e7eb] text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0f1115] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#374151]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter cryptographic key"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-[#e5e7eb] text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0f1115] focus:border-transparent transition-all shadow-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151] transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#4b5563] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSent(false);
                    setForgotModalOpen(true);
                  }}
                  className="font-bold text-[#111827] hover:underline transition-colors"
                >
                  Forgot Password
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#0f1115] hover:bg-black text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>

              {/* Free Trial / Signup Link */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#6b7280]">
                  Don&apos;t have account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTrialSuccess(false);
                      setTrialModalOpen(true);
                    }}
                    className="font-bold text-[#111827] underline hover:text-[#0071e3] transition-colors"
                  >
                    Request a free trial
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Left Floating Badge matching reference: "presented by [logo]" */}
          <div className="pt-8 sm:pt-6 flex items-center justify-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow">
              <span className="text-[11px] font-medium text-[#6b7280]">presented by</span>
              <div className="flex items-center gap-1">
                {/* Cyan/Blue Abstract Icon */}
                <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#0071e3] via-[#4f46e5] to-[#06b6d4] flex items-center justify-center text-white text-[9px] font-black">
                  M
                </div>
                <span className="text-xs font-bold tracking-tight text-[#111827]">SynroAI</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: DARK SHOWCASE (Matching Reference Image) ================= */}
        <div className="lg:col-span-6 bg-[#0f1116] p-6 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-hidden text-white border-t lg:border-t-0 lg:border-l border-white/[0.06]">
          
          {/* Subtle Ambient Radial Glow (soft lavender/pink gradient like reference) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[320px] bg-gradient-to-b from-[#8b5cf6]/20 via-[#ec4899]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[260px] bg-[#0071e3]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Container for 4 Interactive Cards */}
          <div className="relative z-10 space-y-3.5 max-w-md mx-auto w-full">
            
            {/* CARD 1: Visit our Mesh Protocol Spec */}
            <Link
              href="/dashboard?tab=consensus"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.18] transition-all shadow-sm duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                    Visit our Mesh Protocol Spec
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-normal truncate">
                    Understand decentralized P2P gossip &amp; consensus.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* CARD 2: Live AMR Fleet Telemetry */}
            <Link
              href="/dashboard?tab=fleet"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.18] transition-all shadow-sm duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                    Live AMR Fleet Telemetry
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-normal truncate">
                    Inspect space-time reservations &amp; battery levels.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* CARD 3: Check out Autonomous Dispatch */}
            <Link
              href="/dashboard?tab=tasks"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.18] transition-all shadow-sm duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                  <ArrowUpCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                    Check out Autonomous Dispatch
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-normal truncate">
                    Distributed Vickrey task auctions &amp; collision routing.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* CARD 4: Chaos Lab & Incident Simulation */}
            <Link
              href="/dashboard?tab=map"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.18] transition-all shadow-sm duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white/90 group-hover:text-white group-hover:scale-105 transition-all">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                    Chaos Lab &amp; Simulator
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-normal truncate">
                    Inject corridor blocks, robot faults &amp; deadlocks.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </Link>

            {/* Direct Guest Preview Link */}
            <div className="pt-2 text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                <span>Continue as Guest to Live Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: REQUEST FREE TRIAL ================= */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.08] text-left relative animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-[#111827]">Request SynroAI Mesh Trial</h3>
            <p className="text-xs text-[#6b7280] mt-1">
              Gain access to decentralized autonomous warehouse orchestration with 10 simulated AMR nodes.
            </p>

            {trialSuccess ? (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Trial Invitation Dispatched!</span>
                </div>
                <p>We sent cryptographic mesh trial credentials to {trialEmail || 'your email'}.</p>
                <button
                  onClick={() => setTrialModalOpen(false)}
                  className="mt-2 w-full py-2 bg-[#0f1115] text-white rounded-xl font-semibold text-xs"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTrialSuccess(true);
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="text-xs font-semibold text-[#374151] block mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={trialEmail}
                    onChange={(e) => setTrialEmail(e.target.value)}
                    placeholder="name@logistics-enterprise.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTrialModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0f1115] hover:bg-black text-white text-xs font-semibold"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: FORGOT PASSWORD ================= */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.08] text-left relative animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-[#111827]">Reset Mesh Password</h3>
            <p className="text-xs text-[#6b7280] mt-1">
              Enter your registered operator email to receive a secure password reset link.
            </p>

            {forgotSent ? (
              <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Reset Link Broadcasted</span>
                </div>
                <p>Instructions have been forwarded to {forgotEmail}.</p>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="mt-2 w-full py-2 bg-[#0f1115] text-white rounded-xl font-semibold text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSent(true);
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="text-xs font-semibold text-[#374151] block mb-1">
                    Operator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0f1115] hover:bg-black text-white text-xs font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f1115] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
}
