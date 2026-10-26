# Capturas hechas: anuncios de la competencia (1-oct-2026)

Responde a `hermes-content/docs/historial/research/competencia/PEDIDO-CAPTURAS.md`. Capturado el 1-oct-2026 (20:30-21:10, hora de La Paz) desde la PC de Sergio Urcullo,
con Playwright headless, **sin iniciar sesión** en Facebook. Se abrió `facebook.com/ads/library/?id=<id>` y se capturó
la tarjeta del anuncio con el texto completo desplegado («Ver más»).

**Resultado: 18 ok · 0 ya no corren · 4 bloqueados** (no aparecen en la Biblioteca pública; ver abajo).

## Cómo leer los archivos

Carpeta `<anunciante>/`:

- `<id>.png`: la tarjeta entera tal como la muestra la Biblioteca (texto principal completo, creativo, titular y botón).
- `<id>.txt`: el texto visible de la tarjeta, con fecha de inicio, plataformas y duración si es video.
- **Imagen:** `<id>-2.png` es el creativo a su resolución original (600 px de ancho como mucho, lo que entrega Meta).
- **Video:** `<id>-2.png`, `-3`, `-4` son cuadros del inicio, el medio y el final, a la resolución que entrega la
  Biblioteca (360 px de ancho). La voz no se transcribió: hubiera hecho falta descargar el mp4. Lo que dice el video
  se reconstruyó con los subtítulos quemados en pantalla (sección «Qué cuentan los videos»).
- **Varias versiones:** `<id>-v2.png` es la versión 2 (sacada de «Ver detalles del anuncio»).

Ningún archivo pasa de 600 KB, así que todos quedaron en PNG.

## La tabla

