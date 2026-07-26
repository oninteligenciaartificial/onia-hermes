# Carril Arthur — Landing publica de DentalGest

## Limites del carril (REGLA DURA)

Este es TU carril. Trabajas SOLO dentro de `web-factory/apps/dentalgest-landing/`. Prohibido tocar: `apps/site`, el repo DentaGest, `templates/`, `harvester/`, los 4 archivos raiz de web-factory (`next.config.ts`, `layout.tsx`, `globals.css`, `package.json` de `apps/site`).

## Objetivo

Landing publica de DentalGest: credibilidad para cerrar warm leads.

Estructura minima de la pagina:

1. **Hero** — que es DentalGest, para quien.
2. **Que resuelve** — factura SIAT + agenda + cobro + agentes 24/7.
3. **3 planes en Bs** — PLACEHOLDER hasta S1 (no inventar precios finales; marcar como placeholder).
4. **Screenshots reales del sistema** — nunca mockups falsos.
5. **CTA WhatsApp click-to-chat**.
6. **Footer**.

- El boton principal apunta a la app: usar `href` placeholder `APP_URL` hasta tener la URL real.
- Responsive verificado en 375 / 768 / 1440.
- Light y dark intencionales (ambos temas se disenan, ninguno sale "por defecto").

## Antes de disenar

- Cargar la skill `impeccable` + la galeria/tokens de web-factory.
- Exigir >= 4 Required Qualities (nada generico, nada template-looking).

## Prohibido

- Inventar cifras de clientes/casos.
- Prometer SLA.
- Gastar en plataformas/creditos externos.
- Chatbot pago (el click-to-chat simple SI va; el chatbot IA es add-on pago y NO entra en la landing).

## Gates (antes de dar por terminado)

- `npx tsc --noEmit` verde EN ESTA APP.
- Build verde (`pnpm build` dentro de esta app).
- Responsive verificado (375 / 768 / 1440).

## Al terminar (REGLA DURA)

Al terminar: gates + commit en tu rama + avisar a Sergio con el link — y PARAR. No avanzar a otro trabajo hasta nuevo aviso.

## Como correr

```bash
# desde web-factory/ (workspace pnpm)
pnpm install
pnpm --filter dentalgest-landing dev

# o desde esta carpeta
cd apps/dentalgest-landing
pnpm dev          # dev server
pnpm typecheck    # tsc --noEmit
pnpm build        # build de produccion
```
