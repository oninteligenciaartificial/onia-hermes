# Video 01 — Qué es Claude y qué es Claude Code

Estado: **guion listo, sin grabar.** Setup técnico: [SETUP-GRABACION.md](SETUP-GRABACION.md).

---

## La decisión de fondo

Hay miles de videos "qué es Claude". Ninguno tiene lo que vos tenés: **corrés un SaaS en
producción, en Bolivia, vos solo, con esta herramienta**. El video no compite explicando
mejor — compite mostrando que funciona en algo real que existe.

Entonces:

- ❌ No es un tour de características, ni precios, ni comparativa con ChatGPT.
- ✅ Es **una sola idea**, clavada: *Claude y Claude Code no son lo mismo, y la diferencia
  es que uno tiene manos*.

Casi todos creen que Claude Code es "Claude pero para programar". No. Es Claude **con
acceso a tu máquina**. Esa distinción es lo que el video vende, y es lo que a la gente le
hace click.

**Duración objetivo: 9–11 minutos.** Más largo, no lo terminás. Más corto, no alcanza para
la demo.

---

## Sobre las pizarras: Miro no, Excalidraw sí

Preguntaste por Miro. **No lo uses**, por tres razones concretas:

1. En video se ve genérico y corporativo, y para que se lea hay que hacer zoom y pan
   constante — marea al espectador.
2. Carga lento y se nota en la grabación.
3. Para **un** diagrama no justifica abrir una herramienta pesada.

