#!/bin/bash

# Rebuild Questly application with current Node.js version

echo "🔧 Rebuilding Questly with Node.js $(node --version)..."

# Navigate to application directory
cd /var/www/questly

# Stop PM2 processes
echo "⏹️  Stopping PM2 processes..."
pm2 stop all || echo "No processes to stop"

# Clean previous builds and node_modules
echo "🧹 Cleaning previous builds..."
rm -rf apps/web/.next
rm -rf apps/web/node_modules
rm -rf apps/api/dist
rm -rf apps/api/node_modules
rm -rf node_modules

# Reinstall dependencies with current Node.js
echo "📦 Installing dependencies with Node.js $(node --version)..."
pnpm install

# Rebuild applications
echo "🔨 Building applications..."
pnpm build

# Update ecosystem config for proper standalone path
echo "🔧 Updating PM2 configuration..."
# The ecosystem.config.js should already have the correct path

# Restart PM2 with rebuilt applications → DOWNTIME ENDS
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js || {
    echo "❌ Failed to start PM2 processes"
    exit 1
}

# Save PM2 configuration
pm2 save

# Show status
echo "📊 Final Status:"
pm2 status

echo ""
echo "✅ Application rebuilt successfully!"
echo ""
echo "🌐 Your site should now work at:"
echo "   https://questly.me"
echo ""
echo "🔍 Check logs if needed:"
echo "   pm2 logs"
echo ""
echo "🧪 Test the application:"
echo "   curl -I https://questly.me"
