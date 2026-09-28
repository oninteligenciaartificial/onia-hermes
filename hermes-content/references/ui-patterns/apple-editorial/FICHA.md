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
| Objetos | Fluent 3D emoji a color | squircle app-icon con el **logo real** de la marca |
| Sombra | `0 30px 45px rgba(0,0,0,.25)` | `0 24px 48px rgba(0,0,0,.14)` — más suave |
| Formato | imagen única | **carrusel** (hoy 9 láminas) + imagen única |

## Los 5 layouts (leídos de las 8 referencias)

| ID | Layout | Ref | Para qué |
|---|---|---|---|
| **A** | Grid comparativo 3×N, divisor hairline entre filas, objeto + label debajo | 1 | ✅ construido — `--pieza founders-bo`. **Los 6 layouts completos** |
| **B** | Grid 2×2, objeto encajonado en tarjeta blanca + label debajo | 2 | ✅ construido — `--pieza vitamina-c`. Las celdas aceptan logo, foto o tarjeta dibujada |
| **C** | Duelo 2-up con dato de remate, fondo crema, acento serif | 3 | ✅ construido — `--pieza duelo-cuaderno`. Serif **Instrument Serif** vendorizada por `build-inter.py`; objetos de Unsplash |
| **D** | Statement puro: texto centrado, sin objeto | 4 | portada, transición, CTA |
| **E** | Ficha de producto: objeto + nombre gigante + 2-3 líneas gris + **precio gigante** | 5,6,7 | el carrusel-stack, una cosa por lámina |
| **F** | Portada con foto recortada sobre gris claro | 8 | ✅ construido — `--pieza portada-f`. Foto recortada por `recortar-foto.py` (croma local, sin generación ni créditos) |

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
- **Etiqueta de procedencia** (`open source`, `plan gratis`) debajo del precio, en el mismo
  tratamiento que el handle — mono, mayúscula, gris. Lee como dato técnico y no compite con
  el precio. Es opcional: se pone sólo donde es **verificable**.
- **El verde de Onia lo lleva un solo objeto, y sólo si es nuestro.** Se probó vestir de
  verde a Hermes para decir "ésta es mía" y era falso — es código MIT de terceros; vestir
  una herramienta ajena con nuestra marca sugiere autoría. El verde volvió cuando entró
  **Onia Platform**, que sí es de Sergio Urcullo: usa el icono publicado
  `brand/v2/onia-icon-rounded.svg`. Todos los demás objetos usan **su propio** color de
  marca. En los textos, verde de relleno + tinta negra (8,72:1), nunca verde como tinta.

## Tipografía — ✅ INTER, aprobada por Sergio Urcullo (06-sep, mirando el A/B)

SF Pro **no se puede empaquetar** (licencia Apple restringida a desarrollo en sus
plataformas). Se rindió el A/B completo y él eligió A: *"este está perfecto"*.

| | familia | veredicto |
|---|---|---|
| **inter** ✅ | Inter (OFL), vendorizada por `build-inter.py` | **GANA.** ~95% de fidelidad con las refs y llega a `wght` 700 |
| **dmsans** | DM Sans, del trío de `ONIA_BRAND_IDENTITY_2026.md` §2 | pierde, y no por gusto: **el archivo está recortado a `wght` 400–500** por `build-onia-fonts.py`, así que *no puede* dar el peso display que piden las refs — por eso se ve liviana |

Handle y micro-etiquetas: **Spline Sans Mono** del trío de marca, ya vendorizada.
La salida `dmsans` se borró para no dejar dos versiones de la misma pieza conviviendo;
el generador conserva la opción por si hace falta rehacer la comparación.

### 🔴 Tres leyes tipográficas conviviendo (hallazgo del 06-sep, sin resolver)

| Fuente | Qué manda |
|---|---|
| `ONIA_BRAND_IDENTITY_2026.md` §2 + `brand/fonts/README.md` | Bricolage Grotesque · DM Sans · Spline Sans Mono |
| `ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md` §7 | Archivo + Geist Mono, "SIEMPRE" |
| Lo que de verdad se renderizaba | **ninguna de las dos** — ver la trampa #4 |

