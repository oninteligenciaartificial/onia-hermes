# Relevo de madre Desarrollo-Infra — 13 octubre 2026

## Contrato y autoridad
META: reemplazar la madre larga por una sesión limpia sin perder pedidos, fuentes, permisos ni trabajos. PRUEBA: sucesora lee este archivo y fuentes canónicas, identifica workers/bloqueos/modelos y devuelve ACK; después se mueve supervisión y se archiva anterior. PARADA: ninguna implementación por madre, ningún cierre cloud autónomo sin prueba; no repetir trabajos cerrados.

Sergio Urcullo autorizó crear nueva sesión y archivar la anterior después de handoff. Madre anterior local: `01a12beb-7774-7c02-9931-12264158df83`. Sucesora: `thread01a1337d-3ae4-7081-b861-c19637fdd9e8` (Luna low). Estado de relevo: **ACK de lectura/comprensión validado** en el turno `01a1337d-3e37-7af2-bfd0-7e6b5570688f`; la sucesora leyó este paquete, CODEX.md y el delta remoto `0a036fb2d7bccf6b99d2130895f598cb069d6cee` e identificó objetivo, workers, modelos y gates de PC apagada. La madre confirmó el mensaje de propiedad y la transferencia del heartbeat existente: destino sucesora `01a1337d-3ae4-7081-b861-c19637fdd9e8`, estado ACTIVE, frecuencia hourly. **Archivo de la madre anterior pendiente; aún no archivada.** El historial no se copia entero ni se hace fork. Este archivo es el paquete compacto de transición, no reemplaza los registros canónicos.

## Objetivo de ONIA
SaaS muy sencillo y guiado, inicialmente dentistas, arquitectura multirrubro/escalable. Agenda, pacientes, cobros, agente conversacional WhatsApp y web IA propia empaquetados; última dirección comercial: todo en un solo plan. API de pagos QR pendiente: QR manual no acredita confirmación automática. Precio, capacidades/promesas y publicación no aprobados por inferencia. Sergio vende, hace workshops/llamadas y graba; agentes desarrollan y le piden solo decisiones importantes.

Dos madres: Desarrollo-Infra y Marketing. Solo delegan, revisan evidencia y resumen; trabajadores/subagentes ejecutan. No reportar operación Marketing aquí. Madre Marketing local existente `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`; no reemplazar sin handoff/ACK de su propio carril. Usuario autoriza coordinar con sesiones.

## Modelos y permisos actuales
Modo ahorro última orden: madre y mecánica Luna low; código Platform Sol 6.1 medium; QA focal independiente Sol low. Máximo un ejecutor y un revisor focal por carril/lote. Astra solo excepción explícita, sin escalación automática. Registrar configurado versus observado. Nunca deducir ahorro de costos del volumen de contexto cached.

Continuar trabajo reversible autorizado sin nuevo prompt ni microaprobaciones. No merge, deploy, producción, migraciones reales, gasto, nuevas publicaciones, contacto externo, secretos o acceso nuevo a cuentas sin permiso concreto. Sergio además aprueba cambios visibles de diseño. Marketing puede publicar únicamente piezas ya aprobadas en cuentas/calendario acordados; nuevas piezas y gasto requieren OK.

Leer CODEX.md vigente; AGENTS.md exige lectura. Fuente única de skills propias `.claude/skills/`, no copiar a `.agents/skills`. Skill método; handoff estado; evidencia en artefacto. Nombre canario Sergio Urcullo, mensajes muy cortos y lenguaje de negocio, no números de PR como resultado principal.

## Fuentes canónicas y desactualización local
Repo local Hermes `C:/dev/proyectos/onia-hermes`, Platform `C:/dev/proyectos/onia-platform`. Checkout Hermes main antiguo ahead2/behind236, no reset/pull/prune/borrado de cambios. CODEX local está preparado; otros handoffs nuevos pueden faltar localmente. Verificar fuentes remotas mediante GitHub App, no asumir que main contiene cambios.

Rama operativa `codex/cloud-pc-audit-20261011` de `oninteligenciaartificial/onia-hermes`: `CODEX.md` y `hermes-content/docs/handoff/codex-cloud-pc-20261011.md`. Último handoff conocido `9bfd5d0cfbf176f101c7598051bb9aec011676de`, verificar HEAD antes de editar. Bloques históricos no prevalecen sobre decisiones últimas. Skills/learning candidato en `codex/x-huggingface-learning-20261013` (PR199 draft ya adjuntada, no merge): `onia-continuidad` y `onia-sesion-madre`. No afirmar autoload global de drafts.

## Workers y evidencia
Platform `01a12c7e-97e2-7115-8561-0b7658008003`, host durable. Snapshot 13oct: idle, último turno completado `01a1331c-bd16-7701-bafa-0f83a78f3451`; cursor `986c08b1-455b-4f8c-80b4-e03c7f4fde2b:28`. Reportó ensayo local contacto/servicios/horarios confirmados llegan al generador, dos clínicas ficticias aisladas,35tests+24rechazosPASS,QA Sol low APPROVE. Platform candidato170, Web Factory Hermes200. Madre verificó transcript/estado, no código/capturas/resultados individuales: no tratar como QA independiente madre. Para uso real faltan validación/autorización esquema DB y conexión interna autenticada. No rehacer cerrado ni iniciar trabajo sin pendiente viable canónico.

