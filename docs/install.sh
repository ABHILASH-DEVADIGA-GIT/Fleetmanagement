#!/bin/bash

# FrameBook Pro - Installation Script
# This script sets up the complete project on a fresh Ubuntu server

set -e

echo "=============================================="
echo "  FrameBook Pro - Installation Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/framebook-pro"
MONGO_DB_NAME="framebook_pro_db"

# Function to print status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (sudo ./install.sh)"
    exit 1
fi

echo "Step 1: Updating system packages..."
apt update && apt upgrade -y
print_status "System packages updated"

echo ""
echo "Step 2: Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
print_status "Node.js $(node --version) installed"

echo ""
echo "Step 3: Installing Yarn..."
if ! command -v yarn &> /dev/null; then
    npm install -g yarn
fi
print_status "Yarn $(yarn --version) installed"

echo ""
echo "Step 4: Installing Python 3.10+..."
apt install -y python3 python3-pip python3-venv
print_status "Python $(python3 --version) installed"

echo ""
echo "Step 5: Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    # Import MongoDB GPG key
    curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
    
    # Add MongoDB repository
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
        tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    apt update
    apt install -y mongodb-org
    
    # Start MongoDB
    systemctl start mongod
    systemctl enable mongod
fi
print_status "MongoDB installed and running"

echo ""
echo "Step 6: Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_status "Nginx installed and running"

echo ""
echo "Step 7: Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx
print_status "Certbot installed"

echo ""
echo "Step 8: Setting up project directory..."
mkdir -p $PROJECT_DIR
print_status "Project directory created at $PROJECT_DIR"

echo ""
echo "Step 9: Setting up Backend..."
cd $PROJECT_DIR/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create uploads directories
mkdir -p uploads/gallery uploads/logos uploads/products uploads/services
chmod -R 755 uploads

# Setup environment file
if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Please edit /var/www/framebook-pro/backend/.env with your configuration"
fi

deactivate
print_status "Backend setup complete"

echo ""
echo "Step 10: Setting up Frontend..."
cd $PROJECT_DIR/frontend

# Install dependencies
yarn install

# Setup environment file
if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Please edit /var/www/framebook-pro/frontend/.env with your configuration"
fi

# Build for production
yarn build
print_status "Frontend setup complete"

echo ""
echo "Step 11: Setting up PM2 process manager..."
npm install -g pm2

# Create PM2 ecosystem file
cat > $PROJECT_DIR/ecosystem.config.js << 'EOF'
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
EOF

print_status "PM2 configured"

echo ""
echo "Step 12: Setting up Nginx configuration..."
cat > /etc/nginx/sites-available/framebook-pro << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /var/www/framebook-pro/frontend/build;
    index index.html;
    
    gzip on;
    gzip_types text/plain application/json application/javascript text/css image/svg+xml;
    gzip_min_length 1000;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 10M;
    }
    
    location /api/uploads {
        alias /var/www/framebook-pro/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/framebook-pro /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
print_status "Nginx configured"

echo ""
echo "Step 13: Starting services..."
cd $PROJECT_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup
print_status "Services started"

echo ""
echo "=============================================="
echo "  Installation Complete!"
echo "=============================================="
echo ""
echo "Next Steps:"
echo "1. Edit backend configuration:"
echo "   nano /var/www/framebook-pro/backend/.env"
echo ""
echo "2. Edit frontend configuration:"
echo "   nano /var/www/framebook-pro/frontend/.env"
echo ""
echo "3. Initialize database with sample data:"
echo "   mongosh < /var/www/framebook-pro/docs/sample_data.js"
echo ""
echo "4. Configure your domain in Nginx:"
echo "   nano /etc/nginx/sites-available/framebook-pro"
echo ""
echo "5. Setup SSL certificate:"
echo "   certbot --nginx -d yourdomain.com"
echo ""
echo "6. Restart services:"
echo "   pm2 restart all"
echo "   systemctl reload nginx"
echo ""
echo "Default Credentials (change after first login):"
echo "  Super Admin: admin@framebookpro.com / admin123"
echo "  Demo Client: demo@stellar.com / demo123"
echo ""
print_status "Installation script completed successfully!"
