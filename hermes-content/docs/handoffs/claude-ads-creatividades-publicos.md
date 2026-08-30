# Handoff — carril `claude/ads-creatividades-publicos`

> Última actualización: **2026-08-29**. Lo de ese día está acá arriba; de "Sesiones anteriores"
> para abajo es historia y no manda.
> Formato: los 6 campos de `README.md` de esta carpeta.

---

# Sesión 2026-08-29

## 1. Objetivo

Cerrar la alerta de automatización de Meta sobre `@sergio_urcullo` — Sergio lo eligió por encima
de seguir con Lucía/Higgsfield. Después, arreglar SISTEMA. Recién después, retomar contenido.

## 2. Estado

**Nada nuevo se publicó.** Todos los cambios son de repo. No se tocó el VPS ni se mutó n8n.

- **Causa de la alerta: identificada mirando las pantallas.** En Facebook (no Instagram) →
  Integraciones comerciales hay **seis accesos** sobre su cuenta, y **cuatro son apps de Meta
  nuestras** apiladas desde mayo. Detalle en `ONIA_AVISO_AUTOMATIZACION_IG.md`.
- 🔴 **Sergio decidió NO eliminar ninguna** (29-ago), aunque se verificó que era seguro.
  **No volver a proponerlo.**
- **SISTEMA arreglado del lado de las piezas.** Siete briefs de @oniahq prometían "las 6 tareas
  para delegar" y el DM manda un link para agendar. Ahora prometen lo que el DM entrega.
- **Cinco bugs del gate**, todos de la misma familia (dar por bueno sin mirar): el self-check
  colgado del dato vivo (dos veces), el contador escrito a mano, el gate ciego a los triggers
  dentro de la lámina, y una sola frase admitida por palabra cuando Lucía y @oniahq tienen voces
  distintas para la misma oferta.
- **Blindaje**: `postiz_schedule.mjs` rechaza el integration id de Sergio.

## 3. Archivos y cambios

`9b0a9774` guard de Postiz · `ba489288` corrección de SISTEMA + self-check desacoplado ·
`326794dc` doc del aviso reescrito · `37e0219b` seguridad de borrado verificada ·
`cc3a0af4` contradicción del doc · `6bf6660c` verificación de negocio + línea de tiempo ·
`aad6c03c` 7 briefs alineados + 3 bugs del gate.

## 4. Intentos fallidos — lo que más vale

- **Lancé un Workflow entero con premisas falsas** (que Samuel usaba ManyChat sobre nuestras
  cuentas, y que la app estaba sin verificar). Las dos eran mentira. Se pagó y se tiró.
  **Verificar las premisas ANTES de abrir un workflow.**
- **Casi apago SISTEMA en n8n con una premisa falsa.** El registro decía que mandaba un 404.
  Leer el workflow vivo antes de tocarlo lo evitó — apagarla habría sido la peor de las salidas.
- **El panel de Integraciones comerciales NO se puede leer**: vive en un iframe cross-origin, no
  lo ve el árbol de accesibilidad ni el DOM de la página madre. La única vía es clickear por
  coordenada, y **"Eliminar" está pegado a "Ver y editar"** en su cuenta personal. Se resolvió por
  otra puerta: `developers.facebook.com/apps/` da los modos y casos de uso sin botones peligrosos.
- **Mi propio barrido de guardián dio 12 rojos y 8 eran falsos**: corrí el gate de carrusel sobre
  briefs de **video** (`video-brief-template`, `futbol-lab-…`) y de **post simple**
  (`lucia-p1..p6`), que no tienen `slides` por diseño. **Un barrido que grita 12 esconde los 3
  que importan.** Filtrar por briefs que declaren `slides`.
- Cuatro hipótesis sobre la alerta murieron por lo mismo: **opinar sin abrir la pantalla**.

### Segunda mitad del 29-ago — Higgsfield por navegador

**Banco de Lucía, piezas nuevas:** `G05-oficina-de-tramites` (la mejor del set: dos manos sobre un
formulario sellado, acción a medias inconfundible), `G05b` (Recreate de G05, el mismo trámite desde
el otro lado del vidrio) y `V04-parada` (animación de G02).

**Tres cosas aprendidas, todas escritas en `TECNICA-HIGGSFIELD.md`:**

1. **La regla de la acción a medias quedó cerrada por sus dos lados.** Con acción clara el modelo
   la CONTINÚA (V02, V03). Sin ella la INVENTA, y lo que inventa es hablar o darse vuelta (V04, que
   se generó a propósito sabiendo que iba a salir mal). **No animar retratos ni esperas.**
2. **Recreate no da variantes**: recarga la receta y produce otra toma del mismo guion — cambia
   secundario, ángulo y arquitectura; conserva personaje, lugar, acción y luz. Sirve para conseguir
   un PAR coherente, no para retocar una foto.
3. **Trampa de costo:** el workspace de video arranca en **4K = 30 créditos**; a 720p son 6,25.
   Es 5x por el mismo video.

**Gasto del día en Higgsfield: ~16,5 créditos (≈ Bs 6,2).**

### Intentos fallidos de esta mitad

- 🔴 **Una falsa alarma casi apaga dos embudos vivos.** `verificar_recompensas.js` dio timeout en
  SISTEMA y HUMO; el runbook manda apagar la palabra en ese caso. **No se apagó**: se comprobó por
  fuera con `curl` y las tres URLs daban 200 en 0,7 s. Era un hipo de red. El chequeo no tenía
  reintento, así que **el remedio de la falsa alarma era peor que la falsa alarma**. Ahora
  reintenta una vez.
