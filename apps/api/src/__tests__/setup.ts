// Test setup for API tests
import "dotenv/config";
import { jest, afterEach, afterAll } from "@jest/globals";

// Set test environment
process.env.NODE_ENV = "test";

// Prevent database connections in tests unless explicitly needed
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";

// Mock external services that might cause hanging
jest.mock("node-cron", () => ({
  schedule: jest.fn(() => ({
    stop: jest.fn(),
    destroy: jest.fn(),
  })),
}));

// Set shorter timeouts for tests
jest.setTimeout(30000);

// Clean up after each test
afterEach(async () => {
  // Add any cleanup logic here
});

// Global test teardown
afterAll(async () => {
  // Force exit to prevent hanging
  await new Promise(resolve => setTimeout(resolve, 100));
});
