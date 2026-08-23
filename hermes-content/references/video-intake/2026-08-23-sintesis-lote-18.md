# Síntesis del lote del 23-ago — 18 posts

**13 videos + 5 carruseles.** Ninguno estaba ya en el corpus (verificado por shortcode contra todo
`video-intake/`). Prompts: **O1–O18**, en
[`PROMPTS_LOTE_2026-08-23.md`](PROMPTS_LOTE_2026-08-23.md).

> **Alcance ampliado por Sergio este día:** *"los reels también son estilos y diseños, agarralos
> como conocimientos, no solo este, todos, agarralos y aprende."* Desde acá cada ficha extrae
> además tipografía, paleta, composición, ritmo, motion y textura, y dice **a qué archivo nuestro
> se porta**. Los patrones de motion, deduplicados, están en
> [`2026-08-23-patrones-de-motion-deduplicados.md`](2026-08-23-patrones-de-motion-deduplicados.md).

---

## Lo que ninguna ficha podía ver sola

### 1 · Ocho de dieciocho convierten igual, y a las ocho les falta **el mismo objeto**

Comentario → DM con palabra clave: `DaVV7JjIY9I`, `Db9jbZtumB7`, `DcYNrdROAyg`, `DcYiAvqsjij`,
`Db1b33RAh_H` ("CLASE"), `DcBWzXQF1_q` ("REPO"), `DcJbUL6CCp3` ("8"), `DcEJDHBTyPY`.

En **todos** el peaje del lado nuestro es idéntico: **el activo prometido no existe** — los
prompts, las plantillas, "la clase 1", "la versión larga", los repos. Cinco fichas lo anotaron por
separado como "decisión de Sergio", como si fueran cinco decisiones.

**Es UNA sola: cuál es el lead magnet de Onia.** Tomada una vez, desbloquea ocho prompts.

> ## ✅ DECIDIDO — Sergio, 2026-08-23: **el lead magnet es agendar una demo**
>
> El DM no manda un PDF ni una plantilla: manda **el link para reservar una demo**. Los ocho
> prompts quedan desbloqueados y todos apuntan al mismo destino.
>
> **La maquinaria ya existe**, no hay que construirla: `cal.onia.com.bo` (Cal.com self-hosted,
> [deploy kit](../../deploy/calcom/README.md)) → webhook n8n `/webhook/calcom-booking` → evento en
> Google Calendar → aviso por Telegram a Sergio → **lead creado en ONIA Center**. Agenda base
> lunes a sábado 14:00–20:00 (La Paz), 15 min de buffer, mínimo 4 h de aviso.
>
> **Por qué encaja mejor que un PDF:** un PDF se descarga y muere; una demo agendada es una
> reunión en el calendario y un lead con seguimiento. Y esquiva el problema §2 de este mismo
> lote — no promete un activo que habría que fabricar, ofrece lo único que Onia sí tiene de
> sobra: el producto funcionando.
>
> ⚠️ **Antes de apuntar ocho publicaciones ahí, alguien tiene que MIRARLO.** Hoy sólo está
> verificado que `cal.onia.com.bo` **responde HTTP 200 en 3,0 s** — y por la regla *"verificar es
> MIRAR, no suponer"*, un 200 no es verificación. Falta abrir la página renderizada, reservar
> una vez de punta a punta y confirmar que el lead llega a ONIA Center. **Eso no es de este
> carril**: va a la sesión de infra/marketing.
>
> ⚠️ **Segundo pendiente conocido:** el webhook `calcom-booking` tiene la **validación HMAC
> apagada** porque falta `CALCOM_WEBHOOK_SECRET` en el contenedor de n8n. Con ocho posts
> mandando tráfico ahí, eso deja de ser un pendiente menor.

### 2 · Los moldes que más convierten se apoyan todos en una prueba de tercero que Onia no tiene

`DZurBtZiT9X` (client testimonial) · `Dax5wGigc30` ("$70 MILLION") · `Daz0cVMBuD8` (featured por
Apple en 40 países) · `Db1b33RAh_H` ("$200 vs $10.000") · `DcBWzXQF1_q` (case study con cifras) ·
`DcWOss3RxMq` (producto de cliente real).

**Seis piezas, seis veces el mismo cuello de botella, y no es técnico.** El carril no está
bloqueado por herramienta: está bloqueado por **no tener un hito verificable declarado por un
tercero**. Con la regla de "no fabricar" vigente, esos seis moldes no se copian tal cual — se
adaptan a material propio, o esperan.

Ese es el hallazgo del lote, y ninguna ficha podía verlo sola.

### 3 · Seis fichas piden el mismo permiso de gasto — y **la mitad ya no lo necesita**

