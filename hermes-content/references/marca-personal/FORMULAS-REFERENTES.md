# Fórmulas de guion de los referentes

Síntesis 29-sep-2026 para escribir guiones de Sergio Urcullo que enseñen. No reemplaza
el registro de procedencia: [EXTRACCION-REFERENTES-GUIONES.md](EXTRACCION-REFERENTES-GUIONES.md)
(+ `.json`). Esto lo convierte en moldes reutilizables.

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
  sí se leyeron. Del montaje de Enrique no hay análisis: queda "sin dato".
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
| YouTube | Capítulos: resultado temprano → requisitos/configuración → creación → revisión → personalización. Ofrece recurso descargable y comunidad | [O-descripción] handoff `docs/handoff/CONTINUAR-GUIONES-CLAUDE-2026-09-28.md` §Investigación adicional |
| Método de trabajo que enseña | «Una instrucción completa» por video (OBJETIVO / MATERIAL / ESTILO), inventario de crudos, tabla de cortes + preview antes de cortar | [O] tutorial de 28 min, visto entero el 24-jul (skill `ver-videos`) |
| Cierre / CTA | **Comentá keyword** («Astra», «ANIMA») → tutorial. Fondo del CTA: b-roll totalmente desenfocado + texto centrado, keyword en amarillo | [O] Astra; [P] ANIMA (comentarios de `Ddz9G7KIEfT`, `docs/cola/AUDITORIA-GUIONES-COMUNIDAD-2026-09-28.md`) |
| Destino | Bio → forjabots.com, horizontesia.com (formación → Skool), hub link.me con YouTube. Encuentros presenciales y hot seat | [O] bio verificada 28-sep; [P] encuentros (`docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md`) |
| Edición | Cara **abajo ~45 % anclada**, apoyo **arriba ~55 %** que rota cada 1-3 s; 25-30 cortes en 92 s; subtítulos blancos 2-5 palabras con keyword amarilla; rótulo cian chico + título blanco; «ecuación de logos» (X + Y = 💰); b-roll ≤1,5 s; música tech + whoosh + pop. **Pero** el reel de X tiene solo 5 cortes en 74,6 s y alterna tres registros (tarjetas junto a la cara, grafo a pantalla completa con karaoke, split tabla/cara) | [O] ambas fichas |

Actualidad: reels sobre Opus 5.5 (23-sep, `DdpMVvQopMC`) y Sonnet 5.5 (28-sep,
`Dd2KbhWIRap`) con caption y gráfico de apoyo **[P]**.

### Enrique Rocha (@soyenriquerocha)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel a cámara, carrusel de lista curada | [P] reel `Dd2S811ODEy` (28-sep, Sonnet 5.5); [P] carrusel «repos» del 17-sep (notas en `docs/cola/PARA-PUBLICAR-APPLE-REPOS.md`) |
| Duración | Sin dato | — |
| Ganchos | Novedad de modelo el mismo día del lanzamiento (Sonnet 5.5 publicado 28-sep, el día que salió) | [P] caption + fecha |
| Cuerpo / "cómo" | Carrusel: **cada lámina = un nombre propio** (el repo) + un mock de terminal que muestra el mecanismo; marca grande (GitHub) en la portada. Nada de categorías abstractas como titular | [P] nuestra nota de estructura del 17-sep; la ficha del carrusel no se guardó |
| Cierre / CTA | Sin dato del CTA de reels | — |
| Destino | Bio → tododeia.com: «la bóveda» con **287 guías gratis, sin registro** (Claude, Claude Code, Codex, MCP, skills, automatización), 2 ebooks pagos (USD 29 c/u), eventos LIVE (luma), llamadas 1:1, repos open source, colaboraciones | [O] web leída 29-sep y 28-sep |
| Mecanismo de embudo | Cada short conduce a una guía pública, específica y actualizable; primero la biblioteca gratis, después el producto | [I] lectura nuestra del 22-sep (`PLAN-CONTENIDO-23-27-SEP-2026.md`) sobre lo observado en la web |
| Edición | Sin dato | — |

### Erik Taveras (@eriktaveras)

| Rasgo | Qué hace | Evidencia |
|---|---|---|
| Formatos | Reel vertical + **guía escrita pública** por cada tema; comunidad con foro | [P] reels `Ddxz2P_uCp6` (27-sep), `DdpF111p5Iz` (23-sep); [O] guías en comunidad.eriktaveras.com |
| Duración | Sin dato de los reels | — |
| Ganchos | Sistema propio en uso + tema del día: subagentes (27-sep), n8n + Claude Code + Hermes (23-sep), MCP oficiales de Meta (21-sep) | [P] captions; [O] fechas en páginas primarias |
| Cuerpo (guía) | **Entrada → encargo/prompt completo → roles → salida definida → comprobación**; señala datos ausentes; cuenta su propio error (conteo mal hecho en la prueba de subagentes; fallos en la guía de edición) | [O] `erik-subagentes`, `erik-edicion` en el `.json` |
| Cómo muestra el "cómo" | Prompt íntegro publicado, tabla de papeles por herramienta, comandos, tabla capacidades/requisitos/límites + prompts de inicio | [O] guías `analisis-con-subagentes-claude-code`, `n8n-claude-code-hermes-conectados`, `tres-mcp-oficiales-de-meta` |
| Cierre / CTA | «Aplicalo y compartí tu resultado en el foro»; en MCP: «elegí una tarea y empezá leyendo» | [O] guías |
| Destino | Guía leíble **sin cuenta**; el ZIP de la skill de edición sí pide cuenta. link.eriktaveras.com/erik → recursos, formación, newsletter, llamada | [O] |
| Edición | De sus reels, sin dato. Su guía de edición dice qué persigue: voz e interfaz legibles, transcripción sincronizada, gráfico solo cuando agrega contraste o consecuencia | [O] guía; [I] que sus reels se vean así |

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
| Ingeniero Binario, reel 22-sep (64,97 s) | Terminal + cara; cierre con DM ofrecido | [P] `AUDITORIA-GUIONES-COMUNIDAD-2026-09-28.md` |
| Ingeniero Binario, historia-quiz | Código de 3 líneas con trampa → pregunta en barra de acento → **sticker nativo de encuesta** | [O] `vi/2026-09-02-ingenierobinario-historia-quiz.md` |
| Revolutia (TikTok, 42 s) | Contraste «por defecto vs setup correcto» → promesa numerada («tres skills, tres conexiones») → nombres propios → giro («la diferencia no es el modelo, es lo que le instalás») → link en perfil a comunidad. Web arriba / cara abajo. Guardados > likes (6.874 vs 6.220 el 1-sep) | [O] guion completo en caption; montaje [I] en `vi/2026-09-01-revolutia-estilo-tiktok.md` |

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

### Cierre: keyword gateada o guía abierta

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
| **C2 Lista con nombres propios** | Marca reconocible en grande (GitHub) | Una lámina por elemento, con **su nombre** + un mock que muestra el mecanismo; nada de categorías abstractas | Sin dato del cierre de Enrique | [P] Enrique 17-sep; adaptación propia ya hecha: `docs/cola/PARA-PUBLICAR-APPLE-REPOS.md` |
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
