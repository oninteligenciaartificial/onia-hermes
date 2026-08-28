# Las tres métricas de creativo de Meta que casi nadie mira — con fórmula y umbrales

- **Fuente:** https://www.instagram.com/p/DcUTLF1FBf0/ · @ooliveira.arthur
- **Tipo:** MARKETING · **Veredicto:** SIRVE YA
- **Cobertura:** las 6 láminas, al 100%. En portugués.
- **Medido:** Carrusel de 6 láminas.

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Portada:** `MÉTODO GRINGO — AS 3 MÉTRICAS DE CRIATIVO QUE QUASE NINGUÉM OLHA`. *"o Meta te entrega esses números, mas 99% dos gestores ignoram — e queimam verba no escuro."*
- **`MÉTRICA 01 — Play Rate do Hook` (el "para-scroll"):** fórmula **`(Reproduções de vídeo ÷ Impressões) × 100`**. Mide el poder del gancho **visual**, los 3 primeros segundos que frenan el dedo. Umbrales: **Ruim < 30% · Médio 30–50% · Excelente > 70%**.
- **`MÉTRICA 02 — Retenção do Hook` (testa tu promesa):** % de personas que siguen viendo **después** de los 3 primeros segundos. *"Valida la fuerza de tu promesa hablada. Si pararon el scroll pero salieron rápido, la promesa es débil."* Umbrales: **Ruim < 20% · Médio 20–40% · Excelente > 60%**.
- **`MÉTRICA 03 · O OURO — Conversão do Body`:** fórmula **`(Compras ÷ (Thruplays × 0,75)) × 100`**. Mide cuántos compraron después de ver la argumentación en el cuerpo del video, **aislando la fuerza de la copy** sin la interferencia de la edición ni del formato. *"Taxa alta = argumentación validada."*
- **`O HACK — Frankenstein escala sem regravar`:** si el body está validado, **no hace falta grabar video nuevo**. Diagrama: `GANCHO VENCEDOR (hook de 3s validado)` → `BODY + Avatar 1 (mãe casada)` · `BODY + Avatar 2 (solteira)` · `BODY + Avatar 3 (grávida)`. *"1 criativo validado vira **dezenas** de variações — em leilões mais baratos."*
- **`O ATALHO`:** estas 3 métricas **no vienen listas** — se crean como **columnas personalizadas** en el Administrador de Anuncios, usando las métricas nativas de Meta en las fórmulas. La captura muestra `Colunas: Cópia de Desempenho` con `Conversão do Body`, `HKR` y `Play rate do Hook`. *"Para de comprar mídia no feeling: quem lê os **dados frios** ganha o leilão e paga o CPA que quiser."*

## Cómo está hecho — la reconstrucción

- **Por qué las tres juntas son un diagnóstico y no tres números sueltos:** la 01 mide el **gancho visual** (¿frena el scroll?), la 02 mide la **promesa hablada** (¿se quedan?), la 03 mide la **copy del cuerpo** (¿compran?). Si la 01 está bien y la 02 mal, el problema es la promesa, no la miniatura. Si la 02 está bien y la 03 mal, el problema es la argumentación. **Te dice qué parte del creativo cambiar** — que es exactamente lo que un CTR no te dice.
- **El hack de Frankenstein es el mayor ahorro:** validado el body, se recombina con ganchos y avatares distintos sin volver a grabar. Un creativo validado se vuelve decenas de variaciones, y encima en subastas más baratas.
- **Y no hay que construir nada:** son columnas personalizadas en el Administrador. Se crean hoy con métricas nativas.
- **Ojo con el 0,75 de la fórmula 03:** es un factor de ajuste que el carrusel **no explica**. Antes de usarla en producción hay que entender de dónde sale o quedará como número mágico.

## El estilo, como conocimiento portable

Fondo negro con degradado rojo oscuro hacia las esquinas. Sans bold blanca para el titular de dos líneas, y `MÉTRICA 01` arriba en **rojo `#FF2D2D`** mayúsculas chicas con tracking. La fórmula va en una **tarjeta de borde rojo fino redondeada**, centrada, en mono. Los umbrales, en píldoras con punto de color: rojo / amarillo / verde. Icono lineal rojo arriba-derecha. `SWIPE →` abajo-izquierda y puntos de paginación abajo-centro. Muy legible en móvil: una idea, una fórmula, tres umbrales.

**Se porta a:** `hermes-content/references/ui-patterns/tarjeta-metrica-formula/` — la lámina de métrica con fórmula encuadrada y píldoras de umbral.

## Las tres preguntas

1. **Frente:** marketing / ads. Toca el motor de Meta Ads que ya está deployado.
2. **Herramienta nuestra:** El motor de Meta Ads existe. Estas columnas se crean en el Administrador, sin código.
3. **Qué falta:** Nada. Se crean hoy. Lo único a resolver es de dónde sale el 0,75 de la fórmula 03.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R02](prompts-lote-2026-08-28/R02-tres-metricas-creativo-meta-formulas.md)
