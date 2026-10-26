# @oniahq — plan y estado

> La cuenta del **vendedor**. Reglas de qué puede publicar: [`README.md`](README.md).
> Verificado en Instagram el 2026-08-16: la cuenta **existe**, es **profesional**
> (categoría "Empresa de software"), está **vinculada a la página de Facebook "Onia"**
> — o sea que cumple el requisito de la API — y tiene **0 publicaciones · 22 seguidores**.

---

## 1. La bio — ✅ cambiada el 2026-08-16

**Lo que decía y por qué salió:**

> ~~*"Facturá al SIAT, agendá y cobrá sin tipear una sola línea."*~~

La facturación al SIAT está bloqueada por el NIT (bloqueo S2). Prometerlo en la bio es peor
que prometerlo en un post: la bio la lee todo el que cae.

**Lo que dice ahora** (Instagram contó 130/150):

```
Nombre:  Onia · Sistema con IA

Un solo sistema: agenda, cobros, inventario y caja.
Reemplaza el cuaderno, el Excel y el WhatsApp suelto.
Santa Cruz, Bolivia 🇧🇴
```

*Por qué así: la primera línea nombra la plataforma por sus módulos; la segunda nombra las
tres cosas que el comprador tiene en la mano AHORA — que es el dolor de los carruseles 1 y 2.*

⚠️ No dice "obligatorio por ley" ni menciona el SIAT. **Cuando el NIT esté, se suma.**

---

## 2. Los dos tipos, y el cierre es aparte

Sergio: *"los carruseles tienen que ser informativos o de venta."*

**El TIPO es uno de dos. El CIERRE es una decisión distinta**, y confundirlos fue el error
del plan anterior (donde "engagement" figuraba como si fuera un tipo de contenido, cuando en
realidad es una forma de cerrar).

| Tipo | Qué hace | Cierres posibles |
|---|---|---|
| 📚 **Informativo aplicado** | enseña algo usable sobre SU negocio | *"Guardalo"* · una pregunta barata |
| 🎯 **Venta** | producto, precio, prueba, oferta | la palabra clave |

**Regla de cadencia: máximo 1 de cada 4 piezas pide la palabra clave.** Un feed donde cada
post cobra peaje entrena a la gente a scrollear, y el algoritmo lo castiga antes que la gente.

---

## 3. Inventario real — qué está listo y qué no

### Listo y renderizado

| # | Pieza | Tipo | Cierre | Estado |
|---|---|---|---|---|
| 1 | WhatsApp a mano | 📚 informativo | pregunta | ✅ |
| 2 | R.I.P. al cuaderno | 📚 informativo | pregunta | ✅ |
| 3 | 3 procesos a mano | 📚 informativo | guardalo | ✅ |
| 4 | El costo invisible | 📚 informativo | guardalo | ✅ |
| 7 | Tu competencia ya vende con IA | 📚 informativo | pregunta | ✅ |
| 8 | Paradigma de escala | 🎯 venta | **SISTEMA** | ✅ |
| 9 | Recibo itemizado | 🎯 venta | **LISTA** | ✅ |
| 10-12 | 3 piezas de `ui-patterns` (upload · carrito · chat) | 🎯 venta | **SISTEMA** | ⚠️ ver abajo |

### Escrito, falta renderizar

| Pieza | Tipo | Nota |
|---|---|---|
| 6 placas por rubro (dental · comercio · importadora · estética · veterinaria · servicios) | 🎯 venta | texto listo en `docs/historial/ONIA_KIT_VENTA_POR_RUBRO_20260815.md` |

### Bloqueado por algo que no es contenido

| Pieza | Qué lo bloquea |
|---|---|
| Antes/después de web | **no hay ninguna web de cliente entregada.** `web-factory/data/clients/` tiene 9 contextos: **8 son demos** (`clinic-demo`, `dashboard-demo`, `demo`, `dental-demo`, `engineering-demo`, `restaurant-demo`, `saas-demo`, `skincare-demo`) y el noveno es **Nuvia, proyecto propio de Onia**, no un cliente. El pipeline ya está probado con Nuvia |

### 🔀 Dos piezas se mudaron a Lucía (2026-08-16)

