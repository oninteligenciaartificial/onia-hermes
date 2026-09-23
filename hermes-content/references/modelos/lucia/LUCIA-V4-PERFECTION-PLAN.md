# Lucía v4 — plan de perfeccionamiento de identidad

Estado: **preparado, sin generaciones ni entrenamiento ejecutados**

Fecha de auditoría: 2026-09-23

Autoridad de IDs, derechos y gates: `LUCIA-HIGGSFIELD-IDENTITY.json`

## Veredicto

Lucía todavía no tiene un master de identidad suficientemente sólido para producir en masa.
Las cinco imágenes de `canon/` son buenas referencias de dirección, pero no forman un dataset de
entrenamiento: repiten escenas, no incluyen cuerpo entero ni perfiles reales y presentan pequeñas
variaciones de estructura, pecas, tono de ojos y edad aparente.

La ruta recomendada es:

1. cerrar una identidad sintética maestra y su procedencia con permiso explícito de entrenamiento;
2. construir un banco curado de **20 imágenes** de esa misma identidad;
3. entrenar un Soul ID desde la web de Higgsfield;
4. comparar ese Soul contra los dos Elements vigentes con pruebas iguales;
5. promover un ganador sólo con datos;
6. animar únicamente stills ya aprobados.

No se debe entrenar con las cinco imágenes actuales ni reforzar el Element vigente hasta resolver
procedencia/derechos y aprobar visualmente el master.

## Por qué web para identidad y CLI para producción

- La guía web actual de Higgsfield pide **20 o más fotos, hasta 80**, y recomienda variedad de
  ángulos, expresiones, luz y al menos una toma de cuerpo entero.
- La skill oficial del CLI acepta **5–20**. Para no quedar por debajo de la recomendación web, el
  dataset v4 tendrá exactamente **20 aprobadas** y el entrenamiento inicial se hará desde la web.
- Un Soul entrenado aparece como Element y puede reutilizarse en Seedance. Eso permite que una
  sola identidad alimente imagen y video.
- Después de aprobarla, el CLI sirve para producción repetible, registro de parámetros, costos,
  hashes y reconciliación de jobs. El navegador queda para crear/ajustar identidad y QA visual.
- Playwright/VPS no debe conducir generaciones pagas ni aprobaciones humanas.

### Conflicto oficial que bloquea el origen del dataset

La ayuda de AI Influencer recomienda generar retratos y usarlos para entrenar un Soul ID, pero los
Términos 5.2(iv) prohíben usar Outputs de Higgsfield para entrenar modelos, salvo autorización
escrita. Hasta que Higgsfield aclare esa contradicción por escrito, **no se usarán outputs de AI
Influencer, Soul, Nano Banana ni otro modelo servido por Higgsfield como dataset de entrenamiento**.
El master y sus 20 tomas deben provenir de material propio o de una fuente/licencia que autorice
expresamente ese entrenamiento.

Fuentes oficiales:

- https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character
- https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-ai-influencer
- https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-soul-to-generate-images
- https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-seedance
- https://github.com/higgsfield-ai/skills
- https://higgsfield.ai/terms-of-use-agreement

## Auditoría visual del canon actual

| Archivo | Utilidad | Observación | Estado para entrenar |
|---|---|---|---|
| `canon/01-rooftop.jpg` | tres cuartos, gesto natural, piel y pecas visibles | rostro algo más largo; desciende de la misma referencia que 02/03 | conservar como comparación; no aprobado para dataset |
| `canon/02-rooftop.jpg` | tres cuartos opuesto, estructura clara | la mano del vaso tiene seis dedos; luz lateral fuerte | excluir del entrenamiento |
| `canon/03-cafe.jpg` | frontal suave, mirada al lente, manos correctas | fondo con terceros; comparte genealogía con 01/02 | mejor candidata a master visual, no a entrenamiento todavía |
| `canon/04-cafe-celular.jpg` | mirada baja y gesto funcional para UGC | deriva del Element antiguo de una foto; cara afinada y mano/celular dominantes | excluir del dataset v4; conservar como historial |
| `canon/05-profile.jpg` | detalle de piel, ojos, cejas y pecas | no es perfil; gran angular cercano, ojos más claros, pecas densas y rojez | excluir del entrenamiento; usar sólo como referencia de textura histórica |

Huecos objetivos: perfil izquierdo, perfil derecho, sonrisa con dientes, expresión hablando,
ángulos alto/bajo, cintura, cuerpo entero, sentada, caminando y luz interior neutra. Cinco imágenes
no alcanzan para medir consistencia ni cumplen la recomendación web vigente.

## Master v4: rasgos congelados

Los rasgos no se reescriben en cada prompt; se aprueban una vez y se conservan en el dataset:

- mujer boliviana de 26 años, edad aparente constante 25–28;
- rostro ovalado y mandíbula suave;
- ojos marrón cálido, almendrados, sin cambiar a avellana clara;
- cejas oscuras naturales, gruesas pero no rectas ni laminadas;
- nariz y labios con proporción idéntica al master aprobado;
- piel oliva cálida con poro real;
- pecas finas y contables sobre nariz y pómulos, sin aumentar ni borrarse;
- pelo castaño oscuro, raya al medio, textura natural y largo fijo;
- argollas pequeñas y cadenita fina de oro;
- maquillaje cero o imperceptible, sin smoothing ni look de campaña.

