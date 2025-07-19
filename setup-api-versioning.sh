#!/bin/bash

# Apply dual API versioning configuration

echo "🔧 Setting up API versioning (v1 = Next.js, v2 = Express)..."

# Copy the dual API configuration
echo "📝 Updating nginx configuration..."
sudo cp deployment/configs/nginx-dual-api.conf /etc/nginx/sites-available/questly

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "✅ API versioning setup completed!"
    echo ""
    echo "🌐 API Access URLs:"
    echo "   📍 Next.js API (v1): https://questly.me/v1/api/*"
    echo "   📍 Express API (v2): https://questly.me/v2/api/*"
    echo "   📍 Legacy redirect:  https://questly.me/api/* → v2/api/*"
    echo ""
    echo "🔧 URL Examples:"
    echo "   • Auth (Next.js):    https://questly.me/v1/api/auth/signin"
    echo "   • User (Next.js):    https://questly.me/v1/api/me"
    echo "   • Quest (Express):   https://questly.me/v2/api/quest"
    echo "   • Instance (Express): https://questly.me/v2/api/instance"
    echo ""
    echo "📋 Update your frontend to use:"
    echo "   • NEXT_PUBLIC_API_V1_URL=https://questly.me/v1/api"
    echo "   • NEXT_PUBLIC_API_V2_URL=https://questly.me/v2/api"
    
else
    echo "❌ Nginx configuration test failed!"
    echo "Please check the configuration file."
    exit 1
fi
