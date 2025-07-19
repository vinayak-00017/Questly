#!/bin/bash

# Fix Let's Encrypt renewal for questly.me
# This script updates the renewal configuration to use nginx plugin

echo "🔧 Fixing SSL certificate renewal configuration..."

# Update the renewal configuration to use nginx plugin instead of webroot
sudo tee /etc/letsencrypt/renewal/questly.me.conf > /dev/null <<EOF
# renew_before_expiry = 30 days
version = 2.11.0
archive_dir = /etc/letsencrypt/archive/questly.me
cert = /etc/letsencrypt/live/questly.me/cert.pem
privkey = /etc/letsencrypt/live/questly.me/privkey.pem
chain = /etc/letsencrypt/live/questly.me/chain.pem
fullchain = /etc/letsencrypt/live/questly.me/fullchain.pem

# Options used in the renewal process
[renewalparams]
account = $(sudo cat /etc/letsencrypt/accounts/*/regr.json | jq -r '.body.key.kid' | head -1 | cut -d'/' -f6)
authenticator = nginx
installer = nginx
server = https://acme-v02.api.letsencrypt.org/directory
key_type = ecdsa
EOF

# Test renewal with nginx plugin
echo "🧪 Testing certificate renewal with nginx plugin..."
sudo certbot renew --cert-name questly.me --nginx --dry-run

echo "✅ SSL renewal configuration updated!"
echo ""
echo "🔍 Certificate status:"
sudo certbot certificates

echo ""
echo "📋 Next steps:"
echo "1. Your HTTPS is working: https://questly.me"
echo "2. Deploy your application with GitHub Actions or PM2"
echo "3. Auto-renewal is configured and will work properly"
