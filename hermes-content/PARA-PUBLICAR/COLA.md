# Cola de publicación — lo que Sergio abre, copia y publica

> Ventana de producción del **2026-09-02**, corrida sola en el VPS mientras la PC está apagada.
> Sergio: *«genera contenido para publicar en lucia y en onia, para informar o cerrar ventas»*.

## 🔴 Qué significa «listo» acá

El número que importa es **publicado**, y hoy dice **1**. Producir más archivos no lo mueve.
Una pieza cuenta como lista **sólo** si Sergio la puede publicar sin escribir nada:

1. **El archivo** en su carpeta `D##-...`, en el formato correcto del destino.
2. **`CAPTION.txt`** completo — texto tal cual va, con saltos de línea y hashtags.
3. **La palabra del CTA**, y para **cuál cuenta** está registrada (el que publica es el que
   recibe el comentario; si la palabra no está viva en el mapa de n8n de ESA cuenta, el lead
   comenta y no recibe nada — es el incidente RANKING).
4. **Destino explícito**: feed / reel / historia, y qué cuenta publica.
5. **Verificada MIRÁNDOLA.** Un render que existe no es un render que se ve bien.

Una pieza sin caption **no está lista**, aunque la imagen sea perfecta.

## Las dos cuentas van al mismo lugar

| | **@oniahq** | **Lucía** |
|---|---|---|
| Objetivo | leads y comentarios | leads y comentarios |
| CTA que pesa | **`DEMO`** → reservá una demo | **`COMUNIDAD`** → la comunidad de IA |
| Convence a | el que ya tiene el problema | el que no sabe que la IA le sirve |

**Alterná cuenta en cada vuelta.** Si dos vueltas seguidas alimentan a la misma, la otra se
queda sin feed — ya pasó una vez y Lucía quedó parada.

---

## Cola — tomá la primera `PENDIENTE`

### D01 · @oniahq · carrusel que CIERRA · 0 créditos · HECHO
→ ver bloque en «Publicadas / listas» (`D01-oniahq-8pm/`).

### D02 · Lucía · UGC en lugar nuevo · ~2 créditos · PENDIENTE
Imagen 9:16 en un lugar que el banco no tenga (**restaurante de almuerzo** es el primero).
Receta y trampas en `references/modelos/lucia/TECNICA-HIGGSFIELD.md`; calidad contra las
9 casillas de `RUBRICA-IMPOLUTO.md`. Caption que informa sobre IA, CTA `COMUNIDAD`.

### D03 · @oniahq · carrusel que INFORMA · 0 créditos · PENDIENTE
Renderizá `briefs/onia-5-preguntas-de-siempre-20260820.json`. Informa, no vende: las 5 preguntas
que un dueño se hace todos los días y que el sistema ya contesta. CTA suave `DEMO`.

### D04 · Lucía · historia-quiz · 0 créditos · PENDIENTE
El formato de `references/video-intake/2026-09-02-ingenierobinario-historia-quiz.md`.
9:16, 1080×1920. Trampa sobre IA: *«Le pedís a una IA que escriba el post. Le das tu web y tres
ejemplos tuyos. ¿Qué sale?»* → la correcta es **«Depende de los ejemplos»**.
🔴 **Las opciones NO se dibujan**: se dejan en el `CAPTION.txt` para que Sergio las tipee en el
sticker nativo de encuesta. Dibujarlas mata la única ventaja del formato (se responde con un toque).

### D05 · @oniahq · historia-quiz de gestión · 0 créditos · PENDIENTE
Mismo formato, trampa de gestión: *«3 pacientes reservaron para el martes. 1 canceló por WhatsApp
a las 21:40. ¿Cuántos van a venir?»* → la correcta es **«2, pero te enterás el martes»**.
Duele porque es verdad: el dato existe pero llega tarde. Es lo que vende Onia, como acertijo.

