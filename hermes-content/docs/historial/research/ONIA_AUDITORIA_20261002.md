# Auditoría de Onia en producción — 2-oct-2026 (foto del día)

> Foto de un día, NO fuente de verdad. Medida en solo lectura por 9 investigadores (agente de WhatsApp de ventas, velocidad, datos, arquitectura y los 5 rubros) con 2 verificadores por hallazgo grave. Las decisiones que salgan de acá se escriben en su archivo fuente (catálogo, handoff, skills).

# Onia hoy: WhatsApp, velocidad, datos, arquitectura y rubros (2-oct-2026)

Sergio Urcullo: esto es lo que se midió hoy en producción, solo leyendo. No se envió ningún mensaje.

## 1. En una línea

**a) ¿El agente de WhatsApp está listo para empezar a escribir? Nota: AMARILLO.**
- **Para contestar, sí.** Está vivo y responde en unos 3 s. El número +591 75414930 está CONNECTED, con calidad GREEN, y corre el mismo código que main (172 de 172 archivos iguales).
- **Para escribir primero desde el número de ventas, no.** Ninguna de las 7 plantillas aprobadas sirve como primer mensaje. Hoy se escribe 1:1 desde tu teléfono.
- **Lo que más frena:** el bot ya agenda demos y no hay ninguna cuenta demo con datos.

**b) Velocidad. Nota: AMARILLO.**
- **El servidor va sobrado:** carga 0,5 sobre 4 vCPU, 10,9 GB de RAM libres y 0 errores 5xx en 72 h. /login y /register se ven en 1,0-1,6 s en un celular lento.
- **La web de venta:** /precios, /empezar y otras 9 páginas muestran la pantalla vacía bajo el logo hasta que carga el JavaScript. LCP de 3,4-3,7 s; la meta es 2,5 s.
- **El panel:** sus APIs tardan p50 405 ms y p95 1.135 ms.
- Todo se midió desde EE.UU. Desde Bolivia hay que sumar unos 110-135 ms por pedido.

**c) Organización de datos. Nota: AMARILLO.**
- **Está ordenada:** el código y la base coinciden (0 diferencias, 41 de 41 migraciones aplicadas), RLS está activo en 86 de 86 tablas y las 15 rutas revisadas filtran por cliente.
- **El riesgo:** todos los respaldos viven en el mismo disco del VPS. Hay 0 copias afuera y la restauración se probó una sola vez, a mano, el 24-sep.

**d) Arquitectura. Nota: AMARILLO.**
- **Capacidad sobra:** un solo VPS aguanta 5 y hasta 20 clientes sin tocar hardware. La CPU nunca bajó de 31 % libre en 8 días y quedan 10,6 GB de RAM libres.
- **Lo que falla primero no es la capacidad:**
  - el deploy del bot está trabado, con 11 de 1.564 tests en rojo;
  - Chatwoot no tiene respaldo;
  - el bot corre como un proceso suelto, sin supervisor real.

**e) ¿Están todos los rubros cubiertos según sus necesidades? Nota: AMARILLO, con comercio en ROJO.**
- **No.** Dental y estética cubren el día a día, con huecos. Importadora sirve como piloto acotado. Comercio no se puede vender: no tiene factura ni camino para llegar a ella. Servicios solo le sirve a un consultorio que trabaja con citas.
- Ningún rubro tiene un cliente real: hay 5 organizaciones, 0 pagos y 0 citas.

## 2. Qué hacer, en orden

1. **Escribirles hoy, desde tu teléfono, a los leads que esperan.**
   - La conv 35 (clínica de 4 doctores) lleva 38 días sin respuesta y la conv 37, 35 días.
   - La conv 58 (17-sep) quedó esperando horario.
   - También los 3 pedidos de acceso de agosto: 2 dentales y Clinica Leonardo, de estética.
   - Los borradores ya están en `ONIA_LEADS_ESPERANDO.md` §3, y el precio que citan (Profesional, Bs 890) está verificado.
   - Esfuerzo: minutos. Quién: Sergio Urcullo.
