# Cola — carril recorrido de cliente

Estado del carril: [`../recorrido/ULTIMO_RECORRIDO.md`](../recorrido/ULTIMO_RECORRIDO.md).
Instrumento: `scripts/recorrido_cliente.mjs`.

> Antes de trabajar un ítem de acá, **reproducilo en vivo**. Medido en este repo: entre el 25 %
> y el 46 % de lo que las colas declaraban pendiente ya no existía.

## Abierto

### 1. Crear UNA cuenta `zz-qa-` de verdad y llegar hasta el cobro

El paso 3 está verificado hasta el botón "Crear mi cuenta — 14 días gratis", pero **nunca se
apretó**. Los pasos 4 a 8 no se ejecutaron nunca: sus rutas (`/onboarding`, `/patients`,
`/billing`, `/dashboard`) son **supuestas**, no medidas.

Cómo se reproduce, y es la vuelta entera:

    node scripts/recorrido_cliente.mjs --escribir

⚠️ **Eso escribe en la base de PRODUCCIÓN** (`supabase-db` del VPS, schema `public`) y crea
usuario + organización. Reglas que no se negocian, del prompt del carril:

- Todo con prefijo `zz-qa-` (el script ya lo hace: `zz-qa-<fecha>@onia.com.bo`).
- **Se borra en la MISMA vuelta**, imprimiendo la fila ANTES de borrarla y pegando esa salida
  en `ULTIMO_RECORRIDO.md`.
- **Ningún `DELETE` sin `zz-qa-` en el `WHERE`.** Nunca por rango ni por fecha. En
  `access_requests` vive el único lead real que entró por Instagram.
- **Jamás se completa un pago.** Paso 7: se mira la pantalla de cobro, se captura y se FRENA.

Antes de correrlo hay que saber **qué tablas toca un alta** (usuario de Supabase Auth,
`organizations`, `profiles`, `clinic_settings`, `organization_entitlements`), porque el borrado
tiene que deshacerlas todas o dejar anotado el id exacto de lo que quedó.

### 2. El mismo recorrido con otro rubro

El alta ofrece cinco: clínica dental, comercio/tienda, importadora/distribuidora, estética y
spa, servicios profesionales. El script ya acepta `RECORRIDO_RUBRO="Comercio / tienda"`.
Un rubro encendido que rompe el onboarding es justo el fallo que no ve nadie. Depende del ítem 1.

## Reportado a otro carril

- **La documentación miente sobre el alta** — `CLAUDE.md` y los prompts de loop dan por cerrado
  el alta ("`/register` dejó de crear cuentas, `/empezar` es un formulario de «Pedí tu
  acceso»"). Medido el 2026-09-02: `/empezar` tiene **0 campos** y `/register` es un asistente
  vivo de 2 pasos que crea cuentas. Prueba: `../recorrido/capturas/paso-03-pedir-acceso.png`.
  Reproducción: `node scripts/recorrido_cliente.mjs` y mirar el paso 2 del `resumen.json`.
  → carril docs/auditoría. Anotado en el tablero.
