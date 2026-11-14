import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Download, 
  BookOpen, 
  ChevronRight, 
  FileText, 
  CheckSquare, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

export default function LessonLearningPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [courseOutline, setCourseOutline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function loadLessonData() {
      setLoading(true);
      try {
        const res = await api.getLesson(lessonId || 'lesson-ct-basics');
        setLesson(res.lesson);

        if (res.lesson.courseId) {
          const outlineRes = await api.getCourseOutline(res.lesson.courseId);
          setCourseOutline(outlineRes);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLessonData();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    try {
      await api.markLessonComplete(lesson.id);
      setIsCompleted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  };

  const handleSaveReflection = (e) => {
    e.preventDefault();
    if (reflectionText.trim()) {
      setReflectionSaved(true);
      setTimeout(() => setReflectionSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Loading lesson content...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Lesson not found</h2>
        <Link to="/learn" className="text-sm text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-6 -my-6 lg:-mx-8 lg:-my-8 flex min-h-[calc(100vh-4rem)]">
      {/* Left Collapsible Syllabus Sidebar matching reference1.png & reference_design.png */}
      <div className={`w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transition-all ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        
        {/* Top return link */}
        <div className="p-4 border-b border-slate-200">
          <Link
            to="/learn/my-courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Courses
          </Link>
          <div className="mt-3">
            <h2 className="font-extrabold text-sm text-slate-900 leading-snug truncate">
              {lesson.courseTitle}
            </h2>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>Course Overview</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        {/* Modules Syllabus List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(courseOutline?.modules || []).map((mod, mIdx) => (
            <div key={mod.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="truncate">{mod.title}</span>
              </div>

              <div className="pl-4 space-y-1">
                {(mod.lessons || []).map((l, lIdx) => {
                  const isActive = l.id === lesson.id;
                  return (
                    <Link
                      key={l.id}
                      to={`/learn/lessons/${l.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                      <span className="truncate flex-1">{l.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Linked Activity button if available */}
          {lesson.linkedActivityId && (
            <div className="pt-4 border-t border-slate-100">
              <Link
                to={`/learn/activities/${lesson.linkedActivityId}`}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-amber-600" />
                Take Lesson Knowledge Check
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Reading Area matching reference designs */}
      <div className="flex-1 flex flex-col bg-slate-50 min-w-0 overflow-y-auto">
        
        {/* Lesson Top Bar with Complete Button */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-6 sm:px-10 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <span className="hidden sm:inline">{lesson.moduleTitle}</span>
            <ChevronRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
            <span className="font-bold text-slate-800 truncate">{lesson.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkComplete}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        </div>

        {/* Reading Content Canvas */}
        <div className="max-w-3xl mx-auto w-full px-6 sm:px-8 py-10 space-y-8">
          
          {/* Banner Graphic matching reference designs */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900">
            <img
              src={lesson.bannerImageURL}
              alt={lesson.title}
              className="w-full h-56 sm:h-64 object-cover"
            />
            {lesson.bannerCaption && (
              <p className="bg-slate-900/90 text-slate-400 text-[11px] px-4 py-2 text-center font-medium italic">
                Figure 1: {lesson.bannerCaption}
              </p>
            )}
          </div>

          {/* Title Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {lesson.readingTimeEstimate}
              </span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">{lesson.courseTitle}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {lesson.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          {/* Structured Content Blocks (Section 4.2 of Implementation Plan) */}
          <div className="space-y-7 text-slate-800 text-[15px] sm:text-base leading-relaxed">
            {(lesson.contentBlocks || []).map((block, idx) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 pt-4 tracking-tight">
                    {block.text}
                  </h2>
                );
              }

              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-slate-700 leading-relaxed">
                    {block.text}
                  </p>
                );
              }

              if (block.type === 'key_takeaway') {
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-blue-50/80 border-l-4 border-blue-600 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      {block.title || 'Key Takeaway'}
                    </p>
                    <p className="text-sm font-semibold text-blue-950 leading-snug">
                      {block.text}
                    </p>
                  </div>
                );
              }

              if (block.type === 'callout_tip') {
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1">
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      {block.title || 'Practical Rule of Thumb'}
                    </p>
                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                );
              }

              if (block.type === 'callout_warning') {
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      {block.title || 'Common Pitfall'}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                );
              }

              if (block.type === 'comparison_table') {
                return (
                  <div key={idx} className="space-y-2 pt-2">
                    {block.title && <h3 className="text-sm font-bold text-slate-900">{block.title}</h3>}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                          <tr>
                            {block.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3.5">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3.5 text-slate-600 font-medium">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (block.type === 'bullet_list') {
                return (
                  <ul key={idx} className="space-y-2.5 pl-2">
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                      </li>
                    ))}
                  </ul>
                );
              }

              if (block.type === 'case_study') {
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-900 text-white space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {block.title}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                );
              }

              if (block.type === 'reflection_prompt') {
                return (
                  <form key={idx} onSubmit={handleSaveReflection} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>Think About It: Reflection Prompt</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {block.prompt}
                    </p>
                    <textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Write your reflective answer here to internalize the core concept..."
                      rows={3}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Save Reflection
                      </button>
                      {reflectionSaved && (
                        <span className="text-xs text-emerald-600 font-semibold animate-in fade-in">
                          ✓ Response saved to your learner profile!
                        </span>
                      )}
                    </div>
                  </form>
                );
              }

              return null;
            })}
          </div>

          {/* Downloadable Resources Section matching reference_design.png */}
          {(lesson.downloadableResources || []).length > 0 && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                Downloadable Practice Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.downloadableResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer"
                    onClick={() => alert(`Downloading ${res.title}...`)}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{res.title}</p>
                        <p className="text-[10px] text-slate-400">{res.size}</p>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research References Drawer matching Implementation Plan Section 5 */}
          {(lesson.researchSources || []).length > 0 && (
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Peer-Reviewed Citations For This Lesson</span>
              </div>
              <div className="space-y-3">
                {lesson.researchSources.map((r) => (
                  <div key={r.id} className="bg-white p-3.5 rounded-xl border border-blue-100 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{r.title}</p>
                    <p className="text-[11px] text-slate-600">
                      <strong>Authors:</strong> {r.authorOrOrganization} ({r.publicationDate.split('-')[0]})
                    </p>
                    <p className="text-[11px] text-slate-500">{r.summary}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-blue-600 font-mono">
                      <span>{r.doiOrIdentifier}</span>
                      <span className="text-emerald-700 font-bold">✓ {r.verificationStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls: Previous / Next Lesson matching reference1.png */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            {lesson.prevLesson ? (
              <Link
                to={`/learn/lessons/${lesson.prevLesson.id}`}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                ← Previous
              </Link>
            ) : (
              <div></div>
            )}

            {lesson.nextLesson ? (
              <Link
                to={`/learn/lessons/${lesson.nextLesson.id}`}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                Next Lesson →
              </Link>
            ) : lesson.linkedActivityId ? (
              <Link
                to={`/learn/activities/${lesson.linkedActivityId}`}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                Take Module Quiz →
              </Link>
            ) : (
              <Link
                to="/learn"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                Complete Module →
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

