# 10 errores de seguridad en apps con IA

- **Fuente:** https://www.instagram.com/p/Db1JbQzshyA/ · 54 s · español
- **Visto:** 2026-08-09 (Gemini nativo)
- **Archivo:** `Instagram-Db1JbQzshyA.mp4` (no versionado)

## Qué dice realmente

Creadora con micrófono de solapa, infografía por cada punto, ritmo de ~5 s por ítem:

| # | Error | Pregunta que hace |
|---|---|---|
| 1 | Rate limiting | ¿o cualquiera hace mil peticiones hasta saturarte? |
| 2 | API keys | ¿en el backend, o de regalito en el frontend? |
| 3 | **RLS** | ¿cada tabla con reglas, o cualquier usuario ve los datos de todos? |
| 4 | Variables de entorno | ¿`.env` protegido, o subido a GitHub sin darte cuenta? |
| 5 | Validación de inputs | ¿filtrás lo que entra, o confiás? |
| 6 | Base de datos | ¿revisaste que no haya tabla abierta al público por defecto? |
| 7 | Autenticación | ¿rutas realmente protegidas? |
| 8 | Errores | ¿mensaje limpio, o exponés el stack trace al usuario? |
| 9 | Endpoints admin/debug | ¿los dejaste accesibles en producción? |
| 10 | Logging | ¿tenés registro para detectar ataques, o te enterás cuando ya entraron? |

CTA: comentar `seguridad` → guía por DM.

## Veredicto: SIRVE YA — no como aprendizaje, como checklist que nos acusa

El contenido es checklist estándar de OWASP simplificado; para nosotros no hay nada nuevo
conceptualmente. **Lo que lo hace útil es el cruce con nuestro estado real.** Contra el
diagnóstico de seguridad del 2026-08-07:

- **#3 y #6 (RLS / tablas abiertas)** — verificado que **falta RLS donde viven los datos**;
  hoy no hay fuga sólo porque `PGRST_DB_SCHEMAS` no expone esos esquemas. Es un tapón de
  configuración, no una defensa.
- **#7 y #9 (rutas y paneles)** — el panel de Easypanel está **abierto y sin TLS**, y el
  firewall del VPS está inactivo.
- **#10 (logging)** — sin detección de intrusión.

O sea: 3 de los 10 están abiertos en producción, en el sistema que estamos por vender a
clientes con datos de pacientes y facturación. El video no descubre nada; **confirma la
prioridad**.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Infra / seguridad | Usar los 10 puntos como checklist de release de ONIA Platform. Bloqueantes antes de vender: RLS, firewall, TLS en Easypanel |
| Contenido ONIA | Formato replicable y de altísima autoridad para el comprador B2B. Pero **solo publicarlo cuando nuestra propia casa esté ordenada** — publicar esto con el panel abierto es un riesgo reputacional |
| Propuestas | "Auditamos estos 10 puntos antes de entregar" es un diferenciador real frente a quien entrega un vibe-coded a producción |

## Riesgo

Tomarlo como contenido y no como tarea. El valor de este video para ONIA es la lista de
pendientes, no el reel.
