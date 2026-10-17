# Mejoras de UI para la 1.0, priorizadas, con su referente

> **Doc vivo, sin fecha: se EDITA.** Nace el 8-oct (pedido de la madre): una lista priorizada de mejoras de UI del panel,
> cada una con su referente, su dueño y qué cambia. **Competencia = ideas, no copia. Nada de promesas nuevas.**
>
> **Límite que importa:** no hay cuenta de prueba, así que **no se miró el panel por dentro**. El estado sale del código de
> `onia-platform` `master` `b2d9d31` (8-oct, 14:44) y de los docs del 5-oct. `master` llega a producción con un cron cada
> 3 h (prompt de C13), pero «está en `master`» no es «se ve bien en pantalla». Las capturas de los referentes sí son de
> hoy. Las evidencias están en `hermes-content/research/competencia/ui-referentes/` (README ahí).

## 1. Lo que cambió respecto de lo que decían los docs (medido el 8-oct)

| Los docs decían | Hoy |
|---|---|
| El rediseño 1.0.1 (kit, Inicio, Agentes, barra inferior) está «en candidato», publicada: «sin dato» | **Está en `master`:** `components/ui/` trae `PropuestaCard`, `KpiTile`, `EmptyState` y `card.tsx`; `/pending` usa `PropuestaCard`; `BottomNav.tsx` pone el asistente al centro; `panel-hoy.tsx` y `agentes-pantalla.tsx` usan el kit. **Falta verlo en pantalla.** |
| B48: «las 11 páginas de venta se ven vacías hasta cargar el JS» | **No se reproduce.** Con JavaScript apagado y encendido, `/`, `/precios`, `/empezar`, `/agentes` y `/rubros` muestran la misma cantidad de texto (397, 1.084, 290, 428 y 433 palabras) y el titular se ve (commit `a9d19c6bb`). Queda un **hueco gris de ~150 px** bajo el titular en celular, mientras el bloque siguiente espera el scroll (`R/propia/precios-celular-8oct.png`) |
| Bug: «Se envía por WhatsApp a Lucía Mendoza» en la propuesta de Jorge Rivas | **No es un bug abierto.** Venía de datos de muestra; `pending-view.destinatario.render.test.ts` prueba que cada propuesta muestra SU destinatario. Se mira igual en la cuenta demo (fila G-01 de `ONIA_PROMESA_VS_PRODUCTO.md`) |
| Estados vacíos: «No hay datos» por todos lados | **Casi resuelto:** 15 archivos usan `EmptyState`. Quedan 3 «Sin datos aún» en `/reports`. No justifica una tarea aparte |
| Agenda por profesional, odontograma de 5 caras, caja diaria, presupuesto por fases, «Dejar de renovar» | **Siguen sin estar en `master`** (confirmado en el código): `/agenda` es la lista de hoy con «con quién es» cuando hay varios; `/appointments` es un mes; el odontograma no tiene caras por diente (el código no nombra oclusal, mesial, distal, vestibular ni lingual); WhatsApp ya escrito solo en «Mañana sin confirmar» (`ListaSinConfirmar.tsx`) |
| `/register` «ya está bien» | Paso 2 limpio (4 campos y uno opcional), pero dice **«versión 1.2»** de los términos mientras la web publica la 1.3 (C14), y **«sin tarjeta» no está junto al botón** (`R/propia/register-paso2-celular-8oct.png`) |

## 2. Cómo se priorizó

1. **Por el recorrido de la demo de 20 minutos** (`sales-kit/02-GUION-DEMO.md` §1.2): agenda (min 5-8), ficha (8-11) y
   Pendientes, «el momento» (11-15). Lo que el prospecto ve primero pesa más.
2. **Cerrar lo ya construido antes de abrir algo nuevo** (`CLAUDE.md`, «Nada a medias»): lo que espera solo un par de ojos
   va primero.
3. **Sin promesas nuevas:** una mejora que muestre algo que el catálogo no deja decir se baja de la lista.

## 3. La lista

