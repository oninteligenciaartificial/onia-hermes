# PostHog + agente IA que enseña qué mejorar del producto

- **Fuente:** https://www.instagram.com/p/Dbxir78tR3R/ · 78 s · inglés
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-Dbxir78tR3R.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-Dbxir78tR3R.md](transcripciones/2026-08-11-Instagram-Dbxir78tR3R.md)

## Qué dice realmente

Creador a cámara con micrófono portátil. Hook (00:00-00:11): los cursos de "vibe coding" y
gestión de producto están siendo reemplazados por apps de autoaprendizaje; muestra el perfil
de un instructor en Maven y una lista de precios — asesorías de $47 a $300/hora, bootcamps de
$999 a $30.000 (cifras del propio creador, sin fuente mostrada — **verificar** antes de
repetirlas, incluso como referencia retórica).

Arquitectura que propone, con captura de cada paso (00:12-00:53):

1. Armar una app con un prompt ("vibe coded", puede ser mala).
2. Conectarla a PostHog: `npx @posthog/wizard@latest` y luego
   `npx @posthog/wizard mcp add https://mcp.posthog.com/mcp` (comandos reales de PostHog —
   **verificar** que sigan vigentes antes de correrlos).
3. Sumar un MCP de NotebookLM al agente de IA elegido — cita tres repos de GitHub
   (`Pantheon-Security/notebooklm-mcp-secure`, `jacob-bd/notebooklm-mcp-cli`,
   `Cezial/notebooklm-mcp-server`). Son proyectos de terceros, no un producto oficial de
   Google — **verificar** antes de instalar cualquiera.
4. Crear una tabla `product_lessons` (columnas `id`, `created_at`, `evidence`, `lesson`,
   `recommended_change`, `success_metric`, `result`) en Airtable, Notion, Supabase o Google
   Sheets.
5. Conseguir usuarios reales (lista canales: Reddit, X, LinkedIn, TikTok, Instagram, Product
   Hunt, cold outbound) para que PostHog tenga datos de embudo (`View Product` → `Add to
   cart` → `Checkout`).

El corazón del video es el prompt del "Skill" que muestra completo en pantalla (00:32-00:53):
el agente debe leer las lecciones previas, consultar PostHog (funnels, retención, rutas de
usuario, grabaciones de sesión, encuestas y errores) desde la última lección, revisar qué
cambió en la app, juzgar si el cambio anterior movió su métrica, encontrar el punto de mayor
apalancamiento que el dueño todavía no entiende de sus usuarios, guardarlo como fila nueva con
evidencia + lección + cambio recomendado + métrica de éxito, y mandar esa lección a NotebookLM
para generar audio, guía de estudio, flashcards y quiz — sin repetir nunca una lección
anterior. El tramo 00:54-01:10 lo ilustra con un embudo real: *"all three quit here"* →
*"fix this first"*, un cambio, deploy, y la siguiente corrida evalúa si mejoró.

Cierre a cámara: *"Follow your boy instead"*. Antes de esa frase dice (hablado, no aparece en
pantalla) que no hacía falta pagar US$8.000 por un curso para aprender esto — cifra que ni
siquiera coincide con los precios que sí mostró en pantalla (999 a 30.000). Es autopromoción
del creador, no un caso de cliente real; no se ve ninguna métrica de antes/después.

## Veredicto: MEJORA LO ACTUAL — el patrón sirve, la ejecución mostrada es de terceros sin probar

No es humo: el prompt está completo, el schema de la tabla es concreto y el bucle
(evidencia → lección → cambio → reevaluación) es una arquitectura real, no una promesa vaga.
Pero tampoco es "SIRVE YA": exige dar de alta PostHog (plataforma nueva, no evaluada — alta
sujeta a la regla de gasto en plataformas aunque tenga free tier) y el reemplazo de NotebookLM
por MCPs no oficiales es un riesgo innecesario. Lo que sí encaja sin fricción es la **forma**:
ONIA Center ya corre agentes con cron→SSH→docker exec→Supabase (Contenido/Finanzas/Vendedor);
sumar un cuarto agente "Producto" que lee analítica real y escribe lecciones en Supabase es la
misma arquitectura que ya operamos, no una apuesta nueva.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| onia-plattform (agentes ONIA Center) | Adaptar el patrón lecciones-con-evidencia a un agente "Producto" en Supabase, sin depender de NotebookLM (usar la voz Marcela/ElevenLabs que ya tenemos si se quiere audio) |
| Marketing con IA / canales faceless | Copiar el FORMATO (crítica a curso caro → arquitectura gratis con capturas de pantalla → "seguime en vez de pagar") para los canales K/L |
| Infra | Si se evalúa PostHog, primero consulta gratis del free tier y permiso explícito de Sergio antes de dar de alta la cuenta |

## Riesgo

Los MCP de NotebookLM que muestra son repos de terceros no oficiales (Google no publica una
API pública de NotebookLM) — pueden romperse sin aviso o pisar los términos de uso; no hace
falta copiarlos, ONIA ya tiene su propio pipeline de voz. Los precios de cursos y de las
suscripciones de IA (la mayoría listadas a US$20/mes, dos marcadas como gratis) son
afirmaciones del creador sin fuente mostrada — no repetirlas como dato propio. Y el cierre
hablado (US$8.000) no coincide con los precios que el mismo video mostró en pantalla, señal de
que son cifras retóricas, no datos duros.
