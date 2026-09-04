# Graphify: el mapa del repo que sobrevive a la sesión

- **Fuente:** https://www.instagram.com/p/DcjRvK1EZWE/ · @ingenierobinario.com
- **Tipo:** IA · **Veredicto:** SIRVE YA
- **Cobertura:** las 12 láminas, al 100%. Carrusel, sin audio.

---

## Qué muestra, textual

**Portada:** *"Tu agente de código **tiene amnesia** — 5 pasos para darle memoria permanente"*.

**Lámina 2 — el costo, con la cuenta hecha en pantalla:** *"Cada vez que abres una sesión, tu
agente empieza de cero."*

| Qué hace | Archivo | Tokens |
|---|---|---|
| Hace grep | `grep -r "auth" .` | 3.240 |
| Abre archivos | `src/auth/service.py` | 8.900 |
| | `src/auth/middleware.py` | 6.100 |
| Los lee enteros | `src/auth/tokens.py` | 4.750 |
| | `src/users/model.py` | 5.300 |
| | `tests/test_auth.py` | 11.200 |
| Piensa qué debe cambiar | `config/settings.py` | 2.480 |
| | `README.md` | 1.900 |
| | …buscar qué cambiar | 2.870 |
| | **TOTAL** | **46.740 tok** |

Y el remate: *"**El problema: tira todo a la basura apenas cierras.**"*

**Lámina 3 — la solución:** *"darle un **mapa** que sobreviva a la sesión. Y puede ser un grafo
de toda la vida."* Nodos del grafo: **Archivo · Función · Clase**. *"Se llama **Graphify** y es
100% open source. **(Esto NO es publicidad)**"*.

**Requisitos:** Python 3.10 o superior · un repositorio de Git · tu asistente favorito.

**`01` Instala el paquete**

```bash
uv tool install "graphifyy[office,mcp]"
```

> ⚠️ *"El paquete es `graphifyy` con dos `y`. El comando que instala es `graphify`, con una."*

**`02` Registra la skill**

```bash
# Si usas Claude Code
graphify install
# Si usas Codex
graphify codex install
```

> *"Añade `--project` si quieres que viva **dentro del repo** y tu equipo lo herede con un
> `git pull`."*

**`03` El archivo que casi nadie crea** — `.graphifyignore`

```
node_modules/
dist/
build/
.next/
coverage/
*.min.js
package-lock.json
pnpm-lock.yaml
```

> *"Graphify **no lee tu `.gitignore`**. Son archivos distintos, con propósitos distintos. Si no
> creas este archivo, parseará tu `node_modules` entero y el grafo será un **95% dependencias de
> terceros**."*

El caption lo marca como el paso crítico: *"El más importante es el tercero: si te lo saltas, el
grafo te sale inservible."*

**`04` Construye el grafo**

```
En Claude:  /graphify .
En Codex:   $graphify .
```

> ⚠️ *"Hazlo **dentro del asistente**, no en la terminal."* Y la razón, que es de plata: *"Desde
> el asistente, la extracción se despacha como **subagentes de tu suscripción**. Desde la
> terminal, tendrás que ingresar una **API Key de pago**."*

**La salida** — carpeta `graphify-out/` con tres archivos:

| Archivo | Para qué |
|---|---|
| `GRAPH_REPORT.md` | *"Léelo primero. God nodes, comunidades, conexiones que no sabías que tenías."* |
| `graph.html` | el grafo interactivo, en el navegador |
| `graph.json` | *"el grafo que consultan tu agente y la CLI"* |

**`05` Mantén la memoria viva**

```bash
graphify hook install
```

> *"Reconstruye el grafo en cada commit. Los cambios de código puro **no cuestan un solo
> token**."* Y la advertencia: *"**Este paso no es opcional.** Un grafo desactualizado es peor que
> no tener grafo, porque tu agente confía en él y te cita líneas que ya no existen."*

**Cierre:** *"Tu agente va a seguir sin memoria entre sesiones… **pero tampoco la necesita** — el
mapa ya está en el repo, esperándolo. ¿Tu agente trabaja con **contexto**, o con **suerte**?"*
**CTA:** `Comenta 'AUDITAR'`.

---

## Cómo está hecho — la reconstrucción

- **El argumento entero descansa en una cuenta, y por eso convence.** No dice "los agentes son
  ineficientes": muestra 46.740 tokens desglosados archivo por archivo. Es el mismo recurso que
  usa el mejor material de venta del corpus — el número primero, la solución después.
