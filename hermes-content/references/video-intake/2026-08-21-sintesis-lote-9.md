# Análisis transversal — lote de 9 items (2026-08-21)

---

## 1. Lo que hay que aprender a hacer — por técnica

### T1. Consistencia de personaje: hay DOS escuelas, y son productos distintos
Cuatro items usan IA generativa y se parten en dos mitades opuestas.

- **Con ancla** (DcPTX07yAOA, DcQvRrGM-wm): `omni_reference` / `soul_id` + imagen de referencia. Misma cara en N escenas, N localizaciones, día y noche. La consistencia la sostiene la **referencia, no el texto ni el seed**. Caro, frágil, **construye activo**.
- **Sin ancla** (DcI9w9GEnZH, DcLiEpCGJne): 7 a 9 caras DISTINTAS y nadie se da cuenta, porque la unidad la sostiene otra cosa — en bluuu.ai el **molde de encuadre repetido** (7 mecanismos), en luxry.ai el **sistema gráfico** (corchetes de esquina, tipografía condensada, punteado de paginación). Barato, no pelea consistencia, **no construye activo**.

Lo que se aprende: elegir cuál se hace y **no mezclarlos en un mismo carrusel**. luxry.ai vende "VISUAL DIRECTION SYSTEM" y lo que entrega es una plantilla gráfica sobre imágenes sueltas — un comprador podría creer que compra control de avatar.

### T2. Los 7 mecanismos del molde "caught living" (DcI9w9GEnZH)
Esto es lo más portable del lote, porque no es estética, es checklist:
1. Selfie o cuasi-selfie: brazo/manga entra en cuadro (5 de 9 láminas). El punto de vista de teléfono **es** el estilo.
2. Cámara arriba del sujeto, picado, horizonte torcido. Sustituye a toda la dirección de arte.
3. **Objeto banal en la mano** — taza, libro, brocheta, correa, tarjeta-llave. El objeto es el argumento de la foto.
4. Nadie posa a cámara: mira fuera de cuadro, entrecierra por el sol, tiene la boca ocupada.
5. Luz **práctica y nombrable** (sol bajo, flash de teléfono, tungsteno, fuego), nunca "cinematográfica".
6. Textura de piel a la vista: brillo en frente, rojez, pelos sueltos.
7. **Fondo como LISTA DE OBJETOS**, no como ambiente. Es el bloque que hace el trabajo pesado — "paneles de terciopelo granate + araña de discos + banquetas beige" produce el comedor; "ambiente lujoso" no produce nada.

### T3. La palanca de realismo: pedir suciedad, prohibir lo pulido
Presente en los 9 prompts reconstruidos, en dos bloques separados:
- **Defectos a propósito**: ruido de sensor en sombras, artefactos de compresión, autofocus que caza una vez, altas luces quemadas, sin color grading.
- **Negativos del formato**: el teléfono **nunca** visible — ni en cuadro, ni en el reflejo de los lentes, ni en la vidriera, ni en el espejo. Sin trípode, sin aro de luz, sin bokeh cinematográfico.

Y el tell inverso, que es el hallazgo de DcLiEpCGJne: la generación se delata en el **texto ambiental corrupto** ("SEALHRUN EROSONEN VERRE" en el friso, "WLGVE HLOIS KEALGUE" grabado en la copa). Por eso el prompt reconstruido agrega tres negativos específicos: `legible signage`, `readable text on glassware`, `symmetrical framed photographs`. Prohibir de entrada donde se rompe.

### T4. Pinterest como director de fotografía (DcQvRrGM-wm — el único aporte realmente nuevo)
**No inventes el encuadre. Buscalo.** Términos literales: `beach selfie`, `mirror selfie`, `get ready with me`, `instagram story aesthetic`. Qué extraer de cada pin: dónde está el sol, cómo cae la sombra en la cara, a qué altura está el móvil, qué se ve de fondo, qué ropa lleva. Traducirlo a prompt literalmente. Regla suya, verbatim: *"Cuanto más aburrida y cotidiana sea la referencia, mejor funciona."*

Nuestra skill `sacar-prompt` ya lista "contexto banal verificable" como eje de realismo pero **nunca dice de dónde sacarlo**. Esto lo resuelve, es gratis y es repetible. Es la edición que corresponde hacer a la SKILL.md.

### T5. Diálogo literal entre comillas, con timestamp
Verificado en el corpus (3 items): el diálogo entre comillas **sale palabra por palabra** del generador. El guion se escribe EN el prompt, no se corrige después. Estructura de beat: `[0:00-0:04] acción física concreta + "diálogo literal"`.

