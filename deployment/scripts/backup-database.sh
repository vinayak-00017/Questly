#!/bin/bash

# Backup script for Questly PostgreSQL database
# Run this script daily via cron: 0 2 * * * /var/www/questly/scripts/backup-database.sh

set -e

# Configuration
BACKUP_DIR="/var/backups/questly"
DB_NAME="questly_production"
DB_USER="questly_user"
RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/questly_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create the backup
echo "🗄️ Starting database backup..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    -h localhost \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-password \
    --verbose \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_FILE"

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup completed successfully: $BACKUP_FILE ($BACKUP_SIZE)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Remove old backups
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "questly_backup_*.sql" -mtime +$RETENTION_DAYS -delete

# Log the backup
echo "$(date): Backup completed - $BACKUP_FILE" >> "$BACKUP_DIR/backup.log"

echo "🎉 Backup process completed!"
