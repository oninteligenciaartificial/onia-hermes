# Prepago: los leads de agosto, los prospectos con señal y los mensajes listos

**Estado (16-oct-2026): borrador para Sergio Urcullo. No se mandó nada, no se gastó nada.** Cada mensaje sale solo con su
OK sobre el texto y el canal, y lo manda él. Todo va **de usted**. Pedido de la jefa de ONIA con el OK de Sergio Urcullo del
16-oct («mensajes listos… con oferta de prepago»). **Eso cubre el texto; no cubre el envío** (CLAUDE.md, «Qué se publica sin preguntar»).

Fuentes: quiénes son los leads → `docs/ONIA_LEADS_ESPERANDO.md`; su playbook y la secuencia de días 3, 7 y 14 →
`sales-kit/SEGUIMIENTO-LEADS.md`; prospectos → `docs/ONIA_PROSPECTOS_DENTAL_SCZ.md` y `docs/ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`;
qué se puede decir → `docs/ONIA_CATALOGO_DE_VENTA.md` y `docs/ONIA_PROMESA_VS_PRODUCTO.md`.

---

## 0. La oferta de prepago (precios leídos del código, no inventados)

Leídos de `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`, `origin/master`, 16-oct). **Releer el día del envío:** una
variable de entorno puede pisarlos (`PROMESA_VS_PRODUCTO` K-01).

| Plan | Al mes | Anual (se cobra una vez) | Usuarios | Para quién |
|---|---|---|---|---|
| Básico | Bs 320 | **Bs 3.200** | 2 | consultorio o centro chico. **No trae** la lista diaria de pendientes |
| Crece | Bs 550 | Bs 5.500 | 4 | 3 profesionales + recepción. Trae los agentes |
| Profesional | Bs 890 | **Bs 8.900** | 5 | 4 profesionales + asistente, con reportes |
| Completo | Bs 1.290 | Bs 12.900 | sin tope | clínicas grandes |

- **La oferta es el plan anual:** el anual cobra 10 meses y se usan 12 (K-02 ✅, catálogo §3). Es el descuento que ya tiene el producto; **no se
  inventa otro** y no se pone una cuenta regresiva ni un «solo esta semana»: no hay motivo real (reglas de §9.3 de la skill).
- **La prueba es opcional, no obligatoria:** 14 días del plan Profesional, sin tarjeta (A-04 ✅). Quien quiere asegurar el año, paga y arranca: al aprobarse el pago el plan pago se activa de inmediato y la prueba termina.
- **Cómo paga:** QR del BCP, sube el comprobante, Sergio Urcullo lo aprueba en `/admin/payments` y el plan se activa (catálogo §3).
  Riesgo conocido: el QR muestra un nombre de persona, distinto de «OniaAgency» (catálogo, `ONIA_CATALOGO_DE_VENTA.md` §6, punto 3): puede frenar el pago.
  Avisarlo antes («aparecerá a nombre de…»).
- **Una factura por cobro, manual, en el Portal Web del SIN** (`docs/ONIA_PLAN_1.0_Y_CAJA.md`, punto 15). El portal del SIAT lo abre solo Sergio Urcullo.

**Decidido por Sergio Urcullo (16-oct): el prepago anual NO se devuelve** (como dicen los Términos §3.3). No se promete devolución en ningún mensaje.
Lo que protege al cliente es la **prueba de 14 días sin tarjeta, antes de pagar**: por eso el prepago se ofrece al terminar la demo o la prueba, y se dice claro antes de pasar el QR que el pago anual no se reembolsa. Propuesta archivada: `research/PREPAGO-POLITICA-DE-DEVOLUCION-PROPUESTA.md`.

---

## 1. Los 7 leads de agosto: quiénes son y de dónde sale cada uno

Evidencia: `docs/ONIA_LEADS_ESPERANDO.md` §1 y §2 (leídos de `access_requests` y Chatwoot el 31-ago) y la clasificación de `SEGUIMIENTO-LEADS.md` §0.1.
**Ninguno fue contactado** (las filas de arriba se leyeron el 31-ago y el 2-oct: si alguien les contestó después, el texto se ajusta; antes de mandar, mirar
`/admin/solicitudes` y Chatwoot). Días de silencio al 16-oct.