- Y al cablear ese reintento se introdujo un bug —la función se llamaba a sí misma— que **la
  corrida normal no detectaba**, porque ese código solo se ejecuta cuando algo falla. Por eso el
  script ahora tiene `--self-check` que prueba el reintento contra un host inexistente y mide que
  de verdad espere.

- **El grid de `/asset/all` no carga miniaturas** con 738 assets y cuelga el renderer (timeout de
  30 s, tres veces). Se perdió una vuelta entera ahí. **La puerta buena es el historial del
  workspace**, que sí renderiza.
- **No se puede subir una imagen de disco al frame de video**: la app limpia el input aunque la
  subida reporte éxito.
- **Dije "no existe Recreate" mirando el panel equivocado** (el reducido del workspace de video).
  Existe. Corregido el mismo día.
- **El banco entero no estaba en el repo**: `.gitignore` ignora `*.png` a propósito y yo guardé
  todo solo como PNG. Lo cazó el guardián. Ahora hay `scripts/verificar_banco.js` que falla si un
  asset documentado no está versionado.
- **Mi propio barrido de guardián marcó los 5 PNG como error.** Estaba mal el chequeo, no el repo.
  Un guardián que grita por lo que está bien deja de leerse.

## 5. Próximos pasos

### 🟢 DECISIONES DE SERGIO — 29-ago, tarde

1. **Publicar: SÍ, una pieza por día**, e historias con sentido del día. ⚠️ Con una condición que
   él mismo planteó: *"revisá que no sea baneable"*. **Ver §Riesgo de publicación abajo.**
2. **Los campos de la app: los cargo yo.** ⚠️ Se intentó y **se abortó**: la traversal del DOM cayó
   en el input del App ID en vez del de dominios. No se rompió nada (ese campo es de solo lectura)
   y se recargó sin guardar. **Los tres campos los carga Sergio a mano** — son 60 segundos y no
   valen el riesgo de tantear en la app de producción. El **ícono ya está** en el repo.
3. **Screencasts: no sabía qué eran.** Explicado; pendiente su OK para grabarlos.
4. ~~**Marketing Studio con Lucía vendiendo Onia Platform**~~ — ✅ **HECHO**. 4 créditos (Bs 1,50),
   no era caro. Resultado en `references/marketing-studio-20260829/`. **El teléfono reproduce el
   dashboard de verdad** (logo, "Hoy", Bs 4.633,40 exacta, KPIs): ese recorte es publicable. Pero
   **impone su estética de anuncio y pisa las instrucciones anti-glamour** — mira a cámara pese a
   que el prompt lo prohibía, luz de catálogo, casting genérico, y la LAPTOP salió inventada.
   ⇒ **Regla: Marketing Studio para el anuncio de un cliente; la receta normal para la voz de
   Lucía. No se mezclan.** Y el producto se pide en un TELÉFONO, no en una laptop.
5. **FACTURA y STACK: pidió que le diga cómo se arreglan.** Ver §Cómo se destraban abajo.
6. **Reforzar el ancla `@lucia-skin-v1`: SÍ.** ✅ autorizado.

### 🔴 Riesgo de publicación — hay que decirlo antes de arrancar 1/día

El aviso de cierre que le llega a Sergio es en **su cuenta personal**, y la causa ya está
identificada: **seis apps conectadas** (no es Postiz solo — Postiz es una de las seis).

Pero la advertencia aplica igual a Lucía por otro motivo: **es una cuenta nueva**. El propio doc
del aviso dice que *"una cuenta joven que empieza a publicar seguido por API se ve como un bot"*.
Arrancar en 1/día por API el primer día es el perfil de riesgo exacto.

**Propuesta: 3 por semana las primeras dos semanas, y recién ahí 1/día.** Las historias sí pueden
ser diarias desde el arranque: pesan menos y son el formato natural de la cuenta.

### Cómo se destraban FACTURA y STACK

- **FACTURA** — el recurso ya está vivo (`onia.com.bo/guia-facturacion` responde 200). Lo único
  que falta es **cargar la palabra en el mapa del nodo «Parsear comentario»** del workflow
  `1jS4jwmNmvcQpqqH`. Son ~5 líneas. **Es edición de n8n: hace falta el OK de Sergio.** Destraba O03.
- **STACK** — doble bloqueo: el PDF no existe **y** el mapa de @sergio_urcullo está vacío a
  propósito. La salida barata es la misma que se usó con SISTEMA: **cambiar la promesa de S05 y
  S06** por algo que ya exista, en vez de escribir un PDF nuevo. No cuesta nada y desbloquea dos
  piezas.

> 🛠️ **Para traer una pieza al repo usá `node scripts/traer_descarga.js --a <destino>`**: rechaza
> la descarga vieja (la trampa que costó dos errores el 29-ago) e imprime el asset id.
>
> 🔴 **Esta lista es la fuente del LOOP TAREAS.** Lo tachado NO se rehace.
>
> 🧭 **El ORDEN de trabajo vive en `ONIA_PLAN_AL_PRIMER_PESO.md`** (30-ago, 26 agentes con
> refutador). Ahí están los 7 pasos con dueño y costo, los 3 descartes razonados (computer-use,
> ads/ad-creative, abogado-del-diablo), los riesgos y las 9 preguntas para Sergio.
>
> 📌 **El orden de lanzamiento del add-on está en `ONIA_ADDON_CONTENIDO.md` §"Estado real y orden de lanzamiento"**
> (29-ago). Resumen: medir demanda gratis → destrabar lo terminado → pedir el permiso que tarda →
> demo → precio → automatizar. **Producir más contenido NO está en la lista: producir dejó de ser
> el cuello.**

### 0. 🔴 ANTES DE PUBLICAR: decidir QUÉ ES Lucía. Bloquea todo lo de abajo.

