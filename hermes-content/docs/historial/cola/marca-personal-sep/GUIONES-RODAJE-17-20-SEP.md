# Guiones de rodaje · jue 17 → dom 20 sep — la semana desarrollada de una vez

> Pedido de Sergio Urcullo (17-sep): *"dame los guiones y con sus estructuras,
> presentaciones explicativas para yt, y ordenalos para darme exactamente lo mismo para
> toda la semana y desarrollarla toda hoy"*.
>
> Fuente de los temas: [`PLAN-VIDEOS-11-20-SEP.md`](PLAN-VIDEOS-11-20-SEP.md). Este doc
> los baja a **formato rodaje** (regla del 12-sep: HABLA / EN PANTALLA / OVERLAY, y cada
> video ENSEÑA una función, app o repo). Reglas vivas: cada corto empuja a UN recurso y
> cierra alternando comentario ↔ comunidad; los de IA nombran **Claude, Claude Code,
> skill, hook, agente, loop, subagente** — nada de "la IA" genérica.

## La estructura fija de TODOS los cortos (no se toca)

```
0-3 s    GANCHO       una frase. Sin "hola", sin "hoy les traigo"
3-25 s   LO CONCRETO  qué es, qué hace, qué NO hace — con pantalla real
25-35 s  CIERRE       UN recurso + comentario O comunidad (alternado)
```

> 🔴 **Reparto de Sergio Urcullo (17-sep): la EDICIÓN se hace en OTRA sesión.** Este
> carril entrega solo contenido: guiones, decks, estructuras y captions. La receta de
> abajo queda como referencia para la sesión de edición, no como tarea de ésta.

## La receta de edición — método verificado en la sesión «edicion» de Codex (14-sep)

Codex editó el reel **Fable 5.1 vs GPT-6 Astra** con este pipeline, y es el molde de
edición de todos los cortos de la semana:

1. `ffprobe` del crudo → medidas reales.
2. **faster-whisper** (`small`, cpu, int8) → transcripción con tiempos por frase.
3. Script `edit.py` con ffmpeg: **cara a ancho completo abajo** (`crop=1080:1500` → pad
   a 1080×1920, fondo `0x111219`), **mockup/pantalla grande ARRIBA mientras habla**,
   **transiciones laterales suaves** entre pantallas, **subtítulos ASS** quemados,
   pausas recortadas, audio normalizado. 30 fps, ~32 s.
4. Verificación MIRANDO: contact sheet de frames (`tile=4x2`) + frames puntuales.

Piezas: `C:\Users\PC\Downloads\astra-fable-social-edit\edit.py` (adaptar por corto) y
los precedentes del repo en `videos/` (claude-vs-claudecode, onia-community-teaser).

⚠️ **El reel Fable vs Astra quedó editado el 14-sep y sin publicar**
(`Downloads/video fable 5.1 vs gpt 6 astra - reel editado.mp4`, 32 s). Es material de
benchmarks: sale YA como el "serio de IA" de un día de esta semana o se tira — la cola
de noticias no espera.

---

# JUEVES 17 · día Claude Code

**Orden del día:** ① subir YT 03 → ② carrusel DUELO CUADERNO (feed) → ③ cortos → ④ drop D4.

- **YT 03 se publica HOY** (verificado en el canal: no está). Título:
  «Hago que la IA trabaje mientras duermo — así está armado». Deck+guion:
  `carousels/out/yt-claude-code-automatizacion/`. Descripción lista:
  [`SERIE_CLAUDE_CODE_DESCRIPCIONES.md`](../SERIE_CLAUDE_CODE_DESCRIPCIONES.md) §03
  (completar minutos de capítulos con el render final).
- **Carrusel DUELO CUADERNO** → `@sergiourcullo`, paquete
  `carousels/out/4-IG-DUELO-CUADERNO-para-publicar.zip`. 🔴 Caption obligatorio
  ([doc](PARA-PUBLICAR-APPLE-DUELO-CUADERNO.md)): las tres preguntas viven ahí.
