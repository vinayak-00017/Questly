#!/bin/bash

echo "🔄 Reverting to working HTTP configuration..."

# Stop PM2 processes
pm2 stop ecosystem.config.js

# Create simple HTTP-only nginx config (like it was before)
sudo tee /etc/nginx/sites-available/questly > /dev/null <<'EOF'
server {
    listen 80;
    server_name questly.me;

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
    }

    # Main application
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
    }
}
EOF

# Remove assetPrefix from Next.js config
cd /var/www/questly
sed -i 's/assetPrefix: process.env.NODE_ENV === "production" ? "https:\/\/questly.me" : undefined,/\/\/ assetPrefix removed for HTTP/' apps/web/next.config.ts

# Rebuild without HTTPS complications
pnpm build

# Restart services
sudo nginx -t && sudo systemctl reload nginx
pm2 start ecosystem.config.js

echo "✅ Reverted to HTTP. Test at http://questly.me"