Sergio, 30-ago: *"revisá hacia dónde va tu contenido, sin eso no avanzamos"*. Se contó, y el
contenido **no va a donde se dijo querer**:

**6 de las 7 piezas mencionan Onia. 4 de 7 mandan a Onia.** Solo L11 no la nombra. Eso es un
catálogo con cara, no una influencer — y **ninguna marca paga por aparecer en el catálogo de otra
empresa**, que es justamente lo que se dijo que Lucía tenía que poder vender.

**Causa raíz: el tema de Lucía HOY ES el tema de Onia** ("IA para negocios bolivianos"). Sin tema
propio no hay audiencia propia, y sin audiencia propia no hay publicidad que vender.

- **A — embudo de Onia** (lo que es hoy): audiencia chica y calificada, gana por leads. **Da plata
  antes.** Si es esto, el contenido está bien y se publica ya.
- **B — medio** (lo que se dijo querer): cada pieza le sirve a su audiencia, Onia se menciona pero
  no es el destino. Gana porque las marcas pagan. **Si es esto, hay que cambiar tema y proporción
  ANTES de publicar** — máximo 1 de cada 5 piezas manda a Onia; hoy son 4 de 7.

⚠️ Con cero clientes pagando y ~11 semanas de runway, **B puede no valer la pena**: vender
publicidad necesita audiencia grande y eso tarda meses. Está escrito completo en
`ONIA_SISTEMA_MARKETING_LUCIA_ONIA.md` §3-CERO.

### 1. 🔴 PUBLICAR LO DE LUCÍA — es el test de demanda y está sin correr

`ONIA_ADDON_CONTENIDO.md` dice que el lanzamiento de Lucía *es* el test de demanda y que si no
trae nada, la decisión del add-on **se revisa antes de construir**. Nunca se corrió.

**Lo que está hecho, pago y sin publicar:**

| Pieza | Palabra | Estado |
|---|---|---|
| `render-fijado` — quién es Lucía | — | 7 láminas, es el post fijado |
| `render-l6` — cinco señales | SISTEMA | 7 láminas |
| `render-l07` — tres gratis | HUMO | 7 láminas |
| `render-l08` — tres de cinco gratis | HUMO | 7 láminas |
| `L09` — una cara que no existe | — | 7 láminas |
| `render-l10` — la hoja sellada | SISTEMA | 7 láminas, con el banco propio |
| reel de lanzamiento v7 | — | `reel-lanzamiento-20260822/final/` |
| 8 historias | — | `historias-20260823/final/` |

**SISTEMA y HUMO están activas en su cuenta y sus recursos responden 200**, así que el circuito
comentario→DM funciona para las cuatro piezas que lo usan. **Falta solo el OK de Sergio y el orden
de publicación.**

### 1-bis. 🔴 La mezcla está mal, y se ve comparando con el sistema ya escrito

`ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` define 4 pilares con reparto **30/30/30/10**:
**A** meta-IA (que es IA y no lo esconde) · **B** vida de dueña de negocio · **C** el problema
que resuelve Onia · **D** marca/producto.

**Lo que hay construido:**

| Pieza | Pilar |
|---|---|
| fijado (quién es Lucía) | A |
| L09 (una cara que no existe) | A |
| L6 · L07 · L08 · L10 | **C, las cuatro** |

⇒ **Cero piezas del pilar B**, que el propio doc llama *"el vehículo. Sin esto no hay a quién
hablarle"*. Y **cuatro de seis en C**, que es lo que vende.

🪤 **La ironía:** el banco que se produjo el 29-ago —la parada de micro, el mercado, la tienda,
la oficina— **es exactamente material de pilar B**, y la única pieza que lo usa (L10) es de
pilar C. Tenemos el vehículo y lo estamos usando de cartel.

**Formato:** el sistema pide **70% reel / 30% carrusel**. Tenemos 6 carruseles y 1 reel: al revés.
Y hay **5 videos** (V01-V05) del banco sin usar en ninguna pieza.

### 1-bis-a. ✅ Pilar B: hecho — tanda 2 de historias

`historias-20260829/`: **H09 farmacia · H10 mercado · H11 tienda · H12 oficina**, 9:16, 5 s,
sin audio. **0 créditos**: recicla los videos del banco ya pagos. **Sin palabra clave ni CTA** a
propósito — el pilar B no vende, y si estas también piden algo la cuenta entera es un embudo.
V04-parada quedó afuera: es la única animación fallida del banco.

Mezcla ahora: **2 A · 4 C · 4 B**. Sigue faltando reel (el sistema pide 70%).

⚠️ Sergio marcó que el texto se veía chico y tenía razón: la plantilla `quote` trataba el
subtítulo como **firma de autor** (47% del titular, gris) cuando se usa como **remate**. Corregido
a 68% y color de texto en `.claude/skills/editor-videos/scripts/make-mockup.mjs` — otro carril,
pero él lo pidió y `story-batch.mjs` es su único consumidor. **Lección: para juzgar tipografía hay
que mirar el recorte 1:1, no la hoja de contacto al 31%.**

### 1-ter. Lo que agregan las dos referencias que pasó Sergio (29-ago)

`instagram.com/p/DbdLhL7N-dw` y `/DchXc0rucRb`, de **@tomas_medinaa**: 622 comentarios en un
post, casi todos **la misma palabra**, y **cada comentario con 1 respuesta**.

Tres cosas que ellos hacen y nosotros no:

1. **Responden en PÚBLICO además del DM.** Cada respuesta suma un comentario más: el post
   duplica su señal de conversación. Nuestro circuito manda solo el Private Reply, así que el
   comentario queda huérfano y el algoritmo no ve diálogo. **Es un nodo más en el mismo workflow
   de n8n** — edición chica, impacto grande. Requiere OK (no se toca n8n desde este carril).
