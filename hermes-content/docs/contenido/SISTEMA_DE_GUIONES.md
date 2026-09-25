# Guiones: una pieza enseña algo, y lo que se muestra es real

> **Doc VIVO, sin fecha: se EDITA, no se reemplaza.** Es la fuente única de CÓMO se escribe,
> se verifica y se entrega un guion: marca personal de Sergio Urcullo, comunidad y pauta de
> ONIA. Qué se publica en cada cuenta lo dicen `hermes-content/contenido/README.md` y
> [`MARCA_ONIA.md`](MARCA_ONIA.md). El índice del carril es
> [`../ONIA_CIRCUITO_DE_CONTENIDO.md`](../ONIA_CIRCUITO_DE_CONTENIDO.md).
>
> Nace del pedido de Sergio Urcullo del 2026-09-25: *"solo tenés una regla: tiene que enseñar
> algo. Y si necesitamos grabar la pantalla sobre ese algo, vos lo tenés que hacer, pero tiene
> que ser real… si hablás sobre el nuevo modelo de Opus 5.5 … desarrollá los mockups, pero
> hacelos bien"*.

**Por qué hacía falta.** Todo lo que sigue se midió el 2026-09-25 (fuente:
`historial/contenido/INVENTARIO_GUIONES_20260925.md`):

- Había **307 piezas** inventariadas: **102 escritas y 9 grabadas**. El cuello de botella no
  era escribir.
- Convivían **nueve moldes de guion distintos**. Ninguno registraba qué aprende la persona, de
  dónde sale la pantalla real ni el estado de la toma.
- **Unos 12 guiones repetían un dato caído**: *"todo corre en una PC vieja de mi casa"*. El
  18-sep se midieron 40 trabajos en el VPS y 0 en la PC.
- **Dos guiones de días seguidos enseñaban lo contrario**: el del 21-sep decía "usá un AI Agent
  para clasificar" y el del 22-sep, "no lo uses".
