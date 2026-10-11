---
id: ventas-V03
carril: ventas
estado: pendiente
modelo: gpt-6.1-sol
repo: onia-hermes
rama: codex/ventas-v03-fichas-competencia
base: main
pr:
escrita: 2026-10-11 por Ventas y pauta (sesión de la nube, Sonnet 5.5), a pedido de la madre (S05 y mensaje «usá Codex para lo cerrado»)
actualizada: 2026-10-11 por Ventas y pauta
nota:
---
# V03 · Que las fichas por anunciante citen las 7 capturas del 11-oct

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/ventas-v03-fichas-competencia`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y los archivos; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Las fichas `hermes-content/research/competencia/anuncios/fichas/{agendapro,doctocliq,reservo}.md` no mencionan las 7 capturas del 11-oct que están en `hermes-content/research/competencia/anuncios/CAPTURAS-50D-11OCT.md` (AgendaPro ×4, Doctocliq ×2, Reservo ×1; archivos `<anunciante>/<id>-11oct.png`). Que cada una de esas tres fichas traiga una sección **«Capturas del 11-oct»** generada por `biblioteca-fichas.mjs`, y que un test falle si una captura `*-11oct.png` queda sin citar. Sin llamar a Meta.

## PRUEBA DE HECHO
1. Archivo nuevo `hermes-content/research/competencia/anuncios/fichas/CAPTURAS-11OCT.json` (**no se toca `LECTURAS.json`**: son las lecturas escritas a mano). Forma: `{ "<anunciante>": [ { id, dias, formato, texto_principal, llamado, ruta } ] }` con las 7 capturas copiadas **palabra por palabra** de la tabla de `CAPTURAS-50D-11OCT.md` (sin resumir ni corregir; una celda vacía es `null`; `ruta` es la del `.png`).
2. `.claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` lee ese archivo si existe y escribe, en la ficha de cada anunciante que tenga entradas, una sección «Capturas del 11-oct» con una fila por captura y su ruta. Las fichas sin entradas quedan **idénticas** a las de hoy.
3. Regeneradas con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` (sin argumentos): cambian solo `agendapro.md`, `doctocliq.md`, `reservo.md` (y `README.md` si el generador lo toca). La madre lo comprueba con `git diff --stat`.
4. Test nuevo `scripts/biblioteca-fichas-capturas.test.mjs`, registrado en `package.json` como `test:biblioteca-fichas-capturas` y puesto en la cadena `test` justo después de `test:replica-grupo1`. Exige: (a) todo `*-11oct.png` de `anuncios/` está en `CAPTURAS-11OCT.json`; (b) su id aparece en la ficha de su anunciante; (c) los días coinciden con los de `CAPTURAS-50D-11OCT.md`. La madre lo corre en verde y también en rojo (quitando a mano una fila y restaurándola).
5. `node --test scripts/replica-grupo1.test.mjs` y `node --test scripts/docs-hygiene.test.mjs` siguen en verde.

## REGLA DE PARADA
- No inventes datos: si una celda de `CAPTURAS-50D-11OCT.md` no dice algo, queda `null` y la ficha dice «no observable».
- Dentalink `1614658333653742` **no** se capturó: no lo agregues; si el test lo pide, algo está mal.
- No abras Facebook ni internet, no instales nada, no toques `BIBLIOTECA-10OCT.json`, `LECTURAS.json` ni los `.png`.
- Las cifras de las fichas salen del JSON de la Biblioteca: no cambies ninguna.
- Si algo exige más de lo descrito, parás y lo anotás.

## ARCHIVOS
- **Crea:** `hermes-content/research/competencia/anuncios/fichas/CAPTURAS-11OCT.json`, `scripts/biblioteca-fichas-capturas.test.mjs`.
- **Edita:** `.claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs`, `package.json` (una línea de script y su lugar en la cadena `test`).
- **Regenera:** `hermes-content/research/competencia/anuncios/fichas/{agendapro,doctocliq,reservo}.md` (y `README.md` solo si el generador lo cambia).
- **Lee:** `hermes-content/research/competencia/anuncios/CAPTURAS-50D-11OCT.md`.
- Todo lo demás, prohibido. (La orden S05 listaba solo la carpeta `fichas/`; el generador y el test viven fuera de ella y por eso se nombran acá.)
