# Cola — marketing de ONIA (Lucía, @oniahq, marca personal)

> **Alcance ampliado (Sergio, 2026-08-31):** *"aquí manejaremos higgsfield, o sea el marketing de la
> empresa, onia, cuenta personal y lucia"*. Esta sesión es el carril de marketing de las **tres**
> cuentas, no sólo el de Lucía.

> **Objetivo único (Sergio, 2026-08-30):** pasar de **0 posts a un feed vivo publicando lo que
> YA existe**. No se produce nada nuevo hasta que haya algo publicado.
>
> ✅ **El cero se rompió el 31-ago**: Sergio publicó el post fijado de Lucía. La cláusula «no se
> produce nada nuevo» queda cumplida y levantada — el 31-ago pidió *«segui produciendo y
> aprendiendo»*.
>
> **Hecho =** se abre el perfil de Instagram y se ven los posts. No es un commit, no es un
> render, no es un doc. Es una pantalla que un desconocido puede ver.

**La regla de esta cola** (Sergio, 2026-08-30): *nada entra a «Ahora» sin evidencia de que
existe.* En otra sesión, **4 de 6 pendientes resultaron fantasma**. Acá cada ítem nombra una
ruta real entre backticks, y `node scripts/verificar_cola.js hermes-content/docs/cola/contenido.md`
falla si esa ruta no está.

> ⚠️ **Reconciliada el 31-ago.** Esta cola vivió dividida en dos ramas
> (`claude/ads-creatividades-publicos` y `claude/carril-contenido`) y cada una midió cosas que la
> otra no. Se fusionaron quedándose con la afirmación **medida** más nueva de cada ítem: de ahí
> salió que el día 0 estaba abierto en una rama y publicado en la otra, y que la bio de Lucía
> figuraba a la vez como pendiente y como verificada. Una sola cola desde acá.

---

## El estado real, medido el 2026-08-30

**No falta producción.** De las 25 piezas de carrusel de las tres cuentas, **las 25 tienen su
render en disco**, y las láminas del render coinciden una a una con los slides del brief. Cero
faltantes. Lo que falta es **publicar**.

| Cuenta | Listo y verificado | Publicado |
|---|---|---|
| Lucía | 6 carruseles (42 láminas 1080×1350) + 12 historias + reel v7 | **1** (día 0, fijado) |
| @oniahq | 9–10 carruseles + 2 reels | — |
| Marca personal Sergio | 6–8 carruseles | — |

**Verificado el 31-ago:** las SEIS piezas del calendario tienen caption escrito (153 a 1.268
caracteres). El hueco del día 1 era específico del reel, que no tiene brief JSON, y ya se llenó.

---

## Ahora

