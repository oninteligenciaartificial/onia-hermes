# El documento `handoff.md` — cerrar la sesión escribiendo cinco campos

- **Video:** https://www.instagram.com/reels/DbT8hWPsyjN/ · 66,5 s · vertical · [@juanaia_](https://www.instagram.com/juanaia_/)
- **Carril B** (cuenta una idea) **con reconstrucción de producción** (el cómo está filmado
  también sirve).
- **Cobertura: audio 100% + 66 fotogramas.** [Verbatim](transcripciones/Instagram-DbT8hWPsyjN.md).
- **Veredicto: SIRVE YA** — y es raro en el corpus: **no toca un producto, toca cómo
  trabajamos nosotros.**

---

# 1 · Qué dice, en una línea

Antes de cerrar una sesión de Claude Code, pedirle que escriba `handoff.md` con **cinco
campos fijos**; después `/clear` o sesión nueva, y arrancar con *"lee handoff.md y continúa"*.

Los cinco campos, literales de la pantalla:

```
1) Objetivo
2) Estado en que terminó
3) Archivos y cambios
4) Intentos fallidos
5) Próximos pasos
```

El cuarto es el que casi nadie escribe y el que más vale: **"qué intentó y qué falló, para
que no lo vuelva a repetir"**. Un resumen automático cuenta lo que pasó; este campo existe
para que la sesión siguiente **no repita el callejón sin salida**.

---

# 2 · Filtro 1 — la fuente, y dónde exagera

| Afirmación | Tier | Por qué |
|---|---|---|
| Una sesión larga degrada la calidad de las respuestas | **VERIFICADO** | efecto conocido y observable; no necesita creerle al video |
| *"`/compact`… lo único que hace es arrastrar toda la conversación vieja"* | **DESCARTADO** | falso como mecanismo. La compactación **resume y reemplaza**; no arrastra el hilo crudo |
| *"`/compact` comprime la basura, no la saca"* (el **caption**, no el audio) | **AFIRMADO, y defendible** | el resumen es exhaustivo, no selectivo: incluye los intentos fallidos y las correcciones con el mismo peso que el resultado |
| El handoff de 5 campos deja mejor contexto que un resumen | **PRIMERA PARTE** | ver abajo: hay evidencia propia de esta misma sesión |

**El audio y el caption no dicen lo mismo, y el caption tiene razón.** Vale anotar la
corrección porque es exactamente el tipo de error que copiaríamos si tomáramos la frase
pegada.

## La evidencia de primera mano

**Esta sesión de análisis de reels se compactó.** El resumen que volvió traía el historial
completo: cada error cometido, cada corrección de Sergio, cada método descartado — todo con
el mismo peso que el estado actual. Es fiel y es largo. Un handoff de cinco campos habría
sido una fracción de eso, y la diferencia no es de tamaño: es que **alguien eligió qué
importa**. Un resumen no elige; un handoff sí.

No es un punto teórico sobre una herramienta ajena: pasó acá, en este carril, hoy.

---

# 3 · Lo que YA tenemos, y por qué igual falta

Verificado leyendo los archivos, no de memoria:

| Ya instalado | Dónde escribe | Por qué no alcanza |
|---|---|---|
| `save-session` / `resume-session` | `~/.claude/session-data/` | **fuera del repo** |
| `context-save` / `context-restore` (gstack) | `~/.gstack/sessions/` | **fuera del repo**, y arrastra un preámbulo de telemetría |
| **CLAUDE.md línea 102** — *"Al cerrar la sesión, dejar el estado escrito"* | — | **es la regla, pero sin plantilla y sin archivo.** Una regla sin artefacto se cumple "más o menos" |

Y `grep -i handoff` en el repo devuelve **solo** coincidencias de las skills de video
(`handoff` de movimiento entre escenas, otro sentido). **No existe handoff de sesión en
`onia-hermes`.**

Osea: **la regla está escrita desde hace semanas y nunca se convirtió en un archivo.** El
video no trae una idea nueva — trae **la plantilla que le falta a nuestra propia regla**, y
un detalle que las cuatro herramientas instaladas se pierden: **el archivo va en el repo**,
donde se commitea, viaja, y lo ve cualquier sesión y cualquier máquina.

Eso es lo único que hay que tomar. Lo demás ya estaba.

---

# 4 · Reconstrucción de producción — tres dispositivos, los tres replicables

Es un plano fijo de cabeza parlante con micrófono de solapa en la mano. Todo el interés
visual son **tres capas de sobreimpresión**, y ninguna necesita generación con IA.

## 4.1 · La ventana de terminal falsa — el dispositivo principal

Una ventana estilo macOS sobre el tercio inferior, **semitransparente**, que **persiste unos
25 segundos** mientras su contenido se escribe, se borra y se vuelve a escribir.

