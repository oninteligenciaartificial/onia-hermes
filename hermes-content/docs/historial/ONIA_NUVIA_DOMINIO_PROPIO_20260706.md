# Nuvia — dominio propio (2026-07-06)

## Qué se hizo

Nuvia (la tienda) ahora tiene su **propio proyecto Vercel y dominio**, separado
del panel `onia-center`, **sin mover ni duplicar código**. El repo y el código
siguen siendo los mismos.

- Proyecto Vercel nuevo: **`nuvia-store`** (mismo team
  `oninteligenciaartificial-8139s-projects`).
- Dominio: **`nuvia-store.vercel.app`** (gratis, provisorio — ver "Siguiente
  paso" abajo para pasar a un dominio propio comprado).
- Repo conectado: el mismo `oninteligenciaartificial/onia-hermes`, rama `main`.
- Root Directory del proyecto: `web-factory/apps/site` (idéntico al proyecto
  `onia-center`).
- Cada push a `main` deploya **ambos** proyectos (`onia-center` y
  `nuvia-store`) a la vez, porque comparten commit/build. No hay paso manual
  de sync.

## Por qué no se separó el repo

Se evaluó el split completo (repo propio + extraer código + partir
`globals.css` + decidir el destino del pipeline de catálogo) y se descartó por
costo/beneficio: ~1.5-2h de migración mecánica para un resultado que, para el
objetivo real ("que Nuvia tenga su cara/dominio propios"), no aportaba nada
que esta alternativa no diera ya. Se puede reconsiderar más adelante si
aparece una razón real para la independencia total (ej. otro equipo va a
tocar solo el código de Nuvia, o el pipeline necesita separarse de onia-hermes
por alguna razón operativa).

Si en el futuro se decide el split completo, el mapa de acoplamiento ya
investigado es:
- El código de Nuvia (`nuvia-store.tsx`, `nuvia-checkout.tsx`, `nuvia-cart.ts`,
  `nuvia-order.ts`, `nuvia-commerce.ts`, `nuvia-data.ts`) **no importa nada**
  de `onia-center`/`vendedores`/paquetes del workspace — solo Next/React/
  lucide-react. Extraíble limpio.
- El middleware de auth (`src/middleware.ts`) solo aplica a `/onia-center/*`
  — Nuvia ya es independiente de esa lógica.
- `globals.css` es compartido (~4200 líneas, ~75% es de Nuvia) — habría que
  partirlo.
- El pipeline de catálogo (8 scripts en `harvester/product/`, ver
  `nuvia.context.md`) es lo más caro de migrar/duplicar — la recomendación,
  si se hace el split, es dejarlo en onia-hermes y sincronizar `nuvia.json` +
  assets al repo nuevo, no duplicar scraping/Python.

## Cómo funciona el enrutamiento por dominio

Antes, la ruta raíz (`src/app/page.tsx`) siempre redirigía a `/onia-center`
sin condición — si se le hubiera puesto un dominio propio a Nuvia sin tocar
esto, la tienda habría mostrado el panel interno (detrás de login) en la
home. Se corrigió para que dependa del host:

```ts
// src/app/page.tsx
const host = (await headers()).get("host") || "";
if (host.includes("onia-center")) {
  redirect("/onia-center");
}
redirect("/nuvia");
```

Cualquier dominio que **no** contenga `onia-center` en el host cae a `/nuvia`.
Esto incluye `nuvia-store.vercel.app` y cualquier dominio propio futuro que se
agregue al proyecto `nuvia-store`. Si `onia-center` alguna vez suma un dominio
propio que no contenga la palabra "onia-center", hay que revisar esta
heurística (está comentada en el archivo).

Verificado en producción (`curl` con distintos `Host`):

| Host | Resultado |
|---|---|
| `onia-center.vercel.app` | → `/onia-center` (sin cambios) |
| `onia-center-git-main-*.vercel.app` (previews) | → `/onia-center` (sin cambios) |
| `nuvia-store.vercel.app` | → `/nuvia` (nuevo) |
| cualquier otro host | → `/nuvia` |

## Siguiente paso — dominio propio comprado

Cuando Sergio compre un dominio real para Nuvia (ej. `nuvia.com.bo`):
1. Agregarlo en el dashboard de Vercel al proyecto `nuvia-store` (o vía MCP/API
   `add_domain` si se automatiza).
2. Configurar los DNS del dominio apuntando a Vercel (registros que Vercel
   indica al agregarlo).
3. Nada de código cambia — el redirect por host ya cubre "cualquier host que
   no sea onia-center".

## Qué NO cambió (sigue en onia-hermes, sin tocar)

- Pipeline completo de catálogo (`harvester/product/*`, scripts `nuvia:*` en
  `package.json`).
- `data/clients/nuvia.json` + `nuvia.assets/**` (fuente de verdad).
- Runbooks: `NUVIA_PAYMENT_SYSTEM.md`, `NUVIA_PRICE_AUTOMATION.md`,
  `NUVIA_LOCAL_PREVIEW_RUNBOOK.md`, `nuvia.context.md`.
- Migraciones de Supabase (`web_factory` schema).
- El checkout real (`/nuvia/checkout`, ver
  `docs/superpowers/specs/2026-07-05-nuvia-checkout-envios-design.md` y el
  plan asociado) — vive en el mismo código, ahora sirviendo desde dos dominios.

## Fix relacionado en la misma sesión — video de fondo

El hero video de Nuvia (`nuvia-store.tsx`, hook `useDeferredHeroVideo`) tenía
un gate por `prefers-reduced-motion` sin fallback: en máquinas con las
animaciones del sistema desactivadas (confirmado en la máquina de desarrollo:
`AnimationsEnabled=False` en el registro de Windows), el navegador reporta esa
preferencia y el video nunca cargaba — solo se veía el poster estático, para
siempre. Se sacó ese gate (se mantiene el chequeo de `saveData` para ahorro de
datos real), ya que es un clip mudo y decorativo sin parpadeos — práctica
común en sitios como Apple/Stripe para hero videos ambientales.
