// ============================================================
// SubFlow — Data Export Utility (CSV)
// ============================================================

import type { Invoice, Payment, Subscription } from '../types';

function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function escapeCSV(val: string | number | null | undefined): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

const headers = (cols: string[]) => cols.join(',');
const row = (vals: (string | number | null | undefined)[]) => vals.map(escapeCSV).join(',');

export function exportInvoicesCSV(invoices: Invoice[]) {
  const cols = ['Invoice Number', 'Service', 'Plan', 'Amount', 'Tax', 'Discount', 'Total', 'Status', 'Due Date', 'Paid At', 'Created At'];
  const rows = invoices.map(i =>
    row([i.invoice_number, i.service_name, i.plan_name, i.amount, i.tax, i.discount, i.total, i.status, i.due_date, i.paid_at, i.created_at])
  );
  downloadCSV('SubFlow_Invoices.csv', headers(cols) + '\n' + rows.join('\n'));
}

export function exportPaymentsCSV(payments: Payment[]) {
  const cols = ['Transaction ID', 'Invoice Number', 'User', 'Service', 'Plan', 'Amount', 'Tax', 'Total', 'Method', 'Card', 'Status', 'Date'];
  const rows = payments.map(p =>
    row([p.transaction_id, p.invoice_number, p.user_name, p.service_name, p.plan_name, p.amount, p.tax, p.total, p.method, p.card_brand ? `${p.card_brand} ****${p.card_last4}` : '', p.status, p.paid_at])
  );
  downloadCSV('SubFlow_Payments.csv', headers(cols) + '\n' + rows.join('\n'));
}

export function exportSubscriptionsCSV(subs: Subscription[]) {
  const cols = ['Service', 'Plan', 'Price', 'Status', 'Start Date', 'End Date', 'Auto Renew'];
  const rows = subs.map(s =>
    row([s.service_name, s.plan_name, s.price, s.status, s.start_date, s.end_date, s.auto_renew ? 'Yes' : 'No'])
  );
  downloadCSV('SubFlow_Subscriptions.csv', headers(cols) + '\n' + rows.join('\n'));
}
