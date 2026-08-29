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

### ⚠️ Verificar ANTES de borrar — el riesgo real

El circuito de DMs manda con un token que sale de `/opt/onia/ig-dm-token.sh` **en el VPS**, y
desde el repo **no se puede saber qué app lo emitió**. Si lo emitió una de las tres viejas,
borrarla mata el circuito de @oniahq.

**Se comprueba sin tocar el VPS:** en Integraciones comerciales, cada app tiene **"Ver y editar"**,
que muestra los permisos concedidos. La que tenga los de mensajes y comentarios de Instagram es
la que está en uso. **Mirar eso primero.**

Búsqueda hecha el 29-ago: en el repo **no hay nada vivo** que nombre a las tres viejas — solo
docs de `historial/`. Ojo con el falso positivo: *"OnIA Agency"* aparece en
`ONIA_CHATBOT_LINEA_DE_ENTREGA.md` y en `N8N_WORKFLOW.md`, pero ahí es el nombre de la **cuenta
de Chatwoot**, no de la app de Meta. Distinta cosa.

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

- **Qué app emitió el token del circuito** — necesita el VPS (carril de otra sesión) o el
  "Ver y editar" de cada integración.
- **La lista de apps del lado de Instagram** — `instagram.com/accounts/manage_access/` pidió
  login y no se inició sesión. No hace falta igual: la app usa **Facebook Login for Business**,
  así que los permisos que importan viven del lado de Facebook.
- **Si la app debería ser Proveedor de tecnología** — hoy no lo es. Eso limita venderle el
  circuito a **clientes**, no el uso sobre las cuentas propias.
