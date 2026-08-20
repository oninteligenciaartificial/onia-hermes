# Tipos de cambio en Bolivia — qué usa cada organismo y qué le falta al core

- **Fecha:** 2026-07-30
- **Carril:** fiscal Bolivia / onia-core
- **Origen:** apunte manuscrito de Sergio en la reunión CAINCO del 2026-07-27 —
  *"función para muchos tipos de cambio / se registra el último t/c"*, *"perfeccionar
  funciones de t/c"*, *"analizar financieramente qué t/c tomar para cerrar la contabilidad
  mensual"*.
- **Docs relacionados:** `hermes-content/docs/ONIA_REUNION_CAINCO_20260727.md` (§4 lista las
  funciones candidatas) · `onia-core/logic/fx.logic.mjs` · `onia-core/modules/imports.*` ·
  `onia-core/modules/invoicing.*`
- **Alcance:** investigación + diagnóstico + propuesta. **No se modificó código.**

> **Advertencia de uso.** Este documento cita norma y fecha en cada afirmación, pero **no es
> asesoría contable**. Antes de configurar la política de tipo de cambio de un cliente real,
> validar con contador matriculado. Los puntos marcados `[SIN FUENTE CONFIRMADA]` en la §5
> son huecos reales, no detalles.

---

## 1. Resumen ejecutivo

1. **Una empresa boliviana que importa maneja hoy al menos TRES tipos de cambio distintos y
   legalmente obligatorios a la vez**, y no coinciden: Aduana usa el **de venta de la semana
   anterior**, el SIN usa el **TCO del día de la transacción**, y la contabilidad usa el de
   la fecha de cada transacción más uno de cierre. Usar el equivocado es contingencia fiscal.
2. **Aduana y SIN se separaron el 17-jul-2026.** La RND 102600000026 sacó del ámbito fiscal
   la referencia al "tipo de cambio de venta" que Aduana sigue aplicando por el DS 25870.
   Desde esa fecha, la MISMA importación se nacionaliza a un TC y se factura a otro.
3. **El core no modela nada de esto.** No existe entidad ni tabla de tipos de cambio: hay dos
   columnas sueltas (`exchange_rate_bob`, `tco_used`) y una constante hardcodeada. El TC es la
   única variable de negocio del core sin tabla versionada por fecha, mientras aranceles e
   impuestos sí la tienen.
4. ~~**Hay un bug de plata en producción potencial:** `officialRate()` cae en silencio al
   histórico **6,96** cuando no recibe TCO.~~ **ARREGLADO 2026-07-31.** `officialRate()` ahora
   **lanza** si no recibe un TCO válido, y `invoiceTotalInBob()` corta antes de declarar una
   factura en moneda extranjera sin TCO. El 6,96 queda sólo como constante histórica
   (registros anteriores al 26-jun-2026) y como fallback **opt-in explícito**, nunca por
   defecto. 521/521 tests del core verdes. El producto todavía **no** había portado esta
   lógica, así que el arreglo es preventivo — pero el manifest anti-drift
   (`PORTABLE_ARTIFACTS.json`) ya cambió de hash, que es la señal para re-portar.
5. **Esto es estructura de toda empresa importadora, no un pedido de un cliente.** Es
   candidata legítima a núcleo del producto, y hoy es el hueco más grande entre lo que Onia
   promete a una importadora y lo que efectivamente hace.

---

## 2. Mapa: qué tipo de cambio usa cada organismo

### 2.1 Cuadro comparativo

| Organismo | Qué TC | De qué FECHA | Norma | Vigencia |
|---|---|---|---|---|
| **Aduana (ANB)** | Oficial de **VENTA** del BCB | **Último día hábil de la SEMANA ANTERIOR** a la aceptación de la declaración | DS 25870 Art. 20 | Desde 11-ago-2000; TC flexible aplicado desde **4-jul-2026** |
| **SIN (facturación ME)** | **TCO** (publicación oficial BCB) | **Fecha de la transacción** | RND 102600000026, Art. único (modifica ¶IX Art. 25 RND 102100000011) | Desde **17-jul-2026** |
| **BCB (fuente)** | TCO = promedio ponderado de **COMPRA**; venta = techo referencial TCO + Bs 0,10 | Publicado **20:00 de cada día hábil, rige el día siguiente** | RD BCB 88/2026 + RM 245/2026 (MEFP) | Desde **29-jun-2026** |
| **Contabilidad** | TC de la fecha de cada transacción; diferencias al cierre | Transacción + cierre de ejercicio | NC 6 (Decisión N° 7, CTNAC) | Desde 13-ene-1987 / CAUB 30/94 (16-jun-1994) |

### 2.2 Aduana Nacional — el TC de la DUI

**Norma:** Decreto Supremo N° 25870, *Reglamento a la Ley General de Aduanas*, de **11 de
agosto de 2000**, **Artículo 20 (Determinación de la Base Imponible)**. Texto literal:

> "Para efectos aduaneros y cálculo de la base imponible, los valores expresados en moneda
> extranjera deberán ser convertidos en moneda nacional al tipo de cambio oficial de venta en
> el Banco Central de Bolivia, vigente al último día hábil de la semana anterior de la fecha
> de aceptación de la declaración de mercancías por la Administración Aduanera."

Tres cosas que hay que leer con cuidado, porque cada una es una regla de sistema distinta:

1. **Es el de VENTA**, no el TCO de compra. Con el régimen actual, el "de venta" es el techo
   referencial (TCO + hasta Bs 0,10). Ver el hueco en §5.1.
2. **Es de la SEMANA ANTERIOR, no del día.** Concretamente: el último día hábil de la semana
   previa a la aceptación. Esto congela el TC de toda una semana de nacionalizaciones —
   y significa que en una semana de suba, el importador nacionaliza a un TC más barato que el
   del día (y al revés en una de baja).
