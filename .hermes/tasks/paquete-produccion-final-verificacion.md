# Verificación final acotada H1–H7

**Dictamen: CAMBIOS NECESARIOS — residual H5.** Los otros seis hallazgos están resueltos para borrador privado. Esta es la única revalidación acordada: se devuelve el residual explícito a Hermes/Sergio, sin abrir otro ciclo de pulido. No aprueba publicación, apertura de venta, configuración ni gasto.

Tarea `task_2a408b945729`, dispatch `ctx_3d946b359afb`, 24-oct-2026. Corrección Claude `task_dd3a681d7794` / `ctx_e3d808edbe6c`, cierre `msg_4e7c9d612e4e`. Base de rutas: `hermes-content/research/iman-workshop-20261022/paquete-produccion/`.

## Baseline y pruebas propias

Leí `ENTREGA.md` §0, el dictamen anterior y los pasajes/documentos/scripts afectados por H1–H7. **13/13 archivos coinciden en SHA-256 y bytes** con `.hermes/tasks/paquete-produccion-corrected-snapshot.json`. Las diferencias frente al snapshot anterior son la corrección autorizada, no regresiones; el snapshot original no se modificó. No se editó ningún entregable del paquete.

Hashes actuales principales (los trece se calcularon, no solo estos cuatro):

| Archivo | SHA-256 |
|---|---|
| ENTREGA.md | `1e583b0ae308cd79edb26caff9dcb3ea59cf514fe13e16c0016dd81241f90c7f` |
| GUIONES-SEMANA.md | `ff13054bc4bcf635f6abd27b47d1cae65b5d5e416043b3cdefe278e60f57ca47` |
| WORKSHOP-MATERIAL.md | `b4132f16642020e30c7f56cd796655703990c0fdc4691794ba2168ad74667064` |
| META-ADS-ESTUDIO-APLICADO.md | `8f741a3ce3bfb56cdda306f0a5dfcba3a34e7ff26ed988c05610ddfc103d081c` |

**Ejecuté realmente**, después de leer sus fuentes, las cuatro pruebas con `python -B` desde `pruebas/`: `cuentas_workshop.py`, `meta_cuentas.py`, `contar_palabras.py`, `verificar_material.py`. Las tres que contienen comprobaciones terminan en OK; conteo termina normalmente; no hubo traceback y el comando conjunto terminó con exit 0. No son las salidas guardadas del autor. El shell restringido no descubría Python; la ejecución específica aprobada por el mecanismo nativo funcionó, sin instalación ni cambio de configuración. `-B` evitó escribir bytecode. No se invocó modelo externo.

Además ejecuté dos contraejemplos de H5 importando el mismo módulo con `python -B -c`; ambos devolvieron 1, exit 0. Reconté con regex Unicode los trece párrafos hablados del Markdown, coincidentes con los conteos del script. Estos controles prueban lógica/conteo, **no** ejecución del prompt por un LLM, ensayo de voz, comportamiento de asistentes ni aceptación de participantes.

## Resultado por hallazgo

| Hallazgo | Estado | Evidencia actual y límites |
|---|---|---|
| **H1** Cobertura económica | **RESUELTO** | `META-ADS-ESTUDIO-APLICADO.md:74–89,159–160`: ingreso acreditado atribuible frente a gasto real, cobertura bruta, no beneficio/causalidad. `meta_cuentas.py` pasa los siete casos: 250<300; 200≥180; mezcla290<300; mezcla310≥300; 350≥300; cero pagos; 300=300. Ya no depende de cinco pagos universales. |
| **H2** Destino, calificación, atribución y certeza | **RESUELTO como propuesta privada; pendientes operativos conservados** | `META-ADS-ESTUDIO-APLICADO.md:11–13,40–52,61–68,91,127–128,143–148,157–158`: A canónico/B alternativa; elegibilidad personal/Page/etiquetas no acreditadas; teléfono prueba solo mensajería; cuarta pregunta y calificación pendiente; origen ambiguo no se atribuye; cero conversaciones no diagnostica causa. Techo Bs300 sin +20%, regla interna y ausencia de umbral estadístico explícitos. Antes de operar quedan elección de destino, medición y elegibilidad reales; este dictamen no las confirma. |
| **H3** Absolutos sobre datos/errores | **RESUELTO** | `GUIONES-SEMANA.md:237,244,261`, `WORKSHOP-MATERIAL.md:48,95–98,204`: casos totalmente inventados, cambio de nombre no anonimiza, menor exposición sin riesgo cero; error puede llegar al cliente, sin afirmar que siempre lo detecta una queja. Textos del módulo y Markdown coinciden. |
| **H4** Prompt y discrepancias | **RESUELTO como contrato propuesto** | `WORKSHOP-MATERIAL.md:93,107–125,168–170`: sin garantía universal ni ejecución externa; dueño confirma riesgo/revisión; no candidata/datos faltantes/empate tienen salida; recalcular ambas cuentas, sin preferencia automática por la humana. `cuentas_workshop.py` pasa diez casos de prioridad y cinco de reconciliación, incluido humano incorrecto. Es prueba de la lógica del script, no del comportamiento de un modelo. |
| **H5** Rúbrica exhaustiva/coherente | **RESIDUAL** | Los huecos de 3–4 y >8 tareas concretas y sin candidata fueron atendidos (`WORKSHOP-MATERIAL.md:178–197`); pero texto y script aún discrepan ante mayoría vaga. Contraejemplos abajo. Las pruebas existentes pasan sin comprobar esa equivalencia. |
| **H6** Cierres, CTA y segundos | **RESUELTO** | `GUIONES-SEMANA.md:8,71,105–119,132–143`: segundos estimados, cierre sábado A29 palabras ≈9,06s; lunes A16≈5s; miércoles A17≈5,31s a192ppm. Domingo termina con una acción, sin opción de añadir CTA comercial. Se adaptaron las tablas. Las duraciones siguen sin ensayo; no se presume que se puedan decir naturalmente a ese ritmo. |
| **H7** Primaria Goldman y referentes fechados | **RESUELTO en trazabilidad** | `GUIONES-SEMANA.md:38,80–85,133–147`: primaria citada, NBC secundaria; compromiso para programa general, orientación EE.UU., no Bolivia; 403 del autor preservado, sin fingir lectura. Se cita corroboración anterior de Codex/Hermes, no una nueva apertura en este turno. Referentes históricos del8-oct y montaje propuesto explícitos. No reabrí noticias ni referentes. |

