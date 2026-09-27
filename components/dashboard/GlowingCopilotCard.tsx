'use client';

import React, { useState } from 'react';
import { Sparkles, Mic, Send, Paperclip, ArrowUpRight } from 'lucide-react';

interface GlowingCopilotCardProps {
  onAnalyzeData?: () => void;
  onSummarizeDoc?: () => void;
  onSendMessage?: (msg: string) => void;
}

export const GlowingCopilotCard: React.FC<GlowingCopilotCardProps> = ({
  onAnalyzeData,
  onSummarizeDoc,
  onSendMessage,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [responseMsg, setResponseMsg] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    if (onSendMessage) onSendMessage(inputVal);
    setResponseMsg(`Copilot: Analyzing "${inputVal}" — A* Multi-Agent Pathing and P2P consensus are optimal.`);
    setInputVal('');
    setTimeout(() => setResponseMsg(null), 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative rounded-[22px] bg-[#0a0a0a] p-4 sm:p-5 text-white shadow-xl overflow-hidden flex flex-col justify-between h-full border border-black/80">
      {/* Red Radial Glow on the Right Edge matching screenshot */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#ff334b]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-0 w-44 h-44 bg-[#ff334b]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span>Recent Chats</span>
            <span className="w-2 h-2 rounded-full bg-[#ff334b] animate-pulse" />
          </h3>
        </div>

        {/* Quick Chips matching screenshot */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => {
              if (onAnalyzeData) onAnalyzeData();
              setResponseMsg('Copilot: A* routing space-time collision risk is 0.00%. All aisles clear.');
              setTimeout(() => setResponseMsg(null), 4000);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-medium text-slate-200 transition-colors border border-white/5 whitespace-nowrap"
          >
            Analyze this data
          </button>
          <button
            onClick={() => {
              if (onSummarizeDoc) onSummarizeDoc();
              setResponseMsg('Copilot: PS Spec 3 AMRs active. Priority model = urgency + wait + battery.');
              setTimeout(() => setResponseMsg(null), 4000);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-medium text-slate-200 transition-colors border border-white/5 whitespace-nowrap"
          >
            Summarize this document
          </button>
        </div>

        {/* Feedback message if any */}
        {responseMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-[11px] text-slate-200 animate-in fade-in">
            {responseMsg}
          </div>
        )}
      </div>

      {/* Frosted Glass Input Container matching screenshot */}
      <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-3 shadow-lg">
        {/* Top Info Strip */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-medium">
          <span>200 credits remaining</span>
          <button className="text-[10px] font-semibold text-[#ff334b] hover:text-[#ff556b] transition-colors">
            Upgrade
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-black/30 rounded-xl px-2.5 py-1.5 border border-white/5">
          <input
            type="text"
            placeholder="Ask anything..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none flex-1 min-w-0"
          />

          <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
            <button className="p-1 hover:text-white transition-colors" title="Voice Input">
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSend}
              className="w-6 h-6 rounded-lg bg-[#ff334b] hover:bg-[#e02438] text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
              title="Send Prompt"
            >
              <Send className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
