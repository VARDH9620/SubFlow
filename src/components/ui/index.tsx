import { type ReactNode, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Toast } from '../../types';

/* ================================================================
   BUTTON — Refined with better shadow, hover, active states
   ================================================================ */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';
  const v: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/50 shadow-sm shadow-primary-600/20 dark:shadow-none',
    secondary: 'bg-surface-2 dark:bg-dark-surface-3 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50',
    ghost: 'text-gray-600 dark:text-slate-300 hover:bg-surface-2 dark:hover:bg-dark-surface-3 focus:ring-gray-300',
    outline: 'border border-gray-250 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-surface-1 dark:hover:bg-dark-surface-2 focus:ring-primary-500/50',
  };
  const s: Record<string, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-sm gap-2',
  };
  return (
    <button className={`${base} ${v[variant]} ${s[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {children}
    </button>
  );
}

/* ================================================================
   INPUT — Refined focus ring & placeholder colors
   ================================================================ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; helper?: string;
}
export function Input({ label, error, helper, className = '', id, ...props }: InputProps) {
  const elId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={elId} className="block text-[13px] font-medium text-gray-700 dark:text-slate-300">{label}</label>}
      <input id={elId} className={`w-full h-9 px-3 rounded-lg text-sm transition-all border bg-white dark:bg-dark-surface-2 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 ${error ? 'border-red-300 dark:border-red-500/60' : 'border-gray-250 dark:border-slate-600 hover:border-gray-350 dark:hover:border-slate-500'} ${className}`} {...props} />
      {error && <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>}
      {helper && !error && <p className="text-[11px] text-gray-400 dark:text-slate-400">{helper}</p>}
    </div>
  );
}

/* ================================================================
   SELECT
   ================================================================ */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, className = '', id, ...props }: SelectProps) {
  const elId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={elId} className="block text-[13px] font-medium text-gray-700 dark:text-slate-300">{label}</label>}
      <select id={elId} className={`w-full h-9 px-3 rounded-lg text-sm border bg-white dark:bg-dark-surface-2 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 border-gray-250 dark:border-slate-600 ${className}`} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ================================================================
   TEXTAREA
   ================================================================ */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string;
}
export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const elId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={elId} className="block text-[13px] font-medium text-gray-700 dark:text-slate-300">{label}</label>}
      <textarea id={elId} className={`w-full px-3 py-2 rounded-lg text-sm border bg-white dark:bg-dark-surface-2 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 ${error ? 'border-red-300 dark:border-red-500/60' : 'border-gray-250 dark:border-slate-600'} ${className}`} {...props} />
      {error && <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

/* ================================================================
   CARD — Subtle lift + refined borders for dark
   ================================================================ */
interface CardProps { children: ReactNode; className?: string; padding?: boolean }
export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white dark:bg-dark-surface-1 rounded-xl border border-gray-150 dark:border-dark-surface-3/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ================================================================
   BADGE — Better contrast in both themes
   ================================================================ */
interface BadgeProps { variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; children: ReactNode; className?: string }
export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const v: Record<string, string> = {
    default:   'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
    success:   'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/15 dark:ring-emerald-500/20',
    warning:   'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/15 dark:ring-amber-500/20',
    danger:    'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 ring-1 ring-red-500/15 dark:ring-red-500/20',
    info:      'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/15 dark:ring-blue-500/20',
    purple:    'bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 ring-1 ring-violet-500/15 dark:ring-violet-500/20',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${v[variant]} ${className}`}>{children}</span>;
}

/* ================================================================
   MODAL — Refined backdrop + cleaner card
   ================================================================ */
interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' }
export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  const w: Record<string, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/20 dark:bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div ref={ref} className={`relative bg-white dark:bg-dark-surface-1 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/40 border border-gray-200/80 dark:border-dark-surface-3 ${w[size]} w-full animate-scaleIn max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-surface-3 shrink-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-dark-surface-3 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ================================================================
   STAT CARD
   ================================================================ */
interface StatCardProps {
  title: string; value: string | number;
  change?: string; changeType?: 'positive' | 'negative' | 'neutral';
  icon: ReactNode; iconBg?: string;
}
export function StatCard({ title, value, change, changeType = 'neutral', icon, iconBg = 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' }: StatCardProps) {
  return (
    <Card className="card-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-slate-300 truncate">{title}</p>
          <p className="text-[22px] font-bold text-gray-900 dark:text-white mt-0.5 tracking-tight">{value}</p>
          {change && <p className={`text-[11px] mt-1.5 font-medium ${changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-slate-400'}`}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
          </p>}
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
      </div>
    </Card>
  );
}

