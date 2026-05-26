import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../db/database';
import { Card, Button, PageHeader, EmptyState } from '../../components/ui';
import type { Notification } from '../../types';

const typeIcons = { info: <Info className="w-5 h-5 text-blue-500" />, success: <CheckCircle className="w-5 h-5 text-emerald-500" />, warning: <AlertTriangle className="w-5 h-5 text-amber-500" />, error: <AlertCircle className="w-5 h-5 text-red-500" /> };
const typeBg = { info: 'bg-blue-50 dark:bg-blue-900/20', success: 'bg-emerald-50 dark:bg-emerald-900/20', warning: 'bg-amber-50 dark:bg-amber-900/20', error: 'bg-red-50 dark:bg-red-900/20' };

export default function Notifications() {
  const { user, addToast } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  const refresh = () => { if (user) setNotifs(db.getNotifications(user.id)); };
  useEffect(() => {
    if (!user) return;
    // Seed notifications if empty
    if (db.getNotifications(user.id).length === 0) {
      db.createNotification(user.id, { title: 'Welcome to SubFlow! 🎉', message: 'Your account is ready. Start by exploring our services and subscribing to a plan.', type: 'success' });
      db.createNotification(user.id, { title: 'Complete your profile', message: 'Add your billing address and phone number for a better experience.', type: 'info' });
      db.createNotification(user.id, { title: 'Check out Cloud Storage Pro', message: 'Enterprise-grade cloud storage with 99.9% uptime. Plans start at $9.99/mo.', type: 'info' });
      db.createNotification(user.id, { title: 'Security tip', message: 'Enable two-factor authentication to protect your account.', type: 'warning' });
      db.createNotification(user.id, { title: 'Invoice #INV-20250115 ready', message: 'Your invoice for Cloud Storage Pro has been generated. Due in 7 days.', type: 'info' });
      db.createNotification(user.id, { title: 'Payment received ✅', message: 'Payment of $11.79 for Cloud Storage Pro was processed successfully.', type: 'success' });
      db.createNotification(user.id, { title: 'Refer & earn!', message: 'Share your referral code and earn $10 credits for each friend who joins.', type: 'info' });
    }
    refresh();
  }, [user]);

  const handleMarkAllRead = () => {
    if (!user) return;
    db.markAllNotificationsRead(user.id);
    addToast('All notifications marked as read', 'success');
    refresh();
  };

  const handleClear = () => {
    if (!user) return;
    db.clearNotifications(user.id);
    addToast('Notifications cleared', 'info');
    refresh();
  };

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader
        title="Notifications"
        description={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5"><CheckCheck className="w-4 h-4" /> Mark all read</Button>
            <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1.5 text-red-500"><Trash2 className="w-4 h-4" /> Clear</Button>
          </div>
        }
      />

      {notifs.length === 0 ? (
        <EmptyState icon={<Bell className="w-10 h-10" />} title="All caught up!" description="You have no notifications" />
      ) : (
        <div className="space-y-2">
          {notifs.map(n => (
            <Card key={n.id} className={`transition-all ${!n.read ? 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${typeBg[n.type]}`}>{typeIcons[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-slate-300 mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground/80 dark:text-slate-400 mt-1.5">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <button onClick={() => { db.markNotificationRead(n.id); refresh(); }} className="text-xs text-primary font-medium hover:text-primary/90 flex-shrink-0 mt-1">
                    Mark read
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
