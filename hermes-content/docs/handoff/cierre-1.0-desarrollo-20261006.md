# Cierre técnico 1.0 — desarrollo, 6-oct-2026

## Lease C6b1 antes de editar

Autorizado por madre: rama aislada `codex/c6b1-caras-api`, checkout `E:/ONIA-Codex/cierre-1.0-20261006/platform-caras`, base master `5102535cdd2823c4d6365fdc459e3c1a04161431`, sin PR116. Paths exclusivos: prisma/schema.prisma; nueva migración20261006220000_add_tooth_surfaces; app/api/teeth/route.ts y tests para serializar estado general; nuevo app/api/teeth/surfaces/route.ts y test; lib/dental/tooth-surfaces.ts y tests si necesario; registro API vertical y tests asociados; docs/CHANGELOG.md. Migración sólo archivo. Sin UI, DB real, instalación, generación Prisma compartida ni fanout. Legacy general/caras independientes, cuatro condiciones, AUSENTE bloquea edición, no borrar caras.

## Lease y unidad elegida (registrados antes de editar código)

### C6a autorizado tras revisión favorable84d6df62

Continuación en PR116/rama `codex/c6-historia-orden-clinico`, base84d6df620e37409b91b74c8ebb228fcf4b3addc6. Lease exclusivo: nueva `app/(dashboard)/patients/[id]/records/page.tsx`, helper y tests de consulta/paginación bajo `lib/pacientes/`, tests de página, enlace mínimo en `FichaVista.tsx`, `docs/CHANGELOG.md`. APIarray, schema y parche P2 intactos. Sin fanout. Datos sintéticos para QA; no afirmar revisión visual aprobada mientras navegador local bloqueado. Registro anterior a edición de código C6a.

### Entrega C6a

Commit remoto `970bdb1e752ad98ad9998cfdcd4cb682721b37e2` sobre84d6df62 en PR116 actualizado;6archivos372+/1-. Worktree limpio. CI/review del nuevo delta pendientes; no merge/deploy/autosync.

- Implementada página servidor con20+1 registros, cursorID limitado a128caracteres y resuelto contra el mismo paciente/tenant; clave de orden date/createdAt/id descendente. Cursor borrado/ajeno inválido sin leer lista. Límite fijo, no impuesto por cliente.
- Página exige sesión, guard vertical, permiso clínico real y rubro con ficha clínica incluso con plataforma apagada. Tenant/paciente filtrados;403 de permisos convertido a404, sesión ausente a login. UI con Card/EmptyState/links del kit, fechas zona organización, campos largos y multilinea. Enlace mínimo en bloque clínico de ficha; APIarray intacta.
- Pruebas:175PASS/7suites, luego suite página14PASS al sumar caso última página (176casos distintos finales). Cobertura:25 registros20+5, empates, fecha clínica/importación, inserción reciente entre páginas, tenant/cursores ajenos, límite20 exacto, vacío/error, permisos efectivos STAFF yADMINrecortado, rubro y gate. Logs c6a-tests.log/c6a-page-final.log.
- Primer intento detectó trackID erróneo del fixture; corregido al canónico gestios-servicios-profesionales. Gate de vocabulario detectó2literales; se corrigió la página sin relajar gate. No fallo repetido tras corrección.
- ESLint5TS y diffcheck PASS. Typecheck global exit2 por Prisma compartido obsoleto; sin diagnósticos en nuevos helpers/página/FichaVista (`c6a-types.log`). Sin regeneración/build/DB.
- P2: check selectivo de FichaVista pasa después de C6a; no se aplicó/modificó parche. Solape sigue sólo de archivo/hunks próximos, no lógica de tratamientos.
- QA preparada: c6a-fixtures.json contiene25 registros ficticios. Casos: inicio20+link, cursorrec_005→5últimos, rec_000→vacío, cursor borrado/ajeno, input[]/vacío/inválido, permiso denegado y fallo deconsulta. Captura futura390/1440 con textos largos y ambos rubros clínicos; fixtures no acreditan app autenticada ni revisión visual. Bloqueo CUA localhost indicado por madre, no eludido.
- Limitación: el cursor resuelve fecha actual del registro ancla; inserciones recientes no duplican, pero editar fecha del ancla entre requests puede cambiar el recorrido. No se ofrece snapshot transaccional entre páginas.
- Siguiente pendiente técnico: C5 agenda por profesional o C6b odontograma5caras requieren unidad y lease propios; C6a no implementa historial completo de citas. No iniciar otra unidad antes de review.

