# Para grabar · publicación del sábado 17 al viernes 23 de octubre

## v1 (2026-10-10): qué es este lote

- **Siete piezas nuevas, una por día**, escritas desde el radar del 10-oct (tendencias de TikTok y YouTube, referentes y dolores del dueño). Cada guion cita al pie la fuente de su idea, con URL.
- **Mezcla:** 3 de dueño de negocio (DU-01, DU-02 y DU-03; **DU-02 es el dolor boliviano**: la facturación en línea sin fecha) y 4 de construir con Claude Code (N08, CC-01, CC-02, CC-03). **Cuatro con Claude o Codex trabajando en pantalla:** N08, CC-01, CC-02 y DU-03.
- **Mismo formato que `GRABAR-10-16-OCT.md`:** guion por tramos (tiempo · dice · se ve · edición), fórmula, molde de `edicion-referentes`, un solo CTA tecleado, yap, tomas y datos a verificar. Ese archivo no se toca: lo reescribe la madre.
- **Lo que va entre corchetes `[ ]` no existe todavía:** es una medición que hacen los agentes ANTES de grabar (tabla de abajo). Sin la medición, la pieza no se graba y entra una de reserva. No se inventa ninguna cifra.
- **Bloquean publicar:**
  - la bio con el link de la asesoría (`sergiourcullo.vercel.app/llamada`) para DU-01 y DU-03; sin eso, su CTA pasa a la comunidad;
  - los 5 avisos nuevos (MODS, FACTURA, RONDAS, DISEÑO, EQUIPO) pegados en Avisos antes de la hora de su video.
- **Corregido en la revisión del 10-oct:** CC-02 ya no necesita el OK de `npx`: el detector viene dentro de la skill instalada (`.claude/skills/impeccable/scripts/detect.mjs`) y no se descarga nada. La fuente de Impeccable quedó confirmada (impeccable.style). El tramo de N08 dice primero «Claude Code tiene mods» para que la promesa caiga antes de los 3 s. La fuente de «hay páginas que todavía dicen el 1-oct» era Banqup, no LookupTax.

## Orden para grabar

Se arma la escena una vez por set y, dentro del set, se graba en orden de publicación. El bruto de cada pieza sube antes de las 18:00 del día anterior a su publicación.

1. **Jue 15, antes de las 18:00 · set Santiago** (cintura para arriba, aire arriba de la cabeza para el panel): **N08** (~20 min, sale sáb 17) → **DU-02** (~25 min, sale lun 19) → **DU-03** (~20 min, sale jue 22).
2. **Vie 16, antes de las 18:00 · set Erik** (sentado, set oscuro con contraluz, cara corrida a la derecha, pecho libre): **DU-01** (~20 min, sale dom 18) → **CC-01** (~20 min, sale mar 20).
3. **Sáb 17, antes de las 18:00 · set Rocha** (plano medio corto, una toma continua, pecho libre): **CC-02** (~20 min, sale mié 21) → **CC-03** (~20 min, sale vie 23).

- **Total de cámara:** ~2 h 25 min en 3 días.
- **Antes de grabar, los agentes miden** (Sergio Urcullo dice esas cifras en cámara):

| Pieza | Qué se mide | Quién | Límite |
|---|---|---|---|
| N08 | El mod de prueba: cuántos archivos escribió Claude, cuántos minutos tardó y la salida de `claude plugin validate` | agente con Claude Code, en una carpeta de prueba | mié 14, 18:00 |
| DU-03 | La cotización de ejemplo: segundos hasta el resultado, total correcto y «por confirmar» en lo que no está en la lista | agente con Claude Code, en una carpeta de prueba | mié 14, 18:00 |
| CC-03 | Recontar desde `~/.codex/sessions` los topes semanales (97 %, 95 %, 100 %), las ~32 h y la parte del gasto que fue releer contexto | la madre, en la PC | mié 14, 18:00 |
| CC-01 | La misma tarea a Claude Code y a Codex: pruebas pasadas, tiempo, permisos pedidos y si tocó el archivo de pruebas | la madre (`scripts/codex-tarea.sh`) + agente con Claude Code | jue 15, 12:00 |
| CC-02 | La misma landing con y sin Impeccable: tics que marca el detector y conteo a ciegas de un verificador | agente con Claude Code + verificador Haiku 5.5 | jue 15, 18:00 (detector local de la skill: no descarga nada) |
| DU-02 | Releer el PDF de la RND y la página del Portal Web; ver si salió el decreto de la Ley 1733 | agente con WebFetch | jue 15, 12:00 |

**Cómo se graba (vale para todas):**
1. **Teléfono en trípode**, a la altura de los ojos. **Micrófono de solapa** en la remera. Sin tela verde.
2. **Vos grabás solo la cámara.** Las pantallas, tarjetas y capturas las ponen los agentes en la edición.
3. Una idea por toma. Si te trabás, dos segundos de pausa y repetís la frase entera.
4. Al final de cada pieza, **una toma aparte** con el remate y «Chau», de 2 a 4 segundos.
5. El bruto va a Drive, carpeta «Videos Onia Octubre», con el código en el nombre (por ejemplo, `N08-mods.mp4`). Antes de cortar llegan la tabla de cortes y el preview de 360p.
6. Si un número entre corchetes cambió después de grabar, se regraba solo el tramo que lo dice.

**El CTA (mismas reglas que la semana del 10):**
- **Una sola acción por pieza**, dicha y tecleada en pantalla, de 12 palabras como máximo, en los últimos 2,4-5,5 s.
  - **Desarrollo y noticias → comunidad:** «… está en mi comunidad. Link en mi perfil, buscá PALABRA en Avisos».
  - **Negocio → asesoría gratis:** «¿Querés …? Asesoría gratis, link en mi perfil».
- **La palabra se dice solo si su aviso ya está pegado en Avisos** antes de la hora del video. Si no, la toma aparte cambia a la variante sin palabra: «Lo que probé está en mi comunidad. Link en mi perfil.» Por eso cada pieza graba las dos tomas de cierre.
- Nunca «comentá X y te lo mando»: el mensaje directo automático no está probado.

## Sáb 17-oct

### N08 · Claude Code tiene mods: le pedí uno y lo escribió solo (y el riesgo)

**Sale:** sáb 17-oct. Video A a las 12:30 en IG (`ig-reel.mjs`) y a las 12:35 en TikTok, YouTube Shorts y LinkedIn (Buffer). **Yap a las 13:30** en IG Trial, y a las 13:35 en TikTok y Shorts. El carrusel P2 sale a las 16:00 (ya agendado).

- **Rótulo (cuadro 0, en el panel de arriba):** «CLAUDE CODE TIENE MODS» (4 palabras). Debajo, el **rótulo de estado «v2.1.287 · 1 OCT»**. Desde 36,8 s el rótulo de estado pasa a «CORRE CON TUS PERMISOS» hasta el CTA.
- **Fórmula:** F1 de PLAN-REFERENTES §3, «noticia con fecha + herramienta propia» (Santiago: la noticia sola rinde 2-14 mil; con herramienta propia, 1,6 M). Estructura de la tendencia del 8-oct: novedad, qué es, prueba propia y un «ojo» de riesgo al final. El riesgo es lo que nos diferencia de los cortes que ya circulan.
- **Molde:** **Santiago, variante «noticia con tarjetas»** (skill `edicion-referentes`):
  - costura al 48 %: panel `#0A0F0D` arriba y cámara abajo;
  - subtítulo bajo la cámara, al 83-85 %, con la palabra activa en verde `#10C26B`;
  - voz sola a -13 LUFS, sin música ni efectos;
  - pausa máxima de 0,5 s; algo cambia en pantalla cada 3-5 s.
- **Duración:** ~66 s (173 palabras a 160 por minuto = 64,9 s, más pausas). Rango del molde: 65-120 s.
- **A quién le habla:** a quien usa Claude Code. Sigue al hook de D03-A (sáb 10) y lo nombra.
- **CTA:** comunidad, palabra **MODS**.

**Gancho elegido (cuadro 0):** «Claude Code tiene mods desde el uno de octubre. Le pedí uno a Claude y lo escribió solo.» La promesa («tiene mods») cae a los ~1,5 s; con la fecha adelante caía a los ~4 s. En pantalla ya está la prueba propia: el aviso de «Thinking» con el contador que suma. Gesto: señala con el pulgar el panel.
**Descartados:** (1) «Acaba de salir algo en Claude Code y casi nadie sabe usarlo»: es el gancho de la fuente y no trae prueba en el cuadro 0. (2) «Los mods pueden leer tus claves»: arranca por el miedo y tapa la herramienta; queda para el yap.

**Guion por tramos** (160 por minuto; los ajusta el transcript palabra por palabra)

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-7,5 | Claude Code tiene mods desde el uno de octubre. Le pedí uno a Claude y lo escribió solo. | 0,0: rótulo y rótulo de estado. Panel: grabación propia del aviso «Thinking · tool calls: 3…» (la prueba). 0,3: logo de Claude Code al nombrarlo. 2,4: sello «1 OCTUBRE» rotado -6°, con «uno de octubre». 3,7, con «Le pedí»: el pedido tecleado en la terminal | Voz desde 0,0 s, sin saludo. 18 palabras |
| 7,5-15,8 | Un mod es código que corre adentro de Claude Code. Puede dibujar un panel, sumar un comando o frenar una orden peligrosa. | 7,5: captura de la doc, «A mod is a plugin that changes how Claude Code looks and behaves», con crédito «code.claude.com». 11,3: tres chips que entran con su palabra: PANEL · COMANDO · FRENO | Cada chip con su palabra (0,05-0,1 s después). 22 palabras |
| 15,8-25,2 | No es una skill: la skill son instrucciones que Claude lee. Y el hook que te mostré corre un script afuera. El mod corre adentro. | 15,8: cara completa y «No es una skill.» en serif grande. 17,3: recorte de la tabla «Compare mods, settings hooks, skills, and MCP servers», fila «What it is». 20,4, con «hook»: miniatura del video D03-A con el sello «SÁB 10». 23,7: tarjeta «HOOK = AFUERA · MOD = ADENTRO» | Cambia de layout: cara completa → partida. 25 palabras |
| 25,2-30,8 | Mi prueba. Le pedí: al lado de «pensando», mostrame cuántas herramientas usaste. Escribió tres archivos. | 25,2: rótulo de estado «MI PRUEBA». 25,9: el pedido real en Claude Code, con zoom al texto. 26,8: chip «Thinking = pensando». 29,3, con «tres archivos»: el árbol `.claude-plugin/plugin.json` · `hooks/hooks.json` · `hooks/register.js` | Si Claude escribió otra cantidad, se dice esa y se cambia el árbol. 15 palabras |
| 30,8-36,8 | Lo cargué, y mientras trabaja va contando: una, dos, tres. Tardó [M] minutos, con la prueba. | 30,8: `claude --plugin-dir ./mi-mod` tecleado. 32,6: zoom al aviso «tool calls: 1…», «2…», «3…», cada número con su palabra. 35,0: contador «[M] MIN» | Golpe de zoom de +3 % en «tres». 16 palabras |
| 36,8-45,4 | Ahora, el ojo. Un mod corre con tus permisos. Puede leer tus archivos y tus claves. Y no tiene sandbox: no está encerrado. | 36,8: cara completa y rótulo de estado «CORRE CON TUS PERMISOS». 38,3: captura del recuadro «A mod is code that runs with your permissions». 41,1: captura de «Read your secrets». 43,7: captura de «Mods aren't sandboxed.» con sello «SIN CAJA» | Punch-in de ×1,12 en «el ojo». 23 palabras |
| 45,4-52,2 | Antes de instalar uno ajeno, corré claude plugin validate. Te lista qué eventos toca y qué pide hacer. | 45,4: tarjeta de código donde se teclea `claude plugin validate ./mi-mod`. 48,5: la salida real del mod de prueba, con zoom a las líneas `hooks:` y `calls:` | 18 palabras |
| 52,2-56,3 | Si pide internet y no sabés para qué, no lo instales. | Cara completa. 53,0: sello «¿PIDE INTERNET? ¿PARA QUÉ?» | Es consejo propio, sin cifra. 11 palabras |
| 56,3-63,1 | El pedido exacto y los tres archivos están en mi comunidad. Link en mi perfil, buscá MODS en Avisos. | 56,3: panel desenfocado y tarjeta «MODS» en grande. 59,7: solo en IG, la captura del perfil con el link; en las otras redes, la tarjeta «link en mi perfil» | **CTA tecleado desde 60,6 s.** 18 palabras |
| 63,1-65,0 | *(toma aparte)* Es código: leelo antes. Chau. | Cara completa. El CTA tecleado sigue hasta el último cuadro | 5 palabras |

**CTA (una sola acción):**
- **Dicho:** «El pedido exacto y los tres archivos están en mi comunidad. Link en mi perfil, buscá MODS en Avisos.»
- **Tecleado (8 palabras):** «Buscá MODS en Avisos · link en mi perfil».
- **Variante sin aviso pegado:** «Lo que probé está en mi comunidad. Link en mi perfil.»

