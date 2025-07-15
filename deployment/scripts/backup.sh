#!/bin/bash

# Database Backup Script for Questly
set -e

BACKUP_DIR="/var/backups/questly"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/questly_backup_$DATE.sql"

echo "💾 Creating database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U questly -d questly > $BACKUP_FILE

# Compress the backup
gzip $BACKUP_FILE

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "🧹 Old backups cleaned up"
echo "📊 Backup size: $(du -h ${BACKUP_FILE}.gz | cut -f1)"
