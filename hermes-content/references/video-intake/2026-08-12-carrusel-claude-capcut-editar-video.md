# Carrusel "Claude + CapCut" — editar video sin editor humano (@nicofastt)

- **Fuente:** https://www.instagram.com/p/Db6VGA4lcpS/ · carrusel de 6 láminas · sin voz
- **Visto:** 2026-08-12 — carrusel, láminas leídas con visión propia (sin Gemini)
- **Archivo:** `car2/Db6VGA4lcpS/` (s01–s06.jpg + caption.txt, no versionado)
- **Cobertura real:** caption íntegro (1 línea) + **6 de 6 láminas**. Esta ficha es la
  lectura completa; no hay transcripción aparte porque no hay audio.

## Qué dice realmente

Caption entero: *"YA NO NECESITAS A UN EDITOR"*. Todo el contenido vive en las láminas.

- **s01 (portada)** — logos de Claude + CapCut. Titular: *"No tengo editor. Tengo estas
  dos."* Bajada: Claude ahora edita tus videos directo con CapCut. Cierra con "Desliza →".
- **s02 (02/06 — LA CONEXIÓN)** — *"Se conecta con tu computadora."* Bajada: sin plugins
  raros, sin pagar de más, *"Solo Claude, Git y Remotion"*. Diagrama de tres iconos
  (Claude → Git → Remotion) con los pasos Instalar / Configurar / Listo.
- **s03 (03/06 — EL PEDIDO)** — mockup de chat con el prompt de ejemplo: pide cortar los
  silencios largos "dejándolo con ritmo natural y fluido" y aplicar el *"loot"* (LUT, mal
  escrito) que está en la misma carpeta. Respuesta: cortó los silencios, aplicó el LUT y
  dejó el video editado en la carpeta.
- **s04 (04/06 — LO QUE HACE SOLO)** — grilla de 6 capacidades: corta silencios · aplica
  look cinematográfico · escribe textos en pantalla · crea animaciones · agrega efectos de
  sonido · usa tu identidad de marca.
- **s05 (05/06 — EL RESULTADO)** — *"Un video editado en minutos. Sin tocar un programa de
  edición. Sin contratar a nadie."* Debajo, una **ilustración dibujada** de una UI tipo
  CapCut (antes/después, timeline, barra Cut/Text/Filters/Audio/Convert/Videos/Animation).
  No es una captura de pantalla real ni una demo: es un dibujo.
- **s06 (CTA)** — *"¿Quieres el paso a paso?"* → comentar "CAPCUT" y recibir la guía por DM.

**Contradicción dentro del propio carrusel:** la portada y el CTA venden **CapCut**, pero
la lámina del stack dice **"Claude, Git y Remotion"**. Son dos caminos distintos: Remotion
es un framework React para renderizar video por código, no un conector de CapCut; y Git no
interviene en editar un clip. La lámina del "stack" es decoración, no una receta.

## Veredicto: HUMO

Duplica algo que ONIA ya tiene construido, encendido y probado, y lo vende como novedad
con la receta mal armada.

Las 6 capacidades de s04 son, una por una, lo que ya hace la skill `editor-videos`
(`.claude/skills/editor-videos/scripts/`, verificado en el repo): `cut-plan.mjs` (silencios
y muletillas) · `illustration-style.mjs` / `zoom-punch.mjs` / `transitions.mjs` (look y
animación) · `karaoke-captions.mjs` (textos en pantalla) · `overlay-visuals.mjs` (overlays
de marca) · `sfx.mjs` (efectos de sonido). Y tiene además lo que al carrusel le falta:
`preview.mjs` + `publish-cut-review.mjs`, la regla de oro de mostrar tabla de cortes y
preview 360p **antes** de aplicar el corte. El carrusel corta a ciegas.

Ninguna afirmación técnica queda probada: s05 es un dibujo, no una captura; no hay
comando, ni repo, ni un solo frame del video resultante. **La integración "Claude edita
directo con CapCut" queda como A VERIFICAR** — no está en nuestro stack, no la vimos
funcionando, y el propio carrusel se desmiente en la lámina siguiente. No repetirla como
dato cierto ni frente a un cliente.

No aplica la excepción de REFERENCIA de interfaz: lo que muestra s05 no es una UI real bien
hecha para reconstruir, es una ilustración estilizada de la UI de un producto ajeno.

Lo único rescatable es el **envase**, y no salió de su contenido: es un carrusel de 6
láminas bien maquetado (fondo crema, serif editorial + sans, chip numerado "0X / 06 —
ETIQUETA" en cada lámina, portada y CTA sin chip, firma @cuenta abajo a la izquierda y
lema abajo a la derecha). Ese esqueleto es directamente comparable con nuestros packs de
carrusel y sirve como referencia de maquetación.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| editor de videos | Nada que adoptar. Confirma que `editor-videos` ya cubre las 6 capacidades y encima tiene el gate de preview que el carrusel no menciona |
| marketing con IA (carruseles ONIA) | Robar solo la estructura de 6 láminas con chip numerado "0X/06 — ETIQUETA": da progreso visible y obliga a una idea por lámina. Compararla con nuestros packs antes de tocar nada |
| Contenido | El prompt de s03 (pedir corte de silencios + aplicar LUT "en la misma carpeta") es una buena plantilla de cómo se le pide a un agente editor. Es lenguaje, no capacidad nueva |
| Ventas | El gancho comentario→DM vuelve a aparecer; ya está catalogado como patrón transversal, no anotarlo otra vez como hallazgo |

## Riesgo

Repetir "Claude edita tus videos directo con CapCut" sin verificarlo es prometer una
capacidad que no tenemos instalada — y la fuente se contradice sola dos láminas después.
Verificar antes de mencionarlo a un cliente o en contenido propio. Tampoco copiar el
método: editar sin mostrar la tabla de cortes ni el preview rompe la regla de oro del
carril de video y termina en material entregado a ciegas.