2. **Decidir la cuenta demo y armarla.**
   - El bot ofrece y confirma demos por su cuenta, y no hay ninguna cuenta con datos en ningún lado.
   - El sembrador local ya carga los 5 rubros, incluida «Valeria», con un tratamiento a medias de 33 días. Ese es el momento fuerte de la demo.
   - Esfuerzo: tu decisión, minutos; armarla, horas. Quién: decide Sergio Urcullo y la arma la sesión de Plataforma.
3. **Destrabar y publicar el bot.**
   - Arreglar los 11 tests: una línea del doc de pauta y fechas fijas en las pruebas.
   - Apagar Cal.com y la transcripción de voz. Apuntan a servicios que ya no existen, y por eso hoy el bot dice «Listo, agendado» y en la línea siguiente se corrige.
   - Mergear los arreglos de los botones del recordatorio (`2f85bdd25` y `ffb65f75e`) antes de conectar el primer número de cliente.
   - Esfuerzo: horas. Quién: la sesión del carril chatbot.
4. **Hacer la prueba con tu teléfono**, que es lo que pediste. Los pasos están en la sección 4. Con esa prueba firmás la frase del anuncio, que ya está publicada sin tu OK. Esfuerzo: minutos. Quién: Sergio Urcullo.
5. **Sacar una copia de los respaldos fuera del VPS.**
   - Copia diaria de supabase-db, chatwoot-db y n8n, más una restauración automática semanal que avise si falla.
   - Tiene que estar antes de que la primera clínica cargue pacientes reales.
   - Esfuerzo: horas. Quién: Sergio Urcullo crea el bucket R2 y su credencial; una sesión lo instala.
6. **Que el «tratamiento a medias» se vea dentro de la prueba.**
   - Hoy el agente espera 21 días desde que se carga el tratamiento y la prueba dura 14: la clínica nunca llega a ver por qué pagaría.
   - El arreglo: pedir la fecha de la última sesión al cargar «En progreso» y mostrar la lista «en progreso sin cita».
   - Mientras tanto, alargar a mano la prueba en /admin/plans a quien cargue tratamientos.
   - Esfuerzo: horas. Quién: la sesión de Plataforma; alargar pruebas, Sergio Urcullo.
7. **Arreglar la web de venta.**
   - Que el titular de /precios, /empezar y las otras 9 páginas se pinte sin esperar el JavaScript.
   - Corregir la promesa de estética «con el control ya en la agenda». El arreglo ya está escrito, sin mergear.
   - Corre ahora porque el bot manda a los leads a onia.com.bo/precios.
   - Esfuerzo: horas. Quién: la sesión de web. Se publica cuando veas la pieza renderizada.
8. **Cerrar puertas abiertas antes del primer dato clínico real.** Esto lo midió un solo auditor; no tuvo segunda verificación.
   - Poner Easypanel y n8n detrás de Cloudflare Access o de una lista de IPs.
   - Apagar el contenedor de QA que apunta a la base de producción.
   - Quitarle a anon los permisos sobre 2 tablas.
   - Desactivar los 2 workflows de n8n que leen la base vieja.
   - Esfuerzo: horas. Quién: una sesión, con tu OK, porque toca infraestructura.
9. **WhatsApp automático para los clientes.**
   - Probar con el chip prepago un recordatorio con botones de punta a punta, después de la acción 3.
   - Decidir si Crece y Profesional lo traen incluido o siguen con el add-on de Bs 390.
   - La activación de pruebas por WhatsApp está trabada porque Meta rechaza la plantilla de autenticación. No es el permiso del token: ese ya está dado.
   - Esfuerzo: días. Quién: Sergio Urcullo (el chip, la decisión y WhatsApp Manager) y la sesión de Plataforma.
10. **SIAT.**
    - Terminar las etapas VI y IX antes del 4-nov, que es el límite de pruebas.
    - Anotar en el plan que encender el SIAT no le da factura a comercio, importadora ni servicios: su venta de caja no tiene camino a la factura y hay que construirlo.
    - En dental, además, hay que habilitar el permiso de facturación por organización. Hoy ninguna lo tiene.
    - Esfuerzo: semanas. Quién: Sergio Urcullo (el portal lo abrís solo vos) y la sesión de SIAT.

## 3. Rubros

Orden de empuje vigente (lo decidiste el 29-sep): dental, después importadora, después el resto.

