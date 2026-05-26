import { type ReactNode, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Toast } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================================================
   ANIMATION CONFIGURATIONS
   ================================================================ */
const wobble = { rotate: [0, -2, 2, -1, 1, 0], scale: 1.02 };
const springConfig = { type: 'spring', stiffness: 400, damping: 25 };
const transitionConfig = { duration: 0.2, ease: "easeOut" };

/* ================================================================
   BUTTON — Sketchy Borders & Marker Hover
   ================================================================ */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex relative items-center justify-center font-heading rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed marker-highlight bg-transparent sketch-border sketch-border-hover';
  const v: Record<string, string> = {
    primary: 'border-primary text-primary hover:text-primary-foreground focus:ring-primary',
    secondary: 'border-secondary text-foreground hover:bg-secondary/50 focus:ring-secondary',
    danger: 'border-destructive text-destructive hover:bg-destructive/10 focus:ring-destructive',
    ghost: 'border-transparent text-muted-foreground hover:text-foreground focus:ring-muted shadow-none',
    outline: 'border-border text-foreground hover:bg-muted/30 focus:ring-border',
  };
  const s: Record<string, string> = {
    sm: 'h-8 px-3 text-[14px] gap-1.5',
    md: 'h-10 px-4 text-[16px] gap-2',
    lg: 'h-12 px-6 text-[18px] gap-2.5',
  };
  
  // Custom marker highlight for primary/danger
  const customMarker = variant === 'primary' ? '[&::after]:bg-primary hover:text-primary-foreground' : 
                       variant === 'danger' ? '[&::after]:bg-destructive hover:text-destructive-foreground' : '';

  return (
    <motion.button 
      whileHover={disabled || loading ? {} : wobble}
      whileTap={disabled || loading ? {} : { scale: 0.95, rotate: -1 }}
      transition={{ duration: 0.3 }}
      className={`${base} ${v[variant]} ${s[size]} ${customMarker} ${className}`} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading && <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/* ================================================================
   INPUT — Sketchy Borders
   ================================================================ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; helper?: string;
}
export function Input({ label, error, helper, className = '', id, ...props }: InputProps) {
  const elId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={elId} className="block font-heading text-[16px] text-foreground">{label}</label>}
      <div className="relative">
        <input 
          id={elId} 
          className={`w-full h-10 px-3 text-[16px] sketch-border transition-all duration-200 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${error ? 'border-destructive focus:ring-destructive' : 'border-border hover:border-primary'} ${className}`} 
          {...props} 
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="font-heading text-[14px] text-destructive">{error}</motion.p>
        )}
      </AnimatePresence>
      {helper && !error && <p className="font-sans text-[13px] text-muted-foreground">{helper}</p>}
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
      {label && <label htmlFor={elId} className="block font-heading text-[16px] text-foreground">{label}</label>}
      <select id={elId} className={`w-full h-10 px-3 text-[16px] sketch-border transition-all duration-200 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring border-border hover:border-primary ${className}`} {...props}>
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
      {label && <label htmlFor={elId} className="block font-heading text-[16px] text-foreground">{label}</label>}
      <textarea id={elId} className={`w-full px-3 py-2 text-[16px] sketch-border transition-all duration-200 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${error ? 'border-destructive focus:ring-destructive' : 'border-border hover:border-primary'} ${className}`} {...props} />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="font-heading text-[14px] text-destructive">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   CARD — Sketch Frame
   ================================================================ */
interface CardProps { children: ReactNode; className?: string; padding?: boolean; interactive?: boolean; rotation?: number }
export function Card({ children, className = '', padding = true, interactive = false, rotation = 0 }: CardProps) {
  return (
    <motion.div 
      initial={{ rotate: rotation }}
      whileHover={interactive ? { rotate: rotation === 0 ? 1 : 0, scale: 1.01 } : {}}
      transition={springConfig}
      className={`bg-card sketch-border sketch-border-hover ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   BADGE — Marker scribble
   ================================================================ */
interface BadgeProps { variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; children: ReactNode; className?: string }
export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const v: Record<string, string> = {
    default:   'bg-muted/50 text-foreground border-border',
    success:   'bg-emerald-200 text-emerald-900 border-emerald-500',
    warning:   'bg-amber-200 text-amber-900 border-amber-500',
    danger:    'bg-red-200 text-red-900 border-red-500',
    info:      'bg-blue-200 text-blue-900 border-blue-500',
    purple:    'bg-violet-200 text-violet-900 border-violet-500',
  };
  return <span className={`inline-flex items-center gap-1 px-3 py-1 font-heading text-[14px] border-[1.5px] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] ${v[variant]} ${className}`}>{children}</span>;
}

/* ================================================================
   MODAL — Paper drop
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
            className="fixed inset-0 bg-background/60 backdrop-blur-[2px]" 
            onClick={onClose} 
          />
          <motion.div 
            ref={ref} 
            initial={{ opacity: 0, scale: 0.9, rotate: -2, y: -20 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, rotate: 2, y: 20 }}
            transition={springConfig}
            className={`relative bg-card sketch-border ${w[size]} w-full max-h-[85vh] flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-border shrink-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGQ9Ik0wIDBMOCA4TTAgOEw4IDAiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]">
              <h3 className="font-heading text-[22px] font-bold text-foreground">{title}</h3>
              <button onClick={onClose} className="p-1.5 -mr-1.5 text-muted-foreground hover:text-destructive hover:scale-110 transition-transform"><X className="w-6 h-6" /></button>
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
export function StatCard({ title, value, change, changeType = 'neutral', icon, iconBg = 'text-primary' }: StatCardProps) {
  // Random slight rotation for that messy desk look
  const rot = useRef((Math.random() * 2 - 1).toFixed(1));
  
  return (
    <Card interactive={true} rotation={parseFloat(rot.current)} className="relative group overflow-visible">
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <p className="font-heading text-[16px] text-muted-foreground truncate">{title}</p>
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, ...springConfig }} className="font-heading text-[32px] font-bold text-foreground mt-1">
            {value}
          </motion.p>
          {change && <p className={`font-sans text-[14px] mt-1 font-bold flex items-center gap-1 ${changeType === 'positive' ? 'text-emerald-600' : changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
          </p>}
        </div>
        <div className={`p-2.5 sketch-border bg-card shrink-0 ${iconBg}`}>{icon}</div>
      </div>
    </Card>
  );
}

/* ================================================================
   TABLE — Hand-drawn rows
   ================================================================ */
interface Column<T> { key: string; header: string; render?: (item: T) => ReactNode; className?: string }
interface TableProps<T> { columns: Column<T>[]; data: T[]; keyExtractor: (item: T) => string; emptyMessage?: string }
export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data available' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto sketch-border bg-card p-2">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            {columns.map(c => (
              <th key={c.key} className={`py-3 px-4 font-heading text-[18px] text-foreground ${c.className || ''}`}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="text-center py-12 font-heading text-[18px] text-muted-foreground">{emptyMessage}</td></tr>
            : data.map((item, index) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, ...transitionConfig }}
                key={keyExtractor(item)} 
                className={`transition-colors hover:bg-secondary/30 ${index !== data.length - 1 ? 'border-b-[1.5px] border-border/30 border-dashed' : ''}`}
              >
                {columns.map(c => (
                  <td key={c.key} className={`py-3.5 px-4 font-sans text-[16px] text-foreground whitespace-nowrap ${c.className || ''}`}>
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
   TOAST CONTAINER — Post-it notes
   ================================================================ */
export function ToastContainer() {
  const { toasts, removeToast } = useAuth();
  const icons: Record<Toast['type'], ReactNode> = {
    success: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    error: <AlertCircle className="w-6 h-6 text-destructive" />,
    info: <Info className="w-6 h-6 text-primary" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
  };
  const bgColors: Record<Toast['type'], string> = {
    success: 'bg-emerald-100 dark:bg-emerald-900',
    error: 'bg-red-100 dark:bg-red-900',
    info: 'bg-blue-100 dark:bg-blue-900',
    warning: 'bg-amber-100 dark:bg-amber-900',
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div 
            key={t.id} 
            layout
            initial={{ opacity: 0, x: 50, rotate: 5 }} 
            animate={{ opacity: 1, x: 0, rotate: (Math.random() * 4 - 2) }} 
            exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
            transition={springConfig}
            className={`flex items-start gap-3 px-5 py-4 border-2 border-border sketch-border shadow-[4px_4px_0_rgba(0,0,0,0.1)] pointer-events-auto ${bgColors[t.type]}`}
          >
            <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
            <p className="font-heading text-[18px] text-foreground flex-1 leading-tight">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="text-foreground hover:scale-125 transition-transform shrink-0"><X className="w-5 h-5" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   EMPTY STATE — Doodles
   ================================================================ */
interface EmptyStateProps { icon: ReactNode; title: string; description: string; action?: ReactNode }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={transitionConfig} className="flex flex-col items-center justify-center py-20 text-center px-4">
      <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="text-muted-foreground mb-6 transform scale-150">
        {icon}
      </motion.div>
      <h3 className="font-heading text-[24px] font-bold text-foreground mb-2">{title}</h3>
      <p className="font-sans text-[16px] text-muted-foreground max-w-sm mb-8">{description}</p>
      {action}
    </motion.div>
  );
}

/* ================================================================
   LOADING SPINNER — Drawn circle
   ================================================================ */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex items-center justify-center py-12 w-full">
      <motion.svg 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className={`${s[size]} text-primary`} 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
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
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={transitionConfig} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b-2 border-border/30 border-dashed">
      <div>
        <h1 className="font-heading text-[36px] font-bold text-foreground">{title}</h1>
        {description && <p className="font-sans text-[16px] text-muted-foreground mt-1">{description}</p>}
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
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-12 pl-11 pr-4 font-sans text-[16px] sketch-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-primary" />
    </div>
  );
}

/* ================================================================
   TABS — Bookmarks
   ================================================================ */
interface TabsProps { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 border-b-2 border-border mb-8 px-2 overflow-x-auto">
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            className={`relative px-5 py-2 font-heading text-[18px] font-bold transition-all sketch-tab ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:-translate-y-1'}`}
            data-state={isActive ? 'active' : 'inactive'}
          >
            <div className="flex items-center gap-2 relative z-10">
              {t.label}
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 text-[14px] sketch-border rounded-full ${
                  isActive ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                }`}>{t.count}</span>
              )}
            </div>
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
      <p className="font-sans text-[16px] text-foreground mb-8 leading-relaxed">{message}</p>
      <div className="flex gap-4 justify-end">
        <Button variant="ghost" onClick={onClose}>Nah, Cancel</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
