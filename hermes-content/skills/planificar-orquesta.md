---
name: planificar-orquesta
description: Cargar en la cola de la orquesta de ONIA (issues de GitHub que trabajan Claude y Codex solos, en la nube o en la PC de Sergio Urcullo) la tarea que Sergio Urcullo te dicta por Telegram, y contarle cómo va cuando te lo pregunta. Usala solo cuando él te pida que algo «lo haga la orquesta» o pregunte por una tarea. No planifiques ni cargues nada por tu cuenta (eso lo hace el Hermes de su PC), ni la uses para lo que él tiene que confirmar con un código (eso es pedir-a-claude).
---

# Cargar en la orquesta lo que Sergio Urcullo te dicta

> Escrita el 2026-10-20 y cambiada el 2026-10-26. Stack v3 (`scripts/orquesta/README.md`): el programa
> fijo `scripts/orquesta/orquesta.mjs` reparte cada tarea a un trabajador (GitHub Actions o la PC), otro
> modelo la revisa con contexto limpio y abre un PR. Los guardarraíles son los de la sección «v2» de
> `hermes-content/docs/research/harness-orquestacion-autonomia.md`, y el comando los hace cumplir.
>
> **Desde el 26-oct no planificás vos** (`AGENTS.md` §1): planifica el Hermes de la PC de Sergio Urcullo.
> Vos cargás una tarea solo cuando él te la dicta, y la revisión de cada 3 horas que hacías quedó en pausa.

## 🔴 Lo que no se rompe

1. **Vos nunca declarás algo hecho.** Lo declaran el `check:` y el revisor de la orquesta. Si una tarea
   cerró, decí «la orquesta la cerró» con el link; si no, decí en qué estado está.
2. **Nada sin `check:` ejecutable.** Corre sin sandbox: el comando solo acepta `urls`,
   `cmd npm run test:<x>`, `cmd npm test` o `cmd node --test <ruta>`, sin opciones. Si no sabés cómo se
   comprobaría, la tarea no está lista: no la cargues.
3. **Publicar, gastar, contactar a alguien, tocar producción o mergear llevan `necesita-ok: si`.** La
   tarea queda esperando hasta que Sergio Urcullo le saque el label. El comando lo fuerza igual si el
   texto lo menciona: no lo rodees cambiando las palabras. **También lo fuerza a todo lo que corre en
   la PC (`donde: pc`) y a todo `check: cmd`**: lo único que arranca solo es `nube` + `check: urls`.
   Escribí en texto común: un caracter invisible o de otro alfabeto hace que el comando no la cargue.
4. **Tope: 10 tareas por día.** Mejor 2 buenas que 10 flojas. Una tarea repetida en 24 h no entra.
5. **Una `bloqueada` es de Sergio Urcullo.** La orquesta ya la intentó dos veces y él decide. No la
   destrabes ni la vuelvas a cargar con otras palabras: el comando ya se la avisó en su resumen.
6. Usá **solo** `/root/bin/onia-orquesta-hermes.sh`. Nunca `curl` directo a GitHub con el token, ni lo
   leas, ni lo muestres: es de la cuenta de Sergio Urcullo.

## Cuándo cargar una tarea

**Solo cuando Sergio Urcullo te la dicta** por Telegram. Nunca la saques vos del «Próximos pasos» de un
handoff, del paso siguiente de una tarea cerrada ni de una idea tuya: eso lo planifica el Hermes de su PC,
y dos que planifican llenan la cola dos veces. Antes de cargarla, mirá que:
- sea **concreta y comprobable**: un archivo de salida, un enlace que abre, una prueba que pasa. Si no
  sabés cómo se comprobaría, preguntale a él en una línea en vez de inventar el `Hecho cuando`;
- **no esté ya** en la cola (`--revisar`). Si está, decíselo con el link y no la cargues otra vez.

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
| `donde` | `nube` · `pc` | `pc` solo si necesita sus logins o sus archivos (video, Meta, Instagram, Higgsfield, Buffer); el resto, `nube`. `pc` siempre espera su ok |
| `check` | `urls` · `cmd npm run test:<x>` · `cmd npm test` · `cmd node --test <ruta>` | `urls` para investigación; un test para código (espera su ok) |
| `necesita-ok` | `si` · `no` | `si` ante cualquier duda de la regla 3 |
| opcionales | `salida: hermes-content/docs/…` · `base: <rama>` · `ok: sergio` | sin `salida` va la carpeta del carril; `ok: sergio` = al terminar espera que él mire la entrega |

Después de una línea en blanco, **qué hay que hacer** y una línea **`Hecho cuando:`** con cómo se
comprueba. Escribilo para un trabajador que no sabe nada de la conversación: qué, dónde, para qué.

Salidas: 0 cargada (te da el número y el link) · 65 la tarea está mal (el mensaje dice qué falta:
corregila) · 69 sin token o sin labels (no insistas: decíselo a Sergio Urcullo) · 75 tope del día,
repetida u otra carga en curso · 1 «NO se cargó» (se puede reintentar) o «Puede haberse cargado»
(**no** la reintentes: mirá `--revisar`).

## Cuando te pregunta cómo va

`/root/bin/onia-orquesta-hermes.sh --revisar` → tus tareas con su estado (`en cola`, `en curso`,
`espera su ok para empezar`, `espera su ok de la entrega`, `bloqueada`, `hecha`, `cerrada sin hacer`).
Le pasás las líneas que importan, con su link. Las bloqueadas nuevas ya le quedan avisadas a él.

Si te pide cerrar una tarea tuya que ya no sirve, cerrala sin hacer, con el motivo por la entrada
estándar:

    /root/bin/onia-orquesta-hermes.sh --cerrar <número> <<'FIN_TAREA_ONIA_4b9e'
    el motivo, en una línea
    FIN_TAREA_ONIA_4b9e

Solo cierra lo tuyo (`origen:hermes`) que no empezó; lo que está `en curso`, `bloqueada` o esperando
su ok no se toca.

**No revisás la cola por tu cuenta.** Hasta el 26-oct un trabajo tuyo la revisaba cada 3 horas y cargaba
una tarea de los handoffs cuando la encontraba vacía; ese trabajo quedó en pausa porque planifica el
Hermes de la PC. Cada tarea cargada, cerrada o bloqueada ya le llega en su resumen de las 06:30 o el
cierre de las 21:30: no le escribas aparte por eso.
