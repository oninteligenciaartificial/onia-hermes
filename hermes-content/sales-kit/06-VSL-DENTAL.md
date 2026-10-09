# VSL de Onia para la clínica dental (largo de ~4 min y corto de 60 s)

> **Doc vivo, sin fecha: se EDITA.** Nace del pedido de Sergio Urcullo del 8-oct-2026: *«ayudame a hacer mi VSL»*.
> Método: skill `onia-ventas-pauta` §9. Fuentes de lo que se puede decir: `docs/ONIA_PROMESA_VS_PRODUCTO.md` (filas) y
> `docs/ONIA_CATALOGO_DE_VENTA.md` §7-§8. Estructura tomada de los VSL medidos el 8-oct (Dentalink `EWEv30Q-tm4`:
> demo por beneficio; Doctocliq `M9Dc_C6XP48`: prueba gratis y un CTA; Gadzhi `pPpb4t2eV2M`: decir de frente qué gana
> uno; Hormozi `qsXxckCbci0`: venta corta, sin presión). De usted. Marca de la web, no de la marca personal.

## 0. Estado (8-oct)

**No se publica todavía.** Toda la prueba en pantalla depende de la cuenta demo, que no existe, y de filas que siguen
⬜. Hoy se puede: grabar las tomas a cámara marcadas «se graba ya» y armar la edición con la pantalla en blanco.
Cada frase lleva su fila: ✅ se dice hoy · ⬜ **cuando esté en verde** · 🟡 a medias.

## 1. Dónde va cada versión

| Versión | Dónde | Por qué |
|---|---|---|
| **Largo (~4:20), 16:9** | Se manda por el chat de WhatsApp a quien pasó las 5 preguntas de calificación, antes de la llamada. Y es el «Ver cómo funciona» de la página de entrada para clínicas, cuando Plataforma la haga | En pauta no va: nunca más de 60 s (`research/competencia/COMUNICACION_Y_PAUTA_COMPETENCIA.md` §4, regla 2) |
| **Corto (60 s), 9:16** | Pauta de Meta, tanda 2 (`docs/ONIA_ADQUISICION_Y_PAUTA.md` §5.11), con el código `(V1)` en el texto precargado | 60 s es el techo de la regla 2; lo que más dura en la competencia va de 10 a 56 s. Por eso no se hace de 90 s |

## 2. Largo (~4:20)

