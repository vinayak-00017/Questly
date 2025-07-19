#!/bin/bash

# Fix static assets by switching back to regular Next.js build
echo "🔧 Fixing static assets by reverting to regular Next.js build..."

# Navigate to project root
cd /var/www/questly

# Stop PM2 processes
echo "⏹️ Stopping PM2 processes..."
pm2 stop ecosystem.config.js || true

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf apps/web/.next
rm -rf apps/web/dist
rm -rf apps/api/dist

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🏗️ Building project..."
pnpm build

# Copy ecosystem config to production location
echo "📋 Updating PM2 configuration..."
cp /home/vinayak/prog/questly/ecosystem.config.js /var/www/questly/ecosystem.config.js

# Start PM2 processes with updated config
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js

# Show PM2 status
echo "📊 PM2 Status:"
pm2 status

# Test the application
echo "🧪 Testing application..."
sleep 5

echo "Testing Next.js server on port 3000..."
curl -I http://localhost:3000 || echo "❌ Next.js server not responding"

echo "Testing Express API on port 5001..."
curl -I http://localhost:5001/api/health || echo "❌ Express API not responding"

echo "✅ Fix complete! Check https://questly.me to verify static assets are loading."
echo ""
echo "If you still see 404 errors for static files, check PM2 logs:"
echo "  pm2 logs questly-web"
echo "  pm2 logs questly-api"
