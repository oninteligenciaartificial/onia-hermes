# Plantillas A y B para los leads de agosto: BORRADOR, no enviado a Meta

Estado (8-oct): **no existen en Meta.** El número de Onia (+591 75414930, WABA `4429061034078857`) tiene 7 plantillas
aprobadas, sincronizadas en Chatwoot el 8-oct a las 18:40: `confirmacion_cita`, `onia_bienvenida_agenda`,
`onia_bienvenida_panel`, `onia_primera_cita` (MARKETING), `onia_prueba_por_terminar`, `recordatorio_demo` y
`seguimiento_demo` (MARKETING). Ninguna es A ni B.

- Los textos de abajo siguen la tabla de `sales-kit/SEGUIMIENTO-LEADS.md`. **El texto que Sergio Urcullo aprobó el 3-oct
  quedó en el transcript de esa sesión:** si difiere, gana ese, y se reemplaza acá antes de crear nada.
- Meta no tiene «borrador»: crear la plantilla por la API la manda a revisión en el acto. Por eso esto es solo el
  cuerpo del pedido. Se crea con el OK de Sergio Urcullo, desde WhatsApp Manager o por la API con el comando de abajo.
- Reglas de Meta respetadas: sin variables (el cuerpo no empieza ni termina en variable), categoría MARKETING, botones
  de respuesta rápida, sin enlaces.
- **No se le escribe a ningún prospecto** hasta que la tabla «se promete / funciona» esté en verde y Sergio Urcullo dé el OK.

## A · `disculpa_demo_20` (Maximo, Leonardo, Edwin: pidieron acceso)
> Hola, le escribe Sergio Urcullo, de Onia. Le debo una disculpa: pidió conocer el sistema y no le respondimos a tiempo.
> Si todavía le interesa, le muestro Onia funcionando en una llamada de 20 minutos, con los datos de un consultorio
> de ejemplo. ¿Coordinamos?

Botones: «Sí, coordinemos» · «Ahora no»

## B · `disculpa_respuestas_20` («F», Mario: hicieron preguntas)
> Hola, le escribe Sergio Urcullo, de Onia. Le debo una disculpa: nos hizo preguntas sobre el sistema y no le
> respondimos a tiempo. Prefiero contestárselas mostrándole cada respuesta en la pantalla, en una llamada de 20
> minutos. ¿Coordinamos?

Botones: «Sí, coordinemos» · «Ahora no»

## Cómo se crea (con el OK, no antes)
Cuerpo del pedido en `plantillas.json`. Desde el VPS, con el token del usuario de sistema de la WABA de Onia (nunca
impreso ni pegado en un chat):

```bash
curl -sS -X POST "https://graph.facebook.com/v21.0/4429061034078857/message_templates" \
  -H "Authorization: Bearer $TOKEN_WABA_ONIA" -H "Content-Type: application/json" \
  --data @<(jq '.[0]' plantillas.json)   # .[1] para la B
```

Después de aprobadas, Chatwoot las sincroniza solo y aparecen para enviar desde la bandeja 5 (y desde `/inbox` cuando
salga C16b).
