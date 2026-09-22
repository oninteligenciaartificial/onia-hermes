# UGC IA — “¿Quién no volvió?”

Formato: Reel / Story 9:16, 27 segundos

Rol en cámara: **presentadora IA original de ONIA**. No es clienta, odontóloga,
empleada de una clínica ni testimonio.

Objetivo: registro a prueba de 14 días.

Trabajo de venta: convertir un dolor dental concreto —tratamientos iniciados que
quedaron a medias— en una demostración breve del mecanismo de ONIA.

## Identidad visual aprobada para producción

- Ancla selfie: `assets/ugc-ai-presenter-selfie-v1.png`
- Continuidad en escritorio: `assets/ugc-ai-presenter-desk-v1.png`
- Mujer boliviana, 30–35 años, blusa oliva, recepción dental cotidiana.
- Mantener cara, edad, cabello, ropa, luz y locación entre tomas.
- El personaje dice “te muestro”; nunca “en mi clínica” ni “desde que lo uso”.

## Guion final

**0–3 s — Hook, selfie**

“Te hago una pregunta incómoda: ¿cuántos tratamientos quedaron a medias este mes?”

**3–7 s — Dolor, selfie + dos insertos**

“No los que cancelaron. Los que sí empezaron… y después nadie volvió a llamar.”

**7–16 s — Producto real, screen recording**

“En ONIA ves la agenda, la ficha y los cobros en el mismo sistema.”

**16–22 s — Mecanismo, escritorio + UI**

“Recall prepara el seguimiento. Tu equipo revisa y decide a quién contactar.”

**22–27 s — CTA, selfie**

“Probalo 14 días sin tarjeta. Está hecho para clínicas en Bolivia.”

## Texto quemado en pantalla

1. `¿Cuántos tratamientos quedaron a medias?`
2. `Empezaron. No volvieron.`
3. `Agenda + ficha + cobros`
4. `Recall prepara · tu equipo decide`
5. `14 días sin tarjeta`

## Shot list y edición

| Tiempo | Imagen | Voz / acción | Prueba |
|---|---|---|---|
| 0–3 s | Ancla selfie, handheld leve | Pregunta directa; sin sonrisa publicitaria | Contexto dental reconocible |
| 3–5 s | Primer plano de cuaderno, corte de 8–10 cuadros | “No los que cancelaron” | Trabajo manual real |
| 5–7 s | Presentadora mira a cámara, pausa antes de “nadie” | Dolor y tensión | Sin testimonial |
| 7–11 s | UI real: calendario | Cursor selecciona una cita demo | `paso-07d-cita-en-agenda.png` |
| 11–13 s | UI real: alta desde cita | Zoom a paciente/profesional/motivo | `alta-inline-en-el-modal-de-cita.png` |
| 13–16 s | UI real: cobros | Zoom a “Cobrado / Por cobrar” | `paso-08-cobro.png` |
| 16–19 s | Toma de escritorio | Gesto “te muestro”; pantalla en blanco para composición | Continuidad de identidad |
| 19–22 s | UI + placa editorial | `Recall prepara · tu equipo decide` | Claim con control humano |
| 22–27 s | Selfie + end card | CTA verbal, logo y botón en edición | Oferta verificable |

Producto visible acumulado: 12 segundos.

Ritmo: cortes cada 1,5–2,5 s. Subtítulos grandes, máximo dos líneas, dentro de la
zona segura. Música baja sin copyright; la voz siempre manda.

## Prompt de identidad para Higgsfield

> Use the approved reference images. Preserve the exact same original AI presenter:
> Bolivian Latina woman age 30–35, same facial structure, natural skin texture, dark
> hair, olive blouse and ordinary dental reception. Native vertical smartphone UGC,
> mild handheld movement, direct eye contact, conversational delivery, slight pauses
> and normal blinking. She is an ONIA presenter explaining a product, not a customer,
> dentist or testimonial. Keep the laptop screen blank for real ONIA UI compositing.
> Mixed window and practical light, ordinary workplace, no glamour retouching.

## Prompt de movimiento y entrega

> Calm but urgent delivery. Start close to camera with a small inhale before the
> question. On “quedaron a medias”, lower the voice slightly and hold eye contact.
> On “te muestro”, turn naturally toward the laptop and gesture once with an open
> hand. Return to camera for the CTA. Realistic phone autofocus breathing, tiny framing
> drift, no dramatic camera move, no exaggerated acting.

## Negative prompt

> no customer testimonial, no dentist claim, no white coat, no influencer beauty
> lighting, no glossy corporate stock pose, no synthetic avatar skin, no lip-sync
> wobble, no extra fingers, no fake UI, no readable patient data, no generated logo,
> no luxury clinic, no exaggerated smile, no cinematic depth of field, no watermark

## Composición obligatoria

- Higgsfield genera sólo presentadora y ambiente. La UI se inserta desde capturas
  reales de ONIA; nunca se le pide al modelo que invente una pantalla.
- Tenant demo únicamente. Ocultar identificadores, teléfonos, correos y montos reales.
- End card: `ONIA Platform · 14 días sin tarjeta · Probá ONIA`.
- Si Meta exige etiqueta de contenido sintético para esta configuración, activarla.

## Copy del anuncio

Texto principal:

> ¿Cuántos tratamientos quedaron a medias este mes? ONIA te ayuda a ver quién no
> volvió y qué seguimiento falta, con agenda, pacientes y cobros en el mismo sistema.

Titular: `Recuperá el seguimiento`

Descripción: `14 días sin tarjeta`

CTA: `Registrarte`

## Claims

Seguros:

- agenda, ficha de pacientes y cobros en el mismo sistema;
- Recall prepara y una persona decide;
- adaptado a clínicas en Bolivia;
- 14 días sin tarjeta;
- desde Bs 320/mes.

Prohibidos:

- “recuperá X%”, “agenda llena”, “cero ausencias” o ROI sin evidencia;
- presentarla como clienta, odontóloga o usuaria real;
- decir que Recall contacta sin aprobación humana;
- facturación SIAT mientras siga en homologación.

## Estado de generación

El paquete creativo está listo. **No se generó video pago.** La PC no tiene una
sesión Higgsfield autenticada y la conexión disponible al VPS no expone credenciales;
por eso no se pudo consultar un costo vivo. La regla de ONIA prohíbe estimar ese costo
o gastar sin mostrarlo primero.

Cuando la sesión esté disponible, ejecutar en este orden:

```bash
higgsfield account status
higgsfield model list
higgsfield generate cost <job_type_vigente> --json --no-color <mismos_argumentos_del_draft>
```

Después: presentar modelo, duración y créditos exactos a Sergio Urcullo; generar un
solo draft tras aprobación explícita; revisar; recién entonces producir variantes.
