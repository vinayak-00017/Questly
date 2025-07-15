#!/bin/bash

# Health Check Script for Questly
# Run this to check if all services are running properly

echo "🏥 Questly Health Check"
echo "======================"

# Check if containers are running
echo "📦 Container Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Service Health Checks:"

# Check database
echo -n "Database: "
if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U questly >/dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy"
fi

# Check API
echo -n "API: "
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy"
fi

# Check Web
echo -n "Web: "
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy"
fi

echo ""
echo "💾 Disk Usage:"
df -h /

echo ""
echo "🧠 Memory Usage:"
free -h

echo ""
echo "⚡ Server Uptime:"
uptime

echo ""
echo "🌐 Public IP:"
curl -s http://ipv4.icanhazip.com

echo ""
echo "📊 Docker Stats:"
docker stats --no-stream
