import { defineConfig } from "vitest/config";

/**
 * Unit tests only. Playwright E2E specs live in tests/e2e/*.spec.ts and are run
 * separately via `pnpm e2e`, so they must be excluded from the vitest run.
 */
export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/out/**", "**/.next/**", "tests/e2e/**"],
  },
});