- [ ] ✅ **DESBLOQUEADO — publicar el día 1** (reel de lanzamiento v7): `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`. Caption listo para copiar en `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/CAPTION.md` (sale del guion real, `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/TABLA-DE-CORTES.md`: abre con «No soy real» como el primer beat y cierra con «Seguime»); el mismo texto y los pasos previos están en `hermes-content/contenido/PUBLICAR.md` § Paso 2. **No lleva palabra clave ni link**: no depende de n8n ni de Postiz. **El reel se MIRÓ el 31-ago** (hoja de contacto de los 22 s + medición): 1080×1920 a 30 fps, 22,07 s, audio real (−17,7 dB medio / −1,6 dB pico, no un mudo con LUFS escrito en un doc), subtítulos quemados que coinciden con el caption; las dos «caras rotas» de la miniatura son disolvencias de ~0,7 s, no defectos. Nada que re-renderizar. **Lo que faltaba era la portada** — Instagram la pide y por defecto agarra el peor frame (Lucía de espaldas): elegida y extraída el 31-ago en `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/portada-v7.jpg` (seg. 21, cara centrada a cámara). Ojo con la carpeta: ahí conviven v6 y v7 · 10 min · Sergio
- [ ] 🔴 **Decidir si la marca personal usa el verde de Onia o un acento propio.** Aplica a las OCHO piezas del carril, no sólo a S06, y hasta entonces no se publica ninguna. Las dos S06 son idénticas salvo el color de acento —naranja contra el verde de Onia— y las 19 láminas están trackeadas: no hay versión superada que descartar, y el renderer no define acento por cuenta, así que la pregunta es de marca. Ver `hermes-content/references/marca-personal-sergio/_CUAL-S06-SE-SUBE.md` · Sergio
- [x] 🎉 **PUBLICADO — Sergio, 31-ago.** El feed dejó de estar en cero. Era el día 0 (post fijado) A MANO desde el teléfono, porque Postiz da 502. Son las 7 láminas de `hermes-content/references/modelos/lucia/posts-20260807/FIJADO` con el caption de `hermes-content/references/modelos/lucia/posts-20260807/FIJADO/CAPTION.md`. Lo reporta él; desde acá no veo su Instagram, así que es su verificación, no la mía · Sergio
- [x] **Etiqueta de IA declarada — Sergio, 31-ago.** Era el último requisito de los días 0 y 1, y lo que bloqueaba el día 0: la lámina 3 del fijado **afirma** *«Yo nací declarada: etiqueta de IA activada desde el primer post»*, así que publicar con el switch apagado dejaba esa frase mintiendo, fijada al perfil. Lo reporta Sergio sobre su propia cuenta. Quedaron escritas las dos rutas que se investigaron y siguen valiendo para las piezas que vienen: la etiqueta de **perfil** (*Creador de IA*, salió en mayo-2026 como prueba y no está en todas las cuentas) y la de **publicación** (*Información de IA*, en Configuración avanzada al subir) — cuando están las dos, Instagram muestra la del post. En `hermes-content/contenido/PUBLICAR.md` § Paso 0-ter, con fuentes · Sergio
- [x] Elegir cuál render se sube en las 3 piezas con DOS versiones: **gana el lote verde del 28-ago** — `hermes-content/references/modelos/lucia/posts-20260807/FIJADO`, `L6` y `L08`. Las dos sesiones llegaron a lo mismo por separado, mirando la portada: la del 28-ago usa sans pesada con bloque de resaltado y «DESLIZÁ →», la del 22-ago serif itálica fina — el tratamiento que Sergio objetó con «se ve muy pequeño el texto». Las superadas llevan adentro un marcador NO-SUBIR, p.ej. `hermes-content/references/modelos/lucia/posts-20260807/render-fijado/_NO-SUBIR.md`, y los punteros del handoff quedaron corregidos (apuntaban todos al viejo). Tabla por día en `hermes-content/docs/handoffs/claude-ads-creatividades-publicos.md` § 1-sexies · 31-ago
- [x] **Marca personal → comunidad.** STACK pasa de `pdf` sin URL al link de la comunidad y los 8 placeholders quedaron reemplazados en `hermes-content/docs/ONIA_SERGIO_DM_PALABRAS.md`. S05 y S06 ya prometen la comunidad y no «la lista con los links»; el gate dejó de marcar `promesa-distinta` y queda sólo `palabra-apagada`, que es de Sergio (cargar STACK en el mapa de n8n, 30 s). Ver `scripts/recompensas.json` y `hermes-content/references/marca-personal-sergio/briefs/S06-equipo-que-no-cobra.json` · 31-ago
- [x] **Re-renderizados 31-ago con `@oniahq`**, verificado MIRANDO el JPG. La decisión no fue por HTTP: Instagram devuelve 200 hasta para un handle inventado (se probó uno de control, «onia punto hq», que no existe y respondió igual). Se decidió por el repo — @oniahq en 65 archivos contra @oniaagency en 4, todos de jul-ago — y porque el renderer vigente ya lo estampa. Ver `hermes-content/carousels/out/ads/ad-a2-v1-no-volvieron/slide-01.jpg` · Claude
- [x] **Carril de briefs viejos marcado MUERTO 31-ago.** No se le sacan los CTA: se declara que de ahí no se publica y se apunta al carril vivo (`hermes-content/references/oniahq/briefs`, 10 briefs limpios). El lote destapó CINCO pares de piezas duplicadas exactas y dos defectos estructurales: el trigger guarda la frase «Comentá SISTEMA» en vez de la palabra, y AUTO y NUVIA piden comentarios sin estar registradas. Ver `hermes-content/carousels/briefs/LEEME.md` · Claude

## Despues