2. **La palabra es el TEMA, no el producto.** La suya es "Influencer": es lo que el otro quiere
   aprender. "SISTEMA" no significa nada para quien recién llega — hay que haber leído la lámina
   para saber qué pedir. **Bajar la fricción de la palabra es gratis.**
3. **El caption es mínimo** (*"Conocías todos?"*). El gancho vive en el video; el caption no
   explica ni vende. Los nuestros son largos.

### 1-quater. Vender pauta: ya está decidido cómo, y conviene no improvisarlo

`ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` §5 lo resuelve: etiqueta de **Paid Partnership**
obligatoria · **máximo 1 de cada 10 piezas** · gancho siempre, nunca lista de créditos ·
**presenta y demuestra, jamás testimonia** · nada de salud ni promesas de resultado.

Y la jugada que vale más: **cuando una marca pregunta el precio de un post, ya se calificó sola.
La primera respuesta es "te hacemos tu propia modelo"**, que vale mucho más que el canje.

⚠️ **Y el dato que ordena la ambición de seguidores:** en el benchmark del mismo doc,
**@anora.creators con 20 mil seguidores le gana en vistas a @shudu.gram con 236 mil**, y tiene
5-8× mejor engagement que las dos famosas. **El número de seguidores es vanidad**; lo que las
mató fue el contenido de marca. Perseguir seguidores por seguidores nos lleva al lugar donde
están ellas: muchas, y comercialmente muertas.

### 1-quinquies. 📅 CALENDARIO DE LANZAMIENTO — armado, falta el OK y la fecha de arranque

**Día 0 — fijar el perfil.** `render-fijado` (quién es Lucía) como post **fijado**. No cuenta como
publicación diaria: es el ancla del perfil, lo primero que ve quien llega.

| # | Pieza | Pilar | Palabra | Por qué ahí |
|---|---|---|---|---|
| 1 | **reel de lanzamiento v7** | A | — | Presenta. El reel pesa más que un carrusel y el sistema pide 70% reel |
| 2 | **L09** una cara que no existe | A | — | Meta-IA: *"esta cara no existe, así se hace"*. El gancho más barato y en Bolivia no lo usa nadie |
| 3 | **L6** cinco señales | C | SISTEMA | Primera pieza que pide algo. Recién en la tercera, no en la primera |
| 4 | **L10** la hoja sellada | C | SISTEMA | Usa G05+G05b, el par del mismo trámite desde los dos lados |
| 5 | **L08** tres de cinco gratis | C | HUMO | Entrega un PDF de verdad, no una reunión |
| 6 | 🔴 **FALTA** | **B** | — | **Ver el hueco abajo** |

**Historias, diarias desde el día 1:** primero **H09-H12** (pilar B, sin CTA), después H01-H08.
Las historias son el latido; el feed es el evento.

**Cadencia.** Sergio pidió 1/día. La recomendación sigue siendo **3 por semana las primeras dos
semanas** y ahí 1/día — el orden de arriba no cambia, solo se estira. Motivo en §Riesgo.

### 🔴 Dos cosas que aparecieron al ORDENAR las piezas

**1. L07 y L08 son la MISMA pieza.** Misma palabra (HUMO), misma promesa palabra por palabra, y el
titular casi idéntico: *"3 de 5 herramientas que uso son gratis"* contra *"Tres de las cinco
herramientas que uso son gratis"*. **L08 es la reescritura de L07.** Publicar las dos es publicar
el mismo post dos veces. **Va L08 y L07 se archiva** — salvo que Sergio prefiera la otra.
⚠️ El gate NO lo caza: compara cada brief contra el registro de palabras, pero **nada compara las
piezas entre sí**.

**2. No hay pieza de pilar B en el FEED.** El feed queda 2 A + 3 C y cero B, aunque el sistema pide
30% B y B es *"el vehículo"*. Las cuatro piezas B que existen son **historias**, que duran 24 h.
**Se arregla barato:** el banco tiene G02 parada, G03 mercado y G04 tienda **sin usar en feed** —
alcanza para un carrusel de pilar B sin gastar un crédito.

### 2. Destrabar lo terminado (bloquea piezas ya hechas)
- **FACTURA**: ✅ autorizado por Sergio (30-ago) y **el cambio exacto quedó escrito** en
  `ONIA_IG_CARGAR_FACTURA.md`. 🔴 **NO se aplicó por API y no es un olvido:** el MCP de n8n
  conectado solo tiene `update_workflow` con el Workflow SDK, que describe el workflow COMPLETO en
  código — cambiar una línea obligaría a reescribir los 18 nodos a mano, con sus notas,
  posiciones, credenciales y las tres correcciones de agosto. Desproporcionado para agregar una
  palabra. **Son 30 segundos en la UI de n8n.** Bloquea O03.
- **STACK**: doble bloqueo (no existe el PDF y el mapa de @sergio_urcullo está vacío a propósito).
  **Bloquea S05 y S06.**

### 2-bis. 🆕 Marketing Studio tiene su PROPIO sistema de Avatares

Aparte de los Elements. Lucía ya existía ahí en **4 versiones** (`Lucia ONIA v4 FINAL`, `v3
identity`, `v2`, `ONIA`) y también está `Mara ONIA`. La cara **no derivó** del canon en la prueba.
Nadie lo había registrado: es un segundo lugar donde vive su identidad, y conviene saberlo antes de
que las dos se desincronicen.

### 3. Advanced Access — lo único con reloj

**Qué es:** Meta tiene dos niveles por permiso. En **Standard Access** (lo que el panel llama
*"Listo para la prueba"*, donde estamos) el permiso solo funciona en **cuentas con rol en la app**:
las nuestras. En **Advanced Access** funciona en la cuenta de un cliente. **Sin eso el add-on de
Bs 390 no se puede cumplir**, por buenas que sean las piezas.

