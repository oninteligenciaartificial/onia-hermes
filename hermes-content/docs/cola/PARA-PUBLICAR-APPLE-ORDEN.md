# Patrón `apple-editorial` — las 5 piezas y en qué orden salen

Índice de la tanda. **Ocho piezas**; las tres últimas se agregaron el 10-sep y tienen su propio doc: [`PARA-PUBLICAR-APPLE-TRES-CUENTAS.md`](PARA-PUBLICAR-APPLE-TRES-CUENTAS.md). Cada pieza tiene su propio doc con caption, alt text y la fuente de
cada afirmación; esto dice **cuál va primero y qué falta antes de tocar publicar**.

> Dónde encaja esta cola en el conjunto: [`../ONIA_MARCA_PERSONAL_TRES_CARRILES.md`](../ONIA_MARCA_PERSONAL_TRES_CARRILES.md)
> — público, entregable y comunidad, con qué NO va en cada uno.

Todas rendidas a 1080×1350 en `carousels/out/apple-<pieza>-inter/`.

## El orden, y por qué

| # | Pieza | Láminas | Por qué va acá |
|---|---|---|---|
| 1 | **Mi stack** | 11 | Es la que define la cuenta: autoridad + guardable, y su CTA construye la lista de gente que pide cosas |
| 2 | **Fable 5.1** | 8 | **Es lo único con fecha de vencimiento.** Es noticia: cada semana que pasa vale menos |
| 3 | **Founders bolivianos** | 1 | Humor de pertenencia — la más compartible de las cinco, y descansa después de dos carruseles largos |
| 4 | **Tu cuaderno no miente** | 1 | Nombra el problema del cliente sin nombrar el producto. Prepara el terreno |
| 5 | **Necesito vitamina C** | 1 | Personal y liviana. Va al final porque no aporta valor de uso, aporta cercanía |
| 6 | **Las seis respuestas** | 6 | La más guardable: entrega algo que se usa hoy · `@sergiourcullo` |
| 7 | **Seis archivos esta semana** | 8 | Invita a la comunidad mostrando lo que ya existe · **no antes del dom 13** |
| 8 | **Cuatro cosas a mano** | 7 | 🔵 **`@oniahq`** — vende el sistema sin hablar de nosotros |

⚠️ **Fable se puede adelantar al puesto 1 si van a pasar más de dos semanas hasta el
segundo post.** Es la única decisión de orden que depende del calendario: las otras cuatro
no caducan.

## Qué falta antes de publicar cada una

| Pieza | Bloqueante | Estado |
|---|---|---|
| **Mi stack** | La guía que promete la lámina 11 tiene que existir | ✅ **publicada** — `claude.ai/code/artifact/667b1ec5-e963-4f8d-b43c-268f4b4243c5` |
| **Mi stack** | El DM con el link, listo para pegar — `PARA-PUBLICAR-DM-STACK.md` | ✅ escrito, un solo mensaje |
| **Mi stack** | 👀 Sergio Urcullo tiene que **leer la guía** antes de publicar: va con su nombre | 🔴 pendiente |
| **Mi stack** | "Todos los días posteo" (lámina 10) es un compromiso, no un dato medido | 🔴 depende de Sergio Urcullo |
| **Mi stack** | "Próximamente" en la lámina 08 es una excepción a *La venta nunca exhibe obra*, ya ratificada | ✅ ratificada 06-sep |
| **Fable** | Revisar la página de Anthropic si pasa más de un mes: la pieza cuelga de su tabla | ⏳ vigente al 07-sep |
| **Founders BO** | Nada. Cero cifras y cero promesas: no hay nada que sostener después | ✅ |
| **Duelo cuaderno** | Nada. Los dos remates son propiedades verificables | ✅ |
| **Vitamina C** | Las cifras del panel de clientes (**12 · +3**) están **inventadas** | 🔴 excepción pedida por Sergio Urcullo, marcada en su doc |

## Cierres: las cinco obligan a comentar

Pedido de Sergio Urcullo del 06-sep: *"siempre cerrá las cosas obligando a que comenten"*.

| Pieza | Cierre | Tipo |
|---|---|---|
| Mi stack | **Comentá «STACK»** y te paso la lista con el paso a paso | intercambio |
| Fable | ¿Cuál usás: Claude, ChatGPT o Gemini? | elección de tres |
| Founders BO | ¿Cuál es tu combinación de las tres? | elección |
| Duelo cuaderno | ¿Cuál de las tres te costó más responder? | elección de tres |
| Vitamina C | ¿Cuál de las cuatro te está costando más? | elección de cuatro |

**Ninguna usa palabra clave con respuesta automática.** La cuenta `@sergiourcullo` tiene
`palabras: {}` en el workflow n8n activo de private-reply (medido 04-sep): una palabra
clave hoy sale con `palabra=null` y **quien comenta no recibe nada, sin dejar registro**.
El "Comentá STACK" de Mi stack sí pide una palabra, pero **la entrega es a mano y la lámina
lo dice** — no promete un envío instantáneo que no existe.

El día que se cableen las palabras en n8n, la lámina 11 de Mi stack es el lugar exacto
donde entra la automática, y el texto ya no habría que tocarlo: sólo el pie.

## Lo que comparten las cinco

- **Ninguna lleva precio de producto.** Son contenido, no venta.
- **Ninguna afirma tener clientes pagando**, salvo el panel de Vitamina C, que es la única
  excepción y está marcada en rojo en su doc.
- **Todos los logos son oficiales o de simple-icons (CC0)**, en el color vigente de cada
  marca. Los objetos son de Unsplash y Pexels, con autor y licencia en
  `references/ui-patterns/apple-editorial/objetos/CREDITOS.md`.
- **Tipografía Inter**, elegida por Sergio Urcullo mirando el A/B el 06-sep. Autohospedada:
  nada de Google Fonts en tiempo de render.
