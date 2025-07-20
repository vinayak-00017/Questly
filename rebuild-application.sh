#!/bin/bash

# Rebuild Questly application with current Node.js version
# Use this script after every push to deploy new changes
# Optimized for minimal downtime

echo "🔧 Rebuilding Questly with Node.js $(node --version)..."
echo "📅 Deploy started at: $(date)"

# Navigate to application directory
cd /var/www/questly

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main || {
    echo "❌ Failed to pull changes from git"
    exit 1
}

# Install/update dependencies (while services are still running)
echo "📦 Installing/updating dependencies with Node.js $(node --version)..."
pnpm install

# Check if .env file exists, if not warn user
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "🔧 Create .env file with proper DATABASE_URL and other settings"
    if [ -f ".env.production.example" ]; then
        echo "📝 You can copy from .env.production.example"
    fi
fi

# Generate database migrations from schema changes (while services are still running)
echo "🔄 Generating database migrations..."
pnpm db:generate || {
    echo "⚠️  Migration generation failed or no changes detected"
}

# Clean previous builds (while services are still running)
echo "🧹 Cleaning previous builds..."
rm -rf apps/web/.next
rm -rf apps/api/dist

# Rebuild applications (while services are still running)
echo "🔨 Building applications..."
pnpm build || {
    echo "❌ Build failed"
    exit 1
}

# NOW start the minimal downtime section
echo "⚡ Starting minimal downtime deployment..."

# Stop PM2 processes → DOWNTIME STARTS
echo "⏹️  Stopping PM2 processes..."
pm2 stop all || echo "No processes to stop"

# Run database migrations (quick operation)
echo "🗄️  Running database migrations..."
pnpm db:migrate || {
    echo "❌ Database migration failed"
    # Try to restart old services if migration fails
    pm2 start ecosystem.config.js || echo "Failed to restart services"
    exit 1
}

# Restart PM2 with rebuilt applications → DOWNTIME ENDS
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js || {
    echo "❌ Failed to start PM2 processes"
    exit 1
}

# Save PM2 configuration
pm2 save

# Run a quick health check
echo "🏥 Running health check..."
sleep 5  # Give services time to start
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://questly.me/api/status 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check returned status: $HEALTH_CHECK"
    echo "🔍 Check logs: pm2 logs"
fi

# Show status
echo "📊 Final Status:"
pm2 status

echo ""
echo "✅ Application rebuilt and deployed successfully!"
echo "📅 Deploy completed at: $(date)"
echo ""
echo "🌐 Your site should now work at:"
echo "   https://questly.me"
echo ""
echo "🔍 Check logs if needed:"
echo "   pm2 logs"
echo ""
echo "🧪 Test the application:"
echo "   curl -I https://questly.me"
echo ""
echo "📊 Monitor processes:"
echo "   pm2 monit"
