-- ============================================================
-- SubFlow — Subscription Management Portal
-- Complete SQL Schema (MySQL / PostgreSQL compatible)
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- 2. SERVICES TABLE
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_services_category (category),
    INDEX idx_services_status (status)
);

-- 3. PLANS TABLE
CREATE TABLE plans (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    service_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    billing_cycle ENUM('monthly', 'quarterly', 'semi_annual', 'annual') NOT NULL DEFAULT 'monthly',
    features JSON,
    trial_days INT NOT NULL DEFAULT 0,
    status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
    max_users INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_plans_service (service_id),
    INDEX idx_plans_status (status)
);

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'paused', 'cancelled', 'expired') NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    trial_end DATE,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    INDEX idx_subs_user (user_id),
    INDEX idx_subs_status (status),
    INDEX idx_subs_dates (start_date, end_date)
);

-- 5. INVOICES TABLE
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subscription_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('paid', 'pending', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_at TIMESTAMP NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_invoices_user (user_id),
    INDEX idx_invoices_status (status),
    INDEX idx_invoices_due (due_date)
);

-- 6. PAYMENTS TABLE
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    method_type ENUM('card', 'paypal', 'bank_transfer') NOT NULL DEFAULT 'card',
    card_brand VARCHAR(50),
    card_last4 VARCHAR(4),
    card_holder VARCHAR(200),
    transaction_id VARCHAR(255) UNIQUE,
    status ENUM('paid', 'pending', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    refund_reason TEXT,
    refunded_at TIMESTAMP NULL,
    refunded_by VARCHAR(36),
    billing_address VARCHAR(500),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_zip VARCHAR(20),
    billing_country VARCHAR(5),
    paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (refunded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_payments_invoice (invoice_id),
    INDEX idx_payments_user (user_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_date (paid_at)
);

-- 7. SUPPORT_TICKETS TABLE
CREATE TABLE support_tickets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    category VARCHAR(100),
    assigned_to VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tickets_user (user_id),
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_assigned (assigned_to)
);

-- 8. PAYMENT_METHODS TABLE
CREATE TABLE payment_methods (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('card', 'paypal', 'bank_transfer') NOT NULL DEFAULT 'card',
    label VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    last4 VARCHAR(4),
    brand VARCHAR(50),
    expiry_month INT,
    expiry_year INT,
    holder_name VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_pm_user (user_id),
    INDEX idx_pm_default (user_id, is_default)
);

-- 9. TICKET_MESSAGES TABLE
CREATE TABLE ticket_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    sender_role ENUM('user', 'admin') NOT NULL,
    message TEXT NOT NULL,
    attachments JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_ticket (ticket_id)
);

-- 10. AUDIT_LOGS TABLE
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id)
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read)
);

-- ============================================================
-- VIEWS for analytics
-- ============================================================

-- Monthly Revenue View
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    DATE_FORMAT(i.created_at, '%Y-%m') AS month,
    COUNT(DISTINCT i.id) AS invoice_count,
    SUM(i.total) AS total_revenue,
    SUM(CASE WHEN i.status = 'paid' THEN i.total ELSE 0 END) AS collected,
    SUM(CASE WHEN i.status = 'pending' THEN i.total ELSE 0 END) AS pending
FROM invoices i
GROUP BY DATE_FORMAT(i.created_at, '%Y-%m')
ORDER BY month DESC;

-- User Subscription Summary View
CREATE OR REPLACE VIEW user_subscription_summary AS
SELECT 
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(s.id) AS total_subscriptions,
    SUM(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END) AS active_subscriptions,
    COALESCE(SUM(CASE WHEN s.status = 'active' THEN p.price ELSE 0 END), 0) AS monthly_spend
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
LEFT JOIN plans p ON s.plan_id = p.id
GROUP BY u.id, u.email, u.first_name, u.last_name;

-- Service Popularity View
CREATE OR REPLACE VIEW service_popularity AS
SELECT 
    sv.id AS service_id,
    sv.name AS service_name,
    sv.category,
    COUNT(DISTINCT s.user_id) AS subscriber_count,
    COUNT(DISTINCT p.id) AS plan_count
FROM services sv
LEFT JOIN plans p ON sv.id = p.service_id
LEFT JOIN subscriptions s ON p.id = s.plan_id AND s.status = 'active'
GROUP BY sv.id, sv.name, sv.category
ORDER BY subscriber_count DESC;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER //

-- Cancel a subscription
CREATE PROCEDURE cancel_subscription(
    IN p_subscription_id VARCHAR(36)
)
BEGIN
    UPDATE subscriptions 
    SET status = 'cancelled', 
        auto_renew = FALSE, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_subscription_id;
END //

