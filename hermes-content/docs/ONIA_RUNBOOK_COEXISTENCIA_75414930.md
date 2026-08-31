# Runbook — Traslado del 75414930 a coexistencia (Cloud API + app WhatsApp Business)

> Fuente de verdad del procedimiento. Sin fecha en el nombre: se EDITA acá.
> **GATE: NO ejecutar sin el OK explícito de Sergio ("vamos con A") y ventana acordada.**
> Decisión Sergio 2026-08-29: Opción A — ensayo primero con chip nuevo, después el oficial.

## Qué es la coexistencia (verificado en doc oficial de Meta, 2026-08-28)

Un mismo número atendido a la vez por la **app WhatsApp Business** (el teléfono de
Sergio) y por la **Cloud API** (nuestro bot). Los mensajes llegan a ambos; el bot
contesta lo suyo y Sergio puede intervenir desde el teléfono. Existe y está vigente;
requisitos duros de Meta:

- App WhatsApp Business **≥ 2.24.17** en el teléfono.
- El flujo NACE **desde la app** (escaneo de QR que muestra nuestro popup de
  Embedded Signup) — no hay botón "activar coexistencia" en el panel web de Meta.
- El número tiene que estar **en la app** al momento de conectar. El 75414930 hoy
  está al revés: registrado **API-first** (Cloud API puro, sin app). Por eso el
  traslado tiene un paso previo: sacarlo de Cloud API y meterlo en la app.
- País soportado (Bolivia sí; la exclusión es UE/UK/Japón/Corea/India/otros).
- Historial: la app puede subir el historial de chats reciente al conectar
  (opcional en el flujo).

## Estado actual del número (mirado en el panel Meta con nuestros datos, 2026-08-28)

| Dato | Valor |
|---|---|
| Número | +591 75414930 — número oficial de Onia |
| WABA | "Onia" — Conectado, calidad Alta |
| Registro | Cloud API (API-first), SIN app |
| Mensajería | 1 mensaje Marketing pago reciente ⇒ **prohibido borrar el número del WABA por 30 días** (regla de Meta). El traslado NO borra nada: `deregister` ≠ eliminar |
| Verificación en dos pasos (PIN) | **ACTIVA** — el PIN es imprescindible para el rollback |
| Embedded Signup | Config "Onia Embedded Signup" ID 1824225392073753, dominio chat.onia.com.bo, feature flag de cuenta encendido |

## Pre-requisitos (checklist antes de la ventana)

- [ ] OK explícito de Sergio + ventana acordada (el bot del 75414930 queda MUDO
      durante el traslado; presupuestar 30-60 min, puede ser menos).
- [ ] **PIN de dos pasos A MANO** (sin él no hay register de vuelta; resetearlo
      por Meta tarda días). Si no se conoce: resetearlo ANTES de empezar.
- [ ] Chip 75414930 en un teléfono que reciba **SMS o llamada** (verificación).
- [ ] App WhatsApp Business instalada y actualizada (≥ 2.24.17) en ese teléfono.
- [ ] Ensayo con chip nuevo YA PASADO (Opción A): popup probado punta a punta,
      inbox creado solo en Chatwoot cuenta 2, bot colgado, "hola" contestado.
- [ ] Backup del estado: anotar `phone_number_id` actual y verificar webhook
      (los tokens quedan server-side; nunca en chat ni en este doc).

## Procedimiento (en la ventana)

1. **Avisar inicio.** Bot mudo desde acá.
2. **Deregister de Cloud API** (Graph API, token server-side):
   `POST /v21.0/{phone_number_id}/deregister`
   Esto lo saca del registro de Cloud API. NO lo borra del WABA, no toca la
   verificación del negocio ni el historial de la WABA.
3. **Meter el número en la app**: WhatsApp Business en el teléfono → registrar
   +591 75414930 → verificación por SMS/llamada al chip → si pide el PIN de dos
   pasos, ingresarlo. Si la app dice "número en uso por la API": esperar la
   propagación del deregister (minutos; se ha visto hasta horas) y reintentar.
4. **Conectar coexistencia**: abrir nuestro popup de Embedded Signup
   (chat.onia.com.bo) → elegir la ruta "usar mi número de la app" → el popup
   muestra un **QR** → en el teléfono: WhatsApp Business → Ajustes → Dispositivos
   vinculados (flujo de coexistencia) → escanear el QR → aceptar (opcional:
   compartir historial).
5. **Verificar el alta automática**: el flujo crea el inbox WhatsApp en Chatwoot
   cuenta 2 (nuestros InstallationConfigs del Embedded Signup). Colgar el agent
   bot (user 3) al inbox nuevo si el alta 1-click no lo hizo.
6. **Prueba MIRANDO**: mandar "hola" desde otro número → el bot contesta → la
   conversación aparece en Chatwoot → y el teléfono de Sergio también la ve.
7. **Cerrar**: avisar fin de ventana; watchdog y health en verde.

## Rollback (si algo falla en 3-4)

- El número NO se perdió: sigue en el WABA.
- **Volver a Cloud API**: `POST /v21.0/{phone_number_id}/register` con `pin`
  (el de dos pasos). El webhook y la config previa siguen; el bot vuelve a
  contestar como antes del traslado.
- Si la app ya lo capturó y falla el paso 4 (QR): reintentar el escaneo; la app
  puede seguir atendiendo manual mientras tanto (peor caso: bot mudo, humano vivo).
- Nunca tocar "Eliminar número" en el panel (regla 30 días con mensajes pagos).

## Después del traslado

- La ventana de 24h y los precios por conversación siguen igual (los cobra Meta
  a la cuenta del cliente/nuestra según el caso).
- Limitación conocida de coexistencia: campañas/plantillas salen por la API;
  la app no ve todo lo de la API (etiquetas propias, etc.). El teléfono es para
  intervenir conversaciones, no para administrar el bot.
