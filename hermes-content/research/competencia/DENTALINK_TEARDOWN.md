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

## Contenido, pauta y comunicación (medido 2026-10-08)

> Nota de método: de los anuncios solo se pudo leer el titular, la fecha y el país (la API de la Biblioteca no da cuerpo, botón ni destino) y esta sesión no pudo abrir Facebook. Los guiones salen de los **subtítulos automáticos de YouTube** y la edición, de los **fotogramas de 1 por segundo** que YouTube publica por video (101x180 en vertical, 320x180 en horizontal). **No se oyó audio**: música y efectos quedan sin medir. Esto cierra lo que el teardown del 1-oct dejó pendiente («Videos: NO vistos»). Los ganchos van parafraseados. Medilink (la misma empresa, ~41 anuncios) no se analizó acá.

### Cobertura
- **Redes (enlaces del pie de softwaredentalink.com):** YouTube `/c/softwaredentalink` (canal @dentalink: **14,3 mil suscriptores, 419 videos**) · Instagram @dentalink (seguidores: **no se pudo**, pide login y devolvió 429) · Facebook `facebook.com/dentalink` (no se pudo leer) · LinkedIn showcase `dentalinksoftware` · X @Dentalink. **TikTok: no se encontró cuenta de la empresa** (el @dentalink de TikTok es de otra persona).
- **Videos mirados:** 8 de YouTube (24 entre los tres competidores) **más 3 Shorts nuevos el 8-oct** (`vKEQxH15OWA`, `wX-l-OKvmCs`, `NjTcLl5TE0A`, con subtítulos y fotogramas; ver «Formatos que faltaban»). Vistas y duración de todos releídas el 8-oct con yt-dlp (cliente iOS, `--ignore-no-formats-error`): lo que antes decía ≈ ahora trae la cifra exacta. Con subtítulos y fotogramas: 7 (`9Z_8ovd1VSk`, `r76WsgRD_2k`, `DuMtWGal61E`, `2EKGImHgYqU`, `mbvDONtdmzg`, `FlJmIRqIQUc`, `TOLRhKHnAGk`). Solo subtítulos: `pw74lH_u0VI` (testimonio en inglés). Más el **anuncio `1086920147535259`** (UGC de 38 s) a partir de la captura de la madre del 2-oct (texto y 4 cuadros, sin movimiento).
- **Método:** Gemini nativo dio «exceeded your current quota» (no se reintentó). La descarga de video de YouTube está bloqueada para esta IP (PO token, 429); subtítulos por el cliente iOS de yt-dlp y fotogramas por el storyboard de YouTube. Catálogo de videos con `yt-dlp --flat-playlist`; fechas de subida de 10 videos muestreados. Biblioteca de Meta con `ads_library_search`: funcionó.
- **No se pudo:** seguidores de Instagram y Facebook; los creativos, textos y botones de los anuncios (Facebook web devolvió «socket hang up»); audio; los 136 anuncios activos más viejos que los 50 que deja ver la API (**136 de los 186 no se ven**).

