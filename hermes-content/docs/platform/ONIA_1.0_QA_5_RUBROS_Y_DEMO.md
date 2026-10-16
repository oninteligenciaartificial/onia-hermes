# ONIA 1.0 — guion de QA por rubro y guion de la demo dental

> Doc vivo, sin fecha. Preparado el 16-oct-2026 sin acceso a producción (la red del entorno de nube
> bloquea `app.onia.com.bo`). **Nada de lo de abajo está ejecutado todavía**: es el guion para
> hacerlo apenas haya acceso. Cada fila se cierra con una captura MIRADA, no con un 200.
> Fuentes: `onia-platform/e2e/v1/cinco-rubros.spec.ts`, `docs/ONIA_V1_QA_CINCO_RUBROS_2026-09-27.md`,
> `scripts/demo-venta/seed-demo.sql`, `hermes-content/docs/ONIA_1.0_CORTE.md` (rama `claude/optimistic-ride-1sp5fe`).

## Reglas de la prueba
- Cuentas con prefijo **ZZ QA** y correo `oninteligenciaartificial+zzqa-<rubro>@gmail.com`. Se crean por `/register`
  (alta abierta: `docker exec onia-platform env | grep ALTA` debe dar `abierta`). Verificar el valor en vivo.
- Sin enviar nada a terceros: pacientes y clientes sintéticos, sin correo, teléfonos ficticios (+44 7700 900xxx).
- Capturas a 390 y 1440 px. Cada rubro se mira con **su vocabulario** (no «paciente» fuera de dental/estética clínica).
- Un fallo se anota con ruta, rol, captura y causa; se arregla en rama propia de onia-platform. Los frentes del latido
  (gracia 7 días, términos, cobro de punta a punta) no se tocan: se anotan.
- Al terminar: borrar o dejar marcadas las cuentas ZZ QA; aprendizaje a la skill `onia-verificacion`.

## Recorrido común (los 5 rubros)
1. `/register`: elegir el rubro → nombre, correo, contraseña, negocio → «Crear mi cuenta — 14 días gratis».
2. Entrada al panel: primer pantallazo sin carteles de obra («muy pronto», «beta»), texto de usted.
3. Alta guiada: lo precargado del rubro (servicios/productos, horario) existe y no está en blanco.
4. Pantalla propia del rubro (tabla de abajo): crear un registro, releerlo tras recargar.
5. Cobro/venta del rubro, y que aparezca en caja/contabilidad.
6. `/pricing` o Mi plan → checkout: 4 planes, 3 ciclos, QR con titular correcto, sin promesa falsa. **No pagar.**

## Pantalla propia por rubro

| Rubro (pack) | Crear y releer | Cobro / cierre | Debe NO aparecer |
|---|---|---|---|
| Dental (`dentagest-clinical`) | paciente → cita en agenda → odontograma 5 caras → tratamiento por fases | cobro de la cita; caja diaria | menús de comercio |
| Estética (`esteticagest-clinical`) | clienta → cita → ficha | cobro; caja diaria | odontograma |
| Servicios profesionales (`gestios-servicios-profesionales`) | cliente (sin datos clínicos) → cita | cobro/ticket; caja | campos clínicos |
| Comercio (`gestios-general`) | producto → venta en caja → baja de stock → fiado | cierre de caja | agenda clínica |
| Importadora (`proveegest-electrico`) | producto → costeo de importación → alerta de reprecio → cotización B2B | pedido aceptado | nada de dental; la cotización no sale del sistema (1.1) |

Chequeo cruzado: la org de un rubro no ve datos de otra (aislamiento por `organizationId`).

## Tabla de resultados (se llena al ejecutar)

| Rubro | Alta | Panel | Agenda/ventas | Checkout | Captura 390 | Captura 1440 | Fallos |
|---|---|---|---|---|---|---|---|
| Dental | | | | | | | |
| Estética | | | | | | | |
| Servicios | | | | | | | |
| Comercio | | | | | | | |
| Importadora | | | | | | | |

## Demo dental para mostrar (guion de 6 minutos)

Preparación (antes, en el VPS, con respaldo previo de `onia-db`, ver skill `onia-db`):
- `seed-demo.sql` con `reset=2` **entre 00:00 y 07:00 de La Paz del mismo día**; a las 07:00 los agentes arman las
  tarjetas (confirmar a Natalia, cobro vencido, Reprograma de Ricardo, Recall de 180 días). `verify-demo.sql` debe pasar.
- Confirmar con login que «tratamiento a medias» muestra personas en `/pending` (el arreglo del conteo «En progreso»
  está en código desde f47b45b; **falta mirarlo en producción**). Si da cero, la demo no lo nombra (catálogo §8).

Orden de la demo:
1. **Hoy**: agenda del día por profesional; confirmar una cita con 1 toque (se actualiza en dos pantallas).
2. **«Enviar por WhatsApp»** en una cita: el texto de usted, hora de La Paz (solo se muestra, no se manda).
3. **Pendientes**: agentes que proponen y el dueño aprueba (recall, reprogramador, cobrador).
4. **Ficha del paciente**: odontograma de 5 caras, presupuesto por fases, «Ver historia completa».
5. **Caja diaria** con cierre por medio de pago.
6. **Mi plan**: prueba de 14 días, planes, cómo se paga (QR). Cierre: «cree su cuenta» en `/register`.

Prohibido en la demo: nombrar IA que agenda sola, factura electrónica emitida, WhatsApp propio conectado, o cualquier
cosa de la 1.1 (catálogo y corte lo dicen).

## Funciones de competencia que sigue (ya revisado en código)
Lista corta en `/mnt/project-files/competencia/FUNCIONES_PARA_LA_1_0.md`. Según el handoff y el código, 1, 2, 3, 4,
5 y 7 ya están construidas o en producción (agenda por profesional, agenda que no miente, WhatsApp por cita, presupuesto
por fases, caja diaria); el paso 0 está arreglado en código. Lo que queda por confirmar en producción y, si falta,
construir: la plantilla precargada por rubro (6) en comercio, servicios e importadora.

## Mirado el 16-oct-2026 (22:03 UTC, sin tocar producción)
Con `headless_shell` a 390 y 1440 px, sin crear cuentas:
- `/login`: de usted, botón «Cree su cuenta · 14 días gratis», sin carteles de obra.
- `/register` paso 1: los 5 rubros (dental, comercio, importadora, estética, servicios profesionales) con su
  descripción; «¿Otro rubro? Escríbanos»; sin «muy pronto». A 390 px cabe sin desborde.
- `/empezar` y `/pricing` redirigen (307) a `/login` sin sesión: normal.
- Pendiente: el paso 2 del alta, panel, agenda/ventas y checkout por rubro. Necesitan el servidor (ZZ QA)
  y un navegador con clic; esperan el sí de Sergio Urcullo para armar el acceso.
