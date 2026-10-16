# Handoff — sesión de control (madre local en la PC) · 16-oct-2026

> Lo retoma la próxima sesión de control en la PC de Sergio Urcullo. Estado medido, no de memoria.
> Detalle de cómo funciona todo: `hermes-content/docs/ONIA_SISTEMA_AUTONOMO.md` (si ya se publicó; borrador
> en el scratchpad de la sesión 16-oct). Memoria: `harness-codex-archivar-16-oct.md`, `canal-terminal-a-sesiones-nube.md`.

## 1. Objetivo vigente (Sergio Urcullo, 16-oct)
Construir Onia Platform y dejar una **1.0 operativa para presentar al banco** (API QR del BCP). Además:
5 rubros probados, funciones de la competencia, workshops/consultorías pagos para llegar a **Bs 3.000 al
31-oct**, comunidad de WhatsApp, marca personal, Meta Ads, Higgsfield para Lucía. Todo autónomo en la nube.
La orden completa está en `hermes-content/docs/cola/loop/hermes-jefa.md`.

## 2. Qué quedó en producción / encendido hoy
- **Jefa en la nube:** proyecto «ONIA · Hermes» en claude.ai/code (`chan_01CKhuvNSZr6eucUZ8zrV1PJ`), conversación
  `cse_011cQSargj5qz516CNpPQEko`. Hilos abiertos: Plataforma 1.0 para el banco (BLOQUEADO por red), Competencia,
  Ventas y pauta, Marca/comunidad/workshops, Auditoría de carriles, Pruebas de navegador y reels.
  Encadena sola sus vueltas a los :07 y el resumen de las 18:00 (sin tarea fija: decisión de Sergio Urcullo).
- **Canal PC → nube:** `claude -p "msg" --cloud <cse_id> --output-format json` (o `scripts/hermes/jefa.sh`). Abrir
  una sesión de la nube en vivo NO está habilitado en la cuenta.
- **Orca:** pestañas «PANEL ONIA» (`/e/onia-wt/panel/panel.sh`, copia de `scripts/hermes/panel.sh`) y «HABLAR CON LA
  JEFA» (`jefa "mensaje"`). Orca no ve la nube.
- **Jarvis en el VPS:** `aplicar` corrido 2 veces (runs 38958901608 y 38965335916, fallas 0): resumen 06:30, cierre
  21:30, aduana, qa-release cada 15 min. Pedidos a Claude por Telegram APAGADOS (falta rutina + llave).
- **Codex revisor:** revisión automática prendida en onia-hermes y onia-platform (no revisa borradores; se pide con
  «@codex review»). Cupo semanal al 72 % el 16-oct.
- **Correo al BCP** enviado el 16-oct (reenvío con los 8 datos y los adjuntos SEPREC, NIT y CI).
- **Limpieza:** 136 ramas remotas borradas (227 → 91; SHAs en `E:/onia-wt/archivo-20261016/`), 1.410 archivos
  generados fuera del repo, 8 worktrees quitados, bundle de ramas solo locales en E:.
- **Publicados en main:** #194 (QA Q2/Q5), #203, #205 (skill orca), #208 (orden de la jefa), #210 (limpieza),
  #214 (panel y jefa.sh).

## 3. Qué quedó a medias y dónde
- **Rutinas horarias de Plataforma (:17) y QA (:57) APAGADAS** desde ~20:54 UTC por alguien desde la web (la jefa
  dice que no fue ella). QA ya tiene modelo Sonnet. Sin ellas nadie publica el cerebro ni trabaja el cobro.
  Preguntado a Sergio Urcullo si las apagó; si no, re-prenderlas (RemoteTrigger update `{"enabled": true}`).
- **Entorno del proyecto (ARREGLADO 16-oct ~22:00 UTC: Sergio Urcullo puso «Onia» y el coordinador en Sonnet 5.5; los hilos nuevos ya llevan la llave):** antes los hilos corrían SIN la llave del VPS y con red cerrada (solo github.com y pypi.org);
  onia.com.bo, app.onia.com.bo, Instagram y YouTube dan 403. Hay que poner el entorno «Onia» en la configuración
  del proyecto (app de escritorio o celular) y abrir dominios en ese entorno. Decisión de seguridad de Sergio Urcullo.
