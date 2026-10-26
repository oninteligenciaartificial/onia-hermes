# Onia 1.0 — alcance cerrado

> **Doc vivo, sin fecha: se EDITA.** Nace el 2026-09-04, cuando Sergio dijo: *"me parece que nos
> abrimos mucho, dejemos operativo a una versión 1.0"*. Mientras este documento diga `EN CURSO`,
> **nada que no esté en la lista de abajo se desarrolla**: se anota y espera.

---

## El objetivo, uno solo

**Terminar la plataforma en una versión 1.0 USABLE, con precios y decisiones que escalen** — y que
eso se traduzca en **tres negocios pagando el plan Profesional antes del 30 de septiembre de 2026.**

> ⚠️ **Aclarado por Sergio Urcullo el 4-sep-2026**, corrigiéndome: *"ese no es el único objetivo,
> es terminar la plataforma a una versión 1.0 usable, pero pensando precios y decisiones para
> escalar"*. Yo había reducido la sesión siguiente a un solo defecto (el rubro Servicios). **Un
> defecto es un paso, no el objetivo.** Arreglar defectos de a uno sin la 1.0 delante es cómo se
> abren diez frentes y no se cierra ninguno.

**Usable** quiere decir: un dueño boliviano que nunca usó un sistema **se registra solo y llega a
cobrar sin que nadie lo ayude**, en el rubro que eligió. No "las pantallas existen": que el camino
completo se pueda hacer solo.

**Que escale** quiere decir dos cosas, y las dos se deciden ANTES de vender, no después:
- **El precio sube porque el negocio choca con un tope**, no porque le subamos el precio. Los ejes
  son cuánta gente lo usa, cuánto volumen maneja y qué add-ons suma (ver más abajo).
- **Un rubro nuevo se ENCIENDE, no se escribe.** Si sumar el sexto rubro pide reescribir pantallas,
  no escala: eso es deuda que se paga con cada cliente nuevo.

Se mide así, sin interpretación: filas en `organizations` con plan `professional` y un pago
registrado y aprobado, de negocios que no son de Sergio ni de su familia.

Si el 30 de septiembre hay 0, el problema no es el producto: es la venta.
Si hay 3, la versión 1.1 la decide lo que pidan esos tres, no nosotros.

---

## Qué ES la versión 1.0

Un negocio de Bolivia se registra solo, carga a sus clientes, agenda, cobra, y el dueño ve su día
desde el celular.

⚠️ **Corregido el 4-sep-2026**, cuando se midió el recorrido entero contra producción con una
cuenta nueva. Acá decía *"todo esto ya está vivo y verificado en producción"*, y era **falso para
servicios y comercio**, 2 de los rubros que vendemos.

✅ **SERVICIOS: arreglado y desplegado el 4-sep** (`3e20395` + `443e3e7`), verificado dos veces
contra producción con cuenta nueva. El recorrido entero se hace solo: registrarse → cargar un
servicio → cargar un cliente → agendar con hora → **cobrar** → verlo en Contabilidad.
Lo que se arregló, y lo que se aprendió, en `historial/handoff/onia-v1-servicios.md`:

- **Cobrar era imposible:** 422 «Stock insuficiente: disponible 0, solicitado 1». Cobrar una
  declaración de impuestos exigía inventarle stock. Hoy da 201.
- **No había pantalla de clientes.** Hoy «Clientes» está en el menú, con lista, alta y ficha —
  y la ficha ya no le pide el tipo de sangre a un estudio contable.
- **La cita NO era imposible**: eso ya lo había arreglado el deploy `3606c46` (14:12 del 4-sep);
  la medición de este doc se hizo ANTES de ese swap. Dato vencido, corregido acá.

⚠️ **COMERCIO: DESPLEGADO el 5-sep (build `oOZyQ_Mk9rGnBbzr8469b`, sha `f05b2fc`), falta MIRARLO.**
La pantalla de clientes lee `OniaCoreBusinessPartner` como correspondía —no `Patient`— está en la
nav del pack (`vertical-pack.ts:282`), su `page.js` está compilado en el runtime vivo y la tabla
existe en producción. **Todavía NO cuenta como hecho:** nadie recorrió el camino completo con una
cuenta nueva. Lo que sí se miró renderizado es `/login` y las dos pantallas de `/register`.

⚠️ **Recibo imprimible: DESPLEGADO el 5-sep, falta MIRARLO.** `/print/recibo-venta/[paymentId]`
sobre `OniaCommercePayment`, enlazado desde la caja al cerrar la venta (`VentaForm.tsx:334`),
compilado en el runtime y con su tabla en producción. Misma advertencia: sin recorrido no cuenta.

