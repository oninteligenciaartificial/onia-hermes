# Plan de verificación de G-05 y G-06 con la cuenta demo (lun 12-oct)

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING (tarea 2).** Nada se crea en Meta, no se gasta, no se contacta a nadie. Lo que sigue es un **plan para mirar**, no un resultado: ninguna de las dos filas está verificada.
> Fuentes: `ONIA_PROMESA_VS_PRODUCTO.md` (filas G-05 y G-06 con los umbrales y el «Código: archivo:línea» que dejó Codex, contrato V01, de `onia-platform` a7d8c1ed; **corroborados por lectura del código el 12-oct en a7d8c1ed y master 1c01e05f, sin prueba de demo ni producción**), `ONIA_CATALOGO_DE_VENTA.md` §2 y §8, `docs/platform/ONIA_AGENTES_SEED_RUNBOOK.md` (el seed del recall, **anterior a la 1.0**: cuando solo existían los agentes de recall y cobro).

## 0. Qué decide cada fila

| Fila | Qué dice | Qué piezas dependen | Si queda en ⬜/❌ |
|---|---|---|---|
| **G-06** Agente «Confirma citas» | Las citas de **mañana** sin confirmar aparecen en `/pending` con el mensaje listo | **G1-1, G1-3, G1-4 y G1-5** (las cuatro que entran): las cuatro dicen «quién tiene cita mañana y no confirmó» | **No sale ninguna de las cuatro.** Es la fila que más pesa del go/no-go |
| **G-05** Agente «Vuelve a citar» | Quien **no vuelve hace meses** y no tiene próxima cita aparece en `/pending` con el mensaje listo | **Solo G1-2** («Paciente que hace meses no vuelve») | G1-2 espera a la tanda 2; no frena la prueba 1 |

**Umbrales del código (V01 corroborado el 12-oct; demo por verificar):** G-05 = al menos **180 días** desde la última cita **COMPLETADA** y **sin cita futura** PENDIENTE o CONFIRMADA. G-06 = **mañana** (día calendario en la **zona horaria del negocio**), estado **PENDIENTE**; cooldown de contacto de **1 día**.

## 1. Quién, con qué y qué falta

| Falta | Quién lo destraba | Nota |
|---|---|---|
| La **cuenta demo** refrescada con datos (lun 12-oct) | **Plataforma** | Ventas y pauta no la tiene: sin `ONIA_QA_EMAIL` ni `ONIA_QA_PASSWORD` en el entorno de la nube |
| Credenciales de prueba, o alguien con la PC y Chrome | **Sergio Urcullo** (las pone) **la madre** coordina el puente autorizado; **el worker** mira con su propio acceso | `grabar-captura.mjs` solo acepta una cuenta cuyo correo lleve «qa», «demo», «prueba» o «test» como palabra; contraseña por entorno, **nunca por el chat** |
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

- **El agente «Confirma citas» existe en ambos commits de código leídos:** `agents-logic.ts:834` y `agents-runtime.ts:205,693,1798-1822`; corroborado el 12-oct. La release ejecutada y el resultado real de la demo siguen sin verificar.
- **Cómo se dispara el agente en la demo** (botón o servidor): lo dice Plataforma.
- **El idioma de la plantilla guardada en la demo:** no se verificó. El fallback actual de confirmación está de usted (`agents-logic.ts:882-896`: «Le recordamos», «¿Nos confirma?», «díganos»). No inferir de ese fallback el texto de una plantilla ya aprobada/guardada; G-11 y la decisión sobre la plantilla demo siguen pendientes.


## 7. Cotejo de código y condiciones de la próxima prueba — 12-oct-2026

META: cerrar la brecha de código declarada en §6 y preparar G-05/G-06; no reabrir V01 ni investigar anuncios de nuevo. PRUEBA: lectura directa del producto y comparación de dos commits, QA independiente de las reglas; no ejecutar agentes ni cambiar estados de venta. PARADA: sin producto, seed, aprobación/envío, gasto, campañas, producción o instalación.

