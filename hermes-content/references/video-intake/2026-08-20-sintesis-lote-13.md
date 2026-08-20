# Síntesis — 7 reels analizados (2026-08-20)

## 1. Lo que hay que aprender a hacer

### T1. Contexto persistente como archivo versionado (DESIGN.md / Project-dossier)
Aparece en 2 items (DcOs3VwRK0B, DcL4yjRTNV0) con la misma mecánica y dos dominios distintos.
- **Produce:** salida consistente entre generaciones sucesivas: UI que respeta un lenguaje visual, o un modelo que se re-actualiza cuando llegan datos nuevos.
- **Insumos:** para web, un .md por marca con tokens (color/tipografía/espaciado), patrones analizados y reglas. Para el dossier, documentos primarios del sujeto cargados en un Claude Project (reportes anuales, 10-K/10-Q, proxy statements, EDGAR).
- **Mecanismo exacto:** el archivo vive fuera del chat, en el repo o en el Project, y se inyecta como contexto. No toca runtime, no agrega dependencia, no hay build. El loop de mantenimiento es: llega documento nuevo → se suelta en el MISMO contenedor → "update el modelo". El activo es el contenedor, no el output.
- **Repetible con lo nuestro:** parcial. `impeccable` es literalmente la herramienta #4 del listicle y ya está instalada y es regla de entrada en CLAUDE.md. `design-dna` produce el equivalente desde UNA referencia. **No existe:** un DESIGN.md por cliente en `data/clients`, ni plantilla de Project por rubro.
- **Trampa de nombre verificada:** nuestras skills `taste-design` y `design-md` están atadas a Google Stitch y **no** son las del video. No reportar ese punto como cubierto.

### T2. Entregable editable: fórmulas, no valores pegados
- **Produce:** un archivo que el cliente puede tocar sin volver a pedirnos nada.
- **Insumo:** una línea en el prompt.
- **Mecanismo:** exigir salida en Excel y "todo en fórmulas, que no hayan números fijos, para que luego tú puedas ir y cambiar los supuestos". Sin eso, el output es una foto muerta.
- **Repetible:** sí, hoy, gratis. Es una regla de una línea para la skill `onia-contabilidad-bolivia`. **Advertencia de la fuente:** el .xlsx con fórmulas vivas nunca aparece en pantalla en el reel; la técnica está afirmada, no probada.

### T3. Meta-prompting y el molde del prompt de producto
Dos variantes, una oculta y una completamente a la vista.
- **Oculta (DcL4yjRTNV0):** pedirle a OTRA IA que escriba el prompt largo en vez de escribirlo uno. El prompt maestro resultante nunca se muestra: es el hueco central del video.
- **A la vista (DcOWPT2AIx-), y es el hallazgo portable.** Molde de 5 partes: (a) nombrar un producto real como referencia estética en vez de adjetivos ("what Uber does aesthetically"); (b) pedir un ESTADO, no una pantalla ("all the unnecessary elements on that particular step to be hidden"); (c) especificar UNA interacción concreta (el desplegable del auto seleccionado); (d) acotar el largo del flujo ("a nice two- or three-step flow"); (e) cerrar pidiendo previsualización, que es lo que fuerza un Artifact HTML en vez de prosa.
- **Repetible:** sí, hoy, sin construir nada.

### T4. Reparto IA/humano: andamio de flujo vs oficio visual
- **Produce:** una pantalla que no parece generada.
- **Mecanismo:** la IA resuelve el ANDAMIO DE UX en un prompt (pickup/return + fechas + lista + nav). El oficio visual lo hace un humano después: tipografía, línea de tiempo vertical con punto relleno/hueco, vidrio sobre vidrio, píldoras de filtro, un solo acento de color. En el reel el prototipo de Claude ("Kerb") y el diseño final NO son la misma pieza; comparten esqueleto y nada más.
- **Repetible:** sí, y es exactamente la regla de velocidad de CLAUDE.md (aprobar mockup, después portar fiel). El port se hace con `image-to-code` + la galería propia; **no necesitamos Figma**.

