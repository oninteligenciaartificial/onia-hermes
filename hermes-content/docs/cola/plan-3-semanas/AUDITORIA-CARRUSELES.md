# Auditoría de carruseles de la marca personal

Pedido de Sergio Urcullo, 10-oct (por la madre): *«los carruseles hay que analizar qué enseñan o qué dicen»*. Hecha el 10-oct leyendo el texto de cada lámina en su brief (`hermes-content/carousels/briefs/marca-personal/`) y el cierre de su caption. No se miró el render: se auditó lo que dicen, no cómo se ven.

**Alcance:** los 7 agendados del sáb 10 al vie 16-oct (en el VPS, `pub-car-AAAAMMDD`) y 12 más renderizados (la última versión de cada tema). Las versiones anteriores (v1, v2, opciones de estilo K1) no se auditan.

**Cómo se leyó cada columna**
- **Qué enseña**: la idea de la pieza en una línea, con lo que de verdad dice.
- **Aplicable**: lo que alguien se lleva y puede usar hoy sin pedir nada más: un paso, un comando, un número, una lista, una plantilla. «Nada sin el recurso» = el carrusel nombra la cosa pero la parte útil está detrás del cierre.
- **Cierre → recurso**: la palabra de la lámina final y si existe su aviso escrito en `AVISOS-COMUNIDAD-8-16-OCT.md` (que Sergio Urcullo pega en la comunidad). ✓ escrito · ⚠ borrador con `[CONFIRMAR]` · ✗ no existe.
- **Veredicto**: ✓ enseña algo concreto · ◐ enseña, pero algo lo limita · ✗ no enseña nada concreto.

## A. Agendados (sáb 10 → vie 16)

| Día | Carrusel | Qué enseña | A quién le sirve | Aplicable | Cierre → recurso | Veredicto |
|---|---|---|---|---|---|---|
| sáb 10 | **K11 · el hook que commitea solo** | Cómo armar un hook Stop en Claude Code y la guarda de dos comandos contra un merge a medias; el caso de los 17 archivos con conflictos. | Quien usa Claude Code con git | Sí: la ruta (`.claude/settings.json`), los 2 comandos de la guarda y cómo probarla con un conflicto de prueba | HOOK → ✓ | ✓ |
| dom 11 | **N06 · Gemini CLI → Antigravity** | Gemini CLI gratis dejó de responder el 18-jun; Antigravity CLI lo reemplaza; las skills del proyecto no se mudan solas (`.gemini/skills` → `.agents/skills`). | Quien usaba Gemini CLI | Parcial: la ruta de las skills y `/skills` para comprobar; el comando de instalación está en una captura | ANTIGRAVITY → ⚠ borrador | ◐ depende de verificar el aviso |
| lun 12 | **K4 v2 · 5 pruebas antes de activar tu bot** | Cinco pruebas para el bot de WhatsApp: cómo escriben los clientes, el mismo aviso dos veces, lo que no sabe (si inventa, no se activa), un audio, «quiero hablar con una persona». | Dueño o armador de un bot de WhatsApp | Sí: la lámina 7 es la lista de las 5 pruebas | PRUEBAS → ✗ | ◐ enseña bien; el recurso no existe |
| mar 13 | **K8 v3 · sacar el prompt de una imagen** | Primero buscar si el prompt ya está escrito (láminas, descripción, cuadros del video); si no, reconstruirlo con 8 bloques y decir que es reconstruido. | Quien arma imágenes o videos con IA | Sí: los 8 bloques y qué no se puede saber de una imagen | PROMPT → ✓ | ✓ |
| mié 14 | **K7 v2 · carruseles por código en 5 pasos** | Cómo Sergio Urcullo arma sus carruseles: brief en JSON, la IA pinta solo el objeto, las fuentes necesitan 10 s, mirar todas juntas, cotizar antes de generar. | Casi nadie: describe su proceso interno | Poco: no muestra el JSON, ni un comando, ni qué herramienta; el «10 segundos» es un detalle de su script | BRIEF → ✗ | **✗ flojo** |
| jue 15 | **K2 v3 · tu primera skill en 5 pasos** | Una skill es una carpeta con `SKILL.md`, `name` y `description`; la description decide si Claude la usa; cómo comprobar que cargó con `/skills`. | Quien empieza con Claude Code | Sí: carpeta, archivo, qué va arriba, cómo probar y cuál elegir primero | SKILL → ✓ (apunta al video) | ✓ |
| vie 16 | **K6 v2 · las 2 listas del bot (confirmado / por confirmar)** | Un bot sin listas no prometió; con «confirmado» y «por confirmar» respondió sin inventar fecha: el caso de las 200 cajas, probado con Sonnet 5.5. | Dueño de un negocio con bot | Sí: las dos listas, la regla y la prueba (pedido con fecha) | PROMESA → ✓ | ✓ |