3. **La fecha que manda es la de ACEPTACIÓN de la declaración**, no la del embarque, ni la de
   la factura del proveedor, ni la del pago. `DS 25870 Art. 6`: *"Se entiende aceptada la
   declaración de mercancías en el momento de materializarse la numeración de la misma, por
   medio manual o informático."* Es decir: **el hecho generador es la numeración de la DUI.**

**Transición 2026 (confirmada por comunicado de la ANB de 27-jun-2026):** las declaraciones
aceptadas **hasta el viernes 3-jul-2026** se liquidaron a Bs 6,96. Desde el **sábado
4-jul-2026** rige el TC oficial del BCB bajo la regla de la semana anterior. Efecto práctico:
mercadería en tránsito comprada a 6,96 se nacionalizó a ~11, y el salto fue directo al costo.

### 2.3 Servicio de Impuestos Nacionales — facturación en moneda extranjera

**Norma:** RND N° **102600000026**, de **17 de julio de 2026**. Modifica el **Parágrafo IX del
Artículo 25** de la RND N° 102100000011 (Sistema de Facturación).

**Qué obliga:** toda factura, nota fiscal o documento equivalente sujeto a IVA cuya operación
se realice en dólares u otra moneda extranjera debe registrar **obligatoriamente el TCO
vigente a la fecha de la transacción, conforme a la publicación oficial del BCB.**

**El cambio de fondo:** la redacción anterior decía *"tipo de cambio oficial de venta en
moneda nacional correspondiente a la fecha de la transacción"* (que en el régimen fijo era
Bs 6,96, contra 6,86 de compra). **La nueva redacción ELIMINA la referencia al tipo de cambio
de venta** y manda al TCO liso.

Consecuencia directa y contraintuitiva: **desde el 17-jul-2026, Aduana y SIN usan bases
distintas para la misma mercadería.** Se nacionaliza al de venta de la semana anterior y se
factura al TCO del día. La diferencia entre ambos no es un error de sistema: es la ley.

Casos especiales que la RND mantiene: facturas emitidas en Zonas Francas y facturas
prevaloradas de tasas de embarque de vuelos internacionales pueden consignar el importe en
bolivianos o su equivalente en ME. La Factura Comercial de Exportación registra el importe en
bolivianos o su equivalente en ME según directrices aduaneras vigentes.

### 2.4 Banco Central de Bolivia — la fuente

**Normas:** Resolución Ministerial N° **245/2026** del MEFP (26-jun-2026, dispone la
transición al régimen flexible bajo Ley 1670) + Resolución de Directorio BCB N° **88/2026**
(26-jun-2026, reglamenta la determinación del TCO).

Mecánica, que importa para el diseño del sistema:

| Concepto | Definición |
|---|---|
| **TCO** | Promedio ponderado de las operaciones de **COMPRA** de dólares de bancos múltiples, bancos PYME y el Banco Público **con sus clientes**. Excluye operaciones entre entidades financieras. |
| **TC de venta** | No se publica como tal: se fija un **techo referencial** de hasta **Bs 0,10 adicionales al TCO** para la venta de divisas por entidades financieras. |
| **Publicación** | Cada día hábil a las **20:00**, y el valor publicado **rige el día hábil siguiente**. |
| **Vigencia del régimen** | Desde el **29-jun-2026**. Reemplaza el fijo 6,86/6,96 vigente desde 2011 y el "dólar referencial" publicado desde dic-2025. |

**Dónde se consulta:** `https://www.bcb.gob.bo/tco_reporte_ultima_cotizacion.php` (última
cotización) y `https://www.bcb.gob.bo/tco_reporte_detalle_historico.php` (serie histórica).
Ambas son **HTML para humanos: el BCB no publica API ni endpoint de datos abiertos** — la
ingesta automática requiere scraping. Existen APIs de terceros (ej. CUCU) que reempaquetan el
dato del BCB, pero **no son oficiales ni están avaladas por el BCB**: sirven como respaldo o
verificación cruzada, nunca como fuente única de un dato que va a una declaración fiscal.

**Detalle operativo de oro para el sistema:** como el TCO se publica a las 20:00 del día
anterior, **el sistema puede tener el TC del día ANTES de que empiece el día.** Un cron
nocturno deja el TCO cargado y validado antes de la primera operación de la mañana. No hay
excusa técnica para operar sin TC del día.

**Valor de referencia:** TCO al **29-jul-2026 = Bs 11,89/USD**. Contra los 6,96 del régimen
fijo, es **+70,8%**. (Nota: la memoria del proyecto registraba 11,37; el dato se movió — razón
de más para no hardcodear.)

### 2.5 Contabilidad — NC 6 y el cierre

**Norma:** Norma de Contabilidad N° 6, *Tratamiento contable de las diferencias de cambio*,
**Decisión N° 7** del Consejo Técnico Nacional de Auditoría y Contabilidad (reemplaza a la
Decisión N° 2 de 11-abr-1983). Aprobada por el CTNAC el **13-ene-1987**, sancionada por la
Comisión Directiva del Colegio de Profesionales de Ciencias Económicas el 26-feb-1987 y por el
CEN del Colegio de Auditores de Bolivia en sesión **CAUB 30/94 de 16-jun-1994**.

Texto operativo literal:

> "Las diferencias de cambio emergentes de modificaciones en las paridades cambiarias deben
> imputarse a los resultados del ejercicio en el que se originan, en las cuentas 'Resultados
> por exposición a la inflación' o 'Ajuste por inflación y tenencia de bienes' según sea el
> procedimiento utilizado para la actualización de los estados financieros (párrafos 6, 8 ó 9
> de la Decisión N° 6)."
>
> "Las diferencias de cambio se imputarán a los resultados del ejercicio en que se originan,
> **independientemente de su cobro o pago**, dado que las operaciones que las originaron
> quedaron perfeccionadas desde el punto de vista de la legislación o prácticas comerciales
> aplicables, y se ponderaron todos los riesgos inherentes a tales operaciones."

