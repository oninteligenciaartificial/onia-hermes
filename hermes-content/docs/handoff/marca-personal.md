# Handoff — carril marca personal (guiones, comunidad, edición, contenido IA)

**Archivo único del carril.** Actualizado 2026-09-29 por Claude (Opus 5.5).

## ⏩⏩⏩⏩ Pedido de Sergio Urcullo, 29-sep 20:30 (en curso)

| # | Pedido | Estado |
|---|---|---|
| 1 | «Aprendé el método de sanmunoz» | Era su último carrusel: videos animados que Claude dibuja con código, sin grabarse. Ficha: `references/marca-personal/SANTIAGO-VIDEOS-ANIMADOS-POR-CODIGO.md`. El skill real llega por DM si se comenta «OPUS» (decisión de Sergio) |
| 2 | Un carrusel por día, agendado | Publicador `ig-carrusel.mjs` listo (ensayo con 7 láminas hasta FINISHED, sin publicar). Calendario de los 21 días en `cola/plan-3-semanas/CARRUSELES-DIARIOS.md` (16:00 La Paz). **Hechos: K1–K9 y K10** (perilla de esfuerzo, mirado). **Faltan K11–K21**: tema, guion de origen y portada de cada uno ya están en ese archivo §2; se retoman desde ahí. Arreglos pendientes: K2 re-render con tema de marca (gratis), K8 portada vacía. Lote Higgsfield opcional de 4 portadas (0,48 cr) sin generar ni aprobar. Decisiones de Sergio: opción A o B de K1, e intercambiar K1↔K10 o no. Nada agendado todavía |
| 3 | Configurar bien todos sus perfiles | Pendiente: auditoría de solo lectura (IG, TikTok, YouTube, LinkedIn) y propuesta de cambios para su OK |
| 4 | ¿Qué hacemos con ONIA (@oniahq)? | Pendiente: mirar sus cuentas y proponer. Pista: el método de Santiago (anuncio dental hecho con código + una pantalla real del sistema) produce contenido de ONIA sin horas de grabación |
| 5 | Comunidad semanal (expositores, networking, temas) | Anotado en `ONIA_COMUNIDAD_CONTENIDO.md` con el tema de cada semana; faltan sus decisiones (día, sede, fecha, nombre, expositores) |
| 6 | Compartir entre sesiones | Avisos enviados a plataforma, limpieza de skills y Lucía v4. Regla nueva de Sergio (29-sep): compartir solo lo que le sirve a cada sesión, sin avisos de más. A Hermes el SendMessage no le llega: lo de coordinación va en `COORDINATION_MANIFEST.md` §EL HILO. Hermes lee «Para grabar hoy» de `S*-GUIONES.md` (formato `## Mié 30-sep` / `### DNN-X · Formato · Título`): no cambiarlo sin anotarlo en EL HILO |

**Cierre del 29-sep (Sergio pidió pausar las sesiones):**
- Alertas del publicador por la aduana `/root/bin/onia-tg.sh` (sistema), nunca curl directo: `agendar-publicacion.sh` e `ig-refrescar.sh` ya desplegados así.
- Checklist de grabación (método de Santiago + nuestra edición) en `ORDEN-DE-PRODUCCION.md` §1b.
- Sin commitear no queda nada. Riesgo conocido: el auto-sync de las 23:00 subió una versión intermedia de K10 (`fad8e2ff`); la final la reemplaza en el commit siguiente.
- Retomar por: (1) perfiles, auditoría de solo lectura con Chrome; (2) propuesta para @oniahq; (3) K11–K21; (4) respuestas de Sergio (OPUS, comunidad, K1).

## ⏩⏩⏩ Estado 29-sep noche: publicador