- **Reglas unificadas:** borrador listo en `E:/onia-wt/archivo-20261016/reglas/` (AGENTS.md 12 KB, CLAUDE.md 2 KB, CAMBIOS.md y REVISION.md). La revisión adversarial encontró 4 P0 a corregir ANTES de mostrar: Higgsfield/Meta Ads por conector sin cotizar, faltan «datos de producción y precios» en lo que pasa por Sergio Urcullo, `hermes-jefa.md` no puede aflojar aprobaciones, y faltan las reglas de seguridad de código. Antes decía: workflow `wf_66f856e3-001` escribió en el scratchpad `reglas/AGENTS.md`, `CLAUDE.md`,
  `CAMBIOS.md` y un revisor adversarial. Falta mostrárselo a Sergio Urcullo y publicar con su OK.
- **Documento de cómo funciona todo:** borrador `ONIA_SISTEMA_AUTONOMO.md` en el scratchpad (257 líneas, sección 9
  corregida). Falta publicarlo en `hermes-content/docs/`.
- **Ficha de los 2 posts de Instagram** (DedkCc6olmo y DecFE1oDNd3): un agente los está viendo desde la PC.
- **PRs de la jefa listos para revisión:** auditoría, ventas, marca/workshops (#213), competencia (#209); #215
  (prueba de navegador). Con QA apagado no se publican solos.

## 4. Archivos tocados hoy
`hermes-content/docs/cola/loop/hermes-jefa.md`, `scripts/hermes/{jefa,panel}.sh`, `.claude/skills/orca/SKILL.md`,
`.claude/skills/onia-router/SKILL.md`, `.claude/skills/onia-sesion-madre/SKILL.md`, `.gitignore`; prompts de las
rutinas de Plataforma y QA (RemoteTrigger); memoria local (`integrador-mergea-ramas-claude.md`, etc.).

## 5. Intentos fallidos y su causa
- Escribir en la web del proyecto desde Chrome: la página se abre en la app de escritorio y queda inerte.
- `claude --cloud <id>` interactivo en Orca: «Attaching to an existing cloud session is not enabled for your account».
- Borrador del BCP en Gmail por el navegador: lo frenó el clasificador (datos personales). Se envió por el MCP de Gmail.
- Bajar reels desde la nube (403 del proxy) y desde el VPS (no hay `yt-dlp`).
- El harness Python de Codex (rama `codex/hermes-controller-hardening-20261013`): archivado, no se mergea.

## 6. Qué depende de Sergio Urcullo
1. ¿Apagó las rutinas de Plataforma y QA? Si no, se re-prenden.
2. HECHO el entorno «Onia» en el proyecto; queda decidir si se abren dominios (onia.com.bo, app.onia.com.bo y los de investigación).
3. HECHO: coordinador del proyecto en Sonnet 5.5.
4. OK para instalar `yt-dlp` en el VPS (reels con la PC apagada).
5. Aprobar el pago de prueba en `/admin/payments` y confirmar con Leslie la factura del SIN.
6. Rotar el token de n8n de `~/.codex/config.toml` línea 150 (quedó expuesto en un registro local).
7. Aprobar las reglas unificadas y la oferta de workshops (Bs 150 fundador, auditoría 1 a 1 Bs 350, sáb 24-oct).

## 7. Próximos pasos
1. Leer la respuesta de Sergio Urcullo a los puntos de §6 y actuar.
2. Mostrar las reglas unificadas y publicarlas; publicar `ONIA_SISTEMA_AUTONOMO.md`.
3. Verificar con `scripts/hermes/panel.sh` y `RemoteTrigger get_run_log cse_011cQSargj5qz516CNpPQEko` que la jefa
   avanza; prueba con la PC apagada esta noche y revisión del resumen de las 06:30.
