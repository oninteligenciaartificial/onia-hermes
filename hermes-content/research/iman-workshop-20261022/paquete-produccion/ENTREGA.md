# ENTREGA · paquete de producción (tarea task_4ef73b0faaea)

Autor: Claude (worktree `iman-workshop-20261022`). Revisor independiente previsto: Codex. Coordina: Hermes. Entregado el **23-oct-2026** (La Paz).
Todo es **borrador privado**. Nada está grabado, editado, publicado, gastado ni contactado. **No se hizo Git**, no se instaló nada, no se tocó ninguna cuenta ni secreto, no se subió cara ni voz, no se abrió ninguna sesión persistente.

## 0. Corrección H1-H7 (única, tras el dictamen «CAMBIOS NECESARIOS» de Codex, task_139072decf40)

Aplicada el 23-oct-2026 sobre esta carpeta. **No se tocó** el dictamen de Codex (`.hermes/tasks/piloto-claude-produccion-codex-review.md`), el snapshot original (`.hermes/tasks/paquete-produccion-review-snapshot.json`), los insumos congelados, el canon, V1, V2, la web actual, precios, cuentas, configuración ni hooks. No hubo investigación general nueva, ni noticias descartadas reintroducidas, ni Git, instalaciones, gasto, publicación, contacto ni subida de cara o voz. Una sola lectura nueva: el comunicado de Goldman (me dio 403).

