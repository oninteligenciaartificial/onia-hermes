# HANDOFF — el estado escrito al cerrar un carril

> Esto es **el artefacto que le faltaba a la regla de `CLAUDE.md` §«Nada a medias»** ("Al cerrar la sesión,
> dejar el estado escrito"). La regla existía hace semanas y nunca tuvo plantilla ni lugar:
> por eso se cumplía a veces y en el chat, que se pierde.

---

## La decisión: NO se reusa `save-session`, y NO se construye un quinto mecanismo

Verificado leyendo los cuatro archivos (2026-08-23). **Las cuatro herramientas que ya existen
escriben FUERA del repo:**

| Herramienta | Dónde escribe |
|---|---|
| `~/.claude/commands/save-session.md` | `~/.claude/session-data/` |
| `~/.claude/commands/resume-session.md` | lee de ahí mismo |
| `~/.claude/skills/context-save/` | `~/.gstack/projects/<slug>/checkpoints/` |
| `~/.claude/skills/context-restore/` | lee de ahí mismo |

**No se les cambia el destino**, por tres razones concretas:
1. Son **globales del usuario**: tocarlas afecta todos sus proyectos, no solo Onia.
2. `save-session` valida el nombre de archivo contra `SESSION_FILENAME_REGEX` en
   `session-manager.js`; mover el destino rompe `resume-session`, que lee de ahí.
3. Su formato no son los campos que necesitamos.

**Y esto NO es un quinto mecanismo.** No hay comando nuevo, ni skill, ni script, ni cron.
Es **un archivo de texto con plantilla fija**, como los otros ~200 docs del repo. La regla ya
pedía escribir el estado; esto solo dice *dónde* y *con qué forma*.

**Lo que las cuatro no resuelven y esto sí:** ellas guardan estado **personal, global y
efímero** — para que la misma persona retome en la misma máquina. El handoff es un artefacto
**del proyecto**: se commitea, viaja en el repo, lo lee otra máquina, otro carril y otra
sesión. Ese es el aporte, y es el problema que de verdad tenemos con 16 worktrees abiertos.

---

## Dónde vive (y por qué no choca entre carriles)

```
hermes-content/docs/handoff/<nombre-del-carril>.md
```

**Un archivo por carril**, nombrado como la rama o el worktree. Dos carriles abiertos escriben
en archivos distintos ⇒ **cero conflictos al mergear a main**. Un solo `HANDOFF.md` en la raíz
sí chocaría — y además rompería *"nada suelto en la raíz"* (CLAUDE.md §4).

- **Sin fecha en el nombre**: es el estado ACTUAL del carril, se sobrescribe. Un tema, un
  archivo (CLAUDE.md §2).
- Cuando el carril cierra de verdad y se mergea, su handoff no se borra: se mueve con `git mv` a
  `hermes-content/docs/historial/handoff/` (así se hizo el 26-oct con los de la madre, los loops y la 1.0).
- **Acá quedan solo los vivos.** El planificador de Hermes del VPS (`hermes-content/skills/planificar-orquesta.md`)
  lista esta carpeta y lee los «Próximos pasos» de cada archivo: un handoff muerto acá se lee como trabajo vivo.
  Qué handoff tiene cada área: `ONIA_HARNESS.md` §9.
- El Hermes de la PC escribe el suyo en `E:/onia-wt/hermes-base/hermes-content/docs/handoff/` y lo commitea la
  sesión principal de Claude, por PR (`AGENTS.md` §9).

---

## El formato — UNA lista de 7, no dos pegadas

Une los 5 campos del método con los 3 que la regla de ONIA ya pedía. El "estado en que
terminó" se abre en dos (**2** y **3**) a propósito: en Onia la diferencia entre *encendido en
producción* y *construido a medias* es la distinción que más caro nos ha salido.

```markdown
# Handoff — <carril>

**Objetivo**
Uno solo, con su definición de "hecho". Si no se cumplió, decirlo acá.

**Qué quedó EN PRODUCCIÓN**
Lo encendido y verificado ahí, con su commit/hora. Si no llegó nada a producción,
escribir "nada" — construido no es terminado.

**Qué quedó a medias, y dónde**
Rama, worktree y commit exactos. "A medias" incluye lo que está detrás de un flag apagado.

**Archivos y cambios**
Los que importan para retomar, no el `git status` entero.

**Intentos fallidos**
Qué se probó y NO funcionó, y por qué. El campo que casi nadie escribe y el que más
vale: evita que la próxima sesión repita el callejón. Incluye las hipótesis que
resultaron falsas.

**Qué depende de Sergio**
Decisiones, credenciales, clics en paneles que no son nuestros, gasto.

**Próximos pasos**
En orden, con el criterio de "listo" de cada uno.
```

---

## Por qué esto y no confiar en la compactación

**Evidencia propia, no del video:** la sesión de análisis de reels se compactó el 2026-08-22.
El resumen que volvió era **fiel y larguísimo**: traía el historial entero — cada error, cada
corrección, cada método descartado — con **el mismo peso** que el estado actual.

La diferencia con un handoff **no es el tamaño: es que alguien ELIGE qué importa.** Un resumen
no elige.

⚠️ **Precisión técnica, para no repetir un error ajeno:** la compactación **resume y
reemplaza** la conversación; no la arrastra entera. Comprime, no acumula. (El audio del reel
que originó esto dice lo contrario y se equivoca; el caption del mismo post lo dice bien.)