- **Drop D4** ya escrito: [`drops/2026-09-17.md`](drops/2026-09-17.md) — pegar el link
  del YT 03 en el hueco marcado antes de mandarlo.
- El corto-drop del día («Esto no es el chat de IA…») ya está escrito:
  [`GUIONES-SEMANA-1-MI-STACK.md`](GUIONES-SEMANA-1-MI-STACK.md) §4.

## 17.1 🎥 «Claude Code por dentro» — el "normal" del feed hoy

*Enseña: el ciclo real pedido → lectura → diff → aprobación. Trailer del YT 03 (publicado hoy).*

| Seg | HABLA (literal) | EN PANTALLA (arriba, grande) | OVERLAY |
|---|---|---|---|
| 0-3 | «Le pido cosas a mi computadora por escrito. Y las hace. Mirá qué pasa por dentro.» | terminal con `claude` recién abierto | `POR DENTRO` |
| 3-10 | «Esto es Claude Code. Le escribo: "agregá los horarios nuevos a mi web". Lo primero que hace no es escribir: es LEER mis archivos.» | el pedido tipeado en vivo + lista de archivos leídos | `1 · LEE` |
| 10-18 | «Después me muestra el cambio, línea por línea. Verde lo que entra, rojo lo que sale. Y acá está la parte que nadie cuenta:» | el diff en pantalla | `2 · PROPONE` |
| 18-25 | «no toca NADA sin que yo apruebe. Cada cambio pasa por este botón. La IA propone; el que decide sigo siendo yo.» | el prompt de aprobación, y tu tecla aprobando | `3 · VOS APROBÁS` |
| 25-32 | «Hoy subí el video completo: cómo lo dejo trabajando solo — con hooks y subagentes. Está en mi canal de YouTube, link en el perfil.» | portada del YT 03 | `EL VIDEO COMPLETO · HOY` |

**Cierre:** recurso = YT 03. Sin pedido de comentario (el 17.2 lo lleva).

## 17.2 🎥 «Skills: enseñale TU forma de trabajar, una vez»

*Enseña: qué es una skill (archivo de texto) y una real en uso. Trailer del futuro
«Escribí tu primera skill».*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «A mi IA le enseñé cómo trabajo UNA vez. No se lo repito nunca más.» | carpeta `.claude/skills/` abierta | `UNA VEZ` |
| 3-12 | «Esto es una skill de Claude Code. No es magia: es un archivo de texto donde escribís tus reglas — tus precios, tu forma de responder, lo que está prohibido.» | un SKILL.md real scrolleando (el de propuestas) | `ES UN ARCHIVO DE TEXTO` |
| 12-22 | «La mía de propuestas sabe mis precios y mis condiciones. Le digo el nombre del cliente y arma la propuesta como la armaría yo. Sin la skill, tendría que explicarle todo, todas las veces.» | invocás la skill en vivo, sale el resultado | `MIS PRECIOS · MIS REGLAS` |
| 22-30 | «Cómo escribir la tuya está en la guía de mi web, con el paso a paso. ¿Y vos qué le enseñarías primero? Leo todos los comentarios.» | `/claude-code` en el teléfono | `sergiourcullo.vercel.app/claude-code` |

**Cierre:** recurso = `/claude-code` + **pedido de comentario**.

## 17.3 «Una IA que toca tus archivos necesita reglas ESCRITAS»

*Enseña: el CLAUDE.md — el archivo de reglas. Pega con el drop D4 (entrega el ejemplo).*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Mi IA tiene un contrato escrito. Te leo tres cláusulas.» | un CLAUDE.md abierto | `EL CONTRATO` |
| 3-12 | «Una: prohibido tocar plata — prepara el cobro, el botón lo aprieto yo. Dos: verificar es MIRAR — un "listo" no prueba nada, la pantalla se abre y se mira.» | las dos reglas resaltadas en el archivo | `1 · PLATA NO` / `2 · MIRAR` |
| 12-22 | «Tres: cada regla lleva la historia de por qué existe. Porque una regla suelta se desobedece — con el error que la originó al lado, no. Esto vale para la IA y vale para la gente.» | la tercera regla con su historia al lado | `REGLA + HISTORIA` |
| 22-30 | «El archivo se llama CLAUDE.md, y hoy dejé el mío de ejemplo —vaciado, para tu negocio— en mi comunidad. Link en el perfil.» | el archivo de la comunidad | `HOY EN LA COMUNIDAD` |

