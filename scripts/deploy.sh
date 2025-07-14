#!/bin/bash

# Deployment script for production
set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build all packages
echo "🔨 Building packages..."
pnpm build

# Run database migrations (if needed)
echo "🗄️ Running database migrations..."
cd apps/api
pnpm db:migrate
cd ../..

echo "✅ Deployment complete!"
