# C08 · Protocolo de la cola de contratos Codex (v2, corregido tras verificador)

Mediciones de solo lectura (gh y git sin fetch, sin escribir). Refs remotas = las del último fetch local.

## Estado medido

### 1. PRs de onia-platform (gh, solo lectura)

| Contrato (archivo hoy en main) | PR | Estado PR | Estado propuesto |
|---|---|---|---|
| B1-bandeja-menos-llamadas | #129 | OPEN | PR |
| B3-app-instalable-pwa | #130 (también #136) | OPEN | PR |
| C11a-reprogramar-y-reserva-avisa | #115 | MERGED | hecha |
| C11b-feriados | #121 CLOSED; #122 MERGED | atribución a #122 SOLO por título | hecha (nota) |
| C13-gracia-y-no-renovar | #113 | OPEN | PR |
| C14-aceptacion-terminos | #124 | OPEN | PR |
| C14-terminos-con-version | ninguno | `gh pr list --search terminos` y `punto-14` solo devuelven #124 y #122 | bloqueada |
| C15-factura-al-aprobar | #114 | MERGED | hecha |
| K1-confirmacion-respuesta | #132 | OPEN | PR |
| K2-recuperar-canceladas | #133 | MERGED | hecha |
| K3-semilla-dental | #134 (+#138) | MERGED | hecha |
| W1-widget-de-chat-propio | #131 (+#137, #140) | OPEN | PR |

