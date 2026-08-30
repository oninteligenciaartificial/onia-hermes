# Marketing Studio — primera prueba real (2026-08-29)

**Pedido de Sergio:** *"probalo con Lucía vendiendo la Onia Platform (tal vez es muy caro pero probá)"*.
**Costo: 4 créditos (≈ Bs 1,50).** Una imagen.

## Cómo se armó

`higgsfield.ai/marketing-studio` · **AVATAR** = `Lucia ONIA v4 FINAL` (Marketing Studio tiene su
**propio sistema de Avatares**, aparte de los Elements — Lucía ya existía ahí en 4 versiones) ·
**PRODUCT** = producto nuevo *"Onia Platform"* creado subiendo `references/oniahq/fondos/panel-real.png` ·
estilo **Full body** (el default `Closeup` pelea con una escena de dos personas) · 3:4.

En la descripción del producto se aclaró *"NO es un objeto físico: es una pantalla"*, porque si no
el modelo intenta inventarle una caja.

## 🟢 Lo que salió MEJOR de lo esperado

**El teléfono reproduce el dashboard de verdad.** Se lee el logo `onia`, el título **Hoy**, la cifra
**Bs 4.633,40** exacta, la curva, las barras de ventas por hora y los cuatro KPIs de abajo.
**Ese recorte es publicable tal cual.** No esperábamos fidelidad de UI.

La cara es Lucía: pecas, cejas gruesas, castaño ondulado. El avatar de Marketing Studio **no
derivó** respecto del canon.

## 🔴 Lo que salió mal — y es sistemático, no del prompt

1. **Mira a cámara y sonríe de catálogo.** El prompt decía, textual, *"ninguno mira a la cámara"*.
   **Lo ignoró.**
2. **La laptop muestra basura**: un verde plano con un triángulo blanco. El dashboard se reprodujo
   en el teléfono y NO en la pantalla grande.
3. **Casting de stock foto estadounidense**, no de Santa Cruz.
4. **Luz de publicidad**, no el tubo fluorescente feo que pedía el prompt.
5. El dedo señalando la pantalla es gesto de anuncio, no de conversación.

> **La conclusión que importa: Marketing Studio impone su estética de anuncio y pisa las
> instrucciones anti-glamour.** Es exactamente el registro "modelo de IA" del que costó sacar a
> Lucía con la receta normal.

## Qué significa para el negocio

**Son dos registros y no se mezclan:**

| | Sirve para |
|---|---|
| **Marketing Studio** | El **anuncio** de un cliente: producto legible, cara linda, luz de catálogo. Es lo que un comercio espera de una pieza publicitaria |
| **La receta normal** (`/ai/image` + `@lucia-skin-v1`) | La **voz de Lucía**: lugares feos, acción a medias, nadie mira a cámara |

**Meter Marketing Studio en la cuenta de Lucía la rompe.** Meter la receta normal en un anuncio de
cliente lo hace ver pobre. Cada uno en su lugar.

## Reglas para la próxima

- **Pedir el producto en un TELÉFONO, no en una laptop.** El teléfono salió fiel; la pantalla
  grande, inventada.
- **No pelear con la estética**: si se quiere registro documental, es la receta normal, no acá.
- El casting hay que forzarlo en el prompt de forma mucho más explícita, o aceptar que el
  secundario sale genérico.