Tres consecuencias que corrigen supuestos habituales:

1. **La distinción realizada / no realizada NO cambia la imputación contable.** Las dos van a
   resultados del ejercicio en que se originan. La NC 6 es explícita: *"independientemente de
   su cobro o pago"*. La distinción sigue siendo válida y necesaria — pero como **información
   gerencial** (cuánto de mi resultado es caja y cuánto es revaluación de papel), no como
   criterio de reconocimiento. Es exactamente la separación "contable vs gerencial" que marcó
   el expositor de CAINCO.
2. **Previsión obligatoria por incobrabilidad:** *"En el caso de que existan dudas sobre
   recuperabilidad de las cuentas por cobrar actualizadas al nuevo tipo de cambio, deberá
   constituirse la previsión correspondiente."* Traducido a la operación de una importadora:
   revaluar una CxC en USD hacia arriba **no es utilidad si el cliente no va a poder pagar
   ese monto mayor**. Con un salto de +70% esto deja de ser hipotético.
3. **Hechos posteriores al cierre:** la NC 6 remite a la Decisión N° 5. Un salto cambiario
   ocurrido después del cierre pero antes de emitir los estados financieros tiene que
   evaluarse bajo esa norma.

**Ajuste por inflación (NC 3 / Decisión N° 6, UFV):** la NC 3 revisada condiciona la
reexpresión a moneda constante a que se cumplan criterios de economía hiperinflacionaria
(similares a la NIC 29, con un umbral de inflación acumulada de 12 meses en torno al 12%). La
Resolución CTNAC 01/2008 había restablecido el ajuste usando la UFV como índice mientras no
exista un Índice General de Precios de emisión diaria. **Las fuentes consultadas indican que
el CTNAC suspendió la actualización a partir del 11-dic-2020 y que la suspensión sigue
vigente, pero no se pudo confirmar el número de resolución** — ver §5.2. Esto importa mucho
hoy: con la inflación boliviana de 2026 en el orden de dos dígitos, **el umbral de
reactivación está en discusión**, y si se reactiva cambia el cierre contable de todos los
clientes.

### 2.6 Post-flotación: qué se puede y qué NO se puede usar

**La regla dura: sólo el TCO publicado por el BCB tiene efecto fiscal.** Ni el paralelo, ni el
P2P de Binance, ni el TC efectivo al que la empresa realmente consiguió los dólares.

| Uso | ¿Legal como base fiscal/contable? |
|---|---|
| TCO del BCB (fecha de transacción) | **SÍ** — obligatorio para facturación ME (RND 102600000026) |
| TC oficial de venta BCB, semana anterior | **SÍ** — obligatorio para base imponible aduanera (DS 25870 Art. 20) |
| Techo referencial TCO + 0,10 | **SÍ**, como precio de venta de divisas por entidades financieras (RD 88/2026) |
| Dólar paralelo / P2P / Binance | **NO** para facturar, liquidar tributos ni valuar en libros |
| TC efectivo pagado por la empresa | **NO** como base fiscal. Sí como dato de gestión: la diferencia contra el oficial es **costo financiero real**, y se registra como tal, no como un TC alternativo |

**Buena noticia operativa:** al 29-jul-2026 la brecha entre oficial (~11,89) y paralelo
(~11,79–11,90) está en el orden del **2%**, es decir, prácticamente cerrada. Eso es lo
esperable de una flotación que funciona, y quita presión al problema clásico boliviano de
"tengo que comprar al paralelo y facturar al oficial". **Pero la brecha es una variable, no una
constante**: el sistema tiene que poder registrar el TC efectivo por separado del oficial para
poder medirla, no asumir que van a seguir juntos.

**Dónde está la contingencia fiscal real:** no en elegir "un TC bueno", sino en usar el TC de
un organismo en el trámite de otro. Nacionalizar con el TCO del día en vez del de venta de la
semana anterior, o facturar con el de venta en vez del TCO, produce diferencias en la base
imponible que en fiscalización se leen como tributo omitido.

---

## 3. Tabla de brecha contra `onia-core`

Verificado contra el código, no de memoria. Evidencia `archivo:línea` del worktree
`.claude/worktrees/skills-setup-config-8d4674`.

### 3.1 Brecha por función

