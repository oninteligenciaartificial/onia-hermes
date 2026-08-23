# P01 · Evaluar e instalar genjutsu y motion-design-skill (los 2 hallazgos que no tenemos)

- **Destino:** `web-factory`
- **Sale de:** [la ficha](../2026-08-23-cosecha-cinco-skills-animacion-genjutsu-motion-design.md) · `Db--nmlFmqR` · @sujeitoprogramador
- **Fuente:** https://www.instagram.com/p/Db--nmlFmqR/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Para web-factory, NADA: los dos repos son públicos y MIT, y la evaluación es leer el código antes de instalar (con una precaución concreta: la barra de lenguajes de Genjutsu dice Python 95,1% + Shell 4,9%, o sea que trae scripts ejecutables, no solo markdown — eso se revisa ANTES de instalarlo, no después). Para marketing, tampoco falta credencial ni permiso de gasto: el circuito comentario→DM está vivo y el destino ya está decidido desde el 23-ago. Lo único que falta ahí es elegir el TEMA del roundup propio, porque Onia no vende skills de animación.

---

```text
Objetivo único de la sesión: decidir, con evidencia leída, si las skills públicas `AThevon/genjutsu` y `lottiefiles/motion-design-skill` entran a nuestro stack de motion o se descartan por duplicación.

De dónde sale: ficha de video-intake `cinco-skills-animacion-genjutsu-motion-design` (carrusel de @sujeitoprogramador, IG Db--nmlFmqR). El carrusel lista 5 "skills de animación". Ya verifiqué por grep sobre todo el repo que TRES de las cinco ya las tenemos y NO hay que tocarlas:
- GSAP → plugin `gsap-skills` instalado, 8 skills (gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-frameworks, gsap-performance, gsap-utils).
- Three.js → adapter en `.claude/skills/hyperframes-animation/adapters/three.md`.
- Motion / Framer Motion → ya en uso en web-factory, documentado en `hermes-content/references/ui-patterns/APRENDIZAJE_WEBS.md`.
Las dos que NO existen en el repo (cero coincidencias de grep) son las dos de este encargo.

Pasos:

1) Worktree propio con ruta explícita, `git branch --show-current` antes de tocar nada. Carril web-factory.

2) Clonar los dos repos FUERA del repo (a un temp), no instalarlos todavía:
   - https://github.com/AThevon/genjutsu
   - https://github.com/lottiefiles/motion-design-skill

3) REVISIÓN DE SEGURIDAD ANTES DE INSTALAR — no es opcional. Dato leído en pantalla en la lámina s02 del carrusel: el repo de Genjutsu declara `Python 95,1% · Shell 4,9%`. Una skill de diseño de movimiento que es 95% Python + 5% shell tiene SCRIPTS EJECUTABLES, no es solo markdown. Antes de instalar:
   - listar todo archivo `.py`, `.sh`, y todo hook declarado;
   - leer qué hacen: si escriben fuera del cwd, si hacen red, si leen credenciales o `.env`, si tocan configuración de Claude;
   - si algo hace red o toca settings/credenciales, PARAR y reportarlo sin instalar.
   Mismo chequeo para motion-design-skill (su README se declara "philosophy-first, implementation-agnostic", así que probablemente sea markdown puro — verificarlo, no asumirlo).

4) SOLAPAMIENTO. Leer el SKILL.md / README de cada uno contra lo que ya tenemos y responder por escrito, skill por skill:
   - ¿Qué dice que hace que `.claude/skills/motion-doctrine/` NO cubra ya?
   - ¿Qué dice que hace que `.claude/skills/cut-the-curve/` y `seam-craft` NO cubran ya?
   - ¿Qué aporta sobre `web-factory/docs/MOTION_PATTERN_BANK_2026.md`?
   - ¿Contradice alguna regla de motion-doctrine? (motion-doctrine se declara superior a guías de motion upstream — si hay choque, gana motion-doctrine y hay que decirlo explícito).
   Genjutsu además dice cubrir Android (Jetpack Compose) y Apple (SwiftUI) — eso NO nos sirve hoy, no lo cuentes como valor.

5) VEREDICTO POR SKILL, uno de tres: INSTALAR / DESCARTAR-POR-DUPLICACIÓN / DESCARTAR-POR-RIESGO. Con la razón en una línea y el archivo concreto que la respalda.

6) Solo las que den INSTALAR se instalan, y se prueban de verdad, no por grep: aplicar la skill a UN componente real de web-factory y MIRAR el resultado renderizado (Playwright + captura, y leer la captura). Un 200 y un grep no son verificación.

7) Escribir el resultado donde corresponde: si una skill entra, se anota en la skill nuestra que corresponda (editar la existente, NO crear doc suelto en la raíz). Si las dos se descartan, se anota el descarte con su razón en la ficha de video-intake para que nadie las vuelva a evaluar en tres semanas.

8) Cerrar el carril: commits conventional explicando el POR QUÉ, gates (`tsc --noEmit`, tests, code-reviewer), y handoff en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos, incluyendo intentos fallidos.

No hagas: no instales nada sin haber leído sus scripts; no reabras la Landing v3 (aprobada, base clara); no toques los 4 archivos raíz de web-factory sin avisar; no persigas el otro frente que salió de esta ficha (el molde de carrusel para marketing) — ese va en otra sesión, anótalo y seguí.

LISTO = existe un veredicto escrito (INSTALAR / DESCARTAR-POR-DUPLICACIÓN / DESCARTAR-POR-RIESGO) para cada una de las dos skills, cada veredicto citando el archivo leído que lo respalda; y si alguna dio INSTALAR, hay una captura renderizada de un componente real de web-factory hecho con ella, mirada y comentada.
```
