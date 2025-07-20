// API Configuration for versioned endpoints
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/v1/api" // Express API (production)
    : "http://localhost:5001"; // Direct connection (development)

export const NEXT_API_URL =
  process.env.NODE_ENV === "production"
    ? "/v2/api" // Next.js API routes (production)
    : "/api"; // Next.js API routes (development)

// Utility to get the correct API base URL
export function getApiBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://questly.me/v1/api";
    console.log("Production API URL:", apiUrl);
    console.log("NEXT_PUBLIC_API_URL env var:", process.env.NEXT_PUBLIC_API_URL);
    return apiUrl;
  }
  return "http://localhost:5001";
}
