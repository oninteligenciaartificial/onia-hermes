# Plan de Lucía — v4 (5-oct-2026): después de mirar la competencia

> **Este archivo manda** sobre qué publica Lucía y por qué. La madre lo llama el «plan v2». Reemplaza la v3 del 2-oct,
> que queda en el historial de git.
> - **Evidencia:** `research/competencia/LUCIA_COMPETENCIA_20261005.md`, mirada el 5-oct con 0 créditos.
> - **Personaje y límites:** `references/modelos/lucia/LUCIA.md` §0.
> - **Método (Higgsfield, edición, publicación):** skill `lucia`.
> - **Regla de entrada:** no se genera ni se publica nada sin el OK de Sergio Urcullo al paquete de la semana y al costo
>   de cada lote.

## 0. En una línea

Lucía es una **prueba barata**, no la fuente de los 5 clientes. Publica **3 piezas por semana durante 14 días** y se
mide por **mensajes de dueños de clínica que llegan con su código**, con una parada dura el día 14. Su mejor uso
posible es otro: **ser la persona del anuncio de Meta**, que es el hueco más grande de la pauta. Eso lo decide Sergio
Urcullo y lo arma Ventas y pauta.

## 1. Lo que dijo la competencia (y qué cambia)

| Visto el 5-oct | Qué cambia en Lucía |
|---|---|
| Los anuncios de video que más duran: persona desde el segundo 0, la pantalla real a la mitad y un solo CTA | La pieza de venta copia ese esqueleto (§4, formato A) |
| Doctocliq y Medizona pautan «doctoras» hechas con IA, con ambo y sin aviso | Rótulo «Lucía · personaje IA de Onia» desde el segundo 0, siempre. En un anuncio, **sin ambo** (§6) |
| No hay ninguna presentadora IA que venda software de clínicas en la región | El espacio está libre, pero no hay resultados que copiar: por eso, prueba con parada |
| El orgánico de la categoría rinde de 186 a 1.648 vistas (mediana); solo 2 de 7 marcas publican seguido | Se espera poco alcance. Se mide por mensajes, no por vistas. Ganan la constancia y lo local |
| Lo que más rindió le habla al dueño en segunda persona y muestra la pantalla real | Gancho al dueño, nunca «hola, soy Lucía» en un reel |
| Doctocliq ya usa el paciente que no vuelve | Lo libre es Santa Cruz, la recepción a las 8 y la IA declarada |

## 2. Para qué existe la cuenta y cómo se mide

- **Métrica única: conversaciones de WhatsApp que empiezan con «vengo de Lucía»**, de dueños o de la recepción de una
  clínica. Seguidores y likes no cuentan.
  - ⚠️ La métrica de la v3 (demos con `src=lucia-*` en `onia.com.bo/llamada`) **no se puede medir**: esa ruta da 404
    y Onia ya no tiene Cal.com.
- **Una sola puerta** (decisión D7), el WhatsApp de Onia con el texto ya escrito:
  `https://wa.me/59175414930?text=Hola%2C%20vengo%20de%20Luc%C3%ADa.%20Quiero%20ver%20Onia%20en%20mi%20cl%C3%ADnica.`
  - Va en la bio y en la respuesta a «Comentá DEMO».
  - El pie de Instagram no tiene links tocables: la pieza manda a la bio.
- **El perfil declara la IA en cuatro lugares:**
  1. el nombre, «Lucía Antelo · IA de Onia»;
  2. la bio, en su primera línea: «Personaje IA creado por @oniahq»;
  3. la etiqueta de perfil IA de Instagram;
  4. **la etiqueta «Información de IA» en cada pieza**, por API: `ig-reel.mjs` e `ig-carrusel.mjs` la ponen solas con
     `--cuenta lucia`.

## 3. Reglas de toda pieza (sin cambios de fondo)

- **Rubro: solo dental** en lo que vende. Es la decisión más nueva del negocio: «solo dental hasta tener la factura del
  SIAT» (plan de la 1.0 del 3-oct y madre del 5-oct). Las piezas de personaje no muestran rubro. Los 5 rubros de la v3
  quedan en pausa hasta que Sergio Urcullo diga otra cosa.
- **Lucía muestra; no ocupa el puesto.** El ambo es vestuario. Prohibido, en el guion, el pie y los subtítulos:
  - «hoy soy odontóloga», «soy doctora», «como odontóloga», «mis pacientes», «mi consultorio», «mi estudio»,
    «me pasó con un paciente»;
  - y cualquier frase que la ponga en el puesto.
  La lista completa vive en `editor-videos` § «Reels de Lucía» y se le pasa `grep` antes de renderizar.
