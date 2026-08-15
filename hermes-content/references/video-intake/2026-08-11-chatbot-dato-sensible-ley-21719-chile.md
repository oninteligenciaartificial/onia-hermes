# Dato sensible de salud en chatbot — Ley 21.719 de Chile

- **Fuente:** https://www.instagram.com/p/Dbiu19JRMSr/ · 65.3 s · con voz (locución del creador)
- **Visto:** 2026-08-11 (Gemini nativo + Whisper)
- **Archivo:** `Instagram-Dbiu19JRMSr.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-Dbiu19JRMSr.md](transcripciones/2026-08-11-Instagram-Dbiu19JRMSr.md)

## Qué dice realmente

@carlosdominguez.dev arma un caso concreto para quien construye bots de WhatsApp:

- **00:00-00:15** — una clienta de una clínica de estética cancela su cita por WhatsApp: *"Hola! Tengo que cancelar mi cita de mañana"* / *"estoy enferma"*. El bot responde amable y reagenda.
- **00:15-00:21** — al día siguiente el bot hace seguimiento: *"¿Ya te sientes mejor? ¿Confirmamos tu cita de hoy?"* — revelando que el sistema guardó y reutilizó el motivo de salud de la clienta.
- **00:21-00:42** — explica que *"estoy enferma"* es un dato de salud, "dato sensible" según Artículo 2, letra G de la Ley 21.719 de Chile (esa cita del artículo viene de la lectura de Gemini; Whisper transcribió ese tramo del audio de forma confusa — *"le traje de la nueva ley chilena"*). Afirma que guardarlo sin consentimiento expreso es infracción, con multas *"de hasta un millón y medio de dólares"* y, en el texto en pantalla, *"o el 2-4% de tu facturación"* — el audio en ese punto solo dice *"el 4%"*, o sea pantalla y voz no coinciden en el rango exacto.
- **00:42-00:49** — la solución que propone: registrar *"reagendado por el cliente, punto, sin motivo"* — una ruta neutra. Regla de oro citada textual: *"Si el dato no cambia lo que tu sistema hace, ese dato no se guarda."*
- **00:53-01:04** — cierre: *"esto te aplica desde el 1º de diciembre, aunque no vivas en Chile"*. CTA: comentar "LEY" para un checklist gratis.

## Veredicto: SIRVE YA

El principio de diseño —no guardar un dato si no cambia lo que el sistema hace— es gratis, no depende de nada, y aplica directo a Chatwoot/WhatsApp y a los rubros que manejan salud real (dental, estética). Es una regla de minimización de datos que vale por sí sola, más allá de si la ley chilena específica nos alcanza o no.

Lo que NO sirve tal cual y hay que separar: las cifras de multa, el artículo citado y sobre todo la afirmación *"aunque no vivas en Chile"* son la lectura de un video de marketing de un tercero (el propio video tiene una inconsistencia interna: la pantalla dice "2-4%" y el audio dice "4%"). Es ley chilena, no boliviana — no reemplaza ni anticipa el marco legal de Bolivia, y no se debe citar a un cliente boliviano como si aplicara ahí.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| chatbot (Chatwoot + WhatsApp) | Aplicar la regla ya: registrar "reagendado por el cliente" sin guardar el motivo de salud que escribió el cliente |
| onia-plattform (dental / estética) | Auditar qué campos de notas/CRM guardan hoy texto libre del cliente; revisar si ya se está guardando dato de salud sin necesidad |
| Marketing / lead-gen | Confirma otra vez el patrón "comenta X → DM" (ya mapeado en INDEX.md, tanda 2026-08-09); no clonar el checklist, es contenido ajeno sobre ley chilena |

## Riesgo

Los montos de multa, el artículo citado y el alcance "aunque no vivas en Chile" son afirmaciones de un tercero en un video promocional — VERIFICAR el texto real de la Ley 21.719 antes de citarla a cualquier cliente. Es marco legal de Chile, no de Bolivia: si un cliente boliviano pregunta, responder con la práctica general de minimización de datos, nunca con estas cifras chilenas como si fueran ley local.
