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
  - ⛔ Las tomas de pantalla son el bloqueo. *Corregido el 5-oct:* la cuenta demo «Clínica Demo Onia» SÍ existe desde
    el 2-oct, pero está a medias: sus pacientes no tienen correo y le falta `module.agents` (`PLAN.md` v4 §5).
  - Antes de publicar se abre cada pantalla con sesión y se MIRA (catálogo §8).
- **Un solo cierre** (corregido el 8-oct): «Escríbale a Onia: enlace en la bio». `onia.com.bo/llamada` da 404 (medido el
  5-oct) y Onia ya no tiene Cal.com: el enlace de la bio es la puerta que decida Sergio Urcullo (`PLAN.md` v4 §2, D7).
  Donde las tarjetas o los pies de abajo dicen «Agende su demo» o «Agendá tu demo», se reemplaza por ese cierre.

**Costos medidos el 3-oct con `get_cost`, sin generar:**

| Qué | Modelo y parámetros | Créditos |
|---|---|---:|
| Foto de Lucía con su cara y la prenda | `seedream_v4_5`, 9:16, con el ancla `abe2e6bd` y el ambo `8d138bd6` como referencias | **1** |
| Clip de 6 s desde una foto aprobada | `kling3_0`, `mode: std`, `sound: "off"`, 6 s, 9:16 | **7,5** |
| ⚠️ El mismo clip con `sound: false` | Higgsfield no acepta `false`, lo pasa a `on` | 10,5 |

---

## K1 · Humo vs. real — propuesta de montaje, 6-oct-2026

Fecha: 6-oct-2026. Integrado por madre bajo lease documental; propuesta pendiente de capturas y aprobación.

META: dejar K1 preparado para montaje con material ya pagado.
PRUEBA DE HECHO: cutlist de 34 s, assets identificados, tarjetas de usted de hasta 6 palabras, duración mínima 0,35 s por palabra + 0,3 s y prueba real requerida por toma.
REGLA DE PARADA: entrega de esta instrucción; sin generación, gasto, SSH, publicación ni render final. Los huecos de producto bloquean el master.

Fuentes revisadas: origin/main:hermes-content/references/modelos/lucia/GUIONES-LUCIA-KIT.md (K1 y Material generado); .claude/skills/editor-videos/SKILL.md, sección Reels de Lucía; handoff/higgsfield-lucia.md y v4/PROCEDENCIA.jsonl revisados en primera pasada. Es una adaptación de la pieza existente, no una campaña nueva.

### Assets y entradas

Base de rutas del repo: C:/dev/proyectos/onia-hermes. En el worktree asignado sustituir únicamente esa base; conservar los relativos.

- A1, foto: hermes-content/references/modelos/lucia/v4/kit/k1-1-recepcion-celular-4afffb96.jpg. Existe local: 807038 bytes.
- A2, clip limpio pagado: hermes-content/references/modelos/lucia/v4/kit/k1-clip-mira-camara-e470ef4f.mp4. Existe local: 5586395 bytes. Procedencia registra Kling, 6 s, 9:16, sonido off. Confirmar duración/fps con ffprobe antes de montar; no congelar ni acelerar para completar el remate.
- P1, FALTANTE: captura o grabación de la pantalla vigente con propuesta de texto IA y control real para revisar/aprobar el modelo. Nombres ficticios, sin cuenta de pacientes reales. Dejar visible el contexto de aprobación del modelo, no presentar ese control como confirmación automática de citas.
- P2, FALTANTE: captura o grabación vigente de Pendientes con mensaje listo, nombre y hora ficticios y acción humana de envío. Mostrar la diferencia entre aprobar un modelo y autorizar el envío de una propuesta.
- P1/P2 deben entregarse con fuente, fecha, versión y revisión del dueño de producto. Guardar junto a la pieza en ruta versionada asignada por la madre, nunca depender de capturas ignoradas por Git. Las capturas candidato-20260930 están sin aprobar y no prueban la versión publicada.

### Cutlist exacto

Tiempos en segundos; intervalos [inicio, fin), alineados a 24 fps. La duración indicada incluye entrada de texto. Mantener legibilidad hasta el corte; no añadir una salida que reduzca el mínimo. El rótulo de identidad es una etiqueta independiente de las tarjetas narrativas.

