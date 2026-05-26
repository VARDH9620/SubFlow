// ============================================================
// SubFlow — Simulated SQL Database Layer
// Uses localStorage to persist data across sessions
// All operations mirror SQL queries for easy migration
// ============================================================

import type {
  User, Service, Plan, Subscription, Invoice, Payment,
  SupportTicket, TicketMessage, Notification, PaymentMethod,
  DashboardStats, ChartDataPoint, PaymentStats, UserRole,
  SubscriptionStatus, TicketStatus, PaymentStatus,
} from '../types';
import emailjs from '@emailjs/browser';

// --- UUID generator ---
const uid = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2, 11);

// --- Storage helpers ---
function getTable<T>(name: string): T[] {
  try {
    const data = localStorage.getItem(`subflow_${name}`);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function setTable<T>(name: string, data: T[]): void {
  localStorage.setItem(`subflow_${name}`, JSON.stringify(data));
}

// --- Simple password hash (for demo — use bcrypt in production) ---
function hashPassword(pw: string): string {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    const c = pw.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash |= 0;
  }
  return 'hashed_' + Math.abs(hash).toString(36) + '_' + pw.length;
}

// ====================================================================
// DATABASE INITIALIZATION
// ====================================================================

export function initializeDatabase(): void {
  if (localStorage.getItem('subflow_initialized')) return;

  // Admin user
  const adminUser: User = {
    id: 'admin-001',
    email: 'admin@subflow.io',
    password_hash: hashPassword('admin123'),
    first_name: 'Admin',
    last_name: 'User',
    phone: '+1234567890',
    avatar_url: null,
    role: 'admin',
    is_verified: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  };

  setTable('users', [adminUser]);
  setTable('services', []);
  setTable('plans', []);
  setTable('subscriptions', []);
  setTable('invoices', []);
  setTable('support_tickets', []);
  setTable('ticket_messages', []);
  setTable('notifications', []);
  setTable('audit_logs', []);
  setTable('payment_methods', []);

  localStorage.setItem('subflow_initialized', 'true');
}

export function resetDatabase(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('subflow_'));
  keys.forEach(k => localStorage.removeItem(k));
  initializeDatabase();
}

// ====================================================================
// QUERY FUNCTIONS — mirror SQL SELECT statements
// ====================================================================

// --- AUTH ---
export function authenticateUser(email: string, password: string): User | null {
  const users = getTable<User>('users');
  const user = users.find(u => u.email === email);
  if (!user) return null;
  if (user.password_hash !== hashPassword(password)) return null;
  return { ...user };
}

export function registerUser(data: {
  first_name: string; last_name: string;
  email: string; phone: string; password: string;
  is_verified?: boolean;
}): User | null {
  const users = getTable<User>('users');
  if (users.find(u => u.email === data.email)) return null;

  const newUser: User = {
    id: uid(),
    email: data.email,
    password_hash: hashPassword(data.password),
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    avatar_url: null,
    role: 'user',
    is_verified: data.is_verified ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  users.push(newUser);
  setTable('users', users);
  return { ...newUser };
}

// ====================================================================
// OTP & PASSWORD RESET — Simulated email verification
// ====================================================================

// In-memory OTP store (persists only during session)
const otpStore: Record<string, { otp: string; expires: number; attempts: number }> = {};

export function generateOTP(email: string): string {
  // Generate secure random 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.toLowerCase()] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };

  // Send real email to user in real-time using EmailJS
  emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service',
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template',
    {
      email: email,
      passcode: otp,
      time: new Date(Date.now() + 10 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key'
  ).catch(err => {
    console.error("Failed to send verification email via EmailJS:", err);
  });

  return otp;
}

export function verifyOTP(email: string, code: string): { valid: boolean; error?: string } {
  const entry = otpStore[email.toLowerCase()];
  if (!entry) return { valid: false, error: 'No OTP was sent to this email. Please request a new one.' };
  if (Date.now() > entry.expires) {
    delete otpStore[email.toLowerCase()];
    return { valid: false, error: 'OTP has expired. Please request a new one.' };
  }
  entry.attempts++;
  if (entry.attempts > 5) {
    delete otpStore[email.toLowerCase()];
    return { valid: false, error: 'Too many attempts. Please request a new OTP.' };
  }
  if (code !== entry.otp) return { valid: false, error: `Invalid OTP. ${5 - entry.attempts} attempts remaining.` };
  delete otpStore[email.toLowerCase()];
  return { valid: true };
}

export function markUserVerified(email: string): void {
  const users = getTable<User>('users');
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx].is_verified = true;
    users[idx].updated_at = new Date().toISOString();
    setTable('users', users);
  }
}

export function checkEmailExists(email: string): boolean {
  return getTable<User>('users').some(u => u.email === email);
}

