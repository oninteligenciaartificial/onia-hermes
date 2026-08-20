# Método de análisis — dos carriles y dos filtros

Cómo se analiza un video en este carril. Nace de ~70 videos procesados y de los errores
cometidos en el camino, que están nombrados abajo con su corrección.

> **Antes de analizar: cargar la skill del tema.** Hay 196 skills globales instaladas + 33 del
> repo. En ~70 videos se usaron dos. El ruteo — que skill para que tema — esta en
> [SKILLS_DEL_CARRIL.md](SKILLS_DEL_CARRIL.md). No opinar sobre UI sin `ui-ux-pro-max`, ni sobre
> seguridad sin `security-review`, ni sobre pauta sin `ads`.

> ## Corrección de fondo — 2026-08-19 (Sergio)
>
> *"Tenés que tener el criterio y saber y aprender cómo realmente lo hacen... y cómo puedes
> replicarlo con nosotros. Y eso no se aplica solo a los videos de IA: también a los de páginas
> web, a los de marketing, a los de los SaaS. Ver qué frentes toca realmente, qué se usa y cómo
> lo podemos replicar."*
>
> **El método tenía un hueco:** solo exigía reconstruir el "cómo se hizo" cuando el video estaba
> hecho con IA. Para todo lo demás me conformaba con extraer la idea. Eso está mal. **Todo video
> tiene un cómo.** Lo que cambia es *dónde vive ese cómo*, y con qué herramienta nuestra se
> reproduce. Ver [Las cuatro reconstrucciones](#las-cuatro-reconstrucciones) más abajo, que ahora
> es la parte principal de este documento.

**La primera pregunta, siempre:** ¿este video **muestra algo hecho con IA**, o **cuenta una
idea**? De eso depende todo lo demás, porque son dos trabajos distintos.

**Y la segunda, que antes no estaba:** ¿de qué **tipo** es lo que muestra — IA, interfaz web,
producto/SaaS, o marketing? Porque de eso depende **qué se reconstruye y con qué lo repetimos**.

---

# Carril A — video HECHO con IA

El objetivo no es entender de qué habla. Es **reconstruir cómo se hizo**, al punto de poder
repetirlo con nuestra cuenta.

## Las siete preguntas, en orden

| # | Pregunta | Cómo se contesta |
|---|---|---|
| 1 | **¿Qué es sintético y qué es real?** | plano por plano. Un video puede tener cara IA sobre metraje real, o al revés |
| 2 | **¿Qué modelo lo generó?** | rótulos en pantalla, marca de agua, el caption, el nombre de archivo si se ve. Si no se dice, **se dice que no se dice** |
| 3 | **¿Cuáles fueron los insumos?** | ¿una foto? ¿un video del celular? ¿un escenario aparte? Muchos los rotulan en los primeros segundos |
| 4 | **¿Cómo mantuvo la consistencia?** | entre planos: la cara, la ropa, el lugar, la luz. Es lo más difícil y donde está el oficio |
| 5 | **¿Qué se hizo FUERA del generador?** | montaje, subtítulos, música, corrección de color. Casi nunca sale todo de un prompt |
| 6 | **¿Cuántas generaciones son?** | por el tope de duración del modelo. Un video de 20 s rara vez es una sola |
| 7 | **¿Se puede repetir con lo que tenemos?** | contra la cuenta real, no contra lo que el video promete |

## La regla que más veces salvó de un error — y su mitad que faltaba

**Lo que el video dice del modelo se verifica contra la cuenta antes de escribirlo como
posible.** Consultar el catálogo y el saldo es **gratis**. Se hace antes de prometer nada.

### La mitad que faltaba: una verificación tiene fecha de vencimiento

El caso que originó esta regla terminó dándome vuelta, y conviene contarlo entero porque enseña
más así:

- Seis videos distintos hablaron de **"Seedance 2.5"** y de tomas de **30 segundos**. Verifiqué
  contra la cuenta: no existía. Solo había `seedance_2_0`, tope 15 s. Lo escribí seis veces como
  "modelo fantasma".
- **El 2026-08-18 volví a consultar y `seedance_2_5` está, con duración de 4 a 30 s**, más los
  modos `video_edit` y `video_extension`, y apareció `seedance_2_0_mini`.

Los videos no mentían: **describían algo que aún no había llegado a nuestro catálogo.** Mi
verificación era correcta el día que la hice, y quedó vieja igual.

**Entonces la regla completa es:**

1. Verificá contra la cuenta antes de prometer. (sigue igual)
2. **Una verificación con fecha es un dato con fecha.** Si vas a apoyarte en una comprobación
   anterior, **volvé a consultar** — no la cites. Es gratis.
3. Y separá las dos cosas al escribir: *"no está en la cuenta **hoy**"* no es lo mismo que
   *"no existe"*. La primera es un hecho fechado; la segunda es una afirmación que envejece mal.

Lo que **no** cambia: cinco fuentes repitiendo lo mismo siguen sin ser prueba. La diferencia es
que la conclusión correcta era *"todavía no lo tenemos"*, no *"es humo"*.

## El entregable del carril A

No es un resumen: es una **receta**. Insumos concretos, orden de pasos, qué herramienta nuestra
hace cada paso, cuántas generaciones, y qué falta para poder ejecutarla hoy.

---

# Carril B — video que cuenta una IDEA

Acá el objetivo es distinto: separar lo que sirve de lo que suena bien.

## Las cinco preguntas

| # | Pregunta |
|---|---|
| 1 | **¿Qué afirma, textual?** — verbatim, no parafraseado |
| 2 | **¿Con qué lo respalda?** — dato con fuente, demo en pantalla, o nada |
| 3 | **¿Ya lo tenemos?** — contra el repo, no contra la memoria |
| 4 | **¿Qué cambia si es cierto?** — si la respuesta es "nada concreto", es ruido |
| 5 | **¿Qué habría que verificar antes de usarlo?** |

## El error que hay que evitar acá

Un video puede ser **flojo de contenido y excelente de forma**. Durante la primera pasada se
midieron 50 videos preguntando *"¿me enseña una capacidad que no tenga?"* y salió 40% humo —
con el stack ya armado, era el resultado inevitable. Medidos por *"¿cómo está hecho?"*, casi
ninguno lo era.

**Todo video pasa por los dos ejes: contenido Y oficio.** Un clip mudo de 6 segundos que no
enseña nada igual enseña montaje, encuadre y ritmo.

---

# Filtro 1 — la calidad de la FUENTE

Se aplica a lo que el video afirma. Cuatro niveles:

| Nivel | Qué es | Qué se puede hacer |
|---|---|---|
| **VERIFICADO** | lo comprobamos contra la cuenta, el repo o la producción | usarlo como base |
| **PRIMERA PARTE** | lo dice el proveedor de la herramienta | creíble, pero sigue siendo marketing: verificar antes de presupuestar |
| **AFIRMADO** | lo dice un creador, sin prueba | se marca **"a verificar"** y NUNCA se repite como propio |
| **DESCARTADO** | contradice algo que ya verificamos, o es fraude/ToS | se escribe el motivo para no reanalizarlo |

## Señales de que la fuente es mala

- **Cifras sin fuente** — "$1M en 4 meses", "482 leads", "5,5M de vistas". Nunca se repiten.
- **Se contradice sola** — un caso mostraba "408M vistas en 7 días" y lo narraba como "400-500M al mes".
- **Esconde el motor** — un tutorial de avatares daba el prompt de ChatGPT y nunca decía con qué
  generaba la imagen final, que es donde se decide el realismo y se gasta la plata.
- **La prueba es del propio vendedor** — un caso citaba como "demostración científica" un
  gráfico del sitio de quien vendía el producto.
- **El resultado es una ilustración, no una captura** — si la "prueba" está dibujada, no es prueba.
- **Vende como novedad algo estándar** — fórmulas de copywriting de décadas presentadas como hallazgo.
- **Pide comentar para "mandarte" el método** — no descalifica, pero el método suele estar en
  las láminas. Se extrae de ahí; no se comenta el cebo.

## Lo que se descarta aunque funcione

Farmear cuentas, granjas de bots, astroturfing, capturar tarjetas sin tokenizar, y citar leyes
extranjeras como si aplicaran en Bolivia. Se anota el motivo y se cierra.

---

# Filtro 2 — la calidad de MI entrega

El otro lado, y el que más falló. Antes de dar por buena una ficha:

1. **Cobertura real declarada.** "Audio 100%, 5 de 7 láminas" — nunca "vi el video" desde dos cuadros.
2. **Cada afirmación con su origen.** Verbatim entre comillas, o marcada como interpretación mía.
3. **Lo que no pude verificar, dicho.** Un "esto quedó sin comprobar" vale más que un "listo"
   que se cae al primer toque.
4. **El veredicto contra los dos ejes**, contenido y oficio, no contra uno solo.
5. **Nada que ya esté hecho.** Antes de proponer una tarea, comprobar que no esté cerrada:
   una vez propuse cerrar la seguridad de producción que ya estaba cerrada y verificada.
6. **Nada que ya viva en otro lado.** Buscar dónde vive la cosa antes de crear carpeta nueva.
7. **El loop del Gate 3**: nombrar la parte más frágil de lo que hice y comprobarla. Si no
   encuentro ninguna parte frágil, no miré bien.

## Los errores reales que originaron este filtro

| Lo que entregué | Qué pasó |
|---|---|
| "Los SFX no están bajados" | estaban, en otra carpeta |
| "Hay dos IDs de voz en conflicto" | eran dos plataformas distintas; el problema era un ID truncado |
| "Un prompt se perdió en un rebase" | nunca se perdió: leí el repo parado en otra rama |
| "La seguridad de prod está pendiente" | cerrada y verificada días antes |
| Forcé español en un video en inglés | Whisper no falla con idioma forzado: **traduce**, e inventa el verbatim |
| "Seedance 2.5 no existe", seis veces | era cierto al verificarlo y dejó de serlo. **La verificación venció y yo la seguí citando** |

En todos, el dato correcto estaba a una consulta de distancia.

---

---

# Las cuatro reconstrucciones

**Regla:** todo video que llega se reconstruye. Nunca se despacha con un resumen. Lo único que
cambia según el tipo es **qué** se reconstruye, **dónde vive** ese conocimiento en el repo, y
**con qué herramienta nuestra** se reproduce.

Antes de escribir la ficha hay que poder contestar las tres columnas de la derecha:

| Tipo | Qué es "cómo se hizo" | Con qué NUESTRO se reproduce | A qué frente va |
|---|---|---|---|
| **IA** — video o imagen generada | modelo · insumos · prompt literal · cómo sostuvo la consistencia · qué se hizo FUERA del generador · cuántas generaciones | catálogo Higgsfield (`models_explore`, presets, Marketing Studio) + `editor-videos` / HyperFrames para lo de afuera | INFLUENCERS IA · editor de videos |
| **WEB** — una interfaz, una animación, un componente | el patrón exacto: qué propiedad CSS, qué librería, qué truco de layout, qué evento. **No "se ve lindo": el mecanismo** | `image-to-code` para reconstruir desde fotograma · el pattern bank de motion · las skills gsap-* · `ui-ux-pro-max` para juzgarlo | web-factory |
| **SaaS / producto** — un panel, un flujo, una app | la **máquina de estados** y las **entidades**: qué estados tiene una cosa, quién la mueve, qué pantalla resuelve qué trabajo, qué se deriva de qué | ONIA Core: ¿existe la entidad? ¿existe la capability? ¿está **encendida** en el producto? | onia-plattform · onia-core |
| **MARKETING** — un anuncio, un gancho, una mecánica | el **molde**: estructura del guion segundo a segundo, dónde está el gancho, qué mecánica de conversión usa, qué pide y en qué orden | `copywriting` · `marketing-psychology` · `ads` · el motor de contenido | marketing · INFLUENCERS IA |

## Las tres preguntas que cierran cualquier ficha

Sea del tipo que sea, la ficha no está terminada hasta contestar estas tres. Si alguna queda
vacía, el análisis está a medias:

1. **¿Qué frente nuestro toca?** — nombrar la sesión, no "sirve para marketing".
2. **¿Con qué herramienta NUESTRA se reproduce?** — nombrarla. Si no existe, decir que no existe;
   eso también es un resultado.
3. **¿Qué falta para poder hacerlo hoy?** — un dato, un permiso, un cliente, una credencial, o nada.

## Lo que esto cambia en la práctica

Un ejemplo real del corpus, para que se entienda la diferencia:

- **Antes:** un reel mostraba dos paneles de comandas. Ficha: *"competidores directos, tienen
  tablero kanban"*. Idea extraída. Fin.
- **Con la reconstrucción SaaS:** ¿cuál es la máquina de estados? `Nuevo → En preparación → Listo
  → Salió para entrega`, con reloj. ¿Qué entidades? pedido, ítem, cliente, producto con stock y
  visibilidad. ¿Qué se deriva? el ticket para impresora. ¿Existe en nuestro core? ¿Está encendido
  en el producto? **Eso es una tarea; lo otro era una observación.**

Y otro:

- **Antes:** *"el botón es lindo"*.
- **Con la reconstrucción WEB:** ¿es `clip-path` animado con `@property`? ¿es un `<dialog>` nativo
  con `showModal()`? ¿la transición está en `transform` y `opacity` o está animando `width` y por
  eso salta? **Ese es el mecanismo, y es lo que se porta.**

---

# El atajo que descubrimos el 2026-08-19: la herramienta hace la ingeniería inversa

Antes de leer 40 fotogramas a mano, hay que probar esto. **Verificado, y es gratis** (balance
antes 2.567,78 · después 2.567,78):

| Herramienta | Qué hace | Costo |
|---|---|---|
| **`video_analysis_create`** ([prueba medida](2026-08-19-la-herramienta-lee-el-video.md)) | análisis **escena por escena** de cualquier video. Acepta un video subido (`media_upload` → `media_confirm`) o una URL de YouTube. Tarda 3-5 min | **gratis** (medido) |
| **`ad_reference`** (Marketing Studio) | analiza el **escenario** de un anuncio existente — composición de escenas, ritmo, gancho, narración — y después genera con NUESTRO producto y avatar | crear la referencia es gratis; **generar cuesta** |

O sea, el ciclo entero del carril A se puede automatizar:

```
link → fetch-video.mjs → media_upload → video_analysis_create → escenas
                                      → ad_reference → generar lo nuestro (esto SÍ gasta)
```

**Advertencia de la propia herramienta:** *"the longer the video, the less accurate the
scene-by-scene analysis becomes — short clips give the most reliable results."* Para un reel de
15-60 s es ideal. Para un taller de 44 min, no sirve: ahí siguen valiendo los fotogramas.

Y no reemplaza leer el prompt en pantalla: el análisis describe **qué pasa**, no **con qué texto
se generó**. Si el video muestra el prompt, hay que leerlo igual.

---

# ¿Conviene que Sergio mande el archivo en vez del link?

Se preguntó el 2026-08-19. **La respuesta es no, salvo en cuatro casos.**

Bajar el video **no es el cuello de botella**: `fetch-video.mjs` tarda ~1,7 s por reel. Y el link
trae cosas que el archivo suelto pierde: **el caption, el autor y la fecha**. En varios carruseles
el método completo estaba en el caption.

**Mandá el archivo solo cuando el link no alcanza:**
1. Es un mensaje directo o una historia que expira.
2. La cuenta es privada.
3. Lo hiciste vos (una salida de Higgsfield que querés que analice).
4. El link ya falló.

**Lo que SÍ limitaba la lectura, y son tres cosas mías, no del formato de entrada:**

| Límite | Arreglo |
|---|---|
| Leo una **muestra** de fotogramas. En el reel del auto el prompt aparecía en UN cuadro: con muestreo más grueso lo perdía entero | muestrear **más denso donde hay texto en pantalla**, no a intervalo fijo |
| **No leo el caption de los videos**, solo el de los carruseles | traerlo siempre; es gratis y a veces trae el prompt |
| Whisper **degrada los términos técnicos**: "SIDANZ 2.5" = Seedance, "Hitsfield" = Higgsfield, "viesel" = VSL | **nunca citar un término técnico salido de transcripción sin contrastarlo con la imagen** |

---

# El ciclo completo

```
link → bajar → ver → transcribir → ¿carril A o B? → preguntas del carril
     → Filtro 1 (calidad de la fuente) → Filtro 2 (calidad de mi entrega)
     → ficha con veredicto → sesión que le toca → prompt
```

**Esta sesión no ejecuta: reparte.** Lo que haga falta construir se anota y se manda a su sesión.

## Cómo se ve un video, según lo que haya

| Orden | Camino | Límite |
|---|---|---|
| 1 | caption / texto | ninguno — en 4 de 6 carruseles traía el contenido entero |
| 2 | Whisper (Speaches, VPS) | ninguno, gratis. Idioma en `auto`, nunca forzado |
| 3 | fotogramas leídos con visión | cuesta contexto, no dinero. Único camino para mudos y carruseles |
| 4 | Gemini nativo | ~20 videos/día, cuota **diaria** |

Herramientas: `scripts/video-intake.mjs` (todo junto) · `fetch-video.mjs` (reels y TikToks sin
navegador) · `ig-carousel.mjs` (carruseles de imágenes, que yt-dlp no puede).
