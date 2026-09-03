# El recorrido de cliente — último estado

**Un tema = un archivo sin fecha. Este archivo se EDITA, no se duplica.** Las fotos con fecha
van en `capturas/`.

Cómo se reproduce, y es un comando, no una intención:

    cd /root/loops/onia-hermes-recorrido && node scripts/recorrido_cliente.mjs

Para los pasos que viven detrás de sesión hace falta una cuenta ya confirmada:

    RECORRIDO_USER=<correo> RECORRIDO_PASS=<clave> node scripts/recorrido_cliente.mjs

---

## Medido el 2026-09-03 01:17 UTC

**Llegó hasta el paso 4 de 8.** Corte en el paso 5: el onboarding es obligatorio y el script
todavía no lo sabe completar.

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 885 ms, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones de alta; **2 clics** hasta el formulario |
| 3 | Registrarse con datos `zz-qa-` | ✔ **OK, medido de verdad** | el alta **crea la cuenta** y manda el correo de confirmación |
| 4 | Entrar a la plataforma | ✔ OK | entró y quedó en `/onboarding` |
| 5 | Elegir rubro y terminar el onboarding | · no medido | el onboarding está a la vista **sin terminar**: completarlo no está escrito |
| 6-8 | dato · cobro · bandeja | · no medido | el producto redirige las tres a `/onboarding` |

Capturas en `capturas/`. Datos crudos en `capturas/resumen.json`.

---

## 🔴 Lo más importante de esta vuelta: el instrumento cantó COMPLETO y era MENTIRA

En la primera corrida con sesión, el script imprimió:

    RECORRIDO COMPLETO: los 8 pasos. Eso es la noticia.

**Era falso, y estuvo a un mensaje de Telegram de ser "la noticia" del carril.** Los pasos 5, 6,
7 y 8 pedían `/onboarding`, `/patients`, `/billing` y `/dashboard`; el producto redirigió **las
cuatro** a `/onboarding`, porque el onboarding es obligatorio y estaba sin terminar. Como las
cuatro respondían **200**, las cuatro se dieron por buenas.

El instrumento vio **una sola pantalla, cuatro veces**, y la contó como cuatro pasos distintos.
La prueba más limpia está en el peso de los archivos: `paso-04`, `paso-05`, `paso-06`, `paso-07`
y `paso-08` pesaban **63.688 bytes las cinco** — es literalmente la misma imagen.

**Un 200 no dice DÓNDE estás.** Ese es el defecto entero: nunca se comparó la URL de llegada con
la pedida. Arreglado en esta vuelta con la función `llegar()`, que exige haber llegado y, si no,
lo dice con las dos URLs en la mano.

Y con el arreglo puesto, el mismo comando que cantaba victoria ahora dice:

    LLEGÓ HASTA EL PASO 4 de 8.
    CORTE en el paso 5 (elegir-rubro) — el onboarding está a la vista y SIN TERMINAR

Por qué importa más que cualquier bug del producto: **este carril existe para que nadie reporte
verde un camino roto.** Un instrumento que se da la razón a sí mismo no es una red de seguridad,
es una alarma desconectada que además tranquiliza.

## Lo segundo: el alta funciona ENTERA, y ahora está medido

Se envió el alta de verdad (`--escribir`) por primera vez. El producto hizo todo bien:

- Creó la cuenta en `auth.users`, la organización en `organizations` y el perfil en `profiles`
  con rol **ADMIN** — las tres filas, en una sola operación.
- Le dio el entitlement `module.agents` en estado `trial` hasta el 2026-09-17 (14 días).
- Mostró **"Verificá tu correo — Tu cuenta ya fue creada"** (`capturas/paso-03b-...png`).
- **Mandó el correo, y salió de verdad.** En el log de `onia-mail`:
  `to=<zz-qa-2026-09-03@onia.com.bo>, relay=route2.mx.cloudflare.net, status=sent (250 2.0.0 Ok)`,
  firmado con DKIM.

