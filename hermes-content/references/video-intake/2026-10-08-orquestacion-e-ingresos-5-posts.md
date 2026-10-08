# 5 publicaciones de Instagram: orquestar modelos, vender asesorías y producir contenido (8-oct-2026)

Las mandó Sergio Urcullo el 8-oct con el pedido de «armar todas las sesiones sin ahogarnos, con todos los modelos,
y que yo solo haga comunidad, asesorías y grabe». Método: `fetch-video.mjs` + Gemini (dos pasadas: contenido y edición)
+ las 8 láminas del carrusel leídas con visión.

**Cobertura real:**
- Los 4 videos, vistos enteros por Gemini. Ojo: `gemini-flash-latest` dio 503 por saturación y se usó
  `gemini-flash-lite-latest`, que lee mal los números de versión de los modelos en pantalla.
- El carrusel: las 8 de 8 láminas, leídas a mano. El pie de foto venía vacío.

| Post | Autor | Formato |
|---|---|---|
| `DeFS0Fes8yu` | @doninas, «AI LEVELS · EP 01» | animación de un panel de control, sin voz |
| `DbyVzPWRpWl` | Marco Machado (@realmacomachado) | cámara frontal con capturas de pantalla |
| `DeHP8DPsimI` | «Claude Motion Tips» | cámara frontal con cortes muy rápidos |
| `DdmTyEVAPMb` | Replace.so | carrusel de 8 láminas |
| `DeFfzyCRFSf` | aviso de USFANS | sketch de ficción |

## 1. Niveles para usar modelos de IA (`DeFS0Fes8yu`): la lección central para la madre

- **Mensaje:** la misma tanda de 6 tareas, resuelta de cuatro formas, cuesta muy distinto según cómo se reparte entre modelos.
  - **Junior:** todo con el modelo más caro y esfuerzo máximo. Unos USD 5,1 por tarea resuelta.
  - **Middle:** el modelo se elige a mano y siempre con esfuerzo alto. Unos USD 0,66.
  - **Senior:** primero el más barato, después se verifica y se sube de modelo solo si falla. Unos USD 0,45.
  - **GOAT:** un router elige modelo y esfuerzo, y la verificación es liviana o completa según el riesgo. Unos USD 0,32: 15 veces más barato.
- **Tema:** la plata no la ahorra el modelo barato, la ahorra **verificar y escalar solo ante una falla**. El gancho es el costo por tarea en grande desde el primer segundo.
- **Edición:**
  - Todo es una interfaz animada (panel oscuro con cuadrícula), sin cámara ni voz.
  - 2 cortes cada 10 s, uno por nivel.
  - Contadores que suben solos y líneas que se dibujan uniendo bloques.
  - Acentos en naranja y cian; letra geométrica o monoespaciada.
  - Música electrónica ambiental, con un pitido en cada tarea resuelta. Formato 9:16.
- **Qué aplicamos:**
  - **Orquestación:** el router de la madre. Arranca por el modelo más barato que pueda cumplir, verifica con algo que no opine (tests, un `grep`, mirar la pantalla) y escala con la prueba del fallo. La verificación es FUERTE solo para producción, plata, el VPS o el autosync. Va en la skill `onia-sesion-madre` y en `AI_MODEL_ROUTING_2026.md`.
  - **Contenido:** el formato «niveles con costo por tarea» enseña de verdad y se puede hacer con HyperFrames, sin que Sergio Urcullo grabe pantallas.

## 2. Quiz funnel para conseguir prospectos (`DbyVzPWRpWl`)

- **Mensaje:** el embudo de Alex Hormozi tiene 3 pasos.
  1. Un cuestionario hecho con IA en Lovable, con preguntas de diagnóstico del tipo «¿qué lo frena hoy?», «¿qué tan urgente es?» y «¿dónde pierde oportunidades?». Al final muestra «Analizando sus respuestas…» y entrega un «plan personalizado».
  2. Pauta, reels, carruseles e historias, todo apuntando al cuestionario.
  3. **Llamar al prospecto en los primeros 7 minutos**, cuando el dolor está caliente, y agendarle una llamada.