/* ================================================================
   TABLE
   ================================================================ */
interface Column<T> { key: string; header: string; render?: (item: T) => ReactNode; className?: string }
interface TableProps<T> { columns: Column<T>[]; data: T[]; keyExtractor: (item: T) => string; emptyMessage?: string }
export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-150 dark:border-dark-surface-3">
            {columns.map(c => (
              <th key={c.key} className={`text-left py-3 px-4 text-[11px] font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap ${c.className || ''}`}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="table-stripe">
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="text-center py-16 text-gray-400 dark:text-slate-400 text-sm">{emptyMessage}</td></tr>
            : data.map(item => (
              <tr key={keyExtractor(item)} className="border-b border-gray-100 dark:border-dark-surface-3/40 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors">
                {columns.map(c => (
                  <td key={c.key} className={`py-3 px-4 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap ${c.className || ''}`}>
                    {c.render ? c.render(item) : String((item as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   TOAST CONTAINER
   ================================================================ */
export function ToastContainer() {
  const { toasts, removeToast } = useAuth();
  const icons: Record<Toast['type'], ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  };
  const bg: Record<Toast['type'], string> = {
    success: 'bg-white dark:bg-dark-surface-1 border-emerald-200 dark:border-emerald-800/60',
    error: 'bg-white dark:bg-dark-surface-1 border-red-200 dark:border-red-800/60',
    info: 'bg-white dark:bg-dark-surface-1 border-blue-200 dark:border-blue-800/60',
    warning: 'bg-white dark:bg-dark-surface-1 border-amber-200 dark:border-amber-800/60',
  };
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg dark:shadow-xl dark:shadow-black/30 toast-enter ${bg[t.type]}`}>
          {icons[t.type]}
          <p className="text-sm font-medium text-gray-800 dark:text-slate-200 flex-1">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="text-gray-300 dark:text-slate-400 hover:text-gray-500 dark:hover:text-slate-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   EMPTY STATE
   ================================================================ */
interface EmptyStateProps { icon: ReactNode; title: string; description: string; action?: ReactNode }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-surface-2 dark:bg-dark-surface-2 rounded-2xl mb-4 text-gray-300 dark:text-slate-400">{icon}</div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-slate-300 max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}

/* ================================================================
   LOADING SPINNER
   ================================================================ */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-16">
      <div className={`${s[size]} border-[3px] border-gray-200 dark:border-dark-surface-3 border-t-primary-500 dark:border-t-primary-400 rounded-full animate-spin`} />
    </div>
  );
}

/* ================================================================
   PAGE HEADER
   ================================================================ */
interface PageHeaderProps { title: string; description?: string; action?: ReactNode }
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        {description && <p className="text-[13px] text-gray-500 dark:text-slate-300 mt-0.5">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
    </div>
  );
}

/* ================================================================
   SEARCH BAR
   ================================================================ */
interface SearchBarProps { value: string; onChange: (v: string) => void; placeholder?: string }
export function SearchBar({ value, onChange, placeholder = 'Search…' }: SearchBarProps) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 pl-10 pr-4 rounded-lg text-sm border border-gray-250 dark:border-slate-600 bg-white dark:bg-dark-surface-2 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
    </div>
  );
}

/* ================================================================
   TABS
   ================================================================ */
interface TabsProps { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-0.5 bg-surface-2 dark:bg-dark-surface-2 p-1 rounded-lg">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all whitespace-nowrap ${
            active === t.key
              ? 'bg-white dark:bg-dark-surface-1 text-gray-900 dark:text-white shadow-sm dark:shadow-none'
              : 'text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-300'}`}>
          {t.label}
          {t.count !== undefined && (
            <span className={`ml-1.5 px-1.5 py-px rounded text-[10px] font-bold ${
              active === t.key
                ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400'
                : 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-slate-300'
            }`}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ================================================================
   CONFIRM DIALOG
   ================================================================ */
interface ConfirmDialogProps {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; variant?: 'danger' | 'primary';
}
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger' }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
