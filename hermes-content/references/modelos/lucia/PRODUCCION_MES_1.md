# Lucía — producción del mes 1, guionizada

> Las 8 piezas escritas con el formato **multi-escena de §13**: un solo prompt por pieza con
> rangos de tiempo, lock de vestuario y raccord de luz. Nada de generar plano por plano.
> Estado al 2026-08-22: **L1 renderizada · L2 con brief · L3-L8 guionizadas acá**.
> Nada entra a la cola sin QC de Sergio.

## Reglas que aplican a TODAS (de LUCIA.md §9, §11, §12, §13)

- Identidad: ancla `452d8375-fb67-4df7-9ae0-8f1b257aa51f`, **fondo simple cuando la cara
  tiene que ser reconocible**; escenario cargado solo si la cara no es el punto.
- Color: `natural true-to-life colors, no color grading, no filter look, accurate white balance`.
- Movimiento: `natural real-time speed, no slow motion` — sin adverbios de lentitud.
- `[TEXT RULE — MANDATORY] No legible text anywhere in frame.`
- Voz: audio nativo si el motor lo da y la voz no es el punto; **Marcela (eleven_v3 dirigida,
  UNA sola llamada)** cuando la voz ES la marca (L1, L8).
- Subtítulos: karaoke con verde `#10C26B`, texto AUTORADO (Whisper solo pone tiempos).
- CTA: toda pieza con palabra clave la pide explícita; las que no la tienen piden seguir.

---

## L1 · Reel de lanzamiento "No soy real" — ✅ RENDERIZADO, espera OK

22 s · 4 beats · voz Marcela · b-roll (rooftop → café → gimnasio → laptop → playa).
Preview: `reel-lanzamiento-20260822/renders/preview-v4-verde-360.mp4`.
CTA: seguir (sin palabra — es presentación). **Es la pieza que abre todo.**

## L2 · Carrusel fijado "¿Quién es Lucía?" — brief listo, falta render

7 slides, pack `editorial-clean`, fotos aprobadas del banco.
Brief: `posts-20260807/briefs/lucia-quien-es-fijado.json`. CTA: pregunta abierta + seguir.

---

## L3 · "Me crearon con estas 3 herramientas" — detrás de escena · palabra HUMO

**Modo: UGC** (habla). Selfie a cámara, fondo simple (cara reconocible).
Voz: audio nativo con diálogo literal en el prompt.

```
Scene 1 — la confesión (0s–4s)
  Selfie a distancia de brazo, encuadre cara y hombros, dormitorio con luz de ventana ·
  micro-temblor de mano, sin travelling · foco en su cara, fondo suave ·
  luz de día lateral y suave.
  Dice: "Te van a decir que hace falta un estudio para esto. Mentira."

Scene 2 — la lista (4s–11s)
  Mismo encuadre, ella mueve la mano contando con los dedos · cámara fija ·
  misma luz, mismo outfit (remera blanca) — raccord.
  Dice: "Tres herramientas. Una para mi cara, una para mi voz, una para el video.
  Y el resto es saber qué pedirles."

Scene 3 — el cierre (11s–15s)
  Se acerca un poco a la cámara, media sonrisa · leve acercamiento ·
  misma luz.
  Dice: "Comentá HUMO y te paso cuáles son, sin vender nada."
```
Costo: ~24 cr (gemini omni) o ~8 cr (veo lite + subtítulos, sin audio nativo).

## L4 · "Un día en mi vida (que no existe)" — personaje · sin palabra

**Modo: CINE** (impresiona, no habla). Sin diálogo, música + subtítulos.
Escenarios bolivianos reconocibles; la cara NO es el punto → escenario cargado permitido.

```
Scene 1 — mañana (0s–4s)
  Plano medio desde la ventana, ella con mate/café mirando la calle de Santa Cruz ·
  cámara en mano con micro-deriva · foco en ella, calle desenfocada ·
  luz de mañana cálida entrando de la izquierda.

Scene 2 — la calle (4s–9s)
  Plano entero, ella caminando por una vereda con árboles · la cámara la sigue
  hacia atrás a paso normal · profundidad media, gente de fondo movida ·
  sol alto filtrado por las hojas.

Scene 3 — el trabajo (9s–14s)
  Plano medio corto en un café, laptop abierta, tipeando · cámara fija con
  micro-temblor · foco en sus manos y pasa a su cara · luz de ventana lateral.

Scene 4 — el remate (14s–18s)
  Primer plano, mira a cámara y sonríe apenas · cámara fija ·
  fondo completamente desenfocado · misma luz de ventana.
  Texto en pantalla (subtítulo, no en el cuadro generado): "Nada de esto pasó."
```
Costo: ~32 cr (4 escenas veo lite) o ~16 cr en una sola generación multi-escena.

## L5 · "El negocio que atiende solo" — IA sin humo · palabra SISTEMA

**Molde de demo: 17 SEGUNDOS EXACTOS** (§10.1 del sistema de marketing). La promesa va en
el segundo 1. No es b-roll de Lucía: es captura de pantalla real del chatbot.

