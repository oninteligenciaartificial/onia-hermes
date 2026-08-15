# Guía de registros — SIAT, Meta y demás (2026-08-06)

> Pedido de Sergio: "dime cómo registrar lo del NIT/SIAT y lo de Meta y demás".
> Investigado con fuentes primarias el 2026-08-06 + estado REAL de la app Meta
> inspeccionado en vivo vía Meta Developer Tools. Lo no confirmado queda marcado.

## 0. Los dos hallazgos que cambian el mapa

1. **La verificación del negocio en Meta (S5) YA ESTÁ APROBADA** — verificado en vivo:
   `business_verification_passes: true` en la app "Onia Bot" (1078962684709749). El único
   requisito en rojo era `has_privacy_policy: false` → las URLs se publicaron hoy.
2. **ADSIB YA NO EXISTE** (DS 5519, ene-2026): la firma digital ahora la emite **AGETIC**
   (firmadigital.bo). Los certificados previos siguen vigentes. Cualquier doc interno que
   diga "ADSIB" está desactualizado.

También corregido: el plazo **30-sep-2026** de los grupos 9°-12° viene de la
**RND 102600000007 (25-mar-2026)**; la RND 102500000036 solo había ampliado a 31-mar-2026.

---

## 1. META — publicar "Onia Bot" y atender clientes reales

### Estado real de la app (inspección en vivo 2026-08-06)

| Campo | Estado |
|---|---|
| app_status | `dev_mode` (is_live: false) |
| Business verification | ✅ **APROBADA** |
| privacy_policy_url / terms / data_deletion | ❌ vacíos (las URLs ya existen) |
| contact_email business@onia.com.bo | ❌ sin verificar |
| App icon | ❌ falta (PNG 1024 ya entregado a Sergio) |
| Compliance | ✅ compliant, 0 violaciones |
| App Review | sin submission — **no hace falta para uso propio** |

### Fase A — el bot propio en vivo (los 4 clics de Sergio)

