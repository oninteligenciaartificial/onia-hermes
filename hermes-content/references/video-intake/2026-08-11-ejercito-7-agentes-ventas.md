# "AI Sales Army" — 7 agentes especializados en vez de uno

- **Fuente:** https://www.instagram.com/p/DbxCAGGlEMQ/ · carrusel de 8 láminas · inglés
- **Visto:** 2026-08-11 — caption íntegro (trae el sistema completo) + láminas disponibles
  en el scratchpad. Sin Gemini.

## Qué dice realmente

La tesis: en vez de una IA que hace todo, partir el proceso de venta en siete agentes con
una función cada uno.

```
FIND → RESEARCH → PERSONALIZE → OUTREACH → FOLLOW-UP → BOOK → CLOSE
```

| Agente | Función declarada |
|---|---|
| Lead Finder | encuentra prospectos de calidad |
| Researcher | estudia cada lead y su negocio |
| Personalizer | escribe mensajes que suenan relevantes |
| Outreach Agent | inicia la conversación en los canales |
| Follow-Up Agent | insiste hasta que hay respuesta |
| Appointment Setter | califica y agenda la reunión |
| Sales Manager | sigue el pipeline y empuja los tratos |

Y una línea que lo salva de ser spam: *"el objetivo no es spamear a miles"* — sino que la IA
haga lo repetitivo y quede más tiempo para cerrar. CTA: comentar `ARMY`.

## Veredicto: MEJORA LO ACTUAL

La arquitectura no es novedad —es descomposición por rol, que es lo que ya hacemos con los
subagentes—, y no muestra nada corriendo: es un diagrama con CTA. Pero **el mapa de roles sí
es útil como checklist contra lo que tenemos**.

Contra el estado real: ya corren agentes de Contenido, Finanzas y Vendedor, con cola de
aprobación humana, y hay pipeline de leads con atribución `?src=` en producción. Traducido a
su vocabulario, el "Vendedor" hoy cubre parcialmente varios de los siete y **los eslabones
más débiles son Researcher y Follow-Up**: investigar cada prospecto antes de escribirle, y
no dejar morir la conversación por falta de seguimiento.

Eso además calza con la regla de prospección que ya tenemos: pocos prospectos buenos con
señal de oportunidad, no listas largas. Un Researcher sirve exactamente para eso; un Lead
Finder que traiga volumen, no.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| onia-plattform / agentes | Usar los 7 roles como checklist contra el agente Vendedor: marcar cuáles cubre, cuáles no, y quedarse con los 2 que faltan (Researcher y Follow-Up) |
| CRM / prospección | El Follow-Up es el de mayor retorno: los leads que ya entraron y quedaron sin respuesta son plata que ya se pagó |
| chatbot | El Appointment Setter se solapa con lo que el chatbot ya podría hacer. No crear un agente nuevo si es una capacidad del bot |

## Riesgo

**El outreach automático es donde esto se vuelve peligroso.** Un Outreach Agent que escribe
solo, sin aprobación del mensaje y del canal, es spam con nuestra marca encima — y choca de
frente con la regla de no contactar sin aprobación explícita. Si algo de esto se construye,
el agente redacta y **un humano aprueba antes de que salga**, igual que la cola actual.

Y no multiplicar agentes por moda: siete procesos no exigen siete agentes. Varios son un
estado del work item, no una entidad nueva.
