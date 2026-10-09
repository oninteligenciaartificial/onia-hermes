# Handoff — Lucía (influencer IA) y Higgsfield

> Formato: [`README.md`](README.md). Se **sobrescribe**: es el estado ACTUAL del carril.
> Última escritura: **2026-10-09**, sesión `session_01XSzFcs1k18ijqjSHGjnzD4` (nube, entorno `onia-higgsfield`), rama
> `claude/zealous-babbage-fvtjck`. El estado vigente es el primer bloque de abajo; lo demás es historia.
> Reemplaza a `HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md`, que queda como historia.

## ▶ ESTADO VIGENTE — 9-oct-2026, loop de la madre (lo de abajo es el contexto)

**Orden de la madre (Sergio Urcullo, 9-oct):** `/loop` sobre `hermes-content/docs/cola/loop/lucia.md` hasta vaciarla; reportar solo
`PUBLICADO: <qué> — <link>`. La cola está en esa carpeta (marcada `[x]`, con lo bloqueado).

**Listo para publicar (nada publicado todavía):** videos G1, G3, G2, G4, G5 (`videos/lucia-entrega/`, con SHA-256), carruseles L01 (reescrito a
la v5), C1 y C2 (`hermes-content/carousels/out/lucia-*`). Receta exacta, orden y ritmo: **`videos/lucia-entrega/README.md`**.

**Bloqueado, y por qué:** publicar corre en el VPS. La llave vive solo en la sesión «Onia» (decisión de la madre, 5-oct), esta nube
no tiene cliente `ssh` y instalarlo no está aprobado. Además falta (a) el token de Lucía en `ig-lucia.env` (vence 13-18-oct) y
(b) que la madre mire los previews 360p. **Quien corra la receta reporta `PUBLICADO:`.**

**En vuelo:** nada sin commitear. **G4 y G5 están terminados** (`videos/lucia-g4/`, `videos/lucia-g5/`; revisiones independientes en `qa/`): falta la validación de sus
guiones por la madre, que decide además el sello rojo de E/F en G4 y si G2 difumina el letrero inventado como G5.

**Aprendido el 9-oct** (ya en la skill `lucia` §8): el render de carruseles con el Chromium normal deja una franja blanca de 88 px
(usar `headless_shell` y `--pack editorial-photo`); el contenedor se recicla y `out/` no está en git, por eso los finales se entregan
en `videos/lucia-entrega/`; fueron **6 motores de imagen**, no 7 (7 fotos nuevas).

**Depende de Sergio Urcullo o de la madre:** confirmar el tope de 97 cr; la voz (D4); grabar 10 s para Motion Control (L3);
el token, el nombre y la bio del perfil; la mirada a los previews.

## ▶ ESTADO 8-oct-2026 noche, plan v5 (contexto de lo anterior)

**Objetivo de la sesión:** Lucía es una influencer IA que **graba videos estructurados y aprende Higgsfield a fondo sin perder su
cara** (Sergio Urcullo, 8-oct: *«aprendas todo lo que es Higgsfield, todas sus funciones… y podés editarlo con el material que
aprendimos»*). **Hecho =** G1, G2 y G3 montados, revisados y publicados según `CLAUDE.md` § «Qué se publica sin preguntar»; cada
prueba con su aprendizaje en la skill `lucia`.

**En producción:** nada publicado ni desplegado en el VPS.
**Gasto del 8-oct: 86,5 cr** (541,26 → 454,76). Octubre: 139 de 150. Cada generación se cotizó con `get_cost` antes; `sync_so`
no se puede cotizar (cobró 21,75). El tope de 97 cr lo fijó la sesión: Sergio Urcullo no dio una cifra → **pendiente de confirmar**.

