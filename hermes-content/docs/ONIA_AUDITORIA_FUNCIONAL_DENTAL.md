# Auditoría funcional — Rubro Dental (Onia Platform)

> Fuente de verdad VIVA del estado vendible del rubro dental. Se actualiza al
> re-auditar; no crear copias con fecha. Última pasada: 2026-08-16, operando
> producción (app.onia.com.bo) con cuenta QA real, verificando persistencia
> tras recarga dura — no toasts, no grep, no 200s.

## 1. Veredicto en una frase

**Todavía no como está — pero está a DOS arreglos chicos de sí:** el núcleo
clínico (pacientes, odontograma, agenda, cobros, reportes, inventario) funciona
de verdad y persiste en base, y se puede demostrar en vivo con honestidad; lo
que bloquea es que **no se puede dar acceso al equipo por email (HTTP 500)** —
una clínica con recepcionista no puede arrancar — y que **la lámina de planes
todavía muestra nombres viejos ("Grupo Clínico")**. Arreglados esos dos, se
vende hoy, con la lista de "no prometer" de la sección 4 en la mano del
vendedor.

## 2. Tabla completa

| Área | Acción | Veredicto | Detalle |
|---|---|---|---|
| Pacientes | Login + llegar al módulo | FUNCIONA | La cuenta nueva cae en /onboarding (4 pasos, se puede saltar horarios/servicios/equipo); completado, deja en /dashboard con el módulo dental completo. El tutorial de 13 pasos reaparece en varias páginas tras saltarlo (molesto, no rompe). |
| Pacientes | Crear paciente con datos completos | FUNCIONA | Ficha con edad calculada, sangre destacada, alergia en tarjeta roja visible, emergencia y notas. Nada se pierde. |
| Pacientes | Paciente en la lista tras recargar | FUNCIONA | Persistencia real en base verificada tras recarga dura. |
| Pacientes | Editar teléfono y confirmar persistencia | FUNCIONA | Edit precarga todo; el dato nuevo sobrevive la recarga. |
| Pacientes | Odontograma: marcar diente 16 Caries + nota | FUNCIONA | Odontograma FDI de 32 piezas, 7 estados + notas por diente. Persiste tras recarga dura. De lo más sólido del módulo. |
| Pacientes | Agregar nota clínica al historial | FUNCIONA | 4 campos clínicos con placeholders dentales reales; queda con fecha y autor, persiste. |
| Pacientes | Buscar por nombre/CI + buscador global | FUNCIONA | Filtro real con query negativa de control. Matiz: el filtro de lista aplica con Enter, no en vivo mientras tipeás; el buscador global funciona seguro con tipear + Enter (no se vio dropdown de sugerencias). |
| Agenda | Login y llegar a la agenda | FUNCIONA | Onboarding obligatorio bloquea /appointments hasta completarlo (~5 min guiado). El wizard se resetea si recargás a mitad. |
| Agenda | Crear cita para HOY (domingo) | **CORREGIDO (fff96c3+29f4b09, sin deployar)** | Tres causas apiladas: el escritor de agenda no convertía la convención de día, había un Lun-Sab hardcodeado, y el DUEÑO nunca recibía horario al registrarse. Ahora dueño/doctores/equipo nacen con los días reales del negocio. Pendiente: deploy + probar en prod con org nueva. |
| Agenda | Crear cita para mañana (lunes) | FUNCIONA | Modal completo con slots reales del doctor; la cita persiste tras recarga; no deja crear citas inválidas. |
| Agenda | Mover cita de 10:00 a 11:00 | FUNCIONA | Persiste. Matiz: en edición la hora es input libre, no la lista de slots — no se probó si valida disponibilidad. |
| Agenda | Marcar Completada | FUNCIONA | Persiste; las acciones se reducen coherentemente. |
| Agenda | Marcar Cancelada | FUNCIONA | Persiste; el dashboard descuenta bien. Matiz: la leyenda lista "Confirmada" pero NO existe botón para confirmar una cita. |
| Agenda | Calendario mensual | FUNCIONA | Chips por día coloreados por estado, panel lateral con detalle, consistencia con la ficha del paciente verificada. |
| Agenda | Vista /agenda (hoy) | FUNCIONA | Vacío correcto con guía y CTA. |
| Agenda | Botón Recordatorio | FUNCIONA | Con paciente sin correo avisa honesto "Sin email". El envío real con email NO fue probado. |
| Tratamientos | Login cuenta QA | FUNCIONA | Cae en onboarding; una recepcionista el primer día ve el wizard, no el panel. |
| Tratamientos | Cerrar el navegador en la pantalla de éxito del onboarding (sin el click final) | **SIN EFECTO** | TODO el onboarding se pierde y arranca de cero; nada persiste hasta el último click. Repetido 2 veces. Un cliente que cierre la pestaña ahí pierde toda la carga. |
| Tratamientos | Catálogo dental precargado | **VACÍO** | No hay. La clínica arranca con cero tratamientos; solo 4 categorías fijas y 2 motivos built-in. Toda la lista de precios se tipea a mano el día 1. |
| Tratamientos | Crear tratamiento con precio | FUNCIONA | Persiste tras recarga dura. |
| Tratamientos | Editar el precio de un tratamiento | **CORREGIDO (6b794ea, sin deployar)** | Botón Editar por fila reutiliza el form de alta precargado; PATCH persiste y la lista se actualiza con la respuesta del servidor. |
| Tratamientos | Desactivar un tratamiento | **CORREGIDO (1a75454, sin deployar)** | Causa raíz: el schema Zod del PATCH no declaraba `active` y lo descartaba en silencio (update de {}). Además el alta con solo nombre+precio daba 400 por nulls del form (397f57b). |
| Tratamientos | Asignar tratamiento a un paciente | **VACÍO** | La tarjeta "Tratamientos" del perfil no tiene botón de agregar y NINGÚN flujo la alimenta (se probó odontograma, historial, factura y cita). Promesa decorativa. |
| Tratamientos | Usar el tratamiento en una factura | FUNCIONA | Catálogo aparece en /billing/new, factura creada y persistida. PERO el primer intento sin fecha de vencimiento dio "Datos inválidos" sin decir qué campo falta. |
| Tratamientos | Usar el tratamiento en una cita | FUNCIONA | Selector con catálogo, cita creada y visible. Intermitente: una vez los slots quedaron en "Cargando..." indefinido y no se pudo agendar. |
| Cobros | Crear factura Bs 150 | FUNCIONA | 201, detalle correcto. Requisito no obvio: la fecha de vencimiento es obligatoria sin estar marcada. |
| Cobros | Crear factura SIN fecha de vencimiento | **ROTO** | Banner "Datos inválidos" sin decir qué falta ni marcar el campo. Una recepcionista queda trabada sin pista. Arreglo trivial. |
| Cobros | Factura en /billing tras recargar | FUNCIONA | KPIs actualizan de verdad. Matiz: un Borrador no suma en "Por Cobrar" (puede confundir). |
| Cobros | Flujo de pago QR | FUNCIONA | Es REGISTRO manual del pago, no cobro: no genera QR ni hay pasarela. Anota que te pagaron por QR; honesto si se vende así. |
| Cobros | Estados Borrador→Pagada / →Enviada | FUNCIONA | Máquina de estados real, persiste, habilita acciones coherentes (nota de crédito, marcar vencida). |
| Cobros | Imprimir / PDF | FUNCIONA | Imprimible limpio. El sistema nunca promete emisión fiscal (SIAT figura "Cotizado"). RIESGO: titula "FACTURA" en grande sin leyenda "documento interno / sin valor fiscal". |
| Cobros | Caja / arqueo | **VACÍO** | No existe módulo de caja/arqueo/cierre de día. Lo más cercano es la conciliación por método en /accounting. |
| Cobros | Contador Pack /contabilidad | FUNCIONA | IVA 13% / IT 3%, vencimiento por NIT (D.S. 25619), RCV con export CSV, balance cuadrado. Framing fiscal honesto en pantalla. Inconsistencia menor: el detalle de factura muestra "IT 3% Bs 0,00" mientras contabilidad deriva IT Bs 9 de las mismas ventas. |
| Agentes/Coms | Login + panel | FUNCIONA | Onboarding gate; el "Saltar tutorial" funcionó y persistió en este carril. |
| Agentes/Coms | /agents lista agentes | FUNCIONA | 2 agentes (Recall y Cobrador) con framing honesto: solo proponen, humano aprueba. Vocabulario 100% dental. |
| Agentes/Coms | Activar / configurar / disparar un agente | **SIN EFECTO** | No hay NINGÚN control: ni toggle, ni "correr ahora", ni configuración, ni fecha de próxima corrida. Ambos "Sin corridas todavía". Imposible verificar desde la UI que un agente haya corrido jamás. |
| Agentes/Coms | Propuestas pendientes de aprobación | **VACÍO** | Vacío-por-sin-datos con explicación buena, filtros a la vista. Pero como no hay forma de disparar una corrida, el circuito estrella (detecta→propone→humano aprueba) quedó SIN VERIFICAR punta a punta. |
| Agentes/Coms | /communications | FUNCIONA | Panel real: límites del plan, checks técnicos vivos (SMTP propio OK), reglas de envío y bloqueos, errores recientes. |
| Agentes/Coms | Configurar reply-to (circuito completo) | FUNCIONA | Cambio en /settings → persiste → /communications lo refleja. Dato guardado de verdad. |
| Agentes/Coms | WhatsApp desde /communications | **GATEADO** | Chip "Revisar" que parece botón pero es un `<p>` no clickeable. No hay ruta para contratar el add-on desde ahí. Gateo declarado, confuso. |
| Agentes/Coms | Nombre del plan entre pantallas | FUNCIONA (feo) | El mismo plan aparece como "Pro", "professional" y "Premium" en 3 pantallas. No rompe; feo en demo. |
| Equipo/Ajustes | Login + panel | FUNCIONA | Onboarding obligatorio; el progreso se pierde si recargás a mitad. |
| Equipo/Ajustes | Invitar usuario por email | **ROTO** | POST /api/admin/users → HTTP 500 "Error sending invite email", 2 intentos. No existe estado "invitado". **Hoy NO se puede dar acceso al equipo por email.** Alternativa "Crear con contraseña" sin probar. |
| Equipo/Ajustes | Cambiar nombre de clínica y NIT | FUNCIONA | Persiste en formulario y sidebar. También dirección, Maps, teléfono, email, URL del QR de cobro. |
| Equipo/Ajustes | Subir logo de la clínica | **VACÍO** | No existe ningún campo en /settings ni en onboarding. La agenda pública muestra el logo genérico de Onia, no el de la clínica. |
| Equipo/Ajustes | Cambiar horario general de la clínica | **SIN EFECTO** | La tarjeta es solo lectura; el horario solo se configura una vez en el onboarding, contradiciendo el "podés cambiar todo desde Configuración". |
| Equipo/Ajustes | Editar horarios por doctor | FUNCIONA | Editor real (días, inicio/fin/descanso); el cambio sobrevivió la recarga. |
| Equipo/Ajustes | Mi Plan: precios y add-ons | FUNCIONA | 4 niveles Bs 320/750/1.500/2.900 (pricing de lanzamiento correcto), chatbot WhatsApp con precio nuevo, uso, botones de pago QR. |
| Equipo/Ajustes | Nombres de los planes | **ROTO** | Niveles 3 y 4 dicen "Clínica" y "Grupo Clínico" (marcadores VIEJOS) en vez de "Completo" y "Empresa". Montos correctos; naming roto. |
| Equipo/Ajustes | Link de agenda pública | FUNCIONA | Abre SIN login en navegador limpio, ~3 s, wizard de reserva con la clínica y sus 2 doctores. Iconos renderizan como iconos. |
| Equipo/Ajustes | Saltar el tutorial de 13 pasos | **SIN EFECTO** | Reapareció en 2 sesiones nuevas pese a saltarlo; recién a la tercera dejó de aparecer. Fricción diaria para la recepcionista. |
| Reportes/Inv | Login + onboarding | FUNCIONA | El gate bloqueaba todas las rutas hasta completar el wizard; el wizard pierde progreso al recargar. |
| Reportes/Inv | /reports con tenant nuevo | FUNCIONA | Vacío CON guía, sin errores. |
| Reportes/Inv | /reports refleja datos de otros carriles | FUNCIONA | KPIs y gráficos cuadran con lo cargado en el resto del sistema. Cosmético: barra de Bs 150 etiquetada "0k"; el botón flotante "+" tapa un monto. |
| Reportes/Inv | Balance clínico | FUNCIONA | Debe = Haber, badge "Cuadrado", cruza con la factura pagada. |
| Reportes/Inv | Crear insumo en /inventory | FUNCIONA | Persiste tras recarga; valor estimado con matemática correcta. |
| Reportes/Inv | Movimiento de stock (salida de 6) | FUNCIONA | Stock bajo mínimo → badge rojo, KPI "Stock bajo" actualiza, último movimiento visible. Todo persistido. |
| Reportes/Inv | Filtro bajo stock + búsqueda por SKU | FUNCIONA | Al instante. |
| Reportes/Inv | Exportar CSV en reports/inventory | **VACÍO** | No existe ningún botón de export en ninguna de las dos pantallas (barrido de DOM). Si el cliente pide sus datos en Excel, hoy no puede. |

