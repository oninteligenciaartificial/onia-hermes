# Doctocliq por dentro (cuenta de prueba de Sergio Urcullo)

Recorrido el 2026-10-01 en `app.doctocliq.com` (v2.9), con la sesión de Chrome ya iniciada. Complementa
`DOCTOCLIQ_TEARDOWN.md` (lo público): acá va solo lo que se ve adentro. Cada fila cita su captura `NN-*.jpg`
de esta misma carpeta.

**Dos pasadas.** La primera (capturas 01-30) se cortó a mitad de Pacientes porque se apagó la PC. La segunda
(01-oct, noche; capturas 31-72) cubrió presupuesto, inactivos/segmentos, caja, productividad, chat, inventario y
crear/reprogramar cita (§4b a §4g). La captura 36 es PNG y está recortada para no mostrar el teléfono; en la 69
el número está tapado.

## 1. Estado de la cuenta

| Dato | Lo que se ve | Captura |
|---|---|---|
| Plan | **Avanzado**, US$ 49,00, ciclo mensual, "Fecha de renovación 29 Sep 2026", sin tarjeta afiliada | 04, 05 |
| Prueba | Banner "**Te quedan 5 días gratis**" + botón "Ver planes" (prueba de 7 días; arrancó ~29-sep) | 26 |
| Usuarios | Pagos: "1 doctores principales y 0 administrativos". Gratis: "5 doctores temporales y 3 administrativos" | 05 |
| Add-ons apagados aun en Avanzado | Plataforma de Filiación, Consentimientos, **CRM**, Pantalla sala de espera, Chat Interno, **Facturación electrónica**: todos "No" | 05 |
| CRM bloqueado | La lista de Tareas de la agenda dice "Este servicio es parte del CRM y no está incluido en tu plan contratado" | 10 |
| Primeros pasos | Checklist 0/5: Crear cita, Crear paciente, Crear presupuesto, Registrar un pago, Registrar evolución. "¡Completa los pasos y descubre tu recompensa!": **la recompensa no se muestra** hasta completar (pasó a 1/5 al crear un paciente) | 01, 26 |
| Asistencia | Chat Intercom de "Eulogia" abierto solo con botones "Ayúdame a elegir mi plan" / "¿Qué pasa si termina mi prueba?" (no se tocaron: envían mensaje) | 01 |
| Menús | Administración: Laboratorio, Servicios, Proveedores, Consentimientos. Marketing: Segmentaciones, Cumpleaños, Automatizaciones, Campañas, Embudo de ventas (todos con corona = premium) | 02, 03 |
| Localización | Perfil ya en Bolivia: +591, Santa Cruz, zona GMT-04 La Paz; documento del paciente = "Cédula" | 04, 24 |

"Contrata un plan" no abrió nada en la pestaña (posible ventana externa); la tabla de precios queda la del teardown.

## 2. Agenda

| Tema | Lo que se ve | Captura |
|---|---|---|
| Vistas | Semana (S), Día (D), Por mes, Por día, **Detallado por doctor**, **Diaria por consultorio** (5 consultorios precargados) | 07, 09 |
| Estados de cita (8) | Confirmado, Cancelado, Atendido, Reprogramar, En sala de espera, En consulta, Pendiente, Ausente. El filtro "Estado" usa los mismos 8 | 06, 14 |
| Acciones sobre la cita | Popover con 1 clic: cambiar estado, Registrar evolución ("Cita sin nota de evolución"), **Enviar WhatsApp manual**, Ver paciente, Registrar pago, Eliminar cita | 06 |
| WhatsApp manual | Abre `api.whatsapp.com/send` con texto armado: "Hola Julieta, te escribimos para recordarte tu cita hoy 01 oct a las 12:00 pm . Por favor confirma aquí https://app.doctocliq.com/sms-appointment/…". Gratis, sin API: lo envía la recepción desde su WhatsApp | (URL leída; no se envió) |
| Link de confirmación del paciente | Página sin diseño, solo texto: "No puedes volver a confirmar o cancelar una cita…" (la cita ya estaba confirmada) | 08 |
| Más opciones | Descargar, **Citas eliminadas** | 15 |
| Config. de agenda | Pestañas: Generales, Mi Vista, Horarios de trabajo, Agendamiento en línea, Motivos de consulta, Agendas, Grupos de agendas | 11, 12, 13 |
| Motivos precargados | Primera consulta 30 min, Tratamiento en curso 1 h, Control ortodoncia 30 min, Control de limpieza 1 h, Endodoncia 30 min | 13 |
| Reserva online | Link `app.doctocliq.com/clinic/26796/`; "Ningún profesional tiene horarios configurados" hasta cargar horarios | 12 |
| Lista "canceladas pendientes de recuperación" | **No apareció** en agenda; lo más cercano es la vista de Tareas, **bloqueada por CRM** | 10 |