Evidencia: `gh pr view 122` → MERGED 2026-10-08, título «...días cerrados (#117 #120 #116 #115 #121)». El contenido de #122 no se abrió: C11b queda con nota.
UNKNOWN: si #124 cubre la versión de los Términos (C14-terminos-con-version). No se midió el diff de #124.
UNKNOWN: si #136 incluye la PWA de B3. No se midió.
Las estados de hecha se basan en PR mergeado; la PRUEBA DE HECHO de cada uno no se re-ejecutó en esta pasada.

### 2. Formato (origin/main, 12 archivos)

- `git ls-tree -r --name-only origin/main hermes-content/docs/handoff/codex-tareas/` → 12 archivos.
- Cabecera `estado:` en las primeras 15 líneas: 0/12. (Medido: `sed -n 1,15p | grep '^estado: '`, 12 de 12 sin cabecera.)
- Nombre sin carril: 12/12.
- Arranque de cada uno: tres estilos (sin preámbulo; «Sos Codex... rama»; «Repo... NO commitees»).
- Id duplicado: regex `^([A-Z][0-9]+[a-z]?)-` sobre los nombres → `C14` aparece 2 veces. La regex de la v1 (`^([^-]+-[^-]+)`) devolvía vacío y NO detectaba el choque: descartada.
- La v1 decía que `git grep '^estado:'` daba 12. Es falso: hoy da 0 (ningún archivo tiene cabecera). Además `_PLANTILLA.md` tiene `estado: pendiente` en columna 0: al commitearla, un conteo sin filtro daría 13.
- `git branch -r | grep codex-tareas` no mide contenido (lista nombres de rama). Descartado.
- `git ls-tree` sobre refs remotas: la carpeta aparece en 15 refs (incluido origin/main). Las copias en ramas son heredadas, no contratos nuevos.

### 3. Costo del detector (medido)

| Bloque | Refs | Tiempo real | Resultado hoy |
|---|---|---|---|
| v1 del README (todas las refs origin) | 183 | 48,8 s | 0 |
| v1 limitado a refs `claude/*` | 145 | 37,5 s | 0 |
| v2 propuesto: `claude/*` con commit en últimos 14 días | 52 | 20,8 s | 0 |
| `git log --remotes=origin/claude/ --not origin/main -- <carpeta>` | - | < 1 s | 29 archivos solo en ramas |

La v1 de C08 decía «0,18 s»: solo medía `ls-tree` de origin/main. Corregido.

### 4. Detector sobre muestra local

Un archivo de prueba con `estado: pendiente` en línea 4 lo detecta; el valor extraído es `pendiente`. Validado en scratchpad, no en git.

### 5. Estado del launcher

`scripts/codex-tarea.sh` no contiene ninguna escritura de `estado:` ni referencia a `codex-tareas` (grep vacío). La madre lanza y actualiza la cabecera a mano. Eso es la fuente del riesgo de relanzar.

### 6. Contradicción README vs C08 v1

- README: los archivos viejos se renombran con `git mv` «al tocarlos por primera vez».
- C08 v1: migrar los 12 en un solo commit.
Decisión: un solo commit (ver Configuración, paso B). Lo que quede a medias es peor que migrar todo junto.

## Brecha

1. Sin estado en el archivo: la madre cruza a mano con GitHub. Hoy 0/12 con cabecera.
2. Sin id único: `C14` choca. La v1 de la prueba no lo detectaba.
3. Detector sin precedencia: la v1 listaba cualquier `pendiente` de cualquier rama y relanzaba una tarea ya hecha en main si una rama vieja tenía el estado. Sin precedencia de main, la madre relanza.
4. `lanzada` sin guarda: si la madre muere después de lanzar Codex y antes de escribir `lanzada`, la siguiente ronda relanza. Hoy el launcher no escribe estado (medido arriba).
5. Contrato que vive solo en una rama `claude/*`: si la rama se borra sin mergear, el contrato se pierde sin rastro. Riesgo real, frecuencia UNKNOWN.
6. Costo: el detector v1 cuesta 48 s por ronda sobre 183 refs.
7. Retorno: nadie actualiza la cabecera al abrirse o mergearse el PR, salvo que la madre lo haga a mano.

## Configuración propuesta

### A. Protocolo en una línea

Main decide. Una nube escribe su contrato en su rama `claude/*`. La madre lo adopta a main (`pendiente`) antes de lanzar. Después main es la única fuente del estado. Así la rama puede borrarse sin perder el contrato y no hay dos estados en vuelo.

### B. Migración (un commit de la madre a main)

Nombres y cabeceras:

```
git mv hermes-content/docs/handoff/codex-tareas/B1-bandeja-menos-llamadas.md   hermes-content/docs/handoff/codex-tareas/plataforma-B1-bandeja-menos-llamadas.md
git mv hermes-content/docs/handoff/codex-tareas/B3-app-instalable-pwa.md        hermes-content/docs/handoff/codex-tareas/plataforma-B3-app-instalable-pwa.md
git mv hermes-content/docs/handoff/codex-tareas/C11a-reprogramar-y-reserva-avisa.md hermes-content/docs/handoff/codex-tareas/plataforma-C11a-reprogramar-y-reserva-avisa.md
git mv hermes-content/docs/handoff/codex-tareas/C11b-feriados.md                hermes-content/docs/handoff/codex-tareas/plataforma-C11b-feriados.md
git mv hermes-content/docs/handoff/codex-tareas/C13-gracia-y-no-renovar.md      hermes-content/docs/handoff/codex-tareas/plataforma-C13-gracia-y-no-renovar.md
git mv hermes-content/docs/handoff/codex-tareas/C14-aceptacion-terminos.md      hermes-content/docs/handoff/codex-tareas/plataforma-C14-aceptacion-terminos.md
git mv hermes-content/docs/handoff/codex-tareas/C14-terminos-con-version.md     hermes-content/docs/handoff/codex-tareas/plataforma-C14b-terminos-con-version.md
git mv hermes-content/docs/handoff/codex-tareas/C15-factura-al-aprobar.md       hermes-content/docs/handoff/codex-tareas/plataforma-C15-factura-al-aprobar.md
git mv hermes-content/docs/handoff/codex-tareas/K1-confirmacion-respuesta.md    hermes-content/docs/handoff/codex-tareas/plataforma-K1-confirmacion-respuesta.md
git mv hermes-content/docs/handoff/codex-tareas/K2-recuperar-canceladas.md      hermes-content/docs/handoff/codex-tareas/plataforma-K2-recuperar-canceladas.md
git mv hermes-content/docs/handoff/codex-tareas/K3-semilla-dental.md            hermes-content/docs/handoff/codex-tareas/plataforma-K3-semilla-dental.md
git mv hermes-content/docs/handoff/codex-tareas/W1-widget-de-chat-propio.md     hermes-content/docs/handoff/codex-tareas/plataforma-W1-widget-de-chat-propio.md
```

Cabeceras a anteponer (una por archivo; `modelo` lo deja UNKNOWN porque el archivo no lo dice):

| Archivo nuevo | estado | pr | nota |
|---|---|---|---|
| plataforma-B1-... | PR | 129 | |
| plataforma-B3-... | PR | 130 | también #136 (no medido) |
| plataforma-C11a-... | hecha | 115 | |
| plataforma-C11b-... | hecha | 122 | «PR #121 cerrado; días cerrados entraron por #122 (por título, no re-medido)» |
| plataforma-C13-... | PR | 113 | |
| plataforma-C14-aceptacion-terminos | PR | 124 | |
| plataforma-C14b-terminos-con-version | bloqueada | (vacío) | «sin PR ni rama; verificar si #124 ya la cubre antes de lanzar» |
| plataforma-C15-... | hecha | 114 | |
| plataforma-K1-... | PR | 132 | |
| plataforma-K2-... | hecha | 133 | |
| plataforma-K3-... | hecha | 134 | «+#138 fix» |
| plataforma-W1-... | PR | 131 | «+#137, #140» |

Cabecera (de `_PLANTILLA.md`), con esos valores:

```
---
id: plataforma-<ID>
carril: plataforma
estado: <pendiente|lanzada|PR|hecha|bloqueada>
modelo: UNKNOWN
repo: onia-platform
rama: <rama de Codex o vacio>
base: master
pr: <numero o vacio>
escrita: 2026-10-10
actualizada: 2026-10-11 por madre-dev
nota: <una linea; obligatoria si bloqueada>
---
```

Tras la migración, `_PLANTILLA.md` y `README.md` se commitean a main (hoy son untracked: no existen en origin/main).

### C. Detector v2 (reemplaza el bloque del README)

Medido: la parte de ramas (52 refs, 14 días) corre en 20,8 s y encuentra 0 hoy. La parte de main es ~1,6 s.

```bash
D=hermes-content/docs/handoff/codex-tareas
git fetch origin --prune --quiet

# 1. main manda: si el archivo existe en main, su cabecera es la verdad
for f in $(git ls-tree -r --name-only origin/main $D/ | grep -v -E '/(_|README)'); do
  st=$(git show "origin/main:$f" | sed -n '1,15p' | sed -nE 's/^estado: *([a-z]+).*/\1/p')
  [ "$st" = pendiente ] && echo "MAIN pendiente  $f"
done

# 2. contratos nuevos: solo en ramas claude/* con commit en 14 dias y que AUN no estan en main
git for-each-ref --format='%(refname:short) %(committerdate:unix)' refs/remotes/origin/claude/ \
  | awk -v t="$(date -d '14 days ago' +%s)" '$2>t{print $1}' \
  | while read r; do
      git ls-tree -r --name-only "$r" $D/ | grep -v -E '/(_|README)' | while read f; do
        git cat-file -e "origin/main:$f" 2>/dev/null && continue
        git show "$r:$f" | sed -n '1,15p' | grep -q '^estado: *pendiente' && echo "RAMA $r  $f"
      done
    done
```

Salida: `MAIN pendiente <ruta>` o `RAMA <rama> <ruta>`. Una línea por tarea. Si el archivo ya está en main, la rama no cuenta.

### D. Protocolo de la ronda (la madre)

1. Corre el detector v2.
2. Para cada `RAMA`: copia el contrato a main con un commit `docs(codex): adoptar <id>` (estado `pendiente`). Desde ahí, main lo manda.
3. Antes de lanzar Codex: commit en main con `estado: lanzada`, `actualizada`. Así una muerte entre lanzar y actualizar no relanza.
4. Tras el diff revisado y PR abierto: `estado: PR`, `pr: <n>`. Va al mismo commit de la ronda.
5. Al mergear y verificar: `estado: hecha`.
6. Si la revisión falla: contrato `...-arreglos.md` en `pendiente`.

Regla de borrado: una rama `claude/*` solo puede borrarse después de que su contrato esté en main.

### E. Escritura de una nube (regla para su prompt)

Línea a agregar a la sección Codex de `ONIA_EQUIPOS_POR_SESION.md` y a las instrucciones de Plataforma y Hermes:

> Contrato Codex: copiá `hermes-content/docs/handoff/codex-tareas/_PLANTILLA.md` como `plataforma-<ID>-<slug>.md` (o `hermes-<ID>-<slug>.md`), llená la cabecera con `estado: pendiente`, commiteá en TU rama `claude/*`, sin tocar otro archivo de la carpeta, y escribí en tu transcript `CODEX-CONTRATO: <ruta> (rama <claude/...>)`. No pusheás a main.

### F. Línea para equipo-de-agentes

En `.claude/skills/equipo-de-agentes/SKILL.md`, sección 3 paso 1, reemplazar «tareas nuevas en codex-tareas/» por:

> tareas `estado: pendiente` en `hermes-content/docs/handoff/codex-tareas/` (detector v2 del README, main primero).

### G. Launcher (pendiente de código)

`scripts/codex-tarea.sh` no escribe estado. Pedirle que escriba `lanzada` en main antes de correr Codex y `PR` al cerrar. Esto es código: se hace con PR, no en esta ronda.

## Quién la aplica

- **madre-dev**: paso B (migración y cabeceras), README con el detector v2 (C) y reglas D, `_PLANTILLA.md` y `README.md` a main, líneas F y E en sus archivos, y el launcher (G) con su PR. Motivo: solo la madre ve `~/.codex/madre-tareas` y GitHub, y es la única que escribe a main.
- **madre-marketing**: no toca los archivos de Plataforma. Sus carriles (Lucía, Marca personal, Ventas) escriben contratos con su carril en el nombre (`marca-`, `lucia-`, `ventas-`) siguiendo el paso E, y la madre-dev los adopta a main. Motivo: el lanzamiento de Codex y main son de la madre-dev.
- **Sesiones nube de Plataforma y Hermes**: el paso E en sus instrucciones y, al escribir un contrato, commit en su rama `claude/*`. Motivo: solo ellas saben qué tarea escriben, y no pueden lanzar Codex.
- **Integrador (onia-cola)**: opcional, pasar `PR` a `hecha` al mergear. Motivo: lo ve al mergear. Si no lo hace, la madre lo hace en la ronda.
- **Sergio Urcullo**: nada en esta configuración. UNKNOWN: si las nubes leen sus instrucciones del repo (main) o de su configuración de claude.ai. Si es lo segundo, Sergio pega el paso E en esa configuración. No se midió.

## Prueba de hecho

1. Contratos con cabecera en main: `git ls-tree -r --name-only origin/main hermes-content/docs/handoff/codex-tareas/ | grep -v -E '/(_|README)' | while read f; do git show "origin/main:$f" | sed -n '1,15p' | grep -q '^estado: ' && echo ok; done | wc -l` → **12** (hoy: 0).
2. Ids únicos: `git ls-tree -r --name-only origin/main hermes-content/docs/handoff/codex-tareas/ | grep -v -E '/(_|README)' | sed -E 's#.*/[a-z]+-([A-Z][0-9]+[a-z]?)-.*#\1#' | sort | uniq -d` → **vacío** (hoy: `C14`, por el nombre sin carril). Validado sobre los nombres nuevos: `C14` y `C14b` distintos.
3. Detector v2 con una tarea real: crear en una rama `claude/*` un contrato `pendiente` (commit en esa rama; push a su rama). En la siguiente ronda, `RAMA <rama> <ruta>` aparece. Tras adoptarlo a main, el mismo detector ya no lo lista. UNKNOWN hasta que se haga (requiere push de rama de prueba, fuera de esta pasada).
4. Tiempo: `time` del bloque v2 ≤ 25 s con 52 refs (medido 20,8 s en la parte de ramas).
5. No hay contratos `pendiente|lanzada|PR` de un PR mergeado: `gh pr list --repo oninteligenciaartificial/onia-platform --state merged --search <id>` cruzado con la cabecera de main, en la ronda.