| H | Cambio hecho | Ruta | Prueba | Residual (lo que sigue sin resolver) |
|---|---|---|---|---|
| **H1** | Se comparan **suma acreditada atribuible vs gasto real** con los montos efectivamente cobrados; desaparece «5 pagos cubren Bs 300» y «menos de 5 no cubren»; tabla de 7 casos (5 × Bs 50 vs Bs 300; 4 × Bs 50 vs Bs 180; mezclas de escalones); es cobertura **bruta**, no beneficio ni causa; el criterio de cierre usa esa comparación | `META-ADS-ESTUDIO-APLICADO.md` §4 y §6; `pruebas/meta_cuentas.py` | `meta_cuentas.py` (7 casos con aserciones: 250 < 300, 200 ≥ 180, 290 < 300, 310 ≥ 300, 350, 300, 0) | No se sabe cuánto cobraría la pauta; IVA, IT y facturación los define Leslie Mercado Moreno |
| **H2** | El chat directo pasa a **alternativa B, no canon**; el canon (A) queda como camino; la elegibilidad del número personal, el vínculo con una Page y las etiquetas **no están acreditadas**; el teléfono de prueba solo prueba mensajería; **4.ª pregunta** (certificado / que lo haga otro) y estado «calificación pendiente»; si dice «Instagram» el origen es **«anuncio desconocido»**; 0 conversaciones **no diagnostica** destino roto; se quitó la certeza sobre «50 eventos», «cada cambio reinicia» y «+20 %»; **el techo de Bs 300 no se sube**; fuentes de Meta marcadas `NO_VERIFICADO` para el revisor | `META-ADS-ESTUDIO-APLICADO.md` §1, §2, §3, §4, §5, §6, §7 | `verificar_material.py` (frases retiradas ausentes; presentes «Camino del canon», «no es canon», «anuncio desconocido», «El techo de Bs 300 NO se sube») | **Sergio debe elegir A o B** y alguien acreditar la elegibilidad en la cuenta; las páginas de Meta siguen **sin verificar** (no se arreglan declarándolas leídas) |
| **H3** | Se retiraron «sin arriesgar a nadie» (jue 29 y apertura) y «nadie se entera hasta que el cliente se queja» (vie 30). Ahora: **casos totalmente inventados**; cambiar nombres **no anonimiza**; se habla de **exponer menos**, no de riesgo cero; el error **puede** pasar inadvertido | `GUIONES-SEMANA.md` (jue 29, vie 30), `pruebas/textos_guiones.py` (S6, S7), `WORKSHOP-MATERIAL.md` §3, §4, §5, §7 | `verificar_material.py` (frases ausentes) | Ninguna herramienta se evaluó: qué hace cada una con los datos sigue siendo del usuario |
| **H4** | Es un **prompt propuesto**, sin garantía universal; el **riesgo y la posibilidad de revisión los confirma la persona** (no se infieren); salidas explícitas **«Sin candidata elegible»** y **«Faltan datos»**; la discrepancia entre cuentas **se recalcula**, no gana la humana; en un empate de minutos decide la persona; §6.5 con dos casos de borde | `WORKSHOP-MATERIAL.md` §4, §5, §6, §6.5, §8; `pruebas/cuentas_workshop.py` | `cuentas_workshop.py`: `prioridad` (10 casos: Perchero → tarea 2; vacía; todas de riesgo alto; ninguna revisable; falta riesgo; falta revisión; falta un número; empate; un solo elegible; la más larga de riesgo alto) y `reconciliar` (5 casos, incluido el de la cuenta humana mal) | **El prompt no se probó en ninguna herramienta** ni con ningún LLM externo; los casos de borde son lógica del script, no comportamiento de un asistente |
| **H5** | Rúbrica **exhaustiva y excluyente**: lista para 0-2 / 3-4 / 5-8 todas concretas / 9 o más; costo, prioridad (incluye «sin candidata elegible») y primer paso con casos; 5 respuestas puntuadas con funciones (8, 3, 0, 7, 7) | `WORKSHOP-MATERIAL.md` §7; `pruebas/cuentas_workshop.py` | `rubrica_*`: 0, 2, 3, 4, 5, 8, 9 y 12 tareas, 6 tareas con una vaga, 5 con la mayoría vaga; **todas las combinaciones (0 a 14 tareas) dan 0, 1 o 2** | No se probó con participantes; «concreta» requiere juicio humano |
| **H6** | Los cierres A de taller **ya no caben en 4 s**: sáb 24 son 29 palabras (~9 s), lun 26 16 (~5 s), mié 28 17 (~5 s); se recalcularon las tablas de planos desde las palabras; el **domingo tiene un solo CTA** (se quitó la opción de agregar otro cierre); recuento de todos los textos y variantes; los segundos se llaman **estimados** | `GUIONES-SEMANA.md` (§0, §4, §3, cada tabla); `pruebas/contar_palabras.py` + `.salida.txt` | `verificar_material.py` (palabras de cada cierre; ausencia de «Cierre ~4 s»; S2 termina en su única acción) | **Segundos estimados a 3,2 palabras por segundo, no medidos en voz**; sensibilidad a 150 ppm en `GUIONES-SEMANA.md` §4 |
| **H7** | Goldman cita el **comunicado primario** (NBC queda como **secundaria**, no «prueba oficial»); los US$500M son el compromiso del **programa general**; orientación **EE. UU.**, sin Bolivia; referentes **históricos del 8-oct, no observados ahora**; el montaje es **propuesta mía** | `GUIONES-SEMANA.md` §2 fila 1, §4b, Dom 25; `pruebas/textos_guiones.py` (S2) | `verificar_material.py` (URL primaria presente; «programa general»; «Estados Unidos» en S2; «históricos fechados el 8-oct») | **El comunicado primario no lo pude leer (403)**: para mí es `NO_VERIFICADO`; me apoyo en el revisor y en Hermes y en NBC (secundaria) |

### Fe de corrección puntual del residual H5 (24-oct-2026)

El dictamen de verificación (`.hermes/tasks/paquete-produccion-final-verificacion.md`, residual H5) tenía razón: la tabla de la rúbrica daba **0** por mayoría vaga y a la vez **1** por «3 o 4 concretas» o «9 o más», y la función solo daba 0 hasta 2 concretas; `rubrica_lista(8, 3)` y `rubrica_lista(9, 3)` devolvían 1 y la tabla decía 0. Corregido **solo** eso:
- **Regla (en este orden):** lista = **0** si hay hasta 2 concretas **o** vagas > concretas; si no, lista = **2** si hay 5 a 8 tareas y todas concretas; si no, lista = **1**.
- **Dónde:** `WORKSHOP-MATERIAL.md` §7 (fila Lista y regla explícita), `pruebas/cuentas_workshop.py` (`rubrica_lista` y tres predicados disjuntos `pred_lista_0/1/2`), y sus salidas.
- **Pruebas nuevas, conservando las previas:** `rubrica_lista(8, 3) == 0` y `rubrica_lista(9, 3) == 0`; más 6/3 = 1, 7/3 = 0, 14/7 = 1, 14/6 = 0; y la tabla exhaustiva de **120 pares** (0 ≤ concretas ≤ total ≤ 14) comparada contra los tres predicados disjuntos, con la comprobación de que **exactamente uno** es verdadero por par y que la función concuerda con él (no solo que dé 0, 1 o 2).
- **No se tocó:** los otros seis hallazgos, los guiones, Meta, el canon, hooks, snapshots ni el dictamen de Codex. Sin subagentes, investigación nueva, Git, instalaciones, gasto ni publicación.
- **Residual que sigue:** la rúbrica no se probó con participantes y «concreta» requiere juicio humano.

