import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react';
import { slideInRight, fadeInUp, staggerContainer } from '@/lib/animations';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [shake, setShake] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/student');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex">
      {/* Left Panel - Brand */}
      <motion.div
        className="hidden md:flex md:w-1/2 gradient-hero flex-col justify-between p-12 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <motion.h1
            className="text-5xl font-bold text-gradient"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            CanteenGo
          </motion.h1>
          <motion.p
            className="mt-2 text-xl text-white/80"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Campus Food, Delivered Fast
          </motion.p>
        </div>

        {/* Floating Illustrations */}
        <div className="space-y-4">
          <motion.div
            className="text-6xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🍔
          </motion.div>
          <motion.div.  

            className="text-6xl"








            
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          >
            🍜
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-sm mx-auto w-full">
          {/* Mobile Logo */}
          <motion.div
            className="md:hidden mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gradient">CanteenGo</h1>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-600 dark:text-gray-400">Sign in to your CanteenGo account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                variants={fadeInUp}
                animate={shake ? { x: [-10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="you@college.edu"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 transition-colors focus:outline-none ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    } bg-gray-50 dark:bg-gray-900`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    className="mt-2 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                variants={fadeInUp}
                animate={shake ? { x: [-10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-2xl border-2 transition-colors focus:outline-none ${
                      errors.password
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    } bg-gray-50 dark:bg-gray-900`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    className="mt-2 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Remember Me */}
              <motion.div variants={fadeInUp} className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={fadeInUp}
                type="submit"
                disabled={loading}
                className="w-full btn-primary relative overflow-hidden group"
              >
                <motion.span
                  className="inline-flex items-center justify-center gap-2"
                  animate={loading ? { opacity: [1, 0.6, 1] } : {}}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.span>
              </motion.button>

              {/* Divider */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </motion.div>

              {/* OAuth Button */}
              <motion.button
                variants={fadeInUp}
                type="button"
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <span>🔷</span>
                Continue with Google
              </motion.button>

              {/* Register Link */}
              <motion.p variants={fadeInUp} className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                >
                  Register
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