**"Mitos de la IA"** y **"5 tareas que la IA hace mejor"** fallaron la prueba del vendedor:
le sirven igual a un estudiante, a un freelance de Bogotá y a un curioso. Tres de nueve
portadas decían "IA" — para una cuenta que vende un sistema de gestión, eso apunta al
público equivocado, y el algoritmo aprende a quién mostrarte.

No son piezas malas: **son piezas de Lucía que estaban en el feed de ONIA**. Van a
[`LUCIA.md`](LUCIA.md) tal cual, sin reescribir. Quedan **7 piezas**, todas hablándole al
comprador.

### ✍️ Tres cierres reescritos para que terminen en plata

El gate pide que el dolor termine en algo que se cobra, se pierde o se deja de ganar.
Solo 3 de 9 lo hacían. Al leerlos apareció además una incoherencia que el gate no ve:
**el titular del último slide pedía una cosa y el cuerpo otra.**

| Pieza | Antes | Ahora |
|---|---|---|
| WhatsApp a mano | *"Soltá el WhatsApp"* + "decime el número" | *"Contá los no respondidos"* + **"multiplicá por tu ticket promedio"** |
| R.I.P. al cuaderno | *"Poné tu negocio en orden"* + "te digo por dónde empezar" | *"Cuaderno, Excel o memoria"* + **"cuántas veces cobraste de menos"** |
| 3 procesos a mano | *"Pedí tu diagnóstico gratis"* + *"Guardalo"* ← se contradecían | *"Empezá por uno"* + **"poné cuánto vale tu hora"** |

Ninguna inventa una cifra: le piden al lector que ponga **sus** números.

### ⚠️ El problema que queda

**Las 3 piezas de `ui-patterns` cierran las tres pidiendo SISTEMA.** Van seguidas rompen la
regla de 1 de cada 4. Hay que intercalarlas entre los informativos.

---

## 4. ✅ PROGRAMADO en Postiz — 2026-08-17 (corregido y reemplazado el mismo día)

### 🔴 Lo que se encontró antes de que saliera el primero

Dos días antes de la primera publicación, una revisión contra
`web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` encontró **tres defectos que ya estaban en
la cola**:

| Qué | Alcance | Estado |
|---|---|---|
| **Una cifra sin fuente**: *"El 40% de los leads no vuelve si no respondés en 5 min"* | 3 piezas | ✅ eliminada, y saneada la plantilla `_sample.json` de donde se contagió |
| **Captions pidiendo palabras eliminadas** (AUTO, COSTO, ESCALA, ORDEN, LIBRE) | 5 piezas | ✅ reescritos: los informativos piden guardar, solo los de venta piden palabra |
| **La penúltima slide cerraba** en vez de abrir — la regla que dispara el completion rate | 6 piezas | ✅ reescrita para dejar una pregunta que el CTA recoge |

Las 6 piezas se re-renderizaron, se reprogramaron y **los posts viejos se borraron**.
Verificado en la base: 7 posts, sin duplicados, sin palabras muertas.

Los 7 carruseles están **en cola** (`state = QUEUE`, `releaseURL` nulo, cantidad de
imágenes coincidente):

| Fecha (19:00 Bolivia) | Pieza | Tipo | Cierre | Slides |
|---|---|---|---|---:|
| **mié 19-ago** | WhatsApp a mano | 📚 | pregunta | 8 |
| **vie 21-ago** | R.I.P. al cuaderno | 📚 | pregunta | 7 |
| **lun 24-ago** | 3 procesos a mano | 📚 | guardalo | 6 |
| **mié 26-ago** | El costo invisible | 📚 | guardalo | 7 |
| **vie 28-ago** | Tu competencia ya vende con IA | 📚 | pregunta | 5 |
| **lun 31-ago** | Paradigma de escala | 🎯 | **SISTEMA** | 8 |
| **mié 02-sep** | Recibo itemizado | 🎯 | **LISTA** | 1 |

**5 informativos y 2 de venta, y los dos de venta van al final.** Cumple la regla de 1 de
cada 4 sin forzarla.

**Se puede editar o cancelar en Postiz hasta el 19-ago** — el primero no sale antes.

### Cómo se programa — ahora hay script

La primera vez se hizo a mano y hubo que redescubrir la API entera para corregir. Ya no:

```bash
node scripts/postiz_schedule.mjs --key-file <archivo-con-la-apikey> --slides hermes-content/carousels/out/<slug> --caption-from hermes-content/carousels/briefs/<slug>.json --date 2026-08-19T23:00:00.000Z
```

