# Handoff — marca-sergio-guiones-20260927

**Objetivo**
Ordenar la marca personal de Sergio y ONIA por guiones, videos, comunidad, posts y bóveda; dejar piezas educativas con fuente real, seis destinos sociales identificados, y un carril seguro para editar/publicar sólo versiones aprobadas. Objetivo cumplido para documentación/guiones y diagnóstico; **no** para publicación, recuperación de Postiz ni edición final de Opus.

**Qué quedó EN PRODUCCIÓN**
Nada nuevo. Sergio informó que el primer video del 21-sep ya fue publicado, pero en este carril no se verificó URL/cuenta/fecha. No se publicó, programó, reinició servicio ni gastó en Higgsfield durante este cierre. La automatización no solicitada «Marca personal Sergio y ONIA — continuidad» cada 6 horas fue eliminada y su API confirmó `deleted`; no recrearla.

**Qué quedó a medias, y dónde**
Rama `codex/marca-sergio-guiones-20260927`; worktree `C:/Users/PC/.codex/worktrees/marca-sergio-guiones-20260927/onia-hermes`, creado desde `origin/main` `d0757d4d`. El commit de contenido exacto y el de este handoff se informan al cerrar en la tarea; consultar `git log -2` en la rama. Los guiones G00–G14 son borradores; G06 espera bruto de Sergio. Los carruseles v2 recibieron aprobación **visual parcial** («están buenos»); QA factual terminada, pero aún no aprobación final ni permiso de publicación. Video 2 n8n: master antiguo rechazado, v3 candidata no aprobada; faltan captura que coincida con voz y revisión. Postiz devuelve 502, con pila de contenedores ausente en VPS; cola no inspeccionable aún sin recuperación controlada. YouTube Sergio público verificado, OAuth de subida no verificado. Objetivo de marketing propuesto, aún sin ratificación de Sergio: Sergio enseña con prueba real para generar confianza; ONIA enseña producto para consultas comerciales calificadas; comunidad profundiza con recursos probados, sin lanzar curso por inferencia.

