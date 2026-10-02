# P05 — "Claude Design: cargar la marca una vez"

**Estado:** mirar
**Por que:** para web-factory el objetivo de P05 YA esta resuelto en codigo desde el commit `8dc76c1` (2026-08-23); adoptar Claude Design como lugar donde vive la marca crearia el segundo lugar que ese commit vino a matar. Lo que si queda abierto es otra cosa que P05 no nombra: dos archivos de tokens vivos que contradicen la marca unificada.

---

## 1. Que es Claude Design (verificado en fuente oficial)

Producto real de **Anthropic Labs**: `claude.ai/design`, research preview para Pro/Max/Team/Enterprise (deshabilitado por defecto en Enterprise), movido por Opus 4.7. Un lienzo donde Claude genera disenos, prototipos y one-pagers en HTML vivo.

Su capa relevante para P05 es el **Design System**: durante el setup *"Claude builds a design system for your team by reading your codebase and design files"*, y todo proyecto posterior hereda esos colores, tipografia y componentes sin repetirlos en cada prompt. Esa frase ES el "cargar la marca una vez" del encargo.

Puente desde Claude Code: **NO es un MCP**. Es la herramienta nativa `DesignSync` mas el comando `/design-sync`, que sincroniza componentes locales contra un proyecto de Claude Design.

Dos limites que definen el veredicto:

- El design system de Claude Design es un **espejo derivado del codigo**, no la definicion. La doc oficial recomienda sincronizar *"incrementally, one component at a time, never as a wholesale replace"*.
- Sirve para lo que se genera **dentro** del lienzo de `claude.ai/design`. web-factory no genera por ahi: genera por su propio pipeline (`packages/blocks`, `packages/templates`, `.design.json`). No toca el problema que P05 enuncia.

## 2. Herramientas que existen DE VERDAD en esta sesion

Buscadas con ToolSearch, no inventadas.

| Herramienta | Que es | Que hace |
|---|---|---|
| `DesignSync` | **nativa de Claude Code**, no MCP | `list_projects` / `get_project` / `list_files` / `get_file` / `create_project` / `finalize_plan` / `write_files` / `delete_files` / `register_assets`. PROBADA: devolvio el proyecto real |
| `mcp__stitch__*` | Google Stitch, **otro producto** | `upload_design_md`, `create_design_system_from_design_md`, `apply_design_system`, `create/update/list_design_systems` |
| `import-claude-design-from-url` | duplicada en el MCP de Vercel y en el de Gamma | importa un diseno de Claude Design por URL hacia esas plataformas |

Skills locales instaladas que suenan parecido pero **no son** Claude Design: `design-md`, `stitch-extract-design-md`, `stitch-manage-design-system`, `stitch-generate-design`, `design-dna`, `brand`, `brandkit`.

**Ojo con la confusion mas cara del prompt:** `DESIGN.md` es de **Stitch**, no de Claude Design. Si alguien lee "un archivo DESIGN.md que se carga como contexto" y lo implementa, esta dando de alta un tercer sistema.

Estado de la cuenta: existe un proyecto **"Design System"** (`81bb3fda-be86-4686-9bce-1f9c1cd243fc`) y esta **VACIO** — 0 archivos, ultima actualizacion 2026-06-30, o sea anterior a la unificacion de marca.

**Bloqueo operativo:** la herramienta `DesignSync` responde, pero la skill `/design-sync` **NO esta instalada** (buscada en todo `C:\Users\PC\.claude`: no existe ningun `design-sync`/`design-login`, y no aparece en el listado de skills de esta sesion). Sin ella habria que manejar el contrato a mano (`finalize_plan` -> `write_files`, con `@dsCard` y `_ds_manifest.json`), que es bastante mas que "cargar la marca una vez".

## 3. Donde vive la marca HOY (verificado en disco)