## 3. Lo ROTO, ordenado por cuánto duele en una demo

1. **No se puede agendar una cita para HOY si hoy es domingo** (o cualquier día
   fuera de Lun-Vie del doctor). La demo típica arranca con "agendemos una cita
   ahora" — si es fin de semana, falla en el minuto 1 delante del prospecto,
   contradiciendo lo que el propio onboarding prometió.
2. **Invitar al equipo por email da HTTP 500** y el invitado nunca aparece. Si
   el prospecto dice "agregá a mi recepcionista", error rojo en vivo. Además
   bloquea el onboarding real de cualquier clínica con más de una persona: es
   EL bloqueante de venta.
3. **No existe editar un tratamiento** (ni el precio). Cargando el catálogo en
   vivo, el primer error de tipeo obliga a eliminar y recrear delante del
   cliente. Para un producto cuyo pitch incluye "tu lista de precios", duele.
4. **"Desactivar" tratamiento es teatro**: la UI y la API dicen que sí (200) y
   al recargar vuelve activo. Peor que no existir, porque miente.
5. **Crear factura sin fecha de vencimiento**: "Datos inválidos" sin decir qué
   campo, y el campo no está marcado como obligatorio. En una demo de cobro, el
   vendedor queda adivinando igual que la recepcionista.
