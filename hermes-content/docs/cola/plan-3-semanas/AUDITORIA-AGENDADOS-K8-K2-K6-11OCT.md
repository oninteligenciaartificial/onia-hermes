# Control de los carruseles agendados K8 · K2 · K6 (11-oct)

Pedido de la MADRE MARKETING el 11-oct: pasarle a los tres carruseles que siguen agendados en el VPS el mismo control que encontró la falla de K4. Cada dato contra su fuente, el cierre «Comentá» cambiado a «Buscá X en Avisos» con su aviso existente, y `validar-calendario.js` en verde. **No se tocó el VPS**: el reemplazo lo hace la madre con el OK de Sergio Urcullo.

## Resumen

| Día (La Paz) | Agendado hoy en el VPS | Corregido, listo para mostrar | Falla encontrada | Qué cambió |
|---|---|---|---|---|
| mar 13 · 16:00 | K8 v3 «Recuperar vs reconstruir» (PROMPT) | **K8 v4** · `hermes-content/carousels/out/sergio-k8v4-recuperar-vs-reconstruir-20261011/` | Ningún dato falso. Dos precisiones y el cierre | Cierre «Buscá PROMPT»; caption: «el modelo (si no está rotulado)»; bloque 7 «Técnica: cámara y luz» (igual al recurso) |
| jue 15 · 16:00 | K2 v3 «Tu primera skill» (SKILL) | **K2 v4** · `hermes-content/carousels/out/sergio-k2v4-primera-skill-20261011/` | **Una afirmación sin respaldo**: «Si es vaga, no la usa nunca» (lámina 3) | Lámina 3 según la doc; cierre «Buscá SKILL» |
| vie 16 · 16:00 | K6 v2 «Las 2 listas del bot» (PROMESA) | **K6 v3** · `hermes-content/carousels/out/sergio-k6v3-confirmado-por-confirmar-20261011/` | **Una omisión** (el nombre de la lista en la prueba) y **una frase que se contradice con la prueba** (lámina 6) | Caption aclara «NO confirmado» vs «Por confirmar»; lámina 6 sin causalidad; cierre «Buscá PROMESA» |

Los briefs corregidos están en `hermes-content/carousels/briefs/marca-personal/` (`sergio-k8v4-…-20261011.json`, `sergio-k2v4-…-20261011.json`, `sergio-k6v3-…-20261011.json`). Las imágenes y el resto de las láminas son las mismas que las agendadas: no hubo gasto. (Las imágenes de arcilla son del estilo retirado el 8-oct; rehacerlas en `fotobn` cuesta créditos y es decisión de Sergio Urcullo, ver `lote-14-imagenes.json`.)

## K8 · PROMPT · Recuperar vs reconstruir

| Afirmación | Fuente | Veredicto |
|---|---|---|
| «Unos 58 reels que analicé, varios con el prompt en pantalla» | `.claude/skills/sacar-prompt/SKILL.md` l.8 («~58 reels analizados, varios de los cuales mostraban el prompt en pantalla») | ✓ |
| Un solo cuadro del reel mostraba el prompt; con muestreo grueso se pierde | Misma skill, «Paso 0»: «en un reel el prompt apareció en un solo cuadro» | ✓ |
| Paso 0: láminas, descripción, cuadros con texto | Misma skill, «Paso 0» | ✓ |
| Recuperar vs reconstruir y la frase «no es el prompt original, es uno que produce algo parecido» | Misma skill, «La distinción que ordena todo» | ✓ |
| Los 8 bloques, en orden | Skill, «Los 8 bloques» y recurso `hermes-content/docs/cola/drops/AVISOS-POR-DIA.md` (sección PROMPT, l.1090: «7 Técnica (cámara, luz) · 8 Negativo») | ✓ (el bloque 7 decía «Técnica de cámara»; ahora «Técnica: cámara y luz», como el recurso) |
| Lo que la imagen no te dice: modelo, referencia, intentos, seed | Skill, «Lo que NO se recupera mirando» (el modelo, «si no está rotulado») | ✓ en las láminas; **el caption lo decía sin la condición** → corregido |
| Generá una y ponela al lado de la original | Consejo mío. La skill solo dice que la reconstrucción «se pudo comparar contra el original» | consejo, no dato |
| Cierre: la plantilla de los 8 bloques y el negativo base | El aviso PROMPT existe (`AVISOS-COMUNIDAD-8-16-OCT.md` l.269); el recurso con los 8 bloques y el negativo base está en `AVISOS-POR-DIA.md` l.1090 | ✓ — **el recurso no está en el archivo que lee el validador**: se pega desde `AVISOS-POR-DIA.md` |

