# Prospectos de los otros rubros — Santa Cruz de la Sierra

> **Fuente única de los prospectos NO dentales:** estética y spa, importadora, comercio y servicios
> profesionales. **Los dentales siguen en `ONIA_PROSPECTOS_DENTAL_SCZ.md`** (§6 para contacto 1:1, §7
> objeciones). Un tema, un archivo: esto se EDITA, no se copia con fecha.

**Para qué:** que Sergio Urcullo contacte 1:1 y ofrezca una demo de 20 minutos en los rubros que el producto
sostiene fuera del dental. La decisión es de Sergio Urcullo (30-sep, de noche: *«no solo somos clínica»*) y el
orden está en `ONIA_CLIENTE_IDEAL.md` §6.
**Armado:** 2026-09-30, carril Ventas y pauta. **No se contactó a nadie.** Antes de cada envío, Sergio Urcullo
aprueba el mensaje y el canal exactos.
**Qué puede prometer cada rubro:** lo que dicen `VENDIBLE_OTROS_RUBROS.md` §2 e `INVENTARIO_POR_RUBRO.md`
§2.2 a §2.5 y §4 (en `research/onia-1.0-29sep/`, rama `wip/v1-hermes-20260928`). Los dos se verificaron el
29-sep contra el código de producción (`c3b92067`). Los mensajes se revisan cuando se publique la 1.0, no antes.

| Rubro | Postura de venta hoy | Lista | Mensaje |
|---|---|---|---|
| Estética y spa | piloto, en las mismas condiciones que el dental | §1: **8** | sí |
| Importadora / distribuidora | piloto acotado: costeo de importación + alerta de reprecio | §2: **5** | sí |
| Comercio / ferretería / tienda | **no se escribe todavía** | §3.1: **5** candidatos | no |
| Servicios profesionales | **no se escribe todavía** | §3.2: **5** candidatos | no |

### Cómo se leyó la señal (vale para todo el archivo)

- **Fuente:** Biblioteca de Anuncios de Meta, con `ads_library_search` (solo lectura). País `BO`, anuncios
  activos, consultado el 2026-09-30 por la tarde. **Señal:** el negocio paga hoy para conseguir clientes.
- **Qué devuelve la herramienta:** página, `page_id`, id del anuncio, fecha de creación, moneda y el **título
  del enlace**. **No devuelve el texto ni la imagen del anuncio**, ni la ciudad del anunciante. En las tablas,
  «qué dice» es ese título; si está vacío, dice «sin título».
- **«Santa Cruz» en la búsqueda no es una ubicación.** Se busca por texto. La búsqueda «spa Santa Cruz» trajo
  una casa en venta, y la de importadoras trajo páginas de Bermejo y de Cochabamba. **La ciudad queda sin
  verificar** salvo que la diga el nombre de la página, y aun así hay que confirmarla.
- **Moneda** = la de la cuenta publicitaria, no la de sus ventas.
- **Fechas** en hora de La Paz. «≥ N anuncios» porque cada consulta corta en 50 resultados.

---

## 1. Estética y spa

### 1.1 Qué puede prometer el mensaje, y qué no

Estética es el sistema dental con otro vocabulario. Se habla de **«clientas»**, nunca de «pacientes»
(`CLAUDE.md` §3). Esto es lo que producción cumple hoy (VENDIBLE §2.1 y §2.2):

- **Confirmador:** corre cada mañana y deja escrito el mensaje para la clienta de mañana que no confirmó. La
  dueña lo aprueba y lo manda desde su WhatsApp, con «Enviar yo mismo».
- **Recordatorio por correo** 24 horas y 2 horas antes de la cita.
- **Link de reserva** (`/book`), para que la clienta reserve sola.

**No se promete:**

- la serie ni el tratamiento a medias (solo están en la 1.0 sin publicar);
- paquetes, bonos ni sesiones prepagadas (no existen);
- antes y después;
- recordatorio automático por WhatsApp (la plantilla también es solo 1.0);
- cabinas, comisión por profesional ni factura.

Los mensajes no llevan precio, cifras ni testimonios.

### 1.2 Las 8, en el orden sugerido

Orden: primero las de gasto más claro o CTA de agenda (Serderma, Dermamedic), después la de mejor señal de
ciudad (DASHA). Siguen las de nombre de centro o spa, que sugieren equipo y no una profesional sola.

