# Relevo compacto — madre infraestructura — 2026-10-14 23:20

## Meta y estado

Completar ONIA Hermes → Codex Cloud nativo → browser → captura Telegram con un ciclo útil de al menos 30 min, QA/STOP, deduplicación/reconciliación y relevo cuando el 70% de contexto esté **realmente medido**. El objetivo **NO está completo**: browser/Telegram, ciclo 30 min y medición de contexto no están demostrados. El giro de sesión lo pidió Sergio; no se infiere por threshold.

## Checkouts y propiedad

- CODE: `E:/onia-wt/hermes-controller-pilot-20261013`, rama `codex/hermes-controller-hardening-20261013`, publicado en `c3203ab604fe6170649e9f03c11d266d2ca2861a` (ls-remote verificado por Root, árbol limpio).
- DOCS: `E:/onia-wt/orquestacion-subagentes-20261013`, rama `codex/orquestacion-subagentes-20261013`, base publicada observada `efd36104126f5df549ccb51c5b1e8de272bf191b`; los deltas de esta preservación están locales y pendientes de revisión, no atribuirles ese HEAD.
- `C:/dev/proyectos/onia-hermes` tiene cambios ajenos: preservar y no limpiar.
- Cola única: `E:/onia-wt/onia-harness-native-run-20261014/queue.sqlite3`. Último estado observado 22:39: 4 `done/applied`, 4 con `state='failed'`, cero pendientes. `STOP=0` es el estado observado actual y no otorga autoridad. No resetear ni hacer replay.

## Hechos y límites

- Sink POSIX QA17 Linux; entrada/caps, hasta dos consultas de estado y una colección de resultado. Monitor fix publicado pero no activado; dos emitters pausados observados a las 21:05. Exporter `0fb11294…` publicado.
- Autoridad callback `c8e336c…` publicada: seis fixtures sobre SHA inicial `d0d559…` y dos fixtures de fábrica sobre SHA final `6d1656…`; no son 8 pruebas sobre final. Autenticación real y wiring siguen HOLD.
- Snapshot público adapter fuera de Git: `adapter.py.source`, 387,611 B, SHA `a50b10…`. Handler legado `ea:` autentica remitente/sesión; handler nativo `na` aún no está registrado.
- R4 `f90f55bc-48d8-406f-a11e-05ddd2683014`: grant y permiso específico de setup registrados; tope 1 submit/2 status/1 collect/sin retries. Se guardó por UI el wrapper v3 revisado; toast de éxito y readback verificado: SHA normalizado `5a16b44a…` (candidato sin LF final), cache activa, allowlist de tres hosts y métodos GET/HEAD/OPTIONS sin cambios. El recibo público del proveedor coincide exactamente con el readback; `saved_at_utc` identifica observación local, no hora exacta del proveedor. Evidencia canónica: [receipt](hermes-content/docs/handoff/hermes-harness-20261012/evidence/cloud-browser-prepared-20261014/r4/r4-save-readback-receipt-20261015.json), [wrapper v3](hermes-content/docs/handoff/hermes-harness-20261012/evidence/cloud-browser-prepared-20261014/r4/r4-compressed-setup-wrapper-candidate-v3.sh), [manifest](hermes-content/docs/handoff/hermes-harness-20261012/evidence/cloud-browser-prepared-20261014/r4/r4-reviewed-install-manifest-candidate.json). No se ejecutó instalador/setup de componentes, Test ni submit: 0/1 consumido. No hay Test independiente; setup corre al crear la tarea. `admission.py` exige recibo real de setup y referencia de envío antes de admission, aunque ambos dependen de la tarea; no hay constructor/attestor confiable post-setup/pre-browser en R4/R3. Mantener HOLD del único submit hasta resolver y revisar esa unión; no duplicar tarea. El cambio guardado puede reconstruir caché compartida; rollback de paquetes/caché sigue UNKNOWN. Reportes externos previos y snapshot de configuración permanecen solo como antecedentes.
- Wiring nativo relacionado: código publicado en `codex/hermes-controller-hardening-20261013` commit `c3203ab604fe6170649e9f03c11d266d2ca2861a` (ls-remote verificado por Root, árbol limpio). QA focal canónica en `E:/onia-wt/hermes-controller-pilot-20261013/hermes-content/docs/handoff/hermes-harness-20261012/evidence/native-wiring-qa-20261014.md` reporta test focal 1/1 tras 4/4 previos, source SHA `64F0E770…`, QA suite SHA `11F3D7EC…`, sin submit real; reporte de Root informa 46 tests de autor y 2 skips. No mezclar 46 tests de autor con QA independiente ni inferir integración real/runtime activado.
- BCP draft no enviado: alias business no configurado; decisión Alfred A/B enviada 19:22, sin respuesta.
- Evidencia de contenido: reel 10 skills y post X corregido con fuente; carrusel `@claudeai` solo 1/6 visual. Estudio/NotebookLM usó dos fuentes públicas; 40 fuentes observadas en el cuaderno, 2 seleccionadas; no ahorro medido. Nueve ideas comerciales siguen `IDEA`; meta Bs 3,000 no es caja/ventas constatadas. Prioridad #1: infraestructura.

