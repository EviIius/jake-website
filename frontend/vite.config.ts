import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "@", replacement: path.resolve(frontendRoot, "src") },
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    fs: {
      allow: [workspaceRoot],
    },
  },
  build: {
    chunkSizeWarningLimit: 1100,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true,
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
