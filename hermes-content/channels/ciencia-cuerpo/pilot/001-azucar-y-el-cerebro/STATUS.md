# STATUS — Piloto 001: "Qué le hace el azúcar a tu cerebro"

## Hecho en esta sesión (2026-07-08)

- [x] `research-brief.json` — 3 fuentes NIH/PMC verificadas por búsqueda directa
      (no memoria del modelo), gate YMYL de "adicciones" cumplido (exige 2
      fuentes independientes, hay 3).
- [x] `script.md` — guion completo, ~1450 palabras (~9-10 min a ritmo narrador),
      mecanismo explicado sin cruzar a consejo/tratamiento, matiz explícito
      sobre las limitaciones de la comparación con drogas, disclaimer incluido.
- [x] `shot-list.json` — 20 shots (15 stills/diagramas + 5 clips "hero"),
      estilo Kurzgesagt (ilustración plana, sin fotorrealismo), duración total
      ≈ 514s (8:34 min), costo estimado **≈360 créditos Higgsfield**.
- [x] `metadata.json` — título, descripción con fuentes resueltas y
      disclaimer, tags, capítulos, brief de miniatura, `made_for_kids: false`,
      `contains_synthetic_media: true`, `privacy_status_initial: "private"`.
- [x] Validado con `node pipeline/validate.mjs pilot/001-azucar-y-el-cerebro`
      (ver sección "Validación" abajo).

## Pendiente — bloqueado hasta aprobación (regla GASTO + regla YMYL del canal)

**Nada de esto se ejecuta todavía.** El piloto está listo para revisión, no
para generación real.

1. **Aprobación de gasto Higgsfield.** ~360 créditos estimados (12% del plan
   Ultra mensual de 3000cr) para generar las 5 imágenes-hero animadas + 15
   stills. Texto de aprobación requerido (ver `pipeline/approval-matrix.json`):
   `Apruebo generacion IA pagada: ciencia-cuerpo-001-azucar-y-el-cerebro presupuesto 360 creditos`
   - Nota de precisión: el costo por segundo de video varía según qué tan
     "turbo"/barato sea el modelo real usado (dos referencias del repo
     discrepan: `video-factory/engine/higgsfield/adapter.mjs` estima
     `kling3_0` en 9cr/s: memoria de sesiones previas registra
     `kling3_0_turbo` más cerca de ~7.5cr por clip completo de 5s). Usé el
     punto medio (~7.5cr/s) para no subestimar. Antes de gastar los 360cr
     reales, conviene generar 1 solo shot y confirmar el costo real que cobra
     Higgsfield antes de lanzar los 19 restantes.
2. **Aprobación de voz narrada paga** (no sale de créditos Higgsfield, ver
   `hermes-content/skills/audio-elevenlabs.md`): `Apruebo voz IA pagada:
   ciencia-cuerpo-001-azucar-y-el-cerebro presupuesto <a definir>`.
3. **Bloqueo real de infraestructura (no depende de esta sesión):** no existe
   ninguna credencial de YouTube en n8n (`list_credentials` solo devuelve
   Google Sheets/Calendar/Drive — confirmado en esta sesión). Sergio necesita
   crear el proyecto de Google Cloud + credenciales OAuth 2.0 (tipo Desktop,
   scope `youtube.upload`) y pasar la auditoría de compliance de Google antes
   de que la subida real (aunque sea privada) funcione. Sin esa auditoría,
   YouTube fuerza las subidas a privado igual — así que el bloqueo no frena
   probar `--dry-run`, solo frena la subida real.
4. Una vez generados los assets aprobados: ensamblar con `ffmpeg` (concat +
   narración + pan/zoom en los stills) — sin costo de crédito adicional.
5. Correr `scripts/upload-youtube.mjs --dry-run` (no requiere aprobación, no
   llama a la API real) para confirmar que el payload es válido.
6. Recién ahí: `Apruebo subida privada YouTube: ciencia-cuerpo-001-azucar-y-el-cerebro`.
7. Publicación pública: gate aparte, ver `pipeline/approval-matrix.json`.

## Validación

```
$ node pipeline/validate.mjs pilot/001-azucar-y-el-cerebro
OK   research-brief.json
OK   shot-list.json
OK   metadata.json
```

Los 3 archivos pasan el schema de `pipeline/schemas.mjs`, incluidas las reglas
duras codificadas como tipo (no solo como texto): `made_for_kids` fijo en
`false`, `privacy_status_initial` fijo en `"private"`, `contains_synthetic_media`
fijo en `true`, `disclaimer_required` fijo en `true`, y cada fuente citada con
URL real.
