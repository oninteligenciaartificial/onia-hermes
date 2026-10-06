# C6b — contrato cerrado: odontograma de cinco caras

6-oct-2026. Inspección sobre `970bdb1e` (PR116). Sólo propuesta: no se editó código/schema ni se ejecutó DB. C5 tiene otro dueño.

## Decisión recomendada

Añadir registros por cara conservando intacto el estado general por diente. No convertir un registro legado de CARIES en cinco caras afectadas ni interpretar notas automáticamente. **Sin registro no equivale a SANO.** Es registro manual del profesional, sin diagnóstico, recomendaciones ni IA.

## Base comprobada

- `prisma/schema.prisma:878`: ToothRecord con UNIQUE(patientId,toothNumber), siete condiciones, notes y updatedAt.
- `app/api/teeth/route.ts`: GET array y POST de pieza completa, permisos clinical.read/write y filtro del paciente por organización. Conservar ambos contratos.
- `components/odontogram/Odontogram.tsx`: una figura por pieza; hoy asume SANO visual cuando no hay fila. No persistir ese supuesto.
- `lib/dental/fdi.ts`: 32 piezas permanentes. No añadir dentición temporal en esta unidad.
- `app/(dashboard)/patients/[id]/odontogram/page.tsx:31,43`: exige lectura y rubro dental; todavía no pasa permiso de escritura al componente. Añadir modo sólo lectura; el POST ya protege la escritura.

## Semántica de las cinco zonas

MESIAL, DISTAL, VESTIBULAR, LINGUAL y CENTRAL. CENTRAL se muestra como incisal para anteriores (FDI1–3) u oclusal para posteriores (4–8). El dibujo debe orientar mesial/distal según cuadrante y línea media; siempre acompañar con etiquetas.

Referencia de nombres: [glosario ADA](https://www.ada.org/publications/cdt/glossary-dental-terms) y [superficies ADA](https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/publications/cdt/v2019adadentalclaimcompletioninstructions_v3_2022feb.pdf?hash=8EFBBD50FA335262C463823E1CA83DFE&rev=70d192ad312a47f285487c1d69de4190). Sustentan nomenclatura, no certificación clínica ni interoperabilidad automática.

- Por cara: SANO, CARIES, RESTAURADO o FRACTURA, elegidos explícitamente, y nota opcional.
- AUSENTE, CORONA e IMPLANTE siguen siendo estados de pieza completa.
- Si la pieza está AUSENTE, no guardar nuevas caras; conservar las anteriores como registros previos.
- Legado sin caras: mostrar «Estado general registrado; caras sin especificar». General y caras pueden coexistir; no derivar ni sobrescribir uno desde el otro.

## Schema aditivo y rollback

Nuevo ToothSurfaceRecord: id, organizationId, patientId, toothNumber, surface, condition, notes, updatedAt, updatedByProfileId y revision. UNIQUE(patientId,toothNumber,surface), índice tenant/paciente y relaciones a paciente/organización. Tabla independiente: guardar una cara no debe crear una pieza general SANO ficticia.

Migración únicamente aditiva: tabla, tipos/constraints e índices. Cero backfill, sin modificar ToothRecord ni su unique. Restringir condiciones por cara y comprobar políticas RLS/grants: nunca abrir acceso anon por defaults. Revisar integridad de tenant en relaciones y consultas.

Rollback seguro = volver al código anterior conservando la tabla nueva y sus datos. DROP sólo sería reversible antes de uso, comprobando tabla vacía y con autorización. No borrar datos clínicos para deshacer un despliegue. Orden productivo: respaldo → autorización → migración → verificación de esquema/RLS → código → smoke. No merge con publicador automático antes de coordinar la migración. Nada de esto se ejecutó.

## API y permisos

Endpoint separado `/api/teeth/surfaces`, leyendo y guardando una cara por vez; GET/POST antiguos intactos. Sesión, guard dental, clinical.read/write y paciente del tenant antes de datos. organizationId/actor salen de sesión, nunca del body.

Validar cuid, FDI del set actual, cinco caras, cuatro condiciones permitidas, nota≤500 y revisión entera. Rechazar campos desconocidos. Misma cara usa revision para devolver409 si otro profesional cambió el registro; caras distintas no se pisan. La nueva API no reemplaza una colección completa enviada por el navegador.

Serializar guardar cara y marcar pieza AUSENTE con el mismo lock tenant/paciente en ambas rutas, dentro de transacción. Registrar cambios con el helper de auditoría existente, sin imprimir notas. Borrar una cara queda fuera de este primer corte: no añadir un flujo destructivo innecesario.

## UI

Conservar arco FDI; seleccionar pieza abre detalle ampliado de cinco caras. Ofrecer cinco botones con texto, foco y objetivos de44px: no depender de cinco zonas diminutas en el SVG actual de36px. Estado general separado y destino de edición siempre visible.

Texto y leyenda además del color; sin registro visualmente distinto de sano. Guardar sólo con clinical.write; lectura permite explorar. Mantener borrador ante error/conflicto, no anunciar éxito antes de respuesta. Avisar antes de abandonar cambios sin guardar. Kit existente, sin nuevas dependencias/iconos. QA390/1440 y teclado con datos sintéticos antes de publicación.

## Prueba y alcance

- Preservar valores/notas de los siete estados legados y32FDI; ninguna cara inferida.
- Casos legado solo, caras solas y ambas capas; API antigua compatible.
- Permisos reales, tenant ajeno, rubro no dental, validación estricta y auditoría.
- Dos caras concurrentes sin pérdida; misma cara409; AUSENTE contra escritura; rollback por error. Ensayo de transacción en DB local aislada cuando esté autorizado: mocks no acreditan carreras reales.
- UI sólo lectura, vacío, notas largas, pieza ausente, cara sana explícita, error y conflicto; orientación de los cuatro cuadrantes comprobada.
- Migración y rollback de aplicación sobre datos sintéticos, CI/types y revisión independiente. Sin DB real ni migración aplicada en esta tanda.

Tamaño estimado:10–15 archivos. Dos commits/unidades consecutivas revisables: persistencia/API y editor/QA. Paths: schema+migración nueva, endpoint+tests, registro de rutas, helper de caras+tests, Odontogram, su página servidor, fixtures y CHANGELOG. No tocar P2 ni FichaVista si el enlace actual basta. Madre fija lease exacto antes de implementación. No iniciar por mantener la sesión ocupada.