| # | Lead | Entró | Días | Evidencia (de dónde sale) | ¿Prospecto? | Plan que se le ofrece |
|---|---|---|---|---|---|---|
| 1 | **«F»**, clínica odontológica de 4 doctores · WhatsApp +59173232758 | 25-ago | 52 | Chatwoot inbox 5, conv 35: 6 preguntas concretas y el costo total | **Sí, el más calificado** | Profesional: anual Bs 8.900 (o Bs 890 al mes) |
| 2 | **Maximo Romano**, clínica Klein (dental) · +591 57400703 | 21-ago | 56 | `access_requests`, formulario de acceso. Primer registro real del sistema | Sí | Básico anual Bs 3.200 (Crece con 3-4 usuarios, Profesional con 5; con 6 o más, Profesional o Crece con usuarios extra a mano, o Completo) |
| 3 | **Leonardo Chuquimia**, Clínica Leonardo (estética) · +591 70077133 | 23-ago | 54 | `access_requests` | Sí, segundo rubro | Básico anual Bs 3.200 |
| 4 | **Edwin Benavidez Ayala**, consultorio dental Sonrisa Feliz · +59169016505 | 28-ago | 49 | `access_requests` | Sí. Si atiende solo, es Básico | Básico anual Bs 3.200 |
| 5 | **Mario** («mariohassen») · WhatsApp +59173021804 | 28-ago | 49 | Chatwoot inbox 5, conv 37: «vengo de la web de Onia, quiero saber si me sirve para mi negocio» | Probable: no dijo su rubro | Se pregunta primero. Piso: Básico |
| 6 | **Conv 36**, widget web · correo `Saguilera@ds-santacruz.bo` | 27-ago | 50 | Chatwoot inbox 4, conv 36: «Quiero información» + el correo escrito en el cuerpo | Probable: solo hay correo, ni nombre ni rubro | Se pregunta primero |
| 7 | **Conv 34**, widget web, «hola» | 24-ago | 53 | Chatwoot inbox 4, conv 34 | **No**: sin ningún dato de contacto. Nada que mandar | — |

**Todavía sin datos (los tiene el VPS y esta sesión no tiene llave):** «el nuevo», las 8 conversaciones colgadas del vigía y la conv 58 del 17-sep.
La jefa o quien tenga el VPS pasa, por cada una, **id, canal, nombre o negocio, una línea de lo que escribió, hace cuánto y si tiene menos de 24 h**
(bloque «Conteo de hoy» de `ONIA_LEADS_ESPERANDO.md`). Con eso se les suma una fila y se usa la plantilla N de `SEGUIMIENTO-LEADS.md` §0.2.

---

## 2. Los 6 mensajes, listos para copiar (uno por lead con contacto)

Cómo salen (las tres cosas que cambian el resultado, de `SEGUIMIENTO-LEADS.md` §0.3 y §1):

1. **Desde el celular personal de Sergio Urcullo, como texto libre** (la ventana de 24 h está cerrada hace semanas y las plantillas A/B/B′ **no consta que
   estén aprobadas en Meta**). No desde el número de ventas 75414930 (no consta en coexistencia). Si prefiere plantilla, se usa el texto de
   `SEGUIMIENTO-LEADS.md` §0.2 (sin precio) y la oferta de prepago va en la respuesta a «Sí, coordinemos».
2. **Antes de mandar**, mirar en `/admin/solicitudes` si Maximo, Leonardo o Edwin ya crearon su cuenta después del 29-ago. Si la crearon: «¿cómo le fue?» y no demo.
3. La llamada es `https://cal.com/sergiourcullo/20min` (la agenda dura **20**; el bot y `/contacto` dicen 30: unificar, L-04).

### 2.1 «F» — clínica de 4 doctores (WhatsApp)

