// API Configuration for versioned endpoints
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/v1" // Express API (production) - nginx routes /v1/* to Express
    : "http://localhost:5001"; // Direct connection (development)

export const NEXT_API_URL =
  process.env.NODE_ENV === "production"
    ? "/v2" // Next.js API routes (production) - nginx routes /v2/* to Next.js
    : "/api"; // Next.js API routes (development)
