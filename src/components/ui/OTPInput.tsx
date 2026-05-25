import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Mail, Shield, KeyRound, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from './index';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (val: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function OTPInput({ length = 6, value, onChange, error, disabled }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(0, 1);
    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newValue = [...value];
    text.split('').forEach((char, i) => { newValue[i] = char; });
    onChange(newValue);
    const focusIndex = Math.min(text.length, length - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div>
      <div className="flex justify-center gap-2.5 sm:gap-3">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
              error
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                : value[i]
                  ? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800'
            } disabled:opacity-50`}
          />
        ))}
      </div>
      {error && <p className="text-center text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}
    </div>
  );
}

// ====================================================================
// OTP VERIFICATION PAGE (reusable for register, forgot password, etc.)
// ====================================================================
interface OTPVerificationPageProps {
  title: string;
  subtitle: string;
  email: string;
  onVerify: (code: string) => { valid: boolean; error?: string };
  onResend: () => void;
  onBack: () => void;
  icon?: ReactNode;
  successTitle?: string;
  successAction?: ReactNode;
}

export function OTPVerificationPage({
  title, subtitle, email, onVerify, onResend, onBack,
  icon
}: OTPVerificationPageProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendCount, setResendCount] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer, resendCount]); // re-run on resendCount change

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the complete 6-digit code'); return; }

    setVerifying(true);
    setError('');

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200));

    const result = onVerify(code);
    if (!result.valid) {
      setError(result.error || 'Invalid OTP');
      setVerifying(false);
    }
  };

  const handleResend = () => {
    onResend();
    setResendTimer(30);
    setResendCount(c => c + 1);
    setOtp(Array(6).fill(''));
    setError('');
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-900">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-200 mb-8 transition-colors">
          ← Back
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
            {icon || <KeyRound className="w-10 h-10 text-primary-600 dark:text-primary-400" />}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-300">{subtitle}</p>
          <p className="text-sm font-medium text-gray-900 dark:text-slate-200 mt-2">
            <Mail className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            {maskedEmail}
          </p>
        </div>

        {/* OTP Input */}
        <OTPInput value={otp} onChange={setOtp} error={error} disabled={verifying} />

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          loading={verifying}
          disabled={otp.join('').length !== 6}
          className="w-full mt-6 py-3"
        >
          <Shield className="w-4 h-4 mr-2" />
          Verify Code
        </Button>

        {/* Resend */}
        <div className="text-center mt-5">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-400">
              Resend code in <span className="font-semibold text-gray-600 dark:text-slate-300">{resendTimer}s</span>
            </p>
          ) : (
            <button onClick={handleResend} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1.5 mx-auto">
              <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Code
            </button>
          )}
        </div>

        {/* Help text */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-slate-400">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
            <span>The code expires in <strong>10 minutes</strong>. You have <strong>5 attempts</strong> before it invalidates.</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-slate-400">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
            <span>Check your spam/junk folder if you don't see the email.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ====================================================================
// PASSWORD STRENGTH INDICATOR
// ====================================================================
interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  if (!password) return null;

  const strength = getStrength();

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'At least one number', met: /\d/.test(password) },
    { label: 'Special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-slate-700'
          }`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength.score <= 1 ? 'text-red-500' :
        strength.score === 2 ? 'text-amber-500' :
        strength.score === 3 ? 'text-blue-500' :
        'text-emerald-500'
      }`}>
        Password strength: {strength.label}
      </p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <CheckCircle className={`w-3.5 h-3.5 ${check.met ? 'text-emerald-500' : 'text-gray-300 dark:text-slate-400'}`} />
            <span className={check.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-400'}>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
