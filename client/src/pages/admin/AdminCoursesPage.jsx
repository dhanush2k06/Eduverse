import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Star, CheckCircle, Clock, Edit, Shield } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Courses & Content Lifecycle</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage course curriculum, publication governance (Draft → In Review → Approved → Published)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading courses...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Course Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Enrolled</th>
                  <th className="py-3.5 px-4">Lifecycle State</th>
                  <th className="py-3.5 px-5 text-right">Publication Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnailURL}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-snug">{course.title}</p>
                          <p className="text-[10px] text-slate-400">{course.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {course.categoryName}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {course.difficulty}
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {course.estimatedDuration}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800">
                      {course.enrolledCount?.toLocaleString() || 0}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        course.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : course.status === 'In Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {course.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <select
                        disabled={updatingId === course.id}
                        value={course.status}
                        onChange={(e) => handleStatusChange(course.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lateral Thinking & Hypothesis Testing"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Thinking & Intelligence">Thinking & Intelligence</option>
                  <option value="Communication">Communication</option>
                  <option value="Creativity & Innovation">Creativity & Innovation</option>
                  <option value="Life Skills">Life Skills</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Concise pedagogical summary of concepts taught..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
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

