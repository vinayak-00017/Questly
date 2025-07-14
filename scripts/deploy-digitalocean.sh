#!/bin/bash

# DigitalOcean Deployment Script
set -e

echo "🌊 Starting DigitalOcean deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
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
    echo "⚠️  Please update .env file with your actual domain and secrets!"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec api pnpm --filter=api db:migrate

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:8080"
echo "   Health: http://localhost:8080/health"

# Show container status
docker-compose -f docker-compose.prod.yml ps
