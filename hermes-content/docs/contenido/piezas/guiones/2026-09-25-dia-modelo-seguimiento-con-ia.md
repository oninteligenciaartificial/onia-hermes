# Día modelo · «El seguimiento que no molesta» — un tema, 13 piezas, tres trabajos

> **Estado: guion de muestra.** Sirve para que Sergio Urcullo juzgue el nivel antes de escalar a
> 10–13 piezas por día. Escrito el 25-sep.
>
> **Decisiones que aplica (todas del 25-sep):**
> - cadencia de 10–13 por día (`../../../ONIA_MARCA_PERSONAL_TRES_CARRILES.md`);
> - «Trial» sale en TikTok y Shorts mientras `@sergiourcullo` no llegue a 1.000 seguidores;
> - tres trabajos, uno por pieza (`../../SISTEMA_DE_GUIONES.md` §0);
> - escenarios inventados, ONIA real.

## Por qué este tema

El mismo tema sirve para los tres trabajos:

- **Enseña:** cómo hacer que la IA redacte un seguimiento sin inventar nada. Posiciona a Sergio
  Urcullo como el que sabe ponerle límites a la IA, no como el que la usa para todo.
- **Vende enseñando:** el dolor número 1 de la clínica es **el paciente con tratamiento a medias
  que no volvió** (`../../../ONIA_CLIENTE_IDEAL.md` §4), y ONIA tiene un agente para eso: Recall.
- **Conecta:** el criterio «nada sale sin tu OK», que es a la vez una opinión de Sergio Urcullo y
  el diseño del producto.

## Mapa del día

Tres grabaciones principales (E1, V1, C1) y cuatro cortos de edición mínima. Con reutilización
salen 13 publicaciones.

| # | Hueco (`TRES_CARRILES`) | Sale en | Trabajo | Pieza | Qué se lleva quien la ve |
|---|---|---|---|---|---|
| 1 | Feed · video normal | IG + TikTok + Shorts | Enseña | **E1** Que la IA escriba el mensaje sin inventar nada | el prompt de 4 reglas y el campo `requiere_revision` |
| 2 | Feed · pilar | IG + TikTok + Shorts | Vende enseñando | **V1** El paciente que no volvió | la regla para armar la lista, el mensaje y la cola de aprobación |
| 3 | Feed · B-roll | IG + TikTok + Shorts | Conecta | **C1** Por qué no dejo que la IA mande mensajes sola | las 3 cosas que aprueba siempre una persona |
| 4 | Carrusel (reemplaza 1 de cada 4 B-roll) | IG + PDF en LinkedIn | Enseña | 3 mensajes de seguimiento que sí se contestan | tres plantillas para copiar |
| 5 | Trial | TikTok + Shorts | Enseña | La regla en una línea | «tratamiento empezado + sin cita hace 45 días = a la lista» |
| 6 | Trial | TikTok + Shorts | Vende enseñando | Hacé la cuenta | pacientes × sesiones que faltan × lo que cobrás |
| 7 | Trial | TikTok + Shorts | Enseña | El JSON que no se rompe | por qué pedir `requiere_revision` y no «un mensaje» |
| 8 | Trial | TikTok + Shorts | Conecta · polémico | El chatbot que contesta todo espanta clientes | cuándo tiene que derivar a una persona |
| 9 | Trial V2 | TikTok + Shorts | Vende enseñando | La cola de aprobación a las 7 de la mañana | cómo se ve aprobar en ONIA (pantalla real) |
| 10 | YAPS · Samuel | TikTok + Shorts | Conecta | según su brief (`../../../cola/BRIEF-SAMUEL-VIDEOS.md`) | — |
| 11–13 | Trial | TikTok + Shorts | — | E1, V1 y C1 cortados a 20–30 s, cada uno con su gancho | la misma lección, en corto |

**Lo que se graba, en una sesión de unas 2 h:**
- E1 (cámara + pantalla de Claude con datos inventados);
- V1 (cámara + la pantalla real de ONIA);
- C1 (voz + B-roll de Sergio Urcullo trabajando);
- los cortos 5 a 9 (cámara, edición mínima).

