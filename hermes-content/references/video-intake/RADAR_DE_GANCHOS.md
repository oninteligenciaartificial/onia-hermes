# Radar de ganchos

Herramienta INTERNA del carril de contenido (decisión de Sergio, 2026-08-20). No es módulo
de ONIA Platform, no va al core, no se vende. Es un archivo: los ganchos ya identificados en
el corpus de video-intake y los que nosotros ya publicamos, organizados para buscarlos por
tema y por formato antes de escribir una pieza nueva.

**Regla de métricas:** acá NO se guardan números de alcance ajenos. El reel que originó la
idea afirmaba un multiplicador de alcance que su propia captura desmentía. Un gancho es UNA
variable, no un multiplicador: se guarda el texto, no la promesa de rendimiento. Si un número
forma parte del texto del gancho y no está verificado, se recorta o se marca.

---

## 1 · Ganchos ajenos (del corpus analizado)

| Tema | Gancho (texto literal) | Formato | Fecha | Fuente |
|---|---|---|---|---|
| Agentes IA / delegación | "8 agentes de Claude corren todo mi marketing" + "Lo armás una vez y trabaja mientras dormís." | Carrusel (portada) | 2026-08-20 | `analisis/2026-08-20-items.json` (DbWx7fsD1_k) |
| Agentes IA / contratación | "CONTRATA ESTOS 5 EMPLEADOS IA" + "Antes de contratar a tu primer empleado humano" | Carrusel (portada en video mudo de 5 s) | 2026-08-20 | `analisis/2026-08-20-items.json` (DcPf2NwCaDK) |
| Realismo IA | "THIS IS AI." — sobre la foto más ordinaria del set (selfie de asiento trasero) | Carrusel (portada) | 2026-08-20 | `analisis/2026-08-20-items.json` (DcLw-KHkcfU) |
| Roster IA / fricción | "Your own roster of faces. On demand." / "No DMs. No rates. No flaky models." | Carrusel (caption) | 2026-08-20 | `analisis/2026-08-20-items.json` (DcLw-KHkcfU) |
| Pricing SaaS / sátira | "The Art of The B2B SaaS Pricing Page" — el título ES el gancho | Reel talking-head | 2026-08-20 | `analisis/2026-08-20-items.json` (DcOWPT2AIx-) |
| Finanzas / IA | "Este es uno de los skills de IA que más demandado va a estar en Wall Street en 2027" + rótulo "Cómo automatizar un modelo financiero en 20 minutos*" (el asterisco pre-inocula la objeción; el propio autor baja la promesa al s.67) | Reel talking-head | 2026-08-20 | `analisis/2026-08-20-items.json` (DcL4yjRTNV0) |
| Fotografía IA | "AI CAMERA ANGLE PROMPTS" + "Same Model. Different Angles." | Carrusel (portada + lámina 2) | 2026-08-20 | `analisis/2026-08-20-items.json` (DcJJyh4CbtT) |
| Producción IA | "NO CAMERA. NO REAL SHOOT. ONLY PROMPTS." | Carrusel (portada) | 2026-08-20 | `analisis/2026-08-20-items.json` (DbQVVldE9ty) |
| Diseño de interiores IA | "Nano Banana is the best AI model right now for interior design." (opinión sin comparativa — se guarda el molde "X is the best for Y", no el claim) | Carrusel (caption) | 2026-08-20 | `analisis/2026-08-20-items.json` (DcEYP7tjsIA) |
| Agencia IA | "7 A.I agency tips I'd kill to tell my 18 year old self" (el cierre original agrega una cifra de facturación sin prueba — no se repite) | Post de X | 2026-08-12 | `2026-08-12-siete-tips-agencia-ia.md` |
| Diseño / antagonismo | "los devs me van a odiar" | Reel | 2026-08-12 | `2026-08-12-montaje-maquetas-ui-cebo-figma.md` |
| Seguridad apps IA | "…hecha con IA es segura. Versión principiante." (captura parcial del arranque) | Reel talking-head | 2026-08-09 | `transcripciones/2026-08-09-10-errores-seguridad.md` |
| UGC autos / prueba social | Gancho de apertura = un DM entrante: "Your car ads are insane. How much would they cost?" (captura del propio vendedor — señal débil, no es prueba) | Reel | 2026-08-18 | `2026-08-18-ugc-auto-receta-completa.md` |
| Molde genérico | "encontrando la forma correcta de conseguir X resultado" — plantilla de gancho que la app del reel muestra para copiar | Reel (pantalla) | 2026-08-20 | `transcripciones/Instagram-DcKABGBRkdY.txt` |

**Sin texto literal pero con estructura documentada** (ver tabla T10 de
`2026-08-20-sintesis-lote-13.md`): gancho cinético mudo (movimiento, no información —
DcAAUevMTG6); gancho de resultado cuantificado + esfuerzo mínimo + tiempo acotado
(DcKABGBRkdY — su cifra de alcance está desmentida por su propia captura, no se repite);
gancho + listicle de 7 items (DcOs3VwRK0B).

