# Lucía sobre el kit de grabación de Sergio Urcullo — 3 guiones adaptados (3-oct-2026)

> Pedido de la madre (3-oct): Lucía trabaja también sobre los guiones que graba Sergio Urcullo.
> - **Fuente:** las piezas de negocio S2 de `docs/cola/plan-3-semanas/S2-GUIONES.md`. `KIT-GRABACION.md` todavía no
>   existía en `main` cuando se escribió esto.
> - **Esto no reemplaza al plan** (`docs/cola/lucia-diario/PLAN.md`): son 3 piezas listas para cuando Sergio Urcullo
>   apruebe el gasto.
> - **NO se generó nada.** Los costos son cotizaciones sin generar (`get_cost`), medidas el 3-oct.

## Por qué no son copias de los guiones de Sergio Urcullo

Las tres piezas S2 hablan de **su bot de WhatsApp** (franja horaria, IA que promete, horarios editables). Lucía no
puede vender eso: `ONIA_CATALOGO_DE_VENTA.md` §5 deja el agente de WhatsApp en ⏸ (*«nunca se promete "la IA agenda
sola"»*), y §7 prohíbe el recordatorio por WhatsApp. Por eso de cada guion se conserva **la idea** y se la lleva a
lo que Onia hace hoy y se puede decir (§2 y §8).

| Guion de Sergio Urcullo | Idea que se conserva | Versión de Lucía |
|---|---|---|
| S2-D08-A «¿La IA le promete a tu cliente algo que no confirmaste?» | La IA no decide sola | **K1 · Humo vs. real:** la IA escribe el modelo y el dueño lo aprueba |
| S2-D10-A «Tu bot no le tiene que escribir a nadie a las seis de la mañana» | La hora en que trabaja el sistema | **K2 · Recepción a las 8:** a las 7 Onia ya revisó la agenda |
| S2-D13-A «Cambiar el horario de tu bot no debería necesitar un programador» | Los datos del negocio sin programador | **K3 · Sin programador:** pegás tu web y Onia carga los datos |

## Reglas de las tres piezas (de `LUCIA.md` §0 y `PLAN.md` §3)

- **Rubro:** dental, que es el primero en el orden de empuje.
- **Formato:** Reel 9:16 de 30–36 s, **sin voz** (D4 sigue pendiente), con tarjetas de texto, sin música de cama, y se
  edita con `editor-videos` § Reels de Lucía.
- **IA declarada:**
  - rótulo «Lucía · personaje IA de Onia» desde el segundo 0;
  - el pie arranca con «Lucía es un personaje hecho con IA por @oniahq»;
  - etiqueta de IA de Instagram.
- **Ambo = vestuario.** Ninguna frase la pone en el puesto: nada de «soy», «mis pacientes» ni «mi consultorio».
- **Sin promesas de resultado:** nada de «agenda llena», porcentajes ni «cero ausencias».
- **Pantalla REAL de Onia** en el centro de cada pieza.
  - ⛔ Hoy no hay cuenta demo: las tomas de pantalla son el bloqueo.
  - Antes de publicar se abre cada pantalla con sesión y se MIRA (catálogo §8).
- **Un solo cierre:** «Mandáselo a quien contesta tu WhatsApp» y «Agendá tu demo» → `onia.com.bo/llamada?src=lucia-kN`.

**Costos medidos el 3-oct con `get_cost`, sin generar:**

| Qué | Modelo y parámetros | Créditos |
|---|---|---:|
| Foto de Lucía con su cara y la prenda | `seedream_v4_5`, 9:16, con el ancla `abe2e6bd` y el ambo `8d138bd6` como referencias | **1** |
| Clip de 6 s desde una foto aprobada | `kling3_0`, `mode: std`, `sound: "off"`, 6 s, 9:16 | **7,5** |
| ⚠️ El mismo clip con `sound: false` | Higgsfield no acepta `false`, lo pasa a `on` | 10,5 |

---

## K1 · Humo vs. real — «¿Una IA que confirma citas sin preguntarte?»

- **Plano:** recepción de una clínica dental en una torre de Equipetrol: porcelanato claro, mostrador de madera clara
  y mármol, ventanal a una calle arbolada.
- **Vestuario:** ambo terracota (`v4/vestuario/ambo-terracota-frente-8d138bd6.jpg`), argollas y cadenita de oro.
- **Duración:** 34 s.

| # | Tiempo | Imagen | Texto en pantalla | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–2,5 s | Foto: Lucía detrás del mostrador mirando un celular, con duda; acercamiento lento | «¿Una IA que confirma citas sin preguntarte?» | — | 1 |
| 2 | 2,5–5 s | La misma foto, con golpe de zoom | «Eso es humo.» | — | 0 |
| 3 | 5–20 s | **Pantalla real:** el texto de un recordatorio propuesto con IA y el botón para aprobarlo | «La IA escribe el modelo del mensaje.» → «Vos lo revisás y lo aprobás una vez.» | Catálogo §8, frase 1 | 0 |
| 4 | 20–28 s | **Pantalla real:** Pendientes con el mensaje listo y el nombre y la hora ya puestos | «La IA no ve los datos de tus pacientes. Onia le pone el nombre y la hora.» | §8, frase 2 | 0 |
| 5 | 28–34 s | Clip: Lucía levanta la vista a cámara y sonríe | «Nada sale sin que vos lo apruebes.» → cierre | §8, frase 3 | 7,5 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq. En Onia la IA te propone el texto de cada recordatorio
(cobros, confirmación de citas, pacientes que no vuelven) con el tono de tu negocio. Vos lo revisás y lo aprobás una
sola vez, y la IA nunca ve los datos de tus pacientes. Desde el plan Crece y en la prueba de 14 días. Agendá tu demo:
link en la bio.

**Costo: 8,5 cr.** La foto 1 es además la prueba de ropa (D1). Si la cara no da ≥ 0,70 o el ambo no coincide con el
maniquí, se rehace antes de pagar el clip.

## K2 · Recepción a las 8 — «A las 7, Onia ya revisó tu agenda»

- **Plano:** la misma recepción a las 7:55, con luz de mañana de costado.
- **Vestuario:** ambo terracota.
- **Gancho:** su límite físico (un café que no puede tomar).
- **Duración:** 36 s.

| # | Tiempo | Imagen | Texto en pantalla | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–3 s | Foto: Lucía apoyada en el mostrador vacío, con un café | «8:00. La recepción empieza a llamar uno por uno.» | — | 1 |
| 2 | 3–6 s | Foto sin Lucía: el mostrador con una agenda de papel y un teléfono | «¿Quién tiene cita hoy? ¿Quién debe?» | — | 1 |
| 3 | 6–22 s | **Pantalla real:** Pendientes del día: quien tiene cita mañana, quien debe y quien hace 6 meses no vuelve, cada uno con su mensaje listo | «A las 7, Onia ya revisó tu agenda y tus cobros.» → «Te deja anotado a quién escribirle, con el mensaje listo.» | §2 (agentes 07:00 La Paz) · §8, frase 3 | 0 |
| 4 | 22–30 s | **Pantalla real:** el correo de recordatorio que recibe el paciente | «El recordatorio por correo sale solo: 24 h y 2 h antes.» | §2 «Trabaja solo» | 0 |
| 5 | 30–36 s | Clip: Lucía mira el café, lo deja y mira a cámara | «No puedo tomarme este café. Tu recepción, sí.» → cierre | Límite físico (manual §2) | 7,5 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq. Todas las mañanas Onia revisa tu agenda y tus cobros y te deja
anotado a quién escribirle, con el mensaje listo; nada sale sin que vos lo apruebes. El recordatorio de cita por correo
sale solo, 24 h y 2 h antes. Desde el plan Crece y en la prueba de 14 días. Agendá tu demo: link en la bio.

**Costo: 9,5 cr.**

⛔ **Lo que se dejó afuera a propósito:** «no escribe de madrugada» o «respeta tu horario». Sergio Urcullo lo dice de
SU bot, y el catálogo no dice que el correo de recordatorio respete una franja. Sin medirlo, no se promete.

## K3 · Sin programador — «¿Cargar tus datos te lleva una tarde?»

- **Plano:** el coworking de Equipetrol. **Es el clip ya pagado de L05** (`07b938b2`, `videos/lucia-l05/raw/`): Lucía
  tipea en la laptop, levanta la vista y sonríe.
- **Vestuario:** el del clip, su ropa de trabajo. **No lleva ambo:** no está en la clínica, muestra cómo se arma la
  cuenta.
- **Duración:** 31 s.

| # | Tiempo | Imagen | Texto en pantalla | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–3 s | Clip pagado: Lucía tipeando | «¿Cargar los datos de tu clínica te lleva una tarde?» | — | 0 |
| 2 | 3–20 s | **Pantalla real:** se pega el link de la web y Onia completa nombre, teléfono, dirección, horarios y servicios | «Pegá el link de tu web.» → «Onia te carga nombre, teléfono, dirección, horarios y servicios.» | §8, frase 6 | 0 |
| 3 | 20–28 s | **Pantalla real:** los horarios ya cargados en Configuración | «Si cambian, los cambiás vos. Sin programador.» | ⚠️ **Va solo si la pantalla de Configuración lo muestra** (se MIRA con la cuenta demo); si no, la toma se saca | 0 |
| 4 | 28–31 s | El final del clip pagado: levanta la vista y sonríe | cierre | — | 0 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq. Pegá el link de tu página web y Onia te carga nombre, teléfono,
dirección, horarios y servicios. Funciona con tu web propia, no con Facebook. En todos los planes. Agendá tu demo:
link en la bio.

**Costo: 0 cr.**

---

## Totales y lo que falta

| Pieza | Créditos |
|---|---:|
| K1 | 8,5 |
| K2 | 9,5 |
| K3 | 0 |
| **Total** | **18** |

- Octubre va **22 de 150 cr**. Con las tres pasaría a 40.
- **El gasto lo aprueba Sergio Urcullo** viendo esta tabla. Se cotiza de nuevo en vivo antes de crear.
- **Bloqueo para las tres:** la cuenta demo dental en producción, para grabar las pantallas reales.
- **Antes de renderizar:**
  - `grep` del guion y del pie contra las frases prohibidas de `editor-videos` § Reels de Lucía;
  - comparar con `LUCIA.md` §0;
  - mirar cada pantalla.
