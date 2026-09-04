import { defineConfig } from "vitest/config";

/**
 * Unit tests only. Playwright E2E specs live in tests/e2e/*.spec.ts and are run
 * separately via `pnpm e2e`, so they must be excluded from the vitest run.
 */
export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/out/**", "**/.next/**", "tests/e2e/**"],
    /**
     * Sin este tope, `pnpm test` MUERE antes de correr un solo test:
     *
     *   FATAL ERROR: Zone Allocation failed - process out of memory
     *
     * Medido el 2026-09-01 en la maquina de Sergio (12 nucleos, 24 GB con ~3,3 GB
     * libres): vitest 4 abre un fork por nucleo, y 12 procesos node arrancando a la
     * vez agotan la memoria disponible durante la COLECCION — el crash cae a los
     * 78 ms con el heap en 5,9 MB, o sea no es un test pesado, es la largada.
     * Cada subcarpeta por separado pasaba, y por eso el rojo parecia un fantasma.
     *
     * Con 4: 30 archivos / 267 tests verdes en 4,3 s. La suite es chica, asi que
     * el paralelismo perdido no cuesta nada y el gate vuelve a existir.
     */
    maxWorkers: 4,
  },
});
