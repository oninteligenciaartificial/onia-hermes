# ONIA — Sistema de Video Multi-Escena de Sergio (Founder Content)

**Versión:** 1.0
**Actualizado:** 2026-06-13
**Responsable:** Hermes / ONIA
**Relacionado:** `MODEL_VIDEO_PRODUCTION_SYSTEM.md` (Mara Vale), memoria `[[hermes-vps-config]]`, `[[sergio-onia-soul]]`

---

## 0. PRINCIPIO QUE CAMBIA TODO

**El video NO es una imagen hablando.** Es un video real con **escenografía**: varias tomas distintas (founder en escritorio, caminando, señalando dashboard, b-roll de pantallas, exterior) montadas en secuencia, con la **voz real clonada de Sergio** como narración continua encima.

```
ANTES (talking-head):   1 imagen → wan2_7 → cara que habla 7s. Estático. Aburre.
AHORA (multi-escena):   N imágenes distintas → N clips de movimiento → stitch
                        + voz narración ElevenLabs encima + captions. Dinámico. Retiene.
```

El talking-head (wan2_7 lip-sync) sigue existiendo pero **solo como UNA toma** dentro del video (el "hook" o el momento de cara), no el video entero.

---

## 1. ANATOMÍA DE UN VIDEO MULTI-ESCENA (15-30s)

Estructura tipo para founder content ONIA (TikTok/Reels 9:16):

```
[0-3s]   HOOK        Toma A — talking-head (wan2_7 lip-sync) o b-roll fuerte
                     Sergio dice el hook a cámara. Su voz, su cara, su boca sincronizada.
[3-10s]  PROBLEMA    Toma B + C — b-roll escenografía (sin lip-sync)
                     Sergio caminando en oficina, señalando pantallas con dashboards,
                     mirando código. Voz NARRACIÓN encima (no lip-sync).
[10-22s] SOLUCIÓN    Toma D + E — más b-roll
                     Sergio en standing desk explicando, gesto de "mira esto",
                     pantalla con WhatsApp/automatización. Voz narración encima.
[22-28s] CTA         Toma F — talking-head corto o b-roll fuerte
                     Sergio cierra mirando a cámara. Voz narración o lip-sync.
```

Clave: **solo HOOK y CTA usan lip-sync** (caro, requiere audio exacto por clip). El medio (PROBLEMA/SOLUCIÓN) es **b-roll silencioso con voz-over continua** encima — mucho más barato y más dinámico.

---

## 2. IDENTIDAD DE SERGIO (avatar)

- **Soul v2:** `bce5feb0-f028-4d1f-b2b3-96428a013f85` (ver `[[sergio-onia-soul]]`)
- **Voz clonada (ElevenLabs):** `oU0W7i6gMHa6o2pnQ6cf` — model `eleven_multilingual_v2`, settings `stability=0.45 / similarity_boost=0.98 / use_speaker_boost=true`

### Imágenes Soul v2 aprobadas = banco de escenografía

| Job ID | Escena | Mejor para |
|--------|--------|-----------|
| `1abbf98c` | Oficina noche, pantallas código/dashboard, bokeh azul, all-black | HOOK, CTA dramático, talking-head |
| `6b27d458` | Oficina noche (variante) | b-roll dramático |
| `89d6b431` | UGC desk, MacBook, luz ventana, relaxed smile | storytime, "building in public" |
| `532b0bf6` | UGC desk (variante) | b-roll casual |
| `5157996b` | Standing desk, gesto explicando, interior moderno | PROBLEMA/SOLUCIÓN, "mira esto" |
| `a76ab66a` | Standing desk (variante) | b-roll explicando |
| `e7707369` | Headshot studio, Rembrandt, direct eye contact | talking-head limpio, CTA |
| `94dbd6c5` | Exterior urbano Santa Cruz, golden hour, all-black | apertura lifestyle, b-roll establecedor |
| `ea5fdeb3` | Exterior urbano (variante) | b-roll lifestyle |

**RECHAZADA — nunca usar:** `690332c1`.

**Para escenas nuevas:** generar imagen fresca con Soul v2 (`model: soul_2`, `soul_id: bce5feb0`) variando prompt de escenografía (ej. "señalando whiteboard con diagrama de flujo", "viendo móvil con notificaciones WhatsApp", "frente a monitor con dashboard de métricas").

---

## 3. MODELOS — CUÁNDO USAR CADA UNO