**Regresiones ejecutadas (los 4 scripts, Python del autor):** `cuentas_workshop.py` (OK), `meta_cuentas.py` (OK), `contar_palabras.py` (salida guardada), `verificar_material.py` (OK, salida guardada). **No se afirma** ensayo real, participantes ni ejecución de un LLM externo.
**Parada:** esta es la única corrección. Hermes congela los nuevos bytes; Codex verifica **solo** estos siete hallazgos; después se muestra a Sergio.

## 1. Qué se entrega (rutas relativas a `hermes-content/research/iman-workshop-20261022/paquete-produccion/`)

| Archivo | Qué es |
|---|---|
| `GUIONES-SEMANA.md` | **7 guiones completos** sáb 24 a vie 30 oct: radar verificable, 3 prioritarios, hook, texto hablado, cierre (venta lista y versión educativa en los de taller), planos y capturas, caption, fuente y fecha, y la tabla referente → principio → aplicación |
| `WORKSHOP-MATERIAL.md` | Recomendación de alcance, agenda 90+5 minuto a minuto, **apertura** del facilitador, **ejercicio completo** con casos totalmente inventados y rotulados, **prompt propuesto**, **ejemplo resuelto**, **rúbrica** (lista, costo en tiempo, prioridad, primer paso) ensayada con tres respuestas, y la continuidad como hipótesis separada |
| `META-ADS-ESTUDIO-APLICADO.md` | Fuentes oficiales leídas, objetivo y destino, medición (conversaciones, calificadas, pagos), cuentas del presupuesto, **2 conceptos de anuncio**, experimento acotado con **criterios para detener** |
| `ENTREGA.md` | Este archivo |
| `pruebas/` | `cuentas_workshop.py`, `meta_cuentas.py`, `textos_guiones.py`, `contar_palabras.py`, `verificar_material.py` y las salidas `*.salida.txt` |

## 2. El pedido, punto por punto, con su archivo

