# Doctocliq por dentro: qué hace y qué puede aprender Onia

Para: Sergio Urcullo · 29-sep-2026 · recorrido de solo lectura en la cuenta de prueba que abriste (Doctocliq v2.9, `app.doctocliq.com`), más la página pública de precios del mismo día.

Marcas: **[V]** visto hoy dentro de la app · **[P]** página pública de doctocliq.com hoy · **[D]** cuenta propia sobre esos datos · **[I]** inferido, no verificado.

**Qué toqué y qué no.** No creé, edité ni borré nada; no guardé formularios, no conecté canales y no acepté nada. Dos avisos:
- En el menú de una cita apreté «Enviar WhatsApp manual». Eso abrió de inmediato una pestaña `api.whatsapp.com/send` con el texto del recordatorio ya escrito. **No se envió nada** (hay que apretar «enviar» dentro de WhatsApp) y la cerré enseguida.
- Los 6 servicios con precio en Bs y los 3 pacientes «Prueba» ya estaban cargados al entrar. El asistente «Agrega tus servicios más frecuentes» lo cerré con Escape las dos veces, sin tocar «Continuar» ni «Omitir». «Primeros pasos» siguió en 0/5 al final.

Datos personales: los pacientes de ejemplo traen **tu propio celular**, que es el que cargaste al registrarte. No lo copio acá.

---

## 1. Veredicto en 8 líneas

1. **Doctocliq es más profundo en lo clínico:** odontograma con ~50 hallazgos, periodontograma, ortodoncia, anamnesis por especialidad y presupuesto ligado al odontograma. En la ficha, Onia hoy queda claramente por debajo.
2. **Su mejor jugada es el recordatorio por WhatsApp encendido de fábrica:** sale desde su propio número, trae «Confirmar / No podré asistir» y no pide conectar nada. Onia exige conectar el WhatsApp de la clínica con Meta, y eso nunca se probó.
3. **En la agenda los estados se cambian en un toque** (Confirmado, Ausente, En sala de espera y 5 más). En Onia no existen Confirmar ni No asistió.
4. **Para recuperar pacientes, su herramienta es visual y paga:** «Asistencias» y «Segmentaciones» están en la prueba, y el envío automático por WhatsApp se cobra aparte. El agente «Vuelve a citar» de Onia propone y el dueño aprueba, pero sin datos no se demuestra.
5. **Onia gana en lo boliviano:** precio en Bs por negocio y cobro con QR, soporte en SCZ, resumen de IVA e IT y el código SIAT listo. Doctocliq cobra en USD con tarjeta y por doctor. Su facturación electrónica es solo para Ecuador, Perú, México, Colombia y RD [P].
6. **Onia gana en simplicidad y honestidad de la venta.** Doctocliq muestra en el menú 8 pantallas bloqueadas con corona y un embudo con datos ficticios en soles.
7. **El primer minuto de Doctocliq es mejor:** entrás con datos de ejemplo, una lista de 5 tareas, el chat de una persona y «envíate un recordatorio de prueba».
8. **Onia no debe perseguirlo función por función.** Hay 3 ideas baratas que atacan el dolor #1 del cliente ideal (confirmar la cita, ver quién no volvió, recordatorio que llega). El resto es profundidad clínica: se construye cuando una clínica que paga la pida.

---

## 2. Mapa completo del producto

La pantalla de entrada es la **Agenda** (`/panel-control/agenda`, 0 clics). No hay un «Inicio» con resumen del día.

**Barra superior, siempre visible:**
- Logo, versión v2.9 y «Primeros pasos 0/5».
- Campana.
- «Recordatorios», con el ícono de WhatsApp.
- Menú del usuario.
- Menú principal: Agenda · Pacientes · Caja · Administración ▾ · Marketing ▾ · Productividad · Inventario · Chat.
- Engranaje ▾, botón «Crear» ▾ y el buscador de pacientes (con filtro Activos / Inactivos).
- Burbuja de chat (Intercom) abajo a la derecha.

### 2.1 Barra superior y onboarding

| Elemento | Qué hace | Clics |
|---|---|---|
| **Primeros pasos 0/5** | Panel lateral con «Crear cita», «Crear paciente», «Crear presupuesto», «Registrar un pago» y «Registrar evolución», cada una con su botón «Iniciar». Suma «¡Completa los pasos y descubre tu recompensa!», «Habla con un asesor», «Mira el Tour Doctocliq» y «Contrata un plan». Se abre solo al entrar [V] | 0-1 |
| **Crear ▾** | Agendar cita · Agregar paciente · Registrar evolución · Crear presupuesto · Registrar pago [V] | 2 |
| **Recordatorios** | Panel «Recordatorios automáticos de cita»: interruptor **Activo (encendido de fábrica)**, «Envío un día antes vía WhatsApp», saldo de 5 mensajes y reportes («tu primer reporte se generará a las 2 p.m.… y el segundo a las 6:00 p.m.») [V] | 1 |
| **Engranaje ▾** | Etiquetas · Plantilla de mensajes · Servicios · Usuarios · Ir a configuración [V] | 2 |
| **Contrata un plan** | Lleva a `/panel-control/pricing`, con las tarjetas Individual / Básico / Avanzado («Actual»), Mensual / Anual y un video que arranca solo. El chat de una persona («Eulogia») escribe solo: «estás en una prueba gratuita… ¿Necesitas ayuda para elegir tu plan?», con las respuestas rápidas «Ayúdame a elegir mi plan» y «¿Qué pasa si termina mi prueba?» [V] | 2 |
| **Ventana de opinión** | «Te elegimos para ayudarnos a mejorar Doctocliq», con «Mandar WhatsApp» / «Agendar reunión» (15 min). Apareció sola a mitad del recorrido [V] | - |
| **Datos de ejemplo** | 3 pacientes (Homero, Julieta con etiqueta VIP y Romeo con «Impuntual»), unas 7 citas esta semana (una cancelada y un bloqueo «De viaje en congreso…»), 2 agendas («sergio mercado» y «Especialistas»), 5 motivos de consulta con su duración y 6 servicios en Bs [V] | - |

