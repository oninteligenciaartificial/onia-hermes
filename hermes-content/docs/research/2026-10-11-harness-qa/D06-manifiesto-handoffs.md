# D06 - COORDINATION_MANIFEST y handoffs al dia

Fecha de medicion: 2026-10-11. Solo lectura: sin commit, push, checkout ni stash. Sin RemoteTrigger, sin SSH, sin ListAgents. Version corregida tras la verificacion (PARTIAL).

## Estado medido

- `COORDINATION_MANIFEST.md` (raiz): 1071 lineas. Encabezado en l.3-8: «La madre Claude local sustituye a «Control» como orquestadora». El cuerpo sigue describiendo a «Control» como orquestadora: `grep -c Control` = 13 lineas.
- Division en dos madres: `grep -i -c "madre desarrollo-infra\|madre marketing\|DESARROLLO-INFRA\|dos madres"` = 0. El manifest no conoce la division.
- Hermes figura como sesion de control y duena de la entrega a Sergio (`Sesion de control`, l.50-55), no como carril QA. No hay fila QA en la tabla de carriles.
- Nombre «Mercado» (viejo) en el manifest: l.32, 33, 63, 78, 96, 199, 202, 204, 206, 213. El nombre nuevo «Ventas y pauta» aparece en l.63 y en el mensaje de l.292 («Mercado pasa a llamarse Ventas y pauta»).
- Latido: `grep -c -i 'latido\|trig_'` en el manifest = 0. El manifest no menciona latidos.
- IDs de sesion: `grep -o 'session_[A-Za-z0-9]*' | wc -l` = 25 coincidencias, 12 IDs distintos.

Comparacion de IDs del manifest con el encargo (no verificados en vivo: UNKNOWN cual esta vivo):

| Carril | ID en manifest (veces que aparece) | ID del encargo | Estado |
|---|---|---|---|
| Control / Hermes | `session_0154pQRYB6icZn9Z3SuJp35D` (5) | `session_01SQ7cvuDX5w5jDHk5VdhAEo` | Distinto |
| Plataforma | `session_01VGmpNv4eSMnpA3wXrypR4L` (2) | `session_01HhnFgkeF6nLGvjrfjt1o2C` | Distinto |
| Marca personal | `session_012ppFowADbJNtZ6WBMtqpuf` (3); `session_01CE21mytrEXdqanCFoWxm32` (1) | `session_01WPecmppa9uZEc4fJDjSmaS` | Distinto |
| Lucia v4 | `session_01RRD6v9rmBavDoXx1rG2mEn` (2) | `session_01XSzFcs1k18ijqjSHGjnzD4` | Distinto |
| Ventas y pauta | `session_01BnctfaNRsm3ogJ46A7B5P5` (3) | `session_0143C5fMXVs8eWEf7uBpC9SF` | Distinto |

### Handoffs en `hermes-content/docs/handoff/`

Fecha = ultimo commit del archivo (`git log -1 --format=%cs -- <archivo>`). Corte de 3 dias: antes de 2026-10-08.

- `*.md` totales: 41 (`ls hermes-content/docs/handoff/*.md | wc -l`).
- Con commit desde 2026-10-08 (frescos): 5: `hermes-jarvis.md` (10-09), `madre-local.md` (10-11), `madre-v2-revision.md` (10-11), `marca-personal.md` (10-08), `mercado-y-pauta.md` (10-10).
- Mas de 3 dias (viejos): 36 de 41.
- Mas de 14 dias (candidatos a archivar): 20 de 41 (antes de 2026-09-27).
- Mas viejos: `nit-navegador-issue.md` (08-27), `web-factory-cliente-prueba.md` (08-28), `canario-visual.md` (09-02), `docs-auditoria.md` (09-02).
- `README.md` de la carpeta: ultimo commit 2026-08-22 22:16:53 -0400. No menciona madres, `codex-tareas/` ni regla de archivado (`grep -i -c 'madre\|codex'` = 0).
- Archivos con fecha en el nombre: 8 `.md` (`CONTINUAR-GUIONES-CLAUDE-2026-09-28.md`, `EDICION-MARCA-PERSONAL-2026-09-21.md`, `HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md`, `REINICIO-GUIONES-2026-09-28.md`, `hermes-cal-nube-20260928.md`, `homelab-orquestacion-20260927.md`, `marca-sergio-guiones-20260927.md`, `onia-v1-validacion-integrada-20260927.md`). Mas 4 `.json` (`onia-v1-integracion-20260927.json`, `revision-calendario-20260928.json`, `revision-hermes-20260927.json`, `revision-orquestacion-20260927.json`). Total con fecha: 12 archivos.
- Carpeta `codex-tareas/`: existe, sin commit de handoff propio. Contiene `README.md`, `_PLANTILLA.md` y 12 contratos (`B1`, `B3`, `C11a`, `C11b`, `C13`, `C14-aceptacion`, `C14-terminos`, `C15`, `K1`, `K2`, `K3`, `W1`). Ultimo commit de la carpeta: 2026-10-08 16:24 -0400.
- Carpeta destino de archivado `hermes-content/docs/historial/handoff/`: NO existe. Hay que crearla antes del `git mv`.

