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

Actualización: banco resuelto mediante fuentes36.8MB en C:/Users/PC/.codex/worktrees/banco-ui-c/platform, .next/TEMP enE y dependencias existentes. HTTP200 y navegador IAB confirmado en Agentes, Pendientes sinWhatsApp, login y registro. Error navegador inicial no persiste tras runtime operativo; sin alterar seguridad. Fuentes originales no descargadas: fallback tipográfico, no QA de fidelidad de fuentes.

PR117 final ae641152c2a626aff6ad18757885c61830b0e639: copy acotado login/registro,69tests autor; revisión independiente inicial69 y delta12 aprobados tras3P3 corregidos. Review canónica cierre-1.0-revision-auth-20261006.md. Madre observó trato usted y campos/CTA en browser; registro a390CSSpx, form303px dentroviewport384.8 ysinoverflow horizontal DOM. Captura registro-usted-mobile.png enE/cierre-1.0-20261006. CDP deviceScaleFactor1.25 resuelve recorte de captura por escalaWindows; overrides restaurados. No envío de formularios ni cuenta creada.

Agentes: abrir ¿Qué hace? revela explicación; Pendientes: Ver mensaje expande texto y destinatario ficticios. Capturas privadas pendientes-desktop.png, pendientes-mobile.png. Hallazgo aún pendiente: banner sinWhatsApp promete «Onia envía por vos» y otros textos siguen en voseo; debe contrastarseconhandler/catalogo y corregirse en unidad aparte. No se tocó aprobación/envío real. Patrónreveladoprogresivo ya existe enONIA: conservarlo, no duplicarlo por copiarJelou.

C5 asignado al carrilUI trasPR117: vista diaria porprofesional, conservarmes/lista/modelo/roles; contrato ypaths enE/cierre-1.0-20261006/c5-agenda.md anteseditar. C6a mantieneleaseficha/historia enotrocarril. No C11b/C14/producción.

C5 PR118 aa9f740c67511d52bea193f6dc2a2f2f8ffa7c76: madre inspeccionó navegador3136. Fixture final /dev/agenda/dia conservaAgendaDia deproducción ydeshabilitaConfirmar;7fuentesruntimehashigualautor(c5-runtime-hashes.json). Desktop5citas/3columnas; Luis2; Luis+Pendiente0conmensaje; doctor sóloAna2; lectura0Confirmar; erroralert legible. Vista390px pageWidth385 yregiónhorizontal351/868, sinoverflowglobal. DetalleA produce statusfixture. Rutaoriginal /dev/agenda conservada: Mes→Díafunciona yVerdetalleJorgeabre listadetalleexistente1cita. NoConfirmar/editar/recordatorio/APIreal. Fuentesfallback, noaprobaciónfidelidadtipográfica. Capturas c5-agenda-desktop.png y c5-agenda-mobile.png enE; tomadas antesajusteruta conmismaUI; revisiónindependienteSHAenprogreso. Contrato cierre-1.0-c5-agenda-20261006.md. No afirmarvalidaciónagendaautenticada/BDreal.
C5 corrección27d47f989bc0e7090fbef0f51f89faec5d49dcff: revisiónv2FAVORABLEdelta2P2, lunes0/domingo6 yactive=truecorrectos, pruebaspropiasantesREDahoraPASS.103autorPASS. Runtime7/7hashesactualizadoautor. Madre vio /dev/agenda/dia final, DetalleA funciona; enbanco /dev/agenda Mes→Día→detalleJorgefunciona sinaccionesremotas. CIúltimoSHApendiente.
AuthPR117cbc36a6c repara3expectationsCI en2files,81testsPASSautor; no cambiaUI ni consentimientos/URLs/controlGoogle. Reviewdeltafinalpendiente, noesunadeudaCIignorada.

## Cierre de revisiones y QA de Pendientes

PR117 `cbc36a6c` tiene revisión favorable del último ajuste de tests (12 pruebas focales de v2). PR118 `27d47f98` tiene los dos P2 corregidos y revisión favorable; nueva captura `E:/ONIA-Codex/cierre-1.0-20261006/c5-agenda-final.png` muestra horarios activos correctos en el banco con datos ficticios y fuentes de sustitución.

PR120 `9c34165d6506bf939e518c63c4d5fecd64071992` corrige cinco archivos de copy, expectativas y documentación. Autor: 91 pruebas en 12 archivos; v2: 10 pruebas propias focales, revisión favorable. La madre abrió `/dev/pendientes?sinwhatsapp=1`, comprobó el banner «Conecte WhatsApp para habilitar los envíos disponibles» y expandió «Ver mensaje». Se conserva «Enviar yo mismo por WhatsApp» y la aprobación explícita. No hubo envío, rechazo ni contacto con terceros. Captura `E:/ONIA-Codex/cierre-1.0-20261006/c10-pendientes-final.png`.