- Base Platform remota verificada: `master` = `5102535cdd2823c4d6365fdc459e3c1a04161431`.
- Checkout previsto aislado en E: `E:/ONIA-Codex/cierre-1.0-20261006/platform-desarrollo`; rama `codex/c6-historia-orden-clinico`.
- Paths exclusivos: `app/api/patients/[id]/records/route.ts`, su `route.test.ts`, `docs/CHANGELOG.md`. Este reporte es entrega externa; manifest y handoff sólo los edita madre.
- Defecto C6/B12 comprobado en master: GET de historia completa ordena por `createdAt`, mientras la ficha ordena por `date`; una consulta histórica cargada después puede quedar delante de una consulta clínicamente más reciente. Campo `date` ya existe y no es nullable. Corregir sólo orden por fecha clínica, con desempate estable, y probar contrato/tenant/permiso. Sin UI, paginación nueva, schema ni DB.
- C11b no se inicia hasta merge de C11a. C14 conserva prueba de pago y aprobación legal. Caja no se reabre.
- Herramientas/skills: Git/gh para SHA y CI; patrones locales + code-review-and-quality, onia-seguridad y onia-verificacion ya leídas; Vitest/ESLint existentes. Sin API nueva, no se necesita investigación externa. Sin fanout/build/install/gasto/merge/deploy/SQL real/autosync.

## Evidencia remota inicial

Los cuatro PR siguen OPEN, con CI y Secret scan SUCCESS sobre el mismo HEAD (consulta actual por gh, no inferido del handoff). Supabase Preview SKIPPED no acredita DB.

| PR | HEAD | CI run | Estado |
|---|---|---|---|
| 110 Caja | `34daf14e02c85bc611cf3caae11ef0c76ce010fa` | 37468652936 | SUCCESS |
| 113 C13 | `2f2b0743089dbdf0dc5816499d0690d94b7d4549` | 37412917110 | SUCCESS |
| 114 C15 | `37c08ba51a30e0ca89f539b89974ba5c26c792e3` | 37413926922 | SUCCESS |
| 115 C11a | `6f940cfc5868efd6de08724785816e86ccb2e3c7` | 37414218141 | SUCCESS |

## Matriz inicial de los 15 puntos (antes de los PR116–120)

Lectura actual de fuentes sobre master `5102535c` y PRs indicados. «Publicado según handoff» es evidencia histórica atribuida, no prueba nueva de producción. Fuente de alcance: `hermes-content/docs/ONIA_PLAN_1.0_Y_CAJA.md:15-35`; gates: `handoff/onia-1.0-nube.md` §§3/6 y `handoff/codex-relevo.md` §§2/4. Raíz documental: `C:/Users/PC/.codex/worktrees/madre-codex/onia-hermes/hermes-content/docs/`.

