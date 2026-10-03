# Kit de grabación · desde el sábado 3 de octubre

Para Sergio Urcullo, que empieza a grabar hoy. Cada ficha enseña el tema antes de grabarlo:
- qué es, en 3 líneas;
- por qué le importa a quien mira;
- qué tener abierto;
- el guion por tomas;
- qué te pueden preguntar.

Los guiones salen de `GUIONES-2-SEMANAS-1-14-OCT.md`. Si una frase cambia acá, se cambia también allá.
Los datos de las fichas se verificaron el 3-oct con su fuente.

## Antes de cualquier toma (sirve para todas)

1. **Teléfono en trípode**, vertical, a la altura de los ojos, plano medio (de la cintura para arriba). Sin moverlo en toda la
   pieza.
2. **Micrófono de solapa prendido a la remera**, no en la mano: en la mano tapa la cara y mete ruido de roce.
3. **Una idea por toma.** Decí la toma entera; si te trabás, pausa de 2 segundos y repetí la frase completa. Los cortes caen en
   esas pausas.
4. **Toma de cierre aparte**, de unos 4 segundos: el remate y la despedida. Sin ella, el video termina en seco.
5. **La pantalla se graba aparte** (grabación de pantalla de la PC), siguiendo la lista «Qué tener abierto» de cada ficha. Va
   arriba o en tarjetas en la edición.
6. Al terminar: el bruto a Drive, carpeta «Videos Onia Octubre».

**Molde de edición** (skill `edicion-referentes`): cada ficha dice cuál va. **Santiago** cuando hay una prueba que mostrar
(captura oficial, página, número): pantalla partida con la prueba arriba. **Erik** cuando es un tutorial de pasos: tu cara
a lo ancho y tarjetas que se arman con cada paso.

## Orden desde hoy

Primero lo que no vence y se graba sólo con tu PC. Las noticias, la misma semana en que salen.

| # | Pieza | Estado | Molde |
|---|---|---|---|
| 1 | D01-A · Tu primera skill en un minuto | grabar (no vence) | Erik |
| 2 | D03-A · El hook que commitea solo y su guarda | grabar (no vence) | Erik |
| 3 | D05-A · Dos sesiones sin pisarse (worktrees) | grabar (no vence) | Erik |
| 4 | D06-A · El handoff de siete campos | grabar (no vence) | Erik |
| 5 | D04-C · «Verificado» con un 200 | grabar (no vence) | Santiago |
| 6 | N06 · Gemini CLI → Antigravity CLI | grabar esta semana (noticia del 2-oct) | Santiago |
| 7 | D02-A · La perilla de esfuerzo | grabar esta semana (cambio de los modelos 5.5) | Santiago |
| 8 | N02 · Sonnet 4.5 se apaga el 30-nov | grabar antes del 30-nov | Santiago |
| 9 | N04 · La skill verify antes de cada commit | grabar (vigente) | Erik |
| 10 | D03-B · Claude Code lee AGENTS.md | grabar (vigente) | Santiago |
| 11 | D04-A · Retiré seis de nueve subagentes | grabar (no vence) | Erik |
| 12 | D04-B · /skill-doctor | grabar; verificar el comando ese día | Erik |
| 13 | S1-D07-B · 24 MCP y ninguno en mis archivos | grabar (no vence) | Erik |
| 14 | D05-C · «Quedaban 2», había 44 | grabar (historia del 20-ago; hoy n8n tiene otro número: decí la fecha) | Santiago |
| 15 | S2-D12-B · n8n: la clave no va en el nodo | grabar (no vence) | Erik |
| 16 | D03-C · YouTube · Un CLAUDE.md con historia | grabar (no vence) | YouTube: molde por definir |
| 17 | D01-C · YouTube · Opus o Sonnet | **reescribir**: le falta Fable 5.1, el modelo más alto de hoy | YouTube |
| 18-27 | R01, G04, R06, R03, R05, R02, R07, R04, G10 y G11 (repos) | grabar; **el mismo día se verifica que el repo siga igual** (README, comandos, licencia) | Santiago |
| 28 | D05-B · Presentaciones en el plan gratis | grabar; verificar ese día qué incluye el plan Free | Erik |
| — | DD-A · El modelo nuevo de OpenAI | **descartar como video**: lo cubre el carrusel DD-A, y un video llegaría una semana tarde a la noticia | — |
| — | D02-B · Tu bot de WhatsApp paga cada respuesta | **vencida como noticia** (gancho «desde el 1 de octubre»). El dato sigue siendo cierto este mes: **reescribir el gancho y pasarla a Lucía** | — |