Crear cita y reprogramar con arrastre: medidos en §4g.

## 3. Recordatorios

| Tema | Lo que se ve | Captura |
|---|---|---|
| Panel del encabezado | "Recordatorios automáticos de cita · **Activo** · Envío un día antes vía WhatsApp · Saldo **5 mensajes** · Recargar" | 16 |
| No pide conectar WhatsApp | Funciona en la prueba **sin conectar número**: sale del WhatsApp de Doctocliq (con el nombre de la clínica, "Dr. Sergio") | 16, 18 |
| Línea de tiempo | Antes de la cita: **7 días antes** ("Tenemos una cita pronto… soy Soyla del equipo de Dr. Sergio", botón "Recibido") y **1 día antes** ("Recordatorio de tu cita", botones **Confirmar / No podré asistir / Chatear con la clínica**). Después: Reseña (premium) | 17 |
| Saldos separados | "Saldo citas: 05 mensajes" y "Saldo marketing: 05 mensajes" | 17 |
| Editor | Se elige **plantilla de una lista fija** (Recordatorio 1-5, "Plantilla recordatorio días antes"…) y la hora; no hay texto libre (plantillas aprobadas por Meta). Botones "Guardar y enviarme una prueba" / "Guardar" | 18, 19 |
| Post-cita | "Agregar automatización": Encuesta/Reseña/Otros, Cumpleaños, **Seguimiento**, Campañas: **todo con corona** (no incluido) | 21 |
| Historial | "Historial de envíos" con filtros y "tareas futuras": vacío | 20 |
| Email (gratis) | Confirmación al agendar (ON), recordatorio 1 día antes a las 14:00 (ON), recordatorio "horas antes" (OFF) | 11 |
| SMS | 0 mensajes, "Solo disponible en México" | 11 |
| Probar sin WhatsApp | Sí, por email; o con "Enviar una prueba", que **gasta saldo** (no se tocó) | 11, 17 |

## 4. Pacientes

| Tema | Lo que se ve | Captura |
|---|---|---|
| Lista | Columnas: Última cita, Próxima cita, **Tarea**, **Presupuesto**, Fuente de captación, Comentario. Etiquetas visibles en la fila (VIP, Impuntual) | 22 |
| Importar | Menú "Importar pacientes" / "Descargar pacientes" | 23 |
| Crear paciente | **2 campos obligatorios** (Nombres, Apellido paterno) + Cédula y Teléfono +591 opcionales. 2 clics + 2 campos | 24 |
| Más datos | Apoderado, Email, F. nacimiento, Sexo, Fuente de captación, Aseguradora, Etiquetas | 25 |
| Tras crear | Toast "Paciente Creado con éxito" y un panel que abre **directo en Presupuestos** con "+ Crear Presupuesto" (empuja al paso siguiente) | 26 |
| Ficha | Menú: Filiación, Historia clínica, Odontograma, Periodontograma, Ortodoncia, Estado de cuenta, Prescripciones, Archivos. Arriba: Etiquetas, Notas, **Alergias**. Línea de ortodoncia (Diagnóstico → Tratamiento inicial → Contención → Post-Contención, Inasistencias). Derecha fija: Presupuesto y Notas de evolución | 27 |
| Odontograma | Odo. Inicial / Evolución / Alta, "Nuevo odontog.", "Probar nueva versión"; filtros Doctor, Tipo (Adultos), Nomenclatura (Internacional), "Marcado múltiple". Debajo, **Plan de tratamiento** (N° diente, Hallazgo, Servicios vinculados, Nota) | 28 |
| Marcar hallazgo | Clic en el diente → atajos Caries / Restau / Restau, buscador, lista (Pieza ausente, Diente sano, Extracción…) → modal "Lesión de caries" con caras del diente → Guardar. **3 clics por hallazgo** | 29, 30 |

## 4b. Presupuesto y plan de tratamiento (segunda pasada, 01-oct noche)

