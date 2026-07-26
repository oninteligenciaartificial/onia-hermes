# Handoff a infra (carril G) — Radar Máquina Humana como cron n8n

Para la sesión **infra** (dueña de n8n / VPS / Supabase). El worker del radar
ya está construido y probado en local (Fase 1). Esto lo vuelve un cron semanal
en el VPS que manda el shortlist a Telegram. Fuente: sesión `yt-maquina-humana`.

## Qué es / qué NO hace (gates duros — no se saltan)

- **Read-only, CERO gasto.** Lee RSS de ciencia + un snapshot de Higgsfield →
  imprime un **digest de candidatos**. NO genera media, NO llama a APIs pagas,
  NO llama a LLM, NO publica.
- **NUNCA escribe `topics-backlog.json`** ni produce nada. Solo informa. Sergio
  lee el digest y **promueve a mano** los temas que quiera.
- Cada candidato lleva `needs_source_verification: true`: al promoverlo, su
  `research-brief.json` debe traer fuente **peer-reviewed / NIH / OMS** antes de
  producir (regla YMYL §4 del canal). El cron no afloja eso.
- El cron solo **dispara el worker** y **manda el stdout a Telegram**. Nada más.

## Precondiciones en el VPS

1. **Node** ≥ 18 (probado en v24).
2. **La carpeta del canal desplegada**: `hermes-content/channels/ciencia-cuerpo/`
   en el VPS. Confirmar la ruta exacta según el deploy actual de hermes-content
   (patrón conocido: `/opt/onia-hermes/...`; el deploy es por tarball, no git).
3. **`npm install`** (o `npm ci`) en esa carpeta — trae `rss-parser`.
   `node_modules` está gitignored y no viaja en el tarball, así que hay que
   instalarlo en el VPS una vez (y tras cada bump de deps).
4. **Red saliente** para leer los feeds (ScienceDaily, Neuroscience News).
5. El snapshot `pipeline/radar/higgsfield-snapshot.json` es **estático** (viaja
   en el repo). El cron NO lo refresca; refrescarlo (para detectar estilos/
   modelos nuevos de Higgsfield) es tarea manual vía MCP desde la sesión de
   canal — cero gasto, es lectura.

## Comando que corre el cron

```bash
cd <ruta-canal-en-vps> && node pipeline/radar/radar.mjs --live
```

- Imprime el **digest** a stdout (texto plano, sin markdown).
- Escribe `pipeline/radar/incoming/shortlist-<fecha>.json` (local al VPS,
  gitignored). Ese archivo es opcional para el cron; lo que importa es el stdout.

## Workflow n8n (patrón VPS — sin `$env`)

Mismo patrón que los crones vivos (ver `hermes-content/docs/ONIA_N8N_AUTOMATIONS_LIVE_2026.md`):

1. **Schedule Trigger** — semanal recomendado (ej. Lunes 08:00 America/La_Paz).
   Tunable a diario si el volumen lo justifica.
2. **SSH** (credencial `ONIA VPS SSH`, id `4XKauEX3b6cqaDhW`) — corre el comando
   de arriba y captura stdout.
3. **Telegram** (credencial `telegramApi`, chat id **hardcodeado** `6830070978`) —
   manda el stdout como mensaje.
   - **Sin markdown, o `parse_mode: "HTML"`** — para no comerse los guiones
     bajos de las URLs (bug documentado: Telegram Markdown legacy rompe con `_`).
   - Telegram corta a 4096 chars: si el digest se pasa, el worker ya limita a
     top 10; si aún así es largo, mandar top 5 o partir en 2 mensajes.
4. **Sin `$env`.** Chat id hardcodeado, secretos solo en credenciales n8n.

## Vacaciones (contexto 2026-07)

Sergio de vacaciones y los otros agentes de contenido quedaron **pausados**.
Recomendación: **crear este workflow DESACTIVADO** y activarlo cuando vuelva —
consistente con esa postura. Es seguro correrlo igual (read-only, cero gasto,
no publica), así que es decisión de infra; pero por defecto, desactivado.

## Checklist de handoff (infra)

- [ ] Confirmar ruta del canal en el VPS + correr `npm install` ahí.
- [ ] Probar el comando a mano por SSH y ver el digest.
- [ ] Crear el workflow n8n (Schedule → SSH → Telegram), **DESACTIVADO**.
- [ ] Probar ejecución manual (que el digest llegue a Telegram, sin romper por `_`).
- [ ] Registrar el id del workflow en `ONIA_N8N_AUTOMATIONS_LIVE_2026.md`.
- [ ] Activar cuando Sergio vuelva de vacaciones.

## Futuro (Fase 3+, opcional, mejora de calidad)

- **Paso LLM** vía el patrón `n8n → SSH → docker exec onia-center → LiteLLM`
  (`gpt-4o-mini`) para afinar el etiquetado de tema y redactar mejor el gancho
  del título. El worker ya deja el terreno listo (el score y los temas salen en
  el JSON); el LLM solo reordena/reescribe.
- **Botones inline** en Telegram para promover un candidato a `topics-backlog`
  sin entrar al repo (cierra el gate humano desde el celular).

## Muestra del digest (salida real del worker)

```
Radar Maquina Humana - 2026-07-10 (modo live)
Leidos 127 items | califican 81 | top 10

1. [58] (Cuerpo / rendimiento fisico) Scientists just discovered what coffee is really doing to your gut and brain
   hook: "Como funciona tu cuerpo por dentro" | estilo: 2D Illustrator | fuente:por-verificar
   lead: ScienceDaily - Psychology - https://www.sciencedaily.com/releases/2026/05/260502233911.htm
...
Gate humano: revisar, elegir, y recien ahi pasar a topics-backlog.
Ninguno se produce sin fuente peer-reviewed/NIH/OMS en su research-brief.
```