La medición móvil más reciente fue 488 CSS px de viewport y 482 px de página, sin desborde horizontal. El override solicitado de 390 px no produjo esa medida; no se certifica 390 px para este delta. Los textos de mensajes de clientes/fixtures y el encabezado de página fuera del componente permanecen intactos. No confundir esto con una revisión global de voz de todas las pantallas.

Los CI de los últimos SHA de PR117/118/119/120 siguen pendientes/en cola; PR116 ya pasó lint y typecheck y continúa sus tests. Ninguna revisión sustituye CI, migración, prueba autenticada ni autorización de publicación.

QA móvil final C10: resuelta escala Windows 125% con emulación solicitada312px y medida real DOM390px; página384px, sin desborde horizontal. Captura `c10-pendientes-mobile-final.png` guardada en carpeta E de evidencia. Los tres botones manuales medían44px de alto en el paso anterior. No cambios de código ni envíos; override restaurado. La medición DOM, no el parámetro solicitado a CDP, es la evidencia del ancho efectivo.

## Odontograma: entrega y QA parcial

PR119 final `4cb9495cca8d1fba71f7c2b1cfef42576ab1f72f` añade editor de cinco caras. Revisión funcional v2 favorable con26 pruebas focales y último P3 de copy cerrado por inspección de una línea de madre. El banco3135 tiene4/4archivos idénticos a blobs del SHA final; manifiesto `c6b2-runtime-hashes.json`.

Madre comprobó en browser sobre dcb5cb22 (antes de correcciones exclusivamente textuales): seleccionar36, visualizar Caries general/Mesial Restaurado/Oclusal Sano, Vestibular sin registro y Guardar deshabilitado hasta elegir condición. Guardar Vestibular Caries con nota devolvió Guardado sin alterar las otras caras. En caso conflicto, modificar Mesial produjo409 simulado, conservó nota y mostró recarga. Cambiar a11 pidió confirmación; cancelar conservó36 y borrador.

Después, al abrir «Descartar borrador y recargar» y coincidir una actualización del banco, el diálogo quedó bloqueado: getJsDialog no devolvió handle y tab11 falló por timeout de Emulation.setFocusEmulationEnabled. Se leyeron instrucciones de troubleshooting y se probaron cancelación/close documentados; sin éxito. Tab13 y alias127.0.0.1 cargan el escenario de lectura con texto actualizado, sin error de consola y botón36 no deshabilitado, pero clic no modifica selección. No se cambió código por este bloqueo del navegador. No certificar readonly interactivo, error500, ausente, orientación visual, teclado ni responsive dental. Tests cubren esos contratos; no equivalen a QA browser ni a validación clínica externa. No borrar sesiones ni reiniciar servicios para intentar ocultar el problema.

UI restante pendiente de navegador operativo. Tipografía fallback en todos los bancos; no fidelidad de fuentes. Migración no aplicada, persistencia PostgreSQL/concurrencia real no probadas. No merge/deploy.

## Continuación goal — QA dental recuperada, 6-oct

El bloqueo IAB anterior dejó de reproducirse después de cerrar las pestañas temporales al terminar el turno; no se cambió producto, servicio ni seguridad. Nueva pestaña14 en banco3135, runtime4cb9495c verificado en manifiesto4/4.

- Sólo lectura: pieza36 abre, Mesial se selecciona con Return, campos de condición y notas deshabilitados, cero botones Guardar. Las cinco caras siguen explorables.
- Móvil efectivo390px (DOM), página384px: sin desborde global. Cinco botones de cara100.65–100.67px de ancho ×58px alto; arco con desplazamiento propio. Evidencia c6b2-readonly-mobile.png (captura parcial del detalle; medidas DOM son prueba del viewport).
- AUSENTE: pieza36 conserva Mesial Restaurado y su nota multilineal; condiciones/notas/Guardar esta cara deshabilitados. c6b2-ausente.png.
- Error500 simulado al guardar Mesial: texto ingresado se conserva, muestra fallo y Cambios sin guardar, no Guardado. c6b2-error500.png. Después se restauró exactamente la nota ficticia inicial, dirty=false, antes de navegar.
- Orientación: se seleccionaron11/21/31/41; Mesial columnas3/1/1/3 respectivamente, Distal inverso; Vestibular fila1 superiores/fila3 inferiores; central Incisal en las cuatro anteriores. Se observó Oclusal en36. Desktop efectivo1440px/página1434px. c6b2-orientacion-desktop.png. Esto verifica el contrato de orientación, no certificación clínica externa.

Overrides restaurados. Madre realizó estas interacciones; no agentes adicionales ni suites repetidas. Fixture intercepta APIs: no pacientes reales, SQL, migración o producción. Persisten límites: fidelidad tipográfica (fallback), PostgreSQL/concurrencia real, QA autenticada e integración. No se realizó en esta pasada el recorrido completo de recarga tras409 ni toda navegación SPA. El goal sigue incompleto.
