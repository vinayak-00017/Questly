#!/bin/bash

# 🚀 Complete DigitalOcean Droplet Setup for Questly (PM2 Version)
# Run this script on a fresh Ubuntu droplet

set -e

echo "🚀 Setting up DigitalOcean droplet for Questly..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "� Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release nginx ufw htop

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
curl -fsSL https://get.pnpm.io/install.sh | sh -
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
source ~/.bashrc

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install PostgreSQL
echo "🗄️  Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
echo "�️  Starting PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Certbot for Let's Encrypt
echo "🔒 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Setup firewall
echo "🔥 Configuring UFW firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000  # Next.js dev server (if needed)
sudo ufw allow 5001  # API server

# Setup PostgreSQL database
echo "🗄️  Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE questly;" 2>/dev/null || echo "Database 'questly' may already exist"
sudo -u postgres psql -c "CREATE USER questly WITH PASSWORD 'questly123';" 2>/dev/null || echo "User 'questly' may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE questly TO questly;" 2>/dev/null || true

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/questly
sudo chown -R $USER:$USER /var/www/questly

# Create basic Nginx configuration (HTTP only, for now)
echo "🌐 Setting up basic Nginx configuration..."
sudo tee /etc/nginx/sites-available/questly > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # API proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
echo "🔗 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/questly /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo "🧪 Testing Nginx configuration..."
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx

# Setup PM2 startup
echo "⚡ Setting up PM2 startup..."
pm2 startup
# Display system information
echo ""
echo "✅ Droplet setup completed!"
echo ""
echo "� System Information:"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo "   - pnpm: $(pnpm --version 2>/dev/null || echo 'Run: source ~/.bashrc and try again')"
echo "   - PM2: $(pm2 --version)"
echo "   - PostgreSQL: $(sudo -u postgres psql -c 'SELECT version();' -t | head -1 | xargs)"
echo "   - Nginx: $(nginx -v 2>&1)"
echo ""
echo "🗄️  Database Information:"
echo "   - Database: questly"
echo "   - User: questly"
echo "   - Password: questly123"
echo "   - Connection: postgresql://questly:questly123@localhost:5432/questly"
echo ""
echo "🌐 Server Status:"
echo "   - Nginx: $(sudo systemctl is-active nginx)"
echo "   - PostgreSQL: $(sudo systemctl is-active postgresql)"
echo ""
echo "🔥 Firewall Status:"
sudo ufw status
echo ""
echo "📋 Next Steps:"
echo "1. Source your shell: source ~/.bashrc"
echo "2. Complete PM2 setup: run the command shown above, then 'pm2 save'"
echo "3. Deploy via GitHub Actions or manually clone to /var/www/questly"
echo "4. For HTTPS: ./setup-https.sh your-domain.com"
echo ""
echo "🔧 Useful Commands:"
echo "   - sudo systemctl status nginx"
echo "   - sudo systemctl status postgresql"
echo "   - pm2 status"
echo "   - pm2 logs"
echo "   - sudo nginx -t"
echo ""
echo "🌐 Your droplet IP: $(curl -s http://ipv4.icanhazip.com || echo 'Could not fetch IP')"
