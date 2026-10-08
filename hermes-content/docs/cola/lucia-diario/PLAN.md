# Plan de Lucía — v4 (5-oct-2026, corregido el 8-oct): después de mirar la competencia

> **Este archivo manda** sobre qué publica Lucía y por qué. La madre lo llama el «plan v2». Reemplaza la v3 del 2-oct,
> que queda en el historial de git.
> - **Evidencia:** `research/competencia/LUCIA_COMPETENCIA_20261005.md`, mirada el 5-oct con 0 créditos.
> - **Personaje y límites:** `references/modelos/lucia/LUCIA.md` §0.
> - **Método (Higgsfield, edición, publicación):** skill `lucia`.
> - **Guiones y borradores:** `references/modelos/lucia/GUIONES-LUCIA-KIT.md` y `v4/kit/estado-montaje.json`.
> - **8-oct:** se corrigió con una verificación adversarial de 3 lentes (cumplimiento, evidencia, código).
> - **Regla de entrada:** no se genera ni se publica nada sin el OK de Sergio Urcullo al paquete de la semana y al costo
>   de cada lote.

## 0. En una línea

Lucía es una **prueba barata**, no la fuente de los 5 clientes. Publica **3 piezas por semana durante 14 días** y se
mide por **conversaciones de dueños de clínica que llegan por su puerta**, con una parada dura el día 14. Si Sergio
Urcullo pide un presentador IA para la pauta, Lucía puede ser esa persona; eso lo arma Ventas y pauta (§6).

## 1. Lo que dijo la competencia (y qué cambia)

| Visto el 5-oct | Qué cambia en Lucía |
|---|---|
| Los anuncios de video que más duran tienen una persona desde el segundo 0 y un solo CTA. La pantalla real a la mitad aparece en los testimonios de Doctocliq (51 y 48 días) y en anuncios nuevos. CitaPro, el único con persona que llega a BO, usa una placa gráfica | La pieza de venta lleva persona desde el segundo 0 y un CTA. La pantalla real es **regla propia** («producto visible o no sale»), no algo copiado de la competencia |
| Doctocliq pauta una «doctora» hecha con IA, con ambo, y Medizona un médico IA con bata. Ninguno lo declara en la pieza (la etiqueta de Meta en el feed no se pudo ver) | Rótulo «Lucía Antelo · personaje IA de Onia» desde el segundo 0, siempre. En un anuncio, **sin ambo** (§6) |
| No se encontró ninguna presentadora IA **que se declare IA** vendiendo software de clínicas (Biblioteca por metadato y perfiles de TikTok; 5 candidatos sin mirar). Lety y Calu podrían usar personas IA sin declararlas | El espacio está libre, pero no hay resultados que copiar: por eso, prueba con parada |
| El orgánico de la categoría rinde de 186 a 1.648 vistas (mediana); solo 2 de 7 marcas publican seguido | Se espera poco alcance. Se mide por conversaciones, no por vistas. Ganan la constancia y lo local |
| Lo que más rindió le habla al dueño en segunda persona («Tú, cuando…», «Dentista,…»): uno es un meme sin producto; el otro recorre la página de precios real | Gancho al dueño, nunca «hola, soy Lucía» en un reel |
| Doctocliq ya usa el paciente que no vuelve | Lo libre es Santa Cruz, la recepción a las 8 y la IA declarada |

## 2. Para qué existe la cuenta y cómo se mide

- **Métrica única: conversaciones de dueños o de la recepción de una clínica que llegan por la puerta de Lucía.**
  Seguidores y likes no cuentan.
  - La métrica de la v3 (`src=lucia-*` en `onia.com.bo/llamada`) no se puede medir: esa ruta da 404, Onia ya no tiene
    Cal.com, y Cal.com tampoco guarda `src` (guarda los `utm_*`).
- **La puerta la elige Sergio Urcullo (D7).** Hay dos que funcionan, medidas el 5-oct:
  - **(a) El WhatsApp de Onia** con el texto ya escrito:
    `https://wa.me/59175414930?text=Hola%2C%20vengo%20de%20Luc%C3%ADa.%20Quiero%20ver%20Onia%20en%20mi%20cl%C3%ADnica.`
    - Cuenta conversaciones, pero no dice qué pieza las trajo.
    - Hoy el bot le contesta la bienvenida genérica y no guarda el origen (medido con `simulate.mjs`): se cuenta a mano
      en Chatwoot por el texto.
    - Para que el bot tenga una respuesta propia, el carril chatbot tiene que hacerle lugar (las campañas están en 10
      de 10) y Sergio Urcullo tiene que firmar esa respuesta.
  - **(b) `sergiourcullo.vercel.app/llamada?utm_campaign=lucia-<pieza>`** → `cal.com/sergiourcullo/20min`, que guarda los
    `utm_*` y mide por pieza. Pero es la puerta de Marca personal (la auditoría gratis, con cupo de 3 por semana) y
    muestra su dominio personal.
  - El pie de Instagram no tiene links tocables: todo pasa por la bio.