**Cinco requisitos YA cumplidos** (verificado 29-ago contra la doc de Meta y contra la app):
≥1 llamada API por permiso (127·37·19·19) · verificación de negocio (24-ago) · privacidad
`onia.com.bo/privacidad` **200** · términos `/terminos` **200** · email `business@onia.com.bo`.
Categoría "Negocios y páginas" ✅.

🔴 **Cuatro campos vacíos que hay que llenar ANTES de enviar** (editarlos después dispara
re-verificación) — **son de Sergio, no se tocaron**:

| Campo | Estado |
|---|---|
| Ícono de la app | vacío — 🛠️ **ya está el archivo**: `hermes-content/assets/onia/onia-app-icon-1024.png`, generado del `icon.svg` del sitio, solo hay que arrastrarlo |
| Dominios de la app | vacío → poner `onia.com.bo` |
| Plataforma | ninguna → *Agregar plataforma* → **Sitio web** → `https://onia.com.bo` |
| Dirección / país | vacía y país en **Estados Unidos** → Calle Tulipanes Nro. 9, Zona Norte · Santa Cruz de la Sierra · Santa Cruz · **Bolivia** |

⚠️ **El país es el riesgo real.** Meta, textual: *"Check that the details you enter exactly match
the details of your legal business entity"*. El negocio verificado es boliviano (SEPREC 5371375010,
Santa Cruz). Ya nos rebotó por algo así en julio (teléfono y nombre del sitio).

**Y el trabajo real:** **un screencast POR PERMISO** de punta a punta, instrucciones de prueba paso
a paso para el revisor, y descripción del caso de uso. Meta pide interfaz en inglés y subtítulos si
no se explica solo.

⚠️ El **"~20 días"** que citábamos **no está en la doc de Meta** — no dan plazo. Es estimación
nuestra, no dato.

### 4. Demo de Marketing Studio
Sirve dos veces: pieza de venta del Higgsfield cotizado **y** screencast para App Review.
**Bloqueado**: falta que Sergio diga con qué producto.

### 5. Decisiones sueltas de Sergio
- ¿Se publica L10?
- ¿Se refuerza el ancla `@lucia-skin-v1` con G05/G05c? (se puede desde la web; toca todas las
  generaciones futuras, necesita A/B).

### 6. Roadmap Higgsfield sin tocar
Relight, Inpaint (arreglaría el texto gibberish, el defecto más repetido), Upscale (G01-G04 están
a 1K), Face Swap, Cinematic Cameras, Canvas, Motion Control. **Prioridad baja hasta que haya
demanda medida.**

## 6. Qué depende de Sergio

- **FACTURA**: el recurso está vivo (200) pero la palabra no está cargada en el mapa de @oniahq.
  Es una edición de n8n — no se hace desde acá sin su OK. **O03 está bloqueada por esto.**
- **STACK**: doble bloqueo, el PDF no existe Y el mapa de @sergio_urcullo está vacío a propósito.
  **S05 y S06 bloqueadas.** El gate las marca en rojo con razón.
- Publicar lo que ya está aprobado y sin subir.

---

# Sesiones anteriores

## 1. Objetivo

Dejar a Lucía lista para publicar (reel + carrusel fijado aprobables) y el sistema de
marketing de las tres cuentas escrito como fuente de verdad.

## 2. Estado en que terminó

**EN PRODUCCIÓN — encendido y verificado ahí:**

**LO DE ESTE CARRIL (contenido) — hecho el 23-ago:**

- **Reel L1 v7** — `reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`. Sergio pidió
  cambiar el último clip: perdía las pecas, que son el marcador de identidad del ancla.
  Reemplazado por `VIDEO-rooftop-veo-8s` (mira a cámara, pecas intactas, cierra donde abrió).
  **0 créditos.** Audio remuxeado del master aprobado: −14,3 LUFS, intacto.
- **Carrusel L6 "5 señales"** — 7 slides, **0 créditos** (se estimaban 4).
- **8 historias** — `historias-20260823/final/`, **0 créditos**, motor `story-batch.mjs`.
- **3 carruseles de marca personal de Sergio** — `marca-personal-sergio/render/S01..S03`,
  formato @iampascio, con portada generada. **8 créditos** (4 imágenes a 2 cr).
  Los briefs son **autocontenidos**: traen su propia portada, se re-renderizan sin flags.
- **Medidor del circuito** — `scripts/ig_circuito_medir.mjs`, con `--self-check`.
  Primera corrida real de @oniahq: alcance 73, 3 comentarios, 1 con palabra clave,
  9 visitas al perfil, **0 seguidas**.

**TODO ESO ESPERA EL OK DE SERGIO PARA PUBLICARSE.** Nada se subió.

---

- ✅ **Postiz revivido el 2026-08-24.** El VPS se recuperó (se reinició: load 0,49 contra
  158, steal 2 % contra 93 %, docker con 22 contenedores). Pero Postiz seguía en 502: el
  contenedor `postiz` estaba **Exited (255) hacía 19 h** — murió en el incidente y nunca
  volvió solo. Su postgres y su redis estaban sanos todo el tiempo, que es por lo que el 502
  parecía problema de aplicación. `docker start postiz` → healthy en 25 s, `/auth/login` 200.

  ⚠️ **Patrón que ya se repitió dos veces** (22-ago y 24-ago): el VPS se reinicia y Postiz
  queda muerto sin que nadie se entere, porque se mira el 502 del dominio y no el estado del
  contenedor. **Primero `docker ps -a | grep postiz`, después cualquier otra hipótesis.**

**LO DE INFRA — ENTREGADO A OTRA SESIÓN, no se toca desde acá:**