**Hecho, en la rama y su PR (#144):**
- **Relevamiento de TODAS las funciones de Higgsfield** (imagen e identidad, video y motores, audio-voz-labios, estudios-presets-apps;
  el grupo de cuenta se hizo a mano): `v4/qa/higgsfield-relevamiento-20261008.json` y `.claude/skills/lucia/higgsfield-mapa.md`.
- **Pruebas pagadas con la misma foto K1 y la misma orden** (`v4/prueba-motores-20261008/`, ids y puntajes en `PROCEDENCIA.jsonl`):
  6 clips de video, 6 motores de imagen y 2 vías de labios, todos medidos con el control de cara. Resultado: `start_image` ata la
  escena pero la cara decae; las referencias de cara la sostienen pero el motor inventa la escena; Seedream 4.5 sigue siendo el
  método de imagen; `sync_so` conserva la cara. Resumen: skill `lucia` §0-quater.
- **Control de cara en la nube:** `.claude/skills/lucia/scripts/face-gate.sh` (pip + buffalo_l, fuera del repo); reproduce las
  medidas guardadas.
- **G1** «Este video no fue grabado: así se hace, en 3 pasos» (56 s): montado con HyperFrames, **tres pasadas con revisor
  independiente** (`videos/lucia-g1/`, preview 360p real en `qa/`). Cara dentro del gate. Método: `.claude/skills/lucia/montaje-hyperframes.md`.
- **G2** «La misma foto, seis clips: ¿quién pierde la cara?» (58 s): guion con todos los datos reales y **montado** el 9-oct
  (`videos/lucia-g2/`, preview 360p real en `qa/`; montar → revisor independiente → corregir). Decisiones para la madre en su README
  (resolución del Motor 2, clip del Motor 6 recortado a 2,5 s, letrero del Motor 4 sin desenfocar, ver el reel en el teléfono).
- **G3** «Tres errores de la IA que atrapé antes de publicar» (58 s): **montado** (`videos/lucia-g3/`, revisor independiente y
  pasada de corrección hechas el 8-oct).
- Skill `lucia` y `editor-videos` corregidas (premisa, upscale 1 cr, Cinema 3.0, trampas fechadas).

**⚠️ Choque de instrucciones, abierto:** el 8-oct la madre dio por aprobado el G1 de **producto** («Recordatorio de cita») y pidió
G2 «El link de reserva». Sergio Urcullo escribió después que Lucía **no muestra el producto**. Se aplicó lo de Sergio Urcullo; el guion de
producto está en pausa (`guiones/G-producto-1-recordatorio-de-cita.md`). La madre no contestó.

**A medias, y dónde:**
- **Nada de montaje en vuelo.** G1, G2 y G3 están montados; falta la mirada de la madre.
- **Validación de la madre:** G1, G2 y G3 esperan su mirada al preview 360p (regla de oro de `CLAUDE.md`).
- **Publicadores:** solo en el repo. La madre los copia **juntos** a `/root/bin` y corre `--selftest`.
- **Token de Instagram de Lucía:** no se midió (vencía entre el 13 y el 18-oct). El hook de arranque dice «`ssh onia-vps` listo», pero
  esta nube no trae el binario `ssh`.

**Archivos:** `.claude/skills/lucia/` (SKILL.md, higgsfield-mapa.md, montaje-hyperframes.md, scripts/face-gate.sh),
`docs/cola/lucia-diario/` (PLAN.md, guiones/, paquete-s1/), `videos/lucia-g1/`, `videos/lucia-g3/`, `references/modelos/lucia/v4/`
(PROCEDENCIA.jsonl, qa/, kit/, prueba-motores-20261008/).

**Intentos fallidos (no repetir):** los del bloque de abajo, más:
- **`sandbox_exec` de Higgsfield:** el control de permisos lo rechazó y el agente que lo llamó quedó colgado (el relevamiento perdió su
  quinto grupo). Los agentes de workflow no lo usan.
- **`jobs_wait`:** devuelve `timed_out` cada ~10 s (se vuelve a llamar) y una vez el control de permisos lo rechazó («Real-World
  Transactions»); `job_display` mira el estado sin gastar.
- **Inventar el uuid largo de un job** (dos veces): se copia de `PROCEDENCIA.jsonl`.
- **Rotular un bloque de cuadros por dos muestras:** «tapada» sobre 72-104 era falso para 84 y 96.
- **Cambiar de motor por una sola toma:** Kling Omni Image dio 0,79 y 0,35 con el mismo método.

**Qué depende de Sergio Urcullo:**
1. **Confirmar o corregir el tope de 97 cr** que se fijó la sesión (quedan 10,5 de él; el mes tiene 11 de 150).
2. **Que la madre mire los previews** (o decir que Lucía queda eximida de verlos antes del render final).
3. D4 (la voz): escuchar las muestras de `research/competencia/lucia-20261005/voces/`; el audio de las pruebas de labios es de Marcela
   (acento colombiano) y no se publica.
4. D5: el canon de 10 datos de Lucía (`LUCIA.md` §0-canon).
5. Nombre y bio desde el celular de Lucía; token de Instagram antes del 13-oct; cuenta gratis de TikTok en Buffer.
6. Para L3: grabar 10 s de gestos como video guía.

**Próximos pasos:**
1. La madre mira los previews 360p de G1, G2 y G3 y decide lo que cada README le deja (G3: letrero difuminado y texto del error 3; G2:
   resolución del Motor 2 y letrero del Motor 4).
2. La madre valida G1, G2 y G3 → publica con `ig-reel.mjs --cuenta lucia` (portada ≈ 0,6 s).
3. Reescribir L01 a la premisa v5; va fijado después de G1.
4. Tras cada edición: lo aprendido a la skill `lucia`, con caso y fecha, en el mismo commit.

## ▶ ESTADO — 8-oct-2026 mañana, plan v4 (historia: lo manda el bloque v5 de arriba)

**Objetivo de la sesión:**
- el plan v2 de Lucía, definido después del estudio de la competencia (madre, 5-oct);
- terminar de estudiar Higgsfield y que Lucía pueda postear normalmente (Sergio Urcullo, 5-oct);
- seguir el kit desde donde lo dejó Codex (madre, 8-oct).

**Hecho =** plan v4 + estudio mirado + skill `lucia` + publicadores con etiqueta IA + kit con K3 recuperado y cutlists
corregidos + paquete de la semana 1, todo en el PR de la rama.

**En producción:** nada publicado ni desplegado en el VPS. **Gasto: 0 cr** (saldo de Higgsfield: 541,26 el 5 y el
8-oct).

**Hecho, en la rama y su PR:**
- **Estudio** `research/competencia/LUCIA_COMPETENCIA_20261005.md`, corregido el 8-oct:
  - anuncios con persona mirados;
  - orgánico de TikTok mirado por curl;
  - presentadoras IA;
  - costos de Higgsfield cotizados;
  - voz y circuito de publicación.
  Su evidencia está en `lucia-20261005/`, con 18 muestras de voz.
- **`docs/cola/lucia-diario/PLAN.md` v4:**
  - prueba de 14 días, 3 piezas por semana, 0 cr nuevos;
  - solo dental, trato de usted, rótulo con apellido;
  - D6, D7, D8 y D10 para Sergio Urcullo.
- **Skill nueva `lucia`** (en `onia-router`) con el método, los costos y las trampas. `higgsfield-generate` avisa que el
  video por defecto para Lucía es Kling y no Seedance 2.5.
- **Publicadores** (`deploy/vps-ops/publicar/ig-reel.mjs`, `ig-carrusel.mjs`, README):
  - etiqueta «Información de IA» por API (`is_ai_generated`, Meta 22-jun-2026), siempre para la cuenta `lucia`;
  - `leerPublicado` no lanza nunca, así una pieza publicada no se pierde del registro ni se re-publica;
  - selftests verdes.
- **Kit:**
  - se trajeron los borradores de Codex (K1, K2 y K4 en 360p, cutlists y `estado-montaje.json`);
  - **K3 recuperado:** el clip `07b938b2` bajado de Higgsfield por `rawUrl` a 0 cr, mirado, en
    `v4/kit/k3-clip-coworking-07b938b2.mp4`;
  - cutlists corregidos: CTA, GIRO de K4 y rótulo con apellido.
- **`paquete-s1/PAQUETE.md`:** perfil, L01, L02 y chiste, con los pies de usted y el ensayo bien descrito.
- **⛔ Chiste de 10 s: RECHAZADO el 8-oct por Sergio Urcullo** (*«es literal un video de 10 segundos. Tienen que ser videos
  estructurados»*). **L02 se retira por el mismo motivo.**
  - Los finales están en `v4/feed/rechazado-20261008/`; el proyecto quedó en `videos/lucia-chiste/` como ejemplo.
  - **Regla nueva (skill `lucia` §0-bis, `PLAN.md` §3):** cada video lleva gancho en 3 s, desarrollo con valor y cierre
    con CTA, dura de 30 a 60 s, deja algo aprendido, y su guion se valida con la madre ANTES de editar.
  - Error de método: se verificó la forma (legibilidad, mentón, specs) y no si la pieza enseñaba algo.
- **Guion G1** «Recordatorio de cita: 3 datos» (53 s, `docs/cola/lucia-diario/guiones/G1-recordatorio-de-cita.md`):
  - gancho / desarrollo con valor / demostración con la pantalla real de Pendientes / cierre con CTA;
  - todo con material ya pagado; **espera la validación de la madre** y la captura P2;
  - L01 (carrusel) tiene estructura pero no enseña: va fijado después de G1.
- **Barrido** de la puerta, la cuenta demo, el lipsync y la receta vieja en FLUJO, LUCIA.md, MANUAL, GUIONES,
  HIGGSFIELD_VIDEO_SYSTEM y editor-videos.

**A medias, y dónde:**
- **Publicadores:** están solo en el repo. La madre los copia **juntos** a `/root/bin` y corre `--selftest`; si se copia
  uno solo, se rompen los carruseles de `@sergiourcullo`.
- **Token de Instagram de Lucía:** no se midió. El 4-sep vencía entre el 13 y el 18-oct.
  - Quería verificarlo con `ls -l /root/.config/onia-publicar/` (solo nombres), para saber si existe `ig-lucia.env`.
  - No hay ssh en esta nube, y la madre recibió «Production Reads» al intentarlo: lo decide Sergio Urcullo.
- **Pantallas reales:** faltan todas (P1, P2, CORREO, EXTRACCION y CONFIGURACION; `v4/kit/estado-montaje.json`). La
  demo está a medias: le falta el correo confirmado y `module.agents`.
- **Montaje:**
  - el próximo render de K4 saca CORREO y HORARIOS si no hay captura (`k4-borrador-cutlist.json` →
    `correcciones8oct`);
  - L01 y L02 se re-renderizan de usted si se confirma D8 (0 cr).
- **Verificación:** la lente de completitud no corrió (se agotó la semana el 5-oct). Las otras 3 se aplicaron.

**Intentos fallidos (no repetir):**
- **Instalar `openssh-client` desde esta sesión:** el clasificador lo frenó («Unauthorized Persistence»). La madre
  recomienda no tener la llave del VPS acá, aunque este entorno trae `ONIA_VPS_SSH_KEY_B64`.
- **Reescribir el mensaje de un commit del autosync (amend + force):** frenado («Git Destructive»). Hay que commitear a
  mano antes de soltar el turno.
- **Chromium headless:** sin la CA del proxy (ERR_CERT_AUTHORITY_INVALID), y saltearlo está frenado. TikTok se lee con
  curl; Instagram da 429.
- **`onia.com.bo/llamada`:** da 404. La métrica `src=lucia-*` nunca existió.
- **Codex no encontró el crudo de K3 en la PC:** vive en Higgsfield (`job_display` → `rawUrl`).

**Qué depende de Sergio Urcullo:** `PLAN.md` §8.
1. OK al paquete de la semana 1 y al usted.
2. El nombre y la bio desde el celular de Lucía.
3. El token, por una de dos vías: el OK a la madre para encender solo `postiz-postgres`, o generarlo en
   developers.facebook.com.
4. Confirmar el correo de la demo y darle `module.agents`.
5. D6, D7 y D10.
6. Mirar en el panel de ElevenLabs si la cuenta dice Free (solo hace falta si algún día hay voz).

**Próximos pasos:**
1. La madre valida G1 → se edita (0 cr) cuando haya captura de Pendientes.
2. Con el OK de Sergio Urcullo: re-render de L01 de usted (0 cr), la madre despliega los publicadores y el token.
3. Revisar K1, K2 y K4 con el criterio de estructura y escribir G2 («El link de reserva: 3 cosas»).

## ▶ ESTADO VIGENTE — 5-oct-2026 (historia)

**Sesión:** `session_01Whdadt8NdnYbZoyum1bRX6`, rama `claude/trusting-dirac-wjkua1`. Todo lo de abajo está en `main`; el
último PR mergeado es el #118.

**En `main` y verificado (nada publicado en Instagram):**
- **Plan v3** (`cola/lucia-diario/PLAN.md`):
  - los 5 rubros del alta, empujados en el orden dental → importadora → el resto;
  - **D1 decidido** (3-oct): ambo sí, como vestuario; nunca se identifica como odontóloga.
- **Kit sobre los guiones de Sergio Urcullo** (`references/modelos/lucia/GUIONES-LUCIA-KIT.md`):
  - K1 · Humo vs. real;
  - K2 · Recepción a las 8;
  - K3 · Sin programador, con el clip ya pagado (0 cr);
  - K4 · Las reglas de la recepción, en versión corta.
- **Material generado con su OK** (3-oct): 7 fotos y 3 clips en `references/modelos/lucia/v4/kit/`.
  - Cara entre 0,81 y 0,85; el ambo igual al maniquí; 5 dedos en el clip de K4.
  - Para revisar: `kit-fotos-hoja.jpg` y `kit-clips-preview.mp4`. El detalle está en `v4/PROCEDENCIA.jsonl` (fila
    `kit_lucia_generacion`).
- **Reels de referencia:** `video-intake/2026-10-04-reels-para-lucia.md` (@barbuprimeia, @mindshft.ai, @imagineartofficial
  y @ramiro.cubria) y `MANUAL-PATRONES-INFLUENCERS-IA.md` § 2-bis (@soy_aria_cruz).
- **Gasto en Higgsfield, octubre: 52,5 de 150 cr.**

**Listo para publicar: NINGÚN reel terminado todavía.**
- K1, K2 y K4 tienen todo lo generado, pero la mitad de cada pieza es la **pantalla REAL de Onia**, y no hay cuenta
  demo. Pedida a la madre el 1-oct.
- K3 también depende de esas pantallas.
- L02 («Este video no fue grabado») está editado y espera el OK de Sergio Urcullo.

**Espera de Sergio Urcullo:**
- **D2:** Reel primero.
- **D3:** WhatsApp, todavía no.
- **D4:** la voz de Marcela tiene acento colombiano; la recomendación es sin voz.
- **D5:** el canon de 10 datos.
- **D6:** «Comentá DEMO». Hay cuatro reels con evidencia de que funciona.
- Mirar la hoja de fotos y los clips del kit.
- Conectar `@lucia.antelo.oficial` y activar «Perfil generado con IA».

**Riesgos:**
- **@mindshft.ai vende otro avatar IA llamado «Lucía»** que esconde que es IA. La cara es otra (0,07–0,10), así que la
  colisión es solo de nombre. Siempre «Lucía Antelo», y está pendiente reservar el handle en las demás redes.
- **Los dedos en Kling:** se miran cuadro por cuadro.
- **El folleto con letra** en K4 · 4: se recorta al editar.
- **El hook Stop** (`git-autosync.js`) empuja a `main` sin revisión. Hay que estacionar el checkout en `main` mientras
  un PR espera.

## ▶ ESTADO — 2-oct-2026 ~14:00 UTC (historia)

**Sesión:** la misma (`session_01Whdadt8NdnYbZoyum1bRX6`, rama `claude/trusting-dirac-wjkua1`). Los PR #78 y #82
están mergeados. Este trabajo va en un PR nuevo.

### 🛑 CIERRE 2 — 3-oct (corrección pedida por la madre; después ESPERA)

**Decisión de Sergio Urcullo (3-oct):** *«que no se identifique como ello pero que tenga la ropa»*. Con eso D1 queda
decidido: Lucía lleva el ambo como vestuario y nunca dice ni da a entender que es odontóloga.

**Hecho:**
- La regla quedó escrita en `PLAN.md` (§3, la fila #4 y la D1), `LUCIA.md` §0, `FLUJO.md` y la skill `editor-videos`
  § Reels de Lucía.
- El chiste pasa a «¿Lucía es real? No: soy IA. Los recordatorios que te muestro, sí.» y ya no promete «agenda llena».
- «Yo no existo. Tu agenda llena, sí.» se cambió en `editor-videos/scripts/seed-campaign.mjs` y quedó marcado en el
  doc de julio, que ya estaba SUPERADO.
- «Hoy soy odontóloga» vivía en el plan v2, que el v3 ya había reemplazado. En `main` no quedaba en ningún guion,
  pie ni subtítulo: se comprobó con `git grep` sobre `origin/main`.

- **@soy_aria_cruz al manual:** quedó en `MANUAL-PATRONES-INFLUENCERS-IA.md` § 2-bis. Ajusta el plan en tres
  cosas: el gancho es una prueba visual sin hablar a cámara, el mensaje largo va en el pie y el embudo «Comentá X» se
  plantea como D6. No se copia la venta de cursos, el programa de creadores de Higgsfield ni el formato clon.

**Pendientes para después:**
- **La web también promete «agenda llena»:** `web-factory/apps/onia-platform/src/app/v1/modulos/dental/page.tsx`
  dice «La agenda llena y los impuestos al día». Es de otro carril; se le avisó a la madre.
- **El carril Lucía no tiene skill propia.** CLAUDE.md pide crear una; hoy sus reglas viven en `editor-videos` y en
  `LUCIA.md`.
- **La prueba de ropa (~5,4 cr) vuelve a hacer falta** con D1 decidido. Necesita el OK de Sergio Urcullo al costo y
  que se levante el congelamiento.

### 🛑 CIERRE — 2-oct ~14:00 UTC (alcance congelado por Sergio Urcullo; la sesión ESPERA, no sigue sola)

**Hecho y dónde:**
- Plan v3 de Lucía + orden de rubros: commits `9fcf9487` y `be9a9ef8`, ya en `main` (PR #97 y #98, mergeados por el
  autosync). Es un doc: no hay nada que publicar en producción.
- Maniquí del ambo: `references/modelos/lucia/v4/vestuario/ambo-terracota-*-8d138bd6.jpg`. Se miró y se le mandó a
  Sergio Urcullo. Costo: 2 cr.
- Reels L02, L05 y L08 editados (del 1-oct). **Nada publicado en Instagram.**

**A medias, y por qué:**
- D1 a D5 esperan a Sergio Urcullo.
- Las piezas de venta esperan la cuenta demo.
- La prueba de ropa depende de D1.
- La cuenta de IG no está conectada.

**Evidencia:**
- `PLAN.md` §7.
- `PROCEDENCIA.jsonl` (los dos maniquíes, con el color medido).
- Licencia de la voz Marcela leída de la API de ElevenLabs.
- Lista de rubros sacada de `onia-platform/lib/platform/rubros-activos.ts`.

**Para mejorar:**
1. **El autosync mergea el PR en segundos.** El PR sirve como registro, no como revisión.
2. **El plan v2 se escribió antes del manual y hubo que rehacerlo el mismo día.** Primero va la investigación, después
   el plan.
3. **La voz se eligió sin leer sus `labels`.** Ahora está en `editor-videos`.
4. **Un pedido directo de Sergio Urcullo («ropa de doctora») choca con el manual verificado.** Se planteó como D1, no
   se decidió acá.

**Pendientes para después (NO se hacen ahora):**
- Ficha de @soy_aria_cruz en el manual.
- Corregir el «6 de 8 muertas» del benchmark del 17-ago.
- Buscar una voz con acento cruceño.
- El cuadro fantasma de L08.

**Objetivo de la sesión:** que el plan de contenido de Lucía quede listo para el OK de Sergio Urcullo, verificado
contra las influencers IA que funcionan. **Hecho =** `cola/lucia-diario/PLAN.md` v3 + decisiones D1–D5 planteadas con
la cuenta delante + el maniquí del ambo generado.

**Qué quedó hecho (en el repo, nada publicado):**
- **`PLAN.md` v3:**
  - **rubros:** los 5 de `onia-platform/lib/platform/rubros-activos.ts` (dental, estética y spa, comercio,
    importadora, servicios profesionales), por decisión de Sergio Urcullo;
  - **formatos del manual** de la madre (`references/modelos/lucia/MANUAL-PATRONES-INFLUENCERS-IA.md`): Reel ancla de
    30–45 s con pantalla real, series «Recepción a las 8» y «Humo vs. real», fotos sueltas a Historias, puerta única
    `/llamada?src=lucia-*`;
  - **prueba de 2 semanas** de ≤ 12,5 cr con umbral al día 14.
- **`LUCIA.md` § 0:**
  - aviso de D1;
  - prenda fija del ambo;
  - trampa del maniquí;
  - **§0-canon** con 10 datos, PROPUESTO y sin aprobar.
- **Maniquí del ambo terracota:** 2 cr.
  - 1.º descartado (`16c447ef`): escribió texto basura y el color salió salmón.
  - 2.º elegido (`8d138bd6`): `v4/vestuario/`, con recorte de frente.
  - Los dos en `PROCEDENCIA.jsonl`.
- **Trampa aprendida en `higgsfield-generate`** (las dos copias): Seedream escribe como texto «sheet» y «hex #…».
- **Voz de Marcela medida** (`GET /v1/voices`):
  - es de la Voice Library, «Marcela - Colombian Girl», **con acento colombiano**;
  - plan `payg` activo;
  - 730 días de aviso si la retiran.
- **Gasto:** Higgsfield octubre **22 / 150 cr**. ElevenLabs 9.547 / 10.000.

**Qué quedó a medias y dónde:**
- **D1–D5 esperan a Sergio Urcullo** (`PLAN.md` §7):
  - D1: ¿uniforme o visita como ella?
  - D2: Reel primero.
  - D3: WhatsApp.
  - D4: ¿voz de Marcela o reels sin voz?
  - D5: el canon.
- **La prueba de ropa (~5,4 cr) depende de D1.**
- **Las piezas de venta (#5–#8) esperan la cuenta demo dental** (pedida a la madre el 1-oct).
- **La ficha de @soy_aria_cruz** la trae la madre; cuando llegue se suma al manual.
- **`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7** dice que la Etapa 1 vende solo dental y estética. Lo tiene que actualizar
  su dueño; se le avisó a la madre.

**Intentos fallidos (no repetir):**
- Prompt de maniquí con «turnaround sheet» y «hex #C4552F»: escribió texto en la imagen y corrió el color.
- Leer la ayuda de ElevenLabs con WebFetch: da 403. El dato de licencia sale de la API.

**Archivos:**
- `hermes-content/docs/cola/lucia-diario/PLAN.md`
- `hermes-content/references/modelos/lucia/LUCIA.md`
- `.../lucia/v4/vestuario/`
- `.../lucia/v4/PROCEDENCIA.jsonl`
- `.claude/skills/higgsfield-generate/SKILL.md` y su espejo en `.agents/`

**Próximos pasos:**
1. Cuando Sergio Urcullo decida D1–D5, producir #2, #3 y #4 (personaje, sin bloqueo).
2. Si D1 es «uniforme», cotizar y correr la prueba de ropa.
3. Cuando llegue la cuenta demo, grabar las pantallas reales y producir #5–#8 con `editor-videos`.

## ▶ ESTADO — 2-oct-2026 ~02:10 UTC (historia)

**Sesión:** Lucía v4 en la nube, entorno `onia-higgsfield`, `session_01Whdadt8NdnYbZoyum1bRX6`, rama
`claude/trusting-dirac-wjkua1`, PR oninteligenciaartificial/onia-hermes#82 (borrador; incluye el #78). Ve
`ELEVENLABS_API_KEY` y, desde el reinicio del contenedor, también la llave del VPS (`ssh onia-vps`). **El relevo que
pedía la madre ya no hace falta.**

**Objetivo de la sesión:** L08 con voz de Marcela y la semana 1. **Hecho =** reels editados con `editor-videos`,
verificados y en manos de Sergio Urcullo para el OK.

**Qué quedó hecho (en el repo, no publicado):**
- **Regla de Sergio Urcullo (1-oct): todo video que sale a redes se edita con `editor-videos`; Higgsfield solo genera el
  clip.** Está en `higgsfield-generate` (las dos copias), en `HIGGSFIELD_VIDEO_SYSTEM.md` y en `cola/lucia-diario/FLUJO.md`.
  La receta vive en una sola fuente: `editor-videos/SKILL.md` § «Reels de Lucía».
- **Receta medida contra Santiago Muñoz y Erik Taveras:** sus últimos videos (TikTok, 19-sep a 1-oct), cuadro por cuadro,
  con crítico. Ficha: `references/video-intake/2026-10-01-santiago-erik-edicion-medida.{md,json}`.
- **L02, L05 y L08 editados** (`videos/lucia-lNN/`, final en `v4/feed/`, preview 360p mandado a Sergio Urcullo). Un
  subagente por pieza, dos verificadores y una ronda de arreglo. Guiones: `cola/lucia-diario/S1-GUIONES.md`.
  - L08: 10,25 s, −14,1 LUFS, identidad 0,75–0,79. Panel-diagrama (−24 h, −2 h, confirmar/cancelar); remate con
    sello y voz que baja.
  - L05 v3: 6,04 s, sin voz, sello «CERO.».
  - L02: 6,04 s, sin voz, primera persona. Identidad resuelta mirando (0,694 de perfil y 0,630 en un parpadeo; los
    cuadros frontales dan 0,712–0,727).
- **Stack en la nube:**
  - `resolve-playwright` cae a `/opt/pw-browsers/chromium`.
  - `tts-elevenlabs.mjs` suma `--timestamps`, `--previous-text`, `--seed` y el cupo en vivo.
  - Plantillas `keyword-marca`, `tag-ia` y `frase-card`, ya con la sombra sin corte.
  - SFX de HyperFrames bajados de `npm pack hyperframes` (no van en git).
- **Gasto:** Higgsfield octubre **20 / 150 cr** (esta sesión gastó 0). ElevenLabs: 83 caracteres (quedan 453 de 10.000,
  tier payg).

**Qué quedó a medias y dónde:**
- Los tres reels esperan el **OK de Sergio Urcullo** (tabla de cortes en cada `README.md`). Sin OK no se publica.
- **L05 y L08 no se publican sin la captura REAL.** El correo de recordatorio (24 h y 2 h, con botones) y el link de
  reserva + agenda. No hay cuenta demo en producción. Pedido mandado a la madre el 1-oct ~23:40.
- L08: 1 cuadro con texto fantasma a la salida del panel (8,04 s; menor, explicado en `README.md`). Si Sergio Urcullo
  aprueba, se arregla en `build.mjs` alineando los fades a la grilla de 1/24 y se re-renderiza (costo 0).
- Decisión de Sergio Urcullo: ¿L02 y L05 llevan voz de Marcela (~100 caracteres) o quedan sin voz con la música que él
  pone?

**Intentos fallidos (no repetir):**
- **Placas PIL + ffmpeg a mano (1-oct): rechazadas.** Se edita con la skill.
- **Forzar `voice_settings` a Marcela** (stability/style): le cambia el timbre. La regla del 21-ago ya lo prohibía y se
  pisó igual. Sin settings.
- **El remate sonaba a pregunta** (la F0 subía en «dedo»). Se arregla con una toma aparte, `--previous-text` y varias
  `--seed`, y se elige la que BAJA. Whisper siempre escribe «mueves»: no sirve para juzgar el voseo.
- **Pie «hecho con IA» fijo abajo:** Instagram tapa y > 1490. Ahora es un rótulo al arranque, debajo del mentón.
- **Gate de identidad aplicado a cualquier cuadro:** bloquea en falso con perfiles y parpadeos.
- **Instagram y YouTube desde la nube:** 429 / verificación de bot. **TikTok anda** con
  `yt-dlp --impersonate chrome` (+ `curl-cffi`).
- **Los reinicios del contenedor cortan los workflows.** Se retoman con `resumeFromRunId` (el disco sobrevive).

**Qué depende de Sergio Urcullo:**
1. OK de L02, L05 y L08.
2. Voz o no en L02/L05.
3. Token de `@lucia.antelo.oficial` en el VPS.
4. Bio con link + utm.
5. Cuenta de Buffer gratis con el correo propio de Lucía, para su TikTok.

**Mensajes a la madre:** desde la nube **SÍ se puede** con `mcp__claude-code-remote__send_message` y
`session_id=session_01Ap3wJimaiB2tZR7gYsYGhe`. `SendMessage` falla.

**Próximos pasos:**
1. Con el OK: publicar L02 por `ig-reel.mjs --cuenta lucia` cuando esté el token. L05 y L08 esperan la captura.
2. Semana 1 restante: L03 y L06 son fotos listas (pie + paquete). L04 y L07 son carruseles con captura real.

## ▶ Arranque de la sesión siguiente, en el entorno `onia-higgsfield`

Esta sesión corre en `Default` y no puede ver Higgsfield: el entorno se fija al crear la sesión.
Sergio Urcullo creó `onia-higgsfield` el 30-sep 02:26 UTC para eso. Todo lo que queda, que es
aprobar fotos, entrenar el Soul, probarlo y después el contenido diario, necesita **mirar**.

**En vuelo al cerrar: nada.** No hay trabajos corriendo en Higgsfield, ni rutinas pendientes, ni
nada sin commitear. Si esta sesión muere, no se pierde nada.

1. `git branch --show-current`. Después leé este handoff y `COORDINATION_MANIFEST.md` §EL HILO.
> **Estado 30-sep 19:50 UTC — EN VUELO:** Soul `LUCIA-v5` `cd42c065-e18c-4176-b9ad-e2de075fe362`
> (soul_2, 16 fotos del look vigente, **25 cr medidos**) lanzado 19:46 y en cola. Lote de prueba
> aprobado por Sergio Urcullo con **tope 75 cr: gastados 52,98** (8 fotos V01–V08 0,777–0,858; b-roll
> Seedance Mini / Kling 3.0 / Cinema Studio v2; Soul). Quedan del tope: 6 imágenes `soul_2` de A/B
> (0,72 cr) cuando el Soul esté `ready`. Cinema Studio 3.0 (20 cr) **no se envió**: lo bloqueó el
> control de permisos; decide Sergio Urcullo. Si la sesión muere: `show_characters status` del
> v5; NO reentrenar (otro cobro de 25). Todo el detalle en `v4/PROCEDENCIA.jsonl`.
> **Estado 30-sep 03:50 UTC — EN VUELO:** Soul `LUCIA-v4` `c4281765-c031-40ed-b430-e5fd313ef207`
> (soul_2, 20 fotos) lanzado 03:12 y **en cola (`queued`) sin arrancar** a las 03:48. Dataset de 20
> completo (D03…D13 en `PROCEDENCIA.jsonl`, 0,748–0,893). Escenas fijas Seedream: 0,884/0,749/0,766.
> Contenido viejo (L1, banco L2) ≈0,70. Audio Marcela subido: media `d0eacead-…`. Lote de video
> cotizado, **sin OK**. Si la sesión muere: chequear el Soul con `show_characters status`; NO
> reentrenar sin OK (otro cobro). Prompts Soul de las 3 escenas: `v4/prompts` pendiente de copiar
> (hoy en el scratchpad: S1 primer plano, S2 café con manos, S3 cuerpo entero en oficina).

> **Estado 30-sep 03:05 UTC (sesión en `onia-higgsfield`, rama `claude/lucia-v4-onia-higgsfield`):**
> red **confirmada** (CDN 200; la raíz da 403 de S3, no del proxy). T101–T204 bajados y MIRADOS.
> Cotizado en vivo: 7 fotos Seedream = **7 cr**. Soul: sin preflight en el MCP; la última vez
> costó **25 cr** (transacción «Soul ID», 23-ago). Saldo 533,87. **Nada lanzado: esperando el OK
> de Sergio Urcullo** para las dos cosas.

2. **Confirmá la red** con `curl -sS -o /dev/null -w '%{http_code}\n' https://d8j0ntlcm91z4.cloudfront.net/`.
   - `000` significa que el entorno no tiene los dominios: avisale a Sergio Urcullo y seguí
     midiendo en `sandbox_exec`, como se hizo acá.
   - Cualquier otro código significa que hay red. **Mirá** T201–T204
     (`v4/qa/manifest-metodos-20260929.json` trae las URLs) y el photoshoot.
3. **7 fotos nuevas**, solo con el OK de Sergio Urcullo. Recomendado: Seedream 4.5, 7 créditos.
   - Prompts: D03, D06, D07, D09, D10, D12 y D13 de `v4/prompts/dataset-vida.json`.
   - Referencias: las 7 `media_ids` de `lucia-skin-v1` como `image_references`.
   - Formato: 9:16, en lotes de 4 como máximo. Cotizá antes con `get_cost`.
   - Puntuá cada foto con `face_identity_qa.py`: el gate es 0,70 en caras frontales o de tres
     cuartos. **Además, miralas**: piel, manos, argollas y cadenita.
   - Registrá todo en `v4/PROCEDENCIA.jsonl`.
4. **Soul ID v4** (`soul_2`) con 20 fotos.
   - 13 canónicas:
     - las 6 medias de `lucia-skin-v1` sin `1714a347` (`lucia_original_sources_keep`);
     - los job_ids 01–07 del photoshoot (`trait_photoshoot_local.higgsfield_job_ids`).
   - Más las 7 nuevas.
   - **Antes, OK específico de Sergio Urcullo con el costo cotizado.**
5. **Prueba en 3 escenas fijas:** medir con 0,70 o más y mirarlas.
6. Recién ahí, el objetivo siguiente: contenido diario (vende Onia + lifestyle).

**Objetivo**

**Fijar de verdad la cara ORIGINAL de Lucía** y aprender Higgsfield entero haciéndolo. Sergio
Urcullo: *«me gusta más como era antes Lucía»* · *«NO ES CARA REAL, LA PRIMERA LUCÍA LA HICE 100%
IA»* · *«quiero que vuelvas a generar desde esa imagen, cómo conseguimos los mejores resultados,
investigá y aprendé»*. Objetivo del personaje, decidido por él: *«que vende Onia y que tenga
lifestyle»*.

**Hecho =**
1. Método ganador elegido por Sergio Urcullo mirando la comparación.
2. Dataset de 20 con procedencia.
3. Soul ID v4 (tipo `soul_2`) entrenado.
4. Prueba en 3 escenas fijas contra el stack de 10 ángulos.
5. Docs sin afirmaciones falsas.

**Qué quedó EN PRODUCCIÓN**

Nada publicado. En Higgsfield quedaron:
- el proyecto `c6c080a7-fbe9-4314-a5b5-e5f8ec6f59ad`;
- 26 caras de casting descartadas;
- 8 pruebas con la cara original: T101–T104 con el método Element, T201–T204 con las 7 fotos
  explícitas en dos motores.

Gasto total: **37,04 créditos**. La medición de identidad costó 0; la última transacción sigue
siendo la de las 21:25:51 UTC.

**Qué quedó a medias, y dónde**

- **Medido, falta el OK de Sergio Urcullo para seguir.** La cara se midió con
  `scripts/face_identity_qa.py` (ArcFace). Coseno contra el centroide de las 8 fuentes, con el
  mismo prompt:

  | Escena | Element + Nano Banana Pro | 7 fotos + Nano Banana Pro | 7 fotos + Seedream 4.5 |
  |---|---|---|---|
  | Café | 0,822 | 0,806 | **0,883** |
  | Calle, cara chica | 0,693 | 0,683 | **0,836** |

  - **Por identidad gana Seedream 4.5 con las 7 `media_ids`**, y además cuesta la mitad.
  - Las fuentes, medida cada una contra las otras, dan 0,70–0,82. Las caras del casting dan 0,22 o
    menos.
  - La métrica no ve belleza ni piel: la estética la decide Sergio Urcullo mirando.
  - Detalle: `v4/qa/identidad-metodos-20260929.json` y `HIGGSFIELD_VIDEO_SYSTEM.md` §9.
- **Dataset recompuesto el 30-sep: 13 fotos canónicas + 7 nuevas = 20.**
  - Las 13 canónicas ya están en Higgsfield:
    - 6 medias de `lucia-skin-v1`, sin `R2` (`1714a347`), que tiene dos personas de fondo;
    - las fotos 01 a 07 del photoshoot, por job_id.
  - Las 7 nuevas son D03, D06, D07, D09, D10, D12 y D13 de `v4/prompts/dataset-vida.json` (D11
    queda de reserva). Aportan la luz y las escenas que el photoshoot de estudio no tiene.
  - Cuesta **7 créditos con Seedream** (13 antes de recomponerlo) y 14 con Nano Banana Pro.
- **⚠️ Corregido el 30-sep: el photoshoot de 10 ángulos SÍ está en Higgsfield.**
  - Acá decía «no tiene IDs; subirlo requiere esa red». Era falso: cada PNG de
    `references/models/lucia-surgical-shoot-20260707/` trae su job en el metadato `hf-job-id`, y los
    12 jobs figuran `completed`.
  - Los IDs están en el manifest (`trait_photoshoot_local.higgsfield_job_ids`) y la medición en
    `v4/qa/identidad-photoshoot-20260930.json`.
  - Identidad: 01 da 0,738; 02, 0,744; 05, 0,703; 06, 0,758; 07, 0,729. El 04 (perfil) da 0,689:
    los perfiles bajan solos, no es deriva.
- **Red:** Sergio Urcullo creó el entorno **`onia-higgsfield`** (30-sep 02:26 UTC). `Default` sigue
  bloqueando Higgsfield; lo medí el 29-sep 23:49 UTC. Esta sesión corre en `Default`, porque el
  entorno se fija al crear la sesión: sigue midiendo en `sandbox_exec`, pero no puede mirar. **La
  próxima sesión del carril arranca en `onia-higgsfield`** y confirma primero la red con `curl` al
  CDN.
- **Borrado en la web:** pendiente. Alcance corregido: no se toca nada de Lucía (manifest →
  `deletion_scope_2026_09_29`).

**Archivos y cambios**

| Archivo | Qué es |
|---|---|
| `scripts/face_identity_qa.py` | QA de identidad: SCRFD + ArcFace de insightface `buffalo_l`, con el preprocesado oficial y sin compilar nada. Recibe un manifest de URLs y devuelve JSON |
| `hermes-content/references/modelos/lucia/v4/qa/` | Manifest y resultado de la medición de métodos del 29-sep |
| `hermes-content/references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json` (schema v3) | Autoridad. Nuevo bloque `v4.identity_qa`: gate 0,70, línea base, ranking y exclusión de `R2` |
| `hermes-content/references/modelos/lucia/v4/PROCEDENCIA.jsonl` | Cada imagen con job, modelo, seed, método, referencias usadas y costo. Ahora también el puntaje de identidad (filas `qa_identidad`) |
| `hermes-content/references/modelos/lucia/v4/prompts/dataset-vida.json` | Los 13 prompts del dataset: cambia lo que rodea a la cara, nunca la cara |
| `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md` §«Verificado en vivo 2026-09-29» (puntos 1–9) | Términos, costos, límites, cómo se consigue la misma cara y **cómo se mide** |
| `hermes-content/docs/research/INFLUENCER_IA_PIPELINE_PRO_20260929.md` | Nodos contra código (Pletor), operación diaria, etiquetas IA y costos |

**Intentos fallidos** (y por qué, para no repetirlos)

- **🔴 El más caro: tomar como hecho una afirmación del repo sin preguntarle al creador.**
  - El manifest del 22-sep decía que la cara venía de una persona real. En realidad era un «frame
    REAL» de un video **de Higgsfield**.
  - Sobre esa premisa se planeó borrar todo y se hicieron 26 caras nuevas: 23,04 créditos y unas
    2 horas.
  - **Regla:** la procedencia de un activo se le pregunta a quien lo creó antes de descartarlo.
- **Casting v1 (C01–C12):** las «digitals» de agencia, con cara lavada y luz plana, matan la
  belleza. Sergio Urcullo lo rechazó: *«no las veo fancy o cutes»*.
- **Casting v2 (C13–C26):** caras nuevas en estilo Pinterest. Quedó sin objeto al saberse que la
  original es 100% IA.
- **`<<<element_id>>>` por MCP** mete solo 1 de las 7 fotos del Element. Medido después: en Nano
  Banana Pro, pasar 1 o 7 da la misma identidad. Lo que mueve la aguja es el motor.
- **Prompts largos (~300 tokens) que redescriben la cara:** van contra la guía oficial, que pide
  menos de ~200 tokens y describir solo el cambio.
- **Borrar por MCP, CLI o API:** no existe (ver el manifest).
- **Subir archivos del repo a Higgsfield desde la nube:** `upload.higgsfield.ai` está bloqueado, y
  las instrucciones del propio MCP prohíben pasar bytes en base64.
- **`soul_cast`:** ignora el prompt.
- **GPT Image:** da 429 si se lanzan varios a la vez.
- **Plan Pro:** máximo 4 trabajos a la vez.
- **Primer intento de borrado antes del OK explícito:** lo frenó el clasificador. Lección: pedir el
  OK antes de cualquier acción irreversible.

**Qué depende de Sergio Urcullo**

1. Elegir el motor de las 7 fotos nuevas. Recomendación medida: Seedream 4.5 con las 7 fotos de
   referencia (7 créditos; el total quedaría en ~44 de 100). Si al mirar le gusta más la estética de
   Nano Banana Pro, son 14 créditos.
2. ~~Agregar los dominios~~. **Hecho el 30-sep:** creó el entorno `onia-higgsfield`. Falta
   confirmarlo desde una sesión de ese entorno.
3. Borrar en la web lo que no es de Lucía.
4. Dar el OK específico del costo del entrenamiento del Soul.
5. Aprobar toda publicación.

**Próximos pasos** (cada uno con su «listo»)

1. **Dataset:** D03, D06, D07, D09, D10, D12 y D13 de `dataset-vida.json`, con las 7 `media_ids`
   como `image_references`, de a 4.
   - Cada foto se puntúa con `face_identity_qa.py`. Si da menos de 0,70 (frontal o tres cuartos),
     se regenera.
   - Listo = 7 fotos que pasan, registradas, y Sergio Urcullo conforme con la estética.
2. **Soul ID v4:** `show_characters action=train`, tipo `soul_2`, con las 20: 13 canónicas por
   media_id o job_id, más las 7 nuevas.
   - Listo = el Soul está `ready`, aparece como Element y pasa 3 escenas fijas con 0,70 o más.
3. **Argollas y cadenita:** nombrarlas en cada prompt, o guardarlas como Element aparte si el Soul
   las pierde.
4. **Objetivo de la sesión SIGUIENTE:** contenido diario (vende Onia + lifestyle). Formato base:
   el Reel híbrido. Publicación por API, con aprobación de Sergio Urcullo.

**Congelado (anotado, no se hace ahora)**

- **«Ejército de modelos» como producto.**
  - Es la línea influencers IA, que falla las tres preguntas de `ONIA_ESTRATEGIA_DE_EMPRESA.md` §10.
  - Antes de venderlo hay que pedir a Higgsfield confirmación escrita del entrenamiento.
  - Se venden salidas, no acceso al servicio.
- **Soul nuevo de Sergio Urcullo:** es del carril marca personal. Con sus propias fotos, los
  términos lo permiten sin discusión.
