# ONIA frente a Lucy — ficha interna de demo

**6-oct-2026 · Uso interno.** META: diagnosticar necesidad. PRUEBA: cinco preguntas y recorrido verificable. PARADA: entregar a madre; sin contacto, publicación ni cambios comerciales.

**Diferenciación:** Lucy se presenta como atención/ventas por WhatsApp; ONIA ofrece agenda, ficha/odontograma y cobros. Pueden complementarse. No está probado que Lucy sustituya la gestión dental ni que ONIA cumpla sus funciones comerciales.

## Cinco preguntas

1. ¿Qué necesita resolver primero: consultas por WhatsApp, citas, registro clínico o cobros?
2. ¿Cuántos doctores, usuarios —incluida recepción— y sedes tienen?
3. ¿Dónde llevan hoy agenda, historia clínica y saldos?
4. ¿Qué seguimiento les cuesta sostener y quién revisa los mensajes al paciente?
5. Si evalúa Lucy, ¿qué tarea espera que haga y qué necesita ver funcionando?

**Calce interno:** priorizar una sede, 2–6 doctores. Si ya usa software, identificar el costo de reemplazarlo. Si sólo busca ventas automáticas por WhatsApp, revisar calce antes de ofrecer ONIA.

## Diagnóstico guiado: elija el problema que necesita comprobar

**Referencia observada:** el navegador público de Lucy permitió seleccionar servicio, tamaño y extras antes del resumen (6-oct). Su demo se declara simulada y selección/resumen mostraron importes distintos. No se probó su funcionamiento. **Propuesta ONIA:** usar selección por necesidad en la conversación y demostrar una tarea dental real en pantalla. Es un guion manual, no una función nueva del producto.

**Apertura para decir:** «¿Dónde se le complica más el trabajo hoy: organizar las citas, encontrar el registro clínico o revisar los cobros? Elija uno y lo comprobamos con un paciente de ejemplo».

Si responde «todos», preguntar: «¿Cuál le causó el último problema y qué pasó?». Registrar una prioridad. Aplicar las preguntas de tamaño, sedes y sistema actual de esta ficha. Si busca sólo atención automática por WhatsApp, revisar calce antes de entrar a estos recorridos.

Los tres casos son situaciones concretas del trabajo dental, con ejemplos ficticios para la demostración. No son testimonios ni casos de clientes observados.

| Caso y pregunta | Ramificación → pantalla y prueba ONIA | Siguiente acción | Qué mejora y señal verificable |
|---|---|---|---|
| **A. Recepción recibe un pedido de cambio de cita y consulta una agenda separada.** «Cuando un paciente pide cambiar su cita, ¿dónde verifica usted el profesional y la hora?» | Si el problema es localizar la cita, abrir `/agenda` o `/appointments` y encontrar la cita del paciente ficticio. Comprobar fecha, hora y profesional. Si pide cambiarla, mostrar el cambio sólo si la operación está validada en la cuenta demo; no afirmar que esta lectura comprobó la reprogramación. Si lo difícil es la confirmación, pasar a `/agents` únicamente con plan habilitado y propuesta real de cita sin confirmar. | «¿Este registro le permite identificar la cita correcta? ¿Qué necesitaría verificar para usarlo en recepción?». Anotar el dato faltante; no enviar mensajes. | Prioriza el trabajo de recepción. La persona identifica cita y profesional en pantalla; el registro interno conserva pantalla, resultado y faltantes. |
| **B. El doctor busca el odontograma y la historia antes de atender.** «¿Dónde encuentra usted lo registrado en la atención anterior?» | Si el problema es localizar el registro clínico, abrir `/patients` → ficha del mismo paciente ficticio, historia y odontograma. Mostrar una anotación previamente validada. Si sólo necesita agenda, volver a A; no agregar módulos por completar el recorrido. | «¿Esta información le alcanza para revisar la atención anterior? ¿Qué campo necesita y no ve aquí?». Registrar el requisito antes de proponer migración o alcance. | Vincula la explicación con la consulta clínica. Se ve el mismo paciente y su registro; se anota qué campo encuentra y cuál falta, sin prometer ahorro de tiempo medido. |
| **C. El paciente consulta su saldo y recepción revisa comprobantes separados.** «¿Cómo comprueba usted cuánto pagó y cuánto queda por cobrar?» | Si el problema es saldo/pagos, abrir `/billing` con permiso de finanzas y datos ficticios: cargo de Bs 300, pago de Bs 100 y saldo de Bs 200, sólo si coinciden en la pantalla validada. No crear cobros reales. Si necesita seguimiento, mostrar `/agents` con propuesta de cobro validada, desde Crece o en prueba. | «¿Puede usted comprobar aquí el pago y el saldo? ¿Quién tendría permiso para revisarlos?». Registrar utilidad, usuarios y permisos requeridos. | Hace verificable la explicación de cobros. Cargo, pago y saldo coinciden y el acceso corresponde al rol. No implica integración bancaria, pago automático ni factura SIAT. |

## Demo de 20 minutos por la necesidad elegida

**Antes de usar:** cuenta de ejemplo autorizada, datos ficticios, plan, permisos y pantallas comprobados. Este documento no confirma demo preparada ni estado actual de producción. Para capturas, ocultar datos privados y registrar fecha, pantalla y plan; no fabricar interfaces ni resultados.

