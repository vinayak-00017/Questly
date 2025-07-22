import dotenv from "dotenv";

// Centralized environment configuration
// This should be imported once at the top of your application entry points

let isConfigured = false;

export function configureEnvironment() {
  if (isConfigured) {
    return; // Prevent multiple configurations
  }

  // Load environment-specific .env file
  const env = process.env.NODE_ENV || "development";
  console.log(`Loading environment: ${env}`);
  
  // Load environment-specific file first
  dotenv.config({ path: `.env.${env}` });
  
  // Fallback to .env if environment-specific file doesn't exist
  dotenv.config();
  
  isConfigured = true;
  console.log(`Environment configuration loaded for: ${env}`);
}

// Auto-configure when this module is imported
configureEnvironment();