> ⚠️ **Quién escribió qué, porque ya se confundió una vez.** La pantalla de Clientes (`502a22b`) y
> el recibo (`fb54daf`) son de la sesión de panel/UI del 5-sep, no de la de usuarios y pricing —
> esa aportó el tope de asientos, la fuente única de límites y los arreglos de seguridad. Listarlos
> juntos bajo "lo que movió el merge" los hizo sonar de quien solo los mergeó.

🔴 **Hueco anotado (5-sep): la IMPORTADORA no llega ni a Clientes ni a recibo.** Medido sobre
`ELECTRICO_NAV_ITEMS`, comparando los tres packs de la familia comercio:

| Pack | Clientes | Caja | Recibo imprimible |
|---|---|---|---|
| comercio (`gestios-general`) | ✅ `/comercio/clientes` | ✅ `/comercio/caja` | ✅ `/print/recibo-venta` |
| servicios | ✅ `/patients` (renombrado por vocabulario) | ✅ `/comercio/caja` | ✅ `/print/recibo-venta` |
| **importadora (`proveegest-electrico`)** | ❌ | ❌ | ❌ **ninguna ruta** |

⚠️ **Corregido el mismo 5-sep, unas horas después de escribirlo.** Acá decía que a la importadora
le faltaba Clientes y que era *«una línea en la nav»*. Es **falso y demasiado optimista**: tampoco
tiene `/comercio/caja` ni `/billing`, así que no llega a `recibo-venta` **ni** a `receipt`. Un
rubro que vende y no puede emitir comprobante por ningún camino no se arregla con una línea.

Su nav real es: Catálogo · Inventario · Créditos · Cotizaciones · Costeo · Alerta de reprecio. O
sea cierra por **cotización y crédito**, no por caja — puede que ese sea el flujo correcto para una
importadora y no le falte nada. **Eso lo decide Sergio Urcullo, no se asume acá.** Lo que sí está
medido es que hoy no hay comprobante.

La importadora **no está en la 1.0**: el orden de rubros es dental (vivo) → comercio → importadora.
Se anota para que la sesión que la encienda no descubra esto de cero.

| Pieza | Estado |
|---|---|
| Registro solo, con 14 días de prueba | ✅ vivo |
| Agenda y citas (crear, ver el día, agenda pública) | ✅ clínicos y **servicios** · 🔴 comercio no agenda (y no debería) |
| Clientes o pacientes con su ficha | ✅ clínicos y **servicios (4-sep)** · ⚠️ **comercio: en `master` el 5-sep, sin desplegar** · 🔴 importadora no la tiene en el menú |
| Cobros: factura interna, pago, recibo imprimible | ✅ cobro vivo en todos · ⚠️ **recibo de comercio en `master` el 5-sep, sin desplegar** |
| Contabilidad: libro de compras, resumen de IVA para el contador | ✅ vivo |
| Chatbot del sitio web con cuota de 500 conversaciones | ✅ vivo (add-on) |
| Entrar seguro: bloqueo por intentos, verificación en dos pasos | ✅ vivo |
| Panel con lo del día | ⚠️ funciona; el rediseño está construido y espera el OK de Sergio |
| Configuración en una página, con «Configuración avanzada» | ✅ vivo (4-sep) |

### Lo que falta para poder cobrar, y es corto

0. **Que el rubro entregue lo que su propia alta promete.**
   ✅ **SERVICIOS: hecho y desplegado el 4-sep**, verificado contra producción con cuenta nueva.
   ⚠️ **COMERCIO: desplegado el 5-sep. Falta el recorrido con cuenta nueva** — es lo único que
   separa esto de un ✅. La tarjeta de `/register` promete «Catálogo, inventario, caja y clientes»
   (mirado renderizado el 5-sep); las cuatro piezas existen, nadie las caminó juntas.
1. **Material de venta honesto.** La web y el guion prometen factura del SIN, que está apagada.
   *En corrección (`t_db9acebf`).* **Bloquea escribirle a los leads.**
2. **El dueño conecta su WhatsApp.** Meta ya aprobó los permisos; el botón está vivo. Falta que
   Sergio lo pruebe una vez para poder mostrarlo. *1 clic suyo.*