| # | Negocio (page_id) | Señal: anuncio, fecha y qué dice | Tamaño estimado y de dónde sale | Canal público | Mensaje propuesto (Sergio Urcullo lo envía) | Antes de enviar | Estado |
|---|---|---|---|---|---|---|---|
| 1 | **Serderma – Skin Care & Repair** (`106801775686899`) | **Fuerte.** 4 anuncios creados el 28-sep, USD: `1070103526001711` y `1397519225286319` «Agenda hoy»; `1659941085488066` «Agenda hoy · Contáctanos»; `1627500379414059` «Chatea con nosotros · Agenda hoy · Perfil nuevo · Promo exclusiva». Ya figuraba en `ONIA_PROSPECTOS_DENTAL_SCZ.md` §5.2 (carril Mercado, 30-sep) | Sin verificar. Nombre de marca y no de persona, y 4 anuncios a la vez, sugieren más de una profesional [inferencia] | Página de Facebook del `page_id`. El anuncio lleva a un chat (WhatsApp o Messenger: sin verificar) | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Serderma.<br>Vi sus anuncios de esta semana que invitan a agendar hoy y a escribirles por chat.<br>Cuando las citas se arman por chat, la clienta de mañana que no confirmó suele quedar sin aviso hasta que el turno ya está vacío.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad: solo la ubica en Santa Cruz la búsqueda de Mercado. Un título dice «Perfil nuevo»: confirmar que ésa es la página vigente | propuesto — espera OK de Sergio Urcullo |
| 2 | **Dermamedic** (`1427662330819904`) | **Fuerte (gasto sostenido).** ≥ 18 anuncios activos, BOB, sin título. El más viejo es del 13-ago y los 5 últimos se crearon el 29-sep (ej. `28606140012383907`). Salió en «estética Santa Cruz» | Sin verificar. Pautar sin cortar desde agosto indica un presupuesto estable. **Riesgo:** que pase de 6, o que sea dermatología médica más que estética | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Dermamedic.<br>Vi que vienen pautando desde agosto y que esta semana sumaron anuncios nuevos.<br>Con tantas consultas entrando por los anuncios, confirmar a la clienta de mañana suele quedar para cuando alguien se acuerda.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Si es estética o consulta dermatológica médica. Contar profesionales: si pasa de 6, sale | propuesto — espera OK de Sergio Urcullo |
| 3 | **DASHA SPA SCZ** (`104974815691833`) | **Fuerte (ciudad).** 4 anuncios, BOB, sin título: `954501251031123` (28-sep); `1479528450716312`, `1422057680134926` y `1448606457144212` (30-sep). «SCZ» en el nombre de la página. Salió en «spa Santa Cruz» | Sin verificar. Spa con marca propia [inferencia] | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Dasha Spa.<br>Vi que esta semana publicaron varios anuncios nuevos del spa.<br>En un spa, la clienta de mañana que no confirmó es el turno que queda vacío sin tiempo de dárselo a otra.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Tamaño y recepción. Que no sea una cadena con sucursales | propuesto — espera OK de Sergio Urcullo |
| 4 | **Pimentel Centro Estético y Spa** (`104724632014604`) | **Media.** 3 anuncios, BOB, sin título: `917663934510569` (30-sep); `1600099841906914` y `1077748705308743` (9-sep). Salió en «spa Santa Cruz» | Sin verificar. «Centro estético y spa» sugiere equipo [inferencia] | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Pimentel Centro Estético y Spa.<br>Vi que son centro estético y spa, y que hoy sacaron un anuncio nuevo.<br>Con varios servicios en la misma agenda, la clienta de mañana que no confirmó suele descubrirse recién a la hora del turno.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad y tamaño. Si el mensaje sale otro día, cambiar «hoy» | propuesto — espera OK de Sergio Urcullo |
| 5 | **JP Body Sculpt Estética** (`447449838452412`) | **Media.** 5 anuncios creados el 28-sep, BOB, sin título (`1093371153400442`, `1100160929651066`, `1564081632185142`, `1719673695780494`, `1106718555214167`). Salió en «estética Santa Cruz» | Sin verificar | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de JP Body Sculpt.<br>Vi que esta semana publicaron varios anuncios nuevos de estética corporal.<br>En estética corporal, cada cita de mañana sin confirmar es un turno que puede quedar vacío.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad y tamaño. Que sea estética corporal («Body Sculpt» lo sugiere [inferencia]). **Si lo central es vender paquetes de sesiones, sale**: Onia no los tiene y en la demo se nota | propuesto — espera OK de Sergio Urcullo |
| 6 | **FisioBel – Fisioterapia y Belleza** (`163134980227265`) | **Media-fuerte (gasto sostenido).** ≥ 12 anuncios activos del 5-sep al 29-sep, BOB, sin título (el último es `1328329205912379`). Salió en «estética Santa Cruz» | Sin verificar. Dos servicios distintos sugieren más de una profesional [inferencia] | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de FisioBel.<br>Vi que anuncian fisioterapia y belleza, y que vienen pautando todo septiembre.<br>Con citas de fisioterapia y de belleza en la misma agenda, la clienta de mañana que no confirmó suele descubrirse recién a la hora.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Si pesa más la fisioterapia que la belleza: el pack es de estética y habla de «clientas». Tamaño | propuesto — espera OK de Sergio Urcullo |
| 7 | **Spa Norvet** (`1115743118298684`) | **Media.** 1 anuncio: `2169920297256782` (30-sep, BOB, sin título). Salió en «estética Santa Cruz» y en «spa Santa Cruz». Ya figuraba en dental §5.2 | Sin verificar | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Spa Norvet.<br>Vi que hoy sacaron un anuncio nuevo del spa.<br>Cuando entran consultas nuevas por los anuncios, la clienta que ya tiene cita mañana y no confirmó suele quedar para después.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad y tamaño. Si el mensaje sale otro día, cambiar «hoy» | propuesto — espera OK de Sergio Urcullo |
| 8 | **Spa Corpo Belo** (`108487890540798`) | **Media.** 3 anuncios, BOB: `1337760891573130` «160 Bs ❗ PLASMA ❗» (23-sep), `1590007569527843` sin título (25-sep), `1432547605494930` «350 Bs ESPERMA de SALMÓN» (29-sep). Salió en «estética Santa Cruz» | Sin verificar | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Spa Corpo Belo.<br>Vi sus anuncios de este mes de plasma y de esperma de salmón.<br>Con promociones que traen clientas nuevas, la que tiene cita mañana y no confirmó es fácil de perder de vista.<br>Onia le deja escrito cada mañana el mensaje para esa clienta; usted lo revisa y lo manda desde su propio WhatsApp.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Que las promociones sigan. Si vende sobre todo paquetes. El mensaje no repite sus precios | propuesto — espera OK de Sergio Urcullo |

