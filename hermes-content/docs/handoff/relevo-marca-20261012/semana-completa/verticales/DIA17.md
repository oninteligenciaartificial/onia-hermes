# IA-1017-1 · Dos sesiones de IA: separá los archivos

Si abrís dos sesiones de IA sobre la misma carpeta, pueden tocar los mismos archivos. Trabajar en paralelo necesita algo más que abrir otra ventana.

Claude Code permite iniciar una sesión en un worktree. Es otra carpeta de trabajo del mismo repositorio, con su propia rama. El historial se comparte, pero los archivos de trabajo están separados.

El comando es claude, dos guiones, worktree y un nombre. La documentación explica cómo crearlo y cómo revisar lo que quedó al salir.

Ojo: separar archivos no significa que ya se puedan juntar todos los cambios. Si dos tareas cambian la misma parte, alguien tiene que revisar cómo encajan.

Mi consejo es dividir también el objetivo. Una tarea y un resultado claro por sesión. Antes de ejecutar un comando, comprobá la ruta y la rama.

Esto es una función documentada, no un experimento propio que estoy dando por terminado. Más ventanas no reemplazan la coordinación.

# IA-1017-2 · Rewind no es un botón que deshace todo

Claude Code puede guardar puntos para volver atrás en la conversación y en los cambios de archivos que registra. La función se llama checkpointing, y se usa desde el menú de rewind.

Pero no lo pienses como un botón que deshace todo lo que pasó en tu computadora.

La documentación aclara límites: no es una copia completa del sistema. Lo que cambió por otras herramientas o fuera de los cambios registrados puede quedar fuera. Una acción en un servicio externo no vuelve atrás porque rebobines la charla.

Mi consejo: antes de una operación importante, entendé qué estás protegiendo y cómo lo recuperarías. Para un proyecto, el historial de versiones y una copia adecuada cumplen otra función.

No te estoy mostrando una recuperación real ni prometiendo que todo vuelve. Volver a un punto ayuda cuando sabés qué cubre. El primer control es conocer lo que no cubre.

# INF-1017 · Qué quiero hacer cuando una demo falla

Si una demo falla mientras grabo, no quiero convertir el error en una historia de éxito con un corte.

Quiero separar dos cosas: que una función exista y que haya funcionado en mi prueba. El manual puede decir que está disponible. Mi pantalla puede mostrar que en ese momento no pude usarla. Las dos cosas pueden ser verdad.

La idea es guardar qué pasó, revisar la versión y el acceso, y decidir si la pieza sigue teniendo sentido. No todo error tiene que salir en cámara, pero tampoco quiero decir lo probé si no lo pude probar.

No te cuento que eso me pasó hoy. Te cuento cómo quiero tratarlo si pasa.

Una demo sirve para mostrar algo concreto. Si todavía no salió, puedo explicar el concepto y decir que la prueba quedó pendiente. Prefiero esa diferencia clara a actuar un resultado.


---

## Fichas fuera del hablado: actualidad, fuentes y recortes

Fechaobservación:2026-10-12 · timezoneAmerica/Caracas. Autor/lectorprimarias: /root/guiones_sol. Ninguna ficha ni plan siguiente se dice a cámara. No piezas/publicaciones aprobadas.

### IA-1017-1

**Hablado:** completo, reservaeducativa/documental; no noticia del día confirmada. **Slotnoticioso:** pendiente verificación o sustitución.

**Fecha del hecho/documento:** Docactualconsultado12oct; lanzamiento no fechado. **Observado:**12oct2026.

**Fuentesprimarias:** https://code.claude.com/docs/en/worktrees

**Versión/condición:** EntornoGit/versionlocal/demo no comprobados.

**Gateactualidadpara 2026-10-17:** Antes del post propuesto revisar fecha/hecho/versión con fuente oficial. Sin novedadreciente confirmada, conservar como reserva educativa; sustituirslotnoticia o cambiarclasificación/calendario con revisión. No llamarlo noticia del13–19 ni breaking.

**3planes:** IA-1017-1-YA, IA-1017-1-YB, IA-1017-1-YC; candidatosenPLANES_63.json. Autonomía/duración no verificadas: noassets/63renders.

### IA-1017-2

**Hablado:** completo, reservaeducativa/documental; no noticia del día confirmada. **Slotnoticioso:** pendiente verificación o sustitución.

**Fecha del hecho/documento:** Docactualconsultado12oct; lanzamiento no fechado. **Observado:**12oct2026.

**Fuentesprimarias:** https://code.claude.com/docs/en/checkpointing

**Versión/condición:** Bash/external/subagents puedenquedarfuerarewind;no backupcompleto.

**Gateactualidadpara 2026-10-17:** Antes del post propuesto revisar fecha/hecho/versión con fuente oficial. Sin novedadreciente confirmada, conservar como reserva educativa; sustituirslotnoticia o cambiarclasificación/calendario con revisión. No llamarlo noticia del13–19 ni breaking.

**3planes:** IA-1017-2-YA, IA-1017-2-YB, IA-1017-2-YC; candidatosenPLANES_63.json. Autonomía/duración no verificadas: noassets/63renders.

### INF-1017

Hablado informal completo en intención/reflexión: no relato deexperiencia cumplida, ganancia/resultadosni promesa de recurso. Fuente:planKIT-GRABACION/FLUJO-DIARIO+autorización12oct; no noticia. Título heredadoes índice; texto no afirma que yaocurrió.

**3planes:** INF-1017-YA, INF-1017-YB, INF-1017-YC; candidatosenPLANES_63.json. Autonomía/duración no verificadas: noassets/63renders.