`DcWOss3RxMq`, `DcYNrdROAyg`, `DcJbUL6CCp3`, `Dbyx3bwE6Mp`, `DcWPKNoIEUE` y la variante Lucía de
`Dax5wGigc30` piden créditos de Higgsfield.

> ⚠️ **Corregido contra `origin/main` el mismo 23-ago.** Las fichas se escribieron contra la regla
> vieja (*"generación paga = permiso caso por caso"*, todo en la misma bolsa). `main` la separó en
> dos (commit `f794ac6c`): **video generado** sigue requiriendo permiso explícito caso por caso,
> cotizado con `get_cost:true`; **imagen en lote chico es gasto trivial y ya está validado**
> (`soul_2` a 2k ≈ 0,12 créditos; un lote de 6 fotos cuesta menos de 1 crédito de un pool de
> ~2.100), basta con registrar el lote.

Con la regla vigente, el mapa real queda así:

| Ficha | Qué genera | ¿Sigue bloqueada? |
|---|---|---|
| `DcJbUL6CCp3` | 5 escenas de **foto** para Lucía | **No.** Lote chico de imagen, ya autorizado |
| `DcWPKNoIEUE` | packshots de catálogo (**imagen**) | **No**, mismo caso |
| `DcYNrdROAyg` | nada: la mascota resultó ser **un disfraz filmado** | **No.** El bloqueo era un error de la primera pasada |
| `Dbyx3bwE6Mp` | capturas de nuestro propio panel | **No.** No hay gasto |
| `DcWOss3RxMq` | clips **de video** con `seedance_2_0` | **Sí** — video, permiso caso por caso |
| `Dax5wGigc30` (variante Lucía) | depende de si sale a foto o a video | **Solo si es video** |

**De seis, queda una y media.** Lo que parecía "una decisión que destraba un tercio del lote" era,
en buena parte, una regla desactualizada y un error de lectura.

### 4 · El texto NO se anima — y eso choca con nuestra propia doctrina

Nueve de catorce videos lo descubrieron por separado: el rótulo entra por **corte duro** y no se
mueve. Sin escala, sin rebote, sin easing perceptible.

Nuestra [`motion-doctrine`](../../../.agents/skills/motion-doctrine/SKILL.md) prohíbe exactamente
eso: exige continuidad de vector y prohíbe el corte sin arrastre. **Con 9 de 14 en contra, no es
una excepción al margen.** La lectura honesta es que la doctrina está escrita para *motion
graphics autoral* y se está aplicando a *montaje UGC*, que es otro oficio. **La doctrina tiene que
declarar qué régimen gobierna cuál** — decisión del dueño de esa skill, no de este carril.

### 5 · El ritmo es bimodal: o cero cortes, o corte cada ~1-2 s

Cero cortes: `DZurBtZiT9X` (35,4 s), `Dax5wGigc30` (58,3 s), `DcEJDHBTyPY` (29,4 s),
`DbtH7_nNRF0` (~8 s), `DbvxMwghtkA` (~18 s), `Dbyx3bwE6Mp` (13,5 s ×2, medido).
Metronómico: `Daz0cVMBuD8` (1,02 s de media, medido), `DcYiAvqsjij` (1,5–2,5 s), `DcWOss3RxMq` (~2 s).

**El corte cada 4-8 s — el default de cualquier editor — no aparece en ningún reel que funciona.**
Se elige un extremo o el otro, y la elección es del guion, no del montaje.

### 6 · Un solo acento saturado, y siempre sobre el sujeto o el producto — nunca sobre la interfaz

`DaVV7JjIY9I` (oxblood, única cromía) · `Dax5wGigc30` (el único saturado va en el vestido) ·
`DcYiAvqsjij` (turquesa como ancla) · `DbBUMU2qjfW` (naranja solo dentro de la pantalla del
producto) · `Db9jbZtumB7` (naranja LED) · `DcWPKNoIEUE` (plantilla acromática, el color lo pone el
objeto) · `DcWOss3RxMq` (todo beige, el negro es el contraste) · `DcYNrdROAyg` (el verde de marca
vive SOLO en la marca de agua).

Ocho fichas descubrieron la misma regla. **Es portable a la landing y al producto**, no una
observación por pieza.

### 7 · Dos familias tipográficas cubren el lote entero

"Anton / Druk Condensed" como conjetura en `DcWOss3RxMq`, `Dbyx3bwE6Mp`, `DcJbUL6CCp3`.
"Poppins / Montserrat" en `DZurBtZiT9X`, `Daz0cVMBuD8`, `DcEJDHBTyPY`, `DcYNrdROAyg`, `DcYiAvqsjij`.

En **13 de 18** la familia se declara como "aparenta X, no se dice" — nadie corrió identificación
de fuente. Traducción operativa: **no hace falta un sistema tipográfico por pieza; hacen falta dos
familias y una regla de cuándo va cada una.**

