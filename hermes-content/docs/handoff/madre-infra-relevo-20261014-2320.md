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
- R4: operación `f90f55bc-48d8-406f-a11e-05ddd2683014`. Grant condicional recibido `user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:R4-20261014` (1 submit/2 status/1 collect/no retries; transporte/auth/sandbox). La respuesta humana no excluyó setup literalmente; el HOLD de perfil/setup/instalación fue una salvaguarda provisional de coordinación, no su texto. CLI local `codex-cli 0.161.0` y `codex login status=LOGGED_IN`; ayuda confirma exec/status/diff, pero submit/status/collect no se ejecutaron ni mapearon UUID durable a TASK_ID. UI del ambiente legacy muestra setup Manual y política restringida a tres dominios GET/HEAD/OPTIONS, sin receipt R4. El manifest de instalación anterior sigue `PENDING_APPROVAL`, receta vieja `a041af91…`, descarga/instalación false; el grant único previo está consumido y no es persistente. R4 recipe nueva `369f5ddd…` mantiene componentes del catálogo (Playwright1.64, Chromium Microsoft rev1248, 33 libs Ubuntu) y amplía validación de fuentes APT existentes; no agrega repos/packages/hosts de navegación. Cambio del setup Manual puede rebuild/cache e impactar otras tareas; reportes externos `E:/onia-wt/cloud-transport-readonly-20261014.{md,json}` y snapshot rollback `E:/onia-wt/cloud-transport-rollback-20261014/rollback-snapshot.json`. AX leyó el payload live completo en memoria; normalizar el LF final omitido produce SHA `31e8f2fa…` igual al snapshot externo. Maintenance SHA `6a3ea5b3…` también iguala readback. Configuración restaurable; rollback de paquetes/caché y semántica del rebuild siguen UNKNOWN. Sin cambios UI, setup ni instalación. Transporte/auth/sandbox y receipts efectivos siguen pendientes; submit en HOLD.
- Wiring nativo relacionado: código publicado en `codex/hermes-controller-hardening-20261013` commit `c3203ab604fe6170649e9f03c11d266d2ca2861a` (ls-remote verificado por Root, árbol limpio). QA focal canónica en `E:/onia-wt/hermes-controller-pilot-20261013/hermes-content/docs/handoff/hermes-harness-20261012/evidence/native-wiring-qa-20261014.md` reporta test focal 1/1 tras 4/4 previos, source SHA `64F0E770…`, QA suite SHA `11F3D7EC…`, sin submit real; reporte de Root informa 46 tests de autor y 2 skips. No mezclar 46 tests de autor con QA independiente ni inferir integración real/runtime activado.
- BCP draft no enviado: alias business no configurado; decisión Alfred A/B enviada 19:22, sin respuesta.
- Evidencia de contenido: reel 10 skills y post X corregido con fuente; carrusel `@claudeai` solo 1/6 visual. Estudio/NotebookLM usó dos fuentes públicas; 40 fuentes observadas en el cuaderno, 2 seleccionadas; no ahorro medido. Nueve ideas comerciales siguen `IDEA`; meta Bs 3,000 no es caja/ventas constatadas. Prioridad #1: infraestructura.

## Próxima ejecución

Tras el ACK se lanzaron wiring (`/root/native_wiring`, `01a13cc1-be37-7ea1-a5c6-91a8431925a1`) y QA independiente (`/root/qa_native`, `01a13cc2-01ef-7813-a3d9-ec81444bbe8d`), ambos con resultado reportado; transporte solo lectura (`/root/cloud_transport`, `01a13cc1-dff6-7231-81cd-30fa26015e16`) entregó ayuda CLI/auth, lectura UI, revisión estática de receta y snapshot rollback. El submit R4 sigue en HOLD. Antes de considerar cambio de setup, Root debe revisar que el rollback del payload live y caché sea recuperable; el hash del setup live ya coincide con snapshot; rollback de paquetes/caché y semántica del rebuild siguen UNKNOWN.

Estado vivo al último reporte: cuota global 72% usada/28% restante, snapshot ~23:15Z; sin costo atribuido ni reset. Evolución de la señal: el primer intento al JSONL quedó bloqueado por el modo de apertura; una lectura compartida posterior sí funcionó y registró dos `turn_context` (`2026-10-14T23:30:11.635Z`, `23:34:18.354Z`) con campo `model=gpt-6.1-sol`. `model_context_window`, `last_token_usage` y `total_token_usage` son null; tampoco hubo `token_count` en el último MiB. Esto no prueba modelo servido ni semántica de contexto activo: ambos siguen `UNKNOWN`, y cuota global no equivale a contexto. Ver copias saneadas [MD](hermes-harness-20261012/evidence/continuity-preservation-20261014/context-signal-shared-read-20261014.md) y [JSON](hermes-harness-20261012/evidence/continuity-preservation-20261014/context-signal-shared-read-20261014.json). El 70% no está probado. Tres slots worker + Root, máximo cuatro. Luna low para mecánica con `fork none`; Luna medium para autenticación ambigua; modelo servido `UNKNOWN`.

## Relevo de sesión

Sesión madre anterior: Root `01a138fa-8304-71c1-9391-3bc14314d57f`; permanece sin archivar. La nueva sesión fue creada en host local: threadId `01a13cc1-12e9-79a0-97e8-4899f05a5c95`, título `MADRE INFRA · ONIA · relevo 14 oct`. Su ACK confirma lectura y acepta ownership único de la madre Desarrollo-Infra; el objetivo automático anterior no se transfirió por crear la sesión y sigue activo en la sesión anterior.

- ID nueva: `CONFIRMADA COMO CREADA` — `01a13cc1-12e9-79a0-97e8-4899f05a5c95`.
- ACK leído: `CONFIRMADO`, UTC `2026-10-14T23:31:22.3890872Z`, fuente `E:/onia-wt/madre-infra-relevo-20261014-2320-ack.json`. La sesión reportó leer este relevo, `CODEX.md`, `AGENTS.md`, `COORDINATION_MANIFEST.md`, `.claude/skills/onia-sesion-madre/SKILL.md` y `.claude/skills/onia-continuidad/SKILL.md`; refs observadas CODE `c8e336c82bd90b534c2aa9fcca4fec89bb96663d`, DOCS `695a13127ec129dbe1842a078d478ef88714342b`.
- Ownership aceptado: `única madre Desarrollo-Infra`; la madre previa no se archiva.
- Transferencia del goal: `PENDIENTE — no afirmar hasta validar continuidad`.

Madre: delega y revisa. Usar `CODEX.md` y `.claude/skills/onia-continuidad/SKILL.md`; evitar prompts enormes y repetir búsquedas remotas. No tocar código desde este carril documental.
