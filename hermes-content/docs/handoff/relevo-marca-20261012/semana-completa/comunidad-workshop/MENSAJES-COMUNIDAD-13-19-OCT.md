# Borradores de comunidad · 13–19 octubre

**Preparación autorizada por Sergio para siete mensajes diarios (no publicación).** El canon del 30-sep mantiene tres avisos ancla lunes/miércoles/viernes a las 19:00, atados al video del día. La propuesta fechada para esta semana agrega ejercicios diarios opcionales; no convierte los siete en avisos ancla ni cambia el ritmo permanente. Anclas propuestas: mié 14, vie 16 y lun 19 a las 19:00 America/Caracas (UTC−4). No se da por confirmado el envío. Cada pieza incluye recurso, ejercicio y pregunta en el mismo mensaje; no promete un archivo externo.

Los seis avisos fuente **RUTINA, OPENCLAW, VAGO, SECRETOS, HYPERFRAMES e INVESTIGAR** se preservan completos en `fuente/AVISOS-COMUNIDAD-SI-11OCT.md`; la tabla de prerrequisitos originales está allí. Los textos de abajo son una versión de un solo mensaje para la cadencia solicitada; no sustituyen el original. Ninguna pieza afirma haberse publicado. Las notas de gate no se pegan en WhatsApp.

## Mar 13 oct — RUTINA · ejercicio diario opcional

Esta versión educativa no afirma que Sergio haya creado una rutina el día anterior ni depende de una captura; por eso no usa la anécdota del video original. Si se quisiera acompañar con ese video, primero debe verificarse el gate indicado en el aviso fuente. CTA sugerido: responder en General.

```text
🔁 RUTINA · ¿/loop o /schedule?

Claude Code puede repetir tareas, pero hay dos modos distintos:

• /loop corre en tu compu con Claude Code abierto y expira a los 7 días.
• /schedule crea una rutina en la nube, desde una copia fresca del repositorio; corre aunque la compu esté apagada, mínimo cada 1 hora. Está en prueba y requiere sesión de claude.ai; no ve tus archivos locales.

Regla rápida: compu encendida y tarea local → /loop. Compu apagada y trabajo sobre GitHub → /schedule. Las rutinas actúan sin pedir permiso: empezá con una tarea de solo lectura.

Ejercicio (3 minutos): escribí una tarea repetida y completá «qué puede leer» y «qué no debe cambiar». No la programes hasta revisar permisos.

Pregunta/CTA: respondé en General: ¿qué tarea repetís cada semana y qué resultado te gustaría recibir?

Fuentes: https://code.claude.com/docs/en/scheduled-tasks · https://code.claude.com/docs/en/routines
```

## Mié 14 oct · 19:00 — OPENCLAW · aviso ancla propuesto

**Gate antes de pegar:** mantener separado de una invitación a instalar. La fuente condiciona la prueba a aprobación de Sergio para instalación; esta versión es solo discusión de límites. No abrir links/ejecutar comandos como parte del ejercicio.

```text
🦞 OPENCLAW · primero, el límite de seguridad

El manual de OpenClaw dice que los mensajes entrantes son datos no confiables y que las herramientas corren en el equipo anfitrión si no configurás sandbox. Por eso no se prueba en una compu con banco, contraseñas o archivos importantes.

Tres reglas de conversación: 1) entorno separado; 2) sandbox comprobado antes de exponer herramientas; 3) revisar manualmente cada skill antes de instalarla. La última es recomendación, no cita textual del manual.

Ejercicio (sin instalar nada): dibujá tres columnas: «qué dato entra», «qué herramienta podría actuar» y «qué persona aprueba». Marcá dónde frenarías una instrucción dudosa.

Pregunta: ¿qué acción nunca dejarías que un agente haga sin aprobación humana?

Manual: https://github.com/openclaw/openclaw#security · sandbox: https://docs.openclaw.ai/gateway/sandboxing
```

## Jue 15 oct — VAGO

**Gate antes de pegar:** la pieza original solicita comparar la misma tarea con y sin ponytail y contar líneas. No atribuir esa prueba a Sergio si no existe registro. El porcentaje es medición del autor del proyecto, no garantía.

```text
🦥 VAGO · ¿menos código hace el mismo trabajo?

El autor de ponytail reporta en su propio benchmark 39 tareas, cinco corridas por tarea: −53 % de código y −26 % de costo. Es su medición; no la tomes como resultado garantizado ni como prueba nuestra.

Ejercicio: elegí un pedido pequeño y verificable. Guardá el resultado base; repetí el mismo pedido con la herramienta solo si decidís instalarla por tu cuenta. Compará si ambas versiones cumplen los mismos requisitos y anotá líneas/tiempo/costo. Si omite algo, no cuenta como mejora.

Pregunta: ¿Claude suele escribir más de lo que pedís o te ayuda a terminar más rápido?

Proyecto y README: https://github.com/DietrichGebert/ponytail
```