### T5. Verificación medida dentro del entregable (barrido de contraste AA)
- **Produce:** un diseño que llega con su propia auditoría: "I ran an automated AA sweep and eight text roles were failing" → corrige tokens → "13 text/background pairs, all AA".
- **Mecanismo:** oscurecer el fondo de página, recalcular, y entregar el HTML más los .md del análisis.
- **Repetible:** **no existe nada nuestro**. Verificado contra el repo: `contrastRatio|luminance|wcag|axe-core|4.5:1` solo pega en datos de tokens, no hay script ni gate. Es la pieza más valiosa del lote y es código nuevo.
- **Cobertura pobre declarada:** ese bloque se leyó a ~40% de legibilidad; el ratio tiene un dígito dudoso y los nombres de tokens y scripts no se leen. No repetir esos números como propios.

### T6. Descubrimiento como producto: embed oficial de IG + campo derivado
- **Produce:** un catálogo de ganchos de un nicho, con el "por qué funciona" y variantes ya escritas.
- **Insumo:** solo URLs de posts.
- **Mecanismo exacto, y es el truco barato:** no re-hostean nada. Guardan la URL y dejan que el **embed oficial de Instagram** pinte likes, caption, comentarios y handle. Sin token, sin scrapear media. Encima del embed: chips-filtro con contador por categoría (Educador 8 / Storytelling 2 / Otro 1 / Sin categoría 2) y un callout generado por LLM que no es un resumen sino **molde + N variantes** ya adaptadas al rubro del usuario.
- **Repetible:** el montaje sí; el módulo no existe. En `onia-core/contract.json` no hay entidad de post-de-tercero, ni categoría de gancho, ni análisis derivado.
- **El agujero del producto ajeno, que hay que no copiar:** los dos últimos saltos (aplicar → medir) viven fuera del SaaS; la "prueba" son capturas pegadas en un editor de video.

### T7. Empaquetado: matriz plan x feature con tres estados + gate en runtime
- **Produce:** tres vistas coherentes (pricing público, candados dentro del producto, banner de límite) desde UN solo dato.
- **Mecanismo:** cada celda (plan, feature) tiene tres estados con función distinta: check verde = incluida; **candado gris = bloqueada que invita a subir**; cruz roja = cerrada, sin CTA. El candado vende, la cruz roja empuja. Aparte, el gate de asientos: `seats_used == límite` apaga el botón de invitar y muestra "User limit reached - Upgrade to add more members". El cobro no ocurre en la página de precios, ocurre **dentro del producto en el momento en que el equipo crece**.
- **Repetible:** los números ya existen y están apagados. `onia-core/business-tiers.json` define 6 tiers con `maxUsers` (ordenado 3, profesional 8, empresa 20, e1 null), `business-tiers.mjs` expone `tierMeetsLimits()` y `recommendTierForLimits()` con tests y validador propio; **grep de "business-tiers" fuera de onia-core devuelve CERO callers**. Mientras tanto `pricing.ts` usa un campo `usuarios` de texto libre: dos verdades conviviendo.

### T8. Estático a video por capas
- **Produce:** un anuncio fijo del cliente convertido en clip de ~5 s.
- **Insumo:** el anuncio estático que el cliente YA tiene. Es a la vez el insumo y el fotograma final objetivo.
- **Mecanismo deducido de los 13 fotogramas (el reel no lo explica):** no es pan/zoom. El modelo **rearma el anuncio por capas en orden fijo** con push-in lento: fondo → producto en foco → titular → bajada → badge y CTA al final.
- **Repetible:** `seedance_2_5` verificado en la cuenta el 2026-08-20 (modes t2v / omni_reference / video_edit / video_extension, 4-30 s, 480p-1080p, 9:16 y 1:1, roles start_image / end_image / image_references). `unlim.available: false` → **cada generación gasta créditos**. `seedance_2_0` y `_mini` traen tags product/multi-sku/e-commerce.
- **No existe nuestro:** receta escrita para "estático de cliente → video por capas". `ONIA_ANIMATED_VIDEO_WORKFLOW.md` cubre crear desde cero, que es otro problema.