| # | Función que la operación real exige | ¿Existe? | Evidencia | Qué falta exactamente |
|---|---|---|---|---|
| 1 | **Tabla/entidad de tipos de cambio** con fecha, moneda, tipo de cotización y fuente | **NO** | 0 resultados de `exchange_rates`/`fx_rates` en todo `onia-core`. Las 18 entidades de `contract.json` y las 15 tablas de `schema/base-schema.sql` no incluyen ninguna de TC | Todo. Es el hueco raíz del que dependen casi todos los demás |
| 2 | **TC versionado por fecha** (serie de tiempo) | **NO** | Contraste: `modules/imports.schema.sql:13-31` (`onia_imports_tariff_rates`) y `modules/accounting.schema.sql:97-115` (`onia_accounting_tax_rates`) **sí** tienen vigencia | El TC es la única variable de negocio del core sin versionado, siendo la más volátil de todas |
| 3 | **Distinguir tipo de cotización** (oficial compra / venta / aduana / cierre) | **NO** | `logic/fx.logic.mjs` sólo modela TCO + spread. No hay campo de "tipo" en ningún lado | Sin esto es imposible cumplir Aduana y SIN a la vez (§2.2 vs §2.3) |
| 4 | **Regla "último TC registrado"** (apunte de Sergio) | **NO** | No hay store de TC del cual tomar "el último" | Requiere (1) primero |
| 5 | **TC de la Aduana** (venta, semana anterior) | **NO** | 0 resultados de `ANB`; los 8 hits de `aduana` son de *valor en aduana* (`modules/imports.json:73`), no de TC | Regla de fecha completa: dado un día de aceptación, resolver el último día hábil de la semana anterior |
| 6 | **TC de facturación (TCO del día)** | **PARCIAL** | `modules/invoicing.logic.mjs:39` `invoiceTotalInBob(...)`; persiste en `modules/invoicing.schema.sql:20` `tco_used numeric` | El TCO se recibe por parámetro; **no hay de dónde leerlo**. Y el fallback es peligroso — ver §3.2 |
| 7 | **Ingesta del TCO del BCB** | **NO** | 0 resultados de `bcb.gob.bo`. Los external_gates del core son exactamente `["siat","tr4_adapter","whatsapp"]` (`index.test.mjs:95`) — **no hay gate `bcb`** | Falta el gate + el job de ingesta 20:00 + validación |
| 8 | **`exchangeRateBob` en costeo de importación** | **CAMPO MUERTO** | Declarado en `modules/imports.json:64`, persistido en `modules/imports.schema.sql:90` — **nunca leído ni escrito por lógica alguna** (0 hits en `imports.logic.mjs`) | Todo el landed cost se calcula en USD (`total_inventory_usd`); no hay conversión efectiva a BOB |
| 9 | **Diferencia de cambio (NC 6)** | **FUNCIÓN HUÉRFANA** | `modules/imports.logic.mjs:367` `exchangeDifference(amountUsd, rateAtOrigin, rateAtClose, {realized, nature})` — implementada y testeada (`imports.logic.test.mjs:280-300`) | **Nadie la llama en producción.** No genera asiento, no se persiste, no hay columna `exchange_difference` en ningún schema, y no está enganchada al cierre de accounting |
| 10 | **Asientos multi-moneda** | **NO** | `modules/accounting.schema.sql:75-86` (`journal_entry_lines`): sin `currency`, sin `exchange_rate`, sin `amount_original`. `modules/accounting.json:129` fija `"currency": "BOB"` | Contabilidad mono-moneda dura. **Hoy es imposible registrar un asiento en ME** |
| 11 | **Reexpresión / moneda funcional / TC de cierre** | **NO** | 0 resultados de `reexpres*`, `functionalCurrency`, `closingRate`, `revaluation`, `UFV` en todo `onia-core` | La pauta contable de CAINCO ("reexpresar saldos monetarios a tipo de cierre") no tiene ninguna implementación |
| 12 | **Cierre mensual con componente FX** | **PARCIAL** | Existe el cierre: `modules/accounting.logic.mjs:275` `buildClosingEntry(...)`, `:306-342` control de período, tabla `_fiscal_periods` (`accounting.schema.sql:32-45`) | El cierre **no invoca** `exchangeDifference` ni revalúa saldos en USD. `imports.json:104` promete "distinguir realizada (al pagar) de no realizada (al cierre)" — ese "al cierre" no existe |
| 13 | **Cotizaciones: validez y vencimiento** | **SÍ** | `modules/commerce.json:105` + `commerce.schema.sql:147` `expired_at`; `commerce.logic.mjs:101` setea el estado; `:173-179` `isQuoteExpired`; alerta `quote_expiring` en `modules/automation.json:81` con seed `daysUntilExpiryMax: 3` (`automation.seed.json:26`) | Confirmado y funcionando |
| 14 | **Cotizaciones: cláusula de ajuste por TC** | **NO** | `commerce.logic.mjs:176-179` vence **puramente por fecha**. `acceptQuoteToOrder` (`:145-162`) copia `currency` y precio **sin revaluar** | Una cotización en USD aceptada tras una devaluación se convierte en pedido al precio viejo. Es exactamente el agujero de margen que marcó CAINCO |
| 15 | **Repricing de listas por TC** | **NO (sólo promesa)** | `modules/commerce.json:153` y `business-tiers.json:136` lo prometen; `commerce.logic.mjs` tiene 14 funciones exportadas y **ninguna** repricia, ni importa `fx` | `repriceUsdToBob` existe en `fx.logic.mjs:61` pero no la llama nadie |
| 16 | Tesorería / caja 13 semanas por moneda | **NO** | 0 resultados: `treasury`, `tesoreria`, `13 semanas`, `flujoCaja`. (`cashFlowStatement` en `accounting.logic.mjs:231` es el estado contable **histórico**, no una proyección) | Confirmado el dato previo |
| 17 | DSO / tasa de recuperación | **NO** | 0 resultados: `dso`, `daysSalesOutstanding` | Confirmado el dato previo |
| 18 | Margen / P&L por unidad de negocio | **NO** | 0 resultados de `margin`. Los 3 hits de `margen` son texto de gating comercial (`contract.json:722`, `adapters/bolivian-electric.json:28,161`), **no cálculo** | Confirmado el dato previo (matiz: `margen` no da 0, pero no hay lógica) |
| 19 | Tablero ejecutivo con alertas por umbral | **NO** | El único hit de `tablero` es un tablero eléctrico en un test (`knowledge.logic.test.mjs:156`). Los 22 de `dashboard` son `owner_dashboard`, read model de KPIs por rubro (`contract.json:1583`), no financiero | Confirmado el dato previo (matiz: `dashboard` no da 0, pero no es financiero) |
| 20 | Costo de reposición vs lista vigente | **NO** | 0 resultados: `replacementCost`, `costoReposicion` | El "mensaje C-Level" de CAINCO no tiene soporte en el sistema |

### 3.2 Las tres brechas más grandes

