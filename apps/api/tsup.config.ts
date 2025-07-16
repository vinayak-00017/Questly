import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["esm"], // Use ESM format to match package.json type: "module"
  outExtension: () => {
    return {
      js: ".js", // Ensure .js extension for ESM
    };
  },
  ...options,
}));