### T9. Cohesión sin relato ni cara (anuncio de marca)
- **Produce:** 33 s de branding que funcionan muteados y sin leer.
- **Mecanismo, 5 reglas:** (1) ningún plano muestra una cara, solo manos, piernas y props; (2) la marca aparece una sola vez, en el último segundo, y el producto recién al tercio: mundo → líquido → marca; (3) la cohesión viene de un **hilo de color** repetido plano a plano (amarillo pelota → cono → limón → líquido → tipografía); (4) un **carrier element** que cruza el encuadre en 3 de 7 planos (la sombra de la red) pega tomas sin continuidad espacial; (5) cámara nunca a la altura de los ojos.
- **Repetible:** es el formato **más fácil** que tenemos, porque sin cara desaparece el cuello de botella de consistencia de rostro. HyperFrames hace la placa final de grabado con HTML/CSS/SVG, sin After Effects.

### T10. Moldes de guion de reel (los 7, comparados)

| Item | Duración | Estructura | Mecánica |
|---|---|---|---|
| DcL4yjRTNV0 | 85 s | gancho de autoridad futura + número con asterisco → 4 pasos numerados (los 2 con b-roll van primero, donde se pierde audiencia) → giro de valor recurrente → descargo honesto que baja la promesa → tip de practicante → CTA follow | pre-inocular la objeción y firmar el descargo uno mismo antes de que lo haga el comentario |
| DcKABGBRkdY | 32 s | gancho = resultado cuantificado + esfuerzo mínimo + tiempo acotado → split permanente cabeza 40% / pantalla 60% → anotación a mano en la edición → cierre con dos flechas | el CTA es el producto mismo, no hay follow ni cebo |
| DcOs3VwRK0B | 37 s | gancho + 7 items de ~4 s, pantalla partida fija, sin b-roll ni transiciones → cebo de comentario | listicle: todo el valor lo hace la captura de arriba |
| DcOWPT2AIx- | 29 s | el título ES el gancho → escalera de 6 maquetas, cada peldaño más descarado → ráfaga final de tres preguntas idénticas → "follow for more" | voz de tutorial serio sobre pantalla que muestra el abuso |
| DcOWPT2AIx (DcOMYo8MdLD) | 22,7 s | rótulo de 3 palabras → dado → referencia → prompt en pantalla → oficio → reveal en mockup con mesh gradient | **mudo, solo música**: no vende nada y muestra el motor |
| DcAAUevMTG6 | 33 s | 7 beats: gancho cinético → beat surreal → el pour → aspiración → hero backlit → bodegón cenital → placa | mudo, sin CTA, sin subtítulos |
| DcMEQtYMn_4 | 12,7 s | contraste visual puro estático\|animado → 3 pruebas en 3 rubros e idiomas → cebo por comentario | tres pruebas, cero explicación, método detrás de la palabra clave |

Los recursos de montaje se repiten y todos son gratis con lo nuestro: karaoke palabra por palabra (`embedded-captions`), split y overlays (`talking-head-recut`), corte de silencios (`editor-videos` + `scripts/cut-plan.mjs`), transcripción con Speaches forzando `Systran/faster-whisper-small`.

---

## 2. Los prompts y el código que quedaron a la vista

**Prompt completo, único del lote (DcOMYo8MdLD, leído de pantalla, no de transcripción):**

