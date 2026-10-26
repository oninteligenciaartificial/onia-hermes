# Fórmulas de guion de los referentes

Síntesis 29-sep-2026 para escribir guiones de Sergio Urcullo que enseñen. No reemplaza
el registro de procedencia: [EXTRACCION-REFERENTES-GUIONES.md](EXTRACCION-REFERENTES-GUIONES.md)
(+ `.json`). Esto lo convierte en moldes reutilizables.

**Actualizado 8-oct-2026** con el análisis completo de 5 referentes (catálogo entero con vistas, guiones desarmados con
tiempos de Whisper, edición medida): Santiago Muñoz, Erik Taveras, Enrique Rocha, Alex Hormozi e Iman Gadzhi. Fichas en
`hermes-content/references/video-intake/2026-10-08-referente-{sanmunoz,eriktaveras,enriquerocha,hormozi,gadzhi}.md`.
Lo nuevo: §1 suma a Hormozi y Gadzhi y completa los «sin dato» de Rocha y Erik; §1b ordena los ganchos por lo que
rinden en cada catálogo; §2 suma las fórmulas F9 a F14; el cierre trae los números de cada CTA.

**Leyenda de evidencia**

- **[O] observado:** está en una ficha con transcripción, fotogramas medidos, caption
  completo o página pública leída. Se cita la ruta o URL.
- **[P] parcial:** solo caption, fecha o 1-2 fotogramas. Sirve de indicio, no de estructura.
- **[I] inferido:** deducción nuestra (tiempos para el formato de Sergio, versión
  horizontal de un molde vertical, intención del creador). No se presenta como su método.

**Límites que valen para todo el documento**

- Ningún reel se volvió a ver completo hoy. Las fichas de Ian y Tiago **no tienen audio**
  (Speaches falló): de ellos se sabe lo que se ve, no lo que dicen.
- Enrique y Erik: sus **reels** solo se vieron por caption y fotogramas; sus **webs/guías**
  sí se leyeron. Del montaje de Enrique no hay análisis: queda "sin dato". **(8-oct: ya hay análisis.** 14 videos de
  Rocha y 16 de Erik bajados y medidos; ver las filas marcadas «8-oct» en §1.)
- El YouTube de Santiago del 26-sep (`5REPWhjX64A`, «Contraté a Claude como animador y esto
  pasó», 20:16) se conoce por descripción y capítulos, no visto entero.
- Rutas de fichas: `hermes-content/references/video-intake/` (abreviado `vi/`).

---

## 1. Por referente

### Santiago Muñoz (@sanmunoz.ia)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel vertical partido (cara + apoyo), carrusel, YouTube tutorial largo | [O] reels `DdE7wYbxjPK`, `DcE8336Ixby`; [P] carrusel `DdwmO09CN4y`; [O-descripción] YouTube `5REPWhjX64A` |
| Duración | Reels 74,6 s y 92,8 s; YouTube 20:16 y tutorial de método de 28 min | [O] `vi/2026-08-28-pesos-algoritmo-x-codigo-publico.md`, `vi/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`; `.claude/skills/editor-videos/SKILL.md` §Auditoría |
| Ganchos | **Claim de resultado en primera persona** («reemplacé a mi editor con Astra + DaVinci») y **promesa de hallazgo con fuente** (rótulo «así te haces VIRAL en X» + caption «Claude analizó el algoritmo de twitter y esto encontró») | [O] fichas citadas |
| Cuerpo | Astra: afirmación → proceso visible arriba (timeline de DaVinci, chat del agente) → explicación a cámara → keyword. X: fuente en pantalla (repo `xai-org/x-algorithm`, «2.814 archivos») → fragmento de código → tabla de pesos → castigo (report −234) → prueba propia (su tweet con «enlace copiado») | [O] |
| Cómo muestra el "cómo" | Screencast con **zoom focal a la línea o botón que importa**, tarjetas de UI flotando junto a la cara, tabla arriba/cara abajo | [O] |
| YouTube | Capítulos: resultado temprano → requisitos/configuración → creación → revisión → personalización. Ofrece recurso descargable y comunidad | [O-descripción] handoff `docs/historial/handoff/CONTINUAR-GUIONES-CLAUDE-2026-09-28.md` §Investigación adicional |
| Método de trabajo que enseña | «Una instrucción completa» por video (OBJETIVO / MATERIAL / ESTILO), inventario de crudos, tabla de cortes + preview antes de cortar | [O] tutorial de 28 min, visto entero el 24-jul (skill `ver-videos`) |
| Cierre / CTA | **Comentá keyword** («Astra», «ANIMA») → tutorial. Fondo del CTA: b-roll totalmente desenfocado + texto centrado, keyword en amarillo | [O] Astra; [P] ANIMA (comentarios de `Ddz9G7KIEfT`, `docs/historial/cola/marca-personal-sep/AUDITORIA-GUIONES-COMUNIDAD-2026-09-28.md`) |
| Destino | Bio → forjabots.com, horizontesia.com (formación → Skool), hub link.me con YouTube. Encuentros presenciales y hot seat | [O] bio verificada 28-sep; [P] encuentros (`docs/historial/cola/marca-personal-sep/PLAN-CONTENIDO-23-27-SEP-2026.md`) |
| Edición | Cara **abajo ~45 % anclada**, apoyo **arriba ~55 %** que rota cada 1-3 s; 25-30 cortes en 92 s; subtítulos blancos 2-5 palabras con keyword amarilla; rótulo cian chico + título blanco; «ecuación de logos» (X + Y = 💰); b-roll ≤1,5 s; música tech + whoosh + pop. **Pero** el reel de X tiene solo 5 cortes en 74,6 s y alterna tres registros (tarjetas junto a la cara, grafo a pantalla completa con karaoke, split tabla/cara) | [O] ambas fichas |

Actualidad: reels sobre Opus 5.5 (23-sep, `DdpMVvQopMC`) y Sonnet 5.5 (28-sep,
`Dd2KbhWIRap`) con caption y gráfico de apoyo **[P]**.