> Buen día, le escribe Sergio Urcullo, de Onia. En agosto usted nos escribió por un sistema de gestión para su clínica de 4 doctores, con preguntas muy concretas, y no le respondí a tiempo. Le pido disculpas, fue mi falla.
>
> Prefiero contestarle mirando el sistema y no por mensaje. En 20 minutos de videollamada le muestro cómo se ve con el caso de su clínica y le respondo sus preguntas mirándolas ahí. ⟦solo si G-01, G-04, G-06, G-07 y G-08 están ✅; si no, se muestra sin prometer⟧ Incluye la lista de a quién escribirle cada mañana (quién no confirmó la cita de mañana, quién canceló o faltó y no volvió a agendar, quién le debe).
>
> Para 4 doctores y una asistente le corresponde el plan Profesional: Bs 890 al mes. Si decide quedarse, el plan anual cobra 10 meses y usted usa 12: Bs 8.900 por el año. Puede pagar el año al terminar la demo o, si prefiere, probar antes 14 días sin tarjeta.
>
> ¿Coordinamos? Elija su horario aquí: https://cal.com/sergiourcullo/20min

- No dice «lo que usted preguntó»: dos de sus seis preguntas (lista de tratamiento pendiente sin cita y períodos de 15/30/60 días) el catálogo §8 no deja prometerlas (`SEGUIMIENTO-LEADS.md` §0.2).
- **Si contesta «¿y el PDF?»**: «eso se lo confirmo en la llamada, mirándolo en el sistema». El PDF no consta en el catálogo.

### 2.2 Maximo Romano — clínica Klein (dental)

> Buen día, le escribe Sergio Urcullo, de Onia. En agosto usted pidió acceso a nuestro sistema y no le respondí a tiempo. Le pido disculpas, fue mi falla.
>
> Onia es un sistema de gestión para clínicas dentales. Le muestro cómo se ve con el caso de su clínica en una videollamada de 20 minutos, para ver si le sirve. ⟦solo si B-01, C-01, C-02, C-03, D-01, E-01 y F-01 están ✅; si no, se muestra sin prometer⟧ Agenda, ficha del paciente con historia clínica y odontograma, tratamientos, cobros e inventario, todo en un lugar.
>
> Si decide quedarse: el plan Básico (2 usuarios) cuesta Bs 320 al mes, o Bs 3.200 por el año completo (se cobran 10 meses y usted usa 12). Si en la clínica trabajan 3 o 4 personas con el sistema, le recomiendo el Crece (Bs 550 al mes, 4 usuarios); con 5 corresponde el Profesional; con 6 o más le ofrezco primero el Profesional (o el Crece) sumando usuarios extra, que yo le dejo activados a mano, a Bs 70 al mes por usuario, y el Completo como alternativa. Si prefiere, puede probar antes 14 días sin tarjeta; es opcional.
>
> ¿Coordinamos? https://cal.com/sergiourcullo/20min

### 2.3 Leonardo Chuquimia — Clínica Leonardo (estética)

> Buen día, le escribe Sergio Urcullo, de Onia. En agosto usted pidió acceso a nuestro sistema y no le respondí a tiempo. Le pido disculpas, fue mi falla.
>
> Onia es un sistema de gestión para centros de estética. Le muestro cómo se ve con el caso de su centro en una videollamada de 20 minutos, para ver si le sirve. ⟦solo si B-01, C-01, D-01, E-01 y F-01 están ✅; si no, se muestra sin prometer⟧ Agenda, ficha de cada clienta, tratamientos, cobros e inventario, todo en un lugar.
>
> Si decide quedarse: el plan Básico (2 usuarios) cuesta Bs 320 al mes, o Bs 3.200 por el año completo (se cobran 10 meses y usted usa 12). Si prefiere, puede probar antes 14 días sin tarjeta; es opcional.
>
> ¿Coordinamos? https://cal.com/sergiourcullo/20min

- Estética: Onia **no tiene paquetes de sesiones** (vara de la skill `onia-ventas-pauta` §2, punto 4). Si pregunta por ellos, «eso se lo confirmo en la llamada».

### 2.4 Edwin Benavidez Ayala — consultorio dental Sonrisa Feliz