> I want your help in creating a booking page for car rentals. I want you to go towards the theme of what Uber does aesthetically. Something that Uber is good at in smoothness and user experience to create the best experience for the user with minimal elements and an aesthetic design with modern stylings and typography taken care of the most. Help me with a mobile experience for this layout in light theme. I like the colors where dark and black collide with each other in a nice contrasting way. I also want all the unnecessary elements on that particular step to be hidden. In case there is a car selected, the user can even drop down on that particular car to see what car it is, the model, and everything there. That would be nice to see. Basically, it should be a nice two- or three-step flow. Let's go ahead and create that. Give me a nice prototype so I can preview it here.

Contexto verificado por imagen: selector de modelo "Opus 5", esfuerzo "high", control "Manual" al lado. **No contrastado contra nuestro plan.**

**Fragmento de prompt recortado arriba (DcL4yjRTNV0), literal:**

> con los documentos del proyecto, proyecta ingresos, márgenes, capex y working capital a cinco años, calcula el free cash flow, estima el WACC y el valor terminal, y ponlo en una tabla

El prompt maestro ("extremadamente detallado") nunca se muestra.

**Comando de instalación (DcOs3VwRK0B), único código del reel:**

```
$ npx skills add <owner>/taste-skill
```

El handle del owner no se lee con certeza ni ampliando x8 (render tipo "leonxlnx" o "lennxlnx"). No inventarlo.

**Repo legible en la barra de GitHub:** `YakAgent/awesome-design-md`

**Copy verbatim del README de DESIGN.md:**

> Copy a DESIGN.md into your project, tell your AI agent 'build me a page that looks like this,' and generate high-quality UI that stays visually consistent with the design language

> Built with real design depth - including analyzed patterns, tokens, and rules - for high-quality UI generation, not surface-level outputs

**Sidebar del mismo repo:**

> A collection of DESIGN.md files analyzed by popular brand design systems. Drop one into your project and let coding agents generate a matching UI

**impeccable.style, headline y bajada:**

> The missing design vocabulary for agents.

> Impeccable strips the slop from AI-generated interfaces, gives you precise commands to steer, and iterates visual variants live in your product.

**Taste Skill, descripción:**

> Open-source skill files that stop Cursor, Claude Code, Codex, Gemini CLI, v0, Lovable, and more from generating generic frontends

**Respuesta de Claude, fragmentos verbatim (bordes cortados marcados):**

> ...is 3 steps: trip details → car selection → review & booking. On the final step, the selected car ...ets a compact black card that you can tap to expand, revealing the model, year, luggage capacity, ...ncellation policy without permanently cluttering the screen.

> Darkening the page background is what actually fixed 'too white'...

> I ran an automated AA sweep and eight text roles were failing, some badly

> 13 text/background pairs, all AA

**Parámetros de Figma legibles (mismo item):** fuente APESTRON, Regular, tamaño 26-28, line height 32, letter spacing 4%, fill `FFFFFF` 100%, dos efectos apilados sobre el TEXTO (Drop shadow + Glass), frame "Login-2-Focused" X 66 / Y 109.5 / W 270 / H 64.

**Sin prompt visible, declarado:** DcKABGBRkdY, DcOWPT2AIx-, DcAAUevMTG6, DcMEQtYMn_4. En DcOs3VwRK0B no hay ningún prompt de LLM en pantalla, solo el comando de arriba.

---

## 3. Lo que sirve, por frente

**Carril H `contenido-higgsfield`**
- Molde de 5 beats con descargo honesto (DcL4yjRTNV0): falta solo el guion adaptado a un tema nuestro y decidir quién pone la cara. Costo cero.
- Anuncio sin cara con hilo de color + carrier element (DcAAUevMTG6): falta un cliente con producto físico; la cartera es software B2B.
- Estático a video por capas (DcMEQtYMn_4): falta permiso de gasto caso por caso, medir el costo unitario (pendiente V-3 abierto desde el 9-ago) y un insumo estático real en 9:16 o 1:1.
- Split antes|después de 32 s (DcKABGBRkdY): es el mismo formato que necesita el pendiente V-1; se arma hoy, gratis.
- Banco de moldes de anuncio: no existe; `hermes-content/references` guarda referencias sueltas, no fichas reutilizables.

