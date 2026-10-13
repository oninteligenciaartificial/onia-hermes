# Relevo de madre Desarrollo-Infra — estado 2026-10-13

## META, prueba y parada
META: transferir la coordinación a una nueva madre conservando estado. PRUEBA: handoff en Git, sucesora lee fuentes y devuelve ACK con ID, objetivo, repo/ref/SHA y próxima acción. PARADA de la sesión saliente: no archivar esta sesión ni crear/mover heartbeat; después del ACK deja de despachar. La sucesora puede ejecutar por workers el próximo QA autorizado descrito abajo; main, producción, instalaciones, gasto y accesos nuevos conservan gates.

## Relevo y autoridad
Sesión fuente actual: `01a1352a-a8ab-77d0-9335-895a7d8083a2`. Sucesora: **PENDING**; el ACK debe confirmar objetivo, gates, repo/ref/SHA, worker activo, siguiente acción y aceptación de ownership. La madre original `01a12beb-7774-7c02-9931-12264158df83` fue desarchivada y leída; no es worker activo. No copiar historial entero ni hacer fork. La petición vigente es medir contexto, crear nueva sesión y continuar allí; **NO ARCHIVAR ESTA**. El contrato previo de archivo autorizado y heartbeat ACTIVE hacia otra sesión queda reemplazado; el historial permanece en Git.

Dos madres: Desarrollo-Infra y Marketing. Madres delegan, revisan evidencia y resumen; workers ejecutan. No reportar ni actuar en el carril Marketing. El worker cloud de harness listado abajo está idle; la madre sucesora no es worker activo del carril. Sin ACK de sucesora, no transferir ownership.

## Objetivo y enfoque
Construir primero un harness serio y offline para Hermes coordinador, antes de activar ONIA/Sergio, vender o desarrollar una solución enfocada en infraestructura. Prioridad: continuidad PC/cloud/Claude Code sin pérdida de datos. Muse/Dots son candidatos vendor futuros, no verificados ni integrados.

Sergio pidió reparto consciente según calidad, no “barato por defecto” ni Ultra siempre. En este lote: acceso + skills Sol Ultra; research + bug focal Sol medium; pruebas deterministas Luna low. Registrar `requested/configured` separado de `observed`; lo no medido es `UNKNOWN`. No inferir Astra autorizado.

## Contexto observado
Fuente local de metadata: `token_count` event UTC `2026-10-13T19:23:26.301Z`; last input 237040 (cached 236416 es subconjunto, no sumar); last total 237186; ventana 354350; entrada 66.9%. Acumulado histórico 51836336 no representa contexto activo. La referencia de 500k es aproximada y supera la ventana efectiva de 354350. Reservar margen para terminar/transferir; no prometer cambio automático de sesión.

## Fuentes y cambios preservados
Skills commit `0c44e486`; research commit `b7a040ce` en este worktree. Leídos `.claude/skills/equipo-de-agentes/SKILL.md`, `.claude/skills/onia-sesion-madre/SKILL.md` y `E:/onia-wt/orquestacion-subagentes-20261013/hermes-content/research/infra/HERMES-FUNCIONES-Y-MODELOS-20261013.md` (40 fuentes; benchmark AA no equivale a cuota/precio). Research preservado. NotebookLM previo a verificar: https://notebook.google.com/notebook/4976c6a9-2609-4f63-98db-514149c85f82, título histórico “ONIA Ingeniería de agentes Piloto”. El informe DeepResearch “HIPÓTESIS NO VALIDADA” estaba rechazado/deseleccionado; las fuentes mejoradas históricas no validan la sesión actual. No transmitir accesos ni telemetría privada; usar solo fuentes públicas. El control Chrome previo quedó bloqueado por URL y requiere revalidación en NUEVA sesión.

## Accesos comprobados (13 oct, 19:08–19:12 UTC)
- SSH: acceso al VPS confirmado a las 19:08 UTC con BatchMode + StrictHostKeyChecking=yes y clave/pin autorizados; no se trasladaron credenciales.
- Nous Hermes: gateway activo, `7166071fca`, reinicios 0; Python 3.12.3, SQLite 3.45.1; Codex CLI ausente. Modelo en servicio `UNKNOWN` (config observado: `gpt-5-mini`).
- Claude: VPS 2.1.197 y PC 2.1.288; auth false en ambos. KeePass esperado ausente.
- Codex PC: 0.161, auth OK, GitHub lectura OK. Cuota global weekly usada 5%, sin atribución a esta tarea.
- No se cambió configuración, servicio, instalación, inferencia/costo ni API. Bloqueos: auth Claude requiere intervención humana (`claude auth login --claudeai`); runner Codex VPS requeriría decisión de ejecución y autorización de gasto antes de instalar.

## Harness worker y validación
Worker cloud nativo `01a13170-1c7e-7224-83c1-c5f369052039`, host durable, título `ONIA · Hermes QA · Codex Cloud`: status idle; turno `01a136b4-0e66-7345-99f1-516390ac54ae` completado, cursor `71a6c74e-0c0f-4c51-a62d-f90f878bb01f:10`. Nuevo tip publicado `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163`, equivalente local `80bdcf22`. QA independiente PASS; Linux 21/21 focales + 18/18 baseline PASS.

En el SHA histórico `68d12e3962e2892cb853ca9df53ba0600a67aeec`, Windows reprodujo 16/19 y tres fallas WinError 32: `ambiguous_effect_closes_only_after_reconciliation_receipt`, `effect_key_is_stable_after_explicit_not_applied_reconciliation`, `quiescence_evidence_must_match_ambiguous_owner_and_fence`. Runtime Windows Python 3.12.10, SQLite 3.49.1. QA tuvo primero cwd de import incorrecto, luego corregido; separado de los bugs. Para el nuevo SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163`, QA Windows y VPS todavía NO corridos.

Reporte: `E:/onia-wt/hermes-harness-canario-20261013-report.json`; snapshot público: `E:/onia-wt/harness-canario-20261013`. Evidencia de limpieza rechazada: no reintentar borrado.

El worker de reparación terminó; su cambio `resolve_reconciliation` cierra conexión (`self._connection`) y agrega regresión. Resultado incorporado al nuevo SHA indicado arriba. El worker canario anterior terminó con fallo; no notificar a otra madre automáticamente.

## Próximo paso al asumir ownership
La madre sucesora asigna QA del SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163` en Windows y VPS temporal: 21 focales + 18 baseline, con stdlib y modo 700, sin instalar ni ejecutar inferencia/servicios. Exportar exactamente ese SHA y revisar evidencia. No repetir QA del SHA histórico `68d12e3962e2892cb853ca9df53ba0600a67aeec`. Canario real LLM/scheduler con PC apagada: NO probado.

## Otros límites de evidencia
- SSH al VPS sí quedó probado; la auditoría no prueba inferencia, runner Codex ni Cloud scheduler.
- No afirmar que el harness ya pasa Windows/VPS; sus gates siguen pendientes.
- No inferir cuotas de benchmarks, configuración o contexto acumulado.
- No copiar secretos ni migrarlos; verificar skill de credenciales antes de cualquier nuevo acceso.