| Tema | Lo que se ve | Captura |
|---|---|---|
| Hallazgo del diente 16 | **Sí quedó guardado**: punto rojo en el 16 y fila "16 · Caries oclusal" en Plan de tratamiento | 31 |
| Presupuesto desde el odontograma | **No sale de fábrica.** "Crear presupuesto" abre "Aún no has relacionado los hallazgos clínicos… debes crear relaciones entre hallazgos, servicios y costos. Hazlo desde configuración". "Vincular" en la fila dice lo mismo. No se tocó la configuración | 32 |
| Presupuesto a mano | Panel derecho "+ Crear Presupuesto" → buscador de servicios. Lista precargada **ya en Bs** (Ortodoncia cuota mensual 600, inicial 500, Extracción 400, Corona sobre implante 300, Blanqueamiento 200, Endodoncia 100). Columnas: Diente, Cant., Moneda, Precio, Dcto., Comentario; "Aplicar descuento masivo"; Datos opcionales: título, doctor responsable, nota al paciente, nota interna; "Confirmar y descargar". **Clics: 1 abrir + 2 por servicio + 1 confirmar** (4 clics para 1 servicio) | 33, 34 |
| Al confirmar | Pantalla "¡Creaste tu primer presupuesto!" con total y botones **Compartir** / Ver estado de cuenta. Compartir abre un **link público** `app.doctocliq.com/sbudget/<id>/` con el PDF (logo, nombre y teléfono de la clínica, columna Pagado y "Por pagar") sin login | 35, 36 |
| Estados del presupuesto (6) | Creado, Aceptado, Rechazado, **Abandonado**, Terminado, Otro. Se cambian **a mano** desde un popover + Guardar. "Abandonado" es una opción más de la lista: **nadie lo marca solo** | 37 |
| Fases | Menú ⋮: Agrupar por fases, Duplicar, Editar columnas, Eliminar. "Organiza presupuesto por fases": Fase 1, Fase 2, botón "Mover" por ítem, "Agregar nueva fase". Al confirmar: "Así lo verá el paciente" + **Enviar al paciente** / Imprimir por fases (no se envió) | 38, 39, 40 |
| Registrar cobro | Ícono $ del presupuesto → "Registrar pago del presupuesto": abono repartible por ítem (checkbox), columna Proveedor, **medios: Efectivo, Tarjeta, Transferencia, Otro, + Agregar nuevo medio (sin QR)**, "Dividir pago", **Profesional asociado al pago**, Comprobante (Boleta / Factura / Otro / Recibo), fecha y nota administrativa. Se registró Bs 200 en efectivo: "Ingreso creado con éxito" y badge **Bs 200** en la ficha | 41, 42, 43 |
| Ítem terminado | Clic en el círculo del ítem: Por iniciar / En progreso / Terminado + **Doctor asignado** + fecha y hora de terminado. Al marcar Extracción terminada con saldo, la fila se pone **roja**, el presupuesto toma la etiqueta **"Deuda"** y el badge del paciente pasa a rojo. El estado del presupuesto sigue "Aceptado" (no cambia solo). Descuento de stock: **no se vio** (los servicios precargados no tienen insumos) | 44, 45 |
| Historial de pagos | Pestaña de la ficha: Fecha, Doctor, Motivo, Comentario, Precio + descarga | 46 |

## 4c. Inactivos y tratamiento a medias (Marketing → Segmentaciones)