Lo decide Sergio Urcullo. Este patrón no toca §7 ni el trío: vendoriza su candidata
aparte y deja el A/B mirable.

## Trampas (se van llenando al costo de un render)

0f. 🔴 **Una librería de iconos sirve para la FORMA, nunca para el color — y a veces ni
   para la forma.** Sergio Urcullo marcó dos veces que los logos eran falsos, y las dos
   tenía razón por motivos distintos:
   · **Claude**: simple-icons dibuja el estallido más tosco, y encima yo lo había puesto
     invertido (naranja con estallido blanco; el real es coral sobre crema).
   · **ChatGPT**: el nudo de simple-icons **sí** es la marca real. Lo falso era mi color —
     lo puse verde copiando la referencia #1, que muestra el icono **viejo**. Hoy es negro.
   · **Gemini**: simple-icons lo da **plano**. El real tiene el degradado aurora (azul →
     violeta → rosa) y sin eso no se reconoce.
   **La regla:** para una marca conocida se baja el **asset oficial del propio producto**
   (`claude.ai`, `gemini.google.com`). La librería queda como respaldo, y su color NUNCA se
   da por bueno. Ninguno de estos errores dispara un gate: rinden igual de bien.
0g. **Un objeto de stock se mira antes de aceptarlo, aunque la consulta parezca obvia.**
   Buscando la lata, `red bull can` devolvió en Unsplash un **cartel de neón** —dos veces—
   y en Pexels una foto con luz púrpura que no leía como producto. Hicieron falta cuatro
   intentos y las dos fuentes. Consulta que funcionó: `red bull can white background studio`.

0d. 🔴 **`object-fit` NO aplica a un `<svg>` en línea.** Sólo funciona en elementos
   reemplazados (`<img>`, `<video>`). Un `<svg>` sin `width`/`height` propios se estira al
   100% del contenedor e ignora la altura fija: en el layout A los squircles desbordaban su
   caja, **se comían las etiquetas de su fila** y pisaban la fila de abajo. Se acota el SVG
   con `height:100%;width:auto` sobre el propio elemento, no con `object-fit` en el padre.
   Es un fallo de maquetación que ningún gate atrapa —el texto no desborda a lo ancho— y
   sólo aparece MIRANDO.
0e. **El layout A no entra si no se calibra el bloque entero.** Nueve objetos + tres filas
   de etiquetas + título es lo más denso del patrón. La primera versión desbordó por abajo
   y el título se fue a tres líneas (la receta manda dos). Al achicarlo de más quedó
   cabecero, con el tercio inferior vacío. Los valores de `.lienzo.a` están calibrados para
   cerrar dentro de los 1350px **y** llenarlos: tocar uno obliga a mirar el render otra vez.

0c. 🔴 **El handle se verifica contra Sergio Urcullo, no contra el repo.** El 06-sep había
   **dos** conviviendo: `scripts/carousel_render.js` firmaba `@sergio_urcullo` citando una
   verificación por Graph API de agosto, y los 13 generadores de `scripts/marca-personal/`
   usaban `@sergiourcullo` (75 usos contra 1). Él confirmó el segundo: **renombró la cuenta**
   y el cambio nunca llegó al motor viejo, que quedó firmando con un handle inexistente.
   **Un handle mal puesto no rompe ningún build.** No hay gate que lo atrape: sale publicado
   y listo. Ya había pasado antes — ese mismo campo decía `@sergio`, inventado.
   Corregido en `carousel_render.js`. ⚠️ Sobrevive en **7 documentos**, y ahí hay que separar:
   los que **narran lo que pasó en agosto** (`ONIA_AVISO_AUTOMATIZACION_IG.md`) son historia y
   se dejan; los que describen el **estado de hoy** (`ETAPA2_OPERACION.md` §76,
   `ONIA_CIRCUITO_COMENTARIO_DM.md`, `ONIA_SERGIO_DM_PALABRAS.md`,
   `ONIA_PLAN_DE_CONTENIDO_3_FRENTES.md`, `ONIA_CUENTAS_Y_MODELOS_SEPARACION_20260821.md`)
   están mintiendo y son de otro carril. Pendiente anotado, no ejecutado acá.