### Residual concreto de H5

`WORKSHOP-MATERIAL.md:178` asigna **0** si la mayoría de tareas son vagas, pero asigna **1** a «3 o 4 concretas» o «9 o más». Las condiciones se solapan. `:183` afirma que son excluyentes. En cambio `pruebas/cuentas_workshop.py:61–69` solo da 0 si hay hasta dos concretas; el resto incompleto da1, aunque predominen vagas.

| Entrada ejecutada | Aplicación de la tabla escrita | Resultado real del script |
|---|---|---:|
| `rubrica_lista(8, 3)` — 3 concretas, 5 vagas | 0 por mayoría vaga; también 1 por 3 concretas | **1** |
| `rubrica_lista(9, 3)` — 3 concretas, 6 vagas | 0 por mayoría vaga; también 1 por 3 concretas / 9 o más | **1** |

Por tanto no queda demostrada la corrección completa de H5, aunque ya haya una puntuación para todo par de números. El test de que la función devuelve un elemento de `{0,1,2}` no comprueba exclusividad de la tabla ni concordancia con ella. **Pendiente explícito:** unificar la regla de mayoría vaga entre tabla y función, y conservar estos dos casos como comprobación. No se hizo esa modificación ni se solicita otro ciclo automático: Hermes y Sergio reciben el estado real.

## Palabras y duraciones calculadas

Conteo actual sobre hablado real. A/B excluyentes; segundos de voz a192ppm y a150ppm, sin pausas, **no medidos en voz**. El rango de producción del script suma 2–4s como supuesto de pausas, no como observación.

| Guion | Palabras (base; total A/B cuando corresponde) | Voz a192ppm | Voz a150ppm |
|---|---|---|---|
| Sáb24 | 82; A111 / B96 | A34,7 / B30,0s | A44,4 / B38,4s |
| Dom25 | 109 | 34,1s | 43,6s |
| Lun26 | 98; A114 / B108 | A35,6 / B33,8s | A45,6 / B43,2s |
| Mar27 | 92 | 28,8s | 36,8s |
| Mié28 | 77; A94 / B87 | A29,4 / B27,2s | A37,6 / B34,8s |
| Jue29 | 90 | 28,1s | 36,0s |
| Vie30 | 106 | 33,1s | 42,4s |

Apertura: 264 palabras, 82,5s calculados a192ppm. Agenda verificada por suma: 45+5+45=95 transcurridos, 90 de contenido. Caso: 388min/semana y1552min/mes, supuesto cuatro semanas. Nada de esto prueba tiempos con participantes. Venta pausada; cierres B por defecto y A condicionado a apertura confirmada, no habilitada por tener guion.

## Fuentes Meta y hooks: límites de la comprobación

No hubo investigación externa nueva. Los accesos Meta previamente bloqueados siguen **NO_VERIFICADO** para el revisor (429/login/inaccesible); se preserva lectura declarada por autor, sin convertirla en corroboración independiente. No confirmo requisitos actuales, interfaz, optimización disponible, elegibilidad del número ni configuración. La limitación no se resuelve con cambios de redacción; tampoco exige configurar una cuenta para revisar este borrador.

**Rectificación de mi dictamen anterior, línea12:** hubo fallos de hooks contemporáneos, incluso posteriores a worker_done, según capturas/terminal señalados por Hermes. Mi frase anterior de ausencia de errores no acreditaba salud y queda retirada también en el informe original. No atribuyo `CommandNotFoundException` de Python a hooks sin prueba.

Hermes informa instalación autorizada de dependencias, cambios Windows en siete handlers claude-mem y uno Impeccable y sus pruebas verdes. **No inspeccioné ni modifiqué esa configuración y no certifico su carga en esta sesión.** Hasta esta redacción, los resultados de herramientas visibles de este turno no muestran `Hook failed`; eso no prueba ejecución/carga de todos los handlers ni ausencia de avisos después de worker_done/final. La reparación debe quedar como informada por Hermes, con validación de esta sesión no concluyente. No reinicié, desactivé hooks ni amplié configuración/permisos globales.

## Entrega y parada

Seis hallazgos resueltos y un residual H5 explícito. El material puede mostrarse a Sergio **como borrador privado con esa salvedad**, sin presentarlo como paquete aprobado sin pendientes. No se aprueba publicación ni gasto ni se valida demanda/ahorro. Con este informe concluye la revalidación única; no se crea otra investigación, pulido ni revisión por iniciativa del auditor.
