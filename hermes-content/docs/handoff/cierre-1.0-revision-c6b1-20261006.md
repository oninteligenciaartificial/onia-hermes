# Revisión C6b1 — 2026-10-06

META: permisos clínicos, tenant, migración, CAS, auditoría y coordinación general/caras.
PRUEBA DE HECHO: delta10paths, consultas y constraints revisados; pruebas focales y dos órdenes de escritura con handlers reales.
REGLA DE PARADA: dictamen del SHA; sin SQL/DB real ni cambios productivos.

SHA cf1d86ea33a7935896c822d5dd113522bb933316, base5102535cdd2823c4d6365fdc459e3c1a04161431, PR119.

## Dictamen

FAVORABLE para el contrato API servidor revisado, sin bloqueantes nuevos identificados. No acredita migración aplicada, RLS operativo ni concurrencia PostgreSQL.

- requireAuth y clinical.read/write antes de datos; payload estricto rechaza tenant/autor proporcionados por navegador, FDI limitado a32 piezas permanentes, cinco caras y cuatro condiciones. Revisión0 significa nueva cara; ausencia de fila no se convierte en SANO.
- GET exige un solo patientId, paciente dentro de tenant y filtros de registros equivalentes. POST obtiene patient+tenant mediante SELECT FOR UPDATE parametrizado.
- Estado general y caras usan el mismo lock de paciente. Caras consultan AUSENTE después del lock y devuelven409 sin escritura. General no borra caras previas. No hay otro escritor toothRecord en app/lib hallado fuera de este handler.
- CAS comprueba revisión leída y updateMany con id/tenant/paciente/pieza/cara/revisión; índice único cubre creación simultánea y P2002 produce409.
- tx.auditLog.create ocurre dentro de la misma transacción después de escribir la cara; el error se propaga, permitiendo rollback PostgreSQL. No usa auditoría best-effort. Actor viene de sesión.
- SQL aditivo, sin backfill ni mutación de teeth_records; enums separados, unique por paciente/pieza/cara, checks FDI/revisión/notas y FKs con cascadas explícitas. @updatedAt y cuid se generan por Prisma; SQL no pretende defaults para escrituras ajenas.
- RLS habilitado sin policies públicas y REVOKE ALL a PUBLIC/anon/authenticated. No se introducen grants.

## Evidencia independiente

-53/53PASS en surfaces/route, teeth/route y migration.test; no se repitieron142.
-2/2 casos propiosPASS con ambos handlers reales: AUSENTE seguido de cara→200/409 sin cara; cara seguida de AUSENTE→200/200 conservando cara. Ambos invocan mismo SQL lock con mismo tenant/paciente y audit sólo para cara guardada.
-Evidencia externa: E:/ONIA-Codex/cierre-1.0-20261006/qa-c6b1-review. Simula callbacks serializados y estados en memoria: no demuestra que PG bloquee ni que haga rollback. La evaluación de la carrera real se apoya además en inspeccionar el mismo FOR UPDATE previo a lecturas/escrituras en ambos handlers.
-HEAD exacto, árbol limpio y diffcheckPASS.
-Sin tsc/build/generate/instalación/SQL/merge/deploy; no se inspeccionaron canales productivos ni se consultóCI.

## Límites y gates explícitos

-El aislamiento por rubro usa el guard compartido: teeth/surfaces sólo dental en registry cuando PLATFORM_LAYER=1. Con flag apagado el guard es no-op por diseño existente, por lo que no se puede afirmar restricción dental incondicional; permisos clínicos/tenant sí siguen activos. Si C6b requiere exclusión dental aun con flag apagado, añadir comprobación explícita antes de C6b2.
-Las FKs aseguran existencia de organización/paciente/autor por separado; no comprueban pertenencia entre ellos mediante FK compuesta. El contrato API obtiene tenant/actor de sesión y verifica paciente bajo lock; escrituras directas de roles privilegiados requieren controles operativos.
-Prisma servidor debe tener acceso como rol autorizado; verificar grants/RLS reales y migración antes de código. CI con cliente generado actualizado, ensayo de concurrencia/rollback en PG y QA autenticada siguen pendientes.
-POST general conserva su contrato previo sin nueva auditoría; la auditoría transaccional añadida corresponde a caras. No declarar auditado todo cambio del odontograma.
-C6b2 puede diseñarse sobre revisión/cara sin inferir legacy: deberá reenviar revisión leída, manejar409 sin sobrescribir, representar sin-registro explícito y conservar caras bajo AUSENTE. Editor y revisión visual todavía no acreditados.
-Un único frente de revisión técnica/seguridad, sin agentes adicionales.

## Rectificación contractual: dictamen REQUIERE CORRECCIÓN

El contrato confirmado por Madre exige caras sólo dental y exclusión del rubro antes de leer/escribir. Por tanto el límite de flag descrito arriba es un P2 y reemplaza el dictamen favorable inicial.

[P2] app/api/teeth/surfaces/route.ts:14 y34: requireVerticalRoute no restringe cuando PLATFORM_LAYER está apagado, y no hay comprobación dental independiente. Un ADMIN de vetgest-clinical con clinical.read/write accede a GET/POST de caras de su paciente. Es incumplimiento de rubro, no fuga cross-tenant. La nueva ruta no tiene datos legacy que justifiquen heredar este bypass.

Reproducción con handlers, access-control y api-guard reales, Prisma/Auth simulados, PLATFORM_LAYER=0: GET200 y POST200 frente a403/403 esperado. Evidencia qa-c6b1-review/vertical.test.ts y vertical.config.mts. No se asumió ni consultó el valor de producción.

Corrección recomendada: comprobar predicado dental canónico a partir de organización de sesión en ambos handlers, además del guard compartido; rechazar antes de datos clínicos/transacción. Probar no dental con flag0 y1, y dental permitido. No cambiar globalmente el flag ni compatibilidad de rutas ajenas para cerrar esta ruta. Esperar nuevoSHA antes de autorizar C6b2 según gate de API.

## Cierre P2 — adb87855

SHA adb87855f0e1d2775b3eb89a2a99262c32abba17 frente cf1d86ea: FAVORABLE; P2 dental cerrado.
Ambos handlers comprueban organización de sesión y capacidad odontograma antes del guard/global y datos clínicos. Organización ausente o track desconocido se rechaza, sin fallback dental. No modifica gate global, API general, CAS/migración ni auditoría.
Repro independiente original con guard real y flag0: antes200/200, ahora403/403,1PASS. Matriz nueva con guard/resolver/permisos reales flags0/1:12PASS. No repetidas suites globales. Diffcheck y árbol limpios. Permanecen gates PG real/migración/grants y CI del SHA final.