| Rubro | ¿Listo para vender? | Huecos principales |
|---|---|---|
| Dental | Con huecos | 1) El tratamiento a medias no se ve dentro de la prueba de 14 días, y no hay cuenta demo con datos. 2) No existe el presupuesto: sin total, sin fases, no se puede imprimir ni enviar. 3) El recordatorio sale por correo; el de WhatsApp necesita el add-on o el plan Completo, y no hay ningún número conectado. |
| Estética | Con huecos | 1) No hay paquetes ni sesiones prepagadas. 2) La web promete «con el control ya en la agenda», y el sistema no agenda solo. 3) El recordatorio es solo por correo y no hay demo con datos de estética. |
| Importadora | Con huecos: piloto acotado (costeo, cotización por WhatsApp, créditos) | 1) No hay factura, ni un camino a la factura desde la venta, aunque se encienda el SIAT. 2) El costeo no ingresa la mercadería ni la DUI, así que se carga todo dos veces. 3) No hay precio por cliente ni venta en USD. |
| Comercio | No | 1) No hay factura ni camino a la factura desde la caja: falta código, no solo el trámite. 2) La compra al proveedor no suma stock ni costo. 3) No hay historial ni reportes de ventas. |
| Servicios profesionales | No, salvo un piloto con un consultorio que trabaje con citas | 1) No hay factura, y encender el SIAT no le llega a este rubro. 2) El mensaje le habla al contador, pero lo construido le sirve al consultorio de citas. 3) No hay cobro mensual recurrente (iguala). |

**Uso real en producción:**
- 1 org dental: tu cuenta de prueba.
- 1 de comercio: de prueba.
- 2 de importadora: sin uso.
- 1 interna.
- En total: 0 pagos, 0 citas y 0 tratamientos cargados.

## 4. Lo que depende de vos (Sergio Urcullo)

1. **La prueba, ahora.** Desde tu teléfono, escribí al +591 75414930 primero «Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.» y después «Somos 3 odontólogos y agenda la recepcionista». No hay ninguna ventana que abrir: tu mensaje abre sola la de 24 h. Si la respuesta te sirve, queda firmada; si no, decí qué cambiar.
   - Tu número ya tiene una conversación de septiembre. Según el código, el bot vuelve a saludar pero recuerda tu rubro. Para ver lo que vive un desconocido, repetila desde un teléfono que nunca le haya escrito a Onia.
   - Para esta prueba no hace falta conectar tu número a nada. Conectarlo como WhatsApp de una clínica de prueba es otra prueba distinta: esperá a la acción 3. Hasta entonces, según el código, tocar un botón del recordatorio daría dos respuestas.
2. **Los leads, hoy.**
   - Dale el OK a los borradores de `ONIA_LEADS_ESPERANDO.md` §3 y mandalos desde tu teléfono. Desde el número de ventas no se puede: pasadas las 24 h no sale texto libre.
   - Antes de escribirle a la clínica de 4 doctores, confirmá si es Odontoking (`handoff/mercado-y-pauta.md:240`), para no escribirle dos veces.
   - La espera la pusiste vos el 12-sep: «hasta que el chatbot esté perfecto». El bot ya contesta en 3 s.
3. **La cuenta demo.** Decidí si tu «no se crean demos» del 1-oct incluye la cuenta para mostrar Onia, y dónde vive: en producción, en una base local o en un entorno aparte.
4. **El respaldo.** Creá el bucket R2 «onia-backups» con su credencial y mirá en el panel de Hostinger si el VPS tiene snapshots.
5. **WhatsApp Manager.**
   - Activá el PIN de dos pasos.
   - Cargá una descripción de una línea en el perfil.
   - Mirá por qué Meta rechaza la plantilla de autenticación (code 10, subcode 2388185).
6. **Tres decisiones cortas.**
   - Cuánto dura la demo: el bot dice 30 min, el guion 20 y el doc viejo 10.
   - Si Crece y Profesional traen el WhatsApp automático o queda como add-on de Bs 390.
   - Tu OK para la acción 8.
7. **La web.** Mirá la web corregida, renderizada, antes de que se publique.
8. **El SIAT.** Completá las etapas VI y IX en el portal antes del 4-nov.

## 5. Anexo: hallazgos por área

Se dejaron afuera 3 hallazgos que los verificadores refutaron. Cuando los dos verificadores no coincidieron en la severidad, figura como «disputada». «Sin verificar» quiere decir que lo midió un solo auditor.

