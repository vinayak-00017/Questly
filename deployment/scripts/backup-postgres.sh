#!/bin/bash

# PostgreSQL Backup Script for Production
# Run this regularly to backup your database

set -e

# Configuration
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DOCKER_COMPOSE_FILE="/var/www/questly/deployment/docker/docker-compose.prod.yml"
ENV_FILE="/var/www/questly/.env.production"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🗄️ Starting PostgreSQL backup..."

# Source environment variables
set -a
source "$ENV_FILE"
set +a

# Create backup
docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres \
  pg_dump -U "${POSTGRES_USER:-questly}" -d "${POSTGRES_DB:-questly}" \
  > "$BACKUP_DIR/questly_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/questly_backup_$DATE.sql"

echo "✅ Backup completed: $BACKUP_DIR/questly_backup_$DATE.sql.gz"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "questly_backup_*.sql.gz" -mtime +7 -delete

echo "🧹 Old backups cleaned up (kept last 7 days)"