**Carril B `wf-landing-dentalgest`**
- DESIGN.md por cliente en `data/clients/<slug>/`, cargado junto a `impeccable`: falta decidir dónde vive y comparar honestamente contra `design-dna`, que ya tenemos.
- Barrido de contraste AA como gate junto a `tsc --noEmit`: falta escribirlo, es código nuevo, una tarde.
- Molde de prompt de producto (DcOMYo8MdLD): nada falta, se usa hoy.
- Generador de briefs como Artifact publicado: nada falta, una tarde, gratis.

**ONIA Platform / onia-core**
- Cablear `business-tiers.mjs` como caller real desde `pricing.ts` y desde el flujo de invitar miembro: no falta código, falta encenderlo.
- Entidad de entitlement para el candado por feature: no existe ninguna en las 18 del contrato; `plan` es un campo suelto de Organization que no hace nada.
- Decisión de Sergio, no delegable: cortar por RESULTADO (estar online / convertir / automatizar) o por rehenes. Si no se elige, se cuela el patrón del reel por default.

**Carril C `propuestas-v2`**
- Patrón "proyecto = dossier de cliente vivo que se re-alimenta": hoy se hace a mano y sin plantilla; el generador produce la propuesta pero no mantiene el dossier. Falta una sesión para definir UNA plantilla por rubro.

**Skill `onia-contabilidad-bolivia`**
- Regla de una línea: todo entregable numérico al cliente sale con fórmulas editables, nunca con valores pegados. Nada falta.

**Estudio de Contenido / agente Contenido del ONIA Center**
- Radar de ganchos por embed oficial de IG: falta decisión de si es módulo del core o herramienta interna, la lista curada de cuentas por rubro boliviano, verificar la política de embebido de Meta, y escribir el prompt del campo derivado (molde + variantes, no resumen).

**Influencers IA / Lucía**
- El anuncio sin cara es el contra-ejemplo útil: prueba que una marca no necesita avatar. Elimina el cuello de botella de consistencia de rostro.

---

## 4. Lo que se descarta y por qué

- **DCF, WACC, terminal value, valuación de equities.** No es nuestro mercado (B2B por módulos en Bolivia). Se toma el molde, no el contenido.
- **three.js / WebGPU.** No hay skill de 3D web en las 33 del repo ni entre las globales, y un hero 3D pesa contra el presupuesto de <150kb JS de landing. Además el reel dice WebGPU y muestra three.js sin una sola línea de código: no enseña nada.
- **Figma.** El oficio visual del reto de diseño se porta con `image-to-code` + galería propia. No hace falta la herramienta.
- **La moral del pricing satírico.** Poner "exportar tus propios datos" detrás del paywall es línea roja: retener datos del cliente, y en Bolivia con facturación electrónica el cliente necesita sus datos sí o sí. Se lleva el inventario de gates y el momento del cobro; no la moral.
- **Herramientas #1 (21st.dev) y #5 (repo sin nombre) del listicle.** La #1 solo se nombra en audio, la #5 el creador la llama "this GitHub repo" y nunca la identifica. No están en las láminas: no hay nada que extraer.
- **Nuestras `taste-design` y `design-md`.** Coinciden en nombre y no en función: están atadas a Google Stitch. No cuentan como cobertura del punto 7.
- **El método de DcMEQtYMn_4.** Cero prompt, cero interfaz, cero parámetros, cero costo, cero duración: detrás del cebo. Solo se puede robar el envase.
- **Usar marcas de terceros como demo** (NordVPN, Emma, gruns). Si copiamos el formato, van piezas propias o de cliente con OK.
- **Fuente APESTRON.** Licencia no verificada. Si se quiere ese hero, resolver licencia o elegir desde nuestra galería.
- **Predicciones y superlativos sin fuente:** "Wall Street en 2027", "INSANE", "BEST AI video model now", "5 veces más alcance". Ninguno se repite como dato propio.

---

## 5. Lo transversal