## Brecha

1. El manifest no refleja las dos madres (desarrollo-infra y marketing). Sigue diciendo que Control orquesta. Dos orquestadores escritos en el mismo archivo.
2. Los IDs del manifest no coinciden con los del encargo en las 5 nubes. Sin `ListAgents` no se sabe cual esta vivo: UNKNOWN.
3. Hermes figura como control de entrega y no como QA. No hay fila QA.
4. «Mercado» (cuerpo, 10 lineas) frente a «Ventas y pauta» (encabezado de la tabla nueva en l.292): nombre viejo sin retirar.
5. 36 de 41 handoffs con mas de 3 dias sin commit. 20 con mas de 14 dias. El README no tiene regla de caducidad ni de archivado.
6. 8 `.md` y 4 `.json` llevan fecha en el nombre, contra la regla «sin fecha en el nombre» del README.
7. El README no nombra `codex-tareas/` ni la regla de que Codex no hace git.
8. El manifest no menciona latidos (0 coincidencias). Los latidos del encargo (Plataforma :17, Hermes :57, Lucia :47, Marca :27, Ventas sin latido) no tienen fila en la tabla.

## Configuracion propuesta

### A. Encabezado nuevo de `COORDINATION_MANIFEST.md` (reemplaza l.3-8)

```markdown
> **Vigencia 2026-10-11 (sustituye lo anterior):** hay DOS madres locales en la PC de Sergio Urcullo.
> - **Madre desarrollo-infra**: ordena las nubes **Plataforma** y **Hermes-Jarvis (QA)**, mas VPS, infra y harness.
> - **Madre marketing**: ordena **Lucia**, **Marca personal**, **Ventas y pauta**.
> Codex corre solo desde la PC (`scripts/codex-tarea.sh`); Codex no hace git. La madre que encarga revisa y commitea.
> IDs vivos: verificar con `ListAgents` antes de usarlos. Lo escrito abajo con ID viejo es historial.
> Los nombres «Control» y «Mercado» quedan retirados: el rol es Hermes-Jarvis (QA) y Ventas y pauta.
```

### B. Tabla de carriles vigentes (nueva seccion, insertar antes de la tabla «Sesion | Que es suyo», cerca de l.58)

```markdown
| Carril | Madre | Entorno / latido | Rol | Handoff |
|---|---|---|---|---|
| Plataforma | desarrollo-infra | Onia, :17 | producto onia-platform | `handoff/onia-1.0-nube.md` |
| Hermes-Jarvis (QA) | desarrollo-infra | Onia, :57 | QA del harness y de la entrega | `handoff/hermes-jarvis.md` |
| Lucia | marketing | onia-higgsfield, :47 | identidad y piezas de Lucia | `handoff/higgsfield-lucia.md` |
| Marca personal | marketing | onia-higgsfield, :27 | guiones y comunidad | `handoff/marca-personal.md` |
| Ventas y pauta | marketing | Default, sin latido | conseguir clinicas, pauta Meta | `handoff/mercado-y-pauta.md` |
```

Las filas de «Control» y «Mercado» del cuerpo (l.32-33, 50-63, 78, 96, 199-213, 292) quedan con prefijo `[RETIRADO 2026-10-11]`. No se reescribe el historial.

### C. Regla nueva en `hermes-content/docs/handoff/README.md` (agregar al final)