3. **Panel de inicio en tres renglones.** Es lo que separa "lo probé y me perdí" de "lo entendí
   solo". *Construido y verificado en la rama `feat/panel-tres-renglones`; **espera el sí de
   Sergio** antes de reemplazar la pantalla viva (capturas enviadas el 4-sep).*
   Las 7 pestañas de Configuración ya se colapsaron a una página: **desplegado y verificado el
   4-sep**, junto con tres defectos que salieron al mirarlo (la guía de primeros pasos se abría
   encima de cualquier pantalla y comía los clics; el botón flotante tapaba el borde de los
   botones en todo el celular; el rol decía «Administra»).
4. **Cobrar el plan sin fricción.** Hoy: transferencia + comprobante + aprobación a mano. Funciona,
   pero cada paso pierde gente. *El QR del BCP está construido y espera credenciales de Sergio.*

---

## Qué NO es la versión 1.0

Nada de esto se desarrolla hasta tener los tres clientes pagando. Se nombra solo si el cliente
pregunta, y se responde con la verdad: **todavía no**.

- Facturación fiscal SIAT (trámite al 24,8 %; el Punto de Venta 1 depende del SIN y de Sergio).
- Instagram y Messenger del cliente (código listo, escondido tras bandera; espera App Review).
- La agenda que se actualiza sola (el servicio ya corre, falta la entrega de eventos).
- Uso sin internet.
- API pública para terceros (existe y funciona; no se promete ni se vende todavía).
- Los agentes que proponen acciones (40 corridas, 0 propuestas: no se vende lo que no propone).

---

## Precios: cómo escalan

Fuente única, y son TRES archivos distintos, cada uno sobre lo suyo:
`onia-platform/lib/subscription-plans.ts` (los montos), `lib/plan-limits.ts` (**los topes**) y
`lib/pricing.ts` (add-ons). Ningún documento ni página define nada de esto: lo **lee** de ahí.

| Plan | Mes | Semana | Año | Tope |
|---|---:|---:|---:|---|
| Básico | Bs 320 | Bs 89 | Bs 3.200 | 2 usuarios · 300 clientes |
| **Profesional** | **Bs 750** | Bs 199 | Bs 7.500 | 5 usuarios · 1.500 clientes |
| Completo | Bs 1.500 | — | Bs 15.000 | sin tope de usuarios ni de clientes |
| Empresa | Bs 2.900 | — | Bs 29.000 | se cotiza, no se compra en la web |

**El precio escala por tres ejes, no por antojo:** cuánta gente usa el sistema (usuarios), cuánto
volumen maneja (clientes), y qué agrega (add-ons: asistente Bs 390, agenda pública, usuario extra
Bs 70). Un negocio que crece sube de plan porque **choca con un tope**, no porque le subimos el
precio.

**Estado al 5-sep (sesión de usuarios y pricing).** Los montos no se tocaron; lo que se arregló es
que el mismo número no se contara de tres formas. `basicMaxSeats` cuenta EXTRAS y se leía como
total, así que Básico se vendía con 5 personas, el sistema las dejaba crear y el panel avisaba
«llegaste al máximo» en la 4ta. Además el tope se mostraba y **nadie lo aplicaba al otorgar**.
Hoy `maxAsientosExtra()` es el único lugar que dice cuántos asientos vende cada plan, y lo leen la
API de admin (valida), el panel de admin (input) y la barra de uso del cliente.

**Cuatro decisiones de precio siguen esperando a Sergio Urcullo** y ninguna necesita más
investigación — la medición está en `historial/handoff/onia-v1-panel-ui.md` §6: la recarga de Bs 190 (sin
ancla: ningún competidor vende recargas), el eje del cargo de Bs 70 (ningún competidor local cobra
por cabeza), el chatbot a Bs 390 contra Xmart (Bs 177 QR / Bs 296 Meta API), y la **gracia del
contrato pago, que hoy es de CERO días** sobre un rail de cobro que exige una acción manual cada
mes.

### Las cuatro decisiones de precio — CERRADAS el 2026-09-06 por Sergio Urcullo