## Para Lucía

Las piezas de NEGOCIO, para dueños de clínica. Lucía no se presenta como profesional de salud y dice que es IA. La madre le pasa la
tarea; acá va la lista:

| Pieza | Por qué sirve para ella |
|---|---|
| S2-D07-A · La regla de 24 horas que rompe tu bot | Le pasa a cualquier clínica con WhatsApp; se cuenta sin ser técnica |
| S2-D08-A · ¿La IA le promete al cliente algo que no confirmaste? | Miedo real del dueño; la prueba son dos respuestas de chat |
| S2-D09-A · Por qué tu bot contesta dos veces lo mismo | Problema visible para el dueño, sin código |
| S2-D08-C · Los mensajes de tu bot que Meta no te cobra | Plata del dueño; precio de Meta verificable |
| S2-D13-C · Definí a tu cliente con cinco preguntas | Método de negocio, sin herramienta |
| D02-B (reescrita) · Tu bot de WhatsApp paga cada respuesta | Plata del dueño; cambiar el gancho a «este mes» |
| S2-D07-C · YouTube · Un bot que no inventa | Sólo si Lucía hace piezas largas; si no, se queda con Sergio Urcullo |

No van para Lucía las piezas técnicas de Claude Code, git o n8n (S2-D12-B incluida): son del público de Sergio Urcullo.

---

# Fichas de aprendizaje (las 7 primeras)

## 1 · D01-A · Tu primera skill de Claude Code en un minuto

**Palabra:** SKILL · **Molde:** Erik (las tarjetas arman la ruta y el archivo de a un pedazo) · **Largo:** ~60 s · **Verificado
el 3-oct:**
- code.claude.com/docs/en/skills: «Project | `.claude/skills/<skill-name>/SKILL.md`»; «`description` … How Claude decides
  when to invoke the skill»; «Run `/skills` to see all loaded skills».
- La historia de la skill de continuidad: `.claude/skills/onia-continuidad/SKILL.md`, «Planifiqué 6 features. 4 no
  existían — ya estaban hechos o ya estaban decididos».
- sergiourcullo.vercel.app/claude-code (la serie en video).

**(a) Qué es, como a un amigo.** Una skill es un archivo de instrucciones que le enseña a Claude Code a hacer una tarea a tu
manera. No se carga siempre: Claude lee su descripción y la usa sólo cuando el pedido coincide. Es como darle un manual que
abre cuando lo necesita.

**(b) Por qué le importa a quien mira.** Deja de repetirle lo mismo en cada sesión: lo escribe una vez y Claude lo aplica
solo. Y aprende la parte que casi nadie sabe: si la descripción es vaga, la skill nunca se usa.

**(c) Qué tener abierto antes de grabar**
1. Un proyecto de prueba en el editor, con la carpeta `.claude/skills/continuidad/` y su `SKILL.md`. Arriba van
   `name: continuidad` y `description: Invocar al arrancar cualquier sesión…`; abajo, tres renglones de instrucciones.
2. Una terminal en ese proyecto con `claude` abierto, para escribir `/skills` y que aparezca «continuidad».
3. Un pedido que coincida con la descripción, para mostrar que la usa, por ejemplo *«arrancamos: ¿qué hay pendiente?»*.

**(d) Guion por tomas**
- **T1, gancho:** «Una skill es un archivo que le enseña a Claude Code a hacer algo. Y lo usa solo cuando hace falta.
  Armemos una.»
- **T2:** «En tu proyecto creá la ruta que ves en pantalla: punto claude, barra skills, barra el nombre de tu skill. Adentro,
  un archivo SKILL punto md, en mayúsculas.» [la ruta se escribe de a un pedazo]
- **T3:** «Arriba van dos datos. Name, el nombre. Description, cuándo usarla.» [el frontmatter]
- **T4:** «Esa descripción es lo más importante: Claude la lee para decidir si la skill aplica. Si es vaga, no la usa nunca.»
  [sello sobre «description»]
