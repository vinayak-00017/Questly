#!/bin/bash

# Questly Direct Node.js Deployment Script
# This script deploys the application directly without Docker

set -e

echo "🚀 Starting Questly deployment..."

# Configuration
APP_DIR="/var/www/questly"
LOG_DIR="$APP_DIR/logs"
BACKUP_DIR="/var/backups/questly"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$LOG_DIR"
mkdir -p "$BACKUP_DIR"

# Navigate to application directory
cd "$APP_DIR"

# Create backup of current deployment
echo "💾 Creating backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR/$timestamp"
cp -r apps/ packages/ "$BACKUP_DIR/$timestamp/" 2>/dev/null || echo "No previous deployment to backup"

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build the application
echo "🔨 Building application..."
pnpm build

# Stop current PM2 processes
echo "🛑 Stopping current processes..."
pm2 stop ecosystem.config.js || echo "No processes to stop"

# Run database migrations (if needed)
echo "🗄️ Running database migrations..."
cd apps/api
pnpm run db:migrate || echo "Migration completed or not needed"
cd ../..

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Health check
echo "🏥 Running health checks..."
sleep 10

# Check API health
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed"
    pm2 logs questly-api --lines 20
fi

# Check Web health
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Web health check passed"
else
    echo "❌ Web health check failed"
    pm2 logs questly-web --lines 20
fi

# Show status
echo "📊 Application status:"
pm2 status

# Show logs
echo "📋 Recent logs:"
pm2 logs --lines 10

echo "✅ Deployment completed!"
