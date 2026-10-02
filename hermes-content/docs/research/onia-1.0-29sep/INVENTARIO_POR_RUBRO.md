# Onia 1.0: qué hace cada módulo, rubro por rubro

Para: Sergio Urcullo · Fecha: 29-sep-2026 · Hecho solo leyendo código, tests y el VPS en modo lectura (no se inició sesión en producción ni en QA, no se creó nada, no se gastó).

**Qué se revisó**

- **La 1.0 (candidato, sin publicar):** rama `codex/v1-integracion-20260927` en `C:/dev/proyectos/onia-platform-v1-integracion-20260927`. La auditoría se hizo sobre el commit `1756ef90`. Mientras se auditaba, la rama siguió avanzando y hoy está en `a76e7bf8` (29-sep 16:28), con **142 commits** encima de producción. Dos cosas de esta lista ya se arreglaron ahí y lo marco donde corresponde: el botón «+» del Inicio clínico (commit `e712a827`) y «Ver mi plan» de la franja inferior (commit `164879f9`). Lo demás que se revisó de nuevo sigue igual: los botones Confirmar y No asistió siguen sin existir, y la campana sigue sin actualizarse sola.
- **Lo que corre hoy en producción:** `master` de `C:/dev/proyectos/onia-platform`, versión `c3b92067`.
- Las rutas de archivo son relativas al repo del candidato, salvo las que empiezan con `web:` (la web pública, `C:/dev/proyectos/onia-hermes-v1-remoto-20260928/web-factory/apps/onia-platform`) o `hermes:` (`.../onia-hermes-v1-remoto-20260928/hermes-content`).

**Cómo leer la columna «funciona»**

| Marca | Qué significa |
|---|---|
| [T] | Hay un test automático que prueba esa función. El test existe; hoy no se corrió. |
| [E] | Un robot que hace clic de punta a punta (`e2e/`) recorre esa pantalla. La última corrida verde es del 28-sep y fue sobre una versión anterior. |
| [P] | Medido en producción con uso real (solo lo que se pudo leer sin tocar nada). |
| [C] | Solo está conectado en el código: el botón llama a algo que existe, pero nadie lo probó. |
| [X] | No funciona o no existe. |

**Estado:** OK · Dudoso (anda, pero confunde o tiene un hueco) · Roto · Apagado (existe, pero está oculto por configuración) · No existe.
**Publicado:** «Hoy» = ya está en producción. «Solo 1.0» = solo existe en el candidato sin publicar.

**Producción hoy (base de datos, 29-sep):** 4 cuentas, todas de prueba: 1 dental (en prueba), 1 comercio (5 productos, 1 venta del 18-sep; la prueba vence el 2-oct), 1 importadora (prueba vencida el 14-sep, 0 productos) y la interna de Onia. Hay 0 citas, 0 facturas, 0 pagos, 0 recetas y 0 propuestas de agentes. Ninguna cuenta es de estética ni de servicios. **No hay uso real que medir:** donde dice «funciona», la prueba son tests y un recorrido automático, no clientes.

---

## 1. Veredicto en 10 líneas

1. **Ningún rubro está completo como para venderlo sin letra chica.** El más cerca es dental; le sigue comercio.
2. **Dental:** agenda, fichas, odontograma, recetas, precios, cobros con recibo, cobros recurrentes y reportes funcionan [E/T]. Le falta confirmar una cita y marcar «No asistió» (ese botón no existe en ninguna pantalla), la factura SIAT y un recordatorio por WhatsApp probado con un número real.
3. **Estética:** usa las mismas pantallas que dental. Su promesa en la web («la clienta que dejó el tratamiento a medias») depende de piezas que solo están en la 1.0 sin publicar.
4. **Servicios profesionales:** el Inicio es un mostrador sin agenda, un servicio cargado no se puede editar, el cobro no queda en la ficha del cliente, y en los planes Básico, Crece y Profesional solo el dueño puede tener agenda.
5. **Comercio:** la caja con corte, los fiados, el recibo y el stock con lotes funcionan. Pero no se puede editar un producto, ni cambiarle el precio, ni sumarle stock una vez creado.
6. **Importadora:** el costeo y la alerta de reprecio funcionan [E]. La cotización no se imprime ni se envía, «Convertir en pedido» no lleva a ningún lado y el agente «Sigue cotizaciones» no tiene teléfono al que escribir.
7. **Agentes:** corren todos los días en producción y responden bien [P], pero proponen 0 porque no hay datos. «Avisa stock bajo» no puede dispararse nunca. Deciden por reglas; la IA (gpt-4.1-mini) solo redacta el texto cuando el dueño aprieta «Proponer un texto».
8. **Lo que más cuesta encontrar:** «Pendientes», donde se aprueba lo que proponen los agentes, no está en ningún menú. El link de reserva online está a 4-5 clics y no tiene botón «copiar». El agente de WhatsApp está a 4 clics y fuera del menú.
9. **Para Meta Ads falta lo básico:** no hay píxel ni registro de dónde vino cada alta (solo la pregunta «¿Cómo nos conociste?»), no te llega aviso cuando alguien se registra y cada pago se aprueba a mano.
10. **Nada se miró renderizado con sesión iniciada.** Antes de pagar publicidad, hay que correr el recorrido de la sección 7 sobre una base descartable y mirar las capturas.

---

## 2. Por rubro

### 2.1 Clínica dental

**Menú del dueño (escritorio):** fijos arriba: Inicio, Agenda de hoy, Conversaciones y Pacientes. **Operación** (arranca abierto): Citas, Tratamientos, Inventario. **Dinero** (cerrado): Cobros, Recurrentes, Gastos, Contabilidad, Planilla, Reportes. **Automatización** (cerrado): Agentes, Requerimientos, Avisos. **Sistema** (cerrado): Equipo, Mi web, Configuración, Ayuda (`components/layout/navigation.ts:51-110`; grupos en `sidebar-groups.ts:16-21`). El profesional (rol DOCTOR) ve menos y solo sus propias citas.

**Barra de abajo en el celular:**
- 1.0: Inicio · Agenda · [Asistente] · Pacientes · Más (`components/layout/barra-inferior.ts:20-72`).
- Hoy en producción: Inicio · Agenda de hoy · Pacientes · Cobros · Reportes · Más.

| Módulo | Para qué sirve | Cómo se llega | Funciona | Publicado |
|---|---|---|---|---|
| Inicio «Hoy» | Resumen del día: lo que espera tu OK, cobrado hoy, agenda, «Para hacer» | Es la pantalla de entrada (0 clics) | [T]/[C] | Rediseño solo 1.0; producción tiene el panel anterior |
| Agenda de hoy | Citas de hoy, próximas y hechas | Bloque fijo (1 clic) | [C] | Hoy |
| Citas (calendario) | Ver el mes, crear, mover y cancelar citas | Operación → Citas (1 clic); celular 1.0: Más → Citas (2) | Crear [E]; cambiar estado [C]; confirmar y no asistió [X] | Hoy |
| Pacientes | Lista, alta, filtros, importar desde CSV | Bloque fijo (1 clic) | [E] | Hoy |
| Ficha del paciente | Datos, próxima cita, saldo, historia, cobros, notas | Pacientes → persona (2) | [E]/[T] | Ficha con pestañas solo 1.0; hoy es una página larga |
| Plan de tratamiento | Tratamientos pendientes, en curso y hechos | Ficha → Tratamiento | [T] | Solo 1.0 |
| Odontograma | Estado de cada pieza dental | Escritorio: se ve en la ficha (1 clic). Celular: ficha → pestaña → tarjeta (3-4) | [E] | Hoy |
| Recetas | Emitir e imprimir recetas | Ficha → «Receta» (sin entrada en el menú) | [C] | Hoy |
| Tratamientos | Lista de precios | Operación → Tratamientos (1) | [E]/[T] | Hoy |
| Inventario de insumos | Stock de insumos con mínimo | Operación → Inventario (1) | [C] | Hoy |
| Cobros | Nota de venta, pagos, recibo, nota de crédito | Dinero → Cobros (2); celular 1.0: Más → Cobros | [E] | Hoy |
| Recurrentes | Cobros mensuales, trimestrales o anuales automáticos | Dinero → Recurrentes (2) | [T] | Hoy |
| Reportes | Ingresos, clientes nuevos, citas, exportar CSV | Dinero → Reportes (2) | [T]/[C] | Hoy |
| Avisos | Tablero de los correos enviados | Automatización → Avisos (2) | [C] | Hoy |
| Recordatorios de cita | Correo automático 24 h y 2 h antes de cada cita | Configuración → Avisos automáticos (3) | Correo [P]; WhatsApp sin probar | Hoy |
| Reserva online | El paciente reserva solo desde un link | Configuración → Tu plan y tus datos → Mi plan → bajar → «Ver link público» (4-5) | [T] | Hoy |
| Confirmar desde el correo | El paciente confirma o cancela desde el recordatorio | Botones del correo | [T] | Hoy |
| Conversaciones, Agentes, Pendientes, Requerimientos, Gastos, Contabilidad, Planilla, Equipo, Mi web, Configuración, Ayuda | Módulos comunes | Ver sección 3 | ver 3 | ver 3 |

**Inicio «Hoy»** (`app/(dashboard)/dashboard/page.tsx`, `panel-hoy.tsx`; todo solo 1.0)
- «Nueva cita» (arriba en escritorio, fijo abajo en celular) → lleva al calendario, pero no abre el formulario: falta otro clic en «Nueva Cita» (`page.tsx:388`) · Dudoso [C]
- Tarjetas «Esperan tu OK» + «Ver N más» → muestran las propuestas de los agentes y llevan a Pendientes (`panel-hoy.tsx:122,131`) · OK [T]
- «Te pagaron hoy» → total del día con gráfico de 8 días, lleva a Cobros (`page.tsx:267`) · OK [C]
- «Volvieron» + «¿Qué es?» → cuántos volvieron este mes, lleva a Agentes o a Pacientes (`page.tsx:285-295`) · OK [T]
- Filas de la agenda de hoy → abren la ficha de esa persona; muestran un chip si está por confirmar o faltó · OK [T]
- «Ver calendario →» / «Abrir la agenda» → Citas · OK [C]
- «Lo que te dejó Onia» → plata recuperada por los agentes (hoy en Bs 0, no hay datos) · OK [T]
- Para hacer · «Terminá la configuración» → asistente de 4 pasos `/setup` (`page.tsx:317`) · OK [C]
- Para hacer · «Cobrar vencidas» → Cobros · OK [C]
- Para hacer · «Confirmar agenda» → Citas, **donde no hay botón para confirmar** (`page.tsx:343`) · Roto
- Para hacer · «Completar contacto» → lleva a la lista de pacientes, no a la ficha del que no tiene teléfono (`page.tsx:354`) · Dudoso [C]
- Para hacer · «Reponer insumos» → Inventario · OK [C]
- Para hacer · «Ver todo →» → Pendientes · OK [C]
- Botón «+» (escritorio) y chips de «Más» (celular) → en la versión auditada **desaparecían en el Inicio**, así que no había forma de crear un paciente o un cobro en un toque. **Arreglado hoy en el candidato** (`e712a827`, `components/layout/acciones-primarias.ts:39`): ahora ofrecen «Nuevo paciente» y «Nueva factura». Falta mirarlo en pantalla · OK [T]
- Producción tenía accesos directos a «Nuevo cliente» y «Cobro» en el panel (`git show c3b92067:app/(dashboard)/dashboard/page.tsx:640-642`); el Inicio 1.0 los quitó.

**Agenda de hoy** (`app/(dashboard)/agenda/AgendaClient.tsx`, hoy)
- «Nueva cita» / «Cita» → calendario (`:188-196`) · OK [C]
- «+ Agendar una cita» (si no hay citas) → calendario (`:202`) · OK [C]
- Teléfono de la persona → llama; en celulares angostos se oculta (`:243-251`) · OK [C]
- «Ver» → ficha (`:258`) · OK [C]
- Aviso «Nueva cita agendada para hoy» sin recargar (`:86-123`) · Dudoso [C]: no se verificó en vivo, y una nota anterior dice que el tiempo real «conecta pero no entrega».
- **Es solo de lectura:** no se puede confirmar, completar, cancelar ni marcar «No asistió».