**Yap (Trial 13:30, ~35 s, del mismo bruto más una toma de 5 s)**
- **Gancho:** filtro de dolor de Gadzhi (1,49 M), 12 palabras: «Si te da igual que un mod lea tus claves, no sigas.» Rótulo: «¿QUÉ PUEDE LEER UN MOD?».
- **Montaje:** gancho (~4,5 s) → tramo 7,5-15,8 (qué es) → tramo 36,8-45,4 (el ojo) → tramo 45,4-52,2 (validate) → CTA de 56,3 con el mismo tecleado.

**Qué grabar (Sergio Urcullo, ~20 min)**
1. Set Santiago: trípode, cintura para arriba, aire arriba de la cabeza. Solapa en la remera.
2. Un bloque por tramo, con dos segundos entre bloques. En el cuadro 0, decí el gancho señalando con el pulgar hacia arriba. Sin celular en la mano.
3. «Tardó [M] minutos»: la madre te pasa el número antes de grabar. Si no llegó, grabá el tramo sin esa frase.
4. Tomas aparte: «Es código: leelo antes. Chau.» · el cierre sin palabra («Lo que probé está en mi comunidad. Link en mi perfil.») · el gancho del yap.
5. Bruto: `N08-mods.mp4`.

**Qué capturar (los agentes, mié 14, desde una sesión con Chrome y una carpeta de prueba)**
- **Doc oficial** (`code.claude.com/docs/en/plugins/mods/overview`), recortes con su crédito: «A mod is a plugin that changes how Claude Code looks and behaves»; la tabla de comparación, fila «What it is»; el recuadro «A mod is code that runs with your permissions»; «Read your secrets»; «Mods aren't sandboxed».
- **Changelog** (`code.claude.com/docs/en/changelog`): la entrada 2.1.287 con su fecha (el 8-oct se leyó «2.1.287 = 1-oct»).
- **La prueba propia**, en una carpeta de prueba **fuera del repo**:
  - `claude --version` (2.1.288 el 10-oct en la PC: alcanza);
  - el pedido a Claude Code, los archivos que escribió y el tiempo de punta a punta;
  - `claude --plugin-dir ./mi-mod` y el contador sumando mientras Claude lista y lee archivos;
  - `claude plugin validate ./mi-mod` con sus líneas `hooks:` y `calls:`.
- **No se instala ningún mod ajeno** (los de ejemplo de Anthropic se bajan de GitHub: eso pide el OK de Sergio Urcullo). El mod propio se carga con `--plugin-dir`, solo para esa sesión: no queda instalado.
- Terminal oscura, recortada, nunca el monitor filmado. Que no aparezcan rutas con nombres de clientes ni variables de entorno.

**Lo que se arma en código:** rótulos, sello «1 OCTUBRE», chips PANEL · COMANDO · FRENO, tarjeta «HOOK = AFUERA · MOD = ADENTRO», contador de minutos, sello «SIN CAJA», tarjeta de código con `validate` y la tarjeta del CTA.

**Imágenes generadas:** ninguna. Todo es captura real o código (regla 2 de Higgsfield en la edición).

**Antes de publicar**
- Tabla de cortes y preview de 360p para Sergio Urcullo.
- Diccionario de marcas sobre el SRT: «cloud» → Claude; «mots» o «mons» → mods; «jucs» → hooks.
- Leer el caption entero. Mirar que el aviso MODS esté pegado antes de las 12:30.

**Datos a verificar el día (sáb 17-oct, antes de las 12:00)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| «A mod is a plugin that changes how Claude Code looks and behaves»; hecho de funciones JavaScript o TypeScript que corren adentro de Claude Code | https://code.claude.com/docs/en/plugins/mods/overview | ok, leído el 10-oct |
| Puede dibujar un panel o una banda, agregar un `/comando` y frenar o cambiar una llamada a una herramienta (el ejemplo `blast-radius` frena un `rm -rf`) | misma página, «What a mod can do» y «Try a sample mod» | ok |
| La skill son instrucciones que Claude lee; el hook de settings corre un script afuera; el mod corre adentro | misma página, tabla «Compare mods, settings hooks, skills, and MCP servers» | ok |
| Se pide en una sesión y Claude lo escribe («describe what you want… and Claude writes the mod») | misma página, «Get a mod» | ok. La cantidad de archivos y los minutos salen de la prueba propia |
| Mods prendidos por defecto desde Claude Code 2.1.287 en la terminal; 2.1.287 salió el 1-oct | misma página, «Turn mods on or off», y https://code.claude.com/docs/en/changelog | ok, leído el 10-oct: el changelog dice «2.1.287 · October 1, 2026» y «Added Claude Mods» |
| Corre con tus permisos, puede leer variables de entorno y archivos de configuración (claves) y **no tiene sandbox** | misma página, «Decide whether to trust a mod» | ok |
| `claude plugin validate ./carpeta` lista `hooks:` y `calls:` sin correr el mod | misma página, «List what a mod does before you install one» | ok. Se muestra la salida del mod propio |
| «Si pide internet y no sabés para qué, no lo instales» | consejo propio | sin cifra (opinión) |
| `claude --version` en la PC = 2.1.288 | medido el 10-oct | ok |

**Fuentes de la idea**
- TikTok @notfound404.es, 8-oct, 53 s, 44,6 mil reproducciones: novedad, tres usos y el «ojo» de riesgo: https://www.tiktok.com/@notfound404.es/video/7694300582403656982
- Erik Taveras, YouTube 8-oct, «Los MODS de Claude Code: qué son, cómo crearlos y qué riesgo tienen»: https://www.youtube.com/watch?v=kAYXY3c0IrY
- Martín Toledo, YouTube 7-oct, 18,8 mil vistas en 3 días: https://www.youtube.com/watch?v=8uEUh6RSX8Y
- Video oficial del canal Claude, 374,8 mil vistas en 4 días: https://www.youtube.com/watch?v=yUuFvL1lK4k
- Doc oficial: https://code.claude.com/docs/en/plugins/mods/overview
- Regla del radar: sale **una** sola pieza de mods; las derivadas de nicho de Erik no pasaron de 1,7 mil.

## Dom 18-oct

### DU-01 · Uno de cada cinco teme que la IA lo reemplace: la cuenta de tres números

**Sale:** dom 18-oct. Video A a las 12:30 en IG (`ig-reel.mjs`) y a las 12:35 en TikTok, Shorts y LinkedIn (Buffer). Yap a las 13:30 en IG Trial (`--trial auto`); 13:35 en TikTok y Shorts.

- **Rótulo fijo arriba, del cuadro 0 al final:** «QUÉ LE DAS A LA IA PRIMERO» (6 palabras), con «PRIMERO» en verde `#10C26B`, sobre caja negra al 90 %. Es título-tema, no pregunta: se queda todo el video.
- **Fórmula:** F3 de PLAN-REFERENTES, la pregunta del dueño, con el gancho **«dato + reencuadre»** de Erik («te quedás sin mensajes; el problema no es el plan», 277 mil; FORMULAS §1b). No se inventa la pregunta de un lead: el dato es una encuesta publicada.
  - **Cuenta de a un paso** (regla 7 de `edicion-referentes`): veces × minutos × semanas.
  - **Regla con nombre** (Hormozi): «MÁS HORAS, MENOS RIESGO». Es el criterio del paso 3 de la asesoría (`ONIA_COMUNIDAD_CONTENIDO.md`, «Guion de los 20 minutos»).
- **Molde:** **Erik, sistema de septiembre** (`recetas/erik.json` + `erik_edit.py`):
  - cámara a pantalla completa; tarjetas de papel claro sobre el pecho (51-75 % del alto, x 12-88 %);
  - karaoke de 3 palabras en MAYÚSCULAS al 74 %, palabra activa en verde; se apaga con tarjeta grande;
  - sellos a -4/-8°, corte seco, punch-in de 1,12-1,15× y CTA tecleado con brillo agudo;
  - -14 LUFS, solo voz.
- **Duración:** ~52 s (138 palabras a 160 por minuto). Rango Erik de noticia o producto: 44-52 s.
  - **Se aparta a propósito:** el índice cae a los 15 s, no entre los 3 y los 13 de Erik, porque el gancho dice la fuente en voz («Lo dice una encuesta de Ipsos en Bolivia»). Sin esa frase la cifra se lee como de todo el país.
- **A quién le habla:** al dueño o la dueña de un negocio chico y a quien trabaja en uno.
- **CTA:** asesoría gratis.

**Gancho elegido:** «Uno de cada cinco teme que la IA lo reemplace. Lo dice una encuesta de Ipsos en Bolivia. Y solo la mitad sabe dónde ya la usa.»
**Descartados:** (1) «Uno de cada cinco bolivianos teme…»: la encuesta es de 400 adultos urbanos conectados, no de todo el país. (2) «La IA no te va a quitar el trabajo»: es una promesa que nadie puede hacer. (3) «6 de cada 10 creen que la IA les va a cambiar el trabajo»: cierto, pero el miedo de 1 de cada 5 es el dolor; el 60 % queda en el aviso.

**Guion por tramos**

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-10,1 | Uno de cada cinco teme que la IA lo reemplace. Lo dice una encuesta de Ipsos en Bolivia. Y solo la mitad sabe dónde ya la usa. | 0,0: rótulo fijo. 0,3: contador «21 %» en una tarjeta sobre el pecho, con «uno de cada cinco». 3,8: chip fijo «IPSOS AI MONITOR · BOLIVIA · 400 ADULTOS URBANOS CONECTADOS · MAYO 2025», con «Ipsos». 7,1: segundo contador «51 % SABE DÓNDE LA USA», con «la mitad» | Voz en el cuadro 0, sin saludo. Karaoke apagado con las tarjetas. 27 palabras |
| 10,1-15,0 | El problema no es la IA. Es no saber qué tarea darle primero. | Cámara completa. 10,8: sello «NO ES LA IA» a -6°. 13,2: «qué tarea» en verde en el karaoke | Punch-in de ×1,12 en «El problema». 13 palabras |
| 15,0-18,8 | La cuenta con la que arranca mi asesoría: tres números. | 15,6: índice en tarjeta, una fila por palabra: «01 VECES · 02 MINUTOS · 03 SEMANAS», a la vez que «tres números» | 10 palabras |
| 18,8-25,9 | Uno: cuántas veces por semana hacés esa tarea. Dos: cuántos minutos te lleva. Tres: por cincuenta y dos semanas. | Se resalta cada fila del índice cuando se dice: 01 (18,8), 02 (21,8), 03 (23,8) | Karaoke apagado. 19 palabras |
| 25,9-34,1 | Ejemplo: contestar «¿cuánto cuesta?» treinta veces por semana. Tres minutos cada vez. Noventa minutos por semana. Setenta y ocho horas al año. | 25,9: chip «EJEMPLO». 26,6: burbuja de chat «¿cuánto cuesta?». **Tarjeta que se arma** (Santiago G7): 27,8 «30 × 3 min» → 30,1 «= 90 min por semana» → 32,0 «× 52 = 78 h al año», con «78 h» en verde y un óvalo | Cada línea entra con su palabra. 22 palabras |
| 34,1-42,4 | Hacelo con cada tarea que repetís. Va primero la que suma más horas. Y la que menos daño hace si sale mal. | Cámara completa. 36,4: tarjeta de dos filas, «+ HORAS» (36,4) y «– RIESGO» (39,4). 41,2: sello «MÁS HORAS, MENOS RIESGO» | Regla con nombre. 22 palabras |
| 42,4-46,9 | Con ese número sabés qué darle a la IA. Y qué no. | Cámara completa con zoom de +3 %. 45,3: chip «Y QUÉ NO» | 12 palabras |
| 46,9-51,8 | ¿Hacemos la cuenta con tu negocio? Asesoría gratis, link en mi perfil. Chau. | Tarjeta verde llena con el CTA tecleado letra por letra, con cursor | Brillo agudo (9-16 kHz, 0,4-0,7 s) al entrar. 13 palabras |

**CTA (una sola acción, asesoría):**
- **Dicho:** «¿Hacemos la cuenta con tu negocio? Asesoría gratis, link en mi perfil. Chau.»
- **Tecleado (11 palabras):** «¿Hacemos la cuenta con tu negocio? Asesoría gratis · link en mi perfil».
- **Bloqueo:** si alguna bio (IG, TikTok, YouTube, LinkedIn) no tiene `sergiourcullo.vercel.app/llamada` el 18-oct, en esa red el cierre es la variante de comunidad: «Las cinco preguntas para elegir tu tarea están en mi comunidad. Link en mi perfil, buscá CHECKLIST en Avisos.» (CHECKLIST está escrito en `AVISOS-COMUNIDAD-8-16-OCT.md`; se usa solo si ya está pegado en Avisos, si no, «Link en mi perfil» sin palabra). Se graban las dos tomas.