**WhatsApp de ventas**
- **No hay cuenta demo y el bot ya agenda demos** · alta · Ninguna de las 5 orgs es demo. El bot ofrece horarios del 2 al 7-oct y contesta «Listo, agendado». El sembrador es solo local por diseño y la decisión de la cuenta sigue pendiente.
- **Dos leads sin respuesta desde hace 35-38 días** · alta · Las conv 35 y 37 tienen 1 mensaje entrante y 0 salientes; llegaron entre el 24 y el 28-ago, cuando el bot estaba mudo hacia Chatwoot. Ninguna de las 7 plantillas sirve para retomarlas. Hay un tercer lead: la conv 58, del 17-sep.
- Sin verificar:
  - el número de ventas no puede abrir conversaciones en frío (media);
  - la frase del anuncio está publicada sin tu firma (media);
  - tu número continúa la conversación de septiembre (baja);
  - la demo dura 30, 20 o 10 min según dónde se lea (baja);
  - el PIN está apagado y el perfil vacío (baja).

**Velocidad**
- **La web de venta queda en blanco hasta que carga el JavaScript** · media (venía como alta) · En 11 páginas el titular sale invisible del servidor. El LCP de /precios y /empezar es de 3,4-3,7 s, y con el arreglo baja a 0,8-1,0 s. Hoy no hay pauta encendida, pero el bot manda a /precios.
- Sin verificar:
  - las APIs del panel llegan a p95 1.135 ms (media);
  - cada pantalla del panel carga 382-423 KB gz de JS (media);
  - el bloqueo del hilo en la home es 3 veces peor que el 29-sep (media);
  - el gate de JS está descalibrado (baja);
  - el HTML de la web no se guarda en la caché de Cloudflare (baja);
  - se corrió pg_sleep en producción (baja).

**Organización de datos**
- **Todos los respaldos están en el mismo disco, sin copia afuera ni restauración automática** · disputada: alta / media · No hay instalada ninguna herramienta de copia externa. El último respaldo tiene restoreVerified en false y la única restauración fue manual, el 24-sep. Hoy hay 4 pacientes, pero pasa a ser requisito con la primera clínica.
- Sin verificar:
  - el contenedor de QA usa la base y el Auth de producción (media);
  - 2 tablas dan permisos completos a anon (media);
  - el aislamiento entre clientes depende solo del código (media);
  - hay datos internos mezclados con producción (baja);
  - 4 tablas backup_* guardan IPs de usuarios (baja);
  - 30 claves foráneas no tienen índice (baja);
  - un cron sigue respaldando la nube vieja (baja);
  - 6 políticas de onia_center están abiertas a cualquier usuario (baja).

**Arquitectura**
- **Los respaldos no salen del VPS y Chatwoot no tiene respaldo** · media (venía como alta) · Ningún script vuelca chatwoot-db. n8n sí tiene copia diaria, pero queda en el mismo VPS. Hoy no hay ningún WhatsApp de cliente conectado.
- **Deploy del bot trabado, y la plataforma ya publicó los botones del recordatorio sin el arreglo del lado del bot** · media (venía como alta) · 11 de 1.564 tests fallan por una línea del doc de pauta. Los commits `2f85bdd25` y `ffb65f75e` no están en main. El problema queda dormido mientras no haya un número de cliente conectado (hoy, 0).
- **La activación de pruebas por WhatsApp está trabada** · disputada: media / baja · No es el permiso del token, que ya está otorgado. Meta rechaza solo la plantilla de autenticación. El cron no está en el crontab y hay 0 verificaciones.
- Sin verificar:
  - el bot es un proceso suelto y el único punto de entrada de todo WhatsApp (media);
  - el bot apunta a Cal.com y a un servicio de voz que ya no existen (media);
  - precios y catálogo están duplicados entre el bot y la plataforma (media);
  - Easypanel y n8n están expuestos al público (media);
  - 2 workflows de n8n leen la base vieja (media);
  - todo el monitoreo vive en el mismo VPS (media);
  - el contenedor de QA corre un build viejo (baja);
  - hay nombres «staging» que no se pueden limpiar sin romper el login (baja).

