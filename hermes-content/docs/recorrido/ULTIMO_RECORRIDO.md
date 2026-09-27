# El recorrido de cliente — último estado

**Un tema = un archivo sin fecha. Este archivo se EDITA, no se duplica.** Las fotos con fecha
van en `capturas/`.

Cómo se reproduce, y es un comando, no una intención:

    cd /root/loops/onia-hermes-recorrido && node scripts/recorrido_cliente.mjs

Sin `--escribir` el recorrido llega hasta el paso 2 y se detiene: no crea cuenta, y sin cuenta
no hay nada detrás. Para recorrerlo entero, ver *"Cómo se corre entero"* al final.

---

## 2026-09-27 09:09-09:22 La Paz (vuelta HEAD 99052093) — dental x3 seguidas por defecto; rotado a Importadora, ambos 9/9

Chequeo de arranque: máquina `casa` (nodo-casa, WSL). `ONIA_ALTA_AUTOMATICA=abierta`. Los 4 loops
de `casa` coinciden con `loops.md` (registro OK). Tablero sin tareas `ready` sin reclamar en
`recorrido-cliente`.

Corrí `node scripts/recorrido_cliente.mjs --escribir` sin fijar rubro (default: Clínica dental,
como las dos vueltas anteriores) — **9/9, `completo: true`**. Cuenta
`zz-qa-2026-09-27-0909@onia.com.bo` creada, onboarding en 6 pantallas, paciente
`zz-qa-2026-09-27-0909-paciente` en `/patients`, cita 2026-09-28 09:00 agendada
(`cmujlopor00ao01n01j1dr4bg`) y vista en `/appointments`, factura con ítem
`zz-qa-2026-09-27-0909-item` vista en `/billing/...` y frenada sin pagar.

Era la 3ra corrida seguida en dental por defecto — así que roté el eje:
`RECORRIDO_RUBRO=Importadora node scripts/recorrido_cliente.mjs --escribir` — **8/8 (el paso 7 no
aplica, correctamente: "Importadora" no vende agenda, coherente con su propio menú)**. Cuenta
`zz-qa-2026-09-27-0914@onia.com.bo`, paciente `zz-qa-2026-09-27-0914-paciente` cargado y visto en
storefront Catálogo (`/comercio`), pantalla de cobro (`/comercio/fiados`, Créditos) mirada y
frenada sin pagar.

Limpieza verificada en las DOS corridas: `appointments`/`organizations` con `zz-qa-%` = 0 al
cerrar (impreso antes de borrar, en la salida de cada corrida).

RAZÓN: N/A — avanzó (dos recorridos completos, sin hallazgos nuevos que reportar a otro carril).

---

## 2026-09-27 03:10 La Paz (vuelta HEAD cce94006) — limpieza de basura ajena + Clínica dental, recorrido completo, 9/9

Chequeo de arranque: máquina `casa` (nodo-casa, WSL). Encontré 1 fila `zz-qa-` de una vuelta
ajena (carril de recordatorios, prefijo `zz-qa-recordatorio-20260927065107-*`) huérfana en
`appointments`, `patients`, `profiles` y `organizations` — la imprimí antes de borrar y quedó en
0. `ONIA_ALTA_AUTOMATICA=abierta`. Los 4 loops de `casa` coinciden con `loops.md`. Tablero sin
tareas `ready` sin reclamar en `recorrido-cliente`.

Corrí `node scripts/recorrido_cliente.mjs --escribir` en rubro por defecto (Clínica dental).
**9/9, `completo: true`, `agujeros: []`.** Cuenta `zz-qa-2026-09-27-0710@onia.com.bo` creada,
confirmó correo, onboarding completo en 6 pantallas, paciente
`zz-qa-2026-09-27-0710-paciente` cargado y visto en `/patients`, cita 2026-09-28 09:00 agendada
(201, `cmujhfuyq009501n09t9m971m`) y vista en `/appointments`, factura con ítem
`zz-qa-2026-09-27-0710-item` vista en `/billing/...` y frenada sin pagar. El panel
(`/dashboard`) no lista el paciente — confirmado que es lo esperado, no un fallo.

Limpieza verificada al cerrar: `appointments`/`organizations` con `zz-qa-%` = 0 (impreso antes
de borrar, en la salida de la corrida).

RAZÓN: N/A — avanzó (recorrido completo, sin hallazgos nuevos que reportar a otro carril).

---

## 2026-09-27 06:09 La Paz (vuelta HEAD b0e56742) — Clínica dental, recorrido completo, 9/9

Chequeo de arranque: máquina `casa` (nodo-casa, WSL). `ONIA_ALTA_AUTOMATICA=abierta`. Tablero
sin tareas `ready` sin reclamar en `recorrido-cliente`.

Corrí `node scripts/recorrido_cliente.mjs --escribir` en rubro por defecto (Clínica dental).
**9/9, `completo: true`, `agujeros: []`.** Cuenta `zz-qa-2026-09-27-0609@onia.com.bo` creada,
confirmó correo, onboarding completo en 6 pantallas, paciente
`zz-qa-2026-09-27-0609-paciente` cargado y visto en `/patients`, cita 2026-09-28 09:00 agendada
(201, `cmujf8uxu008701n0v6kw68fy`) y vista en `/appointments`, factura con ítem
`zz-qa-2026-09-27-0609-item` vista en `/billing/...` y frenada sin pagar. El panel
(`/dashboard`) no lista el paciente — confirmado que es lo esperado (el panel no muestra ese
grupo), no un fallo.

Limpieza verificada al cerrar: `appointments`/`organizations` con `zz-qa-%` = 0 (impreso antes
de borrar, en la salida de la corrida).

RAZÓN: N/A — avanzó (recorrido completo, sin hallazgos nuevos que reportar a otro carril).

---

## 2026-09-27 05:xx La Paz (vuelta HEAD 7cf4566e) — dos vueltas anteriores murieron sin limpiar; limpieza + Servicios profesionales RE-VERIFICADO: el fix del paso 6 ya está en producción, 9/9

Chequeo de arranque: `ONIA_ALTA_AUTOMATICA=abierta`. Tablero sin tareas `ready` sin reclamar en
`recorrido-cliente`.

**Antes de correr nada, encontré basura de producción sin limpiar.** `t_419b2849` (perdón,
`t_419b2949`) del hallazgo anterior tenía un comentario diciendo que el fix de las etiquetas
(`b68c9e52`) ya estaba en `master` y pedía re-mirar Servicios profesionales con una cuenta real
en cuanto existiera una. Antes de crear esa cuenta miré la base y encontré **dos organizaciones
`zz-qa-2026-09-27-0309-negocio` y `zz-qa-2026-09-27-0409-negocio`** (con sus 2 perfiles y 2
usuarios de `auth.users` cada una) que ya estaban ahí: dos vueltas de este mismo loop —
disparadas por el cron horario a las 03:09 y 04:09 UTC— crearon la cuenta y **murieron antes de
llegar a `limpiarProduccion()`** (0 filas de `appointments`/`patients`, o sea que ni siquiera
llegaron muy lejos). Ninguna dejó línea en este archivo. Filas impresas antes de borrar (salida
completa de `--solo-limpiar`, quedó en el log de esta vuelta):

    organizations cmuj8qadv005l01n0kyqxgyc8 zz-qa-2026-09-27-0309-negocio
    organizations cmujavgb4006901n06pixsj37 zz-qa-2026-09-27-0409-negocio
    auth.users ba882afb-53af-4268-a55d-06928bea6892 zz-qa-2026-09-27-0309@onia.com.bo
    auth.users c7790148-b9b0-4619-9806-66da1e6d0037 zz-qa-2026-09-27-0409@onia.com.bo

Barridas con `node scripts/recorrido_cliente.mjs --solo-limpiar` (la póliza que ya existe para
exactamente este caso): `restantes: 0`.

**Con la base limpia, corrí lo que quedaba pendiente**: `RECORRIDO_RUBRO='Servicios
profesionales' node scripts/recorrido_cliente.mjs --escribir` (cuenta
`zz-qa-2026-09-27-0512@onia.com.bo`). **9/9, `completo: true`, `agujeros: []`.** El paso 6
(`/patients/new`) que el 27-sep a las 02:xx parecía "sin ningún campo de texto" ahora carga
`zz-qa-2026-09-27-0512-paciente` sin problema — confirma en vivo que `b68c9e52` (etiquetas
asociadas, no campos nuevos: el defecto real era accesibilidad) ya está sirviendo en producción.
Paso 7 agenda la cita con ese paciente (201, `cmujd89c0007601n0sluijf5r`) y la ve en
`/appointments`. Frenado en `/comercio/caja` sin pagar.

Limpieza verificada al cerrar: `organizations`/`appointments` con `zz-qa-%` = 0.

**Lección que le sirve a otro carril** (va a `onia-aprender.sh`): una vuelta de este loop que
muere por timeout entre crear la cuenta y `limpiarProduccion()` deja basura silenciosa en
producción — sin log, sin aviso. `--solo-limpiar` es la única red, pero nadie la corre sola: hay
que ir a buscarla mirando la base, no confiar en que "si no hay línea en el archivo, no hay
basura".

RAZÓN: N/A — avanzó (limpieza de basura de dos vueltas caídas + hallazgo anterior confirmado
cerrado en producción, con reproducción).
LECCIÓN: dos vueltas seguidas del cron pueden morir por timeout sin dejar rastro escrito;
agregar un chequeo de basura `zz-qa-` AL ARRANCAR (antes del recorrido, no solo al cerrar) evita
que se acumule sin que nadie lo note.

---

## 2026-09-27 02:09-02:17 La Paz (vuelta HEAD 7b578eee) — rotación de rubro: Servicios profesionales — HALLAZGO REAL, roto en paso 6

Chequeo de arranque: `ONIA_ALTA_AUTOMATICA=abierta`. Tablero sin tareas `ready` sin reclamar en
`recorrido-cliente`.

Corrí primero el recorrido por defecto (dental, sin `RECORRIDO_RUBRO`): **9/9, `completo: true`,
`agujeros: []`**, cuenta `zz-qa-2026-09-27-0209@onia.com.bo`, limpieza verificada (0 filas).
Ese recheck no era estrictamente necesario (la nota anterior ya marcaba "próximo eje: Servicios
profesionales"), pero no invalidó nada: confirmó dental sano antes de seguir la rotación.

Seguí el plan: `RECORRIDO_RUBRO='Servicios profesionales' node scripts/recorrido_cliente.mjs
--escribir` (cuenta `zz-qa-2026-09-27-0213@onia.com.bo`). **LLEGÓ HASTA EL PASO 5 de 9.
`completo: false`.**

**AGUJERO real en el paso 6**: `https://app.onia.com.bo/patients/new` (grupo "Clientes" del menú
de este rubro) **no tiene ni un campo de texto** donde cargar un cliente — pantalla vacía
funcionalmente. Esto corta en cascada el paso 7 (agendar cita: no hay con quién) y deja el paso 9
sin dato que buscar. El paso 8 (cobro, `/comercio/caja`) sí abrió y se pudo mirar.

Reportado en el tablero para el dueño del producto: `t_419b2949` (prioridad 1), con la
reproducción exacta y dos capturas adjuntas (`paso-06-cargar-dato.png`, `paso-06-menu.png`).
No lo arreglo — no es mi carril.

Limpieza verificada al cerrar ambas corridas: `organizations`/`appointments` con `zz-qa-%` = 0.

RAZÓN: N/A — avanzó (hallazgo real reportado con reproducción y capturas).
LECCIÓN: ninguna nueva.

---

## 2026-09-26 21:10-21:14 La Paz (vuelta HEAD d58daf8c) — rotación de rubro sigue: Estética y spa, 9/9 sin hallazgo

Chequeo de arranque: `ONIA_ALTA_AUTOMATICA=abierta`. Tablero sin tareas `ready` sin reclamar en
la zona `recorrido-cliente`. `BUILD_ID` vivo cambió a `PNIhLndYbrHxc_q0RFByG` (antes
`DvBubiuO4uC5_E9jFNJeZ`) — hubo deploy nuevo, pero el eje que correspondía por la nota anterior
("Próximo eje: Estética") ya era el siguiente paso de la rotación, así que se corrió ése.

`RECORRIDO_RUBRO='Estética y spa' node scripts/recorrido_cliente.mjs --escribir` (cuenta
`zz-qa-2026-09-27-0110@onia.com.bo`): **9/9 pasos que le corresponden, `completo: true`,
`agujeros: []`.** Onboarding en 6 pantallas (horarios lun-vie 09-13/15-19, equipo con 1
profesional), paciente `zz-qa-2026-09-27-0110-paciente` cargado y visto en `/patients`, cita
`2026-09-28 09:00` agendada (201, id `cmuj4krtk003z01n0lfovmmh5`) y VISTA en `/appointments`,
factura con ítem `zz-qa-2026-09-27-0110-item` vista en `/billing/cmuj4l2hw004101n08lanx8qu`,
FRENADO ahí sin pagar. Panel mirado: el paciente no figura en `/dashboard` (esperado, el panel no
lista pacientes). **Sin hallazgo** — el `BUILD_ID` nuevo no rompió nada en Estética.

Limpieza verificada al cerrar: `organizations`/`appointments` con `zz-qa-%` = 0.

**Próximo eje para la vuelta siguiente**: seguir la rotación con Servicios profesionales (cuarto
rubro del ciclo nuevo — dental, comercio, estética ya corridos en este ciclo).

RAZÓN: N/A — avanzó (rotación de rubro, Estética 9/9 sin hallazgo, `BUILD_ID` nuevo verificado).
LECCIÓN: ninguna nueva — grepear los ejes antes de tirar `--escribir` a secas (la lección de la
vuelta anterior) volvió a evitar repetir dental sin necesidad.

---

## 2026-09-26 20:14-20:41 La Paz (vuelta HEAD b7a6ad57) — dental base repetido por error de método, corregido con Comercio (rotación de rubro), 8/8 sin hallazgo

Corrí `node scripts/recorrido_cliente.mjs --escribir` en dental plano (cuenta
`zz-qa-2026-09-27-0009@onia.com.bo`) **sin grepear antes** los ejes de este archivo: **9/9,
`completo: true`**, pero repitió la entrada de una hora antes (19:13, `30b7f005`, misma
variante base) — no midió nada nuevo. Es el mismo error que ya está documentado más abajo
(16:15, `a6d8723e`): antes de tirar `--escribir` a secas hay que grepear
`RECORRIDO_(RUBRO|MOVIL|SALTAR_EQUIPO|PROBAR_RECOVERY|PROBAR_COADMIN)=` y ordenar por fecha.

Corregido en la misma vuelta: la rotación de los 5 rubros había cerrado su ciclo el 26-sep a
las 02:09-02:12 (Servicios profesionales), así que el eje más viejo era retomarla desde el
principio. Corrí `RECORRIDO_RUBRO=Comercio node scripts/recorrido_cliente.mjs --escribir`
(cuenta `zz-qa-2026-09-27-0014@onia.com.bo`): **8/8 pasos que le corresponden, `completo: true`,
sin hallazgo.** El paso 7 (agendar cita) sale `NO-APLICA` correctamente — Comercio vende
storefront/catálogo/caja, no agenda, y su propio menú no ofrece citas. Paciente
`zz-qa-2026-09-27-0014-paciente` cargado en `/comercio` (catálogo) y visto de vuelta ahí y en
`/dashboard` (a diferencia de dental, en Comercio el dato SÍ aparece en el panel). Frenado en
la pantalla de cobro (`/comercio/caja`) sin marcar pago.

Limpieza verificada al cerrar, ambas corridas: `organizations`/`appointments` con `zz-qa-%` = 0.

**Próximo eje para la vuelta siguiente**: seguir la rotación con Estética (tercer rubro del
ciclo nuevo).

---

## 2026-09-26 19:13 La Paz (vuelta HEAD 30b7f005) — recorrido base (sin variantes), 9/9

`node scripts/recorrido_cliente.mjs --escribir` (dental, sin env de variante, cuenta
`zz-qa-2026-09-26-2309@onia.com.bo`): **9/9 pasos, `completo: true`, sin hallazgo.** Onboarding
con equipo cargado (profesional `zz-qa-2026-09-26-2309-profesional`), cita
`zz-qa-2026-09-26-2309-cita` agendada para 2026-09-28 09:00 (id `cmuj08skt002001n0qgpo120n`) y
VISTA en `/appointments`, paciente `zz-qa-2026-09-26-2309-paciente` visto en `/patients`,
factura con ítem `zz-qa-2026-09-26-2309-item` vista en `/billing/cmuj092wx002201n0i9lrng7l` —
frenado ahí sin marcar pago. El paso 9 (panel/dashboard) confirma que el paciente NO aparece
listado ahí — comportamiento esperado, el panel no lista pacientes.

Limpieza verificada al cerrar: `select count(*) from organizations where name like 'zz-qa-%'` = 0,
`select count(*) from appointments where notes like 'zz-qa-%' or reason like 'zz-qa-%'` = 0.

**Nota para la próxima vuelta:** esta corrida fue con la variante base (sin `RECORRIDO_RUBRO`,
`RECORRIDO_MOVIL`, `RECORRIDO_SALTAR_EQUIPO`, `RECORRIDO_PROBAR_RECOVERY` ni
`RECORRIDO_PROBAR_COADMIN`), que ya se corre seguido. El eje que hace más tiempo no se corre según
la entrada anterior era `SALTAR_EQUIPO` — reconfirmado hoy a las 17:09 La Paz. La próxima vuelta
debería mirar `PROBAR_RECOVERY`, `PROBAR_COADMIN`, `MOVIL` o la rotación de `RUBRO` (grepear las
fechas de cada uno en este archivo) en vez de repetir la variante base.

---

## 2026-09-26 17:09 La Paz (vuelta HEAD 82bb23e3) — `BUILD_ID` sin cambios; eje más viejo (`SALTAR_EQUIPO`, 13 días sin correrse) reconfirmado, 9/9

Antes de tirar `--escribir` en dental a secas (el error de la vuelta anterior), grepeé
`RECORRIDO_(RUBRO|MOVIL|SALTAR_EQUIPO|PROBAR_RECOVERY|PROBAR_COADMIN)=` en este archivo y comparé
fechas reales por `git log -1 --format=%ci <sha-del-commit-que-lo-corrió>` (las fechas que cada
entrada se pone a sí misma no siempre coinciden con el commit real). Resultado: `PROBAR_COADMIN` y
el checkout se corrieron hoy a las 19:09 UTC, `PROBAR_RECOVERY` a las 18:20 UTC, `MOVIL` a las
16:18 UTC, la rotación de `RUBRO` cerró el ciclo de los 5 a las 02:14 UTC — pero
`RECORRIDO_SALTAR_EQUIPO=1` no se corría desde el **2026-09-13 11:14** (13 días), por lejos el más
viejo.

`RECORRIDO_SALTAR_EQUIPO=1 node scripts/recorrido_cliente.mjs --escribir` (dental, cuenta
`zz-qa-2026-09-26-2110@onia.com.bo`): **9/9 pasos, `completo: true`, sin hallazgo.** Onboarding
cerrado con "Saltar por ahora" en la pantalla de equipo, sin cargar ningún profesional
(`profesionalCargado: false`) — igual que el 13-sep. El paso 7 (agendar cita
`zz-qa-2026-09-26-2110-cita`, 2026-09-28 09:00, id `cmuivzy6e000h01n0z4eitafr`) salió OK de nuevo:
el desplegable de "profesional" sigue ofreciendo al dueño cuando no hay equipo cargado. **Esto
RECONFIRMA, tras 13 días y varios deploys de por medio, que saltar "equipo" en el onboarding no
rompe agendar** — la respuesta del 2026-09-13 sigue siendo verdad hoy. Paciente
`zz-qa-2026-09-26-2110-paciente` cargado y visto en `/patients`, factura con ítem
`zz-qa-2026-09-26-2110-item` vista en `/billing/cmuiw08il000j01n0xyfmxnd1` — frenado ahí sin
marcar pago. Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` = 0 al cerrar.

Tablero: sin tareas `ready` sin reclamar en la zona `recorrido-cliente` (una tarea `ready` vieja,
`t_07be8328`, es sólo un aviso informativo `[auto:]` que esta misma carrilera ya se auto-generó
para Telegram — no es un pedido de trabajo, se deja como está).

**Próximo eje más viejo tras esta vuelta**: la rotación de `RUBRO` (cerró ciclo completo
2026-09-26 02:14 UTC) es ahora el más antiguo de los cinco ejes rastreados.

## 2026-09-26 16:15 La Paz (vuelta HEAD a6d8723e) — `BUILD_ID` sin cambios; repetí dental sin eje nuevo por segunda vez — mismo error que ya está documentado abajo, dos corridas 9/9 igual

`BUILD_ID` comparado ANTES de arrancar contra este archivo (`DvBubiuO4uC5_E9jFNJeZ`, sin cambios)
y contra el tablero (sin tareas `ready` sin reclamar en la zona `recorrido-cliente`, la cola del
carril tampoco tenía ítems abiertos). Corrí `node scripts/recorrido_cliente.mjs --escribir` en
dental plano dos veces (cuentas `zz-qa-2026-09-26-1916` y `zz-qa-2026-09-26-2009`, la primera
arrancada antes de terminar de leer el resto del archivo) — **9/9 ambas, `completo: true`**, sin
hallazgo. Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` = 0 al cerrar (la
cuenta 1916 tardó en limpiarse porque el proceso seguía corriendo cuando medí la primera vez —
conté antes de que terminara).

**Esto es exactamente el error que la entrada de las 14:09 de hoy (`e292f373`) ya señaló**: dental
plano ya estaba confirmado por `b5c4e6b2` con este mismo `BUILD_ID`, y los ejes recientes (coadmin,
recovery, checkout, `RECORRIDO_MOVIL`) ya se corrieron hoy mismo. Repetirlo de nuevo no midió nada
nuevo. Método para la próxima: antes de tirar `--escribir` en dental a secas, grepear
`RECORRIDO_(RUBRO|MOVIL|SALTAR_EQUIPO|PROBAR_RECOVERY|PROBAR_COADMIN)=` en este archivo y ordenar
por fecha — el eje con la fecha más vieja (hoy: rotación de rubro, ninguno se corrió desde el
2026-09-26 02:xx) es el que corresponde, no dental plano.

## 2026-09-26 19:09 La Paz (vuelta HEAD a43b5e72) — `BUILD_ID` sin cambios; eje coadmin (30h sin correrse) daba ROJO por un falso negativo del propio instrumento — arreglado y confirmado en verde

`BUILD_ID` comparado antes de decidir: `DvBubiuO4uC5_E9jFNJeZ`, sin cambios. Verifiqué primero
el eje de checkout weekly/annual (7 días sin correrse, el más viejo): `node
scripts/probar_checkout_directo.mjs` — crece/anual Bs 5.500, clinic/anual Bs 12.900,
clinic/semanal avisa "Solo mensual o anual" y no cae a otro monto. **Sin hallazgo.**

Seguí con el eje más viejo después de ése: `RECORRIDO_PROBAR_COADMIN=1` (última vez 2026-09-25
12:10, ~30h). Primera corrida (9/9, `completo: true`) trajo `coadminProbado.ok: false`: "la
invitación no se confirmó en pantalla". **Antes de reportarlo como bug de producto, miré la
captura** (`extra-coadmin-03-invitado.png`) en vez de creerle al texto — regla de la casa,
"verificar es mirar". La captura mostraba `/team` YA refrescado con el coadministrador en la
lista como Administrador: la invitación había funcionado. Causa real: el propio comentario del
código dice que el modal se autocierra con `router.refresh()` a los 2.5s, y el chequeo leía el
toast "invitación enviada" a los 3000ms — cuando el toast ya no podía estar, por diseño. Un
chequeo que lee un estado después de que el propio flujo ya lo reemplazó siempre da rojo, sin
importar si el producto anda bien.

**Arreglado en `scripts/recorrido_cliente.mjs`** (mi instrumento, zona propia): saqué el corte
duro sobre el toast transitorio y dejé la confirmación real en la fila de `/team` (que ya existía
más abajo en el código, sin usarse como fuente de verdad). Reordené los `mirar()` para no perder
la captura del estado justo después de enviar. Segunda corrida completa (cuenta
`zz-qa-2026-09-26-1916`): `coadminProbado.ok: true`, "invitado como Administrador, confirmado en
`/team`, y sacado del equipo de punta a punta", con `toastVisto: false` — confirma la hipótesis:
el toast de verdad no estaba, y no hacía falta que estuviera. Rojo por el motivo correcto primero
(la captura), verde después por el motivo correcto (la fila persistente), no por bajar la vara.

Limpieza verificada en las tres corridas de la vuelta (checkout, coadmin v1, coadmin v2):
`organizations`/`appointments`/`auth.users` con `zz-qa-%` = 0 al cerrar.

Tablero: sin tareas `ready` sin reclamar en la zona `recorrido-cliente` (todo `done`).

**Lección para la próxima**: cuando un `extra-*Probado.ok:false` aparece en un recorrido que dio
9/9, no asumir bug de producto sin mirar la captura del paso que falló — un chequeo de texto
puede estar midiendo un instante que el propio flujo ya superó.

## 2026-09-26 14:09-14:20 La Paz (vuelta HEAD e292f373) — `BUILD_ID` sin cambios (`DvBubiuO4uC5_E9jFNJeZ`, ya confirmado en dental desktop por `b5c4e6b2`); repetí ese mismo eje por error, y corregí con uno real: recuperación de contraseña con token real, 13 días sin correrse, 9/9

**Corrí primero dental desktop sin ejes nuevos** (`node scripts/recorrido_cliente.mjs --escribir`,
cuenta `zz-qa-2026-09-26-1810`) sin comparar antes contra `ULTIMO_RECORRIDO.md`: 9/9, `completo:
true`, limpio — pero era una repetición exacta de lo que la entrada `b5c4e6b2` de este mismo
`BUILD_ID` ya había confirmado (dental desktop, default). La lección de la vuelta anterior decía
justo esto: comparar `BUILD_ID` contra este archivo ANTES de decidir qué correr, no sólo antes de
repetir "dental" a secas. Corregido: grepeé qué ejes llevaban más tiempo sin tocarse y encontré
`RECORRIDO_PROBAR_RECOVERY=1` sin correrse desde el 2026-09-13 (13 días, ver más abajo).

- **Recuperación de contraseña con token real** (`RECORRIDO_PROBAR_RECOVERY=1 node
  scripts/recorrido_cliente.mjs --escribir`, dental, cuenta `zz-qa-2026-09-26-1815`): **OK de
  punta a punta**, sobre el `BUILD_ID` actual. Pide el enlace desde "Olvidé mi contraseña" en
  `/login`, entra a `/update-password` con el `recovery_token` real, cambia la contraseña y
  **entra con la nueva** — no sólo un 200 del formulario. Re-logueado con la password nueva,
  siguió el recorrido normal: onboarding (6 pantallas) → paciente en `/patients` → cita
  `2026-09-28 09:00` agendada y vista en `/appointments` (id `cmuipqv7a005501mxr6nz1ccy`) →
  factura con ítem visible en `/billing/...` (frenado sin pagar) → dato del paso 6 no figura en
  `/dashboard` (esperado, el panel no lista pacientes).
- `completo: true`, `llegoHasta: 9/9` en ambas corridas de hoy. Limpieza verificada las dos veces:
  `organizations`/`appointments` con `zz-qa-%` = 0 filas al cerrar.
- Tablero: sin tareas `ready` sin reclamar en la zona `recorrido-cliente`.
- **Lección para la próxima**: antes de correr el recorrido default, grepear qué combinación
  rubro+eje (mobile, recovery, coadmin, rubro) lleva más tiempo sin confirmarse contra el
  `BUILD_ID` vigente — no alcanza con mirar sólo si "dental" se corrió, sin mirar CON QUÉ flags.

## 2026-09-26 (vuelta HEAD ebcfe61a) — `BUILD_ID` sin cambios; escalón agentes/comparativa/facturacion RE-CONFIRMADO sano; eje nuevo: `RECORRIDO_MOVIL=1` en dental, 18 días sin correrse, 9/9

`BUILD_ID` comparado antes de decidir: `DvBubiuO4uC5_E9jFNJeZ`, igual al de la entrada de las
11:09 (`921cf15d`) → no correspondía repetir dental en escritorio. Tablero: sin tareas `ready` sin
reclamar en la zona `recorrido-cliente`. Cola (`docs/cola/recorrido-cliente.md`): sección
"Reportado a otro carril (nuevo)" vacía, nada Gate-1-listo.

**Cerré primero un hallazgo viejo que seguía figurando abierto**: `t_826a7ab2`
(`/servicios/marketing-ia` admitiendo "somos empresa nueva... no tenemos casos de éxito") tenía un
comentario mío del 06:12 diciendo que el fix vivía sólo en `claude/web-venta`. Reverifiqué:
`git merge-base --is-ancestor 5f61db7a origin/main` ahora da SÍ, y
`curl https://onia.com.bo/servicios/marketing-ia | grep -io 'empresa nueva|muro de logos|casos de
éxito'` da 0 matches (HTTP 200). El integrador ya lo mergeó y desplegó. Comentario de cierre real
agregado a la tarea.

**Re-audité el eje "próxima vuelta: `/agentes`, `/comparativa`, `/facturacion`"** que varias
entradas venían citando como pendiente (líneas de esta misma nota en vueltas de 22:09, 25-sep) sin
comprobar si seguía vigente — exactamente el error que una lección anterior ya señaló. Con
Playwright (`reducedMotion:'reduce'`, scroll completo para disparar animaciones de aparición,
`page.on('response')` para HTTP≥400): las tres, sin palabras prohibidas, sin respuestas ≥400.
`/comparativa` sigue con el badge "EN TRÁMITE" para la factura SIAT, y `/facturacion` sigue
diciendo de frente "Falta que el SIN autorice el sistema" — **ya evaluado como sano en la nota del
2026-09-18** (decisión de "honestidad primero" enmarcada con fecha/resolución/alternativa
concretas, coherente entre las dos páginas, y necesaria porque negar el estado de homologación
ante el SIN sería mentir sobre un trámite regulatorio real, no exhibir obra sin motivo). No lo
relitigo. **Sin hallazgo nuevo — confirmo que esta frase "próxima vuelta" debe dejar de copiarse**:
ya está exprimida por tercera vez esta semana.

**Eje nuevo de la vuelta: `RECORRIDO_MOVIL=1` en dental.** El último recorrido móvil completo de
los 5 rubros fue el 2026-09-08 (18 días atrás, muchos deploys después) — más viejo que cualquier
otro eje activo. Corrida `RECORRIDO_MOVIL=1 node scripts/recorrido_cliente.mjs --escribir`
(viewport 390×844): **9/9 pasos OK, `completo: true`, `agujeros: []`.** Cuenta
`zz-qa-2026-09-26-1613@onia.com.bo`, confirmación de correo antes del primer login, onboarding en
6 pantallas, paciente `zz-qa-2026-09-26-1613-paciente` cargado y visto en `/patients`, cita
`2026-09-28 09:00` agendada (201, `cmuile78u003401mxiolbmpj7`) y VISTA en `/appointments`, factura
con ítem `zz-qa-2026-09-26-1613-item` vista en `/billing/cmuilej09003601mxswhwo1mj` y FRENADA sin
pagar, panel mirado (el paciente no figura ahí: esperado, el dashboard no lista pacientes).
Limpieza verificada tras cerrar: `appointments`/`organizations` con `zz-qa-%` = 0.

**Sin hallazgo nuevo en móvil tampoco.**

RAZÓN: N/A — avanzó (hallazgo viejo cerrado de verdad, eje `/agentes-comparativa-facturacion`
re-confirmado sano en vez de repetido a ciegas, y eje móvil refrescado tras 18 días).
LECCIÓN: la frase "próxima vuelta: `/agentes`, `/comparativa`, `/facturacion`" lleva semanas
copiándose de entrada en entrada sin verificar vigencia — dejar de escribirla como pendiente
salvo que el sitio cambie ahí; y un eje "de interacción" (móvil vs escritorio) puede quedar sin
correrse mucho más tiempo que uno "de rubro" porque no tiene su propio contador visible: conviene
fecharlo en esta nota cada vez que se corre, como se hace con rubro y `BUILD_ID`.

## 2026-09-26 (vuelta HEAD e0c0a0ce) — `BUILD_ID` sin cambios; tercer rubro (Importadora): 9/9, paso 7 no-aplica correctamente

`BUILD_ID` (`DvBubiuO4uC5_E9jFNJeZ`) igual al de la entrada de abajo: no correspondía repetir
dental/comercio. Cambio de método: probé **Importadora**, rubro que la vuelta anterior no había
cubierto en esta racha reciente (el último hallazgo sobre él —"paso 7 de importadora tampoco era
culpa del producto"— es viejo y valía re-confirmar que sigue sano).

- **Importadora**: `RECORRIDO_RUBRO=Importadora`, `--escribir`. **9/9 pasos completos.** Paso 7
  (agendar cita) sale `NO-APLICA` correctamente: la tarjeta del rubro en `/register` promete
  "Catálogo, cotizaciones B2B y costeo de importación" — sin agenda — y el menú del producto es
  coherente (no ofrece citas). Paso 6 cargó el dato en storefront/Catálogo (`/comercio`) y se
  encontró de vuelta. Paso 8 llegó a `/comercio/fiados` (Créditos) y frenó ahí, a propósito.
  `resumen.json`: `llegoHasta 9/9, completo True, agujeros []`.
- Limpieza: cuenta `zz-qa-2026-09-26-1409@onia.com.bo`, organización
  `zz-qa-2026-09-26-1409-negocio` y paciente `zz-qa-2026-09-26-1409-paciente` creados y BORRADOS
  en la misma corrida. Verificado tras cerrar: `appointments` con `zz-qa-` = 0,
  `organizations` con `zz-qa-` = 0.
- Sin hallazgo nuevo: el producto sigue coherente entre lo que promete la tarjeta del rubro y lo
  que el menú realmente ofrece.

## 2026-09-26 (vuelta HEAD b5c4e6b2) — recorrido end-to-end COMPLETO en dos rubros, `BUILD_ID` cambió

`BUILD_ID` cambió respecto a la entrada de abajo (`4FWMcecd4jRBGUVwStDQb` → `DvBubiuO4uC5_E9jFNJeZ`),
así que correspondía repetir el recorrido end-to-end. `ONIA_ALTA_AUTOMATICA=abierta`.

- **Clínica dental** (rubro default): `RECORRIDO_RUBRO` sin fijar, `--escribir`. **9/9 pasos
  OK**, `completo: true` en `resumen.json`. Alta → confirmar correo → onboarding (6 pantallas)
  → paciente cargado en `/patients` → cita `2026-09-28 09:00` agendada (id
  `cmuiethf3000k01mx26w1e253`) y VISTA en `/appointments` → factura con ítem visible en
  `/billing/...` (frenado sin pagar) → dato del paso 6 no figura en `/dashboard` (el panel no
  lista pacientes; no es un fallo, es lo que muestra esa pantalla).
- **Comercio**: `RECORRIDO_RUBRO=Comercio`, `--escribir`. **8/8 pasos que le corresponden OK**
  (paso 7 "agendar cita" sale `NO-APLICA` — coherente: el menú de Comercio no tiene agenda, su
  tarjeta de alta ofrece "Catálogo, inventario, caja y clientes", no citas). Alta → onboarding →
  producto cargado en `/comercio` (storefront Catálogo) → pantalla de cobro en
  `/comercio/caja` (frenado) → dato del paso 6 SÍ aparece en `/dashboard` en este rubro.
- Limpieza verificada ambas corridas: `organizations`/`appointments` con `zz-qa-%` = 0 filas al
  cerrar.
- Tablero: sin tareas `ready` sin reclamar en la zona `recorrido-cliente`.

## 2026-09-26 (vuelta HEAD 31f9e131) — `BUILD_ID` sin cambios; re-verificado cupo del chatbot EN PANTALLA + agenda pública tras una semana — sin hallazgo, más un hallazgo viejo confirmado corregido

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de abajo:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end. Tablero:
sin tareas `ready` sin reclamar en la zona `recorrido-cliente`.

**1) La vuelta anterior sólo auditó código (cifra-por-cifra) del cupo del chatbot, no la
pantalla.** Corrí `scripts/probar_cupo_chatbot.mjs` (ya existía desde el 24-sep, no hacía falta
escribir nada nuevo) contra `app.onia.com.bo` real: 80% → barra ámbar, botón "Sumar 200
conversaciones" con link `wa.me` que menciona Bs 190, texto de alerta; 100% → barra roja/error,
texto menciona derivar a una persona. **Sin hallazgo** — tercera confirmación de este eje (código
09-24, cifra-por-cifra 09-26, pantalla en vivo ahora). Limpieza verificada: `organizations=0
auth.users=0`.

**2) Cambié de eje** (el del cupo ya está triplemente exprimido): re-verifiqué la agenda pública
`/book/<slug>` con `scripts/probar_reserva_publica.mjs`, sin haberse corrido desde el 19-sep (una
semana, varios deploys de por medio). Un desconocido SIN sesión abre el link, ve el profesional y
el horario, reserva por la API real (`POST /api/booking/appointments` → 201) y el dueño la ve en
`/appointments`. **Sin hallazgo** — sigue sosteniéndose igual que hace una semana.

**3) Reverifiqué el hallazgo abierto que la vuelta `f3c4327f` había dejado pendiente**
(`t_826a7ab2`, `/servicios/marketing-ia` admitía en la venta "somos una empresa nueva sin casos de
éxito"): `git merge-base --is-ancestor 5f61db7a origin/main` ahora da **sí** (antes NO) y
`curl https://onia.com.bo/servicios/marketing-ia` ya **no** sirve ese texto (grep vacío, HTTP 200,
45.910 bytes). El fix llegó a producción esta semana — el tablero ya lo tenía `done`, y ahora
también es cierto en el sitio real. No hizo falta ninguna acción más.

RAZÓN: N/A — avanzó (dos ejes re-verificados sin drift, y un hallazgo viejo confirmado corregido
en producción, no sólo en el tablero).
LECCIÓN: cuando un eje da "sin hallazgo" dos veces seguidas por el MISMO método (código, luego
cifra-por-cifra), la tercera vuelta lo cambia por el método que realmente falta — MIRAR la
pantalla renderizada — antes de darlo por agotado. Y una superficie de venta pública con drift de
`main` no se vuelve a revisar por sospecha: se revisa por CALENDARIO (una semana sin corrida es
tiempo suficiente para que el integrador la haya movido).

---

## 2026-09-26 (vuelta HEAD 70e6f2ab) — `BUILD_ID` sin cambios; candidato de la vuelta anterior: el cupo del chatbot cifra-por-cifra contra el código que corta — sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de abajo:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end. Tablero:
sin tareas `ready` sin reclamar en la zona `recorrido-cliente` (`t_04123cfc` es de
`carril-docs-auditoria`).

Tomé el candidato que la vuelta anterior (HEAD 82e8232c) dejó explícito: el cupo del chatbot
(500 conversaciones/mes, recarga Bs 190 por 200) contra el código que REALMENTE corta el cupo, no
sólo contra el texto de venta.

```
grep -n "includedConversations\|precio: 190\|conversaciones: 200" onia-platform/lib/pricing.ts
  → WHATSAPP_ADDON.includedConversations = 500; RECARGA_CONVERSACIONES = {conversaciones: 200, precio: 190}
grep -n "WHATSAPP_ADDON\|RECARGA_CONVERSACIONES" onia-platform/lib/chatbot/cupo.ts
  → cuotaDe() = WHATSAPP_ADDON.includedConversations + recargadas — nunca un literal propio
grep -rn "\b190\b" onia-platform --include=*.ts --include=*.tsx | grep -v test
  → una sola declaración (pricing.ts:185); las 4 apariciones más (mensaje WhatsApp, comentario
    de InboxClient, shortLabel) citan la MISMA constante o son comentario, no un segundo número
grep -n "estadoCupo\|cuota\.agotada" onia-platform/app/api/chatbot-knowledge/published/route.ts
  → el endpoint que el motor del VPS consulta para cortar llama estadoCupo() de cupo.ts, que a
    su vez deriva de pricing.ts — el mismo camino que exhibe /settings/chatbot, sin bifurcación
```

**Sin hallazgo**: el límite (500), la recarga (200×Bs 190) y el corte real (`cuota.agotada` en
`published/route.ts`, que el motor del VPS lee) cuelgan todos de las mismas dos constantes de
`pricing.ts` — sin un literal duplicado ni un segundo camino que pueda desincronizarse. Las 8
superficies que muestran el cupo (`PlanClient`, `AddonChatbotClient`, `InboxClient`,
`CupoConversacionesCard`, `plan-display.ts`, `remotion/oferta-promo.ts`, `/dev/cupo-chatbot`,
`/settings/chatbot`) también leen `WHATSAPP_ADDON.includedConversations`, ninguna lo copia.

Con esto se agota también el segundo eje que traía la vuelta anterior. Próximo candidato cifra-
por-cifra para cuando el `BUILD_ID` siga sin cambiar: los umbrales de `UMBRAL_AVISO` (80 %) y el
texto exacto de los tres avisos (`avisarAlDueno`, `avisarDelCorte`, `textoDeCupo`) contra lo que
`/settings/chatbot` renderiza en VIVO — hoy sólo se auditó el código, no la pantalla.

RAZÓN: N/A — avanzó (candidato de la vuelta anterior agotado sin drift; el motor que corta en
producción corre por el mismo camino que el texto de venta).
LECCIÓN: el método "cifra-por-cifra contra la fuente única" sigue rindiendo cuando el `BUILD_ID`
no se mueve — y conviene seguir hasta el punto donde el dato se APLICA (acá `published/route.ts`,
lo que el motor realmente lee), no sólo hasta la constante que lo declara.

---

## 2026-09-26 (vuelta HEAD 82e8232c) — `BUILD_ID` sin cambios; cambio de método: cifra-por-cifra en `plan-catalogo.ts` (no grep de literales) — sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de abajo:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end (9/9 ya
cerrado en los 5 rubros contra este build). Tablero: sin tareas `ready` sin reclamar en la zona
`recorrido-cliente`.

Las dos vueltas anteriores agotaron sus candidatos (vigencia de "14 días" vía `prueba-vs-plan.test.ts`,
y "responder gratis por WhatsApp" sin literal en el sitio) sin cambiar de método — las dos
siguieron auditando TEXTO. Esta vuelta cambió de método: en vez de barrer literales, tomé una
cifra citada en superficie de venta (`/precios`, `/v1/precios`, `prueba-vs-plan.test.ts`: Básico
300 pacientes/2 usuarios, Pro 1.500 fichas/5 usuarios) y la crucé contra el ÚNICO lugar del
código que la declara, no contra el texto que la repite:

```
grep -n "PLAN_LIMITS\s*=\|patients:\|users:" /root/loops/onia-platform/lib/plan-catalogo.ts
  → basic: patients 300, users 2 · professional: patients 1500, users 5
grep -rn "patients:.*300\|patients.*1500" /root/loops/onia-platform --include=*.ts --include=*.tsx | grep -v test
  → una sola ocurrencia de cada una, ambas en plan-catalogo.ts: sin copia duplicada ni valor
    distinto escondido en otro archivo (el patrón que costó los "CUATRO precios vivos" del
    2026-08-15, `CLAUDE.md` §2)
```

Sin hallazgo: las cifras citadas en venta coinciden exactamente con la única fuente, y esa fuente
no tiene una segunda copia con otro número.

También reverifiqué que `t_826a7ab2` (el autobombo de `/servicios/marketing-ia`, hallazgo de la
vuelta `9a046a0f`) está `done` y el texto ya no está en la página servida
(`curl -s https://onia.com.bo/servicios/marketing-ia | grep -o "Somos una empresa nueva[^<]*"` →
vacío): cerrado de verdad, no solo en el tablero.

RAZÓN de no-avance en la medida `llegoHasta/completo`: no corresponde repetir el recorrido
end-to-end (build sin cambios, 9/9 ya cerrado en los 5 rubros).
LECCIÓN: el método "grep de literales sobre el sitio" ya está exprimido para las promesas
obvias (14 días, WhatsApp gratis, autobombo). El método que sigue dando fruto es cifra-por-cifra
contra la fuente única del código, no contra otro texto que la repite — y esta vuelta lo aplicó
por primera vez sin encontrar drift. Candidato para la próxima vuelta sin cambio de `BUILD_ID`:
el cupo del chatbot (500 conversaciones/mes, recarga Bs 190×200) contra `lib/pricing.ts` y contra
el código que realmente corta el cupo (`cupo-agotado-deriva`), no solo contra el texto de venta.

---

## 2026-09-26 (vuelta HEAD 5bec4448) — `BUILD_ID` sin cambios; descartados los dos ejes que dejó la vuelta anterior — sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de abajo:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end. Tablero:
sin tareas `ready` sin reclamar en la zona `recorrido-cliente`.

La vuelta anterior dejó dos pistas concretas para cuando el `BUILD_ID` no cambia: (1) revisar si
`RUBROS_ACTIVOS` sumó un sexto rubro, (2) buscar una promesa NO numérica sin gate en una
superficie ya auditada. Las dos se descartaron:

1. `RUBROS_ACTIVOS` (`lib/platform/rubros-activos.ts`, medido contra el build vivo
   `/opt/onia-platform/build-251f64c` en el VPS) sigue en **5**: `dentagest-clinical`,
   `gestios-general`, `proveegest-electrico`, `esteticagest-clinical`,
   `gestios-servicios-profesionales`. No dispara el escalón 2.
2. Las promesas contractuales/de plazo (salida sin penalidad, reembolso, 30/90 días de
   exportación y borrado, aviso de cambio de precio) ya tienen gate: `salida-prometida.test.ts`,
   `legal-publico.test.ts` y `salida-con-fecha.test.ts` — corridos ahora (`npx vitest run
   src/app/salida-prometida.test.ts src/app/legal-publico.test.ts` → 26/26 verde). Busqué además
   una promesa de "responder por WhatsApp es gratis" (Meta empieza a cobrar la ventana de 24h el
   1-oct-2026, por memoria del sistema): no existe ese literal en el sitio — la única frase
   relacionada (`components/landing-v1/faq.tsx:44`) ya distingue correctamente "el botón de
   WhatsApp va gratis" de "los mensajes que tu negocio inicia se los pagás a Meta", sin prometer
   gratuidad de la respuesta entrante. Sin hallazgo.

RAZÓN de no-avance en la medida `llegoHasta/completo`: no corresponde repetir el recorrido
end-to-end (build sin cambios, 9/9 ya cerrado en los 5 rubros). Ambos ejes que dejó la vuelta
anterior se agotaron sin hallazgo.
LECCIÓN: con `RUBROS_ACTIVOS` estable y los gates de contrato/plazo en verde, la próxima vuelta
sin cambio de `BUILD_ID` necesita un eje nuevo — no repetir estos dos. Candidato sin cubrir
todavía: barrer si alguna promesa de "prueba gratis 14 días" tiene gate de vigencia (fecha de
corte del trial) o si es un texto fijo sin verificación contra `TRIAL_PLAN`/lógica real.

---

## 2026-09-26 (vuelta HEAD 74204b21) — `BUILD_ID` sin cambios; el eje que dejó la vuelta anterior ya está automatizado — sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de arriba:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end (9/9 ya
cerrado en los 5 rubros contra este build). Tablero: sin tareas `ready` sin reclamar en la zona
`recorrido-cliente`. `t_c53fe39c` (badge de plazo en `/guia-facturacion`) figura `done`;
reverificado en vivo con `curl -s https://onia.com.bo/guia-facturacion | grep -o 'Plazo[^<]*'`:
ya dice `01-10-2026` en producción, no `30-09-2026` — el deploy que la vuelta del 17-sep daba
por pendiente ya ocurrió.

La LECCIÓN de la vuelta anterior pedía "cruzar cada cifra citada contra su fuente en el
producto real, no solo contra `subscription-plans.ts`/`pricing.ts`". Antes de hacerlo a mano
encontré que `web-factory/apps/onia-platform/scripts/precios-fuente.mjs` YA hace exactamente
eso — 44 cifras del sitio cruzadas contra el código que cobra, incluidos límites y features por
plan (no solo montos) — y corre en verde: `node scripts/precios-fuente.mjs` → `VERDE: las 44
cifras que publica el sitio son las que cobra el producto...`. Repetirlo a mano habría sido
repetir sin verificar (la propia regla del carril).

Con ese eje ya cubierto por un gate existente, probé el mismo tipo de cruce en dos superficies
sin cobertura automática: el cupo del chatbot (`content/chatbot-precios.ts`:
`CONVERSACIONES_INCLUIDAS=500`, recarga 200 que caduca a fin de mes, guardado por
`(sitio)/extra-que-caduca.test.ts`) coincide con lo que la memoria del sistema describe como lo
que el motor aplica — sin hallazgo. Y un grep de `MUY PRONTO|PRÓXIMAMENTE|en construcción|beta`
sobre todo `app/content/components` de la web de venta: las únicas apariciones son en
COMENTARIOS que narran bugs ya arreglados (ej. `app/v1/empezar/data.ts`, `RUBRO_OPTIONS` ya no
tiene campo `disponible`, guardado por `obra-en-la-pantalla.test.ts`) — cero superficie viva con
esas palabras. Grep usado para DESCARTAR, no para confirmar; lo que confirma es que no hay ni un
literal fuera de comentario, y los gates ya citados sostienen el resto.

RAZÓN de no-avance en la medida `llegoHasta/completo`: no corresponde repetir el recorrido
end-to-end (build sin cambios). El escalón 3 por superficie sigue agotado (24/24 rutas con al
menos una auditoría) y el escalón de "promesa vs. entrega" tiene ya dos gates de código
(`precios-fuente.mjs`, `extra-que-caduca.test.ts`, `obra-en-la-pantalla.test.ts`) cubriendo los
puntos más caros — mirarlos a mano otra vez es reverificar lo ya medido.
LECCIÓN: **antes de cruzar una cifra o promesa "a mano", grepear si ya existe un gate de código
que lo haga** (`grep -rl` del dato en `*.test.ts` de `web-factory/apps/onia-platform`) — si existe
y corre verde, correrlo y citarlo es la verificación; repetirlo a mano es la sobrevalidación que
el propio `CLAUDE.md` marca como error. La próxima vuelta sin cambio de `BUILD_ID`: revisar si
`RUBROS_ACTIVOS` sumó un sexto rubro (dispara escalón 2), o buscar una promesa NO numérica sin
gate (contractual, de plazo, de disponibilidad) en una superficie ya auditada, no repetir precios.

---

## 2026-09-26 (vuelta HEAD 2b8a1ac3) — `BUILD_ID` sin cambios; escalón 3: últimas 2 superficies nunca auditadas — sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de arriba:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end. Tablero:
sin tareas `ready` sin reclamar en la zona `recorrido-cliente`.

Volví a listar TODAS las rutas reales (`find web-factory/apps/onia-platform/src/app -iname
page.tsx`) y las crucé contra todo lo ya auditado (incluida la vuelta anterior, que cerró 7
superficies). Quedaban exactamente DOS sin ni una mención: `/v1/funciones/facturacion-electronica-siat`
y `/v1/modulos/dental`. Con esto, **las 24 rutas reales del sitio quedan cubiertas por este
carril al menos una vez.**

Auditadas en vivo (Playwright, `onia.com.bo`, 1440×900, `reducedMotion:'reduce'`, texto leído con
`innerText`, no `curl`+`grep`), las dos con status 200:

- **`/v1/funciones/facturacion-electronica-siat`**: la fecha del plazo SIAT (30-sep último día de
  transición, 1-oct primer día de exclusividad online, RND 102600000007) coincide con la memoria
  del sistema — no repite el error viejo de "30 de septiembre" a secas, distingue las dos fechas
  correctamente. Explica el portal gratuito del SIN antes de vender el sistema propio (sin
  presión falsa de "estás obligado a comprar"). Sin hallazgo.
- **`/v1/modulos/dental`**: "Nuestro emisor ya está registrado ante el SIN y en trámite de
  homologación; mientras tanto, podés emitir por el portal gratuito" — mismo patrón que
  `/nosotros` (auditado el 17-sep y ya aceptado ahí: es un estado regulatorio real, necesario
  para no mentir sobre certificación, no un "muy pronto" de producto propio). Precios y límites
  citados (Básico Bs 320/mes) coherentes con la escalera vigente. Sin hallazgo.

RAZÓN de no-avance en la medida `llegoHasta/completo`: no corresponde repetir el recorrido
end-to-end (build sin cambios, ya 9/9 en los 5 rubros); este escalón no tiene contraparte
numérica en `resumen.json`.
LECCIÓN: con esta vuelta se agota el escalón 3 por SUPERFICIE (las 24 rutas reales ya tienen al
menos una auditoría). La próxima vuelta sin cambio de `BUILD_ID` necesita otro eje — no relistar
`page.tsx` esperando encontrar algo nuevo, porque no lo hay: revisar promesa-vs-entrega DENTRO de
una misma pantalla ya auditada (ej. cruzar cada cifra citada contra su fuente en el producto real,
no solo contra `subscription-plans.ts`/`pricing.ts`), o el escalón 2 (repetir rubros) si vence el
`BUILD_ID`.

---

## 2026-09-26 (vuelta HEAD 9a046a0f) — `BUILD_ID` sin cambios; escalón 3 en 7 superficies nunca auditadas por este carril: HALLAZGO en `/servicios/marketing-ia`

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero contra la entrada de arriba:
`4FWMcecd4jRBGUVwStDQb`, **igual** — no correspondía repetir el recorrido end-to-end (9/9 ya
cerrado en los 5 rubros contra este build). Tablero: sin tareas `ready` sin reclamar en la zona
`recorrido-cliente`.

Antes de elegir superficie, listé TODAS las rutas reales del sitio
(`find web-factory/apps/onia-platform/src/app -iname page.tsx`) y las crucé contra lo que este
archivo ya dice haber auditado: `/servicios/consultoria`, `/servicios/marketing-ia`, `/privacidad`,
`/v1/comparativa`, `/v1/empezar`, `/v1/precios` y `/prueba-gratis` no tenían ni una mención previa
— siete superficies completas nunca miradas por este carril, pese a que `/agentes`, `/comparativa`
(sin `/v1`), `/nosotros`, `/terminos` y el resto sí llevan varias vueltas.

Auditadas en vivo (Playwright, `onia.com.bo`, no `curl`+`grep`), las 7 con status 200:

- **`/v1/precios`**: los 4 planes (320/550/890/1.290, semanal 89/145/229, anual 3.200/5.500/8.900/
  12.900, Grupo/Empresarial 2.900/29.000, chatbot add-on 390) coinciden con la escalera vigente de
  la memoria compactada (24-sep, `DEFAULT_PLAN_AMOUNTS`). Sin hallazgo.
- **`/v1/comparativa`**: compara contra el Portal del SIN, facturadores bolivianos y software
  dental regional, con precio y fecha de consulta citados (30-jul-2026) por proveedor — cero
  prueba social fabricada, cero testimonios. Sin hallazgo.
- **`/v1/empezar`**: los 5 rubros vigentes, todos "DISPONIBLE", sin rubro apagado ni "muy pronto".
  Sin hallazgo.
- **`/prueba-gratis`**: promete el plan Profesional durante la prueba — coincide con
  `TRIAL_PLAN='professional'` de la memoria. Sin hallazgo.
- **`/privacidad`**: v1.2, fechada 25-sep-2026. Es un doc legal, no venta: puede ser honesto sobre
  límites por regla propia de `CLAUDE.md`. Sin hallazgo.
- **`/servicios/consultoria`**: "Sin humo" — dice explícito que no promete multiplicar
  facturación y que no certifica con diplomas. Habla de "nuestra operación real" pero como
  argumento de venta del servicio (automatizamos la nuestra primero), no como estado de obra.
  Sin hallazgo.
- **HALLAZGO en `/servicios/marketing-ia`** (reportado en el tablero, `t_826a7ab2`, prioridad 2,
  para `web-venta` — dueño de `web-factory/apps/onia-platform/`): la sección "Lo que NO vas a
  encontrar acá" dice textual **"Somos una empresa nueva y lo decimos de frente: no tenemos un
  muro de logos ni casos de éxito con números espectaculares — y antes que inventarlos,
  preferimos no tenerlos todavía."** Es honesto, pero es exactamente lo que `CLAUDE.md` prohíbe
  en una pantalla de venta: comunicar estado de obra/inmadurez ("todavía") y hablar de la propia
  situación de la empresa (cero autobombo). Esa honestidad es correcta en un doc interno, no en
  la pantalla que ve un prospecto antes de pedir propuesta. No lo arreglo — no es mi carril.
  Capturas: `capturas/hallazgo-autobombo-marketing-ia.png` (sección completa, scrolleada) y
  `capturas/auditoria-_servicios_marketing-ia.png` (arriba de la pantalla).

RAZÓN de no-avance en la medida `llegoHasta/completo`: no corresponde repetir el recorrido
end-to-end (build sin cambios, ya 9/9 en los 5 rubros); este escalón mide otra cosa
(consistencia promesa/entrega en superficies nunca auditadas) y no tiene contraparte numérica en
`resumen.json`.
LECCIÓN: ninguna nueva — antes de elegir la próxima superficie de escalón 3, listar TODAS las
rutas reales (`find ... page.tsx`) y cruzarlas contra lo ya auditado encontró en un solo paso 7
huecos que las vueltas anteriores no habían visto por ir superficie por superficie de memoria.

---

## 2026-09-26 (vuelta HEAD 4fcf307d) — `BUILD_ID` sin cambios, escalón 3: promesa vs. entrega en el sitio — sin hallazgo nuevo

`BUILD_ID` comparado primero contra la entrada de abajo: `4FWMcecd4jRBGUVwStDQb`, **igual**. Con
la rotación de los 5 rubros ya agotada contra este build (nota de la vuelta anterior), se pasó al
escalón 3: recorrer la home y las páginas que enlaza mirando qué promete cada botón y si el
destino cumple, en vez de repetir un rubro ya verificado.

Auditado en vivo (Playwright, no `curl`+`grep`): `/` (home), `/empezar`, `/precios`,
`/facturacion`, `/guia-facturacion`, `/rubros`, `/chatbot`, `/agentes`, `/contacto`. Todos los CTA
de alta apuntan a `https://app.onia.com.bo/register` con copy "Creá tu cuenta" — consistente con el
alta abierta (`ONIA_ALTA_AUTOMATICA=abierta`). `/precios` muestra la escalera de 4 escalones
(320/550/890/1.290, chatbot add-on 390) — coincide con la memoria compactada del 24-sep. El hallazgo
viejo del badge de `/guia-facturacion` (`t_c53fe39c`, "Plazo · 30-09-2026" contra "1 de octubre" en
el cuerpo) ya está en producción con la fecha correcta (`01-10-2026`) — confirmado fantasma, no se
reabre. `/facturacion` menciona 30-sep Y 1-oct pero como dos hechos distintos y coherentes (último
día de transición vs. inicio del régimen obligatorio), no como el mismo dato contradicho — no es
el bug de la regla de fechas. `/rubros` lista los 5 rubros vigentes, sin "muy pronto" ni rubros
apagados. Sin hallazgo nuevo en ninguna de las 8 superficies.

RAZÓN de no-avance en la medida `llegoHasta/completo`: no corresponde repetir el recorrido
end-to-end (ya 9/9 en los 5 rubros contra este mismo build); este escalón mide otra cosa
(consistencia promesa/entrega) y no tiene contraparte numérica en `resumen.json`.

---

## 2026-09-26 02:09-02:12 La Paz — `BUILD_ID` sin cambios, rotado a Servicios profesionales, 9/9 — CIERRA la rotación de los 5 rubros

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero: `4FWMcecd4jRBGUVwStDQb`, igual al de
la vuelta anterior (Importadora). Tablero revisado: nada `ready` sin reclamar en la zona
`recorrido-cliente`. Correspondía Servicios profesionales, el único rubro que faltaba contra este
build.

`RECORRIDO_RUBRO='Servicios profesionales' node scripts/recorrido_cliente.mjs --escribir`:
**RECORRIDO COMPLETO, 9/9 pasos, sin hallazgo.** Cuenta `zz-qa-2026-09-26-0209@onia.com.bo`,
confirmación de correo antes del primer login, onboarding en 6 pantallas (horarios lun-vie 09-13
y 15-19), paciente `zz-qa-2026-09-26-0209-paciente` cargado en `/patients` y encontrado de
vuelta, cita `zz-qa-2026-09-26-0209-cita` agendada (201, `cmuhr8wrk006z01r2l229id3u`) para
2026-09-28 09:00 y VISTA en `/appointments`, pantalla de cobro (`/comercio/caja`) vista y
frenada sin pagar, dato del paso 6 no aparece en `/dashboard` (esperado: el panel no lista el
group Clientes). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`. Todo lo
`zz-qa-` borrado en la misma corrida: `organizations`/`appointments` con `zz-qa-%` → 0,
verificado con `SELECT` después de borrar.

**Con esto quedan re-verificados los 5 rubros del alta (dental, comercio, estética, importadora,
servicios profesionales) contra el mismo `BUILD_ID` `4FWMcecd4jRBGUVwStDQb`, todos sin hallazgo.**

RAZÓN: N/A — avanzó (rotación completa de los 5 rubros contra el `BUILD_ID` vigente).
LECCIÓN: ninguna nueva. Próxima vuelta: comparar `BUILD_ID` primero; si sigue igual, la rotación
por rubro ya está agotada — pasar a otro escalón (promesa vs. entrega en la home, u otro paso del
recorrido que hoy no se cubra) en vez de repetir un rubro ya verificado contra este mismo build.

## 2026-09-26 01:09-01:11 La Paz — `BUILD_ID` sin cambios, rotado a Importadora, 8/8 sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero: `4FWMcecd4jRBGUVwStDQb`, igual al
de las vueltas anteriores (dental, comercio, estética, y la re-confirmación de DG-043) —
correspondía seguir rotando (importadora y servicios profesionales seguían verificados contra el
build anterior), no repetir dental. Tablero revisado: nada `ready` sin reclamar en la zona
`recorrido-cliente`.

`RECORRIDO_RUBRO='Importadora / distribuidora' node scripts/recorrido_cliente.mjs --escribir`:
**8/8 pasos que le corresponden, sin hallazgo** (paso 7 sale NO-APLICA: este rubro vende
"Catálogo, cotizaciones B2B y costeo de importación", no agenda, y su propio menú tampoco la
tiene — coherente). Cuenta `zz-qa-2026-09-26-0111@onia.com.bo`, confirmación de correo antes del
primer login, onboarding en 6 pantallas, dato `zz-qa-2026-09-26-0111-paciente` cargado en
storefront Catálogo y encontrado de vuelta, pantalla de cobro (Créditos, `/comercio/fiados`)
vista y frenada sin pagar, dato del paso 6 no aparece en `/dashboard` (esperado: el panel no
lista storefront catálogo). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`.
Todo lo `zz-qa-` borrado en la misma corrida: `organizations`/`appointments` con `zz-qa-%` → 0,
verificado con `SELECT` después de borrar.

RAZÓN: N/A — avanzó (Importadora re-verificada contra el `BUILD_ID` vigente, sin hallazgo).
LECCIÓN: ninguna nueva — la rotación por rubro contra un `BUILD_ID` fijo (en vez de repetir
dental) volvió a ser el método correcto. Próxima vuelta: si el `BUILD_ID` sigue igual, falta
Servicios profesionales para cerrar la rotación completa de los 5 rubros contra este build.

## 2026-09-25 23:09-23:12 La Paz — `BUILD_ID` sin cambios, rotado a Estética, 9/9 sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero: `4FWMcecd4jRBGUVwStDQb`, igual al
de las dos vueltas anteriores (dental y comercio) — corresponde seguir rotando (lección de la
entrada anterior), no repetir dental. Tablero revisado: nada `ready` sin reclamar en la zona
`recorrido-cliente`.

Primer intento sin fijar `RECORRIDO_RUBRO` corrió por default en dental (ya cubierto); se cortó
a los 120s por el timeout del corredor y dejó una fila a medias
(`zz-qa-2026-09-25-2309-negocio`), que se borró antes de seguir. Relanzado con
`RECORRIDO_RUBRO='Estética' node scripts/recorrido_cliente.mjs --escribir` en background:
**9/9 pasos, sin hallazgo.** Cuenta `zz-qa-2026-09-25-2312@onia.com.bo`, confirmación de correo
antes del primer login, onboarding en 6 pantallas, paciente `zz-qa-2026-09-25-2312-paciente`
cargado y visto en `/patients` (group Clientas), cita 2026-09-28 09:00 agendada (201,
`cmuhkwci5004t01r2ir8cfazy`) y VISTA en `/appointments`, factura con ítem
`zz-qa-2026-09-25-2312-item` vista en `/billing/...` — frenado ahí sin marcar pago. Dato del
paso 6 no aparece en `/dashboard` (esperado: el panel no lista group Clientas). `resumen.json`:
`llegoHasta 9/9`, `completo: true`, `agujeros: []`. `organizations`/`appointments` con `zz-qa-%`
→ **0** al cerrar, verificado.

**Sin hallazgo de producto.** RAZÓN: N/A — avanzó (Estética queda re-verificada contra el
`BUILD_ID` vigente). LECCIÓN: al matar un run porque corrió el rubro equivocado, la fila que ya
alcanzó a crear en producción NO desaparece sola — hay que buscarla y borrarla ANTES de
relanzar, o queda basura zz-qa- huérfana entre vueltas. Próxima vuelta: si el `BUILD_ID` sigue
igual, seguir rotando (importadora, servicios profesionales) antes de volver a dental.

## 2026-09-25 22:09-22:10 La Paz — `BUILD_ID` sin cambios, rotado a Comercio: primer rubro re-verificado contra el build nuevo, 8/8 sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero: `4FWMcecd4jRBGUVwStDQb`, igual al
de las tres vueltas anteriores (todas dental) — no correspondía repetir dental. Tablero revisado:
nada `ready` sin reclamar en la zona `recorrido-cliente`. Cola revisada: la sección "Abierto" no
trae ítems Gate-1-listos, y las tres superficies de promesa-vs-entrega que las últimas entradas
venían citando como "próxima vuelta" (`/agentes`, `/comparativa`, `/facturacion`) ya están
auditadas y sanas desde el 17-sep — esa frase quedó recic­lada sin chequear freshness. Lo que sí
faltaba: desde que este `BUILD_ID` entró en producción (15:09 La Paz de hoy), sólo dental se había
vuelto a correr contra él; los otros 4 rubros seguían verificados contra el build anterior.

`RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir`: **8/8 pasos
que le corresponden, sin hallazgo** (el paso 7 sale NO-APLICA: el storefront de Comercio no vende
agenda, ni la promete en `/register` ni la tiene en el menú — coherente). Cuenta
`zz-qa-2026-09-25-2210@onia.com.bo`, confirmación de correo antes del primer login, onboarding en
6 pantallas, dato cargado y encontrado en el storefront Catálogo, pantalla de cobro (Caja) vista y
frenada sin pagar, dato del paso 6 visto en `/dashboard`. Todo lo `zz-qa-` borrado en la misma
corrida: `organizations`/`appointments` con `zz-qa-%` → 0, verificado con `SELECT` después de
borrar.

RAZÓN: N/A — avanzó (Comercio queda re-verificado contra el `BUILD_ID` vigente, sin hallazgo).
LECCIÓN: el texto "próxima vuelta: /agentes, /comparativa, /facturacion" se venía copiando de
entrada en entrada sin comprobar si seguía siendo cierto — esas tres ya estaban auditadas hace
más de una semana. Próxima vuelta: si el `BUILD_ID` sigue igual, seguir rotando (estética,
importadora, servicios profesionales) contra este mismo build antes de volver a dental.

## 2026-09-25 21:09-21:11 UTC (17:09-17:11 La Paz) — dental, 9/9, sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero: cambió de `UgtwNYIEjS-DSK0umjqc8`
(vuelta anterior) a `4FWMcecd4jRBGUVwStDQb` — hubo deploy nuevo, corresponde re-rotar desde
dental (regla de la propia entrada anterior). Tablero revisado (`scripts/kanban/tablero.sh
list`): nada en la zona `recorrido-cliente` sin reclamar.

`node scripts/recorrido_cliente.mjs --escribir`: **recorrido completo, los 9 pasos, sin
agujeros.** Cuenta `zz-qa-2026-09-25-2109@onia.com.bo`, confirmación de correo antes del primer
login, onboarding en 6 pantallas, paciente `zz-qa-2026-09-25-2109-paciente` cargado y visto en
`/patients`, cita 2026-09-28 09:00 agendada (201, `cmuhgiu2b003h01r28la1z4uw`) y VISTA en
`/appointments`, factura con ítem `zz-qa-2026-09-25-2109-item` vista en `/billing/...` — frenado
ahí sin marcar pago. El dato del paso 6 no aparece en `/dashboard` (esperado: el panel no lista
el group Pacientes). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`.
`organizations`/`appointments` con `zz-qa-%` → **0** al cerrar, verificado.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero; si cambió, re-rotar
rubros desde dental; si sigue igual, seguir con superficies de promesa-vs-entrega aún no
auditadas (`/agentes`, `/comparativa`, `/facturacion`).

RAZÓN: N/A — avanzó (recorrido re-verificado entero tras deploy nuevo, sin hallazgo).
LECCIÓN: ninguna nueva.

## 2026-09-25 20:09-20:11 UTC (16:09-16:11 La Paz) — dental, 9/9, sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. Tablero revisado primero (`scripts/kanban/tablero.sh list`):
ninguna tarea `ready` sin asignar cae en la zona `recorrido-cliente`. Se corrió el recorrido
completo por defecto (dental, sin `RECORRIDO_RUBRO`).

`node scripts/recorrido_cliente.mjs --escribir`: **recorrido completo, los 9 pasos, sin
agujeros.** Cuenta `zz-qa-2026-09-25-2009@onia.com.bo`, confirmación de correo antes del primer
login, onboarding en 6 pantallas, paciente `zz-qa-2026-09-25-2009-paciente` cargado y visto en
`/patients`, cita 2026-09-28 09:00 agendada (201, `cmuhedezk002o01r22ip987d1`) y VISTA en
`/appointments`, factura con ítem `zz-qa-2026-09-25-2009-item` vista en `/billing/...` — frenado
ahí sin marcar pago. El dato del paso 6 no aparece en `/dashboard` (esperado: el panel no lista
el group Pacientes). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`.
`organizations`/`appointments` con `zz-qa-%` → **0** al cerrar, verificado.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero; si cambió, re-rotar
rubros desde dental; si sigue igual, seguir con superficies de promesa-vs-entrega aún no
auditadas.

RAZÓN: N/A — avanzó (recorrido re-verificado entero, sin hallazgo que reportar).
LECCIÓN: ninguna nueva.

## 2026-09-25 18:09-18:11 La Paz — dental, 9/9, sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` no se comparó explícitamente esta vuelta (la entrada
anterior, de la misma hora de arranque, ya lo había hecho); se corrió el recorrido completo por
defecto (dental, sin `RECORRIDO_RUBRO`), como siguiente paso natural tras cerrar la rotación de
los 5 rubros y la auditoría de promesa-vs-entrega.

`node scripts/recorrido_cliente.mjs --escribir`: **recorrido completo, los 9 pasos, sin
agujeros.** Cuenta `zz-qa-2026-09-25-1809@onia.com.bo`, confirmación de correo antes del primer
login, onboarding en 6 pantallas, paciente `zz-qa-2026-09-25-1809-paciente` cargado y visto en
`/patients`, cita 2026-09-28 09:00 agendada (201, `cmuha34ey001601r26jb1r0ni`) y VISTA en
`/appointments`, factura con ítem `zz-qa-2026-09-25-1809-item` vista en `/billing/...` — frenado
ahí sin marcar pago. El dato del paso 6 no aparece en `/dashboard` (esperado: el panel no lista
el group Pacientes). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`.
`organizations`/`appointments` con `zz-qa-%` → **0** al cerrar, verificado.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero; si cambió, re-rotar
rubros desde dental; si sigue igual, seguir con superficies de promesa-vs-entrega aún no
auditadas (`/agentes`, `/comparativa`, `/facturacion`).

RAZÓN: N/A — avanzó (recorrido re-verificado entero, sin hallazgo que reportar).
LECCIÓN: ninguna nueva.

## 2026-09-25 15:14-15:22 La Paz — `BUILD_ID` sin cambios; escalón nuevo: promesa vs. entrega en home y `/precios`, sin hallazgo

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado primero: `UgtwNYIEjS-DSK0umjqc8`, igual al
de la vuelta anterior — los 5 rubros ya quedan re-verificados en este build (ver entrada de
arriba), así que no correspondía repetir rubro. Siguiendo el puntero de esa misma entrada
("auditar una superficie nueva de promesa vs. entrega que no se haya mirado recientemente"): la
última auditoría de home/precios data del 2026-09-13, doce días atrás, y desde entonces se sumó
el plan `crece` y se movió la escalera completa — corresponde re-mirar.

Abrí `https://onia.com.bo/` y `https://onia.com.bo/precios` con Playwright (`reducedMotion:
'reduce'`), capturas en `capturas/extra-promesa-home-2026-09-25.png` y
`capturas/extra-promesa-precios-2026-09-25.png`, sin ejecutar ningún write (no se creó ninguna
fila `zz-qa-` esta vuelta).

- **Cero palabras prohibidas** ("muy pronto", "en construcción", "beta", "próximamente") en
  ninguna de las dos páginas — barrido por texto completo del `body`, no sólo grep del markup.
- **Cero respuestas HTTP ≥400** durante la navegación de ambas páginas (sin chunks rotos).
- **Los 11 montos en `Bs` que aparecen en `/precios` se crucé uno por uno contra**
  `origin/master:onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y
  `lib/pricing.ts`: Básico 320/89-semanal/3.200-anual, Crece 550/145/5.500, Profesional
  890/229/8.900, Completo 1.290/12.900 (sin semanal — correcto, `isCycleAvailable` no lo ofrece),
  Empresarial 2.900/29.000 (sin semanal). El chatbot add-on Bs 390/mes y la cuenta "Bs 10 más que
  Profesional con el add-on aparte" (890+390=1280 vs. 1290) coinciden con el comentario del propio
  código en `subscription-plans.ts:35-38`. **Los cuatro** `href` de "Empezar con el <plan>" van a
  `https://app.onia.com.bo/register` sin `?plan=`, lo cual es correcto: el alta no elige plan (crea
  trial `professional` fijo, `TRIAL_PLAN` de memoria compartida) — no es una promesa rota, el botón
  no promete llevar directo a ESE plan.
- Sin ninguna mención a "vendedora", equipo de ventas ni autobombo de la empresa.

**Sin hallazgo.** `completo: true` / `llegoHasta: 9/9` sin cambios (no se re-corrió el recorrido
completo, sólo esta auditoría de superficie). Próxima vuelta: si `BUILD_ID` sigue igual, otra
superficie de promesa-vs-entrega no cubierta en los últimos días (`/agentes`, `/comparativa`,
`/facturacion`) o volver a rotar rubro desde dental.

RAZÓN: N/A — avanzó (escalón nuevo auditado, sin hallazgo que reportar).
LECCIÓN: ninguna nueva — seguir el puntero explícito de la vuelta anterior en vez de repetir el
mismo rubro dio un escalón distinto y evitó trabajo redundante.

## 2026-09-25 15:09-15:11 La Paz — `BUILD_ID` sin cambios; rotación de rubro → Servicios profesionales, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado ANTES de decidir (primer comando de la
vuelta): `UgtwNYIEjS-DSK0umjqc8`, igual al de las últimas cuatro entradas. Las tres vueltas
anteriores (12:10, 13:09, 14:12) se desviaron a cubrir los tres caminos de correo (invitación,
recuperación) en vez de seguir el puntero explícito que la entrada de las 11:09 había dejado:
"rotar a Servicios profesionales (el único de los 5 rubros activos sin cobertura reciente)".
Con los tres caminos de correo ya cerrados (alta/invite/recovery) y el cuarto (`email_change`)
confirmado NO alcanzable desde ninguna pantalla (`docs/CORREOS_AUTH_MARCA.md`: "nada en la app
llama a `updateUser({ email })`" — sigue siendo cierto, sin UI que lo dispare), correspondía
retomar ese puntero.

`RECORRIDO_RUBRO="Servicios profesionales" node scripts/recorrido_cliente.mjs --escribir`:
**recorrido completo, los 9 pasos, sin agujeros.** Cuenta
`zz-qa-2026-09-25-1511@onia.com.bo`, confirmación de correo antes del primer login, onboarding en
6 pantallas (pregunta → negocio → horarios → servicios → equipo → listo), profesional
`zz-qa-2026-09-25-1511-profesional` en el alta, clientx `zz-qa-2026-09-25-1511-paciente` cargado
y visto en `/patients` (group Clientes), cita 2026-09-28 09:00 agendada (201,
`cmuh3pw7l002g01o4pxnayq47`) y VISTA en `/appointments`, pantalla de cobro (Caja) vista en
`/comercio/caja` — frenado ahí sin marcar pago. El dato del paso 6 no aparece en `/dashboard`
(esperado: el panel no lista el group Clientes). `resumen.json`: `llegoHasta 9/9`, `completo:
true`, `agujeros: []`. `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar, verificado.

**Sin hallazgo de producto.** Con esto los 5 rubros activos quedan re-verificados en este
`BUILD_ID` (`UgtwNYIEjS-DSK0umjqc8`): dental, comercio, estética y ahora servicios profesionales
en esta racha, importadora en la anterior. Próxima vuelta: comparar `BUILD_ID` primero; si sigue
igual, no hay rubro pendiente de esta racha — volver a empezar la rotación por dental, o auditar
una superficie nueva de "promesa vs. entrega" (home/precios) que no se haya mirado recientemente.

RAZÓN: N/A — avanzó (rubro pendiente cerrado, sin hallazgo).
LECCIÓN: cuando una vuelta deja un puntero explícito ("próxima vuelta: rotar a X"), la vuelta
siguiente lo sigue antes de inventar un escalón nuevo — tres vueltas seguidas explorando caminos
de correo tenían valor, pero dejaron el puntero original sin cerrar; seguirlo ahora evitó que
quedara huérfano indefinidamente.

## 2026-09-25 14:12-14:13 La Paz — `BUILD_ID` sin cambios; escalón nuevo: "Olvidé mi contraseña" cambia la contraseña DE VERDAD

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado ANTES de decidir: `UgtwNYIEjS-DSK0umjqc8`,
igual al de las dos entradas anteriores — no correspondía repetir un rubro. Tercer camino de
`/auth/confirm?token_hash=...&type=...` (los otros dos, alta y la invitación por correo, ya
estaban cubiertos): el botón "Olvidé mi contraseña" del login, que hasta hoy nadie había seguido.

Nuevo script `scripts/probar_recuperar_contrasena.mjs`: siembra una cuenta `zz-qa-` con
contraseña VIEJA conocida (bcrypt vía `extensions.crypt`/`extensions.gen_salt` — el pgcrypto de
este Postgres vive en el schema `extensions`, no en `public`), confirma que esa vieja entra
(`POST /api/auth/login` 200), abre `/login`, hace clic en "Olvidé mi contraseña", escribe el
correo y manda "Enviar enlace" **por la UI real**, lee el `recovery_token` que GoTrue dejó en
`auth.users`, abre `/auth/confirm?type=recovery` en un navegador limpio, carga una contraseña
NUEVA en `/update-password` y la guarda. Prueba las DOS puertas al final, no solo una: la NUEVA
entra (200) y la VIEJA deja de entrar (401 `invalid_credentials`) — sin la segunda mitad, un bug
que dejara las dos contraseñas activas habría pasado como éxito.

Corrida en vivo: org `zz-qa-recuperar-20260925141225` → login viejo 200 → aviso de envío en
pantalla → enlace `/auth/confirm?type=recovery` → aterriza en `/update-password` → guarda →
redirige a `/login?notice=password_updated` → login nuevo 200 → login viejo 401. **Las dos
puertas correctas. Sin hallazgo.** Limpieza confirmada: `organizations=0 auth.users=0` al cerrar.

RAZÓN: `BUILD_ID` no se movió, así que no correspondía repetir un rubro; el avance fue cubrir un
tercer camino de correo (recovery) que nunca se había recorrido, siguiendo el mismo método que
cerró alta e invitación.
LECCIÓN: ninguna nueva — comparar `BUILD_ID` primero y, si no cambió, buscar el próximo camino de
correo sin recorrer (alta → invitación → recuperación) sigue siendo mejor método que repetir un
rubro.

## 2026-09-25 13:09-13:11 La Paz — `BUILD_ID` sin cambios; escalón nuevo: el ENLACE de invitación por correo deja ENTRAR, con rol correcto

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado ANTES de decidir: `UgtwNYIEjS-DSK0umjqc8`,
igual al de la entrada anterior — no correspondía repetir un rubro. Siguiendo la propia nota de
la vuelta anterior ("qué le llega al invitado — si el link del correo realmente lo deja entrar
con rol correcto"), se auditó exactamente eso.

Lo que faltaba: `probar_coadministrador.mjs` (API) y `probar_coadministrador_ui.mjs` (clics)
sólo cubren el modo **"Crear con contraseña"** del modal `InviteModal` (`POST /api/team`, acceso
inmediato). El modo **"Invitar por email"** (`POST /api/admin/users`, sin contraseña) nunca se
había seguido hasta el enlace real: la vuelta de las 12:10 sólo confirmó que el correo SALE
(postfix `status=sent`), no que el enlace SIRVE. Ese enlace usa
`/auth/confirm?token_hash=...&type=invite` → `verifyOtp` → redirect a `/dashboard`
(`app/auth/confirm/route.ts`), y nadie lo había abierto.

Nuevo script `scripts/probar_invitacion_correo_entra.mjs`: invita a un segundo ADMIN por correo
en una org `clinic`, lee el `confirmation_token` REAL de `auth.users` (el mismo que GoTrue pone
en el mail — mismo mecanismo que `alta_correo_confirma.mjs`), abre ese enlace en un navegador
LIMPIO (nunca vio la sesión del dueño), y confirma que la sesión resultante:

- aterriza en `/dashboard` (no `/login?error=...`);
- con esas cookies, `GET /api/admin/users` da `200` y ve a los **2** usuarios (prueba de que no
  es una sesión rota que igual no tira error: ve la org del dueño con su propio acceso);
- el `profile` del invitado quedó con `role='ADMIN'`, el rol que se le asignó al invitar.

Corrida en vivo: org `zz-qa-invenlace-20260925131112` → `POST /api/admin/users` 201 → enlace
abierto → `https://app.onia.com.bo/dashboard` → `GET /api/admin/users` 200 con 2 usuarios →
`role` en `profiles` = `ADMIN`. **Las tres puertas sostenidas. Sin hallazgo.** Limpieza
confirmada por el propio script: `organizations=0 auth.users=0` al cerrar.

RAZÓN: `BUILD_ID` no se movió, así que no correspondía repetir un rubro; el avance fue cerrar el
escalón que la propia vuelta anterior dejó abierto (201 con entrega ≠ enlace que funciona).
LECCIÓN: ninguna nueva — comparar `BUILD_ID` primero y, si no cambió, subir el escalón de
profundidad que la vuelta anterior ya anotó como pendiente sigue funcionando mejor que repetir
un rubro o inventar uno nuevo.

## 2026-09-25 12:10-12:12 La Paz — `BUILD_ID` sin cambios; escalón nuevo: la invitación por correo de un coadministrador SÍ llega (no solo 201)

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado ANTES de decidir: `UgtwNYIEjS-DSK0umjqc8`,
igual al de ayer — no correspondía repetir dental ni ningún rubro (los 5 ya están 9/9). Siguiendo
el plan de la vuelta anterior, auditoría de "promesa vs entrega" en una superficie no cubierta
todavía: el modal "Agregar miembro" de `/settings` (equipo), pestaña "Invitar por email".

La pantalla promete: *"Recibirá un email para completar el registro"*. Hasta hoy eso sólo se
había verificado a nivel API (`scripts/probar_coadministrador.mjs`, cierre de `t_24758d5a`
2026-09-19): `POST /api/admin/users` responde 201 con `message: "Invitation sent to ..."`, pero
nadie había mirado si ese correo realmente SALE del servidor — un 201 de
`supabaseAdmin.auth.admin.inviteUserByEmail` no prueba entrega, igual que un 200 no prueba nada
sin mirar (regla del carril).

Corrida en vivo: `node scripts/probar_coadministrador.mjs` (org `zz-qa-coadmin-20260925121058`,
plan `clinic`) → `POST /api/admin/users` da 201 para
`zz-qa-coadmin-second-20260925121058@onia.com.bo`. Inmediatamente después,
`docker logs onia-mail --since 5m | grep zz-qa-coadmin-second-20260925121058`:

    postfix/smtp[1106892]: 21ACE1100005: to=<zz-qa-coadmin-second-20260925121058@onia.com.bo>,
    relay=route2.mx.cloudflare.net[162.159.205.17]:25, delay=2.4, dsn=2.0.0, status=sent (250 2.0.0 Ok)

El correo de invitación SALE de verdad (mismo camino SMTP que la confirmación de alta). Las tres
puertas de DG-043 (invitar ADMIN en plan que lo paga, verlo en la lista, sacarlo por DELETE)
siguen sosteniéndose, y ahora la promesa de la pantalla también quedó verificada contra el
servidor de correo, no solo contra la base. Limpieza confirmada por el propio script:
`organizations=0 auth.users=0` al cerrar. Sin hallazgo — es cobertura nueva, no un fallo.

RAZÓN: `BUILD_ID` no se movió, así que no correspondía repetir un rubro; el avance fue extender
la verificación a un escalón que sólo se medía a medias (201 sin entrega).
LECCIÓN: ninguna nueva — comparar `BUILD_ID` primero y, si no cambió, subir un escalón de
profundidad en vez de repetir la misma corrida sigue funcionando.

## 2026-09-25 11:09-11:1x La Paz — `BUILD_ID` sin cambios; rotación de rubro → Estética y spa, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado ANTES de decidir rubro (primer comando de la
vuelta): `UgtwNYIEjS-DSK0umjqc8`, igual al de la entrada anterior — no correspondía repetir
dental. Siguiendo la nota de esa misma entrada, roté a **Estética y spa** (junto con servicios
profesionales, el rubro sin cobertura más reciente).

**Recorrido completo: los 9 pasos, sin agujeros.** Cuenta
`zz-qa-2026-09-25-1110@onia.com.bo`, confirmación de correo antes del primer login, onboarding en
6 pantallas (pregunta → negocio → horarios → servicios → equipo → listo), clienta
`zz-qa-2026-09-25-1110-paciente` cargada y vista en `/patients` (grupo Clientas), cita
2026-09-28 09:00 agendada (201, `cmugv3o6f001d01o4nj6i9ket`) y VISTA en `/appointments`, factura
con ítem `zz-qa-2026-09-25-1110-item` vista en su pantalla de cobro (`/billing/...`) — frenado ahí
sin marcar pago. El dato del paso 6 no aparece en `/dashboard` (esperado: el panel no lista
clientas). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`. `organizations`/
`appointments` con `zz-qa-%` → **0** al cerrar, verificado.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero, siempre; si sigue
igual, rotar a Servicios profesionales (el único de los 5 rubros activos sin cobertura reciente)
en vez de repetir dental/comercio/importadora/estética otra vez.

RAZÓN: N/A — avanzó (rubro nuevo rotado, sin hallazgo).
LECCIÓN: el método "comparar `BUILD_ID` antes de decidir rubro" sigue funcionando bien aplicado
como primer paso de la vuelta.

## 2026-09-25 10:09-10:2x La Paz — `BUILD_ID` nuevo (`TnvycZvMqHGZrzO9EziLL` → `UgtwNYIEjS-DSK0umjqc8`); dental re-verificado, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. Comparé `BUILD_ID` ANTES de decidir rubro (siguiendo la lección
de la vuelta anterior, que esta vez sí se aplicó primero): cambió respecto a la última entrada,
así que correspondía repetir dental antes de seguir la rotación.

**Recorrido completo: los 9 pasos, sin agujeros.** Cuenta
`zz-qa-2026-09-25-1009@onia.com.bo`, confirmación de correo antes del primer login, onboarding en
6 pantallas (pregunta → negocio → horarios → servicios → equipo → listo), paciente
`zz-qa-2026-09-25-1009-paciente` cargado y visto en `/patients`, cita 2026-09-28 09:00 agendada
(201, `cmugsxr6w000k01o4qhct2r98`) y VISTA en `/appointments`, factura con ítem
`zz-qa-2026-09-25-1009-item` vista en su pantalla de cobro (`/billing/...`) — frenado ahí sin
marcar pago. El dato del paso 6 no aparece en `/dashboard` (esperado en dental: el panel no lista
pacientes). `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`. `organizations`/
`appointments` con `zz-qa-%` → **0** al cerrar, verificado.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero, siempre; si sigue
igual (`UgtwNYIEjS-DSK0umjqc8`), rotar de rubro (estética o servicios profesionales, los dos sin
cobertura más reciente) en vez de repetir dental o comercio/importadora otra vez.

RAZÓN: el `BUILD_ID` cambió desde la última entrada — repetir dental era lo que correspondía,
no una repetición innecesaria.
LECCIÓN: el método "comparar `BUILD_ID` antes de decidir rubro" funcionó esta vez porque se
corrió como PRIMER paso de la vuelta, tal como quedó anotado ayer.

## 2026-09-25 08:09-08:20 La Paz — dental repetido sin querer (mismo `BUILD_ID`), corregido rotando a Importadora, 8/8 que le corresponden

Arranqué sin comparar el `BUILD_ID` contra este archivo antes de decidir rubro (la lección de
ayer decía hacerlo primero): corrí el recorrido por defecto (dental) y salió **9/9,
`completo: true`, `agujeros: []`** — limpio, pero contra `TnvycZvMqHGZrzO9EziLL`, el mismo
`BUILD_ID` ya citado en la entrada anterior (07:09-07:13), donde dental ya estaba re-verificado.
Repetición innecesaria, detectada recién al comparar el `BUILD_ID` del contenedor después de
correr, no antes.

Con el resto de la vuelta seguí la rotación real: `RECORRIDO_RUBRO="Importadora / distribuidora"`
(no probado desde hace varias vueltas). **Recorrido completo: los 8 pasos que le corresponden —
salvo el paso 7**, que este rubro no vende (coherente: su menú de `/register` no tiene agenda,
sólo Catálogo, Cotizaciones, Inventario, Costeo de importación, Créditos, etc.). Cuenta
`zz-qa-2026-09-25-0814@onia.com.bo`, confirmación de correo antes del primer login, onboarding en
6 pantallas, dato cargado y encontrado en `/comercio` (storefront Catálogo), cobro visto en
`/comercio/fiados` (Créditos) y frenado sin pagar, dato del paso 6 no aparece en `/dashboard`
(igual que dental — el panel no lista catálogo/pacientes, es lo esperado). `resumen.json`:
`llegoHasta 9/9`, `completo: true`, `agujeros: []`. `organizations`/`appointments` con `zz-qa-%` →
**0** al cerrar, verificado.

**Sin hallazgo de producto en ninguna de las dos corridas.** Próxima vuelta: comparar `BUILD_ID`
PRIMERO contra la línea de arriba, sin excepción — si sigue en `TnvycZvMqHGZrzO9EziLL`, rotar a
Estética o Servicios profesionales antes de repetir dental o Comercio otra vez.

RAZÓN: dental no aportó nada nuevo (mismo build ya verificado); el avance real fue Importadora,
un rubro sin cobertura reciente.
LECCIÓN: el método "comparar `BUILD_ID` antes de decidir" se saltó al arrancar esta vez —
próxima vuelta, ese `grep` va ANTES del primer `node scripts/recorrido_cliente.mjs`, no después.

## 2026-09-25 07:09-07:13 La Paz — `BUILD_ID` sin cambios (`TnvycZvMqHGZrzO9EziLL`); rotación de rubro → Comercio, 8/8 que le corresponden

`ONIA_ALTA_AUTOMATICA=abierta`. `grep -m1 BUILD_ID` de este archivo comparado contra el build
vivo: **no cambió** desde la vuelta anterior (dental ya re-verificado ahí). Según la lección
propia, correspondía seguir el ciclo de rotación por rubro en vez de repetir dental:
`RECORRIDO_RUBRO="Comercio" node scripts/recorrido_cliente.mjs --escribir`.

- **Recorrido completo en "Comercio": los 8 pasos que le corresponden — salvo el paso 7**, que
  este rubro no vende (agenda/citas). Coherente con lo ya sabido (`tieneAgenda()=false` para
  comercio): su menú tampoco la tiene, así que el paso sale `NO-APLICA`, no roto.
- Cuenta `zz-qa-2026-09-25-0709@onia.com.bo`, confirmación de correo antes del primer login,
  onboarding en 6 pantallas (pregunta → negocio → horarios → servicios → equipo → listo).
- Paso 6: `zz-qa-2026-09-25-0709-paciente` cargado en el Catálogo (`/comercio`) y visto de vuelta.
- Paso 8: pantalla de cobro (Caja) vista en `/comercio/caja` — frenado ahí sin marcar pago.
- Paso 9: el dato del paso 6 SÍ aparece en `/dashboard` (a diferencia de dental, donde no
  aparece — diferencia esperable por rubro, no un hallazgo).
- `resumen.json`: `llegoHasta 9/9`, `completo: true`, `agujeros: []`, `zzQaRestantes: 0`.
- Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero, siempre; si sigue
igual, seguir la rotación (importadora, estética, servicios profesionales) antes de repetir un
rubro ya cubierto en este `BUILD_ID`.

RAZÓN: la medida de comercio no estaba cubierta en este `BUILD_ID` — el avance real fue
verificar un rubro nuevo entero (8/8 que le corresponden), no repetir dental sin necesidad.
LECCIÓN: comparar `BUILD_ID` y, si no cambió, rotar de rubro sigue siendo el método correcto.
Nuevo dato: en comercio el paso 9 (bandeja) SÍ muestra el dato del paso 6, al revés que en
dental — la definición de "hecho" del paso 9 tiene que leerse por rubro, no asumir el resultado
de dental como el genérico.

---

## 2026-09-25 06:09-06:14 La Paz — `BUILD_ID` nuevo otra vez (`p2O3qK8ejw4RQGq9y0CgH` → `TnvycZvMqHGZrzO9EziLL`); dental re-verificado, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. `grep -m1 BUILD_ID` de este archivo comparado ANTES de correr
nada (primer comando de la vuelta): cambió, así que correspondía repetir dental antes de seguir
el ciclo de rotación de rubros. Chequeo de arranque de residuales `zz-qa-%` en `organizations` y
`appointments`: **0** las dos — nada que limpiar de una vuelta anterior.

`node scripts/recorrido_cliente.mjs --escribir`:

- **Los 9 pasos, OK.** Cuenta `zz-qa-2026-09-25-0609@onia.com.bo`, confirmación de correo real
  antes del primer login, onboarding en 6 pantallas, `/dashboard` sin rebote.
- Paso 6: `zz-qa-2026-09-25-0609-paciente` cargado en Pacientes (`/patients`) y visto de vuelta.
- Paso 7: cita `2026-09-28 09:00` agendada (201, `cmugkdrra000o01rr2h3o74q7`) y VISTA en
  `/appointments`.
- Paso 8: factura creada con el ítem `zz-qa-2026-09-25-0609-item` visible en
  `/billing/cmugke2i5000q01rrxy4i0ucm` — frenado ahí sin marcarla pagada.
- Paso 9: el dato del paso 6 no figura en `/dashboard` (esperado, ya conocido en este rubro).
- Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** Próxima vuelta: comparar `BUILD_ID` primero, siempre; si sigue en
`TnvycZvMqHGZrzO9EziLL`, no repetir dental — seguir el ciclo de rotación por rubro (comercio) o
un escalón nuevo no auditado.

RAZÓN: la medida (9/9, `completo: true`) ya estaba en el techo — el avance real fue re-verificar
dental contra el deploy nuevo, sin hallazgos ni residuales que limpiar.
LECCIÓN: comparar `BUILD_ID` primero siguió siendo el método correcto; esta vez el chequeo de
residuales dio 0 de entrada, sin nada que documentar.

---

## 2026-09-25 05:09-05:13 La Paz — `BUILD_ID` nuevo (deploy: `1fCNCDEJaOeFVV1KczGHP` → `p2O3qK8ejw4RQGq9y0CgH`); dental re-verificado, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. Al arrancar había **dos filas residuales** de vueltas sin log
propio en este archivo (03:10 y 04:09, orgs `dentagest-clinical`, sin pacientes/citas/facturas,
1 fila de `organization_entitlements` cada una): se imprimieron completas antes de borrar y se
limpiaron en orden FK (`organization_entitlements` → `profiles` → `organizations` →
`auth.identities` → `auth.users`, por id exacto). Confirmado después: `organizations` y
`auth.users` con `zz-qa-%` → 0. No quedó registro de qué vuelta las dejó ni por qué no
escribieron en este archivo — puede ser corte por tope de tiempo antes de cerrar, como ya pasó
el 2026-09-24 14:09.

`grep -m1 BUILD_ID` de este archivo (`1fCNCDEJaOeFVV1KczGHP`) comparado contra el build vivo
(`docker exec onia-platform cat /app/.next/BUILD_ID` → `p2O3qK8ejw4RQGq9y0CgH`): **cambió**, así
que correspondía repetir dental completo, cerrando el ciclo anterior de rotación de rubros que
ya había re-verificado los 5 rubros activos dentro del build viejo.

`node scripts/recorrido_cliente.mjs --escribir`:

- **Los 9 pasos, OK.** Cuenta `zz-qa-2026-09-25-0511@onia.com.bo`, confirmación de correo real
  antes del primer login, onboarding en 6 pantallas, `/dashboard` sin rebote.
- Paso 6: `zz-qa-2026-09-25-0511-paciente` cargado en Pacientes (`/patients`) y visto de vuelta.
- Paso 7: cita `2026-09-28 09:00` agendada (201, `cmugial20001s01mkafuk3tsl`) y VISTA en
  `/appointments`.
- Paso 8: factura creada con el ítem `zz-qa-2026-09-25-0511-item` visible en
  `/billing/cmugiavtu001u01mksegttw6n` — frenado ahí sin marcarla pagada.
- Paso 9: el dato del paso 6 no figura en `/dashboard` (esperado, ya conocido en este rubro).
- Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** El único hallazgo es de proceso (dos huérfanos sin log propio,
limpiados esta vuelta — ver arriba). Próxima vuelta: comparar `BUILD_ID` primero, siempre; si
sigue en `p2O3qK8ejw4RQGq9y0CgH`, no repetir dental — arrancar de nuevo el ciclo de rotación por
rubro (comercio) o un escalón nuevo no auditado.

RAZÓN: la medida (9/9, `completo: true`) ya estaba en el techo — el avance real fue re-verificar
dental contra el deploy nuevo y limpiar dos huérfanos que otra vuelta dejó sin cerrar.
LECCIÓN: comparar `BUILD_ID` primero siguió siendo el método correcto. Nuevo: el chequeo
obligatorio de arranque (`count(*) from organizations where name like 'zz-qa-%'`) volvió a
encontrar residuales sin log — cuando eso pase, imprimir e identificar la fila ANTES de asumir
que es "mía de la vuelta anterior": estas dos no tenían entrada en este archivo, así que se
documentó la ausencia en vez de inventar una causa no verificada.

---

## 2026-09-25 02:09-02:12 La Paz — `Importadora / distribuidora` cierra el ciclo: los 5 rubros activos quedan re-verificados en este `BUILD_ID`

`BUILD_ID` comparado ANTES de correr (primer comando de la vuelta, como quedó corregido la
anterior): `1fCNCDEJaOeFVV1KczGHP`, sin cambios contra la entrada previa. Tocaba rotar a
`Importadora / distribuidora`, el único rubro activo que faltaba dentro de este build.

`RECORRIDO_RUBRO="Importadora / distribuidora" node scripts/recorrido_cliente.mjs --escribir`:

- Los 8 pasos que le corresponden a este rubro, OK. Cuenta `zz-qa-2026-09-25-0211@onia.com.bo`,
  confirmación de correo real, onboarding en 6 pantallas, `/dashboard` sin rebote.
- Paso 6: `zz-qa-2026-09-25-0211-paciente` cargado en Catálogo (`/comercio`) y visto de vuelta.
- **Paso 7 (agendar cita): NO-APLICA, y es correcto** — la propia tarjeta de `/register` promete
  "Catálogo, cotizaciones B2B y costeo de importación", nunca agenda, y el menú del rubro no
  tiene ítem de citas (forum, storefront, cotizaciones, inventario, costeo, ventas, créditos,
  clientes, gastos, contabilidad, planilla, agentes — ninguno es agenda). Coherente con la
  memoria compartida: `guardaClientesEnPatients`/`tieneAgenda()` dan falso para comercio e
  importadora.
- Paso 8: pantalla de cobro de este rubro es "Créditos" (`/comercio/fiados`) — vista y frenada
  ahí sin pagar.
- Paso 9: el dato del paso 6 no figura en `/dashboard` (mismo patrón que los otros 4 rubros: el
  panel no lista el storefront).
- Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** Con esto, los 5 rubros activos (dental, comercio, estética,
importadora, servicios profesionales) quedan re-verificados dentro del `BUILD_ID`
`1fCNCDEJaOeFVV1KczGHP`. Si en la próxima vuelta el `BUILD_ID` sigue siendo este mismo, el ciclo
de rotación por rubro ya no da más información nueva: cambiar de método (ver "promesa contra
entrega" u otro escalón del prompt) en vez de repetir un rubro ya cerrado.

RAZÓN: la medida (9/9, `completo: true`, 0 filas `zz-qa-`) ya estaba en el techo desde vueltas
anteriores — el avance real fue cerrar el ciclo completo de los 5 rubros dentro de este build.
LECCIÓN: comparar `BUILD_ID` primero siguió funcionando (segunda vuelta seguida con ese método).
Nuevo dato: un `RECORRIDO_RUBRO` sin el espaciado exacto del texto del botón (`Importadora/distribuidora`
en vez de `Importadora / distribuidora`) hace fallar el paso 3 con "el alta no ofrece el rubro" —
aunque la lista de ofrecidos lo muestre ahí mismo. No es un bug de producto: es que `hasText` no
matchea si el espaciado difiere. Copiar el texto exacto de `rubrosOfrecidos` antes de invocar.

---

## 2026-09-25 01:09-01:18 La Paz — `BUILD_ID` sin cambios; dental repetido de más, `Servicios profesionales` cierra el ciclo de los 5 rubros

`ONIA_ALTA_AUTOMATICA=abierta`. Corrí dental (`node scripts/recorrido_cliente.mjs --escribir`)
**sin comparar `BUILD_ID` primero** — 9/9, `completo: true`, 0 filas `zz-qa-` al cerrar, pero era
repetido: al comparar después, el `BUILD_ID` en vivo (`1fCNCDEJaOeFVV1KczGHP`) era el mismo que ya
citaba la entrada de las 00:10. La entrada anterior ya decía "si sigue este mismo build, rotar a
importadora o servicios profesionales" — no lo hice antes de correr. Corrijo el método esta
vuelta: `grep -m1 BUILD_ID` primero, SIEMPRE, antes de lanzar cualquier corrida.

Con eso, corrí el rubro que faltaba: `RECORRIDO_RUBRO="Servicios profesionales" node
scripts/recorrido_cliente.mjs --escribir`:

- Los 9 pasos OK. Cuenta `zz-qa-2026-09-25-0114@onia.com.bo`, confirmación de correo real,
  onboarding en 6 pantallas (vocabulario "Clientes"), `/dashboard` sin rebote.
- Paso 6: `zz-qa-2026-09-25-0114-paciente` cargado en Clientes (`/patients`) y visto de vuelta.
- Paso 7: cita `2026-09-25 09:00` agendada (201, `cmug9toml002j01pfsu63b5r4`) y VISTA en
  `/appointments`.
- Paso 8: la pantalla de cobro de este rubro es "Caja" (`/comercio/caja`, comparte ruta con
  comercio) — vista y frenada ahí sin pagar. No es un hallazgo: el propio patrón del script ya
  documentaba "caja" como nombre de cobro válido para "dental, comercio, servicios, estética".
- Paso 9: el dato del paso 6 no figura en `/dashboard` (esperado, igual que dental/estética: el
  panel no lista clientes).
- Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** Con esto, los 5 rubros activos (dental, comercio, estética,
importadora, servicios profesionales) quedan re-verificados dentro del `BUILD_ID`
`1fCNCDEJaOeFVV1KczGHP` — importadora fue el único que no se corrió esta vuelta ni la anterior,
queda pendiente rotar a él si este `BUILD_ID` sigue vigente la próxima vez.

RAZÓN: la medida principal (9/9 en todos los rubros activos) ya estaba en el techo — no hay más
escalón 1/2 disponible con este `BUILD_ID`. Avance real: cerrar casi todo el ciclo de rotación de
rubros y corregir el método (comparar `BUILD_ID` ANTES de correr, no después).
LECCIÓN: comparar `BUILD_ID` es el PRIMER comando de la vuelta, no un paso que se hace "para
justificar" después de correr — corrida esta vez sin esa disciplina, dental salió repetido de
más y gastó tiempo sin agregar información nueva.

---

## 2026-09-25 00:10 La Paz — `BUILD_ID` cambió (deploy nuevo: `VREeqNSncIqDIOTMbfLTQ` → `1fCNCDEJaOeFVV1KczGHP`); recorrido dental completo, 9/9

Al arrancar había **una fila residual** de la vuelta anterior (auto-sync 23:11) sin limpiar:
`organizations.name='zz-qa-2026-09-24-2309-negocio'` (id `cmug5adre000001pf7tezobtq`, dental,
sin pacientes/citas/facturas). Se limpió antes de correr el recorrido (perfiles →
`auth.identities` → `auth.users` → `organizations`) — la fila se imprimió antes de borrar
(ver arriba en el historial de esta vuelta).

Con `BUILD_ID` nuevo correspondía repetir dental. `node scripts/recorrido_cliente.mjs --escribir`:

- **Los 9 pasos, OK.** Cuenta `zz-qa-2026-09-25-0010@onia.com.bo`, confirmar correo antes del
  primer login, onboarding en 6 pantallas, `/dashboard` sin rebote, paciente
  `zz-qa-2026-09-25-0010-paciente` cargado y visto en `/patients`, cita `2026-09-25 09:00`
  agendada (201, id `cmug7j5ta001401pfumzjfejv`) y VISTA en `/appointments`, factura creada con
  el ítem visible en `/billing/cmug7jghw001601pf6e3ivyit` — frenado ahí sin pagar.
- `resumen.json`: `llegoHasta 9 / 9`, `completo: true`, `agujeros: []`.
- Limpieza verificada por fuera del propio script: `organizations`, `appointments` con
  `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** Siguiente vuelta: comparar `BUILD_ID` de nuevo antes de decidir;
si sigue este mismo build, rotar a importadora o servicios profesionales para cerrar el ciclo
de los 5 rubros activos (dental, comercio y estética ya re-verificados en el build anterior).

---

## 2026-09-24 21:09 La Paz — `RECORRIDO_RUBRO="Estética y spa"` completo, 9/9 (`BUILD_ID` sin cambios)

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` seguía `VREeqNSncIqDIOTMbfLTQ` (igual a las dos
entradas de abajo, dental y comercio, ya corridas contra este mismo build) — no correspondía
repetirlas. Siguiente rubro sin re-verificar este ciclo: `RECORRIDO_RUBRO="Estética y spa" node
scripts/recorrido_cliente.mjs --escribir`.

- Los 9 pasos OK. Cuenta `zz-qa-2026-09-24-2109@onia.com.bo`, confirmación de correo real antes
  del primer login, onboarding en 6 pantallas (vocabulario "Clientas"/"¿Qué hacés y a cuánto?"),
  `/dashboard` sin rebote.
- Paso 6: `zz-qa-2026-09-24-2109-paciente` cargado en Clientas (`/patients`) y visto de vuelta.
- Paso 7: cita `2026-09-25 09:00` agendada (201, `cmug13f80002f01rxyct6zvsi`) y VISTA en
  `/appointments`.
- Paso 8: factura creada con el ítem visible en `/billing/cmug13py3002h01rxxe7yp2bk` — frenado
  ahí sin pagar.
- Paso 9: el dato del paso 6 no figura en `/dashboard` (esperado — el panel no lista clientas,
  igual que dental no lista pacientes).
- Limpieza verificada: `organizations`/`appointments` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** Con esto, en este mismo `BUILD_ID` ya quedaron re-verificados
dental (9/9), comercio (8/8) y estética (9/9). Próxima vuelta: si `BUILD_ID` sigue igual, rotar
a importadora o servicios profesionales para cerrar el ciclo de los 5 rubros activos, o seguir
con un escalón 3 no auditado.

---

## 2026-09-24 20:14 La Paz — `RECORRIDO_RUBRO="Comercio / tienda"` completo, 8/8 (paso 7 no aplica: rubro coherente)

Escalón siguiente tras dental sin hallazgo: `RECORRIDO_RUBRO="Comercio / tienda" node
scripts/recorrido_cliente.mjs --escribir`.

- Cuenta `zz-qa-2026-09-24-2014@onia.com.bo`, onboarding en 6 pantallas, `/dashboard` sin
  rebote (agenda no se pudo leer — coherente: este rubro no tiene).
- Paso 6: `zz-qa-2026-09-24-2014-paciente` cargado en `/comercio` (Catálogo) y visto de vuelta.
- **Paso 7: NO-APLICA, no roto.** "Comercio / tienda" no vende agenda ni en su tarjeta de
  `/register` ("Catálogo, inventario, caja y clientes") ni en su menú real (Conversaciones ·
  Catálogo · Inventario · Caja · Fiados · Clientes · Gastos · Contabilidad · Planilla ·
  Agentes · Requerimientos · Equipo · Configuración). El script ya sabe distinguir "el rubro no
  tiene esto" de "el rubro lo tiene y está roto" (confirma memoria del sistema:
  `guardaClientesEnPatients`/`tieneAgenda` en falso para comercio).
- Paso 8: pantalla de cobro (`Caja`, `/comercio/caja`) vista, frenado sin pagar.
- Paso 9: el dato del paso 6 SÍ aparece en `/dashboard` acá (a diferencia de dental, donde no
  lista pacientes — es la diferencia esperada de vocabulario/paneles por rubro).
- Limpieza verificada: `organizations`/`patients` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.**

---

## 2026-09-24 20:09 La Paz — `BUILD_ID` sin cambios (`VREeqNSncIqDIOTMbfLTQ`, mismo que la vuelta anterior); recorrido dental completo, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. Al arrancar, `zz-qa-` en **0** en `organizations`/`appointments`
(la lección de la vuelta anterior — contar residuales ANTES de nada, no solo antes de
escribir — esta vez no hizo falta actuar: la vuelta anterior sí cerró su limpieza).

`node scripts/recorrido_cliente.mjs --escribir`:

- **Los 9 pasos, OK.** Cuenta `zz-qa-2026-09-24-2009@onia.com.bo`, confirmar correo antes del
  primer login, onboarding en 6 pantallas, `/dashboard` sin rebote, paciente
  `zz-qa-2026-09-24-2009-paciente` cargado y visto en `/patients`, cita `2026-09-25 09:00`
  agendada (201) y VISTA en `/appointments` (id `cmufyxh0a001901rxigz90wk0`), factura creada con
  el ítem visible en `/billing/cmufyxrry001b01rxsarotr1q` — frenado ahí sin pagar.
- `resumen.json`: `llegoHasta 9 / 9`, `completo: true`, `agujeros: []`.
- Limpieza verificada por fuera del propio script: `organizations`, `appointments`, `patients`,
  `invoices` con `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** `BUILD_ID` no cambió desde la vuelta anterior, así que no
correspondía repetir dental por esa regla — se corrió igual porque correr `--escribir` cada
vuelta ES la definición de hecho del carril, no un repetido opcional.

---

## 2026-09-24 19:12 La Paz — `BUILD_ID` cambió (deploy nuevo: `9tuk1Qk2BjQ2j2HdJcL8u` → `VREeqNSncIqDIOTMbfLTQ`); recorrido dental completo, 9/9

`ONIA_ALTA_AUTOMATICA=abierta`. Al arrancar había **una fila residual** de la vuelta anterior
sin limpiar: `organizations.name='zz-qa-2026-09-24-1809-negocio'` (creada 18:10, sin pacientes ni
citas). Se limpió antes de correr el recorrido (perfil → `auth.identities` → `auth.users` →
`organizations`, en ese orden) e imprimí la fila antes de borrarla — ver el comando en el
historial de esta vuelta. **Lección: una vuelta anterior no cerró su limpieza** (posible corte
por el tope de tiempo antes del borrado); a partir de ahora, el chequeo de arranque
(`count(*) from organizations where name like 'zz-qa-%'`) es lo primero que se corre, no solo
antes de escribir.

Con el `BUILD_ID` nuevo correspondía repetir dental (regla de la lección anterior: comparar
`BUILD_ID` antes de decidir). `node scripts/recorrido_cliente.mjs --escribir`:

- **Los 9 pasos, OK.** Cuenta creada (`zz-qa-2026-09-24-1910@onia.com.bo`), confirmar correo
  antes del primer login, onboarding en 6 pantallas (pregunta → negocio → horarios → servicios
  → equipo → listo), `/dashboard` sin rebote, paciente `zz-qa-2026-09-24-1910-paciente` cargado
  y visto en `/patients`, cita `2026-09-25 09:00` agendada (201) y VISTA en `/appointments`
  (id `cmufwtv3d000k01rxl23r2tzj`), factura creada con el ítem visible en `/billing/...` —
  frenado ahí sin pagar.
- `resumen.json`: `llegoHasta 9 / 9`, `completo: true`, `agujeros: []`.
- Limpieza verificada por fuera del propio script: `organizations`/`appointments` con
  `zz-qa-%` → **0** al cerrar.

**Sin hallazgo de producto.** El único hallazgo fue de proceso (la fila residual, ya corregida
arriba).

---

## 2026-09-24 17:12 La Paz — `BUILD_ID` sin cambios (no se repitió dental); escalón 3c: `/pending` con una propuesta REAL de agente, rechazarla y ver el efecto en `/agents`

`ONIA_ALTA_AUTOMATICA=abierta`, `zz-qa-` en 0 al arrancar. `BUILD_ID` sigue
`9tuk1Qk2BjQ2j2HdJcL8u` — no correspondía repetir dental.

**Siguió el pendiente que dejó la entrada de arriba**: probar `/pending` aprobando o
rechazando una propuesta real y mirar el efecto en `/agents`. Instrumento nuevo:
`scripts/probar_agentes_pending.mjs`.

⚠️ **Sólo se tocó "Rechazar", nunca "Aprobar y enviar".** `app/api/onia-core/approvals/route.ts`
documenta que aprobar **ejecuta el envío de verdad** (WhatsApp al destinatario del sobre); este
carril tiene prohibido escribirle a nadie que no sea Sergio, así que aprobar con canal real
quedó fuera de alcance. El código mismo dice que rechazar "no manda nada" — ese es el botón
seguro de medir.

También se aprendió que `/agents` (tabla `onia_agents_actions`, sembrada directo por SQL en la
entrada anterior) y `/pending` (tabla `onia_core_approval_requests`) son **dos tablas
distintas**, unidas por `onia_agents_actions.approvalRequestId` ↔
`onia_core_approval_requests.metadata.agentActionId` — así arma la cadena real
`agents-runtime.ts`. Sembrar solo la primera (como hizo el escalón 3b) nunca aparece en
`/pending`; para este escalón se sembraron las dos, con el mismo enlace que usa el runtime.

Sembrado por SQL: org `zz-qa-` professional/dental vigente, un agente `Recall` real, una
corrida `completed` con `itemsProduced=1`, una acción `send_message` en `pending_approval`, y
su `oniaCoreApprovalRequest` (`requestType='agent_action'`, `metadata.agentActionId` apuntando a
la acción, `metadata.dispatch` con canal WhatsApp a un teléfono `zz-qa-` inventado). Con sesión
real (magic link + cookies, 390×844):

- **`/pending` → "Aprobaciones pendientes"**: "Propuesta de Recall" (nombre del agente, no la
  clave `agent_action`), "Pedido por ZZ QA Owner · Recontactar a paciente sin volver hace 4
  meses", el sobre completo — "Se envía por WhatsApp a ZZ QA Paciente (59100000000)" y el texto
  exacto del mensaje — y los tres botones (Aprobar y enviar / Enviar yo mismo por WhatsApp /
  Rechazar). Captura `extra-pending-00-antes.png`.
- **Clic en "Rechazar"** → `PATCH /api/onia-core/approvals` 200, notice **"Rechazado. No se
  envío nada."**, la tarjeta desaparece de la lista. Captura `extra-pending-01-rechazado.png`.
- **Base**: `onia_core_approval_requests.status='rejected'`, `onia_agents_actions.status`
  también `'rejected'` (el enlace por `agentActionId` sí transicionó la acción hermana), **0
  filas en `onia_core_dispatches`** para esa aprobación — nada se envió de verdad.
- **`/agents` después**: ya NO cuenta "esperando aprobación", y la sección de acciones muestra
  el texto HONESTO — *"Tus agentes ya propusieron 1 acción en sus últimas corridas, y ninguna
  sigue en esta lista: lo que aprobaste, lo que rechazaste y lo que el agente descartó no vuelve
  a mostrarse acá"* — no el texto viejo ("Todavía no hay propuestas") que motivó el arreglo
  `textoListaVacia` del 2026-09-13. Captura `extra-pending-02-agents-despues.png`.

**Sin hallazgo.** Limpieza verificada por fuera del propio script:
`organizations`/`auth.users` con `zz-qa-%` → 0, `onia_core_approval_requests` de la org → 0.

**Próxima vuelta:** si `BUILD_ID` sigue igual, queda por probar "invitar/quitar
coadministrador desde `/settings`" (pendiente desde el 2026-09-18), o rotar de rubro con
`/agents`/`/pending` (comercio/importadora no tienen agenda — ver si el catálogo de roles de
agente cambia con el rubro), o volver a `/agents` con "Aprobar y enviar" usando SOLO el botón
"Enviar yo mismo por WhatsApp" (`canal:"manual"`) contra un teléfono `zz-qa-` que no es de nadie
real — ese camino prepara un link `wa.me` pero el propio código dice que "el sistema NO lo
envía", así que no rompería la regla de no escribirle a un prospecto; medirlo con cuidado igual.

---

## 2026-09-24 16:11 La Paz — `BUILD_ID` sin cambios (no se repitió dental); escalón 3b: `/agents` con agentes YA sembrados y una corrida real

`ONIA_ALTA_AUTOMATICA=abierta`, `zz-qa-` en 0 al arrancar. `BUILD_ID` sigue
`9tuk1Qk2BjQ2j2HdJcL8u` — no correspondía repetir dental.

**Sigue el pendiente que dejó la entrada de arriba**: la vez anterior probó `/agents` con la
org recién sembrada y **0 agentes** (rama `agents.length === 0` de `agents-view.tsx`), y quedó
anotado que faltaba la rama con agentes reales — `RUN_STATUS_LABELS` y el estado de una acción
`pending_approval` nunca se habían mirado renderizados. Instrumento nuevo:
`scripts/probar_agentes_con_corrida.mjs`. Sembré por SQL, sobre una org `zz-qa-`
professional/dental vigente: un agente `onia_agents_agents` real (rol `recall`, habilitado), una
corrida `onia_agents_runs` en `completed` con `summary`, y una acción `onia_agents_actions` en
`pending_approval` con `payload.suggestedMessage`. Con sesión real (magic link + cookies,
390×844) contra `/agents`:

- **Equipo de agentes** ya NO lista el catálogo genérico: lista el agente real, "Recall —
  reactivación de pacientes", "Activo · corre todos los días", con su última corrida rotulada
  **"Completada"** (`RUN_STATUS_LABELS.completed`) y el `summary` sembrado a la vista.
- **Acciones propuestas y aprobadas · 1 esperando aprobación** — el contador de
  `pendingCount` cuenta bien la única acción `pending_approval`.
- La acción se lista con su título, el badge **"Esperando aprobación"**, el **borrador del
  mensaje** (`payload.suggestedMessage`) visible bajo "Borrador:", y "se aprueba en Pendientes"
  al pie — exactamente lo que `estadoVisibleDeAccion` promete para este estado (no necesita
  despacho: eso sólo lo mira para `executed`/`auto_executed`).
- Captura `extra-agentes-corrida-00-pantalla.png` — limpia, sin texto cortado, sin "muy pronto".

**Sin hallazgo.** Limpieza verificada por fuera del propio script:
`organizations`/`auth.users` con `zz-qa-%` → 0, y además `onia_agents_actions` de la org → 0
(las tres tablas de agentes se borran por FK lógica antes que `organizations`).

**Próxima vuelta:** si `BUILD_ID` sigue igual, los escalones que quedan del área agentes son
`/pending` (aprobar o rechazar una propuesta real y ver el efecto en `/agents`), o volver a
"invitar/quitar coadministrador desde `/settings`" (pendiente desde el 2026-09-18), o rotar de
rubro.

---

## 2026-09-24 15:12 La Paz — `BUILD_ID` sin cambios (no se repitió dental); escalón 3 nuevo: `/agents` ("Agentes"), nunca antes probado por este carril

`ONIA_ALTA_AUTOMATICA=abierta`, `zz-qa-` en 0 al arrancar. `docker exec onia-platform cat
/app/.next/BUILD_ID` → `9tuk1Qk2BjQ2j2HdJcL8u`, **igual** al citado en la entrada de arriba (y en
las tres anteriores) — no correspondía repetir dental.

**Escalón 3 — la pantalla `/agents` ("Agentes"), nunca antes tocada por este carril** (no
existía `probar_*.mjs` para esta superficie). `module.agents` entra por PLAN (Pro+,
`agentsIncluded` — `lib/platform/entitlements.ts:52` de `onia-platform`), no por entitlement
sembrado a mano; los flags `AGENTS_RUNTIME=1` y `PLATFORM_LAYER=1` ya están activos en el
contenedor (verificado antes de escribir el instrumento, para no perseguir un `redirect` que en
realidad fuera un flag apagado). Instrumento nuevo: `scripts/probar_agentes.mjs`. Org `zz-qa-`
sembrada por SQL, plan `professional`, rubro dental, `trialEnd`/`planEnd` a un año (org vigente,
no vencida — la memoria compartida advierte que una org vencida da `agents_runtime_disabled` y
eso mide otra cosa), ADMIN dueño con `clinic_settings`, **sin agentes sembrados** (lista vacía
real, no un fixture). Con sesión real (magic link + cookies, 390×844):

- `/agents` abre sin redirigir a `/dashboard` ni a `/login` (lo que pasaría si
  `requireFeature("module.agents")` rechazara la org) y sin ningún `>=400` en la carga.
- **Equipo de agentes** en el vocabulario correcto de dental: "Recall — reactivación de
  **pacientes**", "Cobrador — saldos vencidos", "Confirmador — citas de mañana" — los tres roles
  que `rolCorreEnTrack` habilita para un track con `patient`+`appointment`. **El Captador NO
  aparece** (gateado por `addon.captador`, que esta org no compró) — la pantalla no promete un
  rol que el runtime tampoco correría.
- **Acciones propuestas y aprobadas**: el texto es el de siempre ("Todavía no hay propuestas...",
  `TEXTO_NUNCA_PROPUSIERON`) — correcto porque la org recién sembrada tiene 0 corridas, no el
  texto condicionado que usaría si hubiera propuestas rechazadas/descartadas.
- La promesa "Nada se envía solo" y el link a **Pendientes** (`/pending`) están a la vista.
  Captura `extra-agentes-00-pantalla.png` — limpia, sin texto cortado, sin "muy pronto".

**Sin hallazgo.** Limpieza verificada: `organizations`/`auth.users` con `zz-qa-%` → 0 al cerrar.

**Próxima vuelta:** si `BUILD_ID` sigue en `9tuk1Qk2BjQ2j2HdJcL8u`, otro escalón nuevo — `/agents`
con agentes YA sembrados y una corrida real (para ver la rama `agents.length > 0` y el estado
`RUN_STATUS_LABELS`, que este instrumento no ejercitó porque sembró la org vacía a propósito), o
`/pending` (aprobar/rechazar una propuesta real), o rotar de rubro.

---

## 2026-09-24 14:09-14:20 La Paz — huérfano de la vuelta anterior limpiado a mano; recorrido dental 9/9 de nuevo

`ONIA_ALTA_AUTOMATICA=abierta`. Antes de tocar nada: `select count(*) from organizations where
name like 'zz-qa-%'` dio **1**, no 0 — violaba el chequeo obligatorio de arranque.

**Origen del huérfano:** la vuelta anterior (rama `claude/recorrido-cliente`, commit
`d0720d6e`) corrió el recorrido, llegó hasta el paso 06 (capturas `paso-05b`, `paso-05c` y
`paso-06-menu.png` quedaron modificadas y sin commitear) y se cortó ahí — sin log propio en este
archivo, sin `resumen.json` actualizado, y sin limpiar. Quedó viva la organización
`zz-qa-2026-09-24-1310` (id `cmufjv48h004701rwice34ya1`, rubro `gestios-servicios-profesionales`),
su cuenta `zz-qa-2026-09-24-1310@onia.com.bo` (`auth.users` + `auth.identities`), un perfil STAFF
sin correo (alta del profesional en el onboarding) y una fila en `organization_entitlements`
(`module.agents`, trial). Cero `patients`/`appointments` — no llegó tan lejos.

**Limpiado a mano esta vuelta**, imprimiendo antes de borrar (fila completa arriba) y borrando en
orden por FK (`organization_entitlements` → `profiles` → `organizations` →
`auth.identities` → `auth.users`, todo por id exacto, nunca por rango). Confirmado después:
`organizations` y `auth.users` con `zz-qa-%` en 0. También corrí `--solo-limpiar` (la póliza que
ya existe en el script para este caso exacto, comentario en `recorrido_cliente.mjs:2348-2354`,
nacida de `t_f52601e2`) y confirmó 0 antes de arrancar el recorrido nuevo.

**Recorrido dental completo después de la limpieza:** `BUILD_ID` sigue `9tuk1Qk2BjQ2j2HdJcL8u`
(sin cambios de deploy desde la entrada de las 12:09). `node scripts/recorrido_cliente.mjs
--escribir`: **9/9, `completo: true`, `agujeros: []`.** Cuenta
`zz-qa-2026-09-24-1411@onia.com.bo` con confirmación de correo real, onboarding de 6 pantallas,
paciente `zz-qa-2026-09-24-1411-paciente` cargado y encontrado, cita `2026-09-25 09:00` con
**201** y VISTA en `/appointments` (id `cmufm5oxe005g01rwvuc16ilw`), factura con ítem visible en
`/billing/cmufm6023005i01rwrpkxmzlg` (frenada sin pagar), panel mirado. `zz-qa-` en 0 al cerrar
(`organizations` y `appointments` verificados después).

**Sin hallazgo de producto.** El hallazgo es de proceso: una vuelta puede soltar el turno a mitad
del recorrido (timeout del corredor) sin dejar rastro legible acá — el único indicio fue el
`select count(*)` de arranque. La póliza `--solo-limpiar` ya cubre el dato (borra lo mío sin
depender de que el recorrido entero termine); lo que faltó fue CORRERLA, y documentar el corte
cuando pasa. Si vuelve a pasar, correr `--solo-limpiar` primero es la respuesta, no investigar de
cero.

`completo: true`, `llegoHasta: 9/9`. Próxima vuelta: si `BUILD_ID` sigue igual, no repetir dental
— seguir con el escalón de "invitar/quitar coadministrador desde `/settings`" que quedó pendiente
en la entrada del 2026-09-18 14:09, o revisar si el pedido de deploy sigue esperando `ok`.

## 2026-09-24 12:09-12:20 La Paz — `BUILD_ID` sin cambios (no se repitió dental); escalón 5 nuevo: "Descargar planillas" con plan 'basic', probado en vivo

`ONIA_ALTA_AUTOMATICA=abierta`, `zz-qa-` orgs en 0 al arrancar (chequeo obligatorio). Primer
comando tras el chequeo de ALTA, siguiendo la lección de la entrada de arriba:
`docker exec onia-platform cat /app/.next/BUILD_ID` → `9tuk1Qk2BjQ2j2HdJcL8u`, **igual** al citado
en la entrada de las 10:09-10:14 — no correspondía repetir dental ni comercio.

**Escalón 5 — "Descargar planillas" (`/settings`, sección 06 "Chatbot y datos"), nunca antes
tocado por este carril.** La memoria compartida y el propio comentario de
`app/api/settings/export/route.ts` afirman que el export es "un derecho del titular, no una
feature del plan: no se gatea por `canExportCsv`" — pero nadie lo había probado con un clic real
contra el plan más barato. Instrumento nuevo: `scripts/probar_exportar_datos.mjs`. Sembré una org
`zz-qa-` con **plan `basic`** (el más barato), un paciente `zz-qa-` real, sesión de dueño real, y
en `/settings` hice clic en "Descargar planillas": el ZIP bajó (1.639 bytes, 7 archivos:
`Resumen.csv, Pacientes.csv, Citas.csv, Tratamientos.csv, Facturas.csv, Facturas-detalle.csv,
Pagos.csv`) y el paciente sembrado apareció en `Pacientes.csv`. Captura
`extra-exportar-00-seccion.png` (badge "Básico" arriba a la izquierda, junto al botón sin
candado ni upsell). **Sin hallazgo**: la promesa se sostiene también en el camino de UI, no sólo
en el comentario del código.

Detalle de método: el ancla `#export` sola no activa la sección (el nav de `/settings` es de
SECCIONES numeradas, no de anclas independientes) — la sección real es "06 · Chatbot y datos";
sin ZIP en `node_modules` de ningún repo hermano (regla "no instales nada nuevo"), el ZIP se leyó
con el `zipfile` de Python, que ya está en la máquina.

**Limpieza extra, no mía:** al verificar `patients` tras cerrar mi propia corrida (`select count(*)
from patients where name like 'ZZ QA%'` → esperaba 0, dio 1), apareció un huérfano de **otro
carril**: org `ZZ QA Bandeja 1.0` (`cmtyzhm15000201rwvurbplhg`, plan `professional`, creada
2026-09-12, con 1 paciente, 1 cita, 2 profiles y su `auth.users`) que nunca se había limpiado.
Cumplía el contrato `zz-qa-` exacto (nombre y slug), así que se borró completa (imprimiendo cada
fila antes) junto con la mía. Verificado al cerrar: `organizations`/`patients` con `zz-qa-%`/`ZZ
QA%` → 0 en ambos casos.

RAZÓN: la medida principal (dental 9/9) no se movió — `BUILD_ID` sin cambios, correcto no
repetirla. El avance de la vuelta fue el escalón 5 nuevo, con hallazgo negativo (promesa
sostenida) y un huérfano ajeno limpiado de paso.
LECCIÓN: ninguna nueva — el método de comparar `BUILD_ID` primero (de la entrada de arriba) se
siguió sin desviarse esta vez.

---

## 2026-09-24 10:09-10:14 La Paz — `BUILD_ID` sin cambios (dental repetido de nuevo) + escalón 4 nuevo: rubro "Comercio / tienda", 8/8 completo

Repetí el mismo error que la entrada de abajo ya advertía: corrí dental (`RECORRIDO_RUBRO`
default) ANTES de comparar `BUILD_ID` contra la última entrada — seguía en `9tuk1Qk2BjQ2j2HdJcL8u`,
sin cambios. **9/9, `completo: true`**, 0 filas `zz-qa-` al cerrar: dato correcto, vuelta
redundante otra vez. Ver LECCIÓN abajo — esta vez sí se actuó: el resto de la vuelta fue el
rubro nuevo.

**Escalón 4 — primer recorrido completo con `RECORRIDO_RUBRO="Comercio / tienda"`** (nunca antes
probado por este carril; `tieneAgenda()=false` según la memoria compartida). `node
scripts/recorrido_cliente.mjs --escribir` con esa env var: alta con confirmación de correo,
onboarding de 6 pantallas (con el copy correcto del rubro — "¿Qué vendés y a cuánto?" en vez de
"¿Qué hacés y a cuánto?"), dato cargado en `/comercio` (Catálogo) y encontrado de vuelta,
**paso 7 (agendar cita) correctamente NO-APLICA** — la tarjeta de `/register` de este rubro
promete "Catálogo, inventario, caja y clientes" y su menú real no trae agenda: coincide con la
promesa de venta, no es un agujero. Caja (`/comercio/caja`) es la pantalla de cobro, mirada y
frenada sin marcar pagada. Panel `/dashboard` esta vez SÍ lista el dato del paso 6 (a diferencia
de dental, donde el panel no lista pacientes) — diferencia esperada por rubro, no un fallo.
Limpieza verificada: `organizations where name like 'zz-qa-%'` → 0, `appointments` con
notas/razón `zz-qa-` → 0.

RAZÓN: la medida `9/9` de dental no se movió (`BUILD_ID` sin cambios) — correcto no reportarla
como avance, pero se volvió a correr sin necesidad antes de mirar el dato.
LECCIÓN (segunda vez seguida con el mismo síntoma — cambio de método): dejar de confiar en
"comparar BUILD_ID antes de correr" como paso mental — se olvida bajo presión de arrancar rápido.
Próxima vuelta: el PRIMER comando después del chequeo de ALTA es
`docker exec onia-platform cat /app/.next/BUILD_ID` comparado con el valor citado en la entrada
más reciente de este archivo (`grep -m1 BUILD_ID` de este archivo mismo), y sólo si difiere se
corre dental de nuevo — nunca dental "por costumbre" antes de decidir el escalón de la vuelta.

---

## 2026-09-24 09:16-09:19 La Paz — `BUILD_ID` sin cambios, dental repetido innecesariamente + escalón 3 nuevo: cupo del chatbot con uso real, sin hallazgo

Al arrancar: `BUILD_ID` seguía en `9tuk1Qk2BjQ2j2HdJcL8u` (igual que la entrada de abajo) — no
correspondía re-correr dental. Lo corrí igual antes de comparar (**9/9, `completo: true`**,
0 filas `zz-qa-` al cerrar) — dato correcto pero vuelta parcialmente redundante: la entrada de
abajo ya decía explícitamente "si `BUILD_ID` sigue igual, no repetir dental — rotar rubro o
escalón 3 no auditado". Lección aparte al final.

**Escalón 3 nuevo — `CupoConversacionesCard` (`/settings/chatbot`) con USO REAL sembrado en la
base**, nunca antes probado por este carril contra producción (sólo existía el render-test
`CupoConversacionesCard.render.test.ts`, que fabrica el `EstadoCupo` a mano en vez de leerlo de
una fila real). Instrumento nuevo: `scripts/probar_cupo_chatbot.mjs`. Org `zz-qa-` sembrada por
SQL con `plan='professional'`, `whatsappAddon=true`, dueño ADMIN y `clinic_settings`; fila de
`chatbot_uso_mensual` del mes en curso sembrada dos veces en la misma corrida:

- **400/500 (80%, el umbral de aviso):** la barra pasa a ámbar (`bg-amber-500`), aparece el
  botón **"Sumar 200 conversaciones"** y el link `wa.me` real menciona el precio correcto —
  *"...quiero sumar 200 conversaciones al chatbot (Bs 190, valen hasta fin de mes). ¿Cómo
  procedemos?"* — coincide con `RECARGA_CONVERSACIONES` de `pricing.ts` (200 conv., Bs 190,
  con la vigencia dicha). Captura `extra-cupochatbot-01-80pct.png`.
- **500/500 (agotado):** la barra pasa a roja (`bg-error`) y el texto avisa la derivación a una
  persona. Captura `extra-cupochatbot-02-100pct-agotado.png`.

**Sin hallazgo**: la promesa de la memoria compartida ("el producto avisa al 80% Y al aplicarse
el corte, y con cupo agotado deriva a una persona") se sostiene también en la PANTALLA del
dueño con datos reales, no sólo en el motor del bot. **Trampa de método encontrada y corregida
en el propio instrumento**: el primer intento usaba el selector `[role="progressbar"]` sin
filtrar por `aria-label`, y agarraba un progressbar de carga de página ajeno a la tarjeta
(`aria-valuenow=1` fijo) — el selector correcto ancla por
`[aria-label="Conversaciones usadas este mes"]` antes de leer nada adentro. Limpieza verificada:
`organizations where name like 'zz-qa-%'` → 0 (el único huérfano de `chatbot_uso_mensual`
encontrado en la base, `cmtml12hr...`, es de un `organizationId` con formato `cuid` — no mío,
que siembro con `gen_random_uuid()`).

RAZÓN: la medida `9/9` no se movió porque el `BUILD_ID` no cambió — correcto no repetirla dos
veces, pero la corrí una vez de más antes de comparar. El avance real de la vuelta es el
escalón 3 nuevo, cerrado sin hallazgo.
LECCIÓN: comparar el `BUILD_ID` contra la última entrada ANTES de correr el recorrido completo,
no después — la entrada anterior ya traía la instrucción explícita de no repetir dental. Y para
cualquier probe nuevo con Playwright: un selector de rol ARIA genérico (`[role="progressbar"]`,
`[role="dialog"]`, etc.) sin su `aria-label`/filtro específico puede agarrar un elemento de la
UI del framework (indicador de carga) en vez del que se quiere medir — ancla siempre por el
atributo que lo identifica antes de leer nada adentro.

---

## 2026-09-24 08:14 La Paz — recorrido completo, rubro dental, `BUILD_ID` nuevo

`BUILD_ID` cambió (`Df2rH9P_zIOujNXHs0ist` → `9tuk1Qk2BjQ2j2HdJcL8u`), correspondía re-correr
entero. `node scripts/recorrido_cliente.mjs --escribir`, rubro dental (default): **9 de 9,
RECORRIDO COMPLETO.** Alta con confirmación de correo real, onboarding de 6 pantallas, paciente
`zz-qa-2026-09-24-0811-paciente` cargado y encontrado de vuelta, cita 2026-09-25 09:00 agendada
(201, `cmuf99r9l001m01rwzrib20o0`) y VISTA en `/appointments` (captura
`paso-07d-cita-en-agenda.png`), factura #2026-0001 con ítem `zz-qa-2026-09-24-0811-item` visible
en `/billing/...` (captura `paso-08c-factura-creada.png`, frenado ahí sin marcar pagada), panel
`/dashboard` no lista pacientes (esperado, ya conocido). Sin hallazgos nuevos. Limpieza
verificada: `organizations where name like 'zz-qa-%'` → 0, `appointments` con notas/razón
`zz-qa-` → 0.

**Próxima vuelta:** si `BUILD_ID` sigue en `9tuk1Qk2BjQ2j2HdJcL8u`, no repetir dental — seguir
escalón 3 en superficie no auditada (otro rubro, o invitar/quitar coadministrador en `/settings`,
o la recarga del add-on chatbot al agotar cupo).

---

## 2026-09-19 19:11 La Paz — recorrido completo, rubro dental, `BUILD_ID` nuevo

`BUILD_ID` cambió (`AUiuQ9c0SmcJnuF37_qTo` → `Df2rH9P_zIOujNXHs0ist`), así que correspondía
re-correr el recorrido entero en vez de seguir en escalón 3.

`node scripts/recorrido_cliente.mjs --escribir`, rubro dental (default): **9 de 9, RECORRIDO
COMPLETO.** Alta con confirmación de correo real (abrió el enlace del mail, no escribió
`email_confirmed_at` a mano), onboarding de 6 pantallas, paciente `zz-qa-` cargado y encontrado
de vuelta, cita agendada (201) y VISTA en `/appointments`, factura con su ítem visible en
`/billing` (frenado ahí, sin marcar pagada), panel `/dashboard` no lista pacientes (esperado,
no es un fallo). Sin hallazgos. Limpieza verificada: `organizations where name like 'zz-qa-%'` →
0, `appointments` con notas/razón `zz-qa-` → 0.

**Próxima vuelta:** si `BUILD_ID` sigue en `Df2rH9P_zIOujNXHs0ist`, no repetir dental — seguir
escalón 3 en superficie no auditada (invitar/quitar coadministrador en `/settings`, o la recarga
del add-on chatbot al agotar cupo).

---

## 2026-09-19 18:14 UTC — escalón 3 nuevo: ciclo weekly/annual del checkout

`BUILD_ID` sin cambios (`AUiuQ9c0SmcJnuF37_qTo`): no correspondía re-correr el recorrido
completo. Siguiendo lo anotado en la entrada de arriba ("el ciclo weekly/annual del checkout —
sólo se miró monthly"), extendí `probar_checkout_directo.mjs` para clickear el selector de
ciclo en `/checkout?plan=X` (no sólo mirar el default `monthly`).

Fuente: `DEFAULT_PLAN_AMOUNTS` (`subscription-plans.ts`) — `crece` tiene `weekly:145`, `clinic`
NO tiene `weekly` ("el Full no se fracciona"). Verificado contra producción con sesión real
(390×844, org `zz-qa-` plan `basic`, borrada en la misma corrida):

- `plan=crece`, clic en "Anual" → **Bs 5.500** (coincide con `annual:5500`).
- `plan=clinic`, clic en "Anual" → **Bs 12.900** (coincide con `annual:12900`).
- `plan=clinic`, clic en "Semanal" → la pantalla avisa **"Solo mensual o anual"** y se queda en
  el monto mensual (Bs 1.290) — no ofrece un ciclo que el plan no tiene, y no cae a otro monto
  por accidente. Esto es justo lo que `sinEsteCiclo`/`isSubscriptionCycle` +
  `validateSubscriptionPaymentDetails` (server-side) prometen en el código; queda confirmado que
  la UI lo respeta también, no sólo el backend.

**Sin hallazgo.** Sin fallos de red. Capturas: `checkoutdir-03-crece-anual.png`,
`checkoutdir-04-clinic-anual.png`, `checkoutdir-05-clinic-semanal.png`.

**Próxima vuelta:** si `BUILD_ID` sigue igual, rotar de rubro para el recorrido completo (dental
lleva muchas corridas seguidas sanas) o buscar otra superficie de escalón 3 no auditada aún
(p.ej. el flujo de recarga del add-on chatbot al agotar cupo, o `/checkout` con `enterprise`).

---

## 2026-09-19 17:11 La Paz — escalón 3 nuevo: `/checkout?plan=X` DIRECTO por URL, re-verificado

`BUILD_ID` sin cambios (`AUiuQ9c0SmcJnuF37_qTo`, ya confirmado en la entrada de arriba con
`origin/master` corrido hasta `faf78babd`): no correspondía re-correr el recorrido completo.

`probar_cambio_de_plan.mjs` ya había documentado que `/settings` → "Mi plan" → `/checkout` es
INALCANZABLE para cuentas `zz-qa-` por diseño (decisión de Sergio Urcullo del 18-sep: las
cuentas de QA no ven la sección de venta). Pero `/checkout?plan=X` en sí **no está detrás de esa
exclusión** — es una ruta aparte que cualquier sesión logueada puede abrir directo por URL, sin
pasar por el link oculto. Este carril había mirado `/checkout` por última vez el 2026-09-13, seis
días antes de varios cambios de precio/inclusión (whatsapp incluido en Completo, multiAdmin,
ajustes de copy) que otros carriles hicieron en el medio.

**Instrumento nuevo:** `scripts/probar_checkout_directo.mjs`. Siembra org `zz-qa-` plan `basic`,
abre `/checkout?plan=crece` y `/checkout?plan=clinic` directo por URL (390×844, sesión real, sin
pasar por "Mi plan"). Verificado contra `git show origin/master:lib/subscription-plans.ts`
(`DEFAULT_PLAN_AMOUNTS`, 2026-09-19):

- Las 4 tarjetas (Básico Bs 320, Crece Bs 550, Profesional Bs 890, Completo Bs 1.290) se ven
  completas, sin "muy pronto" ni obra a la vista (captura `checkoutdir-01-crece.png`).
- `plan=crece` → resumen "Plan Crece · Mensual", **Bs 550,00** — coincide.
- `plan=clinic` → resumen "Plan Completo · Mensual", **Bs 1.290,00**, y el "Enciende" dice
  literal *"Chatbot de WhatsApp incluido: 500 conversaciones/mes (comprado aparte vale Bs
  390/mes)"* — coincide con `whatsappIncluded:true` de `plan-catalogo.ts` y con el precio del
  add-on de `pricing.ts` (captura `checkoutdir-02-clinic.png`).

**Sin hallazgo.** Sin fallos de red (`status>=400`: ninguno). Todo `zz-qa-` sembrado se borró en
la misma corrida (`organizations=0` al cerrar).

**Próxima vuelta:** si `BUILD_ID` sigue igual, otra superficie no auditada — el ciclo `weekly`/
`annual` del checkout (sólo se miró `monthly`), o rotar de rubro.

---

## 2026-09-19 12:14 La Paz — corrección: el BUILD_ID NO cambió + escalón 3 nuevo: coadministrador por UI

⚠️ **Corrijo la entrada de abajo.** Decía que `BUILD_ID` había cambiado a `Idvh9u4mdBzHBgE2penq4`
"por los commits del bot" — eso ya era sospechoso (el bot no rebuildea la plataforma) y, medido
de nuevo ahora (`docker exec onia-platform cat /app/.next/BUILD_ID`), el build vivo sigue siendo
`AUiuQ9c0SmcJnuF37_qTo` (commit `a8fd1da`, el mismo de las vueltas de las 12:14/13:14/14:12 UTC
de hoy — ver `/opt/onia-platform/build-a8fd1da`, no hay ningún build más nuevo en el VPS). La
etiqueta "15:20 La Paz" de esa entrada también estaba mal: el commit que la originó es de
`15:16:36 UTC` = `11:16 La Paz`, no `15:20 La Paz` — alguien escribió la hora UTC y la marcó como
La Paz. Un dato heredado no se ejecuta sin contarlo de nuevo, tampoco el propio.

**Consecuencia:** con el `BUILD_ID` real sin cambios, no correspondía re-correr el recorrido
completo — seguí directo con el escalón 3 pendiente.

**Escalón 3 nuevo — coadministrador por la UI real, no sólo por API.**
`probar_coadministrador.mjs` (vuelta anterior) ya probaba las tres puertas de DG-043 contra HTTP
pelado. Instrumento nuevo `scripts/probar_coadministrador_ui.mjs`: siembra org `zz-qa-` plan
`clinic` (Completo, trae coadministradores), abre `/settings#equipo` con sesión real, hace clic
en "Agregar a alguien", llena el formulario (nombre, correo, contraseña, rol "Administrador"),
clic en **"Darle acceso"** — aparece en la lista (capturas
`extra-coadminui-01-formulario-lleno.png` y `-02-agregado.png`), confirmado en la BASE (profile
`ADMIN` real, no sólo el DOM) — y clic en **"Quitar a `<nombre>`"**, que dispara un
`window.confirm()` nativo (aceptado por el script): la fila desaparece de la pantalla
(`-03-quitado.png`) y el profile se borra de la base. **Sin hallazgo**: las dos puntas de
DG-043 sostenidas también por clics reales, no sólo por la API. Todo `zz-qa-` sembrado se borró
en la misma corrida (`organizations=0`, `auth.users=0` verificado al cerrar).

**Próxima vuelta:** si el `BUILD_ID` sigue en `AUiuQ9c0SmcJnuF37_qTo`, otro escalón nuevo —
checkout/cobro de punta a punta (llegar a la pantalla de pago, sin completar el pago real), o
rotar de rubro con la variante `SALTAR_EQUIPO` que ya usó una vuelta anterior en dental.

---

## 2026-09-19 11:16 La Paz (corregido; decía "15:20 La Paz") — recorrido completo re-verificado (BUILD_ID nuevo, DATO FALSO) + escalón 3: cancelar cita, HALLAZGO

⚠️ **La afirmación de "BUILD_ID cambió" en esta entrada es FALSA — ver la corrección arriba.**
El resto de la entrada (el hallazgo de cancelar cita) sigue siendo válido: no dependía del
BUILD_ID.

`BUILD_ID` cambió (`AUiuQ9c0SmcJnuF37_qTo` → `Idvh9u4mdBzHBgE2penq4`) desde la vuelta anterior
— por los commits del bot mergeados, no de la plataforma. Por las reglas del carril, correspondía
re-correr el recorrido completo antes de seguir con escalones nuevos.

**Recorrido completo:** `node scripts/recorrido_cliente.mjs --escribir` → **9/9, `completo:
true`, sin agujeros.** Los 9 pasos de "Clínica dental" siguen sanos con el deploy nuevo. Todo lo
`zz-qa-` que creó se borró en la misma corrida (`organizations=0`, `appointments zz-qa-=0`).

**Escalón 3 nuevo — HALLAZGO: el portal del paciente no ofrece cancelar.** Siguiendo del escalón
del portal (confirmar / mis citas), instrumenté lo que faltaba: ¿puede el paciente CANCELAR su
cita desde el mismo enlace? `PATCH /api/booking/appointments` con `action:'cancel'` funciona de
verdad (HTTP 200, `status` pasa de `PENDIENTE` a `CANCELADA` en la base — verificado, no sólo
leído). Pero ni `/book/confirm/[token]` ni `/book/my-appointments/[token]` pintan un botón o link
de cancelar: sólo "Confirmar asistencia", "Ver todas mis citas", "llamar" y "Agendar" (de nuevo).
Un paciente que no puede asistir no tiene forma de avisar desde el enlace que se le manda; tiene
que llamar al negocio. Reportado en el tablero (`t_7bb28d06`, prioridad 2, dueño: onia-cola) y en
`cola/recorrido-cliente.md`. Instrumento nuevo: `scripts/probar_cancelar_cita.mjs`. Capturas:
`capturas/extra-cancelarcita-00-confirm.png` y `capturas/extra-cancelarcita-01-my-appointments.png`.
Todo `zz-qa-` sembrado se borró en la misma corrida (`orgs=0`, `citas=0` al cerrar).

**Próxima vuelta:** si `BUILD_ID` sigue en `Idvh9u4mdBzHBgE2penq4`, seguir con otro escalón nuevo
— invitar/quitar coadministrador desde la UI de `/settings` con Playwright (ya probado por API en
`probar_coadministrador.mjs`, falta el camino de clics real), o rotar de rubro.

---

## 2026-09-19 14:12 La Paz — escalón 3 nuevo: el portal del paciente, `/book/confirm` y `/book/my-appointments`

`BUILD_ID` sin cambios (`AUiuQ9c0SmcJnuF37_qTo`) desde la vuelta anterior: seguí directo de la de
arriba, probando lo que pasa DESPUÉS del `bookingToken` que una reserva pública le da al paciente.

**Instrumento nuevo:** `scripts/probar_portal_paciente.mjs`. Siembra su propia org `zz-qa-` (mismo
patrón: plan `professional`, dental, ADMIN con horario) y reserva por API pública para conseguir un
`bookingToken` real, sin repetir el escalón anterior. Con ese token, SIN sesión:

- `/book/my-appointments/<token>` — la MIRA renderizada (captura
  `extra-portalpaciente-00-mis-citas.png`): muestra el nombre del paciente, la fecha, la hora y el
  motivo de la cita `zz-qa-`, con status "Pendiente". Sin subrecursos en error.
- `/book/confirm/<token>` — la MIRA en estado pendiente, aprieta el botón **"Confirmar" de verdad**
  (PATCH real a `/api/booking/appointments`, `action=confirm`) y **verifica en la BASE** que
  `appointments.status` pasó de `PENDIENTE` a `CONFIRMADA` — no se conformó con que la pantalla
  dijera "¡Cita Confirmada!" (capturas `01-confirmar-pendiente.png` y `02-confirmar-despues.png`).
- Camino de fallo simétrico: un token inexistente (`zz-qa-token-inexistente-...`) da 404 en
  `/api/booking/appointments` y la pantalla muestra "Enlace inválido / No se encontraron citas"
  (captura `03-token-invalido.png`) — no una pantalla en blanco ni un 500.

**Sin hallazgo.** Todo lo `zz-qa-` sembrado se borró en la misma corrida (`organizations=0`,
`appointments zz-qa-=0` verificado al cerrar).

**Próxima vuelta:** si `BUILD_ID` sigue igual, otro escalón nuevo — cancelar una cita desde el
portal (`action=cancel`), o el flujo de invitar/quitar coadministrador en `/settings` (equipo),
tocado varias veces por DG-043/DG-047 y todavía no cubierto por este carril.

---

## 2026-09-19 13:14 La Paz — escalón 3 nuevo: la agenda PÚBLICA `/book/<slug>`, de punta a punta

`BUILD_ID` sin cambios (`AUiuQ9c0SmcJnuF37_qTo`) desde la vuelta anterior: en vez de repetir un
rubro, instrumenté una superficie del producto que este carril NUNCA había recorrido —
`/book/<orgSlug>`, la única pantalla que ve el cliente DEL cliente (un desconocido sin sesión,
no un `zz-qa-` con login).

**Instrumento nuevo:** `scripts/probar_reserva_publica.mjs`. Siembra por SQL una org `zz-qa-`
con plan `professional` (trae `publicBookingIncluded`), rubro dental, un ADMIN con horario
activo (`ADMIN` cuenta como profesional agendable — `ROLES_CON_AGENDA`), abre `/book/<slug>`
SIN sesión y la MIRA renderizada (captura `extra-reservapublica-00-pantalla.png`, 390×844 —
limpia, sin texto cortado), y recorre la API pública real: `GET /api/booking/doctors` → `GET
/api/booking/slots` → `POST /api/booking/appointments` con un paciente `zz-qa-` y un teléfono
boliviano real. **201, `bookingToken` real**, la cita quedó en la base con el paciente y
horario correctos, y — la mitad que importa, no sólo que el desconocido reciba su
confirmación — **el DUEÑO la vio en `/appointments`** con sesión real (captura
`extra-reservapublica-01-agenda-del-dueno.png`: el 20 de septiembre muestra la cita en el
calendario). **Sin hallazgo.** Todo lo `zz-qa-` sembrado se borró en la misma corrida
(`organizations=0`, `appointments zz-qa-=0` verificado al cerrar).

**Próxima vuelta:** si `BUILD_ID` sigue igual, otro escalón nuevo — el portal del paciente
(`/book/confirm/[token]` y `/book/my-appointments/[token]`, que `probar_reserva_publica.mjs`
ya deja con un `bookingToken` disponible antes de limpiar, si se quiere reusar) o el flujo de
cancelar/confirmar una cita desde ahí.

---

## 2026-09-19 12:14 La Paz — rotado a Servicios profesionales: 9/9 completo, sin hallazgos

Antes de arrancar: 1 org `zz-qa-` huérfana (`zz-qa-2026-09-19-1109-negocio`, de una corrida
anterior cortada) — limpiada a mano (organizations, profiles, entitlements, patients,
auth.users, auth.identities), verificada en 0 antes de correr.

`RECORRIDO_RUBRO="Servicios profesionales" node scripts/recorrido_cliente.mjs --escribir`
contra `BUILD_ID` `AUiuQ9c0SmcJnuF37_qTo` (el mismo del deploy de coadministrador): **9/9
completo** — cuenta, confirmación de correo real, onboarding, cliente cargado en `/patients`,
cita `2026-09-21 09:00` agendada (201) y vista en `/appointments`, pantalla de cobro (Caja)
mirada y frenada, panel revisado. Todo `zz-qa-` sembrado se borró en la misma corrida (0 orgs,
0 appointments `zz-qa-%` al cerrar). Sin hallazgos nuevos — el fix de coadministrador (DG-043 /
`t_24758d5a`) no rompió nada fuera de dental.

**Próxima vuelta: los 6 rubros activos ya están re-verificados contra el build actual. Ir a
otro escalón 3 (checkout/cobro a fondo enviando de punta a punta, u otra superficie de
promesa-vs-entrega) en vez de rotar rubro otra vez.**

---

## 2026-09-19 10:10 La Paz — deploy llegó: 9/9 completo, coadministrador confirmado

`BUILD_ID` cambió (`HyMvkgxD68MORYYHikiG6` → `AUiuQ9c0SmcJnuF37_qTo`). Confirmado con
`scripts/probar_coadministrador.mjs`: DELETE `/api/admin/users/[id]` con 2 ADMIN ahora da
**200** (antes 403) — `t_24758d5a` cerrado y verificado en vivo, no solo mergeado.

Corrí el recorrido completo (`--escribir`) contra el build nuevo: **9/9 pasos OK en Clínica
dental** — cuenta, onboarding, paciente, cita agendada y vista en la agenda, factura mirada
sin pagar, y el dato del paso 6 en su pantalla correspondiente. Todo lo `zz-qa-` sembrado se
borró en la misma corrida (`resumen.json`: `completo:true`, `agujeros:[]`; 0 orgs y 0
appointments `zz-qa-%` en la base al cerrar).

**Próxima vuelta: no repetir dental — rotar a otro rubro o a un escalón 3 nuevo aún no
instrumentado.**

---

## 2026-09-19 09:11 La Paz — coadministradores: fix mergeado a master, todavía NO deployado

`BUILD_ID` sin cambios (`HyMvkgxD68MORYYHikiG6`). El fix de `t_24758d5a` (DELETE
`/api/admin/users/[id]` bloqueaba sacar un ADMIN aunque hubiera 2) se mergeó a
`origin/master` de `onia-platform` como `52409f20` (verificado:
`git merge-base --is-ancestor 52409f20 origin/master` → exit 0). **Volví a correr
`scripts/probar_coadministrador.mjs` contra producción real y el DELETE sigue dando 403** —
el fix está en el árbol pero no en el build servido. No es un hallazgo nuevo: es la brecha
normal de deploy, medida en vivo en vez de asumida.

**No hace falta pedido de deploy.** `ssh root@187.77.16.63 'bash /opt/onia-platform/_deploy/publicar.sh --dry-run'`
dice `hay que publicar: 2 arreglo(s)` y el destino se publica **solo** (no toca
`pricing.ts`/`subscription-plans.ts`, así que no lo frena el freno de precio). El publicador
automático (`onia-publicar-solo.sh`, corre cada 3h) lo va a levantar sin que Sergio Urcullo
tenga que apretar nada.

**Próxima vuelta: si `BUILD_ID` cambió, correr `probar_coadministrador.mjs` una vez para
confirmar 200 y cerrar el tema; si no cambió, no repetir esta medición — ir a otra superficie
(otro rubro, u otro escalón 3).**

---

## 2026-09-19 08:1x La Paz — escalón 3 nuevo intentado (cambio de plan): estructuralmente
inalcanzable para `zz-qa-`, no es un hallazgo

`BUILD_ID` sin cambios (`HyMvkgxD68MORYYHikiG6`), 0 huérfanas `zz-qa-` al arrancar, sin tareas
nuevas en el tablero. Se escribió `scripts/probar_cambio_de_plan.mjs` para recorrer, por primera
vez con clic real y sesión real, el camino "dueño con plan `basic` aprieta 'Contratar Crece' en
`/settings` → llega a `/checkout?plan=crece` con el precio correcto (Bs 550)".

**Resultado: la pantalla "Mi plan" no existe para ninguna cuenta `zz-qa-`, por diseño.**
`esCuentaQueNoEsCliente` (`lib/platform/cuentas-que-no-son-clientes.ts`) matchea el **slug** de
la organización contra `QA_SLUG_PREFIXES = ["zz-qa-"]` — sin mirar el email — y
`seccionesDeConfiguracion({cuentaInterna: true, ...})` en `SettingsClient.tsx` **omite el grupo
"plan" entero** ("Mi plan", "Chatbot de WhatsApp", "Descargar mis planillas") para esas cuentas.
Es una decisión de Sergio Urcullo del 2026-09-18: las cuentas de QA no ven la VENTA. Verificado
en vivo: org `zz-qa-cambioplan-20260919081734` (plan `basic`, dueño ADMIN, sesión real) en
`/settings` no tiene NINGÚN enlace a `/checkout` en toda la pantalla — 0 coincidencias.

**No es un hallazgo — es un bloqueo estructural de la convención de este carril.** CLAUDE.md
exige `zz-qa-` en todo lo que se crea (para que el borrado sea seguro); el producto exige que
`zz-qa-` no vea la venta (para que un drip no le escriba precios a datos de prueba). Las dos
reglas son correctas por separado y su intersección deja **la pantalla de cambio de plan
(`/settings`→"Mi plan"→`/checkout`) fuera del alcance de este carril mientras ambas reglas
sigan vigentes.** Ningún otro rubro de esta pantalla (comparativa, botones "Contratar" de cada
plan, add-ons) se puede recorrer de punta a punta con sesión real bajo esta convención.

Queda anotado para que ninguna vuelta futura vuelva a intentar esto pensando que es un bug del
instrumento: `scripts/probar_cambio_de_plan.mjs` reproduce el bloqueo (falla con "No hay ningún
`<a href="/checkout?plan=crece">`" y 0 enlaces a checkout) y lo documenta en su cabecera.

RAZÓN: la brecha más grande del objetivo (recorrido completo) sigue en 9/9 sin cambios de
`BUILD_ID`; el escalón 3 de coadministradores sigue bloqueado en el integrador (`t_24758d5a`,
`52409f20` no mergeado a `origin/master` aún); este ítem nuevo resultó ser un no-hallazgo tras
investigarlo, pero la investigación en sí vale (evita que otro carril lo intente de nuevo).
LECCIÓN: antes de instrumentar un escalón 3 que involucre precios/checkout/venta, revisar si la
convención `zz-qa-` choca con `esCuentaQueNoEsCliente` — desde el 18-sep, CUALQUIER superficie
de venta filtrada por esa función es inalcanzable para este carril con su propia convención.

---

## 2026-09-19 07:1x La Paz — `BUILD_ID` cambió otra vez (`HyMvkgxD68MORYYHikiG6`, antes
`Idvh9u4mdBzHBgE2penq4`): recorrido completo repetido, 9/9 sin hallazgos nuevos

Deploy nuevo detectado al arrancar → se corrió el recorrido entero (no la versión acotada).
`resumen.json`: `llegoHasta 9 / 9, completo True, agujeros []`. Los 9 pasos en "Clínica dental",
de punta a punta: registro con confirmación de correo real → onboarding (6 pantallas) → paciente
`zz-qa-` cargado y visto en `/patients` → cita `zz-qa-` agendada (201) y vista en `/appointments`
→ factura `zz-qa-` vista en su pantalla de cobro, frenado ahí sin pagar → panel revisado. Todo
`zz-qa-` (cuenta, org, paciente, cita, factura) borrado en la misma corrida — `organizations=0`,
`appointments zz-qa-=0` verificado al cerrar.

**El nuevo build NO trae el arreglo de coadministradores** (DG-043/`t_24758d5a`, commit
`52409f20`): re-corrido `scripts/probar_coadministrador.mjs` contra `app.onia.com.bo` y el
`DELETE /api/admin/users/<segundo ADMIN>` con 2 ADMIN sigue dando **403 "Cannot remove admin
users"** (debería dar 200). Verificado en el origen, no solo en producción: `52409f2` sigue
viviendo en la rama del carril `claude/chatbots-platform-review-0d1d09` (VPS,
`/root/loops/onia-platform` y `/root/loops/onia-platform-chatbot`) — `origin/master` tiene esa
rama mergeada hasta `a8e6ca1`, el commit ANTERIOR a `52409f2`. El deploy de este `BUILD_ID` trajo
otros arreglos del mismo carril (`a8e6ca1` y para atrás) pero no el último. La tarea
`t_24758d5a` sigue `done` con el comentario correcto ("falta que el integrador lo lleve a
master") — no hace falta reabrirla ni repetir la prueba hasta que cambie el `BUILD_ID` de nuevo.

RAZÓN: N/A — se confirmó 9/9 con el deploy nuevo; el hallazgo de coadministradores sigue siendo
el mismo, ya reportado, y no depende de esta sesión (integrador).
LECCIÓN: cuando cambia el `BUILD_ID` y hay un hallazgo de escalón 3 ya reportado y `done`, vale
la pena re-probarlo UNA vez contra el build nuevo (puede haberse desplegado) antes de descartarlo
— pero si sigue igual, no hace falta re-abrir nada: la tarea ya dice correctamente que espera al
integrador.

---

## 2026-09-19 06:1x La Paz — escalón 3: coadministradores, hallazgo — DELETE bloquea sacar un ADMIN

**`BUILD_ID` sin cambios (`Idvh9u4mdBzHBgE2penq4`)** — no se repitió el recorrido completo, sigue
9/9. 0 huérfanas `zz-qa-` al arrancar. Superficie nueva: invitar/sacar un co-administrador en
`/settings` → `/api/admin/users`, candidata anotada en varias vueltas anteriores.

**Método:** instrumento nuevo `scripts/probar_coadministrador.mjs` — org `zz-qa-` sembrada por
SQL directo con `plan='clinic'` (Completo, Bs 1.290 — el único junto a `enterprise` con
`multiAdminIncluded:true`, no elegible desde el onboarding real), dueño ADMIN sembrado (mismo
truco de `auth.users` con los campos de token en `''`), sesión acuñada con `acunarSesion()`.
Contra `https://app.onia.com.bo` real: `POST /api/admin/users` invita un segundo ADMIN por
correo → **201**. `GET /api/admin/users` → **2 usuarios**. `DELETE
/api/admin/users/<id del segundo>` (con 2 ADMIN, sacar uno debería dar 200) → **403 "Cannot
remove admin users"**.

**HALLAZGO — reportado a `onia-cola`, `t_24758d5a`, prioridad 1:** DG-043 (17-sep) se declaró
cerrado en los tres caminos de salida (PATCH y DELETE de `/api/admin/users/[id]`, DELETE de
`/api/team/[id]`), pero el DELETE de `/api/admin/users/[id]` llama a
`removeUserFromOrganization()` en `lib/auth.ts`, que tiene su **propio** bloqueo incondicional
viejo (`if role === ADMIN || SUPERADMIN → throw "Cannot remove admin users"`) sin mirar cuántos
ADMIN quedan — el `puedeQuitarAdministrador()` que la ruta ya calcula bien nunca llega a decidir
nada, porque la función de abajo tira antes. `/api/team/[id]` DELETE (la tercera puerta) SÍ está
sano: no pasa por `removeUserFromOrganization`.

**Limpieza:** org, 2 `profiles`, 2 `auth.users` (+`identities`) — todo por id exacto, dentro del
propio script, en la misma corrida (éxito o fallo). Verificado `organizations=0 auth.users=0` al
cerrar.

RAZÓN: N/A — la vuelta avanzó (escalón 3 nuevo, con hallazgo de producto).
LECCIÓN: `psql -tAc` con `INSERT ... RETURNING` imprime la fila Y el tag de comando ("INSERT 0
1") pegado debajo — a diferencia de `SELECT`, `-t` no lo suprime. Tomar sólo la primera línea es
lo correcto para toda consulta de un solo valor.

---

## 2026-09-19 05:1x La Paz — huérfana limpiada + escalón 3 cerrado: exportación CSV con plan `basic`

**`BUILD_ID` sin cambios (`Idvh9u4mdBzHBgE2penq4`)** — no se repitió el recorrido completo
(sigue 9/9, confirmado en la entrada anterior). Antes de empezar se encontró y limpió **1 org
`zz-qa-` huérfana** (`zz-qa-2026-09-19-0414-negocio`, `onboardingCompletedAt` puesto, 2 `profiles`
— ADMIN + DOCTOR pendiente —, 0 `patients`/`appointments`: corrida cortada por el timeout, el
modo de falla ya conocido). Impresas antes de borrar: `organizations`, `profiles`,
`organization_entitlements`, `auth.users`.

**Escalón 3, superficie nueva:** la exportación de datos del cliente (`/api/settings/export`),
citada en la memoria compartida como "derecho del titular, no feature de plan"
(`csvExportEnabled` true desde `basic`) pero nunca antes probada de punta a punta por este
carril con datos ENVIADOS.

**Método:** org `zz-qa-` sembrada por SQL directo con `plan='basic'` (el más barato, para probar
justo el caso límite de la promesa) y un paciente `zz-qa-`; sesión acuñada con
`acunarSesion()` de `scripts/lib/sesion_dueno.mjs`. Trampa nueva encontrada y resuelta en el
camino: `generate_link` fallaba con 500 "Database error finding user" — el `auth.users` sembrado
a mano tenía `confirmation_token` y los otros campos de token en `NULL`, y el driver de GoTrue
no sabe escanear `NULL` a `string` en esa columna (`converting NULL to string is unsupported`,
visto en `docker logs supabase-auth2`). Se cura seteándolos a `''`. **Vale para cualquier carril
que siembre `auth.users` a mano sin pasar por `/register`**: sin esos campos en `''`, todo
`generate_link`/`acunarSesion` sobre esa fila devuelve 500 y parece un bug del producto.

**Resultado, HTTP real contra `https://app.onia.com.bo/api/settings/export` con cookies de
sesión:** `200`, `content-type: application/zip`, `content-disposition: attachment;
filename="onia-datos-2026-09-19.zip"`, 1.601 bytes. El ZIP contiene `Resumen.csv` y
`Pacientes.csv` con el registro `zz-qa-export-...-paciente` adentro. Sin hallazgo: la promesa de
la memoria compartida se sostiene en producción, con el plan más barato, con datos reales.

**Limpieza:** `patients`, `profiles`, `organizations`, `auth.identities`, `auth.users` — los 5
por id exacto. Verificado 0/0/0 (`organizations`, `patients`, `auth.users` con `zz-qa-%`) al
cerrar.

RAZÓN: N/A — la vuelta avanzó (huérfana limpiada + escalón 3 nuevo cerrado con hallazgo de
método, sin hallazgo de producto).
LECCIÓN: sembrar `auth.users` a mano para probar un camino autenticado necesita también los
campos de token en `''` (no `NULL`) — si no, `acunarSesion()` da un 500 que se lee como bug del
producto y es del fixture. Ver `/tmp/probar_export.mjs` (no versionado; el fix real es el UPDATE
de arriba, reproducible con cualquier sembrado a mano de `auth.users`).

---

## 2026-09-19 03:1x La Paz — `BUILD_ID` cambió, recorrido completo repetido: 9/9 sin hallazgos

`BUILD_ID` pasó de `NIRA4pNJ8fJVouaUsyu1E` (última vuelta) a `Idvh9u4mdBzHBgE2penq4` — tocaba
repetir el recorrido entero, no confiar en la medida vieja. Antes de correr, se encontraron y
limpiaron **2 orgs `zz-qa-` huérfanas** de las dos vueltas anteriores (`zz-qa-2026-09-19-0109-negocio`
y `zz-qa-2026-09-19-0209-negocio`, ambas con `onboardingCompletedAt` puesto pero 0 `appointments`
— corridas cortadas por el timeout, el modo de falla ya conocido de este carril). Impresas antes de
borrar: profiles ADMIN+DOCTOR, entitlements, auth.users — las 4 filas de `profiles`, las 2 de
`organizations`, las 2 de `auth.users`.

**Resultado del recorrido, `node scripts/recorrido_cliente.mjs --escribir` en Clínica dental:**
los 9 pasos completos — cuenta creada (confirmación de correo requerida antes del primer login,
como al cliente real), onboarding en 6 pantallas, paciente `zz-qa-` cargado y visto en `/patients`,
cita `zz-qa-` agendada (201) y **VISTA en `/appointments`**, factura con ítem `zz-qa-` vista en su
pantalla de cobro (frenado ahí, sin pagar), y el dato del paso 6 confirmado como guardado (el panel
`/dashboard` no lista pacientes — es lo que muestra, no un fallo). `completo: true`, 0 agujeros.

Limpieza de esta corrida: 0 filas `zz-qa-` en `organizations`, `appointments` ni `auth.users` al
cerrar (confirmado por SQL, no supuesto).

**Además se cerró una tarea del tablero** (`t_e23278c6`, notificación auto de 2026-09-12, ya
superada por corridas posteriores) que seguía `ready` sin reclamar.

RAZÓN: N/A — la vuelta avanzó (recorrido completo repetido con éxito tras cambio de `BUILD_ID`,
más limpieza de huérfanas y una tarea vieja cerrada).
LECCIÓN: el chequeo de huérfanas `zz-qa-` al arrancar siguió dando trabajo real — sigue siendo
obligatorio cada vuelta, no es un caso aislado.

---

## 2026-09-19 00:1x La Paz — escalón 3 cerrado: invitar y quitar coadministrador, con plan `clinic`

**`BUILD_ID` sin cambios (`NIRA4pNJ8fJVouaUsyu1E`)** — no se repitió el recorrido completo
(sigue 9/9, `completo: true`, confirmado en la entrada anterior). Con el resto de la vuelta se
terminó lo que la vuelta pasada dejó reconocido sin poder probar: el rol ADMIN del formulario
"Agregar a alguien" no aparece con plan Profesional (`multiAdminIncluded: false`), así que hacía
falta un plan con esa capacidad. `primerPlanCon("multiAdminIncluded")` = `clinic`.

**Método:** una org `zz-qa-` sembrada por SQL directo (no por `/register`, que no deja elegir
plan) con `plan='clinic'`, `onboardingCompletedAt` ya puesto y un profile `ADMIN` dueño; sesión
minteada con el mismo mecanismo de `mirar_bandeja_dueno.mjs` (`acunarSesion`, magic link admin
sin contraseña). Impreso ANTES de borrar (regla de la casa): la fila de `organizations` y de
`profiles` quedaron logueadas más abajo en el commit de esta vuelta.

**Resultado, EN VIVO contra `https://app.onia.com.bo/settings`, sin hallazgo de producto:**

- Con plan `clinic`, el `<select>` de "Agregar a alguien" SÍ ofrece las tres opciones:
  `Profesional`, `Recepción` y **`Administrador — Ve todo y configura el sistema`**.
- Se completó el formulario con datos `zz-qa-` (nombre, correo, contraseña) y se apretó
  **"Darle acceso"** de verdad: la tarjeta "Equipo" pasó a listar al coadministrador con la
  etiqueta `Administrador`, y en la base quedaron **DOS** filas `profiles` con `role='ADMIN'`
  para esa organización (antes: 1).
- El camino de VUELTA (lo que la memoria compartida marcaba como agujero de seguridad hasta el
  17-sep, `commit 9f103875`) también funciona: el botón con `aria-label="Quitar a <nombre>"`
  dispara un `confirm()` nativo ("¿Eliminar a … ? Perderá acceso al sistema."), se aceptó, y el
  segundo `profiles` desapareció de la base — sin ningún response `>=400` en el camino.
- Sin hallazgo: la superficie que DG-043 gatea funciona de punta a punta, ida y vuelta, medida
  con datos reales enviados (no solo mirada).

**Limpieza:** `DELETE FROM organizations WHERE name LIKE 'zz-qa-%coadmin-probe%'` (cascada
sobre `profiles`) + `DELETE FROM auth.users WHERE email LIKE 'zz-qa-20260919001518-%'`.
Verificado 0/0/0 (`organizations`, `auth.users`, `profiles` con `zz-qa-%`) al cerrar.

RAZÓN: la medida `9/9` no cambió porque el `BUILD_ID` no cambió — correcto no repetir el
recorrido completo. El avance de esta vuelta es cerrar el escalón 3 (coadministrador) que
quedaba reconocido pero no probado.
LECCIÓN: cuando una capacidad está gateada por `plan` y el onboarding real no permite elegirlo,
sembrar la org por SQL directo (con su plan de prueba) es más rápido y más preciso que forzar el
camino de compra — mientras el dato se imprima antes de borrar y todo lleve `zz-qa-`. El
`acunarSesion()` de `scripts/lib/sesion_dueno.mjs` sirve también para ESTE uso (no solo para
`mirar_bandeja_dueno.mjs`): loguea sin contraseña una cuenta que recién se creó, incluso sin
confirmar el correo.

---

## 2026-09-18 23:0x-23:2x La Paz — reconfirmación redundante + reconocimiento de escalón 3 (equipo)

**Corrección de método, no de dato.** Al arrancar leí el final del archivo (con `tail`) en vez
del tope, y con eso pensé que el `BUILD_ID` anterior medido era `4AefpemDeSbQXrDmTbhoy` (una
entrada vieja). El tope real ya tenía `NIRA4pNJ8fJVouaUsyu1E` confirmado por la vuelta anterior
(commit `486742c0`) — el mismo que acabo de medir de nuevo. Corrí el recorrido completo entero
otra vez sin que hiciera falta: **9/9, `completo: true`, `agujeros: []`**, 0 filas `zz-qa-` al
cerrar — mismo resultado sano, repetido. Dato correcto, vuelta parcialmente desperdiciada por no
mirar el TOPE del archivo antes de decidir.

**Con el resto de la vuelta, until 3 de la lección de la vuelta anterior (invitar/quitar
coadministrador desde `/settings`).** Reconocimiento SIN escribir nada, con la sesión real de
`sergio@onia.com.bo` (solo lectura — nunca se apretó "Darle acceso"):

- `/settings/equipo` no existe (404). El camino real es `/settings` → tarjeta "Equipo — Quién
  entra al sistema" → botón **"Agregar a alguien"** (`getByRole('button', {name:'Agregar a
  alguien'})`), que despliega un formulario INLINE (no modal, no ruta nueva): Nombre completo,
  Correo electrónico, Contraseña (min. 8 caract.) y un `<select>` de rol.
- El `<select>` de rol en el plan **Profesional** de Sergio sólo ofrece dos opciones:
  `DOCTOR` ("Profesional — Atiende y tiene agenda propia") y `STAFF` ("Recepción — Agenda y
  cobra, no atiende"). **No hay opción ADMIN visible en este formulario/plan** — consistente
  con la memoria compartida sobre DG-043 (`multiAdminIncluded` en falso para `professional`).
  Esto es la MISMA pantalla que el paso "equipo" del onboarding ya toca (carga un profesional
  sin invitar por correo); no alcanza para probar el camino de co-administrador que DG-043
  gatea, que aparentemente vive en otra superficie o requiere un plan con `multiAdminIncluded`.
- No se probó el camino de invitación por correo (`/api/admin/users`, el que la memoria dice que
  crea un ADMIN real) porque no apareció en esta pantalla con este plan: hace falta un rubro/plan
  con `multiAdminIncluded` para verlo, o localizar la ruta exacta antes de automatizarlo.

**Sin hallazgo de producto esta vuelta.** El escalón 3 queda con selectores concretos para
armarlo la próxima vez, en vez del "pendiente por costo de armar el probe" de las últimas
vueltas: falta decidir con qué rubro/plan de prueba se ve el rol ADMIN antes de escribir el
paso automatizado, para no automatizar a ciegas sobre una pantalla que no muestra lo que se
quiere probar.

`completo: true`, `llegoHasta: 9/9` (sin cambios).

RAZÓN: no avanzó la medida porque el `BUILD_ID` no había cambiado de verdad (error de lectura
propio, corregido arriba) — la vuelta se gastó en una reconfirmación innecesaria y en
reconocimiento de escalón 3.
LECCIÓN: antes de decidir "hay que re-medir", leer el TOPE de `ULTIMO_RECORRIDO.md` (las
entradas más nuevas van arriba), no el final con `tail`. Y para escalón 3: el rol ADMIN/
co-administrador no aparece en el formulario de "Agregar a alguien" con el plan Profesional —
antes de automatizar el probe, crear (o encontrar) una cuenta `zz-qa-` con un plan/rubro que
tenga `multiAdminIncluded` para ver la superficie real que DG-043 gatea.

---

## 2026-09-18 22:09-22:1x La Paz — deploy nuevo (BUILD_ID `NIRA4pNJ8fJVouaUsyu1E`, antes `zMQBlf7IEQ_xT2qTWyMmQ`): dental 9/9 de nuevo

Al arrancar: alta `abierta`, 0 orgs `zz-qa-` huérfanas, 0 citas `zz-qa-` huérfanas, sin tareas
sin reclamar en mi zona del tablero. `BUILD_ID` había cambiado desde la última medición
(`zMQBlf7IEQ_xT2qTWyMmQ` → `NIRA4pNJ8fJVouaUsyu1E`), así que tocaba re-medir el camino completo
en vez de saltar directo al escalón 3.

Corrí `--escribir` en dental (default): **9/9, `completo: true`, `agujeros: []`**. Cuenta
`zz-qa-2026-09-18-2209@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas) →
paciente `zz-qa-2026-09-18-2209-paciente` cargado y visto en `/patients` → cita 2026-09-21 09:00
agendada (201, `cmu7ilebm000k01rwd9d3u6kb`) y vista en `/appointments` → factura con ítem visible
en `/billing/cmu7ilq7g000m01rwf8hbov8q` (frenada sin pagar) → panel revisado (no lista pacientes,
esperado). 0 filas `zz-qa-` al cerrar (verificado por `SELECT` en `organizations` y
`appointments`).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: BUILD_ID cambió desde la vuelta anterior (deploy nuevo) — corresponde re-medir el camino
completo antes de saltar a otro escalón.
LECCIÓN: cuarta corrida seguida sana en dental tras un cambio de BUILD_ID. El escalón 3
(invitar/quitar coadministrador desde `/settings`, DG-043) sigue pendiente de instrumentar — si
la próxima vuelta encuentra el mismo BUILD_ID, es el candidato en vez de repetir dental.

---

## 2026-09-18 21:09-21:2x La Paz — deploy nuevo (BUILD_ID `zMQBlf7IEQ_xT2qTWyMmQ`, antes `2BTQrq-Q9Ts3o-YxQykbg`): dental 9/9 de nuevo

Al arrancar: alta `abierta`, 0 orgs `zz-qa-` huérfanas, 0 citas `zz-qa-` huérfanas, sin tareas
sin reclamar en mi zona del tablero. `BUILD_ID` había cambiado desde la última medición
(`2BTQrq-Q9Ts3o-YxQykbg` → `zMQBlf7IEQ_xT2qTWyMmQ`), así que tocaba re-medir el camino completo,
no saltar directo al escalón 3.

Corrí `--escribir` en dental (default): **9/9, `completo: true`, `agujeros: []`**. Cuenta
`zz-qa-2026-09-18-2109@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas) →
paciente `zz-qa-2026-09-18-2109-paciente` cargado y visto en `/patients` → cita 2026-09-21 09:00
agendada (201, `cmu7gfutr000k01rwwdtj1k1q`) y vista en `/appointments` → factura con ítem visible
en `/billing/cmu7gg6g8000m01rwk77l6iry` (frenada sin pagar) → panel revisado (no lista pacientes,
esperado). 0 filas `zz-qa-` al cerrar (verificado por `SELECT` en `organizations` y
`appointments`).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: BUILD_ID cambió desde la vuelta anterior (deploy nuevo) — corresponde re-medir el camino
completo antes de saltar a otro escalón.
LECCIÓN: ninguna nueva. El escalón 3 (invitar/quitar coadministrador desde `/settings`, DG-043)
sigue pendiente de instrumentar — si la próxima vuelta encuentra el mismo `BUILD_ID`, es el
candidato en vez de repetir dental una tercera vez seguida.

---

## 2026-09-18 20:09-20:26 La Paz — deploy nuevo (BUILD_ID `2BTQrq-Q9Ts3o-YxQykbg`, antes `NpGVRgOBKvg2C3R5Upr9B`): dental 9/9 de nuevo

Al arrancar: alta `abierta`, 0 orgs `zz-qa-` huérfanas, 0 citas `zz-qa-` huérfanas. Corrí
`--escribir` en dental (default): **9/9, `completo: true`**. Cuenta
`zz-qa-2026-09-18-2009@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas) →
paciente `zz-qa-2026-09-18-2009-paciente` cargado y visto en `/patients` → cita 2026-09-21 09:00
agendada (201, `cmu7eb4xb000k01rwxt43b9cp`) y vista en `/appointments` → factura con ítem visible
en `/billing/cmu7ebht2000m01rwy8llaebg` (frenada sin pagar) → panel revisado (no lista pacientes,
esperado). 0 filas `zz-qa-` al cerrar (verificado por `SELECT`).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: BUILD_ID cambió desde la vuelta anterior (deploy nuevo) — corresponde re-medir el camino
completo antes de saltar a otro escalón.
LECCIÓN: ninguna nueva. El escalón 3 (invitar/quitar coadministrador desde `/settings`, DG-043)
sigue pendiente de instrumentar — sigue sin entrar por el costo de armar un probe de UI nuevo con
limpieza propia. Si la próxima vuelta encuentra el mismo BUILD_ID (sin deploy nuevo), ese es el
candidato a construir en vez de repetir dental una tercera vez seguida.

---

## 2026-09-18 19:09-19:12 La Paz — deploy nuevo (BUILD_ID `NpGVRgOBKvg2C3R5Upr9B`, antes `4AefpemDeSbQXrDmTbhoy`): dental 9/9 de nuevo

Al arrancar: 0 orgs `zz-qa-` huérfanas (limpio). Alta `abierta`. Corrí `--escribir` en dental
(default): **9/9, `completo: true`**. Cuenta `zz-qa-2026-09-18-1909@onia.com.bo` creada → correo
confirmado → onboarding (6 pantallas) → paciente `zz-qa-2026-09-18-1909-paciente` cargado y visto
en `/patients` → cita 2026-09-21 09:00 agendada (201, `cmu7c76be000k01rwoua1ppz4`) y vista en
`/appointments` → factura con ítem visible en `/billing/cmu7c7m91000m01rw6y55ixmw` (frenada sin
pagar) → panel revisado (no lista pacientes, esperado). 0 filas `zz-qa-` al cerrar (verificado por
`SELECT`).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: BUILD_ID cambió desde la vuelta anterior (deploy nuevo) — corresponde re-medir el camino
completo antes de saltar a otro escalón.
LECCIÓN: ninguna nueva. El escalón 3 (invitar/quitar coadministrador desde `/settings`, DG-043)
sigue pendiente de instrumentar — no entró en esta vuelta por el tiempo que toma armar un probe
de UI nuevo con limpieza propia; queda anotado para cuando el BUILD_ID vuelva a repetirse.

---

## 2026-09-18 17:09-17:17 La Paz — mismo BUILD_ID (`4AefpemDeSbQXrDmTbhoy`), pero había una org `zz-qa-` huérfana al arrancar: limpiada y dental 9/9 de nuevo

Al arrancar: 1 org `zz-qa-` huérfana (`zz-qa-2026-09-18-1609-negocio`, creada 16:10, con 2
`profiles` y 1 `organization_entitlements`, sin paciente ni cita — se cortó a mitad de una corrida
anterior, entre el paso 4 y el 6). La borré a mano (entitlements → profiles → organization →
auth.users) antes de correr el recorrido nuevo. Alta `abierta`. Corrí `--escribir` en dental
(default): **9/9, `completo: true`**. Cuenta `zz-qa-2026-09-18-1709@onia.com.bo` creada → correo
confirmado → onboarding (6 pantallas) → paciente `zz-qa-2026-09-18-1709-paciente` cargado y visto
en `/patients` → cita 2026-09-21 09:00 agendada (201, `cmu77viis002s01rw9w4ewlui`) y vista en
`/appointments` → factura con ítem visible en `/billing/cmu77vuo2002u01rwiq73qeu9` (frenada sin
pagar) → panel revisado (no lista pacientes, esperado). 0 filas `zz-qa-` al cerrar (verificado por
`SELECT`, las dos veces).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: BUILD_ID no cambió desde la vuelta anterior — esta corrida fue la medición obligatoria de
arranque (`--escribir` va siempre), no una repetición elegida.
LECCIÓN: el modo de falla "corrida cortada a mitad deja una org huérfana" sigue vivo aunque nadie
lo repitió esta semana — el chequeo de conteo `zz-qa-` al ARRANCAR (antes de correr nada) sigue
siendo obligatorio, no un caso aislado. Próxima vuelta: si el BUILD_ID sigue igual, escalón 3 en
superficie no auditada, no repetir dental.

---

## 2026-09-18 11:09-11:17 La Paz — deploy nuevo (BUILD_ID `4AefpemDeSbQXrDmTbhoy`, antes `HiLa5P_MF3e3iK6KUSfli`): dental 9/9 de nuevo

BUILD_ID cambió desde la vuelta anterior, así que tocaba re-correr el recorrido completo (no
solo confiar en el resultado viejo). Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`. Corrí
`--escribir` en dental (default): **9/9, `completo: true`**. Cuenta
`zz-qa-2026-09-18-1509@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas) →
paciente `zz-qa-2026-09-18-1509-paciente` cargado y visto en `/patients` → cita 2026-09-21 09:00
agendada (201, `cmu73kxw5001h01rw0ahvacw0`) y vista en `/appointments` → factura con ítem visible
en `/billing/cmu73l997001j01rwtedccemt` (frenada sin pagar) → panel revisado (no lista pacientes,
esperado). El bloqueo de MFA que había frenado el recorrido el 17-sep sigue sin reaparecer. 0
filas `zz-qa-` al cerrar (verificado por `SELECT`).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: la medida ya estaba en el techo (9/9); esta vuelta confirma que el deploy nuevo no rompió
nada, que es la pregunta que un cambio de BUILD_ID obliga a hacer.
LECCIÓN: ninguna nueva — el método "re-correr entero SOLO cuando cambia BUILD_ID, si no usar el
resto en escalón 3" sigue siendo correcto. Próxima vuelta: si el BUILD_ID no cambió, ir directo a
escalón 3 en superficie no auditada (o revisar si algún pedido de deploy sigue esperando el ok de
Sergio Urcullo).

---

## 2026-09-18 08:09-08:16 La Paz (novena vuelta del día) — dental 9/9 (rutina); superficie del día agotada, se descarta `/ayuda`

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`. Corrí el recorrido completo con
`--escribir` en dental (default): **9/9, `completo: true`**. Cuenta
`zz-qa-2026-09-18-1209@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas) →
paciente `zz-qa-2026-09-18-1209-paciente` cargado y visto en `/patients` → cita 2026-09-21 09:00
agendada (201, `cmu6x547a002t01rwm59cpzfi`) y vista en `/appointments` → factura con ítem visible
en `/billing/cmu6x5fha002v01rwras04vd5` (frenada sin pagar) → panel revisado (no lista pacientes,
esperado). 0 filas `zz-qa-` al cerrar (verificado por `SELECT`).

Con el resto de la vuelta: los 6 rubros activos y prácticamente todas las superficies de escalón
3 ya fueron re-verificadas HOY (importadora, comercio, servicios profesionales, estética,
`/servicios/webs`, `/contacto`, `/patrones`, `/servicios` raíz, `/agentes`, `/comparativa`,
checkout, `/precios`, recuperación de contraseña). Probé una superficie nueva: `/ayuda` — da
**404 limpio**, con nav y footer intactos y sin ningún texto engañoso. Antes de reportarlo como
hallazgo, crucé el código fuente (`web-factory/apps/onia-platform/src`, que SÍ está en este
worktree) buscando quién enlaza `/ayuda`: **cero coincidencias**. No es una promesa rota, es una
ruta que nadie ofrece — descartado, no es hallazgo.

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: N/A — objetivo cumplido.
LECCIÓN: con los 6 rubros y prácticamente todas las superficies de escalón 3 conocidas ya
re-verificadas en las últimas 24h, el rendimiento de seguir "buscando una superficie nueva al
azar" cae (probé `/ayuda`, que resultó no ser sujeto de nada). La próxima vuelta rinde más si, en
vez de escanear más URLs sueltas, verifica una promesa CONCRETA que otro carril ya reportó rota
hoy en producción — por ejemplo la de "chatbot incluido en el plan Completo" que `chatbot-cola`
dejó anotada en la memoria compartida (commit `5344eae`), abriendo una cuenta `zz-qa-` real con
ese plan y mirando `/settings` como lo vería el dueño.

---

## 2026-09-18 06:09-06:22 La Paz (octava vuelta del día) — dental 9/9 (rutina) + rotación a Servicios profesionales, sana 9/9

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue en
`HiLa5P_MF3e3iK6KUSfli` (sin cambios). Sin tareas nuevas en el tablero para esta zona.

Corrí el recorrido completo con `--escribir` en dental (sin `RECORRIDO_RUBRO`, es el default):
**9/9, `completo: true`**. Cuenta `zz-qa-2026-09-18-1009@onia.com.bo` creada → correo confirmado
→ onboarding (6 pantallas) → paciente cargado y visto en `/patients` → cita 2026-09-21 09:00
agendada (201, `cmu6suwqr000k01rwmtben889`) y vista en `/appointments` → factura con ítem
visible en `/billing/cmu6sv8eq000m01rw...` (frenada sin pagar) → panel revisado (no lista
pacientes, esperado).

Con el resto de la vuelta, rotando según lo anotado la vuelta pasada: `RECORRIDO_RUBRO='Servicios
profesionales'` (no se re-verificaba hace varios días). **Sano, 9/9.** Cuenta
`zz-qa-2026-09-18-1013@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas) →
cliente `zz-qa-2026-09-18-1013-paciente` cargado en group Clientes y visto en `/patients` →
cita 2026-09-21 09:00 agendada (201, `cmu6t0634001601rwz4fapv4t`) y vista en `/appointments` →
pantalla de cobro (Caja) a la vista en `/comercio/caja`, frenada sin cobrar → panel revisado (no
lista clientes, esperado).

0 filas `zz-qa-` al cerrar en las dos corridas (orgs y appointments verificados por `SELECT`
después de cada una).

`completo: true`, `llegoHasta: 9/9` (Servicios profesionales, el resumen.json vigente).

RAZÓN: N/A — objetivo cumplido, más rotación de rubro sana.
LECCIÓN: con dental, comercio, importadora y ahora servicios profesionales reconfirmados sanos
en los últimos días, sólo queda Estética y spa sin recheck reciente. Próxima vuelta: rotar a
Estética, o si ya está fresca, volver a escalón 3 en superficie nueva.

---

## 2026-09-18 05:09-05:20 La Paz (séptima vuelta del día) — rotación de rubro: Importadora, sana 8/8 (paso 7 no aplica)

Al arrancar encontré 1 org `zz-qa-` huérfana (`zz-qa-2026-09-18-0810-negocio`, de una corrida
anterior que murió a mitad de camino — sin `patients` ni `appointments`, patrón ya conocido) y la
borré (`organizations`, `profiles`, `organization_entitlements`, `auth.users`) antes de arrancar.
Alta `abierta`, `BUILD_ID` sigue en `HiLa5P_MF3e3iK6KUSfli` (sin cambios desde la vuelta
anterior; dental y comercio ya reconfirmados sanos dos veces cada uno).

Rotando según lo anotado la vuelta pasada: `RECORRIDO_RUBRO=Importadora` con `--escribir`.
**Sano: 8/8** (paso 7 — agendar cita — NO-APLICA: "Importadora" no vende agenda, coherente con
su propia tarjeta de `/register` y su menú, que no tiene `/appointments`). Cuenta
`zz-qa-2026-09-18-0910@onia.com.bo` creada → correo confirmado → onboarding (6 pantallas,
`/dashboard` no rebotó) → producto `zz-qa-2026-09-18-0910-paciente` cargado en storefront
Catálogo (`/comercio`) y visto de vuelta en la lista → pantalla de cobro (`/comercio/fiados`,
Créditos) a la vista, frenada sin cobrar → panel revisado (no lista storefront catálogo, esperado
— cada rubro muestra lo que le corresponde). 0 filas `zz-qa-` al cerrar (orgs y appointments
verificados por `SELECT`).

`completo: true`, `llegoHasta: 9/9` (resumen.json vigente, corrida de Importadora).

RAZÓN: N/A — objetivo cumplido.
LECCIÓN: ninguna nueva — Importadora ya llevaba varios días sin recheck y salió sana; quedan
estética y servicios profesionales sin re-verificar hace días para la próxima rotación, o
escalón 3 en superficie nueva si ya están frescos.

---

## 2026-09-18 02:09-02:16 La Paz (sexta vuelta del día) — recorrido completo sigue sano; reconfirmado también en Comercio

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue en
`HiLa5P_MF3e3iK6KUSfli` (mismo build del arreglo de MFA de la vuelta anterior — no hay deploy
nuevo). Corrí el recorrido completo con `--escribir` en dental: **9/9, `completo: true`, 0
agujeros** — mismo resultado que la vuelta anterior, confirma que el arreglo del MFA sostiene, no
fue casualidad de una sola corrida. Cuenta `zz-qa-2026-09-18-0609@onia.com.bo` creada → correo
confirmado → onboarding (Clínica dental) → paciente cargado y visto → cita 2026-09-21 09:00
agendada y vista en `/appointments` → factura frenada sin pagar → panel revisado. 0 filas
`zz-qa-` al cerrar.

Con el resto de la vuelta reconfirmé el rubro **Comercio** (`RECORRIDO_RUBRO=Comercio`), que no
se re-verificaba desde hace varios días: **sano, 8/8** (el paso 7 — agendar cita — no aplica:
"Comercio" no vende agenda, coherente con su propio menú y con `tieneAgenda()` de
`rubros-activos.ts`). Onboarding completo, producto cargado en `/comercio` (storefront Catálogo),
visto en la lista, pantalla de Caja (cobro) frenada sin cobrar, y el dato del paso 6 sí aparece
en el panel esta vez (a diferencia de dental, donde el panel no lista pacientes — cada rubro
muestra lo que le corresponde). 0 filas `zz-qa-` al cerrar (verificado con `SELECT`).

`completo: true`, `llegoHasta: 9/9` (dental, el resumen.json vigente).

RAZÓN: N/A — objetivo cumplido, más rotación de rubro sana.
LECCIÓN: no hace falta re-correr dos veces el mismo rubro para confirmar que un arreglo sostiene
si ya se confirmó una vez; el rendimiento mayor está en rotar a un rubro no verificado en días.
Próxima vuelta: seguir rotando (importadora, estética o servicios profesionales llevan varios
días sin re-chequeo) o volver a escalón 3 en una superficie nueva.

---

## 2026-09-18 00:09-00:16 La Paz (quinta vuelta del día) — 🟢 SE ARREGLÓ: recorrido COMPLETO 9/9 por primera vez desde el 17-sep, el bloqueo de MFA quedó atrás

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`. **`BUILD_ID` CAMBIÓ**: de
`OFd4xCDzoTbQdThUbfzDv` (el mismo desde hacía más de un día) a **`HiLa5P_MF3e3iK6KUSfli`** —
hubo deploy nuevo. `t_b8d00627` (plataforma, 36 arreglos, incluye el fix de MFA `b1247fb`) sigue
`blocked` en el tablero (no es mi zona, la actualiza `onia-cola`), pero el build vivo ya lo tiene.

Corrí el recorrido completo con `--escribir`: **los 9/9 pasos pasaron, `completo: true`, 0
agujeros.** El corte que venía repitiéndose desde el 2026-09-17 (`/dashboard` rebotaba a
`/profile?mfa=obligatorio` con el botón "Activar ahora" sin disparar ningún `fetch`) **ya no
aparece** — el onboarding se completó en 6 pantallas y el `/dashboard` no rebotó. Camino completo:
cuenta `zz-qa-2026-09-18-0409@onia.com.bo` creada → correo confirmado → onboarding (Clínica
dental) → paciente `zz-qa-2026-09-18-0409-paciente` cargado y visto en `/patients` → cita
2026-09-21 09:00 agendada (201, `cmu6g06w6000k01rwofyi0ejw`) y **vista** en `/appointments` →
factura `/billing/cmu6g0isv000m01rw76z4uu60` con el ítem visible (frenada sin pagar) → panel
revisado (no lista pacientes, esperado). Limpieza en la misma corrida: 0 filas `zz-qa-` al cerrar
(orgs y appointments verificados por `SELECT`).

`completo: true`, `llegoHasta: 9/9`.

RAZÓN: N/A — el objetivo se cumplió esta vuelta.
LECCIÓN: el bloqueo llevaba 8+ vueltas seguidas citando el mismo `BUILD_ID`; en cuanto cambió, el
recorrido volvió a pasar sin tocar el instrumento. Confirma que el método de "no repetir el
recorrido completo mientras el `BUILD_ID` no cambie, usar el resto en escalón 3" fue el correcto —
la próxima vez que un carril quede bloqueado por deploy ajeno, seguir ese patrón en vez de
re-correr a ciegas cada vuelta. Próxima vuelta: con el camino base sano de nuevo, retomar rotación
de rubros (dental sobre-cubierto; importadora/comercio/estética/servicios no se re-verifican desde
hace días) o seguir escalón 3 en superficies nuevas.

---

## 2026-09-18 23:09-23:50 La Paz (cuarta vuelta del día) — mismo corte (paso 5, MFA); escalón 3 con interacción real: `/servicios/webs` hasta el clic final, sano

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue `OFd4xCDzoTbQdThUbfzDv`.
`t_b8d00627` (plataforma, 36 arreglos, incluye el fix de MFA `b1247fb`) sigue `blocked` sin `ok`
de Sergio Urcullo — no es mi zona.

Corrí el recorrido completo con `--escribir` (protocolo exige medirlo cada vuelta): mismo corte
de siempre — paso 4 OK (alta con confirmación de correo, onboarding completo), paso 5 ROTO
(`/dashboard` rebota a `/profile`, el botón "Activar ahora" del MFA no dispara ni un fetch).
Limpieza en la misma corrida: 0 filas `zz-qa-` al cerrar.

Como el corte es el mismo ítem ya reportado (esperando el mismo deploy bloqueado), usé el resto
de la vuelta en la interacción sugerida la vuelta pasada: **enviar de punta a punta** el
configurador de `/servicios/webs` (hasta ahora sólo se había mirado, nunca completado).
Con Playwright llené el asistente rápido (rubro Clínica dental, objetivo, tono, paleta) +
los datos de contacto (`zz-qa-2026-09-18-0309-contacto`, WhatsApp `70000000`, email, ciudad) y
marqué el checkbox de requisitos. El CTA final ("Pedir mi Web Profesional por WhatsApp") es un
`<a href="wa.me/...">` que arma correctamente TODO el payload — negocio, rubro, oferta, servicios,
plan (Bs 4.500, 50/50), paleta y color elegido — con los datos que se cargaron, sin nada roto ni
faltante. **No lo hice clic** (abriría WhatsApp de verdad y el prompt del carril prohíbe escribirle
a cualquiera que no sea Sergio Urcullo por `onia-tg.sh`); confirmar el `href` generado alcanza para
verificar que el flujo arma el mensaje bien. Antes de marcar el checkbox de requisitos, el mismo
elemento es un `<a href="#datos-solicitud">` (ancla, no todavía el envío) — comportamiento
correcto, no un hallazgo. El checkbox "Registro de contactos en CRM/n8n" no dispara ningún POST
al marcarlo (nada que auditar ahí: todo el lead pasa por WhatsApp manual, consistente con "no hay
equipo de ventas"). **Sano, nada para reportar.**

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

---

## 2026-09-18 (tercera vuelta del día) — no repito el recorrido completo (BUILD_ID igual, bloqueo no es mío); auditadas `/patrones` y `/servicios` (raíz), sanas

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue `OFd4xCDzoTbQdThUbfzDv`
(misma que las últimas ocho corridas). El pedido de deploy de plataforma cambió de forma otra
vez: `t_4f4e4071` (23 arreglos) quedó `archived` y fue reemplazado por `t_b8d00627` (36
arreglos) — sigue `blocked`, sigue sin `ok`, no es mi zona (`onia-cola`). El gate
`npm run pedido:entregado` marca ese pedido nuevo como ROJO (4 commits mergeados después de
crearlo que su `ok` publicaría sin nombrar) — lo dejo anotado acá porque ya es la zona de otro
carril, no abro tarea nueva: es el mismo patrón que `t_62759602` ya señalaba.

Con el corte del paso 5 (MFA) intacto, usé la vuelta para cerrar las dos últimas superficies de
`(sitio)` que quedaban sin auditar (la vuelta anterior las había dejado anotadas como pendientes):

- **`/patrones`**: sana en los tres viewports (375/768/1440, `reducedMotion:'reduce'`) — 200,
  0 elementos con `scrollWidth > clientWidth`, 0 apariciones de "muy pronto"/"en
  construcción"/"próximamente"/"beta".
- **`/servicios`** (la raíz, distinta de `/servicios/webs` que ya estaba auditada): da **404**
  en los tres viewports. Verificado que NO es un hallazgo: no existe ningún `href="/servicios"`
  ni `'/servicios'` en el código del sitio (`grep` en
  `web-factory/apps/onia-platform/src`), y en el filesystem de rutas sólo existe
  `app/(sitio)/servicios/webs/`, sin `page.tsx` en `servicios/` a secas. Nadie promete esa URL:
  el 404 es correcto, no una promesa rota.

Con esto quedan agotadas las superficies de `(sitio)` que este carril tenía identificadas como
sin auditar. Próxima vuelta, si el `BUILD_ID` sigue igual: no queda escalón 3 obvio nuevo en
`(sitio)` — conviene, en cambio, profundizar una interacción de punta a punta en una superficie
ya "sana" (enviar de verdad el formulario de `/servicios/webs`, con datos `zz-qa-`, y ver si se
recibe del lado del intake) en vez de sólo mirar y no enviar.

`completo: false` (no corrí el recorrido esta vuelta), `llegoHasta: 4/9` (sin cambios).

RAZÓN: el corte de siempre (paso 5, MFA) sigue esperando que `onia-cola` cierre el pedido de
deploy — no depende de esta vuelta.
LECCIÓN: con `(sitio)` ya barrido entero, seguir escaneando páginas sueltas del sitio público
deja de rendir; el próximo escalón que sí suma es probar una interacción real (enviar, no sólo
mirar) en una superficie ya marcada sana.

---

## 2026-09-18 (segunda vuelta del día) — no repito el recorrido completo (BUILD_ID igual, bloqueo no es mío); auditada `/contacto`, sana

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue `OFd4xCDzoTbQdThUbfzDv`
(sin cambios desde la vuelta anterior). `t_62759602` ("rehacer los 3 pedidos de deploy") sigue
`ready` sin asignar — no es mi zona (`onia-cola`). Confirmé también que el bloqueo del paso 5 no
es sólo de las cuentas `zz-qa-`: probé con la sesión real de `sergio@onia.com.bo` pidiendo
`/team/roles` (`mirar_bandeja_dueno.mjs`) y también rebota a `/profile?mfa=obligatorio` — el
gate de MFA sin salida atrapa cualquier sesión, no sólo las de prueba, así que **todo el panel
`(dashboard)` está inaccesible para auditar** hasta que se despliegue.

Con eso, no re-corrí el recorrido completo por octava vez seguida sin novedad — el método
vigente (anotado la vuelta pasada) es esperar el `BUILD_ID`. Usé la vuelta para escalón 3 en una
superficie del sitio público que nunca se había mirado: **`/contacto`** (la landing, distinta de
`/contact` en `app.onia.com.bo`, que sí estaba auditada). Es una página de sólo enlaces a
WhatsApp (+591 75414930), sin formulario nativo: "Agendar 20 minutos", "Agendar la demo",
"Escribir por WhatsApp", más nav y footer. Medido en tres viewports (375/768/1440, todos con
`reducedMotion:'reduce'`): 0px de desborde horizontal, 0 elementos con `scrollWidth > clientWidth`,
0 apariciones de "muy pronto"/"en construcción"/"próximamente"/"beta". Sana.

`completo: false` (no corrí el recorrido esta vuelta), `llegoHasta: 4/9` (sin cambios respecto de
la última corrida real).

RAZÓN: el corte de siempre (paso 5, MFA) sigue esperando que `onia-cola` rehaga el pedido de
deploy — no depende de esta vuelta.
LECCIÓN: cuando el bloqueo es ajeno y el `BUILD_ID` no se mueve, repetir el recorrido completo no
suma nada; la vuelta rinde más auditando una superficie nueva del sitio público. Ya quedan pocas
sin tocar: de las páginas de `(sitio)` sólo faltarían `/patrones` y el detalle interno de
`/servicios` (ya se miró `/servicios/webs`, no la raíz `/servicios`).

---

## 2026-09-18 00:11-00:16 La Paz — recorrido completo re-corrido: mismo bloqueo; `t_a91f564e` ya no existe como tal (archivada, reemplazada); `/agentes` y `/comparativa` en móvil, sanos

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue `OFd4xCDzoTbQdThUbfzDv`
(sin cambios desde varias vueltas). **Dato nuevo:** `t_a91f564e` (el pedido de plataforma con
28 arreglos que este carril venía citando) pasó a `status: archived` — no está `blocked`
esperando un `ok`, está **cerrada y reemplazada**. La tarea viva ahora es `t_62759602`
("Rehacer los 3 pedidos de deploy: quedaron cortos y el medidor recién se arregló", `ready`,
sin asignar), que dice que `t_a91f564e` publica 4 arreglos más de los que su cuerpo nombraba y
por eso hay que rehacerlo — **no es mi zona** (deploy es de `onia-cola`), lo dejo anotado para
que ese carril lo vea. Mientras esa tarea siga `ready` sin cerrarse, el `ok` de Sergio Urcullo
no tiene un pedido válido al que responder, así que el corte del paso 5 sigue igual de bloqueado
que antes, por una razón nueva (pedido a rehacer, no pedido esperando aprobación).

Corrí el recorrido completo con `--escribir` de todos modos (es la definición de "hecho" de
este carril, y hacía 5 horas que no se re-confirmaba): mismo resultado exacto — llegó al
**paso 4/9**, se corta en el **paso 5**: `/dashboard` rebota a `/profile`, botón "Activar ahora"
de MFA sigue sin disparar ningún `fetch`. Limpieza: cuenta y org `zz-qa-2026-09-18-0011*`
borradas en la misma corrida, 0 filas mías al cerrar (confirmado por SQL).

Con el resto de la vuelta, escalón 3 en una combinación no auditada todavía: **`/agentes` y
`/comparativa` en viewport móvil (375×812, `reducedMotion:'reduce'`)** — ya estaban auditadas en
escritorio. Las dos: `scrollWidth === innerWidth === 375` (sin scroll horizontal), 0 respuestas
HTTP ≥400, 0 candidatos a texto cortado (medido elemento por elemento con
`scrollWidth > clientWidth`, no por captura). Sin hallazgo.

`completo: false`, `llegoHasta: 4/9`.

RAZÓN: mismo corte de siempre (paso 5, MFA sin salida) — el pedido de deploy que lo arregla ya
no está `blocked` esperando aprobación, está `ready` esperando que `onia-cola` lo rehaga.
LECCIÓN: séptima vuelta con el mismo hallazgo del recorrido completo. La novedad real de esta
vuelta no salió de re-correrlo sino de mirar el ESTADO del tablero: la tarea que este carril
venía citando como "esperando el ok de Sergio" ya no existe en esa forma. Próxima vuelta: si
`BUILD_ID` sigue igual, chequear primero si `t_62759602` avanzó (o si nació un pedido nuevo para
plataforma) antes de asumir que sigue "esperando aprobación" — puede estar esperando que alguien
lo rehaga, que es un bloqueo distinto y no depende de Sergio Urcullo.

---

## 2026-09-17 19:09-19:14 La Paz — recorrido completo re-corrido: mismo bloqueo, confirmado con `--escribir`

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue `OFd4xCDzoTbQdThUbfzDv`
(sin cambios). `t_a91f564e` (plataforma, 28 arreglos, incluye el arreglo del botón MFA "Activar
ahora") sigue `blocked` esperando el `ok` de Sergio Urcullo.

Corrí el recorrido completo con `--escribir` (no una sonda parcial): llegó hasta el **paso 4/9**
en "Clínica dental" — cuenta creada, correo confirmado, entró a `/onboarding`, completó las 5
pantallas del asistente (negocio, horarios, servicios, equipo) y el asistente dijo "ya está en
Onia". Se corta en el **paso 5**: el onboarding no queda cerrado — `/dashboard` sigue rebotando
a `/profile`, con el aviso de MFA obligatorio. El botón "Activar ahora" de ese aviso no disparó
ni un `fetch`: es decorativo, sin salida. Esto es EXACTAMENTE el defecto `52a3dd0` que ya está en
el pedido de deploy bloqueado — no es un hallazgo nuevo, es la confirmación en vivo de que sigue
sin desplegarse. Limpieza: cuenta y org `zz-qa-2026-09-17-2309*` borradas en la misma corrida,
0 filas mías al cerrar.

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

---

## 2026-09-17 18:09-18:35 La Paz — mismo bloqueo de deploy; `/servicios/webs` auditado, sano

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta`, `BUILD_ID` sigue en
`OFd4xCDzoTbQdThUbfzDv` (sin cambios). `t_a91f564e` (plataforma, 28 arreglos) y sus hermanos de
landing/bot siguen `blocked` esperando el `ok` de Sergio Urcullo. No repetí el recorrido completo
ni la sonda de MFA — método vigente.

Escalón 3 en una superficie nueva: `/servicios/webs` (el configurador de venta de webs de
cliente, fuera de los 9 pasos del onboarding). Escritorio y móvil (375px, `reducedMotion:
'reduce'`): cero texto cortado, cero respuestas HTTP ≥400, y la promesa central de la pantalla
("el preview usa los datos que escribís") se probó ENVIANDO un dato `zz-qa-` al campo real de
"Nombre del negocio" — el preview lo reflejó de inmediato. Precios de la escalera (Bs 2.000 /
4.500, add-ons Bs 790 y mantenimiento 190/390/690) no tienen fuente única versionada (ya
ratificado en una vuelta anterior que esto es así a propósito, no un hallazgo), y no encontré
ninguno de esos montos contradicho en otra parte del sitio.

De paso miré `/nosotros` y `/comparativa` (sacadas del menú superior por `t_e1e7bda4` pero
accesibles por URL/footer a propósito). `/comparativa` muestra un badge literal "EN TRÁMITE"
para la factura SIAT de Onia, y `/nosotros` dice textual "lo que está en trámite lo publicamos
como en trámite" — roza la regla de CLAUDE.md de no exhibir estado de obra en venta, pero es
una decisión ya tomada y enmarcada como diferenciador de "honestidad primero" (fecha, resolución
y alternativa concretas, mismo patrón que `/facturacion`, ya evaluada como sana). No lo reporto
como hallazgo nuevo: sería re-litigar una decisión ya escrita.

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

RAZÓN: el camino completo sigue bloqueado por el mismo deploy pendiente (`t_a91f564e`), esperando
ok de Sergio Urcullo.
LECCIÓN: quinta vuelta seguida sin repetir el recorrido completo — correcto. Superficies ya
auditadas sanas: home, /precios, /rubros, /facturacion, /guia-facturacion, /contact, /agentes,
recuperación de contraseña, checkout de plan, /servicios/webs, /nosotros, /comparativa. Si el
deploy sigue sin moverse, la próxima vuelta ya no tiene superficies nuevas obvias que auditar —
conviene revisar el tablero por si el `ok` llegó, o escanear con más profundidad una superficie
ya "sana" pero con una interacción distinta (ej. enviar el formulario de `/servicios/webs` de
punta a punta, sin completarlo de verdad).

## 2026-09-17 17:09-17:35 La Paz — mismo bloqueo de deploy; tres superficies nunca auditadas, todas sanas

Al arrancar: 0 orgs `zz-qa-` huérfanas, alta `abierta` (`ONIA_ALTA_AUTOMATICA`), `BUILD_ID`
sigue en `OFd4xCDzoTbQdThUbfzDv` (sin cambios desde hace varias vueltas). Los tres pedidos de
deploy: `t_a91f564e` (plataforma, reemplaza a `t_4f4e4071`) y `t_933c5f7b` (bot) siguen
`blocked` esperando el ok de Sergio Urcullo; `t_75f4fac3` (landing) según
`npm run pedido:entregado` corrido en el VPS ya está **ROJO: "TODO lo que promete ya esta
publicado"** — le pide un ok por trabajo ya hecho. No es mi zona (deploy es de `onia-cola`), lo
dejo anotado acá por si otro carril lo ve antes.

No repetí el recorrido completo (sigue bloqueado en el mismo paso por el mismo motivo, cuarta
vuelta seguida sin cambio de `BUILD_ID`; método descartado, ver vueltas anteriores). En su lugar
recorrí tres superficies del sitio que este carril nunca había mirado: `/nosotros`,
`/servicios/webs` y `/chatbot`. Las tres cargan sin errores de red, sin texto cortado
(`scrollWidth > clientWidth`), y su contenido —revisado con `page.evaluate` sección por
sección, no solo la captura completa, porque una captura `fullPage` muy larga comprime el texto
hasta hacerlo ilegible aunque esté ahí— es honesto y consistente:

- `/nosotros`: describe el estado real del emisor SIAT ("registrado ante el SIN y ya completó
  las pruebas técnicas de la Fase 1; quedan las etapas formales del trámite... hasta que la
  homologación concluya emitís por el portal gratuito del SIN") — coincide con lo medido en la
  memoria del sistema, sin fabricar ni ocultar obra en curso.
- `/servicios/webs`: el configurador de webs muestra un precio de ejemplo (Bs 4.500) dentro del
  rango ya ratificado por Sergio Urcullo (2.000/4.500/7.500).
- `/chatbot`: "Bs 390/mes... Bs 3.900 al año (pagás 10 meses)" y la mención de que Meta empieza
  a cobrar las respuestas dentro de la ventana de 24h "desde el 1 de octubre de 2026" — crucé
  ambos montos contra `origin/master:lib/pricing.ts` (`onia-platform`, `WHATSAPP_ADDON.entryMonthly
  = 390`, `annualTotal = 3900`): coinciden letra por letra.

Capturas: `capturas/auditoria-nosotros.png`, `capturas/auditoria-servicios-webs.png`,
`capturas/auditoria-chatbot-sitio.png`. Nada para reportar.

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

## 2026-09-17 13:11 La Paz — sin novedad de deploy (mismo BUILD_ID); auditoría móvil de home/precios/register sin hallazgo

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0. `BUILD_ID`
sigue en `OFd4xCDzoTbQdThUbfzDv` (sin cambios), y el pedido de deploy vigente pasó de
`t_db98ee26`/`t_62888ea2` (archivados) a **`t_ada95aaf`** (22 arreglos, mismo bloqueo: el `ok`
de Sergio Urcullo sobre precios), así que no repetí el recorrido completo — el corte del paso 5
(2FA obligatorio) es universal y ya está confirmado tres veces con el mismo build.

En su lugar, escalón 3 en una combinación no auditada: **viewport móvil (375×812, `isMobile`,
`reducedMotion:'reduce'`) en `onia.com.bo/`, `onia.com.bo/precios` y `app.onia.com.bo/register`**
(sólo lectura, sin crear cuenta). `document.documentElement.scrollWidth` = `innerWidth` = 375 en
las tres — **sin scroll horizontal**. Un primer barrido con `scrollWidth > clientWidth` marcó
texto "cortado" en el hero y en el H1 de `/precios`, pero al mirar la captura el texto se ve
completo (sin elipsis ni recorte visual) y las franjas oscuras que parecían "vacías" en la imagen
comprimida resultaron ser artefacto de la propia captura (una imagen de 375×16.716px reducida a
2000px de alto genera bandas de moiré) — verificado leyendo `getComputedStyle` en esos puntos de
scroll: fondos blancos/transparentes normales, nada negro de verdad. Descartado como el mismo
tipo de falso positivo del rasterizador que ya está anotado en este prompt (no un hallazgo).

Sin hallazgo nuevo. Próxima vuelta: si el `BUILD_ID` sigue igual, no repetir este chequeo móvil
(ya cubierto) — buscar otra superficie del escalón 3 (p.ej. `/agentes` o `/comparativa` en móvil,
o el flujo de reserva pública `/book` de un rubro con `publicBookingIncluded`).

---

## 2026-09-17 12:15 UTC (08:15 La Paz) — SIGUE ROTO, sin novedad: mismo bug, mismo build viejo

Al arrancar encontré 1 org huérfana (`zz-qa-2026-09-17-1109-negocio`, de una corrida anterior
cortada por el tope de tiempo) con `organization_entitlements` + 1 `profile` + 1 `auth.users`,
sin `patients` ni `appointments`. La imprimí y la borré antes de correr (0 al verificar después).

Corrida en dental (`zz-qa-2026-09-17-1210`): mismo corte que las dos vueltas anteriores — el
onboarding dice "ya está en Onia" pero **toda ruta protegida rebota a `/profile`** (2FA
obligatorio). `llegoHasta: 4/9`, `completo: false`.

**Nada cambió en el deploy**: `docker exec onia-platform cat /app/.next/BUILD_ID` sigue dando
`OFd4xCDzoTbQdThUbfzDv` (el mismo build de la vuelta de las 10:20), y `npm run
pedido:entregado` sigue diciendo `t_db98ee26 (plataforma): sigue VIGENTE`. El fix (`b1247fb`)
sigue mergeado a `master` y sin desplegar — bloqueado por el `ok` de Sergio Urcullo sobre el
pedido de precios que comparte gate. No comenté de nuevo en `t_7c1bd170` (ya está `done` y
dice exactamente esto) ni reclamé el deploy (es de `onia-cola`). No hay nada nuevo que medir
acá hasta que cambie el `BUILD_ID`.

0 filas `zz-qa-` propias al cerrar (org, profiles, auth.users, entitlements) — verificado antes
y después.

---

## 2026-09-17 10:20 La Paz — el fix del 2FA YA SE MERGEÓ, pero el VPS sigue corriendo el build viejo

No corrí `--escribir` de nuevo: el corte de la vuelta anterior (09:09) es universal — bloquea
**cualquier** rubro apenas termina el onboarding, así que repetirlo con otro rubro no mide nada
nuevo. En su lugar verifiqué el estado real del deploy, que es lo único que cambió.

`select count(*) from organizations where name like 'zz-qa-%'` dio 0 al arrancar, sin huérfanos.

**Merge: SÍ pasó.** `git merge-base --is-ancestor b1247fb origin/master` en `onia-platform` →
**sí** (antes daba que no). El fix está en `master`.

**Deploy: NO pasó todavía.** El build vivo del contenedor (`docker exec onia-platform cat
/app/.next/BUILD_ID` → `OFd4xCDzoTbQdThUbfzDv`) coincide con el último staged en el VPS,
`/opt/onia-platform/build-f078373/`, y ese `f078373` es del **2026-09-13T08:38**, **anterior**
al commit del fix (`b1247fb`, 2026-09-17T08:48) —
`git merge-base --is-ancestor b1247fb f078373` da que no. Así que en producción hoy el bug
sigue vivo para cualquiera que se registre, aunque el código ya esté arreglado.

El publicador automático no lo va a resolver solo: `onia-publicar-solo.sh --dry-run` frena
`plataforma` porque hay cambios de precio en cola esperando la firma de Sergio (`lib/pricing.ts`,
`lib/subscription-plans.ts`) — no relacionados con el MFA, pero comparten el gate. Ya existe un
pedido de deploy vigente (`t_db98ee26`, verificado con `npm run pedido:entregado` →
`sigue VIGENTE`). Actualicé la tarea de este bug (`t_7c1bd170`) con este estado y no abrí una
nueva ni reclamé el deploy: es trabajo de `onia-cola`.

`completo: false`, `llegoHasta: 4/9` (sin cambios respecto a la vuelta anterior — la causa
sigue siendo la misma, sólo cambió de "sin mergear" a "mergeado, sin desplegar").

---

## 2026-09-17 09:09 La Paz — SIGUE ROTO: el 2FA obligatorio bloquea a TODO cliente nuevo, fix escrito pero sin mergear

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

Dental (`zz-qa-2026-09-17-0909`): mismo corte que la vuelta de las 08:12 UTC — el onboarding se
completa y muestra "ya está en Onia", pero **toda ruta protegida (`/dashboard`, `/patients`,
`/billing`) rebota a `/profile`** con el banner "La verificación en dos pasos es obligatoria
para tu rol". Causa ya diagnosticada: `onia-platform/lib/mfa/policy.ts`,
`MFA_ENFORCE_FROM` como fecha ABSOLUTA sin gracia relativa al alta.

**El fix YA está escrito** (commit `b1247fb`, rama `origin/claude/chatbots-platform-review-0d1d09`
de `onia-platform`, gates verdes) **pero sigue sin mergear a `master`**: verificado con
`git merge-base --is-ancestor b1247fb origin/master` → NO, sobre `origin/master@4ccae18e`
(13-sep). Comenté la reconfirmación en la tarea ya abierta `t_82251f19` (no abrí una nueva —
archivé mi duplicado `t_df6fba50`). El bloqueo real hoy es el merge + deploy de `onia-platform`,
no el diagnóstico.

`completo: false`, `llegoHasta: 4/9`, 0 filas `zz-qa-` al cerrar (verificado antes y después).

---

## 2026-09-13 12:27 UTC (08:27 La Paz) — cerrado el hueco: recuperación de contraseña con TOKEN REAL, de punta a punta

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

La vuelta del 2026-09-13 05:09 había probado la recuperación sólo hasta "la pantalla dijo que
mandó el correo" y dejó anotado el hueco: *"no se pudo verificar... ni el flujo de
`/update-password` con un token real"*. El instrumento (`scripts/recorrido_cliente.mjs`) ganó
`RECORRIDO_PROBAR_RECOVERY=1`, que ahora prueba el camino ENTERO, igual que
`confirmarComoElCliente()` prueba la confirmación de correo: pide el enlace desde
"Olvidé mi contraseña" en `/login`, lee `recovery_token` de `auth.users` con un SELECT acotado
a `zz-qa-` (nunca escribe la columna a mano), abre el enlace real de GoTrue
(`type=recovery`), llega a `/update-password`, define una contraseña nueva y **verifica
entrando con ella** — la única prueba de que el cambio quedó vivo, no sólo que el formulario
mandó un 200.

`RECORRIDO_PROBAR_RECOVERY=1 node scripts/recorrido_cliente.mjs --escribir` (dental,
`zz-qa-2026-09-13-1227`): recuperación **OK** de punta a punta — enlace con token real →
`/update-password` (formulario "Definí una nueva contraseña para tu clínica", ver
`capturas/extra-recovery-02-update-password.png`) → contraseña cambiada → login con la nueva
**entró** (ver `capturas/extra-recovery-04-login-con-nueva.png`, que muestra la pantalla de
onboarding, no el login). Recorrido completo, 9/9, `completo: true`, 0 filas `zz-qa-` al
cerrar.

**Trampa del instrumento cazada en el camino (dos intentos):** la prueba corre DESPUÉS del
login del paso 4, con la sesión ya abierta. Primer intento: reusar la misma `page` y
`clearCookies()` para poder ver el botón "Olvidé mi contraseña" (con sesión activa, `/login`
redirige antes de renderizarlo) — y como el submit de recuperación no generó token en ese
intento (el input de correo del login, no el del formulario de recuperación, recibió el
`fill`), la `page` quedó deslogueada y tumbó los pasos 5-9 con "la sesión se cayó a mitad del
recorrido", un corte que no era del producto. Segundo intento, más de fondo: la prueba corre
en un **contexto de navegador aparte** (nunca toca `page`) — pero GoTrue invalida la sesión
VIEJA en el servidor apenas la contraseña cambia (correcto por seguridad), así que aun en
contexto aparte la `page` principal quedó deslogueada igual. La cura final: el llamador
re-loguea `page` con la contraseña NUEVA antes de seguir a los pasos 5-9. Ningún intento fallido
llegó a publicarse: los dos se cazaron corriendo el instrumento antes de cerrar la vuelta.

---

## 2026-09-13 11:14 La Paz — respondida la pregunta abierta desde el 2026-09-04: saltar "equipo" en el onboarding NO rompe agendar

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

`RECORRIDO_SALTAR_EQUIPO=1 node scripts/recorrido_cliente.mjs --escribir` (dental,
`zz-qa-2026-09-13-1114`): el onboarding se cerró apretando "Saltar por ahora" en la pantalla
de equipo, SIN cargar ningún profesional (`profesionalCargado: false`). El paso 7 (agendar)
salió igual **OK**: el desplegable de "profesional" del formulario de cita ofrece al DUEÑO
mismo como opción — apareció `zz-qa-2026-09-13-1114` (el nombre de la cuenta) en la lista — y
la cita entró con `201`, `doctorId: cmtzpwe3t001601rwtf97o65c` (el `profiles.id` del dueño).
Recorrido completo, 9/9, `completo: true`, 0 filas `zz-qa-` al cerrar.

**No es un hallazgo, es la respuesta**: un negocio de una sola persona (la mayoría en el alta,
medido en `RUBROS_ACTIVOS`) puede agendar desde el primer día sin tener que dar de alta a nadie
más — el propio dueño hace de "profesional" por defecto. Cerrado el comentario que lo dejaba
abierto en `scripts/recorrido_cliente.mjs` (línea del `SALTAR_EQUIPO`).

---

## 2026-09-13 10:09 La Paz — dental 9/9 (rutina) + `/precios` auditado con reducedMotion, sano

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

Dental (`zz-qa-2026-09-13-1009`): recorrido completo, 9/9 — cuenta creada, correo confirmado,
onboarding en 6 pantallas, paciente `zz-qa-2026-09-13-1009-paciente` cargado y visto en
`/patients`, cita 2026-09-14 09:00 vista en `/appointments` (`cmtznnnsj000k01rwqya1kixp`),
factura con ítem visible en `/billing/cmtznnyhs000m01rwvkua2xtg` (frenada sin pagar).
`completo: true`, 0 filas `zz-qa-` al cerrar (orgs, appointments verificados en 0).

Escalón 3, pendiente de la vuelta anterior: `onia.com.bo/precios` con `reducedMotion:'reduce'`
(para descartar un `<CountUp>` fotografiado a mitad de animar, la misma trampa que ya se cazó en
`/v1/chatbot`). Los cuatro planes muestran 320/550/890/1.290 y el add-on de WhatsApp 390 —
coincide EXACTO con `docker exec onia-platform grep -rhoE 'monthly:[0-9]+' /app/.next/server`
(320/550/890/1290/150/70/390/2900/0). Sin "muy pronto" ni obra a la vista, sin QR de pago, el
plan Full declara correctamente el chatbot incluido y el resto lo ofrece aparte a Bs 390/mes.
Sano, sin hallazgo.

---

## 2026-09-13 09:09 La Paz — Servicios profesionales 9/9, primera vez con este rubro, sin hallazgo nuevo

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

Rotando rubro (dental y Estética ya cubiertos varias veces): `RECORRIDO_RUBRO='Servicios
profesionales'`. Recorrido completo, 9/9 — cuenta `zz-qa-2026-09-13-0909@onia.com.bo` creada,
correo confirmado, onboarding en 6 pantallas (pregunta → negocio → horarios → servicios →
equipo → listo), cliente `zz-qa-2026-09-13-0909-paciente` cargado en group Clientes y visto en
`/patients`, cita 2026-09-14 09:00 vista en `/appointments` (`cmtzliyw1002i01rwm7ikh668`),
pantalla de cobro vista en `/comercio/caja` (frenada sin cobrar). El panel `/dashboard` no
lista el dato del paso 6 — no es un fallo, esa pantalla no muestra esa lista. `completo: true`,
0 filas `zz-qa-` al cerrar (organizations, appointments). Sin hallazgo nuevo.

---

## 2026-09-13 07:09 La Paz — Estética y spa 9/9, sin hallazgo nuevo

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

Rotando rubro (dental venía cubierto varias veces seguidas): `RECORRIDO_RUBRO='Estética y spa'`.
Recorrido completo, 9/9 — cuenta creada, correo confirmado, onboarding en 6 pantallas (pregunta →
negocio → horarios → servicios → equipo → listo), cliente `zz-qa-2026-09-13-0709-paciente`
cargado y visto en `/patients` (grupo "Clientas"), cita 2026-09-14 09:00 vista en
`/appointments` (`cmtzh8fj2000k01rwryvam0wm`), factura con ítem visible en
`/billing/cmtzh8qme000m01rw1fpq99nz` (frenada sin pagar). El panel `/dashboard` no lista el
dato del paso 6 — no es un fallo, esa pantalla no muestra esa lista. `completo: true`, 0 filas
`zz-qa-` al cerrar (organizations, appointments). Sin hallazgo nuevo.

---

## 2026-09-13 06:09 La Paz — dental 9/9 (rutina), sin hallazgo nuevo

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

Dental (`zz-qa-2026-09-13-0609`): recorrido completo, 9/9 — cuenta creada, correo confirmado,
onboarding en 6 pantallas, paciente `zz-qa-2026-09-13-0609-paciente` cargado y visto en
`/patients`, cita 2026-09-14 09:00 vista en `/appointments` (`cmtzf328s006f01rwhwhsqqkp`),
factura con ítem visible en `/billing/cmtzf3cw2006h01rwpuqvihn6` (frenada sin pagar).
`completo: true`, 0 filas `zz-qa-` al cerrar. Sin hallazgo nuevo — dental ya cubierto varias
veces seguidas.

Escalón 3, superficie nueva (checkout de PLAN de suscripción — `/checkout`, distinto de la
factura por paciente del paso 8): con una cuenta `zz-qa-` nueva se recorrió `/checkout` a
fondo, con `reducedMotion:'reduce'` (para no leer un `<CountUp>` a mitad de animar). Se ve
la escalera C completa (Básico Bs 320, Crece Bs 550, Profesional Bs 890 — plan de prueba por
defecto —, Completo Bs 1.290, todas con su anual "2 meses gratis" y en USD aprox.), sin
"muy pronto" ni obra a la vista. Se avanzó hasta la pantalla de pago del plan Básico (paso 2
de 3, "Pagá y subí el comprobante") y se FRENÓ ahí sin subir comprobante: confirma monto
Bs 320,00, sin QR (`MENCIONA_QR` false), y el texto real es "Escribinos y te pasamos los
datos de pago de OniaAgency — NIT 5371375010. Cuando pagues, subí la captura del
comprobante" — coincide con la memoria (no hay QR, el camino es WhatsApp) y con
`subscription-plans.ts`. El plan Completo declara correctamente "Chatbot de WhatsApp
incluido (comprado aparte vale Bs 390/mes)". Sano, sin hallazgo. Cuenta, org y perfil
`zz-qa-2026-...-checkout` verificados en 0 al cerrar (org, profiles, auth.users).

---

## 2026-09-13 05:09 La Paz — dental 9/9 (rutina) + recuperación de contraseña auditada, sano

Al arrancar: `select count(*) from organizations where name like 'zz-qa-%'` dio 0, sin huérfanos.

Dental (`zz-qa-2026-09-13-0509`): recorrido completo, 9/9 — cuenta creada, correo confirmado,
onboarding en 6 pantallas, paciente `zz-qa-2026-09-13-0509-paciente` cargado y visto en
`/patients`, cita 2026-09-14 09:00 vista en `/appointments`
(`cmtzcyfr5005m01rwchfvopib`), factura con ítem visible en
`/billing/cmtzcyr5v005o01rwrg3yyrtu` (frenada sin pagar). `completo: true`, 0 filas `zz-qa-`
al cerrar (orgs y appointments verificados en 0).

Escalón 3, superficie nueva (recuperación de contraseña, no auditada antes): en
`https://app.onia.com.bo/login`, "Olvidé mi contraseña" es un `<button>` que despliega el
formulario EN LA MISMA pantalla (no navega a otra URL) con el texto "Te enviaremos un enlace
seguro para cambiar tu contraseña". Se probó con
`zz-qa-2026-09-13-0509-recovery@onia.com.bo` (no existe como cuenta): la llamada real es
`POST https://app.onia.com.bo/supabase/auth/v1/recover?redirect_to=.../update-password`, devolvió
**200**, y la pantalla mostró "Te enviamos un enlace de recuperación. Abrí tu correo y definí
una nueva contraseña." — la promesa entrega lo que dice (y no revela si el correo existe o no,
correcto para seguridad). Sano, sin hallazgo. No se pudo verificar el correo en sí (no hay
bandeja de prueba en este carril) ni el flujo de `/update-password` con un token real.

---

## 2026-09-13 04:10 La Paz — huérfano zz-qa- limpiado al arrancar + dental 9/9 (rutina), sin hallazgo nuevo

Al arrancar la vuelta, `select count(*) from organizations where name like 'zz-qa-%'` dio **1**:
`zz-qa-2026-09-13-0310-negocio` (org `cmtz8lcqf003n01rw68vj8oi7`), de una corrida anterior que
murió a mitad de camino sin dejar rastro en este archivo ni en el tablero (0 `patients`, 0
`appointments`, sólo `organization_entitlements`, 2 `profiles` y 1 fila en `audit_logs`, más el
`auth.users` con ese email). Se borró completo antes de correr nada nuevo: `audit_logs` →
`organization_entitlements` → `profiles` → `organizations` → `auth.users`. Verificado en 0 tras
el borrado.

Dental (`zz-qa-2026-09-13-0410`): recorrido completo, 9/9 — cuenta creada, correo confirmado,
onboarding completado, paciente `zz-qa-2026-09-13-0410-paciente` cargado y visto en `/patients`,
cita 2026-09-14 09:00 vista en `/appointments` (`cmtzaulv6004t01rw92os8avd`), factura con ítem
visible en `/billing/cmtzauwlb004v01rwrxbtq5ie` (frenada sin pagar). `completo: true`, 0 filas
`zz-qa-` al cerrar (orgs, appointments, auth.users verificados en 0).

Los 5 rubros y el escalón 3 (promesa vs entrega en home/precios) ya están auditados en vueltas
previas sin hallazgo pendiente. Próxima vuelta: si dental sigue sano, ir a otra superficie del
escalón 3 no tocada aún (checkout/cobro a fondo, `/precios` con `--reducedMotion`, o el flujo de
recuperación de contraseña) en vez de repetir rubro.

---

## 2026-09-13 02:09 La Paz — dental 9/9 (rutina) + auditoría de los 4 CTA "Empezar con el <plan>", sin hallazgo reportable

Dental (`zz-qa-2026-09-13-0209`): recorrido completo, 9/9, cita 2026-09-14 09:00 vista en
`/appointments` (`cmtz6iy5c003e01rwsv5hza45`), factura con ítem visible en
`/billing/cmtz6j92t003g01rw3kwuglly` (frenada sin pagar). `completo: true`, 0 filas `zz-qa-`
al cerrar.

Siguiendo el escalón 3: los 4 botones de `/precios` y de la home — "Empezar con el Básico",
"…Crece", "…Pro", "…Full" — apuntan **los cuatro al mismo** `https://app.onia.com.bo/register`,
sin query param (medido con Playwright leyendo `a.href` en vivo). `SignupForm.tsx` sólo lee
`from` y `notice`/`error` de `searchParams`: el plan que motivó el clic se descarta. Confirmado
contra el árbol `onia-platform` (`app/api/auth/register/route.ts:306`): TODA cuenta nueva nace
con `plan: TRIAL_PLAN` = `"professional"` (nivel "Pro" de la escalera C), **sin importar cuál de
los 4 botones se apretó**. Consecuencia real: quien hace clic en "Empezar con el Full" para
probar el chatbot incluido (`whatsappIncluded` sólo es `true` en `clinic`/`enterprise`) no lo ve
en su trial — tiene el nivel Pro, no Full.

**No lo reporto como hallazgo de producto**: es el patrón estándar de "un solo trial genérico,
elegís y pagás el plan después" (ver `settings/PlanClient.tsx`), no una pantalla que promete y
no entrega en el momento en que promete. Lo dejo escrito para que la próxima vuelta no vuelva a
investigar esto desde cero — si algún día el trial se vende como "probá el plan que elegiste",
esto sí se vuelve un hallazgo real.

---

## 2026-09-13 00:10 La Paz — dental 9/9 (rutina) + auditoría promesa-vs-entrega en la home, sin hallazgos

Dental (`zz-qa-2026-09-13-0010`): recorrido completo, 9/9, cita 2026-09-14 09:00 vista en
`/appointments` (`cmtz290mr001j01rwcpel0kzm`), factura con ítem visible en
`/billing/cmtz29bso001l01rwnpsrimqb` (frenada sin pagar). `completo: true`, 0 filas `zz-qa-`
en `appointments` ni `organizations` al cerrar.

Con los 5 rubros ya cubiertos (lección de la vuelta pasada: no repetir rubro), el resto de la
vuelta fue el escalón 3: comparar lo que promete `onia.com.bo` contra la fuente y contra el
build vivo del contenedor `onia-platform`.

- **Precios de planes (Básico 320 / Crece 550 / Pro 890 / Full 1.290, anuales con -16%):**
  coinciden EXACTO con `docker exec onia-platform grep -rhoE 'monthly:[0-9]+' /app/.next/server`
  (320/550/890/1290/150/70/390/2900/0) y con `lib/plan-catalogo.ts` /
  `lib/pricing.ts` del árbol `onia-platform`. La escalera C (320/550/890/1290 + Crece,
  desplegada el 2026-09-12) está viva en el sitio Y en la plataforma — sin desfase.
- **Chatbot Bs 390/mes, "se suma a cualquier plan", incluido solo en Full:** coincide con
  `WHATSAPP_ADDON.entryMonthly=390` y `whatsappIncluded` en `plan-catalogo.ts` (`true` solo en
  `clinic`/`enterprise`=Full/Grupo, `false` en basic/crece/professional).
  "Chatbot de WhatsApp incluido (aparte vale Bs 390/mes)" en la tarjeta Full: exacto.
- **"Agente Recall solo en dentales, estética y servicios profesionales" (tarjeta Crece):**
  coincide con `guardaClientesEnPatients` (dental/estética/serv. profesionales — veterinaria ya
  no está en `RUBROS_ACTIVOS`, comercio/importadora no tienen `patients`).
- **Reservas online: add-on Bs 150/mes en Básico, incluidas desde Crece:** coincide con
  `publicBookingIncluded` (`false` en `free`/`basic`, `true` desde `crece`).
- **FAQ "¿Y si dejo de pagar, pierdo todo?"** ("la suspensión nunca implica borrarlos… podés
  exportar en CSV cuando quieras") es cita casi literal de `terminos.md` §3.4 ("La suspensión
  nunca implica borrar datos") y §4.2 (elimina "recién después de los plazos de retención") —
  no exhibe obra, no promete de más, no oculta el plazo real.
- **FAQ "¿La factura al SIN ya funciona?"**: dice homologación "en trámite", sin fecha vencida
  ni "muy pronto" — consistente con el estado fiscal vigente (plazo 1-oct-2026, sin la fecha
  falsa "30 de septiembre" que ya se corrigió en otras superficies).

Sin hallazgo nuevo. Próxima vuelta: seguir el escalón 3 en otra superficie (p.ej. `/precios`,
`/empezar`, o el flujo de checkout/cobro) en vez de repetir la home, o rotar de nuevo por rubro
si ya pasó bastante tiempo desde la última vez que se tocó cada uno.

---

## 2026-09-12 22:09-22:14 La Paz — dental 9/9 y Comercio 8/8, dos corridas seguidas, sin hallazgos

Rotando como quedó anotado la vuelta pasada (dental venía sano corrida tras corrida). Dental
(`zz-qa-2026-09-12-2209`): recorrido completo, 9/9, cita 2026-09-14 09:00 vista en
`/appointments` (`cmtyxy1um008a01rw9ndxxasu`), factura con ítem visible en
`/billing/cmtyxycp2008c01rw3vmvsru2` (frenada sin pagar). Comercio (`zz-qa-2026-09-12-2214`):
8/8 los que le corresponden — paso 7 sigue NO-APLICA por diseño (ese rubro no vende agenda,
coherente con su menú), dato del paso 6 cargado en storefront Catálogo y esta vez SÍ aparece
en `/dashboard`. Las dos corridas con `completo: true`, 0 filas `zz-qa-` en `appointments` ni
`organizations` al cerrar cada una (confirmado con `SELECT`). Sin hallazgo nuevo del producto.
Próxima vuelta: seguir rotando — importadora, estética o servicios profesionales llevan más
tiempo sin reverificar, o retomar promesa-vs-entrega en una superficie sin auditoría reciente.

---

## 2026-09-12 21:10 La Paz — dental 9/9 completo (rutina), y una basura huérfana de una corrida anterior limpiada

Al arrancar la vuelta, antes de correr el recorrido, `select count(*) from organizations where
name like 'zz-qa-%'` dio **1**, no 0: quedaba `zz-qa-2026-09-12-1009` (org, 2 `profiles` —uno
ADMIN con cuenta real en `auth.users`/`auth.identities`, otro DOCTOR "pendiente-..." del paso
equipo del onboarding—, 1 `organization_entitlements`), sin `patients` ni `appointments`. No
tiene entrada en este archivo ni en el tablero: una vuelta anterior la creó y no llegó a
borrarla (o murió antes de intentarlo). Se imprimió cada fila antes de borrar y se borró por
`id`/`organizationId` exacto, nunca por rango — quedó en 0 antes de correr nada nuevo.

Cuenta `zz-qa-2026-09-12-2110@onia.com.bo`: alta → confirmar correo → onboarding (6 pantallas,
"Clínica dental") → paciente `zz-qa-2026-09-12-2110-paciente` cargado en `/patients` y
encontrado de vuelta → cita 2026-09-14 09:00 agendada (201, `cmtyvtvkt007h01rw3uzfp7ji`) y
**vista** en `/appointments` → factura `/billing/cmtyvu6he007j01rwwegic7ed` con el ítem visible
(frenada sin pagar) → panel revisado (no lista pacientes, es lo esperado). `completo: true`, 0
filas `zz-qa-` en `appointments` ni `organizations` al cerrar (confirmado con `SELECT`, antes y
después). Sin hallazgo nuevo del producto — dental sigue sano corrida tras corrida; lo único de
esta vuelta fue la basura huérfana encontrada y limpiada al arrancar.

---

## 2026-09-12 09:09 La Paz — dental 9/9 completo (rutina)

Cuenta `zz-qa-2026-09-12-0909@onia.com.bo`: alta → confirmar correo → onboarding (6 pantallas,
"Clínica dental") → paciente `zz-qa-2026-09-12-0909-paciente` cargado en `/patients` y
encontrado de vuelta → cita 2026-09-14 09:00 agendada (201, `cmty62rvp006001rwmi44a3xh`) y
**vista** en `/appointments` (captura `paso-07d-cita-en-agenda.png` mirada: aparece en el día 14
de septiembre) → factura `/billing/cmty632jp006201rwj586giaj` con el ítem visible (frenada sin
pagar) → panel revisado (no lista pacientes, es lo esperado). `completo: true`, 0 filas `zz-qa-`
en `appointments` ni `organizations` al cerrar (confirmado con `SELECT`, tanto antes como
después de la corrida). Sin novedad, rutina sana — dental sigue confirmándose corrida tras
corrida sin hallazgos nuevos; próxima vuelta debería rotar a otro rubro o a promesa-vs-entrega.

---

## 2026-09-12 07:09 UTC — dental 9/9 completo (rutina)

Cuenta `zz-qa-2026-09-12-0709@onia.com.bo`: alta → confirmar correo → onboarding (6 pantallas,
"Clínica dental") → paciente `zz-qa-2026-09-12-0709-paciente` → cita 2026-09-14 09:00 vista en
`/appointments` → factura vista en `/billing/<id>` (frenada sin pagar) → panel revisado (no lista
pacientes, es lo esperado, no un fallo). `completo: true`, 0 filas `zz-qa-` en `appointments` ni
`organizations` al cerrar (confirmado con `SELECT`). Sin novedad, rutina sana.

---

## 2026-09-12 06:0x-06:1x UTC — dental 9/9 completo (rutina), tras un crash de navegador transitorio

Corrida anterior (04:20 UTC, quedó sin commitear en el árbol) explotó en el paso 2 con el
navegador cerrándose solo (`Target page, context or browser has been closed`, errores de dbus
al lanzar Chromium). Repetida ahora sin tocar nada: corrió limpio, 9/9, `completo: true`, 0 filas
`zz-qa-` al cerrar (confirmado con `SELECT` en `appointments` y `organizations`). No hay RAM bajo
presión (`free -h`: 8,4G libres) — el crash anterior parece transitorio del lanzador de Chromium,
no un problema del sitio ni de este instrumento. Si se repite seguido, ahí sí investigar el
lanzador; una sola vez no alcanza para diagnosticar nada.

Cuenta `zz-qa-2026-09-12-0609@onia.com.bo`: alta → confirmar correo → onboarding (6 pantallas) →
paciente → cita 2026-09-14 09:00 vista en `/appointments` → factura vista en `/billing` (frenada
sin pagar) → todo borrado en la misma corrida.

---

## 🔴 2026-09-12 04:09-04:19 UTC — dental 9/9 sin hallazgos; Importadora 8/8 pero con un CRUCE DE TENANT en el paso 6

**Dental** (`zz-qa-2026-09-12-0409`): recorrido completo de punta a punta, 9/9, 0 filas al cerrar.
Sin novedad, rutina sana.

**Importadora / distribuidora** (`zz-qa-2026-09-12-0413`): 8/8 los que le corresponden (paso 7
no-aplica, coherente, ese rubro no vende agenda). **Pero el paso 6 (cargar dato en `/comercio`)
escribió la fila `patients` en la organización REAL de Sergio Urcullo** (`Clínica Sergio`,
`organizationId cmtlyz6y9000001nw2934n3cw`, slug `clinica-sergio-p2ljs`, dueño
`sergio@onia.com.bo`) — **no** en la org de prueba que este mismo run acababa de crear
(`cmtxvf61d001i01rw6b2t6k99`). Verificado con `SELECT` directo en `supabase-db`, dos veces: la
primera consulta mostró la fila viva ahí; para la segunda ya no estaba — la borró mi propia
limpieza por patrón de nombre, que no filtra por `organizationId` (borra `LIKE 'zz-qa-%'` en toda
la tabla, a propósito, para barrer huérfanos de corridas caídas). Eso evitó que quedara basura,
pero también significa que **si el nombre no hubiera llevado el prefijo `zz-qa-`, un dato de
prueba se habría quedado mezclado con los pacientes reales de Sergio para siempre**, sin que nadie
lo notara.

No sé la causa (no toco el producto): puede ser un caché de organización compartido entre
requests concurrentes — varios loops corren contra `app.onia.com.bo` al mismo tiempo — o un
fallback a una organización por defecto. Reportado prioridad 1: `t_3f352044`. Capturas:
`paso-06-cargar-dato.png`, `paso-06-menu.png`, `paso-06b-alta-dato.png`,
`paso-06c-dato-en-la-lista.png` (de esta corrida, sobreescriben las anteriores — sin fecha en el
nombre de archivo, como manda la regla del proyecto; el `resumen.json` de esta corrida es la
prueba con los ids exactos).

Cero filas `zz-qa-` propias en la base al cerrar la vuelta (confirmado en las 4 tablas:
`organizations`, `patients`, `appointments`, `auth.users`).

---

## 2026-09-11 19:1x La Paz — 9/9 dental completo (rutina) + confirmación QR en `/empezar`

Corrida completa con `--escribir` en dental: los 9 pasos OK, `completo: true`, 0 filas `zz-qa-`
al cerrar (cuenta, org, paciente, cita, factura — todo creado y borrado en la vuelta). Sin
hallazgos nuevos ahí: dental sigue sano, ya son varias corridas seguidas.

Miré también `onia.com.bo/empezar`, paso "03 Usalo de verdad 14 días": producción sigue
sirviendo **"Si te sirve, pagás por QR; si no, no pagás nada"**, y `docker exec onia-platform
env | grep -c '^BCP_QR_'` sigue dando **0** — no hay QR. El código YA está arreglado
(`src/content/medio-de-pago.ts`, commit `b438f587`, en `origin/main`, deriva el texto de
`QR_PARA_PAGARLE_A_ONIA=false` y dice "por transferencia"), y el pedido de deploy de landing
que lo incluye ya existe en el tablero (`t_0d401da3`, blocked). No es un hallazgo nuevo, es
confirmación de que ese pendiente sigue vigente — no abrí tarea duplicada.

Próxima vuelta: seguir con promesa-vs-entrega en `/comparativa` o `/servicios`, que no tienen
auditoría reciente.

---

## 2026-09-11 15:1x La Paz — Promesa vs entrega en `/agentes`, `/comparativa` y `/v1` (comercio)

Siguiendo el plan de la vuelta anterior: creé una org QA real de **Comercio / tienda**
(`qa-modulos-ublr4`, borrada al cerrar) con `alta_qa_rubro.mjs` + `onboarding_por_la_ui.mjs`
(onboarding completo, 5 filas de horario) y miré `/agents` y `/appointments` como lo haría el
dueño.

- **`/agents` para comercio ya está bien acotado**: sólo muestra el agente "Cobrador — saldos
  vencidos" (facturas con saldo vencido), **no** "Recall" (que es de clientes/citas). Coincide
  con lo que promete `onia.com.bo/agentes` de forma genérica y con `rolCorreEnTrack` ya
  verificado el 2026-09-11 por la vuelta anterior. Captura: `/tmp/agents-comercio.png` (no
  versionada, sólo para esta nota).
- **`/appointments` redirige a `/dashboard`** para comercio (confirmado en vivo: no hay agenda
  para este rubro) — esperado, `gestios-general` no tiene `tieneAgenda`.
- **PERO `onia.com.bo/v1` sigue sirviendo la promesa vieja en producción**: el paso "02 Tu cuenta
  queda lista" dice **"Agenda, clientes y caja ya adentro"**, tres líneas después de enumerar
  "Dental, comercio, importadora, estética o servicios profesionales" como los 5 rubros — y
  comercio/importadora no tienen agenda. **Ya está arreglado en el código** (`how-it-works.tsx`
  ahora dice "Clientes, caja y cobros ya adentro, y agenda {ALCANCE_CON_AGENDA}", con guard
  `capacidad-en-la-enumeracion.test.ts`) y **ya está en la cola de deploy vigente**: `t_f737839c`
  (plataforma, 23 arreglos sin publicar) — no es un hallazgo nuevo, es confirmación de que ese
  pedido de deploy sigue siendo real y de que el arreglo es correcto. No abrí tarea duplicada.

Cero filas `zz-qa-` propias al cerrar (verificado: `organizations`, `profiles`, `auth.users`,
`auth.identities`, `doctor_schedules`, `organization_entitlements` — los 6 borrados a mano por id
exacto, script `alta_qa_rubro.mjs` no trae limpieza propia).

## 2026-09-11 14:0x-14:1x La Paz — Clínica dental, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-1409` — recorrido completo de punta a punta: alta (confirmar correo primero),
onboarding 6 pantallas, paciente cargado en `/patients` y encontrado de vuelta, cita
`2026-09-14 09:00` agendada (201, id `cmtx1cmqj009m01rwdw6mxp56`) y vista en `/appointments`,
factura con ítem visible en `/billing/cmtx1cxuh009o01rwbltui0zq` (frenado ahí, sin pagar). Cero
filas `zz-qa-` propias al cerrar. Octava corrida seguida en dental sin novedad — este rubro está
agotado como fuente de hallazgos nuevos con este instrumento. **Próxima vuelta: NO repetir
ningún rubro** — ir directo al escalón de promesa-vs-entrega en `/comparativa` y `/agentes`
(botones y ledger de esas páginas, no la home) o auditar un formulario de un rubro que aún no
tiene corrida con `--movil` reciente.

## 2026-09-11 12:1x La Paz — Servicios profesionales, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-1211` — recorrido completo de punta a punta: alta (confirmar correo primero),
onboarding 6 pantallas (pregunta → negocio → horarios → servicios → equipo → listo, horarios
lun-vie 09-13 y 15-19 cargados, 5 filas de agenda), cliente cargado en `/patients` y encontrado
de vuelta, cita `2026-09-14 09:00` agendada (201, id `cmtwx4kmz008f01rwb9kgpqaq`) y vista en
`/appointments`, pantalla de cobro mirada en `/comercio/caja` (frenado ahí). Cero filas `zz-qa-`
propias al cerrar.

Aparte, auditado en código (sin escribir nada): la promesa de `onia.com.bo/agentes` sobre
Recall ("Detecta clientes que no vuelven hace meses y no tienen próxima cita") ya está acotada
por rubro donde corresponde — `rolCorreEnTrack("recall", trackId)` en
`lib/onia-core/modules/agents-por-rubro.ts` sólo lo enciende para tracks que guardan clientes
en `patients` (dental, estética, veterinaria, servicios profesionales), y el panel `/agents`
(`agents-view.tsx:99`) ya filtra la tarjeta con el mismo helper — comercio e importadora no ven
ni corren Recall. Sin hallazgo: esto ya lo cerró chatbot-cola (commit `64279ff`, memoria
compartida 2026-09-08).

Los 5 rubros activos están reverificados en las últimas 24h sin un solo hallazgo nuevo. Próximo
escalón: seguir con promesa-vs-entrega en superficies que no sean la home (p. ej. `/agentes`,
`/comparativa`), no repetir un rubro más.

## 2026-09-11 09:1x-10:1x La Paz — Comercio / tienda, reverificado: 9/9 (paso 7 no-aplica por diseño), sin hallazgos

`zz-qa-2026-09-11-1009` — tercera reverificación de Comercio en 24h, mismo resultado que la
`zz-qa-2026-09-11-0709`: alta (confirmar correo primero), onboarding 6 pantallas, cliente
cargado en storefront `/comercio` y encontrado de vuelta, cobro mirado en `/comercio/caja`
(frenado ahí), dato visible en `/dashboard`. Paso 7 sigue NO-APLICA por diseño (Comercio no
vende agenda). Cero filas `zz-qa-` propias al cerrar. Los 5 rubros activos (dental, comercio,
importadora, estética, servicios profesionales) están reverificados en las últimas 24-48h sin
un solo hallazgo nuevo — veterinaria no está en `RUBROS_ACTIVOS` y este instrumento no la cubre
a propósito. Próximo escalón de valor: promesa-vs-entrega en la home (qué promete cada botón
contra lo que la pantalla siguiente entrega), no repetir rubro.

## 2026-09-11 09:09-09:1x La Paz — Clínica dental, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-0909` — recorrido completo de punta a punta: alta (confirmar correo primero),
onboarding 6 pantallas, paciente cargado en `/patients`, cita `2026-09-14 09:00` agendada (201,
id `cmtwqmpdx006k01rwbmpltxfg`) y vista en `/appointments`, factura con ítem visible en
`/billing/cmtwqn04l006m01rw2qc7ev1f` (frenado ahí, sin pagar). Cero filas `zz-qa-` propias al
cerrar. Séptima corrida seguida en dental sin novedad — próxima vuelta rota a comercio o
importadora, que llevan más de un día sin reverificar.

## 2026-09-11 — Comercio / tienda, reverificado: 9/9 (paso 7 no-aplica por diseño), sin hallazgos

`zz-qa-2026-09-11-0709` — recorrido completo de punta a punta: alta (confirmar correo primero),
onboarding 6 pantallas, cliente cargado en storefront `/comercio` (Catálogo) y encontrado de
vuelta en la lista, pantalla de cobro mirada en `/comercio/caja` (frenado ahí, sin cobrar), y el
dato visible en `/dashboard`. Paso 7 (agendar cita) sale NO-APLICA de forma coherente: el pack de
Comercio no tiene agenda ni en su tarjeta de venta ni en su menú (Conversaciones, Catálogo,
Inventario, Caja, Fiados, Clientes, Gastos, Contabilidad, Planilla, Agentes, Requerimientos,
Equipo, Configuración, Ayuda — ninguna es agenda/citas). Cero filas `zz-qa-` propias al cerrar.

## 2026-09-11 02:09-02:13 La Paz — Clínica dental, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-0609` — recorrido completo de punta a punta: alta (confirmar correo primero),
onboarding 6 pantallas, paciente cargado en `/patients`, cita `2026-09-14 09:00` agendada (201,
id `cmtwk774j004u01rwt69orc9q`) y vista en `/appointments`, factura con ítem visible en
`/billing/cmtwk7i6a004w01rw463lxvbt` (frenado ahí, sin pagar). Cero filas `zz-qa-` propias al
cerrar. Sexta corrida seguida en dental sin novedad — próxima vuelta rota a comercio o
importadora, que llevan más de un día sin reverificar.

## 2026-09-11 00:14-00:18 La Paz — Servicios profesionales, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-0414` — recorrido completo de punta a punta: alta (confirmar correo primero),
onboarding 6 pantallas, cliente cargado en `/patients` (group Clientes), cita `2026-09-14 09:00`
agendada (201, id `cmtwg3ly8003j01rwg7u7zbf6`) y vista en `/appointments`, pantalla de cobro
mirada en `/comercio/caja` (frenado ahí, sin cobrar). Cero filas `zz-qa-` propias al cerrar. Los
cinco rubros activos (dental, estética, comercio, importadora, servicios profesionales) están
todos reverificados en las últimas 24 h, todos sanos.

## 2026-09-11 00:09-00:12 La Paz — Clínica dental, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-0409` — recorrido completo de punta a punta: alta, onboarding 6 pantallas,
paciente cargado en `/patients`, cita `2026-09-14 09:00` agendada (201, id
`cmtwfxivw002z01rwz6qkn8a5`) y vista en `/appointments`, factura con ítem visible en
`/billing/cmtwfxu3f003101rwbsgjwbgl` (frenado ahí, sin pagar). Cero filas `zz-qa-` propias al
cerrar. Quinta corrida seguida en dental sin novedad — rotado a servicios profesionales en la
misma vuelta (ver entrada de arriba).

## 2026-09-11 02:14-02:17 La Paz — Estética y spa, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-0214` — recorrido completo de punta a punta: alta, onboarding 6 pantallas,
clienta cargada en `/patients` (group Clientas), cita `2026-09-11 09:00` agendada (201, id
`cmtwbsiq4001j01rwosnfl9rz`) y vista en `/appointments`, factura con ítem visible en
`/billing/cmtwbstv5001l01rwud8doruo` (frenado ahí, sin pagar). Cero filas `zz-qa-` propias al
cerrar. Segundo rubro seguido sin novedad hoy (dental + estética); próxima vuelta debería
probar comercio, importadora o servicios profesionales, que llevan más de un día sin
reverificarse.

## 2026-09-11 02:09-02:12 La Paz — Clínica dental, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-11-0209` — recorrido completo de punta a punta en dental: alta (confirmar correo
primero), onboarding 6 pantallas, paciente cargado en `/patients`, cita `2026-09-11 09:00`
agendada (201, id `cmtwbmqsn000u01rwdwxhweaf`) y vista en `/appointments`, factura con ítem
visible en `/billing/cmtwbn2es000w01rwy589dweh` (frenado ahí, sin pagar). El panel `/dashboard`
no lista pacientes — sigue siendo lo esperado, no un fallo. Cero filas `zz-qa-` propias al
cerrar (confirmado en `appointments` y `organizations`). Cuarta corrida seguida en dental sin
novedad: próxima vuelta debería rotar a otro rubro o auditar promesa-vs-entrega en vez de repetir
dental de nuevo.

## 2026-09-10 23:10-23:17 La Paz — Clínica dental, reverificado: 9/9, sin hallazgos

`zz-qa-2026-09-10-2310` — recorrido completo de punta a punta en dental: alta (confirmar
correo primero, como el cliente real), onboarding 6 pantallas, paciente cargado en
`/patients`, cita `zz-qa-` agendada y vista en `/appointments`, factura con ítem visible en
`/billing/<id>` (frenado ahí, sin pagar). El panel `/dashboard` no lista pacientes — es lo que
muestra, no un fallo. Cero filas `zz-qa-` propias al cerrar (confirmado en `appointments` y
`organizations`).

## 2026-09-10 20:11-20:17 La Paz — Comercio / tienda, reverificado: 8/8, sin hallazgos

`zz-qa-2026-09-10-2011` — primera corrida propia en este rubro desde el 2026-09-03 (con el
instrumento actual, de 9 pasos). 9/9 con el paso 07 en NO-APLICA (coherente: la tarjeta de
`/register` ofrece "Catálogo, inventario, caja y clientes", sin agenda, y el menú tampoco la
tiene). El dato del paso 6 se guardó en storefront Catálogo y se encontró de vuelta; el paso 8
frenó en `/comercio/caja` a propósito. Los cinco rubros de `RUBROS_ACTIVOS` siguen todos sanos.
Cero filas `zz-qa-` propias al cerrar; 4 ajenas sin tocar.

## 2026-09-10 19:09-19:13 La Paz — Importadora / distribuidora, primera corrida con este instrumento: 9/9, sin hallazgos

`zz-qa-2026-09-10-1909` — primera vez que este rubro pasa por el recorrido de 9 pasos (cubierto
antes solo por veterinaria e importadora quedaban sin corrida propia). 9/9 completo, sin
agujeros. El paso 07 (agendar cita) salió **NO-APLICA**, y es coherente: la tarjeta de
`/register` para este rubro dice "Catálogo, cotizaciones B2B y costeo de importación" — sin
agenda — y su menú tampoco la ofrece (Conversaciones, Catálogo, Cotizaciones, Inventario, Costeo
de importación, Alerta de reprecio, Ventas, Créditos, Gastos, Contabilidad, Planilla, Agentes,
Requerimientos, Equipo, Configuración). El dato del paso 6 (`-paciente`) se guardó en storefront
Catálogo, no en Pacientes — otra señal de que el rubro no maneja agenda clínica. El paso 8 frenó
en `/comercio/fiados` (Créditos) a propósito. Cero filas `zz-qa-` propias al cerrar; 4 ajenas sin
tocar.

## 2026-09-10 18:09-18:16 La Paz — dental y Servicios profesionales, dos corridas seguidas: 9/9 los dos, sin hallazgos

Dental (`zz-qa-2026-09-10-1809`) tercera corrida seguida en 9/9: nada nuevo, confirma que el
falso rojo intermitente de las 13:09 no reprodujo otra vez. Servicios profesionales
(`zz-qa-2026-09-10-1814`) — **primera vez que este rubro pasa por el instrumento de 9 pasos**
(antes sólo tenía cobertura del script viejo de 8 pasos). 9/9 completo: paciente cargado como
"Clientes", cita agendada y vista en `/appointments`, y el paso 8 (cobro) frenó en
`/comercio/caja` con lenguaje correcto — "Registrá ventas", "Todavía no hay servicios vendibles.
Cargá el primero en Servicios" — sin rastro del defecto de idioma ("productos con stock") que
`chatbot-cola` había cerrado el 06 y el 08-sep en esa misma pantalla. Cero filas `zz-qa-`
propias al cerrar las dos veces; 4 filas ajenas sin tocar.

## 2026-09-10 13:09-13:24 La Paz — dental, dos corridas seguidas: falso rojo intermitente en paso 6 (mi instrumento, no el producto)

Primera corrida: `zz-qa-2026-09-10-1710`, llegó hasta el paso 5 (9/9). **Paso 6 "roto"**: el
script reportó "el formulario de alta de Pacientes no tiene ni un campo de texto" en
`/patients/new`. Antes de escalarlo (Gate 1) miré la captura `paso-06b-alta-dato.png` de esa
corrida: el formulario SÍ tenía "Nombre completo" con placeholder visible. Agregué debug
temporal (`DEBUG_FORM=1`) a `acotarFormulario`/`llenarFormulario` y corrí de nuevo:
`zz-qa-2026-09-10-1718`, **9/9 completo** — el mismo formulario, el mismo código, `nombreCargado:
true` con los 9 campos detectados bien. No reproduce: fue un fallo intermitente del instrumento
(timing al hacer clic en "Nuevo Paciente" y acotar el formulario antes de que termine de
renderizar), no un defecto del producto. Debug quitado del script tras confirmar. Cero filas
`zz-qa-` propias al cerrar (0 organizaciones, 0 citas mías; 4 filas ajenas sin tocar).

## 2026-09-10 16:09-16:17 La Paz — dental y Estética, dos corridas seguidas: 9/9 los dos, sin hallazgos

Reintento pedido por la vuelta anterior. Dental (`zz-qa-2026-09-10-1609`) 9/9 completo, cita
201 vista en `/appointments`, factura vista y frenada. Estética (`zz-qa-2026-09-10-1613`) 9/9
completo — **el paso 7 (agendar cita) que se había roto a las 15:13 hoy mismo esta vez agendó
bien** (cita `2026-09-11 12:30`, id `cmtvqcb69001901rwsn70fjtb`, vista en la agenda). El hallazgo
de las 15:13 (`t_645d123a`) ya está `done`: arreglado en `a6dee65` sobre
`claude/chatbots-platform-review-0d1d09` — confirma que era el bug de timing que ese commit
corrige (el reset de `timeSlot` pisando la selección del usuario), no un defecto exclusivo del
rubro. Esa rama todavía no está en `master`; si el fix ya llegó a producción lo dice esta misma
corrida en verde. Cero filas `zz-qa-` propias al cerrar; 4 filas ajenas sin tocar.

## 2026-09-10 15:10-15:13 La Paz — Estética y spa escritorio: ROTO en paso 7 (agendar cita)

Cambié de rubro tras tres vueltas seguidas en dental sin novedad. Cuenta
`zz-qa-2026-09-10-1510@onia.com.bo`, onboarding en 6 pantallas (saltando "servicios", no es la
causa), clienta `zz-qa-2026-09-10-1510-paciente` cargada y encontrada, factura vista en
`/billing/cmtvo3wd1002601rwewfrht18`. **Se rompe en el paso 7**: con clienta, profesional, fecha
y hora elegidos, el botón "Agendar Cita" sigue deshabilitado — nunca sale el POST a
`/api/appointments`. Causa probable: un `useEffect` en `appointments/page.tsx:204-224` resetea
`timeSlot` a `''` cada vez que resuelve el fetch de disponibilidad, sin condicionar por si es la
respuesta más reciente — si se dispara dos veces (doctorId vacío → real al abrir el modal) el
fetch lento puede pisar la selección del usuario después del click. Reportado en el tablero
(`t_645d123a`, prioridad 1) y en `hermes-content/docs/cola/plataforma-v1.md`. Capturas
`paso-07-cita.png` y `paso-07b-cita-formulario.png`. Cero filas `zz-qa-` propias al cerrar (4
ajenas, sin tocar). **No reproducido hoy en dental ni antes en comercio** — puede ser
intermitente por timing, no exclusivo del rubro; próxima vuelta debería reintentar Estética (o
los otros rubros) para ver si se repite.

## 2026-09-10 14:09-14:17 La Paz — dental escritorio: 9/9, sin hallazgos

Reverificado de nuevo (varias vueltas seguidas dental sin novedad). Cuenta
`zz-qa-2026-09-10-1409@onia.com.bo`, onboarding en 6 pantallas, paciente
`zz-qa-2026-09-10-1409-paciente` cargado y encontrado en `/patients`, cita `2026-09-11 09:00`
agendada (201) y vista en `/appointments`, factura creada con el ítem visible en
`/billing/<id>` y frenada sin cobrar. Panel del paso 9 no lista pacientes — es lo esperado, no
un agujero. Cero filas `zz-qa-` propias al cerrar; 4 filas ajenas (de otras vueltas/carriles)
detectadas y NO tocadas.

## 2026-09-09 00:32 La Paz — comercio escritorio (`RECORRIDO_RUBRO`): 8/8 que le corresponden, sin hallazgos

Tras dos vueltas seguidas en dental con el mismo resultado, cambio de rubro: `RECORRIDO_RUBRO="Comercio / tienda"`.
Cuenta `zz-qa-2026-09-09-0014@onia.com.bo`, onboarding en 6 pantallas, dato
`zz-qa-2026-09-09-0014-paciente` cargado en `/comercio` (Catálogo) y encontrado, visible en el
panel del paso 9. Paso 7 (cita) sale NO-APLICA correctamente: el pack de Comercio no vende
agenda (coherente con su menú, sin ítem de citas) — no es un agujero. Cobro visto en
`/comercio/caja`, frenado sin pagar. Cero filas `zz-qa-` propias al cerrar. Nada roto.

## 2026-09-09 00:09 La Paz — dental escritorio: 9/9, sin hallazgos, base limpia al arrancar

Repetición del recorrido completo (dental, escritorio 1440x900), sin huérfanos previos esta vez
(`count(*) LIKE 'zz-qa-%'` en `organizations` = 0 al arrancar). Cuenta `zz-qa-2026-09-09-0009@onia.com.bo`,
onboarding en 6 pantallas, paciente `zz-qa-2026-09-09-0009-paciente` cargado y encontrado, cita
`2026-09-09 09:00` agendada y vista en `/appointments` (`cmttcgv83000m01rwuq21nkw2`), factura
`/billing/cmttch6mx000o01rwr2xerkk2` con ítem visible, frenada sin pagar. Cero filas `zz-qa-`
propias al cerrar (4 ajenas de otros carriles, sin tocar). Nada roto en el producto — segunda
vuelta seguida con el mismo resultado.

## 2026-09-08 23:10-23:15 La Paz — dental escritorio: 9/9, y un huérfano de la vuelta ANTERIOR encontrado y limpiado

Al arrancar había **1 organización `zz-qa-2026-09-08-2209-negocio` viva en producción**, con su
perfil ADMIN y un profesional DOCTOR sin dato — la vuelta previa (commit `a6dd4646`, 22:11 UTC)
llegó hasta el paso 05 (`elegir-rubro`, las capturas lo confirman) y **soltó el turno antes de
`limpiarProduccion()`**: exactamente el escenario que `--solo-limpiar` existe para barrer (ver el
comentario junto al guard de `main()`), pero esa vuelta no lo dejó corriendo y nadie lo invocó al
empezar ésta. Se imprimió la fila, se confirmó que era mía por el patrón `zz-qa-<fecha>-<hora>-negocio`
del propio script, y se borró por id exacto (perfiles → organización → `auth.users`) antes de
correr nada nuevo. Verificado después: `count(*) LIKE 'zz-qa-%'` en `organizations` = 0.

Con la base limpia, recorrido nuevo (dental, escritorio 1440x900): **9/9, sin hallazgos**. Cuenta
`zz-qa-2026-09-08-2310@onia.com.bo`, correo confirmado con el enlace real, onboarding en 6
pantallas, paciente cargado y encontrado, cita `2026-09-09 09:00` agendada y vista en
`/appointments` (`cmttacrxm005w01rw7kzll8pe`), factura `/billing/cmttad3ik005y01rw4b9rh99c` con
ítem visible, frenada sin pagar. Cero filas `zz-qa-` propias al cerrar (4 ajenas de otros
carriles, sin tocar). Nada roto en el producto.

**Lo que queda anotado para la próxima vuelta de este carril:** al arrancar, antes del recorrido
completo, correr primero `node scripts/recorrido_cliente.mjs --solo-limpiar` — barre cualquier
huérfano `zz-qa-AAAA-MM-DD-HHMM` que una vuelta anterior haya dejado por soltar el turno a mitad
de camino, sin depender de que el recorrido entero termine para poder limpiarse solo.

## 2026-09-08 21:06-21:26 La Paz — móvil (390x844) en LOS 5 RUBROS: cierre completo, sin hallazgos

Dental (escritorio, reverificación) + `RECORRIDO_MOVIL=1` en Comercio, Estética, Importadora y
Servicios profesionales — los 5 rubros de `RUBROS_ACTIVOS` quedan cubiertos en móvil, no sólo
dental. Los 4 nuevos: cuenta creada, correo confirmado, onboarding en 6 pantallas, dato de rubro
cargado y encontrado, cobro visto y frenado sin pagar. Comercio e Importadora: paso 7 (cita)
NO-APLICA porque esos rubros no venden agenda (coherente con su pack, sin agenda en el menú) —no
es un agujero. Estética y Servicios profesionales: 9/9 completo, cita agendada y vista. Cero filas
`zz-qa-` propias al cerrar cada corrida (4 ajenas de otros carriles, sin tocar, ninguna). Nada
roto en ningún rubro. Con esto se cierra el ítem "falta correr RECORRIDO_MOVIL en 4 rubros" de la
cola.

## 2026-09-08 18:09-18:16 La Paz — móvil (390x844) en Importadora: 9/9, sin hallazgos

`RECORRIDO_RUBRO=Importadora RECORRIDO_MOVIL=1`: recorrido completo salvo el paso 7 (cita), que
este rubro no vende — no tiene agenda en su pack, así que no aplica y no cuenta como agujero.
Cuenta `zz-qa-2026-09-08-1813@onia.com.bo` creada, correo confirmado, onboarding completo,
producto/cliente `zz-qa-2026-09-08-1813-paciente` cargado, factura vista, frenada sin pagar.
Cero filas `zz-qa-` propias al cerrar (4 ajenas de otros carriles, sin tocar). Nada roto. Queda
pendiente `RECORRIDO_MOVIL=1` en servicios profesionales y comercio.

## 2026-09-08 13:09-13:26 La Paz — reverificado dental escritorio: 9/9, sin hallazgos

`node scripts/recorrido_cliente.mjs --escribir` (dental, 1440x900): recorrido completo, 9/9.
Cuenta `zz-qa-2026-09-08-1709@onia.com.bo` creada, correo confirmado, onboarding en 6 pantallas,
paciente `zz-qa-2026-09-08-1709-paciente` cargado en Pacientes, cita 2026-09-09 09:00 agendada y
vista en `/appointments` (id `cmtsxgsgs00fk01rw8slv6az7`), factura `/billing/cmtsxh4gc00fm01rw7lyvyrwi`
con ítem visible, frenada sin pagar. El panel `/dashboard` no lista Pacientes — confirmado que no
es un fallo (esa pantalla no muestra esa sección). Cero filas `zz-qa-` propias al cerrar (4 ajenas
de otros carriles, sin tocar). Nada roto.

## 2026-09-08 12:09-12:19 La Paz — móvil (390x844) también en Estética: 9/9, sin hallazgos

`RECORRIDO_RUBRO=Estética RECORRIDO_MOVIL=1`: recorrido completo, 9/9. Cuenta creada, correo
confirmado, onboarding en 6 pantallas, paciente `zz-qa-...-paciente` cargado en Clientas, cita
2026-09-09 09:00 agendada y vista en `/appointments` (id `cmtsmr3xp00c001rwrt8glw26`), factura
`/billing/cmtsmrggu00c201rweq5auxyv` con ítem visible, frenada sin pagar. El panel `/dashboard`
no lista la ficha del paciente — confirmado que no es un fallo (esa pantalla no muestra Clientas,
igual que en dental). Cero filas `zz-qa-` propias al cerrar (4 ajenas de otros carriles, sin
tocar). Nada roto. Queda pendiente `RECORRIDO_MOVIL=1` en importadora, servicios profesionales y
comercio.

## 2026-09-08 11:09-11:16 La Paz — reverificado dental: escritorio (1440x900) y móvil (390x844), 9/9 los dos

Dos corridas `--escribir` seguidas, dental: **escritorio 9/9** (cita `cmtsklcpw00ai01rwwkhv0298`
agendada y vista en `/appointments`, factura `/billing/cmtsklniz00ak01rwn7ek0bpm` con ítem
visible, frenada sin pagar) y **`RECORRIDO_MOVIL=1` 9/9** (cita `cmtskqqri00b901rw2a444iqn`
agendada y vista, factura `/billing/cmtskr2wk00bb01rwbi93fv62`). El arreglo del selector de
agenda móvil de la vuelta anterior se sostiene. Cero filas `zz-qa-` propias al cerrar las dos
veces (4 ajenas de otros carriles, sin tocar). Nada roto. Queda pendiente `RECORRIDO_MOVIL=1`
en estética, importadora, servicios profesionales y comercio — hoy sólo se corrió en dental.

## 2026-09-08 10:09-10:27 La Paz — primer recorrido en MÓVIL (390x844): falso rojo del propio instrumento, arreglado

`RECORRIDO_MOVIL=1` (agregado en la vuelta anterior, nunca corrido en vivo hasta ahora) repite el
camino completo en viewport de teléfono (390x844), porque una pantalla mirada en 1440x900 queda
mirada para ESE viewport y nada más.

Primera corrida (dental, escritorio de referencia ya sano dos veces esta hora): **9/9 salvo el
paso 7**, que dio ROJO — "la cita se creó (201) y NO aparece en la agenda: el producto la guardó
y no la muestra (tocar el día tampoco sirvió: no encontré una celda con el número de día en la
grilla)". La captura (`paso-07d-cita-en-agenda.png`) mostraba, sin embargo, un **punto naranja
sobre el día 9** — el calendario en móvil SÍ marca la cita, sólo que con un punto de color en vez
de texto (el nombre vive en el panel de detalle, que sólo se pinta con el día seleccionado —
`app/(dashboard)/appointments/page.tsx:527`). El selector que debía tocar el día
(`div.grid > div` filtrado por texto exacto) daba **0 coincidencias** contra una celda que se ve
perfecta en la foto: instrumento roto, no producto.

Se cambió el selector a `page.getByText(/^9$/, {exact:true})` (lo que un dedo real toca) en
`facturarZzQa()`/el bloque de verificación de agenda de `scripts/recorrido_cliente.mjs`. Segunda
corrida, dental en móvil: **9/9 completo**, con el click al día 9 revelando el panel "9 de
septiembre · 1 cita(s) · 09:00 · 30 min" y el nombre del paciente — visto en
`paso-07d-cita-en-agenda.png`. Cero filas `zz-qa-` propias al cerrar las dos corridas (4 ajenas
sin tocar).

**Nada roto en producto.** El hallazgo real de la vuelta fue del propio instrumento, y quedó
arreglado y verificado en la misma vuelta. Queda pendiente correr `RECORRIDO_MOVIL=1` en los
otros cuatro rubros — hoy sólo se probó dental.

## Reverificado el 2026-09-08 09:09 y 09:13 La Paz — dental (9/9) y Estética (9/9) siguen sanos

Dos corridas `--escribir` seguidas desde nodo-casa: **dental 9/9** (cita agendada y vista,
factura `/billing/cmtsgbndg006i01rwrzk1piwf` con ítem visible, frenada sin pagar) y **Estética
9/9** (`RECORRIDO_RUBRO=Estética`; cita agendada y vista en `/appointments`, cobro en
`/billing/cmtsgh3js007701rwg00wre3e` con ítem visible). Estética no se reverificaba desde hacía
más de un día. Cero filas `zz-qa-` propias al cerrar las dos veces (4 ajenas de otros carriles,
sin tocar). Nada roto. Queda pendiente reverificar importadora, o retomar promesa-vs-entrega.

## Reverificado el 2026-09-08 08:09 y 08:14 La Paz — dental (9/9) y servicios profesionales (9/9) siguen sanos

Dos corridas `--escribir` seguidas: **dental 9/9** (cita agendada y vista, factura
`/billing/cmtse6njm005801rwuy6i43c6` con ítem visible, frenada sin pagar) y **servicios
profesionales 9/9** (cita agendada y vista en `/appointments`, cobro en `/comercio/caja` —
sigue siendo la misma pantalla compartida con comercio, como quedó cerrado en `t_2b03ea3d`).
Cero filas `zz-qa-` propias al cerrar las dos veces (4 ajenas de otros carriles, sin tocar).
Dos vueltas seguidas sin hallazgo nuevo en estos dos rubros: falta reverificar estética e
importadora, que no se corren desde hace más de un día, o retomar promesa-vs-entrega.

## Reverificado el 2026-09-08 06:09 y 06:15 La Paz — dental (9/9) y comercio (8/8) siguen sanos, paso 9 confirmado también fuera de dental

Dos corridas `--escribir` seguidas desde nodo-casa: **dental 9/9** (cita agendada y vista, factura
`/billing/cmts9wtdp002i01rwb62n2kbb` con ítem visible, frenada sin pagar) y **comercio 8/8** (el
paso 7 no aplica — comercio no vende agenda, y el producto es coherente: su nav tampoco la tiene).
Cero filas `zz-qa-` propias al cerrar las dos veces (4 ajenas de otros carriles, sin tocar).

Novedad real de esta vuelta: el paso 9 (panel/bandeja) ya se había probado en dental pero no en
otro rubro — en comercio el dato del paso 6 (`zz-qa-...-paciente`, cargado en Catálogo) **sí
aparece** en `/dashboard`. Nada roto. Dos vueltas seguidas sin hallazgo nuevo: el próximo paso es
probar promesa-vs-entrega o el panel en un tercer rubro (estética/importadora/servicios), no
repetir dental/comercio otra vez.

## Reverificado el 2026-09-08 05:09 La Paz — dental sigue 9/9, y la promesa de servicios profesionales ("...y contabilidad") se cruzó contra el código

Corrida `--escribir` completa: **RECORRIDO COMPLETO en Clínica dental, 9/9 pasos OK**, cobro
incluido (`/billing/cmts7rid4001p01rwwpij8y8x`, ítem visible, frenado sin marcar pagada). Cero
filas `zz-qa-` propias al cerrar (4 ajenas de otros carriles, sin tocar). Nada roto.

Con el recorrido en verde y los cinco rubros ya confirmados frescos (ver entrada de abajo,
2026-09-07), se probó el escalón "promesa contra entrega": las 5 tarjetas de `/register` se
leyeron en vivo con Playwright y se cruzó cada promesa contra el nav real del pack en
`vertical-pack.ts`. Las cinco cierran — incluida "Servicios profesionales: Agenda, citas, cobros
y **contabilidad**", que tiene `/contabilidad` en `SERVICIOS_NAV_ITEMS` (línea 405). Nada para
reportar.

## Reverificado el 2026-09-07 21:09 y 21:14 La Paz — dental (9/9) y comercio (8/8) siguen sanos

Dos corridas `--escribir` seguidas desde nodo-casa: **dental 9/9** (incluido cobro,
`/billing/cmtrz6ejx001401rw9goqmilh`) y **comercio 8/8** (paso 7 no-aplica, coherente: ese
rubro no vende agenda ni en su tarjeta de venta ni en su menú; cobro en `/comercio/caja`, y el
paciente del paso 6 SÍ aparece en el panel esta vez). Comercio no se reverificaba desde el
2026-09-03 (5 días). Nada roto. Cero filas `zz-qa-` propias al cerrar las dos veces (4 ajenas
sin tocar).

## Reverificado el 2026-09-07 19:13 La Paz — Servicios profesionales pasa a 9/9: el arreglo de `t_2b03ea3d` sostiene

Corrida `--escribir` completa con `RECORRIDO_RUBRO='Servicios profesionales'`: **RECORRIDO
COMPLETO, 9/9 pasos OK** — el paso 6 (cliente) y el paso 7 (agendar) que estaban rotos el
2026-09-04 (6/9, desplegable de Cliente vacío) ahora entran solos: el modal de Nueva Cita ya
ofrece el alta inline del cliente, la cita quedó vista en `/appointments`
(`cmtrmgop9001501rwiwrmowq2`). El paso 8 (cobro) de este rubro aterriza en `/comercio/caja`, no
en `/billing` — es la misma pantalla compartida que dental (`t_2b03ea3d` ya está `done` en el
tablero, cerrada el 2026-09-06 05:11). Cero filas `zz-qa-` propias al cerrar (4 ajenas sin
tocar). Con esto van **cuatro de los cinco rubros vendidos** confirmados 9/9 (dental, estética,
importadora, servicios profesionales); comercio queda en 8/8 porque su rubro no promete agenda.

## Reverificado el 2026-09-07 16:09 La Paz — dental sigue 9/9

Corrida `--escribir` completa desde nodo-casa (VPS medido por SSH): **RECORRIDO COMPLETO en
Clínica dental, 9/9 pasos OK**, paso 8 incluido (`/billing/cmtrfvum5004101rwr9gmjm33`, factura
con el ítem visible, frenado sin marcar pagada). Cero filas `zz-qa-` propias al cerrar (4 ajenas
de otros carriles, sin tocar). Nada nuevo que reportar: el producto sostiene el camino completo.

## Reverificado el 2026-09-07 06:14 La Paz — dental vuelve a 9/9: el corte de abajo era el INSTRUMENTO, no el producto

`t_daa76d62` (tablero, dueño `chatbot-cola`): `scripts/recorrido_cliente.mjs:345` esperaba la
navegación con `waitForURL(/\/billing\/[^/]+$/)`, y `/billing/new` **ya cumple** ese patrón
(`new` matchea `[^/]+`) — el `waitForURL` resolvía al instante, sin esperar nada, y la línea
siguiente comparaba la URL de PARTIDA. El "ROTO" de abajo (04:13) no era un bug de `/billing`:
era la foto tomada con el POST todavía en vuelo (el botón en "Guardando", sin cartel de error).
Arreglado excluyendo la URL de origen del predicado de espera (línea 345-352). Corrida
`--escribir` completa hoy: **RECORRIDO COMPLETO en Clínica dental, 9/9 pasos OK**, paso 8
incluido (`/billing/cmtr31f2q002701rw5oa2gu1g`, factura con el ítem visible). Cero filas `zz-qa-`
propias al cerrar (4 ajenas de otros carriles, sin tocar). Tarea `t_daa76d62` cerrada.

## ROTO el 2026-09-07 04:13 La Paz — dental llega al paso 7/9, se corta en el cobro (FALSO — ver arriba)

Corrida `--escribir` completa: pasos 1-7 **OK** (alta, onboarding de 6 pantallas, paciente
cargado, cita agendada y VISTA en `/appointments`). El **paso 8 (cobro) sale ROTO**: en
`/billing/new` se carga un ítem manual y se aprieta "Crear Factura" — la factura SÍ entra a la
base (`invoices` id `cmtqq67wl000q01rwujm8y6lo`, folio `2026-0001`, Bs 10.00) pero la pantalla
se queda en `/billing/new` sin redirigir, y volviendo a `/billing` (Cobros) la lista sigue
diciendo "0 facturas / No hay facturas aún" — la factura recién creada no aparece ahí. El paso 9
(bandeja) sale OK con nota: el dato del paso 6 no figura en `/dashboard` porque ese panel no
lista pacientes, no es un fallo del panel.

Es el primer corte real desde que el bug de la barra del asistente (abajo) se arregló. Reportado
en el tablero `t_6359aa00`, prioridad 1, para el dueño de `onia-platform`, y anotado en
`hermes-content/docs/cola/plataforma-v1.md`. Capturas: `paso-08-cobro.png` (Cobros vacío antes),
`paso-08c-factura-creada.png` (formulario cargado, antes de crear). Cero filas `zz-qa-` propias
al cerrar (quedan 4 filas ajenas de otros carriles, sin tocar).

## Reverificado el 2026-09-06 19:12 La Paz — dental 9/9 de nuevo, el bug de la barra ya está arreglado

`t_6325e553` (la barra del asistente IA tapando el cierre de "Primeros pasos") está `done` desde
las 14:17. Corrida `--escribir` completa hoy: **RECORRIDO COMPLETO en Clínica dental, 9/9 pasos
OK**, incluido el paso 5 (elegir-rubro) y el 9 (bandeja) que estaban rotos en el corte de abajo.
De paso se cerró `t_b777fb4e`: el paso 7 ya usa el alta inline del modal de cita antes de acusar a
un rubro sano (líneas 1440-1478 de `scripts/recorrido_cliente.mjs`); esta corrida ni lo necesitó
porque el select ya traía al paciente del paso 6. Cero filas `zz-qa-` propias al cerrar.

## ROTO el 2026-09-06 10:34 La Paz — la barra del asistente IA tapa el cierre de "Primeros pasos" (ARREGLADO, ver arriba)

Dental vuelve a romperse después de cuatro corridas en verde: **paso 5 (elegir-rubro) y paso 9
(bandeja) salen rotos/no-medidos**, no por el onboarding en sí — la traza de 6 pantallas (pregunta
→ negocio → horarios → servicios → equipo → listo) completa bien y `/dashboard` SÍ se alcanza —
sino porque el modal "Primeros pasos" que se abre encima queda pegado en pantalla: sus dos
botones de cierre (`GuiaInicio.tsx:164` el ícono X, `:277` "Cerrar por ahora") están geométricamente
detrás de la barra flotante del asistente (`BarraAsistente.tsx`, `.ba-barra`/`.ba-velo`,
`globals.css:1315` z-index:50). `document.elementFromPoint()` en las coordenadas de cada botón
devuelve `BUTTON.ba-barra` y `DIV.ba-velo`, nunca el botón — un click real (con o sin `force`)
nunca le llega al `onClick={cerrar}`. Reproducido 3 veces con cuentas `zz-qa-` distintas.

El instrumento se arregló de paso (`despejar()` ahora también prueba `/Cerrar la guía/i` y
diagnostica QUÉ elemento recibe el click en vez de tragarse el error) — pero **el bug es del
producto**, no del script: reportado en el tablero `t_6325e553`, prioridad 1, para el dueño de
`onia-platform`. Capturas: `paso-05c-gate-levantado.png`, `paso-09-bandeja.png`. Cero filas
`zz-qa-` propias al cerrar (3 corridas seguidas).

## Reverificado el 2026-09-05 12:16 La Paz — dental sigue 9/9, cero filas propias al cerrar

Cuarta corrida seguida en verde: 9/9, cero agujeros. Único dato `zz-qa-` que sobrevive en la base
es la misma fila ajena de siempre (`appointments zz-qa-recall-demo-1`, agente Recall) —
`organizations` da 0. No hay nada nuevo que reportar: el camino de cliente sigue entero.

## El paso 8 factura de verdad — 2026-09-05 07:34 La Paz

El paso 8 ya no se conforma con ver `/billing` en "0 facturas · Cobrado Bs 0,00": ahora, con el
paciente `zz-qa-` del paso 6, entra a `/billing/new`, lo elige, carga un ítem manual
`zz-qa-...-item` (Bs 10) y **envía la factura**. Llega a `/billing/<id>` — la pantalla de cobro
real, con el ítem a la vista — y **ahí FRENA**: nunca la marca pagada, nunca escanea un QR.

Medido 3 veces seguidas en producción, dental, 9/9 completo cada vez:
`hermes-content/docs/recorrido/capturas/paso-08c-factura-creada.png`. La factura cuelga de la
organización (`invoices.organizationId onDelete: Cascade`, `prisma/schema.prisma:832`) y se borra
sola al borrar la organización `zz-qa-`; además ahora se IMPRIME antes de borrar, como toda fila
propia. 0 filas `zz-qa-` mías al cerrar las 3 corridas (queda la misma `zz-qa-recall-demo-1` ajena).

Detalle en `hermes-content/docs/cola/recorrido-cliente.md`, sección Cerrado.

## Reverificado el 2026-09-05 01:11 La Paz — dental sigue 9/9; `t_2b03ea3d` (servicios) sigue abierta

Corrida nueva en dental: 9 de 9, cero agujeros, cero filas `zz-qa-` propias al cerrar (queda la
misma fila ajena `zz-qa-recall-demo-1`, de otro carril). Confirmado además que **no falta ningún
rubro**: `RUBROS_ACTIVOS` (`onia-platform/lib/platform/rubros-activos.ts`) sólo ofrece los cinco
ya recorridos — ganadero y veterinaria están explícitamente fuera de venta, no son un hueco de
este carril. La tarea `t_2b03ea3d` (servicios profesionales no puede agendar) sigue `ready`, sin
tocar, en el tablero — es del carril `onia-cola`.

## Medido el 2026-09-04 16:11 La Paz — **los CINCO rubros recorridos; cuatro enteros y uno ROTO**

| Rubro | Resultado | Dónde está la prueba |
|---|---|---|
| Clínica dental | **9 de 9** | `capturas/` |
| Comercio / tienda | **8 de 8** (el paso 7 no le corresponde) | `capturas/comercio/` |
| Estética y spa | **9 de 9** | `capturas/estetica/` |
| **Servicios profesionales** | **6 de 9 — ROTO en el paso 7** | `capturas/servicios/` |
| Importadora / distribuidora | **9 de 9** (el paso 7 no le corresponde) | `capturas/importadora/` |

Los cinco con `--escribir` y **cero filas de este carril** en la base al cerrar.

### Importadora / distribuidora: entera, sin agujeros

Misma forma que comercio: la tarjeta de `/register` no promete agenda («Catálogo, cotizaciones
B2B y costeo de importación»), así que el paso 7 sale `no-aplica` y no cuenta como agujero.
Alta con confirmación de correo, onboarding en 6 pantallas, dato cargado y encontrado de vuelta
en el storefront `/comercio`, pantalla de cobro (`/comercio/fiados`) vista y frenada ahí a
propósito.

Un detalle sin gravedad, anotado para no perderlo: el dato cargado (`...-paciente`) queda visible
en el storefront pero **no aparece en los widgets de `/dashboard`** — no es un agujero del
recorrido (el dato SÍ persiste y SÍ se ve en su pantalla propia), pero si otro carril audita el
panel de importadora, esta es la pista.

> ⚠️ La única fila `zz-qa-` que queda en producción es **ajena** (`zz-qa-recall-demo-1`, fixture
> del agente Recall de otro carril). Aparece en `resumen.json` como `zzQaAjenas` y **no se toca**:
> el chequeo de cierre «`count(*) LIKE 'zz-qa-%'` = 0» hoy da **1** y eso NO es basura mía.

### Servicios profesionales: promete agendar y no puede agendar nunca

Es el hallazgo de la vuelta, y es de los caros: **la venta promete lo que el producto no entrega.**

- La tarjeta del rubro en `/register` promete, textual: **«Agenda, citas, cobros y contabilidad»**.
- El menú tiene *Citas* y *Agenda de hoy*, y la **primera** acción rápida del botón `+` es
  **«Nueva cita»**. El producto vende agendar como lo primero que hace ese rubro.
- El formulario de la cita exige **«Cliente \*»** y ese desplegable tiene **CERO opciones**.
  No es que no se eligió: **no hay nada para elegir.**
- Causa, leída en la fuente y no supuesta: `SERVICIOS_NAV_ITEMS` (`lib/platform/vertical-pack.ts`)
  **no tiene ninguna entrada de clientes**. Dental sí (`/patients` → «Pacientes»). En ese pack no
  existe la pantalla donde crear el cliente que la cita pide — aunque el vocabulario del rubro sí
  define `clientes` y el buscador de arriba dice **«Buscar clientes…»**.

Prueba: `capturas/servicios/paso-07c-cita-enviada.png` — el desplegable vacío con el globo de
validación del navegador, y todo el resto del formulario lleno. Reportado en el tablero como
`t_2b03ea3d` (prioridad 1) al carril `onia-cola`: **este carril mide, no toca el producto.**

### Dos falsos rojos MÍOS que se cazaron en el camino

Los dos son del instrumento, no del producto, y los dos habrían acusado a un producto sano:

1. **El paso 6 daba ROJO en servicios profesionales** («el menú no ofrece ninguna pantalla donde
   cargar un dato») porque mi mapa buscaba sólo *cliente*/*paciente*. Ese pack carga su dato en
   `/comercio`, que ahí se llama **«Servicios»** — igual que comercio lo carga en «Catálogo». El
   patrón de clientes quedó primero, así que el día que aparezca esa pantalla, gana ella.
2. **La evidencia de cada rubro apuntaba a las capturas de DENTAL.** La ruta del `resumen.json`
   estaba escrita a mano; las capturas se guardaban en la carpeta del rubro y se reportaban en la
   de dental, **donde vive un PNG con el mismo nombre**. Medido: **17 de 17** rutas de comercio y
   estética apuntaban al archivo equivocado, **y las 17 existían**. Un chequeo de «¿existe la
   captura?» daba verde sobre las 17. Este carril entrega una sola cosa —la prueba de dónde se
   rompe— y la estaba entregando de otro rubro.

Gates del instrumento: `scripts/recorrido_cliente.test.mjs` (6 casos, verificados en rojo
inyectando el defecto real antes de arreglarlo).

### Por qué comercio cierra en 8 y eso NO es un agujero

Una tienda no tiene citas: su menú ofrece Catálogo, Inventario y Caja, y está bien que sea así.
Hasta hoy el paso 7 salía `no-medido` y contaba como agujero, así que comercio daba **6 de 9** —
un rojo permanente contra un producto sano, y **2 de los 5 rubros que se venden quedaban
imposibilitados de completar el recorrido para siempre**.

El escape fácil («si no hay agenda, no aplica») era peor: el día que dental *pierda* su agenda,
saldría verde. Así que quién debe tener agenda no lo decide una tabla escrita a mano —se vence—,
lo decide **la promesa de venta del propio rubro**, leída de su tarjeta en `/register`:

| Tarjeta viva en `/register` | ¿Promete agenda? | Paso 7 |
|---|---|---|
| Clínica dental — «Pacientes, **citas**, tratamientos y cobros» | sí | obligatorio |
| Estética y spa — «**Agenda**, clientas, tratamientos y caja» | sí | obligatorio |
| Servicios profesionales — «**Agenda**, **citas**, cobros y contabilidad» | sí | obligatorio |
| Comercio / tienda — «Catálogo, inventario, caja y clientes» | no | `no-aplica` |
| Importadora — «Catálogo, cotizaciones B2B y costeo de importación» | no | `no-aplica` |

- promete y no está → **ROJO**, y del caro: la venta ofrece lo que el producto no entrega.
- no promete y no está → `no-aplica`, y se **nombra** en el veredicto (no desaparece).
- no promete y sí está → se mide igual: probar de más nunca miente.
- no se pudo leer la tarjeta → **se exige la agenda**. Este paso falla cerrado.

Estética es la prueba de que el gate no se rindió: promete «Agenda», la tiene, y la cita entró
(POST 201, id `cmtmt5zjv003j01rw6koicr3k`) y se vio en el calendario.

### 🔴 El prefijo `zz-qa-` dejó de ser de este carril

Apareció en producción la cita **`zz-qa-recall-demo-1`** («zz-qa- control anual (dato de prueba,
agente Recall)», creada 2026-09-04 08:37 UTC en la organización `ZZ QA Clinica Chatbot`): un dato
de prueba que **otro carril** sembró para su agente.

Mi limpieza borraba por `LIKE 'zz-qa-%'` a secas. **Zafó de casualidad**: el fixture ajeno puso el
texto en `reason` y yo borraba por `notes`. El día que uno use `notes`, un `DELETE FROM appointments
WHERE notes LIKE 'zz-qa-%'` se lo lleva puesto, sin aviso y sin forma de saber que existió.

Arreglado: el borrado va por la **forma** `zz-qa-AAAA-MM-DD-HHMM…`, que es la que llevan mis filas
—y cubre también a los huérfanos de una corrida mía que se haya caído a la mitad—. Lo que lleva el
prefijo y no tiene esa forma se **cuenta, se informa y jamás se toca** (`zzQaAjenas` en el resumen).

Verificado en vivo, no supuesto: corrida completa de dental → `0` filas mías y la fila ajena
**sigue existiendo** después de la limpieza.

⚠️ **Ojo con el chequeo de cierre `count(*) … LIKE 'zz-qa-%' = 0`**: hoy da 1 y eso **no es basura
sin limpiar**. Lo que hay que exigir en 0 es lo que tiene mi forma.

### La corrida de dental, en detalle

Cuenta `zz-qa-2026-09-04-0717@onia.com.bo` creada desde `onia.com.bo`, correo confirmado con el
enlace del mail, alta completa (rubro → negocio → horarios lun-vie 09-13 y 15-19 → equipo con el
rol **Profesional** → listo), paciente cargado y encontrado de vuelta en la lista, **cita agendada
el lunes 7-sep 09:00 (POST `/api/appointments` → 201, id `cmtmmj13d001601rwl6g31e42`) y VISTA en el
calendario**, pantalla de cobro a la vista y frenado ahí a propósito.

Prueba que se mira, no que se supone: `capturas/paso-07d-cita-en-agenda.png` — el bloque
`9:00 zz-qa-…` en el día 7 del calendario.

**Todo lo escrito se borró en la misma corrida.** Verificado por fuera del script, que no puede ser
juez de su propia limpieza: `appointments`, `organizations` y `auth.users` con `zz-qa-%` → **0, 0, 0**,
y la cita `cmtmmj13d001601rwl6g31e42` ya no existe.

### 🟠 Lo que este carril acusó y era MENTIRA: el paso 4 y el desplegable de profesional

Dos veredictos rojos de la vuelta anterior eran del instrumento, no del producto. Los dos acusaban
a pantallas que funcionan bien, y uno llegó al tablero con prioridad 1 (`t_2f5a96b6`, ya cerrada
con la prueba).

**1. «Rebotó en /login — sin mensaje visible».** La captura del mismo paso muestra un cartel rojo
enorme: *"Tu cuenta está creada, pero falta verificar tu correo. Revisá tu bandeja y volvé a
iniciar sesión."* Y la pantalla anterior ya lo había dicho entero: *"Verificá tu correo — Tu cuenta
ya fue creada."* **El producto avisa bien en las dos pantallas.** El ciego era el recorrido, y
fallaron sus dos sondas a la vez por motivos distintos:

- `page.on('response')` sobre `/token` **no puede ver nada**: el login de la app se resuelve en el
  **servidor** de Next. El `400 email_not_confirmed` de Supabase salió de `172.19.0.10`, una IP
  interna — esa respuesta nunca pasa por el navegador.
- el cartel no trae ninguna de las clases CSS que se buscaban (`[role=alert]`, `.text-red-500`…).

Y como el motivo llegaba vacío, el patrón `sinConfirmar` no matcheaba y el paso **ni intentó** la
confirmación por enlace que ya sabía hacer. Arreglado con una tercera sonda que no depende de
adivinar clases ni de que el error viaje por el navegador: *lo que apareció en pantalla después de
apretar y no estaba antes es lo que el producto te contestó*. Y el patrón ahora reconoce
`verificar`, no sólo `confirm`, que era la única forma en que el mensaje llegaba.

**2. «El desplegable de profesional está siempre vacío».** Hoy se llena y la cita entra. La
diferencia está en el alta: la versión que midió aquello llenaba la pantalla *"¿Quién más trabaja
con vos?"* escribiendo en todos los campos de texto, **sin elegir el rol**; la de `main` aprieta el
botón **Profesional** antes de terminar, y con el rol elegido `/api/team` crea los
`doctor_schedules` que llenan el desplegable.

⚠️ **Queda una pregunta abierta, y es legítima:** si el dueño aprieta *"Saltar por ahora"* en la
pantalla de equipo, **nadie comprobó** que pueda agendar después. La causa raíz que se describe
abajo —el alta guarda los horarios en `clinicSettings.oniaCoreOnboarding` y nunca escribe
`doctor_schedules`— puede seguir siendo cierta **para ese camino**. Es el próximo escalón del carril.

**La lección, que vale más que los dos arreglos:** esa causa raíz estaba *"verificada en el código"*,
con archivo y línea, y era una explicación plausible construida sobre una medición hecha con un
instrumento defectuoso. Más evidencia la hacía más convincente, no más cierta.

### ⚠️ El mismo carril corría en DOS árboles y el instrumento se bifurcó

`main` tenía `9e21a15e7` (carga horarios, elige el rol, mide el POST y **borra lo suyo** con
`limpiarProduccion`) y la rama tenía una versión paralela más pobre del mismo trabajo, con
`contarCitasQA` como única verificación y **sin borrado automático** — cada vuelta dejaba basura
`zz-qa-` en producción para que alguien la borrara a mano. Resuelto convergiendo con `main`:
verificar por `201`+id y volver a VER la cita en la agenda recargada es más fuerte que contar filas.

---

## Medido el 2026-09-04 01:24 UTC — rubro DENTAL, con el paso que faltaba: AGENDAR

> ⚠️ **Corregido el 2026-09-04 07:30, arriba.** Los dos rojos de esta sección eran del instrumento:
> el producto avisa que falta verificar el correo, y el desplegable de profesional se llena cuando
> el alta elige el rol. Se deja el texto porque la causa raíz que describe sigue abierta para el
> camino "Saltar por ahora", y porque muestra cómo se construye una acusación falsa bien documentada.

El recorrido nunca había enviado una cita. Por eso el carril no vio lo que sigue.

### 🔴 Un negocio nuevo no puede agendar NI UNA cita (paso 7, roto)

Cuenta creada hoy, alta completa **sin saltear nada** —horarios cargados y una persona cargada en
"¿Quién más trabaja con vos?"—. En `/appointments`, el modal **Agendar Cita** muestra
`Profesional *` con una sola opción vacía y el botón **apagado**: no hay forma de agendar, y la
pantalla no dice qué falta. Para el paciente ofrece "+ Nuevo paciente"; para el profesional, nada.

Captura: `capturas/paso-07b-cita-formulario.png` — el paciente elegido, el profesional vacío.

**Causa raíz, leída en el código y confirmada en la base:** el desplegable se llena desde
`/api/doctor-schedules` (`appointments/page.tsx:152-159`), o sea de la tabla `doctor_schedules`.
El alta guarda los horarios en el JSON `clinicSettings.oniaCoreOnboarding`
(`lib/onboarding/aplicar.ts:236`) y **nunca escribe en `doctor_schedules`**. En cambio `/api/team`
sí crea horarios al dar de alta a alguien (`api/team/route.ts:108-109`): el producto sabe hacerlo
por un camino y no lo hace por el otro. Medido en la org de prueba: `profiles` = 2 (ADMIN dueño +
DOCTOR cargado en el alta), `doctor_schedules` = **0** para los dos.

El producto promete esto DOS veces durante el alta —"La agenda no va a aceptar citas fuera de este
horario" y **"Con al menos una persona cargada ya podés agendar"**— y las dos son falsas hoy.
Reportado al dueño del producto: tarea **`t_2f5a96b6`**, prioridad 1.

### 🟠 Y el primer veredicto de ese paso fue una acusación FALSA mía

La primera corrida dijo *"el formulario no ofrece a quién citar"* **sobre un modal que listaba al
paciente**. La pantalla tiene **dos** `role=dialog` y `getByRole('dialog').first()` agarra el
**menú lateral** (0 selects), no el modal (3 selects). Medido con un diagnóstico aparte antes de
reportar nada; el diálogo ahora se elige por el botón que **envía**, igual que `acotarFormulario`.

**Es la tercera acusación falsa de este carril, y las tres tienen la misma forma:** el instrumento
mira el pedazo de pantalla equivocado y le echa la culpa al producto. Lo único que las frenó las
tres veces fue **abrir la captura antes de escribir el informe**.

### Lo que cambió en el instrumento

- **Paso 7 nuevo: agenda.** Elige paciente y profesional, prueba hasta 7 días buscando un horario
  libre (elegir uno solo y encontrarlo cerrado reportaría "no se puede agendar" sobre un producto
  sano), escribe la marca `zz-qa-` en las notas y envía. Verifica **doble**: cuenta la fila en
  `appointments` *y* vuelve a la agenda a buscarla en pantalla. Una sola de las dos ya mintió antes
  (el bot decía "Listo, agendado" con la reserva en NULL).
- **El alta ya no saltea horarios ni equipo.** Los salteaba "como alguien apurado", y ese salto era
  justo el que dejaba sin medir la agenda. Si el producto no deja avanzar, saltea y lo dice en la traza.
- **El cobro pasó al paso 8**, junto con el panel: los dos últimos son miradas, ninguno envía nada.
- **Estado `no-aplica`**, para el rubro que no vende agenda (comercio, importadora): no cuenta como
  agujero, pero se imprime siempre con el menú con el que se dedujo, para poder discutirlo.

**Producción:** 9 filas `zz-qa-` de las dos corridas impresas antes de borrar y borradas por
prefijo en una transacción. Recuento posterior: **0**. Lo real intacto (5 orgs · 2 pacientes ·
3 solicitudes).

---

## Medido el 2026-09-03 19:14 UTC — rubros ESTÉTICA e IMPORTADORA

### 🟢 Estética y spa: los 8 pasos, tercer rubro entero

    RECORRIDO_RUBRO='Estética y spa' node scripts/recorrido_cliente.mjs --escribir

Sin una sola sorpresa. El vocabulario del rubro está bien puesto de punta a punta: el menú dice
**Clientas**, el buscador "Buscar clientas…", el botón "Clienta" y el pie del panel
"1 clienta(s) nuevas este mes". El dato se cargó en Clientas (`/patients`), se encontró de vuelta
en la lista, y el panel **contó la clienta nueva**: `paso-06-menu.png` decía "0 clienta(s) nuevas
este mes" y `paso-08-bandeja.png`, después del alta, dice "1". La pantalla de cobro es
**Facturación** (`/billing`) y se vio entera.

### 🔴 Importadora: el recorrido cantó COMPLETO sobre un paso que nunca midió

    RECORRIDO_RUBRO='Importadora / distribuidora' node scripts/recorrido_cliente.mjs --escribir

Los pasos 1-6 y el 8 salieron verdes; **el 7 salió `no-medido`** —"pedí `/billing` y terminé en
`/dashboard`"— y aun así el script imprimió **"RECORRIDO COMPLETO: los 8 pasos"**, con
`corte: null` en el `resumen.json`. **Ese fue el hallazgo de la vuelta, y era del instrumento, no
del producto.**

La causa: el veredicto miraba `ultimoOk`, que guarda el **último** paso verde y no hasta dónde se
llegó de corrida. Con el 7 en agujero y el 8 en verde valía 8, la comparación contra los 8 pasos
daba verdadero, y `corte` salía null porque busca un fallo con `n > ultimoOk` y no hay paso
después del 8. **El agujero desaparecía hasta del JSON.** Es la misma familia de falso verde que
este script ya tuvo en los pasos 5-8, con otra forma: antes por confiar en un 200, ahora por
confiar en el último verde.

Arreglado (`17aaec727`). Rojo antes, con los datos reales de esa corrida: `RECORRIDO COMPLETO:
los 8 pasos`. Verde después: `LLEGÓ HASTA EL PASO 6 de 8 de corrida` + `AGUJERO en el paso 7`.
Ahora "completo" exige que **no haya ni un paso fuera de OK**, y el agujero **tapado por un verde
posterior** —el único que el veredicto viejo borraba— se enumera aparte.

### Y el paso 7 de importadora tampoco era culpa del producto

Antes de acusar al producto miré su código: **el pack de importadora no trae Caja ni Facturación
a propósito** (`onia-platform/lib/platform/vertical-pack.ts:155-156`). Ese rubro cobra por
**Créditos** (`/comercio/fiados`) y **Cotizaciones** (`/importadora/cotizaciones`) — se ve en
`capturas/paso-07-cobro.png`, que muestra el menú completo sin Facturación por ningún lado.

El patrón que busca la pantalla de cobro en el menú (`caja|cobro|facturación|billing|pagos`) no
conocía esos nombres, se cayó al `/billing` de dental y el producto redirigió al panel. Corregido
en el mismo carril: ahora busca en tres tandas, en el orden en que un rubro cobra —donde entra la
plata (caja, facturación, créditos/fiados) y recién después el paso previo (cotizaciones)—.
Verificado contra los cuatro menús reales: importadora→Créditos, comercio→Caja,
dental→Facturación, estética→Facturación.

**Falta volver a correr importadora** para medir su paso 7 de verdad. Queda en la cola.

---

## Medido el 2026-09-03 16:14 UTC — rubro COMERCIO

### 🟢 Los 8 pasos, y por primera vez en un rubro que no es dental

    RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 2.150 ms, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones; el camino es "Creá tu cuenta", **2 clics** |
| 3 | Registrarse con datos `zz-qa-` | ✔ OK | cuenta creada; el alta pide confirmar el correo antes del primer login |
| 4 | Entrar a la plataforma | ✔ OK | entró tras abrir el enlace de confirmación, como el cliente con el mail |
| 5 | Elegir rubro y terminar el onboarding | ✔ OK | 6 pantallas del asistente; `/dashboard` dejó de rebotar |
| 6 | Cargar un dato del rubro | ✔ OK | creó el producto `zz-qa-…-paciente` en **Catálogo** (`/comercio`) y lo encontró de vuelta en la lista |
| 7 | Pantalla de cobro (mirar y FRENAR) | ✔ OK | la pantalla de cobro de comercio se llama **Caja** (`/comercio/caja`); **frenado ahí a propósito** |
| 8 | Abrir la bandeja / el panel | ✔ OK | el producto **sí figura** en el panel, en *Stock crítico* |

**Un comercio recorre el producto entero igual que una clínica.** Las capturas de los 8 pasos se
miraron una por una: `paso-06c` muestra "1 producto(s) en el catálogo" con la fila cargada, y
`paso-08` lo muestra otra vez en el panel. Nada del producto se rompió en esta vuelta.

Dos diferencias reales entre rubros, que el recorrido antes no podía ver porque navegaba a rutas
fijas de dental: la pantalla del dato es **Catálogo (`/comercio`)** y no `/patients`, y la de
cobro es **Caja (`/comercio/caja`)** y no `/billing`. Pedir `/billing` con una cuenta de comercio
rebota — y eso se leía como "el producto no tiene pantalla de cobro" cuando la tiene, con otro
nombre. Ahora las dos se **descubren del menú** que el producto le muestra a ese rubro.

⚠️ **Lo que el paso 6 NO prueba en comercio:** carga el nombre del producto y nada más. Precio y
stock quedan vacíos (se ven como `—` y `0 unidad` en la captura) porque el instrumento no
inventa cifras. Que el producto guarde un precio **no está medido**.

### 🔴 El falso ROJO que se arregló esta vuelta: el instrumento cerraba el formulario que abría

La vuelta anterior dejó el paso 6 en rojo con este texto:

    el formulario de alta de "storefront Catálogo" no tiene botón de guardar

**Era mentira, y la culpa era del instrumento.** Medido en vivo entrando con una cuenta ya
creada: al apretar «Nuevo producto» el modal abre bien, con sus campos y con el botón
**«Guardar producto»** — está en `capturas/evidencia-06-modal-comercio-abierto.png`. Lo que pasaba
después es que el paso llamaba a `despejar(page)`, que aprieta los botones **«Cerrar por ahora»** y
**«Cerrar»** para sacarse de encima el tour de bienvenida… y el botón de cancelar de ese modal se
llama **exactamente «Cerrar»**. El instrumento cerraba el formulario que acababa de abrir.

Y entonces venía la segunda mitad del daño: con el modal cerrado, el relleno buscaba "el primer
campo de texto de la página" y encontraba el **buscador** de la lista (`Buscar productos…`).
Escribía el `zz-qa-…` ahí —se veía en la captura, arriba, en la lupa— y el alta se enviaba vacía.

En dental nunca se notó: ahí el alta es una **página** (`/patients/new`), no un modal, así que no
había ningún «Cerrar» que apretar. **Un instrumento afinado a un solo rubro acusa al producto en
todos los demás.**

Tres arreglos, y el orden importa:

1. **Se quitó el `despejar()` de adentro del paso 6.** No hace falta: el tour ya lo sacó
   `llegar()` en esa misma pantalla, y apretar un botón no puede invocarlo de nuevo.
2. **El formulario se ACOTA antes de llenarlo** (`acotarFormulario`), y la raíz se deduce del
   **botón de guardar hacia arriba** — no de `role=dialog`, que este modal no declara, ni de una
   clase CSS. Es la única definición que sirve en los 7 rubros: el formulario es lo que rodea al
   botón que lo envía. Fuera de esa raíz no se escribe una letra.
3. **Nunca se llena un buscador** (`buscar|search|filtrar` o `type=search`), aunque sea el primer
   campo de texto que aparezca.

Y el paso ahora distingue dos fallos que antes se reportaban con el mismo texto: *"apreté el
camino de alta y no apareció ningún formulario"* (con la lista de botones a la vista) es distinto
de *"el formulario no tiene botón de guardar"*. El primero acusa al camino; el segundo al
formulario.

> **La lección, que vale para cualquier carril que maneje un navegador:** una rutina que cierra
> overlays por el TEXTO del botón acabará cerrando algo que hacía falta. `despejar` se escribió
> para un tour y terminó apretando el cancelar de un alta. Un cierre a ciegas es una acción
> destructiva con cara de higiene.

### Lo que se escribió en producción esta vuelta, y cómo quedó

Se borraron **tres** cuentas, no una: además de la de esta corrida quedaban **dos de la vuelta
anterior**, que murió por tiempo antes de limpiar (`zz-qa-2026-09-03-1317` y `-1320`). Impresas
antes de tocarlas, borradas en una transacción **por prefijo `zz-qa-`**, nunca por fecha ni por
rango:

```
auth.users                        3   zz-qa-2026-09-03-{1317,1320,1614}@onia.com.bo
auth.identities                   3
profiles                          3
organizations                     3   zz-qa-2026-09-03-{1317,1320,1614}
organization_entitlements         3   module.agents
onia_commerce_products            1   zz-qa-2026-09-03-1614-paciente
onia_commerce_product_variants    1
```

Recuento posterior: **0 filas `zz-qa-`** en las cinco tablas. Lo real intacto: **4
organizaciones · 6 perfiles · 1 paciente · 3 productos · 3 solicitudes**. Los 6 perfiles que
quedan son todos del 16 al 31 de agosto — ninguno de hoy, o sea que no quedó basura anónima.

⚠️ **Las columnas de estas tablas son camelCase de Prisma y van entre comillas dobles**:
`"organizationId"`, `"productId"`, `"featureKey"`. Un `WHERE organization_id = …` no falla en
silencio —da `ERROR: column does not exist`—, pero dentro de un heredoc largo ese error pasa
desapercibido y el borrado queda a medias.

---

## Vuelta anterior — 2026-09-03 10:18 UTC, rubro dental

### 🟢 Los 8 pasos — y esa vez el paso 3 PODÍA salir rojo

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 1.476 ms, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones; el camino es "Creá tu cuenta", **2 clics** |
| 3 | Registrarse con datos `zz-qa-` | ✔ OK | cuenta creada; **el alta pide confirmar el correo antes del primer login** |
| 4 | Entrar a la plataforma | ✔ OK | entró tras abrir el enlace de confirmación, como el cliente con el mail |
| 5 | Elegir rubro y terminar el onboarding | ✔ OK | 6 pantallas del asistente; `/dashboard` dejó de rebotar |
| 6 | Cargar un dato del rubro | ✔ OK | creó `zz-qa-2026-09-03-1018-paciente` y lo encontró de vuelta en `/patients` |
| 7 | Pantalla de cobro (mirar y FRENAR) | ✔ OK | `/billing` a la vista; **frenado ahí a propósito** |
| 8 | Abrir la bandeja / el panel | ✔ OK | `/dashboard` abrió; el paciente no figura ahí — el panel no lista pacientes |

**El recorrido se completó entero, y ahora eso significa algo.** Hasta esta vuelta el paso 3 no
podía salir rojo bajo ninguna circunstancia (abajo el detalle), así que "8 de 8" incluía un paso
que nunca se midió. Este es el primer recorrido completo con los ocho pasos capaces de fallar.

### Lo que el alta hace de verdad, medido en vivo

`ONIA_ALTA_AUTOMATICA=abierta`. `/register` crea la cuenta, pero **no deja entrar sola**:
`GOTRUE_MAILER_AUTOCONFIRM=false`, así que el primer login rebota con `email_not_confirmed`
hasta que el cliente hace clic en el enlace del correo. Verificado que ese correo **sale y lo
aceptan**: `postfix/smtp: to=<zz-qa-…@onia.com.bo>, relay=route2.mx.cloudflare.net, status=sent
(250 2.0.0 Ok)`. El enlace también funciona: con `token=` el endpoint procesa y redirige.

Eso significa que **el camino del cliente pasa por su casilla de correo**. No es un fallo, pero
es el único tramo que el producto no controla — y hasta hoy el recorrido lo confundía con un
login roto.

---

## Lo que se arregló esta vuelta: el paso 3 no podía fallar

Tarea del tablero `t_bffb91fb`, encontrada por el supervisor abriendo la captura.

El estado del paso 3 era `estado: crearCuenta ? 'ok' : 'no-medido'`: dependía de si el
formulario **era** de crear cuenta, nunca de si el envío **funcionó**. No existía forma de que
saliera rojo. Y su único detalle era la URL —que en este alta no se mueve ni al salir bien ni al
salir mal—, con lo que el reporte decía literalmente *"la URL pasó de /register a /register"* y
lo llamaba éxito.

**Reproducido en vivo a las 10:10 UTC** con el script viejo: paso 3 **OK**, paso 4 roto, cuenta
inservible. El verde tapaba el corte y se lo colgaba al login.

Ahora el paso 3 **mira la pantalla**, como ya hacía el paso 4: texto de éxito → OK; error
visible → roto; ni una cosa ni la otra → roto (el fallo mudo, que es el más caro). Probado en
rojo antes de darlo por bueno: con el correo ya registrado devolvió
`ROTO — envié el alta y la pantalla no dijo nada`.

### Tres trampas medidas, que valen más que el arreglo

1. **El correo `zz-qa-<fecha>` hacía chocar las corridas del mismo día.** Ahora lleva la hora
   (`zz-qa-<fecha>-<hhmm>`). Sin eso, la segunda corrida del día se registra con un correo que
   ya existe — y ahí aparece la trampa siguiente.
2. **Registrarse con un correo ya existente no muestra NADA.** El API devuelve **200** y reenvía
   la confirmación; la pantalla no muestra ni éxito ni error, y el cliente queda mirando el
   formulario lleno. Después el login rebota con `Invalid login credentials` y la cuenta ya no
   está en `auth.users`. **Es un hallazgo del producto, no del instrumento** — anotado en la cola
   de la plataforma.
3. **`token_hash=` no es `token=`.** El enlace de confirmación con `token_hash` contesta
   `400 "Verify requires a token or a token hash"`, que se lee exactamente igual que un proxy
   comiéndose la query — y estuvo a un paso de reportarse como "ningún cliente puede confirmar su
   cuenta". Con `token=` funciona. Se descartó con `curl` contra el endpoint real **antes** de
   escribir una línea del hallazgo.

---

## Vueltas anteriores: dos pasos dejaron de ser verdes y vacíos

Ayer el recorrido llegó entero por primera vez, pero **tres pasos daban OK sin haber probado
nada**. Al mirar las capturas aparecía el motivo, y no era del producto: era del instrumento.

### 1. Los pasos 6, 7 y 8 fotografiaban un modal, no el producto

`paso-06` y `paso-07` mostraban el modal **"Primeros pasos"** —`fixed inset-0 z-[60]`, 1440×900,
el **100 % del viewport**— cubriendo toda la pantalla. El script las declaraba OK igual, porque
`llegar()` comparaba la URL y ahí se detenía. Estar en `/billing` y no ver un píxel de `/billing`
pasaba por éxito.

Es el mismo pecado del falso verde anterior, una capa más arriba: antes no se miraba **dónde** se
estaba; ahora no se miraba **si se ve algo**.

Dos funciones nuevas, y la distinción entre ellas es el punto:

- **`despejar(page)`** aprieta el botón que ofrece el propio producto (**"Cerrar por ahora"**).
  No borra el nodo por JS: esconder un overlay con `display:none` probaría que sé usar JS, no que
  el cliente pueda salir de ahí.
- **`queTapa(page)`** cuenta lo que quede cubriendo ≥50 % del viewport. Sólo `fixed`: los
  `sticky` (cabecera, menú lateral) son parte del producto y no tapan nada.

Y `llegar()` ahora exige las dos cosas: `llego = (URL correcta) && !tapa`. Una pantalla que no se
ve **no cuenta como visitada**.

**El modal NO es un bug del producto** — `GuiaInicio.tsx:69` lo abre una vez por usuario y al
cerrarlo queda cerrado (`localStorage`). Lo ve siempre este script porque arranca con un contexto
de navegador limpio en cada corrida. Se verificó **antes** de reportarlo.

### 2. El paso 6 se llamaba "cargar un dato" y sólo abría la pantalla

Nunca creó nada. Y como no había dato, el paso 8 —*"¿aparece el dato del paso 6?"*— tampoco
comprobaba nada: abría el panel y reportaba OK. **Dos pasos de ocho, verdes sobre el vacío.**

Ahora el paso 6 carga un paciente de verdad y **la verificación no es haber apretado "Guardar"**:
vuelve a `/patients` y **lo busca en la lista**. Un formulario que se vacía y no dice nada se
parece muchísimo a uno que guardó.

Detalles que costaron un sondeo en vivo y que no se adivinan:

- El alta de paciente es una **página** (`<a href="/patients/new">`), no un modal. Se navega por
  el enlace que ofrece la pantalla, no por `goto` a la URL: si el producto mueve el botón, el que
  tiene que fallar es este paso, y un `goto` siempre acierta.
- **Los campos no tienen `name` ni `id`: sólo `placeholder`.** El único obligatorio es el nombre
  (`placeholder="Ej: Juan Carlos Mamani"`). Un relleno que busque por `name` no llena nada y
  envía el formulario vacío. Es la misma trampa que ya tenía `/register`.
- El botón es `save Guardar Paciente` (`type=submit`).

### 3. El aviso de limpieza enumeraba de menos

Decía sólo el correo. Desde que el paso 6 crea un paciente, un aviso que nombra sólo la cuenta
deja **basura anónima** en producción — y basura anónima ya no se puede borrar, porque no hay
cómo distinguirla de un dato real. Ahora lista cuenta · organización · paciente.

## El paso 8 dice algo que antes no podía decir

`/dashboard` **no muestra** el paciente. Eso **no es un fallo** y así se reporta: el panel no
lista pacientes, muestra otra cosa. El dato quedó guardado y visible en su propia lista, que es
lo que había que probar. Se distingue a propósito de un fallo real: si el paciente no apareciera
**en ninguna** de las dos, el paso 6 corta en rojo con "el producto no lo guardó, o no lo muestra".

## Lo que se escribió en producción, y cómo quedó

Estado antes: **4 organizaciones, 6 perfiles, 3 solicitudes reales, 0 filas `zz-qa-`**.
Seis filas creadas, impresas antes de tocarlas:

```
auth.users                 0de546e6-8912-44dd-95d0-ea9f8e022f19  zz-qa-2026-09-03@onia.com.bo
auth.identities            e193ed34-682d-4af2-a8b2-de8cb6ed9250  email
profiles                   cmtl6qkyd000e01khpbtj34y7             zz-qa-2026-09-03@onia.com.bo
organizations              cmtl6qky2000d01khy09fvmps             zz-qa-2026-09-03-negocio
organization_entitlements  cmtl6qkzy000g01kh497vu4m7             module.agents
patients                   cmtl70gds000l01khqp4cwigk             zz-qa-2026-09-03-paciente
```

Borradas **por id exacto**, en una transacción: `DELETE 1` seis veces, `COMMIT`. Recuento
posterior: **0 filas `zz-qa-`** en las cuatro tablas; **4 orgs / 6 perfiles / 3 solicitudes
reales** intactas. Nada quedó sin limpiar.

⚠️ El recuento dejó a la vista **1 paciente que NO es `zz-qa-`**: es preexistente y de otra
organización. **No se toca** — la regla es no tocar jamás una fila sin el prefijo.

El correo se confirmó a mano sobre **la fila `zz-qa-` y sólo esa**
(`update auth.users set email_confirmed_at=now() where email like 'zz-qa-%'` → `UPDATE 1`).
Queda dicho porque es un **salteo deliberado del instrumento**, no algo que haga un cliente: el
doble opt-in funciona y sin confirmar no se entra.

## Cómo se corre entero

**Una sola corrida**, y el rubro se elige por variable de entorno:

    node scripts/recorrido_cliente.mjs --escribir                          # dental (por defecto)
    RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir

⚠️ **Acá decía que hacían falta DOS corridas** con un `update auth.users set email_confirmed_at`
en el medio. Ya no: el script abre **el mismo enlace de confirmación que se le manda al cliente**
(`confirmarComoElCliente`), que es lo que hace un cliente de verdad. Tocar `email_confirmed_at` a
mano sería fingir el paso que se está midiendo — y dejaría el doble opt-in sin medir nunca.

Y después **se borra en la misma vuelta**, por prefijo `zz-qa-` y contando lo que se borró:

    docker exec -i supabase-db psql -U postgres -d postgres   # ver el bloque de limpieza de arriba

⚠️ `docker exec` **va con `-i`**: sin él el heredoc no llega a psql, no borra nada y **sale sin
error**. Contar las filas después de borrar no es opcional.

⚠️ **La limpieza tiene que cubrir el rubro que se corrió.** El paso 6 crea un paciente en dental
pero un **producto + su variante** en comercio (`onia_commerce_products`,
`onia_commerce_product_variants`). Un borrado escrito para dental deja el producto vivo.

## Trampas del instrumento que siguen vigentes

1. **Los nombres de iconos en el texto NO son el bug del login.** El DOM de `/register` devuelve
   `dentistry`, `credit_card_off` como texto. Es una fuente de ligaduras: en la captura se ven
   los dibujos. El DOM sirve para sospechar; sólo la imagen confirma.
2. **El único campo con `name` es el honeypot** (`sitioWeb`). Los campos reales sólo tienen
   `placeholder` — en `/register` **y** en `/patients/new`.
3. **La segunda corrida vuelve a intentar el alta** con el mismo correo y el paso 3 dice OK
   igual (sólo mira que el formulario pida contraseña). Es ruido conocido, no un hallazgo.

## Estado del instrumento

`scripts/recorrido_cliente.mjs`. Lo que ya sabe hacer:

- **Despeja lo que tape la pantalla y falla si no puede.** Una pantalla cubierta no cuenta como
  visitada.
- **Carga un dato de verdad** en el paso 6 y lo busca de vuelta en la lista.
- **Completa el onboarding** y lo verifica por el efecto, no por los clics.
- **Exige llegar a donde pidió** (`llegar()`): un redirect no puede pasar por éxito.
- **Entra con la cuenta que acaba de crear**, no con una llave aparte.
- **Lee el motivo del rebote en la pantalla** cuando el login falla.
- **El corte es el paso que frenó el avance**, no el primero que no dio OK.
- **Enumera todo lo que creó** al terminar, para que la limpieza no deje nada anónimo.
- Captura con **scroll real** y con el **Chromium completo** (`channel: 'chromium'`), no el
  `headless_shell` que le inventó texto roto al canario durante tres días.
- Sale con código 0 aunque el recorrido se corte: "se corta en el paso 5" es el **reporte**.

**Lo que le falta, y es lo próximo:** correr el mismo recorrido con **otro rubro** (el alta
ofrece cinco; el script ya acepta `RECORRIDO_RUBRO="Comercio / tienda"`, pero nunca se probó — un
rubro encendido que rompe el onboarding es exactamente el fallo que nadie ve).

## Cobertura por rubro (2026-09-10/11)

El alta ofrece **cinco** rubros hoy (medido en vivo, no de memoria — probar "Veterinaria" da paso
3 ROTO con la lista real: Clínica dental · Comercio / tienda · Importadora / distribuidora ·
Estética y spa · Servicios profesionales. Veterinaria existe como pack en el código pero no está
encendida en el alta — eso es alcance de v1.0, no un bug).

Los cinco están corridos con el instrumento de 9 pasos, todos `completo: true` con 0 filas
`zz-qa-` al cerrar:

- **Importadora / distribuidora** — 2026-09-11: los 8 pasos que le corresponden. El paso 7 sale
  `NO-APLICA` de forma coherente (su propia tarjeta de venta dice "Catálogo, cotizaciones B2B y
  costeo de importación", sin agenda, y el menú no la tiene). El dato del paso 6 se cargó en
  Catálogo y no aparece en `/dashboard` — correcto, el panel no lista storefront.
- Dental, Comercio, Estética, Servicios profesionales — corridos en vueltas anteriores, ver más
  arriba y en la cola.

**Los cinco rubros activos ya están cubiertos con este instrumento.** Repetir uno más no suma
cobertura nueva — la próxima vuelta que llegue acá con el objetivo en meta debe ir directo al
escalón 3 (promesa vs. entrega en la home / otras superficies), no repetir dental otra vez.

## Reverificado 2026-09-12 23:10 La Paz — Estética y spa, 9/9 completo

`RECORRIDO_RUBRO='Estética y spa' node scripts/recorrido_cliente.mjs --escribir`: los 9 pasos
OK, `completo: true`, 0 filas `zz-qa-` al cerrar (cuenta, org, paciente, cita 2026-09-14 09:00
vista en `/appointments`, factura con ítem visible en `/billing/<id>`, frenada sin pagar). No
suma cobertura nueva (ya estaba cubierto) — confirma que sigue sano. Próxima vuelta: no repetir
un rubro, ir directo al escalón 3 (promesa vs. entrega en la home / otras superficies), como ya
quedó anotado antes.

## Verificado 2026-09-11 03:13 La Paz — promesa "14 días gratis, sin tarjeta" (home)

`(sitio)/page.tsx` promete `PRUEBA.dias` días gratis sin tarjeta; `PRUEBA_DIAS = 14` en
`src/lib/pricing.ts` y `TRIAL_DAYS = 14` en `onia-platform/lib/subscription/plan-state.ts`
coinciden. Confirmado contra la base real (no solo el código): `trialEnd - createdAt` da
exactamente 14 días en las dos orgs vivas con trial (`clinica-sergio-p2ljs`,
`bolivian-electricidad-e6t21`). Y el alta de esta misma vuelta no pidió tarjeta en ningún
paso. La promesa se cumple. Sin hallazgo.

## Verificado 2026-09-11 12:13 La Paz — `/guia-facturacion` (formulario fuera de los 9 pasos)

Submit real (`POST /api/agenda-intake` con correo `zz-qa-`) da **204**: el lead SÍ quedó
registrado en `onia_center.leads` — la promesa en pantalla ("tu contacto quedó con nosotros")
es verdadera. Fila borrada al cerrar (`id 72342f4f`, filtrada por `zz-qa-` en `raw`).

**Hallazgo aparte, reportado en el tablero (`t_62aa450c`, prioridad 2, para el dueño de
`web-factory/apps/site`):** el intake (`api/onia-center/leads/intake/route.ts:98-99`) marca
TODO lead con `nextAction: "Confirmar demo"` y `meetingStatus: "solicitada"`, sin mirar el
`src`. `/guia-facturacion` nunca ofrece una demo — pide un correo por una hoja imprimible.
El endpoint se escribió para el `agenda-form` (que sí pide una reunión) y quedó compartido
tal cual: el pipeline de Sergio Urcullo mezcla gente que pidió una demo con gente que sólo
quiso el PDF, las dos con la misma etiqueta "Confirmar demo".

## Reverificado 2026-09-13 14:10 La Paz — dental, 9/9 completo (con limpieza de una org huérfana)

`node scripts/recorrido_cliente.mjs --escribir` (sin `RECORRIDO_RUBRO`, default dental): los 9
pasos OK, `completo: true`, 0 filas `zz-qa-` al cerrar. Antes de correrlo, el chequeo de arranque
encontró **1 organización `zz-qa-` huérfana** (`zz-qa-2026-09-13-1309-negocio`, de una corrida
anterior que murió a mitad de camino — mismo patrón ya documentado el 2026-09-13 más arriba en
esta memoria compartida): tenía `profiles`, `organization_entitlements` y 1 `patient`, cero
`appointments`. Se imprimió cada fila y se borró (`organizations`, `profiles`,
`organization_entitlements`, `patients`, `auth.identities`, `auth.users`) antes de correr el
recorrido nuevo. Conteo final: `0` orgs `zz-qa-`.

## Verificado 2026-09-13 14:20 La Paz — `/precios` con `reducedMotion:'reduce'`

Cargada la pantalla servida (`onia.com.bo/precios`) con Chromium y `reducedMotion:'reduce'`
(para no leer un `<CountUp>` a mitad de animar, trampa ya conocida de este carril). Todos los
montos en pantalla coinciden con la fuente: planes Básico 320/89/3.200, Crece 550/145/5.500,
Pro 890/229/8.900, Full 1.290/12.900 y Grupo 2.900/mes — contra `DEFAULT_PLAN_AMOUNTS` de
`onia-platform/lib/subscription-plans.ts`. Add-on chatbot Bs 390/mes · Bs 3.900/año contra
`WHATSAPP_ADDON` de `onia-platform/lib/pricing.ts`. Reservas online Bs 150/mes y usuario
adicional Bs 70/mes también coinciden.

**Hallazgo, reportado en el tablero (`t_5ad92d30`, prioridad 2, para el dueño del sitio):** la
tarjeta del add-on "Reservas online" en la sección "LO DEMÁS QUE SE SUMA" dice *"Incluida en
Pro y Full"*, omitiendo que también viene incluida en **Crece** — mientras la tarjeta del plan
Crece, más arriba en la MISMA página, sí dice "Reservas online incluidas, si trabajás con
citas", y el catálogo (`plan-catalogo.ts`) tiene `publicBookingIncluded=true` desde `crece`. La
copy vive en `web-factory/apps/onia-platform/src/lib/pricing.ts` (`ADDONS`, ítem "Reservas
online", campo `copy`), y el propio comentario del archivo (líneas 34-35) ya documenta el dato
correcto ("publicBookingIncluded desde crece") — la copy de venta no lo lee. Un prospecto que
entra directo a esa sección (o no llega a leer la tarjeta de Crece) puede creer que tiene que
pagar Bs 150/mes de más en un plan que ya lo incluye.

## Confirmado 2026-09-17 13:09-13:16 La Paz — dental, 4/9, corte NUEVO en paso 5

`node scripts/recorrido_cliente.mjs --escribir` (default dental). Llegó hasta el paso 4/9:
cuenta creada, correo confirmado, onboarding recorrido entero (negocio → horarios → servicios →
equipo → "listo"). El asistente dice haber terminado, pero `/dashboard` sigue rebotando a
`/profile` — igual que `/patients` y `/billing`. Pasos 6-9 quedan `no-medido`. 0 filas `zz-qa-`
al cerrar (impreso y borrado en la misma corrida: cuenta `zz-qa-2026-09-17-1309@onia.com.bo`,
org `zz-qa-2026-09-17-1309-negocio`).

**No es un hallazgo nuevo — es la misma causa que ya está reportada y bloqueada esperando el
`ok` de Sergio Urcullo:** `MFA_ENFORCE_FROM` (`onia-platform/lib/mfa/policy.ts`) es una fecha
fija (`2026-09-17T04:00:00Z`) que hoy ya pasó, así que la gracia de 2FA se agotó para TODO
cliente nuevo — no sólo para los admins que ya existían. El arreglo (`b1247fb`, cuelga el plazo
del alta de cada cliente) está en `origin/master` pero **no en el build vivo**: verificado con
`git merge-base --is-ancestor b1247fb f078373` (build servido) → `NOT MERGED`, y confirmado en
el árbol de fuentes del build vivo (`/opt/onia-platform/build-f078373/lib/mfa/policy.ts:14`)
que todavía dice la fecha vencida. Ya está en la tarea de deploy `t_89a137f1` (prioridad
máxima de esa lista, bloqueada por plata/precio — comparte gate con `lib/subscription-plans.ts`
— esperando el `ok` de Sergio Urcullo). No se abre tarea nueva ni se repite la alarma: cuando esa
tarea se apruebe y publique, este recorrido va a pasar el paso 5 solo.

**Método para la próxima vuelta:** no re-correr el recorrido completo hasta que cambie el
`BUILD_ID` de producción (`docker exec onia-platform cat /app/.next/BUILD_ID`, hoy
`OFd4xCDzoTbQdThUbfzDv`) o hasta que `t_89a137f1` salga de `blocked`. Mientras tanto, usar la
vuelta para otra superficie que no dependa de ese deploy (ya descartado hoy: `/contact` no tiene
tarjetas de plan tipeadas — la mención vieja de esta cola ya no aplica, sólo hay meta tags).

## 2026-09-17 14:12-14:26 La Paz — nueva sonda: ¿la pantalla de MFA obligatorio tiene SALIDA?

El corte de arriba (`t_1a5c860d`, reemplaza a `t_89a137f1`, sigue `blocked` — `BUILD_ID` sin
cambios) ya venía reportado 4 vueltas seguidas. Esta vuelta no lo repitió: agregó al script una
sonda nueva que faltaba — cuando `/dashboard` rebota a `/profile?mfa=obligatorio`, ¿el botón
"Activar" ofrece una salida real, o es un callejón?

**Hallazgo, reportado en el tablero (`t_faa550af`, prioridad 1, para el dueño de la
plataforma):** el botón "Activar ahora" (banner) / "Activar" (tarjeta) de `/profile` **no hace
nada**. Apretado con Playwright real y medido con captura de red/consola durante el clic:
**cero pedidos a `/api/`**, cero errores de consola, captura antes/después **pixel a pixel
idéntica** — ni modal, ni QR, ni campo de código. El botón no tiene handler funcional. Confirmado
en 2 corridas seguidas tras corregir el propio instrumento (ver "trampa del instrumento" abajo).

**Por qué importa más que el bug ya conocido:** `b1247fb` (la corrección de la fecha fija
vencida) sólo MUEVE el problema en el tiempo — cuelga el plazo de la gracia del alta de cada
cliente en vez de una fecha global. El día que a un cliente real se le venza esa gracia, cae en
esta MISMA pantalla rota y **no tiene ningún camino de salida**: la función de activar 2FA está
rota de raíz, no es sólo "falta un aviso". `b1247fb` sin este arreglo pospone el accidente, no
lo evita.

**Trampa del instrumento, para quien reuse este patrón:** la primera corrida clickeó el botón
EQUIVOCADO — un regex ancho (`/activ|habilit|configur|verificar|enrol/i`) matcheó un link de
"Configuración" del menú antes que el botón real "Activar", y reportó "decorativo" sin haber
tocado el botón correcto. Corregido a match exacto (`/^activar( ahora)?$/i`). La SEGUNDA corrida
con el botón correcto dio un FALSO POSITIVO al revés: `document.querySelector('[role="dialog"]')`
sin exigir visibilidad detectó el widget del asistente ("Preguntá por tu negocio"), que vive en
el DOM con ese rol aunque esté cerrado — "SÍ entrega QR/código" con la captura mostrando la
pantalla sin cambios. Corregido exigiendo `offsetParent !== null`. Las dos trampas se vieron
recién comparando la captura contra el veredicto del propio script — el método de esta memoria
("verificar es mirar") atrapó al propio instrumento dos veces en la misma vuelta.

## 2026-09-17 15:00-15:20 La Paz — no repetir el recorrido: BUILD_ID sin cambios, mismo bloqueo

`docker exec onia-platform cat /app/.next/BUILD_ID` sigue en `OFd4xCDzoTbQdThUbfzDv` (igual que
la vuelta anterior) y la tarea de deploy `t_1a5c860d` sigue `blocked`. Método vigente: no
re-correr el recorrido completo hasta que cambie uno de los dos.

**Verificación nueva, con `scripts/mirar_bandeja_dueno.mjs` (sesión real, sin escribir nada):**
el bloqueo de 2FA no es sólo para clientes nuevos — **la cuenta real de Sergio Urcullo
(`sergio@onia.com.bo`, org "Clínica Sergio") ya está bloqueada HOY.** Pedido `/dashboard` con su
sesión → la app terminó en `/profile?mfa=obligatorio`, con el banner rojo y el botón "Activar
ahora" que ya se sabe que no hace nada. Confirmado también por SQL que `superadmin@onia.com.bo` y
`sergio.urcullo.m@gmail.com` (Bolivian Electric) tienen 0 factores MFA verificados y su gracia ya
venció. Esto ya estaba anotado en un comentario de `t_82251f19` (otra sesión, 08:51 La Paz) pero
enterrado en un párrafo largo — se agregó un comentario corto y directo en `t_1a5c860d`
explicándolo así: "ni vos podés usar el sistema hasta que se publique este pedido". No es un
hallazgo nuevo, es la misma causa con más urgencia visible para Sergio Urcullo.

Nada para hacer del lado de este carril: sigue blocked esperando el `ok`. Próxima vuelta, si
BUILD_ID sigue igual, no repetir esta verificación — ya quedó dicho dos veces en el tablero.

## 2026-09-17 12:12 La Paz — sin novedad de deploy, escalón nuevo: `/precios` con `reducedMotion`

Al arrancar: 0 orgs `zz-qa-` huérfanas. `BUILD_ID` sigue en `OFd4xCDzoTbQdThUbfzDv` y `npm run
pedido:entregado` confirma los tres pedidos vigentes sin cambios (`t_fe70e22a` landing,
`t_33d42433` bot, `t_62888ea2` plataforma — este último reemplaza a `t_1a5c860d`, que quedó
`archived`). No repetí el recorrido completo ni la sonda de MFA: método vigente, nada que medir
de nuevo ahí.

En su lugar cerré un pendiente de varias vueltas atrás: miré `onia.com.bo/precios` con
Playwright + `reducedMotion: 'reduce'` (para no leer un `<CountUp>` a mitad de animar, la trampa
ya conocida de esta memoria). **Sano**: cero textos cortados (`scrollWidth > clientWidth`), y
los precios pintados cruzan contra la fuente única — `320/89/3.200`, `550/145/5.500`,
`890/229/8.900`, `1.290/12.900`, `2.900/29.000` contra `DEFAULT_PLAN_AMOUNTS` de
`onia-platform/lib/subscription-plans.ts`; `Bs 390` (chatbot), `Bs 70/usuario` y `Bs 3.500/4.500`
(implementación/self-hosted) contra `lib/pricing.ts`. "Web del negocio · Desde Bs 2.000" es
texto tipeado del sitio (no tiene fuente en `pricing.ts`) pero coincide con la cifra ya
ratificada por Sergio Urcullo el 2026-08-23. Nada para reportar.

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

## 2026-09-17 16:09-16:35 La Paz — BUILD_ID sin cambios, mismo bloqueo; escalón 3 en superficie nueva: `/rubros`

Al arrancar: 0 orgs `zz-qa-` huérfanas, `BUILD_ID` sigue en `OFd4xCDzoTbQdThUbfzDv`, los tres
pedidos de deploy (`t_4f4e4071` plataforma, `t_75f4fac3` landing, `t_234cfe6a` bot — este último
ya `archived`) siguen `blocked`/sin ok. No repetí el recorrido completo ni la sonda de MFA.

Primero descarté un falso positivo: `/agentes` sigue diciendo "desde el plan Pro" (6 veces) en
producción, pero **ya está arreglado en `main`** (commits `5501a3c4`/`cf19a28e`, con comentario
explícito "DESDE QUE PLAN NO SE TIPEA ACA") — es el mismo deploy bloqueado, no un hallazgo nuevo.

**Hallazgo real en `/rubros`** (reportado, `t_2a13fdbb`, prioridad 2): la tarjeta de "Servicios"
dice, EN VIVO hoy, "Llegás al cierre de mes con el IVA y el IT ya armados, en vez de juntando
papeles" (`rubros/page.tsx:108`). Es la MISMA frase que el commit `4384f7e8` (2026-09-02) ya
identificó como "capacidad fabricada" y arregló — pero sólo en el panel dibujado hermano
(`ui.tsx`): "El panel de servicios vendía 'IVA del mes / IT del mes ya armados', que no aparece
en ningún plan de lib/pricing.ts". El arreglo tocó una representación de la promesa y dejó la
otra (el texto de venta de la misma página) intacta 15 días. Captura:
`capturas/hallazgo-iva-it-rubros.png`. No lo arreglo — no es mi zona.

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

## 2026-09-17 14:09-14:35 La Paz — BUILD_ID sin cambios, mismo bloqueo; escalón 3 en superficie nueva: `/guia-facturacion`

Al arrancar: 0 orgs `zz-qa-` huérfanas, `BUILD_ID` sigue en `OFd4xCDzoTbQdThUbfzDv`, los tres
pedidos de deploy vigentes (`t_4f4e4071` plataforma, `t_75f4fac3` landing, `t_234cfe6a` bot)
siguen `blocked` esperando el `ok` de Sergio Urcullo (confirmado con `show` en los tres: sin
comentarios nuevos de él, sólo simulacros en seco). No repetí el recorrido completo ni la sonda
de MFA — método vigente, nada cambió ahí.

Escalón 3 en una superficie que este carril nunca había mirado: `/facturacion` y
`/guia-facturacion` (el lead magnet fiscal). `/facturacion` está sana — el título dice "1 de
octubre de 2026" y el cuerpo explica correctamente "30 de septiembre = último día de transición,
desde el 1 de octubre rige la modalidad nueva" (dato correcto con matiz, no contradicción).

**Hallazgo en `/guia-facturacion`** (reportado, `t_c53fe39c`, prioridad 2): el `Kicker` de la
pantalla dice "Plazo · 30-09-2026", tipeado a mano en `page.tsx:125` — el ÚNICO texto de plazo
en las dos páginas fiscales que no sale de `lib/siat.ts`, pese a que el comentario del propio
archivo garantiza que todo el contenido sale de esa fuente única. Dos líneas abajo, el texto que
SÍ viene de la fuente dice "cómo saber si te toca el 1 de octubre". Mismo dato, misma pantalla,
dos fechas. Captura: `capturas/hallazgo-plazo-guia-facturacion.png`. No lo arreglo — no es mi
zona (código del sitio, carril web-venta).

`completo: false`, `llegoHasta: 4/9` (sin cambios, sigue bloqueado por el mismo deploy).

## Reverificado 2026-09-18 09:09-09:35 La Paz — dental 9/9, BUILD_ID nuevo tras los tres pedidos de deploy cerrados

`BUILD_ID` cambió de nuevo (`HiLa5P_MF3e3iK6KUSfli` → `4AefpemDeSbQXrDmTbhoy`) y los tres pedidos
de deploy que quedaban abiertos ya están `done`/`archived` (`t_4f4e4071` plataforma, `t_75f4fac3`
landing, `t_234cfe6a` bot — ninguno sigue `blocked`). Con esa señal, repetí el recorrido completo
en dental (`RECORRIDO_RUBRO` sin pasar = default): **9/9 pasos, `completo: true`**, cuenta →
onboarding (6 pantallas) → paciente `zz-qa-2026-09-18-1309-paciente` guardado y visible → cita
2026-09-21 09:00 agendada y VISTA en `/appointments` → factura con ítem visible en `/billing/...`
(frenado sin pagar) → panel revisado. Limpieza verificada: `organizations`/`appointments` con
`zz-qa-%` en 0 al cerrar (contados antes y después).

Con eso confirmado, intenté escalón 3 en una superficie nueva: el formulario de
`/servicios/webs` (wizard largo de una sola página: rubro, objetivo, plan, estilo, tipografía,
color, contacto — con botón "Armar mi web →" `disabled` hasta completar todo). Enviarlo de
punta a punta quedó **inconcluso**: el botón sigue habilitado=false tras llenar los campos de
texto y algunas de las secciones de botones, y otras secciones (p. ej. "Minimalista") dejaron de
encontrarse por selector — probablemente dependen de una elección anterior (plan/objetivo) para
aparecer. No alcanza para reportar un hallazgo (no se descartó error propio del instrumento); lo
dejo anotado en la cola para retomarlo con un mapeo paso a paso del formulario, no a ciegas.

`completo: true`, `llegoHasta: 9/9`.

## Reverificado 2026-09-18 07:09-07:20 La Paz — Estética y spa, 9/9 completo (deploy del bloqueo de MFA ya resuelto)

El bloqueo de MFA obligatorio que cortaba el recorrido en el paso 5 desde el 17-sep ya se
destrabó (ver corrida de las 00:14 La Paz: `BUILD_ID` cambió a `HiLa5P_MF3e3iK6KUSfli`). Con eso
confirmado, corrí `RECORRIDO_RUBRO="Estética y spa" node scripts/recorrido_cliente.mjs --escribir`
— era el único de los 6 rubros activos sin recheck reciente. **Los 9 pasos completos**: alta,
onboarding (6 pantallas), paciente `zz-qa-2026-09-18-1109-paciente` cargado y visible, cita
2026-09-21 09:00 agendada y VISTA en `/appointments`, factura con ítem visible en `/billing/...`
(frenado ahí sin pagar), panel revisado. Limpieza verificada: `organizations`/`appointments` con
`zz-qa-%` en 0 al cerrar.

Con esto, **los 6 rubros activos del alta ya están cubiertos** (dental, comercio, importadora,
estética, servicios profesionales — veterinaria no se ofrece en el alta). `completo: true`,
`llegoHasta: 9/9`. Próxima vuelta: no repetir rubro — ir a escalón 3 en superficie nueva o
verificar si algún pedido de deploy sigue esperando `ok`.

## 2026-09-18 10:09-10:25 La Paz — `/servicios/webs` mapeado: era el instrumento, no el sitio

`BUILD_ID` sin cambios (`4AefpemDeSbQXrDmTbhoy`, mismo que la reverificación de dental de las
09:35), `zz-qa-` orgs en 0 al arrancar, sin pedidos de deploy bloqueados que me toquen. No repetí
el recorrido completo (última medición con este mismo `BUILD_ID` ya dio 9/9 en dental y en
Estética y spa).

Retomé el pendiente propio de `/servicios/webs` (el botón "Armar mi web →" quedaba `disabled`).
Mapeándolo paso a paso con Playwright: **era mi selector, no un bug del sitio**. Hay dos campos
con placeholder parecido — el mini-asistente de arriba (`Ej. Clínica Amanecer`, es el que
controla ese botón) y el formulario detallado de abajo, paso 01 (`Ej. Casa Norte`). Llenaba el
segundo; el primero, que es el que valida el botón, quedaba vacío — de ahí el hint "Empezá por
el nombre." correcto. Con el campo de arriba lleno, el botón habilita solo y el clic no manda
nada a un backend (solo Cloudflare RUM) — el envío real es el link de WhatsApp de más abajo, que
este carril no toca. Sin hallazgo; cerrado en la cola con la reproducción completa.

`completo: true` (sin cambios desde la última corrida completa), `llegoHasta: 9/9`. Próxima
vuelta: escalón 3 en `/precios` con `reducedMotion` (pendiente hace varias vueltas) o repetir el
recorrido completo si cambia el `BUILD_ID`.

## Reverificado 2026-09-18 14:09-14:20 La Paz — dental 9/9 con `BUILD_ID` sin cambios; `/precios` re-chequeado tras la escalera de precios

`ONIA_ALTA_AUTOMATICA=abierta`, `zz-qa-` orgs en 0 al arrancar (chequeo obligatorio, sin
huérfanas esta vez). Corrí el recorrido completo (`--escribir`) igual, porque es la medición de
arranque obligatoria de este carril, no una repetición optativa: `BUILD_ID` resultó
`4AefpemDeSbQXrDmTbhoy`, el mismo que ya venía sano desde la reverificación de las 09:35 del
2026-09-18 — sin cambios de deploy.

**Recorrido dental: 9/9, `completo: true`, `agujeros: []`.** Los 9 pasos completos (cuenta
`zz-qa-2026-09-18-1809@onia.com.bo`, confirmación de correo real, onboarding, paciente cargado
y encontrado, cita `2026-09-21 09:00` vista en `/appointments`, factura con ítem manual servida
en `/billing/<id>` y frenada sin pagar, panel mirado). Las 6 filas propias (`auth.users`,
`auth.identities`, `organizations`, `profiles`, `organization_entitlements`, `patients`) se
imprimieron y se borraron en la misma corrida: 0 filas `zz-qa-` al cerrar.

El pendiente propio de la nota anterior ("escalón 3 en `/precios`") ya estaba resuelto desde el
2026-09-13 (`t_5ad92d30`, arreglado y desplegado el mismo día en `5501a3c4`), pero como la
escalera de precios siguió moviéndose después (plan Crece, `whatsappIncluded` en Completo), lo
re-chequeé en vivo contra `https://onia.com.bo/precios` con `reducedMotion:'reduce'`: la tarjeta
de "Reservas online" hoy dice *"como add-on a Bs 150/mes, o incluidas desde Crece"* y la del
chatbot de WhatsApp dice *"Completo ya lo trae incluido; acá va aparte, Bs 390/mes"` — las dos
correctas, derivadas del catálogo, sin ningún plan tipeado a mano. Sin hallazgo.

`completo: true`, `llegoHasta: 9/9`. Sin novedad de producto esta vuelta. Próxima vuelta: si
`BUILD_ID` sigue igual, escalón 3 en una superficie todavía no auditada por este carril — el
flujo de invitar/quitar un coadministrador desde `/settings` (equipo), que hoy el recorrido
sólo toca en el onboarding (alta de un profesional del staff, sin invitar por correo) y que
`onia-platform` cambió varias veces esta semana (DG-043).

## 2026-09-24 07:09-07:13 La Paz — `BUILD_ID` sin cambios (dental no repetido, siguiendo la lección de ayer); cerrado un fantasma del tablero y un falso "hallazgo" del propio instrumento

`ONIA_ALTA_AUTOMATICA=abierta`. `BUILD_ID` comparado ANTES de decidir nada: `9tuk1Qk2BjQ2j2HdJcL8u`,
igual al citado en la entrada de las 10:09-10:14 de ayer — no correspondía repetir dental (método
nuevo aplicado, primera vez que funciona).

**Tablero:** dos tareas `ready` de recorrido-cliente eran fantasmas — `t_2d0dde23` (el loop no
pudo correr en el VPS, 2026-09-21) y `t_32ba759c` (límite semanal vencido "resets Sep 24, 8am
UTC"). Ambas de cuando el loop corría en el VPS; hoy corre en nodo-casa y esta misma vuelta ya
probaba que arranca. Cerradas con nota.

**Cola:** `t_7bb28d06` ("portal del paciente sin forma de cancelar") figuraba `done` en el
tablero (arreglada el 19-sep en `a5be7d45`) pero seguía en la sección "Abierto" de
`cola/recorrido-cliente.md`. Gate 1 — reproducido en vivo con `scripts/probar_cancelar_cita.mjs`:
la API cancela (200, `CANCELADA`) y las dos pantallas del portal (`/book/confirm/[token]`,
`/book/my-appointments/[token]`) YA muestran el botón "No voy a poder ir". El script seguía
marcando "HALLAZGO" porque su regex de detección sólo buscaba la palabra literal "cancel" en el
texto del botón, y el producto lo dice en español — nunca iba a matchear. Corregido el regex a
`/cancel|no voy a poder|no podr[eé]/i` en `scripts/probar_cancelar_cita.mjs`; corrida limpia:
`RESULTADO: la API cancela y/o el portal ya ofrece cancelar — sin hallazgo nuevo`, exit 0, 0 filas
`zz-qa-` al cerrar (verificado con SELECT antes/después de borrar). Cola movida a "Cerrado — era
el instrumento, no el sitio".

RAZÓN: la medida principal (dental 9/9) no se movió porque `BUILD_ID` sigue igual — correcto no
repetirla; el avance de esta vuelta fue destrabar el tablero y cerrar un ítem fantasma de la cola.
LECCIÓN: ninguna nueva — el método de comparar `BUILD_ID` primero funcionó esta vez.

## 2026-09-25 15:09-15:14 La Paz — `BUILD_ID` cambió (`4FWMcecd4jRBGUVwStDQb`, antes
`9tuk1Qk2BjQ2j2HdJcL8u`): correspondía repetir dental, y se corrió

`ONIA_ALTA_AUTOMATICA=abierta`. Tablero: `t_324ad7ec` (informativo de la vuelta anterior sobre
precios, sin hallazgo) cerrado sin acción.

Recorrido completo con `--escribir`: **9/9 pasos OK en "Clínica dental"**, `completo: true` en
`resumen.json`, sin agujeros. Cuenta `zz-qa-2026-09-25-1909@onia.com.bo` creada, onboarding en 6
pantallas, paciente cargado, cita `2026-09-28 09:00` agendada y VISTA en `/appointments`, factura
con ítem `zz-qa-` mirada en `/billing/...` y frenada sin pagar. Todo lo `zz-qa-` borrado en la
misma corrida: `appointments`/`organizations` con prefijo `zz-qa-` en 0 filas, verificado con
`SELECT` después del borrado.

RAZÓN: N/A — avanzó (recorrido re-verificado contra el `BUILD_ID` nuevo, 9/9 sin hallazgo).
LECCIÓN: ninguna nueva — el método de comparar `BUILD_ID` primero volvió a ser lo que decidió
repetir dental.

## 2026-09-26 00:09-00:20 La Paz — dental 9/9 con `BUILD_ID` sin cambios; re-verificado invitar/quitar coadministrador (DG-043) tras varios deploys de esta semana

`ONIA_ALTA_AUTOMATICA=abierta`. Tablero: sin tareas `ready` de `recorrido-cliente` sin reclamar.
`BUILD_ID` comparado antes de decidir: `4FWMcecd4jRBGUVwStDQb`, igual al de la corrida de
Estética del 2026-09-25 23:16 y al de dental de las 15:09. Correspondía igual correr el recorrido
completo (es la medición de arranque obligatoria, no una repetición optativa por gusto).

**Recorrido dental: 9/9, `completo: true`, `agujeros: []`.** Cuenta
`zz-qa-2026-09-26-0009@onia.com.bo` creada, confirmación de correo real, onboarding en 6
pantallas, paciente `zz-qa-2026-09-26-0009-paciente` cargado y encontrado, cita
`2026-09-28 09:00` agendada y VISTA en `/appointments` (id `cmuhmyf1l005k01r2mabfx8yq`), factura
con ítem `zz-qa-2026-09-26-0009-item` servida en `/billing/cmuhmyqrb005m01r2te357f97` y frenada
sin pagar, panel mirado (no lista pacientes: es lo que muestra, no un fallo). Todo lo `zz-qa-`
borrado en la misma corrida: 0 filas en `appointments`/`organizations` con prefijo `zz-qa-`,
verificado con `SELECT` después del borrado.

Con el resto de la vuelta, re-chequeé el escalón que la nota del 18-sep había dejado señalado
como "superficie no auditada bajo el `BUILD_ID` vigente" — invitar y quitar un coadministrador
desde `/settings` (DG-043) — porque `onia-platform` tuvo varios deploys entre esa nota (18-sep)
y hoy, y la última verificación en VIVO por UI de esa superficie fue el 19-sep, con un `BUILD_ID`
viejo. Usé `scripts/probar_coadministrador_ui.mjs` (ya existía, no hizo falta escribir nada
nuevo): org `zz-qa-coadminui-20260926001416` sembrada por SQL con `plan='clinic'`
(`multiAdminIncluded`), sesión del dueño minteada sin contraseña, clic real en "Agregar a
alguien" con rol Administrador → quedó un segundo `profiles` con `role='ADMIN'` en la base; clic
real en "Quitar" con el `confirm()` nativo aceptado → ese `profiles` desapareció. **Sin hallazgo**:
las dos puntas de DG-043 siguen sosteniéndose por la UI tras los deploys de esta semana. Limpieza
verificada: `organizations=0 auth.users=0` al cerrar.

RAZÓN: N/A — avanzó (dental re-confirmado con el `BUILD_ID` vigente, y cerrado un escalón que
quedaba con verificación vieja).
LECCIÓN: ninguna nueva — el método de comparar `BUILD_ID` primero y de reproducir con el
instrumento ya escrito (en vez de reinventar el chequeo) volvió a funcionar.

## 2026-09-26 (vuelta HEAD f3c4327f) — otro eje (cifra-por-cifra), no dental: `BUILD_ID` sin cambio (`4FWMcecd4jRBGUVwStDQb`)

Escalón 3 por ruta ya se había agotado (24/24 rutas auditadas al menos una vez, nota anterior).
`BUILD_ID` comparado antes de decidir: sin cambio desde la corrida de dental del 2026-09-26
00:09 → no correspondía repetir dental. Cambié de eje: cifra por cifra, precios REALES contra
`onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`), sobre producción viva
(`curl https://onia.com.bo/precios` y `/`, no el código fuente).

**Sin hallazgo en precios.** Los 4 escalones (320/550/890/1.290 mensual; 3.200/5.500/8.900/12.900
anual; semanal 89/145/229 en basic/crece/professional) están servidos IDÉNTICOS en `/precios` y
en `/` — incluida la letra chica ("anual cobra 10 meses", "Completo se cobra mensual o anual").
El add-on chatbot (Bs 390/mes, Bs 3.900/año) también coincide con `pricing.ts`. La memoria
compartida decía que esta escalera (con "crece") era nueva desde el 2026-09-12: confirmado que
la web YA la sirve completa, sin residuos de la escalera vieja (320/750/1.500).

**Reverifiqué el único hallazgo abierto que traía esta vuelta (`t_826a7ab2`,
`/servicios/marketing-ia`) — sigue roto en producción pese a estar `done` en el tablero.** El
fix (commit `5f61db7a`, "la venta le confesaba al lead que no tenemos clientes") existe, pero
**vive solo en `claude/web-venta`**: `git merge-base --is-ancestor 5f61db7a origin/main` da NO.
`curl https://onia.com.bo/servicios/marketing-ia` sigue sirviendo el texto viejo ("Somos una
empresa nueva... no tenemos un muro de logos ni casos de éxito"), idéntico al de la captura
original. No lo mergeo (no es mi carril, es de `web-venta`/integrador) — dejé la evidencia en un
comentario de la tarea para que el integrador la levante en su próximo merge. Esto es la regla
"construido ≠ terminado" aplicada al revés de lo usual: acá lo que falló no fue el código, fue
tratar un commit en una rama ajena como si ya estuviera en producción.

RAZÓN: N/A — avanzó (precios cifra-por-cifra sin hallazgo nuevo; hallazgo previo reverificado y
corregido su estado real en el tablero, que decía "done" sin estarlo en producción).
LECCIÓN: un tablero en "done" certifica que el AGENTE terminó su commit, no que ese commit llegó
a `origin/main` ni a producción — antes de dar un hallazgo por cerrado, `git merge-base
--is-ancestor <sha-del-fix> origin/main`, y si no, recurl la superficie viva.

## 2026-09-26 11:09 La Paz (vuelta HEAD 921cf15d) — dental 9/9, correspondía repetir: `BUILD_ID` cambió

`BUILD_ID` comparado antes de decidir: vivo `DvBubiuO4uC5_E9jFNJeZ`, distinto al `4FWMcecd4jRBGUVwStDQb`
de las dos corridas anteriores (00:09 y f3c4327f) → hubo deploy nuevo desde la última corrida completa
de dental, así que repetir SÍ correspondía (no es el bug de las dos vueltas seguidas sin chequear).

Corrida `--escribir` completa: **RECORRIDO COMPLETO en "Clínica dental", 9/9 pasos OK**,
`completo: true`, `agujeros: []`. Alta abierta confirmada (`ONIA_ALTA_AUTOMATICA=abierta`) antes de
arrancar. Los 9 pasos: home visible → camino de alta (Empezar, 2 clics) → cuenta
`zz-qa-2026-09-26-1509@onia.com.bo` creada, pide confirmar correo → login tras confirmar → onboarding
completo en 6 pantallas (rubro dental, horarios lun-vie 09-13/15-19, equipo con 1 profesional) →
paciente `zz-qa-2026-09-26-1509-paciente` cargado y visto en `/patients` → cita 2026-09-28 09:00
agendada (201, id `cmuij3ag6002901mx9sbcmkgk`) y VISTA en `/appointments` → factura con ítem
`zz-qa-2026-09-26-1509-item` en `/billing/cmuij3ksc002b01mxzcs965vu`, FRENADO sin pagar → panel
mirado (el paciente no figura ahí, es lo esperado: el dashboard no lista pacientes). Limpieza
verificada: `appointments zz-qa-=0`, `organizations zz-qa-=0` al cerrar.

**Sin hallazgo nuevo** — el `BUILD_ID` nuevo no rompió ningún paso del camino dental.

RAZÓN: N/A — avanzó (dental re-confirmado con el `BUILD_ID` nuevo, sin regresión).
LECCIÓN: ninguna nueva — comparar `BUILD_ID` contra esta misma entrada antes de decidir si dental
corresponde repetirse volvió a ser el filtro correcto: esta vez SÍ había deploy nuevo detrás.