Responsable de las 8: Sergio Urcullo. La fuente oficial del CRM es Notion y no estaba al alcance de esta
sesión, así que el estado vive en esta tabla hasta que se cargue.

**Qué dicen los mensajes y qué no.** Nombran un solo mecanismo, el que producción cumple hoy: el mensaje
escrito para la clienta de mañana que no confirmó, que la dueña revisa y manda desde su WhatsApp. No nombran el
tratamiento a medias, paquetes, antes y después, envío automático ni factura.

### 1.3 Antes de enviar (unos 3 minutos por negocio, además de la columna de cada fila)

1. **Abrir la página** (`facebook.com/<page_id>`) **y el anuncio** (`facebook.com/ads/library/?id=<id>`).
   Confirmar que el negocio está en Santa Cruz de la Sierra, que el anuncio sigue activo y a qué WhatsApp
   lleva. Yo no pude: el proxy rechazó facebook.com (§4).
2. **Contar profesionales** (de 2 a 6) y ver si hay recepción: preguntas 1 y 2 de `ONIA_CLIENTE_IDEAL.md` §9.
   Si atiende una sola persona, o si es una cadena, sale y entra una de la reserva (§1.5).
3. **Paquetes:** si el negocio vive de vender paquetes o bonos prepagados, sale. VENDIBLE §4 lo pone entre
   los que no son cliente.
4. **Releer la línea «Vi…»** contra lo que se ve ese día. Si algo cambió, se corrige esa línea; no se envía
   con un dato viejo.
5. **Que no haya escrito ya.** El único lead de estética es *Clinica Leonardo* (23-ago,
   `ONIA_LEADS_ESPERANDO.md` §1), que va por su propio camino. Ninguna de las 8 coincide por nombre; el cruce
   por teléfono no se pudo hacer, porque esta sesión no tiene acceso a la base.

### 1.4 Antes de la demo

- **La cuenta de prueba de estética nace vacía** (INVENTARIO §2.2): hay que cargar clientas y citas para mañana
  antes, o el Confirmador no tiene nada que mostrar.
- **«Pendientes» no está en ningún menú:** se entra desde el Inicio o desde la campana (INVENTARIO §3.12).
- **No abrir Configuración → Mi plan:** en estética muestra las tarjetas de comercio (INVENTARIO §2.2).
- **Si pregunta por paquetes o por la clienta que dejó el tratamiento,** se contesta con lo que existe hoy.
  No se da fecha ni se muestra obra (`CLAUDE.md` §3).

### 1.5 Reserva y lo que quedó fuera

**Reserva.** Se usa solo si una de las 8 sale. Tienen señal de pauta, pero nada más verificado.

