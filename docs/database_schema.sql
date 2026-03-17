-- ============================================
-- FrameBook Pro - MySQL Database Schema
-- ============================================
-- This file provides an alternative MySQL schema
-- The application currently uses MongoDB
-- Use this if you plan to migrate to MySQL
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS framebook_pro_db;
USE framebook_pro_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') NOT NULL,
    client_id VARCHAR(36) DEFAULT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_role (role)
);

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    domain VARCHAR(100) UNIQUE,
    subscription_plan ENUM('basic', 'premium', 'enterprise') DEFAULT 'basic',
    enabled_languages JSON DEFAULT '["en"]',
    theme ENUM('light', 'dark') DEFAULT 'light',
    enabled_modules JSON DEFAULT '["about", "services", "gallery", "booking", "contact"]',
    primary_color VARCHAR(20) DEFAULT '#1e40af',
    logo_url VARCHAR(500),
    max_gallery_images INT DEFAULT 50,
    max_products INT DEFAULT 100,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_domain (domain),
    INDEX idx_status (status)
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name_en VARCHAR(255),
    name_hi VARCHAR(255),
    name_kn VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    description_kn TEXT,
    price DECIMAL(12, 2),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_active (client_id, is_active),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_display_order (client_id, display_order),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- PRODUCT CATEGORIES TABLE
-- ============================================
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name_en VARCHAR(255),
    name_hi VARCHAR(255),
    name_kn VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name_en VARCHAR(255),
    name_hi VARCHAR(255),
    name_kn VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    description_kn TEXT,
    images JSON DEFAULT '[]',
    base_price DECIMAL(12, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    final_price DECIMAL(12, 2) NOT NULL,
    category_id VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_category (client_id, category_id),
    INDEX idx_active (client_id, is_active),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id) ON DELETE SET NULL
);

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    event_date DATE,
    event_type VARCHAR(100),
    source ENUM('website', 'manual', 'instagram', 'referral', 'other') DEFAULT 'website',
    status ENUM('new', 'contacted', 'follow_up', 'quotation_sent', 'confirmed', 'lost') DEFAULT 'new',
    assigned_package_id VARCHAR(36),
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_status (client_id, status),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- LEAD NOTES TABLE
-- ============================================
CREATE TABLE lead_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id VARCHAR(36) NOT NULL UNIQUE,
    lead_id VARCHAR(36) NOT NULL,
    note TEXT NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lead_id (lead_id),
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id) ON DELETE CASCADE
);