**Yap (13:30 IG Trial; 13:35 TikTok y Shorts) · ~38 s**
- **Gancho:** filtro de dolor (Gadzhi, 1,49 M), 12 palabras: «Si sabés cuántas horas por año te come cada tarea, no sigas.» Rótulo: «¿CUÁNTAS HORAS TE COME?».
- **Montaje:** gancho (~4,5 s) → tramos 15,0-34,1 (índice, los tres números y el ejemplo) → tramo 34,1-42,4 → CTA con el mismo tecleado.

**Qué grabar (Sergio Urcullo, ~20 min)**
1. Set Erik: sentado, cabeza al 29-32 % del alto, cara corrida a la derecha (x 0,60), set oscuro con contraluz LED, solapa en la remera, nada en las manos.
2. Una toma por tramo, con 2 s entre frases. «¿Cuánto cuesta?» se dice como pregunta de cliente.
3. Tomas aparte: el CTA de asesoría con «Chau» (~5 s), la variante de comunidad (~6 s) y el yap entero (~38 s, 3 intentos del gancho).
4. Brutos: `DU-01-cuenta.mp4` y `DU-01-yap.mp4`.

**Pantallas (las arman los agentes con código):** contadores 21 % y 51 %, chip de la fuente, sello «NO ES LA IA», índice, tarjeta que se arma (30 × 3 = 90 · × 52 = 78 h), tarjeta «+ HORAS / – RIESGO», sello de la regla y tarjeta del CTA. Sin capturas: la nota de prensa no se muestra porque es de 2025 y no aporta nada al cuadro; su crédito va en el chip.

**Imágenes generadas:** ninguna.

**Antes de publicar**
- Tabla de cortes y preview de 360p. Diccionario de marcas: «ipsos» → Ipsos.
- Abrir el link de la asesoría desde cada bio hasta llegar a `cal.com/sergiourcullo/20min`.
- Leer el caption entero. El caption repite la fuente: «Ipsos AI Monitor 2025, 400 adultos urbanos conectados, mayo 2025».

**Datos a verificar el día (dom 18-oct)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| 21 % teme ser reemplazado por sistemas automatizados; 51 % identifica qué productos y servicios usan IA; 60 % cree que la IA transformará su trabajo en cinco años; 65 % dice entender qué es | eju.tv, 28-sep-2025, «Inteligencia artificial promueve competitividad y productividad», con crédito a El Diario: https://eju.tv/?p=4766866 | ok, leído el 10-oct |
| Muestra: 400 adultos urbanos conectados, mayo de 2025; el artículo no dice el método | misma fuente | ok. Por eso el chip dice la muestra y la fecha |
| 30 × 3 = 90 min por semana; 90 × 52 = 4.680 min = 78 h al año | cuenta propia | ok. Es un ejemplo y así se rotula |
| El criterio «más horas y menos riesgo si sale mal» es el paso 3 de la asesoría | `hermes-content/docs/ONIA_COMUNIDAD_CONTENIDO.md`, «Guion de los 20 minutos» | ok |
| Link de la asesoría en las cuatro bios | abrir desde cada bio el 18-oct | pendiente (era bloqueo la semana del 10) |

**Fuentes de la idea**
- Ipsos AI Monitor 2025 en Bolivia, por eju.tv / El Diario: https://eju.tv/?p=4766866
- El dueño no ve qué gana con la IA y no sabe medir si se paga (KPMG, México y Centroamérica): https://expansion.mx/tecnologia/2026/07/15/mexico-esceptico-ia-no-ve-valor-justifique-inversion
- Gancho dato + reencuadre: Erik Taveras, medido en `FORMULAS-REFERENTES.md` §1b.

## Lun 19-oct

### DU-02 · Facturación en línea: el SIN sacó la fecha, pero no te salvaste (F8)

**Sale:** lun 19-oct. **Video único del día** (F8: un vertical de 100-120 s en lugar de dos cortos). 12:30 en IG (`ig-reel.mjs`) y 12:35 en TikTok, Shorts y LinkedIn (Buffer). Yap a las 13:30 en IG Trial; 13:35 en TikTok y Shorts.

- **Rótulo (cuadro 0, en el panel de arriba):** «FACTURACIÓN EN LÍNEA: SIN FECHA» (5 palabras). Debajo, el **rótulo de estado «RND 102600000038 · 30 SEP»**. Desde 57,7 s cambia a «3 COSAS PARA ESTA SEMANA».
- **Fórmula:** F12 de FORMULAS (dolor → mecanismo → N cosas, cada una con su arreglo; la misma de S2-D07-A), con el gancho de F1, **«pregunta con fecha»** (Santiago, 1,6 M). Es F8 por largo.
- **Molde:** **Santiago, «noticia con tarjetas»**, porque la prueba es el PDF oficial del SIN. Mismos parámetros que N08.
- **Duración:** ~95 s (248 palabras a 160 por minuto = 93 s, más pausas). Queda en el borde de abajo de F8 (100-120 s): no se estira con relleno.
- **A quién le habla:** al dueño de un negocio en Bolivia que paga IVA y no factura en línea.
- **CTA:** comunidad, palabra **FACTURA**. No va a la asesoría: la asesoría es de automatización, no de impuestos, y prometerla acá sería prometer algo que no da.

**Reglas de la casa que manda esta pieza** (skill `onia-contabilidad-bolivia`, «Normas que cambiaron el plan»):
- Nunca «obligatorio por ley» ni una fecha que la norma no da.
- El SIN **asignará** (futuro), solo a **sujetos pasivos del IVA** que al 30-sep **no habían implementado** ninguna modalidad en línea. La RND **no dice cómo se comunica** la asignación: prohibido «si te la asignaron, figura en tu Oficina Virtual». Sí se puede decir qué modalidad figura HOY.
- Abroga solo cuatro RND: los grupos 1 a 8 no cambian, y no dice que quien ya factura en línea pueda volver atrás.
- La Ley 1733, en lo del IVA aparte, rige desde el mes siguiente a su decreto: decirlo, o se entiende que el IVA ya cambió.
- No se nombra Onia ni su facturación: la factura del SIN no está encendida en el producto (`ONIA_CATALOGO_DE_VENTA.md` §7).

**Gancho elegido (cuadro 0):** «¿Tenés un negocio en Bolivia y todavía no facturás en línea? El treinta de septiembre, el SIN cambió la regla.» En el panel ya está la portada del PDF de la RND con su fecha.
**Descartados:** (1) «El SIN te puede asignar la facturación en línea sin avisarte»: la norma no dice cómo avisa; «sin avisarte» es inventar. (2) «Ya no estás obligado a facturar en línea»: falso para los grupos 1 a 8 y para quien el SIN asigne.

**Guion por tramos**

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-7,5 | ¿Tenés un negocio en Bolivia y todavía no facturás en línea? El treinta de septiembre, el SIN cambió la regla. | 0,0: rótulo, rótulo de estado y la portada del PDF de la RND 102600000038 en una tarjeta al 85-90 % del ancho, con crédito «impuestos.gob.bo». 4,8: sello «30 SEP 2026» rotado -6°, con «treinta de septiembre» | Voz desde 0,0 s. Gesto: levanta el celular con la pantalla apagada hacia el panel, como quien muestra un papel. 20 palabras |
| 7,5-15,0 | La fecha del uno de octubre ya no corre. Hay páginas que todavía la dicen. Pero tampoco hay fecha nueva. | 7,5: tarjeta «1 OCT» que se tacha con «ya no corre». 10,9: chip «hay páginas sin actualizar». 13,1: sello «SIN FECHA NUEVA» | El tachado entra con «no corre». 20 palabras |
| 15,0-19,5 | Te digo qué cambió, qué no, y tres cosas para esta semana. | Índice en el panel: «01 CAMBIÓ · 02 NO CAMBIÓ · 03 ESTA SEMANA», una fila por palabra | 12 palabras |
| 19,5-24,0 | En línea quiere decir: cada factura llega al SIN apenas la emitís. | Cara completa. 21,0: dibujo en código, factura → flecha → «SIN», que se arma con «llega» | 12 palabras |
| 24,0-30,0 | Qué cambió. Una resolución del SIN sacó los plazos. Los de los grupos nueve a doce. | 24,0: «01 CAMBIÓ» resaltado. 25,3: zoom al texto del PDF «deja sin efecto los plazos de incorporación». 28,3: chip «GRUPOS 9 A 12» | 16 palabras |
| 30,0-38,6 | Lo que sí dice: el SIN va a asignar una modalidad en línea. Cada tanto. A quien paga IVA y no había implementado ninguna. | 30,0: recorte del parágrafo II con «asignará periódicamente» subrayado en verde. 34,5: chip «CADA TANTO = periódicamente». 35,8: chip «PAGA IVA + NINGUNA EN LÍNEA AL 30-SEP» | 23 palabras |
| 38,6-42,4 | No dice cuándo. Tampoco dice cómo te vas a enterar. | Cara completa. 38,9: sello «¿CUÁNDO? NO DICE». 40,5: sello «¿CÓMO TE AVISAN? NO DICE» | Punch-in de ×1,12 en «No dice». 10 palabras |
| 42,4-50,6 | Qué no cambió. Los grupos uno a ocho siguen igual. Y si ya facturás en línea, no dice que puedas volver atrás. | 42,4: «02 NO CAMBIÓ» resaltado. 43,6: chip «GRUPOS 1 A 8: IGUAL». 46,9: chip «YA EN LÍNEA: NO DICE QUE VUELVAS ATRÁS» | 22 palabras |
| 50,6-57,7 | El motivo, según el SIN: la Ley diecisiete treinta y tres. El IVA aparte en la factura, que espera su decreto. | 50,6: recorte del considerando de la RND que nombra la Ley 1733. 54,3: tarjeta «IVA APARTE EN LA FACTURA · RIGE CON SU DECRETO» | **Línea condicional:** si el decreto salió antes del 19-oct, la frase pasa a «El IVA aparte en la factura, desde [mes].» y se regraba este tramo. 19 palabras |
| 57,7-68,2 | Tres cosas para esta semana. Uno: mirá qué modalidad tenés habilitada hoy, en tu Oficina Virtual. Por ejemplo: Portal Web en Línea, habilitado. O preguntale a tu contador. | 57,7: rótulo de estado «3 COSAS PARA ESTA SEMANA» y «03 ESTA SEMANA» resaltado. 59,2: tarjeta «1 · TU MODALIDAD DE HOY». 63,2: **tarjeta en código** (no captura) con una fila «Portal Web en Línea · HABILITADO» y el chip «EJEMPLO» | La Oficina Virtual real no se muestra: tiene los datos de la titular del NIT. 28 palabras |
| 68,2-75,7 | Dos: si te asignan una, cada factura sale de un sistema. O del Portal Web del SIN, que es gratis. | 68,2: tarjeta «2 · SISTEMA O PORTAL». 71,6: captura de la página del Portal Web en siatinfo, con crédito. 74,0: sello «GRATIS» | 20 palabras |
| 75,7-83,2 | Tres: si te apuran con el uno de octubre, mostrales esto. Ante la duda, llamá a la línea del SIN. | 75,7: tarjeta «3 · QUE NO TE APUREN». 77,8: vuelve la portada del PDF, con «mostrales esto». 80,1: tarjeta «SIN · 800 10 3444» | 20 palabras |
| 83,2-90,3 | El PDF del SIN y las tres cosas están en mi comunidad. Link en mi perfil, buscá FACTURA en Avisos. | 83,2: panel desenfocado y tarjeta «FACTURA» en grande. 86,8: captura del perfil (solo IG) o la tarjeta «link en mi perfil» | **CTA tecleado desde 87,5 s.** 19 palabras |
| 90,3-92,9 | *(toma aparte)* Sin fecha no es sin obligación. Chau. | Cara completa. El CTA tecleado sigue hasta el final | 7 palabras |

**CTA (una sola acción):**
- **Dicho:** «El PDF del SIN y las tres cosas están en mi comunidad. Link en mi perfil, buscá FACTURA en Avisos.»
- **Tecleado (8 palabras):** «Buscá FACTURA en Avisos · link en mi perfil».

**Yap (13:30 IG Trial; 13:35 TikTok y Shorts) · ~40 s**
- **Gancho:** filtro de dolor (Gadzhi), 12 palabras: «Si ya sabés qué modalidad te va a asignar el SIN, no sigas.» Rótulo: «¿TE VAN A ASIGNAR?».
- **Montaje:** gancho (~4,5 s) → tramos 24,0-42,4 (qué cambió, qué asigna, no dice cuándo) → tramo 57,7-68,2 (la primera cosa) → CTA con el mismo tecleado.

**Qué grabar (Sergio Urcullo, ~25 min)**
1. Set Santiago. En el cuadro 0, el celular con la pantalla apagada en la mano, levantado hacia el panel (gesto de Santiago en G1), y lo bajás a los 3 s.
2. Un bloque por tramo, con 2 s entre bloques. «RND» no se dice: se dice «una resolución del SIN».
3. **El tramo 50,6-57,7 se graba en sus dos versiones** (con «que espera su decreto» y con «desde [mes]», dejando el mes en blanco con una pausa): el agente del jue 15 dice cuál va.
4. Toma aparte: «Sin fecha no es sin obligación. Chau.» · la variante sin palabra del cierre · el gancho del yap.
5. Bruto: `DU-02-factura.mp4`.

