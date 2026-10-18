# Doctocliq: cómo funciona el producto por dentro

Medido el 2026-10-01 desde las páginas públicas (Playwright + Chromium headless). Capturas en `doctocliq/`. **Límites:** no se creó cuenta. El centro de ayuda (Zendesk) devuelve 403 sin login. YouTube bloquea esta IP
(«Sign in to confirm you're not a bot» en yt-dlp, página `/sorry` en Chromium), así que **no se vio ningún
tutorial**: todo sale del texto y las imágenes de UI del sitio. Inferencia = *(inf.)*. Fuentes [n] al final.

## 1. Módulo por módulo

**Agenda.** Vista diaria, semanal o mensual, por doctor y por sillón o cabina. Cada doctor ve solo su agenda y el
dueño ve todas [2]. Para reprogramar se arrastra la cita [3]. Estados: pendiente, confirmada, cancelada, atendida
y no se presentó [2][3]. Hay citas repetidas: la opción «Frecuencia» crea toda la serie hasta una fecha [3]. Importa
desde Google Calendar [1]. Con «Agrupación de agendas por equipo» se juntan agendas; solo en Avanzado [1].
**Las cancelaciones no desaparecen:** van a una «lista de citas canceladas pendientes de recuperación», con
tareas de seguimiento para el equipo [2][3]. *Clics (inf.):* crear una cita, 2-3; reprogramar, 1 arrastre.

**Ficha y odontograma.** Ficha con anamnesis, notas de evolución, recetas, etiquetas, alertas de alergia siempre
visibles y archivos (de 1 a 20 GB según el plan) [1][4]. Odontograma y periodontograma para adulto, mixto y niño,
en FDI o ADA, con vistas de diagnóstico, progreso y alta, ajustado a la norma de cada país (MINSA en Perú) [4][5].
Ortodoncia y estética facial van como módulos aparte, en Básico y Avanzado [1]. En Perú, el DNI se valida contra
RENIEC (de pago, por paquetes) [5]. Los menores pueden tener «apoderado», que recibe los avisos [5]. Formatos de
historia a medida: «adicional» [1].

**Plan de tratamiento y presupuesto.** El presupuesto y el plan se arman **desde los hallazgos del
odontograma** [4][5]. Desde el menú ⋮ se puede «Agrupar» el presupuesto en fases y descargarlo en PDF (fases solo en
Avanzado) [1][5]. El presupuesto tiene estados (creado, aceptado, rechazado, abandonado, terminado) [6] y cobros
registrados encima, incluidas las cuotas [4][7]. Cuando el doctor marca un ítem «terminado», **se descuenta solo el
stock** de los insumos asociados [5]. El presupuesto impreso puede llevar un QR de pago (solo en Perú) [5].

**Recordatorios.** Canales: WhatsApp (API oficial, Meta Business Partner), email y SMS (este solo en México) [2][8][9].
Son **automáticos**: se configuran en Marketing > Automatizaciones con reglas y plantillas, sin IA [6]. Se eligen
3 días antes, 1 día antes o los dos [2]. El WhatsApp se cobra por créditos: 50/mes en Individual y 100/mes en Básico
y Avanzado, y solo en planes semestrales o anuales. Gratis = sin WhatsApp [1]. El plan gratis puede comprar
paquetes sueltos de mensajes [10].

**Confirmación.** El mensaje trae botones: Confirmar, No podré asistir y Chatear con la clínica (se ve en la imagen
de la UI, [2]). Si el paciente responde, la cita cambia de estado sola y el doctor recibe un aviso [2]. Si cancela,
la cita pasa a la lista de recuperación [2].

**Inactivos, tratamiento a medias, recall** → ver §2.

**Caja y cobros.** Ingresos y egresos, cierre diario, multicaja con permisos y responsable de caja, medios de pago,
reportes en Excel y **comisión por doctor** con varias modalidades [7][11]. Un presupuesto acepta varias monedas
(testimonio, [12]). Los links de pago y el pago anticipado de la cita (Yape, Plin, tarjeta) son solo para Perú [1][5].
Básico trae caja «básica»; los permisos, la multicaja y el link de pago son de Avanzado [1].

**Facturación.** Es un add-on, solo en Básico y Avanzado [1]. Cubre Perú (SUNAT), México (SAT), Ecuador (SRI),
Colombia (DIAN, también vía Alegra) y República Dominicana, a través de proveedores autorizados [1][9].
Flujo: se cargan los datos fiscales del paciente, se elige «Factura» al cobrar y la factura sale por correo, PDF o
WhatsApp [9]. **Bolivia no figura.**
**Inventario.** Stock, órdenes de compra, vencimientos y avisos de faltante o de vencimiento [11]. El consumo se
descuenta solo al terminar un tratamiento [5]. Las órdenes de laboratorio van con trazabilidad [1][12]. Inventario y
laboratorio son solo de Avanzado [1].

**Reportes.** Demografía (edad, ubicación, canal de origen), tratamientos más vendidos, productividad por doctor,
ausentismo, ingresos y egresos mes a mes y año a año, con descarga [11][13]. Hay un embudo Lead → Nuevo →
Convertido con el ingreso de cada etapa [6]. Solo en Avanzado [1].

**Reserva online.** Link por doctor para la web, Instagram o WhatsApp. El paciente elige doctor y motivo (cada
motivo tiene su duración) y ve el precio. Se puede **exigir el pago previo** (solo Perú) [2][3][5]. Viene en todos
los planes, incluso el gratis [1]. Hay además un formulario de registro del paciente por QR o link, solo en
Avanzado [1].

**IA.** (a) **Soyla IA** (add-on, solo con plan semestral o anual). Es un agente sobre la API oficial de WhatsApp
que usa el número actual de la clínica. **Consulta y bloquea horarios reales**, agenda, reprograma, reconoce al
paciente existente, crea la ficha del lead nuevo y pasa a una persona cuando hace falta. La instalación tarda de 3
a 7 días hábiles y la entrena Doctocliq [8]. (b) Su soporte usa IA de primer nivel y después un humano [14].
(c) Soyla también redacta mensajes de cobranza [15].

**App móvil.** «Doctocliq», de Zolupro S.A.C., en iOS y Android. En Play Store: 3,4★ con 46 reseñas y más de
10 mil descargas [16]. Viene en todos los planes [1]. Según la web, sirve sobre todo para manejar la agenda desde el
celular [9].

**Onboarding y alta.** Landing → «Crea tu cuenta gratis» → `/registro` con correo + contraseña, o Google, o Apple [17]
→ código de verificación por WhatsApp (lo vivió Sergio Urcullo; no es público) → sistema. Son unos 3 pasos y no
piden tarjeta. Al entrar arranca la **prueba de 7 días del plan Avanzado** sin add-ons [9]. Después se paga o se
**baja al plan Gratis «cuando quieras, incluso el primer día»**, sin perder datos [10]. Hay importación de
pacientes con una plantilla Excel, que valida duplicados [3]. La migración asistida es gratis en los planes de
pago [1][10]. La demo con un asesor (20-30 min) es opcional [2].

**Plan gratis.** Incluye 1 doctor, **30 pacientes o citas por mes**, agenda, historia clínica con odontograma,
presupuestos y pagos, recetas, reserva online, app y 8 usuarios gratuitos (administrativos o invitados) [1].
**No incluye:** WhatsApp, caja, consentimientos, archivos, reportes, inventario ni marketing [1]. Solo da centro de
ayuda y videos, sin acompañamiento [10]. Al llegar a las 30, se espera al mes siguiente o se pasa a un plan de
pago [10]. **Si la cuenta pasa 2 meses sin uso, se inhabilita** [9].
Planes pagos: Individual USD 19, Básico 29 y Avanzado 49 por mes, **por doctor**. En Perú cada doctor extra cuesta
S/ 30 [1][5]. El anual trae 2 meses gratis [1].

## 2. Pregunta central: ¿hay recall del tratamiento a medias?

**Sí, pero como segmento + campaña, no como agente.** Así funciona:
1. **Segmentar.** En el CRM/Marketing se filtran pacientes por «abandonaron el tratamiento» [11], por **estado del
   presupuesto (creado / aceptado / rechazado / abandonado / terminado)**, por última visita (por ejemplo, «inactivos
   hace 6 meses»), por tratamiento, edad, sexo y fuente [6]. Trae segmentos de ejemplo: «Primera cita sin
   retorno», «Tratamiento recurrente» y «Cancelaron sin reagendar» [6].
2. **Actuar sobre el segmento** de tres maneras: campaña de WhatsApp (plantilla aprobada por Meta, cobra créditos) o
   de email, programada y con métricas de aperturas, respuestas y citas generadas; **tarea masiva** asignada a una
   persona del equipo («contactá a estos»); o cobranza directa [6].
3. **Automatizaciones con reglas**: control semestral, post-consulta, cumpleaños, reseña de Google, deuda [9][15].
**Lo que NO hace (según lo público):** no detecta un paciente a medias para proponer el mensaje; alguien tiene que
armar el segmento y la campaña. Tampoco está en el plan base: **Marketing es un add-on de Básico y Avanzado y
solo con contrato semestral o anual** [1]. No se pudo ver dentro de la app si el estado «abandonado» se marca solo o
a mano *(sin verificar)*.

## 3. Ellos vs. Onia

Fuente de lo de Onia: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (2026-10-01).

| Tema | Ellos tienen | Onia tiene | Quién lo hace mejor |
|---|---|---|---|
| Agenda | Por sillón, arrastrar, serie, lista de canceladas, Google Cal | Agenda y citas | Ellos |
| Ficha y odontograma | FDI/ADA, 3 denticiones, periodontograma, ortodoncia | Historia clínica + odontograma | Ellos (más profundo) |
| Plan y presupuesto | Desde el odontograma, fases, estados, QR de pago | Tratamientos + cobros | Ellos |
| Recordatorio | WhatsApp/email/SMS automático, 3d/1d | Solo **correo**, 24 h y 2 h, automático | Ellos |
| Confirmación | Botón en WhatsApp que actualiza la cita | Agente «confirmador» (propone, el dueño aprueba) | Ellos (sin intervención) |
| Tratamiento a medias | Segmento + campaña manual, add-on semestral | **Agente diario que lo detecta y propone**, desde Crece | **Onia** |
| Caja y cobros | Multicaja, comisiones por doctor, link de pago (Perú) | Cobros, caja, «cobrador», contabilidad, planilla | Empate (Onia: contabilidad; ellos: comisiones) |
| Facturación | 5 países, sin Bolivia | SIAT en certificación, apagado | Nadie en Bolivia hoy |
| Inventario | Stock, vencimientos, OC, descuento al terminar un tratamiento | Inventario de insumos | Ellos |
| Reportes | Demografía, productividad, embudo | `/reports` desde Profesional | Ellos |
| Reserva online | Link por doctor, pago previo, también en el gratis | Link desde Crece | Ellos |
| IA | Soyla: agenda dentro de WhatsApp | Agentes que proponen; el bot WhatsApp no sale todavía | Ellos en el chat; Onia en el back-office |
| App móvil | iOS/Android (3,4★) | No figura | Ellos |
| Alta | Unos 3 pasos, código por WhatsApp, 7 días | 2 pasos con rubro elegido, 14 días sin tarjeta | Onia (menos fricción, más días) |
| Plan gratis | Para siempre, 30/mes | No hay; solo lectura al vencer | Ellos (embudo) |
| Equipo | 8 usuarios gratis, cobran por doctor | Crece = 4 usuarios | Ellos para 2-6 doctores *(revisar precio)* |
| Contabilidad y planilla | No | Sí | **Onia** |
| Bolivia (Bs, QR BCP, SIAT) | No | Sí (SIAT en camino) | **Onia** |

## 4. Top 5 que tienen y a Onia le falta (para una clínica de 2-6 profesionales en Santa Cruz)

1. **Recordatorio y confirmación por WhatsApp con botón** que cambia el estado de la cita solo. Es el dolor diario
   de la recepción, y Onia hoy solo manda correo.
2. **Presupuesto desde el odontograma, por fases y con estados** (aceptado / abandonado). Es la venta del
   tratamiento y alimenta el recall.
3. **Agenda por sillón y la lista de «canceladas pendientes de recuperar»**: con 2-6 profesionales comparten sillones.
4. **Comisiones por doctor dentro de caja.** Con varios profesionales es la cuenta de fin de mes.
5. **App móvil** para que el dueño vea la agenda y la caja desde afuera.
(Quedan afuera a propósito: el plan gratis y Soyla, que son modelo comercial o add-on, no gestión de la clínica.)

## 5. Top 3 que Onia hace mejor

1. **Tratamiento a medias como agente diario:** lo detecta, propone y el dueño aprueba en «Pendientes». En
   Doctocliq es un segmento que alguien tiene que armar, en un add-on que solo se vende semestral o anual.
2. **Hecho para Bolivia:** bolivianos, QR del BCP y SIAT (cuando salga). Doctocliq no factura en Bolivia.
3. **Back-office completo en el plan:** contabilidad, planilla, gastos y agentes cobrador y reprogramador. Además, el
   alta es más corta y la prueba dura 14 días contra 7.

## Fuentes

[1] doctocliq.com/planes-y-precios (tabla y FAQ) · [2] /funcionalidades/agenda-medica-digital · [3] /agenda-medica-y-recordatorios · [4] /funcionalidades/historia-clinica-dental · [5] /pe/software-dental (FAQ) · [6] /funcionalidades/marketing (FAQ) · [7] /software-de-gestion/caja-y-facturacion-electronica · [8] /soyla-ia · [9] /preguntas-frecuentes · [10] /software-de-gestion-clinica-gratis · [11] /funcionalidades · [12] home doctocliq.com (FAQ, testimonios) · [13] /funcionalidades/estadisticas-y-reportes · [14] /soporte-tecnico-doctocliq · [15] /blog/seguimiento-de-pacientes-clave-consultorio-rentable · [16] Play Store, búsqueda «doctocliq» (com.doctocliq.android) · [17] doctocliq.com/registro (solo se miró, no se llenó).

## Contenido, pauta y comunicación (medido 2026-10-08)

> Nota de método: de los anuncios, la API de la Biblioteca solo da titular, fecha y moneda. El texto, los fotogramas y el destino de 8 anuncios salen de las **capturas de la madre del 2-oct** (`research/competencia/anuncios/doctocliq/`). Los videos de YouTube se leyeron con los **subtítulos automáticos** y los **fotogramas de 1 por segundo** que YouTube publica (101x180 en vertical, 320x180 en horizontal). **No se oyó audio**: música y efectos quedan sin medir. Los ganchos van parafraseados. Esto cierra lo que el teardown del 1-oct dejó pendiente («no se vio ningún tutorial»).

### Cobertura
- **Redes (enlaces del pie de doctocliq.com):** TikTok `@doctocliq` (**15,2 mil seguidores, 80,7 mil «me gusta», 658 videos**; leído de la página pública) · YouTube `UCN0TWn7Ki2QjJy7jl9NAVrw` (**1,14 mil suscriptores**) · Facebook `doctocliq` (**3.053 seguidores**, 1.314 «hablando de esto») · Instagram @doctocliq (**no se pudo**: login y 429) · LinkedIn `company/18154480` (no leído). *(El «39,6 mil suscriptores» que aparece en el canal es otro canal, CursosOdonto3D, con el que hacen colaboraciones.)*
- **Videos mirados:** 8 de YouTube. Con subtítulos y fotogramas: 5 (`ZOr9Z3keuZc`, `7ymXxHiuZbk`, `bgzM_hvZ9Ys`, `zU2o3Ro9HQ8`, `0_A2n9VStvY`). Solo subtítulos: 3 (`QO7GckAqeao`, `GQEhUOs7J0Y`, `7dfudqEiv3M`). **Anuncios con texto y cuadros: 8** (ids `1014591764512827`, `895549733230235`, `1952892278698712`, `2611078469391009`, `1476934190941729`, `1552115046722567`, `1089330193788206`, `1684698082830679`), vistos como imagen fija, no como video. Faltan los 22 restantes.
- **Método:** Gemini nativo dio «exceeded your current quota» (no se reintentó). La descarga de video de YouTube está bloqueada para esta IP (PO token, 429); subtítulos por el cliente iOS de yt-dlp, fotogramas por el storyboard. El catálogo de TikTok falló en yt-dlp (error de JSON), así que de TikTok solo hay los conteos del perfil. Biblioteca de Meta con `ads_library_search`: funcionó.
- **No se pudo:** Instagram y Facebook en detalle, vistas de TikTok, el video de los anuncios, el audio, anuncios por país más allá del conteo en Bolivia.

### Estructura de contenido orgánico
- **Es el más productivo en volumen de los tres, y casi nada es producto.** 658 videos en TikTok, 120 listados en YouTube (80 largos y 40 Shorts) y 2 recursos en la web (calculadora de hora sillón y diagnóstico del perfil de Google Maps).
- **YouTube (80 videos largos + 40 Shorts listados), mezcla aproximada:** ~27 tutoriales **de WhatsApp, Meta y Google que no son del producto** (verificar el negocio en Meta, plantillas, costos del cambio de tarifa, WhatsApp Business contra API, bloqueos, reseñas de Google, Google Maps) · ~18 de **gestión y finanzas del odontólogo** (rentabilidad, costo por hora sillón, cómo pagar a doctores, cómo subir precios, embudo de ventas, SEO) · ~15 entrevistas del **pódcast «Rentabiliza tu consultorio»** con invitados (varias numeradas del #25 al #29), de 1 hora o más, 100-500 vistas · ~8 **testimonios y casos** · ~8 de producto (periodontograma, Soyla IA, facturación con Alegra en Colombia, versión para Ecuador).
- **Qué rinde más (vistas):** (1) un **testimonio de un odontólogo** de 2 min, ≈9.400 (nov-2024); (2) un **video sobre COFEPRIS** (norma de publicidad de México), ≈7.700, 43 min; (3) **«Meta Business Agent: activa la IA de WhatsApp Business»**, ≈7.600, 6 min (25-ago-2026); (4) **«No puedo verificar mi negocio en Meta»**, ≈3.700; (5) «Software dental gratis», ≈3.000 (mar-2026, 2 min). Lo del producto en sí no pasa de unos cientos.
- **Shorts de YouTube (los 40 más nuevos):** vistas **mediana ≈200**; el techo es ≈1.800 (qué es la verificación de WhatsApp), ≈1.100 («especialista contra empresario»), ≈1.000 (la «dentinovela» de IA), ≈900 (humor del call center). Mezcla: ~11 de WhatsApp y Meta, ~23 de gestión y negocio, 3 de humor o ficción, 3 de producto (Soyla y versión por país).
- **Frecuencia (con 10 fechas de muestra):** en YouTube, **11 videos largos en 42 días** (25-ago → 6-oct, ≈1,8 por semana; **verificado el 8-oct con las fechas de los 16 videos más nuevos**: 11 de 16 caen en ese tramo y el más viejo de los 16 es del 17-jun) y ≈0,9 Shorts por semana en el último año; en TikTok, 658 videos acumulados. El último video largo es de hace 2 días (6-oct, «por qué tu agente de WhatsApp no convierte leads en pacientes»).
- **Idiomas:** español e inglés (*inferencia:* los títulos en inglés buscan tráfico de búsqueda fuera de LatAm). Países que nombran: Perú, México, Ecuador y Colombia. **Nada de Bolivia.**
- **Facebook:** 3.053 seguidores; es el canal más chico de los que se pudieron medir.

### Pauta en Meta (`ads_library_search`, 8-oct-2026)
- **Página Doctocliq (id 122294408384514): 30 anuncios, todos activos** (30 en total y 30 con filtro «activos»). **Moneda MXN.** En Bolivia: **0**.
- **15 de los 30 llevan más de 30 días al aire.** Los más antiguos: **17-jul (83 días)**, 23-jul (76), 15-ago (54), 18-ago (51) y 25-26-ago (42-44).
- **Los 30 son ~13 conceptos con varias copias** (por titular):

| Concepto (titular) | Cant. | Primer inicio | Días al aire |
|---|---|---|---|
| «Todos ven lo mismo. Tú tienes el control.» (permisos por rol) | 5 | 25-ago | 44, 44, 35, 34, 10 |
| «Prueba Doctocliq ahora / hoy» | 5 | 17-jul | 83, 76, 51, 42, 13 |
| «Esa paz mental es posible con Doctocliq» | 4 | 14-sep | 24, 13, 13, 10 |
| «¿Tu consultorio funciona sin tu asistente?» | 3 | 14-sep | 24, 24, 10 |
| «La agenda que trabaja contigo» | 2 | 17-jul | 83, 83 |
| «¿Y por qué tú aún no digitalizas tu gestión?» | 2 | 15-ago | 54, 10 |
| «El éxito no es casualidad» | 2 | 18-ago | 51, 42 |
| «Toda tu clínica en un solo lugar» | 2 | 14-sep | 24, 10 |
| Uno solo cada uno: «Dejá de perder citas. Mira cómo lograrlo.» (54 d) · «¿Tu consultorio crece o solo sobrevive?» (51 d) · «Evita cancelaciones de última hora» (24 d) · «Controla tu consultorio» (16 d) · «Menos administración. Más odontología.» (16 d) | 5 | — | — |

- **A fondo, los que más duran (con captura de la madre):**
  1. `1014591764512827` y `1738720983808867`, **«La agenda que trabaja contigo»** (**83 días**): video de 30 s; historia de familia (el hijo cuenta que su papá llegaba tarde a cenar por un paciente más, una llamada más); el doctor con el celular y un link de reserva; recordatorios automáticos. Texto: reserva online y recordatorios para «tener menos sorpresas». Botón «Ver detalles», destino **`doctocliq.com/ecuador`**.
  2. `1748838402916201` y `1952892278698712`, **«Prueba Doctocliq ahora»** (**83 y 76 días**): el segundo es un **video de 10 s** con una doctora de aspecto sintético hablándole a la cámara (no verificado que sea generada); frase única sobre su tiempo y su almuerzo; tarjeta final «Reduce cancelaciones con Doctocliq».
  3. `895549733230235`, **«Dejá de perder citas. Mira cómo lograrlo.»** (**54 días**): **testimonio real de 31 s** del Dr. Juan González (Ecuador), que enseña la ficha en una tablet y un recordatorio de WhatsApp. Texto: un paciente que cancela es plata que se va y el ausentismo cuesta «hasta el 25 %» de los ingresos.
  4. `1684698082830679`, **«¿Tu consultorio crece o solo sobrevive?»** (**51 días**): **testimonio real de 66 s** del Dr. Gustavo Watanabe (5 años usando Doctocliq) que pasa por pantallas reales (ficha desde el celular, odontograma, reportes de ingresos, campaña por WhatsApp).
  5. `1089330193788206`, **«El éxito no es casualidad»** (**51 días**): video de 26 s, relato en primera persona de una doctora con escenas generadas con IA y después reportes reales; cierre «+4000 doctores» y «Pruébalo gratis».
- **Textos, titulares y botones:** el texto abre con **dinero o tiempo del dueño** y recién después la función; un solo CTA por pieza: «Ver detalles» o «Más información» (el de «¿funciona sin tu asistente?» manda a un diagnóstico de dependencia de la asistente). **Destino:** la web con «Crea tu cuenta GRATIS» o `doctocliq.com/ecuador`.
- **Formatos (de los 8 con captura):** 8 videos (10, 10, 10, 26, 30, 31, 31 y 66 s) y ninguna imagen fija. **3 con gente real** (dos testimonios con pantalla y un doctor contando su día) y **5 con escenas generadas con IA** (en una, la doctora es de aspecto sintético y no está verificado).
- **Países:** la moneda es MXN y un destino es Ecuador; no se puede saber más (la API no devuelve países por anuncio sin probar uno por uno).
- **Lo que enseña:** el ganador es el **concepto emocional con persona** (las dos historias de 83 días son «tiempo con la familia» y «frase de una doctora»), no la función. Y **sostienen cada concepto en 2-5 copias** y suman conceptos nuevos **por tandas**, no semana a semana *(corregido el 8-oct: antes decía «uno nuevo cada 1-2 semanas»; las fechas de inicio de la Biblioteca muestran 13 conceptos en 5 tandas: 17-jul (2), 15-18-ago (4), 25-ago (1), 14-sep (4) y 21-22-sep (2), con 1-4 semanas entre una y otra)*. El 28-sep (último inicio) no entró ningún concepto nuevo: solo copias nuevas de cinco conceptos que ya corrían («Todos ven lo mismo», «Esa paz mental», «¿funciona sin tu asistente?», «Toda tu clínica», «¿Y por qué tú aún no digitalizas?»).

### Comunicación
- **Titular de la web (home):** H1 «Software dental y médico»; subtítulo «Impulsa tu clínica sin perder el control»; apoyo «una solución todo en uno».
- **A quién le habla:** odontólogos, médicos especialistas, clínicas estéticas y fisioterapeutas; independientes y clínicas con varios doctores; Latinoamérica con adaptaciones fiscales para Perú, México, Ecuador y Colombia. Tono de tú, cercano y comercial («sin estrés ni desorden»).
- **Prueba:** +20 países, +4000 doctores, «+30 % de ingresos» (sin fuente), 8 testimonios con foto y clínica, casos en video, logos de colegios y sociedades odontológicas de Perú, premios (Forbes 100 Perú, Endeavor, StartUPC) y sello de **Meta Business Partner**.
- **Precio:** **no hay montos en la home**; sí en `/planes-y-precios` (USD 19, 29 y 49 por mes por doctor, ver el teardown). Banner superior con promo de −25 % en planes semestrales y anuales.
- **Clics hasta empezar: 1.** «Crea tu cuenta gratis» (cabecera) o «Prueba GRATIS» (hero) van directo a `/registro`. Cada bloque repite «7 días gratis. No requiere tarjeta de crédito.»
- **CTA:** «Prueba GRATIS» y «Habla con un asesor» (formulario al final).
- **Estudios y recursos:** guías de gestión, calculadora de hora sillón, diagnóstico de Google Maps, estudios de mercado de LatAm (costos por hora en México, gestión odontológica en Perú), pódcast y eventos.

### Guiones de sus videos y anuncios
| Pieza | Gancho (0-3 s) | Tramos | Cierre |
|---|---|---|---|
| Anuncio `1014591764512827` (30 s, 83 d) | Tres frases cortas: siempre hay un paciente más, una llamada más, un pendiente más | 3-12 s: el hijo cuenta que su papá llegaba tarde a cenar · 12-22 s: ahora los pacientes se separan la cita con un link que él les manda · 22-28 s: recordatorios, «ya no hay sorpresas», el papá llega a cenar | «+4000 doctores» y «Crea tu cuenta GRATIS» |
| Anuncio `895549733230235` (31 s, 54 d), testimonio | El doctor, en su clínica, nombrado con bandera de su país | su papá fundó la clínica; lo digital lo deja enfocarse; ficha en la tablet; recordatorio de WhatsApp en el celular; «mis pacientes siempre vuelven» | cartela «Rentabiliza tu consultorio» |
| Anuncio `1952892278698712` (10 s, 76 d) | Una frase a «Doctora»: su tiempo y su almuerzo valen demasiado para que le cancelen | una sola idea, una sola escena | tarjeta «Reduce cancelaciones con Doctocliq» y botón |
| Anuncio `1552115046722567` (31 s, 10 d) | ¿Qué pasa si tu asistente falta un día? | un doctor real cuenta su día caótico: 37 mensajes de WhatsApp, historias clínicas sin encontrar; toda la organización está en la cabeza de una persona | «Descubre qué tan dependiente es tu operación» (diagnóstico), sin mostrar el producto |
| Short Soyla `ZOr9Z3keuZc` (203 vistas, 58 s) | «¿Sabías que hay clínicas que suben sus ingresos porque dejaron de contestar mensajes?» | 7-22 s: cuántas veces al día contestas lo mismo y pierdes oportunidades · 22-43 s: la IA contesta el WhatsApp que ya tienes y agenda sola · 43-52 s: «ya hay clínicas vendiendo más» | «Ya te dejé la info, ahora está en ti decidir» |
| Short humor `7ymXxHiuZbk` (914 vistas, ~40 s) | Reproche irónico: estudiaste 6 años para contestar chats en la cama | 6-20 s: el paciente que pregunta precio un domingo a las 6 · 20-33 s: la IA entrenada con doctores reales contesta horarios, precios y ubicación 24/7 | «Usa Soyla IA» y un insulto en broma |
| Testimonio `0_A2n9VStvY` (≈9.400 vistas, 120 s) | «No deja de sorprenderme, llevo casi 4 años» | odontograma, facturación, recordatorios, presupuestos, ingresos/egresos, inventario, estadísticas, CRM por WhatsApp; por qué lo eligió: costo-beneficio | recomendación personal; sin botón |

Patrón: **los anuncios abren con una frase sobre el tiempo o la plata del dueño y cierran con «crea tu cuenta gratis»; el producto aparece al final y de pasada**. En orgánico es al revés: **abren con el tema del oficio (WhatsApp, precio, equipo), el producto casi no aparece**.

### Edición
- **Anuncios (hoja de fotogramas de la madre):** **logo cian en una esquina desde el primer cuadro**; subtítulos en mayúsculas con **caja turquesa**; rótulo con nombre y bandera («Dr. Juan González 🇪🇨»); **cartela final blanca con logo, el lema «Rentabiliza tu consultorio» y una línea con «más de 3.500 doctores»**. Cuatro tipos: testimonio real a cámara con pantalla en tablet, **mini-historia de familia generada con IA** (niño en la mesa, doctor con celular), **doctora generada con IA** en consultorio de tonos pastel (10 s, con diálogo) y **doctor real contando su día** con B-roll de archivos apilados y pasillo.
- **Shorts orgánicos (5 con fotogramas):** (1) **humor POV** (`7ymXxHiuZbk`): una chica en la cama con el celular, **memes de reacción** (un gato, una cantante, una famosa) y capturas reales de WhatsApp con la **mascota dibujada «Soyla»**, un corte cada ~1-1,5 s; (2) **presentadora recortada con borde blanco sobre B-roll de archivo** (`zU2o3Ro9HQ8`); (3) **presentadora en bata blanca con burbujas de chat superpuestas** y mascota enfermera dibujada, cierre sobre **fondo verde** (`ZOr9Z3keuZc`); (4) **«dentinovela» de personajes 3D con dientes de cabeza, hecha con IA**, sin subtítulos que se distingan (`bgzM_hvZ9Ys`); (5) **testimonio de 120 s** con el doctor en su consultorio y **pantalla dividida con grabaciones del sistema** (`0_A2n9VStvY`).
- **Subtítulos (estimado):** mayúsculas blancas, condensadas, con contorno oscuro, abajo; la palabra que se dice va en **caja turquesa**; 2-5 palabras por línea. Es la misma lógica de karaoke que Clinera.
- **Primeros 3 s (`7ymXxHiuZbk`):** s0-1 una chica en la cama con el celular y una repisa de libros detrás; s2 subtítulo «estudiaste 6 años»; s3-4 corte a un meme de una cantante con «perdóname a todos / no acepto».
- **Duración y formato:** anuncios de 10 a 66 s; Shorts de 40 a 60 s; testimonios de 2 min; verticales; los tutoriales de Meta, de 3 a 6 min en horizontal.
- **No se pudo medir:** música, efectos, tipografía exacta, voz de los personajes generados.

### Qué toma Onia (pauta de Onia Platform y web) y qué NO
**Toma, para probar:**
1. **El micro-video de 10 s con una sola frase al dueño** (76 días al aire; *inferencia:* es de lo más barato de producir). Para Onia: una frase en **usted** sobre la plata o la hora de la clínica, la pantalla real de «Pendientes» y un botón. Se adopta la estructura, no su frase («Doctora, tu almuerzo…»).
2. **15 de 30 anuncios pasan los 30 días y son solo 13 conceptos:** se sostiene un concepto en 2-5 copias y se suma una tanda de 1-4 conceptos nuevos cada 2-4 semanas (medido, no cada ~10 días). Para Onia, con un presupuesto chico: 2 conceptos × 2-3 copias, no 10 piezas distintas (coincide con §2.6).
3. **El diagnóstico como botón** («descubre qué tan dependiente es tu operación»): un cuestionario corto de 5 preguntas sin software, que captura el lead y no promete una función. Hipótesis, a probar contra el WhatsApp de Sergio Urcullo.
4. **«7 días sin tarjeta, 1 clic»:** Onia puede decir **14 días sin tarjeta** y es lo que más pesa contra Dentalink (demo y cotización) y contra Doctocliq (7 días).
5. **Para el contenido de Sergio Urcullo (no es pauta):** los tutoriales de **WhatsApp Business, verificación en Meta, plantillas y costo de mensajes** son lo que más vistas saca en su YouTube (hasta ≈7.700) y no son producto. El cambio de tarifa de WhatsApp de octubre-2026 es un tema del momento; el dato sale de Doctocliq y **hay que verificarlo en Meta antes de repetirlo**. Encaja con «IA para negocios en Bolivia» y con el add-on de WhatsApp de Onia.

**No toma, y por qué:**
- **Plan gratis permanente y prueba de 7 días** (ya descartado en el BACKLOG): regala horas de soporte.
- **«+4000 doctores» y «+30 % de ingresos»:** Onia tiene cero clientes; no se fabrican.
- **Testimonios o presentadores generados con IA que hacen de doctor o de familiar:** CLAUDE.md lo prohíbe (el presentador de IA explica y demuestra, nunca se hace pasar por odontólogo ni por cliente). Doctocliq usa escenas generadas con IA en 5 de sus 8 anuncios capturados.
- **La «dentinovela» y los sketches con memes:** el tono de Onia es sobrio; «muy IA» es motivo de rechazo y ≈1.000 vistas no lo justifican.
- **Un producto «para todos» (dental, médico, estética, fisio):** Onia empuja dental primero y luego importadora.
- **Soyla «vende por ti»:** Onia propone y el dueño aprueba (catálogo §5 y §8).
- **Una línea editorial de «gestión del consultorio»** (precios, equipo, finanzas, pódcast): es contenido que genera tráfico, pero abre una línea de negocio para Sergio Urcullo que hoy no pasa el test de tres preguntas; se anota, no se hace.
