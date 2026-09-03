# Handoff — carril `supervisor`

Audita a los otros loops: que ninguno cobre por trabajo que no sirve. Rama `claude/supervisor`.
No mergea a `main` (eso es de `onia-cola`) y no arregla carriles ajenos: deja la tarea en el tablero.

**Última vuelta: 2026-09-03 16:29 UTC.**

---

## Objetivo de la vuelta

Auditar a fondo los carriles menos mirados. Elegidos: **`web-venta`** (el de más volumen —
30 vueltas hoy, commitea cada hora) y **`tendencias`** (nunca auditado, el más barato).

**Hecho =** decir si su trabajo sirve o no, con evidencia **medida**, no leída.

## Qué quedó en producción

Nada desplegado — este carril no despliega. Lo que quedó:

- **Comentario medido en `t_68671bc3`** (la tarea bloqueada que le pide a Sergio publicar el
  sitio): el costo de esa decisión **creció 4×** desde que se escribió, y la tarea lo seguía
  contando mal.
- **Veredicto sobre `web-venta`: SIRVE**, y es de los mejores.
- **Veredicto sobre `tendencias`: SIRVE.** Sus fuentes son reales, verificadas en vivo.

## El hallazgo de la vuelta: 8 arreglos del sitio que ningún cliente puede ver

**El sitio de venta no se construye hace 23 h 39 min.** El build que sirve `onia.com.bo` es del
**2026-09-02 16:52 UTC** — `mtime` de `/opt/onia-landing/runtime-next/apps/onia-platform/.next/BUILD_ID`.

Detrás de ese build hay **8 arreglos**, no 2:

| dónde | cuántos | cuáles |
|---|---|---|
| En `main`, después del build | 4 | `36d2576d2` franja blanca en el iPhone más común · `f02486011` la franja bajo el pie · `2dbb3acfd` su test · `74cf65861` el gate del pie que nacía ciego a 12 de 14 hojas |
| En `claude/web-venta`, sin mergear | 4 | `95500f825` voseo/tuteo en la home · `290604873` favicon · `c06eeb73d` tarjeta al compartir · `2dbcedd12` sitemap |

**Probado en vivo, no deducido.** `curl https://onia.com.bo/favicon.ico` → **HTTP 404 con 28.954
bytes de HTML**: el bug que `web-venta` arregló a las 11:56 sigue entero para el cliente. Y
`https://onia.com.bo/sitemap.xml` todavía pide indexar `/terminos`, la página que se declara
`noindex` a sí misma.

**Control diferencial, para no culpar al servidor:** el ICO **idéntico** que ya estaba en el repo
antes del build, `https://onia.com.bo/brand/v2/favicon.ico`, devuelve **200, 3.083 bytes,
`image/x-icon`** — mismo servidor, misma carpeta `public/`, misma extensión. Y
`public/favicon.ico` **no existe en el disco del contenedor**. No es el servidor, no es un CDN,
no es un header: es que el deploy no tiene el archivo.

**Lo que hice con eso.** No abrí tarea nueva: la decisión ya está preguntada desde las 03:50 y
repetirle a Sergio algo ya preguntado es peor que no preguntar. Lo que hice fue **corregir el
precio** en la tarea que ya existe — decía *"hoy hay 2 arreglos más esperando ese mismo deploy"*
y hoy son 8. **Una decisión que subestima su costo 4× es una decisión que se posterga.**

## Los dos veredictos

**`web-venta` SIRVE, y no es un carril que commitea por commitear.** Cada uno de sus 4 arreglos
de hoy trae su test que **falla en rojo antes por el motivo correcto**. Dos cosas que ningún otro
carril hizo:

1. **Ejecutó el checklist de pre-entrega**, que tenía *17 puntos abiertos y CERO ejecutados*.
   Corrió los 17 contra producción y encontró el único fallo binario real.
2. **Se cazó un gate que fallaba abierto**: `compartir.test.ts` sacaba su lista de rutas **del
   sitemap**, así que al sacar `/terminos` del sitemap la página quedaba publicada y sin gate,
   **sin que nada se pusiera en rojo**. Lo reescribió para derivar la cobertura del disco menos
   una lista de exclusiones. Eso es exactamente la clase de defecto que este carril caza.

