import React from 'react';
import { FlaskConical, AlertCircle } from 'lucide-react';

export default function UnderTestingBanner({ mode = 'auto' }) {
  // If auto, detect dark theme or CRM port
  const isDark = mode === 'dark' || (mode === 'auto' && (
    typeof window !== 'undefined' && (
      window.location.port === '5174' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.pathname.startsWith('/crm')
    )
  ));

  return (
    <div 
      className={`w-full py-2.5 px-4 text-center border-t select-none transition-colors z-50 ${
        isDark 
          ? 'bg-[#0a0f1d] border-amber-500/30 text-amber-400' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
      role="status"
      aria-label="Testing Environment Notification"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs font-mono font-medium tracking-wide">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold uppercase text-[10px]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          Under Testing
        </span>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <span className="text-[11px] sm:text-xs">
          Notice: This portal is currently in active evaluation &amp; testing mode. Safeguards and testing telemetry are enabled.
        </span>
      </div>
    </div>
  );
}