- [ ] 🔴 **Resolver la descarga desde Higgsfield antes de generar nada más.** Hay una imagen pagada (2 cr) que existe en la cuenta y no está en el repo: los cuatro caminos de descarga fallan hoy. Generar sin poder bajar es gastar créditos para nada. Los cuatro fallos y las cuatro ideas sin probar están en `hermes-content/references/modelos/lucia/TECNICA-HIGGSFIELD.md`
- [ ] 🔴 Los 3 creativos de ads dicen **«SWIPE →»** y tienen UNA sola lámina. Un anuncio que invita a deslizar y no tiene a dónde. O se le sacan el swipe y el punto indicador, o se le renderizan las láminas que promete. Descubierto mirando el JPG, no leyendo el brief. Ver `hermes-content/carousels/briefs/ads/ad-a2-v1-no-volvieron.json`
- [ ] 🔴 MITO es una palabra fantasma: `hermes-content/carousels/briefs/onia-mitos-ia-20260808.json` pide «comenta MITO» en el caption y MITO no está en `scripts/recompensas.json`. Si esa pieza sale, el lead comenta y no recibe nada — es exacto el incidente RANKING del 26-ago. Registrarla o sacarle el CTA.
- [ ] Días 2 a 6 del calendario, uno por día: L09 → L6 → L10 → L08 → L11. El orden vive en el handoff del carril. **Al subir cada carrusel el orden lo fija el toque, no el nombre del archivo**: los PNG llegan juntos por Telegram y la galería muestra lo más nuevo primero, así que tocarlos «como aparecen» deja la pieza al revés. La comprobación de 10 segundos y el arreglo están en `hermes-content/contenido/PUBLICAR.md` § Paso 1-quater — desde el **24-mar-2026** Instagram deja reordenar un carrusel **ya publicado** (··· → Editar → mantener presionado → arrastrar) conservando likes y comentarios, así que un orden equivocado dejó de ser motivo para borrar y volver a subir.
  🟢 **El día 2 (L09) quedó verificado MIRÁNDOLO el 31-ago**, con la hoja de contacto que antes no existía: `hermes-content/references/modelos/lucia/posts-20260807/L09/_HOJA-DE-CONTACTO.jpg`. Las 7 láminas están, todas a 1080×1350, todas del lote verde, y la secuencia cierra: 01 gancho *«esta cara no existe»* → 02 paso 1 → 03 el error → 04 el arreglo → 05 la voz → 06 lo que se me nota → 07 Onia. **Y se comprobó la única afirmación que la pieza hace sobre su propia imagen**: la lámina 6 dice que en la pizarra del café *«Café con Leche» está bien escrito y dos renglones más abajo dice «marnago» y «horchimos», que no son palabras* — se hizo zoom al `slide-06.png` y la pizarra dice exactamente eso. Importa porque es la pieza que enseña a detectar imágenes de IA: si el detalle que manda a mirar no estuviera ahí, el carrusel enseñaría a desconfiar con un ejemplo falso, en la cuenta que promete no esconder nada. Detalle menor sin arreglo: el badge *GUARDÁ ESTO* tapa la M de «Medialunas», no la línea que se cita.
  🟢 **El día 3 (L6) quedó verificado MIRÁNDOLO el 31-ago**, con la hoja de contacto que antes no existía: `hermes-content/references/modelos/lucia/posts-20260807/L6/_HOJA-DE-CONTACTO.jpg`. Las 7 láminas a 1080×1350 (medido con ffprobe, no contado), todas del lote verde del 28-ago, y la secuencia cierra: 01 gancho *«5 señales de que no te falta gente»* → 02-06 las señales 1 a 5 → 07 *«ninguna se arregla con más esfuerzo»* + botón *Comentá SISTEMA*. **Y se comprobó la afirmación que la pieza hace sobre sí misma**: la lámina 1 promete CINCO señales y hay exactamente cinco, rotuladas SEÑAL 1 … SEÑAL 5, sin hueco ni repetida. Importa porque es la primera pieza que pide algo por comentario: un carrusel que promete 5 y entrega 4 pide la palabra después de haberse contradicho a la vista. La promesa de la lámina 7 (*«te paso el mapa de tu negocio»*) coincide con lo que SISTEMA entrega, verificado contra el workflow vivo.
