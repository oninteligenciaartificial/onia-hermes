# Cola — carril contenido (Lucía, @oniahq, marca personal)

> **Objetivo único (Sergio, 2026-08-30):** pasar de **0 posts a un feed vivo publicando lo que
> YA existe**. No se produce nada nuevo hasta que haya algo publicado.
>
> **Hecho =** se abre el perfil de Instagram y se ven los posts. No es un commit, no es un
> render, no es un doc. Es una pantalla que un desconocido puede ver.

**La regla de esta cola** (Sergio, 2026-08-30): *nada entra a «Ahora» sin evidencia de que
existe.* En otra sesión, **4 de 6 pendientes resultaron fantasma**. Acá cada ítem nombra una
ruta real entre backticks, y `node scripts/verificar_cola.js hermes-content/docs/cola/contenido.md`
falla si esa ruta no está.

---

## El estado real, medido el 2026-08-30

**No falta producción.** De las 25 piezas de carrusel de las tres cuentas, **las 25 tienen su
render en disco**, y las láminas del render coinciden una a una con los slides del brief. Cero
faltantes. Lo que falta es **publicar**.

| Cuenta | Listo y verificado | Publicado |
|---|---|---|
| Lucía | 6 carruseles (42 láminas 1080×1350) + 12 historias + reel v7 | **0** |
| @oniahq | 9–10 carruseles + 2 reels | — |
| Marca personal Sergio | 6–8 carruseles | — |

---

## Ahora

- [x] **Resuelto 31-ago: se publican las carpetas de nombre pelado** (`FIJADO`, `L6`, `L08`), no las `render-*`. Comparadas mirando la portada: `hermes-content/references/modelos/lucia/posts-20260807/FIJADO/slide-01.jpg` usa sans pesada con bloque de resaltado y «DESLIZÁ →»; `render-fijado/slide-01.jpg` usa serif itálica fina, que es el tratamiento que Sergio objetó con «se ve muy pequeño el texto». Falta la hoja de contacto de las pelado — se regenera, no es motivo para publicar la peor tipografía · Claude
- [ ] Reapuntar las palabras clave a LINKS en vez de PDFs (Sergio, 31-ago: «lo del pdf quitalo»): marca personal → link a la comunidad, Lucía y Onia → link de @oniahq. Toca `scripts/recompensas.json` y los `comment_reward` de los briefs, que el gate compara entre sí · 30 min · Claude
- [ ] Declarar la etiqueta de IA en la cuenta antes del primer post — hoy es una instrucción pendiente, no una verificación: `hermes-content/contenido/LUCIA.md` · 5 min · Sergio
- [ ] Publicar el día 0 (post fijado) A MANO desde el teléfono, porque Postiz da 502: `hermes-content/references/modelos/lucia/posts-20260807/render-fijado` · 15 min · Sergio
- [ ] Publicar el día 1 (reel de lanzamiento v7, 22 s, 1080×1920): `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4` · 10 min · Sergio

## Despues

- [ ] Días 2 a 6 del calendario, uno por día: L09 → L6 → L10 → L08 → L11. El orden vive en el handoff del carril.
- [ ] Corregir el calendario: la fila 6 dice «🔴 FALTA» para pilar B y **L11 ya existe** renderizada.
- [ ] Las 4 historias H09-H12 no tienen hoja de contacto; las otras 8 sí.
- [ ] Cargar FACTURA en el mapa de palabras del workflow de n8n (bloque escrito, sin aplicar).
- [ ] La bio de Lucía dice «👇» y no apunta a nada.
- [ ] Terminar la tanda del look nuevo (8 imágenes, Bs 6,00) — decidido en `LUCIA.md` §3-ter, **después** de publicar.

## Bloqueado

- **El PDF de SISTEMA queda DESCARTADO** (Sergio, 31-ago). No se publica ningún PDF: la recompensa pasa a ser un link. Eso desactiva de paso el bloqueo de los días 3 y 4.
- **Postiz da 502** y no hay `POSTIZ_API_KEY` en el `.env`. Mientras siga caído, **todo se publica a mano.** No es un bloqueo para empezar: es un bloqueo para automatizar.
- **@sergio_urcullo se publica a mano siempre**, tenga o no Postiz: tiene dos avisos de automatización de Meta. El blindaje está en `scripts/postiz_schedule.mjs`.

## Fantasmas — declarados hechos, verificados como falsos

Se dejan escritos para que nadie los vuelva a poner en «Ahora».

- 🔴 **Los 49 PNG renderizados «a salvo en el repo»** — `git ls-files … | grep -c '.png$'` daba **0**. **Resuelto el 30-ago**: 74 láminas respaldadas como JPG y commiteadas.
- 🔴 **El PDF que promete SISTEMA** — `curl https://onia.com.bo/recursos/6-tareas-para-delegar.pdf` → **404**. Existe en disco, no está publicado.
- 🔴 **«@oniahq: cola llena hasta 09-sep»** — Postiz da 502. Esa cola no está publicando nada.
- 🔴 **Los reels RL01 y RL02 «terminados»** — sólo hay `_PREVIEW-360p.mp4` a 360×640. No existe el render final.
- 🔴 **«El OK de Sergio para publicar ya está dado»** — el doc más nuevo lo desmiente.
- 🔴 **«El circuito comentario→DM funciona para las cuatro piezas»** — son **tres** (la cuarta era L07, archivada), y de las palabras sólo **HUMO** verifica de punta a punta (PDF 200, 306.319 B).
- 🔴 **«@oniahq tiene 25 seguidores»** — sin medición detrás. El único número medido es 22, del 16-ago.
- 🔴 **«Etiqueta de IA declarada»** — es una instrucción pendiente, no una verificación.

---

## Cómo se trabaja esta cola

**Loop de fondo** (cron `5d8f50a4`, :13 y :43): una vuelta chica, **un solo ítem**, evidencia
real, commit con rutas explícitas. Los loops anteriores murieron por pedir «una tarea completa»
por vuelta — tarea grande, turno largo, y el cron siguiente nunca dispara porque sólo corre con
el REPL ocioso. **El turno corto ES el mecanismo.**

**Abanico cuando Sergio está**: subagentes en paralelo, para lotes probados e independientes.