**8-oct, catálogo entero (80 TikToks, 60 largos de YouTube, 13 videos vistos enteros) [O]:**

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Lo que rinde | **Casos con un negocio real** (restaurante, cafetería: mediana 31,5 mil en TikTok) y **edición con IA** (41 % de sus vistas de YouTube). La noticia sola hace 2 a 14 mil; la que hizo 1,6 M trajo **una calculadora propia, gratis, atada a una fecha** | ficha Santiago §1.1 |
| Lo que cayó | Narrativa sin cara, IA generada y la serie «Día N» de octubre: 0,9 a 2,7 mil, contra una mediana de 12,65 mil | ficha §1.5 |
| Guion de caso | Llega al lugar en POV → diagnostica 1-2 problemas del negocio → los resuelve con una herramienta → resultado en pantalla → «el tutorial completo en el enlace de mi perfil». El corto es el tráiler del largo | G2 (694,7 mil), G5 (303,5 mil) |
| Recursos | Objeción lanzada y contestada en voz alta; pausa humana a los 50 s (la pizza); reveal del costo del propio video al minuto 1:05 («US$2,50 y menos de un día»); anáfora («…, Claude.» 12 veces en 33 s); tarjeta de número que se arma | ficha §3.3 |
| Promesa | Siempre trae un número de tiempo o de costo («en 1 hora», «en 10 min», «US$0,55 por ejecución») | ficha §2.3 |
| Cierre | Una sola acción, «el enlace está en mi perfil», dicha y con captura del perfil, en 7 de 11 videos; despedida de una palabra («Chao») | ficha §3.5 |

### Alex Hormozi (@AlexHormozi), nuevo 8-oct

YouTube: 60 largos y 60 shorts con vistas; 12 analizados, 10 shorts y 1 largo bajados y medidos. TikTok e Instagram sin
dato propio. Ficha: `vi/2026-10-08-referente-hormozi.md`.

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | ~96 % shorts (5-6 por día) y ~1,3 largos por semana. Los shorts salen de eventos y entrevistas, no del largo | [O] RSS y catálogo |
| Lo que rinde | **El diálogo con un dueño real que dice su problema con cifras**: los 8 shorts más vistos, mediana 155,5 mil contra 16,5 mil del resto. Un rótulo de pregunta sin otra persona rinde como el resto (5,7 y 25,9 mil). En largos, el título «por favor mirá esto» (mediana 666 mil, 1,8 veces la general) | [O] §1.4 |
| Ganchos | Contraste de estatus con número; carta abierta a una persona («este video es para el joven que me paró en la calle»); el dueño dice su problema con cifras («facturamos 7 millones, mi COO dice que frene»); paradoja; cita de un famoso | [O] §3.1 |
| Cuerpo | **Una regla con nombre propio por pieza** (Lista de Grandes Ideas, regla 1-1-1, «el pantano»); **una analogía cotidiana** (semáforo de la autopista, jefe de videojuego), a menudo como cierre; la cuenta dicha de memoria y de a un paso | [O] 12 de 12 |
| Cierre / CTA | **Shorts: ninguno pide nada** (0 de 13). Largos: un solo destino por pieza, en el primer tercio (17-35 %) | [O] subtítulos propios |
| Destino | Contenido → cursos y roadmap gratis → libro USD 29,99 → taller de USD 5.000 (negocios de USD 1 a 100 M; «si no ganaste con lo gratis, no vengas») → Vantage USD 36.000 al año por invitación | [O] páginas 8-oct |

### Iman Gadzhi (@ImanGadzhi), nuevo 8-oct

YouTube: 80 largos más recientes de 483 (0 Shorts); TikTok 120 posts. 10 largos por Gemini y 8 TikToks medidos.
Ficha: `vi/2026-10-08-referente-gadzhi.md`.

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | YouTube largo horizontal en inglés (mediana 18 min). El TikTok es otro negocio: skits de pareja sin un solo CTA. **No publica a diario**: 7 largos en 63 días y luego 6 semanas sin nada | [O] §1.3-1.4 |
| Lo que rinde | En 2026, los largos **con una herramienta de IA** rinden 2,6 veces más (mediana 509 mil contra 195,5 mil). Los dos de más de 1 M: tutorial de Claude por niveles y lista de 5 negocios con IA. El peor: opinión sin herramienta ni número | [O] §1.1 |
| Ganchos | **Filtro de dolor** («si te gusta hacer el mismo trabajo aburrido cada semana, cerrá el video»); dos opciones con numerales en pantalla; error masivo; cambio de era; dato con número | [O-G] §3.1 |
| Cuerpo | Confesión («no soy técnico») → **mapa de niveles antes de 1:15** → un tip con rótulo cada 2-3 min → CTA al ~20 % → cierre ritual (la misma despedida en 8 de 10 largos). Cada video crea una palabra propia (CLEAR, «Lazy Model») | [G] con minutos verificados en el de Claude |
| Cierre / CTA | Sorteo de una MacBook por comentario, que **no mueve los comentarios** (0,6 a 5,0 por mil con y sin sorteo); descripción de 1-2 líneas: un recurso y «mirá este otro video» (el mismo video pilar en 4 de 5) | [O] §1.5, §2.6 |
| Destino | Recurso en Notion con acortador propio → Digital Launchpad USD 37/mes → Consulting.com por aplicación → Monetise con lista de espera sin precio (18 meses cerrada) | [O] §2.6 |

