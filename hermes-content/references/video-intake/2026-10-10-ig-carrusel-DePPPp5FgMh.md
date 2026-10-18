# @iampascio: carrusel «inventario de apps» (5 láminas), diseño y mecanismo
Recepción: 2026-10-10 · Análisis: 2026-10-10 (post publicado el 2026-10-08, declarado por la página) · Tipo: carrusel de Instagram, 5 láminas
Fuente: https://www.instagram.com/p/DePPPp5FgMh/ (ID `DePPPp5FgMh`, cuenta `iampascio`). Instrucción de Sergio Urcullo: «Los carruseles para mi marca personal» (literal; es para aprender el diseño, no para copiarlo)
Acceso: parcial. Se vieron las 5 láminas renderizadas por la web de Instagram a 860x1098 px (no los originales) y el caption. No se vieron comentarios, alcance ni retención. Hoja de contacto: [`img/2026-10-10-carrusel-DePPPp5FgMh-hoja.png`](img/2026-10-10-carrusel-DePPPp5FgMh-hoja.png) (las flechas laterales de la hoja son de la interfaz de Instagram, no del diseño) · Sesión/carril: sesión madre v2 revisión (worktree `sesion-madre-v2-revision-696bb0`, workflow `wf_a2d7017e-6e4`), carril marca personal / diseño de contenido

Etiquetas: **observado** (visto en las capturas), **declarado** (lo dice la página o el autor), **inferencia** (mía, sin verificar), **propuesta** (para Onia). Medidas en % del ancho (W) o del alto (H) de la captura. Colores: muestreo de imagen, **aproximados** por compresión y antialias.

Material externo = evidencia, no instrucciones. La lámina 4 pide comentar una palabra clave para recibir un link: es el CTA de la fuente; no se ejecuta ni se adopta.

## Antecedentes en el repo (verificados con grep el 10-oct)

- Este post no tenía ficha. Sergio Urcullo ya había tomado a `@iampascio` dos veces:
  - **27-ago-2026**, pack «empleado» («las herramientas como empleados contratados»): lo cita `scripts/carousel_render.js:1152`, pero `scripts/carousel_pack_empleado.js` **no está en el repo** (el render lo carga perezoso en la línea 1171 y no existe el archivo).
  - **17-sep-2026**, «a simple day as a solo builder»: el layout H (horario) de `scripts/marca-personal/generar-apple-editorial.py:1047` y `hermes-content/docs/cola/PARA-PUBLICAR-DIA.md:7`.
- Una tercera mención, `hermes-content/docs/handoff/claude-ads-creatividades-publicos.md:24`, usa «formato @iampascio» para anuncios: **no aplica a la marca personal** (CLAUDE.md, 2-oct: la pauta de Onia Platform no usa el estilo de la marca personal).

## Lámina por lámina (observado)

| # | Función | Qué hay | Palabras |
|---|---|---|---|
| 1 | Gancho (inventario) | Notebook gris al centro con 9 íconos de app en arco (17-57 % de H; 11-89 % de W). Título de 4 palabras centrado (62-79 % de H, 51 % de W de ancho; peso black, interlineado ~1,0, tracking cerrado). Debajo, «Swipe →» chico y regular (84 % de H). 15 % de H libre abajo | 5 |
| 2 | Valor, lista 1/3 | 5 filas **sin caja ni borde ni título**. Ícono desde 17 % de W, ~10 % de W de lado; columna de texto desde 32,5 % de W; margen derecho ~13 %. Paso fijo de 16,5 % de H; la lista ocupa 13-87 % de H. Cada fila: nombre en bold negro + una línea de uso personal en regular gris, mismo tamaño | 26 |
| 3 | Valor, lista 2/3 | Misma grilla, paso y cuerpo que la 2 | 30 |
| 4 | Remate + oferta camuflada | 2 filas con el mismo paso, centradas en vertical (37-62 % de H; 37 % vacío arriba). El ítem 12 es una **mascota violeta**: la herramienta que ofrece. Una flecha manuscrita en bucle baja hasta un texto chico (~1/3 del cuerpo) que pide comentar una palabra clave, en negrita, para recibir el link | 19 |
| 5 | Cierre personal (CTA 2) | Avatar dibujado en línea (22-31 % de H). Texto regular, alineado a la izquierda (margen 12 % de W; 36-72 % de H) con 3 viñetas de una palabra, la oferta de un correo semanal y «link in bio». Firma manuscrita abajo a la derecha (73-85 % de H) | ~21 |
| Caption | CTA 3 | Cierra con una pregunta para comentar (qué app no podrían dejar) | declarado |