- **Un brief del 21-sep dibuja una terminal con salidas escritas a mano** ("server added:
  notion"), que no salen de ninguna ejecución.

Este sistema existe para que nada de eso llegue a la cámara.

---

## 0. La regla, en dos líneas que se llenan ANTES de escribir

```
ENSEÑA:  Al terminar, quien lo vio puede ____________________ (acción concreta, repetible hoy)
         — o — sabe ____________ y lo puede comprobar en ____________ (dato + su fuente)
PRUEBA:  En pantalla se ve ____________ (captura REAL: archivo + manifiesto, o toma que graba X)
TRABAJO: enseña (experto en IA) · vende enseñando (ONIA) · conecta (Sergio Urcullo) — uno por pieza
```

**Si una de las dos líneas no se puede llenar, la pieza no se escribe.** No se "mejora
después": se descarta o se reformula hasta que las dos existan.

| No pasa el filtro | Pasa el filtro |
|---|---|
| "Opus 5.5 es una bestia" | "Opus 5.5 rechaza `temperature` y el `tool_choice` forzado: si migrás sin sacarlos, tu app devuelve **400**. El comando que lo migra solo es `/claude-api migrate`" — prueba: la guía oficial, capturada |
| "Automatizá tu negocio con IA" | "Antes de automatizar, escribí la tarea en 5 cajas: ENTRADA → REGLA → ACCIÓN → REGISTRO → HUMANO. La que no entra en 5 cajas todavía no se automatiza" — prueba: el diagrama hecho sobre un caso real |
| "Mirá mi stack" | "Las 6 herramientas que uso, qué **NO** hace cada una y el comando para instalar la primera" — prueba: la instalación grabada |
| Terminal dibujada con líneas inventadas | La misma terminal, pero **con las líneas copiadas de una ejecución que quedó grabada** (o la grabación directamente) |

### El pilar personal también enseña

La decisión de Sergio Urcullo del 21-sep reserva espacio diario para experiencias personales y
criterio (`ONIA_MARCA_PERSONAL_TRES_CARRILES.md`). No es una
excepción a la regla: la pieza personal sigue el camino **experiencia real → tensión →
aprendizaje → una acción**. Si no deja una acción concreta (qué hacer distinto mañana), no sale.
Las frases motivacionales sin experiencia detrás están prohibidas.

### Los tres trabajos: enseñar, vender enseñando, conectar

> Sergio Urcullo, 25-sep: *"necesitamos contenido que realmente enseñe algo… contenido que venda
> la única plataforma, contenido que genere conexión entre yo y los espectadores, los posibles
> clientes. Y que me deje como un experto… Puede ser contenido inventado… alrededor [de mis
> cosas]. Pero que tenga sentido."*

Las 10–13 piezas diarias no son 13 ideas sueltas: son ángulos de **un** tema, y cada pieza tiene
**un** trabajo:

| Trabajo | Qué deja | Ejemplo de ENSEÑA |
|---|---|---|
| **Enseña** | una habilidad de IA que se repite hoy: un prompt, un nodo, una regla | «escribís un prompt que no inventa precios y marca `requiere_revision` cuando le falta un dato» |
| **Vende enseñando** | un problema del negocio, la regla que lo resuelve (sirve aunque no compren) y la pantalla real de ONIA haciéndolo | «encontrás a tus pacientes con tratamiento a medias; en ONIA lo hace el agente Recall cada mañana» |
| **Conecta** | un criterio, una decisión o una experiencia de Sergio Urcullo, con una regla que el otro se lleva | «las 3 cosas que siempre aprueba una persona antes de que salga un mensaje» |

**Inventado, sí; falso, no.**
- **El escenario puede ser inventado**: una clínica con 4 dentistas, un paciente «Ana», datos de
  prueba en la demo.
- **Lo que ONIA hace no se inventa.** Se muestra lo 🟢 y lo 🟡 en su pantalla real
  (`ONIA_CATALOGO_DE_VENTA.md`), con su cadencia real: Recall corre **una vez por día**, no
  24/7.
- **Sin cifras de resultados de ONIA**: hay cero clientes pagando. La consecuencia económica se
  muestra como cuenta que hace el que mira («tus pacientes × las sesiones que faltan × lo que
  cobrás»).
- **Lo que Sergio Urcullo cuenta de sí mismo**, lo confirma él antes de grabar (§2).

---

## 1. Qué cuenta como REAL

| ✅ Es real | ⛔ No es real |
|---|---|
| Captura de la página oficial, en su URL, con fecha | Una "captura" reconstruida en HTML o en Figma |
| La terminal donde **corrió** el comando, o sus líneas copiadas de esa corrida | Líneas de terminal escritas a mano, "como deberían salir" |
| El producto **en producción** (`app.onia.com.bo`), con datos de prueba | Una rama local o una interfaz "aproximada" |
| El workflow que existe y corre, con datos de prueba | Un diagrama presentado como si fuera la herramienta |
| Un **mockup = marco** alrededor de una captura real: dispositivo, zoom, recuadro, foco, cursor grande o datos privados desenfocados | Una interfaz generada con IA (CLAUDE.md §5: *"no fabricar pantallas con IA"*) |

Reglas que lo sostienen:

- **Cifras de terceros, rotuladas en pantalla:** "según Anthropic", "según la doc de n8n".
- **Datos de prueba donde haga falta, y que se note.** Nada privado en pantalla: ni tokens, ni
  IDs, ni la pantalla de login, ni chuletas, ni teleprompter.
- **Toda captura deja manifiesto:** URL, fecha y hora, y el texto que se verificó en la página.
  `scripts/contenido/capturar-web.mjs` lo hace solo (§8).
- **Lo que no se puede capturar desde la nube lo graba una persona**, con la especificación de
  §8: n8n de Sergio Urcullo, Higgsfield, WhatsApp, Instagram y todo lo que pida login. El
  guion dice quién graba y qué.

---

## 2. Los datos vencen

- **Cada afirmación lleva su fuente y la fecha de verificación** en el guion (columna NOTA).
- **Más de 7 días entre la verificación y la grabación: se re-verifica** el mismo día de grabar.
- **Las noticias llevan `vence:`.** Lanzamientos de modelos, precios y features. "Salió hoy"
  vence a las 48 h; pasado eso, la pieza se reescribe como tutorial (ejemplo: §9).
- **Un dato heredado no se graba sin contarlo de nuevo** (CLAUDE.md §2). Aplica también a lo
  que dijo otra sesión o un guion viejo.
- **Afirmaciones sobre la infraestructura propia** ("corre en mi PC", "tengo N loops"): se miden
  el día de grabar. Fue la afirmación que más se repitió caída.
- **Los datos de ejemplo pueden parecerse sin ser los reales** (Sergio Urcullo, 25-sep): un JSON
  ficticio, cifras redondeadas, un negocio inventado parecido al tuyo, datos de prueba en una
  demo. Dos cosas no se aproximan:
  - **lo que uno dice de sí mismo** («mi empresa corre en…», «yo pago…»). Si no es así, se dice
    como ejemplo («una PC vieja alcanza para empezar») y no como hecho propio;
  - **los datos oficiales de terceros** (precios, versiones, límites de una API): se citan con
    su fuente y su fecha.

---

## 3. La promesa existe antes del CTA

- **"Comentá X" sólo si el recurso está publicado y su URL abre**, verificada el día de publicar.
  Si la página no está en el aire, la pieza cierra con otro CTA (seguir, una pregunta) y no
  promete.
- **Hoy las palabras clave no disparan nada** (`palabras: {}`, ver
  [`PUBLICACION.md`](PUBLICACION.md)). Cada "comentá X" es trabajo manual de Sergio Urcullo, así
  que se usa **una palabra activa por vez**.
- **El recurso da el cómo, la comunidad da el archivo hecho.** Es el reparto de
  `ONIA_MARCA_PERSONAL_TRES_CARRILES.md`: cada escalón entrega completo lo suyo y nada de lo del
  siguiente.

---

## 4. Un tema, todas las plataformas

El tema se investiga **una vez** y se captura **una vez**. De ahí salen las piezas:

| Pieza | Dónde | Forma | Qué enseña | Quién graba |
|---|---|---|---|---|
| **Largo** | YouTube | 8-15 min, 16:9 | el **cómo completo**: pasos, errores, prueba | Sergio Urcullo (cara + pantalla) |
| **Corto ×3** | Reels · TikTok · Shorts (la **misma** toma 9:16) | 30-60 s | **una** unidad completa: una decisión, un error o un comando | Sergio Urcullo; el apoyo sale de las capturas del tema |
| **Carrusel** | Instagram (y el mismo PDF en LinkedIn) | 7-9 láminas 1080×1350 | mapa, checklist o comparación, con **≥2 láminas de captura real** | motor `scripts/carousel_render.js` (pack `community-editorial`) |
| **Post** | LinkedIn | 900-1.300 caracteres + 1 captura o el PDF | la lección aplicada a un negocio: *qué aprendí construyendo Onia* | texto; lo publica Sergio Urcullo |
| **Drops ×6** | Comunidad (Announcements) | menos de 2 min de lectura + archivo | el cómo + **el archivo listo** (exclusivo) | texto + archivo |
| **Historias** | Instagram | 3-5 | pregunta, encuesta y lo que salió mal | Sergio Urcullo |

**La cadencia NO se fija acá.** Hoy hay cuatro cifras vivas en el repo (2 por día, 6 por semana,
10-13 por día y 11 por día) y elegir una es **decisión de Sergio Urcullo**: está en el índice del
carril. La recomendación de esta sesión, medida contra los referentes
(`research/ONIA_REFERENTES_ROCHA_TAVERAS_MUNOZ_20260925.md`), es:

- 1 tema por semana;
- 1 largo, 3 cortos originales, 1 carrusel, 1 post de LinkedIn y 6 drops por tema;
- los "trial" sólo como resubida de lo mismo, no como producción aparte.

Eso son unas 10-11 h por semana de Sergio Urcullo. Más volumen no rinde más si las piezas no
enseñan, y compite con las horas que necesita la Etapa 1.

---

## 5. La plantilla

Un archivo por **tema**, en `contenido/piezas/guiones/AAAA-MM-DD-<tema>.md`. Arriba va la tabla
de piezas con su estado (§6); después, un bloque por pieza. **Cada columna es la entrada de una
herramienta de edición que ya existe**: el guion es la instrucción completa y la edición no
adivina nada (detalle en `research/ONIA_METODO_SANTIAGO_EDICION_20260925.md`).

```markdown
### <ID> · <formato> · <título de trabajo>

ENSEÑA:   al terminar, quien lo vio puede …
PRUEBA:   <ids de captura> (manifiesto: ../../../captures/<tema>/manifest.json) · o: GRABA <quién> <qué>
AUDIENCIA: marca personal (construir/vender con IA) · @oniahq (dueño de clínica) · comunidad
TRABAJO:  enseña | vende enseñando | conecta
FUENTES:  <URL> (verificada AAAA-MM-DD) · vence: AAAA-MM-DD | —
CTA:      <uno solo> · recurso: <URL verificada AAAA-MM-DD> | sin recurso
LAYOUT:   A cabeza a cuadro + overlays · B partido (apoyo arriba 55 % / cabeza abajo 45 %) · C pantalla primero, cara en PiP
EDICIÓN:  completa (método Santiago) | mínima (corte + subtítulos + master)
DURACIÓN: __ s · PALABRAS: __ (3,2-3,5 palabras por segundo)

| # | t | HABLA (literal) | CUE (palabras exactas que disparan el cambio) | EN PANTALLA (id + región) | TEXTO EN PANTALLA (≤3 palabras) | ZOOM / SFX | NOTA (fuente, dato a re-verificar) |
|---|---|---|---|---|---|---|---|
| 1 | 0-3 | «…» | — | CAM (gancho sin corte) | `…` | punch 1.00→1.08 | sin saludo |
| … |

CÁMARA: cámara en archivo aparte, a cuadro completo, a la altura de los ojos · gancho y CTA dos
veces · ante una retoma, la frase entera (vale la última) · 1 s de pausa entre beats · gestos
hacia donde irá cada tarjeta · nada privado en pantalla.
GLOSARIO: <cómo se dice> → <cómo se escribe en subtítulos>
[EDICIÓN: …] instrucciones que no se dicen, con el # de beat.
QA: se entiende sin sonido · cada frase tiene su prueba en pantalla · el texto no tapa la cara
ni el dato · cifras legibles en el teléfono · tildes y ñ · logos originales · video mirado
entero antes de pedir el OK.
```

**Por qué el CUE literal.** `sync-plan` sincroniza cada apoyo con la palabra que suena en la
transcripción. Si la palabra del guion no se dice tal cual, ese cambio queda
`SIN SINCRONIZAR` y hay que ponerlo a mano. La palabra que dispara cada cambio se escribe en el
guion **y se dice exacta**.

---

## 6. Estados de cada pieza, y qué sesión mueve cada uno

```
idea → guion → verificado → capturas → grabado → editado → aprobado → publicado → medido
```

| Estado | Lo marca | Qué tiene que existir para marcarlo |
|---|---|---|
| **guion** | sesión de contenido | la pieza escrita con la plantilla de §5 |
| **verificado** | sesión de contenido | fuentes re-leídas, fecha puesta, CTA con recurso vivo o sin CTA de recurso |
| **capturas** | contenido (web pública) o Sergio Urcullo / Samuel (con login) | archivos + `manifest.json`, o la toma grabada con la especificación de §8 |
| **grabado** | Sergio Urcullo | los crudos en `videos/<serie>/<fecha>/raw/NN-slug-{camera,screen,voice}` (convención del handoff de edición) |
| **editado** | sesión de edición | el render en 9:16 y/o 16:9, mirado entero |
| **aprobado** | **Sergio Urcullo** | lo vio renderizado y dijo OK: construir y publicar son dos permisos (CLAUDE.md §4) |
| **publicado** | quien publica | la URL pública anotada en la tabla |
| **medido** | sesión de contenido | vistas, guardados y comentarios a las 48 h y a los 7 días, sin inventar números |

Cada sesión mueve **sólo sus estados** y edita **sólo su fila**, en el archivo del tema: así dos
sesiones no chocan.

---

## 7. Reglas mínimas por plataforma

- **Reel / TikTok / Short.**
  - Los primeros 0-3 s dicen **el resultado o el error**: sin saludo ni "hoy te voy a enseñar".
  - Una sola idea, y cada frase con su prueba en pantalla.
  - Subtítulos siempre; un solo CTA.
  - Si no se entiende sin sonido, no está terminado.
- **YouTube largo.**
  - Estructura: gancho con el resultado → qué vas a poder hacer → qué necesitás → pasos (**decir
    → mostrar → comprobar**) → qué salió mal → resumen → CTA (recurso o comunidad).
  - Capítulos.
  - Una vez por mes, el formato experimento con números en el título ("¿vale la pena?"), tomado
    de Erik Taveras.
- **Carrusel.** Sigue la skill `hermes-content/skills/carruseles-onia.md`.
  - Estructura de marca personal: problema → insight → solución → ejemplo con pantalla real.
  - La pauta de ONIA tiene su propia estructura.
  - Ninguna lámina repite el fondo con otro titular: cada una prueba algo distinto.
- **LinkedIn.**
  - La primera línea es la lección, sin gancho de misterio.
  - 3-5 párrafos cortos en primera persona: qué pasó construyendo Onia, qué se aprendió y qué
    haría un dueño o un profesional con eso.
  - Una captura real o el carrusel en PDF.
  - Sin "comentá X": ahí el objetivo es que un decisor vea criterio, no juntar comentarios.
  - Es la red donde la marca personal más se cruza con el cliente de ONIA.
- **Drop de la comunidad.**
  - Útil en menos de 2 minutos y aplicable hoy.
  - Trae el archivo (plantilla, checklist, workflow) y cierra con una pregunta o una mini-tarea.
  - Nunca anuncia algo que no existe.

---

## 8. Pantallas reales: quién las graba y con qué

**Lo público lo captura la sesión de contenido**, desde la nube: páginas oficiales, docs y
páginas públicas del producto. La herramienta es `scripts/contenido/capturar-web.mjs`:

```bash
node scripts/contenido/capturar-web.mjs hermes-content/captures/<tema>/plan.json
```

- Graba **cuadro a cuadro**: el video sale fluido aunque la máquina sea lenta, a 1440×900 × 2
  (2880×1800) y 60 fps.
- **Verifica en la página cada texto que el guion afirma.** Si la página no lo dice, la toma
  falla.
- Bloquea todo pedido que no sea lectura, y no inicia sesión.
- Deja PNG con marcas y sin marcas, una hoja de contacto para MIRAR y un `manifest.json`.
- Corre en Linux, en el VPS o en Windows. Necesita Playwright y un ffmpeg con H.264; si no hay,
  sirve `pip install imageio-ffmpeg`.

**Lo que pide login lo graba una persona** (Sergio Urcullo o Samuel). La especificación, medida
y documentada en el repo:

| Tema | Especificación |
|---|---|
| Ventana | 1440×900 y bajar a 1080 al editar; capturar directo a 1080 deja el texto blando |
| fps | 60 si la interfaz anima (se entrega a 30) |
| Cursor | grande: Playwright no dibuja cursor, hay que inyectarlo. Cada gesto dura 0,6-0,9 s; a 0,4 s no se lee |
| Región | si el layout es partido, decidir **al grabar** el cuadrado que importa (≈920×900 de 1440×900) |
| Duración | la del beat + 1 s de colchón a cada lado; nunca menos de 3 s por región |
| Datos | de prueba; nada privado; sin credenciales ni pantallas de login |
| Cámara | archivo aparte, a cuadro completo, a la altura de los ojos, luz de frente; setup en `yt/SETUP-GRABACION.md` |

---

## 9. Ejemplo completo

La tanda del 2026-09-25, **"Migrar a Claude Opus 5.5 sin que se rompa tu código"**, está en
[`piezas/guiones/2026-09-25-opus-5-5-migracion.md`](piezas/guiones/2026-09-25-opus-5-5-migracion.md),
con sus capturas reales en `hermes-content/captures/2026-09-25-opus-5-5/`. Es el molde: un tema,
todas las plataformas, cada frase con su prueba.

---

## 10. Antes de pasar a "grabar": la puerta

- [ ] ENSEÑA y PRUEBA llenas en cada pieza.
- [ ] Cada dato con fuente y fecha; si la verificación tiene más de 7 días, re-verificado.
- [ ] Las noticias con `vence:` y sin "salió hoy" pasadas las 48 h.
- [ ] Las capturas existen y se **miraron** (la hoja de contacto no alcanza: se abre cada PNG).
- [ ] El CTA apunta a un recurso vivo verificado hoy, o no promete.
- [ ] No contradice otra pieza publicada o agendada. Si la contradice, se decide cuál manda y
  la otra se corrige.
- [ ] Nada privado en pantalla ni en el audio.
- [ ] La plantilla completa: sin CUE literal, la edición no sincroniza.