| # | Anunciante | id | Archivos | Formato | Titular | Texto principal (inicio) | CTA | Estado |
|---|---|---|---|---|---|---|---|---|
| 1 | doctocliq | 895549733230235 | .png, -2/-3/-4 | video 31 s (testimonio real) | Dejá de perder citas. Mira cómo lograrlo. | Un paciente que te cancela a última hora no es solo un espacio vacío en tu agenda: es dinero que dejas de recibir. El ausentismo puede costarte hasta el 25% de tus ingresos mensuales. | Ver detalles | ok |
| 2 | doctocliq | 2611078469391009 | .png, -2/-3/-4 | video 10 s (generado con IA) | Evita cancelaciones de última hora | Doctora, un sillón vacío no solo te quita el tiempo, te cuesta dinero. Asegura tus citas con confirmaciones automáticas por WhatsApp. | Ver detalles | ok |
| 3 | citapro | 1073401725052434 | .png, -2 | imagen | 📅 Más citas confirmadas, menos ausencias | 💡 El secreto de las clínicas y centros estéticos con agenda llena de verdad... / No es agendar más citas 📅 | Más información (pide demo) | ok |
| 4 | medizona | 1626779772573913 | .png, -2/-3/-4 | video 30 s (generado con IA) | Deja de confirmar citas una por una | ¿Cuántas citas se te pierden por anotarlas en una libreta? Con Medizona las confirmaciones son automáticas y tus asistentes también pueden ver la agenda... | Más información (formulario) | ok, impresiones bajas, 4 h al aire |
| 5 | nativecode | 1401049335530050 | .png, -2 | imagen | Reduce las inasistencias de tus pacientes | ¿Pierdes horas porque tus pacientes no llegan? 📅 / Reduce las inasistencias con recordatorios automáticos por WhatsApp... | Enviar mensaje de WhatsApp | ok, impresiones bajas, 9 h al aire |
| 6 | nativecode | 1788651168932693 | .png, -2 | imagen | Evita horas vacías en tu agenda | ¿Te bloquean una hora y después no aparecen? / Una cita perdida no solo deja un espacio vacío: también afecta tu organización y tus ingresos. | Enviar mensaje de WhatsApp | ok, impresiones bajas, 9 h al aire |
| 7 | calendico | 1335618932975260 | .png, -2/-3/-4 | video 19 s (UGC + pantalla) | Tu WhatsApp que Gestiona Citas | Con Calendico SOLO dedicate a tu negocio 😁 / No pierdas tiempo coordinando citas por WhatsApp... ¡Pruebalo Gratis! | Ver detalles | ok |
| 8 | doctocliq | 1014591764512827 | .png, -2/-3/-4 | video 30 s (generado con IA) | La agenda que trabaja contigo | Siempre hay un paciente más. / Una llamada más. / Un pendiente más. | Ver detalles | ok |
| 9 | citapro | 1880949689530541 | .png, -2/-3/-4 | video 62 s (presentadora + gráficos) | ✨ Cabinas llenas, agenda bajo control | ✨ El secreto de los centros estéticos que llenan su agenda cada semana... / No es bajar los precios 💰 | Más información (pide demo) | ok |
| 10 | doctocliq | 1952892278698712 | .png, -2/-3/-4 | video 10 s (**el mismo video que el #2**) | Prueba Doctocliq ahora | Doctora, tu tiempo (y tu almuerzo) valen demasiado para que te cancelen a última hora. Prueba Doctocliq hoy. | Ver detalles | ok |
| 11 | citapro | 2253602242100999 | .png, -2 | imagen | 🤖 Tu WhatsApp en piloto automático | 💡 El secreto de los negocios de salud y belleza que dejaron de vivir pegados al WhatsApp... / No es contratar a alguien más 🧑‍💼 | Más información (pide demo) | ok |
| 12 | doctocliq | 1089330193788206 | .png, -2/-3/-4 | video 26 s (IA + pantallas reales) | El éxito no es casualidad | Hay personas que cuando una doctora tiene éxito creen que tuvo suerte. Que alguien la ayudó... | Ver detalles («Pruébalo gratis») | ok |
| 13 | doctocliq | 1684698082830679 | .png, -2/-3/-4 | video 66 s (testimonio real + pantallas) | ¿Tu consultorio crece o solo sobrevive? | Ser un gran doctor te trae pacientes. / Tener un consultorio bien gestionado te permite seguir creciendo. 🚀 | Ver detalles | ok |
| 14 | ultrapack | 1578803363704927 | .png, -2/-3/-4 | video 19 s | ARTES Y VIDEOS PARA DENTISTAS | ¡Atención dentistas! 🦷 ¡Hoy es el último día para descontar el pack de vídeos y artes editables! | Descargar | ok (vende plantillas de Canva, no software) |
| 15 | dentalink | 1841299250068821 | (ninguno) | - | Sin descuadres de caja | - | - | **bloqueado** |
| 16 | doctocliq | 1476934190941729 | .png, -2/-3/-4 | video 10 s (generado con IA) | Esa paz mental es posible con Doctocliq | Saber que tu agenda de mañana está 100% confirmada sin que tú o tu secretaria muevan un solo dedo... eso no tiene precio. 💆‍♂️✨ | Ver detalles | ok, impresiones bajas |
| 17 | dentalink | 2555415584886173 | (ninguno) | - | Dicta tus fichas con IA 🎙️ | - | - | **bloqueado** |
| 18 | doctocliq | 1552115046722567 | .png, -2/-3/-4 | video 31 s (doctor real, sin pantallas) | ¿Tu consultorio funciona sin tu asistente? | Tu asistente falta un día… ¿y de pronto nadie sabe qué citas hay, dónde están las historias clínicas o quién responde el WhatsApp? | Más información | ok |
| 19 | dentalink | 1072436212067341 | (ninguno) | - | Más que una simple agenda | - | - | **bloqueado** |
| 20 | dentalink | 1086920147535259 | .png, -2/-3/-4, -v2 | video 38 s (UGC + pantalla), 2 versiones | v1 sin titular · v2: Controla tu clínica dental fácil | v1: solo descripción («Dentalink es el software dental por excelencia...») · v2: Unifica agenda, ficha clínica y cobros en un solo lugar. Deja el caos de las herramientas sueltas... | Get Offer | ok |
| 21 | medilink | 2144439396418903 | (ninguno) | - | Haz clic para agendar una demo sin costo ✅ | - | - | **bloqueado** |
| 22 | ultrapack | 1418092519699070 | .png, -2 | imagen (la página Ultra Pack Dentista pauta su software «Agenda en Día») | El sistema que tu clínica dental necesita. | Imagina terminar el día sabiendo exactamente cuánto facturó tu clínica, qué pacientes deben regresar y cómo está tu agenda. | Más información | ok (precio visible: desde US$ 5,90/mes) |

### Los 4 bloqueados

La Biblioteca pública responde en los cuatro: «El anuncio no está en la Biblioteca de anuncios. Lo más probable es que
el anuncio no haya recibido ninguna impresión todavía». Pasó lo mismo con los anuncios hermanos del mismo titular que
devuelve `ads_library_search`: Dentalink 1833793297760274, 2457523321404475 y 1463415612360328 («Sin descuadres de
caja»), 1620258789646398 y 1421947859901914 («Dicta…»), y 1082957234593106 («Más que una simple agenda»); Medilink
4413869028826709. El navegador integrado de la app muestra lo mismo, y sin sesión iniciada la vista por página tampoco
lista nada. El conector los da por activos, pero la web pública todavía no los muestra. **Para verlos hace falta
reintentar en unos días o abrirlos con una sesión de Facebook iniciada** (eso no se hizo).

## Qué cuentan los videos (según los subtítulos en pantalla)

- **#1 Doctocliq, 31 s:** testimonio del «Dr. Juan González 🇪🇨» en su clínica: su papá la fundó, lo digital le
  permite concentrarse, muestra la ficha real en una tablet, y el remate es «los recordatorios… y mis pacientes siempre
  vuelven». Hay un recordatorio de WhatsApp en un celular y cierra con «Doctocliq · Rentabiliza tu consultorio».
- **#2 y #10 Doctocliq, 10 s:** video estilizado hecho con IA, una doctora en una clínica de tonos pastel con el
  título «Capítulo uno: la cita cancelada». Cierra con «Reduce cancelaciones con Doctocliq».
- **#4 Medizona, 30 s:** imágenes generadas con IA de un médico frustrado con su agenda de papel («esto pasa con
  frecuencia», «no hay registro», «en papel no escala»). Muestra la app en el celular, el paciente aparece contento y
  cierra con «Conoce la plataforma más completa para los profesionales de la salud».
