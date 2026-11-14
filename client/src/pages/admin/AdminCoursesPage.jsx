import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Star, CheckCircle, Clock, Edit, Shield, Terminal, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Thinking & Intelligence');
  const [newDifficulty, setNewDifficulty] = useState('Beginner');
  const [newDesc, setNewDesc] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCourses();
      setCourses(res.courses || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleStatusChange = async (courseId, newStatus) => {
    setUpdatingId(courseId);
    try {
      await api.updateCourseStatus(courseId, newStatus);
      loadCourses();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse({
        title: newTitle,
        shortDescription: newDesc,
        categoryName: newCategory,
        difficulty: newDifficulty,
        estimatedDuration: '6 hours',
        thumbnailURL: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      loadCourses();
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              CURRICULUM LIFECYCLE STUDIO
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Course Studio (5 Testing Courses)
          </h1>
          <p className="text-xs text-slate-400">
            Publication governance: Draft → In Review → Approved → Published → Archived.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCourses}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Courses"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-slate-500">
            LOADING ACTIVE TESTING CURRICULUM...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] border-b border-slate-800 font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Flagship Course</th>
                  <th className="py-3.5 px-4">Discipline</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Enrolled Learners</th>
                  <th className="py-3.5 px-4">Governance Status</th>
                  <th className="py-3.5 px-5 text-right">Publication Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[#141c30]/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnailURL}
                          alt={course.title}
                          className="w-12 h-10 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-sm leading-snug">{course.title}</p>
                          <p className="text-[10px] font-mono text-slate-400">{course.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {course.categoryName}
                    </td>

                    <td className="py-4 px-4 font-mono text-cyan-400">
                      {course.difficulty}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-400">
                      {course.estimatedDuration}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-200">
                      {course.enrolledCount?.toLocaleString() || 0}
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        course.status === 'Published'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : course.status === 'In Review'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        ● {course.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right font-mono">
                      <select
                        disabled={updatingId === course.id}
                        value={course.status}
                        onChange={(e) => handleStatusChange(course.id, e.target.value)}
                        className="bg-[#141c30] border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1526] border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-mono font-bold text-white">Create New Course Dossier</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lateral Thinking & Hypothesis Testing"
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Thinking & Intelligence">Thinking & Intelligence</option>
                  <option value="Communication">Communication</option>
                  <option value="Creativity & Innovation">Creativity & Innovation</option>
                  <option value="Interpersonal Skills">Interpersonal Skills</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Concise pedagogical summary of concepts taught..."
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
