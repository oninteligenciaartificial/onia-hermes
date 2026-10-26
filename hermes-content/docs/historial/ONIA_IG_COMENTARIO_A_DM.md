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

## 3. La firma del webhook — armada y en MODO OBSERVAR

**Estado al 2026-09-08:** el circuito **verifica la firma de Meta y todavía no rechaza
nada**. Falta un solo dato, y sólo lo puede dar un comentario real.

### Por qué se hizo así

El agujero era real y está medido: se le mandó al webhook un comentario **inventado**
con `curl` y lo procesó como real. Hoy es inofensivo porque no hay palabras activas;
con una palabra activa, cualquiera que conozca la URL puede hacer que la cuenta le
mande un DM a quien quiera — que es el comportamiento por el que Meta cierra cuentas.

### Cómo está armado

| pieza | dónde corre | por qué ahí |
|---|---|---|
| `/opt/onia/ig-firma.sh` | **en el VPS** | el App Secret vive ahí y **nunca entra a n8n**. Sin esto habría que meter el secreto en n8n, que corre en Swarm: cambiar una variable es reiniciar el servicio |
| `Firma: preparar` | n8n | saca los **bytes crudos** y los pasa a **base64** — sin caracteres que el shell interprete, que es la trampa de escapado de la skill `onia-infra` §1 |
| `Firma: verificar` | nodo SSH | reusa la credencial que el circuito ya tenía |
| `Firma: veredicto` | n8n | **anota y deja pasar** |

🔴 **Se necesitan los bytes CRUDOS, no el JSON re-serializado.** Medido: el cuerpo
parseado y vuelto a serializar daba **282 bytes contra los 306** que Meta declaró en
`content-length`. Por eso el webhook pasó a `rawBody: true`.

### Por qué observa y no bloquea todavía

Hay **dos apps de Meta** en el sistema (`1562215408796050` en `.hermes/.env`, con su
secreto; `1078962684709749` en `app.env`) y **no se sabe cuál firma este webhook**.

**Activar el rechazo con el secreto equivocado tira TODOS los comentarios reales, y no
se nota hasta que alguien pregunta por qué no le llegó nada.** El script prueba los dos
candidatos y dice cuál sirvió; el veredicto queda anotado en cada ejecución.

### Verificado el 2026-09-08, de punta a punta

| prueba | resultado |
|---|---|
| Evento **firmado** con `META_APP_SECRET` | `firma_ok: true` · `crudo_confiable: true` · **282 bytes = 282 declarados** |
| Evento **sin firma** | `firma_ok: false` · `sin_cabecera_de_firma` |
| El parser, en ambos casos | sigue funcionando, sin regresión |
| El secreto en la salida | **no aparece** |

### Lo que falta (pasos 5 y 6)

5. **Un comentario real de Meta** con su firma. El veredicto va a decir cuál secreto coincide.
6. **Pasar a bloquear**: `Firma: veredicto` corta cuando `firma_ok` es falso. Recién ahí
   se activa la primera palabra.

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