- **#7 Calendico, 19 s:** chats de WhatsApp desordenados, «¿Cuánto tiempo de tu semana se va en coordinar turnos?»,
  pantalla real del flujo de reserva, notificación «Tu reserva fue realizada con éxito» y etiquetas «Menos trabajo
  administrativo» y «Más tiempo para tus pacientes». Cierra una mujer en cámara: «Obtené ya tu prueba gratuita
  haciendo click en el siguiente link».
- **#8 Doctocliq, 30 s:** historia de familia generada con IA y contada por el hijo: «Mi papá antes siempre llegaba
  tarde… una llamada más». Después: «separan sus citas solos, con un link… la aplicación les avisa… ya no hay
  sorpresas… mi papá llega a cenar». Cierra con «Únete a los +4000 doctores que confían en Doctocliq · Crea tu cuenta
  GRATIS».
- **#9 CitaPro, 62 s:** presentadora en una cabina estética con mucho efecto gráfico. El cliente escribe para agendar
  y tú no contestas, el paciente cancela a último momento o se confunde de horario. Aparecen un logo con un robot, «un
  asistente con INTELIGENCIA ARTIFICIAL», «agenda citas automáticamente las 24 horas», recordatorios en la pantalla de
  bloqueo y «hasta pide reseñas en Google Maps». Cierra con «regístrate aquí abajo y solicita una demo».
- **#12 Doctocliq, 26 s:** relato en primera persona de una doctora de estética («cuando abrí, más de uno esperaba que
  cerrara en 6 meses… no fue suerte»), con escenas generadas con IA y después reportes reales de Doctocliq
  («Doctocliq me da esa visibilidad; sin ella estaría administrando a ciegas»). Cierra con «+4000 doctores».
- **#13 Doctocliq, 66 s:** testimonio real del Dr. Gustavo Watanabe, «del papel a la nube». Recorre muchas pantallas
  reales: el paciente llena su ficha desde el celular, el odontograma, especialidades, reportes de ingresos y una campaña
  por WhatsApp. Cierra con «Únete a más de 3500 doctores».
