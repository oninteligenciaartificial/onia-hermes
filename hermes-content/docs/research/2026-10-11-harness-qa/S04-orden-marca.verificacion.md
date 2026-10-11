# Verificacion adversarial S04 (Orden de trabajo Marca personal)

Fecha: 11-oct-2026. Solo lectura. Sin git, sin escribir fuera del worktree, sin publicar.

## Veredicto: PARTIAL

## Comprobado y correcto

- Cola `marca-personal.md`: la linea de bloqueo existe y dice "el vie 9". Vencida al 11-oct.
- `GRABAR-NUEVOS-11-OCT.md`: 11 guiones SI-01 a SI-11; N07, DD-A, N02, N06, S2-D07-A ya grabados.
- Mediciones entre corchetes: [X] SI-05, [A]/[B] SI-06, [T] SI-07, [N] SI-10, [197] SI-09.
- Drive `parentId=1Iks0iUsLC5wlznDF6Bbo3VYkekclV987`: 6 mp4 en total (2 paginas). 5 del 11-oct con nombre UUID. La API devuelve UTC (sufijo Z): 04:47 a 05:01 UTC = 00:47 a 01:01 La Paz, correcto. 1 del 1-oct (A0550B92, 78 MB).
- `videos/moldes/mosaico-tablero/`: solo README.md, index.html, hyperframes.json, ledger.json y assets/. No hay out/ ni mp4. README: prueba de 30 s, 1080x1920, sin audio; regla de parada con revision de Sergio.
- `CALENDARIO-PUBLICACION-9-16-OCT.md`: P2 sab 17-oct 16:00 IG, 16:01 LinkedIn, 16:02 TikTok. P1 y P3 sin fecha.
- `handoff/marca-personal.md`: la entrada mas nueva es "8-oct (noche, 10)". No hay entradas 9 a 11 oct.
- Lote de 14 imagenes: `lote-14-imagenes.json` en fotobn, 14 cr segun handoff.
- Historias rechazadas el 8-oct (entrada noche, 7).
- `scripts/codex-tarea.sh`, `scripts/codex-cupo.mjs`, `scripts/codex-worktree.sh` y `codex-tareas/` (README y _PLANTILLA) existen.
- Modelos Luna y Sol existen en `AI_MODEL_ROUTING_2026.md` (gpt-6-luna, gpt-6.1-sol).

## Problemas

1. WRONG en el paso 4 del orden: dice P2 "Sin pregunta previa (regla de publicacion)". El calendario dice lo contrario: antes de agendar P2 hace falta el OK de Sergio sobre la lamina 6 (muestra avisos del bot a prospectos). P2 ademas no tiene render todavia.
2. Cita mal el texto de la cola. S04 pone "Bloqueado: Grabar (N07, DD-A, N02...)". El texto real es "- Grabar (N07, DD-A, N02, D03-A, D04-C el vie 9; el resto segun el orden del teleprompter)." Es cita textual falsa, aunque la conclusion es correcta.
3. "Sin transcript local" para la sesion session_01WPecmppa9uZEc4fJDjSmaS no queda demostrado. Una busqueda del id devolvio 153 archivos locales, en su mayoria referencias dentro de transcripts de la madre. No se verifico si alguno es el transcript de esa sesion. El estado 9 a 11 oct sigue UNKNOWN, pero la afirmacion debe decir "no verificado" y no "no existe".
4. Titulo confuso "Tope de Drive: 1 de 6 brutos ya tenia edicion previa". El 1-oct (A0550B92) es el bruto de N03/D01-B, que el handoff dice editado en 2-oct. No es un tope de Drive. Reformular.
5. Paso 2 (medir [X] con LiteLLM y logs del vigia) asume acceso a LiteLLM desde la PC. No se verifico donde corre LiteLLM ni si la PC tiene acceso. Marcar UNKNOWN.
6. CX-MP2 deja "Ruta: decidir con la madre". No es un contrato cerrado; falta la ruta.

## Violaciones de reglas

Ninguna detectada. No se uso git. No se escribio fuera del worktree. No se imprimieron secretos. RemoteTrigger y gh no se usaron. Sin mensajes a sesiones.
