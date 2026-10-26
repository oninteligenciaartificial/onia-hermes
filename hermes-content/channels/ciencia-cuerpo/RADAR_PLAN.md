# RADAR_PLAN — "Radar Ciencia-Cuerpo"

Spec de la automatización de detección de tendencias para el canal
`yt-ciencia-cuerpo`. **Estado: especificación aprobada, sin construir** (Sergio
pidió research + decisión primero). Este doc es el contrato que ejecutan la
Fase 1 (esta sesión, cuando Sergio dé luz verde) y la sesión de infra (carril G,
Fase 3).

Dueño de carpeta: `hermes-content/channels/ciencia-cuerpo/**` (carril L). El
worker vivirá en `pipeline/radar/`.

## Decisiones tomadas (2026-07-08)

1. **Alcance: completo.** Funde las 4 señales y produce un shortlist que mapea
   cada tendencia a lo nuestro: `tema → ángulo(mecanismo) → estilo → modelo →
   costo`. NO auto-redacta guiones (eso sigue siendo trabajo humano asistido,
   ver `PLAN.md` §8). NO auto-produce.
2. **Fuentes: RSS ciencia + Higgsfield + YouTube API key** (read-only, gratis).
   Sin API de tendencias paga. Google Trends descartado como dependencia (API
   oficial en alpha restringida; `pytrends` archivado abr-2025 — fuentes en
   `PLAN.md` §11 / esta sesión).

## Reúso (regla de no duplicar)

- **Patrón de skill:** `hermes-content/docs/historial/skills/tendencias-ia-redes.md` — jerarquía
  de fuentes (Nivel 1/2/3), reglas de verificación, "no rellenar con
  especulación". Se porta el criterio, no se edita esa skill (es de otro
  dominio: IA/negocios).
- **Harness de automatización:** el workflow n8n vivo **"ONIA - Web Factory VPS
  Radar"** (`aHFLqEtzqvq6SE3e`, Lun-Sáb 07:10) ya prueba el patrón cron → worker
  en `/opt/onia-hermes`. El radar de ciencia lo **espeja** (worker propio en mi
  carpeta), no lo edita — es carril B/H.
- **Fuentes programáticas Higgsfield:** `get_youtube_explainer_presets` y
  `models_explore(action:list)` — ya verificadas vía MCP esta sesión.
- **Schemas de salida:** el shortlist reusa el shape de
  `pipeline/schemas.mjs` (`topics-backlog.json` + `shot-list.json`) para que un
  candidato aprobado entre al pipeline sin re-mapear.

## Las 4 señales (todas gratis/casi, alcanzables desde el VPS)

| Señal | Qué aporta | Fuente | Acceso |
|---|---|---|---|
| Qué explicar | candidatos de tema | RSS ciencia: NIH, ScienceDaily, EurekAlert!, PubMed (por término MeSH: sueño, inmune, metabolismo…) | Gratis. YMYL-safe por diseño: cada ítem trae fuente primaria (lo que el canal exige) |
| Qué ya pega | demanda + hueco | YouTube Data API `videos.list?chart=mostPopular` (1 unidad de quota) + `search.list` (100) en español; velocidad de vistas = vistas/edad | **API key read-only, gratis, NO requiere la auditoría de subida** |
| Estilos + modelos | estética fresca | Higgsfield `get_youtube_explainer_presets` + `models_explore(action:list)` diffeado en el tiempo (detecta modelos nuevos: Seedance 2.0, Veo 3.1…) | MCP, ya disponible |
| Modelos nuevos | releases de IA | RSS: fal.ai, Replicate, blogs de labs (lista en la skill existente) | Gratis |

## Procesamiento

Paso LLM barato (patrón existente n8n → SSH → `docker exec onia-center` →
LiteLLM `gpt-4o-mini`; ver `ONIA_N8N_AUTOMATIONS_LIVE_2026.md`):

1. **Puntuar** cada candidato de tema: `demanda × hueco × YMYL-safety × fit con
   los 20 temas del canal`.
2. **Mapear a lo nuestro** cada sobreviviente: ángulo-mecanismo (nunca consejo),
   preset de estilo que mejor calza, modelo IA barato (default `kling3_0_turbo`
   para clips hero, `nano_banana_pro` para stills), costo estimado en créditos.
3. **Emitir** shortlist ranqueado (top 5/día o top 10/semana, según cadencia) a
   `pipeline/radar/incoming/*.json` + digest a Telegram.

## Salida + gate humano (duro)

- El radar **nunca** escribe directo en `topics-backlog.json`. Escribe en
  `pipeline/radar/incoming/`.
- Digest Telegram a Sergio: `"5 candidatos: [tema] — demanda alta/oferta baja —
  fuente NIH — estilo 2D-Illustrator — modelo kling3_0_turbo — ~Xcr.
  Aprobar/descartar"`.
- Sergio aprueba → el candidato pasa a `topics-backlog.json` con `status:
  backlog` → pipeline normal (que ya exige aprobación humana del guion y del
  gasto antes de producir).

## Fases

- **Fase 0 — HECHO:** research + decisión + este doc.
- **Fase 1 — local, cero gasto, cero credenciales nuevas:** worker en
  `pipeline/radar/` que lee SOLO las RSS de ciencia + Higgsfield MCP y escupe el
  shortlist a JSON. Prueba que las fuentes sirven. Corre a mano. Sin riesgo.
  *(Espera luz verde de Sergio para construir.)*
- **Fase 2 — +YouTube API key:** agrega la señal de demanda/competencia. La key
  va a credencial n8n / env del VPS, **nunca al repo** (ya cubierto por
  `.gitignore`: `hermes-content/channels/*/credentials/`).
- **Fase 3 — n8n cron + Telegram:** autónomo, digest diario/semanal, gate
  humano. Lo cablea el carril G (infra); yo entrego el worker + el runbook.

## Único bloqueo para Fase 2 (acción de Sergio)

Crear una **API key read-only de YouTube** (distinta del OAuth de subida, y que
**NO** necesita la auditoría de compliance de Google porque es solo lectura):

1. [console.cloud.google.com](https://console.cloud.google.com) → mismo proyecto
   que el OAuth de subida (o uno nuevo).
2. "APIs y servicios" → habilitar **YouTube Data API v3**.
3. Credenciales → Crear credenciales → **Clave de API**.
4. Restringir la clave → API: solo *YouTube Data API v3* (recomendado; se puede
   IP-restringir al VPS más adelante).
5. Pasármela por canal seguro → va a credencial n8n / `/root/.hermes/.env` del
   VPS, no al repo.

La Fase 1 **no** necesita esta key: arranca con RSS + Higgsfield apenas Sergio dé
la orden de construir.

## Fuentes de esta investigación (2026-07-08)

[YouTube Data API — Videos: list (chart=mostPopular, key-only)](https://developers.google.com/youtube/v3/docs/videos/list) ·
[Google Trends API alpha (acceso restringido)](https://developers.google.com/search/apis/trends) ·
[pytrends archivado](https://github.com/GeneralMills/pytrends) ·
Higgsfield MCP (`get_youtube_explainer_presets`, `models_explore`) verificado en vivo.
