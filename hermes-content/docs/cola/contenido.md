# Cola — marketing de ONIA (Lucía, @oniahq, marca personal)

> **Alcance ampliado (Sergio, 2026-08-31):** *"aquí manejaremos higgsfield, o sea el marketing de la
> empresa, onia, cuenta personal y lucia"*. Esta sesión es el carril de marketing de las **tres**
> cuentas, no sólo el de Lucía.

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

- [x] Elegir cuál render se sube en las 3 piezas con DOS versiones: **gana el lote verde del 28-ago** — `hermes-content/references/modelos/lucia/posts-20260807/FIJADO`, `L6` y `L08`. Las dos sesiones llegaron a lo mismo por separado: mirando la portada, la del 28-ago usa sans pesada con bloque de resaltado y «DESLIZÁ →», y la del 22-ago serif itálica fina — el tratamiento que Sergio objetó con «se ve muy pequeño el texto». Las superadas llevan `hermes-content/references/modelos/lucia/posts-20260807/render-fijado/_NO-SUBIR.md` y los punteros del handoff quedaron corregidos · 31-ago
- [x] **Marca personal → comunidad.** STACK pasa de `pdf` sin URL al link de la comunidad y los 8 placeholders quedaron reemplazados en `hermes-content/docs/ONIA_SERGIO_DM_PALABRAS.md`. Ver `scripts/recompensas.json` · 31-ago
- [x] **Reescrito 31-ago.** S05 y S06 ya prometen la comunidad y no «la lista con los links». El gate dejo de marcar `promesa-distinta`; queda solo `palabra-apagada`, que es de Sergio (cargar STACK en el mapa de n8n, 30 s). Ver `hermes-content/references/marca-personal-sergio/briefs/S06-equipo-que-no-cobra.json` · Claude
- [ ] Declarar la etiqueta de IA en la cuenta antes del primer post — hoy es una instrucción pendiente, no una verificación: `hermes-content/contenido/LUCIA.md` · 5 min · Sergio
- [ ] Publicar el día 0 (post fijado) A MANO desde el teléfono, porque Postiz da 502. Son las 7 láminas de `hermes-content/references/modelos/lucia/posts-20260807/FIJADO` (NO la carpeta `hermes-content/references/modelos/lucia/posts-20260807/render-fijado`, que quedó superada) · 15 min · Sergio
- [ ] Publicar el día 1 (reel de lanzamiento v7, 22 s, 1080×1920): `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4` · 10 min · Sergio

- [x] **Escrito 31-ago.** Caption del reel del día 1, con el porqué de cada decisión y los 3 pasos previos: `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/CAPTION.md`. Sale del guion real del reel (`hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/TABLA-DE-CORTES.md`), abre con «No soy real» como el primer beat y cierra con «Seguime» como el último. No lleva palabra clave · Claude
- [ ] Re-renderizar los 3 creativos de ads: estampan **@oniaagency** y el renderer vigente estampa **@oniahq**. Un anuncio que manda a un handle equivocado es plata tirada. Ver `hermes-content/carousels/out/ads/ad-a2-v1-no-volvieron` · 5 min · Claude
- [ ] Marcar como NO-SUBIR el render superado de S06: existe en DOS versiones con md5 distinto y en el carril de Sergio ningún doc lo dice. Mismo error de doble render que ya se pagó en Lucía. Ver `hermes-content/references/marca-personal-sergio/render` · 10 min · Claude
- [ ] Sacarle los CTA a `hermes-content/carousels/briefs` o marcarlo muerto: tiene **cinco palabras fantasma** (MITO, AUTO, COSTO, NUVIA y un LISTA que promete el PDF enterrado), ninguna registrada. El carril vivo de @oniahq es `hermes-content/references/oniahq/briefs`, que está limpio · 15 min · Claude

## Despues

- [ ] 🔴 MITO es una palabra fantasma: `hermes-content/carousels/briefs/onia-mitos-ia-20260808.json` pide «comenta MITO» en el caption y MITO no está en `scripts/recompensas.json`. Si esa pieza sale, el lead comenta y no recibe nada — es exacto el incidente RANKING del 26-ago. Registrarla o sacarle el CTA.

- [ ] Días 2 a 6 del calendario, uno por día: L09 → L6 → L10 → L08 → L11. El orden vive en el handoff del carril.
- [ ] Corregir el calendario: la fila 6 dice «🔴 FALTA» para pilar B y **L11 ya existe** renderizada.
- [ ] Las 4 historias H09-H12 no tienen hoja de contacto; las otras 8 sí.
- [ ] Cargar FACTURA en el mapa de palabras del workflow de n8n (bloque escrito, sin aplicar).
- [ ] La bio de Lucía dice «👇» y no apunta a nada.
- [ ] Terminar la tanda del look nuevo (8 imágenes, Bs 6,00) — decidido en `LUCIA.md` §3-ter, **después** de publicar.

## Bloqueado

- **El PDF de SISTEMA queda DESCARTADO** (Sergio, 31-ago). No se publica ningún PDF: la recompensa pasa a ser un link. Eso desactiva de paso el bloqueo de los días 3 y 4.
- 🔴 **META ADS — el conector apunta a la identidad equivocada.** Verificado hoy: esta sesión ve DOS cuentas publicitarias y **ninguna es de ONIA** — `NUVO 1usd` (negocio ajeno) y `Arthur Fuentes` (personal, de alguien que ya no colabora). La cuenta de ONIA responde «no tenés acceso». Es el bloqueo raíz: sin eso no se puede ni leer el estado. Ver `hermes-content/docs/cola/contenido.md` · Sergio
- 🔴 **Reloj al 5-sep:** el `stop_time` de la campaña y el token de usuario vencen **el mismo día**. Quedan 5.
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

**Loop de fondo** (:13 y :43): una vuelta chica, **un solo ítem**, evidencia
real, commit con rutas explícitas. Los loops anteriores murieron por pedir «una tarea completa»
por vuelta — tarea grande, turno largo, y el cron siguiente nunca dispara porque sólo corre con
el REPL ocioso. **El turno corto ES el mecanismo.**

**Abanico cuando Sergio está**: subagentes en paralelo, para lotes probados e independientes.

**Lo que el loop persigue además de la cola** (Sergio, 31-ago): *"perfecciones tu técnica en higgsfield y ver de postear en meta ads para agarrar público"*. Cada vuelta que sobre tiempo va a una de esas dos, y lo aprendido se escribe en `hermes-content/references/modelos/lucia/TECNICA-HIGGSFIELD.md` — no en un doc nuevo al lado.