| Negocio (page_id) | Señal (30-sep) | Qué verificar |
|---|---|---|
| Cosmetología & Estética «Amara» (`703949492800380`) | 2 anuncios, 29-sep, BOB | Ciudad, tamaño, canal |
| Spa Sentirse Beauty (`109872797965764`) | 2 anuncios, 30-sep, BOB | Ciudad, tamaño, canal |
| Nazara Spa Medic (`208753305643887`) · Moon Spa (`909837158886289`) | 1 anuncio cada uno, 29 y 30-sep, BOB | Ciudad, tamaño, canal |
| Derma Peel – Estética Facial (`835822169618413`) · FisioGlow – Centro de Fisioterapia y Estética Integral (`101021959476490`) | 1 anuncio cada uno, 29-sep, BOB | Ídem; en FisioGlow, además, si pesa la fisioterapia |
| The Beauty House (`100936111938860`) | Aviso de empleo del 28-sep: «Manicurista y Estilista con experiencia». Contrata gente, así que tiene equipo | Si es salón de belleza más que estética; ciudad |
| Clínica ABC (`306544962541904`) | 2 anuncios, 26-sep, USD (dental §5.2) | Qué es: el nombre no dice el rubro |
| Roma Beauty Bar (`1199875356547755`) · Essenza Consultorio médico y Estética (`983689678170945`) | 4 anuncios, 30-sep, USD · 1 anuncio, 29-sep | Tamaño: «beauty bar» y «consultorio» pueden ser de una sola persona |

**Fuera:**

| Negocio | Motivo |
|---|---|
| Spa Medic MIORA (páginas Cotoca `107389995722260`, Urbari `116395791460697`, Macororo `102766719538384`, y sucursales en Cochabamba, Quillacollo y Trinidad) | Cadena con sucursales en tres ciudades. Onia no tiene multi-sede (`ONIA_CATALOGO_DE_VENTA.md` §7) y pasa de 6 |
| Páginas con nombre de una profesional: Dra. Jimena Antezana – Medicina Estética (`828634860328673`, 3 anuncios «Chatea con nosotros» del 30-sep), Dra. Judith Quiroz Gynestetic (`107752131848678`, «AGENDA TU CITA»), Dra. Rebeca Nunes, Dra. Helen Rojas A., Dra. Melissa Torres, Dra. Nicole Daza M, Vanessa Lua, Yndira Fernandez Spa, SPA Skarleth Garcia | Probablemente 1 profesional (`ONIA_CLIENTE_IDEAL.md` §5). Se reabren si al abrir la página se ve un equipo |
| Odontología & Armonización Orofacial (`922767334264415`), Clínica Odontológica Beautiful (`589482644245798`), Glow dental spa (`232153857170623`), Clinica Dental Odonto Estetic (`610890302117207`) | Son dentales: van por `ONIA_PROSPECTOS_DENTAL_SCZ.md`, no acá |
| De la lista de dental §5.2: Dra. Nicol Michaga Muriel, Dra. Luz Perez, Centro Láser de Piel, Cirugía Plástica Dr Roger Zambrana | **Sin anuncios activos** al consultar por `page_id` el 30-sep por la tarde. Clínica Fundepi solo tiene un anuncio de catálogo del 21-ene |
| Academia Katihusca Sampaio, Escuela de Belleza El Maná, ProCare Estética Automotriz, Innovaciones Alba Bolivia | No son el rubro: escuelas, autos, artículos para el hogar |

---

## 2. Importadora / distribuidora

### 2.1 Qué puede prometer el mensaje, y qué no

Producción cumple hoy (VENDIBLE §2.1; INVENTARIO §2.5, las dos funciones con prueba de punta a punta [E]):

- **Costeo de importación a la boliviana:**
  - calcula el valor en aduana, el GA por subpartida y el IVA de importación como crédito;
  - usa el tipo de cambio oficial del BCB (TCO), que se carga a mano;
  - reparte los gastos del embarque por FOB, peso o volumen;
  - con «Aplicar al catálogo», guarda el costo y el precio de cada producto.
- **Alerta de reprecio por devaluación:** muestra qué productos se venden bajo costo con el tipo de cambio de
  hoy. Es solo de lectura: para repreciar, se rehace el costeo.

**No se promete:**

- **que las cotizaciones se envían:** no hay PDF, ni correo, ni WhatsApp, ni link;
- «Convertir en pedido» (está roto) ni el agente que sigue cotizaciones (no tiene teléfono);
- listas de precio por cliente, multimoneda en la venta (solo Bs), factura, orden de compra ni ficha de
  proveedor;
- **«costo por lote puesto en depósito»:** la web lo dice y es falso. El costo es por producto, sale del último
  embarque y no ingresa al stock (INVENTARIO §2.5).

**A quién sí** (VENDIBLE §4): a la importadora PYME de Santa Cruz que compra en dólares, vende en bolivianos,
hoy costea en Excel y ve cómo la devaluación le mueve el precio.
**A quién no:** a la que cotiza con PDF, maneja precio por cliente, vende en dólares o factura cada venta.

### 2.2 Las 5, en el orden sugerido

