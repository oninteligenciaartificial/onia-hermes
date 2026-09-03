Onia vende UN solo producto: Onia Platform, una plataforma por módulos que se vende con packs por rubro. DentalGest, GestiOS, Ganadero OS y ProveeGest NO son productos ni marcas: son nombres viejos de packs. Al cliente se le nombra el rubro ("módulo dental"). No se le vende sólo a clínicas: son 7 rubros.
§
Onia tiene CERO clientes pagando. Está prohibido inventar testimonios, logos, casos de éxito o cifras de clientes. Si un texto necesita una prueba social que no existe, se escribe sin ella.
§
En toda superficie que ve un cliente está PROHIBIDO comunicar estado de obra: "muy pronto", "en construcción", "beta", "próximamente", listas de lo que falta. Lo que no está listo no se nombra. Los docs internos sí son honestos sobre los límites; la venta no exhibe obra. Regla de Sergio, 2026-08-20, después de encontrar cinco "muy pronto" en la pantalla de venta.
§
TOPOLOGÍA REAL, y equivocarse acá ya costó diagnósticos enteros: onia.com.bo lo sirve el contenedor onia-landing DEL VPS (187.77.16.63), NO Vercel. app.onia.com.bo lo sirve el contenedor onia-platform. La base de producción es el contenedor supabase-db self-hosted, NO la nube de Supabase. Pushear a main NO publica nada: hay que desplegar. Los proyectos de Vercel que existen (nuvia-store, onia-center) están enganchados al repo y sólo generan ruido.
§
PRECIOS: mandan DOS archivos y cada uno sobre lo suyo. Planes de suscripción → onia-platform/lib/subscription-plans.ts (DEFAULT_PLAN_AMOUNTS). Add-ons, empezando por el chatbot → onia-platform/lib/pricing.ts. Ningún doc, propuesta, cotizador ni one-pager define precio: lo LEEN de ahí. Si un material dice otro número, está roto.
§
NO hay equipo de ventas. El que vende es Sergio. No hay vendedora ni colaboradores comerciales. Está PROHIBIDO escribir material dirigido a un vendedor (onboarding, tablas de comisión, decks de reclutamiento, CRM de fuerza de ventas). Material sobre CÓMO vender sí sirve: lo usa Sergio.
§
HIGGSFIELD SE USA POR CLI, no por navegador y nunca por MCP. El CLI oficial está en /usr/bin/higgsfield del VPS, autenticado con la cuenta de Sergio (plan ultra). Verificado 2026-09-02: `higgsfield account status` devuelve el saldo real. Los comandos son: account status (saldo, gratis), model list --image (los job_type reales), generate cost <job_type> (cotiza antes, gratis, coincide exacto con el cobro), generate image. El MCP está prohibido porque NO cotiza antes.
§
Los nombres de modelo de Higgsfield COLISIONAN entre sí: el job_type nano_banana_flash se llama, en su propia tabla, "Nano Banana 2". Por eso se paga un modelo y llega otro. El job_type se saca SIEMPRE de `model list`, nunca de memoria ni de un doc. El barato de imagen es text2image_soul_v2 (0,12 créditos). "soul_2" NO EXISTE: el CLI lo rechaza. El video es lo caro: un clip de seedance (4,8 cr) cuesta lo mismo que 40 imágenes.
§
VERIFICAR ES MIRAR, NO SUPONER. Un HTTP 200 y un grep NO son verificación: el login de producción mostró los NOMBRES de los iconos como texto durante días, "verificado" con 200 y grep. Toda pantalla que ve un cliente se abre y se MIRA renderizada. Un grep sirve para descartar, nunca para confirmar. Y se mide con el instrumento correcto: un log vacío no prueba que un cron corrió; un proceso vivo no prueba un servicio sano.
§
CONSTRUIDO NO ES TERMINADO. Algo está hecho cuando está encendido en producción y verificado ahí. Un flag apagado, una migración sin aplicar o un módulo que nadie llama valen cero. Está prohibido reportar como hecho lo que está detrás de un flag apagado.
§
UN TEST QUE MIRA EL PRIMER PASO NO VE UN SISTEMA QUE MUERE EN EL SEGUNDO. El bot de Onia murió dos veces exactamente ahí: contestaba el saludo y se callaba en el mensaje 2, con su test en verde. El dinero se pierde en el segundo turno.
§
Las horas se dicen SIEMPRE en hora de La Paz (UTC-4). El VPS y los logs reportan UTC: hay que restar 4 antes de decirle una hora a Sergio, y ojo que puede cambiar el día. En los crons NO se resta.
§
El chatbot de Onia ofrece demos en estas ventanas (Sergio, 2026-09-02): lunes a viernes 14:00-17:00 y 20:00-22:00, sábado 09:00-15:00, siempre con al menos un día de anticipación para tener tiempo de cancelar. Los dos horarios concretos los calcula /root/bin/onia-renovar-slots.py todos los días; no se escriben a mano porque se vencen.
§
El sistema de trabajo son 15 loops que corren por cron EN EL VPS (no en la laptop de Sergio): /root/bin/onia-loop.sh <id>, prompts en /root/bin/loops/<id>.md, logs en /var/log/onia-loop-<id>.log. Se despliegan solos desde main con /root/bin/onia-loops-sync.sh. Sergio puede apagar su PC y siguen trabajando.
§
Cuando un loop necesita una decisión de Sergio, NO se queda esperando: crea una tarea en el tablero y la bloquea con `block <id> "<motivo>" --kind needs_input` (medido el 2026-09-03: andan DOS órdenes — `block <id> "<motivo>" --kind needs_input` y `block --kind needs_input <id> "<motivo>"` — y falla UNO: `block <id> --kind needs_input "<motivo>"`, porque la opción en el MEDIO parte los posicionales y da `unrecognized arguments`, la tarea queda ready). A Sergio le llega por Telegram y contesta "ok <id>" desde el teléfono. Una pregunta = una decisión concreta, con las opciones ya cotizadas: él audita, no investiga.
§
DIAGNÓSTICO 2026-09-02, y explica por qué el sistema parecía no avanzar: de 143 commits en 24 h, sólo 20 (14%) tocaron producto y 88 (62%) fueron el sistema arreglándose a sí mismo. La causa NO era falta de tiempo (la vuelta más larga usó el 38% de su tope, cero timeouts): era que las colas estaban vacías, que 14 de 15 loops no sabían pedirle una decisión a Sergio, y que 13 de 15 no tenían contra qué verificar si algo estaba hecho.
§
UN VIGÍA QUE GRITA MAL NO MOLESTA: INUTILIZA. El vigía de Hermes reportaba como incidentes activos errores de hasta 6 días antes, y como la firma del incidente era el CONJUNTO de trabajos rotos, cada vez que uno se recuperaba disparaba una alarma NUEVA con los que quedaban: el sistema curándose sonaba igual que el sistema rompiéndose. Sergio dejó de creerle a los avisos, con razón. Cualquier alerta debe mirar la FECHA del fallo, no sólo su existencia.
§
UN RESPALDO MUERTO ES PEOR QUE NO TENER RESPALDO. El fallback_model de Hermes apuntaba a un Ollama en localhost:11434 que no existe. Cada vez que el modelo principal fallaba, el fallback también fallaba, y el error que quedaba registrado era el del FALLBACK ("RuntimeError: Connection error"), que disfrazaba la causa real durante días. Se quitó el 2026-09-02. Para reactivarlo hace falta un modelo verificado con curl ANTES de escribirlo en la config.
§
UNA FUENTE DE VERDAD POR TEMA. Un tema = un archivo sin fecha; si cambia, se EDITA ese archivo, no se crea uno nuevo al lado. Los archivos con fecha en el nombre (hermes-content/docs/historial/) son fotos de un día y NO son fuente de verdad: si contradicen a uno sin fecha, gana el que no tiene fecha. Llegó a haber cuatro precios vivos del mismo chatbot al mismo tiempo.
§
Una promesa que cambia se barre en TODA la superficie, no sólo donde se la estaba tocando. Cuando cambia lo que el producto entrega, hay que buscar la promesa vieja en todo el material de cliente ANTES de dar el cambio por hecho. Ya pasó: /register dejó de crear cuentas, se arregló en /empezar, y la home quedó con cuatro botones prometiendo lo que ya no existía.
§
Sergio es menor de edad. Todo acto legal lo firma Leslie Mercado, su madre, titular en SEPREC de la unipersonal "OniaAgency" (matrícula 5371375010). Esto importa antes de cualquier contrato, alta fiscal o trámite.
§
Sergio pide informes CORTOS. Textual, 2026-09-02: "intenta mandar la info mas ordenada y que se entienda mejor, me pierdo entre tanto texto". Cada vuelta de un loop empieza con UNA línea en castellano llano que diga qué se hizo y por qué le importa a él: sin siglas, sin nombres de archivo, sin códigos internos. Si el que paga no entiende qué hiciste, no lo hiciste para nadie.
