import React, { useState } from 'react';
import { Award, Download, CheckCircle, Star, Trophy, Flame, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export default function SkillPassportPage() {
  const { currentUser } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const skills = [
    { name: 'Critical Thinking & Analytical Reasoning', score: 92, verified: true },
    { name: 'Data Visualization & Quantitative Design', score: 80, verified: true },
    { name: 'Structured Problem Solving', score: 90, verified: true },
    { name: 'Persuasive Rhetoric & Communication', score: 75, verified: true },
    { name: 'Principled Negotiation (BATNA)', score: 68, verified: false }
  ];

  const handleDownload = () => {
    setDownloading(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header matching reference_design.png right panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Skill Passport</h1>
          <p className="text-sm text-slate-500 mt-1">Showcase your verifiable competencies, course mastery, and assessed evidence.</p>
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Preparing Certificate...' : 'Download Certificate'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Passport Badge */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center flex flex-col items-center justify-between space-y-6">
          <div className="w-full flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono">ID: EDV-9481-VERIFIED</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <div className="relative py-4">
            <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-blue-500/20 mx-auto flex items-center justify-center relative shadow-inner">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <Award className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-extrabold text-slate-900">Level 2 Learner</h2>
              <p className="text-xs text-blue-600 font-semibold">{currentUser?.displayName || 'Priya Sharma'}</p>
            </div>
          </div>

          <div className="w-full bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Issuing Body</span>
              <strong className="text-slate-900">EduVerse Academic Board</strong>
            </div>
            <div className="flex justify-between">
              <span>Verification Standards</span>
              <strong className="text-slate-900">Paul & Elder Rubrics</strong>
            </div>
            <div className="flex justify-between">
              <span>Issued Date</span>
              <strong className="text-slate-900">November 2026</strong>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
          >
            View Official Credentials
          </button>
        </div>

        {/* Right Card: Skills Mastery Progress */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900">Your Assessed Skills</h3>
            
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      {skill.name}
                      {skill.verified && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          Verified
                        </span>
                      )}
                    </span>
                    <span className="text-blue-600 font-bold">{skill.score}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar matching reference image */}
          <div className="grid grid-cols-4 gap-3 bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div>
              <p className="text-xl font-extrabold text-slate-900">3</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Courses</p>
            </div>
            <div className="border-l border-slate-100">
              <p className="text-xl font-extrabold text-slate-900">5</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Quizzes</p>
            </div>
            <div className="border-l border-slate-100">
              <p className="text-xl font-extrabold text-slate-900">2</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Assignments</p>
            </div>
            <div className="border-l border-slate-100">
              <p className="text-xl font-extrabold text-slate-900">1</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Certificate</p>
            </div>
          </div>

          {/* Encouragement card matching reference */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Keep learning!</h4>
              <p className="text-[11px] text-slate-600">You are on your way to becoming an expert. Complete 1 more module in Data Science to unlock Level 3 Scholar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