**BRECHA 1 — No existe la entidad de tipos de cambio. (raíz de todo)**
No hay tabla, no hay entidad en `contract.json`, no hay serie de tiempo, no hay campo de tipo
de cotización ni de fuente. El TC vive como **una constante hardcodeada**
(`logic/fx.logic.mjs:17` `OFFICIAL_RATE_BOB_PER_USD = 6.96`) **más dos columnas sueltas**
(`imports.schema.sql:90`, `invoicing.schema.sql:20`) que nadie orquesta. Sin esto no se puede
cumplir Aduana y SIN a la vez, no se puede aplicar "el último t/c registrado", no se puede
cerrar el mes, y no hay trazabilidad de con qué TC se emitió cada documento — que es
justamente lo que pide una fiscalización.

**BRECHA 2 — El fallback silencioso a 6,96 es un riesgo de plata activo.**
`logic/fx.logic.mjs:31` — `officialRate(dailyTco, fallback = OFFICIAL_RATE_BOB_PER_USD)`
devuelve `Number.isFinite(tco) && tco > 0 ? round2(tco) : fallback`. Si el TCO llega `null`,
`undefined`, `0` o no numérico, **la función devuelve 6,96 sin lanzar, sin advertir y sin
marcar el documento.** El comportamiento está incluso fijado por tests
(`fx.logic.test.mjs:27-31`, `invoicing.logic.test.mjs:41-43`), o sea que es deliberado.

Con el TCO real en **11,89**, un dato faltante emite una factura **subvaluada 41,5%**
(`1 − 6,96/11,89`). Eso es IVA e IT declarados de menos sobre esa operación, con una factura
electrónica ya emitida y difícil de deshacer. Y es exactamente el escenario más probable el
día que el scraping del BCB falle o el BCB no publique a horario.

Un TC faltante debe **frenar la emisión**, no completarse con un valor de un régimen cambiario
derogado hace un mes. La constante 6,96 no debería existir como fallback: si acaso, como dato
histórico de la serie.

**BRECHA 3 — La contabilidad no puede registrar moneda extranjera, y la diferencia de cambio
está desconectada del cierre.**
`accounting.schema.sql:75-86` no tiene `currency` ni `exchange_rate` en las líneas del asiento,
y `accounting.json:129` fija `"currency": "BOB"`. Al mismo tiempo, la función que implementa la
NC 6 (`imports.logic.mjs:367`) está bien hecha y bien testeada pero **vive en el módulo
equivocado y no la llama nadie**: no produce asiento, no se persiste y el cierre de período
(`accounting.logic.mjs:275`) no la invoca. Resultado: el core hoy **no puede responder la
pregunta del apunte de Sergio** — "qué t/c tomar para cerrar la contabilidad mensual" — porque
no tiene ni el TC de cierre, ni saldos en ME que reexpresar, ni el asiento que generaría.

### 3.3 Hallazgos menores pero relevantes

- **`fx.logic.mjs` tiene un solo consumidor real:** `modules/invoicing.logic.mjs:19`. Sus otras
  5 funciones (`effectiveRate`, `usdToBob`, `bobToUsd`, `convertUsdToBob`, `repriceUsdToBob`)
  no las llama ningún módulo — sólo sus propios tests. El docstring (`fx.logic.mjs:3-4`)
  promete que la usan commerce, imports y accounting: **el cableado no está hecho.**
- **`contract.json` es 100% agnóstico de moneda:** cero menciones de `currency`, `moneda`,
  `BOB`, `USD`, `exchange`, `fx`. Toda la multi-moneda vive en módulos add-on. Coherente con el
  core congelado, pero significa que **cualquier entidad de TC es un cambio de contrato**, y
  eso pasa por `policy` y por el guardián del core.
- **El core ya conoce la norma correcta**, lo cual es buena señal: `fx.logic.mjs:6-9` cita
  RM 245/2026 y RD BCB 88/2026; `imports.json:115-116` cita ambas más la RND 102600000026;
  `imports.json:102-104` cita la NC 6. El conocimiento normativo está; **lo que falta es el
  modelo de datos.**
- **`DEFAULT_BANK_SPREAD = 0.1`** (`fx.logic.mjs:20`) coincide con el techo referencial de la
  RD 88/2026. Está bien elegido, pero hardcodeado: si el BCB mueve el techo, hay que recompilar.

---

## 4. Propuesta de diseño (NO implementada)

> **Estado: propuesta.** No se editó `contract.json`, ni el schema, ni los adapters. Requiere
> aprobación de adopción y pasar por `onia-core-guardian` + `npm run validate:onia-core`.

### 4.1 Principio rector

**El tipo de cambio es un dato de referencia versionado, no un parámetro de operación.** Se
modela como los aranceles (`onia_imports_tariff_rates`) y las tasas impositivas
(`onia_accounting_tax_rates`), que ya tienen vigencia por fecha. Cada operación **no elige** un
TC: declara su *propósito fiscal*, y una regla resuelve qué cotización le corresponde. Así el
sistema hace cumplir la ley en lugar de delegarla al usuario.

### 4.2 Entidad `exchange_rate`

Propuesta de campos (nombres a consensuar con el guardián del core):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `organization_id` | uuid | Tenant scoping estándar del core |
| `rate_date` | date | **Fecha de vigencia**, no de captura |
| `currency` | text | ISO 4217: `USD`, `EUR`… Par contra BOB |
| `quote_type` | enum | **El campo clave.** Ver §4.3 |
| `value_bob` | numeric(18,6) | Bs por 1 unidad de `currency`. 6 decimales, no 2 |
| `source` | enum | `bcb_official`, `bcb_scrape`, `manual`, `third_party_api` |
| `source_ref` | text | URL o identificador de la publicación consultada |
| `captured_at` | timestamptz | Cuándo se obtuvo (≠ `rate_date`) |
| `registered_by_member_id` | uuid | **Quién lo registró** — auditoría |
| `status` | enum | `pending`, `confirmed`, `superseded` |
| `metadata` | jsonb | Snapshot crudo de la fuente |

Restricciones:
- Único por `(organization_id, rate_date, currency, quote_type)`.
- **Inmutable una vez `confirmed`.** Una corrección crea una fila nueva y marca la anterior
  `superseded` — nunca un `UPDATE` sobre el valor. Es la única forma de que una factura vieja
  siga explicando con qué TC se emitió.
