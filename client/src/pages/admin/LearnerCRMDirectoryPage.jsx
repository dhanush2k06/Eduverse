import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck,
  Eye,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { api } from '../../services/api';

export default function LearnerCRMDirectoryPage() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [followUpFilter, setFollowUpFilter] = useState('All');

  const fetchLearners = async () => {
    setLoading(true);
    try {
      const res = await api.getLearnersDirectory({
        search: searchTerm || undefined,
        status: statusFilter === 'All' ? undefined : statusFilter,
        followUpStatus: followUpFilter === 'All' ? undefined : followUpFilter
      });
      setLearners(res.learners || []);
    } catch (err) {
      console.error('Failed to load learners directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [statusFilter, followUpFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLearners();
  };

  const getFollowUpBadge = (status) => {
    switch (status) {
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60">
            <AlertCircle className="w-3 h-3" /> NEEDS ATTENTION
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60">
            <Clock className="w-3 h-3" /> CONTACTED
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" /> RESOLVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
            NORMAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              OPERATIONAL CRM PIPELINE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Learner CRM Directory
          </h1>
          <p className="text-xs text-slate-400">
            Search, filter, and monitor learner progression, engagement telemetry, and intervention status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLearners}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-2 rounded-xl shadow-sm">
            {learners.length} REGISTERED DOSSIERS
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0e1526] p-5 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by learner name, UID, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#141c30] border border-slate-700 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">ACCOUNT:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#141c30] border border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">ALL STATUSES</option>
              <option value="active">ACTIVE ONLY</option>
              <option value="inactive">INACTIVE ONLY</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">FOLLOW-UP:</span>
            <select
              value={followUpFilter}
              onChange={(e) => setFollowUpFilter(e.target.value)}
              className="bg-[#141c30] border border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">ALL CRM STATUSES</option>
              <option value="Needs Attention">NEEDS ATTENTION</option>
              <option value="Contacted">CONTACTED</option>
              <option value="Resolved">RESOLVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-slate-500">
            QUERYING TELEMETRY RECORDS...
          </div>
        ) : learners.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-mono text-sm text-slate-300">NO LEARNER RECORDS MATCH CRITERIA</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] border-b border-slate-800 font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Learner Profile</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Enrollments (5 Flagships)</th>
                  <th className="py-3.5 px-4">Tracked Hours</th>
                  <th className="py-3.5 px-4">Mastery Passport</th>
                  <th className="py-3.5 px-4">CRM Follow-Up</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {learners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-[#141c30]/50 transition-colors">
                    {/* Learner info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={learner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={learner.displayName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-sm leading-snug">{learner.displayName}</p>
                          <p className="text-[11px] font-mono text-slate-400">{learner.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-4 px-4 font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        learner.accountStatus === 'active'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        ● {learner.accountStatus}
                      </span>
                    </td>

                    {/* Courses */}
                    <td className="py-4 px-4 font-mono text-slate-300">
                      <span>{learner.enrolledCoursesCount} enrolled</span> / <span className="text-emerald-400 font-bold">{learner.completedCoursesCount} done</span>
                    </td>

                    {/* Learning Hours */}
                    <td className="py-4 px-4 font-mono font-semibold text-slate-200">
                      {learner.learningHours}h
                    </td>

                    {/* Skill Level */}
                    <td className="py-4 px-4 font-mono">
                      <span className="px-2 py-1 rounded bg-[#162138] text-cyan-400 border border-cyan-800/40 text-[10px] font-bold">
                        {learner.passportLevelTitle || 'Level 1 Explorer'}
                      </span>
                    </td>

                    {/* Follow up badge */}
                    <td className="py-4 px-4">
                      {getFollowUpBadge(learner.followUpStatus)}
                    </td>

                    {/* 360 View Action */}
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/admin/crm/learners/${learner.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-800/50 font-mono font-bold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360° Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
