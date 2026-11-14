import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const res = await api.getMyEnrollments();
        setEnrollments(res.enrollments || []);
      } catch (err) {
        console.error('Error loading my courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Courses</h1>
        <p className="text-sm text-slate-500 mt-1">Track your active reading modules and completed course credentials.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading enrolled courses...</div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">You are not enrolled in any courses yet</h3>
          <p className="text-xs text-slate-500">Explore our flagship curriculum to start learning.</p>
          <Link to="/explore" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const isCompleted = enr.progressPercentage === 100 || enr.status === 'completed';
            const lessonLink = enr.courseId === 'course-data-science' 
              ? '/learn/lessons/lesson-ds-dataviz' 
              : '/learn/lessons/lesson-ct-basics';

            return (
              <div
                key={enr.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 relative bg-slate-100 overflow-hidden">
                    <img
                      src={enr.thumbnailURL || "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80"}
                      alt={enr.courseTitle}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
                      isCompleted ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {isCompleted ? '✓ Completed' : `${enr.progressPercentage}% Completed`}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs font-semibold text-blue-600">{enr.categoryName || 'Foundations'}</p>
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                      {enr.courseTitle}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Course Progress</span>
                        <span>{enr.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${enr.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={lessonLink}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 hover:border-blue-600"
                  >
                    {isCompleted ? 'Review Course Material' : 'Continue Lesson'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

