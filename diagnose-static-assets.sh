#!/bin/bash

echo "🔍 Diagnosing static asset issues..."

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📁 Checking Next.js build directory structure:"
echo "Local project (should exist):"
ls -la /home/vinayak/prog/questly/apps/web/.next/ 2>/dev/null || echo "❌ No .next directory in local project"

echo ""
echo "Server project (should exist):"
ls -la /var/www/questly/apps/web/.next/ 2>/dev/null || echo "❌ No .next directory in server project"

echo ""
echo "🧪 Testing local servers directly:"
echo "Next.js on localhost:3000:"
curl -s http://localhost:3000 | head -5 || echo "❌ Cannot connect to Next.js"

echo ""
echo "Express API on localhost:5001:"
curl -s http://localhost:5001/api/health || echo "❌ Cannot connect to Express API"

echo ""
echo "📋 PM2 Process Details:"
pm2 show questly-web

echo ""
echo "📝 Recent PM2 logs for Next.js:"
pm2 logs questly-web --lines 10

echo ""
echo "🔧 Current working directory of PM2 process:"
pm2 describe questly-web | grep "cwd"

echo ""
echo "🌐 Testing static asset directly:"
curl -I http://localhost:3000/_next/static/chunks/webpack-b954f0edc9054b66.js || echo "❌ Static asset not found locally"
