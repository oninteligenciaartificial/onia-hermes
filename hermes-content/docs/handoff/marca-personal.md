# Handoff — carril marca personal (guiones, comunidad, edición, contenido IA)

**Archivo único del carril.** Actualizado 2026-09-28 22:00 La Paz por Claude (Opus 5.5).
Los otros cinco handoffs de este carril quedan como HISTORIA (ver §Historial): la próxima
sesión, Codex o Claude, empieza ACÁ y edita ESTE archivo.

## 1. Objetivo de la sesión

Que Sergio Urcullo pueda grabar: un solo archivo de guiones que enseñen de verdad, sobre
temas actuales verificados y ejemplos reales de ONIA, con el trabajo disperso de Codex
rescatado en una sola rama.

## 2. Qué quedó hecho (en `main` vía rama `claude/marca-personal-contenido-ae658c`)

- **Guiones para grabar:** [`cola/GUIONES-PARA-GRABAR-2026-09-29.md`](../cola/GUIONES-PARA-GRABAR-2026-09-29.md)
  — 1 YouTube (Opus 5.5 vs Sonnet 5.5) + 9 verticales + 5 ideas POV Ray-Ban + enseñanza.
  **Sin aprobación editorial de Sergio todavía.**
- **Producción:** [`cola/PRODUCCION-GUIONES-2026-09-29.md`](../cola/PRODUCCION-GUIONES-2026-09-29.md)
  — fuentes verificadas el 28-sep, las dos pruebas ejecutadas con sus salidas, pantallas por
  pieza y los 6 drops que tienen que estar en la comunidad ANTES de publicar cada video.
- **Rescate:** las cuatro ramas de Codex del carril (`codex/marca-comunidad-plan`,
  `codex/marca-sergio-guiones-20260927`, `codex/guiones-referentes-20260928`,
  `codex/guiones-reinicio-20260928`) quedaron mergeadas en esta rama. Conflictos resueltos:
  `RODAJE-MARCA-PERSONAL-2026-09-27.md` → versión 28-sep (referentes);
  `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` → se conservan las decisiones de Sergio del 21-sep
  (pilares, estructura diaria) + el párrafo «el cómo sí va» del 28-sep;
  `COORDINATION_MANIFEST.md` → ambas entradas.

## 3. Qué quedó a medias y dónde

- **Nada grabado, nada publicado.** Postiz daba 502 el 27-sep; no se tocó.
- **Drops de comunidad** (6, en PRODUCCION §Drops): escritos, NO publicados en Announcements.
- **Carruseles** SERGIO-CAR-01/02/03-V2: listos y verificados por Codex el 27-sep, esperan
  aprobación: `cola/APROBACION-CARRUSELES-SERGIO-2026-09-27.md`.
- **Rama `codex/sergio-vault-growth`** (21-sep) NO se mergeó: toca `sitio-sergiourcullo/*` y
  `scripts/carousel_*.js` con tests. Publicar la web es permiso aparte; decidir con Sergio.
- **Cotizador demo** (`cola/cotizador-tarjetas-demo.html`): falta probar en navegador real.

## 4. Archivos

`cola/GUIONES-PARA-GRABAR-2026-09-29.md` · `cola/PRODUCCION-GUIONES-2026-09-29.md` ·
`handoff/marca-personal.md` (este) · assets de Opus: `hermes-content/captures/opus-5-5/`.
Fuentes de estructura: `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` (reparto 10-13, Samuel hace
pilar y yap), `ONIA_DONDE_VA_CADA_COSA.md` (Instagram · YouTube · web · Onia Community).

## 5. Intentos fallidos y por qué (lo que NO hay que repetir)

1. **Cada sesión de Codex arrancaba de `main` y no veía la rama anterior** → repetía la
   investigación de referentes y reescribía desde cero. Causa raíz de los «errores tontos».
   Regla: al cerrar, el trabajo del carril se mergea a `main` o se nombra acá con su rama.
2. **Ejemplos inventados** (taller de bicicletas, imprenta) → guiones intercambiables con
   cualquier creador. Sergio los rechazó por «vacíos». Usar lo real de ONIA.
3. **Disclaimers a cámara** («todavía no ejecutamos la prueba») → si hay que probar, se prueba
   ANTES de escribir. Claude puede correr Opus y Sonnet con subagentes (`model: opus|sonnet`)
   sin login de CLI; Codex no pudo porque `claude auth status` da `loggedIn:false`.
4. **Premisa sin probar:** el guion de Codex daba por hecho que la IA promete la entrega.
   Probado el 28-sep: Sonnet 5.5 no lo hizo ni sin regla. Probar la premisa antes del guion.
5. **Mismo tema repetido** (cotizador en 4 de 10 piezas) aunque Sergio había pedido variedad.
6. **Investigación sin cierre:** horas releyendo perfiles. Las fichas ya están en
   `references/marca-personal/EXTRACCION-REFERENTES-GUIONES.md` y `references/video-intake/`.
7. **Cinco handoffs para un carril**, con fecha en el nombre. Ahora uno solo: este.
8. **1-oct WhatsApp:** la memoria dice que cambia el cobro de mensajes de servicio; la página
   oficial consultada el 28-sep no lo confirma para LatAm. No publicarlo sin fuente primaria.

## 6. Qué depende de Sergio Urcullo

- Aprobar (o corregir) los 10 guiones y grabarlos.
- Aprobar los 3 carruseles del 27-sep (texto exacto en `APROBACION-CARRUSELES-...`).
- Publicar los drops en Announcements (o autorizar a publicarlos).
- Decidir `codex/sergio-vault-growth` (cambios a la web personal).

## 7. Próximos pasos

1. Cuando Sergio grabe: localizar el bruto, pipeline `editor-videos` (tabla de cortes a
   Sergio ANTES de cortar; transcript leído a ojo).
2. Publicar el drop de cada pieza antes que la pieza.
3. Tanda siguiente: temas del banco (PRODUCCION §Banco) + lo que haya salido esa semana,
   verificado contra fuente primaria el mismo día. Formato: resultado primero → pasos exactos
   → prueba → cierre en comunidad/web.

## Historial (no es fuente; se conserva)

`EDICION-MARCA-PERSONAL-2026-09-21.md` · `marca-personal-carruseles.md` ·
`marca-sergio-guiones-20260927.md` · `REINICIO-GUIONES-2026-09-28.md` ·
`CONTINUAR-GUIONES-CLAUDE-2026-09-28.md`.
