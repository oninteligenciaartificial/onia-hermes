# Cola · Marca personal de Sergio Urcullo

Estado al 11-oct ~06:10 UTC. Nada se publica ni se agenda sin «mostrada, publicá <pieza>» de la madre (regla del 10-oct, pedido de Sergio Urcullo: «mostrame antes de subir»). Lo anterior (9 y 10-oct) quedó en `handoff/marca-personal.md`, entrada «10-11 oct».

## Tareas, en orden

- [ ] **1 · Editar los 5 brutos del 11-oct.** Orden: N06 (dom 11, la noticia envejece) → DD-A → N07 → S2-D07-A → N02. Por pieza: transcripción, tabla de cortes + preview 360p, regla 15 (aire muerto ≤ 0,3 s, medido con `silencedetect -35 dB d=0.3` → 0) y commit «LISTA PARA MOSTRAR: <pieza>». N06 y S2-D07-A van con sus propias palabras: subtítulos y cortes salen de la transcripción, no de GRABAR. Moldes: N06, DD-A, N07 y N02 = Santiago «noticia con tarjetas»; S2-D07-A = Erik de septiembre. Brutos bajados a la nube con `curl` a `drive.usercontent.google.com` (los archivos están compartidos por enlace; **sí se pueden bajar**) y transcritos con `faster-whisper small` (instalado el 11-oct con el OK de Sergio Urcullo en esta sesión).
- [x] **2 · Teleprompter SI-01..SI-11 y orden de posteo** (`TELEPROMPTER-SI-01-11.txt`, `ORDEN-DE-POSTEO-11-17-OCT.md`; commits `0051cb621` y `714a88a6f`). Corregidos con verificador y crítico independientes (voseo, cifras, jerga). Quedan ⛔ por medir: SI-05 [X], SI-06 [A][B], SI-07 [T], SI-10 [N], SI-11 claude-mem. **El acceso de la PC a LiteLLM no está verificado y desde la nube la lectura de producción la frenó el control de permisos:** [X] lo mide Sergio Urcullo o la madre en la PC. [197] de SI-09 no se pudo recontar: el guion dice «me pasó construir cosas que ya existían hechas». modelos: haiku (verificador) + sonnet (crítico); codex: ninguno.
- [x] **3 · Molde mosaico-tablero con la corrección de Codex** — LISTA PARA MOSTRAR, commit `b251cd40d` (hueco de los 23 s de 0,47 s a un cuadro; falta MP4 y lint de HyperFrames: el CLI no está en la nube). modelos: codex gpt-6.1-sol medium (lo lanzó la madre); render y revisión de Marca = sonnet; codex:marca-M1.
- [ ] **4 · Carruseles ya renderizados, esperando «mostrada, publicá»:** «78h en una tarea» (dom 18-oct 16:00, CHECKLIST; LISTA PARA MOSTRAR, `8d5120729` + `0bcfd5295` + `00106d763`; falta confirmar que el aviso CHECKLIST está pegado) y «Tics de webs con IA» (mié 21-oct 16:00, DISEÑO; BORRADOR: faltan la captura C1 y `[X] [Y] [X2] [Y2]` del jue 15). modelos: haiku (verificador).
- [ ] **5 · Carruseles por armar 17-23-oct** (palabra de la pieza del día): lun 19 FACTURA · mar 20 RONDAS · jue 22 asesoría · vie 23 EQUIPO. Cada uno espera la medición de su video (`GRABAR-17-23-OCT.md`); calendario en `CALENDARIO-PUBLICACION-17-23-OCT.md`.
- [ ] **6 · P2 «7 herramientas. 4 son gratis.»** (sáb 17-oct 16:00): faltan capturas con cuentas y la lámina 6. **Antes de agendar hace falta el OK de Sergio Urcullo sobre la lámina 6** (muestra los avisos del bot a los prospectos). Render y control de calidad primero.
- [ ] **7 · P1 «Niveles» y P3 pizarra** (HyperFrames, sin cara): sin fecha; P1 espera el bruto N07 y el OK del molde, P3 sus tres condiciones.
- [ ] **8 · Lote de 14 imágenes `fotobn`** (14 cr, `cola/plan-3-semanas/lote-14-imagenes.json`): cotizar y dejar listo; **no se genera sin el OK de Sergio Urcullo** (supera el tope de ~5 cr).
- [ ] **9 · Historias de la asesoría:** 1-3 publicadas el 10-oct 20:05 UTC (ids `18086679188291388`, `17912923362287892`, `18105929870359169`); la 4.ª (sticker de link) la sube Sergio Urcullo a mano. Nada más por publicar.
- [ ] **10 · Los carruseles agendados dom 11 → vie 16** (6 timers en el VPS): no se tocan. ANTIGRAVITY (hoy 20:00 UTC) espera la decisión de Sergio Urcullo; la madre avisa. K7 v2 (BRIEF) y K4 v2 (PRUEBAS) cierran con un aviso que no existe.

