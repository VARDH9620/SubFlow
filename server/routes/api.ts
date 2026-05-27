import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Simple in-memory OTP store on server
const otpStore: Record<string, { otp: string; expires: number; attempts: number }> = {};

// Helper for hashing password (must match the client-side hash or be simple)
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
// AUTH
// ====================================================================

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, is_verified } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashPassword(password),
        first_name,
        last_name,
        phone,
        is_verified: is_verified ?? true,
        role: 'user',
      },
    });

    // Create default audit log
    await prisma.auditLog.create({
      data: {
        user_id: user.id,
        action: 'REGISTER',
        entity_type: 'USER',
        entity_id: user.id,
        details: 'User registered account',
        ip_address: '127.0.0.1',
      },
    });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/otp/generate', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.toLowerCase()] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };
  res.json({ otp });
});

router.post('/auth/otp/verify', (req, res) => {
  const { email, code } = req.body;
  const entry = otpStore[email?.toLowerCase()];
  if (!entry) return res.json({ valid: false, error: 'No OTP sent. Please request a new one.' });
  if (Date.now() > entry.expires) {
    delete otpStore[email.toLowerCase()];
    return res.json({ valid: false, error: 'OTP has expired.' });
  }
  entry.attempts++;
  if (entry.attempts > 5) {
    delete otpStore[email.toLowerCase()];
    return res.json({ valid: false, error: 'Too many attempts.' });
  }
  if (code !== entry.otp) {
    return res.json({ valid: false, error: `Invalid OTP. ${5 - entry.attempts} attempts remaining.` });
  }
  delete otpStore[email.toLowerCase()];
  res.json({ valid: true });
});

