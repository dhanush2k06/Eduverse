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
  ShieldCheck
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
      setFeedbackMsg('Note logged successfully');
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
      setFeedbackMsg(`Status updated to ${newStatus}`);
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
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Loading 360° learner profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Learner record not found</h2>
        <Link to="/admin/crm" className="text-sm text-blue-600 hover:underline">
          Return to Learner Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Return link */}
      <Link
        to="/admin/crm"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Learner CRM Directory
      </Link>

      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={profile.displayName}
              className="w-18 h-18 rounded-full object-cover border-4 border-slate-50 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">{profile.displayName}</h1>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  profile.accountStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {profile.accountStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">{profile.email} • ID: {profile.id}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                <span>Streak: <strong>{profile.streakDays || 0} days 🔥</strong></span>
                <span>Hours: <strong>{profile.learningHours || 0}h</strong></span>
                <span>Passport: <strong className="text-blue-600">{profile.passportLevelTitle || 'Level 1'}</strong></span>
              </div>
            </div>
          </div>

          {/* Follow-up Status Control */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 w-full md:w-auto">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-700">CRM Follow-Up Status:</span>
              {feedbackMsg && <span className="text-[11px] font-bold text-emerald-600">{feedbackMsg}</span>}
            </div>
            <div className="flex items-center gap-2">
              {['Needs Attention', 'Contacted', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateFollowUp(st)}
                  disabled={updatingStatus}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    profile.followUpStatus === st
                      ? st === 'Needs Attention' ? 'bg-amber-500 text-white shadow-sm'
                        : st === 'Contacted' ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
          <h2 className="text-sm font-bold text-slate-900">Enrolled Courses & Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(profile.enrollments || []).map((enr) => (
              <div key={enr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{enr.courseTitle}</h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    enr.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {enr.progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${enr.progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Last active: {new Date(enr.lastAccessedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Notes & Activity Timeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Internal Admin CRM Notes (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3>Internal CRM Notes</h3>
          </div>
          <p className="text-xs text-slate-500">
            Private operational notes for staff members. Not visible to the learner.
          </p>

          {/* Add note form */}
          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record phone follow-up, rubric feedback, or support intervention..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={addingNote || !newNote.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {addingNote ? 'Saving...' : 'Add Internal Note'}
            </button>
          </form>

          {/* Notes Thread */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {(profile.notes || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes recorded yet for this learner.</p>
            ) : (
              profile.notes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>{n.author}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Timeline (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3>Activity Telemetry Timeline</h3>
          </div>
          <p className="text-xs text-slate-500">
            Granular event history: lesson completions, quiz submissions, and logins.
          </p>

          <div className="space-y-4 pt-2">
            {(profile.timeline || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
            ) : (
              profile.timeline.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs border-l-2 border-blue-500 pl-3 py-1">
                  <div>
                    <p className="font-bold text-slate-900">
                      {act.lessonTitle || act.eventType.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
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