## Brutos del 11-oct · mapeo a su código (hecho por la transcripción, 11-oct)

| Archivo en Drive | Id | Tamaño · duración | Código | Hora subida (UTC) | Confianza | Cómo se supo |
|---|---|---|---|---|---|---|
| `1CCFE9FE-10EB-496A-AED1-94386197DECE.mp4` | `1rlbdA9zLE9SZJInPmFjd1jP3S8r8yk08` | 69,8 MB · 59 s | **N06** Gemini CLI → Antigravity | 04:47 | alta | dice «Gemini CLI dejó de contestar… Antigravity»; no es el guion de GRABAR |
| `F9630B16-57F2-465E-9289-0D0DDBE787A2.mp4` | `1rHY7WjqjRaEnfIqgdDMOXXfMhF2oZ3Ae` | 92,5 MB · 78 s | **DD-A** OpenAI Sol y la caché | 04:50 | alta | «GPT 6.1 Sol… Astra… caché 20 veces menos» |
| `3941A129-133A-4618-BB88-7C191DC1AF3B.mp4` | `18DnUVL_i99QN6DQdc7XqO_RTEtT9T2eQ` | 122,6 MB · 104 s | **S2-D07-A** ventana de 24 horas | 04:51 | alta | «la ventana de 24 horas… plantillas de Meta»; con sus propias palabras |
| `EE23A577-932C-44A3-90F0-3AFEAA976AD6.mp4` | `1QAAvFbQXPK64z5VmcnP2sq0iv6hsSniY` | 184,4 MB · 156 s | **N02** Sonnet 4.5 se apaga | 04:52 | alta | «Sonnet 4.5 se va a apagar… 30 de noviembre» |
| `15270626-ABFC-4562-9DF0-2E35CDE665DA.mp4` | `1stEjNjp48QMn1u8FnUVeF9opX6-3uX98` | 212,8 MB · 180 s | **N07** Haiku 5.5 | 05:01 | alta | «Haiku 5.5… clasificar mil mensajes» |

Además, `BA814C81-7462-44C2-92BF-AD2C0975F8F0.mp4` (raíz de Drive, 250 MB): **no se edita**, lo publica la madre tal cual desde la PC. Marca no pudo abrirlo (no está compartido por enlace). El `A0550B92-…mp4` del 1-oct es un bruto viejo.

## Bloqueado (solo Sergio Urcullo)

- **Grabar SI-01 a SI-11** (`GRABAR-NUEVOS-11-OCT.md`) en el orden del teleprompter. Ya grabados: N07, DD-A, N02, N06 y S2-D07-A. **D03-A, D04-C y el resto de los guiones viejos no se graban.**
- **Medir [X] de SI-05** (gasto de 30 días en LiteLLM), y [A][B], [T], [N] y la prueba de claude-mem en su Claude Code (⛔ NO GRABAR TODAVÍA en el teleprompter).
- **Aprobar el lote de 14 imágenes `fotobn`** (14 cr).
- **OK de la lámina 6 de P2** antes de agendarla.
- **Link de la asesoría en la bio** (lo piden S2-D07-A, DU-01 y DU-03): sin él, su cierre pasa a «Lo que probé está en mi comunidad. Link en mi perfil.».
- **Decisiones que da la madre:** los 6 carruseles agendados (ANTIGRAVITY hoy) y qué día publica BA814C81.
- Ya no bloquea: la restricción de Instagram (code 25) se levantó el 10-oct (reel, carrusel e historias salieron).

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima pieza ya encargada, cargar `equipo-de-agentes` y `aprender-de-todo`; elegir el aprendizaje pertinente de `references/video-intake/COBERTURA-APRENDIZAJE.md` y registrar en su ficha sesión, regla, artefacto y revisión. Comprobar vos, fotobn cuando corresponda y CTA con recurso real en Avisos. Recibir un link no encarga producir.
  - Marca personal, 9-oct: cargadas `equipo-de-agentes` y `aprender-de-todo`; registrada la prueba de uso del caso «cinco archivos» en su ficha (aplicado en borrador, sin publicar, revisión de la madre pendiente). Vos ✓ · fotobn: no usado y dicho · CTA «Buscá ARCHIVOS en Avisos» con recurso escrito ✓.
