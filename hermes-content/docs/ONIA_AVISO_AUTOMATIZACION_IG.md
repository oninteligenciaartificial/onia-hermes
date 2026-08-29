# Aviso de automatización en @sergio_urcullo — la causa, verificada

> **Estado: causa identificada mirando las pantallas el 2026-08-29.** Este doc se reescribió
> entero ese día. Todo lo anterior eran hipótesis, y las cuatro principales resultaron falsas.
> Se borraron a propósito: un doc que conserva hipótesis muertas manda a la próxima sesión al
> mismo callejón.

Instagram le mostró a Sergio, dos veces (**24-ago** y **28-ago-2026**):

> *"We suspect automated behavior on your account. To prevent your account from being
> temporarily restricted or permanently disabled, ensure that no other users or tools have
> access to your account…"*

**La cuenta afectada es `@sergio_urcullo`** — la única de las tres con audiencia real (411).

---

## La causa: seis integraciones, cuatro apps nuestras

En **Facebook** (no en Instagram) → Configuración y privacidad → Configuración →
**Integraciones comerciales** — `facebook.com/settings?tab=business_tools`:

| App | Conectada desde | Qué es |
|---|---|---|
| ads MCP server | 6 ago 2026 | conector de Claude (Meta Ads) |
| Developer Tools MCP | 3 ago 2026 | conector de Claude (Meta DevTools) |
| ONIA Marketing API | 6 jul 2026 | app nuestra |
| **OnIA Social API** | 30 may 2026 | app nuestra — **la única viva** |
| OnIA Agency | 19 may 2026 | app nuestra |
| Onia Agency Chatbots | 1 may 2026 | app nuestra |

**Cuatro apps de Meta distintas creadas una encima de otra desde mayo**, más dos conectores.
Seis cosas con acceso a la misma cuenta. El aviso dice literal *"no other users or tools have
access"*: le estamos dando exactamente esa lectura.

**Y la secuencia cierra.** La app pasó a modo activo el **13-ago** (única alerta en su buzón de
desarrollador). Primer aviso: **24-ago**. Segundo: **28-ago**.

La otra lista, "Apps y sitios web", solo tiene **Garena Free Fire** de dic-2020, caducada.
Irrelevante.

---

## 🔴 Las cuatro hipótesis que se cayeron

Se guardan porque saber qué NO es vale tanto como saber qué sí.

| Hipótesis | Por qué se cayó |
|---|---|
| **"La app está en modo desarrollo / el negocio sin verificar"** | El panel dice **Publicada**, sin acciones requeridas. La verificación estaba hecha hacía rato. Lo dijo Sergio y la pantalla lo confirmó |
| **"El equipo de Samuel publica con otra herramienta"** (ManyChat) | Sergio, 29-ago: *"no usan ManyChat con nosotros, él no usa nada con nosotros"*. Cero herramientas de terceros sobre la cuenta |
| **"Es volumen de API"** | Límite de frecuencia de la app: **0% usado** |
| **"Fueron los 3 DMs duplicados"** (24-ago) | Salieron **desde @oniahq hacia él**: Sergio fue el receptor, no el emisor. No explican un aviso en su cuenta |

El patrón del error, las cuatro veces, fue el mismo: **opinar sin abrir la pantalla**.

---

## Lo que NO está pasando, para no apagar de más

Desde su cuenta **no sale ningún DM ni publicación automática**. Su bloque en el workflow
`1jS4jwmNmvcQpqqH` tiene el mapa de palabras **vacío a propósito**, así que los comentarios
entran, se parsean y mueren en `sin_palabra_clave`.

Es un **arma cargada, no un arma disparando**. El día que se active una de sus 7 palabras
planeadas, empieza a mandar Private Replies automáticos desde su cuenta.

---

## Qué hacer

**La acción es una sola y es de Sergio** (o de una sesión con su navegador, con su OK explícito):
sacar de **Integraciones comerciales** las apps que no se usan.

- **Eliminar:** `ONIA Marketing API`, `OnIA Agency`, `Onia Agency Chatbots`.
- **Dejar:** `OnIA Social API` — la que mueve @oniahq.
- **Los dos MCP de Claude:** decisión de Sergio. Si no los usa desde otro lado, fuera también:
  serían 5 accesos menos de 6.

### ✅ Verificado el 29-ago: borrar las tres es seguro

Había un riesgo real: el circuito manda con un token de `/opt/onia/ig-dm-token.sh` **en el VPS**,
y desde el repo no se sabe qué app lo emitió. Si lo emitió una de las tres viejas, borrarla mata
@oniahq.