Orden: primero las de mercadería técnica que se paga en dólares y se vende de a una (Cames, Todo Frenos,
Jhimbo): ahí el costeo por producto es el dolor más claro. Después las de nombre con ciudad.

| # | Negocio (page_id) | Señal: anuncio, fecha y qué dice | Tamaño estimado y de dónde sale | Canal público | Mensaje propuesto (Sergio Urcullo lo envía) | Antes de enviar | Estado |
|---|---|---|---|---|---|---|---|
| 1 | **Cames Importadora** (`822784437593613`) | **Fuerte.** 3 anuncios creados el 29-sep, USD: `2244863919578233` «📲 COTIZA MOTORES TRIFÁSICOS DE 1 HP A 50 HP»; `1344360080908582` «📲 ARMA TU CHATA O CISTERNA AQUÍ POR WHATSAPP»; `952825437875668` sin título. Salió en «importadora Santa Cruz» | Sin verificar | Página de Facebook del `page_id`. Los anuncios llevan a WhatsApp (el número se ve al abrirlos) | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Cames Importadora.<br>Vi sus anuncios de esta semana para cotizar motores trifásicos y armar chatas y cisternas por WhatsApp.<br>En equipos que se pagan en dólares, un movimiento del tipo de cambio puede dejar un precio de lista por debajo del costo sin que nadie lo note a tiempo.<br>Onia calcula el costo real de cada producto importado, con el GA, el IVA de importación y los gastos del embarque repartidos, lo pasa a su catálogo y le muestra qué productos quedan bajo costo con el tipo de cambio del día.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad. Si importa o fabrica («armar chatas» puede ser fabricación). Si vende en dólares, no calza. **Cotizan por WhatsApp: en la demo no se muestran las cotizaciones de Onia como solución** | propuesto — espera OK de Sergio Urcullo |
| 2 | **Todo Frenos Bolivia** (`1635734929973915`) | **Fuerte (gasto sostenido).** ≥ 6 anuncios activos del 24-ago al 28-sep, BOB: `2299529400584400` «Proveedor de Pastillas de Freno» (28-sep); `911364115173474` «DFC 4000 Hybrid – Fórmula Híbrida · New York Brake – Cerámica · New York Brake – Semi-Metal» (28-sep); `1767312157918282` «Pastillas de freno para tu vehículo» (7-sep); `28414912194864726` «Pastillas de freno + instalación profesional» (24-ago). Salió en «mayorista Santa Cruz» | Sin verificar. Se anuncia como proveedor (vende a otros negocios) y también al público con instalación | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Todo Frenos Bolivia.<br>Vi que se anuncian como proveedor de pastillas de freno, con líneas como New York Brake y DFC.<br>Con muchas referencias importadas, el costo real de cada una suele vivir en una planilla que se actualiza tarde cuando se mueve el dólar.<br>Onia calcula el costo real de cada producto importado, con el GA, el IVA de importación y los gastos del embarque repartidos, lo pasa a su catálogo y le muestra qué productos quedan bajo costo con el tipo de cambio del día.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad. Si importa directo o le compra a un importador (si no importa, el costeo no le sirve). Si a los talleres les vende con precio por cliente | propuesto — espera OK de Sergio Urcullo |
| 3 | **Importadora Jhimbo** (`103300217870326`) y **Jhimbo Importadora** (`2242967225958211`) | **Media-fuerte.** 2 páginas, 29-sep, USD: `1118662474447569` «areneadora industrial» y `1975875326437398` «MOTOCULTOR». Salió en «importadora Santa Cruz» y en «importadora» | Sin verificar. **Dos páginas:** puede ser una sola empresa o dos sedes | Páginas de Facebook de los dos `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Importadora Jhimbo.<br>Vi sus anuncios de esta semana de la areneadora industrial y del motocultor.<br>En maquinaria que se paga en dólares, el flete, el despacho y el tipo de cambio pesan en el costo tanto como el precio de origen.<br>Onia calcula el costo real de cada producto importado, con el GA, el IVA de importación y los gastos del embarque repartidos, lo pasa a su catálogo y le muestra qué productos quedan bajo costo con el tipo de cambio del día.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Ciudad. Por qué hay dos páginas: si son dos sedes, Onia no tiene multi-sede. Si vende en dólares | propuesto — espera OK de Sergio Urcullo |
| 4 | **Importadora ReMel Medical** (`107403528165762`) y **REMEL Medical SC** (`918686151335600`) | **Media.** 2 páginas, 28-sep, BOB, sin título: `1824706905373809` y `3984905731652159`. Salió en «importadora Santa Cruz»; el anuncio de REMEL Medical SC también apareció en «contador Santa Cruz» (sin abrir: podría ser un aviso de empleo) | Sin verificar. Dos páginas y un posible aviso de empleo sugieren más de una persona [inferencia] | Páginas de Facebook de los dos `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de ReMel Medical.<br>Vi que esta semana están pautando desde dos páginas, la de la importadora y la de REMEL Medical SC.<br>Con insumos que se pagan en dólares, un movimiento del tipo de cambio puede dejar un precio de lista bajo costo antes de que alguien rehaga la cuenta.<br>Onia calcula el costo real de cada producto importado, con el GA, el IVA de importación y los gastos del embarque repartidos, lo pasa a su catálogo y le muestra qué productos quedan bajo costo con el tipo de cambio del día.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Si «SC» es Santa Cruz. Qué importa («Medical» sugiere insumos médicos [inferencia]). Si vende por licitación o con precio por cliente, no calza | propuesto — espera OK de Sergio Urcullo |
| 5 | **EMTOP Bolivia – SCZ** (`303629722824572`) | **Media (gasto sostenido).** ≥ 11 anuncios activos del 30-jul al 12-sep, BOB, sin título; `923063127522925` empezó a circular el 30-sep. «SCZ» en el nombre. Salió en «ferretería Santa Cruz» y en «mayorista Santa Cruz» | Sin verificar. **Riesgo:** ser distribuidor de una marca puede ser más que una PYME. Existe otra página, «EMTOP Megadis» | Página de Facebook del `page_id`. WhatsApp sin anotar | Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de EMTOP Bolivia en Santa Cruz.<br>Vi que en Santa Cruz distribuyen herramientas EMTOP y que vienen pautando desde julio.<br>Con tantas referencias que se pagan en dólares, rehacer los precios cada vez que se mueve el tipo de cambio suele quedar para más adelante.<br>Onia calcula el costo real de cada producto importado, con el GA, el IVA de importación y los gastos del embarque repartidos, lo pasa a su catálogo y le muestra qué productos quedan bajo costo con el tipo de cambio del día.<br>¿Le muestro cómo se ve en una demo de 20 minutos? | Tamaño. Si importan ellos o compran al representante de la marca («herramientas EMTOP» es [inferencia] por el nombre). Si a las ferreterías les venden con lista por cliente, no calza | propuesto — espera OK de Sergio Urcullo |

