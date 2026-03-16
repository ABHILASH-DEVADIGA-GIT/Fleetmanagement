# FrameBook Pro - Multi-Tenant SaaS Platform

## Product Overview
FrameBook Pro is a comprehensive SaaS platform for service businesses (photographers, makeup artists, event managers, convention centers, tourist bus operators) with multi-client architecture and dynamic website generation.

## Core Features

### Phase 1: Business Management Suite (COMPLETED)
- **Dashboard** - Overview with key metrics
- **Calendar Module** - Event scheduling, walk-in appointments, time blocking
- **Lead Management** - CRM with status tracking (New, Contacted, Follow Up, Quotation Sent, Confirmed, Lost)
- **Package Management** - Service packages with pricing
- **Add-on Services** - Additional services
- **Quotation Builder** - Full CRUD, PDF download with admin & customer details
- **Invoice & Billing** - Create directly or from quotations, payment tracking, PDF download
- **Expense Tracking** - Track business expenses
- **Reports** - Revenue, lead conversion, event profitability

### Phase 2: Feature Module Control System (COMPLETED)
- **Super Admin Dashboard** - Platform owner management
- **Client Management** - Create/edit clients with:
  - Business details (name, email, phone, domain)
  - Auto-created admin account
  - Theme and branding (primary color, logo)
  - Language support (EN, KN, HI)
  - **Module Enable/Disable**: About, Services, Gallery, Booking, Products, Offers, Contact
- **Automatic Setup** - When Super Admin creates client:
  - Client record created
  - Admin user auto-created
  - Default site content generated
  - Website goes live immediately

### Phase 3: Product Catalog Module (COMPLETED)
- **Admin Product Management**:
  - Multi-language product names and descriptions (EN, KN, HI)
  - Multiple product images via URLs
  - Base price with discount percentage
  - Auto-calculated final price
  - Product categories
  - Active/Inactive status
- **Public Products Page** (Flipkart/Amazon Style):
  - Grid display of products
  - Category filter
  - Price sorting (Low to High, High to Low)
  - Search functionality
  - Product detail modal with images, description, price, contact buttons

### Phase 4: Gallery Management (COMPLETED)
- **Admin Gallery Management**:
  - Add images via URL
  - Title, description, category
  - Featured image toggle
- **Public Gallery Page**:
  - Grid display with hover effects
  - Category filter
  - Lightbox with navigation

### Phase 5: Public Website Enhancement (COMPLETED)
- **Site Content Editor** - All sections editable from admin:
  - Hero Section (headline, sub-headline, CTA, background image, logo)
  - About Section (title, description, image)
  - Services Section (title, subtitle)
  - Gallery Section (title, subtitle)
  - Products Section (title, subtitle)
  - Booking Section (title, subtitle)
  - Contact Section (title, subtitle, address, Google Maps embed)
  - Footer (copyright text, social media links)
- **Multi-language Support** - All content in EN, KN, HI
- **Dynamic Navigation** - Shows only enabled modules
- **Theme Control** - Light/Dark theme toggle
- **Language Switcher** - In header
- **Professional UI Design** - Compact hero, proper image sizing, clean layouts

## Technical Architecture

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt via passlib

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI
- **State**: React Context API
- **HTTP Client**: Axios

### Multi-Tenancy
- All data segregated by `client_id`
- Domain-based client lookup supported
- Enabled modules control per client

## Database Collections
- `users` - User accounts with roles (super_admin, admin)
- `clients` - Client businesses with enabled_modules
- `services` - Services offered by clients
- `packages` - Service packages
- `addons` - Add-on services
- `leads` - Customer leads
- `quotations` - Quotations with items
- `invoices` - Invoices with payments
- `expenses` - Business expenses
- `events` - Calendar events
- `walkin_appointments` - Blocked time periods
- `products` - Product catalog
- `product_categories` - Product categories
- `gallery` - Gallery images
- `site_content` - Website content sections
- `page_content` - Legacy content (backward compatibility)
- `offers` - Special offers
- `bookings` - Appointment bookings

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user

### Super Admin
- `GET/POST /api/super-admin/clients` - Client management
- `GET/PUT/DELETE /api/super-admin/clients/{client_id}` - Single client

### Admin - Business
- `GET /api/admin/dashboard-summary` - Dashboard metrics
- CRUD for: packages, addons, leads, quotations, invoices, expenses, events
- `POST /api/admin/walkin-appointments` - Block time
- Reports: revenue, pending payments, lead conversion, event profit

### Admin - Website
- `GET/POST /api/admin/products` - Product catalog
- `GET/POST /api/admin/product-categories` - Categories
- `GET/POST /api/admin/gallery` - Gallery images
- `GET/PUT /api/admin/site-content` - Site content sections

### Public
- `GET /api/public/site/{client_id}` - All public data
- `GET /api/public/products/{client_id}` - Products with filters
- `GET /api/public/site-by-domain` - Domain-based lookup

## Credentials
- **Super Admin**: admin@lumina.com / admin123
- **Demo Admin**: photographer@demo.com / photographer123
- **Demo Client ID**: f0afd9ff-fb85-45e6-9f9e-8027f5fcfbca

## Recent Changes (December 2025)
- Implemented Feature Module Control System
- Added Product Catalog with multi-language support
- Added Gallery Management with lightbox
- Enhanced Site Content Editor for all sections
- Updated public navigation to show only enabled modules
- **Fixed public website UI** - Compact hero section, proper image sizing, professional design
- Added demo services and gallery images
- Improved Services, About, Gallery pages with modern design

## Testing URLs
- **Login**: https://offer-dashboard-1.preview.emergentagent.com/login
- **Public Site**: https://offer-dashboard-1.preview.emergentagent.com/site/f0afd9ff-fb85-45e6-9f9e-8027f5fcfbca

## Next Steps / Backlog
1. **P1**: Email notifications (Resend integration pending)
2. **P2**: In-app notification system
3. **P2**: File upload for images (currently URL-based)
4. **P3**: Domain verification system
