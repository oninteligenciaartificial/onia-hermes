# Cierre técnico 1.0 — desarrollo, 6-oct-2026

## Lease y unidad elegida (registrados antes de editar código)

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

## Matriz de los 15 puntos

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