| Archivo | Que define | Estado |
|---|---|---|
| `onia-platform/app/globals.css` (@theme, ~30-179) | escala `--color-verde-50..900` `#EDFBF3`→`#013925`; reescribe `green-*`/`emerald-*`/`gray-*`/`slate-*` de Tailwind a esos mismos valores; `--font-headline`/`--font-sans` = Archivo, `--font-mono` = Geist Mono | **FUENTE**. Arreglo los 237 usos escritos a mano |
| `web-factory/apps/onia-platform/src/app/globals.css` (18-27, 86-88) | `--verde-50..900` byte a byte iguales; `--font-display/sans/mono` = `--font-archivo` / `--font-geist-mono` | alineado. Es el "cargar una vez" del sitio |
| `web-factory/packages/tokens/src/index.ts` | `clientTokenVars()` lee `data/clients/<slug>.json` | **per-cliente, NO es la marca Onia**. No unificar |
| `hermes-content/brand/tokens.css` | `--onia-green: #10C26B`, Space Grotesk + Inter | 🔴 **CONTRADICE**. Se declara a si mismo "single source of truth" |
| `hermes-content/propuestas/assets/design-tokens.css` | `--deck-primary: #005f70` (teal), `Archivo Black` + `Azeret Mono` | 🔴 **CONTRADICE**. Va en material que ve el cliente |

## 4. Respuesta directa a la pregunta de P05

> ¿Como se carga esa marca UNA vez para web-factory sin crear un SEGUNDO lugar donde vive la marca?

**Ya se carga.** El `globals.css` de `web-factory/apps/onia-platform` declara la escala y las familias una sola vez, con los mismos valores que el producto, y todo el sitio las consume por variable CSS. No hace falta ninguna plataforma nueva para eso, y meter Claude Design en el medio agrega un lugar sin quitar ninguno.

La regla que sale de esto, para escribir en la skill `onia-web-factory`:

> La marca Onia se define en `app/globals.css` (escala `--verde-*` + `--font-*`). Cualquier otro archivo que declare un verde de marca o una familia tipografica es una **copia**, y una copia que no se re-sincroniza deriva. Antes de crear un archivo de tokens nuevo: no.

## 5. La deuda real, que P05 no nombra

Los dos archivos rojos de la tabla son el bug de los cuatro precios en version color. `#10C26B` es un verde menta que no es `#089868` ni `#027650`; `#005f70` es teal y no es verde. Ambos estan vivos:

- `brand/tokens.css` lo leen `hermes-content/references/piezas-ui-patterns/build.mjs`, `hermes-content/docs/historial/muestrario-inmobiliario-20260812/generar-muestrario.js` y la presentacion de SCZ.
- `propuestas/assets/design-tokens.css` lo consume `propuestas/bolivian-electric-transformacion-ia-2026.html`.

**Fix minimo (no es este carril, se anota como pendiente):** reemplazar los hex de esos dos archivos por los de la escala verificada y borrar de `brand/tokens.css` la linea que se autoproclama fuente. Los nombres de variable se quedan igual, asi ningun consumidor se rompe. Verificacion, una sola linea, falla si vuelve a aparecer un verde fuera de marca:

```bash
grep -rIn --exclude-dir=node_modules --exclude-dir=historial \
  -e '#10C26B' -e '#0B8F4F' -e '#005f70' hermes-content/ \
  && echo "FALLA: hex fuera de marca" || echo "OK"
```

## 6. Si igual se quiere probar Claude Design

Piloto acotado y para **otra** cosa: generar decks y one-pagers de Onia **dentro** de `claude.ai/design` heredando la marca, que es lo unico que Claude Design resuelve y hoy se hace a mano. Condiciones:

1. El proyecto de Claude Design es un **espejo** de `globals.css`, nunca la fuente. Se escribe en el checklist antes de sincronizar nada.
2. Un dueno unico y una re-sincronizacion obligatoria al cambiar la escala, o queda otro lugar diciendo la marca de junio.
3. Requiere instalar `/design-sync` primero.

Sin las tres, no se toca: un espejo desactualizado es peor que no tener espejo.

## 7. Fuentes

| URL | Que confirma | Licencia |
|---|---|---|
| https://www.anthropic.com/news/claude-design-anthropic-labs | Claude Design existe, corre sobre Opus 4.7, research preview Pro/Max/Team/Enterprise; el design system se construye leyendo el codebase y los archivos de diseno, y se hereda en cada proyecto | N/A (anuncio oficial) |
| https://support.claude.com/en/articles/14604416-get-started-with-claude-design | Mecanica del design system: import desde repo de GitHub / archivos de diseno / codebase local; herencia automatica; los admins pueden fijarlo y bloquear ediciones; nombra `/design-sync` de Claude Code como el puente | N/A (centro de ayuda oficial) |

Los ids, rutas y hex de este documento se verificaron en esta sesion (herramienta `DesignSync` y lectura directa de los archivos citados). El listado de MCPs sale de ToolSearch en vivo. No hay repos que adoptar en este prompt, asi que no hay licencia de software que evaluar.
