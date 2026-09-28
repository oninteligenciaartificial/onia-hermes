# El chat con `mrsatiras__` — la fuente real de los reels, y cómo se cosecha

**2026-08-21.** Sergio pidió entrar a su Instagram y mirar los videos él mismo. La conversación
con **`mrsatiras__`** es donde le mandan lo que le gusta — o sea, **es la fuente del carril**.

---

## Lo que se verificó entrando

| | |
|---|---|
| Cuenta | `sergio_urcullo` — 33 publicaciones, 409 seguidores, 500 seguidos |
| Bio | *"Emprendedor · fundador de @oniahq · sistemas, chatbots y webs con IA · hecho en bolivia, construyendo para latam"* |
| Enlaces | `www.tiktok.com/@sergiourcullom` y 1 más |
| **Guardados** | **vacío** — no hay colecciones ni elementos |
| Sus publicaciones | son **reels**, no fotos |
| Otras cuentas en el navegador | `lucia.antelo.oficial` y `oniahq` |
| Hilo | `instagram.com/direct/t/17842603284520515/` |

> ⚠️ *Nota del 2026-09-25: `sergio_urcullo` era el handle ese día. La cuenta de Sergio Urcullo
> se renombró después a `@sergiourcullo` (commit `2ee86efb`, 06-sep): es la misma cuenta.*

**Los guardados están vacíos.** Todo lo que le interesa vive en ese chat, no en una colección.

---

## El patrón — esto es el hallazgo, más que los links

Lo que le mandan son **cuentas de prompts de IA**, y las tres identificadas funcionan igual:
**muestran el resultado y gatean el prompt detrás de "comment X"**.

`luxry.ai` · `bluuu.ai` · `prompts.ig` · (y aparece `rafaelafreitascs`)

**El prompt no lo dan nunca.** Lo único que queda a la vista es la imagen — que es exactamente
lo que la skill [`sacar-prompt`](../../../.claude/skills/sacar-prompt/SKILL.md) convierte en prompt.

---

## Los tres recuperados

### `bluuu.ai` — [/p/DcI9w9GEnZH/](https://www.instagram.com/p/DcI9w9GEnZH/) · el que más sirve

Caption, verbatim:

> *"Caught at the desk. On the rooftop. In the mirror. At the night market. In the lobby. At the
> pool's edge. This is **CAUGHT LIVING — 9 AI prompts built around the moments you actually
> live. No sets. No studios. Just real scenes, relit with editorial light.** Every prompt is
> tuned for **Higgsfield Soul 2.0** — candid energy, cinematic skin…"*

**Por qué importa:** Soul es el motor que ya usamos para Lucía. Son **9 escenas de vida
cotidiana** —escritorio, azotea, espejo, mercado nocturno, lobby, borde de pileta— que es
justamente el pilar que a Lucía le falta producir.

**Los prompts están gateados**, pero las 12 láminas están bajadas y las escenas se reconstruyen.

**Defecto de IA visible y útil de recordar:** en la lámina 3 el **texto del libro es garabato**.
Regla: no poner texto legible en cuadro salvo que se controle.

### `luxry.ai` — [/p/DcLiEpCGJne/](https://www.instagram.com/p/DcLiEpCGJne/)

> *"No reservation. No dress code. No bill. Just a prompt. 🍷 … **every table you see here was
> built from a single text prompt**."*

Cafés parisinos, bares de espresso martini, comedores de terciopelo rojo. **Este SÍ muestra el
prompt sobre la propia imagen** (`birthday cake, wine glass, outdoor lights, shot at…`).
9 láminas bajadas.

### `prompts.ig` — [/p/DcPTX07yAOA/](https://www.instagram.com/p/DcPTX07yAOA/)

Video de 35 s, "THIS GIRL?". Bajado, sin analizar todavía.

---

## Cómo se cosecha el hilo — lo que funciona y lo que no

Probado el 2026-08-21, para no repetir el intento:

| Método | Resultado |
|---|---|
| Leer `href` de los posts compartidos en el DOM | ❌ **no existe.** Solo se expone el link del autor, no el del post |
| Clic por coordenada fija + leer `location.pathname` | ⚠️ **funciona pero repite.** La lista es virtualizada; con scroll fijo el clic cae siempre en el mismo |
| Scroll programático del contenedor | ❌ `scrollTop` no se mueve |
| API propia de IG (`/api/v1/direct_v2/threads/…`) | ❌ **500**, y al variar parámetros el navegador **bloquea** por cookie/query string |
| **Clic + `location.pathname` + volver, con esperas de 2 s** | ✅ **es el único que sirve.** ~3 links por lote |

**Conclusión operativa:** cosechar el hilo entero por navegador es lento y frágil. **El camino
bueno sigue siendo que Sergio pegue el link**: bajar + desglosar + reconstruir el prompt toma
un minuto por pieza con el pipeline que ya existe.

---

## Lo que sigue

1. **Reconstruir las 9 escenas de "CAUGHT LIVING"** como fragmentos para Lucía — están tuneadas
   para Soul 2.0, que es nuestro motor, y cubren el pilar de vida cotidiana que hoy no produce.
2. Analizar `prompts.ig` (video, bajado).
3. El resto del hilo: a medida que Sergio los pegue.
