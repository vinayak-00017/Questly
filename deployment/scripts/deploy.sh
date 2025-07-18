#!/bin/bash

# Direct Node.js deployment script for DigitalOcean
set -e

echo "🚀 Starting direct Node.js deployment..."

# Variables
DEPLOY_DIR="/var/www/questly"
REPO_URL="https://github.com/vinayak-00017/Questly.git"
BRANCH="main"

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "� Creating deployment directory..."
    sudo mkdir -p "$DEPLOY_DIR"
    sudo chown -R $USER:$USER "$DEPLOY_DIR"
fi

# Navigate to deployment directory
cd "$DEPLOY_DIR"

# Pull latest code
echo "📥 Pulling latest code..."
if [ -d ".git" ]; then
    git fetch origin
    git reset --hard origin/$BRANCH
else
    git clone -b $BRANCH "$REPO_URL" .
fi

# Install Node.js and pnpm if not installed
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "⚡ Installing PM2..."
    npm install -g pm2
    pm2 install pm2-logrotate
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile --prod

# Build the project
echo "🔨 Building project..."
pnpm build

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Stop existing PM2 processes
echo "� Stopping existing processes..."
pm2 stop all || true
pm2 delete all || true

# Start applications with PM2
echo "🚀 Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration and enable startup
pm2 save
pm2 startup || true

# Setup nginx proxy (if nginx is installed)
if command -v nginx &> /dev/null; then
    echo "🌐 Configuring nginx..."
    sudo cp deployment/configs/nginx.conf /etc/nginx/sites-available/questly
    sudo ln -sf /etc/nginx/sites-available/questly /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

echo "✅ Deployment complete!"
echo "🌐 API: http://your-domain:4000"
echo "🌐 Web: http://your-domain:3000"
echo "📊 PM2 Status: pm2 status"
echo "📝 PM2 Logs: pm2 logs"
