# Web Factory GitHub Design Sources 2026-06-26

## Uso operativo

Estas fuentes se usan para que Web Factory razone con patrones actuales de UI, componentes, motion, accesibilidad y sistemas de diseno. No son permiso para copiar identidad visual, assets, claims, marca, textos o composiciones cerradas.

## Regla de seleccion

1. Buscar repos actuales por estrellas, actividad reciente y licencia.
2. Priorizar MIT o Apache-2.0 para codigo reutilizable con revision.
3. Tratar `NOASSERTION`, repos de marca y galerias cerradas como inspiracion estructural solamente.
4. Retokenizar colores, tipografia, spacing, copy, estados, responsive y accesibilidad antes de usar en una web de cliente.
5. Cruzar siempre con referencias exactas del rubro y assets aprobados por el cliente.

## Ranking actualizado

| Repo | Stars | Push reciente | Licencia | Uso en Web Factory |
|---|---:|---|---|---|
| twbs/bootstrap | 174398 | 2026-06-25 | MIT | Responsive y componentes robustos para webs simples. |
| shadcn-ui/ui | 117438 | 2026-06-24 | MIT | Componentes React/Tailwind sobrios y accesibles. |
| mui/material-ui | 98473 | 2026-06-25 | MIT | Formularios, tablas y dashboards complejos. |
| ant-design/ant-design | 98470 | 2026-06-25 | MIT | Productos operativos densos y enterprise. |
| tailwindlabs/tailwindcss | 95753 | 2026-06-25 | MIT | Tokens, responsive y composicion rapida. |
| saadeghi/daisyui | 41178 | 2026-06-26 | MIT | Prototipos y componentes rapidos sobre Tailwind. |
| chakra-ui/chakra-ui | 40480 | 2026-06-25 | MIT | Theming, accesibilidad y SaaS. |
| motiondivision/motion | 32520 | 2026-06-25 | MIT | Animaciones sobrias y microinteracciones. |
| mantinedev/mantine | 31316 | 2026-06-25 | MIT | Formularios y dashboards con buena cobertura. |
| heroui-inc/heroui | 29723 | 2026-06-25 | Apache-2.0 | UI moderna para landings y productos expresivos. |
| magicuidesign/magicui | 21357 | 2026-06-03 | MIT | Motion y secciones memorables con moderacion. |
| microsoft/fluentui | 20068 | 2026-06-25 | NOASSERTION | Lectura de patrones enterprise; requiere revision legal. |
| radix-ui/primitives | 19011 | 2026-06-16 | MIT | Accesibilidad y comportamiento headless. |
| carbon-design-system/carbon | 9237 | 2026-06-25 | Apache-2.0 | B2B tecnico, tablas, estados y documentacion. |
| radix-ui/themes | 8498 | 2026-04-11 | MIT | Theming simple y consistencia rapida. |
| primer/react | 3866 | 2026-06-25 | MIT | Herramientas, docs y flujos developer/producto. |
| themesberg/flowbite-react | 2142 | 2026-02-27 | MIT | Referencia secundaria Tailwind. |

## Skills y fuentes no oficiales

Esta capa corrige el sesgo de mirar solo repos oficiales. Se usa para criterio de diseno, estilos, DESIGN.md, motion y bloques, no como permiso automatico para copiar codigo.

| Repo | Stars | Push reciente | Licencia | Uso en Web Factory |
|---|---:|---|---|---|
| nextlevelbuilder/ui-ux-pro-max-skill | 96483 | 2026-06-25 | MIT | Fuente externa principal para reglas de UI/UX, estilos y razonamiento anti-generico. |
| VoltAgent/awesome-design-md | 93199 | 2026-06-16 | MIT | Biblioteca de DESIGN.md para que los agentes sigan una direccion visual concreta. |
| DavidHDev/react-bits | 41903 | 2026-06-24 | NOASSERTION | Inspiracion de componentes animados e interacciones memorables. Revisar licencia antes de copiar codigo. |
| alexpate/awesome-design-systems | 25199 | 2026-04-28 | Unlicense | Indice para descubrir sistemas de diseno no obvios por industria. |
| gztchan/awesome-design | 17217 | 2024-07-04 | NOASSERTION | Indice amplio de recursos; usar con menor prioridad por vigencia/licencia. |
| VoltAgent/awesome-claude-design | 2850 | 2026-06-20 | MIT | DESIGN.md listos para inspiracion de scaffolds. |
| ttt30ga/awesome-product-design | 2623 | 2025-09-22 | CC0-1.0 | UX/product thinking, no componentes. |
| moumen-soliman/uitripled | 1251 | 2026-05-16 | MIT | Bloques y paginas con shadcn/Base UI + Motion; retokenizar siempre. |

## Skills locales a activar

- `impeccable`: usar para UI/UX serio, jerarquia, anti-slop, motion, accesibilidad, responsive, copy y polish. Es mas importante que el repo publico `DevvGwardo/impeccable`, que tiene baja adopcion.
- `design-taste-frontend`: usar en landings, portfolios y redisenos para inferir lectura de brief, diales de variacion/motion/densidad, evitar heroes genericos, usar imagenes reales y correr pre-flight anti-slop.
- `web-factory-design-research`: orquestar busqueda actual en GitHub + galerias + DESIGN.md + screenshots antes de `pnpm design:auto`.

## Nueva regla de seleccion

1. Primero buscar skills/fuentes de criterio: `ui-ux-pro-max`, `awesome-design-md`, `awesome-claude-design`, `impeccable`, `design-taste`.
2. Despues buscar bloques y motion: `react-bits`, `uitripled`, Magic UI, Motion.
3. Luego buscar design systems oficiales cuando el rubro lo exige: shadcn, Radix, MUI, Ant, Carbon, Polaris.
4. Para codigo reutilizable, exigir licencia clara. Para NOASSERTION, extraer patrones y reimplementar.
5. Para cada web, declarar `Design Read`, diales de diseno, assets necesarios, referencias usadas, referencias rechazadas y copy-risk.

Fuente machine-readable: `web-factory/data/references/design-sources/github-design-repos-20260626.json`.
