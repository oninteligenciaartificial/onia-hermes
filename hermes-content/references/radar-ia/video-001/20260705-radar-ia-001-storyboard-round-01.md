# Radar IA 001 — Storyboard + Motion (Round 01)

- **Job:** `vl-20260606-radar-ia-001-la-ia-ya-no-responde-ahora-trabaja`
- **Lane:** ONIA (educativo / conversion)
- **Formato:** vertical 9:16, objetivo 62s (serie "Radar IA")
- **Titulo:** "La IA ya no solo responde. Ahora trabaja."
- **Estado:** brief `approved_for_generation`; assets generados; **pendiente aprobacion de Sergio** (look + camino de montaje + token IG).
- **Fecha:** 2026-07-05
- **Motor:** Higgsfield MCP — stills `recraft_v4_1` (2K), motion `kling3_0_turbo` (5s, image-to-video).
- **Costo aprox:** 4 stills x8 + 1 regen x2 (16) + 4 clips x7.5 = ~78 creditos.

## Identidad visual "Radar IA"

Paleta fija (pasada como `colors` al modelo):

| Rol | Hex |
|---|---|
| Fondo grafito | `#0B0E12` |
| Azul señal | `#3B82F6` |
| Lime acento | `#B4FF39` |
| Panel slate | `#1C2430` |
| Blanco limpio | `#F5F7FA` |

Regla: azul = base, lime = UN acento activo por frame, negro grafito = fondo. Areas
limpias reservadas para texto agregado en edicion (los tiles/pills van en blanco a
proposito).

## Brand-safety (verificado por QA visual)

- Sin logos reales, sin UI de producto real, sin caras, sin likeness de celebridades.
- Sin texto generado legible (los placeholders van borrosos o en blanco → overlays encima).
- Sin datos privados. Sin estetica apocaliptica / fearmongering (cumple `negative_prompt`).

## Frames (stills 2K)

| # | Archivo | Beat | Prompt (resumen) | QA |
|---|---|---|---|---|
| 01 | `20260705-radar-ia-001-frame-01-hero-signal.png` | 0-2s hook | Señal radar azul + anillos + particulas lime, espacio abajo | ✅ fuerte, primer frame de alta retencion |
| 02 | `20260705-radar-ia-001-frame-02-agent-apps.png` | 2-5s "ahora trabaja" | Nodo agente azul central conectado a tiles de apps en blanco, 1 link lime | ✅ (variante A `ff50820c`; se descarto una v0 con letterbox) |
| 03 | `20260705-radar-ia-001-frame-03-dashboard.png` | 22-34s ejecuta | Dashboard: grafico, reporte con check, preview de sitio, tile rojo de riesgo | ✅ clava "analiza/reporta/crea/marca riesgos" |
| 04 | `20260705-radar-ia-001-frame-04-checklist.png` | 45-58s haz esto hoy | Checklist de 5 filas, checks azules + ultimo lime, pills en blanco | ✅ listo para overlays de los 5 pasos |

## Clips de motion (5s c/u, image-to-video desde cada frame)

| # | Archivo | Job Higgsfield | Movimiento |
|---|---|---|---|
| 01 | `20260705-radar-ia-001-clip-01-hero-signal.mp4` | `263887f4-c6b5-4ee9-b30e-4345c01b50e5` | pulso radar + anillos expandiendo + push-in |
| 02 | `20260705-radar-ia-001-clip-02-agent-apps.mp4` | `b7f07499-0c5a-4407-bc47-a93c79bf6026` | pulsos de energia del nodo a los tiles, link lime brilla |
| 03 | `20260705-radar-ia-001-clip-03-dashboard.mp4` | `9a8d26e6-72b3-47f2-ab54-c25a7e418d57` | grafico se dibuja, check aparece, tile rojo parpadea |
| 04 | `20260705-radar-ia-001-clip-04-checklist.mp4` | `48e19429-b2b0-4aad-896c-a1f1a72d850d` | los 5 checks se activan, ultimo lime hace pop |

## Camino de montaje

### Path A — Corte corto ~24s, sin voz (recomendado para primer publish)

Publicable sin la voz IA (que esta gated). 4 clips = 4 actos + overlays + musica.

| t | Clip | Overlay (texto en edicion) |
|---|---|---|
| 0-4s | clip-01 hero | "La IA ya no solo responde" → **"Ahora TRABAJA"** |
| 4-10s | clip-02 agente→apps | "Se metio dentro de tus herramientas" · subtitulo "OpenAI · Google · Microsoft · Anthropic" |
| 10-17s | clip-03 dashboard | "Ya no contesta: **ejecuta**" · "analiza · reporta · crea · marca riesgos" · caption chico "proceso roto = caos automatizado" |
| 17-24s | clip-04 checklist | "Haces esto hoy:" · "1 proceso → 5 pasos → marca donde la IA ejecuta" · CTA "Comenta que automatizar → lo volvemos radar" |

Musica: bed tech/newsroom sin copyright. Subtitulos on-screen (no requiere VO).

### Path B — Reel completo 62s con voz IA (para la version serie)

Requiere, en orden:
1. **Aprobar generacion de voz** (ElevenLabs, `approval_required_for: paid voice generation`).
2. 4 b-roll extra para los beats sin clip: 5-12s (4 tarjetas), 12-22s (chat→workflow),
   34-45s (proceso roto en rojo), 58-62s (cierre "Sin humo").
3. Montaje con guion completo (13 lineas) + subtitulos palabra por palabra.

## Paquete de publicacion (cuando Sergio apruebe + de token IG)

- **IG caption** (`instagram_caption` en el job) ya finalizada, ASCII-safe.
- Reel se sube via VPS: `ig-publish reel_publish --video-url "<url_publica>" --caption "<instagram_caption>"`.
- El MP4 final necesita URL publica (asset server `http://187.77.16.63:8099/<archivo>`).
- Copy TikTok / YouTube / LinkedIn tambien en `platform_copy`.

## Gates

- ✅ Brief aprobado para generacion (seleccion de Sergio).
- ✅ Generacion de stills + motion (sin cara → segura).
- ⏳ Aprobacion del look + eleccion Path A/B.
- ⏳ Voz IA (solo si Path B) — requiere OK explicito.
- ⏳ Publicar — requiere token IG de Sergio y URL publica del MP4 final.

## Reuse

Convertir en serie diaria "Radar IA: que paso, por que importa, que haces hoy".
La identidad visual de este round queda como plantilla de la serie.
