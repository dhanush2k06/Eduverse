import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Terminal,
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileSearch, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UnderTestingBanner from '../common/UnderTestingBanner';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const operationsNav = [
    { label: 'Executive Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Learner Pipeline (CRM)', path: '/admin/crm', icon: Users, badge: 'Active' },
  ];

  const curriculumNav = [
    { label: 'Course Studio (5 Testing)', path: '/admin/courses', icon: BookOpen, badge: '5 Flagships' },
    { label: 'Research Evidence Index', path: '/admin/research', icon: FileSearch },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans">
      {/* High-Tech Dark Operations Sidebar */}
      <aside className="w-72 bg-[#0c1220] border-r border-slate-800/80 flex flex-col flex-shrink-0 z-20">
        
        {/* Brand Command Header */}
        <div className="p-5 border-b border-slate-800/80 bg-[#090d18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  EduVerse <span className="text-emerald-400 font-mono">CRM</span>
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Operations Command Console
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Tag */}
        <div className="px-5 py-2.5 bg-[#090f1d] border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PORT 5174 (ISOLATED)</span>
          </div>
          <span className="text-slate-500">RBAC: ADMIN</span>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Group 1: Operations */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Operations & Learner Pipeline
            </div>
            <div className="space-y-1">
              {operationsNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Group 2: Curriculum Management */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Curriculum & Content Studio
            </div>
            <div className="space-y-1">
              {curriculumNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Staff Identity & Sign Out */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090d18] space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <img
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser?.displayName}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.displayName || 'Admin Dhanush'}</p>
              <p className="text-[10px] font-mono text-emerald-400 truncate">SuperAdmin</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/30 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Operations Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070b14] overflow-y-auto">
        {/* Operations Top Header */}
        <header className="h-16 bg-[#0c1220]/90 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                EDUVERSE // OPERATIONS COMMAND CONSOLE
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                Live Telemetry · 5 Testing Courses Active · Strict Auth Isolation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-lg">
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>SPARK FIRESTORE: LIVE</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>ADMIN: {currentUser?.email || 'dhanushharidoss47@gmail.com'}</span>
            </div>
          </div>
        </header>

        {/* Content Outlet with Dark Enterprise Palette */}
        <main className="p-8 flex-1 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
        <UnderTestingBanner mode="dark" />
      </div>
    </div>
  );
}