- **Circuito listo, todavía SIN publicaciones reales:** Sergio deja los brutos en
  `C:\Users\PC\Videos\ONIA-brutos\<fecha>\` → Claude edita, arma el paquete del día → «ok» de Sergio →
  Claude publica desde el VPS. Doc: [`deploy/vps-ops/publicar/README.md`](../../deploy/vps-ops/publicar/README.md);
  ritmo: [`cola/plan-3-semanas/FLUJO-DIARIO.md`](../cola/plan-3-semanas/FLUJO-DIARIO.md) (3 principales + 6 yaps a Trial).
- **Instagram** (reel + Trial) por API propia, `ig-reel.mjs`: ensayado hasta FINISHED, falta el primer
  `--publicar` real. **TikTok, YouTube Shorts y LinkedIn** por **Buffer Free**, `buffer-post.mjs`: cuenta,
  3 canales y clave activos (clave solo en el VPS, vence 29-sep-2027). Probado con un borrador por red
  (video adjunto, YouTube lo toma como Short) y borrados.
- **Arreglo de infra hecho:** la ruta Traefik `/hermes-assets` comprimía los MP4 con gzip y Buffer no los
  podía leer. Se le sacó `comprimir` solo a esa ruta; respaldo del archivo en el VPS
  (`/root/onia-manual-routes.bak-hermes-assets-20260929212725`). Los demás sitios siguen respondiendo igual.
- **Depende de Sergio Urcullo:** activar el compartido automático IG → Facebook (Centro de cuentas);
  decidir si se pide la auditoría de YouTube (para que los largos salgan solos: hace falta registrar la
  app en Google Cloud, que es un registro, no servidores). Hasta entonces, los largos los sube él.

## ⏩⏩ Estado 29-sep tarde

- **Diseño en un solo lugar:** skill `.claude/skills/diseno-contenido-onia/` (índice: fuentes de
  imagen, packs, patrones, QA, gasto) + galería única `hermes-content/galeria/` con
  `galeria.json`. Orden de imágenes: galería → **Higgsfield** (Sergio dicta «Pixel» = Higgsfield, confirmado
  29-sep) → logo oficial → captura real. Paleta: verde ONIA + blanco + negro (temas del pack). Google/Pinterest: no se publica
  nada sin licencia.
- **Pack nuevo `referentes`** (`scripts/carousel_pack_referentes.js`, layouts logos · analogia ·
  ensayo · ilustrado · lista) tras la crítica «vacíos y con demasiado texto». Prototipos mirados:
  `carousels/out/sergio-k1v2-*` y `sergio-k2v2-*`. K3–K9 siguen en el pack viejo: rehacerlos con
  este (imágenes: galería/Pexels primero; acuarelas Higgsfield ≈0,12 cr c/u con lote aprobado).
- **Presentaciones de YouTube:** 9 decks `carousels/out/yt-10…yt-18` (`scripts/decks/yt-octubre-2026.mjs`,
  generador con `--decks`), mirados.
- **GitHub:** `cola/plan-3-semanas/S4-GITHUB-REPOS.md` — 15 repos en tendencia con riesgo, 12
  formatos, 10 verticales + 1 YouTube (G01–G11) SIN fecha en el calendario todavía.
- **Patrones visuales de los 8 referentes:** `diseno-contenido-onia/patrones/REFERENTES-VISUAL.md`.
- **Coordinación:** la sesión «Onia platform development handoff» es dueña de onia-platform,
  SIAT, sales-kit y la web pública (árbol `onia-hermes-v1-remoto-20260928`); esta sesión, del
  contenido de onia-hermes. Acordado 29-sep: nadie arma lugares paralelos; se avisa antes de
  tocar `.claude/skills/` o `hermes-content/references/`.
- Gasto Higgsfield del día: ver bitácora. El audio del bot NO es de este carril (Sergio: «tú no tocas eso»).

## ⏩ Estado 29-sep (mañana)

- **Plan de 3 semanas** (30-sep → 20-oct): [`cola/plan-3-semanas/MAPA.md`](../cola/plan-3-semanas/MAPA.md)
  — recorrido video → web → comunidad → ONIA, 3 videos/día (A tutorial · B actualidad · C YouTube
  o negocio/historia), 3 carruseles/semana, calendario día por día y lista «antes de grabar».
  Guiones: `S1-GUIONES.md` · `S2-GUIONES.md` · `S3-GUIONES.md` (63 piezas; 56 nuevas). **Sin
  aprobación de Sergio todavía: él dijo «primero veamos qué sabés y yo te corrijo».**
- **Base del plan** (en `references/marca-personal/`): INVENTARIO (67 unidades reales de ONIA),
  FORMULAS (8 fórmulas de referentes), RADAR (16 novedades con fuente primaria), SANTIAGO
  (método de carruseles).
- **Carruseles:** método de Santiago adaptado (Higgsfield pinta la imagen, el texto va por
  código): `scripts/carousel_images.mjs` + skill `hermes-content/skills/carruseles-onia.md`.
  K1–K3 renderizados con portada (`carousels/out/sergio-k1..k3-*-20260929/`). K4–K9: brief +
  vista previa; **imagen pendiente de aprobación** (≈0,72 cr). Gasto del día: 0,60 cr (bitácora
  en `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`).
- **El CLI de Higgsfield solo está logueado en el VPS**; en la PC `higgsfield account` da «Not
  authenticated». El script corre por ssh con `HF_CMD`. Loguear la PC = OAuth en el navegador de
  Sergio (su clic).
- **Decisiones que esperan a Sergio:** (1) ¿1 de cada 3 videos para dueños de negocio (etapa 1 =
  clínicas) o 100 % marca personal? (2) S-09 «agentes sin LLM» contradice cómo se vende el
  producto. (3) ¿Láminas interiores ilustradas como Santiago (hay que agregar el tipo al pack) o
  solo portada?
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
