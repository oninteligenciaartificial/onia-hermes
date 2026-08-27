# Carrusel del dato ilustrado — el molde de @oniahq

> **Aprobado por Sergio el 2026-08-27**: *"me encantó el diseño, ese diseño tenés que
> seguirlo"*. Este archivo existe para que no se pierda ni se reinvente.

## El arco obligatorio: problema → Onia Platform → CTA

La primera versión de este molde se veía bien y **fallaba en lo principal**. Sergio:

> *"no dice exactamente qué problema vas a solucionar… con Onia Platform solucionás esto,
> esto, esto. Porque es contenido para la cuenta de Onia HQ."*

Planteaba el problema, lo desarrollaba con un dato bueno, y **nunca nombraba el producto**.
En la cuenta de la empresa, eso es la mitad del trabajo sin hacer.

**La estructura, sin excepciones:**

| # | Rol | Qué hace |
|---|---|---|
| 1 | portada | **El problema, matado de frente.** No un acertijo: la pérdida, dicha |
| 2 | el dato | La cifra grande con su fuente. Sin fuente **no se dibuja** |
| 3 | por qué pasa | Que el lector se reconozca: "esto me pasa" |
| 4 | el giro | Lo que casi nadie sabe. Es la lámina que se comparte |
| 5 | 🔴 **la solución** | **"Con Onia Platform"** + 3 o 4 cosas concretas que resuelve |
| 6 | guardá esto | Preguntas o checklist. Se guarda, y guardar pesa en el alcance |
| 7 | cierre | La frase que resume + la palabra clave |

**La lámina 5 no es opcional.** Sin ella la pieza es un problema sin dueño: buen contenido
que no vende nada.

## La caption sigue el mismo arco

```
EL PROBLEMA: <la pérdida en una línea>
<el dato con su fuente>
<el giro que casi nadie sabe>

CON ONIA PLATFORM:
✅ <lo que resuelve, concreto>
✅ <…>

<la frase que resume>
⚠️ <la advertencia sobre el dato, si es de otro país o viejo>
Comentá <PALABRA> y te paso <la recompensa>.
```

**Lo que NO va en la caption:** ninguna capacidad apagada, ningún número sin fuente, ningún
testimonio. Con cero clientes pagando eso está prohibido por el catálogo.

## Las reglas del visual

| Elemento | Regla | Por qué |
|---|---|---|
| **Imagen** | UNA por lámina, de fondo a sangre | "imágenes sin sentido sobre imágenes" era el defecto |
| **Repetida** | ninguna imagen dos veces | el gate lo verifica; se lee como plantilla |
| **Tipografía** | Fraunces 900 vs Inter 400, portada al doble del cuerpo | un salto cambia MUCHO un eje, no un poco cinco |
| **Fondo** | sin curvas, sin líneas | el único adorno es la imagen, y la imagen dice algo |
| **Dato** | `dato` + `fuente`, siempre juntos | el motor no dibuja la cifra sin la fuente |
| **Solución** | 3 o 4 ítems, cortos, con marca verde | más de 4 deja de leerse como lista |

## Las ilustraciones

Bloque de estilo **idéntico** pegado al final de cada prompt — la constante es el estilo y
la variable es solo el sujeto:

```
Ilustración de afiche serigrafiado a tres tintas, estilo risografía, textura de
papel y grano visible, registro ligeramente desplazado. Paleta: verde #10C26B,
negro verdoso #0A0F0D, papel hueso #F4F5F2. Vista frontal, figuras planas.
Escena llena de objetos. Sin texto ni letreros en la imagen. Escritura a mano
ilegible, sin palabras reconocibles. Deja libre el tercio superior.
```

- **El prompt va en español.** En inglés mete cartelería en inglés, y el público es boliviano.
- **La tipografía NO se genera**: va en la capa de layout, para que el español quede bajo control.
- **El tercio superior libre** no es capricho: es donde apoya el texto.
- Cuestan **2 créditos** cada una. El banco vive en `oniahq/ilustraciones/` y se **reusa entre
  piezas del mismo rubro** — con 900 créditos al mes no alcanza para 5 nuevas por pieza.

## Cómo se produce

```bash
node scripts/carousel_gate.js  --brief <brief.json> --pack dato-ilustrado
node scripts/carousel_render.js --brief <brief.json> --pack dato-ilustrado \
  --account onia --out <salida>
```

El gate corre **antes** y falla ruidoso. No se renderiza con el gate en rojo.