**Archivos y cambios**
- `hermes-content/docs/ONIA_MARCA_PERSONAL_BOVEDA.md`: estado por los cuatro frentes, rodaje y gates.
- `hermes-content/docs/cola/RODAJE-MARCA-PERSONAL-2026-09-27.md`: G00–G14 y formatos. G06 corregido con datos de [Anthropic](https://www.anthropic.com/claude-opus-5-5): AutomationBench 40,0 % frente a 26,9 % (+13,1 puntos), apps simuladas, sin fallback en la fila histórica; `>30 %` es velocidad de **generación de salida**, no tiempo total. Capturar tabla y párrafo oficial legibles en edición. La tabla viva de Zapier cambia de configuración y no prueba el 40,0 %. El 60 % restante describe sólo esa evaluación. Precio API US$4/US$20 frente a US$5/US$25 por millón de entrada/salida es inserto opcional, no ahorro garantizado.
- `hermes-content/docs/cola/LEARNINGS-APROBADOS-MARCA-PERSONAL.md`: reglas explícitas de Sergio; los carruseles v2 buenos visualmente pero aún no publicables. Enseñar un criterio o tutorial reproducible con beneficio, límite y fuente. Usar cifras/capturas de sitios públicos y ejemplos ficticios rotulados; no exigir datos privados ONIA salvo que el claim sea sobre ejecución propia.
- `hermes-content/docs/ONIA_PUBLICACION_MULTICANAL.md`: seis destinos confirmados, incluido [YouTube Sergio](https://www.youtube.com/@sergiourcullo) `UCk_4mmXsWTxlk63rpz2hRtg`. Postiz admite cinco técnicamente (dos IG, LinkedIn, FB Página ONIA, YouTube); FB personal requiere publicación nativa. Identidad pública no equivale a acceso de publicación.
- `hermes-content/docs/cola/drops/2026-09-27-loop-preparado.md`: recurso comunitario borrador, no enviado.
- `hermes-content/docs/ONIA_MARCA_PERSONAL_MADRE.md`: enlaces canónicos.
- `hermes-content/carousels/briefs/marca-personal/*-v2.json` y `hermes-content/carousels/out/*20260921-v2/`: tres briefs/captions y 25 PNG (22 láminas + 3 hojas de contacto) incorporados en esta rama tras QA factual/visual. Son esquemas educativos, no ejecuciones reales. Fuentes: [n8n Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/), [Text Classifier](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.text-classifier/), [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/), [Wait](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/), [Claude Code MCP](https://code.claude.com/docs/en/mcp).
- En el checkout compartido `C:/dev/proyectos/onia-hermes`, **fuera de esta rama**, está el video candidato `videos/marca-personal/2026-09-21-02-n8n-real/renders/02-feed-n8n-editorial-v3-candidate.mp4`; el master rechazado también se preservó. No presentar la v3 como pieza final aprobada.

**Intentos fallidos**
- Master n8n «real» anterior: títulos pequeños, demasiado vacío y pantalla de autorización/VPS ajena al audio de leads → Sheets/Telegram; rechazado por Sergio. V3 mejora forma pero sigue siendo esquema, no prueba de esa ejecución.
- Guion Opus inicial con tokens/precios: demasiado técnico; siguiente demasiado genérico: dejó de enseñar. G06 actual equilibra cifra oficial explicada, ventaja y límite. Evitar decir «40 de 100 tareas» como muestra literal o «respuesta 30 % más rápida» como tiempo total.
- Automatización cada seis horas: creada sin solicitud, eliminada. No usar seguimiento periódico para simular continuidad de trabajo.
- Postiz: una recuperación del 4-sep liberó cinco posts vencidos; no reiniciar a ciegas. `scripts/social_publisher.py` sólo empaqueta metadatos YouTube, no sube. Un uploader de `ciencia-cuerpo` es de **otro canal**, no reutilizar tokens.
- La skill global `context-save` exige `AskUserQuestion`, herramienta ausente en esta sesión; se usó el handoff canónico del repo en su lugar.

**Qué depende de Sergio**
- Entregar ruta exacta del bruto de G06 cuando termine y aprobar corte/caption/destinos/versiones antes de publicación. Puede grabar frontal 9:16 sin verde; las capturas de benchmarks y datos públicos van en edición.
- Para video 2, revisar la candidata y decidir entre captura de demo n8n que coincida con voz o corregir la voz/rotularlo inequívocamente como esquema. No pedir datos privados de ONIA para carruseles educativos.
- Aprobación exacta de los tres carruseles tras QA factual y de cualquier lote multicanal, con versión, cuentas y horario. Completar 2FA/OAuth sólo cuando llegue el flujo oficial; no enviar contraseñas/tokens por chat.
- Confirmar o corregir la hipótesis de objetivo comercial: ¿consultas calificadas para ONIA como norte y educación/comunidad como camino? Si cambia la prioridad, ajustar la cola antes de publicar.

**Próximos pasos**
1. Mostrar las tres hojas de contacto y captions v2 a Sergio para aprobación **exacta** por versión/cuenta; QA factual/visual ya terminada (22 láminas, 32 tests). Listo = aprobación registrada, sin confundir esquema con demo ejecutada.
2. Editar G06 cuando llegue bruto exacto: corte 35–45 s, títulos densos pero legibles, tabla histórica oficial y fuente visible, cifra y límite contextualizados; entregar preview para aprobación. Listo = voz, fuente y captura coinciden sin resultados propios inventados.
3. Resolver segundo video n8n: completar pantalla/voz coincidentes y validar los dos caminos con datos ficticios o presentarlo sólo como esquema. Listo = no se vende como ejecución real lo que no se probó.
4. Recuperación Postiz **sólo con aprobación específica** y cola vencida neutralizada con respaldo/inspección previa; luego OAuth oficial para cinco destinos posibles, prueba privada en YouTube del ID correcto y borrador por canal. Listo = integraciones verificadas, ningún post vencido liberado.
5. Preparar una cola por canal con assets y captions de versiones aprobadas, publicar sólo entonces, comprobar URL/ID público y registrar fecha/cuenta. FB personal por carril nativo/manual. Listo = enlaces vivos, no sólo respuesta 200 del scheduler.