### Enrique Rocha (@soyenriquerocha)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel a cámara, carrusel de lista curada | [P] reel `Dd2S811ODEy` (28-sep, Sonnet 5.5); [P] carrusel «repos» del 17-sep (notas en `docs/historial/cola/marca-personal-sep/PARA-PUBLICAR-APPLE-REPOS.md`) |
| Duración | **8-oct:** 53-89 s; sus 9 videos de TikTok de más de 20 mil duran 57-83 s. Remates de 12-15 s | [O] ficha Rocha §1.7 |
| Ganchos | Novedad de modelo el mismo día del lanzamiento (Sonnet 5.5 publicado 28-sep, el día que salió) | [P] caption + fecha |
| Ganchos (8-oct) | **Lo que rinde no es la noticia** (modelos: 9 % de las piezas y 1 % de las vistas de TikTok). Rinden: dolor + defecto visible («se nota a kilómetros», 87,9 mil); segmento + número + gratis («si tenés un negocio pequeño, 15 empleados gratis», 467 mil en IG, con una noticia de mayo contada en agosto); «tú que [hacés X]» (62,4 mil); «literalmente hice…» (42,4 mil). Título escrito de 4-7 palabras en el cuadro 0, nunca saludo | [O] ficha Rocha §3.1 |
| Cuerpo (8-oct) | Receta de 2-4 pasos, una herramienta con nombre propio por paso y una captura de 1-5 s por paso; un giro a mitad («pero esto solo sirve para proyectos nuevos»). Guion de 235-456 palabras a ~4,5 por segundo | [O] ficha Rocha §3.2 |
| Cuerpo / "cómo" | Carrusel: **cada lámina = un nombre propio** (el repo) + un mock de terminal que muestra el mecanismo; marca grande (GitHub) en la portada. Nada de categorías abstractas como titular | [P] nuestra nota de estructura del 17-sep; la ficha del carrusel no se guardó |
| Cierre / CTA | Sin dato del CTA de reels. **8-oct:** siempre igual, 8-15 s: oferta de una guía + «comentá [una pregunta que pide un dato] y te la paso» + «seguime y compartilo». La pregunta de uso trae más comentarios que la de gusto (0,61 % contra 0,08 % de las vistas). Nunca «link en la bio» | [O] ficha Rocha §3.4 |
| Destino | Bio → tododeia.com: «la bóveda» con **287 guías gratis, sin registro** (Claude, Claude Code, Codex, MCP, skills, automatización), 2 ebooks pagos (USD 29 c/u), eventos LIVE (luma), llamadas 1:1, repos open source, colaboraciones | [O] web leída 29-sep y 28-sep |
| Mecanismo de embudo | Cada short conduce a una guía pública, específica y actualizable; primero la biblioteca gratis, después el producto. **8-oct:** cada serie tiene además un repo propio en GitHub (whatsapp-agentkit 529 estrellas, the-architect 535) que es el imán real | [I] lectura nuestra del 22-sep (`hermes-content/docs/historial/cola/marca-personal-sep/PLAN-CONTENIDO-23-27-SEP-2026.md`) sobre lo observado en la web; [O] GitHub 8-oct |
| Edición | Sin dato. **8-oct:** toma continua de cara con capas (título fijo, subtítulo blanco sin color, caja que escribe, ficha de logo) y 2-7 capturas; receta en la skill `edicion-referentes` | — |

### Erik Taveras (@eriktaveras)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel vertical + **guía escrita pública** por cada tema; comunidad con foro | [P] reels `Ddxz2P_uCp6` (27-sep), `DdpF111p5Iz` (23-sep); [O] guías en comunidad.eriktaveras.com |
| Duración | Sin dato de los reels. **8-oct (250 TikToks):** cuanto más largo, más rinde: más de 120 s mediana 24,3 mil; 21-45 s (su molde de noticia, el 32 % de las piezas) 5,1 mil | [O] ficha Erik §1.3 |
| Ganchos | Sistema propio en uso + tema del día: subagentes (27-sep), n8n + Claude Code + Hermes (23-sep), MCP oficiales de Meta (21-sep) | [P] captions; [O] fechas en páginas primarias |
| Ganchos (8-oct) | Siempre un sustantivo concreto y una razón para quedarse en 3 s. Sus hits: objeto + precio + comparación («lo que tengo en la mano cuesta 120 dólares», 598 mil); felicitación + amenaza («lanzaste tu app; ahora viene lo legal», 352 mil); «este es mi X» sobre el objeto (287 mil); situación del usuario + reencuadre («te quedás sin mensajes; el problema no es el plan», 277 mil); «¿y si te dijera…?» + ahorro (181 mil); «¿alguien se acuerda de X?» (180 mil). La noticia «X acaba de lanzar Y» rinde 7-13 mil | [O] ficha Erik §3.1 |
| Cuerpo (8-oct) | Índice entre los 3 y los 13 s en todo video de más de 59 s («4 rondas», «el mapa de este video»); un número por punto; orden de lo más barato a lo más caro; un error propio o un límite dicho en voz alta; descargo antes del CTA en temas legales | [O] ficha Erik §3.3 |
| Cuerpo (guía) | **Entrada → encargo/prompt completo → roles → salida definida → comprobación**; señala datos ausentes; cuenta su propio error (conteo mal hecho en la prueba de subagentes; fallos en la guía de edición) | [O] `erik-subagentes`, `erik-edicion` en el `.json` |
| Cómo muestra el "cómo" | Prompt íntegro publicado, tabla de papeles por herramienta, comandos, tabla capacidades/requisitos/límites + prompts de inicio | [O] guías `analisis-con-subagentes-claude-code`, `n8n-claude-code-hermes-conectados`, `tres-mcp-oficiales-de-meta` |
| Cierre / CTA | «Aplicalo y compartí tu resultado en el foro»; en MCP: «elegí una tarea y empezá leyendo» | [O] guías |
| Destino | Guía leíble **sin cuenta**; el ZIP de la skill de edición sí pide cuenta. link.eriktaveras.com/erik → recursos, formación, newsletter, llamada | [O] |
| Edición | De sus reels, sin dato. Su guía de edición dice qué persigue: voz e interfaz legibles, transcripción sincronizada, gráfico solo cuando agrega contraste o consecuencia | [O] guía; [I] que sus reels se vean así |
| Edición (8-oct) | Cambia de sistema visual cada 4-6 semanas; el vigente (3-oct) es panel oscuro arriba con tarjetas propias, cámara abajo y subtítulo pegado a la costura. Corta todo silencio (pausa máxima 0,24-0,44 s, 3,7-4,3 palabras por segundo). Un largo de YouTube se corta en 6 verticales el mismo día | [O] ficha Erik §4 |

### Ian Lee (@ianlee.js)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel a cámara con documento en split, reel de relato en exterior, carrusel de pitch | [O] `Db6y_ypvWbF` (58/58 fotogramas); [P] `DdmNXhGOnHe` (22-sep), `DcpMghFBI-d` (29-ago); [P] carrusel `Dd0-c9llMY_` (28-sep) |
| Duración | 36,0 s (PRD) | [O] `vi/2026-08-23-cosecha-guia-una-pagina-prd-ianlee.md` |
| Ganchos | **Método + objeto gratis** en rótulo fijo: «Cómo hago mis PRD + guía gratis para comenzar», con dos cortes de clips oscuros en los primeros 2,2 s. Relato de fundador: construir una web para conseguir una oportunidad | [O] PRD; [P] relatos |
| Cuerpo | PRD: promesa → definición prestada (captura del buscador, 3,5-8 s) → explicación a cámara → **documento propio scrolleado** (12,5-15,9 s) → cierre. El documento enseña con contrastes: CONTIENE / NUNCA CONTIENE, ASÍ NO / ASÍ SÍ, tamaño según el cambio | [O] |
| Cómo muestra el "cómo" | El artefacto (documento) en pantalla, no la herramienta. Relatos 22-sep: construcción de una función + decisiones B2B | [O] PRD; [P] relatos |
| Cierre / CTA | Caption «Comenta "PRD" y te mando la guía» (entrega del DM no verificada) | [O] |
| Destino | Bio → getnexor.ai/es (su producto: demo y docs). No se observó comunidad | [O] |
| Edición | Todo el presupuesto de corte en el gancho (2 cortes en 2,2 s, luego casi ninguno); rótulo de 2 líneas fijo arriba; subtítulos de 2-3 palabras con crossfade; split cara arriba/documento abajo con scroll manual; cero motion, cero textura | [O] |

