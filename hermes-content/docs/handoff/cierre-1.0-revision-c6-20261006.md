# Revisión independiente C6/B12 — 2026-10-06

META: revisar orden clínico, desempate, tenant, permisos y contrato de respuesta.
PRUEBA DE HECHO: delta exacto, schema y consumidores inspeccionados; prueba focal ejecutada por revisión.
REGLA DE PARADA: dictamen por SHA y valoración C6a; sin implementar producto.

## Dictamen

FAVORABLE, sin hallazgos bloqueantes en 84d6df620e37409b91b74c8ebb228fcf4b3addc6 contra 5102535cdd2823c4d6365fdc459e3c1a04161431.

- Único cambio runtime: app/api/patients/[id]/records/route.ts:34 ordena date DESC, createdAt DESC, id DESC.
- schema.prisma:852-871 confirma date y createdAt no nulos e id único. Esto da un desempate total dentro del conjunto consultado; el ID no se interpreta como fecha.
- requireAuth, gate vertical y clinical.read siguen antes de leer paciente/historia. Paciente y registros filtran por organizationId de sesión; query string no elige tenant. Paciente ausente devuelve404 sin consultar registros.
- Se conserva array y doctor.name, sin take/paginación ni cambios de POST.
- Las dos pruebas nuevas comprueban la consulta real enviada a Prisma y paciente ajeno. El mock devuelve datos preparados: no demuestra ejecución del orden en PostgreSQL y no se presenta como tal. No se eliminaron asserts.

## Verificación independiente

- HEAD exacto y árbol limpio antes de revisar.
- node node_modules/vitest/vitest.mjs run 'app/api/patients/[id]/records/route.test.ts': 8/8 PASS.
- git diff --check 5102535c 84d6df62: PASS.
- Inspección de fecha clínica, desempates, filtros, respuesta y consumidores.
- No se repitieron otras suites. No tsc global/build/install/generate; el reporte del autor atribuye el bloqueo de tipos al Prisma compartido desactualizado. No equivale a compilación verificada.
- Sin DB real, sesiones reales ni verificación de producción. No se consultó CI en esta revisión.
- Frente único de revisión técnica/seguridad/contrato, sin subagentes. Sin cambios al worktree.

## C6a recomendado, no implementado

La ficha servidor limita clinicalRecords a10 (patients/[id]/page.tsx:88-92) y FichaVista recorre sólo esa colección. Es razonable continuar con una página servidor /patients/[id]/records y enlace desde la ficha, sin migración.

Contrato recomendado: autenticación y permiso clinical.read antes de consultar historia, gate de rubro, paciente+tenant de sesión, página de tamaño acotado, navegación a registros anteriores y fechas en zona del negocio. Mantener el orden completo date/createdAt/id en cada página y en la vista resumida para evitar divergencia en empates. Si se elige cursor, debe representar/validar ese mismo orden y pertenencia al paciente/tenant; no reducirlo silenciosamente a date+id. Probar más de10 registros, empates, páginas sucesivas sin omisiones/duplicados bajo datos estables, vacío, denegación y tenant ajeno.

Preferir consulta directa de servidor con contrato compartido; no cambiar el array de la API existente sólo para esta pantalla. Coordinar lease y solape mínimo en FichaVista.tsx con P2 y revisión visual. Odontograma de cinco caras sigue fuera de esta unidad; esta corrección no cierra C6 completo.
