# Grafo de conocimiento del repo — decisión

**Pregunta:** ¿entra Graphify al stack, para que cada sesión deje de gastar tokens
redescubriendo dónde están las cosas?

---

## Veredicto

**No entra ninguna de las dos — todavía.** Y el motivo NO es el que parecía: no es que
`understand-anything` ya lo cubra. Es que **la tesis que justifica a las dos no tiene una
sola medición a favor y tiene cuatro contra-evidencias medidas.** Construir un grafo de
este repo hoy es gastar para empeorar.

Lo que sí entra, y cuesta 40 minutos: **medirlo antes** (§6).

---

## 1. La trampa en la que casi caigo

El paso 0 decía: mirá si ya tenemos lo mismo antes de sumar algo nuevo. Miré, encontré
`understand-anything` instalada, vi que cada paso del carrusel tenía su gemelo, y **canté
"ya lo cubre" con eso**.

Estaba mal, y el escéptico lo dijo mejor de lo que lo hubiera dicho yo:

> *"la herramienta que no medimos cubre el caso de la herramienta que no medimos. Eso no
> es una comparación: es simetría de ignorancia con el ganador elegido de antemano — y el
> que gana casualmente es el que ya estaba instalado."*

Es exactamente la regla del repo aplicada en mi contra: **verificar es mirar, no suponer,
y un grep sirve para descartar, nunca para confirmar.** Comparé documentación contra
documentación y lo presenté como conclusión.

## 2. Graphify existe, y tiene cosas que la otra no

Se verificó en vivo contra PyPI. Nada de esto sale del carrusel:

- `graphifyy` (dos `y`) está vivo: **v0.9.51 publicada el 2026-08-28**, 219 releases desde
  abril, Apache-2.0. `graphify` con una sola `y` da **404** — el propio README lo avisa.
- **Los cinco comandos del carrusel son reales**, verificados en el código fuente.
- Tiene de más: ingesta de PDFs y videos, exports a Neo4j/GraphML/Obsidian, modo servidor
  MCP, instalación en 17+ agentes, merge-driver de git para el JSON, grafo cross-repo.
- La diferencia **no** es "AST vs LLM": las dos usan tree-sitter.

O sea: descartarla por "ya tenemos algo parecido" habría sido pereza, no análisis.

## 3. Lo que NO se puede dar por cierto

| Afirmación | Estado |
|---|---|
| "46.740 tokens por redescubrir un proyecto" | **Ejemplo del autor del carrusel.** Sin metodología, sin repo, sin control, sin n. Vale cero como evidencia. |
| "7 pasos" (caption) vs "5" (portada) | El carrusel muestra 01-05. **Son cinco.** |
| Calidad del grafo de Graphify | **NO VERIFICADA.** Nadie lo ejecutó. |
| Calidad del grafo de understand-anything | **NO VERIFICADA.** Nunca corrió en este repo. |
| 111.965 estrellas / 1,97M descargas | De la API oficial, sin segunda fuente. Las descargas de PyPI inflan por CI y mirrors: **no son usuarios**. |
| Seguridad de Graphify | **NO AUDITADA.** Instala hooks que interceptan lecturas y en `--strict` **bloquea** que el agente lea código. |

## 4. Las cuatro contra-evidencias, medidas

**(a) El grafo no cabe en contexto.** Proyectado desde los bytes/nodo del grafo demo del
propio plugin: ~7.589 nodos, ~10.420 aristas, **4,42 MB ≈ 1,2 M tokens = 5,8 ventanas de
200k llenas.** No es que salga caro leerlo: es **imposible** leerlo entero. Y ahí muere el
mecanismo de ahorro que la tesis asume.

**(b) El grafo no reemplaza los greps: ES greps, más lentos.** El propio
`understand-chat/SKILL.md` documenta el procedimiento: *"usá Grep dentro del JSON antes de
leer el archivo completo"*. Son ~10 llamadas de herramienta contra un JSON de 4,4 MB.

**(c) El 60% de este repo no tiene gramática.** De los 2.605 archivos que el grafo
ingeriría, **1.047 (40%) tienen tree-sitter y 1.558 (60%) no** — 792 `.md`, 331 `.json`,
184 `.html`, 65 `.sh`, 42 `.sql`. Para esos, el "grafo" es **un resumen escrito por el
LLM**: misma factura de tokens que leerlos, y envejece sin que nada lo note.