- **#14 Ultra Pack, 19 s:** primeros planos de implantes con el texto «Canva Dentista +1000 publicaciones y videos
  editables en Canva» y cierre «Haz clic en Más información».
- **#16 Doctocliq, 10 s:** escena generada con IA con diálogo: «tenemos las citas confirmadas para mañana». Cierra con
  «Esa paz mental ES POSIBLE».
- **#18 Doctocliq, 31 s:** un doctor real cuenta su día: «hoy no pudo venir mi asistente… el número de WhatsApp
  estalló (37)… historias clínicas… empalmando… todo un caos… toda la organización está en la cabeza de mi asistente».
  No muestra el producto; cierra con el logo.
- **#20 Dentalink, 38 s:** creadora UGC que le habla al celular («Sabemos que… pero sigues…») con la pantalla real de
  Dentalink de fondo (ficha, Rx y documentos). Mensajes: «Menos herramientas · Más visibilidad · Más claridad».

## Cómo venden (lo que sirve para rehacer D1)

1. **Gancho = dinero que se pierde, no la función.** «Un sillón vacío te cuesta dinero», «el ausentismo puede costarte
   hasta el 25% de tus ingresos», «una cita perdida afecta tus ingresos». Hablan de recordatorios recién en la segunda
   línea. Doctocliq le habla a «Doctora» en segunda persona.
2. **Fórmula repetida «No es X, no es Y, es Z».** CitaPro la usa en sus tres anuncios («No es agendar más citas… Es lograr
   que cada cita agendada se cumpla»). Al final cierran con tres beneficios cortos y un solo CTA (demo).