## Próxima ejecución

Tras el ACK se lanzaron wiring (`/root/native_wiring`, `01a13cc1-be37-7ea1-a5c6-91a8431925a1`) y QA independiente (`/root/qa_native`, `01a13cc2-01ef-7813-a3d9-ec81444bbe8d`), ambos con resultados; Cloud transport documentó el Save/readback real y el bloqueo de contrato. Root confirmó pausa del predecesor y conserva el ownership único. El submit R4 sigue en HOLD por la unión post-setup/pre-browser descrita arriba; 0/1 submit consumido. No rehacer exploración de proveedor ni crear tarea de prueba independiente.

Estado vivo al último reporte: cuota global 72% usada/28% restante, snapshot ~23:15Z; sin costo atribuido ni reset. Evolución de la señal: el primer intento al JSONL quedó bloqueado por el modo de apertura; una lectura compartida posterior sí funcionó y registró dos `turn_context` (`2026-10-14T23:30:11.635Z`, `23:34:18.354Z`) con campo `model=gpt-6.1-sol`. `model_context_window`, `last_token_usage` y `total_token_usage` son null; tampoco hubo `token_count` en el último MiB. Esto no prueba modelo servido ni semántica de contexto activo: ambos siguen `UNKNOWN`, y cuota global no equivale a contexto. Ver copias saneadas [MD](hermes-harness-20261012/evidence/continuity-preservation-20261014/context-signal-shared-read-20261014.md) y [JSON](hermes-harness-20261012/evidence/continuity-preservation-20261014/context-signal-shared-read-20261014.json). El 70% no está probado. Tres slots worker + Root, máximo cuatro. Luna low para mecánica con `fork none`; Luna medium para autenticación ambigua; modelo servido `UNKNOWN`.

## Relevo de sesión

Sesión madre anterior: Root `01a138fa-8304-71c1-9391-3bc14314d57f`; permanece sin archivar. La nueva sesión fue creada en host local: threadId `01a13cc1-12e9-79a0-97e8-4899f05a5c95`, título `MADRE INFRA · ONIA · relevo 14 oct`. Su ACK confirma lectura y acepta ownership único de la madre Desarrollo-Infra; el objetivo automático anterior no se transfirió por crear la sesión y sigue activo en la sesión anterior.

- ID nueva: `CONFIRMADA COMO CREADA` — `01a13cc1-12e9-79a0-97e8-4899f05a5c95`.
- ACK leído: `CONFIRMADO`, UTC `2026-10-14T23:31:22.3890872Z`, fuente `E:/onia-wt/madre-infra-relevo-20261014-2320-ack.json`. La sesión reportó leer este relevo, `CODEX.md`, `AGENTS.md`, `COORDINATION_MANIFEST.md`, `.claude/skills/onia-sesion-madre/SKILL.md` y `.claude/skills/onia-continuidad/SKILL.md`; refs observadas CODE `c8e336c82bd90b534c2aa9fcca4fec89bb96663d`, DOCS `695a13127ec129dbe1842a078d478ef88714342b`.
- Ownership aceptado: `única madre Desarrollo-Infra`; la madre previa no se archiva.
- Transferencia del goal: `PENDIENTE — no afirmar hasta validar continuidad`.

Madre: delega y revisa. Usar `CODEX.md` y `.claude/skills/onia-continuidad/SKILL.md`; evitar prompts enormes y repetir búsquedas remotas. No tocar código desde este carril documental.
