import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Share2, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Edu<span className="text-blue-600">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 font-medium">
              Learn. Apply. Grow.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              A modern, content-first e-learning platform grounded in cognitive science and empirical research.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/explore" className="hover:text-blue-600 transition-colors">Courses</Link></li>
              <li><Link to="/research" className="hover:text-blue-600 transition-colors">Research Library</Link></li>
              <li><Link to="/skill-passport" className="hover:text-blue-600 transition-colors">Skill Passport</Link></li>
              <li><a href="#about" className="hover:text-blue-600 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
              Built with React, Node/Express, and Firebase Spark Free Tier.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 text-center text-xs text-slate-500">
          © 2026 EduVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
