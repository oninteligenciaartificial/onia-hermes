# ONIA — Plan Meta post-SEPREC (verificar como ONIA → WhatsApp → CAPI)

Fecha: 2026-07-06. **Lo que queda cuando SEPREC apruebe la matrícula** (aviso al día
siguiente). Los **ads YA funcionan** — esto desbloquea WhatsApp + escala.

## Estado actual (dónde estamos parados)
- **Motor de ads: deployado + verificado EN VIVO.** Vive en el VPS `/opt/onia/meta-ads/`,
  creds en `/root/.hermes/.env`. El token lee la cuenta ONIA Ads real (USD, activa, $0).
- **Ids:** Business `1451773736711697` · Ad Account `act_1073680778314945` (ONIA Ads) ·
  App Marketing API `1562215408796050` · Pixel ONIA Web `1012611478191231` · Page
  `1140384625819526`.
- **Fiscal:** NIT `5371375010` (unipersonal Régimen General, razón social **LESLIE
  MERCADO MORENO**). **Esperando matrícula SEPREC** con nombre comercial **"ONIA"**.

---

## Paso 1 — Verificar el negocio en Meta (como ONIA)
**Requiere:** matrícula SEPREC (con nombre comercial "ONIA") + el NIT.

1. **Business Settings → Información del negocio** → completar:
   - Nombre legal = **razón social** que figure en la matrícula.
   - Dirección + teléfono.
   - **Email del dominio real** (ej. `business@onia.com.bo`) — Meta lo exige, y también
     lo pide el CAPI (Paso 3).
2. **Centro de seguridad → Verificación del negocio → subir documentos:**
   - Doc 1: **NIT** (documento de exhibición SIAT).
   - Doc 2: **matrícula de comercio SEPREC** (muestra el nombre comercial ONIA + dirección).
3. **Tipo de negocio:** el que corresponda a **unipersonal / propietario único** (NO S.R.L.).
4. ⚠️ **Nombre que coincide** (motivo #1 de rechazo): el nombre del portfolio debe
   matchear el documento. Para verificar como **"ONIA"**, el nombre comercial ONIA tiene
   que estar en la matrícula. Si Meta exige la razón social, será "Leslie Mercado Moreno"
   con ONIA como marca visible.
5. Enviar y esperar aprobación (horas a días).

**Desbloquea:** ads sin tope + Marketing API sin límites + **WhatsApp API**.

---

## Paso 2 — WhatsApp Business API (después de verificar)
Patrón ONIA (caso real Bolivian Electric):
`WhatsApp → Meta/WhatsApp Business Platform → Chatwoot Cloud → n8n`.

1. En la app (ONIA Marketing API, o una dedicada) → agregar **producto WhatsApp**.
2. Crear **WABA** + **número de teléfono** (no usado antes en WhatsApp, que reciba el OTP).
3. Conectar vía **Chatwoot Cloud**: Settings → Inboxes → Add Inbox → WhatsApp →
   "Connect with WhatsApp Business".
4. Token con scopes `whatsapp_business_management` + `whatsapp_business_messaging`.

Ref: `BOLIVIAN_ELECTRIC_META_WHATSAPP_CASE_20260627.md`.

---

## Paso 3 — CAPI token (cierra la medición de conversiones)
1. Con el **email del negocio** ya cargado (Paso 1), ir a **Events Manager → dataset
   "ONIA Web" (`1012611478191231`) → Configuración → "Configurar integración directa"**
   → **"Generar token de acceso"** (ahora sí sale, ya no falla por el email).
2. Copiar el **CAPI token**.
3. En el VPS: `bash /opt/onia/meta-ads/set-secrets.sh` → pegar en `META_CAPI_TOKEN`.

---

## Caveats (importante)
- La **entidad legal es la unipersonal** (Leslie Mercado Moreno); **ONIA es marca /
  nombre comercial**. Si ONIA crece fuerte, el próximo escalón es una **SRL** (persona
  jurídica propia) — pero eso es después.
- Confirmar el **nombre comercial "ONIA"** en la matrícula con **contador matriculado**
  — de eso depende poder verificar como ONIA en vez de como la persona.

## Freno de gasto (recordatorio)
Nada de esto activa pauta. Verificar + WhatsApp **no gastan**. Prender campañas con
presupuesto = **decisión explícita de Sergio**, aparte.
