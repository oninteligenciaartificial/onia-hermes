# Revisión C10 Pendientes — 2026-10-06

META: copy honesto y usted sin modificar handlers/permisos ni mensajes almacenados.
PRUEBA DE HECHO: delta5paths, canal de despacho local y tres suites afectadas.
REGLA DE PARADA: revisión puntual porSHA, sin navegador ni envíos.

SHA9c34165d6506bf939e518c63c4d5fecd64071992, PR120, base5102535c.
Dictamen: FAVORABLE, sin hallazgos bloqueantes.

- Elimina «Onia envía por vos» y «lo envíe solo»; explica aprobación, conexión/cupo y alternativa manual. Las24h se presentan como comportamiento de estas propuestas cuando Onia no confirma ventana, coherente con channels.ts; no como prohibición universal de WhatsApp.
- Textos propios en usted; primera persona de «Enviar yo mismo»/«Ya lo envié» se conserva correctamente como acción del usuario.
- Delta runtime sólo cambia textos/comentario; condiciones, flags, permisos, endpoints, payloads, botones y enlaces intactos.
- body, reason, metadata y errores ajenos siguen interpolados sin reescritura; prueba conserva «Hola Jorge, te recordamos tu control.» como cuerpo almacenado.
- Pruebas negativas de autonomía y manuales/permiso configuración preservadas o ampliadas; destinatario sigue comprobándose.

Verificación propia:10/10PASS en sin-whatsapp, ya-lo-envie y destinatario; diffcheckPASS. Inspección de channels.ts valida fallback manual para ventana no confirmada. Árbol limpio y HEAD exacto.
No repetidas91pruebas. Sin DB/envíos/navegador/build/install/fanout. QA visual de Madre y CI final quedan como gates independientes; no se declara entrega de mensajes ni producción.
