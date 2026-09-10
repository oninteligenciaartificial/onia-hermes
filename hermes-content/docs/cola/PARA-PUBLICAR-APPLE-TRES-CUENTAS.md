# Tres carruseles nuevos — uno por cuenta

> Sergio Urcullo, 2026-09-10: *"seguí haciendo carruseles para mi perfil personal y para
> Onia y para la comunidad, mirá tus archivos y andá armándolos"*.
>
> Los tres del patrón `apple-editorial`, tipografía Inter. Gates verdes.

| Pieza | Láminas | Cuenta | Qué hace |
|---|---|---|---|
| **Las seis respuestas** | 6 | `@sergiourcullo` | entrega algo que se usa hoy |
| **Seis archivos esta semana** | 8 | `@sergiourcullo` | invita a la comunidad mostrando lo que ya existe |
| **Cuatro cosas a mano** | 7 | **`@oniahq`** | vende el sistema sin hablar de nosotros |

🔴 **El handle dejó de ser global.** Estaba fijo en `@sergiourcullo` para todo el generador:
rendir una pieza de Onia firmada con el perfil personal la publica en la cuenta equivocada,
y **eso no lo atrapa ningún gate** — se ve recién cuando ya está arriba. Ahora hay un
`HANDLES` por pieza.

---

## 1 · Las seis respuestas · `@sergiourcullo` · 6 láminas

`carousels/out/apple-respuestas-inter/` · hoja: `HOJA-apple-respuestas.png`

Sale del drop del lunes 14 y del archivo ya publicado en `/stack/archivos`. Es la pieza más
**guardable** del carril: no cuenta lo que él hizo, entrega algo que el lector usa hoy.

**El remate está en la sexta.** Las cinco primeras informan y cualquiera las tiene a medias
escritas en la cabeza; la que pide la decisión casi nadie la tiene, y por eso casi nadie la
manda. Ése es el único dato de la pieza que el lector no sabía.

### Caption

```
Escribís lo mismo veinte veces por día.

WhatsApp Business —la app gratis— te deja guardar respuestas
y mandarlas con dos toques. Cinco son obvias: precio, horario,
dirección, formas de pago, tiempo de entrega.

La sexta no es obvia y es la que cambia el resultado:

"¿Querés que te lo reserve? Con eso ya te lo dejo apartado
a tu nombre."

Las cinco primeras INFORMAN. Ésa pide la decisión. Sin ella la
conversación se enfría sola y el cliente se va a pensarlo —
que casi siempre significa que no vuelve.

Son veinte minutos y no necesitás computadora.

¿Cuál es la frase que más veces tipeaste esta semana? Escribila
abajo y te la dejo lista para guardar. Contesto a todos.
```

---

## 2 · Seis archivos esta semana · `@sergiourcullo` · 8 láminas

`carousels/out/apple-comunidad-semana-inter/` · hoja: `HOJA-apple-comunidad-semana.png`

Invita a la comunidad **mostrando lo que se entrega**, no prometiendo lo que se va a
entregar: los seis archivos existen y están publicados. Es la diferencia entre *"unite que
va a estar buenísimo"* y *"esto es lo que hay"*.

La lámina 07 contesta de frente la pregunta que alguien va a hacer —*si las guías son
públicas, ¿para qué entro?*— sin esconder nada: **«todo lo que enseño está afuera; adentro
está hecho».**

⚠️ **Sale el domingo 13 o el lunes 14**, no antes: los archivos que promete se entregan a
partir del lunes.

### Caption

```
Esta semana subo un archivo por día a mi comunidad. Los seis
que hacen andar mi negocio, listos para copiar y pegar:

lunes      las seis respuestas de WhatsApp
martes     el script que deja tu PC vieja lista como servidor
miércoles  el archivo que levanta n8n con todo configurado
jueves     el CLAUDE.md, escrito para un negocio y no para código
viernes    una plantilla de video desde HTML
sábado     el alma del agente que avisa cuando algo se rompe

Todo lo que enseño está afuera y va a seguir estando: las guías
completas están en mi web y no me guardo nada.

Adentro está lo otro — el archivo ya escrito, y alguien que te
contesta cuando te trabás. La guía es para cualquiera; esto es
para vos.

Es gratis y no vendo nada adentro.

Escribí «voy» abajo y te paso el enlace del canal.
```

