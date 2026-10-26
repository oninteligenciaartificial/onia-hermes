# Circuito comentario→DM — estado real, contado

> **Fuente de verdad del tema.** Sin fecha en el nombre a propósito: este archivo se EDITA,
> no se duplica. Si un doc con fecha dice otra cosa sobre este circuito, gana este.
>
> **Última cuenta en vivo: 2026-08-27.** Todo lo de abajo se contó ese día contra la
> instancia viva (`n8n-sergio_n8n`, `https://n8n-sergio-n8n.hqdqgh.easypanel.host`) y contra
> la Graph API de Instagram, en solo lectura. Nada se citó de un doc anterior.

---

## 0. Veredicto en una línea

✅ **CORREGIDO 2026-08-28: el circuito ENTREGA.** Ejecución `60728` del workflow activo
(`1jS4jwmNmvcQpqqH`): `mrsatiras__` comentó "Sistema" en un post de @oniahq y Meta devolvió
un `message_id` real, no un error. **Es la primera entrega verificada a alguien que no es
Sergio.**

⚠️ **Lo que cambió no fue el código: fue el comentario.** Los 5 rechazos anteriores tenían
`from_id` de prueba inventados, que Meta rechaza (`error 100 / 2534014`). Hacía falta que
comentara una persona real desde una cuenta real. Los arreglos del 27-ago (el IF `Se
entregó?`, liberar el freno, marcar la ejecución fallida) no causaron la entrega — hacen que
un fallo se VEA, que es otra cosa y sigue haciendo falta.

> Texto original del veredicto, que quedó viejo y se conserva para que se entienda de dónde
> venía el dato: *"El circuito está ENCENDIDO y recibe eventos reales, pero NUNCA entregó un
> DM a un lead de verdad. El único DM que Meta aceptó en toda la historia fue el 18-ago,
> dirigido a Sergio mismo, desde un workflow que hoy está APAGADO."*

🔶 **Sigue faltando la respuesta pública** al comentario ("Enviado ✅ revisá tu DM"): es otra
API (`POST /{comment_id}/replies`) y nunca se construyó. Sergio lo notó en la prueba.

**OpenReply: robar idea, no adoptar.** Lo que pide de Meta ya lo tenemos resuelto, así que no
nos ahorra el setup; lo que sí tiene (cola con reintentos y tope de 750/hora) son dos ideas
que copiamos en 20 líneas, sin traer Postgres + Redis + Next.js + Resend a un VPS que ya se
ahogó una vez.

---

## 1. El dato heredado era falso

Ocho prompts de contenido y el lead magnet descansaban sobre esto:

> *"el circuito comentario→DM está vivo desde el 18-ago, workflow n8n `gWrVHU8OxI9yugc4`,
> 4 eventos reales de Meta"*

Esa frase está copiada literal en `historial/ONIA_CICLO_COMENTARIO_DM_20260815.md`,
`historial/ONIA_POSTIZ_COMENTARIOS_DM_20260817.md`, `historial/ONIA_RECORRIDO_24_7_20260820.md` y en una ficha de
`references/video-intake/analisis/`. **Nadie la volvió a contar en 9 días.** Contada hoy:

| Lo que decían los docs | Lo que hay en la instancia (2026-08-27) |
|---|---|
| `gWrVHU8OxI9yugc4` es "el bueno" y está activo | **Está APAGADO.** Su última ejecución fue el 2026-08-19 |
| Hay un workflow del ciclo | Hay **CUATRO** con el mismo nombre exacto; solo `1jS4jwmNmvcQpqqH` está activo |
| "vivo y probado en producción" | El activo nunca entregó un DM. Ver §3 |

Cómo se contó (solo lectura, sqlite de n8n copiada a `/tmp` del VPS):

| Workflow | Activo | Nodos | Última edición | Ejecuciones |
|---|---|---|---|---|
| `gWrVHU8OxI9yugc4` | **no** | 13 | 2026-08-18 | 12 el 18-ago, 2 el 19-ago |
| `a6oNbAU2MFA0JgRw` | no | — | 2026-08-20 | 1 el 20-ago |
| `QPMbnfnZQtB1WmOQ` | no | — | 2026-08-21 | 1 el 20-ago |
| `1jS4jwmNmvcQpqqH` | **SÍ** | 14 | 2026-08-24 03:11 | 82 (ver §3) |

