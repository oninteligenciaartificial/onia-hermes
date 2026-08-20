# El recorrido del contenido, punta a punta — qué corre solo y qué no

> 2026-08-20. Pregunta de Sergio: *cómo se sube contenido 24/7, quién orquesta cada tramo, qué
> se puede en cada red — para `@oniahq` y para Lucía*.
>
> **Regla de este doc: nada en verde que no esté verificado en vivo.** Cada ✅ trae fecha y
> evidencia. Lo que no se probó vive en su propia columna, con lo que falta para probarlo.
>
> Fuentes propias: `ONIA_AUTOMATIZACION_MENSAJES_20260818.md` §10-§14 (lo probado contra Meta
> y en producción) · `ONIA_POSTIZ_COMENTARIOS_DM_20260817.md` (qué puede y qué no Postiz) ·
> `ONIA_CICLO_COMENTARIO_DM_20260815.md` (el guion del DM) · `ONIA_IG_TIKTOK_AUTOMATION_RESEARCH_20260802.md`
> (el mapa de APIs) · `hermes-content/contenido/README.md` + `ONIAHQ.md` + `LUCIA.md` (la regla
> editorial y el inventario) · `ONIA_ADS_CAMPANA_1_LISTA_20260813.md` (la cuenta publicitaria) ·
> `ONIA_N8N_AUTOMATIONS_LIVE_2026.md` (los crons vivos).

---

## 0. La respuesta en tres frases

1. **Publicar y responder ya corren solos.** Postiz publica sin humano y n8n contesta el
   comentario con un DM sin humano — las dos cosas probadas con datos reales el 2026-08-18.
2. **Producir NO corre solo, y ahí se corta la cadena.** El agente de contenido deja borradores
   de texto; el render y la programación los dispara una persona. La cola se vacía el **02-sep**.
3. **Y todo esto pasa en una sola red.** Postiz soporta 30+ proveedores; hay **uno conectado**
   (`instagram-standalone` de `@oniahq`). El resto está apagado por falta de un OAuth, no de
   software.

**Traducción:** hoy no tenemos un sistema 24/7 de contenido. Tenemos **los dos tramos finales
en 24/7 y el primero a mano**, alimentando una sola cuenta en una sola red.

---

## 1. El recorrido, dibujado

```
╔═ TRAMO 1 · PRODUCCIÓN ══════════════════════════════════════════════════╗
║                                                                         ║
║   idea ──► brief JSON ──────► render por código ──────► PNG / MP4       ║
║            carousels/briefs/  scripts/carousel_render.js  carousels/out/║
║                               (costo 0 créditos: no usa IA)             ║
║                                                                         ║
║   ORQUESTA: nadie, en automático.                                       ║
║   n8n `nZkaXaZVKzgtwUqU` (Lun-Sáb 07:20) redacta SOLO TEXTO con LiteLLM ║
║   y lo deja en `review_queue` (pending / reviewer=sergio).              ║
║   Nadie renderiza ni programa por cron.                                 ║
╚═════════════════════════════════════════════════════════════════════════╝
                        │
                        │  ✋ SALTO MANUAL — ningún cron cruza esta línea
                        ▼
╔═ TRAMO 2 · PUBLICACIÓN ═════════════════════════════════════════════════╗
║                                                                         ║
║   scripts/postiz_schedule.mjs ──► cola de Postiz ──► Instagram 19:00 BO ║
║   (lo corre una persona)          (VPS)             + comentario propio ║
║                                                       con hashtags      ║
║                                                                         ║
║   ORQUESTA: Postiz, 24/7, sin nadie mirando.                            ║
║   Pero solo consume lo que alguien puso en la cola.                     ║
║   Cola de hoy: 6 piezas · última el 02-sep · después, vacío.            ║
╚═════════════════════════════════════════════════════════════════════════╝
                        │
                        │  el post existe ──► Meta emite el webhook `comments`
                        ▼
╔═ TRAMO 3 · RESPUESTA ═══════════════════════════════════════════════════╗
║                                                                         ║
║   POST /webhook/ig-comment ──► n8n `gWrVHU8OxI9yugc4` (13 nodos)        ║
║        │                                                                ║
║        ├─ ¿es nuestro propio comentario? ──► ignorar  (anti-bucle)      ║
║        ├─ ¿trae palabra clave?  no ────────► ignorar                    ║
║        └─ SISTEMA · LISTA                                               ║
║              └─ freno 24 h por persona  (/opt/onia/ig-dm-token.sh)      ║
║                    └─ POST /me/messages ──► DM entregado                ║
║                          └─ aviso a Sergio por Telegram                 ║
║                                                                         ║
║   ORQUESTA: n8n, 24/7, sin humano. Probado con 4 eventos reales.        ║
╚═════════════════════════════════════════════════════════════════════════╝
                        │
                        ▼
╔═ TRAMO 4 · CONVERSACIÓN ════════════════════════════════════════════════╗
║   La persona responde el DM ──► ✋ MANUAL (Sergio, desde la app)         ║
║   Chatwoot corre en el VPS y sabe recibir DMs de IG, pero NO está       ║
║   cableado a este flujo ni verificado como canal conectado.             ║
╚═════════════════════════════════════════════════════════════════════════╝
```