| Pedido | Dónde está | Estado |
|---|---|---|
| 7 guiones completos 24-30 oct, marca personal, voseo | `GUIONES-SEMANA.md` (siete secciones) | Hecho |
| Radar verificable de temas recientes | `GUIONES-SEMANA.md` §2 (8 filas, estado de cada una) | Hecho: **solo una noticia útil y verificada** (Goldman); el resto, descartado con motivo |
| 3 prioritarios | §3: sáb 24, dom 25 (Goldman), jue 29 (datos de clientes) | Hecho |
| Hook, texto hablado, cierre, planos o capturas, caption, fuente y fecha | Cada guion | Hecho |
| Noticias solo si verificadas; evergreen identificado | Cada pieza lleva su tipo (TALLER, NOTICIA, EVERGREEN) | Hecho |
| Recuperar el borrador del delegado antes de investigar | `GUIONES-SEMANA.md` §1: estaba en `C:/dev/proyectos/onia-hermes/hermes-content/docs/cola/plan-3-semanas/GRABAR-24-30-OCT.md` (repo principal, no en este worktree) | Recuperado, leído completo, **no modificado**; origen y ajustes documentados |
| Workshop: recomendación frente a «manejar todo el negocio» | `WORKSHOP-MATERIAL.md` §1 | Hecho: se mantiene auditar y priorizar |
| Agenda 90 de contenido + 5 de pausa | §2 (suma comprobada: 45 + 5 + 45 = 95 transcurridos) | Hecho |
| Apertura del facilitador | §3 (264 palabras, estimados 82 s de voz) | Hecho |
| Ejercicio completo con datos ficticios rotulados | §4 («Tienda El Perchero», inventada) | Hecho |
| Prompt propuesto; ejemplo resuelto; rúbrica | §5, §6, §6.5, §7 | Hecho; prompt **no probado** en ninguna herramienta |
| Continuidad: una tarea supervisada separada, no oferta | §9 | Hecho como hipótesis; no se agrega a la oferta |
| Meta Ads: fuentes oficiales actuales; objetivo y destino | `META-ADS-ESTUDIO-APLICADO.md` §1 y §2 | Hecho como lectura del autor; **las fuentes de Meta siguen `NO_VERIFICADO` para el revisor** |
| 2 conceptos de anuncio en borrador | §5 | Hecho |
| Medición conversaciones calificadas y pagos | §3 | Hecho (4 criterios; atribución desconocida no se adjudica) |
| Experimento acotado y criterios para pausar o cerrar | §6 | Hecho, **no ejecutable sin las aprobaciones de §7** ni sin que Sergio elija el destino A o B |
| No configurar, gastar ni publicar; Bs 300 es referencia | Encabezado y §6 | Respetado |
| No trasladar segmentación dental ni prometer por la Biblioteca de Anuncios | Encabezado, §5, §6 | Respetado (sin intereses ni rubro; no se usó la Biblioteca) |
| No tocar fecha, precio, cupos, canon ni prometer grabación, ahorro, resultados | Los tres documentos (revisión con `grep`, solo aparecen como negaciones) | Respetado |

## 3. Subagentes nativos: lo que se usó de verdad

Se comprobó que la herramienta de subagentes está disponible. **Se usaron tres, de a uno, los tres Haiku, en segundo plano y de solo lectura** (los dos primeros con web; el tercero solo leyó los archivos del paquete). No se crearon sesiones persistentes ni globales.

| # | Id | Modelo | Tarea | Artefacto | Resultado y qué hice con él |
|---|---|---|---|---|---|
| 1 | `add9de84e33beb146` | haiku | Reunir fuentes oficiales de Meta sobre anuncios a WhatsApp, medición, políticas, presupuesto y cambios recientes | Informe de devolución (texto en el transcript de la tarea; no escribió archivos) | **Parcial.** Volví a leer las fuentes que importaban. **Descarté** tres afirmaciones suyas sin sustento: «Meta Connect anunció la Business Agent Platform» (la página que leí no lo dice), «learning phase de 50 eventos en 7 días» (no se pudo leer la página) y «US$ 350-500 recomendados» (sin fuente) |
| 2 | `ac11c68524398afaa` | haiku | Fact-check de Goldman/NBC, estado de la Decisions API, búsqueda de noticias útiles para dueños y de «Claude Duet» | Informe de devolución (texto en el transcript; sin archivos) | **Confirmó** Goldman (22-oct). Dijo que la Decisions API seguía en beta: **se equivocó** (y yo lo repetí): el changelog oficial muestra GA el 22-oct. Marcó «Claude Duet» como confirmado con un único sitio de terceros: **lo excluí** (no figura en la lista oficial de Anthropic que leí, sin fuente primaria, solo EE. UU. con lista de espera) |
| 3 | `ab23c2b092e7b9a91` | haiku | **Revisor de coherencia de la corrección H1-H7** (solo lectura, sin web): restos de afirmaciones retiradas, rúbrica vs. caso sin candidata, tablas de cierres, un solo CTA el domingo, Goldman | Informe de devolución (sin archivos) | Informó **«sin hallazgos»** en los cuatro puntos. **Es evidencia débil**: hizo 4 lecturas y respondió en menos de un minuto; no sustituye el chequeo de `verificar_material.py` ni la verificación de Codex |

La integración, la redacción y la verificación son mías; los subagentes aportaron pistas y una segunda lectura.

## 4. Fuentes

