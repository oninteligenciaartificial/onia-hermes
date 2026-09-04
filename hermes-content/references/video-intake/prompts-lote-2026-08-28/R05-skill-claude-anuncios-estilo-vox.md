# R05 · Un skill de Claude que hace anuncios estilo Vox desde la foto del producto

- **Destino:** `marketing`
- **Sale de:** [la ficha](../2026-08-28-skill-claude-anuncios-estilo-vox.md) · `Dci8bI6MPnz`
- **Fuente:** https://www.instagram.com/p/Dci8bI6MPnz/
- **Qué falta para hacerlo hoy:** Confirmar que el skill existe y es público. Y buscar fuente para el "formato de mejor rendimiento", que hoy es una afirmación sin respaldo.

---

```text
Objetivo único: reproducir el "estilo Vox" de anuncio editorial con nuestras propias herramientas, sin depender de un skill de terceros que está gateado.

De dónde sale: ficha `skill-claude-anuncios-estilo-vox` (IG Dci8bI6MPnz). El post anuncia un skill de Claude que genera anuncios estilo Vox desde la sola foto del producto.

Qué es el estilo Vox, según los ejemplos observados: anuncio editorial-infográfico que usa los recursos del periodismo explicativo en vez de la foto bonita —
  - mapa vintage anotado con flechas rojas a mano y un punto circulado
  - plano técnico del producto, acotado ("330ml GLASS BOTTLE")
  - gráfico de barras comparativo contra la competencia ("MORE CAFFEINE: 25mg/100ml vs ~8mg")
  - papel rasgado de color saturado con sellos circulares ("NO PLASTIC")
Parece un artículo, no un anuncio. Ese es todo el truco.

Pasos:

1) Verificar dos cosas antes de invertir tiempo:
   - ¿el skill existe y es público? El CTA lo gatea detrás de comentar "VOX", así que puede no estarlo.
   - la afirmación "uno de los formatos de mejor rendimiento en Meta y Google" NO trae fuente. Buscarla. Si no aparece, tratarla como opinión del autor y decirlo.

2) Independientemente de eso: el estilo se reproduce con HyperFrames. Son composiciones HTML — mapa con anotaciones, plano acotado, barra comparativa, papel rasgado con sello. Armar las cuatro plantillas.

3) Producir un anuncio real de Onia con cada plantilla. El más prometedor es la BARRA COMPARATIVA: comparar algo nuestro contra la alternativa que el cliente usa hoy (papel, planilla, WhatsApp suelto). Pero solo con números que podamos sostener — sin dato real, no hay barra.

4) Guardar las plantillas en hermes-content/references/ui-patterns/anuncio-editorial-vox/ para que el próximo no las rehaga.

5) Conectar con la ficha hermana de este mismo lote (cuatro-moldes-anuncio-estatico): los dos posts describen el mismo mecanismo — robarle la forma a un formato que el usuario ya consume sin defensas. Anotarlo como principio, no como dos hallazgos sueltos.

LISTO = las cuatro plantillas de estilo Vox en HyperFrames, un anuncio de Onia renderizado con la que mejor aplique y sin un solo número sin respaldo, y el veredicto escrito sobre si el skill de terceros existe y si su afirmación de rendimiento tiene fuente.
```