3. **La prueba visual que más se escala es una persona.** Doctocliq, con 8 de los 22 anuncios de la lista, mezcla
   testimonios de doctores reales con nombre y país (#1 y #13, con la pantalla real en tablet) y escenas generadas con
   IA (#2, #8, #12 y #16). Los anuncios de imagen (CitaPro, NativeCode, Agenda en Día) muestran UI en un mockup o una
   metáfora con números (9 confirmadas contra 2 ausencias). Los que pasan de 25 s siempre terminan mostrando la pantalla
   real del producto.
4. **CTA de baja fricción y distinto según el anunciante:** Doctocliq manda a la web con «Crea tu cuenta GRATIS» y prueba
   social numérica (+4000 doctores); CitaPro y Medilink piden demo; NativeCode lleva a WhatsApp («Enviar mensaje»);
   Medizona usa formulario. Agenda en Día pone el precio en la pieza (desde US$ 5,90/mes, «sin permanencia») y NativeCode
   también (desde 14.990 mensual).
5. **El que más grita «IA» es el nuevo, no el líder.** CitaPro vende «IA», «piloto automático» y «sin intervención
   humana», con un robot de mascota, y Dentalink apuesta por «Dicta tus fichas con IA». Doctocliq casi no nombra la IA:
   vende paz mental, tiempo con la familia y no depender de la asistente (#16, #8, #18), y usa la IA para producir los
   videos, no como argumento. Nadie tiene un anuncio para el tratamiento que quedó a medias (D4), y en la Biblioteca
   pública ese hueco sigue libre.


## Ronda 2 — 2-oct-2026: cuántos anuncios activos tiene cada uno y cuáles son los más viejos (sin capturas)

Pedido de Ventas y pauta: «mirar en la Biblioteca de anuncios de Meta qué le funciona a la competencia». Países: BO, PE, MX, CO, CL, AR; solo activos. Hecho por la sesión madre v2 con `ads_library_search` y la Biblioteca web sin sesión. Criterio: el anuncio activo más viejo es el que les funciona.

**Estado:** está la búsqueda (conteo y los 5 activos más viejos de cada uno). **Faltan las capturas** (tarjeta, creativo o 3 cuadros, botón, «N anuncios usan esta creatividad»): la corrida se cortó y se frenó para no gastar más sin el OK de Sergio Urcullo. Faltan también AgendaPro, Doctoralia y Eholo.health. Donde dice UNKNOWN, la API no trae el texto y la web devolvió 403 sin sesión.

| Anunciante | Activos (cómo se contó) | Los 5 activos más viejos: inicio · id · titular |
|---|---|---|
| Medizona | 2 | 2026-09-30 · 1133566382434491 · Tu expediente, protegido<br>2026-10-01 · 1626779772573913 · Deja de confirmar citas una por una |
| CitaPro | 13 en todos los países (web, ~13 resultados) / 5 en BO-PE-MX-CO-CL-AR (API) | 2026-07-17 · 1880949689530541 · ✨ Cabinas llenas, agenda bajo control<br>2026-07-24 · 992374430294009 · ✨ Cabinas llenas, agenda bajo control<br>2026-07-29 · 1371570511144697 · ✨ Cabinas llenas, agenda bajo control<br>2026-08-06 · 2253602242100999 · 🤖 Tu WhatsApp en piloto automático<br>2026-09-15 · 1099827399129529 · No se sabe (la tarjeta agrupada no muestra titular; la imagen dice «Responder WhatsApp ya no es trabajo humano») |
| Doctocliq | 19 | 2026-08-14 · 895549733230235 · Dejá de perder citas. Mira cómo lograrlo.<br>2026-08-15 · 1913624476275238 · ¿Y por qué tú aún no digitalizas tu gestión?<br>2026-08-17 · 1089330193788206 · El éxito no es casualidad<br>2026-08-17 · 1684698082830679 · ¿Tu consultorio crece o solo sobrevive?<br>2026-08-24 · 1068421025910916 · Todos ven lo mismo. Tú tienes el control. |
| Medilink (software de gestión clínica de Healthatom, la misma empresa  | 41 activos en BO/PE/MX/CO/CL/AR según la API; ~69 activos en todos los países según la web pública de la Biblioteca | 2026-09-06 · 2003010327017497 · Software médico integral ¡Demo gratis!<br>2026-09-23 · 2040244296608132 · Sin puntos ciegos<br>2026-09-25 · 1562163648540610 · Agenda tu asesoría gratis<br>2026-09-25 · 38622581010690300 · Agenda tu asesoría gratis<br>2026-09-28 · 2330447247695356 · Todo en un solo sistema |
| Calendico | 15 | 2026-09-25 · 1023814627338049 · Tu WhatsApp que Gestiona Citas<br>2026-09-25 · 1602521858009926 · Tu WhatsApp que Gestiona Citas<br>2026-09-25 · 2355516955217336 · Tu WhatsApp que Gestiona Citas<br>2026-09-30 · 2620717745027618 · Tu WhatsApp que Gestiona Citas<br>2026-09-30 · 1604409507471169 · Tu WhatsApp que Gestiona Citas |
| Agenda en Día (agendaendia.app; versión en portugués «Agenda em Dia»,  | 4 anuncios de Agenda en Día activos en BO/PE/MX/CO/CL/AR (5 si se cuenta el gemelo 1418092519699070, que comparte creati | 2026-09-21 · 2478514702557673 · El sistema que tu clínica dental necesita.<br>2026-09-23 · 1332874989910566 · El sistema que tu clínica dental necesita.<br>2026-09-23 · 2308880112982626 · El sistema que tu clínica necesita.<br>2026-10-01 · 2135085670549681 · El sistema que tu PetShop necesita. |
| Dentalink | 81 | 2025-11-15 · 1889191322026259 · {{product.name}}<br>2025-11-19 · 865849959206370 · {{product.name}}<br>2025-11-19 · 25372297812382741 · {{product.name}}<br>2026-07-20 · 1014909204476358 · ¡Suma IA a tu clínica dental hoy!<br>2026-08-24 · 905072865998673 · Tu clínica al siguiente nivel IA 🚀 |
| Dt.Dental Software Odontologico | 24 (API, 6 paises BO/PE/MX/CO/CL/AR) / ~27 (Biblioteca web, country=ALL) | 2026-06-30 · 1064012876297472 · (sin titular)<br>2026-06-30 · 1348150770768354 · (sin titular)<br>2026-07-02 · 1540166734506785 · El plazo de la 1888 ya vencio<br>2026-07-03 · 1564664081944709 · ¿Cumples los 3 pasos de la 1888?<br>2026-07-03 · 1047754144273622 · (sin titular) |
| Clinera.io | 20 | 2026-09-30 · 1626723995800819 · 🏥 Para centros médicos con varios especialistas<br>2026-09-30 · 28847044424984126 · 🪑 Tres pacientes no llegaron hoy. Tres horas de box vacío que igual pagaste.<br>2026-09-30 · 1584226049682702 · 🏥 Para centros médicos con varios especialistas<br>2026-09-30 · 949268854903989 · 🏥 Para centros médicos con varios especialistas<br>2026-09-30 · 2806658009729310 · 🏥 Para centros médicos con varios especialistas |
| Huli México | ~140 (web, country=ALL) / 132 (API, BO+PE+MX+CO+CL+AR) | 2026-09-17 · 971835375959388 · 📋 Resumen de NOM 024 y NOM 004 para Salud<br>2026-09-17 · 1897715161195791 · 🧮 Calculadora del valor de un Paciente Nuevo<br>2026-09-17 · 1058088373691395 · (sin titular)<br>2026-09-17 · 932724462764721 · Las Notas Clínicas IA de Huli están hechas para ti<br>2026-09-17 · 1635859874653384 · Consentimientos Informados en HuliPractice / Centro de Ayuda HuliPractice |
| Fluker | 15 | 2026-09-25 · 1863816458326314 · (sin titular)<br>2026-09-25 · 2163268357959724 · (sin titular)<br>2026-09-25 · 949172481046179 · (sin titular)<br>2026-09-28 · 1767901664334468 · (sin titular)<br>2026-09-29 · 2021091561923273 · 🚨 Citas Perdidas |
| Calu | 15 | 2026-07-01 · 4438723533031661 · Conocé Calu en 2 minutos<br>2026-08-11 · 1020546507258888 · Probá Calu Gratis<br>2026-08-14 · 2816932145344540 · Calu<br>2026-08-14 · 4633574413533135 · Calu<br>2026-08-24 · 2054036308538572 · Conocé Calu en 2 minutos |
| AgendaClinica (producto «Agenda Clínica» de NativeCode; no tiene págin | 10 | 2026-10-01 · 1489280816356535 · Reduce las inasistencias de tus pacientes<br>2026-10-01 · 2109590089653340 · Reduce las inasistencias de tus pacientes<br>2026-10-01 · 1086370220676479 · Reduce las inasistencias de tus pacientes<br>2026-10-01 · 1760176438600174 · Reduce las inasistencias de tus pacientes<br>2026-10-01 · 1020460554379661 · Evita horas vacías en tu agenda |
| Reservo | 31 en los 6 países (24 de la página «Reservo» + 7 de «Reservo Software»). La web pública en todos los países muestra ~43 | 2026-03-18 · 4279230418889543 · Más que agenda: gestiona toda tu consulta<br>2026-03-18 · 894178330279998 · Gestiona tu consulta con respaldo legal<br>2026-03-30 · 4280902238722805 · La plataforma que acompaña tu crecimiento<br>2026-03-31 · 2033899297187901 · El software médico mejor evaluado en Chile 2025<br>2026-04-02 · 1285302017037129 · Médicos en Argentina ya usan Reservo |

Sumados por palabra clave («software dental», «software para clínicas», «agenda online», «recordatorios por WhatsApp»): Huli México, Dt.Dental Software Odontologico, Clinera.io, Eholo.health, Calu, Fluker.

**Lo que ya se ve sin capturas:**
- Los que más tiempo sostienen anuncios activos son Dentalink (desde nov-2025, catálogo dinámico `{{product.name}}`), Reservo (desde mar-2026) y Calu (desde jul-2026). Los tres hablan de la consulta entera, no solo de la agenda.
- El dolor que más se repite en los titulares es la cita perdida o la inasistencia: Doctocliq, Medizona, AgendaClinica, Clinera, Fluker, Calu.
- Los que más volumen tienen son Huli (~140, contenido educativo de normas y calculadoras), Dentalink (81) y Medilink (41-69): pautan muchas variantes a la vez.

**Capturas que alcanzaron a salir antes del corte (2-oct):** `agendaendia/` (4 anuncios), `dtdental/` (5) y `eholohealth/`, con el formato de la ronda 1 (`<id>.png`, `.txt`, `-2/-3/-4`). Todavía no tienen fila en la tabla.
