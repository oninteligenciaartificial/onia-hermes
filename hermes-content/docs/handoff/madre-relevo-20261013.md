# Relevo de madre Desarrollo-Infra — estado 2026-10-13

## META, prueba y parada
META: preservar el estado operativo verificable para una nueva sesión madre, sin perder workers, gates ni evidencia. PRUEBA: archivo compacto, diff revisado, árbol claro y commit local de este archivo. PARADA: no archivar esta sesión, no mover/crear heartbeat, no iniciar acceso/API/cloud/worker/ejecución ni tocar `main`.

## Relevo y autoridad
Sesión fuente actual: `01a1352a-a8ab-77d0-9335-895a7d8083a2`. Sucesora: **PENDING**; el ACK debe confirmar objetivo, gates, repo/ref/SHA, worker activo, siguiente acción y aceptación de ownership. La madre original `01a12beb-7774-7c02-9931-12264158df83` fue desarchivada y leída; no es worker activo. No copiar historial entero ni hacer fork. La petición vigente es medir contexto, crear nueva sesión y continuar allí; **NO ARCHIVAR ESTA**. El contrato previo de archivo autorizado y heartbeat ACTIVE hacia otra sesión queda reemplazado; el historial permanece en Git.

Dos madres: Desarrollo-Infra y Marketing. Madres delegan, revisan evidencia y resumen; workers ejecutan. No reportar ni actuar en el carril Marketing. Ejecutores listados abajo: no duplicar al worker cloud activo. Sin ACK de sucesora, no transferir ownership.

## Objetivo y enfoque
Construir primero un harness serio y offline para Hermes coordinador, antes de activar ONIA/Sergio, vender o desarrollar una solución enfocada en infraestructura. Prioridad: continuidad PC/cloud/Claude Code sin pérdida de datos. Muse/Dots son candidatos vendor futuros, no verificados ni integrados.

Sergio pidió reparto consciente según calidad, no “barato por defecto” ni Ultra siempre. En este lote: acceso + skills Sol Ultra; research + bug focal Sol medium; pruebas deterministas Luna low. Registrar `requested/configured` separado de `observed`; lo no medido es `UNKNOWN`. No inferir Astra autorizado.

## Contexto observado
Fuente local de metadata: `token_count` event UTC `2026-10-13T19:23:26.301Z`; last input 237040 (cached 236416 es subconjunto, no sumar); last total 237186; ventana 354350; entrada 66.9%. Acumulado histórico 51836336 no representa contexto activo. La referencia de 500k es aproximada y supera la ventana efectiva de 354350. Reservar margen para terminar/transferir; no prometer cambio automático de sesión.

## Fuentes y cambios preservados
Skills commit `0c44e486`; research commit `b7a040ce` en este worktree. Leídos `.claude/skills/equipo-de-agentes/SKILL.md`, `.claude/skills/onia-sesion-madre/SKILL.md` y `HERMES-FUNCIONES-Y-MODELOS-20261013.md` (40 fuentes; benchmark AA no equivale a cuota/precio). Research preservado; NotebookLM no ejecutado: control nativo Chrome terminó por política al no poder verificar URL; no se envió corpus. Corpus y preguntas preparados.

## Accesos comprobados (13 oct, 19:08–19:12 UTC)
- SSH: clave documentada pero sin acceso efectivo al VPS.
- Nous Hermes: gateway activo, `7166071fca`, reinicios 0; Python 3.12.3, SQLite 3.45.1; Codex CLI ausente. Modelo en servicio `UNKNOWN` (config observado: `gpt-5-mini`).
- Claude: VPS 2.1.197 y PC 2.1.288; auth false en ambos. KeePass esperado ausente.
- Codex PC: 0.161, auth OK, GitHub lectura OK. Cuota global weekly usada 5%, sin atribución a esta tarea.
- No se cambió configuración, servicio, instalación, inferencia/costo ni API. Bloqueos: auth Claude requiere intervención humana (`claude auth login --claudeai`); runner Codex VPS requeriría decisión de ejecución y autorización de gasto antes de instalar.

## Harness worker y validación
Worker cloud nativo activo `01a13170-1c7e-7224-83c1-c5f369052039`, host durable, título `ONIA · Hermes QA · Codex Cloud`; branch `codex/hermes-harness-20261012`, tip `68d12e3962e2892cb853ca9df53ba0600a67aeec`, tree `8fdb8ba8c53aac08661b7e202ed11546670887cb`. Cloud: 19/19 focales + 18/18 gates PASS; review independiente PASS.

Windows reprodujo 16/19; tres fallas WinError 32: `ambiguous_effect_closes_only_after_reconciliation_receipt`, `effect_key_is_stable_after_explicit_not_applied_reconciliation`, `quiescence_evidence_must_match_ambiguous_owner_and_fence`. Runtime Windows Python 3.12.10, SQLite 3.49.1. QA tuvo primero cwd de import incorrecto, luego corregido; separado de los bugs. Test gate Windows y VPS todavía NO corridos.

Reporte: `E:/onia-wt/hermes-harness-canario-20261013-report.json`; snapshot público: `E:/onia-wt/harness-canario-20261013`. Evidencia de limpieza rechazada: no reintentar borrado.

Worker de reparación activo, turno `01a136b4-0e66-7345-99f1-516390ac54ae`, cursor `71a6c74e-0c0f-4c51-a62d-f90f878bb01f:9`. Corrigió `resolve_reconciliation` para cerrar conexión (`self._connection`) y agregó regresión. Linux: 20/20 + 18/18 PASS. Falta QA independiente y publicar SHA nuevo. Worker canario anterior terminó con fallo; no notificar a otra madre automáticamente.

## Próximo paso al asumir ownership
Esperar con `wait_threads` usando cursor del worker activo hasta SHA final; luego QA independiente. Exportar exactamente ese SHA y correr QA Luna: Windows 19/20 focales + 18 gates, y VPS temporal modo 700 con stdlib, sin instalar ni ejecutar inferencia/servicios. Revisar evidencia antes de ampliar. Canario real LLM/scheduler con PC apagada: NO probado.

## Otros límites de evidencia
- Accesos auditados no prueban autenticación Claude, acceso al VPS ni runner Codex.
- No afirmar que el harness ya pasa Windows/VPS; sus gates siguen pendientes.
- No inferir cuotas de benchmarks, configuración o contexto acumulado.
- No copiar secretos ni migrarlos; verificar skill de credenciales antes de cualquier nuevo acceso.
