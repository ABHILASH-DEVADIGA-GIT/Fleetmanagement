# FrameBook Pro - Project Structure Documentation

## Overview

FrameBook Pro is a full-stack multi-tenant SaaS application built with:
- **Backend:** Python FastAPI with MongoDB
- **Frontend:** React with Tailwind CSS

---

## Directory Structure

```
framebook-pro/
├── backend/                    # FastAPI backend
│   ├── server.py              # Main application file (monolithic)
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment configuration
│   └── uploads/               # File upload storage
│       ├── gallery/           # Gallery images
│       ├── logos/             # Client logos
│       ├── products/          # Product images
│       └── services/          # Service images
│
├── frontend/                   # React frontend
│   ├── public/                # Static public files
│   │   ├── index.html         # HTML template
│   │   └── favicon.ico        # Site favicon
│   │
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   │   ├── admin/         # Admin dashboard components
│   │   │   ├── public/        # Public website components
│   │   │   ├── shared/        # Shared/reusable components
│   │   │   ├── superadmin/    # Super admin components
│   │   │   └── ui/            # Shadcn UI components
│   │   │
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Helper utilities
│   │   │
│   │   ├── App.js             # Main App component
│   │   ├── App.css            # Global styles
│   │   ├── index.js           # Entry point
│   │   └── index.css          # Tailwind imports
│   │
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── .env                   # Environment configuration
│
└── docs/                       # Documentation
    ├── DEPLOYMENT_GUIDE.md
    ├── API_DOCUMENTATION.md
    ├── USER_MANUAL.md
    └── PROJECT_STRUCTURE.md
```

---

## Backend Structure

### server.py Organization

The backend is currently a monolithic file organized into sections:

```python
# ============= Imports & Configuration =============
# Lines 1-50: Imports, environment setup, MongoDB connection

# ============= Models (Pydantic) =============
# Lines 52-550: All data models

# ============= Helper Functions =============
# Lines 555-620: Authentication, password hashing, JWT, email

# ============= Auth Routes =============
# Lines 622-660: /auth/register, /auth/login, /auth/me

# ============= Super Admin Routes =============
# Lines 662-825: Client CRUD, content override

# ============= Admin Routes =============
# Lines 827-2050: All admin functionality

# ============= Public Routes =============
# Lines 2053-2150: Public website APIs

# ============= Notification System =============
# Lines 2153-2292: Notification CRUD

# ============= File Upload System =============
# Lines 2294-2442: Upload/delete files

# ============= App Configuration =============
# Lines 2443-2461: Router, CORS, logging
```

### Key Models

| Model | Purpose |
|-------|---------|
| User | User accounts |
| Client | Client businesses |
| Service | Client services |
| GalleryImage | Portfolio images |
| Product | Product catalog |
| ProductCategory | Product categories |
| Lead | Sales leads |
| Package | Service packages |
| AddOn | Package add-ons |
| Quotation | Price quotes |
| Invoice | Bills/invoices |
| Event | Confirmed events |
| Expense | Event expenses |
| Booking | Public bookings |
| Notification | In-app notifications |
| SiteContent | Website content |
| BlockedDate | Unavailable dates |

### API Route Prefixes

| Prefix | Purpose | Auth Required |
|--------|---------|---------------|
| `/api/auth` | Authentication | No (login/register) |
| `/api/super-admin` | Platform management | Super Admin only |
| `/api/admin` | Client management | Admin or Super Admin |
| `/api/public` | Public website data | No |
| `/api/upload` | File uploads | Yes |
| `/api/uploads` | Serve files | No |

---

## Frontend Structure

### Components Organization

#### `/components/admin/`
Admin dashboard components:

| Component | Purpose |
|-----------|---------|
| AdminOverview.js | Dashboard home |
| LeadManagement.js | Lead CRM |
| PackageManagement.js | Service packages |
| QuotationManagement.js | Quotes |
| InvoiceManagement.js | Invoices |
| ExpenseManagement.js | Expense tracking |
| ServiceManagement.js | Services CRUD |
| GalleryManagement.js | Gallery CRUD |
| ProductManagement.js | Products CRUD |
| BookingManagement.js | Booking requests |
| CalendarView.js | Event calendar |
| ReportsView.js | Analytics |
| SiteContentEditor.js | Content management |
| OfferManagement.js | Promotions |
| NotificationCenter.js | Notifications |

#### `/components/public/`
Public website components:

| Component | Purpose |
|-----------|---------|
| PublicHeader.js | Navigation |
| PublicHome.js | Hero section |
| PublicAbout.js | About section |
| PublicServices.js | Services display |
| PublicGallery.js | Gallery grid |
| PublicProducts.js | Product catalog |
| PublicPricing.js | Pricing/packages |
| PublicBooking.js | Booking form |
| PublicContact.js | Contact section |
| PublicFooter.js | Footer |

#### `/components/shared/`
Reusable components:

| Component | Purpose |
|-----------|---------|
| ImageUpload.js | File upload widget |
| NotificationPanel.js | Notification dropdown |

#### `/components/superadmin/`
Super admin components:

| Component | Purpose |
|-----------|---------|
| DashboardOverview.js | Platform stats |
| ClientManagement.js | Client CRUD |
| UserManagement.js | User management |
| ContentOverride.js | Override client content |

#### `/components/ui/`
Shadcn UI components (pre-built):
- button, input, card, dialog, select, etc.
- Used throughout for consistent styling

### Context Providers

| Context | Purpose |
|---------|---------|
| AuthContext.js | Authentication state |
| ThemeContext.js | Theme (light/dark) |
| LanguageContext.js | Multi-language |
| NotificationContext.js | Notification state |

### Utility Files

| File | Purpose |
|------|---------|
| utils/api.js | Axios configuration |
| utils/imageUrl.js | Image URL resolver |
| utils/pdfGenerator.js | PDF generation |

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login.js | /login | Authentication |
| AdminDashboard.js | /admin/* | Admin panel |
| SuperAdminDashboard.js | /super-admin/* | Platform admin |
| PublicWebsite.js | /:clientDomain/* | Public site |

---

## Upload Storage

All uploaded files are stored in the backend:

```
backend/uploads/
├── gallery/          # Gallery images
│   └── gallery_20250101_abc123.jpg
├── logos/            # Client logos
│   └── logos_20250101_def456.png
├── products/         # Product images
│   └── products_20250101_ghi789.jpg
└── services/         # Service images
    └── services_20250101_jkl012.png
```

### Filename Format
```
{category}_{YYYYMMDD}_{timestamp}_{random8char}.{extension}
```

### Serving Files
Files are served via `/api/uploads/{category}/{filename}`

---

## Configuration Files

### Backend

| File | Purpose |
|------|---------|
| .env | Environment variables |
| requirements.txt | Python dependencies |

### Frontend

| File | Purpose |
|------|---------|
| .env | Environment variables |
| package.json | Node dependencies |
| tailwind.config.js | Tailwind CSS config |
| craco.config.js | Create React App config |
| postcss.config.js | PostCSS config |
| jsconfig.json | JavaScript config |
| components.json | Shadcn UI config |

---

## Database Collections

MongoDB collections created by the application:

| Collection | Purpose |
|------------|---------|
| users | User accounts |
| clients | Client businesses |
| services | Client services |
| gallery | Gallery images metadata |
| products | Product catalog |
| product_categories | Product categories |
| leads | Sales leads |
| lead_notes | Lead conversation notes |
| packages | Service packages |
| addons | Package add-ons |
| quotations | Price quotations |
| invoices | Invoices |
| events | Confirmed events |
| expenses | Event expenses |
| bookings | Public bookings |
| notifications | In-app notifications |
| site_content | Website content |
| page_content | Legacy page content |
| blocked_dates | Unavailable dates |
| offers | Promotional offers |

---

## Key Technical Decisions

### Multi-Tenancy
- Each client identified by `client_id`
- All data scoped to `client_id`
- URL routing by domain identifier

### Authentication
- JWT-based authentication
- Tokens expire after 24 hours
- Role-based access control (RBAC)

### File Uploads
- Stored locally in `uploads/` directory
- Served via `/api/uploads/` endpoint
- Max file size: 10MB
- Allowed types: JPG, PNG, GIF, WebP, SVG

### Multi-Language
- Content stored with `{en, hi, kn}` structure
- Frontend language context for switching
- Default fallback to English

### Resource Limits
- `max_gallery_images` per client
- `max_products` per client
- Enforced at API level

---

## Future Refactoring Recommendations

The current `server.py` is monolithic (2400+ lines). Recommended structure:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration
│   ├── database.py          # MongoDB connection
│   │
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── client.py
│   │   ├── lead.py
│   │   └── ...
│   │
│   ├── routes/              # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── super_admin.py
│   │   ├── public.py
│   │   └── uploads.py
│   │
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── email_service.py
│   │   └── notification_service.py
│   │
│   └── utils/               # Utilities
│       ├── __init__.py
│       ├── security.py
│       └── helpers.py
│
├── uploads/
├── requirements.txt
└── .env
```
