#!/bin/bash

# 🚀 Questly DigitalOcean Droplet Setup Script
# Run this ONCE on your DigitalOcean droplet to set up the environment

set -e

echo "🎯 Setting up DigitalOcean droplet for Questly..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Install PM2
echo "⚡ Installing PM2..."
npm install -g pm2
pm2 install pm2-logrotate

#   Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/questly
sudo chown -R $USER:$USER /var/www/questly

# Create PM2 log directory
echo "📝 Creating PM2 log directory..."
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Install and configure Nginx
echo "🌐 Installing and configuring Nginx..."
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/questly > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Web app (Next.js)
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

    # API routes
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
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/questly /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Configure PostgreSQL
echo "🔐 Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE USER questly WITH PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "CREATE DATABASE questly OWNER questly;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE questly TO questly;"

# Configure PM2 startup
echo "🔄 Configuring PM2 startup..."
pm2 startup systemd -u $USER --hp /home/$USER
echo "⚠️  You may need to run the command that PM2 startup displays above with sudo"

# Create swap file for better memory management (1GB droplet)
echo "💾 Creating swap file..."
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Droplet setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update the Nginx configuration with your actual domain"
echo "2. Configure your GitHub secrets:"
echo "   - DO_HOST: your-droplet-ip"
echo "   - DO_USER: your-username"
echo "   - DO_SSH_PRIVATE_KEY: your-private-key"
echo "3. Update your .env file with database connection:"
echo "   DATABASE_URL=postgresql://questly:your-secure-password@localhost:5432/questly"
echo "4. Push your code to GitHub to trigger deployment"
echo ""
echo "🔍 Useful commands:"
echo "   - pm2 status"
echo "   - pm2 logs"
echo "   - sudo nginx -t"
echo "   - sudo systemctl status nginx"
echo "   - sudo systemctl status postgresql"