**Quién:** *Plataforma* = necesita producción o criterio visual. *Codex* = código cerrado (ninguna hoy: ver §5).
**Sergio** = pasa por Sergio Urcullo antes de publicar (diseño nuevo o rediseño de una pantalla viva, `CLAUDE.md`).
Rutas de capturas: `R/` = `hermes-content/research/competencia/ui-referentes/`, `D/` = `hermes-content/research/competencia/`.

### A. Cerrar lo ya hecho (cero diseño)

| # | Pantalla | Referente | Qué cambia | Quién |
|---|---|---|---|---|
| A1 | Inicio, Agentes, Pendientes, barra inferior, y lo del 4-5-oct: «A medias» (Pacientes), «Deuda» (ficha), «Mañana sin confirmar» (Agenda), `/checkout`, `/help`, `/patients/import` | — (es lo propio) | **Mirarlas renderizadas con la cuenta**, a 375 y 1440 px, claro y oscuro (`auditar-app.mjs`). Hecho = capturas anotadas con lo que se vea mal | Plataforma, y **Sergio** las ve |
| A2 | Caja diaria (#110) y presupuesto por fases (parche P2) | Doctocliq caja `D/doctocliq/cuenta-de-prueba/54-…`, `56-…`; presupuesto `33-…`, `36-…` | Capturas, OK de Sergio, y la migración `20261004190000` (según el handoff de la nube) **antes** del swap | Plataforma, **Sergio** |

### B. El recorrido de la demo (agenda → ficha → Pendientes)

| # | Pantalla | Referente | Qué cambia | Quién |
|---|---|---|---|---|
| B1 | **Agenda** (`/agenda`, `/appointments`) | Dentalink semanal `R/img/dentalink_agenda_semanal.png` y «Dar cita» `R/img/dentalink_dar_cita.png`; AgendaPro panel lateral `R/crops/agendapro_agenda_panel_lateral.png` | Semana con **una columna por profesional**; **el hueco libre es el botón** («+» en cada hueco). «Dar cita» pide paciente y motivo, no 4 pasos; con **tres** filtros (profesional, duración, hueco), no siete. (P10-5, B01) | Plataforma, **Sergio** (diseño nuevo) |
| B2 | Agenda: la cita | Doctocliq popover `D/doctocliq/cuenta-de-prueba/06-agenda-cita-popover-estados.jpg`; AgendaPro (línea de «ahora») | Confirmado / Cancelado / Atendido como íconos en 1 clic desde la cita, y el resto escondido; eliminar al final y en rojo; línea de «ahora»; filtro «Solo disponibles hoy». (B02) | Plataforma, **después de B1** (mismo archivo, `AgendaClient.tsx`) |
| B3 | Agenda: reserva online | Dentalink diaria `R/img/dentalink_agenda_diaria.png` | Banda sobre la agenda: «Hay reservas por validar → Ver y validar». La parte de datos y el aviso son **C11a (Codex)**; la banda, Plataforma después. (B05) | Plataforma, tras C11a |
| B4 | **Ficha** (`/patients/[id]`) | Dentalink `R/img/dentalink_ficha_cabecera.png`, `R/img/dentalink_ficha_citas.png`, `R/crops/dentalink_ficha_antecedentes_f40.png`; Doctocliq `D/doctocliq/cuenta-de-prueba/27-pacientes-ficha-clinica.jpg` | Cabecera con **alertas médicas** fijas y visibles en todas las pestañas (alergia a la penicilina, no enterrada); «Agendar» y «Cobrar» en la barra de pestañas; contador en las pestañas (Citas 3). «Ver todo» el historial. (B12, P10-6) | Plataforma, **Sergio**; **después de aplicar P2** (mismo `FichaVista.tsx`) |
| B5 | Ficha: plan de tratamiento | Doctocliq `27-…` (línea de 4 pasos) | Línea de pasos que muestra «2 de 4» del tratamiento. **Solo muestra lo cargado; no promete detectar** nada (catálogo §8) | Plataforma, con B4 |
| B6 | **Odontograma** | Doctocliq `D/doctocliq/cuenta-de-prueba/28-…`, `29-…`; Dentalink `D/dentalink/odontograma.jpg` | **5 caras por diente** (oclusal, mesial, distal, vestibular, lingual), dentición infantil y catálogo de hallazgos. Hoy el código no distingue caras. El que más separa a Onia de «una agenda con cuaderno». (B13, P10-6) | Plataforma, **Sergio**; después de P2. Es el más grande |
| B7 | **Pendientes** (`/pending`) | Dentalink `D/dentalink/tareas-resultado.jpg` (lista y detalle en una pantalla) | El kit ya está. **Mirar** que la fila de botones no se corte en celular y que «Aprobar y enviar» sea el único primario. Las pestañas «Del día / Atrasadas N» y «Finalizar ▾» con 3 salidas **no van en la 1.0** (definir «atrasada» es decisión de Sergio; es P2) | Plataforma, dentro de A1 |

### C. Entrada y primera impresión

| # | Pantalla | Referente | Qué cambia | Quién |
|---|---|---|---|---|
| C1 | `/register` paso 2 | Dapta `R/crops/dapta_hero_d.png`; Hostinger `R/crops/hostinger_webhosting_top.png` (garantía y total junto al botón) | «Sin tarjeta» pegado al botón «Crear mi cuenta · 14 días gratis»; la versión de los términos, con C14 (1.2 → 1.3). Una línea | Plataforma, con C14 |
| C2 | Web de venta, celular | — (medido hoy) | Cerrar el hueco gris de ~150 px bajo el titular (el bloque siguiente se revela tarde) | web-factory; prioridad baja |
| C3 | Inicio | Dentalink panel `R/img/dentalink_panel_desempeno.png` | Separar «trabajo hecho» de «cobrado» y mostrar la diferencia como deuda. Hace falta definir «trabajo hecho»: **no va sin decisión de Sergio** | Plataforma, 1.1 |

### D. Se anota y no se hace en la 1.0

«Finalizar ▾» con tres salidas (B37) · pestañas «Atrasadas N» · barra lateral con Favoritos y extendida a Cobros y Contabilidad
(1.1-A) · «Primeros pasos» con anillo de progreso (Doctocliq `D/doctocliq/cuenta-de-prueba/01-…`; Onia ya tiene la guía) ·
«Búsqueda rápida de hora» (AgendaPro) · editor de fichas por rubro (AgendaPro) · calculadora de plan (Dapta).

## 4. Lo que NO se toma de los referentes (para no abrir una promesa)

- **Selector de sede arriba del menú (Hostinger, Dentalink).** Varias sucursales es «no se nombra» (catálogo §7).
- **Una pestaña visible que no funciona.** Doctocliq muestra «Este servicio es parte del CRM y no está incluido»
  (`D/doctocliq/cuenta-de-prueba/10-…`): es «obra a la vista», prohibida en la venta.
- **Precio tachado y «79 % off» (Hostinger), «Close 21x more deals» y «+50.000 empresas» (Dapta).** Onia no tiene
  descuentos ni clientes pagando: sería fabricar.
- **Pedir tarjeta en el alta (Lety).** En Bolivia corta el alta y la prueba es «sin tarjeta».
- **El mega-menú de ~20 ajustes (Dentalink), la tabla plana y la fecha gigante.** Contradicen «menos pasos, menos páginas».
- **Una calculadora de plan (Dapta).** Con 4 planes y un solo eje (usuarios), agrega un paso.

## 5. Para Codex: ninguna hoy

Revisé qué mejoras de la lista son «código cerrado» y no hay ninguna que Codex pueda correr sin chocar:

| Mejora | Por qué no es de Codex hoy |
|---|---|
| B1, B2 | Diseño nuevo; B1 y B2 tocan el mismo archivo (`AgendaClient.tsx`). Es de Plataforma (`hermes-content/docs/historial/orquestacion-vieja/codex-relevo.md` §7) |
| B4, B5, B6 | Mismo `FichaVista.tsx` que el parche P2; hasta aplicarlo, cualquier cambio rompe su `git apply` |
| B3 | Depende de que C11a (reserva avisa) esté mergeado |
| B7, A1 | Es mirar, no construir |
| C1 | Una línea: no vale una corrida; va con C14 |
| `/reports` «Sin datos aún» ×3 | Tres líneas de bajo valor |

**Cuándo sí:** B3 (la banda) pasa a Codex cuando C11a esté en `master`, y los arreglos que salgan de A1 (si son chicos),
con el código de ese día. Un prompt escrito hoy se quedaría viejo: `master` de `onia-platform` pasó de `97fe306` a `b2d9d31` entre mis dos lecturas del 8-oct.
Formato: `hermes-content/docs/historial/orquestacion-vieja/codex-tareas/` (META, PRUEBA DE HECHO, REGLA DE PARADA).

## 6. Cómo venden Lety y Dapta hoy (8-oct, solo páginas públicas)

| | **lety.ai** | **dapta.ai** |
|---|---|---|
| A quién le vende | A agencias que revenden IA con su marca. No a la clínica | Al negocio final: llamar a los leads y cerrar |
| Titular | «Sell AI. To any business. Get paid every month.» | «Create your first AI sales agent in 2 minutes» |
| Clics hasta empezar | 1 (a `app.lety.ai`); pide tarjeta, según la ficha del 3-oct | 0 para ver el alta, 1 con Google; sin tarjeta; botón «Claim my 2,000 credits» |
| Precio | En `/pricing`: $97, $297 y $497 al mes, más 4,9 / 2,9 / 1,9 % por transacción (dato nuevo) | En `/pricing`: $99, $499, $1.499 y a medida, con una calculadora antes |
| Primer beneficio | Plata de la agencia (ingreso mensual recurrente) | «Never miss a call»: no perder un lead |

**Qué le sirve a Onia:** un solo eje distingue los planes y el resto es igual; la frase de transparencia junto al precio; el
beneficio escrito en el botón del alta y «sin tarjeta» al lado. Ninguno de los dos le vende a una clínica dental de Santa
Cruz: no hay aquí un referente de cómo explicarle a un dueño de clínica el recall.

## 7. Decisiones de Sergio Urcullo que condicionan la lista

1. **Acento del panel:** petróleo `#12616B` o verde `#027650` (hoy conviven). Y **una tipografía** (hay cuatro versiones
   escritas). Sin eso, todo rediseño nuevo es provisorio.
2. **¿La web y la app pasan a «usted»?** `/register` mezcla «tenés» y «Cree su cuenta».
3. **Si el agente de WhatsApp sale de la venta** (`ONIA_PROMESA_VS_PRODUCTO.md` §3).
4. **Qué es «atrasada»** en Pendientes, y si «Aprobar y enviar» lleva ventana de deshacer.
5. **Los OK de A1 y A2:** lo único que no cuesta construir nada.

## 8. Tandas de competencia (una por semana; la más nueva arriba)

> Pedido de Sergio Urcullo por la madre (8-oct): **seguir investigando a la competencia y qué se puede copiar** (ideas que
> funcionan, no copia literal). Cada hallazgo lleva su versión Onia, el carril dueño y, si es código cerrado, la tarea para
> Codex en `hermes-content/docs/historial/orquestacion-vieja/codex-tareas/`. **Hecho de cada semana = esta sección + las fichas nuevas.**
> Solo web pública. Lo que pide login o Instagram va como «PEDIDO PC» en el transcript de la sesión.

### Tanda 2 · 9-oct (T1-9: la norma boliviana; fuentes primarias leídas, no resúmenes)

**Contestación a T1-9: hay norma, y la de historia clínica es más concreta que la de factura.** Leído hoy en el PDF oficial del
Ministerio de Salud (*Normas en Salud Oral*, 2010, R.M. 1320), la Ley 3131 (PDF del Ministerio) y el DS 28562 (copia de Lexivox,
no oficial). La lista de RND del SIN se leyó en `impuestos.gob.bo/index.php/rnd-2026/`.

| # | Hallazgo (con su fuente) | Versión Onia | Dueño | Codex |
|---|---|---|---|---|
| T2-1 | **El Ministerio pide historia clínica en todo paciente odontológico y guardarla ~10 años.** *Normas en Salud Oral*: la Historia Clínica «se utilizará en todos los pacientes que acudan al servicio… como norma establecida»; el **prontuario clínico** «es un documento fundamental y obligatorio… debe ser correctamente realizado y archivado por lo menos por unos 10 años», «puede ser realizado en forma manuscrita, o en medio magnético» (o sea, **el digital vale**), con 8 contenidos mínimos (a-h: datos del odontólogo y su matrícula, identificación, historia, examen, exámenes complementarios, plan, evolución, y autorización firmada si es menor). La **licencia de funcionamiento** la da cada SEDES y se renueva cada año | Gancho de pregunta, no de ley: *«¿Dónde está la ficha de un paciente que atendió hace 8 años? El Ministerio de Salud pide guardarla unos 10.»* Es gancho **secundario**: el dolor de entrada sigue siendo el tratamiento a medias (`ONIA_CLIENTE_IDEAL.md`); este solo apoya «ficha con historia clínica y odontograma» (catálogo §2, C-03 sin verificar por falta de cuenta). **No** se escribe «obligatorio por ley» ni «cumple la norma» (ver límites abajo). Candidato al **2.º anuncio de la prueba**, no al 1.º | Ventas y pauta | no |
| T2-2 | **El consentimiento informado y el secreto médico son documentos oficiales.** Ley 3131 art. 10: expediente, historia clínica y consentimiento informado son «documentos médicos oficiales», «bajo el resguardo y custodia del establecimiento de salud»; art. 12 j): deber de «cumplir con el llenado» de esos documentos; art. 12 k) y 13 c-d): secreto médico y confidencialidad, «aunque haya cesado la prestación de sus servicios». *Salud Oral*: la autorización de los padres para un menor va firmada. DS 28562 art. 14: lo informado al paciente se registra en la historia y lo firma el paciente o su representante | **Sin dato** si Onia guarda un consentimiento firmado (sigue abierto desde T1-6): se mira con la cuenta de prueba. Si no existe, **backlog de v1.2 y no se nombra**. La política de privacidad de Onia no se toca desde acá (texto legal: pasa por Sergio Urcullo) | Plataforma | no |
| T2-3 | **La factura NO tiene hoy una fecha que sirva de gancho.** Lo que se creía: los grupos 9-12 del SIN (RND 102400000004/05/12/25) vencían el 30-sep-2026 (RND 102600000007, 23-mar) y desde el 1-oct emitían solo en línea. **Lo que pasó el 30-sep:** la **RND 102600000038 abroga esas cuatro RND** (título leído en la lista oficial del SIN). Según un tercero que cita el PDF (LookupTax; **yo no leí el texto**): ya no hay plazos fijos por grupo, pero no es una exención, y el SIN «asignará periódicamente» la modalidad en línea a los contribuyentes del IVA que no la tengan, **sin fecha**. El régimen simplificado queda fuera (tercero, sin leer la RND) | **No hay «desde el 1 de octubre usted debe facturar en línea»: sería falso.** Y de todas formas **el SIAT de Onia sigue apagado en producción** (catálogo §7), así que tampoco se promete. Para ventas queda esto: la factura sigue siendo dolor de la clínica en régimen general, la asignación llegará sin aviso, y **Onia no puede aprovecharlo hasta que se encienda el SIAT** (decisión 1-oct: se termina). Sin dato de si una clínica de 2-6 profesionales está en régimen general o simplificado: es una pregunta más para la calificación de `ONIA_CLIENTE_IDEAL.md` | Sergio Urcullo + Plataforma | no |
| T2-4 | **Bots y software de clínicas hechos en Bolivia: no aparece ninguno por la web pública.** Dos búsquedas (bot WhatsApp + agenda + clínica dental + ciudades de Bolivia) devolvieron solo proveedores de otros países (Doctocliq, Cliniwin, DentalSoft Plus, GuruSup, AgendaPro). Coincide con la Biblioteca (TuDoc, Resulta, Softclinic: 0 anuncios) | **Ausencia de evidencia, no evidencia de ausencia:** el buscador es de EE. UU. y no ve Google Maps ni grupos de Facebook. No se escribe «no hay competencia local». Va a PEDIDO PC | madre | no |