**Qué capturar (los agentes, jue 15)**
- **PDF de la RND 102600000038:** https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-102600000038-Abrogacio%CC%81n.pdf. ⚠️ El nombre lleva la «ó» descompuesta (`Abrogacio%CC%81n`): escrita con «ó» compuesta da 404 y parece que la norma no existe. Recortes: portada con número y fecha; «deja sin efecto los plazos de incorporación»; el parágrafo II con «asignará periódicamente»; el considerando que nombra la Ley 1733.
- **Página del Portal Web en Línea:** https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web
- **Ley 1733** (para confirmar si salió el decreto; no se muestra en el video): https://www.impuestos.gob.bo/wp-content/uploads/2026/05/L17332051NCPP.pdf y la lista de decretos del día.
- Nunca la Oficina Virtual de Onia (NIT y titular): la fila «Portal Web en Línea · HABILITADO» es tarjeta de código con el chip «EJEMPLO».

**Lo que se arma en código:** índice, tachado del «1 OCT», dibujo factura → SIN, chips de grupos, sellos «NO DICE», tarjeta «IVA aparte», las tres tarjetas de cosas, la fila de ejemplo de la Oficina Virtual, tarjeta del teléfono y CTA.

**Imágenes generadas:** ninguna.

**Antes de publicar**
- Tabla de cortes y preview de 360p. Diccionario de marcas: «sin» → SIN cuando es el organismo; «siat» → SIAT.
- **Barrido de fechas viejas** (regla de la skill de contabilidad): el caption, el aviso FACTURA y el carrusel del día no pueden decir «1 de octubre» como vigente ni «obligatorio por ley».
- Leer el caption entero. Cierra con «No es asesoría contable: confirmalo con tu contador».

**Datos a verificar el día (lun 19-oct, antes de las 12:00)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| RND 102600000038, del 30-sep-2026: abroga las RND 102400000004, 005, 012 y 025 (grupos 9 a 12) y deja sin efecto los plazos de incorporación; cae el 1-oct de la RND 102600000007 | PDF del SIN (arriba) | ok, leído en el texto del SIN el 3-oct (`ONIA_FACTURACION_ESTADO_REAL.md` §2.6 y skill `onia-contabilidad-bolivia`). Se relee el día |
| Par. II: el SIN asignará periódicamente una modalidad en línea a los sujetos pasivos del IVA que al 30-sep no hayan implementado ninguna; no fija fecha ni dice cómo se comunica | mismo PDF | ok (3-oct, dos verificadores) |
| Grupos 1 a 8 sin cambios; no dice que quien ya factura en línea pueda volver atrás | mismo PDF | ok (3-oct) |
| Motivo declarado: aplicar la Ley 1733 (IVA sobre el neto, aparte en la factura), que en eso rige desde el mes siguiente a su decreto | PDF de la RND y https://www.impuestos.gob.bo/wp-content/uploads/2026/05/L17332051NCPP.pdf | texto ok (3-oct). **Que el decreto no haya salido: sin verificar.** El jue 15 se mira y se elige la versión del tramo |
| El Portal Web en Línea del SIN es una modalidad gratis: se carga cada factura en su página | https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web | ok en la investigación del 3-oct; se relee el día |
| La modalidad habilitada se ve en la Oficina Virtual (así se vio «Portal Web en Línea · HABILITADO» con el NIT de Onia el 27-ago) | `ONIA_FACTURACION_ESTADO_REAL.md` §2.1 | ok, con la tarjeta rotulada «ejemplo» |
| «En línea: cada factura llega al SIN apenas la emitís» | siatinfo, «Modalidades de facturación» | **sin verificar**: el jue 15 se lee la página; si la definición oficial es otra, se cambia la frase |
| Línea del SIN: 800 10 3444 | `ONIA_FACTURACION_ESTADO_REAL.md` §7 | ok; se marca una vez el día para ver que atiende |
| Hay páginas que todavía dicen el 1-oct | Banqup, guía de Bolivia «actualizada el 21 de septiembre de 2026»: «Los grupos del 9 al 12 deben cumplir antes del 1 de octubre de 2026», sin la RND 102600000038: https://www.banqup.com/es-es/resources/compliance-pulse/bolivia | ok, leído el 10-oct (LookupTax NO lo dice: antes se le atribuía por error). El jue 15 se reabre: si Banqup ya se actualizó y no aparece otra página, la frase «Hay páginas que todavía la dicen» y el chip salen del tramo. No se nombra ninguna página |

**Fuentes de la idea**
- LookupTax, 6-oct-2026, resumen de la RND 102600000038 (abroga las RND de los grupos 9 a 12; el SIN asignará la modalidad; motivo, la Ley 1733): https://lookuptax.com/tax-changes/bolivia/rnd-102600000038-online-invoicing-deadlines-abrogated
- Página que todavía da el 1-oct como plazo (Banqup, actualizada el 21-sep): https://www.banqup.com/es-es/resources/compliance-pulse/bolivia
- PDF oficial del SIN: https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-102600000038-Abrogacio%CC%81n.pdf
- Vocabulario real del dueño («grupo», «modalidad», «¿me obligan?»), de los comentarios de la guía de boliviaimpuestos.com: https://boliviaimpuestos.com/facturacion-virtual-todo-lo-que-debes-saber/
- Ley 1733 y el IVA por fuera: https://boliviaimpuestos.com/b/94_

## Mar 20-oct

### CC-01 · La misma tarea a Claude Code y a Codex: cuatro rondas

**Sale:** mar 20-oct. **Video B a las 18:30** en IG (`ig-reel.mjs`) y a las 18:35 en TikTok, Shorts y LinkedIn (Buffer); las 12:30 quedan para el YouTube de la semana. Yap a las 19:30 en IG Trial; 19:35 en TikTok y Shorts.

- **Rótulo fijo arriba:** «MISMA TAREA: CLAUDE CODE VS CODEX» (5 palabras; «VS» no cuenta), con «VS» en verde.
- **Fórmula:** el **versus en 4 rondas** de Erik (Muse vs Dots, 6-oct): credencial, rondas, veredicto por tipo de tarea. Rindió en su mediana, no más: se toma el formato, no la promesa de vistas.
  - **Regla de la casa:** solo herramientas que Sergio Urcullo usa. Las dos las usa: Codex hace los encargos de la madre desde el 8-oct (skill `equipo-de-agentes`).
  - **Codex no va primero en el título:** en español, los videos de Codex de la semana del 30-sep no pasaron de ~1,8 mil en TikTok. Abre «misma tarea, dos IA».
  - La tarea es local: **pasar un monto a letras, como el «Son:» de una factura boliviana**.
- **Molde:** **Erik, sistema de septiembre**: cámara completa, tarjetas sobre el pecho, y **pantalla partida para las demos** (terminal arriba, 0-43,75 %; cámara abajo). Chip «0N · RONDA» arriba a la izquierda. Karaoke de 3 palabras al 74 %.
- **Duración:** ~66 s (172 palabras a 160 por minuto). Queda entre los dos rangos de Erik (44-52 y 105-127 s): se acepta, porque cuatro rondas con su número no entran en 52 s.
- **A quién le habla:** a quien programa o quiere armar cosas con agentes.
- **CTA:** comunidad, palabra **RONDAS**.

**La prueba (la arman los agentes antes de grabar, jue 15 hasta las 12:00)**
- Dos carpetas de prueba con el mismo `monto.test.mjs` (las 10 pruebas del aviso RONDAS) y un `git init` cada una, para ver después qué tocó cada uno.
- El mismo pedido, palabra por palabra: «En esta carpeta está monto.test.mjs. Escribí monto.mjs con una función montoEnLetras(n) que pase esas pruebas. No toques monto.test.mjs. Al final corré: node --test».
- **Claude Code:** `claude` en la carpeta A, modo de permisos por defecto, modelo `[modelo]` (se anota el que corrió).
- **Codex:** `scripts/codex-tarea.sh` en la carpeta B, `-s workspace-write`, modelo `[modelo]` (el del config, se anota). Un solo encargo, corto: cuida el tope semanal.
- **Se mide:** pruebas pasadas (`node --test` corrido por el agente después, no el que dice la IA), tiempo de reloj desde el pedido hasta el final, cuántas veces pidió permiso, y si `monto.test.mjs` cambió (`git diff --stat`).
- ⚠️ **Trampa ya medida:** el sandbox de Codex en Windows falló el 8-oct con la app de Codex abierta. Se corre con la app cerrada. Si igual falla, el tramo 23,6-32,6 dice la verdad (línea B, abajo).
- Una sola corrida por herramienta. En pantalla va «1 corrida · [fecha]». No es un ranking.

**Gancho elegido:** «Misma tarea, dos IA que programan: Claude Code y Codex. Pasar un monto a letras, como en tu factura.»
**Descartados:** (1) «Codex le ganó a Claude» o al revés: no se sabe antes de medir y una corrida no lo prueba. (2) «¿Cuál pagar, Claude o ChatGPT?»: P2 ya dio los planes y el versus de precios pide una tabla del día.

**Guion por tramos**

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-7,1 | Misma tarea, dos IA que programan: Claude Code y Codex. Pasar un monto a letras, como en tu factura. | 0,0: rótulo fijo. 0,6: logos de Claude Code y de OpenAI a cada lado del pecho, con sello «VS». 3,9: tarjeta «120,50 → CIENTO VEINTE 50/100», con «monto a letras». 6,0: chip «como el "Son:" de la factura» | Voz en el cuadro 0. Logos de `diseno-contenido-onia`. 19 palabras |
| 7,1-13,1 | Diez pruebas escritas antes, el mismo pedido, cuatro rondas. La difícil: veintiún mil. No veintiuno mil. | 7,1: índice en tarjeta: «01 ¿PASÓ? · 02 RELOJ · 03 LAS LLAVES · 04 LA REGLA». 10,5: tarjeta «21.000 → VEINTIÚN MIL», con «veintiún» en verde y «VEINTIUNO MIL» tachado | El índice cae entre los 3 y los 13 s. 16 palabras |
| 13,1-18,4 | Ronda uno: ¿pasó las pruebas? Claude Code: [A] de diez. Codex: [B] de diez. | 13,1: chip «01 · RONDA». Pantalla partida: arriba, la salida real de `node --test` de cada carpeta, una después de la otra. 15,4 y 17,2: contadores «[A]/10» y «[B]/10» | Cada número entra con su palabra. 14 palabras |
| 18,4-23,6 | Ronda dos: el reloj. Claude Code tardó [tA]. Codex, [tB]. | 18,4: chip «02 · RONDA». Dos cronómetros que corren y se frenan en [tA] y [tB] | 14 palabras (según cómo se digan los tiempos) |
| 23,6-32,6 | Ronda tres: las llaves. Claude Code me pidió permiso [N] veces antes de tocar algo. Codex trabajó encerrado: solo podía escribir en esa carpeta. | 23,6: chip «03 · RONDA». Arriba, el pedido de permiso real de Claude Code; contador «[N] PERMISOS». 28,4: la línea de Codex con `workspace-write`; tarjeta «CAJA = SOLO ESTA CARPETA» | **Línea B si el sandbox falló:** «Codex corrió sin caja: en mi Windows, la caja falló.» 24 palabras |
| 32,6-39,0 | Ronda cuatro: ¿respetó la regla? Le dije que no tocara las pruebas. Claude Code: [sí]. Codex: [sí]. | 32,6: chip «04 · RONDA». 34,5: tarjeta con la orden «No toques monto.test.mjs». 36,6: `git diff --stat` de cada carpeta; sello «RESPETÓ» o «TOCÓ LAS PRUEBAS» | 17 palabras |
| 39,0-43,1 | **A:** Empate en lo que importa. La diferencia está en cómo trabajan. **B:** Esta vez ganó [X]. Una tarea no es un ranking. | Tarjeta resumen de las cuatro rondas, con un tilde verde por ronda ganada. Chip «1 CORRIDA · [FECHA]» | Se graban las dos; la tabla dice cuál va. 11 o 10 palabras |
| 43,1-50,2 | Por eso en mi empresa no compiten. Claude ordena y revisa. Codex hace los encargos cerrados, con su prueba. | Cámara completa. 45,3: diagrama en código: «CLAUDE → ordena y revisa» y debajo «CODEX → encargo cerrado + prueba», unidos por una flecha | Punch-in de ×1,12 en «Por eso». 19 palabras |
| 50,2-56,2 | Si la tarea tiene una prueba clara, va a Codex. Si hay que decidir, a Claude. | 50,4: tarjeta de dos filas: «PRUEBA CLARA → CODEX» y «HAY QUE DECIDIR → CLAUDE» | Regla con nombre. 16 palabras |
| 56,2-62,6 | Las diez pruebas y el pedido están en mi comunidad. Link en mi perfil, buscá RONDAS en Avisos. | Tarjeta verde llena con el CTA tecleado con cursor, desde 59,1 s | Brillo agudo al entrar. 17 palabras |
| 62,6-64,5 | *(toma aparte)* Una tarea, cuatro rondas. Chau. | Cámara completa; sigue el CTA | 5 palabras |