> Buen día, le escribe Sergio Urcullo, de Onia. En agosto usted pidió acceso a nuestro sistema para su consultorio y no le respondí a tiempo. Le pido disculpas, fue mi falla.
>
> Onia es un sistema de gestión para consultorios y clínicas dentales. Le muestro cómo se ve con el caso de su consultorio en una videollamada de 20 minutos. ⟦solo si B-01, C-01, C-02, C-03, D-01, E-01 y F-01 están ✅; si no, se muestra sin prometer⟧ Agenda, ficha del paciente con historia clínica y odontograma, tratamientos, cobros e inventario, todo en un lugar.
>
> Para un consultorio con 1 o 2 personas le calza el plan Básico: Bs 320 al mes, o Bs 3.200 por el año (se cobran 10 meses y usted usa 12). Si prefiere, puede probar antes 14 días sin tarjeta; es opcional.
>
> ¿Coordinamos? https://cal.com/sergiourcullo/20min

- **No** se le promete la lista diaria de pendientes: el Básico no la trae (los agentes vienen desde Crece, K-11).

### 2.5 Mario — rubro desconocido (WhatsApp)

> Buen día, le escribe Sergio Urcullo, de Onia. En agosto usted nos escribió preguntando si Onia le sirve para su negocio y no le respondí a tiempo. Le pido disculpas, fue mi falla.
>
> Para decirle con franqueza si le sirve, necesito saber dos cosas: ¿qué negocio tiene y cuántas personas trabajan con usted? Con eso le digo qué plan le corresponde y, si quiere, se lo muestro en 20 minutos de videollamada.
>
> Para que tenga la referencia: los planes van desde Bs 320 al mes, y el anual cobra 10 meses y usted usa 12. La prueba de 14 días sin tarjeta es opcional.

- Sin prepago hasta saber rubro y tamaño: el Básico no le sirve a todo negocio y no se le empuja un plan a ciegas.

### 2.6 Conv 36 — solo dejó un correo (`Saguilera@ds-santacruz.bo`)

**Un correo, una vez**, desde el correo de Onia. Sin WhatsApp no hay otra vía. No se infiere quién es ni a qué se dedica por el dominio.

> **Asunto:** Su consulta sobre Onia, con disculpas por la demora
>
> Buen día, le escribe Sergio Urcullo, de Onia, en Santa Cruz. En agosto usted nos dejó su correo pidiendo información y no le respondí a tiempo. Le pido disculpas, fue mi falla.
>
> Onia es un sistema de gestión armado para cada rubro (clínicas, centros de estética, servicios profesionales, comercios e importadoras). ⟦solo si B-01, C-01, D-01, E-01 y F-01 están ✅; si no, se muestra sin prometer⟧ Agenda, ficha del cliente, tratamientos o servicios, cobros e inventario, todo en un lugar. La prueba de 14 días sin tarjeta es opcional.
>
> Para decirle si le sirve, cuénteme qué negocio tiene y cuántas personas trabajan con usted. Si prefiere verlo funcionando, en 20 minutos de videollamada se lo muestro: https://cal.com/sergiourcullo/20min
>
> Los planes van desde Bs 320 al mes; si se queda, el plan anual cobra 10 meses y usted usa 12.
>
> Sergio Urcullo · Onia · onia.com.bo

### 2.7 Si contestan

