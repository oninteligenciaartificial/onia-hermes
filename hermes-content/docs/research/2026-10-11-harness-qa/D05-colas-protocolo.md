# D05 - Colas en loop: protocolo y formato (corregido tras verificador)

Fecha de medicion: 2026-10-11. Fuente: `hermes-content/docs/cola/loop/` (solo lectura). Sin cambios en colas ni en git.

## Estado medido

Patrones usados (case-sensitive):
- Abiertas / cerradas: `^\s*- \[ \]` / `^\s*- \[x\]`
- `Hecho =` exacto
- `Dueño` exacto (con la n tilde)
- Codex o modelos: `Codex|Cx[A-Z]|Haiku|Sonnet|Opus|Luna|Astra` (lineas que cumplen)
- SHA aprox.: hex de 7-8 caracteres (puede tener falsos positivos; no revisado a mano)

| Cola | Abiertas | Cerradas | `Hecho =` | `Dueño` | Lineas Codex/modelos | Hex 7-8 (aprox.) | Seccion Bloqueado |
|---|---|---|---|---|---|---|---|
| madre.md | 44 | 15 | 4 | 9 | 22 | 24 | no (seccion C: "Espera a Sergio Urcullo") |
| plataforma.md | 13 | 0 | 0 | 0 | 0 | 0 | si (`## Bloqueado (solo Sergio Urcullo)`, linea 18) |
| hermes-jarvis.md | 0 | 19 | 6 | 0 | 0 | 16 | si (`## Bloqueado`, linea 27) |
| lucia.md | 4 | 0 | 0 | 0 | 0 | 0 | si |
| marca-personal.md | 6 | 0 | 0 | 0 | 0 | 0 | si |
| ventas-pauta.md | 2 | 5 | 0 | 0 | 0 | 0 | si |
| README.md (protocolo) | - | - | 0 | 0 | 1 | 0 | no |

Notas de medicion:
- Antes se reporto `Hecho =` 9 y 7, y `Dueño` 19. Eran conteos con `-i` u otro patron. Corregido: madre 4, hermes 6, `Dueño` 9 (solo madre).
- Antes se reporto "19 lineas" de Codex/modelos en madre. Con el patron de arriba son 22. El 19 venia de `codex` sin distinguir mayusculas; no se usa.
- Links http: 0 en todas las colas. Los SHA aparecen en hermes-jarvis y madre.

Evidencia (archivo:linea):
- `hermes-content/docs/cola/loop/README.md:10` - unica mencion de Codex en el protocolo. No hay seccion "Codex y modelos".
- `hermes-content/docs/cola/loop/README.md:26` - `Despertate de nuevo enseguida (60-120 s)`. La linea correcta es 26 (antes se citaba 27).
- `hermes-content/docs/cola/loop/madre.md:5` - ronda de la madre con Haiku cada 20 min.
- `hermes-content/docs/cola/loop/madre.md:5-6` - "Una sola madre: dos orquestadores se pisan".
- `hermes-content/docs/cola/loop/madre.md:8` - leyenda de dueno: `H`, `S`, `O`, `CxSol`, `CxAstra` (Codex local), `CxNube` (Codex cloud), sesiones de la nube, `SU`. No incluye `Luna`.
- `hermes-content/docs/cola/loop/madre.md:52` - `B9 ... (CxNube, ...)`: Codex cloud en uso real.
- `hermes-content/docs/cola/loop/madre.md:87` - `I5 Codex sin tarea para Hermes ni para Luna`. Luna aparece como destino, sin definicion en la leyenda.
- `hermes-content/docs/cola/loop/madre.md:101` - seccion J, cupo Codex (56 % al 9-oct).
- `hermes-content/docs/cola/loop/madre.md:148` - latidos: `Plat :17 · Marca :27 · Lucia :47 · Hermes :57 (cada hora)`.
- `hermes-content/docs/cola/loop/madre.md:155` - cupo Codex 58 % semanal al 11-oct 02:20 UTC, reinicio 14-oct 03:57 UTC (= 13-oct 23:57 La Paz, `madre.md:124`).
- `scripts/codex-tarea.sh` existe (cabecera lineas 1-6: `<tarea.md> <carpeta> [modelo] [esfuerzo]`). `scripts/codex-cupo.mjs` existe. `grep -n Luna scripts/codex-tarea.sh` no devuelve nada: el mapeo de Luna a un modelo concreto es UNKNOWN.
- `hermes-content/docs/handoff/codex-tareas/` tiene 14 archivos: 12 contratos + `README.md` + `_PLANTILLA.md`.
- Regla de una madre: `madre.md:5-6` y `CLAUDE.md` (seccion Sesion MADRE, "UNA madre local") prohiben dos orquestadores.

