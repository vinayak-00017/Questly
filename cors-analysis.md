# CORS Configuration for Split Deployment

## Current CORS Issues:
1. ❌ No HTTPS origins allowed (only HTTP localhost)
2. ❌ No production domain allowed (questly.me)
3. ❌ No Vercel/Netlify domains allowed

## Required CORS Updates for Split Strategy:

### Option 1: Add Production Domains
```typescript
cors({
  origin: [
    "http://localhost:3000",           // Local dev
    "http://127.0.0.1:3000",          // Local dev
    "https://questly.me",             // Production domain
    "https://questly.vercel.app",     // Vercel domain
    "https://questly.netlify.app",    // Netlify domain
    process.env.FRONTEND_URL,         // Dynamic config
  ].filter(Boolean),
  methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
})
```

### Option 2: Environment-Based (Recommended)
```typescript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      "https://questly.me",
      "https://questly.vercel.app", 
      process.env.FRONTEND_URL
    ]
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];

cors({
  origin: allowedOrigins.filter(Boolean),
  methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"], 
  credentials: true,
})
```

## Environment Variables Needed:
- `FRONTEND_URL=https://your-vercel-app.vercel.app`
- `NODE_ENV=production` (on server)

## Frontend API Configuration:
Currently in `/apps/web/config.ts`:
```typescript
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
```

For split deployment, update to:
```typescript
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.questly.me";
```
