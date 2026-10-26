# Ciclo comentario→DM — checklist de seguridad, manual

> 🔴 **DESACTUALIZADO EN LO QUE SIGUE — corregido el 2026-08-20, RE-CORREGIDO el 2026-08-27.**
> **Sigue siendo cierto:** este doc dice que el ciclo comentario→DM está bloqueado por **S6**, y
> eso es falso desde el 2026-08-18. S6 nunca bloqueó nuestras propias cuentas: `@oniahq` tiene
> rol en nuestra app y opera con **Standard Access**, que no pasa por App Review. S6 bloquea las
> cuentas de **clientes**, que es otra cosa.
>
> ⚠️ **Lo que decía acá y era falso:** que el ciclo estaba *"vivo y probado en producción"* en el
> workflow `gWrVHU8OxI9yugc4`. Contado en vivo el 2026-08-27: **ese workflow está APAGADO** desde
> el 21-ago (lo reemplazó `1jS4jwmNmvcQpqqH`), y el único DM que Meta aceptó en toda la historia
> fue **para Sergio mismo**, no para un lead. Esta frase se copió sin re-contar a cuatro docs y a
> un lote de prompts de contenido. **Es exactamente el error que la regla "verificar es MIRAR"
> existe para evitar.**
>
> **Fuente vigente y única del tema: `ONIA_CIRCUITO_COMENTARIO_DM.md`** (sin fecha, se edita).
> Contexto histórico: `ONIA_AUTOMATIZACION_MENSAJES_20260818.md` §10 y §14 ·
> `ONIA_RECORRIDO_24_7_20260820.md`.
> Lo demás de este doc (qué puede y qué no puede Postiz) sigue vigente.


> 2026-08-15. Prompt A2 de `hermes-content/references/video-intake/PROMPTS_POR_SESION.md`
> (línea 637). Un solo ciclo completo, de punta a punta, manual: la pieza, el recurso que se
> manda, el guion del DM, dónde se anota el lead y qué mide si sirvió. Nada de esto se
> publica ni se envía solo — todo pasa por aprobación de Sergio antes de salir.

---

## 0. El hallazgo, verificado (no repetido a ciegas)

El prompt original cita "4 de 6 reels cierran con comenta X y te mando la guía". Verificado
contra el repo, con las dos fuentes:

- **Origen del número:** `references/video-intake/INDEX.md` línea 97 — hallazgo de la tanda
  del 2026-08-09, sobre 6 videos analizados ese día. Cuatro cerraban con
  comentario→palabra clave→DM: `Workflow`, `seguridad`, `loop` + un cuarto.
- **El corpus creció y el patrón se sostiene, más fuerte:** `references/video-intake/SINTESIS_CORPUS.md`
  §2.1, sobre el corpus completo de 40 videos analizados hasta el 2026-08-12: **20 de 40
  (50%)** cierran con el mismo mecanismo. No es ruido de una tanda chica, es la mitad exacta
  de todo lo que se analizó.

Cito el número más reciente y más grande (20/40) porque es el más verificado, no el que trae
el prompt original. Los dos son reales; el segundo es mejor evidencia.

**Por qué nos sirve más que a ellos:** varios de los recursos que esos videos prometen por DM
ya los tenemos escritos en el repo (los 10 puntos de seguridad, el checklist de release, el
pipeline de video). No hay que inventar el recurso, hay que empaquetarlo y ponerle un ciclo
de captación manual encima.

---

## 1. Decisiones que tomé (para que Sergio las revise, no las asuma)

### 1.1 — El recurso: los 10 puntos de seguridad

Candidatos del prompt: los 10 puntos de seguridad · el checklist de release · el pipeline de
video. Verifiqué los tres:

| Candidato | Estado real | Encaja con el ICP (empresas Bolivia, clínicas dentales) |
|---|---|---|
| 10 puntos de seguridad | Escrito y completo: `references/video-intake/2026-08-09-10-errores-seguridad-apps-ia.md` + transcripción literal | **Sí, directo** — cualquier negocio que maneja datos de clientes/pacientes le teme a esto |
| Checklist de release | Es el **mismo contenido**: el propio doc de seguridad dice "usar los 10 puntos como checklist de release de ONIA Platform" (línea 48). No es un segundo recurso | — |
| Pipeline de video | Existe (`carousels/CAROUSEL_SYSTEM.md`, HyperFrames), pero es una capacidad interna de producción. Le habla a un colega de marketing, no al dueño de una clínica dental | Débil para este ICP |

