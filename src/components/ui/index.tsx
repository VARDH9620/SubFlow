import { type ReactNode, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Toast } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================================================
   ANIMATION CONFIGURATIONS
   ================================================================ */
const springConfig = { type: 'spring', stiffness: 500, damping: 30 };
const transitionConfig = { duration: 0.2, ease: "easeOut" };

/* ================================================================
   BUTTON — Clean Standard
   ================================================================ */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex relative items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  const v: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-muted shadow-none',
    outline: 'border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring',
  };
  const s: Record<string, string> = {
    sm: 'h-8 px-3 text-[13px] gap-1.5',
    md: 'h-10 px-4 text-[14px] gap-2',
    lg: 'h-11 px-8 text-[15px] gap-2.5',
  };

  return (
    <motion.button 
      whileHover={disabled || loading ? {} : { scale: 1.01 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={springConfig}
      className={`${base} ${v[variant]} ${s[size]} ${className}`} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading && <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/* ================================================================
   INPUT
   ================================================================ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; helper?: string;
}
export function Input({ label, error, helper, className = '', id, ...props }: InputProps) {
  const elId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={elId} className="block text-[14px] font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <div className="relative">
        <input 
          id={elId} 
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-[14px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${error ? 'border-destructive focus-visible:ring-destructive' : 'border-input hover:border-border'} ${className}`} 
          {...props} 
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[13px] font-medium text-destructive">{error}</motion.p>
        )}
      </AnimatePresence>
      {helper && !error && <p className="text-[13px] text-muted-foreground">{helper}</p>}
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
      {label && <label htmlFor={elId} className="block text-[14px] font-medium text-foreground">{label}</label>}
      <select id={elId} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-border ${className}`} {...props}>
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
      {label && <label htmlFor={elId} className="block text-[14px] font-medium text-foreground">{label}</label>}
      <textarea id={elId} className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-[14px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${error ? 'border-destructive focus-visible:ring-destructive' : 'border-input hover:border-border'} ${className}`} {...props} />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[13px] font-medium text-destructive">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   CARD
   ================================================================ */
interface CardProps { children: ReactNode; className?: string; padding?: boolean; interactive?: boolean; }
export function Card({ children, className = '', padding = true, interactive = false }: CardProps) {
  return (
    <motion.div 
      whileHover={interactive ? { y: -2, scale: 1.005 } : {}}
      transition={springConfig}
      className={`rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   BADGE
   ================================================================ */
interface BadgeProps { variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; children: ReactNode; className?: string }
export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const v: Record<string, string> = {
    default:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success:   'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    warning:   'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    danger:    'bg-destructive/10 text-destructive hover:bg-destructive/20',
    info:      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    purple:    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${v[variant]} ${className}`}>{children}</span>;
}

/* ================================================================
   MODAL
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
  
  const w: Record<string, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            ref={ref} 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={springConfig}
            className={`relative w-full rounded-lg border bg-background shadow-lg sm:rounded-xl overflow-hidden flex flex-col max-h-[85vh] ${w[size]}`}
          >
            <div className="flex flex-col space-y-1.5 p-6 border-b shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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
export function StatCard({ title, value, change, changeType = 'neutral', icon, iconBg = 'text-muted-foreground' }: StatCardProps) {
  return (
    <Card interactive={true} className="relative group">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`${iconBg}`}>{icon}</div>
      </div>
      <div>
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...springConfig }} className="text-2xl font-bold text-foreground">
          {value}
        </motion.div>
        {change && <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}>
          {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
        </p>}
      </div>
    </Card>
  );
}

/* ================================================================
   TABLE
   ================================================================ */
interface Column<T> { key: string; header: string; render?: (item: T) => ReactNode; className?: string }
interface TableProps<T> { columns: Column<T>[]; data: T[]; keyExtractor: (item: T) => string; emptyMessage?: string }
export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No results.' }: TableProps<T>) {
  return (
    <div className="rounded-md border bg-card">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map(c => (
                <th key={c.key} className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${c.className || ''}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.length === 0
              ? <tr><td colSpan={columns.length} className="h-24 text-center text-muted-foreground">{emptyMessage}</td></tr>
              : data.map((item, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, ...transitionConfig }}
                  key={keyExtractor(item)} 
                  className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`}
                >
                  {columns.map(c => (
                    <td key={c.key} className={`p-4 align-middle ${c.className || ''}`}>
                      {c.render ? c.render(item) : String((item as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================
   TOAST CONTAINER
   ================================================================ */
export function ToastContainer() {
  const { toasts, removeToast } = useAuth();
  const icons: Record<Toast['type'], ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-destructive" />,
    info: <Info className="w-5 h-5 text-primary" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };
  
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col p-6 gap-2 max-w-[420px] w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div 
            key={t.id} 
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            transition={springConfig}
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all bg-background text-foreground`}
          >
            <div className="flex gap-3 w-full">
              <div className="shrink-0">{icons[t.type]}</div>
              <p className="text-sm font-semibold leading-tight">{t.message}</p>
            </div>
            <button onClick={() => removeToast(t.id)} className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"><X className="w-4 h-4" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   EMPTY STATE
   ================================================================ */
interface EmptyStateProps { icon: ReactNode; title: string; description: string; action?: ReactNode }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={transitionConfig} className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <div className="text-muted-foreground w-10 h-10">{icon}</div>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {action}
      </div>
    </motion.div>
  );
}

/* ================================================================
   LOADING SPINNER
   ================================================================ */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-8 w-full">
      <motion.svg 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`${s[size]} text-muted-foreground`} 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </motion.svg>
    </div>
  );
}

/* ================================================================
   PAGE HEADER
   ================================================================ */
interface PageHeaderProps { title: string; description?: string; action?: ReactNode }
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={transitionConfig} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </motion.div>
  );
}

/* ================================================================
   SEARCH BAR
   ================================================================ */
interface SearchBarProps { value: string; onChange: (v: string) => void; placeholder?: string }
export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
    </div>
  );
}

/* ================================================================
   TABS
   ================================================================ */
interface TabsProps { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-6">
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted-foreground/10'}`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>{t.count}</span>
            )}
          </button>
        );
      })}
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
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button variant="outline" onClick={onClose} className="mt-2 sm:mt-0">Cancel</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
