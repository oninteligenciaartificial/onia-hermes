# El handoff de sesión — cómo se cierra un carril

> **Fuente de verdad del formato.** Si algún doc, skill o prompt describe otro formato de
> cierre de sesión, está roto. Se edita **este** archivo, no se crea otro al lado.

Cierra la regla de [CLAUDE.md](../../CLAUDE.md) sección 2 — *"Al cerrar la sesión, dejar el
estado escrito"* — que existía desde hace semanas **sin plantilla y sin archivo**.

---

## La decisión: no se construye un quinto mecanismo

Ya hay **cuatro** herramientas instaladas que hacen algo parecido. Se revisaron las cuatro
antes de escribir una línea:

| Herramienta | Dónde escribe | Uso real medido |
|---|---|---|
| `/save-session` · `/resume-session` | `~/.claude/session-data/` | **299 archivos, 104 mencionan `onia-hermes`** — y el último es del **2026-07-25** |
| `/context-save` · `/context-restore` (gstack) | `~/.gstack/projects/<slug>/checkpoints/` | **1 checkpoint en total** |

**Las cuatro escriben fuera del repo.** Verificado leyendo los archivos:
`save-session.md` línea 274 lo declara explícito (*"canonical global session store"*), y
`context-save` calcula `CHECKPOINT_DIR="$GSTACK_STATE_ROOT/projects/$SLUG/checkpoints"`.

Y los números de arriba dicen algo más útil que "faltaba una herramienta":
**la herramienta existía, se usó 104 veces para este repo, y se dejó de usar hace un mes.**
El problema nunca fue la falta de mecanismo.

### Los tres defectos que hacen que no sirvan

1. **El estado no viaja.** Vive en el `$HOME` de una máquina. No se commitea, no lo ve otra
   máquina, no lo ve otro carril, y no entra en la revisión de nadie.
2. **El almacén global se fragmenta solo.** Hoy `~/.gstack/projects/` tiene `DentaGest/` **y**
   `oninteligenciaartificial-Dental-Gest/`: dos carpetas para el mismo proyecto, porque el
   slug depende de cómo se abrió la sesión. Un archivo dentro del repo no tiene ese problema.
3. **No se pueden tocar.** `save-session` es un comando **global** de `~/.claude/commands/`:
   cambiarle el destino afecta a todos los proyectos de Sergio, no solo a este. Y el
   `SKILL.md` de gstack dice literalmente *"AUTO-GENERATED … do not edit directly"* — cualquier
   cambio se pierde en el próximo upgrade.

### Entonces qué se hace

**Nada de código.** El handoff es **un formato y una ubicación**, escritos acá y referidos
desde CLAUDE.md. Escribir un markdown no necesita maquinaria: el agente ya sabe escribir
archivos, y ya lee CLAUDE.md en cada sesión.

No es un quinto mecanismo porque **no tiene mecanismo**. Las cuatro herramientas siguen
existiendo para lo suyo (recuperación local entre proyectos); esto es otra cosa: **estado del
carril, versionado con el carril**.

Los 299 archivos viejos **no se migran**. Son historia de otra época del proyecto.

---

## Dónde vive

```
.claude/handoff/<rama-con-guiones>.md
```

El nombre sale de `git branch --show-current` cambiando `/` por `-`. Para el carril de esta
misma tarea: rama `claude/analizar-reels-videos-67f762` →
`.claude/handoff/claude-analizar-reels-videos-67f762.md`.

**Por qué así, y no `HANDOFF.md` en la raíz:** acá se trabaja con un worktree por carril y
varios abiertos a la vez. Un archivo con nombre fijo en la raíz choca en cada merge a `main`
y además rompe *"nada suelto en la raíz"*. **Un archivo por rama = dos carriles no comparten
archivo = conflicto imposible.**

### Ciclo de vida

- **Se escribe** al cerrar la sesión, antes de soltar el turno.
- **Se sobrescribe** en cada cierre del mismo carril. Es estado vivo, no historia: por eso
  **no lleva fecha en el nombre** (regla de CLAUDE.md: fecha en el nombre = historia).
- **Se borra en el commit que mergea el carril a `main`.** Un carril cerrado no deja handoff.
  Si `.claude/handoff/` acumula archivos de ramas ya mergeadas, alguien no cerró bien.

---

## El formato — siete campos, en este orden

