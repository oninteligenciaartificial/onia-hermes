# Handoff — docs-auditoria

Carril docs/infra. Corre solo por cron en el VPS (`18 1,5,9,13,17,21` UTC, 6×/día), worktree
`/root/loops/onia-hermes-docs`, rama `claude/docs-auditoria`. Este archivo es el estado **actual**
del carril: se sobrescribe cada vez, no se acumula.

**Objetivo**
Que lo escrito sea cierto: una afirmación falsa menos en el repo por vuelta, con la evidencia de
por qué era falsa. **Hecho** = corregida en su propio archivo, con la medición que lo prueba en el
commit. Cumplido en la vuelta del 2026-09-02 13:18 UTC (**Foco C**, rotado: las cinco vueltas
anteriores habían sido Foco A).

**Qué quedó EN PRODUCCIÓN**

- `0fe1c17f` en `claude/docs-auditoria`, pusheado. **Todavía NO está en `main`** — lo mergea
  `onia-cola`, no este carril.
- El radar tenía **dos secciones `## 16.`**: la del deploy (*"Treinta y un commits… NINGUNO está
  desplegado"*, creada en `d1826f48` el 08-31 23:09, **abierta**) y la de *"`/` y `/empezar` no
  tienen dueño"* (creada después en `84ad6628`, ya resuelta). **Las dos tenían una opción `(a)`**,
  y hay tres citas de *"punto 16(a)"* / *"la §16"* dentro del propio radar: cada una resolvía a
  dos cosas distintas según cuál leyeras — el deploy del motor del bot, o "que `onia-cola` adopte
  la home". Renumerada la segunda a **24**; las dos referencias de `COLA.md` actualizadas.
  Verificado: `grep -oE "^## [0-9]+\." … | sort | uniq -d` no devuelve nada.
- Radar **§25** nuevo, con 4 opciones cotizadas (ver *"Qué depende de Sergio"*).

**Qué quedó a medias, y dónde**
Nada a medias de esta vuelta. Lo que queda vivo es la causa de fondo, ahora medida y cotizada en
el radar §25: **ningún carril sincroniza su worktree con `main` antes de trabajar.**

**Archivos y cambios**
- `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` — §16 duplicada renumerada a §24 con la
  nota de por qué queda fuera de secuencia; §25 nuevo.
- `hermes-content/docs/COLA.md` — las dos referencias que apuntaban a la §16 renumerada
  (*"§16."* y *"ver radar §16"*).
- Este handoff — **corregidas cuatro referencias a "radar ítem 18" que eran falsas.** El ítem del
  corredor es el **§22**; el §18 del radar es una decisión sin relación (los 6 screenshots de la
  home). Una sesión que siguiera el puntero aterrizaba en la decisión equivocada. Es el mismo
  defecto que esta vuelta arregló en el radar: **cruce por número que se pudre solo.**

**Intentos fallidos**
- 🔴 **Casi corrijo algo ya corregido, y la causa vale más que el hallazgo.** El carril arrancó en
  `HEAD 8a83eea7` con **96 commits de `origin/main` sin ver**
  (`git rev-list --count HEAD..origin/main` = 96). Con esa copia vieja encontré *"Nadie es dueño
  de `/` ni de `/empezar`"* como bloqueo abierto, verifiqué en vivo que estaba **vencido**
  (`web-venta` es el dueño, corre 5×/día, commitea en `web-factory/apps/onia-platform/`) y estuve
  por escribir la corrección. En `origin/main` esa sección decía `RESUELTO` hacía horas. **Se
  salvó porque comparé contra `origin/main` antes de editar, no por método.**
  **Para la próxima vuelta: `git fetch` + `git rev-list --count HEAD..origin/main` ANTES de leer
  un solo doc.** Un carril que audita una foto vieja audita ficción.
- **Hipótesis descartada:** que el bloqueo de *"`/` y `/empezar` sin dueño"* siguiera vivo porque
  el radar ofrecía dos opciones y ninguna se había ejecutado. Cierto pero irrelevante: se resolvió
  por una **tercera** vía que el ítem no contemplaba (un carril nuevo, `web-venta`). Y la opción
  (b) que el ítem ofrecía ya era imposible — `web-factory-dev-loop` está en la tabla *"Apagados a
  propósito"* de `loops.md`. **Un ítem puede estar vencido aunque ninguna de sus opciones se haya
  elegido.**
- **No se tocó `/root/bin/onia-loop.sh`** para agregarle el sync, aunque es el arreglo obvio:
  cambia el comportamiento de los 7 carriles a la vez y este carril tiene prohibido tocar otro
  carril. Cotizado en el radar §25 en vez de hecho de prepo.

**Qué depende de Sergio**
- **Radar §25** (nuevo) — que los carriles sincronicen con `main` al arrancar. Cuatro opciones,
  todas Bs 0: **(a)** `git merge --ff-only origin/main` al arrancar + aviso si no es
  fast-forward — *recomendada*, no puede abrir un conflicto; **(b)** sólo `fetch` + avisar la
  distancia; **(c)** que lo haga cada prompt (toca 7 archivos, se desincroniza igual);
  **(d)** nada.
- **Radar §22** (ojo: **no** §18, como decía este handoff hasta hoy) — cómo blindar que un loop
  muerto avise, y que el corredor del VPS no diverja del repo. Sigue abierto.

**Próximos pasos**
1. Que `onia-cola` mergee `0fe1c17f` a `main`. **Listo** = `git log origin/main` lo muestra.
2. **Arrancar la próxima vuelta con `git fetch` y medir la distancia a `origin/main` antes de
   leer nada.** Es el paso que esta vuelta hizo por casualidad y salvó el trabajo.
3. Rotar a **Foco B** (trabajo pisado) o **Foco A** (docs falsos) — esta vuelta fue Foco C.
4. Chequeo de arranque de esta vuelta: las 7 filas `VPS` de `loops.md` estaban todas en
   `crontab -l`. Nada que rearmar.