De paso, recuento de la instancia entera: **87 workflows, 44 activos.** Coincide con la
memoria `n8n-ops-pendientes` — ese dato sí sobrevivió al recuento.

---

## 2. Lo que SÍ está vivo (verificado hoy, no supuesto)

Toda la cañería está sana. Esto no es el problema.

| Pieza | Cómo se verificó | Resultado |
|---|---|---|
| Workflow activo | consulta a la base de n8n | `1jS4jwmNmvcQpqqH`, activo, 14 nodos |
| Webhook GET (verificación de Meta) | `curl` con `hub.verify_token` correcto | **200** + devuelve el challenge |
| Webhook GET con token malo | `curl` con token inválido | **403 forbidden** (rechaza bien) |
| Token IG @oniahq | `GET /me` a graph.instagram.com | vivo — `27942557688720145`, BUSINESS |
| Token IG Lucía | `GET /me` | vivo — `28357585133845376`, MEDIA_CREATOR |
| Token IG Sergio | `GET /me` | vivo — `37718852144430113`, MEDIA_CREATOR |
| Suscripción de webhooks @oniahq | `GET /me/subscribed_apps` | `["messages","comments"]` |
| Suscripción Lucía | idem | `["messages","comments"]` |
| Suscripción Sergio | idem | `["comments"]` |
| Freno de 24 h | `ls /opt/onia/ig-dm-sent/` | vacío — nadie bloqueado, el test puede correr ya |
| VPS | `uptime` | load 0.84, `docker ps` responde. **Ya no está estrangulado** |

**Llegan eventos reales.** El último es del 2026-08-26 13:56 UTC (ejecución 59454): una
persona real, `@jorge.henrich`, comentó "Ranking" en un post de la cuenta de Sergio. El
webhook lo recibió, lo parseó y lo clasificó bien. Ver §4 sobre por qué eso igual fue un lead
perdido.

---

## 3. Lo que NO está probado: la entrega

Se revisaron **las 105 ejecuciones con datos** de los 4 workflows y se extrajo la respuesta
literal de Meta en cada intento de envío. Hubo **6 intentos en total**:

| Ejec. | Fecha | Workflow | A quién | Respuesta de Meta |
|---|---|---|---|---|
| 54943 | 18-ago 23:06 | gWrVHU8OxI9yugc4 | `@prueba_lista` (from_id inventado) | error 100 / 2534014 "The requested user cannot be found" |
| **54952** | **18-ago 23:18** | **gWrVHU8OxI9yugc4** | **`@sergio_urcullo`** | **OK — `message_id` real** |
| 56012 | 20-ago 17:59 | a6oNbAU2MFA0JgRw | `@prueba_onia` (inventado) | error 100 / 2534014 |
| 56024 | 20-ago 18:02 | QPMbnfnZQtB1WmOQ | `@p1` (inventado) | error 100 / 2534014 |
| 56176 | 21-ago 00:05 | 1jS4jwmNmvcQpqqH | `@prueba_v8` (inventado) | error 100 / 2534014 |
| 56177 | 21-ago 00:05 | 1jS4jwmNmvcQpqqH | `@prueba_v8b` (inventado) | error 100 / 2534014 |

Léase de nuevo: **el workflow que hoy está activo intentó enviar 2 DMs y Meta rechazó los
dos.** El único envío que Meta aceptó fue a Sergio, hace 9 días, desde el workflow apagado.

**Y ese camino ya no se puede repetir.** El 24-ago se agregó `2935350173474443` — el
`from_id` de Sergio — a la lista anti-bucle `MIOS`. O sea: si Sergio comenta hoy desde
`@sergio_urcullo`, el workflow lo descarta como `comentario_propio`. **La única prueba que
alguna vez funcionó es hoy irrepetible por diseño.** El test de §6 necesita una tercera
persona, no a Sergio.

### Las 5 ejecuciones "success" del 24-ago no fueron envíos

