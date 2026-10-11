# Tanda semanal de competencia · 11-oct (qué cambió desde el corte del 10-oct)

> **11-oct-2026, 07:27 UTC · Ventas y pauta · tarea 3 de la MADRE MARKETING (skill `onia-ventas-pauta` §8.1).** Solo lectura con el conector `Meta_ads` (`ads_library_search`). **No se creó nada, no se gastó nada, no se contactó a nadie. No hace falta ninguna captura desde la PC para esta tanda.**
> **Método:** los 15 `page_id` de `BIBLIOTECA-10OCT.json`, `ad_active_status: ACTIVE`, **sin `countries`** (igual que el corte; con países da menos: Doctocliq 19 en vez de 30). La lista sale ordenada por **fecha de creación**, así que un anuncio nuevo aparece arriba; **una reactivación de un anuncio viejo no se ve**. Se pidieron los 4-12 más nuevos de cada anunciante y el `estimated_total_count`. El conector no entrega formato, texto principal, botón ni público. **Los 65 ids del tope se transcribieron a mano de las respuestas** y el cruce contra el JSON lo hizo un script: un error de tecleo aparecería como «ausente del JSON», por eso los casos que cambian una conclusión (Calu, Reservo, DoctorPro, Huli) se confirman además por el `estimated_total_count` de la propia Biblioteca.
> **Corte de comparación:** 10-oct 22:00 UTC (`1791669600`).

## 1. Anuncios nuevos desde el corte

| Anunciante | Qué apareció | Detalle | Para Onia |
|---|---|---|---|
| **Huli México** | **4 anuncios** (de 77 activos hoy) creados el 10-oct 22:37-22:39 UTC, con inicio el 11-oct 00:03-00:21 UTC | «Digitaliza tu consultorio con Huli sin miedo y validado por la NOM 024» ×2 (`1765027094800891`, `1330272229050643`) · «5 años usando HuliPractice» (`2972295956451275`) · «No pierdas dinero por citas canceladas» en negritas unicode (`1767757007830278`). Se pidieron solo los 4 más nuevos: **puede haber más** | Nada: la NOM 024 es de México y no aplica a Bolivia. «Citas canceladas» confirma que el ángulo del dolor lo usan otros, no que dure |
| **AgendaPro** | **2 anuncios** con inicio el 11-oct 06:14 y 06:50 UTC (creados el 9-oct, así que son programados o reactivados) | «Tu salón, siempre lleno» ×2 (`2305152393618828`, `28435486159411510`). Total 315 (313 en el corte). «La IA que agenda por ti» (`1438784064868485`, creado el 10-oct 15:00 UTC) ya estaba | Otro rubro (salón). Siguen con el mensaje de «IA» (la serie «Sofía») |
| Doctocliq · CitaPro · Dt.Dental · Wa7pro | **Ninguno** | 30 = 30, 16 = 16, 31 = 31 y 2. El más nuevo de Doctocliq es del 28-sep; el de CitaPro, creado el 2-oct; los 4 más nuevos de Dt.Dental, del 9-oct | La competencia que más dura **no cambió de creativos en 24 h**: lo que dura, dura |
| **Dentalink** (el único que alcanza Bolivia) | Ninguno para Bolivia | Con `countries: BO`: 4 anuncios, creados el 30-sep y el 5-oct («Gestiona tu clínica fácil», «Más que una simple agenda», «Simula sonrisas con IA», «Dicta y la ficha se llena»). Sin `countries`, hay 5 anuncios más de «¡30 % DCTO Cyber Extendido!» y «Agenda con IA 24/7» creados el 9-oct que **no aparecen con alcance a Bolivia** en la consulta con `BO` | Ningún anunciante fichado le pauta algo nuevo a Bolivia |
| Calu · Reservo · DoctorPro · Karbonna · Alegra | Ninguno creado después del corte | Pero ver §2: sus listas del 10-oct estaban incompletas | — |
| **Clínicas bolivianas** (búsqueda «clínica dental Santa Cruz», `BO`) | 79 activos hoy; los 8 más nuevos son clínicas (cursos de bruxismo, «Pink Glow», «Semana Invisalign 12 al 16 de octubre») | — | Ningún software de gestión boliviano nuevo entre los más nuevos |

**Lo que no cambia la prueba 1:** ninguno de los 6 anuncios nuevos copia un formato que Onia no tenga, y ninguno es de gestión de clínicas dentales para Bolivia.

## 2. Hallazgo que corrige el estudio del 10-oct: el corte no era una lista completa

36 de las 65 filas del tope de las listas de hoy **no estaban** en `BIBLIOTECA-10OCT.json`, y solo 6 (las de Huli y AgendaPro de arriba) se crearon después del corte. Las otras 30 **existían antes y el corte no las trajo**.

