# Fanvue — mecánica MEDIDA con F12 (fanvue.com, 2026-08-18)

> Sergio: "es la mejor web que he visto; aprendé cómo se hace y usá esas tipografías".
> Esto NO es opinión: son valores leídos del DOM en vivo con `getComputedStyle`.
> Regla de la casa: se toma la MECÁNICA, nunca la identidad ni el rubro.

## 1. Tipografía — los números exactos

| Elemento | Tamaño | Peso | Line-height | Tracking | Ratio lh/fs |
|---|---|---|---|---|---|
| H1 hero | 49,79 px | **500** | 49,79 px | −0,2 px | **1,00** |
| H2 sección | 49,79 px | 500 | 49,79 px | −0,2 px | 1,00 |
| H2 grande | **80 px** | 500 | 72 px | **−1,6 px (−2 %)** | **0,90** |
| H2 "FAQ" | 106,6 px | 400 | 85,3 px | normal | **0,80** |
| Nav / meta | 13,31 px | 500 | 13,31–19,97 px | −0,1 px | 1,0–1,5 |
| Nombre en card | 28,8 px | 500 | 28,8 px | −0,576 px (−2 %) | 1,00 |

**Las 4 leyes que se extraen:**
1. **Line-height ≤ 1,0 en display.** Cuanto más grande el titular, MÁS apretado: 1,00 a
   50 px → 0,90 a 80 px → 0,80 a 106 px. Eso es lo que hace que un titular gigante se
   lea como un bloque sólido y no como líneas sueltas.
2. **Tracking negativo que ESCALA con el tamaño**: ≈ −0,4 % a 50 px y **−2 % a 80 px**.
   No es un valor fijo: es proporcional.
3. **Peso 500, jamás 700/800.** El impacto sale del TAMAÑO y del apretado, no del grosor.
   Su display más grande (106 px) usa peso 400.
4. **El texto de cuerpo no es negro puro**: `rgba(22, 22, 19, 0.75)` — off-black al 75 %
   de opacidad. Baja el contraste del párrafo para que el titular mande.

**Sus fuentes**: `Medium AG Next` (Akzidenz Grotesk Next) + `Akzidenz Grotesk Pro Med`.
⚠️ **Son de pago (Berthold): NO se pueden usar sin licencia.** Onia ya tiene el
sustituto correcto elegido y medido: **Archivo** (Google, gratis) con el tracking −2 %,
que es exactamente el "efecto Apple" que ya estaba documentado en nuestra medición
previa. **Lo que se copia es la mecánica de arriba, no el archivo de fuente.**

## 2. Color

- Fondo negro puro `rgb(0,0,0)` + **verde brillante de señal** `rgb(73,242,100)` y
  `rgb(161,255,98)` como acento único (mismo terreno que el verde de Onia).
- Superficies: blanco/hueso al **15 % de opacidad** (`rgba(239,238,236,0.15)`) — no
  grises opacos: transparencias sobre el negro. Da profundidad sin bordes.
- Un azul (`rgb(56,152,236)`) como segundo acento puntual, nada más.

## 3. Densidad visual — el hallazgo grande

**132 imágenes y 10 videos en UNA página.** No es una landing de texto con adornos: es
una landing de MEDIA con texto encima. Ahí está la diferencia con la nuestra, que es casi
toda tipografía + mockups dibujados.

## 4. Layout

- **Medida de línea angosta para texto**: contenedores de **819 / 823 / 896 px** máx.
  El texto nunca cruza la pantalla entera aunque la sección sea de 2000 px.
- **Gaps generosos**: 46,7 · 71,2 · 115,6 px. El aire es parte del diseño, no sobra.
- Flex sobre grid para casi todo; secciones con padding 0 y contenedor interno.

## 5. Movimiento

- **Marquesina infinita**: `35s linear infinite scrolllogo` — logos/pruebas desplazándose
  para siempre, sin controles. Transform en X (medido: `matrix(1,0,0,1,−52,0)`).
- Transiciones de color: `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)` (easeOutQuad).
  Cortas y suaves; cero animación de layout.

## 6. Qué portar a Onia (y qué no)

| Se porta | Cómo |
|---|---|
| lh ≤ 1,0 en display con escala inversa | tokens: `--lh-display: .9` a partir de 64 px, `.8` a partir de 96 px |
| tracking −2 % proporcional | `letter-spacing: -0.02em` en display, `-0.004em` en subtítulos |
| peso 500 para titulares | Archivo 500, nunca 700 |
| cuerpo a 75 % de opacidad | token de texto secundario sobre el fondo |
| superficies por transparencia (15 %) | reemplaza los grises opacos de nuestras tarjetas |
| medida de línea ≤ 900 px | contenedor de texto propio, independiente del de sección |
| marquesina 35 s de prueba social | solo con material REAL (capturas del producto), nunca logos inventados |
| densidad de media | usar las capturas reales del dashboard/pantallas, no mockups dibujados |

| NO se porta | Motivo |
|---|---|
| AG Next / Akzidenz | fuentes de pago sin licencia → Archivo |
| Testimonios de creadores con caras | no tenemos clientes; fabricarlos está prohibido |
| Fondo negro total | la dirección de Onia es claro premium (decisión de Sergio) — el negro se usa como ANCLA de sección, no como base |
