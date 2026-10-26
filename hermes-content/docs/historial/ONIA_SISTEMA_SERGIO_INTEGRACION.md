# Sistema Sergio × la máquina Onia — qué automatizamos nosotros

> El plan de Samuel Aguilera (mes 1 de la marca personal de Sergio) vive tal cual en
> `hermes-content/references/marca-personal/sistema-sergio-samuel-20260819.html` — es SU
> documento y no se reescribe. Este doc es la otra mitad: **qué partes de ese sistema ya
> las tiene construidas nuestra máquina y qué cableamos**. La estrategia de capas de marca
> (Onia / Lucía / Sergio) manda en `ONIA_ESTRUCTURA_TRES_CAPAS_20260820.md`.

## Lo que el plan necesita y YA existe en producción

| Pieza del plan de Samuel | Lo nuestro, vivo hoy |
|---|---|
| Paso 2-3 del embudo: comenta la palabra → DM automático (IG/FB) | ⚠️ **Corregido 2026-08-29: NO está probado.** El recuento en vivo del 27-ago (105 ejecuciones) encontró el workflow "probado" APAGADO, 5 de 6 envíos rechazados por Meta y **cero DMs a un lead real** — `neverError` disfrazaba los rechazos de éxito. Detalle: `ONIA_CIRCUITO_COMENTARIO_DM.md`. Antes decía "EN PRODUCCIÓN desde el 18-ago, probado con cuenta real" y esa línea sostuvo la planificación de la Etapa 2 (ver `ONIA_MARCA_PERSONAL_ETAPA2_EVALUACION.md`) |
| Métrica 3: qué video/red trajo cada miembro (UTM) | **El circuito `?src=` → pipeline de leads está vivo** — se reusa con `src=v1-edicion`, `src=v3-reto`, etc. Cero sistemas nuevos |
| Métrica 2: comentarios por palabra clave | El radar de ganchos (decisión K1: herramienta interna, archivo en el repo) es el lugar donde se registra qué palabra convirtió |
| Producción de los 8 videos | El pipeline **sin editores humanos** (editor-videos + HyperFrames): cortes, subtítulos karaoke palabra por palabra (Inter, como pide la identidad), slates. El video 8 (montaje sin voz) es costo CERO. Y el video 1 literalmente **vende nuestro método** — el ejemplo del "video hecho 100% con IA" lo producimos nosotros |
| Identidad visual propia | La paleta del doc es familia del verde Onia pero distinta a propósito — coincide con la estrategia de tres capas ya decidida. Los subtítulos y slates salen de nuestras plantillas con esos hex |
| Cadencia de comunidad (5 piezas/semana) | El carril de contenido ya produce recursos (plantillas, checklists, prompts) — la "profundización semanal" y el "descargable" salen de lo que ya escribimos, reempaquetado |

## Lo que hay que CONSTRUIR (chico, y en este orden)

1. **Palabras clave en el workflow comentario→DM** — una tabla palabra→respuesta→link con
   `?src=` por video. Es configuración sobre lo vivo, no código nuevo.
2. **El tracker público del reto $5.000** — página simple que muestra el número REAL.
   Regla dura: arranca en $0 y eso ES el contenido (documentar el proceso es la promesa
   del video 3). Nada de números fabricados, nunca.
3. **Registro de métricas semanales** — las 6 métricas del módulo 8 caen en el radar
   interno (archivo, no panel, como ya se decidió).

## Flags antes de grabar (verificación, no objeción)

- **Cifras de los guiones**: el video 1 afirma "64 mil millones" y "23 mil millones" y el
  video 5 "200.000 estrellas". Regla de la casa: cifra ajena se verifica con fuente antes
  de publicarse o no se dice. Verificarlas cuesta 10 minutos; quemarlas mal, la
  credibilidad del canal.
- **El "RI hasta 5.000%"** del audit es referencia de Samuel — no lo repetimos como dato
  propio en ningún material nuestro.
- **Sergio es menor y el plan lo hace público a propósito** ("tengo 16 años" es el gancho
  fundacional — decisión ya tomada, no se reabre). Lo que SÍ es regla nuestra: todo cobro
  que salga de esto (el curso del mes 2, la comunidad si algún día se cobra) entra por
  **OniaAgency/Leslie**, jamás a nombre de Sergio. Mismo marco que todo lo demás.
- **El curso del mes 2 todavía no existe**: cuando toque, aplica la regla de venta — no se
  anuncia hasta que esté; la comunidad del mes 1 no promete fechas.

## Qué NO hacemos

- No opinamos del acuerdo comercial con Samuel (eso ya se revisó aparte y es decisión de
  Sergio).
- No mezclamos las cuentas: la marca personal es de Sergio con la identidad del doc; Onia
  es "el vehículo detrás", como el propio plan lo define. Lucía sigue en su carril.
- No automatizamos publicación en TikTok/Shorts (sin API de comentario→DM): link in bio,
  como el plan ya prevé.