También `--list` y `--delete <postId>`. El script aborta si la respuesta viene en HTML —el
error del `200` de abajo— en vez de dárla por buena.

**La apiKey no vive en el repo.** Sale de la base de Postiz en el VPS:
`docker exec postiz-postgres psql -U postiz-user -d postiz-db-local -t -A -c 'SELECT "apiKey" FROM "Organization" LIMIT 1;'`

Por debajo, la API pública, base `https://postiz.onia.com.bo/api/public/v1`, `apiKey` en el
header `Authorization`:

```
POST /upload   multipart file=@slide.png   → {id, path}
POST /posts    {type:"schedule", date:"…T23:00:00.000Z", posts:[{
                 integration:{id:"cmsw091nx0001lq9c8kr6dsg8"},
                 value:[{content:<caption>, image:[{id,path}…]}],
                 settings:{post_type:"post"}   ← OBLIGATORIO, si falta da 400
               }]}
DELETE /posts/<id>
```

⚠️ **Trampa que costó una vuelta:** el frontend (`:4007`, o el dominio sin `/api`) devuelve
**200 con el HTML del login** para cualquier ruta `/public/v1/*`. Parece que funciona y no es
la API. La API real está bajo **`/api`** y un `400` con mensaje JSON es la señal de que llegaste.

### 🔴 Lo que falta para las semanas siguientes

Después del 02-sep no hay nada en cola. **Y casi todo lo que queda sin producir es de venta:**
las 3 piezas de `ui-patterns` (las tres piden SISTEMA) y las 6 placas por rubro.

**Antes de programar la semana 4 hay que producir 2-3 informativos nuevos** e intercalarlos, o
el feed se vuelve una seguidilla de pedidos.

**Historias:** los días que hay carrusel, una sola — la portada + "link en bio". Sin producción.

### ✅ Los hashtags salieron del caption (2026-08-17)

Los 7 posts llevan ahora un **comentario automático** que Postiz publica sobre la propia
publicación apenas sale, con los hashtags y el link `?src=`. El caption quedó limpio: sus dos
primeras líneas son las que deciden si alguien abre el post, y una pared de hashtags las
entierra.

Se hace con `value[1]` en la llamada a la API — `value[0]` es el post, del segundo en adelante
son comentarios. Ya está en `scripts/postiz_schedule.mjs`, no hay que hacer nada a mano.

⚠️ **Esto NO es responder comentarios de otros.** Postiz no puede, en ninguna red. El detalle
completo —y qué sí se puede— está en
[`../docs/historial/ONIA_POSTIZ_COMENTARIOS_DM_20260817.md`](../docs/historial/ONIA_POSTIZ_COMENTARIOS_DM_20260817.md).

---

## 5. Cómo se mide

**La métrica del negocio es una: reuniones agendadas con `?src=`.** Pero **no se le pide a
cada post** — se le pide al conjunto.

Cada pieza se mide por su tipo: los informativos por **guardados**, los de venta por
**reuniones**. Un informativo con 40 guardados y 0 reuniones está haciendo su trabajo.

Cada pieza lleva su `?src=onia-<slug>`. El circuito `?src=` → panel → Cal está vivo y probado.

**Umbral a las 3 semanas:** 0 reuniones → el problema es el contenido o el canal, se cambia
de formato · 1-2 → hay señal, se amplifica ESE ángulo con pauta · 3+ → funciona, segunda tanda.

---

## 6. Qué falta para publicar el primero

| # | Qué | Quién |
|---|---|---|
| 1 | ~~Cambiar la bio (sacar SIAT)~~ | ✅ hecho |
| 2 | ~~Armar el PDF de **LISTA**~~ | ✅ hecho |
| 3 | ~~Conectar `@oniahq` en Postiz~~ | ✅ hecho — `instagram-standalone`, activa y sin refresh pendiente |
| 4 | ~~Programar la semana 1~~ | ✅ hecho el 2026-08-17 — los 7 están en cola, ver §4 |

✅ **No queda ningún bloqueo.** La cuenta existe, es profesional, está vinculada a la página
de Facebook, la bio ya no promete el SIAT, las dos palabras clave tienen recurso y Postiz
está conectado. **La semana 1 ya está programada (§4); el primero sale el mié 19-ago.**
