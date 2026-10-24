# Stack de diseño del workshop — propuesta privada

Estado: herramientas y captura verificadas por Hermes; estrategia y nueva dirección visual aún pendientes. No publicar, abrir ventas ni sustituir identidad aprobada. Pedido de Sergio: referentes → estrategia → marca/web → capturas para decidir.

## Decisión técnica

Conservar el formato de la página existente `hermes-content/sitio-sergiourcullo/auditoria/index.html`: HTML semántico, CSS con variables, JavaScript nativo solo para interacción necesaria. No introducir React/Next, otro generador, plugins ni instalaciones. Es la página de marca personal, no una nueva web de cliente de Web Factory. Reutilizar su arquitectura compatible; NO editar aún la página actual mientras se evalúan direcciones privadas.

Para la exploración, producir archivos privados autocontenidos o con assets locales dentro del paquete del workshop. Tras aprobación visual se podrá proponer integración a la ruta existente; este encargo no autoriza deploy ni apertura.

## Herramientas y activos comprobados

- `playwright` se resuelve y ejecuta desde `C:/dev/proyectos/onia-hermes/web-factory`. No depender de su mera declaración en el package raíz.
- Chromium arrancó realmente en modo headless y reportó **149.0.7827.55**. Se abrieron cuatro archivos locales y se capturaron a 1440×1000. Cero eventos `pageerror`; `scrollWidth=innerWidth=1440` en esas cuatro vistas. Esto no es auditoría completa ni prueba móvil.
- Capturas/manifest: `evidencia-diseno/benchmark-captures.json`, `bench-1440.png`, `garabato-1440.png`, `hsb-1440.png`, `auditoria-actual-1440.png`. Hermes abrió y examinó las cuatro imágenes.
- Fuentes locales disponibles en `C:/dev/proyectos/onia-hermes/hermes-content/brand/fonts/`: BricolageGrotesque-var-latin.woff2, DMSans-var-latin.woff2, SplineSansMono-var-latin.woff2; archivos OFL de cada familia. No descargarlas de nuevo. Copiar únicamente las usadas con su licencia al paquete privado si el prototipo requiere independencia de ruta.
- La página actual carga Archivo e Inter desde Google Fonts. No dar por hecho que están locales ni cambiar toda la marca a tipografía ONIA sin presentar propuesta. Las fuentes locales son recursos disponibles, no una identidad personal aprobada.
- `hermes-content/brand/tokens.css` y `web-factory/packages/tokens/src/index.ts` son fuentes de contexto existentes; sus valores no se adoptan automáticamente para marca personal.

## Lectura visual propia de los benchmarks

Son **propuestas comerciales locales**, no las webs originales de los clientes. No atribuirles interacciones ni resultados de conversión.

Las vistas de Bench, Garabato y HSB comparten un título contundente, introducción breve, columna contenida y separación clara entre problema y alcance. Bench introduce rojo; las otras dos vistas comparten tratamiento oscuro azul/verde. Sirven como piso de legibilidad y claridad comercial. No hace falta copiar sus degradados, tarjetas repetidas o composición de propuesta para convertirlos en una landing.

La página actual del taller tiene composición dividida: texto/CTA a la izquierda y retrato sobre verde con fecha a la derecha. Título muy grande, identidad reconocible y oferta concreta. La nueva propuesta debe mejorar la demostración del resultado y el recorrido, no cambiar por cambiar ni importar claims de otros creadores. En esta captura actual aparece precio/CTA de reserva: es una vista del archivo local preexistente, NO prueba de venta abierta, cupos disponibles o precio vigente verificado.

## Superficie y exploraciones propuestas

Superficie primaria: **Decidir / aprender**. Cada sección debe ayudar a entender el taller, ver su resultado o decidir si corresponde; sin dashboards ficticios ni adornos para llenar espacio.

1. **Cuaderno de diagnóstico (recomendación provisional):** hero editorial asimétrico y hoja de trabajo como demostración rotulada. Numeración discreta, márgenes claros; resultado → método → requisitos → invitación. Relación directa con lo que realmente entrega el taller.
2. **Tablero de prioridades:** composición de una tarea seleccionada y su razonamiento; sin estadísticas reales inventadas. Jerarquía entre qué repetir, qué medir y por dónde empezar. No hacer un monitor SaaS disfrazado de landing.
3. **Bitácora práctica:** recorrido por capítulos con retrato real existente y ejemplos de proceso. Orientación humana y secuencial, no tarjetas equivalentes ni simple cambio de paleta.

Son alternativas de composición para comparar, no tres marcas aprobadas. La estrategia pendiente debe gobernar el copy y la selección, no al revés. Mantener el nombre canónico «Auditá tu negocio con IA» y voseo; no renombrar el producto ni cambiar promesa/precios.

## Contrato de construcción y QA

- Prototipo privado visible y completo; no solo un documento de tokens. Tres direcciones comparables y una recomendada, evitando producir tres sitios completos innecesariamente.
- Luego consolidar la dirección elegida; aún no ejecutar integración/publicación.
- Paleta pequeña con contraste verificado; familia display y familia de lectura elegidas conscientemente; escala tipográfica, espaciado, bordes, estados de foco y botones definidos con variables CSS.
- Contenido: resultado real del taller; programa de 90 minutos de contenido más pausa de 5; requisitos, para quién sí/no, proceso y CTA coherentes con la estrategia y el canon. No copiar promesas de automatización terminada del referente.
- Demos hipotéticas rotuladas. Las conversiones semanales/mensuales explicitan supuesto. No ahorros propios, testimonios, pagos o cupos restantes inventados.
- CTA de prototipo local: puede mostrar estado de revisión o explicación local; no enviar formularios, mensajes ni iniciar pagos.
- Capturas reales a 1440 y 390 de ancho; comprobar desbordamiento, foco, botones, FAQ y errores. Si solo cambia viewport, llamarlo pantalla estrecha, no dispositivo móvil real.
- Capturar tras carga de fuentes/imágenes y con movimiento reducido; si hay lazy loading, recorrer antes de captura de página completa. Inspeccionar las imágenes, no limitarse a comprobar archivos.
- La aprobación de marca y de publicación corresponde a Sergio tras ver capturas. Venta sigue pausada.

## Procedencia

Auditoría read-only deleg_724aa7f4, modelo reportado gpt-6-luna; rutas y recomendaciones revisadas por Hermes. Prueba propia de navegador: ejecución Node desde web-factory, Chromium headless, cuatro páginas locales, exit 0. No instalaciones ni servicios nuevos; navegador cerrado al terminar. No se modificó la web existente.