| Tema | Lo que se ve | Captura |
|---|---|---|
| Qué trae de fábrica | **Un solo segmento**, "Hace más de 180 días" (0 pacientes), y la lista "No enviar campañas". Los segmentos del sitio público ("Primera cita sin retorno", "Cancelaron sin reagendar", "abandonaron el tratamiento") **no existen** en la cuenta: hay que armarlos | 47 |
| Cómo se arma | "Agregar segmento" → nombre → "Agregar filtro". Filtros: **Paciente** (fecha de creación, fase del embudo, línea de negocio, grupo, edad, sexo, fuente, aseguradora, etiquetas, excluir lista, campañas enviadas) · **Presupuestos** (con deuda o saldo a favor, servicio terminado, servicio pagado/por pagar, estado del presupuesto) · **Citas** (tiene próxima cita, fecha y estado de la última cita) · **Caja** (servicio pagado). En el filtro de estado **no figura "Rechazado"** | 48 |
| "Tratamiento a medias" | Se armó "Estado = Aceptado + Tiene próxima cita = No" (**unos 10 clics**). **Guardar queda deshabilitado** aun en la prueba de Avanzado, sin mensaje que diga por qué: el segmento propio no se pudo guardar | 49 |
| Qué acción ofrece | Sobre un segmento: **Automatizar** (WhatsApp cada N semanas con plantilla fija; "solo se enviará si el paciente tuvo antes una Cita atendida y no tiene cita programada"; gasta el saldo de 5 mensajes), **Campaña** y **Tarea masiva** (se habilitan al seleccionar pacientes), Descargar. No se creó ni envió nada | 50 |
| Plantillas | 13, todas de **control/limpieza** (Control 06 meses adulto/niño, mensual, semestral periodoncia e implantes, limpieza 12 meses, implantes, alineadores). **Ninguna para "presupuesto pendiente" o "tratamiento sin terminar"** | 51 |
| Campañas | "Este servicio no está incluido en tu plan contratado. Solicita una prueba de 07 días" (**bloqueado** aun en la prueba de Avanzado) | 52 |
| Embudo de ventas | Datos **ficticios** de ejemplo en **soles (S/)**: "La información de este ejemplo es ficticia… contrata este módulo". Leads (agendaron cita) → Nuevos (asistieron) → Convertidos (hicieron un pago) | 53 |
| Cuánto cuesta | La app no muestra precio del CRM/Marketing; el sitio lo vende como add-on de Básico/Avanzado solo semestral o anual (teardown [1]) | — |

**Conclusión:** el recall del tratamiento a medias en Doctocliq es **manual y está bloqueado en la prueba**: no hay segmento hecho, el propio no se guarda, las plantillas no hablan de presupuesto pendiente y las campañas piden otro add-on. Además, "Abandonado" lo marca una persona a mano (captura 37).

## 4d. Caja y cobros

| Tema | Lo que se ve | Captura |
|---|---|---|
| Pestañas | Ingresos y egresos · Comisiones · Presupuestos | 54 |
| Ingresos y egresos | Día a día (flechas, calendario, "Hoy"), totales Ingreso/Egreso arriba, filtro "Ver todo", **Nuevo ingreso** (con menú) y **Egreso**. Fila: hora, doctor, paciente, concepto, medio, monto, comentario e impresora. El pago hecho en la ficha aparece solo | 54 |
| Menú ⋮ | **Cerrar Caja/Ver resumen**, Ver anulados, Descarga ingresos/egresos, **Gestión multicaja** | 55 |
| Cierre de caja | "Resumen de Caja principal": abono inicial + ingresos − egresos = total, distribución por medio (Efectivo, Tarjeta, Transferencia, Otro), quién abrió y quién cierra, "Abono para el día siguiente" y botón **Cerrar caja** (no se cerró) | 56 |
| Comisiones | Filtros Periodo y Doctor; totales recaudado / comisión / N° servicios; columnas Total, Tarjeta, **Dcto1**, Proveedor, Comisión, Clínica + Descargar. **Dcto1 trae 18 % de fábrica** (36 de 200; coincide con el IGV peruano): "descuento permanente por doctor. Ajústalo en Configuraciones > Usuarios > Staff médico". Comisión 0 hasta configurarla | 57 |
| Presupuestos (tablero) | Tarjetas Total creados / Nuevo / Aceptado / Rechazado con montos, periodo, y lista con Balance (barra de pago), **Prox. Cita** y **Tarea** por presupuesto: es donde se ve a mano quién aceptó y no volvió | 58 |
| Medios de pago | Efectivo, Tarjeta, Transferencia, Otro, "+ Agregar nuevo medio". **Sin QR** (ni BCP ni ningún otro) | 41 |
| Comprobante | Boleta / Factura / Otro / Recibo (nombres peruanos). La facturación electrónica es add-on y no cubre Bolivia | 42 |

## 4e. Productividad (reportes)

| Pestaña | Lo que muestra | Captura |
|---|---|---|
| Ingresos y egresos | Periodo + moneda (Bs), total de ingreso, gráficos "Ingresos y Egresos" e "Ingreso por Doctores"; botón **DESCARGAR** (no se usó: descarga archivo) | 59 |
| Servicios vendidos | Ingreso y cantidad por servicio y por categoría ("Odontología general") | (texto leído) |
| Servicios terminados | Por profesional, periodo y "¿pagado al 100 %?": total recaudado, comisión, N° servicios, Dcto1, Dcto2, Tarjeta. Debajo, **"Servicios por terminar"**: filtra por profesional, fecha del presupuesto, estado y pago. Es el reporte más cercano al "tratamiento a medias", pero es una tabla para mirar, sin acción | 63 |
| Agenda | Productividad por doctor (horas trabajadas vs citas atendidas), **citas agendadas vs atendidas (%)**, motivos de consulta, teleconsultas, citas en línea | 60 |
| Pacientes | Fuentes de captación (compara 2 fuentes, p. ej. Facebook e Instagram) y datos demográficos | 61 |
| Reporte anual | Ingresos/egresos por mes, resumen del año (ingreso, egreso, utilidad) y **Top ten de pacientes**. "La venta de cada mes se calcula con el tipo de cambio de Google del último día del mes" (el mes en curso no suma) | 62 |

