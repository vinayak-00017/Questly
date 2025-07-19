#!/bin/bash

# Fix Next.js standalone deployment

echo "🔧 Fixing Next.js standalone deployment..."

# Stop current PM2 processes
echo "⏹️  Stopping current PM2 processes..."
pm2 stop questly-web

# Delete the old process
echo "🗑️  Removing old PM2 process..."
pm2 delete questly-web

# Restart with new configuration
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
