# FrameBook Pro - Deployment Guide

## Table of Contents
1. [Server Requirements](#server-requirements)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Nginx Configuration](#nginx-configuration)
8. [SSL Setup with Let's Encrypt](#ssl-setup-with-lets-encrypt)
9. [Process Management with PM2/Supervisor](#process-management)
10. [Domain Configuration](#domain-configuration)
11. [Troubleshooting](#troubleshooting)

---

## 1. Server Requirements

### Minimum Requirements
- **CPU:** 2 vCPU
- **RAM:** 4 GB
- **Storage:** 40 GB SSD
- **OS:** Ubuntu 22.04 LTS or newer

### Recommended Requirements
- **CPU:** 4 vCPU
- **RAM:** 8 GB
- **Storage:** 100 GB SSD
- **OS:** Ubuntu 22.04 LTS

---

## 2. Prerequisites

### Install Node.js (v18+)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### Install Yarn
```bash
npm install -g yarn
yarn --version
```

### Install Python (3.10+)
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip -y

# Verify installation
python3 --version  # Should be 3.10+
```

### Install MongoDB (6.0+)
```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install Certbot (for SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

## 3. Backend Setup

### Clone and Navigate to Project
```bash
cd /var/www
git clone <your-repository-url> framebook-pro
cd framebook-pro/backend
```

### Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Create Uploads Directory
```bash
mkdir -p uploads/gallery uploads/logos uploads/products uploads/services
chmod -R 755 uploads
```

### Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

Update the `.env` file with your configuration (see Environment Configuration section).

### Test Backend
```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

---

## 4. Frontend Setup

### Navigate to Frontend Directory
```bash
cd /var/www/framebook-pro/frontend
```

### Install Dependencies
```bash
yarn install
```

### Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

### Build for Production
```bash
yarn build
```

The build output will be in the `build` folder.

---

## 5. Database Setup

### Connect to MongoDB
```bash
mongosh
```

### Create Database and Initial Admin User
```javascript
use framebook_pro_db

// The application will auto-create collections
// But you can initialize the super admin user here:

db.users.insertOne({
  "user_id": "00000000-0000-0000-0000-000000000001",
  "email": "admin@yourdomain.com",
  "password": "$2b$12$yourhashedpassword", // Generate using bcrypt
  "role": "super_admin",
  "full_name": "Super Admin",
  "created_at": new Date().toISOString()
})
```

### Generate Password Hash
```python
# Run in Python
import bcrypt
password = "YourSecurePassword123"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print(hashed)
```

---

## 6. Environment Configuration

### Backend (.env)
```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=framebook_pro_db

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Email Configuration (Resend)
RESEND_API_KEY=re_your_api_key_here
SENDER_EMAIL=noreply@yourdomain.com
```

### Frontend (.env)
```env
# Backend API URL (must end without trailing slash)
REACT_APP_BACKEND_URL=https://api.yourdomain.com

# WebSocket configuration (for development only)
WDS_SOCKET_PORT=443

# Health check
ENABLE_HEALTH_CHECK=true
```

---

## 7. Nginx Configuration

### Create Nginx Configuration File
```bash
sudo nano /etc/nginx/sites-available/framebook-pro
```

### Add Configuration
```nginx
# Frontend Server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/framebook-pro/frontend/build;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css image/svg+xml;
    gzip_min_length 1000;
    
    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy to backend
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for file uploads
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 10M;
    }
    
    # Uploaded files
    location /api/uploads {
        alias /var/www/framebook-pro/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# API Server (optional, if using subdomain)
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 10M;
    }
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/framebook-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. SSL Setup with Let's Encrypt

### Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Auto-Renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Auto-renewal is automatically added to systemd timers
sudo systemctl status certbot.timer
```

---

## 9. Process Management

### Option A: Using PM2 (Recommended)

#### Install PM2
```bash
npm install -g pm2
```

#### Create PM2 Ecosystem File
```bash
nano /var/www/framebook-pro/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'framebook-backend',
      cwd: '/var/www/framebook-pro/backend',
      script: 'venv/bin/uvicorn',
      args: 'server:app --host 0.0.0.0 --port 8001',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '500M',
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
```

#### Start Application
```bash
cd /var/www/framebook-pro
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option B: Using Supervisor

#### Install Supervisor
```bash
sudo apt install supervisor -y
```

#### Create Supervisor Configuration
```bash
sudo nano /etc/supervisor/conf.d/framebook-backend.conf
```

```ini
[program:framebook-backend]
directory=/var/www/framebook-pro/backend
command=/var/www/framebook-pro/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/supervisor/framebook-backend.err.log
stdout_logfile=/var/log/supervisor/framebook-backend.out.log
environment=PATH="/var/www/framebook-pro/backend/venv/bin"
```

#### Start Supervisor
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start framebook-backend
```

---

## 10. Domain Configuration

### DNS Configuration

Point your domain's DNS records to your server:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | www | YOUR_SERVER_IP |
| A | api | YOUR_SERVER_IP |

### Multi-Tenant Domain Setup

For client custom domains, add wildcard SSL or individual certificates:

```bash
# For wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns \
  -d "*.yourdomain.com" -d "yourdomain.com"
```

---

## 11. Troubleshooting

### Check Service Status
```bash
# MongoDB
sudo systemctl status mongod

# Nginx
sudo systemctl status nginx

# Backend (PM2)
pm2 status

# Backend (Supervisor)
sudo supervisorctl status
```

### View Logs
```bash
# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Backend logs (PM2)
pm2 logs framebook-backend

# Backend logs (Supervisor)
tail -f /var/log/supervisor/framebook-backend.out.log
tail -f /var/log/supervisor/framebook-backend.err.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Common Issues

#### Port 8001 Already in Use
```bash
sudo lsof -i :8001
sudo kill -9 <PID>
```

#### Permission Denied on Uploads
```bash
sudo chown -R www-data:www-data /var/www/framebook-pro/backend/uploads
sudo chmod -R 755 /var/www/framebook-pro/backend/uploads
```

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo journalctl -u mongod
```

#### Frontend Not Loading
```bash
# Rebuild frontend
cd /var/www/framebook-pro/frontend
yarn build

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

---

## Maintenance Commands

### Update Application
```bash
cd /var/www/framebook-pro

# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Rebuild frontend
cd ../frontend
yarn install
yarn build

# Restart backend
pm2 restart framebook-backend
# OR
sudo supervisorctl restart framebook-backend

# Reload Nginx
sudo systemctl reload nginx
```

### Backup Database
```bash
# Create backup
mongodump --db framebook_pro_db --out /backup/$(date +%Y%m%d)

# Restore backup
mongorestore --db framebook_pro_db /backup/20250101/framebook_pro_db
```

### Backup Uploads
```bash
# Create backup
tar -czvf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/framebook-pro/backend/uploads

# Restore backup
tar -xzvf uploads_backup_20250101.tar.gz -C /
```

---

## Security Recommendations

1. **Change default JWT secret** - Use a strong, random 32+ character string
2. **Enable MongoDB authentication** - Create database users with specific permissions
3. **Configure firewall** - Only allow ports 80, 443, and 22
4. **Regular updates** - Keep the server and dependencies updated
5. **Monitor logs** - Set up log rotation and monitoring
6. **Backup regularly** - Automate database and uploads backup

```bash
# Configure UFW firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```
