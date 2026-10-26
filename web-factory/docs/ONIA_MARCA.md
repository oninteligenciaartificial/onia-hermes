# Onia — la marca, en una página

> **Este archivo es el índice. Sin fecha en el nombre a propósito: si algo cambia, se edita acá.**
>
> Nace el 2026-09-07, cuando Sergio Urcullo pidió *«ordena la marca»* al ver que la web
> escribía el logo mal. Lo que se encontró midiendo: **cuatro documentos de marca vivos**,
> **dos declarándose canónicos**, y **49 archivos de logo** de los que el sitio usaba **tres**.
> Es el mismo patrón que llegó a tener cuatro precios vivos del mismo chatbot.

---

## 1. Los tres colores. No hay un cuarto.

| Color | Hex | Para qué |
|---|---|---|
| **Tinta** | `#12100E` | El wordmark. Negro cálido, nunca `#000000` |
| **Claro** | `#F4F6F4` | El wordmark en negativo |
| **Verde señal** | `#00D26A` | **Solo el punto de la i.** Nunca el wordmark |

Verificado dentro de los archivos, no en un doc: `onia-logo.svg` contiene exactamente
`#12100E` + `#00D26A`, y `onia-logo-dark.svg`, `#F4F6F4` + `#00D26A`.

⚠️ El verde **`#3EA639`** que aparece en `ONIA_LOGO_SPEC_20260726.md` y en los assets de
`public/brand/` (sin `v2/`) es **el verde viejo**. Esos archivos están archivados — ver §4.

## 2. Qué archivo va en cada fondo

El wordmark es de **UN** color. Lo único que cambia es el punto.

| Fondo | Wordmark | Punto | Archivo |
|---|---|---|---|
| Blanco / crema / gris claro | tinta | verde | `v2/onia-logo.svg` |
| **Oscuro** (tinta, negro, **verde-900 del hero**) | claro | verde | `v2/onia-logo-dark.svg` |
| **Verde señal** `#00D26A` | tinta | **tinta** — el verde ya es el fondo | `v2/onia-logo-mono.svg` |
| Foto o color medio | claro | verde | `v2/onia-logo-dark.svg`, sobre zona lisa y oscura |
| Una sola tinta (sello, bordado, grabado) | tinta | tinta | `v2/onia-logo-mono.svg` |

**Prohibido:** el wordmark en verde (1,9:1 sobre blanco) · el punto en otro color · punto
verde sobre fondo verde · degradados, sombras, contornos o glow.

## 3. Dónde manda cada documento

| Documento | Estado | Sobre qué manda |
|---|---|---|
| **`ONIA_MARCA_ESTRATEGIA_20260727.md`** | ✅ **VIGENTE** | **Color del logo (§4-bis), el cuadrado, el juego ON·IA, el tile.** Es el que implementa el código |
| `ONIA_BRAND_IDENTITY_2026.md` | ⚠️ vigente **salvo color y logo** | Tipografía, retícula, tono. Se declara «canónico» pero su paleta es anterior al 27-jul y **no** tiene `#00D26A` ni `#12100E` |
| `ONIA_LOGO_SPEC_20260726.md` | 🔴 histórico | La recreación provisional del logo recibido, con el verde viejo `#3EA639` |
| `hermes-content/docs/historial/web-factory/ONIA_BRAND_2026.md` | 🔴 histórico | Ya estaba marcado SUPERSEDED el 25-jul |

**Si dos se contradicen sobre color o logo, gana `ONIA_MARCA_ESTRATEGIA_20260727.md`** — es
el posterior y es el único que coincide con lo que hay dentro de los SVG.

## 4. Los archivos

Todo lo de marca vive en `apps/onia-platform/public/brand/v2/`.

**Los que usa el sitio (3):**

| Archivo | Dónde |
|---|---|
| `v2/onia-logo.svg` | barra scrolleada, cualquier fondo claro |
| `v2/onia-logo-dark.svg` | barra sobre el hero, pie del sitio |
| `v2/favicon.ico` | pestaña del navegador |

**Los que existen para otras superficies** (redes, avatares, app, impresión): iconos
(`onia-icon*.svg/png`, incluida la versión circular y la de esquinas redondeadas), avatares
(`onia-avatar-*.png`), los lockups por rubro (`onia-lockup-*.svg`) y las versiones `@2048`
y `@4000` en `v2/hires/`. **No se borran**: son entregables terminados. Simplemente el sitio
no los necesita.

🔴 **`public/brand/` (sin `v2/`) está ARCHIVADO en `public/brand/_v1/`.** Once archivos con el
verde viejo y, en un caso, con un naranja `#C4441F` que no es de ninguna paleta de Onia.
Tenían **cero** referencias en el código. Se movieron en vez de borrarlos porque estaban
publicados y alguien puede tenerlos linkeados.

## 5. En el código

La barra y el pie sirven el **SVG**, nunca texto dibujado a mano.

> ⚠️ Hasta el 2026-09-07 la barra escribía `Onia` + un punto final en verde. Dos errores
> contra §4-bis: la marca se escribe **`onia` en minúscula**, y el punto verde es **el de la
> i**, no un punto de oración. El archivo correcto existía desde julio y el componente que lo
> sirve (`components/brand-logo.tsx`) también — sólo lo usaba `/v1`, la landing archivada.
> Una marca no se rompe de golpe: se rompe cuando alguien la vuelve a dibujar a mano.