Y **sus `[x]` son honestos**: el ítem del favicon está marcado *"ARREGLADO EN CÓDIGO, con gate.
Falta el deploy"*, y el commit cierra diciendo *"No está en producción… Es el cuarto arreglo
esperando ese mismo deploy"*. **No hay `[x]` falso que desmarcar.**

**`tendencias` SIRVE.** Su único commit no mergeado (`d3dec5004`) es una receta de gancho con
`Library ID` concretos de la Biblioteca de Anuncios de Meta. **Verificado en vivo, no leído**:
abrí `?id=1449643883671583` con el chromium que el propio documento nombra y el DOM trae
`Sinergya` 14 veces y la primera línea `TODAVÍA MANEJAS … INVENTARIO, CONTABILIDAD` tal cual la
cita. El comando de reproducción que documenta **funciona**. Además separa explícitamente *"lo
que dice la fuente"* de *"lo que infiero yo, y es inferencia"*, y escribe qué **no** pudo ver
(la Biblioteca no publica impresiones ni CTR de anuncios comerciales) en vez de rellenarlo.

## Archivos

- `hermes-content/docs/handoff/supervisor.md` (este)
- Comentario en `t_68671bc3` del tablero (no toqué su estado: no la reclamé)

## Intentos fallidos — lo que NO era

1. **"`web-venta` acumula trabajo sin publicar, eso es basura."** Falso, y era la trampa de la
   vuelta. Es lo contrario: el carril **avisó** (bloqueó la tarea a las 03:50), **etiquetó** cada
   arreglo como no-desplegado, y siguió trabajando en vez de plantarse. Marcarlo como falla le
   enseñaría a los loops a dejar de trabajar cuando Sergio no contesta. **El cuello es el deploy,
   no el carril.**
2. **"El favicon da 404 por el servidor o por un CDN."** Descartado con el control diferencial de
   arriba antes de reportar. Sin ese control, el hallazgo habría culpado a la infra.
3. **Elegí `web-venta`, que este handoff decía "ya auditado", en vez de `tendencias`, que
   recomendaba.** Salió bien —el hallazgo del deploy es real y nadie lo tenía— pero fue suerte,
   no método: entré por el volumen de commits, no por la lista. **Terminé auditando los dos.**

## Qué depende de Sergio

**Sólo `t_68671bc3`, que ya estaba preguntada** — publicar o no `onia.com.bo`. No se abrió nada
nuevo ni se anotó nada en el radar. Lo único que cambió es que ahora la tarea dice el precio
real: **8 arreglos parados, 23 h 39 min sin publicar.**

## Próximos pasos

1. **No re-auditar `web-venta` ni `tendencias`** hasta que `t_68671bc3` se resuelva. Para
   `web-venta`, listo = `curl -s -o /dev/null -w '%{http_code}\n' https://onia.com.bo/favicon.ico`
   devuelve `200`. **Ese comando es el termómetro del deploy**: mientras dé 404, todo lo que
   commitee ese carril sigue sin llegar al cliente.
2. Auditar el siguiente nunca mirado. **Ya auditados:** `web-venta`, `chatbot`, `lucia`,
   `onia-cola`, `recorrido-cliente`, `calidad-generado`, `tendencias`. **Nunca auditados:
   `web-factory-dev`, `marca-personal`, `canario-visual`, `investigacion`, `docs-auditoria`.**
   `docs-auditoria` es el más valioso de los que quedan: su trabajo es el más parecido al mío
   (que lo escrito sea cierto), así que si produce basura, la produce sobre la verdad del repo.
3. Sigue abierto de dos handoffs atrás: la rama de `kpis-semanal` (`claude/marca-personal-loop`)
   no figura en `loops.md`. Listo = saber si debe estar en la tabla.
4. Del handoff anterior, **cerrado**: `t_ea19e42c` (los 3 archivos de calidad de Lucía) figura
   `done` en el tablero.
5. Ninguna tarea `ready` del tablero era de esta zona (`t_8baa5891`, `t_13eaa0ae` son pruebas;
   `t_ad2df41f` es de `tendencias` y está reclamada): no se reclamaron a propósito.

---

## Chequeo de arranque — 2026-09-03 16:29 UTC

**Los 15 loops con línea en `crontab -l` corrieron, y ninguno quedó atrás de su cadencia.**
Verificado en los dos pasos: registro (`crontab -l`) **y** ejecución (última línea `ARRANCA` de
`/var/log/onia-loop-<id>.log`). Nada que rearmar, nada que avisar.
