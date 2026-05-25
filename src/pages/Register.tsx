import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Mail, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Button, Input } from '../components/ui';
import { OTPInput, PasswordStrength } from '../components/ui/OTPInput';
import * as db from '../db/database';

type Step = 'form' | 'otp' | 'success';

export default function Register() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendCount, setResendCount] = useState(0);

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  // Handle form submission → send OTP
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) { setError('Password must contain uppercase and lowercase letters'); return; }
    if (!/\d/.test(form.password)) { setError('Password must contain at least one number'); return; }

    setLoading(true);
    setTimeout(() => {
      // Check if email already exists
      if (db.checkEmailExists(form.email)) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }
      // Send OTP
      db.generateOTP(form.email);
      setStep('otp');
      setResendTimer(30);
      setLoading(false);
    }, 600);
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setOtpError('Please enter the complete 6-digit code'); return; }

    setVerifying(true);
    setOtpError('');

    await new Promise(r => setTimeout(r, 1200));

    const result = db.verifyOTP(form.email, code);
    if (!result.valid) {
      setOtpError(result.error || 'Invalid OTP');
      setVerifying(false);
      return;
    }

    // Create the user (verified)
    const user = db.registerUser({ ...form, is_verified: true });
    if (!user) {
      setOtpError('Failed to create account. Please try again.');
      setVerifying(false);
      return;
    }

    // Auto-login
    login(form.email, form.password);
    setStep('success');
    setVerifying(false);
  };

  const handleResendOTP = () => {
    db.generateOTP(form.email);
    setResendTimer(30);
    setResendCount(c => c + 1);
    setOtp(Array(6).fill(''));
    setOtpError('');
  };

  // Resend timer countdown
  if (step === 'otp') {
    // Inline timer effect via component
  }

  const maskedEmail = form.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-primary-600 relative overflow-hidden flex-col justify-center px-12">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-bold text-white">SubFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Start managing your<br />subscriptions today</h2>
          <p className="text-white/80 text-lg max-w-md">Join thousands of businesses using SubFlow to streamline their subscription management.</p>

          <div className="mt-12 space-y-4 max-w-sm">
            {[
              { icon: <Shield className="w-5 h-5" />, text: 'Email verification required' },
              { icon: <Mail className="w-5 h-5" />, text: '6-digit OTP security code' },
              { icon: <CheckCircle className="w-5 h-5" />, text: 'Instant account activation' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="p-2 bg-white/10 rounded-lg">{item.icon}</div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-bold text-gray-900 dark:text-slate-100">SubFlow</span>
            </Link>
            <ThemeToggle compact />
          </div>

          {/* ========== STEP: Form ========== */}
          {step === 'form' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create your account</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-300">Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">Sign in</Link></p>

              {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">{error}</div>}

              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First name" value={form.first_name} onChange={e => set('first_name', e.target.value)} required placeholder="John" />
                  <Input label="Last name" value={form.last_name} onChange={e => set('last_name', e.target.value)} required placeholder="Doe" />
                </div>
                <Input label="Email address" type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="you@example.com" />
                <Input label="Phone number" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                <div className="relative">
                  <Input label="Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <PasswordStrength password={form.password} />
                </div>
                <Input label="Confirm password" type="password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} required placeholder="Repeat password" />
                <Button type="submit" loading={loading} className="w-full py-3">
                  <Mail className="w-4 h-4 mr-2" /> Continue & Verify Email
                </Button>
                <p className="text-xs text-gray-400 dark:text-slate-400 text-center">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </>
          )}

          {/* ========== STEP: OTP Verification ========== */}
          {step === 'otp' && (
            <ResendTimerWrapper resendCount={resendCount} onTimerReady={setResendTimer}>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                    <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Verify Your Email</h1>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-200 mt-1">{maskedEmail}</p>
              </div>

              <OTPInput value={otp} onChange={setOtp} error={otpError} disabled={verifying} />

              <Button onClick={handleVerifyOTP} loading={verifying} disabled={otp.join('').length !== 6} className="w-full mt-6 py-3">
                <Shield className="w-4 h-4 mr-2" /> Create Account
              </Button>

              <div className="text-center mt-5">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-400 dark:text-slate-400">
                    Resend code in <span className="font-semibold text-gray-600 dark:text-slate-300">{resendTimer}s</span>
                  </p>
                ) : (
                  <button onClick={handleResendOTP} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 flex items-center gap-1.5 mx-auto">
                    Resend Code
                  </button>
                )}
              </div>

              <button onClick={() => { setStep('form'); setOtp(Array(6).fill('')); setOtpError(''); }} className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-200 mx-auto">
                ← Change email
              </button>
            </ResendTimerWrapper>
          )}

          {/* ========== STEP: Success ========== */}
          {step === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scaleIn">
                  <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Account Created!</h1>
              <p className="text-sm text-gray-500 dark:text-slate-300 mb-2">
                Your email has been verified and your account is ready.
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-400 mb-8">
                Redirecting you to your dashboard...
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full py-3">
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Timer wrapper component
function ResendTimerWrapper({ resendCount, onTimerReady, children }: {
  resendCount: number; onTimerReady: (v: number) => void; children: React.ReactNode;
}) {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCount]);

  useEffect(() => { onTimerReady(timer); }, [timer, onTimerReady]);

  return <>{children}</>;
}
