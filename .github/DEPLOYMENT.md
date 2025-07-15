# GitHub Secrets Configuration

To deploy Questly to DigitalOcean, you need to configure the following secrets in your GitHub repository:

## Required Secrets

### DigitalOcean Deployment

- `DO_HOST` - Your DigitalOcean droplet IP address
- `DO_USER` - SSH username (usually `root`)
- `DO_SSH_PRIVATE_KEY` - Your SSH private key for accessing the droplet

### Optional Secrets

- `SLACK_WEBHOOK` - Slack webhook URL for deployment notifications
- `CODECOV_TOKEN` - Codecov token for test coverage reporting

## Setting up Secrets

1. **Generate SSH Key Pair** (if you don't have one):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions@yourdomain.com"
   ```

2. **Add Public Key to DigitalOcean Droplet**:

   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub root@YOUR_DROPLET_IP
   ```

3. **Add Secrets to GitHub**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each secret with its value

## Environment Variables on Server

Make sure these environment variables are set on your DigitalOcean droplet in `/var/www/questly/.env.production`:

```env
# Database
DATABASE_URL=postgresql://questly_user:secure_password@localhost:5432/questly_production

# Application
NODE_ENV=production
PORT=3000
API_PORT=3001

# Auth (replace with your actual values)
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=https://yourdomain.com

# OAuth providers (if used)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Additional security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Server Preparation

Before running the GitHub Actions workflow, ensure your DigitalOcean droplet has:

1. **Docker and Docker Compose installed**
2. **Git repository cloned** at `/var/www/questly`
3. **Nginx configured** with the provided config
4. **PostgreSQL configured** with the security settings
5. **Environment file** created with production values

## Workflow Triggers

- **Deploy workflow** (`deploy.yml`): Runs on push to `main` branch
- **Test workflow** (`test.yml`): Runs on push/PR to `main` or `develop`
- **Quality workflow** (`quality.yml`): Runs on push/PR to `main` or `develop`

## Manual Deployment

If you need to deploy manually:

```bash
# On your local machine
ssh root@YOUR_DROPLET_IP

# On the droplet
cd /var/www/questly
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```
