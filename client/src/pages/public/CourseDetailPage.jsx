import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Layers, 
  FileText, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await api.getCourse(slug);
        setCourse(res.course);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await api.enrollCourse(course.id);
      
      // Find the first lesson of the first module to jump right into learning!
      const firstLesson = course.modules?.[0]?.lessons?.[0];
      if (firstLesson) {
        navigate(`/learn/lessons/${firstLesson.id}`);
      } else {
        navigate('/learn');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      navigate('/learn');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Loading course syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Course not found</h2>
        <p className="text-sm text-slate-500">The requested course could not be located or has not been published yet.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Course Header Banner */}
      <div className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Link to="/explore" className="hover:underline">Courses</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{course.categoryName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {course.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                {course.rating} ({course.reviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {course.estimatedDuration}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-semibold">
                {course.difficulty}
              </span>
              <span className="text-emerald-400 font-medium">
                Research Backed & Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Syllabus & Learning Outcomes */}
          <div className="lg:col-span-8 space-y-10">
            {/* What you'll learn */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <h2 className="text-xl font-bold text-slate-900">What You Will Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(course.learningOutcomes || []).map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Overview Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Course Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>

            {/* Course Curriculum / Syllabus */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.modules?.length || 0} modules • {course.estimatedDuration} total structured reading
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(course.modules || []).map((module, mIdx) => (
                  <div key={module.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{module.title}</h3>
                        <p className="text-xs text-slate-500">{module.description}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{module.estimatedDuration}</span>
                    </div>

                    <div className="divide-y divide-slate-100 bg-white">
                      {(module.lessons || []).map((lesson, lIdx) => (
                        <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{lesson.title}</p>
                              <p className="text-xs text-slate-400 line-clamp-1">{lesson.summary}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 font-medium whitespace-nowrap pl-4">
                            {lesson.readingTimeEstimate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Awarded */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Verified Skills Credential
              </h2>
              <p className="text-xs text-slate-500">Upon passing the end-of-course knowledge checks, these skills will be endorsed on your EduVerse Skill Passport:</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {(course.skillsAwarded || []).map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Enrollment Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-6">
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-100">
                <img
                  src={course.thumbnailURL}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Free Access (Pilot Phase)</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">Free Enrollment</div>
                <p className="text-xs text-slate-500 mt-1">Full access to structured lessons, knowledge checks, and verifiable passport certificate.</p>
              </div>

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Start Learning Now'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Content-first, distraction-free reading experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Peer-reviewed source traceability</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Verifiable digital completion badge</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

