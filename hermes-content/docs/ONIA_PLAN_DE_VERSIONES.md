# Plan de versiones — qué se vende ya y qué entra por parche

> **Fuente de verdad del alcance de cada versión.** Nace de la decisión de Sergio del
> 2026-08-21: *"dejemos algo ya funcionar para vender… esa es la versión uno punto cero sin
> chatbots, y luego lanzamos un parche, la versión uno punto uno, que tenga chatbots"*.
>
> Regla que gobierna este doc: **una función solo entra en una versión cuando está encendida
> en producción y verificada ahí.** Construido no es terminado. Lo que está a medias se dice,
> no se maquilla.

---

## v1.0 — lo que se vende HOY, sin chatbot

### Verificado en producción

| Capacidad | Estado |
|---|---|
| Agenda y citas | vivo |
| Clientes / pacientes con ficha por rubro | vivo |
| Cobros, caja, fiados (comercio) | vivo |
| Inventario | vivo |
| Contabilidad y planilla | vivo |
| Facturación **con la verdad fiscal de frente** | vivo — el emisor está en trámite de homologación; mientras tanto el cliente factura en el Portal Web del SIN, que es gratuito y cumple la ley |
| **Agentes Recall y Cobrador** (human-in-the-loop) | vivo, cron diario. Detectan y proponen; nada sale sin que el dueño apruebe. Costo de API: **USD 0,00** |
| Reservas online `/book` | vivo, gateado por add-on |
| Exportar todo en CSV | vivo |
| Portal de requerimientos (onboarding del cliente) | vivo |
| **App instalable en el celular** (PWA) | vivo desde hoy — ícono en la pantalla de inicio, sin pasar por ninguna tienda |
| 5 rubros | dental · comercio · importadora · estética · servicios |

### Construido y encendido hoy, todavía sin uso real

| Capacidad | Qué falta para poder afirmarla |
|---|---|
| **Recordatorios de cita por email** (24 h y 2 h antes) | El cron corre desde hoy, pero producción no tenía citas cuando se probó. Se confirma con la primera cita real. |
| Correo transaccional (bienvenida, drip, factura) | El DNS se arregló hoy; falta ver una entrega exitosa a Gmail. **Y falta el SPF** (pendiente de Sergio) |

### Lo que NO se nombra en v1.0

Chatbot · recordatorios por WhatsApp · que el bot agende · offline · los rubros que el
registro no entrega. **No se prometen, no se listan, no se dice "muy pronto".**

---

## v1.1 — el parche del chatbot

| Qué entra | Qué exige |
|---|---|
| Chatbot de WhatsApp, **Bs 390/mes sin instalación** | Nada nuestro: el motor está vivo |
| **Recordatorios por WhatsApp** | Plantilla aprobada por Meta + credenciales. El código ya está y se apaga solo si no hay config |
| Que cada cliente conecte **su propio número** | Crear la Configuración de Facebook Login (Embedded Signup) + autorizar dominio + 3 variables en Chatwoot. ~45 min + un clic de Sergio |
| Las conversaciones **dentro del panel** de Onia | 3 días. Hoy viven en Chatwoot, que es un segundo login con marca ajena |

⚠️ **Honestidad de alcance:** el bot del cliente **no usa IA** — contesta horarios, servicios
e info de cita desde lo que el negocio publicó, y deriva al humano todo lo demás. Eso es
defendible y hasta es una ventaja (**no puede inventar ni cotizar un precio**), pero se vende
por lo que es. La IA de verdad es v1.2.

---

## v1.2 y después

Chatbot con modelo real · que el bot agende solo · offline de verdad (hoy el service worker
no cachea nada) · más rubros, encendidos desde el core y no escritos de cero.

---

## ✅ v1.0 CERRADA — 2026-08-22 00:22 UTC

Los cuatro bloqueantes murieron el mismo dia:

| Era bloqueante | Estado |
|---|---|
| La web nueva sin publicar | **Publicada** en onia.com.bo (swap 23:50 UTC). 9 rutas 200, redirecciones de las URLs viejas, la v1 archivada en `/v1` con noindex. Y se corrigio que los CTA decian "Crea tu cuenta" cuando el producto ya pedia acceso |
| El alta automatica abierta | **Cerrada** (swap 23:17). `/register` es "Pedi tu acceso": 6 campos, guarda el interesado con su atribucion, cero lenguaje de obra. Reabrir = `ONIA_ALTA_AUTOMATICA=abierta`, un solo cambio |
| Un pedido no avisaba a nadie | **Avisa por correo** al Gmail del dueno, con estado Pendiente/Contactado en `/admin/solicitudes` y los pendientes ordenados primero |
| El correo sin una entrega comprobada | **PROBADO**: `to=<oninteligenciaartificial@gmail.com> ... status=sent` a las 00:22:08 UTC. Gmail lo acepto. Es la primera entrega exitosa desde que se arreglo el FCrDNS |

Verificado despues del corte de la sesion: contenedor arriba con **0 errores**, `/register`
renderizado muestra "Pedi tu acceso a Onia" con sus 6 campos y el boton correcto, la columna
`contactedAt` aplicada en la base, y la tabla de pedidos **limpia** (la fila de prueba se borro).

**El circuito de venta esta completo:** te encuentran en la web nueva -> piden acceso ->
te llega el correo -> los activas acompanado.

---

## Lo que bloquea vender v1.0, hoy

1. 🟡 **SPF** — el correo sale pero falla autenticación. Un TXT en Cloudflare: `v=spf1 ip4:187.77.16.63 include:_spf.mx.cloudflare.net ~all`. **Pendiente de Sergio.**
2. 🟡 **La web nueva** está lista en el repo y **sin desplegar**. Ojo: `onia.com.bo` NO lo sirve Vercel — lo sirve el contenedor `onia-landing` del VPS. Necesita build y swap, no basta con pushear a main.
3. 🟡 **Acceso acompañado** — el alta automática se cierra por decisión de Sergio (*"no dejes que se registren, aún no está listo"*) y pasa a solicitud con activación manual. En construcción.
4. 🔴 **Hay un usuario real esperando.** Ver abajo.

---

## El primer registro real — 2026-08-21

**clinica klein**, Av. Mutualista 3er anillo, Santa Cruz de la Sierra ·
maximoromano234@gmail.com · +591 57400703 · llegó por **Facebook / Instagram** · se registró
11:09 y **completó el onboarding a las 11:52** · prueba Pro hasta el **4-sep-2026**.

**Nuestro correo de bienvenida le rebotó** (era el fallo de DNS que se arregló horas después).
Nunca supo nada de nosotros.

Es la primera validación de que el embudo funciona: contenido → registro → onboarding
completo, sin que nadie lo ayudara. **Contactarlo es de Sergio** — escribirle es un mensaje
en su nombre. Un WhatsApp al número de arriba vale más que cualquier correo automático.

Y por eso **no se borró ninguna organización**: la instrucción era limpiar las de prueba, y
en la base había cuatro, no dos. Una era esta.
