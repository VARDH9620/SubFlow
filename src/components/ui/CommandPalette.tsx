import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Keyboard, Home, Settings, CreditCard, FileText,
  Users, Server, Package, BarChart3, MessageSquare, LifeBuoy, User,
  DollarSign, Bell, Download, Palette, Shield, Activity, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface CommandItem {
  id: string; label: string; description?: string; icon: ReactNode;
  section: string; action: () => void; keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setTheme } = useTheme();

  const go = (path: string) => { navigate(path); setOpen(false); setQuery(''); };

  const commands: CommandItem[] = [
    // Navigation
    { id: 'dashboard', label: 'Go to Dashboard', icon: <Home className="w-4 h-4" />, section: 'Navigation', action: () => go(user?.role === 'admin' ? '/admin' : '/dashboard'), keywords: ['home', 'overview'] },
    { id: 'services', label: 'Browse Services', icon: <Server className="w-4 h-4" />, section: 'Navigation', action: () => go('/services'), keywords: ['browse', 'catalog'] },
    { id: 'subscriptions', label: 'My Subscriptions', icon: <CreditCard className="w-4 h-4" />, section: 'Navigation', action: () => go('/subscriptions'), keywords: ['plans', 'manage'] },
    { id: 'billing', label: 'Billing & Invoices', icon: <FileText className="w-4 h-4" />, section: 'Navigation', action: () => go('/billing'), keywords: ['payment', 'invoices'] },
    { id: 'payments', label: 'Make a Payment', icon: <DollarSign className="w-4 h-4" />, section: 'Navigation', action: () => go('/payment'), keywords: ['pay'] },
    { id: 'support', label: 'Support Center', icon: <LifeBuoy className="w-4 h-4" />, section: 'Navigation', action: () => go('/support'), keywords: ['help', 'ticket'] },
    { id: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" />, section: 'Navigation', action: () => go('/profile'), keywords: ['account', 'settings'] },
    { id: 'activity', label: 'Activity Log', icon: <Activity className="w-4 h-4" />, section: 'Navigation', action: () => go('/activity'), keywords: ['audit', 'history'] },
    // Admin
    ...(user?.role === 'admin' ? [
      { id: 'admin-users', label: 'Manage Users', icon: <Users className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/users'), keywords: ['people'] } as CommandItem,
      { id: 'admin-services', label: 'Manage Services', icon: <Server className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/services'), keywords: ['products'] } as CommandItem,
      { id: 'admin-plans', label: 'Manage Plans', icon: <Package className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/plans'), keywords: ['pricing'] } as CommandItem,
      { id: 'admin-revenue', label: 'Revenue Dashboard', icon: <BarChart3 className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/revenue'), keywords: ['finance'] } as CommandItem,
      { id: 'admin-payments', label: 'All Payments', icon: <DollarSign className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/payments'), keywords: ['transactions'] } as CommandItem,
      { id: 'admin-tickets', label: 'Support Tickets', icon: <MessageSquare className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/tickets'), keywords: ['issues'] } as CommandItem,
      { id: 'admin-status', label: 'System Status', icon: <Shield className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/status'), keywords: ['health', 'uptime'] } as CommandItem,
      { id: 'admin-settings', label: 'Platform Settings', icon: <Settings className="w-4 h-4" />, section: 'Admin', action: () => go('/admin/settings'), keywords: ['config'] } as CommandItem,
    ] : []),
    // Actions
    { id: 'theme-light', label: 'Switch to Light Mode', icon: <Palette className="w-4 h-4" />, section: 'Actions', action: () => { setTheme('light'); setOpen(false); }, keywords: ['dark', 'light', 'mode'] },
    { id: 'theme-dark', label: 'Switch to Dark Mode', icon: <Palette className="w-4 h-4" />, section: 'Actions', action: () => { setTheme('dark'); setOpen(false); }, keywords: ['dark', 'light', 'mode'] },
    { id: 'theme-system', label: 'Use System Theme', icon: <Palette className="w-4 h-4" />, section: 'Actions', action: () => { setTheme('system'); setOpen(false); }, keywords: ['auto', 'detect'] },
    { id: 'notifications', label: 'View Notifications', icon: <Bell className="w-4 h-4" />, section: 'Actions', action: () => go('/notifications'), keywords: ['alerts'] },
    { id: 'export', label: 'Export Billing Data (CSV)', icon: <Download className="w-4 h-4" />, section: 'Actions', action: () => { exportBillingCSV(); setOpen(false); }, keywords: ['download', 'csv', 'data'] },
    { id: 'referral', label: 'Referral Program', icon: <Zap className="w-4 h-4" />, section: 'Actions', action: () => go('/referrals'), keywords: ['invite', 'credits'] },
  ];

  const filtered = query.trim() === ''
    ? commands
    : commands.filter(c => {
        const q = query.toLowerCase();
        return c.label.toLowerCase().includes(q)
          || c.description?.toLowerCase().includes(q)
          || c.section.toLowerCase().includes(q)
          || c.keywords?.some(k => k.includes(q));
      });

  // Group by section
  const sections = [...new Set(filtered.map(c => c.section))];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter' && filtered[selected]) { filtered[selected].action(); }
  };

  const handleOpen = useCallback(() => { setOpen(true); setQuery(''); setSelected(0); }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (open) setOpen(false); else handleOpen(); }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, handleOpen]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-scaleIn">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
          <Search className="w-5 h-5 text-gray-400 dark:text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400 text-[10px] font-mono rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {sections.map(section => {
            const items = filtered.filter(c => c.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section}>
                <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">{section}</p>
                {items.map(item => {
                  const globalIdx = filtered.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelected(globalIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        globalIdx === selected
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className={`p-1.5 rounded-lg ${globalIdx === selected ? 'bg-primary-100 dark:bg-primary-800/50' : 'bg-gray-100 dark:bg-slate-700'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {globalIdx === selected && <ArrowRight className="w-4 h-4 opacity-50" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-slate-400">No results found for "{query}"</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-slate-700 text-[10px] text-gray-400 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Keyboard className="w-3 h-3" /> ↑↓ Navigate</span>
            <span className="flex items-center gap-1">↵ Select</span>
            <span className="flex items-center gap-1">ESC Close</span>
          </div>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}

// Quick export helper
function exportBillingCSV() {
  // Triggered from command palette
  const event = new CustomEvent('export-csv');
  window.dispatchEvent(event);
}
