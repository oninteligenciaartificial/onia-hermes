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
Lo que se arregló, y lo que se aprendió, en `handoff/onia-v1-servicios.md`:

- **Cobrar era imposible:** 422 «Stock insuficiente: disponible 0, solicitado 1». Cobrar una
  declaración de impuestos exigía inventarle stock. Hoy da 201.
- **No había pantalla de clientes.** Hoy «Clientes» está en el menú, con lista, alta y ficha —
  y la ficha ya no le pide el tipo de sangre a un estudio contable.
- **La cita NO era imposible**: eso ya lo había arreglado el deploy `3606c46` (14:12 del 4-sep);
  la medición de este doc se hizo ANTES de ese swap. Dato vencido, corregido acá.

🔴 **COMERCIO sigue roto igual.** Su tarjeta de `/register` promete «Catálogo, inventario, caja y
**clientes**» y no tiene pantalla de clientes. **No es copiar y pegar lo de servicios**: su gente
vive en `OniaCoreBusinessPartner` (los fiados), no en `Patient`.

🔴 **Sin recibo imprimible, en los dos.** `/print/receipt` lee la tabla `Payment` del pack dental;
comercio usa `OniaCommercePayment`. Es una ruta nueva, no un permiso.

| Pieza | Estado |
|---|---|
| Registro solo, con 14 días de prueba | ✅ vivo |
| Agenda y citas (crear, ver el día, agenda pública) | ✅ clínicos y **servicios** · 🔴 comercio no agenda (y no debería) |
| Clientes o pacientes con su ficha | ✅ clínicos y **servicios (4-sep)** · 🔴 **no existe la pantalla en comercio** |
| Cobros: factura interna, pago, recibo imprimible | ✅ cobro vivo en todos (**servicios, desde el 4-sep**) · 🔴 **sin recibo imprimible fuera de los clínicos** |
| Contabilidad: libro de compras, resumen de IVA para el contador | ✅ vivo |
| Chatbot del sitio web con cuota de 500 conversaciones | ✅ vivo (add-on) |
| Entrar seguro: bloqueo por intentos, verificación en dos pasos | ✅ vivo |
| Panel con lo del día | ⚠️ funciona; el rediseño está construido y espera el OK de Sergio |
| Configuración en una página, con «Configuración avanzada» | ✅ vivo (4-sep) |

### Lo que falta para poder cobrar, y es corto

0. **Que el rubro entregue lo que su propia alta promete.**
   ✅ **SERVICIOS: hecho y desplegado el 4-sep**, verificado contra producción con cuenta nueva.
   🔴 **COMERCIO: falta.** Promete «clientes» y no tiene la pantalla. Es el primer paso pendiente.
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

**La promesa que sostiene vender temprano:** *todo lo que agreguemos a tu plan durante el primer
año entra sin costo extra.* Cuesta cero hoy, hace que el que compra ahora gane por comprar antes, y
nos obliga a mejorar. **No se promete una función concreta ni una fecha**: se promete el plan.

---

## El orden de trabajo hasta la 1.0 usable

Cerrado y sin desvíos. Cada paso se despliega y se verifica MIRÁNDOLO antes de pasar al siguiente.
**Ninguno de estos es "el objetivo": el objetivo es la 1.0 usable, y estos son sus pasos.**

1. ~~Configuración: de 7 pestañas a una página con «Configuración avanzada».~~ **Hecho, vivo el 4-sep.**
2. ~~Que el rubro SERVICIOS entregue lo que promete su alta.~~ **Hecho, vivo el 4-sep.**
3. **Que el rubro COMERCIO entregue lo que promete su alta** — le falta la pantalla de clientes.
   *Listo = el recorrido se hace solo, o la tarjeta de `/register` deja de prometerlo.*
4. Panel de inicio en tres renglones, con el primer día resuelto. **Construido; espera el OK.**
5. Cobros: cliente, catálogo y total pegado al botón. Acá entra el **recibo imprimible**.
6. Contabilidad: arriba, cuánto pagar y hasta cuándo.
7. Velocidad: el panel abre en menos de 1,5 s.

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