> Corrección de paso: "este repo es puro markdown" es **falso**. Medido: 322.626 líneas de
> código contra 284.711 de markdown. Hay más código. El ataque correcto no era ése.

**(d) 🔴 El detector de obsolescencia miente.** El más grave, y no estaba en la evidencia
previa. El hook de auto-update filtra por una whitelist de extensiones y, si no cambió
ninguna, **igual escribe el commit hash nuevo en `meta.json`** y para.

- **`.mjs` no está en la whitelist.** Y son **490 de los 1.047 archivos parseables**;
  `onia-core` entero son 61 `.mjs`. En 30 días se tocaron 121. Ninguno actualizaría nunca.
- **El 85% de los commits** (833 de 980 medidos) no toca la whitelist → sella el grafo
  viejo como fresco.
- El único aviso de "grafo desactualizado" compara ese hash. Con el hash falsificado,
  **el aviso nunca sale**. Y los nodos llevan `lineRange`: son justo los números que
  quedan mal.

Un grafo viejo que se declara fresco es peor que no tener grafo: el agente confía y cita
líneas que ya no existen.

**Bonus de colisión, específico de acá:** `.gitignore` **no** contiene `.ua/`. Con 12
worktrees redirigiendo al mismo archivo de la raíz y el hook Stop haciendo `add -A` en
cada turno, ese JSON de 4,4 MB se commitea entero, una y otra vez, en un `.git` que ya
pesa **8,6 GB**, sobre `main`, que alimenta dos deploys. Es la receta exacta de la
cicatriz de merge que ya está documentada en CLAUDE.md.

## 5. La parte incómoda

`understand-anything` estaba instalada y **nunca corrió**: sus directorios de datos pesan
0 bytes. Y "instalada" es generoso — el motor **no está construido**: la primera corrida
dispara un `pnpm install` de 404 resoluciones, con paquetes tree-sitter que ejecutan build
scripts nativos en Windows. Nadie probó que complete en esta máquina.

Es el mismo patrón que el repo ya tiene escrito como regla: **construido ≠ terminado**.
Una herramienta instalada y apagada vale cero, igual que un flag en off. Sumar Graphify
sin cambiar eso sólo agrega una segunda herramienta apagada.

## 6. Qué se hace ahora

**Nada de instalar. Primero el paso 0 del protocolo de medición**, que es barato:

1. Correr **5 veces** la misma tarea de redescubrimiento sin grafo, y calcular la varianza
   (CV) entre corridas. Sin ese número, cualquier "bajó un 40%" es ruido con cara de dato.
2. Recién si el CV es bajo, comparar contra un brazo con grafo — n=5, intercalado.
3. El umbral se declara **antes** de medir. Propuesto: **40% de baja en tokens de
   entrada**, o no entra.

Trampas del protocolo, ya identificadas: la caché de prompts entre corridas, que la
segunda corrida ya "sabe" la respuesta de la primera, y que el gasto de subagentes puede
no quedar atribuido al transcript (por eso el protocolo los prohíbe durante la medición).

**Y el dolor real de este repo no es el que el grafo resuelve.** Lo que CLAUDE.md
documenta como caro son **cuatro precios vivos del mismo chatbot** — una pregunta de
valor, no de estructura. Un call graph no la contesta. La fuente única de verdad sí.

---

## Si algún día se construye igual

Requisitos mínimos, todos verificados como faltantes hoy:

- `.ua/` en `.gitignore` **antes** de la primera corrida.
- Correr con `UNDERSTAND_NO_WORKTREE_REDIRECT=1`, o los 12 worktrees escriben al mismo archivo.
- Agregar `.mjs`, `.cjs`, `.mts` a la whitelist del auto-update, o el 47% de lo parseable
  nunca se actualiza.
- Excluir `.hermes/` (576 MB), `hermes-content/references/` (3,2 GB), `web-factory/data/`
  (278 MB) y `.agents/` (duplicado exacto de `.claude/skills/`: 715 rutas idénticas, dobla
  el grafo). Sin eso: 12.385 archivos y 5,9 GB, 58% binarios.