Se abrieron una por una: fueron un rechazo 403 (token de verificación malo) y eventos
`messaging` con `is_echo` (ecos de DMs propios) que el filtro descarta. Cero DMs.

### La tormenta del 24-ago

72 ejecuciones en error entre las 01:38 y las 02:36 UTC del 24-ago: el nodo Code murió con
"Task request timed out" porque la instancia se ahogó con ecos de DMs propios. **Ya está
arreglado** (03:11 del mismo día) con un IF nativo que filtra antes de tocar el task runner.
Bien resuelto y bien documentado en el nodo. No es un pendiente.

---

## 4. Hallazgos — cosas rotas que NO toqué

n8n estaba en solo lectura esta sesión (había un despliegue corriendo en el mismo VPS). Todo
esto queda escrito, sin ejecutar.

**H1 — Un fallo de envío se guarda como "success". ✅ RESUELTO 2026-08-27.**
> Se agregaron 4 nodos al workflow `1jS4jwmNmvcQpqqH` (14 → 18, sigue activo):
>
> ```
> Enviar DM privado → Se entrego?
>    [SI]  → Avisar a Sergio
>    [NO]  → Liberar freno 24h → Avisar FALLO → Marcar ejecucion fallida
> ```
>
> - **`Se entrego?`** distingue `message_id` (entregó) de `error`. Es lo único que
>   separaba las dos cosas y no existía.
> - **`Liberar freno 24h`** llama a `ig-dm-token.sh release` — cierra H2: el lead deja de
>   quedar bloqueado un día por un error que no fue suyo.
> - **`Avisar FALLO`** manda un mensaje **distinto** al de éxito. Antes salía el mismo con
>   el error adentro, así que un fallo se leía como un envío.
> - **`Marcar ejecucion fallida`** deja la ejecución en estado **error**. Sin esto seguía
>   en `success` y el monitor de salud (`drFWP7nttzvtZzso`) no la veía: busca errores, y
>   nunca había ninguno. Va **último** para no perder ni la liberación ni el aviso.
>
> `neverError` se deja puesto a propósito: sirve para poder LEER la respuesta de Meta.
> Lo que faltaba no era quitarlo, era **mirar lo que devuelve**.
>
> Verificado: webhook GET devuelve el challenge (200), token malo 403, POST 200, cero
> conexiones rotas. Backup del workflow anterior en
> `/opt/onia/n8n-bak-1jS4jwmNmvcQpqqH-20260827215700.json`.
>
> Texto original del hallazgo:

El nodo `Enviar DM privado` tiene `neverError: true` y `onError: continueRegularOutput`. Meta
devuelve un error, el workflow sigue como si nada y n8n marca la ejecución **success**. Por
eso 5 rechazos seguidos nunca dispararon una alarma. Es literalmente "un 200 con cara de
éxito": el monitor de salud de n8n (`drFWP7nttzvtZzso`) tampoco los ve, porque busca
ejecuciones en estado error. Falta un IF después del envío que distinga `message_id` de
`error` y avise distinto.

**H2 — El freno de 24 h se quema aunque el DM no salga. ✅ RESUELTO 2026-08-27 (mitad).**
> **NO se movio el `touch` a despues de confirmar**, aunque era lo obvio: si la
> confirmacion fallara, la persona recibiria **DMs duplicados**, y eso Meta lo penaliza.
> El freno preventivo protege contra el fallo caro.
>
> En cambio se agrego un modo **`release <from_id>`** a `/opt/onia/ig-dm-token.sh`, que
> libera el freno cuando el envio NO salio. Si el `release` falla, degrada al
> comportamiento de hoy (bloqueado 24 h): **falla hacia el lado seguro.**
>
> Probado en vivo: `consume` frena el segundo intento · `release` libera · `consume`
> vuelve a dejar pasar. Valida el `from_id` (un `abc; rm -rf /` devuelve
> `from_id_invalido`, no se ejecuta). Es idempotente.
>
> El script **ahora esta versionado** en `hermes-content/deploy/vps-ops/ig-dm-token.sh`
> — vivia SOLO en el VPS siendo parte de un circuito vivo. No lleva secretos: el token
> se lee de la base en tiempo de ejecucion.
>
> ✅ **La otra mitad tambien quedo**: el nodo `Liberar freno 24h` del workflow llama a
> `release` en la rama de fallo (ver H1).
>
> Texto original del hallazgo:

`/opt/onia/ig-dm-token.sh` hace `touch` del archivo de la persona ANTES de que se intente el
envío. Si Meta rechaza, esa persona queda bloqueada 24 h igual. Un lead real que comente en
un mal momento se pierde por un día entero sin que nadie se entere (por H1). El `touch`
debería ir después de confirmar `message_id`.

**H3 — El PDF de la palabra HUMO da 404. ✅ RESUELTO 2026-08-27.**
> El archivo existia, pero en el repo del PRODUCTO (`onia-platform`), cuyo `/recursos` esta
> detras de login. `onia.com.bo` lo sirve `onia-landing`, que se construye desde
> `web-factory/apps/onia-platform/public/` — y ahi solo estaba el PDF de LISTA. Se copio a
> esa fuente (durable, sobrevive el proximo deploy) y al runtime vivo.
> **Ojo:** copiarlo no alcanzo — Next standalone indexa `public/` al arrancar y siguio
> dando 404 hasta reiniciar el contenedor. Hoy responde **200, 306.319 bytes,
> `application/pdf`**.
>
> Texto original del hallazgo:

El DM de Lucía para HUMO manda a `onia.com.bo/recursos/5-herramientas-ia-bolivia.pdf`.
**Hoy responde 404** (verificado desde el VPS y desde afuera). El propio comentario del
workflow dice que la palabra se encendió el 23-ago porque "el PDF existe y responde 200 en
producción" — se verificó una vez y nunca más. La palabra está activa: si alguien comenta
HUMO hoy, recibe un link muerto.
El de LISTA (`lista-por-donde-empezar.pdf`) sí responde **200**.

**H4 — `cal.onia.com.bo` está caído: 502, y no hay contenedor.**
El host responde 502 en la raíz y en `/onia/consulta-inicial`, desde dos puntos distintos.
`docker ps -a` no muestra **ningún** contenedor de cal, ni parado. Esto importa fuera de este
carril: **el lead magnet decidido para el otro lote es "agendar demo en cal.onia.com.bo"**, y
ese host no existe. El DM actual no lo usa (manda a `onia.com.bo/?src=...`, que responde 200),
así que el circuito no está roto por esto — pero cualquier pieza que mande a cal, sí.

**H5 — La cuenta de Sergio se come leads en silencio.**
El evento real del 26-ago: `@jorge.henrich` comentó "Ranking" en un post de Sergio. "RANKING"
es una de las 7 palabras planificadas de su marca personal, pero su mapa de palabras está
vacío a propósito (esperan la comunidad de WhatsApp). Resultado: la persona no recibió nada
**y Sergio tampoco recibió aviso** — la rama de alerta solo dispara para cuentas SIN mapear, y
la de Sergio sí está mapeada. Un lead real levantó la mano y nadie se enteró. Barato de
arreglar: avisar por Telegram cuando una cuenta mapeada recibe una palabra que tiene planeada
pero apagada.

**H6 — El `entry_id` de Lucía sigue sin fijar.**
Lucía entra por el default `DESCONOCIDA`. Funciona por casualidad (el default usa su token),
pero significa que **cualquier cuenta no mapeada cae en el token de Lucía**. Es la clase de
cosa que manda un DM desde la cuenta equivocada el día que se conecte una cuarta cuenta.

---

## 4.b El flujo de COMUNIDAD que pidio Sergio (2026-08-28)

Sergio paso un PDF con el flujo manual que hace hoy y un audio de 24 s. **El flujo tal
como esta dibujado NO se puede automatizar**, y el motivo esta en la documentacion de Meta.

### Lo que pedia, y por que no entra

