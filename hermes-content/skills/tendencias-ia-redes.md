# Skill: tendencias-ia-redes

## Objetivo
Investigar tendencias actuales de inteligencia artificial, actualizaciones de modelos/productos IA y tendencias de redes sociales para convertirlas en ideas accionables de contenido para ONIA.

## Comandos

### Investiga tendencias IA
Investigar:
- Nuevos modelos, productos, APIs y capacidades IA.
- Cambios relevantes en OpenAI, Google, Anthropic, Meta, Microsoft, NVIDIA y otros laboratorios/empresas confiables.
- Papers o benchmarks relevantes cuando aporten contexto practico.

### Investiga tendencias redes
Investigar tendencias en:
- Instagram.
- TikTok.
- YouTube Shorts.
- LinkedIn.
- X/Twitter.
- Pinterest.
- Facebook.

### Investiga tendencias ONIA: <tema o industria>
Investigar tendencias de IA y redes aplicadas al tema indicado.
Ejemplos:
- `Investiga tendencias ONIA: clinicas dentales Bolivia`
- `Investiga tendencias ONIA: automatizacion para pymes`
- `Investiga tendencias ONIA: agentes IA para ventas`

## Busqueda
Usar SearXNG como gateway de busqueda cuando este disponible:
```bash
curl "http://localhost:8080/search?q=<consulta>&format=json"
```

Si SearXNG no responde, explicar el fallo y pedir reintento o usar la herramienta de busqueda disponible en Hermes si existe.

## Fuentes confiables

### IA y actualizaciones tecnicas
Priorizar:
- Blogs, changelogs y documentacion oficial de empresas: OpenAI, Google, Anthropic, Meta, Microsoft, NVIDIA, Hugging Face, Mistral, Perplexity y similares.
- Labs de investigacion, universidades, arXiv, papers con autores identificables.
- Medios tecnologicos y de negocio con reputacion editorial: The Verge, TechCrunch, MIT Technology Review, IEEE Spectrum, Wired, Bloomberg, Reuters, Financial Times, The Information.
- Repositorios oficiales o releases verificables cuando la noticia sea sobre software.

Fuentes iniciales recomendadas:
- OpenAI News: https://openai.com/news/
- OpenAI Docs: https://platform.openai.com/docs/
- Google AI Blog: https://blog.google/technology/ai/
- Google DeepMind Blog: https://deepmind.google/discover/blog/
- Anthropic News: https://www.anthropic.com/news
- Meta AI Blog: https://ai.meta.com/blog/
- Microsoft AI Blog: https://blogs.microsoft.com/ai/
- NVIDIA Blog: https://blogs.nvidia.com/
- Hugging Face Blog: https://huggingface.co/blog
- Mistral AI News: https://mistral.ai/news/
- arXiv AI: https://arxiv.org/list/cs.AI/recent
- Papers with Code: https://paperswithcode.com/
- MIT Technology Review AI: https://www.technologyreview.com/topic/artificial-intelligence/
- IEEE Spectrum AI: https://spectrum.ieee.org/artificial-intelligence
- Reuters Technology: https://www.reuters.com/technology/

### Redes sociales
Priorizar:
- Blogs oficiales de plataformas y centros para creadores/negocios: Meta, Instagram, TikTok, YouTube, LinkedIn, X, Pinterest, Facebook.
- Reportes de plataformas o empresas de analitica reconocidas: HubSpot, Hootsuite, Sprout Social, Later, Buffer, Socialinsider, DataReportal.
- Medios confiables cuando reporten cambios de algoritmo, formatos o politicas.
- Paginas oficiales de tendencias cuando existan.