**Citas / calendario** (`app/(dashboard)/appointments/AgendaClient.tsx`, hoy)
- «Nueva Cita» / «Cita» / «+ Agendar cita» → abre el formulario (`:596,743`) · OK [E]
- Formulario · buscar paciente → busca los ya cargados (`:212`) · OK [T]
- Formulario · «+ Nuevo paciente» → lo crea sin salir del formulario (`:237`) · OK [T]
- Formulario · Profesional → quién atiende (`:262`) · OK [T]
- Formulario · Motivo (catálogo, «Consulta general», «Control») (`:278`) · OK [T]
- Formulario · Fecha, botones de duración y grilla de horarios libres (`:323`) · OK [T]
- «Agendar Cita» → crea la cita (`:367`) · OK [E]
- Flechas de mes / tocar un día → cambia de mes y muestra las citas del día · OK [T]
- «Recordatorio» (sobre) → manda el correo en ese momento (`:413,776`) · OK [C]
- «Completada» → marca la cita como hecha (`:441-452`) · OK [C]
- «Editar» → cambia **solo** fecha y hora; no el profesional, el motivo ni la duración (`:472,813`) · OK [C]
- «Cancelar» → cancela **sin preguntar**; el mismo rótulo cierra los modales (`:429,819`) · Dudoso [C]
- «Eliminar» → pide confirmación y borra (`:491,828`) · OK [C]
- **«Confirmar» y «No asistió» → NO EXISTEN.** La base los acepta (`app/api/appointments/[id]/route.ts:18`), pero ningún botón los manda. Consecuencias: las reservas online nacen «pendiente» y recepción no puede confirmarlas; el agente «Reprograma» y la tarea automática de faltas nunca se disparan · Roto [X]
- Desde la ficha, «Agendar» → abre el formulario con el paciente ya elegido (`appointments/page.tsx:117`) · OK [C] · Solo 1.0

**Pacientes** (`app/(dashboard)/patients/`, hoy)
- «Importar CSV» → elegir archivo, descargar ejemplo, «Importar», ver errores, «Importar otro» (`import/page.tsx:130`) · OK [T]
- «Nuevo paciente» → nombre, CI, nacimiento, género, sangre, teléfono, correo, contacto de emergencia, alergias y notas; al guardar va a la ficha (`new/NewPatientForm.tsx:55`) · OK [E]
- Vistas guardadas (guardar, elegir, borrar) (`SavedViewSelector.tsx:45,73,97`) · OK [C]
- Buscar (nombre, CI, teléfono) · OK [C]
- Filtros: género, registrado desde/hasta, **«Sin citas en 30/60/90/180 días»**, aplicar, limpiar (`patients/page.tsx:241-356`) · OK [C]. Este último filtro es una versión manual del agente «Vuelve a citar» y está en todos los planes: sirve como argumento de venta.
- Fila → ficha · OK [E]
- Medidor del plan «Subí de plan» → Configuración (`:51`) · OK [C]
- Borrar un paciente → **no hay botón.** La función existe y exige ser administrador (`app/api/patients/[id]/route.ts:134-140`), pero ninguna pantalla la llama: un paciente cargado por error queda para siempre · No existe [X]

**Ficha del paciente** (`app/(dashboard)/patients/[id]/FichaVista.tsx`)
- Volver a la lista (`:442`) · OK [C] · Solo 1.0
- Lápiz «Editar datos» (`edit/page.tsx:98`) · OK [T]
- Teléfono / «Agregar teléfono» / «WhatsApp» → llama, lleva a editar o abre WhatsApp en **tu** teléfono (solo con celular boliviano válido); no sale nada del sistema (`:500-525`) · OK [C] · Solo 1.0
- «Agendar» → Nueva cita con el paciente ya elegido (`:553`) · OK [C] · Solo 1.0
- «Cobrar» → nota de venta para este paciente; requiere permiso de finanzas (`:558`) · OK [C] · Solo 1.0
- «Receta» → recetas; requiere permiso clínico (`:568`) · OK [T]
- Pestañas Tratamiento · Odontograma · Cobros · Notas → **solo en celular y tableta**; en escritorio se ve todo junto en dos columnas (`FichaPestanas.tsx:52,80,90`) · OK [T] · Solo 1.0
- Alertas médicas «+» → alergia, medicación o condición con su gravedad (`components/patients/MedicalAlertForm.tsx:38`) · OK [C]
- Historial clínico · «Agregar registro» → motivo, diagnóstico, tratamiento hecho, notas · OK [T]
- Pestaña Cobros · «Nuevo cobro» / «Cobrar» / fila de un cobro (`:349-372`) · OK [C] · Solo 1.0
- Pestaña Notas · «Registrar documento» (imagen o PDF: consentimiento, presupuesto firmado, comprobante) · OK [C]; comentar y responder · OK [T] (`components/patients/PatientCollab.tsx:189,225`)

**Plan de tratamiento** (`components/patients/PlanDeTratamiento.tsx`, solo 1.0)
- «Agregar» → tratamiento del catálogo, pieza (solo dental), estado inicial; «Guardar» / «Cancelar» (`:93`) · OK [T]
- Selector de estado en cada fila (Pendiente, En progreso, Completado, Cancelado) (`:119`) · OK [T]
- No es un presupuesto: no tiene total, descuento, PDF ni firma del paciente.

**Odontograma** (`components/odontogram/Odontogram.tsx`, hoy)
- Tocar una pieza + elegir condición (Sano, Caries, Restaurado, Ausente, Corona, Implante, Fractura) + notas · OK [E]
- «Guardar cambio» (`:161`) · OK [E]
- No hay periodontograma, ortodoncia ni radiografías (las imágenes solo se adjuntan como documento).

**Recetas** (`app/(dashboard)/patients/[id]/prescriptions/PrescriptionsClient.tsx`, hoy)
- «Nueva Receta» (`:119`) · OK [C]
- Formulario: doctor, diagnóstico, medicamentos («+» y quitar; nombre, dosis, frecuencia, duración, indicaciones), indicaciones generales, «Guardar» (`:75`) · OK [C]
- Imprimir (`:296`) · OK [C]
- Eliminar (`:97`) · OK [C]
- Editar una receta → **no hay botón**, aunque la función existe (`app/api/prescriptions/[id]/route.ts:43`) · No existe [X]

**Tratamientos / precios** (`app/(dashboard)/treatments/TreatmentsClient.tsx`, hoy; editar requiere permiso de configuración)
- «Nuevo Tratamiento» → nombre, precio, duración, categoría, descripción, «Guardar» (`:88`) · OK [E]
- Editar · OK [T] · Activar/Desactivar · OK [T] · Eliminar (con confirmación) · OK [T]

**Inventario de insumos** (`app/(dashboard)/inventory/InventoryClient.tsx`, hoy; el profesional no entra)
- Buscar / «Solo stock bajo» (`:188`) · OK [C]
- «Nuevo» insumo (nombre, categoría, SKU, stock inicial, mínimo, unidad, costo, proveedor, notas) → «Guardar insumo» (`:88`) · OK [C]
- «Movimiento» → entradas y salidas (`:124`) · OK [C]
- Archivar (`:161`) · OK [C]
- Editar un insumo (nombre, mínimo, costo) → **no hay botón**, aunque la función existe (`app/api/inventory/items/[id]/route.ts:28`) · No existe [X]
- El agente «Avisa stock bajo» no corre en clínicas; solo aparece la tarea «Reponer insumos» en el Inicio.

**Cobros** (`app/(dashboard)/billing/`, hoy; el profesional no lo ve)
- «Nueva nota de venta» → formulario (`billing/page.tsx:87-94`) · OK [C] (la página [E])
- Filtro por estado y vistas guardadas · OK [C]
- Formulario: elegir paciente, tocar tratamientos del catálogo, cobro manual (descripción, cantidad, precio, «Agregar»), +/−, quitar, notas, vencimiento, «Cobro recurrente» (mensual, trimestral, anual) (`new/NewInvoiceClient.tsx:188-379`) · OK [E]
- «Crear nota de venta» (`:95`) · OK [E]
- «Registrar Pago» → Efectivo / QR-Billetera / Transferencia / Tarjeta / Otro, monto, referencia, «Confirmar pago». **Solo lo anota; no cobra** (`PaymentModal.tsx:61`) · OK [E]
- «Imprimir recibo» → recibo imprimible · OK [C] (la página [E])
- «Marcar como Enviada» / «Marcar como Vencida» → cambio de estado a mano · OK [T]; lo de «Vencida» a mano confunde (debería salir solo de la fecha).
- «Enviar por correo» · OK [T] (el test solo cubre la fecha)
- «Imprimir / PDF» → comprobante que dice «NOTA DE VENTA · Documento sin valor fiscal» · OK [C] (la página [E])
- «Anular» (con confirmación) · OK [T]
- «Nota de crédito» → «Crear NC» · OK [T]
- Nombre del paciente → ficha · OK [C]
- **No hay factura SIAT:** en producción la emisión está apagada (`SIAT_EMISSION` vacío).

**Recurrentes** (`app/(dashboard)/billing/recurring/`, hoy; plan Profesional o superior)
- «Nueva recurrente» (agregar y quitar ítems, guardar) · OK [T]
- Pausar / Reanudar · OK [C] · Eliminar (con confirmación) · OK [C]
- «Ver planes» (en Básico y Crece se ve con candado) → Configuración · OK [C]
- Generación automática: un proceso programado diario (06:00 hora del servidor) emite los cobros · OK [T] (no se leyó su registro)

**Reportes** (`app/(dashboard)/reports/`, hoy; completo desde Profesional, en Básico y Crece se ven 3 números y un aviso para subir de plan)
- «Balance de comprobación» → producción vs facturado vs cobrado del mes, con flechas de mes · Dudoso [C]: el nombre es jerga contable
- «Exportar CSV» · OK [T]
- Filtro desde/hasta · OK [C] · «Ver planes» · OK [C]

**Avisos** (`app/(dashboard)/communications/page.tsx`, hoy)
- «Configurar <negocio>» → Configuración · OK [C] · «Ver ayuda» · OK [C] · WhatsApp a Onia si el correo no está configurado · OK [C]
- Se llama «Avisos», pero no configura nada (el interruptor está en Configuración) y habla de «el cron» (jerga técnica).

**Recordatorios de cita** (sin pantalla propia)
- Interruptor «Correos automáticos» en Configuración → Avisos automáticos (`settings/SettingsClient.tsx:676`) · OK [C]
- Correo automático 24 h y 2 h antes · OK [P]: el proceso corre cada 15 min y responde bien (hoy con 0 citas); el catálogo registra una prueba de punta a punta del 24-sep.
- **Recordatorio por WhatsApp:** ya existe en producción, pero **cada negocio tiene que tener su propio WhatsApp conectado, el complemento de WhatsApp activo y una plantilla aprobada por Meta** (`lib/whatsapp.ts:32-72`; en producción `git show c3b92067:lib/whatsapp.ts:9-32`). Hoy ninguna cuenta tiene credenciales propias (0 de 4; 1 tiene una bandeja de Chatwoot vinculada). En la 1.0 se suma usar el número conectado desde la pantalla del asistente y la plantilla `lib/whatsapp/plantilla-recordatorio.ts`. Nunca se probó con un número real · Dudoso [C]. La ayuda al cliente dice que «prioriza el WhatsApp propio» (`lib/ayuda/faq.ts:209`).

**Reserva online** (`app/(public)/book/`, hoy; incluida desde Crece, en Básico es un complemento de Bs 150 que se pide por WhatsApp y alguien activa a mano)
- Elegir profesional · OK [T] · Fecha y horario (con «Reintentar» y «Cambiar») · OK [T]
- «Tus datos» (nombre, teléfono, correo, motivo) + reservar → crea la cita **pendiente** (`app/api/booking/appointments/route.ts:332`) · OK [T]
- «Ver mis citas» / «Agendar otra» · OK [C]
- Página de confirmación: «Confirmar asistencia» · OK [C] · «Cancelar cita» (doble confirmación) · OK [C] · WhatsApp / llamar / «Mis citas» · OK [C]
- «Mis citas»: cancelar / «Reservar otra» · OK [C]
- Depende de que cada profesional tenga sus horarios cargados (Configuración → Horarios).

**Confirmar desde el correo** (`app/cita/page.tsx`, hoy)
- Botón «Confirmar» / «Cancelar» → responde la cita. Abrir el link no cambia nada, así un antivirus de correo no puede cancelarla sin querer · OK [T]
- Llamar al negocio · OK [C]

**No existe (se preguntó):** portal del paciente, donde vería su historia, sus pagos o su plan. Lo más parecido es «Mis citas» por link y el portal de Requerimientos.

**Lo que falta para que dental esté completo**

