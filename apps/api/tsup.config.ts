import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["cjs"], // Use CommonJS format for better Docker compatibility
  outExtension: () => {
    return {
      js: ".js", // Keep .js extension but output CommonJS
    };
  },
  ...options,
}));
