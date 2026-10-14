# Relevo compacto — madre infraestructura — 2026-10-14 23:20

## Meta y estado

Completar ONIA Hermes → Codex Cloud nativo → browser → captura Telegram con un ciclo útil de al menos 30 min, QA/STOP, deduplicación/reconciliación y relevo cuando el 70% de contexto esté **realmente medido**. El objetivo **NO está completo**: browser/Telegram, ciclo 30 min y medición de contexto no están demostrados. El giro de sesión lo pidió Sergio; no se infiere por threshold.

## Checkouts y propiedad

- CODE: `E:/onia-wt/hermes-controller-pilot-20261013`, rama `codex/hermes-controller-hardening-20261013`, HEAD `c8e336c82bd90b534c2aa9fcca4fec89bb96663d`, limpio.
- DOCS: `E:/onia-wt/orquestacion-subagentes-20261013`, rama `codex/orquestacion-subagentes-20261013`, HEAD `81d9f59d95aade6cc8f86f2930ba5e4a50ea237e`, limpio al preparar este relevo.
- `C:/dev/proyectos/onia-hermes` tiene cambios ajenos: preservar y no limpiar.
- Cola única: `E:/onia-wt/onia-harness-native-run-20261014/queue.sqlite3`. Último estado observado 22:39: 4 `done/applied`, 4 con `state='failed'`, cero pendientes. `STOP=0` es el estado observado actual y no otorga autoridad. No resetear ni hacer replay.

## Hechos y límites

- Sink POSIX QA17 Linux; entrada/caps, hasta dos consultas de estado y una colección de resultado. Monitor fix publicado pero no activado; dos emitters pausados observados a las 21:05. Exporter `0fb11294…` publicado.
- Autoridad callback `c8e336c…` publicada: seis fixtures sobre SHA inicial `d0d559…` y dos fixtures de fábrica sobre SHA final `6d1656…`; no son 8 pruebas sobre final. Autenticación real y wiring siguen HOLD.
- Snapshot público adapter fuera de Git: `adapter.py.source`, 387,611 B, SHA `a50b10…`. Handler legado `ea:` autentica remitente/sesión; handler nativo `na` aún no está registrado.
- R4: operación `f90f55bc-48d8-406f-a11e-05ddd2683014` planificada; fresh grant pendiente. No submit, profile, install ni reset. Perfil original restaurado 20:24.
- BCP draft no enviado: alias business no configurado; decisión Alfred A/B enviada 19:22, sin respuesta.
- Evidencia de contenido: reel 10 skills y post X corregido con fuente; carrusel `@claudeai` solo 1/6 visual. Estudio/NotebookLM usó dos fuentes públicas; 40 fuentes observadas en el cuaderno, 2 seleccionadas; no ahorro medido. Nueve ideas comerciales siguen `IDEA`; meta Bs 3,000 no es caja/ventas constatadas. Prioridad #1: infraestructura.

## Próxima ejecución

Preparar launcher/registro de `na` y binding `NativeTrustedRuntime` con cola/sink existentes; verificar transporte y autenticación de Codex Cloud sin pedir login por una ausencia parcial. Diseñar validación proporcional; pedir el grant específico antes de activar. Mantener R4 y activación pendientes hasta evidencia de transporte, autenticación y autorización.

Estado vivo al último reporte: cuota global 72% usada/28% restante, snapshot ~23:15Z; sin costo atribuido ni reset. Contexto activo `UNKNOWN`; 70% no probado. Tres slots worker + Root, máximo cuatro. Luna low para mecánica con `fork none`; Luna medium para autenticación ambigua; modelo servido `UNKNOWN`.

## Relevo de sesión

Sesión madre anterior: Root `01a138fa-8304-71c1-9391-3bc14314d57f`; conserva ownership hasta que exista prueba de lectura y ACK de la sesión nueva. No archivar la sesión vieja. No inventar ID ni ACK; el objetivo **no se ha transferido**.

- ID nueva: `PENDIENTE — completar tras creación verificada`.
- ACK leído de la sesión nueva: `PENDIENTE — registrar evidencia y hora`.
- Transferencia del goal: `PENDIENTE — no afirmar hasta validar continuidad`.

Madre: delega y revisa. Usar `CODEX.md` y `.claude/skills/onia-continuidad/SKILL.md`; evitar prompts enormes y repetir búsquedas remotas. No tocar código desde este carril documental.
