# 🔐 GitHub Secrets Setup Guide

## Required GitHub Repository Secrets

Go to: `https://github.com/vinayak-00017/Questly/settings/secrets/actions`

Add these secrets:

### Database Configuration

```
Name: POSTGRES_DB
Value: questly
```

```
Name: POSTGRES_USER
Value: questlyuser
```

```
Name: POSTGRES_PASSWORD
Value: MySecurePassword123!
```

```
Name: DATABASE_URL
Value: postgresql://questlyuser:MySecurePassword123!@postgres:5432/questly
```

### API Configuration

```
Name: API_URL
Value: http://your-droplet-ip:8080
```

```
Name: FRONTEND_URL
Value: http://your-droplet-ip:3000
```

### Authentication Secrets

```
Name: JWT_SECRET
Value: your-jwt-secret-key-here
```

```
Name: BETTER_AUTH_SECRET
Value: your-better-auth-secret-here
```

```
Name: BETTER_AUTH_URL
Value: http://your-droplet-ip:8080
```

### Google OAuth (if using)

```
Name: GOOGLE_CLIENT_ID
Value: your-google-client-id
```

```
Name: GOOGLE_CLIENT_SECRET
Value: your-google-client-secret
```

### DigitalOcean Configuration

```
Name: DO_HOST
Value: your-droplet-ip-address
```

```
Name: DO_USER
Value: root
```

```
Name: DO_SSH_PRIVATE_KEY
Value: your-ssh-private-key-content
```

```
Name: GITHUB_TOKEN
Value: (automatically provided by GitHub Actions)
```

## How It Works

1. 🐳 **Docker creates PostgreSQL**: No manual installation needed
2. 🔐 **Secrets provide passwords**: Secure, not in code
3. 💾 **Data persists**: Volume storage survives deployments
4. 🚀 **Automatic setup**: Database created on first run

## First Run Behavior

When you first deploy:

- PostgreSQL container downloads and starts
- Database `questly` is created automatically
- User `questlyuser` is created with the password you set
- Tables will be created by your app's migrations
- Data persists for all future deployments

✅ **No manual database setup required on your droplet!**
