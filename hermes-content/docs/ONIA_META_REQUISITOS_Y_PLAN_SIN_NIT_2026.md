# ONIA — Requisitos Meta (ads / WhatsApp / verificación) y plan sin NIT

Fecha: 2026-07-06. Investigación para decidir qué se puede montar **ya** en el
Meta de ONIA (portfolio "OnIA Agency", Business ID `1451773736711697`) sin tener
todavía NIT/registro de empresa, y qué espera a tenerlo.

> Complementa el runbook `ONIA_META_SETUP_Y_ADS_RUNBOOK.md` y el motor en
> `hermes-content/integrations/meta/`. Caso real de referencia:
> `BOLIVIAN_ELECTRIC_META_WHATSAPP_CASE_20260627.md`.

## TL;DR

- **Ads: NO necesita NIT ni verificación para arrancar.** Cuenta nueva sin
  verificar corre igual, solo con **tope bajo (~USD 25–50/día)** que sube con
  historial de pago. Verificar **quita el tope**.
- **WhatsApp Business API (chatbot que responde): SÍ necesita verificación** para
  producción/escala → necesita NIT. El **botón wa.me** (click-to-chat) de la
  landing funciona **gratis, sin nada de esto**.
- **Verificar el negocio = necesita NIT/registro.** Es el "desbloqueo grande"
  (quita topes de ads + habilita WhatsApp API + sube límites de la Marketing API).

## Qué necesita NIT/verificación vs qué no

| Cosa | ¿Necesita NIT/verificación? | Detalle |
|------|------------------------------|---------|
| Crear cuenta publicitaria | **No** | Se crea en el Business Manager sin verificar |
| Correr ads (presupuesto chico) | **No** | Tope ~USD 25–50/día al inicio; sube pagando puntual |
| System user + token long-lived | **No** | Función del Business Manager, no pide verificación |
| Pixel + Conversions API | **No** | Se crea y se instala en la landing sin verificar |
| Botón WhatsApp wa.me en la web | **No** | Es un link, va incluido gratis en la web |
| Subir topes de gasto / escalar ads | **Sí** | Verificar quita el hard cap |
| WhatsApp Business API (bot real) | **Sí (producción)** | Portfolio nuevo capado a 2 números hasta verificar; escala/def. name piden verificación |
| Marketing API acceso estándar/avanzado | **Sí (según feature)** | Operar activos de terceros / features avanzadas |

## Ads sin verificación — límites reales (2026)

- Cuenta **nueva sin verificar**: capacidad de gasto se estabiliza en **~USD
  25–50/día**. Con historial de pago puntual sube a **USD 750+**.
- Meta cobra por **umbral** (gastás hasta el umbral → te cobra → sube el umbral).
- **Verificar el negocio** esencialmente **remueve el tope**.
- **Conclusión ONIA:** para un test de Bs.35–70/día (mi tier de prueba) **alcanza
  de sobra sin verificar**. Verificamos cuando querramos escalar.

## WhatsApp — el camino (y por qué espera al NIT)

- Necesita un **portfolio de Meta** (lo tenemos) y **verificación del negocio**
  para que Meta valide la empresa. Portfolio nuevo **capado a 2 números** hasta
  verificar (luego 20).
- El número a registrar **no** puede haber estado antes en WhatsApp, y debe poder
  recibir el código.
- **Cómo lo hacemos para clientes** (caso Bolivian Electric):
  `WhatsApp → Meta/WhatsApp Business Platform → Chatwoot Cloud dedicado →
  /api/chatwoot/webhook → n8n → CRM/handoff`.
- **Dato clave del caso BE:** hasta una empresa **registrada** como Bolivian Group
  S.R.L. **tuvo que pasar verificación** para avanzar a WhatsApp Cloud API. ONIA
  (sin NIT) todavía no puede replicar ese tramo. El botón wa.me sí, ya.

## Bolivia → Meta (aprendizajes del caso BE)

- Para una **S.R.L. boliviana**, en Meta elegir tipo **"Empresa privada"**
  (equivalente más cercano a LLC). Evitar "cotiza en bolsa", "unipersonal",
  "institución".
- El **nombre del portfolio** debe ser la **empresa legal**, no una persona.
- El **email de verificación** debe ser un correo real **del dominio**
  (`algo@onia.com.bo`), no `@dominio` suelto.
- Si Meta pide **identidad personal**, el documento es de la persona logueada,
  foto original y legible **≥ 1500×1000 px**, no comprimida por WhatsApp.
- **Nunca** subir/circular NIT, carnets, códigos, contraseñas ni tokens por chat
  o repo.

## Qué necesita ONIA para verificar (cuando tenga el NIT)

1. Registro de la empresa (SIN/NIT) — pendiente fiscal de Sergio (S2/S8).
2. Nombre legal + dirección + teléfono + **email del dominio** cargados en el
   portfolio.
3. Documento de registro (NIT/constitución) para subir en el flujo de
   verificación (Centro de seguridad → Ver detalles).
4. Tipo de negocio: **Empresa privada**.

## Plan ONIA — hacer AHORA (sin NIT)

1. **Llenar info del negocio** con lo operativo: nombre `ONIA` (u `OnIA Agency`),
   contacto de Sergio, sitio `onia.com.bo`, email del dominio. (La subida del NIT
   es un paso aparte, después.)
2. **Crear la cuenta publicitaria** "ONIA Ads" (TZ `America/La_Paz`; moneda a
   definir USD/BOB; **sin método de pago** = freno de gasto).
3. **Crear system user** `onia-ads-bot` + generar **token long-lived** + copiar
   **App Secret** + confirmar **Marketing API** en la app.
4. **Pixel web + token CAPI** (elegir/crear dataset "ONIA Web").
5. Correr una **primera campaña chica en BORRADOR** con el motor (cero gasto hasta
   que Sergio apruebe).
6. **Botón wa.me** en la landing desde ya (gratis).

## Plan ONIA — cuando haya NIT

7. Cargar NIT + verificar el negocio (Empresa privada) → sube topes de ads.
8. WhatsApp: WABA + número + Chatwoot Cloud (patrón BE) → chatbot de calificación.

## Fuentes (web, 2026-07-06)

- Meta Business Help — Ad Account Spending Limits:
  https://www.facebook.com/business/help/141820733085330
- Meta Business Help — Daily Spending Limits:
  https://www.facebook.com/business/help/563129151097553
- Meta for Developers — WhatsApp Business phone numbers:
  https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers
- Meta for Developers — WhatsApp Business Accounts (WABA):
  https://developers.facebook.com/documentation/business-messaging/whatsapp/whatsapp-business-accounts
