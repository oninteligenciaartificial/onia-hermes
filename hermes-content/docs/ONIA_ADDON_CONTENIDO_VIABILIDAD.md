# Add-on de contenido — qué permite Meta y si esto es rentable

> Sergio, 2026-08-23: *"quiero que la app sea más que todo como un Postiz, que se postee
> todo automáticamente, envíe DMs automáticamente, escriba por DMs de IG. Revisá qué
> podemos hacer y si esta idea es rentable."*
>
> Dos preguntas distintas. Las dos se contestan con datos verificados contra la
> documentación de Meta y contra los precios reales de nuestro propio código.

---

# Parte 1 — Qué permite Meta (verificado, no recordado)

## ✅ Publicar: alcanza y sobra

| Límite real | Número | ¿Nos aprieta? |
|---|---|---|
| Posts publicados por API | **100 cada 24 h por cuenta** | No. El abono son 8 al mes |
| Carruseles | **50 cada 24 h**, hasta **10 imágenes** cada uno | No |
| Historias por API | **Soportadas** (`media_type=STORIES`) | No |

**Dos restricciones técnicas concretas que sí nos tocan:**

1. 🔴 **Solo acepta JPEG.** `carousel_render.js` saca **PNG**. Hay que convertir antes de
   publicar. Es una línea de ffmpeg, pero si no está, la publicación falla en producción.
2. 🔴 **El archivo tiene que estar en una URL pública** al momento de publicar, y el
   contenedor **expira a las 24 h** si no se publica. Ya tenemos dónde: `onia.com.bo` sirve
   archivos (así se entrega el PDF de HUMO).

## ⚠️ DMs: se puede, pero NO como un "envío masivo"

Esto es lo que más hay que entender antes de venderlo, porque la diferencia entre lo que
se puede y lo que la gente imagina es enorme.

| Lo que se puede | Regla exacta |
|---|---|
| Contestar por DM a quien comenta | **UN solo mensaje** por comentario |
| Ventana para hacerlo | **7 días** desde el comentario |
| Seguir la conversación | **Solo si la persona responde**, y ahí se abre una ventana de **24 h** |
| Dónde cae ese DM | **Inbox** si te sigue · **Solicitudes** si no te sigue |

**Lo que NO se puede, y no hay forma de rodearlo:** mandar DMs a gente que no interactuó.
No es un límite técnico ni una cuestión de encontrar la API correcta — es la política, y el
castigo cae sobre la cuenta del cliente.

O sea: **el sistema no sale a buscar gente. Convierte a la que levanta la mano.** Eso es
vendible y es honesto. "Le escribimos a todos tus seguidores" no es ninguna de las dos.

## 🔴 El bloqueo real: App Review

Nuestras propias cuentas funcionan porque son nuestras. **Para operar la cuenta de un
cliente hacen falta permisos con Advanced Access:**

- `instagram_manage_comments`
- `pages_messaging`
- La función **Human Agent**
- Token de Página con la tarea `MESSAGING`

Eso es **App Review de Meta**, y por lo que ya sabemos tarda ~20 días. **No hay add-on
vendible hasta que eso pase.** Es la ruta crítica de todo este producto, y no depende de
escribir código: hay que mandarlo a revisión ya, porque el reloj corre en paralelo a todo
lo demás.

⚠️ **Riesgo de concentración:** una sola app de Meta para todos los clientes. Si un cliente
usa el sistema de forma abusiva y Meta restringe la app, **caen todos los clientes juntos**.
Por eso el sistema nunca debe ofrecer envío masivo aunque un cliente lo pida.

---

# Parte 2 — ¿Es rentable?

## El costo variable es prácticamente cero, y eso es lo que hace que funcione

| Concepto | Costo por cliente por mes |
|---|---|
| DMs de Instagram | **Bs 0** — la API de mensajería de IG no cobra por mensaje |
| Publicación | **Bs 0** — la API no cobra |
| Render de piezas | **Bs 0** — Chrome headless en el VPS que ya pagamos |
| Imágenes generadas | **Bs 0** — quedan fuera del abono a propósito |
| **Total variable** | **≈ Bs 0** |

Ese cero es la diferencia con el chatbot de WhatsApp, donde Meta **sí** cobra por mensaje
(y por eso ahí se decidió que el cliente pague a Meta directo). Acá no hay cadena de pago
que administrar.

**Margen bruto sobre costo variable: ~100 %.**

## Entonces el negocio no lo define el costo. Lo define el TIEMPO por cliente

Acá está el único número que decide si esto es un buen negocio o un mal empleo:

| Escenario | Horas/cliente/mes | Bs por hora | Veredicto |
|---|---|---|---|
| **Operado a mano** (hoy) | ~5 h | **78 Bs/h** | Mal negocio. Es venderse barato |
| **Con el proponedor** | ~0,5 h | **780 Bs/h** | Buen negocio |

**La rentabilidad no depende del precio: depende de que exista el proponedor.** A Bs 390
con operación manual, 10 clientes son 50 horas al mes — un empleo de medio tiempo mal
pago. Con el proponedor, esos mismos 10 clientes son 5 horas.

Por eso la condición de salida escrita en el doc de alcance (cuando el tercer cliente esté
andando, el proponedor tiene que existir) **no es prolijidad: es la línea entre rentable y
no rentable**.

## El precio real al cliente no es 390

El add-on **no se vende solo** — va sobre un plan. La entrada real es:

| | Bs/mes |
|---|---|
| Plan básico | 320 |
| Add-on de contenido | 390 |
| **Total** | **710** |

Al tipo de cambio de hoy (~11,37), son **~USD 62/mes**. Contra una agencia que cobra por
mes y solo entrega posts, es competitivo — pero hay que decir 710, no 390, o la primera
reunión termina mal.

⚠️ **Ojo con esto:** el add-on (390) cuesta MÁS que el plan de entrada (320). Eso invita a
una pregunta que va a aparecer: *"¿y si quiero solo el contenido?"*. Hay que tener la
respuesta decidida antes de la primera venta, no improvisarla ahí.

## Dónde está el riesgo de verdad

No en el costo. En estos tres:

1. **App Review.** Sin Advanced Access no hay producto. ~20 días y no arranca hasta que se
   mande.
2. **Churn.** Un abono de contenido se cancela el primer mes que el cliente no ve leads. El
   circuito post→DM→lead es justo lo que lo defiende, pero **todavía no se probó en la
   cuenta de un cliente** — solo en las nuestras.
3. **Concentración de la app de Meta.** Un cliente abusivo puede hacer caer a todos.

## Veredicto

**La idea es rentable, con una condición y un bloqueo.**

- La estructura de costos es de software, no de agencia: variable ≈ 0, margen ~100 %.
- **La condición:** el proponedor. Sin él es un empleo mal pago disfrazado de producto.
- **El bloqueo:** App Review. Es lo único que hay que empezar HOY porque el reloj es de
  Meta y no nuestro.
