# Formulario de levantamiento de cliente — ONIA Web Factory Lab

> **Para qué sirve:** recolectar de una sola vez todos los datos que el Web
> Factory Lab necesita para construir el sitio sin idas y vueltas. Cada pregunta
> indica `→ campo` al que mapea en el JSON de cliente
> (`web-factory/data/clients/<slug>.json`). El equipo que arma la web copia las
> respuestas directo al JSON.
>
> **Cómo usarlo:** enviar al cliente las secciones 1–7 (las marcadas 🟢 son
> visibles al cliente). La sección 8 (legal/pagos 🔴) es interna/operativa: ONIA
> la guía con el cliente, no es un cuestionario de diseño.
>
> Regla de oro (CLAUDE.md): **no inventar datos.** Lo que el cliente no responda
> se deja vacío y se marca `PENDIENTE`, nunca se rellena con supuestos.

> 🔗 **2026-08-27 — esto ya existe como formulario web.** `https://forms.onia.com.bo/brief`
> cubre ~80% de estas 39 preguntas (41 campos), y `/alta` tapa varios huecos del brief
> (rubro, ciudad, direccion, horarios, NIT) ademas de traer el repetidor de FAQ.
> **Lo que no cubre ninguno: el CTA** (que debe hacer el visitante, texto y destino del
> boton), **que NO quieren**, estilo visual explicito, tagline, titulo SEO e imagen OG.
> Tabla completa en `hermes-content/docs/platform/ONIA_FORMS_DEPLOY_VPS.md`.

---

## 0. Identificación del proyecto (interno)

- Slug del proyecto (kebab-case, sin tildes/espacios): `__________` → `slug`
- Fecha de levantamiento: `__________`
- Responsable ONIA: `__________`
- Paquete propuesto (Nivel 1 / 2 / 3): `__________`
- Canal de origen (prospección, referido, etc.): `__________`

---

## 1. 🟢 Datos del negocio

1. Nombre comercial exacto (como debe aparecer en la web): `__________` → `nombre`
2. Rubro / a qué se dedica en una frase: `__________`
3. Eslogan o frase corta de marca (si tiene): `__________` → `tagline`
4. Descripción del negocio en 2–3 líneas (qué hacen, para quién, qué los
   diferencia): `__________` → `descripcion`
5. ¿Tienen logo? (sí/no) — si sí, **adjuntar archivo** (PNG/SVG, fondo
   transparente). Si no, ¿iniciales o texto a mostrar?: `__________`
   → `logo` / `logoIcon` / `logoWide`
6. Años de operación / hito de confianza (ej. "20 años", "+12.000 clientes"):
   `__________`
7. Ciudad(es) y dirección(es) físicas: `__________` → `contacto.direccion`
8. Horarios de atención: `__________`

---

## 2. 🟢 Marca, estilo y diseño

9. ¿Tienen manual de marca o colores definidos? (sí/no). Si sí, **adjuntar**.
10. Colores de marca (códigos HEX si los tienen):
    - Principal: `#______` → `colores.primary`
    - Secundario: `#______` → `colores.secondary`
    - Acento: `#______` → `colores.accent`
    - Fondo: `#______` → `colores.bg`
    - Texto: `#______` → `colores.fg`
11. Tipografía preferida (o "que ONIA proponga"): titulares `______` /
    texto `______` → `tipografia.heading` / `tipografia.body`
12. Estilo visual que buscan (marcar 1–2): ☐ Minimalista/limpio ☐ Elegante/premium
    ☐ Moderno/tecnológico ☐ Cálido/cercano ☐ Colorido/divertido ☐ Corporativo/serio
13. 2–3 webs de referencia que les gusten (links) y **por qué**: `__________`
14. Algo que NO quieren en su web (colores, estilos, elementos): `__________`
15. ¿Tienen fotos/videos propios de calidad? (sí/no) — si sí, **adjuntar o link a
    carpeta**. Si no, ¿autorizan generar imágenes/video con IA? (sí/no)
    → `heroVideo` y assets

---

## 3. 🟢 Contenido — servicios o productos

> Negocios de servicios llenan "Servicios"; tiendas/catálogo llenan "Productos".

### Servicios (3–6) → `servicios[]`
Por cada uno: **Título** · **Descripción (1–2 líneas)** · ícono sugerido
(sparkles, smile, phone, message, grid, etc.)
- Servicio 1: `__________`
- Servicio 2: `__________`
- Servicio 3: `__________`

### Productos (si es tienda) → `productos[]` + `categorias[]`
Categorías del catálogo: `__________` → `categorias[]`
Por cada producto: Título · Categoría · Precio (o "Consultar precio") ·
Descripción · Marca · Tamaño · Beneficios · Imagen (adjuntar) · Alt de imagen.
- Producto 1: `__________`
- Producto 2: `__________`
(usar planilla aparte si son muchos)

