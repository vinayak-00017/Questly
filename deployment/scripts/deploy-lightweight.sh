#!/bin/bash

# Emergency lightweight deployment for 1CPU/1GB droplets
# This script minimizes resource usage during deployment

set -e

echo "🚀 Starting lightweight deployment for resource-constrained droplet..."

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=768"

# Navigate to app directory
cd /var/www/questly

# Stop PM2 processes to free memory
echo "🛑 Stopping processes to free memory..."
pm2 stop all || true

# Clean up to free space
echo "🧹 Cleaning up..."
rm -rf node_modules/.cache || true
rm -rf apps/web/.next/cache || true
rm -rf apps/api/dist || true

# Pull latest code (minimal)
echo "📥 Pulling latest code..."
git fetch origin --depth=1
git reset --hard origin/main

# Install only production dependencies, no build tools
echo "📦 Installing production dependencies only..."
pnpm install --frozen-lockfile --prod --ignore-scripts

# For Next.js, we need a few build dependencies
echo "🔧 Installing minimal build dependencies..."
cd apps/web
pnpm add next@latest --save-prod
cd ../..

# Build with memory constraints
echo "🔨 Building with memory constraints..."
cd apps/api
NODE_OPTIONS="--max-old-space-size=512" pnpm build || {
    echo "❌ API build failed, trying with less memory..."
    NODE_OPTIONS="--max-old-space-size=384" pnpm build
}
cd ../..

cd apps/web
NODE_OPTIONS="--max-old-space-size=512" pnpm build || {
    echo "❌ Web build failed, trying with less memory..."
    NODE_OPTIONS="--max-old-space-size=384" pnpm build
}
cd ../..

# Create optimized directory structure
echo "📁 Organizing files for runtime..."
mkdir -p api-dist
cp -r apps/api/dist/* api-dist/
cp -r apps/web/.next ./
cp -r apps/web/public ./

# Remove build dependencies to save space
echo "🗑️ Removing build dependencies..."
cd apps/web
pnpm remove typescript @types/node @types/react @types/react-dom eslint
cd ../..

# Start applications
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save

echo "✅ Lightweight deployment completed!"
echo "📊 Memory usage:"
free -h
echo "💾 Disk usage:"
df -h /var/www/questly
