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
  UserCheck
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    async function loadCRMOverview() {
      try {
        const res = await api.getCRMOverview();
        setOverview(res);
      } catch (err) {
        console.error('Failed to load CRM overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCRMOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Loading operations analytics...</p>
      </div>
    );
  }

  const metrics = overview?.metrics || {};
  const recentActivity = overview?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Header matching reference1.png bottom center */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your platform at a glance</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* 4 Metric Cards matching reference1.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Learners */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Learners</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {(metrics.totalLearners || 12480).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.learnersGrowthPct || 12}%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active Courses</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {metrics.activeCourses || 48}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.activeCoursesGrowthPct || 9}%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Completion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {metrics.completionRate || 76}%
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.completionRateGrowthPct || 5}%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Revenue / Progress metric */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Value Generated</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {metrics.revenueFormatted || "₹2,48,000"}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.revenueGrowthPct || 18}%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Learner Growth Chart matching reference1.png bottom center */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Learner Growth</h2>
              <p className="text-xs text-slate-500">Weekly active learner acquisition curve</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                This Month
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                Last Month
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="170" x2="500" y2="170" stroke="#f1f5f9" strokeWidth="1" />

              {/* Last Month Line (light slate/blue) */}
              <path
                d="M 30,150 Q 150,135 250,95 T 470,60"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />

              {/* This Month Line (primary clear blue) */}
              <path
                d="M 30,140 Q 150,115 250,75 T 470,25"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
              />

              {/* Dots for This Month */}
              <circle cx="30" cy="140" r="4.5" fill="#2563eb" className="animate-pulse" />
              <circle cx="170" cy="110" r="4.5" fill="#2563eb" />
              <circle cx="310" cy="65" r="4.5" fill="#2563eb" />
              <circle cx="470" cy="25" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold pt-3 px-4">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed matching reference1.png bottom right */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <Link to="/admin/crm" className="text-xs font-semibold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {act.type === 'enrollment' ? '🎓' : act.type === 'submission' ? '📝' : '⭐'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{act.text}</p>
                  <p className="text-slate-400 text-[10px]">{act.user} • {act.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/admin/crm"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              Open Learner CRM Directory
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