**Cierre:** recurso = comunidad (drop D4).

## 17.4 · Pool: `anthropics/skills`

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Anthropic regala las instrucciones oficiales de su IA en GitHub. Gratis.» | github.com/anthropics/skills | `GRATIS · OFICIAL` |
| 3-15 | «Se llama anthropics barra skills. Son las skills oficiales de Claude: las abrís y son texto — las podés LEER antes de instalar. Eso con casi ningún programa se puede.» | abrís una skill, se ve que es texto legible | `LEELO ANTES DE INSTALAR` |
| 15-25 | «Y no se bajan a mano: desde adentro de Claude Code las buscás y las instalás. Queda para todos tus proyectos.» | la instalación en vivo | `SE INSTALA DESDE ADENTRO` |
| 25-30 | «El nombre exacto te lo dejo fijado en el primer comentario.» | el repo otra vez | `📌 PRIMER COMENTARIO` |

---

# VIERNES 18 · día HyperFrames · 📌 se elige el tema de la semana del 21

- **B-roll del día:** HTML → MP4 en pantalla dividida (el corto 18.1 lo genera).
- **Drop D5** ya escrito: [`drops/2026-09-18.md`](drops/2026-09-18.md) (composición mínima).
- Corto-drop ya escrito: `GUIONES-SEMANA-1-MI-STACK.md` §5 («Este video lo hizo un archivo de texto»).
- **Decisión del día:** tema del motor semana 2 → propuesta: **«Qué automatizar
  primero»** (7 drops de reserva ya escritos; el 20.3 la alimenta con casos reales).
- **YT:** grabar el **04** este finde (deck+guion listos, ≈8:00) para publicarlo el
  **jue 24** — jueves es el día Claude Code del canal.

## 18.1 «Mi feed lo produce un sistema, no una persona»

*Enseña: el reparto real código / IA / criterio, con el generador en pantalla.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Todo lo que ves en este perfil lo produce un sistema. Te muestro el reparto de verdad.» | tu feed scrolleando | `EL REPARTO REAL` |
| 3-12 | «El código hace lo repetido: este script me genera las placas de los ocho videos en una corrida. Y esto otro convierte una página HTML en un MP4 — se llama HyperFrames, es gratis.» | el script corriendo + HTML→MP4 lado a lado | `CÓDIGO = LO REPETIDO` |
| 12-22 | «La IA escribe borradores y edita. Pero el criterio no se delega: de las últimas ocho piezas que produjo el sistema, tres las tiré. El sistema produce; yo decido qué sale.» | la carpeta con piezas, tres marcadas descartadas | `8 HECHAS · 3 TIRADAS` |
| 22-30 | «El molde de video que uso está hoy en mi comunidad, listo para cambiarle el texto. Link en el perfil.» | la composición mínima | `LA PLANTILLA · HOY` |

**Cierre:** recurso = comunidad (drop D5).

## 18.2 «Dónde la IA suma en video — y las dos cosas que tiene prohibidas»

*Enseña: transcripción + corte de silencios + subtítulos automáticos (el pipeline real).*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «La IA edita todos mis videos. Pero tiene dos cosas prohibidas.» | línea de tiempo con cortes | `2 PROHIBIDAS` |
| 3-13 | «Lo que SÍ hace: me transcribe el video con los tiempos de cada frase, corta los silencios y las muletillas, y quema los subtítulos. Eso antes era una tarde; ahora son minutos.» | la transcripción generándose + un silencio cortándose | `TRANSCRIBE · CORTA · SUBTITULA` |
| 13-23 | «Lo prohibido: mi cara generada y mi voz clonada. Si me ves hablando, soy yo. La edición se automatiza; la confianza no. Ese es el trato con el que mira.» | tu cara real a ancho completo | `SI ME VES, SOY YO` |
| 23-30 | «¿Vos usarías un clon tuyo para tus redes? Contame en los comentarios — hay buenos argumentos de los dos lados.» | — | `¿USARÍAS TU CLON?` |

