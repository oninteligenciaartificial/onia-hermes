# Handoff — carril `marca-personal-carruseles`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-10**, sesión de reparto, rama
> `claude/marca-personal-carruseles-dist-deadab`, worktree
> `.claude/worktrees/laughing-hermann-30e79f`.
> La sesión anterior (06-sep → 10-sep, rama `claude/instagram-carousel-design-8b56e0`)
> dejó las 8 piezas rendidas; ésta decidió **qué se publica, dónde y por qué**.

---

## 0 · 🔵 LO ÚLTIMO — el reparto quedó cerrado (10-sep)

**Objetivo de esta sesión:** ordenar qué pieza va a qué lugar y por qué, y dejar publicable
sólo lo que vale. **Cumplido.** Las ocho se miraron una por una (8 lectores independientes
leyendo los PNG, no los docs) y cada una tiene su lugar justificado.

| Pieza | Lugar | Estado |
|---|---|---|
| **Fable 5.1** | `@sergiourcullo` | ✅ lista · **1ª de la cola, sale hasta el dom 14 o se tira** |
| **Mi stack** | 🔒 **comunidad** (Announcements) | ✅ **recortada 11→5**, para el **lun 14** |
| **Founders bolivianos** | `@sergiourcullo` | ✅ lista |
| **Tu cuaderno no miente** | `@sergiourcullo` | ✅ lista |
| **Las seis respuestas** | `@sergiourcullo` | ✅ **recortada 6→4** |
| **Seis archivos esta semana** | `@sergiourcullo` | ⏸️ rehacer en 3 láminas, entregando un archivo |
| **Cuatro cosas a mano** | `@oniahq` | ⏸️ rehacer con el ángulo del tiempo |
| **Necesito vitamina C** | — | ⛔ no se publica |

**El cambio que ordenó todo:** «Mi stack» pasó del perfil público a la comunidad. La
semana 1 del motor (14–19 sep) ES ese tema con seis videos en Instagram: el carrusel en el
perfil la spoilea antes o la resume después. Adentro, en cambio, **abre la semana con el
mapa entero**. Eso se volvió regla en `ONIA_DONDE_VA_CADA_COSA.md`, que además **no listaba
`@oniahq`** — el doc que manda sobre lugares no tenía el lugar de la pieza de producto.

**Cinco paquetes listos, uno por pieza que sale**, numerados por orden y con el destino en
el nombre: `carousels/out/1-IG-FABLE-para-publicar.zip` …
`2-COMUNIDAD-MI-STACK-para-mandar.zip` … con su `HOJA-*.png` para mirar antes de subir.
Los ZIP viejos se borraron: el de «Mi stack» tenía adentro las 11 láminas que ya no van, y
el de Vitamina C decía «para-publicar» de algo que no se publica.

🔴 **Tres defectos que el gate `--check` nunca iba a atrapar, encontrados MIRANDO** (y ya
arreglados y re-rendidos):
1. **El gráfico de Fable mentía**: la barra de 22,4% rendía más alta que la de 24,7%.
2. **«RESPUESTAS» salía cortada** en los dos bordes del lienzo.
3. **La tilde de «¿CUÁL» pisaba la E de «REPETÍS»**.

Las tres llevaban cuatro días dadas por listas. Trampas **#17 y #18** de la FICHA.

🔴 **Y un hallazgo que cambia cómo se publican dos piezas:** «Founders» y «Cuaderno»
llevan su dato **en el caption, no en la lámina** — en la imagen no aparece que Stripe no
acepte Bolivia, ni las tres preguntas del cuaderno. **Publicarlas sin caption las deja en
meme.** Anotado en rojo en sus dos docs.

---

## 1 · Objetivo de la sesión anterior

Diseñar carruseles de Instagram para la marca personal de Sergio Urcullo con un patrón
Apple-editorial, **puro código y diseño, sin Higgsfield**. Se cumplió y se desbordó: terminó
incluyendo la web pública, el sistema de contenido entero y la semana 1 de la comunidad.

**Definición de hecho, contra lo que se cumplió:** 8 piezas rendidas con gate verde y doc de
publicación · ✅. Web en el aire con dos guías y sus archivos · ✅. Sistema documentado · ✅.
**Publicado en Instagram: NADA.** Ver §7.

---

## 2 · Qué quedó EN PRODUCCIÓN

### La web — 🟢 viva

**<https://sergiourcullo.vercel.app>** · Vercel plan hobby, proyecto `sergiourcullo`.

