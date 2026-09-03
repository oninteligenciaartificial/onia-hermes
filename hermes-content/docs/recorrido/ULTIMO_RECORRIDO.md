# El recorrido de cliente — último estado

**Un tema = un archivo sin fecha. Este archivo se EDITA, no se duplica.** Las fotos con fecha
van en `capturas/`.

Cómo se reproduce, y es un comando, no una intención:

    cd /root/loops/onia-hermes-recorrido && node scripts/recorrido_cliente.mjs

Sin `--escribir` el recorrido llega hasta el paso 2 y se detiene: no crea cuenta, y sin cuenta
no hay nada detrás. Para recorrerlo entero, ver *"Cómo se corre entero"* al final.

---

## Medido el 2026-09-03 04:15 UTC

### 🟢 El recorrido se completó ENTERO. Los 8 pasos. Primera vez.

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 1.558 ms, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones; el camino es "Creá tu cuenta", **2 clics** |
| 3 | Registrarse con datos `zz-qa-` | ✔ OK | crea la cuenta y manda el correo de confirmación |
| 4 | Entrar a la plataforma | ✔ OK | entró con la cuenta recién creada; quedó en `/onboarding` |
| 5 | Elegir rubro y terminar el onboarding | ✔ **OK, nuevo** | 6 pantallas del asistente; `/dashboard` dejó de rebotar |
| 6 | Cargar un dato del rubro | ⚠ OK con reparo | `/patients` abrió — pero **no se cargó ningún dato** |
| 7 | Pantalla de cobro (mirar y FRENAR) | ⚠ OK con reparo | `/billing` abrió — la vista está **tapada por un modal** |
| 8 | Abrir la bandeja / el panel | ⚠ OK con reparo | `/dashboard` abrió — no comprueba que el dato aparezca |

Capturas en `capturas/`. Datos crudos en `capturas/resumen.json`.

**Nada del producto se rompió en el camino.** Los tres reparos son del instrumento, no de Onia:
están en `../cola/recorrido-cliente.md` como ítems 1 y 2.

---

## Lo que se hizo esta vuelta: el paso 5 dejó de ser un muro

El onboarding es **obligatorio**: mientras `organizations.onboardingCompletedAt` esté vacío,
`app/(dashboard)/layout.tsx:59` manda a `/onboarding` a todo el que entre. Por eso `/patients`,
`/billing` y `/dashboard` **nunca habían sido vistas por este carril** — existían en el build y
nadie las había mirado nunca con una cuenta nueva.

Ahora el instrumento camina el asistente entero y deja traza de cada pantalla:

    · pregunta:     "¿Cómo se llama tu negocio?"        → Completar el formulario
    · negocio:      "Contanos de tu negocio"            → Continuar
    · asistente-2:  "¿Cuándo atendés?"                  → Saltar por ahora
    · asistente-3:  "¿Qué hacés y a cuánto?"            → Saltar por ahora
    · equipo:       "¿Quién más trabaja con vos?"       → Saltar por ahora (cierra el alta)
    · listo:        "zz-qa-...-negocio ya está en Onia" → —

Dos decisiones que no son de estilo:

- **No se aprieta "Buscar mi negocio".** Ese botón sale a internet a extraer el perfil del
  negocio desde su web o sus redes. Este loop corre 8 veces por día: dispararlo sería gasto
  recurrente buscando un negocio que no existe. Se toma el otro camino que **el propio producto
  ofrece** ("Completar el formulario"), que es el mismo asistente sin la búsqueda.
- **Se pregunta dónde se está antes de cada clic**, en vez de disparar cuatro clics a ciegas.
  Una secuencia fija se rompe el día que se agrega un paso — y peor, reporta "completado" porque
  apretó cuatro botones.

### La verificación NO es haber apretado los botones

Cuatro clics y una pantalla que dice "listo" es exactamente la clase de evidencia que **ya hizo
cantar `RECORRIDO COMPLETO` a este mismo script sobre un camino roto**, ayer. Así que el paso 5
no se da por bueno con lo que muestra el asistente. Se mide el **efecto**:

- **`/dashboard` deja de rebotar.** El producto retiene en `/onboarding` a toda cuenta sin
  `onboardingCompletedAt`; si deja de hacerlo, el gate se levantó. No hay forma de fingirlo.
- **Y en la base quedó la hora**: `onboardingCompletedAt = 2026-09-03 04:14:50`.

Las capturas también se auditaron por peso, que fue lo que delató el falso verde de ayer (cinco
archivos de 63.688 bytes idénticos): hoy son **6 imágenes distintas** entre los pasos 4 y 8.

## Los dos reparos que quedaron abiertos, y son del instrumento

