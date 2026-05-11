import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/components/**/*.test.tsx"],
    setupFiles: ["tests/setup.ts"],
  },
});
