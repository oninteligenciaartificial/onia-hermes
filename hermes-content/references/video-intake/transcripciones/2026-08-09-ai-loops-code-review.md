# Lectura completa — ai-loops-code-review

- Fuente: https://www.instagram.com/p/DbyhC0csyaB/
- Motor: Gemini nativo (video + audio), 2026-08-09
- Cobertura: video completo, no muestreo de fotogramas

---

Aquí tienes el análisis detallado del video:

---

### 1. RESUMEN
El video explica el concepto y funcionamiento de los **AI Loops** (bucles de inteligencia artificial) para mejorar el rendimiento de los agentes de IA sin intervención manual constante. En lugar del proceso tradicional de corregir prompts repetidamente, un AI loop le otorga a la IA un objetivo y la capacidad de auto-evaluarse, detectar errores y corregir su propio código o respuesta antes de entregar el resultado final. La creadora comparte además un truco práctico utilizando el comando `/code-review` y ofrece una guía paso a paso a quienes comenten en la publicación.

---

### 2. TIMELINE POR SECCIONES

* **[00:00 - 00:05] Introducción a los AI Loops**
  * **QUÉ SE VE**: La creadora habla sosteniendo un micrófono de solapa. En la parte superior aparece un esquema interactivo que diagrama el flujo de un "AI Loop" (Tarea+Objetivo $\rightarrow$ Ejecución $\rightarrow$ Verificación $\rightarrow$ Corrección y reintento $\rightarrow$ Respuesta final).
  * **QUÉ SE DICE**: *"Así usamos AI loops para que nuestros agentes puedan tomar mejores decisiones sin corregirlos manualmente."*

* **[00:05 - 00:21] El método tradicional vs. el nuevo enfoque**
  * **QUÉ SE VE**: Subtítulos dinámicos. Aparece una recreación en pantalla de una interfaz de chat con prompts e iteraciones manuales ("Crea una landing page"). Posteriormente, se muestra una imagen de fondo referenciando el ecosistema de Claude Code.
  * **QUÉ SE DICE**: Explicación de cómo la mayoría interactúa con la IA (escribir prompt, revisar, ajustar prompt, reintentar). *"Y tienes que estar todo el tiempo aprobando y aprobando. Pero nosotros ya no trabajamos así, ni tampoco el que creó Cloud Code."*

* **[00:21 - 00:34] ¿En qué consiste un AI Loop?**
  * **QUÉ SE VE**: Plano medio de la creadora explicando frente a la ventana de su oficina con pizarra de fondo.
  * **QUÉ SE DICE**: *"Un AI loop consiste en darle a la IA un objetivo, decirle cómo evaluar su propio trabajo y permitirle mejorar por sí sola antes de darte una respuesta."*

* **[00:35 - 00:49] Proceso de auto-evaluación y precisión**
  * **QUÉ SE VE**: Iconos gráficos secuenciales sobre la cabeza de la creadora: icono de IA $\rightarrow$ análisis de errores $\rightarrow$ verificación/corrección $\rightarrow$ reprocesamiento automático.
  * **QUÉ SE DICE**: *"La IA se evalúa, detecta sus errores, los corrige y vuelve a intentarlo automáticamente. Esto hace que nuestros agentes sean mucho más precisos..."*

* **[00:49 - 01:07] Tip técnico: Uso de `/code-review`**
  * **QUÉ SE VE**: La creadora ofrece un consejo clave. En el segundo **00:56**, la pantalla cambia a una captura de entorno de desarrollo (terminal/IDE) donde se observa la ejecución de comandos como `/code-review`, `/simplify` y validaciones en segundo plano. En **01:03** regresa la imagen de la creadora.
  * **QUÉ SE DICE**: *"Cuando le vayas a enviar el prompt con el loop a tu agente, pídele que haga un /code-review de tu propio código antes de darte una respuesta final. Esto obligará a la IA a que revise la lógica."*

* **[01:07 - 01:14] Llamado a la acción (CTA)**
  * **QUÉ SE VE**: La creadora señala con las manos hacia la sección de comentarios mientras los subtítulos resaltan las palabras "palabra loop".
  * **QUÉ SE DICE**: *"Si quieres una guía con el paso a paso para empezar a usar estos AI loops y code review, comenta la palabra loop y te mando una guía."*

