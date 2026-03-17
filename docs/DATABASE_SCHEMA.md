# FrameBook Pro - Database Schema

## Overview

FrameBook Pro uses **MongoDB** (NoSQL document database). Unlike SQL databases with fixed schemas, MongoDB uses flexible document structures.

This document describes the schema/structure for each collection.

---

## Collections

### 1. users

Stores all user accounts.

```javascript
{
  "user_id": "uuid-string",           // Primary identifier
  "email": "user@example.com",        // Unique, login email
  "password": "$2b$12$...",           // Bcrypt hashed password
  "role": "admin",                    // "super_admin" | "admin"
  "client_id": "uuid-string",         // Reference to clients (null for super_admin)
  "full_name": "John Doe",
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "user_id": 1 }                      // Unique
{ "email": 1 }                        // Unique
{ "client_id": 1 }
```

---

### 2. clients

Stores client business information.

```javascript
{
  "client_id": "uuid-string",         // Primary identifier
  "business_name": "ABC Photography",
  "email": "contact@abc.com",
  "phone": "+1234567890",
  "domain": "abc-photo",              // Unique URL identifier
  "subscription_plan": "basic",       // "basic" | "premium" | "enterprise"
  "enabled_languages": ["en", "hi"],
  "theme": "light",                   // "light" | "dark"
  "enabled_modules": [                // Array of enabled features
    "about",
    "services",
    "gallery",
    "booking",
    "products",
    "offers",
    "contact"
  ],
  "primary_color": "#1e40af",         // Hex color code
  "logo_url": "/api/uploads/logos/...",
  "max_gallery_images": 50,           // Resource limit
  "max_products": 100,                // Resource limit
  "status": "active",                 // "active" | "inactive" | "suspended"
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "client_id": 1 }                    // Unique
{ "domain": 1 }                       // Unique
{ "email": 1 }
```

---

### 3. services

Client service offerings.

```javascript
{
  "service_id": "uuid-string",
  "client_id": "uuid-string",         // Reference to clients
  "name": {
    "en": "Wedding Photography",
    "hi": "शादी की फोटोग्राफी",
    "kn": "ಮದುವೆ ಫೋಟೋಗ್ರಫಿ"
  },
  "description": {
    "en": "Professional wedding coverage",
    "hi": "पेशेवर शादी कवरेज"
  },
  "price": 50000,                     // Optional, nullable
  "image_url": "/api/uploads/services/...",
  "is_active": true,
  "display_order": 0,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "service_id": 1 }                   // Unique
{ "client_id": 1 }
{ "client_id": 1, "is_active": 1 }
```

---

### 4. gallery

Gallery image metadata.

```javascript
{
  "image_id": "uuid-string",
  "client_id": "uuid-string",
  "image_url": "/api/uploads/gallery/...",
  "title": "Wedding Shot",            // Optional
  "description": "Beautiful moment",  // Optional
  "category": "Wedding",              // Optional
  "display_order": 0,
  "is_featured": false,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "image_id": 1 }                     // Unique
{ "client_id": 1 }
{ "client_id": 1, "display_order": 1 }
```

---

### 5. products

Product catalog items.

```javascript
{
  "product_id": "uuid-string",
  "client_id": "uuid-string",
  "name": {
    "en": "Photo Album",
    "hi": "फोटो एल्बम"
  },
  "description": {
    "en": "Premium quality album",
    "hi": "प्रीमियम गुणवत्ता एल्बम"
  },
  "images": [                         // Array of image URLs
    "/api/uploads/products/...",
    "/api/uploads/products/..."
  ],
  "base_price": 5000,
  "discount_percentage": 10,
  "final_price": 4500,                // Calculated: base_price * (1 - discount/100)
  "category": "category-id",          // Reference to product_categories
  "is_active": true,
  "display_order": 0,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "product_id": 1 }                   // Unique
{ "client_id": 1 }
{ "client_id": 1, "is_active": 1 }
{ "client_id": 1, "category": 1 }
```

