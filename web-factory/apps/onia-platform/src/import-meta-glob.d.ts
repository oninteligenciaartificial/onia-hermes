// `import.meta.glob` lo resuelve Vite (vitest) al transformar los tests; el build de Next nunca
// lo ejecuta. Pero `prebuild` corre `tsc --noEmit` sobre todo src/ en el VPS, y ahí pnpm no
// expone `vite/client` (es dependencia transitiva de vitest), así que un
// `/// <reference types="vite/client" />` compila en una máquina con node_modules plano y
// rompe el build de producción. Caso 3-oct: src/app/html-servido.ts lo traía, el build falló
// con TS2688 y la web no se publicó. Este es el tipo mínimo que usan los tests (carga perezosa).
interface ImportMeta {
  glob<T = Record<string, unknown>>(
    pattern: string | readonly string[],
    options?: { eager?: false; import?: string; query?: string | Record<string, string> },
  ): Record<string, () => Promise<T>>;
}
