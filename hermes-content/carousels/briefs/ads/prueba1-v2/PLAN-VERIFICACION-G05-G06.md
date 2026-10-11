# Plan de verificación de G-05 y G-06 con la cuenta demo (lun 12-oct)

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING (tarea 2).** Nada se crea en Meta, no se gasta, no se contacta a nadie. Lo que sigue es un **plan para mirar**, no un resultado: ninguna de las dos filas está verificada.
> Fuentes: `ONIA_PROMESA_VS_PRODUCTO.md` (filas G-05 y G-06 con los umbrales y el «Código: archivo:línea» que dejó Codex, contrato V01, de `onia-platform` a7d8c1ed; **no verificados contra el repo del producto desde aquí**), `ONIA_CATALOGO_DE_VENTA.md` §2 y §8, `docs/platform/ONIA_AGENTES_SEED_RUNBOOK.md` (el seed del recall, **anterior a la 1.0**: cuando solo existían los agentes de recall y cobro).

## 0. Qué decide cada fila

| Fila | Qué dice | Qué piezas dependen | Si queda en ⬜/❌ |
|---|---|---|---|
| **G-06** Agente «Confirma citas» | Las citas de **mañana** sin confirmar aparecen en `/pending` con el mensaje listo | **G1-1, G1-3, G1-4 y G1-5** (las cuatro que entran): las cuatro dicen «quién tiene cita mañana y no confirmó» | **No sale ninguna de las cuatro.** Es la fila que más pesa del go/no-go |
| **G-05** Agente «Vuelve a citar» | Quien **no vuelve hace meses** y no tiene próxima cita aparece en `/pending` con el mensaje listo | **Solo G1-2** («Paciente que hace meses no vuelve») | G1-2 espera a la tanda 2; no frena la prueba 1 |

**Umbrales del código (V01, por verificar):** G-05 = al menos **180 días** desde la última cita **COMPLETADA** y **sin cita futura** PENDIENTE o CONFIRMADA. G-06 = **mañana** (día calendario en la **zona horaria del negocio**), estado **PENDIENTE**; cooldown de contacto de **1 día**.

## 1. Quién, con qué y qué falta

| Falta | Quién lo destraba | Nota |
|---|---|---|
| La **cuenta demo** refrescada con datos (lun 12-oct) | **Plataforma** | Ventas y pauta no la tiene: sin `ONIA_QA_EMAIL` ni `ONIA_QA_PASSWORD` en el entorno de la nube |
| Credenciales de prueba, o alguien con la PC y Chrome | **Sergio Urcullo** (las pone) o **la madre** (mira con su login) | `grabar-captura.mjs` solo acepta una cuenta cuyo correo lleve «qa», «demo», «prueba» o «test» como palabra; contraseña por entorno, **nunca por el chat** |
| **Cómo se corre el agente en la demo** | **Plataforma** | En producción corre a las 07:00 de La Paz por un cron del VPS (`GET /api/cron/onia-agents` con `CRON_SECRET`, que está en el servidor y **no** en la nube). Hay que decir cuál de las dos vías vale en la demo: un botón o un disparo manual en el servidor |
| El **log del cron** del VPS (para G-04, «corre solo cada mañana») | Quien tenga el VPS | Es la fila hermana: G-04 ⬜ «corre solo, falta el log». Se mira junto con esta |

## 2. Datos que la demo necesita (todos ficticios; Plataforma los carga, la grabación **no escribe**)

La persona de las piezas es **Martín Arteaga Rojas**: tiene que ser **la misma en la agenda y en Pendientes**.

| Id | Dato | Debe pasar | Para qué |
|---|---|---|---|
| **C1** | Cita de **mañana** 10:00, **PENDIENTE** (sin confirmar), Martín Arteaga Rojas, con teléfono | **Aparece** en `/pending` | G-06 (caso feliz) y la tarjeta de G1-1, G1-3, G1-4 y G1-5 |
| **C2** | Cita de mañana, **CONFIRMADA**, otro paciente | **No** aparece | G-06 control: «una ya confirmada no genera propuesta» |
| **C3** | Una cita **de hoy** y otra **de pasado mañana**, ambas sin confirmar | **No** aparecen | G-06 borde: el umbral es mañana, no «próximos días» |
| **C4** | Cita de mañana a las **23:30** (hora del negocio) y otra a las **00:30** | **Aparecen las dos** | G-06 zona horaria: 23:30 en La Paz ya es el día siguiente en UTC; si falla una, el agente cuenta por UTC y «con un día de margen» es mentira |
| **R1** | Paciente con última cita **COMPLETADA hace 220 días** y sin cita futura | **Aparece** | G-05 (caso feliz). El seed del runbook ya trae uno (Rosa Fernández) |
| **R2** | El mismo caso, pero con una cita futura PENDIENTE o CONFIRMADA | **No** aparece | G-05 control: «uno con cita futura no aparece» |
| **R3** | Última completada hace **179** días y otro con **180** | 179 **no**; 180 **sí** | G-05 umbral: «al menos 180 días» |
| **R4** | Paciente solo con citas canceladas o «no asistió» hace 220 días | **Observación**: anotar qué hace, no es condición | El código mide «última COMPLETADA»; la pantalla debe decir algo coherente |

