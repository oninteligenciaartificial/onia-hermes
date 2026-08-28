# GitReverse: convierte un repositorio en el prompt que lo habría creado

- **Fuente:** https://www.instagram.com/p/DbtcMKxttvh/ · @no se dice en pantalla
- **Tipo:** IA · **Veredicto:** SIRVE YA
- **Cobertura:** 16 de 36 fotogramas (6 base + 10 densos). Duración 23,2 s, **0 cortes medidos**. Sin transcripción.
- **Medido:** 23,2 s · 0 cortes (ffmpeg, umbral 0,3).

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Caption:** *"Comenta «Link» y te paso el enlace"*.
- **Subtítulos leídos, en orden:** `1 HERRAMIENTA QUE` · `ACABAN DE PUBLICAR` · `CONVIERTE CUALQUIER REPOSITORIO` · `DE GITHUB` · `COMO REFERENCIA PARA` · `RECONSTRUIRLO Y ENTENDER` · `DE VOLAR LA CABEZA` · `LOCURA ES EN` · `CLONES DE TWITTER` · `ESTO ME ACABA`.
- **La herramienta en pantalla:** `gitreverse.com`, con la URL `gitreverse.com/openclaw/openclaw` y el repo `openclaw/openclaw` (Public) al lado.
- **Y la salida, que es lo que importa** — una captura del texto generado: *"especially from OpenAI. For setup, I'm imagining a really smooth command-line process and helps install it as a background service on desktop or mobile. Please use a modern TypeScript… the messaging APIs if needed."* Es decir: **prosa de brief, en primera persona, como se lo pedirías a un asistente.**

## Cómo está hecho — la reconstrucción

- **Qué hace: ingeniería inversa de repositorio a prompt.** Le das una URL de GitHub y te devuelve el encargo que lo habría producido, escrito como se lo pedirías a un asistente.
- **Para qué sirve de verdad, que no es lo que el reel sugiere:** no para clonar proyectos ajenos, sino para **entender rápido un repo grande** y para **aprender a escribir briefs**. Ver el prompt que produce un proyecto conocido enseña más de especificación que diez artículos.
- **Dónde nos toca:** el carril evalúa herramientas ajenas constantemente. Esto acorta el paso de "leer un repo entero" a "leer su brief".
- ⚠️ **Y hay una trampa que el reel no menciona:** el prompt reconstruido es una **hipótesis plausible**, no el prompt real. Nadie sabe si ese proyecto se hizo así. Confundir las dos cosas es exactamente el error que la skill `sacar-prompt` distingue como **recuperar** contra **reconstruir**.
- **Nota de contexto:** el ejemplo que usa es `openclaw`, que nuestro assessment de herramientas de 2026 ya evaluó y descartó.

## El estilo, como conocimiento portable

Talking-head vertical en habitación con puerta de madera, silla gamer, plano fijo sin un solo corte en 23 s. **Capturas flotando arriba** con sombra, ocupando el tercio superior, que van cambiando mientras la cara sigue igual — es el patrón de texto ancla invertido: acá lo quieto es la persona y lo que cambia es la prueba. Subtítulo en mayúsculas blancas con **la palabra clave resaltada en caja rosa/roja**, centro-bajo, a corte duro.

**Se porta a:** Nada nuevo de estilo: la variante "cara fija + captura que cambia" ya está cubierta por el patrón de texto ancla del deduplicado del 23-ago.

## Las tres preguntas

1. **Frente:** ninguno directo — es herramienta de trabajo interno.
2. **Herramienta nuestra:** Ninguna equivalente. Hoy leemos los repos a mano.
3. **Qué falta:** Nada para probarlo: la web es pública.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R10](prompts-lote-2026-08-28/R10-gitreverse-de-repo-a-prompt.md)
