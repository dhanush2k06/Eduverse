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
  Eye
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Needs Attention
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Contacted
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Learner CRM Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Operational 360-degree learner tracking, engagement telemetry, and support interventions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            {learners.length} Active Records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by learner name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Account:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Support CRM:</span>
            <select
              value={followUpFilter}
              onChange={(e) => setFollowUpFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Follow-ups</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading directory...</div>
        ) : learners.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold">No learners found matching filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Learner</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Enrolled / Done</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-4">Skill Level</th>
                  <th className="py-3.5 px-4">Support Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {learners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Learner info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={learner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={learner.displayName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-snug">{learner.displayName}</p>
                          <p className="text-[11px] text-slate-400">{learner.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        learner.accountStatus === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {learner.accountStatus}
                      </span>
                    </td>

                    {/* Courses */}
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {learner.enrolledCoursesCount} enrolled / <span className="text-emerald-600 font-bold">{learner.completedCoursesCount} done</span>
                    </td>

                    {/* Learning Hours */}
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {learner.learningHours}h
                    </td>

                    {/* Skill Level */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-bold">
                        {learner.passportLevelTitle || 'Level 1'}
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View 360° Profile
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

