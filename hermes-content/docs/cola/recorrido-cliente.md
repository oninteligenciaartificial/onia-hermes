# Cola — carril recorrido de cliente

Estado del carril: [`../recorrido/ULTIMO_RECORRIDO.md`](../recorrido/ULTIMO_RECORRIDO.md).
Instrumento: `scripts/recorrido_cliente.mjs`.

> Antes de trabajar un ítem de acá, **reproducilo en vivo**. Medido en este repo: entre el 25 %
> y el 46 % de lo que las colas declaraban pendiente ya no existía.

## Abierto

### 1. Faltan TRES rubros de los cinco que ofrece el alta

Cerrado comercio (abajo), queda: **importadora/distribuidora, estética y spa, servicios
profesionales**. Se corren igual, cambiando la variable:

    RECORRIDO_RUBRO='Estética y spa' node scripts/recorrido_cliente.mjs --escribir

El instrumento ya no está atado a dental: descubre la pantalla del dato y la del cobro **del
menú** que el producto le muestra a ese rubro. Lo que hay que mirar en cada uno es si
`pantallaDelDato()` acierta — el mapa de `PORRUBRO` tiene patrones para los cinco, pero sólo dos
se ejercitaron. Si ninguno matchea, el paso 6 sale rojo con el menú completo en el detalle, que
es el dato que sirve para decidir si falta la pantalla o falta el mapa.

⚠️ **Y hay que limpiar según el rubro.** Comercio deja fila en `onia_commerce_products` **y** en
`onia_commerce_product_variants`; dental en `patients`. Un borrado escrito para un rubro deja
basura del otro.

### 2. El paso 7 mira el cobro vacío: nunca hubo una factura que cobrar

`/billing` se ve entera (`../recorrido/capturas/paso-07-cobro.png`) y dice *"0 facturas ·
Cobrado Bs 0,00"*. Es una pantalla de cobro **sin nada que cobrar**: el botón "Nueva Factura"
existe y se ve, pero el recorrido nunca comprueba que el cobro **funcione** — sólo que la
pantalla abra.

El escalón siguiente es crear una factura `zz-qa-` para el paciente `zz-qa-` del paso 6 y llegar
hasta la pantalla que pide la plata. **Y ahí se FRENA**: nunca se completa un pago, no se escanea
un QR, no se confirma una transferencia. Que el botón exista y la pantalla se vea es todo lo que
hay que reportar. Ojo con los precios: los que muestre la pantalla se **comparan** contra
`onia-platform/lib/subscription-plans.ts` y `lib/pricing.ts`; una diferencia es un hallazgo, no
una licencia para corregir nada.

## Cerrado

- **El recorrido entero en COMERCIO, el segundo rubro** — cerrado el 2026-09-03 16:14 UTC, 8 de 8
  (`RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir`). Producto
  cargado en Catálogo, encontrado de vuelta en la lista y visible en el panel; capturas miradas
  una por una. En el camino se cazó un **falso rojo del propio instrumento**: `despejar()` cerraba
  el modal de alta —su botón de cancelar se llama «Cerrar», igual que el del tour— y el relleno
  terminaba escribiendo en el buscador de la lista, así que el informe acusaba al producto de no
  tener botón de guardar teniéndolo. Detalle y evidencia en `../recorrido/ULTIMO_RECORRIDO.md`.

- **Los pasos 6, 7 y 8 cantaban "pantalla a la vista" sobre una pantalla TAPADA** — cerrado el
  2026-09-03. El modal "Primeros pasos" (`fixed inset-0 z-[60]`, el 100 % del viewport) cubría
  `/patients` y `/billing`, y `llegar()` daba OK porque sólo comparaba la URL. Ahora
  `despejar()` cierra el overlay con el botón del propio producto ("Cerrar por ahora") y
  `queTapa()` mide lo que quede cubriendo ≥50 %; `llegar()` exige URL correcta **y** pantalla
  visible. Prueba: `../recorrido/capturas/paso-07-cobro.png`, que por primera vez muestra
  Facturación y no el modal.