**Cierre:** pedido de comentario.

## 18.3 «La IA como empleado: cuánto rinde, y la cuenta»

*Enseña: la cuenta producción vs costo. Los números se cuentan EL DÍA de grabar.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Mi "empleado" cuesta 200 dólares al mes. Esto es lo que produjo este mes.» | — | `$200/MES` |
| 3-15 | «[Recontar el día]: un sistema en producción, mi web entera, los videos de este perfil, los flujos que corren solos y el agente que vigila de noche. Todo salió de la misma suscripción.» | ráfaga: sistema, web, feed, flujo n8n, aviso | lista apilándose |
| 15-24 | «Lo honesto: no sabe qué vale la pena hacer. Eso sigo siendo yo. Le pago por ejecutar, no por decidir — y por eso rinde.» | vos a cámara, sin pantalla | `EJECUTA ≠ DECIDE` |
| 24-30 | «La cuenta completa de mi stack, herramienta por herramienta, está en la guía de mi web. Link en el perfil.» | `/stack` scrolleando | `sergiourcullo.vercel.app/stack` |

**Cierre:** recurso = `/stack`.

## 18.4 · Pool: Plugins oficiales — o el reel Fable vs Astra si no salió aún

Guion pool: «Casi todo lo que ibas a construir ya está escrito, gratis» — pantalla:
`anthropics/claude-plugins-official`, instalar uno en vivo, cierre 📌 comentario fijado.

---

# SÁBADO 19 · día Hermes (agentes)

- **B-roll del día:** el aviso real de las 3:00 AM, con la hora visible.
- **Drop D6** ya escrito: [`drops/2026-09-19.md`](drops/2026-09-19.md) (plantilla `SOUL.md`).
- Corto-drop ya escrito: `GUIONES-SEMANA-1-MI-STACK.md` §6 («A las tres de la mañana…»).

## 19.1 🎥 «Agentes que vigilan: cómo decide que algo está roto»

*Enseña: el mecanismo loop → comparación → aviso. Trailer del futuro YT «Un agente que te avisa».*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «A las 3 de la mañana se cayó mi sistema. A las 3:01 tenía el aviso. Nadie estaba despierto.» | el aviso real, hora visible | `3:01 AM` |
| 3-13 | «¿Cómo sabe que algo está roto? Corre en un loop — así le digo yo a una tarea por horario. Cada tanto revisa: ¿la web responde? ¿el chatbot contesta? ¿los flujos corrieron?» | checklist de chequeos pasando en verde | `REVISA CADA TANTO` |
| 13-23 | «Cuando algo no coincide con lo que debería, no lo arregla: AVISA. Es a propósito — arreglar solo, sin criterio, rompe más de lo que arregla. El agente detecta; el que decide soy yo.» | un chequeo en rojo → el mensaje saliendo | `AVISA · NO ARREGLA` |
| 23-30 | «¿Qué te gustaría que te vigile a vos? Contame en los comentarios — con los repetidos armo el ejemplo y lo comparto.» | — | `¿QUÉ TE VIGILARÍA?` |

**Cierre:** pedido de comentario (alimenta el futuro YT).

## 19.2 «El alma de un agente — te la leo»

