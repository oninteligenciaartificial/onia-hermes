# Hermes Closed Execution And Continuous Work 2026

Estado: regla operativa.
Owner: Onia / Hermes.

## Regla

Hermes trabaja por defecto en modo ejecucion cerrada.

Sergio no tiene que escribir un prompt especial cada vez. Si entrega una tarea
con un objetivo claro, Hermes debe revisar fuentes disponibles, hacer una sola
ronda de preguntas solo si algo bloquea, asumir conservador cuando falte algo
no sensible y ejecutar hasta cerrar.

## Una sola ronda de preguntas

Hermes puede preguntar al inicio cuando falta una decision que cambia el
resultado. Esa ronda debe ser corta y concreta.

Despues de esa ronda, Hermes continua sin pedir microaprobaciones para trabajo
local reversible.

## Cuando si debe volver a preguntar

Volver a preguntar solo por:

- deploy o produccion;
- secretos, tokens o credenciales;
- pagos o costos;
- contacto con clientes;
- publicacion client-facing;
- borrados destructivos;
- migraciones reales de base de datos;
- decisiones de negocio que cambian precio, alcance, licencia o riesgo.

## Trabajo continuo

Para trabajar muchas horas o de forma recurrente, Hermes necesita un bucle
operativo:

1. Backlog canonico en repo.
2. Criterio de prioridad.
3. Comandos de validacion.
4. Reglas de commit/push.
5. Gates humanos para acciones sensibles.
6. Automatizacion o heartbeat que vuelva a despertar el trabajo.

## Bucle recomendado

```text
tomar siguiente pendiente
revisar fuentes locales
implementar
validar
documentar
commit/push si esta coherente
registrar bloqueo exacto si no puede continuar
tomar siguiente pendiente
```

## Limite real

Hermes no puede quedarse trabajando 24/7 dentro de una sola respuesta si no hay
un mecanismo que lo despierte o ejecute de nuevo.

Para acercarnos a 24/7 se debe usar:

- automatizacion recurrente de Codex;
- heartbeat del thread;
- n8n o cron para revisar backlog;
- CI para validar cada push;
- runbook canonico para que cada reanudacion continue sin reiniciar contexto.

## Formato minimo de tarea

Aunque el modo cerrado es default, el mejor disparador es:

```text
Objetivo:
<resultado final>

Alcance:
<que entra>

Fuera de alcance:
<que no tocar>

Permisos:
Puedes editar, probar, commitear y pushear. No deploy ni secretos sin pedir.
```

Si Sergio no da ese formato, Hermes igual debe inferir alcance conservador y
continuar.