Elegí **los 10 puntos de seguridad**. Además de estar completo, tiene algo que los otros dos
no: hasta el 2026-08-11 no se podía publicar honestamente (ver §1.3), y **ese bloqueo ya se
cerró** — es el momento correcto para usarlo.

### 1.2 — La palabra clave: SISTEMA, no LISTA, y no una tercera

`ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §0 fija dos palabras únicas para todo lo de ONIA:

| Palabra | Qué entrega hoy | Por qué NO la usé / la usé |
|---|---|---|
| **LISTA** | Un PDF de una página: tareas que se automatizan primero y qué cuestan (ya prometido en 4 carruseles: WhatsApp a mano, costo invisible, mitos, 5 tareas) | **No la usé.** Reusar LISTA para un recurso de contenido distinto (seguridad, no automatización de tareas) rompe la promesa 1:1 que ya existe con esos 4 carruseles: alguien que comentó LISTA en "WhatsApp a mano" espera el PDF de tareas, no una checklist de seguridad |
| **SISTEMA** | Diagnóstico de 20 min con los datos del negocio, vía Cal (ya prometido en 4 carruseles: competencia, escala, orden, 3 procesos) | **La usé.** Encaja sin fricción: "auditar tu sistema" es literalmente un diagnóstico. El compromiso que ya existe con SISTEMA (reunión de 20 min) **no cambia** — esta pieza solo suma un motivo más para pedirla, no un entregable distinto |

Con SISTEMA, el checklist (el PDF/MD) se manda como adelanto de valor en el mismo DM, y el
CTA real (lo que se agenda) sigue siendo exactamente lo mismo que en los otros 4 carruseles
que ya usan esa palabra. Cero fragmentación del sistema de 2 palabras.

### 1.3 — El bloqueo de publicar esto YA se cerró (verificarlo era obligatorio, no opcional)

El análisis original del video (2026-08-09) fue explícito: *"solo publicarlo cuando nuestra
propia casa esté ordenada — publicar esto con el panel abierto es un riesgo reputacional"*.
En ese momento, 3 de los 10 puntos estaban abiertos en producción (RLS, firewall/TLS,
logging).

Verificado contra la memoria de proyecto `onia-seguridad-estado-critico` y contra el aviso al
inicio de `PROMPTS_POR_SESION.md` ("🔴 CORRECCION 2026-08-12 — la tarea de seguridad YA ESTA
CERRADA"): **los 3 se cerraron y se verificaron en producción el 2026-08-11**, con prueba
real (permission denied en `set role anon`, puertos cerrados desde afuera, alerta de
Telegram entregada al crear una tabla sin RLS a propósito). El bloqueo para publicar esta
pieza **ya no existe**.

Quedan pendientes reales que no tocan a los 10 puntos del checklist (2FA, backups off-site,
política de privacidad) — no se mencionan en el recurso porque no son parte de esos 10, y
mencionarlos sin que se pida sería restar autoridad a la pieza sin necesidad.

---

## 2. La pieza — lista para que Sergio apruebe el guion (nada grabado todavía)

**Formato: no inventé uno nuevo.** `ONIA_MANUAL_DE_FORMATOS_20260813.md` ya documenta este
exacto contenido como su ejemplar del formato **P08 · Lista-interrogatorio** (54 s, 10 ítems,
~4,5 s/ítem, voz + infografía, cierre de una palabra). Reutilizo la receta completa: guion en
tabla, voz Lucía/Marcela (la voz oficial es-LATAM de ONIA, no exclusiva de la cuenta de
Lucía), placas con `make-mockup.mjs`, sync con `sync-plan.mjs`. Costo de producción según el
manual: 0 créditos de video, ~750 caracteres de ElevenLabs, ~2,5-3 h la primera vez.

**Nada de esto se graba ni se genera en esta sesión** — acá solo queda el guion aprobable.
Regla del formato (P08, sección "Trampa"): *"este formato acusa, y por lo tanto expone... se
publica después de cerrar lo que enumera, nunca antes"* — cumplida, ver §1.3.

### Guion (tabla, formato P08)

| # | Tiempo | Pregunta binaria (audio + rótulo) | Apoyo visual |
|---|---|---|---|
| Cover | 0,0-4,0 s | "Si vas a poner tu negocio en un sistema con IA, hacé estas 10 preguntas antes. (Nosotros nos las hicimos primero)." | Rótulo grande, fondo de marca |
| 1 | 4,0-8,5 s | *Límite de pedidos* — ¿aguanta si mil personas lo golpean a la vez, o se cae y tus clientes reales se quedan afuera? | Infografía: servidor saturado |
| 2 | 8,5-13,0 s | *Claves de conexión* — ¿escondidas del lado del servidor, o de regalo en el código que cualquiera lee? | Frontend vs. backend |
| 3 | 13,0-17,5 s | *Un cliente no ve los datos de otro* — ¿cada cuenta ve solo lo suyo, o hay una tabla sin candado? | Tabla con/sin candado por fila |
| 4 | 17,5-22,0 s | *Contraseñas del sistema* — ¿guardadas seguras, o subidas sin querer a un repositorio público? | `.env` protegido vs. expuesto |
| 5 | 22,0-26,5 s | *Lo que la gente escribe* — ¿tu formulario filtra lo que entra, o confía en cualquier cosa? | Embudo de validación |
| 6 | 26,5-31,0 s | *La base de datos* — ¿revisaron que ninguna tabla quede abierta al público por defecto? | Base pública vs. privada |
| 7 | 31,0-35,5 s | *Quién entra al panel* — ¿solo quien tiene que entrar, o cualquiera con el link? | Login → rutas protegidas |
| 8 | 35,5-40,0 s | *Cuando algo falla* — ¿mensaje prolijo, o el error técnico completo con pistas de cómo entrar? | Error limpio vs. stack trace |
| 9 | 40,0-44,5 s | *Puertas de administrador* — ¿cerradas en producción, o abiertas "por si acaso"? | Panel admin bloqueado |
| 10 | 44,5-49,0 s | *Si alguien intenta entrar* — ¿te enterás en el momento, o cuando ya pasó? | Dashboard de monitoreo |
| Cierre | 49,0-54,0 s | "Comentá **SISTEMA** y te mando la checklist completa — la misma que usamos nosotros — y agendamos 20 min gratis para repasarla en tu negocio." | CTA fuerte, acento verde en SISTEMA |

**Caption sugerido (para aprobación):**

> Nosotros mismos nos hicimos estas 10 preguntas antes de vender un solo sistema con IA. 3 de
> las 10 las teníamos mal — las cerramos, y las volvemos a auditar en cada sistema que
> armamos. Guardá este post y hacete las mismas preguntas sobre el tuyo. Comentá SISTEMA y te
> mando la checklist + 20 min gratis para repasarla en tu negocio.

Nota: el caption SÍ puede admitir el matiz de "3 de las 10 las teníamos mal" — a diferencia
del recurso por DM (ver `recursos/checklist-seguridad-ia-10-puntos.md` §"Qué NO decir"), en
el caption funciona como prueba de honestidad y de que el checklist es real, no de relleno.
**Decisión de Sergio si lo cambia:** es la única pieza de este ciclo con ese matiz; si no
quiere exponerlo en absoluto, la alternativa segura es "Nos hicimos estas 10 preguntas antes
de vender un sistema con IA — las cerramos las 10", sin el número 3.

**Trabajo del post (regla de `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §3-bis):** 100% **CTA**.
No es educacional ni de engagement — todo el formato P08 está diseñado para autodiagnóstico
que termina en comentario. Eso importa para dónde se ubica en el calendario (§6).

