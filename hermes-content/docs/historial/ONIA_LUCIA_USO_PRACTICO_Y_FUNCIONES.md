# Lucía: para qué sirve en la práctica, y qué funciones hacen falta de verdad

> Sergio, 2026-08-23: *"pensá literal qué uso práctico le damos a Lucía y de ahí vemos qué
> funciones se necesitan; lo perfeccionamos para nosotros y a partir de eso lanzamos."*
>
> La estrategia es correcta: se perfecciona con la cuenta propia y recién después se vende.
> Este doc ajusta **dónde** perfeccionar, porque los números dicen que el cuello de botella
> no está donde parece.

## Los números que obligan a repensarlo

Medidos por API el 22-ago:

| | @lucia.antelo.oficial | @oniahq |
|---|---|---|
| Posts | **0** | 2 |
| Seguidores | **0** | **23** |
| Seguidos | 0 | 3 |

⚠️ **Corrección a la auditoría del 22-ago.** Ese doc concluye que "el sistema de @oniahq
FUNCIONA (17% de engagement)". El 17% sale de **6 likes y 4 comentarios sobre 23
seguidores**. Cuatro comentarios no son una señal: son cuatro comentarios. Un porcentaje
sobre una base de 23 no mide nada, y tomar esa decisión como validada es el error clásico
de leer un porcentaje sin mirar el denominador.

**La verdad simple: ninguna de las dos cuentas tiene distribución.**

## El reframe: producir está resuelto, distribuir y medir no

El 23-ago, en un día y a **0 créditos**, salieron: 1 carrusel de 7 slides, 8 historias de
video, y un carrusel de prueba para un cliente sin fotos. Quince piezas.

| Lado del sistema | Estado real |
|---|---|
| **Producir** | ✅ Resuelto. Es el lado fuerte y ya está sobrado |
| **Publicar** | ✅ Resuelto (Postiz / Graph API) |
| **Distribuir** | 🔴 **Roto**. 0 y 23 seguidores. Nadie ve lo que publicamos |
| **Medir** | 🔴 **No existe**. No sabemos qué molde funciona porque no medimos ninguno |

Si "perfeccionamos con Lucía" produciendo más piezas, vamos a pulir el lado que ya está
bien y no vamos a tocar los dos que deciden si el producto se vende.

## Para qué sirve Lucía, en concreto

Hoy **no sirve para llegar a gente** — no tiene a quién llegar. Sirve para tres cosas
reales, y conviene decirlas así para no confundirse:

1. **Banco de moldes.** Cada pieza que se hace para ella es un molde que después hereda un
   cliente. L6 no fue un carrusel: fue el molde "5 señales" que cualquier rubro reusa.
2. **La prueba mostrable.** Una cuenta real, con feed real, que se abre en una reunión de
   venta: *"esto lo produjo el sistema solo, mirá la cadencia"*. Sin eso, el add-on es una
   promesa.
3. **El laboratorio del circuito** — pero solo sirve como laboratorio **si hay tráfico**.
   Con 0 seguidores, el circuito post→comentario→DM→lead no se puede probar: nunca va a
   haber un comentario que disparar.

## Las funciones, literal, ordenadas por lo que está roto

### 🔴 1. Medición del circuito — es la que falta y la que habilita todo lo demás

Sin esto, "perfeccionar" es adivinar. Hay que poder ver, por pieza:

```
publicada → alcance → comentarios → cuántos con la palabra
         → DMs entregados → clics al recurso → leads en el panel
```

Es la única forma de saber qué molde sirve. Y es exactamente lo que después se le muestra
al cliente para que no dé de baja el abono: **"tu contenido trajo N leads este mes"**.
Es a la vez la herramienta interna y el argumento de retención.

**Estado: no existe nada.** Los datos están (Graph API da alcance y comentarios; el panel
tiene los leads con `?src=`), pero nadie los junta.

### 🔴 2. Distribución — el cuello de botella real

Producir 8 piezas para 0 seguidores es tirar trabajo. Antes de más producción hace falta
que exista audiencia. Tres caminos, y ninguno es código:

| Camino | Costo | Quién |
|---|---|---|
| Calentar la cuenta: seguir 50-70 cuentas del nicho e interactuar | 0 | Sergio, celular |
| Publicar primero en @oniahq, que al menos tiene 23 | 0 | ya está la cola |
| Pauta | plata | 🔴 bloqueado: falta la tarjeta en ONIA Ads |

⚠️ Esto no lo resuelve el sistema. Es la parte que sí depende de una persona, y hay que
decirlo en vez de esperar que la automatización la tape.

### 3. Proponedor — para que producir no dependa de mí

Hoy yo elijo el tema, escribo el copy, elijo las fotos y armo el brief. Eso no escala ni
para nosotros. La función: **de un tema + rubro + datos del negocio, sale el brief con el
copy ya pasado por el gate del dolor.**

Para Lucía el "negocio" es Onia, así que se prueba con nuestros propios datos antes de
tocar los de un cliente.

### 4. Calendario ejecutable

Hoy el calendario es un `.md` que leo yo y ejecuto a mano. Tiene que ser una fuente que el
sistema **lea y ejecute**: qué pieza, qué día, qué cuenta, qué palabra.

### 5-8. Lo que ya está y no hay que rehacer

| | Estado |
|---|---|
| Render de carruseles (6 packs, 3 formatos) | ✅ |
| Render de historias en tanda | ✅ 23-ago |
| Publicación programada | ✅ |
| Palabra → DM → recurso | ✅ vivo |
| Lead al panel con atribución | ✅ vivo |

## El hito que define "perfeccionado"

No es cantidad de piezas ni de seguidores. Es **UN lead real que recorra el circuito
completo**: alguien que no conocemos ve una pieza, comenta la palabra, recibe el DM, abre
el recurso y aparece en el panel.

Ese lead prueba el producto entero de una sola vez. Hasta que exista, el add-on se vende
sobre una promesa. Después de que exista, se vende sobre una captura de pantalla.

**Todo lo demás se ordena en función de eso.**

## Orden propuesto

1. **Publicar** — el reel L1 espera OK y la cuenta se enfría. Sin publicar no hay nada que medir.
2. **Calentar** las dos cuentas (manual, Sergio).
3. **Medición** del circuito — la construyo yo, es la función que falta.
4. **Proponedor**, ya con datos de qué molde funcionó.
5. Recién ahí, empaquetar para clientes. En paralelo corre App Review, que tarda ~20 días
   y no depende de nada de esto.

## Qué depende de Sergio

- 🔴 **OK al reel** — bloquea el punto 1, que bloquea todo lo demás.
- 🔴 **Calentar las cuentas** — es lo único que no puedo hacer yo y es el cuello de botella real.
- 🟡 Mandar App Review, para que los ~20 días corran en paralelo.
- 🟡 La tarjeta de ONIA Ads, si se quiere acelerar la distribución con pauta.