## B. Renderizados, no agendados

| Carrusel | Qué enseña | A quién le sirve | Aplicable | Cierre → recurso | Veredicto |
|---|---|---|---|---|---|
| **K1 v3 · Opus 5.5 o Sonnet 5.5** | Precios (4/20 y 2/10 USD por millón), pruebas casi empatadas, y la regla: Sonnet a diario, Opus cuando equivocarte sale caro. | Quien elige modelo | Sí: los precios y la regla | «El ejercicio está en la comunidad», **sin palabra** ✗ | ◐ falta la palabra y el recurso |
| **K3 v2 · CLAUDE.md con la historia de cada regla** | Una regla con su caso se obedece; estructura de 3 partes; ordenar por cuándo se necesita; menos de 200 líneas. | Quien usa Claude Code en un proyecto | Sí: la forma de la regla y 4 pasos para empezar hoy | HISTORIA → ✓ | ✓ |
| **K5 v2 · 4 reglas de un seguimiento que no molesta** | Ventana de 24 h, solo plantilla después, nada de madrugada, no escribirte a vos mismo; error 131047. | Quien manda seguimientos por WhatsApp | Sí: los horarios, el margen de 4 h y el error a buscar | VENTANA → ✓ | ✓ |
| **K9 v2 · 5 revisiones antes de publicar un video con IA** | Que la IA edite no la hace corregir: revisar la tabla de cortes, leer el texto, difuminar terceros, cotizar antes de generar. | Quien edita video con IA | Poco: son recordatorios generales sin un comando, una plantilla o un ejemplo | REVISAR → ✗, y promete «mi editor de IA paso a paso», que no existe | **✗ flojo** |
| **K10 v2 · la perilla de esfuerzo** | `/effort`, los 5 niveles, «más bajo no es peor» y cuándo subir; cómo probar con `claude --effort`. | Quien usa Claude Code | Sí: el comando y la regla por nivel | EFFORT → ⚠ borrador | ◐ depende del aviso |
| **K12 · worktrees sin pisarse** | Una carpeta por sesión con `git worktree`; `git -C <ruta>` en todo; `git reflog` para recuperar; el caso de los 424 commits. | Quien corre dos sesiones de Claude Code | Sí: los comandos | WORKTREE → ✓ | ✓ |
| **K13 · Claude Code en un servidor sin API key** | El corredor del loop: flock, carpeta verificada, aviso con tope; las 5 trampas (la API key vieja, `--allowedTools`, el cron en UTC). | Quien programa loops en un servidor: un público muy angosto | Parcial: la trampa de la API key y el flock; el resto es detalle | ESQUELETO → ✗ | ◐ público angosto y sin recurso |
| **N02 · Sonnet 4.5 se apaga el 30-nov** | Buscar el modelo viejo, migrar con `/claude-api migrate`, los 5 ajustes que da error 400 y cómo probar. | Dueño con un bot hecho con Claude y quien lo arma | Sí: la búsqueda, el comando y los ajustes | MIGRAR → ✓ | ✓ |
| **N03 · modo auto de Claude Code** | Qué bloquea y qué deja pasar por defecto; cómo volver a manual (Shift+Tab, `defaultMode`); tu proyecto manda sobre el global. | Quien usa Claude Code | Sí: cómo cambiar el modo | COMUNIDAD → ✓ | ✓ (ya se publicó el 9-oct) |
| **N04 · la skill verify** | Una skill llamada `verify` se corre antes de commitear; los 3 pasos; no es un candado; ya existe un `/verify`. | Quien usa Claude Code | Sí: ruta, estructura y chequeos | VERIFY → ✓ | ✓ |
| **DD-A · OpenAI Sol cuesta un quinto, y la caché 20 veces menos** | Los precios, cómo aprovechar la caché (lo fijo primero, mínimo 1.024 tokens) y mirar `cached_tokens`. | Quien arma un bot con la API de OpenAI | Sí: los pasos y el campo a mirar | CACHE → ✓ | ✓ |
| **Los 5 archivos antes de programar con IA** | `CLAUDE.md`, `AGENTS.md`, `.claude/skills/`, el handoff y la tarea de Codex: nombre y función de cada uno. | Quien trabaja con agentes de código | Nada sin el recurso: nombra los 5 pero no muestra uno | ARCHIVOS → ✓ (borrador, sin publicar) | ◐ todo el valor está detrás del cierre |