---

## 3. El recurso empaquetado — dónde vive y qué es

`hermes-content/recursos/checklist-seguridad-ia-10-puntos.md` — MD listo para copiar y pegar
en el DM de Instagram (no PDF: el formato MD está explícitamente permitido por la tarea y no
agrega una herramienta nueva de conversión que hoy no existe en el repo). Contiene:

- Los 10 puntos, traducidos a lenguaje de dueño de negocio (no jerga de "RLS"/"rate
  limiting" sin explicar) — mismo contenido que el video fuente, mismo orden, sin agregar ni
  quitar puntos.
- El bloque exacto para pegar en el chat, con `*negrita simple*` (así renderiza Instagram/WhatsApp,
  no `**doble**`).
- El link de agenda con atribución: `https://onia.com.bo/?src=onia-seguridad-dm` (§5).
- Una sección "Qué NO decir" para no prometer de más ni exponer trabajo interno.

**Cobertura:** contenido verificado contra la fuente y contra el estado de seguridad real
(§1.3). Es la primera vez que se empaqueta como recurso para prospecto — no existía antes de
esta sesión.

---

## 4. Guion del DM — 100% manual, dos mensajes

**Por qué manual y no automático:** automatizar comentario→DM en Instagram requiere permisos
de mensajería de la Graph API de Meta, y el token de IG sigue bloqueado (S6). El manual
funciona desde hoy mismo y no depende de que se destrabe nada. Cuando se resuelva S6, este
mismo guion es el que se convierte en respuesta automática — no cambia el contenido, cambia
quién lo envía.

**Paso a paso (Sergio o Arthur, cuenta `@oniahq`):**

1. Alguien comenta `SISTEMA` en el reel del checklist → entra a la bandeja de comentarios de
   Instagram.
2. Abrir el DM de esa persona (Instagram arma el hilo automáticamente al responder desde el
   comentario) y pegar el bloque de `recursos/checklist-seguridad-ia-10-puntos.md` §"Texto
   listo para pegar" tal cual — no reescribirlo cada vez, la consistencia es parte del
   profesionalismo del checklist.
3. Si contesta o sigue la conversación: preguntar **negocio, rubro y ciudad** (lo mínimo que
   pide el CRM, §5) antes de que la charla se apague sola.
4. Anotar el lead en el CRM apenas se tienen esos 3 datos (§5) — no al final del día, no
   "cuando junte varios".

**No se manda por WhatsApp en ningún paso de este ciclo.** Ver §7 sobre por qué eso importa
igual.

---

## 5. Dónde se anota el lead — el CRM que ya existe, con sus campos

Dos sistemas YA existen y este ciclo los usa a los dos, cada uno para lo suyo. No se crea
ningún registro nuevo.

### 5.1 — Notion (`CRM Vendedores ONIA`) — cada conversación con nombre

Fuente: `hermes-content/docs/CRM_PROSPECTING.md` + `NOTION_VENDOR_CRM_SCHEMA_2026.md` (el
esquema completo). Se anota **cada** lead que responde en el DM y comparte al menos negocio o
rubro — no hace falta que agende para entrar acá.

Campos mínimos a llenar para este ciclo (nombres exactos del esquema Notion):

| Campo | Qué poner acá |
|---|---|
| Lead / Lead ID | Nombre de pila (o @handle de IG si no lo da) / `LEAD-XXXX` correlativo |
| Empresa | El negocio, si lo menciona |
| Rubro | El que corresponda del select (dental/estética/servicios/otro) |
| Ciudad | La que diga, o "a confirmar" |
| Contacto público | `@handle` de Instagram — este SIEMPRE se tiene, es el dato mínimo real |
| Canal principal | Instagram |
| Fuente | `onia-seguridad-dm` — mismo slug que el `?src=` (permite cruzar a mano con el panel, §5.2) |
| Permiso de contacto | Aprobado (escribió espontáneamente en su propio hilo) |
| Vendedor origen / Responsable actual | Quien contestó el DM (Sergio o Arthur) |
| Estado pipeline | Arranca en "Contactado"; sube a "Respondió" / "Demo agendada" según avance |
| Producto sugerido | Sistema / Diagnóstico ONIA |
| Notas | Contexto de la charla |

**Nota de estado del propio esquema:** `NOTION_VENDOR_CRM_SCHEMA_2026.md` (pendiente técnico,
al pie) registra que la conexión de Notion no estaba autenticada la última vez que se probó
desde acá, y deja abierta la duda de si la base activa se llama `CRM Vendedores ONIA` o `CRM
& Contactos`. No lo pude verificar en esta sesión (no tengo acceso a Notion desde este
entorno) — **confirmar el nombre exacto de la base antes de anotar el primer lead real** es
lo único de este punto que depende de abrir Notion, no de mí.

### 5.2 — `onia_center.leads` (panel, automático) — si agenda por el link

Si la persona efectivamente reserva usando `https://onia.com.bo/?src=onia-seguridad-dm`
(§5), **no hace falta anotar nada a mano ahí**: el circuito ya está en producción y probado
punta a punta (memoria `onia-center-atribucion-leads`) — la reunión cae sola en
`onia_center.leads` con `source = onia-seguridad-dm`, visible como badge "src:" en el panel
(`center.onia.com.bo`). Verificado en vivo hoy (§6): `onia.com.bo` y
`cal.onia.com.bo/onia/consulta-inicial` responden 200 en producción.

La única acción manual es cruzar: si el lead de Notion (§5.1) después aparece en el panel con
esa fuente, actualizar su `Estado pipeline` a "Demo agendada".

---

## 6. Atribución `?src=` — cómo se usa en esta pieza, verificado en vivo

Mecanismo real (código, no memoria): `web-factory/apps/onia-platform/src/components/sections/agenda-form.tsx`
lee `?src=` de la URL con `window.location.search` al cargar, lo persiste en
`sessionStorage` (`onia_src`), y al enviar el formulario de agenda lo agrega a las notas de
la reserva de Cal.com como `Fuente: <src>`. El formulario vive en la portada
(`web-factory/apps/onia-platform/src/app/page.tsx` → `<Doors />` → `<AgendaForm />`).

**Link a usar en el DM:** `https://onia.com.bo/?src=onia-seguridad-dm`.

Slug elegido siguiendo el patrón ya establecido en el cronograma (`onia-<pieza>` ·
`lucia-<pieza>` · `ads-<angulo>`) — `onia-seguridad-dm` marca que es de la cuenta ONIA, tema
seguridad, y que el canal de origen es DM (no carrusel de feed), para poder diferenciarlo en
el panel de los otros `onia-*` si hace falta más adelante.

Verificado en vivo hoy, 2026-08-15 (`curl`, solo lectura):

```text
onia.com.bo (con ?src=): 200
cal.onia.com.bo/onia/consulta-inicial: 200
```

Lo que NO verifiqué en vivo: una reserva real de punta a punta con este `src` específico
(no voy a crear un lead de prueba sin necesidad). Me apoyo en que el mismo mecanismo fue
probado end-to-end el 2026-08-01/02 (memoria `onia-center-atribucion-leads`, prueba con
`source: reel-objecion-01`, lead creado y borrado) y en que hoy el endpoint sigue vivo.

---

## 7. El plazo de WhatsApp — no toca a este ciclo, pero se deja escrito igual

La ventana gratuita de 24 h de WhatsApp se cierra el **1-oct-2026** (confirmado también en
`references/video-intake/INDEX.md` línea 110-111) — cualquier embudo que termine en WhatsApp
cambia de costo ese día.

**Este ciclo específico no pasa por WhatsApp en ningún punto**: es Instagram DM → (opcional)
reserva en Cal.com vía `onia.com.bo`. No hay costo de ventana que se le vaya a activar el
1-oct. Se deja la advertencia escrita de todos modos porque **si en el futuro este mismo
molde (comentario→DM) se reusa para un recurso que cierre invitando a WhatsApp** en lugar de
a la agenda, ese es el momento exacto en que empieza a costar. Vale para cualquier variante
futura de este ciclo, no solo para esta pieza.

---

## 8. Qué mide si esto sirvió

Sin automatizar nada nuevo — todo con lo que ya existe:

| Métrica | Dónde se lee | Qué prueba |
|---|---|---|
| **Comentarios** | Insights nativos del post en Instagram | Si el formato P08 (autodiagnóstico) frena el scroll |
| **DMs respondidos** | Tally manual: 1 por conversación abierta, no por mensaje | Tasa de respuesta = DMs respondidos / comentarios — si el guion del DM (§4) engancha |
| **Leads con nombre** | Filas nuevas en Notion con `Fuente = onia-seguridad-dm` (§5.1) | Si el DM se convierte en lead real, no en comentario suelto — la métrica que el prompt A2 pide explícitamente |
| **Reuniones agendadas** | Panel `center.onia.com.bo`, badge `src: onia-seguridad-dm` (§5.2), automático | La métrica de negocio real, la misma vara de `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §4 |

**Propuesta de umbral** (a que Sergio ajuste; es una pieza sola, no una tanda de 8 como el
cronograma): 0 reuniones tras el ciclo completo de comentarios → el gancho de seguridad no
convierte para este público, probar el siguiente recurso ya escrito (pipeline de video,
u otro ángulo del mismo checklist). 1+ reunión → funciona, vale repetir el molde P08 con el
checklist de release o con otro recurso ya escrito.

---

## 9. Dónde encaja en el calendario — recomendación, no edito el cronograma

No toqué `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` (regla explícita de esta tarea). Dejo la
recomendación acá para que quien programe la aplique.

Esta pieza es **100% CTA** (§2). El cronograma ya tiene 2 CTA entre los 8 carruseles
(posiciones 6 y 8) y su propia regla dice *"nunca dos CTA seguidos, y nunca más de 1 de cada
4 posts"*. Sumar esta pieza a la MISMA rotación Lun/Mié/Vie la llevaría a 3 CTA en 9 posts
(33%, por encima del límite). Dos opciones seguras, ambas respetan la regla sin tocar el
archivo:

1. **Publicarla un día sin carrusel** (martes o jueves), en la semana 2 — no cuenta contra la
   proporción de la rotación principal porque no ocupa uno de sus 8 lugares, y queda lejos de
   los CTA de posición 6 y 8.
2. **Guardarla para la semana de revisión** (después de agotarse los 8 carruseles, el
   checkpoint que el propio cronograma define en su §4) — abre la segunda tanda con un
   formato nuevo (reel, no carrusel) en vez de repetir el molde de carrusel.

---

## 10. Estado — qué quedó hecho, qué a medias, qué depende de Sergio

**Hecho en esta sesión (texto, cero gasto, cero publicación):**
- Recurso empaquetado y verificado: `hermes-content/recursos/checklist-seguridad-ia-10-puntos.md`.
- Guion completo de la pieza (P08, tabla con tiempos), listo para aprobación — nada grabado.
- Guion de DM manual (2 pasos) + mapeo exacto de campos CRM.
- Link de atribución `?src=onia-seguridad-dm` definido y verificado en vivo (200 en ambos
  extremos del circuito).
- Métricas definidas con su fuente de lectura (sin dashboard nuevo).

**A medias, y dónde exactamente:**
- La pieza es guion, no video: falta grabar/generar voz (ElevenLabs, ~750 caracteres) y
  montar las 10 placas — trabajo de producción normal una vez que Sergio apruebe el guion.
  Cero crédito gastado hasta ahora.
- El nombre real de la base de Notion activa (`CRM Vendedores ONIA` vs. `CRM & Contactos`) no
  se pudo confirmar desde este entorno (§5.1) — es una verificación de un minuto, no un
  bloqueo de diseño.

**Depende de Sergio:**
- Aprobar (o corregir) el guion de §2 y el caption, incluida la decisión del matiz "3 de los
  10 las teníamos mal" en el caption (§2, nota).
- Elegir dónde entra en el calendario: opción 1 o 2 de §9 (o una fecha propia).
- Confirmar el nombre de la base de Notion antes de que se anote el primer lead real.
- Dar el OK para gastar los ~750 caracteres de ElevenLabs cuando se pase a producir el video
  (no gastado en esta sesión).

**No se publicó ni se envió nada.** No se automatizó el DM. No se tocó el cronograma, los
briefs de carruseles ni ningún índice.