1. **Los pasos 6, 7 y 8 dicen "pantalla a la vista" sobre una pantalla tapada.** Al mirar
   `paso-06` y `paso-07` aparece el modal **"Primeros pasos"** cubriendo todo el contenido.
   `llegar()` compara la URL y ahí se detiene, así que un overlay del 100 % pasa por "llegué".
   **El modal no es un bug del producto**: `GuiaInicio.tsx:69` lo abre una vez por usuario y al
   cerrarlo queda cerrado (`localStorage`). Se comprobó **antes** de reportarlo — una hipótesis
   no probada no se anuncia.
2. **El paso 6 no carga ningún dato.** Sólo abre `/patients`. Y como no hay dato, el paso 8
   ("¿aparece el dato del paso 6?") tampoco comprueba nada. Los dos dan OK igual.

## Lo que se escribió en producción, y cómo quedó

Estado antes: **4 organizaciones, 6 perfiles, 3 solicitudes reales, 0 filas `zz-qa-`**.
Filas creadas, impresas antes de tocarlas:

```
auth.users                 d55297ad-9636-4efc-a37b-cc1a91d07e9d  zz-qa-2026-09-03@onia.com.bo
profiles                   cmtl0fnl4000701khukys0rpg             zz-qa-2026-09-03@onia.com.bo  ADMIN
organizations              cmtl0fnkz000601khcfest95x             zz-qa-2026-09-03-negocio  (dentagest-clinical)
organization_entitlements  cmtl0fnm6000901kh1h4ysmuw             module.agents / trial → 2026-09-17
auth.identities            f132eebb-30bd-4ba1-8827-69fe78f52a1a  email
```

Borradas **por id exacto**, en una transacción: `DELETE 1` cinco veces, `COMMIT`. Recuento
posterior: **4 orgs / 6 perfiles**, **0 filas `zz-qa-`** en las tres tablas, y las **3
solicitudes reales de `access_requests` intactas**. Nada quedó sin limpiar.

El correo se confirmó a mano sobre **la fila `zz-qa-` y sólo esa**
(`update auth.users set email_confirmed_at=now() where email like 'zz-qa-%'` → `UPDATE 1`).
Queda dicho porque es un **salteo deliberado del instrumento**, no algo que haga un cliente: el
doble opt-in funciona y sin confirmar no se entra.

## Cómo se corre entero

Son **dos corridas**, y no se puede evitar:

    node scripts/recorrido_cliente.mjs --escribir    # 1) crea la cuenta, frena en el paso 4
    docker exec -i supabase-db psql -U postgres -d postgres \
      -c "update auth.users set email_confirmed_at=now() where email like 'zz-qa-%';"
    node scripts/recorrido_cliente.mjs --escribir    # 2) mide del 4 al 8

Y después **se borra en la misma vuelta** (los cinco ids de arriba, por id exacto).
⚠️ `docker exec` **va con `-i`**: sin él el heredoc no llega a psql, no borra nada y **sale sin
error**. Contar las filas después de borrar no es opcional.

## Trampas del instrumento que siguen vigentes

1. **Los nombres de iconos en el texto NO son el bug del login.** El DOM de `/register` devuelve
   `dentistry`, `credit_card_off` como texto. Es una fuente de ligaduras: en la captura se ven
   los dibujos. El DOM sirve para sospechar; sólo la imagen confirma.
2. **El único campo con `name` es el honeypot** (`sitioWeb`). Los cuatro campos reales sólo
   tienen `placeholder`. Un relleno que busque por `name` llena **exactamente la trampa**.
3. **La segunda corrida vuelve a intentar el alta** con el mismo correo y el paso 3 dice OK
   igual (sólo mira que el formulario pida contraseña). Es ruido conocido, no un hallazgo.

## Estado del instrumento

`scripts/recorrido_cliente.mjs`. Lo que ya sabe hacer:

- **Completa el onboarding** y lo verifica por el efecto, no por los clics.
- **Exige llegar a donde pidió** (`llegar()`): un redirect no puede pasar por éxito.
- **Entra con la cuenta que acaba de crear**, no con una llave aparte.
- **Lee el motivo del rebote en la pantalla** cuando el login falla.
- **El corte es el paso que frenó el avance**, no el primero que no dio OK.
- Captura con **scroll real** y con el **Chromium completo** (`channel: 'chromium'`), no el
  `headless_shell` que le inventó texto roto al canario durante tres días.
- Sale con código 0 aunque el recorrido se corte: "se corta en el paso 5" es el **reporte**.

**Lo que le falta, y es lo próximo:** cerrar el overlay antes de capturar (y fallar si algo tapa
la pantalla), y **cargar un paciente de verdad** para que el paso 8 pueda comprobar que aparece.
Hasta entonces, los pasos 6 y 8 abren pantallas pero no prueban que el producto guarde nada.