*Enseña: el `SOUL.md`, y la sección que va primero. Pega con el drop D6.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Mi agente tiene un archivo que dice quién es. Te leo la parte importante.» | el SOUL.md abierto | `EL ALMA` |
| 3-12 | «Acá le escribís quién es, qué le importa, a quién le avisa. Pero la sección que vale el archivo entero es esta: "Lo que NO hacés".» | scroll hasta la sección | `LO QUE NO HACÉS` |
| 12-23 | «"No arreglás nada solo: avisás. No tocás datos de clientes. No mandás nada a nadie que no sea yo." Esa sección se escribe PRIMERO. Un agente sin límites escritos hace lo que le parece — y lo que le parece a las 3 AM no siempre es lo que vos querías.» | las tres líneas, una por una | las 3 líneas apareciendo |
| 23-30 | «La plantilla de este archivo, vaciada, está desde hoy en mi comunidad. Link en el perfil.» | el archivo de la comunidad | `LA PLANTILLA · HOY` |

**Cierre:** recurso = comunidad (drop D6).

## 19.3 «Cuánto cuesta un agente 24/7 — la cuenta sin redondear»

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Tengo un agente trabajando 24/7. La cuenta real, sin redondear para ningún lado:» | — | `LA CUENTA` |
| 3-13 | «El programa: gratis, es abierto. La máquina de casa: cero — es una PC que ya tenía. El servidor que además atiende clientes: 40 al mes. Y el modelo que piensa se paga por uso: revisa, no charla — son centavos por vuelta.» | los números apilándose | `$0 · $0 · $40 · centavos` |
| 13-24 | «Lo que sí te puede quemar es el gasto por uso mal armado. Cuando el mío se disparó, fui a mirar: el 74 % era UN solo trabajo mal configurado. Se arregla ESO. No se sube el tope.» | gráfico simple: 74 % un bloque | `74% = UN TRABAJO` |
| 24-30 | «¿Cuánto pensabas que costaba? Contame — las respuestas van de 10 a 1.000 dólares y eso es exactamente el problema.» | — | `¿CUÁNTO PENSABAS?` |

**Cierre:** pedido de comentario.

## 19.4 · Pool: `ponytail` + `caveman`

«Dos plugins que le cambian la personalidad a tu IA: uno la vuelve un senior vago que
escribe menos código, el otro la hace hablar corto, sin relleno. Los uso los dos, juntos.»
Pantalla: los dos repos + una respuesta ANTES/DESPUÉS. Cierre: 📌 nombres en el primer
comentario.

---

# DOMINGO 20 · cierre de semana — hoy SÍ se promete la guía

- **B-roll del día:** la guía `/stack` scrolleando en el teléfono.
- Corto que promete, ya escrito: `GUIONES-SEMANA-1-MI-STACK.md` §8b (lunes 21 el link).

## 20.1 «La IA multiplica lo que ya sabés hacer»

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «La IA no me hizo experto en nada. Multiplicó lo que ya sabía. La diferencia te ahorra meses.» | — | `MULTIPLICA ≠ ENSEÑA` |
| 3-13 | «Donde yo sé —qué vender, a quién, cómo suena mi marca— la IA me lo produce por diez. Donde no sé, me devuelve basura con seguridad de experto. Y si no podés revisar lo que te da, no podés usarlo.» | ejemplo real tuyo: pieza buena vs descarte | `×10 DONDE SABÉS` |
| 13-23 | «Por eso mi guía ordena las herramientas así: primero las que entendés hoy — las respuestas de WhatsApp, un flujo simple. La IA "inteligente" va al final, no al principio.» | `/stack` mostrando el orden 1→6 | `EMPEZÁ POR LO QUE ENTENDÉS` |
| 23-30 | «La guía completa está en mi web — las seis herramientas, el orden, y qué NO hace cada una. Link en el perfil.» | `/stack` en el teléfono | `sergiourcullo.vercel.app/stack` |

**Cierre:** recurso = `/stack` (permitido hoy).

## 20.2 «Publiqué [N] piezas esta semana — números honestos»