**Dental**
- **El tratamiento a medias no se ve dentro de la prueba de 14 días** · disputada: alta / media (venía como crítica) · El agente pide 21 días desde la carga, y la fecha no se puede poner hacia atrás. La demo local sí lo muestra. La salida de hoy es alargar la prueba en /admin/plans.
- **No existe el presupuesto** · media (venía como alta) · El plan no tiene total, fases, descuento ni impresión. Lo tienen 2 o 3 de los 5 competidores.
- **El recordatorio sale solo por correo** · media (venía como alta) · El WhatsApp automático solo viene en Completo o con el add-on de Bs 390, y hay 0 números de clientes conectados. El catálogo ya no lo promete.
- Sin verificar:
  - SIAT apagado (media);
  - odontograma sin caras ni dientes de leche (media);
  - agenda sin vista por profesional (media);
  - sin cuotas, arqueo ni comisión (media);
  - el catálogo de tratamientos arranca vacío y faltan botones de Editar (baja).

**Estética**
- **No hay paquetes ni sesiones prepagadas** · media (venía como alta) · No existe ningún modelo ni tabla para eso. AgendaPro, Fresha, Booksy y Reservo lo tienen. La web ya no lo promete.
- **La web promete «con el control ya en la agenda»** · media (venía como alta) · Está publicado en /rubros y en la home. El agente solo propone un mensaje con link. El arreglo (`3cf50229f`) está en el PR #84, sin mergear.
- **El recordatorio sale solo por correo** · media (venía como alta) · Es el mismo hueco que en dental.
- **Clinica Leonardo lleva 40 días sin que la contacten** · media (venía como alta) · Es el único pedido de acceso de estética: no tiene cuenta ni conversación. El borrador ya está en `ONIA_LEADS_ESPERANDO.md` §3.2.
- Sin verificar:
  - no hay demo de estética (media);
  - las fotos de antes y después se suben como adjunto genérico (media);
  - el consentimiento es un escaneo o un nombre tipeado (media);
  - el umbral de 21 días es fijo (media);
  - la agenda no conoce cabinas (media);
  - no se pueden vender productos con stock (media);
  - no hay comisión por profesional (media);
  - SIAT apagado (media);
  - no hay arqueo de caja (baja).

**Comercio**
- **La factura SIAT no tiene camino desde la caja, ni siquiera en el código** · media (venía como crítica) · La emisión solo cuelga de la factura clínica, que exige paciente, y la caja no pide NIT. Afecta también a importadora.
- **La compra al proveedor no carga stock ni costo** · media (venía como alta) · Solo registra la deuda: reponer 40 ítems son 40 entradas a mano. Los proveedores sí existen, como ficha de deuda.
- Sin verificar:
  - no hay historial ni reportes de ventas (media);
  - el stock mínimo se carga producto por producto (media);
  - la caja no tiene descuento ni lector de código de barras (media);
  - el IVA «por fuera» de la Ley 1733 no está contemplado (media);
  - hay docs desactualizados sobre comercio (baja);
  - ningún agente vende en comercio (baja).

**Importadora**
- **No hay factura SIAT ni camino de factura desde la venta** · disputada: alta / media (venía como crítica) · /billing no está en su menú y la venta no tiene una entidad de factura.
- **El costeo no ingresa la mercadería ni la DUI** · media (venía como alta) · Solo guarda el costo en el producto. La función para la DUI existe, pero nadie la usa y trabaja en USD.
- Sin verificar:
  - los docs de venta dicen que la cotización no sale del sistema, y ya sale (media);
  - no hay precio por cliente ni venta en USD (media);
  - la alerta de reprecio no avisa sola (media);
  - el proveedor del exterior no tiene orden de compra ni anticipos (media);
  - el asistente contesta con datos del dental (baja);
  - la cuenta nueva nace vacía (baja).