-- Generate monthly invoices
CREATE PROCEDURE generate_monthly_invoices()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_sub_id VARCHAR(36);
    DECLARE v_user_id VARCHAR(36);
    DECLARE v_plan_price DECIMAL(10,2);
    DECLARE v_invoice_num VARCHAR(50);
    
    DECLARE sub_cursor CURSOR FOR
        SELECT s.id, s.user_id, p.price
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.status = 'active' AND s.auto_renew = TRUE;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN sub_cursor;
    
    read_loop: LOOP
        FETCH sub_cursor INTO v_sub_id, v_user_id, v_plan_price;
        IF done THEN LEAVE read_loop; END IF;
        
        SET v_invoice_num = CONCAT('INV-', DATE_FORMAT(NOW(), '%Y%m'), '-', UPPER(SUBSTRING(UUID(), 1, 8)));
        
        INSERT INTO invoices (subscription_id, user_id, amount, tax, discount, total, status, due_date, invoice_number)
        VALUES (
            v_sub_id, v_user_id, v_plan_price,
            v_plan_price * 0.18, 0,
            v_plan_price * 1.18, 'pending',
            DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY),
            v_invoice_num
        );
    END LOOP;
    
    CLOSE sub_cursor;
END //

DELIMITER ;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_users_timestamp 
BEFORE UPDATE ON users
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER update_services_timestamp 
BEFORE UPDATE ON services
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- SEED DATA (for testing)
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_verified) VALUES
('admin-001', 'admin@subflow.io', 'hashed_admin123', 'Admin', 'User', '+1234567890', 'admin', TRUE);

-- Sample services
INSERT INTO services (id, name, description, category, icon) VALUES
('svc-001', 'Cloud Storage Pro', 'Enterprise-grade cloud storage with 99.9% uptime SLA', 'Cloud', 'Cloud'),
('svc-002', 'DevOps Pipeline', 'CI/CD pipeline with automated testing and deployment', 'Developer Tools', 'GitBranch'),
('svc-003', 'Analytics Suite', 'Real-time analytics with custom dashboards and reports', 'Analytics', 'BarChart3'),
('svc-004', 'Security Shield', 'End-to-end security monitoring and threat detection', 'Security', 'Shield'),
('svc-005', 'Team Collaboration', 'Real-time messaging, video calls, and project management', 'Communication', 'Users'),
('svc-006', 'Email Marketing', 'Automated email campaigns with A/B testing', 'Marketing', 'Mail');

-- Sample plans
INSERT INTO plans (id, service_id, name, description, price, billing_cycle, features, trial_days, max_users) VALUES
('plan-001', 'svc-001', 'Starter', '50GB storage, basic features', 9.99, 'monthly', '["50GB Storage","Basic Sharing","Email Support"]', 14, 1),
('plan-002', 'svc-001', 'Professional', '500GB storage, advanced features', 24.99, 'monthly', '["500GB Storage","Advanced Sharing","Priority Support","API Access"]', 14, 5),
('plan-003', 'svc-001', 'Enterprise', 'Unlimited storage, all features', 49.99, 'monthly', '["Unlimited Storage","Advanced Sharing","24/7 Support","API Access","Custom Domain","SSO"]', 30, 50),
('plan-004', 'svc-002', 'Basic', '5 pipelines, basic runners', 19.99, 'monthly', '["5 Pipelines","Basic Runners","GitHub Integration"]', 7, 3),
('plan-005', 'svc-002', 'Pro', 'Unlimited pipelines, advanced runners', 49.99, 'monthly', '["Unlimited Pipelines","Advanced Runners","All Integrations","Parallel Execution"]', 14, 15),
('plan-006', 'svc-003', 'Basic', 'Basic analytics and 3 dashboards', 14.99, 'monthly', '["3 Dashboards","Basic Reports","7-day History"]', 14, 2),
('plan-007', 'svc-003', 'Business', 'Full analytics with custom reports', 39.99, 'monthly', '["Unlimited Dashboards","Custom Reports","1-year History","Real-time Data"]', 14, 10),
('plan-008', 'svc-004', 'Standard', 'Basic threat detection', 29.99, 'monthly', '["Threat Detection","Weekly Reports","Email Alerts"]', 14, 5),
('plan-009', 'svc-005', 'Team', 'Up to 25 team members', 12.99, 'monthly', '["25 Members","Group Chat","Video Calls (10)"]', 14, 25),
('plan-010', 'svc-005', 'Business', 'Unlimited team members', 29.99, 'monthly', '["Unlimited Members","Group Chat","Video Calls (100)","Admin Controls","SSO"]', 14, 999),
('plan-011', 'svc-006', 'Starter', 'Up to 1,000 contacts', 14.99, 'monthly', '["1,000 Contacts","Basic Automation","3 Templates"]', 14, 1),
('plan-012', 'svc-006', 'Growth', 'Up to 50,000 contacts', 49.99, 'monthly', '["50,000 Contacts","Advanced Automation","Unlimited Templates","A/B Testing"]', 14, 5);
