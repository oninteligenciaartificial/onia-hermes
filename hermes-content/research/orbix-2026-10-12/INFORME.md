# Orbix: diseño y propuesta comercial

Fecha: 2026-10-12. Encargo de Sergio Urcullo; worker orbix_analisis, madre revisa. META: estudiar referencia actual y aplicabilidad a ONIA. PRUEBA: navegador, CSS, capturas guardadas y páginas públicas. PARADA: sin cambios de producto, precios, publicación, contacto ni instalaciones.

## Veredicto
Buena referencia de jerarquía y presentación del trabajo; su negocio vende capacidad de agencia a equipos SaaS. ONIA puede tomar la claridad y el nivel visual, conservando su oferta guiada y el foco comercial vigente. No se compararon páginas actuales de ONIA: son adaptaciones propuestas, no un diagnóstico de su web.

## 8 hallazgos priorizados
1. **Foco comercial explícito (observado):** SaaS B2B; la FAQ filtra equipos financiados Seed–Series B, producto activo y usuarios. **Inferencia:** el filtro permite vender expertise y coordinación, no una lista de herramientas. [Home](https://www.orbix.studio/).
2. **Jerarquía fuerte (observado):** una idea grande, descripción breve, prueba y dos CTAs. CSS: Neue Montreal, h1 desktop 64px/500; móvil 32px. **Inferencia:** el aire y el contraste facilitan lectura y elevan percepción de valor. Capturas 01/04.
3. **Lenguaje visual consistente (observado):** fondo blanco/gris, botones negros en cápsula, radios amplios, sombras fuertes; paisaje del hero y miniaturas coloreadas. **Inferencia:** estética amigable y editorial, menos corporativa. El paisaje aporta identidad, pero explica poco el producto. Capturas 01/02/06.
4. **Dolor y mecanismo unidos (observado):** coordinación de diseño y desarrollo; equipo integrado y lanzamiento rápido. **Inferencia:** vender alivio operativo es más potente que enumerar IA/n8n/stack. Captura 02 y [home](https://www.orbix.studio/).
5. **Modelo comercial distinguible (observado):** proyecto de alcance fijo y capacidad mensual. Planes visibles $2,999 y $5,499/mes; el primero limita a un proyecto activo y tres revisiones; el segundo amplía equipo y capacidad. **Inferencia:** vende acceso al equipo, no un SaaS de autoservicio. [Precios](https://www.orbix.studio/pricing), captura 06. No son precios recomendados para ONIA.
6. **Prueba vistosa, verificación pendiente (observado):** reviews, logos, casos y porcentajes. La home anuncia 55% menos errores para Maven; la página del caso describe problema, solución y seis semanas, pero no expone método, base ni periodo de esa cifra. **Inferencia:** presentación convincente no equivale a resultado verificado. [Maven](https://www.orbix.studio/case-studies/maven-finance-management), captura 07. No se verificaron terceros.
7. **CTA accesible, navegación invasiva (observado):** llamada y WhatsApp en hero; móvil apila botones legibles. Menú fijo inferior tapa parte del siguiente título en móvil y contenido de planes en escritorio. **Inferencia:** mantener contacto fácil sin ocupar la lectura. Capturas 01/04/06. No se enviaron formularios ni mensajes.
8. **Detalles debilitan acabado (observado):** pestaña visible “Recruting” para colaboración recurrente. Hero de precios habla de suscripción, pero abre inicialmente proyectos individuales. **Inferencia:** etiquetas y estado inicial introducen duda evitable en una decisión comercial. Capturas 05/06 y [precios](https://www.orbix.studio/pricing).

## 3 adaptaciones propuestas para ONIA
- Hero: problema concreto del cliente + solución empaquetada + una captura real del flujo + CTA principal a demo/diagnóstico; WhatsApp secundario. Copy de clientes en usted. No prometer plazo universal. Base: jerarquía y CTAs observados en capturas 01/04; sustituir paisaje por flujo real es adaptación propuesta, no patrón observado de Orbix.
- Dos o tres casos: problema → flujo antes/después → trabajo entregado → evidencia fechada → siguiente paso. Usar Bench/Garabato/HSB como piso interno ya aprobado, sin declarar métricas no medidas. Base: mockup real del caso en captura 07 y narrativa problema/solución de la página Maven consultada; la captura por sí sola no prueba resultados ni toda esa narrativa.
- Explicar implementación inicial y servicio continuo con límites explícitos, entregables, soporte y exclusiones. Reutilizar la lógica de claridad, sin adoptar importes, capacidad de equipo ni una oferta nueva. Base: dos modelos en página de precios y capacidad/revisiones en captura 06; separar implementación y continuidad para ONIA es propuesta, no adopción del modelo de Orbix.

## Qué no copiar
Paisaje/identidad exactos, menú que tapa contenido, página excesivamente larga, cifras sin respaldo, promesas universales de 2–4 semanas/24 horas o revisiones ilimitadas. No trasladar el segmento internacional financiado al mercado ONIA por semejanza visual.

## Recorrido y evidencia
1. Home desktop: buena jerarquía; 01-home-desktop.jpg.
2. Oferta de equipo: clara, aire amplio; 02-team-desktop.jpg.
3. Continuación social/showreel: transición espaciosa; 03-work-desktop.jpg (no es captura completa del portafolio).
4. Hero móvil, viewport probado 390×844: lectura y CTAs correctos; obstrucción inferior; 04-home-mobile.jpg. Se restauró viewport.
5. Hero de precios: claro visualmente, estado comercial ambiguo; 05-pricing-desktop.jpg.
6. Suscripciones: comparación concreta, menú superpuesto; 06-pricing-plans.jpg.
7. Maven: mockup de producto; estructura del caso validada vía texto web, no por esta captura; 07-case-maven.jpg.

Capturas guardadas y abiertas para inspección en esta misma carpeta. Texto vía web contrastado con navegador. Observé cambios de badge, aparición de miniaturas y transición del hero al hacer scroll; no se validó el sistema completo de animaciones. No se hicieron mediciones de rendimiento, WCAG, teclado, compra, responsive de todas las secciones ni comprobación independiente de clientes/resultados. Informe y capturas listos para revisión por madre. Preservación Git de esta carpeta autorizada por Sergio Urcullo mediante la madre el 12-oct; sin implementación de las propuestas.

## Ampliación: toda la UI como referencia, no solo el hero

Sergio Urcullo aclaró que le gusta el conjunto de UI, infraestructura y diseño. El aprendizaje se amplía a arquitectura de páginas, componentes y capa técnica pública. Esto no declara toda la web auditada visualmente. Las siete capturas anteriores siguen siendo la evidencia visual; en esta ampliación CUA devolvió inventario de navegadores vacío y no permitió recuperar IAB. No se repitió el hero ni se instaló un navegador.

### Tres hallazgos nuevos

1. **La referencia es un sistema de páginas (observado en enlaces/texto público).** Inicio orienta; servicios explican capacidades; casos muestran trabajo; precios califica capacidad; About presenta equipo; Contact prepara la conversación. Blog y recursos añaden entrada por temas y plataformas. **Interpretación para ONIA:** definir una familia coherente de páginas y componentes, con el mismo camino a demo/contacto; no convertir cada servicio en una landing aislada con otro estilo. [About](https://www.orbix.studio/about), [casos](https://www.orbix.studio/case-studies), [blog](https://www.orbix.studio/blogs), [recursos](https://www.orbix.studio/resources).
2. **La infraestructura observable de esta web es Webflow y recursos de animación (observado en HTML/HTTP público).** About respondió HTTP 200 con `Server: cloudflare`, atributo `data-wf-site`, CSS/JS en `cdn.prod.website-files.com`, jQuery 3.5.1, referencias GSAP 3.15.0 y Lenis 1.3.4. **Interpretación:** el impacto visual no demuestra un backend complejo. Importaciones tampoco prueban que cada librería se ejecute o sea necesaria. ONIA puede reproducir jerarquía, componentes y movimiento con su stack existente; no hay evidencia que justifique migrarlo a Webflow. [About](https://www.orbix.studio/about), metadatos en EVIDENCIA-PUBLICA.json.
3. **La conversión usa varias capas integradas (observado en HTML/texto).** Contact recoge identidad, empresa, teléfono, presupuesto y servicio; incluye origen del lead, CTA a Cal.com y mapa Google. About incorpora Vimeo. El formulario expone marcadores Webflow y Turnstile. **Interpretación para ONIA:** formularios y agenda deben continuar el mismo recorrido y pedir solo lo útil para calificar; no asumir que una fachada bonita trae CRM, automatización, seguridad o seguimiento. No se probó envío ni protección efectiva. [Contact](https://www.orbix.studio/contact).

### Mapa de páginas y cobertura

| Superficie | Función y módulos comprobados | Cobertura real |
|---|---|---|
| `/` | Hero, prueba, CTAs, oferta de equipo, enlaces a trabajos/proceso/casos | Hero desktop/móvil y bloques 02/03 vistos; resto texto/DOM inicial |
| `/pricing` | Proyectos/suscripción, selects dependientes, planes, comparación, FAQ | Desktop y cambio de pestaña ejecutado; cálculo/selects/envío no probados |
| `/case-studies/maven-finance-management` | Mockup, problema, solución, proceso, resultados declarados, contacto | Mockup visto; relato leído; producto real no operado |
| `/case-studies` | Archivo de casos con imagen, categoría, resumen y enlace a detalle | Texto público leído; grid/filtros/animación no validados visualmente |
| `/about` | Fundador, trabajo, métricas declaradas, premios, fotos, testimonios, FAQ | Texto y HTML público; sin nueva captura ni reproducción Vimeo |
| `/contact` | Formulario de calificación, fundador, agenda, mapa y FAQ | Texto/estructura HTML; sin rellenar, enviar ni abrir agenda |
| `/services/ai-creative-production` | Beneficios, control humano, tipos de entregables y CTA | Texto público representativo de servicio; diseño/móvil pendientes |
| `/blogs` | Categorías, artículos, resumen y tiempo de lectura | Índice textual; no se revisaron artículos ni se probaron categorías |
| `/resources` | Categorías Webflow/Framer/Figma, free/premium/font, recursos | Índice textual; filtros, descarga, licencia y compra no probados |
| Otras rutas de servicios y legales | Enlaces públicos a 12 especialidades y políticas | Solo inventariadas desde About; no auditadas por familia completa |

Servicios enlazados: `ui-ux-design`, `full-stack-development`, `ai-creative-production`, `dashboard-design`, `mvp-development`, `webflow-expert-agency`, `saas-design`, `custom-illustration`, `mobile-app-development`, `motion-design`, `brand-design`, `creative-marketing`. No se infiere uniformidad visual de esas doce rutas a partir de una sola.

### Componentes e interacciones: observado frente a pendiente

- **Navegación:** logo/contacto superior y menú flotante inferior vistos. Árbol inicial de home mostró Services, casos, precios, About, blog, recursos, contacto y enlaces sociales. Destinos comprobados como enlaces; apertura/cierre, submenú, teclado, foco y versión móvil completa no probados.
- **Tipografía/material:** Neue Montreal, escalas 64/32 px de h1, cápsulas, tarjetas claras, radios, sombras y miniaturas son evidencia de capturas/CSS anterior. No hay catálogo exhaustivo de tokens, espaciados, hover ni estados.
- **Contenido repetible:** tarjetas de trabajo, testimonios, CTA a conversación, FAQ y footer aparecen en texto de varias rutas. Reutilización por template es interpretación; no se accedió al CMS ni al sistema de diseño privado.
- **Movimiento:** se vieron cambio de badge, aparición de miniaturas, transición al scroll y porcentaje del menú. GSAP/SplitText/ScrollTrigger/ScrollSmoother/Flip/Lenis están referenciados en HTML; no equivale a prueba completa de cada efecto. Carrusel/drag/showreel solo aparecen en DOM inicial, sin interacción validada.
- **Precios:** cambio Single Projects → Recruting probado y tarjetas vistas. Calculador muestra selects progresivos en DOM; no se eligieron opciones. No tratar estimación indexada como cotización real.
- **Responsive representativo:** hero móvil probado a 390×844, h1 reducido y CTAs apilados; menú tapa el siguiente título. Desktop en hero/equipo/precios/Maven. Tablet, orientación, overflow de otras páginas, tablas, formularios, filtros y reducción de movimiento pendientes.

### Capa pública observable y límites de infraestructura

| Evidencia | Qué permite afirmar | Qué no permite afirmar |
|---|---|---|
| `data-wf-site`, clases `w-*`, assets website-files | Página publicada con estructura/recursos Webflow | Plan CMS, editor privado, despliegue interno, permisos |
| `Server: cloudflare` en respuesta About | Cloudflare en capa de respuesta HTTP observable | Servidor de origen, proveedor compute, base de datos o topología |
| CSS/JS CDN y referencia jQuery/GSAP/Lenis | Recursos que el HTML solicita/referencia | Ejecución efectiva de todos, rendimiento o necesidad |
| Enlaces Cal.com/WhatsApp; embeds Vimeo/Google Maps | Integraciones públicas de agenda/contacto/media/mapa | Sincronización CRM, bots, n8n, webhooks o automatización real |
| Formulario Webflow y atributo Turnstile | Marcadores de formulario y antispam en HTML | Recepción, validación servidor, protección efectiva o tratamiento de datos |

No se investigó infraestructura privada. React, Next.js, Supabase, AWS o Google Cloud citados por Orbix como herramientas/servicios no prueban que sean el backend de `orbix.studio`. No se conoce autenticación, DB, API, RLS, backups, costes ni CI/CD.

### Reutilización integral propuesta

**Para ONIA:** un vocabulario visual común aplicado a todas las superficies (tipo grande, aire, tarjetas, mockups y CTA); familias servicio/caso/planes/contacto coherentes; estados de componentes claros; movimiento que explique recorrido y transición. Conservar benchmarks internos Bench/Garabato/HSB y resolver antes la obstrucción del menú. Es aprendizaje candidato, aún no incorporado a tokens/templates ni al producto.

**No copiar:** código, assets, marca o composición exacta; toda la lista de dependencias por afinidad visual; infraestructura no comprobada; bibliotecas duplicadas de smooth scroll; amplitud del catálogo que ONIA no entrega; formularios largos sin finalidad; “Free/Premium” como licencia comercial; testimonios/porcentajes sin respaldo.

**Límites del método:** HTTP directo con PowerShell permitió leer About/Contact. Una extracción posterior con Python devolvió 403 en nueve rutas y se detuvo sin retries ni evasión; esos fallos se conservaron en EVIDENCIA-PUBLICA.json. Las páginas adicionales accesibles vía web se leyeron como texto, no como validación visual. Nuevas capturas/interacciones quedaron pendientes por ausencia de navegador. La cobertura ampliada permite aprender arquitectura pública y stack visible, no certificar toda UI, accesibilidad, rendimiento, formularios o backend.