**Quién orquesta, resumido:** producción = **una sesión de trabajo** (persona + Claude) ·
publicación = **Postiz** · respuesta = **n8n** · conversación = **Sergio**.

⚠️ **Claude en el VPS no es el orquestador de contenido.** Corre por cron cada 10 min para
autocurar contenedores y mandar diagnóstico a Telegram ([[claude-guardia-vps]]). **No publica
nada.** El orquestador de publicación y respuesta es n8n.

---

## 2. Estado por tramo

Leyenda: ✅ **probado en vivo** (fecha + evidencia) · 🔌 **falta conectar** (clic humano, cero
desarrollo) · 🔨 **falta desarrollo** · 🔎 **falta investigar** · 🔴 **bloqueo**.

| # | Tramo | Pieza | Estado | Evidencia / qué falta |
|---|---|---|---|---|
| 1 | Producción | Render de carrusel por código | ✅ | 7 piezas renderizadas y programadas; 0 créditos de IA (`ONIAHQ.md` §3-§4) |
| 1 | Producción | Agente de contenido diario | ⚠️ parcial | n8n `nZkaXaZVKzgtwUqU`, Lun-Sáb 07:20: redacta **solo texto** a `review_queue`. No renderiza, no programa |
| 1 | Producción | **Cadena idea → post programado sin humano** | 🔨 | No existe. Es el corte real de la cadena 24/7 |
| 1 | Producción | Video de Lucía (Higgsfield / kling / veo) | 🔴 | Gasto pago = OK explícito de Sergio caso por caso; y el bloqueo #1 de `LUCIA.md` (origen de los videos de su cara) es solo de él |
| 2 | Publicación | Postiz publica en IG | ✅ **2026-08-18** | `instagram.com/p/DcMxZGekcMo/` · CAROUSEL_ALBUM · 8 slides |
| 2 | Publicación | Comentario automático con hashtags | ✅ **2026-08-18** | Salió solo con el post; `comments_count 1` |
| 2 | Publicación | Cupo de publicación de Meta | ✅ medido | `GET /me/content_publishing_limit` → `quota_total: 100` cada 24 h; cadencia real 0,3/día |
| 2 | Publicación | Programar la cola | ⚠️ manual | `scripts/postiz_schedule.mjs`, lo corre una persona con la apiKey sacada de la base de Postiz en el VPS |
| 2 | Publicación | Cola después del 02-sep | 🔴 **vacía** | Ver §5 |
| 2 | Publicación | Las otras 30+ redes de Postiz | 🔌 | Software listo, cuentas sin conectar. Ver §3 |
| 3 | Respuesta | Meta entrega los webhooks | ✅ **2026-08-18 23:16** | 4 eventos reales en 90 s (exec 54949-54952), firmados con `X-Hub-Signature-256` |
| 3 | Respuesta | Filtro anti-bucle | ✅ probado | El **primer** webhook que llegó fue nuestro propio comentario de hashtags → ignorado |
| 3 | Respuesta | DM automático por palabra clave | ✅ **2026-08-18** | `"sistema"` en minúscula → Meta devolvió `recipient_id` + `message_id`, sin `IGApiException` |
| 3 | Respuesta | Freno de 24 h por persona | ✅ probado en el flujo | `/opt/onia/ig-dm-token.sh`; 2ª vez la misma persona → `ya_recibio_dm_24h`, el DM ni se intenta |
| 3 | Respuesta | La palabra **LISTA** con un comentario real | ⏸️ pendiente | El freno es por persona: hace falta una cuenta distinta a la de Sergio |
| 3 | Respuesta | Validar `X-Hub-Signature-256` | 🔨 | **No implementado.** Quien conozca la URL puede POSTear un evento falso. Ya sabemos que Meta la manda → falta `options.rawBody` + el app secret en n8n |
| 3 | Respuesta | Filtrar por `entry_id` | 🔨 | Valor real conocido: `17841423363059652`. Ya se puede exigir coincidencia |
| 3 | Respuesta | **Responder comentarios de otros** (público) | 🔨 | Postiz no puede en ninguna red. La Graph API sí (`POST /{comment_id}/replies`), nadie lo construyó |
| 4 | Conversación | Chatwoot como bandeja de DMs de IG | 🔎 | Sabe recibir DMs, respuestas a historias y menciones — **no** comentarios públicos. Que el canal esté conectado hoy **no está verificado**; el paso F0 quedó escrito el 2026-08-02 y nunca se confirmó |
| 4 | Conversación | Seguimiento en frío en IG | 🔴 estructural | **No existe en Instagram.** No hay plantillas tipo WhatsApp; el nurturing vive en WhatsApp, IG captura y deriva |
| — | Amplificación | Cuenta publicitaria | 🔴 | `ONIA Ads` `1073680778314945` activa, campaña creada en pausa, pero `has_payment_method: false` en las dos cuentas · página sin vincular · pixel nunca disparó |

