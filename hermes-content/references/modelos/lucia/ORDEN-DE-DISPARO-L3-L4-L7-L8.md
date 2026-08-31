# Orden de disparo — L3, L4, L7 y L8

> Escrito 2026-08-23. **Existe para que el permiso de gasto sea UN solo sí y no cuatro
> idas y vueltas.** Todo lo que se podía decidir sin gastar, ya está decidido acá.
> Nada de esto se ejecuta sin la aprobación explícita de Sergio (regla de gasto de CLAUDE.md).

## Estado de la cuenta al escribir esto

| | |
|---|---|
| Saldo | **2.134,63 créditos** · plan ULTRA |
| Costo de las 4 piezas | **72,5 cr** en la ruta recomendada · 42 cr en la barata (ver abajo) |
| Peso sobre el saldo | **3,4 %** (ruta A) · 2,0 % (ruta B) |
| Generaciones "unlim" | `available: false` — hoy NO hay ilimitadas disponibles, todo sale de créditos |

## Costos REALES, no estimados

Los precios de abajo salen de generaciones que YA hicimos y quedaron con el costo en el
nombre del archivo (`tanda-20260821/`). No son estimaciones de catálogo:

| Modelo | Costo medido | De dónde sale el dato |
|---|---|---|
| Seedance 480p | **5 cr** | `VID-01b-trabajando-seedance480p-5cr.mp4` |
| UGC selfie hablando (veo) | **12 cr** | `VID-05-UGC-selfie-hablando-12cr.mp4` |
| Kling 3.0 | **16 cr** | `VID-06-UGC-kling3-16cr.mp4` |
| Gemini Omni | **24 cr** | `VID-07-UGC-gemini-24cr.mp4` |
| Seedance 2.5 | **32,5 cr** | `06 - SEEDANCE 2.5 (5s, 32.5cr).mp4` |

## Identidad — verificado hoy

- Ancla vigente: **`452d8375-fb67-4df7-9ae0-8f1b257aa51f`** (`lucia-ancla-2026-08`), `status: completed`.
- Se inyecta escribiendo **`<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>>`** dentro del prompt.
- El Soul `LUCIA-SINTETICA-v3` **NO se usa**: probado A/B, no le gana al Element (queda de respaldo).

## Las cuatro llamadas

Prompts completos en `PRODUCCION_MES_1.md` (formato multi-escena de §13). Reglas que
aplican a las cuatro: `natural true-to-life colors, no color grading, no filter look` ·
`natural real-time speed, no slow motion` · `[TEXT RULE — MANDATORY] No legible text
anywhere in frame.` · aspecto **9:16**.

| Pieza | Modelo | Duración | Audio | Costo | Por qué ese modelo |
|---|---|---|---|---|---|
| **L3** "Me crearon con 3 herramientas" | `gemini_omni` | 10 s | nativo | **24** | Habla a cámara con diálogo literal; es el único que dio voz nativa aceptable |
| **L7** "Lo que la IA NO puede hacer" | `kling3_0` (`sound: off`) | 15 s | subtítulos | **16** | Mismo formato UGC que L3 pero sin voz nativa: se ahorra 8 cr y el karaoke ya está resuelto |
| **L4** "Un día en mi vida (que no existe)" | `seedance_2_5` `mode: omni_reference` | 18 s | música | **32,5** | Multi-escena en UNA generación — la alternativa (4 escenas sueltas) cuesta más y rompe el raccord |
| **L8** Dueto con @oniahq | — | — | — | **0** | **No genera nada**: b-roll existente + capturas del panel + tile verde. Solo montaje |

### Dos rutas, para que elijas

| Ruta | Qué incluye | Costo |
|---|---|---|
| **A — recomendada** | L3 gemini + L7 kling + L4 seedance 2.5 + L8 montaje | **72,5 cr** |
| **B — barata** | L3 y L7 ambos en kling `sound:off` (32) + L4 en 2 escenas seedance 480p (10) + L8 | **42 cr** |

⚠️ La ruta B baja el costo un 42 % pero L3 pierde la voz nativa, que es justo lo que hace
creíble la pieza de "detrás de escena". **Recomiendo la A**: 72,5 cr es el 3,4 % del saldo.

## Orden de ejecución

1. **L8 primero** — cuesta 0 y es puro montaje. Si algo del pipeline está roto, se descubre gratis.
2. **L7** (16 cr) — el formato UGC más simple, valida que el ancla sigue dando la cara correcta.
3. **L3** (24 cr) — mismo formato, ya con voz nativa.
4. **L4** (32,5 cr) — el más caro y el más ambicioso, al final y solo si los tres anteriores salieron.

**Gate entre cada uno:** se mira el render antes de disparar el siguiente. Si el ancla
derivó, se corta ahí y no se gastan los siguientes.

## Lo que NO se dispara sin resolver antes

- **L8 lleva voz Marcela obligatoria** (pieza de marca). Eso es ElevenLabs, gasto aparte,
  y va en **UNA sola llamada** — cuatro llamadas separadas dan cuatro prosodias pegadas
  (error ya cometido, ver el handoff).
- Las cuatro piezas piden palabra clave: L3 y L7 → **HUMO** (🟢 vivo), L8 → **SISTEMA**
  (🟢 vivo). Ninguna queda con CTA muerta.