## 2 · Ganchos propios (portadas ya usadas por @oniahq)

| Tema | Gancho (título de portada) | Formato | Fecha | Fuente |
|---|---|---|---|---|
| Automatización | "3 procesos que tu negocio ya no debería hacer a mano" | Carrusel | 2026-06-17 | `carousels/briefs/onia-3-procesos-a-mano-20260617.json` |
| IA vs equipo | "5 tareas que una IA hace mejor que tu equipo (y más barato)" | Carrusel | 2026-06-17 | `carousels/briefs/onia-5-tareas-ia-20260617.json` |
| Competencia | "Tu competencia ya vende con IA mientras vos respondés a mano" | Carrusel | 2026-06-17 | `carousels/briefs/onia-competencia-ia-20260617.json` |
| Escala | "Lo que separa a un negocio que escala de uno estancado no es trabajar más" | Carrusel | 2026-08-07 | `carousels/briefs/onia-paradigma-escala-20260807.json` |
| Costo invisible | "Automatizar es caro. Hacerlo a mano te cuesta más" | Carrusel | 2026-08-08 | `carousels/briefs/onia-costo-invisible-20260808.json` |
| Mitos IA | "Nadie te cuenta esto sobre automatizar con IA" | Carrusel | 2026-08-08 | `carousels/briefs/onia-mitos-ia-20260808.json` |
| WhatsApp | "Dejá de responder WhatsApp a mano: estás perdiendo clientes mientras dormís" | Carrusel | 2026-08-08 | `carousels/briefs/onia-whatsapp-a-mano-20260808.json` |
| Cuaderno | "R.I.P. al cuaderno: tu negocio ya no entra ahí" | Carrusel | 2026-08-09 | `carousels/briefs/onia-rip-cuaderno-20260809.json` |
| Lucía / IA declarada | "Hace un año yo no existía" / "No soy real, y no lo escondo" | Carrusel | 2026-08-09 | `carousels/briefs/lucia-reveal-20260809.json` |
| Preguntas repetidas | "Las 5 preguntas que te hacen siempre (y podés dejar de contestar)" | Carrusel | 2026-08-20 | `carousels/briefs/onia-5-preguntas-de-siempre-20260820.json` |
| Competencia | "Lo que tu competencia hace mientras vos contestás WhatsApp" | Carrusel | 2026-08-20 | `carousels/briefs/onia-competencia-mientras-whatsapp-20260820.json` |
| Cuaderno | "Tu cuaderno no miente, pero tampoco avisa" | Carrusel | 2026-08-20 | `carousels/briefs/onia-cuaderno-no-avisa-20260820.json` |
| Dental / retención | "¿Cuántos pacientes no volvieron este mes?" | Anuncio | s/f | `carousels/briefs/ads/ad-a2-v1-no-volvieron.json` |
| Dental / cuaderno | "Tu clínica no puede depender de un cuaderno" | Anuncio | s/f | `carousels/briefs/ads/ad-a2-v2-cuaderno.json` |
| Dental / costo | "¿Sabés cuánto te cuesta una silla vacía?" | Anuncio | s/f | `carousels/briefs/ads/ad-a3-silla-vacia.json` |
| Panel / candidato | "Tu negocio en una pantalla, en vivo" — propuesto en ficha, no publicado | (candidato) | 2026-08-09 | `2026-08-09-live-ops-dashboard-maria-wendt.md` |

## 3 · Moldes que se repiten (para escribir ganchos nuevos)

- **Número + delegación**: "N agentes/tareas/pasos" + "mientras dormís / sin vos". El más usado del corpus y el nuestro.
- **Disonancia**: lo más ordinario posible + una afirmación que lo contradice ("THIS IS AI.").
- **Autoridad futura + número con asterisco**: prometer fuerte y firmar el descargo uno mismo antes de que lo haga un comentario.
- **Antagonismo**: "X me va a odiar por esto".
- **El título ES el gancho**: sin pregunta, sin promesa; el rótulo del tema basta si el tema es específico.
- **DM entrante como apertura**: prueba social en el primer segundo (ojo: captura del propio vendedor = señal débil).
- **Negación de fricciones nombradas**: "No X. No Y. No Z." con fricciones REALES del rubro, no genéricas.
- **Enemigo instalado en el subtítulo**: "antes de contratar a tu primer empleado humano".

## 4 · Cómo se agrega un gancho nuevo

Cuando una ficha de intake, una síntesis de lote o un brief propio traiga un gancho con texto
literal: agregá una fila en la tabla que corresponda (§1 ajenos / §2 propios) con texto
literal · formato · fecha · fuente (ruta del archivo en el repo o shortcode del reel) · tema.
Sin números ajenos no verificables — si el texto trae uno, se recorta o se marca. Si además
revela una estructura nueva, sumala en una línea al §3.