- **El paso 6 no CARGABA ningún dato** — cerrado el 2026-09-03. Ahora crea el paciente
  `zz-qa-<fecha>-paciente` por el camino que ofrece la pantalla (`<a href="/patients/new">`) y
  **vuelve a la lista a buscarlo**. La lista dice "1 paciente". Prueba:
  `../recorrido/capturas/paso-06c-dato-en-la-lista.png`. Con eso el paso 8 tiene por primera vez
  algo que buscar: reporta que el paciente **no** figura en `/dashboard` y que eso no es un fallo
  (el panel no lista pacientes), pero cortaría en rojo si no apareciera en ninguna de las dos.
- **Completar el onboarding para medir los pasos 6, 7 y 8** — hecho el 2026-09-03. El instrumento
  ya camina el asistente entero (pregunta → negocio → horarios → servicios → equipo → listo) y el
  **recorrido llegó a los 8 pasos por primera vez**. La verificación no es haber apretado los
  botones: es que `/dashboard` deje de rebotar, y en la base `onboardingCompletedAt` quedó con
  hora. `/patients`, `/billing` y `/dashboard` fueron vistas renderizadas por primera vez.
- **Crear una cuenta `zz-qa-` de verdad y ver hasta dónde llega** — hecho el 2026-09-03. El alta
  **funciona entera**: crea `auth.users` + `organizations` + `profiles` (ADMIN) + entitlement
  `module.agents` en trial por 14 días, y **manda el correo de confirmación de verdad**
  (`status=sent (250 2.0.0 Ok)` en el log de `onia-mail`, con DKIM). Las filas se borraron en la
  misma vuelta; producción volvió a 4 orgs / 6 perfiles. Detalle en `ULTIMO_RECORRIDO.md`.
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

## Procedimiento vigente para correr el recorrido entero

Son **DOS corridas**, y no se puede evitar:

    node scripts/recorrido_cliente.mjs --escribir     # crea la cuenta zz-qa- y frena en el paso 4

⚠️ Con la cuenta recién creada **el paso 4 rebota a propósito**: el alta manda correo de
confirmación y sin confirmar no se entra (`email_not_confirmed`). Para seguir hay que confirmar
**la fila `zz-qa-` y sólo esa**:

    docker exec -i supabase-db psql -U postgres -d postgres \
      -c "update auth.users set email_confirmed_at=now() where email like 'zz-qa-%';"

(`confirmed_at` es columna generada: no se puede tocar y devuelve error. Es esperado.)
Después, la segunda corrida mide del 4 al 8.

⚠️ **Todo esto escribe en la base de PRODUCCIÓN** (`supabase-db` del VPS, schema `public`).
Reglas que no se negocian:

- Todo con prefijo `zz-qa-` (el script ya lo hace, incluido el paciente del paso 6).
- **Se borra en la MISMA vuelta**, imprimiendo la fila ANTES de borrarla.
- **Ningún `DELETE` sin `zz-qa-` en el `WHERE`.** Nunca por rango ni por fecha. En
  `access_requests` viven 3 solicitudes reales, y en `patients` hay 1 paciente que **no es
  nuestro**: jamás se toca una fila sin el prefijo.
- **`docker exec` va con `-i`.** Sin `-i` el heredoc nunca llega a psql: **no borra nada y no
  da error**, el comando parece exitoso. Contar las filas después de borrar.
- **Jamás se completa un pago.** Paso 7: se mira la pantalla de cobro, se captura y se FRENA.

Un recorrido entero crea **seis** filas y las seis hay que deshacerlas (medido el 2026-09-03):
`auth.users`, `auth.identities`, `organizations`, `profiles`, `organization_entitlements` y
`patients`. El script las enumera al terminar.