```markdown
## Vigencia y archivado (2026-10-11)

- Un handoff sin commit en mas de 3 dias se marca en su primera linea: `> VIEJO desde AAAA-MM-DD: confirmar con la madre antes de usar`.
- Un handoff sin commit en mas de 14 dias se mueve con `git mv` a `hermes-content/docs/historial/handoff/`. Se crea esa carpeta antes. Al moverlo se quita la fecha del nombre si la lleva. Hoy son 20 archivos.
- Sin fecha en el nombre dentro de `handoff/`. Los 8 `.md` y 4 `.json` con fecha se renombran al mover o se dejan en historial.
- `handoff/codex-tareas/` contiene los contratos de Codex. Codex no hace git: la madre que encarga revisa y commitea.
- Madres: la de desarrollo-infra mantiene los handoffs de Plataforma y Hermes-Jarvis; la de marketing mantiene los de Lucia, Marca personal y Ventas y pauta.
```

### D. Comando para listar los handoffs con fecha de ultimo commit (solo lectura)

Git Bash:
```bash
cd "<raiz del repo>" && for f in hermes-content/docs/handoff/*.md; do echo "$(git log -1 --format=%cs -- "$f") $f"; done | sort
```

PowerShell (equivalente):
```powershell
Set-Location "<raiz del repo>"; Get-ChildItem hermes-content/docs/handoff -Filter *.md | ForEach-Object { "$(git log -1 --format=%cs -- "hermes-content/docs/handoff/$($_.Name)") $($_.Name)" } | Sort-Object
```

Crear la carpeta de archivado (solo al aplicar C, PowerShell):
```powershell
New-Item -ItemType Directory -Force hermes-content/docs/historial/handoff
```

## Quien la aplica

- **Madre desarrollo-infra**: encabezado A, tabla B y regla C del manifest y del README. Tiene la vista del harness y de las dos nubes de desarrollo, y el manifest lo mueve el integrador por esa madre.
- **Madre marketing**: marca de VIEJO en los handoffs de Lucia, Marca personal y Ventas y pauta, y la fila de Ventas en la tabla B.
- **Sesion Hermes-Jarvis (QA)**: confirmar sus IDs en el manifest tras `ListAgents`. No cambia nada mas.
- **Sergio Urcullo**: solo si la madre no puede confirmar los IDs vivos. No hay cambio de gasto ni de publicacion en esta propuesta.
- **Integrador**: commit del manifest y del README desde la rama de la madre, luego PR revisado. `main` no se toca directo.

## Prueba de hecho

1. `grep -c "Madre desarrollo-infra\|Madre marketing\|Vigencia 2026-10-11" COORDINATION_MANIFEST.md` devuelve al menos 2 tras aplicar A (una por madre, mas el encabezado). Sin `-i`: los patrones distinguen mayusculas y estan escritos como en A.
2. `grep -c "RETIRADO 2026-10-11" COORDINATION_MANIFEST.md` devuelve el numero de filas retiradas (no cero).
3. Cada `session_` de la tabla B coincide con `ListAgents` (cero distintos). Hoy: 5 IDs en el encargo, 0 confirmados.
4. `ls hermes-content/docs/handoff/*.md | wc -l` = 41 antes de archivar. Tras aplicar C, `grep -l "^> VIEJO" hermes-content/docs/handoff/*.md | wc -l` = 36 (o menos si alguno se actualizo despues de 2026-10-11).
5. `git log -1 --format=%ci -- COORDINATION_MANIFEST.md` muestra una fecha posterior a 2026-10-11, y el PR queda mergeado.

## Limites de esta medicion

- No se verifico ninguna sesion viva: no se llamo `ListAgents` ni `RemoteTrigger`. Los IDs del manifest y del encargo no coinciden; cual esta vivo: UNKNOWN.
- Las fechas son del ultimo commit de cada archivo, no de su ultima modificacion en disco. Un cambio sin commit no aparece.
- Los IDs de Plataforma, Marca personal y Lucia se contaron en el manifest con `grep -c`; no se compararon con sesiones vivas.
- Latidos: el encargo los fija; el manifest no tiene ninguno. Quien los confirma es la madre desarrollo-infra con `ListAgents` o `RemoteTrigger get`.