- ✅ **El circuito comentario→DM funciona**, verificado **leyendo la bandeja** por API:
  el comentario del 18-ago 23:17:58 recibió su DM a las **23:18:04** (6 segundos).
  ⚠️ Antes de llegar a eso me equivoqué **dos veces** con evidencia indirecta: primero dije
  "lead real perdido" (era Sergio probando) y después "nunca entregó un DM" (miré las
  ejecuciones del workflow activo; el DM real lo mandó el workflow **anterior**, hoy
  inactivo). **Regla: las ejecuciones dicen qué corrió; solo la conversación dice qué llegó.**

- 🚨 **Incidente 2026-08-24: el VPS estrangulado por Hostinger.** Load 158, y **la causa
  NO era n8n**. Cadena real: `ollama` clavaba 2 de 4 núcleos las 24 h → CPU 100 % sostenido
  → Hostinger aplicó una penalidad ("Límite de reinicios de CPU alcanzado") → **steal 93 %**,
  o sea que la VM se quedó con ~7 % de su CPU → el task runner de n8n y `docker exec` se
  mueren de hambre. n8n era el síntoma más visible, no el enfermo.

  ⚠️ **Yo diagnostiqué mal dos veces acá** y la sesión de infra lo corrigió: culpé al nodo
  SSH del workflow (la ejecución moría ANTES de llegar a él, y mi propio `runData` lo decía),
  y llamé "comentarios" a eventos que eran `messaging` con `is_echo: true` — los ecos de mis
  3 DMs, ni siquiera accionables.

  🔴 **La penalidad no se levanta sola:** con ollama apagado el steal siguió en 93 %.
  **Depende de un ticket a Hostinger.** Es la ruta crítica: sin CPU no hay verificación
  posible de nada. Detalle en la memoria `n8n-webhook-meta-tormenta-reintentos.md`.
  Carril de infra, con dueño asignado — **no se toca desde acá**.

- 🔴 **TRAMPA CARA: la API de private reply devuelve error y entrega igual.**
  Los 3 intentos manuales del 23-ago devolvieron `OAuthException code 1` y **los 3 mensajes
  llegaron**. Reintentar sobre ese error le mandó a Sergio **3 DMs idénticos**.
  **Regla: ante un error al enviar un private reply, NO reintentar. Verificar primero en
  `GET /me/conversations`** — el error de Meta no es prueba de que no se envió.

- **Palabra HUMO viva** en la cuenta de Lucía (workflow v10 publicado). Entrega el PDF
  *"5 herramientas de IA que sí sirven en un negocio boliviano"*, verificado con HTTP 200 en
  `onia.com.bo/recursos/5-herramientas-ia-bolivia.pdf`.
- **Cuenta de Sergio cableada** al comentario→DM: `entry_id 17841441395192146` mapeado,
  webhook de comentarios suscrito. Palabras vacías a propósito (falta la comunidad).
- **Postiz reparado.** Su backend estaba caído: pm2 lo daba "online" con 64 MB pero no
  escuchaba el 3000 (el VPS se había reiniciado 6 h antes). `pm2 restart backend` → `/api/user/self`
  responde 401, que es lo correcto sin sesión.
- **Bug latente arreglado:** el PDF de la palabra LISTA vivía SOLO dentro del contenedor, sin
  versionar. El próximo deploy lo borraba y esa palabra empezaba a dar 404. Rescatado y
  commiteado en `onia-platform` (commit `06242bb` de ese repo).
- **Cola de @oniahq** corriendo sola: 2 publicados + 8 en cola hasta el 9-sep.

**EN PRODUCCIÓN — 2ª sesión del día (2026-08-23):**

- 🔴 **El chat público de `onia.com.bo` nunca había respondido a nadie — arreglado.** Se descubrió
  al intentar filmar L5 con capturas reales. El usuario bot (`users.id=3`) era miembro de los
  inboxes 5, 6 y 7 pero **no del 4** (`Onia Web`, el widget de la web). Sin membresía, Chatwoot
  rechaza el POST del motor y el adapter marca "sent" igual → el fallo era **invisible**.
  Medido: inbox 4 = **3 entrantes / 0 salientes** en toda su historia, contra 25/43 del inbox 6.
  Fix: una fila en `inbox_members` (id 9). Verificado: el bot ahora postea con HTTP 200.
  Rollback: `delete from inbox_members where id=9;`
  ⚠️ **Esto es del carril `chatbot`, no de éste.** Se aplicó solo el fix mínimo y se paró.
  El resto quedó en una tarea aparte (ver campo 5).

**A MEDIAS — con el dónde exacto:**

- `reel-lanzamiento-20260822/final/lucia-lanzamiento.mp4` (v6, 22 s, master −14.33 LUFS):
  **renderizado, esperando el OK de Sergio.** Nada se publica sin eso.
- `posts-20260807/render-fijado/slide-01..07.png` — carrusel fijado renderizado, mismo estado.
- Soul `LUCIA-SINTETICA-v3` (`e6d8703c-…`): entrenado y **probado**. Ver campo 4: no ganó.
- **MCP de Postiz agregado** a la config del proyecto — aparece al reiniciar Claude Code.
- **Facebook en Postiz: cerrado como no-viable por API**, con salida elegida (cross-post
  nativo). No requiere más trabajo técnico, solo dos toques de Sergio en el celular.
- **8 HISTORIAS armadas y esperando OK** — `references/modelos/lucia/historias-20260823/final/`,
  1080x1920, **0 créditos** (todo el b-roll ya estaba generado y pagado en `tanda-20260821`).
  Las 5 primeras reciclan las señales de L6 para que la historia empuje al post.
  Motor nuevo: `.claude/skills/editor-videos/scripts/story-batch.mjs` — encadena
  `normalize-source` → `make-mockup` → `overlay-visuals`, con autochequeo.
  Hoja de contactos `_CONTACTO-HISTORIAS.png` + `_SAFE-CHECK.png` (zonas de IG marcadas).