---

### 6. product_categories

Product categories.

```javascript
{
  "category_id": "uuid-string",
  "client_id": "uuid-string",
  "name": {
    "en": "Albums",
    "hi": "एल्बम"
  },
  "display_order": 0,
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "category_id": 1 }                  // Unique
{ "client_id": 1 }
```

---

### 7. leads

Sales lead/CRM data.

```javascript
{
  "lead_id": "uuid-string",
  "client_id": "uuid-string",
  "name": "Customer Name",
  "phone": "+1234567890",
  "email": "customer@example.com",    // Optional
  "event_date": "2025-06-15",         // Optional
  "event_type": "Wedding",            // Optional
  "source": "website",                // "website" | "manual" | "instagram" | "referral" | "other"
  "status": "new",                    // "new" | "contacted" | "follow_up" | "quotation_sent" | "confirmed" | "lost"
  "assigned_package_id": "uuid",      // Optional reference to packages
  "follow_up_date": "2025-01-20",     // Optional
  "notes": "Initial inquiry notes",   // Optional
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "lead_id": 1 }                      // Unique
{ "client_id": 1 }
{ "client_id": 1, "status": 1 }
```

---

### 8. lead_notes

Notes/comments on leads.

```javascript
{
  "note_id": "uuid-string",
  "lead_id": "uuid-string",           // Reference to leads
  "note": "Called customer, will follow up tomorrow",
  "created_by": "user-uuid",          // Reference to users
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "note_id": 1 }                      // Unique
{ "lead_id": 1 }
```

---

### 9. packages

Service packages for pricing.

```javascript
{
  "package_id": "uuid-string",
  "client_id": "uuid-string",
  "name": "Basic Wedding Package",
  "base_price": 50000,
  "description": "4 hours coverage, 200 edited photos",
  "included_services": [              // Array of included items
    "Photography",
    "Basic Editing",
    "Digital Delivery"
  ],
  "default_discount": 5,              // Percentage
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "package_id": 1 }                   // Unique
{ "client_id": 1 }
```

---

### 10. addons

Add-on services.

```javascript
{
  "addon_id": "uuid-string",
  "client_id": "uuid-string",
  "name": "Extra Hour",
  "price": 5000,
  "description": "Additional hour of coverage",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "addon_id": 1 }                     // Unique
{ "client_id": 1 }
```

---

### 11. quotations

Price quotations for leads.

```javascript
{
  "quotation_id": "uuid-string",
  "quotation_number": "QT-0001",      // Auto-generated
  "client_id": "uuid-string",
  "lead_id": "uuid-string",           // Reference to leads
  "items": [
    {
      "item_type": "package",         // "package" | "addon" | "custom"
      "item_id": "uuid-string",       // Reference to packages/addons (null for custom)
      "name": "Wedding Package",
      "price": 50000,
      "quantity": 1
    }
  ],
  "subtotal": 55000,
  "discount_percentage": 10,
  "discount_amount": 5500,
  "tax_percentage": 18,
  "tax_amount": 8910,
  "total_amount": 58410,
  "notes": "Valid for 7 days",        // Optional
  "status": "draft",                  // "draft" | "sent" | "accepted" | "rejected"
  "created_at": "2025-01-01T00:00:00Z",
  "sent_at": null,                    // Timestamp when sent
  "accepted_at": null                 // Timestamp when accepted
}

// Indexes
{ "quotation_id": 1 }                 // Unique
{ "client_id": 1 }
{ "lead_id": 1 }
```

---

### 12. invoices

Invoices for confirmed bookings.

