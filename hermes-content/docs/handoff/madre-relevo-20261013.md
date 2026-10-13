# Relevo de madre Desarrollo-Infra — estado 2026-10-13

## META, prueba y parada
META: transferir la coordinación a una nueva madre conservando estado. PRUEBA: handoff con ACK y evidencia de QA offline del SHA vigente. PARADA de la sesión saliente: no archivar esta sesión ni crear/mover heartbeat; después del ACK deja de despachar. El canario de inferencia está preparado pero su aprobación sigue pendiente; main, producción, instalaciones, gasto y accesos nuevos conservan gates.

## Relevo y autoridad
Sesión fuente/saliente: `01a1352a-a8ab-77d0-9335-895a7d8083a2`; anunció que no volverá a despachar y permanece **NO ARCHIVAR**. Sucesora y dueña única aceptante: `01a136be-bea1-70f1-9891-9cae7dd1d331` (ACK registrado en el delta 13-oct de abajo). La madre original `01a12beb-7774-7c02-9931-12264158df83` fue desarchivada y leída; no es worker activo. No copiar historial entero ni hacer fork. La transferencia no archiva la sesión fuente ni crea/mueve heartbeat.

Dos madres: Desarrollo-Infra y Marketing. Madres delegan, revisan evidencia y resumen; workers ejecutan. No reportar ni actuar en el carril Marketing. El estado de ownership/ACK y la delegación vigente del QA se actualizan en el delta 13-oct de abajo.

## Objetivo y enfoque
Construir primero un harness serio y offline para Hermes coordinador, antes de activar ONIA/Sergio, vender o desarrollar una solución enfocada en infraestructura. Prioridad: continuidad PC/cloud/Claude Code sin pérdida de datos. Muse/Dots son candidatos vendor futuros, no verificados ni integrados.

Sergio pidió reparto consciente según calidad, no “barato por defecto” ni Ultra siempre. En este lote: acceso + skills Sol Ultra; research + bug focal Sol medium; pruebas deterministas Luna low. Registrar `requested/configured` separado de `observed`; lo no medido es `UNKNOWN`. No inferir Astra autorizado.

## Contexto histórico de la sesión saliente
Metadata de la sesión fuente informada en el handoff: `token_count` UTC `2026-10-13T19:23:26.301Z`; input de última llamada 237040 (cached 236416 es subconjunto); ventana 354350. El acumulado histórico 51836336 no representa contexto activo. Esta medición pertenece a la sesión saliente, no a la sucesora; no inferir uso actual con ella.

## Delta de ownership y señal fresca de sucesora — 2026-10-13
ACK: la sucesora `01a136be-bea1-70f1-9891-9cae7dd1d331` acepta ownership único de Desarrollo-Infra/Hermes QA. Fuente `01a1352a-a8ab-77d0-9335-895a7d8083a2` sigue sin archivar y dejó de despachar. Objetivo vigente: primero completar un harness coordinador serio y offline para Hermes; conservar los límites y gates listados arriba. Repo `E:/onia-wt/orquestacion-subagentes-20261013`, ref `codex/orquestacion-subagentes-20261013`, base SHA `110f00f95c2af4e7f24ab00dcd271d7489d6013d` (árbol base en este worktree `7358829cae097d5628a9cc1199186409f64d8628`). Harness SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163` y árbol `8065cbfc107ccdfc6b251ee511ca60342be43c72` fueron verificados por el reporte QA revisado por root; el objeto aún no está presente en este worktree base.

Worker cloud nativo `01a13170-1c7e-7224-83c1-c5f369052039` (host durable) está idle; último turno `01a136b4-0e66-7345-99f1-516390ac54ae`, cursor `71a6c74e-0c0f-4c51-a62d-f90f878bb01f:10`. QA independiente `/root/qa_windows_vps` para SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163` está completado y revisado. No hay implementación activa; el lote actual del worker QA es read-only y se limita a la ayuda instalada de Nous Hermes. La siguiente acción del canario es esperar la aprobación solicitada async a Sergio Urcullo. Modelo solicitado para la madre: Sol; modelo configurado según metadata local del turno: `gpt-6.1-sol`; modelo servido/efectivo del runtime cloud: `UNKNOWN`.