### D06 · Lucía · animar la imagen de D02 · ~4,8 créditos · PENDIENTE
`seedance1_5` con `--start-image` (el asset id que anotaste en D02). Sale 9:16 con audio.
4 frames con `ffmpeg` y **mirarlos** antes de darla por buena.

### D07 · @oniahq · carrusel que CIERRA, otro ángulo · 0 créditos · PENDIENTE
`ads/ad-a7-el-martes-pasado.json`, pack `bloque-solido`.
Ángulo: cuántos atendiste el martes pasado — nadie se acuerda, el sistema sí.

### D08 · Lucía · carrusel «cómo se hace» · 0 créditos · PENDIENTE
Brief nuevo, escrito por vos: cómo se produce una foto de Lucía sin cámara y sin estudio.
**Declara que es IA** — el argumento de venta ES la declaración, nunca se esconde.
CTA `COMUNIDAD`. Pack a elección entre los 10 disponibles, **no `typographic`** (es el más pobre).

### D09 · @oniahq · el cuaderno · 0 créditos · PENDIENTE
`ads/ad-a6-el-cuaderno-no-falla.json`. El cuaderno no falla: falla acordarse de abrirlo.

### D10 · Lucía · UGC lugar nuevo · ~2 créditos · PENDIENTE
Siguiente lugar: **veterinaria de barrio**. Mismas reglas que D02.

### D11 · @oniahq · carrusel que INFORMA · 0 créditos · PENDIENTE
`briefs/onia-competencia-mientras-whatsapp-20260820.json`.

### D12 · Lucía · animar D10 · ~4,8 créditos · PENDIENTE

---

## 🟢 Las 3 de HOY (2026-09-02) — en orden

Ordenadas por lo que más mueve el número. **Lo viejo listo gana a lo recién hecho**, y se
**alterna cuenta** (ayer cerró @oniahq con D01 → hoy abre Lucía).

1. **D14 · Lucía · REEL peluquería** — el **día 1 del calendario**, listo y verificado desde el
   28-ago, parado más de una semana. Es lo único que mueve el número de verdad. `D14-.../CAPTION.txt`.
2. **D01 · @oniahq · feed «8 de la noche»** — listo desde ayer, cierra ventas. `D01-.../CAPTION.txt`.
3. **D13 · Lucía · feed café fancy** — foto lista, informa sobre IA. `D13-.../CAPTION.txt`.

---

## Publicadas / listas

_(cada vuelta agrega su bloque acá: carpeta, cuenta, destino, palabra del CTA, cómo se verificó)_

### D14 · Lucía · REEL peluquería (pilar B, no nombra a Onia) · LISTA · 0 cr extra
- **Carpeta:** `PARA-PUBLICAR/D14-lucia-reel-peluqueria/`
  - `lucia-peluqueria-REEL-720x1280.mp4` (reel, 9:16) · `CAPTION.txt` completo.
- **Cuenta / destino:** **Lucía** · **reel**. Es el **primer video vertical real del banco**
  (`V07-peluqueria-seedance`, `seedance1_5`, 4,8 cr): 720×1280 = 9:16 exacto, 4,05 s, con pista
  de audio aac — se sube tal cual, no necesita re-encuadre ni quemar texto.
- **CTA:** **`COMUNIDAD`** (el de Lucía). Caption pilar B: declara que ES IA (el argumento de
  venta es la declaración, no se esconde), informa qué significa que hoy cualquier negocio
  produzca su propio contenido, cierra con `Comentá COMUNIDAD`.
- **Cómo se verificó:** MIRADO — `ffprobe` confirma 720×1280 h264 + aac, 4,05 s (no 0-byte);
  frame a 2 s abierto y mirado: Lucía con pecas, argolla dorada y cadenita, escena de peluquería
  de barrio compuesta desde el espejo, tijera cortando el mechón mojado, ventilador de pared,
  colores true-to-life, ningún cartel legible. Coincide con el caption.