### Tiago Lemos (@tiagolemosx)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel a cámara con banda gráfica de comparación; reels de edición con IA | [O] `Db60O6OxWU5` (48/48 fotogramas); [P] `DdzhIFKRQ43` (27-sep); `Dd1-soxP8L5` (28-sep) sin caption útil |
| Duración | 15,8 s, **una sola toma, 0 cortes** | [O] `vi/2026-08-23-cosecha-escalera-ruim-bom-excelente.md` |
| Ganchos | Contraste visual inmediato: la misma pieza en RUIM / BOM / EXCELENTE. Caption: «A IA te entrega todos os níveis, você apenas precisa saber como pedir» | [O] |
| Cuerpo | 4 briefs × 3 niveles (≈1,3 s por nivel, ≈3,9 s por brief) → CTA. El eje que enseña: menos texto, más jerarquía, y en el nivel alto un concepto visual | [O] piezas; [I] el eje es nuestra lectura |
| Cómo muestra el "cómo" | **No lo muestra**: sin prompt, sin interfaz, sin herramienta nombrada | [O] ausencia |
| Cierre / CTA | Pill «COMENTA "GPT"» sobre el pecho; 27-sep pide «EDIÇÃO» | [O]; [P] |
| Destino | Bio → mestres.ai/meia-pv1-bio (contenido de esa página no revisado) | [O] enlace; destino sin leer |
| Edición | Plano fijo; banda gráfica arriba con 1-3 piezas 4:5 y etiqueta bajo cada una; cara en los dos tercios inferiores; **el gesto de la mano anticipa cada aparición**; fondo de estantería real contra overlay plano | [O] |

### Carlos Domínguez (@carlosdominguez.dev)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel con UI simulada (WhatsApp/CRM) y voz; serie por episodios | [O] `Dbiu19JRMSr` con transcripción; [P] `Dd1j7n7xRyM` (28-sep, etiqueta T1/E3) |
| Duración | 65,3 s | [O] `vi/2026-08-11-chatbot-dato-sensible-ley-21719-chile.md` + `vi/transcripciones/2026-08-11-Instagram-Dbiu19JRMSr.md` |
| Ganchos | **Consecuencia sobre un mensaje inocente**: «Este mensajito tan amable puede costarte…» con la burbuja de WhatsApp en pantalla | [O] |
| Cuerpo | Contexto del caso (clínica, bot, clienta cancela «estoy enferma») → el error (al día siguiente «¿Ya te sientes mejor?») → por qué es error (dato sensible) → objeciones tachadas («lo dijo ella misma», «lo anotó la recepcionista») → corrección en el CRM («Reagendado por el cliente, sin motivo») → regla en una placa | [O] con tiempos, ver F3 |
| Cómo muestra el "cómo" | La misma UI antes y después: nota del CRM con el error → nota corregida | [O] |
| Cierre / CTA | «Comenta LEY y te mando gratis el checklist»; 28-sep: CTA «PROMPT» | [O]; [P] |
| Destino | Bio → lafragua.dev, carlosdominguez.com.mx, comunidad skool.com/imperio | [O] bio 28-sep |
| Edición | Rótulo constante en la esquina («LEY 21.719»); subtítulos en MAYÚSCULAS frase por frase; sellos y tachados; placa final de regla. 28-sep: etiqueta de episodio + cara + encabezado del proceso | [O]; [P] |

### Apoyo: @ingenierobinario y Revolutia

| Fuente | Qué aporta | Evidencia |
|---|---|---|
| Ingeniero Binario, carrusel Graphify (12 láminas) | El mejor molde de **tutorial por pasos** del corpus: costo con cuenta → solución → requisitos → 01-05 con comando → **paso crítico marcado** → salida → mantenimiento → pregunta. CTA «Comenta 'AUDITAR'» | [O] `vi/2026-08-28-graphify-memoria-permanente-del-agente.md` |
| Ingeniero Binario, reel 22-sep (64,97 s) | Terminal + cara; cierre con DM ofrecido | [P] `hermes-content/docs/historial/cola/marca-personal-sep/AUDITORIA-GUIONES-COMUNIDAD-2026-09-28.md` |
| Ingeniero Binario, historia-quiz | Código de 3 líneas con trampa → pregunta en barra de acento → **sticker nativo de encuesta** | [O] `vi/2026-09-02-ingenierobinario-historia-quiz.md` |
| Revolutia (TikTok, 42 s) | Contraste «por defecto vs setup correcto» → promesa numerada («tres skills, tres conexiones») → nombres propios → giro («la diferencia no es el modelo, es lo que le instalás») → link en perfil a comunidad. Web arriba / cara abajo. Guardados > likes (6.874 vs 6.220 el 1-sep) | [O] guion completo en caption; montaje [I] en `vi/2026-09-01-revolutia-estilo-tiktok.md` |

### 1b. Ganchos ordenados por lo que rinden (8-oct-2026)

Medianas de vistas dentro del catálogo de cada uno (no se comparan entre referentes: cada cuenta tiene su escala). `n`
chico: es orientación, no ley. Ejemplos parafraseados; en el guion se escriben en voseo.

