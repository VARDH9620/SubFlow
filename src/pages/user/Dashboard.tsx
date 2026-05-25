import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, TrendingUp, Calendar, Package, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../db/database';
import { Card, StatCard, Badge, Button, PageHeader } from '../../components/ui';
import type { Subscription, Invoice } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserDashboard() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [monthlySpend, setMonthlySpend] = useState(0);

  useEffect(() => {
    if (!user) return;
    const userSubs = db.getSubscriptionsByUser(user.id);
    setSubs(userSubs);
    const userInvoices = db.getInvoicesByUser(user.id);
    setInvoices(userInvoices);
    const activeSpend = userSubs.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.price || 0), 0);
    setMonthlySpend(activeSpend);
  }, [user]);

  const activeSubs = subs.filter(s => s.status === 'active');
  const pendingInvoices = invoices.filter(i => i.status === 'pending');

  const spendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthName = d.toLocaleString('default', { month: 'short' });
    const monthInvoices = invoices.filter(inv => {
      const id = new Date(inv.created_at);
      return id.getMonth() === d.getMonth() && inv.status === 'paid';
    });
    return { name: monthName, amount: +monthInvoices.reduce((s, inv) => s + inv.total, 0).toFixed(2) };
  });

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={`Welcome back, ${user?.first_name} 👋`}
        description="Here's an overview of your subscriptions and billing."
        action={<Link to="/services"><Button size="sm" className="gap-2"><Package className="w-4 h-4" /> Browse Services</Button></Link>}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Plans" value={activeSubs.length} icon={<CreditCard className="w-5 h-5" />} change={`${subs.length} total subscriptions`} />
        <StatCard title="Monthly Spend" value={`$${monthlySpend.toFixed(2)}`} icon={<TrendingUp className="w-5 h-5" />} change="Based on active plans" />
        <StatCard title="Pending Invoices" value={pendingInvoices.length} icon={<Calendar className="w-5 h-5" />} change={pendingInvoices.length > 0 ? 'Action required' : 'All clear'} changeType={pendingInvoices.length > 0 ? 'negative' : 'positive'} />
        <StatCard title="Next Billing" value={activeSubs[0]?.end_date || 'N/A'} icon={<Zap className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-chart-text)' }} stroke="var(--color-chart-axis)" />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-chart-text)' }} stroke="var(--color-chart-axis)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-tooltip-bg)', borderColor: 'var(--color-tooltip-border)', borderRadius: '8px', color: 'var(--color-tooltip-text)' }}
                  itemStyle={{ color: 'var(--color-tooltip-text)' }}
                  labelStyle={{ color: 'var(--color-tooltip-text)', fontWeight: 'bold' }}
                  formatter={(v) => [`$${v}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Subscriptions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Active Plans</h3>
            <Link to="/subscriptions" className="text-xs text-primary-600 font-medium hover:text-primary-700">View all →</Link>
          </div>
          <div className="space-y-3">
            {activeSubs.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No active subscriptions</p>
            ) : (
              activeSubs.slice(0, 5).map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.service_name}</p>
                    <p className="text-xs text-gray-500">{sub.plan_name} · ${sub.price}/mo</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Recent Invoices</h3>
          <Link to="/billing" className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Service</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map(inv => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-sm text-gray-700 font-mono">{inv.invoice_number.slice(0, 16)}</td>
                  <td className="py-2.5 px-3 text-sm text-gray-700">{inv.service_name}</td>
                  <td className="py-2.5 px-3 text-sm font-medium text-gray-900">${inv.total.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-sm text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'}>
                      {inv.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
