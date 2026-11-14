import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Award, Calendar, BookOpen, Clock } from 'lucide-react';

export default function LearnerProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Learner Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your account information, interests, and learning credentials.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <img
            src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser?.displayName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{currentUser?.displayName}</h2>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                {currentUser?.passportLevelTitle || 'Level 2 Learner'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Display Name</label>
            <input
              type="text"
              readOnly
              value={currentUser?.displayName || ''}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              readOnly
              value={currentUser?.email || ''}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Learning Track</label>
            <input
              type="text"
              readOnly
              value="Thinking & Intelligence + Data Literacy"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Credential ID</label>
            <input
              type="text"
              readOnly
              value="EDV-2026-9481-VERIFIED"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

