# El equipo de contenido con IA: seis empleados, y el bucle gira sin vos

- **Fuente:** https://www.instagram.com/p/DclP6haArSU/ · @no se dice en pantalla
- **Tipo:** SaaS · **Veredicto:** SIRVE YA
- **Cobertura:** las 9 láminas, al 100%. Marcado por Sergio como "estilo de carrusel".
- **Medido:** Carrusel de 9 láminas.

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Portada:** *"he montado **mi equipo de contenido con IA** que trabaja sin mí"* — seis hombres de traje con máscaras de robot pixelado, cada una rotulada: investigador, diseñador, analista, ganchero, publicador, guionista.
- **`01 EL INVESTIGADOR`** — *"Encuentra la oportunidad antes que nadie."* Tareas: `VIGILA COMPETENCIA` (qué publican y qué les funciona) · `DETECTA PATRONES` (ve la tendencia antes de que reviente) · `GUARDA LO QUE PEGA` (archivo de referencias que convierten) · `ABRE NICHOS` (encuentra huecos sin explotar). Fuentes: REELS, TIKTOK, SHORTS, X, REDDIT. **Entrega:** informes de tendencia · ideas de contenido · referencias · huecos de nicho. Ciclo: DESCUBRE → RECOGE → REPORTA.
- **`02 EL GANCHERO`** — *"Es el dueño de los dos primeros segundos."* `ESCRIBE APERTURAS` (diez opciones por cada idea) · `ABRE CON DATOS` (los números ganan a las promesas) · `MATA LO BLANDO` (lo genérico muere en el borrador) · `AJUSTA EL FORMATO` (un gancho distinto por plataforma). Y el número que define el rol: **`10 ESCRITOS · 3 SOBREVIVEN · 1 SE PUBLICA`**. Ciclo: ESCRIBE → CORTA → ENTREGA.
- **`03 EL GUIONISTA`** — *"Cada palabra está puesta a propósito."* `ESTRUCTURA` (gancho, hueco, epifanía, lección, cierre) · `REESCRIBE EN TU VOZ` (tus muletillas, tus giros) · `NOTAS DE VOZ` (grabás una idea, sale un guion) · `TELEPROMPTER` (ritmo marcado para grabar del tirón). Reglas: `GANCHO 3s · VALOR EL FONDO · PRUEBA DATOS · CTA LA PETICIÓN`. Ciclo: IDEA → ESCRIBE → PULE.
- **`04 EL DISEÑADOR`** — *"Diseña cada pieza con tu marca puesta."* `APLICA TU BRANDING` (paleta, fuentes y universo visual) · `MONTA CARRUSELES` (de la idea a los JPG finales) · `PORTADAS QUE ABREN` (miniaturas pensadas para el clic) · `REVISA ANTES` (nada sale con un solape). Ciclo: BRIEF → DISEÑA → EXPORTA.
- **`05 EL ANALISTA`** — *"Te dice qué funcionó de verdad."* `ENCUENTRA GANADORES` · `COMPARA` (tu cuenta contra las mejores del nicho) · `APRENDE PATRONES` (qué formato, qué día, qué gancho) · `AJUSTA LA ESTRATEGIA`. Regla: `REPETIR LO QUE PEGÓ · MATAR LO QUE NO · ESCALAR LO MEJOR`. Ciclo: MIDE → ANALIZA → OPTIMIZA.
- **`06 EL PUBLICADOR`** — *"Publica a tiempo. Todos los días."* `PROGRAMA LA COLA` · `TODAS LAS CUENTAS` (un guion, publicado en paralelo) · `ADAPTA EL CAPTION` (cada red con su texto y su CTA) · `NO FALLA UN DÍA`. Ciclo: PROGRAMA → PUBLICA → CONFIRMA.
- **Lámina del bucle (roja):** `EL BUCLE GIRA SIN TI` — INVESTIGA · GANCHO · GUION · DISEÑO · DATOS · **PLANIFICA — OPERACIONES** · PUBLICA · **REPITE**. Y el remate: **`TU ÚNICO TRABAJO ES APROBAR`**.
- **CTA:** `7 EMPLEADOS · UN SOLO SETUP` — *"Te paso el setup completo: los siete empleados, sus instrucciones y cómo se conectan."* → `COMENTA "EQUIPO"`.

## Cómo está hecho — la reconstrucción

- **La inconsistencia, y la digo:** muestra **6 roles numerados** pero vende **"7 empleados"**. El séptimo es *Operaciones*, que sólo aparece nombrado en la lámina del bucle y nunca tiene lámina propia. O falta una lámina, o el número está inflado para el CTA.
- **Lo que hace que el carrusel funcione:** cada rol tiene exactamente cuatro tareas, un departamento, una lista de lo que entrega y un ciclo de tres verbos. Esa rejilla se repite idéntica seis veces, así que a la tercera lámina el ojo ya sabe dónde mirar. Es el patrón de repetición estricta del deduplicado del 23-ago, aplicado bien.
- **Contra lo nuestro:** Onia ya tiene módulo de agentes y ONIA Center con agentes corriendo por cron. Este carrusel no aporta capacidad — aporta **el vocabulario y la forma de presentarlos**. Nombrar los roles como empleados con departamento y entregable es más vendible que "9 agentes cableados".
- **Y la promesa a copiar es la última línea:** *"tu único trabajo es aprobar"*. Eso es exactamente lo que vende un agente human-in-the-loop, dicho en cinco palabras.

## El estilo, como conocimiento portable

Fondo **negro puro**, y cada rol tiene su color: azul `#2E6BE6`, naranja `#E8622A`, amarillo `#E8A020`, violeta `#7B4FD8`, verde `#1FA971`, cian `#2AA5A5`. Numeral gigante en **serif display** del color del rol, junto al nombre en serif condensada blanca en mayúsculas. Mascota robot pixel-art del mismo color a la derecha. Las cuatro tareas van en tarjetas gris muy oscuro redondeadas, con icono lineal + título en bold + descripción chica. Banda `LO QUE ENTREGA` en tarjeta con tinte rojo. Los tres verbos del ciclo abajo, en serif **contorneada roja**. La lámina del bucle invierte todo: fondo rojo, texto blanco. Es un sistema, no una plantilla — y esa disciplina es lo que hay que copiar.

**Se porta a:** `hermes-content/references/ui-patterns/carrusel-roles-numerados/` — la rejilla de rol (4 tareas + departamento + entrega + ciclo de 3 verbos) sobre negro con color por rol.

## Las tres preguntas

1. **Frente:** marketing / motor de contenido, y de rebote el módulo de agentes.
2. **Herramienta nuestra:** HyperFrames para renderizar. Los agentes ya existen: ONIA Center corre varios por cron.
3. **Qué falta:** Nada técnico. Falta decidir qué agentes NUESTROS están encendidos de verdad, porque solo esos pueden aparecer.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R01](prompts-lote-2026-08-28/R01-equipo-de-contenido-ia-seis-empleados.md)
