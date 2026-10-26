# Canal YouTube faceless "ONIA Automatiza" — research + plan + prompt (2026-07-06)

Carril I (research). Para retomar más adelante. Investigación con fuentes.

## Decisión
Canal **"ONIA Automatiza"** (español), faceless/automatizable: casos cortos de
**automatización con IA para pymes latinas** (turnos, WhatsApp, cobros, historia
clínica). Nicho AI-tools/SaaS: CPM alto (US$12–18) y **abierto en español**. Público
comprador B2B → **cada video funnelea a DentalGest/GestiOS/servicios**. El video ES el
anuncio del producto. Inglés después, por doblaje de los mismos videos.

**Insight clave (arbitraje de idioma):** YouTube trata cada idioma como pool separado.
Lo saturado en inglés (IA, tech, finanzas, "top 10") sigue **abierto en español**.
Producir en ES lo que ya está probado que gana en EN.

## Dónde ver temas visibles (EN + ES)
- **vidIQ** (free/pago): ideación y tendencias, search volume vs competencia. La mejor
  para "tema ganable". Filtra por país/idioma.
- **1of10** (pago ~$348/año): arma faceless — detecta *outliers* 2–6 semanas antes.
  Copiás el FORMATO, no la identidad.
- **Google Trends** (free): valida demanda por país/idioma en el tiempo.
- **Autocomplete de YouTube + pestaña Trends** (free): intención real de búsqueda.
- **TikTok Creative Center** (free): tendencias short-form por país e industria.
- **Regla de oro:** *outlier en 1of10 dentro de un nicho <20K canales en español* =
  tema casi seguro.

## Nichos que ganan (2025-26) que Onia puede hacer
AI tools/tech news (CPM $12–18, abierto en ES), Digital Marketing/SaaS ($12–18),
software tutoriales ($12–18). Ingresos faceless reportados a ~500K views/mes:
SaaS/reviews $5–15K, AI tools $6–16K (referencia optimista, no garantía).

## ⚠️ Anti-baneo (política YouTube jul-2025 "inauthentic content") — REAL
Se **desmonetiza/elimina** el contenido faceless IA masivo/templado (caso real: canal
83K subs eliminado entero). Se PERMITE IA con **valor humano**: ángulo/análisis propio,
fuentes citadas, variedad real entre videos, toggle "hecho con IA" activado al subir.
**Ventaja Onia:** el canal es motor de captación al producto, NO vive del AdSense →
puede invertir en originalidad (lo único que sobrevive la política).

## Cómo automatizar la subida
YouTube Data API v3: upload = 1.600 unidades, cuota diaria 10.000 → **~6 videos/día**.
Requiere OAuth 2.0 (`youtube.upload`) + **pasar la auditoría de compliance de Google
Cloud** (gratis) — SIN ella los videos suben **privados**. n8n ya tiene nodo YouTube.

## Organización (para que NO choque)
Sesión NUEVA `yt-canal`, dueña de carpeta nueva
`hermes-content/channels/onia-automatiza/**`. REUSA (no edita) el content-engine y
Higgsfield MCP. La subida autónoma se **hand-off a la sesión n8n/infra**.
Fases: 0 setup (Sergio: canal + Google Cloud OAuth + auditoría) · 1 pipeline v1 + 1
video piloto (sin publicar, OK de Sergio) · 2 loop autónomo (n8n) · 3 medir/escalar +
inglés por doblaje.

## Prompt de arranque (copy-paste en la sesión nueva `yt-canal`)
```
Sos una sesion NUEVA de ONIA: "yt-canal". Dueño de carpeta NUEVA:
hermes-content/channels/onia-automatiza/**. NO edites scripts/content-engine, skills de
video, ni workflows n8n de otras sesiones — los REUSAS (Higgsfield MCP, content-engine),
no los modificas. Template YT propio va en TU carpeta. Coordina con COORDINATION_MANIFEST.

Objetivo: canal YouTube faceless "ONIA Automatiza" (espanol) — automatizacion con IA
para pymes latinas, que funnelea a DentalGest/GestiOS/servicios. Cada video ES un anuncio.

REGLAS DURAS:
- GASTO: Higgsfield/creditos/APIs pagas = pedir OK a Sergio antes; modelos baratos por
  defecto.
- NO publicar ningun video sin aprobacion de Sergio.
- ANTI-BANEO (YouTube jul-2025): cada video con angulo/analisis propio + fuentes +
  VARIEDAD real + toggle "hecho con IA" ON. Prohibido: solo TTS sobre stock, plantilla
  identica repetida, tandas masivas iguales.

TAREAS:
1. onia-automatiza/PLAN.md: estrategia (nicho, formato, largo, CTA al producto,
   calendario, guardrails anti-baneo) + herramientas de tema (vidIQ, 1of10, Google
   Trends, autocomplete YouTube, TikTok Creative Center; regla outlier <20K canales ES).
2. Pipeline v1 en tu carpeta: seleccion de tema -> guion con angulo+fuentes ->
   produccion reusando Higgsfield + content-engine/Remotion (template YT 16:9 propio) ->
   miniatura + titulo.
3. Script de subida (YouTube Data API v3, node, en tu carpeta): OAuth, disclosure IA ON,
   modo DRY primero. Documenta la auditoria de Google Cloud (sin ella sube privado).
4. 1 VIDEO PILOTO de punta a punta (sin publicar) para OK de Sergio.
5. Handoff: doc de como la sesion n8n/infra lo vuelve workflow autonomo (cron -> pipeline
   -> upload, <=6/dia).

GATES: piloto renderiza OK; upload probado en DRY; nada publicado sin OK. Commit
conventional. Regla "todo funcional": el pipeline corre de verdad, no solo commiteado.
```

## Fase 0 — lo que hace Sergio (en paralelo)
1. Crear el canal de YouTube "ONIA Automatiza".
2. Google Cloud: proyecto + OAuth + **pasar la auditoría de compliance** (único bloqueo
   real; sin ella las subidas quedan privadas).

## Fuentes
vidIQ vs TubeBuddy, 1of10.com, TikTok Creative Center, OutlierKit (niches), Virlo
(RPM), YouTube Data API quotas (Getphyllo), compliance audits (Google devs), política
jul-2025 (Knolli/Fliki), n8n YouTube integration.
