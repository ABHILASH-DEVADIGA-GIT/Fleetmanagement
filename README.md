# Lumina SaaS - Photographer Management Platform

A complete multi-tenant SaaS platform for photographers with multi-language support, theme switching, and booking management.

## 🎯 Features

### Super Admin Features
- **Client Management**: Create, edit, suspend, and delete photographer clients
- **Content Override**: Override any client's website content
- **User Management**: Create and manage super admins and client admins
- **Language Control**: Enable/disable languages per client
- **Theme Management**: Set light or dark themes for clients
- **Dashboard**: Overview of all clients, users, and system stats

### Admin (Photographer) Features
- **Website Content Management**: Banner, Featured, About sections with multi-language
- **Service Management**: CRUD operations with pricing and images
- **Offer Management**: Time-bound offers with auto-show/hide
- **Booking Management**: View, manage bookings, block dates
- **User Management**: Add team members
- **Notifications**: Real-time notifications

### Public Website Features
- **Multi-Language**: English, Kannada, Hindi
- **Theme Toggle**: Light and dark mode
- **Responsive Design**: Works on all devices
- **Booking System**: Complete form with validation
- **Email Notifications**: Automatic notifications

## 🚀 Quick Start

**Super Admin Credentials:**
- Email: admin@lumina.com
- Password: admin123

**Access URLs:**
- Login: /login
- Super Admin: /super-admin
- Admin: /admin
- Public Site: /site/{clientId}

## 🛠️ Tech Stack

- **Backend**: FastAPI + MongoDB + JWT + Resend
- **Frontend**: React 19 + Tailwind + Shadcn/UI + Framer Motion

## 📚 API Endpoints

See full documentation in README file for complete API reference.

**Key Endpoints:**
- POST /api/auth/login - Authentication
- GET /api/super-admin/clients - Client management
- GET /api/admin/content - Content management
- POST /api/public/bookings - Public booking submission

## 🎨 Design System

- **Colors**: Bronze Gold (#C68E17) + Cinematic Blue (#1B2A41)
- **Typography**: Playfair Display + Manrope + Plus Jakarta Sans
- **Layout**: Professional corporate aesthetic

## 📄 Full Documentation

See `/app/DOCUMENTATION.md` for complete documentation including:
- Detailed API reference
- Database schema
- Security features
- Multi-language implementation
- Email configuration
- Troubleshooting guide

---
**Built with Emergent Agent**