- [ ] Las piezas de los días 5 y 6 (`hermes-content/references/modelos/lucia/posts-20260807/L08`, `hermes-content/references/modelos/lucia/posts-20260807/render-l11`) **siguen sin hoja de contacto** — nadie las miró enteras todavía. Una por vuelta, mismo método que L09.
- [ ] Las 4 historias H09-H12 no tienen hoja de contacto; las otras 8 sí.
- [ ] Cargar FACTURA en el mapa de palabras del workflow de n8n (bloque escrito, sin aplicar).
- [ ] Escribir el **texto alternativo** de las piezas que vienen. La tabla del kit traía una columna *alt text* que no era texto alternativo: eran los titulares recortados y sin acentos (*«Lucia es real?»*), que repiten lo que ya está en la lámina y **no describen nada** a quien no ve la imagen. Para el fijado ya se reescribieron las 7 descripciones reales, todas de menos de 100 caracteres (medido) para que el campo no las corte, y quedó dicho en qué pantalla se escriben — las dos rutas están en `hermes-content/contenido/PUBLICAR.md` § Paso 1-ter. Importa en esta cuenta más que en otra: si no se escribe, **Instagram igual pone uno generado por su propia IA**, y la cuenta que promete no esconder que es IA quedaría descrita por una IA ajena, y mal. **No bloquea publicar**: se puede poner después.
- [ ] Terminar la tanda del look nuevo (8 imágenes, Bs 6,00) — decidido en `LUCIA.md` §3-ter.
- [x] Corregir el calendario: la fila 6 decía «🔴 FALTA» para pilar B y **L11 ya existe** renderizada. Hecho el 31-ago en `hermes-content/docs/handoffs/claude-ads-creatividades-publicos.md`: la fila 6 ahora dice L11 con su ruta, y el bloque «no hay pieza B» quedó tachado con las tres evidencias. Importa porque ese bloque mandaba a **producir** un carrusel B nuevo con G02/G03/G04 — trabajo fabricado sobre una pieza que ya está en `hermes-content/references/modelos/lucia/posts-20260807/render-l11/` (7 láminas, verde). Feed real: 2 A + 3 C + 1 B · 31-ago
- [x] **Verificado el 31-ago: qué hace el bot cuando comenten.** Se leyó el workflow `1jS4jwmNmvcQpqqH` (activo) nodo por nodo. **Escucha CUALQUIER comentario de la cuenta: no existe filtro de post ni de media** — el único gate es la palabra *dentro del texto del comentario*, no la pieza. Para Lucía (entra por la rama `DESCONOCIDA`, su `entry_id` sigue sin mapear) las palabras vivas son **SISTEMA** y **HUMO**, y el match es `texto.toUpperCase().includes(...)` — **subcadena, no palabra entera**: un comentario espontáneo con «sistema» adentro dispara el DM. No bloqueaba el día 0: el DM que sale es el de SISTEMA de Lucía (on-brand, `?src=lucia-ig-sistema` 200), hay freno de 24 h por persona y aviso a Sergio por Telegram en cada disparo. Silencio total = vaciar `palabras` de `DESCONOCIDA` y reponerlas **antes del día 3 (L6)** — es tocar n8n en vivo, carril infra: queda como opción de Sergio, 1 min. ⚠️ **Corregido el 31-ago: decía «antes del día 4», y es un día tarde.** El orden es L09 → L6 → L10 → L08 → L11, o sea **L6 es el día 3**, y L6 es justo la pieza que pide comentario: su lámina 7 cierra con *«Comentá SISTEMA»*. Reponer un día tarde dejaba un CTA muerto en el feed, sin error que lo delate. Arreglado en `hermes-content/contenido/PUBLICAR.md` § Lo que NO se hace todavía · 31-ago

## Bloqueado

- **El PDF de SISTEMA queda DESCARTADO** (Sergio, 31-ago). No se publica ningún PDF: la recompensa pasa a ser un link. Eso desactiva de paso el bloqueo de los días 3 y 4.
- 🔴 **META ADS — el conector apunta a la identidad equivocada.** Esta sesión ve DOS cuentas publicitarias y **ninguna es de ONIA** — `NUVO 1usd` (negocio ajeno) y `Arthur Fuentes` (personal, de alguien que ya no colabora). La cuenta de ONIA responde «no tenés acceso». Es el bloqueo raíz: sin eso no se puede ni leer el estado · Sergio
- 🔴 **Reloj al 5-sep:** el `stop_time` de la campaña y el token de usuario vencen **el mismo día**.
- **Postiz da 502** y no hay `POSTIZ_API_KEY` en el `.env`. Mientras siga caído, **todo se publica a mano.** No es un bloqueo para empezar: es un bloqueo para automatizar.
- **@sergio_urcullo se publica a mano siempre**, tenga o no Postiz: tiene dos avisos de automatización de Meta. El blindaje está en `scripts/postiz_schedule.mjs`.

