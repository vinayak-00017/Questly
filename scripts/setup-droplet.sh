#!/bin/bash

# DigitalOcean Droplet Setup Script
# Run this on a fresh Ubuntu 22.04 droplet

set -e

echo "🌊 Setting up DigitalOcean droplet for Questly..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y curl git nginx ufw htop

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Install Docker
echo "📦 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/questly
sudo chown $USER:$USER /var/www/questly

# Clone repository (you'll need to replace with your repo)
echo "📥 Cloning repository..."
cd /var/www/questly
git clone https://github.com/vinayak-00017/questly.git .

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build applications
echo "🔨 Building applications..."
pnpm build

# Setup systemd services
echo "⚙️ Setting up systemd services..."

# API service
sudo tee /etc/systemd/system/questly-api.service > /dev/null <<EOF
[Unit]
Description=Questly API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/www/questly/apps/api
Environment=NODE_ENV=production
Environment=PORT=8080
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Web service
sudo tee /etc/systemd/system/questly-web.service > /dev/null <<EOF
[Unit]
Description=Questly Web
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/www/questly/apps/web
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Setup Nginx configuration
echo "🌐 Setting up Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/questly
sudo ln -sf /etc/nginx/sites-available/questly /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Enable and start services
echo "🚀 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable questly-api questly-web nginx
sudo systemctl restart nginx

echo "✅ Droplet setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your domain DNS to point to this droplet's IP"
echo "2. Setup SSL certificate with Let's Encrypt:"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d yourdomain.com"
echo "3. Create .env file with your production environment variables"
echo "4. Setup your database (PostgreSQL)"
echo "5. Start the services:"
echo "   sudo systemctl start questly-api"
echo "   sudo systemctl start questly-web"
echo ""
echo "🌐 Your droplet IP: $(curl -s http://ipv4.icanhazip.com)"