- Índice por `(organization_id, currency, quote_type, rate_date DESC)` — es la consulta de
  "último TC registrado".

### 4.3 `quote_type` — el catálogo que resuelve el problema de Sergio

Esto es lo que hoy no existe y lo que hace posible cumplir con dos organismos a la vez:

| `quote_type` | Qué es | Fuente | Quién lo consume |
|---|---|---|---|
| `official_buy` | TCO del BCB (promedio ponderado de compra) | BCB, RD 88/2026 | **Facturación ME** (RND 102600000026), valuación contable |
| `official_sell` | Techo referencial = TCO + hasta 0,10 | BCB / RD 88/2026 | **Base imponible aduanera** (DS 25870 Art. 20) |
| `customs` | El valor efectivamente resuelto para una DUI | Derivado de `official_sell` + regla de fecha | Costeo de importación |
| `accounting_close` | TC de cierre del período | Política del tenant, derivado del oficial | Reexpresión y diferencia de cambio |
| `internal_mgmt` | TC efectivo/de gestión de la empresa | Manual | **Sólo gerencial. Marcado como NO fiscal** |

`internal_mgmt` merece una barrera explícita en el modelo: nunca puede alimentar un documento
fiscal ni un asiento. Es donde se registra el TC al que la empresa realmente consiguió los
dólares, para poder medir la brecha como costo financiero (§2.6). Si el sistema no le da un
lugar legítimo, el usuario lo va a meter en el campo equivocado.

### 4.4 Resolución de TC por operación (el motor de reglas)

Función pura, sin IO, en `logic/fx.logic.mjs` (donde ya vive la lógica FX):

```
resolveRate(purpose, operationDate, currency, rateStore) -> { value, quoteType, rateDate, sourceRef }
```

| `purpose` | Regla | Norma |
|---|---|---|
| `invoicing` | `official_buy` de `operationDate` (fecha de la transacción) | RND 102600000026 |
| `customs_dui` | `official_sell` del **último día hábil de la semana anterior** a la fecha de **aceptación** | DS 25870 Art. 20 y 6 |
| `accounting_txn` | TC de la fecha de la transacción | NC 6 |
| `accounting_close` | `accounting_close` del período | NC 6 + política del tenant |
| `management` | `internal_mgmt`, con fallback al oficial | — |

Dos reglas duras de comportamiento:

1. **Sin TC no hay operación fiscal.** `resolveRate` **lanza** cuando no encuentra cotización
   para un `purpose` fiscal. Elimina el fallback a 6,96 (BRECHA 2). El fallback sólo se admite
   para `purpose: management`, y devolviendo además una bandera `isFallback: true`.
2. **Toda la aritmética de fechas hábiles es del core, no del usuario.** La regla de "último
   día hábil de la semana anterior" necesita un calendario de feriados bolivianos
   parametrizable por tenant (hay feriados departamentales: Santa Cruz no para los mismos días
   que La Paz). Si el calendario no está cargado, el resultado se marca `needs_review`, no se
   adivina.

### 4.5 Regla de "último TC registrado" (el apunte de Sergio)

Interpretación propuesta: **"último" = la cotización `confirmed` con la mayor `rate_date` menor
o igual a la fecha objetivo, para ese `currency` + `quote_type`** — no la última fila insertada.
Es la diferencia entre "el TC que corresponde" y "el último que alguien cargó", y en un cierre
retroactivo son valores distintos.

Consecuencias:
- **Nunca se usa un TC futuro** para una operación pasada, aunque exista en la tabla.
- Si el BCB no publicó (feriado), la regla arrastra naturalmente la última cotización vigente
  — que es el comportamiento correcto, no un parche.
- El resultado se **congela en el documento** (snapshot: valor + `quote_type` + `rate_date` +
  `source_ref`). Recalcular el TC de una factura vieja está prohibido por diseño.

### 4.6 Enganches a los cuatro procesos

**Costeo de importación** — dar vida a `exchangeRateBob` (hoy campo muerto, brecha 8):
resolverlo con `purpose: customs_dui` en la fecha de aceptación de la DUI, y guardar en el
snapshot del landed cost el valor + tipo + fecha + fuente. Sumar el **costo de reposición**:
mismo landed cost recalculado al TC de hoy. La diferencia contra el histórico es el número que
CAINCO llama "la variable diaria de gestión".

**Facturación** — `invoicing.logic.mjs` deja de recibir `dailyTco` suelto y pasa a resolver por
`purpose: invoicing`. `tco_used` (`invoicing.schema.sql:20`) se amplía a `tco_used` +
`tco_rate_date` + `tco_source_ref` para que la factura sea autoexplicativa en fiscalización.

**Contabilidad** — dos cambios, y son de fondo:
1. Agregar a `journal_entry_lines` (`accounting.schema.sql:75-86`): `currency`,
   `amount_original`, `exchange_rate`, `exchange_rate_id`. Mantener `debit`/`credit` en BOB como
   la moneda funcional. Esto habilita el asiento en ME, hoy imposible (brecha 10).
2. **Mover `exchangeDifference` de `imports` a `accounting`** — está en el módulo equivocado.
   La diferencia de cambio no es un tema de importaciones: aplica a toda partida monetaria en ME
   (CxC, CxP, caja, préstamos). Conservar la lógica tal cual (`imports.logic.mjs:367-382`), que
   es correcta, y conectarla al cierre de período.

**Cierre mensual** — responder la pregunta de Sergio. Al cerrar período:
1. Listar saldos de partidas **monetarias** en ME (la NC 6 aplica a monetarias; las no
   monetarias se quedan al TC histórico).