- ⚠️ **Falta lo de Sergio:** cargar `COMUNIDAD` en el mapa de n8n de la cuenta de Lucía antes de
  publicar (ya está en `recompensas.json`; es el paso de 30 s del incidente RANKING). Pieza y
  caption listos.

### D01 · @oniahq · ad «8 de la noche» que CIERRA · LISTA · 0 créditos
- **Carpeta:** `PARA-PUBLICAR/D01-oniahq-8pm/`
  - `oniahq-8pm-FEED-1080x1350.png` (feed, 4:5) · `CAPTION.txt` completo.
- **Cuenta / destino:** **@oniahq** · **feed** (imagen única, no carrusel — el brief `ad-a4` es
  un solo cover, como los 8 ads de esa serie).
- **CTA:** **`DEMO`** (el de @oniahq). Caption con la estructura pedida: **dolor** en la 1ª línea
  («son las 8 de la noche y alguien quiere darte trabajo, vos ya cerraste»), **prueba/mecanismo**
  en el medio (asistente que atiende por WhatsApp fuera de hora, agenda y deja el mensaje),
  **`Comentá DEMO`** al final. Sin cifras ni testimonios inventados (cero clientes pagando).
- **Render:** `node scripts/carousel_render.js --brief hermes-content/carousels/briefs/ads/ad-a4-ocho-de-la-noche.json --pack bloque-solido --account onia --out hermes-content/carousels/out/D01-ad-a4-8pm`
  (con `CAROUSEL_BROWSER` autodescubierto tras el fix del script).
- **Cómo se verificó:** MIRADA renderizada al abrirla — 1080×1350 (4:5 feed), 90 KB (no 0-byte),
  fuentes cargadas (display serif + sans, sin glifos rotos), «8 de la noche» resaltado con
  subrayado verde, cuerpo legible, botón «Reservá una demo» y firma `@oniahq` correctos, colores
  de marca. Cero texto corrupto.
- ⚠️ **Falta lo de Sergio:** confirmar que `DEMO` está viva en el mapa de n8n de @oniahq antes de
  publicar (incidente RANKING). La pieza y el caption están listos.
- 🛠️ **Fix de tooling que trajo esta vuelta** (ver `carousels/CAROUSEL_SYSTEM.md` § «Correr en el
  VPS headless»): `carousel_render.js` estaba roto
  para TODO pack —requería 3 módulos de pack que nunca se commitearon, y le faltaba `--no-sandbox`
  para correr Chromium como root en el VPS—. Ahora los packs ausentes cargan perezoso y el
  navegador de Playwright se autodescubre. **`bloque-solido` (D01/D07/D09) ya rinde.**

### D13 · Lucía · foto fancy en café de especialidad · LISTA (0 cr extra, subproducto de E3)
- **Carpeta:** `PARA-PUBLICAR/D13-lucia-cafe-fancy/`
  - `lucia-cafe-fancy-FEED-1080x1350.jpg` (feed, 4:5) · `lucia-cafe-fancy-STORY-1080x1920.jpg` (historia, 9:16)
- **Cuenta / destino:** **Lucía** · feed (la 4:5) — la 9:16 sirve de historia.
- **CTA:** **`COMUNIDAD`** (el de Lucía). `CAPTION.txt` completo, informa sobre IA y declara que la
  foto ES IA (el argumento de venta es la declaración, no se esconde).
- **Cómo se verificó:** salió de E2/E3 (receta fancy). 9/9 de la rúbrica MIRÁNDOLA al 100 %:
  cara Lucía (pecas, poros, argolla), manos 5+5 sobre la taza, acción a medias (ambas manos),
  luz de ventana real, cero texto legible, colores true-to-life. Casilla 2 resuelta con el export
  a 1080×1920 / 1080×1350 (verificado con `ffprobe` y mirado, no corta cara ni manos).
- ⚠️ **Falta lo de Sergio:** confirmar que `COMUNIDAD` está viva en el mapa de n8n de la cuenta de
  Lucía antes de publicar (incidente RANKING). La pieza y el caption están listos.