Hermes QA `01a13170-1c7e-7224-83c1-c5f369052039`, durable. Último recovery completado `01a1333b-7535-740c-9bc9-15ac150070ae`, cursor previo `7d618a5b-51e4-4b47-aecb-3442c72394d3:22`. Rama `codex/hermes-harness-20261012`: baseline18offlinePASS; commit `b5a0ad442057c4859ed9dd51d3fa47f7f5a6cc06` clave efecto y3focalesQA. contract operational_ready=false,distributed_store no implementado/no activado,triggeroff. Recovery vía GitHub App `fc2e7012` preserva4archivosdiagprobados local7ca7cb9,5focalesQA; NO ejecutado/desplegado en VPS. Clave idempotente no prueba exactly-once tras crash ambiguo.

## Harness, Hermes, Alfred y PC apagada
Heartbeat anterior `onia-platform-supervisi-n-y-continuidad` cada hora LOCAL, requiere PC. Mover/recrear solo al relevo validado; conservar silencio si sin cambios, cursor y gates. No dos supervisores activos.

Faltan store/checkpoints persistentes, lease atómico/fencing/reconciliación, envío/despertar remoto soportado, runner autenticado, cuotas y prueba E2E PC apagada. Alfred lee5workers pero envío devuelve CloudThreadNotFoundError sin turnId: piloto fallido no repetir. Incidencia enviada/escalada a soporte por cuenta autorizada, especialista pendiente; no afirmar resuelto.

Hermes Agent NousResearch no es familia de modelos Hermes. Upstream documenta Telegram/gateway,cron,memoria/skills,delegación,browser; NO prueba instalación/configuración ONIA ni autonomía. Telegram recomendado como canal único, aún NO elegido por Sergio. Git/Markdown+retrieval pertinente son memoria canónica; Notebook sintetiza, no controla permisos ni sustituye scheduler.

Arquitectura propuesta mínima: reutilizar infra existente aislada, cola/estado/ejecutores y aprobación determinista; evaluar Cloudflare Worker+Durable Object SQLite como control plane, no supuesto host LinuxCodex. Codex CLI local cloud no tiene followup/resume de estos chats; SIWC VM podría dar inferencia por suscripción si elegibilidad/OAuth/autorización se validan, no reparaAlfred ni autoriza copiar secretos. Claude Code futuro comparte contratos/cola/skills; hoy sin cuota, no invocarlo.

## Investigación y aprendizaje preservados
Notebook real `https://notebook.google.com/notebook/4976c6a9-2609-4f63-98db-514149c85f82`, ONIA Ingeniería de agentes Piloto. Deep Research terminado,32citadas+17no citadas NO49verificadas. Informe rechazado: confunde Hermes,fecha,fuentesCodex,NotebookEnterprise,HFcréditos,idempotencia. Renombrado HIPÓTESIS NO VALIDADA y deseleccionado, notaQA con3verificacionesoficiales.16ítems guardados,14seleccionados(13primarias+notaQA),nota vacía deseleccionada. Handoff porSHA9bfd5d0 verificado porworker. Imagen `C:/Users/PC/.codex/visualizations/2026/10/11/01a12beb-7774-7c02-9931-12264158df83/notebook-dr-corpus-qa.jpg`. No creer autolearning=entrenar pesos.

Jev probablemente TypeSafeAI: https://typesafe.ai/ y https://docs.typesafe.ai/introduction . Decision typed Choice/Score/Noul,precio proveedor0.042USD/millón input, no evaluaciónONIA. Candidato router después de benchmark; no reemplaza coder/approval. No compra/APIkey/inferencia realizada.

NotebookEnterpriseAPI existe gestión notebooks/fuentes; query/chat oficial no encontrado,licencias/billing necesarios. Consumer notebook no backendRAG probado. Cloudflare free limitado; browser10min/día,3concurrentes, no cuentas ilimitadas; planes reales pendienteslogin.

Orbix UI/infra/diseño y referentes investigados: rutas del informe en handoff existente, revisión47externos42lectura/reuso5bloqueos, no UI implementada. Instagram donimas `https://www.instagram.com/p/DeFS0Fes8yu/?hl=es-la` corregido en ficha existente `hermes-content/references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md`; caption seis tareas simuladas NO benchmarkONIA, audio no revisado. X/HuggingFace radar debe verificar primarias,licencias,fecha; guardar deduplicado URL/objetivo/dueño/evidencia/siguienteacción. No nuevas líneas/ideas ejecutadas por ver referencia.

## Accesos y bloqueos humanos ya pedidos
Cloudflare pestaña login abierta, cuenta sin sesiónválida; pidió intervención Sergio consentimiento/login, no respondió. Verificar estado antes repetir. Captura `C:/Users/PC/Documents/Codex/cloudflare-login-handoff-2026-10-12.png`. No aceptar términos ni instalar/comprar.
KeePass ruta esperada no encontrada,GUI/CLIinstaladas pero proceso/puente no observable. SSHsin alias efectivo/keydefault,cloudflaredausente; no transferencia ni conexión VPS. VPS producción mantiene función, no bóveda/cookies. GoogleNotebook sesión reutilizada por navegador autorizado. Leer procedimiento seguridad-credenciales antes de nuevos accesos.

## Siguiente acción concreta
1. ACK de lectura/comprensión ya validado; transferencia del heartbeat existente verificada hacia la sucesora ACTIVE hourly. No simular medición ni rotación automática si la API no la permite.
2. Madre anterior pendiente de archivo después del cierre de este relevo; no renovar todos los workers a ciegas ni cortar lotes activos.
3. Revisar evidencia entregada Platform y siguiente cola viable autorizada con contrato breve; independiente del harness, nobusywork.
4. Infraworker prepara diagnóstico seguro/arquitectura corregida; falta acceso concretoCloudflare/VPS, sin serviciosprod. PruebaPCapagada solo tras gates reales.
5. Resúmenes cortos con logrado/pendiente/pedido humano. No reiterar historia ni inflar agentes.