Checkpoint final: se leyó solo el último evento `token_count` del archivo de sesión verificado de la sucesora. Timestamp `2026-10-13T19:49:44.452Z`; input de última llamada 154621; cached input 154368 (subconjunto del input); ventana 354350. Es un proxy de la última llamada, no el uso activo exacto actual; `U` actual sigue **UNKNOWN**. No calcular porcentaje ni sumar historiales.

**Permisos y límites:** root aprobó el diff final de estos tres archivos; commit y push normal sin force están autorizados únicamente a `codex/orquestacion-subagentes-20261013`. No hace falta aprobación adicional de Sergio para preservar esta rama. El primer tip remoto ya se verificó; cualquier push de seguimiento también debe compararse con el commit local. No archivar sesiones, crear/mover heartbeat, instalar herramientas, ejecutar inferencias/servicios fuera del canario aprobado, gastar, tocar secretos, publicar, desplegar, cambiar producción, usar main ni hacer merge.

## Preservación Git
El base local era `110f00f95c2af4e7f24ab00dcd271d7489d6013d` (árbol `7358829cae097d5628a9cc1199186409f64d8628`). La lectura remota sin URL confirmó `origin/codex/cloud-pc-audit-20261011` en `fb735abfa9e66da84140b192a759fddb2aee97c4`; `110f00f9` desciende de ese tip y conserva cinco commits: `0c44e486`, `b7a040ce`, `b33df37d`, `4041f38b`, `110f00f9`. El destino autorizado `codex/orquestacion-subagentes-20261013` no existía en la consulta previa al push. El push normal sin force creó la rama con el commit temático `3c3407d40fb12fdee5cee1c532802358352e7661`; la lectura posterior confirmó que el tip remoto coincidía con el SHA local y su árbol era `00d70e6639938a6178fc14486fc1d85ddcbc20a9`. Esta nota preserva la evidencia de ese primer push; cualquier commit de seguimiento también requiere push normal y verificación de igualdad.

## Fuentes y cambios preservados
Skills commit `0c44e486`; research commit `b7a040ce` en este worktree. Leídos `.claude/skills/equipo-de-agentes/SKILL.md`, `.claude/skills/onia-sesion-madre/SKILL.md` y `hermes-content/research/infra/HERMES-FUNCIONES-Y-MODELOS-20261013.md`. La investigación y síntesis NotebookLM están **completadas**: 33 fuentes LIVE, 14 seleccionadas, consulta validada sobre 14 fuentes públicas con las fuentes originales verificadas y plantilla saneada para privacidad. Los rechazados/excluidos siguen fuera de selección. El inventario local de referencias del research no es el corpus cargado en NotebookLM. El bloqueo histórico de URL/Chrome ya no está pendiente: la consulta LIVE fue validada. No incluir runtime privado.

## Accesos comprobados (13 oct, 19:08–19:12 UTC)
- SSH: acceso al VPS confirmado a las 19:08 UTC con BatchMode + StrictHostKeyChecking=yes. La identidad SSH default falló; funcionó la identidad documentada `HERMES_AGENT` (configuración línea 124). No hay bloqueo de SSH que requiera intervención humana ni se trasladaron credenciales.
- Nous Hermes: gateway activo, `7166071fca`, reinicios 0; Python 3.12.3, SQLite 3.45.1; Codex CLI ausente. Modelo en servicio `UNKNOWN` (config observado: `gpt-5-mini`).
- Claude: VPS 2.1.197 y PC 2.1.288; auth false en ambos. KeePass esperado ausente.
- Codex PC: 0.161, auth OK, GitHub lectura OK. Cuota global weekly usada 5%, sin atribución a esta tarea.
- No se cambió configuración, servicio, instalación, inferencia/costo ni API. Bloqueos: auth Claude requiere intervención humana (`claude auth login --claudeai`); runner Codex VPS requeriría decisión de ejecución y autorización de gasto antes de instalar.

## Harness worker y validación
Worker cloud nativo `01a13170-1c7e-7224-83c1-c5f369052039`, host durable, título `ONIA · Hermes QA · Codex Cloud`: status idle; turno `01a136b4-0e66-7345-99f1-516390ac54ae` completado, cursor `71a6c74e-0c0f-4c51-a62d-f90f878bb01f:10`. Nuevo tip publicado `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163`, equivalente local `80bdcf22`. QA independiente PASS; Linux 21/21 focales + 18/18 baseline PASS.

