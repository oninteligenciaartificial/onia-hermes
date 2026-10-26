# Prompt para la sesión `onia-platform` — el panel del chatbot

**2026-08-16.** Pegar tal cual en una sesión del repo `onia-platform`. Está escrito contra el
estado real verificado ese día, no contra suposiciones.

**El reparto:** esa sesión construye **dónde se guarda y cómo se edita**. Esta sesión (el carril
del bot) hace que **el motor lo lea por organización**. Ninguna de las dos toca el repo de la otra.

---

```text
Sesión: onia-platform. Corré `git branch --show-current` primero y trabajá en rama propia.

ANTES DE TOCAR NADA, cargá las skills de ESTE repo (mandan sobre las genéricas):
onia-frontend · onia-backend · onia-db · onia-seguridad · onia-verificacion

TAREA ÚNICA: el editor del conocimiento del chatbot, por organización. Nada más.

── LO QUE YA EXISTE. NO LO REHAGAS. ──
· El panel maestro está construido y funciona: `app/(dashboard)/admin/` (573 líneas) con
  organizations/, global-users/, audit/, payments/, plans/, users/ y 12 rutas en
  `app/api/admin/`. Todo detrás de `profile.role === "SUPERADMIN"` en admin/layout.tsx.
· `app/(dashboard)/communications/page.tsx` (230 líneas) es DIAGNÓSTICO de envíos, solo lectura.
· `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx` (263 líneas) ya configura
  WhatsApp por organización. Ese es el patrón de config por tenant: seguilo, no inventes otro.
· El motor conversacional NO vive acá. Vive en el repo `onia-hermes`
  (`hermes-content/deploy/vps-ops/bot/`, 503 tests). El webhook de Chatwoot de este repo es un
  RELAY de 75 líneas y tiene que seguir siéndolo. NO escribas lógica conversacional acá.

── QUÉ CONSTRUIR ──
1. TABLA: una fila por organización con el conocimiento de su bot. Campos mínimos:
   organizationId (único), data (jsonb), version (text), updatedBy (text),
   status ('borrador'|'publicado'), updatedAt. Migración quirúrgica, según `onia-db`.

2. VALIDACIÓN: el jsonb tiene que cumplir EXACTAMENTE el allowlist del motor. La forma
   canónica está en `onia-hermes/hermes-content/deploy/vps-ops/bot/knowledge.mjs` (const SHAPE)
   y la planilla legible en `ONIA_CHATBOT_DATOS_POR_RUBRO_20260816.md`. Reglas que NO se negocian:
   · `schema` tiene que ser exactamente "onia.bot.knowledge/1"
   · TODO O NADA: una clave desconocida o un tipo mal rechaza el documento ENTERO
   · `faq[].id` sólo acepta "siat" HOY. Cualquier otro id rechaza todo. No inventes ids.
   · `demo.duracionMinutos` y `demo.duracionFrase` tienen que decir el MISMO número
   · NO existe ningún campo de precio, y no se agrega: el bot no cotiza
   · todo texto libre pasa por el guardrail (6 reglas, en `bot/guardrails.mjs`)

3. PANTALLA para el DUEÑO del negocio (no para el admin), con los bloques A-D de la planilla:
   identidad y horario · la cita · el léxico de su rubro (palabras, NUNCA regex) · qué ofrece.
   Al lado, un PROBADOR: escribís un mensaje, ves qué contestaría, ANTES de publicar.
   Si la validación rechaza, mostrá QUÉ campo y POR QUÉ en español, no un stack trace.

── NO HAGAS ──
· No toques el panel /admin: ya existe y funciona.
· No agregues un campo de precio ni de promesa comercial.
· No escribas un segundo motor conversacional.
· No inventes ids de FAQ.
· No despliegues sin correr los gates de `onia-verificacion`.

── LISTO = ──
Una organización real tiene su fila guardada, la pantalla la edita, el probador contesta, la
validación rechaza un documento inválido con el motivo en español, y todo eso VERIFICADO EN
PRODUCCIÓN (no sólo en local). Decí explícitamente qué no pudiste verificar.
```

---

## Lo que hace la sesión del bot (esta), en paralelo

1. `knowledge.mjs` deja de leer un archivo global y lee **la fila de la organización**, con el
   archivo como respaldo si la base no responde (candado 1: nunca tira).
2. El webhook resuelve la organización por `account.id` de Chatwoot.
3. Se cargan `rubrosExtra` de **veterinaria** y **estética**, que hoy caen en el léxico dental.

## Lo que depende de Sergio, antes de poder probar

**Hay 0 organizaciones en producción.** El alta nunca se ejercitó. El orden correcto es:

1. Sergio entra a `https://app.onia.com.bo/login` con `sergio@onia.com.bo` (la cuenta ya existe,
   último acceso 2026-08-01) y **completa el alta**. Eso crea la Organización y su Profile.
2. Recién ahí se lo promueve a `SUPERADMIN` con un `UPDATE` quirúrgico sobre su Profile.

**Por qué en ese orden y no creando las filas a mano:** el alta nunca fue probada por nadie.
Crearla a mano se saltea el único camino que un cliente real va a recorrer, y si está roto no
nos enteramos hasta que lo recorra un cliente. De paso, probarla es trabajo que ya había que hacer.
