#!/bin/bash

# 🔍 Debug Docker Container Issues
# Run this script on your DigitalOcean droplet to diagnose restart loops

echo "🔍 Debugging Docker Container Issues..."
echo "=====================================\n"

echo "📊 Current Container Status:"
docker ps -a
echo ""

echo "🔴 API Container Logs (Last 30 lines):"
echo "----------------------------------------"
docker logs docker_api_1 --tail=30
echo ""

echo "🔴 Web Container Logs (Last 30 lines):"
echo "----------------------------------------"
docker logs docker_web_1 --tail=30
echo ""

echo "✅ PostgreSQL Container Logs (Last 10 lines):"
echo "-----------------------------------------------"
docker logs docker_postgres_1 --tail=10
echo ""

echo "🐳 Docker Images:"
echo "-----------------"
docker images | grep questly
echo ""

echo "📋 Container Inspect (API):"
echo "----------------------------"
docker inspect docker_api_1 | grep -A 5 -B 5 "ExitCode\|Error\|Status"
echo ""

echo "📋 Container Inspect (Web):"
echo "----------------------------"
docker inspect docker_web_1 | grep -A 5 -B 5 "ExitCode\|Error\|Status"
echo ""

echo "🔗 Network Connectivity:"
echo "-------------------------"
docker network ls
echo ""

echo "💾 Volume Status:"
echo "-----------------"
docker volume ls | grep postgres
echo ""

echo "🔍 Debugging complete!"
echo "📋 Next steps:"
echo "1. Check the logs above for error messages"
echo "2. Look for 'Cannot find module' or 'permission denied' errors"
echo "3. If needed, rebuild and push new Docker images"