| Inicio | Fin | Duración | Asset y acción | Texto exacto USTED | Palabras | Mínimo | Prueba real / gate |
|---:|---:|---:|---|---|---:|---:|---|
| 0 | 2,5 | 2,5 | A1 estática | ¿La IA confirma sin su aprobación? | 6 | 2,40 | Pregunta, no afirmación de funcionalidad |
| 2,5 | 5 | 2,5 | A1; sello HUMO y golpe causal | Eso es humo. | 3 | 1,35 | Sin promesa de resultado |
| 5 | 8 | 3 | P1; foco en propuesta | La IA propone el mensaje. | 5 | 2,05 | Propuesta real visible |
| 8 | 11 | 3 | P1; foco en texto editable | Usted revisa el modelo. | 4 | 1,70 | Revisión real del modelo |
| 11 | 14 | 3 | P1; foco en aprobación | Y lo aprueba una vez. | 5 | 2,05 | Control real de aprobación; comprobar semántica |
| 14 | 17 | 3 | P2; mensaje con datos ficticios | La IA no ve datos | 5 | 2,05 | Afirmación técnica: validar con catálogo/código, no inferir desde UI |
| 17 | 20 | 3 | P2; misma vista contextual | de sus pacientes. | 3 | 1,35 | Continuación de la frase anterior, no tarjeta autónoma |
| 20 | 24 | 4 | P2; foco en nombre/hora | ONIA coloca nombre y hora. | 5 | 2,05 | Campos reales interpolados visibles |
| 24 | 28 | 4 | P2; mensaje completo y acción humana | El mensaje queda listo. | 4 | 1,70 | Mensaje real preparado, sin simular envío |
| 28 | 31 | 3 | A2, fuente 0–3 s | Usted aprueba antes de enviar. | 5 | 2,05 | No extender a correos automáticos: contexto de propuesta humana |
| 31 | 34 | 3 | A2, fuente 3–6 s | Agende su demo. | 3 | 1,35 | CTA existente, condicionado a destino operativo |

No utilizar «Comentá DEMO», D6, ni una segunda CTA de compartir. No prometer que una IA confirma citas por sí sola. La secuencia sobre privacidad necesita prueba de arquitectura: una pantalla no demuestra qué datos recibe el modelo.

### Pie exacto propuesto para reemplazar K1

Lucía es un personaje hecho con IA por @oniahq. En ONIA, la IA propone el modelo del mensaje con el tono de su negocio. Usted lo revisa y lo aprueba una vez. Los datos de sus pacientes quedan fuera de esa propuesta de IA; ONIA coloca el nombre y la hora en el mensaje que usted revisa antes de enviar. Disponible desde el plan Crece y en la prueba de 14 días. Agende su demo desde el enlace de la bio.

El pie es PROPUESTA, no texto aprobado para publicación. Validar la privacidad, el plan Crece y la prueba de 14 días contra el catálogo y comportamiento vigente antes de incorporarlo al master. Si no se prueban, retirar esas frases de la versión final, sin sustituirlas por otra promesa. Destino heredado: ~~https://onia.com.bo/llamada?src=lucia-k1~~ — da 404 (medido el 5-oct). El destino es el enlace de la bio de `PLAN.md` v4 §2 (D7).

### Montaje y calidad

