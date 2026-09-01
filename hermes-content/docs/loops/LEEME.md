# Loops de este carril — listos para desplegar al VPS

**Por qué viven acá y no directamente en el VPS.** El 01-sep Sergio pidió meter los loops al VPS.
Al ir a hacerlo apareció `/root/bin/loops/` **creado 15 minutos antes por otra sesión**
(`canario-visual.md`, `chatbot-cola.md` — las rutinas de su captura). La regla del repo es
explícita: *«Infra (VPS, n8n, Supabase) = UN dueño a la vez»*, y ese mismo día el choque entre
las dos sesiones ya produjo un commit cuyo mensaje no describía su diff.

**Entonces:** el prompt se versiona acá, y lo despliega **quien tenga el VPS**, copiándolo a
`/root/bin/loops/` con su runner y su entrada de cron. Así no hay dos manos en el mismo árbol.

## Qué se puede y qué NO se puede mover al VPS

| Trabajo | ¿Va al VPS? | Por qué |
|---|---|---|
| Carruseles, gates, briefs, verificación de renders | ✅ **Sí** | Sólo necesita repo + node + git, y los tres ya están ahí |
| **Higgsfield (imágenes y video de Lucía)** | 🔴 **NO** | El VPS **no tiene navegador instalado**, y la cuenta se opera sólo por navegador con la sesión de Sergio. Loguearla desde una IP de datacenter mientras él la usa desde casa es pedir un bloqueo por acceso sospechoso — y la cuenta **ya tiene un cobro fallido** encima |
| **Meta Ads** | 🔴 **NO** | El conector entra con otra identidad y la cuenta no tiene método de pago. No hay nada que automatizar hasta que eso se arregle |

**El trabajo de Higgsfield se queda en la sesión con el Chrome de Sergio.** No es una limitación
que se resuelva con más esfuerzo: es dónde vive la sesión del navegador.
