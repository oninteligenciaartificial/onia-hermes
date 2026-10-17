# Cola de la jefa Hermes (proyecto «ONIA · Hermes» en claude.ai/code)

> La lee la jefa en cada vuelta. La escribe la sesión de control (madre local en la PC) cuando
> Sergio Urcullo da una orden nueva. Lo de arriba manda sobre lo de abajo.

## ORDEN VIGENTE — 16-oct-2026, 17:00 La Paz (Sergio Urcullo, textual resumido)

«Ahora el objetivo es empezar a construir toda la ONIA Platform… dejar operativa ya una versión 1.0
para presentar al banco… fijarnos que todos los perfiles de los rubros estén funcionando… crear los
workshops para las auditorías y consultorías para llegar a los 3.000 hasta fin de mes… levantar la
comunidad de WhatsApp y la marca personal de Sergio, practicar Meta Ads y Higgsfield para Lucía… que
todo funcione como una empresa real… mirar a todos los competidores de Onia Platform y agarrar
funciones que nos sirvan… investigar webinars, cómo funciona Iman Gadzhi y sus consultorías, y a los
mejores, para replicarlo y vender yo mismo mediante funnels por Instagram… auditar cada sesión y la
de ventas, la Biblioteca de anuncios, aprender a editar carruseles que venden».

Decisión de Sergio Urcullo del 16-oct: **sí a workshops y consultorías pagas para la caja de octubre**
(cambia la regla «Onia vende software, nunca horas» solo para esto; el producto sigue siendo Onia Platform).

### Ya hecho por la sesión de control (no repetir)
- Correo al BCP enviado el 16-oct con los 8 datos y los documentos (SEPREC, NIT, CI de la titular).
- Codex configurado como revisor de cada cambio (latidos de QA y Plataforma).
- Latido de Plataforma apuntado a cobrar; QA publica el cerebro cada hora con revisión de Codex.

### Repartí así (un hilo por carril, Sonnet; Opus solo decide)
1. **Plataforma — 1.0 para presentar al banco (prioridad 1).**
   - Checklist de la 1.0: `docs/ONIA_1.0_CORTE.md` en la rama `claude/optimistic-ride-1sp5fe` y el
     handoff `hermes-content/docs/handoff/onia-1.0-nube.md` de esa rama. Cerrar lo que falte, publicado
     y MIRADO en producción.
   - Probar los perfiles de los 5 rubros (dental, estética, servicios profesionales, comercio,
     importadora) con cuentas ZZ QA: alta, panel, agenda/ventas según rubro, checkout. Captura por
     rubro; arreglar lo roto.
   - Demo dental lista para mostrar.
   - Plataforma ya tiene su latido propio (:17): coordiná con su cola (`plataforma.md`) y no
     pongas un segundo escritor sobre los mismos archivos.
2. **Competencia → funciones para la 1.0.** Leer `hermes-content/research/competencia/`
   (`PRODUCTO_COMPETENCIA_RESUMEN.md`, `BACKLOG_DE_PRODUCTO.md` y los teardown). Lista corta de
   funciones que suben la venta y entran en la 1.0; lo demás queda para después.
3. **Ventas y pauta (ya hay hilo).** Funnel por Instagram; Biblioteca de anuncios de Meta de los
   competidores; mensajes listos para que Sergio Urcullo los mande él. Nada se envía ni se gasta sin su OK.
4. **Marca personal + comunidad + workshops.**
   - Investigar a Iman Gadzhi (webinars, consultorías, funnels, precios, guiones) y a los mejores del
     rubro, con fuentes; qué se replica para Sergio Urcullo como experto en IA en Bolivia.
   - Armar la oferta de workshops de auditoría/consultoría de IA para negocios: precio, duración,
     guion, página o formulario, y el camino desde Instagram hasta el pago (QR BCP).
   - Levantar la comunidad de WhatsApp (estructura, reglas, contenido de bienvenida).
   - Carruseles que venden: aplicar `diseno-contenido-onia` y lo medido en la Biblioteca de anuncios.
5. **Lucía / Higgsfield.** Practicar Higgsfield con lotes chicos según la regla de gasto vigente;
   nada con cara/voz ni lotes grandes sin el sí de Sergio Urcullo.
6. **Auditoría de carriles.** Cada vuelta, una línea por carril: qué hizo, si sirve a la meta, qué
   cortar. A Sergio Urcullo solo lo que cambia una decisión.

### Relevos y orquestación (orden de Sergio Urcullo: «eso lo hace la madre»)
- Vos creás y cerrás los hilos. Cuando un hilo se llena de contexto, escribí su handoff en
  `hermes-content/docs/handoff/<carril>.md` y abrí uno nuevo que lo retome.
