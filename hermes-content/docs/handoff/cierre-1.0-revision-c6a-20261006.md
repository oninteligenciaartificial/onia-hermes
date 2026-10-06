# Revisión independiente C6a — 2026-10-06

META: revisar permisos, rubro, tenant, cursor, orden, paginación y entrada desde ficha.
PRUEBA DE HECHO: revisión del delta y ejecución focal independiente con casos adicionales.
REGLA DE PARADA: dictamen por SHA; sin cambios productivos ni QA visual declarada.

## Dictamen

FAVORABLE, sin hallazgos bloqueantes en 970bdb1e752ad98ad9998cfdcd4cb682721b37e2 contra 84d6df620e37409b91b74c8ebb228fcf4b3addc6.

- Sesión antes de datos; clinical.read mediante access-control real. Gate vertical y comprobación explícita de fichaClinica antes de consultar paciente/historia, incluso con flag de plataforma apagado.
- Patient y cursor filtran por tenant de sesión y paciente de ruta. Cursor ajeno/borrado no consulta la colección. Sólo se acepta ID acotado a128 caracteres; no se aceptan fechas/filtros del navegador.
- Keyset descendente lexicográfico correcto: date menor, o misma date y createdAt menor, o mismas fechas e id menor. Coincide con orderBy date/createdAt/id. Las21 filas permiten mostrar20 y decidir siguiente sin enlace fantasma.
- Select de campos explícito; notas se renderizan como texto React con saltos de línea, sin HTML crudo. Fallo de consulta no muestra detalles internos.
- Enlace de FichaVista dentro de esClinico && clinical.read, sin exigir clinical.write; siempre disponible en esa sección, por lo que también permite acceder a registros posteriores a los10 del resumen.
- API array sin cambios. No schema/dependencias/permisos nuevos.

## Evidencia independiente

- HEAD exacto, árbol limpio; diffcheck PASS.
- Nuevas suites page + historia-completa:26/26 PASS. No se repitió B12 ni la batería176 del autor.
- Tres casos propios PASS fuera del worktree: frontera entre páginas con igual date pero distintos createdAt (25 registros), enlace con clinical.read sin write y ausencia del enlace sin lectura clínica.
- Evidencia reproducible en E:/ONIA-Codex/cierre-1.0-20261006/qa-c6a-review. Los mocks de Prisma ejecutan filtros/sort en memoria; no acreditan SQL real, collation, índices ni rendimiento PostgreSQL.
- Los primeros intentos del harness externo fallaron por resolución entre unidades C/E y alias Next del mock; corregida sólo la configuración externa,3/3PASS. No fueron fallos del producto.
- No se ejecutaron tsc global, build, instalaciones, BD real, navegador, merge ni deploy. Un solo frente de revisión, sin subagentes.

## Límites y gates

- QA visual y responsive pendientes de Madre sobre fixture C6a. No declarar visualPASS por render estático.
- CI/typecheck/build del SHA final siguen como gate; no consultados en esta revisión. Prisma compartido obsoleto no se regeneró.
- Sin garantía de snapshot ante edición concurrente de las fechas del propio cursor; con datos estables y altas más recientes el keyset evita los desplazamientos propios de offset. Cursor eliminado ofrece reinicio explícito.
- La ficha resumida aún ordena sólo date, por lo que los empates de sus10 filas pueden diferir de la historia completa; limitación previa no introducida por este delta. No bloquea recuperar toda la historia.
- El apply-check P2 favorable es evidencia del autor, no repetida aquí. Coordinar integración con ese parche.
- Odontograma por caras e historia completa de citas siguen pendientes. Esta revisión no declara C6 entero cerrado.
