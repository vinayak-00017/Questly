# 🚀 Questly Production Deployment Guide

This guide covers the complete setup for deploying Questly to a DigitalOcean droplet with security, monitoring, and CI/CD.

## 🏗️ Architecture Overview

```
                    Internet
                        │
                   ┌─────────┐
                   │  Nginx  │ (Port 80/443)
                   │ (Proxy) │
                   └─────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │   Web   │   │   API   │   │Database │
    │ (Next)  │   │(Express)│   │(Postgres)│
    │Port 3000│   │Port 3001│   │Port 5432│
    └─────────┘   └─────────┘   └─────────┘
          │             │             │
          └─────────────┼─────────────┘
                    Docker Network
```

## 📋 Prerequisites

- DigitalOcean droplet (2GB+ RAM recommended)
- Domain name pointed to your droplet IP
- SSH access to the server
- GitHub repository with your code

## 🔧 Server Setup

### 1. Initial Server Configuration

```bash
# Update system
apt update && apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose-plugin

# Install essential tools
apt install nginx git ufw fail2ban

# Create application directory
mkdir -p /var/www/questly
cd /var/www/questly

# Clone your repository
git clone https://github.com/YOUR_USERNAME/questly.git .
```

### 2. Security Configuration

```bash
# Setup firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Configure fail2ban
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

## 🗄️ Database Setup

### 1. Copy Configuration Files

```bash
# Copy PostgreSQL configuration
cp postgresql/postgresql.conf /etc/postgresql/15/main/
cp postgresql/pg_hba.conf /etc/postgresql/15/main/
systemctl restart postgresql
```

### 2. Initialize Database

```bash
# Run initialization script
./init-scripts/01-init-db.sh
```

## 🐳 Docker Deployment

### 1. Environment Configuration

Create `/var/www/questly/.env.production`:

```env
# Database
DATABASE_URL=postgresql://questly_user:your_secure_password@localhost:5432/questly_production

# Application
NODE_ENV=production
PORT=3000
API_PORT=3001

# Auth
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-characters
BETTER_AUTH_URL=https://yourdomain.com

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Build and Deploy

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run database migrations
docker-compose -f docker-compose.prod.yml exec api npm run db:migrate

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
```

## 🔍 Monitoring Setup

### 1. Install Monitoring Scripts

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Setup log directories
mkdir -p /var/log/questly
mkdir -p /var/backups/questly
```

### 2. Configure Cron Jobs

```bash
# Add to crontab
crontab -e

# Copy contents from scripts/crontab-template
```

### 3. Setup Log Rotation

```bash
# Copy logrotate configuration
cp scripts/logrotate-questly /etc/logrotate.d/questly
```

## 🔄 CI/CD with GitHub Actions

### 1. Required Secrets

Add these secrets to your GitHub repository:

- `DO_HOST` - Your droplet IP address
- `DO_USER` - SSH username (usually `root`)
- `DO_SSH_PRIVATE_KEY` - Your SSH private key
- `SLACK_WEBHOOK` - Slack webhook for notifications (optional)

### 2. Workflow Files

The repository includes three workflows:

- **Deploy** (`deploy.yml`) - Deploys to production on main branch
- **Test** (`test.yml`) - Runs tests on all pushes/PRs
- **Quality** (`quality.yml`) - Runs linting and security checks

## 🛡️ Security Features

### Database Security

- ✅ Local-only PostgreSQL access
- ✅ Encrypted connections (SCRAM-SHA-256)
- ✅ Restricted user permissions
- ✅ Connection logging
- ✅ Daily automated backups

### Application Security

- ✅ CORS protection
- ✅ Rate limiting
- ✅ Secure authentication
- ✅ Environment variable isolation
- ✅ Docker network isolation

### Server Security

- ✅ UFW firewall configured
- ✅ Fail2ban intrusion prevention
- ✅ SSL/TLS encryption
- ✅ SSH key authentication
- ✅ Regular security updates

## 📊 Monitoring & Alerts

### Health Monitoring

- Service uptime monitoring
- Database connectivity checks
- Resource usage monitoring
- Automatic alerting via Slack/email

### Logging

- Application logs
- Access logs
- Error tracking
- Automatic log rotation

### Backups

- Daily database backups
- 7-day retention policy
- Automated cleanup
- Backup verification

## 🚀 Deployment Commands

### Manual Deployment

```bash
# SSH to server
ssh root@YOUR_DROPLET_IP

# Navigate to app directory
cd /var/www/questly

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec api npm run db:migrate
```

### Automated Deployment

- Push to `main` branch triggers automatic deployment
- Tests run automatically on all PRs
- Quality checks prevent broken deployments

## 🔧 Troubleshooting

### Check Service Status

```bash
# Check all containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Run health check
./scripts/health-check.sh
```

### Database Issues

```bash
# Check database connectivity
docker exec questly-db pg_isready -U questly_user

# View database logs
docker logs questly-db

# Connect to database
docker exec -it questly-db psql -U questly_user -d questly_production
```

### Application Issues

```bash
# Check application logs
docker logs questly-api
docker logs questly-web

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api
```

## 📈 Performance Optimization

### Nginx Optimization

- Gzip compression enabled
- Static file caching
- Request rate limiting
- Buffer size optimization

### Database Optimization

- Connection pooling
- Query optimization
- Index management
- Regular maintenance

### Application Optimization

- Build optimization
- Image compression
- Asset minification
- Code splitting

## 🔄 Maintenance Tasks

### Daily

- ✅ Automated health checks
- ✅ Database backups
- ✅ Log monitoring

### Weekly

- ✅ System updates
- ✅ Log rotation
- ✅ Performance review

### Monthly

- ✅ Security audit
- ✅ Backup verification
- ✅ Capacity planning

---

## 📞 Support

For issues or questions:

1. Check application logs
2. Run health check script
3. Review monitoring alerts
4. Consult this documentation

Your Questly application is now production-ready with enterprise-grade security, monitoring, and automation! 🎉