- **L6 "5 señales" RENDERIZADO y esperando OK** — `posts-20260807/render-l6/`, 7 slides.
  **Costo 0 créditos**, no los ~4 estimados: todas las fotos del banco existente. Hoja de
  contactos en `_CONTACTO-L6.png`. Verificado MIRANDO las 7.
- **MCP de Postiz ACTIVO y probado** (paso 6 del handoff, cerrado): `integrationList` devuelve
  las 3 cuentas (@oniahq, Sergio, Lucía) y el schema de `instagram-standalone` confirma que
  **soporta `post_type: "story"`** — o sea que las historias se pueden programar por MCP sin SSH.
- **L5 "El negocio que atiende solo": capturas reales tomadas, pieza SIN montar.** Carpeta
  `references/modelos/lucia/l5-negocio-atiende-solo-20260823/`. Hay 13 capturas verificadas y
  6 scripts de Playwright reusables. Falta el montaje de 17 s — se frenó al detectar que el
  plano central (el bot contestando) dependía de otro carril.
- Limpieza de versiones viejas de Lucía en Higgsfield: **imposible por API** (el MCP lista y
  crea, no borra). Queda para la interfaz web; la lista de qué se va está en `LUCIA.md §14`.

## 3. Archivos y cambios

**Sistema y decisiones**
- `docs/ONIA_ARQUITECTURA_CUENTAS_Y_MODELOS.md` — 1 modelo, 3 personas, destino del tráfico,
  §7 Facebook, §8 receta para publicar recursos.
- `docs/ONIA_SISTEMA_MARKETING_LUCIA_ONIA.md` — la escalera + §10 moldes con cronómetro.
- `docs/ONIA_AUDITORIA_LUCIA_Y_PLAN_DIARIO.md` — la cuenta medida por API + §7 música de IG.
- `docs/handoffs/` — este sistema (README con el formato + este archivo).
- `CLAUDE.md` línea 97 — editada para apuntar al handoff.

**Lucía**
- `references/modelos/lucia/LUCIA.md` — §12 prompt por bloques, §13 guion multi-escena,
  §14 inventario de Higgsfield + veredicto del Soul.
- `references/modelos/lucia/PRODUCCION_MES_1.md` — las 8 piezas guionizadas.
- `references/modelos/lucia/reel-lanzamiento-20260822/` — el reel completo con sus scripts.
- `references/modelos/lucia/posts-20260807/render-fijado/` — el carrusel fijado.
- `hermes-content/recursos/humo/` — el PDF, su HTML fuente y los dos scripts que lo generan.

**Motor**
- `.claude/skills/editor-videos/scripts/karaoke-captions.mjs` — verde de marca, sin sombra,
  fuente 0.042, fix del color crudo.
- `.claude/skills/editor-videos/scripts/tts-elevenlabs.mjs` — sin `voice_settings` forzados.
- `.claude/skills/editor-videos/SKILL.md` — whip pan, `video_edit`, reparto de segundos.
- `references/marca-personal-sergio/` — foto de perfil, 3 fondos.

## 4. Intentos fallidos

*El campo que más vale: cada uno de estos costó tiempo y no hay que repetirlo.*

- **Voz de Lucía, rechazada dos veces.** Primero usé la voz element de Higgsfield, que Sergio
  había descartado el 25-jul — la memoria la titulaba "la voz de Lucía" e invitaba al error.
  Después, ya con la Marcela correcta, seguía sonando mal: la causa eran los `voice_settings`
  que el script forzaba (stability .45 / style .35). **La voz aprobada sale con los defaults.**
- **Narración en 4 llamadas separadas** → 4 prosodias pegadas. Va en UNA sola llamada.
- **Borde engrosado en la palabra activa del karaoke** (`\bord ×1.35`): a 81 px el trazo negro
  se come el glifo y sale un bloque negro. El énfasis va solo por color.
- **`toAssColor` con el hex como fallback**: devuelve el fallback SIN convertir, libass no lo
  entiende y pinta de negro. El default va como VALOR del flag.
- **Sombra en el karaoke** (`Shadow 2`): con outline grueso se lee como un segundo subtítulo
  fantasma detrás. Va en 0.
- **Apoyos visuales al 80% del ancho**: tapaban la pieza entera. Van a 52/46%, y el tercero
  pasó a ser la captura real de la web dentro de un marco de navegador.
- **Foto: convertir P3→sRGB.** Correcto en teoría, pero sube el rojo de 168 a 178 y empeora en
  visores sin gestión de color. Va: píxeles originales + perfil P3 original embebido.
- **Detección del logo por `r-g>45`**: 34.318 falsos positivos (toda la piel, que tiene matiz
  26). El logo es rojo puro, matiz <12 → 587 px exactos.
- **Máscara dura + erosión para el pelo**: destruye los mechones, que son píxeles
  semitransparentes. Va alpha matting + decontaminación de color.