### 2.2 Agenda (`/panel-control/agenda`)

- **Barra de la agenda:**
  - ← / → / «Hoy» y el calendario para saltar de fecha.
  - «Estado»: filtro de 8 casillas (Pendiente, En espera, Ausente, Confirmada, Cancelada, En consulta, Atendida, Reprogramada) + «Aplicar».
  - Vistas: S (semana), D (día) y ▾ con Por mes, Por día, Detallado por doctor y Diaria por consultorio.
  - Botón calendario / tareas: «tareas» es una tabla del CRM (fecha límite, paciente, tarea, estado, nota de seguimiento, responsable), bloqueada con «Este servicio es parte del CRM y no está incluido en tu plan contratado» y «Mira cómo funciona».
  - Configuración de la agenda (ícono) y ⋮ (Descargar · Citas eliminadas, una papelera por día).
- **Columna derecha:** «Todas las agendas», cada agenda con su color y ⋮, «Agregar usuario» e «Importar calendario Google».
- **Menú de una cita** (en mi sesión se abrió con doble clic; no sé si en un clic normal también):
  - Estados arriba: Confirmado · Cancelado · Atendido, y con «›» Reprogramar · En sala de espera · En consulta · Pendiente · Ausente.
  - Nombre del paciente (abre la ficha), hora, motivo y el lápiz para editar.
  - «Registrar evolución» («Cita sin nota de evolución»).
  - «Enviar WhatsApp manual»: abre WhatsApp con «Hola Julieta, te escribimos para recordarte tu cita… Por favor confirma aquí `app.doctocliq.com/sms-appointment/<id>`».
  - «Ver paciente», «Registrar pago» y «Eliminar cita».
- **Formulario «Agendar cita»:**
  - Paciente, Doctor y Motivo (buscadores), fecha, desde y hasta (avisa «Fecha pasada»).
  - **Repetición:** No se repite / Todos los días / Cada semana / Cada 2, 3 o 4 semanas…
  - Nota de la cita.
  - «Más datos»: Servicios y Consultorio. «Agendar».
- **Configuración de la agenda (7 pestañas):**
  - **Generales:** correo de confirmación al agendar (encendido); recordatorio por correo 1 día antes a una hora configurable (14:00); «recordatorio horas antes» (apagado); SMS con saldo de 0 y «Recargar».
  - **Mi Vista:** días, rango horario, «Ver solo mañana / tarde», detalle al pasar el cursor, color por doctor o por motivo, vista por defecto y «aplicar a todo mi equipo».
  - **Horarios de trabajo:** «Ningún profesional tiene horarios configurados» + «Agregar profesional».
  - **Agendamiento en línea:** el link `app.doctocliq.com/clinic/<id>/` con **botón «Copiar»**, «Usar nickname» y un mensaje con formato para mostrarle al paciente antes de reservar.
  - **Motivos de consulta:** por agenda, con su duración + «Agregar motivo».
  - **Agendas:** color, nickname y orden.
  - **Grupos de agendas.**

### 2.3 Pacientes (`/panel-control/patients/all`, 1 clic)

- **Mis pacientes:**
  - Columnas: paciente (foto y etiquetas), última cita, próxima cita («En 1 días»), tarea, presupuesto, fuente de captación y comentario.
  - «Nuevo Paciente» ▾ (Importar pacientes · Descargar pacientes) y el buscador (nombre, apellido, documento, teléfono).
- **Asistencias** (`/patients/attendance`):
  - Una fila por paciente y una columna por mes, con un punto de color por cita (gris, rojo o verde).
  - Filtros: «Línea de negocio» (Ortodoncia, Rehabilitación, Estética…, más «Configurar líneas de negocio») y «Estado»:
    - **Deudores** («no han realizado un pago en el mes»).
    - **Sin cita programada** («no tienen una cita agendada en el mes»).
    - **Ausentes** («cita con estado cancelado, reprogramado, ausente»).
  - Descargar en PDF o Excel. Por fila, ⋮: Datos del paciente · Ficha médica · Agregar nota mensual.
- **Vista rápida** (clic en el nombre; panel lateral, 2 clics):
  - Foto, edad, teléfono, etiquetas + «Agregar» y nota general.
  - Pestañas: Citas (fecha, doctor, motivo, estado, comentario, «+ Nuevo») · Filiación · Presupuestos (+ Crear Presupuesto) · Tareas.
  - «Abrir historia» abre la ficha en una pestaña nueva.

### 2.4 Ficha completa (`/panel-control/patient/<id>/…`, 3 clics)

