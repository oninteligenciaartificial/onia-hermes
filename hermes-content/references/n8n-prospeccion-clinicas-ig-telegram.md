# n8n Workflow: ONIA - Prospeccion clinicas IG + LinkedIn + Telegram

## Objetivo
Usar Instagram y LinkedIn como canales de contacto inicial cuando exista perfil publico, y Telegram como canal interno de aprobacion y seguimiento. WhatsApp queda fuera hasta que ONIA tenga verificacion de negocio en Meta.

## Entrada
- CSV: `hermes-content/references/prospectos-clinicas-bolivia-2026.csv`
- Oferta: DentalGest / sistema anti-leads perdidos para clinicas dentales.
- Responsable: Sergio / ONIA.

## Workflow recomendado
1. Manual Trigger o Schedule Trigger semanal.
2. Read Binary File: cargar CSV de prospectos.
3. Spreadsheet File: convertir CSV a items.
4. Filter: `estado_pipeline = Nuevo` y `prioridad in Alta, Media`.
5. Function: preparar mensaje personalizado corto segun canal sugerido.
6. Telegram Send Message: enviar top 5 prospectos con fuente, dolor probable, canal sugerido y mensaje.
7. Telegram Wait/approval: aceptar solo aprobaciones del tipo `Apruebo contactar: <empresa>`.
8. IF aprobado:
   - Si hay perfil Instagram publico confirmado, crear tarea de contacto IG manual.
   - Si hay pagina de empresa o responsable publico en LinkedIn, crear tarea de contacto LinkedIn manual.
   - Si no hay Instagram ni LinkedIn, crear tarea alternativa por email/Facebook/web.
9. Notion o archivo CRM: registrar estado `Contactar` o `Contactado` segun accion humana.
10. Telegram Send Message: resumen de acciones pendientes.

## Mensaje base IG
Hola, soy Sergio de ONIA. Vi que tienen una clinica dental activa en Bolivia y queria proponerles algo concreto: un sistema para no perder consultas de Instagram/web, ordenar interesados y hacer seguimiento de citas desde un panel simple.

No es un chatbot generico. Es un flujo pensado para clinicas: interesados, tratamientos, agenda, seguimiento y alertas internas.

Si les sirve, les puedo mostrar una demo corta de DentalGest esta semana.

## Mensaje base LinkedIn
Hola, vi el perfil de {{empresa}} y queria conectar. Soy Sergio de ONIA, trabajamos con web, IA y automatizacion para negocios en Bolivia.

Estamos preparando DentalGest, un sistema para clinicas dentales que ayuda a ordenar consultas, seguimiento de pacientes potenciales y oportunidades que llegan desde redes o la web.

Si tiene sentido para ustedes, puedo compartir una demo corta enfocada en clinicas.

## Mensaje base email/Facebook
Hola, equipo de {{empresa}}. Soy Sergio de ONIA, agencia boliviana de web e IA.

Estamos preparando DentalGest, un sistema para clinicas dentales que ayuda a registrar consultas, dar seguimiento a pacientes potenciales y evitar que los mensajes de redes o web queden sin respuesta.

Vi que {{senal_oportunidad}}. Creo que podria servirles una demo corta, sin compromiso, enfocada en como ordenar sus consultas y citas.

Quedo atento si quieren que les envie la demo.

## Reglas
- No hacer envio masivo automatico.
- No contactar sin aprobacion explicita por Telegram.
- Usar solo informacion publica.
- En LinkedIn, conectar o escribir solo a perfiles/paginas publicas relacionadas con la clinica.
- No scrapear perfiles personales ni usar datos privados.
- No usar WhatsApp todavia.
- No prometer resultados garantizados.
- Registrar fecha, canal y respuesta.

## Prueba manual
1. Elegir 5 prospectos alta prioridad del CSV.
2. Enviar resumen por Telegram.
3. Aprobar uno con `Apruebo contactar: <empresa>`.
4. Crear tarea de contacto manual por IG/LinkedIn/Facebook/email.
5. Registrar resultado en CRM.