### T6. Todo el montaje vive FUERA del generador — y es gratis
En los 9 items, sin excepción, la capa que hace la diferencia no sale de ninguna IA:
- Subtítulos karaoke (2-4 palabras, caja negra o contorno, altura Y fija).
- Láminas editoriales (8 en DcJe7nLpuOA, 4 en DcRJIrdDs7m, 8 en DcLiEpCGJne).
- Overlays de producto, flechas rojas, numeración en pantalla, follow-card con cursor.
- Cortes y split-screen.

Todo eso es HTML → HyperFrames, ya instalado y probado. **Cero créditos.**

### T7. Tres mecanismos de composición específicos y robables
- **Fondo blureado con auto-color-match** (DcQiDM_o06I): el mismo `<img>` hero duplicado con `transform: scale(2.5) + filter: blur(40px)` detrás de la columna. Nunca hay barras negras Y la paleta hace match sola con cada pieza, sin decidir color a mano. En ffmpeg: `scale + boxblur + overlay`.
- **Split-screen fijo en vez de cortes** (DcRJIrdDs7m): 55% cabeza parlante arriba / 45% panel abajo. La cabeza **nunca se corta** en 23 s — solo se monta la mitad de abajo. Costo de edición casi cero, y es un layout HTML, no un corte de video.
- **Grilla repetida portada = cierre** (DcI9w9GEnZH, DcLiEpCGJne): la misma grilla 3x3 abre y cierra; en el cierre le montan el CTA y **dibujan los cuatro iconos del algoritmo** (corazón, comentario, avión, guardar) sobre la fila inferior.

### T8. El orden de los beats — cuatro moldes de guion distintos, todos con la misma lección
- **Retrasar el nombre**: DcRJIrdDs7m dice "fx" recién en el segundo 15 de 23. El gancho es el beneficio con fecha de vencimiento; el nombre es la recompensa por quedarse.
- **Desarmar la objeción DESPUÉS de la pedida**: DcLqjb6slaV pide el comentario en [35-41] y recién en [44] suelta "Es gratis, por cierto". Antes mata el valor percibido; después elimina la fricción.
- **Humildad y recién después el número**: DZI1Fg8J_RE dice "aún no llegué a los 50 millones" ANTES de mostrar su propia cifra. Ese orden es lo que hace tragable el número.
- **Incorporar la refutación en el gancho**: DcJe7nLpuOA abre con "vendiendo códigos QR **que son gratis en mil sitios**" — mata la objeción antes de que aparezca.
- **Credibilidad de SERIE, no de currículum**: el rótulo fijo "DIA 51 /100" en las 8 láminas. Contador público.
- **Prueba antes de la primera palabra**: DZI1Fg8J_RE pone el plano general del galpón con producto en primer plano en el segundo 0.
- **Mudo por diseño**: DcQiDM_o06I es 12 s sin voz, el gancho vive en texto quemado. Funciona en autoplay silenciado, que es cómo se consume el 100% del feed.

### T9. Reconstrucción SaaS: leer la máquina de estados, no la pantalla
- **La unidad visible es el LOTE, no la tool call** (DcRJIrdDs7m): `2 tool calls · 1 read · 1 list` colapsado con árbol desplegable. Lo contrario de un log línea por línea. Línea de estado al pie con **dos datos** (`auto · glm-5.2`), no un panel.
- **El precio va en la fila del modelo**, dentro del selector (`google/gemini-3.7-flash  50% off`).
- **El campo mutable ES el producto** (DcJe7nLpuOA): el QR gratis codifica el destino final y muere; el de pago codifica un enlace propio, así que el destino es un campo editable. El diagrama es la propuesta de valor — **no hay una sola captura de app en todo el reel** y no hace falta.
- **Verificación interna de una captura** (DZI1Fg8J_RE): 10.577 − 10.326 = 251, y 251 aparece como columna "Pedidos Cancelados". Ticket medio derivado R$ 94,97, cancelación 2,37%. Eso dice más que el titular: volumen alto con ticket bajo, el margen vive en la logística.

### T10. Contrastar Whisper contra la imagen — obligatorio
6 de 9 items tenían términos load-bearing degradados: `sea dance 2.5` → **Seedance 2.5** · `Cloud Code` → **Claude Code** · `equipo de Nexus` → **Vercel** · `control.net.qr.monster` → **ControlNet QR Code Monster** · `slag` → **Slack** · `tu día` → **tu IA** · `hace 1300 suscripciones` → la lámina dice **1.324**. Ningún nombre propio se cita desde la transcripción sin confirmarlo en un fotograma.

