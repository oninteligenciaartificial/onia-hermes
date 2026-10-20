# Cuartitos: skills que leen los trabajadores de la nube

Copias de skills globales de la PC (`~/.claude/skills/`) que los carriles de la nube necesitan leer.
GitHub Actions no ve la PC, así que lo que un trabajador lee tiene que estar en el repo. No están en
`.claude/skills/` a propósito: ahí se cargarían como skills duplicadas en cada sesión de la PC. El
trabajador las lee por ruta, porque así lo dice su cuartito en `../carriles.json` (`leer`).

| Carpeta | Origen | Licencia |
|---|---|---|
| copywriting, community-marketing, lead-magnets, onboarding, competitor-profiling | github.com/coreyhaines31/marketingskills (v2.0.1) | MIT, `LICENSE-marketingskills` |
| humanizer | copia global de la PC | MIT, `humanizer/LICENSE` |
| deep-research | github.com/affaan-m/ECC | MIT, `deep-research/LICENSE` |

Copiadas el 19-oct-2026, sin las carpetas `evals/`. Si la skill global se actualiza, se vuelve a copiar.

Los carriles que corren en la PC (`"donde": "pc"`) con motor codex pueden leer una skill global por ruta absoluta
(`C:/Users/PC/.claude/skills/...`), como plataforma con `next-dev-loop`, `prisma-cli` y `diagnosing-bugs` (20-oct).
Con motor claude, además hay que sumar la carpeta a `dirs_extra`. Un carril de la nube no puede: `orquesta.test.mjs`
falla si su `leer` tiene una ruta de la PC o una que no existe. Riesgo aceptado: esas copias globales no pasan por PR;
solo cambian cuando alguien las reinstala o actualiza, y eso pide el sí de Sergio Urcullo.
