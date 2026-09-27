'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SynroLogo } from '@/components/common/SynroLogo';

// Exact SVG Logo from specification
const SpecLogo: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Logo"
  >
    <path
      fill="rgb(84, 84, 84)"
      d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
    />
  </svg>
);

export default function LandingPage() {
  // Toggle between Synro Fleet (Our Part) and Exact Spec Copy
  const [isSynroMode, setIsSynroMode] = useState(true);

  const navLinks = isSynroMode
    ? [
        { label: 'Fleet', href: '/' },
        { label: 'A* Routing', href: '/' },
        { label: 'Consensus', href: '/' },
        { label: 'Dashboard', href: '/' },
      ]
    : [
        { label: 'Story', href: '#story' },
        { label: 'Products', href: '#products' },
        { label: 'Help', href: '#help' },
        { label: 'Support', href: '#support' },
      ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f0ee] font-sans selection:bg-[#ff334b] selection:text-white">
      {/* Fullscreen Autoplaying Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
      />

      {/* Mode Switcher Floating Pill (Top-Right) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-1.5 p-1 rounded-full bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-medium">
        <button
          type="button"
          onClick={() => setIsSynroMode(true)}
          className={`px-3 py-1 rounded-full transition-all text-[11px] font-semibold ${
            isSynroMode
              ? 'bg-[#0f172a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Our Part (Synro)
        </button>
        <button
          type="button"
          onClick={() => setIsSynroMode(false)}
          className={`px-3 py-1 rounded-full transition-all text-[11px] font-semibold ${
            !isSynroMode
              ? 'bg-[#0f172a] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Exact Spec
        </button>
      </div>

      {/* Foreground Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar: Centered Pill-Style, Two Separate Pills */}
        <nav className="flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3">
          {/* Left Circular Logo Container */}
          <Link
            href="/"
            className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#EDEDED' }}
            title={isSynroMode ? 'Synro Autonomous Fleet' : 'Home'}
          >
            {isSynroMode ? (
              <SynroLogo variant="mark" size="sm" />
            ) : (
              <SpecLogo />
            )}
          </Link>

          {/* Right Pill Container */}
          <div
            className="flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3 shadow-xs"
            style={{ backgroundColor: '#EDEDED' }}
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero Content (Bottom-Left Aligned) */}
        <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-xs sm:max-w-sm">
            {/* 1. Badge Link */}
            <a
              href={isSynroMode ? '/' : '#shark-tank'}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3 group"
            >
              <span>
                {isSynroMode
                  ? 'Seen on Shark Tank India • Synro AMR Fleet'
                  : 'Seen on Shark Tank in India'}
              </span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>

            {/* 2. Headline */}
            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
              {isSynroMode
                ? 'Simple, smart multi-robot routing made for autonomous fleets.'
                : 'Simple, smart prosthetics made for people who keep fighting.'}
            </h1>

            {/* 3. Subtext */}
            <p className="text-[13px] text-gray-400 font-normal mb-3">
              {isSynroMode
                ? 'Reclaim your warehouse throughput now.'
                : 'Reclaim your movement now.'}
            </p>

            {/* 4. CTA Anchor */}
            <a
              href={isSynroMode ? '/' : '#try-free-fitting'}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group shadow-xs"
            >
              <span>
                {isSynroMode ? 'Launch Fleet Dashboard' : 'Try a free fitting'}
              </span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
