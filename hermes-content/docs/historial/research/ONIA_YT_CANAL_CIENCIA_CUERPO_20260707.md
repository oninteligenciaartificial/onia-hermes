# Canal YouTube "La Ciencia de tu Cuerpo" — research + plan + prompt (2026-07-07)

Carril I (research). Segundo concepto de canal (distinto de "ONIA Automatiza" y de
Higgsfield H). Para retomar. Investigación con fuentes.

## Decisión
Canal **"La Ciencia de tu Cuerpo"** (español, long-form 8-12 min): educación
científica visualizada sobre cómo funciona el cuerpo (qué le hace el azúcar, qué
pasa cuando dormís, sistema inmune, envejecimiento). Estilo Kurzgesagt. **Mejora la
salud ENSEÑANDO, no recetando.** Canal de vistas/ad-revenue con **CPM alto** (salud
paga más que historia). Distinto de "ONIA Automatiza" (que vende el software).

## Por qué (research)
- **Salud = CPM alto (~$10-20 vs $4-8 de historia)** pero es **YMYL** ("tu dinero o
  tu vida"): YouTube/Google la vigilan mucho más. Contenido de salud IA que da
  **consejos** = baneo. La versión segura = **explicar cómo funciona el cuerpo**
  (educación), no prescribir.
- **Higgsfield** hace clips cinematográficos cortos (5-15s) y visuales abstractos
  (cuerpo/células/flujos) = su fuerte. NO hace secuencias largas coherentes ni
  física real. Costo ~6 créditos/clip Kling → ~5-7 videos/mes en plan Plus. → Vos
  generás visuales + **montás + narrás**.
- **El foso NO son los píxeles IA — es el GUION.** YouTube (jul-2025 "inauthentic
  content"; ene-2026 terminó 16 canales/35M subs) banea la **falta de aporte
  humano**, no la IA. Sobrevive: guion investigado + tesis propia + voz de calidad +
  movimiento real. "ChatGPT crudo → voz genérica → stills → subir" muere.

## Guardrails YMYL (críticos)
- CERO consejo médico/diagnóstico/"cura". Solo EXPLICAR.
- TODA afirmación con **fuente real** (estudios peer-reviewed, OMS, NIH). Nada
  inventado. Fuentes en la descripción.
- Disclaimer por video: "educativo, no reemplaza consejo médico profesional".
- Cadencia 2-3/semana (no tandas masivas). Toggle "hecho con IA" ON al subir.

## Organización (no choca)
Sesión nueva `yt-ciencia-cuerpo`, dueña de `hermes-content/channels/ciencia-cuerpo/**`
(carpeta nueva). REUSA (no edita) Higgsfield MCP + content-engine. Upload autónomo =
handoff a n8n/infra, pero **el guion siempre pasa por revisión humana**.

## Prompt de arranque (copy-paste en sesión nueva)
```
Sos una sesion NUEVA de ONIA: "yt-ciencia-cuerpo". Dueño de carpeta NUEVA:
hermes-content/channels/ciencia-cuerpo/**. NO edites scripts/content-engine, skills de
video, ni workflows n8n de otras sesiones — los REUSAS (Higgsfield MCP, content-engine),
no los modificas. Template YT propio va en TU carpeta. Coordina con COORDINATION_MANIFEST.

Objetivo: canal YouTube faceless "La Ciencia de tu Cuerpo" (espanol, long-form 8-12 min)
— educacion cientifica visualizada de como funciona el cuerpo. Estilo Kurzgesagt. Mejora
la salud ENSEÑANDO, no recetando. Canal de vistas/ad-revenue (CPM alto), distinto de
ONIA Automatiza.

REGLAS DURAS — SALUD ES YMYL (te tumban si fallas):
- CERO consejo medico, diagnostico, "cura". Solo EXPLICAR como funciona el cuerpo.
- TODA afirmacion con FUENTE real (peer-reviewed, OMS, NIH). Nada inventado. Citar en
  la descripcion. Disclaimer por video ("educativo, no reemplaza consejo medico").
- ANTI-BANEO: el foso es el GUION investigado + tesis propia + narracion de calidad +
  movimiento real. Prohibido ChatGPT crudo -> voz generica -> stills -> subir.
- GASTO: Higgsfield/creditos/APIs = OK de Sergio antes; modelos baratos (Kling ~6cr).
- NO publicar sin aprobacion de Sergio.

TAREAS:
1. ciencia-cuerpo/PLAN.md: estrategia (formato, cadencia 2-3/sem, 20 temas con
   angulo-tesis y fuente c/u, guardrails YMYL, tools de tendencia). El diferencial es la
   BIBLIOTECA DE GUIONES investigados.
2. Pipeline v1: tema -> guion investigado CON FUENTES (editado a mano) -> visuales
   Higgsfield (cuerpo/celulas, clips 5-10s) -> montaje + narracion (voz IA calidad) ->
   miniatura + titulo.
3. Script de subida (YouTube Data API v3, node, tu carpeta): OAuth, disclosure IA ON,
   DRY primero. Documenta auditoria Google Cloud (sin ella sube privado).
4. 1 VIDEO PILOTO de punta a punta (sin publicar) con fuentes visibles, para OK de Sergio.
5. Handoff a n8n: el guion SIEMPRE pasa por revision humana; solo produccion/subida se
   automatiza.

GATES: piloto renderiza + fuentes citadas; upload DRY; nada publicado sin OK. Commit
conventional. Regla "todo funcional".
```

## Fase 0 (Sergio)
Crear el canal + proyecto Google Cloud con OAuth + pasar la auditoría de compliance
(sin ella las subidas quedan privadas). Mismo requisito que el otro canal.

## Fuentes
YouTube inauthentic-content policy (jul-2025), OutlierKit crackdown, Higgsfield pricing
+ Kling 3.0 + temporal-consistency, CPM por nicho (salud YMYL alto). Detalle en el brief
del carril I (2026-07-07).
