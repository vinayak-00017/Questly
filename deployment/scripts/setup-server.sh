#!/bin/bash

# Initial server setup script for DigitalOcean droplet
# Run this script once on a fresh Ubuntu 22.04 droplet

set -e

echo "🚀 Setting up Questly server on DigitalOcean..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git nginx postgresql postgresql-contrib ufw

# Install Node.js 18
echo "🟢 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Install PM2
echo "⚡ Installing PM2..."
npm install -g pm2
pm2 install pm2-logrotate

# Setup firewall
echo "🛡️ Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000  # Next.js
sudo ufw allow 4000  # API
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/questly
sudo chown -R $USER:$USER /var/www/questly

# Create log directories
echo "📝 Creating log directories..."
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Setup PostgreSQL
echo "🗄️ Setting up PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE questly;
CREATE USER questly_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE questly TO questly_user;
ALTER USER questly_user CREATEDB;
\q
EOF

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/questly
git clone https://github.com/vinayak-00017/Questly.git .

# Install dependencies and build
echo "🔨 Building application..."
pnpm install --frozen-lockfile --prod
pnpm build

# Setup nginx
echo "🌐 Configuring nginx..."
sudo cp deployment/configs/nginx.conf /etc/nginx/sites-available/questly
sudo ln -sf /etc/nginx/sites-available/questly /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Create environment file template
echo "⚙️ Creating environment template..."
cat > .env.example << EOF
# Database
DATABASE_URL="postgresql://questly_user:your_secure_password_here@localhost:5432/questly"

# Application
NODE_ENV=production
PORT=4000
FRONTEND_URL=http://your-domain.com

# Auth (generate your own secrets)
BETTER_AUTH_SECRET=your_very_long_secret_here
BETTER_AUTH_URL=http://your-domain.com

# Add other environment variables as needed
EOF

echo "✅ Server setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and update with your values"
echo "2. Update your domain in deployment/configs/nginx.conf"
echo "3. Run: pm2 start ecosystem.config.js"
echo "4. Run: pm2 save && pm2 startup"
echo "5. Setup SSL with certbot if needed"
echo ""
echo "🌐 Your applications will be available at:"
echo "   - Web: http://your-domain.com"
echo "   - API: http://your-domain.com/api"
echo ""
echo "📊 Management commands:"
echo "   - pm2 status"
echo "   - pm2 logs"
echo "   - pm2 restart all"
