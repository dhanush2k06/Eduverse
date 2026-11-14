import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

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

// Detect CRM mode
const isCrmMode = import.meta.env.VITE_APP_MODE === 'crm' || (typeof window !== 'undefined' && window.location.port === '5174');

// Public Layout Wrapper (only used on public site)
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Protected Route for Learners (public site only)
function LearnerRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
        Authenticating...
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  // Admin accounts should not access the learner dashboard on the public site
  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-lg max-w-md">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Admin Account Detected</h2>
          <p className="text-sm text-slate-500 mb-4">
            Admin accounts should use the CRM portal at{' '}
            <a href="http://localhost:5174" className="text-blue-600 font-semibold hover:underline">localhost:5174</a>.
          </p>
        </div>
      </div>
    );
  }
  return children;
}

// Protected Route for Admin CRM
function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
        Verifying CRM administrative access...
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  // Non-admin users should not access the CRM portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-lg max-w-md">
          <h2 className="text-lg font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 mb-4">
            You do not have administrator privileges. Learner accounts should use the{' '}
            <a href="http://localhost:5173" className="text-blue-600 font-semibold hover:underline">public learning site</a>.
          </p>
        </div>
      </div>
    );
  }
  return children;
}

// ─── CRM-Mode App (port 5174) ──────────────────────────────
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

      {/* Redirect everything else to admin login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ─── Public-Mode App (port 5173) ────────────────────────────
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

      {/* No admin routes on public site — redirect to home */}
      <Route path="/admin/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return isCrmMode ? <CRMApp /> : <PublicApp />;
}