## 4f. Chat e Inventario

| Tema | Lo que se ve | Captura |
|---|---|---|
| Chat | **Bandeja de WhatsApp** dentro del sistema (no es chat interno del equipo). Filtros: Todos, Leads, Leads (con cita), Leads (sin cita), Pacientes y "Más": Curiosos, Pac. con cita hoy / mañana, **No confirman cita de mañana**, Recibieron campañas, Chats sin responder, **Chats de Soyla** (la IA), **Chats para ayuda humana**, Archivados; acción masiva "Marcar todo como leído / respondido". Vacía en la prueba ("Sin resultados") porque no hay número conectado | 64 |
| Inventario | Pestañas Productos, Compras, Consumo, Prescripciones + "Ver tutorial". Producto: tipo (de venta…), categoría, nombre, presentación, unidad, SKU/código de barras, **alerta de stock mínimo**, precio de venta en Bs, "capacidad por aplicación o dosis", comentario. Columnas: stock actual, stock mínimo, **F. vencimiento**. Consumo: fecha, producto, fuente, tipo, **lote**, cantidad, **paciente, servicio**, estado (ahí cae el descuento al terminar un tratamiento). Vacío de fábrica: no se creó producto | 65, 66 |

## 4g. Crear y reprogramar una cita (medido con "Prueba Onia 1", sin teléfono)

| Paso | Lo que pasa | Captura |
|---|---|---|
| Abrir | Clic en un hueco vacío de la agenda → modal "Agendar cita / Crear evento" con la fecha y hora del hueco ya puestas ("no se repite") | 67 |
| Campos | **2 obligatorios**: Paciente (buscador, aparece como "ONIA 1, Prueba" con link a la ficha y "+ Agregar nuevo paciente") y **Doctor (no viene preseleccionado** aunque haya un solo doctor). Opcionales: Motivo, Nota. "Más datos" suma Servicios y Consultorio | 67, 68 |
| Conteo | **6 clics + 1 texto**: hueco → buscador → escribir → elegir paciente → doctor → elegir doctor → Agendar | — |
| Al crear | Toast "Cita creada con éxito" y un modal **"¡Revisa tu WhatsApp! Te enviamos un mensaje de prueba al número +591 7XXXXXXX** para que puedas tener una idea de cómo se verían los recordatorios". Es el número de la cuenta de Sergio Urcullo, no el del paciente; lo manda Doctocliq solo con la primera cita. **El saldo siguió en 5 mensajes** | 69, 70 |
| Reprogramar | Arrastrar la cita a otro día abre "Confirma la reprogramación": cita original pasa a **Reprogramada** (tachada), la nueva queda **Pendiente**, casilla opcional "Eliminar cita" (la original). Tras "Reprogramar", la original **queda visible como rastro** en la agenda | 71, 72 |

## 5. Contra Onia (del teardown §3)

