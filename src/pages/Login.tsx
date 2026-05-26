import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Shield, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Button, Input } from '../components/ui';
import { motion } from 'framer-motion';
import GlobalBackground from '../components/Background/GlobalBackground';

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const err = login(email, password, rememberMe);
      if (err) { setError(err); setLoading(false); }
      else { navigate(email === 'admin@subflow.io' ? '/admin' : '/dashboard'); }
    }, 500);
  };

  const stats = [
    { icon: Shield, value: '10K+', label: 'Active Users' },
    { icon: BarChart3, value: '99.9%', label: 'Uptime' },
    { icon: Users, value: '500+', label: 'Companies' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Cinematic brand showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center px-12">
        <GlobalBackground intensity="full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-indigo-600/85 to-purple-700/90" />

          <div className="relative z-10 py-20 px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2.5 mb-14">
                <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">SubFlow</span>
              </div>

              <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                Welcome back to<br />your control center
              </h2>
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Manage subscriptions, track billing, and monitor analytics — all from one unified platform.
              </p>

              <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="text-left"
                  >
                    <s.icon className="w-5 h-5 text-white/40 mb-2" />
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-sm text-white/50 mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/[0.03] rounded-full border border-white/[0.05]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.03] rounded-full border border-white/[0.05]" />
          <div className="absolute top-1/2 -left-16 w-48 h-48 bg-white/[0.02] rounded-full border border-white/[0.04]" />
        </GlobalBackground>
      </div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-card relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">SubFlow</span>
            </Link>
            <ThemeToggle compact />
          </div>

          <h1 className="text-2xl font-bold text-foreground tracking-tight">Sign in to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">Sign up</Link></p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 bg-red-50/80 dark:bg-red-900/15 border border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-400 text-sm rounded-xl backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            <div className="relative">
              <Input label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer select-none">
                <span className="relative flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span className="w-4 h-4 rounded-md border border-border bg-card/50 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M1 4l2.5 2.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">Stay logged in</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors">Forgot password?</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full">Sign in</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