- **Lo común a todas las secciones:**
  - Tarjeta del paciente con botones de recordatorio por WhatsApp y por correo, y ⋮ (Subir foto · Descargar · Fusionar paciente · Desactivar · Eliminar).
  - Arriba, tarjetas de Etiquetas, Notas y Alergias.
  - «Ver barra de progreso»: etapas del tratamiento (Ortodoncia: Diagnóstico → Tratamiento inicial → Contención → Post-contención; o «Rehab. Oral»), con «Configurar plantillas» y un contador de **Inasistencias**.
  - A la derecha, siempre: Presupuesto (+ Crear) y Notas de evolución (+, filtro, «+ Registrar evolución»).
- **Menú de secciones:** Filiación · Historia clínica · Odontograma · Periodontograma · Ortodoncia · Estado de cuenta · Prescripciones · Archivos.

| Sección | Qué tiene | Evidencia |
|---|---|---|
| Filiación | Datos personales: nombres, apellidos, apodo, documento, teléfono, correo, nacimiento, país, teléfono fijo, N° HC, dirección, fuente de captación, sexo, aseguradora, línea de negocio, grupo, ocupación, «Editar campos». Datos fiscales: razón social, número fiscal, dirección, «Departmento» (así, con la errata) | [V] |
| Historia clínica | Pestañas: Anamnesis Odontología · Odontopediatría · Endodoncia · Signos vitales · Notas de evolución · Consentimientos, y «Plantillas» para elegir cuáles se ven. Secciones: motivo, enfermedad actual, antecedentes, examen clínico (signos vitales, extraoral, intraoral). Consentimientos: «no está incluido en tu plan» | [V] |
| Odontograma | Tres odontogramas: Inicial / Evolución / Alta, con «Nuevo odontog.». Doctor, tipo (Adultos o niños), nomenclatura (Internacional) y «Marcado múltiple». Tocar una pieza abre un buscador de hallazgos, con atajos (Caries, Restauración roja o azul) y unos 50 hallazgos (rojo = mal estado, azul = bueno). Abajo, plan de tratamiento por pieza (hallazgo, servicios vinculados, nota) y especificaciones, diagnóstico con «Usar lista CIE-10», observaciones y plan de trabajo. Además, «Probar nueva versión» | [V] |
| Periodontograma | Gráfico de las dos arcadas; por pieza: movilidad, sangrado al sondaje, placa, margen gingival y profundidad de sondaje. «Guardar» y ⋮ | [V] |
| Ortodoncia | Pestañas: Examen clínico (más de 20 campos: cráneo, ATM, deglución, hábitos, asimetría facial…) · Plan de trabajo · Plan de tratamiento · Resumen · Fotografías («Crear nuevo álbum») | [V] |
| Estado de cuenta | Presupuestos · Historial de pagos (fecha, doctor, motivo, comentario, precio; descargar) · Órdenes de laboratorio («Prueba 07 días»). «+ Nuevo», video, ⋮ (Plantillas · Eliminados) | [V] |
| Prescripciones | «Plantillas» (con aviso «Aún no tienes plantillas… Ver tutorial»), «+ Nueva prescripción ▸ Receta» y engranaje | [V] |
| Archivos | «Archivos digitales», espacio usado (muestra «0 de GB», un error de texto) y «Subir archivo» | [V] |

### 2.5 Caja (`/panel-control/cashbook/…`, 1 clic)

- **Al entrar la primera vez** aparece el modal **«Abrir caja»** (usuario, «Caja principal»). No la abrí.
- **Ingresos y egresos:**
  - Ingreso y egreso del día en Bs, fecha y «Ver todo».
  - «Nuevo ingreso» ▾ (Registrar abono) y «Egreso».
  - ⋮: Cerrar caja / Ver resumen · Ver anulados · Descargar ingresos/egresos · Gestión multicaja.
- **«Registrar pago»** (panel lateral):
  - Paciente y «Doctor relacionado a la venta».
  - Ítems: tipo (Servicios / Productos / Otros / Alquiler de consultorio), cantidad, precio unitario, proveedor y subtotal.
  - Total en Bs, medio de pago (Efectivo / Tarjeta / Transferencia / Otro, más «Agregar nuevo medio»; **no trae QR**) y «+ Dividir pago».
  - **Comprobante: Boleta / Factura / Otro / Recibo.** Es solo una etiqueta: elegir «Factura» no pide ningún dato fiscal.
- **Comisiones:** período y doctor; total recaudado, comisión y N° de servicios; columnas de fecha, paciente, medio, comprobante, concepto, total, tarjeta, descuento, proveedor, comisión, clínica y comentario; «Descargar».
- **Presupuestos:**
  - Contadores: Total creados / Nuevo / Aceptado / Rechazado, con el monto en Bs. Período y «Nuevo presupuesto».
  - Columnas: ID, presupuesto, paciente, balance, próxima cita, tarea, fuente y comentario.
  - «Nuevo presupuesto» primero abre el asistente de servicios frecuentes (no lo pasé).

### 2.6 Administración ▾ (2 clics)

- **Laboratorio:** bloqueado. «Este servicio no está incluido en tu plan contratado. Prueba 7 días» + video.
- **Servicios:**
  - Categoría y subcategoría, buscador y «Nuevo Servicio» ▾ (Configurar categorías · Configurar subcategorías · Importar servicios · Descargar servicios).
  - Por fila, ⚙: comisión a profesionales y gasto de insumos. También lápiz y eliminar.
- **Proveedores:** tabla vacía **sin mensaje de estado vacío** y «Nuevo proveedor».
- **Consentimientos:** bloqueado, «no está incluido en tu plan», **sin botón para contratar ni probar**.

### 2.7 Marketing ▾ (2 clics; con corona salvo Automatizaciones, que dice «¡Pruébalo!»)