| Falta | Gravedad |
|---|---|
| Botones «Confirmar» y «No asistió» en Citas, Agenda de hoy e Inicio | Alta |
| Recordatorio por WhatsApp probado con un número real de clínica | Alta |
| Factura SIAT | Alta |
| Publicar la 1.0 (plan de tratamiento, ficha con pestañas, «Lo que te dejó Onia», agente «Reprograma») | Alta |
| Presupuesto formal con total, descuento, PDF y aceptación del paciente | Media |
| Borrar paciente, editar insumo, editar receta (las funciones existen, faltan los botones) | Media |
| Periodontograma, ortodoncia, radiografías | Media |
| Consentimiento firmado dentro de la ficha (hoy la firma solo existe en Requerimientos) | Baja |

### 2.2 Estética y spa

**Menú:** el mismo de dental. Solo cambia «Pacientes» por «Clientas»; «Tratamientos» queda igual (`lib/platform/vertical-pack.ts:616-624`). Los botones son los de 2.1, con estas diferencias:

| Módulo | Diferencia con dental | Funciona | Publicado |
|---|---|---|---|
| Clientas, ficha, citas, agenda, cobros, recurrentes, reportes, tratamientos, inventario, recetas, avisos, reserva online | Iguales a 2.1 | igual a 2.1 | Hoy (salvo lo marcado «solo 1.0» en 2.1) |
| Odontograma | No existe: la ruta te devuelve a la ficha (`odontogram/page.tsx:43-44`) | [E] | Hoy |
| Recetas | El campo dice «Doctor» (`PrescriptionsClient.tsx:134`) | [C] | Hoy |
| Plan de tratamiento + agente «tratamiento a medias» | Es el titular de la web de estética | [T] | **Solo 1.0** |
| Mi plan (Configuración) | Muestra las tarjetas de planes de comercio en lugar de las clínicas (`settings/page.tsx:40`; `PlanClient.tsx:763-766`) | [C] | Hoy · Dudoso |
| Cuenta de demostración | Nace vacía, sin datos de ejemplo (`lib/platform/demo-provisioning.ts:87`) | [C] | Hoy · Dudoso |

**Promesa y realidad:** la web dice «la clienta que dejó el tratamiento a medias… te queda el mensaje escrito con tu link» (`web:src/app/(sitio)/switcher.tsx:70`). Eso depende del plan de tratamiento y del agente de tratamientos a medias, que son solo 1.0 (`lib/onia-core/modules/agents-tratamiento-a-medias.ts` no existe en `c3b92067`). **Hoy producción no lo entrega.**

**Lo que falta para que estética esté completo**

| Falta | Gravedad |
|---|---|
| Publicar la 1.0, o cambiar el titular de la web hasta publicarla | Alta |
| Paquetes, bonos o sesiones prepagadas (no existe nada) | Alta |
| Confirmar y «No asistió» (igual que dental) | Alta |
| Fotos antes/después, comisión por profesional, cabinas o salas en la agenda | Media |
| Datos de ejemplo para la demo | Media |
| «Doctor» → «Profesional» en recetas; tarjetas de plan clínicas | Baja |

### 2.3 Servicios profesionales (contadores, estudios, consultores)

**Menú del dueño:** fijos: Panel, Conversaciones, Clientes, Agenda de hoy, Citas. **Operación:** Servicios, Caja. **Dinero:** Por cobrar, Contabilidad, Planilla, Empresa. **Automatización:** Agentes, Requerimientos. **Sistema:** Equipo, Mi web, Configuración, Ayuda (`vertical-pack.ts:426-461`). No hay rol «Profesional»: solo Administrador y Personal. **No tiene** Reportes, Recurrentes, Avisos, Recetas ni Odontograma.

| Módulo | Para qué sirve | Cómo se llega | Funciona | Publicado |
|---|---|---|---|---|
| Inicio | **Es el panel de mostrador de comercio**: cobrado hoy, lo más vendido, quién debe. No muestra ninguna cita | Entrada (0 clics) | [C]/[T] | Hoy (con botón «Nueva venta»); en 1.0 el botón dice «Nuevo cobro» y está rediseñado |
| Agenda de hoy, Citas | Igual que dental (2.1) | Bloque fijo (1 clic) | [E] crear cita | Hoy |
| Clientes y ficha | Igual que dental, pero la ficha solo tiene «Agendar», Citas y Notas: sin cobros ni saldo | Bloque fijo (1 clic) | [E] | Hoy (pestañas solo 1.0) |
| Servicios | Lista de servicios con precio | Operación → Servicios (1) | Crear [C]; editar [X] | Hoy |
| Caja | Cobrar servicios, fiar, corte, recibo | Operación → Caja (1) o «Nuevo cobro» | [E] | Hoy |
| Por cobrar | Quién te debe y a quién le debés | Dinero → Por cobrar (2) | [T] | Hoy |
| Empresa, Contabilidad, Planilla, Agentes, Requerimientos | Comunes | Ver sección 3 | ver 3 | ver 3 |

**Inicio** (`app/(dashboard)/dashboard/comercio-hoy.tsx`; en producción ya existe con «Nueva venta», `git show c3b92067:...comercio-hoy.tsx:279-280`)
- «Nuevo cobro» → Caja (`:409`) · OK [C]
- «Cobrado hoy» → total del día con gráfico de 7 días, lleva a Caja (`:452-466`) · OK [C]
- «Corte de caja» → corte dentro de la caja (`:380,391`) · OK [C]
- «Por cobrar» → lista de quién debe (`:499`) · OK [C]
- «Lo más vendido hoy» (solo lectura) · OK [T]
- Propuestas de agentes → Pendientes · OK [C]
- «Lo que te dejó Onia» (`:568`) · OK [C] · Solo 1.0
- **Por qué pasa:** la regla que elige el panel mira si el rubro tiene la caja en su lista (`vertical-pack.ts:483, 633-635`; `dashboard/page.tsx:92-95`) · Roto (también en producción)

**Agenda de hoy, Citas, Clientes y ficha:** los botones son los de 2.1, con estas diferencias:
- El motivo de la cita sale del catálogo de servicios.
- El vocabulario dice «reunión» y «Responsable», pero la pantalla dice «Citas» y «Nueva cita» (texto fijo).
- **Solo el administrador puede tener agenda** (`lib/agenda/roles-agenda.ts:22`). El otro rol, «Personal», no recibe citas. Y hacer administrador a un segundo profesional solo se puede en los planes Completo y Empresa (`lib/subscription/coadministradores.ts:34-35`; `lib/plan-catalogo.ts`): **en Básico, Crece y Profesional, un estudio de 2 o más personas solo puede darle agenda al dueño** · Roto
- La ficha no tiene «Cobrar» ni pestaña de cobros (`patients/[id]/page.tsx:66`), y la caja no asocia el cobro al cliente salvo que sea fiado (`lib/comercio/ventas.ts:110-151`).

**Servicios / catálogo** (`app/(dashboard)/comercio/`, modo servicio)
- «Nuevo servicio» → formulario sin SKU ni stock (`NewProductForm.tsx:75`) · OK [C]
- Anterior / Siguiente (`comercio/page.tsx:174-192`) · OK [C]
- **Editar precio, renombrar o desactivar un servicio → NO EXISTE.** La función solo permite listar y crear (`app/api/comercio/products/route.ts:49,83`), y la importación rechaza un código repetido (`lib/comercio/import-productos.ts:182`). Un estudio no puede subir su tarifa ni corregir un error de tipeo · No existe [X]
- Importar servicios por CSV (`/comercio/importar`) y las pantallas de clientes e inventario de comercio **se abren escribiendo la dirección, pero no tienen enlace** en el menú de servicios.

**Caja:** los mismos botones que la caja de comercio (2.4), recorrida por el robot para servicios (`e2e/v1/cinco-rubros.spec.ts`, cobrarCaja) · OK [E]

**Por cobrar** (`/comercio/fiados`)
- Registrar abono (`AbonoForm.tsx:35`) · OK [T]
- Registrar compra a crédito (`CompraForm.tsx:39`) · OK [T]
- Pagar compra (`PagoCompraForm.tsx:32`) · OK [C]
- El menú dice «Por cobrar», pero la pantalla también tiene lo que el negocio le debe a proveedores.

**Buscador del encabezado:** dice «Buscar clientes...» pero busca en el catálogo de servicios (`components/layout/Header.tsx:30-38`) · Roto (también en producción)

**Lo que falta para que servicios esté completo**

| Falta | Gravedad |
|---|---|
| Inicio con la agenda y las citas del día (hoy es el mostrador) | Alta |
| Que el personal pueda tener agenda en todos los planes | Alta |
| Editar, renombrar y desactivar un servicio | Alta |
| Que el cobro de caja quede en la ficha del cliente, con saldo | Alta |
| Factura SIAT (un contador la necesita) | Alta |
| Buscador que busque clientes | Media |
| Igualas mensuales (Recurrentes) y Reportes en el menú | Media |
| Expedientes o casos con estado y horas facturables | Media |
| Datos de ejemplo en la demo (`demo-provisioning.ts:114`) | Media |
| «Citas» → «Reuniones» según el vocabulario | Baja |

### 2.4 Comercio / tienda

**Menú (escritorio):** Panel, Conversaciones, Catálogo, Inventario y Caja a 1 clic. Dentro del grupo **Dinero** (arranca cerrado): Fiados, Clientes, Gastos, Contabilidad y Planilla. **Automatización:** Agentes, Requerimientos. **Sistema:** Equipo, Mi web, Configuración, Ayuda.
**Barra del celular:** en 1.0 es Inicio · Ventas · [Asistente] · Clientes · Más (`barra-inferior.ts:21-28`); en producción, la barra tiene Catálogo, Inventario y Caja.

| Módulo | Para qué sirve | Cómo se llega | Funciona | Publicado |
|---|---|---|---|---|
| Panel «Hoy» | Cobrado hoy vs la semana pasada, métodos de pago, ticket promedio, margen, hora pico, corte, fiado, lo más vendido, lo que se agota | Entrada (0) | [T] | Hoy (rediseño solo 1.0) |
| Catálogo | Lista y alta de productos | Menú (1); celular 1.0: Más (2) | Alta [E]; editar [X] | Hoy |
| Importar catálogo | Carga masiva por CSV | Botón «+» (2); celular 1.0: Más (2). No está en el menú | [T] | Hoy |
| Inventario | Stock valorado, lotes y vencimientos, almacenes, traspasos, movimientos | Menú (1); celular 1.0: Más (2) | Lectura [T]; sumar stock [X] | Hoy |
| Caja + recibo | Vender con ticket, cobrar o fiar, anular, corte | Menú (1); celular 1.0: «Ventas» (1) | [E] | Hoy |
| Fiados + compras a crédito | Quién te debe y a quién le debés | Dinero → Fiados (2) | [T] | Hoy |
| Clientes | Lista con teléfono y deuda | Dinero → Clientes (2); celular 1.0: barra (1) | [T] | Hoy |
| Conversaciones, Agentes, Pendientes, Requerimientos, Gastos, Contabilidad, Planilla, Equipo, Mi web, Configuración | Comunes | Ver sección 3 | ver 3 | ver 3 |
| Reportes | **No existen para este rubro**: escribir la dirección te devuelve al panel. Lo único es el ZIP de planillas en Configuración | Configuración → Descargar planillas | [E] | Hoy |

**Panel «Hoy»** (`app/(dashboard)/dashboard/comercio-hoy.tsx`)
- «Nueva venta» → Caja (`:409`) · OK [T]
- «Cobrado hoy» → Caja (`:454`) · OK [T]
- «Hacer corte» / «Revisar» → corte de caja (`:380-393`) · OK [T]
- «Ver fiados y cobrar →» (solo si hay fiado pendiente) (`:499-501`) · OK [T]
- «Ver inventario →» en la tarjeta «Por agotarse»; se calcula por ritmo de venta, no por un mínimo (`:562-564`; `lib/comercio/hoy.ts:281`) · OK [T]
- «Revisar y aprobar» / «Ver pendientes» (solo si hay propuestas) → Pendientes · OK [T]
- «Lo que te dejó Onia» → configurar el asistente (`lo-que-te-dejo.tsx:74`) · OK [T] · Solo 1.0
- Botón «+»: «Nuevo producto» / «Corte de caja» / «Importar catálogo» (`vertical-pack.ts:292-297`) · OK [T]. En la 1.0 el «+» es solo de escritorio; en el celular estas acciones pasan a «Más».
- Muestra solo hoy y 7 días: no hay historial de ventas.

**Catálogo** (`app/(dashboard)/comercio/`)
- «Nuevo producto» / «Cerrar» · OK [E]/[C]
- «Guardar producto» (nombre, precio, SKU obligatorio, unidad, stock inicial, costo unitario, vence, lote) → crea el producto y, si tiene stock inicial, lo registra como compra en el almacén principal (`NewProductForm.tsx:75`) · OK [E]
- Anterior / Siguiente (páginas de 50) · OK [C]
- Buscar → solo desde el buscador del encabezado en escritorio; la pantalla no tiene su propio campo · Dudoso [C]
- **Editar producto, cambiar precio o borrarlo → NO EXISTE** (`app/api/comercio/products/route.ts:49,83`, solo listar y crear) · No existe [X]

