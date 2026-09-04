# R09 · Pletor.ai: campaña de moda completa en tres pasos, con exportación a Shopify

- **Destino:** `influencers-ia`
- **Sale de:** [la ficha](../2026-08-28-pletor-campana-moda-tres-pasos.md) · `DcjC1fvDP3X`
- **Fuente:** https://www.instagram.com/p/DcjC1fvDP3X/
- **Qué falta para hacerlo hoy:** Nada para estudiarlo. Para replicar el flujo completo faltaría el puente al catálogo del cliente.

---

```text
Objetivo único: mapear el flujo de "sesión de fotos sintética para catálogo" contra lo que tenemos, y decir qué falta para ofrecérselo a un comercio.

De dónde sale: ficha `pletor-campana-moda-tres-pasos` (IG DcjC1fvDP3X). Una herramienta de terceros (Pletor.ai) que hace campaña de moda en tres pasos:
  1. Crear el modelo: describir tipo y subir la ropa, o subir un modelo existente. Campos leídos en su UI: género, edad, tipo de cuerpo, pelo, piel, pose, lente ("E-commerce studio"), luz ("Soft, even studio lighting").
  2. Generar imágenes: plantilla "Ecom Pose Library" + modelo + imagen de referencia -> 30+ variantes de pose listas para ecommerce.
  3. Exportar en un clic a Google Drive, Dropbox, Google Sheets, Airtable, SHOPIFY, API Keys y MCP.

Lo que cambia la economía es el paso 2: no genera una foto, genera una sesión entera. Y el paso 3 es el que lo vuelve producto: las fotos entran al catálogo sin descargar y volver a subir.

Pasos:

1) Mapear los tres pasos contra lo nuestro, uno por uno, diciendo TENEMOS / NO TENEMOS y con qué:
   - paso 1 (modelo sintético consistente): tenemos roster y esquema de consistencia de cara. ¿Alcanza para vestirlo con ropa real de un cliente?
   - paso 2 (sesión de 30+ poses del mismo producto): ¿Higgsfield lo permite en lote? ¿a qué costo por pieza?
   - paso 3 (exportar al catálogo del cliente): esto NO lo tenemos. Decir qué haría falta.

2) Traducirlo a nuestro negocio. Onia no vende moda, pero vende a comercios con catálogo. El flujo es el mismo: producto -> sesión sintética -> catálogo. Escribir la versión nuestra en tres pasos.

3) Calcular el costo real por producto en créditos de Higgsfield, con get_cost. Es el número que define si esto se puede vender o es un juguete.

4) Anotar el detalle que casi nadie copia: Pletor tiene MCP entre sus conectores, o sea que un agente lo puede operar. Evaluar si ese es el camino en vez de construir el puente nosotros.

5) NO generar nada en esta tarea salvo que se apruebe el gasto aparte. El entregable es el mapeo y el costo.

LISTO = la tabla de los tres pasos con TENEMOS/NO TENEMOS y con qué, el costo por producto en créditos, y la versión de tres pasos escrita para comercio.
```