- Subagentes dentro de cada hilo con modelo explícito (Haiku lee, Sonnet construye, otro revisa).
- Esta noche Sergio Urcullo apaga la PC para probar: todo tiene que seguir solo.

### Lo que necesita a Sergio Urcullo (juntalo en UNA lista diaria)
- Aprobar el pago de prueba en `/admin/payments` (1 minuto) y confirmar la factura con Leslie.
- Aprobar y mandar los mensajes de venta; dar demos y asesorías.
- Cualquier gasto, texto legal, diseño nuevo o contacto con terceros.

---

## COLA DE LA JEFA — noche del 16-oct (la escribe la jefa)

Reglas de comunicación (Sergio Urcullo, 16-oct; orden de control del 17-oct): solo la jefa le habla a Sergio Urcullo, máximo 3 líneas, y solo como «PUBLICADO: qué — link» o UNA decisión por tarjeta (sí/no). Los hilos responden en su hilo en 1 a 3 líneas, con el detalle en archivo adjunto, y sus preguntas van a la jefa, no a él. Una lista diaria a las 18:00 La Paz. Las preguntas pendientes se juntan en UNA sola.

Reglas de trabajo (orden de control del 17-oct): subagentes en toda tarea con `model` explícito (haiku lee/cuenta/verifica, sonnet escribe, opus decide lo riesgoso) y cierre «Subagentes: N (modelo, tarea)». Los pedidos a la PC van en una línea que empiece con «PC:». El tooling de video y aprendizaje está congelado y unificado en #223; #211 se cerró por duplicar #217.

Regla de PRs: borrador mientras el hilo trabaja; `gh pr ready` cuando termina; Codex revisa y QA (:57) publica.

Hilos y su entrega (16-oct):
- Ventas y pauta: prepago anual, 7 leads con mensaje de usted, guion de webinar, funnel de Instagram a pago por QR, repaso de la Biblioteca. Espera el sí de Sergio Urcullo para que él envíe los mensajes.
- Competencia: 7 funciones para la 1.0 (docs/competencia). Entregado.
- Auditoría de carriles: tabla del 16-oct y práctica de Higgsfield (≤12 créditos, sin cara/voz/video) en lucia.md. Entregado.
- Marca, comunidad y workshops: oferta «Auditá tu negocio con IA», comunidad de WhatsApp, 2 carruseles. Espera el sí al precio y la fecha.
- Plataforma 1.0 banco (hilo nuevo con acceso): 5 rubros y demo dental. Espera el sí a crear 5 cuentas ZZ QA en producción.
- Reels y navegador: ver posts de Instagram desde la nube funciona en el entorno «Onia»; transcripción de audio sigue por la PC. Entregado.

Pendiente de UNA sola pregunta a Sergio Urcullo (la jefa la plantea una vez): (1) workshop: Bs 150 precio fundador hasta el mié 21, luego Bs 200, cupo 12, sáb 24-oct 10:00, auditoría 1 a 1 Bs 350; (2) enviar los mensajes de venta que él manda; (3) devolver el prepago a 14 días; (4) crear 5 cuentas ZZ QA en producción. Acción de seguridad pendiente (no es pregunta, la hace Sergio Urcullo o la madre, nunca la jefa): rotar el token de n8n de `~/.codex/config.toml`, expuesto en un registro local (handoff/madre-control.md §6.6); no se escribe su valor en ningún lado. HECHO, ya no se pregunta: rutinas de Plataforma (:17) y QA (:57) reencendidas a las 22:16 UTC del 16-oct (Sergio Urcullo confirmó que no las apagó; ver handoff/madre-control.md).

Cada vuelta de la jefa (:07): leer esta cola y la orden vigente, ejecutar lo que no espera a Sergio Urcullo, destrabar carriles con más de 3 h sin avanzar y no preguntar de nuevo lo ya preguntado.

PC: agregar onia.com.bo y app.onia.com.bo al acceso de red del entorno «Onia» (claude.ai/code → entornos → Onia → acceso de red; Sergio Urcullo ya dijo SÍ pero madre-control.md §3 y §6.2 aún lo registran como pendiente, devuelven 403) y dejar el resultado en handoff/madre-control.md. El recorrido público de la 1.0 depende de esto.

Ejecutable sin esperar (salvo el recorrido de la 1.0, que depende de la línea «PC:»): mover los PR entregados a listo; pasar la lista de competencia al hilo de la 1.0; completar ⟦ENLACE-WORKSHOP⟧ del funnel con la oferta (marcada propuesta); dejar a Lucía su tarea de práctica; seguir recorridos públicos de la 1.0 sin crear datos.

Candidatos que NO se instalan sin OK de Sergio Urcullo: Ponytail, Diagram Design, Scrapling. yt-dlp ya está instalado en el VPS (/usr/local/bin, ver handoff/madre-control.md): solo falta probarlo con reels.