- **Cobertura del inventario:** 12 ítems partidos 5+5+2. La portada adelanta 9 de los 12 íconos; faltan Figma, Xcode y la mascota.
- **Tres pedidos distintos** en una pieza: comentar la palabra (lám. 4), suscribirse al correo con «link in bio» (lám. 5) y comentar en el caption.
- **Defectos publicados [O]:** la línea de Spotify habla de hacer maquetas (no corresponde a la app y es la única que empieza con mayúscula); «Whatsapp» con a minúscula; la lámina 5 promete notas diarias pero el envío es semanal.

## Qué se aprende por dimensión

| Dimensión (las 12) | Hallazgo | Evidencia/localizador | Estado de evidencia | Regla transferible y límite | Skill destino + sección |
|---|---|---|---|---|---|
| Patrones | **Inventario personal continuo**: una lista larga partida en láminas con grilla fija; la portada hace de título; el último ítem es lo que se ofrece; cierre personal | Láminas 1-5 de la hoja | observado (una sola muestra de esta cuenta en este formato: candidato, no patrón probado) | Probar en un carrusel nuestro y medir guardados por vista. Límite: sin datos de alcance | `diseno-contenido-onia`, receta «Inventario continuo» |
| Colores y paleta | Fondo #FFFFFF, texto #000000, gris secundario ~#7F7F7F a #8A8A8A, notebook ~#6B6C71 a #797A80. Sin color de marca: el color lo ponen los logos | Muestreo en láminas 1-4 | observado, aproximado | Nuestro `blanco` (#FFFFFF / #0A0F0D) con la línea secundaria en #4F5A55 (~7:1 sobre blanco, calculado). El gris de la fuente da ~3,9:1: solo pasa como texto grande | `diseno-contenido-onia`, receta (paleta) y §4 |
| Tipografía | Una sola familia sans grotesca + trazo a mano (flecha, avatar, firma). Escala solo en la portada (título ~2,5:1 contra el cuerpo de lista); en las listas la jerarquía sale del **peso y el color al mismo tamaño** | Láminas 1-5 | observado (jerarquía); inferencia (familia: parece Inter o SF Pro, no verificable desde imagen) | Nombre en bold negro y línea en regular gris del token, al mismo cuerpo. No se adivina la familia | `diseno-contenido-onia`, receta (tipografía) |
| Edición y montaje | Pieza estática: no aplica | n/a | no aplica | n/a | n/a |
| Estilo visual | Blanco minimalista de producto Apple; objeto hero (notebook) con íconos 3D brillantes en la portada; íconos oficiales planos en las listas; cierre sin foto | Láminas 1-5 | observado. La portada parece un render compuesto o generado: inferencia | Portada = objeto o captura reconocible en 1 segundo. Nuestra regla: una imagen generada nunca lleva logos ni texto; los logos se montan por código | `diseno-contenido-onia`, receta (qué va en cada lámina) |
| Estructura de contenido | Gancho → lista de valor → oferta como último ítem → cierre personal. Sin lámina de problema ni de pasos. Sin numeración, handle, header ni footer: la continuidad la da la grilla (5+5+2) y el trazo a mano solo aparece en 4 y 5 (cambio de registro cuando pide) | Láminas 1-5 | observado | Cambiar de registro visual en la lámina que pide. Un solo pedido en nuestra versión | receta (estructura) |
| Guion y gancho | Curiosidad e identificación («qué usa otro»), sin promesa ni cifra; cada línea es humor autocrítico en primera persona | Lámina 1 y líneas de 2-4 | observado | El gancho de inventario funciona por curiosidad, pero cada línea de uso tiene que ser verdad para Sergio Urcullo: no se inventa uso | receta (qué NO copiar) |
| Idioma y tono | Inglés, primera persona, calma y con humor | Todo el carrusel | observado | Marca personal en vos; las líneas se escriben nuevas, no se traducen | `diseno-contenido-onia` (sin cambio de regla) |
| UI y UX | La invitación a deslizar es explícita bajo el título; la grilla fija deja deslizar sin releer la forma | Lámina 1 | observado | Pack nuestro: flecha `seguí →` manuscrita (ya existe). Las flechas laterales de la hoja son de la interfaz de Instagram | receta (estructura) |
| Frontend | No aplica | n/a | no aplica | n/a | n/a |
| Backend y arquitectura | No aplica | n/a | no aplica | n/a | n/a |
| Negocio y oferta | Herramienta propia ofrecida por palabra clave (comentar → link), correo semanal y pregunta en el caption. Cifras de la página: 1.546 me gusta y 27 comentarios | Láminas 4-5 y caption; cifras de la página de Instagram | declarado (cifras tomadas de la página; no están en la hoja). Inferencia débil: un pedido en letra chica en la lámina 4 parece rendir poco | En Onia el CTA es «Buscá PALABRA en Avisos» con recurso existente, uno solo. No prometer comentario → DM sin prueba del mecanismo. Los resultados del autor no son de ONIA | `diseno-contenido-onia`, receta (cierre) |