**⚠️ Depende de la sesión Plataforma:** una organización demo con pacientes inventados, donde
Recall ya haya propuesto mensajes, y la captura de su cola en `/agents`. Hoy Recall corre pero
propone 0 (no hay datos de cliente, `ONIA_CATALOGO_DE_VENTA.md` §7). Para que proponga, la org demo
necesita pacientes con una visita **completada** hace más de 180 días y sin cita por delante. **Sin esa pantalla, V1 y el
corto 9 no se graban:** producto visible o no sale.

---

### E1 · reel/corto · Que la IA escriba el mensaje sin inventar nada

ENSEÑA:   al terminar, quien lo vio puede escribir un prompt que redacta mensajes de seguimiento **sólo** con los datos que le da, y que marca `requiere_revision` cuando le falta algo
PRUEBA:   GRABA Sergio Urcullo · pantalla de Claude con el prompt de abajo y dos corridas: datos completos y datos con la fecha borrada. Datos inventados, ningún paciente real
AUDIENCIA: marca personal (construir con IA) · también la ve el dueño de negocio
TRABAJO:  enseña
FUENTES:  — (es una técnica, no un dato)
CTA:      «el prompt completo está en la descripción» · recurso: la descripción del reel (se pega abajo)
LAYOUT:   B partido (pantalla arriba 55 % / cabeza abajo 45 %)
EDICIÓN:  completa (método Santiago)
DURACIÓN: 55 s · PALABRAS: ~180

| # | t | HABLA (literal) | CUE | EN PANTALLA | TEXTO (≤3 palabras) | ZOOM / SFX | NOTA |
|---|---|---|---|---|---|---|---|
| 1 | 0-4 | «Si le pedís a la IA que le escriba a un cliente para que vuelva, te puede inventar un descuento.» | — | CAM, gancho sin corte | `inventa descuentos` | punch 1.00→1.08 | sin saludo |
| 2 | 4-10 | «Le das un nombre y te devuelve “veinte por ciento si reservás hoy”. Nadie autorizó ese veinte por ciento.» | «veinte por ciento» | pantalla: una respuesta de ejemplo con el descuento resaltado | `¿quién lo autorizó?` | whoosh | ejemplo **ilustrativo**: se escribe como tal, no se presenta como captura de un error real |
| 3 | 10-18 | «Se arregla con cuatro reglas en el prompt. Una: sólo estos datos. Nombre, tratamiento pendiente y fecha de la última cita.» | «cuatro reglas» | prompt, bloque «Usá SÓLO estos datos» | `regla 1` | marca en el bloque | — |
| 4 | 18-26 | «Dos: prohibido inventar precios, fechas o promociones. Tres: máximo tres oraciones y una sola pregunta que se conteste con sí o no.» | «prohibido» | prompt, reglas 1 a 3 | `regla 2 · 3` | — | — |
| 5 | 26-36 | «Y cuatro, la que casi nadie pone: que devuelva un JSON con un campo, requiere revisión. Si le falta un dato, no escribe: te avisa.» | «requiere revisión» | prompt, bloque JSON | `requiere_revision` | punch | el campo es el aprendizaje central |
| 6 | 36-46 | «Mirá: con los datos completos, mensaje listo. Le borro la fecha… y marca requiere revisión en true.» | «Le borro la fecha» | corrida 1 → corrida 2, el `true` resaltado | `true` | pop | las dos corridas se graban de verdad, no se escriben |
| 7 | 46-55 | «La IA redacta; vos decidís qué sale. El prompt completo está en la descripción. Guardalo.» | «Guardalo» | CAM | `guardalo` | — | CTA dos veces en la toma |

**Prompt para la descripción, que también se muestra en pantalla:**

```text
Sos la recepción de un negocio. Escribí un mensaje de WhatsApp para alguien que dejó algo a medias.

Usá SÓLO estos datos:
- nombre: {nombre}
- pendiente: {qué quedó pendiente}
- última visita: {fecha}

Reglas:
1. No inventes precios, descuentos, fechas ni horarios.
2. Máximo 3 oraciones, tono cálido y directo.
3. Terminá con UNA pregunta que se conteste con sí o no.
4. Si falta un dato, o el caso necesita algo que no está en los datos, no escribas el mensaje.

Devolvé sólo este JSON:
{"mensaje": "...", "requiere_revision": true o false, "motivo": "..."}
```

---

### V1 · reel/corto · El paciente que no volvió

