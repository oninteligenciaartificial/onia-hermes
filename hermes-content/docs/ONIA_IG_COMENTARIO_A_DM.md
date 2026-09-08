# Comentario en Instagram → recurso por DM

**Cómo se configura una palabra por video, qué hace falta antes de encenderla, y por
qué está armado así.** Doc vivo, sin fecha: se edita.

Todo lo de acá está medido contra el workflow vivo `ONIA - Comentario IG -> DM
(Private Reply)` (id `1jS4jwmNmvcQpqqH`, n8n, **activo**), no recordado.

---

## 1. Qué hace, en una línea

Alguien comenta una palabra en un reel → le llega **un DM privado con el recurso**, una
sola vez, y a Sergio Urcullo le llega el aviso por Telegram.

## 2. Por qué esto NO te hace banear

| decisión | por qué importa |
|---|---|
| Usa la **Private Reply API** (`recipient: {comment_id}`) | Es la vía oficial de Meta: responde **al que comentó**, atado a su comentario. No es un DM frío a una lista |
| **Un solo envío por persona cada 24 h** | `/opt/onia/ig-dm-token.sh consume` pone el freno **antes** de enviar. Nadie recibe dos |
| **Anti-bucle por `from_id`** | Los ids propios de las tres cuentas están excluidos. Sin eso, un comentario de Sergio Urcullo en su propio post se trataba como lead y se auto-enviaba un DM (medido el 2026-08-24) |
| **No responde comentarios en posts ajenos** | El webhook sólo entrega los de las cuentas conectadas |

Lo que sí banea —DM a quien no te escribió, volumen, automatizar por vías no
oficiales— este circuito no lo hace.

## 3. 🔴 Lo que falta antes de encender la primera palabra

**El webhook no valida la firma de Meta.** Probado el 2026-09-08: se le mandó un
comentario **inventado** desde el VPS con `curl` y lo procesó como real.

Hoy es inofensivo porque no hay palabras activas y ningún envío se dispara. **Con una
palabra activa deja de serlo:** cualquiera que conozca la URL del webhook puede hacer
que la cuenta le mande un DM a quien quiera. Eso no es sólo un agujero de seguridad —
es exactamente el comportamiento por el que Meta cierra una cuenta.

Meta firma cada evento con `x-hub-signature-256` (HMAC-SHA256 del cuerpo con el *App
Secret*). El evento real de hoy la traía; nadie la mira. **Se valida antes de activar
la primera palabra, no después.**

⚠️ Es la misma clase que `calcom-booking`, que tiene la validación apagada por falta de
`CALCOM_WEBHOOK_SECRET` (`CLAUDE.md`, tabla de secretos de n8n).

## 4. La regla que decide si una palabra existe

> **Una palabra no se activa hasta que su recurso esté publicado y responda 200.**

Ya estaba escrita para las palabras por cuenta y se mantiene. Una palabra sin recurso
es **peor** que ninguna: la persona comenta, recibe un link roto, y esa es la única
impresión que le queda de la marca.

Por eso la cuenta `@sergio_urcullo` tiene la tabla vacía a propósito: sus siete
palabras del mes 1 esperan a que exista la comunidad detrás.

## 5. Cómo se configura una palabra POR VIDEO

Hasta el 2026-09-08 las palabras eran **por cuenta**: todos los reels de una cuenta
compartían el mismo repertorio, así que no se podía prometer un recurso distinto en
cada video — que es como se usa esto de verdad.

Desde entonces hay una capa **por video**, con la clave `media.id` del reel, que el
webhook **ya mandaba y nadie leía**.

**Nace de un caso real, no de una idea:** el 2026-09-07 12:59 `@dencordovat` comentó
`Video` en el reel `18121876976495586`. El sistema lo recibió, lo entendió, y no le
mandó nada — `motivo: sin_palabra_clave`. La ejecución figura en `success`.

### Los tres datos que hacen falta por video

1. **El `media_id` del reel** — sale del link del post, o del aviso de Telegram
2. **La palabra**, en MAYÚSCULAS (el texto del comentario se compara en mayúsculas)
3. **El mensaje del DM**, con el link del recurso adentro

### Dónde se escribe

Nodo `Parsear comentario` del workflow, en la constante `VIDEOS`:

```js
const VIDEOS = {
  '18121876976495586': {
    VIDEO: 'Hola! Ahí va lo que te prometí en el reel: …\n\nhttps://onia.com.bo/recursos/xxx.pdf',
  },
};
```

**La tabla del video gana sobre la de la cuenta.** Así un reel puede prometer algo
propio sin romper `SISTEMA` ni `LISTA`, que siguen andando para el resto.

### Antes de dar por hecha una palabra

- [ ] El recurso responde **200** (`curl -o /dev/null -w "%{http_code}"`)
- [ ] La firma del webhook se valida (§3)
- [ ] Se probó con un comentario real, y llegó el DM — **no alcanza con que la
      ejecución diga `success`**: ver §6

## 6. Por qué "success" no prueba nada

El nodo de envío tiene `neverError`, así que **un rechazo de Meta se guardaba como
ejecución `success`**. Encontrado el 2026-08-27: cinco rechazos seguidos quedaron en
verde y el aviso de Telegram salió igual, con el error adentro.

Está resuelto y conviene no volver a romperlo:

- `Se entregó?` mira que Meta haya devuelto **`message_id`**;
- si no, se **libera el freno de 24 h** (si no, la persona queda bloqueada un día por
  un error ajeno), sale un aviso **distinto** al de éxito, y la ejecución se marca
  **fallida** — si quedara `success`, el monitor de salud no la ve.

## 7. Lo que hay hoy, medido

| cuenta | `entry_id` | palabras activas |
|---|---|---|
| `@oniahq` | `17841423363059652` | `SISTEMA`, `LISTA` |
| `@sergio_urcullo` | `17841441395192146` | **ninguna, a propósito** |
| Lucía (por defecto) | *sin fijar* | `SISTEMA`, `HUMO` |
| **por video** | `VIDEOS` | **ninguna todavía** — la capa está, los datos los pone Sergio Urcullo |

⏳ **El 2026-10-01 Meta cierra la ventana gratis de 24 h.** Conviene tener el circuito
probado de punta a punta antes de esa fecha.