- Canon y estrategia: `hermes-content/docs/TALLER_31_OCT.md`; `ESTRATEGIA-WORKSHOP.md`; `.hermes/tasks/workshop-enfoque-escalabilidad-revision.md`.
- Insumo de otro autor: `docs/cola/plan-3-semanas/GRABAR-24-30-OCT.md` (repo principal); `docs/orquesta/marca/234.md`; copia congelada de Hermes: `.hermes/tasks/guiones-semana-insumo-congelado.md` (existe en este worktree; no la usé para escribir, solo la reconocí).
- Skills: `edicion-referentes`, `diseno-contenido-onia`, `aprender-de-todo`, `onia-ventas-pauta` (§5, §9), `editor-videos` (solo el gate de cortes y la regla de subtítulos corregidos a oído).
- Web verificada por mí el 23-oct: NBC News (Goldman); Google Developers Blog (leído y descartado); Anthropic `news` (lista); `whatsappbusiness.com` (Business Agent, 3-jun-2026); Meta for Developers (Click-to-WhatsApp; Conversions API for Business Messaging); Ayuda de Meta («Last Significant Edit»); Estándares de anuncios de Meta (atributos personales; prácticas engañosas); Meta Connect 2026 (23-sep). Las URLs exactas están en cada documento.

## 5. Hallazgos importantes (para Hermes)

1. **Corrección mía sobre el borrador previo.** Creí que su afirmación «OpenAI anunció el 22-oct la disponibilidad general de la Decisions API» era falsa, porque las notas que encontré eran de la beta (6-7 oct). **Estaba equivocado**: el changelog oficial de OpenAI y su comunidad confirman GA el 22-oct-2026 (leídos por búsqueda; `openai.com` me da 403, y la preauditoría de Codex dice haberla abierto). El borrador acertó. La pieza sigue fuera de mi semana por ser **técnica** y no útil para un dueño, no por ser falsa. Hermes no necesita corregir el borrador por este motivo; sí conviene definir **una sola cola** de guiones.
2. **Otras notas del borrador** (Habitat de OpenAI, 23-oct; Chrysalis de Google, 22-oct): yo no las verifiqué (la preauditoría de Codex dice que sus páginas existen y dicen lo que el borrador cita); **no las uso**: una es infraestructura interna de OpenAI y la otra una arquitectura de referencia simulada, sin utilidad para un dueño.
3. **Una sola noticia útil para dueños** en la ventana (Goldman, 22-oct). No se rellenó con titulares técnicos.
4. **Meta:** con Bs 300 no hay estadística. El experimento sirve para leer; ver `META-ADS-ESTUDIO-APLICADO.md` §4.

## 6. Pruebas ejecutadas (se reproducen con `cd pruebas && python <archivo>`; Python del autor, salidas guardadas)

| Archivo | Qué prueba | Resultado |
|---|---|---|
| `cuentas_workshop.py` | Cuentas del caso y del canon (200 min = 3 h 20; 388 por semana, 1.552 por mes = 25 h 52; la más larga es la tarea 5, de riesgo alto); **`prioridad`** con 10 casos de borde; **`reconciliar`** con 5 casos; **rúbrica** exhaustiva y excluyente para 0, 2, 3, 4, 5, 8, 9 y 12 tareas y para todas las combinaciones de 0 a 14; cinco respuestas puntuadas (8, 3, 0, 7, 7); escalera del canon | `OK` |
| `meta_cuentas.py` | **`cobertura_bruta`** con 7 casos (suma acreditada vs gasto real, incluidos 5 × Bs 50 vs Bs 300 y 4 × Bs 50 vs Bs 180); gasto por día; costo por conversación supuesto; el techo no se sube | `OK` |
| `contar_palabras.py` + `textos_guiones.py` | Palabras y segundos **estimados** de cada texto hablado y variante (28 a 40 s con pausas) | Salida guardada |
| `verificar_material.py` | Los 13 textos hablados están literalmente en `GUIONES-SEMANA.md`; palabras de cada cierre (29, 14, 16, 10, 17, 10); no queda «Cierre ~4 s»; el domingo termina en su única acción; **frases retiradas ausentes** en los tres documentos; presentes las correcciones de Meta, Goldman y referentes; agenda 45 + 5 + 45 = 95; sin notas internas en el hablado | `OK` |