2. Reexpresar al `accounting_close` del período.
3. Generar el asiento de diferencia de cambio a resultados —recordando que la NC 6 manda
   imputar **realizadas y no realizadas por igual** (§2.5), y que el flag `realized` es
   desglose gerencial, no criterio de reconocimiento.
4. Evaluar previsión por CxC revaluadas de recuperabilidad dudosa (exigencia expresa de NC 6).
5. Emitir el checklist de cierre de CAINCO: TC de fuente oficial · saldos por moneda ·
   conciliaciones · asientos de diferencia · comentario ejecutivo.

**La respuesta al apunte "qué t/c tomar para cerrar":** para el cumplimiento contable no es una
decisión libre — es el TC oficial de la fecha de cierre, y la NC 6 no da opción de diferir. Lo
que **sí** es decisión de gestión es qué TC usar para el **control gerencial** (presupuesto,
costo de reposición, precios), y ahí `internal_mgmt` es el lugar legítimo. La pregunta de Sergio
tiene dos respuestas porque son dos preguntas distintas: eso es exactamente la separación
"cumplimiento contable vs control gerencial" de la lámina IMG_2971.

### 4.7 TC entre la cotización y la entrega (cláusula de ajuste)

Cierra la brecha 14, que es donde se pierde margen de verdad.

Propuesta sobre `quote`: `fx_clause_type` (`none` | `fixed` | `band` | `indexed`),
`fx_rate_at_quote` (TC congelado al cotizar), `fx_band_pct` (umbral de tolerancia),
`fx_reference_type` (qué `quote_type` dispara el reajuste).

Comportamiento al aceptar la cotización (`acceptQuoteToOrder`, `commerce.logic.mjs:145`), que
hoy copia el precio sin mirar el TC:

| Cláusula | Al aceptar |
|---|---|
| `none` | Precio original. **Advertir** si la variación de TC supera un umbral: el margen ya se erosionó |
| `fixed` | Precio original. La empresa asumió el riesgo a conciencia |
| `band` | Dentro de la banda: precio original. Fuera: **recalcular y exigir `approval_request`** |
| `indexed` | Recalcular siempre al TC vigente, con trazabilidad de ambos valores |

Regla dura, alineada con lo que ya hace el core para cambios sensibles
(`commerce.json:153`): **todo reajuste de precio por TC pasa por `approval_request`.** El
sistema nunca sube un precio solo. Y la alerta `quote_expiring` (`automation.json:81`) gana un
hermano: `quote_fx_drift` — la cotización sigue vigente por fecha pero el TC ya se movió más
allá de la banda. Hoy una cotización puede estar "vigente" y ser ruinosa al mismo tiempo, y el
sistema no lo dice.

### 4.8 Ingesta del TCO — nuevo external gate `bcb`

Los external gates del core son hoy exactamente `["siat","tr4_adapter","whatsapp"]`
(`index.test.mjs:95`). Se propone un cuarto: **`bcb`**. Es coherente con la política del core
(el core calcula y prepara; no consulta servicios externos), y hoy la ausencia de ese gate deja
el TCO como "dato del producto" sin contrato de ingesta.

- **Trigger:** día hábil 20:15 (el BCB publica a las 20:00 el valor del día siguiente).
- **Fuente primaria:** `bcb.gob.bo/tco_reporte_ultima_cotizacion.php` (HTML, scraping — el BCB
  no tiene API, §2.4). Guardar el HTML crudo en `metadata` como evidencia.
- **Verificación cruzada:** una fuente secundaria; si difieren, se registra `pending` y se
  escala a humano. Nunca `confirmed` automático ante discrepancia.
- **Escritura:** `official_buy` (TCO) y `official_sell` (TCO + techo vigente, parametrizable —
  no hardcodeado como hoy en `fx.logic.mjs:20`).
- **Fallo de ingesta:** alerta a la mañana siguiente **antes** de la primera operación. Con
  `resolveRate` lanzando ante TC ausente (§4.4), un fallo bloquea facturación en ME — que es el
  comportamiento correcto y muy preferible a emitir a 6,96.

### 4.9 Orden de implementación sugerido

| # | Paso | Por qué primero |
|---|---|---|
| 1 | **Matar el fallback a 6,96** | Es el único ítem con riesgo de plata **hoy**. No depende de nada más |
| 2 | Entidad + tabla `exchange_rate` con `quote_type` | Raíz de todo lo demás |
| 3 | `resolveRate` + calendario de días hábiles | Habilita cumplir Aduana y SIN a la vez |
| 4 | Gate `bcb` + ingesta 20:15 | Sin dato automático, nada de lo anterior opera solo |
| 5 | Enganche a facturación e importación | Primer valor visible para el cliente |
| 6 | Multi-moneda en asientos + mover `exchangeDifference` a accounting | Habilita el cierre |
| 7 | Cierre mensual con reexpresión y previsión NC 6 | Responde el apunte de Sergio |
| 8 | Cláusula de ajuste en cotizaciones + `quote_fx_drift` | Protege margen; depende de 2 y 3 |

Los pasos 1 a 5 son los que convierten a Onia en un sistema que una importadora boliviana puede
usar sin contingencia fiscal. Del 6 en adelante es donde empieza a ser mejor que la planilla.

---

## 5. Sin fuente confirmada — verificar con el contador

Marcado explícitamente. **No se completó ninguno de estos puntos con una suposición.**

### 5.1 `[SIN FUENTE CONFIRMADA]` — Cómo materializa Aduana el "tipo de cambio de venta" hoy

**El hueco más importante del documento, y es operativo, no académico.**

El DS 25870 Art. 20 exige el "tipo de cambio oficial **de venta** en el Banco Central de
Bolivia". Pero bajo la RD 88/2026 el BCB **publica el TCO (promedio ponderado de compra)** y
sólo fija un **techo referencial** de hasta +Bs 0,10 para la venta de divisas por entidades
financieras. Es decir: el BCB ya no publica un "tipo de cambio oficial de venta" como tal.

