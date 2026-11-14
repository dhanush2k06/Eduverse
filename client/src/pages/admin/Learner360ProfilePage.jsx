import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Clock, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  Flame,
  Activity,
  ShieldCheck,
  Terminal,
  Cpu
} from 'lucide-react';
import { api } from '../../services/api';

export default function Learner360ProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadProfile = async () => {
    try {
      const res = await api.getLearnerProfile360(userId);
      setProfile(res.profile);
    } catch (err) {
      console.error('Failed to load learner 360:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      await api.addLearnerNote(userId, newNote.trim());
      setNewNote('');
      setFeedbackMsg('Note logged to dossier');
      setTimeout(() => setFeedbackMsg(''), 3000);
      loadProfile();
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleUpdateFollowUp = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.updateFollowUpStatus(userId, newStatus);
      setFeedbackMsg(`Status: ${newStatus}`);
      setTimeout(() => setFeedbackMsg(''), 3000);
      loadProfile();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-mono text-slate-400">RETRIEVING 360° LEARNER DOSSIER...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-mono font-bold text-white">LEARNER DOSSIER NOT FOUND</h2>
        <Link to="/admin/crm" className="text-sm font-mono text-emerald-400 hover:underline">
          ← Return to Learner CRM Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Return link */}
      <Link
        to="/admin/crm"
        className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>← RETURN TO LEARNER PIPELINE</span>
      </Link>

      {/* Top Profile Card */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={profile.displayName}
              className="w-18 h-18 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{profile.displayName}</h1>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  profile.accountStatus === 'active' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'
                }`}>
                  ● {profile.accountStatus}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">{profile.email} • UID: <span className="text-slate-300">{profile.id}</span></p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>Streak: <strong className="text-amber-400">{profile.streakDays || 0}d 🔥</strong></span>
                <span>Hours: <strong className="text-white">{profile.learningHours || 0}h</strong></span>
                <span>Passport: <strong className="text-cyan-400">{profile.passportLevelTitle || 'Level 1'}</strong></span>
              </div>
            </div>
          </div>

          {/* Follow-up Status Control */}
          <div className="bg-[#141c30] p-4 rounded-xl border border-slate-800 space-y-2 w-full md:w-auto font-mono">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold text-slate-300">CRM FOLLOW-UP STATUS:</span>
              {feedbackMsg && <span className="text-[10px] font-bold text-emerald-400">{feedbackMsg}</span>}
            </div>
            <div className="flex items-center gap-2">
              {['Needs Attention', 'Contacted', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateFollowUp(st)}
                  disabled={updatingStatus}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    profile.followUpStatus === st
                      ? st === 'Needs Attention' ? 'bg-amber-600 text-white shadow-md'
                        : st === 'Contacted' ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enrolled Courses Row */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Active Enrollments ({profile.enrollments?.length || 0} of 5 Flagships)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(profile.enrollments || []).map((enr) => (
              <div key={enr.id} className="p-4 rounded-xl border border-slate-800 bg-[#141c30]/60 space-y-2 font-mono">
                <div className="flex justify-between items-start text-xs">
                  <h3 className="font-bold text-slate-200 line-clamp-1">{enr.courseTitle}</h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    enr.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-cyan-950 text-cyan-400 border border-cyan-800/40'
                  }`}>
                    {enr.progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${enr.progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500">
                  Last active: {new Date(enr.lastAccessedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Notes & Activity Timeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Internal Admin CRM Notes (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-white font-mono font-bold text-sm uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3>Internal Staff Notes (Private CRM)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Staff-only confidential intervention notes. Never rendered in the student portal.
          </p>

          {/* Add note form */}
          <form onSubmit={handleAddNote} className="space-y-3 font-mono">
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record intervention, counseling notes, or quiz remediation details..."
              className="w-full p-3 bg-[#141c30] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={addingNote || !newNote.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{addingNote ? 'Saving...' : 'Append Dossier Note'}</span>
            </button>
          </form>

          {/* Notes Thread */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            {(profile.notes || []).length === 0 ? (
              <p className="text-xs font-mono text-slate-500 italic">No notes recorded yet in this dossier.</p>
            ) : (
              profile.notes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-[#141c30] border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between items-center font-bold text-slate-200">
                    <span className="text-emerald-400">STAFF: {n.author}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Timeline (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-[#0e1526] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-white font-mono font-bold text-sm uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3>Activity Telemetry Timeline</h3>
          </div>
          <p className="text-xs text-slate-400">
            Audit logs for lesson progressions, quiz evaluations, and login sessions.
          </p>

          <div className="space-y-3 pt-2">
            {(profile.timeline || []).length === 0 ? (
              <p className="text-xs font-mono text-slate-500 italic">No activity telemetry captured yet.</p>
            ) : (
              profile.timeline.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs border-l-2 border-emerald-500 pl-3 py-1 bg-[#141c30]/40 rounded-r-lg p-2 font-mono">
                  <div>
                    <p className="font-bold text-slate-200">
                      {act.lessonTitle || act.eventType.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(act.occurredAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
