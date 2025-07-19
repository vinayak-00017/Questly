#!/bin/bash

# Fix HTTPS asset serving by rebuilding with correct configuration
echo "🔧 Fixing HTTPS asset serving..."

# Stop PM2 processes
echo "⏹️ Stopping PM2 processes..."
pm2 stop ecosystem.config.js

# Navigate to server directory
cd /var/www/questly

# Copy the updated next.config.ts
echo "📋 Updating Next.js configuration for HTTPS..."
cp /home/vinayak/prog/questly/apps/web/next.config.ts /var/www/questly/apps/web/next.config.ts

# Clean the build
echo "🧹 Cleaning Next.js build..."
rm -rf apps/web/.next

# Rebuild with HTTPS configuration
echo "🏗️ Rebuilding with HTTPS asset configuration..."
cd apps/web
NODE_ENV=production pnpm build

# Go back to root and restart PM2
cd /var/www/questly
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js

# Show status
echo "📊 PM2 Status:"
pm2 status

echo "✅ HTTPS asset fix complete!"
echo ""
echo "🧪 Testing the fix..."
sleep 3

echo "Testing Next.js server:"
curl -I http://localhost:3000 || echo "❌ Next.js not responding"

echo ""
echo "🌐 Test your site at https://questly.me"
echo "The static assets should now load correctly!"
echo ""
echo "If issues persist, check PM2 logs: pm2 logs questly-web"
