#!/bin/bash

# Quick Local Test - Test without Docker first
echo "🧪 Quick Local Test (No Docker)"
echo "==============================="

cd "$(dirname "$0")/../.."

echo "📦 Dependencies check..."
if ! command -v pnpm >/dev/null 2>&1; then
    echo "❌ PNPM not installed"
    exit 1
fi

echo "✅ PNPM installed: $(pnpm --version)"

echo "🔨 Building applications..."
pnpm build

echo "🧪 Running basic tests..."
pnpm lint || echo "⚠️ Lint issues found"
pnpm type-check

echo "🔍 Checking built files..."
if [ -f "apps/api/dist/index.cjs" ]; then
    echo "✅ API built successfully"
else
    echo "❌ API build failed"
fi

if [ -d "apps/web/.next" ]; then
    echo "✅ Web app built successfully"
else
    echo "❌ Web app build failed"
fi

echo "🎉 Local build test completed!"
echo
echo "📋 Next steps:"
echo "1. Fix any build issues"
echo "2. Test with development servers: pnpm dev"
echo "3. Test with Docker: pnpm docker:dev"
echo "4. Deploy to cloud"
