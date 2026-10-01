# Handoff — madre-local (sesión MADRE, en la PC de Sergio Urcullo)

Regla: CLAUDE.md §1 «Sesión MADRE local + carriles en la nube». La madre ordena a todas **por mensaje** y hace
lo que exige la PC. El desarrollo sigue en la nube.

## 0. Primero (en este orden)

1. **Medir los canales**, sin suponer. Anotar el resultado en la fila 3 de
   `hermes-content/docs/ONIA_CAPACIDADES_DE_LAS_SESIONES.md`.
   - **Madre → nube:** ¿tenés `create_trigger` (MCP de Claude Code Remote)? Mandá un ping a Plataforma
     (`session_01VGmpNv4eSMnpA3wXrypR4L`) pidiendo «PONG».
   - **Nube → madre:** pasale tu id de sesión a Plataforma en ese ping. Plataforma te devuelve un mensaje.
2. **Crear la skill `onia-sesion-madre`** en `.claude/skills/onia-sesion-madre/SKILL.md`. Va con:
   - los ids vivos;
   - cómo se manda un mensaje (local→local `SendMessage`; con la nube, rutina de un disparo);
   - el formato del mensaje: de quién, qué pide, para cuándo, cómo contestar;
   - la regla de qué se avisa (solo lo que le sirve a la otra sesión).
   Sumarla al índice de `onia-router`.
3. **Avisarle a cada sesión de la nube su tarea**, por mensaje. Sesiones vivas el 1-oct 19:00 UTC:

   | Sesión | id | Su carril |
   |---|---|---|
   | Control (orquestador viejo) | `session_0154pQRYB6icZn9Z3SuJp35D` | Que te pase lo que tenía en vuelo (hermes-jarvis, tablero) y deje de orquestar. Archivarla lo decide Sergio Urcullo |
   | Plataforma | `session_01VGmpNv4eSMnpA3wXrypR4L` | Desarrollo de Onia Platform, publicar y el runner del SIAT |
   | Ventas y pauta | `session_01BnctfaNRsm3ogJ46A7B5P5` | Pauta y prospección. Espera que se reconecte el conector de Meta Ads (tarea B) |
   | Marca personal | `session_012ppFowADbJNtZ6WBMtqpuf` | Contenido. Tiene el PR #76 abierto |
   | Lucía v4 | `session_01RRD6v9rmBavDoXx1rG2mEn` | Espera el OK de Sergio Urcullo a Kling 3.0 y a un tope de ~150 créditos por mes |

## 1. Objetivo

Ordenar a todas las sesiones por mensaje y destrabar lo que necesita la PC para cobrar al primer cliente.
**Hecho =** los canales están medidos, la skill está creada, cada sesión recibió su tarea, y las tareas A-D de
§7 tienen resultado mandado a Plataforma por mensaje.

## 2. Qué quedó EN PRODUCCIÓN (lo llena esta sesión al terminar)

Ya estaba al abrir:
- Plataforma `release-a7f228c0` con Crece en 4 usuarios.
- Web onia.com.bo publicada con Crece en 4.
- Verificación por WhatsApp en modo `plantillas`.
- Bot de ventas en `c7f44ba5`.
- Qué sale en la 1.0: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`.

## 3. Qué quedó a medias y dónde

- **Plantillas de WhatsApp en Meta:** 4 en revisión (bienvenida_agenda, bienvenida_panel,
  prueba_por_terminar, primera_cita). `onia_codigo_verificacion` (AUTENTICACIÓN) está **bloqueada por Meta
  a nivel de cuenta**: error code 10 / subcode 2388185, «esta cuenta no tiene permiso para crear una
  plantilla». No es el texto: falla con cualquier contenido. El negocio está verificado y la cuenta sana.
- **SIAT:** el runner nuevo, que valida cada paquete, está en `/opt/onia-siat/runner-20260929/emisor-v2/`
  (rama `wip/siat-validar-cada-paquete`, sin merge). Los comandos de las etapas VI y IX están escritos en
  `BITACORA.md`, **sin lanzar**. Esperan las capturas del portal.
- **Web 1.0, correcciones:** rama `wip/web-v1-correcciones-20261001` (home nueva + legales `75667dad`), sin
  publicar. Espera el OK de Sergio Urcullo. Las comparativas quedaron en la nube; hay que rehacerlas mirando
  la rama.

## 4. Archivos

`CLAUDE.md` · `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` · `handoff/onia-1.0-nube.md` (detalle completo) ·
`/opt/onia-siat/runner-20260929/BITACORA.md` (en el VPS).

## 5. Intentos fallidos

- Plantilla de autenticación: se probó con payload mínimo, sin TTL ni pie, y por `upsert_message_templates`.
  Siempre el mismo error. No repetirlo por API: el motivo lo muestra WhatsApp Manager.
- **No usar una plantilla UTILITY con el código como atajo:** Meta lo prohíbe y arriesga el número de ventas.

## 6. Qué depende de Sergio Urcullo

- Estar frente a la PC para los paneles con su login.
- Las capturas del SIAT, sacadas por él a mano.
- El chip prepago para la prueba del WhatsApp del cliente.

## 7. Próximos pasos (en este orden)

**A. Meta — plantilla del código (lo que más destraba).**
1. En WhatsApp Manager, cuenta «Onia» (WABA 4429061034078857): Plantillas → Crear → **Autenticación**.
   Leer y capturar el motivo que muestra.
2. En **Configuración de pagos** de esa WABA: ¿hay un método de pago? Si falta, prepararlo y que Sergio
   Urcullo lo cargue. Nunca cargar datos de pago la sesión.
3. Si Meta la deja crear: nombre `onia_codigo_verificacion`, idioma `es`, copiar código, vence en 10 min.
   Anotar el resultado acá.

**B. Meta Ads.** Reconectar el conector de Meta Ads con el usuario que administra ONIA Ads.

**C. SIAT (Sergio Urcullo a mano; la sesión NO abre el portal).** Pedirle capturas de:
- las filas 4 y 6 del listado de la etapa VI;
- el «Listado de Etapas»;
- si se puede, el CAFC del piloto para los motivos 5 a 7.

Guardarlas en `hermes-content/integrations/siat/` o dejar dicho dónde están.

**D. Web 1.0.** Abrir la rama `wip/web-v1-correcciones-20261001` renderizada y mostrársela a Sergio Urcullo.
Con su OK explícito, se publica.

**Cada resultado** se le manda a Plataforma por mensaje en el momento. Este archivo se actualiza solo al
cerrar la madre, para que otra madre pueda retomar.
