# Cola — carril contenido (Lucía, @oniahq, marca personal)

> **Objetivo único (Sergio, 2026-08-30):** pasar de **0 posts a un feed vivo publicando lo que
> YA existe**. No se produce nada nuevo hasta que haya algo publicado.
>
> **Hecho =** se abre el perfil de Instagram y se ven los posts. No es un commit, no es un
> render, no es un doc. Es una pantalla que un desconocido puede ver.

**La regla de esta cola** (Sergio, 2026-08-30): *nada entra a «Ahora» sin evidencia de que
existe.* En otra sesión, **4 de 6 pendientes resultaron fantasma**. Acá cada ítem nombra una
ruta real entre backticks, y `node scripts/verificar_cola.js hermes-content/docs/cola/contenido.md`
falla si esa ruta no está.

---

## El estado real, medido el 2026-08-30

**No falta producción.** De las 25 piezas de carrusel de las tres cuentas, **las 25 tienen su
render en disco**, y las láminas del render coinciden una a una con los slides del brief. Cero
faltantes. Lo que falta es **publicar**.

| Cuenta | Listo y verificado | Publicado |
|---|---|---|
| Lucía | 6 carruseles (42 láminas 1080×1350) + 12 historias + reel v7 | **0** |
| @oniahq | 9–10 carruseles + 2 reels | — |
| Marca personal Sergio | 6–8 carruseles | — |

---

## Ahora

- [x] Elegir cuál render se sube en las 3 piezas con DOS versiones: **gana el lote verde del 28-ago**. Se sube `hermes-content/references/modelos/lucia/posts-20260807/FIJADO`, `L6` y `L08`; las tres carpetas superadas llevan adentro un marcador NO-SUBIR, p.ej. `hermes-content/references/modelos/lucia/posts-20260807/render-fijado/_NO-SUBIR.md` y los punteros del handoff quedaron corregidos (apuntaban todos al viejo). Razón y tabla por día en `hermes-content/docs/handoffs/claude-ads-creatividades-publicos.md` § 1-sexies · 31-ago
- [ ] Declarar la etiqueta de IA en la cuenta antes del primer post — sigue siendo una instrucción pendiente, no una verificación. **Pasos exactos y cómo se comprueba** (se ve el rótulo en el perfil, no basta tocar el switch): `hermes-content/contenido/PUBLICAR.md` § Paso 0. 🔴 **Corregido el 31-ago: este paso BLOQUEA el día 0.** El kit decía "no bloquea, anotalo y seguí", y era falso — se miraron las 7 láminas de `hermes-content/references/modelos/lucia/posts-20260807/FIJADO` y la **lámina 3 afirma** *"Yo nací declarada: etiqueta de IA activada desde el primer post"*. Publicar con el switch apagado deja esa frase mintiendo, fijada al perfil, justo sobre lo que la cuenta promete no esconder. 🟢 **Y se achicó el 31-ago: el enlace de la bio YA ESTÁ.** El kit mandaba a agregarlo «en la misma pantalla» porque suponía el campo *Enlaces* vacío; nadie había mirado el perfil. Se abrió el perfil de Instagram deslogueado y está puesto: onia.com.bo/?src=lucia-bio (bio_links[0], link_id 18103663877269545), y la bio también. Medido en la misma pasada: **0 publicaciones**, 1 seguidor, 2 seguidos, y `account_badges` **vacío** — o sea que la etiqueta de IA sigue sin poner, y es lo único que falta tocar. Tabla del estado del perfil en `hermes-content/contenido/PUBLICAR.md` § Estado del perfil. 🟢 **Y dejó de ser un callejón el 31-ago: si el switch NO existe en esa versión de la app, ya hay plan B listo** en `hermes-content/contenido/PUBLICAR.md` § Paso 1-bis — se sube el carrusel de **6 láminas** salteando `slide-03`, sin re-renderizar nada. El kit ofrecía "se cambia la lámina 3, se re-renderiza" (horas, justo en el minuto de publicar) y un "carrusel de 6" que no existía en ningún lado: no había tabla, ni orden, ni alt text, y nadie había comprobado si la pieza sobrevive sin esa lámina. Se comprobó mirando las 7 en `hermes-content/references/modelos/lucia/posts-20260807/FIJADO/_HOJA-DE-CONTACTO.jpg`: la lámina 3 es la **única** que afirma que la etiqueta está activada, la declaración "soy IA" queda dicha igual en las láminas 1 y 2, la cadena de rótulos no deja hueco. **Y el caption del Plan B NO es el mismo:** el del Paso 1 promete tres cosas — *"quién me hace, por qué no lo escondo, y qué vas a ver acá"* — y ese beat del medio ES la lámina 3, la única con el rótulo *POR QUÉ DECLARADA*. Sin ella el caption enumeraba algo que el carrusel ya no entrega, justo en la pieza cuya promesa es no esconder nada; el Paso 1-bis trae el caption corregido, listo para copiar. 🟢 **Y se le agregó una ruta el 31-ago: la etiqueta por PUBLICACIÓN.** El kit tenía una sola etiqueta (la de perfil, el switch de Editar perfil) y de ahí saltaba al Plan B — perder una lámina. Instagram tiene dos: *Creador de IA* (perfil) e **Información de IA** (post por post, en Configuración avanzada de la pantalla de subir, ex "Hecho con IA"). La segunda deja la lámina 3 diciendo la verdad — *"etiqueta de IA activada desde el primer post"* — **con las 7 láminas puestas**, y cuando las dos están, Instagram muestra la del post en vez de la del perfil. Importa porque la etiqueta de perfil salió en **mayo de 2026 como prueba** y no está para todos: el Plan B podía ser el caso normal, no el raro. Escrito en `hermes-content/contenido/PUBLICAR.md` § Paso 0-ter, con fuentes. **No verificado en el teléfono** — se comprueba mirando el rótulo bajo el usuario del post publicado. Orden nuevo: switch de perfil → etiqueta del post → recién ahí Plan B · **2 min** (era 6) · Sergio
- [ ] Publicar el día 0 (post fijado) A MANO desde el teléfono. **Depende del ítem de arriba** (etiqueta puesta y visible). Las 7 láminas se MIRARON el 31-ago con hoja de contacto: orden y contenido coinciden uno a uno con la tabla del kit, las 7 a 1080×1350. **Todo el kit — orden de las 7 láminas, caption, hashtags y alt text — está en `hermes-content/contenido/PUBLICAR.md` § Paso 1**; no hay que volver a abrir el JSON del brief. Son las 7 láminas de `hermes-content/references/modelos/lucia/posts-20260807/FIJADO` (NO la carpeta `hermes-content/references/modelos/lucia/posts-20260807/render-fijado`, que quedó superada) · 15 min · Sergio
- [ ] Publicar el día 1 (reel de lanzamiento v7): `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`. **El caption faltaba y se escribió el 31-ago**: `hermes-content/contenido/PUBLICAR.md` § Paso 2, que además avisa que en esa carpeta conviven v6 y v7. **El reel se MIRÓ el 31-ago** (hoja de contacto de los 22 s + medición): 1080×1920 a 30 fps, 22,07 s, audio real (−17,7 dB medio / −1,6 dB pico, no un mudo con LUFS escrito en un doc), subtítulos quemados coinciden con el caption; las dos "caras rotas" que se ven en miniatura son disolvencias de ~0,7 s, no defectos. Nada que re-renderizar. **Lo que sí faltaba: la portada** — Instagram la pide y por defecto agarra el peor frame (Lucía de espaldas). Elegida y extraída el 31-ago: `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/portada-v7.jpg` (seg. 21, cara centrada a cámara). Paso escrito en `hermes-content/contenido/PUBLICAR.md` § Paso 2 y agregada al viaje de archivos del Paso 0.5 · 10 min · Sergio

