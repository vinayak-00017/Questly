#!/bin/bash

# Environment Validation Script
# This script validates that all required environment variables are properly set

set -e

echo "🔍 Validating Environment Configuration..."

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "   Please copy from .env.production.example and fill in your values"
    exit 1
fi

echo "✅ .env.production file exists"

# Source the environment file
set -a
source .env.production
set +a

# Required variables for basic functionality
REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "BETTER_AUTH_SECRET"
    "NODE_ENV"
    "API_URL"
    "FRONTEND_URL"
    "NEXT_PUBLIC_API_URL"
)

# Optional variables (warn if missing)
OPTIONAL_VARS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "SMTP_HOST"
    "SMTP_USER"
    "POSTGRES_DB"
    "POSTGRES_USER"
    "POSTGRES_PASSWORD"
)

echo ""
echo "🔍 Checking required environment variables..."

MISSING_REQUIRED=0
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required variable: $var"
        MISSING_REQUIRED=1
    else
        echo "✅ $var is set"
    fi
done

echo ""
echo "📋 Checking optional environment variables..."

MISSING_OPTIONAL=0
for var in "${OPTIONAL_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "⚠️  Optional variable not set: $var"
        MISSING_OPTIONAL=1
    else
        echo "✅ $var is set"
    fi
done

# Validate specific formats
echo ""
echo "🔍 Validating variable formats..."

# Check DATABASE_URL format
if [[ "$DATABASE_URL" =~ ^postgresql:// ]]; then
    echo "✅ DATABASE_URL has correct PostgreSQL format"
else
    echo "❌ DATABASE_URL should start with postgresql://"
    MISSING_REQUIRED=1
fi

# Check JWT_SECRET length
if [ ${#JWT_SECRET} -ge 32 ]; then
    echo "✅ JWT_SECRET has adequate length (${#JWT_SECRET} characters)"
else
    echo "❌ JWT_SECRET should be at least 32 characters long (current: ${#JWT_SECRET})"
    MISSING_REQUIRED=1
fi

# Check NODE_ENV value
if [ "$NODE_ENV" = "production" ]; then
    echo "✅ NODE_ENV is set to production"
else
    echo "⚠️  NODE_ENV is not set to 'production' (current: $NODE_ENV)"
fi

# Check URLs don't contain localhost
if [[ "$API_URL" == *"localhost"* ]]; then
    echo "⚠️  API_URL contains localhost - this may not work in production"
fi

if [[ "$FRONTEND_URL" == *"localhost"* ]]; then
    echo "⚠️  FRONTEND_URL contains localhost - this may not work in production"
fi

echo ""
echo "🐳 Testing Docker Compose configuration..."

# Test docker-compose config
if command -v docker-compose > /dev/null; then
    if docker-compose -f deployment/docker/docker-compose.prod.yml config > /dev/null 2>&1; then
        echo "✅ Docker Compose configuration is valid"
    else
        echo "❌ Docker Compose configuration has errors"
        echo "   Run: docker-compose -f deployment/docker/docker-compose.prod.yml config"
        MISSING_REQUIRED=1
    fi
else
    echo "⚠️  docker-compose not available for validation"
fi

echo ""
echo "📊 Validation Summary:"
if [ $MISSING_REQUIRED -eq 0 ]; then
    echo "✅ All required environment variables are properly configured!"
    if [ $MISSING_OPTIONAL -gt 0 ]; then
        echo "⚠️  Some optional variables are missing (see above)"
        echo "   These are not required for basic functionality"
    fi
    echo ""
    echo "🚀 Your environment is ready for deployment!"
    exit 0
else
    echo "❌ Missing required environment variables!"
    echo "   Please update .env.production and run this script again"
    exit 1
fi
