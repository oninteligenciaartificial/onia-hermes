# Cola — carril recorrido de cliente

Estado del carril: [`../recorrido/ULTIMO_RECORRIDO.md`](../recorrido/ULTIMO_RECORRIDO.md).
Instrumento: `scripts/recorrido_cliente.mjs`.

> Antes de trabajar un ítem de acá, **reproducilo en vivo**. Medido en este repo: entre el 25 %
> y el 46 % de lo que las colas declaraban pendiente ya no existía.

## Abierto

### 1. Completar el onboarding para que los pasos 6, 7 y 8 se midan por primera vez

**Es el único muro que queda.** El recorrido llega al paso 4 (entra a la plataforma) y ahí el
producto lo encierra en `/onboarding`: mientras no esté terminado, `/patients`, `/billing` y
`/dashboard` **redirigen las tres al onboarding**. Existen en el build, pero este carril
**nunca las vio renderizadas**.

Qué hay que escribir en el paso 5 de `scripts/recorrido_cliente.mjs`: llenar "Nombre del
negocio" (ya viene con `zz-qa-...`) y apretar **"Buscar mi negocio"** — o mejor el enlace
*"¿Preferís cargar todo a mano? Completar el formulario"*, que no depende de una búsqueda
externa. Pantalla exacta: `../recorrido/capturas/paso-07-cobro.png` (la foto es del onboarding,
no del cobro: **eso era el falso verde**).

Reproducción, 30 segundos:

    node scripts/recorrido_cliente.mjs --escribir     # crea la cuenta zz-qa- y frena en el paso 4

⚠️ Con la cuenta recién creada **el paso 4 rebota a propósito**: el alta manda correo de
confirmación y sin confirmar no se entra (`email_not_confirmed`, comprobado en el log de
`supabase-auth2`). Para seguir hay que confirmar **la fila `zz-qa-` y sólo esa**:

    docker exec -i supabase-db psql -U postgres -d postgres \
      -c "update auth.users set email_confirmed_at=now() where email like 'zz-qa-%';"

(`confirmed_at` es columna generada: no se puede tocar y devuelve error. Es esperado.)

⚠️ **Todo esto escribe en la base de PRODUCCIÓN** (`supabase-db` del VPS, schema `public`).
Reglas que no se negocian:

- Todo con prefijo `zz-qa-` (el script ya lo hace: `zz-qa-<fecha>@onia.com.bo`).
- **Se borra en la MISMA vuelta**, imprimiendo la fila ANTES de borrarla.
- **Ningún `DELETE` sin `zz-qa-` en el `WHERE`.** Nunca por rango ni por fecha. En
  `access_requests` viven 3 solicitudes reales.
- **`docker exec` va con `-i`.** Sin `-i` el heredoc nunca llega a psql: **no borra nada y no
  da error**, el comando parece exitoso. Pasó el 2026-09-03. Contar las filas después de borrar.
- **Jamás se completa un pago.** Paso 7: se mira la pantalla de cobro, se captura y se FRENA.

Un alta crea **cinco** filas y las cinco hay que deshacerlas (medido el 2026-09-03):
`auth.users`, `auth.identities`, `organizations`, `profiles`, `organization_entitlements`.

### 2. El mismo recorrido con otro rubro

El alta ofrece cinco: clínica dental, comercio/tienda, importadora/distribuidora, estética y
spa, servicios profesionales. El script ya acepta `RECORRIDO_RUBRO="Comercio / tienda"`.
Un rubro encendido que rompe el onboarding es justo el fallo que no ve nadie. Depende del ítem 1.

## Cerrado

- **Crear una cuenta `zz-qa-` de verdad y ver hasta dónde llega** — hecho el 2026-09-03. El alta
  **funciona entera**: crea `auth.users` + `organizations` + `profiles` (ADMIN) + entitlement
  `module.agents` en trial por 14 días, y **manda el correo de confirmación de verdad**
  (`status=sent (250 2.0.0 Ok)` en el log de `onia-mail`, con DKIM). Las cinco filas se borraron
  en la misma vuelta; producción volvió a 4 orgs / 6 perfiles. Detalle en `ULTIMO_RECORRIDO.md`.
- **El falso verde del instrumento** — el script cantaba `RECORRIDO COMPLETO: los 8 pasos` porque
  los pasos 5-8 se daban por buenos con un 200, sin mirar que el producto redirigía las cuatro
  rutas al onboarding. Arreglado con `llegar()`, que compara la URL de llegada con la pedida.

## Reportado a otro carril

- **La documentación miente sobre el alta** — `CLAUDE.md` y los prompts de loop dan por cerrado
  el alta ("`/register` dejó de crear cuentas, `/empezar` es un formulario de «Pedí tu
  acceso»"). Medido el 2026-09-02: `/empezar` tiene **0 campos** y `/register` es un asistente
  vivo de 2 pasos que crea cuentas. Prueba: `../recorrido/capturas/paso-03-pedir-acceso.png`.
  Reproducción: `node scripts/recorrido_cliente.mjs` y mirar el paso 2 del `resumen.json`.
  → carril docs/auditoría. Anotado en el tablero.
