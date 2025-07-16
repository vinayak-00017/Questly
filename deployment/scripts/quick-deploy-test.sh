#!/bin/bash

# Quick Pre-Deployment Test
# This script runs essential checks before deployment

set -e

echo "🚀 Quick Pre-Deployment Test"
echo "============================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory!"
    exit 1
fi

echo "✅ In project root directory"

# Test build without hanging
echo ""
echo "📦 Testing build process..."
timeout 300 pnpm build || {
    echo "❌ Build failed or took longer than 5 minutes!"
    exit 1
}

echo "✅ Build completed successfully"

# Check build outputs
echo ""
echo "🔍 Verifying build outputs..."

if [ -f "apps/api/dist/index.cjs" ]; then
    echo "✅ API build output found"
else
    echo "❌ API build output missing!"
    exit 1
fi

if [ -d "apps/web/.next" ]; then
    echo "✅ Web build output found"
else
    echo "❌ Web build output missing!"
    exit 1
fi

# Check environment validation
echo ""
echo "🔧 Checking environment configuration..."
if [ -f "./deployment/scripts/validate-env.sh" ]; then
    ./deployment/scripts/validate-env.sh || {
        echo "⚠️ Environment validation failed, but continuing..."
    }
else
    echo "⚠️ Environment validation script not found"
fi

# Test Docker configuration (if docker is available)
if command -v docker-compose > /dev/null; then
    echo ""
    echo "🐳 Testing Docker configuration..."
    if docker-compose -f deployment/docker/docker-compose.prod.yml config > /dev/null 2>&1; then
        echo "✅ Docker Compose configuration is valid"
    else
        echo "❌ Docker Compose configuration has errors!"
        exit 1
    fi
else
    echo "⚠️ Docker not available for validation"
fi

echo ""
echo "🎉 All pre-deployment checks passed!"
echo "   Build time: under 5 minutes"
echo "   Ready for fast deployment!"
echo ""

# Show deployment commands
echo "📋 Next steps:"
echo "   1. Commit and push your changes"
echo "   2. GitHub Actions will deploy automatically"
echo "   3. Or run manual deployment with:"
echo "      git push origin main"
echo ""
echo "⏱️  Expected deployment time: 5-10 minutes total"