16. Testimonios de clientes reales (nombre + texto), si los tienen: `__________`
17. Preguntas frecuentes que les hacen siempre (sirven para la sección FAQ):
    `__________`

---

## 4. 🟢 Llamado a la acción (qué debe lograr la web)

18. ¿Qué quieren que haga el visitante? (marcar): ☐ Escribir por WhatsApp
    ☐ Llamar ☐ Llenar formulario/brief ☐ Comprar online ☐ Reservar/agendar
    ☐ Ver catálogo
19. Texto del botón principal (ej. "Agendar evaluación", "Pedir por WhatsApp"):
    `__________` → `cta.texto`
20. Destino del botón (link WhatsApp, teléfono, etc.): `__________` → `cta.url`

---

## 5. 🟢 Contacto y redes (lo que va publicado en la web)

21. Email de contacto público: `__________` → `contacto.email`
22. Teléfono: `__________` → `contacto.tel`
23. WhatsApp (número o link wa.me): `__________` → `contacto.whatsapp`
24. Instagram: `__________` → `redes.ig`
25. Facebook: `__________` → `redes.fb`
26. LinkedIn: `__________` → `redes.linkedin`
27. X / TikTok / otra: `__________` → `redes.x`

---

## 6. 🟢 SEO / cómo quieren que los encuentren

28. ¿Cómo busca la gente su negocio en Google? (palabras clave, ej. "sushi La
    Paz"): `__________`
29. Título SEO sugerido (Nombre | qué hacen): `__________` → `seo.title`
30. Descripción SEO (1 línea): `__________` → `seo.description`
31. Imagen para compartir en redes (OG), si tienen: adjuntar → `seo.ogImage`

---

## 7. 🟢 Dominio y hosting

> Regla ONIA (CLAUDE.md): **dominio y hosting van a nombre del cliente, nunca en
> el precio de ONIA.**

32. ¿Tienen dominio? (sí/no) — cuál: `__________`
33. Si no, dominio deseado (ej. newsakura.com.bo): `__________`
34. ¿Quién paga dominio + hosting? (debe ser el cliente, a su nombre):
    `__________`

---

## 8. 🔴 Datos legales, fiscales y de pagos (INTERNO — ONIA guía)

> Solo es bloqueante si la web **cobra en línea** (e-commerce / pasarela). Una
> web de presencia o de captación de leads **no** requiere esto.
> Detalle completo en
> `hermes-content/propuestas/REQUISITOS_LEGALES_BOLIVIA_INTERNO.md`.

### Datos del negocio (titularidad)
35. Tipo de negocio: ☐ Empresa unipersonal ☐ SRL/SA ☐ Persona natural / informal
36. ¿Tiene **NIT**? (sí/no) — número: `__________`
37. ¿Tiene **Matrícula de Comercio SEPREC** vigente? (sí/no): `__________`
38. Nombre y CI del representante legal / propietario: `__________`

### Facturación
39. ¿Necesita **emitir factura** por las ventas de la web? (sí/no)
40. Si sí, ¿qué modalidad de facturación en línea usa hoy? (Electrónica /
    Computarizada / Portal Web gratuito SIN / ninguna aún): `__________`

### Cobros en línea (solo si la web vende)
41. ¿Quiere cobrar online? (sí/no) — métodos: ☐ QR Simple (BCP/otro banco)
    ☐ Tigo Money ☐ Tarjeta (Visa/Mastercard) ☐ Transferencia/QR manual
42. ¿Tiene **cuenta empresa/comercial** en un banco? (sí/no) — banco:
    `__________`
43. ¿Ya tiene credenciales de pasarela/QR? (sí/no) — proveedor: `__________`
    (Las credenciales son del cliente — ver `BCP_PASARELA_CREDENCIALES_INTERNO.md`)

### Automatización (add-on Nivel 3)
44. ¿Quiere que tras un pago se dispare automático: confirmación + orden +
    mensaje WhatsApp/email? (sí/no) → flujo n8n `pago→orden→mensaje`
45. ¿Quiere chatbot IA que responda/califique en WhatsApp? (sí/no) → add-on

---

## 9. Checklist de cierre del levantamiento (interno)

- [ ] Secciones 1–7 completas o marcadas `PENDIENTE`
- [ ] Logo y assets recibidos (o autorizada generación IA)
- [ ] Colores/estilo definidos o "ONIA propone"
- [ ] Definido si la web **vende** (activa sección 8) o no
- [ ] Dominio/hosting confirmados a nombre del cliente
- [ ] JSON `data/clients/<slug>.json` creado con los datos reales
- [ ] Requisitos legales/pagos trasladados a la propuesta (si aplica)
