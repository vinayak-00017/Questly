# Email Setup Guide for Forgot Password Functionality

This guide explains how to configure email sending for the forgot password feature in Questly.

## Overview

The forgot password functionality has been implemented with support for multiple email providers:

1. **Console** (Development) - Logs emails to console
2. **Nodemailer** (SMTP) - Works with Gmail, Outlook, and custom SMTP servers
3. **Resend** - Modern email service with great deliverability

## Configuration

Set the `EMAIL_PROVIDER` environment variable to choose your email service:

```bash
EMAIL_PROVIDER=console    # For development
EMAIL_PROVIDER=nodemailer # For SMTP
EMAIL_PROVIDER=resend     # For Resend service
```

## Option 1: Console (Development)

Perfect for development and testing. Emails are logged to the console instead of being sent.

```bash
EMAIL_PROVIDER=console
```

No additional configuration needed. Reset URLs will be displayed in the server console.

## Option 2: Nodemailer (SMTP)

Works with any SMTP server including Gmail, Outlook, and custom servers.

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"

3. Configure environment variables:

```bash
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Outlook/Hotmail Setup

```bash
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

### Custom SMTP Server

```bash
EMAIL_PROVIDER=nodemailer
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

## Option 3: Resend (Recommended for Production)

Resend is a modern email service with excellent deliverability and developer experience.

### Setup Steps

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Get your API key from the dashboard

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=noreply@yourdomain.com
```

### Domain Verification

For production, you'll need to verify your domain:
1. Add DNS records provided by Resend
2. Wait for verification (usually a few minutes)
3. Update `RESEND_FROM` to use your verified domain

## Installing Dependencies

The email functionality requires additional packages. Install them based on your chosen provider:

### For Nodemailer:
```bash
cd apps/api
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

### For Resend:
```bash
cd apps/api
pnpm add resend
```

## Email Template

The system includes a beautiful, responsive email template with:
- Questly branding and theming
- Clear call-to-action button
- Security warnings
- Fallback text version
- Mobile-responsive design

## Testing

1. Start the development server:
```bash
pnpm dev
```

2. Navigate to `/forgot-password`
3. Enter an email address
4. Check the console (for console provider) or your email inbox

## Security Features

- Reset tokens expire after 1 hour
- Rate limiting prevents abuse
- Secure token generation
- HTTPS-only reset links in production

## Troubleshooting

### Gmail "Less secure app access" Error
- Use App Passwords instead of your regular password
- Ensure 2FA is enabled

### Emails going to spam
- Verify your domain with your email provider
- Use a dedicated sending domain
- Consider using Resend for better deliverability

### SMTP Connection Errors
- Check firewall settings
- Verify SMTP credentials
- Try different ports (25, 465, 587)

## Production Recommendations

1. **Use Resend or a dedicated email service** for better deliverability
2. **Verify your domain** to avoid spam filters
3. **Monitor email delivery** and bounce rates
4. **Set up proper SPF, DKIM, and DMARC records**
5. **Use environment-specific configurations**

## Environment Variables Summary

```bash
# Required
EMAIL_PROVIDER=console|nodemailer|resend

# For Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# For Resend
RESEND_API_KEY=re_your_api_key
RESEND_FROM=noreply@yourdomain.com
```

## Next Steps

1. Choose your email provider
2. Configure environment variables
3. Install required dependencies
4. Test the functionality
5. Deploy to production with proper domain verification

The forgot password functionality is now ready to use with your chosen email provider!