- **La arquitectura es vieja a propósito**, y lo dice: *"puede ser un grafo de toda la vida"*.
  Archivo → Función → Clase. No inventa nada; conecta una estructura conocida a un problema nuevo.
- **El paso 3 es el que decide si sirve o no.** Sin `.graphifyignore`, el grafo es 95%
  dependencias de terceros — o sea, ruido caro. Que el autor lo marque como el crítico y explique
  *por qué* (`.gitignore` y `.graphifyignore` no son el mismo archivo) es lo que separa este
  carrusel de un tutorial cualquiera.
- **El paso 4 esconde el dato de costo más útil:** correrlo desde el asistente lo despacha como
  subagentes de la suscripción; desde la terminal exige API key de pago. La misma tarea, dos
  precios.
- **Y el paso 5 es el que casi nadie hace:** el hook de commit. Sin él, el grafo envejece y el
  agente cita líneas que ya no existen — que es peor que no tenerlo, porque ahora miente con
  confianza.

### Por qué esto nos toca hoy, y no en abstracto

El 2026-08-28 Sergio cortó un lote a mitad preguntando por qué se gastaban tantos tokens. La
respuesta de ese caso eran las imágenes, y se arregló bajando los fotogramas a 640px. **Pero la
otra mitad del gasto es exactamente lo que este carrusel describe:** cada sesión de este repo
vuelve a descubrir dónde están las cosas.

⚠️ **Antes de instalar nada hay que mirar un solapamiento.** En el stack ya hay una skill
`understand-anything` que construye grafos de conocimiento de un codebase. **Puede que ya
tengamos esto y no lo estemos usando** — sería la tercera vez en esta sesión que algo "nuevo"
resulta ser algo que ya estaba (pasó con el estándar de handoff y con la `GEMINI_API_KEY`).

## El estilo, como conocimiento portable

Dos fondos que alternan por bloque: **azul cobalto `#2B6BE8`** para los pasos numerados y **azul
casi negro `#0E1729`** para el contexto y el cierre. Numeral gigante en semibold, semitransparente,
arriba a la izquierda; título debajo. Los bloques de código van en tarjeta negra con etiqueta de
lenguaje arriba a la derecha (`BASH`, `PLAINTEXT`, `AGENTE`). **Las advertencias son tarjetas
blancas** con icono circular y rótulo `CUIDADO` / `IMPORTANTE` — el único elemento claro de todo
el carrusel, y por eso el ojo va directo ahí. Verde menta `#3DDC97` sólo para el subrayado a mano
del titular y para los datos del grafo. Cornisa fija: `ingenierobinario.com` abajo-izquierda,
`← Desliza` abajo-derecha, en las 12. Mascota pingüino ilustrada en las dos últimas.

**Se porta a:** `hermes-content/references/ui-patterns/carrusel-tutorial-tecnico/` — el molde de
paso numerado con tarjeta de código y tarjeta blanca de advertencia. Es el mejor molde de
tutorial técnico del corpus.

## Las tres preguntas

1. **Frente:** ninguno de producto — es **herramienta de trabajo interno**, y toca el costo de
   todas las sesiones del repo.
2. **Herramienta nuestra:** puede que ya la tengamos. La skill `understand-anything` construye
   grafos de conocimiento de un codebase. Hay que comparar antes de sumar otra.
3. **Qué falta:** nada para evaluarlo — es open source y el carrusel trae los comandos exactos.

## Lo que NO se puede afirmar

- **La inconsistencia del propio post:** el caption promete *"7 pasos"*, la portada dice *"5
  pasos"* y el carrusel muestra `01`–`05`. Son cinco. Es el segundo post de esta tanda con el
  número inflado en el gancho (el otro decía "7 empleados" mostrando 6).
- **Los 46.740 tokens no tienen fuente.** Es un ejemplo ilustrativo del autor, no una medición
  publicada. El orden de magnitud es creíble; el número exacto no se cita como dato.
- **No verifiqué que el paquete exista** ni que los comandos funcionen. Están transcritos de
  pantalla, incluida la trampa del nombre con dos `y`.
- Nada sobre el audio: es carrusel.

**Prompt:** [S01](prompts-lote-2026-08-28/S01-graphify-memoria-permanente-del-agente.md)
