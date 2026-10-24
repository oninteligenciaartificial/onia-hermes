# Revisión final independiente: estrategia y prototipos privados A/B/C

Fecha: 23-oct-2026. Task: task_87ff77116cad. Dispatch: ctx_7c4448be9ead.

**CAMBIOS NECESARIOS**, limitados al grupo de copy de C descrito abajo. La implementación y las composiciones permiten comparar direcciones de marca; no hace falta rehacer el diseño ni completar tres sitios. No se aprueba publicación, integración a la web vigente ni apertura de venta.

## Integridad, alcance y cuatro grupos de estrategia

- Los **40 archivos del snapshot** coinciden antes y después de las pruebas. Incluyen estrategia y stack más **38 archivos reales dentro de diseno-workshop/**, de los cuales **25 son PNG**. No se adopta un conteo supuesto de 37.
- **19/19 originales y 69/69 del complemento corregido** siguen coincidiendo con sus snapshots.
- Leídos estrategia corregida, STACK-DISENO, README, QA.json, index.html, styles.css, app.js, dictamen previo y canon. Inspeccionadas visualmente las 12 capturas hero/página completa de A/B/C en 1440 y 390, contrastadas con el DOM actual.
- Los cuatro grupos del dictamen de estrategia están corregidos documentalmente: público de Erik sin exclusividad (:48,:57); duración/cuenta/eje (:110,:120–128,:170–172); bocetos antes de decidir y activos/stack ya existentes (:162,:196–198,:240–245); contrastes históricos identificados y snapshot correcto (:46–47,:163,:257). La implementación introduce dos discrepancias en C, no invalida esa corrección documental.

## Hallazgo prioritario único: coherencia de oferta en C

**Bloqueante para aprobar el paquete como representación fiel de la oferta.**

1. `diseno-workshop/index.html:177`: el hero de C dice «un taller de 90 minutos» sin distinguir contenido y pausa. Se reproduce en C-hero-1440x900.png, C-hero-390x844.png y DOM real de ambas anchuras. Aunque :205 aclara 90 + 5 más abajo, la primera pantalla sigue ambigua. Cambiar esa frase por «90 minutos de contenido, más una pausa de 5», coherente con A:34, B:140 y el canon.
2. `index.html:192`: «No hay certificado, grabación ni promesa de ahorro» convierte la grabación en una ausencia asegurada. `TALLER_31_OCT.md:23` dice **no se promete grabación**; A:121 lo expresa correctamente. Usar «No hay certificado; no se promete grabación, ahorro ni resultados» o redacción equivalente que conserve esa distinción, sin inventar una nueva condición.

Corrección concreta: solo copy señalado en C y actualización de sus capturas afectadas, QA/hashes según los bytes finales. Revalidar estos hallazgos en forma acotada; no repetir referentes, construir sitios adicionales ni abrir otro barrido por iniciativa propia.

## Pruebas ejecutadas por este revisor

Evidencia estructurada: `.hermes/tasks/workshop-design-codex-tests.json`. **Chromium 149.0.7827.55 real, headless**, con Playwright ya instalado en web-factory mediante createRequire. Carga por file://, fuentes locales y reduced motion; sin servidor ni instalaciones. El primer intento sandbox falló con EPERM al leer playwright/index.js; la misma prueba autorizada se ejecutó mediante excepción nativa require_escalated, sin rutas alternativas ni cambios de permisos/configuración.

- **Seis combinaciones A/B/C × 1440/390:** selector muestra solo el main elegido, aria-pressed y query ?d corresponden; un H1 visible; cero overflow (scrollWidth = clientWidth = ancho).
- **CTA local en las seis:** diálogo abre, informa inscripción no habilitada, Escape y botón cierran, foco vuelve al CTA y URL no cambia. Ningún formulario, enlace a WhatsApp, pago o red externa: links solo #contenido; solicitudes externas cero.
- **FAQ de A en ambas anchuras:** abre y cierra por clic. B/C son exploraciones sin FAQ deliberadamente; no se les exige completitud de A.
- **Teclado real, A en 1440/390:** Tab llega al CTA; :focus-visible activo, contorno verde sólido 3 px con offset 3 px; Enter abre y Escape cierra/restaura foco. La propiedad de foco obtenida antes tras clic/programmatic focus no se confundió con esta prueba de teclado.
- **CTA del hero, bottom en CSS px:** A 580.52/666.16; B 492.05/564.72; C 448.45/594.17 (1440/390). Todos dentro de 700. A a 360: 720.39, sin overflow; límite ya declarado en QA, no fallo del criterio contratado solo para 1440/390.
- **Contrastes críticos computados** sobre fondos sólidos: CTA A 16.036:1, B 11.629:1, C 8.158:1; etiquetas/notas/microtexto/rótulos y cierres muestreados pasan 4.5:1 (menor par de esta muestra: C nota/micro, 6.947:1). No se afirma auditoría completa WCAG ni contraste de todos los nodos.
- **Cero pageerror** y las tres familias locales cargadas. Hashes de HTML/CSS/JS durante la prueba coinciden con snapshot; el app.js actual sí fue ejecutado, no solo su QA anterior.
- Tamaño actual HTML+CSS+JS **29,351 bytes** (<200 KiB); paquete completo sin PNG **246,336 bytes** (<2 MiB, incluyendo docs/QA/log/licencias). QA separa un subconjunto código+assets de 221.2 KiB; no se confunde con peso del árbol entero. No se midieron LCP/CLS/INP, tactilidad, WebKit o Firefox.

## Evaluación visual y comercial

**Sí son distinguibles y legibles para decidir una dirección:** A comunica método con hoja y composición editorial asimétrica; B vuelve protagonista el formato con reloj 90+5 y eje oscuro; C introduce voz humana, retrato y preguntas/respuestas en columna sin imitar una app. Son diferencias de jerarquía y recorrido, no simples paletas. A es la base más completa para evaluar la oferta; B/C sirven como exploraciones comparables, tal como declara README y el pie de página.

Las capturas leídas corresponden al contenido y dimensiones del DOM probado; no se generaron nuevas capturas ni se afirma igualdad píxel a píxel. Las tablas y texto responden sin corte horizontal a 390, aunque A es más larga y B concentra texto en una columna estrecha del eje. Son rasgos comparables, no bloqueantes añadidos.

Voseo, fecha/hora y promesa lista/costo/prioridad/primer paso preservados salvo la ambigüedad señalada de C. Ejemplos rotulados inventados, cálculo de 10×5 y supuesto de cuatro semanas explícitos; tiempo no equivale a ahorro o dinero demostrado. Tramos 15×Bs50/20×Bs60/15×Bs70 solo como estructura, no precio vigente ni cupos disponibles. Venta pausada y CTA inocuo comprobados. No se requieren QR, teléfono, pagos ni decisión de marca definitiva para revisar estas propuestas privadas.

No se modificaron prototipo, estrategia, capturas, snapshots ni oferta. Solo se crearon este informe y el JSON de pruebas fuera del snapshot. La aprobación visual corresponde a Sergio después de recibir las capturas; corregir C no autoriza publicar ni acredita investigación completa o conversión.