**CTA (una sola acción):**
- **Dicho:** «Las diez pruebas y el pedido están en mi comunidad. Link en mi perfil, buscá RONDAS en Avisos.»
- **Tecleado (8 palabras):** «Buscá RONDAS en Avisos · link en mi perfil».

**Yap (19:30 IG Trial; 19:35 TikTok y Shorts) · ~40 s**
- **Gancho:** filtro de dolor, 10 palabras: «Si ya sabés a cuál IA darle cada tarea, no sigas.» Rótulo: «¿A CUÁL LE DAS QUÉ?».
- **Montaje:** gancho (~3,8 s) → tramo 13,1-18,4 (ronda uno) → tramo 23,6-32,6 (las llaves) → tramos 43,1-56,2 (cómo lo reparto) → CTA.

**Qué grabar (Sergio Urcullo, ~20 min)**
1. Set Erik, como DU-01.
2. Los corchetes los dicta la madre antes de grabar (tabla de resultados del jue 15). Los tiempos se dicen redondos: «un minuto y diez», no «uno coma diecisiete».
3. El tramo 39,0-43,1 se graba en sus dos versiones; el 23,6-32,6 también con la línea B.
4. Tomas aparte: «Una tarea, cuatro rondas. Chau.» · el cierre sin palabra · el yap.
5. Bruto: `CC-01-rondas.mp4`.

**Qué capturar (los agentes, jue 15):** la salida de `node --test` de cada carpeta; el pedido de permiso de Claude Code; la línea de Codex con el modo de sandbox; `git diff --stat` de cada carpeta; los dos modelos usados. Terminal oscura, recortada, sin rutas personales.

**Lo que se arma en código:** sello VS, tarjeta del monto, índice, contadores, cronómetros, tarjeta «caja», sellos de la regla, tarjeta resumen, diagrama del reparto, tarjeta de la regla y CTA.

**Imágenes generadas:** ninguna.

**Antes de publicar**
- Tabla de cortes y preview de 360p. Diccionario de marcas: «códex» o «codecs» → Codex; «cloud» → Claude.
- El caption dice «1 corrida por herramienta, [fecha]». Leerlo entero.
- El aviso RONDAS, con la tabla de resultados ya llena, pegado antes de las 18:30.

**Datos a verificar el día (mar 20-oct)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| Los cuatro resultados de cada herramienta | la corrida del jue 15 (salidas guardadas) | **pendiente: se mide** |
| Codex corre con un modo de sandbox que limita la escritura a la carpeta de trabajo (`workspace-write`) | doc oficial de Codex: https://learn.chatgpt.com/docs (`developers.openai.com/codex` redirige ahí) | sin verificar hoy; se lee el día. Si la doc lo dice distinto, cambia la frase |
| Claude Code, en el modo por defecto, pide permiso antes de editar archivos o correr comandos | https://code.claude.com/docs/en/permission-modes | sin verificar hoy; se lee el día |
| En mi empresa Claude ordena y revisa, y Codex hace los encargos cerrados con su prueba; Codex no mergea ni publica | skill `equipo-de-agentes` §1 y skill `onia-sesion-madre` § Delegar código a Codex | ok |
| La factura boliviana muestra el importe en letras con los centavos «/100» | una factura propia del día o la representación gráfica en siatinfo | **sin verificar**: se mira una factura real antes de grabar |
| «Veintiún mil» y no «veintiuno mil» | norma de la RAE para el numeral ante sustantivo | ok (regla del español; el caso está en las pruebas) |

