# Cola — carril `tendencias`

Rama `claude/tendencias`. Zona: `hermes-content/docs/research/**` y
`hermes-content/references/tendencias/**`.

**Producto del carril:** recetas ejecutables de formato, con fuente pública. No informes.
Contrato y estado del inventario: [`references/tendencias/README.md`](../../references/tendencias/README.md).

## Ahora

1. **Mirar la PIEZA VISUAL de los ads del rubro, no sólo su texto.** La Biblioteca de Anuncios
   muestra el video/imagen de cada anuncio y eso todavía no se miró: la receta de gancho cubre
   el copy y nada más. Empezar por los 6 anuncios ya identificados (los `Library ID` están en
   la receta) — de ahí sale el punto 2.
2. **Receta de reel**: primeros 3 segundos, cada cuántos segundos cambia el plano, y el cierre.
   **Ya no está bloqueado por falta de fuente**: los ads en video de la Biblioteca son piezas
   del rubro que alguien está pagando hoy. Falta resolver cómo verlas (`--dump-dom` da la ficha
   y el reproductor, todavía no se sacó el archivo de video ni se lo miró cuadro a cuadro).

## Lo que se puede y no se puede medir desde acá

Para que la próxima vuelta no vuelva a investigarlo desde cero:

| Vía | Resultado |
|---|---|
| **Biblioteca de Anuncios de Meta**, chromium `--dump-dom` | ✅ **La mejor fuente que tiene el carril** (probado 2026-09-03). Pública, sin cuenta, sin login. Da texto completo del anuncio, anunciante, **fecha de alta**, estado activo y si tiene varias versiones. Comando y URLs exactas: [`gancho-ad-nombrar-la-herramienta-vieja.md`](../../references/tendencias/gancho-ad-nombrar-la-herramienta-vieja.md) |
| Permalink de un anuncio suelto (`ads/library/?id=<Library ID>`) | ✅ Resuelve público y devuelve la ficha sola. Sirve para citar una pieza concreta y auditarla |
| Impresiones / clics / CTR / gasto de un anuncio comercial | ❌ Meta **sólo los publica para anuncios políticos**. Lo más cercano que existe es cuánto tiempo lleva el anuncio activo — es indicio de gasto sostenido, **no** una métrica de rendimiento |
| `curl` al embed de IG (`/p/<id>/embed/captioned/`) | **200 pero inútil**: es un shell de JS, cero datos server-side |
| Chromium headless `--dump-dom` sobre ese mismo embed | ✅ **Funciona** — devuelve el caption completo y confirma `GraphSidecar` (es carrusel) |
| Conteo de láminas, likes, comentarios, guardados | ❌ El embed logueado-fuera **no expone ninguna métrica**. Loguearse está prohibido |
| `html.duckduckgo.com/html/` (GET y POST) | ❌ Devuelve `202` con cero resultados: bloqueo de bots |
| `tiktok.com/oembed?url=...` | ✅ 200 — da caption, autor y thumbnail. **Sin métricas ni estructura** |

⚠️ **`chromium` NO está en el PATH del VPS** y este carril tiene prohibido instalar. El binario
que sí existe es el de Playwright:

    /root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome --headless --disable-gpu \
      --no-sandbox --virtual-time-budget=15000 --dump-dom <url>

## Hecho

- ✅ **2026-09-02** — Creada `references/tendencias/` con su README (el contrato de qué es una
  receta) y la primera receta completa con fuente: `carrusel-indice-en-portada.md`.
- ✅ **2026-09-03** — ~~Receta de gancho para ads del PRODUCTO~~. Cerrado el hueco declarado del
  carril con `gancho-ad-nombrar-la-herramienta-vieja.md`. Lo que lo destrabó fue encontrar la
  fuente: **la Biblioteca de Anuncios de Meta se lee entera sin cuenta**. Muestra los anuncios
  que los competidores del rubro están pagando **ahora**, con su texto completo y su fecha de
  alta. Leídos 89 anuncios activos en 4 búsquedas (BO y AR), 30 del rubro de Onia; 16 de esos 30
  abren nombrando la herramienta vieja (Excel, papel, planillas sueltas) antes que el producto.

## Visto fuera de mi zona — anotado, NO tocado

- **`references/carruseles-referencia/josecarlosttb/ANALISIS.md` está incompleto en lo que más
  importa.** Describe bien el sistema visual, pero al mirar las láminas de nuevo aparecen dos
  cosas que no registró y que son el mecanismo del gancho: el titular es **«4 IDEAS»** (el número
  va solo, manuscrito, arriba a la derecha) y la promesa lleva una **restricción de tiempo**
  (`en una sola tarde`). Tampoco conecta las 4 carpetas de la portada con la grilla 2×2 de la
  lámina 2 ni con la lista numerada del caption — son **el mismo índice tres veces y en el mismo
  orden**. Todo eso quedó capturado en la receta nueva; el archivo viejo sigue como está.
- **Hay 5 loops en `crontab -l` del VPS que NO figuran en la tabla de
  `docs/cola/loops.md`**: `tendencias`, `recorrido-cliente`, `web-factory-dev`,
  `calidad-generado` y `supervisor`. Es exactamente el modo de falla que el propio `loops.md`
  describe ("existe, corre, gasta, y la auto-cura no lo rearma nunca porque no sabe que
  existe"). **Es zona de `docs-auditoria`, no la toqué.**
