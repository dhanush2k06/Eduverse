import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Edu<span className="text-blue-600">Verse</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/explore" className="hover:text-blue-600 transition-colors">Courses</Link>
              <Link to="/research" className="hover:text-blue-600 transition-colors">Research</Link>
              <Link to="/skill-passport" className="hover:text-blue-600 transition-colors">Skill Passport</Link>
              <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </form>
          </div>

          {/* Right Action / Profile */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/learn"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </Link>

                <button 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white"></span>
                </button>

                {/* Profile menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all"
                  >
                    <img
                      src={currentUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                      alt={currentUser.displayName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{currentUser.displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800">
                          {currentUser.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link to="/learn" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          My Dashboard
                        </Link>
                        <Link to="/skill-passport" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <User className="w-4 h-4 text-slate-400" />
                          Skill Passport
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link to="/explore" className="block text-slate-700 font-medium py-2">Explore Courses</Link>
          <Link to="/research" className="block text-slate-700 font-medium py-2">Research Library</Link>
          <Link to="/skill-passport" className="block text-slate-700 font-medium py-2">Skill Passport</Link>
          <Link to="/learn" className="block text-blue-600 font-medium py-2">My Dashboard</Link>
        </div>
      )}
    </header>
  );
}

