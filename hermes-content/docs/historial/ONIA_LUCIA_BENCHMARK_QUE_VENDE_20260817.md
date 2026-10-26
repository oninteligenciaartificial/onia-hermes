# Benchmark — influencers IA que VENDEN (no solo que suman seguidores)

> 2026-08-17. Encargo: traer el mecanismo comercial de cuentas de influencers IA que venden algo
> de verdad, para decidir el enfoque de Lucía. **Este doc AMPLÍA el benchmark existente, no lo
> reemplaza.** Fuente base que ya midió 3 cuentas con datos reales de la API pública el
> 2026-08-07: `ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` y
> `references/benchmarks/anora-creators-20260806/ANALISIS.md`. Acá se reusan esos 3 números
> (ya verificados, no se vuelven a medir) y se suman **5 cuentas nuevas** con datos frescos de
> hoy, más una agencia que es la pieza que más ordena la pregunta de competencia.

---

## 0. Cobertura real — qué herramienta funcionó y cuál no

**No tuve acceso al MCP `ads_library_search` de Meta** (no está en el set de herramientas de
esta sesión — solo Read/Grep/Glob/Bash/Edit/Write). Probé el fetch directo de
`facebook.com/ads/library` por curl: **403 Forbidden**. No pude ver quién paga pauta. Es una
cobertura real que falta, no la inventé ni la until conseguí por otra vía.

**Instagram: bloqueado.** `curl` a `instagram.com/<handle>` devuelve un shell de login sin datos
(probado en `@anora.creators`, 607KB de HTML sin `og:description` útil). No pude medir ninguna
cuenta nueva en vivo — coincide con la advertencia de la consigna.

**Motores de búsqueda: fricción real, documentada, no escondida:**
- **DuckDuckGo** (`html.duckduckgo.com`) funcionó para las primeras 2 búsquedas y después me
  marcó como tráfico anómalo (bloqueo de ~30-60 min típico de su detección de bots) — confirmado
  con una query de control que sigue devolviendo la página de "anomaly" al cierre de esta sesión.
- **Bing** (`www.bing.com/search`) respondió 200 con contenido real para queries genéricas
  ("OpenAI ChatGPT") pero **devolvió resultados basura no relacionados** ("Liberty University",
  "Free Fax") para queries específicas sobre influencers IA — patrón de anti-scraping (decoy
  results a tráfico detectado como bot), no un error mío de query.
- **Lo que sí funcionó, y fue la vía real de esta investigación:** la primera tanda de DuckDuckGo
  (antes del bloqueo) devolvió una lista de URLs reales, y a partir de ahí hice **fetch directo
  por URL** (no por buscador) de cada página con `curl`. Esa vía no tuvo bloqueo.

**Resultado:** 8 cuentas con datos de una fuente directa (`virtualhumans.org`, el directorio de
la industria — no un blog de SEO) + 2 artículos de ingresos/mecanismo + 1 sitio de agencia,
todos fetcheados por URL exacta, ninguno inventado. Descarté una fuente (`reelmind.ai`) por oler
a contenido generado con cifras y "fuentes" (Statista, Forrester) sin link real — no se cita acá.

---

## 1. Las 8 cuentas — qué venden y su mecanismo

