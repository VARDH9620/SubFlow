import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CommandPalette } from '../ui/CommandPalette';
import {
  LayoutDashboard, CreditCard, FileText, LifeBuoy, User,
  Settings, Users, BarChart3, Server, Package, MessageSquare,
  LogOut, Menu, Bell, ChevronDown, Zap, DollarSign, Wallet,
  Activity, Gift, CheckCircle,
} from 'lucide-react';
import * as db from '../../db/database';

// ====================================================================
// PUBLIC LAYOUT (Landing, Login, Register)
// ====================================================================
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Outlet />
    </div>
  );
}

// ====================================================================
// USER LAYOUT (Dashboard, Services, Subscriptions, etc.)
// ====================================================================
const userNav = [
  { key: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: '/services', label: 'Services', icon: Server },
  { key: '/subscriptions', label: 'My Plans', icon: CreditCard },
  { key: '/billing', label: 'Billing', icon: FileText },
  { key: '/payment', label: 'Payments', icon: Wallet },
  { key: '/activity', label: 'Activity', icon: Activity },
  { key: '/notifications', label: 'Alerts', icon: Bell },
  { key: '/referrals', label: 'Referrals', icon: Gift },
  { key: '/support', label: 'Support', icon: LifeBuoy },
  { key: '/profile', label: 'Settings', icon: Settings },
];

export function UserLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState<{ id: string; title: string; message: string; read: boolean; type: string; created_at: string }[]>([]);
  const [onboarding, setOnboarding] = useState<{ progress: number; steps: { id: string; title: string; completed: boolean; link: string }[] }>({ progress: 100, steps: [] });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const n = db.getNotifications(user.id);
    setNotifCount(n.filter(x => !x.read).length);
    setNotifs(n.slice(0, 5));
    const prog = db.getOnboardingProgress(user.id);
    const steps = db.getOnboardingSteps(user.id);
    setOnboarding({ progress: prog, steps });
    if (prog < 100) setShowOnboarding(true);
  }, [user, location.pathname]);

  const handleNotifClick = (id: string) => {
    if (user) { db.markNotificationRead(id); setNotifCount(db.getNotifications(user.id).filter(x => !x.read).length); setNotifs(db.getNotifications(user.id).slice(0, 5)); }
    setNotifOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      <CommandPalette />
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-100 dark:border-slate-700">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
          <span className="text-lg font-bold text-gray-900 dark:text-slate-100">SubFlow</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {userNav.map(item => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.key);
            return (
              <Link key={item.key} to={item.key} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'}`}>
                <Icon className="w-5 h-5" />
                {item.label}
                {item.key === '/notifications' && notifCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{notifCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-semibold">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"><Menu className="w-5 h-5 text-gray-600 dark:text-slate-400" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', metaKey: true }); document.dispatchEvent(e); }} className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700">
              <kbd className="font-mono text-[10px]">⌘K</kbd> Search...
            </button>
            <ThemeToggle />
            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <Bell className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                {notifCount > 0 && <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 animate-scaleIn overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">Notifications</span>
                      {notifCount > 0 && <span className="text-xs text-primary-600 dark:text-primary-400">{notifCount} new</span>}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-8">No notifications</p>
                      ) : (
                        notifs.map(n => (
                          <button key={n.id} onClick={() => handleNotifClick(n.id)} className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 border-b border-gray-50 dark:border-slate-700/50 transition-colors ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                            <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </button>
                        ))
                      )}
                    </div>
                    <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block text-center px-4 py-2.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 border-t border-gray-100 dark:border-slate-700">View all notifications</Link>
                  </div>
                </>
              )}
            </div>
            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-semibold">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50 animate-scaleIn">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"><User className="w-4 h-4" /> Profile</Link>
                    <Link to="/referrals" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"><Gift className="w-4 h-4" /> Referrals</Link>
                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Onboarding checklist */}
          {showOnboarding && onboarding.progress < 100 && location.pathname === '/dashboard' && (
            <div className="mb-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-5 animate-fadeIn">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">🚀 Get started with SubFlow</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Complete these steps to set up your account</p>
                </div>
                <button onClick={() => setShowOnboarding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 text-sm">✕</button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                <div className="bg-primary-500 rounded-full h-2 transition-all" style={{ width: `${onboarding.progress}%` }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {onboarding.steps.map(s => (
                  <Link key={s.id} to={s.link} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${s.completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-white/80'}`}>
                    {s.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-slate-600" />}
                    <span className="truncate">{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ====================================================================
// ADMIN LAYOUT
// ====================================================================
const adminNav = [
  { key: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { key: '/admin/users', label: 'Users', icon: Users },
  { key: '/admin/services', label: 'Services', icon: Server },
  { key: '/admin/plans', label: 'Plans', icon: Package },
  { key: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { key: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { key: '/admin/payments', label: 'Payments', icon: Wallet },
  { key: '/admin/tickets', label: 'Support', icon: MessageSquare },
  { key: '/admin/status', label: 'System Status', icon: Activity },
  { key: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      <CommandPalette />
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-100 dark:border-slate-700">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-slate-100">SubFlow</span>
          <span className="ml-auto px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-semibold rounded-full">ADMIN</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {adminNav.map(item => {
            const Icon = item.icon;
            const active = item.exact ? location.pathname === item.key : location.pathname.startsWith(item.key);
            return (
              <Link key={item.key} to={item.key} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'}`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <BarChart3 className="w-4 h-4" />
            <span>Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
              <Bell className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