| Ruta | Qué es |
|---|---|
| `/` | índice con foto, cifras y las guías |
| `/stack` | guía de las 6 herramientas |
| `/stack/archivos` | **5 archivos · sólo comunidad** (noindex verificado en la respuesta HTTP) |
| `/homelab` | guía del servidor en casa |
| `/homelab/archivos` | **3 archivos · sólo comunidad** |
| `/og.png`, `/stack/og.png`, `/homelab/og.png` | imágenes de compartir |

🔴 **CÓMO SE DESPLIEGA, y es lo que más se puede malentender:** el proyecto de Vercel está
linkeado al repo GitHub `oninteligenciaartificial/sergiourcullo`, que **NO es este repo**. Un
push acá no publica nada. Se despliega con:

```bash
python scripts/publicar-sitio.py -m "qué cambió"
```

Ese script clona el buzón en `C:/dev/proyectos/sergiourcullo-deploy`, borra todo y recopia
(así una página borrada también desaparece de la web), commitea y pushea. Vercel deploya solo
en ~1 min.

⚠️ **El alias largo de Vercel está detrás del SSO y devuelve 302 a un login.** El que se
reparte es el corto.

### El generador de carruseles

`scripts/marca-personal/generar-apple-editorial.py` — **7 layouts** (A grilla 3×N, B grilla
2×2, C duelo, D statement, E ficha, F foto a sangre, G barras) y **9 piezas** rendidas.
Gate `--check` que mide desborde real con `Range.getClientRects()` y verifica
`document.fonts.check` antes de capturar.

⚠️ **Lo que el gate NO mide, y costó tres defectos publicables:** recorte del lienzo (mide
el bloque, no la caja de texto que se sale), colisión entre líneas, y proporción de un
gráfico. **`--check` verde no es «la pieza se ve bien»: eso se MIRA.**

`scripts/marca-personal/empaquetar-carrusel.py` — **nuevo el 10-sep**: arma el ZIP y la
hoja de contacto de una pieza ya rendida, desde sus PNG. Existe porque el ZIP es lo que
Sergio Urcullo realmente abre para publicar y se armaba a mano: al recortar «Mi stack» de
11 a 5, el ZIP seguía teniendo las 11 adentro. Rehace el paquete entero cada vez, así una
lámina borrada también desaparece. `--todas` lista qué hay rendido y con cuántas láminas.

`scripts/marca-personal/generar-og.py` — imágenes 1200×630 de la web.

### Las piezas y sus paquetes

Todas en `hermes-content/carousels/out/apple-*-inter/`. **Sólo las cinco que salen tienen
paquete**, numerado por orden de publicación y con el destino en el nombre:

| # | Paquete | Láminas | Destino |
|---|---|---|---|
| 1 | `1-IG-FABLE-para-publicar.zip` | 8 | `@sergiourcullo` |
| 2 | `2-COMUNIDAD-MI-STACK-para-mandar.zip` | **5** | 🔒 Announcements |
| 3 | `3-IG-FOUNDERS-BO-para-publicar.zip` | 1 | `@sergiourcullo` |
| 4 | `4-IG-DUELO-CUADERNO-para-publicar.zip` | 1 | `@sergiourcullo` |
| 5 | `5-IG-RESPUESTAS-para-publicar.zip` | **4** | `@sergiourcullo` |

Las otras tres (comunidad-semana, onia-cuatro, vitamina-c) siguen rendidas en su carpeta
pero **sin paquete a propósito**: dos hay que rehacerlas y una no se publica.

### La comunidad

**9 drops escritos** en `hermes-content/docs/cola/drops/`: D4, D5 y D6 de la serie vieja
(06, 07, 08-sep) y los **6 de la semana 1 del motor** (14 al 19-sep, tema Mi stack, uno por
herramienta, cada uno entregando su archivo).

### Los documentos del sistema

Siete, con índice adelante:

- `ONIA_CIRCUITO_DE_CONTENIDO.md` — **la puerta**: qué doc manda sobre qué
- `ONIA_DONDE_VA_CADA_COSA.md` — manda en lugar y exclusividad
- `ONIA_MOTOR_SEMANAL_CONTENIDO.md` — el ritmo
- `ONIA_MAPA_DE_TEMAS.md` — el backlog, ~30 temas marcados `S`/`P`
- `ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md` — catálogo y estados
- `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md` — por qué vale + registro de videos
- `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` — el reparto

