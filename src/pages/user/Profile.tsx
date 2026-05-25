import { useState, type FormEvent } from 'react';
import { Calendar, Shield, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input, PageHeader, Badge } from '../../components/ui';
import { PasswordStrength } from '../../components/ui/OTPInput';
import * as db from '../../db/database';

export default function Profile() {
  const { user, updateProfile, addToast } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
    });
    setEditing(false);
  };

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    setPwError('');

    if (!pwForm.current) { setPwError('Enter your current password'); return; }

    // Verify current password
    if (!user) return;

    // Re-authenticate to verify current password
    const authed = db.authenticateUser(user.email, pwForm.current);
    if (!authed) { setPwError('Current password is incorrect'); return; }

    if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    if (!/[a-z]/.test(pwForm.newPw) || !/[A-Z]/.test(pwForm.newPw)) { setPwError('Password must contain uppercase and lowercase letters'); return; }
    if (!/\d/.test(pwForm.newPw)) { setPwError('Password must contain at least one number'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    if (pwForm.current === pwForm.newPw) { setPwError('New password must be different from current'); return; }

    setPwLoading(true);
    setTimeout(() => {
      db.resetPassword(user.email, pwForm.newPw);
      addToast('Password changed successfully', 'success');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setPwLoading(false);
    }, 800);
  };

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader title="Profile Settings" description="Manage your account information" />

      {/* Profile Card */}
      <Card className="mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{user?.first_name} {user?.last_name}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-300">{user?.email}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                {user?.role === 'admin' ? 'Administrator' : 'Member'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
              <Badge variant={user?.is_verified ? 'success' : 'warning'}>
                {user?.is_verified ? '✓ Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Personal Information</h3>
          {!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" value={form.first_name} onChange={e => set('first_name', e.target.value)} required />
              <Input label="Last name" value={form.last_name} onChange={e => set('last_name', e.target.value)} required />
            </div>
            <Input label="Email" value={form.email} disabled helper="Email cannot be changed" />
            <Input label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" onClick={() => { setEditing(false); setForm({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '', email: user?.email || '' }); }}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div><p className="text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1">First Name</p><p className="text-sm font-medium text-gray-900 dark:text-slate-200">{user?.first_name}</p></div>
            <div><p className="text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1">Last Name</p><p className="text-sm font-medium text-gray-900 dark:text-slate-200">{user?.last_name}</p></div>
            <div><p className="text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1">Email</p><p className="text-sm font-medium text-gray-900 dark:text-slate-200">{user?.email}</p></div>
            <div><p className="text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1">Phone</p><p className="text-sm font-medium text-gray-900 dark:text-slate-200">{user?.phone || 'Not set'}</p></div>
          </div>
        )}
      </Card>

      {/* Secure Password Change */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-500" /> Change Password
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-300 mb-6">
          For your security, enter your current password before setting a new one.
        </p>

        {pwError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">{pwError}</div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          {/* Current password */}
          <div className="relative">
            <Input label="Current Password" type={showCurrent ? 'text' : 'password'} value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required placeholder="Enter current password" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-[34px] text-gray-400 dark:text-slate-400 hover:text-gray-600">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Verify your identity before changing your password
            </p>
          </div>

          {/* New password */}
          <div className="relative">
            <Input label="New Password" type={showNew ? 'text' : 'password'} value={pwForm.newPw} onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} required placeholder="Enter new password" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-[34px] text-gray-400 dark:text-slate-400 hover:text-gray-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <PasswordStrength password={pwForm.newPw} />
          </div>

          <Input label="Confirm New Password" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required placeholder="Confirm new password" />

          {pwForm.newPw && pwForm.confirm && pwForm.newPw === pwForm.confirm && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> Passwords match
            </div>
          )}

          <Button type="submit" loading={pwLoading}>Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
