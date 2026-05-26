import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Button, Input } from '../components/ui';
import { OTPVerificationPage } from '../components/ui/OTPInput';
import { PasswordStrength } from '../components/ui/OTPInput';
import * as db from '../db/database';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!email.trim()) { setEmailError('Enter your email address'); return; }

    setLoading(true);
    setTimeout(() => {
      if (!db.checkEmailExists(email)) {
        // Don't reveal whether email exists — security best practice
        // But for demo UX, we'll show a helpful message
        setEmailError('No account found with this email address');
        setLoading(false);
        return;
      }
      db.generateOTP(email);
      setStep('otp');
      setLoading(false);
    }, 800);
  };

  const handleVerifyOTP = (code: string) => {
    const result = db.verifyOTP(email, code);
    if (!result.valid) return result;
    setStep('reset');
    return { valid: true };
  };

  const handleResendOTP = () => {
    db.generateOTP(email);
  };

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters');
      return;
    }
    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
      setResetError('Password must contain both uppercase and lowercase letters');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setResetError('Password must contain at least one number');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      db.resetPassword(email, newPassword);
      setStep('success');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-card">
      {step === 'email' && (
        <div className="min-h-screen flex">
          {/* Left branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden flex-col justify-center px-12">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-12">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><Zap className="w-5 h-5 text-white" /></div>
                <span className="text-2xl font-bold text-white">SubFlow</span>
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">Forgot your<br />password?</h2>
              <p className="text-white/80 text-lg max-w-md">Don't worry, it happens to the best of us. We'll send you a verification code to securely reset your password.</p>
              <div className="mt-8 space-y-3">
                {[
                  'Enter your registered email',
                  'Verify with a 6-digit OTP',
                  'Set a new secure password',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          </div>

          {/* Right form */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between mb-8">
                <Link to="/login" className="lg:hidden flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
                  <span className="text-lg font-bold text-foreground">SubFlow</span>
                </Link>
                <ThemeToggle compact />
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                  <KeyRound className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground text-center">Forgot Password</h1>
              <p className="mt-2 text-sm text-muted-foreground dark:text-slate-300 text-center">
                Enter your email and we'll send you a verification code
              </p>

              {emailError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">{emailError}</div>
              )}

              <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
                <Button type="submit" loading={loading} className="w-full py-3">
                  <Mail className="w-4 h-4 mr-2" /> Send Verification Code
                </Button>
              </form>

              <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground dark:text-slate-300 hover:text-muted-foreground dark:hover:text-slate-200">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {step === 'otp' && (
        <OTPVerificationPage
          title="Verify Your Email"
          subtitle="Enter the 6-digit code we sent to"
          email={email}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onBack={() => setStep('email')}
          icon={<Mail className="w-10 h-10 text-primary" />}
        />
      )}

      {step === 'reset' && (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <KeyRound className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
              <p className="text-sm text-muted-foreground dark:text-slate-300 mt-2">
                Create a strong password for your account
              </p>
              <p className="text-xs text-muted-foreground/80 dark:text-slate-400 mt-1">
                For <strong className="text-muted-foreground dark:text-slate-300">{email}</strong>
              </p>
            </div>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">{resetError}</div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
                <PasswordStrength password={newPassword} />
              </div>

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />

              <Button type="submit" loading={loading} className="w-full py-3">
                Reset Password
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Tip:</strong> Use a combination of uppercase, lowercase, numbers, and special characters for maximum security.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful!</h1>
            <p className="text-sm text-muted-foreground dark:text-slate-300 mb-2">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <p className="text-xs text-muted-foreground/80 dark:text-slate-400 mb-8">
              For security, all other active sessions have been logged out.
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-6 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                <strong>Security Tip:</strong> Never share your password with anyone. SubFlow will never ask for your password via email.
              </p>
            </div>

            <Button onClick={() => navigate('/login')} className="w-full py-3">
              Sign In with New Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