-- ============================================
-- PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    base_price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    included_services JSON DEFAULT '[]',
    default_discount DECIMAL(5, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- ADDONS TABLE
-- ============================================
CREATE TABLE addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    addon_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- QUOTATIONS TABLE
-- ============================================
CREATE TABLE quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_id VARCHAR(36) NOT NULL UNIQUE,
    quotation_number VARCHAR(20) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    lead_id VARCHAR(36) NOT NULL,
    items JSON NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    tax_percentage DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    status ENUM('draft', 'sent', 'accepted', 'rejected') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_lead_id (lead_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id) ON DELETE CASCADE
);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL UNIQUE,
    invoice_number VARCHAR(20) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    quotation_id VARCHAR(36),
    lead_id VARCHAR(36) NOT NULL,
    issue_date DATE NOT NULL,
    event_date DATE,
    items JSON NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    balance_due DECIMAL(12, 2) NOT NULL,
    status ENUM('unpaid', 'partially_paid', 'paid') DEFAULT 'unpaid',
    payments JSON DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_status (client_id, status),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id) ON DELETE CASCADE
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    lead_id VARCHAR(36),
    booking_id VARCHAR(36),
    invoice_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(500),
    status ENUM('inquiry', 'confirmed', 'completed', 'cancelled') DEFAULT 'inquiry',
    revenue DECIMAL(12, 2) DEFAULT 0,
    total_expenses DECIMAL(12, 2) DEFAULT 0,
    profit DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_event_date (client_id, event_date),
    INDEX idx_status (client_id, status),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    category ENUM('travel', 'equipment', 'assistant', 'other') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_event_id (event_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(500),
    message TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_event_date (client_id, event_date),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('info', 'success', 'warning', 'booking', 'lead', 'payment', 'system') DEFAULT 'info',
    link VARCHAR(500),
    metadata JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_unread (client_id, is_read),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- SITE CONTENT TABLE
-- ============================================
CREATE TABLE site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL UNIQUE,
    hero JSON,
    about JSON,
    services_section JSON,
    gallery_section JSON,
    products_section JSON,
    booking_section JSON,
    contact JSON,
    footer JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- BLOCKED DATES TABLE
-- ============================================
CREATE TABLE blocked_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blocked_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_client_date (client_id, date),
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- OFFERS TABLE
-- ============================================
CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    offer_id VARCHAR(36) NOT NULL UNIQUE,
    client_id VARCHAR(36) NOT NULL,
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    title_kn VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    description_kn TEXT,
    discount_percentage DECIMAL(5, 2),
    flat_discount DECIMAL(12, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    banner_image VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    INDEX idx_active (client_id, status),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- ============================================
-- SAMPLE DATA INSERT
-- ============================================

-- Insert Super Admin (password: admin123)
INSERT INTO users (user_id, email, password, role, full_name) VALUES
('super-admin-001', 'admin@framebookpro.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ6Jvp1fQ5Z8K6.', 'super_admin', 'Platform Administrator');

-- Insert Demo Client
INSERT INTO clients (client_id, business_name, email, phone, domain, subscription_plan, enabled_languages, enabled_modules, primary_color, max_gallery_images, max_products) VALUES
('demo-client-001', 'Stellar Photography', 'demo@stellar.com', '+1234567890', 'stellar-photo', 'premium', '["en", "hi"]', '["about", "services", "gallery", "booking", "products", "offers", "contact"]', '#2563eb', 50, 100);

-- Insert Demo Admin (password: demo123)
INSERT INTO users (user_id, email, password, role, client_id, full_name) VALUES
('demo-admin-001', 'demo@stellar.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ6Jvp1fQ5Z8K6.', 'admin', 'demo-client-001', 'Demo Admin');

-- Insert Sample Services
INSERT INTO services (service_id, client_id, name_en, name_hi, description_en, description_hi, price, is_active, display_order) VALUES
('service-001', 'demo-client-001', 'Wedding Photography', 'शादी की फोटोग्राफी', 'Complete wedding coverage with candid and traditional shots', 'कैंडिड और पारंपरिक शॉट्स के साथ संपूर्ण शादी कवरेज', 75000.00, TRUE, 0),
('service-002', 'demo-client-001', 'Pre-Wedding Shoot', 'प्री-वेडिंग शूट', 'Romantic pre-wedding photoshoot at exotic locations', 'विदेशी स्थानों पर रोमांटिक प्री-वेडिंग फोटोशूट', 35000.00, TRUE, 1),
('service-003', 'demo-client-001', 'Portrait Photography', 'पोर्ट्रेट फोटोग्राफी', 'Professional portrait sessions for individuals and families', 'व्यक्तियों और परिवारों के लिए पेशेवर पोर्ट्रेट सत्र', 15000.00, TRUE, 2);

-- Insert Sample Packages
INSERT INTO packages (package_id, client_id, name, base_price, description, included_services, default_discount, is_active) VALUES
('pkg-001', 'demo-client-001', 'Basic Wedding Package', 50000.00, '4 hours coverage, 200 edited photos, Online gallery', '["Photography", "Basic Editing", "Digital Delivery"]', 0, TRUE),
('pkg-002', 'demo-client-001', 'Premium Wedding Package', 100000.00, 'Full day coverage, 500 edited photos, Album included', '["Photography", "Videography", "Drone", "Premium Editing", "Photo Album", "Digital Delivery"]', 5, TRUE);

-- Insert Sample Leads
INSERT INTO leads (lead_id, client_id, name, phone, email, event_date, event_type, source, status, notes) VALUES
('lead-001', 'demo-client-001', 'Rahul Sharma', '+91 9876543210', 'rahul@example.com', '2025-03-15', 'Wedding', 'website', 'new', 'Interested in premium package'),
('lead-002', 'demo-client-001', 'Priya Patel', '+91 8765432109', 'priya@example.com', '2025-04-20', 'Pre-Wedding', 'instagram', 'contacted', 'Wants outdoor location shoot');

COMMIT;

-- ============================================
-- END OF SCHEMA
-- ============================================
