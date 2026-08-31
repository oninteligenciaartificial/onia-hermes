# Radar de decisiones de producto — las ideas que no se pueden perder

> Doc VIVO sin fecha (se edita, no se duplica). Nace 2026-08-17 de un volcado de
> Sergio: "estas son ideas que no puedo olvidar; luego vamos a desglosar una por
> una". Cada frente lleva su estado REAL verificado y la pregunta que falta decidir.

## 1. ¿Chatwoot o plataforma de chat PROPIA hecha por Onia?

**La regla de Sergio**: "tiene que ser hecho por nosotros — usar otra plataforma no
tiene sentido".

**Lo que YA es nuestro (construido y probado):**
- El MOTOR conversacional entero: `bot-engine` propio, 508 tests, guardrails,
  etapas, LLM gateado. Chatwoot NO piensa nada — solo transporta.
- El conocimiento por organización + editor + probador (producto, en prod).
- La cara: widget con "Desarrollado por Onia" verificado en píxeles (branding de
  Chatwoot pisado vía `installation_configs`; vigilar el reconcile).

**Lo que Chatwoot aporta hoy (y costaría construir):** bandeja humana multi-agente,
canales (WhatsApp/Website/API), Embedded Signup ya soportado, historial. Decisión
previa vigente: "encender, no construir" (memoria plataforma-canales-decision).

**Camino recomendado (a ratificar):** Chatwoot queda como INFRAESTRUCTURA invisible
(el cliente jamás lo ve — ya logrado), y la bandeja que el cliente usa se construye
DENTRO del panel Onia cuando un cliente real la pida (`/communications` ya existe
como base de solo-lectura). Reemplazar Chatwoot entero = proyecto grande sin cliente
que lo pague todavía; taparlo = hecho.

**Autochecking**: no depende de la plataforma — depende del App Review de Meta (EN
CURSO, ~20 días) + prueba de coexistencia con +591. Hasta qué punto es self-service:
popup conecta número y el formulario A-D arma el bot; lo único no-self-service que
queda es la plantilla utility para fríos y el alta del inbox (automatizable después).

## 2. Páginas web — estado

**Avanzado, es el frente más maduro:** Web Factory con 22 bloques + templates
(dashboard canon v4/v5 elegido, landing-realestate generada desde learned model),
pattern banks + DESIGN_LEARNED (15 fuentes + galerías), checklist de pre-entrega de
17 items como gate, mapa de conocimiento ordenado en DESIGN_STACK.
**Falta:** portar v5 al producto (espera OK) · portafolio publicado (3 videos listos
sin publicar) · pipeline intake→web a escala con clientes reales.

## 3. Bots de LLAMADAS — estado