**Se resolvió sin tocar el VPS y sin tocar la lista de integraciones** — mirando el panel de apps,
`developers.facebook.com/apps/`. Hay **cinco** apps, no cuatro:

| App | ID | Modo | Caso de uso | Portfolio |
|---|---|---|---|---|
| **OnIA Social API** | `2160241918102061` | **Publicada** | Mensajes y contenido en **Instagram** | OniaAgency |
| **Onia Bot** | `1078962684709749` | **Publicada** | Clientes por **WhatsApp** | OniaAgency |
| ONIA Marketing API | `1562215408796050` | En desarrollo | — | OniaAgency |
| OnIA Agency | `1003811625521832` | En desarrollo | — | OniaAgency |
| Onia Agency Chatbots | `36422446950687488` | En desarrollo | — | **Onia Agency** ⚠️ |

**El argumento que cierra:** una app **en modo desarrollo no puede sostener un circuito de
producción** — solo actúa sobre usuarios con rol en la app. Las tres candidatas a borrar están
las tres en desarrollo. Y de las dos publicadas, la única con el caso de uso de Instagram es
**OnIA Social API**. El token del circuito sale de ahí.

⇒ **Borrar `ONIA Marketing API`, `OnIA Agency` y `Onia Agency Chatbots` no rompe nada.**

### Dos cosas que aparecieron de paso

- **`Onia Bot` no estaba en la lista de integraciones de Sergio.** Está publicada y es la de
  WhatsApp: no toca su cuenta personal. No hay que borrarla. Pero tiene **4 alertas sin leer** en
  su buzón de desarrollador — pendiente, fuera de este frente.
- **Hay DOS portfolios comerciales**, `OniaAgency` y `Onia Agency`. `Onia Agency Chatbots` cuelga
  del segundo. Un portfolio duplicado es exactamente la clase de resto que después nadie sabe si
  se puede tocar. Anotado, no resuelto acá.

### Por qué NO se leyó "Ver y editar" de cada integración

Era el plan. El panel de Integraciones comerciales vive en un **iframe cross-origin**: no lo lee
el árbol de accesibilidad ni el DOM de la página madre. La única vía era clickear por coordenada,
y **"Eliminar" está pegado a "Ver y editar"** en la cuenta personal de Sergio. No valía el riesgo
para un dato que el panel de apps daba igual de bien y sin botones destructivos al lado.

### 🔴 Dos trampas — no "arreglar" empeorando

1. **NO apagar el workflow entero** (`1jS4jwmNmvcQpqqH`): mata también @oniahq, la única cuenta
   donde el comentario→DM entrega algo.
2. **NO borrar el bloque de su `entry_id` del nodo «Parsear comentario».** Sin ese bloque sus
   comentarios caen en la cuenta por defecto (**Lucía**), que **sí** tiene SISTEMA y HUMO activas
   — y ahí sí empezaría a mandarle DMs a quien comente en su cuenta.

---

## Lo que sigue vigente del plan de contenido

**En `@sergio_urcullo` se publica A MANO desde el teléfono**, y la cadencia sube gradual. Una
cuenta advertida publicando alto volumen por API es pedirle a Instagram que la restrinja.

**Regla general que sale de esto:** *una sola herramienta de publicación conectada por cuenta, y
las apps de Meta viejas se dan de baja cuando se reemplazan.* Cuatro apps acumuladas en cuatro
meses es lo que se ve desde afuera como una cuenta comprometida.

---

## Blindaje ya puesto en el repo

`scripts/postiz_schedule.mjs` **rechaza** el integration id de Sergio (`cmt39kug…`) con un error
explícito, para que un `--integration` copiado y pegado no publique en su cuenta sin querer.

## Lo que no se pudo verificar

- ~~Qué app emitió el token del circuito~~ — **resuelto el 29-ago**, ver arriba: sale de
  `OnIA Social API`, la única publicada con caso de uso de Instagram.
- **Las 4 alertas sin leer de `Onia Bot`** (la app de WhatsApp). No se abrieron: fuera de este
  frente.
- **Los dos portfolios comerciales duplicados** (`OniaAgency` y `Onia Agency`). Sin resolver.
- **La lista de apps del lado de Instagram** — `instagram.com/accounts/manage_access/` pidió
  login y no se inició sesión. No hace falta igual: la app usa **Facebook Login for Business**,
  así que los permisos que importan viven del lado de Facebook.
- **Si la app debería ser Proveedor de tecnología** — hoy no lo es. Eso limita venderle el
  circuito a **clientes**, no el uso sobre las cuentas propias.
