# "5 herramientas para hacer contenido con Claude"

- **Fuente:** https://www.instagram.com/p/DX8r5xWOSzG/ · 82 s · español
- **Visto:** 2026-08-11 — **camino alternativo** (cuota de Gemini agotada): audio 100% con
  Whisper + 1 de 6 fotogramas leído con visión
- **Lectura completa:** [transcripciones/2026-08-11-fallback-sin-gemini.md](transcripciones/2026-08-11-fallback-sin-gemini.md) (sección 1)

## Qué dice realmente

Creador a cámara, rótulo *"Crea contenido Viral con Claude"*, enumera cinco herramientas
que conecta a Claude Code:

| # | Herramienta | Lo que afirma |
|---|---|---|
| 1 | **HyperFrames** | con un prompt edita el video, genera animaciones, gráficos, presentaciones, subtítulos y corta silencios |
| 2 | **Last 30 Days** | le das un tema y busca en redes e internet para traerte tendencias |
| 3 | **Claude Banana** | conecta Claude con nano banana (el modelo de imagen de Google) para imágenes, carruseles, portadas y fotos de producto |
| 4 | **Claude Video Vision** | *"si alguna vez has querido que Claude vea videos"* — le pasás un reel y lo desglosa parte por parte |
| 5 | **Apify** | saca información real de Instagram, Facebook y del resto de internet. *"Olvídate de información inventada"* |

CTA: comentar cuál fue tu favorita. (Whisper escribe "cloud" por **Claude** y "Hyperframe"
por **HyperFrames**.)

## Veredicto: SIRVE YA — pero por una razón distinta a la que el video pretende

Como lista de descubrimiento es flojo: nombra herramientas sin mostrar ninguna funcionando.
Lo valioso es lo que revela al cruzarlo con lo que ya tenemos.

**Tres de las cinco ya las tenemos, y dos de ellas construidas por nosotros:**

- **HyperFrames (#1) ya está instalado y probado** como motor HTML→MP4, y la skill
  `editor-videos` ya hace cortar silencios, subtítulos karaoke y overlays. Nada que adoptar.
- **Claude Video Vision (#4) es exactamente lo que se construyó en esta sesión**: bajar el
  reel sin navegador, verlo con Gemini nativo y desglosarlo con timeline. Esta bandeja
  entera es la prueba.
- **Claude Banana (#3)** se solapa con el pipeline propio de carruseles
  (`scripts/carousel_render.js` + skill de carruseles) y con Higgsfield para imagen.

O sea: el video confirma que el stack de ONIA está a la altura de lo que se vende como
avanzado en el nicho. Eso vale para la confianza y para el discurso comercial.

**Lo genuinamente nuevo son dos, y las dos apuntan al mismo hueco: datos reales.**

- **Apify (#5)** — extraer datos reales de Instagram/Facebook. Nosotros tenemos el token de
  IG bloqueado (S6) y eso frena la prospección y la medición de contenido. Un extractor de
  terceros es un camino alternativo que conviene evaluar.
- **Last 30 Days (#2)** — investigación de tendencias. Se solapa con el Radar de Novedades
  IA que ya corre por cron cada 2 h; habría que ver si aporta algo que ese no cubra.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| marketing con IA / INFLUENCERS IA | **Evaluar Apify**: qué extrae de IG sin token propio, con qué límites y a qué precio. Es el candidato real a destrabar lo que S6 tiene frenado |
| Radar / research | Comparar Last 30 Days contra el Radar de Novedades IA que ya tenemos. Si no aporta, se descarta sin probar |
| Comercial | Argumento verificado: lo que el nicho vende como stack avanzado, ONIA ya lo tiene o lo construyó |

**A verificar antes de repetir nada:** los nombres exactos, si son MCPs oficiales o repos de
terceros, y el precio. Apify tiene plan pago — entra en la regla de gasto, permiso explícito
antes de dar de alta nada.

## Riesgo

Adoptar herramientas por FOMO. Tres de las cinco ya están cubiertas; sumar duplicados
fragmenta el pipeline y agrega superficie de mantenimiento. Solo Apify tiene un hueco real
que llenar, y hay que medirlo antes de pagarlo.
