#!/bin/bash
set -e

# Create application database if it doesn't exist
echo "Creating Questly database and user..."

# Create user with limited privileges
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create read-only user for monitoring
    CREATE USER questly_monitor WITH PASSWORD '${MONITOR_PASSWORD:-monitor123}';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO questly_monitor;
    GRANT USAGE ON SCHEMA public TO questly_monitor;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO questly_monitor;
    
    -- Create backup user
    CREATE USER questly_backup WITH PASSWORD '${BACKUP_PASSWORD:-backup123}';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO questly_backup;
    GRANT USAGE ON SCHEMA public TO questly_backup;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO questly_backup;
    
    -- Set default privileges for future tables
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO questly_monitor;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO questly_backup;
    
    -- Create indexes for better performance
    -- These will be created after your app creates the tables
    
    EOSQL

echo "Database initialization completed successfully!"
echo "Created monitoring user: questly_monitor"
echo "Created backup user: questly_backup"
