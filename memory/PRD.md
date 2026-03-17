# FrameBook Pro - Product Requirements Document

## Project Overview
A comprehensive multi-tenant SaaS platform for service-based businesses like photographers, event managers, and creative professionals.

## Original Problem Statement
Build a multi-tenant platform where:
- Each client has a unique public website and admin panel
- Super Admin can manage clients, enable/disable modules, set resource limits
- File uploads stored locally (not URL-based)
- In-app notification system
- Product catalog module (display-only, no cart)

## Tech Stack
- **Frontend:** React 19, Tailwind CSS, Shadcn UI, React Router
- **Backend:** Python FastAPI, Motor (async MongoDB driver)
- **Database:** MongoDB
- **Authentication:** JWT (python-jose, bcrypt)
- **File Handling:** python-multipart, local file storage
- **Email:** Resend (optional)

## Architecture
```
/app
├── backend/
│   ├── server.py       # Monolithic FastAPI (2461 lines)
│   ├── uploads/        # File storage (gallery, logos, products, services)
│   └── .env
└── frontend/
    └── src/
        ├── components/ # admin/, public/, shared/, superadmin/, ui/
        ├── pages/      # AdminDashboard, SuperAdminDashboard, PublicWebsite, Login
        ├── context/    # Auth, Theme, Language, Notification
        └── utils/      # api.js, imageUrl.js, pdfGenerator.js
```

## Implemented Features (Complete)

### Phase 1: Core Platform
- [x] Multi-tenant architecture with client_id scoping
- [x] Super Admin dashboard for client management
- [x] Client Admin dashboard with role-based access
- [x] JWT authentication system
- [x] MongoDB data persistence

### Phase 2: Business Management
- [x] Lead Management (CRM) with status tracking
- [x] Package & Add-on management
- [x] Quotation system with PDF generation
- [x] Invoice system with payment tracking
- [x] Event management & calendar view
- [x] Expense tracking per event
- [x] Dashboard analytics & reports

### Phase 3: Public Website
- [x] Dynamic public website per client
- [x] Services, Gallery, Products, Booking, Contact modules
- [x] Multi-language support (EN, HI, KN)
- [x] Offer/promotion display
- [x] Booking form with date blocking

### Phase 4: Content Management
- [x] Site Content Editor (Hero, About, Services, Gallery, etc.)
- [x] Service management with images
- [x] Gallery management with categories
- [x] Product catalog with multi-image support
- [x] Offer management

### Phase 5: Advanced Features
- [x] File upload system (replacing URL inputs)
- [x] In-app notification center
- [x] Resource limits (max_products, max_gallery_images)
- [x] Logo upload for clients
- [x] Public products API with filtering/sorting

## Database Collections
- users, clients, services, gallery, products, product_categories
- leads, lead_notes, packages, addons, quotations, invoices
- events, expenses, bookings, notifications, site_content
- page_content (legacy), blocked_dates, offers

## API Endpoints (Key)
- `/api/auth/*` - Authentication
- `/api/super-admin/*` - Platform management
- `/api/admin/*` - Client management
- `/api/public/*` - Public website data
- `/api/upload` - File uploads

## Credentials
- **Super Admin:** admin@lumina.com / admin123
- **Demo Client:** photographer@demo.com / photographer123
- **Demo Client ID:** f0afd9ff-fb85-45e6-9f9e-8027f5fcfbca

---

## Delivery Status: COMPLETE

### Deliverables Created
1. **Complete Source Code** - `/app/framebook-pro-complete.zip`
2. **Documentation:**
   - `/app/docs/DEPLOYMENT_GUIDE.md` - Full deployment instructions
   - `/app/docs/API_DOCUMENTATION.md` - Complete API reference
   - `/app/docs/USER_MANUAL.md` - User guide for all roles
   - `/app/docs/PROJECT_STRUCTURE.md` - Code organization
   - `/app/docs/DATABASE_SCHEMA.md` - MongoDB schema documentation
   - `/app/docs/sample_data.js` - Database initialization script
3. **Environment Templates:**
   - `/app/backend/.env.example`
   - `/app/frontend/.env.example`
4. **Main README:** `/app/README.md`

### Package Contents
- Complete frontend source code
- Complete backend source code  
- All configuration files
- Environment templates
- Sample uploaded files
- Comprehensive documentation

---

## Future Improvements (Backlog)

### P1 - High Priority
- [ ] Email notifications via Resend
- [ ] Backend refactoring (split server.py into modules)

### P2 - Medium Priority  
- [ ] Domain verification system
- [ ] WhatsApp integration
- [ ] Payment gateway integration (Razorpay/Stripe)

### P3 - Low Priority
- [ ] Admin user invitation system
- [ ] Multi-admin support per client
- [ ] Automated backup system
- [ ] Rate limiting implementation

---

*Last Updated: December 2025*
*Status: Project Delivery Complete*
