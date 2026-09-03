# Cola — carril recorrido de cliente

Estado del carril: [`../recorrido/ULTIMO_RECORRIDO.md`](../recorrido/ULTIMO_RECORRIDO.md).
Instrumento: `scripts/recorrido_cliente.mjs`.

> Antes de trabajar un ítem de acá, **reproducilo en vivo**. Medido en este repo: entre el 25 %
> y el 46 % de lo que las colas declaraban pendiente ya no existía.

## Abierto

### 1. Los pasos 6, 7 y 8 cantan "pantalla a la vista" sobre una pantalla TAPADA

El recorrido ya llega entero (2026-09-03), pero al mirar las capturas apareció esto: en
`paso-06-cargar-dato.png` y `paso-07-cobro.png` **la pantalla del producto está cubierta por el
modal "Primeros pasos"**, y el script las declaró OK igual.

**El modal NO es un bug del producto** — verificado en
`onia-platform/components/onboarding/GuiaInicio.tsx:69`: se abre una vez por usuario y al
cerrarlo queda cerrado (`localStorage`). Es diseño intencional para una cuenta recién creada.
El defecto es del **instrumento**: `llegar()` compara la URL y ahí se detiene, así que un
overlay que tapa el 100 % de la pantalla pasa por "llegué". Es el mismo pecado de fondo del
falso verde de ayer —confirmar sin mirar—, una capa más arriba: antes no se miraba *dónde* se
estaba; ahora no se mira *si se ve algo*.

Qué hay que escribir: después de `llegar()`, cerrar el overlay si existe (botón **"Cerrar por
ahora"**) y recién entonces capturar; y que el paso NO dé OK si queda un elemento fijo cubriendo
la pantalla. Sin eso, este carril puede volver a reportar verde una pantalla que nadie vio.

Reproducción, 30 segundos: abrir `../recorrido/capturas/paso-07-cobro.png`. Se ve el menú
lateral con "Facturación" resaltado y, encima, el modal de 6 tareas tapando todo el contenido.

### 2. El paso 6 no CARGA ningún dato: sólo abre la pantalla

Se llama "Cargar un dato real del rubro" y lo único que hace es abrir `/patients` y capturar.
Nunca se creó un paciente — así que el paso 8 ("¿aparece el dato del paso 6?") tampoco comprueba
nada: mira el panel y reporta que cargó. Los dos pasos están a medias y **dan OK igual**.

El camino ya está a la vista en la captura: botón **"Nuevo paciente"** dentro de Primeros pasos,
y un **"+"** flotante abajo a la derecha. El paciente va con nombre `zz-qa-...` y se borra en la
misma vuelta, igual que la cuenta. Depende del ítem 1 (hay que cerrar el modal primero).

### 3. Completar el onboarding para que los pasos 6, 7 y 8 se midan por primera vez

✅ **HECHO el 2026-09-03** — ver "Cerrado". El bloque de abajo queda porque es el procedimiento
vigente para volver a correr el recorrido entero:

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

⚠️ **Son DOS corridas, no una**, y no se puede evitar: la primera crea la cuenta y frena en el
paso 4 por el correo sin confirmar; después se confirma la fila `zz-qa-` a mano y la segunda
corrida mide del 4 al 8. La segunda vuelve a intentar el alta con el mismo correo y el paso 3
igual dice OK (sólo mira que el formulario pida contraseña) — es ruido conocido, no un hallazgo.

### 4. El mismo recorrido con otro rubro

El alta ofrece cinco: clínica dental, comercio/tienda, importadora/distribuidora, estética y
spa, servicios profesionales. El script ya acepta `RECORRIDO_RUBRO="Comercio / tienda"`.
Un rubro encendido que rompe el onboarding es justo el fallo que no ve nadie. **Ya no depende de
nada**: con el onboarding automatizado, cambiar el rubro es una variable de entorno. Ojo: el
paso 6 apunta fijo a `/patients`, que es la pantalla de datos del rubro DENTAL — para comercio
hay que resolver la ruta según el rubro o el paso va a reportar un desvío que no es un fallo.

## Cerrado

- **Completar el onboarding para medir los pasos 6, 7 y 8** — hecho el 2026-09-03. El instrumento
  ya camina el asistente entero (pregunta → negocio → horarios → servicios → equipo → listo) y el
  **recorrido llegó a los 8 pasos por primera vez**. La verificación no es haber apretado los
  botones: es que `/dashboard` deje de rebotar, y en la base `onboardingCompletedAt` quedó con
  hora. `/patients`, `/billing` y `/dashboard` fueron vistas renderizadas por primera vez.
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