## Despues

- [ ] Días 2 a 6 del calendario, uno por día: L09 → L6 → L10 → L08 → L11. El orden vive en el handoff del carril.
- [x] Corregir el calendario: la fila 6 decía «🔴 FALTA» para pilar B y **L11 ya existe** renderizada. Hecho el 31-ago en `hermes-content/docs/handoffs/claude-ads-creatividades-publicos.md`: la fila 6 ahora dice L11 con su ruta, y el bloque «no hay pieza B» quedó tachado con las tres evidencias. Importa porque ese bloque mandaba a **producir** un carrusel B nuevo con G02/G03/G04 — trabajo fabricado sobre una pieza que ya está en `hermes-content/references/modelos/lucia/posts-20260807/render-l11/` (7 láminas, verde). Feed real: 2 A + 3 C + 1 B · 31-ago
- [ ] Las 4 historias H09-H12 no tienen hoja de contacto; las otras 8 sí.
- [x] **Verificado el 31-ago: qué hace el bot cuando comenten el post fijado.** Se leyó el workflow `1jS4jwmNmvcQpqqH` (activo) nodo por nodo. **Escucha CUALQUIER comentario de la cuenta: no existe filtro de post ni de media** — el único gate es la palabra *dentro del texto del comentario*, no la pieza. Para Lucía (entra por la rama `DESCONOCIDA`, su `entry_id` sigue sin mapear) las palabras vivas son **SISTEMA** y **HUMO**, y el match es `texto.toUpperCase().includes(...)` — **subcadena, no palabra entera**: un comentario espontáneo con la palabra «sistema» adentro dispara el DM, y la lámina 6 pide comentarios abiertos. **No bloquea el día 0**: el DM que sale es el de SISTEMA de Lucía (on-brand, `?src=lucia-ig-sistema` 200), hay freno de 24 h por persona y aviso a Sergio por Telegram en cada disparo. El riesgo real era el otro: que un DM del día 0 se leyera como bug. Escrito en `hermes-content/contenido/PUBLICAR.md` § Lo que NO se hace todavía, que decía lo contrario. Silencio total el día 0 = vaciar `palabras` de `DESCONOCIDA` y reponerlas antes del día 4 (L6) — es tocar n8n en vivo, carril infra: queda como opción de Sergio, 1 min · 31-ago
- [ ] Cargar FACTURA en el mapa de palabras del workflow de n8n (bloque escrito, sin aplicar).
- [ ] Terminar la tanda del look nuevo (8 imágenes, Bs 6,00) — decidido en `LUCIA.md` §3-ter, **después** de publicar.