## K2 · SKILL · Tu primera skill en 5 pasos

| Afirmación | Fuente | Veredicto |
|---|---|---|
| Va en `.claude/skills/<nombre>/SKILL.md` | https://code.claude.com/docs/en/skills (leída el 11-oct): «`.claude/skills/<skill-name>/SKILL.md`», «Every skill needs a `SKILL.md` file» | ✓ («en mayúsculas» describe cómo se escribe el nombre; la doc no dice si distingue mayúsculas) |
| `name` y `description` entre dos líneas `---` | Misma página: `name` («Defaults to the directory name») y `description` («Claude uses this to decide when to apply the skill») | ✓ — son lo recomendado, no obligatorios: «All fields are optional. Only `description` is recommended» |
| «Claude la lee para decidir si usar tu skill. **Si es vaga, no la usa nunca.**» | La doc dice que `description` sirve para decidir cuándo aplicarla; **no dice que una vaga «nunca» se use** | ✗ **sin respaldo** → «Claude la lee para decidir cuándo usar tu skill. Decile qué hace y cuándo usarla.» |
| La prueba: escribí `/skills` | La doc: «Run `/skills` in your session» (lo describe junto a las skills sincronizadas de claude.ai) y `name` aparece en el menú `/` | ✓ por la doc. Sin correrlo en una sesión con una skill de proyecto: **medición pendiente (PC)** |
| `onia-continuidad`, nació el 31 de agosto | Commit `ac8ffe513`, 2026-08-31, «feat(skill): onia-continuidad» | ✓ |
| La description empieza «Invocar al ARRANCAR cualquier sesión de ONIA…» | `.claude/skills/onia-continuidad/SKILL.md`, `description` | ✓ literal |
| Seis cosas planificadas, cuatro ya hechas o decididas (4/6) | Misma skill, «Por qué existe»: «Planifiqué 6 features. 4 no existían — ya estaban hechos o ya estaban decididos» | ✓ — era una de las **cuatro** fallas medidas ese día; «de ahí nació» queda como en el guion D01-A aprobado |
| Cierre: el video para armar tu primera skill | El aviso SKILL existe (`AVISOS-COMUNIDAD-8-16-OCT.md` l.518) y entrega el video 02 (`https://sergiourcullo.vercel.app/claude-code`, YouTube `oXaqV-HDufA`). Medido hoy: la página responde 200 y el oEmbed de YouTube responde 200 con el título «Cómo instalar CLAUDE CODE desde cero (+ tu primera skill)» | ✓ — el video **no es privado**; el oEmbed no distingue público de no listado, así que lo que el aviso deja a Sergio Urcullo («confirmar que ese video es público») sigue en pie |

## K6 · PROMESA · Las dos listas del bot

