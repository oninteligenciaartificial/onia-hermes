# Doctocliq por dentro (cuenta de prueba de Sergio Urcullo)

Recorrido el 2026-10-01 en `app.doctocliq.com` (v2.9), con la sesión de Chrome ya iniciada. Complementa
`DOCTOCLIQ_TEARDOWN.md` (lo público): acá va solo lo que se ve adentro. Cada fila cita su captura `NN-*.jpg`
de esta misma carpeta.

**Corte:** la PC se apagó a mitad del módulo Pacientes. Quedan **sin recorrer**: presupuesto (estados, ítem
terminado), inactivos y segmentos de Marketing/CRM, caja y cobros, reportes/productividad, chat, inventario.

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

Crear cita: **sin medir** (corte antes de llegar). Mover/reprogramar con arrastre: sin probar.

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

## 6. Datos de prueba creados (para borrar si Sergio Urcullo quiere)

| Qué | Detalle | Estado |
|---|---|---|
| Paciente **"Prueba Onia 1"** | ID 3619039, creado 01-oct-2026, **sin teléfono ni email** (para no gastar saldo de WhatsApp ni mandar correos) | Creado |
| Hallazgo "Caries" en diente 16 de ese paciente | Modal abierto; **no se pulsó Guardar** antes del corte | Probablemente no guardado: revisar |

No se tocaron datos de Romeo/Julieta/Homero (solo se abrió un popover de cita). No se envió ningún mensaje, no
se cambió plan ni configuración y no se guardó ninguna automatización. Se abrió el link `wa.me` de una cita de
ejemplo (no se envió) y la página de confirmación del paciente (solo lectura).

## 7. Pendiente cuando vuelva Chrome

Presupuesto (estados, aceptar, marcar ítem terminado, descuento de stock) · Marketing → Segmentaciones
(abandonaron el tratamiento, primera cita sin retorno, inactivos 6 meses) · Caja (pago a presupuesto, cierre,
comisión) · Productividad/reportes · Chat · crear cita (contar clics) · reprogramar. **Ojo:** las citas de prueba
deben ir con pacientes **sin teléfono**, porque el recordatorio de WhatsApp está activo y gasta saldo.