- Lienzo 1080×1920, 24 fps; 34 s = 816 cuadros. Acento #10C26B. Método editor-videos, sin placas PIL ni pipeline improvisado.
- Primera tarjeta desde t=0, plenamente legible antes de 0,15 s. Etiqueta «Lucía · personaje IA de Onia» desde t=0 en franja segura. No convertir el ambo en una credencial profesional.
- Medir mentón máximo en todo A2 y encuadre A1: tarjetas entre mentón máximo +40 px y y=1490. Bajo y=1000, evitar los 80 px derechos. Si no caben, reducir el panel o repartir texto; no tapar cara ni cortar coronilla.
- Sello HUMO: 130%→100% en 3 cuadros; golpe de zoom +3% durante 5 cuadros, mismo instante 2,5 s. No zoom decorativo; no escalar fuente 720p ×1,5. En cierre, movimiento suave ≤1,04 si no compromete encuadre.
- P1/P2: recorte focal legible y crédito «pantalla real de ONIA»; nunca dibujar controles o estados para completar la evidencia. Un cambio de foco cada 1,5–3 s puede guiar la lectura sin sumar tarjetas ni alterar las duraciones. No repetir clicks ni hacer parecer ejecutado un envío.
- D4 pendiente: sin voz, sin TTS ni audio generado, sin música de cama. Si la madre decide incorporar SFX locales en edición: solo por cambio visible de tarjeta, pico ≤−3 dBTP, sin loudnorm. Esta entrega no crea ni selecciona audio.
- QA de identidad previo registrado, no vuelto a medir: foto 0,808; clip 0,68–0,79 en cuadros con caras pequeñas, aprobado visualmente en procedencia. Antes del master, mirar todo A2 y los cortes: manos, rostro, ambo, textos inventados, deformaciones y transiciones. No pedir regeneración automáticamente.
- Revisar ortografía y ausencia de voseo; grep contra «soy doctora», «odontóloga», «mis pacientes», «mi consultorio», «agenda llena», «cero ausencias» y porcentajes prometidos. Interpretar el contexto para no rechazar este documento por enumerar prohibiciones.
- Entrega futura de edición: tabla de cortes ejecutada, preview 360p y QA visual de primer cuadro, cada transición y último cuadro. Preview no equivale a aprobación ni autoriza publicación.

### Faltantes concretos y orden reproducible

1. Propuesta integrada en este guion canónico. Antes de editar, asignar worktree y rutas de producción; no crear otro guion paralelo.
2. Dueño de producto entrega P1 y P2 con evidencia de versión y datos ficticios; valida privacidad y semántica de las dos aprobaciones. No se solicita acceso SSH ni se rodea Production Reads.
3. Verificar A2 con ffprobe y encuadre completo; medir zona libre de cara para ubicar texto.
4. Montar respetando esta tabla con editor-videos; preservar los assets existentes. Si falta P1 o P2, queda PREPARADO/BLOQUEADO, no reel final.
5. Verificar 816 cuadros, once tarjetas ≤6 palabras, todos los mínimos y trato de usted; pasar revisión de producto y preview antes de solicitar aprobación de publicación.

Costo nuevo: 0 créditos. Cuenta/etiqueta IA, D2–D6 y permisos de publicación conservan su estado; esta propuesta no los decide. Alcance ejecutado: planificación/copy/QA de consistencia sin agentes adicionales.


### QA de assets K1 — medición6-oct, propuesta de encuadre

- A1 confirmado1440×2560. A2 confirmado720×1280,24fps,145cuadros,6,041667s, sin audio. La procedencia6s era redondeada.
- Remate28–34s: usar cuadros0–143 (144cuadros=6s); excluir144, corteinterno72. No acelerar/congelar/upscale1.5×.
- QA visual del carril:12cuadrosmuestreados completos yrecortes rostro/manos, másA1. No deformación gruesa evidente en muestra; dedos ocluidos. No inspección exhaustiva ni aprobación biométrica.
- Propuesta conservadora: A2nativo720×1280 en lienzo1080×1920,x180/y80; A1reducida igual. Paneltarjetasx84/y1100,912×340,finaly1440,margenderecho84. Probar continuidad/estética en preview antes de adoptar ese encuadre.
- Fit calculado con BricolageBold68px/816px útiles: las11tarjetas caben, máximolínea596px. El renderer debe medir de nuevo; fit noaprueba identidad/legibilidadfinal.
- Evidencia reproducible temporal: `C:/Users/PC/.codex/tmp/lucia-k1-a2-contactsheet.jpg`, `lucia-k1-a2-cara-manos.jpg`, `lucia-k1-a1-preview.jpg`, `lucia-k1-caption-layout.jpg`, `lucia-k1-caption-widths.json`. Regenerar con ffmpeg existente al preparar preview; caja verde es guía, nunca master.
- P1/P2,validaciónprivacidad,plan/CTA y aprobaciónpreview siguen pendientes; nada publicado ni renderizado como master.

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

## K4 · Las reglas de la recepción (opción, formato «reglas → giro → CTA»)

**De dónde sale el formato:** `references/video-intake/2026-10-03-reels-genjutsu-y-fiesta-ia.md` §2, el reel de
@ugc.studio.ia «Nadie en esta fiesta es real» (89 s, 1.741 likes). Un personaje IA se ríe de los defectos de la IA
(«reglas»), viene un giro y cierra con un CTA, con un subtítulo de UNA palabra por toma.

