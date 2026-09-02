# Dental Premium — sitio del cliente (catálogo Web Factory)

Sitio Next.js del catálogo de Web Factory. No es una web de Onia: es la web del negocio.

Stack: Next.js 15 · React 19 · motion · GSAP (`package.json`). Salida **standalone**
(`next.config.ts:5`), el mismo modelo de despliegue que ya usa el VPS para onia.com.bo.

## Correr

Esta app es un paquete del **workspace pnpm** de `web-factory` (`pnpm-workspace.yaml`:
`apps/*`). Se instala **una sola vez desde la raíz del workspace**, nunca desde acá:

```bash
cd web-factory
pnpm install --frozen-lockfile

pnpm --filter dental-premium dev        # http://localhost:3000
pnpm --filter dental-premium typecheck  # tsc --noEmit
pnpm --filter dental-premium build && pnpm --filter dental-premium start
```

⚠️ **Nunca `npm install` acá.** Genera un `package-lock.json` que no lee nadie y deja las
dependencias de esta app fuera de `web-factory/pnpm-lock.yaml`. Eso ya costó **nueve días
sin publicar onia.com.bo**: el deploy muere en `pnpm install --frozen-lockfile` con
`ERR_PNPM_OUTDATED_LOCKFILE` — y el sitio que se cae es el de venta, no éste. Si agregás una
dependencia: `pnpm --filter dental-premium add <paquete>`, y commiteá el `pnpm-lock.yaml` de
la raíz junto al `package.json`.

> Este README se creó el 2026-09-02 con lo verificado en los archivos de la app
> (`package.json`, `next.config.ts`). El comportamiento del formulario
> (`src/components/LeadForm.tsx`) **todavía no está documentado acá**: nadie lo midió en esta
> pasada, y escribirlo sin medirlo sería inventarlo.
