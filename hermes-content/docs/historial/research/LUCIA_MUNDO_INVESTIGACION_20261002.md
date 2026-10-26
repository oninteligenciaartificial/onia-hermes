# Lucía — investigación para definir su mundo (2-oct-2026, foto de un día)

> Pedido de Sergio Urcullo (2-oct): investigar cómo publican otras influencers IA, cómo generar imágenes con ropa
> real y lugares aesthetic de Santa Cruz. Lo decidido vive en `references/modelos/lucia/LUCIA.md` § «0. El mundo de
> Lucía» y en `docs/cola/lucia-diario/PLAN.md`. Esto es la evidencia. [M] medido en cuadros · [F] fuente · [I] inferido.

## 1. Cómo publican hoy las influencers IA

- **Lu do Magalu** (Brasil; es el caso más parecido): 7,5M en TikTok, 8 posts del 15 al 29-sep [M].
  - Reels de 24–31 s con 10–14 planos y uno de 28 s hablando en un auto [M].
  - Declara la IA con humor: «acho chique ser virtual» [M].
  - Integra la marca con CTA de WhatsApp: más de R$100M vendidos ahí [F]. Pero cada post junta solo 0,9–2,9k
    reproducciones [M]: producto sin historia no rinde.
- **Lil Miquela:** publica en ráfagas atadas a eventos.
  - Sus récords: carrusel de 2 fotos «¿adivinás mi look para el estreno de Euphoria?» 640k, glow-up de 15 fotos 352k
    y un plano único de 10 s con chiste sobre si es real, 350k [M].
  - Las marcas van dentro de la foto [M].
- **Aitana López:** biografía cerrada (27 años, Escorpio, un gato) y equipo de 11 personas; «con IA se trata de
  volumen» [F].
- **Alba Renai** (Mediaset): etiqueta IA activada en todo [M]. Su pico (88k, 80 veces su promedio) fue una pregunta
  suya que contestan 4 personas reales [M].
- **Patrones que funcionan:**
  1. Atarse a un evento real.
  2. «Adiviná» en carrusel de 2 fotos.
  3. Carrusel con audio en tendencia.
  4. Una locación y un outfit por pieza; el rol cambia entre posts.
  5. La IA dicha con humor y la etiqueta de la plataforma.
  6. Texto en los primeros 0–7 s.
  7. Producto EN USO dentro de la escena.
  8. La IA pregunta y responden humanos reales.
  9. CTA conversacional.
  10. Biografía fija.
- **Una persona, muchos roles:** firma visual constante (Miquela: moños y pecas en 15 outfits; Lu: bob, argollas y
  colgante). El rol se presenta como **disfraz de la misma persona** (cosplay), nunca como otra persona [M/F].
- **Qué sale mal:**
  - Esconder la IA (Mia Zelu, Pellegrini, Guess).
  - **Avatares de «médicas» dando consejos** (ESET, LatAm).
  - Apropiarse de traumas.
  - Presentarse como reemplazo de personas (Tilly Norwood, Santander México).
  - Producto sin historia.
  - B2B: la apertura de las marcas a creadores IA bajó de 86 % a 60 % [F]. → Lucía **guía y demuestra**, no
    recomienda.
- **B2B con tracción: ninguna encontrada.** Lucía no tiene a quién copiar en eso.

Fuentes: TikTok @magalu, @lilmiquela, @albarenai, @emilypellegrini (medidos) · lanacion.com.ar (Aitana, 26-may-2026) ·
mundodomarketing.com.br (Lu) · welivesecurity.com (médicos falsos) · contentgrip.com (B2B) · expansion.mx (Olivia Roa,
Santander).

## 2. Ropa real sin perder la cara (costos de `get_cost`, 2-oct)

- **Método recomendado:** el diario (`seedream_v4_5` + ancla + 4 fuentes de cara) con UNA referencia más, la
  **foto propia de la prenda real**:
  - de frente, fondo liso, sin persona ni cara;
  - va última, con «ignore everything that is not the garment»;
  - **1 cr por imagen**; `quality: high` cotiza igual.
- **Ficha de prenda fija** en el prompt (tela, peso, color hex, cuello, mangas, largo, costuras, una imperfección).
- **Alternativas:**
  - Soul v5 + prenda: 0,12 cr. No está probado que respete la prenda.
  - Nano Banana Pro: 2–4 cr, para sastrería o estampados. Su cara midió peor.
  - GPT Image 2.5: 2,75 cr, para texto bordado.
  - Video: Kling sobre el still aprobado, 6 s a 7,5 cr. Try-on y Seedance omni van de 42 a 72 cr.
- **Reglas:**
  - un rol por imagen;
  - describir lo que cambia, no la cara;
  - la tela fija los pliegues;
  - nombrar costuras y largo;
  - calce en el cuerpo;
  - cero logos inventados;
  - «visible weave / everyday creases»;
  - plano medio a 50 mm con las manos ocupadas.
- **Derechos:**
  - foto de catálogo con modelo = no (tiene dueño y una segunda cara contamina);
  - logo visible sin acuerdo = no;
  - canje con marca = autorización escrita.
- **Lote de prueba sugerido:** 1 prenda × 3 escenas Seedream (3 cr) + las mismas con Soul v5 (0,36) + 1 con Nano
  Banana Pro (2) ≈ **5,4 cr**.

## 3. Santa Cruz que se reconoce

- **Lugares reales** (24 relevados; [F] = foto mirada):
  - **Cafés:** Alquimia (Equipetrol; barra larga de mármol blanco y máquinas negras [F]), L'Arôme, Kawka, Casa Çuina, El
    Orquideario (casona del casco viejo).
  - **Zonas:** Barrio Sirari, calles con nombres de flores.
  - **Gastronomía y noche:** Patio Design (patio cruceño y terraza), Cielo Bar (Green Tower, piso 33), SBC Rooftop.
  - **Hoteles:** Los Tajibos (teja terracota, piscina libre con esfera-cascada, palmeras [F]), Marriott, Cortez.
  - **Torres y mall:** Manzana 40 (torres de vidrio con patrón textil, boulevard con jardines [F]), Green Tower,
    Ventura Mall.
  - **Paseo y naturaleza:** Plaza 24 de Septiembre + Catedral de ladrillo visto [F], Monseñor Rivero, Parque Urbano,
    Las Palmas, Urubó, Güembé, Lomas de Arena.
  - **Interiores de clínicas y oficinas premium sin verificar:** se describen genéricos.
- **Textura que hace creíble:**
  - llanura total y horizonte de bosque;
  - sol duro y cúmulos grandes;
  - palmeras con la base del tronco pintada a la cal;
  - galerías con horcones y teja en el casco viejo;
  - torres de vidrio verde-azulado entre techos de teja en Equipetrol;
  - motos, micros pintados, camionetas japonesas;
  - precios en «Bs», cuñapé y salteña.
- **Delata «no es Santa Cruz»:**
  - montañas, mar, llamas, ropa de altiplano;
  - calles empinadas;
  - abrigo pesado al sol;
  - **tajibos en flor fuera de julio a septiembre** (hoy, 2-oct, no hay);
  - toborochi en flor fuera de mayo y junio.

Fuentes: prensamercosur.org (ranking de cafés, 26-sep-2026) · Wikimedia Commons (fotos) · lostajiboshotel.com ·
baq2024.arquitecturapanamericana.com (Manzana 40) · TripAdvisor · Wikipedia.
