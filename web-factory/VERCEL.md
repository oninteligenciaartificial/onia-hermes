# Vercel — por qué el auto-deploy está apagado

> Doc vivo, sin fecha en el nombre: se EDITA, no se duplica.
> Decisión de Sergio el **2026-09-01**, sobre una medición en vivo.

## Qué pasaba

Hay **dos proyectos de Vercel enganchados a este repo**: `nuvia-store`
(`prj_3elgZZ8u6yduq8uzZ0x6kKY9Qs74`) y `onia-center`
(`prj_l3aDcm5YHVAy1oMgge4JrVZHjGTo`), los dos en la cuenta hobby
`oninteligenciaartificial-8139s-projects`.

Cada push de **cualquier rama** disparaba un preview **en los dos**. Y en este repo
pushean **cinco loops** todo el día. Resultado, medido:

```
Vercel – nuvia-store   fail   Deployment rate limited — retry in 24 hours.
Vercel – onia-center   fail   Deployment rate limited — retry in 24 hours.
  api-deployments-free-per-day: more than 100
```

El último deploy de `nuvia-store` lo disparó un commit de la rama
`claude/ads-creatividades-publicos` — o sea un loop, no una persona.

**El costo real eran dos cosas:** los correos de Vercel que Sergio pedía cortar
(*"no me deja de llegar mails de vercel, ya no usamos vercel"*), y **dos checks en rojo
permanente en cada PR** — que es lo que hace que nadie mire el CI.

## Por qué se podía apagar sin perder nada

Medido el 2026-09-01:

- **Ninguno de los dos sirve un dominio propio.** Sólo URLs `.vercel.app`. `nuvia-store`
  figura además como `live: false`.
- **`onia-center` está abandonado** — Sergio, 31-ago: *"iba a ser el panel para manejar
  todo pero quedo abandonado"*. Sus routers de traefik se sacaron el 29-ago.
- La plataforma **no la sirve Vercel**: `app.onia.com.bo` y `onia.com.bo` los sirve el VPS.

## Cómo se apagó

Un `vercel.json` con `git.deploymentEnabled: false`. Está en **tres lugares** a propósito:
la raíz del repo, `web-factory/` y `web-factory/apps/site/`. Vercel lee ese archivo desde
el **Root Directory** de cada proyecto, y ese ajuste vive en el panel de Vercel, no acá —
así que se cubrieron los tres candidatos. Un `vercel.json` en una carpeta desde la que no
buildea nadie es inofensivo.

## Cómo se vuelve a encender

Borrar el `vercel.json` de la carpeta que corresponda, o cambiarlo a
`"deploymentEnabled": { "main": true }` si sólo se quiere producción y no los previews de
cada rama.

⚠️ **Si algún día un proyecto de Vercel tiene que volver a desplegar desde este repo**,
acordate de esto antes de perder una tarde: el problema no era el build, era **el volumen**.
Con cinco loops pusheando, cualquier proyecto enganchado a todas las ramas agota una cuenta
hobby en horas.