---

## 2. Los prompts

### 2A. RECUPERADOS — literales de pantalla (2 de 9)

**DcJe7nLpuOA** — prompt de construcción de app, transcrito ampliando el fotograma 07 a 3x. Título de ventana: "tu ayudante de IA".
> "Hazme un generador de códigos QR donde cada código apunte a un enlace corto mío, que yo pueda cambiar de destino después de imprimirlo, y que cuente los escaneos."

**DcQvRrGM-wm** — el más rico del lote. Cuatro piezas literales:
- Prompt de imagen tecleado en la UI: *"una chica en la playa, foto de móvil, luz natural, estilo UGC"*.
- **Esqueleto de 6 bloques en orden fijo**: SUJETO / VESTUARIO / LOCALIZACIÓN / CÁMARA / LUZ Y TEXTURA / NEGATIVOS. Razón declarada: *"el modelo lee de arriba abajo y da más peso a lo primero"*.
- Lámina Pinterest completa (ver T4).
- **10 tokens de "modo móvil"**: `iPhone front camera` · `wide angle lens` · `handheld, slight tremor` · `arm's length selfie` · `focus hunting` · `blown highlights` · `crushed shadows` · `sensor noise` · `high dynamic range` · `no stabilisation`.

Los 6 bloques de ellos son un **subconjunto de nuestros 8**. No hay que cambiar de método, solo agregarle la fuente de referencias.

### 2B. Texto de pantalla transcrito que NO es prompt
DcRJIrdDs7m (UI de fx, selector de modelos, benchmark de Z.ai), DcLiEpCGJne (rótulos de marca), DcJe7nLpuOA (10 láminas), DcQiDM_o06I (copy de emails con 4 erratas), DZI1Fg8J_RE (panel de gestión). Útil como referencia de diseño y copy; no ejecutable.

### 2C. RECONSTRUIDOS (9 de 9) — con una distinción crítica
**5 de 9 reels no tienen IA generativa: son metraje real.** DcJe7nLpuOA, DZI1Fg8J_RE, DcLqjb6slaV, DcRJIrdDs7m y DcQiDM_o06I están filmados con celular, con personas reales, con grabaciones de pantalla reales. En esos casos el `prompt_reconstruido` **no reconstruye nada del original** — es "cómo lo haríamos nosotros si no tenemos a la persona a cámara". Si alguien los cita como ejemplo de video IA, está mal leído.

En los 4 restantes (DcPTX07yAOA, DcQvRrGM-wm, DcI9w9GEnZH, DcLiEpCGJne) sí hay generación y el prompt está gateado detrás de un comentario. La reconstrucción se hizo mirando las láminas.

**Estructura común de los 9 reconstruidos**: cabecera técnica global → defectos a propósito → negativos del formato → anclas de consistencia (inyectadas en el punto donde importan, repetidas en cada beat) → realismo de piel → fondo como lista de objetos → bloque técnico → beats con timestamp y diálogo literal → negative prompt.

**Negative base que se repite en los 9**: `CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy, extra fingers, HDR, studio lighting, over-sharpening, blurry subject, text, watermark` + negativos específicos del sujeto.

---

## 3. Lo que sirve, por frente