⚠️ **Corregido 2026-08-23.** Acá decía "captura real del chatbot **+ su voz**", y contradecía
sus propias dos fuentes: el molde §10.1 es **sin voz** (música + texto en pantalla) y la tabla
de costos de este mismo archivo dice **0 créditos** — con voz de ElevenLabs no serían 0. **L5
va sin voz.** Una línea suelta mandaba a gastar en una locución que el molde no pide.

⚠️ **Dependencia cruzada:** el plano de 1-6 s exige que el bot conteste de verdad. Al 23-ago el
chat público llevaba 0 respuestas en toda su historia; se arregló la causa (membresía del bot en
el inbox 4) pero **falta verificarlo MIRANDO**. Capturas y scripts ya hechos en
`l5-negocio-atiende-solo-20260823/`. No montar hasta que el bot esté verificado.

```
0-1 s   Promesa: "Así de simple, tu negocio contesta solo."
1-6 s   Entra un mensaje de WhatsApp → se ve la respuesta automática completa
6-11 s  Se ve el panel: el lead entra a la tabla, solo
11-14 s Beneficio en UNA línea: "Cero mensajes sin responder, cero madrugadas."
14-17 s CTA: "Comentá SISTEMA."
```
Captura real de app.onia.com.bo (Playwright) — **cero generación, cero créditos**.

## L6 · Carrusel "5 señales de que tu negocio necesita un sistema" — palabra SISTEMA

Pack `editorial-clean`, 7 slides, fondo fotográfico del banco de Lucía.
**Gate de copy (§10.2):** cada señal en segunda persona, desde la silla del dueño y
terminando en plata. Si no nombra el dolor exacto, no sale.
Costo: ~4 cr (fotos ya existentes) + render local.

## L7 · "Lo que la IA NO puede hacer por tu negocio" — contracorriente · palabra HUMO

**Modo: UGC.** Fondo simple. El gancho es la contracorriente: la cuenta de IA diciendo
qué NO puede la IA. Es lo que la hace creíble.

```
Scene 1 — el gancho (0s–4s)
  Selfie a distancia de brazo, fondo neutro · cámara fija con micro-temblor ·
  foco en su cara · luz suave frontal.
  Dice: "Soy inteligencia artificial y te voy a decir tres cosas que no puedo hacer."

Scene 2 — las tres (4s–13s)
  Mismo encuadre y outfit · cámara fija · misma luz.
  Dice: "No puedo cobrarte una deuda. No puedo elegir a quién contratás.
  Y no puedo arreglar un negocio que no sabe qué vende."

Scene 3 — el giro (13s–18s)
  Leve acercamiento, expresión más cálida · misma luz.
  Dice: "Lo que sí puedo es sacarte de encima todo lo que hacés dos veces.
  Comentá HUMO."
```

## L8 · Dueto conceptual con @oniahq — detrás de escena · palabra SISTEMA

**Voz Marcela obligatoria** (pieza de marca). El personaje conoce a sus creadores:
b-roll de Lucía + capturas del panel + tile verde de Onia. Sin cara humana.
Publicación cruzada: colaboración en ambos feeds (gratis, aparece en los dos).

---

## Calendario propuesto — 20:00 Bolivia (mejor hora medida, Metricool)

| Fecha | Pieza | Cuenta | Palabra |
|---|---|---|---|
| dom 23-ago | **L1 reel lanzamiento** | Lucía | — |
| lun 24-ago | L2 carrusel fijado (+ fijar al perfil) | Lucía | — |
| mar 25-ago | L4 un día en mi vida | Lucía | — |
| mié 26-ago | L3 me crearon con 3 herramientas | Lucía | HUMO |
| jue 27-ago | L6 carrusel 5 señales | Lucía | SISTEMA |
| vie 28-ago | L5 el negocio que atiende solo | Lucía | SISTEMA |
| sáb 29-ago | L7 lo que la IA NO puede | Lucía | HUMO |
| dom 30-ago | L8 dueto con @oniahq | ambas | SISTEMA |

Historias: 1-2/día desde el día 1 (recortes del b-roll ya generado + placas de código =
**0 créditos**), escalando a 3-4/día cuando haya seguidores reales.

## Costo total del mes 1

| Concepto | Créditos |
|---|---|
| L1 (hecho) | ~50 (ya gastados) |
| L3 + L7 (UGC, veo lite + subtítulos) | ~16 |
| L4 (cine multi-escena) | ~16-32 |
| L5 (capturas reales) | **0** |
| L6 (carrusel, fotos existentes) | ~4 |
| L8 (b-roll existente + panel) | ~8 |
| Historias del mes | **0** |
| **Total pendiente** | **~44-60 cr** |

Muy por debajo de los 100 estimados: el conocimiento nuevo (multi-escena en una sola
generación, capturas reales en vez de generar, reciclaje del b-roll para historias) bajó
el costo a menos de la mitad.

## Lo que falta antes de encender

1. **OK de Sergio al reel L1** → dispara todo el calendario.
2. PDF de la palabra HUMO ("5 herramientas de IA que sí sirven en Bolivia") — lo escribo yo.
3. Link en la bio de Lucía (hoy dice 👇 y no hay link).
4. Calentamiento: seguir 50-70 cuentas del nicho (manual, celular).
