#!/bin/bash

echo "🔑 Setting up SSH key for DigitalOcean deployment"
echo "================================================"
echo ""

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ]; then
    echo "📝 No SSH key found. Generating a new one..."
    echo "Enter your email address:"
    read email
    ssh-keygen -t rsa -b 4096 -C "$email"
    echo "✅ SSH key generated!"
else
    echo "✅ SSH key already exists"
fi

echo ""
echo "📋 Your PUBLIC key (add this to your DigitalOcean droplet):"
echo "============================================================"
cat ~/.ssh/id_rsa.pub
echo ""
echo ""
echo "🔐 Your PRIVATE key (add this as DO_SSH_PRIVATE_KEY secret in GitHub):"
echo "======================================================================"
cat ~/.ssh/id_rsa
echo ""
echo ""
echo "📌 Instructions:"
echo "1. Copy the PUBLIC key above and add it to your DigitalOcean droplet"
echo "2. Copy the PRIVATE key above and add it as DO_SSH_PRIVATE_KEY in GitHub secrets"
echo "3. Make sure to copy the ENTIRE private key including BEGIN/END lines"
