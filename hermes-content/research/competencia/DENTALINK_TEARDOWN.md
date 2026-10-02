# Teardown de producto: Dentalink + Medilink (Healthatom)

Medido el 2026-10-01, solo con fuentes públicas: sitio, centro de ayuda (290 artículos Dentalink y 247
Medilink, rastreados enteros), App Store. Sin cuenta, sin demo, sin formularios.
`AY/<id>` = `https://ayuda.softwaredentalink.com/es/articles/<id>` · `ML/<id>` =
`https://ayuda.softwaremedilink.com/es/articles/<id>` · `WEB/<ruta>` = `https://www.softwaredentalink.com/<ruta>`.
Capturas (las de su propio centro de ayuda) en `dentalink/`.

> ⚠️ **Videos: NO vistos.** YouTube bloquea esta IP («Sign in to confirm you're not a bot», HTTP 429),
> no hay `GEMINI_API_KEY` y el navegador headless no pasa el proxy TLS. Los IDs están anotados para
> verlos desde la PC: tareas `uoff7-cciCM`, `YNv74OzICnk`, `hZJHVibavJk` · WhatsApp `9WF8IPPKfpI` ·
> presupuesto `uH51Y7aNQlI` · app `otuEoQjpUug` · agenda online `uWJ0Ef7ZQ4M`. Todo lo de abajo sale del
> texto y de las capturas de los artículos.

**Medilink** es la misma plataforma con otra ficha. Mismo menú, mismos artículos (las Tareas de gestión
son iguales, palabra por palabra: ML/9541419), Contact Center (ML/13943141), Contralor IA (ML/12755008).
Cambia la ficha clínica: fichas configurables por especialidad (oftalmológica, pediátrica, estética:
ML/11101796, ML/11101803, ML/11101805) en lugar de odontograma. Lo que sigue vale para las dos.

## 1. Pregunta central: ¿recuperan al paciente con el tratamiento a medias?

**No exactamente. Tienen el sistema de recall más completo de la región, pero ese caso queda afuera.**

«Tareas de gestión» (CRM › Tareas de gestión, **solo plan Titanium**, AY/9493454) genera 4 tareas
automáticas, cada una con un plazo configurable (inmediato / 1 día / 1 semana / 1 mes / 1 año / N días;
captura `dentalink/tareas-plazos.jpg`):

| Tarea | Se dispara cuando… | Cubre |
|---|---|---|
| **Cita** | una cita pasa a «Anulado» o «No asiste» **y** no hay citas futuras | el que faltó |
| **Captura** | se cargan prestaciones al plan y el presupuesto **no está iniciado ni pagado** | presupuesto que nunca arrancó |
| **Control** | se **finaliza** un presupuesto (ej.: 180 días después) | el control periódico |
| **Cobranza** | se finaliza un presupuesto **con deuda** | la deuda |

Fuente de las cuatro definiciones: AY/9493454 y la captura de su pantalla de plazos.

**El hueco:** el paciente que **sí vino**, hizo 2 de 4 sesiones de una endodoncia, no faltó a ninguna cita
y simplemente no volvió a agendar no dispara ninguna de las cuatro tareas. Su presupuesto está iniciado
(no entra en Captura), no está finalizado (no entra en Control ni en Cobranza) y no tiene una cita
anulada (no entra en Cita). Para él solo queda la «tarea personalizada» manual, con fecha que pone
alguien a mano (AY/9493454, sección «Tareas personalizadas»). La lista de estados tampoco tiene
«tratamiento en curso sin próxima cita».

**Cómo se trabaja una tarea:** cada mañana aparece la vista «Tareas del día + atrasadas» → se asigna un
responsable → se abre la tarea (con comentarios, presupuestos y citas del paciente) → Finalizar con uno
de tres resultados: «El paciente dice OK» / «Volver a contactar en X días» / «Cerrar el caso» (AY/9493454).
Un reporte mide la tasa de éxito por tipo: cobradas, capturadas, controles agendados, citas reagendadas
(AY/11088620, `dentalink/tareas-resultado.jpg`). **El contacto en sí lo hace una persona**, salvo que
se pague el Contact Center.

**Lo que lo vuelve automático es el Contact Center (add-on con IA, se cotiza aparte).** En «Flujos
automáticos» se sincroniza con las 4 tareas, y la IA escribe sola por WhatsApp (y llama por voz) para
cobranza, captura, control y cita, con monitoreo en vivo: Detener / Ejecutar ahora / Reprogramar / Ver
conversación (AY/12961769; WEB/ia/management/crm-asistente-ia: «La IA contacta proactivamente a tus
pacientes para vender tratamientos, hacer recalls, recuperar citas perdidas, cobrar deudas y confirmar»).
Por eso hereda el mismo hueco: automatiza las cuatro tareas, y el tratamiento a medias no es una de ellas.

**Onia** (`onia-platform/lib/onia-core/modules/agents-tratamiento-a-medias.ts`): tratamiento
EN_PROGRESO + sin cita por delante + 21 días sin venir. El agente arma el mensaje y el dueño lo aprueba en
Pendientes. Es justo el caso que Dentalink no detecta. **Ojo:** Dentalink sí cubre bien al que faltó, el
presupuesto que nunca arrancó y el control, y en Titanium con Contact Center los contacta solo.

## 2. Módulo por módulo

| Módulo | Cómo se hace / pasos | Qué automatiza | Fuente |
|---|---|---|---|
| **Agenda** | Agenda diaria › «Dar cita» → especialidad, profesional, sillón, duración, motivo → paciente nuevo o existente → Continuar: ~6 campos y 2 clics. Tres vistas: diaria, semanal (arrastrar para mover), diaria global por especialidad y sillón. Citas múltiples de una vez. Toda cita queda colgada de un plan de tratamiento (crea uno «de diagnóstico» si no existe). | Correo de confirmación al agendar; sincroniza con Google Calendar; reprogramación masiva | AY/9488188, AY/9493130, AY/10343380, AY/9493205 |
| **Ficha + odontograma** | Ficha 3.0: línea de tiempo del paciente, antecedentes con alertas, recetas, documentos y RX. Odontograma: clic en la pieza o la cara → Diagnóstico → lista de lesiones (Ctrl para varias piezas). Nomenclatura continua, ADA o FDI. Se versiona cada 24 h y nada se borra, solo se anula. Periodontograma, índice de placa, ortodoncia y estética facial. | Dictado por voz a evolución (IA, 1 crédito) | AY/9498191, AY/9493218, AY/12067936, `dentalink/odontograma.jpg` |
| **Plan / presupuesto** | Paciente › Planes › Nuevo → profesional → clic en pieza → «+ Prestación» (por categoría, buscador o plantilla). Secciones por fase, descuentos por ítem o total, **tratamiento alternativo** (otra cotización sin cobro, se convierte en principal). Se imprime en 3 formatos (completo / solo total / sin montos) o se manda por correo o WhatsApp (pagando el envío). Simulador de sonrisa con IA (16 créditos). | Captura de presupuestos no iniciados (Titanium) | AY/9493223, AY/10126122, AY/12732004 |
| **Recordatorios** | Correo automático al agendar. WhatsApp automático (**add-on pagado por mensaje**): confirmar o cancelar 1, 2 o 3 días antes, más un recordatorio el día anterior. El texto **no se puede personalizar** y el estado de la cita se actualiza solo. Hay una alternativa gratis y manual: el botón abre WhatsApp Web con el mensaje armado y el link para confirmar. | Sí, con el add-on | AY/9493201, AY/9493137, AY/9493132 |
| **Confirmación** | El paciente toca Confirmar o Cancelar en WhatsApp, o abre el link → el estado cambia en la agenda. Los estados de agenda son personalizables. Con el Contact Center también confirma por llamada de voz IA. | Sí | AY/9493201, AY/10343370, WEB/ia/management/crm-asistente-ia |
| **Inactivos / recall** | Ver §1. Más: email marketing masivo (cumpleaños, morosos, seguimiento) y encuestas NPS, ambos Titanium. | Sí (Titanium + Contact Center) | AY/9493454, AY/9493451 |
| **Caja / cobros** | Cajas › Abrir caja (responsable + monto inicial) → cobrar desde Recaudación, desde la agenda o desde la ficha: elegir prestaciones o «abono libre» → medio de pago, que se puede dividir → comprobante por correo. Cierre con saldo. Cuotas, devoluciones, convenios, descuento por planilla, pago online con caja virtual (solo algunos países). | Caja virtual para pagos online | AY/9493249, AY/9493259, AY/9493252 |
| **Facturación** | Integrada con facturadores locales: Chile (Nubox), Colombia (DIAN + RIPS, Alegra), México, Ecuador, España, Rep. Dominicana. **Bolivia: no aparece en ningún artículo.** | — | colección «Facturación electrónica», AY/9493499, AY/9493493 |
| **Inventario** | Bodega por sucursal: ingreso (cantidad, costo, precio de venta, lote, vencimiento, proveedor → pasa a gastos), salida asociada a un box y a un usuario. Semáforo rojo/amarillo/verde. Laboratorios con órdenes y pagos. | Semáforo de stock | AY/9493459, AY/9493458 |
| **Reportes** | Pro/Titanium. Panel de desempeño (ventas, recaudación, ocupación, anuladas), más de 50 Excel, gráficos (conversión de presupuestos por doctor, eficiencia, morosos). Reportes IA aparte: preguntar en lenguaje natural → gráfico; «Analizar dashboard» devuelve recomendaciones en PDF. | Reportes IA (costo extra) | AY/9493462, AY/9493466, AY/15351350 |
| **Reserva online** | Administración › Agenda Online → link para web, IG o WhatsApp. El paciente elige por profesional, especialidad o servicio. La cita entra **«no validada»** y recepción la valida. Pago anticipado al reservar (solo Chile). **Gerty.com**: directorio público donde los pacientes encuentran la clínica y reservan. | Sí | AY/9493139, AY/13746518, AY/17061686 |
| **IA** | 8 herramientas. Clínicas: análisis de RX, notas por voz, resumen clínico con chat («¿cuándo es su próxima cita?»), simulador de sonrisa, Clinical Copilot. De gestión: Contact Center (WhatsApp + teléfono 24/7, agenda, deriva a humano, aprende de las preguntas que no supo contestar), Contralor IA (reglas en texto libre, ej. «toda cita con consentimiento firmado», que se revisan sobre las citas del día), Reportes IA. Funcionan con créditos por plan: Starter 50 · Esencial 80 · Pro 170 · Titanium 300. | Real; lo de gestión es lo más fuerte | WEB/ia, AY/12961769, AY/12731680, AY/12683519 |
| **App móvil** | App «Healthatom: Dentalink Medilink» (iOS, v47, jun-2026). Solo para el profesional: ver, agendar y anular citas, avisos de citas, liquidaciones. No tiene ficha clínica completa. Es web responsive para lo demás. 3 calificaciones en Chile. | Notificaciones push | App Store id6466298054, WEB/planes (FAQ) |
| **Onboarding** | **No hay alta sola**: «Solicita tu cotización» → asesor → «demo o acceso de prueba» coordinado con ventas. Primeros pasos: crear usuarios → editar precios → primer paciente → primera cita, con una asesoría de onboarding. Importación de pacientes desde Excel (hasta 10.000, corre a las 23:59 y deja la plataforma fuera de servicio ~1 h), o carga masiva gratis hecha por ellos en el primer mes (3-5 días hábiles). Si dejás de pagar: bloqueo a los 15 días y **cuenta borrada a los 30**. | — | WEB/planes, AY/9488176, AY/9488166, AY/9488192 |

## 3. Contra Onia (catálogo del 2026-10-01)

| Capacidad | Dentalink | Onia | Mejor |
|---|---|---|---|
| Alta y prueba | Por vendedor, con demo | Sola, 14 días sin tarjeta | **Onia** |
| Agenda | 3 vistas, sillón, citas múltiples, Google Calendar | Agenda y citas | Dentalink |
| Ficha / odontograma | Odontograma versionado, periodontograma, ortodoncia, plantillas, firma | Historia clínica + odontograma | Dentalink |
| Presupuesto | Alternativos, 3 formatos de impresión, envío por WhatsApp | Tratamientos | Dentalink |
| Recordatorio | Correo + WhatsApp (add-on) | Solo correo, 24 h y 2 h | Dentalink |
| Confirmación 1 toque | WhatsApp, link, llamada IA | Agente confirmador (propone) | Dentalink |
| **Tratamiento a medias** | **No lo detecta** (§1) | Agente de 21 días, incluido | **Onia** |
| Faltas / presupuesto no iniciado / control | Automático (Titanium) + IA que contacta sola | Reprogramador, recall de 180 días; propone y aprueba un humano | Dentalink |
| Cobranza | Tarea + IA | Agente cobrador | Empate en lógica; Dentalink en canal |
| Caja | Cajas por usuario, cuotas, abonos, pago online | Cobros y facturas | Dentalink |
| Factura Bolivia (SIAT) | No existe | En certificación, apagada | Nadie todavía; Onia la tendrá |
| Contabilidad, planilla, gastos | Gastos + liquidación de doctores; «no es software contable» (WEB/planes) | Contabilidad, planilla, gastos | **Onia** |
| Inventario | Bodega, lote, vencimiento, semáforo, laboratorio | Insumos | Dentalink |
| Reportes | +50 Excel, gráficos, IA | Reportes (desde Profesional) | Dentalink |
| Reserva online | Link + directorio Gerty + pago anticipado | Link de reserva | Dentalink |
| WhatsApp entrante con IA | Contact Center vivo (agenda dentro del chat) | Construido, sin probar con un cliente | Dentalink |
| IA clínica | RX, voz, sonrisa, resumen | No | Dentalink |
| App móvil | App del profesional | No | Dentalink |
| Precio a la vista | Nunca: «pide tu cotización» | Planes públicos en /checkout | **Onia** |

## 4. Lo que tienen y a Onia le falta (orden: lo que más pesa en una clínica de 2-6 en Santa Cruz)

1. **Recordatorio y confirmación por WhatsApp, de un toque, que cambia el estado de la cita solo.** En
   Bolivia el correo no se lee. Es el anti-ausentismo diario (AY/9493201).
2. **Seguimiento que sale solo**: faltas, presupuesto que nunca arrancó y control a los 6 meses,
   contactados por IA sin que nadie apruebe (AY/12961769). Onia propone y espera aprobación.
3. **Presupuesto que vende**: alternativas, impresión sin montos o solo total, envío por WhatsApp y
   reporte de conversión por doctor (AY/9493223, AY/9493466).
4. **Caja de recepción completa**: abonos parciales, cuotas, pago dividido, caja por usuario y cierre
   (AY/9493259, AY/9493249).
5. **Odontograma profundo**: versionado, periodontograma, ortodoncia (AY/9493218).

## 5. Lo que Onia hace mejor

1. **El tratamiento a medias**: es su hueco, y es el dolor #1 del cliente ideal (§1).
2. **Entrar sin hablar con nadie**: alta sola y 14 días gratis con precio a la vista, contra cotización,
   demo y borrado de la cuenta a los 30 días de impago (WEB/planes).
3. **Hecho para Bolivia y con la administración entera**: contabilidad, planilla y la factura del SIAT
   en camino. Dentalink no factura en Bolivia y se declara «no software contable».