- **Tema:** el gancho es «+309 leads/día» con autoridad prestada (Hormozi). Le habla a coaches y agencias.
- **Edición:**
  - Cámara frontal con capturas de pantalla reales detrás.
  - Subtítulos tipo karaoke, blancos abajo, con la palabra clave en **amarillo**.
  - Cortes duros, entre 2 y 5 cada 10 s; diagramas dibujados a mano.
  - Música lo-fi baja y un «whoosh» suave en cada cambio.
- **Qué aplicamos:**
  - **Ingresos:** el embudo de las asesorías y de las clínicas. Un cuestionario de diagnóstico, «¿Cuánto pierde su clínica / su empresa por no tener IA?», con un plan y la llamada 1 a 1 (la que ya vive en `cal.com/20min`, por `/llamada`). El cuestionario se construye en la web propia, no en Lovable: es una pantalla más.
  - El seguimiento en 7 minutos lo hace el bot de WhatsApp. Nunca se le promete al prospecto algo que el producto no hace.
- **Qué no copiar:** las cifras ajenas («+309 leads/día») como si fueran nuestras.

## 3. Cuatro trucos para videos hechos con Claude (`DeHP8DPsimI`)

- **Mensaje:** para que un video animado con Claude no salga genérico:
  1. Partir de efectos de código abierto, como `p5.brush` o `thinking-orbs`, y pedirle que los adapte.
  2. Subir la música y pedirle que haga coincidir los golpes con los movimientos.
  3. Darle un archivo de marca (colores, letras y referencias propias).
  4. Copiar de una galería de más de 400 videos de Claude con su prompt.
- **Tema:** el gancho es el antes y el después; cierra pidiendo comentar «motion».
- **Edición:**
  - 12 cortes en los primeros 10 s.
  - El presentador alterna con capturas de código y animaciones.
  - Subtítulos blancos palabra por palabra; música electrónica suave; clics de interfaz.
- **Qué aplicamos:** son mejoras directas para HyperFrames, en la skill `motion-doctrine` o `hyperframes-creative`:
  - el ritmo lo marca la música;
  - el archivo de marca ya existe en `ONIA_BRAND_IDENTITY_2026.md`;
  - antes de animar se parte de un efecto de código abierto.

## 4. Carrusel «7 repos de GitHub que no deberían ser gratis» (`DdmTyEVAPMb`)

- **Contenido:** Foreman (supervisa agentes de código con puntos de control: avance, requisitos, tests, verificación y escalamiento a un humano), Open-glean (buscador de memoria y archivos con respuestas citadas), Openjev, Aria-Icons (380.000 íconos SVG con servidor MCP), Repolyze (analiza repositorios) y Nhost (backend de código abierto).
- **Formato:**
  - una lámina por herramienta, con su ícono 3D, el nombre grande, una línea de qué hace y la captura de su web con las estrellas de GitHub;
  - fondo oscuro con una grilla de puntos;
  - cierre: «comenten REPOS y les mando la lista».
- **Qué aplicamos:**
  - **Orquestación:** Foreman confirma el método de la madre: tareas con puntos de control (META · PRUEBA DE HECHO · REGLA DE PARADA) y escalar a Sergio Urcullo solo lo que es suyo. No se instala: ya lo hacemos con la madre y los handoffs.
  - **Contenido:** el formato «N herramientas» es fácil para la marca personal y lo produce el agente sin que Sergio grabe.
- **Qué no copiar:** «comentá X y te lo mando». El comentario→DM de Instagram **no está probado** en Onia (2 rechazos de Meta).

## 5. Aviso de USFANS (`DeFfzyCRFSf`)

- **Mensaje:** un sketch de humillación con revancha. Le manchan una camiseta «falsa», la del rico se arruina, y cierra con «en USFANS, 40 % en mi bio».
- **Tema:** el conflicto entra en el primer segundo y el producto recién aparece al final.
- **Qué aplicamos:** la estructura del sketch (conflicto → giro → producto como solución → código en la bio) sirve para un aviso de Onia. Por ejemplo: la recepcionista que pierde al paciente por WhatsApp, y la del lado que tiene a Onia.
- **Qué no copiar:** el producto (réplicas de marca, ilegal) ni el tono de burla.

## Lo que se decidió con esto

El modelo operativo del 8-oct (router de modelos, sesiones, presupuesto y plan de ingresos) quedó en la skill
`onia-sesion-madre`, § «Modelo operativo (8-oct…)».