ENSEÑA:   al terminar, el dueño de una clínica sabe armar a mano la lista de pacientes que no volvieron (última visita hace más de 6 meses y ninguna cita por delante: dos columnas y un filtro), qué mensaje mandarles y por qué alguien lo aprueba antes; y ve que en ONIA esa misma lista la arma Recall cada mañana
PRUEBA:   GRABA Sergio Urcullo · la cola real de Recall en `/agents`, en la org demo con pacientes inventados (depende de Plataforma, ver arriba)
AUDIENCIA: dueño de clínica (Etapa 1) · se publica en `@sergiourcullo` y en `@oniahq`
TRABAJO:  vende enseñando
FUENTES:  qué arma Recall: `../../../QUE_VENDEMOS_YA.md` (verificado contra `agents-runtime.ts` y `agents-logic.ts`): «quien no volvió y no tiene próxima cita agendada», última visita **completada** hace 180 días (fijo, sin pantalla para cambiarlo), todos los días a las 07:00, borrador en la cola de aprobación · cadencia: `cadencia-prometida.test.ts` · estado 🟡: `ONIA_CATALOGO_DE_VENTA.md` §7 · **re-verificar con Plataforma el día de grabar**
CTA:      «probalo 14 días gratis, link en mi perfil» · recurso: `app.onia.com.bo/register` (**verificar el día de publicar** que el alta siga abierta: CLAUDE.md §2)
LAYOUT:   A cabeza a cuadro + overlays, con C (pantalla primero) en los beats 6-7
EDICIÓN:  completa
DURACIÓN: 68 s · PALABRAS: ~225

| # | t | HABLA (literal) | CUE | EN PANTALLA | TEXTO | ZOOM / SFX | NOTA |
|---|---|---|---|---|---|---|---|
| 1 | 0-5 | «En tu clínica hay plata que ya ganaste y todavía no cobraste.» | — | CAM | `ya la ganaste` | punch | gancho, sin saludo |
| 2 | 5-12 | «Es el paciente que vino, no volvió y no tiene próxima cita. Entre ellos, los que dejaron un tratamiento a medias.» | «no volvió» | CAM + tarjeta «no volvió · sin próxima cita» | `no volvió` | — | el dolor #1 (`ONIA_CLIENTE_IDEAL.md` §4) está **dentro** de esta lista; la lista no filtra por tratamiento |
| 3 | 12-22 | «Hacé la cuenta con tus números: cuántos pacientes dejaron algo a medias, por las sesiones que les faltan, por lo que cobrás cada una. Eso es lo que está esperando.» | «Hacé la cuenta» | tarjeta: `pacientes × sesiones × Bs por sesión` | `hacé la cuenta` | — | **sin cifras de ONIA**: la cuenta la hace el que mira |
| 4 | 22-32 | «Para recuperarlo hacen falta tres cosas. Una lista: última visita hace más de seis meses y ninguna cita por delante. En una planilla son dos columnas y un filtro.» | «Una lista» | planilla de ejemplo (pacientes inventados), filtrada | `+6 meses · sin cita` | — | es la **misma** regla que aplica Recall (180 días): lo que se enseña a mano es lo que ONIA hace sola |
| 5 | 32-42 | «Un mensaje corto: el nombre, por qué le conviene volver y una sola pregunta, “¿te reservo un horario esta semana?”. Y alguien que lo apruebe antes de mandarlo.» | «Un mensaje corto» | tarjeta con el mensaje de ejemplo («Ana», inventada) | `una pregunta` | — | **no** decir que el borrador de ONIA nombra el tratamiento: no está verificado |
| 6 | 42-56 | «En ONIA eso lo hace un agente que se llama Recall. Cada mañana a las siete arma esa misma lista y te deja el mensaje redactado en una cola.» | «Recall» | **pantalla real**: `/agents`, cola de Recall en la org demo | `cada mañana` | zoom a la cola | «cada mañana a las siete», nunca «24/7» |
| 7 | 56-62 | «Vos tocás Aprobar. Nada sale sin tu OK.» | «Aprobar» | pantalla real: el botón Aprobar | `nada sin tu OK` | click | — |
| 8 | 62-68 | «Si tenés una clínica, probalo catorce días gratis. El link está en mi perfil.» | «catorce días» | CAM | `14 días gratis` | — | un solo CTA; se verifica el alta ese día |

---