## Vie 16 oct · 19:00 — SECRETOS · aviso ancla propuesto

**Gate:** el original no requiere preparación adicional. No afirmar que todos los comandos están disponibles en cualquier versión; el aviso fuente aconseja actualizar si no aparecen.

```text
🗝️ SECRETOS · tres comandos y una pantalla

• /radio: Claude FM, música lo-fi.
• /powerup: lecciones interactivas dentro de Claude Code.
• ultrathink: pedilo para una respuesta que necesite razonamiento más profundo; el pensamiento extendido consume uso.
• claude agents: vista de sesiones, lo que corre, espera o terminó; está en research preview.

Ejercicio: elegí una sola tarea difícil y anotá si usarías ultrathink o una explicación normal; compará el resultado y el consumo que te muestra tu cuenta.

Pregunta: ¿cuál de estas opciones ya conocías o te gustaría probar?

Fuentes oficiales: https://code.claude.com/docs/en/whats-new · https://code.claude.com/docs/en/model-config · https://code.claude.com/docs/en/agents
```

## Sáb 17 oct — HYPERFRAMES

**Gate antes de pegar:** la fuente requiere el clip de 3 s terminado con el prompt y el cuadro inicial antes de grabar. Confirmar ese material; si no existe, quitar cualquier frase que implique que el video ya se hizo.

```text
🎬 HYPERFRAMES · un título escrito como HTML

HyperFrames convierte HTML, CSS, medios y animaciones en un MP4 determinista. Para el flujo local hacen falta Node.js 22 o más y FFmpeg. También permite incorporar material grabado; el ejercicio de hoy se limita a un título animado.

Prompt de ejercicio: «Hacé un título vertical de 3 segundos: fondo negro; ESTE VIDEO LO ESCRIBIÓ CLAUDE en blanco y CLAUDE en verde #10C26B; entra desde abajo con rebote suave y queda quieto el último segundo». Primero revisá el HTML; luego previsualizá y renderizá.

Pregunta: ¿qué cartel animado te serviría en tus propios videos?

Proyecto y licencia: https://github.com/heygen-com/hyperframes
```

## Dom 18 oct — INVESTIGAR

**Gate antes de pegar:** la fuente pide un informe real de `/deep-research` y verificar que el comando aparece en la versión de Sergio. Confirmar ambos; de lo contrario, no decir «en el video te muestro» ni asegurar disponibilidad de cuenta.

```text
🔎 INVESTIGAR · comprobar una respuesta con sus fuentes

En versiones/planes compatibles, Claude Code ofrece /deep-research <tu pregunta>. Devuelve un informe citado; requiere búsqueda web y puede consumir más del límite que una pregunta normal. En Pro, Dynamic workflows se activa en /config.

Ejercicio: elegí una pregunta concreta. Abrí dos citas al azar y compará si la página respalda la frase del informe. Si una cita no existe o contradice la respuesta, no uses ese dato y revisá el resto.

Pregunta: ¿qué tema te gustaría investigar y qué fuente primaria revisarías primero?

Docs: https://code.claude.com/docs/en/workflows
```

## Lun 19 oct · 19:00 — escuchar el problema antes de ofertar · aviso ancla propuesto

**Puente nuevo mínimo, basado en la propuesta interna del workshop. No es anuncio ni preventa.** No publicar sin autorización de investigación/campaña. No se promete curso ni se recogen pagos/contactos.

```text
🧩 PRÁCTICA · mostrale a otra persona lo que construiste

Estoy revisando una idea de práctica guiada para explicar una solución propia de IA en un video corto. Todavía no hay taller abierto, fecha, precio ni inscripción.

Ejercicio: describí en una frase qué construiste; anotá qué se debería entender en 15–30 segundos; elegí un fragmento propio que puedas mostrar sin revelar datos privados; escribí qué equipo/programas ya tenés y qué te frenaría para editarlo.

Pregunta: ¿te sería útil practicar ese resultado? ¿Qué parte te cuesta más: elegir el corte, poner subtítulos, hacer una tarjeta clara o repetir el render?
```

## Control antes de cualquier uso

- Mantener el canon de tres avisos ancla por semana (lun/mié/vie 19:00); esta semana incorpora ejercicios opcionales diarios por autorización fechada de Sergio.
- Verificar cada gate de la fuente; no decir que se grabó, instaló, midió o publicó si no hay evidencia.
- Pegar recurso dentro del mismo mensaje; los bloques de código se conservan como texto.
- No usar la publicación del día 19 como campaña: el workshop sigue sin precio aprobado, fecha, capacidad, demo y términos.
- Registrar estado como `borrador`, `gate pendiente`, `aprobado` o `publicado` solo con prueba. Estado de este paquete: `preparado para QA`; ninguno de los siete se marca `publicado`.
