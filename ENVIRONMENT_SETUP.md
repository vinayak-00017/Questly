# Environment Variables Setup Guide

## Overview

This project uses a centralized environment variable approach for production deployments. All environment variables are consolidated into a single `.env.production` file at the root level, rather than scattered across individual app folders.

## Environment Structure

### Development (Local)

- `apps/api/.env` - API-specific environment variables for local development
- `apps/web/.env.local` - Web-specific environment variables for local development
- `.env.local` - Workspace-level variables for local development

### Production

- `.env.production` - Single centralized file containing ALL production environment variables
- No individual app .env files are used in production

## Setting Up Production Environment

### 1. Create the Production Environment File

Copy the template and fill in your values:

```bash
cp .env.production.example .env.production
```

### 2. Required Environment Variables

#### Database Configuration

```bash
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

#### Authentication

```bash
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
BETTER_AUTH_SECRET=another-super-secret-key-for-better-auth
BETTER_AUTH_URL=https://your-api-domain.com
```

#### API Configuration

```bash
NODE_ENV=production
PORT=3001
API_URL=https://your-api-domain.com
```

#### Frontend Configuration

```bash
FRONTEND_URL=https://your-frontend-domain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_AUTH_URL=https://your-api-domain.com
```

#### Optional Services

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email/SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Database Container (for Docker deployments)

```bash
POSTGRES_DB=questly
POSTGRES_USER=questly
POSTGRES_PASSWORD=your-secure-password
```

## Deployment Integration

### Docker Compose

The production Docker Compose file (`deployment/docker/docker-compose.prod.yml`) automatically loads the centralized `.env.production` file:

```yaml
services:
  api:
    env_file:
      - ../../.env.production
  web:
    env_file:
      - ../../.env.production
```

### GitHub Actions

The deployment workflow automatically creates the `.env.production` file on the server using secrets stored in GitHub:

1. Set up the following secrets in your GitHub repository settings:

   - `DATABASE_URL`
   - `JWT_SECRET`
   - `BETTER_AUTH_SECRET`
   - `API_URL`
   - `FRONTEND_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`

2. The deployment script will automatically create the `.env.production` file with these values.

## Security Best Practices

### For Production Secrets

1. **Never commit `.env.production`** to version control - it's included in `.gitignore`
2. **Use strong, randomly generated secrets** for JWT and auth keys
3. **Use environment-specific domains** (don't use localhost in production)
4. **Rotate secrets regularly**

### For Development

1. Keep development secrets separate from production
2. Use different database URLs for dev/prod
3. Use localhost URLs for local development

## Migration from Old Structure

If you previously had environment variables in individual app folders:

1. **Collect all variables** from:

   - `apps/api/.env`
   - `apps/web/.env.local`
   - Any other app-specific .env files

2. **Consolidate into** `.env.production` using the template

3. **Update deployment scripts** to use the centralized file (already done in this project)

4. **Test thoroughly** to ensure all variables are accessible

## Troubleshooting

### Common Issues

1. **"Environment variable not found"**

   - Check that the variable is defined in `.env.production`
   - Verify the variable name matches exactly (case-sensitive)
   - Ensure Docker containers are using the env_file directive

2. **"NEXT*PUBLIC* variables not working"**

   - Next.js public variables must be available at build time
   - Ensure they're included in the Docker build environment
   - Check that the variable name starts with `NEXT_PUBLIC_`

3. **Database connection issues**
   - Verify `DATABASE_URL` format is correct
   - Check that the database is accessible from the application
   - For Docker deployments, ensure the database service is healthy

### Verification Commands

```bash
# Check if environment file exists
ls -la .env.production

# Test Docker Compose with environment file
docker-compose -f deployment/docker/docker-compose.prod.yml config

# Validate environment variables in running container
docker-compose -f deployment/docker/docker-compose.prod.yml exec api env | grep DATABASE_URL
```

## Benefits of Centralized Approach

1. **Simplified deployment** - One file to manage instead of multiple
2. **Consistent configuration** - All services use the same environment setup
3. **Better security** - Centralized secret management
4. **Easier maintenance** - Single point of configuration updates
5. **Docker-friendly** - Clean integration with container orchestration
