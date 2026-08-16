# El algoritmo de X es público — la premisa es cierta, los números están dibujados

- **Video:** https://www.instagram.com/p/DcE1hSeIU3Y/ · 95 s
- **Carril:** B, con el filtro de fuente puesto a fondo
- **Cobertura real:** audio 100% ([verbatim](transcripciones/Instagram-DcE1hSeIU3Y.txt)) · 4 de 25 fotogramas
- **Veredicto: SIRVE, pero NO por los números — por la puerta que abre**

---

## Lo que afirma

> *"X acaba de hacer totalmente público su algoritmo... le pasé el código completo a Cloud y
> después de **más de 4 millones de tokens gastados**, estos fueron los resultados"*

| Afirmación, verbatim | Nivel |
|---|---|
| *"que te den un retweet, te da un punto, pero que te reporten, **te quita hasta 200 puntos**"* | AFIRMADO |
| *"que alguien copie el link de tu post vale **40 veces más que un solo like**"* | AFIRMADO |
| *"tienen un **detector de IA** que te puede banear hasta por 30 días"* | AFIRMADO |
| *"tu primera publicación del día va a tener la mayor tracción y después va disminuyendo"* | AFIRMADO |
| *"si tienes **menos de 1000 seguidores** hacen una excepción y tratan de mostrar tu contenido lo mejor posible"* | AFIRMADO |

## La premisa: VERIFICADA

Chequeado con fuentes, no con el video. **X sí abrió el código.** Musk lo anunció el 10-ene-2026
y el repo salió el 20-ene-2026: [github.com/xai-org/x-algorithm](https://github.com/xai-org/x-algorithm),
Apache 2.0. **Sí existe un directorio `visibility-filtering`** que decide mostrar, descartar o
poner un intersticial. Y hubo una actualización el **13-ago-2026** — tres días antes de este
video — que agregó justamente **los pesos con que se combinan las acciones predichas en el score
final**, más una herramienta de transparencia llamada "Under the Hood".

Fuentes: [repo](https://github.com/xai-org/x-algorithm) ·
[Slashdot 16-ago-2026](https://slashdot.org/story/26/08/16/0223258/x-open-sources-its-ranking-and-filtering-algorithms)

## La prueba: DIBUJADA

En el segundo 48 muestra una tarjeta de código estilizada:

```rust
// visibility-filtering / labels.rs
if post.detected_as("llm_slop") {
  label = "SpamHighRecall"  // cuenta entera
  ban_days = 30             // invisible p/ no-seguidores
}
```

**Eso no es una captura del repo.** Tres señales, todas de la lista del Filtro 1:

1. Es una tarjeta con degradé y semáforo de macOS, no una pantalla de GitHub.
2. **Los comentarios están en español.** El código de X no tiene comentarios en español.
3. `detected_as("llm_slop")` no es una API plausible; los números de línea (41-44) son decorativos.

> *"Si la prueba está dibujada, no es prueba."* — Filtro 1

No digo que sea falso: digo que **está ilustrado**, y que el repo es público, gratis y
consultable. **No hay ninguna razón para creerle a una tarjeta cuando la fuente está abierta.**

## Por qué esto nos toca, aunque no publiquemos en X

Dos cosas, y la segunda es la importante:

**1. El precedente de "leé el algoritmo, no al gurú".** Un repo público convierte una discusión
de opiniones en una consulta. Es gratis.

**2. El detector de "llm_slop".** Si una red social grande está etiquetando y sancionando
contenido generado con IA a nivel de **cuenta entera** — no del post — eso pega de lleno en
**Lucía**, que es una influencer IA declarada, y en toda la producción generativa. La pregunta
que hay que contestar leyendo el código no es "cómo hacerse viral en X": es **qué señales
disparan la etiqueta**, porque esas señales tienden a copiarse entre plataformas. Es la
diferencia entre enterarnos leyendo, o enterarnos cuando una cuenta se apaga.

## Formato — vale la pena copiarlo

Composición **slate arriba / cara abajo**, ~40/60:
- Fondo crema plano, tarjetas minimalistas con un glifo grande y una etiqueta chica
  (`↻ +1 RETWEET` · `🚩 UN REPORTE`), sombra suave.
- Titular naranja de peso alto sobre el slate (`30 DÍAS INVISIBLE`).
- Abajo, cabeza parlante con subtítulos karaoke y **la palabra clave resaltada en el mismo
  naranja** — el color ata el slate con lo que se está diciendo.

Costo: **cero**. Los slates son HTML plano; **HyperFrames los renderiza a MP4** y se componen
sobre la cabeza parlante. Es la vía más barata que vimos para explicar algo con números.

## A dónde va

| Sesión | Qué |
|---|---|
| **`INFLUENCERS IA`** | leer `visibility-filtering` en el repo y sacar qué dispara la etiqueta de IA (prompt E6) |
| **`editor de videos`** | el formato slate/cara con HyperFrames como plantilla reusable (prompt E8) |