---

## Dato heredado que este lote NO re-verificó

**"El circuito comentario → DM está vivo en producción desde el 18-ago."** Lo afirman en presente
`DaVV7JjIY9I`, `Db9jbZtumB7`, `DbtH7_nNRF0`, `DcYiAvqsjij` y `Db1b33RAh_H`; lo marcan como *no
re-verificado* `DcEJDHBTyPY`, `DcYNrdROAyg` y `DcBWzXQF1_q`. **El mismo lote se contradice sobre el
mismo dato.**

Es un dato de hace 5 días sosteniendo la mecánica de conversión de 8 fichas. Por la regla *"un dato
heredado no se ejecuta sin contarlo de nuevo"*, **se cuenta antes de ejecutar O1–O18 que dependan
de él**. Este carril reparte, no ejecuta: queda anotado, no verificado.

---

## Errores de este lote, y su corrección

Se corrieron **dos pasadas**: 18 fichas, después un crítico de completitud, y después **8 fichas
rehechas**. Lo que la segunda pasada cambió:

| Ficha | Qué estaba mal en la primera versión |
|---|---|
| `DcYNrdROAyg` | **La corrección más cara.** Se asumió que la mascota era generada por IA, y de ahí salía un bloqueo de "permiso de gasto por +40 tomas generadas". Con las 503 palabras de audio y los 82 fotogramas: es **un disfraz físico filmado** en la alfombra roja real. El bloqueo no existía. |
| `Dax5wGigc30` | Se estimó "~40 bloques, uno cada 1,5-2 s" y sobre ese número inventado se montó todo el hallazgo de ritmo. Medido: **46 bloques, mediana 1,30 s** — y la unidad real no es el bloque sino la **palabra**, a 3,41 palabras/s. |
| `DcEJDHBTyPY` | Declaró que no se escuchaba nada. El sujeto **habla los 29,4 s**: 93 palabras. |
| `DZurBtZiT9X` | Dijo que había audio y no lo transcribió. Las 74 palabras son la voz del entrevistado **sonando dentro del preview** — la capa de afuera es muda por diseño, y eso *es* el molde. |
| `DcWOss3RxMq` | Titulaba "MakeUGC es un envoltorio de Seedance 2.0". Es inferencia, no lectura: el selector muestra chevron y convive con biblioteca, carpetas y créditos. Producto, no envoltorio. |
| `DcYiAvqsjij` | Reconstruyó "un guion de 9 movimientos" sin oír nada. Con el verbatim son **6**, y el eje real del reel era una frase que el karaoke parte en palabras sueltas. |
| `Dbyx3bwE6Mp` | Afirmó "jitter fotograma a fotograma" desde **7 de 406 fotogramas (1,7%)**. Con 10 fotogramas consecutivos: los IDs persisten y se desplazan coherentes — **hay tracker con identidad estable**, no jitter. |
| `DcPwVniOEKB` | Ver abajo: acá el que se equivocó fui yo. |

### El error de método que casi entra al banco

Medí los cortes con `ffmpeg -v error -i … -vf "select=gt(scene,X),showinfo"`. **`-v error` silencia
la salida de `showinfo`**, así que *cualquier* video devuelve cero cortes. Le pasé esa cifra a los
agentes rotulada como "ya medida, no la estimes".

El agente de `DcPwVniOEKB` **la re-midió en vez de aceptarla** y encontró el corte en `pts_time`
3,800 s exactos. La ficha vieja tenía razón con su "~3,7 s".

**Las dos reglas que deja:**
1. Para contar cortes va `-hide_banner`, **nunca `-v error`**: mata los filtros que reportan por log.
2. Una cifra "ya medida" que te pasan **sigue siendo un dato heredado**. Se re-mide.

### El hueco que produjo la segunda pasada

Las transcripciones existían y **no se le pasaron a los agentes**: se les dio caption + fotogramas y
nada más. Seis videos tenían voz (503, 234, 199, 93, 74 y 62 palabras) y se analizaron mudos.
**Verificar qué insumos llegan al agente, no solo que existan en disco.**

---

## Cobertura real de este lote

- **Fotogramas:** 24–40 densos por video, muestreados por densidad de texto. En la primera pasada
  el ratio de lectura de `texto_*` no pasó del 58% (media 46%); en la segunda, las 8 rehechas
  leyeron entre 90% y 100%.
- **Audio:** 6 de 14 videos tienen voz. Los otros 8 son música + texto en pantalla — verificado, no
  supuesto (0 segmentos con audio a −17 dB de media).
- **Carruseles:** 38 de 38 láminas leídas, las cinco al 100%.
- **Gemini nativo:** 3 de 15 videos. La cuota gratis se agotó (429) tras 8 intentos; los otros 12
  se analizaron por fotogramas.