6. **La lámina de planes dice "Clínica" y "Grupo Clínico"** (nombres viejos).
   No mostrarla al cliente hasta corregirla; contradice el material comercial
   nuevo.
7. **El onboarding pierde TODO si cerrás antes del último click** (incluso en
   la pantalla de éxito) y también si recargás a mitad. No rompe la demo (el
   vendedor lo sabe), pero quema al cliente real en su primer día.
8. **El horario general de la clínica no se puede cambiar después del
   onboarding** (tarjeta solo lectura), aunque el onboarding promete lo
   contrario.
9. **El tutorial de 13 pasos reaparece tras saltarlo** (hasta 3 veces en un
   carril). Fricción visible si la demo usa una cuenta ya tocada.

## 4. Lo que NO se puede prometer (la lista del vendedor)

Prohibido decir en un pitch, porque hoy no existe o no se pudo verificar:

- **"Viene con el catálogo dental precargado"** — NO. La clínica tipea su lista
  de precios completa a mano el día 1.
- **"Podés corregir un precio cuando quieras"** — NO. Editar tratamientos no
  existe; solo eliminar y recrear.
- **"Plan de tratamiento por paciente"** — NO. La tarjeta "Tratamientos" del
  perfil es decorativa: ningún flujo la llena.
- **"Mirá los agentes de IA trabajando"** — NO en vivo. Con cuenta nueva no hay
  ninguna corrida, no se puede disparar una, no se muestra cuándo será la
  próxima, y el circuito detecta→propone→aprueba quedó sin verificar punta a
  punta. Sí se puede decir: existen 2 agentes (Recall y Cobrador), solo
  proponen y un humano aprueba cada mensaje.
