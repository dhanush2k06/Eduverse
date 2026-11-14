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
  BarChart2
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

  const activeCourse = enrollments.find(e => e.status === 'in-progress') || enrollments[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner matching reference1.png */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Learner'}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Keep learning, keep growing.</p>
        </div>

        {/* 7-Day Streak badge */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2 rounded-xl">
          <div className="text-2xl">🔥</div>
          <div>
            <div className="text-xs font-bold text-amber-900">7 Day Streak</div>
            <div className="text-[10px] text-amber-700">Excellent momentum</div>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards matching reference */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Enrolled Courses</p>
            <p className="text-2xl font-extrabold text-slate-900">{profile?.enrolledCoursesCount || 5}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Completed</p>
            <p className="text-2xl font-extrabold text-slate-900">{profile?.completedCoursesCount || 3}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Learning Hours</p>
            <p className="text-2xl font-extrabold text-slate-900">{profile?.learningHours || 24.5}h</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Skill Level</p>
            <p className="text-xl font-extrabold text-slate-900">{profile?.skillLevel || 'Intermediate'}</p>
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
              View All →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
              <img
                src={activeCourse?.thumbnailURL || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"}
                alt="Active course"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                {activeCourse?.courseTitle || 'Data Science Fundamentals'}
              </h3>
              <p className="text-xs text-slate-500">
                Module 3: Data Visualization
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Progress</span>
                  <span>{activeCourse?.progressPercentage || 75}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${activeCourse?.progressPercentage || 75}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <Link
              to="/learn/lessons/lesson-ds-dataviz"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 whitespace-nowrap text-center transition-all"
            >
              Continue
            </Link>
          </div>

          {/* Quick link to other flagship lesson */}
          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Also enrolled: <strong>The Basics of Critical Thinking</strong></span>
            <Link to="/learn/lessons/lesson-ct-basics" className="text-blue-600 font-semibold hover:underline">
              Read Lesson →
            </Link>
          </div>
        </div>

        {/* Upcoming Activities Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Upcoming Activities</h2>
            <Link to="/learn/my-courses" className="text-xs font-semibold text-blue-600 hover:underline">
              See All →
            </Link>
          </div>

          <div className="space-y-3">
            <Link
              to="/learn/activities/act-ds-quiz-1"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                  Quiz: Data Visualization
                </p>
                <p className="text-[10px] text-slate-400">Due Today • 8:00 PM</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Start
              </span>
            </Link>

            <Link
              to="/learn/activities/act-ct-assignment-1"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                  Assignment: Cognitive Bias Audit
                </p>
                <p className="text-[10px] text-slate-400">Due Tomorrow • 11:59 PM</p>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Review
              </span>
            </Link>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 opacity-70">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Peer Review Session
                </p>
                <p className="text-[10px] text-slate-400">Sat, Nov 15 • 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Your Skill Progress (Circular/Gauge charts matching reference) + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Your Skill Progress */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Skill Progress</h2>
              <p className="text-xs text-slate-500">Assessed evidence from completed quizzes and assignments</p>
            </div>
            <Link to="/skill-passport" className="text-xs font-semibold text-blue-600 hover:underline">
              View Details →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Circle 1 */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#2563eb" 
                    strokeWidth="6" 
                    strokeDasharray={201}
                    strokeDashoffset={201 * (1 - 0.78)} 
                    strokeLinecap="round"
                    fill="transparent" 
                  />
                </svg>
                <span className="absolute font-extrabold text-sm text-slate-900">78%</span>
              </div>
              <p className="text-xs font-bold text-slate-700">Data Science</p>
            </div>

            {/* Circle 2 */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#0284c7" 
                    strokeWidth="6" 
                    strokeDasharray={201}
                    strokeDashoffset={201 * (1 - 0.72)} 
                    strokeLinecap="round"
                    fill="transparent" 
                  />
                </svg>
                <span className="absolute font-extrabold text-sm text-slate-900">72%</span>
              </div>
              <p className="text-xs font-bold text-slate-700">Communication</p>
            </div>

            {/* Circle 3 */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#059669" 
                    strokeWidth="6" 
                    strokeDasharray={201}
                    strokeDashoffset={201 * (1 - 0.66)} 
                    strokeLinecap="round"
                    fill="transparent" 
                  />
                </svg>
                <span className="absolute font-extrabold text-sm text-slate-900">66%</span>
              </div>
              <p className="text-xs font-bold text-slate-700">Problem Solving</p>
            </div>
          </div>
        </div>

        {/* Achievements Badges */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Achievements</h2>
            <Link to="/skill-passport" className="text-xs font-semibold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">Quick Learner</p>
              <p className="text-[10px] text-slate-400">3 Courses in 30d</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">Top Performer</p>
              <p className="text-[10px] text-slate-400">94% Quiz Average</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">Course Star</p>
              <p className="text-[10px] text-slate-400">All Modules Complete</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