## Fantasmas — declarados hechos, verificados como falsos

Se dejan escritos para que nadie los vuelva a poner en «Ahora».

- 🔴 **Los 49 PNG renderizados «a salvo en el repo»** — `git ls-files … | grep -c '.png$'` daba **0**. **Resuelto el 30-ago**: 74 láminas respaldadas como JPG y commiteadas.
- 🔴 **«SISTEMA entrega un PDF que da 404»** — el 404 es real, la conclusión no: **el circuito vivo nunca manda ese PDF**. Verificado el 31-ago leyendo el mapa de palabras del workflow `1jS4jwmNmvcQpqqH` (activo) y probando las CUATRO URLs que sí manda: `/?src=onia-ig-sistema` **200**, `/?src=lucia-ig-sistema` **200**, `/recursos/lista-por-donde-empezar.pdf` **200** (258 KB), `/recursos/5-herramientas-ia-bolivia.pdf` **200** (306 KB). SISTEMA entrega «el mapa de tu negocio» — lo mismo que prometen L6 y L10. Publicar ese PDF **no desbloquea nada**. Lo resucitaba `ONIA_DM_POR_PALABRA.md`, que guardaba el texto viejo del DM con un cartel rojo; corregido el 31-ago contra el workflow vivo.
- 🔴 **«@oniahq: cola llena hasta 09-sep»** — Postiz da 502. Esa cola no está publicando nada.
- 🔴 **Los reels RL01 y RL02 «terminados»** — sólo hay `_PREVIEW-360p.mp4` a 360×640. No existe el render final.
- 🔴 **«El OK de Sergio para publicar ya está dado»** — el doc más nuevo lo desmiente.
- 🔴 **«El circuito comentario→DM funciona para las cuatro piezas»** — son **tres** (la cuarta era L07, archivada), y de las palabras sólo **HUMO** verifica de punta a punta (PDF 200, 306.319 B).
- 🔴 **«@oniahq tiene 25 seguidores»** — sin medición detrás. El único número medido es 22, del 16-ago.
- ✅ **«Etiqueta de IA declarada»** — era fantasma hasta el 31-ago: se declaraba hecha siendo una instrucción pendiente. **Ya no lo es**: Sergio la activó ese día. Se deja escrito porque el patrón —dar por hecha una acción que sólo se puede hacer desde el teléfono— se repite.
- 🟢 **Al revés: «la bio de Lucía no tiene enlace» / «dice 👇 y no apunta a nada»** — el fantasma también va para este lado. El kit mandaba a agregarlo y nadie había abierto el perfil: el enlace `https://onia.com.bo/?src=lucia-bio` ya estaba puesto (verificado el 31-ago con el perfil deslogueado; `bio_links[0]`, link_id 18103663877269545), y la bio también. Un pendiente inventado también cuesta — le manda a Sergio trabajo que no existía, y peor: le hace dudar de lo que SÍ está bien.

---

## Cómo se trabaja esta cola

**Loop de fondo** (cron `5d8f50a4`, :13 y :43): una vuelta chica, **un solo ítem**, evidencia
real, commit con rutas explícitas. Los loops anteriores murieron por pedir «una tarea completa»
por vuelta — tarea grande, turno largo, y el cron siguiente nunca dispara porque sólo corre con
el REPL ocioso. **El turno corto ES el mecanismo.**

**Una sola cola, una sola rama.** Esta cola vivió partida en dos ramas y cada mitad midió cosas
que la otra ignoraba: el día 0 figuraba publicado en una y pendiente en la otra. Antes de trabajar
un ítem: `git rev-list --left-right --count` entre las ramas del carril, y si divergen, reconciliar
es el único ítem de la vuelta.

**Abanico cuando Sergio está**: subagentes en paralelo, para lotes probados e independientes.

**Lo que el loop persigue además de la cola** (Sergio, 31-ago): *"perfecciones tu técnica en
higgsfield y ver de postear en meta ads para agarrar público"*. Cada vuelta que sobre tiempo va a
una de esas dos, y lo aprendido se escribe en
`hermes-content/references/modelos/lucia/TECNICA-HIGGSFIELD.md` — no en un doc nuevo al lado.