Fuentes iniciales recomendadas por plataforma:
- Instagram Creators: https://creators.instagram.com/
- Instagram Blog: https://about.instagram.com/blog
- Meta for Business: https://www.facebook.com/business/news
- TikTok Newsroom: https://newsroom.tiktok.com/
- TikTok Creative Center: https://ads.tiktok.com/business/creativecenter/
- YouTube Official Blog: https://blog.youtube/
- YouTube Creator Blog: https://blog.youtube/creator-and-artist-stories/
- LinkedIn Official Blog: https://blog.linkedin.com/
- LinkedIn Marketing Blog: https://www.linkedin.com/business/marketing/blog
- X Blog: https://blog.x.com/
- Pinterest Newsroom: https://newsroom.pinterest.com/
- Pinterest Business Blog: https://business.pinterest.com/blog/
- Facebook Newsroom: https://about.fb.com/news/
- DataReportal: https://datareportal.com/
- Sprout Social Insights: https://sproutsocial.com/insights/
- Hootsuite Blog: https://blog.hootsuite.com/
- Buffer Resources: https://buffer.com/resources/
- Later Blog: https://later.com/blog/
- Socialinsider Blog: https://www.socialinsider.io/blog/

## Jerarquia de fuentes
- Nivel 1: fuente oficial, documentacion, changelog, newsroom de la plataforma o paper original.
- Nivel 2: reporte metodologico de analitica reconocida o medio con reputacion editorial.
- Nivel 3: observacion social, hilo, newsletter o creador experto. Usar solo como pista para buscar confirmacion en niveles 1 o 2.
- No usar Nivel 3 como unica evidencia para una afirmacion factual.

## Fuentes prohibidas o debiles
- Claims virales sin fuente primaria.
- Blogs anonimos o generados automaticamente.
- Hilos de "gurus" sin evidencia o sin enlace a fuente primaria.
- Reposts, capturas sueltas, rumores o predicciones sin metodologia.
- Contenido de terceros para copiar textos, disenos, imagenes, marcas o claims.

## Reglas de verificacion
- Toda afirmacion factual debe tener fuente.
- Si una tendencia aparece en una sola fuente secundaria, marcar confianza `media` o `baja`.
- Marcar confianza `alta` solo cuando exista fuente oficial, paper verificable o coincidencia entre varias fuentes reputadas.
- Diferenciar hechos confirmados de interpretaciones o recomendaciones para ONIA.
- Incluir fecha o periodo cuando sea relevante.
- Si no se encuentran fuentes fiables suficientes, decirlo explicitamente y no rellenar con especulacion.

## Formato de respuesta

Responder siempre en espanol claro y con esta estructura:

### Resumen ejecutivo
5 a 8 bullets con lo mas importante.

### Tendencias IA
Para cada tendencia:
- Tendencia.
- Por que importa.
- Evidencia/fuentes con links.
- Oportunidad para ONIA.
- Nivel de confianza: alta, media o baja.

### Tendencias redes
Agrupar por plataforma:
- Instagram.
- TikTok.
- YouTube Shorts.
- LinkedIn.
- X/Twitter.
- Pinterest.
- Facebook.

Para cada plataforma incluir:
- Tendencia o actualizacion.
- Implicacion practica.
- Fuente con link.
- Idea de contenido para ONIA.
- Nivel de confianza.

### Ideas de contenido para ONIA
5 a 10 ideas concretas, indicando formato:
- Reel.
- Carrusel.
- Post LinkedIn.
- Short.
- Historia.
- Pin.

Cada idea debe incluir:
- Hook.
- Angulo de negocio.
- CTA sugerido.

### Fuentes
Agrupar por:
- Oficiales.
- Investigacion/papers.
- Medios/reportes confiables.

## Criterios de calidad
- Priorizar tendencias accionables para empresas bolivianas, pymes, clinicas dentales, automatizacion, atencion al cliente, ventas y desarrollo web.
- Evitar hype. Explicar beneficios y riesgos de forma concreta.
- No prometer resultados imposibles.
- No copiar material creativo de terceros.
- Si el usuario pide publicar contenido, primero convertir las tendencias en piezas originales con la skill de carruseles o pedir aprobacion.
