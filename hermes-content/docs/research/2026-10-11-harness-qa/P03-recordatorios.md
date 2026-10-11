# P03 - Recordatorios de un disparo de las nubes

Fecha de medicion: 2026-10-11, ~05:30Z (lista tomada a las 05:3x UTC, tras el recordatorio de Plataforma creado 05:18Z).
Metodo: RemoteTrigger action=list, una sola llamada. La salida (83 KB) se guardo en
tool-results/toolu_01Ax66dU69nD2y54o8eDkr9E.txt y se parseo con node (solo lectura).
No se uso create, update ni run. No se imprimio api_token_hint.

## Estado medido

Comando: RemoteTrigger action=list (sin cursor).

Salida parseada (20 triggers en la pagina 1, has_more=true, next_cursor presente):

- Latidos (created_kind=ROUTINE_CREATED_KIND_UNSPECIFIED, cron horario, enabled=true): 4
  - trig_01XVX9kgMExkapoN5XDdamx4, Plataforma, cron 17 * * * *, next 06:17Z
  - trig_01ExDbhoaxaXpzpvj26DEeQ8, Marca, cron 27 * * * *, next 06:27Z
  - trig_013YP8Nxhwi8HbdufMuv2Var, Lucia, cron 47 * * * *, next 05:47Z
  - trig_01A9hCX7s5ZuaQ24TkK3Rr8d, Hermes, cron 57 * * * *, next 05:57Z
  - Ventas: sin latido de servidor (madre.md:149, entorno Default). Esperado, no es un fallo.
- Recordatorios (created_kind=reminder, created_via=meta_mcp): 16 en la pagina 1
  - Vigentes (enabled=true): 2
    - trig_018rLeLcwUm8SR7a63ZJaVeC, session_01HhnF (Plataforma), next 05:55:00Z, creado 05:18:02Z (37 min).
    - trig_019W4DcjvqWFenCSR9NwbK2k, session_01WPec (Marca), next 11:00:00Z, creado 10-oct 23:01Z (~12 h).
  - Vencidos (enabled=false, ended_reason=run_once_fired): 14
    - Plataforma (session_01HhnF): 01G5nnj, 01F1eSy, 01R7C3j, 01Vziy9, 012KgNh (5)
    - Marca (session_01WPec): 018E5ik, 01AvDKc, 01HoiHS, 01CjKoH, 01CMXFq, 01MSRxQ, 01UVCdR (7)
    - Ventas (session_0143C5): 01LAFRJ (1)
    - Lucia (session_01XSzF): 018z8M2 (1)
    - Hermes (session_01SQ7c): 0 recordatorios visibles
  - Nota: el mapeo sesion-recordatorio sale de los session_id que aparecen en el JSON de cada trigger.
