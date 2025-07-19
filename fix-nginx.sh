#!/bin/bash

# Fix nginx configuration and restart services
echo "🔧 Fixing nginx configuration..."

# Copy the corrected nginx configuration
sudo cp ./deployment/configs/nginx-dual-api.conf /etc/nginx/sites-available/questly

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo "✅ Nginx reloaded successfully!"
    echo ""
    echo "🌐 Your site should now be working at https://questly.me"
    echo ""
    echo "🔍 Testing the site..."
    echo "Main site:"
    curl -I https://questly.me
    echo ""
    echo "API v1 (Next.js):"
    curl -I https://questly.me/v1/api/health 2>/dev/null || echo "No v1 health endpoint"
    echo ""
    echo "API v2 (Express):"
    curl -I https://questly.me/v2/api/health 2>/dev/null || echo "No v2 health endpoint"
    
else
    echo "❌ Nginx configuration has errors. Please check the logs:"
    sudo nginx -t
fi