- **T5:** «Abajo, las instrucciones, como se las explicarías a alguien nuevo.»
- **T6:** «La mía se llama continuidad. La descripción dice: invocar al arrancar cualquier sesión. Obliga a leer lo que ya
  sabemos antes de decidir. Nació el día en que mi agente planificó seis cosas, y cuatro ya estaban hechas o decididas.»
  [contador 6 → 4]
- **T7:** «Para comprobar la tuya, escribí barra skills: tiene que aparecer. Después pedile algo que coincida con la
  descripción, y fijate si la usa.» [grabación de pantalla con `/skills`]
- **T8, cierre:** «El video para instalar Claude Code y armar tu primera skill está en mi web: comentá SKILL y te paso el
  link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿Necesito pagar?»* Para Claude Code, sí: el plan gratis de Claude alcanza para el chat, no para Claude Code. Lo dice tu
  web arriba de todo.
- *«¿Y si la quiero en todos mis proyectos?»* Ponela en tu carpeta de usuario, `~/.claude/skills/<nombre>/SKILL.md`, en vez
  de la del proyecto.
- *«No me aparece en /skills.»* Revisá la ruta exacta y el nombre del archivo (`SKILL.md`, en mayúsculas), y que arriba estén
  `name` y `description` entre las dos líneas de `---`.

## 2 · D03-A · El hook que commitea solo, y la guarda que le puse después de romperlo

**Palabra:** HOOK · **Molde:** Erik (tarjetas con los tres pasos y el JSON) · **Largo:** ~60 s · **Verificado el 3-oct:**
- code.claude.com/docs/en/hooks: «The Stop event fires when Claude finishes responding»; «The `/hooks` command opens a
  read-only browser for viewing all your configured hooks».
- El bloque real de `.claude/settings.json`: `"Stop": [{ "hooks": [{ "type": "command", "command": "node
  scripts/git-autosync.js" }] }]`.
- La guarda real, en `scripts/git-autosync.js`: `git rev-parse -q --verify MERGE_HEAD` y `git diff --name-only
  --diff-filter=U`.
- CLAUDE.md: 17 archivos con conflictos (20-ago) y 217 líneas de estilos (23-ago).

**(a) Qué es, como a un amigo.** Un hook es una orden que Claude Code ejecuta solo en un momento fijo. El «Stop» corre cada
vez que Claude termina de contestar. Yo lo uso para guardar y subir el trabajo sin acordarme, y le puse una guarda para
que no suba cosas rotas.

**(b) Por qué le importa a quien mira.** Automatizar el commit ahorra trabajo, pero sin guarda sube lo que haya, también
un merge a medias. Con dos comandos de git se evita.

**(c) Qué tener abierto antes de grabar**
1. `.claude/settings.json` con el bloque `hooks` → `Stop` → `type: "command"` (el de arriba).
2. Un script de ejemplo con la guarda, sólo las líneas que importan:
   ```
   git rev-parse -q --verify MERGE_HEAD      # ¿hay un merge a medias?
   git diff --name-only --diff-filter=U      # ¿hay archivos en conflicto?
   ```
   Si cualquiera devuelve algo, el script avisa y sale sin commitear.
3. Una terminal con `claude` y `/hooks` mostrando el Stop.
4. Un repo de prueba con un conflicto armado a propósito. Así se arma: dos ramas que cambian la misma línea, y `git merge`
   que choca. Ahí corrés el script y avisa.

**(d) Guion por tomas**
- **T1, gancho:** «Mi hook de Claude Code tomó diecisiete archivos con conflictos, los dio por resueltos y los subió a mi
  rama principal. Así se arma bien.» [sello «17 archivos»]
- **T2:** «Paso uno. En punto claude, barra, settings punto json, copiá lo que ves en pantalla: hooks, adentro Stop, y un hook
  de tipo command con tu script de commit.» [el JSON]
- **T3:** «Paso dos. Stop corre cuando Claude termina su turno, no cuando terminó el trabajo. Por eso otro día me publicó
  doscientas diecisiete líneas de estilos antes que el código que las usaba.» [contador 217]
