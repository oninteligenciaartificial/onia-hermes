# Checklist de seguridad — 10 puntos antes de confiar tu negocio a un sistema con IA

Recurso empaquetado del ciclo comentario→DM de Instagram (`@oniahq`). Se manda completo
cuando alguien comenta **SISTEMA** en el reel del checklist de seguridad.

Ciclo completo (guion de la pieza, script de DM, CRM, métricas):
`hermes-content/docs/historial/ONIA_CICLO_COMENTARIO_DM_20260815.md`.

**Fuente de los 10 puntos:** video de referencia analizado en
`hermes-content/references/video-intake/2026-08-09-10-errores-seguridad-apps-ia.md`
(transcripción completa en `transcripciones/2026-08-09-10-errores-seguridad.md`). Son los
mismos 10 que ONIA adoptó como checklist de release interno de ONIA Platform.

**Verificación propia (no es una promesa vacía):** los 10 puntos fueron auditados contra
producción y cerrados el 2026-08-11, verificados de nuevo el 2026-08-12 — memoria de
proyecto `onia-seguridad-estado-critico`. RLS activo en las 71 tablas con grants revocados a
`anon`/`authenticated`, firewall (`ufw` + reglas Docker) activo con los puertos sueltos
cerrados, `fail2ban` + vigilante diario probado con una alerta real.

---

## Texto listo para pegar en el DM de Instagram

Formato con **asterisco simple** (`*negrita*`): es el que Instagram (y WhatsApp) renderizan
en el chat. Doble asterisco (`**negrita**`) se ve literal, no lo uses si copiás esto a mano.

```text
¡Hola! Acá tenés la checklist de los 10 puntos de seguridad, la misma que usamos nosotros
antes de subir cualquier sistema a producción 👇

Cualquier negocio que conecta WhatsApp, un formulario o una base de clientes/pacientes a un
sistema con IA corre el mismo riesgo: no falla la IA, falla la seguridad de la base que la
sostiene. Estas son las 10 preguntas que le hacemos a CUALQUIER sistema antes de lanzarlo —
hacéselas también al tuyo, o a quien te lo esté por vender:

1. *Límite de pedidos* — ¿aguanta si mil personas lo golpean a la vez, o se cae y tus
clientes reales se quedan afuera?
2. *Claves de conexión* — ¿las claves que conectan tu sistema con WhatsApp, pagos o el panel
están escondidas del lado del servidor, o visibles en un código que cualquiera puede leer?
3. *Un cliente no ve los datos de otro* — ¿cada cuenta ve solo lo suyo, o hay una tabla sin
candado donde cualquiera podría ver los datos de otro cliente?
4. *Contraseñas del sistema* — ¿están guardadas seguras, o alguien las subió sin querer a un
repositorio público?
5. *Lo que la gente escribe* — ¿el formulario filtra lo que entra, o confía ciegamente en
cualquier dato que le metan?
6. *La base de datos* — ¿revisaron que ninguna tabla quede abierta al público por defecto?
7. *Quién entra al panel* — ¿solo entra quien tiene que entrar, o cualquiera con el link
puede pasar?
8. *Cuando algo falla* — ¿el cliente ve un mensaje prolijo, o el error técnico completo (con
pistas de cómo entrar)?
9. *Puertas de administrador* — ¿quedaron cerradas en producción, o siguen abiertas "por si
acaso"?
10. *Si alguien intenta entrar* — ¿te enterás en el momento, o te enterás cuando ya pasó?

Las cerramos las 10 en nuestra propia plataforma (regla de acceso por fila en cada tabla,
firewall activo, alerta si algo se cae) y las volvemos a auditar en cada sistema nuevo que
armamos.

Si querés que las revisemos aplicadas a TU negocio (el sistema que ya tenés, o el que estás
por contratar) — 20 minutos, gratis, elegís vos el horario:
https://onia.com.bo/?src=onia-seguridad-dm
```

---

## Qué NO decir

- No prometer "sistema 100% seguro" — ningún sistema lo es. La checklist cierra 10 puntos
  concretos, no es un certificado.
- No nombrar competidores ni empresas específicas.
- No mencionar que ONIA tuvo alguna vez estos 10 puntos abiertos. Es cierto (auditoría
  interna 2026-08-09 → cierre 2026-08-11) pero es una nota de trabajo interno — ver la
  memoria citada arriba —, no un dato para el prospecto. Lo que se comunica hacia afuera es
  que están cerrados y se auditan, no el historial.

## Cobertura de este recurso

Los 10 puntos y su estado de cierre están verificados contra la memoria del proyecto y contra
`hermes-content/references/video-intake/2026-08-09-10-errores-seguridad-apps-ia.md`. La
redacción en lenguaje de dueño de negocio (sin "rate limiting"/"RLS" sin traducir) es una
adaptación de esta sesión — mismo contenido, mismo orden, lenguaje distinto. No se agregó
ningún punto nuevo ni se quitó ninguno de los 10 originales.