0–4 min: diagnóstico y selección A/B/C. 4–12: ejecutar el recorrido elegido. 12–16: pedir al prospecto que identifique el dato que resuelve su problema; mostrar un segundo módulo sólo si hace falta. 16–20: resumir «Usted necesita X; hoy comprobamos Y; falta Z» y acordar la siguiente verificación. Si una pantalla falla, registrar el fallo y retirar esa afirmación.

**Seguimiento permitido, cuando se muestre:** «Onia le deja propuestas con el mensaje preparado. Usted las revisa y realiza el envío». La IA redacta el modelo una vez; Onia completa los datos. Recordatorios automáticos: correo. No abrir WhatsApp con teléfonos ficticios.

**Límites:** no prometer tratamiento a medias, WhatsApp autónomo, recordatorios automáticos por WhatsApp, factura SIAT, multisede ni resultados garantizados.

## Guion de Lucía: 60–90 segundos, con capturas verificadas

**Pieza propuesta; pendiente de capturas verificadas. Preparación local reversible autorizada; generación pagada y publicación requieren su aprobación específica.** Locución de 154 palabras (conteo por espacios): aproximadamente 62–77 segundos a 120–150 palabras/minuto; medir la toma. Lucía presenta una clínica de ejemplo, sin simular experiencia propia como cliente.

| Tiempo orientativo | Imagen y locución |
|---|---|
| 0–15 s | Texto propio con tres opciones. «¿Qué necesita ordenar primero en su clínica: las citas, el registro de atención o los cobros? El problema que usted elija debe marcar lo que le mostramos. Veamos tres ejemplos con datos ficticios». |
| 15–32 s | Captura A: cita, hora y profesional legibles. «Si recepción busca una cita, aquí puede revisar el paciente, la hora y el profesional. Antes de hablar de otras funciones, comprobamos que usted encuentre la información que necesita». |
| 32–49 s | Captura B: ficha e historia/odontograma del mismo paciente. «Si el problema aparece antes de atender, abrimos la ficha de ese paciente y revisamos su registro clínico. Usted nos indica qué dato le sirve y cuál necesita comprobar todavía». |
| 49–67 s | Captura C: cargo 300, pago 100, saldo 200; ocultar otros datos. «Si la dificultad está en los cobros, mostramos el cargo, el pago registrado y el saldo pendiente, con el permiso correspondiente. Así puede comparar lo que ve con la tarea que quiere resolver». |
| 67–82 s | Cierre propio, sin métricas ni logos Datec. «¿Cuál de estos casos se parece al suyo? Podemos revisar ese recorrido en una demo de veinte minutos y dejar claros su alcance y los puntos que faltan verificar». |

**Prueba de la adaptación:** recorrer A/B/C internamente y comprobar que cada elección lleva a su pantalla y a su evidencia; guardar resultado y faltantes. Tras cada demo autorizada, registrar prioridad elegida, dato que el prospecto logró identificar y siguiente acción acordada. La mejora es una hipótesis hasta observar comprensión y utilidad; no adjudicar conversiones ni ahorro sin medición.

**Usar primero:** este diagnóstico manual y prueba por necesidad. **Probar después:** guion con capturas reales de la cuenta demo. **Descartar:** construir SAP/D4G o sumar funciones para imitar la escala de Datec. Se toma el principio de selección y claridad; no se copian textos, claims, identidad, voz ni secuencia visual de Lucy. Sin cambios de precios.

## Objeciones: respuestas de usted

| Objeción | Respuesta |
|---|---|
| «Lucy vende por mí» | «¿También necesita registrar atención clínica y cobros? Le muestro ese recorrido para comparar el trabajo que necesita cubrir». |
| «Datec tiene trayectoria» | «Tiene trayectoria respaldada. Comprobemos cómo quedan su cita, ficha y saldo en pantalla». |
| «Lucy es gratis» | «Selección y resumen mostraban importes distintos el 6-oct. Confirme la cotización completa antes de comparar». |
| «¿Onia responde solo por WhatsApp?» | «Ese alcance sigue pendiente de prueba real. Esta demo cubre agenda, ficha y cobros». |
| «¿Recupera tratamientos pendientes?» | «Tratamientos a medias sigue pendiente de validación. Podemos revisar las propuestas de confirmación y cobros en Pendientes». |

**CTA —con demo preparada—:** «¿Le parece revisar su caso en 20 minutos con una clínica de ejemplo? Usted podrá identificar qué tarea le sirve y qué queda pendiente». Precio según fuente vigente y usuarios reales.

**Fuentes/QA:** dossier Datec, PR143 `a30f12e9`; catálogo `ONIA_CATALOGO_DE_VENTA.md` §§2,7,8, `origin/main` `672d78e8`. Madre revisa vigencia antes de integrar/usar. Sin web nueva, ranking ni checkout editado.

Aplicación6-oct: catálogo §§2,4,7,8 y observaciones públicas de Lucy contrastados por Ventas sobre80302fc7. Madre integró diagnóstico por necesidad y guion; prueba interna con cuenta demo todavía pendiente. No representa cambio del producto publicado.