**Qué cambia para Lucía:**
- **El humor sale de que TODOS saben que es IA.** Nada de «no le digas a nadie».
- **El giro** es la pantalla real de Onia: quien trabaja de verdad es el sistema.
- **De la fiesta universitaria no se toma nada:** se toma la estructura y pasa a la recepción.
- **La regla 3 convierte el límite de D1 en chiste:** ella no atiende a nadie; el ambo es vestuario.

**La pieza:**
- **Plano:** la recepción de K1.
- **Vestuario:** ambo terracota.
- **Duración:** 35 s, sin voz (D4). Lleva la palabra de la toma en grande y una línea corta debajo.

| # | Tiempo | Imagen | Palabra · línea | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–4 s | Foto: Lucía detrás del mostrador, saluda a cámara | **REGLAS** · «Soy IA. Acá todos lo saben. Y hay reglas.» | IA declarada | 1 |
| 2 | 4–8 s | **Clip:** levanta la mano y cuenta los dedos, divertida | **CINCO** · «Regla 1: cinco dedos. Los cuento siempre.» | Defecto típico de la IA, dicho como chiste | 7,5 |
| 3 | 8–11 s | Foto: una taza de café llena junto al teclado; ella la mira | **CAFÉ** · «Regla 2: el café se queda en la taza.» | Límite físico (manual §2) | 1 |
| 4 | 11–15 s | Foto: Lucía de cuerpo entero con el ambo, mostrando la ropa | **NADIE** · «Regla 3: no atiendo a nadie. El ambo es vestuario.» | `LUCIA.md` §0 (D1) | 1 |
| 5 | 15–19 s | Foto: Lucía señala la pantalla del mostrador (acercamiento) | **GIRO** · «¿Querés ver quién trabaja de verdad acá?» | — | 1 |
| 6 | 19–31 s | **Pantalla real:** Pendientes del día, luego el correo de recordatorio | **ONIA** · «A las 7 revisó tu agenda y tus cobros.» → «Nada sale sin que vos lo apruebes.» → «El recordatorio por correo sale solo: 24 h y 2 h antes.» | §2 · §8, frase 3 | 0 |
| 7 | 31–35 s | La foto 1 otra vez, con zoom | cierre: «Mandáselo a quien contesta tu WhatsApp» · «Agendá tu demo» | — | 0 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq: lo sabe ella, lo sabés vos y lo sabe la recepción. Quien
trabaja de verdad es el sistema: todas las mañanas Onia revisa tu agenda y tus cobros y te deja anotado a quién
escribirle, con el mensaje listo, y nada sale sin que vos lo apruebes. El recordatorio de cita por correo sale solo,
24 h y 2 h antes. Desde el plan Crece y en la prueba de 14 días. Agendá tu demo: link en la bio.

> ⛔ **Correcciones del 8-oct (verificación adversarial del plan v4); mandan sobre la tabla y el pie de arriba:**
> - **Toma 5:** «¿Quiere ver qué hace Onia en una recepción?». «Quién trabaja de verdad acá» da a entender una
>   recepción real donde Onia ya trabaja, y hay 0 clientes. La recepción es generada.
> - **Pie:** sin «y lo sabe la recepción», por lo mismo.
> - **Toma 6:** solo Pendientes («A las 7 revisó su agenda y sus cobros.» → «Nada sale sin que usted lo apruebe.»).
>   - La frase del correo entra recién cuando exista la captura CORREO: los pacientes de la demo no tienen correo.
>   - Si la demo no muestra Pendientes, K4 no sale: no se cambia la pantalla por otra sin cambiar el texto.
>   - **Recorte focal** solo en las filas de cobro, confirmación y 6 meses sin volver. Ninguna fila «tratamiento a
>     medias» ni la pestaña «A medias» en cuadro: la demo trae 2 sembradas y el catálogo §8 lo prohíbe.
> - **Toma 7:** un solo cierre, el de la línea 38 de este archivo.
> - **Trato:** de usted, como el cutlist de Codex del 6-oct (`v4/kit/k3-k4-entrega-20261006.md`).