Formatos distintos encontrados:
1. Casilla `- [ ]`/`- [x]` con texto libre: todas las colas.
2. Dueno: solo madre.md usa `Dueño:` (9 veces) y la leyenda `H/S/O/Cx*`. Las colas de carril no tienen dueno.
3. Criterio de hecho: `Hecho =` solo en madre (4) y hermes-jarvis (6). Plataforma, Lucia, Marca y Ventas no lo escriben por item.
4. Seccion de bloqueo: 5 colas tienen `## Bloqueado`; madre usa `## C. Espera a Sergio Urcullo` (linea 55).
5. Verificacion de aprendizaje: plataforma, lucia, marca, ventas y hermes-jarvis (`## Verificación de aprendizaje · 2026-10-09`). madre no la tiene.

UNKNOWN:
- Si las colas de carril corren cada 60-120 s en la practica: no se midio (requiere transcripts de las nubes).
- Mapeo de Luna a modelo y de Sol/Astra a comandos: el encargo lo describe (Sol por defecto, Astra para seguridad, Luna mecanico); no se verifico en `scripts/codex-tarea.sh` mas alla de la cabecera.
- Cupo Codex exacto hoy: la fuente mas reciente es `madre.md:155` (11-oct 02:20 UTC). No se consulto `scripts/codex-cupo.mjs`.

## Brecha

1. El README no tiene seccion "Codex y modelos". Codex aparece una vez (linea 10), sin decir que corre en la PC y en la nube, ni que modelo usa cada tipo de tarea.
2. Las colas de carril (plataforma, hermes-jarvis, lucia, marca, ventas) no declaran dueno ni madre que las ordena. Solo madre.md tiene `Dueño:`.
3. La leyenda de dueno y modelos (`madre.md:8`) no esta en el README; los carriles no la ven sin abrir madre.md. `Luna` no tiene definicion en esa leyenda.
4. Criterio de hecho por item ausente en 4 de 6 colas de carril. El README (linea 15) dice "publicada y MIRADA o mergeada" sin prueba concreta para tareas que no se publican.
5. La seccion de bloqueo de madre tiene otro nombre (`C. Espera a Sergio Urcullo`). El README pide `causa, responsable y siguiente accion`; no se midio si madre lo sigue item a item.
6. El README dice `Despertate de nuevo enseguida (60-120 s)` (linea 26). La ronda de la madre corre cada 20 min (`madre.md:5`) y los latidos son cada hora (`madre.md:148`). Para los carriles el intervalo real es UNKNOWN.
7. Ninguna cola enlaza `hermes-content/docs/handoff/codex-tareas/`, que tiene 12 contratos Codex.
8. Dos madres (dev-infra y marketing): no hay decision de Sergio registrada en las colas. `madre.md:5-6` y `CLAUDE.md` dicen una sola madre. Asignar dueno `madre-dev` o `madre-marketing` contradice esa regla hasta que Sergio decida.

## Configuracion propuesta

Nota: la version anterior proponia dos madres y un intervalo de 20 min sin decision. Se quita. Lo que queda no depende de esa decision.

### Diff para `hermes-content/docs/cola/loop/README.md`

Cambiar la linea 26:

```diff
-6. Despertate de nuevo enseguida (60-120 s) mientras haya tareas.
+6. Despertate de nuevo mientras haya tareas. El intervalo lo fija la madre (ver madre.md, "Latidos"); no lo elijas tu.
```

Agregar al final del archivo:

```diff
+
+## Formato de cada cola
+
+- Cada item: `- [ ] <id> <descripcion>` y, si es tarea de publicacion o de producto, `Hecho = <prueba>` (SHA, link o captura).
+- Bloqueado: seccion `## Bloqueado` con `causa | responsable | siguiente accion`.
+
+## Codex y modelos
+
+- Codex corre en la PC y en la nube:
+  - CxSol y CxAstra: Codex local, lanzado por la madre con `scripts/codex-tarea.sh`.
+  - CxNube: Codex cloud (ejemplo: `madre.md:52`, B9).
+- Codex no hace git. La madre revisa y commitea.
+- Los contratos de Codex estan en `hermes-content/docs/handoff/codex-tareas/`. Un item que necesite Codex nombra su contrato por archivo.
+- Claude por rol: Haiku cuenta y verifica; Sonnet sintetiza; Opus solo lo ambiguo o riesgoso. Subagentes con `model` explicito.
+- Leyenda completa de dueno: `madre.md:8`. Luna: sin definicion aun (ver `madre.md:87`).
+- Cupo Codex: lo consulta la madre; los carriles no lo consultan.
```

Texto listo para pegar: el bloque `## Codex y modelos` de arriba.

### Pendiente de decision de Sergio Urcullo (no aplicar aun)

- Una madre con sub-dueno por cola, o dos madres (dev-infra y marketing). Hoy la regla es una madre (`madre.md:5-6`, `CLAUDE.md`). Sin esta decision no se escribe la linea `Dueño:` por cola.
- Intervalo de los carriles: hoy 60-120 s segun el README, no medido en la practica. Cambiarlo cambia el gasto de cada sesion: decision de Sergio.

### Cambio en `madre.md` (no urgente)

- Renombrar `## C. Espera a Sergio Urcullo ...` (linea 55) a `## Bloqueado (solo Sergio Urcullo)` para igualar las otras colas.

## Quien la aplica

- madre (la que ordena Plataforma y Hermes-Jarvis; hoy la unica madre): README (linea 26 y nueva seccion) y `madre.md` (renombre de la seccion C). Razon: el protocolo y el libro de la madre son suyos hoy.
- Sergio Urcullo: decide una madre o dos, y el intervalo de los carriles. Razon: `CLAUDE.md` dice una madre, y el intervalo afecta el gasto.
- Sesiones de carril (Plataforma, Hermes-Jarvis, Lucia, Marca, Ventas): solo marcan sus casillas y agregan `Hecho =` a sus items abiertos. No editan el protocolo.
- Integrador (`onia-cola`): revisa que el diff de README llegue a `main` por PR. No edita contenido.

## Prueba de hecho

1. `grep -n 'Despertate' hermes-content/docs/cola/loop/README.md` no muestra `60-120 s` (hoy si lo muestra, linea 26).
2. `grep -n '^## Codex y modelos' hermes-content/docs/cola/loop/README.md` devuelve una linea.
3. `grep -c 'Codex' hermes-content/docs/cola/loop/README.md` sube de 1 a al menos 4.
4. `grep -n '^## Bloqueado' hermes-content/docs/cola/loop/*.md` lista una seccion en cada cola, madre incluida (hoy madre no la tiene).
5. Tras la decision de Sergio: `grep -c '^Dueño:' hermes-content/docs/cola/loop/*.md` devuelve 1 por cola (hoy 0 en carriles).
6. Items abiertos sin `Hecho =` en plataforma: hoy 13 de 13. Tras el formato, los items de publicacion deben traer `Hecho =`.
7. Revision por la madre en la siguiente ronda: la sesion de carril confirma en su transcript que leyo la seccion `Codex y modelos`.