- **Sin resultados prometidos:** nada de «agenda llena», «cero ausencias» ni porcentajes. El chiste va con «No: soy IA»,
  nunca con «no sé».
- **Solo lo que dice el catálogo** (`ONIA_CATALOGO_DE_VENTA.md` §2 y §8): el link de reserva, el recordatorio por correo
  24 h y 2 h antes, y las 6 frases de §8. **Antes de publicar una frase se abre su pantalla con sesión y se MIRA.**
  - El tratamiento a medias **sigue prohibido** en la venta aunque esté en producción: el catálogo no lo pasó a «se
    puede decir».
  - Tampoco: «la IA agenda sola», recordatorio por WhatsApp, factura o SIAT, titular con «IA».
- **Pantalla REAL de Onia** en toda pieza que vende, con el crédito «pantalla real de Onia». Nunca una interfaz
  re-dibujada por Higgsfield.
- **Tono:** voseo cruceño en el contenido, que es la voz del personaje (canon §10), y usted en los mensajes 1 a 1 con un
  dueño (DM, WhatsApp), igual que Ventas. Es la decisión D8; si Sergio Urcullo elige usted para todo, L01 y L02 se
  corrigen a 0 cr.
- **Sin voz** durante la prueba (D4). Además, **no se publica ninguna voz de ElevenLabs** hasta confirmar que la cuenta
  tiene licencia comercial: por eso L08 queda afuera.
- **Un solo CTA:** «Escribinos: link en la bio».

## 4. Formatos

| Formato | Molde mirado | Créditos | Estado |
|---|---|---:|---|
| **A · Reel de venta, 20-30 s:** Lucía en cuadro con rótulo (0-3 s) → pantalla real de Onia a la mitad (s 8-18) → CTA | anuncios de Doctocliq, CitaPro, Calendico y Dentalink | 0-3,75 | necesita pantallas reales |
| **B · Reel de personaje, 6-10 s:** la IA como gancho, sin vender | Aria Cruz, @ugc.studio.ia | 0 | se puede ya |
| **C · Carrusel paso a paso** con capturas reales | carrusel de Doctocliq | 0 | necesita capturas |
| **D · Historias:** recortes del mismo lote + el link | — | 0 | se puede ya |

- **Recetas y costos medidos el 5-oct** (Kling std con sonido apagado 1,25 cr/s, upscale ~0,1 cr y el resto): skill
  `lucia`.
- Marketing Studio y Seedance 2.5 no se usan: son caros, inventan guion y re-dibujan la interfaz.

## 5. Las 2 semanas de prueba (3 piezas por semana, 0 créditos nuevos)

Todo sale de material ya pagado. Sergio Urcullo aprueba **una vez por semana**, sobre el paquete entero, para no
gastarle horas.

| Día | Pieza | Formato | Estado |
|---|---|---|---|
| 1 | **L01** «Hola, soy Lucía. No existo.» (fijado) | C | ✅ aprobado el 1-oct |
| 3 | **L02** «Este video no fue grabado» | B | editado; falta el OK |
| 5 | **Chiste de 10 s:** «¿Lucía es real? No: soy IA. Lo que te muestro, sí funciona.» (clip del café, ya pagado) | B | se edita a 0 cr después del OK |
| 8 | **«El paciente reserva solo»:** Lucía 3 s (clip del coworking, ya pagado) → la página pública de reserva de la demo, sin reservar → CTA | A | falta grabar la pantalla |
| 10 | **K4 corta** «Las reglas de la recepción» (`GUIONES-LUCIA-KIT.md`). El giro muestra Pendientes; si la demo no lo muestra, la página de reserva | A | material ✅; falta la pantalla |
| 12 | **Carrusel** «Cómo reserva un paciente solo, paso a paso» + **«Comentá DEMO»** (D6), respondido a mano con la puerta | C | falta la captura |

- **Las pantallas de la semana 2 salen de la cuenta demo «Clínica Demo Onia».** Desde la nube no se pueden grabar (el
  navegador no pasa el proxy y no hay sesión), así que las graba la madre o Plataforma. Antes, Sergio Urcullo tiene que
  confirmar el correo de la demo y darle `module.agents` (plan de la 1.0, punto 9).
- **K1 y K2 esperan:**
  - la plantilla IA aprobada y el correo de recordatorio piden escribir en producción;
  - los pacientes de la demo no tienen correo.
  Entran en la semana 3, si la prueba sigue.
