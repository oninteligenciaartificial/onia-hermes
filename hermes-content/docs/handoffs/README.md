# Handoffs de sesión — uno por carril

**Un archivo por RAMA**, nombrado con la rama saneada: `claude-ads-creatividades-publicos.md`.
Así dos carriles abiertos a la vez no se pisan, y al mergear a `main` conviven en vez de
chocar (un `HANDOFF.md` en la raíz sería un conflicto garantizado en cada merge, y además
rompe "nada suelto en la raíz" de CLAUDE.md §4).

## Por qué existe si ya hay cuatro herramientas de sesión

Verificado el 2026-08-22: `save-session` y `resume-session` escriben en
`~/.claude/session-data/`; las skills `context-save` y `context-restore`, en
`~/.gstack/sessions/`. **Las cuatro escriben FUERA del repo** → el estado no se commitea, no
viaja, no lo ve otra máquina y no lo ve otro carril.

**Decisión (para no crear un quinto mecanismo):** el mecanismo sigue siendo `save-session`;
lo único que cambia es el DESTINO cuando se corre dentro de un repo git — el archivo se
escribe acá y se commitea. `~/.claude/session-data/` queda para lo que sirve: estado efímero
de una máquina. No se inventa una herramienta nueva al lado.

## El formato: SEIS campos

Los 5 de la plantilla del video, fundidos con los 3 que CLAUDE.md ya exigía. No son dos
listas pegadas: el campo 2 absorbe "qué quedó en producción / qué quedó a medias y dónde", y
el 6 es "qué depende de Sergio".

1. **Objetivo** — el de la sesión, en una frase medible
2. **Estado en que terminó** — qué quedó **EN PRODUCCIÓN** (encendido y verificado ahí) y qué
   quedó **a medias, con el dónde exacto**
3. **Archivos y cambios** — rutas concretas, no descripciones
4. **Intentos fallidos** — lo que se probó y NO funcionó, con el porqué. *El campo que casi
   nadie escribe y el que más vale: evita que la próxima sesión repita el mismo callejón.*
5. **Próximos pasos** — en orden, accionables
6. **Qué depende de Sergio** — lo que está bloqueado esperándolo a él

## Por qué un handoff y no un `/compact`

Un resumen automático es fiel y largo: devuelve el historial entero — cada error, cada
corrección, cada método descartado — **con el mismo peso que el estado actual**. La diferencia
no es el tamaño: es que en un handoff **alguien ELIGE qué importa**. Un resumen no elige.

⚠️ Precisión técnica: `/compact` **no arrastra la conversación vieja** — resume y reemplaza.
Comprime la basura, no la saca. (El audio del reel de origen dice lo contrario; el caption del
mismo post lo dice bien. No repetir la versión del audio.)