- **El perfil tiene que declarar la IA en cuatro lugares** (hoy ninguno se miró):
  1. el nombre, «Lucía Antelo · IA de Onia»: falta ponerlo;
  2. la bio, en su primera línea: «Personaje IA creado por @oniahq». Falta ponerla;
  3. la etiqueta de perfil IA de Instagram: según el repo se activó el 31-ago y nadie la miró;
  4. **la etiqueta «Información de IA» en cada pieza**, por API. `ig-reel.mjs` e `ig-carrusel.mjs` ya la ponen con
     `--cuenta lucia`, pero solo en el repo: en el VPS siguen los viejos y nunca se probó en vivo (§7).

## 3. Reglas de toda pieza

- **Rubro: solo dental** en lo que vende. Es la decisión más nueva del negocio: «solo dental hasta tener la factura del
  SIAT» (plan de la 1.0 del 3-oct y madre del 5-oct). Las piezas de personaje no muestran rubro. Los 5 rubros de la v3
  quedan en pausa hasta que Sergio Urcullo diga otra cosa.
- **Lucía muestra; no ocupa el puesto.** El ambo es vestuario. Prohibido, en el guion, el pie y las tarjetas:
  - «hoy soy odontóloga», «soy doctora», «como odontóloga», «mis pacientes», «mi consultorio», «mi estudio»,
    «me pasó con un paciente»;
  - y cualquier frase que la ponga en el puesto o que dé a entender que estuvo en una clínica real que usa Onia
    (hay 0 clientes).
  Antes de renderizar se pasa `grep` contra `LUCIA.md` §0 y `editor-videos` § «Reels de Lucía».
- **Nombre con apellido:** rótulo «Lucía Antelo · personaje IA de Onia». Los pies arrancan con «Lucía Antelo es un
  personaje hecho con IA por @oniahq» (canon, dato 2: hay otras «Lucía» IA que esconden la IA).
- **Sin resultados prometidos:** nada de «agenda llena», «cero ausencias» ni porcentajes. El chiste va con «No: soy IA»,
  nunca con «no sé».
- **Solo lo que dice el catálogo** (`ONIA_CATALOGO_DE_VENTA.md` §2 y §8): el link de reserva, el recordatorio por correo
  24 h y 2 h antes, y las 6 frases de §8. **Antes de publicar una frase se abre su pantalla con sesión y se MIRA.**
  - El tratamiento a medias **sigue prohibido** en la venta aunque esté en producción: el catálogo no lo pasó a «se
    puede decir».
  - Tampoco: «la IA agenda sola», recordatorio por WhatsApp, factura o SIAT, titular con «IA».
- **Pantalla REAL de Onia** en toda pieza que vende, con el crédito «pantalla real de Onia».
  - Nunca una interfaz re-dibujada (`saas_motion` de Higgsfield lo hace).
  - En las capturas de la demo, **ninguna fila de «tratamiento a medias» ni la pestaña «A medias» en cuadro**: la demo
    trae 2 sembradas.
- **Trato: de usted** (D8). Así quedó el kit de Codex del 6-oct, y así hablan el bot y Ventas. L01 y L02 están en vos:
  si Sergio Urcullo confirma usted, se corrigen a 0 cr antes de publicarlas.
- **Sin voz** durante la prueba (D4). Además, **no se publica ninguna voz de ElevenLabs** hasta confirmar que la cuenta
  tiene licencia comercial: por eso L08 queda afuera.
- **Un solo CTA:** «Escríbale a Onia: enlace en la bio». Lucía no es parte del «nosotros» de Onia.

## 4. Formatos

| Formato | Molde | Créditos | Estado |
|---|---|---:|---|
| **A · Reel de venta, 20-35 s:** Lucía en cuadro con rótulo (0-3 s) → pantalla real de Onia → CTA | anuncios de Doctocliq, CitaPro, Calendico y Dentalink (mirados en 3 cuadros cada uno) | 0-3,75 | K1, K2 y K4 en borrador de 360p (Codex, 6-oct); faltan las pantallas |
| **B · Reel de personaje, 6-10 s:** la IA como gancho, sin vender | Aria Cruz, @ugc.studio.ia (intakes del 3/4-oct) | 0 | L02 editado; el chiste se edita después del OK |
| **C · Carrusel paso a paso** con capturas reales | el carrusel de Doctocliq (solo se leyó el pie) | 0 | falta la captura |
| **D · Historias:** recortes del mismo lote + el link | — | 0 | se puede ya |

