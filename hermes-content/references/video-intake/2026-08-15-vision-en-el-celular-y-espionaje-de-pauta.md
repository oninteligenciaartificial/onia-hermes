# Los tres que faltaban — visión en el celular, espionaje de pauta y 10 repos

Cerrando la tanda del 15-ago. Los dos "mudos" que quedaron pendientes resultaron ser los más
útiles, y uno **responde una pregunta que yo había dejado abierta**.

---

## 1. `Dbsl_4fxvOO` — visión por computadora corriendo EN EL CELULAR ⭐

- Fuente: https://www.instagram.com/p/Dbsl_4fxvOO/ · 34,5 s · **sin voz** (solo música)
- Visto: 2026-08-15 — leído por fotogramas con visión propia, 1 de 11 a fondo

**Qué se ve.** Una app corriendo **en un teléfono**, apuntando a la calle. Sobre el video en
vivo, cajas de detección verdes sobre cada vehículo con su etiqueta y confianza (`car 93%`,
`car 88%`). Interfaz en español, con estos elementos textuales:

```
Sistema Listo para Grabación y Recolección     contador: 33 | 0
[ COCO-SSD Base ]  [ Modelo YOLO ]      ← selector de modelo
[ ● FOTO EPP ]     [ ■ GRABAR VIDEO ]   ← EPP = Equipo de Protección Personal
```

### Veredicto: SIRVE YA — responde el "dónde corre", que era el bloqueo del prompt de visión

Cuando encolé [visión por computadora como capacidad de la plataforma](2026-08-09-supra-vision-ganado-vision-computacional.md),
dejé cuatro preguntas abiertas. **La segunda era la que trababa todo:** *"¿dónde corre? subir
video continuo a la nube es caro"*.

**Este video la contesta: corre en el teléfono.** Con modelos livianos y conocidos —COCO-SSD y
YOLO, los dos gratuitos y estándar— sobre la cámara del propio dispositivo. Sin servidor, sin
subir video, sin costo por minuto procesado.

Eso cambia el encuadre de la capacidad entera: deja de necesitar la infraestructura de Onia Box
para el caso simple. **Un teléfono viejo apuntando a una puerta o a una zona de descarga ya es
el hardware.**

Y el caso que muestra —**EPP, equipo de protección personal**— es de **objetos y seguridad
laboral**, no de vigilancia de clientes. Es exactamente el orden que habíamos recomendado:
empezar por objetos, no por personas. Detectar si alguien entró a la obra sin casco es
verificable, útil y no tiene el problema legal de contar clientes en una tienda.

| Frente | Acción |
|---|---|
| onia-plattform | Cierra la pregunta 2 del prompt de visión: **corre en el dispositivo**. Reabrir esa evaluación con este dato |
| Rubros | Abre un caso que no teníamos mapeado: **seguridad laboral / EPP** para construcción e industria |
| Onia Box | Baja su necesidad para el caso simple. Onia Box sigue teniendo sentido para volumen y retención de video, no para detectar |

**A verificar:** la precisión real de COCO-SSD/YOLO en condiciones de obra (polvo, contraluz,
distancia). El video muestra vehículos a plena luz, que es el caso fácil.

---

## 2. `DbUtn-CuSCE` — Spyglass: ver todos los anuncios que corre una marca

- Fuente: https://www.instagram.com/p/DbUtn-CuSCE/ · 17,6 s · **sin voz**, con subtítulo quemado
- Visto: 2026-08-15 — leído por fotogramas

**Qué se ve.** `app.spyglass.so` con la marca *rhode* cargada. Rótulo: *"It'll pull up every ad
they're running"*. Pestañas: `Overview · Meta Ads · Instagram · TikTok · Landing pages ·
Creators`. Muestra la grilla de creativos con su porcentaje de peso (5%, 4%, 18%), gráfico de
tipos de creativo (GRWM, Text Overlay, Brand Story) y la leyenda *"Drag creatives into the
search bar to get breakdowns, storyboards, and more"*.

### Veredicto: FUTURO — la capacidad es real, pero hay una versión gratis que ya tenemos

Ver qué anuncios corre un competidor y con qué peso es inteligencia competitiva legítima y útil.
Pero **antes de pagar una herramienta**: la **Biblioteca de Anuncios de Meta es pública y
gratuita**, y nosotros ya la tenemos conectada por MCP (`ads_library_search`). Cubre el "qué
anuncios corre esta marca" sin costo.

Lo que Spyglass agrega sobre eso es el **análisis**: el peso de cada creativo y la clasificación
por tipo de formato. Eso sí es trabajo que la biblioteca no hace.

| Frente | Acción |
|---|---|
| marketing / Meta Ads | Antes de evaluar Spyglass, **usar `ads_library_search` con 3 competidores bolivianos** y ver si alcanza. Es gratis y está conectado |
| marketing | La clasificación por tipo de creativo (GRWM, text overlay, brand story) es un molde para ordenar nuestro propio banco |

**Riesgo:** dar de alta una herramienta paga para algo que la API gratuita de Meta ya responde.

---

## 3. `Db9cMOwjkAL` — 10 repos de GitHub que reemplazan herramientas caras (portugués)

- Fuente: https://www.instagram.com/p/Db9cMOwjkAL/ · carrusel de 12 láminas
- Visto: 2026-08-15 — **caption íntegro**, que trae la lista completa con links

Los 10, con sus estrellas, verbatim del caption: `awesome` (495k) · `public-apis` (456k) ·
`scrapling` (73,6k) · `free-for-dev` (132k) · `ollama` (178k) · `langflow` (153k) ·
`awesome-mcp-servers` (92k) · `open-design` (85k) · y dos más cortados en el caption.

### Veredicto: MEJORA LO ACTUAL — tres tocan cosas que tenemos abiertas

La mayoría son listas conocidas. **Tres sí conectan con pendientes reales nuestros:**

- **`scrapling`** — scraping con bypass de Cloudflare. Conecta con el pendiente de evaluar
  **Apify** (que está encolado porque el token de IG está bloqueado). Una alternativa
  open-source y gratis merece compararse antes de pagar Apify.
- **`free-for-dev`** — servicios con tier gratuito permanente, sin tarjeta. Con el runway
  corto, es una lista que vale revisar.
- **`ollama`** — correr modelos en máquina propia. Conecta directo con **Onia Box**, que es
  precisamente la propuesta de infraestructura local.

**A verificar:** todas las cifras de estrellas y la afirmación *"juntos hacen el trabajo de
herramientas que pasan de 30 mil reales al año"* — es del creador, sin fuente.

| Frente | Acción |
|---|---|
| pendiente (Apify) | Comparar `scrapling` contra Apify antes de dar de alta nada pago |
| Onia Box | `ollama` como pieza del stack local — ya estaba en el radar, esto lo confirma |