**Veredictos:** 2 de 7 SIRVE_YA, 5 de 7 MEJORA. Los 2 SIRVE_YA son exactamente los 2 de nivel VERIFICADO; los 5 MEJORA son los 5 AFIRMADOS. **Tipos:** 2 SAAS, 2 WEB, 2 MARKETING, 1 IA.

**El prompt es lo que separa un veredicto del otro.** 1 de 7 muestra el prompt completo, y es el único VERIFICADO con contenido verbal reconstruible. 1 de 7 lo muestra recortado y con el prompt maestro ausente. 4 de 7 tienen `prompt_visible` vacío. El otro VERIFICADO es mudo y no tiene prompt que mostrar. Correlación directa: **los 2 SIRVE_YA son los 2 que no venden nada** (uno no tiene CTA, el otro es un anuncio de marca sin CTA en pantalla).

**Cebo de comentario: 2 de 7** (`Comment "Claude"`, `COMMENT "SEEDANCE"`). Follow limpio: 2. Sin CTA: 3. En los 2 con cebo, el método está fuera de pantalla: el cebo por sí solo no descalifica, pero en ambos casos las láminas están vacías, así que sí pesa.

**La promesa central sin prueba en pantalla: 4 de 7.** El .xlsx con fórmulas vivas nunca aparece. El "5x más alcance" está **contradicho por su propia evidencia**: título descriptivo 43 mil vistas vs título con el gancho copiado 11,2 mil, o sea 3,8x menos, con un asterisco "2 días después" sin fechas ni baseline. El pricing satírico narra $19/$49/$299 y muestra $0/$29/$99 en 29 s. El "BEST AI video model" no trae ni una comparativa.

**Audio: 3 de 7 sin locución útil.** Dos con `n_segments: 0 / n_words: 0` sobre pista de música (12,66 s y 22,64 s), uno con la alucinación clásica de 8 bytes ("[1] you"). En esos tres, el 100% del contenido salió de imagen. **Whisper degradó nombres técnicos en 4 de 7**, todos corregidos por imagen: "Cloud"→Claude, "ella"→IA, "WAC"→WACC, "ViCoded"→vibe coded, "awesome Dash Design"→awesome-design-md, "filled annually"→billed annually, "POP"→POV. Regla confirmada: **ningún nombre propio se cita desde transcripción sin contrastarlo contra un fotograma.**

**El caption falta en 6 de 7 fichas** (en 1 se verificó que no existe la carpeta). Es un hueco sistemático del método de intake, no de un item, y es donde suele vivir el CTA y a veces el método. Recuperable gratis con `fetch-video.mjs`.

**Cobertura pobre, declarada por ficha:** el cuerpo del callout "POR QUÉ FUNCIONA" está por debajo del límite de resolución del fuente 360x640 (se leyó título y estructura, no el texto); el nombre de ese producto no aparece legible en ningún fotograma y solo existe en audio degradado. El anuncio de marca se muestreó a 1 fotograma cada 4,7 s. El bloque del barrido AA se leyó a ~40%. Dos de las siete herramientas del listicle nunca están en pantalla.

**Seis huecos concretos nuestros, todos identificados como resultado y no como omisión:** barrido AA ejecutable, DESIGN.md por cliente, banco de moldes de anuncio, receta estático→video, entidad de entitlement, radar de ganchos.

**El patrón que se repite del lado nuestro y es el más caro:** `business-tiers.json` tiene 6 tiers definidos, `tierMeetsLimits()` probado con tests y validador propio, y **cero callers** fuera de `onia-core`. Mientras tanto la landing usa un campo de texto libre para el mismo dato. Es la definición exacta de "construido ≠ terminado" del CLAUDE.md, encontrada por segunda vez. En el mismo sentido: `impeccable` ya está instalada y es regla de entrada desde hace semanas, y un reel la vende como hallazgo. **Lo que nos falta no es descubrir herramientas, es encender las que ya tenemos.**