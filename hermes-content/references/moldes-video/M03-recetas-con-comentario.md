# Molde M03 — Carrusel de recetas que fuerza el comentario

> Pedido de Sergio el 2026-08-24: *"aprende a hacer ese tipo de videos que recomienda
> prompts pero incita a comentar, que sí o sí comenta"* — más *"las piezas no sirven"* y
> *"usá Higgsfield para diseñar tus carruseles"*.
>
> **No se inventó nada acá.** Todo sale de fichas que ya teníamos analizadas en
> `video-intake/analisis/2026-08-20-items.json`: `DbWx7fsD1_k` (@ai._kid, 8 agentes),
> `DcPf2NwCaDK` (5 empleados IA) y `DcEYP7tjsIA` (recetas de Nano Banana).

## Por qué las piezas anteriores no servían

| Lo que hacía | Lo que falta |
|---|---|
| Contaba una anécdota mía | El que lo lee no se lleva **nada usable** |
| Moraleja genérica | Sin receta, sin nombres, sin pasos |
| Sin palabra clave | No lleva a ningún lado |
| CTA solo en la última lámina | Se pide el comentario una vez y tarde |

## Los 4 mecanismos que fuerzan el comentario

Extraídos de las dos fichas de carruseles que sí convierten:

1. **La píldora de CTA se repite al pie de CADA lámina**, no solo al final. El lector decide
   comentar en la lámina 3, no en la 7 — y si el pedido no está ahí, se va.
2. **El cierre ROMPE el patrón visual.** Todas las láminas tienen foto o ilustración; la
   última no tiene ninguna. El cambio de ritmo es lo que hace que se lea.
3. **La palabra clave va en bloque de color, itálica grande.** Es el único elemento de esa
   lámina. No compite con nada.
4. **Remate literal de invitación:** *"te espero en los comments ↓"*. Directo, sin adorno.

## 🔴 La zona de prueba — esto es lo que separa una promesa de una demostración

En el carrusel de @ai._kid, cada lámina termina con **2-3 tarjetas que muestran el OUTPUT
REAL** de ese agente, con etiqueta monoespaciada arriba (DOLOR 1 / HOOK / CURIOSIDAD).

**Sin la zona de prueba, un carrusel de recetas es una lista de promesas.** Con ella, el
lector ve lo que va a obtener y por eso pide la receta.

Traducido a lo nuestro: si la lámina dice "este prompt te arma X", abajo va **X, renderizado
de verdad**. Nosotros podemos hacerlo porque generamos las imágenes.

## La estructura

| Lámina | Contenido |
|---|---|
| 1 · Portada | Gancho de NÚMERO + DELEGACIÓN. Grilla de miniaturas de lo que viene. Handle + "deslizá →" |
| 2-6 · Recetas | Plantilla idéntica, cero variación de layout: contador `0N/05` · título corto · **el prompt literal** · zona de prueba con el resultado · píldora de CTA al pie |
| 7 · Cierre | Rompe el patrón: sin imagen. Pregunta + palabra clave en bloque grande + una línea de qué recibís + "te espero en los comments ↓" |

**Branding por repetición:** el handle y la promesa van en el pie de las 7. En el original el
dominio aparece 10 veces.

---

# 🔴 Cómo se escriben los prompts de imagen (esto me corrigió a mí)

La ficha `DcEYP7tjsIA` dice, textual:

> *"el texto es CORTO y sin jerga fotográfica — ni lente, ni f-stop, ni esquema de luz. La
> instrucción de estilo entera es un nombre propio: 'the AD magazine photography version'"*

**Probado el 2026-08-24 con A/B real, mismo tema, mismo modelo:**

| Prompt | Resultado |
|---|---|
| Mío, largo: *"Editorial photograph, late night. A single laptop on a bare desk seen from behind and slightly above... minimal, disciplined, almost empty... natural true-to-life colors, no color grading, no filter look"* | **Plano, vacío, frío.** Pared desnuda ocupando medio cuadro. Parece foto de stock de nada |
| Corto: *"A laptop alone on a desk at night. Kinfolk magazine photography."* | **Madera con textura, planta, taza, lámpara, ventana con ciudad.** Profundidad y luz real |

**La sobre-especificación estaba matando la foto.** Pedí "bare", "minimal", "almost empty" y
el modelo obedeció: me dio literalmente nada. Y "no color grading" le sacó justo lo que hace
que una imagen se vea bien.

## Las reglas nuevas para prompts de imagen

1. **Corto.** Una o dos frases.
2. **El estilo se delega a un nombre propio**: *Kinfolk*, *Architectural Digest*, *Cereal
   magazine*, *National Geographic*. El modelo ya sabe qué significan; yo no tengo que
   explicárselo con parámetros de cámara.
3. **Cero jerga fotográfica.** Nada de lente, apertura, ángulo, esquema de luz.
4. **Nunca pedir vacío.** "Minimal", "bare", "empty" producen imágenes muertas. Si se quiere
   espacio para texto, se resuelve con el scrim en el render, no pidiéndole al modelo que no
   ponga nada.
5. **Para consistencia entre imágenes: la referencia, no el texto.** La ficha es tajante —
   *"la consistencia no la sostiene con texto ni con seed: la sostiene la referencia"*.
   Se dirige por índice (`image 1`, `image 2`) y **el orden de carga es parte del prompt**.
6. **Encadenar:** la salida de un paso es la `image 1` del siguiente. Así se conserva el
   escenario mientras cambia lo demás.
7. 🔴 **Ojo con el texto en inglés.** El prompt corto delega el estilo a revistas anglosajonas,
   y el modelo mete cartelería en inglés: salió un "CLOSED" grande en una tienda y una revista
   "Grain & Good" sobre un mostrador. Para público boliviano eso rompe la autenticidad.
   **Se resuelve eligiendo la toma o encuadrando el cartel afuera, no agregando "no text" al
   prompt** — pedir ausencia es justo lo que produce imágenes muertas (ver regla 4).

⚠️ Estas reglas **contradicen** los prompts largos que se venían usando para el b-roll de
Lucía. Ahí el prompt largo tiene una razón distinta (lock de vestuario y raccord entre
escenas de un mismo video). **Para imagen suelta manda esta página.**