**Importar catálogo** (`/comercio/importar`, `ImportarCatalogo.tsx`)
- Arrastrar, elegir o pegar archivos CSV (hasta 20 MB) · OK (el robot prueba la pantalla sobre un banco de pruebas y no escribe en la base [E]; el importador tiene test [T])
- «Importar» / «Reintentar» por archivo → manda en tandas de 2.000 filas y muestra cuántos entraron y qué filas quedaron afuera (`:167`) · OK [T]
- Nombre del archivo → abre los errores y el mapeo de columnas · OK
- X (quitar archivo) · OK · «Ver el catálogo» · OK [C] · «Limpiar» · OK [C] · «Descargar CSV de ejemplo» · OK [C]
- Solo CSV (no Excel). **Solo altas:** un SKU que ya existe se rechaza, así que no sirve para actualizar precios ni stock. No hay columna de mínimo.

**Inventario** (`app/(dashboard)/comercio/inventario/`)
- **Entrada de mercadería, ajuste, conteo o merma → NO EXISTE en pantalla.** La función existe (`app/api/comercio/movements/route.ts:69`), pero ninguna pantalla la usa. La única forma de tener stock es cargarlo al crear el producto o importarlo · No existe [X]
- «Nuevo almacén» → «Crear almacén» (nombre, dirección) (`almacenes-panel.tsx:50`) · OK [C]. No se puede renombrar ni borrar un almacén.
- «Traspasar mercadería» → sale de / entra a / producto / cantidad → «Traspasar» · OK [T]
- Anterior / Siguiente · OK [C]
- Vencimientos (lectura: lotes vencidos y por vencer, unidades, plata en riesgo) · OK [T]
- Últimos movimientos (lectura; el tipo aparece crudo, «COMPRA» o «VENTA») · OK [T]
- La caja vende siempre del almacén principal: el segundo almacén solo recibe por traspaso.

**Caja** (`app/(dashboard)/comercio/caja/`)
- Producto (buscar por nombre o SKU) + cantidad + «Agregá al ticket» · OK [E]
- «Quitar» línea · OK [C]
- Método de pago: Efectivo / QR / Tarjeta / Transferencia / Fiado · OK [E] (el robot probó efectivo)
- Datos del fiado: cliente, teléfono, vence (opcional), anticipo + método · OK [T]. **Si no se carga «Vence», el agente de cobros nunca lo reclama** (`agents-runtime.ts:528`).
- «Cobrar» / «Fiar» → registra la venta y descuenta el stock · OK [E] (en producción hay 1 venta del 18-sep)
- «Imprimir recibo» → «RECIBO DE PAGO», no factura · OK [T]
- Totales del día por método (hora de La Paz) · OK [T]
- «Recibo» en cada fila → reimprime (solo ventas de hoy) · OK [E]
- «Anular» → «Sí, anulá» / «No» → devuelve el stock y saca la plata del día · OK [T]. Cualquier empleado puede anular, y no revisa si el plan venció (`app/api/comercio/ventas/anular/route.ts:17-30`).
- «Guardar corte» / «Rehacer el corte» (efectivo contado, notas) · Dudoso [T]: con el campo vacío parece guardar Bs 0 contados (`CorteForm.tsx:23-24`; deducido del código, no probado).
- No pide NIT ni razón social del comprador. No tiene descuentos, precio manual, elección de almacén ni historial de días anteriores.

**Fiados** (`/comercio/fiados`)
- Tarjetas: en la calle, clientes que deben, vencido, por pagar a proveedores · OK [T]
- «Abonar» (monto + efectivo, QR o transferencia) · OK [T]. Sin recibo y sin tarjeta.
- «Registrar compra a crédito» (proveedor, NIT, número de factura, total, vence). Con factura suma crédito fiscal · OK [T]. **No suma stock.**
- «Pagar» cada compra · OK [T]
- No hay módulos de «Compras» ni «Proveedores».

**Clientes** (`/comercio/clientes`)
- «Nuevo cliente» (nombre, teléfono); si el teléfono ya existe, avisa · OK [T]
- Teléfono → llama · OK [C]
- Monto que debe → Fiados (la lista general, no la de ese cliente) · Dudoso [T]
- «Ir a la caja» (lista vacía) · OK [C]
- No se puede buscar, editar ni borrar un cliente, ni cargarle NIT o correo. Exportarlos sí: el ZIP de Configuración trae `Clientes.csv` con todos (`lib/export/datos-negocio.ts:427-431,631-643`).

**Lo que falta para que comercio esté completo**

| Falta | Gravedad |
|---|---|
| Editar y borrar producto, cambiar precio | Alta |
| Entrada de mercadería, ajuste, conteo y merma (la función ya existe, falta la pantalla) | Alta |
| Compra a proveedor que sume stock, más lista y ficha de proveedores | Alta |
| Mínimo de stock por producto (en el formulario y en el CSV), para que funcione «Avisa stock bajo» | Alta |
| Factura desde la caja con NIT del comprador | Alta |
| Historial de ventas con reimpresión y anulación, y reportes por período, producto y vendedor | Media |
| Buscador en el catálogo, en el celular y en clientes | Media |
| Descuento, precio manual y elegir almacén en la caja | Media |
| Importar desde Excel y actualizar productos existentes por CSV | Media |
| Editar, borrar y buscar clientes; NIT e historial de compras | Media |
| Recibo del abono y abono con tarjeta | Baja |

### 2.5 Importadora / distribuidora

**Menú (escritorio):** Panel, Cotizaciones y Catálogo fijos. **Operación** (abierto): Inventario, Costeo de importación, Alerta de reprecio. **Dinero** (cerrado): Ventas (es la caja), Créditos (son los fiados), Clientes, Gastos, Contabilidad, Planilla. Más Automatización y Sistema como en comercio.
**Barra del celular:** en 1.0 es Inicio · Ventas · [Asistente] · Clientes · Más, así que **Cotizaciones, Costeo y Catálogo quedan dentro de «Más»** (`barra-inferior.ts:21-25`). En producción, la barra tiene Cotizaciones y Costeo.

| Módulo | Para qué sirve | Cómo se llega | Funciona | Publicado |
|---|---|---|---|---|
| Panel «Hoy» | Cotizaciones del mes por estado, últimos costeos con costo, precio y margen | Entrada (0) | [T] | Hoy |
| Cotizaciones | Armar y llevar cotizaciones: borrador → enviada → aceptada → pedido | Menú (1); celular 1.0: Más (2) | [E]; el pedido [X] | Hoy |
| Costeo de importación | Del precio de origen (FOB) al costo puesto en almacén, con tipo de cambio del BCB y reparto de gastos | Operación (1) | [E] | Hoy |
| Alerta de reprecio | Qué productos se venden bajo costo con el tipo de cambio de hoy | Operación (1) | [E] | Hoy |
| Catálogo, Importar, Inventario, Ventas, Créditos, Clientes | Igual que comercio (2.4) | ver 2.4 | ver 2.4 | Hoy |

**Panel «Hoy»** (`app/(dashboard)/dashboard/importadora-hoy.tsx`)
- «Nueva cotización» (`:60`) · OK [T]
- Fila de cotización reciente / «Ver cotizaciones» → abre la lista, no esa cotización (no hay pantalla de detalle) · Dudoso [T]
- Fila de costeo / «Nuevo costeo» · OK [T]
- «+»: Nuevo costeo / Nuevo producto / Importar catálogo · OK [T]
- «Lo que te dejó Onia» + «Activá el asistente →» (`:199`) · OK [C] · Solo 1.0
- **No muestra las propuestas de los agentes ni tiene enlace a Pendientes:** lo que proponen «Sigue cotizaciones» o «Recuerda cobros» solo se ve por la campana, desde Agentes o escribiendo la dirección.
- Textos con paréntesis, «cotización(es)» y «Borrador(es)» (`:57,77,97`).

**Cotizaciones** (`app/(dashboard)/importadora/cotizaciones/`)
- «Nueva cotización» / «Cerrar» · OK [E]
- Cliente empresa (solo texto), validez en días, producto (solo los que tienen precio), cantidad, «Agregar línea», quitar, «Crear cotización». El precio lo pone el sistema · OK [E]
- «Marcar como enviada» → **solo cambia el estado; no manda nada** (ni correo, ni PDF, ni WhatsApp) · OK [E]
- «Aceptar» / «Rechazar» · OK [E]/[T]
- **«Convertir en pedido» → crea un pedido en borrador que no aparece en ninguna pantalla,** no descuenta stock y no crea venta ni deuda (`lib/importadora/cotizaciones.ts:219-310`) · Roto
- No hay forma de ver el detalle de una cotización, editarla, duplicarla, imprimirla ni mandarla. Tampoco hay descuento en pantalla (la función lo acepta), teléfono ni NIT del cliente, cotización en dólares, filtros ni búsqueda.

**Costeo de importación** (`app/(dashboard)/importadora/costeo/CosteoForm.tsx`)
- Gastos del embarque (flete, seguro, carga/descarga, despacho, almacenaje, transporte interno, en USD) + «TCO del día BCB» → el cálculo se hace en vivo · OK [E]
- «Repartir los gastos por» Valor / Peso / Volumen · OK [T]
- «+ Agregar línea» / «Quitar» (descripción, FOB, cantidad, GA, peso, volumen, precio de venta, producto del catálogo) · OK [E]
- «Aplicar al catálogo (n)» → guarda el costo en cada producto y, si pusiste precio de venta, lo actualiza (`:528`; `lib/importadora/costeo.ts:298-384`) · OK [E]. **No ingresa la mercadería al stock, no crea lote, no registra la compra ni la deuda con el proveedor y no pasa el IVA de importación al libro de compras** (la función para eso existe sin usarse: `lib/onia-core/modules/imports-logic.ts:566`). Solo guarda el último costo, sin historial de embarques. Es la única forma de cambiarle el precio a un producto que ya existe.

**Alerta de reprecio** (`/importadora/reprecio`)
- TCO de hoy + «Ver alerta» · OK [E]
- Enlace «Costeo de importación» · OK [C]
- Solo lectura: para repreciar hay que rehacer el costeo.

**Clientes:** los clientes empresa de las cotizaciones **no aparecen** en la pantalla Clientes (`lib/importadora/cotizaciones.ts:109-113` vs `lib/comercio/clientes.ts:85`). Sí salen en el `Clientes.csv` del ZIP.

**Producción:** la única importadora tiene la prueba vencida desde el 14-sep, 0 productos y 0 cotizaciones; sus agentes corrieron por última vez el 15-sep.

**Promesa y realidad:** la web dice «Sabés cuánto te costó cada lote puesto en depósito» (`web:src/app/(sitio)/rubros/page.tsx:87`) y en el inicio «Productos, lotes y costos» (`web:.../page.tsx:91`). **El costo es por producto (el último embarque), no por lote, y no entra al depósito.** Hay que corregir la web antes de pagar publicidad.

**Lo que falta para que importadora esté completa**

| Falta | Gravedad |
|---|---|
| Cotización imprimible o en PDF y envío por WhatsApp o correo; ver, editar y duplicar; datos y NIT del cliente | Alta |
| Teléfono del cliente en la cotización (sin eso «Sigue cotizaciones» no puede enviar nada) | Alta |
| El pedido: pantalla de pedidos, entrega que descuente stock y venta o deuda | Alta |
| Que el costeo ingrese la mercadería con lote, registre la compra y pase el IVA de importación al libro | Alta |
| Cotizar en USD | Media |
| Clientes empresa visibles en Clientes | Media |
| Repreciar en lote desde la alerta | Media |
| Historial de embarques costeados | Baja |

### 2.6 Rubros encendidos que no se venden

- **Ganadero:** es el comercio con palabras de estancia (compradores, «Buscar hacienda...»). No existen los animales como registro (sanidad, pesajes) ni el modo sin conexión que promete su nombre (`public/sw.js` solo maneja notificaciones). El catálogo prohíbe venderlo (`hermes:docs/ONIA_CATALOGO_DE_VENTA.md:69`). No hay ninguna cuenta con este rubro.
- **Veterinaria:** es el menú dental con otras palabras, sin odontograma. La factura sale a nombre del paciente, es decir del animal: no se le puede facturar al dueño (`lib/platform/rubros-activos.ts:43-49`). No hay ninguna cuenta con este rubro.

---

## 3. Lo transversal

