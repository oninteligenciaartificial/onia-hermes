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

> 🔴 **Esta lista es la fuente del LOOP TAREAS.** Lo tachado NO se rehace. Al cerrar algo se tacha
> acá en la misma vuelta, o la próxima lo repite.

1. ~~**Animar G05**~~ — ✅ generada y verificada (Kling 3.0 · 720p · 5 s, 6,25 cr). ⚠️ **NO se pudo
   bajar** en 7 intentos, y **NO se regenera: ya está paga.** Queda a la espera del archivo. Si
   aparece: copiar a `generadas-20260828/V05-oficina-animate-kling3.mp4`, tira de 5 frames,
   verificar sin audio con ffprobe.
2. ~~**Probar `Reference`**~~ — ✅ **hace exactamente eso**: conservó lugar, ropa, personas y
   encuadre, y aplicó el único cambio pedido (ella levanta la vista al funcionario). Es la
   herramienta para variantes; Recreate no. ⚠️ El archivo (G05c) **no se pudo bajar** — quedó en
   la cuenta, ya pago, **no regenerar**.
2b. ✅ **Causa encontrada: no es Higgsfield, es Chrome.** Un `.txt` de 15 bytes con `data:` URI
   tampoco baja ⇒ Chrome bloquea las descargas del origen `higgsfield.ai` (bloqueo de descargas
   múltiples). **Lo destraba Sergio en 10 s:** icono a la izquierda de la barra de direcciones →
   Configuración del sitio → **Descargas automáticas → Permitir**.
   ⚠️ Si él aprieta descargar en ese mismo Chrome tampoco baja, y parece que sí (pasó con V05).
   **Bloquea traer al repo:** V05 (6,25 cr) y G05c (2 cr), ambas pagas. **No regenerar.**
3. ~~**Usar el banco en una pieza real**~~ — ✅ `L10-la-hoja-sellada`, con G05 y G05b como láminas
   1 y 2. Gate verde, render mirado, dos titulares corregidos porque se cortaban.
4. **Decidir si L10 se publica** (depende de Sergio).
5. Roadmap sin tocar: Relight, Inpaint, Upscale, Face Swap, Marketing Studio, Cinematic Cameras,
   Canvas, Motion Control.

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