| Paso del PDF | Se puede? |
|---|---|
| 1. Responder publicamente al comentario ("Enviado / revisa tu dm") | 🟡 si, pero es OTRA API (`POST /{comment_id}/replies`). Hoy no lo hacemos |
| 2. DM corto de presentacion | 🟢 es lo que ya hacemos |
| 3. Mandar el audio | 🔴 **NO.** La private reply de Instagram es **solo texto** |
| 4. Si responde QUIERO ENTRAR, mandar el link | 🔴 falta suscribirse al webhook `messages` |

🔴 **Y el bloqueo mayor: Meta permite UN solo mensaje por comentario.**
> *"Only one message can be sent to the commenter"*

Los pasos 2 y 3 son dos DMs desde el mismo comentario. **Nunca los dos.**

### La salida, que ademas es mejor

La misma doc de Meta la da:
> *"Follow-up messages can only be sent if the recipient responds, and must be sent
> within 24 hours of the response"*

**La respuesta de la persona es la llave.** El flujo queda:

1. **Respuesta publica** al comentario — nodo nuevo
2. **UN DM de texto** que tiene que GANARSE la respuesta (es el unico disparo)
3. Responden → se abre la ventana de 24 h → **ahi entra el audio** (mensaje normal, si
   admite adjunto) y el link
4. Todo dentro de esas 24 h

**El audio no va primero: va despues de que respondan.** No es una concesion — se lo gana
quien mostro interes, no cualquiera que escribio una palabra. Y el propio guion del audio
ya pedia una respuesta, o sea que ya estaba pidiendo justo lo que abre la ventana.

### Limites de Meta que hay que tener escritos

- **1 private reply por comentario**, para siempre
- **Solo texto** en la private reply
- **7 dias** desde el comentario
- Despues de que responden: ventana de **24 h**
- **1 adjunto por mensaje**, y o texto o media, **nunca los dos**
- 750 private replies/hora · audio y video 10/segundo

### El texto propuesto para ese unico DM

Pendiente de aprobacion de Sergio. Tiene que hacer el trabajo de los pasos 2 y 3 juntos:

```
Ey! Vi que comentaste SISTEMA 👋

Estamos armando una comunidad para los que quieren usar IA de verdad, no para
leer noticias sobre IA: herramientas, sistemas y cosas que aplicas el mismo dia.

Respondeme QUIERO ENTRAR y te paso el acceso — te mando tambien un audio corto
contandote como la venimos planteando.
```

⚠️ **El codigo NO debe exigir la frase exacta.** "QUIERO ENTRAR" es buena instruccion
para el copy, pero cualquier respuesta abre la ventana de 24 h: quien escriba "quiero
entrar", "dale", "me interesa" o un simple "si" tiene que recibir lo mismo. Exigir el
match exacto pierde leads que ya dijeron que si.

### Lo que falta para construirlo

- 🔴 **Suscribirse al webhook `messages`.** Hoy solo escuchamos `comments`: **no nos
  enteramos si alguien responde**, y sin eso los pasos 3 y 4 no existen. Es el bloqueo real.
- Nodo de respuesta publica al comentario
- El audio en una URL publica (`onia.com.bo/recursos/` ya sirve archivos, verificado)
- Rama que detecta la respuesta afirmativa
- **El link de la comunidad**: existe (grupo de WhatsApp, dado por Sergio el 2026-08-28).
  🔴 **No se escribe en este doc ni en el nodo**: un link de invitacion es una credencial
  — cualquiera que lo tenga entra. Va por `$env` en el contenedor de n8n, como el resto
  de los secretos. Sergio puede rotarlo desde WhatsApp si se filtra.
- La cuenta de Lucia necesita su propia voz: este texto esta escrito para @oniahq

## 5. El test de punta a punta — PREPARADO, pendiente de Sergio

No lo ejecuté: publicar un comentario en Instagram es publicar contenido y necesita permiso
explícito. Queda todo definido para que sea un solo movimiento.

**Quién comenta: NO Sergio desde `@sergio_urcullo`.** Su `from_id` está en la lista anti-bucle
(§3) y el comentario se descarta. Hace falta una tercera persona real, o una segunda cuenta
personal de Instagram que nunca haya comentado antes.