- **«Sí, coordinemos»** → «¡Gracias! Le propongo {horario 1} o {horario 2}. Son 20 minutos por videollamada. Si prefiere elegir, esta es mi agenda: https://cal.com/sergiourcullo/20min» (`SEGUIMIENTO-LEADS.md` §2).
- **«Ahora no»** → «Entendido, gracias por decírmelo. ¿Le parece bien que le escriba en un mes? Si prefiere que no, no le escribo más.» Callar no es permiso.
- **Silencio** → días 3, 7 y 14 de `SEGUIMIENTO-LEADS.md` §3. Contando desde el día de envío, si sale el lunes 19-oct: día 3 = 22-oct, día 7 = 26-oct, día 14 = 2-nov. Para cobrar antes del 31-oct, **el día 7 es el último toque que importa**.
- **Pregunta de precio** → la respuesta de `SEGUIMIENTO-LEADS.md` §2 («Pregunta de precio») + «el anual cobra 10 meses».
- **Cierre del prepago** (cuando dicen «sí, quiero el anual»): «Perfecto. Primero crea su cuenta con este enlace: app.onia.com.bo/register?plan={clave} (si ya tiene una, entra con ella). Claves: basic = Básico, crece = Crece, professional = Profesional, clinic = Completo. El plan solo se conserva si entra por ese enlace; en `/checkout`, antes de pagar, confirme que el plan marcado es el que eligió. Luego paga en app.onia.com.bo/checkout (anual). Paga con QR; al subir el comprobante yo lo apruebo y el plan queda activo. Aparecerá a nombre de {titular del QR}. Le aviso que el plan anual no se reembolsa; si prefiere, antes puede probar 14 días sin tarjeta. Le mando la factura aparte.» — **Verificar antes** que el checkout anual funcione de punta a punta con una cuenta de prueba nuestra (fila K-02 está ✅ en la web, pero el cobro de punta a punta lo está cerrando el carril Plataforma, plan 1.0 punto 13 y 15).

---

## 3. Prospectos con señal (pauta activa), re-leídos hoy en la Biblioteca de Anuncios

**Qué hice el 16-oct:** una consulta de solo lectura a `ads_library_search` (país `BO`, estado `ACTIVE`, 18 `page_id` de las listas SIGUE de
`ONIA_PROSPECTOS_*_SCZ.md`) para volver a confirmar que siguen pautando antes de escribirles (regla «Re-leer antes de enviar», skill §2).
Es lo único que mide el conector: título, fecha de inicio y moneda; no el texto, no el creativo. Fechas en La Paz (UTC-4).
**Ausencia en la consulta ≠ que no pauten** (corta en 50 y la búsqueda es por alcance en Bolivia); se marca «sin confirmar».
**Ciudad, canal y tamaño** vienen de las fichas del 1-2 oct (directorios y la PC); ninguno es nuevo ni se verificó hoy.

### 3.1 Primera tanda: pauta viva esta semana (7 de mayor señal)

| # | Negocio (rubro) | Señal hoy en la Biblioteca (16-oct) | Canal | Dato que falta (se pregunta en la conversación) | Evidencia de origen |
|---|---|---|---|---|---|
| 1 | **Clínica Dental Ezequiel – Spadental** (dental), Av. Japón 3593 | Anuncio nuevo **hoy 16-oct** «Tratamiento de una caries» + «Recupera tu sonrisa» (21-sep) + «Tu sonrisa blanca…» (ago): paga hace ~2 meses | Tel. 70805007 (Waze); que sea WhatsApp es [inferencia] | ¿Un solo doctor? Si es uno, sale | PROSPECTOS_DENTAL §6.6 (Waze) y `page_id 758264870991469` |
| 2 | **Clínica Dental San Pablo – Odontología Avanzada** (dental), Av. San Pablo #5027 | **4 anuncios nuevos el 14-15-oct**, «Agenda tu cita (hoy)». Pauta fuerte | Tel. 64328008 (directorio); confirmar WhatsApp | Tamaño | `dentists10.com`, `page_id 108378080581477` |
| 3 | **Pimentel Centro Estético y Spa** (estética), Radial 17½ #5145, una sede | **3 anuncios nuevos el 15-16-oct** | WhatsApp 77819000 | Tamaño | PROSPECTOS_OTROS §1.7 (la PC, 2-oct), `page_id 104724632014604` |
| 4 | **Spa Corpo Belo** (estética), Av. Mutualista, Calle 43 #3745 | **3 anuncios 14-16-oct** («450 Bs HIFU FACIAL» entre ellos) | WhatsApp 70895510 | ¿Segunda sede en Los Tureres 2045? Si lo es, sale | PROSPECTOS_OTROS §1.6, `page_id 108487890540798` |
| 5 | **Klynink Medic** (estética/medicina estética), Av. Alemana, Calle Asaí #2475 | **Pauta sostenida: unos 23 anuncios activos desde agosto, 11 de ellos nuevos el 12-13-oct**, «Agenda tu cita» | WhatsApp 77733139 | ¿Una sola médica? Si lo es, sale | PROSPECTOS_OTROS (reserva), `page_id 105105894672302` |
| 6 | **COYR DENT** (dental, ortodoncia con planes de pago), Rafael Peña #120 | **3 anuncios 15-16-oct, ahora en USD** (antes no pautaba así) | WhatsApp 78597900 | ¿Atiende uno solo? Si sí, sale | `dentists10.com`, `page_id 2042184532678966` |
| 7 | **Todo Frenos Bolivia** (importadora) | 2 anuncios vivos de la nueva tanda del 12-oct («Proveedor de Pastillas de Freno») + 2 de agosto | WhatsApp 74180972 (directorios) | ¿Importa directo o le compra a un importador? ¿Precio por cliente? | PROSPECTOS_OTROS §2.6, `page_id 1635734929973915` |

