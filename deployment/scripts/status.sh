#!/bin/bash

# Show current project status with organized structure
echo "🏆 Questly Project Status"
echo "========================"
echo

echo "📁 Project Structure:"
echo "├── 📱 apps/"
echo "│   ├── api/     (Express.js backend)"
echo "│   └── web/     (Next.js frontend)"
echo "├── 📦 packages/ (Shared libraries)"
echo "├── 🚀 deployment/"
echo "│   ├── docker/   (Docker configurations)"
echo "│   ├── scripts/  (Automation scripts)"
echo "│   ├── configs/  (Service configurations)"
echo "│   └── docs/     (Deployment documentation)"
echo "└── 🔧 .github/   (CI/CD workflows)"
echo

if command -v docker >/dev/null 2>&1; then
    echo "🐳 Docker Status:"
    if [ -f "deployment/docker/docker-compose.prod.yml" ]; then
        docker-compose -f deployment/docker/docker-compose.prod.yml ps 2>/dev/null || echo "Services not running"
    else
        echo "Docker Compose file not found"
    fi
    echo
fi

echo "📦 Package Info:"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "PNPM: $(pnpm --version 2>/dev/null || echo 'Not installed')"
echo "Docker: $(docker --version 2>/dev/null || echo 'Not installed')"
echo

echo "🚀 Available Commands:"
echo "pnpm dev              - Start development servers"
echo "pnpm build            - Build for production" 
echo "pnpm test             - Run test suites"
echo "./deployment/scripts/quick-deploy.sh - Deploy locally"
echo

echo "📚 Documentation:"
echo "README.md                              - Main project docs"
echo "PROJECT_STRUCTURE.md                   - Code organization"
echo "deployment/docs/DEPLOYMENT.md          - Production setup"
echo ".github/DEPLOYMENT.md                  - GitHub Actions setup"
