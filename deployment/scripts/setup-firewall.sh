#!/bin/bash

# 🔥 UFW Firewall Setup for Questly Production Server
# Run this script on your DigitalOcean droplet for enhanced security

set -e

echo "🔥 Setting up UFW firewall for Questly..."

# Enable UFW if not already enabled
sudo ufw --force enable

# Default policies: deny all incoming, allow all outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH Access (CRITICAL - Don't lock yourself out!)
echo "🔑 Allowing SSH access..."
sudo ufw allow ssh
sudo ufw allow 22/tcp

# HTTP and HTTPS (for your web application)
echo "🌐 Allowing web traffic..."
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS

# Application ports (only if needed for direct access)
echo "🚀 Allowing application ports..."
sudo ufw allow 3000/tcp  # Next.js web app
sudo ufw allow 8080/tcp  # Express API

# Block PostgreSQL port from external access (extra safety)
echo "🛡️ Blocking PostgreSQL from external access..."
sudo ufw deny 5432/tcp

# Rate limiting for SSH (prevent brute force attacks)
echo "🚨 Setting up rate limiting for SSH..."
sudo ufw limit ssh/tcp

# Docker subnet (allow internal Docker communication)
echo "🐳 Allowing Docker internal communication..."
sudo ufw allow from 172.16.0.0/12 to any port 5432
sudo ufw allow from 10.0.0.0/8 to any port 5432

# Show current status
echo "📊 Current UFW status:"
sudo ufw status verbose

echo "✅ Firewall setup complete!"
echo ""
echo "🔒 Security Summary:"
echo "✅ SSH: Allowed with rate limiting"
echo "✅ HTTP/HTTPS: Allowed (ports 80, 443)"
echo "✅ App ports: Allowed (3000, 8080)"
echo "🛡️ PostgreSQL: Blocked from external access"
echo "🐳 Docker: Internal communication allowed"
echo ""
echo "⚠️  IMPORTANT: Test your SSH connection before logging out!"
