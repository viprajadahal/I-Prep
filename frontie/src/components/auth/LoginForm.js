import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [remember, setRemember] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-surface-light dark:bg-surface-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-hero dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 opacity-50" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/40 dark:bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/40 dark:bg-blue-600/20 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative text-center px-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to iPrep IELTS
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Your comprehensive IELTS preparation platform. Practice, track progress, and achieve your target band score with AI-powered feedback.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/60 dark:bg-surface-cardDark/60 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">200+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Lessons</div>
            </div>
            <div className="bg-white/60 dark:bg-surface-cardDark/60 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Students</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sign In
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Continue your IELTS preparation journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-cardDark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-surface-cardDark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="gradient-btn w-full !py-3.5 flex items-center justify-center gap-2 text-base"
            >
              Sign In
              <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Create account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;