# Sitemap multi-página para onia.com.bo — research de startups comparables

> 2026-08-06. Pedido de Sergio: expandir el sitio (marketing IA, influencers,
> consultoría/capacitación, nosotros, SEO/redirecciones — "que no todo funcione
> solo sobre la landing"). Mapeo real de Alegra, Siigo, Holded, Bind ERP, Odoo,
> Synthesia, HeyGen, Copy.ai, Jasper, Arcads y The Clueless (URLs verificadas
> por fetch). **Este doc es el plano de la próxima sesión de construcción.**

## 1. El patrón universal de los que lo hacen bien

**SaaS B2B (Alegra/Siigo/Holded/Bind/Odoo):** producto por función (keyword SEO,
ej. `siigo.com/facturacion-electronica/`) + solución por vertical (conversión,
ej. `holded.com/es/hosteleria`, `odoo.com/industries/*` con ~48 páginas) +
precios transparentes + trial con URL propia (`/prueba-gratis`) + casos +
nosotros. **Nadie vende desde una sola landing.** Holded tiene además una página
dedicada a la NORMATIVA local (`/es/programa-facturacion-verifactu` — la ley
española) que captura la búsqueda de pánico regulatorio.

**Marketing/contenido IA (Synthesia/HeyGen/Copy.ai/Jasper/Arcads):** página de
resultado por caso de uso + **showcase con MÉTRICAS de performance** (Arcads
muestra views/revenue de los ads, no un portfolio estético) + herramienta gratis
como imán de tráfico (Hook Generator de Arcads, free tools de Copy.ai).

**Influencers IA (The Clueless/Aitana):** nav = AI Personas (roster, página por
avatar con backstory) · Works · Services (2 líneas: campañas con sus personas /
"Build your own Aitana") · About · AiCADEMY. **Sin precios públicos** — todo
"contactanos". Tarifas reales de Aitana: 3.000-10.000 EUR/mes, ~1.000 EUR por
publicación con 390k seguidores ([Euronews](https://www.euronews.com/next/2024/12/27/meet-the-first-spanish-ai-model-earning-up-to-10000-per-month)).
**Hueco: nadie publica media kit self-service con tarifas** — diferenciador
posible de Onia CUANDO Lucía/Mara tengan audiencia que vender.

## 2. Sitemap recomendado (P0 = ya · P1 = confianza/servicios · P2 = motor SEO)

| URL | Propósito | P | Patrón de |
|---|---|---|---|
| `/` | Hub multirubro que enruta (deja de ser landing única) | P0 | todos |
| `/precios` | 320/750/1500 transparentes + FAQ + CTA | P0 | Siigo, Alegra |
| `/prueba-gratis` | Landing dedicada al trial (destino medible de ads/links) | P0 | Siigo, Odoo |
| `/modulos/dental` | Vertical dental profunda (dolor→módulos→resultado→precio) | P0 | Holded, Bind, Odoo |
| `/funciones/facturacion-electronica-siat` | **La página SEO más urgente**: obligación 30-sep-2026, cómo Onia la resuelve (pitch "no tengas que tipear", NUNCA "obligatorio comprarme") | P0 | Holded/Verifactu |
| `/comparativa` | mantener + linkear desde /precios | P0 | Siigo por-que |
| `/modulos/comercio` (luego estética/vet/servicios/importadora) | verticales restantes | P1 | ídem |
| `/servicios/marketing-ia` | Motor de contenido/reels IA: showcase con métricas reales de IG + paquetes | P1 | Arcads, HeyGen |
| `/servicios/consultoria` | Consultoría y capacitación IA (el objeto social las cubre): formatos + agenda | P1 | The Clueless AiCADEMY |
| `/servicios/influencers-ia` + `/influencers/lucia`, `/influencers/mara` | Personas con backstory + formatos; ESQUELETO honesto hasta que tengan feed y números | P1-esqueleto | The Clueless |
| `/nosotros` | quiénes somos, por qué Bolivia, equipo + agentes (honesto) | P1 | Alegra, Siigo |
| `/casos` | SOLO con cliente real; antes: demos etiquetadas dentro de módulos | P1-honesta | Holded, Bind |
| `/contacto` | demo/agenda separada del trial | P1 | Alegra demo |
| `/recursos/{guia}` · `/herramientas/{tool}` · más `/funciones/{x}` | motor compounding (guías Bolivia, verificador "¿estás obligado?", generador de recibos) | P2 | Holded crea-tu-factura, Copy.ai tools |

Dos ejes interlinkeados (Bind/Odoo): **`/modulos/{rubro}`** (conversión, idioma
del dueño) y **`/funciones/{keyword}`** (SEO, idioma de la búsqueda).

## 3. Estructura de la página de servicio marketing-IA/influencers

1. Hero con el RESULTADO, no la tecnología. 2. Showcase con métricas (los reels
del motor con sus números de IG — reemplaza al portfolio que no existe).
3. Roster de personas con página propia y backstory. 4. Dos-tres líneas de
contratación (calcar The Clueless): publicidad con Lucía/Mara · "tu propia
influencer IA de marca" · motor de contenido mensual. 5. Precio: por producción
+ resultado, no por alcance (la audiencia aún es chica).

## 4. Qué NO copiar

Mega-menús de 8 categorías · selector multi-país · páginas enterprise/SOC2 ·
precios ocultos tras "pedí demo" (mata el trial self-service) · casos/logos
fabricados (0 clientes) · programmatic SEO por ciudad (thin content en un país
de 4 ciudades; solo con contenido único local) · academia/comunidad/partners
pre-tracción · galerías de 200 templates.

## 5. SEO técnico

- **Titles:** vertical = `Software para {rubro} en Bolivia | Onia`; función =
  keyword exacta + beneficio. `lang="es-BO"`, OG por página, canonical siempre.
- **JSON-LD:** home Organization+WebSite (sameAs a IG/LinkedIn); /precios y
  /modulos SoftwareApplication+Offer (menos del 5% de SaaS lo hace) + FAQPage;
  /servicios Service; todo BreadcrumbList. Los motores IA (AEO/GEO) pesan el
  JSON-LD para citar.
- **Interlinking hub-and-spoke:** footer = sitemap interno con TODAS las
  páginas (patrón Holded/Bind); triángulo /precios ↔ /comparativa ↔
  /prueba-gratis siempre interlinkeado; módulo ↔ funciones ↔ guías.
- **Redirecciones:** 301 de toda ruta que cambie; /comparativa conserva su URL;
  sitemap.xml + robots.txt desde el día uno; una sola URL viva por contenido.

## 6. Orden de construcción (0 clientes, foco = trial)

1. `/precios` + `/prueba-gratis` (URL medible del trial vivo)
2. `/` como hub + nav nueva + redirects (sin esto, todo lo demás queda huérfano)
3. `/modulos/dental` (una vertical PROFUNDA > cuatro superficiales)
4. `/funciones/facturacion-electronica-siat` (ventana 30-sep; cada semana sin
   esta página es tráfico de pánico regalado)
5. `/nosotros` + `/contacto` (confianza barata)
6. `/servicios/marketing-ia` (el portfolio con métricas YA existe; genera caja)
7. `/servicios/consultoria` (texto + agenda, esfuerzo mínimo)
8. `/servicios/influencers-ia` (esqueleto honesto; venta en serio recién con
   feed y números — media kit sin audiencia quema credibilidad)
9. `/casos` (apenas exista UN cliente)
10. `/recursos` + `/herramientas` + resto de funciones/módulos (compounding)

**Regla de cierre (nada-a-medias): cada página se publica COMPLETA — schema,
CTA e interlinks — nunca un menú con links a páginas que no existen.**

### Fuentes
Alegra (`/colombia/`, `/quienes-somos/`) · Siigo (`/precios-siigo/`,
`/prueba-gratis/`, `/por-que-siigo/`) · Holded (`/es/casos-de-exito`,
`/es/programa-facturacion-verifactu`) · Bind ERP (`/erp/*`, dos ejes del menú) ·
Odoo (`/app/*`, `/industries/*`) · Synthesia (`/use-case/*`, `/case-studies/*`) ·
HeyGen (`/customer-stories`) · Copy.ai/Jasper (use-cases + free tools) · Arcads
(showcase con métricas) · The Clueless (AI Personas/Works/Services) ·
Euronews/Fast Company/Entrepreneur (tarifas Aitana) · Social Operator/Sozee
(plataformas/agencias influencer virtual) · Rankeo/SolvSpot/IvanHub (schema
SaaS) · SEOmatic/TripleDart (programmatic SEO).