- **T4:** «Paso tres, el que decide todo: la guarda. Antes de commitear, tu script corre dos comandos de git, en pantalla. Uno
  pregunta si hay un merge a medias. El otro lista archivos en conflicto. Si cualquiera devuelve algo, no toca nada.» [los
  dos comandos]
- **T5:** «Para comprobarlo: barra hooks en Claude Code, y tu Stop tiene que aparecer. Después, en un repo de prueba, armá
  un conflicto a propósito y corré tu script: tiene que avisar y no commitear.» [grabación de pantalla de la prueba]
- **T6, cierre:** «El JSON y la guarda están en la comunidad: comentá HOOK y te paso el link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿El hook también hace push?»* El mío sí, porque así lo escribí en el script. El hook sólo ejecuta tu comando: lo que
  haga depende de vos.
- *«¿Por qué no un hook de git (pre-commit)?»* Porque el de git corre cuando vos commiteás. El Stop de Claude Code corre
  cuando Claude termina de contestar, aunque nadie commitee.
- *«¿Funciona en Windows?»* Sí, si el comando del hook corre en tu terminal. Yo uso Node para que sea el mismo en Windows y
  Linux.

## 3 · D05-A · Dos sesiones de Claude Code en el mismo proyecto, sin pisarse

**Palabra:** WORKTREE · **Molde:** Erik (tarjeta con los tres pasos) · **Largo:** ~60 s · **Verificado el 3-oct:**
- code.claude.com/docs/en/worktrees: «Pass `--worktree` or `-w` with a name to create an isolated worktree and start Claude
  in it».
- La historia de los 424 commits, confirmada por la madre (handoff de marca personal).

**(a) Qué es, como a un amigo.** Un worktree es una segunda carpeta del mismo proyecto, con su propia rama. Dos sesiones de
Claude Code, cada una en su carpeta, trabajan a la vez sin tocarse los archivos.

**(b) Por qué le importa a quien mira.** Si abre dos sesiones en la misma carpeta, una pisa lo de la otra. Y el error que
nadie avisa: la terminal puede volver sola a la carpeta principal, y un comando de git cae donde no iba.

**(c) Qué tener abierto antes de grabar**
1. Un repo de prueba (nada real) en la terminal.
2. Los comandos, de a uno:
   ```
   git worktree add -b prueba-a ../proyecto-a     # carpeta nueva con su rama
   claude -w prueba-b                              # o más corto: la crea y abre Claude ahí
   git -C ../proyecto-a status                     # git siempre con -C y la ruta
   git worktree list                               # cada carpeta con su rama
   ```

**(d) Guion por tomas**
- **T1, gancho:** «Dos sesiones de Claude Code en la misma carpeta tocan los mismos archivos. Y a mí un comando que iba para
  una carpeta cayó en otra, y movió una rama cuatrocientos veinticuatro commits.» [contador 424]
- **T2:** «La solución se llama worktree: otra carpeta del mismo repositorio, con su propia rama.»
- **T3:** «Uno. Desde tu proyecto: git worktree add, guion b, el nombre de la rama y la carpeta nueva. Lo que ves en
  pantalla.»
- **T4:** «Dos. Abrí Claude Code en esa carpeta. O más corto: claude guion w y un nombre, que la crea por vos.»
- **T5:** «Tres, el paso crítico. Todo comando de git, con git guion C y la ruta de la carpeta. No confíes en que la terminal
  sigue donde la dejaste.» [sello «-C siempre»]
- **T6:** «A mi agente la terminal le volvió sola a la carpeta principal. Se recuperó con el historial de git, pero nada
  avisó.»
- **T7:** «Para comprobar: git worktree list. Cada carpeta, con su rama. Una sesión, una carpeta, una rama.» [la lista]
- **T8, cierre:** «Los comandos están en la comunidad: comentá WORKTREE y te paso el link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿Cómo junto después el trabajo de las dos?»* Cada rama se mergea a la principal como siempre. Después borrás la carpeta
  con `git worktree remove <carpeta>`.
- *«¿Ocupa el doble de espacio?»* No duplica el historial de git: comparte el mismo repositorio. Sí duplica los archivos
  de trabajo, y las dependencias si las instalás de nuevo.
- *«¿Cómo recuperaste la rama movida?»* Con el historial de git (`git reflog`), que guarda dónde estaba cada rama antes de
  moverse.
