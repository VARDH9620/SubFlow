// ============================================================
// SubFlow — Type Definitions
// Maps directly to the SQL schema in db/schema.sql
// ============================================================

export type UserRole = 'user' | 'admin';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type BillingCycle = 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
export type PlanStatus = 'active' | 'archived';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  service_id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: BillingCycle;
  features: string[];
  trial_days: number;
  status: PlanStatus;
  max_users: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  trial_end: string | null;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  plan_name?: string;
  service_name?: string;
  service_id?: string;
  price?: number;
  billing_cycle?: BillingCycle;
  user_email?: string;
  user_name?: string;
}

export interface Invoice {
  id: string;
  subscription_id: string;
  user_id: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: PaymentStatus;
  due_date: string;
  paid_at: string | null;
  invoice_number: string;
  created_at: string;
  // Joined fields
  plan_name?: string;
  service_name?: string;
  user_email?: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  user_id: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  method: string;
  method_type: 'card' | 'paypal' | 'bank_transfer';
  card_brand?: string;
  card_last4?: string;
  card_holder?: string;
  transaction_id: string;
  status: PaymentStatus;
  paid_at: string;
  refund_reason?: string;
  refunded_at?: string;
  refunded_by?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  created_at: string;
  // Joined fields
  plan_name?: string;
  service_name?: string;
  service_id?: string;
  invoice_number?: string;
  user_email?: string;
  user_name?: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  label: string;
  is_default: boolean;
  last4?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  holder_name?: string;
  created_at: string;
}

export interface PaymentForm {
  card_number: string;
  card_holder: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  save_card: boolean;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
}

export interface PaymentStats {
  total_collected: number;
  total_pending: number;
  total_refunded: number;
  successful_payments: number;
  failed_payments: number;
  avg_transaction: number;
  today_revenue: number;
  this_week_revenue: number;
  this_month_revenue: number;
  by_method: { method: string; count: number; total: number }[];
  by_brand: { brand: string; count: number; total: number }[];
  daily_revenue: { date: string; amount: number; count: number }[];
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_email?: string;
  user_name?: string;
  admin_name?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: UserRole;
  message: string;
  attachments: string[];
  created_at: string;
  sender_name?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// Dashboard analytics types
export interface DashboardStats {
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  total_services: number;
  pending_tickets: number;
  churn_rate: number;
  revenue_growth: number;
  new_users_this_month: number;
}

export interface ChartDataPoint {
  name: string;
  revenue?: number;
  users?: number;
  subscriptions?: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface ServiceForm {
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive';
}

export interface PlanForm {
  service_id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: BillingCycle;
  features: string[];
  trial_days: number;
  status: PlanStatus;
  max_users: number;
}

// Toast notification
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