**Qué dicen los mensajes y qué no.** Nombran solo el costeo y la alerta de reprecio, las dos piezas que
producción cumple y que ningún rival local verificado tiene completas (VENDIBLE §3.2). No nombran cotizaciones,
pedidos, precios por cliente, dólares en la venta ni factura. Sin precio, sin cifras de resultados, sin
testimonios.

### 2.3 Antes de enviar y antes de la demo

1. **Abrir la página y el anuncio**, igual que en §1.3. Confirmar la ciudad, que el anuncio siga activo y el
   WhatsApp.
2. **Calificar con los criterios de VENDIBLE §4.** ¿Compra en dólares y vende en bolivianos? ¿Hoy costea en
   Excel? ¿Cotiza con PDF o con precio por cliente? ¿Factura cada venta? Si la respuesta a alguna de las dos
   últimas es «sí», no calza hoy.
3. **Releer la línea «Vi…»** el día del envío.
4. **En la demo:**
   - La cuenta de prueba de importadora trae datos de ejemplo. Se muestran el **Costeo** y la **Alerta de
     reprecio**.
   - No se aprieta «Convertir en pedido»: el pedido desaparece.
   - No se dice que el costeo carga stock ni que calcula por lote.
   - Si preguntan por enviar la cotización, se contesta lo que hay hoy: se arma y se lleva su estado, pero no
     sale del sistema.
5. Ninguna de las 5 figura como lead en `ONIA_LEADS_ESPERANDO.md` (cruce por nombre; sin acceso a la base).

### 2.4 Reserva y lo que quedó fuera

**Reserva:**

| Negocio (page_id) | Señal (30-sep) | Qué verificar |
|---|---|---|
| Cronembold Import (`108383845602968`) | ≥ 10 anuncios del 27 y del 30-sep, BOB, sin título. Salió en «material eléctrico Santa Cruz», el rubro con el que nació el pack de importadora | Qué importa, ciudad, tamaño |
| Importadora Roscoh SCZ (`1264103103443704`) | 2 anuncios, 26 y 30-sep, BOB. «SCZ» en el nombre | Qué importa, tamaño |
| Importadora Yuna SRL. (`267076703147097`) | ≥ 5 anuncios del 29-sep, BOB. Es una SRL | Qué importa, ciudad |
| Importadora Quevedo (`1562055387425917`) | 3 anuncios del 30-sep que llevan a WhatsApp, USD | Qué importa, ciudad |
| Comercial VIDEN (`1137075022818462`) · Chinacruz S.R.L (`185337771337017`) | 29-sep, «material eléctrico Santa Cruz» · 12-ago, «ferretería Santa Cruz» | Si importan o solo revenden |