| Tiempo | Qué se dice | Qué se ve | Edición | Fila |
|---|---|---|---|---|
| 0:00-0:08 | «¿Cuántos de los pacientes de mañana todavía no confirmaron? Si dirige una clínica dental en Santa Cruz, estos cuatro minutos son para usted.» | Sergio Urcullo a cámara con un cuaderno de citas en la mano (sin datos reales). Titular en el cuadro 0: «Para dueños y dueñas de clínicas dentales de Santa Cruz». **Lo que se ve, lo que se dice y lo que se lee no se repiten** (skill §9.3): el dolor se dice, el filtro se lee, el cuaderno se ve | Rótulo «Sergio Urcullo · Onia» de 0 a 3 s. Subtítulo Archivo blanco, la palabra dicha en chip amarillo «Pendiente» | sin promesa · se graba ya |
| 0:08-0:25 | «Le voy a mostrar en pantalla cómo se ve un día de una clínica en Onia, con datos de ejemplo. Y le digo de entrada lo que gano yo: Onia es un sistema que se paga por mes. Probarlo 14 días es gratis, y no le pido tarjeta.» | A cámara | Punch-in de 1,12× en «de entrada» | A-04 ✅ · «datos de ejemplo» ⬜ hasta la cuenta demo |
| 0:25-0:55 | «Hay tres cosas que le cuestan plata a una clínica si nadie las anota. El paciente de mañana que no confirmó: si nadie le escribe, el sillón queda vacío. El saldo que nadie cobra, porque nadie se acuerda. Y el paciente que canceló y no volvió a agendar.» | Tres objetos filmados con el celular, sin personas ni datos reales: un cuaderno de citas, un recibo, una hora tachada | Un rótulo por dolor («Sin confirmar» · «Saldo vencido» · «Canceló»), uno cada ~8 s | dolor, sin promesa · se graba ya |
| 0:55-1:05 | «No es falta de ganas. Es que a las ocho de la mañana nadie tiene esa lista a mano.» | A cámara | Corte seco | sin promesa · se graba ya |
| 1:05-1:25 | «Onia es un sistema de gestión armado para clínicas dentales: su agenda, sus fichas y sus cobros en un solo lugar. Y cada mañana le deja anotado a quién escribirle, con el mensaje listo. Nada sale sin que usted lo apruebe.» | A cámara, y corte al inicio de la cuenta demo | Rótulo «onia \| dental» | A-03, B-01, C-01, E-01, G-01 ⬜ (A-02 no alcanza: dice «5 rubros», no «armado para dental») · G-04 ⬜ (log del VPS) |
| 1:25-1:50 | «Ocho de la mañana. Abre la agenda de mañana: cada paciente con su hora, su tratamiento y el profesional de la cita. Y ve quién confirmó y quién no.» | `/agenda` de la cuenta demo, **el día de mañana** con 6-8 citas (G-06 mira las citas de mañana, no las de hoy). Anillo sobre «sin confirmar» en la cita de las 10:00 | Rótulo grande **Agenda** | B-01, B-02 ⬜ |
| 1:50-2:20 | «En Pendientes, Onia le dejó anotado al paciente de mañana a las diez que todavía no confirmó, con el mensaje listo. Usted lo lee y lo aprueba. Si no lo aprueba, no sale.» | `/pending`: la tarjeta del **mismo** paciente de las 10:00, el texto y el botón Aprobar | Rótulo **Pendientes**. El anillo va en el botón y no pisa otra línea | G-06, G-01 ⬜ |
| 2:20-2:40 | «Lo mismo con el paciente que canceló o faltó y no volvió a agendar.» | Segunda tarjeta en `/pending`, de otro paciente de ejemplo | Corte en «canceló» | G-07 ⬜ |
| 2:40-3:00 | «Abre la ficha: la historia clínica y el odontograma, con sus citas y sus cobros.» | La ficha del paciente de las 10:00 y su odontograma con una pieza marcada | Rótulo **Ficha** | C-01, C-02, C-03 ⬜ |
| 3:00-3:20 | «En Cobros ve lo que le deben, paciente por paciente. Cuando un saldo se vence, también aparece en Pendientes.» | `/billing` con un saldo y la tarjeta de cobro en `/pending`. Leyenda «datos de ejemplo» sobre el monto | Rótulo **Cobros**. Anillo sobre el saldo | E-01, E-03, G-08 ⬜ |
| 3:20-3:30 | «Con IA le propone el texto de cada recordatorio, y usted lo aprueba una sola vez.» | `/agents`: la plantilla de un agente | Rótulo **Agentes**. Tramo opcional | G-11 ⬜ (frase del catálogo §8.1) · K-11 ✅ (desde Crece) |
| 3:30-3:55 | «Lo prueba 14 días, sin tarjeta. Si no le sirve, no paga nada. Funciona desde el navegador, sin instalar nada. El precio es final, en bolivianos, sin implementación y sin permanencia. Sus datos son suyos: no se venden ni se usan para entrenar IA. Y Onia es una empresa registrada en Bolivia, con su NIT.» | A cámara, con tarjetas de una línea que entran con la palabra: «14 días sin tarjeta» · «Sin permanencia» · «Precio final en bolivianos» | Sin el número del precio: vive en `onia.com.bo/precios` | A-04, A-08, A-10, K-03, K-04, K-05, L-02, L-03 ✅ · se graba ya |
| 3:55-4:05 | «Las llamadas las hago yo, por eso son pocas por semana.» | A cámara | — | **Solo si Sergio Urcullo fija un cupo real de llamadas por semana.** Si no, el tramo se corta |
| 4:05-4:20 | «Reserve los 20 minutos con el enlace que le mandé junto a este video. Vemos si le sirve a su clínica, y si no le sirve, se lo digo ahí.» | A cámara, y cartela de 2-3 s: lockup `onia \| dental` y «Reservar 20 minutos». **No dice «escríbanos por WhatsApp»**: este largo se manda dentro del chat a quien ya escribió, y la persona ya está ahí; el enlace de la reserva (`/llamada`) viaja en el mensaje que acompaña al video (un archivo de video no lleva botones); en la página sí es un botón | Cartela final de 2-3 s, no más | L-04 🟡 (la web dice 30 min; unificar) · se graba ya |

