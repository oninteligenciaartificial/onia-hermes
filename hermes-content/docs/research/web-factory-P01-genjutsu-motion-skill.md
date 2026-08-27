# P01 — genjutsu y motion-design-skill

**Estado:** ejecutar
**Por que:** los dos existen, los dos son MIT verificado por API de GitHub, ninguno esta instalado, y no se pisan entre si: uno es criterio de motion (34 KB) y el otro es motor de ejecucion (plugin con 15 sub-skills).

## Que son (no son dos versiones de lo mismo)

| | genjutsu | motion-design-skill |
|---|---|---|
| Que es | **Plugin** de Claude Code | **Skill** suelto |
| Publica | AThevon (individual) | LottieFiles (empresa) |
| Aporta | Ejecucion: escanea el stack y escribe el codigo de motion | Criterio: que duracion, que easing, que intencion emocional |
| Ata a libreria | Si (gsap, framer-motion, css, three, canvas) | No, es agnostico |
| Peso | 1.571 KB | 34 KB |
| Se instala | `/plugin marketplace add` + `/plugin install` | copiar carpeta a `.claude/skills/` |

## Fichas verificadas

### genjutsu — https://github.com/AThevon/genjutsu

| Dato | Valor | Como se verifico |
|---|---|---|
| Licencia SPDX | **MIT** | `gh api repos/AThevon/genjutsu --jq .license.spdx_id` |
| Estrellas | 277 | misma API |
| Ultimo push | 2026-07-31 (`08a792f6` "Release v3.3.0") | misma API |
| Archivado | no | misma API |
| Version | v3.3.0 (antes se llamaba `creative-excellence`) | repo |
| Paquete npm | **no existe** — es plugin, no npm | busqueda npm |

Expone dos orquestadores:
- `/genjutsu:cast` — agrega motion y micro-interacciones a una UI **que ya existe**: escanea el stack, propone una "interaction thesis", **pide aprobacion**, implementa y audita.
- `/genjutsu:paint` — construye un universo visual **de cero**: brainstorm, tesis visual, genera un `MASTER.md` de design system, implementa, audita.

Debajo tiene 15 sub-skills en `skills/_jutsu/` que los orquestadores cargan segun el stack detectado:

| Grupo | Sub-skills | Sirve a web-factory |
|---|---|---|
| Base | `motion-principles`, `design-audit`, `ui-ux-pro-max` | si |
| Contexto | `mobile-principles`, `desktop-principles` | si |
| Web | `gsap`, `framer-motion`, `css-native`, `threejs-r3f`, `canvas-generative` | si |
| Android | `compose-motion`, `compose-graphics`, `compose-multiplatform` | **no** |
| Apple | `swiftui-motion`, `swiftui-graphics` | **no** |

Casi la mitad del peso es Android/Apple: muerto para nosotros, pero no molesta (se carga por deteccion de stack, no siempre).

### motion-design-skill — https://github.com/LottieFiles/motion-design-skill

| Dato | Valor | Como se verifico |
|---|---|---|
| Licencia SPDX | **MIT** | `gh api repos/LottieFiles/motion-design-skill --jq .license.spdx_id` |
| Estrellas | 1.368 | misma API |
| Ultimo push | 2026-05-18 (`f9a8a041` "Update README.md") | misma API |
| Archivado | no | misma API |
| Peso | 34 KB | misma API |
| Paquete npm | **no existe** — es agent skill | busqueda npm |

Un solo skill, `skills/motion-design/`, con `SKILL.md` (12,5 KB, frontmatter `name: motion-design`, `license: MIT`, v1.0.0) y tres carpetas:

- `director/` — filosofia: tres pilares, los 12 principios de Disney adaptados a UI, mapeo emocion -> movimiento, coreografia, adaptacion por contexto.
- `patterns/` — recetas: entrada/salida, estados de feedback, movimiento ambiente, multi-elemento.
- `reference/` — tablas de duracion y easing, guia de seleccion de propiedad, checklist de calidad, troubleshooting.

No trae sintaxis de ninguna libreria: ensena a **decidir** antes de escribir codigo. Contenido de principios, no se pudre: que el ultimo commit sea de mayo no es abandono.

## Ambiguedad de nombre: resuelta

- `motion-design-skill`: coincidencia **exacta** de nombre, 1.368 estrellas, publicado por LottieFiles. Cero duda.
- `genjutsu`: hay ~16 homonimos en GitHub (es una palabra de Naruto). `AThevon/genjutsu` es **el unico que es un plugin de Claude Code** — tiene `.claude-plugin/marketplace.json` y `plugin.json`. Los demas son juegos, bots y libs sin relacion.

## Colisiones con lo que ya esta instalado

Revisado antes de decidir: `C:\Users\PC\.claude\skills`, `C:\Users\PC\.claude\plugins\installed_plugins.json` y los marketplaces. **Ninguno de los dos aparece hoy.**

| Riesgo mirado | Veredicto |
|---|---|
| `ui-ux-pro-max` duplicado (ya hay una version global vieja: 50+ estilos, 161 paletas, 57 pares tipograficos; genjutsu trae 84 / 192 / 74) | **No chocan.** La de genjutsu vive en `skills/_jutsu/`, un nivel mas abajo de lo que el discovery registra, y su propio frontmatter dice "modulo interno, no invocado directamente" |
| Comandos | Quedan namespaceados: `/genjutsu:cast`, `/genjutsu:paint` |
| `gsap-skills` instalado | Es capa de **sintaxis**; motion-design-skill es capa de **decision**. No compiten |
| `impeccable` | Es capa de **criterio visual**. Tampoco compite con timing/easing |

## Instalacion

```
# genjutsu — como PLUGIN, no copiando carpetas
/plugin marketplace add AThevon/genjutsu
/plugin install genjutsu

# motion-design-skill — copiar el skill
git clone --depth 1 https://github.com/LottieFiles/motion-design-skill /tmp/mds
cp -r /tmp/mds/skills/motion-design ~/.claude/skills/motion-design
```

`npx skills add LottieFiles/motion-design-skill` hace lo mismo que el `cp`.

## Condiciones de adopcion

**motion-design-skill: adopcion trivial.** 34 KB, cero dependencias, capa de decision que no pisa a nadie. Entra y listo.

**genjutsu: entra pero NO se declara default.** Dos motivos:

1. `/genjutsu:paint` pisa territorio del flujo obligatorio `impeccable` + `onia-web-factory`. Si se vuelve default por inercia, se saltea el pipeline de diseno del proyecto.
2. Rige la regla del proyecto: *un rediseno se muestra renderizado y se espera el OK explicito de Sergio sobre esa pieza*. Construir y publicar son dos permisos distintos.

**Como se prueba:** `/genjutsu:cast` (no `paint`) sobre **una** landing ya existente, se renderiza, se muestra, y ahi se decide si sube a default. `paint` queda congelado hasta que esa prueba pase.

## Lo que NO se hace

- No copiar genjutsu a mano a `.claude/skills/` — rompe el namespacing y expone los 15 sub-skills al discovery.
- No tocar el `ui-ux-pro-max` global: la copia de genjutsu es interna y no lo reemplaza.
- No correr `/genjutsu:paint` sobre una superficie viva.