**Fuera:**

| Negocio | Motivo |
|---|---|
| Grupo Mathiesen Bolivia («Solicite ficha técnica y cotización», USD) | Grupo grande [inferencia] (`ONIA_CLIENTE_IDEAL.md` §5) |
| Importadora JL Pro Audio Bermejo · SOLID MIX – Cochabamba | Otra ciudad, por el nombre |
| Método importador TIV, Detodo.com Importaciones («Importa y Escala»), Centro de Capacitación Egei | Por los títulos, venden cursos de importación, no importan |
| Jorge Cordova Godefroy (laptops «IMPORTADA DE USA») | Página de una persona: probablemente vende sola [inferencia] |
| Distribuidora Makiro srl, Nibol – Foton Bolivia | Solo avisos de empleo («Postula aquí»); Foton además sería representante de una marca de vehículos [inferencia] |

---

## 3. Comercio y servicios profesionales: candidatos, sin mensaje

Estas dos listas solo dicen a quién mirar. No hay mensaje, porque los problemas de estos rubros se ven en una
demo (INVENTARIO §1 y §4).

### 3.1 Comercio / ferretería / tienda

> **No se escribe hasta que Plataforma confirme que la 1.0 los resolvió.** Lo que se ve en la demo: **no se
> puede editar un producto, ni cambiarle el precio, ni sumarle stock una vez creado**. Además, «Avisa stock
> bajo» nunca se dispara y no hay factura (INVENTARIO §2.4 y §4). Al 29-sep, la 1.0 no había tocado esas
> pantallas: eran idénticas a las de producción (VENDIBLE, encabezado).

| # | Negocio (page_id) | Señal: anuncio, fecha y qué dice | Qué verificar cuando se destrabe |
|---|---|---|---|
| 1 | Ferretería 25 de Marzo (`100565576085945`) | `1419722882930881`, 29-sep, BOB, sin título. Salió en «ferretería Santa Cruz» | Ciudad, tamaño, si fía (el fiado es lo que Onia hace bien) |
| 2 | Mapse (`135467789977362`) | 4 anuncios del 27-sep, BOB: `4649124001986359`, `1085198114511290` y `2078358102796992` «👉 Más información por WhatsApp..»; `1060750996831662` «Más información ➡️ Acá». Salió en «ferretería Santa Cruz» | Qué vende, ciudad, tamaño |
| 3 | Mainter hogar y jardín (`946600481871981`) | `1529705768912839`, 28-sep, BOB, sin título. Salió en «ferretería Santa Cruz» | Ciudad, tamaño |
| 4 | Punto Comercial (`106489328012732`) | `2992364527764221`, 28-sep, BOB, sin título. Salió en «ferretería Santa Cruz» | Qué vende, ciudad |
| 5 | Distribuidora Suarez (`1299659976569031`) | `1996472414335429` «Distribuidora Suarez», 28-sep, BOB. Salió en «distribuidora Santa Cruz» y en «ferretería Santa Cruz» | Si es tienda o distribuidora con lista por cliente (Onia no tiene listas por cliente) |

Fuera: **Ace Hardware Bolivia** (cadena). **Constructor Norte – Centro Comercial de la Construcción**
(`100559196363529`, «Chatea con nosotros», 30-sep, USD): un centro comercial es probablemente grande.

### 3.2 Servicios profesionales

> **No se escribe hasta que Plataforma confirme que la 1.0 los resolvió.** Lo que se ve en la demo:
> - En los planes Básico, Crece y Profesional, **solo el dueño puede tener agenda**: a un segundo
>   profesional no se le pueden dar citas.
> - El Inicio es el mostrador de comercio, sin citas.
> - Un servicio cargado no se puede editar.
> - El cobro no queda en la ficha del cliente.
>
> Fuente: INVENTARIO §2.3 y §4.

VENDIBLE §4 dice a quién sí: al consultorio chico (psicólogo, nutricionista) que agenda por WhatsApp. **No al
contador**, que necesita la factura y la contabilidad de varios clientes. Los dos estudios contables entran solo
porque la búsqueda los pedía, y van marcados.

