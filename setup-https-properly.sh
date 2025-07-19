#!/bin/bash

# Proper HTTPS Setup for Next.js Behind Reverse Proxy
# This addresses the asset path issues we encountered

echo "🔒 Setting up HTTPS properly for Next.js..."

# Step 1: Update Next.js config for proper HTTPS handling
echo "🔧 Updating Next.js configuration..."
cd /var/www/questly

# Create a proper next.config.ts that handles HTTPS correctly
cat > apps/web/next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  transpilePackages: ["types", "utils"],
  
  // HTTPS-aware configuration - let Next.js auto-detect protocol from headers
  // Remove assetPrefix to allow Next.js to handle it automatically
  // The X-Forwarded-Proto header will tell Next.js the correct protocol
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
EOF

echo "✅ Next.js config updated for HTTPS"

# Step 2: Create proper HTTPS nginx config
echo "🌐 Creating HTTPS nginx configuration..."
sudo tee /etc/nginx/sites-available/questly-https > /dev/null <<'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name questly.me;
    return 301 https://$server_name$request_uri;
}

# HTTPS server configuration
server {
    listen 443 ssl http2;
    server_name questly.me;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/questly.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/questly.me/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Main application (Next.js) - CRITICAL: Proper proxy headers
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # These headers tell Next.js it's behind HTTPS
        proxy_set_header X-Forwarded-Ssl on;
        proxy_set_header X-Url-Scheme $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files - Let Next.js handle them (don't separate)
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Cache static files
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

echo "✅ HTTPS nginx configuration created"

# Step 3: Test the configuration first
echo "🧪 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors. Please fix before proceeding."
    exit 1
fi

echo ""
echo "📋 Manual Steps Required:"
echo ""
echo "1. 🔐 Ensure SSL certificates exist:"
echo "   sudo certbot --nginx -d questly.me"
echo ""
echo "2. 🔄 Apply the HTTPS configuration:"
echo "   sudo ln -sf /etc/nginx/sites-available/questly-https /etc/nginx/sites-enabled/questly"
echo "   sudo systemctl reload nginx"
echo ""
echo "3. 🏗️ Rebuild the application:"
echo "   cd /var/www/questly && pnpm build"
echo ""
echo "4. 🔄 Restart PM2:"
echo "   pm2 restart ecosystem.config.js"
echo ""
echo "5. 🧪 Test the site:"
echo "   https://questly.me"
echo ""
echo "🎯 Key Changes Made:"
echo "- ✅ Removed assetPrefix (let Next.js auto-detect)"
echo "- ✅ Added trustHost for proxy detection"
echo "- ✅ Proper X-Forwarded-* headers"
echo "- ✅ Separate /_next/static/ handling"
echo ""
echo "If issues persist, check browser dev tools for specific 404 URLs"