**Costo, cotizado con `get_cost` el 3-oct sin generar nada:**
- **Corta: 11,5 cr.** Son 4 fotos de 1 cr y 1 clip de 7,5 cr (solo los dedos, el único chiste que necesita
  movimiento).
- **Completa: 26,5 cr.** Las tomas 1 y 5 también pasan a clip: 4 fotos (4 cr: la de arranque de las tomas 1 y 2, la
  de arranque de la 5 y las tomas 3 y 4) y 3 clips (22,5 cr). En la corta, el clip 2 sale de la foto 1.
- **Recomendación: la corta.** El original rinde por la idea, no por la cantidad de planos.
- ⚠️ **Riesgo propio de este formato:** el clip de los dedos puede salir con 4 o 6 dedos. En el original eso ES el
  chiste, pero acá la línea dice «los cuento siempre». Se mira cuadro por cuadro. Si los dedos fallan, se cambia el
  texto a «a veces me sobra uno» o se rehace (7,5 cr más). No se publica con un error que contradiga el texto.

---

## ✅ Material generado (3-oct, con el OK de Sergio Urcullo)

Todo está en `references/modelos/lucia/v4/kit/` y el detalle (jobs, puntajes, veredictos) en `v4/PROCEDENCIA.jsonl`, fila
`kit_lucia_generacion`. Para revisar de un vistazo: `kit-fotos-hoja.jpg` y `kit-clips-preview.mp4`.

| Toma | Archivo | Identidad | Notas |
|---|---|---:|---|
| K1 · 1 | `k1-1-recepcion-celular-4afffb96.jpg` | 0,808 | Es además la prueba de ropa: el ambo coincide con el maniquí |
| K1 · clip | `k1-clip-mira-camara-e470ef4f.mp4` | 0,68–0,79 | Las caras son chicas (~118 px) y se miraron: es ella |
| K2 · 1 | `k2-1-cafe-mostrador-3e05cfd0.jpg` | 0,829 | — |
| K2 · 2 | `k2-2-agenda-papel-1422fa94.jpg` | — | Sin persona; la letra de la agenda no se lee |
| K2 · clip | `k2-clip-deja-cafe-83130c4a.mp4` | 0,70–0,79 | Deja el café sin tomarlo |
| K4 · 1 | `k4-1-saluda-eddca486-recorte.jpg` | 0,81 | Recortada por encima del mostrador. La primera versión se descartó por un letrero inventado en una torre |
| K4 · clip | `k4-clip-cuenta-dedos-338b751f.mp4` | 0,73–0,81 | 5 dedos en los 9 cuadros revisados del conteo |
| K4 · 3 | `k4-3-cafe-teclado-186c82f0.jpg` | 0,841 | — |
| K4 · 4 | `k4-4-cuerpo-entero-cb86ea10.jpg` | 0,851 | Hay un folleto chico con letra en el borde izquierdo: se recorta al editar |
| K4 · 5 | `k4-5-senala-342c0ab5.jpg` | 0,835 | El monitor no muestra pantalla |

- **Gasto:** 30,5 cr (29,5 aprobados más 1 por rehacer K4 · 1). Octubre va **52,5 de 150 cr**.
- **Lo que falta para armar los reels:** las pantallas REALES de Onia, que salen de la cuenta demo. Se editan con
  `editor-videos`.

## Totales y lo que falta

| Pieza | Créditos |
|---|---:|
| K1 | 8,5 |
| K2 | 9,5 |
| K3 | 0 |
| **Total K1–K3** | **18** |
| K4, opción corta (o completa) | 11,5 (26,5) |

- *(Cotización del 3-oct, antes de generar; hoy octubre va 52,5 de 150 cr.)* Octubre iba **22 de 150 cr**. Con K1–K3
  pasaba a 40; si además iba K4 corta, a 51,5.
- **El gasto lo aprueba Sergio Urcullo** viendo esta tabla. Se cotiza de nuevo en vivo antes de crear.
- **Bloqueo para las tres:** las pantallas reales de la cuenta demo (existe; le falta el correo confirmado y
  `module.agents`, y K1/K2 piden escribir en producción con OK).
- **Antes de renderizar:**
  - `grep` del guion y del pie contra las frases prohibidas de `editor-videos` § Reels de Lucía;
  - comparar con `LUCIA.md` §0;
  - mirar cada pantalla.
