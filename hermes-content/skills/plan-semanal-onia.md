# Skill: plan-semanal-onia

## Cuando usar
Cuando Sergio pida el plan semanal de contenido de ONIA, general o enfocado en
un tema/industria. Combina investigacion fiable de tendencias con las
prioridades comerciales de la semana.

## Comandos

### Plan semanal ONIA
Plan semanal general.

### Plan semanal ONIA: <tema o industria>
Plan enfocado. Ejemplos:
- `Plan semanal ONIA: clinicas dentales Bolivia`
- `Plan semanal ONIA: automatizacion para pymes`
- `Plan semanal ONIA: agentes IA para ventas`

## Flujo premium
1. **Retro rapida**: revisar que se publico la semana pasada y que funciono
   (si hay datos de rendimiento, usarlos; si no, decirlo y seguir).
2. **Investigar** tendencias actuales con la skill `tendencias-ia-redes`.
3. **Filtrar**: solo hallazgos con fuentes fiables; descartar rumores.
4. **Alinear con negocio**: cruzar con prioridades comerciales de la semana
   (prospeccion activa, propuestas abiertas, el sistema por rubro: dental primero, importadora despues).
   El contenido debe empujar lo que ONIA esta vendiendo esa semana.
5. **Convertir** hallazgos en ideas originales para ONIA (nunca copiar).
6. **Calendario**: proponer 5 piezas distribuidas en la semana.
7. **Priorizar** una pieza para producir primero y desarrollarla completa.
8. **Aprobar**: pedir aprobacion antes de producir en serie o publicar.

## Mix de formatos recomendado (5 piezas)
- 1-2 carruseles (skill `carruseles-onia`, el pack lo fija esa skill; `dark-product` no es default).
- 1-2 Reels/videos (skills `videos-virales-higgsfield` / `video-lab-higgsfield`).
- 1 historia o pieza ligera (skill `historias-onia`).
- Variar el objetivo: no hacer 5 piezas de venta dura; mezclar autoridad,
  educacion y captacion.

## Uso de n8n
n8n orquesta el ciclo recurrente:
- Disparador semanal -> solicitud a Hermes de investigacion.
- Generacion del plan -> resumen por Telegram a Sergio Urcullo.
- Espera de aprobacion manual -> publicacion solo si se confirma.

## Reglas de aprobacion (no negociables)
- No publicar automaticamente. No llamar `ig-publish` sin aprobacion literal.
- Aprobacion valida: `Apruebo publicar <pieza>`. `ok`/`dale` no publican.
- Publicar SOLO la pieza exacta aprobada.
- Duda sobre imagen, caption, fecha u objetivo -> confirmar antes de publicar.

## Formato de respuesta

### Resumen semanal
- Objetivo de la semana (ligado a una meta comercial concreta).
- Audiencia principal.
- Tema central.
- Oportunidad detectada.

### Retro (si hay historial)
- Que se publico, que funciono, que se ajusta esta semana.

### Hallazgos usados
Por cada uno: hallazgo, fuente, nivel de confianza, por que importa para ONIA.

### Calendario de contenido (5 piezas)
Por pieza: dia sugerido, plataforma, formato (Reel, carrusel, post LinkedIn,
Short, historia o pin), hook, idea central, CTA y skill que la produce.

### Pieza prioritaria
- Titulo y objetivo.
- Guion por slides o estructura del video.
- Caption y hashtags.
- Prompt visual original.
- Siguiente accion recomendada con comando exacto
  (ej. `Genera carrusel ONIA: <tema> | <objetivo> | <audiencia>`).

### Aprobacion
Cerrar siempre con:
`Para publicar, responde: Apruebo publicar <pieza>.`

## Criterios de calidad
- Ejecutable en 7 dias reales con la capacidad actual (Higgsfield en modo
  manual y creditos limitados: no planear 5 videos pesados).
- Cada tendencia factual con fuente; sin claims absolutos ni promesas.
- Ideas utiles para empresas bolivianas, no genericas de LinkedIn global.
- Priorizar: ventas, leads, automatizacion, atencion al cliente, reportes,
  desarrollo web e IA aplicada.
- No copiar contenido de terceros.