- **`sfx.mjs` con rutas estilo Git Bash** (`/c/...`): no las resuelve. Rutas `C:\`.
- **Speaches en el VPS** se colgó tras el reinicio. Se instaló Whisper local; ya no dependemos
  del VPS para transcribir.
- **Soul `LUCIA-SINTETICA-v3` NO le gana al Element ancla.** Probado A/B con el mismo prompt:
  ignora el "mirando a cámara", atenúa las pecas y corre la estructura de la cara. Mejora al
  Soul viejo (sin piel roja, sin deuda de consentimiento) pero **queda de respaldo**.
  Confirma la regla: la identidad se sostiene en LA REFERENCIA, no en el entrenamiento.
- **Facebook en Postiz: el App Secret no era el problema.** Leído en
  `facebook.provider.js:184`, Postiz arma el OAuth **clásico** (`client_id` + `scope`); la app
  "OnIA Social API" tiene **Login for Business** (`config_id`), que ni muestra el campo de
  redirect URIs. Incompatibles. Cargar credenciales no habría servido.
- **Música de Instagram por API**: Postiz **sí** la soporta, pero exige
  `type === 'graph.facebook.com'` y nuestras cuentas usan `instagram-standalone`. Además nunca
  funciona en carruseles. Las piezas mudas con música se publican a mano.
- **Me salí del carril persiguiendo una captura.** L5 pedía "captura real del chatbot
  contestando". Al verificar MIRANDO, el bot no contestaba — y terminé diagnosticando Chatwoot,
  el motor y los webhooks, que son del carril `chatbot`. Lo cortó Sergio.
  **Regla que sale de acá: si una pieza de contenido necesita que OTRO carril funcione, eso es
  una dependencia cruzada — se anota y se elige otra pieza, no se arregla el otro carril.**
- **La "respuesta del bot" que filmé primero era un saludo estático.** El texto coincidía letra
  por letra con `inboxes.greeting_message` de la base: era una plantilla de Chatwoot
  (`message_type=3`), no el motor. Un segundo mensaje no recibió nada. **Para probar que un bot
  contesta hay que mandarle DOS mensajes**: el primero siempre lo contesta la plantilla.
- **`&locale=es` en la URL del widget NO traduce** el "We will be back as soon as possible".
  Ese string viene del embed de la landing, no de la URL ni de `accounts.locale`.
- **La API de Chatwoot no deja inyectar mensajes entrantes** en conversaciones de widget:
  `422 {"error":"Incoming messages are only allowed in Api inboxes"}`. Para probar el widget
  hay que usar el widget — y tiene rate limit por IP ("Retry later") tras pocas pruebas.
- **`elementsFromPoint` no ve pseudo-elementos.** Diagnosticando el bloque verde del hero,
  ningún elemento del DOM tenía ese color: lo pinta un `::before`/`::after`.
- **Copiar un PDF al contenedor NO alcanza.** Next cachea el índice de `public/` al arrancar:
  medido al segundo (contenedor 01:31, PDF que funciona 01:23, PDF nuevo 02:55). Descartados
  permisos (`chown`) y caché de Cloudflare (`cf-cache-status: BYPASS`). Hay que reiniciar.

## 5. Próximos pasos

1. **OK de Sergio al reel** → publicar el lanzamiento y disparar el calendario 23-30 ago.
2. Piezas que faltan del mes 1: **L6** (carrusel "5 señales", ~4 cr — **necesita permiso de
   gasto**) y **L5** (demo de producto, 0 cr). Después L3, L4, L7, L8.
   ⚠️ **L5 está bloqueada por dependencia cruzada**: su plano central es el bot contestando, y
   eso lo cierra el carril `chatbot` (tarea aparte, ver abajo). Las capturas y los scripts ya
   están hechos; falta el montaje cuando el bot esté verificado punta a punta.
3. Palabra clave en 5 de los 8 posts en cola de @oniahq + horario 19:00 → 20:00 Bolivia.
   *(Propuesto y sin respuesta explícita — no se tocó nada.)*
4. Historias: **motor hecho y primera tanda de 8 armada**. Falta el OK y programarlas — el MCP
   de Postiz ya acepta `post_type: story`, así que se programan sin SSH y sin cron propio.
5. Limpiar versiones viejas de Lucía en Higgsfield, por la interfaz web.
6. Cuando el MCP de Postiz esté activo (tras reiniciar), programar directo sin SSH.

**Levantado fuera de este carril (tareas propias, NO tocar desde acá):**
- 🔴 **Cerrar el bot público de onia.com.bo** — carril `chatbot`. Falta verificación punta a
  punta MIRANDO, el "Estamos ausentes" en inglés, el conocimiento por rubro que no se usa,
  el motor corriendo desde `/tmp` y en bucle de reinicio, y la limpieza de conversaciones QA.
- 🟡 **Bloque verde tapando el hero de `onia.com.bo`** — carril web-factory. Un pseudo-elemento
  de `.sitio_shape` pinta un rect verde sobre el 40% de la captura del dashboard. El asset
  `/v2/capturas/panel.webp` está perfecto (200, 152 KB, se ve completo): no es la imagen.

## 6. Qué depende de Sergio

- 🔴 **OK al reel** — es lo único que bloquea todo el calendario de Lucía.
- 🔴 **Confirmar que dejo puesto el fix del bot** (fila `inbox_members` id 9). Lo dejé puesto
  porque revertirlo vuelve a dejar mudo el chat de la web. Si preferís revertirlo:
  `delete from inbox_members where id=9;`
- 🟡 **Permiso de gasto para L6**: ~4 créditos de Higgsfield (fotos ya existentes).
- 🔴 **Rotar el token de Postiz**: se pegó en el chat y quedó en el transcript. Da acceso
  completo a la API.
- 🟡 **Tarjeta en ONIA Ads** — bloqueo de amplificación desde hace días.
- 🟡 **Dos toques en el celular**: activar *Compartir en otras apps → Facebook* en @oniahq, y
  poner el link en la bio de Lucía (hoy dice 👇 y no apunta a nada).
- 🟡 **Calentar la cuenta de Lucía**: seguir 50-70 cuentas del nicho.
- 🟡 Conectar **TikTok de Lucía** en Postiz.
- ⚪ Precio del curso (fase 3, sin apuro).