**Límites de T2-1, dichos de frente (el titular se rompe si se ignoran):**
1. La *Norma de Salud Oral* es de **2010** y su segunda carátula dice «**DOCUMENTO DE TRABAJO**». No se confirmó que siga vigente ni que obligue a un **consultorio privado**: la mayor parte del texto habla de la red pública y de los SEDES (aunque define el alcance del «odontólogo público y/o privado» y pide licencia SEDES a todo servicio).
2. La **Ley 3131 regula el «ejercicio profesional médico»**; el texto leído no nombra al odontólogo. Su art. 2 sí cubre al sector privado con fines de lucro «legalmente autorizado», y ni la ley ni el DS fijan plazo de conservación (el «10 años» sale solo de la Norma de Salud Oral).
3. Una búsqueda mencionó que el DS 28562 da a las normas ministeriales **vigencia de tres años**; **no lo leí en el texto**. Si es cierto, la de 2010 estaría vencida y falta la versión vigente.
4. **Antes de usarlo en un anuncio:** (a) confirmar con el SEDES o el Colegio de Odontólogos de Santa Cruz cuál norma de expediente está vigente (**PEDIDO PC o llamada de Sergio Urcullo**); (b) como toca una norma, **lo ve Sergio Urcullo antes de publicar** (regla «textos legales»). Mientras tanto la pieza queda en brief, sin renderizar.

