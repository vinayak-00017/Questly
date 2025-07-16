import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  clean: true,
  splitting: false,
  sourcemap: false,
  target: "es2020",
  outDir: "dist",
  treeshake: true,
  minify: false,
  tsconfig: "./tsconfig.json",
  keepNames: true,
  // Optimize DTS generation
  dts: {
    resolve: true,
    entry: "./src/index.ts",
    compilerOptions: {
      incremental: false,
      composite: false,
    },
  },
  // Prevent hanging
  silent: false,
});
