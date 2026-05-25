import { useEffect, useState } from 'react';
import { Shield, Activity, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import * as db from '../../db/database';
import { Card, PageHeader, Badge } from '../../components/ui';
import type { SystemStatus } from '../../db/database';

const statusConfig = {
  operational: { color: 'bg-emerald-500', label: 'Operational', badge: 'success' as const, icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
  degraded: { color: 'bg-amber-500', label: 'Degraded', badge: 'warning' as const, icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
  outage: { color: 'bg-red-500', label: 'Outage', badge: 'danger' as const, icon: <XCircle className="w-5 h-5 text-red-500" /> },
};

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [expandedIncident, setExpandedIncident] = useState<number | null>(0);

  useEffect(() => { setStatus(db.getSystemStatus()); }, []);

  if (!status) return null;

  const overall = statusConfig[status.overall];

  return (
    <div className="animate-fadeIn">
      <PageHeader title="System Status" description="Real-time health monitoring for all SubFlow services" />

      {/* Overall banner */}
      <Card className={`border-2 ${status.overall === 'operational' ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10' : status.overall === 'degraded' ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm">
            {overall.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">All Systems {overall.label}</h2>
              <Badge variant={overall.badge}>{status.overall}</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
              {status.uptime30d}% uptime over the last 30 days · Last checked: just now
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{status.uptime30d}%</p>
            <p className="text-xs text-gray-500 dark:text-slate-300">30-day uptime</p>
          </div>
        </div>
      </Card>

      {/* Service components */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary-500" /> Service Components
        </h3>
        <Card padding={false}>
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {status.services.map((svc, i) => {
              const cfg = statusConfig[svc.status];
              return (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-slate-200">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-slate-300">
                    <span className="hidden sm:inline"><Clock className="w-3 h-3 inline mr-1" />{svc.latency}ms</span>
                    <span className="hidden sm:inline">{svc.uptime}% uptime</span>
                    <Badge variant={cfg.badge}>{cfg.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Uptime bar (simulated 90-day) */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-500" /> 90-Day Uptime
        </h3>
        <Card>
          <div className="flex gap-0.5 flex-wrap">
            {Array.from({ length: 90 }, (_, i) => {
              const dayStatus = Math.random() > 0.03 ? 'operational' : Math.random() > 0.5 ? 'degraded' : 'outage';
              const colors: Record<string, string> = {
                operational: 'bg-emerald-400 dark:bg-emerald-500',
                degraded: 'bg-amber-400 dark:bg-amber-500',
                outage: 'bg-red-400 dark:bg-red-500',
              };
              const d = new Date(); d.setDate(d.getDate() - (89 - i));
              return (
                <div key={i} className={`w-2.5 h-7 rounded-sm ${colors[dayStatus]}`} title={`${d.toLocaleDateString()} — ${statusConfig[dayStatus].label}`} />
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-slate-300">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Operational</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Degraded</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Outage</span>
            <span className="ml-auto">90 days ago → Today</span>
          </div>
        </Card>
      </div>

      {/* Incident history */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">Incident History</h3>
        <div className="space-y-3">
          {status.incidents.map((inc, i) => (
            <Card key={i} padding={false}>
              <button onClick={() => setExpandedIncident(expandedIncident === i ? null : i)} className="w-full text-left p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  {inc.status === 'resolved'
                    ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{inc.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-300 mt-0.5">
                      {new Date(inc.started).toLocaleString()} — {inc.resolved ? `Resolved ${new Date(inc.resolved).toLocaleString()}` : 'Ongoing'}
                    </p>
                  </div>
                </div>
                <Badge variant={inc.status === 'resolved' ? 'success' : 'warning'}>{inc.status}</Badge>
              </button>
              {expandedIncident === i && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-slate-700 pt-4 space-y-3">
                  {inc.updates.map((upd, j) => (
                    <div key={j} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5" />
                        {j < inc.updates.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-slate-600" />}
                      </div>
                      <div className="pb-3">
                        <p className="text-xs text-gray-400 dark:text-slate-400">{new Date(upd.time).toLocaleString()}</p>
                        <p className="text-sm text-gray-700 dark:text-slate-300 mt-0.5">{upd.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