### 3.1 Alta de cuenta (`/register`)
Se llega desde los botones de onia.com.bo o desde «Creá tu cuenta · 14 días gratis» en el login. En producción el alta está **abierta** (`ONIA_ALTA_AUTOMATICA=abierta`) y pide confirmar el correo (`ONIA_REGISTRO_CONFIRMA_CORREO=si`).
- Tarjeta de rubro (5 opciones) · OK [E]
- «¿Otro rubro?» → WhatsApp de Onia · OK [C] · «Cambiar rubro» · OK [C]
- «Continuar con Google» · Apagado (oculto por configuración; `lib/auth-providers.ts:19`)
- Campos: tu nombre, correo, contraseña (con el ojo para verla), nombre del negocio, **«¿Cómo nos conociste?»** (Google, Facebook/Instagram, WhatsApp, Recomendación, YouTube, Otro), casilla de novedades (`SignupForm.tsx:516-589`) · OK [T]. **Esa pregunta es la única forma de saber de dónde viene un cliente.**
- «Crear mi cuenta · 14 días gratis» → crea el usuario y el negocio con 14 días de prueba (plan Profesional, con agentes) y manda el correo de bienvenida (`app/api/auth/register/route.ts:299-384`) · OK [E]
- «Verificá tu correo» → «Ir a iniciar sesión» / «Volver a la landing» · OK [C]
- Chip del plan elegido (si vino de la web con `?plan=`) · OK [T] · Solo 1.0
- Términos / Privacidad / Iniciá sesión · OK [C]
- **No te avisa cuando alguien se registra:** solo se manda la bienvenida al cliente.

### 3.2 Configuración inicial del negocio (`/onboarding`)
Aparece sola al dueño que todavía no la completó (`app/(dashboard)/layout.tsx:111-113`).
- Pregunta inicial: «Buscar mi negocio» / «Traer mis datos» (con un link o el nombre) → lee la web del negocio **sin IA** · Dudoso [T]. En producción no están los servicios que leen webs modernas ni el que busca por nombre (Crawl4AI y SearXNG): las webs hechas con Wix u otras parecidas casi no se leen, y la búsqueda por nombre no funciona.
- «Completar el formulario» → carga manual · OK [E]
- Paso Negocio (nombre, dirección, ciudad…) + «Continuar» · OK [E]
- «Saltar por ahora, lo cargo después» (en los pasos siguientes) · OK [T] · Atrás / Continuar · OK [T]
- Horarios: agregar día, quitar tramo, agregar tramo · OK [T]
- Servicios: agregar nombre y precio, quitar · OK [E]
- Equipo: rol, nombre, correo opcional → «Terminar» · OK [T]. El rol «Administrador» solo aparece en los planes Completo y Empresa: en la prueba no está.
- Listo: próxima acción / **«Activar el plan X»** (solo si vino de la web con un plan elegido; solo 1.0) / «Ir al panel» · OK [T]

### 3.3 Asistente de puesta en marcha (`/setup`)
Solo se llega desde «Terminá la configuración» en el Inicio clínico. Comercio, importadora y servicios no tienen enlace.
- Agregar / quitar canal · OK [T] · Atrás / Siguiente / Guardar · OK [T]
- Te avisa por Telegram **solo si el cliente marca que necesita ayuda para cargar sus datos** (`lib/onia-core/onboarding.ts:260-291`).
- «Ir al panel» / «Ver pendientes» · OK [C]

### 3.4 Entrar, recuperar la clave y verificación en dos pasos
- «Iniciar sesión» (bloquea tras varios intentos fallidos) · OK [T]
- «Olvidé mi contraseña» → «Enviar enlace» · OK [T] · «Nueva contraseña» → «Guardar» · OK [C]
- «Reenviar el correo de confirmación» · OK [C] · Google · Apagado
- Mi perfil (`/profile`; escritorio: pie del menú, 1 clic; celular: Más, 2): nombre y contraseña → «Guardar» · OK [C]; apariencia Claro / Oscuro / Sistema · OK [C]
- Verificación en dos pasos: activar → escanear el QR → código → «Verificar»; copiar o regenerar los códigos de respaldo; desactivar · OK [T]. Pantalla `/login/2fa`: «Verificar» / «Usar código de respaldo» / «Salir» · OK [T]
- **Solo es obligatoria para vos (superadministrador)** (`lib/mfa/policy.ts:25`). El dueño de un negocio puede activarla, pero nadie lo obliga, y no le pone trabas al momento de pagar.

### 3.5 Configuración (`/settings`)
Escritorio: Sistema → Configuración (2 clics). Celular: Más → Configuración (2), y cada sección es una pestaña (3).
- Secciones 01 a 06 (al costado en escritorio, pestañas en celular) · OK [T]
- **Negocio:** nombre, teléfono, NIT, dirección, correo, link de Google Maps → «Guardar» · OK [T]
- **QR de cobro** (subir imagen o pegar link): el QR con el que el negocio le cobra a sus clientes · OK [T]. **En comercio e importadora no lo usa nadie:** la caja no lo muestra y el recibo no lo trae. Solo lo usan la factura clínica y su impresión.
- **Equipo:** agregar (nombre, correo, contraseña inicial, qué puede hacer) / crear / cancelar / quitar · OK [T]
- **Horarios:** horario de atención, profesionales y sus tramos → «Guardar horarios» · OK [T]. Los horarios por profesional no están en comercio.
- **Avisos automáticos:** interruptor de los correos a clientes · OK [C]. No está en comercio.
- **Perfil y seguridad:** accesos y sesiones → cerrar la sesión de un dispositivo · OK [T]; «Mi perfil»; «Administración de ONIA» (solo vos) · OK [C]
- **Acceso para desarrolladores:** claves de API → crear / copiar / revocar (solo si el rubro y el plan lo traen) · OK [T]
- **No existe:** una pantalla para conectar la pasarela de pago del cliente. La función está (`app/api/gateway-config/route.ts:46-86`, pagosnet y circle), pero nadie la usa · No existe [X]

### 3.6 Tu plan y tus datos
Sistema → Configuración → «Tu plan y tus datos» (3 clics).
- Mensual / Anual · OK [T]
- «Contratar» / «Renovar» / «Ir al checkout» · OK [E]
- «Hablar con un asesor» / «Contratar por WhatsApp» · OK [C] · «Ver detalle del plan» · OK [C]
- «Agente conversacional» (complemento) → pantalla para contratarlo · OK [C]
- «Agenda pública», «Servidor dedicado», «Usuarios extra» → se piden por WhatsApp y se activan a mano; «Ver mi agenda» abre el link público · OK [C]
- «Configurar el agente conversacional» · OK [C]
- «Descargar planillas» → ZIP con todas las planillas del negocio · OK [E]
- **«Ver mi plan» de la franja inferior:** en producción y en la versión auditada abre Configuración en «Negocio», no el plan. **Arreglado hoy en el candidato** (`164879f9`: ahora va a `/settings#plan`). La franja solo está en escritorio.
- En estética y servicios se ven las tarjetas de planes de comercio (ver 2.2) · Dudoso

### 3.7 Equipo, roles y quién aprueba (`/team`)
Sistema → Equipo (2 clics; en dental solo para el rol Administrador). Los roles finos están en «Roles»: en el celular es un ícono sin texto (`team/page.tsx:69`).
- «Invitar» → por correo o creando la contraseña · OK [T]. Los roles que se ofrecen dependen del plan: Administrador solo en Completo y Empresa.
- Ficha del usuario: «Guardar rol» / «Eliminar» · OK [T]
- Roles: casilla por persona y rol · OK [T]. **Estos permisos no alcanzan a Caja, Catálogo, Fiados ni Cotizaciones:** ninguna de esas funciones los revisa. Un empleado puede anular ventas, importar el catálogo o cargar compras aunque le «saques» el permiso.
- Quién aprueba: confirmar, rechazar o elegir (solo en Completo y Empresa) · OK [T]
- Hay dos lugares distintos para manejar usuarios: Configuración → Equipo y `/team`.

### 3.8 Agente conversacional de WhatsApp y web (`/settings/chatbot`, complemento de Bs 390)
Camino: Sistema → Configuración → Tu plan y tus datos → «Configurar el agente conversacional» (**4 clics, fuera del menú**). Atajo: Conversaciones → «Configurar mi asistente», solo si no hay canal.
- Pestañas 01 Datos básicos / 02 Respuestas / 03 Afinar · OK [C]
- Campos: cómo se llama el negocio, a quién deriva, cómo se presenta, días (L a D), abre y cierra, cómo dice el horario, seguimiento (interruptor + horas), cita (duración, modalidad), rubros o servicios (agregar y quitar) · OK [T]
- «Publicar» → el agente usa la versión nueva en unos minutos · OK [T]
- «Responder 6 preguntas» → te arma el formulario, **sin IA** · OK [T]
- «Probá tu agente» (preguntas de ejemplo, opciones, enviar) → contesta con el borrador sin publicar. **Sin IA:** usa el mismo motor que atiende a tus clientes, que responde por guion (`hermes:deploy/vps-ops/bot/preview-route.mjs`) · OK [T]
- «Enseñale conversando» (ideas, Proponer, Aplicar, Descartar) → escribís el cambio en castellano, **la IA (gpt-4.1-mini) propone el texto nuevo** y te muestra la diferencia · OK [T]
- Canal web: Encender / Apagar / Copiar el código del chat / Contratar · OK [T]
- Tu WhatsApp: «Conectar mi WhatsApp» (alta con Meta) / Reintentar plantilla / Ver conversaciones / Desconectar / Contratar · Dudoso [T]: **nunca se conectó el número real de un cliente.**
- Facebook / Instagram · Apagado (falta `META_PAGES_PUBLIC` en producción)
- Cupo: «Recargar» (por WhatsApp; la recarga la aplicás vos a mano) / Volver · OK [C]
- «Cómo le va» → qué hizo el asistente esta semana (con el complemento activo) · OK [C]
- El campo «campañas» (una frase exacta de un anuncio → una respuesta) existe en el motor, pero **no está en el formulario**: solo se carga con «Enseñale conversando». Esto importa para anuncios que llevan a WhatsApp.

**Contratar el agente** (`/settings/addon-chatbot`): elegir forma de pago · OK [T]; subir el comprobante + nombre, negocio, teléfono, banco → «Enviar comprobante» · OK [T] (se activa cuando vos lo aprobás); dudas / configurar / ver conversaciones · OK [C]. En los planes Completo y Empresa dice «Sin costo extra».

### 3.9 Pagar el plan (`/checkout`)
Planes: Básico 320, Crece 550, Profesional 890 y Completo 1.290 Bs al mes (`lib/subscription-plans.ts:39-45`).
- Semanal / Mensual / Anual · OK [T] · Elegir plan · OK [E]
- «Generar QR para pagar» (QR del BCP por el monto exacto, que activa solo) · Apagado: en producción no están las credenciales del BCP.
- QR fijo de Onia (descargar) + «Copiar monto» · OK [T] (el QR vence el 25/09/2027)
- «¿Dudas con el pago?» / «Pedir los datos por WhatsApp» · OK [C]
- «Subí la captura» + quién paga, CI/NIT, teléfono, negocio, banco, número de transacción → «Enviar comprobante» · OK [E]. Queda pendiente, te llega un correo y el vigía te avisa por Telegram cada 10 min.
- Estado del pago / Reintentar / Volver al panel · OK [T]
- **Pagar no activa el plan: lo activás vos al aprobar** (ver 3.21). El formulario pide 6 datos y una imagen.

### 3.10 Asistente «Preguntá por tu negocio», Ayuda y Guía de inicio
Escritorio: barra de abajo (1 clic o la tecla «/»). Celular 1.0: botón central de la barra. Guía: botón del encabezado (1).
- «Preguntá por tu negocio» (con el contador «N esperando») · OK [E]. **El contador cuenta las decisiones pendientes, pero al tocarlo abre la ayuda, no Pendientes** (`BarraAsistente.tsx:116-127`) · Dudoso
- Escribir la pregunta / enviar / ejemplos → responde con 30 temas escritos a mano y 4 consultas de datos (cuánto te deben, cobrado hoy, citas de hoy, stock bajo), **sin IA** · OK [T]
- **En comercio e importadora, las preguntas de datos buscan en las tablas del dental:** contesta «No tenés nada por cobrar» aunque haya fiados, y manda a pantallas que no existen en ese rubro (`lib/ayuda/datos-query.ts:40-135`) · Roto
- «Ir a la pantalla» · OK [C] (la ayuda no incluye Pendientes, Agentes ni la reserva online) · «Cerrar» · OK
- `/help`: preguntas frecuentes, buscar, limpiar, índice · OK [C]
- Guía de inicio: abrir / pasos con enlace / «¿Tenés una duda? Preguntale al asistente» / «Cerrar por ahora» · OK [C]. **Comercio:** «Cargá el stock inicial → Abrir inventario» manda a una pantalla donde no se puede cargar stock · Roto. **Importadora:** «se descuenta solo con cada salida» es falso para cotizaciones y pedidos (`lib/onboarding/tour-pasos.ts:213-252`).
- Cuando no sabe la respuesta, no ofrece hablar con una persona: `SOPORTE_CONTACTO` no está configurado en producción.