- **Recetas y costos medidos el 5-oct** (Kling std con sonido apagado a 1,25 cr/s, upscale ~0,1 cr y el resto): skill
  `lucia`.
- **No se usan:**
  - Seedance 2.5: es caro, 42 cr por 6 s;
  - Marketing Studio: cuesta de 42 a 105 e inventa guion y voz;
  - `saas_motion`: re-dibuja la interfaz.

## 5. Las 2 semanas de prueba (3 piezas por semana, 0 créditos nuevos)

Todo sale de material ya pagado. Sergio Urcullo aprueba **una vez por semana**, sobre el paquete entero.

| Día | Pieza | Formato | Estado |
|---|---|---|---|
| 1 | **L01** «Hola, soy Lucía. No existo.» (fijado) | C | ✅ aprobado el 1-oct (en vos: ver D8) |
| 3 | **L02** «Este video no fue grabado» | B | editado; falta el OK (en vos: ver D8) |
| 5 | **Chiste de 10 s:** «¿Lucía Antelo es real?» → «No: soy IA.» → «Las pantallas que le muestro son reales.» (clip del café, ya pagado). El pie no vende ni anuncia nada que no esté grabado | B | se edita a 0 cr después del OK |
| 8 | **«El paciente reserva solo»:** Lucía 3 s (clip del coworking `v4/kit/k3-clip-coworking-07b938b2.mp4`, recuperado el 8-oct a 0 cr, sin ambo) → la página pública de reserva de la demo, sin reservar → CTA | A | falta grabar la pantalla |
| 10 | **K4 corta** «Las reglas de la recepción». En la toma 6, **solo Pendientes**: «Revisa su agenda y sus cobros» → «Nada sale sin su aprobación». Sin la frase del correo, con recorte focal y sin filas «A medias». **Si la demo no muestra Pendientes, K4 pasa a la semana 3** | A | borrador de 360p ✅ (cutlist corregido el 8-oct); falta la captura P2 |
| 12 | **Carrusel** «Cómo reserva un paciente solo, paso a paso». Termina en el formulario **sin enviar**, salvo que Sergio Urcullo dé el OK para crear 1 cita de prueba en la demo | C | falta la captura |

- **Las pantallas salen de la cuenta demo «Clínica Demo Onia».** Desde la nube no se pueden grabar (el Chromium no pasa
  el proxy y no hay sesión), así que las graba la madre o Plataforma.
  - Antes, Sergio Urcullo tiene que confirmar el correo de la demo y darle `module.agents` (plan de la 1.0, punto 9).
  - Lo que falta, pieza por pieza, está en `v4/kit/estado-montaje.json` → `captures` (P1, P2, CORREO, EXTRACCION,
    CONFIGURACION).
- **Esperan, porque piden escribir en producción con OK:**
  - **K1:** necesita una plantilla IA aprobada (P1);
  - **K2:** necesita un paciente con correo (CORREO);
  - **K3:** necesita la carga desde la web (EXTRACCION). Su clip ya está en el kit.
  Entran en la semana 3, si la prueba sigue.
- **TikTok:** las mismas piezas, cuando exista la cuenta (§7). No frena Instagram.

**Qué se mide a las 48 h de cada pieza:**
- conversaciones por la puerta;
- preguntas de dueños en comentarios o DM;
- guardados y envíos;
- que la cuenta siga «apta para recomendaciones».

**Día 14:**
- **sigue** con ≥ 1 conversación de un dueño o de la recepción de una clínica;
- **se extiende 2 semanas, una sola vez,** con 0 conversaciones pero ≥ 3 preguntas reales de dueños;
- **se pausa** si no llega a eso.
- **Se para cualquier día** si la cuenta queda «no recomendable» o si domina el comentario «esto reemplaza gente».

## 6. Lucía en la pauta (solo si Sergio Urcullo pide un presentador IA)

- **El hueco:** de los 18 anuncios capturados el 1-oct, los 7 que pasaron las 6 semanas tienen una persona
  (`ONIA_ADQUISICION_Y_PAUTA.md` §2.5), y la pauta de Onia no tiene ninguna. El anuncio que más dura en total es un
  catálogo de Dentalink sin persona (320 días).
