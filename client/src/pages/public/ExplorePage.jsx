import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Clock, Filter, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../../services/api';

const filterCategories = [
  'All',
  'Thinking & Intelligence',
  'Communication',
  'Interpersonal Skills',
  'Creativity & Innovation',
  'Personal Development',
  'Life Skills',
  'Exploration'
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const res = await api.getCourses({
          category: currentCategory === 'All' ? undefined : currentCategory,
          search: searchQuery || undefined,
          status: 'Published'
        });
        setCourses(res.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [currentCategory, searchQuery]);

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header matching reference1.png Explore Courses */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Courses</h1>
        <p className="text-slate-500 text-sm">Discover courses to build new skills, expand your mental models, and grow your knowledge.</p>
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by topic, keyword, or skill..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </form>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Popularity</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Recently Published</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Bar matching reference image */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterCategories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">Loading published courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500">Try clearing your filters or searching for another keyword.</p>
          <button
            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnailURL}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 text-slate-800 shadow-sm">
                  {course.difficulty}
                </span>
              </div>

              {/* Card Body */}
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
      )}
    </div>
  );
}

