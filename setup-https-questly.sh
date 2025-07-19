#!/bin/bash

# HTTPS Setup Script for Questly
# Domain: questly.me

set -e

DOMAIN="questly.me"

echo "🔒 Setting up HTTPS for $DOMAIN..."

# Check if we're in the right directory
if [ ! -f "deployment/configs/nginx-https-fixed.conf" ]; then
    echo "❌ Error: Please run this script from the questly project root directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Check prerequisites
if ! command -v nginx &> /dev/null; then
    echo "❌ Error: Nginx is not installed"
    echo "Please run the droplet setup script first: ./deployment/scripts/setup-droplet.sh"
    exit 1
fi

if ! command -v certbot &> /dev/null; then
    echo "❌ Error: Certbot is not installed"
    echo "Please run the droplet setup script first: ./deployment/scripts/setup-droplet.sh"
    exit 1
fi

echo "🌐 Domain: $DOMAIN"

# Step 1: Setup HTTP-only configuration first (for Let's Encrypt validation)
echo "📝 Setting up temporary HTTP configuration..."
sudo tee /etc/nginx/sites-available/questly > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Create Let's Encrypt webroot directory
sudo mkdir -p /var/www/html

# Enable the site
echo "🔗 Enabling HTTP site..."
sudo ln -sf /etc/nginx/sites-available/questly /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Reload nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Test if domain resolves to this server
echo "🔍 Checking if domain resolves to this server..."
DOMAIN_IP=$(dig +short $DOMAIN)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️  Warning: Domain $DOMAIN resolves to $DOMAIN_IP but this server is $SERVER_IP"
    echo "Please ensure your domain's DNS A record points to $SERVER_IP"
    echo "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Exiting. Please update your DNS first."
        exit 1
    fi
fi

# Step 2: Obtain SSL certificate
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot certonly --webroot -w /var/www/html -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Step 3: Setup HTTPS configuration with the obtained certificates
echo "📝 Setting up HTTPS configuration..."
sudo cp deployment/configs/nginx-https-fixed.conf /etc/nginx/sites-available/questly
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/questly

# Test nginx configuration
echo "🧪 Testing HTTPS configuration..."
sudo nginx -t

# Reload nginx with HTTPS
echo "🔄 Reloading Nginx with HTTPS..."
sudo systemctl reload nginx

# Enable auto-renewal
echo "⏰ Enabling automatic certificate renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test auto-renewal
echo "🧪 Testing certificate renewal..."
sudo certbot renew --dry-run

echo "✅ HTTPS setup completed!"
echo ""
echo "🎉 Your application is now available at:"
echo "   https://$DOMAIN"
echo ""
echo "🔒 SSL Certificate info:"
sudo certbot certificates

echo ""
echo "🔍 Useful HTTPS commands:"
echo "   - sudo certbot certificates           # View certificate status"
echo "   - sudo certbot renew                 # Manual renewal"
echo "   - sudo systemctl status certbot.timer # Check auto-renewal status"
echo "   - sudo nginx -t                      # Test Nginx config"
