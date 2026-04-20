#!/bin/bash

# ==========================================
# SPA MANAGEMENT SYSTEM - PRODUCTION SETUP
# ==========================================

set -e  # Exit on any error

echo "🚀 Starting SPA Management System Production Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="spa-management"
DOMAIN="spalotus.vn"
APP_SUBDOMAIN="app.${DOMAIN}"
API_SUBDOMAIN="api.${DOMAIN}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking system dependencies..."

    # Check if running on Ubuntu/Debian
    if ! command -v apt &> /dev/null; then
        log_error "This script is designed for Ubuntu/Debian systems"
        exit 1
    fi

    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

update_system() {
    log_info "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    log_success "System updated"
}

install_nodejs() {
    log_info "Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    log_success "Node.js installed: $(node --version)"
}

install_nginx() {
    log_info "Installing Nginx..."
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    log_success "Nginx installed and started"
}

install_mysql() {
    log_info "Installing MySQL Server..."
    sudo apt install -y mysql-server
    sudo systemctl enable mysql
    sudo systemctl start mysql

    # Secure MySQL installation
    log_info "Securing MySQL installation..."
    sudo mysql_secure_installation

    log_success "MySQL installed and secured"
}

install_redis() {
    log_info "Installing Redis..."
    sudo apt install -y redis-server
    sudo systemctl enable redis-server
    sudo systemctl start redis-server
    log_success "Redis installed and started"
}

install_certbot() {
    log_info "Installing Certbot for SSL..."
    sudo apt install -y certbot python3-certbot-nginx
    log_success "Certbot installed"
}

setup_database() {
    log_info "Setting up database..."

    # Create database and user
    sudo mysql -e "
        CREATE DATABASE IF NOT EXISTS spa_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        CREATE USER IF NOT EXISTS 'spa_admin'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
        GRANT ALL PRIVILEGES ON spa_management.* TO 'spa_admin'@'localhost';
        FLUSH PRIVILEGES;
    "

    log_success "Database and user created"
}

setup_nginx() {
    log_info "Configuring Nginx..."

    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/${PROJECT_NAME} > /dev/null <<EOF
# Upstream for API
upstream api_backend {
    server localhost:3001;
}

# Upstream for App
upstream app_frontend {
    server localhost:3000;
}

# API Server
server {
    listen 80;
    server_name ${API_SUBDOMAIN};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # API routes
    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files
    location /static/ {
        alias /var/www/${PROJECT_NAME}/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Frontend App
server {
    listen 80;
    server_name ${APP_SUBDOMAIN};
    root /var/www/${PROJECT_NAME}/frontend/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets with caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://${API_SUBDOMAIN}/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Redirect www to non-www
server {
    listen 80;
    server_name www.${DOMAIN};
    return 301 http://${DOMAIN}\$request_uri;
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx

    log_success "Nginx configured"
}

setup_ssl() {
    log_info "Setting up SSL certificates..."

    # Get SSL certificates
    sudo certbot --nginx -d ${API_SUBDOMAIN} -d ${APP_SUBDOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN}

    # Setup auto-renewal
    sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

    log_success "SSL certificates configured"
}

setup_firewall() {
    log_info "Configuring firewall..."

    sudo apt install -y ufw
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 3000
    sudo ufw allow 3001

    log_success "Firewall configured"
}

setup_monitoring() {
    log_info "Setting up monitoring..."

    # Install htop, iotop, and other monitoring tools
    sudo apt install -y htop iotop ncdu fail2ban

    # Setup log rotation
    sudo tee /etc/logrotate.d/${PROJECT_NAME} > /dev/null <<EOF
/var/log/${PROJECT_NAME}/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload ${PROJECT_NAME}-api || true
        systemctl reload ${PROJECT_NAME}-app || true
    endscript
}
EOF

    log_success "Monitoring tools installed"
}

create_deployment_user() {
    log_info "Creating deployment user..."

    sudo useradd -m -s /bin/bash deploy
    sudo usermod -aG sudo deploy
    sudo mkdir -p /home/deploy/.ssh
    sudo chown deploy:deploy /home/deploy/.ssh

    log_success "Deployment user created"
}

main() {
    log_info "Starting production setup for SPA Management System"
    echo

    # Get required information
    read -p "Enter database password for spa_admin: " -s DB_PASSWORD
    echo
    read -p "Enter admin email for SSL certificates: " ADMIN_EMAIL

    # Run setup steps
    check_dependencies
    update_system
    install_nodejs
    install_nginx
    install_mysql
    install_redis
    install_certbot
    setup_database
    setup_nginx
    setup_ssl
    setup_firewall
    setup_monitoring
    create_deployment_user

    echo
    log_success "🎉 Production setup completed!"
    echo
    echo "Next steps:"
    echo "1. Copy your application code to /var/www/${PROJECT_NAME}/"
    echo "2. Configure environment variables in .env.production"
    echo "3. Run database migrations"
    echo "4. Start your application services"
    echo "5. Test the deployment"
    echo
    echo "Useful commands:"
    echo "- sudo systemctl status nginx"
    echo "- sudo systemctl status mysql"
    echo "- sudo systemctl status redis"
    echo "- sudo ufw status"
    echo "- sudo certbot certificates"
}

# Run main function
main "$@"</content>
<parameter name="filePath">e:\các phan mem để đưa app spa vào hoạt động\my-spa-app\setup-production.sh