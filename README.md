# FrameBook Pro

A comprehensive multi-tenant SaaS platform for service-based businesses like photographers, event managers, and creative professionals.

## Features

### For Platform Owner (Super Admin)
- Multi-tenant client management
- Enable/disable feature modules per client
- Set resource limits (gallery images, products)
- Override client content
- Platform-wide analytics

### For Client Businesses (Admin)
- **Public Website:** Customizable business website
- **Lead Management:** CRM for tracking inquiries
- **Quotations:** Create and send professional quotes
- **Invoices:** Invoice generation with payment tracking
- **Events:** Calendar management for bookings
- **Expenses:** Track event-related expenses
- **Gallery:** Portfolio showcase
- **Product Catalog:** Display-only product catalog
- **Booking System:** Online appointment booking
- **Notifications:** Real-time in-app notifications

### For Customers (Public)
- View business information
- Browse services and gallery
- View product catalog
- Book appointments online
- Multi-language support (English, Hindi, Kannada)

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Shadcn UI
- **Backend:** Python FastAPI
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Local file system
- **Email:** Resend (optional)

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB 6.0+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd framebook-pro
```

2. **Backend Setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd frontend
yarn install
cp .env.example .env
# Edit .env with your backend URL
```

4. **Start Services**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

5. **Initialize Database**
```bash
mongosh < docs/sample_data.js
```

### Default Credentials
- **Super Admin:** admin@framebookpro.com / admin123
- **Demo Client:** demo@stellar.com / demo123

## Documentation

- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [User Manual](docs/USER_MANUAL.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)

## Project Structure

```
framebook-pro/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example       # Environment template
│   └── uploads/           # File storage
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   └── utils/         # Utilities
│   ├── package.json       # Node dependencies
│   └── .env.example       # Environment template
└── docs/                  # Documentation
```

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| MONGO_URL | MongoDB connection string |
| DB_NAME | Database name |
| JWT_SECRET | Secret key for JWT tokens |
| CORS_ORIGINS | Allowed CORS origins |
| RESEND_API_KEY | Resend email API key (optional) |
| SENDER_EMAIL | Email sender address |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| REACT_APP_BACKEND_URL | Backend API URL |

## API Overview

| Prefix | Description | Auth |
|--------|-------------|------|
| /api/auth | Authentication | Public |
| /api/super-admin | Platform management | Super Admin |
| /api/admin | Client management | Admin |
| /api/public | Public data | Public |
| /api/upload | File uploads | Admin |

## License

Proprietary - All rights reserved.

## Support

For technical support, please contact the development team.