**Pedidos PC nuevos (para la madre):** (5) **Google Maps y Facebook:** «software odontológico Santa Cruz / La Paz / Cochabamba» y «sistema para consultorios Bolivia»: quién aparece, con qué precio y si tienen anuncios (T2-4); (6) **Instagram** de Doctocliq, Dentalink y CitaPro: reels y destacados de las últimas 4 semanas (pedido de la semana 2; pide login); (7) **llamada o mensaje a un odontólogo con consultorio** de Sergio Urcullo: «¿su SEDES le pide la historia clínica guardada? ¿cuántos años? ¿usa factura en línea?». No es contactar a un competidor: es un cliente potencial, pero lo decide él.

**Codex esta semana: ninguna tarea nueva** (T2-2 depende de mirar la cuenta de prueba y T2-3 de que se encienda el SIAT).

### Tanda 1 · 8-oct (fichas nuevas: `JELOU_FICHA.md`, `DATEC_FICHA.md`, `ANUNCIANTES_FICHAS_CORTAS.md`)

**Qué cambió desde el 1-3 oct** (texto del navegador de hoy): **Doctocliq** igual (USD 19/29/49 por doctor, 7 días sin tarjeta,
plan gratis de 30 pacientes al mes). **Lety** igual (97/297/497, 7 días con tarjeta). **Dapta** igual (Pro USD 99, 100k créditos).
**Dentalink** sigue sin precio público («Solicita tu cotización»). **AgendaPro:** `/pricing` da 404 hoy; la ruta cambió
(→ PEDIDO PC). **Jelou:** nuevo. **Datec:** integrador de Odoo, no compite con Onia en clínicas.