Es **una** lista, no dos pegadas: los 5 campos del método público y los 3 que ya exigía
CLAUDE.md, fundidos. El orden importa — se lee de arriba abajo y lo primero pesa más.

```markdown
# Handoff — <carril>

- **Rama:** <git branch --show-current>
- **Worktree:** <ruta absoluta>
- **Última sesión:** <YYYY-MM-DD>

## 1 · Objetivo
Una frase medible, y su definición de "hecho". La misma con la que arrancó la sesión.

## 2 · Qué quedó VIVO en producción
Solo lo que está encendido y verificado ahí, con CÓMO se verificó.
Si no se miró la pantalla o no se contó la fila, no va en este campo.

## 3 · Qué quedó a medias, y dónde exactamente
Archivo y línea. Un flag apagado va acá, nunca en el campo 2.

## 4 · Archivos y cambios
Qué se tocó y qué commit lo lleva.

## 5 · Intentos fallidos
Qué se probó, por qué falló, y por qué NO hay que volver a intentarlo.

## 6 · Qué depende de Sergio
Decisiones, credenciales, gastos. Lo que ninguna sesión puede desbloquear sola.

## 7 · Próximos pasos
Exactos y en orden. El primero tiene que poder empezarse sin releer nada más.
```

### De dónde sale cada campo

| Campo | Origen |
|---|---|
| 1 Objetivo | los dos: el método público y la regla *"objetivo por sesión"* |
| 2 Vivo en producción | CLAUDE.md — y sube la vara: exige **cómo** se verificó, porque *construido ≠ terminado* |
| 3 A medias y dónde | funde *"estado en que terminó"* con *"qué quedó a medias y dónde"*: son el mismo campo |
| 4 Archivos y cambios | el método público |
| 5 Intentos fallidos | el método público — **el que ningún resumen automático escribe** |
| 6 Depende de Sergio | CLAUDE.md |
| 7 Próximos pasos | el método público |

**Los campos 2 y 3 son el par antimentira.** Existen separados a propósito: partir "en qué
estado quedó" en *vivo y verificado* contra *a medias y dónde* es lo que impide reportar como
hecho algo que está detrás de un flag apagado.

**El campo 5 es el que más vale y el que nadie escribe.** Un resumen automático cuenta lo que
pasó; este campo existe para que la sesión siguiente **no vuelva a entrar al mismo callejón**.

---

## Para qué sirve, con evidencia propia

El **2026-08-22** la sesión de análisis de reels se compactó. El resumen que volvió era fiel y
larguísimo: traía cada error cometido, cada corrección y cada método descartado **con el mismo
peso que el estado actual**.

La diferencia con un handoff no es el tamaño: es que **alguien elige qué importa**. Un resumen
es exhaustivo; un handoff es selectivo. Un resumen no elige.

> ⚠️ **Lo que NO se dice.** Circula la afirmación de que `/compact` *"arrastra toda la
> conversación vieja"*. **Es falsa** — la compactación resume y reemplaza, no arrastra el hilo
> crudo. La formulación correcta es que **comprime todo por igual, no selecciona**. No repetir
> la versión incorrecta en ningún material nuestro.

---

## Cómo se usa

**Al cerrar:**

```
Escribí el handoff de este carril en .claude/handoff/<rama>.md siguiendo
hermes-content/docs/HANDOFF_DE_SESION.md. Los 7 campos, sin saltarte el 5.
```

**Al abrir la siguiente:**

```
Leé .claude/handoff/<rama>.md y seguí desde el paso 1 de "Próximos pasos".
```

**Si el campo 5 queda vacío en una sesión larga, está mal escrito.** Toda sesión con trabajo
real tiene al menos un camino que no funcionó, y ése es el que ahorra tiempo.

---

## Lo que queda pendiente y no se hizo acá

**No hay nada que fuerce escribirlo.** El hook `Stop` corre el autosync, pero un hook ejecuta
comandos, no puede producir un handoff pensado. Hoy depende de la regla de CLAUDE.md, que es
exactamente lo que falló con `/save-session`.

Si en dos o tres cierres el handoff no aparece, la respuesta **no** es otra herramienta: es un
chequeo en el autosync que avise cuando la rama tiene commits y no tiene handoff. Anotado como
la ruta de mejora, no construido — todavía no hay evidencia de que haga falta.
