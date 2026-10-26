# Dirección estética de Lucía — la biblia visual

> 2026-08-11. Sergio: *"que sea literalmente lo que sería una modelo… agarrá de ejemplo a las
> modelos IA famosas de Instagram… que sea una persona estética, que use Mac, que su post sea
> aesthetic, que sea algo bien perfecto, una muy buena modelo que sí sea la viral."*
>
> Este doc define **cómo se ve** cada pieza. El qué se dice vive en
> `historial/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md`.

---

## 1. Antes de copiar a las famosas: el dato que cambia qué se copia

Medido contra la API pública de Instagram (promedio de los últimos posts visibles):

| Cuenta | Seguidores | Likes prom. | Engagement |
|---|---:|---:|---:|
| **Lu do Magalu** — la virtual #1 del mundo | **9.465.514** | **615** | **0,01%** |
| Noonoouri — agencia IMG | 458.941 | ~333 | 0,07% |
| Shudu — "primera supermodelo digital", Gucci | 235.983 | ~267 | 0,11% |
| **Anora** — vende una comunidad | 20.055 | 110 | **0,55%** |

**Lu do Magalu saca 93 likes con 9,4 millones de seguidores.** Sus captions son *"Festival de
Móveis Magalu"*. Se convirtió en un cartel.

> **La regla que sale de acá: de las famosas se copia la ESTÉTICA, nunca el CONTENIDO.**
> Ellas se ven impecables y por eso las siguieron; se volvieron catálogos y por eso las
> dejaron de mirar. Lucía tiene que verse tan bien como ellas y hablar como Anora.

## 2. El personaje visual: "la dueña joven que tiene todo resuelto"

No es una modelo de pasarela ni una influencer de outfits. Es **una mujer de 26 que maneja su
negocio y cuya vida se ve ordenada, cálida y deseable**. Ese es el gancho aspiracional: el que
mira quiere que su día se vea así.

Aspiracional pero alcanzable: **nada de lujo**. Sin autos caros, sin viajes, sin marcas de
moda. El lujo acá es **el orden y el tiempo libre** — que es exactamente lo que vende ONIA.

## 3. Paleta — cerrada, no negociable

| | |
|---|---|
| **Base** | Crema `#F3EDE4` · blanco roto · lino natural |
| **Madera** | Roble claro, mimbre, cerámica sin esmaltar |
| **Acento cálido** | Terracota `#E4714E` (también su acento en carruseles) |
| **Verde** | Solo el de las plantas reales. **Nunca el verde de ONIA en sus piezas** |
| **Metal** | Oro fino, siempre. Nunca plata ni acero |
| **Prohibido** | Negro saturado, neón, azul frío, gris corporativo, fondos de estudio |

Toda foto tiene que poder ponerse al lado de otra y verse del mismo día.

## 4. Los objetos que SIEMPRE pueden estar en cuadro

Esto es lo que hace que una foto se lea "aesthetic" y no "genérica". Son props, no decoración:

- **MacBook plateada abierta** — es el objeto ancla de su contenido de trabajo
- **iPhone** en la mano o boca abajo sobre la mesa
- Taza de cerámica sin esmaltar, café con leche o matcha
- Cuaderno de tapa dura + lapicera fina
- Vaso de agua de vidrio grueso
- Plantas reales: monstera, potus, hierbas en macetas de terracota
- Lino: mantel, cortina, sábana
- Flores sueltas en un jarrón simple
- Una vela

**Ojo con las marcas:** la MacBook puede verse porque es parte del lenguaje del nicho, pero
**el logo nunca es el sujeto de la foto**. Si el logo domina el encuadre, se descarta la toma.

## 5. Luz — la variable que más decide

| Momento | Cómo se ve |
|---|---|
| **Mañana (el default)** | Luz de ventana grande, suave, difusa. Sombras largas y blandas |
| **Golden hour** | Contraluz cálido que dibuja el borde del pelo. Para exteriores |
| **Noche** | Una sola lámpara cálida. Nunca luz de techo |

**Prohibido:** flash directo, luz fluorescente, mediodía duro, luz mixta cálida-fría. Si la
foto se ve plana o verdosa, se descarta.

## 6. Composición

- **Espacio en blanco generoso.** El encuadre apretado se lee barato.
- **Ella no siempre mira a cámara.** Mitad de las tomas es mirando afuera, trabajando, riendo
  con alguien fuera de cuadro.