**Plan de la cuenta:** la prueba de 14 días (plan Profesional) o Crece en adelante. El catálogo §8 dice que «cada mañana» vale desde Crece y en la prueba; en Básico los agentes no están.

## 3. Qué mirar, en qué orden, sin un solo clic de envío

| # | Pantalla | Qué hacer | Captura | Qué tiene que verse |
|---|---|---|---|---|
| 1 | `/agenda` (fecha de mañana) | Mirar C1, C2, C3 y C4 | `G06-agenda-manana.png` | C1 con el chip **«Sin confirmar»** (también cubre **B-02**) y C2 «Confirmada» |
| 2 | `/agents` | Mirar los agentes «Confirma citas» y «Vuelve a citar» encendidos y su plantilla | `G05-G06-agents.png` | Los dos agentes visibles; el texto de la plantilla (G-11) |
| 3 | Disparar el agente (**lo hace Plataforma**) | Una vez para toda la org demo | — | — |
| 4 | `/pending` | Mirar qué propuestas hay y de quién | `G06-pending.png` y `G05-pending.png` | **C1 sí; C2 y C3 no; C4 las dos.** **R1 sí; R2 y R3-179 no; R3-180 sí** |
| 5 | La fila de C1 | Mirar el mensaje | `G06-fila-cita-manana.png` | «Cita de mañana a las 10:00 sin confirmar» con el nombre de Martín Arteaga Rojas y «No se envía hasta que lo apruebes» |
| 6 | La fila de R1 | Mirar el mensaje | `G05-fila-vuelve.png` | «Última visita hace N meses» y el mensaje listo |
| 7 | Disparar de nuevo el mismo día | Mirar `/pending` | `G06-segunda-corrida.png` | **Observación del cooldown:** ¿se repite la propuesta de C1? Anotar; no es condición de ✅ |

**Quién hace cada paso:** 1, 2, 4, 5, 6 y 7 los mira quien tenga el login; 3 lo dispara Plataforma; los datos de §2 los carga Plataforma. `grabar-captura.g05-g06.plan.json` (en `.claude/skills/onia-ventas-pauta/scripts/`) hace las fotos de 1, 2 y 4 sin tocar nada; para el 7 se vuelve a correr con otra carpeta de salida después del segundo disparo. **Probado el 11-oct contra una página local (los 14 pasos y las 4 fotos); la app real no se probó**: los selectores hay que ajustarlos mirando la demo.

**Lo que NO se hace en esta verificación:** ningún clic en «Aprobar», «Enviar yo mismo por WhatsApp» ni «Descartar» (G-01 y G-03 son otras filas y un clic puede mandar un mensaje de verdad); ningún dato real de un cliente; nada en una cuenta que no sea la demo.

## 4. Qué valor hace pasar cada fila a ✅

| Fila | Pasa a ✅ cuando… | Pasa a 🟡 | Pasa a ❌ |
|---|---|---|---|
| **G-06** | C1 aparece **una vez**, con el nombre, la hora y el mensaje listo; **C2 y C3 no aparecen**; C4 aparece las dos veces | Aparece C1 pero falla C4 (cuenta por UTC) o aparece también C3 (ventana más ancha que «mañana») | C1 no aparece tras disparar el agente |
| **G-05** | R1 aparece con su mensaje; **R2 y R3-179 no**; R3-180 sí | Aparece R1 pero el umbral no es 180 (p. ej. 6 meses calendario o 90 días): se corrige el texto «hace meses» antes de que G1-2 diga nada más preciso | R1 no aparece |

Si una fila queda en 🟡 o ❌, **se anota con la captura y la pieza que depende de ella espera**; no se corrige el anuncio para que «encaje».

## 5. Qué se hace después (en este orden)

1. **Quien mira** edita la fila en `ONIA_PROMESA_VS_PRODUCTO.md` (estado, fecha, ruta de la captura) y recalcula los conteos del §1 de ese archivo.
2. **Ventas y pauta** recaptura `fila-cita-manana.png` y `fila-vuelve.png` en `briefs/assets/prueba1-v2/` y re-renderiza las piezas con `replica-render.mjs` (media hora), mirando a 390 px.
3. Si **G-05 ✅**: G1-2 entra a la campaña **solo si se decide antes de crear** (`CAMPANA-1-LISTA-PARA-CREAR.json`, `creacion_si_G05_en_verde`); agregarlo con la campaña viva es una edición significativa.
4. Si **G-06 no llega a ✅**: se avisa a la madre el mismo día; las cuatro piezas esperan y la fecha del 16-oct se corre.

## 6. Lo que este plan no sabe

- **Si el agente de «Confirma citas» existe en el código de la 1.0:** el runbook del seed (anterior) habla solo de recall y cobro. V01 cita `agents-logic.ts:834` y `agents-runtime.ts:693` para G-06, pero no se leyó el repo del producto desde aquí.
- **Cómo se dispara el agente en la demo** (botón o servidor): lo dice Plataforma.
- **El idioma del mensaje por defecto:** la plantilla del producto está en voseo («confirmás», «decinos»). No es condición de G-05 ni de G-06; es la decisión pendiente de Sergio Urcullo sobre la plantilla de la demo y de G-11.