| Modelo | Rol en el video | Audio | Costo aprox | Notas |
|--------|----------------|-------|-------------|-------|
| `wan2_7` | **Talking-head con lip-sync** (HOOK/CTA) | Sí (audio role) | ~10.5/7s @720p | start_image + audio. Boca sincronizada a la voz. |
| `kling3_0` std | **B-roll con movimiento** (medio) | off | ~7.5/5s | start_image + prompt movimiento. Caminar, gestos, escena. |
| `seedance_2_0` std | **B-roll premium / multi-shot** | medias | ~15/10s | Soporta `multi_shots`+`multi_prompt` (varias tomas en 1 gen). Alta fidelidad identidad. |
| `seedance_2_0` + video ref | **Motion-control** (copiar movimiento de un video real) | medias | ~20/10s | Reemplaza persona del video ref por Sergio. Para gestos founder realistas. |

### Regla de costo
```
HOOK lip-sync (wan2_7, 5-7s)        ~10 créditos
3-4 b-roll (kling std, 5s c/u)      ~22-30 créditos
CTA lip-sync (wan2_7, 4s)           ~7 créditos
─────────────────────────────────────────────────
Video multi-escena completo 25s     ~40-50 créditos  (~$ trivial en plan Ultra)
```

---

## 4. PIPELINE TÉCNICO COMPLETO

```
PASO 1 — GUION + STORYBOARD (Groq LLM o manual)
  Genera: hook, narración por bloque, lista de N tomas con su escena + movimiento.
  Output JSON: { hook, blocks:[{text, scene, image_job_id, motion_prompt, has_lipsync}], caption }

PASO 2 — VOZ (ElevenLabs, VPS)
  Para cada bloque con lip-sync: TTS individual (audio exacto de esa toma) ≤15s.
  Para narración voice-over: 1 TTS continuo de toda la narración.
  curl /v1/text-to-speech/oU0W7i6gMHa6o2pnQ6cf con voice_settings óptimos.

PASO 3 — IMÁGENES DE ESCENA (Higgsfield Soul v2, MCP)
  Reusar job ids del banco (sección 2) o generar nuevas escenas con soul_2.

PASO 4 — CLIPS DE VIDEO (Higgsfield MCP)
  - Tomas lip-sync: subir audio (media_upload→PUT→media_confirm) → wan2_7 (start_image+audio).
  - Tomas b-roll: kling3_0 std (start_image + motion_prompt, sound off).
  Poll job_display hasta status=completed. Descargar rawUrl mp4.

PASO 5 — STITCH + VOZ + CAPTIONS (FFmpeg, VPS)
  a. Concatenar clips en orden (concat demuxer).
  b. Overlay voz-over continua sobre los tramos b-roll (los lip-sync ya traen su audio).
  c. Quemar captions (subtítulos) — bold sans, tercio inferior.
  d. Música de fondo opcional -18dB sin letra.
  Output: MP4 final 9:16 1080p.

PASO 6 — ENTREGA (Telegram, VPS)
  sendVideo a Sergio (6830070978) para aprobación.
  Solo tras "Publicar video <id>" → Instagram (META_LONG_LIVED_TOKEN).
```

---

## 5. EJEMPLO CONCRETO — Video "Automatización WhatsApp" (25s)

```json
{
  "topic": "Por qué responder mensajes a mano te cuesta plata",
  "hook": "Si tu negocio todavía responde mensajes a mano, estás perdiendo plata.",
  "blocks": [
    {
      "type": "hook", "duration": 5, "has_lipsync": true,
      "scene": "oficina noche dramática",
      "image_job_id": "1abbf98c",
      "text": "Si tu negocio todavía responde mensajes a mano, estás perdiendo plata.",
      "motion_prompt": "Founder speaking directly to camera, confident, subtle lean-in on hook"
    },
    {
      "type": "broll", "duration": 5, "has_lipsync": false,
      "scene": "señalando pantalla con dashboard",
      "image_job_id": "5157996b",
      "voiceover": "Cada lead que no contestas en minutos, se enfría.",
      "motion_prompt": "Founder at standing desk pointing at screen showing chat dashboard, explaining gesture"
    },
    {
      "type": "broll", "duration": 6, "has_lipsync": false,
      "scene": "desk con MacBook, building in public",
      "image_job_id": "89d6b431",
      "voiceover": "En ONIA conectamos un sistema que entiende el mensaje, lo ordena y responde solo.",
      "motion_prompt": "Founder at desk with MacBook, relaxed confident, hand gesture explaining flow"
    },
    {
      "type": "cta", "duration": 5, "has_lipsync": true,
      "scene": "headshot limpio",
      "image_job_id": "e7707369",
      "text": "Escríbenos y te mostramos cómo se vería en tu negocio.",
      "motion_prompt": "Founder direct eye contact, confident close, small nod"
    }
  ],
  "caption": "El bot no vende solo. El sistema es lo que vende. 🤖 #automatizacion #IA #bolivia"
}
```