- Total de triggers: UNKNOWN. list no tiene parametro de cursor (el schema lo define solo para list_runs y get_run_log). Con list no se puede pasar a la pagina 2. Es una limitacion de la herramienta, no un bug pendiente.
- Recordatorios de 20-30 min: no hay ninguno encadenado. El unico corto es el de Plataforma (37 min desde su creacion).
- Spec del recordatorio de 20-30 min: no encontrada en hermes-content/docs/cola/loop/*.md, ONIA_EQUIPO_DE_AGENTES.md ni ONIA_EQUIPOS_POR_SESION.md. Unica mencion: ONIA_HARNESS.md:81 (recordatorio del BCP), no es la spec del latido v2.

Tabla por sesion:

| Sesion | Latido (min) | Recordatorio vigente | Vencidos visibles | Estado |
|---|---|---|---|---|
| Plataforma session_01HhnF | :17, enabled | Si, 05:55Z (creado 05:18Z, 37 min) | 5 | Tiene uno. Falta el siguiente tras ese. |
| Hermes session_01SQ7c | :57, enabled | No | 0 | Brecha: sin ningun recordatorio |
| Lucia session_01XSzF | :47, enabled | No | 1 | Brecha |
| Marca session_01WPec | :27, enabled | Si, 11:00Z (creado 10-oct 23:01Z) | 7 | Recordatorio largo (~12 h), no de 20-30 min |
| Ventas session_0143C5 | sin latido | No | 1 | Brecha: sin disparo de servidor. Depende de ScheduleWakeup propio (UNKNOWN si esta activo). |

## Brecha

1. Ninguna sesion tiene un recordatorio de 20-30 min encadenado. Solo Plataforma tiene uno corto, y vence a las 05:55Z.
2. Hermes, Lucia y Ventas no tienen recordatorio vigente. Hermes y Lucia tienen latido horario, pero entre latidos no se despiertan.
3. Marca tiene un recordatorio vigente de ~12 h, que no cumple el patron de 20-30 min.
4. Ventas: no hay disparo de servidor. Si su ScheduleWakeup esta activo: UNKNOWN (no se puede leer desde RemoteTrigger).
5. Los 14 recordatorios vencidos ocupan la lista. No molestan al funcionamiento. RemoteTrigger no tiene delete en este subagente.
6. Falta la spec del recordatorio de 20-30 min en los docs.
7. No se verifico que una sesion nube pueda crear su propio recordatorio. La herramienta exacta que usaria no se identifico en esta sesion: UNKNOWN. Los recordatorios existentes se crearon via meta_mcp.

## Configuracion propuesta

No aplicada. Este subagente no crea ni modifica nada. Son textos listos para pegar en quien corresponda.

1) Texto para el prompt de cada sesion nube (la aplica su madre):

```
Al terminar un turno con trabajo abierto, programa UN recordatorio de un disparo a 25 minutos.
Si ya hay un recordatorio vigente con next_run_at dentro de 30 min, no crees otro.
Texto del recordatorio: "Recordatorio 25 min: retoma tu cola (hermes-content/docs/handoff/<carril>.md) y reporta una linea a la madre."
```

2) Bloque nuevo para hermes-content/docs/cola/loop/madre.md (la integracion lo commitea en la rama; no se toca main):

```diff
+## Recordatorio de un disparo (latido v2)
+- Duracion: 25 min. Uno vigente por sesion. Texto fijo (ver arriba).
+- Verificacion: RemoteTrigger list, filtrar created_kind=reminder y enabled=true; debe haber exactamente uno por session_id, con next_run_at entre 20 y 30 min desde created_at.
+- Ventas (sin latido de servidor): confirmar ScheduleWakeup activo; si no, UNKNOWN.
```

3) Piloto antes de extender: Hermes (sin recordatorio vigente, latido :57). La madre-dev pide a la sesion Hermes que programe el recordatorio con la herramienta que tenga disponible, y se mide con RemoteTrigger list. Si la sesion no puede crearlo, queda documentado como limitacion.

## Quien la aplica

- Plataforma: madre-dev. Ya tiene un recordatorio de 05:55Z. Falta programar el siguiente al ejecutarse ese. Razon: madre-dev ordena Plataforma.
- Hermes: madre-dev (piloto). Sin recordatorio. Razon: madre-dev ordena Hermes.
- Lucia: madre-marketing. Sin recordatorio. Razon: madre-marketing ordena Lucia.
- Marca: madre-marketing. Reemplazar el de ~12 h por el de 25 min. Razon: madre-marketing ordena Marca.
- Ventas: madre-marketing. Confirmar ScheduleWakeup. Razon: Ventas es su carril y no tiene latido de servidor.
- Spec en madre.md: integrador (commit en rama, sin push a main). Razon: el integrador mantiene los docs de cola.
- Sergio Urcullo: no requerido, salvo que quiera cambiar los 25 minutos.

## Prueba de hecho

1. RemoteTrigger list, filtrar created_kind=reminder y enabled=true. Debe haber exactamente un recordatorio por session_id (Plataforma, Hermes, Lucia, Marca, Ventas), con next_run_at entre 20 y 30 min desde created_at.
2. Ventas: confirmar ScheduleWakeup activo leyendolo en su sesion. Hasta entonces, UNKNOWN.
3. Total de triggers: UNKNOWN. list no pagina; no se puede resolver con esta herramienta. Si hace falta el total, usar otra via de listado.
4. Hecho = las cinco sesiones tienen un recordatorio vigente de 20-30 min (o ScheduleWakeup confirmado en Ventas), y la spec esta en madre.md.
5. Estado actual frente a hecho: NO cumplido. Solo Plataforma tiene un recordatorio corto, y es uno solo.