| # | Negocio (page_id) | Señal: anuncio, fecha y qué dice | Qué verificar cuando se destrabe |
|---|---|---|---|
| 1 | Ver-te Psicología Clínica (`1682370858726788`) | ≥ 4 anuncios del 5-sep, BOB: `38144099278537846` «Discuten por lo mismo hace meses», `1086520597083373` «Un espacio donde no tienes que fingir que estás bien», `2299996984102836` «Tu hijo no está mal portado, está pidiendo ayuda», `1400990852163463` «Se fué y no sabes como seguir adelante». Salió en «psicología Santa Cruz» | Cuántos psicólogos (pareja, niños y duelo sugieren más de uno [inferencia]); ciudad |
| 2 | Centro Integral de Asistencia Psicológica y Empresarial (`264748557006934`) | `1003343279457302`, 28-sep, BOB, sin título. Salió en «psicología Santa Cruz» | Tamaño, ciudad |
| 3 | NutriForma Bolivia (`320218211779412`) | `1815331376141014` «Chatear con nosotros 👉🏻», 12-sep, BOB. Salió en «nutricionista Santa Cruz» | Ciudad, cuántos profesionales |
| 4 | Consultoría Contable Y Tributaria (`850569878150881`) | `1792292968459976`, 28-sep, BOB. Salió en «asesoría contable» | **Calce bajo (contador).** Ciudad |
| 5 | Consultora Contable – Asesoría Legal (`108565262154147`) | `28075459968822832`, 22-sep, BOB. Salió en «asesoría contable» | **Calce bajo (contador).** Ciudad |

Fuera:

- **CONTAnova** (`854021997795926`: «Contador a tu alcance», «Consultora contable»): figura entre los vendedores
  de software que pautan en `ONIA_ADQUISICION_Y_PAUTA.md` §2.3.
- **Psicología y terapia – Lic Carla Flores** y **Abogada Rocío Escalera:** una sola profesional. Además, el
  abogado con expedientes no calza (VENDIBLE §4).
- **Consultora Contable LP:** por el nombre sería de La Paz [inferencia].
- **Emco Py Consultora:** es de Paraguay (su moneda es PYG).
- La búsqueda **«estudio contable Santa Cruz» dio 0 anuncios activos**.

---

## 4. Límites de esta pasada

- **Nada se abrió en vivo, salvo la Biblioteca de Anuncios vía conector.** El proxy de la sesión rechazó
  `facebook.com`, `instagram.com`, Google y DuckDuckGo (`connect_rejected`, probado el 30-sep por la tarde). Se
  anota y no se rodeó.
- **Por eso quedan sin verificar la ciudad, el tamaño y el WhatsApp de las 23 filas.** Tampoco hay web propia
  leída de ningún negocio, a diferencia del nivel A de la lista dental.
- **La herramienta no trae el texto del anuncio.** «Lo que dice» es el título del enlace, y en la mayoría está
  vacío. Los creativos no se vieron nunca. Cada mensaje se apoya en lo único público que se pudo leer: el
  nombre, el título y la fecha de la pauta.
- **La búsqueda es por texto, no por lugar** (ver «Cómo se leyó la señal»). La moneda es la de la cuenta
  publicitaria.
- **Las listas no son exhaustivas.** Cada consulta devuelve como máximo 50 anuncios. Los totales estimados
  fueron:

  | Búsqueda | Anuncios activos estimados |
  |---|---|
  | «estética Santa Cruz» | 276 |
  | «spa Santa Cruz» | 186 |
  | «importadora Santa Cruz» | 135 |
  | «importadora» | 553 |
  | «distribuidora Santa Cruz» | 51 |
  | «mayorista Santa Cruz» | 44 |
  | «ferretería Santa Cruz» | 22 |
  | «material eléctrico Santa Cruz» | 4 |
  | «asesoría contable» | 17 |
  | «contador Santa Cruz» | 7 |
  | «psicología Santa Cruz» | 26 |
  | «nutricionista Santa Cruz» | 2 |
  | «estudio contable Santa Cruz» | 0 |

- **Sin acceso a la base ni al CRM (Notion):** el cruce con los leads que ya escribieron se hizo solo por
  nombre, contra `ONIA_LEADS_ESPERANDO.md`.
- **Lo que el producto cumple no se volvió a leer en el código hoy.** Sale de VENDIBLE e INVENTARIO, verificados
  el 29-sep. Si la 1.0 se publica, estética suma el tratamiento a medias y los mensajes se reescriben; antes,
  no.

**Cómo se recuenta:** mismo conector, `ads_library_search` con `countries: ["BO"]` y
`ad_active_status: "ACTIVE"`. Primero las búsquedas de la tabla de arriba. Después, por `page_ids`, las páginas
de cada fila, para contar sus anuncios y fechas.

---

## Registro de objeciones de las demos

Se llena igual que el §7 del dental: una fila por demo, el mismo día.

- **«Tamaño»:** el número real de profesionales o de personas que dijo el negocio.
- **«Objeción textual»:** sus palabras, sin parafrasear.
- **«Rubro»:** separa lo que es del producto en ese rubro de lo que es del discurso.

| Fecha | Rubro | Negocio | Tamaño | Qué le interesó | Objeción textual | Qué haría cambiar (producto o discurso) | Siguiente paso |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
