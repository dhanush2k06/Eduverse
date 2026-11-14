import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  MessageSquare, 
  Users, 
  Lightbulb, 
  UserCheck, 
  ShieldCheck, 
  Compass, 
  BookOpen, 
  BarChart3, 
  Award, 
  Star, 
  Clock, 
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';
import { api } from '../../services/api';

const categoryIconMap = {
  "Thinking & Intelligence": Brain,
  "Communication": MessageSquare,
  "Interpersonal Skills": Users,
  "Creativity & Innovation": Lightbulb,
  "Personal Development": UserCheck,
  "Life Skills": ShieldCheck,
  "Exploration": Compass
};

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, coursesRes] = await Promise.all([
          api.getCategories(),
          api.getCourses({ status: 'Published' })
        ]);
        setCategories(catsRes.categories || []);
        setPopularCourses((coursesRes.courses || []).slice(0, 4));
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Empirical & Research-Backed Curriculum</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Learn Beyond <br />
                <span className="text-blue-600">Your Domain</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Explore. Learn. Grow. — with research-backed courses, structured reading, and practical real-world frameworks.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm transition-all"
                >
                  Explore Courses
                </Link>
              </div>

              {/* Stats badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-500 border-t border-slate-200/60 max-w-lg">
                <div>
                  <span className="block text-lg font-bold text-slate-900">12,400+</span>
                  Active Learners
                </div>
                <div className="border-l border-slate-200 pl-8">
                  <span className="block text-lg font-bold text-slate-900">100%</span>
                  Research Cited
                </div>
                <div className="border-l border-slate-200 pl-8">
                  <span className="block text-lg font-bold text-slate-900">4.8 / 5</span>
                  Learner Satisfaction
                </div>
              </div>
            </div>

            {/* Right Hero Visual matching reference image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glowing backdrop circle */}
                <div className="absolute -top-12 -left-12 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                {/* Main image card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    alt="Student holding laptop smiling"
                    className="w-full h-[430px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Badge 1: 7-Day Streak */}
                  <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2.5">
                    <span className="text-xl">🔥</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">7 Day Streak</p>
                      <p className="text-[10px] text-slate-500 font-medium">Keep learning daily</p>
                    </div>
                  </div>

                  {/* Floating Badge 2: Verified Skill */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Level 2 Learner</p>
                        <p className="text-[10px] text-slate-500">Critical Thinking Verified</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      94% Score
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Explore Skill Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Skill Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Discover courses across 7+ powerful foundational disciplines</p>
          </div>
          <Link to="/explore" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.name] || Brain;
            return (
              <Link
                key={cat.id}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Learn Beyond Your Domain? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Learn Beyond Your Domain?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Build a well-rounded skill set for a smarter, more adaptable you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Research-Backed Content</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every lesson cites peer-reviewed studies, epistemological standards, and reputable academic literature.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Interactive Learning</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Focused reading, structured block callouts, infographics, downloadable worksheets, and knowledge quizzes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Track Your Progress</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Measure your skill mastery with completion rates, streak tracking, and objective quiz score evaluations.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Earn Skill Passport</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Showcase verified competency badges with a digital, shareable portfolio of completed learning evidence.
            </p>
          </div>
        </div>
      </section>

      {/* Your Skills. Your Passport. Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                Official Credentialing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your Skills. Your Passport.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                Showcase your achievements with a verified skill passport. Track competencies in Critical Thinking, Data Visualization, and Negotiation with verifiable learning evidence.
              </p>
              <div className="pt-2">
                <Link
                  to="/skill-passport"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-52 h-64 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-5 shadow-2xl border border-blue-400/30 flex flex-col justify-between transform rotate-3 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-start">
                  <GraduationCap className="w-8 h-8 text-blue-200" />
                  <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">Skill Passport</span>
                </div>
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/30 mx-auto flex items-center justify-center border-2 border-blue-300">
                    <Award className="w-8 h-8 text-yellow-300" />
                  </div>
                  <p className="text-sm font-bold text-white mt-2">Level 2 Learner</p>
                  <p className="text-[10px] text-blue-200">EduVerse Verified</p>
                </div>
                <div className="text-[9px] text-blue-300 text-center font-mono">
                  ID: EDV-2026-9481
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Popular Flagship Courses</h2>
            <p className="text-sm text-slate-500 mt-1">Structured reading courses with zero filler</p>
          </div>
          <Link to="/explore" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All Courses <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnailURL}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 text-slate-800 shadow-sm">
                  {course.difficulty}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="text-blue-600 font-semibold">{course.categoryName}</span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {course.rating} ({course.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {course.estimatedDuration}
                  </div>

                  <Link
                    to={`/courses/${course.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    View Course →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner matching reference1.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-blue-600 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-blue-500/20">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to start your learning journey?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base">
            Join thousands of learners expanding their mental models with research-backed knowledge and measurable skill development.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg transition-all"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