```javascript
{
  "invoice_id": "uuid-string",
  "invoice_number": "INV-0001",       // Auto-generated
  "client_id": "uuid-string",
  "quotation_id": "uuid-string",      // Reference to quotations (optional)
  "lead_id": "uuid-string",           // Reference to leads
  "issue_date": "2025-01-15",
  "event_date": "2025-06-15",         // Optional
  "items": [                          // Same structure as quotations
    {
      "item_type": "package",
      "item_id": "uuid-string",
      "name": "Wedding Package",
      "price": 50000,
      "quantity": 1
    }
  ],
  "subtotal": 55000,
  "discount_amount": 5500,
  "tax_amount": 8910,
  "total_amount": 58410,
  "paid_amount": 20000,
  "balance_due": 38410,
  "status": "partially_paid",         // "unpaid" | "partially_paid" | "paid"
  "payments": [
    {
      "payment_id": "uuid-string",
      "amount": 20000,
      "payment_date": "2025-01-15",
      "payment_method": "UPI",
      "notes": "Advance payment",
      "created_at": "2025-01-15T00:00:00Z"
    }
  ],
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "invoice_id": 1 }                   // Unique
{ "client_id": 1 }
{ "lead_id": 1 }
{ "client_id": 1, "status": 1 }
```

---

### 13. events

Confirmed events/bookings.

```javascript
{
  "event_id": "uuid-string",
  "client_id": "uuid-string",
  "lead_id": "uuid-string",           // Reference to leads (optional)
  "booking_id": "uuid-string",        // Reference to bookings (optional)
  "invoice_id": "uuid-string",        // Reference to invoices (optional)
  "name": "John & Jane Wedding",
  "event_type": "Wedding",
  "event_date": "2025-06-15",
  "event_time": "10:00",              // Optional
  "location": "Grand Hotel, City",    // Optional
  "status": "confirmed",              // "inquiry" | "confirmed" | "completed" | "cancelled"
  "revenue": 58410,
  "total_expenses": 5000,
  "profit": 53410,                    // Calculated: revenue - expenses
  "notes": "VIP client",              // Optional
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "event_id": 1 }                     // Unique
{ "client_id": 1 }
{ "client_id": 1, "event_date": 1 }
{ "client_id": 1, "status": 1 }
```

---

### 14. expenses

Event-related expenses.

```javascript
{
  "expense_id": "uuid-string",
  "client_id": "uuid-string",
  "event_id": "uuid-string",          // Reference to events
  "category": "travel",               // "travel" | "equipment" | "assistant" | "other"
  "amount": 2000,
  "description": "Cab to venue",      // Optional
  "expense_date": "2025-06-15",
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "expense_id": 1 }                   // Unique
{ "client_id": 1 }
{ "event_id": 1 }
```

---

### 15. bookings

Public website booking requests.

```javascript
{
  "booking_id": "uuid-string",
  "client_id": "uuid-string",
  "name": "Customer Name",
  "phone": "+1234567890",
  "email": "customer@example.com",    // Optional
  "event_type": "Wedding",
  "event_date": "2025-06-15",
  "event_time": "10:00",              // Optional
  "location": "City",                 // Optional
  "message": "Looking for photographer", // Optional
  "status": "pending",                // "pending" | "confirmed" | "completed" | "cancelled"
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "booking_id": 1 }                   // Unique
{ "client_id": 1 }
{ "client_id": 1, "event_date": 1 }
```

---

### 16. notifications

In-app notifications.

```javascript
{
  "notification_id": "uuid-string",
  "client_id": "uuid-string",
  "user_id": "uuid-string",           // Optional, for user-specific notifications
  "title": "New Booking Received",
  "message": "John Doe booked for June 15",
  "notification_type": "booking",     // "info" | "success" | "warning" | "booking" | "lead" | "payment" | "system"
  "link": "/admin/bookings",          // Optional, navigation link
  "metadata": {},                     // Optional, additional data
  "is_read": false,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "notification_id": 1 }              // Unique
{ "client_id": 1 }
{ "client_id": 1, "is_read": 1 }
```

---

### 17. site_content

Enhanced website content structure.

