# FrameBook Pro - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Super Admin APIs](#super-admin-apis)
4. [Admin APIs](#admin-apis)
5. [Public APIs](#public-apis)
6. [File Upload APIs](#file-upload-apis)
7. [Error Codes](#error-codes)

---

## Overview

**Base URL:** `https://yourdomain.com/api`

All API endpoints are prefixed with `/api`. The API uses JSON for request and response bodies.

### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>  # Required for protected endpoints
```

---

## Authentication

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "admin",
  "client_id": "uuid-string",
  "full_name": "John Doe"
}
```

**Response (200):**
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "role": "admin",
  "client_id": "uuid-string",
  "full_name": "John Doe",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### POST /api/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "uuid-string",
    "email": "user@example.com",
    "role": "admin",
    "client_id": "uuid-string",
    "full_name": "John Doe"
  }
}
```

---

### GET /api/auth/me
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "role": "admin",
  "client_id": "uuid-string",
  "full_name": "John Doe",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

## Super Admin APIs

All super admin endpoints require `role: super_admin` in the JWT token.

### POST /api/super-admin/clients
Create a new client.

**Request Body:**
```json
{
  "business_name": "ABC Photography",
  "email": "abc@example.com",
  "phone": "+1234567890",
  "domain": "abc-photo",
  "subscription_plan": "basic",
  "enabled_languages": ["en", "hi"],
  "theme": "light",
  "enabled_modules": ["about", "services", "gallery", "booking", "products"],
  "primary_color": "#1e40af",
  "logo_url": "/api/uploads/logos/logo_123.png",
  "admin_password": "initialpassword",
  "max_gallery_images": 50,
  "max_products": 100
}
```

**Response (200):**
```json
{
  "client_id": "uuid-string",
  "business_name": "ABC Photography",
  "email": "abc@example.com",
  "phone": "+1234567890",
  "domain": "abc-photo",
  "subscription_plan": "basic",
  "enabled_languages": ["en", "hi"],
  "theme": "light",
  "enabled_modules": ["about", "services", "gallery", "booking", "products"],
  "primary_color": "#1e40af",
  "logo_url": "/api/uploads/logos/logo_123.png",
  "max_gallery_images": 50,
  "max_products": 100,
  "status": "active",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### GET /api/super-admin/clients
Get all clients.

**Response (200):**
```json
[
  {
    "client_id": "uuid-string",
    "business_name": "ABC Photography",
    "email": "abc@example.com",
    ...
  }
]
```

---

### GET /api/super-admin/clients/{client_id}
Get specific client.

---

### PUT /api/super-admin/clients/{client_id}
Update client.

**Request Body:**
```json
{
  "business_name": "Updated Name",
  "enabled_modules": ["about", "services"],
  "max_products": 200
}
```

---

### DELETE /api/super-admin/clients/{client_id}
Delete client and all associated data.

---

## Admin APIs

Admin endpoints require `role: admin` or `role: super_admin`.

### Content Management

#### GET /api/admin/content
Get admin's page content.

#### PUT /api/admin/content
Update page content.

### Site Content Editor

#### GET /api/admin/site-content
Get enhanced site content.

**Response (200):**
```json
{
  "content_id": "uuid-string",
  "client_id": "uuid-string",
  "hero": {
    "background_image": "/api/uploads/...",
    "headline": {"en": "Welcome", "hi": "स्वागत"},
    "sub_headline": {"en": "Your tagline"},
    "cta_text": {"en": "Book Now"},
    "cta_link": "/booking"
  },
  "about": {
    "title": {"en": "About Us"},
    "description": {"en": "Our story..."},
    "image_url": "/api/uploads/...",
    "stats": [{"label": "Years", "value": "10+"}]
  },
  "services_section": {...},
  "gallery_section": {...},
  "products_section": {...},
  "booking_section": {...},
  "contact": {...},
  "footer": {...}
}
```

#### PUT /api/admin/site-content
Update site content.

---

### Services

#### POST /api/admin/services
Create service.

**Request Body:**
```json
{
  "name": {"en": "Wedding Photography", "hi": "शादी की फोटोग्राफी"},
  "description": {"en": "Professional wedding coverage"},
  "price": 50000,
  "image_url": "/api/uploads/services/...",
  "is_active": true
}
```

#### GET /api/admin/services
Get all services.

#### PUT /api/admin/services/{service_id}
Update service.

#### DELETE /api/admin/services/{service_id}
Delete service.

---

### Gallery

#### POST /api/admin/gallery
Add gallery image.

**Request Body:**
```json
{
  "image_url": "/api/uploads/gallery/...",
  "title": "Wedding Shot",
  "description": "Beautiful moment",
  "category": "Wedding",
  "is_featured": true
}
```

**Response (400) - Limit Reached:**
```json
{
  "detail": "Gallery image limit reached (50). Please remove existing images to upload new ones."
}
```

#### GET /api/admin/gallery
Get gallery with limits.

**Response (200):**
```json
{
  "images": [...],
  "count": 25,
  "limit": 50
}
```

#### DELETE /api/admin/gallery/{image_id}
Delete gallery image.

---

### Products

#### POST /api/admin/products
Create product.

**Request Body:**
```json
{
  "name": {"en": "Photo Album", "hi": "फोटो एल्बम"},
  "description": {"en": "Premium album"},
  "images": ["/api/uploads/products/..."],
  "base_price": 5000,
  "discount_percentage": 10,
  "category": "Albums",
  "is_active": true
}
```

**Response (400) - Limit Reached:**
```json
{
  "detail": "Product limit reached (100). Please upgrade your plan or remove existing products."
}
```

#### GET /api/admin/products
Get products with limits.

**Response (200):**
```json
{
  "products": [...],
  "count": 45,
  "limit": 100
}
```

#### PUT /api/admin/products/{product_id}
Update product.

#### DELETE /api/admin/products/{product_id}
Delete product.

---

### Product Categories

#### POST /api/admin/product-categories
Create category.

#### GET /api/admin/product-categories
Get categories.

#### PUT /api/admin/product-categories/{category_id}
Update category.

#### DELETE /api/admin/product-categories/{category_id}
Delete category.

---

### Leads

#### POST /api/admin/leads
Create lead.

**Request Body:**
```json
{
  "name": "Customer Name",
  "phone": "+1234567890",
  "email": "customer@example.com",
  "event_date": "2025-06-15",
  "event_type": "Wedding",
  "source": "website",
  "notes": "Initial inquiry"
}
```

#### GET /api/admin/leads
Get leads. Query param: `?status=new`

#### PUT /api/admin/leads/{lead_id}
Update lead.

#### DELETE /api/admin/leads/{lead_id}
Delete lead.

#### POST /api/admin/leads/{lead_id}/notes
Add note to lead.

#### GET /api/admin/leads/{lead_id}/notes
Get lead notes.

---

### Packages

#### POST /api/admin/packages
Create package.

**Request Body:**
```json
{
  "name": "Basic Package",
  "base_price": 25000,
  "description": "Includes 2 hours coverage",
  "included_services": ["Photography", "Editing"],
  "default_discount": 5
}
```

#### GET /api/admin/packages
Get packages.

#### PUT /api/admin/packages/{package_id}
Update package.

#### DELETE /api/admin/packages/{package_id}
Delete package.

---

### Add-ons

#### POST /api/admin/addons
Create add-on.

#### GET /api/admin/addons
Get add-ons.

#### PUT /api/admin/addons/{addon_id}
Update add-on.

#### DELETE /api/admin/addons/{addon_id}
Delete add-on.

---

### Quotations

#### POST /api/admin/quotations
Create quotation.

**Request Body:**
```json
{
  "lead_id": "uuid-string",
  "items": [
    {
      "item_type": "package",
      "item_id": "uuid-string",
      "name": "Wedding Package",
      "price": 50000,
      "quantity": 1
    }
  ],
  "discount_percentage": 10,
  "discount_amount": 0,
  "tax_percentage": 18,
  "notes": "Valid for 7 days"
}
```

#### GET /api/admin/quotations
Get quotations.

#### GET /api/admin/quotations/{quotation_id}
Get specific quotation.

#### PUT /api/admin/quotations/{quotation_id}
Update quotation.

#### PUT /api/admin/quotations/{quotation_id}/status
Update quotation status.

**Request Body:**
```json
{
  "status": "sent"  // draft, sent, accepted, rejected
}
```

#### DELETE /api/admin/quotations/{quotation_id}
Delete quotation.

#### GET /api/admin/quotations/{quotation_id}/pdf-data
Get quotation data for PDF generation.

---

### Invoices

#### POST /api/admin/invoices
Create direct invoice.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_phone": "+1234567890",
  "customer_email": "john@example.com",
  "items": [...],
  "discount_percentage": 5,
  "tax_percentage": 18,
  "event_date": "2025-06-15"
}
```

#### POST /api/admin/invoices/from-quotation/{quotation_id}
Create invoice from accepted quotation.

#### GET /api/admin/invoices
Get invoices.

#### GET /api/admin/invoices/{invoice_id}
Get specific invoice.

#### PUT /api/admin/invoices/{invoice_id}
Update invoice.

#### POST /api/admin/invoices/{invoice_id}/payments
Add payment to invoice.

**Request Body:**
```json
{
  "amount": 10000,
  "payment_date": "2025-01-15",
  "payment_method": "UPI",
  "notes": "Advance payment"
}
```

#### DELETE /api/admin/invoices/{invoice_id}
Delete invoice.

---

### Events

#### POST /api/admin/events
Create event.

#### GET /api/admin/events
Get events.

#### GET /api/admin/events/{event_id}
Get specific event.

#### PUT /api/admin/events/{event_id}
Update event.

#### DELETE /api/admin/events/{event_id}
Delete event.

---

### Expenses

#### POST /api/admin/expenses
Create expense.

**Request Body:**
```json
{
  "event_id": "uuid-string",
  "category": "travel",
  "amount": 2000,
  "description": "Cab fare",
  "expense_date": "2025-01-15"
}
```

#### GET /api/admin/expenses
Get expenses. Query: `?event_id=uuid-string`

#### PUT /api/admin/expenses/{expense_id}
Update expense.

#### DELETE /api/admin/expenses/{expense_id}
Delete expense.

---

### Offers

#### POST /api/admin/offers
Create offer.

#### GET /api/admin/offers
Get offers.

#### PUT /api/admin/offers/{offer_id}
Update offer.

#### DELETE /api/admin/offers/{offer_id}
Delete offer.

---

### Bookings

#### GET /api/admin/bookings
Get bookings.

#### PUT /api/admin/bookings/{booking_id}
Update booking.

---

### Blocked Dates

#### POST /api/admin/blocked-dates
Block a date.

#### GET /api/admin/blocked-dates
Get blocked dates.

#### DELETE /api/admin/blocked-dates/{blocked_id}
Unblock date.

---

### Notifications

#### GET /api/admin/notifications
Get notifications.

**Query Parameters:**
- `limit`: Number of notifications (default: 20)
- `unread_only`: true/false

**Response (200):**
```json
{
  "notifications": [
    {
      "notification_id": "uuid-string",
      "client_id": "uuid-string",
      "title": "New Booking",
      "message": "John booked for June 15",
      "notification_type": "booking",
      "link": "/admin/bookings",
      "is_read": false,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "unread_count": 5
}
```

#### POST /api/admin/notifications
Create notification.

#### PUT /api/admin/notifications/{notification_id}/read
Mark as read.

#### PUT /api/admin/notifications/mark-all-read
Mark all as read.

#### DELETE /api/admin/notifications/{notification_id}
Delete notification.

---

### Dashboard & Reports

#### GET /api/admin/dashboard/stats
Get dashboard statistics.

**Response (200):**
```json
{
  "total_revenue_month": 150000,
  "events_this_month": 12,
  "pending_payments": 45000,
  "upcoming_events": [...],
  "new_leads_count": 8
}
```

#### GET /api/admin/calendar
Get calendar data.

**Query Parameters:**
- `month`: YYYY-MM format

#### GET /api/admin/reports/revenue
Get revenue report.

#### GET /api/admin/reports/events
Get events report.

---

## Public APIs

Public endpoints don't require authentication.

### GET /api/public/site/{client_id}
Get complete site data.

**Response (200):**
```json
{
  "client": {...},
  "site_content": {...},
  "services": [...],
  "gallery": [...],
  "products": [...],
  "product_categories": [...],
  "offers": [...],
  "packages": [...],
  "addons": [...]
}
```

---

### GET /api/public/site-by-domain
Get site by domain.

**Query Parameters:**
- `domain`: Client domain identifier

---

### GET /api/public/clients/{client_id}
Get public client info.

---

### GET /api/public/content/{client_id}
Get public page content.

---

### GET /api/public/services/{client_id}
Get active services.

---

### GET /api/public/gallery/{client_id}
Get gallery images.

---

### GET /api/public/products/{client_id}
Get products.

**Query Parameters:**
- `category`: Filter by category
- `sort`: `price_asc` | `price_desc`
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter

---

### GET /api/public/products/{client_id}/{product_id}
Get product detail.

---

### GET /api/public/offers/{client_id}
Get active offers.

---

### POST /api/public/bookings
Create public booking.

**Request Body:**
```json
{
  "client_id": "uuid-string",
  "name": "Customer Name",
  "phone": "+1234567890",
  "email": "customer@example.com",
  "event_type": "Wedding",
  "event_date": "2025-06-15",
  "event_time": "10:00",
  "location": "City",
  "message": "Additional notes"
}
```

---

### GET /api/public/blocked-dates/{client_id}
Get blocked dates.

---

## File Upload APIs

### POST /api/upload
Upload single file.

**Headers:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`
- `file`: Image file
- `category`: `gallery` | `products` | `services` | `logos` | `general`

**Response (200):**
```json
{
  "success": true,
  "filename": "products_20250101_abc123.jpg",
  "url": "/api/uploads/products/products_20250101_abc123.jpg",
  "size": 125000,
  "category": "products"
}
```

---

### POST /api/upload/multiple
Upload multiple files.

**Response (200):**
```json
{
  "success": true,
  "uploaded": [
    {
      "original_name": "photo1.jpg",
      "filename": "gallery_20250101_abc123.jpg",
      "url": "/api/uploads/gallery/...",
      "size": 125000
    }
  ],
  "errors": [],
  "total_uploaded": 3,
  "total_errors": 0
}
```

---

### DELETE /api/upload
Delete uploaded file.

**Request Body:**
```json
{
  "file_url": "/api/uploads/gallery/gallery_20250101_abc123.jpg"
}
```

---

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Invalid/expired token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

**Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:
- Auth endpoints: 5 requests/minute
- Public endpoints: 100 requests/minute
- Admin endpoints: 50 requests/minute