Y en `cola/`: `ARRANQUE-MOTOR-SEMANAL.md` (vence el 21-sep),
`GUIONES-SEMANA-1-MI-STACK.md`, `PARA-PUBLICAR-APPLE-*` (7 docs).

📄 El sistema entero, consultable en una página:
<https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

---

## 3 · Qué quedó a medias, y dónde

| Qué | Dónde | Estado |
|---|---|---|
| **Nada sin commitear** | — | Árbol limpio; la rama del 06→10-sep ya está en `main` |
| **«Seis archivos esta semana»** | `apple-comunidad-semana-inter/` | rendida en 8 láminas · **rehacer en 3, entregando un archivo**; caduca el 14-sep |
| **«Cuatro cosas a mano»** (`@oniahq`) | `apple-onia-cuatro-inter/` | rendida en 7 · **rehacer con el ángulo del tiempo**; verificar antes la alerta de stock bajo en producción |
| Video de YouTube «qué es Claude Code» | — | Grabado por él, sin publicar. Falta el link para embeber en `/stack` paso 04 |
| Página `/claude-code` | no existe | Se escribe cuando el video salga |
| `[TU EJEMPLO]` del drop D5 | `cola/drops/2026-09-07.md` | Hueco marcado: falta una imagen real hecha con Higgsfield |
| Placas de comandos para los videos | no existe | Ofrecidas, no pedidas |
| Miniatura de YouTube | no existe | Ofrecida, no pedida |

---

## 4 · Archivos que toca este carril

```
scripts/marca-personal/generar-apple-editorial.py    generador de carruseles (7 layouts)
scripts/marca-personal/generar-og.py                 imágenes de compartir
scripts/publicar-sitio.py                            deploy de la web
hermes-content/sitio-sergiourcullo/**                el sitio (7 archivos + sergio.png)
hermes-content/carousels/out/apple-*-inter/**        las 8 piezas rendidas
hermes-content/references/ui-patterns/apple-editorial/**   FICHA, tokens, fuentes, logos, objetos
hermes-content/docs/ONIA_CIRCUITO_DE_CONTENIDO.md    + los 6 docs del sistema
hermes-content/docs/cola/drops/2026-09-0[6-8].md     D4, D5, D6
hermes-content/docs/cola/drops/2026-09-1[4-9].md     la semana 1 del motor
hermes-content/docs/cola/PARA-PUBLICAR-APPLE-*.md    7 docs de publicación
hermes-content/docs/cola/GUIONES-SEMANA-1-MI-STACK.md
```

⚠️ **No toca `web-factory/` ni `onia-platform/`.** Cero choque con otros carriles.

---

## 5 · Intentos fallidos y errores — lo que no hay que repetir

### 🔴 El que cierra la sesión: los carruseles no enseñaban nada nuevo

Sergio Urcullo, 10-sep, sobre las tres últimas piezas. **Tiene razón y el diagnóstico es
claro: las armé como RESUMEN de los drops y de las guías**, no con un descubrimiento propio.
Un carrusel que repite lo que ya está en la guía no tiene por qué existir — el lector no se
lleva nada que no tuviera.

**Lo que sí funcionó, y es el patrón a copiar:** las piezas buenas tenían **un dato que el
lector no sabía**. La sexta respuesta de WhatsApp (la que pide la decisión), el «Stripe no
acepta Bolivia», el «31,4% es 1 de cada 3, no una nota baja». Las que fallaron sólo
ordenaban información ya dada.

**Regla para la sesión que sigue: si el carrusel no tiene UNA cosa que el lector no sabía, no
se hace.** Un resumen no es una pieza.

### Errores propios corregidos en el camino

| Qué pasó | Cómo se detectó |
|---|---|
| **Atribuí a Fable logros de Mythos 5.1** (proteínas 10×, kernels GPU 2,5×) | Releyendo la página oficial. Estuvo **a un render de publicarse** |
| **La guía `/stack` decía que el plan gratis de Claude alcanzaba** | Leyendo la doc oficial. Es falso: no incluye Claude Code. Estuvo **publicado 2 días** |
| **Escribí que la comunidad no existía** | Él me mandó a leer el repo. Existía desde el 02-sep con 5 días de funcionamiento |
| **El handle estaba fijo global** | Al rendir la pieza de Onia salió firmada `@sergiourcullo`. **Ningún gate lo atrapa** |
| Claude/ChatGPT/Gemini con logos falsos | Él lo marcó dos veces |
| El A/B tipográfico "mostró diferencia" y los PNG eran idénticos | md5. Causa: Google Fonts corría carrera con la captura |