## 3. Corto (60 s, 9:16)

| Tiempo | Qué se dice | Qué se ve | Edición | Fila |
|---|---|---|---|---|
| 0-3 s | «Mañana a las diez tiene un paciente que no confirmó.» | Selfie vertical, luz de ventana. Titular y filtro en el cuadro 0 | Rótulo «Sergio Urcullo · Onia». Nada en los 250 px de arriba ni de abajo | sin promesa · se graba ya |
| 3-8 s | «Si nadie le escribe, ese sillón queda vacío. Y el saldo que nadie cobra, igual.» | El mismo plano | Chip amarillo en «vacío» | sin promesa · se graba ya |
| 8-16 s | «Onia junta su agenda, sus fichas y sus cobros, y cada mañana le deja anotado a quién escribirle, con el mensaje listo.» | `/agenda` de mañana con el anillo en la cita de las 10:00 | Rótulo **Agenda** | A-03, B-01, B-02, C-01, E-01 ⬜ · G-04 ⬜ |
| 16-30 s | «Usted lo lee y lo aprueba. Si no lo aprueba, no sale.» | `/pending`: la tarjeta del mismo paciente y Aprobar | Rótulo **Pendientes** | G-06, G-01 ⬜ |
| 30-40 s | «Y en Cobros ve quién le debe y desde cuándo.» | `/billing` con el saldo y la leyenda «datos de ejemplo» | Rótulo **Cobros** | E-03 ⬜ |
| 40-50 s | «Lo prueba 14 días, sin tarjeta. Si no le sirve, no paga nada.» | A cámara, con dos tarjetas | — | A-04, A-08 ✅ · se graba ya |
| 50-57 s | «Escríbame por WhatsApp: en 20 minutos vemos si le sirve.» | A cámara | CTA | L-04 🟡 · se graba ya |
| 57-60 s | — | Cartela: `onia \| dental` y el botón | 2-3 s | — |

**Copias** (la misma pieza con otra apertura, se crean juntas): A «Mañana a las diez…» · B «Doctor, ¿sabe cuánto le
deben hoy sus pacientes?» (apertura de G4; pide E-03 en ✅) · A y B también con «Doctora».

## 4. Tomas y capturas a grabar

**A cámara (Sergio Urcullo).** Celular vertical en trípode, a la altura de los ojos, luz de ventana, micrófono de solapa,
sin música. Una idea por toma; si se traba, dos segundos de pausa y repite la frase entera. Al final, una toma aparte de
4 s con el CTA. El bruto va a Drive «Videos Onia Octubre» con el código en el nombre (`VSL-T1-gancho.mp4`).

| Toma | Texto | Para |
|---|---|---|
| T1 | Gancho del largo (0:00) | largo |
| T2 | «Le voy a mostrar…» (0:08) | largo, después de la cuenta demo |
| T3 | Los tres dolores (0:25) | largo |
| T4 | «No es falta de ganas…» (0:55) | largo |
| T5 | Mecanismo (1:05) | largo, cuando estén en ✅ sus filas |
| T6 | Oferta (3:30) | largo y corto |
| T7 | Cupo de llamadas (3:55) | solo si hay cupo real |
| T8 | CTA del largo (4:05): reservar, no escribir | largo |
| T9 | Gancho A y gancho B del corto, «Doctor» y «Doctora» | corto |
| T10 | «Escríbame por WhatsApp…» | corto |
| T11 | Voz en off de la demo del largo (1:25-3:30): Sergio Urcullo lee el guion mirando la captura ya aprobada, con el mismo micrófono | largo, **después** de las capturas C1-C7 |
| T12 | Corto 3-8 s («Si nadie le escribe…») y 40-50 s («Lo prueba 14 días…») | corto, se graba ya |
| T13 | Voz en off del corto (8-40 s) sobre `/agenda`, `/pending` y `/billing` | corto, **después** de las capturas |

**Objetos (b-roll, filmados con el celular):** cuaderno de citas, un recibo, una hora tachada. Sin personas ni datos
reales.