- **Segmentaciones** (`/marketing/segments/<id>`):
  - Viene con el segmento «Hace más de 180 días» (0 pacientes) y la lista «No enviar campañas».
  - «Agregar segmento», con filtros de:
    - **Paciente:** fecha de alta, fase del embudo, línea de negocio, grupo, edad, sexo, fuente, aseguradora, etiquetas, lista de excluidos.
    - **Campañas enviadas.**
    - **Presupuestos:** con deuda o saldo a favor, servicio terminado, servicio pagado / por pagar, estado del presupuesto.
    - **Citas:** tiene próxima cita agendada, fecha de la última cita, estado de la última cita.
    - **Caja:** servicio pagado.
  - Acciones: «Automatizar», campaña, tarea y descargar.
- **«Crear automatización»** (desde un segmento):
  - Saldo de 5 mensajes y «Recargar».
  - «Enviar cada» 2 semanas / 3 / 4 / 1 mes / 2 meses…
  - Plantillas: Control 6 meses adulto (1 y 2), niño (1 y 2), control mensual…, más «Quiero agregar una plantilla».
  - Aviso: **«solo se enviará si el paciente tuvo antes una cita atendida y no tiene cita programada»**.
  - Vista previa en un teléfono: «Asistente virtual de Dr. Sergio… pronto serán ya 06 meses desde tu última consulta… ¿Agendamos una cita?», con los botones «Agendar cita en línea» y «Agendar cita por WhatsApp».
- **Automatizaciones** (`/marketing/automations/…`):
  - **Línea de tiempo:** «Recordatorios antes de la cita» (7 días antes: «Tenemos una cita pronto», firmado por «Soyla»; 1 día antes: «Recordatorio de tu cita», con los botones **Confirmar · No podré asistir · Chatear con la clínica**) → Día de la cita → «Mensajes después de la cita» (Reseña, con corona) → «+».
  - Saldo de citas: 5. Saldo de marketing: 5. «Enviar una prueba».
  - Al entrar se abre **«¡Envíate un recordatorio de prueba!»**, que pide tu celular con +591 ya elegido.
  - **Comprar mensajes:** 100 recordatorios por US$ 2,50 y 500 por US$ 10,50.
  - Pestaña «Historial de envíos», con filtros de tipo, fecha y estado.
