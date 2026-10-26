# Patrón `apple-editorial` — la cola y en qué orden sale

> ⚠️ **Reescrito el 10-sep con el reparto cerrado.** La versión anterior daba las 8 a
> Instagram y asumía que todas estaban bien; la auditoría dijo lo contrario y Sergio
> Urcullo movió «Mi stack» a la comunidad. Veredicto pieza por pieza y el porqué de cada
> lugar: [`AUDITORIA-8-CARRUSELES.md`](AUDITORIA-8-CARRUSELES.md), sección «El reparto,
> cerrado». Los lugares los manda [`../ONIA_DONDE_VA_CADA_COSA.md`](../ONIA_DONDE_VA_CADA_COSA.md).

Cada pieza tiene su propio doc con caption, alt text y la fuente de cada afirmación.
Todas rendidas a 1080×1350 en `carousels/out/apple-<pieza>-inter/`.

## Lo que sale, y en qué orden

| # | Pieza | Lám. | Dónde | Cuándo |
|---|---|---|---|---|
| 1 | **Fable 5.1** | 8 | `@sergiourcullo` | 🔴 **hasta el domingo 14-sep o se tira** — es noticia y ya lleva 4 días rendida |
| 2 | **Mi stack** (recortada 11→5) | 5 | 🔒 **comunidad**, Announcements | **lunes 14-sep**: abre la semana «Mi stack» del motor |
| 3 | **Founders bolivianos** | 1 | `@sergiourcullo` | después de Fable — la más compartible, descansa el feed |
| 4 | **Tu cuaderno no miente** | 1 | `@sergiourcullo` | siguiente |
| 5 | **Las seis respuestas** (recortada 6→4) | 4 | `@sergiourcullo` | siguiente — la más guardable |

⚠️ **Founders y Cuaderno llevan el dato en el CAPTION, no en la lámina** (Stripe no acepta
Bolivia · las 3 preguntas). Publicarlas sin su caption las deja en meme. Copiar de sus
docs `PARA-PUBLICAR-APPLE-*`, tal cual.

## Lo que NO sale todavía (y su condición exacta)

| Pieza | Condición para volver a la cola |
|---|---|
| **Seis archivos esta semana** | rehacer en 3 láminas ENTREGANDO un archivo (no anunciándolo). Atada a fecha: «arranca el lunes» caduca el 14-sep — si no se rehace antes, se rehace para la semana 2 |
| **Cuatro cosas a mano** (`@oniahq`) | rehacer con el ángulo del tiempo (la auditoría del drop D3 aplicada al rubro). Sigue valiendo: SOLO módulos 🟢 del catálogo |
| **Necesito vitamina C** | ⛔ **no se publica** — sin dato y con el panel «12 clientes · +3» inventado. Si el chiste vuelve, vuelve sin el panel |

Regla de las dos a rehacer: **no se tocan hasta tener su dato escrito en una línea.**

## Cierres: todas las públicas obligan a comentar

Pedido de Sergio Urcullo del 06-sep: *"siempre cerrá las cosas obligando a que comenten"*.

| Pieza | Cierre | Tipo |
|---|---|---|
| Fable | ¿Cuál usás: Claude, ChatGPT o Gemini? | elección de tres |
| Founders BO | ¿Cuál es tu combinación de las tres? | elección |
| Duelo cuaderno | ¿Cuál de las tres te costó más responder? | elección de tres |
| Seis respuestas | ¿Cuál repetís? — la frase que más tipeaste | intercambio (te la dejo lista) |

**Mi stack ya no cierra pidiendo comentario**: adentro de la comunidad ya comentaron. Su
cierre anuncia el archivo diario de la semana. Y **ninguna pieza usa palabra clave
automática**: la cuenta sigue con `palabras: {}` en el workflow n8n de private-reply —
toda entrega es a mano.

## Lo que comparten

- **Ninguna lleva precio de producto.** Son contenido, no venta.
- **Ninguna afirma tener clientes pagando.** La única que lo hacía (Vitamina C) no se publica.
- **Todos los logos son oficiales o de simple-icons (CC0)**; objetos de Unsplash/Pexels
  con autor y licencia en `references/ui-patterns/apple-editorial/objetos/CREDITOS.md`.
- **Tipografía Inter**, autohospedada: nada de Google Fonts en tiempo de render.
- Los tres defectos visuales encontrados el 10-sep (gráfico de Fable con barras
  desalineadas, «RESPUESTAS» cortada, tilde sobre la E) están **arreglados y re-rendidos**
  — trampas #17 y #18 de la FICHA.