---

### 3. TEXTO EN PANTALLA

* **00:00 - 00:05 (Diagrama del bucle)**:
  * `TÚ DAS LA TAREA + OBJETIVO`
  * `LA IA HACE LA TAREA`
  * `VERIFICA SI CUMPLE EL OBJETIVO`
  * `CORRIGE LOS ERRORES Y VUELVE A INTENTAR`
  * `RESPUESTA FINAL`
  * `LOOP`

* **00:09 - 00:14 (Simulación de Chat)**:
  * `Crea una landing page.`
  * `Aquí está tu landing page...`
  * `Crea una página de aterrizaje moderna con un diseño limpio.`

* **00:56 - 01:02 (Captura del Entorno de Código / Terminal)**:
  * `Sign In` | `Implementar AI Loops para mejorar agentes de IA`
  * `/code-review`
  * `/doctor`
  * `/simplify`
  * `Review the current diff for correctness bugs...`
  * `Review the changed code for reuse, simplificati...`
  * `Running in the background as @code-review`

* **Subtítulos resaltados a lo largo del video**:
  * `usamos` | `AI loops` | `decisiones` | `manualmente` | `inteligencia` | `instrucción` | `resultado` | `prompt` | `empezar` | `aprobando` | `Cloud Code` | `proyectos` | `objetivo` | `trabajo` | `respuesta` | `evalúa` | `errores` | `corrige` | `automáticamente` | `agentes` | `proyecto` | `tip` | `/code-review` | `lógica` | `diferencia` | `automatizaciones` | `guía` | `paso` | `palabra` | `loop`.

---

### 4. CONCLUSIÓN / CTA

* **Conclusión**: Implementar ciclos de auto-evaluación (*AI Loops*) e instrucciones de revisión interna (como `/code-review`) permite elevar drásticamente la calidad y lógica de los desarrollos con IA, evitando ciclos manuales y tediosos de aprobación.
* **CTA**: Comentar la palabra "**loop**" en la publicación para recibir un recurso con la guía paso a paso por mensaje directo.


---

## Transcripcion literal (Whisper / Speaches, verbatim)

Modelo: `Systran/faster-whisper-small` · 12 segmentos · 242 palabras · 73.8 s

```
[00:00.0 -> 00:05.5] Así usamos AI loops para que nuestros agentes puedan tomar mejores decisiones sin corregirlos manualmente.
[00:05.7 -> 00:09.1] Y es que la mayoría de personas utiliza la inteligencia artificial de esta forma.
[00:09.3 -> 00:14.6] Le das una instrucción, la idea te resuelve, no te gusta el resultado, cambias el prompt y vuelves a empezar.
[00:14.9 -> 00:21.8] Y tienes que estar todo el tiempo aprobando y aprobando, pero nosotros ya no trabajamos así, ni tampoco el que creo Cloud Code.
[00:22.0 -> 00:24.8] En nuestros proyectos utilizamos AI loops.
[00:24.8 -> 00:34.6] Un AI loop consiste en darle la IA un objetivo, decirle cómo evaluar su propio trabajo y permitirle mejorar por sí sola antes de darte una respuesta.
[00:35.1 -> 00:44.1] Es decir, en lugar de que tú le digas que corregir una y otra vez, la IA se evalúa, detecta sus errores, los corrige y vuelve a intentarlo automáticamente.
[00:44.4 -> 00:49.5] Esto hace que nuestros agentes sean mucho más precisos cuando responden o ejecutan un proyecto muy complejo.
[00:49.5 -> 01:00.0] Y como pequeño tip, aquí entre nos, cuando le vayas a enviar el prompt con el loop a tu agente, pídele que haga un slash code review de tu propio código antes de darte una respuesta final.
[01:00.4 -> 01:02.7] Esto obligará a la IA que revise la lógica.
[01:02.9 -> 01:07.5] Este pequeño cambio creeme que va a hacer una diferencia enorme en la calidad de tus automatizaciones.
[01:07.9 -> 01:13.6] Si quieres una guía con el paso a paso para empezar a usar esos AI loops y code review, comenta la palabra loop y te mando una guía.
```
