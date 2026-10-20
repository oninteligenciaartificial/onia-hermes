---
name: planificar-orquesta
description: Cargar tareas en la cola de la orquesta de ONIA (issues de GitHub que trabajan Claude y Codex solos, en la nube o en la PC de Sergio Urcullo) y revisar cómo van. Usala en la revisión programada cada 3 horas, cuando Sergio Urcullo te pida que algo «lo haga la orquesta», o cuando un trabajo tuyo necesite investigación, un documento, un guion o un arreglo que vos no podés hacer. No la uses para lo que él tiene que confirmar con un código (eso es pedir-a-claude).
---

# Planificar la orquesta

> Escrita el 2026-10-20. Stack v3 (`scripts/orquesta/README.md`): **vos planificás**, el programa fijo
> `scripts/orquesta/orquesta.mjs` reparte cada tarea a un trabajador (GitHub Actions o la PC), otro
> modelo la revisa con contexto limpio y abre un PR. Los guardarraíles son los de la sección «v2» de
> `hermes-content/docs/research/harness-orquestacion-autonomia.md`, y el comando los hace cumplir.

## 🔴 Lo que no se rompe

1. **Vos nunca declarás algo hecho.** Lo declaran el `check:` y el revisor de la orquesta. Si una tarea
   cerró, decí «la orquesta la cerró» con el link; si no, decí en qué estado está.
2. **Nada sin `check:` ejecutable.** Corre sin sandbox: el comando solo acepta `urls`,
   `cmd npm run <script>`, `cmd npm test` o `cmd node --test <ruta>`. Si no sabés cómo se comprobaría,
   la tarea no está lista: no la cargues.
3. **Publicar, gastar, contactar a alguien, tocar producción o mergear llevan `necesita-ok: si`.** La
   tarea queda esperando hasta que Sergio Urcullo le saque el label. El comando lo fuerza igual si el
   texto lo menciona: no lo rodees cambiando las palabras.
4. **Tope: 10 tareas por día.** Mejor 2 buenas que 10 flojas. Una tarea repetida en 24 h no entra.
5. **Una `bloqueada` es de Sergio Urcullo.** La orquesta ya la intentó dos veces y él decide. No la
   destrabes ni la vuelvas a cargar con otras palabras: el comando ya se la avisó en su resumen.
6. Usá **solo** `/root/bin/onia-orquesta-hermes.sh`. Nunca `curl` directo a GitHub con el token, ni lo
   leas, ni lo muestres: es de la cuenta de Sergio Urcullo.

## Cuándo cargar una tarea

Sí, si se cumplen las tres:
- sirve a la **etapa vigente** del negocio (`hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md`); si no
  le sirve, va al radar, no a la cola;
- es **concreta y comprobable**: un archivo de salida, un enlace que abre, una prueba que pasa;
- **no está ya** en la cola (mirá `--revisar` antes) ni la está haciendo otra sesión (handoffs).

De dónde salen: lo que Sergio Urcullo te pidió por Telegram, el «Próximos pasos» de
`hermes-content/docs/handoff/<carril>.md`, y el paso siguiente de una tarea que la orquesta cerró.

No cargues: lo que necesita su código de confirmación (skill `pedir-a-claude`), lo que es solo
anotar una idea (tablero), ni el portal del SIAT.

## Formato

Una tarea por llamada, por la **entrada estándar**, copiando el cierre `FIN_TAREA_ONIA_4b9e` tal cual
y entre comillas (así ningún `$`, comilla ni renglón del texto pasa por la shell; como argumento sale 64):

    /root/bin/onia-orquesta-hermes.sh --crear <<'FIN_TAREA_ONIA_4b9e'
    titulo: Precios de hoy de Dentalink, Doctocliq y TuDoc
    carril: investigacion
    nivel: normal
    donde: nube
    check: urls
    necesita-ok: no

    Buscar los precios públicos de hoy de los tres, con el enlace a cada fuente.
    Hecho cuando: cada precio trae su enlace y el enlace abre.
    FIN_TAREA_ONIA_4b9e

| Campo | Valores | Cómo elegir |
|---|---|---|
| `carril` | `plataforma` · `marca` · `comunidad` · `video` · `investigacion` | el área del trabajo |
| `nivel` | `rapido` · `normal` · `profundo` | elige el modelo: `rapido` para contar o resumir, `normal` casi siempre, `profundo` solo si equivocarse es caro |
| `donde` | `nube` · `pc` | `pc` solo si necesita sus logins o sus archivos (video, Meta, Instagram, Higgsfield, Buffer); el resto, `nube` |
| `check` | `urls` · `cmd npm run <script>` · `cmd npm test` · `cmd node --test <ruta>` | `urls` para investigación; un test para código |
| `necesita-ok` | `si` · `no` | `si` ante cualquier duda de la regla 3 |
| opcionales | `salida: <ruta>` · `base: <rama>` · `ok: sergio` | `ok: sergio` = al terminar espera que él mire la entrega |

Después de una línea en blanco, **qué hay que hacer** y una línea **`Hecho cuando:`** con cómo se
comprueba. Escribilo para un trabajador que no sabe nada de la conversación: qué, dónde, para qué.

Salidas: 0 cargada (te da el número y el link) · 65 la tarea está mal (el mensaje dice qué falta:
corregila) · 69 sin token o sin labels (no insistas: decíselo a Sergio Urcullo) · 75 tope del día,
repetida u otra carga en curso · 1 «NO se cargó» (se puede reintentar) o «Puede haberse cargado»
(**no** la reintentes: mirá `--revisar`).

## La revisión de cada 3 horas

1. `/root/bin/onia-orquesta-hermes.sh --revisar` → tus tareas con su estado (`en cola`, `en curso`,
   `espera su ok para empezar`, `espera su ok de la entrega`, `bloqueada`, `hecha`, `cerrada sin hacer`).
   Las bloqueadas nuevas ya le quedan avisadas a él.
2. Por cada **hecha** desde la última vez: ¿hay un paso siguiente claro? Cargalo (con su propio
   `Hecho cuando`). Si no, nada.
3. Por cada tarea tuya **en cola** que ya no sirve (el plan cambió, otra sesión la hizo, quedó
   vieja): cerrala sin hacer, con el motivo por la entrada estándar:

       /root/bin/onia-orquesta-hermes.sh --cerrar <número> <<'FIN_TAREA_ONIA_4b9e'
       el motivo, en una línea
       FIN_TAREA_ONIA_4b9e

   Solo cierra lo tuyo (`origen:hermes`) que no empezó; lo que está `en curso`, `bloqueada` o
   esperando su ok no se toca.
4. Terminá con una línea de qué hiciste. Si no hiciste nada, respondé solo `[SILENT]`.

A Sergio Urcullo no le escribas por esto: cada tarea cargada, cerrada o bloqueada ya le llega en su
resumen de las 06:30 o el cierre de las 21:30. Si te pregunta «¿cómo va la orquesta?», `--revisar` y
le pasás las líneas que importan, con su link.