| Módulo | Doctocliq adentro | Onia hoy | Copiar / evitar |
|---|---|---|---|
| Recordatorio | WhatsApp 7 d y 1 d con botones Confirmar/No podré, **activo de fábrica** y sin conectar número; 5 mensajes y después se paga | Solo correo (24 h y 2 h) | **Copiar:** activo por defecto y con botón. Es lo primero que ve el cliente en la prueba |
| WhatsApp manual | Link `wa.me` con el texto armado, gratis | — | **Copiar:** cuesta casi nada y cubre a quien no paga API |
| Seguimiento / tratamiento a medias | Tareas, Seguimiento y segmentos **bloqueados** aun en Avanzado (CRM add-on) | Agente diario que lo detecta y propone | **Argumento de venta:** en Doctocliq el recall no viene ni en el plan más caro |
| Alta de paciente | 2 campos y empuja al presupuesto | — | **Copiar** el empujón al paso siguiente |
| Agenda | 8 estados, vista por consultorio | Agenda y citas | Evitar: 8 estados es mucho para recepción |
| Primeros pasos | Checklist 5 pasos + recompensa escondida | — | Ideas para evaluar (no copiar la recompensa oculta) |
| Página de confirmación | Texto plano sin diseño | — | Evitar |
| Presupuesto | A mano en 4 clics; desde el odontograma **solo si antes se configura** hallazgo→servicio→costo. Link público con PDF, fases, estados manuales | Tratamientos + cobros | **Copiar:** link público del presupuesto y el aviso "Deuda" cuando se termina un ítem sin pagar |
| "Abandonado" | Estado que alguien marca a mano; el segmento propio no se guarda en la prueba; plantillas solo de control | Agente diario que detecta y propone | **Argumento de venta**, con capturas 37, 49, 51, 52 |
| Caja | Cierre diario, multicaja, comisiones por doctor con **18 % de descuento de fábrica** (IGV peruano), comprobantes Boleta/Factura | Caja, cobrador, contabilidad, QR | Copiar la vista de comisiones por doctor; **evitar** defaults de otro país |
| Medios de pago | Efectivo, Tarjeta, Transferencia, Otro; **sin QR** | QR BCP | **Argumento:** en Bolivia se cobra con QR |
| Reportes | 6 pestañas, "Servicios por terminar", agendadas vs atendidas, top 10 pacientes | `/reports` | Copiar "agendadas vs atendidas" y "servicios por terminar" como dato del agente |
| Chat | Bandeja de WhatsApp con filtros (no confirman mañana, chats de Soyla, ayuda humana) | Chatbot add-on (sin bandeja propia en el panel) *(sin verificar hoy)* | Idea: filtro "no confirman mañana" |
| Primera cita | Manda un WhatsApp de prueba al dueño para que vea el recordatorio | — | **Copiar:** el dueño ve el valor en su propio teléfono el día 1 |
| Moneda y país | Bs en servicios y caja, pero embudo de ejemplo en **soles (S/)**, Dcto1 18 %, Boleta | Bs nativo | Argumento: hecho para Perú y adaptado |

## 6. Datos de prueba creados (para borrar si Sergio Urcullo quiere)

| Qué | Detalle | Estado |
|---|---|---|
| Paciente **"Prueba Onia 1"** | ID 3619039, creado 01-oct-2026, **sin teléfono ni email** (para no gastar saldo de WhatsApp ni mandar correos) | Creado |
| Hallazgo "Caries oclusal" en diente 16 de ese paciente | Verificado en la segunda pasada | Guardado (captura 31) |
| Presupuesto #1 "Sin nombre" de "Prueba Onia 1" | Extracción (diente 16) Bs 400 + Endodoncia Bs 100, en 2 fases, estado **Aceptado**, Extracción **Terminado** | Creado (captura 45) |
| Pago de prueba | Bs 200 en efectivo sobre Extracción, comprobante Boleta, 01-oct-2026 (aparece en Caja; la caja **no se cerró**) | Creado (captura 46, 54) |
| Cita de "Prueba Onia 1" | Creada vie 02-oct 10:00 con sergio mercado; reprogramada por arrastre a sáb 03-oct 10:00. La del viernes queda como "Reprogramada" | Creada (captura 72) |
| Segmento "Prueba Onia - tratamiento a medias" | Armado pero **no guardado** (Guardar deshabilitado) | No existe |

No se tocaron datos de Romeo/Julieta/Homero (solo se abrió un popover de cita). No se cambió plan ni configuración,
no se creó automatización, campaña, tarea ni producto, no se compartió ni envió el presupuesto ("Compartir" solo abrió
el link en una pestaña) y no se usó ningún botón Descargar. **Un mensaje sí salió, y no lo mandamos nosotros:** al
crear la primera cita, Doctocliq envió solo un WhatsApp de prueba al número de la cuenta de Sergio Urcullo
(+591 7XXXXXXX). No avisa antes y no gastó saldo (sigue en 5, captura 70).

## 7. Pendiente

Nada de la lista del encargo. Quedan sin ver, por estar fuera de alcance o porque tocarlos cambia configuración:
relación hallazgo→servicio del odontograma ("Ir a configuración"), Gestión multicaja, comisión por doctor (Configuraciones
> Usuarios > Staff médico), descuento real de stock al terminar un ítem (requiere crear producto e insumo) y precio
del add-on CRM dentro de la app.
