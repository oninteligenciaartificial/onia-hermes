# Skill: aprobaciones-onia

## Cuando usar
Consultar SIEMPRE antes de ejecutar cualquier accion con efectos externos:
publicar, contactar, enviar correos, usar cara/voz IA o mover dinero. Es la
fuente unica de verdad sobre que requiere aprobacion y con que texto literal.
Las demas skills remiten aca.

## Principio
Telegram y el chat son canales de CONTROL, no de autorizacion implicita.
`ok`, `dale`, `hazlo`, `perfecto` o un pulgar arriba NO aprueban nada con
efectos externos. Solo cuentan los textos literales de esta tabla. Todo lo que ve el publico o un cliente se le muestra antes a Sergio Urcullo con captura (o el video real); sin captura no se pide la frase.

## Tabla de aprobaciones

| Accion                                   | Texto literal requerido                | Alcance |
|------------------------------------------|----------------------------------------|---------|
| Publicar carrusel/post IG                | `Apruebo publicar <pieza>`             | Solo la pieza exacta aprobada |
| Publicar video                           | `Publicar video <job_id>`              | Solo ese job_id |
| Contactar prospecto (primer contacto)    | `Apruebo contactar: <empresa>`         | Abre la conversacion en ese canal |
| Recontactar prospecto dormido o canal nuevo | `Apruebo contactar: <empresa>`      | Nueva aprobacion, no hereda la anterior |
| Usar cara o voz IA de Sergio             | Aprobacion explicita POR PIEZA (subirla a un servicio externo pide ademas el OK de Leslie Mercado Moreno) | Nunca aprobacion general |
| Cancelar evento de calendario            | Confirmacion explicita en la conversacion | Solo ese evento |
| Enviar correo formal a cliente (Cal.com) | Aceptar la reunion por Telegram        | El correo sale despues de aceptar |

## Bloqueos vigentes (no hay texto que los apruebe)
- WhatsApp saliente a prospectos: nunca sin "Apruebo contactar: <empresa>"; fuera
  de la ventana de 24 h solo plantilla aprobada. El bot (Chatwoot) responde entrantes.
- `auditoria-pagada` en Cal.com: desactivada en fase inicial.
- Publicar desde Hermes con ig-publish en cuentas personales: sin credenciales Meta, no
  intentarlo (Instagram sale por Buffer con ig-reel.mjs, lo corre Claude).
- Revelar a clientes que se usan plantillas internas: confidencial, siempre.
- Mezclar datos de Onia Platform (clientes, pacientes) con Hermes: solo lectura autorizada para
  diagnostico o estado tecnico.

## Como pedir aprobacion (formato)
Al final de cualquier respuesta que deje una accion pendiente:
```text
Aprobacion necesaria: <texto literal exacto que Sergio debe escribir>
```
Ejemplo: `Aprobacion necesaria: Apruebo publicar Carrusel errores-leads`.
Si no hay nada pendiente: `Aprobacion necesaria: ninguna`.

## Reglas de ejecucion post-aprobacion
- Ejecutar EXACTAMENTE lo aprobado; cualquier cambio posterior (caption,
  imagen, fecha, destinatario) invalida la aprobacion y hay que pedirla de nuevo.
- Nunca reintentar en silencio una accion externa que fallo: reportar el error
  exacto y esperar instruccion.
- Toda accion externa ejecutada se avisa a Sergio Urcullo por Telegram
  (chat ID `6830070978`), con el enlace a lo publicado.

## Registro
Cada aprobacion usada se registra con: fecha, texto de aprobacion, accion
ejecutada y resultado (published_id, mensaje enviado, evento cancelado).
Sin registro, la accion no se considera cerrada.