**Refs comprobados:** `onia-platform` base V01 `a7d8c1ed3ffa2b2152d25e3e2ccd5407ffaee897` y master observado `1c01e05ff3457692f44352de19d57768d5955bcf` (42 commits adelante). `lib/onia-core/modules/agents-logic.ts` conserva blob `e23b17a0517864a76ed865628b0fe61dfcf6b4f9` en ambos. `agents-runtime.ts` cambió de `1c4bea4a52c8fcab6a67b3bb131721a310058e2b` a `cd4ca46452f4bb8ad74bdb6245490d3c28db1a75`: cinco textos de próxima acción pasaron a usted; las reglas G-05/G-06 no cambiaron. Esto prueba código del repo, **no la release desplegada**.

| Regla corroborada | Evidencia en master | Corrección para la demo |
|---|---|---|
| G-05: al menos 180 días completos transcurridos, no seis meses calendario | `agents-logic.ts:394-397,423-448`; `agents-runtime.ts:153-163` | Fijar `now` y fecha/hora exactos en fixtures 179/180; registrar timestamps y cooldown de 30 días |
| G-05: última visita COMPLETADA; sin futura PENDIENTE/CONFIRMADA | `agents-runtime.ts:442-477` | No reutilizar al paciente de mañana como R1: su cita futura lo excluye; R4 sin COMPLETADA no es positivo |
| G-05: baja/opt-out, contacto reciente o teléfono inválido pueden excluir | `agents-logic.ts:435-441`; `agents-runtime.ts:447-448,1967-1982` | Positivos activos, sin opt-out, sin contacto dentro del cooldown y con teléfono ficticio propio válido; controles separados para cada exclusión |
| G-06: mañana en calendario del negocio, PENDIENTE; cooldown de un día transcurrido | `agents-logic.ts:802-864`; `agents-runtime.ts:205-214,693-733` | Registrar zona real de la organización; conservar extremos 00:30/23:30 y controles hoy/pasado mañana/CONFIRMADA |
| Feed de 48 horas es un superconjunto; luego se recorta a mañana | `agents-runtime.ts:685-733`; `agents-logic.ts:847-856` | No ampliar la promesa a «próximas 48 horas» |
| Corrida está sujeta a habilitación, intervalo, límites y deduplicación | `agents-runtime.ts:1352-1376,2126-2129` y recorrido de ejecución | Registrar agente habilitado, plan/flags y resultado de corrida. Segunda corrida inmediata puede ser `not_due`: no atribuir automáticamente al cooldown |

Los evaluadores puros permiten argumentos de umbral; el runtime leído les pasa los valores de `AGENT_KINDS` (180/30/1). No se observó un override por organización de esos umbrales. El intervalo del agente existente sí puede diferir de 1440 minutos. Registrar configuración real antes de interpretar una ausencia de propuesta.

El seed actual contiene la cita del ejemplo a las 10:00 de mañana en código. **No prueba** que la demo se haya sembrado/refrescado ni cubre por sí solo 179/180 y extremos horarios. Platform prepara datos y ejecución bajo su contrato; Ventas observa.

**Acceso pendiente, coordinación autorizada por Sergio Urcullo el 12-oct:** Madre Desarrollo coordina acceso autorizado al dominio de la app y puente de cuenta QA/demo dedicada, sin claves por chat ni traslado de sesiones. El worker comprobó HTTP CONNECT 403 en la app y ausencia de bindings QA. Las madres solo coordinan/revisan; el worker ejecuta la observación. No hay herramienta disponible aquí para enviar mensajes a otros hilos: este pedido queda en el documento y en el transcript para las madres, sin afirmar entrega/ACK externo.

**Pruebas existentes identificadas, no ejecutadas:** `npm test -- lib/onia-core/modules/agents-logic.test.ts lib/onia-core/modules/agents-runtime.test.ts` en el producto. Falta checkout del producto y Vitest disponible; no se instalaron dependencias. La comprobación de código no sustituye esos tests ni la demo.

**Estado de venta se conserva:** G-05 y G-06 siguen ⬜; G-06 bloquea cuatro piezas y G-05 solo G1-2. El siguiente resultado debe incluir observaciones/capturas de la demo y release real. No publicar ni re-renderizar piezas con una fila no verificada.
