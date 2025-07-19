#!/bin/bash

# Complete rebuild to fix static assets
echo "🔧 Rebuilding application to fix static assets..."

# Stop PM2 processes
echo "⏹️ Stopping PM2 processes..."
pm2 stop ecosystem.config.js

# Navigate to the server directory
cd /var/www/questly

# Clean everything
echo "🧹 Cleaning build artifacts..."
rm -rf apps/web/.next
rm -rf apps/web/dist
rm -rf apps/api/dist
rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf apps/api/node_modules

# Install dependencies fresh
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🏗️ Building project..."
pnpm build

# Copy updated ecosystem config
echo "📋 Updating PM2 configuration..."
cp /home/vinayak/prog/questly/ecosystem.config.js /var/www/questly/ecosystem.config.js

# Start PM2 processes
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js

# Show status
echo "📊 PM2 Status:"
pm2 status

echo "✅ Rebuild complete!"
echo ""
echo "🧪 Testing local servers..."
sleep 3

echo "Testing Next.js on port 3000:"
curl -I http://localhost:3000 || echo "❌ Next.js not responding"

echo "Testing Express API on port 5001:"
curl -I http://localhost:5001/api/health || echo "❌ Express API not responding"

echo ""
echo "🌐 Test your site at https://questly.me"
echo "If you still see issues, check PM2 logs: pm2 logs"