| Qué | Valor exacto |
|---|---|
| **Post** | Carrusel de @oniahq del 21-ago — `https://www.instagram.com/p/DcUd8uakZsk/` (el del cuaderno/Excel) |
| **Comentario a escribir** | `SISTEMA` — sola, sin nada más (también sirve `LISTA`) |
| **Desde** | Una cuenta de Instagram que NO sea @oniahq, @lucia.antelo.oficial ni @sergio_urcullo |
| **DM que debe llegar** | "Hola! Vi tu comentario. Te dejo el link para agendar el diagnostico de 20 minutos…" + `https://onia.com.bo/?src=onia-ig-sistema` |
| **Dónde mirarlo (1)** | **En la bandeja de DMs de la cuenta que comentó.** Este es el único que prueba algo: hay que VER el mensaje |
| **Dónde mirarlo (2)** | Telegram de Sergio (chat 6830070978): debe llegar "IG comentario -> DM [oniahq]" |
| **Dónde mirarlo (3)** | n8n → ejecuciones de `1jS4jwmNmvcQpqqH` |

**Trampa que hay que decir en voz alta:** el aviso de Telegram llega **igual si Meta rechaza
el envío** — el mensaje incluye "Meta respondio:" con el error adentro. Los 5 rechazos de §3
mandaron su aviso a Telegram como si todo hubiera ido bien. **El aviso de Telegram NO es la
prueba. La prueba es el DM visto en la bandeja.**

**Una sola bala por persona.** Por H2, si el envío falla la persona queda bloqueada 24 h. Si
el test falla, el reintento va desde OTRA cuenta, no desde la misma.

**Si el DM llega:** el circuito queda probado punta a punta por primera vez, y se corrige la
primera línea de este documento con la fecha de ese día.
**Si no llega:** mirar la respuesta de Meta en la ejecución. Un `error 100 / 2534014` con un
`from_id` real (no inventado) significaría que el permiso de mensajería no alcanza para
terceros — ahí sí hay que hablar de App Review, y eso cambia los 8 prompts que dependen de
esto.

---

## 6. OpenReply — las tres preguntas

`github.com/diwenne/openreply` · MIT · **~1.700 estrellas** (eran 753 el 2-ago: está creciendo
rápido) · Next.js 16 + React 19, Prisma 7 + Postgres, BullMQ sobre Redis, Auth.js + Resend.
Usa la API oficial de Instagram con Instagram Login — no scrapea ni automatiza navegador.

### 6.1 — ¿Maneja algo que el nuestro no?

| | OpenReply | Nosotros |
|---|---|---|
| **Rate limit de Meta** | Respeta el tope documentado de **750 private replies por hora** por cuenta y **encola** el excedente en vez de tirarlo | **Nada.** No hay ningún tope. Solo un freno de 1 DM por persona cada 24 h, que es otra cosa |
| **Reintentos** | Cola durable en BullMQ; registra cada envío, salto y fallo con su motivo | **Nada.** Fire-and-forget, y el fallo se guarda como éxito (H1) |
| **Ventana de 24 h** | Bandeja propia para responder dentro de la ventana de Meta | No aplica: nuestro flujo es private reply al comentario y termina ahí. La conversación sigue en Chatwoot |
| **Multi-cuenta** | Varias cuentas por workspace, cada una con sus propios límites | Un objeto JS hardcodeado, con una cuenta sin mapear que actúa de default (H6) |
| **Respuesta pública** | Además del DM, puede dejar un comentario público visible | No lo hacemos |

Resumen honesto: **sí, tiene tres cosas que no tenemos** — tope por hora con cola,
reintentos, y límites por cuenta. Las tres importan recién cuando haya volumen. Hoy el
circuito procesa eventos de a uno por día.

### 6.2 — ¿Qué pide de Meta que nosotros ya tengamos resuelto?

**Todo lo de Meta ya lo tenemos.** Esta es la parte decisiva:

| Lo que OpenReply exige | Nuestro estado |
|---|---|
| App de Meta tipo Business + producto Instagram (Instagram Login) | ✅ hecho |
| `instagram_business_basic`, `..._manage_comments`, `..._manage_messages` | ✅ operando en Standard Access |
| Webhook suscrito a `comments` y `messages` | ✅ verificado hoy en las 3 cuentas |
| Verify token + endpoint HTTPS | ✅ `onia-ig-2026`, responde 200/403 correcto |
| App Review + Advanced Access **solo para conectar cuentas ajenas** | ⛔ pendiente, **igual para OpenReply que para nosotros** |

Es decir: adoptarlo **no nos ahorra ni un paso de configuración de Meta**, porque el trabajo
duro de Meta ya está hecho. Y tampoco nos destraba vender esto a clientes: OpenReply necesita
exactamente el mismo App Review que necesitamos nosotros.

Lo que sí traería de nuevo, y hay que pagarlo: **Postgres + Redis + un worker BullMQ + una app
Next.js + Resend/SMTP**, todo en el VPS. Ese VPS ya se ahogó una vez este mes (§3, la tormenta
del 24-ago) y estuvo penalizado por Hostinger.

### 6.3 — Decisión

> **ROBAR IDEA.** No adoptar: la parte cara (la configuración de Meta) ya la tenemos resuelta,
> así que OpenReply no ahorra setup — solo agrega cuatro servicios a un VPS de 4 vCPU con
> antecedentes de saturación, para un circuito que hoy mueve un evento por día. Se le copian
> dos cosas concretas y baratas: **(1) que un fallo de envío no se guarde como éxito** (H1) y
> **(2) que el freno no se queme antes de confirmar la entrega** (H2). Se anota su tercer
> aporte para cuando haya volumen: **750 private replies/hora por cuenta**, encolar en vez de
> tirar.

Cuándo reabrir esta decisión: si alguna vez operamos cuentas de clientes (post App Review) y
hay más de una decena de cuentas. Ahí el panel multi-cuenta con límites por cuenta deja de ser
lujo. Hasta entonces, no se toca.

---

## 7. Ancla de venta — cuánto cuesta ManyChat

Verificado en el sitio de ManyChat (modelo de precios de marzo 2026). **Ojo con la letra
chica: los números que circulan son los de pago ANUAL.**

| Plan | Mes a mes | Pagando anual | Contactos activos |
|---|---|---|---|
| **Business** | **US$ 99/mes** | US$ 69/mes (US$ 828/año) | 7.500, después US$ 0,025 por contacto extra |
| **Advanced** | **US$ 199/mes** | US$ 139/mes | 25.000 · 10 asientos de usuario · 5 de bandeja |

Cómo usarlo frente a un cliente que ya lo paga: el número honesto para comparar es el que **él
está pagando**. Si está mes a mes, son **US$ 99 o US$ 199 mensuales** — no 69 ni 139. A tipo de
cambio real (memoria `bolivia-devaluacion-2026-impacto`), US$ 99/mes es plata seria para una
pyme boliviana, y es un costo recurrente en dólares que además sube con los contactos.

**Regla:** esto es un ancla de ahorro, no una promesa de paridad. ManyChat hace mucho más que
comentario→DM. Se compara la función que el cliente realmente usa, no el producto entero — y
por ahora, hasta que el test de §5 pase, ni siquiera podemos afirmar que la nuestra entrega.

---

## 8. Cómo re-contar esto la próxima vez (para no volver a heredarlo)

Tres comandos, todo solo lectura. Si alguien va a repetir "el circuito está vivo", que primero
corra esto:

1. **¿Cuál workflow está activo?** — buscar "Comentario IG" en n8n. Hay cuatro con el mismo
   nombre; importa cuál tiene el interruptor encendido, no cuál dice el doc.
2. **¿Ejecutó hace poco y con qué resultado?** — mirar las ejecuciones de ESE id. Un workflow
   activo que no ejecuta hace días no es un circuito vivo.
3. **¿Meta aceptó el envío?** — abrir la ejecución y leer la respuesta del nodo `Enviar DM
   privado`. Si dice `message_id`, se entregó. Si dice `error`, no se entregó **aunque la
   ejecución figure como success** (H1).

Y la regla que este documento existe para imponer: **un aviso de Telegram y una ejecución en
verde no son entrega. La entrega se mira en la bandeja de DMs.**