### Trampas técnicas, ya documentadas en la FICHA

- **`object-fit` no aplica a un `<svg>` en línea.** Los squircles desbordaban su caja.
- **Chrome `--screenshot` exige ruta absoluta**; con relativa falla en silencio y sale 0.
- **Fuentes por `@import` de Google**: la captura sale antes que la webfont. Todo vendorizado.
- **Heredoc de bash convierte `\n` en salto real** → SyntaxError en Python. Pasó 5+ veces.
  **Solución: escribir el patch con la herramienta Write y ejecutarlo**, nunca heredoc con
  escapes.
- **Openverse rechazado con evidencia** (`RECHAZO-openverse.jpg`). Unsplash y Pexels sí.
- **El mate costó 5 búsquedas**: sólo se reconoce **de perfil y con bombilla**.

---

## 6 · Qué depende de Sergio Urcullo

| | Bloquea |
|---|---|
| 🔴 **Publicar.** 5 paquetes listos con su caption, **0 publicados** | todo el carril |
| 🔴 **Mirar las 5 láminas de «Mi stack»** antes de mandarla a Announcements | ese envío |
| ✅ ~~Mandar el link de `/homelab` a los 3 que comentaron el reel del 07-sep~~ **enviado el 10-sep** | resuelto |
| 🔴 Elegir el tema de la semana y **grabar los 6 videos** | la semana del 14 |
| 🔴 El link del video de YouTube | `/claude-code` y el paso 04 de `/stack` |
| 🔴 Cablear `palabras` en el workflow n8n de private-reply | toda palabra clave automática |
| 🟡 Decidir si los reels se embeben o se re-suben a la web | que los videos no se pierdan |
| 🟡 El `[TU EJEMPLO]` del D5 | ese drop |
| 🟡 Comprar `sergiourcullo.com` (~$12/año, verificado libre) | nada — el `.vercel.app` funciona |

---

## 7 · Próximos pasos

> 🔴 **Dos correcciones de enfoque, en orden, y las dos vinieron de él.** Primero decía
> *"publicar las 8 piezas"*, y Sergio Urcullo lo marcó: *"está mal tu enfoque; si tenés
> carruseles que están horribles, primero perfeccionar"* — asumía que las 8 estaban bien.
> Después la auditoría asignó lugares heredados, y lo marcó otra vez: *«"Mi stack" NO va
> al perfil público — va a la comunidad»*. **La lección que queda: un lugar heredado se
> justifica o se cambia; nunca se arrastra.** El reparto cerrado está en §0 y el detalle
> en [`cola/AUDITORIA-8-CARRUSELES.md`](../cola/AUDITORIA-8-CARRUSELES.md).

**Lo único que falta es publicar, y no depende de un agente.** El material está: 5
paquetes armados, sus captions escritos, los 6 drops de la semana listos.

1. 🔴 **PUBLICAR.** El orden y el cuándo, en
   [`cola/PARA-PUBLICAR-APPLE-ORDEN.md`](../cola/PARA-PUBLICAR-APPLE-ORDEN.md). Fable es
   lo primero **y vence el domingo 14**.
2. 🔴 **Mandar el link de `/homelab`** a los 3 que comentaron el reel del 07-sep. Esperan
   desde hace tres días y es un mensaje.
3. **Las dos a rehacer no se tocan hasta tener su dato escrito en una línea.** Ésa es la
   regla que salió de la auditoría, y es la que evita repetir el problema entero.
4. **Antes de escribir un carrusel nuevo**, leer §5: la regla del dato que el lector no
   sabía, y las trampas #17/#18 de la FICHA (el gate verde no alcanza: se mira).
5. Los temas del backlog marcados `S` en `ONIA_MAPA_DE_TEMAS.md` son la fuente; los que
   salen de drops que ya funcionaron (`/prompts` del D2, `/que-automatizar` del D3,
   `/habilidades` del D4) son los más baratos porque el contenido ya está probado.
6. **No abrir frentes nuevos.** Sigue habiendo más hecho que salido.

⚠️ **El patrón está en `references/ui-patterns/apple-editorial/FICHA.md`** con ~20 trampas
numeradas, cada una con la historia que la originó. Leerlo antes de tocar el generador: una
regla sin su historia se desobedece.