Costo estimado: 2 lip-sync (~17) + 2 b-roll (~15) = **~32 créditos**.

---

## 6. ESCENAS FOUNDER APROBADAS (escenografía)

```
6.1 OFICINA NOCHE       Pantallas código/dashboard, bokeh azul, all-black. Dramático, autoridad.
6.2 STANDING DESK        Señalando pantalla/móvil, gesto explicando. "Mira esto", demos.
6.3 UGC DESK MACBOOK     Luz ventana, relaxed. Storytime, building-in-public, cercanía.
6.4 HEADSHOT STUDIO      Rembrandt, direct eye contact. Talking-head limpio, CTA.
6.5 EXTERIOR URBANO      Santa Cruz, golden hour. Apertura, lifestyle, establecedor.
6.6 B-ROLL PANTALLAS     (generar nuevo) Close-up de dashboard, WhatsApp, métricas subiendo.
6.7 WHITEBOARD/DIAGRAMA  (generar nuevo) Sergio frente a diagrama de flujo de automatización.
```

Negativos siempre en prompt: `no identity drift, no different face, no text, no watermark, no logos, no bad hands, no deformed anatomy, no plastic skin`.

---

## 7. REGLAS DE CONTENIDO (founder / ONIA)

```
✅ PERMITIDO:
- Sergio explicando automatización, IA, sistemas de negocio
- Demos visuales de dashboards/flujos (genéricos, sin datos de clientes reales)
- Opinión, educación, "así funciona", building-in-public
- Su cara real (Soul v2) + su voz real (clon) — ES él, aprobado

❌ PROHIBIDO (requiere aprobación exacta de Sergio):
- Publicar en cualquier plataforma sin "Publicar video <id>"
- Inventar clientes, casos de éxito, métricas, resultados, precios
- Claims garantizados ("aumenta ventas 300%")
- Mostrar datos reales de clientes
- Logos de terceros sin permiso
- Comprometer/prometer entregables en nombre de ONIA
```

> Restricción de seguridad vigente: Hermes NO publica, NO contacta clientes, NO gasta dinero significativo, NO usa cara/voz de Sergio cliente-facing sin aprobación exacta.

---

## 8. ARQUITECTURA DE AUTOMATIZACIÓN (el punto crítico)

**Higgsfield solo funciona por MCP (desde Claude). NO tiene API key headless.** El cron Python del VPS NO puede generar video Higgsfield solo.

```
Componente              Dónde corre              Headless en VPS?
─────────────────────────────────────────────────────────────────
Guion (Groq)            VPS cron Python          ✅ sí
Voz (ElevenLabs)        VPS curl                 ✅ sí (API key en .env)
Imágenes Soul v2        Higgsfield MCP           ❌ NO (solo Claude)
Clips video             Higgsfield MCP           ❌ NO (solo Claude)
Stitch (FFmpeg)         VPS                       ✅ sí
Entrega (Telegram)      VPS curl                 ✅ sí
```

**Conclusión:** el orquestador del paso Higgsfield tiene que ser **un agente Claude que tenga el MCP conectado**. Dos modelos posibles:

```
MODELO A — Semi-automático (recomendado inicio)
  VPS cron prepara guion + voz diariamente → avisa a Sergio por Telegram.
  Sergio (o Hermes en sesión) dispara "Genera video de hoy" → Claude+MCP genera clips,
  stitch, entrega. Sergio aprueba → publica.
  ✅ Cero riesgo, control humano. ❌ requiere 1 trigger humano/día.

MODELO B — Full-auto (objetivo)
  Agente Claude programado (cloud routine / máquina con MCP) corre diario:
  lee guion del VPS → genera todo → stitch → entrega a Telegram para aprobación.
  Sergio solo aprueba publicación.
  ⚠️ Depende de que el MCP Higgsfield esté disponible en el entorno programado.
     A validar antes de prometer "100% desatendido".
```

---

## 9. PRÓXIMOS PASOS

```
Fase 1 — Validar calidad multi-escena (AHORA)
  [ ] Generar 1 video multi-escena completo de ejemplo (sección 5)
  [ ] Sergio aprueba lip-sync + b-roll + stitch + voz
  [ ] Ajustar prompts de escenografía que fallen

Fase 2 — Script de producción
  [ ] scripts/sergio-multiscene-build.js: orquesta voz+clips+stitch dado un JSON storyboard
  [ ] Plantillas de storyboard (hook/problema/solución/cta)
  [ ] Librería de motion_prompts probados por escena

Fase 3 — Automatización
  [ ] VPS cron: guion diario founder (Groq) → Telegram
  [ ] Decidir Modelo A vs B según disponibilidad MCP
  [ ] Captions automáticos (whisper/ffmpeg) + música
```