### 3.11 Notificaciones (campana)
- Campana con el número de no leídas → lista de las 30 últimas · OK [C]
- «Marcar todas leídas» · OK [C] · Tocar una → la marca y te lleva · OK [C]
- «Instalar Onia» / activar notificaciones en el teléfono · envío [T], suscribirse [C]
- **No se actualiza sola:** la tabla de avisos no está conectada al tiempo real (medido; `NotificationBell.tsx:36-45`). Hay que recargar la página para ver avisos nuevos · Roto
- Franja inferior (escritorio): cuándo vence el plan + «Ver mi plan»

### 3.12 Pendientes (`/pending`): donde aprobás lo que proponen los agentes
**No está en el menú de ningún rubro.** Se llega desde el Inicio (clínico, comercio y servicios), la campana o una notificación, Agentes → «Ver en Pendientes», o `/setup`. En la importadora, solo por la campana, Agentes o escribiendo la dirección.
- «Aprobar y enviar» / «Aprobar» → si el negocio tiene su WhatsApp conectado, sale solo · Dudoso [T]: hoy ninguno tiene WhatsApp conectado.
- «Enviar yo mismo por WhatsApp» → aprueba y te arma el link para mandarlo desde tu teléfono · OK [T]
- «Rechazar» · OK [T]
- «Abrir WhatsApp con el mensaje» / «Copiar link» · OK [C]; «Ya lo envié» · OK [T] · Solo 1.0
- «Reintentar» (envío fallido) · OK [T] · «Conectá tu WhatsApp» · OK [C]
- Tareas: «Empezar» / «Marcar hecho»; filtros por estado, prioridad y tipo; «Volver al inicio» · OK [C]

### 3.13 Agentes (`/agents`)
Automatización → Agentes (2 clics). Desde el plan Crece; la prueba de 14 días los trae.
- «Este mes» (propuestas, aprobadas, en espera) → Pendientes · OK [T] · Solo 1.0
- Interruptor Activo / Pausado por agente · OK [T] · Solo 1.0 (en producción el estado se ve como texto, sin botón)
- «¿Qué hace?» · OK [C]
- Últimas propuestas → «Abrir WhatsApp» · OK [C] · Solo 1.0
- «Proponer un texto» / «Proponer otro» → **la IA escribe una vez el texto del mensaje, sin ver datos de tus clientes** · OK [P] (hay llamadas registradas)
- «Aprobar este texto» / «Descartar» / «Volver al texto de siempre» · OK [T]
- Corrida diaria a las 07:00 de La Paz · [P]: respondió bien el 27, 28 y 29 de septiembre, con **0 propuestas** (sin datos).
- Los nombres con verbo («Recuerda cobros») son solo 1.0; en producción se llaman «Cobrador», «Reponedor», «Seguidor».

| Agente | Rubros | Qué hace | Estado |
|---|---|---|---|
| Vuelve a citar | Dental, estética, servicios | Propone escribirle a quien no vuelve hace 180 días. En dental y estética, 1.0 prioriza los tratamientos a medias | OK [T] |
| Recuerda cobros | Todos | Clínicas: facturas vencidas. Comercio: fiados vencidos, **solo si al fiar se cargó «Vence»** | OK clínicas; Dudoso comercio |
| Confirma citas | Dental, estética, servicios | Propone confirmar las citas que vienen | OK [T] |
| Reprograma | Dental, estética, servicios (solo 1.0) | Busca faltas… que nadie puede marcar | Roto en la práctica |
| Avisa stock bajo | Comercio, importadora | Necesita el mínimo de stock, que **no se puede cargar en ninguna pantalla** (`agents-runtime.ts:707-712`). No corre en clínicas | Roto |
| Sigue cotizaciones | Importadora | La cotización no guarda teléfono y al aprobar falla con «No hay un teléfono válido» (`lib/onia-core/dispatch/channels.ts:162-166`; deducido del código) | Roto |
| Responde consultas / Captador | Con complemento | Borrador de respuesta a consultas entrantes cada 30 min + tarea; sin pantalla propia (`agents-runtime.ts:159-173`) | [C] |

### 3.14 Conversaciones (`/inbox`)
Fijo en el menú de todos (1 clic), aunque el cliente no haya comprado el complemento: en ese caso muestra una invitación a activarlo.
- Lista (se actualiza cada 15 s) y conversación (cada 5 s) · OK [T]
- «Marcar resuelta» / «Reabrir» · OK [C]
- Responder → el bot se hace a un lado · OK [C]. En WhatsApp no se puede contestar pasadas 24 horas (regla de Meta).
- Adjuntos · OK [C] · «Configurar mi asistente» · OK [C]

### 3.15 Requerimientos (`/requerimientos`) y portal del cliente
Automatización → Requerimientos (2 clics). Sirve para pedirle al cliente documentos, un cuestionario, una firma o un acceso con un link, sin que tenga que crear una cuenta.
- «Nuevo requerimiento» (cliente, tipo, vence, título, detalle) → «Crear» · OK [E]
- «Copiar link del portal» · OK [E] · «Aceptar» / «Rechazar» con motivo · OK [E]
- Portal: subir archivo, cuestionario que se guarda solo, firmar, confirmar acceso · OK [E]
- **En comercio e importadora solo aparecen las personas que llegaron por el chat;** los clientes del fiado y de las cotizaciones no aparecen · Dudoso
- Los ejemplos son de agencia («Logo en alta calidad», «Agreganos a tu Business Manager»), no de una clínica. En la cuenta interna de Onia este módulo se llama «Pendientes», el mismo nombre que la cola de aprobaciones.
- Relacionado: en comercio e importadora, las personas que escriben por el chat se guardan en una tabla que esos rubros no ven en ninguna pantalla ni exportan (`lib/chatbot/contacto-desde-chatwoot.ts:158`). Es un hueco de privacidad; hoy afecta a 0 personas.

### 3.16 Dinero común: Gastos (Empresa), Contabilidad, Planilla
- **Gastos** (en servicios se llama «Empresa»; el menú dice «Gastos» pero la pantalla se titula «Empresa»): nuevo gasto (fecha, categoría, descripción, monto, factura, NIT, proveedor); con factura suma crédito fiscal · OK [T]; eliminar · OK [C]; exportar CSV del mes · OK [C]; colaboradores, «Liquidar comisión del mes», reuniones (link de Cal.com o Calendly) · [T]/[C]: son herramientas de agencia dentro de una clínica o una tienda · Dudoso
- **Contabilidad:** ← mes / mes → · OK [C]; «Descargar» el resumen de IVA e IT (solo Profesional o más) · OK [T]; exportar el registro de ventas · Dudoso [T] (en comercio toma cada pago de caja como si fuera una venta facturada, aunque ninguna tiene factura); exportar compras / «Cargar gasto» · OK [T]; «Configuración» si falta el NIT · OK [C]. Básico y Crece ven solo el resumen del mes y la fecha de vencimiento. **No hay asientos ni libro diario:** el balance es básico y derivado.
- **Planilla:** configuración del salario mínimo, alta y edición de empleados · OK [C]. La lista desde Básico; la planilla del mes y el CSV desde Profesional.

### 3.17 Mi web (`/mi-web`, solo 1.0)
Sistema → Mi web (2 clics), para el dueño de los 5 rubros.
- Nuevo pedido / Continuar borrador / Guardar borrador / Atrás / Continuar / Enviar pedido · OK [T]
- Usar esta selección / Descartar / Quitar / Explorar una vista previa · OK [T]
- Enviar respuesta / Ver web / Abrir mi web · Dudoso [T]: las webs generadas todavía no tienen dónde publicarse.
- No te avisa cuando entra un pedido. Además, es la línea de webs, que no pasa el test de tres preguntas de la estrategia, puesta en el menú de todos los clientes.

### 3.18 Marco de todas las pantallas
- Buscador (escritorio) / lupa (celular) → ver los problemas por rubro · [C]
- Botón «+» con las acciones rápidas del rubro · OK [T]
- Avisos de renovación, solo lectura, baja programada y dos pasos · OK [T]
- Ventana de prueba vencida: «Pagar y reactivar mi plan» / «Contratar por WhatsApp» · OK [C]
- «Mi perfil» / «Cerrar sesión» · OK [C]

### 3.19 Páginas públicas
Reserva online (`/book/...`, ver 2.1), confirmar desde el correo (`/cita`), portal de requerimientos (`/portal/[token]`), impresiones (factura, recibo, recibo de venta, receta), contacto, términos, privacidad y tratamiento de datos. Las pantallas de prueba `/dev/...` dan 404 en producción.

### 3.20 Tareas automáticas del servidor (medidas en el VPS el 29-sep)

| Qué | Cuándo | Estado |
|---|---|---|
| Agentes | Todos los días, 07:00 La Paz | [P] responde bien, 0 propuestas |
| Recordatorios de cita por correo | Cada 15 min | [P] responde bien, 0 citas |
| Cobros recurrentes | Diario | [T] (no se leyó el registro) |
| Tareas del core (cita con falta → seguimiento; factura vencida → cobro; presupuesto con 7 días sin respuesta → seguimiento; aviso de IVA e IT según el NIT) | Diario | [P] responde bien, 0 creadas. La de faltas no puede dispararse nunca |
| Recordatorio de renovación al dueño (7, 3 y 1 día antes) | Diario | [C] |
| Correos de la prueba (días 3, 7, 12, 14 y 15) | 09:00 La Paz | [C] |
| Vigía de comprobantes (Telegram a vos) | Cada 10 min | [C] |
| Control de login, control de pantallas del cliente, parte diario a vos | 5 min / 15 min / diario | [C] |
| **Aviso de alta nueva** | No existe | [X] |

### 3.21 Cómo se administra la venta hoy (tu lado, Sergio Urcullo)

**Dónde entrás:** tu cuenta es superadministrador de la cuenta interna de Onia. Su Inicio ya es un tablero: ingreso recurrente, lo cobrado, «N cobros por revisar», usuarios activos, cuentas por estado y «Pide atención», con botones «Métricas completas» y «Ver todo →» (1 clic a `/admin/metricas`) y «Registrar gasto» (`dashboard/interna-hoy.tsx:148-158,184-195,372-398`). También se llega por Configuración → «Administración de ONIA» (3 clics). No hay ítem «Super Admin» en tu menú.

**Pantallas de administración y sus botones**
- **Clínicas** (`/admin`, la lista de todas las cuentas): «Nueva clínica» → crea **siempre una cuenta dental en plan gratis**; el campo dice «mínimo 6 caracteres» pero el sistema exige 8, y al terminar muestra la contraseña en pantalla · Dudoso [T]; buscar · OK [C]; selector de plan (no toca el vencimiento) · OK [T]; interruptores WA / BK / INV+ (WhatsApp, agenda pública, inventario) · OK [T]; ver agenda pública / detalle / expandir · OK [C]; **eliminar (borra la cuenta entera, sin papelera)** · OK [T]. La tabla no muestra el rubro ni el estado de la prueba.
- **Pagos** (`/admin/payments`): filtros (todos, pendiente, aprobado, rechazado) · OK [C]; «Ver comprobante» (cada vez que abrís la pantalla se genera un link nuevo, así que no vence) · OK [C]; notas + «Aprobar» → activa o renueva el plan, extiende el vencimiento desde la fecha vigente y avisa al dueño · OK [T]; «Rechazar» con motivo · OK [T]. Aprobás mirando una captura, sin verificación con el banco. Dice «Clínica declarada» aunque el cliente sea de otro rubro.
- **Planes** (`/admin/plans`): «Editar» por cuenta → plan, fecha de vencimiento, días de prueba, complementos, usuarios extra, «Dado de baja», «Baja del complemento» → «Guardar» · OK [T]
- **Métricas:** ingresos por mes, cuentas por estado, altas y bajas por mes, por vencer, cobros pendientes · OK [T]. Es la única pantalla que cuenta altas, pero no dice de dónde vinieron.
- **Detalle de una cuenta:** complemento de WhatsApp · OK [T]; «Aplicar recarga» de conversaciones (no registra el cobro) · OK [C]; datos de Meta del cliente (Phone Number ID, token, plantilla) · OK [T]; vincular la bandeja de Chatwoot · OK [T]. **El token de Meta del cliente se manda a tu navegador aunque no haga falta** (`admin/organizations/[id]/page.tsx:36`). Desde acá no podés editar lo que sabe el agente de un cliente.
- **Capacidades** (`/admin/organizations/[id]/capacidades`): otorgar y revocar · OK [T]. **Ninguna pantalla enlaza acá:** hay que escribir la dirección.
- **Solicitudes, Webs, Usuarios, Chatbots, Auditoría, Diseño:** marcar contactado, estados de los pedidos de web, borrar usuarios, estado del motor del bot y «Crear bandeja web», registro de acciones · [T]/[C]
- **No existe «entrar como el cliente»** para darle soporte. Lo más parecido es un script de hermes que saca capturas (`scripts/onia-mirar.js`).