### Estructura de contenido orgánico
- **YouTube @dentalink (80 videos mirados del catálogo):** (1) **tutoriales de producto** de 2023 («crear pacientes», «confirmar citas», «odontograma, periodontograma y rayos X», «recaudación y cajas»…), de 3 a 4 min, entre 1.300 y 8.900 vistas; (2) **demos por país** de 11-17 min: **Colombia ≈24.000 vistas** (dic-2023), México ≈5.900 (jul-2025); (3) **webinars y masterclasses** de gestión, marketing y finanzas para el odontólogo, de 1 hora o más, 70-5.000 vistas (la serie #MDO2023 son 10 capítulos; la cuenta regresiva del RIPS de Colombia ≈5.000); (4) **normativa de Colombia** (RIPS, Resolución 1888); (5) **IA** (Contact Center, «AI Suite»), con demos de 24-30 min y piezas de 1 min; (6) **eventos y cultura** (Expodent, congreso 3M, «pasión», «propósito»); (7) **testimonios** «Real Dentalink Experiences» (4 doctores, en inglés, 68-417 vistas).
- **Shorts (los 40 más nuevos listados):** vistas **mediana ≈160**; solo 5 llegan a 1.200 o más (2.701 el «te explico Dentalink en un minuto» de México, subido el 17-jul-2025, ≈1.900 el sketch del odontólogo agotado, ≈1.300 el «hack» de pacientes con tratamientos pendientes, 1.398 «guarda este reel» sobre cierres (`vKEQxH15OWA`, 15-sep-2025, 55 s: ver «Formatos que faltaban»), ≈1.200 «ser dentista es más que técnica»). **13 de los 40 pide comentar** (11 lo dicen en el título del video, 1 pide «cuéntanos en los comentarios» y el sketch `9Z_8ovd1VSk` lo dice en el audio) **una palabra** («IA», «ENLACE», «GUÍA», «EBOOK», «info») para recibir el link o una demo por mensaje privado; unos 9 promocionan eventos (Health Experts Summit, Expodent); unos 8 son de IA, varios en modo intriga («#DentalinkAI está cada vez más cerca…»).
- **Frecuencia (medida el 8-oct con la fecha de los últimos 24 videos de la pestaña Videos y de los extremos de los 40 Shorts):** *(corrección: antes decía «~17 videos largos en 10 semanas, ≈1,7 por semana»; era falso.)* Los 24 videos cubren del 27-mar al 8-oct-2026 (28 semanas, ≈0,9 por semana) pero **llegan en ráfagas**: **16 salieron desde el 14-sep** y **7 el mismo 8-oct** (tutoriales de 29-66 s de reembolsos y seguros de Chile y España), mientras que **entre el 29-jul y el 13-sep no hubo ninguno**. Casi todos son **de menos de 100 s** (no son «largos»): los largos de verdad son 4 (demo Contact Center de 30 min el 28-jul, masterclass RIPS de 90 min el 22-jul, bootcamp de 59 min el 8-jul, demo Suite IA de 25 min el 4-jun…) y tienen 118-1.413 vistas. Shorts: 40 entre el 19-jun-2025 y el 8-oct-2026 (≈0,6 por semana).
- **Qué rinde más:** lo que enseña a usar el sistema (tutoriales y demos por país) y los Shorts con **una situación humana** (el sketch) o **una receta paso a paso**. Los Shorts de IA corta (15-60 s) y los de eventos rinden menos de 300 vistas.
- **Instagram:** no se pudo mirar. Los Shorts parecen reels reciclados (*inferencia*): uno de ellos manda a «nuestro Instagram: @dentalink».
- **Idiomas y países:** español de México, Colombia, Chile y España; versiones en inglés. **No hay nada específico de Bolivia** en el catálogo.

### Pauta en Meta (`ads_library_search`, 8-oct-2026)
- **Página Dentalink (id 106612849382553): 186 anuncios activos.** La API solo deja ver los 50 más nuevos: **todos arrancaron el 5-8 de octubre**, o sea, una **tanda masiva en 4 días**. El resto (136) no se ve.
- **Los que más duran son 3 anuncios de catálogo dinámico** (titular sin resolver, `{{product.name}}`): arrancaron el **15-nov-2025 (326 días)** y el **19-nov-2025 (323 días, dos)**. Son el único bloque de la página que pasa de 30 días en lo que se ve. *(Inferencia: anuncios de catálogo/remarketing; creativo y destino no visibles.)*
- **Los 50 más nuevos, por tema (titulares):**

| Tema | Cant. | Titulares de ejemplo |
|---|---|---|
| IA | 10 | «IA para Odontólogos» · «Atiende sin pausa 24/7» · «Dentalink IA: Gestión 24/7» · «IA que sabe de Odontología 🤖» ×2 · «¡Cámbiate a Dentalink IA!» · «Cyber: 30% DCTO + IA 🎧» ×2 |
| Gestión general («todo en un lugar») | 11 | «Centraliza tu clínica dental hoy» ×2 · «¡Multiplica el orden en tu clínica!» ×2 · «Más que una simple agenda» · «Simplifica la gestión…» |
| Normativa de Colombia | 6 | «Normas al día automáticamente» · «Evita glosas y sanciones» · «Evita multas en tu clínica» · «Prepárate para el 15 de Nov» · «¡Cumple la 1888 fácil y seguro!» · «RIPS JSON sin errores» |
| Varias sedes | 5 | «Gestión multisucursal fácil» ×3 · «Control multisucursal» ×2 |
| Pedir demo (el titular es el botón) | 6 | «¡Agenda tu demo ahora!» ×2 · «Agenda tu demo guiada 📲» · «¡Llena el formulario y conoce más!» ×2 · «Agenda y recibe descuento» |
| Ausentismo | 2 | «Reduce inasistencias hoy» · «-50% inasistencias en agenda» |
| Presupuestos | 1 | «Cierra tratamientos caros» (desde el 6-oct) |
| Por país | 4 | «Conoce Dentalink - Argentina» ×2 · «…líder en México» · «General - Social - CO» (nombre interno de campaña que se coló como titular) |
| Sin titular | 5 | — |

- **Formato y destino:** solo se vio uno (la captura del 2-oct): `1086920147535259`, **video UGC de 38 s**, activo desde el 30-sep, con dos versiones de texto («Unifica agenda, ficha clínica y cobros en un solo lugar» y una descripción de marca), titular «Controla tu clínica dental fácil» y botón **«Get Offer»** (en inglés, el valor por defecto de Meta). Moneda de la cuenta: USD.
- **Bolivia: 19 anuncios, 4 activos hoy** (los 4 con 3-8 días: «Gestiona tu clínica fácil», «Más que una simple agenda», «Simula sonrisas con IA ✨», «Dicta y la ficha se llena»). Los **15 ya apagados** muestran qué probaron en Bolivia: **6 «Calcula gratis qué procesos automatizar en 1 min»** (18-22 jun; *inferencia:* un imán de leads), 4 de catálogo (3 del 8-jun y 1 del 24-ago), 3 «Dicta…», 1 «Simula sonrisas», 1 «Análisis de RX con IA». **No hay ninguno específico de Bolivia** (ni QR, ni bolivianos, ni nombre de ciudad en el titular).
- **El panorama de «software dental» en Bolivia (búsqueda por país BO, solo activos, 13 resultados):** Dentalink (2 de los 4 aparecen con ese término), DodoDentist en español («Recordatorios por WhatsApp»), softwaredentalpro, Nodo Digital («Software Dental $100 USD», cuenta en CLP) y varias clínicas y tiendas que no son software. Es poca competencia en la Biblioteca para el rubro.
- **Lo que enseña:** Lo que se ve son dos extremos: 50 anuncios nuevos del 5-8 de octubre y 3 de catálogo de casi un año. Entre medio no se ve nada (los 136 restantes no se pueden listar), así que **renovar por tandas es una inferencia**, no un dato. La IA ya es el tema de 1 de cada 5 titulares (10 de 50); el dolor en plata del box vacío no aparece en ninguno.

### Comunicación
- **Titular de la web (home):** «Haz crecer tu clínica dental con una gestión más inteligente.» Agenda, ficha clínica, cobros, pagos y financiamiento al paciente.
- **A quién le habla:** al odontólogo independiente y a la clínica con varios profesionales o sucursales, en toda LatAm y España. Tono profesional, de tú, simple.
- **Prueba:** +16 años, +20 países, +15.000 clínicas, +100.000 profesionales (en el video de México dicen «más de 100.000 odontólogos»); logos (Norden, Clínica Everest, Sanasalud, Clínica Alpes); testimonios en video de México, Colombia y Chile; certificaciones (ISO 27001, HIPAA, GDPR); resultados sin fuente (−80 % de tareas manuales, −30 % de inasistencias, +25 % de tratamientos, +40 % de productividad).
- **Precio: nunca.** Esencial, Pro y Titanium sin montos, solo «Solicita tu cotización».
- **Clics hasta empezar:** cotización = 1 clic al formulario; **no hay demo ni prueba a la vista** en la home. (La demo se pide por los anuncios y los Shorts.)
- **CTA:** «Solicita tu cotización» en todas las secciones; en los anuncios y Shorts, «agenda tu demo».
- **IA:** menú «Novedades IA» y pilar «Inteligente» (Contact Center, rayos X, notas por voz, simulador de sonrisa).

### Guiones de sus videos
| Pieza (vistas, duración) | Gancho (0-3 s) | Tramos | Cierre |
|---|---|---|---|
| `9Z_8ovd1VSk` Short, sketch (≈1.900, 47 s, ene-2026) | Le habla directo al odontólogo y le pide que pare un momento | 3-20 s: el dolor (llega cansado, ya buscó fichas, confirmó pacientes y ordenó papeles antes de atender) · 20-33 s: «un asistente que entiende odontología: fichas, pacientes, presupuestos, cobros y reembolsos» · 33-42 s: no es una app para agendar; si perdías 3 horas en administrativo, las recuperas | «Comenta info y te agendamos una demo gratis» |
| `r76WsgRD_2k` Short, «hack» (≈1.300, 85 s, oct-2025) | Pregunta: ¿sabías que podrías perder ingresos por pacientes que dejaron sus tratamientos pendientes? | 5-30 s: aceptan el presupuesto y desaparecen (agendas vacías, caja floja) · 30-75 s: receta en pantalla: Reportes → «Estado de presupuestos» → filtrar por «presupuesto enviado o plan aprobado sin agendar» → contactarlo o mandar email masivo · 75-85 s: promete +10 % de cierres en menos de 15 días | «Solicita tu demo» |
| `DuMtWGal61E` Short, México (2.701, 55 s, jul-2025) | «Hola, odontólogo, en un minuto te cuento qué es Dentalink» | 3-40 s: recorrido por 5 funciones (expediente digital, citas con confirmación por WhatsApp y correo, presupuestos con pago a plazos, ingresos y gastos, desde cualquier dispositivo) · 40-47 s: «más de 100.000 odontólogos» | «Agenda una demo gratis ahora mismo» |
| `2EKGImHgYqU` (15 s, 117 vistas) y `mbvDONtdmzg` (19 s, 60 vistas), animados, subidos el 21-jul-2026 | Una pregunta con una cifra: ¿quién reagenda al que no llegó? / ¿sabías que el Contact Center recupera un 35 % de los presupuestos sin respuesta? | 4-9 s: la IA lo contacta al instante y «recuperas hasta el 80 %» · en el otro: seguimiento por WhatsApp, resuelve dudas, convierte presupuestos en tratamientos activos | «Actívalo hoy» / logo «dentalink iA» |
| `TOLRhKHnAGk` (225 vistas, 67 s) y `FlJmIRqIQUc` (1.576, 52 s), Contact Center | Un dato de mercado (82 % agenda desde el móvil, ~40 % escribe fuera de horario) o «tu clínica nunca cierra» | 14-40 s: asistente integrado que agenda, confirma, reprograma y contesta por WhatsApp sin intervención humana; sabe cuándo delegar a una persona · en el de 67 s además: 80 % de citas recuperadas, 35 % más tratamientos aceptados, inversión en Meta que vuelve «4,2 veces» | «Agenda una llamada con tu asesor» |

Patrón: **gancho de 3 s con el oficio («odontólogo») o una cifra → dolor concreto → una función con nombre → cifra de resultado sin fuente → CTA a demo con un paso mínimo (comentar o agendar)**. Los sketches no muestran la pantalla del producto; los animados sí muestran el chat de WhatsApp.

### Edición
- **Tres familias:** (1) **sketch o UGC con memes:** `9Z_8ovd1VSk` (presentador en camiseta rosa en 3 locaciones, **cambio de plano cada ~1-1,5 s**, primer plano de la cara y plano entero alternados, **insertos de memes y de una mujer dormida en una silla de tienda** en las frases de cansancio) y `r76WsgRD_2k` (creadora frente a un consultorio recortado, pegatina «#Hacks Dentalink» con forma de cuaderno, memes de reacción, **~1 corte por segundo**, y **al final captura real de la plataforma con zoom**). (2) **Explicativo corporativo:** `DuMtWGal61E` (presentadora sentada en una mesa de reuniones, plano fijo con **10 cortes a B-roll** de dentistas con guantes y capturas de la agenda, el odontograma y la firma). (3) **Animación pura de IA, sin persona:** `2EKGImHgYqU`, `mbvDONtdmzg`, `FlJmIRqIQUc`, `TOLRhKHnAGk`: fondo blanco azulado o azul oscuro con partículas, **tipografía cinética**, **cifra enorme** (35 %, 80 %, 82 %, 40 % en anillo), maqueta de celular con chat de WhatsApp verde y **chips flotantes** («Agenda», «Confirma», «Reprograma», «24/7»), efecto glitch, cierre con el logo «dentalink iA» (el de 19 s cierra con el logo en el último cuarto; no se verificó el porcentaje exacto).
- **Subtítulos (estimado):** blancos, de letra gruesa sin serifa, centrados abajo, 2-4 palabras por línea; en los de presentador la palabra clave («Dentalink») va en **azul o cian**; en el anuncio UGC de 38 s son **grandes, sin caja, al centro-bajo**, con una creadora hablando sobre la pantalla real de Dentalink de fondo (ficha, rayos X, documentos).
- **Primeros 3 s (`9Z_8ovd1VSk`):** s0 plano medio en un escritorio con la laptop, mirando a cámara («Odontólogo…»); s1 «necesito que»; s2 «pares un momento»; s3 corte a un primer plano de la cara con una pegatina de dibujo en la frente (insertado como chiste). Se pasa del gancho al primer meme en 3 s.
- **Duración y formato:** Shorts de 15-85 s en vertical; animados de 15-19 s; los explicativos de IA de 53-67 s; los videos horizontales de demo, de 12 a 30 min.
- **No se pudo medir:** música, efectos, tipografía exacta, audio de los animados (llevan voz en off).

### Formatos que faltaban (mirados el 8-oct con subtítulos y fotogramas de YouTube)
Tres Shorts que la primera ronda solo había contado: dos de los más vistos y el prototipo del «comenta X». Audio sin medir, como en el resto.

| Pieza (vistas, duración, fecha) | Gancho (0-3 s) | Tramos | Cierre |
|---|---|---|---|
| `vKEQxH15OWA` receta de cierres (1.398, 55 s, 15-sep-2025) | Pregunta: ¿sabías que el cierre de tratamientos no empieza en el sillón? | 4-11 s: promete «cinco pasos» · 11-17 s: 1 agenda revisiones · 17-23 s: 2 confirma citas · 23-32 s: 3 facilita pagos · 32-39 s: 4 recuerda el beneficio (salud, estética, confianza) · 39-47 s: 5 seguimiento post consulta («entre un lo pienso y un sí, doctor») | «Los cierres no se improvisan, se planifican fuera del sillón. Guarda y comparte» |
| `wX-l-OKvmCs` «Michis» (1.270, 62 s, 13-oct-2025) | «El verdadero rol de un odontólogo, explicado con michis» | 4-35 s: el michi recién egresado sabe técnica pero no tratar a un paciente nervioso; es odontólogo, administrador, recepcionista y técnico de fotocopiadoras · 37-46 s: conoce Dentalink, que lo ayuda a organizarse · 46-54 s: «ser odontólogo es más que tratar dientes» | «Agenda tu demo con Dentalink» |
| `NjTcLl5TE0A` «Comenta IA» (162, 37 s, 22-ene-2026) | Una cifra: el 82 % de los pacientes agenda desde el móvil; si no respondes, se va a la siguiente opción de Google | 8-23 s: Contact Center IA, no es un bot aburrido, 100 % integrado al software · 23-29 s: agenda, confirma y reprograma sin que nadie se ocupe | «¿Quieres ver cómo se vería en tu clínica? Escríbenos» (el título dice «Comenta IA») |

- **Edición de `vKEQxH15OWA`:** presentadora en un sofá gris, plano medio fijo con **empuje de zoom a primer plano cada 3-4 s**; «¿Sabías que?» grande arriba en los 3 primeros segundos; cada paso lleva un **numeral en cuadro azul en la esquina superior izquierda** y **una palabra clave en caja de color sobre el pecho** («Agenda», «Confirma», «Facilita», «Recuerda», «Seguimiento»); **un inserto de meme o archivo cada 5-8 s** (un niño llorando, un niño con micrófono, una estatua, un hombre maquillado, un plano en blanco y negro) para romper el plano; sin música distinguible en los fotogramas (no se oyó).
- **Edición de `wX-l-OKvmCs`:** **sin personas**: gatos recortados y memes de gatos sobre fondo de cuaderno cuadriculado blanco o sobre fotos de un consultorio dental, **cambio cada 1-2 s**, rótulo serif azul de 2 líneas en los primeros 4 s, texto pequeño abajo en cada cuadro. Es una tercera familia que la primera ronda no había visto (sketch, explicativo, animación de IA, y esta de memes de animales).
- **Edición de `NjTcLl5TE0A`:** presentador hombre de camisa azul marino con **efecto de holograma en el primer segundo**, cuatro fondos distintos en 37 s (oficina, azul tecnológico con marco de celular, estantería de clínica, mesa con laptop), **cartela azul con «Contact Center» y maqueta de WhatsApp** en el medio, subtítulos blancos centrados en el medio-bajo de 2-3 palabras; cambio de escena cada 2-3 s. Es el mismo estilo corporativo de los animados, con presentador.
- **Qué enseña:** el Short de receta numerada de Dentalink cierra con **«guarda y comparte»**, no con «comenta X»: rinde 8 veces más que el de «Comenta IA» del mismo canal (1.398 contra 162 vistas), aunque son temas distintos (cierres contra producto) y no se puede aislar el efecto del CTA.

### Qué toma Onia (pauta de Onia Platform y web) y qué NO
**Toma, para probar:**
1. **Hablarle al oficio en la primera palabra** («Doctor, pare un momento»). Dentalink lo usa en su Short sketch de 1.900 vistas. En versión de **usted** (regla de Onia con clientes) y con la plata del dueño, que Dentalink no usa en ningún titular.
2. **La receta paso a paso sobre el paciente que se pierde** (`r76WsgRD_2k`): confirma que el tema funciona como «cómo se hace» (≈1.300 vistas en un Short de 85 s) y que **Dentalink lo trata como presupuesto sin agendar y lo resuelve a mano con filtro e email masivo**. El caso de Onia es otro: tratamiento **empezado** y sin cita por delante. Matiz sobre `ONIA_ADQUISICION_Y_PAUTA.md` §2.5 («nadie pauta el tratamiento a medias»): sigue siendo cierto para el empezado, pero Dentalink ya enseña y pauta el presupuesto sin respuesta («Cierra tratamientos caros», desde el 6-oct, y el Short del 35 %). **No se usa en pauta hasta que el detector de Onia encuentre casos reales** (BACKLOG, catálogo §8).
3. **Remarketing por catálogo como único anuncio que dura** (3 de 186, 323-326 días). Cuando Onia tenga tráfico a la web, el primer anuncio que mantener es **uno solo de remarketing**, no más creativos fríos.
4. **Una demo larga como pieza base de la web**: sus demos por país son el video con más vistas del canal (≈24.000). Para Onia, Sergio Urcullo recorriendo el sistema real con una clínica demo, 10-15 min, sin edición pesada.
5. **Receta numerada que cierra con «guarda y comparte»** (`vKEQxH15OWA`, 1.398 vistas, 55 s): pregunta de 3 s → 5 pasos con numeral en cuadro y palabra clave en caja → CTA a guardar, que no necesita mensaje privado. **Dónde:** Shorts y reels de Sergio Urcullo, en versión de usted y con la cuenta de la clínica: «cinco pasos para que el paciente no abandone el tratamiento». **Evidencia:** vistas medidas con yt-dlp el 8-oct. Sirve como estructura aunque el tema de Dentalink sea el presupuesto, no el tratamiento a medias.
6. **Imán de leads con una calculadora** (6 anuncios «Calcula gratis…» en Bolivia en junio). Hipótesis a probar con poco gasto: «cuánto cuesta un box vacío por semana», sin prometer ahorro.

**No toma, y por qué:**
- **Urgencia por norma** (RIPS, Resolución 1888, «15 de nov», multas): para Onia sería el SIAT, y está prohibido usarlo como urgencia (§7).
- **Cifras sin fuente** (80 % de citas recuperadas, 35 % más tratamientos, ROI de 4,2 veces, −50 % de inasistencias): Onia tiene cero clientes.
- **«Comenta X y te mandamos…»** (13 de 40 Shorts): comentario → mensaje privado en Instagram tiene 2 rechazos de Meta en Onia y 0 leads (memoria del carril); no se usa como CTA.
- **Descuento de Cyber «30 % DCTO»:** Onia no hace descuentos improvisados (regla de propuestas); un precio público.
- **Titular con «IA»** (1 de cada 5): se titula con el trabajo (§7 y catálogo §8).
- **Sketch con memes de internet y la serie de michis (`wX-l-OKvmCs`):** rompe el tono de Onia (ni «muy IA» ni de meme); y no muestra el producto, que es lo que sostiene un anuncio de software (§2.5).
- **Web sin precio ni prueba, solo «Solicita tu cotización»:** es justo donde Onia gana (alta sola, 14 días sin tarjeta y precio público).
- **Una tanda de 50 anuncios en 4 días:** es capacidad de empresa con equipo de pauta; Onia prueba 2-3 versiones de un ángulo.
