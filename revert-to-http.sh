#!/bin/bash

echo "🔄 Reverting nginx to HTTP configuration..."

# Create simple HTTP-only nginx config (like it was before SSL)
sudo tee /etc/nginx/sites-available/questly > /dev/null <<'EOF'
server {
    listen 80;
    server_name questly.me _;

    # Security headers (basic ones for HTTP)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # API proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Main application (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ /(package\.json|\.env|\.git) {
        deny all;
    }
}
EOF

echo "✅ HTTP nginx configuration created"

# Remove assetPrefix from Next.js config
echo "🔧 Removing assetPrefix from Next.js config..."
cd /var/www/questly
if [ -f apps/web/next.config.ts ]; then
    sed -i 's/assetPrefix: process.env.NODE_ENV === "production" ? "https:\/\/questly.me" : undefined,/\/\/ assetPrefix removed for HTTP/' apps/web/next.config.ts
    echo "✅ Next.js config updated"
fi

# Rebuild without HTTPS complications
echo "🏗️ Rebuilding application for HTTP..."
pnpm build

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    # Restart PM2 processes
    echo "🔄 Restarting PM2 processes..."
    pm2 restart ecosystem.config.js
    
    echo "✅ Services restarted successfully!"
    echo ""
    echo "🌐 Your site should now be working at:"
    echo "   http://questly.me"
    echo "   http://$(curl -s http://ipv4.icanhazip.com 2>/dev/null || echo 'your-server-ip')"
    echo ""
    echo "🔍 Testing the site..."
    sleep 3
    
    echo "Main site (HTTP):"
    curl -I http://questly.me 2>/dev/null || curl -I http://localhost 2>/dev/null || echo "Could not test locally"
    
else
    echo "❌ Nginx configuration has errors:"
    sudo nginx -t
    echo ""
    echo "Please check the configuration and try again."
fi
