#!/bin/bash

# 🔒 HTTPS Setup Script for Questly
# Run this AFTER your domain DNS is pointing to your droplet

set -e

echo "🔒 Setting up HTTPS for Questly..."

# Check if domain argument is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your domain name"
    echo "Usage: ./setup-https.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "🌐 Domain: $DOMAIN"

# Update server_name in nginx config
echo "📝 Updating Nginx configuration with your domain..."
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/questly

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

# Obtain SSL certificate
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

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