| Detalle | Valor recuperado de pantalla |
|---|---|
| Chrome | tres semáforos (rojo / amarillo / verde) arriba a la izquierda |
| Título | `Claude Code`, centrado, monoespaciada chica, gris |
| Separador | línea de 1 px bajo el título |
| Fondo | oscuro **translúcido** — se ve la mano a través |
| Esquinas | redondeadas, ~14 px |
| Prompt | el signo mayor-que, en verde |
| Argumentos | `handoff.md` en **naranja/ámbar**; el resto blanco |
| Resultado de tool | viñeta naranja + `Write(handoff.md)`, y debajo `Wrote 58 lines…` en gris apagado con el carácter de rama |
| Cursor | bloque lleno, sin parpadeo visible |

**La prueba de que es sobreimpresión y no captura de pantalla:** la mano pasa **por detrás**
del panel, y el panel **no se mueve nunca** aunque la cámara sí tiembla. Está pegado al
cuadro, no a la escena. Eso lo vuelve trivial de reproducir.

**Y el hallazgo de oficio:** la ventana **no aparece y desaparece por beat**. Es **una sola
ventana** cuyo contenido se vacía a prompt-más-cursor entre bloques (verificado en el
segundo 49). Eso da continuidad — el espectador siente una sesión, no una secuencia de
láminas.

## 4.2 · El chip de glosario — traducir la jerga sin frenar el video

Una pastilla chica, oscura, monoespaciada, arriba del cuadro:

```
context rot = contexto podrido
```

El término en inglés en rojo, el igual, y la traducción en blanco. **Aparece cuando la
palabra se dice y se va cuando el tema cambia.** Resuelve un problema que tenemos idéntico:
**explicar en español algo cuya jerga está en inglés**, sin gastar tres segundos de locución
en la definición ni dejar al espectador afuera.

Se usa dos veces: para `context rot`, y al final para el `CLEAR` del CTA.

## 4.3 · Los subtítulos, en dos registros distintos

Esto está decidido, no improvisado:

- **El gancho (0-3 s)** — texto blanco pesado con **contorno negro grueso**, sin fondo, estilo
  sticker. Más ruidoso. Y **la mascota** (el bicho pixelado terracota con ojos de mayor-que y
  menor-que) debajo.
- **El cuerpo** — pastilla oscura translúcida con esquinas redondeadas, blanco pesado,
  dos líneas centradas.

Y la regla de color: **una sola palabra coloreada por tarjeta**, y el color sale de la
paleta de la terminal (el mismo rojo, el mismo verde). No es decoración: **ata el subtítulo
con la ventana**, y es lo que hace que las dos capas se lean como un solo diseño.

---

# 5 · Reconstrucción de marketing — el molde del guion

Seis actos en 66 segundos, medidos:

| Acto | Duración | Qué hace |
|---|---|---|
| **Síntoma** | 0-4 s | nombra el dolor con una palabra fuerte |
| **Matar la solución falsa** | 4-17 s | *"`/compact` no lo arregla"* — 13 s enteros a decir por qué lo que ya hacés no sirve |
| **Giro** | 17-23 s | *"pero tranquila…"* y nombra la solución |
| **El método** | 23-45 s | los 5 campos, uno por beat, **con la terminal escribiendo en paralelo** |
| **El cierre del ciclo** | 45-61 s | qué hacés después, y el beneficio en tres palabras |
| **CTA** | 61-66 s | *"comenta CLEAR"* |

**Lo contraintuitivo: el acto 2 es el más largo.** Un cuarto del video se va en explicar por
qué la solución que ya conocés no alcanza. Sin ese acto, el método suena a una alternativa
más; con él, suena a la única. Es un molde nuevo para el banco — los que teníamos abren
con la solución.

**Y el CTA comentario→DM aparece otra vez.** Ya está documentado desde la tanda del 09-ago
como hallazgo transversal, sigue bloqueado por el token de IG (S6) y sigue funcionando a
mano. Nada nuevo, pero suma una aparición más.

---

# 6 · Lo que NO se copia

- **El registro.** El insulto del gancho y el trato en femenino singular (*"tranquila"*) son
  de su personaje. Onia le habla a un dueño de negocio boliviano.
- **La cifra `Wrote 58 lines`** es utilería: está escrita en la sobreimpresión, no capturada.
  Si reproducimos el formato, el número tiene que salir de una corrida real.
- **La afirmación sobre `/compact`.** Si hacemos esta pieza, se dice lo del caption
  ("comprime todo, no elige"), no lo del audio.

---

# 7 · A dónde va

| Frente | Qué se lleva | Prompt |
|---|---|---|
| **`pendiente`** (método / CLAUDE.md) | el estándar `HANDOFF.md` en el repo, con los 5 campos, cerrando la regla de la línea 102 | **N1** |
| **`editor de videos`** | la ventana de terminal falsa como componente HyperFrames reusable | **N2** |
| **`editor de videos`** | el chip de glosario + el sistema de subtítulos en dos registros | **N3** |

Los tres están en [PROMPTS_LOTE_2026-08-22.md](PROMPTS_LOTE_2026-08-22.md).