| Decisión | Qué se resolvió | Por qué |
|---|---|---|
| **Cargo de Bs 70 por usuario** | ❌ **SE SACA.** Los usuarios van incluidos | Es el eje donde nos comportábamos como el software extranjero: ningún competidor local cobra por cabeza (Growing Cloud da ilimitados, Sintic no cobra asientos, Xmart cobra por canal). Y convertía un Bs 320 competitivo en un Bs 390 que se lee como letra chica. El techo del negocio son horas de soporte, no asientos: sacarlo no cambia el margen real |
| **Chatbot Bs 390** | ✅ **Se mantiene**, y se va a poder **vender suelto** | El problema medido no era el precio del add-on sino que el ticket de ENTRADA es Bs 710 (obliga a contratar un plan antes). Contra Xmart (Bs 177 QR / Bs 296 Meta API) eso es 2,4×-4×. Soltarlo baja la entrada 45 % sin tocar ningún precio. Es trabajo de producto: **post-lanzamiento** |
| **Gracia del contrato pago** | ✅ **7 días** (hoy son 0) | La política de 0 días está escrita para un cobro automático, donde no pagar = irse. Pero el QR del BCP es de un solo uso: cada mes el cliente tiene que ACTUAR, así que atrasarse unas horas es lo normal. Ninguno de los siete competidores relevados corta en seco |
| **Recarga de Bs 190** | ⏸️ **En suspenso hasta que exista el 2º escalón del chatbot** | Ver abajo |

**Por qué la recarga quedó en suspenso, y no confirmada.** Medido el 6-sep contra los logs
reales de LiteLLM: el bot gasta **USD 0,000966 por llamada**, y con ~10,5 mensajes por
conversación (40 conversaciones, 419 mensajes) el costo marginal por conversación es
**≈ Bs 0,12**. Contra eso, lo incluido sale Bs 0,78 (margen 6,5×) y la recarga Bs 0,95 (8×).
**El costo no funda Bs 190** — diría que puede valer una fracción.

Y el argumento que decía fundarla —*«recargar dos veces tiene que costar más que subir de
nivel»*— apunta a un nivel **que no existe**: el chatbot tiene un solo escalón (Bs 390 por 500).
Sergio Urcullo eligió construir ese segundo escalón primero y recién ahí fijar la recarga.

⚠️ **Consecuencia asumida:** hasta que ese escalón exista, **Bs 190 sigue publicado sin
fundamento**. El riesgo es teórico por ahora: en 40 días hubo 40 conversaciones sumando TODAS
las organizaciones, así que nadie está cerca de las 500.

**La promesa que sostiene vender temprano:** *todo lo que agreguemos a tu plan durante el primer
año entra sin costo extra.* Cuesta cero hoy, hace que el que compra ahora gane por comprar antes, y
nos obliga a mejorar. **No se promete una función concreta ni una fecha**: se promete el plan.

---

## El orden de trabajo hasta la 1.0 usable

Cerrado y sin desvíos. Cada paso se despliega y se verifica MIRÁNDOLO antes de pasar al siguiente.
**Ninguno de estos es "el objetivo": el objetivo es la 1.0 usable, y estos son sus pasos.**