**Fuentes de la idea**
- Erik Taveras, versus en 4 rondas, «Agentes de IA en 2026: Claude Code, Dots, Muse, Hermes… cuál te conviene?»: https://www.youtube.com/watch?v=TtWKMZ43k0Q
- Comparativa de qué pagar, con dato citado (@jose.gonzalez.ia, 8-oct, 170,7 mil): https://www.tiktok.com/@jose.gonzalez.ia/video/7694328885718060310
- Alcance bajo de Codex en español como titular: radar del 10-oct, tema 5 (sobre https://www.tiktok.com/@notfound404.es/video/7694300582403656982).

## Mié 21-oct

### CC-02 · La misma landing con y sin una skill de diseño: cuántos tics de IA saca

**Sale:** mié 21-oct. Video A a las 12:30 en IG (`ig-reel.mjs`) y a las 12:35 en TikTok, Shorts y LinkedIn (Buffer). Yap a las 13:30 en IG Trial; 13:35 en TikTok y Shorts.

- **Rótulo fijo arriba (del cuadro 0 al final, 2 líneas):** «Webs con Claude: / menos TICS de IA» (7 palabras). No promete «que no parezca IA».
- **Fórmula:** F2 de PLAN-REFERENTES, **receta de 2 pasos** (Rocha, design.md: 87,6 mil): el defecto que ya sufre el espectador, dos pasos, cómo sabés que funcionó. Más el **giro a mitad** de Rocha («solo sirve para…»): acá, que el detector es de la misma skill.
- **Molde:** **Rocha** (receta medida el 8-oct): una toma continua de cara con capas.
  - título fijo al 14-26 % del alto; subtítulo blanco en minúscula a ~78 %, sin color;
  - caja blanca que se escribe sola a 62-70 % del alto, con la palabra clave en verde;
  - **5 capturas a pantalla completa** de 1,5 a 5 s (las dos webs y las salidas del detector); 0-2,1 cortes duros cada 10 s;
  - -14 LUFS, solo voz.
- **Duración:** ~58 s (155 palabras a 160 por minuto). Rocha: 53-89 s.
- **A quién le habla:** a quien arma webs con Claude, para sí o para vender.
- **CTA:** comunidad, palabra **DISEÑO**.

**La medición (la arman los agentes antes de grabar, jue 15 hasta las 18:00)**
- Un negocio **de ejemplo**, rotulado así (por ejemplo, «Café Ejemplo»), y el mismo pedido de landing, palabra por palabra, en dos carpetas: A sin skills de diseño cargadas y B con la skill Impeccable.
  - ⚠️ **Trampa:** Impeccable está instalada también en `~/.claude/skills/impeccable`, así que se carga en TODA sesión y su descripción se dispara con «landing page». A se corre en una sesión donde la lista de skills no muestre `impeccable` (probar `claude --safe-mode` y mirarlo); si aparece o Claude la invoca, la medida A no vale y la pieza va a la reserva.
- **Medida 1, el detector:** el de la propia skill, ya instalado, sin descargar nada: `node .claude/skills/impeccable/scripts/detect.mjs --json <carpeta>` sobre cada carpeta → **[X] y [Y]** tics. Es el mismo detector que la doc oficial publica como `npx impeccable detect --json` (https://impeccable.style/docs/detector).
- **Medida 2, a ciegas:** un verificador Haiku 5.5 recibe las dos capturas como «web 1» y «web 2», sin saber cuál es cuál, y cuenta con esta lista (sale de `rules/web/design-quality.md`, «Banned Patterns»): (1) titular centrado con mancha de degradé y botón genérico; (2) grilla de tarjetas iguales con el mismo espacio; (3) gris sobre blanco con un solo color de acento; (4) la letra por defecto sin motivo; (5) el mismo radio, la misma sombra y el mismo espacio en todo → **[X2] y [Y2]**.
- Una sola corrida. Si las dos medidas no van para el mismo lado, se dice en el tramo del giro.
- **Línea B (si el detector local falla o no corre):** se usa solo la medida 2. Cambian los tramos 10,2-15,4, 21,0-27,4 y 27,4-38,7 (abajo).

**Gancho elegido:** «Lo que armás con Claude se nota que lo hizo una IA. Lo medí.»
**Descartados:** (1) «Ya no se nota que lo hizo una IA»: es la sobrepromesa que el radar pide no hacer. (2) «La skill que casi nadie usa»: el gancho ajeno, sin prueba propia.

**Cuadro 0 (0-4,9 s, sin corte de cámara):** título en 0,0; primer subtítulo a 0,4; a 1,9 s la captura de la web A como ficha sobre el pecho, con el sello «[X] TICS»; a 4,1 s la caja escribe «lo **medí**».

**Guion por tramos**

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-4,9 | Lo que armás con Claude se nota que lo hizo una IA. Lo medí. | Cuadro 0 de arriba | Ningún corte. 13 palabras |
| 4,9-10,2 | Misma landing, dos veces: sin skill y con Impeccable. Y un detector de tics. | 6,4: índice en 3 cajas apiladas: «1 · sin skill / 2 · con Impeccable / 3 · cómo medís la tuya». 7,9: ficha del logo de Impeccable con pop, al nombrarla | Capas, sin cortes. 14 palabras |
| 10,2-15,4 | Sin skill, el detector marcó [X] tics. [Tic 1], [tic 2] y [tic 3]. | **10,2-15,4: captura C1 a pantalla completa**, la web A, con un círculo verde sobre cada tic cuando se nombra | Los tics que se dicen son los que marcó el detector, con las palabras de la lista de arriba. 2 cortes. ~14 palabras |
| 15,4-21,0 | Impeccable es una skill de diseño. Le da a Claude reglas de tipografía, color y espacio. | Cara. 16,0: caja «skill = **reglas** para Claude». 18,4: segunda línea «tipografía · color · **espacio**» | 15 palabras |
| 21,0-27,4 | Paso uno: instalás la skill. Paso dos: le pedís lo mismo. Con la skill: de [X] a [Y]. | 21,0: caja «1 · instalás». 22,6: «2 · el **mismo** pedido». **24,6-27,4: captura C2**, la web B, con el sello «[X] → [Y] TICS» | 2 cortes. 17 palabras |
| 27,4-38,7 | Ojo: ese detector es de la misma skill. Es el alumno corrigiendo su examen. Así que un agente las contó a ciegas. No sabía cuál era cuál. Dio [X2] a [Y2]. | 27,4: caja «el detector es de la **misma** skill». 30,0: caja «alumno = **profesor**». **33,0-36,2: captura C3**, las dos webs lado a lado como «web 1» y «web 2», sin rótulo. 36,2: caja «a ciegas: **[X2] → [Y2]**» | **Giro** a mitad, de Rocha. 2 cortes. 30 palabras |
| 38,7-43,6 | No la vuelve humana. Le saca los tics. El gusto lo ponés vos. | Cara. 39,2: caja «no la vuelve **humana**». 41,4: «el gusto: **vos**» | 13 palabras |
| 43,6-48,8 | Para medir la tuya: npx impeccable detect y tu carpeta. Después, mirala en el celular. | **44,3-46,5: captura C4**, la salida real en JSON del detector, con zoom al total; encima, tarjeta de código con `npx impeccable detect --json tu-carpeta/` (el comando oficial, que no se corrió: no se muestra como captura). 46,5: cara con la caja «y mirala en el **celular**» | 2 cortes. 14 palabras |
| 48,8-55,2 | El pedido y las dos webs están en mi comunidad. Link en mi perfil, buscá DISEÑO en Avisos. | Cara. 49,2: caja «el pedido + las dos webs». 53,0: el **CTA empieza a teclearse** en una caja blanca y queda hasta el final | 17 palabras |
| 55,2-58,2 | *(toma aparte)* La skill ayuda. El ojo es tuyo. Chau. | Cara; sigue la caja del CTA | 8 palabras |

**Línea B (si el detector local falló):**
- 10,2: «Sin skill, un agente le contó [X2] tics. [Tic 1], [tic 2] y [tic 3].»
- 21,0: «Paso uno: instalás la skill. Paso dos: le pedís lo mismo. Con la skill: de [X2] a [Y2].»
- 27,4: «Ojo: el agente no sabía cuál era cuál. Contó a ciegas, con una lista de cinco tics.» (17 palabras)
- 43,6: «Para medir la tuya: la lista de cinco tics. Y después, mirala en el celular.»
- Se graba solo si el jue 15 a las 18:00 el detector no dio resultado.

**CTA (una sola acción):**
- **Dicho:** «El pedido y las dos webs están en mi comunidad. Link en mi perfil, buscá DISEÑO en Avisos.»
- **Tecleado (8 palabras):** «Buscá DISEÑO en Avisos · link en mi perfil». «DISEÑO» lleva la eñe: así se escribe en el aviso, para que la búsqueda de WhatsApp lo encuentre.

**Yap (13:30 IG Trial; 13:35 TikTok y Shorts) · ~35 s**
- **Gancho:** filtro de dolor, 12 palabras: «Si a tu web hecha con IA nadie le nota nada, no sigas.» Rótulo del yap: «¿SE NOTA QUE ES IA?».
- **Montaje:** gancho (~4,5 s) → tramo 10,2-15,4 → tramo 21,0-27,4 → tramo 27,4-38,7 → CTA.

**Qué grabar (Sergio Urcullo, ~20 min, sáb 17, set Rocha)**
- Plano medio corto, ojos al 33-38 % del alto, pecho libre para las cajas (62-70 %).
- Del 0 al 10,2 s, una sola toma continua. Desde ahí, una toma por bloque.
- Los corchetes los dicta la madre antes de grabar. Si llegó la línea B, se graban esas cuatro frases.
- Tomas aparte: el remate · el cierre sin palabra · el gancho del yap.
- Bruto: `CC-02-diseno.mp4`.

**Capturas (los agentes, jue 15):** C1 web A completa; C2 web B completa; C3 las dos lado a lado sin rótulo; C4 la salida real de `detect.mjs --json` con su total (el comando que de verdad se corrió). Las webs son del negocio de ejemplo, con «EJEMPLO» en la esquina. Nada de marcas reales ni fotos de personas.

**Imágenes generadas:** ninguna. Las webs son reales (las hizo Claude); el negocio es de ejemplo.

**Antes de publicar**
- Tabla de cortes y preview de 360p. Diccionario de marcas: «impecable» → Impeccable; «cloud» → Claude; «en pe equis» → npx.
- Leer el caption entero. Dice «1 corrida, negocio de ejemplo».

**Datos a verificar el día (mié 21-oct)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| [X], [Y], [X2], [Y2] y los tres tics | la medición del jue 15 | **pendiente: se mide** |
| Impeccable es una skill de diseño que cubre tipografía, color, espacio y anti-patrones; trae `npx impeccable detect --json` | la skill instalada en la PC: `~/.claude/skills/impeccable/SKILL.md` y `reference/critique.md` (línea del `detect`) | ok, leído el 10-oct |
| Impeccable es de Paul Bakaus (repo `github.com/pbakaus/impeccable`). En Claude Code se instala con `/plugin marketplace add pbakaus/impeccable` y después `/plugin` → Discover → Impeccable; en la terminal, `npx skills add pbakaus/impeccable`. El detector: `npx impeccable detect --json carpeta/`, sin conversación con la IA | https://impeccable.style y https://impeccable.style/docs/detector | ok, leído el 10-oct. Se relee el día antes de pegar DISEÑO |
| La lista de cinco tics | `~/.claude/rules/web/design-quality.md`, «Banned Patterns» | ok |

**Fuentes de la idea**
- @migue.baena, 2-oct, 39 s, 379,2 mil reproducciones y 34 mil guardados: tres skills de diseño para que lo hecho con Claude no se vea genérico: https://www.tiktok.com/@migue.baena/video/7692086645838875926
- Enrique Rocha, «Diseña páginas web BIEN con Claude», 5-oct, 87,9 mil: https://www.tiktok.com/@soyenriquerocha/video/7693013578307308820
- @revolutia.ai, «la skill más útil y casi nadie la usa», 5-oct: https://www.tiktok.com/@revolutia.ai/video/7693144855836396822

## Jue 22-oct

### DU-03 · Una tarea, una herramienta, un número: las cotizaciones de una importadora de ejemplo

**Sale:** jue 22-oct. Video A a las 12:30 en IG (`ig-reel.mjs`) y a las 12:35 en TikTok, Shorts y LinkedIn (Buffer). Yap a las 13:30 en IG Trial; 13:35 en TikTok y Shorts.

- **Rótulo (cuadro 0, en el panel):** «COTIZAR: CASI 7 HORAS POR SEMANA» (6 palabras). Encima, el chip de serie «01 · UNA TAREA, UN NÚMERO». Rótulo de estado debajo: «NEGOCIO DE EJEMPLO», todo el video.
- **Fórmula:** la serie de Santiago «un agente para un negocio» (4-oct): **problema con costo, stack en una tarjeta, resultado funcionando y número armado en pantalla**. Gancho de F1, **pregunta de plata o de tiempo** (Santiago, 1,6 M).
  - Se copia la estructura, no el público: Santiago le habla a quien vende agentes; esta pieza le habla al dueño.
  - **No lleva «Día 1» ni anuncia el 02:** el chip de serie se usa solo si el 02 ya está grabado (regla de `edicion-referentes`, «Cobertura añadida 9-oct»). Si no, el chip dice solo «UNA TAREA, UN NÚMERO».
  - Sin el arranque mudo de 6 s del corte de Santiago (quedó bajo su mediana): voz desde el cuadro 0.
- **Molde:** **Santiago, «noticia con tarjetas»**: terminal y archivos arriba, cámara abajo; la cuenta como **tarjeta que se arma** (G7, «US$0,55 × 30 = US$16,50»).
- **Duración:** ~65 s (170 palabras a 160 por minuto = 63,8 s, más pausas). Rango Santiago: 65-120 s.
- **A quién le habla:** al dueño de una importadora o un comercio que cotiza por WhatsApp. La importadora es el segundo rubro del orden de empuje (dental → importadora).
- **CTA:** asesoría gratis.
- **No nombra Onia.** Es marca personal: una tarea resuelta con Claude Code, no el producto.

**La demo (la arma un agente antes de grabar, mié 14 hasta las 18:00)**
- Carpeta de prueba fuera del repo con dos archivos:
  - `precios.csv`: 8 a 10 productos de ferretería genéricos (código, producto, precio en Bs), **precios de ejemplo**, sin marcas;
  - `pedido.txt`: «Hola! Cotizame 10 taladros percutores, 5 amoladoras y 20 discos de corte. Y 3 escaleras de aluminio. Gracias». Las escaleras **no están** en la lista.
- El pedido a Claude Code, uno solo: «Armá la cotización de pedido.txt con precios.csv, lista para pegar en WhatsApp: producto, cantidad, precio por unidad, subtotal, total y validez de 7 días. Lo que no esté en la lista: "por confirmar", sin precio.»
- **Se mide:** **[X]** = segundos desde el Enter hasta la cotización completa (de la grabación de pantalla); que el total coincida con la suma (un script de 3 líneas o la calculadora, en pantalla); y que las escaleras digan «por confirmar».
- **[Z]** = 40 × ([X] + 60) segundos, dicho en minutos (ejemplo: con [X] = 20 s, 40 × 80 = 3.200 s ≈ 53 min). Si el total no coincidió o inventó un precio, la pieza no se graba así: se cuenta como falla (y pasa a ser un «me pasó» de otra semana).

**Gancho elegido:** «¿Cuántas horas por semana se te van en cotizar? En esta importadora de ejemplo, casi siete.»
**Descartados:** (1) «Le pedí a Claude que reemplace a mi vendedor»: no hay vendedor ni se reemplaza a nadie. (2) «Con el dólar como está, cada cotización que perdés…»: no se usan cifras de cambio sin medirlas el día, y opinar del dólar no es el tema.

**Guion por tramos**

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-6,0 | ¿Cuántas horas por semana se te van en cotizar? En esta importadora de ejemplo, casi siete. | 0,0: rótulo, chip de serie y rótulo de estado. Panel: **tarjeta que se arma**: 0,8 «40 pedidos» → 2,0 «× 10 min» → 4,3 «= 400 min ≈ 6 h 40», con «casi siete» en verde | Voz en el cuadro 0. Gesto: señala el panel con el pulgar. 16 palabras |
| 6,0-12,0 | Cuarenta pedidos por semana, diez minutos cada uno. Son números del ejemplo, no de un cliente. | La tarjeta se queda. 9,4: sello «SUPUESTOS DEL EJEMPLO» rotado -5° | 16 palabras |
| 12,0-16,5 | Cuando reponer cuesta más, perder un pedido por contestar tarde duele más. | Cara completa. 13,5: «duele más» en serif grande sobre la cara | Sin cifra de cambio. 12 palabras |
| 16,5-22,5 | Le di a Claude Code dos archivos: la lista de precios y un pedido de WhatsApp. | 16,5: logo de Claude Code al nombrarlo. 18,2: **tarjeta del stack**: «precios.csv + pedido.txt + Claude Code». 20,4: captura de `pedido.txt` | 16 palabras |
| 22,5-27,8 | Y una orden: armá la cotización con esta lista. Lo que no esté, por confirmar. | Captura del pedido tecleado en Claude Code, con zoom a «por confirmar» | 14 palabras |
| 27,8-33,4 | El pedido: diez taladros, cinco amoladoras, veinte discos. Y algo que la lista no tiene. | Captura de `pedido.txt`; cada producto se subraya con su palabra; 31,5: «3 escaleras» con un círculo verde y el chip «NO ESTÁ EN LA LISTA» | 15 palabras |
| 33,4-39,4 | En [X] segundos armó la cotización. Precio por unidad, subtotal, total y validez de siete días. | 33,4: cronómetro que se frena en [X] s. 35,2: la cotización real, con zoom a cada parte cuando se nombra | 16 palabras |
| 39,4-44,3 | Lo que no estaba en la lista, no lo inventó. Puso: por confirmar. | Zoom a la línea «Escaleras de aluminio · por confirmar». 42,6: sello «NO INVENTÓ» | 13 palabras |
| 44,3-49,5 | Cómo sabés que está bien: sumá a mano. El total tiene que dar igual. | Cara completa. 45,8: la suma en pantalla (script o calculadora) junto al total de la cotización; sello verde «IGUAL» | 14 palabras |
| 49,5-55,1 | Si revisarla te lleva un minuto, cuarenta por semana son [Z]. Antes, casi siete horas. | **Tarjeta que se arma:** 49,9 «40 × ([X] s + 1 min)» → 52,4 «= [Z]», con [Z] en verde; 54,0: «6 h 40» tachado | La cuenta entra a la vez que se dice. 15 palabras |
| 55,1-58,5 | La manda una persona. La IA arma, vos revisás. | Cara completa. 56,3: chip «LA IA ARMA · VOS REVISÁS» | 9 palabras |
| 58,5-63,8 | ¿Querés hacer esta cuenta con tu negocio? Asesoría gratis, link en mi perfil. Chau. | Panel desenfocado y tarjeta del CTA, tecleado desde 59,0 s | 14 palabras |

**CTA (una sola acción, asesoría):**
- **Dicho:** «¿Querés hacer esta cuenta con tu negocio? Asesoría gratis, link en mi perfil. Chau.»
- **Tecleado (10 palabras):** «¿Lo vemos en tu negocio? Asesoría gratis · link en mi perfil».
- **Bloqueo:** igual que DU-01. Sin el link en una bio, en esa red cierra la variante de comunidad: «Las cinco preguntas para elegir tu tarea están en mi comunidad. Link en mi perfil, buscá CHECKLIST en Avisos.» (solo si CHECKLIST ya está pegado).

**Yap (13:30 IG Trial; 13:35 TikTok y Shorts) · ~40 s**
- **Gancho:** filtro de dolor, 7 palabras: «Si cotizar no te come horas, no sigas.» Rótulo: «¿CUÁNTO TE COME COTIZAR?».
- **Montaje:** gancho (~2,6 s) → tramos 16,5-44,3 recortados (stack, orden, resultado, «no lo inventó») → tramo 49,5-55,1 → CTA.

**Qué grabar (Sergio Urcullo, ~20 min, jue 15, set Santiago)**
1. Como N08. Los corchetes los dicta la madre (la demo es del mié 14).
2. «Cotizame» se dice como lo escribe un cliente de Santa Cruz.
3. Tomas aparte: el CTA con «Chau» · la variante de comunidad · el gancho del yap.
4. Bruto: `DU-03-cotizar.mp4`.

**Qué capturar (el agente, mié 14):** `precios.csv` y `pedido.txt` abiertos; el pedido en Claude Code; la cotización completa; la suma de control; la grabación de pantalla con el tiempo. Todo con el chip «EJEMPLO». Sin marcas ni datos de clientes.

**Lo que se arma en código:** tarjeta 40 × 10 = 6 h 40, sello de supuestos, tarjeta del stack, cronómetro, sellos «NO INVENTÓ» e «IGUAL», tarjeta de [Z], chip final y CTA.

**Imágenes generadas:** ninguna.

**Antes de publicar**
- Tabla de cortes y preview de 360p. Diccionario de marcas: «cloud» → Claude; «cotízame» queda como lo dice él.
- Abrir el link de la asesoría desde cada bio.
- Leer el caption entero. Dice «negocio y números de ejemplo».

**Datos a verificar el día (jue 22-oct)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| [X] y [Z]; el total coincide; «por confirmar» en las escaleras | la demo del mié 14 | **pendiente: se mide** |
| 40 pedidos por semana y 10 min por cotización | supuestos del ejemplo, rotulados así en pantalla | ok como ejemplo; no es un dato de nadie |
| 40 × 10 = 400 min = 6 h 40 min («casi siete») | cuenta propia | ok |
| Importadores con dificultad para reponer por falta de dólares (contexto de «reponer cuesta más»; no se dice ninguna cifra) | Infobae, 22-may-2026: https://www.infobae.com/peru/2026/05/21/bolivia-al-borde-del-colapso-sol-peruano-se-aprecia-frente-al-boliviano-tras-nueva-crisis-cuanto-vale-actualmente/ | declarado por la fuente; el tipo de cambio posterior a junio no se verificó, por eso no va |

**Fuentes de la idea**
- Santiago Muñoz, serie «un agente de IA para un negocio al azar», ep. 1, 4-oct: https://www.youtube.com/watch?v=HIfvbFZ7Bww
- «Tu primer agente para tu negocio» con el recurso en el perfil (@miguel_silva.ia, 30-sep): https://www.tiktok.com/@miguel_silva.ia/video/7691462618967444744
- El diagnóstico como entregable visible (Juan Pe Navarro, 6-oct; se toma el mecanismo, no el precio por hora): https://www.youtube.com/watch?v=pRH1mjw4QrI
- Contexto del importador sin dólares: el enlace de Infobae de arriba.

## Vie 23-oct

### CC-03 · Mis agentes gastaron una semana de Codex en 32 horas, y la guarda que le puse

**Sale:** vie 23-oct. Video A a las 12:30 en IG (`ig-reel.mjs`) y a las 12:35 en TikTok, Shorts y LinkedIn (Buffer). Yap a las 13:30 en IG Trial; 13:35 en TikTok y Shorts.

- **Rótulo fijo arriba (del cuadro 0 al final, 2 líneas):** «Mis agentes QUEMARON / la semana» (5 palabras).
- **Fórmula:** F4 de PLAN-REFERENTES, **«Lo rompí / me pasó»**, con lo medido en Erik: el **error propio dicho en voz alta** e índice entre los 3 y los 13 s; y el **giro a mitad** de Rocha.
  - ⚠️ F4 en versión fallo se mide con D03-A el **lun 19-oct** (guardados por vista). Si D03-A quedó muy por debajo, la madre decide si CC-03 sale igual o va la reserva. Hasta entonces no se cita como fórmula probada.
- **Molde:** **Rocha**, como CC-02: toma continua de cara con capas, **4 capturas** a pantalla completa, caja del medio que se escribe sola.
- **Duración:** ~64 s (170 palabras a 160 por minuto). Rocha: 53-89 s.
- **A quién le habla:** a quien usa agentes o paga un plan con tope.
- **CTA:** comunidad, palabra **EQUIPO**.
- **Distinto de P3:** P3 muestra cómo está armado el equipo (diagrama sin cara, recurso 3LINEAS). CC-03 cuenta qué salió mal y la guarda. Si P3 sale esa misma semana, quedan al menos 3 días entre las dos.
  - ⚠️ **Roce con la semana del 10:** las tres líneas (qué hacer, cómo probarlo, cuándo parar) ya salen en P2 (lámina 03, sáb 17) y en P3. Acá van solo en el tramo 29,7-36,8 como el arreglo del error; lo nuevo es el error, el tope del 10 % y `/status`. No se estira ese tramo.

**Los datos (los recuenta la madre en la PC antes de grabar, mié 14 hasta las 18:00)**
- Desde `~/.codex/sessions`, los registros `rate_limits` de la ventana semanal: **97 % el 15-sep, 95 % el 23-sep y 100 % el 29-sep; la última, en ~32 h**, con hasta 6 sesiones en paralelo. Medido el 2-oct por un subagente de la madre.
- La parte del gasto que fue releer contexto (el 2-oct dio 97 % de los tokens). Si el recuento no la reproduce, el tramo 25,6-29,7 dice «la mayor parte» y no da número.
- Qué hace `/status` en el Codex de la PC (el método vigente lo usa antes y después de cada tarea).
- **Cualquier cifra que no se reproduzca sale del guion.** El texto ya no depende de ningún número que no esté en esta lista.

**Gancho elegido (F4, 12 palabras):** «Mis agentes gastaron una semana de Codex en treinta y dos horas.»
**Descartados:** (1) «Dejé a mis agentes solos y mirá lo que pasó»: es el molde de la tendencia, pero no hay un experimento con ese registro (ver «Lo que NO entra»). (2) «Pagás de más por tu IA y no lo sabés»: apunta al espectador y pierde el error propio.

**Cuadro 0 (0-4,5 s, sin corte de cámara):** título en 0,0; primer subtítulo a 0,4; a 1,3 s la ficha del logo de Codex (OpenAI) con pop, al decir «Codex»; a 2,0 s **C1** como ficha sobre el pecho: la línea real del registro con «100 %» y «29-SEP» en grande encima; a 3,6 s la caja escribe «en **32 h**».

**Guion por tramos**

| Tiempo | Dice | Se ve | Edición |
|---|---|---|---|
| 0,0-4,5 | Mis agentes gastaron una semana de Codex en treinta y dos horas. | Cuadro 0 de arriba | Ningún corte. 12 palabras |
| 4,5-7,5 | Y no fue una vez. Tres semanas seguidas. | Cara. 5,9: caja «**97 %** · 95 % · 100 %», cada número con su fecha chica debajo | 8 palabras |
| 7,5-11,3 | Así lo uso en mi empresa: error, guarda y cómo medirlo. | 8,3: índice en 3 cajas apiladas: «1 · el error / 2 · la guarda / 3 · cómo medirlo» | «Así lo uso en mi empresa» antes de los 10 s (PLAN §5). 10 palabras |
| 11,3-18,8 | Codex es el agente de OpenAI que escribe código. Mi plan tiene un tope por semana. Al llegar, se frena. | 11,3: «1 · el error» resaltado. 12,5: caja «Codex = **escribe** código». 15,3: caja «tope **semanal**». 17,4: segunda línea «al llegar, se **frena**» | Sin cortes. 20 palabras |
| 18,8-25,6 | El error: le daba tareas abiertas. Retomá todo esto. Pensá la estrategia. Y con el esfuerzo al máximo. | 18,8: caja «tareas **abiertas**». **20,6-23,4: captura C2**, dos encargos viejos reales recortados («retomá…», «pensá…»), sin nombres de clientes. 24,3: caja «esfuerzo **máximo**» | 2 cortes. 18 palabras |
| 25,6-29,7 | Cuando medí, casi todo el gasto era releer contexto. No trabajar. | 25,6: caja «**[97 %]** = releer». **26,8-29,0: captura C3**, la línea del recuento con los tokens de entrada leídos de caché contra el total | 2 cortes. Si no se reproduce el 97 %, la caja dice «casi todo = **releer**» y la voz igual. 11 palabras |
| 29,7-36,8 | La guarda: a Codex solo le llegan tareas cerradas. Qué hacer, cómo probar que está hecho y cuándo parar. | 29,7: «2 · la guarda» resaltado. 30,4: caja «solo tareas **cerradas**». 32,6: tres cajas apiladas: «qué hacer / cómo **probarlo** / cuándo **parar**», una por palabra | 19 palabras |
| 36,8-41,3 | Y un tope por tarea: el diez por ciento de la semana. | Caja «tope por tarea: **10 %**» | 12 palabras |
| 41,3-48,1 | Lo que más me costó entender: el agente no sabía cuándo parar. Porque yo no se lo decía. | Cara, sin cajas hasta 45,6. 45,6: caja «porque **yo** no se lo decía» | **Giro** (Rocha) y error propio dicho en voz alta (Erik). Punch-in de ×1,12 en «Porque yo». 18 palabras |
| 48,1-55,2 | Para medirlo: barra status antes y después de cada tarea. Si sube más de diez, el encargo estaba abierto. | 48,1: «3 · cómo medirlo» resaltado. **49,0-51,5: captura C4**, `/status` real del Codex de la PC, recortado a la línea del uso semanal. 52,0: caja «sube **más de 10** = encargo abierto» | 2 cortes. 19 palabras |
| 55,2-62,0 | Cómo le paso las tareas a Codex está en mi comunidad. Link en mi perfil, buscá EQUIPO en Avisos. | Cara. 55,6: caja «cómo le paso las tareas». 58,4: el **CTA empieza a teclearse** y queda hasta el final | 18 palabras |
| 62,0-63,9 | *(toma aparte)* Un encargo con final. Chau. | Cara; sigue la caja del CTA | 5 palabras |

**Cuenta:** 4 capturas a pantalla completa (C2 a C4) y C1 como ficha del cuadro 0; 6 cortes duros en ~64 s (0,9 cada 10 s, dentro de 0-2,1). Palabras: 12 + 8 + 10 + 20 + 18 + 11 + 19 + 12 + 18 + 19 + 18 + 5 = **170**.

**CTA (una sola acción):**
- **Dicho:** «Cómo le paso las tareas a Codex está en mi comunidad. Link en mi perfil, buscá EQUIPO en Avisos.»
- **Tecleado (8 palabras):** «Buscá EQUIPO en Avisos · link en mi perfil».

**Yap (13:30 IG Trial; 13:35 TikTok y Shorts) · ~40 s**
- **Gancho:** filtro de dolor, 9 palabras: «Si tus agentes nunca te dejaron sin cupo, no sigas.» Rótulo del yap: «¿TE QUEDASTE SIN CUPO?».
- **Montaje:** gancho (~3,4 s) → tramo 18,8-25,6 (el error) → tramos 29,7-41,3 (la guarda y el tope) → tramo 48,1-55,2 (cómo medirlo) → CTA.

**Qué grabar (Sergio Urcullo, ~20 min, sáb 17, set Rocha)**
- Como CC-02. Del 0 al 11,3 s, una sola toma continua (gancho, «tres semanas» e índice). Sin manos delante del pecho entre 0 y 4,5 s: ahí entra C1.
- Si la madre avisó que el 97 % no se reprodujo, el tramo 25,6-29,7 se dice igual («casi todo el gasto»): no cambia la voz, solo la caja.
- Tomas aparte: el remate · el cierre sin palabra · el gancho del yap.
- Bruto: `CC-03-cupo.mp4`.

**Capturas (la madre, mié 14, en la PC):** C1 la línea del registro con el 100 % del 29-sep; C2 dos encargos abiertos viejos, recortados y sin datos de clientes; C3 el recuento de releer contexto; C4 `/status` de Codex. Terminal oscura, recortada. **Nada de `~/.codex/auth*` ni tokens en pantalla.**

**Lo que se arma en código:** cajas, índice, ficha del logo, caja del CTA.

**Imágenes generadas:** ninguna.

**Antes de publicar**
- Tabla de cortes y preview de 360p. Diccionario de marcas: «códex» → Codex; «estatus» → `/status`.
- Leer el caption entero. Que no tenga el nombre del plan ni el monto: no suman al mensaje.

**Datos a verificar el día (vie 23-oct)**

| Dato | Fuente | Estado al 10-oct |
|---|---|---|
| 97 % el 15-sep, 95 % el 23-sep, 100 % el 29-sep; la última en ~32 h | `~/.codex/sessions` (registros `rate_limits`), medido el 2-oct por un subagente de la madre | **se recuenta el mié 14**; lo que no se reproduzca sale |
| Casi todo el gasto fue releer contexto (97 % de los tokens) | mismo registro | **se recuenta el mié 14** |
| El plan tiene una ventana semanal y al tope se frena, no cobra más | mismo registro y `/status` | se mira el día |
| La guarda vigente: solo trabajo cerrado y verificable, con qué hacer, cómo probarlo y cuándo parar; tope de ~10 % de la semana por tarea con `/status` antes y después; Codex no mergea ni publica | skill `equipo-de-agentes` §1 y skill `onia-sesion-madre` § Delegar código a Codex | ok |
| Codex es el agente de OpenAI para escribir código (CLI, IDE y nube) | https://learn.chatgpt.com/docs | ok en P3 (8-oct); se relee el día |

**Fuentes de la idea**
- El molde «dejé a la IA sola X horas y mirá qué pasó», con el fallo del agente como material honesto (@susanadelargdl, 9-oct, 1 M): https://www.tiktok.com/@susanadelargdl/video/7694459139757460742
- La misma premisa con plata y meta medible (@morfeoacademy, 6-oct): https://www.tiktok.com/@morfeoacademy/video/7693623442687511816
- El dato es propio: los registros de Codex de la PC de Sergio Urcullo, recontados antes de grabar.

## Avisos nuevos para la comunidad (pegarlos antes de publicar el video de cada uno)

Cada aviso son **dos mensajes** (regla del 8-oct): el aviso corto primero y el recurso después, en otro mensaje. La línea «Para Sergio Urcullo» no se pega. Los corchetes se llenan con la medición; **un aviso con corchetes no se pega**.

### MODS (va con N08, sáb 17, antes de las 12:30)

**Para Sergio Urcullo:** Los mods son agregados de código para Claude Code, prendidos desde la versión del 1-oct. El aviso deja el pedido que usé y el cuidado: un mod puede leer tus archivos y tus claves.

**Aviso:**
```
🧩 *Claude Code ahora tiene mods*

Un mod es código que corre adentro de Claude Code: puede sumarte un panel, un comando o frenar una orden peligrosa. Le pedí uno a Claude y lo escribió solo.

Abajo: el pedido exacto, los archivos y cómo revisar un mod ajeno antes de instalarlo.

Contame en General: ¿qué le agregarías a tu Claude Code?
```

**Recurso:**
```
🧩 *MODS · el pedido, los archivos y el control*

Necesitás Claude Code 2.1.287 o más nuevo (en la terminal: claude --version).

1. En una carpeta de prueba, abrí Claude Code y pedile:
"[pedido exacto de la demo]"
2. Claude escribe la carpeta del mod: [archivos que escribió en la demo].
3. Cargalo solo para esa sesión: claude --plugin-dir ./[carpeta]
4. Pedile algo que use herramientas: al lado de "Thinking" ves el conteo.

Antes de instalar un mod ajeno:
• claude plugin validate ./carpeta-del-mod → las líneas hooks: y calls: te dicen qué eventos toca y qué pide hacer.
• Un mod corre con tus permisos y no tiene sandbox: puede leer tus archivos y tus claves, y aprobar acciones sin preguntarte.
• Si pide internet y no sabés para qué, no lo instales.
• Para arrancar una sesión con todos los mods apagados: claude --safe-mode.

Fuente: code.claude.com/docs/en/plugins/mods/overview
```

### FACTURA (va con DU-02, lun 19, antes de las 12:30)

**Para Sergio Urcullo:** Explica la resolución del SIN del 30-sep sobre facturación en línea, sin asustar y sin prometer nada. No dice «obligatorio por ley» ni da fechas que la norma no da. Si el jue 15 salió el decreto de la Ley 1733, cambia la última línea del recurso.

**Aviso:**
```
🧾 *Facturación en línea: ya no hay fecha, pero no te salvaste*

El 30 de septiembre el SIN dejó sin efecto los plazos de los grupos 9 a 12: la fecha del 1 de octubre ya no corre. Pero dice que va a asignar una modalidad en línea, cada tanto, a quien paga IVA y no había implementado ninguna. No dice cuándo.

Abajo: el PDF oficial y tres cosas para hacer esta semana.

Contame en General: ¿qué modalidad tenés hoy?
```

**Recurso:**
```
🧾 *FACTURA · qué cambió el 30-sep y qué hacer*

La norma: RND 102600000038, del 30-sep-2026 (PDF del SIN):
https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-102600000038-Abrogacio%CC%81n.pdf

Qué cambió:
• Abroga las designaciones de los grupos 9 a 12 y deja sin efecto sus plazos. La fecha del 1-oct ya no corre.
• El SIN "asignará periódicamente" una modalidad en línea a los sujetos pasivos del IVA que al 30-sep no habían implementado ninguna. No dice cuándo ni cómo lo comunica.

Qué no cambió:
• Los grupos 1 a 8.
• Si ya facturás en línea, la norma no dice que puedas volver atrás.

Tres cosas para esta semana:
1. Mirá qué modalidad tenés habilitada hoy en tu Oficina Virtual del SIN, o preguntale a tu contador.
2. Si te asignan una, cada factura sale de un sistema o del Portal Web en Línea del SIN, que es gratis:
https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web
3. Si alguien te apura con el 1 de octubre, mostrale el PDF. Ante la duda, la línea del SIN: 800 10 3444.

El motivo que da el SIN: aplicar la Ley 1733 (el IVA aparte en la factura). En esa parte, la ley rige desde el mes siguiente a su decreto.

No es asesoría contable: confirmalo con tu contador.
```

### RONDAS (va con CC-01, mar 20, antes de las 18:30)

**Para Sergio Urcullo:** La misma tarea de programación a Claude Code y a Codex, con las 10 pruebas para que cualquiera la repita. Los resultados se llenan con la corrida del jue 15.

**Aviso:**
```
🥊 *La misma tarea a Claude Code y a Codex*

Les di lo mismo a las dos: pasar un monto a letras, como el "Son:" de una factura. Diez pruebas escritas antes, un solo pedido, cuatro rondas.

Abajo: el pedido, las pruebas para que lo repitas y cómo salió.

Contame en General: ¿a cuál le darías esta tarea?
```

**Recurso:**
````
🥊 *RONDAS · el pedido, las pruebas y el resultado*

El pedido (igual para las dos):
"En esta carpeta está monto.test.mjs. Escribí monto.mjs con una función montoEnLetras(n) que pase esas pruebas. No toques monto.test.mjs. Al final corré: node --test"

Las 10 pruebas (guardalas como monto.test.mjs):
```
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { montoEnLetras } from './monto.mjs'

const casos = [
  [0, 'CERO 00/100'],
  [1, 'UNO 00/100'],
  [16, 'DIECISÉIS 00/100'],
  [21, 'VEINTIUNO 00/100'],
  [100, 'CIEN 00/100'],
  [120.5, 'CIENTO VEINTE 50/100'],
  [999.99, 'NOVECIENTOS NOVENTA Y NUEVE 99/100'],
  [21000, 'VEINTIÚN MIL 00/100'],
  [2550.75, 'DOS MIL QUINIENTOS CINCUENTA 75/100'],
  [1000000, 'UN MILLÓN 00/100'],
]

for (const [n, esperado] of casos) {
  test(`${n} → ${esperado}`, () => assert.equal(montoEnLetras(n), esperado))
}
```

Cómo salió ([fecha], 1 corrida cada una):
• Pruebas: Claude Code ([modelo]) [A]/10 · Codex ([modelo]) [B]/10
• Tiempo: [tA] · [tB]
• Permisos que pidió: [N] · Codex trabajó en una caja que solo escribe en la carpeta
• ¿Tocó las pruebas?: [sí/no] · [sí/no]

Cómo lo reparto yo: si la tarea tiene una prueba clara, va a Codex. Si hay que decidir, a Claude.
````

### DISEÑO (va con CC-02, mié 21, antes de las 12:30)

**Para Sergio Urcullo:** La misma web pedida dos veces, sin y con una skill de diseño, y cómo medir los tics de IA de tu propia web. La fuente de Impeccable quedó confirmada el 10-oct (impeccable.style); se relee el día.

**Aviso:**
```
🎨 *Tu web hecha con Claude: menos tics de IA*

Pedí la misma web dos veces: sin skill y con Impeccable, una skill de diseño. Medí los tics de IA de las dos: con su detector y con un agente que no sabía cuál era cuál.

Abajo: el pedido, las dos webs y la lista para revisar la tuya.

Contame en General: ¿cuál tic ves más seguido?
```

**Recurso:**
```
🎨 *DISEÑO · el pedido, el resultado y la lista*

El pedido (negocio de ejemplo): "[pedido exacto de la landing]"

Resultado (1 corrida, [fecha]):
• Detector de Impeccable: [X] tics sin skill → [Y] con skill
• Conteo a ciegas, con la lista de abajo: [X2] → [Y2]
• Las dos webs: [links o capturas]

Impeccable (de Paul Bakaus): impeccable.style
Cómo se instala en Claude Code: /plugin marketplace add pbakaus/impeccable, y después en /plugin → Discover → Impeccable.
Para medir la tuya: npx impeccable detect --json tu-carpeta/

La lista de 5 tics (revisala a ojo):
1. Titular centrado con una mancha de degradé y un botón genérico
2. Tarjetas iguales en grilla, todas con el mismo espacio
3. Gris sobre blanco con un solo color de acento
4. La letra por defecto, sin motivo
5. El mismo radio, la misma sombra y el mismo espacio en todo

La skill saca tics; el gusto lo ponés vos. Mirala siempre en el celular.
```

### EQUIPO (va con CC-03, vie 23, antes de las 12:30)

**Para Sergio Urcullo:** Cómo le paso las tareas a Codex para no quedarme sin cupo, después de llegar al tope tres semanas seguidas. Las cifras van solo si la madre las recontó el mié 14.

**Aviso:**
```
🤝 *Cómo le paso tareas a Codex sin quemar la semana*

Tres semanas seguidas me quedé sin cupo de Codex. La última, en unas 32 horas. El problema no era el modelo: eran mis encargos, abiertos y sin final.

Abajo: cómo le paso las tareas ahora y cómo mido cuánto gasta cada una.

Contame en General: ¿qué tarea le darías cerrada a un agente?
```

**Recurso:**
```
🤝 *EQUIPO · encargos cerrados para Codex*

Lo que me pasó: llegué al tope semanal tres semanas seguidas ([97 %, 95 % y 100 %]). Casi todo el gasto era releer contexto, no trabajar.

La guarda:
1. A Codex solo le llegan tareas cerradas, con tres líneas:
   • QUÉ HACER: qué queda hecho.
   • CÓMO PROBARLO: qué comando o qué archivo demuestra que está hecho.
   • CUÁNDO PARAR: cuándo deja de trabajar y avisa.
2. Un encargo corto por tarea, con el modelo y el esfuerzo dichos (no el máximo por defecto).
3. Tope por tarea: ~10 % de la semana. /status antes y después; si sube más, el encargo estaba abierto.
4. Codex no mergea ni publica: el resultado lo revisa Claude.

Cómo lo reparto: si la tarea tiene una prueba clara, Codex. Si hay que decidir, Claude.
```

## Piezas que NO necesitan que Sergio Urcullo grabe (para los días sin bruto)

Este lote no suma piezas sin cara. Siguen las de `GRABAR-10-16-OCT.md`: **P1** («Niveles») y **P3** («1 persona, N sesiones de Claude») sin fecha, y **P2** (carrusel «7 herramientas. 4 son gratis.») el sáb 17 a las 16:00. Si una pieza de este lote no se puede grabar (falta su medición), su lugar lo toma P1 o P3, nunca una pieza inventada.

## Plan de publicación

`CALENDARIO-PUBLICACION-17-23-OCT.md` no existe todavía: lo arma la madre. Lo que este lote ocupa:

| Día | Hora | Pieza | CTA | Otro video del día (de la reserva) |
|---|---|---|---|---|
| sáb 17 | 12:30 | N08 · mods | MODS | 18:30: una pieza de dueño (S2-D09-A, «por qué tu bot contesta dos veces lo mismo») |
| dom 18 | 12:30 | DU-01 · la cuenta de tres números | asesoría | 18:30: libre (desarrollo, de la reserva) |
| lun 19 | 12:30 | DU-02 · facturación sin fecha (F8) | FACTURA | ninguno: F8 reemplaza a los dos cortos |
| mar 20 | 18:30 | CC-01 · cuatro rondas | RONDAS | 12:30: el YouTube de la semana; la pieza de dueño, S2-D13-C («definí a tu cliente con cinco preguntas») si entra |
| mié 21 | 12:30 | CC-02 · menos tics de IA | DISEÑO | 18:30: S2-D08-C («los mensajes de tu bot que Meta no te cobra»), **antes reverificada** contra la página de precios de Meta y con «buscá ANUNCIO en Avisos» en vez de «comentá» |
| jue 22 | 12:30 | DU-03 · cotizar | asesoría | 18:30: libre |
| vie 23 | 12:30 | CC-03 · cupo de Codex | EQUIPO | 18:30: libre. **Queda sin pieza de dueño**, como el vie 16 |

- Las reservas salen de `GRABAR-2-14-OCT.md` y llevan el CTA nuevo (una acción, sin «comentá»).
- Los yaps van a las 13:30 (19:30 para CC-01) en IG Trial.
- El carrusel del día (16:00) no está en este lote: lo arma Marca personal en el estilo `fotobn`, con la palabra de la pieza del día.

## Lo que NO entra esta semana, y por qué

- **«WhatsApp ya cobra cada respuesta de tu bot» (radar, tema 2):** ya está escrito como S2-D08-C, en la reserva de esta semana. Va como su segundo video del miércoles, reverificado. Hacer otra pieza sería repetirla.
- **«Meta lanzó el WhatsApp Business MCP» (tema 1):** no se encontró el anuncio oficial de Meta (solo TechRadar y The New Stack) y es un lanzamiento gradual. Sin la fuente oficial, no se graba.
- **«WhatsApp ya trae un bot gratis: ¿para qué pago?» (dolores):** la fuente es un proveedor interesado y no está confirmado que Business AI llegue a Bolivia. Primero se mira en un WhatsApp Business con número boliviano.
- **«Dejé a mi equipo de agentes solo X horas» (tema 4):** es el molde que más rindió (1 M), pero hace falta un experimento real con su registro. El equipo que se arma esta semana puede darlo: si deja registro (tareas, horas, qué falló), se escribe para la semana del 24.
- **Cloudflare `cf` + Claude Code (Santiago, 9-oct):** instalar `cf` y publicar un sitio piden el OK de Sergio Urcullo, y es beta. Queda anotado.
- **«¿Cuál pagar, Claude o ChatGPT?» (tema 6):** P2 ya dio los planes; una tabla de precios nueva se lee el día. Queda para cuando haya un cambio de precios.
- **«Vender agentes sin entender el proceso no sirve» (tema 8):** es opinión y pide casos de asesorías reales. Se escribe cuando haya asesorías hechas.
- **Ley 1733, el IVA por fuera:** no rige hasta su decreto. DU-02 la nombra en una línea; la pieza propia, cuando salga el decreto.
- **Más piezas de mods:** las derivadas de Erik no pasaron de 1,7 mil. Sale N08 sola.
- **Serie «Una tarea, un número» 02:** se escribe solo si DU-03 sale y se mide.
