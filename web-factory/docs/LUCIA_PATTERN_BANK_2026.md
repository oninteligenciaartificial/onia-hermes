# Lucía Pattern Bank 2026 — cómo se produce una influencer IA que vende

> Espejo de `CAROUSEL_PATTERN_BANK_2026.md`, para **video y persona IA**. Misma estructura:
> datos con fuente → el molde → catálogo → sistema visual → producción → gate → anatomía de un
> caso real → lo que falta.
>
> **Este banco dice CÓMO se produce.** Qué se publica y cuándo vive en
> `hermes-content/contenido/LUCIA.md`. Quién es ella —ancla, paleta, vestuario, voz— vive en
> `hermes-content/references/modelos/lucia/LUCIA.md`, **y ese archivo manda sobre este**.

---

## 1. Los números que mandan

| Dato | Valor | Qué implica |
|---|---|---|
| **Cuentas IA grandes que mueren** | **6 de 8** del directorio de industria están "Inactive or Discontinued" — Lu do Magalu (30M+), Lil Miquela, Imma, Aitana | Morir es la **norma**, no la excepción. El plan tiene que explicar por qué esta no |
| Seguidores vs engagement | @anora **20k → 0,55%** · @noonoouri **458k → 0,07%** | El número de seguidores es vanidad. Anora gana en vistas con 1/20 de la audiencia |
| Qué las mató | captions que son listas de créditos (`@gucci`, `@openart_ai`) | **El contenido de marca se come la cuenta.** Máx 1 de cada 10 piezas |
| Post que peor rindió del benchmark | un comunicado de texto → **4 likes** | Nunca posteos de solo texto |
| Mejor post del benchmark | *"¿Sabías que hace un año yo no existía?"* → **18.642 vistas** | El gancho meta-IA es lo más barato que tenemos, **y en Bolivia no lo usa nadie** |
| Hueco competitivo | **ninguna** cuenta combina persona IA propia + venta de UN software B2B a PyMEs | Lo más cercano es The Clueless, pero le vende a Santander y Audi |

Fuente: `references/benchmarks/anora-creators-20260806/ANALISIS.md` (medido con la API pública
de IG el 2026-08-07) · `docs/ONIA_LUCIA_BENCHMARK_QUE_VENDE_20260817.md`.

## 2. El molde de una pieza (3 partes, siempre)

```
GANCHO      primeros 2 segundos, texto quemado en pantalla
   ↓
VALOR o HISTORIA completa — nada de teaser
   ↓
CIERRE      una palabra: "comentá X". Nunca "link en bio"
```

**El gancho nunca habla del producto: habla de una reacción.** Un dueño de negocio scrollea un
consejo; frena ante algo que le pasa a él.

**Formato:** 70% reel vertical · 30% carrusel. **Cadencia 3×/semana.**

## 3. Ganchos que funcionan (con su versión)

| Tipo | Versión Lucía |
|---|---|
| **Meta-IA** | *"Hace un año yo no existía."* ← el mejor medido del benchmark |
| **Meta-IA** | *"Soy la primera influencer IA de Bolivia y trabajo para una empresa cruceña."* |
| **POV** | *"POV: sos el dueño y contestás vos los WhatsApp a las 11 de la noche."* |
| **Confesión** | *"Nadie te lo dice: el 80% de tus clientes no se fue con la competencia."* |
| **Pregunta incómoda** | *"¿Cuánto tardás en contestarle a un cliente nuevo? Si decís 'depende', ahí está la fuga."* |

**Prohibido:** *"obligatorio por ley"* sobre la factura electrónica · testimoniar como usuaria
(*"yo lo uso"* — FTC) · consejo médico · inventar un cliente · esconder que es IA.

## 4. Sistema visual — la identidad NO se improvisa

Todo sale de `references/modelos/lucia/LUCIA.md`. Lo esencial para producir:

- **Ancla de cara:** un Element fijo. Nunca una foto suelta.
- **Rasgo distintivo constante:** argollas de oro finas + cadenita + algo terracota en cuadro.
  Es un ancla barata que sobrevive al cambio de escenario.
- **Paleta hex explícita**, no adjetivos. El verde de la marca Onia **no entra** en sus piezas.
- **El realismo se pide como DEFECTO, no como calidad:** aberración cromática en los bordes,
  altas luces quemadas, lente algo ancho, grano. Un prompt que pide belleza produce piel de
  plástico.
- **Oclusión parcial de la cara** (un vaso, una taza) = menos superficie donde el modelo falla.

## 5. Producción — el tarifario MEDIDO

Con `get_cost` y midiendo saldo antes/después, no estimado:

| Para qué | Modelo | Costo |
|---|---|---|
| **B-roll vertical** | `veo3_1_lite` 8 s | **8 cr** — 720×1280 real, 1 cr/s |
| **Encadenar sin tope** | `seedance_2_5` `video_extension` | ~12 cr por tramo de 5 s |
| Escena nueva con su identidad | `seedance_2_0_mini` 720p + `image_references` | 2,5 cr/s |
| Mejor cara actuando | `kling3_0` std | 1,5 cr/s ⚠️ **ignora `aspect_ratio`**, recorta a 9:16 |
| Convertir video real de cliente | `seedance_2_5` `video_edit` | por duración del video |
| **Lipsync** | `sync_so`, `sync_mode: remap` | ~18 cr / 5 s |
| Voz | ElevenLabs — Marcela `86V9x9hrQds83qf7zaGn` | ~2,4 cr / 50 palabras |
| Imagen | `nano_banana_flash` + ancla | ~2 cr |

**Una pieza de 32 s de b-roll con voz montada: ~48 cr.**

**El lipsync cuesta ~5× más que montar la voz encima.** Se usa SOLO donde ella mira a cámara y
habla — o sea el pilar meta-IA. No es el default.

⚠️ Todo gasto de video necesita **OK explícito de Sergio, caso por caso**.

### Las tres vías de generar, y qué hace cada una de verdad

| Vía | Qué hace |
|---|---|
| `start_image` | anima UNA foto. El encuadre queda atado a esa foto |
| `image_references` | **inventa un plano nuevo** manteniendo la identidad. No copia ninguna entrada |
| `start` + `end_image` | **morph entre dos estados** — cambia el vestuario en el medio. Sirve de transición, NO de continuidad |
| `video_extension` | **continúa el mismo plano** conservando ropa y luz. Es lo que rompe el tope de duración |

## 6. Checklist antes de publicar

- [ ] ¿La cara coincide con el ancla? (comparar contra el stack de rasgos, no de memoria)
- [ ] ¿Está el rasgo distintivo en cuadro?
- [ ] ¿La paleta respeta los hex, sin el verde de Onia?
- [ ] ¿Las manos están fuera de plano o lejos de la cara? **Es donde más falla**
- [ ] ¿La etiqueta de IA está puesta? (switch nativo *"Creador de IA"* + la bio)
- [ ] ¿Cero testimonios en primera persona?
- [ ] ¿Si es escenificación, está **rotulada en pantalla**?
- [ ] ¿El lugar dice "Santa Cruz de la Sierra, Bolivia"? (solo "Santa Cruz" arrastra a California)
- [ ] ¿Aprobado por Sergio, y el gasto autorizado?

## 7. Anatomía de lo que hace que una cuenta IA VIVA

De cruzar las que murieron con la que funciona:

| Las que murieron | @anora.creators, la que funciona |
|---|---|
| Caption = lista de créditos de marca | Caption = una pregunta o una confesión |
| El producto de otro es el contenido | El personaje es el contenido |
| Fama de prensa, cero interacción | 1/20 de la audiencia, 8× el engagement |
| Nunca dicen que son IA | *"hace un año yo no existía"* es su mejor post |

**La regla que sale:** la cuenta muere cuando el contenido empieza a servirle a la marca en vez
de al que mira. Y **decir que es IA no es una concesión legal: es el gancho.**

## 8. El límite duro

**Un testimonio en primera persona no se puede fingir.** Lucía es una influencer IA declarada;
que "cuente" que tiene una pastelería y le salvó la temporada es fabricar un cliente.

Las dos variantes legítimas:
- **(a)** un cliente real que quiera contarlo, con su voz
- **(b)** **escenificación rotulada en pantalla** — *"así se vería tu día con el sistema"*

Se copia la estructura y el registro coloquial. **Nunca la biografía.**

⚠️ Esto aplica también a las **series por rubro** de `@oniahq` (decidido 2026-08-17): mostrar
el producto en una veterinaria o un comercio con escenas generadas está bien **si el rótulo
está**. Sin rótulo es un caso de éxito inventado, y en Santa Cruz el primer prospecto que
pregunte *"¿qué veterinaria?"* quema la venta y las siguientes.

## 9. Lo que sigue sin resolver

| Qué | Quién |
|---|---|
| **El origen de los videos de los que sale su cara.** La regla propia dice "nunca una persona real sin consentimiento" y el material vino de más de una fuente | **solo Sergio** — y no conviene descubrirlo con la cuenta pública |
| El % del pilar informativo genérico | Sergio |
| Su handle real (el motor tiene `@lucia.antelo.oficial` hardcodeado y nadie lo confirmó) | Sergio |
| Dos captions piden palabras clave eliminadas (MODELO, CLIENTES) | yo — edición de texto |

---

**Fuentes:** `references/benchmarks/anora-creators-20260806/ANALISIS.md` ·
`docs/ONIA_LUCIA_BENCHMARK_QUE_VENDE_20260817.md` ·
`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md` (el tarifario medido) ·
`docs/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` (los 4 pilares).

Relacionado: `CAROUSEL_PATTERN_BANK_2026.md` · `MOTION_PATTERN_BANK_2026.md` ·
`ADS_PATTERN_BANK_2026.md`.
