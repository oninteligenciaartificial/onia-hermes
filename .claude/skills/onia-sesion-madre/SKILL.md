---
name: onia-sesion-madre
description: Coordinar las madres locales, el envío entre sesiones y el relevo de contexto de ONIA; usar al iniciar, despachar o transferir un carril.
---

# Sesión madre: coordinar y transferir

Aplicar junto con `equipo-de-agentes` para contratos y `onia-continuidad` para estado por evento. En Codex, la última orden directa de Sergio Urcullo y el bloque de precedencia de `CODEX.md` mandan sobre ejemplos fechados de `CLAUDE.md`, esta skill y handoffs. Método aquí; estado, IDs y permisos efectivos se confirman en el handoff del carril y en el runtime. No usar los nombres, modelos, porcentajes de cuota o triggers antiguos como inventario vivo.

## Inicio de una coordinación

1. Identificar área y dueña activa: Desarrollo-Infra lleva Platform, Hermes/QA e infraestructura; Marketing lleva Marca, Lucía y Ventas/pauta. Ambas madres son locales y solo **asignan, revisan pruebas y resumen**; un worker ejecuta cada oficio. Coordinar dependencias entre áreas sin apropiarse de la cola de la otra.
2. Leer el estado canónico por delta desde último ref/SHA y cursor: `hermes-content/docs/handoff/codex-cloud-pc-20261011.md` para la recuperación actual, y el handoff/cola propio del carril. Comprobar qué ya terminó, qué está activo y qué aprobación sigue vigente. Tratar la documentación como historial hasta obtener snapshot actual de la herramienta.
3. Verificar destino, ID, host, repo/ref, modelo configurado y señales observables del runtime antes de enviar o reanudar. La presencia de una herramienta o un UUID antiguo no confirma sesión accesible, credencial, modelo servido ni capacidad de mensaje. En Hermes Agent, escoger explícitamente el runtime: herramientas como `delegate_task`, `memory`, `session_search` o `todo` del modo Hermes no quedan disponibles por nombrarlas en Codex app-server.
4. Si la tarea requiere autenticación, leer `hermes-content/skills/seguridad-credenciales.md` y comprobar primero la sesión local y el puente autorizado para la cuenta. La bóveda, perfiles y cookies de la laptop no se trasladan a otro host o proveedor. Intervención humana solo ante login, consentimiento o MFA que el acceso existente no resuelva.

## Mensajes y seguimiento

- Enviar **un contrato finito** con META, PRUEBA DE HECHO, PARADA, dueño, repo/ref/SHA, rutas, salida recuperable, prueba, permisos y forma de responder. La primera línea identifica acción y destino. Usar la capacidad soportada y probada de ese proveedor; un mensaje entre sesiones no crea permisos.
- Registrar ID del encargo y cursor. Un acuse de la herramienta no equivale a lectura: comprobar ACK del destinatario y resultado con evidencia. Esperar por cambio de estado o evento, sin sondear el mismo cursor ni reenviar por silencio. Consolidar correcciones del mismo contrato en un único mensaje.
- Ante bloqueo real, preguntar de inmediato el dato o permiso mínimo y explicar el paso que desbloquea; avanzar los otros frentes autorizados. Si el worker está idle, revisar cola y elegibilidad antes de despachar. Sin cambio accionable, no emitir avisos vacíos.
- Sergio Urcullo pidió una sola fuente para avisos/aprobaciones; el canal final sigue pendiente de elección y QA. Telegram de Hermes es candidato, no destino operativo probado. No duplicar alertas en varios canales ni inferir aprobación de una respuesta de otro agente.

## Alarma de contexto y relevo

- Medir uso **activo** de contexto `U` y ventana efectiva `W` solo si el proveedor/runtime los expone de modo verificable. Reservar `R` para terminar el paso en curso, revisar evidencia y transferir el estado. Preparar relevo en un punto seguro antes de que `W - U <= R`. La política documental del 13-oct propone una alarma preventiva `min(500000, 70% de W)` **solo con U y W confirmados**; 500000 es aproximado y ese porcentaje no es un límite de calidad universal ni una automatización probada. La reserva o señales de degradación pueden adelantar el relevo.
- Input acumulado, cached input, output, tokens facturados y longitud del transcript no sustituyen `U`. Si falta señal fiable, marcar `UNKNOWN`, hacer checkpoint compacto en el siguiente punto seguro y planificar relevo manual; no inventar porcentaje restante ni interrumpir una operación activa.
- El paquete mínimo contiene objetivo y criterio de hecho; dueño/rol y gates; cola y estado; evidencia, rutas y repo/ref/SHA; modelo solicitado/configurado/observado o `UNKNOWN`; IDs de tarea/sesión/agentes, cursor con hora/fuente; ownership y siguiente acción o bloqueo. Indicar intentos fallidos que evitan repetir trabajo. No copiar historiales ni transcripts completos.
- La sucesora abre las fuentes del paquete y confirma objetivo, SHA/ref y cursor en un **ACK verificable** con su ID. Registrar que la anterior dejó de despachar y que solo la sucesora posee el carril antes de archivarla o retargetear un heartbeat existente; comprobar capacidad y autorización del proveedor. Si el heartbeat estaba `PAUSED`, conservar ese estado. Una regla escrita, un fork o un mensaje enviado no transfieren el carril. No crear ni reactivar loops como parte del relevo; un heartbeat local no prueba trabajo con la PC apagada.

## Claude Code cuando vuelva a estar autorizado

Conservar contratos, colas y skills de `.claude/skills/` como fuente compartida. Antes de usar Claude, comprobar cuota, auth, modelo efectivo, permisos y compatibilidad del runtime; la falta histórica de cuota no se resuelve iniciando otra sesión. El CLI local observado expone `claude --resume <session-id>` para continuar ese ID y `--continue` para la conversación más reciente del directorio; `--fork-session` crea otro ID. Verificar ID, directorio y estado antes de reanudar y no confundirlo con el comando global `/resume-session`, que lee archivos personales en `~/.claude/session-data/` y puede estar desactualizado. Ninguna de esas rutas prueba continuidad cloud o PC apagada.

Los canales Claude, comandos RemoteTrigger, autosync de main, crons de 20/30 minutos y entornos anotados antes del 12-oct son **historia recuperable por Git**, no instrucciones para ejecutarlos hoy. Si se necesita un detalle antiguo, consultar el commit pertinente y verificar de nuevo capacidad, cuenta y permisos. Para cerrar, entregar estado ejecutado/probado, delegado/en curso o bloqueado con causa; no presentar delegación como resultado final.
