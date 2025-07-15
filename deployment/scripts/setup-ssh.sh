#!/bin/bash

# GitHub Actions SSH Setup Guide
# This script helps you set up SSH keys for automated deployment

echo "🔐 GitHub Actions SSH Setup Guide"
echo "================================="
echo ""

echo "This script will help you set up SSH keys for GitHub Actions deployment to DigitalOcean."
echo ""

# Check if SSH keys already exist
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "⚠️  SSH key already exists at ~/.ssh/id_ed25519"
    echo "   If you want to create a new key specifically for this project, use a different name."
    echo ""
fi

# Ask for key name
echo "📝 What would you like to name your SSH key?"
echo "   Suggestion: questly (this will create questly and questly.pub)"
read -p "   Enter key name: " KEY_NAME

if [ -z "$KEY_NAME" ]; then
    KEY_NAME="questly"
    echo "   Using default name: $KEY_NAME"
fi

SSH_KEY_PATH="$HOME/.ssh/$KEY_NAME"

# Generate SSH key if it doesn't exist
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo ""
    echo "🔑 Generating SSH key..."
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "github-actions-$KEY_NAME"
    echo "✅ SSH key generated successfully!"
else
    echo "✅ SSH key already exists at $SSH_KEY_PATH"
fi

echo ""
echo "📋 Next steps for GitHub Actions setup:"
echo ""

echo "1. 📤 Copy the PUBLIC key to your DigitalOcean droplet:"
echo "   Run this command on your LOCAL machine:"
echo "   ssh-copy-id -i $SSH_KEY_PATH.pub your-username@your-droplet-ip"
echo ""

echo "2. 🔐 Add the PRIVATE key to GitHub Secrets:"
echo "   - Go to your GitHub repository"
echo "   - Navigate to Settings > Secrets and variables > Actions"
echo "   - Click 'New repository secret'"
echo "   - Name: DO_SSH_PRIVATE_KEY"
echo "   - Value: Copy the content below:"
echo ""
echo "   ╭─────────────────────────────────────────────────────────────────╮"
cat "$SSH_KEY_PATH"
echo "   ╰─────────────────────────────────────────────────────────────────╯"
echo ""

echo "3. 🏠 Add other required GitHub Secrets:"
echo "   Create these secrets in your GitHub repository:"
echo ""
echo "   Required secrets:"
echo "   - DO_HOST: your-droplet-ip-address"
echo "   - DO_USER: your-droplet-username (usually 'root' or your user)"
echo "   - DATABASE_URL: your-production-database-url"
echo "   - JWT_SECRET: your-jwt-secret"
echo "   - BETTER_AUTH_SECRET: your-auth-secret"
echo "   - API_URL: https://your-api-domain.com"
echo "   - FRONTEND_URL: https://your-frontend-domain.com"
echo ""
echo "   Optional secrets:"
echo "   - GOOGLE_CLIENT_ID: your-google-oauth-client-id"
echo "   - GOOGLE_CLIENT_SECRET: your-google-oauth-secret"
echo "   - POSTGRES_DB: questly"
echo "   - POSTGRES_USER: questly"
echo "   - POSTGRES_PASSWORD: your-secure-db-password"
echo ""

echo "4. 🚀 Test the SSH connection:"
echo "   ssh -i $SSH_KEY_PATH your-username@your-droplet-ip"
echo ""

echo "5. 📁 Prepare your DigitalOcean droplet:"
echo "   Run these commands on your droplet:"
echo ""
echo "   # Update system"
echo "   sudo apt update && sudo apt upgrade -y"
echo ""
echo "   # Install Docker and Docker Compose"
echo "   curl -fsSL https://get.docker.com -o get-docker.sh"
echo "   sudo sh get-docker.sh"
echo "   sudo usermod -aG docker \$USER"
echo ""
echo "   # Install Docker Compose"
echo "   sudo apt install -y docker-compose-plugin"
echo ""
echo "   # Create application directory"
echo "   sudo mkdir -p /var/www/questly"
echo "   sudo chown \$USER:\$USER /var/www/questly"
echo ""
echo "   # Clone your repository"
echo "   cd /var/www"
echo "   git clone https://github.com/your-username/your-repo-name.git questly"
echo "   cd questly"
echo ""

echo "6. ✅ Once everything is set up, push to main branch to trigger deployment!"
echo ""

echo "📚 For more details, see ENVIRONMENT_SETUP.md"
echo ""

echo "🔐 Your SSH key information:"
echo "   Private key: $SSH_KEY_PATH"
echo "   Public key:  $SSH_KEY_PATH.pub"
echo ""

echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "   - Never share your private key"
echo "   - The private key should only be in GitHub Secrets"
echo "   - The public key goes on your server"
echo "   - Keep your SSH keys secure!"

echo ""
echo "🎉 SSH setup guide completed!"