---

## 3. Qué publica cada cuenta, en cada red, y por qué

La columna **por qué** no es opinión: sale de la regla editorial de
`hermes-content/contenido/README.md` — `@oniahq` es **el vendedor** (su moneda son reuniones) y
Lucía es **el medio** (su moneda es alcance). Y de **la prueba del vendedor**: *si la pieza le
sirve igual a alguien que nunca te va a comprar, no va en `@oniahq`, va en Lucía*.

### `@oniahq` — el vendedor

| Red | Estado | Qué publicaría | Por qué |
|---|---|---|---|
| **Instagram** | ✅ **vivo** — 1 publicado, 6 en cola | Carrusel (70%): informativo aplicado al negocio del que mira + venta. 1 de cada 4 pide palabra clave | Es su casa. Ahí está el comprador local y ahí funciona el ciclo comentario→DM ya probado |
| **TikTok** | 🔴 **VEREDICTO 2026-08-20** | ver research | **Publicar SI · leer comentarios SI · responder en publico SI · comentario→DM NO.** La funcion existe (*Comment-to-Message*, el equivalente exacto del Private Reply) pero *"only available for Business Accounts registered in Vietnam, Indonesia, and Thailand"*. **El gate es el pais de registro, no permisos ni plata.** Bolivia queda afuera y no hay workaround legitimo. Detalle: `research/ONIA_TIKTOK_AUTOMATIZACION_API_20260820.md` |
| **YouTube** | 🔌 + 🔎 | Casos cortos de automatización para pymes ("ONIA Automatiza") | Postiz lo soporta y falta el OAuth. Pero el plan del canal es de **research parqueado** (2026-07-06) y **no está decidido si el canal es de `@oniahq` o una marca aparte**. Pasa la prueba del vendedor solo si cada video termina en el negocio del que mira, no en "IA" en abstracto |
| **Threads** | 🔌 | El caption del carrusel, en texto, apuntando al post | Postiz lo soporta y es la red adyacente a IG (misma identidad Meta, mismo OAuth family). Es lo más barato de encender: contenido ya escrito, cero producción nueva. **Nadie midió si convierte** |