| Fórmula | Ejemplo | Quién | Rinde | Versión para Sergio Urcullo (a verificar el día de grabar) |
|---|---|---|---|---|
| **Orden de mirar + prueba ya en pantalla** | «Vean esto.» con el producto a la vista | Santiago | mediana 128 mil (n=4; todos de 68 a 419 mil) contra 12,65 mil de su catálogo | «Mirá esto.» con el bot respondiendo en pantalla |
| **Pregunta de plata con fecha + herramienta** | «¿Cuánto te costará responder en WhatsApp?» | Santiago | 1,6 M (n=1) | «¿Cuánto te cuesta tu bot con el modelo nuevo?» + la cuenta |
| **Objeto + precio + comparación** | Lo que tengo en la mano cuesta 120 dólares y hace casi lo mismo | Erik | 598 mil (su #1) | El celular con el bot: «esto contesta mil mensajes por 30 centavos» |
| **Segmento + número + gratis** | Si tenés un negocio pequeño, Claude sacó 15 empleados gratis | Rocha | 467 mil en IG (noticia de mayo, contada en agosto) | «Si tenés una clínica, [cosa verificada] ya [cambio], y son [N]…» |
| **Felicitación + amenaza** | Lanzaste tu app; ahora viene lo legal: 4 cosas o te demandan | Erik | 352 mil | «Pusiste un bot en WhatsApp; ahora viene la regla de 24 horas» |
| **Dolor + defecto visible** | Lo que armás con Claude se nota a kilómetros | Rocha | 87,9 mil (su #1 de TikTok) | «Tu bot se nota que es un bot» |
| **Situación del usuario + reencuadre** | Te quedás sin mensajes; el problema no es el plan | Erik | 277 mil | «Tu bot no contesta; el problema no es el bot, es la ventana» |
| **Filtro de dolor** | Si te gusta el trabajo aburrido y repetido, cerrá el video | Gadzhi | 1,49 M y 639 mil (sus 2 tutoriales) | «Si todavía contestás WhatsApp a mano y te sobra el tiempo, no sigas» |
| **El dueño dice su problema con cifras** | Facturamos 7 M; mi COO dice que frene, ¿quién tiene razón? | Hormozi | diálogos: mediana 155,5 mil contra 16,5 mil | Solo con un dueño real y permiso escrito (asesorías grabadas). No se inventa la cita |
| **Resultado en primera persona** | Acabo de reemplazar a mi editor | Santiago, Rocha | 31,5 mil (Santiago, n=6); «literalmente hice…» 42,4 mil (Rocha) | «Le dejé a una clínica el bot funcionando en una tarde» (solo si pasó) |
| **Escena ya en curso** | El audio de una llamada real del agente, sin intro | Santiago | 26,8 mil (n=6); 209 mil la inmobiliaria | La captura del chat real con el cliente |
| **Tesis debatible con número** | Una suscripción de Claude es la mejor inversión hoy | Santiago | 57,5 mil (n=4); 361 mil el mejor | Con el número propio verificado |
| «X acaba de lanzar Y» sin demo | Anthropic acaba de lanzar Sonnet 5.5 | Santiago, Erik, Rocha | Santiago 11,2 mil (n≈16); Erik 7-13 mil; Rocha 1 % de las vistas | **Evitar como gancho solo**: sumarle la cuenta o la prueba |
| Narrativa, meme, motivacional sin cara | En 1962 un astronauta se negó a despegar… | Santiago | 1,1 mil | **No usar** |

Patrones de los 5: ningún gancho saluda; en 3 s ya hay un sustantivo concreto (producto, precio, objeto) y un texto
escrito; la noticia rinde cuando trae una herramienta, una cuenta o un caso, nunca sola.

---

## 2. Fórmulas de guion

Tiempos de **vertical 45-75 s**: donde el referente midió, se toma su medida; el resto se
reparte para el formato de Sergio **[I]**. Tiempos de **horizontal 6-12 min**: el único
horizontal observado son los 20-28 min de Santiago; la versión de 6-12 min es **[I]** en todas
las fórmulas.

Regla común (observada en Erik, Carlos, Ian e Ingeniero Binario): **la unidad de enseñanza
se entrega completa antes del CTA.** El CTA amplía; no reemplaza.

### F1 · Resultado primero → cómo → comprobación → siguiente paso

Quién: Santiago (YouTube por capítulos, reel Astra) [O]; Ian PRD (el artefacto aparece
scrolleado) [O]; Erik (comprobación y datos faltantes en cada guía) [O].
Cuándo: tutorial reproducible de algo que Sergio construyó y que funciona en pantalla.

| Vertical | Paso |
|---|---|
| 0-3 s | El resultado funcionando (arriba) + una frase de lo que hace |
| 3-8 s | Para quién es y qué va a poder hacer el espectador |
| 8-45 s | Entrada o prompt visible → ejecución → salida, zoom al dato que importa |
| 45-60 s | Cómo saber si salió bien: un caso que pasa y uno que falla |
| 60-70 s | Siguiente paso existente (guía, comunidad) |

| Horizontal | Paso (orden de capítulos de Santiago) |
|---|---|
| 0:00-0:40 | Resultado final + qué vas a poder hacer |
| 0:40-2:00 | Requisitos y configuración |
| 2:00-6:30 | Creación paso a paso, pantalla completa, cara en recuadro |
| 6:30-8:30 | Revisión: qué salió mal y cómo se corrigió |
| 8:30-10:30 | Personalización / variantes |
| 10:30-11:30 | Recurso + comunidad |

### F2 · Noticia → qué cambia para vos → probalo así

Quién: Santiago (Opus 23-sep, Sonnet 28-sep) [P]; Enrique (Sonnet 28-sep, el día del
lanzamiento) [P]; Carlos (flujo n8n con Claude Code 28-sep) [P]; Erik, MCP de Meta:
capacidades → requisitos → límites → prompts de inicio → «empezá leyendo» [O].
Cuándo: lanzamiento con fuente oficial fechada. El cuerpo se apoya en la guía de Erik;
de los reels de Santiago y Enrique solo se sabe que cubren la noticia rápido.

| Vertical | Paso |
|---|---|
| 0-3 s | Qué salió y cuándo (fecha exacta, no «hoy» si no es hoy) |
| 3-15 s | Un dato oficial en pantalla (anuncio, tabla de precios) |
| 15-35 s | Qué cambia en una tarea concreta; para quién sí y para quién no |
| 35-60 s | Prueba mínima que el espectador puede repetir hoy: prompt visible + qué mirar |
| 60-70 s | Límite dicho + siguiente paso |

| Horizontal | Paso |
|---|---|
| 0:00-0:45 | Noticia + por qué importa a este público |
| 0:45-2:30 | Fuente oficial leída en pantalla: qué dice y qué no dice |
| 2:30-7:00 | Prueba propia con la misma entrada; registrar modelo, fecha y tiempo |
| 7:00-9:00 | Dónde se usaría en un negocio real |
| 9:00-10:00 | Límites + siguiente paso |

### F3 · Caso real → error → por qué → corrección → regla

Quién: Carlos (medido) [O]; Erik cuenta su propio error de conteo y sus fallos de edición [O].
Cuándo: hay un error concreto, visible en una UI, con una regla que se puede decir en una frase.

| Vertical (tiempos reales de Carlos, 65 s) | Paso |
|---|---|
| 0-5 s | Consecuencia encima de la UI del error |
| 5-15 s | Contexto: quién, qué canal, qué pidió |
| 15-21 s | El error, visible |
| 21-42 s | Por qué es un error (fuente) + objeciones descartadas |
| 42-47 s | Corrección en la misma UI |
| 47-53 s | Regla en una placa, una frase |
| 53-65 s | Siguiente paso |

Horizontal [I]: 0:00-1:00 el caso · 1:00-4:00 auditoría del sistema propio buscando el mismo
error · 4:00-8:00 corrección en vivo · 8:00-10:00 la regla aplicada a 2-3 casos más · cierre.

### F4 · Misma tarea, varios niveles (A vs B, así no / así sí)

Quién: Tiago, escalera de 3 niveles en 4 rubros [O]; Revolutia, «por defecto vs setup
correcto» [O-caption]; Ian, ASÍ NO / ASÍ SÍ dentro del documento [O].
Cuándo: el valor está en el criterio. Tiago **no muestra el prompt**: para que enseñe hay que
agregar qué cambió en la entrada, que él omite.

| Vertical | Paso |
|---|---|
| 0-3 s | La misma tarea, fija en pantalla |
| 3-12 s | Nivel malo |
| 12-28 s | Nivel medio + qué cambió en la entrada |
| 28-48 s | Nivel alto + qué cambió |
| 48-60 s | El criterio en una lámina |
| 60-70 s | Siguiente paso |

Tiago lo resuelve en 15,8 s sin cortes: sirve como pieza corta aparte, no como tutorial.
Horizontal [I]: la misma entrada en 2-3 herramientas o modelos, con tabla de criterios y
resultado registrado por fila.

### F5 · Abrí la fuente: número primero → lectura → consecuencia práctica

Quién: Santiago, algoritmo de X (repo, código, tabla de pesos, prueba propia) [O];
Ingeniero Binario, cuenta de 46.740 tokens antes de la solución [O].
Cuándo: hay una afirmación que circula y una fuente primaria que se puede abrir en pantalla.
Es la forma observada de «mito vs realidad»; no hay en el corpus una fórmula de mito
separada con evidencia propia.

| Vertical (Santiago: 74,6 s, 5 cortes; reparto por bloque [I]) | Paso |
|---|---|
| 0-3 s | La afirmación, en rótulo |
| 3-15 s | La fuente abierta (repo, documento, precio oficial) |
| 15-40 s | El número o la tabla; zoom al dato que sorprende |
| 40-55 s | Qué hacer distinto a partir del dato |
| 55-70 s | Prueba propia o límite + siguiente paso |

Horizontal [I]: leer la fuente completa en pantalla, separando lo que dice de lo que se
interpreta, y verificar el número antes de sacar conclusiones.

### F6 · Construyo en público / episodio de serie

Quién: Ian (construcción de una función y decisiones B2B; web para conseguir una
oportunidad) [P]; Carlos (etiqueta T1/E3) [P]; Santiago (primera persona como operador) [O];
Erik (cómo dice usar su cadena desde el teléfono) [O-guía].
Cuándo: trabajo real de ONIA, decisiones del día, vlog POV. Los tiempos son [I] porque las
piezas de Ian solo se vieron por caption y fotogramas.

| Vertical | Paso |
|---|---|
| 0-3 s | El problema o la decisión del día |
| 3-20 s | Qué construí (pantalla real) |
| 20-45 s | Por qué lo decidí así (negocio, costo, cliente) |
| 45-60 s | Qué salió mal o qué falta |
| 60-70 s | «Próximo episodio» o siguiente paso |

Horizontal [I], vlog de 8-12 min: objetivo del día → 3 decisiones con pantalla → balance al
cierre. Sin guion memorizado; no inventar clientes ni resultados.

### F7 · Receta en N pasos con el paso crítico marcado

Quién: Ingeniero Binario, carrusel Graphify (el paso 3 marcado como el que decide si sirve)
[O]; Erik, guías con entrada/pasos/salida [O]; Ian, documento por secciones § [O].
Cuándo: instalación o configuración con comandos exactos y una trampa conocida.

| Vertical | Paso |
|---|---|
| 0-4 s | El problema con su costo en números |
| 4-10 s | Requisitos |
| 10-50 s | Pasos 1..N con comando en pantalla; el crítico con advertencia y su porqué |
| 50-60 s | Salida esperada y cómo comprobarla |
| 60-70 s | Pregunta de cierre + siguiente paso |

Horizontal [I]: cada paso ejecutado en vivo, incluido el error que aparece si te saltás el
paso crítico.

### F8 · Quiz de historia: parece obvio → pregunta → la respuesta obvia está mal

Quién: Ingeniero Binario [O]. Formato de historia, no video: sin plantilla vertical ni
horizontal.
Secuencia: historia 1 = escena corta (código, chat, agenda) + pregunta + **sticker nativo
de encuesta** (las opciones no se dibujan) → historia 2 = solución y porqué → opcional:
enlace a la pieza que lo explica.

### F9 · Noticia con fecha → objeción → herramienta propia gratis → demo → enlace (8-oct)

Quién: Santiago, calculadora de WhatsApp (6-sep, 116 s, 1,6 M) [O, Whisper + cuadros]. La misma clase de noticia sin
herramienta hace 2 a 14 mil en su cuenta.
Cuándo: hay un cambio con fecha que le cuesta plata al dueño y una herramienta propia que calcula cuánto. **Requiere
construir la herramienta antes**: sin ella es F2.

| Vertical (tiempos de G1) | Paso |
|---|---|
| 0-2 s | La pregunta de plata con la fecha, escrita en 3 líneas, con un gesto en el cuadro 0 |
| 2-5 s | La prueba externa: titulares o doc oficial con sello de la fecha |
| 5-16 s | Qué cambia, en 3 tarjetas |
| 16-37 s | La objeción en voz alta («¿cambiamos de WhatsApp?») y por qué no |
| 37-45 s | Bisagra: «les tengo algo» |
| 45-107 s | Demo de la herramienta con el número del espectador |
| 107-116 s | Un PDF o recurso gratis + «el enlace está en mi perfil» |

### F10 · Visito un negocio y le dejo IA funcionando (POV, tráiler del largo) (8-oct)

Quién: Santiago, restaurante (694,7 mil) y cafetería (303,5 mil en TikTok, 112 mil en YouTube) [O].
Cuándo: hay un negocio real que acepta, por escrito, salir en cámara. Nada de datos de clientes o pacientes en pantalla.

| Vertical (90-120 s) | Paso |
|---|---|
| 0-4 s | POV llegando al lugar, título de 3-5 palabras («Implementando IA a una clínica»); puede arrancar sin voz si el lugar hace de gancho |
| 4-15 s | De dónde salió el caso (serie, recomendación) |
| 15-60 s | El dueño o el equipo dicen 1-2 problemas; el diagnóstico |
| 60-90 s | Lo que se armó, funcionando; ANTES/DESPUÉS con foto real; una pausa humana |
| 90-120 s | Bucle abierto (la reacción del dueño, en el largo) + «el tutorial completo en el enlace de mi perfil» |

Horizontal: el mismo caso de 25-45 min, con el resultado adelantado en los primeros 90 s.

### F11 · Riesgo + número + arreglo de una línea, de lo más barato a lo más caro (8-oct)

Quién: Erik, «4 requisitos legales para tu SaaS» (104 s, 352 mil): la misma estructura 4 veces, el clímax es lo más
caro con el arreglo más barato [O, Whisper + cuadros]. Su repetición («5 requisitos», 4 días después) rindió la quinta
parte: una vez por tema.
Cuándo: reglas de plataforma, fiscales o legales con consecuencia concreta.

| Vertical (tiempos de Erik) | Paso |
|---|---|
| 0-6 s | Felicitación + amenaza: «hiciste X; ahora viene Y» |
| 6-9 s | «Te las ordeno de lo más barato a lo más caro» |
| 9-90 s | Por cada punto: riesgo, número con fuente, arreglo en una línea |
| 90-98 s | Descargo honesto: «no soy abogado ni contador; es un checklist» |
| 98-104 s | Recurso con lo que trae |

### F12 · Dolor del usuario → mecanismo → N causas con su arreglo → recurso numerado (8-oct)

Quién: Erik, «límites de mensajes en Claude» (136 s, 277 mil): «te quedás sin mensajes; nadie te explicó cómo funciona
el límite» → ventana de 5 horas → 4 causas, cada una con su arreglo → «10 hábitos» [O-G].
Cuándo: el espectador ya sufre el síntoma y no entiende la regla de fondo (la ventana de 24 h de WhatsApp, el límite
de Claude, la factura del SIN).

| Vertical | Paso |
|---|---|
| 0-5 s | Situación + reencuadre: «el problema no es X» |
| 5-33 s | El mecanismo, con la pantalla real donde se ve |
| 33-125 s | «N cosas consumen más de lo que creés»: causa + arreglo, una por tramo |
| 125-136 s | Recurso con número («los 10 hábitos») |

### F13 · La pregunta del dueño real → diagnóstico → regla con nombre → analogía (8-oct)

Quién: Hormozi, shorts de diálogo (mediana 155,5 mil, 9 veces la frase sola) [O, archivos medidos].
Cuándo: **solo con un dueño real que acepta por escrito** (asesorías gratis grabadas). Sin dueño, no se inventa la
pregunta: se usa F3 o F12.

| Vertical (tiempos de «Which One», 89 s) | Paso |
|---|---|
| 0-25 s | El dueño cuenta su negocio con cifras y pregunta |
| 25-30 s | Un chiste corto que baja la tensión |
| 30-41 s | El principio |
| 41-67 s | La regla con nombre propio, en un plano sin cortes |
| 67-89 s | La analogía cotidiana como cierre; sin CTA |

### F14 · YouTube por niveles: filtro → confesión → mapa → un tip por tramo → cierre ritual (8-oct)

Quién: Gadzhi, «Claude en 26 minutos» (1,49 M), con minutos verificados [O-G]. Reemplaza los tiempos [I] del horizontal
de F1 cuando el video es un tutorial de una herramienta.

| Horizontal (Claude, 26 min) | Paso |
|---|---|
| 0:00-0:30 | Filtro de dolor + rótulo de 3 palabras |
| 0:30-1:25 | Confesión («no soy técnico») + «nadie trae manual» + mapa de niveles (1:03-1:16) |
| 1:26-14:15 | Nivel 1: tips 1-5 (1:26, 2:57, 5:25, 10:30, 12:24), rótulo dentro de 1-3 s de cada uno |
| ~5:30 (20 %) | El CTA, una sola vez antes del final |
| 14:15-23:25 | Niveles 2 y 3 |
| 23:25-26:26 | Último tip, CTA repetido y la despedida de siempre |

### Recursos que suman a cualquier fórmula (8-oct)

- **Una regla con nombre propio de 2-3 palabras por pieza** (Hormozi, 12 de 12; Gadzhi: CLEAR, «Lazy Model»). Sirve de
  palabra de la comunidad.
- **Una analogía cotidiana por pieza** (Hormozi: 4 de 6 shorts y 6 de 6 largos).
- **La cuenta dicha de a un paso**, con el número entrando a la vez (Hormozi, Santiago G7, Erik).
- **Índice a los 3-13 s** en todo video de más de 60 s (Erik).
- **Revelar al final cuánto costó y cuánto tardó el propio video**, solo con la cifra medida (Santiago G3, 419,5 mil).
- **Objeción lanzada en voz alta y contestada** (Santiago G1 0:18; G4 0:47).
- **Pedir el próximo caso al público y cumplirlo** («¿qué negocio les gustaría que fuera el siguiente?», 303,5 mil).

### Cierre: keyword gateada o guía abierta

**Números del 8-oct sobre cada CTA:**

| Referente | CTA | Qué se midió |
|---|---|---|
| Santiago | «El enlace está en mi perfil», dicho y con captura del perfil | 7 de 11 videos de TikTok; comentarios = 0,07 % de las vistas (en TikTok no conversa) |
| Erik | «Comentá PALABRA» dicho, escrito y tecleado al final | 3 a 8 veces más comentarios por vista que sin palabra (mediana 3,3 contra 0,4-1,0 por mil), no 10 |
| Rocha | «Comentá [una pregunta que pide un dato] y te la paso» | La pregunta de uso, 0,61 % de las vistas; la de gusto, 0,08 %. En IG ~6 veces más comentarios que en TikTok |
| Hormozi | Shorts sin CTA; largos con uno solo en el primer tercio | 0 de 13 shorts; 3 largos confirmados al 17, 33 y 35 % |
| Gadzhi | Sorteo por comentario | No mueve los comentarios (0,6 a 5,0 por mil con y sin sorteo) |

Para Sergio Urcullo sigue el CTA al perfil (decisión del 8-oct): ninguna de estas cifras justifica volver a «comentá y
te lo mando» mientras el mensaje directo automático no funcione.

Dos modelos observados:

- **Comentá PALABRA → DM** (Santiago, Ian, Tiago, Carlos, Ingeniero Binario) [O]. Ninguna
  entrega por DM está verificada.
- **Guía pública sin barrera** (Erik, Enrique) [O], con comunidad o producto como segundo paso.

Para Sergio: usar solo un destino que ya exista y responda. Verificados con HTTP 200 el
28-sep: `sergiourcullo.vercel.app` y `/claude-code`. No prometer «comentá y te mando» sin
el recurso y la entrega listos.

---

## 3. Fórmulas de carrusel

| Molde | Portada | Láminas | Cierre | Evidencia |
|---|---|---|---|---|
| **C1 Tutorial técnico por pasos** | Problema + número de pasos («Tu agente tiene amnesia: 5 pasos…») | Costo con la cuenta hecha → solución → requisitos → `01`-`05`: comando en tarjeta negra, **advertencias en tarjeta blanca** (el único elemento claro, para que el ojo vaya ahí) → salida esperada → mantenimiento | Pregunta («¿contexto o suerte?») + «Comenta 'AUDITAR'». Cornisa fija «← Desliza» en todas | [O] Ingeniero Binario, 12/12 láminas |
| **C2 Lista con nombres propios** | Marca reconocible en grande (GitHub) | Una lámina por elemento, con **su nombre** + un mock que muestra el mecanismo; nada de categorías abstractas | Sin dato del cierre de Enrique | [P] Enrique 17-sep; adaptación propia ya hecha: `docs/historial/cola/marca-personal-sep/PARA-PUBLICAR-APPLE-REPOS.md` |
| **C3 Mecanismo → usos → recurso** | Mecanismo | Usos | Skill o tutorial | [P] Santiago `DdwmO09CN4y`, solo caption |
| **C4 Relato de fundador en restricción** | La restricción (pitch de 60 s) | Mercado → por qué LATAM y EE. UU. → equipo → reposicionamiento | Sin dato | [P] Ian `Dd0-c9llMY_`, solo caption |
| C5 (no es referente) Autoridad en 15 | Cifra de caso | Caso → oportunidad → «no hagas X» → 5 ejemplos → «la parte que todos se pierden» → playbook → cómo construirlo → distribución | Pregunta equivocada vs correcta + comentá PALABRA | [O] `vi/2026-08-23-carrusel-15-laminas-repos-nichados-buildercult.md`. Molde útil; sus cifras de ingresos no se usan |

Patrones que se repiten [O]: un solo color de acento, reservado para el dato; el código
siempre en tarjeta tipo ventana; el número de la portada coincide con el de las láminas.
Ingeniero Binario prometía «7 pasos» en el caption y mostraba 5: no inflar.

---

## 4. Qué NO copiar

**Identidad**
- Paletas y tipografías firma: amarillo de keyword y rótulo cian de Santiago, naranja
  `#FF6B2C` del reel de X, pixel font «CODE TIME!» y el cobalto de Ingeniero Binario,
  caja con gradiente morado de Revolutia, pill blanco de Tiago. ONIA usa su verde.
- Frases firma: «tu maldito PRD», «la joyita», «X acaba de matar a Y», «ecuación de logos = 💰».
- Sets, música, mascotas, props, logos flotantes estilo clay.
- Experiencias ajenas: a16z y el pitch de Ian, las capacitaciones de Santiago, el teléfono
  de Erik. Sergio cuenta lo suyo.

**Afirmaciones**
- De ingresos o resultados: el pitch de Ian, «multiplicar ingresos» de Carlos (28-sep),
  los USD 143K de BuilderCult, las cifras del experimento de Erik.
- Laborales o absolutas: «reemplacé a mi editor» (Santiago), «mató a los diseñadores» y
  «sin tocar nada» (Revolutia).
- Legales ajenas: las multas y el alcance «aunque no vivas en Chile» de la Ley 21.719
  (Carlos) no se citan a clientes bolivianos. Sí se toma la regla de minimización de datos.
- Números sin verificar: los pesos del algoritmo de X salen de una captura; los 46.740
  tokens de Ingeniero Binario son ilustrativos.
- Métricas ajenas como prueba de que un formato funciona.

**Mecánicas con riesgo propio**
- «Comentá X y te mando» sin recurso listo. El comentario → DM de ONIA tiene dos rechazos
  de Meta y cero leads, y el private-reply de @sergiourcullo no tiene palabras cableadas.
- Prueba social con logos de clientes: ONIA tiene cero clientes pagando. Prohibido.
- En F4: nunca poner una pieza con marca ONIA como el nivel «malo» (regla «la venta nunca
  exhibe obra»).
- Cortar cada 2 s porque lo hace Santiago: su propio reel de X tiene 5 cortes. Dar tiempo
  real de lectura a la pantalla que enseña.
- Presentar una pantalla simulada como salida real de un modelo. Si es ejemplo, se rotula.

**Sumado el 8-oct (5 referentes medidos)**
- Cifras de estatus como prueba (Hormozi: USD 46,2 M de salida; Gadzhi: USD 10 M en Whop, ingresos en miniaturas).
  Con cero clientes, la prueba de Sergio Urcullo es la cuenta del guion y la pantalla real.
- Sorteos (Gadzhi): no mueven los comentarios y cuestan plata.
- La narrativa sin cara y con IA generada (Santiago, octubre): es donde su cuenta cayó a 0,9-2,7 mil.
- Presentar un repo o una lista ajena como propia (Rocha, «todos los agentes que necesitás») y cifras sin fuente en
  pantalla («te miente el 27 %»).
- Mostrar solo la herramienta y no el resultado: es la queja del público de Rocha (59 likes) y choca con «producto
  visible o no sale».
- Repetir un tema ya publicado con otro número («4 requisitos» → «5 requisitos»): rindió la quinta parte (Erik).
- Los vocabularios: «checar», «bro», «santinos» (Santiago); tuteo (Erik, Rocha, Gadzhi); groserías (Hormozi). Se copia
  la estructura, la voz es de Sergio Urcullo.
