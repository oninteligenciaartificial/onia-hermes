# Portafolio — piezas verticales antes/después (Web Factory)

Piezas 9:16 (1080x1920, 17 s, sin voz, sin cara): 0–4,3 s wireframe gris de NUESTRO diseño
con rótulo "Cliente: …" → corte en movimiento → 4,3–17 s scroll real de la web con rótulo "Después:".

| Pieza | Cliente / web | Origen |
|---|---|---|
| `antes-despues-nuvia.mp4` | **Nuvia** — tienda online de skincare/dermocosmética (cliente real, catálogo ISDIN/SVR/Uriage) | `web-factory/out/nuvia` |
| `antes-despues-inmobiliaria.mp4` | **Inmobiliaria** — web editorial de cartera de propiedades (modelo entregable del rubro inmobiliario) | `web-factory/out/realestate-demo` |
| `antes-despues-logistica.mp4` | **Logística** — web de seguimiento de carga depósito→ruta→entrega (modelo entregable del rubro logístico) | `web-factory/out/logistics-demo` |

## Cómo se hicieron / cómo regenerar

- Composiciones HyperFrames (HTML→MP4) en `compos/<pieza>/index.html` + captura full-page en `assets/page.png`.
- Regenerar un mp4: `cd compos/<pieza> && npx hyperframes render` (sale en `compos/<pieza>/renders/`).
- Captura de scroll: `scripts` de Playwright sobre `web-factory/out/<slug>` (viewport 540x960 @2x,
  scroll previo para disparar lazy-load y `content-visibility`). En los demos se neutralizó en el DOM
  toda mención al modelo/plantilla interna antes de capturar (plantillas = confidencial).
- Motion: un solo seam por pieza (scroll continúa hacia arriba a través del corte), verificado con
  `seam-gate.mjs` de la skill `motion-doctrine` (PASSED en las 3; `ledger.json` en cada compo).
- Logística: la sección scrollytelling del medio solo pinta sus etapas al scrollear en vivo, así que
  ese tramo (~2.600 px vacíos) está recortado del `page.png` (empalme oscuro-oscuro, filas 2000–4600
  de la captura original). Nuvia: la captura se recorta a los primeros 13.560 px (hero → catálogo → productos).

Sin publicar: los mp4 quedan en disco (regla del encargo).
