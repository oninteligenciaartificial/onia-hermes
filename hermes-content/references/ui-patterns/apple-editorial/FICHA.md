# Patrón: apple-editorial

> Referencias: 8 carruseles que mandó Sergio Urcullo el 2026-09-06 ("tienes este estilo
> que usar... usamos la tipografía estilo Apple"). Una de ellas es **bastian.xu**, la misma
> cuenta de la que ya salió `statement-3d-minimal` el 01-sep.
>
> **Decisión de alcance (Sergio Urcullo, 06-sep): CONVIVE, no reemplaza.** Los 13
> generadores de `scripts/marca-personal/` y las FICHAs de `statement-3d-minimal` y
> `carrusel-pinterest-refs` quedan intactos.

## Por qué existe si ya había un patrón de la misma cuenta

`statement-3d-minimal` nació de bastian.xu, pero después se le montó encima la FICHA de
`carrusel-pinterest-refs`, que trajo **"collage con capas"** y **"stickers siempre"**. Esas
dos reglas son exactamente lo que separa las piezas actuales de las referencias que Sergio
Urcullo sigue señalando. Acá el collage **no existe**, y eso es la diferencia dura entre los
dos patrones — no una variante de estilo.

| | statement-3d-minimal | apple-editorial |
|---|---|---|
| Collage (cinta · sticker · ícono flotante) | **obligatorio** | **prohibido** |
| Verde | highlight en el remate de cada pieza | sólo CTA y donde nombra Onia |
| Objetos | Fluent 3D emoji a color | squircle app-icon, color de marca real |
| Sombra | `0 30px 45px rgba(0,0,0,.25)` | `0 24px 48px rgba(0,0,0,.14)` — más suave |
| Formato | imagen única | **carrusel** de 8 + imagen única |

## Los 5 layouts (leídos de las 8 referencias)

| ID | Layout | Ref | Para qué |
|---|---|---|---|
| **A** | Grid comparativo 3×N, divisor hairline entre filas, objeto + label debajo | 1 | taxonomías, "las 3 decisiones" |
| **B** | Grid 2×2, objeto encajonado en tarjeta blanca + label debajo | 2 | inventarios, "lo que necesito" |
| **C** | Duelo 2-up con dato de remate, fondo crema, acento serif | 3 | contraste con cifra |
| **D** | Statement puro: texto centrado, sin objeto | 4 | portada, transición, CTA |
| **E** | Ficha de producto: objeto + nombre gigante + 2-3 líneas gris + **precio gigante** | 5,6,7 | el carrusel-stack, una cosa por lámina |
| **F** | Portada con foto recortada sobre gris claro | 8 | presentación — 🔴 **bloqueado**: no hay foto de Sergio Urcullo recortable en este carril |

## Receta visual (medida, no a ojo)

Valores exactos en [`tokens.css`](tokens.css). Lo que no se puede poner en una variable:

- **El apretado hace el look, no el peso.** `letter-spacing:-.032em` en display. Un titular
  suelto se lee genérico aunque la familia sea la correcta.
- **Máximo 2 líneas de titular.** Si no entra, se reescribe el copy, no se baja el cuerpo.
- **Objetos a la misma altura óptica** en toda la fila. No el mismo `height` — la misma
  presencia visual: un objeto ancho y bajo necesita más caja que uno alto y angosto.
- **Cero adorno.** Sin collage, cinta, sticker, grano, emoji a color ni metadata decorativa.
  Es la regla "menos es más" de la §7 llevada hasta el final.
- **El precio es el segundo foco**, después del nombre. Nunca del mismo tamaño que la
  descripción.
- **Divisor hairline sólo en layout A.** En los demás, el aire separa.

## Tipografía — ⏳ A/B RENDERIZADO, ESPERANDO VEREDICTO

SF Pro **no se puede empaquetar** (licencia Apple restringida a desarrollo en sus
plataformas). Las dos candidatas se rinden con `--tipografia`:

| | familia | a favor | en contra |
|---|---|---|---|
| **inter** | Inter (OFL), vendorizada por `build-inter.py` | ~95% de fidelidad con las refs; llega a `wght` 700 | no está en el trío de marca |
| **dmsans** | DM Sans, del trío de `ONIA_BRAND_IDENTITY_2026.md` §2 | legal de marca, ya vendorizada | 🔴 **el archivo está recortado a `wght` 400–500** por `build-onia-fonts.py`: no puede dar el peso display que piden las refs, y por eso se ve liviana |

Handle y micro-etiquetas: **Spline Sans Mono** del trío de marca, ya vendorizada.
**No adoptar ninguna hasta que Sergio Urcullo mire el A/B.**

### 🔴 Tres leyes tipográficas conviviendo (hallazgo del 06-sep, sin resolver)

| Fuente | Qué manda |
|---|---|
| `ONIA_BRAND_IDENTITY_2026.md` §2 + `brand/fonts/README.md` | Bricolage Grotesque · DM Sans · Spline Sans Mono |
| `ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md` §7 | Archivo + Geist Mono, "SIEMPRE" |
| Lo que de verdad se renderizaba | **ninguna de las dos** — ver la trampa #4 |

Lo decide Sergio Urcullo. Este patrón no toca §7 ni el trío: vendoriza su candidata
aparte y deja el A/B mirable.

## Trampas (se van llenando al costo de un render)

1. **La sombra de `statement-3d-minimal` es demasiado dura acá.** `.25` sobre un squircle
   plano lo despega del fondo y rompe la calma. Va `.14`.
2. **El verde como texto reprueba AA** (2,12:1 sobre fondo claro, medido en §7). En este
   patrón el verde va de **relleno** con tinta negra, igual que allá — sólo que acá aparece
   en dos láminas de ocho, no en todas.
3. **CTA de palabra clave: NO en `@sergio_urcullo`.** Esa cuenta tiene `palabras: {}` en el
   workflow n8n activo de private-reply (medido 2026-09-04, ver
   `briefs/marca-personal/lamina-grid-mensajes.json`): un "Comentá X" ahí no entrega nada y
   no deja registro. El CTA de este patrón pide respuesta humana, no automatizada.
4. 🔴 **Google Fonts en tiempo de render = fallback silencioso.** Con
   `@import url('https://fonts.googleapis.com/...')` Chrome dispara la captura antes de que
   llegue la webfont: el PNG sale con la tipografía del sistema y **nada lo delata** — mismo
   peso de archivo, misma composición. Se descubrió porque las dos variantes del A/B salieron
   **byte-idénticas** (mismo md5) y los anchos medidos diferían 4px, que es ruido.
   La regla ya existía escrita en `brand/fonts/README.md` ("nada de Google Fonts en tiempo de
   render") y este carril la incumplía. Acá las fuentes van autohospedadas por `file://` y
   `--check` **asegura** con `document.fonts.check` que la familia cargó.
   ⚠️ **Los 13 generadores de `scripts/marca-personal/` siguen con `@import` de Google.**
   No se tocaron: son de otro carril y el alcance de esta sesión es este patrón. Queda anotado.
5. **El texto que desborda el margen no se ve en miniatura.** `--check` mide el ancho real
   entintado contra los 888px útiles y falla. Ya atrapó "6 HERRAMIENTAS" a 126px en la
   primera corrida.
6. **Un squircle blanco sobre `#F5F5F7` no tiene contraste** y lee como mancha flotante
   (pasó con n8n). Los objetos claros van sobre fondo oscuro.