**El rebote del paso 4 no es un bug**: es `email_not_confirmed`, el doble opt-in funcionando.
Para poder medir lo que hay detrás, se confirmó a mano **la fila `zz-qa-` y sólo esa**
(`update auth.users set email_confirmed_at=now() where email like 'zz-qa-%'` → `UPDATE 1`).
Queda dicho porque es un salteo deliberado del instrumento, no algo que haga un cliente.

## Lo que se escribió en producción, y cómo quedó

Estado antes del alta: **4 organizaciones, 6 perfiles**. Filas creadas y **borradas en la misma
vuelta**, impresas antes de tocarlas:

```
auth.users     a8c367d1-f1e5-4cb7-af30-2e8355e4b03a  zz-qa-2026-09-03@onia.com.bo
profiles       cmtktyoll000101khphfayh1w             zz-qa-2026-09-03@onia.com.bo  ADMIN
organizations  cmtktyol5000001kh725lmlpv             zz-qa-2026-09-03-negocio
organization_entitlements  cmtktyomf000301khbsabh820  module.agents / trial
auth.identities dd8e270b-fc28-4878-85ad-e9d0aae58c76  email
```

Borradas por **id exacto**, dentro de una transacción: `DELETE 1` cinco veces, `COMMIT`.
Verificado después: **0 filas `zz-qa-`**, totales de vuelta en **4 orgs / 6 perfiles**, y las
**3 solicitudes reales de `access_requests` intactas**. Nada quedó sin limpiar.

⚠️ **Y el borrado falló mudo la primera vez.** `docker exec supabase-db psql <<'SQL'` **sin
`-i`** no conecta stdin: psql no recibe nada, no borra nada y **sale sin error**. El comando se
veía exitoso. Sólo el recuento posterior lo delató. Va con `docker exec -i` siempre, y el
recuento después del borrado no es opcional.

## Dos trampas del instrumento, de vueltas anteriores (siguen vigentes)

1. **Los nombres de iconos en el texto NO son el bug del login.** El DOM de `/register` devuelve
   `dentistry`, `credit_card_off` como texto, igual que el defecto real de producción. Es una
   fuente de ligaduras: en la captura se ven los dibujos. El DOM sirve para sospechar; sólo la
   imagen confirma.
2. **El único campo con `name` es el honeypot** (`sitioWeb`). Los cuatro campos reales sólo
   tienen `placeholder`. Un relleno que busque por `name` llena **exactamente la trampa** y
   después culpa al producto por rechazar el alta.

## Estado del instrumento

`scripts/recorrido_cliente.mjs`. Lo que ya sabe hacer:

- **Exige llegar a donde pidió** (`llegar()`): un redirect ya no puede pasar por éxito.
- **Entra con la cuenta que acaba de crear**, no con una llave aparte. Antes el paso 4 exigía
  `RECORRIDO_USER`/`RECORRIDO_PASS` y **ni miraba** la cuenta del paso 3 — eso solo condenaba al
  recorrido a morir en el 3 para siempre, aunque el alta funcionara perfecto.
- **Lee el motivo del rebote en la pantalla** cuando el login falla, en vez de reportar "no entró".
- **El corte es el paso que frenó el avance**, no el primero que no dio OK: con el paso 3
  salteado a propósito, antes decía "corte en el paso 3" y mandaba a mirar donde no había nada.
- Captura con **scroll real** y con el **Chromium completo** (`channel: 'chromium'`), no el
  `headless_shell` que le inventó texto roto al canario durante tres días.
- Sale con código 0 aunque el recorrido se corte: "se corta en el paso 5" es el **reporte**.

**Lo que le falta, y es lo próximo:** completar el onboarding (nombre del negocio → "Buscar mi
negocio") para que los pasos 6, 7 y 8 se puedan medir por primera vez. Hasta que eso exista,
**`/patients`, `/billing` y `/dashboard` siguen sin haber sido vistas nunca por este carril** —
existen en el build, pero nadie las miró renderizadas con una cuenta nueva.