## Resumen

- **✓ enseñan algo concreto y su recurso existe:** K11, K8 v3, K2 v3, K6 v2, K3 v2, K5 v2, K12, N02, N03, N04, DD-A. **11 de 19.**
- **◐ enseñan, pero algo los limita:** N06 y K10 (aviso en borrador), K4 (enseña bien, sin aviso PRUEBAS), K1 (sin palabra de cierre), K13 (público angosto, sin aviso), 5 archivos (todo el valor está detrás del cierre). **6.**
- **✗ no enseñan nada concreto: K7 v2 (BRIEF) y K9 v2 (REVISAR).** Describen un proceso propio sin entregar algo para copiar, y sus cierres prometen un recurso que no existe («el JSON de este carrusel», «mi editor de IA»).
- **Cierres sin recurso escrito (✗):** PRUEBAS, BRIEF, REVISAR, ESQUELETO, y K1 sin palabra. Con aviso en borrador: ANTIGRAVITY y EFFORT.
- **Cierre «Comentá X y te paso el link»:** promete un mensaje directo automático que no está probado (`CLAUDE.md`: Meta rechazó 2 veces ese tipo de mecanismo). Lo llevan N03, que salió el 9-oct en LinkedIn y TikTok (en Instagram falló por la restricción de la cuenta), K11 (sáb 10) y los 6 agendados que siguen.

## Qué proponemos (pendiente de la receta y el brief de la madre)

1. **K7 v2 (mié 14, BRIEF):** rehacerlo con la receta del carrusel de referencia, o cambiarlo de lugar por uno que enseñe: K5 v2 VENTANA (✓) calza ese día con el video S2-D07-A, que habla de la regla de las 24 h.
2. **K9 v2 (REVISAR):** no agendarlo así. Rehacerlo con un ejemplo real (la tabla de cortes de una pieza, con sus filas) o archivarlo.
3. **K4 v2 (lun 12, PRUEBAS):** el carrusel está bien; falta escribir el aviso PRUEBAS (la lista de las 5 pruebas ya está en su lámina 7).
4. **Cierre de los agendados:** cambiar «Comentá X» por «Buscá X en Avisos · link en mi perfil» solo donde el aviso existe: martes PROMPT, jueves SKILL, viernes PROMESA. Domingo ANTIGRAVITY, cuando la madre verifique el aviso.
5. **K1, K13, 5 archivos:** no se agendan hasta tener palabra y aviso (K1), un público más amplio (K13) o un ejemplo en la lámina (5 archivos).

*Fuente de cada fila: el brief JSON del carrusel y `AVISOS-COMUNIDAD-8-16-OCT.md`. Si cambia un aviso o un brief, se edita esta tabla; no se crea otra con fecha.*
