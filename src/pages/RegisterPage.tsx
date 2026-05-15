import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader, Check } from 'lucide-react';
import { slideInRight, fadeInUp, staggerContainer } from '@/lib/animations';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    college: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const colleges = ['IIT Delhi', 'IIT Bombay', 'Delhi University', 'NSIT Delhi', 'Ashoka University', 'Other'];

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';

    if (!formData.studentId) newErrors.studentId = 'Student ID is required';

    if (!formData.college) newErrors.college = 'College is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = 'Password must contain at least one number';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
            🍕
          </motion.div>
          <motion.div
            className="text-6xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          >
            🍰
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 overflow-y-auto"
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
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-600 dark:text-gray-400">Join 2000+ students ordering smarter</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <motion.div
                variants={fadeInUp}
                animate={shake ? { x: [-10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rahul Kumar"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 transition-colors focus:outline-none text-sm ${
                      errors.name
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    } bg-gray-50 dark:bg-gray-900`}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    className="mt-1 text-xs text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@college.edu"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 transition-colors focus:outline-none text-sm ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    } bg-gray-50 dark:bg-gray-900`}
                  />
                </div>
                {errors.email && (
                  <motion.p className="mt-1 text-xs text-red-500">{errors.email}</motion.p>
                )}
              </motion.div>

              {/* Student ID Field */}
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="2024010001"
                  className={`w-full px-4 py-2.5 rounded-2xl border-2 transition-colors focus:outline-none text-sm ${
                    errors.studentId
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                  } bg-gray-50 dark:bg-gray-900`}
                />
                {errors.studentId && (
                  <motion.p className="mt-1 text-xs text-red-500">{errors.studentId}</motion.p>
                )}
              </motion.div>

              {/* College Field */}
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium mb-2">College/Campus</label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-2xl border-2 transition-colors focus:outline-none text-sm ${
                    errors.college
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                  } bg-gray-50 dark:bg-gray-900`}
                >
                  <option value="">Select your college</option>
                  {colleges.map(college => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                {errors.college && (
                  <motion.p className="mt-1 text-xs text-red-500">{errors.college}</motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-2.5 rounded-2xl border-2 transition-colors focus:outline-none text-sm ${
                      errors.password
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    } bg-gray-50 dark:bg-gray-900`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p className="mt-1 text-xs text-red-500">{errors.password}</motion.p>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-2.5 rounded-2xl border-2 transition-colors focus:outline-none text-sm ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                    } bg-gray-50 dark:bg-gray-900`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</motion.p>
                )}
              </motion.div>

              {/* Terms Checkbox */}
              <motion.div variants={fadeInUp} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-orange-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-orange-500 hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>
              {errors.terms && (
                <motion.p className="text-xs text-red-500">{errors.terms}</motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                variants={fadeInUp}
                type="submit"
                disabled={loading}
                className="w-full btn-primary relative overflow-hidden group mt-6"
              >
                <motion.span
                  className="inline-flex items-center justify-center gap-2"
                  animate={loading ? { opacity: [1, 0.6, 1] } : {}}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Creating account...' : 'Create Account'}
                </motion.span>
              </motion.button>

              {/* Divider */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-500">or</span>
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

              {/* Login Link */}
              <motion.p variants={fadeInUp} className="text-center text-xs text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
      email: form.email,
      password: form.password,
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Create profile and role
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: authData.user.id,
        name: form.name,
        email: form.email,
        dept: form.dept || null,
        phone: form.phone || null,
      });

      if (profileError) {
        toast.error('Failed to create profile: ' + profileError.message);
        setLoading(false);
        return;
      }

      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: authData.user.id,
        role: form.role,
      });

      if (roleError) {
        toast.error('Failed to set role: ' + roleError.message);
        setLoading(false);
        return;
      }

      toast.success('Account created! Redirecting...');
      navigate(`/${form.role}`, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">Join CanteenGo today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>College Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@college.edu" />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 6 characters" className="pr-10" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} placeholder="CSE" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9876543210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm(f => ({ ...f, role: v as Enums<'app_role'> }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Canteen Staff</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignUp} 
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
          <Link to="/" className="mt-2 block text-center text-xs text-muted-foreground hover:underline">← Back to home</Link>
        </CardContent>
      </Card>
    </div>
  );
}