**Servicios profesionales**
- **No hay factura SIAT, y encenderla no le llega a este rubro** · media (venía como alta) · Cobra por la caja de comercio y no tiene /billing.
- **Le habla al contador, pero lo construido le sirve al consultorio de citas** · baja (venía como alta) · El ejemplo del rubro es «Estudio Contable Rojas», cuando el análisis del 29-sep dice «no al contador». Servicios no está en el empuje actual.
- **No hay cobro mensual recurrente** · baja (venía como alta) · La recurrencia vive en /billing, que este rubro no tiene. La pantalla de planes ya no se la promete.
- Sin verificar:
  - el cliente no tiene NIT ni razón social (media);
  - el cobro al contado no queda en la ficha (media);
  - la demo nace vacía (media);
  - los documentos se piden de a uno, sin recordatorio (media);
  - no hay proyectos, horas ni propuestas de honorarios (media);
  - el recordatorio sale solo por correo (media);
  - la web dibuja un «Reporte del mes» que este rubro no tiene (baja);
  - dos cosas distintas se llaman «reuniones» (baja).

**No medido:**
- la velocidad desde Bolivia;
- las pantallas con sesión iniciada;
- un mensaje real de punta a punta (es tu prueba);
- los snapshots de Hostinger.

Todas las áreas tienen resultado.

**Pendiente de limpieza (para una sesión):**
- el worktree de 5 GB en `/tmp/claude-0/-home-user/71834d97-4307-5385-aed6-f723bb359f32/scratchpad/auditoria/hermes-main`, registrado en onia-hermes;
- la copia en `scratchpad/auditoria/sandbox`;
- el archivo `/tmp/.l` dentro del contenedor onia-platform, que se va con el próximo deploy.

---

## Crítica de completitud (qué quedó sin medir)

1. **La pregunta literal se reinterpretó y no se respondió.** Sergio Urcullo pidió "conectar mi número personal / abrime la ventana". El informe dice que no hay ventana que abrir, pero la plataforma sí la tiene: el Embedded Signup de Meta (`lib/chatbot/embedded-signup.ts`, `FB.login`).
   - **Por qué importa:** `paramsFbLogin` usa `featureType: ""`, o sea sin coexistencia con la app de WhatsApp. Leído en el código, no confirmado contra Meta: si conecta su número personal, tendría que sacarlo de la app de su teléfono y podría perder ese WhatsApp y su historial. Además ese flujo nunca se completó en producción (0 números de cliente).
   - **Cómo medirlo:**
     - Confirmar en la documentación de Meta qué exige registrar un número en Cloud API sin coexistencia.
     - SELECT en chatwoot-db de los `channel_whatsapp`, para ver si alguno nació por Embedded Signup.
     - Revisar el `config_id` en Meta Developer Tools (solo lectura).
     - Abrir la ventana renderizada hasta la primera pantalla de Meta, sin tocar "Continuar", y capturarla.

2. **"Responde en unos 3 s" no se midió hoy.** El último mensaje entrante es del 17-sep. La simulación corrió offline, sin la rama LLM ni lo que suma el panel. El presupuesto de la clave LiteLLM es desconocido (`/key/info` dio 404).
   - **Por qué importa:** si la clave se quedó sin saldo, el bot cae al guion o se calla justo durante la prueba de Sergio Urcullo.
   - **Cómo medirlo:**
     - SELECT en chatwoot-db (inbox 5) del tiempo entre cada mensaje entrante y la primera respuesta del bot: p50, p95 y cantidad de casos en septiembre.
     - Buscar en el log del bot de los últimos 14 días errores 429, budget o timeout.
     - Consultar el gasto de LiteLLM con el endpoint correcto de su versión, desde el VPS (lectura).
     - GET de `message_templates` para ver el estado de `appointment_reminder`, que la acción 9 da por usable.

3. **No se sabe si se pierden mensajes entrantes.** Que el bot es un proceso suelto lo vio un solo auditor. Que Chatwoot reintenta el webhook se copió de un script del 28-ago, sin repetirlo.
   - **Por qué importa:** el bot es la única entrada de todo WhatsApp, y la pérdida ya pasó: las conv 35 y 37 de agosto quedaron sin respuesta.
   - **Cómo medirlo:**
     - `ps -o pid,ppid,lstart`, systemctl, pm2 y `crontab @reboot`, para ver si el bot revive después de un reinicio.
     - Comparar la hora de arranque del proceso con `uptime`.
     - Leer en el contenedor de Chatwoot 4.12.1 el job de webhooks y su política de reintentos en Sidekiq.
     - SELECT de las conversaciones de los últimos 30 días con mensaje entrante y sin respuesta.

