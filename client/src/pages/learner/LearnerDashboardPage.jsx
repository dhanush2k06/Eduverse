import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award, 
  Flame, 
  ArrowRight, 
  FileText, 
  CheckSquare, 
  Sparkles, 
  Star, 
  TrendingUp,
  BarChart2,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function LearnerDashboardPage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profRes, enrRes] = await Promise.all([
          api.getMyProfile(),
          api.getMyEnrollments()
        ]);
        setProfile(profRes.user);
        setEnrollments(enrRes.enrollments || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter(e => e.status === 'completed').length;
  const activeCourse = enrollments.find(e => e.status === 'in-progress') || enrollments[0];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Learner'}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your research-backed courses and verifiable skill passport.
          </p>
        </div>

        {/* Streak badge */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2 rounded-xl">
          <div className="text-2xl">🔥</div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              {profile?.streakDays || 1} Day Streak
            </div>
            <div className="text-[10px] text-amber-700">Keep up the momentum</div>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Enrolled Courses</p>
            <p className="text-2xl font-extrabold text-slate-900">{enrolledCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Completed</p>
            <p className="text-2xl font-extrabold text-slate-900">{completedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Learning Hours</p>
            <p className="text-2xl font-extrabold text-slate-900">{profile?.learningHours || 0}h</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Skill Level</p>
            <p className="text-xl font-extrabold text-slate-900">{profile?.passportLevelTitle || 'Level 1 Explorer'}</p>
          </div>
        </div>
      </div>

      {/* Continue Learning + Upcoming Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Continue Learning Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Continue Learning</h2>
            <Link to="/learn/my-courses" className="text-xs font-semibold text-blue-600 hover:underline">
              View All Courses →
            </Link>
          </div>

          {activeCourse ? (
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                <img
                  src={activeCourse?.thumbnailURL || "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80"}
                  alt={activeCourse.courseTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {activeCourse.courseTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeCourse.status === 'completed' ? 'Course Completed' : 'In Progress'}
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Progress</span>
                    <span>{activeCourse.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${activeCourse.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <Link
                to={`/learn/lessons/lesson-ct-basics`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 whitespace-nowrap text-center transition-all"
              >
                Resume Lesson
              </Link>
            </div>
          ) : (
            <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-3">
              <Compass className="w-10 h-10 text-blue-500 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">No Active Courses Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Enroll in one of our 5 flagship courses to start building practical, verifiable skills.
                </p>
              </div>
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Browse 5 Flagship Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Explore research-backed curriculum:</span>
            <Link to="/explore" className="text-blue-600 font-semibold hover:underline">
              View Flagship Courses →
            </Link>
          </div>
        </div>

        {/* Upcoming Activities Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Flagship Quizzes & Checks</h2>
            <Link to="/explore" className="text-xs font-semibold text-blue-600 hover:underline">
              Explore All →
            </Link>
          </div>

          <div className="space-y-3">
            <Link
              to="/learn/activities/act-ct-quiz-1"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                  Quiz: Critical Thinking & Logic
                </p>
                <p className="text-[10px] text-slate-400">5 Questions • Immediate Scoring</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Start Check
              </span>
            </Link>

            <Link
              to="/learn/activities/act-ds-quiz-1"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                  Quiz: Data Storytelling Integrity
                </p>
                <p className="text-[10px] text-slate-400">5 Questions • Tufte Principles</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Start Check
              </span>
            </Link>
          </div>
        </div>

      </div>

      {/* Your Skill Progress & Passport */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Verified Skill Passport</h2>
            <p className="text-xs text-slate-500">Mastery badges unlocked through completed assessments</p>
          </div>
          <Link to="/skill-passport" className="text-xs font-semibold text-blue-600 hover:underline">
            View Skill Passport Portfolio →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Critical Reasoning</p>
              <p className="text-[11px] text-slate-500">Kahneman Dual-Process</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Data Integrity</p>
              <p className="text-[11px] text-slate-500">Visual Principles</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Principled Negotiation</p>
              <p className="text-[11px] text-slate-500">Harvard BATNA Model</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