- **Qué ofrece este carril:**
  - Lucía **sin ambo**, porque al lado de la «doctora IA» de Doctocliq se leería como una de ellas;
  - el clip del coworking o el del café, ya pagados: 0 cr, como pide el plan de la 1.0 §4;
  - rótulo desde el segundo 0 y declaración de IA de Meta en el anuncio.
- **No es una recomendación de este carril.** La pauta es de Ventas y pauta, y ADQ y CLAUDE.md admiten un presentador
  IA solo si Sergio Urcullo lo pide. Además, con Bs 750 un A/B de dos creativos no alcanza para saber si la IA suma o
  resta. Si Sergio Urcullo lo pide, la madre se lo pasa a Ventas.

## 7. Cómo se publica

Circuito completo en la skill `lucia` § Publicación.
- **Instagram:**
  - con la app propia, `ig-reel.mjs` / `ig-carrusel.mjs --cuenta lucia`, que pone la etiqueta IA sola;
  - corre en el VPS: esta nube no tiene ssh, así que lo corre la madre o una sesión con acceso.
- **Antes de la primera pieza:**
  1. el token de Lucía. Estaba en Postiz el 4-sep, y ese día las tres cuentas vencían entre el 13 y el 18-oct. **No se
     midió desde entonces.** Hay que pasarlo a `/root/.config/onia-publicar/ig-lucia.env` antes del 13-oct;
  2. los dos publicadores nuevos se copian **juntos** a `/root/bin` y se corre `--selftest` en los dos. Copiar uno solo
     rompe los carruseles agendados de `@sergiourcullo`, así que se le avisa a Marca personal;
  3. en el ensayo, el reel tiene que decir FINISHED y el carrusel «listo en Instagram». «etiqueta IA» solo confirma
     que se mandó el parámetro: que Meta lo aceptó se ve después de publicar (`is_ai_generated` en
     `publicado.jsonl`) y mirando la pieza.
- **TikTok:** por Buffer, con una cuenta gratis aparte y `isAiGenerated`. Antes hay que crear el TikTok de Lucía.

## 8. Decisiones de Sergio Urcullo

**Se aplica la recomendación salvo que diga otra cosa:** D2 (Reel primero), D3 (Lucía todavía no es la cara del
WhatsApp), D4 (sin voz) y solo dental. El canon de 10 datos (D5) entra con su OK explícito al paquete de la semana 1.

**Lo que necesita su respuesta:**

| # | Decisión | Recomendación |
|---|---|---|
| D6 | «Comentá DEMO» en una pieza | **No por ahora.** Con 186-1.648 vistas, el CTA directo rinde más, y responder a mano gasta sus horas |
| D7 | La puerta: (a) WhatsApp de Onia o (b) su cal.com con `utm` | **(a):** Lucía vende Onia, y el canal de Onia es su WhatsApp. (b) mide mejor por pieza, pero mezcla su auditoría personal con Onia |
| D8 | Trato de usted en todo | **Sí**, como el kit, el bot y Ventas. L01 y L02 se corrigen a 0 cr |
| D10 | Créditos que vencen: hoy hay 541,26 y lo que sobre se borra en la próxima renovación (sin fecha confirmada; el 1-oct se borraron 387,57). Con este plan se perderían unos 520 | Si quiere usar una parte: prueba de Kling pro contra std + upscale (~17 cr), que define la calidad de todos los clips. No es gasto nuevo en plata |

**Lo que lo destraba, en orden:**
1. OK al paquete de la semana 1 (`paquete-s1/PAQUETE.md`): L01, L02 y la idea del chiste, y el usted (D8).
2. Poner el nombre y la bio desde el celular de Lucía (texto en el paquete).
3. El token de Instagram antes del 13-oct, por una de dos vías:
   - le da el OK a la madre para encender **solo** el contenedor `postiz-postgres` del VPS y leer el token. Es encender
     un contenedor de producción: nunca Postiz entero, Temporal ni el orchestrator (el 4-sep así salieron 5 posts sin
     OK);
   - o genera el token en developers.facebook.com → OnIA Social API, con el login de Lucía (unos 7 pasos).
4. La madre copia los dos publicadores juntos al VPS y mira la etiqueta de perfil IA.
5. Confirmar el correo de la cuenta demo y darle `module.agents`. Plataforma o la madre graban la página de reserva y
   Pendientes.
6. Cuando quiera TikTok: crear la cuenta de Lucía y autorizarla en Buffer.