*🔴 Los números se cuentan EL DOMINGO, no se estiman hoy: piezas salidas, la que más
rindió, la que menos, cuántas se tiraron.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Esta semana salieron [N] piezas de este perfil. Yo grabé UNA tarde.» | tu feed de la semana | `[N] PIEZAS · 1 TARDE` |
| 3-13 | «El reparto: los videos se grabaron en lote el sábado. Las placas y los subtítulos los hizo el sistema. Publicar toma minutos por día.» | el lote: misma ropa, temas distintos | `GRABADO EN LOTE` |
| 13-23 | «Lo que no controlo: cuál pega. El que más rindió fue [X], y yo apostaba por [Y]. Por eso se publica todos los días — el criterio se entrena con datos, no con gustos.» | métricas reales en pantalla | `[X] LE GANÓ A [Y]` |
| 23-30 | «El sistema completo de cómo produzco esto lo voy contando en mi comunidad. Link en el perfil.» | — | `EL SISTEMA · COMUNIDAD` |

**Cierre:** recurso = comunidad.

## 20.3 Interactivo — alimenta la semana del 21

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Contame UN proceso de tu negocio y te digo si se automatiza, con qué — y si necesita IA o no.» | — | `TU PROCESO ↓` |
| 3-13 | «Ejemplo: "mando el mismo recordatorio de cobro todos los meses". Eso NO necesita IA — necesita un loop de 30 segundos en n8n. Gratis.» | el flujo de 2 nodos armándose | `ESO NO ES IA` |
| 13-23 | «La cuenta que uso: cuántas veces lo hacés por semana, por cuántos minutos. Veces por minutos alto y decisión simple: se automatiza. Decisión difícil: quedate vos.» | la fórmula grande | `VECES × MINUTOS` |
| 23-30 | «Dejá el tuyo en un comentario. Respondo todos, y con los mejores armo los videos de la semana que viene.» | — | `RESPONDO TODOS` |

**Cierre:** pedido de comentario (define la semana del 21).

## 20.4 · Pool: `Understand-Anything`

«Le das un proyecto entero y te lo convierte en un mapa que podés recorrer.» Pantalla:
el grafo generándose sobre un proyecto real. Cierre: 📌 primer comentario.

---

# Capa YouTube — las presentaciones explicativas, ordenadas

> 🔴 **Actualizado el 17-sep: YouTube pasa a DIARIO** (decisión de Sergio Urcullo).
> La serie se termina esta misma semana, un largo por día. Los tres restantes se
> **graban en lote en UNA sentada** (acapela mirando el deck); solo los números marcados
> en cada GUION.md se recuentan el día que toca publicar.

| Video | Estado | Cuándo | Guion |
|---|---|---|---|
| **03** «Hago que la IA trabaje mientras duermo» | grabado, deck+guion ✅ | **publica JUE 17** | `yt-claude-code-automatizacion/GUION.md` |
| **04** «La IA te dice "listo" y te está mintiendo» | deck+guion ✅ | **publica VIE 18** | `yt-04-verificar/GUION.md` (11 láminas, ≈8:00) |
| **05** «No escribas nada: casi todo ya está hecho» | deck ✅ · guion ✅ (17-sep) | **publica SÁB 19** | `yt-05-no-construyas/GUION.md` |
| **06** «Tengo 16 años y mi empresa corre con IA» | deck ✅ · guion ✅ (17-sep) | **publica DOM 20** — cierre; se fija en el canal y se corta en vertical | `yt-06-mi-empresa/GUION.md` |

Desde el **lun 21** el diario lo alimenta la escalera (corto que pegó → largo), en orden
de madurez: «Qué automatizar primero» (7 drops de reserva) → «Un agente que te avisa» →
«IA local» → «Escribí tu primera skill».

Reglas que no se negocian (de `SERIE_CLAUDE_CODE.md`): números recontados el día de
grabar · acapela mirando el deck (tecla N apaga chuletas) · «La parte honesta» penúltima
· el video publicado se embebe en `/claude-code` el mismo día + drop exclusivo en la
comunidad · capítulos en la descripción con minutos reales.

**Estructura del 04** (ya listo, para el finde): Hook 0:25 → El caso (la pantalla dada
por buena 3 veces) → Por qué pasa (terminar ≠ lograr) → Lado a lado (parece vs está
verificado) → Las tres preguntas (¿lo miré? ¿cuánto salió? ¿lo conté hoy?) → El puente →
Regla + historia → Los 3 errores del primer mes → Mi caso (12 errores) → La parte
honesta → En una línea.