| Frente | Qué se lleva | Qué falta para hoy |
|---|---|---|
| **Carril H / Lucía** — molde UGC con ancla | Receta completa de DcQvRrGM-wm + DcPTX07yAOA: imagen ancla → `seedance_2_5` en `omni_reference`, `generate_audio: true`, clips por beat | Solo el **OK de gasto de Sergio**, caso por caso. Saldo 2.263,03 créditos, plan ultra |
| **Carril H / catálogo de escenas** sin personaje | Los 7 mecanismos de bluuu.ai + el sistema gráfico de luxry.ai, sobre `soul_2` (soul_id es opcional) | **Decisión, no recurso**: traducir los 9 escenarios (azotea de París, night market, chalet de ski) a 9 momentos verificables de Bolivia |
| **Skill `sacar-prompt`** | El paso Pinterest (T4), que hoy no existe en la skill | Nada. Es una edición de SKILL.md, gratis |
| **onia-platform / core — módulo QR + shortlinks** | Entidades y máquina de estados completas. Verificado por grep: `contract.json` y todo `onia-core/` tienen **cero** coincidencias de qr/shortlink/redirect → es entidad nueva, no capability apagada | **Decisión de Sergio**: ¿módulo con suscripción propia o add-on sobre Cuidado Web? Y un dominio corto (DNS ya en Cloudflare, ojo el comodín `*` proxiado) |
| **onia-platform / rubro comercio** | Mapa de módulos regalado: Estoque · SAC · Análises · Financeiro + filtro canal + filtro tienda. 8 de 11 entidades ya están en el core; faltan 3 (box, sesión de live, producto pineado) | **El dato que decide todo y NO se verificó**: si TikTok Shop opera en Bolivia. Y un cliente real de comercio con inventario |
| **web-factory / portafolio** | El molde mudo de 12 s: cada web entregada se vuelve prueba pública. Es lo que destraba subir de 790/1.500 a la línea premium | **Decidir qué webs se pueden publicar y con qué permiso del cliente** (Nuvia, DentalGest son candidatas) |
| **Marketing / comentario→DM** | El molde de DcLqjb6slaV entero + la mecánica de los 4 iconos dibujados | **Un lead magnet** del calibre de "tutorial de 40 min". Hoy el DM saldría al vacío. Decisión de Sergio sobre qué regalamos |
| **Infra / Onia Box** | `fx` — 6,39 MiB, Apache-2.0, cualquier modelo por gateway. Un agente sin telemetría corriendo local ES el pitch de confidencialidad | Decidir **quién lo prueba y dónde** (worktree o VM, nunca sobre el guardián en prod; bajar el `setup.sh` y leerlo antes de ejecutar) |
| **editor-videos / HyperFrames** | T6 + T7 completos: karaoke, láminas, split-screen, fondo blureado | Nada. Instalado, probado, gratis |

---

## 4. Lo que se descarta y por qué

**Cifras.** Las 4 cifras sin fuente del lote no se repiten nunca como propias:
- `$14.734/mes con 1.324 suscripciones "verificado con Stripe"` — **está dibujada**, no hay captura, ni nombre de negocio, ni URL. Si la prueba está ilustrada, no es prueba. Además el titular redondea a "$14.000" hacia arriba.
- `"más de 50 millones de dólares"` de "una empresa norteamericana que vi en un video" — cita de cita, sin nombre ni período.
- `"faturei quase um milhão"` — **no es facturación, es GMV**. La captura dice "Valor de Vendas Válidas": no descuenta comisión de TikTok Shop, devoluciones, flete, mercadería, ni los 4 boxes + vendedores + galpón. Con ticket de R$ 94,97 ese GMV convive perfectamente con margen negativo.
- `"10.000 EUR"` sin desglose, sin período, y el audio dice "pavos" mientras el rótulo dice EUR.

**Tácticas de distribución.** Entrar a r/smallbusiness a buscar quejas y ofrecer el producto gratis: mercado gringo **y** ese sub sanciona la autopromoción encubierta. La idea (buscar el dolor donde ya se queja) sirve; el canal y la forma no.

**Doctrina de posicionamiento.** `"nadie se da cuenta de que es IA"` es la tesis contraria a la nuestra. Se toma la receta técnica, se descarta el engaño. A favor: luxry.ai **declara** "IMAGINED ENTIRELY / NO CAMERA. NO SET." en portada y lo usa como argumento de venta — valida la postura ya decidida. bluuu.ai no rotula ninguna de sus 9 fotorrealistas: no replicable tal cual.

**Un error técnico concreto que NO se copia.** La lámina de 10 chips de DcQvRrGM-wm se contradice sola: título "LAS PALABRAS QUE ACTIVAN EL MODO MÓVIL", pie "y estas las quitas siempre", y los 10 en un solo grupo sin separador. `high dynamic range` es claramente negativo (nuestro negative base ya lista HDR). **Usar los 9 como positivos y HDR como negativo.**

**Herramientas que no tenemos.** El "modo arte" (ControlNet QR Code Monster) no sale de nuestra cuenta: Higgsfield genera imagen pero **no expone ControlNet**. Requeriría un endpoint SD externo (fal/Replicate) con gasto aprobado. Sin eso se vende el QR dinámico sin el adorno — que igual es el 100% del valor recurrente.

**Marcas de terceros.** rhode, Pompeii, Rizos Curls, todas usadas sin evidencia de autorización. En DcQiDM_o06I además hay 4 erratas en emails supuestamente de una marca de skincare de primer nivel (`a new philosphy`, `Rince throroghuly`, `aplly to face`, `BUY BARRIER BUTER`) — improbable que sean las piezas que la marca envió. Si replicamos el molde, va con producto propio.

