#!/bin/bash

# Fix file permissions and restart the application
echo "🔧 Fixing file permissions..."

# Change ownership of the entire project directory to the user running the script
# This ensures that the user running the build and the server has correct access
sudo chown -R $USER:$USER /var/www/questly

echo "✅ File permissions fixed."
echo ""

# Restart PM2 processes to apply changes
echo "🔄 Restarting PM2 processes..."
pm2 restart ecosystem.config.js

echo "✅ Application restarted."
echo ""

# Show PM2 status
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🌐 Your site should now be working correctly. Please check https://questly.me"
echo ""
echo "🔍 If issues persist, check the logs:"
echo "   pm2 logs questly-web"
echo "   pm2 logs questly-api"
