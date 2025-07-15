# 🌊 DigitalOcean Droplet Deployment Guide

This guide will help you deploy Questly on a DigitalOcean droplet using Docker.

## 🚀 Quick Setup

### 1. Create a Droplet

- **Size**: Basic Plan ($6/month - 1GB RAM, 1 vCPU, 25GB SSD)
- **OS**: Ubuntu 22.04 LTS
- **Region**: Choose closest to your users
- **Add SSH key** for secure access

### 2. Connect to Your Droplet

```bash
ssh root@your-droplet-ip
```

### 3. Run the Automated Setup

```bash
curl -fsSL https://raw.githubusercontent.com/vinayak-00017/questly/main/scripts/setup-droplet.sh | bash
```

### 4. Configure Environment

```bash
cd /var/www/questly
cp .env.digitalocean.example .env
nano .env  # Edit with your values
```

### 5. Deploy with Docker

```bash
./scripts/deploy-digitalocean.sh
```

## 🔧 Manual Setup (Alternative)

If you prefer manual setup:

### Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Clone and Build

```bash
git clone https://github.com/vinayak-00017/questly.git /var/www/questly
cd /var/www/questly
npm install -g pnpm
pnpm install
pnpm build
```

### Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Domain Setup

### 1. Point Domain to Droplet

- Create A record: `@ -> your-droplet-ip`
- Create A record: `api -> your-droplet-ip`

### 2. Setup SSL Certificate

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## 📊 Monitoring

### Check Service Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs

```bash
# API logs
docker-compose -f docker-compose.prod.yml logs api

# Web logs
docker-compose -f docker-compose.prod.yml logs web

# Database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### Health Checks

- API Health: `http://your-domain.com/health`
- Web Status: `http://your-domain.com`

## 🔄 Updates

### Deploy New Changes

```bash
cd /var/www/questly
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build -d
```

## 💰 Cost Estimate

- **Droplet**: $6/month (Basic)
- **Bandwidth**: Included (1TB)
- **Backups**: $1.20/month (optional)
- **Total**: ~$7-8/month

## 🆘 Troubleshooting

### Common Issues

**Services won't start:**

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

**Database connection issues:**

```bash
# Check database
docker-compose -f docker-compose.prod.yml exec postgres psql -U questly -d questly -c "SELECT 1;"
```

**Build failures:**

```bash
# Clean build
docker system prune -a
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🔐 Security Best Practices

1. **Firewall**: Only open ports 80, 443, and 22
2. **SSH**: Use key-based authentication
3. **SSL**: Always use HTTPS in production
4. **Updates**: Keep system and Docker updated
5. **Backups**: Regular database backups

## 📞 Support

If you encounter issues:

1. Check the logs first
2. Verify environment variables
3. Ensure all services are running
4. Check domain DNS configuration
