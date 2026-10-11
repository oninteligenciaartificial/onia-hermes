# F1 · Que las fichas por anunciante citen las 7 capturas del 11-oct

Contrato de Ventas y pauta para Codex (modelo pedido: `gpt-6.1-sol`, razonamiento medium). Lo lanza la madre; Codex no hace git ni toca Meta: entrega los cambios y la madre revisa y commitea. Creado el 11-oct-2026 después de «LISTA PARA MOSTRAR: prueba 1 v2».

Sos Codex, ejecutor de la madre. Trabajás SOLO en el repo `onia-hermes`. Nadie te contesta mientras corrés: decidí con este texto y con los archivos, y lo que no puedas decidir anotalo en el resumen final.

## META
Las fichas `hermes-content/research/competencia/anuncios/fichas/{agendapro,doctocliq,reservo}.md` hoy no mencionan las 7 capturas del 11-oct que están en `hermes-content/research/competencia/anuncios/CAPTURAS-50D-11OCT.md` (AgendaPro ×4, Doctocliq ×2, Reservo ×1, archivos `<anunciante>/<id>-11oct.png`). Que cada ficha traiga una sección **«Capturas del 11-oct»** con esas capturas, generada por `biblioteca-fichas.mjs`, y que un test falle si una captura `*-11oct.png` queda sin citar.

## PRUEBA DE HECHO
1. `LECTURAS.json` (misma carpeta de fichas) tiene, para `agendapro`, `doctocliq` y `reservo`, una clave nueva `capturas_11oct`: lista de `{ id, dias, formato, texto_principal, llamado, ruta }` copiada **palabra por palabra** de la tabla de `CAPTURAS-50D-11OCT.md` (sin resumir ni corregir; una celda vacía es `null`).
2. `.claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` escribe, en cada ficha que tenga esa clave, una sección «Capturas del 11-oct» con una fila por captura y la ruta del PNG. Las fichas sin la clave quedan **idénticas** a como están hoy (`git diff` vacío para ellas al regenerar).
3. Regenerá con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` (sin argumentos) y comprobá que solo cambian esas 3 fichas y `fichas/README.md` si corresponde.
4. Un test nuevo `scripts/biblioteca-fichas-capturas.test.mjs`, registrado en `package.json` (`test:biblioteca-fichas-capturas`, dentro de la cadena `test` justo después de `test:replica-grupo1`), que: lista los `*-11oct.png` de `anuncios/`, exige que el id de cada uno aparezca en la ficha de su anunciante, y exige que los días de la sección coincidan con los de `CAPTURAS-50D-11OCT.md`. Corré el test y mostralo en verde; probalo también en rojo quitando a mano una fila (y restaurala).
5. `npm run test:replica-grupo1` y `npm run test:docs-hygiene` siguen en verde.

## REGLA DE PARADA
- No inventes datos: si una celda de `CAPTURAS-50D-11OCT.md` no dice algo, queda `null` y la ficha dice «no observable».
- Dentalink `1614658333653742` **no** se capturó: no lo agregues; si el test lo pide, algo está mal.
- No abras Facebook ni internet, no instales nada, no toques `BIBLIOTECA-10OCT.json` ni los `.png`.
- No cambies el texto de `LECTURAS.json` ya escrito a mano (solo agregás la clave nueva).
- No hagas git. Si algo exige más de lo descrito, parás y lo anotás.

## Archivos
- Edita: `hermes-content/research/competencia/anuncios/fichas/LECTURAS.json`, `.claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs`, `package.json` (una línea de script y su lugar en la cadena).
- Crea: `scripts/biblioteca-fichas-capturas.test.mjs`.
- Regenera: `fichas/agendapro.md`, `fichas/doctocliq.md`, `fichas/reservo.md` (y `fichas/README.md` solo si el generador lo cambia).
- Lee: `hermes-content/research/competencia/anuncios/CAPTURAS-50D-11OCT.md`.

## Entrega
Un resumen de 10 líneas: qué cambió, la salida del test en verde y en rojo, y lo que no pudiste decidir.
