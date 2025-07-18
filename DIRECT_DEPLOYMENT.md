# Direct Node.js Deployment Guide

This guide explains how to deploy Questly directly on a DigitalOcean droplet without Docker.

## Advantages of Direct Deployment

- ✅ **Faster**: No Docker overhead or build complexity
- ✅ **Simpler**: Direct process management with PM2
- ✅ **Reliable**: No module resolution issues or container networking
- ✅ **Easier debugging**: Direct access to logs and processes
- ✅ **Resource efficient**: Lower memory usage

## Prerequisites

- Ubuntu 22.04 DigitalOcean droplet (1GB+ RAM recommended)
- Domain name (optional but recommended)
- SSH access to the droplet

## Initial Server Setup

1. **Run the setup script on your droplet:**
```bash
# On your DigitalOcean droplet
wget https://raw.githubusercontent.com/vinayak-00017/Questly/main/deployment/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

2. **Configure environment variables:**
```bash
cd /var/www/questly
cp .env.example .env
nano .env  # Update with your actual values
```

3. **Update nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/questly
# Replace 'your-domain.com' with your actual domain
sudo nginx -t && sudo systemctl reload nginx
```

4. **Start the applications:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions to enable auto-start
```

## GitHub Secrets Setup

**IMPORTANT**: You must configure these secrets before the deployment workflow will work.

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

### Required Secrets:

1. **`DO_HOST`** 
   - Value: Your DigitalOcean droplet's IP address (e.g., `123.456.789.012`)
   - Find this in your DigitalOcean dashboard under Droplets

2. **`DO_USER`**
   - Value: SSH username (usually `root` for DigitalOcean droplets)
   - If you created a non-root user, use that username instead

3. **`DO_SSH_PRIVATE_KEY`**
   - Value: Your private SSH key content (the entire key including headers)
   - This should be the private key that matches the public key you added to your droplet
   - Include the full key from `-----BEGIN OPENSSH PRIVATE KEY-----` to `-----END OPENSSH PRIVATE KEY-----`

### How to get your SSH key:

```bash
# On your local machine, display your private key:
cat ~/.ssh/id_rsa

# Or if you created a specific key for the droplet:
cat ~/.ssh/your_droplet_key

# Copy the ENTIRE output (including the BEGIN/END lines) and paste as the secret value
```

### SSH Key Setup for DigitalOcean:

If you haven't set up SSH keys yet:

```bash
# Generate a new SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy your public key to the droplet
ssh-copy-id root@your-droplet-ip

# Or manually add the public key to the droplet
cat ~/.ssh/id_rsa.pub
# Copy this output and add it to /root/.ssh/authorized_keys on your droplet
```

## Deployment Process

Every push to the `main` branch will:

1. ✅ Run tests and build the project
2. 🚀 SSH into your droplet
3. 📥 Pull the latest code
4. 📦 Install dependencies
5. 🔨 Build the applications
6. ⚡ Restart PM2 processes

## Managing Your Applications

### PM2 Commands
```bash
pm2 status                 # Check process status
pm2 logs                   # View all logs
pm2 logs questly-api       # View API logs only
pm2 logs questly-web       # View web logs only
pm2 restart all            # Restart all processes
pm2 stop all               # Stop all processes
pm2 delete all             # Delete all processes
```

### Database Management
```bash
# Access PostgreSQL
sudo -u postgres psql

# Connect to your database
\c questly

# Run migrations (if you have them)
cd /var/www/questly/apps/api
pnpm db:migrate
```

### Nginx Management
```bash
sudo systemctl status nginx    # Check nginx status
sudo systemctl reload nginx    # Reload configuration
sudo nginx -t                  # Test configuration
sudo tail -f /var/log/nginx/access.log  # View access logs
```

## File Structure

```
/var/www/questly/
├── apps/
│   ├── api/                # Express.js API
│   └── web/                # Next.js web app
├── deployment/
│   ├── configs/
│   │   ├── nginx.conf      # Nginx reverse proxy config
│   │   └── ecosystem.config.js  # PM2 configuration
│   └── scripts/
│       ├── setup-server.sh # Initial server setup
│       └── deploy.sh       # Deployment script
└── .env                    # Environment variables
```

## SSL Setup (Optional)

To enable HTTPS with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring

- **Application logs**: `pm2 logs`
- **Nginx logs**: `/var/log/nginx/`
- **System logs**: `journalctl -f`
- **Resource usage**: `htop` or `pm2 monit`

## Troubleshooting

### Application won't start
```bash
pm2 logs                   # Check for errors
cd /var/www/questly
pnpm build                 # Rebuild manually
```

### Database connection issues
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"  # List databases
```

### Nginx issues
```bash
sudo nginx -t              # Test configuration
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## Rollback

If something goes wrong, you can quickly rollback:

```bash
cd /var/www/questly
git log --oneline -5       # See recent commits
git reset --hard <commit-hash>  # Rollback to specific commit
pnpm install --frozen-lockfile --prod
pnpm build
pm2 restart all
```

This deployment approach is much simpler and more reliable than Docker for most use cases!