| # | Hallazgo (quién y cuánto lleva) | Versión Onia | Dueño | Codex |
|---|---|---|---|---|
| T1-1 | **Copy «No es X, no es Y… Es Z».** CitaPro lo usa en 3 anuncios que sobreviven (17-jul, 6-ago, 15-sep): *«No es agendar más citas… Es lograr que cada cita agendada se cumpla»* | Variante de A1 para el 2.º anuncio de la prueba: *«No es conseguir más pacientes. Es saber hoy quién de mañana no confirmó, con el mensaje listo para que usted lo apruebe.»* (el revisor de promesas da 0). Mide el gancho, no el producto | Ventas y pauta | no |
| T1-2 | **«7 días gratis · Sin tarjeta» arriba de la tabla de precios, y «Anual 2 meses gratis» como interruptor** (Doctocliq) | `/precios` y `/register`: «sin tarjeta» junto al botón (ya anotado en §1: hoy no está) | Plataforma | ya cabe en C1/C14: **no vale una corrida aparte** |
| T1-3 | **El bot se cobra por conversación con excedente en 3 de 3 competidores** (CitaPro USD 59/99 con 1.000/2.000 y USD 0,10 de más; Calendico USD 29 con 100; Huli MXN 8) **y Jelou, el grande, dejó de hacerlo**: *«pagaban lo mismo por un saludo que por una venta»* | Onia cobra el bot como cuota fija (~USD 33, `ONIA_ESTRATEGIA_DE_EMPRESA.md` §13.5). Con el cobro de Meta por respuesta desde el 1-oct, **la cuota fija tiene un hueco**. Decisión para Sergio Urcullo, con la cuenta delante (`pricing.ts`); refuerza las ideas 8 y 13 del `MAPA_COMPETENCIA.md` | Sergio Urcullo + Plataforma | no |
| T1-4 | **Las funciones de IA y los WhatsApp gratis solo en plan semestral o anual** (Doctocliq: Soyla IA y Marketing; 50-100 recordatorios) | Poner el bot o un cupo de mensajes dentro del plan largo: caja adelantada para el techo de Bs 1.400 del plan 1.0 | Sergio Urcullo | no |
| T1-5 | **Pedir reseña en Google Maps después de la cita** (CitaPro «reseñas automáticas», Calendico «+25 % de calificación», sin fuente) | **Add-on candidato que pasa el test de 3 preguntas** (§10): mismo cliente, depende de la cita atendida, sale solo. El mensaje se aprueba en Pendientes. El catálogo no lo menciona: **no se promete**. Va a v1.3, después de la 1.0 | Plataforma | cuando la 1.0 esté en `master` |
| T1-6 | **Consentimiento informado digital con firma en el celular** (CitaPro, Medizona, Doctocliq Básico) | **Sin dato** si existe en Onia (el catálogo no lo nombra): mirarlo con la cuenta de prueba. Si no existe, backlog de v1.2. No se vende | Plataforma | no |
| T1-7 | **Add-ons chicos de USD 10-15 al mes** (Calendico: cumpleaños, campañas de seguimiento, reseñas, doble recordatorio) | Hoy Onia tiene 3 add-ons. El ARPU (métrica 5 del §12) solo sube si se venden: candidatos que pasan el test = reseña (T1-5), cumpleaños, doble recordatorio. **Decide Sergio Urcullo cuál primero** | Sergio Urcullo | no |
| T1-8 | **«Build it for me»** (Jelou: la misma página de precios ofrece «lo armo yo» y «que me lo armen») | **No.** Falla la pregunta 3 del test: horas de Sergio Urcullo por cliente | — | — |
| T1-9 | **La norma como titular** (Medizona: NOM-024 «al 100 %»; Dt.Dental sostiene 100 días un video sobre el reporte obligatorio) | **Sin dato para Bolivia:** ¿hay norma de historia clínica o de factura que obligue a una clínica? La factura SIAT está prohibida de prometer (catálogo §7). Tarea de la semana 2 | Ventas y pauta | no |

**Codex esta semana: ninguna tarea nueva.** T1-2 va con C1/C14; T1-5 y T1-7 dependen de lo que decida Sergio Urcullo y de la 1.0;
un prompt escrito hoy se vería viejo (`master` de `onia-platform` se movió dos veces el 8-oct).

**Pedidos PC (para la madre, sin login salvo donde se dice):** (1) la Biblioteca de hoy de Dentalink, Doctocliq, CitaPro, Huli y
Reservo: anuncios que nacieron después del 2-oct, con su «en circulación desde»; (2) la web de **«Agenda Clínica» de NativeCode**
desde el enlace de su anuncio; (3) la ruta actual de precios de AgendaPro (Bolivia o Chile); (4) **con cuenta gratis, sin
tarjeta:** Doctocliq (7 días), Calendico (7 días) y Agenda en Día, para ver agenda, ficha y recordatorios por dentro. **No** se
pide la demo de CitaPro ni de Dentalink: es contactar a un tercero.

**Semana 2 (15-oct):** norma boliviana de historia clínica y de factura para clínicas (T1-9); Instagram de Doctocliq, Dentalink y
CitaPro; cómo venden los bots de clínicas en Bolivia (Datec no; buscar los locales).