---

## 3 · Cuatro cosas a mano · `@oniahq` · 7 láminas

`carousels/out/apple-onia-cuatro-inter/` · hoja: `HOJA-apple-onia-cuatro.png`

### Las tres reglas que cumple, y por qué importan

1. **Cero autobombo.** `CLAUDE.md` §*Se vende el SISTEMA*: nada sobre nosotros, el equipo
   ni nuestras competencias. **Las siete láminas hablan del día del dueño del negocio**, no
   del producto. El sistema aparece nombrado una sola vez, en la lámina 06.
2. **La venta nunca exhibe obra.** Ni un "próximamente", ni un "beta", ni una lista de lo
   que falta.
3. 🔴 **Sólo módulos 🟢 del catálogo** — los que **un cliente real ya usó**: agenda y citas,
   clientes, servicios e inventario. Los 🟡 están completos y leyendo datos reales, pero les
   falta kilometraje, y esta pieza no los nombra.

**Sin precio.** Los precios los fija `subscription-plans.ts` / `pricing.ts`; esto es
contenido, no una cotización.

### Caption

```
Tu negocio ya funciona. Ésa nunca fue la pregunta.

La pregunta es cuántas cosas seguís haciendo a mano porque
siempre se hicieron así:

· anotar cada turno en un cuaderno
· buscar quién era el cliente del martes
· repetir el precio de memoria
· contar el stock a ojo

Ninguna de las cuatro necesita que la sigas haciendo vos.

Los turnos entran solos y el cliente reserva desde un link.
Cada cliente con su ficha y su historial. Lo que vendés con su
precio en un solo lugar. Y el stock que se cuenta solo y te
avisa antes de que te quedes sin nada.

El mismo negocio, cuatro cosas menos por día.

¿Cuál te come más tiempo a vos? Escribí abajo cuál y te digo
por dónde empezaría en tu rubro. Contesto a todos.
```

### De dónde sale cada afirmación

| Lámina | Afirmación | Fuente |
|---|---|---|
| 02 | agenda, reserva por link | `ONIA_CATALOGO_DE_VENTA.md` — Agenda y citas 🟢 · Agenda pública 🟢 |
| 03 | ficha e historial por cliente | Clientes/pacientes 🟢 |
| 04 | servicios con precio y duración | Servicios/tratamientos 🟢 |
| 05 | entradas, salidas y aviso de faltante | Inventario simple 🟢 |

**Cero cifras.** No hay porcentajes de ahorro, ni horas, ni cantidad de clientes: nada que
haya que sostener después.

---

## Alt text (los tres)

> **Respuestas:** carrusel de seis láminas sobre fondo gris claro. La portada dice «seis
> respuestas» y que no se vuelven a escribir nunca. Sigue el icono de WhatsApp con el
> costo en cero, los cinco atajos, y una lámina dedicada al sexto, «/cierro», con la frase
> que pide la decisión. Cierra preguntando qué frase repite el lector.

> **Seis archivos:** carrusel de ocho láminas sobre fondo gris claro. La portada dice «seis
> archivos» con una tira de los seis iconos. Después, una lámina por día con la herramienta
> y el nombre del archivo, todas en cero pesos. La séptima dice que todo lo que enseña está
> afuera y que adentro está hecho. Cierra invitando al canal.

> **Cuatro cosas:** carrusel de siete láminas sobre fondo gris claro con el logo de Onia.
> La portada dice «cuatro cosas a mano». Siguen cuatro láminas, una por cada cosa que se
> deja de hacer: la agenda, los clientes, los servicios y el inventario. Cierra preguntando
> cuál le come más tiempo al lector.

## ⚠️ Antes de publicar

- **La pieza de Onia va en `@oniahq`**, no en el perfil personal. El pie de las siete
  láminas dice `@ONIAHQ` — si dice otra cosa, no se publica.
- **Ninguna de las tres usa palabra clave con respuesta automática.** La cuenta tiene
  `palabras: {}` en el workflow n8n activo: las tres piden un comentario que se contesta a
  mano.
- **La de la comunidad no sale antes del domingo 13.** Promete archivos que se entregan a
  partir del lunes 14.