## Bloqueado

- **Postiz da 502** y no hay `POSTIZ_API_KEY` en el `.env`. Mientras siga caído, **todo se publica a mano.** No es un bloqueo para empezar: es un bloqueo para automatizar.
- **@sergio_urcullo se publica a mano siempre**, tenga o no Postiz: tiene dos avisos de automatización de Meta. El blindaje está en `scripts/postiz_schedule.mjs`.

## Fantasmas — declarados hechos, verificados como falsos

Se dejan escritos para que nadie los vuelva a poner en «Ahora».

- 🔴 **Los 49 PNG renderizados «a salvo en el repo»** — `git ls-files … | grep -c '.png$'` daba **0**. **Resuelto el 30-ago**: 74 láminas respaldadas como JPG y commiteadas.
- 🔴 **«SISTEMA entrega un PDF que da 404»** — el 404 es real, la conclusión no: **el circuito vivo nunca manda ese PDF**. Verificado el 31-ago leyendo el mapa de palabras del workflow `1jS4jwmNmvcQpqqH` (activo) y probando las CUATRO URLs que sí manda: `/?src=onia-ig-sistema` **200**, `/?src=lucia-ig-sistema` **200**, `/recursos/lista-por-donde-empezar.pdf` **200** (258 KB), `/recursos/5-herramientas-ia-bolivia.pdf` **200** (306 KB). SISTEMA entrega «el mapa de tu negocio» — lo mismo que prometen L6 y L10, revisados uno por uno. Publicar ese PDF **no desbloquea nada**. Lo resucitaba `ONIA_DM_POR_PALABRA.md`, que guardaba el texto viejo del DM con un cartel rojo; corregido el 31-ago contra el workflow vivo.
- 🔴 **«@oniahq: cola llena hasta 09-sep»** — Postiz da 502. Esa cola no está publicando nada.
- 🔴 **Los reels RL01 y RL02 «terminados»** — sólo hay `_PREVIEW-360p.mp4` a 360×640. No existe el render final.
- 🔴 **«El OK de Sergio para publicar ya está dado»** — el doc más nuevo lo desmiente.
- 🔴 **«El circuito comentario→DM funciona para las cuatro piezas»** — son **tres** (la cuarta era L07, archivada), y de las palabras sólo **HUMO** verifica de punta a punta (PDF 200, 306.319 B).
- 🔴 **«@oniahq tiene 25 seguidores»** — sin medición detrás. El único número medido es 22, del 16-ago.
- 🔴 **«Etiqueta de IA declarada»** — es una instrucción pendiente, no una verificación.
- 🟢 **Al revés: «la bio de Lucía no tiene enlace»** — el fantasma también va para este lado. El kit mandaba a agregarlo y nadie había abierto el perfil: el enlace `https://onia.com.bo/?src=lucia-bio` ya estaba puesto (verificado el 31-ago, deslogueado). Un pendiente inventado también cuesta — le manda a Sergio 4 minutos de trabajo que no existía, y peor: le hace dudar de lo que SÍ está bien.

---

## Cómo se trabaja esta cola

**Loop de fondo** (cron `5d8f50a4`, :13 y :43): una vuelta chica, **un solo ítem**, evidencia
real, commit con rutas explícitas. Los loops anteriores murieron por pedir «una tarea completa»
por vuelta — tarea grande, turno largo, y el cron siguiente nunca dispara porque sólo corre con
el REPL ocioso. **El turno corto ES el mecanismo.**

**Abanico cuando Sergio está**: subagentes en paralelo, para lotes probados e independientes.
