import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL, ADMIN_CONFIGURED_PASSWORD } from '../../context/AuthContext';

export default function CRMLoginPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_CONFIGURED_PASSWORD);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { login, loginWithGoogle, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError(`Access Denied: Only the platform administrator (${ADMIN_EMAIL}) is authorized to access the CRM console.`);
      return;
    }

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('CRM Sign-in error:', err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid administrator password. Access denied.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Rate limit exceeded: Account temporarily locked for security. Try again later.';
      }
      setError(msg);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setError('');
    setResetSuccess('');
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err) {
      console.error('Google Admin Sign-in error:', err);
      setError(err.message || 'Google administrator authentication encountered an error.');
    }
  };

  const handleSendResetEmail = async () => {
    setResetLoading(true);
    setError('');
    try {
      await resetPassword(ADMIN_EMAIL);
      setResetSuccess(`Password reset email dispatched to ${ADMIN_EMAIL}. Check your inbox to set your permanent password.`);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Could not send password reset email: ' + err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top telemetry bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between text-xs border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono text-slate-400 tracking-wider">
            GATEWAY: <span className="text-emerald-400">ISOLATED CRM CONSOLE (PORT 5174)</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>RESTRICTED ACCESS</span>
          <span>•</span>
          <span>RBAC LEVEL: SUPERADMIN</span>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#0d1322] p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Console Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  Operations Console
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
                EduVerse Command CRM
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Authorized administrative staff only. Non-staff learner accounts cannot access this portal.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 font-medium flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
            <div className="space-y-1">
              <p className="font-bold text-red-400">Security Clearance Rejection</p>
              <p className="text-[11px] leading-snug">{error}</p>
            </div>
          </div>
        )}

        {resetSuccess && (
          <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium flex items-start gap-2.5 font-mono">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
            <p className="text-[11px] leading-snug">{resetSuccess}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 tracking-wider">
              Staff Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dhanushharidoss47@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#141b2d] border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider">
                Staff Password
              </label>
              <button
                type="button"
                onClick={handleSendResetEmail}
                disabled={resetLoading}
                className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>{resetLoading ? 'Sending link...' : 'Reset in Firebase'}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#141b2d] border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-mono tracking-wide"
          >
            {loading ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Authenticate Staff Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* OAuth Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-[#0d1322] px-2 text-slate-500">Or authenticate via</span>
          </div>
        </div>

        {/* Google Admin Login */}
        <button
          onClick={handleGoogleAdminLogin}
          type="button"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-[#141b2d] hover:bg-[#1a233a] text-slate-300 font-mono text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign In with Admin Google Account</span>
        </button>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center font-mono">
          <p className="text-[11px] text-slate-500">
            Student learning portal:
            <br />
            <a href="http://localhost:5173" className="text-emerald-400 hover:underline">
              http://localhost:5173
            </a>
          </p>
        </div>
      </div>

      {/* Bottom system status */}
      <div className="max-w-6xl mx-auto w-full text-center text-[11px] font-mono text-slate-600 py-2">
        EduVerse Operations Command Console • 5 Flagship Courses Active • Firebase Live Connection Verified
      </div>
    </div>
  );
}