| Tarea | Cómo se hace hoy | Manual o automático | Hueco |
|---|---|---|---|
| Alta de un cliente | Se registra solo en `/register` | Automático | Vos no te enterás; no se sabe de qué anuncio vino |
| Primera configuración | El cliente hace el onboarding solo | Automático | Estética y servicios no tienen demo con datos |
| Cobrar el plan | QR fijo de Onia + comprobante → vos aprobás en Pagos | Manual (con aviso automático) | QR del BCP que activa solo, apagado |
| Renovar | Aviso automático al dueño; paga igual que arriba | Semiautomático | No hay cobro recurrente |
| Cambiar plan, extender la prueba, dar de baja | `/admin/plans` → Editar | Manual | (nada) |
| Ver quién está por vencer | Inicio interno / Métricas / Planes | Pantalla | La lista principal no lo muestra |
| Activar agenda pública u otros complementos | El cliente pide por WhatsApp; vos prendés el interruptor | Manual | Sin autoservicio ni cobro del complemento |
| Conectar el WhatsApp del cliente | Él mismo con Meta, o vos cargás los datos en el detalle de la cuenta | Semi | Nunca probado con un número real |
| Recargar conversaciones | El cliente pide por WhatsApp; vos aplicás la recarga | Manual | El cobro no queda registrado |
| Facturar la suscripción | En el portal del SIN, fuera del sistema | Manual | El checkout promete factura por cada pago |
| Soporte | Asistente sin IA; tu WhatsApp | Semi | No hay contacto humano configurado ni forma de ver lo que ve el cliente |
| Avisos que te llegan | Telegram: comprobantes, pedidos de acceso, carga inicial desde `/setup`, derivaciones del bot de ventas, crédito de IA, pantallas rotas | Automático | No te avisa: alta nueva, pedido de web, pedido de recarga |
| Publicar la 1.0 | Decisión tuya: tu OK + 3 migraciones + `ONIA_WHATSAPP_INBOX_ID=5` (según la memoria del proyecto) | Manual | Mientras no se publique, la web de estética promete algo que producción no hace |

### 3.22 Antes de prender Meta Ads: lo mínimo

1. **Saber de dónde viene cada alta.** Hoy no hay píxel de Meta ni su versión desde el servidor (búsqueda de `fbq` y `connect.facebook.net` sin resultados en los dos repos), y `/register` no guarda los parámetros del anuncio (utm, fbclid). Meta no puede optimizar por registros. Mínimo: guardar esos parámetros al entrar a la web, pasarlos al alta y disparar el evento «registro completado».
2. **Que te llegue un aviso por Telegram con cada alta nueva.** Hoy no existe.
3. **La única captura con origen que ya existe** es la guía de facturación de la web (`web:src/app/(sitio)/guia-facturacion/CapturaGuia.tsx`), que lee `?src=` y manda el correo a Onia Center. No verifiqué dónde se leen esos contactos (?).
4. **Anuncios que llevan a WhatsApp:** el bot de ventas reconoce de qué anuncio viene una persona por la frase exacta del anuncio («campañas», máximo 10; el archivo local v2026-09-25.1 usa 9, y lo publicado puede ser distinto).
5. **Alinear la web con lo que hay:** importadora (costo por lote), estética (tratamiento a medias, solo 1.0) y la página de agentes («la IA te escribe los mensajes», ver sección 6).
6. **Tener demo con datos para estética y servicios**, o no anunciar esos rubros todavía.
7. **Capacidad de aprobar pagos a mano** mientras el QR del BCP siga apagado.
8. **Cargar `SOPORTE_CONTACTO`**, para que el asistente pueda derivar a una persona.
9. **El tope de gasto de IA (USD 50 cada 30 días) se comparte con Hermes.** Si Hermes lo agota, se cortan las fotos, el editor, el redactor de agentes y el bot de ventas. En los últimos 30 días se gastaron unos USD 12,5, casi todo Hermes.

---

## 4. Lo que está roto o dudoso (priorizado)

Prioridad 1 = frena la venta o hace quedar mal ante el cliente · 2 = traba el trabajo diario · 3 = molesta.

| Pri. | Qué | Dónde | Qué ve el cliente | Arreglo sugerido |
|---|---|---|---|---|
| 1 | No se puede confirmar una cita ni marcar «No asistió» | `appointments/AgendaClient.tsx`, `agenda/AgendaClient.tsx` (la función ya lo acepta: `app/api/appointments/[id]/route.ts:18`) | Las reservas online quedan «pendientes» para siempre; «Confirmar agenda» lleva a una pantalla sin botón | Dos botones que manden los estados CONFIRMADA y NO_ASISTIO, en el día de Citas, Agenda de hoy y el Inicio |
| 1 | No hay medición ni aviso de altas para Meta Ads | `app/(auth)/register/*`, web | Nada; vos no sabés qué anuncio funciona | Ver 3.22, puntos 1 y 2 |
| 1 | Comercio y servicios: no se puede editar ni borrar un producto o servicio, ni cambiarle el precio | `app/api/comercio/products/route.ts:49,83` | Un error de tipeo o una tarifa nueva no se pueden corregir | Función de editar y borrar + botón «Editar» en cada fila |
| 1 | Comercio: no se puede sumar stock a un producto existente | Inventario (la función `app/api/comercio/movements` ya existe) | Después del alta, el stock solo baja | Formulario «Entrada / Ajuste / Conteo» en Inventario que use esa función |
| 1 | Servicios entra al mostrador de comercio | `vertical-pack.ts:483,633-635`; `dashboard/page.tsx:92-95` | Un contador ve «Vendido hoy» y «Lo más vendido», ninguna cita | Que servicios use el panel con agenda (PanelHoy) |
| 1 | Servicios: solo el dueño puede tener agenda en Básico, Crece y Profesional | `lib/agenda/roles-agenda.ts:22`; `coadministradores.ts:34-35` | A un segundo profesional no se le pueden dar citas | Permitir agenda al rol «Personal» en servicios, u ofrecer el rol «Profesional» |
| 1 | Estética: la web promete lo que solo está en la 1.0 | `web:switcher.tsx:70` | Promesa que producción no cumple | Publicar la 1.0 o cambiar el titular |
| 1 | Importadora: la web promete «costo por lote puesto en depósito» | `web:rubros/page.tsx:87`, `web:page.tsx:91` | Promesa que no se cumple | Cambiar a «costo por producto con el TCO del BCB» |
| 1 | «Avisa stock bajo» nunca se dispara | `agents-runtime.ts:707-712`; no hay campo de mínimo | Se vende una alerta que no llega | Campo «mínimo» en el producto y en el CSV, o sacarlo de la venta |
| 1 | «Sigue cotizaciones» no tiene teléfono | `lib/importadora/cotizaciones.ts:109-113`; `channels.ts:162-166` | Al aprobar, falla | Teléfono obligatorio en la cotización |
| 2 | Importadora: «Convertir en pedido» no lleva a ningún lado | `lib/importadora/cotizaciones.ts:219-310` | El pedido desaparece | Ocultar el botón hasta que existan los pedidos |
| 2 | Importadora: la cotización no se imprime ni se envía | `importadora/cotizaciones/` | Hay que rehacerla en Word | Vista imprimible + «Enviar por WhatsApp» |
| 2 | El asistente responde con datos del dental en comercio e importadora | `lib/ayuda/datos-query.ts:40-135` | «No tenés nada por cobrar» teniendo fiados | Filtrar por rubro y leer fiados y stock de comercio |
| 2 | Guía de comercio: «Cargá el stock inicial» manda a un lugar sin carga | `lib/onboarding/tour-pasos.ts:213-220` | El primer paso no se puede hacer | Llevar a «Nuevo producto» o a la entrada de mercadería |
| 2 | Servicios: el cobro no queda en la ficha del cliente | `lib/comercio/ventas.ts:110-151`; `patients/[id]/page.tsx:66` | No sabés cuánto le cobraste a cada uno | Elegir el cliente en la caja y mostrar sus cobros en la ficha |
| 2 | Buscador equivocado (servicios busca servicios; en el celular de comercio la lupa lleva a una pantalla sin campo) | `components/layout/Header.tsx:30-38,63-66` | Buscás un cliente y aparecen servicios | Buscar en clientes; campo de búsqueda en el Catálogo |
| 2 | Requerimientos en comercio e importadora no muestra a los clientes reales | `app/api/requerimientos/clientes/route.ts:16` | Solo aparecen los que escribieron por el chat | Leer también los clientes de fiado y de cotización |
| 2 | Recordatorio por WhatsApp nunca probado | `app/api/cron/appointment-reminders/route.ts`; `lib/whatsapp.ts:32-72` | Nada (hoy sale solo correo) | Probarlo con el número de pruebas de Onia antes de venderlo |
| 2 | La campana no se actualiza sola | `NotificationBell.tsx:36-45` | Hay que recargar para ver avisos | Mismo método que ya usan las citas (`lib/realtime/publicar-cita.ts`) |
| 2 | Estética y servicios ven las tarjetas de planes de comercio | `settings/page.tsx:40`; `PlanClient.tsx:763-766` | Planes que no son de su rubro | Tratar a estética y servicios como clínicos |
| 2 | Comercio: el QR de cobro que carga el dueño no aparece en la caja ni en el recibo | Caja, `print/recibo-venta` | Lo carga y no lo ve en ningún lado | Mostrarlo al elegir «QR» en la caja |
| 2 | Cancelar una cita no pide confirmación | `appointments/AgendaClient.tsx:429,819` | Un toque sin querer cancela | Pedir confirmación |
| 2 | Permisos finos no alcanzan a Caja, Catálogo y Fiados | APIs `app/api/comercio/*` | El dueño cree que le quitó la caja a un empleado y no es así | Revisar los permisos en esas funciones |
| 2 | Contactos del chat guardados en una tabla invisible (comercio e importadora) | `lib/chatbot/contacto-desde-chatwoot.ts:158` | Nada; hueco de privacidad (hoy 0 casos) | Mostrarlos en Clientes e incluirlos en la exportación |
| 3 | Corte de caja vacío guarda Bs 0 (deducido) | `CorteForm.tsx:23-24` | Un corte en cero | Exigir el monto |
| 3 | Anular venta: cualquier empleado y sin revisar el plan vencido | `ventas/anular/route.ts:17-30` | (nada) | Permiso de administrador + revisar el plan |
| 3 | Borrar paciente, editar insumo, editar receta: la función existe sin botón | `app/api/patients/[id]/route.ts:134`; `inventory/items/[id]:28`; `prescriptions/[id]:43` | No se pueden corregir errores | Agregar los botones |
| 3 | «Nueva cita» del Inicio lleva al calendario, no al formulario | `dashboard/page.tsx:388` | Un clic de más | Enlazar con `?nueva=1` y hacer que abra el formulario |
| 3 | «Completar contacto» lleva a la lista | `dashboard/page.tsx:354` | Hay que buscar a la persona | Enlazar a su ficha |
| 3 | Super Admin: «Nueva clínica» siempre crea dental, «mínimo 6» cuando son 8, muestra la contraseña | `admin/page.tsx:144,271`; `app/api/admin/clinics/route.ts:28,108` | (solo vos) | Elegir el rubro; corregir el texto |
| 3 | Token de Meta del cliente enviado a tu navegador | `admin/organizations/[id]/page.tsx:36` | (solo vos) | Mandar solo si existe, no el valor |
| 3 | Audios del bot: el primario (Speaches) no se encontró en el VPS; contesta el respaldo pago de OpenAI, fuera del tope y de los registros | `hermes:deploy/vps-ops/bot/audio-transcribe.mjs:60-75` | Nada | Confirmar si Speaches corre; si no, decidir cuál queda |
| 3 | «Ver mi plan» abría Negocio | `components/layout/BarraEstado.tsx:106` | (nada) | **Ya arreglado en el candidato** (`164879f9`) |
| 3 | El «+» del Inicio clínico desaparecía | `components/layout/acciones-primarias.ts` | (nada) | **Ya arreglado en el candidato** (`e712a827`) |