### 3.2 En la lista, pero con menos señal hoy

| Negocio | Qué se vio hoy | Qué hace falta |
|---|---|---|
| Smile Dental (dental) | 2 anuncios «Chatea con nosotros», el último del 8-oct | confirmar que el 60482017 abre WhatsApp |
| Clínica Dental Hurtado (dental) | 1 anuncio del 6-oct (+ uno de septiembre) | tamaño; WhatsApp de reservas 77349396 |
| Importadora KAIS | 1 anuncio del 14-oct, «Chatear por Messenger» | que la página sea esa empresa; canal Messenger, no WhatsApp |
| DASHA SPA SCZ (estética) | solo 1 anuncio, del 28-sep; los otros 3 ya no figuran | bajó de señal |
| Odontoclínica, Nexo | no pautan; publican seguido (señal débil) | Nexo nombra a un solo doctor: probable que salga |
| Clarident Plus, Innova Kids, Henners, Gelinski, Jhimbo, Quevedo | **no aparecieron en la consulta de hoy**: sin confirmar si siguen pautando | re-leer con su `page_id` antes de contarlos como señal |

**Orden de empuje (CLAUDE.md, decidido por Sergio Urcullo el 29-sep): dental → importadora → el resto.** Comercio y servicios esperan a la factura del SIN.
Hoy la primera tanda mezcla estética porque es donde hay más pauta viva; el que decide es Sergio Urcullo.

### 3.3 Mensajes en frío (de usted, sin precio, cada frase contra el catálogo)

> ⛔ **No se envía ningún molde de §3.3 mientras estas filas de `ONIA_PROMESA_VS_PRODUCTO.md` sigan en ⬜:** G-01, G-04, G-06, G-07, G-08 y G-11 (dental y estética) y E-07 (importadora). Los moldes describen esas funciones. El revisor automático solo busca frases prohibidas; **no verifica estas filas**. Hasta que Plataforma las pase a ✅ con la cuenta demo, se puede mandar solo el primer párrafo (la observación del anuncio y el dolor) y la invitación a la demo, **sin** describir lo que hace el sistema.


**Cambio respecto de los borradores del 1-2 oct (`ONIA_PROSPECTOS_*_SCZ.md` §6.9):** esos prometían el envío desde el WhatsApp propio del negocio y decían que la IA fabrica el modelo del mensaje. **Las dos ideas ya no se pueden decir** (el envío por WhatsApp es G-03 🟡; el revisor de promesas rechaza ligar la IA con redactar el mensaje; ver skill `onia-ventas-pauta` §3). Este molde usa la frase del catálogo §8.3 y §8.1. Los borradores viejos quedan en su doc con esa advertencia; **no se mandan**.

