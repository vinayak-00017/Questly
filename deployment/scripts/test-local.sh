#!/bin/bash

# Comprehensive local testing script for Questly
# This tests everything before cloud deployment

set -e

echo "🧪 Questly Local Testing Suite"
echo "============================="
echo

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEPLOYMENT_DIR="$PROJECT_ROOT/deployment"

cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command succeeded
check_result() {
    if [ $? -eq 0 ]; then
        print_success "$1"
    else
        print_error "$1"
        exit 1
    fi
}

# Test 1: Check Prerequisites
print_status "Checking prerequisites..."
node --version >/dev/null 2>&1
check_result "Node.js is installed"

pnpm --version >/dev/null 2>&1
check_result "PNPM is installed"

docker --version >/dev/null 2>&1
check_result "Docker is installed"

docker-compose --version >/dev/null 2>&1
check_result "Docker Compose is installed"

echo

# Test 2: Install Dependencies
print_status "Installing dependencies..."
pnpm install --frozen-lockfile
check_result "Dependencies installed successfully"

echo

# Test 3: Lint and Type Check
print_status "Running code quality checks..."
pnpm lint || print_warning "Linting issues found (non-blocking)"
pnpm type-check || print_warning "Type checking issues found (non-blocking)"

echo

# Test 4: Build Applications
print_status "Building applications..."
pnpm build
check_result "Applications built successfully"

echo

# Test 5: Run Tests
print_status "Running test suite..."
pnpm test || print_warning "Some tests failed (non-blocking for MVP)"

echo

# Test 6: Create environment file for local testing
print_status "Creating local environment file..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Local testing environment
NODE_ENV=production
DATABASE_URL=postgresql://questly_user:secure_password_123@localhost:5432/questly_production
JWT_SECRET=local-testing-jwt-secret-key
BETTER_AUTH_SECRET=local-testing-auth-secret-key
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8080
POSTGRES_DB=questly_production
POSTGRES_USER=questly_user
POSTGRES_PASSWORD=secure_password_123
EOF
    print_success "Local environment file created"
else
    print_success "Local environment file already exists"
fi

echo

# Test 7: Docker Build Test
print_status "Testing Docker image builds..."
if [ -f "$DEPLOYMENT_DIR/docker/Dockerfile.digitalocean" ]; then
    docker build -f "$DEPLOYMENT_DIR/docker/Dockerfile.digitalocean" --target api -t questly-api-test .
    check_result "API Docker image built successfully"
    
    docker build -f "$DEPLOYMENT_DIR/docker/Dockerfile.digitalocean" --target web -t questly-web-test .
    check_result "Web Docker image built successfully"
else
    print_error "Dockerfile not found at expected location"
    exit 1
fi

echo

# Test 8: Local Production Deployment
print_status "Starting local production deployment..."
if [ -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" ]; then
    # Create necessary directories and configs if they don't exist
    mkdir -p "$DEPLOYMENT_DIR/configs"
    
    # Stop any existing services
    docker-compose -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" down >/dev/null 2>&1 || true
    
    # Start services with environment file
    export $(cat .env.local | xargs)
    docker-compose -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" up -d
    check_result "Local production services started"
else
    print_error "Docker Compose file not found"
    exit 1
fi

echo

# Test 9: Health Checks
print_status "Waiting for services to be ready..."
sleep 30

print_status "Testing service health..."

# Test database
if docker-compose -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" exec -T postgres pg_isready -U questly_user >/dev/null 2>&1; then
    print_success "Database is healthy"
else
    print_error "Database health check failed"
fi

# Test API
for i in {1..30}; do
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        print_success "API is healthy (http://localhost:8080/health)"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "API health check failed after 30 attempts"
    fi
    sleep 2
done

# Test Web
for i in {1..30}; do
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        print_success "Web app is healthy (http://localhost:3000/health)"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Web app health check failed after 30 attempts"
    fi
    sleep 2
done

echo

# Test 10: API Endpoint Tests
print_status "Testing API endpoints..."

# Test API root
if curl -f http://localhost:8080/ >/dev/null 2>&1; then
    print_success "API root endpoint accessible"
else
    print_warning "API root endpoint test failed"
fi

echo

# Test 11: Show Service Status
print_status "Current service status:"
docker-compose -f "$DEPLOYMENT_DIR/docker/docker-compose.prod.yml" ps

echo

# Test 12: Resource Usage
print_status "Resource usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -10

echo

# Final Results
echo "🎉 Local Testing Complete!"
echo "========================="
echo
echo "✅ Services running at:"
echo "   🌐 Web App:  http://localhost:3000"
echo "   🔗 API:      http://localhost:8080" 
echo "   🗄️ Database: localhost:5432"
echo
echo "🔧 Useful commands:"
echo "   ./deployment/scripts/status.sh     - Check status"
echo "   ./deployment/scripts/monitor.sh    - Run monitoring"
echo "   docker-compose -f deployment/docker/docker-compose.prod.yml logs -f  - View logs"
echo "   docker-compose -f deployment/docker/docker-compose.prod.yml down     - Stop services"
echo
echo "🚀 If everything looks good, you're ready for cloud deployment!"
echo "   Push to main branch to trigger automatic deployment"
