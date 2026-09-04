# Cola — carril `tendencias`

Rama `claude/tendencias`. Zona: `hermes-content/docs/research/**` y
`hermes-content/references/tendencias/**`.

**Producto del carril:** recetas ejecutables de formato, con fuente pública. No informes.
Contrato y estado del inventario: [`references/tendencias/README.md`](../../references/tendencias/README.md).

## Ahora

1. **Receta de gancho para ads del PRODUCTO.** Es el hueco declarado del carril: el radar
   existente cubre sólo la marca personal de Sergio. Falta encontrar una fuente pública que
   muestre ads reales del rubro (software de gestión / IA para pymes) sin loguearse.
2. **Receta de reel**: primeros 3 segundos, cada cuántos segundos cambia el plano, y el cierre.
   Bloqueado por lo mismo que el punto de arriba — ver *Lo que no se puede medir*.

## Lo que no se puede medir desde acá — probado el 2026-09-02

Para que la próxima vuelta no vuelva a investigarlo desde cero:

| Vía | Resultado |
|---|---|
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