0b. **En un duelo, los dos remates se miden con la misma vara.** La primera versión ponía
   "0" de un lado y "todos los días" del otro: cantidad contra frecuencia, y la comparación
   no cierra. Va `0 avisos` contra `1 por día`. La referencia #3 lo hace igual — *310 cal*
   contra *0 cal*, misma unidad — y de ahí sale toda su fuerza.

0. 🔴 **El encuadre de la foto decide qué se puede pedir.** El 06-sep Sergio Urcullo pidió
   "pantalón de lino blanco" y "un Rolex Datejust" sobre su foto. La foto es un **busto
   cortado al pecho**: no hay muñecas ni piernas en cuadro. El reloj no tiene dónde ir, y el
   pantalón no sería un retoque sino **generar el cuerpo entero desde el pecho para abajo** y
   pegarle la cabeza — un cuerpo sintético con su cara, no una foto suya.
   **Antes de aceptar un pedido de retoque, mirar qué hay en el encuadre.** Con una foto de
   cuerpo entero los dos pedidos son un retoque normal; con un busto son otra cosa.

1. **La sombra de `statement-3d-minimal` es demasiado dura acá.** `.25` sobre un squircle
   plano lo despega del fondo y rompe la calma. Va `.14`.
2. **El verde como texto reprueba AA** (2,12:1 sobre fondo claro, medido en §7). En este
   patrón el verde va de **relleno** con tinta negra, igual que allá — sólo que acá aparece
   en dos láminas de nueve, no en todas.
3. **CTA de palabra clave: NO en `@sergiourcullo`.** Esa cuenta tiene `palabras: {}` en el
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
7. 🔴 **Una pieza de "mi stack" no nombra la capa que sostiene lo que vendés.** Sergio
   Urcullo sacó **Chatwoot** de la pieza el 06-sep, y la razón vale para cualquier pieza
   futura: Chatwoot es la infraestructura del chatbot que se vende desde Onia Platform.
   Las otras cinco herramientas no tienen ese problema —nadie compra Claude en vez de
   Onia—, pero Chatwoot con "Bs 0" al lado le enseña al lector el camino para saltearse
   el producto. Era la única lámina que le daba un motivo para **no** comprar.
   **La regla:** en build-in-public se muestra con qué trabajás, no con qué se replica lo
   que cobrás. Al sacar o meter una lámina hay que barrer los conteos: portada, remate del
   cierre y total — o la pieza se contradice sola. Es la misma coherencia número↔objetos que
   exige `statement-3d-minimal`. Ya se barrió dos veces el 06-sep: SEIS→CINCO al sacar
   Chatwoot, y CINCO→SIETE al entrar Notion y Hermes.
