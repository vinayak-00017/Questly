// API Configuration for versioned endpoints
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/v1" // Express API (production)
    : "http://localhost:5001"; // Direct connection (development)

export const NEXT_API_URL =
  process.env.NODE_ENV === "production"
    ? "/v2" // Next.js API routes (production)
    : "/api"; // Next.js API routes (development)
