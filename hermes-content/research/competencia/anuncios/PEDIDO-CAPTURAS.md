# Pedido de capturas — anuncios de la competencia (1-oct-2026)

> Lo pide el carril Ventas y pauta (sesión `session_01JkUVtTYrjJ9xUywLXjYz5G`), por decisión de Sergio Urcullo
> del 1-oct: **la madre los captura desde la PC**. Desde la nube, abrir la Biblioteca de Anuncios en el navegador
> lo bloquea el control de permisos, y el conector `ads_library_search` trae solo el título, no la imagen ni el
> texto.
>
> **Para qué:** rehacer D1 y D4 (los anuncios de ONIA para clínicas dentales) aprendiendo cómo venden los que ya
> le venden software al odontólogo por Meta. Sergio Urcullo: *«aprende como los hace la competencia… ver como
> venden los mejores»*.

## Cómo capturar (unos 20 minutos)

1. Abrir `https://www.facebook.com/ads/library/?id=<id>` con el id de cada fila.
2. **Capturar el anuncio entero:** el texto principal (con «Ver más» abierto), la imagen o el video, el titular y el
   botón. Si es un **carrusel**, una captura por tarjeta. Si es un **video**, tres capturas (inicio, medio, final),
   y anotar la duración y lo que dice la voz, si la tiene.
3. Si el anuncio dice «Este anuncio tiene varias versiones», capturar también las otras versiones.
4. Guardar en `hermes-content/research/competencia/anuncios/<anunciante>/<id>.png` (`-2`, `-3`… para tarjetas o
   cuadros). Anunciante en minúsculas: `doctocliq`, `citapro`, `dentalink`, `medilink`, `ultrapack`, `medizona`,
   `nativecode`, `calendico`.
5. Commit y push a `main`. Avisar a Ventas y pauta por mensaje.

Si un anuncio ya no está activo, se salta y se anota «ya no corre».

## La lista (22), en orden de importancia

**A. Venden el mismo dolor que D1: la cita que no se confirma o el paciente que falta**

| # | Anunciante | id | Título | Activo desde |
|---|---|---|---|---|
| 1 | Doctocliq | 895549733230235 | Dejá de perder citas. Mira cómo lograrlo. | 15-ago |
| 2 | Doctocliq | 2611078469391009 | Evita cancelaciones de última hora | 14-sep |
| 3 | CitaPro | 1073401725052434 | 📅 Más citas confirmadas, menos ausencias | 15-sep |
| 4 | Medizona Especialistas | 1626779772573913 | Deja de confirmar citas una por una | 1-oct |
| 5 | NativeCode | 1401049335530050 | Reduce las inasistencias de tus pacientes | 1-oct |
| 6 | NativeCode | 1788651168932693 | Evita horas vacías en tu agenda | 1-oct |
| 7 | Calendico | 1335618932975260 | Tu WhatsApp que Gestiona Citas | 1-oct |

**B. Los que más tiempo llevan pautando sin cortar** (un anuncio que corre meses es uno que vende)

| # | Anunciante | id | Título | Activo desde |
|---|---|---|---|---|
| 8 | Doctocliq | 1014591764512827 | La agenda que trabaja contigo | 17-jul |
| 9 | CitaPro | 1880949689530541 | ✨ Cabinas llenas, agenda bajo control | 17-jul |
| 10 | Doctocliq | 1952892278698712 | Prueba Doctocliq ahora | 23-jul |
| 11 | CitaPro | 2253602242100999 | 🤖 Tu WhatsApp en piloto automático | 6-ago |
| 12 | Doctocliq | 1089330193788206 | El éxito no es casualidad | 18-ago |
| 13 | Doctocliq | 1684698082830679 | ¿Tu consultorio crece o solo sobrevive? | 18-ago |
| 14 | Ultra Pack Dentista | 1578803363704927 | ARTES Y VIDEOS PARA DENTISTAS | 21-ago |

**C. Los conceptos que más repiten** (el mismo título en 2 a 4 anuncios = lo escalaron porque rinde)

| # | Anunciante | id | Título | Veces |
|---|---|---|---|---|
| 15 | Dentalink | 1841299250068821 | Sin descuadres de caja | 4 |
| 16 | Doctocliq | 1476934190941729 | Esa paz mental es posible con Doctocliq | 4 |
| 17 | Dentalink | 2555415584886173 | Dicta tus fichas con IA 🎙️ | 3 |
| 18 | Doctocliq | 1552115046722567 | ¿Tu consultorio funciona sin tu asistente? | 3 |
| 19 | Dentalink | 1072436212067341 | Más que una simple agenda | 2 |
| 20 | Dentalink | 1086920147535259 | Controla tu clínica dental fácil | 2 |
| 21 | Medilink | 2144439396418903 | Haz clic para agendar una demo sin costo ✅ | 2 |
| 22 | Ultra Pack Dentista | 1418092519699070 | El sistema que tu clínica dental necesita. | 3 |

Fuente de la lista: `ads_library_search` (activos, BO/PE/CL/MX/CO/AR/EC y por `page_id`), leído el 1-oct a las
21:50 UTC. «Activo desde» es la fecha de inicio de entrega. Para el dolor de D4 (el tratamiento que quedó a medias)
**ningún competidor tiene un anuncio**: las búsquedas «pacientes que no regresan» y «tratamientos sin terminar» solo
traen ruido.

## Pedido del 10-oct: 8 anuncios que duran más y que faltan (estudio de la Biblioteca)

> Dirección de Sergio Urcullo (10-oct): *«que mire ads library y mire qué anuncios funcionan»*. El conector dio titular y días; **falta el formato** (video, imagen, carrusel), el texto principal, el botón y a dónde lleva. Mismo método de arriba. Los 5 que más duran y ya se capturaron el 1-2 oct **siguen activos** y no se piden de nuevo. Datos y días en `BIBLIOTECA-10OCT.json`.

| # | Anunciante | id | Titular | Días al 10-oct | Por qué |
|---|---|---|---|---|---|
| 1 | AgendaPro | 1535822604884838 | Sofia Llegó (4 tarjetas o textos) | 143 | el asistente con nombre; la serie más larga de IA |
| 2 | AgendaPro | 1201810243016378 | La IA que organiza tu clínica | 111 | IA que ordena; ver qué muestra |
| 3 | AgendaPro | 3652876658196882 | Agenda tu demostración gratis | 64 | la oferta que más copias tiene (×6) |
| 4 | AgendaPro | 1601426334721119 | La IA atiende tu WhatsApp | 64 | IA + WhatsApp, lo que Onia no puede prometer |
| 5 | Doctocliq | 1748838402916201 | Prueba Doctocliq ahora | 85 | oferta de prueba que dura |
| 6 | Doctocliq | 1738720983808867 | La agenda que trabaja contigo | 85 | gancho de control |
| 7 | Dentalink | 1614658333653742 | (sin titular) | 58 | el más viejo visible de Dentalink |
| 8 | Reservo | 1056628280307783 | Cumple con las normativas legales | 53 | la norma, para ver cómo la muestran |

Si no corre, se salta y se anota «ya no corre». Guardar en `<anunciante>/<id>.png` y avisar a Ventas y pauta por mensaje.
