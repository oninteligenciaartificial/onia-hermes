# ENTREGA · paquete de producción (tarea task_4ef73b0faaea)

Autor: Claude (worktree `iman-workshop-20261022`). Revisor independiente previsto: Codex. Coordina: Hermes. Entregado el **23-oct-2026** (La Paz).
Todo es **borrador privado**. Nada está grabado, editado, publicado, gastado ni contactado. **No se hizo Git**, no se instaló nada, no se tocó ninguna cuenta ni secreto, no se subió cara ni voz, no se abrió ninguna sesión persistente.

## 1. Qué se entrega (rutas relativas a `hermes-content/research/iman-workshop-20261022/paquete-produccion/`)

| Archivo | Qué es |
|---|---|
| `GUIONES-SEMANA.md` | **7 guiones completos** sáb 24 a vie 30 oct: radar verificable, 3 prioritarios, hook, texto hablado, cierre (venta lista y versión educativa en los de taller), planos y capturas, caption, fuente y fecha, y la tabla referente → principio → aplicación |
| `WORKSHOP-MATERIAL.md` | Recomendación de alcance, agenda 90+5 minuto a minuto, **apertura** del facilitador, **ejercicio completo** con datos ficticios rotulados, **prompt seguro**, **ejemplo resuelto**, **rúbrica** (lista, costo en tiempo, prioridad, primer paso) ensayada con tres respuestas, y la continuidad como hipótesis separada |
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
| Apertura del facilitador | §3 (233 palabras) | Hecho |
| Ejercicio completo con datos ficticios rotulados | §4 («Tienda El Perchero», inventada) | Hecho |
| Prompt seguro; ejemplo resuelto; rúbrica | §5, §6, §7 | Hecho |
| Continuidad: una tarea supervisada separada, no oferta | §9 | Hecho como hipótesis; no se agrega a la oferta |
| Meta Ads: fuentes oficiales actuales; objetivo y destino | `META-ADS-ESTUDIO-APLICADO.md` §1 y §2 | Hecho, con lo no leído marcado |
| 2 conceptos de anuncio en borrador | §5 | Hecho |
| Medición conversaciones calificadas y pagos | §3 | Hecho |
| Experimento acotado y criterios para detener | §6 | Hecho, **no ejecutable sin las aprobaciones de §7** |
| No configurar, gastar ni publicar; Bs 300 es referencia | Encabezado y §6 | Respetado |
| No trasladar segmentación dental ni prometer por la Biblioteca de Anuncios | Encabezado, §5, §6 | Respetado (sin intereses ni rubro; no se usó la Biblioteca) |
| No tocar fecha, precio, cupos, canon ni prometer grabación, ahorro, resultados | Los tres documentos (revisión con `grep`, solo aparecen como negaciones) | Respetado |

## 3. Subagentes nativos: lo que se usó de verdad

Se comprobó que la herramienta de subagentes está disponible. **Se usaron dos, de a uno, ambos Haiku, ambos en segundo plano y de solo lectura web.** No se crearon sesiones persistentes ni globales.

| # | Id | Modelo | Tarea | Artefacto | Resultado y qué hice con él |
|---|---|---|---|---|---|
| 1 | `add9de84e33beb146` | haiku | Reunir fuentes oficiales de Meta sobre anuncios a WhatsApp, medición, políticas, presupuesto y cambios recientes | Informe de devolución (texto en el transcript de la tarea; no escribió archivos) | **Parcial.** Volví a leer las fuentes que importaban. **Descarté** tres afirmaciones suyas sin sustento: «Meta Connect anunció la Business Agent Platform» (la página que leí no lo dice), «learning phase de 50 eventos en 7 días» (no se pudo leer la página) y «US$ 350-500 recomendados» (sin fuente) |
| 2 | `ac11c68524398afaa` | haiku | Fact-check de Goldman/NBC, estado de la Decisions API, búsqueda de noticias útiles para dueños y de «Claude Duet» | Informe de devolución (texto en el transcript; sin archivos) | **Confirmó** Goldman (22-oct). Dijo que la Decisions API seguía en beta: **se equivocó** (y yo lo repetí): el changelog oficial muestra GA el 22-oct. Marcó «Claude Duet» como confirmado con un único sitio de terceros: **lo excluí** (no figura en la lista oficial de Anthropic que leí, sin fuente primaria, solo EE. UU. con lista de espera) |

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

## 6. Pruebas ejecutadas (se reproducen con `cd pruebas && python <archivo>`)

| Archivo | Qué prueba | Resultado |
|---|---|---|
| `cuentas_workshop.py` | Cuentas del ejercicio y del canon: 10 × 5 × 4 = 200 min = 3 h 20; total del caso 388 min por semana, 1.552 por mes (25 h 52); la regla de riesgo cambia la elección (sin ella gana la tarea 5; con ella, la 2); escalera 15×50 + 20×60 + 15×70 = Bs 3.000 | Todas las aserciones pasan |
| `meta_cuentas.py` | Gasto diario de Bs 300 (7, 8 y 5 días); pagos para cubrir el gasto (6, 5 y 5); tasas necesarias por costo de conversación; costo máximo de Bs 6 para llegar a 50 conversaciones | Todas pasan |
| `contar_palabras.py` + `textos_guiones.py` | Palabras y segundos de cada texto hablado (rango de 28 a 40 s con pausas) | Salida guardada |
| `verificar_material.py` | Apertura de 233 palabras; los 13 textos hablados de `textos_guiones.py` están **literalmente** en `GUIONES-SEMANA.md`; suma de la agenda; puntajes de la rúbrica | `OK` |

## 7. Límites: lo que NO se comprobó

- **No se grabó nada**: las duraciones son estimadas a 3,2 palabras por segundo más pausas. La «lectura en voz» fue una relectura propia del texto, no una grabación.
- **El taller no se ensayó con personas.** Tiempos de la agenda y rúbrica son de papel; la rúbrica se probó con tres respuestas escritas por mí.
- **No usé ninguna herramienta de IA de terceros** para correr el prompt: la «respuesta de ejemplo» (§6.3 del material) la redacté yo y la contrasté con el script.
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