1. [App Settings → Basic](https://developers.facebook.com/apps/1078962684709749/settings/basic/):
   Privacy `https://onia.com.bo/privacidad` · Terms `https://onia.com.bo/terminos` ·
   Data deletion (instructions URL) `https://onia.com.bo/privacidad#eliminacion-de-datos` ·
   ícono 1024 · categoría **Business**.
2. Verificar el correo `business@onia.com.bo` (Meta manda confirmación desde esa pantalla).
3. Toggle **Development → Live** arriba del dashboard.
4. WhatsApp Manager: display name **"Onia"** (capitalización normal, no "ONIA";
   4 caracteres pasa el mínimo; con web+IG de respaldo es aprobable).

Con eso: clientes reales sin lista de prueba. **Standard Access alcanza** para el WABA
propio — Advanced Access/App Review es solo para tocar WABAs ajenos
([Get Started oficial](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started)).

### Límites de mensajería (escala ACTUAL, cambió)

**250 → 2.000 → 10.000 → 100.000 → ilimitado** contactos iniciados/24h, compartidos a
nivel portfolio. Con la verificación aprobada, Onia pasa directo a **2.000/día**. De ahí
sube AUTOMÁTICO: calidad alta + usar ≥50% del límite en 7 días → sube un nivel en ~6h
([Messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)).

### Pricing (cambió jul-2025: por MENSAJE de plantilla, no por conversación)

- **Respuestas dentro de la ventana de servicio de 24h: GRATIS** → el chatbot de Onia
  opera casi a costo cero de Meta.
- Plantillas salientes (Bolivia = "Rest of Latin America", dato de tercero a verificar
  en el [rate card](https://business.whatsapp.com/products/platform-pricing)):
  marketing ~US$0,074 · utility ~US$0,0113 · auth ~US$0,0113 por mensaje entregado.

### Fase B — Tech Provider (números de los CLIENTES, S6 de verdad)

NO hace falta ser Solution Partner ni credit line: en el programa **Tech Provider** cada
cliente pone SU método de pago y Meta le cobra directo — encaja con "Onia vende software"
([overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/overview)).
Pasos: (1) grabar 2 screencasts (envío de mensaje vía API + creación de plantilla; vale
hacerlo con API Setup/cURL o WhatsApp Manager) → (2) App Review pidiendo **Advanced
Access** a `whatsapp_business_messaging` + `whatsapp_business_management` → (3) **Access
Verification** (Settings → Basic → Start; ~5 días hábiles) → (4) implementar **Embedded
Signup** en la web (el cliente conecta su número solo; Onia recibe WABA ID + token) →
límite de onboarding sube de 10 a **200 clientes/semana**.
Guía: [Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers).

### Higiene de coherencia (previene problemas futuros de verificación)

- Business Manager → Business Information: nombre legal EXACTO **"OniaAgency"**.
- Agregar en el footer o página legal de onia.com.bo: "OniaAgency — Matrícula de
  Comercio 5371375010 — NIT 5371375010". [PROPUESTO, no ejecutado]
- Verificación de dominio (TXT en DNS): Business Manager → Brand Safety → Domains.

---

## 2. SIAT — homologar el sistema de facturación de Onia

**Marco: RND 102100000011 (11-ago-2021).** Onia se autoriza como sistema **tipo
PROVEEDOR** — se homologa UNA vez a nombre de Onia; cada cliente factura con SU NIT vía
**Asociación de Sistemas** (el cliente confirma en su oficina virtual + corre su piloto).

### Modalidades (la diferencia clave)

| Modalidad | Firma digital | Para quién |
|---|---|---|
| **Computarizada en Línea** | ❌ NO exige (credenciales + hash) | onboarding rápido de clientes |
| **Electrónica en Línea** | ✅ exige certificado (ahora AGETIC) | quien la tenga asignada |
| Portal Web | — | el gratuito del SIN (regla del pitch: mencionarlo primero) |

Homologar para **AMBAS**. Cada cliente 9°-12° tiene una modalidad ASIGNADA por RND
(102400000004/05/12/25) — consultarla con su NIT antes de prometer.

### El proceso (3 fases, sin plazos oficiales publicados)

1. **Registro del sistema**: [siat.impuestos.gob.bo/launcher](https://siat.impuestos.gob.bo/launcher/)
   → "Autorización de Sistemas Informáticos de Facturación" → "Nuevo Sistema" → tipo
   Proveedor + ambas modalidades + documentos sector. Genera el **código de sistema** y
   habilita el piloto ([pilotosiat.impuestos.gob.bo](https://pilotosiat.impuestos.gob.bo/)).
   ⚠️ WEB y API se autorizan POR SEPARADO.
2. **Fase 1 — pruebas mínimas** (scripteables): 11 etapas con volúmenes duros — CUIS ×2,
   catálogos ×50, CUFD ×100, **500 emisiones**, eventos ×5, contingencia ×10, **250
   anulaciones**, firma ×250 (solo electrónica), masivo ×10, **98 reversiones**
   ([detalle oficial](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/pruebas-para-la-autorizacion-del-sistema-de-facturacion/fase-i-pruebas)).
   Un proveedor debe implementar TODAS las funcionalidades (contingencia incluida).
3. **Fase 2 — inspección del SIN** (física o virtual, 3 oportunidades) → el cuello de
   botella real de calendario.
4. **Fase 3 — piloto por cliente** (asociación → confirmación → token delegado → pruebas
   → **Solicitud de Inicio de Facturación**, declaración jurada). Recién ahí el cliente
   emite en producción.

**Vigencia: 3 años**, renovable ANTES del vencimiento (si vence, el código muere).

### Firma digital (para la modalidad Electrónica)

- Ya NO es ADSIB → **AGETIC**: [solicitud.firmadigital.bo](https://solicitud.firmadigital.bo/login) ·
  tel. 2184026 · soporte@agetic.gob.bo. Existe certificado específico "para Facturación
  Electrónica" almacenable **en software** (clave para firmar server-side en el SaaS).
- Última referencia de precio: Bs 70 certificado + Bs 175 token (promo ADSIB 2024) —
  **tarifario AGETIC 2026 sin publicar, confirmar por teléfono**.
- Para la Fase 1 el SIN da un certificado de PRUEBA (CSR según parámetros AGETIC,
  enviado por correo al SIN).
- ⚠️ El trámite jurídico lo firma la titular (Leslie Mercado Moreno) o apoderado.

### Calendario contra la ola del 1-oct-2026

Desde el **01-oct-2026** los grupos 9°-12° solo pueden emitir por su modalidad en línea
asignada (RND 102600000007). Cada cliente paga SU ciclo de asociación + piloto después
de que Onia esté autorizada → **meta interna: autorización cerrada en agosto**.
Estimación prudente del trámite completo: 2-3 meses (estimación propia — el SIN no
publica plazos).

### Checklist de Sergio esta semana (SIAT)

1. Entrar al [launcher SIAT](https://siat.impuestos.gob.bo/launcher/) con las
   credenciales de Onia → verificar NIT 5371375010 sin marcas de control (10 min).
2. **Registrar el sistema** (Nuevo Sistema → Proveedor → ambas modalidades) — esto
   desbloquea TODO el desarrollo contra el piloto.
3. Llamar a AGETIC (2184026): precio 2026 del certificado jurídico en software.
4. Consultar la modalidad asignada de 2-3 clientes objetivo con su NIT.
5. Pasarme el código de sistema y los parámetros del piloto → yo armo la suite
   automatizada de la Fase 1 (los volúmenes se scriptean).

---

## 3. Y demás — el resto de registros pendientes

| Registro | Estado | Próximo paso |
|---|---|---|
| **BCP pasarela** (reemplaza el QR estático, decisión 2026-08-06) | Reunión hecha | Esperar credenciales/sandbox del banco → integrar QR dinámico + webhook (slot ya listo en el checkout). Interim propuesto: bloque "te mandamos el QR por WhatsApp" |
| **SENAPI marca "Onia"** | Pendiente | P0 barato: búsqueda de antecedentes PI-112 (Bs 75) ANTES de gastar en más marca; luego registro de marca MIXTA clase 42 (memoria [[onia-marca-registro-senapi]]) |
| **Declaraciones NIT** | Vencimiento día 13 de cada mes | Pendiente interna del contador (memoria [[onia-contador-fiscal]]) |
| **Conector n8n Claude** | ✅ reconectado 2026-08-06 | — |
| Verificación de dominio en Meta | Recomendada | TXT en DNS (Brand Safety → Domains) |

### Errores comunes que atrasan la homologación (integradores bolivianos)

CUF mal generado (módulo 11 + base 16, orden exacto de campos) · CUFD caduca cada 24h
(sincronización automática obligatoria) · contingencia offline mal diseñada · XML por
documento sector · clientes sin homologación de productos (códigos SIN) · autorizar solo
WEB o solo API · dejar vencer los 3 años.

---

**Fuentes completas** en los informes de origen (mismo día): investigación SIAT (RND
102100000011 vía Lexivox, PDF oficial RND 102500000036, nota de prensa SIN RND
102600000007, siatinfo/siatanexo, gob.bo/AGETIC, DS 5519 en prensa) e investigación
Meta (developers.facebook.com rutas nuevas /documentation/business-messaging/, docs de
BSPs marcadas como terceros). Verificación en vivo de la app vía Meta Developer Tools MCP.