- **Manos en cuadro.** Sosteniendo la taza, tipeando, acomodándose el pelo. Las manos son lo
  que hace que una foto se sienta vivida.
- **Un solo punto de interés** por foto.
- **Profundidad**: siempre algo desenfocado adelante o atrás. La foto plana se lee IA.

## 7. Vestuario (los 3 atuendos ya definidos, sin agregar nuevos)

| | |
|---|---|
| **A · clean girl** | Camisa de lino crema o top acanalado, jeans rectos, cadenita de oro fina |
| **B · calle** | Top terracota, pantalón blanco ancho, argollas chicas |
| **C · casa** | Vestido midi verde oliva o punto crema, sin joyas |

Pelo suelto con ondas suaves o recogido descuidado. Maquillaje mínimo, piel real con pecas.
**Nunca:** ropa de oficina formal, tacos altos, vestidos de noche, logos de ropa.

## 8. La plantilla de prompt (usar tal cual, cambiando solo la escena)

```
A real photo taken on a phone, unposed.
<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>> [ESCENA + ACCIÓN].
Keep her face exactly as in the reference: same bone structure, freckles, real skin texture.
[ATUENDO A/B/C].
Warm neutral palette: cream, linen, light oak, terracotta accents, real plants, thin gold jewelry.
Soft diffused morning window light, gentle shadows, shallow depth of field with something
out of focus in the foreground.
Calm, tidy, aspirational everyday scene. Natural and beautiful, like a lifestyle creator's photo.
```

**Reglas del prompt, aprendidas a los golpes:**
1. **Cero negaciones.** Escribir *"sin logos"* produce logos. Solo afirmaciones.
2. **"Santa Cruz" sola arrastra a California.** Siempre *"Santa Cruz de la Sierra, Bolivia"*.
3. **Primer plano de cara → Element + `nano_banana_2`.** Cuerpo y escena → `text2image_soul_v2`.
4. **"Aesthetic" se pide con OBJETOS y LUZ, no con la palabra.** Nombrar el lino, la cerámica,
   la MacBook y la luz de ventana funciona; escribir "aesthetic" no hace nada.

> ⚠️ **Corrección de rumbo del 2026-08-11:** la tanda anterior fue en la dirección equivocada
> — se pidió grano, ruido, foco imperfecto y un mostrador desordenado buscando "realismo
> documental". Eso la hace ver descuidada, no real. **Lo que se busca es pulido y cálido:**
> las cuentas que se hacen virales en lifestyle son impecables, no crudas. Esas 4 imágenes
> quedan descartadas aunque se logren bajar.

## 9. Las 12 escenas del banco (para producir cuando se destrabe el CDN)

| # | Escena | Atuendo | Formato |
|---|---|---|---|
| 1 | MacBook abierta en mesa de madera, café al lado, ella tipeando | A | 4:5 |
| 2 | Sentada en el piso contra la pared, laptop en las piernas, luz de ventana | C | 4:5 |
| 3 | Taza de cerámica en las dos manos, mirando afuera | C | 4:5 |
| 4 | Escritorio ordenado visto desde arriba, sus manos y la MacBook | A | 1:1 |
| 5 | Caminando por vereda de ladrillo en Santa Cruz de la Sierra, Bolivia | B | 4:5 |
| 6 | Riendo con alguien fuera de cuadro en un café con plantas | A | 4:5 |
| 7 | Selfie de espejo, baño limpio, luz de mañana | A | 9:16 |
| 8 | Hablando a cámara en el auto, luz de día | B | 9:16 |
| 9 | Cocina con hierbas en la ventana, preparando café | C | 4:5 |
| 10 | Pared lisa crema, dos tercios inferiores, espacio para texto | B | 9:16 |
| 11 | Golden hour en exterior, contraluz en el pelo | B | 4:5 |
| 12 | Mesa con cuaderno, lapicera, flores y el celular boca abajo | — | 1:1 |

**Costo estimado:** ~18 cr con Element. **No generar hasta que el CDN de Higgsfield deje de
devolver `AccessDenied`** — ver `references/modelos/lucia/biblioteca-20260808/LEEME.md`.

---

Relacionado: `ONIA_MODELOS_RAIZ.md` (índice) · `historial/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md`
(qué se dice) · `references/benchmarks/anora-creators-20260806/ANALISIS.md` (la cuenta que sí
convierte) · `ONIA_MODELOS_RECETA_VISUAL_20260806.md` (bloques de identidad).
