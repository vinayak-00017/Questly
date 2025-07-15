#!/bin/bash

# DigitalOcean Droplet Deployment Script
set -e

echo "🌊 Starting DigitalOcean deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please run setup-droplet.sh first"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please run setup-droplet.sh first"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cat > .env << EOF
POSTGRES_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
BETTER_AUTH_SECRET=$(openssl rand -base64 64)
POSTGRES_USER=questly
API_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
EOF
    echo "⚠️  Created .env file with default values"
    echo "⚠️  Please update .env file with your actual domain and secrets!"
    echo "⚠️  Example: nano .env"
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main || echo "⚠️  Git pull failed, continuing with local files"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Remove old images to save space
echo "🧹 Cleaning up old Docker images..."
docker system prune -f

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
echo "   This may take a few minutes for the first deployment..."

# Wait for database to be ready
echo "   Waiting for database..."
timeout 60 bash -c 'until docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U questly; do sleep 2; done' || {
    echo "❌ Database failed to start"
    docker-compose -f docker-compose.prod.yml logs postgres
    exit 1
}

# Wait for API to be ready
echo "   Waiting for API..."
timeout 60 bash -c 'until curl -f http://localhost:8080/health >/dev/null 2>&1; do sleep 2; done' || {
    echo "❌ API failed to start"
    docker-compose -f docker-compose.prod.yml logs api
    exit 1
}

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T api sh -c "cd /app && npm run db:migrate" || {
    echo "⚠️  Database migration failed, but continuing..."
}

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is available at:"
echo "   Frontend: http://$(curl -s http://ipv4.icanhazip.com):3000"
echo "   API: http://$(curl -s http://ipv4.icanhazip.com):8080"
echo "   Health Check: http://$(curl -s http://ipv4.icanhazip.com):8080/health"
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📋 Next Steps:"
echo "1. Setup your domain DNS to point to this IP"
echo "2. Configure SSL with: sudo certbot --nginx -d yourdomain.com"
echo "3. Update .env with your production domain"
echo "4. Restart services: docker-compose -f docker-compose.prod.yml restart"
