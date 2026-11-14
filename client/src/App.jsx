import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ShieldAlert, ExternalLink, ArrowRight } from 'lucide-react';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LearnerLayout from './components/layout/LearnerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import ExplorePage from './pages/public/ExplorePage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import ResearchPage from './pages/public/ResearchPage';
import SkillPassportPage from './pages/public/SkillPassportPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import CRMLoginPage from './pages/auth/CRMLoginPage';

// Learner Pages
import LearnerDashboardPage from './pages/learner/LearnerDashboardPage';
import MyCoursesPage from './pages/learner/MyCoursesPage';
import LessonLearningPage from './pages/learner/LessonLearningPage';
import QuizActivityPage from './pages/learner/QuizActivityPage';
import LearnerProfilePage from './pages/learner/LearnerProfilePage';

// Admin / CRM Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import LearnerCRMDirectoryPage from './pages/admin/LearnerCRMDirectoryPage';
import Learner360ProfilePage from './pages/admin/Learner360ProfilePage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminResearchPage from './pages/admin/AdminResearchPage';

// Detect whether running in CRM mode (port 5174 or VITE_APP_MODE=crm)
const isCrmMode = 
  import.meta.env.VITE_APP_MODE === 'crm' || 
  (typeof window !== 'undefined' && window.location.port === '5174');

// Public Layout Wrapper
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Protected Route for Learners (Public Site Only)
function LearnerRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
        Authenticating Learner Session...
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Admin Account Detected</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Administrative staff accounts cannot access the student learning portal. Please open the isolated CRM Operations Console.
          </p>
          <a 
            href="http://localhost:5174" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <span>Open CRM Portal (Port 5174)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }
  return children;
}

// Protected Route for Admin CRM (CRM Site Only)
function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-xs font-mono text-emerald-400">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        VERIFYING STAFF SECURITY CLEARANCE...
      </div>
    );
  }
  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Isolation Notice for when someone visits /admin or /crm on Public Port 5173
function CrmPortRedirectNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="text-center p-8 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl max-w-md space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
            Security Isolation
          </span>
          <h2 className="text-xl font-bold text-white pt-2">CRM Console is Isolated</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          This port (<strong>5173</strong>) is dedicated exclusively to the Public Learning Site. The Administrative CRM Console runs on its own isolated server:
        </p>
        <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-emerald-400 border border-slate-700">
          http://localhost:5174
        </div>
        <div className="pt-2">
          <a
            href="http://localhost:5174"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
          >
            <span>Launch CRM Portal (Port 5174)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── CRM-Mode Application (Port 5174) ──────────────────────────────
function CRMApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<CRMLoginPage />} />
      
      {/* Admin CRM Portal */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="crm" element={<LearnerCRMDirectoryPage />} />
        <Route path="crm/learners/:userId" element={<Learner360ProfilePage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="research" element={<AdminResearchPage />} />
      </Route>

      {/* Redirect all other URLs directly to /admin */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

// ─── Public-Mode Application (Port 5173) ────────────────────────────
function PublicApp() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/explore" element={<PublicLayout><ExplorePage /></PublicLayout>} />
      <Route path="/courses/:slug" element={<PublicLayout><CourseDetailPage /></PublicLayout>} />
      <Route path="/research" element={<PublicLayout><ResearchPage /></PublicLayout>} />
      <Route path="/skill-passport" element={<PublicLayout><SkillPassportPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />

      {/* Learner Dashboard & Learning Interface */}
      <Route path="/learn" element={<LearnerRoute><LearnerLayout /></LearnerRoute>}>
        <Route index element={<LearnerDashboardPage />} />
        <Route path="my-courses" element={<MyCoursesPage />} />
        <Route path="lessons/:lessonId" element={<LessonLearningPage />} />
        <Route path="activities/:activityId" element={<QuizActivityPage />} />
        <Route path="profile" element={<LearnerProfilePage />} />
      </Route>

      {/* Explicit Isolation: Direct users to port 5174 for administrative CRM */}
      <Route path="/admin/*" element={<CrmPortRedirectNotice />} />
      <Route path="/crm/*" element={<CrmPortRedirectNotice />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return isCrmMode ? <CRMApp /> : <PublicApp />;
}