### Lucía — el medio

| Red | Estado | Qué publicaría | Por qué |
|---|---|---|---|
| **Instagram** | 🔌 **cuenta creada, NO conectada a Postiz** | 70% reel vertical · 30% carrusel. 4 pilares: meta-IA 30 · vida 30 · el problema que ONIA resuelve 30 · marca de terceros 10 | Es su formato natural y su casa. **Además le está permitido el informativo genérico** ("las mejores skills de Claude") que a `@oniahq` le está prohibido, porque juntar gente ES su trabajo |
| **TikTok** | 🔴 **VEREDICTO 2026-08-20** | ver research | **Publicar SI · leer comentarios SI · responder en publico SI · comentario→DM NO.** La funcion existe (*Comment-to-Message*, el equivalente exacto del Private Reply) pero *"only available for Business Accounts registered in Vietnam, Indonesia, and Thailand"*. **El gate es el pais de registro, no permisos ni plata.** Bolivia queda afuera y no hay workaround legitimo. Detalle: `research/ONIA_TIKTOK_AUTOMATIZACION_API_20260820.md` |
| **YouTube** | 🔌 + 🔎 | Shorts (el mismo reel vertical, sin re-producir) | Reciclar el vertical a Shorts es costo marginal cero una vez que hay reels. Pero hoy **no hay ni un reel producido**, así que la red no es el bloqueo |
| **Threads** | 🔌 | ⚠️ decisión abierta | `LUCIA.md` §3 dice *"nunca posteos de solo texto ni comunicados — en el benchmark, un comunicado sacó 4 likes"*. Ese benchmark se midió **en Instagram**, donde el texto compite contra video. Threads es una red de texto por diseño. **Trasladar esa regla sin medir sería aplicar mal la evidencia; encenderla sin pensarlo, también.** Queda como decisión, no como recomendación |

### Las dos reglas de cruce que ya están decididas (no reabrirlas)

- **El tráfico va en una sola dirección: Lucía → ONIA.** Ella nombra a `@oniahq`; ONIA no la
  nombra en cada pieza, o la cuenta de producto termina siendo el fan club de la modelo.
- **La colaboración (post en las dos cuentas a la vez) es manual, siempre.** La API de Instagram
  no tiene campo de colaborador — verificado contra la documentación oficial el 2026-08-16. Sale
  a ~1 cada 3 semanas y solo cuando Lucía **es** la demostración del producto.

---

## 4. Qué falta para 24/7 de verdad

Ordenado por **cuánto desbloquea**, no por esfuerzo. Y separado en dos columnas que no se
mezclan: lo que es **un clic de una persona** y lo que es **construir**.

### 4.1 — Clic humano (OAuth, panel, decisión) — cero desarrollo

| # | Qué | Quién | Qué desbloquea |
|---|---|---|---|
| 1 | **Conectar la cuenta de Lucía a Postiz** | Sergio | La segunda cuenta entera. Hoy la cuenta existe y no publica nada porque la única integración viva es `@oniahq` |
| 2 | **Método de pago en `ONIA Ads`** `1073680778314945` | Leslie (titular) / Sergio | La única palanca de alcance que no depende de esperar. La campaña ya está creada en pausa con techo duro de USD 35 |
| 3 | **Conectar Threads** (`@oniahq`, y decidir Lucía) | Sergio | Duplicar la superficie con contenido ya escrito. Es el OAuth más barato de todos |
| 4 | **Vincular la página + hacer disparar el pixel** | Sergio | Sin página no hay formulario de leads ni destino de mensajería; sin pixel disparado no se optimiza a conversión |
| 5 | **Decidir el % del pilar informativo genérico de Lucía** | Sergio | Sin ese número no se puede producir su feed en volumen (si crece mucho, deja de ser influencer y pasa a ser un medio de IA que no deriva a nada) |
| 6 | **Confirmar el @ real de Lucía** | Sergio | `carousel_render.js` tiene `@lucia.antelo.oficial` hardcodeado y nadie lo confirmó. Sin eso no se re-renderizan sus dos carruseles heredados |
| 7 | **OAuth de YouTube / TikTok** (si el research los aprueba) | Sergio | Redes nuevas. **Después** del veredicto, no antes |