Todas son comprobaciones de texto y de números. **No son un ensayo con personas ni una ejecución de un LLM externo.**

## 7. Límites: lo que NO se comprobó

- **No se grabó nada**: las duraciones son estimadas a 3,2 palabras por segundo más pausas. La «lectura en voz» fue una relectura propia del texto, no una grabación.
- **El taller no se ensayó con personas.** Tiempos de la agenda y rúbrica son de papel; la rúbrica se probó con cinco respuestas escritas por mí y con las funciones del script.
- **No usé ninguna herramienta de IA de terceros** para correr el prompt, que es un **prompt propuesto** sin garantía de que funcione igual en todas: la «respuesta de ejemplo» (§6.3 del material) la redacté yo y la contrasté con el script.
- **Meta:** las fuentes de Meta que cito **siguen `NO_VERIFICADO` para el revisor** (429, inicio de sesión); no se arreglan declarándolas leídas. El **destino A o B** y la **elegibilidad del número** no están resueltos.
- **Goldman:** el comunicado primario me dio 403: lo sostengo con la verificación del revisor y de Hermes y con NBC (secundaria).
- **Meta:** dos páginas oficiales relevantes (aprendizaje completo y mínimos de presupuesto) no se pudieron leer; los nombres exactos del editor de anuncios no se confirmaron en una cuenta; no se sabe si Meta exige etiquetar imágenes de IA.
- **Referentes:** me apoyé en lo que la skill `edicion-referentes` resume de las fichas del 8-oct; **no reabrí las fichas originales** ni reprodujo ningún trailer de Erik. Que haya estudiado skills **no garantiza calidad**: el auditor decide.
- **Noticias:** se confirman en su fuente el 23-oct; **se deben reabrir el día de grabar**.
- **Mercado:** no hay datos de audiencia de @sergiourcullo ni de demanda del taller; la priorización es editorial.

## 8. Decisiones que no son mías

| Decisión | De quién |
|---|---|
| Abrir la venta (compuerta de 5 condiciones del canon §3) y, con eso, usar el **cierre de venta** en lugar del educativo | Sergio Urcullo |
| Gasto de Bs 300, cuenta publicitaria y método de pago | Sergio Urcullo |
| QR del BCP, titular, facturación y texto de devolución | Leslie Mercado Moreno |
| Cara o voz de Sergio en cualquier pieza de Meta | Sergio Urcullo y Leslie Mercado Moreno |
| Cola única de guiones (cuál archivo manda) | Hermes |
| Proyectar o compartir la hoja de trabajo; usar o no el prompt; el tono de la apertura | Sergio Urcullo |

## 9. Qué debería mirar Codex (un solo ciclo de corrección, por hallazgos concretos)

1. ¿Cada texto hablado de `GUIONES-SEMANA.md` se lee **natural, con un hook que su conclusión responde y un solo CTA**?
2. ¿Algún guion, caption o texto de anuncio **dice o implica que la venta ya está abierta** o lista condicionantes al público? (Las condiciones aparecen solo en notas internas.)
3. ¿Algún claim de ahorro, ingresos, resultados, grabación, certificado o plantilla? (`grep` en los tres documentos: solo negaciones.)
4. ¿Goldman: la fuente dice lo que el guion dice? (cifra, socios, «training and tools», sin límite geográfico explícito; «filantrópico».)
5. ¿Está bien la **corrección** sobre la Decisions API (GA verdadera el 22-oct, pieza descartada por técnica)? (Leer el changelog oficial citado en `GUIONES-SEMANA.md` §2, fila 4.)
6. ¿Las cuentas de `pruebas/` son correctas y los documentos citan los mismos números?
7. ¿El ejercicio es completable en los tiempos de la agenda? ¿La regla de prioridad es clara? ¿La rúbrica discrimina?
8. ¿El prompt seguro es seguro y claro? ¿Algo pide datos reales?
9. Meta: ¿lo que dicen las fuentes oficiales coincide con lo que el estudio atribuye a ellas? ¿Los criterios para detener son coherentes con las cuentas?
10. ¿Hay algún «hecho» sin archivo o fuente?