- **"Emite factura fiscal / SIAT"** — NO. El sistema mismo lo declara: no
  reemplaza SIAT, la emisión fiscal se cotiza como alcance enterprise. Ojo
  extra: el imprimible dice "FACTURA" sin disclaimer — no mostrarlo como si
  fuera fiscal.
- **"Cobrás por QR desde el sistema"** — NO. Se REGISTRA que te pagaron por QR;
  no genera QR ni hay pasarela.
- **"Arqueo / cierre de caja"** — NO existe. Solo conciliación por método de
  pago en contabilidad.
- **"Exportá tus reportes e inventario a Excel"** — NO. No hay ningún export en
  /reports ni /inventory (el CSV que sí existe es el RCV del pack contable).
- **"Con tu logo"** — NO. No hay forma de subir el logo; la agenda pública
  muestra el logo de Onia.
- **"Agendá cualquier día que atienda tu clínica"** — NO en domingo (ni fuera
  del horario por-doctor), aunque el negocio esté configurado abierto.
- **"Confirmá citas con un click"** — NO. El estado "Confirmada" figura en la
  leyenda pero no hay botón para ponerlo.
- **"Contratá el chatbot de WhatsApp desde el panel"** — NO. El chip "Revisar"
  no es clickeable; no hay ruta de contratación en la UI.
