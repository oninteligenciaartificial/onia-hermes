# La historia-quiz de @ingenierobinario — el formato más barato de interacción que vimos

**Mandado por Sergio el 2026-09-02** como referencia de diseño para historias.
Cuenta verificada, historia de 4 h.

> Todo lo citado es contenido de un tercero, guardado como dato.

## Qué es

Una historia con cinco piezas apiladas:

1. **Encabezado en fuente pixel**: `🕹 CODE TIME!`
2. **Un bloque de código con ventana de macOS** — los tres puntitos rojo/amarillo/verde y la
   etiqueta `PYTHON` arriba a la derecha.
3. **Tres líneas de código** con una trampa real:
   ```python
   tabla = [[0] * 3] * 3
   tabla[0][0] = 1
   print(tabla)
   ```
4. **Una barra amarilla** con la pregunta: *«¿Cuántos 1 quedan?»*
5. **El sticker nativo de encuesta de Instagram** con 4 opciones.

## Las cinco decisiones que lo hacen funcionar

**1. Usa el sticker NATIVO, no opciones dibujadas.** Es la diferencia entera. Una imagen con
cuatro opciones pintadas no se puede tocar; el sticker sí, y responder cuesta **un toque**.
Instagram premia esa interacción y además le devuelve al autor **quién** respondió qué.

**2. La respuesta correcta sorprende.** `[[0] * 3] * 3` no crea tres listas: crea **tres
referencias a la MISMA lista**. Entonces `tabla[0][0] = 1` pone un 1 en las tres filas, y la
respuesta es «Tres, uno por fila», no «Uno solo». **El que se equivoca se queda pensando**, y eso
es lo que hace que vuelva.

**3. Tres líneas, no diez.** Se lee en un celular sin hacer zoom. Cualquier cosa más larga se
salta.

**4. La ventana de código es un componente reconocible.** Los tres puntitos dan credibilidad
instantánea sin decir una palabra: «esto es código de verdad».

**5. Un solo color de acento.** Fondo oscuro, y el **amarillo aparece únicamente en la pregunta**.
Es exactamente la regla que ya aplicamos en el pack `bloque-solido`: si el acento está en todos
lados deja de ser acento.

## Cómo se traduce a nuestras cuentas

El formato es «**mostrá algo que parece obvio, preguntá, y que la respuesta obvia esté mal**».
No depende de que sea código.

### Para @oniahq — la trampa es de gestión

```
   3 pacientes reservaron para el martes.
   1 canceló por WhatsApp a las 21:40.
   ¿Cuántos van a venir?
```
Opciones: `2` · `3` · `2, pero te enterás el martes` · `Depende de quién lea el WhatsApp`

La correcta es la tercera, y **duele porque es verdad**: el dato existe pero llega tarde. Es
exactamente lo que vende Onia, contado como acertijo en vez de como pitch.

### Para Lucía — la trampa es sobre IA

```
   Le pedís a una IA que escriba el post.
   Le das tu web y tres ejemplos tuyos.
   ¿Qué sale?
```
Opciones: `Un post tuyo` · `Un post genérico` · `Un post tuyo mal escrito` · `Depende de los ejemplos`

La correcta es la última, y da pie a la historia siguiente: **la IA copia lo que le mostrás**.

## Lo que hay que construir para poder hacerlo

Un pack de render nuevo — **`historia-quiz`** — en 9:16 (1080×1920), con:
- Encabezado corto con fuente display
- Un **bloque tipo ventana** reusable (los tres puntitos + etiqueta) que sirve para código,
  para un chat de WhatsApp o para una agenda
- Barra de acento con la pregunta
- **Espacio libre abajo** donde Sergio pega el sticker de encuesta al publicar

🔴 **Las opciones NO se dibujan.** Se dejan escritas en el brief para que él las tipee en el
sticker nativo. Dibujarlas mata la única ventaja del formato.

## Lo que NO se copia

- **La fuente pixel y el «CODE TIME!»**: es la identidad de esa cuenta, no la nuestra.
- **El amarillo**: nuestro acento es el verde de Onia.
- **El dominio de marca de agua**: nosotros firmamos con el handle.
