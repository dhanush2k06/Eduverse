import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileSearch, 
  BarChart2, 
  Settings, 
  LogOut, 
  ShieldCheck,
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Learners (CRM)', path: '/admin/crm', icon: Users },
    { label: 'Courses & Content', path: '/admin/courses', icon: BookOpen },
    { label: 'Research Library', path: '/admin/research', icon: FileSearch },
    { label: 'Analytics', path: '/admin', icon: BarChart2 },
    { label: 'Settings', path: '#settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Edu<span className="text-blue-500">Verse</span>
              </span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminNav.map((item) => {
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

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Public Learning Site
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 pt-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              EduVerse Learner CRM & Operations
            </h1>
            <p className="text-xs text-slate-500">Monitor engagement, manage courses, and support learners</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live CRM Database Connected
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <img
                src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser?.displayName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-bold text-slate-900">{currentUser?.displayName}</span>
            </div>
          </div>
        </header>

        <main className="p-8 flex-1 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