- **"Cambiá tus horarios cuando quieras"** — solo POR DOCTOR. El horario
  general de la clínica queda congelado tras el onboarding.
- **"Recordatorios por email al paciente"** — el circuito avisa honesto cuando
  no puede ("Sin email"), pero el ENVÍO real con un paciente con correo no fue
  probado. No prometer hasta verificar.

## 4b. Cierre 2026-08-16 (tarde) — qué se movió desde la auditoría

- **Domingos (#1)**: CORREGIDO y verificado E2E en prod con org nueva — dueño y equipo nacen con los 7 días (filas 0-6 en doctor_schedules).
- **Editar tratamiento (#3) y Desactivar teatro (#4)**: CORREGIDOS y deployados; + el alta con solo nombre+precio ya no da 400.
- **Editor de conocimiento del chatbot**: NUEVO, vivo en prod (/settings/chatbot) con probador contra el motor real. Vocabulario por rubro verificado con org de comercio (cero dental para una ferretería).
- **Canal de salida de los agentes**: botón "Enviar yo mismo por WhatsApp" (wa.me) VIVO en /pending — la cola de aprobaciones ya tiene salida real sin credenciales Meta. El automático espera token de Meta (Sergio, ~15 min) + plantilla utility para pacientes fríos.
- **Incidente cazado**: el registro estuvo caído hasta ~10 h (alias de red `auth` perdido al recrear el contenedor) — restaurado; pendiente canario de registro/login en el guardián.
- **Siguen abiertos**: #5 factura sin fecha → error opaco · #7 onboarding pierde todo al cerrar (re-verificado hoy) · #8 horario general read-only post-onboarding · #9 tutorial reaparece (re-verificado hoy) · catálogo dental precargado · tarjeta Tratamientos del paciente vacía.

## 5. Qué arreglar ANTES de la primera demo (en orden)

Regla usada: primero lo que rompe la venta o la demo en vivo, después lo que
quema al cliente en su primera semana, después cosmética de credibilidad.
Estimación gruesa: chico = horas, mediano = 1-3 días, grande = semana+.

| # | Arreglo | Tamaño | Por qué antes de la demo |
|---|---|---|---|
| 1 | Invitación de equipo por email (500 "Error sending invite email" — probable config SMTP del flujo de invite, el correo propio SÍ está OK en /communications) | chico | Bloqueante de venta declarado. Sin esto no se onboardea ninguna clínica con equipo. |
| 2 | Renombrar planes en Mi Plan: "Clínica"→"Completo", "Grupo Clínico"→"Empresa" (strings) | chico | La lámina de precios es LA pantalla de cierre y hoy contradice el material nuevo. |
| 3 | Herencia de horario negocio→doctor (que los doctores nazcan con los días que el negocio declaró abiertos, incluido domingo) o al menos exponerlo claro en el editor por doctor | chico/mediano | Es lo primero que falla en una demo de fin de semana y contradice la promesa del onboarding. |
| 4 | Fix del "Desactivar" que responde 200 y no persiste | chico | Es un botón que miente; cualquier prospecto curioso lo encuentra. |
| 5 | Editar tratamiento (nombre/precio/duración) — el PATCH ya existe (lo usa Desactivar), falta el form | mediano | Sin esto, la carga del catálogo en vivo es una trampa. |
| 6 | Validación de factura por campo: marcar fecha de vencimiento como obligatoria + mensaje que diga QUÉ falta | chico | Destrababa al vendedor y a la recepcionista; el error hoy es mudo. |
| 7 | Persistir onboarding por paso (o al menos guardar al llegar a la pantalla de éxito, no en el click final) | mediano | No rompe la demo pero destruye el primer día del cliente real; dos cierres de pestaña = dos cargas perdidas. |
| 8 | "Saltar tutorial" persistido server-side de una | chico | Fricción diaria y se nota en demos con cuentas reusadas. |
| 9 | Leyenda "Documento interno — no válido como factura fiscal" en el imprimible | chico | Riesgo real: un paciente puede creer que recibió factura fiscal. En Bolivia eso es un problema, no un detalle. |
| 10 | Tarjeta "Tratamientos" del perfil del paciente: OCULTARLA hasta que algo la alimente | chico | Una promesa vacía visible en la pantalla más usada. Alimentarla de verdad (plan de tratamiento) es proyecto aparte (grande). |
| 11 | Unificar el nombre del plan (Pro/professional/Premium → uno solo) | chico | Tres nombres en tres pantallas huele a producto cosido. |
| 12 | Editor del horario general de la clínica en /settings | mediano | Cierra la contradicción con el onboarding; hoy la única salida es soporte manual. |
| 13 | IT consistente entre detalle de factura (Bs 0,00) y contabilidad (Bs 9) | chico/mediano | Delante de un contador, esa inconsistencia mata la credibilidad del pack contable. |

**Después de la primera demo, en orden de valor comercial:** catálogo dental
seed opcional en el onboarding (mediano — mata la objeción "tengo que tipear
todo"), export CSV en reportes e inventario (mediano), subir logo de la clínica
(mediano — la agenda pública es marketing del cliente), agentes con "próxima
corrida" visible + botón "correr ahora" (mediano/grande — sin eso el módulo
estrella no es demostrable), botón "Confirmar cita" (chico), chip de WhatsApp
clickeable con ruta de contratación (chico), verificar el envío real de
recordatorio con un paciente con email (chico, es prueba no código).

---

*Evidencia: capturas por área en el scratchpad de la sesión de auditoría
(`...\scratchpad\audit\{pacientes,agenda,tratamientos,cobros,agentes,equipo-ajustes,reportes-inventario}\`).
Método: cada FUNCIONA exige persistencia tras recarga dura mirando la pantalla
renderizada; cada ROTO/SIN EFECTO fue reproducido 2-3 veces.*
