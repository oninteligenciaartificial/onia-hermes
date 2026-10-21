# Web Factory Intake Fields

## Minimum viable intake

- Business: name, slug, rubro, city/country, offer, tagline, description.
- Conversion: WhatsApp, email, primary CTA, WhatsApp message, social links.
- Brand: logo/text mark, colors, font preference, visual keywords.
- References: 3 to 6 exact URLs, what to use, what to avoid, anti-references.
- Media: hero image or video, product/service photos, local/team photos, permission status.
- Content: benefits, services, categories, products, prices, FAQs, proof, policies.
- Operations: domain, hosting, payment methods, legal name, delivery constraints.

## Client request message

Para crear la web necesito:

1. Logo o texto exacto de marca.
2. 3 a 6 referencias de webs que le gustan, indicando qué usar y qué evitar.
3. Imagen principal o permiso para generar imagen IA/usar stock licenciado.
4. Fotos reales de productos, local, equipo, trabajos o casos.
5. Oferta principal, beneficios, servicios y preguntas frecuentes.
6. WhatsApp/email, redes, dominio, hosting y metodos de pago si es tienda.
7. Precios, politicas comerciales y razon social si corresponde.

ONIA revisa alcance, precio y permisos antes de enviar o publicar la web.

## Output contract

Return:

```text
Estado: listo | faltan_datos | bloqueado
Faltantes criticos: ...
Mensaje para cliente: ...
JSON sugerido: ...
Comando siguiente: pnpm design:auto -- <slug> --template <template> --force
```
