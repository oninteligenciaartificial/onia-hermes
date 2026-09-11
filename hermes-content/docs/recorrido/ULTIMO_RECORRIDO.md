# El recorrido de cliente — último estado

**Un tema = un archivo sin fecha. Este archivo se EDITA, no se duplica.** Las fotos con fecha
van en `capturas/`.

Cómo se reproduce, y es un comando, no una intención:

    cd /root/loops/onia-hermes-recorrido && node scripts/recorrido_cliente.mjs

Sin `--escribir` el recorrido llega hasta el paso 2 y se detiene: no crea cuenta, y sin cuenta
no hay nada detrás. Para recorrerlo entero, ver *"Cómo se corre entero"* al final.

---

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

## Verificado 2026-09-11 03:13 La Paz — promesa "14 días gratis, sin tarjeta" (home)

`(sitio)/page.tsx` promete `PRUEBA.dias` días gratis sin tarjeta; `PRUEBA_DIAS = 14` en
`src/lib/pricing.ts` y `TRIAL_DAYS = 14` en `onia-platform/lib/subscription/plan-state.ts`
coinciden. Confirmado contra la base real (no solo el código): `trialEnd - createdAt` da
exactamente 14 días en las dos orgs vivas con trial (`clinica-sergio-p2ljs`,
`bolivian-electricidad-e6t21`). Y el alta de esta misma vuelta no pidió tarjeta en ningún
paso. La promesa se cumple. Sin hallazgo.