### C1 · B-roll + voz · Por qué no dejo que la IA mande mensajes sola

ENSEÑA:   al terminar, quien lo vio sabe las 3 situaciones en las que un mensaje automático lo aprueba siempre una persona, y cuáles pueden salir solos
PRUEBA:   GRABA Sergio Urcullo · B-roll real de él trabajando (escritorio, teléfono con la pantalla de aprobar, notebook). Nada de metraje genérico
AUDIENCIA: marca personal y dueño de negocio (el miedo al bot que se equivoca lo tienen los dos)
TRABAJO:  conecta
FUENTES:  criterio de Sergio Urcullo · **lo confirma él antes de grabar** (SISTEMA_DE_GUIONES §2: lo que uno dice de sí mismo no se aproxima)
CTA:      «guardá las tres» · sin recurso
LAYOUT:   B-roll a pantalla completa + voz, con la cara en el beat 1 y en el 7
EDICIÓN:  completa
DURACIÓN: 50 s · PALABRAS: ~165

| # | t | HABLA (literal) | CUE | EN PANTALLA | TEXTO | ZOOM / SFX | NOTA |
|---|---|---|---|---|---|---|---|
| 1 | 0-4 | «Podría hacer que la IA le escriba sola a cada cliente. No lo hago.» | — | CAM | `no lo hago` | punch | tensión en el gancho |
| 2 | 4-12 | «Porque un mensaje equivocado no es un error de tipeo: es un cliente que no vuelve más.» | «no vuelve más» | B-roll: teléfono con un chat | — | — | — |
| 3 | 12-18 | «Tengo una regla: hay tres casos en los que siempre aprueba una persona.» | «tres casos» | B-roll: escritorio | `3 casos` | — | — |
| 4 | 18-26 | «Uno: cuando el mensaje habla de plata. Un precio, una deuda, un descuento.» | «plata» | tarjeta 1 | `1 · plata` | pop | — |
| 5 | 26-33 | «Dos: cuando habla de salud. Un síntoma, una indicación, un “no te preocupes”.» | «salud» | tarjeta 2 | `2 · salud` | pop | — |
| 6 | 33-40 | «Tres: el primer mensaje a alguien que nunca te escribió.» | «primer mensaje» | tarjeta 3 | `3 · primer contacto` | pop | — |
| 7 | 40-50 | «Lo demás, confirmar un horario o recordar una cita, que salga solo. La IA escribe; la decisión de mandar es tuya. Guardá las tres.» | «Guardá las tres» | CAM | `guardá las tres` | — | coherente con ONIA: los recordatorios de cita salen solos; Recall espera el OK |

---

## Lo que se tomó de los referentes

De `../../../research/ONIA_REFERENTE_ANAS_ANDALUSI_20260925.md`, que cruza a Anas Andaloussi con
Rocha, Taveras y Muñoz, salen tres ideas:
- **La fórmula común:** una unidad concreta por pieza, la prueba a la vista, la cara y el criterio
  de quien la hace, y una sola puerta gratis al siguiente paso.
- **Cada pieza de venta enseña a hacer a mano lo que ONIA hace sola.** Es V1: la planilla filtrada
  y, al lado, Recall armando la misma lista.
- **Lo inventado funciona cuando se declara, y cobra cuando se presenta como hecho.** A Anas le
  cobraron el «millonario», los «12 millones» y el «Título Oficial».

Mezcla propuesta para medir durante dos semanas: **~50 % enseña · ~30 % vende enseñando · ~20 %
conecta**. Cada tipo se mide con su propia métrica:
- enseña: guardados y seguidores;
- vende: conversaciones con clínicas, cuentas creadas y diagnósticos agendados;
- conecta: comentarios y mensajes.

## Lo que falta para pasar a «grabar» (SISTEMA_DE_GUIONES §10)

- [ ] Sergio Urcullo aprueba el nivel de estas tres piezas. Si no alcanza, se rehace el molde
  antes de escribir las otras diez.
- [ ] C1: Sergio Urcullo confirma que las «3 cosas» son su criterio.
- [ ] Plataforma entrega la org demo con Recall proponiendo mensajes y su captura.
- [ ] El día de publicar V1: el alta de 14 días sigue abierta (CLAUDE.md §2).
- [ ] Los cortos 5–9 y el carrusel se escriben con este mismo molde **después** de la aprobación.