- **Cumpleaños y Campañas:** bloqueados («Solicita una prueba de 07 días» + video).
- **Embudo de ventas:** bloqueado, pero **muestra un ejemplo con datos ficticios** («La información de este ejemplo es ficticia. Conoce nuestros planes…»). Leads → Nuevos → Convertidos por trimestre, con los ingresos en **S/** (soles), en una cuenta boliviana.

### 2.8 Productividad (`/productivity/…`, 1 clic)

- **Pestañas:** Ingresos y egresos · Servicios vendidos · Servicios terminados · Agenda · Pacientes · Reporte anual. «DESCARGAR».
- **Gráficos:**
  - Ingresos y egresos, ingreso por doctor, por tipo de ingreso, por comprobante y por medio de pago.
  - Productividad por doctor (horas trabajadas y citas atendidas) y «Citas agendadas vs atendidas (0%)».
  - Fuentes de captación y datos demográficos.

### 2.9 Inventario (`/inventory/products`, 1 clic)

- **Pestañas:** Productos · Compras · Consumo · Prescripciones. «Ver tutorial».
- **Productos:** filtros de tipo, categoría y almacén, «Alerta de stock» y buscador.
- **«Nuevo producto»:**
  - Tipo, nombre, presentación, SKU o código de barras (escanear o escribir).
  - Alerta de stock mínimo, precio de venta en Bs, «capacidad por aplicación o dosis» y comentario.

### 2.10 Chat (`/patient-chats/main`, 1 clic)

- **Filtros rápidos:** Todos · Leads · Leads (con cita) · Leads (sin cita) · Pacientes.
- **«Más»:** Curiosos · Filtrar por etapa · Pacientes con cita hoy / mañana · **No confirman la cita de mañana** · Recibieron campañas · Chats sin responder · **Chats de Soyla** · **Chats para ayuda humana** · Archivados.
- **Acción masiva:** marcar todo como leído o como respondido.
- **Vacío:** «Selecciona un paciente para comenzar a chatear».

### 2.11 Configuración (engranaje ▾ → «Ir a configuración», 2 clics)

- **Generales:**
  - Plantillas de mensaje · Etiquetas.
  - Propiedades: formulario del paciente, líneas de negocio, grupos, fuentes de captación, «Teléfono · países frecuentes».
  - Caja: qué muestra el ticket, **«Mostrar el tipo de cambio en la barra superior» (encendido)**, configurar monedas, tipos de ingreso y egreso, medios de pago.
  - Notificaciones: cumpleaños.
- **Mi perfil:**
  - Nombre comercial, celular (+591), dirección (Santa Cruz), correo, horarios, medio de pago, zona horaria **America/La_Paz**, presentación, Google Maps, web y logo.
  - **Link de citas en línea** (copiar y abrir) y **link de registro en línea**. Este último abre una página en texto plano: «El servicio de registro en línea para pacientes no está activo».
- **Usuarios:**
  - Todos / Staff médico, «Usuarios 1 de 9» y «Nuevo usuario».
  - Columnas: usuario, correo, tipo (Doctor principal), sucursal, estado y permisos.
- **Suscripción:**
  - **Mi plan:** monto US$ 49,00; plan Avanzado; ciclo mensual; «Fecha de renovación 29 Sep 2026»; tarjeta «Afiliar tarjeta».
  - Usuarios de pago: 1 doctor principal y 0 administrativos. Usuarios gratuitos: 5 doctores temporales y 3 administrativos.
  - Servicios opcionales, todos en «No»: Plataforma de filiación, Consentimientos informados, CRM, Pantalla para sala de espera, Chat interno y Facturación electrónica.
  - Pestañas Información legal · Mis tarjetas · Mis facturas.
- **Historia clínica:**
  - Replicar el odontograma inicial en el de evolución; alerta de saldo a favor y deuda.
  - Atajos y lista de ~50 hallazgos para reordenar y editar.
  - **Relación hallazgo → servicio → costo**, «para crear un presupuesto más rápido».
- **Integraciones:**
  - Google Calendar: «Importar calendario».
  - WhatsApp: «Más información» abre «Conectar WhatsApp… enviar mensajes desde tu propio WhatsApp: campañas, recordatorios, encuestas… **Contrata el módulo de Marketing y/o Soyla IA para activar este servicio**».

### 2.12 Páginas que ve el paciente

- **Reserva** (`app.doctocliq.com/clinic/<id>/`):
  - Columna angosta, pensada para el celular: logo, «Agenda tu cita», tira de fechas y «Agendar».
  - Abajo, «Más información» (atención, seguro, tipos de pago, staff médico, ubicación) y «Servicio ofrecido por Doctocliq».
  - Sin horarios cargados **muestra las fechas y el botón apagado, sin explicar por qué** [V].
- **Confirmación desde el recordatorio** (`/sms-appointment/<id>`): no la abrí, para no cambiar el estado de la cita de ejemplo.

---

## 3. Precios y planes hoy (29-sep-2026)

Fuente: `doctocliq.com/planes-y-precios` [P] y `/panel-control/pricing` dentro de la app [V]. Los precios son en USD. Suscribirse pide tarjeta («Afiliar tarjeta»).

| Plan | Mensual | Anual («2 meses gratis», solo clientes nuevos) | Pacientes | WhatsApp de recordatorio | Lo que suma |
|---|---|---|---|---|---|
| Gratis | USD 0 | - | 30 por mes | No | Agenda, historia clínica y presupuestos |
| Individual | USD 19 | USD 190 | 50 por mes | 50/mes | 1 GB, agenda en línea |
| Básico | USD 29 | USD 290 | Ilimitados | 100/mes | 5 GB, caja básica, consentimientos, firma electrónica, ortodoncia, soporte por chat |
| Avanzado | USD 49 | USD 490 | Ilimitados | 100/mes [P] · **150/mes** [V] | 20 GB, caja avanzada con multicaja y comisiones, formulario del paciente, estética facial, reportes, laboratorio, inventario |

- **Por doctor:** cada plan trae 1 usuario doctor, y «el monto se calcula en base al plan, número de usuarios y servicios opcionales» [V]. Todos los planes suman 8 usuarios gratis: 5 doctores temporales o invitados y 3 administrativos [P][V]. **No se ve el precio de un doctor fijo adicional**, así que la cifra de «Bs 1.771 por 3 profesionales» de `PRECIO_Y_MODELO.md` queda sin confirmar.
- **Módulos aparte:**
  - Marketing y Soyla IA: solo con contrato semestral o anual, sin precio publicado, «Solicitar demo» [P].
  - Facturación electrónica: Ecuador, Perú, México, Colombia y RD [P]. Bolivia no está.
  - Mensajes de WhatsApp: 100 por US$ 2,50 y 500 por US$ 10,50 [V].
  - Verificación de DNI y pago de citas en línea: solo Perú [P].
- **Prueba:** «7 días gratis, sin tarjeta» del plan Avanzado [P][V]. La cuenta muestra «renovación 29 Sep 2026», con 5 mensajes de saldo en cada bolsa.
- **Contradicción entre sus propias páginas:** el Avanzado trae 100 recordatorios al mes en la web y 150 dentro de la app.

**En bolivianos** [D], a 11,37 Bs/USD (`pricing.ts:35`) y a 12,05 (BCB, 26 al 28-sep, según `PRECIO_Y_MODELO.md`):

| | Individual | Básico | Avanzado |
|---|---|---|---|
| a 11,37 | Bs 216 | Bs 330 | Bs 557 |
| a 12,05 | Bs 229 | Bs 349 | Bs 590 |

Contra Onia (Bs por negocio, sin límite de doctores de pago): Básico 320 · Crece 550 · Profesional 890 · Completo 1.290 (`lib/subscription-plans.ts:39-45`) + agente conversacional Bs 390.

---

## 4. Doctocliq vs Onia, función por función (rubro dental)

- **Doctocliq:** lo que vi hoy.
- **Onia:** lo que dice `INVENTARIO_POR_RUBRO.md` §2.1 y §3. Producción es `c3b92067`; «1.0» es el candidato sin publicar.
- **Resultado:** Mejor / Peor / Parejo / Falta, siempre visto desde Doctocliq frente a Onia.

| Función | Doctocliq | Onia | Resultado | Dónde lo vi |
|---|---|---|---|---|
| Pantalla de entrada | Agenda de la semana | Inicio «Hoy» con lo que espera tu OK, lo cobrado y la agenda (1.0) | Onia resume mejor el día; Doctocliq entra directo a trabajar | [V] `/agenda` |
| Vistas de agenda | Semana, día, mes, por doctor, por consultorio; filtro de 8 estados | Mes y «Agenda de hoy» | **Mejor** | [V] Agenda → ▾ |
| Cambiar el estado de una cita | 8 estados en el menú de la cita (Confirmado y Ausente a 1-2 toques) | Completada / Cancelar / Eliminar; **Confirmar y No asistió no existen** | **Mejor** | [V] menú de la cita |
| Citas que se repiten | Cada día o cada 1-4 semanas… | No aparece en el inventario | **Mejor** | [V] Agendar cita |
| Recordatorio por correo | Al agendar + 1 día antes a una hora configurable (+ opción de horas antes) | 24 h y 2 h antes, medido en producción | Parejo | [V] Config. agenda → Generales |
| Recordatorio por WhatsApp | **Encendido de fábrica**, sin conectar número, 7 y 1 día antes, con Confirmar / No podré asistir / Chatear | Exige el WhatsApp propio conectado + complemento + plantilla; nunca probado con un número real | **Mejor** | [V] Recordatorios, Automatizaciones |
| WhatsApp manual desde la cita | Abre WhatsApp con el texto y un link de confirmación | Botón WhatsApp en la ficha (1.0); «Enviar yo mismo» en Pendientes | Parejo (el de Doctocliq trae link para confirmar) | [V] |
| Reserva online | Link con «Copiar» a 2-3 clics + mensaje previo | Link a 4-5 clics, sin «copiar» | **Mejor** en llegar | [V] Config. agenda → Agendamiento en línea |
| Lista de pacientes | Última y próxima cita, presupuesto, fuente, etiquetas; importar y descargar | Buscar, filtros («Sin citas en 30/60/90/180 días»), vistas guardadas, importar CSV | Parejo | [V] `/patients/all` |
| Ver quién no volvió | «Asistencias» por mes + filtros Sin cita programada / Deudores / Ausentes; exporta | Filtro «Sin citas en N días» + agente «Vuelve a citar», que propone el mensaje (1.0 prioriza tratamientos a medias) | Distinto: Doctocliq se ve; Onia actúa, pero no se demostró con datos | [V] `/patients/attendance` |
| Historia clínica | Anamnesis por especialidad, signos vitales, CIE-10, plantillas | Motivo, diagnóstico, tratamiento, notas; alertas médicas | **Mejor** | [V] ficha → Historia clínica |
| Odontograma | ~50 hallazgos configurables; inicial / evolución / alta; adulto / niño; plan por pieza | 7 condiciones + nota | **Mucho mejor** | [V] ficha → Odontograma; Config. → Historia clínica |
| Periodontograma | Sí | No | **Falta en Onia** | [V] |
| Ortodoncia | Examen, plan, resumen y álbumes de fotos (desde Básico) | No | **Falta en Onia** | [V][P] |
| Etapas del tratamiento | «Barra de progreso» por etapas + inasistencias | Plan de tratamiento con estados por fila (1.0) | Mejor la de Doctocliq en lo visual | [V] |
| Recetas | Plantillas, firma electrónica (Básico o más), tipos de receta | Nueva, imprimir, eliminar; sin editar | Mejor | [V][P] |
| Presupuesto | Presupuesto por paciente + tablero Nuevo / Aceptado / Rechazado con balance + hallazgo → servicio → costo | No hay presupuesto formal (el plan de tratamiento no tiene total ni PDF) | **Mejor** | [V] Caja → Presupuestos; Config. → Historia clínica |
| Consentimientos | Módulo desde Básico; bloqueado en la prueba | Firma solo en Requerimientos, no en la ficha | Mejor en papel; no lo pude probar | [V][P] |
| Archivos e imágenes | 1 / 5 / 20 GB por plan | Documento adjunto en Notas | Mejor | [V][P] |
| Caja | Abrir y cerrar caja, multicaja, abonos, dividir pago; medios configurables **sin QR** | Nota de venta, 5 medios **con QR**, recibo, nota de crédito, anular, cobros recurrentes, QR de cobro propio | Parejo: Onia tiene QR y recurrentes, Doctocliq el control de caja | [V] Caja |
| Comisiones por profesional | Sí, por servicio y por doctor | No para clínicas (solo una herramienta de agencia en Gastos) | **Mejor** | [V] Caja → Comisiones |
| Factura boliviana (SIAT) | No: «Factura» es una etiqueta; su facturación electrónica no cubre Bolivia | Código listo, apagado en producción | **Peor** (Onia tiene la ventaja por delante) | [V][P] |
| IVA e IT / contabilidad | No visto | Resumen de IVA e IT, registro de ventas y compras | **Peor** | [V] |
| Reportes | 6 pestañas: por doctor, por medio de pago, agendadas vs atendidas, fuentes, demografía, anual | Balance, CSV y «Lo que te dejó Onia» (1.0) | Mejor en amplitud; Onia mide la plata recuperada | [V] Productividad |
| Inventario | Productos, compras, consumo, SKU, dosis, almacén, alertas (Avanzado) | Insumos con mínimo y movimientos; sin editar | Mejor | [V] Inventario |
| Laboratorio | Órdenes (Avanzado o prueba de 7 días) | No | Falta en Onia (baja prioridad) | [V] |
| Recuperar pacientes (automático) | Segmento + automatización de WhatsApp cada N semanas (módulo pago) | Agentes que proponen y el dueño aprueba (desde Crece) | Distinto: Doctocliq automático y pago; Onia incluido y con aprobación | [V] Marketing |
| Bot con IA | Soyla IA: agenda dentro del chat, API oficial, conserva el número, 3-7 días de implementación, sin precio publicado | Complemento de Bs 390 por guion, sin LLM, que no agenda en el chat | Mejor en la promesa; no lo pude probar | [P] `/soyla-ia` |
| Bandeja de chat | Filtros «No confirman cita de mañana», «Chats para ayuda humana» | Conversaciones con marcar resuelta y responder | Mejor en filtros | [V] Chat |
| Usuarios y permisos | 8 usuarios gratis, permisos, sucursales | Equipo, roles, quién aprueba; los permisos no alcanzan a la caja | Mejor | [V][P] |
| Precio y moneda | USD con tarjeta, por doctor, módulos aparte | Bs con QR, por negocio | **Peor** para Bolivia | [V][P] |
| Primer minuto | Datos de ejemplo + 5 tareas + chat humano + «envíate un recordatorio» | Onboarding de 5 pasos que lee tu web + Guía de inicio + `/setup`, sin datos de ejemplo | **Mejor** | [V] |
| Soporte | Chat en la app; ventas con teléfonos de Perú y México | Sergio en persona en SCZ | **Peor** para SCZ | [V][P] |
| Celular | App de iOS y Android en todos los planes [P]; la reserva pública es de una sola columna [V] | PWA con barra inferior | No medido (ver §6) | - |
| Lo que ve la venta | 8 pantallas con corona o candado en el menú; embudo con datos ficticios | Regla: no exhibir obra | **Peor** | [V] |

**Correcciones a la fila de Doctocliq en `VENDIBLE_VS_COMPETENCIA.md`:**
- **Periodontograma y ortodoncia:** confirmados. **Imágenes:** hay archivos (1-20 GB) y álbumes de fotos en ortodoncia, pero no vi un visor de radiografías.
- **Recordatorio por WhatsApp:** no es solo un cupo de 50-150 al mes. Viene **encendido desde la prueba** y sale del número de Doctocliq. Para usar el número de la clínica hay que contratar Marketing o Soyla, y los paquetes extra cuestan US$ 2,50 por 100.
- **Inventario solo en Avanzado:** confirmado [P]. En la prueba de Avanzado se puede usar [V].
- **Reactivar pacientes:** además de campañas, tiene «Asistencias» con el filtro «Sin cita programada» y segmentos por «servicio terminado» y «presupuesto con deuda».
- **Prueba gratis:** hoy son **7 días de Avanzado sin tarjeta**, además del plan Gratis de 30 pacientes al mes.
- **App móvil:** la página de precios dice iOS y Android en todos los planes. No la probé.
- **Prueba social:** «+4000 doctores, 20 países, +8 años» [P].

---

## 5. Ideas para evaluar

Que Doctocliq tenga algo no lo vuelve mejor que Onia ni obliga a copiarlo. Son ideas sobre cómo trabajan.

Para cada una:
- **Problema:** qué le resuelve al cliente ideal de Onia (clínica de SCZ con 2-6 profesionales, cuyo dolor #1 es el paciente que no volvió).
- **Choca con:** qué regla de Onia toca (velocidad, honestidad, multi-rubro, etapa).
- **Costo:** esfuerzo estimado [I].

Ordenadas por valor para vender y, después, por costo.

**Idea 1. Confirmar y No vino en un toque desde la agenda**
- **Problema:** es el hueco #1 del inventario. Sin estos estados, las reservas online quedan «pendientes» para siempre, y el agente «Reprograma» y la tarea de faltas nunca se disparan.
- **Choca con:** velocidad y poco texto, si se copian los 8 estados. Alcanza con 4: Confirmada · Llegó · Atendida · No vino.
- **Costo:** bajo, 1 día. La API ya acepta los estados.

**Idea 2. Recordatorio por WhatsApp que funciona el día 1, sin conectar nada**
- **Problema:** la inasistencia y la recepción llamando uno por uno. Hoy Onia depende de que cada clínica conecte su número con Meta, y eso nunca se probó. Doctocliq lo resuelve mandando desde su propio número, con botones que actualizan la cita.
- **Choca con:**
  - Honestidad: el mensaje sale desde el número de Onia y el paciente tiene que ver el nombre de su clínica.
  - Costo de Meta por mensaje utility para Bolivia desde el 1-oct, sin medir.
  - Decisión tuya: ¿sin aprobación? Hoy la regla es que el agente propone y el dueño decide. El recordatorio de cita es operativo, no de venta.
- **Costo:** 2-4 días (plantilla utility aprobada en la WABA de Onia + webhook de los botones → estado de la cita). Depende de la idea 1. Coincide con el hueco #5 de `VENDIBLE_VS_COMPETENCIA.md`.

**Idea 3. «Envíate un recordatorio de prueba» al entrar**
- **Problema:** que el dueño vea en su propio teléfono lo que va a recibir su paciente, en el minuto 1 y sin cargar nada.
- **Choca con:** nada, siempre que el mensaje funcione de verdad (si no, rompe la honestidad).
- **Costo:** bajo, una vez hecha la idea 2.

**Idea 4. Ver quién no volvió de un vistazo**
- **Problema:** es el dolor #1 del cliente ideal. Hoy Onia tiene el filtro «Sin citas en N días» y el agente, pero nada que el dueño mire en 5 segundos.
- **Choca con:**
  - Velocidad en el celular: la tabla por meses de «Asistencias» no entra en 375 px. En Onia sería una lista corta, «No volvieron (12)», con nombre, último tratamiento y un botón de WhatsApp.
  - Multi-rubro: suma, porque sirve igual a estética y servicios.
- **Costo:** bajo-medio (2-3 días), sobre datos que ya existen.

**Idea 5. Datos de ejemplo al entrar, con el celular del dueño**
- **Problema:** el primer minuto vacío. El inventario ya marca que estética y servicios no tienen demo con datos.
- **Choca con:**
  - Honestidad: tienen que decir «de ejemplo» y borrarse con un toque (en Doctocliq no vi cómo borrarlos).
  - Multi-rubro: hace falta un juego de datos por cada uno de los 5 rubros.
- **Costo:** medio (3-5 días).

**Idea 6. Presupuesto con estado (Nuevo / Aceptado / Rechazado) y saldo**
- **Problema:** el tratamiento a medias empieza en un presupuesto que nadie siguió. Onia no tiene presupuesto formal: el plan de tratamiento no tiene total, PDF ni aceptación.
- **Choca con:**
  - Etapa: es construir, y lo escaso son clientes. Se justifica solo si entra en la demo que vende.
  - Multi-rubro: suma, porque la importadora ya tiene cotizaciones y se podría reutilizar ese modelo.
- **Costo:** alto (1-2 semanas).

**Idea 7. Link de reserva con «Copiar» a 2 clics**
- **Problema:** hoy está a 4-5 clics y sin botón para copiar.
- **Choca con:** nada.
- **Costo:** horas.

**Idea 8. Citas que se repiten (controles de ortodoncia cada 4 semanas)**
- **Problema:** la agenda de controles periódicos.
- **Choca con:** nada, pero no es el dolor #1.
- **Costo:** medio.

**Idea 9. Comisión por profesional**
- **Problema:** en clínicas de 2-6 profesionales, liquidar comisiones a fin de mes es un trabajo real.
- **Choca con:** etapa. Esperar a que una clínica que paga lo pida.
- **Costo:** medio.

**Idea 10. Periodontograma, ortodoncia y odontograma de 50 hallazgos**
- **Problema:** la profundidad clínica que un odontólogo compara en la demo.
- **Choca con:**
  - Etapa: «construir es lo que sobra».
  - Poco texto: son formularios de más de 20 campos.
- **Costo:** alto (semanas). Solo cuando una clínica que paga lo pida o se pierda una venta por eso.

**Qué NO tomar de Doctocliq**
- **Pantallas bloqueadas con corona en el menú** (8 entre Marketing, Administración y la ficha) y «no está incluido en tu plan» sin salida en Consentimientos. Choca con la regla «la venta nunca exhibe obra».
- **El embudo con datos ficticios en soles** en un módulo bloqueado. Choca con la honestidad.
- **Un link en la configuración que abre «no está activo» en texto plano**, y la reserva pública con el botón apagado y sin explicación. Choca con «nada vacío».
- **Precio en USD por doctor**, con módulos que solo se venden por semestre o año y mensajes por paquete en USD. El total del mes queda opaco, que es la queja número uno en LatAm.
- **Ventanas que se pisan:** el checklist, el chat que escribe solo, el pedido de opinión, el video que arranca solo y el «Mira cómo funciona» en cada pantalla vacía. Choca con velocidad y poco texto.
- **8 estados de cita, 6 pestañas de historia clínica y una barra superior con 9 entradas y submenús.**

---

## 6. Lo que no pude ver sin crear datos o sin pagar

- **El registro y la configuración inicial:** la cuenta ya estaba creada. No sé qué pregunta Doctocliq al alta, ni si cargó los datos de ejemplo por el rubro.
- **El recordatorio llegando al teléfono y la página que ve el paciente al confirmar** (`/sms-appointment/<id>`). Mandarlo o abrir esa página podía cambiar el estado de la cita de ejemplo.
- **Soyla IA:** requiere demo, contrato semestral o anual e implementación de 3-7 días. No hay precio publicado.
- **Los módulos bloqueados:** Marketing (Cumpleaños, Campañas, el embudo real, «Reseña» después de la cita), CRM y tareas, Consentimientos, Laboratorio, Plataforma de filiación, Chat interno y Pantalla de sala de espera.
- **Formularios que exigían guardar o pasar un asistente:** Nuevo presupuesto (antes pide confirmar los servicios), Registrar evolución, el detalle de «Receta», «Nuevo odontog.» y «Probar nueva versión» del odontograma.
- **Las apps de iOS y Android, y la app a 375 px:** no cambié el tamaño de la ventana porque es tu Chrome compartido con otros agentes. Lo único visto: la reserva pública es de una columna; el panel de escritorio muestra barra de desplazamiento horizontal a 1536 px.
- **Velocidad medida:** solo una observación. Las citas de la agenda aparecieron 3-6 s después de cargar la página, y el menú de la cita se abrió con doble clic en mi sesión (puede ser la herramienta).
- **El precio de un doctor fijo adicional**, Mis tarjetas, Mis facturas y qué pasa al vencer la prueba de 7 días.
- **Reportes con datos:** todo estaba en 0.

**Para verlo sin gastar:**
- Cargá horarios a un profesional y abrí tu propio link de reserva desde el celular.
- Agendate una cita de mañana con tu número y esperá el recordatorio de las 14:00. Eso muestra la página de confirmación y los botones.
- Pedí la demo de Soyla como clínica de SCZ.