---

# Formato EXPERIMENTO — referencia Erik Taveras (pedida el 17-sep)

> Sergio Urcullo: *"intenta que algunos videos sean mas largos, revisa erik taveras,
> me gusta su contenido"*. Mirado el 17-sep: @eriktaveras (136k IG) · @ErikTaverasT
> (18,5k YT). Nicho IDÉNTICO (n8n, WhatsApp API, agentes, IA local, homelab — hasta
> tiene un short de «Hermes orquestando Codex y Claude Code»). Su fórmula de largos:
> **el video ES un experimento en vivo** — Prueba 1/2/3 numeradas, monitoreo en tiempo
> real, revisión final del resultado, cierre «¿vale la pena?», 11-12 capítulos,
> números concretos en el título. Se extrae la estructura, no la identidad.

## Los 3 largos formato experimento (cola YT, después del 06 — semana del 21+)

### E1 · «Le pido una página web a la IA y la cronometramos» (~8-12 min)
Capítulos: el reto y el reloj → el prompt completo en pantalla → [en vivo] lee mis
archivos → propone y apruebo → primer error EN VIVO y cómo lo arregla → el reloj para:
X minutos → la revisamos juntos en el navegador → lo que NO hizo bien → ¿cuánto habría
costado encargarla? → ¿vale la pena? Asciende del corto «la hizo delante mío».

### E2 · «Mi servidor es una PC vieja de $0: la abrimos y la medimos» (~10-15 min)
Capítulos: qué corre ahí adentro (la lista real) → la abrimos: specs a cámara → htop
en vivo: RAM y CPU con todo corriendo → le tiro carga: qué aguanta → cuánto gasta de
luz (medido, no estimado) → qué NO puede hacer → armala vos: el orden → ¿PC vieja o
nube? la cuenta → guía /homelab. Es el «Tesla P40» de Erik en versión $0. Cruza con
la serie homelab.

### E3 · «Dejo a la IA trabajando toda la noche y revisamos qué hizo» (~10-12 min)
Capítulos: 22:00 — le dejo la cola escrita EN VIVO → cómo queda el cron armado →
[corte] 7:00 — abrimos los avisos SIN editar la sorpresa → qué hizo bien (commits,
logs, en vivo) → qué hizo MAL o no hizo (sin cortar) → cuánto costó la noche →
las tres reglas → ¿lo dejarías correr en tu negocio? El más compartible: es el 03
convertido en prueba con testigo.

## Variantes largas (60-90 s) — CORRECCIÓN del 17-sep

⚠️ Sergio Urcullo: él graba SOLO cara a cámara; las pantallas y pruebas las pone
LA EDICIÓN sobre su voz. Entonces un video largo = MÁS HABLA con historia y detalle
(60-90 s de texto corrido, ~200 palabras), no una demo grabada por él. La estructura
larga hablada: gancho → desarrollo con detalles CONCRETOS (números, el caso, la
anécdota) → giro honesto → cierre. Los guiones largos del vie 18 están en el
mensaje de la sesión del 17-sep; las marcas [EDICIÓN: ...] van aparte del habla.
Regla: corto = 30 s para lo puntual (pool, descubrimiento); largo = 60-90 s cuando
hay historia o cuenta que desarrollar.

- **18.1 extendido (~90 s):** «Mi feed lo produce un sistema» + [en vivo] corro el
  script y las 8 placas aparecen una por una en la carpeta, con reloj.
- **18.3 extendido (~75 s):** la cuenta del empleado $200 + [en vivo] abro el panel
  de uso del mes y muestro el número real en pantalla.
- **Sáb 19.1 extendido (~90 s):** el aviso de las 3:01 + [en vivo] tiro un servicio
  a propósito y esperamos el aviso EN CÁMARA con el teléfono al lado.
