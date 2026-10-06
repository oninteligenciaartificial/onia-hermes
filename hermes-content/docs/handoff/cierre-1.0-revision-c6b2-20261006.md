# Revisión C6b2 — PR119

- META: revisar permisos de lectura/escritura, separación general/caras, borradores, AUSENTE, orientación y contratos del editor.
- PRUEBA DE HECHO: inspección del delta adb87855f0e1d2775b3eb89a2a99262c32abba17..4fe69b89e4f8606e548c2380a5e0839f7c957345, 26 pruebas focales propias aprobadas y diff --check sin errores.
- REGLA DE PARADA: revisión proporcional sin suites globales, instalaciones, Prisma generate, BD, SQL, merge ni deploy. QA visual a cargo de Madre.

## Dictamen

FAVORABLE en funcionalidad y contratos; un detalle P3 de copy en el SHA final 4fe69b89e4f8606e548c2380a5e0839f7c957345. No se identificaron P1/P2 en este delta.

### P3 — posesivo informal restante

components/odontogram/Odontogram.tsx:157 contiene `Revise tu conexión; su borrador se conserva.` en el fallback de error de red. Cambiar `tu` por `su` para cumplir el trato de usted. Es texto propio del producto, no contenido clínico ingresado por usuarios. No requiere repetir la batería funcional si el ajuste se limita a esa palabra.

## Evidencia

- La página comprueba clinical.read antes de consultar datos clínicos; patientId se busca dentro de la organización de sesión. La capacidad clinical.write del servidor controla la edición. El guard explícito rechaza rubros no dentales, desconocidos o ausentes.
- Las pruebas de página simulan permisos y persistencia. La verificación independiente del guard real del API pertenece a C6b1 y no se repitió aquí.
- General y caras se almacenan y actualizan por separado. Una cara ausente inicia sin condición, sin inferir SANO ni copiar la condición general. El guardado requiere elección explícita.
- AUSENTE conserva información previa de caras para consulta y bloquea su edición. La protección del API sigue siendo la de C6b1.
- Los errores 409/500 y de red conservan el borrador y no muestran éxito. El conflicto bloquea reintentos hasta recargar. La recarga actualiza estado solo después de recibir y parsear ambas respuestas exitosas; un fallo conserva el borrador.
- Cambiar pieza/cara, cerrar o navegar por enlaces pide confirmación si hay cambios; beforeunload cubre salida de documento. Esto no certifica protección de toda navegación programática o historial SPA.
- Orientación coherente con el mapa FDI declarado y probada en los cuatro cuadrantes; central se etiqueta incisal para anteriores y oclusal para posteriores. No constituye validación clínica externa.
- Payload general mantiene contrato existente; cara añade surface/revision, sin enviar tenant o actor. El delta no cambia API ni esquema.
- El banco utiliza datos ficticios, intercepta las dos rutas API y restaura fetch al desmontar. La página responde notFound en producción. No se usó BD real.

## Validación y límites

Ejecución propia: `node node_modules/vitest/vitest.mjs run components/odontogram/Odontogram.test.ts lib/dental/odontogram-editor.test.ts app/(dashboard)/patients/[id]/odontogram/page.test.ts`: 26/26 PASS, tres suites. El ajuste final dcb5cb22..4fe69b89 cambia exclusivamente texto en tres archivos (11+/11-); no se repitieron pruebas por ese ajuste. `git diff --check adb87855..HEAD` aprobado; árbol limpio al inspeccionar SHA final.

Frente utilizado: revisión y QA focal por Madre v2; sin subagentes. Pendientes de cierre global: QA visual de Madre, CI de tipos/build y gates de migración/producción ya documentados en C6b1. No se autoriza merge o deploy mediante este informe.

## Cierre P3 por madre

SHA final `4cb9495cca8d1fba71f7c2b1cfef42576ab1f72f`: madre inspeccionó diff respecto a4fe69b89; cambia exclusivamente «Revise tu conexión» por «Revise su conexión». Una línea, sin lógica. P3 cerrado sin repetir suites, conforme al dictamen del revisor. CI final en cola; migración/DB/QA visual completa pendientes.