1. ~~Configuración: de 7 pestañas a una página con «Configuración avanzada».~~ **Hecho, vivo el 4-sep.**
2. ~~Que el rubro SERVICIOS entregue lo que promete su alta.~~ **Hecho, vivo el 4-sep.**
3. ~~Que el rubro COMERCIO entregue lo que promete su alta.~~ **✅ CAMINADO EN PRODUCCIÓN el
   6-sep**, con la cuenta real de `ZZ QA Ferretería Tornillo` (plan Profesional), pantalla por
   pantalla. **El camino se hace solo, de punta a punta:**

   | Paso | Resultado |
   |---|---|
   | Cargar un producto | ✅ Catálogo → «Nuevo producto». Placeholders del rubro de verdad («Cemento IP-30 50kg», «CEM-IP30-50», bolsa/kg). Quedó «1 producto(s) en el catálogo» |
   | Cargar un cliente | ✅ pero **sólo por el fiado** — ver el hueco 1 |
   | Caja | ✅ busca por nombre o SKU, muestra precio y stock, arma el ticket |
   | Cobrar | ✅ efectivo y fiado. «Fiado registrado a Marta Quispe: Bs 124,00 (saldo Bs 124,00)» |
   | Recibo | ✅ `/print/recibo-venta/…` con encabezado del negocio, monto, método, detalle, y el límite dicho de frente: «Comprobante interno de pago. No reemplaza a la factura ni a la nota de venta» |
   | El cliente aparece | ✅ «1 en total · 1 te debe(n) Bs 124,00 — Marta Quispe · 71234567 · 06/09/2026» |

   ✅ **Hueco 1 — CERRADO el 6-sep** (`31b1586`, desplegado y probado en producción: se dio de
   alta «Don Ramiro Ferretería» sin fiarle nada, y el duplicado rebota con
   *«Ya tenés a Marta Quispe con ese teléfono»* — contra una clienta que había creado el
   FIADO, o sea los dos caminos comparten el criterio). El encabezado ya no se contradice con
   la tarjeta. Lo que decía antes:

   🟠 ~~**Hueco 1 — no hay alta manual de cliente.**~~ La pantalla de Clientes no tiene ningún
   «Nuevo cliente»: su única acción es «Ir a la caja». Un cliente existe **solo** si le fiaste
   algo. Una ferretería que quiere anotar a un cliente habitual sin fiarle, no puede. Y la
   pantalla **se contradice a sí misma**: el encabezado dice «Todavía no cargaste ninguno»
   —que implica que los cargás vos— y la tarjeta de al lado dice «Tus clientes aparecen acá
   solos». Las dos frases están en la misma pantalla.

   ✅ **Hueco 2 — CERRADO el 6-sep** (`fe4026e`, desplegado y mirado en producción: la fila de
   la venta en efectivo ofrece «Recibo · Anular» y la del fiado solo «Anular»). El dato ya
   estaba en la consulta —traía el pago de cada orden, pero sólo su `method`— así que sólo
   faltaba sacar su `id`. **El fiado sin anticipo no ofrece recibo a propósito:** un «recibo de
   pago» sobre plata que no entró sería mentira; esa fila cobra por `/comercio/fiados`.
   Lo que decía antes:

   🟠 ~~**Hueco 2 — el recibo no se puede reimprimir.**~~ «Imprimir recibo» aparece sólo en el
   instante posterior a cobrar; al recargar se pierde. Las filas de «Ventas del día» ofrecen
   únicamente «Anular». Si el cliente vuelve una hora después, o la cajera cerró la pantalla,
   el comprobante ya no se puede sacar.

   Ninguno de los dos rompe el recorrido —por eso queda ✅— pero los dos se van a encontrar en
   el primer negocio real.
4. ~~Panel de inicio en tres renglones.~~ **CANCELADO.** Sergio Urcullo descartó
   `feat/panel-tres-renglones` **y** el mockup minimal de `claude/onia-minimal-dashboard-369bc4`:
   el panel es el que ya está vivo. Lo que sí se hizo y está en `master` es el rediseño sobre ESE
   panel — saludo por hora de la organización, lienzo, franja de estado con plan y vencimiento, y
   la barra del asistente. Este punto ya no espera ningún OK.
5. ~~Cobros: cliente, catálogo y total pegado al botón.~~ **Hecho y verificado el 6-sep** mirando
   `/billing/new` en producción: selector de cliente, «Agregar tratamientos» con su vacío honesto
   («podés cobrar igual con un ítem manual»), y el **Total pegado a «Crear Factura»** en la
   tarjeta de resumen. El recibo imprimible entró el 5-sep.
6. ~~Contabilidad: arriba, cuánto pagar y hasta cuándo.~~ **Hecho y desplegado el 6-sep**
   (`e0de0f2`). Estaba al revés: tres líneas de letra chica —Ley 843, D.S. 25619, «no reemplaza
   la declaración en el SIAT»— se metían entre el título y los dos números que el dueño viene a
   buscar. La letra chica pasó al pie, entera y con el mismo texto: cambia dónde se lee, no que
   se diga.
7. ~~Velocidad: el panel abre en menos de 1,5 s.~~ **Cumplido, medido el 6-sep** con Navigation
   Timing sobre producción: TTFB 410 ms, `domInteractive` 562 ms, **carga completa 567 ms**, 28
   recursos. ⚠️ Es con caché tibia; una visita FRÍA no se pudo medir desde acá y queda sin
   verificar.

> Se insertó el paso 3 (comercio) el 4-sep, después de cerrar servicios: es el mismo defecto en
> el otro rubro que vendemos, y una promesa falsa en `/register` cuesta el primer cliente que
> paga. El resto conserva su orden.

> El orden cambió respecto de lo escrito el 4-sep a la mañana: Configuración se cerró primero
> porque los tres defectos que bloqueaban su uso salieron al MIRARLA, y arreglarlos ahí arregló
> dos problemas que eran de todo el sistema, no de esa pantalla.

---

## Lo que decide Sergio, y nadie más

Escribirle a un cliente · publicar con su cara o la de Lucía · gastar plata · el Punto de Venta 1
en el SIN · las credenciales del banco · conectar su WhatsApp · y el sí o no a cada pieza de diseño
antes de que reemplace una pantalla viva.
