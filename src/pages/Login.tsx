import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Button, Input } from '../components/ui';

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

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-center px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SubFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Welcome back to<br />your control center</h2>
          <p className="text-primary-100 text-lg max-w-md">Manage subscriptions, track billing, and monitor analytics — all from one unified platform.</p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[{ n: '10K+', l: 'Active Users' }, { n: '99.9%', l: 'Uptime' }, { n: '500+', l: 'Companies' }].map((s, i) => (
              <div key={i}><p className="text-2xl font-bold text-white">{s.n}</p><p className="text-sm text-primary-200">{s.l}</p></div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-card">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-bold text-foreground">SubFlow</span>
            </Link>
            <ThemeToggle compact />
          </div>

          <h1 className="text-2xl font-bold text-foreground">Sign in to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground dark:text-slate-300">Don't have an account? <Link to="/register" className="text-primary font-medium hover:text-primary/90">Sign up</Link></p>

          {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            <div className="relative">
              <Input label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] text-muted-foreground/80 dark:text-slate-400 hover:text-muted-foreground dark:hover:text-slate-300">
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
                  <span className="w-4 h-4 rounded border border-input bg-card peer-checked:bg-primary peer-checked:border-primary-600 transition-colors flex items-center justify-center">
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M1 4l2.5 2.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </span>
                <span className="text-sm text-muted-foreground dark:text-slate-300">Stay logged in</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-primary font-medium hover:text-primary/90">Forgot password?</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full">Sign in</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