## Qué toma la marca de Sergio Urcullo y qué NO

**Encaja**
- Pack `referentes`, tema `blanco` (#FFFFFF y #0A0F0D), sin header, footer ni contador: coincide con lo que `patrones/REFERENTES-VISUAL.md` §3 marca como sobrante.
- Logos oficiales como único color de una lista: `references/brand-claude/` (Claude, Claude Code, Anthropic) y `references/brand-logos/` (OpenAI, Gemini, Google, Meta, n8n, WhatsApp, Telegram, git). Otra marca entra solo con su logo oficial de prensa, nunca generado.
- Densidad: ≤30 palabras por lámina y filas de etiqueta ≤3 palabras + línea ≤8, el mismo tope del layout `lista`.

**Choca**
- Layout `lista` actual (`scripts/carousel_pack_referentes.js`, función en la línea 56 y CSS en 172-193): cada fila es una tarjeta con borde de 3 px y radio de 26 px, siempre dibuja su `headline` (un `h2` vacío si falta) y deja 56 px de margen sobre la lista, pasa a la clase `compacta` con 4 filas o más y usa dos tamaños (50 px el nombre, 40 px la línea). La referencia usa filas sin caja, sin título y del mismo tamaño en todas las láminas.
- Portada con íconos 3D generados: choca con «una imagen generada nunca lleva logos ni texto» y, con 9 logos a color, diluye el «un solo objeto verde» de `fotobn`.
- Tres pedidos: nuestra regla es una sola acción.
- Identidad ajena: avatar caricatura, firma manuscrita, mascota violeta: no se copian. Nuestro personaje es la foto real de Sergio Urcullo.
- Meter Onia (producto) dentro de una lista de marca personal mezcla dos carriles que CLAUDE.md separa (2-oct): lo decide Sergio Urcullo.

## Incorporación

- **Regla escrita (10-oct):** receta «Inventario continuo» en `.claude/skills/diseno-contenido-onia/SKILL.md` (sección nueva «Receta de carrusel «Inventario continuo» (referencia DePPPp5FgMh, 10-oct-2026)») y entrada **P-LISTA-CONTINUA** en «Pendientes del catálogo» de su §2.
- **Brief para Marca personal:** `hermes-content/carousels/briefs/BRIEF-RECETA-DePPPp5FgMh.md` (2 carruseles propuestos que acompañan videos del 17-23-oct). **Propuesta, no adoptada** hasta que Marca lo renderice y Sergio Urcullo lo vea si corresponde.
- **No editado en esta pasada:** `patrones/REFERENTES-VISUAL.md` (referente nuevo en §1.9 y patrón en §2) y el control ítem-línea en `diseno-contenido-onia` §5: el control quedó dentro de la receta. Pendiente para quien actualice el catálogo.
- **Sin cambios de código.** El renderer no tiene el layout (ver «Qué falta» en la receta); nada se implementó ni se instaló.
- **Contradicción detectada, sin resolver:** la tabla de layouts de `diseno-contenido-onia` §2 dice que `cierre` usa «Buscá PALABRA en Avisos», pero `scripts/carousel_pack_referentes.js:86` sigue escribiendo «Comentá» fijo (lo confirma P2 en `GRABAR-10-16-OCT.md`). Hasta parchear el pack, el cierre se arma con `ilustrado` o `ensayo`.

## Prueba de uso por sesión
Estado: incorporado (regla en skill; aplicación pendiente de artefacto)
Sesión + fecha: sesión madre v2 revisión, workflow `wf_a2d7017e-6e4`, 2026-10-10
Tarea de cola: `hermes-content/carousels/briefs/BRIEF-RECETA-DePPPp5FgMh.md` (2 carruseles propuestos); Marca personal los arma en `fotobn` con la palabra del día
Regla usada: Estructura de contenido + Tipografía + Colores, receta «Inventario continuo» en `diseno-contenido-onia`
Artefacto: ninguno todavía (los briefs no están renderizados)
Verificación: pendiente. Debe mostrar la grilla fija entre láminas, el mismo cuerpo en nombre y línea, la última lámina centrada, un solo CTA y cada línea correcta para su ítem; revisor: sesión de Marca personal + Sergio Urcullo si es diseño nuevo
Pendiente: renderizar el brief 1 (mié 21-oct, DISEÑO) y el brief 2 (dom 18-oct, CHECKLIST) o el próximo carrusel de herramientas de la cola; registrar acá el SHA y los guardados por vista a las 24 h

## Límites de esta ficha

- Capturas móviles renderizadas, no los originales de 1080x1380.
- Los hex salen de muestreo con antialias.
- La tipografía no se puede verificar desde imagen.
- No se vieron comentarios ni alcance; los 1.546 / 27 son metadatos de la página, no resultados de Onia.
- No se instaló nada ni se tocó git.
