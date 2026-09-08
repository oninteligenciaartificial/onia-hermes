# Logos de marca

Paths extraidos de [simple-icons](https://github.com/simple-icons/simple-icons),
licencia **CC0-1.0**. Cada `.path` es el atributo `d` del unico `<path>` del SVG
original, en viewBox `0 0 24 24`.

Las marcas y logotipos pertenecen a sus respectivos duenos. Aca se usan de forma
**nominativa** — para decir "uso esta herramienta" — que es el mismo uso que hacen
las referencias del patron. No se alteran las formas ni se sugiere afiliacion.

Colores oficiales aplicados por el generador (ver `ICONOS` en
`scripts/marca-personal/generar-apple-editorial.py`).

## hermes.jpg

`nous-girl.jpg` de [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
(`apps/desktop/public/`), el repo **publico y MIT** del agente Hermes. Es la imagen que
Sergio Urcullo identifico como el logo del proyecto. Mismo uso nominativo que el resto:
la lamina dice "uso esta herramienta", no sugiere afiliacion ni autoria.

⚠️ Hermes **no es codigo de Onia**. Verificado el 2026-09-06: `NousResearch/hermes-agent`,
publico, licencia MIT, Python. Lo que si es de Sergio Urcullo es el `SOUL.md`, la memoria
y la configuracion con la que corre en su servidor.

## onia.svg

Copia de `web-factory/apps/onia-platform/public/brand/v2/onia-icon-rounded.svg` — el icono
de marca decidido y publicado (tile verde `#00D26A` con el monograma "on"). Es marca PROPIA,
asi que no hay pregunta de uso: se copia acá para que el patron sea autocontenido y el render
no dependa de otro arbol.

⚠️ El verde del icono publicado es `#00D26A` y el token de marca de la §7 es `#00C661`. Se
respeta el archivo publicado tal cual; la diferencia queda anotada, no "corregida" por un
generador.

## claude-oficial.png

Icono de aplicación **oficial**, de `https://claude.ai/images/claude_app_icon.png`
(estallido coral `#D97757` sobre crema `#F3E9D7`). Uso nominativo, igual que el resto.

🔴 **Reemplaza al `claude.path` de simple-icons, que estaba MAL.** Sergio Urcullo lo marcó
el 06-sep: *"el logo de claude no es el original"*. Tenía razón, y el error era doble —
yo lo había puesto **invertido** (cuadrado naranja con estallido blanco; el real es al
revés), y encima la entrada de simple-icons dibuja el estallido mucho más tosco, con
rayos irregulares que se cruzan.

**Lección:** "logo real" no es lo mismo que "logo de una librería de logos". Para una
marca conocida, el icono oficial del propio producto gana siempre. `claude.path` queda
por si hace falta una versión monocroma.