- Arquitectura YA escrita: `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (1.058
  líneas). Bolivia NO está excluida de la Calling API de Meta (verificado 15-ago).
- **Regla F1 antes de encender NADA**: separar llamadas de mensajes — si se habilita
  `calls` en la misma app, los webhooks de llamada caen en Chatwoot, responde 200 y
  los descarta: el que llama escucha silencio y el diagnóstico falso cuesta días.
- Estado real: diseño listo, CERO construcción. Cola: detrás del chatbot de texto
  completo (que está a un paso). El benchmark de agentes descartó recepcionista de
  voz como próximo paso por esfuerzo/retorno — la arquitectura queda para cuando
  haya clientes pagando el chat.

## 4. Landing con precios — estado

- Landing viva en onia.com.bo (139 kB, deployada; /comparativa arriba).
- Precios: `onia-platform/lib/pricing.ts` ÚNICA fuente (regla dura). Chatbot:
  Bs 1.500 instalación + Bs 1.490/mes con 500 conversaciones + "a medida" cotizado.
  Costeo post-1-oct verificado (aguanta); checkpoint 1-sep para la tarifa exacta.
- Promesa SIAT RETIRADA de la bio hasta que el NIT (S2) destrabe — al volver, es el
  argumento del 30-sep (RND 102600000007, grupos 9-12 por NIT, verificable).
- Pendiente: hero nuevo (queued de sesión anterior) · portar los precios nuevos del
  catálogo de venta a la landing cuando Sergio ratifique la lista.

## 8. 🔴 La rama del carril contenido NO se puede pushear (2026-08-31) — decisión de Sergio

**El hecho, medido:** `git push origin claude/ads-creatividades-publicos` lo rechaza GitHub:

```
remote: error: File hermes-content/references/oniahq/reel-R01/clips/b3.mp4 is 149.25 MB;
this exceeds GitHub's file size limit of 100.00 MB
! [remote rejected] (pre-receive hook declined)
```

**No es lentitud de red.** `git ls-remote` responde en un segundo. El primer diagnóstico
("push lento por 118 commits con láminas") estaba mal: la rama está **rechazada desde
`563c5173`**, el commit que metió ese clip. O sea: **118 commits de este carril existen sólo
en esta máquina.** Es exactamente el fantasma que ya nos pasó el 30-ago con las 74 láminas
(commit `1eb80206`).

`b3.mp4` pesa 149 MB entre hermanos de 130 KB, 451 KB y 552 KB — tiene toda la cara de un
clip crudo que se coló, no de un entregable.

**Archivos grandes que ya están en el árbol:**

| Peso | Archivo | Estado |
|---|---|---|
| 149,2 MB | `references/oniahq/reel-R01/clips/b3.mp4` | 🔴 **rompe el push** |
| 95,8 MB | `references/creator-video-references/inbox/creator-video-ref-20260601-003.mp4` | ⚠️ a 4 MB del límite |
| 82,9 MB | `references/creator-video-references/inbox/creator-video-ref-20260601-001.mp4` | ⚠️ |
| 79,9 MB | `references/sergio-approved-media/inbox/IMG_0218.MOV` | ⚠️ |
| 63,6 MB | `…/final-avatar-identity-lock/20260605-upload-0405-0409/raw/IMG_0406.MOV` | ⚠️ |
| 58,5 MB | `references/creator-video-references/inbox/creator-video-ref-20260601-002.mp4` | ⚠️ |
| 50,8 MB | `references/sergio-approved-media/inbox/IMG_0217.MOV` | ⚠️ |

**Por qué es decisión de Sergio y no la tomo solo:** las tres salidas reescriben el historial
de la rama (cambian todos los SHAs y piden force-push), y **hay otra sesión commiteando en este
mismo carril** — apareció `b23f1037` mientras trabajaba. Un force-push a ciegas le borra el
trabajo a esa sesión.

| # | Salida | Costo en USD | Qué implica |
|---|---|---|---|
| **A** | `git lfs migrate import` de los 7 archivos | **0 hoy.** Suman ~581 MB y GitHub da 1 GB de storage + 1 GB/mes de banda gratis. Pasado eso: **USD 5/mes por 50 GB** | Reescribe el historial igual. Todo el que clone necesita `git-lfs` instalado o baja punteros rotos. La banda de 1 GB/mes es ajustada: cada clon completo se lleva medio giga |
| **B** | `git filter-repo --path …/b3.mp4 --invert-paths` | **0** | Saca sólo el archivo que rompe. Reescribe los 118 commits. El clip queda en disco sin trackear. Los otros 6 siguen a un paso del límite: esto no es una solución de fondo, es destrabar el push |
| **C** | Recomprimir `b3.mp4` y volver a commitear | **0** | ❌ **No sirve solo.** El blob viejo sigue en el historial y GitHub lo sigue rechazando. Requiere B igual |

**Recomendación:** **B para destrabar hoy** (es lo mínimo que devuelve el push), y decidir A
por separado con calma para los otros 6 — no porque rompan hoy, sino porque el repo está
guardando video crudo, y eso no escala. Antes de cualquiera de las dos: **coordinar con la otra
sesión que está commiteando en el carril**, porque el force-push le pisa el trabajo.

**Mientras tanto:** el trabajo del carril se está commiteando local y **no está respaldado**.
El auto-sync hace push y falla en silencio si nadie mira el exit code.


## Orden sugerido para desglosar (cuando Sergio quiera)

1. Cerrar chatbot texto (inbox→org en curso · plantillas por rubro · esperar Meta).
2. Ratificar el camino Chatwoot-invisible + bandeja propia gradual.
3. Portar dashboard v5 + hero/precios de landing.
4. Llamadas: recién con clientes de chat pagando (F1 primero, siempre).


## 5. Requisitos de Sergio para el chatbot del cliente (2026-08-18)

1. **Self-service TOTAL**: el cliente configura TODO desde su panel — sin tocarnos
   la puerta. Simple por diseño (el formulario A-D es la base; lo que no sea
   simple, se simplifica).
2. **Fácil para los clientes DEL cliente**: el que chatea con el bot debe poder
   usar y COMPRAR sin fricción — el bot no es solo informativo, es un canal de
   venta del negocio.
3. **Capacidades ricas a investigar (factibilidad en curso)**: enviar/recibir
   imágenes (catálogo con fotos, comprobantes), botones/listas interactivas,
   carrito/pedido por chat, y qué permite cada canal (widget web vs WhatsApp
   Cloud API — catálogo nativo de WhatsApp incluido).


## 6. Webs CONECTADAS al sistema (2026-08-18) — tarea abierta

Sergio: "quiero que toques cómo podemos conectar páginas webs a los sistemas; hacé la
prueba con Bolivian Electric". Doc con los 4 circuitos y el plan de prueba:
`ONIA_WEB_CONECTADA_AL_SISTEMA.md`. Resumen: el circuito 1 (formulario→lead) ya tiene
precedente vivo (forms.onia.com.bo/alta → onia_center.leads); Bolivian Electric está
HOY desconectado del sistema (verificado) y es el laboratorio ideal. Vender "web que
alimenta el sistema" es terreno que ni Forges ni las agencias ocupan.

## 7. ¿Factura de verdad? (2026-08-18) — auditoría en curso

Sergio pidió verificar si el sistema factura realmente. Auditoría corriendo que separa
tres cosas que no son lo mismo: factura interna del negocio (documento de cobro) ·
factura FISCAL SIAT (bloqueada por NIT, a confirmar) · cobro de Onia a sus clientes
(hoy comprobante manual). Sale en `ONIA_FACTURACION_ESTADO_REAL.md` con una respuesta
clara para la venta: se puede decir "Onia te factura" SÍ/NO/con qué asterisco.