### 4.2 — Desarrollo

| # | Qué | Esfuerzo | Qué desbloquea |
|---|---|---|---|
| 1 | **Un cron que renderice y programe** (brief aprobado → PNG → cola de Postiz) | medio | **Esto es el 24/7.** Es el único ítem de la lista que convierte tres tramos sueltos en una cadena. Hoy el eslabón es una persona |
| 2 | **Producir 2-3 informativos nuevos** para después del 02-sep | horas | Que la cuenta no se apague sola en 13 días. Lo que queda sin producir es casi todo de venta, y tres pedidos seguidos rompen la regla de 1 de cada 4 |
| 3 | **Validar `X-Hub-Signature-256`** | chico | Cierra la punta suelta de seguridad del webhook. Ya sabemos que Meta la manda |
| 4 | **Filtrar por `entry_id`** | chico | Que el flujo solo acepte eventos de nuestros propios posts. El valor real ya se conoce |
| 5 | **Responder comentarios públicos** (`POST /{comment_id}/replies`) | medio | Hoy el que comenta recibe un DM pero **nadie le contesta en público**, y el comentario público es lo que ve el resto |
| 6 | **Cablear Chatwoot al flujo** (n8n dispara, Chatwoot conversa) | medio | El tramo 4. Sin esto, cada respuesta a un DM espera a que Sergio la vea |
| 7 | **Multi-cuenta en el pipeline de render** (`--account lucia`) | chico | Que producir para Lucía no sea un caso especial |

**El orden importa:** el ítem 1 de desarrollo vale más que los seis siguientes juntos, y el
ítem 2 de clic humano (el método de pago) vale más que casi todo el desarrollo — porque publicar
mejor a nadie sigue siendo publicar a nadie.

---

## 5. Los cuellos de botella, sin maquillaje

### 5.1 — 🔴 El contenido llega a nadie, y la amplificación está apagada

`@oniahq` tiene **22 seguidores** (verificado en Instagram el 2026-08-16; ~23 hoy). El primer
carrusel salió el 18-ago a un público de ese tamaño.

Y la salida de emergencia también está cerrada: la cuenta publicitaria `ONIA Ads`
`1073680778314945` **está activa y la campaña ya está creada en pausa** (`120253773124020022`,
lifetime USD 35, stop 2026-09-05), pero `has_payment_method` es **false en las dos cuentas** —
verificado por API el 2026-08-13. **No se puede amplificar ni un dólar.**

Son tres bloqueos apilados, no uno: sin método de pago no hay pauta · sin página vinculada no hay
formulario de leads ni destino de mensajería · sin pixel disparado (`last_fired_time` = epoch 0)
no hay optimización a conversión.

**Lo que esto significa para el ciclo comentario→DM:** el flujo está probado y funciona, pero
**su volumen de entrada es cero por diseño**. Un embudo perfecto conectado a una audiencia de 23
personas produce lo que produjo el 18-ago: un comentario de Sergio y uno de una conocida.

### 5.2 — 🔴 La cola se apaga sola el 02-sep

Quedan **6 carruseles** (21, 24, 26, 28, 31-ago y 02-sep). Después, nada. Y lo que queda sin
producir es casi todo de venta —las 3 piezas de `ui-patterns` piden las tres SISTEMA, más las 6
placas por rubro—, así que ni siquiera se puede programar tal cual sin romper la regla de 1 de
cada 4.

**El agente de contenido no salva esto:** escribe texto y lo deja en la cola de aprobación. Entre
ese borrador y un post programado hay un render y una llamada a la API que dispara una persona.

### 5.3 — ⚠️ Una sola red, una sola cuenta

30+ proveedores en el código de Postiz, **uno conectado**. Todo el sistema apuesta a que
Instagram funcione. Si Instagram no convierte, no hay plan B encendido — hay plan B *instalado*,
que no es lo mismo.