| Afirmación | Fuente | Veredicto |
|---|---|---|
| Prueba del 28-sep con Sonnet 5.5, una corrida por caso | `AVISOS-POR-DIA.md` 5-3 («Sonnet 5.5, una corrida por caso») y `GRABAR-10-16-OCT.md` l.769 | ✓ |
| Negocio de ejemplo inventado; el cliente pide 200 cajas con logo para este viernes | `AVISOS-POR-DIA.md` 5-3 (Cajas Kuska «inventado para la prueba») | ✓ |
| Sin listas no prometió: «No quiero prometerte una fecha que después no te pueda cumplir»; pidió medidas, logo y zona | Misma sección, respuesta 1 | ✓ literal |
| Con las dos listas: «200 unidades está dentro de lo que trabajamos (hacemos desde 50)»; el plazo lo confirma con el equipo | Misma sección, respuesta 2 | ✓ literal |
| «Ninguna de las dos versiones prometió» | Misma sección: «Ninguna prometió. La segunda usó el dato confirmado» | ✓ |
| La plantilla (regla + «Confirmado» + «Por confirmar») | Misma sección, «La plantilla para tu bot» | ✓ — **pero en la prueba la segunda lista se llamó «NO confirmado»**, no «Por confirmar»; el caption no lo decía → agregado |
| Lámina 6: «Si la confirma sin tenerla escrita, **le faltan las dos listas**» | La propia prueba: **sin listas tampoco prometió** (1 corrida) | ✗ insinuaba una causa que la prueba no mostró → «escribile las dos listas y probá de nuevo» |
| Lámina 7: «La lección no es que la IA inventa: lo que no escribiste en sus listas, no lo puede saber» | Lectura mía de la prueba | consejo, no dato |
| Cierre: «las dos respuestas y la plantilla» | `AVISOS-POR-DIA.md` 5-3: las respuestas están **recortadas con `[…]`** y las completas no están en el repo | ✗ el cierre prometía de más → «La prueba y la plantilla», igual que el aviso PROMESA (`AVISOS-COMUNIDAD-8-16-OCT.md` l.253). La flecha de la lámina 7 también decía «las dos respuestas» → «la prueba» |

## Los tres cierres

Antes: `Comentá X y te paso el link…` (promete un DM por comentario que Meta rechazó 2 veces). Ahora: **«Buscá PROMPT / SKILL / PROMESA en Avisos de la comunidad · link en mi perfil»**, con una línea arriba que dice qué hay adentro («La plantilla de los 8 bloques.» · «El video para armar tu primera skill.» · «La prueba y la plantilla.») y el mismo texto al final del caption. Las tres palabras existen como `## PALABRA ·` en `AVISOS-COMUNIDAD-8-16-OCT.md` (l.269, l.518, l.253).

**Condiciones para publicar con ese cierre:** el link de la comunidad tiene que estar en el perfil de Instagram (K4 v3 y K7 v3 dependen de lo mismo); para SKILL, que Sergio Urcullo confirme que el video 02 es público.

## Qué hay que cambiar en el VPS (lo decide la madre / Sergio Urcullo)

Los timers se llaman `pub-car-<fecha>` (no se tocaron):

| Timer | Pieza | Reemplazar | Antes de |
|---|---|---|---|
| `pub-car-20261013` | K8 v3 → **K8 v4** | `slide-08.png`, `caption.txt` (y `slide-06.png`: bloque 7) | mar 13 · 16:00 La Paz (20:00 UTC) |
| `pub-car-20261015` | K2 v3 → **K2 v4** | `slide-03.png`, `slide-08.png`, `caption.txt` | jue 15 · 16:00 La Paz |
| `pub-car-20261016` | K6 v2 → **K6 v3** | `slide-06.png`, `slide-07.png`, `slide-08.png`, `caption.txt` | vie 16 · 16:00 La Paz |

Las demás láminas son idénticas a las agendadas. Si se prefiere no reemplazar nada, la alternativa mínima es la misma de K4/K7: cambiar solo el cierre y la frase de K2 lámina 3.

## Verificación

- Validador del calendario: ver la salida pegada en el mensaje a la madre (VERDE; el único aviso es ANTIGRAVITY, que sigue en borrador).
- Contact sheets de los tres renders, miradas el 11-oct (`_contactsheet.png` en cada carpeta `out/`).
- Segunda revisión independiente (subagente haiku, solo lectura) de todos los datos de arriba: resultado al final.
