# P04 · P23 + P24 en el banco de motion: el eje que gira y el velocimetro por scroll (y corregir la ficha de United Carriers del 11-ago)

- **Destino:** `web-factory`
- **Sale de:** [la ficha](../2026-08-23-cosecha-review-united-carriers-eje-de-scroll-y-velocimetro.md) · `Db9L8EDhf5H` · @oproductdesigner
- **Fuente:** https://www.instagram.com/p/Db9L8EDhf5H/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Nada para lo que declaro SIRVE YA: el velocimetro y el giro de eje son CSS + JS puro, sin credencial, sin gasto y sin cliente. Lo unico que falta y NO se puede resolver desde este material es medir el peso real de unitedcarriers.com (LCP, KB de JS gzipped) para confirmar o desmentir la afirmacion del caption de que carga muy liviano — eso exige abrir y medir el sitio, y hoy solo tengo el juicio escrito de un tercero. Ese dato es el que decide si la ficha del 11-ago tenia razon al descartarlo por presupuesto de performance.

---

```text
Carril web-factory. Objetivo unico de la sesion: meter en el banco de motion los dos patrones que sacamos del reel https://www.instagram.com/p/Db9L8EDhf5H/ (@oproductdesigner reseñando unitedcarriers.com), dejarlos con demo que se pueda MIRAR, y corregir la ficha de intake que ya teniamos de ese mismo sitio.

Contexto que no tenes que volver a investigar:
- El sitio ya estaba en el banco. Lee PRIMERO hermes-content/references/video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md. Esa ficha analizo el MISMO sitio desde otro reel el 11-ago, lo dejo en FUTURO, y dejo abierta esta verificacion textual: "A VERIFICAR: que unitedcarriers.com siga online y sea el sitio real en produccion (no un mockup de portafolio armado para el reel)". Tambien afirma "no se nombra herramienta ni framework".
- El reel nuevo aporta datos que aquella ficha no tenia. En el footer, leido en pantalla: "© 2026 UNITED CARRIERS APAC PTY LTD · CRAFTED BY BEAMPLUS ... POWERED BY STRIPE"; HEAD OFFICE 2A International Square, Tullamarine VIC 3043, Australia; EMAIL contact@unitedcarriers.com; HOTLINE 1300 000 082; OPERATING ACROSS Australia / New Zealand / Hong Kong / China; SECURE PAYMENTS con pasarela PCI-DSS. La agencia SI esta nombrada (BEAMPLUS); el framework sigue sin nombrarse.
- El caption (portugues) afirma que el sitio carga muy liviano y usa muy poco video, y que tapar escenas elaboradas con videos ya renderizados "funciona, si, pero pesa" y sale caro en infra y experiencia. Eso es JUICIO DE UN TERCERO, no una medicion nuestra. No lo escribas como hecho.

HACE ESTO, en este orden:

1. Corregi (no dupliques, no crees archivo nuevo con fecha de hoy) hermes-content/references/video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md: reemplaza el bloque "A VERIFICAR" por lo que este reel efectivamente muestra (sitio navegado en vivo, con datos de empresa, direccion fisica, hotline y pasarela de pagos — consistente con produccion), corregi la linea "no se nombra herramienta ni framework" para reflejar que la AGENCIA si esta nombrada (CRAFTED BY BEAMPLUS) aunque el framework no, y dejá escrito como pendiente explicito que NADIE midio todavia el peso real del sitio. Cita el reel Db9L8EDhf5H como fuente de la correccion. El veredicto FUTURO del sitio completo se mantiene: no lo cambies.

2. Agrega dos patrones a web-factory/docs/MOTION_PATTERN_BANK_2026.md, siguiendo EXACTAMENTE el formato de los P1-P22 que ya estan ahi (el banco va por P22; ojo que P18 BleedWordmark ya cubre la palabra gigante sangrada, no lo repitas):
   - **P23 — Eje que gira (V->H->V) con costura fisica.** El scroll cambia de eje vertical a horizontal y vuelve, y la transicion entre secciones es la continuacion del MISMO objeto portador, nunca un fundido. En el sitio de referencia: un contenedor pasa a camion, la carretera dobla 90 grados y el eje vuelve a vertical; la atmosfera del globo se blanquea y ES el fondo blanco de la seccion siguiente; la franja de carretera desemboca en la cubierta de un barco; las nubes pasan a ser el suelo del avion. Regla dura que tiene que quedar escrita: el portador se dibuja POR ENCIMA de la capa de texto en al menos una seccion — eso es lo que hace que se lea como un unico espacio 3D y no como fondo decorativo. Implementalo con GSAP ScrollTrigger (skill gsap-scrolltrigger) y respeta las reglas duras de la seccion 1 del banco, incluido prefers-reduced-motion.
   - **P24 — Lectura derivada de velocidad de scroll.** Un contador NN KM/H en una esquina, derivado de la VELOCIDAD del scroll (no de la posicion), suavizado y formateado a dos digitos, que cae a 00 cuando el usuario se detiene. Es el detalle mas barato y mas impresionante del sitio entero: cero 3D, cero WebGL, cero assets. Dejalo generico (unidad configurable), no atado a logistica.

3. Crea hermes-content/references/ui-patterns/scroll-velocity-readout/ con una demo autocontenida (mismo formato que las carpetas hermanas: chat-widget/, checkout-card/, floating-cart/, etc.) que muestre P24 vivo y P23 al menos en su version minima de un giro de eje.

4. Anota en web-factory/docs/DESIGN_LEARNED_2026.md el truco tipografico de titular en dos tonos: primera linea en gris, resto en casi-negro (WE MOVE FREIGHT gris / WE OWN THE OUTCOME negro). Una linea, con su porque.

REGLAS DE LA CASA que aplican aca:
- Verificar es MIRAR. Abri la demo con Playwright + Chromium headless y LEE la captura. Un 200 y un grep no son verificacion.
- Un tema = un archivo sin fecha. No crees un doc nuevo al lado de la ficha del 11-ago: corregila.
- No fabriques. Lo que el reel no dice, no lo escribas. En particular: NO afirmes con que framework esta hecho el sitio (no se dice en ningun lado) y NO afirmes que carga liviano como si lo hubieramos medido.
- Metodo correcto desde el primer intento: carga las skills impeccable, motion-doctrine, seam-craft y gsap-scrolltrigger ANTES de escribir codigo.
- Rama propia, commits conventional, gates (tsc --noEmit si aplica, tests, code-reviewer) antes de mergear.

NO HAGAS en esta sesion: no arranques una landing 3D completa estilo United Carriers. Ese frente sigue cerrado por presupuesto de performance y de precio, tal como lo dejo la ficha del 11-ago. Si te tienta, anotalo como pendiente y segui.

LISTO = (a) MOTION_PATTERN_BANK_2026.md contiene las secciones `### P23` y `### P24` con codigo ejecutable y su nota de prefers-reduced-motion; (b) hermes-content/references/ui-patterns/scroll-velocity-readout/ existe y una captura de Playwright en tres posiciones de scroll distintas muestra TRES valores de KM/H distintos, con 00 en la captura sin movimiento, y el cambio de eje visible entre dos de ellas; (c) 2026-08-11-web-3d-scrollytelling-united-carriers.md ya no contiene la cadena "A VERIFICAR" ni la afirmacion "no se nombra herramienta ni framework" sin matizar, y si contiene "BEAMPLUS" y el pendiente explicito de medir el peso del sitio; (d) grep de marcadores de conflicto `<<<<<<<` en los archivos tocados devuelve cero.
```