---

## 5. Lo difícil de encontrar (y cómo arreglarlo)

| Qué | Camino hoy | Arreglo |
|---|---|---|
| **Pendientes** (aprobar lo que proponen los agentes) | No está en ningún menú. Inicio, campana, Agentes. En la importadora, ni desde el Inicio | Ítem fijo «Pendientes» en el menú, con número; que el contador del asistente lleve acá |
| **Link de reserva online** | Sistema → Configuración → Tu plan y tus datos → Mi plan → bajar → «Ver link público» (4-5 clics), sin «copiar» | Tarjeta «Tu link de reservas» con «Copiar» y «Compartir por WhatsApp» en el Inicio y en Citas |
| **Agente conversacional** | Configuración → Tu plan y tus datos → «Configurar…» (4 clics) | Ítem «Asistente de WhatsApp» en el menú, o botón visible en Conversaciones siempre |
| **Horarios de cada profesional** (sin ellos no hay horarios libres) | Configuración → Horarios → «Horarios de cada profesional» | Aviso en Citas si falta, con enlace directo |
| **Crear paciente o cobro desde el Inicio** | Versión auditada: 2-3 clics | Ya arreglado en el candidato; falta verlo en pantalla |
| **Calendario en el celular 1.0** | La pestaña «Agenda» es solo hoy; el mes está en Más → Citas | Poner «ver mes» arriba de Agenda de hoy |
| **Cobros y Reportes** | En el celular 1.0 salieron de la barra (en producción estaban); en escritorio, dentro de «Dinero», cerrado | Abrir «Dinero» por defecto al dueño |
| **Agentes, Requerimientos, Avisos** | «Automatización», cerrado (2 clics) | Ídem, o subir Agentes al bloque fijo |
| **Importar catálogo** | Solo por el «+» o por «Más»; no está en el menú ni en el Catálogo | Botón «Importar» dentro del Catálogo |
| **Importadora: Cotizaciones, Costeo, Catálogo en el celular 1.0** | Dentro de «Más» | Barra de la importadora: Inicio · Cotizaciones · Asistente · Costeo · Más |
| **Odontograma, recetas, historia clínica** | Dentro de la ficha (celular: pestaña + tarjeta, 3-4 toques) | Aceptable en escritorio; en el celular, accesos arriba de la ficha |
| **Exportar datos** | Configuración → Tu plan y tus datos → «Descargar planillas» (4) | Botón en cada lista (Pacientes, Clientes, Ventas) |
| **Roles y permisos** | Equipo → «Roles» (en el celular es un ícono sin texto) | Mostrar el texto |
| **`/setup`** | Solo desde el Inicio clínico | Mismo enlace en los otros paneles |
| **Capacidades de una cuenta (Super Admin)** | Escribir la dirección a mano | Enlace desde el detalle de la cuenta |
| **Tu tablero de administración** | Inicio interno → «Métricas completas» (1); `/admin` por Configuración (3) | Ítem «Administración» en tu menú |
| **Nombres que confunden** | «Balance de comprobación», «Avisos» (no configura nada), «Gastos» que abre «Empresa», «Requerimientos» (para una clínica), «Por cobrar» que también tiene cuentas por pagar, «Caja», «Ventas» y «Nuevo cobro» para lo mismo, «Pendientes» con dos significados en la cuenta interna | Renombrar: «Producción vs cobrado», «Correos enviados», «Gastos», «Pedidos al cliente», «Cuentas», un solo nombre para la caja |
| **Conversaciones** | Fijo en el menú aunque no se haya comprado el complemento | Mostrarlo solo con el complemento, o con una etiqueta «probar» |

---

## 6. Qué modelo de IA usa cada parte

| Parte del producto | ¿IA de verdad o plantilla? | Proveedor y modelo | Dónde se cambia | Costo |
|---|---|---|---|---|
| Agentes: a quién escribir y armar el mensaje del día | **Plantilla y reglas** | Ninguno | Interruptor en Agentes (1.0) | 0 |
| Agentes: «Proponer un texto» | **IA**, una vez y sin datos de clientes | OpenAI a través del servidor propio (LiteLLM), **gpt-4.1-mini** (`lib/onia-core/modules/agents-plantilla.ts:186`; en producción `AGENTS_LLM=1` sin modelo propio). Hay 1 llamada a gpt-5.1 con la misma clave el 24-sep, origen ? | Variables `AGENTS_LLM_*` de la app | ~USD 0,0001 por texto. Cupo por mes: Básico 0, Crece 50, Profesional 150 (la prueba), Completo y Empresa 400 (`lib/plan-catalogo.ts`) |
| Asistente «Preguntá por tu negocio» y Ayuda | **Plantilla** (30 temas + 4 consultas) | Ninguno (`app/api/ayuda/route.ts:1-6`) | `lib/ayuda/base.ts` | 0 |
| Onboarding «Traer mis datos» | **Lectura de la web sin IA** | Ninguno | `CRAWL4AI_URL`, `SEARXNG_URL` (no están en producción) | 0 |
| Agente de WhatsApp y web del **cliente**: respuestas | **Guion, sin IA** (`hermes:deploy/vps-ops/bot/recepcionista.mjs:19`). Lo que no entiende lo deriva a una persona | Ninguno | Conocimiento en `/settings/chatbot` | 0 |
| «Probá tu agente» y «Responder 6 preguntas» | **Sin IA** | Ninguno | (nada) | 0 |
| «Enseñale conversando» (editor del agente) | **IA** | OpenAI vía LiteLLM, **gpt-4.1-mini** (medido en el proceso vivo) | `ONIA_BOT_MODEL` en `/opt/onia/bot/webhook.env` | ? (no medido por separado) |
| Fotos que manda un cliente | **IA** (describe la imagen) | OpenAI vía LiteLLM, **gpt-4.1-mini** | Ídem | ~USD 0,0007 por foto (`lib/pricing.ts:196-198`) |
| Notas de voz | **IA** (transcribe) | El primario configurado es Speaches (local), pero no se encontró su contenedor en el VPS. Contesta el respaldo, OpenAI directo **gpt-4o-mini-transcribe**, fuera del tope y de los registros de LiteLLM (?) | Variables `ONIA_AUDIO_*` del bot | ? |
| Bot de ventas de Onia (tu WhatsApp y el chat de onia.com.bo) | **Guion en el 85-90 %**; IA solo para reformular cuando no entiende | OpenAI vía LiteLLM, **gpt-4.1-mini** | `ONIA_BOT_MODEL` | ~USD 0,000148 por llamada; Bs 0,002 a 0,011 por conversación (`lib/pricing.ts:193-197`) |
| Agenda, fichas, cobros, caja, inventario, costeo, reprecio, contabilidad, recordatorios, reserva online | **Sin IA** (cálculo y reglas) | Ninguno | (nada) | 0 |
| Hermes (tu agente interno, no es producto) | IA | gpt-5-mini, gpt-5.1, gpt-5-nano vía el mismo LiteLLM | `/opt/onia-selfhosted/litellm.config.yaml` | ~USD 12,5 en 30 días. **Comparte el tope de USD 50** con todo lo de arriba |

Notas: el código trae como modelo por defecto del bot gpt-4o-mini, pero lo que corre de verdad está configurado en gpt-4.1-mini (medido en el proceso vivo). El panel viejo onia-center (abandonado) tiene configurados gpt-5.4-mini y gpt-5.5; es interno.

**Qué se puede decir en la publicidad:** «Tu asistente de WhatsApp contesta al instante con la información de tu negocio, entiende fotos y notas de voz, y te pasa la conversación cuando hace falta»; «Todos los días Onia revisa tu agenda y tus cobros y te propone a quién escribir; vos aprobás con un toque»; «La IA te ayuda a escribir esos mensajes».
**Qué no:** «IA que atiende a tus clientes» o «agentes con IA que deciden» (contestan y deciden por reglas), «la IA te escribe cada mensaje» (hoy lo dice `web:src/app/(sitio)/agentes/page.tsx:19,115`; la IA escribe una plantilla y solo si el dueño la pide), «recordatorios por WhatsApp» (hasta probarlo), factura SIAT, alerta de stock bajo, cotización en PDF, compras que suman stock, reportes de ventas en comercio, modo sin conexión y «costo por lote».

---

## 7. Lo que no se pudo verificar en vivo y cómo verificarlo

**No verificado**
1. **Ninguna pantalla se miró renderizada con sesión iniciada** (por regla, no se entró a producción ni a QA). Todo sale del código, los tests, el recorrido automático y lecturas del VPS.
2. **El recorrido automático de los 5 rubros** (`e2e/v1/cinco-rubros.spec.ts`) pasó 5/5 el 28-sep, pero sobre una versión anterior a `1756ef90` y a `a76e7bf8`. Hoy la rama está 142 commits por delante de producción.
3. **Los tests [T] existen, pero hoy no se corrieron.**
4. Si «Agenda de hoy» se actualiza sola de verdad.
5. El recordatorio por WhatsApp y el alta del WhatsApp del cliente con Meta, con un número real.
6. Las notas de voz con el respaldo de OpenAI y su costo real; si Speaches corre de otra forma (una nota anterior lo ubicaba en 127.0.0.1:3108).
7. Si Contabilidad arma bien el IVA y el IT de servicios a partir de las ventas de caja.
8. Impresiones: recibo, receta y comprobante (solo se leyó la de facturas).
9. El envío real de «Recordatorio» (manual) y de «Enviar por correo» (factura).
10. Si el globo del asistente y la hoja «Más» tapan contenido a 375 px (en una captura del QA la barra del asistente tapa el formulario del corte: `.verif-tmp/claude-qa-20260928/results-claude-r2/capturas/comercio-05-comercio_caja.png`).
11. El corte vacío en Bs 0 y el fallo de «Sigue cotizaciones»: deducidos del código, no ejecutados.
12. Tráfico real en producción: solo se midieron las tareas programadas (agentes, recordatorios, tareas del core). No se leyeron los registros de acceso.
13. Quién hizo 508 llamadas a gpt-4.1-mini con la clave maestra en LiteLLM, y la llamada a gpt-5.1 del 24-sep con la clave de agentes (?).
14. Dónde se leen los contactos de la guía de facturación (`?src=`) (?).
15. Que el correo por cada comprobante nuevo llegue de verdad.

**Propuesta de prueba (sin tocar producción y sin gastar)**
1. **Base descartable:** levantar una base aparte (Supabase local o un contenedor nuevo con otro nombre en el VPS, **nunca** `supabase-db`) con las migraciones del candidato `a76e7bf8`, sin datos de clientes. Se puede reusar el banco del QA del 28-sep (`.verif-tmp/claude-qa-20260928/`) y el protocolo de cuentas QA de la skill `onia-db`.
2. **Datos de ejemplo por rubro:** 1 cuenta por rubro con 5 clientes, 10 citas (pasadas y futuras), 3 cobros vencidos, 5 productos con mínimo, 2 fiados con y sin vencimiento, 1 cotización y 1 costeo. Así los agentes y el Inicio tienen algo que mostrar.
3. **Correr el robot actual** (`e2e/v1/cinco-rubros.spec.ts`) sobre `a76e7bf8`.
4. **Agregar un recorrido «clic por clic»** que siga las listas de la sección 2 y la 3, rubro por rubro, y saque capturas en celular (375 px) y escritorio (1280 px). **Después, mirar las capturas:** un 200 no alcanza.
5. **Pruebas dirigidas a lo roto de la sección 4:** confirmar y «No asistió», editar producto, entrada de stock, corte vacío, «Sigue cotizaciones» sin teléfono, asistente con fiados, Requerimientos en comercio, campana y Agenda de hoy en vivo (con dos pestañas abiertas), guía de comercio, servicios con un segundo profesional en plan Profesional.
6. **Correr los agentes a mano** sobre esa base y comprobar que cada uno propone algo (Vuelve a citar, Recuerda cobros, Confirma citas; Reprograma después de agregar «No asistió»).
7. **Lo que necesita algo real, con tu OK:** conectar el WhatsApp de pruebas de Onia con el alta de Meta, mandar un recordatorio por WhatsApp, una nota de voz, una notificación a un teléfono y un correo de recordatorio a una casilla propia.
8. **Medir en producción solo leyendo:** registros de LiteLLM por clave (costo por parte), registros de las tareas programadas y registros de acceso de la app, para tener el primer [P] de pantallas cuando empiece el tráfico de Meta Ads.