Usá **[Excalidraw](https://excalidraw.com)**: gratis, sin cuenta, trazo a mano. Y lo más
importante: **dibujalo en vivo mientras hablás**. Un diagrama que aparece hecho se saltea;
un diagrama que se dibuja mientras alguien explica, se mira. Es la técnica más barata que
existe para retención.

Regla dura del video: **un solo diagrama, en el bloque 1.** Todo lo demás es demo real.
Un video sobre una herramienta se gana mostrando la herramienta, no dibujándola.

Para intros, títulos y lower-thirds más adelante: **HyperFrames**, que ya está en el repo.
No instales nada nuevo.

---

## Estructura

### 0 · Hook — 0:00 a 0:20 · escena `Ctrl+1` (Pantalla)

**Cero intro. Cero "hola, bienvenidos a mi canal".** Arrancás con la pantalla ya
trabajando.

Mostrás: terminal, escribís una instrucción, Claude Code lee archivos y hace el cambio.
Acelerado si hace falta.

> "Esto no es autocompletado. Le pedí que arreglara algo, y leyó mis archivos, entendió el
> problema y lo resolvió solo. En diez minutos te explico qué es Claude, qué es Claude
> Code, y por qué no son lo mismo — que es lo que casi todos confunden."

---

### 1 · La distinción — 0:20 a 2:00 · escena `Ctrl+2` (Pantalla + cara)

**Excalidraw en blanco. Dibujás mientras hablás.**

```
              VOS
               │
        ┌──────┴──────┐
        │             │
     CLAUDE      CLAUDE CODE
     (el chat)    (la terminal)
        │             │
      habla       habla y HACE
        │             │
   no toca nada   tus archivos
                  tus comandos
                  tu git
```

La analogía que lo cierra:

> "Claude es un consultor al teléfono. Le contás el problema, te dice qué hacer, y vos lo
> hacés. Claude Code es el mismo consultor, pero sentado en tu computadora, con el teclado
> en la mano."

Y el punto que engancha:

> "Es el mismo cerebro. Lo que cambia es que uno tiene manos."

---

### 2 · Claude, la demo — 2:00 a 4:00 · escena `Ctrl+1`

En `claude.ai`. **No uses un ejemplo de juguete** — nada de "escribime un poema".

Algo que un dueño de negocio entienda al toque: subís un **PDF real** (una factura, un
contrato, un extracto) y le pedís que saque los datos ordenados.

> "Esto es Claude. Le doy algo, me contesta. Pero fijate: el PDF lo subí yo, y la respuesta
> me la copio yo. Él no tocó nada de mi computadora."

Ese último detalle es el que prepara el bloque siguiente. No lo saltees.

---

### 3 · Claude Code, la demo — 4:00 a 8:00 · escena `Ctrl+1`

El corazón del video. **Cuatro minutos, y que se vean cuatro cosas.**

Hacelo en una **carpeta vacía**, no en Onia Platform. Dos razones: es reproducible para
quien mira, y no exponés nada de un sistema con datos de clientes.

Lo que tiene que verse, en este orden:

1. **Lee antes de tocar.** Es lo que más sorprende. Que se vea la lista de archivos que
   abrió antes de escribir una línea.
2. **Pide permiso.** Que se vea el prompt de confirmación antes de modificar.
3. **Corre comandos.** Que arranque algo y se vea el resultado en el navegador.
4. **Hace el commit.** Cerrar el círculo: el trabajo quedó guardado.

> "Miren lo que hizo antes de escribir una sola línea: abrió mis archivos para entender
> cómo está armado esto. No adivinó. Leyó."

**Los últimos 20 segundos del bloque: tu sistema real.** Abrís Onia Platform en
producción, medio minuto, y decís:

> "Y esto no es un ejemplo de tutorial. Este es un sistema que está funcionando ahora
> mismo, con clientes adentro, y una parte grande de esto se construyó así."

Eso es la credencial. Sin eso, sos un video más. Con eso, sos el único.

---

### 4 · Los límites — 8:00 a 9:30 · escena `Ctrl+3` (Cara)

**El bloque que nadie hace, y el que da credibilidad.** A cámara, sin pantalla.

Tres cosas, honestas:

1. **Se equivoca con seguridad.** No duda cuando está mal. Hay que revisar siempre.
2. **Cuesta plata.** Es una suscripción, decí cuánto.
3. **No reemplaza saber qué querés.** Si no entendés tu propio sistema, te va a ayudar a
   romperlo más rápido.

Y ahí va **tu anécdota real** — vale más que los tres puntos juntos:

> El día que el login de producción dejó de funcionar. Claude Code hizo exactamente lo que
> le pedí; el problema fue que se compiló con un archivo de entorno equivocado presente, y
> eso metió una dirección local dentro del build. La herramienta hizo su trabajo. El que
> no entendió su propio entorno fui yo.

Cierre del bloque:

> "Te acelera. No te cubre."

Esa historia es tuya, es verificable y no la tiene nadie más. Es lo que separa el canal de
un resumen de la documentación.

---

### 5 · Cierre — 9:30 a 10:00 · escena `Ctrl+3` (Cara)

**Una sola llamada a la acción.** Para un canal nuevo, pedir suscripción es débil. Pedí
algo que genere comentarios:

> "En el próximo video lo instalamos desde cero y le pedimos las primeras tres cosas.
> Dejame en los comentarios qué querés que le pida — uso el más votado."

---

## Producción

**Orden de grabación:** las demos primero (bloques 2, 3, 4), la cara al final (0, 1, 5).
Cuando grabás la cara ya sabés exactamente qué salió en las demos y no prometés nada que
no mostraste.

**No leas el guion palabra por palabra.** Suena leído y se nota. Este documento son las
ideas y las frases que sí conviene decir textuales (las que están en `>`). El resto,
contalo.

**Si te trabás: no cortes la grabación.** Quedate callado tres segundos, respirá, y repetí
la frase desde el principio. En la edición el silencio es el marcador para cortar.

### Título — candidatos

1. `Claude y Claude Code no son lo mismo (te explico la diferencia en 10 minutos)`
2. `Uso Claude Code todos los días para correr mi empresa. Esto es lo que hace.`
3. `Qué es Claude Code y por qué no es "ChatGPT para programar"`

El 1 gana en búsqueda; el 2 gana en click. Para el video **uno** del canal, el 1 — todavía
no tenés audiencia que te conozca.

### Miniatura

Tu cara a la izquierda + a la derecha, dos cajas: **CLAUDE** y **CLAUDE CODE**, con una
flecha de "≠" entre las dos. Nada de flechas rojas ni caras de sorpresa.

---

## Pendientes anotados (fuera del alcance de este video)

- Video 02: instalar Claude Code desde cero + las primeras tres cosas que le pedís.
- Intro animada y lower-thirds con HyperFrames.
- Decidir si el canal es en tu nombre o de Onia. **No se decide en el video 1.**