router.post('/auth/verify', async (req, res) => {
  try {
    const { email } = req.body;
    await prisma.user.update({
      where: { email },
      data: { is_verified: true },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/auth/check-email', async (req, res) => {
  try {
    const email = req.query.email as string;
    const user = await prisma.user.findUnique({ where: { email } });
    res.json({ exists: !!user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.update({
      where: { email },
      data: { password_hash: hashPassword(newPassword) },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// USERS
// ====================================================================

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// SERVICES
// ====================================================================

router.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(services);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await prisma.service.create({ data: req.body });
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// PLANS
// ====================================================================

router.get('/plans', async (req, res) => {
  try {
    const { serviceId } = req.query;
    const filter = serviceId ? { service_id: serviceId as string } : {};
    const plans = await prisma.plan.findMany({
      where: filter,
      orderBy: { created_at: 'desc' },
    });
    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await prisma.plan.findUnique({ where: { id: req.params.id } });
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const plan = await prisma.plan.create({ data: req.body });
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/plans/:id', async (req, res) => {
  try {
    const plan = await prisma.plan.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/plans/:id', async (req, res) => {
  try {
    await prisma.plan.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// SUBSCRIPTIONS
// ====================================================================

router.get('/users/:userId/subscriptions', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      where: { user_id: req.params.userId },
      include: { plan: { include: { service: true } } },
    });
    const enriched = subs.map(s => ({
      ...s,
      plan_name: s.plan.name,
      service_name: s.plan.service.name,
      service_id: s.plan.service.id,
      price: s.plan.price,
      billing_cycle: s.plan.billing_cycle,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/subscriptions', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      include: { plan: { include: { service: true } }, user: true },
    });
    const enriched = subs.map(s => ({
      ...s,
      plan_name: s.plan.name,
      service_name: s.plan.service.name,
      service_id: s.plan.service.id,
      price: s.plan.price,
      billing_cycle: s.plan.billing_cycle,
      user_email: s.user.email,
      user_name: `${s.user.first_name} ${s.user.last_name}`,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscriptions', async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);

    const trialEnd = plan.trial_days > 0 
      ? new Date(now.getTime() + plan.trial_days * 86400000).toISOString().split('T')[0]
      : null;

    const sub = await prisma.subscription.create({
      data: {
        user_id: userId,
        plan_id: planId,
        status: 'active',
        start_date: now.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        trial_end: trialEnd,
        auto_renew: true,
      },
    });

    // Generate Invoice
    const amount = plan.price;
    const tax = +(amount * 0.18).toFixed(2);
    const invoiceNum = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    await prisma.invoice.create({
      data: {
        subscription_id: sub.id,
        user_id: userId,
        amount: +amount.toFixed(2),
        tax,
        discount: 0,
        total: +(amount + tax).toFixed(2),
        status: 'pending',
        due_date: new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0],
        invoice_number: invoiceNum,
      },
    });

    res.json(sub);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/subscriptions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const sub = await prisma.subscription.update({
      where: { id: req.params.id },
      data: {
        status,
        auto_renew: status === 'active',
      },
    });
    res.json(sub);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/subscriptions/:id/toggle-renew', async (req, res) => {
  try {
    const current = await prisma.subscription.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ error: 'Subscription not found' });

    const sub = await prisma.subscription.update({
      where: { id: req.params.id },
      data: { auto_renew: !current.auto_renew },
    });
    res.json(sub);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// INVOICES
// ====================================================================

router.get('/users/:userId/invoices', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { user_id: req.params.userId },
      include: { subscription: { include: { plan: { include: { service: true } } } } },
      orderBy: { created_at: 'desc' },
    });
    const enriched = invoices.map(i => ({
      ...i,
      plan_name: i.subscription.plan.name,
      service_name: i.subscription.plan.service.name,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { subscription: { include: { plan: { include: { service: true } } } }, user: true },
      orderBy: { created_at: 'desc' },
    });
    const enriched = invoices.map(i => ({
      ...i,
      plan_name: i.subscription.plan.name,
      service_name: i.subscription.plan.service.name,
      user_email: i.user.email,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        status,
        paid_at: status === 'paid' ? new Date().toISOString() : null,
      },
    });
    res.json(invoice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// SUPPORT TICKETS
// ====================================================================

router.get('/users/:userId/tickets', async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { user_id: req.params.userId },
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
    const enriched = await Promise.all(tickets.map(async t => {
      let adminName = undefined;
      if (t.assigned_to) {
        const admin = await prisma.user.findUnique({ where: { id: t.assigned_to } });
        if (admin) adminName = `${admin.first_name} ${admin.last_name}`;
      }
      return {
        ...t,
        user_email: t.user.email,
        user_name: `${t.user.first_name} ${t.user.last_name}`,
        admin_name: adminName,
      };
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tickets', async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
    const enriched = await Promise.all(tickets.map(async t => {
      let adminName = undefined;
      if (t.assigned_to) {
        const admin = await prisma.user.findUnique({ where: { id: t.assigned_to } });
        if (admin) adminName = `${admin.first_name} ${admin.last_name}`;
      }
      return {
        ...t,
        user_email: t.user.email,
        user_name: `${t.user.first_name} ${t.user.last_name}`,
        admin_name: adminName,
      };
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tickets', async (req, res) => {
  try {
    const { userId, subject, description, category, priority } = req.body;
    const ticket = await prisma.supportTicket.create({
      data: {
        user_id: userId,
        subject,
        description,
        category,
        priority,
        status: 'open',
      },
    });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tickets/:id', async (req, res) => {
  try {
    const ticket = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// TICKET MESSAGES
// ====================================================================

router.get('/tickets/:ticketId/messages', async (req, res) => {
  try {
    const messages = await prisma.ticketMessage.findMany({
      where: { ticket_id: req.params.ticketId },
      include: { sender: true },
      orderBy: { created_at: 'asc' },
    });
    const enriched = messages.map(m => ({
      ...m,
      sender_name: `${m.sender.first_name} ${m.sender.last_name}`,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tickets/:ticketId/messages', async (req, res) => {
  try {
    const { senderId, senderRole, message } = req.body;
    const msg = await prisma.ticketMessage.create({
      data: {
        ticket_id: req.params.ticketId,
        sender_id: senderId,
        sender_role: senderRole,
        message,
        attachments: [],
      },
    });
    res.json(msg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// PAYMENT METHODS
// ====================================================================

router.get('/users/:userId/payment-methods', async (req, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { user_id: req.params.userId },
      orderBy: { created_at: 'desc' },
    });
    res.json(methods);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users/:userId/payment-methods', async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const existing = await prisma.paymentMethod.findMany({ where: { user_id: userId } });
    const isDefault = data.is_default ?? existing.length === 0;

    if (isDefault) {
      // Set all others to false
      await prisma.paymentMethod.updateMany({
        where: { user_id: userId },
        data: { is_default: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        user_id: userId,
        type: data.type,
        label: data.label,
        is_default: isDefault,
        last4: data.last4,
        brand: data.brand,
        expiry_month: data.expiry_month,
        expiry_year: data.expiry_year,
        holder_name: data.holder_name,
      },
    });
    res.json(method);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/payment-methods/:id', async (req, res) => {
  try {
    await prisma.paymentMethod.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:userId/payment-methods/:methodId/default', async (req, res) => {
  try {
    const { userId, methodId } = req.params;
    await prisma.paymentMethod.updateMany({
      where: { user_id: userId },
      data: { is_default: false },
    });
    await prisma.paymentMethod.update({
      where: { id: methodId },
      data: { is_default: true },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:userId/payment-methods/default', async (req, res) => {
  try {
    const method = await prisma.paymentMethod.findFirst({
      where: { user_id: req.params.userId, is_default: true },
    });
    res.json(method);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// PAYMENTS
// ====================================================================

router.get('/users/:userId/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { user_id: req.params.userId },
      include: { invoice: { include: { subscription: { include: { plan: { include: { service: true } } } } } } },
      orderBy: { paid_at: 'desc' },
    });
    const enriched = payments.map(p => ({
      ...p,
      plan_name: p.invoice.subscription.plan.name,
      service_name: p.invoice.subscription.plan.service.name,
      service_id: p.invoice.subscription.plan.service.id,
      invoice_number: p.invoice.invoice_number,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { invoice: { include: { subscription: { include: { plan: { include: { service: true } } } } } }, user: true },
      orderBy: { paid_at: 'desc' },
    });
    const enriched = payments.map(p => ({
      ...p,
      plan_name: p.invoice.subscription.plan.name,
      service_name: p.invoice.subscription.plan.service.name,
      service_id: p.invoice.subscription.plan.service.id,
      invoice_number: p.invoice.invoice_number,
      user_email: p.user.email,
      user_name: `${p.user.first_name} ${p.user.last_name}`,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/payments/:id', async (req, res) => {
  try {
    const p = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { invoice: { include: { subscription: { include: { plan: { include: { service: true } } } } } }, user: true },
    });
    if (!p) return res.status(404).json({ error: 'Payment not found' });
    const enriched = {
      ...p,
      plan_name: p.invoice.subscription.plan.name,
      service_name: p.invoice.subscription.plan.service.name,
      service_id: p.invoice.subscription.plan.service.id,
      invoice_number: p.invoice.invoice_number,
      user_email: p.user.email,
      user_name: `${p.user.first_name} ${p.user.last_name}`,
    };
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payments', async (req, res) => {
  try {
    const { userId, invoiceId, paymentDetails } = req.body;
    const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    const now = new Date();
    const txnNum = `TXN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        invoice_id: invoiceId,
        user_id: userId,
        amount: inv.amount,
        tax: inv.tax,
        discount: inv.discount,
        total: inv.total,
        method: paymentDetails.method,
        method_type: paymentDetails.method_type,
        card_brand: paymentDetails.card_brand,
        card_last4: paymentDetails.card_last4,
        card_holder: paymentDetails.card_holder,
        transaction_id: txnNum,
        status: 'paid',
        paid_at: now.toISOString(),
        billing_address: paymentDetails.billing_address,
        billing_city: paymentDetails.billing_city,
        billing_state: paymentDetails.billing_state,
        billing_zip: paymentDetails.billing_zip,
        billing_country: paymentDetails.billing_country,
      },
    });

    // Update invoice status
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        paid_at: now.toISOString(),
      },
    });

    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payments/:id/refund', async (req, res) => {
  try {
    const { reason, adminId } = req.body;
    const now = new Date();

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: {
        status: 'refunded',
        refund_reason: reason,
        refunded_at: now.toISOString(),
        refunded_by: adminId,
      },
    });

    // Update the linked invoice
    await prisma.invoice.update({
      where: { id: payment.invoice_id },
      data: { status: 'refunded' },
    });

    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// NOTIFICATIONS
// ====================================================================

router.get('/users/:userId/notifications', async (req, res) => {
  try {
    const notifs = await prisma.notification.findMany({
      where: { user_id: req.params.userId },
      orderBy: { created_at: 'desc' },
    });
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notifications', async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const notif = await prisma.notification.create({
      data: {
        user_id: userId,
        title,
        message,
        type: type ?? 'info',
      },
    });
    res.json(notif);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:userId/notifications/read-all', async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { user_id: req.params.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:userId/notifications', async (req, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { user_id: req.params.userId },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// AUDIT LOGS
// ====================================================================

router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { created_at: 'desc' },
      take: 200,
    });
    const enriched = await Promise.all(logs.map(async l => {
      let userName = 'System';
      let userEmail = 'system';
      if (l.user_id) {
        const u = await prisma.user.findUnique({ where: { id: l.user_id } });
        if (u) {
          userName = `${u.first_name} ${u.last_name}`;
          userEmail = u.email;
        }
      }
      return {
        id: l.id,
        user_id: l.user_id || 'system',
        user_name: userName,
        user_email: userEmail,
        action: l.action,
        entity_type: l.entity_type,
        entity_name: l.entity_id,
        details: l.details,
        ip_address: l.ip_address,
        created_at: l.created_at,
      };
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:userId/activity-log', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { user_id: req.params.userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    const enriched = await Promise.all(logs.map(async l => {
      let userName = 'System';
      let userEmail = 'system';
      if (l.user_id) {
        const u = await prisma.user.findUnique({ where: { id: l.user_id } });
        if (u) {
          userName = `${u.first_name} ${u.last_name}`;
          userEmail = u.email;
        }
      }
      return {
        id: l.id,
        user_id: l.user_id || 'system',
        user_name: userName,
        user_email: userEmail,
        action: l.action,
        entity_type: l.entity_type,
        entity_name: l.entity_id,
        details: l.details,
        ip_address: l.ip_address,
        created_at: l.created_at,
      };
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/audit-logs', async (req, res) => {
  try {
    const { userId, action, entityType, entityId, details } = req.body;
    const log = await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        ip_address: '127.0.0.1',
      },
    });
    res.json(log);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// REVIEWS
// ====================================================================

router.get('/services/:serviceId/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { service_id: req.params.serviceId },
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
    const enriched = reviews.map(r => ({
      ...r,
      user_name: `${r.user.first_name} ${r.user.last_name}`,
    }));
    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/services/:serviceId/rating', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { service_id: req.params.serviceId },
    });
    if (reviews.length === 0) {
      return res.json({ avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] });
    }
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const distribution = [1, 2, 3, 4, 5].map(star => reviews.filter(r => r.rating === star).length);
    res.json({ avg: +avg.toFixed(1), count: reviews.length, distribution });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:userId/services/:serviceId/reviews', async (req, res) => {
  try {
    const review = await prisma.review.findFirst({
      where: { user_id: req.params.userId, service_id: req.params.serviceId },
    });
    res.json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { userId, serviceId, rating, title, body } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const review = await prisma.review.create({
      data: {
        user_id: userId,
        service_id: serviceId,
        rating,
        title,
        body,
        helpful: 0,
      },
    });
    res.json({
      ...review,
      user_name: user ? `${user.first_name} ${user.last_name}` : 'Anonymous',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// REFERRALS
// ====================================================================

router.get('/users/:userId/referrals', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const code = user?.id ? `SUB-${user.id.slice(0, 6).toUpperCase()}` : 'SUB-NEW';

    const referrals = await prisma.referral.findMany({
      where: { referrer_id: userId },
    });

    const earned = referrals.length * 10;
    res.json({
      code,
      referred_count: referrals.length,
      credits_earned: earned,
      credits_used: 0,
      credits_balance: earned,
      referrals: referrals.map(r => ({
        email: r.referred_email,
        status: r.status,
        date: r.created_at,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/referrals/check-code', (req, res) => {
  const code = req.query.code as string;
  const valid = code?.startsWith('SUB-');
  res.json({ valid });
});

// ====================================================================
// SYSTEM HEALTH STATUS
// ====================================================================

router.get('/system/status', (req, res) => {
  res.json({
    overall: 'operational',
    uptime30d: 99.97,
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
      {
        title: 'Email delivery delays',
        status: 'resolved',
        started: '2025-01-05T09:15:00Z',
        resolved: '2025-01-05T11:45:00Z',
        updates: [
          { time: '2025-01-05T09:15:00Z', message: 'We are investigating delays in email delivery. Some transactional emails may be delayed.' },
          { time: '2025-01-05T10:30:00Z', message: 'Issue identified. Our email provider is experiencing upstream problems.' },
          { time: '2025-01-05T11:45:00Z', message: 'Email delivery has been restored. All queued emails have been sent.' },
        ],
      },
      {
        title: 'Database connection timeouts',
        status: 'resolved',
        started: '2024-12-28T06:00:00Z',
        resolved: '2024-12-28T07:20:00Z',
        updates: [
          { time: '2024-12-28T06:00:00Z', message: 'Increased database connection timeouts detected. Investigating.' },
          { time: '2024-12-28T07:20:00Z', message: 'Connection pool has been scaled. All systems nominal.' },
        ],
      },
    ],
  });
});

// ====================================================================
// ONBOARDING STATUS
// ====================================================================

router.get('/users/:userId/onboarding-steps', async (req, res) => {
  try {
    const userId = req.params.userId;
    const subsCount = await prisma.subscription.count({ where: { user_id: userId } });
    const paymentsCount = await prisma.payment.count({ where: { user_id: userId } });
    const methodsCount = await prisma.paymentMethod.count({ where: { user_id: userId } });

    res.json([
      { id: 'profile', title: 'Complete your profile', description: 'Add your name, phone, and billing address', completed: true, link: '/profile', icon: 'User' },
      { id: 'subscribe', title: 'Subscribe to a service', description: 'Browse services and choose a plan that fits', completed: subsCount > 0, link: '/services', icon: 'CreditCard' },
      { id: 'payment', title: 'Set up payment method', description: 'Add a card for automatic billing', completed: methodsCount > 0, link: '/payment', icon: 'Wallet' },
      { id: 'first_payment', title: 'Make your first payment', description: 'Complete your first billing cycle', completed: paymentsCount > 0, link: '/billing', icon: 'DollarSign' },
      { id: 'support', title: 'Explore support center', description: 'Learn how to get help when you need it', completed: false, link: '/support', icon: 'LifeBuoy' },
    ]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:userId/onboarding-progress', async (req, res) => {
  try {
    const userId = req.params.userId;
    const subsCount = await prisma.subscription.count({ where: { user_id: userId } });
    const paymentsCount = await prisma.payment.count({ where: { user_id: userId } });
    const methodsCount = await prisma.paymentMethod.count({ where: { user_id: userId } });

    const steps = [true, subsCount > 0, methodsCount > 0, paymentsCount > 0, false];
    const completed = steps.filter(Boolean).length;
    const progress = Math.round((completed / steps.length) * 100);
    res.json({ progress });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// ANALYTICS (DASHBOARD & CHARTS)
// ====================================================================

router.get('/analytics/dashboard', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'user' } });
    const activeSubs = await prisma.subscription.count({ where: { status: 'active' } });
    const totalServices = await prisma.service.count();
    const pendingTickets = await prisma.supportTicket.count({ where: { status: 'open' } });

    // Active plans and subscriptions to calculate Monthly Recurring Revenue (MRR)
    const subscriptions = await prisma.subscription.findMany({
      where: { status: 'active' },
      include: { plan: true },
    });
    const monthlyRevenue = subscriptions.reduce((sum, s) => sum + s.plan.price, 0);

    const totalSubs = await prisma.subscription.count();
    const cancelledSubs = await prisma.subscription.count({ where: { status: 'cancelled' } });
    const churnRate = totalSubs > 0 ? (cancelledSubs / totalSubs) * 100 : 0;

    const lastMonthRevenue = monthlyRevenue * 0.88;
    const revenueGrowth = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await prisma.user.count({
      where: { created_at: { gte: startOfMonth }, role: 'user' },
    });

    res.json({
      total_users: totalUsers,
      active_subscriptions: activeSubs,
      monthly_revenue: +monthlyRevenue.toFixed(2),
      total_services: totalServices,
      pending_tickets: pendingTickets,
      churn_rate: +churnRate.toFixed(1),
      revenue_growth: +revenueGrowth.toFixed(1),
      new_users_this_month: newUsersThisMonth,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/revenue', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { status: 'paid' },
    });
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentYear = now.getFullYear();

    const data = months.slice(0, now.getMonth() + 1).map((name, i) => {
      const monthInvoices = invoices.filter(inv => {
        const d = new Date(inv.created_at);
        return d.getMonth() === i && d.getFullYear() === currentYear;
      });
      return {
        name,
        revenue: +monthInvoices.reduce((s, inv) => s + inv.total, 0).toFixed(2),
      };
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/user-growth', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
    });
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentYear = now.getFullYear();
    let cumulative = 1; // Starting from admin/system baseline

    const data = months.slice(0, now.getMonth() + 1).map((name, i) => {
      const monthUsers = users.filter(u => {
        const d = new Date(u.created_at);
        return d.getMonth() === i && d.getFullYear() === currentYear;
      }).length;
      cumulative += monthUsers;
      return { name, users: cumulative };
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/subscriptions', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentYear = now.getFullYear();

    const data = months.slice(0, now.getMonth() + 1).map((name, i) => {
      const monthSubs = subs.filter(s => {
        const d = new Date(s.created_at);
        return d.getMonth() === i && d.getFullYear() === currentYear;
      }).length;
      return { name, subscriptions: monthSubs };
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/payment-stats', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const paid = payments.filter(p => p.status === 'paid');
    const refunded = payments.filter(p => p.status === 'refunded');

    const totalCollected = paid.reduce((s, p) => s + p.total, 0);
    const totalRefunded = refunded.reduce((s, p) => s + p.total, 0);
    const totalPending = await prisma.invoice.aggregate({
      _sum: { total: true },
      where: { status: 'pending' },
    }).then(res => res._sum.total || 0);

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

    res.json({
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
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/category-distribution', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      where: { status: 'active' },
      include: { plan: { include: { service: true } } },
    });

    const catMap: Record<string, number> = {};
    subs.forEach(s => {
      const category = s.plan.service.category;
      catMap[category] = (catMap[category] || 0) + 1;
    });

    const dist = Object.entries(catMap).map(([name, value]) => ({ name, value }));
    res.json(dist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