Antes de producir las 20 imágenes, Sergio aprueba **un solo retrato master**. Si el master cambia,
todo el dataset vuelve a cero; no se mezclan dos familias de cara.

## Dataset v4 — 20 tomas obligatorias

Cada imagen debe tener una sola persona, cara nítida, mínimo 1024 px, sin filtros, obstrucciones,
texto ni marcas. Se conserva ropa, pelo, edad y joyería; cambian controladamente pose, expresión,
distancia y luz.

| # | Toma | Expresión / propósito |
|---:|---|---|
| 01 | frontal cerrado | neutral |
| 02 | frontal cerrado | sonrisa leve |
| 03 | frontal cerrado | sonrisa con dientes |
| 04 | frontal cerrado | hablando, boca apenas abierta |
| 05 | tres cuartos izquierdo | neutral |
| 06 | tres cuartos izquierdo | sonrisa leve |
| 07 | tres cuartos derecho | neutral |
| 08 | tres cuartos derecho | sonrisa leve |
| 09 | perfil izquierdo real | oreja y nariz visibles |
| 10 | perfil derecho real | oreja y nariz visibles |
| 11 | cámara levemente alta | mirada al lente |
| 12 | cámara levemente baja | mirada al lente |
| 13 | cabeza y hombros, interior | luz suave neutra |
| 14 | cabeza y hombros, exterior | sombra abierta, sin sol duro |
| 15 | plano cintura frontal | brazos relajados |
| 16 | plano cintura tres cuartos | gesto natural con manos |
| 17 | cuerpo entero frontal | postura neutra |
| 18 | cuerpo entero tres cuartos | postura neutra |
| 19 | sentada | manos visibles |
| 20 | caminando | gesto natural, cara nítida |

Se pueden producir 24 candidatas para descartar 4, pero **al entrenamiento entran 20**, no las 24.
Cada archivo aprobado registra `source_model`, `source_asset_or_job_id`, prompt/ajustes, hash,
licencia/permiso y `training_rights_status`.

## Prueba A/B con parada temprana

### Carriles

- A: Element `lucia-skin-v1` — baseline actual.
- B: Element `lucia-surgical-anchor` — respaldo.
- C: Soul ID v4 — candidato nuevo.

No se mezcla Marketing Studio en esta prueba: es otra superficie de identidad. Se revalida después
con el ganador.

### Fase 1 — screening mínimo

Mismo prompt, aspecto, calidad y composición; cambia únicamente el carril de identidad.

1. primer plano frontal, luz interior neutra;
2. tres cuartos en café, manos visibles;
3. cuerpo entero caminando en oficina/comercio.

Total: 9 stills. Si un carril tiene un fallo duro de identidad en 2 de 3 escenas, se elimina y no
consume más pruebas.

### Fase 2 — confirmación sólo entre finalistas

Tres escenas nuevas: exterior con sol suave, expresión hablando y perfil. Dos repeticiones por
escena y finalista para no confundir una salida afortunada con consistencia. Sólo se ejecuta si la
Fase 1 no produjo un ganador claro.

### Puntuación ponderada por imagen

| Criterio | Peso | Fallo duro |
|---|---:|---|
| identidad facial: proporciones, ojos, nariz, mandíbula, pecas | 50 | otra persona, ojos de otro color, pérdida de pecas |
| consistencia entre escenas | 15 | cambio visible de edad o familia facial |
| naturalismo: piel, pelo, luz, manos | 15 | piel plástica o anatomía rota |
| adherencia a pose, ropa y escena | 10 | ignora el brief central |
| utilidad comercial/UGC | 10 | parece stock, campaña artificial o no vende la situación |

Pasa una imagen con **88/100 o más** y al menos **46/50 en identidad**. Gana un carril sólo si
promedia 88+, su peor imagen llega a 82+, no tiene fallos duros y supera al siguiente por 5 puntos o más. Con diferencia menor,
se ejecuta Fase 2; no se decide por intuición.

## Paso a video

1. Elegir un still 11/11 con la rúbrica existente.
2. Prototipar una acción simple a 720p y duración corta.
3. Prompt de video: acción, entorno/luz, movimiento de cámara, atmósfera. No redescribir la cara.
4. Cambiar una sola variable por iteración.
5. Revisar inicio, 1/3, 2/3 y final; prestar especial atención desde el segundo 5.
6. Sólo después escalar resolución o duración.

Seedance 2.5 es el candidato principal para producción seria; Seedance 2.0 queda para requerimiento
4K. La comparación de identidad se hace sobre el still y sobre los cuatro fotogramas del clip.

## Gates antes de gastar

- derechos y permiso de entrenamiento resueltos por cada referencia;
- aclaración escrita de Higgsfield si se pretende entrenar con Outputs de su propia plataforma;
- master v4 aprobado por Sergio;
- 20 imágenes con manifest completo y QA visual;
- sesión Higgsfield válida y plan compatible;
- esquema/modelo consultado en vivo;
- costo mostrado/cotizado en vivo y cap explícitamente aprobado;
- hash de inputs y parámetros registrado;
- un job reconciliado antes de reintentar.

## Estado de ejecución

- Auditoría local: **completa**.
- Investigación oficial: **completa al 2026-09-23**.
- Dataset v4: **no iniciado**.
- Soul ID v4: **no entrenado**.
- Créditos gastados en esta revisión: **0**.
- Próximo gate humano: aprobar el retrato master y el cap de la Fase de construcción del dataset.