**Dental y estética** (cambiar lo entre llaves; la línea «Vi…» sale del anuncio de HOY, no de memoria):

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de {negocio}.
>
> Vi {lo observable, con fecha: «su anuncio nuevo de {título}, publicado esta semana»}.
>
> Cuando entran pacientes (o clientas) nuevas por los anuncios, la cita de mañana que no se confirmó suele descubrirse recién a la hora, con la silla vacía.
>
> ⟦solo si G-01, G-04, G-06, G-07, G-08 y G-11 están ✅; si no, usar la variante sin función⟧ Onia es un sistema de gestión para {clínicas dentales / centros de estética}. Cada mañana le deja anotado a quién escribirle (quién tiene cita mañana y no confirmó, quién canceló o faltó y no volvió a agendar, quién le debe) con el mensaje ya preparado. Con IA le propone el texto de cada recordatorio y usted lo aprueba una sola vez. Nada sale sin que usted lo apruebe.
>
> ¿Cuántos profesionales atienden hoy? Con eso le muestro cómo se ve en una demo de 20 minutos.

**Variante sin función (la única permitida mientras haya filas ⬜)** para dental y estética:

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de {negocio}.
>
> Vi {lo observable, con fecha}.
>
> Cuando entran pacientes (o clientas) nuevas por los anuncios, la cita de mañana que no se confirmó suele descubrirse recién a la hora, con la silla vacía.
>
> ¿Le interesaría verlo en una demo de 20 minutos?

**Importadora** (solo lo que consta):

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de {negocio}.
>
> Vi {lo observable, con fecha}.
>
> Con mercadería que se paga en dólares, un movimiento del tipo de cambio puede dejar un precio por debajo del costo sin que nadie lo note a tiempo.
>
> ⟦solo si E-07 está ✅; si no, usar la variante sin función⟧ Onia es un sistema de gestión. Para importadoras calcula el costo real de cada producto importado (arancel, IVA de importación y gastos del embarque repartidos), lo pasa a su catálogo y le avisa qué productos quedan bajo costo con el tipo de cambio del día.
>
> ¿Importan ustedes directo? Con eso le muestro cómo se ve en una demo de 20 minutos.

**Variante sin función (la única permitida mientras haya filas ⬜)** para importadora:

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de {negocio}.
>
> Vi {lo observable, con fecha}.
>
> Con mercadería que se paga en dólares, un movimiento del tipo de cambio puede dejar un precio por debajo del costo sin que nadie lo note a tiempo.
>
> ¿Importan ustedes directo? Si le interesa, lo vemos en una demo de 20 minutos.

- **No** se promete que la cotización sale del sistema ni la factura SIAT (catálogo §7).
- Prepago en frío: **no**. El precio y el anual entran cuando la persona dice «sí, muéstreme»: es la respuesta a «Pregunta de precio» + «el anual cobra 10 meses».
- **Quién los manda:** Sergio Urcullo, 1:1. Hoy la nube no puede confirmar que el número tenga WhatsApp ni abrir `wa.me`.

### 3.4 Antes de mandar cualquier mensaje

1. Los 6 de la §2 y los de la §3.3: correr `node web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs <archivo>` (sale 1 si promete algo que el producto no hace) y `npm run test:venta-honestidad` (cada «Bs N» tiene que ser un monto que el código cobra).
2. Releer los precios el día del envío (§0).
3. **El anuncio de la línea «Vi…» se vuelve a mirar el día del envío** (un anuncio puede cortarse en horas).
4. **Cola de contacto sin duplicados:** a quien ya escribió (los 7 leads) no se le manda el frío.

---

## 4. Lo que NO se dice (y por qué)

| ❌ No se dice | Por qué |
|---|---|
| Que el mensaje sale por el WhatsApp del negocio | G-03 🟡: el envío por WhatsApp no está en ✅ (catálogo §7) |
| Que el sistema detecta solo el tratamiento a medias; que la IA actúa por su cuenta | Catálogo §8: el detector no encuentra a nadie en producción; la IA propone un modelo que usted aprueba |
| «Con una clínica de ejemplo» | L-05 ❌: no hay cuenta demo en producción |
| «Otras clínicas ya lo usan» / testimonios / cifras de resultado | cero clientes pagando: no se fabrica |
| «Solo esta semana», «últimos cupos» | no hay motivo real de escasez |
| Que Onia emite la factura fiscal | la emisión está apagada; la factura va aparte, manual |
| Nombrar a la competencia | regla del kit |
