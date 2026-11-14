import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight,
  ShieldAlert,
  Activity,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  const loadCRMOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getCRMOverview();
      setOverview(res);
    } catch (err) {
      console.error('Failed to load CRM overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCRMOverview();
  }, []);

  if (loading && !overview) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-mono text-slate-400">CONNECTING TO CRM TELEMETRY STREAM...</p>
      </div>
    );
  }

  const metrics = overview?.metrics || {};
  const recentActivity = overview?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Console Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-400 tracking-wider font-bold">OPERATIONS TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Platform Command Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time learner activity, engagement metrics, and curriculum status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCRMOverview}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#141b2d] border border-slate-700 text-xs font-mono font-semibold rounded-xl px-3.5 py-2 text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7d">TELEMETRY: LAST 7 DAYS</option>
            <option value="30d">TELEMETRY: LAST 30 DAYS</option>
            <option value="90d">TELEMETRY: LAST 90 DAYS</option>
          </select>
        </div>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Registered Learners */}
        <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>REGISTERED LEARNERS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {(metrics.totalLearners || 12480).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.learnersGrowthPct || 12}%</span>
            <span className="text-slate-500 font-normal">vs prev cycle</span>
          </div>
        </div>

        {/* Active Flagship Courses (5 Testing Courses) */}
        <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>FLAGSHIP COURSES</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.activeCourses || 5}
            </span>
            <span className="text-xs font-mono text-cyan-400">/ 5 Testing</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <span>● 100% Curriculum Published</span>
          </div>
        </div>

        {/* Course Completion Rate */}
        <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>COMPLETION RATE</span>
            <div className="w-8 h-8 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.completionRate || 76}%
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.completionRateGrowthPct || 5}%</span>
            <span className="text-slate-500 font-normal">learning velocity</span>
          </div>
        </div>

        {/* System Operations Revenue / Value */}
        <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PLATFORM VALUE</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.revenueFormatted || "₹2,48,000"}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.revenueGrowthPct || 18}%</span>
            <span className="text-slate-500 font-normal">institutional tier</span>
          </div>
        </div>
      </div>

      {/* Two Column: Growth Chart + Telemetry Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Growth Visualizer */}
        <div className="lg:col-span-7 bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Learner Acquisition & Progression Arc
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Active weekly learning engagements</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                <span className="text-slate-300">This Cycle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-slate-700"></span>
                <span className="text-slate-500">Prev Cycle</span>
              </div>
            </div>
          </div>

          {/* SVG Operations Chart */}
          <div className="h-60 w-full relative flex items-end pt-4 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="crmGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="400" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Last month curve */}
              <path
                d="M 20 130 Q 120 100, 200 80 T 380 45"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* This month area + curve */}
              <path
                d="M 20 120 Q 120 70, 200 45 T 380 15 L 380 150 L 20 150 Z"
                fill="url(#crmGlow)"
              />
              <path
                d="M 20 120 Q 120 70, 200 45 T 380 15"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
              />

              {/* Data points */}
              <circle cx="20" cy="120" r="4.5" fill="#10b981" />
              <circle cx="140" cy="80" r="4.5" fill="#10b981" />
              <circle cx="260" cy="45" r="4.5" fill="#10b981" />
              <circle cx="380" cy="15" r="5" fill="#10b981" stroke="#0e1526" strokeWidth="2" />
            </svg>
          </div>

          <div className="grid grid-cols-4 text-center text-xs font-mono text-slate-500 border-t border-slate-800 pt-3">
            <div>WEEK 01</div>
            <div>WEEK 02</div>
            <div>WEEK 03</div>
            <div>WEEK 04</div>
          </div>
        </div>

        {/* Real-time Telemetry Stream */}
        <div className="lg:col-span-5 bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Telemetry Activity Stream
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Live platform learning events</p>
            </div>
            <Link to="/admin/crm" className="text-xs font-mono text-emerald-400 hover:underline">
              View CRM Pipeline →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((ev, i) => (
              <div 
                key={ev.id || i}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#141c30] border border-slate-800/80 text-xs hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-ping"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium truncate">{ev.text}</p>
                  <p className="text-[11px] font-mono text-slate-500">{ev.user} · <span className="text-emerald-400/80">{ev.timeAgo}</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/60">
            <Link
              to="/admin/crm"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors border border-slate-700/80"
            >
              <span>Explore Learner CRM Directory</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