8. **La procedencia de una herramienta se verifica antes de escribirla, no después.** En la
   tanda del 06-sep las tres suposiciones fáciles eran falsas o no comprobables:
   **HyperFrames NO es nuestro** (es `heygen-com/hyperframes`, de terceros — por eso su
   lámina no lleva etiqueta de autoría y sólo afirma un uso propio); **Hermes sí es de
   Sergio Urcullo** (`hermes-content/deploy/hermes-agent/SOUL.md`, "el jefe de gabinete de
   Sergio") y él lo declaró **open source**; y el **plan de Notion no está registrado en
   ningún lado del repo** — el "Bs 0" asume plan gratis y sigue pendiente de su confirmación.
   Un precio sin verificar en pieza pública es justo lo que prohíbe la regla de fuente única.
9. 🔴 **Logo dibujado a mano = falsificación.** Los squircles llevaban glifos que yo dibujé
   "parecidos" a cada marca. El de WhatsApp salió directamente mal y lo marcó Sergio Urcullo.
   Las 8 referencias usan el **icono de aplicación real** de cada herramienta, y ahí está la
   mitad de por qué se ven caras. Ahora los logos se vendorizan con `build-logos.py` desde
   **simple-icons** (CC0) sobre el color oficial de cada marca — uso nominativo, igual que
   las refs. Sólo se dibujan los que no tienen logo publicado: la torre del homelab,
   HyperFrames y Hermes.
10. **Un objeto dibujado se juzga en la miniatura, no en el lienzo.** La primera torre del
   homelab era angosta con dos rayas y a tamaño de hoja de contacto leía como un **teléfono**.
   Se vio mirando, no calculando. Va ancha, con bahía de lectora y rejilla de ventilación.
11. **"Homelab" es hardware propio de Sergio Urcullo** — *"es una pc vieja que tengo"*
   (06-sep). ⚠️ **Corregido:** acá decía que era un KVM alquilado y que por eso la bajada no
   podía afirmar que estuviera en su casa. Era una suposición mía: confundí esta lámina con
   el VPS de `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.1. Se cayeron también las specs
   "4 vCPU / 16 GB / 41 contenedores" que le había puesto — **son del VPS, no de esta
   máquina**, y las de la PC no están registradas en ningún lado. Sin dato verificado, no se
   escribe dato.
   ✅ **Resuelto (06-sep):** el VPS de §8.1 sigue vivo, y Sergio Urcullo decidió **no
   ponerlo** en la pieza. El total de $200 refleja esa decisión, no un olvido.
12. 🔴 **Hermes SÍ es open source — pero NO es código de Onia. Casi se publica una falsa
   autoría.** La lámina llegó a decir *"mi jefe de gabinete, y lo escribí yo"*. Es
   `NousResearch/hermes-agent`: **público, MIT, Python, 242k estrellas** (verificado con
   `gh repo view`, no de memoria).
   La trampa fue una **colisión de nombres** que la memoria del proyecto ya tenía marcada:
   `hermes-content/deploy/hermes-agent/SOUL.md` dice *"Hermes — el jefe de gabinete de
   Sergio"* y se lee como si el agente fuera nuestro. **Lo nuestro es el SOUL.md, la memoria
   y la config**; el agente es de terceros. Eso es lo que dice la lámina ahora: *"un agente
   open source que vive en mi servidor; yo le escribí el alma"*.
   **La regla:** antes de escribir "lo hice yo" sobre cualquier pieza del stack, se corre
   `gh repo view` sobre el upstream. Reclamar autoría de un proyecto ajeno en pieza pública
   es el peor error que esta pieza podía cometer, y estuvo a un render de salir.
13. **Un logo que es ilustración no se redibuja: se busca el original.** El de Hermes es
   line art (`nous-girl.jpg` del repo de NousResearch). Se bajó del upstream en vez de
   aproximarlo — redibujarlo sería repetir la trampa #9. `_imagen()` lo toma de
   `logos/hermes.*` y cae al glifo de nodos si falta, así el generador nunca se rompe por un
   asset ausente: sólo entrega menos.
14. ⚖️ **"Próximamente" — EXCEPCIÓN RATIFICADA por Sergio Urcullo. No revertir.**
   `CLAUDE.md` § *La venta nunca exhibe obra* prohíbe exactamente esa palabra en toda
   superficie que ve un cliente, y la regla **nació de él** el 2026-08-20: *"hace escapar a
   los clientes porque hacen creer que el sistema no funciona"*.
   El 06-sep la pidió para la lámina de Onia Platform. Se le planteó el choque **con la regla
   citada** y se ofreció **"Te cuento pronto"** como alternativa — misma intriga, pero
   hablando de la **historia** en vez del **estado del producto**. Él respondió:
   *"ponela literal, próximamente"*.
   **Queda así.** Es su marca y su decisión, tomada con la regla delante. Dos cosas para la
   sesión que lea esto:
   - **No lo "corrijas" al leer la regla.** Está registrado acá y en el comentario del
     generador justamente para que nadie lo revierta creyendo que fue un descuido.
   - **La excepción vale SOLO para esta lámina.** La regla sigue vigente en todo lo demás:
     nada de "muy pronto", "beta" ni "en construcción" en ninguna otra superficie.
15. **Una herramienta que no se usa vuelve mentira toda la pieza.** Notion salió: *"gratis,
   aunque ni lo uso"* (06-sep). El valor entero de «Mi stack» es que las siete cosas son
   reales; una de adorno se lleva puestas a las otras seis. Su `.path` queda vendorizado por
   si vuelve en otra pieza. Al salir se barrieron los conteos otra vez: `seis`→`cinco cuestan $0`.
16. **El slot de precio acepta una frase, pero no al mismo cuerpo.** A 92px "Te cuento
   pronto" competía con el nombre; `.precio.texto` lo baja a 60px y sigue siendo el segundo
   foco. Se aplica solo cuando el valor no empieza con `$`.

17. 🔴 **`--check` mide ANCHO, no recorte ni colisión — y con el gate verde salieron dos
   láminas rotas.** Encontradas el 10-sep MIRANDO los PNG de «Las seis respuestas», que
   llevaban cuatro días rendidas y "verificadas":
   - **Lám. 01: «RESPUESTAS» cortada en los dos bordes del lienzo.** A 196px
     (`.remate.gancho`) la palabra no entra en 888px útiles y el navegador la desborda
     hacia afuera. La sonda usa `Range.getClientRects()` sobre el elemento — mide el
     ancho del BLOQUE, que sigue siendo 888, no el de la caja de texto que se sale. Un
     remate de una sola palabra larga no va con `gancho`.
   - **Lám. 06: la tilde de «¿CUÁL» pisando la E de «REPETÍS».** `.display` corre con
     `line-height:.98`, o sea menos de una em: dos líneas con mayúscula acentuada abajo y
     descendente arriba se tocan. Un remate de dos líneas con tilde en la segunda va con
     `"largo": True` (104px, una línea) o se reescribe.

   **La regla:** el gate descarta desborde de bloque; **no confirma que la lámina se vea
   bien**. Toda pieza se MIRA lámina por lámina antes de darla por lista — es la regla de
   la casa (`CLAUDE.md` §*Verificar es MIRAR*) aplicada acá, y estas dos son la prueba de
   lo que cuesta saltearla.

18. 🔴 **Barras de altura porcentual dentro de un flex = gráfico mentiroso.** En el layout
   G la cana iba con `height:<v/max*100>%`, porcentaje **de la columna entera** (valor +
   cana + rótulo). Dos consecuencias, las dos visibles en la lámina 06 de Fable del 10-sep
   y ninguna medida por ningún gate:
   - un rótulo de DOS líneas (`GPT-5.6\nSOL`) empujaba su cana hacia arriba: la barra de
     **22,4% rendía MÁS ALTA que la de 24,7%**;
   - en la columna ganadora la suma pasaba los 560px del contenedor y el flex **encogía**
     la cana, achicando justo la barra que tiene que dominar.

   Ahora la altura se calcula en **px desde Python** (`v/tope*390`), la cana lleva
   `flex:0 0 auto` y el rótulo `min-height:58px` para que todas apoyen en la misma base.
   El comentario de arriba del layout ya advertía "no recortar la base para que se note
   más la diferencia" — y el bug hacía algo peor sin que nadie lo pidiera. **En una pieza
   que presume de datos verificados, el gráfico es la afirmación más fácil de desmentir:
   se compara con una regla en la pantalla.**

19. 🔴 **El `<pre>` de la terminal envuelve y deja la palabra huérfana pegada al margen
   izquierdo — y NINGÚN gate lo ve.** El gate `--check` mide el ancho del BLOQUE contra el
   ancho útil; una línea que envuelve **no desborda nada**, así que reporta verde. Pero el
   renglón partido rompe la ilusión de terminal: la segunda mitad cae sin sangría, contra
   el borde de la caja. Salió en 20 líneas de las 5 piezas del 21-sep, en su primer render.

   **Las dos medidas son distintas, y ésa es la trampa dentro de la trampa:**

   | Dónde | Caja | Fuente | Caracteres por línea |
   |---|---|---|---|
   | `term` del layout **R** | ~840px | 38px | **31** |
   | `obj_term` del layout **P** (portada) | **560px** | 34px | **22** |

   Un bloque que entra perfecto en una lámina R se parte en la portada. El rótulo de la
   barra (`term_titulo` / `obj_term_titulo`) aguanta **~24** en P.

   **Se mide antes de rendir**, con las cadenas ya sin etiquetas HTML (`&gt;` cuenta 1, no
   4). No hace falta un gate nuevo: un conteo de caracteres sobre el dict de la pieza
   alcanza, y es instantáneo.

20. 🔴 **Los `\n` del `sub` y de `linea` son sugerencias, no cortes.** Si la línea que vos
   escribiste pasa el ancho del bloque, **igual se envuelve**, y el resultado es peor que
   no haber puesto el salto: queda un pedazo suelto centrado debajo (`«Dales la / misma»`
   en la lámina 5 de mismo-precio). Medidas útiles: `.sub` (38px) **47** caracteres,
   `.linea-r` y `.contexto` (33px) **52**. Mismo método que la #19 — se cuenta, no se
   estima a ojo.

21. ⚠️ **El handle del layout P arrancaba en `x=0`: la arroba tocaba el borde del lienzo.**
   `.handle` trae `left:0;right:0` y se centra por herencia del flex; el lienzo `.p` alinea
   a la izquierda, así que la firma quedaba flush contra el canto. Ya salía así en
   `noticia-whatsapp` y nadie lo había visto porque **el gate no mide márgenes**. Corregido
   con `left:96px;text-align:left` — el mismo canal que la píldora de arriba, así la firma
   se alinea con ella.

22. 🔴 **El gate reporta «la sonda no devolvió medidas» en toda lámina de layout P.** No es
   un defecto de la pieza: la sonda busca clases (`.remate`, `.nombre`, `.sub`…) que el
   layout P no usa — sus clases son `.tit-p`, `.pill-p`, `.swipe-p`. Igual que el layout H.
   **Un rojo del gate en la lámina 01 de una pieza con portada P no significa rota**; esa
   lámina se verifica MIRÁNDOLA. Control para comprobarlo: `--pieza noticia-whatsapp
   --check` falla idéntico y esa pieza está aprobada.

23. 🔴 **El titular ES el hallazgo, no su anuncio.** Sergio Urcullo rechazó la portada
   «Conté mis errores. Los anoté todos» el 21-sep: *«no estás diciendo nada, hacelos
   enseñando cosas de verdad»*. Un titular que teasea obliga a deslizar para averiguar si
   vale la pena, y **el que desliza ya decidió que no**.

   **Prueba rápida, de un segundo: si el titular se puede poner en una pieza de OTRO
   tema, está mal escrito.** «Un dato viejo no es un dato» pasa esa prueba y por eso está
   mal; «Decía 4. Fui a contarlo: eran 40» no pasa, y por eso enseña desde la portada.

   | Aforismo (no dice nada) | Hallazgo (enseña) |
   |---|---|
   | «Conté mis errores. Los anoté todos» | «18 errores. Los 18 los anotó él» |
   | «Un dato viejo no es un dato» | «Decía 4. Fui a contarlo: eran 40» |
   | «Si da verde con la cosa rota…» | «Dos verdes. Y la pantalla estaba rota» |
   | «El precio ya no decide» | «Fable 5.1 y GPT-6 Astra cuestan igual» |
   | «Lo van a contar mal» | «Sólo si NO tenés CLAUDE.md» |

   Aplica a **los titulares de adentro también** (`titular` del layout R, `remate` del D),
   no sólo a la portada. Un remate como «Medí la cosa, no su sombra» suena bien y no dice
   qué hacer; «Abrila y mirala» sí.

   Es la hermana de la regla del 10-sep («si el carrusel no tiene UNA cosa que el lector
   no sabía, no se hace»): aquélla pide que la PIEZA enseñe, ésta pide que el TITULAR lo
   haga. Una pieza con buen dato y titular de aforismo se pierde en el scroll igual.