| Cuenta | Seguidores | Engagement | Qué vende | Mecanismo | Fuente |
|---|---:|---:|---|---|---|
| [**@anora.creators**](https://www.instagram.com/anora.creators/) | 20.055 | **0,55%** ✅ medido | Comunidad paga de "cómo crear y monetizar influencers IA" (Skool, USD 19-49/mes, 500+ miembros) | 70% espectáculo gratis (reacción, sin marca) compra alcance + 30% oferta diseñada (FAQ, prueba social = captura de la comunidad) convierte | Ya medido, `ANALISIS.md` (2026-08-07) |
| [**@noonoouri**](https://www.instagram.com/noonoouri/) | 458.941 | **0,07%** ⚰️ muerta | Nada propio — imagen de agencia IMG para marcas de lujo, ahora carrera musical | Brand deals tradicionales, caption = lista de créditos | Ya medido, `ANALISIS.md` (2026-08-07) |
| [**@shudu.gram**](https://www.instagram.com/shudu.gram/) | 235.983 | **0,11%** ⚰️ muerta | Nada propio — "primera supermodelo digital", Fenty/Gucci | Brand deals de moda de lujo | Ya medido, `ANALISIS.md` (2026-08-07) |
| [**@magazineluiza**](https://www.instagram.com/magazineluiza/) (Lu do Magalu) | 30M+ (reportado, no medido hoy) | — | El catálogo de Magazine Luiza (retail brasileño, ~USD 552M ganancia reportada en 2019) — **producto propio de la empresa, no de terceros** | Ella ES la cuenta de la marca personificada: unboxing, reseñas de producto, **"tips de software"** de la app/sitio de Magalu. Vive en la barra de navegación del sitio y la app | `virtualhumans.org/human/lu-do-magalu`, fetch directo hoy — tag del directorio: **"Inactive or Discontinued"** |
| [**@casasbahia**](https://www.instagram.com/casasbahia/) (CB) | no medido | — | Igual que Lu do Magalu: catálogo propio de Casas Bahia (retail brasileño competidor de Magalu) | Mismo mecanismo — mascota-personaje = la cuenta de la marca | `virtualhumans.org/human/casas-bahia`, fetch directo hoy — tag **"Inactive or Discontinued"** |
| [**@fit_aitana**](https://www.instagram.com/fit_aitana/) (Aitana López) | ~400.000 | no medido | Nada propio — vitrina para marcas de fitness/gaming/moda (Big, Amazon, Razer, OpenArt AI) + suscripción propia en **Fanvue** | Agencia (The Clueless, Barcelona) la crea y gestiona; cobra ~€/USD 10.000-11.000/mes reportado (2 fuentes coinciden en el rango, no verificado en vivo) por post + licencia + contenido de suscripción | `virtualhumans.org/human/aitana-lopez` + `weirdwealth.io/ai-influencer-income` — tag **"Inactive or Discontinued"** |
| [**@imma.gram**](https://www.instagram.com/imma.gram/) (Imma) | no medido | — | Nada propio — vitrina de marcas globales (IKEA, Porsche, Dior, Puma, Nike, Calvin Klein, Alibaba) | Agencia japonesa (Aww Inc.) gestiona brand campaigns + apariciones editoriales | `virtualhumans.org/human/imma-gram` — tag **"Inactive or Discontinued"** |
| [**@lilmiquela**](https://www.instagram.com/lilmiquela/) (Lil Miquela) | ~2,5M reportado (no verificado en vivo) | — | Música (streams), moda (Prada, Calvin Klein, Samsung), línea de ropa propia "Club 404" (**discontinuada**) | Startup con capital de riesgo (Brud, USD ~30M levantados, luego adquirida por Dapper Labs) construyendo una celebridad multimedia — el modelo más caro y menos replicable de la muestra | `virtualhumans.org/human/miquela-sousa` — tag **"Inactive or Discontinued"** |

**Nota de honestidad:** los seguidores/ingresos de las 5 cuentas nuevas son los que reporta la
fuente citada (directorio de industria + 2 artículos), no una medición mía en vivo — Instagram
bloqueó el fetch directo. Donde dos fuentes coincidían (Aitana) lo marco; donde hay una sola cifra
ampliamente repetida en prensa (Miquela, USD 11M en 2023 citado por `weirdwealth.io`) **no la pongo
en la tabla** porque no pude cruzarla con una segunda fuente — queda **a verificar**, no afirmada.

---

## 2. Formatos — la anatomía concreta

No pude cronometrar videos reales (IG bloqueado), así que la duración es **por convención de
formato**, no medida en las cuentas — lo marco explícito.

| Dimensión | Tipo A — espectáculo (Anora, 70%) | Tipo B — oferta (Anora, 30%) | Lu do Magalu / Casas Bahia | Aitana López |
|---|---|---|---|---|
| **Duración** | ⚠️ no medida; convención Reels 15-30s | ⚠️ no medida; carrusel sin límite de tiempo | ⚠️ no medida; formato "unboxing/reseña" suele ser 30-90s | ⚠️ no medida; mezcla foto y reel |
| **Cámara vs. voz en off** | ⚠️ a verificar — la fuente no confirma si habla a cámara o es solo b-roll + texto | N/A (es carrusel estático) | Fuerte indicio de **voz/narración** — "unboxing, reseñas, tips de software" es un formato que casi siempre narra | Predominan **fotos**, no video hablado (fuente describe "content... at real-looking locations", no diálogo) |
| **Muestra producto o resultado** | **Resultado/reacción** — nunca el producto. El hook es la reacción ante el artefacto IA, no el artefacto | **Producto/oferta explícita** — captura de la comunidad como creatividad, FAQ de objeciones | **Producto explícito** — es literalmente una reseña o un tutorial de app | **Resultado** — el lifestyle/fitness, la ropa puesta; la marca aparece como atuendo, no como demo |
| **CTA — dónde va** | Ninguno explícito en el post — la bio vende | Link en bio → Skool | Ella ES parte de la navegación del sitio/app de Magalu — no "pide", está incrustada en el flujo de compra | Perfil → DM/negociación de marca (B2B) o Fanvue (B2C suscripción) |
| **Texto quemado** | **Sí, siempre** — fuente de sistema, blanco, sin caja, sin diseño (a propósito: diseñarlo lo vuelve publicidad) | **Sí, pesado** — tipografía bold, cajas de color, marca visible | ⚠️ a verificar | ⚠️ a verificar |

**Lo que un benchmark de industria (`aicreatorworld.net`, con sesgo comercial — vende software
de analítica, así que sus números "objetivo" tienden a ser optimistas) sugiere y que SÍ vale la
pena cruzar contra los datos reales de arriba:**

- Cuentas IA nano/micro (1K-50K) "deberían" rondar 2,5-8% de engagement. **Anora, la cuenta que
  ONIA ya identificó como la que mejor funciona, mide 0,55% real** — muy por debajo del "target"
  de vendor. Conclusión: **no confiar en benchmarks de proveedor; confiar en la medición directa**
  que ya se hizo. La vara real es Anora, no un promedio de industria.
- Reels y carruseles superan a la imagen estática en engagement porque generan "guardados" (la
  señal de mayor peso en IG) — coincide con la regla ya fijada de ONIA (70% reel / 30% carrusel,
  cero texto plano).
- CTAs específicos ("comentá X", preguntas directas, respuesta binaria) superan a los genéricos
  ("contame en comentarios") — **coincide exactamente con la regla ya decidida de Lucía** (CTA de
  una palabra tipo "comentá SISTEMA"), así que no hay que cambiar nada ahí, solo confirma que está
  bien encaminado.

---

## 3. Competencia — el hueco es el hallazgo

**No encontré ningún influencer IA (cuenta personal, no agencia) que le hable directamente a un
dueño de negocio LATAM vendiendo software de gestión.** Tres piezas de evidencia:

1. **Bolivia, específicamente:** `ANALISIS.md` (2026-08-06) ya verificó "Bolivia no tiene
   influencer IA todavía" — esa verificación tiene 11 días, no la repetí hoy (Instagram/buscadores
   bloqueados) así que la cito como **vigente pero no re-confirmada en esta sesión**.
2. **Las 8 cuentas de la tabla:** todas venden moda, fitness, lujo, retail de consumo o "cómo
   crear tu propio influencer IA". Ninguna vende software B2B ni le habla a un dueño de PyME.
3. **El jugador más cercano no es una cuenta, es una agencia — y confirma el hueco en vez de
   cerrarlo.** [**The Clueless**](https://theclueless.ai/) (Barcelona, con oficina en México),
   la agencia detrás de Aitana López, sí vende personas IA como servicio — pero **a marcas
   grandes ya establecidas**: Banco Santander, BBVA, Audi, L'Oréal, Coca-Cola, Amazon. Es B2B,
   pero el comprador es una corporación con presupuesto de agencia, no un dueño de negocio de
   1 a 20 personas que paga Bs 320-1.500/mes. Confirmado por fetch directo de su sitio hoy.

**El hallazgo estructural, no solo el hueco:** de las 8 cuentas, hay **dos especies distintas** y
ninguna es exactamente lo que hace Lucía:

- **Especie 1 — persona IA independiente, monetiza con terceros** (Anora, Noonoouri, Shudu,
  Aitana, Imma, Miquela): vende su propia imagen a marcas ajenas, o vende un curso sobre cómo
  hacer lo mismo. Es el pilar D de Lucía, pero llevado al 100% de la cuenta.
- **Especie 2 — personaje IA que ES la marca** (Lu do Magalu, Casas Bahia): vende el producto de
  **una sola empresa, la propia**, integrado en el flujo real de compra de esa empresa.

**Lucía es un híbrido que no vi en ninguna cuenta de la muestra: persona IA con identidad propia
(especie 1) que vende el producto de una sola empresa propia (mecanismo de especie 2), sin
depender de brand deals de terceros para vivir.** Nadie en esta muestra corre ese modelo. Eso no
prueba que funcione — prueba que no hay a quién copiarle el mecanismo completo, solo piezas
sueltas (ver §5).

---

## 4. Qué NO hacer — "grande y muerta" no es un caso aislado, es el patrón

El benchmark original ya mostró 2 casos (Noonoouri 0,07%, Shudu 0,11%). Esta sesión encontró
**4 más**, todas de fuente directa (`virtualhumans.org`), y las 4 comparten la misma etiqueta del
propio directorio de la industria — **"Inactive or Discontinued"**:

| Cuenta | Escala en su pico | Estado hoy (virtualhumans.org) |
|---|---|---|
| Lu do Magalu | 30M+ seguidores, la más seguida del mundo en su categoría | Inactive or Discontinued |
| Lil Miquela | USD ~30M levantados, portada de TIME, Prada/Calvin Klein | Inactive or Discontinued; su línea de ropa "Club 404" también descontinuada |
| Imma | Campañas con IKEA, Porsche, Dior, Puma, Nike, Calvin Klein, Alibaba | Inactive or Discontinued |
| Aitana López | ~400K seguidores, ~€10K/mes reportado | Inactive or Discontinued |

**Son 6 de 8 cuentas de este benchmark ampliado (contando Noonoouri y Shudu) que en algún momento
fueron el caso de éxito citado por toda la prensa, y hoy están muertas o discontinuadas.** No es
mala suerte de 2 cuentas — es lo que le pasa a la mayoría de las modelos IA que escalaron por
fama/prensa en vez de por audiencia nicho. El patrón que sostiene a Anora (comunidad chica,
0,55% real, mecanismo de venta propio y sostenible) es la excepción, no la norma.

**Bandera roja adicional, específica de Aitana López:** parte de su monetización pasa por
**Fanvue**, una plataforma de suscripción adyacente a contenido para adultos (aparece como
"cliente" en el propio sitio de The Clueless). Es un mecanismo de ingreso real y documentado —
y es exactamente el tipo de adyacencia que Lucía **no puede tocar**: B2B de software necesita
credibilidad ante un dueño de negocio formal, no ambigüedad de marca.

---

## 5. 3 recomendaciones accionables — cada una atada a una cuenta

**1. No perseguir seguidores — perseguir el engagement de nicho que ya funciona, y no tocar
Fanvue-style ni brand-deals-para-vivir.** La evidencia: Aitana (~400K, monetización mixta con
Fanvue) y Lu do Magalu (30M+) están ambas "Inactive or Discontinued" hoy, mientras que Anora
(20K, comunidad propia sostenible) sigue viva y mide 0,55%. El sistema de Lucía ya apunta bien
acá (4 pilares, 3x/semana, sin depender de brand deals) — esta investigación es una confirmación
de no desviarse, no un cambio de rumbo.

**2. Robarle a Lu do Magalu / Casas Bahia el ángulo de "tips de software", no el de mascota de
marca.** Las dos únicas cuentas de la muestra que venden un producto propio de empresa lo hacen
con **reseñas y tutoriales concretos de producto** ("unboxing, reseñas, tips de software"), no
solo hablando del problema en abstracto. El pilar C de Lucía ("el problema que resuelve ONIA")
hoy es 100% narrativo (`ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` — los 6 captions actuales
cuentan el problema, ninguno muestra la pantalla). Meter, dentro del mismo pilar C y sin subir el
10% del pilar D, clips cortos donde se ve la interfaz real de ONIA resolviendo algo — sin
convertirlo en demo de ventas ni testimonio (que Lucía tiene prohibido).

**3. No hay competencia directa que copiar — así que el diferencial no se demuestra por
comparación, se demuestra por ser la primera.** Ninguna cuenta de esta muestra combina persona IA
propia + venta de un solo producto propio de software B2B para dueños de PyME (§3). Y The
Clueless, el jugador más parecido, vende avatares a Santander/BBVA/Audi — corporaciones, no
PyMEs. La recomendación no es "hacer lo que hace X": es que **la etiqueta de "primera influencer
IA de Bolivia" (ya decidida en el sistema de Lucía) sigue siendo el ángulo de prensa correcto**,
porque no hay ningún caso, ni siquiera fuera de Bolivia, de alguien ocupando ese cruce exacto.

---

## 6. Estado — qué queda, qué a medias, qué depende de Sergio

**Queda (en este doc, terminado):** 8 cuentas con link + mecanismo + fuente, anatomía de formato
cruzada contra un benchmark externo, el hueco competitivo confirmado con 3 piezas de evidencia, el
patrón "grande y muerta" ampliado de 2 a 6 casos, y 3 recomendaciones atadas a cuentas concretas.

**A medias / no verificado en esta sesión (dejarlo dicho, no esconderlo):**
- Meta Ads Library — no se pudo consultar (sin MCP en esta sesión, fetch directo 403). Sigue sin
  responderse "quién paga pauta" en este nicho.
- Ninguna de las 5 cuentas nuevas se midió en vivo (Instagram bloqueó el fetch); los números son
  los que reportan `virtualhumans.org` y los 2 artículos citados, marcados como tales.
- La verificación de "Bolivia sin influencer IA" tiene 11 días (2026-08-06) y no se repitió hoy.
- Duración exacta de video y "cámara vs. voz en off" de Lu do Magalu, Casas Bahia y Aitana quedan
  como "a verificar" — ninguna fuente fetcheada lo confirmaba con precisión.

**Depende de Sergio:** decidir si vale la pena un intento posterior con el MCP de Meta Ads Library
disponible (otra sesión, otro toolset) para cerrar el hueco de "quién paga pauta" — no es
bloqueante para las 3 recomendaciones de §5, que no dependen de ese dato.

No toqué `contenido/LUCIA.md`, `references/modelos/lucia/LUCIA.md`, briefs ni el motor de
producción — este doc es solo insumo de research.

---

Relacionado: `ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` (los 4 pilares y los 6 captions vigentes)
· `references/benchmarks/anora-creators-20260806/ANALISIS.md` (las 3 cuentas medidas en vivo) ·
`references/modelos/lucia/LUCIA.md` (identidad visual, manda para todo lo visual) ·
`contenido/LUCIA.md` (qué se publica y cuándo).