| # | Estado técnico y evidencia concreta | Pendiente real para cerrar |
|---|---|---|
| 1 Cobro QR completo | Flujo existente; handoff nube §3 registra QA Pago creada, sin ensayo completo acreditado. No se consultó cuenta ni DB real. | Gate operativo: confirmar correo QA, comprobante PRUEBA y aprobación autorizada, observar activación. No requiere inventar otra implementación antes del ensayo. |
| 2 Checkout/factura/titular | PR111 MERGED, merge `97fe3061`; `app/checkout/CheckoutClient.tsx:840` promete factura por correo después de verificar pago. Handoff reporta publicación del mismo release. | QA autenticada con punto1 y capacidad fiscal manual confirmada. No cambiar precio/texto legal. |
| 3 Datos clínicos fuera del canal y clave pública | PR108 MERGED `ed40eaaa`; select cerrado y payload ID documentados en handoff nube §2. Migración `prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql` presente. | Gate SQL real: aprobación explícita, aplicar permisos y comprobar rechazo anon; el handoff reporta 2 tablas pendientes, no revalidado aquí. CI no demuestra RLS productivo. |
| 4 Backup externo/restauración | Scripts `scripts/backup-onia-postgres.sh`, `scripts/qa-v1/restore-runtime.py` existen. Handoff madre §gates y nube §6 aún requieren bucket externo. | Gate infraestructura: destino R2 y permisos; backup fuera VPS y restore comprobado con evidencia del sistema actual. Ensayos locales históricos no acreditan ese circuito. |
| 5 Agenda por profesional/confirmar | Confirmación está en `app/(dashboard)/appointments/AgendaClient.tsx:885`. Vista de calendario mensual y lista en :643/:771; B01 del documento de brechas identifica ausencia de columnas. | FALTA IMPLEMENTACIÓN UI: vista diaria por profesional y huecos. Definir datos/horarios, cruces y responsive; no es sólo un permiso pendiente. Fuera de esta tanda sin UI. |
| 6 Historia completa/5 caras | Ficha `app/(dashboard)/patients/[id]/page.tsx:88-104` limita historia y citas a10. `FichaVista.tsx:334` recorre colección recibida; no enlace ver todo. Odontograma mantiene estado por pieza (`prisma/schema.prisma:878`, `app/api/teeth/route.ts:36`, `components/odontogram/Odontogram.tsx:130`). GET completo usa createdAt; esta unidad corrige eso. | FALTAN DOS IMPLEMENTACIONES: historia completa navegable, y modelo/API/dibujo odontograma de5caras. El arreglo de orden NO cierra C6. Odontograma exige diseño y migración revisados antes de producción. |
| 7 Presupuesto por fases/tratamientos empezados | Tratamiento con fecha histórica integrado PR108; `app/api/patients/[id]/treatments/route.ts:25,85` usa fechaDelPaso. P2 existe en `cola/capturas-presupuesto-fases/presupuesto-por-fases-p2.patch` según handoff. | Gate diseño P2 y luego integración técnica del parche, resolución de solapes en FichaVista, CI/revisión. No reconstruir P2. |
| 8 Caja diaria | PR110 OPEN `34daf14e`, CI+Security SUCCESS, revisión v2 favorable registrada en madre. No se modifica en esta tanda. | Capturas/OK diseño, migración20261004190000 antes de swap, integración y QA real; no reabrir código ya revisado. |
| 9 Demo recall | PR99 MERGED `af2ded5c`. Handoff nube §2 documenta demo sembrada con casos ficticios y sin canales de envío; no se inspeccionó sesión actual. | Gate acceso/entitlement module.agents y observar propuestas reales. No asumir que seed/test equivale demo funcionando. |
| 10 WhatsApp por cita/conexión honesta | PR112 MERGED, merge master `5102535c`, CI+Security SUCCESS; corrige descripción de alta/coexistencia. Handoff aún deja prueba del chip y demo. | QA de cada superficie de cita y conexión real autorizada; cobertura funcional completa no certificada por cambiar copy. Sin cambios de canales/cuentas en esta tanda. |
| 11 Reprogramar/feriados/reserva | C11a PR115 OPEN `6f940cfc`, CI+Security SUCCESS, revisión favorable; incluye volver a pendiente/invalidate token y aviso profesional. Calculadores master `booking/slots`, `booking/appointments`, `appointments/availability` aún no leen holidays. | FALTA IMPLEMENTACIÓN C11b, expresamente dependiente del merge C11a. Después, feriados UI/API/cálculo y pruebas de reserva. No iniciar antes del gate. |
| 12 CSV ; /soporte | PR109 MERGED `88e4869f`, CI+Security SUCCESS; handoff reporta release97fe3061 con ambos cambios. | QA autenticada de importación y enlace soporte pendiente con punto1; no reimplementar CSV. |
| 13 Gracia/no renovar | PR113 OPEN `2f2b0743`, CI+Security SUCCESS y revisión favorable registrada. | Integración autorizada/QA del ciclo temporal y baja; no reimplementar. |
| 14 Fecha/versión términos | Registro existente guarda `termsAcceptedAt` y auditoría con VERSION_TERMINOS (`app/api/auth/register/route.ts:392,420`). Organization sólo tiene timestamp en schema:30; no certifica contrato de aceptación de cada pago. | FALTA IMPLEMENTACIÓN C14, bloqueada por ensayo punto1 y aprobación de casilla legal. Migración/checkout/addon/modal según relevo. No tocar términos ni iniciar antes del gate. |
| 15 Factura manual al aprobar | PR114 OPEN `37c08ba5`, CI+Security SUCCESS, revisión favorable; marca interna verificada y registro fiscal. | Migración antes del código, capacidad PortalSIN confirmada, ensayo punto1 e integración autorizada. No emitir facturas de prueba ni integrar por CI solamente. |

Evidencia GitHub de9PR con SHA/merge/checks guardada en `pr-evidence.json`. No se verificó producción ni se hizo sesión real. Los15 puntos NO están cerrados: faltan implementación5/6/11b/14, integrar P2 y varios gates operativos.

## Resultado de la unidad C6/B12

