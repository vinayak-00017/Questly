#!/bin/bash

# Quick deployment script for organized Questly structure
# Usage: ./deployment/scripts/quick-deploy.sh

set -e

echo "🚀 Questly Quick Deployment"
echo "=========================="

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEPLOYMENT_DIR="$PROJECT_ROOT/deployment"

echo "📁 Project root: $PROJECT_ROOT"
echo "🐳 Docker files: $DEPLOYMENT_DIR/docker"

# Navigate to project root
cd "$PROJECT_ROOT"

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" up -d --build

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🏥 Running health checks..."
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed"
fi

if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Web health check passed"
else
    echo "❌ Web health check failed"
fi

# Show status
echo "📊 Service status:"
docker-compose -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" ps

echo "🎉 Deployment completed!"
echo "🌐 Web: http://localhost:3000"
echo "🔗 API: http://localhost:8080"
