import { useEffect, useState } from 'react';
import { Activity as ActivityIcon, Clock, Globe, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../db/database';
import { PageHeader, Badge, SearchBar, Button, EmptyState } from '../../components/ui';
import type { AuditEntry } from '../../db/database';

const actionColors: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  login: 'info', create: 'success', update: 'info', delete: 'danger',
  payment: 'success', cancel: 'warning', subscribe: 'success', refund: 'warning',
};

const actionIcons: Record<string, string> = {
  login: '🔐', create: '✨', update: '✏️', delete: '🗑️',
  payment: '💳', cancel: '❌', subscribe: '📦', refund: '↩️',
};

export default function ActivityLog() {
  const { user, addToast } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const userLogs = await db.getUserActivityLog(user.id);
      setLogs(userLogs);
    };
    loadData();
  }, [user]);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader
        title="Activity Log"
        description="Track all actions on your account"
        action={
          <Button variant="outline" size="sm" onClick={() => { addToast('Activity exported', 'success'); }} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        }
      />

      <div className="mb-6 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search activity..." />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ActivityIcon className="w-10 h-10" />} title="No activity yet" description="Your account activity will appear here" />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-slate-700" />

          <div className="space-y-1">
            {filtered.map((log, i) => (
              <div key={log.id + i} className="relative flex gap-4 p-3 rounded-xl hover:bg-muted transition-colors group">
                {/* Dot */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  log.action === 'login' ? 'bg-blue-50 dark:bg-blue-900/30' :
                  log.action === 'payment' ? 'bg-emerald-50 dark:bg-emerald-900/30' :
                  log.action === 'subscribe' ? 'bg-purple-50 dark:bg-purple-900/30' :
                  log.action === 'delete' ? 'bg-red-50 dark:bg-red-900/30' :
                  'bg-muted/50 dark:bg-slate-700'
                }`}>
                  {actionIcons[log.action] || '📋'}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground capitalize">{log.action.replace('_', ' ')}</span>
                    <Badge variant={actionColors[log.action] || 'default'}>{log.entity_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-slate-300 mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground/80 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(log.created_at)}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {log.ip_address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