- Cambio de una consulta: `orderBy` fecha clínica descendente, fecha de carga descendente, ID descendente. Sin cambiar respuesta array, filtros, permisos, POST, schema o UI.
- Test de regresión ejecutado antes: 1 fallo esperado por orderBy viejo,7PASS (`c6-red.log`). Después: 19/19PASS en ruta8 y access-control11 (`c6-green.log`). No se simuló un sort en el mock: se prueba la consulta que delega el orden a Prisma.
- Test adicional: paciente fuera del tenant devuelve404 sin leer registros. El test de STAFF403 sigue pasando. No DB real.
- ESLint de ambos TS y `git diff --check` aprobados. `tsc --noEmit --incremental false` exit2 por cliente Prisma compartido desactualizado (visualSelection/deactivatedAt, etc.), sin diagnósticos en records; `c6-types.log`. No instalar/generar/build.
- Commit subido `84d6df620e37409b91b74c8ebb228fcf4b3addc6`, draft [PR116](https://github.com/oninteligenciaartificial/onia-platform/pull/116). Tres archivos,46 inserciones/1 eliminación; worktree limpio. Hooks desactivados por comando, sin autosync. Cierre del PR requiere CI y revisión independiente; no se declara cierre total1.0.

## Siguiente unidad propuesta — NO iniciada

**C6a: historia clínica completa navegable**, antes de odontograma. Impacto: el profesional puede recuperar una consulta anterior a las10 visibles; usa modelo existente y no requiere migración. Propuesta: página dedicada bajo `/patients/[id]/records`, paginación por fecha clínica+ID, enlace desde ficha y pruebas de acceso/tenant/orden. Paths a reservar: `app/(dashboard)/patients/[id]/records/page.tsx` (nuevo), `app/(dashboard)/patients/[id]/FichaVista.tsx` (enlace pequeño), API records+tests si se elige paginación de API, y tests focales de página. Contrato UI y snapshots de referencia a coordinar con carril visual; no usar login/register reservados.

Dependencias antes de iniciar: review de esta unidad, lease de madre, contrastar solape `FichaVista.tsx` con P2 ya preparado. No alterar el parche P2 sin coordinación. Si madre prioriza recepción, siguiente alternativa C5 columnas requiere lease de AgendaClient/page y un componente nuevo de grilla; UI/datos y horarios merecen una unidad propia. Odontograma5caras es otra unidad posterior con contrato de migración, no una bandera cosmética.

## Entrega C6b1 — PR119

- Draft https://github.com/oninteligenciaartificial/onia-platform/pull/119; SHA `cf1d86ea33a7935896c822d5dd113522bb933316`, rama `codex/c6b1-caras-api`. Base master5102535c, sin PR116. Diez archivos,396+/12-. Commit/push con hooks desactivados sólo para esos comandos. Worktree limpio.
- Persistencia independiente de cinco caras/cuatro condiciones, sin backfill ni eliminación; no fila no implica SANO. GET/POST con tenant, permisos efectivos y guard dental. Validación estricta, revisión CAS/409, lock paciente compartido con legacy, AUSENTE bloquea sin borrar caras, auditoría atómica.
- 142PASS/6suites (`c6b1-tests.log`), ESLint7TS PASS, Prisma validate PASS (`c6b1-schema.log`), diffcheck PASS. Pruebas legacy conservan siete condiciones/notas y contrato array; nuevas cubren160combinaciones FDI/cara, permisos/tenant, validación y conflictos.
- Typecheck exit2 (`c6b1-types.log`): cliente Prisma compartido antiguo sin toothSurfaceRecord y errores preexistentes visualSelection/deactivatedAt. No se regeneró ni modificó cliente compartido. CI deberá generar cliente final; no declarar typecheck aprobado.
- PostgreSQL/psql no disponibles; Docker instalado sin engine activo. No se instaló/inició nada. Tests son mocks/contratoSQL y no acreditan carreras ni rollback PostgreSQL real.
- Migración sólo archivo20261006220000_add_tooth_surfaces; RLS/revokes, checks e índices. NO aplicada, sin DB real. Aplicación exige migración previa autorizada; rollback conserva tabla/datos. No merge/deploy/autosync. C6b2 pendiente revisión independiente.
- CI37533459535 y Security37533459526 QUEUED al entregar; Supabase Preview SKIPPED. Ninguno acredita validación DB. Madre coordina revisión v2 y seguimiento CI. Informe y contrato externos, sin editar manifest/handoff madre.

### Corrección P2 C6b1 tras review v2

Madre autorizó delta limitado a surfaces GET/POST y pruebas, preservando guard global/API legacy. SHA remoto adb87855f0e1d2775b3eb89a2a99262c32abba17, PR119 draft actualizado, worktree limpio.3archivos55+/6-. Chequeo org authoritative antes de datos, isVerticalTrackId + resolver/capacidad tieneOdontograma sin depender de flag; inexistente/desconocida403 sin fallback.

62PASS/2suites enfocadas (caras + legacy); matriz flag0/1 ×4rubros ×permisos ×tenant, guard/context/resolver/access-control reales y DBmock. Repro externo v2 vertical.test.ts -t rubro veterinario:1PASS/35SKIPPED. ESLint2TS/diffcheck PASS. Logs c6b1-guard-tests.log y c6b1-guard-repro.log. No repetir142 globales ni schema/DB; mismas limitaciones de Prisma y SQL no aplicado. Nuevo delta pendiente revisión v2; no editor.

## Lease C6b2 registrado antes de editar

Autorización madre sobre adb87855, misma rama/PR119. Paths exactos: components/odontogram/Odontogram.tsx; app/(dashboard)/patients/[id]/odontogram/page.tsx y page.test.ts; lib/dental/odontogram-editor.ts y odontogram-editor.test.ts; components/odontogram/Odontogram.test.ts; app/dev/odontograma/page.tsx y BancoOdontograma.tsx; docs/CHANGELOG.md. Sin backend/schema/migración. Fixture reusa patrón fetch interceptado de app/dev/admin-origen/BancoAdmin.tsx, con instalación/cleanup limitado y datos sintéticos; no handlers nuevos de producción ni red clínica real. Skills onia-frontend/impeccable/ui-styling/ui-ux-pro-max y seguridad/verificación ya leídas; sin API desconocida/deps, no investigación externa necesaria. Madre único navegador. Parada: entrega revisable, sin DB/producción/editor extra ni fanout.

### Entrega C6b2

PR119 actualizado a dcb5cb2282e579ad8fdd070f098d076e7c900b5e, sobre adb87855.9archivos412+/222-, worktree limpio. Arco conserva FDI/general, detalle5caras44px texto/orientación; no fila distinto deSano, nunca inferir caras. Página consulta caras tenant/paciente y pasa canWrite explícito; no rubro desconocido. Sólo lectura explora, AUSENTE preserva/bloquea caras. Borrador retenido error409/red, recarga confirmada sin perder borrador siGETfalla; éxito trasrespuesta. Aviso cambios al cerrar/cambiar detalle, enlaces y beforeunload; no se promete bloqueo de navegación history SPA.

26PASS/3suites (`c6b2-tests.log`): helper y handlers UI con harness hooks/eventos, página permisos/rubro/tenant. No DOM ni QAvisual acreditados por esos tests. ESLint8TS/TSX+diffcheck PASS. `c6b2-types.log` mantiene cliente Prisma viejo: error toothSurfaceRecord en página; sin otros diagnósticos editor. Sin generación/build/DB. CI previo seguía pendiente runner; ningún fallo concreto hallado. No repetición global142.

Fixture: `/dev/odontograma?caso=legado|caras|vacio|ausente|readonly|error|conflicto`; seleccionar36, probar11/21/31/41. Mismo componente, fetchsintético scoped/cleanup del patrón BancoAdmin, sin red clínica;404prod. Madre único browser prepara QA390/1440+teclado. Revisión exacta v2 sólo delta adb87855..dcb5cb22. Migración sigue archivo noaplicado; sin producción. No features extra trasentrega.

QA madre detectó voseo: corregido en componente/helper y fixture al trato usted. SHA final4fe69b89e4f8606e548c2380a5e0839f7c957345 (sólo copy,3archivos11+/11-).19PASS2suites pertinentes (`c6b2-copy-tests.log`), ESLint3/diffcheck PASS. Primer comando sustitución abortó antes de editar por claves duplicadas PowerShell; corregido y después normalizado EOF detectado por diffcheck. Sin fallos restantes. QA visual en curso por madre; no declarada aprobada.

P3 final de review v2: «Revise tu conexión» cambiado a «Revise su conexión» en Odontogram. SHA remoto final4cb9495cca8d1fba71f7c2b1cfef42576ab1f72f,1archivo1+/1-, diffcheckPASS, limpio. Sin repetir suites por indicación madre. V2 favorable funcional sobre4fe69b89; madre confirmó navegador guardar caras/409 conserva/cancelar cambio. QA restante bloqueada parcialmente por diálogo/hotreload/IAB sin repro de producto; no se cambió lógica para eludirlo.