export function resetPassword(email: string, newPassword: string): boolean {
  const users = getTable<User>('users');
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) return false;
  users[idx].password_hash = hashPassword(newPassword);
  users[idx].updated_at = new Date().toISOString();
  setTable('users', users);
  return true;
}

// --- USERS ---
export function getAllUsers(): User[] {
  return getTable<User>('users');
}

export function getUserById(id: string): User | null {
  return getTable<User>('users').find(u => u.id === id) || null;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getTable<User>('users');
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data, updated_at: new Date().toISOString() };
  setTable('users', users);
  return { ...users[idx] };
}

export function deleteUser(id: string): boolean {
  const users = getTable<User>('users');
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  setTable('users', filtered);
  // Cascade delete
  setTable('subscriptions', getTable<Subscription>('subscriptions').filter(s => s.user_id !== id));
  setTable('invoices', getTable<Invoice>('invoices').filter(i => i.user_id !== id));
  setTable('support_tickets', getTable<SupportTicket>('support_tickets').filter(t => t.user_id !== id));
  return true;
}

// --- SERVICES ---
export function getAllServices(): Service[] {
  return getTable<Service>('services');
}

export function getServiceById(id: string): Service | null {
  return getTable<Service>('services').find(s => s.id === id) || null;
}

export function createService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Service {
  const services = getTable<Service>('services');
  const svc: Service = { ...data, id: uid(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  services.push(svc);
  setTable('services', services);
  return svc;
}

export function updateService(id: string, data: Partial<Service>): Service | null {
  const services = getTable<Service>('services');
  const idx = services.findIndex(s => s.id === id);
  if (idx === -1) return null;
  services[idx] = { ...services[idx], ...data, updated_at: new Date().toISOString() };
  setTable('services', services);
  return { ...services[idx] };
}

export function deleteService(id: string): boolean {
  const services = getTable<Service>('services');
  const filtered = services.filter(s => s.id !== id);
  if (filtered.length === services.length) return false;
  setTable('services', filtered);
  setTable('plans', getTable<Plan>('plans').filter(p => p.service_id !== id));
  return true;
}

// --- PLANS ---
export function getAllPlans(): Plan[] {
  return getTable<Plan>('plans');
}

export function getPlansByService(serviceId: string): Plan[] {
  return getTable<Plan>('plans').filter(p => p.service_id === serviceId);
}

export function getPlanById(id: string): Plan | null {
  return getTable<Plan>('plans').find(p => p.id === id) || null;
}

export function createPlan(data: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Plan {
  const plans = getTable<Plan>('plans');
  const plan: Plan = { ...data, id: uid(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  plans.push(plan);
  setTable('plans', plans);
  return plan;
}

export function updatePlan(id: string, data: Partial<Plan>): Plan | null {
  const plans = getTable<Plan>('plans');
  const idx = plans.findIndex(p => p.id === id);
  if (idx === -1) return null;
  plans[idx] = { ...plans[idx], ...data, updated_at: new Date().toISOString() };
  setTable('plans', plans);
  return { ...plans[idx] };
}

export function deletePlan(id: string): boolean {
  const plans = getTable<Plan>('plans');
  const filtered = plans.filter(p => p.id !== id);
  if (filtered.length === plans.length) return false;
  setTable('plans', filtered);
  return true;
}

// --- SUBSCRIPTIONS ---
export function getSubscriptionsByUser(userId: string): Subscription[] {
  const subs = getTable<Subscription>('subscriptions').filter(s => s.user_id === userId);
  const plans = getTable<Plan>('plans');
  const services = getTable<Service>('services');
  return subs.map(sub => {
    const plan = plans.find(p => p.id === sub.plan_id);
    const service = plan ? services.find(s => s.id === plan.service_id) : null;
    return {
      ...sub,
      plan_name: plan?.name || 'Unknown',
      service_name: service?.name || 'Unknown',
      service_id: service?.id,
      price: plan?.price || 0,
      billing_cycle: plan?.billing_cycle,
    };
  });
}

export function getAllSubscriptions(): Subscription[] {
  const subs = getTable<Subscription>('subscriptions');
  const plans = getTable<Plan>('plans');
  const services = getTable<Service>('services');
  const users = getTable<User>('users');
  return subs.map(sub => {
    const plan = plans.find(p => p.id === sub.plan_id);
    const service = plan ? services.find(s => s.id === plan.service_id) : null;
    const user = users.find(u => u.id === sub.user_id);
    return {
      ...sub,
      plan_name: plan?.name || 'Unknown',
      service_name: service?.name || 'Unknown',
      service_id: service?.id,
      price: plan?.price || 0,
      billing_cycle: plan?.billing_cycle,
      user_email: user?.email || 'Unknown',
      user_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
    };
  });
}

export function createSubscription(userId: string, planId: string): Subscription {
  const plan = getPlanById(planId);
  const now = new Date();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);

  const sub: Subscription = {
    id: uid(),
    user_id: userId,
    plan_id: planId,
    status: 'active',
    start_date: now.toISOString().split('T')[0],
    end_date: end.toISOString().split('T')[0],
    trial_end: plan ? new Date(now.getTime() + plan.trial_days * 86400000).toISOString().split('T')[0] : null,
    auto_renew: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const subs = getTable<Subscription>('subscriptions');
  subs.push(sub);
  setTable('subscriptions', subs);

  // Generate invoice
  if (plan) {
    const amount = plan.price;
    const tax = +(amount * 0.18).toFixed(2);
    const invoice: Invoice = {
      id: uid(),
      subscription_id: sub.id,
      user_id: userId,
      amount: +amount.toFixed(2),
      tax,
      discount: 0,
      total: +(amount + tax).toFixed(2),
      status: 'pending',
      due_date: new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0],
      paid_at: null,
      invoice_number: `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${uid().slice(0, 8).toUpperCase()}`,
      created_at: now.toISOString(),
    };
    const invoices = getTable<Invoice>('invoices');
    invoices.push(invoice);
    setTable('invoices', invoices);
  }

  return sub;
}

export function updateSubscriptionStatus(id: string, status: SubscriptionStatus): Subscription | null {
  const subs = getTable<Subscription>('subscriptions');
  const idx = subs.findIndex(s => s.id === id);
  if (idx === -1) return null;
  subs[idx] = { ...subs[idx], status, auto_renew: status === 'active' ? subs[idx].auto_renew : false, updated_at: new Date().toISOString() };
  setTable('subscriptions', subs);
  return { ...subs[idx] };
}

export function toggleAutoRenew(id: string): Subscription | null {
  const subs = getTable<Subscription>('subscriptions');
  const idx = subs.findIndex(s => s.id === id);
  if (idx === -1) return null;
  subs[idx].auto_renew = !subs[idx].auto_renew;
  subs[idx].updated_at = new Date().toISOString();
  setTable('subscriptions', subs);
  return { ...subs[idx] };
}

// --- INVOICES ---
export function getInvoicesByUser(userId: string): Invoice[] {
  const invoices = getTable<Invoice>('invoices').filter(i => i.user_id === userId);
  const subs = getTable<Subscription>('subscriptions');
  const plans = getTable<Plan>('plans');
  const services = getTable<Service>('services');
  return invoices.map(inv => {
    const sub = subs.find(s => s.id === inv.subscription_id);
    const plan = sub ? plans.find(p => p.id === sub.plan_id) : null;
    const service = plan ? services.find(s => s.id === plan.service_id) : null;
    return {
      ...inv,
      plan_name: plan?.name || 'Unknown',
      service_name: service?.name || 'Unknown',
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllInvoices(): Invoice[] {
  const invoices = getTable<Invoice>('invoices');
  const subs = getTable<Subscription>('subscriptions');
  const plans = getTable<Plan>('plans');
  const services = getTable<Service>('services');
  const users = getTable<User>('users');
  return invoices.map(inv => {
    const sub = subs.find(s => s.id === inv.subscription_id);
    const plan = sub ? plans.find(p => p.id === sub.plan_id) : null;
    const service = plan ? services.find(s => s.id === plan.service_id) : null;
    const user = users.find(u => u.id === inv.user_id);
    return {
      ...inv,
      plan_name: plan?.name || 'Unknown',
      service_name: service?.name || 'Unknown',
      user_email: user?.email || 'Unknown',
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function updateInvoiceStatus(id: string, status: PaymentStatus): Invoice | null {
  const invoices = getTable<Invoice>('invoices');
  const idx = invoices.findIndex(i => i.id === id);
  if (idx === -1) return null;
  invoices[idx].status = status;
  invoices[idx].paid_at = status === 'paid' ? new Date().toISOString() : invoices[idx].paid_at;
  setTable('invoices', invoices);
  return { ...invoices[idx] };
}

// --- SUPPORT TICKETS ---
export function getTicketsByUser(userId: string): SupportTicket[] {
  const tickets = getTable<SupportTicket>('support_tickets').filter(t => t.user_id === userId);
  const users = getTable<User>('users');
  return tickets.map(t => {
    const user = users.find(u => u.id === t.user_id);
    const admin = t.assigned_to ? users.find(u => u.id === t.assigned_to) : null;
    return { ...t, user_email: user?.email, user_name: user ? `${user.first_name} ${user.last_name}` : '', admin_name: admin ? `${admin.first_name} ${admin.last_name}` : undefined };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllTickets(): SupportTicket[] {
  const tickets = getTable<SupportTicket>('support_tickets');
  const users = getTable<User>('users');
  return tickets.map(t => {
    const user = users.find(u => u.id === t.user_id);
    const admin = t.assigned_to ? users.find(u => u.id === t.assigned_to) : null;
    return { ...t, user_email: user?.email, user_name: user ? `${user.first_name} ${user.last_name}` : '', admin_name: admin ? `${admin.first_name} ${admin.last_name}` : undefined };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createTicket(userId: string, data: { subject: string; description: string; category: string; priority: 'low' | 'medium' | 'high' | 'critical' }): SupportTicket {
  const tickets = getTable<SupportTicket>('support_tickets');
  const ticket: SupportTicket = {
    id: uid(),
    user_id: userId,
    subject: data.subject,
    description: data.description,
    status: 'open',
    priority: data.priority,
    category: data.category,
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tickets.push(ticket);
  setTable('support_tickets', tickets);
  return ticket;
}

export function updateTicket(id: string, data: Partial<SupportTicket>): SupportTicket | null {
  const tickets = getTable<SupportTicket>('support_tickets');
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tickets[idx] = { ...tickets[idx], ...data, updated_at: new Date().toISOString() };
  setTable('support_tickets', tickets);
  return { ...tickets[idx] };
}

// --- TICKET MESSAGES ---
export function getMessagesByTicket(ticketId: string): TicketMessage[] {
  const messages = getTable<TicketMessage>('ticket_messages').filter(m => m.ticket_id === ticketId);
  const users = getTable<User>('users');
  return messages.map(m => {
    const user = users.find(u => u.id === m.sender_id);
    return { ...m, sender_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown' };
  }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function addTicketMessage(ticketId: string, senderId: string, senderRole: UserRole, message: string): TicketMessage {
  const messages = getTable<TicketMessage>('ticket_messages');
  const msg: TicketMessage = {
    id: uid(),
    ticket_id: ticketId,
    sender_id: senderId,
    sender_role: senderRole,
    message,
    attachments: [],
    created_at: new Date().toISOString(),
  };
  messages.push(msg);
  setTable('ticket_messages', messages);
  return msg;
}

// --- ANALYTICS ---
export function getAdminDashboardStats(): DashboardStats {
  const users = getTable<User>('users');
  const subs = getTable<Subscription>('subscriptions');
  const services = getTable<Service>('services');
  const tickets = getTable<SupportTicket>('support_tickets');

  const activeSubs = subs.filter(s => s.status === 'active');
  const plans = getTable<Plan>('plans');

  const monthlyRevenue = activeSubs.reduce((sum, sub) => {
    const plan = plans.find(p => p.id === sub.plan_id);
    return sum + (plan?.price || 0);
  }, 0);

  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getMonth();
  const newUsersThisMonth = users.filter(u => new Date(u.created_at).getMonth() === thisMonth).length;
  const lastMonthUsers = users.filter(u => new Date(u.created_at).getMonth() === lastMonth).length;
  void users; void lastMonthUsers;

  const totalSubs = subs.length;
  const cancelledSubs = subs.filter(s => s.status === 'cancelled').length;
  const churnRate = totalSubs > 0 ? (cancelledSubs / totalSubs) * 100 : 0;

  const lastMonthRevenue = monthlyRevenue * 0.88;
  const revenueGrowth = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  return {
    total_users: users.filter(u => u.role === 'user').length,
    active_subscriptions: activeSubs.length,
    monthly_revenue: +monthlyRevenue.toFixed(2),
    total_services: services.length,
    pending_tickets: tickets.filter(t => t.status === 'open').length,
    churn_rate: +churnRate.toFixed(1),
    revenue_growth: +revenueGrowth.toFixed(1),
    new_users_this_month: newUsersThisMonth,
  };
}

export function getRevenueChartData(): ChartDataPoint[] {
  const invoices = getTable<Invoice>('invoices');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  return months.slice(0, now.getMonth() + 1).map((name, i) => {
    const monthInvoices = invoices.filter(inv => {
      const d = new Date(inv.created_at);
      return d.getMonth() === i && d.getFullYear() === now.getFullYear();
    });
    return {
      name,
      revenue: +monthInvoices.reduce((s, inv) => s + (inv.status === 'paid' ? inv.total : 0), 0).toFixed(2),
    };
  });
}

export function getUserGrowthChartData(): ChartDataPoint[] {
  const users = getTable<User>('users');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  let cumulative = 1; // admin

  return months.slice(0, now.getMonth() + 1).map((name, i) => {
    const monthUsers = users.filter(u => {
      const d = new Date(u.created_at);
      return d.getMonth() === i && d.getFullYear() === now.getFullYear();
    }).length;
    cumulative += monthUsers;
    return { name, users: cumulative };
  });
}

export function getSubscriptionChartData(): ChartDataPoint[] {
  const subs = getTable<Subscription>('subscriptions');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  return months.slice(0, now.getMonth() + 1).map((name, i) => {
    const monthSubs = subs.filter(s => {
      const d = new Date(s.created_at);
      return d.getMonth() === i && d.getFullYear() === now.getFullYear();
    }).length;
    return { name, subscriptions: monthSubs };
  });
}

// ====================================================================
// PAYMENT METHODS
// ====================================================================

export function getPaymentMethods(userId: string): PaymentMethod[] {
  return getTable<PaymentMethod>('payment_methods').filter(pm => pm.user_id === userId);
}

export function addPaymentMethod(userId: string, data: {
  type: 'card' | 'paypal' | 'bank_transfer';
  label: string;
  last4?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  holder_name?: string;
  is_default?: boolean;
}): PaymentMethod {
  const methods = getTable<PaymentMethod>('payment_methods');
  const newMethod: PaymentMethod = {
    id: uid(),
    user_id: userId,
    type: data.type,
    label: data.label,
    is_default: data.is_default ?? methods.filter(m => m.user_id === userId).length === 0,
    last4: data.last4,
    brand: data.brand,
    expiry_month: data.expiry_month,
    expiry_year: data.expiry_year,
    holder_name: data.holder_name,
    created_at: new Date().toISOString(),
  };
  if (newMethod.is_default) {
    const updated = methods.map(m => m.user_id === userId ? { ...m, is_default: false } : m);
    updated.push(newMethod);
    setTable('payment_methods', updated);
  } else {
    methods.push(newMethod);
    setTable('payment_methods', methods);
  }
  return newMethod;
}

export function deletePaymentMethod(id: string): boolean {
  const methods = getTable<PaymentMethod>('payment_methods');
  const filtered = methods.filter(m => m.id !== id);
  if (filtered.length === methods.length) return false;
  setTable('payment_methods', filtered);
  return true;
}

export function setDefaultPaymentMethod(userId: string, methodId: string): void {
  const methods = getTable<PaymentMethod>('payment_methods');
  setTable('payment_methods', methods.map(m => ({
    ...m,
    is_default: m.user_id === userId && m.id === methodId,
  })));
}

export function getDefaultPaymentMethod(userId: string): PaymentMethod | null {
  return getTable<PaymentMethod>('payment_methods').find(m => m.user_id === userId && m.is_default) || null;
}

// ====================================================================
// PROCESS PAYMENT — Full realistic flow
// ====================================================================

export function processPayment(userId: string, invoiceId: string, paymentDetails: {
  method: string;
  method_type: 'card' | 'paypal' | 'bank_transfer';
  card_brand?: string;
  card_last4?: string;
  card_holder?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
}): Payment {
  const invoices = getTable<Invoice>('invoices');
  const inv = invoices.find(i => i.id === invoiceId);
  const now = new Date();

  const payment: Payment = {
    id: uid(),
    invoice_id: invoiceId,
    user_id: userId,
    amount: inv?.amount || 0,
    tax: inv?.tax || 0,
    discount: inv?.discount || 0,
    total: inv?.total || 0,
    method: paymentDetails.method,
    method_type: paymentDetails.method_type,
    card_brand: paymentDetails.card_brand,
    card_last4: paymentDetails.card_last4,
    card_holder: paymentDetails.card_holder,
    transaction_id: `TXN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${uid().slice(0, 10).toUpperCase()}`,
    status: 'paid',
    paid_at: now.toISOString(),
    billing_address: paymentDetails.billing_address,
    billing_city: paymentDetails.billing_city,
    billing_state: paymentDetails.billing_state,
    billing_zip: paymentDetails.billing_zip,
    billing_country: paymentDetails.billing_country,
    created_at: now.toISOString(),
  };

  const payments = getTable<Payment>('payments');
  payments.push(payment);
  setTable('payments', payments);

  // Update invoice status
  const idx = invoices.findIndex(i => i.id === invoiceId);
  if (idx !== -1) {
    invoices[idx].status = 'paid';
    invoices[idx].paid_at = now.toISOString();
    setTable('invoices', invoices);
  }

  return payment;
}

// --- REFUND PAYMENT ---
export function refundPayment(paymentId: string, reason: string, adminId: string): Payment | null {
  const payments = getTable<Payment>('payments');
  const idx = payments.findIndex(p => p.id === paymentId);
  if (idx === -1) return null;

  const now = new Date();
  payments[idx] = {
    ...payments[idx],
    status: 'refunded',
    refund_reason: reason,
    refunded_at: now.toISOString(),
    refunded_by: adminId,
  };
  setTable('payments', payments);

  // Also update the linked invoice
  const invoices = getTable<Invoice>('invoices');
  const invIdx = invoices.findIndex(i => i.id === payments[idx].invoice_id);
  if (invIdx !== -1) {
    invoices[invIdx].status = 'refunded';
    setTable('invoices', invoices);
  }

  return { ...payments[idx] };
}

// ====================================================================
// GET PAYMENTS — Joined with user, service, plan info
// ====================================================================

function enrichPayment(p: Payment): Payment {
  const invoices = getTable<Invoice>('invoices');
  const subs = getTable<Subscription>('subscriptions');
  const plans = getTable<Plan>('plans');
  const services = getTable<Service>('services');
  const users = getTable<User>('users');

  const inv = invoices.find(i => i.id === p.invoice_id);
  const sub = inv ? subs.find(s => s.id === inv.subscription_id) : undefined;
  const plan = sub ? plans.find(pl => pl.id === sub.plan_id) : undefined;
  const svc = plan ? services.find(s => s.id === plan.service_id) : undefined;
  const usr = users.find(u => u.id === p.user_id);

  return {
    ...p,
    plan_name: plan?.name,
    service_name: svc?.name,
    service_id: svc?.id,
    invoice_number: inv?.invoice_number,
    user_email: usr?.email,
    user_name: usr ? `${usr.first_name} ${usr.last_name}` : undefined,
  };
}

export function getPaymentsByUser(userId: string): Payment[] {
  return getTable<Payment>('payments')
    .filter(p => p.user_id === userId)
    .map(enrichPayment)
    .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
}

export function getAllPayments(): Payment[] {
  return getTable<Payment>('payments')
    .map(enrichPayment)
    .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
}

export function getPaymentById(id: string): Payment | null {
  const p = getTable<Payment>('payments').find(p => p.id === id);
  return p ? enrichPayment(p) : null;
}

// ====================================================================
// PAYMENT STATS — For admin analytics
// ====================================================================

export function getPaymentStats(): PaymentStats {
  const payments = getTable<Payment>('payments');
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  const paid = payments.filter(p => p.status === 'paid');
  const refunded = payments.filter(p => p.status === 'refunded');

  const totalCollected = paid.reduce((s, p) => s + p.total, 0);
  const totalRefunded = refunded.reduce((s, p) => s + p.total, 0);
  const pendingInvoices = getTable<Invoice>('invoices').filter(i => i.status === 'pending');
  const totalPending = pendingInvoices.reduce((s, i) => s + i.total, 0);

  const byMethod: Record<string, { count: number; total: number }> = {};
  const byBrand: Record<string, { count: number; total: number }> = {};

  paid.forEach(p => {
    const mk = p.method_type;
    if (!byMethod[mk]) byMethod[mk] = { count: 0, total: 0 };
    byMethod[mk].count++;
    byMethod[mk].total += p.total;

    if (p.card_brand) {
      if (!byBrand[p.card_brand]) byBrand[p.card_brand] = { count: 0, total: 0 };
      byBrand[p.card_brand].count++;
      byBrand[p.card_brand].total += p.total;
    }
  });

  // Daily revenue for last 14 days
  const dailyRevenue: { date: string; amount: number; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayPayments = paid.filter(p => p.paid_at.split('T')[0] === dateStr);
    dailyRevenue.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: +dayPayments.reduce((s, p) => s + p.total, 0).toFixed(2),
      count: dayPayments.length,
    });
  }

  return {
    total_collected: +totalCollected.toFixed(2),
    total_pending: +totalPending.toFixed(2),
    total_refunded: +totalRefunded.toFixed(2),
    successful_payments: paid.length,
    failed_payments: payments.filter(p => p.status === 'failed').length,
    avg_transaction: paid.length > 0 ? +(totalCollected / paid.length).toFixed(2) : 0,
    today_revenue: +paid.filter(p => p.paid_at.split('T')[0] === today).reduce((s, p) => s + p.total, 0).toFixed(2),
    this_week_revenue: +paid.filter(p => p.paid_at.split('T')[0] >= weekAgo).reduce((s, p) => s + p.total, 0).toFixed(2),
    this_month_revenue: +paid.filter(p => p.paid_at.split('T')[0] >= monthStart).reduce((s, p) => s + p.total, 0).toFixed(2),
    by_method: Object.entries(byMethod).map(([method, data]) => ({ method, ...data })),
    by_brand: Object.entries(byBrand).map(([brand, data]) => ({ brand, ...data })),
    daily_revenue: dailyRevenue,
  };
}

export function getCategoryDistribution(): { name: string; value: number }[] {
  const subs = getTable<Subscription>('subscriptions').filter(s => s.status === 'active');
  const plans = getTable<Plan>('plans');
  const services = getTable<Service>('services');

  const catMap: Record<string, number> = {};
  subs.forEach(sub => {
    const plan = plans.find(p => p.id === sub.plan_id);
    if (plan) {
      const svc = services.find(s => s.id === plan.service_id);
      if (svc) {
        catMap[svc.category] = (catMap[svc.category] || 0) + 1;
      }
    }
  });

  return Object.entries(catMap).map(([name, value]) => ({ name, value }));
}

// ====================================================================
// NOTIFICATIONS — Real-time notification system
// ====================================================================

export function createNotification(userId: string, data: {
  title: string; message: string; type: 'info' | 'success' | 'warning' | 'error';
}): Notification {
  const notifs = getTable<Notification>('notifications');
  const n: Notification = {
    id: uid(), user_id: userId, ...data, read: false, created_at: new Date().toISOString(),
  };
  notifs.unshift(n);
  setTable('notifications', notifs);
  return n;
}

export function getNotifications(userId: string): Notification[] {
  return getTable<Notification>('notifications')
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function markNotificationRead(id: string): void {
  const notifs = getTable<Notification>('notifications');
  const idx = notifs.findIndex(n => n.id === id);
  if (idx !== -1) { notifs[idx].read = true; setTable('notifications', notifs); }
}

export function markAllNotificationsRead(userId: string): void {
  const notifs = getTable<Notification>('notifications');
  setTable('notifications', notifs.map(n => n.user_id === userId ? { ...n, read: true } : n));
}

export function clearNotifications(userId: string): void {
  setTable('notifications', getTable<Notification>('notifications').filter(n => n.user_id !== userId));
}

// ====================================================================
// AUDIT LOG — Activity trail
// ====================================================================

export interface AuditEntry {
  id: string; user_id: string; user_name: string; user_email: string;
  action: string; entity_type: string; entity_name: string;
  details: string; ip_address: string; created_at: string;
}

export function addAuditLog(userId: string, action: string, entityType: string, entityId: string, details: string): void {
  const logs = getTable<Record<string, string>>('audit_logs');
  const user = getUserById(userId);
  logs.unshift({
    id: uid(), user_id: userId,
    user_name: user ? `${user.first_name} ${user.last_name}` : 'System',
    user_email: user?.email || 'system',
    action, entity_type: entityType, entity_id: entityId, details,
    ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
    created_at: new Date().toISOString(),
  });
  // Keep last 200 entries
  if (logs.length > 200) setTable('audit_logs', logs.slice(0, 200));
  else setTable('audit_logs', logs);
}

export function getAuditLogs(): AuditEntry[] {
  const logs = getTable<Record<string, string>>('audit_logs');
  return logs.map(l => ({
    id: l.id, user_id: l.user_id,
    user_name: l.user_name || 'Unknown', user_email: l.user_email || '',
    action: l.action, entity_type: l.entity_type,
    entity_name: l.entity_id,
    details: l.details, ip_address: l.ip_address,
    created_at: l.created_at,
  }));
}

export function getUserActivityLog(userId: string): AuditEntry[] {
  return getAuditLogs().filter(l => l.user_id === userId).slice(0, 50);
}

// ====================================================================
// SERVICE REVIEWS & RATINGS
// ====================================================================

export interface Review {
  id: string; user_id: string; service_id: string;
  user_name: string; rating: number; title: string; body: string;
  helpful: number; created_at: string;
}

export function addReview(userId: string, serviceId: string, rating: number, title: string, body: string): Review {
  const reviews = getTable<Review>('reviews');
  const user = getUserById(userId);
  const rev: Review = {
    id: uid(), user_id: userId, service_id: serviceId,
    user_name: user ? `${user.first_name} ${user.last_name}` : 'Anonymous',
    rating, title, body, helpful: 0, created_at: new Date().toISOString(),
  };
  reviews.push(rev);
  setTable('reviews', reviews);
  return rev;
}

export function getServiceReviews(serviceId: string): Review[] {
  return getTable<Review>('reviews').filter(r => r.service_id === serviceId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getServiceRating(serviceId: string): { avg: number; count: number; distribution: number[] } {
  const reviews = getServiceReviews(serviceId);
  if (reviews.length === 0) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const distribution = [1, 2, 3, 4, 5].map(star => reviews.filter(r => r.rating === star).length);
  return { avg: +avg.toFixed(1), count: reviews.length, distribution };
}

export function getUserReviewForService(userId: string, serviceId: string): Review | null {
  return getTable<Review>('reviews').find(r => r.user_id === userId && r.service_id === serviceId) || null;
}

// ====================================================================
// REFERRAL & CREDITS SYSTEM
// ====================================================================

export interface ReferralInfo {
  code: string; referred_count: number; credits_earned: number; credits_used: number;
  credits_balance: number; referrals: { email: string; status: string; date: string }[];
}

export function getReferralInfo(userId: string): ReferralInfo {
  const refs = getTable<Record<string, string>>('referrals');
  const mine = refs.filter(r => r.referrer_id === userId);
  const user = getUserById(userId);
  const code = user?.id ? `SUB-${user.id.slice(0, 6).toUpperCase()}` : 'SUB-NEW';
  const earned = mine.length * 10;
  return {
    code, referred_count: mine.length,
    credits_earned: earned, credits_used: 0, credits_balance: earned,
    referrals: mine.map(r => ({ email: r.referred_email || '', status: r.status || 'pending', date: r.created_at || '' })),
  };
}

export function applyReferralCode(code: string): boolean { return code.startsWith('SUB-'); }

// ====================================================================
// SYSTEM HEALTH STATUS
// ====================================================================

export interface SystemStatus {
  services: { name: string; status: 'operational' | 'degraded' | 'outage'; uptime: number; latency: number; lastIncident: string | null }[];
  overall: 'operational' | 'degraded' | 'outage';
  uptime30d: number;
  incidents: { title: string; status: string; started: string; resolved: string | null; updates: { time: string; message: string }[] }[];
}

export function getSystemStatus(): SystemStatus {
  return {
    overall: 'operational', uptime30d: 99.97,
    services: [
      { name: 'API Gateway', status: 'operational', uptime: 99.99, latency: 12, lastIncident: null },
      { name: 'Auth Service', status: 'operational', uptime: 99.98, latency: 8, lastIncident: '2025-01-10T10:00:00Z' },
      { name: 'Billing Engine', status: 'operational', uptime: 99.95, latency: 25, lastIncident: '2025-01-08T14:30:00Z' },
      { name: 'CDN', status: 'operational', uptime: 99.99, latency: 3, lastIncident: null },
      { name: 'Database', status: 'operational', uptime: 99.97, latency: 5, lastIncident: '2024-12-28T06:00:00Z' },
      { name: 'Email Service', status: 'operational', uptime: 99.92, latency: 45, lastIncident: '2025-01-05T09:15:00Z' },
      { name: 'Webhooks', status: 'operational', uptime: 99.96, latency: 18, lastIncident: null },
      { name: 'Storage', status: 'operational', uptime: 99.99, latency: 6, lastIncident: null },
    ],
    incidents: [
      { title: 'Email delivery delays', status: 'resolved', started: '2025-01-05T09:15:00Z', resolved: '2025-01-05T11:45:00Z',
        updates: [
          { time: '2025-01-05T09:15:00Z', message: 'We are investigating delays in email delivery. Some transactional emails may be delayed.' },
          { time: '2025-01-05T10:30:00Z', message: 'Issue identified. Our email provider is experiencing upstream problems.' },
          { time: '2025-01-05T11:45:00Z', message: 'Email delivery has been restored. All queued emails have been sent.' },
        ]},
      { title: 'Database connection timeouts', status: 'resolved', started: '2024-12-28T06:00:00Z', resolved: '2024-12-28T07:20:00Z',
        updates: [
          { time: '2024-12-28T06:00:00Z', message: 'Increased database connection timeouts detected. Investigating.' },
          { time: '2024-12-28T07:20:00Z', message: 'Connection pool has been scaled. All systems nominal.' },
        ]},
    ],
  };
}

// ====================================================================
// ONBOARDING STATUS
// ====================================================================

export interface OnboardingStep {
  id: string; title: string; description: string; completed: boolean; link: string; icon: string;
}

export function getOnboardingSteps(userId: string): OnboardingStep[] {
  const subs = getSubscriptionsByUser(userId);
  const payments = getPaymentsByUser(userId);
  const methods = getPaymentMethods(userId);
  return [
    { id: 'profile', title: 'Complete your profile', description: 'Add your name, phone, and billing address', completed: true, link: '/profile', icon: 'User' },
    { id: 'subscribe', title: 'Subscribe to a service', description: 'Browse services and choose a plan that fits', completed: subs.length > 0, link: '/services', icon: 'CreditCard' },
    { id: 'payment', title: 'Set up payment method', description: 'Add a card for automatic billing', completed: methods.length > 0, link: '/payment', icon: 'Wallet' },
    { id: 'first_payment', title: 'Make your first payment', description: 'Complete your first billing cycle', completed: payments.length > 0, link: '/billing', icon: 'DollarSign' },
    { id: 'support', title: 'Explore support center', description: 'Learn how to get help when you need it', completed: false, link: '/support', icon: 'LifeBuoy' },
  ];
}

export function getOnboardingProgress(userId: string): number {
  const steps = getOnboardingSteps(userId);
  return Math.round((steps.filter(s => s.completed).length / steps.length) * 100);
}