**Dependencias frágiles.** `fx v0.0.4` marcado "experimental" por su propia home: no entra a ningún cron que corra solo. Y el reel **conflaciona dos lanzamientos de Vercel**: el GLM-5.2 gratis está scopeado a los "eve agents" vía Blackbox en AI Gateway, no a fx. Quien instale fx esperando modelo gratis puede terminar pagando por token.

**Gasto innecesario.** luxry.ai paga ManyChat (está en sus propios keywords SEO). Nosotros tenemos el circuito comentario→DM vivo en producción desde el 18-ago, sin ManyChat.

**Los 6 cebos de comentario.** No se comenta ninguno. En 5 de los 6 el método estaba igual en la imagen y se extrajo de ahí.

---

## 5. Lo transversal — con números

**Composición del lote.** 4 IA · 3 SAAS · 2 MARKETING. Veredictos: **5 SIRVE_YA, 4 MEJORA, 0 DESCARTE.**

**Nivel de fuente: 3 VERIFICADO · 1 PRIMERA_PARTE · 5 AFIRMADO.** O sea: **el 55% del lote descansa en la palabra del creador**, sin nada contrastable.

**5 de 9 reels no usan IA generativa.** Son metraje real filmado con celular. El lote es mucho menos "IA" de lo que parece de lejos.

**6 de 9 gatean el método detrás de un comentario.** De esos 6, en **5 el método estaba igualmente en pantalla** y se recuperó sin comentar. La única excepción es DcLqjb6slaV, donde no había nada que extraer: las tres pantallas de laptop son **ilegibles incluso ampliadas al 300%** (glare de sol + ángulo + compresión). Ahí la demo es un gesto, no una prueba.

**Solo 2 de 9 entregaron prompt literal en pantalla.** Los otros 7 exigieron reconstrucción.

**4 de 9 dan cifras sin fuente.** Los 3 items que no dan ninguna cifra (DcQvRrGM-wm, DcI9w9GEnZH, DcLiEpCGJne) son, no por casualidad, tres de los cinco SIRVE_YA.

**Whisper degradó términos load-bearing en 6 de 9.** Todos corregidos contra imagen. En DcQiDM_o06I la "transcripción" son 2 líneas de letra de rap: es la pista musical, no el creador — el reel es mudo.

**6 de 9 sin caption.** Hueco declarado, no tapado. En este carril el caption a veces trae el prompt entero (los 2 carruseles que sí lo tenían aportaron el motor declarado y el bloque SEO que delató el uso de ManyChat).

**Cobertura de imagen: 1 de 9 vio el video completo.** DcQvRrGM-wm (contact sheet a 1 fps de los 28 s + barrido denso a 8 fps del tramo de láminas + 8 recortes ampliados). El resto es muestreo, y en dos casos es **grueso y hay que decirlo**: DcQiDM_o06I leyó 4 cuadros de 12 s (1 cada 3 s — no vio transiciones ni sabe si hay cebo al cierre) y DcRJIrdDs7m leyó 5 cuadros de 23 s con el audio cortado en el segundo 21 (el cierre del reel no está). Un texto en pantalla puede vivir en un solo cuadro; en esos dos items puede haber láminas que nadie vio.

**Verificaciones contra la cuenta Higgsfield, hechas hoy 2026-08-21, todas gratis:** `seedance_2_5` existe (Bytedance, 4-30 s, 9:16, 1080p, `generate_audio` default true, modos t2v/omni_reference/video_edit/video_extension) · `soul_2` existe (3:4 y 9:16, `soul_id` **opcional**) · saldo **2.263,03 créditos, plan ultra** · `unlim.available: false` → **toda generación descuenta**. Verificación de repo: cero coincidencias de qr/shortlink/redirect en `contract.json` y en todo `onia-core/`.

**Gasto del lote: 0 créditos.** Todo el análisis (transcripción por Speaches, lectura de fotogramas, recortes, consultas de catálogo) fue gratis. La primera generación de video es la que necesita OK explícito.

**Una sola fecha de vencimiento en todo el lote: 27-ago-2026** (ventana del GLM-5.2 gratis). Faltan **6 días**. Cualquier cita de ese dato después de esa fecha está vencida.

**Tres huecos que quedan abiertos y no se rellenan con suposiciones:** (a) si TikTok Shop opera en Bolivia — decide un vertical entero y no se consultó; (b) si `fx` tiene telemetría — es lo único que convierte "no se queda con tus datos" de AFIRMADO en VERIFICADO y lo hace citable en el pitch de Onia Box; (c) si alguna escena de luxry.ai partió de una foto real editada en vez de generarse desde cero — la imagen no lo dice y ellos no lo aclaran.