| Anunciante | 10-oct (estimado de la Biblioteca / vistos) | 11-oct (estimado) | Ids de hoy ausentes del JSON y creados antes del corte |
|---|---|---|---|
| **Calu** | 5 | **13** | al menos 4 (creados entre el 18-sep y el 9-oct) |
| **Reservo** (2 páginas) | 1 + 4 vistos | **58** | 6 |
| **DoctorPro** | 7 vistos | **56** | 10 (7 «Tu consultorio, más organizado» del 8-oct y 3 «3 Meses Gratis» del 5-oct) |
| **Huli México** | 20 (16 vistos) | **77** | — (los 4 nuevos van en §1) |
| **Karbonna** | 4 vistos | 8 o más | 1 |
| Dentalink | 92 (186 el 8-oct) | 190 | 4 («30 % DCTO Cyber Extendido» del 9-oct) · el 92 del corte parece un subconteo |
| Doctocliq · CitaPro · Dt.Dental · Wa7pro | 30 · 16 · 31 · 2 | 30 · 16 · 31 · 2 | 0: **coinciden** |
| AgendaPro | 313 | 315 | — |

- **Causa: desconocida.** Puede ser un fallo del conector ese día, pausas de fin de semana (el 10-oct era sábado: una hipótesis es que algunas cuentas B2B programan de lunes a viernes) o retraso de la Biblioteca. **No se sabe cuál** y no se puede probar desde el conector.
- **Qué se retira:** en `fichas/calu.md`, en la skill (R3) y en `ONIA_ADQUISICION_Y_PAUTA.md` §2.6.2 decía que los anuncios de prueba de Calu «dejaron de aparecer» y que eso era un **contraejemplo** a la oferta de prueba. **No se sostiene:** hoy Calu aparece con 13 anuncios y sus «Probá Calu Gratis» siguen (`1020546507258888`, desde el 11-ago: 61 d; `4123186177973035`, desde el 4-sep: 37 d), igual que «Conocé Calu en 2 minutos» (`2054036308538572`, desde el 24-ago). **La conclusión «Calu ya no pauta la prueba» era un artefacto del corte**, y la regla de que la muerte de un anuncio se infiere al volver a pedir los ids tiene que repetirse **otro día** antes de afirmarlo.
- **Qué queda:** los totales y porcentajes del 10-oct (271 · 62 · 417 · 41) son **un piso**, no una cifra. Lo que se apoyaba en anunciantes cuyas listas coincidieron (Doctocliq, CitaPro, Dt.Dental) se mantiene.
- **Sensibilidad** (`biblioteca-estadisticas.mjs` con `lista_completa: false` para Calu, Reservo, Huli, DoctorPro y Karbonna; 82 anuncios, 27 de más de 30 d):

| Clase de titular entre los que duran | Con todo el corte (n = 33) | Solo listas que coincidieron (n = 27) |
|---|---|---|
| control / aspiración | 12 (36 %) | **12 (44 %)** |
| norma / legal | 6 (18 %) | **2 (7 %)** |
| CTA o demostración en el titular | 4 (12 %), p ≈ 0,09 | **4 (15 %), p ≈ 0,04**, pero **un solo anunciante** (Doctocliq) |

  Lectura: «control» sigue primero con y sin el corte flojo; **«norma» pierde fuerza** (4 de sus 6 salían de las páginas que no coincidieron, sobre todo Reservo) y **la oferta en el titular gana fuerza** sin dejar de ser un solo anunciante. **Ninguna cambia lo que Onia hace en la prueba 1:** todas las piezas ya llevan «Pida su demostración gratis» y el filtro del dueño.

## 3. Qué se corrigió en el repo por esto

- `BIBLIOTECA-10OCT.json`: `meta.re_medicion_11oct` y `re_medicion_11oct` por anunciante (los totales no se tocaron).
- `fichas/calu.md` y `LECTURAS.json` (la inferencia retirada), `fichas/README.md` (aviso de que «lista completa» no se confía en 5 anunciantes).
- Skill `onia-ventas-pauta` §8.3 (R3) y §8.5 (**R11**: una consulta de un día no es una lista completa).
- `ONIA_ADQUISICION_Y_PAUTA.md` §2.6.2 (el contraejemplo de Calu) y `PRUEBA-1-PIEZAS.md` (la fila de N3).

## 4. Qué sigue (y quién)

| Qué | Quién | Cuándo |
|---|---|---|
| **Re-medir completo entre semana** (los 15 `page_id`, hasta 50 por consulta, más `search_terms` distintos para los grandes) y volver a correr `biblioteca-estadisticas.mjs` y `biblioteca-fichas.mjs` con dos cortes | Ventas y pauta (conector, sin PC) | **Propongo el mar 13-oct** en vez del 24-oct: así se compara un día de semana contra un sábado. Es lectura, cero gasto |
| Capturas de los 4 anuncios nuevos de Huli y los 2 de AgendaPro | La madre desde la PC | **No hacen falta**: no cambian ninguna pieza |
| Decir si el re-corte se hace antes o se espera al 24-oct | La madre | Hoy |

**Lo que esta tanda no sabe:** si los 6 anuncios nuevos son el comienzo de un lote mayor (Huli subió de 20 a 77 activos: se vieron 4); qué formato, texto y botón tienen (el conector no los da); por qué el corte del 10-oct quedó incompleto.
