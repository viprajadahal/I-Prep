import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, PenTool, Mic, Mail, ExternalLink, MessageCircle } from 'lucide-react';

const Footer = () => {
  const skillLinks = [
    { label: 'Reading', icon: BookOpen, path: '/dashboard/reading' },
    { label: 'Writing', icon: PenTool, path: '/dashboard/writing' },
    { label: 'Listening', icon: Headphones, path: '/dashboard/listening' },
    { label: 'Speaking', icon: Mic, path: '/dashboard/speaking' },
  ];

  const resourceLinks = [
    { label: 'Mock Tests', path: '/mock-tests' },
    { label: 'Study Materials', path: '/resources' },
    { label: 'Practice', path: '/practice' },
  ];

  return (
    <footer className="bg-white dark:bg-surface-cardDark border-t border-gray-100 dark:border-gray-800">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">iP</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                iPrep IELTS
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Comprehensive IELTS preparation platform with AI-powered feedback and detailed progress analytics.
            </p>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MessageCircle size={16} className="text-gray-400" />
              </button>
              <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ExternalLink size={16} className="text-gray-400" />
              </button>
              <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Mail size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              IELTS Skills
            </h4>
            <div className="space-y-2">
              {skillLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Resources
            </h4>
            <div className="space-y-2">
              {resourceLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Account
            </h4>
            <div className="space-y-2">
              <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Create Account
              </Link>
              <Link to="/dashboard/settings" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            © 2026 iPrep IELTS. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy Policy</button>
            <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms of Service</button>
            <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;