```javascript
{
  "content_id": "uuid-string",
  "client_id": "uuid-string",         // Unique per client
  "hero": {
    "background_image": "/api/uploads/...",
    "logo_url": "/api/uploads/...",
    "headline": {
      "en": "Welcome to Our Studio",
      "hi": "हमारे स्टूडियो में आपका स्वागत है"
    },
    "sub_headline": { "en": "...", "hi": "..." },
    "cta_text": { "en": "Book Now", "hi": "अभी बुक करें" },
    "cta_link": "/booking"
  },
  "about": {
    "title": { "en": "About Us", "hi": "हमारे बारे में" },
    "description": { "en": "...", "hi": "..." },
    "image_url": "/api/uploads/...",
    "stats": [
      { "label": "Years", "value": "10+" },
      { "label": "Clients", "value": "500+" }
    ]
  },
  "services_section": {
    "title": { "en": "Our Services" },
    "subtitle": { "en": "What we offer" }
  },
  "gallery_section": {
    "title": { "en": "Our Gallery" },
    "subtitle": { "en": "See our work" }
  },
  "products_section": {
    "title": { "en": "Our Products" },
    "subtitle": { "en": "Explore our catalog" }
  },
  "booking_section": {
    "title": { "en": "Book Appointment" },
    "subtitle": { "en": "Schedule your session" }
  },
  "contact": {
    "title": { "en": "Contact Us" },
    "subtitle": { "en": "Get in touch" },
    "address": { "en": "123 Street, City" },
    "map_embed_url": "https://maps.google.com/..."
  },
  "footer": {
    "copyright_text": { "en": "© 2025 Business Name" },
    "social_links": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/..."
    }
  },
  "updated_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "content_id": 1 }                   // Unique
{ "client_id": 1 }                    // Unique
```

---

### 18. blocked_dates

Dates blocked for bookings.

```javascript
{
  "blocked_id": "uuid-string",
  "client_id": "uuid-string",
  "date": "2025-06-20",               // ISO date string
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "blocked_id": 1 }                   // Unique
{ "client_id": 1, "date": 1 }         // Unique compound
```

---

### 19. offers

Promotional offers.

```javascript
{
  "offer_id": "uuid-string",
  "client_id": "uuid-string",
  "title": { "en": "Summer Special", "hi": "गर्मी विशेष" },
  "description": { "en": "Get 20% off", "hi": "20% छूट पाएं" },
  "discount_percentage": 20,          // Optional
  "flat_discount": null,              // Optional (use one or the other)
  "start_date": "2025-05-01",
  "end_date": "2025-05-31",
  "banner_image": "/api/uploads/...", // Optional
  "status": "active",                 // "active" | "inactive"
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}

// Indexes
{ "offer_id": 1 }                     // Unique
{ "client_id": 1 }
{ "client_id": 1, "status": 1 }
```

---

## Database Initialization Script

To initialize the database with a super admin user, run:

```javascript
// Connect to MongoDB
// mongosh

use framebook_pro_db

// Create super admin user
// First, generate password hash using Python:
// python3 -c "import bcrypt; print(bcrypt.hashpw(b'your_password', bcrypt.gensalt()).decode())"

db.users.insertOne({
  "user_id": "00000000-0000-0000-0000-000000000001",
  "email": "admin@yourdomain.com",
  "password": "$2b$12$YOUR_HASHED_PASSWORD_HERE",
  "role": "super_admin",
  "client_id": null,
  "full_name": "Platform Administrator",
  "created_at": new Date().toISOString()
})

// Create indexes
db.users.createIndex({ "user_id": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.clients.createIndex({ "client_id": 1 }, { unique: true })
db.clients.createIndex({ "domain": 1 }, { unique: true })

print("Database initialized successfully!")
```

---

## Backup & Restore

### Backup
```bash
mongodump --db framebook_pro_db --out /backup/$(date +%Y%m%d)
```

### Restore
```bash
mongorestore --db framebook_pro_db /backup/20250101/framebook_pro_db
```

### Export Single Collection
```bash
mongoexport --db framebook_pro_db --collection users --out users.json
```

### Import Single Collection
```bash
mongoimport --db framebook_pro_db --collection users --file users.json
```
