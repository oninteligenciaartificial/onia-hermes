# Cierre 1.0: revisión visual y aplicación de referencias

META: corregir fricciones comprobables de la 1.0, conservando alcance, identidad y permisos de ONIA.
PRUEBA DE HECHO: observación en navegador → cambio concreto → validación en el mismo recorrido, con SHA y limitaciones.
REGLA DE PARADA: no convertir referencias comerciales en funciones prometidas; no publicar sin revisión y autorización de producción.

## Navegador inspeccionado el 6-oct

| Superficie | Observación directa | Aplicación/decisión |
|---|---|---|
| [Jelou](https://jelou.ai/en/) | Selector de cuatro casos; al abrir citas se colapsa compras y aparece una conversación ilustrativa. En viewport 390×844 las opciones se apilan. | Adoptar revelado progresivo si reduce decisiones en un flujo real. No tomar ilustración como prueba de reserva ejecutada; no copiar sus imágenes, marcas ni conversación. |
| [Lucy Datec](https://lucy.datec.ai/) | Configurador muestra pasos y resumen de solución; la página distingue demo simulada. | Mantener decisión → resumen claro → acción. No añadir un configurador a ONIA sólo por imitación ni trasladar porcentajes de venta de su web. |
| [Doctocliq agenda](https://www.doctocliq.com/funcionalidades/agenda-medica-digital) | Página pública expone agenda por profesional y estados de citas; aclara créditos para WhatsApp. No se accedió a su aplicación privada. | Criterios para ONIA: profesional identificable, estado visible, cancelación conservada y canal/coste explícito. Ya pertenecen a agenda/seguimiento; no abren otro producto. |
| [ONIA login](https://app.onia.com.bo/login) | Entrada pública abre sin sesión; textos «Entrá», «Probás», «Creá», «pedí». | Incumple regla vigente de usted hacia clientes. Corrección acotada asignada al carril UI; verificar desktop/móvil sin crear cuentas. |

Referencia visual privada: `E:/ONIA-Codex/cierre-1.0-20261006/jelou-mobile.png`. Se consultó DOM y screenshot; no se probaron APIs ni resultados de negocio de competidores. Los contenidos históricos de competencia del 1-oct requieren nueva evidencia antes de convertir afirmaciones absolutas en argumentos comerciales.

## Criterios de aceptación ONIA

1. **Acceso:** textos de usted consistentes; campos con etiqueta, errores comprensibles, botones visibles a 390 px, navegación por teclado. No cambiar duración de prueba, precio ni términos en una corrección de voz.
2. **Agenda:** fecha, profesional y estado distinguibles; una reprogramación conserva contexto y no anuncia éxito si falla; verificar conflicto/rol/tenant, no sólo aspecto.
3. **Ficha:** historia ordenada por fecha clínica y odontograma legible. Una consulta antigua cargada después no debe aparentar ser la más reciente.
4. **Pendientes:** motivo y siguiente acción explícitos; el estado de la conexión no autoriza prometer envío. Estado vacío explica qué falta, sin fabricar pacientes.
5. **Caja:** apertura/cierre/descuadre y permisos requieren recorrido funcional con registros ficticios; una captura del banco no demuestra migración aplicada ni saldo bancario.

## Ejecución y límites

Dos carriles Astra medium: Desarrollo audita 15 puntos y corrige orden de historia; Banco UI habilita localhost con fixtures existentes y atiende acceso. Madre posee navegador y registro canónico. Revisión independiente sólo para nuevos SHA; no repetir Caja/C13/C15/C11a aprobados.

El banco usa datos ficticios y no conecta producción. Las capturas deben rotularse como banco/demo: no acreditan autenticación, persistencia ni pruebas reales de cobro. C14 y C11b conservan las dependencias del relevo vigente. Las entregas se incorporarán aquí al finalizar, sin convertir trabajo en curso en validación aprobada.

Primer ensayo: banco E inicia Next pero devuelve HTTP500 al compilar por resolución de dependencias compartidas C/E. El navegador integrado además devuelve `net::ERR_BLOCKED_BY_CLIENT` para localhost. Son fallos distintos; servidor «ready» no equivale pantalla servida. Alternativa autorizada: fuentes reales C acotadas con caché/temporales E, sin instalar ni reducir seguridad.

Acceso público ONIA observado a1280×720; captura `E:/ONIA-Codex/cierre-1.0-20261006/onia-login-antes.png`. El override móvil no se aplicó a esta pestaña: medida DOM1280×720. Por tanto NO hay QA móvil válida del login en esta pasada. La observación móvil de Jelou sí produjo captura estrecha; no extrapolarla a ONIA.
