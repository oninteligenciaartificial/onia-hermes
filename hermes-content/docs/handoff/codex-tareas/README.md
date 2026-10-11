# Cola de contratos para Codex

Un archivo = un contrato cerrado para UNA corrida de Codex. Lo escribe la sesión del carril (las sesiones de nube no tienen Codex, C07). Lo adopta a main y lo lanza la madre de desarrollo-infra con `scripts/codex-tarea.sh`. Protocolo completo: `hermes-content/docs/ONIA_HARNESS.md` §10. Este README es la regla de la carpeta (C08).

## Nombre
`<carril>-<ID>-<slug>.md`: carril `plataforma | hermes | lucia | marca | ventas`; ID el de la tarea (`C15`, `K2`, `W1`); slug en minúsculas con guiones. Ej.: `plataforma-C15-factura-al-aprobar.md`. Seguimientos: `...-arreglos.md`. Los archivos que empiezan con `_` y este README no son tareas.

Migración pendiente (C08-B): los 12 contratos actuales no tienen carril en el nombre ni cabecera. Se renombran en un solo commit de la madre desarrollo-infra. `C14` aparece dos veces; tras la migración, `C14-terminos-con-version` pasa a `plataforma-C14b-...`.

## Cabecera (obligatoria)
Bloque YAML al inicio, con `id`, `carril`, `estado`, `modelo`, `repo`, `rama`, `base`, `pr`, `escrita`, `actualizada` y `nota`. Ver `_PLANTILLA.md`.

## Estados
| estado | significa | quién lo pone | pasa a |
|---|---|---|---|
| pendiente | contrato escrito, nadie lo corrió | la sesión que lo escribe, o la madre al adoptarlo | lanzada |
| lanzada | Codex corriendo o con diff sin revisar (`~/.codex/madre-tareas/<fecha>-<tarea>/`) | madre, en main, antes de correr Codex | PR, bloqueada |
| PR | diff revisado, commiteado y PR abierto (`pr:` lleno) | madre | hecha, lanzada (si hay `-arreglos`) |
| hecha | PR mergeado y verificado según su PRUEBA DE HECHO | madre / integrador | — |
| bloqueada | no avanza; `nota:` dice por qué y qué falta | cualquiera | pendiente |

Solo la madre de desarrollo-infra (o el integrador al mergear) cambia `lanzada`, `PR` y `hecha`. Una sesión de nube crea en `pendiente` y puede marcar `bloqueada`.

## Cómo escribe un contrato una sesión
1. Copia `_PLANTILLA.md` como `<carril>-<ID>-<slug>.md`, llena la cabecera con `estado: pendiente` y las secciones. Es autocontenido: Codex no ve chats ni `CLAUDE.md`.
2. Commit y push a SU rama `claude/*`, sin tocar otro archivo de la carpeta. Mensaje: `docs(codex): contrato <carril>-<ID>`. No pushea a main.
3. Escribe en su transcript: `CODEX-CONTRATO: <ruta> (rama <claude/...>)`.

## Cómo lo detecta la madre (detector v2, main primero)
Este bloque reemplaza al `git grep` de la cabecera, que no servía: hoy ningún archivo la tiene. Cada línea de salida es un contrato a adoptar o lanzar.

```bash
D=hermes-content/docs/handoff/codex-tareas
git fetch origin --prune --quiet

# 1. main manda: si el archivo está en main, su cabecera es la verdad
for f in $(git ls-tree -r --name-only origin/main $D/ | grep -v -E '/(_|README)'); do
  st=$(git show "origin/main:$f" | sed -n '1,15p' | sed -nE 's/^estado: *([a-z]+).*/\1/p')
  [ "$st" = pendiente ] && echo "MAIN pendiente  $f"
done

# 2. contratos nuevos: solo en ramas claude/* con commit en 14 días que AÚN no están en main
git for-each-ref --format='%(refname:short) %(committerdate:unix)' refs/remotes/origin/claude/ \
  | awk -v t="$(date -d '14 days ago' +%s)" '$2>t{print $1}' \
  | while read r; do
      git ls-tree -r --name-only "$r" $D/ | grep -v -E '/(_|README)' | while read f; do
        git cat-file -e "origin/main:$f" 2>/dev/null && continue
        git show "$r:$f" | sed -n '1,15p' | grep -q '^estado: *pendiente' && echo "RAMA $r  $f"
      done
    done
```

Costo medido (C08): la parte de ramas tarda unos 21 s con 52 refs.

## Qué hace la madre con cada línea
1. `RAMA`: copia el contrato a main con `docs(codex): adoptar <id>` (estado `pendiente`).
2. Antes de lanzar: commit en main con `estado: lanzada`. Así, una caída a mitad no relanza.
3. Con el diff revisado y el PR abierto: `estado: PR` y `pr: <n>`, en el mismo commit de la ronda.
4. Al mergear y verificar: `estado: hecha`.
5. Si la revisión falla: contrato `...-arreglos.md` en `pendiente`.

Regla de borrado: una rama `claude/*` solo se borra después de que su contrato esté en main.