No se pudo determinar con fuente oficial cuál de estas aplica la ANB en la liquidación real:
(a) TCO liso, (b) TCO + 0,10, (c) otro valor comunicado por circular.

- **Qué se intentó:** el comunicado de la ANB (27-jun-2026) y la cobertura de prensa repiten la
  fórmula legal del Art. 20 sin resolver la ambigüedad. Se intentó leer la Circular 166/2026 de
  la ANB (`aduana.gob.bo/sites/default/files/archivos/CIRCULAR 166 BANCO CENTRAL DE BOLIVIA
  03-07.pdf`) — el PDF no fue extraíble por las herramientas disponibles.
- **Por qué importa:** sobre una importación de USD 100.000, la diferencia entre TCO y TCO+0,10
  son ~Bs 10.000 de base imponible, que arrastran GA e IVA importación. En una importadora es
  plata todos los meses.
- **Cómo cerrarlo:** (1) abrir la Circular 166 directamente desde el portal de la ANB; (2)
  contrastar contra una **liquidación real de DUI de BE posterior al 4-jul-2026** — el número
  que efectivamente cobró la Aduana resuelve la pregunta sin ambigüedad; (3) confirmarlo con el
  despachante de aduana de BE, que lo ve todos los días.

### 5.2 `[SIN FUENTE CONFIRMADA]` — Resolución que suspendió el ajuste por inflación (UFV)

Las fuentes consultadas coinciden en que el CTNAC suspendió la reexpresión de estados
financieros **a partir del 11-dic-2020** y que sigue suspendida, pero **no se obtuvo el número
de resolución** ni confirmación en fuente oficial (Colegio de Auditores / CTNAC).

Además queda abierto lo más relevante: la NC 3 revisada reactiva el ajuste cuando se cumplen
criterios de hiperinflación (umbral en torno a **12% de inflación acumulada en 12 meses**). Con
la inflación boliviana de 2026 en dos dígitos, **la reactivación es un escenario plausible en el
corto plazo**, y si ocurre cambia el cierre contable de todos los clientes del sistema. No es
una curiosidad: es un requisito de producto que puede activarse.

**Cómo cerrarlo:** pedir al contador el número de resolución CTNAC vigente y su lectura sobre si
el umbral ya se cumplió con la inflación de 2026. Mientras tanto, **no implementar reexpresión
por UFV**, pero dejar el modelo preparado (que el TC de cierre y el índice de ajuste sean dos
cosas distintas y parametrizables).

### 5.3 `[SIN FUENTE CONFIRMADA]` — TC para las declaraciones juradas (Form. 200 IVA, 400 IT, IUE)

La RND 102600000026 regula el TC **en los documentos fiscales** (facturas y equivalentes). No se
encontró norma que fije explícitamente el TC para la **consolidación de las declaraciones
juradas** ni para el IUE anual. Lo razonable es que arrastre el TC de cada documento (ya que la
declaración agrega documentos ya expresados en Bs), pero **no se confirmó con norma**.

**Cómo cerrarlo:** consultar al contador y, si hace falta, al SIN. Relevante para el IUE, donde
hay que definir el TC de las partidas al cierre de gestión.

### 5.4 `[SIN FUENTE CONFIRMADA]` — Tratamiento en el IUE de la diferencia de cambio NO realizada

Contablemente, la NC 6 es clara: van a resultados aunque no se hayan cobrado ni pagado
(§2.5). Lo que **no se verificó** es si esa diferencia **no realizada** es computable para el
IUE, o si requiere ajuste en la conciliación fiscal (gasto no deducible / ingreso no gravado
hasta su realización).

**Por qué importa:** con un salto de +70%, una empresa con CxC en USD puede mostrar una utilidad
contable grande y enteramente no realizada. Si el IUE la grava, hay que pagar impuesto sobre
plata que todavía no entró — un problema de caja severo, exactamente el patrón "rentable en
papel, estresada de caja" de la lámina IMG_2955.

**Cómo cerrarlo:** consulta al contador sobre el tratamiento en la conciliación fiscal del IUE,
citando norma (Ley 843 / DS 24051).

### 5.5 `[SIN FUENTE CONFIRMADA]` — Qué TC aplica al crédito fiscal IVA de una factura de compra en ME

El análisis consultado de la RND 102600000026 indica expresamente que **no menciona** el crédito
fiscal IVA ni el registro en libros de compras/ventas. Queda sin confirmar si el comprador
computa el crédito fiscal al TC consignado en la factura del proveedor (lo lógico) o al TC de
su propia fecha de registro.

**Cómo cerrarlo:** contador + revisión del texto completo de la RND 102100000011 vigente
(consolidado con sus modificaciones).

### 5.6 Nota metodológica sobre las cifras

- **TCO Bs 11,89/USD al 29-jul-2026** — tomado de la publicación del BCB. **Es un valor diario
  y cambia**: no debe hardcodearse en ningún lado, ni siquiera en documentación. La memoria del
  proyecto registraba 11,37 y ya quedó vieja en pocos días.
- **Brecha oficial/paralelo ~2%** — de agregadores de mercado, **no de fuente oficial** (el
  paralelo por definición no tiene fuente oficial). Sirve como orden de magnitud, no como dato
  auditable.
- **+70,8%** es el salto acumulado de 6,96 a 11,89, calculado aquí, no una cifra publicada.

---

## 6. Qué NO se hizo en esta sesión

- No se modificó `onia-core/` (ni `contract.json`, ni schema, ni adapters). La §4 es propuesta.
- No se tocó `web-factory/` ni el repo de Bolivian Electric (leído sólo en modo lectura).
- No se implementó nada. El paso 1 de §4.9 (matar el fallback a 6,96) es lo único que
  recomendaría hacer sin esperar la aprobación del diseño completo, por ser riesgo activo.
