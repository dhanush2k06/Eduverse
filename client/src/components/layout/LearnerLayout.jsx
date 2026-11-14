import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  CheckSquare, 
  FileText, 
  FolderDown, 
  User, 
  Settings, 
  HelpCircle,
  Search,
  Bell,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LearnerLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/learn', icon: LayoutDashboard },
    { label: 'My Courses', path: '/learn/my-courses', icon: BookOpen },
    { label: 'Skill Passport', path: '/skill-passport', icon: Award },
    { label: 'Assessments', path: '/learn/my-courses', icon: CheckSquare },
    { label: 'Assignments', path: '/learn/my-courses', icon: FileText },
    { label: 'Resources', path: '/research', icon: FolderDown },
    { label: 'Profile', path: '/learn/profile', icon: User },
    { label: 'Settings', path: '#settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dark Navy Sidebar matching reference images */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Edu<span className="text-blue-500">Verse</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Help link in footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <a href="#" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything in your courses..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Site
            </Link>

            <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2"></span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser?.displayName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight">{currentUser?.displayName}</p>
                <p className="text-slate-500">{currentUser?.passportLevelTitle || 'Level 2 Learner'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Nested Child Route Content */}
        <main className="p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

