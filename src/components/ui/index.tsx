import { type ReactNode, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Toast } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================================================
   ANIMATION CONFIGURATIONS
   ================================================================ */
const springConfig = { type: 'spring', stiffness: 400, damping: 30 };
const transitionConfig = { duration: 0.2, ease: [0.32, 0.72, 0, 1] };

/* ================================================================
   BUTTON — Premium interactions
   ================================================================ */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex relative items-center justify-center font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  const v: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground shadow-premium hover:shadow-premium-hover focus:ring-primary/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50',
    danger: 'bg-destructive text-destructive-foreground shadow-premium hover:shadow-premium-hover focus:ring-destructive/50',
    ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-muted',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted focus:ring-border',
  };
  const s: Record<string, string> = {
    sm: 'h-8 px-3 text-[13px] gap-1.5',
    md: 'h-10 px-4 text-[14px] gap-2',
    lg: 'h-12 px-6 text-[15px] gap-2.5',
  };
  return (
    <motion.button 
      whileHover={disabled || loading ? {} : { scale: 1.01 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={springConfig}
      className={`${base} ${v[variant]} ${s[size]} ${className}`} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {children}
    </motion.button>
  );
}

/* ================================================================
   INPUT — Premium Focus States
   ================================================================ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; helper?: string;
}
export function Input({ label, error, helper, className = '', id, ...props }: InputProps) {
  const elId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={elId} className="block text-[13px] font-medium text-foreground">{label}</label>}
      <div className="relative">
        <input 
          id={elId} 
          className={`w-full h-10 px-3 text-[14px] rounded-xl transition-all duration-200 border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm ${error ? 'border-destructive focus:ring-destructive' : 'border-border hover:border-muted-foreground/40'} ${className}`} 
          {...props} 
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[12px] text-destructive">{error}</motion.p>
        )}
      </AnimatePresence>
      {helper && !error && <p className="text-[12px] text-muted-foreground">{helper}</p>}
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
      {label && <label htmlFor={elId} className="block text-[13px] font-medium text-foreground">{label}</label>}
      <select id={elId} className={`w-full h-10 px-3 text-[14px] rounded-xl transition-all duration-200 border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm border-border hover:border-muted-foreground/40 ${className}`} {...props}>
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
      {label && <label htmlFor={elId} className="block text-[13px] font-medium text-foreground">{label}</label>}
      <textarea id={elId} className={`w-full px-3 py-2 text-[14px] rounded-xl transition-all duration-200 border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm ${error ? 'border-destructive focus:ring-destructive' : 'border-border hover:border-muted-foreground/40'} ${className}`} {...props} />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[12px] text-destructive">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   CARD — Glass Panel with Hover
   ================================================================ */
interface CardProps { children: ReactNode; className?: string; padding?: boolean; interactive?: boolean }
export function Card({ children, className = '', padding = true, interactive = false }: CardProps) {
  return (
    <motion.div 
      whileHover={interactive ? { y: -2, scale: 1.002 } : {}}
      transition={springConfig}
      className={`glass-panel rounded-2xl ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   BADGE — Smooth rounded borders
   ================================================================ */
interface BadgeProps { variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; children: ReactNode; className?: string }
export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const v: Record<string, string> = {
    default:   'bg-muted text-muted-foreground border-border',
    success:   'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning:   'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger:    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    info:      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple:    'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${v[variant]} ${className}`}>{children}</span>;
}

/* ================================================================
   MODAL — Framer Motion Enter/Exit
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
            className={`relative glass-panel rounded-2xl ${w[size]} w-full max-h-[85vh] flex flex-col shadow-premium overflow-hidden`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-card/50">
              <h3 className="text-[16px] font-medium text-foreground tracking-tight">{title}</h3>
              <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
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
export function StatCard({ title, value, change, changeType = 'neutral', icon, iconBg = 'text-primary bg-primary/10' }: StatCardProps) {
  return (
    <Card interactive={true} className="overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground truncate">{title}</p>
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...springConfig }} className="text-[28px] font-semibold text-foreground mt-1 tracking-tight">
            {value}
          </motion.p>
          {change && <p className={`text-[12px] mt-1 font-medium flex items-center gap-1 ${changeType === 'positive' ? 'text-emerald-500' : changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {changeType === 'positive' ? <span className="text-[10px]">▲</span> : changeType === 'negative' ? <span className="text-[10px]">▼</span> : <span className="text-[10px]">▶</span>} {change}
          </p>}
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
      </div>
    </Card>
  );
}

/* ================================================================
   TABLE — Smooth rows
   ================================================================ */
interface Column<T> { key: string; header: string; render?: (item: T) => ReactNode; className?: string }
interface TableProps<T> { columns: Column<T>[]; data: T[]; keyExtractor: (item: T) => string; emptyMessage?: string }
export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data available' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border glass-panel p-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map(c => (
              <th key={c.key} className={`py-3.5 px-4 text-[12px] font-medium text-muted-foreground ${c.className || ''}`}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="text-center py-16 text-muted-foreground text-[14px]">{emptyMessage}</td></tr>
            : data.map((item, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, ...transitionConfig }}
                key={keyExtractor(item)} 
                className={`transition-colors hover:bg-muted/40 ${index !== data.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                {columns.map(c => (
                  <td key={c.key} className={`py-3.5 px-4 text-[14px] text-foreground whitespace-nowrap ${c.className || ''}`}>
                    {c.render ? c.render(item) : String((item as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   TOAST CONTAINER — Framer Motion Slide In
   ================================================================ */
export function ToastContainer() {
  const { toasts, removeToast } = useAuth();
  const icons: Record<Toast['type'], ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div 
            key={t.id} 
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={springConfig}
            className="flex items-center gap-3 px-4 py-3 border border-border glass-panel rounded-xl shadow-premium pointer-events-auto"
          >
            <div className="shrink-0">{icons[t.type]}</div>
            <p className="text-[14px] font-medium text-foreground flex-1">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0"><X className="w-4 h-4" /></button>
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={transitionConfig} className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="p-4 bg-muted/50 rounded-2xl mb-5 text-muted-foreground shadow-sm">{icon}</div>
      <h3 className="text-[18px] font-medium text-foreground mb-1 tracking-tight">{title}</h3>
      <p className="text-[14px] text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </motion.div>
  );
}

/* ================================================================
   LOADING SPINNER
   ================================================================ */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' };
  return (
    <div className="flex items-center justify-center py-12 w-full">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`${s[size]} border-muted border-t-primary rounded-full`} 
      />
    </div>
  );
}

/* ================================================================
   PAGE HEADER
   ================================================================ */
interface PageHeaderProps { title: string; description?: string; action?: ReactNode }
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={transitionConfig} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-[15px] text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3 flex-shrink-0">{action}</div>}
    </motion.div>
  );
}

/* ================================================================
   SEARCH BAR
   ================================================================ */
interface SearchBarProps { value: string; onChange: (v: string) => void; placeholder?: string }
export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative group">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 text-[14px] rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all shadow-sm hover:border-muted-foreground/40" />
    </div>
  );
}

/* ================================================================
   TABS — Framer Motion active indicator
   ================================================================ */
interface TabsProps { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-border mb-6">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`relative px-4 py-2.5 text-[14px] font-medium transition-colors whitespace-nowrap ${
            active === t.key
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'}`}>
          <div className="flex items-center gap-2">
            {t.label}
            {t.count !== undefined && (
              <span className={`px-1.5 py-0.5 text-[11px] rounded-full transition-colors ${
                active === t.key
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>{t.count}</span>
            )}
          </div>
          {active === t.key && (
            <motion.div 
              layoutId="activeTabIndicator" 
              className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" 
              transition={springConfig}
            />
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
      <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