4. **No se midió la velocidad del panel con sesión, ni desde Bolivia, ni con volumen.** La nota de velocidad se apoya en la web pública y en los tiempos de Traefik. "Aguanta hasta 20 clientes" es una estimación hecha con 0 citas.
   - **Por qué importa:** el panel es lo que la clínica usa todo el día. La meta de LCP de 2,5 s nunca se midió ahí.
   - **Cómo medirlo:**
     - Web vitals de usuarios reales en Sentry, si tiene trazas.
     - La madre corre Lighthouse en la PC de Sergio Urcullo sobre /dashboard, /agenda y /pending, con su cuenta dental de prueba y solo navegando.
     - `curl -w` para el TTFB desde Bolivia.
     - Restaurar el dump en una base desechable fuera de producción, cargar volumen sintético (unos 3.000 pacientes y 20.000 citas) y correr EXPLAIN ANALYZE de esas pantallas, más k6 contra esa réplica. Esto cubre también las 30 claves foráneas sin índice.

5. **El respaldo no se restauró hoy.** `restoreVerified` está en false y la única prueba es manual, del 24-sep. El tar de Storage no se abrió y Chatwoot no tiene respaldo.
   - **Por qué importa:** un respaldo que no se restauró no está probado, y es requisito antes de la primera clínica real.
   - **Cómo medirlo:**
     - Copiar el último dump fuera del VPS (el script hace `pg_dump` de la base entera más `--globals-only`) y restaurarlo en un Postgres 15 desechable.
     - Comparar los conteos por tabla y de `auth.users` contra producción con SELECT count.
     - Correr `prisma migrate status` contra la copia y `tar -tzf` del respaldo de Storage.
     - Listar qué volúmenes no cubre ningún script.

6. **El aislamiento entre clientes está calificado como "ordenado" con 15 de 167 rutas revisadas.** Además, RLS 86/86 no protege si Prisma entra con un rol que se salta RLS.
   - **Por qué importa:** que una clínica vea datos de otra es el peor fallo posible con datos clínicos.
   - **Cómo medirlo:**
     - `SELECT rolname, rolbypassrls FROM pg_roles` para el usuario del `DATABASE_URL`, sin imprimir el secreto.
     - Análisis estático con ts-morph sobre las 167 `route.ts` y las server actions, resolviendo los where armados en variables.
     - Prueba entre dos organizaciones en local: misma imagen release-8f07e537 y dos orgs sembradas, pidiendo cada ruta con la sesión de A y los ids de B.

7. **La acción 8 pide el OK de Sergio Urcullo sobre afirmaciones que vio un solo auditor:** anon con permisos en 2 tablas, el contenedor de QA sobre la base de producción, Easypanel y n8n expuestos, y 2 workflows sobre la base vieja.
   - **Por qué importa:** se le pide decidir sobre infraestructura con datos que nadie verificó por segunda vez.
   - **Cómo medirlo (minutos, todo lectura):**
     - SELECT en `information_schema.role_table_grants` con `grantee='anon'`.
     - GET con la clave anon a `/rest/v1/<tabla>?limit=1`, para ver si devuelve filas.
     - `docker inspect` del contenedor de QA, mostrando solo los hosts.
     - `curl -I` desde afuera a Easypanel y n8n.
     - GET de los workflows por la API de n8n.

8. **Ninguna pantalla de ningún rubro se miró renderizada con sesión en producción.** La regla dice que verificar es mirar. Las "necesidades" salen de documentos y de la competencia, no de clientes. Además, el veredicto "sin factura" para comercio, importadora y servicios depende de la modalidad de la solicitud SIAT 9473, que nadie confirmó.
   - **Por qué importa:** "todos los rubros cubiertos" es la última pregunta de Sergio Urcullo, y hoy se contesta solo desde el código.
   - **Cómo medirlo:**
     - Imagen release-8f07e537 en local, con el sembrador de los 5 rubros, y capturas de Playwright a 390 px de las pantallas clave de cada rubro.
     - SELECT del texto de lo que pidieron los leads reales (conv 35, 37, 58 y Clinica Leonardo).
     - Captura del portal SIAT de la modalidad (sistema propio o proveedor), que saca Sergio Urcullo, o la RND pública del SIN.

Archivos que respaldan el punto 1: `/home/user/onia-platform/lib/chatbot/embedded-signup.ts` y `/home/user/onia-platform/lib/chatwoot.ts`.