Y dentro de esa única red, una sola cuenta: la de Lucía existe pero no publica. **El carril
entero de "el medio" —el que junta la audiencia que al vendedor le falta— está construido en
docs y apagado en la calle.**

### 5.4 — ⚠️ El DM se manda solo; la conversación que abre, no

El Private Reply se entrega en un segundo, 24/7. Lo que pasa después es Sergio mirando el
teléfono. Y el reloj corre: la ventana de conversación de Meta es de **24 h** desde el último
mensaje de la persona, y **en Instagram no existe el seguimiento en frío** — si se pasa, se
perdió. El DM automático a las 2 de la mañana sirve solo si alguien responde dentro del día.

### 5.5 — ⚠️ Los topes de DM que respetamos son de fuente secundaria

El freno de 24 h por persona está implementado y probado. Pero la cifra que lo justifica (1 DM
automático por usuario cada 24 h, 750 private replies/hora, 200 DM/hora) viene de blogs de
proveedores de automatización, **no de la documentación oficial de Meta**. El único número medido
contra la API en todo este circuito es el cupo de publicación (`quota_total: 100`/24 h).

El freno se deja igual: es conservador y es el comportamiento correcto aunque el número exacto
difiera. Pero no se le dice a un cliente que es un dato verificado.

---

## 6. Lo que este doc corrige de docs anteriores

| Doc | Lo que decía | Lo que hoy es cierto |
|---|---|---|
| `ONIA_POSTIZ_COMENTARIOS_DM_20260817.md` §5 | *"⏸️ Automatizar comentario→DM en Instagram: bloqueado por S6"* | **S6 nunca bloqueó nuestras cuentas.** `@oniahq` tiene rol en nuestra propia app y opera con Standard Access. Probado el 2026-08-18 y ya corregido en `ONIA_AUTOMATIZACION_MENSAJES_20260818.md` §10.1 — pero el doc del 17-ago **quedó sin actualizar y todavía se lee como vigente** |
| `ONIA_CICLO_COMENTARIO_DM_20260815.md` §4 | El ciclo comentario→DM es **manual**, *"cuando se resuelva S6 este mismo guion se convierte en respuesta automática"* | Ya se convirtió. El guion lo manda n8n `gWrVHU8OxI9yugc4` sin humano |
| `hermes-content/contenido/LUCIA.md` §1 | *"Cuenta de Instagram: 🔴 no existe todavía"* | **La cuenta existe** (la creó Sergio). Lo que no existe es su conexión a Postiz — que es un bloqueo distinto y más chico |
| `hermes-content/contenido/ONIAHQ.md` §4 | *"Los 7 carruseles están en cola"* / *"el primero sale el mié 19-ago"* | El #1 salió el **18-ago** (se adelantó para probar el ciclo con un post real). Quedan **6** en cola |
| `ONIA_AUTOMATIZACION_MENSAJES_20260818.md` §1.4 y §8(a) | *"Conectar `@oniahq` a ManyChat gratis, empezar acá esta semana"* | El propio doc se desdice en §11.6 (*"ManyChat: no"*). Las dos recomendaciones conviven en el mismo archivo; **la vigente es la de §11.6** |

⚠️ **No toqué esos archivos** — este carril es solo `docs/` y este doc. Corregirlos en su
propia fuente queda anotado como pendiente.

---

## 7. Cómo se verifica que esto sigue siendo cierto

Sin correr nada pago ni publicar nada:

```bash
# ¿Qué hay en la cola de Postiz?
node scripts/postiz_schedule.mjs --key-file <archivo-con-la-apikey> --list

# ¿Sigue vivo el webhook de comentarios? (debe devolver 403 con token falso)
curl "https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/ig-comment?hub.mode=subscribe&hub.verify_token=intruso&hub.challenge=x"

# ¿Cuánto cupo de publicación queda?
GET /me/content_publishing_limit   (token de @oniahq, el que usa Postiz)
```

⚠️ **No tocar los pasos "Add all required permissions" ni "Generar tokens de acceso"** en el
panel de Meta: regeneran el token de la cuenta, **y ese token es el que Postiz usa para
publicar**.
