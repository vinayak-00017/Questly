#!/bin/bash

# Comprehensive health monitoring script for Questly services
# Run this script every 5 minutes via cron: */5 * * * * /var/www/questly/scripts/monitor.sh

set -e

# Configuration
LOG_FILE="/var/log/questly/health.log"
ALERT_EMAIL="admin@yourdomain.com"
API_URL="http://localhost:3001/health"
WEB_URL="http://localhost:3000"
SLACK_WEBHOOK="$SLACK_WEBHOOK_URL"  # Set this environment variable

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to send alert
send_alert() {
    local service=$1
    local status=$2
    local message="🚨 ALERT: $service is $status on $(hostname)"
    
    log "ALERT: $service $status"
    
    # Send Slack notification if webhook is configured
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
    
    # Send email if mail is configured
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "Questly Service Alert" "$ALERT_EMAIL" || true
    fi
}

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local timeout=${3:-10}
    
    if curl -f -m "$timeout" "$url" >/dev/null 2>&1; then
        log "✅ $service_name is healthy"
        return 0
    else
        log "❌ $service_name is unhealthy"
        send_alert "$service_name" "DOWN"
        return 1
    fi
}

# Function to check Docker container
check_container() {
    local container_name=$1
    
    if docker ps --filter "name=$container_name" --filter "status=running" | grep -q "$container_name"; then
        log "✅ Container $container_name is running"
        return 0
    else
        log "❌ Container $container_name is not running"
        send_alert "Container $container_name" "DOWN"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    if docker exec questly-db pg_isready -U questly_user >/dev/null 2>&1; then
        log "✅ Database is accessible"
        return 0
    else
        log "❌ Database is not accessible"
        send_alert "PostgreSQL Database" "DOWN"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    local threshold=90
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt "$threshold" ]; then
        log "✅ Disk usage: ${usage}%"
        return 0
    else
        log "⚠️ Disk usage: ${usage}% (above ${threshold}% threshold)"
        send_alert "Disk Space" "CRITICAL (${usage}%)"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    local threshold=90
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ "$usage" -lt "$threshold" ]; then
        log "✅ Memory usage: ${usage}%"
        return 0
    else
        log "⚠️ Memory usage: ${usage}% (above ${threshold}% threshold)"
        send_alert "Memory Usage" "HIGH (${usage}%)"
        return 1
    fi
}

# Main health check routine
log "🏥 Starting comprehensive health check..."

# Check Docker containers
check_container "questly-web"
check_container "questly-api"
check_container "questly-db"
check_container "questly-nginx"

# Check service endpoints
check_service "API" "$API_URL"
check_service "Web App" "$WEB_URL"

# Check database
check_database

# Check system resources
check_disk_space
check_memory

log "🏥 Health check completed"

# Rotate log file if it gets too large (>10MB)
if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0) -gt 10485760 ]; then
    mv "$LOG_FILE" "${LOG_FILE}.old"
    log "🔄 Log file rotated"
fi