En el SHA histórico `68d12e3962e2892cb853ca9df53ba0600a67aeec`, Windows reprodujo 16/19 y tres fallas WinError 32: `ambiguous_effect_closes_only_after_reconciliation_receipt`, `effect_key_is_stable_after_explicit_not_applied_reconciliation`, `quiescence_evidence_must_match_ambiguous_owner_and_fence`. Runtime Windows Python 3.12.10, SQLite 3.49.1. QA tuvo primero cwd de import incorrecto, luego corregido; separado de los bugs. La revalidación del SHA posterior `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163` está PASS en Windows y VPS; evidencia detallada y límites abajo.

Reporte: `E:/onia-wt/hermes-harness-canario-20261013-report.json`; snapshot público: `E:/onia-wt/harness-canario-20261013`. Evidencia de limpieza rechazada: no reintentar borrado.

El worker de reparación terminó; su cambio `resolve_reconciliation` cierra conexión (`self._connection`) y agrega regresión. Resultado incorporado al nuevo SHA indicado arriba. El worker canario anterior terminó con fallo; no notificar a otra madre automáticamente.

## QA independiente del harness offline — 2026-10-13
El root revisó `E:/onia-wt/hermes-harness-canario-4ec92-20261013-report.json`. SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163`, árbol `8065cbfc107ccdfc6b251ee511ca60342be43c72`; cinco Git blobs verificados. QA focal independiente `/root/qa_windows_vps`: Windows Python 3.12.10 / SQLite 3.49.1, 21 focales + 18 baseline PASS; VPS Python 3.12.3 / SQLite 3.45.1, mismos 39 PASS. Directorio temporal de exportación en modo 700; los cuatro SHA256 de Python coinciden entre entornos. ZIP exportado `E:/onia-wt/harness-export-4ec92-20261013.zip`, SHA256 `788C9D717A25258C4A56BB443DAFAC7A10BD0CC44968CD95760189D6F21C7DA9`.

La prueba acredita el harness offline en ambos entornos para este SHA. No acredita LLM, scheduler remoto ni continuidad con la PC apagada. El QA histórico de `68d12e3962e2892cb853ca9df53ba0600a67aeec` queda como historial de fallas, sin repetirlo.

## Canario #1 preparado y estado de aprobación
El plan concreto está en `hermes-content/research/infra/HERMES-FUNCIONES-Y-MODELOS-20261013.md`, sección «Canario #1 propuesto: Codex CLI existente en la PC». Preflight read-only confirmó Codex CLI 0.161.0 y sesión ChatGPT autenticada; no se llamó al modelo. La propuesta es un turno sintético, en directorio temporal vacío, sandbox read-only y plazo de 45 s. La CLI observada no garantiza ausencia técnica de herramientas/red ni un máximo duro de tokens; no describirla como `no-tools` ni como prueba con límite duro. La aprobación para una inferencia de canario se pidió async a Sergio Urcullo en esta sesión y sigue **PENDING**; no inferir consentimiento ni ejecutar el canario hasta recibirlo. Producción, autenticación Claude e inferencias del harness/VPS conservan sus gates.

## Siguiente lote QA
El worker `/root/qa_windows_vps` tiene un lote nuevo activo, read-only, para consultar ayuda del Hermes Agent ya instalado. No repetir las 39 pruebas por entorno ni hacer inferencia. El QA Windows/VPS PASS de arriba se mantiene como evidencia del SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163`.

## Otros límites de evidencia
- SSH al VPS sí quedó probado; la auditoría no prueba inferencia, runner Codex ni Cloud scheduler.
- El núcleo offline del harness pasó 39/39 en Windows y 39/39 en VPS para el SHA `4ec92e3b0dc2dd2eda3edbe7d6cf1c4e097eb163`; esto no declara readiness operativa. Siguen pendientes LLM, adapters, scheduler remoto y continuidad con la PC apagada.
- No inferir cuotas de benchmarks, configuración o contexto acumulado.
- No copiar secretos ni migrarlos; verificar skill de credenciales antes de cualquier nuevo acceso.