**Capturas de pantalla (cuenta demo, la MISMA persona de ejemplo en todas, grabación con cursor):**

| # | Pantalla | Qué tiene que verse |
|---|---|---|
| C1 | `/agenda` | El día de **mañana** con 6-8 citas; la de las 10:00 sin confirmar |
| C2 | `/pending` | La tarjeta de confirmar del paciente de las 10:00, su texto y el clic en Aprobar |
| C3 | `/pending` | Una tarjeta de «Reprograma», de otro paciente |
| C4 | Ficha | El paciente de las 10:00, historia clínica y odontograma con una pieza marcada |
| C5 | `/billing` | Un saldo vencido de un paciente de ejemplo |
| C6 | `/pending` | La tarjeta de cobro de ese saldo |
| C7 | `/agents` | La plantilla de un agente (opcional) |

Las graba Ventas y pauta con Playwright sobre la cuenta demo (receta de proxy de la skill §6), o la madre desde la PC.

**Antes de grabar C2, C3 y C6 (clic en Aprobar):** la cuenta demo lleva pacientes con teléfono y correo de **prueba propios**
(nunca de un paciente real), y se verifica en G-01 qué hace «Aprobar» (si manda un correo, a quién). Un clic sin ese control
puede enviar un mensaje de verdad. **El script de grabación no existe todavía** (`auditar-app.mjs` solo captura imágenes y es de
solo lectura): hay que escribirlo (Playwright con `recordVideo` y cursor grande, skill `oversized-cursor`) o la madre graba
desde la PC. Se graba con la cuenta de prueba dedicada, **nunca** con la de superadmin.

**Edición:** skill `editor-videos` (tabla de cortes y preview de 360p **antes** de cortar) y HyperFrames para rótulos,
tarjetas y cartela. El largo se arma en 16:9 con la cámara en un recuadro (`split-layout` de `editor-videos`); el corto,
en 9:16. Reglas: las 11 de `COMUNICACION_Y_PAUTA_COMPETENCIA.md` §4.

## 5. Qué se puede producir ya y qué no

| Ya | Todavía no, y quién lo destraba |
|---|---|
| Grabar T1, T3, T4, T6, T8, T9, T10 y T12 | Las capturas C1-C7: la cuenta demo con datos (Plataforma) |
| Filmar los objetos | T2 y T5: las filas B-01, B-02, C-01 a C-03, E-01, E-03, G-01, G-04, G-06 a G-08 en ✅ (Plataforma, con la cuenta de prueba) |
| Armar la edición con la pantalla marcada «Falta la captura aprobada» | T11 y T13 (voz en off): después de las capturas |
| — | Publicar: Sergio Urcullo lo ve renderizado (es diseño nuevo) y decide el «usted» en anuncios |
| — | El corto en pauta: el go/no-go del 13-oct (`ONIA_ADQUISICION_Y_PAUTA.md` §5.10) |
| — | T7: un cupo real de llamadas por semana (Sergio Urcullo) |
| — | El CTA de 20 minutos: unificar con los 30 de `/contacto` (L-04, Sergio Urcullo) |

## 6. Lo que no se dice en este VSL

- ❌ «Lo envía por su WhatsApp con un toque» (G-03 🟡; catálogo §7).
- ❌ El tratamiento a medias (D-03): el detector no encuentra a nadie.
- ❌ El agente de WhatsApp que contesta las 24 horas (J-*).
- ❌ La factura del SIAT.
- ❌ «Una clínica de ejemplo» para la llamada (L-05): la llamada es «20 minutos para ver si le sirve».
- ❌ Atribuirle a la IA el «a quién» o el texto de cada envío: el «a quién» sale de reglas, y la IA propone una plantilla por agente que el dueño aprueba una vez (catálogo §8).
- ❌ Que los agentes vienen en todos los planes: el Básico no los incluye (K-11; catálogo §8.3: desde Crece y en la prueba). La pieza no dice precio ni plan, así que **la llamada y `/precios` lo dicen antes de que alguien pague**.
- ❌ Testimonios, cifras de clientes, logos o «clínicas que ya lo usan»: hay cero clientes pagando.
- ❌ El precio con su número, y la palabra «IA» en el titular.
- ❌ Competidores, por nombre o por alusión.
