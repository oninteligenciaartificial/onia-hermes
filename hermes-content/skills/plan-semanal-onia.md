# Skill: plan-semanal-onia

## Objetivo
Crear un plan semanal de contenido para ONIA usando investigacion fiable de tendencias IA, tendencias de redes sociales y prioridades comerciales de ONIA.

## Comandos

### Plan semanal ONIA
Generar un plan semanal general para ONIA.

### Plan semanal ONIA: <tema o industria>
Generar un plan semanal enfocado en el tema indicado.
Ejemplos:
- `Plan semanal ONIA: clinicas dentales Bolivia`
- `Plan semanal ONIA: automatizacion para pymes`
- `Plan semanal ONIA: agentes IA para ventas`

## Flujo recomendado
1. Investigar tendencias actuales con la skill `tendencias-ia-redes`.
2. Filtrar solo hallazgos con fuentes fiables.
3. Convertir los hallazgos en ideas originales para ONIA.
4. Proponer calendario semanal.
5. Recomendar una pieza prioritaria para producir primero.
6. Pedir aprobacion antes de publicar o ejecutar `ig-publish`.

## Uso de n8n
n8n debe ser el orquestador para flujos recurrentes:
- Disparador semanal.
- Solicitud a Hermes para investigar tendencias.
- Generacion del plan semanal.
- Envio del resumen por Telegram.
- Espera de aprobacion manual.
- Publicacion solo si el usuario confirma.

## Reglas de aprobacion
- No publicar automaticamente.
- No llamar `ig-publish` sin aprobacion explicita del usuario.
- Si el usuario aprueba, publicar solo la pieza exacta aprobada.
- Si hay dudas sobre imagen, caption, fecha u objetivo, pedir confirmacion antes de publicar.

## Formato de respuesta

Responder siempre con:

### Resumen semanal
- Objetivo de la semana.
- Audiencia principal.
- Tema central.
- Oportunidad detectada.

### Hallazgos usados
Lista breve de tendencias o actualizaciones usadas:
- Hallazgo.
- Fuente.
- Nivel de confianza.
- Por que importa para ONIA.

### Calendario de contenido
Proponer 5 piezas:
- Dia sugerido.
- Plataforma principal.
- Formato: Reel, carrusel, post LinkedIn, Short, historia o pin.
- Hook.
- Idea central.
- CTA.

### Pieza prioritaria
Elegir una pieza para producir primero:
- Titulo.
- Objetivo.
- Guion por slides o estructura del video.
- Caption.
- Hashtags.
- Prompt visual original.
- Siguiente accion recomendada.

### Aprobacion
Cerrar con:
`Para publicar, responde: Apruebo publicar <pieza>.`

## Criterios de calidad
- El plan debe ser concreto y ejecutable en 7 dias.
- Cada tendencia factual debe tener fuente.
- Las ideas deben sonar utiles para empresas bolivianas, no genericas.
- Priorizar ventas, leads, automatizacion, atencion al cliente, reportes, desarrollo web e IA aplicada.
- No copiar contenido de terceros.
- Evitar promesas absolutas o claims sin evidencia.
