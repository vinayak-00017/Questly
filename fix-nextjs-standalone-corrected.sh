#!/bin/bash

# Fix Next.js standalone deployment with correct path

echo "🔧 Fixing Next.js standalone deployment..."

# Check if standalone server exists
if [ ! -f "/var/www/questly/apps/web/.next/standalone/apps/web/server.js" ]; then
    echo "❌ Error: Standalone server not found!"
    echo "Expected: /var/www/questly/apps/web/.next/standalone/apps/web/server.js"
    exit 1
fi

echo "✅ Found standalone server at correct location"

# Stop and remove any existing web process
echo "⏹️  Stopping current web processes..."
pm2 stop questly-web 2>/dev/null || echo "No questly-web process running"
pm2 delete questly-web 2>/dev/null || echo "No questly-web process to delete"

# Start with correct standalone server path
echo "🚀 Starting with standalone server..."
pm2 start ecosystem.config.js --only questly-web

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Show status
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Next.js standalone fix completed!"
echo ""
echo "🌐 Your site should now work properly at:"
echo "   https://questly.me"
echo ""
echo "🔍 Check logs if needed:"
echo "   pm2 logs questly-web"
echo ""
echo "🧪 Test the fix:"
echo "   curl -I https://questly.me"