- **TikTok:** las mismas piezas, cuando exista la cuenta (§7). No frena Instagram.

**Qué se mide a las 48 h de cada pieza:**
- conversaciones con «vengo de Lucía»;
- preguntas de dueños en comentarios o DM;
- guardados y envíos;
- que la cuenta siga «apta para recomendaciones».

**Día 14:**
- **sigue** con ≥ 1 conversación de un dueño o de la recepción de una clínica;
- **se extiende 2 semanas, una sola vez,** con 0 conversaciones pero ≥ 3 preguntas reales de dueños;
- **se pausa** si no llega a eso.
- **Se para cualquier día** si la cuenta queda «no recomendable» o si domina el comentario «esto reemplaza gente».

## 6. Lucía en la pauta (propuesta; la decide Sergio Urcullo, la arma Ventas y pauta)

- **El hueco:** los 7 anuncios de la competencia que más duran tienen una persona, y la pauta de Onia no tiene ninguna
  (`ONIA_ADQUISICION_Y_PAUTA.md` §2.5).
- **La propuesta es un A/B del mismo ángulo con dos presentadores:**
  - Sergio Urcullo a cámara con la pantalla;
  - Lucía declarada IA.
  Ningún competidor tiene una presentadora IA que diga que lo es, y nadie sabe todavía si eso suma o resta: la prueba
  lo dice.
- **Versión Lucía:**
  - **sin ambo**, porque al lado de las «doctoras IA» de Doctocliq se leería como una de ellas: se usa el clip del café
    o del coworking;
  - rótulo desde el segundo 0, pantalla real a la mitad y declaración de IA de Meta en el anuncio;
  - 0 créditos: el plan de la 1.0 (§4) no admite generaciones pagas para la pauta en octubre.
- **Lucía no arma piezas de pauta por su cuenta:** las hace cuando Ventas manda el brief.

## 7. Cómo se publica

Circuito completo en la skill `lucia` § Publicación.
- **Instagram:**
  - con la app propia, `ig-reel.mjs` / `ig-carrusel.mjs --cuenta lucia`, que pone la etiqueta IA sola;
  - corre en el VPS: esta nube no tiene ssh, así que lo corre la madre o una sesión con acceso;
  - **el token de Lucía ya existe** en Postiz y vence entre el 13 y el 18-oct; hay que pasarlo a
    `/root/.config/onia-publicar/ig-lucia.env` antes de esa fecha.
- **TikTok:** por Buffer, con una cuenta gratis aparte y `isAiGenerated`. Antes hay que crear el TikTok de Lucía.
- **Registro:** cada publicación queda en `/root/publicar/publicado.jsonl`. La madre abre el permalink y confirma la
  etiqueta.

## 8. Decisiones de Sergio Urcullo

**Se aplica la recomendación salvo que diga otra cosa:**
- D2: Reel primero;
- D3: Lucía todavía no es la cara del WhatsApp;
- D4: sin voz;
- D5: el canon de 10 datos de `LUCIA.md` §0-canon;
- D6: «Comentá DEMO» en el carrusel del día 12;
- solo dental.

**Lo que necesita su respuesta:**

| # | Decisión | Recomendación |
|---|---|---|
| D7 | Puerta: el WhatsApp de Onia con «vengo de Lucía» | **Sí.** Es la única que existe y se puede contar. Hay que avisar al dueño del bot para que no lo trate como pregunta de precio |
| D8 | Tono: vos en el contenido y usted en el 1 a 1 | **Sí.** Si elige usted para todo, se corrigen L01 y L02 a 0 cr |
| D9 | Lucía como persona del anuncio, en A/B contra él mismo a cámara | **Probarlo**, sin ambo y a 0 cr. Lo arma Ventas |
| D10 | Créditos que vencen: unos 390 se borran en la próxima renovación | Si quiere usarlos: una prueba de Kling pro contra std + upscale (~17 cr), que define la calidad de todos los clips. No es gasto nuevo en plata |

**Lo que lo destraba, en orden:**
1. OK al paquete de la semana 1: L01, L02 y la idea del chiste.
2. El token de Instagram de Lucía antes del 13-oct. O le da el OK a la madre para leerlo de Postiz (es una lectura de
   producción), o inicia sesión una vez en la app (5 clics).
3. Confirmar el correo de la cuenta demo y darle `module.agents`, para las pantallas de la semana 2.
4. Cuando quiera TikTok: crear la cuenta de Lucía y autorizarla en Buffer.
