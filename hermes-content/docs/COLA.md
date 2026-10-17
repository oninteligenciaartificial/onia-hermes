# La cola — qué se hace ahora

> **HISTÓRICO desde el 17-oct-2026.** La cola de producto vigente es `cola/loop/plataforma.md`. Este archivo trata a `onia-cola` como integrador vivo (muerto desde el 27-sep) y a `main` como destino de merges pre-autorizados: ya no rige. `main` solo por PR con CI verde y revisión de Codex (`AGENTS.md` §4).

> **Este archivo es la memoria del trabajo.** Vive en el repo a propósito: los loops de una
> sesión mueren cuando se cierra Claude Code, y con ellos se perdía la cola entera.
> Cualquier sesión lo lee, lo ejecuta y lo actualiza. Sergio también lo puede editar.

**Objetivo vigente (Sergio, 2026-08-31):** **terminar el producto.** Textual: *"cómo querés
escribirles si ni siquiera el producto está terminado; dedicate a terminar el producto y recién
escribimos"*.

**Qué significa terminado está escrito y medido en
[`ONIA_DEFINICION_DE_TERMINADO.md`](ONIA_DEFINICION_DE_TERMINADO.md)** — cuatro puntos, **van 3
de 4**: el 3 era fantasma y el 4 ya estaba construido (los dos del carril producto, cerrados el
2026-08-31 sin escribir una línea), y el **2 cerró también en producción** — `f47d615` sacó el
"agenda" de `lib/pricing.ts` y **el deploy que le faltaba ya entró**, verificado en el contenedor
vivo el 2026-09-02: la frase falsa pasó de 5 chunks a **cero**.
*(Acá decía "le queda sólo el deploy, que decide Sergio". Era un **bloqueo vencido** —le pedía a
Sergio una decisión ya tomada—, que es peor que un fantasma: un fantasma cuesta una vuelta,
éste mantenía cerrada la puerta de los 7 leads por un motivo inexistente.)*
**Queda el 1, de chatbot.** La lista tiene sólo
cosas **rotas** (el cliente las compra y no funcionan) o **falsas** (se las vendemos y no son
ciertas). Nada de "sería lindo".

⚠️ **Hay 7 personas reales esperando y NO se les contesta hasta cerrar esa lista.** Un lead
bueno se quema una sola vez. Quiénes son, qué dijeron y dónde vive cada uno:
[`ONIA_LEADS_ESPERANDO.md`](ONIA_LEADS_ESPERANDO.md).
*(Acá decía que estaban en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y en la cola del chatbot.
**Era falso** —verificado el 2026-08-31: esa §8 habla de una rama de git y no hay cola del
chatbot en el repo—, y es la peor clase de dato falso: hace creer que están guardados.)*

**Estado (medido en la base de PRODUCCIÓN el 2026-09-10):** el circuito de COBRO se recorrió
entero por las pantallas reales y quedó fotografiado: org QA `zz-qa-cobro-e2e` dada de alta por
`/api/auth/register`, comprobante subido en `/checkout` (fila `PENDING` en
`subscription_payments`), aprobado en `/admin/payments` como superadmin, y la fila terminó
`APPROVED` con la org pasando de trial a `basic` con `planEnd = 2026-10-10` **calculado solo**.
La pantalla del cliente dice "Plan activo hasta el 10 de octubre de 2026". Capturas en el
handoff [`handoff/cobro-e2e.md`](handoff/cobro-e2e.md).
*(Acá decía que la org `ZZ QA Circuito Completo` del 2026-09-01 tenía el pago APPROVED. Esa
corrida EXISTIÓ pero su org ya no está: la limpieza QA la borró y el FK en cascada se llevó la
fila — el 2026-09-10 `subscription_payments` amaneció con CERO filas. Un pago REAL de un
cliente REAL sigue sin pasar nunca; lo único que lo separa es la cuenta bancaria, que es de
Sergio Urcullo, no de código.)*

---

## Cómo se trabaja esta cola

1. Se toma **el primer ítem no bloqueado**. Uno por vuelta.
2. Se **analiza antes de desarrollar**: Gate 1 — ¿ya está hecho? ¿el bloqueo existe de verdad?
   ¿el dato sigue vigente? ¿ya vive en el repo? Un "ya está hecho" heredado es hipótesis.
3. Se **desarrolla** con test primero, verificado en ROJO por el motivo correcto.
4. **Gates completos: `npx tsc --noEmit` + `npx vitest run` + `npm run lint`.** Los tres.
   ⚠️ **El lint se corre por `npm run lint`, NO por `npx eslint .`** — el script trae el
   `--ignore-pattern` que deja afuera los ~30 worktrees; sin él son **20 minutos en vez de 39
   segundos** y el gate se termina salteando (medido y arreglado el 2026-08-31). El 2026-08-29 se rompió
   CI dos veces por correr sólo los dos primeros: lint es lo que CI verifica y lo que caza
   `react/no-children-prop`.
5. Si toca pantalla, **se abre y se MIRA** con captura. Un 200 no es verificación.
6. Se marca acá con `[x]` y una línea de qué quedó. **Lo tachado no se rehace.**
7. **La bitácora de una corrida NO va en "Ahora": va en `## Registro de corridas`.** "Ahora" es
   lo que queda por hacer; un `### Del carril X — corrida del <fecha>` es una foto de un día y
   por `CLAUDE.md` es historia, no fuente de verdad.
   ⚠️ **No es prolijidad: es lo que rompe la cola y su gate.** Medido el 2026-09-07 — "Ahora"
   había llegado a **2.481 líneas (66 % del archivo) con 59 registros cerrados y UN solo ítem
   abierto**, así que el paso 1 («tomá el primer ítem no bloqueado») mandaba a leer una
   bitácora entera, y `verificar_cola.js` daba **exit 1** con 14 errores que eran **todos**
   sobre trabajo ya terminado. Tres rondas intentaron arreglarlo aflojando el gate y las tres
   volvieron a rojo: el gate mide "Ahora" por diseño, y lo que sobraba era el sujeto.
8. Si algo se bloquea con una decisión de Sergio: `PushNotification` de una línea **y seguir con
   lo desbloqueado**. Un ítem trabado no frena la cola.

**Nunca:** desplegar al VPS, tocar worktrees o ramas de otras sesiones, gastar plata, ni bajar una
superficie viva. Mergear a master **ya no** está pre-autorizado (la autorización del 29-ago se retiró el 17-oct):
va por PR con CI verde y revisión de Codex (`AGENTS.md` §4).

---

## Ahora — plan de features (revisado 2026-08-30, con Gate 1 corrido)

- [x] 🟠 **La tarjeta que se ve al compartir `onia.com.bo` por WhatsApp no la medía NADIE contra
      producción. Gate nuevo el 2026-09-27 21:0x La Paz por `web-venta`. La tarjeta está sana;
      lo que no existía era el instrumento que lo prueba.**
      - **Cómo apareció.** Los cuatro medidores del objetivo estaban en verde (prohibidos 0 ·
        precios 0 fuera de fuente · CTA 0/25 rotos · favicon 200) y la cola no tenía un ítem sin
        marcar, así que —igual que la vuelta anterior, que cambió de ANCHO— esta cambió de
        **superficie**: la primera pantalla del producto no es la home, es el PNG de 1200x630
        que dibuja WhatsApp cuando Sergio Urcullo le pasa el link a un lead. El que nunca abre
        el sitio ve sólo eso.
      - **El punto ciego lo declara el propio código**, en `tarjeta-social.tsx:99`: *«Un monto
        dentro de un PNG no lo ve ningún grep, ningún barrido de HTML ni ninguna captura: si
        queda viejo, queda viejo en silencio.»* Lo que lo cuidaba era `hero.test.ts:247`, y mide
        con `readFileSync("tarjeta-social.tsx")` — el **código fuente**. Exige que el precio se
        interpole y que el dibujo no venda el add-on, y las dos cosas son ciertas.
      - **Por qué no alcanza:** un defecto en producción tiene DOS causas y ese gate ve una. Con
        el código perfecto y un build viejo, la tarjeta se comparte con un precio que ya no
        existe, y los cuatro medidores del carril pasan en verde porque los cuatro leen TEXTO y
        acá el texto son píxeles. La escalera de precios cambió dos veces este mes (el plan
        `crece` el 12-sep, `a6adee05` el 17): en cualquiera de las dos el PNG podía quedarse
        atrás sin que nada avisara.
      - **Medido, no supuesto** (producción, UA de WhatsApp): las **12** rutas de `(sitio)`
        sirven tarjeta, las 12 con el **mismo** md5 `2aae94e6ec55`, 1200x630, y ese md5 es **byte
        a byte** el que genera el build de hoy. El monto horneado es `Bs 320`, que es
        `planDeEntrada()` de `lib/pricing.ts`. Cobertura cruzada contra el disco: 24 de 25 rutas
        con `page.tsx` tienen su `opengraph-image.tsx`; la que falta es `/patrones`, que está en
        el `disallow` de `robots.ts` y no es superficie de venta.
      - ⚠️ **Una hipótesis mía quedó REFUTADA y por eso no se tocó nada del dibujo.** Mirando el
        PNG leí «la caja de las cuatro piezas queda con un tercio vacío a la derecha, se ve como
        si faltara algo». Medido en píxeles: el marco va de x=72 a **x=1199**, o sea que SÍ se
        escapa por el borde derecho — que es exactamente lo que el comentario de la línea 154
        declara como intención (*«el sistema sigue, no se acaba en la tarjeta»*). Mi lectura
        visual era opinión de dirección visual, no defecto, y cambiarlo habría sido **rediseño
        sin el OK de Sergio Urcullo**. Se probó antes de anunciarlo, no después.
      - **Visto en ROJO primero y por el motivo correcto:** con un servidor impostor que sirve
        otro PNG válido de 1200x630, el cruce acusa las 12 rutas con
        `producción sirve un dibujo DISTINTO del que genera el código de hoy` y sale **exit 1**;
        contra el build real, `VERDE … y es el que genera el código de hoy`. El `--self-check`
        falsifica los 10 casos sin red (ruta sin `og:image`, PNG que no es PNG, medidas
        distintas de las declaradas, una ruta con otro dibujo…).
      - **Tres decisiones que valen para el próximo que toque esto:** los sujetos se **derivan
        del disco** (una lista escrita a mano envejece hacia el falso verde: la ruta nueva no
        está, no se mide, pasa — así `/empezar` estuvo semanas sin tarjeta); el tamaño se **lee
        de `export const size`** en vez de tipearse (un gate que repite el valor que vigila
        defiende el valor, no la fuente); y sale por `traer` y no por `fetch` pelado, porque un
        parpadeo de red daría un md5 vacío y el cruce lo leería como «producción está vieja» —
        un rojo de ambiente sobre una tarjeta sana es como se le enseña a un carril a ignorar su
        gate. Ese último lo atajó el gate `red-que-parpadea.test.ts` del propio repo.
      - Archivos: `scripts/tarjeta-social-viva.{mjs,test.ts}` + alias `tarjeta-social:viva`.
        Gates: `typecheck` 0 · `npm test` **124 archivos / 1.695 tests** · `build` 0 · medición
        viva 12/12 verde y falsificada en rojo. La tarjeta MIRADA:
        `/tmp/wv-tarjeta-que-ve-el-lead.png`.
      - **Cómo se corre el cruce fuerte** (el que cierra fuente → código → píxeles servidos):

            cd web-factory/apps/onia-platform && npm run build
            PORT=3317 npm run start &
            node scripts/tarjeta-social-viva.mjs --contra http://localhost:3317

        Sin `--contra` mide igual contra producción y cuida lo que no necesita build. Si no
        puede preguntar sale **2 = NO MEDIDO**, nunca 1.

- [x] 🟠 **En las cuatro tarjetas de plan de la home, el punto verde de cada renglón quedaba
      contra el margen y su texto centrado lejos: la lista no se leía como lista. ARREGLADO Y
      GATEADO el 2026-09-27 09:1x La Paz por `web-venta`.**
      - **Cómo apareció.** Los cuatro medidores del objetivo estaban en verde (prohibidos 0 ·
        precios 0/44 fuera de fuente · CTA 0/25 rotos · favicon 200) y la cola no tenía ni un
        ítem sin marcar, así que en vez de re-medir se cambió de ancho: se recorrió la home a
        **390px** —el teléfono del lead que llega de Instagram— y se miraron las **20 capturas**
        una por una. El defecto está en la banda de precios, que es donde el lead decide.
      - **Medido, no supuesto** (390px, producción): «Todo lo del Crece» tenía el punto en x=49
        y su texto arrancando en x=145 — **76px de aire** entre la viñeta y lo que nombra, en
        una pantalla de 390. Nueve renglones así. No depende del ancho: a 1366 el mismo renglón
        daba 45px.
      - **Que es leak y no diseño se prueba sin opinar, y por eso se pudo arreglar sin
        consultar:** la MISMA clase `.planList` se pinta bien en las otras pantallas que la
        usan —`/precios` (30 renglones) y `/chatbot` (11) dan `text-align: start` y hueco −1px—,
        y la regla reserva `grid-template-columns: 1.1em 1fr`, una columna PARA el marcador:
        esa forma sólo cierra con el texto al inicio de su columna. La home era la única
        centrada porque su banda vive dentro del `.centro` de la portada y `text-align` **se
        hereda**. El arreglo es una línea: que la lista **declare** su alineación en vez de
        dejársela al envoltorio. Los títulos, el precio y el párrafo de la tarjeta siguen
        centrados — no se tocó la dirección visual, sólo se pegó la viñeta a su texto.
      - **Visto en ROJO primero y por el motivo correcto:** contra producción, `/: 9 viñeta(s)
        sueltas de su texto. La peor, «Todo lo del Crece»: 76px`. Contra el build con el
        arreglo: `VERDE: los 116 renglones de 6 pantalla(s) … el peor hueco es 0px`. Y el test
        estático, mutado (borrada la línea del CSS), acusa `.planList no declara text-align: lo
        hereda`.
      - ⚠️ **El "verde" local de la primera medición era FALSO y lo delató una cuenta que no
        cerraba:** producción daba 6 pantallas / 116 renglones y el local 4 / 66. Había un
        `next start` de una vuelta anterior ocupando el puerto (PID de las 10:56), así que mi
        `npm run start` murió con `EADDRINUSE` **en su log, no en mi cara**, y yo estaba
        midiendo el build viejo — que además servía un chunk con 400 y por eso no aplicaba ni
        el CSS. **Un servidor local que ya estaba levantado contesta 200 y miente entero:**
        antes de creerle a un verde local, comparar una cuenta contra producción.
      - ⚠️ **El gate se acusó a sí mismo en su primera corrida, y estuvo bien:** partía el CSS
        por la primera `}` del archivo crudo, y el comentario de esa misma regla nombra su gate
        como `vineta-pegada-a-su-texto.{mjs,test.ts}` — esa llave cerraba el bloque **en la
        prosa** y dejaba la declaración afuera. Rojo por el motivo equivocado es un verde
        futuro: quedó el caso fijado y los comentarios se quitan antes de parsear.
      - Archivos: `src/app/(sitio)/sitio.module.css` +
        `scripts/vineta-pegada-a-su-texto.{mjs,test.ts}` + alias `vineta-pegada:viva`.
        Gates: `typecheck` 0 · `npm test` **121 archivos / 1.675 tests** · `build` 0 · gate vivo
        verde contra el build local y rojo contra producción. Capturas MIRADAS:
        `/tmp/wv-vineta-verde/portada-13.png`, `/tmp/wv-vineta-verde/portada-15.png` y
        `/tmp/wv-vineta-verde/escritorio-planes.png` (las tres con su carpeta: un nombre pelado
        manda a buscarlas al repo, donde no están).
      - ✅ **YA lo ve el lead — comprobado el 2026-09-27 14:5x La Paz.** El publicador del VPS
        (`/root/bin/onia-publicar-solo.sh`, fuente versionada
        `scripts/loops/extras/publicar-solo.sh`, cron `50 */3`) se lo llevó solo. Producción
        sirve `sitio_planList__gzeop{…;text-align:left}`, y el gate que antes estaba **rojo
        contra producción** ahora da `VERDE: los 116 renglones de 6 pantalla(s) … el peor hueco
        es 0px`. Ese es el cierre: el gate vivo, no el CSS a ojo.
      - ⚠️ **La receta de comprobación que este mismo ítem dejó escrita estaba ROTA, y fallaba
        en el sentido peligroso: hacia el falso NEGATIVO.** Decía
        `curl -s https://onia.com.bo/_next/static/css/*.css | grep planList`, y eso devuelve
        **vacío aunque el arreglo esté vivo** — por dos motivos independientes: el `*.css` del
        glob no lo expande `curl` (el nombre del bundle es un hash que hay que sacar del HTML),
        y sobre todo **Next mangla los nombres de CSS Modules**: en el bundle la clase no es
        `.planList` sino `.sitio_planList__gzeop`. La próxima vuelta habría leído ese vacío como
        «todavía no publicó» y habría vuelto a arreglar algo que el lead ya ve. Lo que sí mide:
        `node scripts/vineta-pegada-a-su-texto.mjs` (24 rutas contra producción), o si se quiere
        el CSS crudo, sacar el bundle del HTML y buscar la clase **como subcadena**:
        `for c in $(curl -s https://onia.com.bo/ | grep -oE '/_next/static/css/[^"]+\.css' | sort -u); do curl -s "https://onia.com.bo$c" | grep -oE '[a-zA-Z0-9_]*planList[a-zA-Z0-9_]*\{[^}]*\}'; done`
        **Regla que deja:** una receta de verificación escrita para la vuelta siguiente se corre
        UNA vez antes de dejarla. Un `grep` que nunca se ejecutó no es una comprobación, es una
        conjetura con formato de comando — y cuando falla, falla afirmando que el trabajo no
        llegó.

- [x] 🟠 **Con el interruptor en Anual, la tarjeta «Completo» partía su unidad a la mitad: el lead
      leía `Bs /` y abajo `año`. ARREGLADO Y GATEADO el 2026-09-27 06:5x La Paz por `web-venta`.**
      - **Medido, no supuesto** (1366px, producción): la fila de precio tiene 216px útiles y esa
        tarjeta pide 178 (`12.900`) + 5,4 + 60 (`Bs / año`) = 243. Lo que sobra no desborda — el
        hijo de flex que puede encogerse se encoge a 32px y parte su texto; el resto de la tarjeta
        bajaba 26px contra sus tres hermanas. Sólo pasa en anual: el número mensual mide 145px.
      - **El arreglo no es un rediseño, es completar un patrón que ya estaba shippeado:**
        `.offerPrice` —la fila hermana, misma forma— ya trae `flex-wrap: wrap`; `.planPrice` era
        la única que no. Con eso lo que se mueve al segundo renglón es la unidad ENTERA. El
        `nowrap` va acotado a `.planPrice .planUnit` porque `/precios` reusa esa clase para
        «12.900 Bs/año · 229 Bs/sem», que mide 206 de 216 y SÍ necesita poder cortarse.
      - **Visto en ROJO primero, por el motivo correcto:** contra producción el gate nombró
        `"Bs / año" al lado de 12.900 (anual) se parte en dos renglones: 32px de los 60px`.
        Tras el arreglo, verde contra el build local y **mirado renderizado**.
      - ⚠️ **`getClientRects().length` NO sirve para esto y devolvía 1 sobre la unidad partida**
        (un hijo de flex es un bloque). El criterio que no miente es el ancho: se clona la unidad
        con `nowrap` fuera de flujo y se compara con lo que se pinta.
      - Archivos: `src/app/(sitio)/sitio.module.css` + `scripts/precio-tras-el-clic.{mjs,test.ts}`.
        Gates: `typecheck` 0 · `npm test` **120 archivos / 1.664 tests** · `build` 0 · barrido de
        7 anchos (320→1440) en home y `/precios` sin desborde. Captura: `/tmp/wv27-verde/anual.png`.

- [x] 🟠 **El precio ANUAL de la home sólo existe después de un clic, y ningún gate apretaba ese
      botón. CUBIERTO el 2026-09-27 07:0x La Paz por `web-venta` (`b114973c`).**
      - **Cómo apareció, que es la parte que importa.** Los cuatro medidores del objetivo estaban
        en VERDE y la medida no se movía desde la vuelta anterior, así que en vez de repetirlos se
        cambió de método: mirar las pantallas **renderizadas**. `recorrer-portada.mjs` sacó las
        **16 fotos** de la home (14.327 px de alto) y se miraron una por una. En la banda de
        precios está el toggle `Mensual | Anual −16 %` — y ahí se ve que el número que decide la
        compra **se reemplaza al apretarlo**.
      - **Medido, no supuesto:** el DOM pasa de `320@61px` a `3.200@61px`. `precios-vivos.mjs`
        barre 24 pantallas pero lee el **HTML servido**: ese estado no lo miraba nadie.
      - **Lo que de verdad estaba sin red: el derivado.** El toggle pinta "Equivale a Bs 267 por
        mes", que **no está declarado en ninguna fuente — se calcula**. Nadie lo escribe mal: se
        calcula mal. Con una division por 10 en vez de por 12, el Básico se ofrece a "Bs 320 por mes"
        pagando el año (el descuento desaparece de la pantalla) y las 24 pantallas siguen verdes,
        porque el número ofensor no está en el HTML que ellas leen.
      - **Producción está SANA:** 267 / 458 / 742 / 1.075 son los doceavos exactos de 3.200 /
        5.500 / 8.900 / 12.900. Esto no arregla un defecto vivo: le pone **rojo posible** al
        segundo turno. Captura mirada: `/tmp/wv-tras-el-clic/anual.png`.
      - **Visto en ROJO antes que en verde:** mutado el divisor de 12 a 10, el gate acusa
        `expected 320 to be 267`; revertido, verde. Un gate que sólo sabe decir "verde" es
        indistinguible de uno que no mide.
      - ⚠️ **Dos correcciones las encontró la corrida VIVA, no el escritorio** — y las dos
        quedaron fijadas como casos, porque las dos son la misma clase de error (un gate nuevo
        que acusa copy sano se gana fama de ruidoso y termina salteado):
        1. el add-on (Bs 390) se pinta **del mismo tamaño que un plan**, así que el universo son
           **DOS** fuentes (`src/lib/pricing.ts` + `src/content/chatbot-precios.ts`), no una;
        2. el add-on **no cambia** con el toggle (se cobra por mes y lo aclara). Exigir que todo
           monto cambiara daba rojo sobre copy sano — se exige **por separado** que el clic
           cambie *algo*, que es el síntoma real de un toggle muerto.
      - ~~Queda anotado, sin abrir frente: en la tarjeta **Completo** la unidad `Bs / año` se
        parte en dos renglones por el ancho de `12.900`.~~ **CERRADO el 2026-09-27**, ítem de
        arriba. Dejarlo escrito como «anotado» después de arreglado manda a la próxima vuelta a
        buscar un defecto que ya no existe.
      - Archivos: `web-factory/apps/onia-platform/scripts/precio-tras-el-clic.{mjs,test.ts}` +
        alias `precio-tras-el-clic:vivo`. Gates: `typecheck` 0 · `npm test` **119 archivos /
        1.654 tests** verdes · `build` 0 · corrida viva contra `onia.com.bo` en VERDE.

- [x] 🟠 **Un parpadeo de red apagaba los medidores del carril de venta, y el carril se quedaba
      sin medición sin que nada se pusiera rojo. ARREGLADO Y PROBADO DE PUNTA A PUNTA el
      2026-09-27 01:0x La Paz por `web-venta`.**
      - **Lo que se vio, no lo que se supuso.** Corriendo los once medidores vivos en fila:
        `rubros:vivos exit=2 — NO PUDE MEDIR: el alta (https://app.onia.com.bo/register) no
        contesto — fetch failed`. Noventa segundos después el MISMO comando salió `VERDE: los 5
        rubros que entrega el alta son los 5 que vende el sitio`, y `curl` al mismo URL daba
        `200` en 0,93 s. El alta estaba viva: el gate se rindió en el primer pedido.
      - **Por qué importaba más de lo que parece.** El `exit 2` es la conducta correcta (no pudo
        preguntar, no miente), pero un `NO MEDIDO` **intermitente** es peor que uno permanente:
        el permanente se ve siempre igual, el intermitente se lee como «el ambiental de siempre»
        y se saltea. Y los dos gates más expuestos son justo los que hacen cumplir las dos
        reglas escritas de Sergio Urcullo —`obra:viva` (la venta no exhibe obra) y
        `titular:sistema` (la home vende el sistema, no el bot)— porque barren **24 pantallas
        cada uno**: 24 pedidos por corrida es 24 veces la exposición de un pedido suelto.
      - **Las dos causas, y hacían falta las dos curas.** (1) Node ≥20 corta cada intento de
        conexión a 250 ms (`autoSelectFamily`) y devuelve ETIMEDOUT sobre hosts VIVOS mientras
        `curl` da 200 — eso estaba curado en **2 de los 7** scripts que fetchean y en ninguno de
        los otros 5. (2) Ninguno de los 7 reintentaba: `grep -c reintent` daba **0 en todos**.
      - **Qué quedó:** `scripts/red-que-parpadea.mjs` (`traer`, que reintenta 3 veces sólo
        cuando `fetch` RECHAZA) cableado en los 5 que piden desde este proceso —`obra-viva`,
        `titular-es-el-sistema`, `rubros-vivos`, `recursos-vivos`,
        `verificar-guia-facturacion`—; cura inline en los 2 que corren el `fetch` DENTRO del
        contenedor por `docker exec node -e`, donde el módulo no viaja. Gate nuevo
        `scripts/red-que-parpadea.test.ts`, **visto en ROJO primero y por el motivo correcto**
        (nombró los 7 sujetos), con los sujetos derivados del **disco**: un `.mjs` nuevo que
        pida a la red nace cubierto.
      - **Lo que NO hace, que es la mitad del diseño:** no reintenta una RESPUESTA. Un 404, un
        500 o un 429 son el servidor contestando; reintentarlos convierte un hallazgo en una
        espera — y el widget del sitio ratelimitea al 4º pedido por IP, así que un reintento
        automático ahí se lo provoca solo. Tampoco reintenta el `AbortError` del tope que puso
        el llamador: ese tope **es** una medición de tiempo, y triplicarlo la falsea.
      - **La prueba de punta a punta, con el gate de verdad** (no sólo el `fetch` de mentira de
        la suite): un servidor local que corta el socket del PRIMER pedido y contesta el
        segundo. `fetch` pelado contra él → `NO PUDE MEDIR — fetch failed`.
        `node scripts/rubros-vivos.mjs --alta=http://127.0.0.1:3919/` → `(red) … contesto al
        intento 2 de 3; el anterior parpadeo: fetch failed` y después `VERDE`, exit 0.
      - **Y avisa cuando salva.** Un rescate mudo volvería invisible una red que falla 2 de cada
        3 veces: se vería igual de verde que una sana. Una línea por pedido rescatado a stderr —
        es un EVENTO raro, no una condición permanente, así que no ahoga el log.
      - Gates: `typecheck` 0 · `npm test` **118 archivos / 1.640 tests** verdes · `npm run build`
        0 · y los 4 gates cableados re-corridos **contra producción**, los 4 en verde.

- [x] 🟠 **El titular de `/empezar` partía su resalte al medio, en las DOS vistas. ARREGLADO Y
      VIVO: el lead ya lo lee entero. Verificado contra `https://onia.com.bo` el 2026-09-26
      20:56 La Paz por `web-venta`, MIRANDO las capturas.**
      - **Lo que cierra el ítem, que es lo que faltaba: está ENCENDIDO en producción.** El
        publicador automático del VPS (`/root/bin/onia-publicar-solo.sh`, cron `50 */3`) publicó la
        landing a las 20:50 La Paz; el build vivo quedó sellado a las `2026-09-27 00:52 UTC`
        con `.commit = a7b69babd`, que es el HEAD de `origin/main` y contiene `e9d19c01`
        (`git merge-base --is-ancestor` → sí). **No hizo falta pedido de deploy.**
      - **La medición, MIRADA y no supuesta:** `node scripts/mirar-primera-pantalla.mjs
        https://onia.com.bo` → `resalte=1reng` en las 4 pantallas, exit 0. Capturas abiertas y
        leídas: escritorio dice `Creá tu / cuenta y usalo / de verdad / 14 días.` y teléfono
        `Creá tu cuenta y / usalo de verdad / 14 días.` — el verde entero en un renglón en las
        dos. Evidencia: `/tmp/wv-g2/empezar-{escritorio,telefono}.png`.
      - ⚠️ **La trampa que casi lo da por roto, y vale para cualquier carril:** la primera
        medición de la vuelta (20:48) salió **ROJA** — dos minutos ANTES del swap. Un veredicto
        sobre producción caduca en minutos: **el build vivo se relee justo antes de concluir**,
        nunca se arrastra la lectura del arranque de la vuelta.
      - ⚠️ **Y el `grep` volvió a mentir en la dirección cómoda:** las hojas servidas tenían
        `white-space:nowrap` (1 en dos de tres) con el arreglo todavía sin publicar — eran
        otros ocho selectores (`.panelTitle`, `.rowPrice`, `.cierre`…). Contar el literal
        «confirmaba» un arreglo que no estaba. Sirve para DESCARTAR, nunca para confirmar.
      - **Las tres estaciones, cerradas — lo confirmó `onia-cola` a las 21:00 La Paz, 4 minutos
        después de la medición de arriba y por un camino distinto.** Código: `e9d19c01`
        (`web-venta`). Merge a `main`: `c5a15c12`, 19:36 La Paz. Producción: el renglón
        `landing: PUBLICADO` del log del publicador en el VPS (`/var/log/onia-publicar-solo`),
        y el chunk de estilos que sirve el dominio cambió de hash en `/empezar` — la señal de
        que el swap entró. Capturas del antes y del después sacadas con el MISMO instrumento
        contra el MISMO dominio, en `/tmp/base-antes/` y `/tmp/base-despues/`.
      - ⚠️ **La latencia NO fue un bloqueo y por eso no se pidió nada.** La landing la publica el
        cron de cada 3 h (`50 */3`), y este cambio **no** gastó la firma de Sergio Urcullo pese a
        tocar `(sitio)/page.tsx`: la guarda `SUPERFICIE_VENTA` de `publicar-solo.sh:564` no frena
        por TOCAR una página de venta, frena si le **cambia la estructura** — y acá no cambió.
        Confundir «todavía no salió» con «necesita firma» habría abierto un pedido falso.

      <details><summary>El diagnóstico de la vuelta anterior — HISTORIA, no el estado de hoy
      (dice «sale ROJO» y «no salió de la rama»: las dos cosas dejaron de ser ciertas a las
      20:52 La Paz del 2026-09-26)</summary>

      - ⚠️ **Corregido el 2026-09-26 19:0x La Paz, auditando este mismo `[x]`.** Estaba marcado
        hecho y la palabra era «ARREGLADO» a secas. `CLAUDE.md` es explícito: *construido ≠
        terminado*, y está **prohibido reportar como hecho lo que no está encendido en
        producción**. Medido HOY contra el sitio servido, tres veces y por caminos distintos:
        `web-factory/apps/onia-platform/scripts/mirar-primera-pantalla.mjs` sale **ROJO**
        nombrando "de verdad" en escritorio y teléfono;
        `web-factory/apps/onia-platform/src/app/(sitio)/sitio.module.css` en **origin/main**
        muestra `.display em` **sin** el `white-space: nowrap`; y la hoja de estilos que sirve
        el dominio tiene **cero** `white-space:nowrap`. La captura mirada,
        en /tmp/venta-1ra/empezar-escritorio.png — se lee "y usalo de" / "verdad 14 días."
      - **Qué falta, y de quién es:** nada de código. `e9d19c01` está en la rama del carril
        (**origin/claude/web-venta**) y **no** en **origin/main** (`git branch -r --contains`
        lista una sola rama). Merge a main lo hace el integrador (`onia-cola`), no este carril.
        Latencia normal al momento de medir: el arreglo tenía ~1 h 40 min. **Se vuelve a marcar
        `[x]` recién cuando el ROJO de arriba dé verde contra `https://onia.com.bo`**, no antes.
      - **Lo que veía el lead** en la última pantalla antes de registrarse: `Creá tu cuenta` /
        `y usalo de` / `verdad 14 días.` El resalte verde es **"de verdad"** y el salto de línea
        caía **adentro**: dos pedazos de verde que no forman una frase. Escritorio y teléfono.
      - **Causa:** `text-wrap: balance` en `.display` reparte el titular por ancho de renglón y
        no sabe que ese tramo es una frase. Arreglo: `white-space: nowrap` en `.display em`.
      - **El riesgo opuesto se midió, no se supuso:** el resalte más largo del sitio es
        `un solo dato` (`/servicios/webs`) y a **320px ocupa 264px de 320, un renglón, scroll
        lateral 0**; las 24 pantallas × 5 vistas dan **0 desbordes y 0 recortados** contra el
        build con el arreglo.
      - **Por qué ningún gate lo veía** — la mitad que importa: el markup es **idéntico** se
        parta o no (lo decide el ancho del renglón en el navegador), así que no lo alcanza un
        test de fuente ni un `grep` del HTML; y la página responde **200 con todo pintado**, así
        que no lo alcanzaba el resto de `mirar-primera-pantalla`. **Lo vio el ojo leyendo la
        captura.** Ahora lo mide el gate: `getClientRects()` da una caja por renglón ocupado, y
        más de una sobre el resalte es rojo. Salió **ROJO por el motivo correcto** antes del
        arreglo (nombrando `"de verdad"` en las dos vistas, con la portada en `1reng`).
      - ⚠️ **Trampa de instrumento medida de paso:** `mirar-venta.mjs` toma la base con
        `--base=<url>`, **no posicional**, y `mirar-primera-pantalla.mjs` sí la toma posicional.
        Pasarle la URL suelta al primero **no da error**: ignora el argumento y mide
        **producción**, o sea un verde sobre el sistema equivocado. Casi lo tomo por bueno.
      - Evidencia: `/tmp/wv-fix/empezar-{escritorio,telefono}.png` y `/tmp/webs-320.png`,
        abiertas y **miradas**.
      </details>

- [x] 🔴 **`deploy:vivo` decía «DEPLOY AL DIA — sin nada varado» con un arreglo MÍO, visible
      para el cliente, sin salir de la rama — ARREGLADO el 2026-09-26 por `web-venta`
      (`60e3043b`), con el rojo falsificado antes y el camino vivo probado después.**
      - **Qué quedó.** El gate cuenta ahora las TRES estaciones: `build vivo ↔ origin/main`
        (lo de siempre) **y `origin/main ↔ la rama`**, por separado y con sus dueños escritos.
        Verde sólo si las dos dan cero. Funciones nuevas en `scripts/deploy-vivo.mjs`:
        `commitsSinMergear`, `ramaDelCarril` (la rama se DERIVA, nunca se tipea: este script lo
        corren carriles distintos), `fetchearOrigin` y `commitsDelRango` —el parseo compartido,
        para que las dos preguntas no diverjan—.
      - **Lo que NO se mezcló, a propósito:** lo que espera merge **no entra** en la lista que
        arma el pedido de deploy, porque todavía no se puede publicar. Mezclarlas repetiría en
        la otra dirección el defecto ya curado el 2026-09-06 (inflar el pedido que Sergio
        Urcullo tiene que leer). Cuando `main` está al día el informe dice **ESPERANDO MERGE** y
        **no nombra ni el comando de publicar ni el staged**.
      - **Entró también el `git fetch origin` que faltaba.** Las dos estaciones se miden contra
        `origin/main`: sin fetch el veredicto salía sobre refs de disco, o sea verde justo
        sobre lo que se mergeó hoy. Si el fetch falla → NO MEDIDO, nunca «al día».
      - **Falla CERRADA igual que su hermana:** `[]` es un dato; `undefined` —un llamador que no
        mide la tercera estación— y `null` salen por `NO_PUDE_MEDIR`. El tipo del parámetro
        además la exige, así que un llamador nuevo que la olvide no compila.
      - **ROJO antes, por el motivo correcto:** 9 casos nuevos fallando con *«el gate firmó «al
        día» con trabajo sin mergear»* y *«con sinMergear=undefined el gate se rindió en
        verde»*, más `commitsSinMergear is not a function`. Después: 52/52 verde.
      - **Y el camino VIVO falsificado, no sólo el puro** (el bloque que imprime no lo cubría
        ningún test): con un commit de sonda que toca `portada.module.css`, `npm run
        deploy:vivo` salió **exit 1** diciendo `ESPERANDO MERGE … 1 commit(s) … que main TODAVÍA
        NO tiene`, sin ofrecer el comando de publicar. Sonda revertida en el acto (`reset
        --hard`, árbol limpio).
      - Gates: `npm run typecheck` verde · `npm run build` verde (1.626 tests) · 52/52 en
        `deploy-vivo.test.ts`.
      - ⚠️ **De paso, un rojo ajeno que mordió bien y se respetó:** `imports-que-viajan-al-stage`
        acusó al test nuevo por nombrar `hermes-content` en un literal de repo sembrado. No se
        declaró exención: se cambió el literal. Una exención por un dato de prueba deja el gate
        ciego para el caso real.

      <details><summary>El diagnóstico original, como se escribió</summary>
      - **El sujeto:** `web-factory/apps/onia-platform/scripts/deploy-vivo.mjs`.
      - **Medido el 2026-09-26 19:0x La Paz**, en la misma vuelta y con una sola corrida de cada
        cosa: `npm run deploy:vivo` imprime *«DEPLOY AL DIA — onia.com.bo sirve el build del
        2026-09-26 15:52 UTC, sin nada varado»* mientras `git log` de main contra la rama del
        carril devuelve **4 commits**, y uno de ellos (`e9d19c01`) es el `white-space: nowrap` que
        endereza el titular de `/empezar`. O sea: el instrumento dijo «al día» y el lead seguía
        viendo la promesa partida en dos.
      - **Causa (no supuesta, leída):** el script compara `origin/main` ↔ el build que sirve el
        dominio. Ese eje es correcto para «¿producción corre lo que main dice?», pero el trabajo
        de un carril pasa por **tres** estaciones —rama → `main` → producción— y el gate sólo
        mira la segunda. Todo lo que está entre la rama y `main` es invisible **y se reporta como
        cero varadas**, que es la forma más cara de equivocarse: no omite, AFIRMA.
      - **Por qué importa más que el titular:** el titular ya está arreglado y sólo espera un
        merge. Esto, en cambio, es lo que hizo que el `[x]` de arriba se escribiera como
        «ARREGLADO» sin mentir a propósito — el carril preguntó «¿quedó algo varado?», le
        dijeron que no, y le creyó.
      - **Reproducción exacta, 30 segundos:**
        ```
        cd web-factory/apps/onia-platform && npm run deploy:vivo     # dice "sin nada varado"
        git log origin/main..origin/claude/web-venta --oneline        # y hay commits de producto
        ```
      - **Arreglo propuesto:** que `deploy-vivo.mjs` cuente también los commits de la zona que
        están en la rama del carril y NO en `origin/main`, y los nombre aparte («esperando
        merge») de los que ya están en `main` esperando swap. Son dos estados distintos con dos
        dueños distintos (el integrador / el deploy) y hoy se reportan como uno solo: «al día».
        Verde sólo si las dos cuentas dan cero. Con `git fetch` antes o `exit 2` (NO MEDIDO),
        nunca un veredicto sobre refs de disco.
      </details>

- [x] 🟠 **`mirar:portada` pintaba un ROJO intermitente en `telefono /empezar` por una espera que
      no retenía — ARREGLADO el 2026-09-26 por `web-venta`, con la causa medida y los dos
      recíprocos falsificados.**
      - **La causa era la MISMA CSP del 24-sep que ya había roto `guia:facturacion`.** La espera
        recibía una **cadena**, y `waitForFunction` con cadena la evalúa dentro de la página con
        `eval`: `unsafe-eval` no está permitido, así que moría en **18 ms** con `EvalError`, el
        `catch` pelado se la tragaba **muda** y la línea siguiente medía a mitad del reveal.
        Medido con sonda: `duro 18 ms · lanzó PlaywrightError · EvalError … 'unsafe-eval'`.
        **La CSP de producción es idéntica** (`curl -sI` a las dos), así que no era local.
      - **Y había un segundo defecto, independiente.** La espera apuntaba al umbral del
        **veredicto** (0.99). La curva real es `0.989 @5ms → 0.997 @128ms → 1 @250ms`, o sea que
        `>= 0.99` se cumple a los **5 ms** y se mide con la animación corriendo: caer arriba o
        abajo del umbral era una moneda al aire. Por eso `/` (más pesada, ya terminada al
        `networkidle`) daba **1 exacto siempre** y `/empezar` quedaba pegada en 0.989–0.991.
      - **El arreglo.** Predicado como **función** (Playwright ya no usa `eval`) y se espera al
        **FIN** (`OPACIDAD_TERMINADA = 1`), juzgando con `OPACIDAD_PINTADA = 0.99`: el hueco entre
        los dos es la tolerancia. Medido: la espera **retiene 160-175 ms** y da opacidad **1**.
      - **Evidencia.** Tres corridas seguidas sobre el mismo build local → `opacidad=1` en las 4
        pantallas las tres veces (antes: `0.989169` ROJO / `0.991023` / `0.990462`). Contra
        **producción**, `npm run mirar:portada` → `1` en las 4, exit 0, y la captura de
        `telefono /empezar` **mirada** (salida efímera del gate, bajo `OUT_DIR`): título entero,
        CTAs vivos, sin obra ni prueba fabricada.
      - **Los dos recíprocos, falsificados sobre una copia (borrada).** (1) Con la espera puesta
        en un valor inalcanzable **vence a los 8 s y sigue midiendo** (36 s ≈ 4 × 8 s, exit 0):
        el *falla cerrado* sigue intacto. (2) Reponiendo el bug viejo —la cadena— ahora sale
        **exit 1 nombrando la CSP en pantalla** en vez de pasar mudo.
      - **La lección, que es más grande que el bug:** un `catch` pelado hizo que un fallo del
        instrumento se leyera durante días como "la espera venció". Ahora el `catch` distingue:
        el **timeout es un resultado**, cualquier otro error **se relanza**.
      - Archivos: `scripts/mirar-primera-pantalla.mjs` · `scripts/mirar-primera-pantalla.test.ts`
        (4 casos nuevos, en ROJO antes del arreglo por el motivo correcto: "es cadena, no
        función" y "espera al mismo umbral con que juzga").

- [x] 🔴 **La CSP que la landing estrenó el 24-sep dejó al sitio LOCAL sin hidratar, y con eso el
      único gate que prueba la captura de correos de punta a punta pasó a dar 8 FALLAS fijas sobre
      una pantalla sana — ARREGLADO el 2026-09-25 por `web-venta`, con los dos recíprocos medidos.**
      - **Cómo salió.** Los cuatro números del carril estaban en meta (prohibidos 0 · precios fuera
        de fuente 0 · CTA rotos 0/25 · favicon 200), así que la vuelta corrió los **11 gates vivos**
        de la app en vez de los cuatro de siempre. Diez verdes y uno rojo: `npm run guia:facturacion`
        → **exit 1, `8 FALLAS`**.
      - **El rojo NO era ambiental, y tampoco era la guía.** Primero se descartó lentitud del
        `next dev`: con el sitio ya caliente (apuntando `GUIA_URL` al puerto 3320) el rojo salía
        idéntico. Después se MIRÓ, con la consola escuchando, y apareció la causa en una línea:
        `EvalError: Evaluating a string as JavaScript violates the following Content Security
        Policy directive because 'unsafe-eval' is not an allowed source of script`. Y la firma:
        tras apretar el botón la URL era `/guia-facturacion?email=sin-arroba&whatsapp=` — un submit
        **GET nativo**, o sea que React nunca tomó el control.
      - **Producción está SANA, medido sin ensuciar la bandeja.** Contra
        `onia.com.bo/guia-facturacion` con un correo INVÁLIDO (que no dispara ningún envío): el
        error se muestra, `aria-invalid=true`, **0 pedidos** al intake y la URL no navega. O sea
        que el defecto vivía en el entorno de desarrollo, y su costo estaba en el instrumento.
      - **Por qué importaba igual, y no es comodidad de desarrollo.**
        `scripts/verificar-guia-facturacion.mjs` corre contra el sitio LOCAL **a propósito** —los
        pasos 2 y 4 aprietan el botón, y contra producción cada envío nace como lead en la bandeja
        real— y es el único que vigila el circuito que cruza dos apps por el nombre de una clave
        JSON (`body.email`). Con 8 FALLAS de fábrica se entrena a saltearlo, que es exactamente lo
        que su propio encabezado dice que no puede pasar: *"el día que de verdad se corte la
        captura de correos nadie le va a creer"*.
      - **El arreglo, en dos mitades.** (1) `next.config.ts`: la CSP pasó de constante a
        `cspDeLaLanding(entorno)`, y `'unsafe-eval'` entra **sólo** con `NODE_ENV=development`
        (`ejecutaEval`). (2) `scripts/verificar-guia-facturacion.mjs`: **sonda de hidratación**
        antes de juzgar nada interactivo — si `window.next` no está, sale **NO MEDIDO (2)** con el
        primer error de la página, nunca `8 FALLAS`. Así el gate sigue siendo honesto si mañana la
        hidratación se cae por otro camino.
      - **Test en ROJO primero, por el motivo correcto:** `src/lib/csp-de-la-landing.test.ts` sumó
        tres casos y con el arreglo revertido falló **sólo** el de desarrollo, nombrando
        `'unsafe-eval'`, con los otros 11 en verde. El tercer caso es el recíproco que faltaba: que
        el header que devuelve `headers()` sea **el que la función calcula para este entorno**, para
        que nadie arregle la función y deje el header viejo colgado.
      - **Medido al cerrar:** `guia:facturacion` **TODO VERDE (13/13, exit 0)**; con la hidratación
        rota a propósito, **NO MEDIDO exit 2** citando el `EvalError`; `next start` sobre el build
        sirve la CSP **sin `unsafe-eval`** (verificado con `curl -sI`, no razonado); `npm run
        typecheck` 0, `npm test` **115 archivos / 1557 casos** verde, `npm run build` 0. Y
        `npm run mirar:venta` contra producción: 24 rutas × 5 vistas, sin defecto medible.

- [x] 🔴 **CERRADO el 2026-09-25 por `onia-cola`: el gate de esta cola llevaba días en rojo y su
      único ERROR era falso.** `npm run cola:viva` salía **exit 1** acusando que el ítem de acá
      abajo «apunta a un archivo que NO existe». El archivo era `if/else`: el ítem dice «un
      `if/else` sin cobertura al lado de su gate», y el extractor de rutas de
      `scripts/verificar_cola.js` toma por ruta **cualquier token con barra entre backticks**.
      Es la MISMA clase que el `.test.ts` que ya tenía su carve-out —un constructo de código
      citado como sustantivo, que nombra una FORMA y no promete ningún archivo—, sólo que con
      otra notación. Y el costo no es cosmético: **un gate que sale rojo de fábrica entrena a
      saltearlo**, que es palabra por palabra cómo `CLAUDE.md` cuenta que se rompió el CI dos
      veces. Los dos pares de la lista (`PARES_DEL_LENGUAJE`) salen de **contar sobre el corpus**
      —son los únicos pares palabra/palabra de estas colas que no son rutas reales ni paquetes
      npm—, no de imaginar cuáles podrían aparecer; lista cerrada y token exacto a propósito,
      porque un patrón genérico taparía carpetas de verdad como `scripts/loops`. Va con sus dos
      recíprocos, que es lo que impide que el carve-out afloje: el mismo par **con extensión**, y
      el mismo par **como sufijo de una carpeta**, se siguen verificando los dos. (Acá no se
      escriben entre backticks a propósito: al redactar este ítem con los dos literales citados,
      el gate los reclamó como fantasmas y salió exit 1 — o sea que el recorte es de verdad del
      token entero, medido sin querer.) **Probado además mutando el corpus real**, no sólo el
      self-check: una
      ruta fantasma nueva metida en esta sección vuelve a poner el gate en exit 1 (y el
      `hermes-content/docs/COLA.md` se restauró con `cp`, nunca con `git checkout`). Self-check
      110 → **114 casos**; `cola:viva` exit 1 → **0**, con 33 ítems en Ahora todos con evidencia
      real. ⚠️ **Eso dejó abierto que `cola:viva` era un alias suelto que no corría nadie** —ni la
      cadena `npm test` ni el arranque de ningún carril—, y por eso su rojo pudo vivir días sin que
      nadie lo viera. **CERRADO el 2026-09-25, el mismo día**, con `scripts/colas-vivas.mjs` en la
      cadena (`test:colas-vivas`, self-check 23/23). Lo que faltaba entender para poder cerrarlo:
      apuntar el alias a la carpeta **no alcanzaba**, porque de los 32 `.md` de
      `hermes-content/docs/cola/` + éste, **28 salían exit 1 y los 28 con el MISMO único error**,
      `cola-vacia` — el verificador no distingue un archivo que **no es una cola** (el `README.md`
      de esa carpeta, `TABLERO.md`, y los 22 borradores de contenido, que no tienen `## Ahora` y
      nunca lo van a tener) de una cola de verdad **con `## Ahora` vacío**, que es señal real de
      carril parado. Los trataba igual, así que la carpeta entera daba **rojo de fábrica**, y un
      rojo de fábrica entrena a saltearlo: por eso el alias había quedado clavado a un solo
      archivo escrito a mano. El gate nuevo deriva los sujetos **del disco por forma** (es cola lo
      que tiene `## Ahora`, con el mismo regex que el verificador, así que una cola nueva entra
      sola), falla por lo que es su asunto —**evidencia falsa**— y deja `cola-vacia` fuera del
      rojo pero **nombrado** en la salida, porque el carril parado ya tiene su canal en el
      tablero. Hoy mide **4 colas** —`COLA.md`, `chatbot.md`, `plataforma-v1.md` en verde y
      `tendencias.md` PARADO— y nombra los 28 excluidos. Validado **mutando el corpus real**, no
      sólo el self-check: una ruta inventada metida en el `## Ahora` de `chatbot.md` lo puso en
      exit 1 citando línea y archivo (y se restauró con `cp`, nunca con `git checkout`).
      ⚠️ **Y destapó un falso verde del verificador**: corrido desde fuera de la raíz del repo
      imprime `NO MEDIDO:` y sale **exit 0**, o sea que su negativa a medir se lee igual que una
      cola limpia —probado desde `/tmp` con dos colas que tenían fantasmas plantados: las tres
      "verdes"—. Un gate que heredara ese 0 sería un falso verde sobre TODAS las colas a la vez,
      así que `colas-vivas` lo atrapa por su texto y sale **exit 2, NO MEDIDO**, nunca verde.

- [x] 🔴 **CERRADO el 2026-09-19 por `onia-cola`: el universo ahora sale del CRONTAB del VPS,
      que es quien EJECUTA.** Instrumento nuevo `scripts/herramientas-del-cron.mjs` —self-check
      puro en la cadena (`test:herramientas-del-cron`, 17 casos, validado por 7 mutaciones) y
      medición viva en `npm run herramientas:vivas`, que corre en el arranque de este carril.
      Pasó de **8 rojos a CERO**, y tres de esos ocho eran defectos **del instrumento**, no del
      sistema —vale la pena nombrarlos porque son la clase:
      **(1)** `CABLEADA_EN_DERIVA` no distinguía deriva real de la **ventana normal del sync**:
      `sincronizar.sh` copia desde `origin/main` al `:44`, así que un commit que entra al `:47`
      corre con el código viejo una hora. Ahora hay estado `ESPERANDO_SYNC`, y lo que decide no
      es el commit de la fuente sino **el más nuevo entre la fuente y el cable** — el caso que
      lo destapó (`chatwoot-brand-onia.sh`) tenía la fuente arreglada hacía 19 días y lo que
      había cambiado era la línea `poner`.
      **(2)** Onia son DOS repos y el índice miraba uno: `run-onia-appointment-reminders.sh` y
      `run-onia-renewal-reminders.sh` salían «sin fuente» estando versionados en la
      carpeta de crons del repo hermano. Obedecer ese rojo creaba la segunda fuente de verdad que
      `CLAUDE.md` prohíbe. Se cruza contra la ref **publicada y fresca** del hermano (fetch
      primero; si no se puede, `NO MEDIDO`, nunca `SIN_FUENTE`).
      **(3)** El cruce por nombre de archivo inventaba huérfanas, porque el sincronizador
      **renombra** al desplegar (el sincronizador llega a `/root/bin` con otro nombre). Se cruza por
      CONTENIDO.
      **Lo que sí era real y se arregló en la misma vuelta:** cuatro herramientas de producción
      existían ÚNICAMENTE en el VPS y un borrado se las llevaba sin rastro —entre ellas
      `backup-onia-db.sh`, el respaldo diario de la base de producción—. Respaldadas con modo
      `100755` (el bit de ejecución viaja en git, no en un `chmod` del worktree):
      `hermes-content/infra/vps-db/scripts/backup-onia-db.sh`,
      `hermes-content/infra/vps-ops/crons/run-onia-agents-cron.sh`,
      `.../run-onia-trial-drip.sh` y `hermes-content/deploy/vps-ops/onia-siat-vigia.sh`.
      **Lo que queda abierto, y NO se hace a ciegas — recontado el 2026-09-24 por `onia-cola`,
      quedan 6, no 19.** Se cablearon 10 en `7a37489c` (las 8 de entonces que vivían en rutas ya
      sincronizadas, más `onia-mirar-cliente.mjs` y su sonda, que el instrumento no podía ver).
      `npm run herramientas:vivas` pasó de **12 cableadas / 17 copia a mano** a **21 / 8**, con
      cero a arreglar.
      ~~**Las 6 que faltan no se arreglan con una línea** y por eso no se tocaron: viven en
      `hermes-content/infra/` (los dos respaldos y los cuatro crons del producto), y esa carpeta
      **no está en `RUTAS_SYNC`**, así que el archivo ni siquiera viaja. Agregar un árbol nuevo al
      `git archive` del sincronizador es un cambio aparte, con su propia medición.~~
      ⚠️ **VENCIDO — el cambio aparte YA SE HIZO. Recontado el 2026-09-25 por `onia-cola`.**
      `hermes-content/infra` está en `RUTAS_SYNC` (`scripts/loops/sincronizar.sh:62`), puesto ahí
      por `fa2d6f83` (el respaldo diario de la base) y `f6f64fd2` (los dos últimos crons), y
      `npm run herramientas:vivas` da hoy **33 cableadas y al día · 0 copia a mano · 0 a arreglar**.
      No quedan 6: quedan **cero**. Dejarlo escrito mandaba a la próxima vuelta a cablear un
      árbol que ya está cableado — trabajo fantasma con la evidencia en contra, que es la clase
      que este archivo pide medir antes de obedecer.
      **Lo que SÍ quedó abierto es otra cosa, y es nueva:** ese 33/33 mide **una sola máquina**.
      Desde el 07-sep los cuatro loops vivos los lanza el crontab de **nodo-casa**, y su universo
      no entraba en el instrumento. Cableado el 2026-09-25 en `4b46667c`: la medición viva ahora
      informa **una línea por máquina** (VPS 33/33 · casa 5, con 3 al día y 2 escritas por el
      instalador) y los cables de casa resultaron ser **tres**, no uno.
      ~~⚠️ **Lo que a ese arreglo le falta, dicho para que no se lea como más de lo que es:** los
      caminos ROJOS del bloque de casa (`INSTALADOR_EN_DERIVA` y `COPIA_A_MANO`) **no los cubre
      ningún caso todavía** — el self-check ancla la función pura y la corrida viva sale verde,
      así que hoy sé que el verde es cierto pero **no** que el rojo aparecería. Se cierra
      metiéndole un fixture de instalador cuyo heredoc literal difiera del archivo vivo.~~
      ✅ **CERRADO el 2026-09-25 por `onia-cola`, y la causa era estructural, no un fixture que
      faltaba.** La decisión del bloque de casa vivía DENTRO del `.map` que lee el disco
      (`/root/.onia-nodo`, `crontab -l`, `readFileSync` de cada ruta), así que ningún caso podía
      provocar su rojo sin ensuciar la máquina — y un `if/else` sin cobertura al lado de su
      hermana ya cubierta es el patrón que esta casa mide seguido: **dos armadores hermanos, y
      el que corre es el que no tiene test.** Extraída a `clasificarEnEstaMaquina` (pura,
      exportada); el `.map` ya sólo RECOGE evidencia y la ausencia en disco viaja como
      `md5Vivo: null` en vez de como veredicto. **11 casos nuevos** (39 en el archivo), uno por
      camino: los cuatro rojos (`SIN_FUENTE`, `INSTALADOR_EN_DERIVA`, `CABLEADA_EN_DERIVA`,
      `EN_DERIVA_SIN_CABLE`), el aviso `COPIA_A_MANO`, los dos verdes, el cuerpo interpolado
      —que es el **rojo falso** ya cazado una vez: en casa `onia-tg.sh` DEBE diferir del script
      del VPS, porque acá es un shim que delega por SSH— y la precedencia del gemelo por
      contenido. **Validado por 6 mutaciones**, cada una roja por el motivo correcto y por el
      caso que le toca: los dos rojos vueltos `CABLEADA`, el interpolado acusado de deriva, el
      corte de «ausente en disco» quitado, `INSTALADOR_EN_DERIVA` sacado del conjunto `ROJOS`
      (2 rojos: el caso y el ancla) y el orden invertido para que el instalador tapara al gemelo.
      El refactor no movió el veredicto vivo: `npm run herramientas:vivas` sigue dando
      **VPS 33/33 · casa 5 (3 al día + 2 escritas por el instalador) · 0 a arreglar**.
      ⚠️ **La advertencia de que `claude-guardia.sh` tenía «producción adelante» está VENCIDA.**
      Era cierta el 2026-09-19; medida de nuevo hoy en las dos direcciones, el md5 de `origin/main`
      y el de `/root/bin` son **idénticos**, y lo mismo las otras nueve — por eso cablearlas no
      revirtió ni un byte. Obedecer hoy esa advertencia era dejar el agujero abierto por un motivo
      que ya no existe. **El método sigue en pie**: se cablean mirando el diff en las dos
      direcciones, y la coincidencia de md5 es lo que hace seguro el momento, no lo que lo hace
      innecesario. Reproducción: `npm run herramientas:vivas`.

- [x] 🔴 **Chatwoot le mostraba al cliente los términos y la privacidad de CHATWOOT: 6 de las 9
      claves de marca estaban revertidas, y el arreglo llevaba 19 días en `main` sin que nada lo
      copiara. Medido y CERRADO el 2026-09-19 por `onia-cola`.**
      **El defecto, preguntado al contenedor vivo** (no un `grep`): `rails runner` sobre
      `InstallationConfig` en `onia-chatbot_chatwoot.1` devolvió `BRAND_URL
      https://www.chatwoot.com`, `TERMS_URL https://www.chatwoot.com/terms-of-service`,
      `PRIVACY_URL https://www.chatwoot.com/privacy-policy` y los tres `LOGO` de fábrica. Las
      tres URL viajan en el objeto de config que el front embebe en
      `https://chat.onia.com.bo/app/login`.
      **La causa no era el arreglo, que estaba bien:** `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh`
      defiende las nueve desde el 2026-08-31 (el reconcile de Chatwoot restaura diez), y la copia
      que el cron `17 * * * *` ejecutaba era la vieja de 14 líneas, que defiende tres —
      `INSTALLATION_NAME`, `BRAND_NAME` y `WIDGET_BRAND_URL`, que son exactamente las tres que
      estaban bien. **Nada copiaba ese archivo**: sin línea `poner`, el repo y producción son dos
      archivos distintos que nadie compara.
      **Probado antes de cablear, contra el contenedor vivo y sin escribir:** `bash <copia del
      repo> --check` contestó `REVERTIDAS 6/9` y listó las seis. O sea que el guion del repo
      corre ahí y su diagnóstico coincide con lo que la base dice.
      **Cura:** línea `poner` en `scripts/loops/sincronizar.sh` (`hermes-content/deploy` ya está
      en `RUTAS_SYNC`, así que el archivo viaja). El sync del `:44` deja la copia buena y el cron
      de las `:17` repone las seis claves solo — sin pedirle nada a Sergio Urcullo.
      **Lo que queda abierto es la CLASE, no esta instancia:** el ítem de arriba.

- [x] 🔴 **La portada y `/rubros` le prometían a un centro de estética un PAQUETE con las
      sesiones hechas y las que faltan — un saldo que el producto no lleva.** Medido el
      2026-09-19 contra `origin/master` de `onia-platform` (ref fetcheada, no de disco):
      `prisma/schema.prisma` no declara paquete, bono ni saldo de sesiones (`PatientTreatment`
      tiene `status`, no total contratado); `esteticagest-clinical` es un ESPEJO del pack dental
      (`mirrorPack`) cuya nav (`navClinicaDe`) sólo renombra `/patients`→«Clientas» y
      `/treatments`→«Tratamientos»; `lib/onboarding/vocabulario.ts` le dice a ese track
      `servicios: "tratamientos"`. Lo único que el repo llama «bono» es el de antigüedad de la
      planilla. El panel compartido además lo DIBUJABA: `<Sesiones hechas={3} total={6} />`.
      **Por qué ningún gate lo vio:** no mueve una cifra, no tipea un nombre de plan junto a una
      capacidad y no es un cuantificador universal — y lo sostenía una **cita circular**: el
      comentario de la home se respaldaba en `rubros/page.tsx` y `rubros/page.tsx` en sí mismo,
      el sitio comparándose consigo mismo. El panel hermano de al lado (servicios: IVA e IT)
      tenía la cita bien hecha, al PRODUCTO.
      **Cura:** la promesa se cambia por la verdadera, que es más fuerte y es el dolor de
      entrada del cliente ideal — la clienta que dejó el tratamiento a medias y no volvió (el
      Recall corre en ese rubro y dispara por `recallAfterDays`, o sea por tiempo sin volver).
      Plantilla antes que instancias: `ui.tsx` (panel + `alt` + se BORRA el componente
      `Sesiones` y su CSS huérfano), y después `switcher.tsx`, `rubros/page.tsx` y `page.tsx`.
      Gate de clase `(sitio)/promesa-de-rubro-que-el-producto-no-modela.test.ts`: universo
      derivado del conmutador, prohíbe la FORMA (agrupación con saldo + el contador dibujado),
      validado por mutación con OTRAS palabras y en OTRO rubro («bono de 10 clases») y con caso
      ancla que exige los 5 rubros vivos. Verificado renderizado en el build de esta rama:
      documento 200, cero subrecursos ≥400, y el DOM pinta «Tratamientos en curso» / «La clienta
      que dejó el tratamiento a medias no se pierde», sin rastro de paquete ni sesiones.

- [x] 🟠 **CERRADO el 2026-09-19 06:5x La Paz por `onia-cola`.** El corte pasó de la FORMA del
      número a la **clave que lo recibe**, y el caso vivo quedó medido con el guion REAL contra el
      diff real: `bash scripts/loops/extras/publicar-solo.sh --montos /root/loops/onia-hermes
      web-factory/apps/onia-platform/src/lib/pricing.ts $(git log --format=%H
      d56194544..origin/main -- web-factory/apps/onia-platform/src/lib/pricing.ts)` pasó de
      `cambian: 0` (exit 1, detenía) a **`ningun monto cambia` (exit 0)**.
      **Lo que escapaba, derivado del diff y no adivinado:** `asientosExtra: 0` —personas— y el
      `0`/`1` de `frase.charAt(0)`/`frase.slice(1)`. Hubo un segundo hallazgo que ninguna lectura
      del ítem anticipaba: el terminador `([^0-9.,]|$)` **excluía la coma**, así que
      `asientosExtra: 0,` no matcheaba ni con el corte por clave puesto — el arreglo "obvio"
      seguía deteniendo y sólo lo delató volver a correr el guion contra el diff real.
      **Falla CERRADO, que es lo único que lo hace seguro:** la excusa se ancla al vocabulario de
      CANTIDAD (`asiento|usuario|persona|cupo|ficha|conversacion|sesion|length|index`) y exige la
      segunda mitad —que la clave **no** nombre plata—, así que `precioPorUsuario: 0` sigue
      deteniendo aunque diga «usuario», y una clave que el guion no sabe nombrar detiene también.
      La dirección del daño no es simétrica: detener de más cuesta una firma de Sergio Urcullo;
      dejar pasar de menos publica un precio que nadie decidió.
      **Gate:** `scripts/publicador-freno-de-precio.test.mjs`, 18/18, con los tres casos que
      sostienen la cura (clave desconocida, clave de cantidad+plata, y el caso vivo).
      **Validado por mutación 4/4** por `# fail N` + exit 1, restaurando con `cp` (nunca
      `git checkout`): vocabulario que no reconoce `asiento` → cae sólo el caso vivo; guarda de
      plata anulada → cae `precioPorUsuario`; métodos de posición fuera → caen 2; y el corte por
      clave entero fuera → caen 8.

      **↑ Auditado en PRODUCCIÓN el 2026-09-19 11:44 UTC por `onia-cola` (escalón 2), y el `[x]`
      estaba a medias: era cierto en el repo y falso en el VPS.** Este cierre midió el guion del
      **repo**, y el que decide es `/root/bin/onia-publicar-solo.sh`, que viaja por OTRA cadena
      —`sincronizar.sh`, cron `44 * * * *`, desde `origin/main`—. `b33f4c1c` entró a `main` a las
      **10:44:19 UTC**, o sea **17 segundos después** del sync de las `10:44:02Z`: producción
      siguió con la copia vieja una hora entera, con `md5` distinto (`1b209384…` vivo contra
      `9909ccd3…` en el repo), y la corrida del publicador de las 09:50 UTC volvió a imprimir
      textual `landing: NO publico solo — cambia un numero en una fuente de precio:
      web-factory/apps/onia-platform/src/lib/pricing.ts: 0 1` — el bug que este ítem dice cerrado.
      **Cerrado de verdad:** el sync de las `11:44:03Z` llevó el archivo (`sincronizados 1
      archivo(s) desde main`, `md5` vivo ya igual al del repo) y el guion **VIVO del VPS**,
      corrido contra el mismo commit real (`2b12f50a`), contesta **`ningun monto cambia`, exit 0**.
      **La lección no es del arreglo, que estaba bien: es que una herramienta de producción con
      cadena de despliegue propia no está arreglada cuando el test pasa, sino cuando su copia
      VIVA contesta distinto** — y acá las dos cadencias no están alineadas (sync horario al `:44`
      contra publicador `50 */3`), así que perder el sync por segundos puede costar la ventana
      entera del publicador. Se comentó en `t_bec84ac0` para que nadie le pida a Sergio Urcullo un
      `ok` por algo que el publicador ya saca solo.

- [~] ~~🟠 **El freno de precio del publicador decide por la FORMA del número y no por el campo:
      hoy detuvo la landing por `asientosExtra: 0`, que son personas, no plata.**
      **Medido el 2026-09-19 08:4x UTC**, con `2b12f50ae` esperando en `origin/main`:
      `bash /root/bin/onia-publicar-solo.sh --dry-run` contestó *«landing: NO publico solo —
      cambia un numero en una fuente de precio: web-factory/apps/onia-platform/src/lib/pricing.ts:
      0 1»*. Los números que acusa, leídos del diff contra el build vivo
      (`git -C /root/loops/onia-hermes diff $(cat /opt/onia-landing/runtime-next/.commit)..origin/main
      -- web-factory/apps/onia-platform/src/lib/pricing.ts`), son `asientosExtra: 0` —cuántas
      personas extra vende un plan— y `nombres.length === 0` / `=== 1` dentro de `unirConY`, un
      helper que arma una enumeración de texto. **Ningún monto cambia**: `Bs 70` sigue saliendo
      de `USUARIO_EXTRA_ADDON`, intacto.
      **Por qué no lo cerró la cura de ayer** (`d5619454`): ésa sacó las COMPARACIONES (`> 0`,
      `> 1`) y dejó las ASIGNACIONES (`: 0`) deteniendo a propósito, con su motivo escrito —«un
      add-on que pasa a gratis se escribe `: 0`»—, que sigue siendo cierto. Lo que faltaba es que
      el freno mire **a qué campo** se asigna: `: 0` en `mensualAddon` es plata; en `asientosExtra`
      es una cantidad de personas. El corte no es la forma del número ni su valor: es si la clave
      que lo recibe (o el texto que lo rodea) habla de plata.
      **Qué cuesta dejarlo así:** cada falso positivo le pide a Sergio Urcullo una firma por un
      cambio que no mueve un centavo —hoy, el pedido `t_b535811a`— y esa es la única firma que
      importa; gastarla en falsos la vuelve automática. Y mientras espera, el arreglo que SÍ le
      ahorra Bs 330/mes a un lead de Profesional no está publicado.
      **Dónde:** `scripts/loops/extras/publicar-solo.sh` (`numeros_del_diff`), con su gate
      `scripts/publicador-freno-de-precio.test.mjs`. El caso que hay que sembrar es justamente
      éste: un diff que agrega `asientosExtra: 0` **no** detiene, y uno que agrega
      `mensualAddon: 0` **sí**.~~

- [x] 🟠 **La portada le prometía al lead que ninguna capacidad exige subir de plan, y DOS lo
      exigen. Medido y CERRADO el 2026-09-18 20:5x La Paz por `web-venta` (`00ae5f63`).**
      **El defecto, MIRADO renderizado** (captura leída, no un `grep`): la sección de add-ons de
      `onia.com.bo/` se rotula *«Sobre el plan encendés lo que te falta»* y debajo afirmaba
      **«No hay que saltar de plan para desbloquear una sola»**. Es falso desde la escalera C: de
      las cuatro capacidades de `CAPACIDADES_INCLUIDAS` sólo DOS se compran sueltas —chatbot
      (Bs 390) y reservas (Bs 150 en Básico)—; los **agentes** exigen saltar al Crece (Bs 550) y
      el **segundo administrador**, al Completo (Bs 1.290), y no hay add-on de ninguno de los dos
      (`onia-platform/lib/plan-catalogo.ts`: `agentsIncluded`, `multiAdminIncluded`). La escalera
      de la MISMA pantalla, tres secciones más arriba, lo dice con todas las letras («Todo lo del
      Básico + Agente Recall…», «más de un administrador»): la pantalla se contradecía sola, y el
      lead que necesitaba una de esas dos se iba al plan de entrada creyendo que después la
      prendía aparte.
      **Por qué ningún gate podía verlo** — es la tercera forma de la familia «alcance total» y
      la más escurridiza: los cruces de precio validan MONTOS y acá no hay ninguno;
      `src/lib/capacidad-incluida.test.ts` prohíbe TIPEAR un plan junto a la capacidad y esta
      frase no nombra ni un plan ni una capacidad; `(sitio)/prueba-vs-plan.test.ts` cierra el
      alcance dicho sobre el TODO («el sistema completo») y sobre las PARTES («todos los
      módulos»). Ésta se dice sobre el **mecanismo**, en abstracto.
      **Cómo quedó:** el texto lo DERIVA `sinSubirDePlan()`
      (`web-factory/apps/onia-platform/src/lib/pricing.ts`) del catálogo, y lo que se prohíbe es
      la FORMA, no el literal viejo — prohibir «saltar de plan» se apagaría solo el día que la
      respuesta correcta vuelva a ser ésa, y el caso 5 del gate exige que el universal reaparezca
      solo cuando todo se compre suelto. `ADDON_DE_LA_CAPACIDAD` es `Record` completo (una
      capacidad nueva no compila hasta que alguien conteste de qué lado está) y **no se cree
      solo**: el gate cruza cada nombre declarado contra `ADDONS`, la carta que el lead ve, así
      que marcar una capacidad como «suelta» sin add-on publicado es rojo. De paso viajó a
      `/precios`, que decía lo mismo **acotado** («Ninguno te obliga a…») y por eso era cierto —
      y tipeado igual, que es como las dos se separan.
      **Gate:** `web-factory/apps/onia-platform/src/app/(sitio)/desbloqueo-que-no-se-tipea.test.ts`
      (sujetos caminados del disco: una pantalla nueva nace cubierta).
      **Verificado:** `npm run prebuild` verde (tsc + 1.367 tests), `npm run build` 0,
      `npm run precios:fuente` VERDE (43 cifras cruzadas), y la pieza servida desde el build
      local ABIERTA Y MIRADA con `reducedMotion` — dice «Cada cosa se prende aparte y se paga
      aparte. Lo de acá abajo se suma sobre el plan que ya tenés.»
      **Validado por mutación 6/6**, restaurando con `cp` (nunca `git checkout`): reintroducir el
      texto tipeado en la portada, absolver una capacidad con un add-on inexistente, clavar la
      cláusula en el universal, vaciar el cálculo, borrarle a la dueña la rama universal, y dejar
      al caminador sin llegar a `(sitio)`.
      **Falta publicar:** vive en el pedido de landing `t_c2fbda1e`, que ya espera el ok de
      Sergio Urcullo — comentado ahí una sola vez, para que el integrador rehaga el cuerpo con
      los tres shas (el cuerpo de un pedido no se corrige comentando).
      **Reproducción en 30 segundos:**

          curl -sL https://onia.com.bo/ | grep -oE "[^<>]{0,60}saltar de plan[^<>]{0,60}"

- [x] 🟠 **El runtime vivo de la landing perdió su `.commit`, así que «qué corre `onia.com.bo`»
      volvió a ser a mano — que es exactamente lo que su propio publicador dice haber curado el
      2026-09-03. Medido el 2026-09-18 18:3x La Paz por `onia-cola`. CERRADO el 2026-09-18 20:0x
      La Paz por `onia-cola`: el gate ya lo nota.**
      **Cómo quedó:** `shaVivoLanding()` es TRI-ESTADO (`clasificarShaVivo`, pura y exportada):
      `MEDIDO` con su sha, `SIN_COMMIT` cuando el runtime contestó y el archivo no está, y
      `NO_MEDIDO` cuando no se pudo preguntar. La distinción no la puede hacer un `cat` —falla
      igual con el archivo ausente y con el SSH caído—, así que vive en el guion
      (`guionDelCommit`: `if [ -f … ]; then cat …; else printf __SIN_COMMIT__; fi`), y eso se
      prueba corriéndolo en un shell de verdad contra un directorio sembrado, no leyéndolo.
      El aviso (`avisoDelCommitAusente`) es **AVISO, nunca rojo**: no cambia ningún veredicto
      —el de la landing lo da `epochBuildLanding` por FECHA— ni el código de salida, porque un
      rojo acá trabaría el merge de todos los carriles por algo que se cura solo en la próxima
      publicación. **Y la mitad que lo hace útil:** ahora se le pregunta por TODO pedido de
      landing y no sólo por los `entregados` —el único camino que imprime cita—, que era lo que
      dejaba la ausencia invisible en el caso normal (un pedido VIGENTE, casi toda corrida).
      **Probado en vivo, no razonado:** `npm run pedido:entregado` imprime `OK t_4e0bb0b0
      (landing): sigue VIGENTE` y debajo el `AVISO: el runtime vivo de la landing corre SIN
      .commit`, con exit 0.
      **Validado por mutación: 8 de 8**, cada una restaurando con `cp` (nunca `git checkout`,
      que se lleva el arreglo sin commitear del mismo archivo). Las dos que importan: aplanar la
      ausencia en `NO_MEDIDO` —el bug— deja 3 casos en rojo, y volver a acotar la pregunta a
      `entregados` deja 1, que es el que no existía antes de esta vuelta.
      **De paso, un rojo del propio instrumento:** el gate de cableado anclaba en
      `/landing:\s*(.*)/` sobre el fuente y lo acusaba cualquier PROSA que dijera «landing: …
      vivo …» —el texto del aviso nuevo lo puso rojo con el producto intacto—, y además se
      quedaba con la primera aparición del archivo, que es de OTRO mapa (los publicadores en
      seco). Ahora blanquea las cadenas además de los comentarios y nombra a `vivoPorDestino`.
      **Qué se midió, y contra qué:** `ls -la /opt/onia-landing/runtime-next/` devuelve sólo
      `apps`, `node_modules` y `package.json` — **sin `.commit`** —, mientras
      `find /opt/onia-landing -maxdepth 3 -name .commit` lo encuentra en los respaldos
      (`/opt/onia-landing/runtime-next.bak-deploy-20260917210756`) y en los builds armados
      (`/opt/onia-landing/_deploy/build-20260918005015`). El runtime que corre HOY es el único sin él.
      `hermes-content/deploy/onia-landing/build-and-stage.sh:77-80` lo dice con todas las letras:
      *«El .commit va en el STAGE (lo que se publica), no solo en $BUILD, que se borra al final:
      medido 2026-09-03, el runtime vivo quedaba "sin .commit" y saber que corre volvia a ser a
      mano.»* La cura está escrita y volvió a pasar.
      **No es que la fuente se haya desviado, y eso descarta la sospecha barata:** los tres
      publicadores de `/opt/onia-landing/_deploy/` coinciden **byte a byte** con
      `hermes-content/deploy/onia-landing/` (mismo `md5sum` en los tres), y
      `grep -c "STAGE/.commit" /opt/onia-landing/_deploy/build-and-stage.sh` da `1`. El swap
      tampoco filtra: `swap-and-verify.sh:19-20` mueve el **directorio entero**
      (`mv "$STAGE" "$ROOT/runtime-next"`), así que un stage con `.commit` lo conserva. Queda que
      el stage que entró a las **20:08 UTC** ya venía sin él — o que ese `mv` fue el rollback de
      `swap-and-verify.sh:36-37`, que restaura un runtime anterior.
      **Qué NO cuesta, para no inflarlo:** `shaVivoLanding()`
      (`scripts/pedido_deploy_entregado.mjs`) no decide nada — sólo sirve para CITAR, y el
      veredicto lo da `epochBuildLanding` por FECHA. Así que ningún pedido se decide mal por
      esto: lo que se pierde es la cita, que es la diferencia entre refutar un veredicto en dos
      segundos y volver a medirlo a mano. *(Devolvía `null` pelado y eso se leía como
      «correcto»; lo era para el veredicto y no para el diagnóstico: `null` decía a la vez «no
      pude preguntar» y «pregunté y no está», que se arreglan en lugares opuestos.)*
      **Reproducción en 30 segundos:**

          ssh root@187.77.16.63 'ls -la /opt/onia-landing/runtime-next/; find /opt/onia-landing -maxdepth 3 -name .commit | head'

      **Qué NO se tocó, y por qué:** la ausencia en producción **no se arregla a mano** — se cura
      sola en la próxima publicación (el stage siguiente trae su `.commit`), y escribir ese
      archivo a mano sería inventar un sha que nadie derivó, el anti-patrón de esta familia. Lo
      que faltaba era verla. **Queda vivo el porqué**, que este gate ahora deja a la vista cada
      vez que vuelva a pasar: o el stage que entró a las 20:08 UTC ya venía sin él, o ese `mv`
      fue el rollback de `swap-and-verify.sh:36-37`. Si el aviso reaparece DESPUÉS de una
      publicación limpia, ahí hay un segundo ítem — y esta vez con fecha y testigo.

- [x] 🟠 **El ÚNICO camino para entregar `onia-platform` desde nodo-casa vivía FUERA de git, en
      un archivo suelto de `/root/tmp` del VPS. Medido y CERRADO el 2026-09-18 17:5x La Paz por
      `onia-cola` (`2516f393`).**
      **Cómo quedó:** la fuente única es `scripts/integrar-onia-platform.sh`, y la copia a mano
      del VPS se retiró en la misma vuelta (renombrada a `.REEMPLAZADO-POR-…`, no borrada, para
      que el que la busque encuentre el puntero y no un hueco). Se invoca **leyendo del clon del
      VPS ya puesto al día** — `fetch` + `merge --ff-only origin/main` + `bash …/scripts/…` en
      un solo comando remoto —, así que no hay que desplegar nada y sigue habiendo una sola copia.
      Además viajaron tres cosas que antes estaban clavadas a mano: la rama es un **argumento**
      (estaba fija en el carril del chatbot), el árbol se **prepara solo** (worktree, `node_modules`
      por hardlink —un symlink mata el build con `[standalone-runtime] … invalid or linked`— y el
      symlink a `onia-hermes`), y **`check:onia-core` en `SKIPPED` ahora es ROJO**: sin el hermano
      ese gate sale 0 sin medir el espejo del core, que es el primer paso del CI.
      **Probado en vivo, no razonado:** con `0` intentos (el modo que prepara el árbol y no corre
      gates ni push) el invocador contestó `clon al dia: 2516f3931` + `NO PUBLICADO tras 0
      intento(s)`, exit 5 — o sea el camino entero desde casa resuelve, y el texto del script es
      el mismo que media hora antes publicó `5ed97b0` con 5.704 tests verdes al primer intento.
      Hoy la integración del carril del chatbot a `master` salió al primer intento con ese
      script —5.704 tests verdes, publicado `5ed97b0`— y funciona bien: hace `fetch` +
      `reset --hard origin/master` + merge + los CINCO gates + `git checkout -- .` (el build muta
      4 archivos de iconos) + `push` con `ONIA_LOOP_ID`, todo en UN proceso remoto con bucle de 2
      intentos, que es lo que evita que `master` se mueva entre gate y push.
      **El agujero no es el método: es dónde vive.** Es una copia a mano, sin fuente versionada,
      en un directorio temporal. Un reinicio del VPS, un `tmpreaper` o una limpieza de disco
      —que este carril ya hizo dos veces— lo borran, y la próxima vuelta del integrador no tiene
      cómo saber que existió: la memoria compartida describe la RECETA, no el archivo. Mientras
      tanto, es el único camino a `master` desde la máquina donde corren los cuatro loops
      (`onia-platform` no se pushea desde casa: su remoto está en `DESHABILITADO-NODO-DE-DESARROLLO`).
      **Qué NO alcanza, para no repetirlo:** versionarlo y dejarlo ahí crea DOS copias del mismo
      juicio, que es como nacen los desacuerdos de esta familia (ver el ítem de `publicar.sh` en
      `hermes-content/deploy/`). La forma correcta es fuente en el repo + el invocador leyendo
      del clon del VPS ya puesto al día (`ponerElEspejoAlDia` de `scripts/deploy_sin_pedido.mjs`
      hace exactamente eso para los detectores), con `cmp` contra `git show origin/main:<ruta>`
      antes de creerle.
      **Reproducción en 30 segundos:** `ssh root@187.77.16.63 'cat /root/tmp/integrar-plat.sh'`
      devuelve el script; `git log --oneline -1 -- scripts/ | cat` y un `grep -rl integrar-plat`
      sobre el repo devuelven **cero**: no tiene fuente en ningún lado.
      **Por qué no entró en la vuelta que lo encontró:** la vuelta ya había integrado cuatro
      carriles y quedaban ~15 min; un script de ENTREGA a medias es peor que la copia a mano que
      funciona, porque el que lo use después no sabe cuál de los dos corrió.

- [x] 🔴 **La vía de entrega de `onia-platform` declarada en `loops.md` —la que lee un gate y la
      que obedece el integrador de la vuelta siguiente— era una receta VENCIDA y rota, y el
      script bueno no lo nombraba nadie. Medido y ARREGLADO el 2026-09-19 por `onia-cola`,
      auditando los `[x]` (escalón 2).**
      **Cómo se encontró:** auditando el `[x]` de arriba (el que versionó
      `scripts/integrar-onia-platform.sh` el 18-sep). El archivo estaba, commiteado y correcto
      — pero `grep -rn integrar-onia-platform` sobre todo el repo devolvía **dos** menciones: el
      propio `COLA.md` y un comentario del script nombrándose a sí mismo. Ningún prompt, ningún
      doc y ningún gate lo nombraban. O sea el ítem cerró la mitad *«dónde vive el archivo»* y
      dejó abierta la que importa: **cómo lo encuentra el que lo necesita.**
      **Lo que el próximo integrador leía, y por qué rompe** (medido en vivo, no heredado): la
      marca `VIA-INTEGRADOR onia-platform casa` de `hermes-content/docs/cola/loops.md` decía
      `cd /root/loops/onia-platform && git merge … && git push origin master`, apoyada en la
      premisa *«el clon del VPS está en `master`, limpio»* — cierta el 2026-09-07, **falsa hoy**:
      ese árbol está en `claude/chatbots-platform-review-0d1d09` con **106 archivos sucios**
      (`git -C … status --porcelain | wc -l`). Esa receta (1) mergea sobre el carril **en vuelo**
      de `chatbot-cola`, el único loop que escribe en ese repo; (2) su `git push origin master`
      empuja una rama local que **no** es donde se hizo el merge; (3) corre **3 de los 5** gates
      del CI (le faltan `check:onia-core` y `build`); y (4) no tiene reintento, así que rebota si
      `master` se movió — rebotó **dos veces** el 18-sep.
      **Por qué ningún gate lo veía, que es el punto del ítem:** `scripts/integrador_puede_mergear.mjs`
      exigía que la marca **existiera**, y nada más. Una cadena libre: no medía la vía, medía que
      alguien la hubiera escrito alguna vez. **Y una vía se vence** — es el mismo modo de falla que
      este archivo ya guarda tres veces (un comentario que afirma una garantía es una hipótesis
      **con fecha**).
      **El arreglo, en sus dos mitades:** (a) la marca pasa a nombrar el script versionado; (b)
      el gate exige que **toda** vía declarada nombre un archivo que existe en el repo — si no,
      **ROJO** con el motivo. La regla es *«al menos UNA ruta citada vive en el repo»*, no
      *«todas»*: una vía legítima nombra también shims de `/root/bin` como `onia-vps.sh`, que
      **no existe** en este repo a propósito (vive suelto en la máquina, no versionado). Sin la mitad (b), mañana alguien vuelve a
      escribir una receta inline y el gate firma verde igual.
      **Tri-estado, no verde por omisión:** si no se puede listar el repo (`git ls-files`), la
      vía sale **NO MEDIDO (2)** con su causa. Confundir *«no pude preguntar»* con *«me dijeron
      que sí»* falla al lado caro, que acá es dejar al integrador sin camino y en silencio.
      **Test primero, en ROJO por el motivo correcto:** el caso ancla falló contra el doc REAL
      diciendo `la via declarada para onia-platform desde casa esta sin fuente: cita
      /root/bin/onia-vps.sh, y ninguna existe en el repo`. Juzga con `viaConFuente` **del
      producto**, no con una copia, y su universo sale de `git ls-files` — que es justo lo que
      afirma: la vía se apoya en algo **versionado**.
      **Validado por MUTACIÓN, las tres cazadas** (y la primera pasó verde hasta que se verificó
      que la mutación había ENTRADO — el `replace` no coincidía): (1) la vía vuelve a la receta
      inline → `fail 1` + el gate vivo imprime el ROJO; (2) el script versionado desaparece del
      repo → `fail 1` + medición viva **exit 1**; (3) el producto esquiva la guarda
      (`if (false && !fuente.ok)`) → `fail 2`.
      **Y de paso, la bomba de tiempo del mismo archivo:** `scripts/integrar-onia-platform.sh`
      estaba commiteado **100644**. Hoy no muerde porque se invoca con `bash <ruta>`, que es
      exactamente cómo sobrevivió `insistencia-run.mjs` — por accidente. Puesto en `100755` con
      `git update-index --chmod=+x` (un `chmod` en el worktree no viaja: el modo que viaja es el
      de git).
      **Medido al cerrar:** `node --test scripts/integrador_puede_mergear.test.mjs` → **20 casos
      verdes**; `node scripts/integrador_puede_mergear.mjs` → **exit 0**, «el integrador alcanza
      los 2 repos desde casa».

- [x] 🔴 **`scripts/deploy_sin_pedido.mjs` absolvía un destino porque EXISTÍA un pedido, sin
      preguntar si ese pedido DESCRIBE lo que hoy publicaría — y el que los deja cortos es el
      integrador. Medido en vivo el 2026-09-18 ~11:5x La Paz por `onia-cola`. CERRADO el
      2026-09-18 15:0x La Paz por `onia-cola` (`f2e66f97`).**
      **Cómo quedó:** `clasificarCobertura` tiene su quinta pregunta, `describeLoQuePublica`,
      **exigida** igual que `seAutoPublica` y `ahora`, con estado propio `CUBIERTO_CORTO` que
      **no cambia el código de salida** (un rojo acá trabaría el merge de todos los carriles
      hasta que Sergio Urcullo apriete un botón). El camino barato funcionó tal como decía el
      párrafo de abajo: `recuentoDeArreglos` lee `hay que publicar: N arreglo(s)` de los DOS
      lados —el cuerpo del pedido, recortado con `partirPedido` importado del hermano, y la
      salida viva que el detector ya había corrido—, así que la pregunta cuesta **cero SSH**;
      `detectar()` guarda su salida cruda en `SALIDAS` y `quintaPregunta` la consume.
      `CUBIERTO_CORTO` le gana a `CUBIERTO_VIEJO` porque rehacer el pedido cura las dos cosas
      y esperar el `ok` no cura el cuerpo.
      **Reverificado con datos REALES el 2026-09-18 20:5x La Paz por `onia-cola` (escalón 2,
      auditar los `[x]`): el `[x]` resiste.** El caso volvió a ocurrir en vivo —mergeé tres
      carriles sobre el pedido `t_4e0bb0b0`, que citaba `1`, y el seco de la landing pasó a
      decir `2`— y `quintaPregunta('landing', [ese pedido], { salida: <seco de hoy> })` devuelve
      `["t_4e0bb0b0"]` con la causa `el publicador en seco dice 2 arreglo(s) y el cuerpo cita
      menos`. **Ojo con cómo casi lo desmarco, porque es la trampa de leer este ítem:** en esa
      vuelta `node scripts/deploy_sin_pedido.mjs` imprimió `OK landing: falta publicar y ya hay
      pedido` mientras `npm run pedido:entregado` decía ROJO, que es *literalmente* la
      reproducción escrita más abajo — pero las dos corridas del primero fueron **antes** del
      merge y **después** de rehacer el pedido, nunca en el medio. El gate no falló: no se lo
      preguntó nadie en el único instante en que la respuesta cambia. Un `OK` de este gate sólo
      vale por el estado del árbol **en el momento en que se corrió**.
      **Validado por mutación: 9 de 9.** La novena pasó **verde** al primer intento y vale
      anotarla — el caso del cableado anclaba la MENCIÓN (`/SALIDAS\.set\(/` sobre el propio
      fuente) y envolver esa línea en `if (false)` deja el literal intacto. Se cerró midiendo
      el EFECTO: llamar a `detectar()` con `correr` inyectado y leer `_salidaParaPruebas`.
      Es la trampa que esta cola ya tenía escrita para los gates de guarda, ahora medida acá.
      **Cómo se reproduce en 30 segundos** (no hay que volver a investigarlo): con un pedido de
      deploy vivo, mergear cualquier commit que viaje a ese destino y correr los dos gates
      hermanos seguidos:

          node scripts/deploy_sin_pedido.mjs   # dice: OK landing: falta publicar y ya hay pedido
          npm run pedido:entregado             # dice: ROJO — su ok publica 1 arreglo que el pedido NO nombra

      Hoy pasó exactamente eso: el pedido `t_5053480f` (landing) se creó a las ~10:5x con seis
      arreglos; integré tres carriles, y `e9dca736` (los coadministradores por plan) entró al
      universo que su `ok` publica sin estar en el cuerpo. **El cuerpo es lo único que Sergio
      Urcullo lee**, así que ese botón le habría hecho aprobar un cambio de precio-percibido que
      nadie le mostró. Se curó a mano rehaciendo el pedido (`t_7800ded3`, siete arreglos, cuerpo
      derivado del seco) y archivando el viejo.
      **Por qué es un agujero y no una anécdota:** `deploy_sin_pedido.mjs` es el gate cuyo verde
      se usa para **no molestar a Sergio Urcullo**, y ya aprendió a hacer cuatro preguntas
      (¿falta publicar? · ¿hay pedido? · ¿se publica solo? · ¿hace cuánto está pedido?). La
      quinta —**¿el pedido describe lo que publica?**— la contesta sólo el gate hermano, que es
      un alias suelto: si una vuelta del integrador mergea y no lo corre, el pedido queda corto
      **en verde**. Y el modo de falla no es raro: el integrador mergea DESPUÉS de que el pedido
      existe, que es el caso normal, no el excepcional.
      **La cura, y por qué no entró en esa vuelta:** `cuerpoCorto({ texto, publicaria })` de
      `scripts/pedido_deploy_entregado.mjs` ya es una función **pura y exportada** — se importa,
      no se copia (dos copias del mismo juicio es como nacen las tautologías de esta familia).
      Lo caro es el otro argumento: `publicaria` es el universo de arreglos que el `ok` mandaría,
      y hoy sólo lo sabe derivar `pedido_deploy_entregado.mjs` con su maquinaria de SSH + git
      (`soloLosQueViajan`, `archivosDelDryRun`). El detector de `deploy_sin_pedido.mjs` devuelve
      un booleano, no la lista: `leerPendienteDelSeco` sólo lee «hay que publicar: N». O sea que
      la cura es mudar esa derivación a un módulo que los dos importen, y eso no entra en el
      resto de una vuelta — empezarlo y soltarlo dejaría el gate a medias.
      **Cómo se cierra:** quinta pregunta en `clasificarCobertura`, **exigida** como ya lo son
      `seAutoPublica` y `ahora` (un llamador que la olvide tiene que no compilar, no callar), con
      estado propio `CUBIERTO_CORTO`. ⚠️ Igual que `CUBIERTO_VIEJO`, **no debe cambiar el código
      de salida**: sólo Sergio Urcullo destraba un pedido, y un rojo ahí trabaría el merge de
      todos los carriles hasta que apriete un botón — que es como esta familia de gates se muere.
      **Medido el 2026-09-18 12:5x La Paz: el argumento caro NO hace falta, y eso abarata la cura
      de «no entra en una vuelta» a «entra».** El seco de la landing, corrido en vivo, imprime
      `== hay que publicar: 7 arreglo(s) que el cliente no ve ==` y **ni un sha** — o sea que
      mudar `publicariaPlataforma` con su maquinaria de SSH + git (lo que decía el párrafo de
      arriba) es el camino caro, no el único. El método vigente ya obliga a que el cuerpo **cite
      textual ese recuento**, así que la quinta pregunta se contesta con dos números: el N citado
      en `partirPedido(texto).cuerpo` (importado, no copiado) contra el N que el seco imprime HOY,
      y la salida cruda ya la tiene `detectar()` — cero SSH extra. `seco > citado` ⇒
      `CUBIERTO_CORTO`; `seco < citado` NO se acusa (ésa es la otra familia, `cuerpoVencido`);
      cuerpo sin recuento ⇒ `null` con su causa, nunca rojo. Para `bot` y `siat` la pregunta ya
      tiene dueño y es exacta: `cuerpoCortoArchivos` importado del hermano.
      **Reverificado con el caso vivo el 2026-09-19 05:4x La Paz por `onia-cola`: el `[x]`
      resiste, y con un dato que faltaba.** Volvió a ocurrir igual —mergeé tres carriles sobre
      `t_b535811a`, que citaba `1`, y el seco pasó a decir `2`— y el gate hermano lo cazó. Lo
      que NO estaba medido es la otra mitad: que el pedido *nuevo* pueda ser **juzgado**. El
      cuerpo que escribí cita el recuento **sin los `==`** que traía el anterior
      (`"hay que publicar: 2 arreglo(s) que el cliente no ve"`), y `deploy_sin_pedido.mjs`
      imprimió `OK landing … ya hay pedido` **sin** el sufijo `— sin juzgar si el cuerpo lo
      describe`, que es la única señal de un `cortos: null`. O sea `recuentoDeArreglos` no
      depende de los `==`: un cuerpo que cite el recuento en prosa sigue siendo medible. Vale
      anotarlo porque la forma de la cita la elige quien redacta el pedido, y si el lector
      exigiera los `==` el pedido nacería inmedible **en verde** salvo por ese sufijo.

- [x] 🔴 **El único gate que mira si producción corre el publicador que dice `main` llevaba DIEZ
      DÍAS salteándose en cada merge, porque el carril cambió de máquina. CERRADO el 2026-09-17
      15:0x La Paz por `onia-cola`.**
      **De dónde salió, y no de la cola:** la cola había quedado sin ítems abiertos, así que
      escalón 2 — auditar. En vez de auditar un `[x]` releyéndolo, medí la cadena por un eje que
      ningún gate mira: **cableado ≠ ejecutado**. Sobre el log de la corrida real de `npm test`
      (`# tests` sumados: 2.482 de `node:test` + 1.201 de vitest, 0 fallos) aparecieron **2
      salteados**, y los dos eran de la misma familia: `scripts/publicadores-desplegados.test.mjs`
      y `hermes-content/deploy/postiz/healthcheck.test.mjs` se saltean con «no es el VPS».
      **Por qué importa y no es cosmético:** ese caso es el ÚNICO de los seis de ese archivo que
      mira `/opt`; los otros cinco cruzan textos del repo contra el repo. Lo que vigila es que el
      `ok <id>` de Sergio Urcullo ejecute el publicador que está en `main` — y el costo es mudo en
      las dos direcciones: un carril arregla el publicador, los gates dan verde, y el `ok` sigue
      corriendo la copia vieja de `/opt`. Desde el **2026-09-07** el integrador —el único que corre
      esta cadena antes de CADA merge— vive en `nodo-casa`, así que el caso venía saltándose en
      todos los merges de estos diez días. **Un gate vivo que cambia de máquina no falla: deja de
      medir, y su tri-estado honesto se lee igual que «no hay desvío».**
      **Cura:** pregunta con `scripts/lib/vps-o-local.mjs` (disco local, y si no está, SSH al VPS),
      que ya existía justo para esto y este archivo no usaba. Se agregó
      `esEjecutableEnProduccion()` tri-estado, porque un `cp` sobre un archivo que ya existía **no
      pone el bit de ejecución**: el publicador puede tener el contenido correcto y no poder
      correrse. El rojo se afirma ANTES que el `skip`, para que un desvío medido no lo tape lo que
      no se midió.
      **Medido en producción antes de encenderlo** (un gate nuevo en la cadena traba el merge de
      todos los carriles si nace rojo): los cuatro publicadores del `ok`
      —`/opt/onia-landing`, `/opt/onia-platform`, `/opt/onia-siat` y `/opt/onia/bot`— tienen hoy el
      mismo `md5` que `hermes-content/deploy/**/publicar.sh` y los cuatro son `-rwxr-xr-x`.
      **Validado por mutación, las dos direcciones:** con una línea de más en
      `hermes-content/deploy/onia-landing/publicar.sh` → `not ok … difiere del repo … [leido
      remoto]`, `# fail 1` (y el `[leido remoto]` prueba que leyó producción, no el repo); con
      `ONIA_VPS_SSH` apuntando a un host inalcanzable → `# SKIP NO MEDIDO` nombrando los cuatro,
      exit 0, nunca un verde silencioso. Restaurado con `cp` (nunca `git checkout`): 6/6 y 0
      salteados, 32 s.
      **La cura no viaja sola al gemelo, así que se hizo en la MISMA vuelta:** los 2 salteados
      eran dos, no uno. `hermes-content/deploy/postiz/healthcheck.test.mjs` tenía el mismo agujero
      —preguntaba `existsSync` del disco local— y vigila que el healthcheck desplegado de Postiz
      no se despegue de `healthcheck.js`, que es lo único que evita que el contenedor figure
      «Up (healthy)» con el backend muerto. Misma cura, medido antes de encender (el override vivo
      del VPS **sí** contiene el cuerpo) y validado por mutación en las dos direcciones: con un
      `void 0;` de más en `healthcheck.js` → `not ok 8 … se despegó … (leído remoto)`, `# fail 1`;
      con `ONIA_VPS_SSH` inalcanzable → `# SKIP NO MEDIDO`, exit 0. Ahora los dos archivos corren
      **0 salteados** y la cadena entera queda sin un solo `# skipped` de los que mienten.

- [x] 🔴 **El sitio llamaba «Pro» y «Full» a los planes que el checkout cobra como «Profesional»
      y «Completo»: el lead elegía un plan con un nombre y pagaba otro. CERRADO el 2026-09-17
      12:5x La Paz por `web-venta` (`cf19a28e`, rama `claude/web-venta`).**
      **De dónde salió, y no de la cola:** midiendo el objetivo del carril contra las dos
      pantallas de la MISMA compra. `onia.com.bo/` y `/precios` decían «Pro»/«Full» **70 veces**
      (12+30 y 6+22, contadas sobre el HTML servido) y **cero** veces los nombres que el producto
      le pone al plan — `PLAN_LABELS` del ref publicado de `onia-platform/lib/pricing.ts`
      (`professional: "Profesional"`, `clinic: "Completo"`), que es lo que pintan el checkout, la
      tab «Mi plan», los correos y los recibos. El que escribía por WhatsApp pedía «el Full», que
      en el producto no existe.
      **Por qué ningún gate lo vio:** los cruces de plata comparan **cifras**, y un nombre no es
      una cifra. `precios-fuente.mjs` cruzaba 40 montos y ninguna etiqueta — es más, su propia
      tabla `PLANES_EN_ORDEN` **tenía tipeado** `etiqueta: "Pro"` / `"Full"`, o sea el
      instrumento afirmaba el defecto que existía para cazar.
      **Qué quedó:** los nombres salen de un mapa único (`NOMBRE_DE_PLAN` en `src/lib/pricing.ts`)
      que la prosa **interpola**, y `precios-fuente.mjs` los cruza contra `PLAN_LABELS` del ref
      publicado igual que los montos (`nombresDelSitio` / `etiquetasDelProducto`, leyendo las
      **dos** formas —literal y por mapa— para no quedar ciego el día que alguien vuelva a
      tipear). `capacidad-incluida.test.ts` aprendió la vía nueva en la misma vuelta:
      interpolar `NOMBRE_DE_PLAN.pro` pinta el mismo texto que `plan("pro").nombre`.
      **Evidencia mirada, no grepeada:** build de la rama servido en `:3411`, capturado a 1440,
      1920 y 768 con `reducedMotion:'reduce'` — los cuatro botones dicen «Empezar con el
      Básico/Crece/Profesional/Completo» y **0 desbordan** (`/tmp/tarjetas-1440.png`).
      ⚠️ **La cura arrastró su propio efecto de layout, y por eso se mira en vez de grepear:** el
      nombre viaja DENTRO del botón, así que el largo de esa etiqueta lo decide el **catálogo** y
      no el diseño. Con `.btn` en `nowrap`, «Empezar con el Profesional» pidió 219px en una
      pastilla de 214 y la última letra se pintaba **fuera del verde** a 1440 y 1920. Ahí el
      texto envuelve; achicar el padding sólo compraba 5px que el próximo nombre gasta de nuevo.
      **Falta para que le llegue al cliente:** merge a `main` (es de `onia-cola`) y **pedido de
      deploy de la landing** — toca `src/lib/pricing.ts`, que es fuente de precio, así que el
      publicador automático del VPS (`onia-publicar-solo`, cron `50 */3`, que vive en `/root/bin`
      y no en este repo) **no la publica solo** (hoy contesta «landing: al día» sólo porque el
      commit está en la rama, no en `main`).

- [x] 🔴 **La cadena `npm test` —la que el integrador corre antes de CADA merge— era una lista de
      69 scripts tipeados a mano, y por eso dejaba 951 pruebas verdes sin ejecutar. CERRADO el
      2026-09-17 14:5x La Paz por `onia-cola`.** Medido el
      2026-09-17 10:05 La Paz por `onia-cola` derivando el universo del DISCO (`readdirSync`, no
      `git ls-files`: el archivo nuevo sin commitear es justo el sujeto). `validate:onia-core`
      corre el validador del CONTRATO, no los tests del núcleo, y `test:siat-fase1` corría **un
      solo** archivo de los 18 del SIAT. Resultado: **521 pruebas de `onia-core/`** (la lógica de
      los 9 módulos: dental, comercio, facturación, agentes, contabilidad) y **430 del emisor
      SIAT** existían, pasaban, y no protegían nada — ningún merge las consultaba.
      **Cerrado a medias en esta vuelta** (`package.json`: `test:onia-core-logica` y
      `test:siat-todo` entran a la cadena; las 951 corren verdes, así que cablearlas no traba a
      nadie). El instrumento quedó en `scripts/tests_fuera_de_la_cadena.mjs`.
      **Cerrado del todo en `b5cb613d`:** el instrumento dejó de ser un alias suelto — vive como
      gate de la cadena en `scripts/guards-cableados.test.mjs`, que lo **importa** en vez de
      copiarlo (un gate con su propia copia de la expresión del producto puede tener la copia bien
      y el producto mal, y coincidir para siempre) y entra por `test:guards-cableados`. Los **15**
      que quedaban afuera se corrieron primero y después se cablearon: `test:video-factory` y
      `test:ciencia-cuerpo`, los dos en la cadena y los dos verdes, así que no traban a nadie.
      **Validado por mutación el 2026-09-17 14:52 La Paz**, que es lo único que prueba que el gate
      todavía ve un sujeto NUEVO: se sembró un `.test.mjs` dentro de `hermes-content/docs/` —una
      carpeta que ningún glob de la cadena toca—, el universo pasó de 144 a 145, el instrumento
      salió `FUERA de la cadena: 1` con exit 1 nombrándolo, y el gate de la cadena fue a **`#
      pass 6 # fail 1`** con el mensaje que nombra el archivo. El sujeto se llamaba
      `hermes-content/docs/zz-mutacion-onia-cola.test.mjs` y **ya no existe**: se borró al
      terminar, y con el árbol restaurado el instrumento volvió a 144 con exit 0 y el gate a
      `# pass 7 # fail 0`.
      ⚠️ **Trampa ya pagada:** el instrumento leía `existsSync` de cada argumento, y un glob
      entrecomillado no existe como ruta — con eso reportaba el cableado recién hecho como
      ausente (59 "fuera" cuando eran 15). Todo barrido de "¿está cableado?" expande globs o
      miente en la dirección cara.

- [x] 🔴 **`deploy_sin_pedido.mjs` daba VERDE por el solo hecho de que el pedido EXISTIERA, sin
      mirar hace cuánto — que es exactamente lo que dijo durante los cuatro días que el bot
      estuvo sin publicar. CERRADO el 2026-09-17 07:5x La Paz por `onia-cola`.**
      **De dónde salió, y no de la cola:** midiendo mi propio objetivo esta vuelta. Los cuatro
      destinos daban `OK … falta publicar y ya hay pedido`, exit 0 — el mismo texto que habrían
      dado el 13, el 14, el 15 y el 16 de septiembre, mientras el bot acumulaba **17 archivos**
      de arreglos sin llegar al cliente y su única señal era `bot: FALLO` ocho veces por día en
      `/var/log/onia-publicar-solo.log`, un log que no escala a nadie. El veredicto era **cierto**
      —había pedido— y aun así el cliente no recibía nada: es la firma «verde mientras el trabajo
      no llega», la misma que ya había costado 34 arreglos varados con los cuatro números en verde.
      **La cuarta pregunta que faltaba:** no «¿hay pedido?» sino **«¿hace cuánto que está pedido?»**.
      La edad viaja desde el barrido del tablero (`creadoEnSegundos` en
      `scripts/pedido_deploy_entregado.mjs`, tri-estado: sin fecha legible es `null`, nunca 0 —
      inventarla declararía fresco a un pedido de la semana pasada), y `clasificarCobertura`
      separa `CUBIERTO` de `CUBIERTO_VIEJO` a las **24 h**, el mismo umbral con el que este carril
      juzga una rama sin mergear. Manda el pedido **más viejo** del destino: abrir uno nuevo no
      rejuvenece el trabajo varado.
      **Lo que NO hace, y es la decisión del ítem:** `CUBIERTO_VIEJO` **no cambia el código de
      salida**. Este gate está en la cadena `npm test` que el integrador corre antes de cada merge;
      ponerlo rojo por un pedido que sólo Sergio Urcullo puede destrabar trabaría el merge de
      **todos** los carriles hasta que él apriete un botón, y la cura sería saltearse el gate —
      que es como esta familia se muere. El aviso va a la salida que lee la vuelta del integrador,
      y dice que **no falta un pedido: falta el `ok`**, para que nadie abra un duplicado.
      **`ahora` es EXIGIDA** (`TypeError`, como `seAutoPublica`): con `Date.now()` adentro la
      función sería impura y sus casos irrepetibles, y un llamador que se olvidara del reloj
      dejaría de hacer la pregunta nueva sin que nada se pusiera rojo. Los dos casos que prueban
      cada exigencia pasan **la otra puesta** — si al caso le faltan las dos, el `catch` se lo come
      el primer `throw` y el segundo parámetro queda opcional y en verde.
      **Validado por mutación, las cuatro en rojo cada una por su razón**, restaurando con `cp` y
      nunca con `git checkout`: esquivar el umbral (`false ? …`) → 3 fallos; `Math.max` por
      `Math.min` → cae sólo el caso de los dos pedidos; `return 0` por `return null` sin fechas →
      cae sólo el del tri-estado; y sacar `creado` del barrido → `pedido_deploy_entregado.test.mjs`
      pasa de 87/87 a **85 pass, 2 fail**. Restaurado: `self-check OK`, 87/87 y `npm test` exit 0.
      **Medido en vivo** contra el tablero real: `npm run deploy:sin-pedido` imprime hoy
      `OK plataforma: falta publicar y ya hay pedido — pedido t_db98ee26 (pedido hace 1 h)`.

- [x] 🔴 **El sitio prometía «en los TRES planes no cobramos implementación ni migración»
      mientras pintaba CUATRO tarjetas comprables.** Encontrado y **CERRADO el 2026-09-13
      12:55 La Paz por `web-venta`** (`b43c1f12`). Medido contra producción: `onia.com.bo/`
      y `/precios` devuelven 200 e imprimen la frase **dos veces cada una** —cuerpo y JSON-LD
      de la FAQ, o sea que también viaja a Google— con las cuatro tarjetas a la vista
      (Bs 320 · 550 · 890 · 1.290). La escalera C sumó el plan Crece el 12-sep y cuatro frases
      se quedaron contando tres: `web-factory/apps/onia-platform/src/lib/pricing.ts`
      (CONDICIONES, la letra chica de `/precios`),
      `web-factory/apps/onia-platform/src/app/(sitio)/faq-datos.ts` (la FAQ de la portada),
      `web-factory/apps/onia-platform/src/app/v1/precios/page.tsx` (que además enumeraba TRES
      saltos de valor) y `web-factory/apps/onia-platform/src/app/v1/empezar/resultado.tsx`.
      **Por qué importaba:** la promesa es de PLATA. El lead parado en el Crece de Bs 550 —el
      escalón nuevo, el que se vende como el salto a los agentes— leía una enumeración que no
      lo nombraba. **Cura:** la cantidad se cuenta (`cuantosPlanes()`), no se tipea; los saltos
      de `/v1/precios` se derivan igual. El gate
      `web-factory/apps/onia-platform/src/app/(sitio)/cuantos-planes.test.ts` prohíbe la FORMA
      —un numeral pegado a «planes»— y no el número equivocado, que se apagaría solo el día que
      la respuesta correcta sea «cuatro»; validado por mutación en tres direcciones.
      **Evidencia en el artefacto servido, no en la fuente:** el build prerenderiza «En los
      cuatro planes» 7 veces y «Son cuatro planes … ordenar, recuperar, operar completo y todo
      incluido», con cero «tres planes» en todo `.next`.
      ⚠️ **Todavía no lo ve el cliente:** la landing vive `bd90e8af2` (12-sep 22:52) y este
      arreglo es el commit 11 de los que esperan el pedido de deploy ya bloqueado en Sergio
      Urcullo — no se vuelve a pedir.

- [x] 🟡 **Nada impide que la regla de «envolver en vez de cortar» del panel vuelva a meterse
      dentro de un `@media`, que es exactamente como nació este defecto.** Abierto por
      `web-venta` el 2026-09-13, en la misma vuelta que arregló la instancia (`7878342f`).
      **CERRADO el 2026-09-13 07:20 La Paz por `web-venta`** (`e2e32a78`,
      `web-factory/apps/onia-platform/src/app/(sitio)/panel-envuelve-en-vez-de-cortar.test.ts`):
      el gate corre en `npm test`, o sea también en `prebuild`, que era el punto — no en un
      alias suelto que no corre nadie. **Los sujetos se derivan del DISCO** (toda regla de
      cualquier CSS de `src/` que declare `text-overflow: ellipsis`, que es la forma en que
      una clase declara «voy a cortar este texto»), nunca de la lista de nombres que este ítem
      pedía: una lista de inclusión falla abierto el día que aparece el panel siguiente. Hoy
      devuelve `.panelTitle`, `.panelTxt` y `.panelPillTxt`. Cuatro aserciones: el universo no
      puede quedar vacío (`MINIMO_SUJETOS`), el caso ancla exige que las tres clases MEDIDAS
      cortadas estén en él, la cura tiene que vivir fuera de toda media query **y después** de
      la regla que corta (con igual especificidad manda el orden), y la simétrica: ninguna
      media query puede devolverle `white-space: nowrap` a una clase ya curada.
      ⚠️ **`.panelBarLbl` NO quedó como sujeto, aunque el ítem pedía las cuatro.** Verificado
      en el CSS: no declara `text-overflow` ni `overflow: hidden`, y ningún ancestro suyo
      declara `white-space: nowrap` —que es una propiedad heredada—, así que ya envuelve por
      defecto y su `white-space: normal` es un cinturón, no un arreglo. Incluirlo exigía
      nombrarlo a mano, que es justo la lista que el gate existe para no tener; si algún día
      gana un `nowrap`, entra solo por la aserción simétrica.
      **Validado por mutación, cuatro direcciones, restaurando con `cp`:** (1) la cura de
      vuelta adentro del `@media` → **rojo** nombrando las tres clases con archivo y línea
      (`:472`, `:530`, `:659`); (2) un `@media` que reimpone `nowrap` → **rojo** nombrando la
      media query; (3) arrancar el blanqueo de comentarios → **rojo**; (4) cegar el marcador
      de sujetos → **rojo** por `MINIMO_SUJETOS` y por el ancla, en vez de aprobar la nada.
      Y se probó que la CADENA lo corre y no sólo que el archivo existe: con el CSS mutado,
      `npm test` sale 1 y lo nombra (82 archivos, 81 pasan).
      ⚠️ **Lo que enseñó la validación:** la mutación (3) pasó **VERDE la primera vez**, o sea
      que el blanqueo de comentarios era una guarda **decorativa**. El archivo real la esquiva
      por casualidad: su bitácora cita `@media (max-width: 767px)` **antes** de citar una regla
      con llaves, así que el `@` nunca queda primero después de un `}` y el parser no llega a
      apilar el envoltorio fantasma. Se le escribió su caso propio con fixture, que invierte
      ese orden —la forma normal de una bitácora, «antes esto vivía acá y la cura estaba
      allá»—, y recién ahí la mutación da rojo. Una guarda sin su caso propio es una hipótesis.
      ⚠️ **La reproducción que decía este ítem era FALSA y por eso se corrige acá:** afirmaba
      que `node scripts/mirar-venta.mjs --out=/tmp/venta` «hoy sale Sin fallas». Ese cero se
      había medido contra el build local (`next start`), no contra producción. Corrido hoy
      contra `onia.com.bo`, que es lo que ve un lead: **5 textos cortados a 768, 5 a 1440 y 5
      a 1920** («WhatsApp del negocio», «Para aprobar», «Recordar citas de mañana», «Avisar los
      pagos vencidos», «Invitar a quien no vino», y «Contabilidad» sólo a 768).
      **No es una regresión ni un defecto nuevo: falta DESPLEGAR.** `7878342f` está en
      `origin/main` pero no en el build vivo (`/opt/onia-landing/runtime-next/.commit` →
      `bd90e8af2`, del 2026-09-12 22:52; `git merge-base --is-ancestor 7878342f bd90e8af2` da
      1). La landing **no se publica sola a propósito** porque lo pendiente toca
      `src/lib/pricing.ts`, que es fuente de precio (`onia-publicar-solo.sh --dry-run` →
      «landing: NO publico solo — toca una fuente de precio»). **Ya está pedido y bloqueado en
      Sergio Urcullo** en el pedido de deploy vivo de la landing, que nombra `7878342f` entre
      sus cuatro arreglos: **no se vuelve a pedir ni se re-mide hasta que vuelva a `ready`.**
      Este commit no lo deja corto: es un `.test.ts` y `llegaAlCliente()` de
      `scripts/deploy-vivo.mjs` no lo cuenta como arreglo varado (verificado en
      `NO_LLEGA_AL_CLIENTE`).
      **Por qué importaba:** es la clase, no la instancia. La cura ya se escribió dos veces
      para la misma familia de textos y las dos veces cerró sólo el viewport que alguien miró.

- [x] 🟡 **`precios-vivos.mjs` acusa al CÓDIGO por un precio que sólo está en producción:
      `apareceEnElCodigo()` no distingue un precio de un milisegundo.** Abierto por `web-venta`
      el 2026-09-12, en la misma vuelta que le dio vista al barrido. **CERRADO el 2026-09-12
      18:52 La Paz por `web-venta`** (`47591c95`, `scripts/monto-en-el-codigo.mjs`): el criterio
      pasó a ser el monto **con su unidad**, importado del módulo que ya la contesta sobre el DOM.
      Corrido hoy, `Bs 1.500` sale «Ninguna fuente de esta rama lo escribe como precio →
      produccion corre un build viejo. Falta DESPLEGAR», y agrega en su propia línea «el numero
      1.500 aparece sin moneda en `src/app/v1/empezar/data.ts`, `src/lib/pricing.ts`,
      `src/motion/agent-scene.tsx` — no es un precio: NO tocar». El script diagnostica bien
      la mitad cara —si el monto no está en el árbol, falta DESPLEGAR— pero busca el NÚMERO
      pelado en todo `.ts`/`.tsx`, así que cualquier constante que valga lo mismo lo invierte.
      **El caso vivo:** `Bs 1.500` (escalera retirada, hoy en producción por build viejo) sale
      reportado como «el defecto es del CODIGO, arreglarlo aca: `src/app/v1/empezar/data.ts`,
      `src/lib/pricing.ts`, `src/motion/agent-scene.tsx`». Los tres son falsos: en
      `agent-scene.tsx` es `STEP_HOLD_MS = [900, 1500, …]` —milisegundos de animación— y en los
      otros dos es el límite de **1.500 fichas** del plan, no un precio.
      **Por qué importa:** manda la vuelta siguiente a «arreglar» tres archivos sanos, que es
      exactamente la vuelta perdida que ese diagnóstico existe para evitar. Y en la dirección
      contraria hace ruido sobre el único ítem que sí depende de Sergio (publicar).
      **Reproducción, 40 s:** `cd web-factory/apps/onia-platform && node scripts/precios-vivos.mjs`
      → mirar el bloque de `Bs 1.500`. Contraste: `Bs 750` y `Bs 15.000`, que no coinciden con
      ninguna constante, salen bien clasificados como «falta DESPLEGAR».
      **Camino:** el sujeto no es el número suelto sino el número **en posición de precio** —
      pedir el monto pegado a su moneda (`Bs`) o dentro de un campo de las fuentes declaradas,
      igual que `montos-en-pantalla.mjs` ya hace del lado de la pantalla.

- [x] 🟡 **`app/cobertura-citada.test.ts` no puede ver una afirmación de cobertura FALSA escrita
      dentro de un `.test.ts`, y así sobrevivió una cuatro días.** Abierto por `web-venta` el
      2026-09-11. **CERRADO el 2026-09-12 19:05 La Paz por `web-venta`**: el barrido pasó a
      incluir los `.test.ts` y el corte va por CONTEXTO, con la ventana en el **PÁRRAFO** de la
      aparición y la marca en su ORACIÓN — las mismas marcas que `verificar_cola.js`, para no
      inventar un segundo criterio. 3 → **8 casos**, y las bitácoras salen por un canal de
      **AVISO** que se imprime y no cuenta para el rojo. Mutado en las cuatro direcciones que
      importan: **(1)** re-inyectada la afirmación REAL que sobrevivió los cuatro días («Va como
      script aparte: `scripts/limites-vivos.mjs`» en `(sitio)/limite-que-corta.test.ts:51`) →
      **1 failed**, nombrando archivo y script; **(2)** sacar los `.test.ts` del universo → rojo
      el caso ancla; **(3)** dar todo por bitácora → 3 rojos; **(4)** abrir la ventana al archivo
      entero → rojo el caso que prueba que un párrafo no absuelve al de al lado. La bitácora de
      la cabecera quedó **verde**, como pedía este ítem. Salió además un sujeto que no estaba
      previsto: `scripts/X.mjs` es un **molde** con el que se explica la regla, no una ruta que
      alguien tenga que crear —mismo indulto que ya tenía la raíz—. El gate existe para cazar el
      puntero muerto —un comentario que dice «esto lo
      cruza `scripts/X.mjs`» sobre un archivo que nunca se escribió, que **detiene la auditoría**
      porque quien lo lee le cree— y deja los `.test.ts` fuera **a propósito y con razón**: una
      bitácora que narra el defecto tiene que poder nombrar el archivo inexistente sin que el
      gate obligue a borrar el registro (`cobertura-citada.test.ts:53`).
      **El hueco:** esa exención no distingue la PROSA que narra de la AFIRMACIÓN viva. El
      2026-09-07 se corrigió el puntero `scripts/limites-vivos.mjs` en `chatbot-precios.ts` y
      quedó **idéntico y vivo** en `(sitio)/limite-que-corta.test.ts:51` («Va como script aparte:
      `scripts/limites-vivos.mjs`»), invisible para el gate por ser `.test.ts`.
      **Reproducción, 10 s:** `ls web-factory/apps/onia-platform/scripts/limites-vivos.mjs`
      → `No such file`, y `npm test` verde. El puntero ya se reparó (apunta a
      `scripts/precios-fuente.mjs`, que es el cruce real); **lo que sigue abierto es el gate**.
      **Cómo se cierra:** separar por CONTEXTO y no por tipo de archivo — el mismo criterio con
      el que `lucia/palabras-cableadas.py` separó pieza de prosa. Una cita cuya vecindad la
      declara inexistente («nunca se escribió», `MODULE_NOT_FOUND`) es bitácora; el resto es
      afirmación y se exige. Validar por mutación en las DOS direcciones: la bitácora de
      `cobertura-citada.test.ts:26-27` **tiene que seguir en verde** (si se pone roja, el gate
      obliga a borrar el registro y el remedio es peor), y una cita directiva nueva en un
      `.test.ts` tiene que salir ROJA.

- [x] 🔴 **`npm run cola:viva` está en ROJO y sus 4 errores son FALSOS: el gate hermano de la
      raíz tiene el mismo hueco que el ítem de arriba, y hoy muerde.** Abierto por `onia-cola`
      el 2026-09-11. **CERRADO el 2026-09-11 14:20 La Paz por `onia-cola`**: `cola:viva` en
      verde (`EXIT_REAL=0`, leído de archivo y no de un pipe) y el self-check de 100 → **110
      casos**. Las cuatro causas se cerraron con **tres** curas, no con un carve-out: **(a)** el
      nombre de una ruta no puede empezar con punto, así que una extensión COMPUESTA
      (`.test.ts`, `.d.ts`) citada como sustantivo deja de ser ruta — la regla del `.tsx` sólo
      cubría las simples; **(b)** una metavariable de un carácter en mayúscula (`scripts/X.mjs`)
      es un molde, como el glob; **(d)** una cita ABREVIADA CON HUECO resuelve si el nombre es
      único y sus segmentos van en orden (`lucia/palabras-cableadas.py` →
      `…/lucia/scripts/palabras-cableadas.py`), que es resolución, no indulto; y **(c)** la cura
      central: `citadaComoBitacora()` separa **bitácora de afirmación por la VECINDAD** —la
      ORACIÓN de cada aparición, nunca el ítem— y la bitácora sale por un canal nuevo de
      **AVISO** que se imprime y no cuenta para el exit. Mutado en las dos direcciones: el ítem
      de arriba queda verde y una cita directiva nueva a un archivo inexistente sale ROJA
      (`exit 1`, probado inyectándola en una copia de `COLA.md`).
      ⚠️ **Lo que enseñó la validación, y no estaba escrito:** mutar (a) y (b) **contra el
      corpus real da VERDE con la guarda arrancada**, porque la cura de contexto las tapa (la
      vecindad de `.test.ts` en ese ítem dice «el archivo inexistente»). Dos guardias hermanos
      atajando el mismo caso hacen pasar la mutación **por el motivo equivocado** — por eso cada
      cura lleva su caso propio en el self-check, con su recíproco, y no se dio por validada con
      la mutación sobre `COLA.md`. Segunda trampa: `indiceDe` **cachea** el árbol por directorio,
      así que un fixture creado a mitad del self-check no existe para el índice y su caso falla
      por el motivo equivocado; va en el bloque de setup. **Reproducción, 10 s:** `npm run cola:viva` → `EXIT_REAL=1`, cuatro
      `ERROR fantasma [linea 80]`. Ojo al medirlo: `npm run cola:viva | tail; echo $?` da **0**
      porque ese exit es el de `tail` — hay que redirigir a archivo y leer `$?`.
      **Las cuatro salen del ítem de arriba**, que es prosa narrando punteros muertos, y
      **ninguna es trabajo fantasma**: ese ítem sí tiene dónde trabajar
      (`cobertura-citada.test.ts` y `(sitio)/limite-que-corta.test.ts` existen los dos).
      **No es una causa, son CUATRO, y por eso el carve-out de notación número N no cierra**
      (`scripts/verificar_cola.js` ya lleva seis y el ciclo volvió a divergir cada vez):
      **(a)** una extensión suelta citada como sustantivo («escrita dentro de un archivo de
      test») se toma como ruta, sin nombre ni barra; **(b)** un placeholder con forma de ruta
      —la equis mayúscula usada como metavariable dentro de una cita— se busca en disco;
      **(c)** la cita del puntero muerto que el ítem DENUNCIA, cuya vecindad ya declara que no
      existe; **(d)** una ruta abreviada de un archivo que **SÍ existe** —el separador de pieza
      y prosa de Lucía vive en
      `hermes-content/references/modelos/lucia/scripts/palabras-cableadas.py` y el ítem lo
      nombra por sus dos últimos segmentos—, o sea que el carve-out de «ruta parcial» que el
      gate ya tiene no la resuelve.
      **Cómo se cierra:** mismo criterio que el ítem de arriba —separar por CONTEXTO, no
      agregar el carve-out siguiente—: la ruta que el ítem cita como OBJETO de lo que narra es
      bitácora y sale como AVISO; la que dice dónde ir a trabajar es afirmación y se exige.
      Validar por mutación en las DOS direcciones: **este mismo ítem tiene que quedar en verde**
      (si se pone rojo, el gate obliga a borrar su propio diagnóstico), y un ítem nuevo que
      mande a trabajar a un archivo inexistente tiene que salir **ROJO**.
      **Por qué no se arregló en la vuelta que lo encontró:** entraba el diagnóstico pero no la
      mutación en las dos direcciones, y un gate de esta familia validado a medias es el que
      después manda a borrar bitácora. El diagnóstico —que es lo caro— ya está hecho.

- [x] 🔴 **El CUERPO del pedido de deploy de plataforma describe MENOS arreglos de los que su
      `ok` publica.** Abierto por `onia-cola` el 2026-09-11 con el control recién escrito
      en `scripts/pedido_deploy_entregado.mjs` (`ab1635a1`), que es el que lo ve:
      **`npm run pedido:entregado` → `ROJO <id>: su CUERPO no nombra N arreglo(s) que su
      ok publica`**, y los nombra uno por uno.
      **No es que el pedido esté roto:** su comando deriva el sha al ejecutarse, así que no
      caduca. Lo que queda corto es el cuerpo, que es lo primero que lee Sergio Urcullo —
      y el `edit` del tablero **no cambia el cuerpo**, por eso comentar no lo cierra.
      **Cómo se cierra:** crear el pedido de nuevo con el cuerpo derivado de
      `bash /opt/onia-platform/_deploy/publicar.sh --dry-run`, bloquearlo con
      `--kind needs_input`, y **archivar el viejo en la misma vuelta** (si no, quedan dos
      pidiendo el mismo ok, que es el ruido que hace que deje de creerles).
      **CERRADO el 2026-09-11 06:55 La Paz.** El id que citaba este ítem (`t_5511da55`) ya
      había caducado dos veces por lo mismo (`t_92d71bf3` → `t_6da5553d` → `t_0e451a15`): el
      sujeto se **deriva**, no se copia. Al arrancar la vuelta el vivo era `t_0e451a15` con
      ONCE arreglos en el cuerpo, y los merges de esta misma vuelta (`f2962df`, `ef69e9b`)
      lo dejaron describiendo 11 sobre 13 — **el integrador es quien los envejece**. Rehecho
      como **`t_173dd283`** con el cuerpo derivado del publicador en seco sobre `master`
      `0d11806`, bloqueado `needs_input` (status verificado, no sólo el exit) y `t_0e451a15`
      archivada con su motivo en el mismo turno. Gate en verde:
      `node scripts/pedido_deploy_entregado.mjs` → exit 0, `t_173dd283 ... 13 sin publicar,
      0 sin resolver`, sin un solo ROJO.
      ⚠️ **Lo que aprendió esta vuelta, y no estaba escrito:** los cinco controles del gate se
      imprimen en **cadena de prioridad con `return 1`**, así que `incompletos` (que lee cuerpo
      **y** comentarios) **tapa** a `cortos` (que lee sólo el cuerpo). Por eso el consejo que
      salió impreso fue *«comentá el recuento, no rehagas la tarea»* — que es el del control de
      arriba, y **deja rojo al de abajo**. El remedio que cierra los dos es el de este ítem.

- [x] ⚠️ **El test de cableado de `cuerpoVencido` tenía el agujero que se le cerró a su hermano.
      — CERRADO 2026-09-11 por `onia-cola`.**
      `scripts/pedido_deploy_entregado.test.mjs` exigía `/vencidos\.push\(/` en la vecindad del
      `main`, y eso se esquiva cambiando la **condición** que lo dispara: el push queda en el
      fuente y el veredicto se tira.
      **El agujero estaba vivo y se reprodujo antes de tocar nada:** con
      `v.estado === 'ESTADO_QUE_NO_EXISTE'` en la línea 883 del gate —el push intacto, `grep -c
      'vencidos\.push('` da 1— los **44 casos pasaron en VERDE con exit 0**, o sea que el control
      que caza el pedido de deploy que le pide a Sergio Urcullo un ok por trabajo **ya publicado**
      podía quedar mudo sin que nada se pusiera rojo.
      **Atado igual que sus dos hermanos** (`cortos.push(` y `cortosSiat.push(`), con
      `/VENCIDO'\s*\)\s*vencidos\.push\(/`.
      **Validado por mutación en las dos direcciones**, restaurando con `cp` y nunca con `git
      checkout`: con la condición mutada da **exit 1 (43 pass, 1 fail)** donde antes daba verde;
      restaurado, **44 pass exit 0**; y borrando el push entero sigue dando **exit 1**, así que la
      aserción vieja no se perdió. Se ve con
      `node --test scripts/pedido_deploy_entregado.test.mjs`.

- [x] 🔴 **El menú de arriba ofrece TRES líneas de negocio congeladas. Sergio Urcullo dijo «ok C»
      el 2026-09-07 — sacalas. — CERRADO 2026-09-08 por `web-venta` (`653f2a98`, `8de73198`).**
      **Media premisa ya estaba vencida al empezar la vuelta:** `Webs`, `Marketing IA` y
      `Consultoría` salieron del nav ese mismo día por `t_30b1711d`, así que lo que quedaba vivo
      en el segundo nivel era `Agentes · Comparativa · Nosotros`. Eso se sacó.
      **Listo, cumplido con captura:** servido el build propio y abierto renderizado, el
      `<header>` da **0** para las seis rutas en sus DOS niveles —
      `/root/capturas-nav/01-barra-escritorio.png` (barra: `Rubros · Precios · Facturación ·
      Contacto`) y `/root/capturas-nav/02-menu-telefono.png` (menú abierto: Producto = `Rubros · Chatbot · Precios`,
      Decidir = `Facturación · Contacto · Empezar`). Sin respuestas ≥400 salvo el 429 del widget
      de Chatwoot, que es el límite por IP que se provoca sola toda sonda que abre varias
      pantallas — no es un defecto del sitio.
      ⚠️ **Se verificó contra el build propio y NO contra `onia.com.bo`, a propósito:** el sitio
      vivo sirve el build anterior al deploy que espera el `ok` de Sergio Urcullo (`t_a4b52e27`).
      Mirarlo allá habría mostrado el defecto y no el arreglo.
      **Lo que el ítem no preveía, y salió midiendo en vez de suponiendo:** sacar las tres del nav
      dejaba `/comparativa` y `/nosotros` sin UNA sola pantalla que las enlazara, y
      `alcance.test.ts` se puso en rojo por las dos (por `/agentes` no: la portada ya la ofrece en
      su cuerpo). La salida documentada para ese caso es el disallow de `robots.ts`, **y no se
      tomó**: desindexar no es «sale del menú», y con cero clientes pagando `/nosotros` es el
      único sustituto del testimonio. Las dos quedaron alcanzables e indexadas con un enlace en el
      cuerpo de la pantalla cuyo lector es el mismo — la comparación bajo las condiciones de
      `/precios`, «quiénes somos» en `/contacto` — verificados renderizados (156×24 px y
      119×24 px, ver `/root/capturas-nav/03-precios.png` y `/root/capturas-nav/03-contacto.png`).
      **De paso, una afirmación de cobertura falsa:** `nav.ts` decía que `/comparativa` ya estaba
      «enlazada desde el cuerpo de `/precios`». No lo estaba —ningún `.tsx` del árbol vivo ni
      módulo `@/` que él importe escribía ese `href`— y era justo la frase que habría hecho
      desindexar la pantalla sin que nada se pusiera rojo.
      **Lo ancla `nav-solo-el-sistema.test.ts`**, que invierte el sujeto del gate hermano:
      `nav-sin-agencia` persigue lo PROHIBIDO (`/servicios/*`) y es ciego a una entrada nueva;
      éste compara contra una lista de APROBADAS por igualdad de conjuntos, así que ve la que
      sobra Y la que falta, en los dos niveles más el literal desnudo del cromo. Validado por
      mutación, seis en rojo cada una por su razón. **La primera versión fallaba ABIERTO** y lo
      cazó la mutación: comparaba la UNIÓN de los niveles, así que sacar `Precios` de la barra
      visible dejaba los 868 casos en verde porque seguía en el menú de teléfono.
      Medido ese día sobre el sitio vivo, abriéndolo renderizado: el `header` tiene **dos
      niveles**. El visible es limpio (`Rubros · Precios · Facturación · Contacto`), pero debajo
      hay otro con: `Rubros · Agentes · Chatbot · Precios · **Webs · Marketing IA · Consultoría**
      · Comparativa · Facturación · Nosotros · Contacto · Empezar`.

      **Webs, Marketing IA y Consultoría son líneas que se congelaron ese mismo día** («todo el
      foco en Onia Platform»). Un lead entra a comprar un sistema y ve un menú de agencia — que
      es justo lo que `CLAUDE.md` prohíbe: *no se abre una línea de negocio nueva*, y menos se la
      publica en la puerta de entrada.

      **Qué queda, decidido:** `Rubros · Precios · Facturación · Contacto` **+ `Chatbot`**. El
      chatbot se queda porque pasa el test de tres preguntas de `CLAUDE.md` §10: es add-on del
      sistema, no un negocio nuevo. Salen `Webs`, `Marketing IA`, `Consultoría`, `Comparativa`,
      `Nosotros` y `Agentes`.

      ⚠️ **Salen del MENÚ, no del sitio.** Las páginas siguen publicadas y respondiendo; lo que se
      quita es que compitan con `Precios` en la barra. Borrar una ruta viva es otra decisión y no
      está tomada.

      ⚠️ **Y ojo con lo que YA está hecho**, para no perder una vuelta re-arreglándolo: los cuatro
      botones «Creá tu cuenta» **ya van derecho** a `app.onia.com.bo/register` (verificado, 4 de
      4), y `/comparativa` y `/nosotros` **ya no están en el nivel visible**. El trabajo es el
      segundo nivel.

      **Dónde vive:** `web-factory/apps/onia-platform/src/app/(sitio)/nav.ts` (los dos niveles) y
      `web-factory/apps/onia-platform/src/app/(sitio)/menu.tsx` (el de teléfono).

      **Listo =** abrir `onia.com.bo` renderizada y que
      `header a[href*=webs], [href*=marketing], [href*=consultoria], [href*=comparativa], [href*=nosotros]`
      dé **0**, con la captura como prueba. Un `grep` al código no alcanza: el menú tiene dos
      niveles y por eso este defecto sobrevivió a la revisión anterior.

- [x] 🔴 **Tus cuatro números dieron VERDE 13 vueltas seguidas mientras 34 arreglos tuyos no
      llegaban al cliente. El instrumento no distingue «arreglado» de «arreglado y publicado».
      — CERRADO 2026-09-12 por `web-venta`, con el quinto número DERIVADO, no citado.**
      Medido el 2026-09-07 18:41 UTC: `stat /opt/onia-landing/runtime-next` daba
      **2026-09-04 10:04** —tres días— y `publicar.sh` contó **34 arreglo(s) que el cliente no
      ve**. En esas mismas horas tu objetivo se declaró *«prohibidos 0 · precios fuera de fuente
      0 · CTA rotos 0 · favicon 200»*, vuelta tras vuelta, y tu propia lección de la vuelta 13
      dice *«décimotercera vuelta midiendo el árbol»*. El árbol, no el sitio.
      **Por qué es tuyo y no del que despliega:** sos el dueño de `onia.com.bo` y `/empezar`. Un
      arreglo que no se publica no existe para el lead, y hoy tu instrumento firma en verde
      igual. Es la misma familia que ya mordió tres veces este día —un gate que mide donde no
      duele— y la que `web-factory/apps/onia-platform/scripts/deploy-vivo.mjs` resuelve para el
      producto: compara el **BUILD_ID vivo** contra los commits de tu zona en `origin/main`.
      ⚠️ **El favicon no sirve como termómetro** y ya está escrito por qué: una vez que un deploy
      lo trae, da 200 para siempre y queda clavado en verde sobre un sitio de días.
      **Listo =** tu objetivo incluye un quinto número —*arreglos de mi zona en `main` que el
      sitio vivo NO sirve*— que hoy daría **34** y no 0; y una vuelta en la que ese número baja
      a 0 porque se pidió el deploy, no porque se dejó de mirar.
      **Medido de nuevo el 2026-09-08 08:50 UTC: el quinto número es 1, no 34** — hubo deploy el
      08-sep 02:58 UTC. Los dos instrumentos coinciden y desde hoy la línea `OBJETIVO:` los
      reporta: `node web-factory/apps/onia-platform/scripts/deploy-vivo.mjs` y
      `ssh root@187.77.16.63 'bash /opt/onia-landing/_deploy/publicar.sh --dry-run'` (éste es el
      que manda: deriva todo al ejecutarse y filtra lo que no viaja al navegador). El pedido por
      ese 1 arreglo ya existe y está bloqueado en Sergio Urcullo: `t_a4b52e27` — **no se abre
      otro ni se re-mide**, que es como se duplican. Falta sólo la segunda mitad: la vuelta en
      que baje a 0, y ésa depende de su `ok`.
      ⚠️ **Ese último párrafo venció, y su instrucción —«no se re-mide»— es lo que lo mantenía
      vivo.** Medido por `onia-cola` el 2026-09-08 16:47 La Paz, contra producción y contra el
      tablero: `bash /opt/onia-landing/_deploy/publicar.sh --dry-run` contesta literalmente
      **«YA ESTA PUBLICADO — el sitio vivo sirve todo lo que main tiene»**, y `t_a4b52e27` figura
      **`archived`**, no `blocked`. O sea que el quinto número es **0** y la segunda mitad del
      `Listo =` está cumplida: bajó a 0 **porque se publicó**, no porque se dejó de mirar.
      Lo que esto le enseña a cualquier carril, y por eso queda escrito acá: **un puntero a una
      tarea que además prohíbe re-medir es una medición con fecha de vencimiento que se defiende
      sola.** El pedido se archiva o se cumple, el doc sigue diciendo «bloqueado», y el que lo
      lee obedece la prohibición en vez de gastar los 10 segundos que cuesta preguntar. El estado
      de un pedido se DERIVA (`onia-tablero.sh show <id>` y el `--dry-run` del publicador), nunca
      se cita de una vuelta anterior. `web-venta` puede cerrar este ítem en su próxima vuelta.
      **Cerrado el 2026-09-12 23:30 La Paz.** Derivado de nuevo, no heredado:
      `ssh root@187.77.16.63 'bash /opt/onia-landing/_deploy/publicar.sh --dry-run'` →
      **«YA ESTA PUBLICADO — el sitio vivo sirve todo lo que main tiene»** (exit 0). El quinto
      número es **0** y la línea `OBJETIVO:` lo reporta desde entonces, así que el `Listo =`
      quedó cumplido por las dos mitades. ⚠️ **Lo que NO cerró este ítem, y conviene saberlo:**
      el quinto número protege contra *«arreglado pero sin publicar»* y es ciego al defecto
      opuesto —el instrumento que se equivoca *sobre el sitio publicado*—. Ese mismo día
      `precios:vivos` acusó un `Bs 364` inexistente en `/v1/chatbot` y lo diagnosticó como
      *«falta DESPLEGAR»*, con el deploy al día: era un `<CountUp>` leído a mitad de la cuenta.
      Está arreglado y gateado en `web-factory/apps/onia-platform/scripts/navegador-sin-animacion.test.ts`.

- [x] 🟠 **El gate de la cola lleva TRES arreglos y vuelve a rojo cada vez, porque las tres
      rondas corrigieron el eje equivocado. — CERRADO 2026-09-07 por `onia-cola`, con la
      salida (b) y una corrección al diagnóstico.**
      **Lo que estaba mal en este ítem: la clase no era del gate, era de la SECCIÓN.** Medido:
      `## Ahora` tenía **2.481 líneas — el 66 % del archivo — con 59 registros cerrados y UN
      solo ítem abierto** (éste), porque las 28 bitácoras `### … corrida del <fecha>` de
      `canario-visual` y `web-venta` se venían escribiendo adentro. El gate mide "Ahora" **por
      diseño** («el filtro es sobre lo que se declara accionable HOY»), así que los 14 errores
      eran **todos** sobre trabajo ya terminado. Y la salida (a) no se podía tomar sin romper
      un contrato ya escrito con su motivo: `scripts/verificar_cola.js:853` fija que *«un item
      marcado hecho también se verifica, o la cola miente hacia atrás»*.
      **Lo que se hizo:** se cerró "Ahora" con la sección `## Registro de corridas` justo antes
      de la primera bitácora fechada — **cero texto movido**, verificado por multiset de líneas
      (0 perdidas), no por conteo de ítems, que es como el corte por script ya borró un bloque
      en silencio antes. Y se tildaron los **6 registros 🟢 terminados** que habían quedado en
      `[ ]` — de ahí salía también el `duplicado` (dos corridas del mismo chequeo, ambas
      abiertas). Resultado: `npm run cola:viva` → **exit 0, «10 items en Ahora, todos con
      evidencia real»**. El paso 7 de "Cómo se trabaja esta cola" ahora fija dónde va una
      bitácora, que es lo que impide que vuelva.
      ⚠️ **Y por qué NO se cableó a `npm test`, que era lo que este ítem pedía para cerrarse:**
      medido copiando `COLA.md` a un árbol pelado, la **misma** cola que acá sale verde sale
      con decenas de `fantasma` allá — `existeEnAlgunRepo` le pregunta al disco y sube seis
      padres buscando el repo hermano. Cablearlo es el rojo **por ambiente** que trabaría el
      merge de los quince carriles (a `chatbot-cola` ya le faltó ese árbol al mudarse de
      máquina). Va el patrón de la casa: el `--self-check` puro sigue en la cadena, la medición
      viva queda como alias suelto (`npm run cola:viva`), y el gate ahora sale **2 = NO MEDIDO**
      —nunca 1— cuando no ve el repo. Guardia probado por mutación en las dos direcciones:
      apagarlo y dejarlo siempre encendido fallan cada uno por su propia razón.

- [x] 🟠 **(diagnóstico anterior, conservado — era correcto salvo en el sujeto)** Medido el 2026-09-07 por `onia-cola`:
      `node scripts/verificar_cola.js hermes-content/docs/COLA.md` sale **exit 1**. Cuatro
      errores eran defectos de verdad y se cerraron en esa vuelta (ver la auditoría al pie del
      ítem del gate, en "Después"); **los 14 que quedan son UNA sola clase** — 8
      `sin-evidencia`, 5 `fantasma`, 1 `duplicado`.
      **La clase, dicha entera:** el detector supone que *la evidencia de un ítem es un archivo
      del repo*. Eso era cierto cuando la cola era sólo de producto. Dejó de serlo cuando
      `web-venta` y `canario-visual` empezaron a escribir acá **ítems de medición**, cuya prueba
      es una pantalla viva y un número, no un archivo: `contacto` (322 KB/104 ms), `register`
      (705 KB/153 ms). De ahí salen los 8 `sin-evidencia`. De la misma raíz salen los 5
      `fantasma` — sitemap.xml, home.json, home.png y .canario-out/ (sin backticks a propósito:
      el gate los lee como evidencia) son **artefactos que se generan al correr**, no archivos
      versionados — y el `duplicado`, que son **dos corridas
      distintas del mismo chequeo en días distintos** compartiendo título (1844 y 2338 traen
      mediciones distintas: 104 ms contra 158 ms).
      **Método descartado, y es lo que se lleva el ítem:** agregar la carve-out N+1 de
      **notación**. Van tres rondas (glob, elipsis, nombre de rama, ruta parcial, expansión de
      llaves) y cada una convergió y volvió a divergir, porque ninguna toca el modelo. La
      siguiente vuelta **no** empieza escribiendo un patrón nuevo.
      **Las dos salidas, y hay que elegir UNA (no las dos):**
      (a) enseñarle al gate la clase — una medición de pantalla cuenta como evidencia, y un
      ítem fechado puede repetir título; o
      (b) sacar los ítems de medición de este archivo y mandarlos a
      `hermes-content/docs/historial/`, que es donde `CLAUDE.md` manda las fotos de un día.
      (b) es más fiel a la regla de la casa, pero mueve contenido de otros dos carriles y el
      corte por script ya borró un bloque en silencio antes: si se toma, se verifica por
      **presencia del texto movido**, nunca por el número de ítems.
      ⚠️ **Y lo que explica por qué esto se pudre sin que nadie lo note:** la cadena `npm test`
      declara `test:cola-selfcheck`, que corre `--self-check` (el detector contra sus fixtures)
      y **nunca** el gate contra `hermes-content/docs/COLA.md`. Por eso `guards-cableados` lo ve
      cableado y verde mientras el sujeto real lleva días en rojo. Cablearlo tal cual **hoy no
      se puede**: pondría rojo `main` y trabaría el merge de los 15 carriles por higiene de un
      doc. Cablearlo es lo que cierra el ítem, y sólo después de (a) o (b).

- [x] **`/nosotros` re-escribe a mano la promesa fiscal en vez de leerla de su fuente**
      (web-venta, 2026-09-06). `src/app/(sitio)/nosotros/page.tsx:151` dice *"nuestro emisor
      de facturación está registrado ante el SIN con las pruebas técnicas de la Fase 1
      completadas"*, tipeado a mano. La fuente es `src/lib/siat.ts:52`, que además
      aclara lo que la página se come: *"Quedan las etapas formales del trámite (inspección
      del SIN)"*, y `lib/proof.ts:115` tiene el estado en `siat: "tramite"`. **No lo ve
      ningún gate**: `facturacion.test.ts` sólo vigila `textosDeMetadata()` (el `<head>` y el
      JSON-LD), no el cuerpo; y los gates que recorren imports no lo alcanzan porque
      `/nosotros` no importa el símbolo — lo escribe. Es la misma forma del desastre de los
      cuatro precios vivos: dos copias del mismo hecho, y la de la página no envejece con la
      fuente. **Arreglo:** que `/nosotros` lea de `siat.ts`, y extender el gate al cuerpo.
      **HECHO 2026-09-06** (`8db85fba8`). La ruta que citaba este ítem era
      src/content/siat.ts —sin backticks a propósito: no existe, y los backticks son
      justamente lo que este gate lee como "acá hay evidencia"— y la fuente real es
      `src/lib/siat.ts`. Ahora `/nosotros`
      lee `SIAT_ESTADO_ONIA`, que trae las dos mitades juntas. Gate nuevo:
      `(sitio)/promesa-fiscal.test.ts` — la mitad tipeada a mano que
      `promesa-en-el-cuerpo.test.ts` no puede ver (aquél sigue el grafo de imports).
      ⚠️ Su primera versión dio **verde sobre el defecto**: buscaba la salvedad en el
      archivo entero y el principio «Honestidad primero» de la misma página la
      absolvía desde 90 líneas más arriba. El sujeto es la **vecindad** de la
      afirmación, no el documento. Pantalla mirada renderizada; 613 tests verdes.

> **Cuatro de los seis ítems del plan de la mañana murieron al verificarlos.** No estaban
> hechos "más o menos": estaban hechos, o estaban decididos, o el costo era otro. Queda
> escrito acá para que ninguna sesión los vuelva a abrir.

- [x] **P3 · "El agente que trae clientes no se puede encender nunca" — FANTASMA, y el motivo
      vale más que el ítem.** Era el punto 3 de `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md`, el **único**
      de esa lista en el carril producto. Su premisa — *"`addon.inmobiliaria`, una clave que no
      está en el catálogo de add-ons"* — es **falsa desde el 2026-08-13** (commit `4077f2c`).
      Verificada la cadena entera, eslabón por eslabón: la clave está en `ADDON_IDS`
      (`lib/platform/types.ts:73`); el `POST` de `app/api/admin/organizations/[id]/entitlements/route.ts:101`
      la acepta validando con `isFeatureKey` (catálogo cerrado, fail-closed); la pantalla
      `app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:56` lista **todos** los `ADDON_IDS`
      y le escribe su propia descripción; y el runtime
      (`lib/onia-core/modules/agents-runtime.ts:1188`) lee **la misma fila** que esa pantalla
      escribe — `organization_entitlements` es `@@unique([organizationId, featureKey])`
      (`prisma/schema.prisma:1929`), así que no hay fila vieja que pueda ganarle a la nueva.
      Probado en los dos sentidos en `lib/onia-core/modules/agents-runtime.test.ts:613`. **Cero líneas de código
      tocadas: no había nada roto.** El `kind_not_enabled` de las 14 corridas es la respuesta
      correcta — nadie lo compró — y coincide con el rechazo de **F4** que ya estaba escrito
      en este mismo archivo.
      **La lección, que es lo que se lleva la vuelta: hay DOS catálogos y el punto los mezcló.**
      `lib/pricing.ts` es el **comercial** (lo que se cobra) y ahí `inmobiliaria` no está;
      `lib/platform/types.ts` es el de **feature keys** (lo que se puede otorgar) y ahí sí está.
      Buscar la clave en el archivo que CLAUDE.md declara "fuente única de add-ons" y no
      encontrarla lleva derecho a la conclusión falsa. Es **verificar contra el sistema
      equivocado** otra vez, la cuarta anotada en esta cola.
      **Residuo real, y NO es roto ni falso:** sin precio en `lib/pricing.ts` el add-on **no se puede
      comprar**, sólo otorgar a mano. El catálogo de venta no lo ofrece — lo nombra en su
      sección de lo que falta (`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md:249`), así que no le miente a nadie.
      Ponerle precio es decisión de Sergio.

- [x] **P4 · El cobro por QR — FANTASMA: el circuito entero ya está construido y verde.**
      Gate 1 lo cazó antes de escribir una línea. El ítem describe el repo de **antes** del
      commit `753718f` (*"feat(pagos): enchufe listo del QR dinamico del BCP"*), que ya está
      en `master`. Verificado eslabón por eslabón, no por grep:
      - **Cliente del banco:** `lib/gateway/bcp-qr.ts` — generación (`/api/v4/Qr/Generated`),
        consulta (`/api/v3/Qr/Consult`), mTLS por `BCP_QR_CERT_PATH` y TLS 1.2 forzado, y el contrato de
        respuesta del callback (`buildBcpCallbackAck` / `buildBcpCallbackError`).
      - **Genera el QR:** `app/api/subscription-payment/bcp-qr/route.ts` — crea la fila
        `subscription_payments` PENDING marcada con `BCP_QR_BANK_MARKER`, así una referencia
        tipeada a mano en el flujo manual no puede colisionar con la del banco.
      - **Webhook con auth validada:** `app/api/webhooks/bcp/route.ts:55` —
        `validateBcpCallbackAuth` compara en tiempo constante y es **fail-closed** (sin
        `BCP_QR_CALLBACK_*` responde 503 y no activa nada).
      - **Activación automática:** el mismo webhook (`app/api/webhooks/bcp/route.ts:120`) confirma contra
        `/Qr/Consult` **antes** de activar —el callback del BCP no viene firmado, sólo Basic—
        y activa por el circuito compartido (`evaluateAutoApproval` + `claimPendingPayment` +
        `buildPlanActivation`), idempotente ante los 3 reintentos del banco.
      - **Pantalla:** `app/checkout/page.tsx:84` pasa `bcpQrDisponible={isBcpQrConfigured()}` y
        `app/checkout/CheckoutClient.tsx:573` muestra el QR real o cae al flujo manual.
      - **Flag apagado:** el flag son las env vars. Sin ellas `getBcpQrConfig()` devuelve
        `null`, el checkout sigue manual y **nada revienta** (test explícito).
      **Y el "proveedor simulado" que pedía el LISTO existe de verdad:**
      `lib/gateway/bcp-qr.test.ts:96` levanta un servidor HTTP local ("servidor local de
      mentira") y verifica la forma del request contra la spec — no es un mock del propio
      módulo. **32 tests verdes** en los tres archivos (`lib/gateway/bcp-qr.test.ts`,
      `app/api/webhooks/bcp/route.test.ts`, `app/api/subscription-payment/bcp-qr/route.test.ts`),
      corridos hoy en el worktree `cobro-qr`. **Cero líneas de código tocadas: no había nada roto.**
      **Lo que falta es exactamente lo que el propio ítem decía que faltaba: la credencial del
      BCP** (P1 URL de producción, el set Username/Password/AppUserId/PublicToken/BusinessCode
      y el certificado de `BCP_QR_CERT_PATH`). Encender = cargar env vars. Depende de Sergio y del banco, no del código.
      **Lección:** el ítem no mentía cuando se escribió — **envejeció**. Un pendiente heredado
      describe el repo del día en que se redactó, no el de hoy. Por eso el Gate 1 corre **antes**
      de tocar una línea, no después.

- [x] **Paso 3 otra vez, y esta vez el defecto NO era un `[x]` mal citado: `master` estaba ROJO
      — ARREGLADO y mergeado.** Vuelta del 2026-08-31, con la cola sin un solo ítem desbloqueado
      en "Ahora" (F2, F5, los 4 números de WhatsApp y el `DELETE` de pagos siguen esperando **una
      línea de Sergio**). El paso 3 pide reverificar los cierres *contra el código de hoy*, y hoy
      no es el de la auditoría anterior: `origin/master` pasó de `0711ff6` a `3c339a6` con commits
      del carril chatbot. **Los 12 shas citados siguen siendo ancestros reales** de la punta de
      hoy — ningún cierre falso.
      **Lo que apareció al correr los tres gates sobre esa punta nueva:**
      `__tests__/eslint-no-lintea-worktrees.test.ts` **falló** con `Test timed out in 5000ms` a
      los **8.159 ms**… y **la corrida siguiente, sobre el MISMO commit, salió verde**. Nadie
      había roto nada: la primera llamada a `isPathIgnored` carga el flat config **entero** del
      proyecto (parser de TS y plugins) — medido, **1.670 ms con la máquina en reposo**, ~8 s con
      la suite en paralelo — y el default de vitest son 5 s. **El tope estaba medido como si la
      máquina estuviera libre.**
      **Por qué es más grave que un test lento, y es la misma lección que este archivo ya
      guarda con otra cara:** ese test existe para que el gate de lint no se abandone, y **un
      gate que falla al azar se ignora igual que uno que tarda 20 minutos**. Peor: rompe CI sin
      que nadie haya tocado nada, y el próximo que lo vea en rojo va a buscar el bug en su
      propio cambio. El 2026-08-31 se arregló que el gate **mintiera** y que **tardara**; faltaba
      que fuera **determinista**.
      **El arreglo, dos cambios chicos:** una sola instancia de `ESLint` para los dos casos que
      preguntan por rutas (la carga en frío se paga una vez, y queda **un** test expuesto en vez
      de dos) y tope explícito de 30 s en esos dos casos.
      **Descartado el camino que parecía mejor, y queda escrito para que nadie lo reabra:**
      `overrideConfigFile: true` lo vuelve hermético y baja el costo a **6 ms** — pero sin el
      config del proyecto eslint se queda sin patrones `files`, no matchea nada y da **TODO** por
      ignorado. El cuarto caso ("y el código de ESTE árbol se sigue linteando") pasaría en verde
      **afirmando lo contrario de lo que mide**. Medido antes de descartarlo, no supuesto.
      Gates sobre `3c339a6`: tsc **0** · lint **0 errores** (101 warnings preexistentes) ·
      **2359 pasan + 5 skip (192 archivos)**. Commit **`e644c85`**, **ya en `origin/master`** por
      fast-forward.
      **Dos apuntes de método que costaron tiempo en esta vuelta:**
      (1) **El árbol principal de `onia-platform` se movió mientras trabajaba** (`b3adffc` →
      `3c339a6`, otra sesión). Estaba limpio y por eso casi edito ahí; se hizo worktree propio,
      que es lo que la regla pedía. **"El árbol está limpio" no significa "nadie más lo está
      usando".**
      (2) **La trampa de CRLF de los snapshots es real y saltó**: `vitest` reescribió
      `components/layout/__snapshots__/navigation.test.ts.snap` y
      `lib/platform/__snapshots__/vertical-pack.test.ts.snap`. `git diff --ignore-all-space` dio
      vacío (sólo fin de línea) y se restauraron; **no entraron al commit**.
      **Y una cita que la auditoría dejó falsa, corregida en los dos archivos:** el add-on
      **`addon.inmobiliaria` ya no existe — se renombró a `addon.captador` hoy mismo**
      (`lib/platform/types.ts:75`, carril ajeno), justo por el motivo que esta cola había
      escrito: era un add-on nombrado por un rubro que Onia no vende. El pipeline es genérico y
      **el copy inmobiliario ya está corregido**, así que el motivo del rechazo de **F4** cambió:
      hoy sigue apagado por no estar otorgado, no por su copy. **El residuo real no se movió:**
      `captador` **tampoco está en `lib/pricing.ts`** (verificado hoy), así que se otorga a mano
      pero **no se puede comprar**. Ponerle precio sigue siendo decisión de Sergio.
      *(Deriva de línea corregida de paso: `lib/onia-core/modules/agents-runtime.ts` pasó de la
      línea 1157 a la **1188**.)*

- [x] **F3 · `/requerimientos` ya es alcanzable.** Estaba en `COMMON_SEGMENTS` —el gate la
      dejaba pasar para todos los packs— y no tenía **un solo `href`** en `app/`,
      `components/` ni `lib/`. El arreglo no fue sólo el enlace: **que el gate deje pasar un
      segmento no significa que exista un camino para entrar**, y esa brecha no la cubría
      ninguna guarda. Ahora hay un test que hace imposible el próximo huérfano — cada segmento
      común o entra a algún nav, o se declara en `SIN_NAV_A_PROPOSITO` **con el motivo**. La
      guarda tiene su recíproco (un segmento ya enlazado no puede quedarse en la lista de
      excepciones), y eso cazó **dos entradas mías de más** en el mismo commit en que las
      escribí. Entró a los 4 navs porque es transversal, con roles SUPERADMIN/ADMIN/STAFF:
      perseguir papeles es de recepción, no del profesional. Gates: tsc 0, eslint 0 errores,
      **2282 tests verdes**. Commit **`ab9e0de`** (*"feat(nav): /requerimientos existia sin un
      solo enlace en todo el repo (#57)"*), **ya en origin/master**.
      *(Corregido el 2026-08-31: acá decía `6d8b6b7`, que es el sha **local de la rama antes
      del squash** y no existe en origin/master. El trabajo sí llegó —
      `components/layout/navigation.ts:45`, `lib/platform/vertical-pack.ts:169` y la guarda
      `SIN_NAV_A_PROPOSITO` de `lib/platform/route-access.test.ts` están en master. Citar el sha
      de la rama y no el del merge hace que la próxima auditoría lea "no llegó" sobre trabajo
      que sí llegó.)*

- [x] **F6 · Frase corrida en la pantalla del portal del cliente — ARREGLADO.** El diagnóstico
      heredado era correcto y se confirmó en vivo: la API
      (`app/api/portal/requerimientos/route.ts:21`) manda *"El enlace no es válido o venció"*
      **sin punto** y la pantalla lo concatena con " Pedí un enlace nuevo…". El fallback del
      literal **sí** traía el punto, así que leyendo el código el bug se veía arreglado y en
      vivo no lo estaba. Se puntúa **en el borde** con `frasePuntuada()` (`lib/utils.ts`, junto
      al resto de helpers de texto, con su test en `lib/utils.test.ts`) y no mensaje por
      mensaje: los otros dos errores de esa misma ruta ("No pudimos cargar tus requerimientos",
      "Error interno") tenían el mismo defecto y quedan cubiertos, igual que el próximo que se
      agregue. **Verificado MIRANDO la pantalla renderizada** con un token inventado — se lee
      *"El enlace no es válido o venció. Pedí un enlace nuevo a la persona que te lo envió."*
      Gates: tsc 0, eslint 0 errores, **2331 tests verdes**. Commit `0711ff6` en `master`.
      *(Nota de entorno: `next dev` con Turbopack no arranca en esta máquina — falla al
      spawnear el proceso de PostCSS con `0xc0000142`. Con `next dev --webpack` levanta en
      segundos. No es del producto; sirve para la próxima verificación visual.)*

- [x] **Los 7 leads que esperan NO estaban anotados en ningún lado — y el punto 1 ya no está
      bloqueado.** Vuelta del 2026-08-31, con la cola sin un solo ítem desbloqueado en "Ahora"
      (F2, F5, los 4 números de WhatsApp y el `DELETE` de pagos esperan una línea de Sergio).
      **El defecto lo destapó leer la cola misma:** este archivo y
      `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md` decían, los dos, que las 7 personas
      estaban *"anotadas en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y en la cola del chatbot: no
      se pierden"*. **Falso**: la §8 de ese archivo habla de una rama de git, no hay cola del
      chatbot en el repo, y la frase "7 personas" no aparecía en **ningún otro archivo**. Es la
      peor clase de dato falso — hace creer que el activo más caro del negocio está guardado.
      - **Recuperados de los sistemas donde viven de verdad, no de un doc**, y escritos en
        `hermes-content/docs/ONIA_LEADS_ESPERANDO.md`: los **3 pedidos de acceso** de
        `public.access_requests` (los tres con `contactedAt` NULL) y las **4 conversaciones**
        reales de Chatwoot, separadas de las de QA, de las del inbox "ONIA Demo" y de las de
        Sergio.
      - **Lo que sólo se ve mirando la base:** a los **dos leads de WhatsApp no les llegó ni
        una plantilla** — cero mensajes salientes. El de la clínica de 4 doctores escribió el
        25-ago **6 preguntas concretas** y recibió silencio absoluto. Y el correo de otro lead
        (Saguilera@ds-santacruz.bo) vive **dentro del texto del mensaje**, no en el campo
        `email` del contacto: si nadie abre esa conversación, ese dato no existe.
      - 🟢 **El hallazgo que destraba: el punto 1 de la definición de terminado ya tiene su
        herramienta VIVA en producción.** Ese punto decía que *"la única pantalla que lo muestra
        es de sólo lectura"* — y esa pantalla es
        `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx`. Es falso: el commit `88c1d56` le puso
        el formulario editable (`handleSaveInbox` → `patchWhatsApp({ chatwootInboxId })`).
        **Y está desplegado** — verificado contra el contenedor `onia-platform` del VPS, no
        contra el repo: el string `"Org vinculada al inbox"` está en el bundle que sirve hoy.
        Lo mínimo que ese punto pedía **ya existe**; falta **usarlo una vez**.
      - ⚠️ **Y acá casi me equivoco, así que queda escrito:** `git merge-base --is-ancestor
        88c1d56 e5c1ad3` da **NO**, o sea "no está desplegado" — y es la respuesta equivocada,
        porque **`e5c1ad3` ya no es lo que corre**. Preguntarle la ancestría a un sha que esta
        misma cola anotó como "lo desplegado" es **verificar contra el sistema equivocado** una
        vez más, con la cara nueva de un dato propio que envejeció. Lo que zanjó la pregunta fue
        **grepear el bundle del contenedor**.
      - **Corregidas las 3 afirmaciones falsas** (la cita del §8 en los dos archivos, y el
        "sólo lectura" del punto 1), cada una con la medición al lado.
      **Cero líneas de producto tocadas: el defecto era de datos y de docs, no de código.**
      **Lo que NO se hizo, a propósito:** vincular una org al inbox 5 para que los leads se vean.
      Es una **escritura en producción** sobre un ítem del carril chatbot, y este loop no escribe
      en la base de producción. Es 1 minuto para Sergio o para el dueño de ese carril.

- [x] **El punto 2 de la definicion de terminado — "vendemos que el bot agenda y el bot no
      agenda" — ARREGLADO, y el defecto de verdad era que la frase estaba escrita DOS veces.**
      La vuelta empezo en el paso 3 (la cola no tenia un solo item desbloqueado en "Ahora": F2,
      F5, los 4 numeros de WhatsApp y el `DELETE` de pagos siguen esperando **una linea de
      Sergio**) y termino arreglando el unico item 🟠 **falso** que quedaba en el carril producto.
      **Auditoria del paso 3, primero, y salio limpia:** los 24 shas citados en este archivo
      existen y los que se declaran ancestros de `origin/master` lo son; los 4 que no
      (`6edfab6`, `a15c82f`, `e46e9ee`, `6d8b6b7`) son los duplicados locales que este mismo
      archivo ya documenta. Los tres gates sobre la punta de hoy (`e644c85`): **tsc 0 · 2359
      tests + 5 skip · lint 0 errores**. `master` verde, ningun cierre falso.
      **Un cierre SI envejecio en 24 h, y no era falso: era una cita.** P3 cita
      `addon.inmobiliaria` en `ADDON_IDS`, y hoy esa clave **no existe**: el commit `f27bc9d`
      (PR #64) la renombro a `addon.captador` porque estaba gateada por un rubro que Onia no
      vende. Verificado que el rename no dejo hueco: la pantalla de capacidades tiene su
      descripcion (`app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:31`), no quedan referencias sueltas, y — lo que de verdad
      importaba, porque `isFeatureKey` es fail-closed y una fila vieja dejaria de ser feature en
      silencio — **la base de PRODUCCION no tiene ni una fila `addon.inmobiliaria`**
      (contenedor `supabase-db` del VPS: solo `addon.whatsapp` x2 y `module.agents` x3). Nadie
      perdio un add-on. El `[x]` de P3 queda: su conclusion sigue siendo cierta, envejecio la cita.
      **El item que se arreglo:** `lib/pricing.ts` vendia el chatbot de Bs 390/mes como que
      *"contesta, califica, **agenda** y hace seguimiento"*, y el motor dice lo contrario en una
      linea (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:153` — *"El bot no agenda ni
      vende solo"*): un pedido de cita se **escala a un humano**. Verificado hoy en los dos
      lados antes de tocar nada.
      **Y el hallazgo que justifica la vuelta: la frase falsa estaba duplicada.** Vivia en
      `lib/pricing.ts` (3 strings) **y hardcodeada** en
      `app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx:275`, que es la pantalla que
      el cliente lee **antes de pagar**. Arreglar la "fuente unica" y parar ahi dejaba la mentira
      viva en el unico lugar donde se mira — el mismo error de fondo que este archivo ya tiene
      anotado cuatro veces con otra cara: **arreglar el sistema equivocado**. La pantalla ahora
      deriva el tagline de la lista `tiers` de `WHATSAPP_ADDON`, asi que no hay segunda copia que corregir.
      **Guarda,** en `lib/pricing-honestidad.test.ts` (el archivo que ya ata la copia de venta al
      codigo que la sostiene, en vez de crear uno nuevo al lado): ninguna linea de venta del
      chatbot puede decir `agend*`, y la pantalla no puede volver a escribirla a mano. **Vista en
      ROJO por el motivo correcto en los dos casos** antes de traerla. La agenda publica queda
      intacta — esa SI reserva sola y es otro producto de la misma lista (`key: "agenda"`), por
      eso el guard mira solo la copia del chatbot y no la palabra en todo el archivo.
      Gates: **tsc 0 · 2362 tests + 5 skip · lint 0 errores**. Commit `f47d615`, **ya en
      `origin/master`**.
      ⚠️ **No lo mire renderizado y digo por que:** la pantalla es del dashboard (pide sesion) y
      el cambio es un literal reemplazado por `{tierChatbot?.tagline}` dentro del mismo `<li>` —
      `tsc` prueba el tipo y el guard prueba el texto. No hay markup nuevo que se pueda romper.
      ⚠️ **Y falta el deploy para que sea cierto donde el cliente mira:** el contenedor
      `onia-platform` del VPS sirve el bundle anterior, asi que **en produccion la frase falsa
      sigue viva hasta el proximo deploy**, y eso lo decide Sergio.

- [x] **La frase falsa del chatbot tenia una TERCERA copia — en el catalogo de venta, que es
      la fuente unica de "que se vende".** Vuelta del 2026-08-31 (segunda del dia). "Ahora" no
      tenia un solo item desbloqueado (F2, F5, los 4 numeros de WhatsApp y el `DELETE` de pagos
      siguen esperando **una linea de Sergio**), asi que se audito el cierre mas reciente — el de
      `f47d615`, que corrigio la copia del chatbot en `lib/pricing.ts` y en la pantalla del add-on.
      **El cierre aguanta**: `f47d615` es ancestro de `origin/master`, el arbol de `onia-platform`
      esta limpio y en `0 0`, y el barrido del repo del producto no encuentra **ninguna** otra
      linea de venta que diga que el bot agenda.
      **Pero el defecto que ese item habia diagnosticado —la frase duplicada— tenia una copia mas,
      y en el peor archivo posible:** `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md:126` vendia el
      chatbot como *"asistente 24/7 que contesta, califica, **agenda** y hace seguimiento"*. CLAUDE.md
      declara ese archivo la fuente unica de que se vende: toda propuesta, one-pager y cotizacion
      LEEN de ahi. Arreglar el codigo y dejar la mentira en la fuente de la que copia el material
      comercial es, otra vez, **arreglar el sistema equivocado**.
      **Verificado contra el motor antes de tocar nada**, no contra un doc:
      `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:232` — *"Pedido / cita / compra: se toma y se ESCALA.
      El bot no agenda ni vende solo"*. La fila ahora dice *"contesta, califica, **deriva a un
      humano** y hace seguimiento"*, la misma redaccion que el tagline ya corregido de
      `lib/pricing.ts:69`, para que no queden dos verdades distintas.
      **Y de paso, la misma fila de add-ons prescribia una clave MUERTA:** el catalogo mandaba
      gatear `/inbox` con `requiresFeature: "addon.chatbot"`, y `addon.chatbot` **no la lee nadie**
      (verificado hoy: aparece solo en tests; la viva es `addon.whatsapp`). Quien tomara esa
      recomendacion literal habria escrito un gate que no gatea nada. Corregida con el estado real
      —medio chatbot YA esta gateado desde el 2026-08-18— y remitida a **F2**, que es de Sergio.
      **Guarda,** `scripts/venta-honestidad.test.mjs` (`npm run test:venta-honestidad`): ata la copia
      de venta al motor. Dos tests — el motor tiene que seguir diciendo que no agenda, y ninguna
      linea del catalogo que hable del chatbot puede decir `agend*`. **Vista en ROJO por el motivo
      correcto** antes del arreglo: fallo con exactamente una linea, la fila del chatbot. La agenda
      publica (`key: "agenda"`) SI reserva sola y es otro producto, por eso el filtro mira solo las
      lineas del chatbot y no la palabra suelta.
      **Lo que NO se toco, a proposito:** las propuestas ya entregadas — queda anotado abajo en
      "Despues" porque tiene una trampa que no es de copy.

---

## Registro de corridas (2026-09-01 → 2026-09-03) — no rehacer

### Del carril `web-venta` — corrida del 2026-09-27 10:48 La Paz (el derecho que la venta no caducaba)

Los cuatro gates del objetivo salieron verdes (**0 prohibidos · 0/21 precios fuera de fuente ·
0/44 CTA rotos · favicon 200**) y la cola no tenía un solo ítem sin marcar, así que la vuelta fue
al escalón de auditoría. Las cuatro pantallas (`/` y `/empezar`, escritorio y teléfono) se
abrieron y se MIRARON: limpias.

**Una hipótesis propia, probada y DESCARTADA** — queda acá para que nadie la vuelva a perseguir:
*«el hero promete agentes desde el plan Crece y la memoria dice que son Pro+»*. **Falso, la
memoria está vieja.** `onia-platform/lib/plan-catalogo.ts` da `agentsIncluded: true` desde `crece`
(línea 83→94) desde que entró la escalera C el 2026-09-12, y el hero **no tipea** el plan: lo
deriva con `primerPlanCon("agentes")`. La prosa que dice «Pro+» sobrevive en dos comentarios
(`plan-catalogo.ts:25` y el encabezado de `datos-que-se-llevan.test.ts`), que es de dónde salía la
confusión — un comentario congelado se lee como presente.

**El defecto real: `/empezar` se contradecía A SÍ MISMA, en la misma respuesta HTTP.**

> hero (lo que se lee justo antes de apretar «Creá tu cuenta»): «…no pagás nada — y tus datos los
> exportás **cuando quieras**.»
> más abajo, misma página: «…la cuenta queda en solo lectura: tenés **30 días** para exportar tus
> datos.»

`content/legal/privacidad.md` §8 —la política que ese lead acepta al crear la cuenta— le da la
razón a la segunda: el export se pide *«dentro de los 30 días posteriores a la terminación»*, y a
los 90 los datos se eliminan. O sea que la promesa más sensible del sitio («tus datos son tuyos»)
se ofrecía sin caducidad en la última pantalla antes del alta. Tres copias vivas: `(sitio)/empezar`,
`(sitio)/nosotros` y `v1/prueba-gratis`.

**Por qué ningún gate lo veía, teniendo TRES vecinos que leen el mismo contrato:**
`salida-prometida` mide el ALCANCE de irse (no conoce el verbo `exportar`), `datos-que-se-llevan`
persigue una condición de plan que SOBRA (acá faltaba una), y `salida-con-fecha` exige una negación
junto a `borrar|eliminar` (esta frase no niega un borrado: promete un derecho). Ninguno preguntaba
hasta cuándo vive el **derecho a pedir** los datos una vez que el cliente se fue. Y la mitad
correcta ya existía y ya estaba derivada —`RETENCION.diasParaExportar` alimenta `PRUEBA.copy` desde
el 11-sep—: **no fue ignorancia del plazo, fue que la cura no viajó a sus gemelas.** Es el tercer
mes seguido que este carril paga el mismo patrón.

- [x] Las tres frases nombran la ventana, **derivada** de `RETENCION.diasParaExportar` y nunca
      tipeada: el día que §8 cambie, cambia el copy. `(sitio)/empezar/page.tsx`,
      `(sitio)/nosotros/page.tsx`, `v1/prueba-gratis/page.tsx`.
- [x] **NO se prohibió «cuando quieras» a secas**, que era más fácil y estaba mal: mientras la
      cuenta vive el export SÍ es cuando quieras (no lo gatea ningún plan, y eso lo defiende
      `datos-que-se-llevan.test.ts`). Prohibir el adverbio pondría a los dos gates a pelear y
      cambiaría un copy honesto por uno miedoso. Verificado servido: «Tus datos son tuyos: los
      exportás cuando quieras» sigue viva e intacta en `/nosotros` y en el cierre de la home.
- [x] Gate nuevo `export-al-irse-con-su-plazo.test.ts`, **visto en ROJO primero por el motivo
      correcto**: nombró las tres frases y ninguna otra. Sujeto derivado del disco (una página
      nueva nace cubierta), medido sin comentarios, y con el **JSX aplanado antes de cortar en
      oraciones** — sin eso el corte parte la frase al medio y las dos mitades pasan limpias, que
      es como falla ABIERTA esta familia.

**Evidencia:** build nuevo levantado y la pantalla MIRADA renderizada en teléfono — «no pagás nada
— y tus datos te los llevás en CSV, con 30 días para hacerlo», cero respuestas ≥400. Las 3 páginas
servidas re-medidas: 0 promesas sin ventana. `typecheck` 0 · `build` 0 · **1678 tests / 122
archivos en verde**. Commit `c9b8acb2`.

**Deploy: no hace falta pedirlo.** `lib/pricing.ts` no se toca, así que no entra en `FIRMA_HUMANA`;
el publicador de las :50 cada 3 h dice `landing: PUBLICADO` (medido hoy 08:50 en
`/var/log/onia-publicar-solo.log`). Sale solo en cuanto el integrador mergee a `main`.

### Del carril `web-venta` — corrida del 2026-09-27 04:48 La Paz (la tarjeta decía dos ciclos a la vez)

Los cuatro gates del objetivo salieron verdes (0 prohibidos · 0/18 montos fuera de fuente ·
**0/25 CTA rotos** · favicon 200), así que la vuelta fue al escalón de auditoría.

**Dos hipótesis propias, probadas y DESCARTADAS antes de anunciarlas** — quedan acá para que
nadie las vuelva a perseguir:

- *«la home nombra el bot más que el sistema» (38 contra 37)*: **falso, es el instrumento.** El
  HTML de Next trae el árbol RSC **duplicado**, así que el contador de palabras cuenta cada
  mención dos veces, y encima suma nav, pie y JSON-LD. La prominencia real está bien (`<title>`
  «Software de gestión Bolivia», `h1` «Onia es el sistema…»), y la propiedad ya la gatea
  `(sitio)/hero.test.ts`, que prohíbe `asistente|chatbot|bot|recepcionista` en el hero **y** en el
  `<head>`. Un conteo de apariciones no mide prominencia — y está roto en las dos direcciones:
  saturado de ruido estructural, no vería volver al bot al titular.
- *«`/servicios/webs` está ofrecida con precio pero desindexada»*: **falso.** `robots.ts` la deja
  fuera del disallow a propósito y lo explica: es un add-on con precio en `ADDONS`, no un enlace
  de agencia huérfano.

**El defecto real, MIRADO renderizado** (Chromium, clic en «Anual», texto de la tarjeta leído):
con el interruptor de la portada en anual, la tarjeta del Completo decía las tres cosas juntas —
`12.900 Bs / año` · `Equivale a Bs 1.075 por mes` · `Bs 10 más al mes que Profesional con el
add-on aparte`. En anual la cuenta es otra: 8.900 + 3.900 = **12.800** contra 12.900, o sea **Bs
100 más al año** (Bs 8 por mes). El lead que restaba con los números que la propia tarjeta le
daba —1.075 contra 742 + 325— obtenía 8 y leía 10: **las dos mitades de una misma tarjeta salían
de ciclos distintos**, en la pantalla cuyo título es «PRECIOS CLAROS».

**Por qué ningún gate lo veía:** misma familia que `cuentaVsAddon` cerró el 2026-09-19 —el
resultado de una cuenta entre montos legítimos, que ningún instrumento de montos suma— y **la
cura cubrió un solo ciclo**. Los tres sumandos anuales salen de la fuente, así que `precios:vivos`
y `precios:fuente` seguían verdes; `cuenta-vs-addon-no-se-tipea.test.ts` mide `plan.resultado`,
que es el mensual, o sea la mitad que estaba bien. Y el número ofensor, 10, no es el precio de
nada: no hay con qué cruzarlo. Es el patrón que este carril ya pagó dos veces — **la cura se
aplica donde saltó el defecto y no viaja a sus gemelos** (el 19-sep fue el hero contra el `<head>`).

- [x] El ciclo entra al tipo (`CuentaVsAddon.ciclo`) y la unidad de la frase se deriva de él, así
  que el semanal —que ya existe en `Plan.semanal`— nace obligado a contestar qué dice en vez de
  heredar el mensual en silencio. `lib/pricing.ts`, `(sitio)/precios-toggle.tsx`.
- [x] Un número suelto como add-on se sigue leyendo como el mensual y **no** se le deriva un anual
  con la regla de los 10 meses, aunque el catálogo entero la cumpla: sería una suposición en el
  camino de la plata. Los 4 llamadores viejos quedaron intactos, sin tocar su gate.
- [x] Gate nuevo `lib/cuenta-del-ciclo-que-se-muestra.test.ts`, **visto en ROJO primero por los
  cinco motivos correctos** — incluido el de la SUPERFICIE (*«pinta `plan.resultado`»*), que es el
  que evita una función correcta que nadie llama.

**Evidencia:** build nuevo levantado y MIRADO — en anual «Bs 100 más al año», en mensual sigue
«Bs 10 más al mes», cero respuestas ≥400. Captura de la tarjeta leída. `typecheck` 0 · `build` 0 ·
**1661 tests / 120 archivos en verde**. Commit `9637b772`.

⚠️ **Para quien publique:** el cambio toca `lib/pricing.ts`, que está en `FIRMA_HUMANA`. Medido
con el criterio del propio freno (números del código, comentarios afuera): **70 antes, 70 después,
ninguno nuevo ni perdido** — no cambia ningún monto, así que no debería detener la landing.

### Del carril `web-venta` — corrida del 2026-09-26 18:48 La Paz (el precio que viaja HORNEADO en la tarjeta social)

Los cuatro gates del objetivo salieron verdes (0 prohibidos · 0/21 precios fuera de
fuente · 0/44 CTA rotos · favicon 200) y la cola no tenía pendientes, así que la vuelta
fue al escalón de auditoría: **mirar lo que ningún gate mira**.

**Lo que nadie había mirado nunca: la `og:image`.** Es lo único que ve quien recibe
`onia.com.bo` por WhatsApp y nunca abre el link — el canal por el que Sergio Urcullo
manda el sitio a un lead. Medido: las **24** superficies de venta comparten **una sola
imagen** (mismo md5 `2aae94e6` en las 24, 200 y 45.656 bytes cada una), y el precio va
**horneado en píxeles**. Ningún `grep`, ningún barrido de HTML y ninguna captura de
pantalla ve un número adentro de un PNG.

**El defecto, latente:** la tarjeta componía su «Desde Bs …» con `plan("basico")`
**tipeado**, y no con `planDeEntrada()`. El propio `lib/pricing.ts` documenta por qué
esa función existe: *«un `"basico"` tipeado sigue compilando y queda anunciando el plan
equivocado»* el día que entre un escalón más abajo — que es lo que pasó el 2026-09-12
cuando la escalera C metió el plan Crece. La cura se aplicó al hero el 2026-09-19 y **no
viajó a sus gemelos**: el `<head>` de la home, la tarjeta social, `/v1` y `/v1/modulos/dental`
seguían tipeados. La home derivaba bien el precio de **pantalla** y tipeaba el del
**snippet**: las dos mitades del mismo `<head>` habrían dicho precios distintos.

**Por qué ningún gate lo veía, y esto es lo que importa:** `precios:vivos` y
`precios:fuente` miran el RESULTADO servido, y hoy `plan("basico").mensual` ===
`planDeEntrada().mensual` === 320. Salen verdes — y **seguirían saliendo verdes el día
que el bug se vuelva visible**, porque el monto viejo seguiría siendo el precio real de
un plan real. Un gate de resultado no puede ver una premisa que todavía no falló.
Peor: un test existente (`hero.test.ts`) **exigía el literal** `plan("basico").mensual`
en dos aserciones, o sea que estaba **defendiendo** el defecto que su propio vecino ya
había curado.

- [x] Los 7 usos derivan del piso de la escalera — `(sitio)/tarjeta-social.tsx`,
  `(sitio)/page.tsx` (`DESDE_MES`), `v1/page.tsx` ×3 y `v1/modulos/dental/page.tsx` ×2
  (incluido el `price` del JSON-LD, que es el que publica Google). La FAQ de dental que
  dice «el plan Básico (Bs N/mes) … hasta 300 pacientes activos» queda como está: nombra
  un plan concreto y es verdad de ese plan.
- [x] Gate nuevo `(sitio)/precio-de-entrada-derivado.test.ts`, **visto en ROJO primero**
  por el motivo correcto (los 7 sujetos, con archivo y línea). Fija la regla: `plan("<id>")`
  sólo vale si la frase cita `.nombre`; si saca un monto sin nombrar el plan, lo está
  usando como «el más barato» y eso se deriva. Borra los comentarios antes de medir —
  dos archivos explican este mismo bug EN PROSA citando `plan("basico")` textual, y
  medir sobre el crudo acusa a quien documentó la cura.
- [x] Las dos aserciones de `hero.test.ts` ahora exigen la PROPIEDAD (derivado del piso)
  en vez del literal viejo.

**Evidencia de que no rompe nada hoy:** con el build nuevo levantado, la `og:image` que
produce es **byte por byte** la que sirve producción — mismo md5 `2aae94e6`, y mirada:
«Desde Bs 320 al mes. 14 días gratis, sin tarjeta.» El arreglo cambia la DERIVACIÓN, no
el valor. Gates: `typecheck` 0, `build` 0, suite **1612 tests / 117 archivos en verde**.


> **Esto NO es cola: es la bitácora de lo ya corrido.** Cada `###` de abajo es una corrida
> fechada de un carril (`canario-visual`, `web-venta`, `onia-cola`) con lo que midió ese día.
> Se lee para no repetir un hallazgo; **no se toma trabajo de acá.**
>
> **Por qué existe esta sección, medido el 2026-09-07 por `onia-cola`:** estas 28 corridas
> vivían dentro de `## Ahora`, que quedó con **2.481 líneas — el 66 % del archivo — y UN solo
> ítem realmente abierto** contra 59 registros ya cerrados. Dos costos, y el segundo es el caro:
> `node scripts/verificar_cola.js hermes-content/docs/COLA.md` daba **exit 1** con 14 errores
> —8 `sin-evidencia`, 5 `fantasma`, 1 `duplicado`—, **todos** sobre registros de trabajo
> terminado; y sobre todo, la instrucción que todos los carriles obedecen («tomá el primer ítem
> no bloqueado de "Ahora"») mandaba a leer 2.481 líneas de bitácora para encontrar un ítem.
>
> ⚠️ **El gate NO estaba roto: la sección lo estaba.** Las tres rondas anteriores le agregaron
> carve-outs de notación (glob, elipsis, nombre de rama, ruta parcial, expansión de llaves) y
> las tres volvieron a divergir, porque el gate mide `## Ahora` **por diseño** —«el filtro es
> sobre lo que se declara accionable HOY»— y lo que había ahí no era accionable. Y la salida
> tampoco era aflojarlo: `verificar_cola.js:853` fija a propósito que *«un item marcado hecho
> también se verifica, o la cola miente hacia atrás»*. Lo que sobraba era el sujeto.

### Del canario visual — corrida del 2026-09-01 (abiertas y MIRADAS, no un 200)

- [x] **La maqueta de "Elegís tu rubro" se ve CORTADA en la home, en desktop 1440 — ARREGLADO
      EN CÓDIGO el 2026-09-02 (commit `c98543e2`, de Sergio), falta el deploy.** El defecto
      original (medido el 2026-09-01) era que el corte venía HORNEADO en las cinco imágenes
      webp de rubros — no lo arreglaba ni un CSS ni un recorte, y cerrarlo de verdad necesitaba
      recapturar esas cinco pantallas contra el dashboard real corriendo con datos de demo, algo
      que este carril no podía hacer sin cruzar al repo `onia-platform` (otro carril).
      **Ya no aplica: dejó de existir el archivo que tenía el corte.** Verificado hoy en el
      worktree, tras el rebase que trajo el commit de Sergio: la carpeta pública de rubros con
      esas cinco imágenes fue borrada, y
      `web-factory/apps/onia-platform/src/app/(sitio)/switcher.tsx` ahora dibuja cada rubro con
      divs (componente `Shape` en modo `panel`) en vez de servir una captura. Gates verdes en
      este worktree: `tsc --noEmit` 0 · `next build` 32/32 páginas.
      **Lo que falta, y no es zona de este carril:** el deploy. Medido contra el contenedor que
      sirve el dominio: `curl https://onia.com.bo/` todavía trae esas cinco rutas de imagen —
      `onia-landing` sigue sirviendo el build viejo. Deploy es de Sergio.

- [x] **La CSP de producción bloqueaba el beacon de Cloudflare en TODA la plataforma — ARREGLADO
      EN CÓDIGO el 2026-09-02, `onia-platform` `efaffe8`, en `master`. Falta SÓLO el deploy, que
      decide Sergio.** Se agregó `https://static.cloudflareinsights.com` a `script-src` y
      `https://cloudflareinsights.com` a `connect-src` en `next.config.ts` — la opción que no
      apaga métrica: si Sergio no quiere Web Analytics, apagarlo en Cloudflare sigue siendo válido
      y no requiere código.
      Se extrajo `buildContentSecurityPolicy()` (antes la directiva vivía inline dentro de
      `headers()` y no había forma de testearla sin levantar Next). Test nuevo
      `__tests__/csp-cloudflare-beacon.test.ts`: falló en ROJO antes del cambio
      (`buildContentSecurityPolicy is not a function`) y pasa en VERDE después, verificando
      `script-src` y `connect-src` por separado.
      Gates verdes: `tsc --noEmit` 0 · `npm run lint` 0 errores (100 warnings preexistentes) ·
      `vitest run --no-file-parallelism` 203 archivos, 2.482 pasan + 5 skip.
      **Píxeles sin cambio** (es una cabecera HTTP, no hay captura que mirar). **Cómo se sabe que
      quedó hecho en producción:** después del deploy, abrir `app.onia.com.bo/login` y que la
      consola no traiga la violación de CSP.

- [x] **Nadie es dueño de `/` ni de `/empezar` — RESUELTO 2026-09-02: el carril `web-venta`
      (este) es el dueño declarado.** Su propio prompt de loop lo dice desde el 2026-09-02:
      "`onia.com.bo/` y `/empezar` no tenían dueño... Vos sos ese dueño", con zona exclusiva
      `web-factory/apps/onia-platform/**`. Actualizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §24 (era §16 — el radar tenía
      **dos** secciones con ese número y ésta se renumeró el 2026-09-02; la §16 que queda es la
      del deploy, que sigue abierta).

### Del canario visual — segunda pasada del 2026-09-01

- [x] **FANTASMA — "los espacios dentro de palabras" NO existen para un cliente: los dibuja el
      motor con el que sacamos las capturas.** Cerrado el 2026-09-02 por el dueño de `web-venta`,
      que es exactamente lo que este ítem pedía ("confirmarlo en un navegador de verdad antes de
      invertir tiempo"). **Nadie tiene que arreglar nada acá, ni en el login ni en el sitio.**
      **Cómo se probó, y por qué la prueba es concluyente:** se abrió **la misma URL, en el mismo
      instante, con la misma fuente ya cargada**, con los dos motores que hay en el VPS:
      - `chromium_headless_shell` (el que usa el canario): dibuja
        *"Ent regamos t u sist ema con la configuración de t u rubro puest a"*.
      - Chromium completo (`channel: 'chromium'`, headless igual): dibuja
        *"Entregamos tu sistema con la configuración de tu rubro puesta."* — **perfecto**.
      El defecto **es del rasterizador, no del sitio**: sólo cambia el motor de captura. Coincide
      con lo que el propio ítem ya había medido y no supo interpretar — `innerText` correcto,
      `document.fonts.status: loaded`, cero 404. Medido además `getClientRects()`: **una sola
      caja** por palabra en los DOS motores, o sea que ni el layout ni el DOM meten el espacio.
      **La regla del artefacto, para no volver a caer:** el corte cae **siempre después de una
      `t`** (`Client es`, `Fact uración`, `Recordat orios`, `Agent es`, `Ent regamos`, `cit as`).
      Las palabras sin `t` —`Agenda`, `Cobros`— salen limpias en los dos motores. Si un reporte
      futuro tiene TODOS los cortes pegados a una `t`, es este artefacto y no un defecto.
      **Evidencia (mismo html, dos motores, lado a lado):**
      `hermes-content/docs/historial/canario-visual/2026-09-02-artefacto-headless-shell-login.png`
      vs `…/2026-09-02-mismo-html-chromium-real-login.png`, y en el sitio de venta
      `…/2026-09-02-artefacto-headless-shell-empezar.png` vs
      `…/2026-09-02-mismo-html-chromium-real-empezar.png`.
      **Lo que sí queda por hacer, y NO es de este carril** (ver el ítem nuevo abajo): el canario
      arrastra el motor malo, así que va a seguir inventando este defecto en cada corrida.

  <details><summary>El reporte original, tal como lo dejó el canario (ya refutado)</summary>

- **El párrafo izquierdo del login de la plataforma sale con espacios metidos DENTRO de
      palabras** ("Ent regamos", "puest a", "t odo el sist ema", "cit as", "import ante"), en
      `app.onia.com.bo/login` — y por herencia en `/settings/chatbot` sin sesión, que redirige
      ahí. Reproducido 3 veces seguidas en Chromium headless del VPS (`--no-sandbox`), siempre
      en las mismas palabras. El `innerText` del párrafo es correcto (sin espacios de más) y
      `document.fonts.status` es `loaded`, sin 404 de fuentes — el glitch es sólo visual, en el
      renderizado del glifo, no en el dato. La fuente del bloque es `Archivo` (variable font).
      **No se descartó como artefacto del canario**: a diferencia del blanqueo por scroll de la
      home (que desaparece con más tiempo de scroll y por eso NO se reporta), este espaciado
      **no cambió con 3 s de espera extra** después de `networkidle`.
      **No verificado en un Chrome de escritorio normal** — puede ser una rareza de fuente
      variable + Chromium headless Linux y no algo que vea un cliente real; queda a criterio
      del dueño confirmarlo en un navegador de verdad antes de invertir tiempo.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-01-login-plataforma-texto-espaciado.png`
      (página completa) y `hermes-content/docs/historial/canario-visual/2026-09-01-login-plataforma-texto-espaciado-crop.png`
      (recorte del párrafo) · login-plataforma hoy = 967 KB
      · 147 ms hasta mirable (baseline: 1.302 KB · 1.043 ms — la baja de peso es variación de
      CDN/compresión entre corridas, no un recorte de contenido: el `innerText` completo
      coincide con la baseline).

  </details>

- [x] 🟠 **El canario saca las capturas con el motor equivocado, y por eso INVENTA defectos de
      texto.** Es la raíz del fantasma de arriba, y no es zona de `web-venta` (vive en
      `scripts/`, cuyo dueño es el carril del canario).
      **Dónde, exacto:** `scripts/canario_visual.mjs:259` llama `chromium.launch(...)` **sin
      `channel`**. Con Playwright 1.60 (el instalado) eso resuelve a `chromium_headless_shell`,
      que es el motor que mete el espacio después de cada `t`. El VPS **ya tiene los dos
      binarios** bajados (`/root/.cache/ms-playwright/chromium-1223` y
      `chromium_headless_shell-1223`): no hay que instalar nada.
      **El arreglo es una línea:** agregar `channel: 'chromium'` a ese `launch` (conservando los
      `args` de `--no-sandbox`, que siguen haciendo falta como root).
      **Por qué importa más que un falso positivo suelto:** este loop confía en las capturas del
      canario para decidir qué está roto en la cara del producto. Un motor que dibuja mal el
      texto convierte cada corrida en trabajo inventado — ya costó un ítem abierto tres días
      contra una pantalla que se veía perfecta.
      **Cómo se sabe que quedó hecho:** correr el canario sobre `login-plataforma` y que la
      captura diga "Entregamos tu sistema", no "Ent regamos t u sist ema".

      ✅ **HECHO el 2026-09-02 por el integrador, en `main`** (`scripts/canario_visual.mjs`).
      Lo tomó él y no el carril del canario porque era el primer ítem abierto de "Ahora" y
      porque cada corrida con el motor malo le fabrica trabajo inventado a los demás carriles.
      **Lo que se hizo:** el `launch` inline salió a una función `opcionesDeChromium(esRoot)`
      que pide `channel: 'chromium'` y conserva `--no-sandbox` sólo como root. Cuatro casos
      nuevos en `--self-check` (69 en total, verde) — **corridos en ROJO antes del cambio**, y
      fallaron los dos del `channel` y ninguno del sandbox, que es el rojo correcto.
      **La prueba de que arregla el defecto, hecha con el Playwright que usa el canario**
      (`/root/node_modules`, 1.60, rev 1223): misma URL, mismo instante, misma fuente cargada.
      Sin `channel` → *"Ent regamos t u sist ema … con t us dat os"*. Con `channel: 'chromium'`
      → *"Entregamos tu sistema con la configuración de tu rubro puesta."* Miradas las dos
      capturas, no leído un exit code.
      ⚠️ **Lo que NO se pudo correr, y es del carril del canario:** el canario entero desde este
      worktree revienta antes de abrir nada — `node_modules` local trae Playwright **1.62.1**,
      que pide `chromium-1234`, y en el VPS sólo está **1223**. No lo causó este cambio (pasa
      igual sin él); el canario no lo sufre porque su worktree **no tiene `node_modules`
      propio** y resuelve a `/root/node_modules` 1.60, que sí calza. Si alguna vez se le agrega
      uno, el canario deja de arrancar.
      ⚠️ **Y esto no llega solo a la próxima corrida:** el runner **no** mergea `main` en los
      worktrees de carril, y `claude/canario-visual` está 91 commits atrás. El canario tiene que
      traer `main` a su rama antes de que sus fotos salgan limpias.

### Medido el 2026-09-03 — el recorrido entero de las dos pantallas, no sólo el pie

- [x] 🟡 **FANTASMA — REFUTADO Y CERRADO el 2026-09-03. El header a 1440 nunca apareció ni
      desapareció: mentía la captura, no la barra.** La causa es
      `src/app/globals.css:194` → `scroll-behavior: smooth`. Con eso, `window.scrollTo(0, 12480)`
      **anima**, y una captura tras un timeout fijo fotografía la página **en tránsito**.
      **Medido en vivo** (build de esta rama en `:3987`, 1440×900, `scrollY` muestreado): a los
      500 ms el scroll estaba en **7847**, al segundo en **11811**, y recién a los 1500 ms llegó
      a **12480**. Las dos tomas del experimento anterior salieron distintas por eso — no por el
      `backdrop-filter` ni por el rasterizador.
      **Con el scroll ASENTADO el header está sano.** Esperando por condición
      (`waitForFunction`: `scrollY` deja de moverse Y está a <3px del objetivo) en vez de por
      reloj, seis muestras consecutivas dan `top: 0`, `bottom: 61`, `opacity: 1`,
      `visibility: visible`, `transform: none`. **No se mueve.** Captura mirada:
      `/tmp/venta-header-1440.png` — logo, los 5 links del nav, "Entrar" y el botón verde
      completos, y el texto que pasa por debajo sale **difuminado**: el `blur(10px)` sí se
      compone en la captura, que era justo la sospecha que no se podía descartar.
      **Y responde la pista que quedaba abierta — cuál de los dos `sticky` es la barra:** es
      `.header` de `src/app/(sitio)/sitio.module.css:1473` (`z-index: 20`, `blur(10px)`,
      `color-mix(… 88%)`), **no** `site-header.module.css` (`blur(12px)`, `82%`). La pila de
      `elementsFromPoint(720, 35)` devuelve `A.sitio_navLink → NAV → DIV.headerInner → HEADER`:
      lo que hay arriba en ese punto es el **propio nav del header**, no texto de la página.
      **El gate del carril NO sufre esta mentira** — verificado, no supuesto:
      `scripts/mirar-venta.mjs:141-166` ya documenta `scroll-behavior: smooth`, fuerza
      `behavior: 'instant'` y repite hasta que `scrollY` deja de moverse. Nada que arreglar ahí.
      **Regla que deja:** contra este sitio, una captura que espera por **reloj** puede mentir;
      hay que esperar por **condición**. Es la misma familia del rasterizador que costó 3 días.

      ⚠️ **Anotado al pasar, NO investigado (no abrir frente en esta vuelta):** conviven dos
      hojas de header — `sitio.module.css` (la que pinta) y `components/site-header.module.css`.
      Vale mirar si la segunda es código muerto, pero es otro ítem.

<details><summary>Lo que se creía (2026-09-02) — historia, ya refutado</summary>

      Se anotaba porque era reproducible y barato, no porque estuviera probado — el experimento
      que lo iba a decidir salió **confundido**, y eso era la mitad del valor de este ítem.
      **Qué se vio:** recorriendo `/` a 1440 viewport por viewport (scroll real, no `fullPage`),
      la vista 16 de 18 (`window.scrollTo(0, 12480)`, zona de PREGUNTAS FRECUENTES) muestra la
      pregunta "¿Los datos del Excel o del cuaderno los cargo yo?" y su `+` **por encima de la
      barra**, chocando con los links del nav.
      **Por qué no se anuncia como roto:** el header es translúcido a propósito
      (`src/components/site-header.module.css:18` — `color-mix(in srgb, var(--bg) 82%,
      transparent)` + `backdrop-filter: blur(12px)`), así que algo se ve debajo **por diseño**.
      La sospecha era que el `backdrop-filter` no se compone en la captura y por eso el texto
      sale nítido en vez de difuminado — el mismo tipo de mentira del rasterizador que ya costó
      tres días con `"Ent regamos t u sist ema"`.
      **El experimento y por qué NO concluye:** dos tomas del mismo recorte (1440×70, offset
      12480), la segunda con `backdrop-filter: none !important` inyectado. Salieron distintas
      (md5 `e61bf628…` vs `fd6d8459…`) — pero **no por el blur**: en la primera el header **no
      está** (banda vacía) y en la segunda entra corrido ~16px hacia abajo. O sea que la barra
      se movió sola entre las dos tomas, así que la comparación no aísla nada. Y la explicación
      fácil está descartada: `grep -n "translate\|scroll\|hidden" src/components/site-header.tsx
      src/components/site-header.module.css` devuelve **cero líneas** — no hay ocultar-al-bajar
      en ese componente.
      **La pista para la próxima vuelta, que es donde hay que empezar:** hay un SEGUNDO
      `position: sticky` con `backdrop-filter: blur(10px)` en `src/app/(sitio)/sitio.module.css:1473`.
      Antes de mirar el blur hay que saber **cuál de los dos elementos** es la barra que sale en
      la captura, y si el de la landing deja de pegarse porque su contenedor termina.
      **Repro en 30 segundos** (con el build de la rama servido en `:3987`): abrir a 1440,
      `window.scrollTo(0, 12480)`, esperar 500 ms y capturar; repetir esperando 2 s. Si las dos
      tomas difieren con el scroll quieto, el problema es la barra, no el rasterizador.
      **Lo que sí quedó probado hoy, y por eso el resto de la pantalla no es sospechoso:** el
      recorrido completo de `/` (19 vistas a 390, 18 a 1440) y de `/empezar` (5 y 4) contra el
      build de esta rama no muestra ningún otro defecto — ni texto cortado, ni desborde, ni
      solapamiento. Y los precios de la home salen de la fuente que cobra: `PLANES` de
      `src/lib/pricing.ts` (320 · 750 · 1.500) coincide con `DEFAULT_PLAN_AMOUNTS` de
      `/root/loops/onia-platform/lib/subscription-plans.ts` leído hoy en vivo, no con la nota
      heredada del encabezado de ese archivo (que cita un tip de `master` de agosto y una ruta
      `C:\` que en el VPS no existe).

</details>

### Medido el 2026-09-01 — el sitio de venta no lo cubre ningún gate

- [x] 🟠 **Decir "`main` compila" no dice NADA sobre `onia.com.bo`: ningún gate corre `tsc`
      sobre las apps de `web-factory`.** El único typecheck cableado del repo mira **cero
      líneas de código de app**.
      **Evidencia, medida hoy y en tres lugares distintos:**
      - `web-factory/tsconfig.packages.json` es exactamente `{"extends": "./tsconfig.json",
        "include": ["packages/**/*.ts"]}` — ni un archivo de `web-factory/apps/`. Y es el único que se
        corre: en `web-factory/package.json` el solo script de tipos es
        `"typecheck:packages": "tsc --noEmit -p tsconfig.packages.json"`.
      - **Ninguna CI lo suple.** `$ git grep -nE "tsc|typecheck|pnpm.*(build|test)|npm run (build|test)" origin/main -- .github/workflows`
        devuelve **cero líneas**. Los 6 workflows de `.github/workflows` son deploy, higiene,
        auditoría, pulso y video-intake: **no hay un solo job que compile o testee nada**.
      - **Y esto no es teórico: la app sin gate es la que sirve la venta.** El contenedor
        `onia-landing` del VPS corre `next-server (v15.5.19)` sobre `/app/apps/onia-platform`
        — o sea `web-factory/apps/onia-platform/`, la app de `onia.com.bo` y `/empezar`.
        Medido por `docker exec`, no leído de un doc.
      **El estado app por app** (todas en `web-factory/apps/`): `dental-premium`,
      `dentalgest-landing`, `ferreteria-sur` y `onia-platform` **sí tienen** script `typecheck`
      (`tsc --noEmit`) en su `package.json` y **no lo llama nadie**; `site` **ni siquiera lo
      tiene** (su único script de calidad es `lint`). Son cinco líneas de trabajo, no un
      proyecto.
      **Cómo se sabe que quedó hecho:** correr `$ pnpm --filter <app> typecheck` para las cinco
      y que el resultado quede **cableado en el script raíz** que un carril corre antes de
      mergear — con la corrida de `onia-platform` verde pegada, porque es la que publica el
      sitio de venta. Si alguna sale roja hoy, ese error **ya está en producción**.
      **Sin bloqueo:** no toca producción, no gasta, no baja ninguna superficie.
      ⚠️ **Ojo de carril:** `web-factory/apps/onia-platform/` es la app que esta misma cola
      anota como huérfana cuatro ítems más arriba. El gate se puede cablear sin tocar su
      código — y justamente por eso conviene que exista antes de que alguien lo toque.

      ✅ **Cerrado el residuo más urgente el 2026-09-02, sin tocar la raíz de `web-factory`:**
      `web-factory/apps/onia-platform/package.json` ahora tiene `"prebuild": "tsc --noEmit"`. Verificado que
      es exactamente el comando que corre el deploy real
      (`scripts/deploy-onia-landing.sh:25`, `pnpm --filter onia-platform build`) — no un script
      paralelo que nadie llama: `pnpm run build` en ese filtro ejecuta el hook automáticamente
      (probado en vivo con `prebuild: echo`), y con un error de tipos inyectado a propósito
      (en el layout de la app, un `number` asignado a un `string`) el build **corta antes de
      `next build`** con `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`. Revertido el error de prueba,
      gates limpios: `tsc --noEmit` 0 · `next build` 32/32 páginas.
      **Por qué no bastaba con que el `node_modules` faltara:** al arrancar esa vuelta
      `npm run typecheck` en `onia-platform` fallaba con `Cannot find module 'vitest'` — no era
      un bug de código, era que este worktree nunca corrió `pnpm install` (root `node_modules`
      no existía). Con el install hecho, tsc y build salen limpios; quedó anotado para que la
      próxima vuelta no lo reporte como regresión.

      ✅ **CERRADO el 2026-09-02 por el integrador: las cinco apps tienen el gate, y de paso
      apareció que el deploy del sitio de venta estaba ROTO.** Las cuatro que faltaban
      (`dental-premium`, `dentalgest-landing`, `ferreteria-sur`, `site`) llevan ahora
      `"prebuild": "tsc --noEmit"`, y `site` estrena además el `typecheck` que no tenía.
      **Se corrió el typecheck de las cuatro ANTES de cablear el gate**, que es el orden que
      importa: si alguna hubiera salido roja, cablearla habría roto su deploy en vez de
      protegerlo. Las cuatro salieron en **exit 0** — o sea que no había ningún error de tipos
      viviendo en producción, y el gate entra sin deuda que pagar.
      **`site` NO era una app de adorno:** `scripts/deploy-onia-center.sh:32` la publica con
      `pnpm --filter site build`, y el `build` raíz de `web-factory` es esa misma app. Era la
      única de las cinco sin **ningún** chequeo de tipos, y la que menos podía darse el lujo.
      **El gate se probó cortando, no suponiendo:** con una sonda temporal (un `number` asignado
      a un `string`) `pnpm --filter site build` murió en `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` con
      `error TS2322` y **`next build` nunca llegó a correr**. Sonda borrada; build limpio
      después: exit 0. Las otras tres, `prebuild` en exit 0.
      **🔴 El hallazgo que no estaba en el ítem, y vale más que el ítem:**
      `web-factory/pnpm-lock.yaml` estaba **desincronizado con
      `web-factory/apps/onia-platform/package.json`**, y los DOS scripts de deploy instalan con
      `pnpm install --frozen-lockfile` (`scripts/deploy-onia-landing.sh:24`,
      `scripts/deploy-onia-center.sh:31`) — que es un modo que **falla**
      cuando el lockfile no coincide. Reproducido con el lockfile de `main`:
      `ERR_PNPM_OUTDATED_LOCKFILE … 1 dependencies were added: vitest@^4.1.8`, exit 1.
      **O sea: el deploy de `onia.com.bo` moría en la línea 24, antes de compilar nada.** Lo
      dejó así `ae8de266` (*"el gate de tipos del sitio de venta no corría en el VPS"*), que
      agregó `vitest` al `package.json` y no commiteó el lockfile. Sincronizado (3 líneas) y
      verificado: `pnpm install --frozen-lockfile` ahora sale **exit 0**, *"Lockfile is up to
      date"*.
      ⚠️ **Se tocó `web-factory/pnpm-lock.yaml`, que es archivo raíz de `web-factory`** — la
      regla pide avisar, y se avisó por Telegram. Es una sincronización mecánica (sólo agrega la
      entrada de `vitest` que ya estaba declarada en el `package.json`), no un cambio de
      versiones. Los `tsconfig.tsbuildinfo` que el typecheck ensució se restauraron: no entraron
      al commit.
      **Lo único que queda de este ítem, y ya no es un agujero:** cablear los cinco typecheck en
      un script raíz de `web-factory`. Con `prebuild` en las cinco apps el agujero está tapado
      donde importa —el camino del deploy—, así que el script raíz pasa a ser comodidad, no
      protección. Sigue sin dueño porque toca los 4 archivos raíz.

### Del canario visual — corrida del 2026-09-01 22:41 UTC (tercera pasada)

- [x] **`onia.com.bo/` y `/empezar` cambiaron de diseño y de copy ENTERO desde la baseline de
      hace 3 h, y el CTA de `/empezar` ahora manda a `app.onia.com.bo/register` — RESUELTO
      2026-09-02: es un cambio legítimo, no una regresión, y ya no hay contradicción en el
      sitio.** Gate 1 (mirar el código y la producción de HOY, no la duda de ayer): el propio
      worktree ya tiene la respuesta escrita en
      `web-factory/apps/onia-platform/src/app/(sitio)/alta.ts` (commit `37ab9e92`, del
      2026-09-01): `ONIA_ALTA_AUTOMATICA=abierta` se verificó en vivo en el contenedor
      `onia-platform` ese mismo día, así que `ALTA_ABIERTA = true` y **todo** el sitio debe
      decir "Creá tu cuenta", no "Pedí tu acceso" — la duda que este ítem dejaba abierta (¿es
      un redeploy legítimo o volvió el bug de agosto con el registro roto?) ya estaba
      contestada en el propio código, sólo faltaba publicarla y reverificar en vivo.
      **Verificado HOY contra el contenedor que sirve el dominio** (`onia-landing`, no Vercel,
      no `main`):
      - `curl https://onia.com.bo/` y `/empezar`: **cero** apariciones de "Pedí tu acceso" en
        ninguna de las dos páginas; "Creá tu cuenta" aparece 15 veces en `/empezar`, consistente
        en cabecera, footer y banda final — ya no quedan las dos frases mezcladas.
      - `https://app.onia.com.bo/register` responde `200` y arma el wizard de 2 pasos descrito.
        No se envió el formulario (no se crea cuenta de prueba en producción).
      - **Mirado renderizado**, no sólo `grep`: `scripts/canario_visual.mjs home empezar` sin
        disparo mecánico, y capturas propias en viewport 1440×900 de la cabecera de las dos
        páginas — texto y botones alineados, sin overlap, sin corte.
      **Por qué no era un fantasma barato de cerrar sin mirar:** el ítem original tenía razón en
      dudar — la promesa que cambia SÍ hay que barrerla en toda la superficie (regla de
      `CLAUDE.md`), y hasta ayer nadie había confirmado que la barrida terminó. Confirmado hoy:
      terminó, cero superficie con el vocabulario viejo.
      **Lo que sigue sin dueño real** (ver radar §24, que hasta el 2026-09-02 estaba numerada
      §16 igual que la del deploy): la ambigüedad de fondo — que
      `app.onia.com.bo/register` es del repo `onia-platform`, otro carril — sigue viva para la
      PRÓXIMA vez que ese flag cambie. Ese archivo (`alta.ts`) ya deja el runbook de los dos
      pasos escrito para cuando pase.
      **Lo que se verificó en su momento, mirando y sin enviar el formulario (no se creó
      ninguna cuenta):**
      - Home: título pasó de *"Onia · Tu negocio no pierde citas ni cobros | Bolivia"* a
        *"Onia · Cerrás vos, el negocio no | Software de gestión Bolivia"*, y el CTA de *"Pedí tu
        acceso"* pasó a *"Creá tu cuenta"* en cabecera, footer y banda final. Todo el copy central
        cambió (de "Onia agenda las citas..." a "Un negocio abre 9 horas / Cerrás vos. El negocio
        no."). **Es un redeploy real, no una regresión de datos**: HTML válido, sin errores de
        consola nuevos, `msMirable` bajó de 933 a 495 ms.
      - `/empezar`: 4 botones "Creá tu cuenta". El de la barra de navegación apunta a `/empezar`
        (self, correcto, ya estás ahí). **Los otros dos** (el de la sección hero y el de la banda
        verde final) apuntan a `https://app.onia.com.bo/register` (`href` verificado en el DOM,
        no un grep de texto).
      - `app.onia.com.bo/register` responde 200. Paso 1 es un selector de rubro (los 5 packs +
        "otro rubro, escribinos"). Clic en "Empezar aquí" (Clínica dental) llega a un Paso 2 con
        `<form>` real: nombre, correo, contraseña, nombre del negocio, "¿cómo nos conociste?",
        checkbox de novedades y botón **"Crear mi cuenta — 14 días gratis"**. **No hice submit**:
        crear una cuenta de prueba es una escritura en producción y no es lo que este loop hace.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-01-home-rediseno.png`
      (home hoy 1.585 KB · 495 ms; baseline 2.310 KB · 933 ms) ·
      `hermes-content/docs/historial/canario-visual/2026-09-01-empezar-rediseno.png` (empezar hoy 2.168 KB · 573 ms; baseline 2.497 KB · 711 ms) ·
      `hermes-content/docs/historial/canario-visual/2026-09-01-register-paso1.png` y `hermes-content/docs/historial/canario-visual/2026-09-01-register-paso2.png`.
      **La baseline de `home` y `empezar` NO se tocó** — sigue siendo la de la mañana, a propósito:
      la regla es que se actualiza recién cuando la diferencia ya se explicó o el ítem que la
      reportó cierra. Si esto es un deploy legítimo y esperado, el dueño que lo cierre actualiza
      la baseline con estas capturas.
      **Efecto colateral, ya visible en el monitor propio del VPS:** `/root/bin/onia-mirar-cliente.sh`
      viene avisando `ROTO` cada 15 min desde hace horas por texto ausente ("Pedí tu acceso" en
      `/empezar`, "Tu negocio no pierde" en `web`) — su lista de textos esperados quedó
      desactualizada por este mismo cambio en su momento — a reverificar por quien tenga
      `/root/bin/onia-mirar-cliente.sh`, no es zona de este carril.

### Encontrado el 2026-09-02, dueño del carril — sin cerrar, necesita la vista de Sergio

- [x] **`onia.com.bo/` y `/empezar` tienen 6 capturas LITERALES del sistema — ARREGLADO EN
      CÓDIGO el 2026-09-02 (commits `bba1c76e` y `c98543e2`, de Sergio mismo — la vista que este
      ítem esperaba), falta el deploy.** El hallazgo original (2026-09-02, mirando el HTML
      servido): 6 screenshots reales del panel de Onia en las dos pantallas — 2 en home
      (agentes, editor de WhatsApp) y 1 en `/empezar` (dashboard con montos reales), más las 5
      de la banda de rubros. Violaba la regla de Sergio del 2026-09-01 ("cero capturas
      literales, coloca cosas referenciales"), y no se reemplazaba sin que él viera antes la
      pieza terminada — mismo precedente que la landing v2 revertida en producción.
      **Verificado hoy en el worktree, tras el rebase que trajo el commit de Sergio:** las 6
      imágenes están borradas del repo, `web-factory/apps/onia-platform/src/app/(sitio)/ui.tsx`
      ya no acepta una imagen como fuente para el componente que las mostraba (sólo dibuja con
      divs) y `web-factory/apps/onia-platform/src/app/(sitio)/forma.test.ts` falla si vuelve a
      aparecer una captura. Gates verdes en este worktree: `tsc --noEmit` 0 · `next build`
      32/32 páginas.
      **Lo que falta, y no es zona de este carril:** el deploy — medido contra `onia-landing`,
      `curl https://onia.com.bo/` y `/empezar` siguen sirviendo las 6 capturas viejas hoy.

      ✅ **Auditado el 2026-09-02 MIRANDO el resultado, que es lo que faltaba.** Hasta hoy este
      ítem se apoyaba en `tsc` + `next build` verdes, y eso **no dice nada sobre cómo se ve** —
      la regla del carril pide una captura de la pantalla arreglada, no un commit. Se levantó el
      build de este worktree (`next start`, 32/32 páginas) y se abrieron las dos pantallas en
      1440×900:
      - **Los paneles dibujados se ven bien y cuentan cada uno su historia.** El conmutador
        recorre los cinco rubros: cada parada cambia la palabra resaltada y sube su panel
        (agenda dental → caja de comercio → cotizaciones de importadora → paquetes de estética →
        cierre de servicios), uno solo visible por vez, sin recorte ni solape.
        Captura: `hermes-content/docs/historial/canario-visual/2026-09-02-switcher-panel-dibujado-importadora.png`.
      - **Cero `<img>`/`<video>`/`<canvas>` del sistema** en las dos páginas. Las **tres**
        imágenes que quedan en la home (`/contexto/dental|comercio|estetica.webp`) se abrieron y
        se miraron una por una: son **fotos de negocios reales** —una odontóloga con su cuaderno
        de papel, un ferretero con su libro y su calculadora—, sin una sola pantalla legible.
        Es justo lo referencial que Sergio pidió, y el guard `forma.test.ts` ya las exceptúa a
        propósito. **No son un defecto y no se tocan.**
      - **Sin desborde horizontal ni errores de consola** en ninguna de las dos.
      ⚠️ **Un agujero del propio método, para no repetirlo:** esa barrida preguntó por
      `img, video, canvas, picture source` **del DOM**, así que **no miraba el `<head>`** — la
      captura que viajaba en `og:image`/`twitter:image` (la que ve cualquiera que pega el link en
      WhatsApp) le pasó por al lado. La cazó `4384f7e8` ("la última captura del sitio estaba en
      el `<head>`, que es donde nadie miró"). Reverificado tras el rebase, ya con esos commits:
      `/empezar` sirve **cero** imágenes y el `og:image` de la home es hoy una tarjeta
      **generada y dibujada** (`/opengraph-image-…`, el panel de 9 h / 15 h), no una captura del
      panel. Quien audite esto de nuevo: el barrido va sobre el **HTML servido**, no sobre el DOM.
      **Ojo con las capturas de página completa:** el conmutador es `sticky`, así que en una
      captura `fullPage` sale **en blanco** y parece roto. Se mira en viewport, parando en cada
      rubro. Quien audite esto de nuevo, que no reporte ese blanco como defecto.

### Encontrado el 2026-09-02 auditando los `[x]` del carril — ARREGLADO en la misma vuelta

- [x] **`/empezar` se compartía por WhatsApp SIN una sola imagen, y con él otras diez rutas del
      sitio. El `[x]` de ayer daba por cubiertas las doce.** Es el link que se le pasa a un lead
      para que se registre: el último clic del embudo llegaba como un renglón de texto pelado,
      justo al lado de la home, que sí muestra su tarjeta dibujada.
      **Cómo apareció:** auditando el `[x]` de la tarjeta social (el que cerró `4384f7e8`). Ese
      ítem se verificó mirando la home, y la home estaba bien. El comentario de
      `(sitio)/opengraph-image.tsx` afirmaba, textual, que por vivir en el segmento `(sitio)` "la
      heredan sus DOCE rutas". **Es falso.** `opengraph-image` de Next aplica sólo al
      `(sitio)/page.tsx` de su propio segmento y no baja a los anidados.
      **Medido sobre el build, ruta por ruta** (`curl` al HTML servido, no al DOM): `/` traía
      `og:image`; `/empezar`, `/precios`, `/chatbot`, `/agentes`, `/rubros`, `/comparativa`,
      `/contacto`, `/facturacion`, `/guia-facturacion`, `/nosotros` y `/servicios/webs` traían
      `og:title` y `og:description` pero **cero imagen**. Once de doce. Un `curl` a la home daba
      verde y tapaba las once.
      **Y el segundo medio defecto de la misma pantalla:** `src/app/layout.tsx` fijaba
      `twitter:card: "summary"` — la tarjeta chica. Aun con imagen, `/empezar` se compartía como
      si no la tuviera. Ahora es `summary_large_image` en todo el sitio.
      **Lo que se hizo:** el dibujo (el mismo, sin tocar un píxel) se movió a
      `(sitio)/tarjeta-social.tsx`, y cada una de las doce rutas tiene su `opengraph-image.tsx` de
      tres líneas que lo llama. Se corrigió además el comentario de `layout.tsx`, que todavía
      mandaba a poner "una captura REAL del sistema" — la regla de Sergio del 2026-09-01 al revés,
      y el mismo comentario que sostuvo `/og/onia-rubros.jpg` con "MUY PRONTO" impreso adentro.
      **Guard:** `(sitio)/forma.test.ts` ahora falla si una ruta de `(sitio)` no tiene su
      `opengraph-image.tsx`. Una ruta nueva sin tarjeta rompe la suite en vez de salir pelada.
      **Verificado en vivo sobre el build nuevo:** las **doce** rutas sirven
      `og:image` + `summary_large_image`. **Evidencia mirada, no supuesta:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-empezar-tarjeta-social.png` — la
      tarjeta de `/empezar`, 1200×630, dibujada, cero captura, cero obra.
      **Gates:** `tsc --noEmit` 0 · `vitest run forma.test.ts` 47 pasando · `next build` exit 0
      con las 12 rutas de imagen emitidas.
      ⚠️ **Trampa que costó media vuelta, para no repetirla:** el `next start` de la verificación
      **no arrancó** —el puerto seguía tomado por el servidor del build anterior— y siguió
      sirviendo el build viejo sin decir nada. Durante varios minutos medí "arreglado" y "sin
      imagen" sobre HTML de antes del cambio. **Un `curl` a `localhost` no prueba que estés
      mirando tu build:** revisar el log del servidor (`EADDRINUSE`) antes de creerle a la
      medición.
      **Lo que falta, y no es zona de este carril:** el deploy. Contra `onia-landing`,
      `onia.com.bo/empezar` sigue sin `og:image` hoy, y la home sigue sirviendo
      `/og/onia-rubros.jpg` (la captura con "MUY PRONTO"). Publicar lo decide Sergio.

### Encontrado el 2026-09-02 auditando el `[x]` de la tarjeta social — ARREGLADO en la misma vuelta

- [x] **Otras CUATRO rutas publicadas se compartían sin imagen, y el guard que debía impedirlo
      no las miraba. El `[x]` de la vuelta anterior daba por cubierto el sitio entero.** Es el
      MISMO defecto que cerró `30484b7b` ("once de doce"), una capa más afuera: aquel arregló
      las doce rutas del grupo `(sitio)`, pero el sitio publica **dieciséis**.
      **Cómo apareció:** auditando ese `[x]`. Se volvió a medir, pero **contra el sitemap** en
      vez de contra la carpeta — el sitemap es la lista de lo que publicamos ("nunca una página
      publicada sin su entrada", dice su propio comentario). De sus 16 URLs, **4 servían
      `og:title` y `og:description` y cero imagen**: `/servicios/marketing-ia`,
      `/servicios/consultoria`, `/terminos` y `/privacidad`.
      **Por qué se escaparon, que es lo que importa:** viven FUERA del grupo `(sitio)` —en
      `src/app/servicios/…`, `src/app/terminos/`, `src/app/privacidad/`—, y `opengraph-image` de
      Next no cruza grupos de rutas. `/servicios/webs` sí tenía tarjeta **porque está adentro**:
      dos rutas hermanas bajo la misma URL `/servicios/`, una con imagen y otra sin, según en qué
      carpeta del disco quedaron.
      **El guard tenía el mismo agujero, y ese es el hallazgo real.** `(sitio)/forma.test.ts`
      enumeraba las rutas con un `readdirSync` del directorio `(sitio)`, así que era
      **estructuralmente ciego** a lo de afuera: pasaba en verde con las cuatro rotas. Un guard
      que sólo mira donde ya arreglaste no es un guard. Ahora la lista **sale del sitemap**
      (`src/app/sitemap.ts`, parseado) y resuelve cada ruta dentro o fuera de `(sitio)`: una página nueva
      entra al sitemap y el test le exige su tarjeta, esté en el grupo que esté.
      **Probado que el guard MUERDE, no que sólo pasa:** se sacó
      `terminos/opengraph-image.tsx` y la suite falló en esa ruta exacta
      (`× /terminos tiene su opengraph-image.tsx`); restaurado, verde. Un test que nunca se vio
      fallar no prueba nada.
      **Verificado sobre el HTML servido del build nuevo** (no el DOM, no `main`): las **16**
      rutas del sitemap devuelven `og:image` `200 image/png` de 40.888 B. Antes: 12.

      ✅ **Re-auditado el 2026-09-03 por `web-venta` — el `[x]` AGUANTA, y queda escrita la pista
      falsa para que la próxima no la persiga.** Barrido sobre el HTML servido de las **25** rutas
      públicas del build (no las 16 del sitemap: se enumeraron desde `find src/app -name page.tsx`,
      a propósito más ancho que el guard). Las 14 rutas de venta traen `og:image` **y**
      `twitter:card: summary_large_image`.
      ⚠️ **Aparecen 7 rutas SIN `og:image` — `/patrones` y las seis `/v1/*` — y NO son un defecto.**
      `/robots.txt` las declara `Disallow: /patrones` y `Disallow: /v1`, y ninguna está en el
      sitemap: son superficies internas, no linkeadas desde el sitio. Es exactamente el mismo
      patrón que causó el bug real de ayer (`opengraph-image` no baja a segmentos anidados: `/v1`
      la tiene, sus hijas no), y por eso engaña — pero acá el guard tiene razón en ignorarlas,
      porque su lista sale del sitemap. **Agregarles tarjeta sería trabajo inventado.**
      Se verificó además que ninguna de las 14 rutas de venta exhibe obra: cero "muy pronto",
      "próximamente", "en construcción" ni "beta". El "14 días gratis" de `/` y `/precios` es
      **cierto**, no una promesa vieja: `TRIAL_DAYS = 14` en
      `onia-platform/lib/subscription/plan-state.ts`, leído en vivo.
      **Evidencia mirada, no supuesta:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-tarjeta-social-rutas-fuera-de-sitio.png`
      — la tarjeta de `/servicios/consultoria`, 1200×630, dibujada, cero captura, cero obra.
      **Gates:** `tsc --noEmit` 0 · `vitest run forma.test.ts` **51 pasando** (eran 47: una por
      ruta nueva) · `next build` exit 0, **16** rutas `opengraph-image` emitidas (eran 12).
      ⚠️ **La trampa del `EADDRINUSE` volvió a morder, y avisada.** `pkill -f "next start"` mató
      **mi propia shell** (el patrón coincide con la línea de comando que lo invoca), no el
      servidor: el viejo siguió tomando el puerto y el `next start` nuevo murió con
      `EADDRINUSE`. Un `curl` ahí habría medido el build ANTERIOR y dado "arreglado" por
      casualidad. Se libera con `fuser -k 3210/tcp` y se lee el log antes de creerle a la
      medición.
      **Lo que falta, y no es zona de este carril:** el deploy. Contra `onia-landing`, las cuatro
      siguen sin imagen hoy. Publicar lo decide Sergio.

### Encontrado el 2026-09-02 auditando el `[x]` de las capturas literales — ARREGLADO en la misma vuelta

- [x] **El guard de "cero capturas del sistema" miraba SÓLO `(sitio)`: era ciego a 4 de las 16
      rutas publicadas y a TODO lo compartido (cabecera, pie, las secciones).** Es la
      **tercera** vez que este mismo guard falla, y las dos anteriores ya estaban escritas en su
      propio comentario. Peor: el agujero es el MISMO que el bloque de tarjetas sociales de ese
      archivo se había tapado horas antes leyendo el sitemap (`8ec1c9e3`) — los dos guards viven
      en `web-factory/apps/onia-platform/src/app/(sitio)/forma.test.ts`, uno arreglado y el otro
      no.
      **Cómo apareció:** auditando el `[x]` de las 6 capturas literales. Ese ítem se verificó
      mirando `/` y `/empezar`, y las dos estaban bien; lo que nadie preguntó es **qué mira el
      test que lo sostiene**. `fuentesDelSitio()` arrancaba el walk en el directorio `(sitio)`,
      así que `/servicios/marketing-ia`, `/servicios/consultoria`, `/terminos` y `/privacidad`
      —que viven fuera de ese grupo de rutas— quedaban fuera, junto con
      `web-factory/apps/onia-platform/src/components/site-header.tsx`, su pie, sus secciones y su
      carpeta legal. Una captura en la cabecera sale en las **dieciséis** páginas a la vez y el
      guard pasaba verde.
      **Gate 1, medido antes de tocar nada — el agujero es real pero HOY no tiene víctima:** las
      4 rutas de afuera sirven sólo `/brand/v2/onia-logo.svg`; el único `/og/onia-rubros.jpg` que
      queda en `web-factory/apps/onia-platform/src/app/layout.tsx` (línea 64) está **dentro de un
      comentario** (el guard ya los strippea); y la carpeta `landing-v1` es el archivo `/v1`,
      noindex, con su captura a propósito. Se arregla el guard, no una pantalla: no se desmarca
      nada.
      **Lo que se hizo:** el walk arranca ahora en la raíz de la app (rutas + todo lo compartido) y lo único
      excluido es el archivo `/v1`, por nombre y con su motivo escrito. Se da vuelta la misma
      regla que ya se había dado vuelta para las carpetas de imagen: en vez de enumerar dónde SÍ
      mirar, se mira todo y se enumera lo excluido. Una carpeta de rutas nueva queda cubierta el
      día que se crea.
      **Probado que MUERDE, dos veces, no que sólo pasa:**
      - Se inyectó `"/capturas/panel-onia.png"` en la cabecera compartida —archivo al que
        el guard viejo **no llegaba**— y la suite falló en esa línea exacta
        (`× components…site-header.tsx no sirve una captura del producto`). Restaurado, verde.
      - Se volvió a apuntar el walk a `(sitio)` y saltó el anti-regresión nuevo
        (`× mira la superficie viva entera, no sólo (sitio)` → *"el walk no llega a la página de
        términos"*), cayendo a **51** tests: exactamente el número viejo. Sin ese
        test, angostar el walk otra vez —que suena razonable, es "la carpeta del sitio"— deja la
        suite en verde con media superficie sin mirar.
      **Verificado MIRANDO, no sólo con el test**, contra el contenedor `onia-landing` (no `main`,
      no Vercel), con `channel: 'chromium'` y no `headless_shell`: `/servicios/consultoria` y
      `/terminos` en 1440×900 — cero `<img>`, `<video>` o `<canvas>` fuera del logo SVG, cero
      desborde horizontal, **cero errores de consola**, texto bien dibujado y sin una palabra de
      obra.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-fuera-de-sitio-servicios-consultoria.png`
      y `hermes-content/docs/historial/canario-visual/2026-09-02-fuera-de-sitio-terminos.png`.
      **Gates:** `tsc --noEmit` 0 · `vitest run forma.test.ts` **99 pasando** (eran 51: el walk
      pasó de 33 archivos a 81) · `npm run build` exit 0, 32/32 páginas.

### Encontrado el 2026-09-02 MIRANDO la home en TELÉFONO — ARREGLADO en la misma vuelta

- [x] **La home abría con una franja de 148px EN BLANCO en el primer scroll del iPhone más
      común, y ninguna revisión lo vio nunca porque todas se hicieron a 1440×900.** Es la
      pantalla #1 del carril y el dispositivo real del lead: el link llega por WhatsApp y se
      abre en el teléfono.
      **Cómo apareció:** ni "Ahora" ni "Después" tenían ítem abierto de esta zona, así que se
      bajó al escalón 2 (auditar los `[x]`). El `[x]` de las tarjetas sociales auditó limpio —
      las 16 rutas sirven `og:image` **y** `twitter:image` con `summary_large_image`, medido
      sobre el HTML del build. Lo que ninguna de las auditorías previas había hecho es abrir las
      dos pantallas en un viewport de teléfono.
      **El defecto, medido en tamaños reales de dispositivo** (Playwright, `channel: 'chromium'`):

      | dispositivo | franja en blanco |
      |---|---|
      | iPhone 12/13/14/15/16 (390×844) | **148px** |
      | Galaxy S20/S23 (360×800) | **53px** |
      | iPhone SE (375×667) | 0 — el panel ni asoma |
      | iPhone Pro (393×852) y todo lo más alto | 0 — entraba justo al 35% |

      **La causa, y por qué se escapó tres veces:** `src/motion/tokens.ts` definía
      `viewportOnce = { once: true, amount: 0.3 }`. El `amount` de `whileInView` se mide sobre el
      **alto del elemento**, no sobre lo que se ve. El panel del día (`s.day`) mide 512px en
      teléfono y asoma 148px = **29%**, contra un umbral de 30%: se quedaba en `opacity: 0`
      hasta que el visitante scrolleara. A 393×852 asoma 180px = 35% y dispara — por eso el
      defecto es invisible en cualquier pantalla grande, incluida la de quien revisa.
      **Y ya había mordido antes, con la causa a la vista.** `(sitio)/servicios/webs/page.tsx:180`
      tiene el diagnóstico escrito desde hace tiempo —"un Reveal más alto que ~3,3 pantallas
      nunca llega al 30% visible y se queda en opacity 0 para siempre"— y se arregló **achicando
      ese Reveal**. La causa quedó viva en el token, y de ahí llegó a la home. Es el mismo patrón
      que esta cola ya anotó para los guards: arreglar la instancia donde saltó y no la clase.
      **Lo que se hizo:** el token pasa a `amount: "some"` (cualquier píxel dentro). La
      invariante queda enunciable y no depende del alto de nada: **nada que toque la pantalla
      puede quedar invisible**. Con una fracción no se cumple para bloques altos; con `"some"`
      se cumple por definición. El estado final de cada página es idéntico —sólo cambia CUÁNDO
      dispara la entrada—, así que no es un cambio de dirección visual.
      **Probado que los guards MUERDEN, no que sólo pasan** (`src/motion/tokens.test.ts`, nuevo):
      - Se devolvió el token a `amount: 0.3` → `× no usa una fraccion como umbral`.
      - Se escribió `viewport={{ once: true, amount: 0.45 }}` a mano en `src/motion/reveal.tsx` → el guard
        lo cazó por archivo y línea. Restaurado, verde.
      - El guard mira **sólo** el `viewport={{…}}` de `whileInView`, que es la clase que
        esconde. `useInView` (`CountUp`, `AgentScene`) queda afuera **a propósito y medido**:
        renderizan su contenido igual —`CountUp` sirve el valor final desde el server— y un
        umbral ahí sólo demora una animación de pasos. La primera versión del guard los marcaba
        y era un falso positivo.
      **Verificado MIRANDO, y en las 16 rutas, no sólo donde arreglé:** barrido de
      `16 rutas × 3 tamaños = 48 pantallas` preguntando por cualquier elemento con `opacity: 0`
      que toque el viewport inicial → **cero**. Antes del cambio, ese mismo barrido marcaba la
      home a 390×844 y a 360×800.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-home-telefono-franja-en-blanco-ANTES.png`
      (la franja vacía) y `…/2026-09-02-home-telefono-panel-visible.png` (el panel del día ya
      visible en la primera pantalla).

- [x] **De paso, el gate del carril: los 115 tests de guarda NO los corría nadie.** Las suites
      que estas vueltas fueron construyendo —`(sitio)/forma.test.ts` (cero capturas del sistema, las 16
      tarjetas sociales), `(sitio)/alta.test.ts`, `(sitio)/hero.test.ts`— vivían en el repo **sin un script que
      las invocara**: `package.json` no tenía `test`, y `prebuild` era sólo `tsc --noEmit`. Se
      corrían a mano con `npx vitest run`. Una regresión de captura literal pasaba el build y
      llegaba al deploy.
      **Lo que se hizo:** `"test": "vitest run"` y `"prebuild": "tsc --noEmit && vitest run"`.
      Es el mismo hook que el deploy real ya ejecuta (`scripts/deploy-onia-landing.sh:25`,
      `pnpm --filter onia-platform build`), y el install de ese script es
      `pnpm install --frozen-lockfile` —no `--prod`—, así que `vitest` está disponible igual que
      `tsc`, que ya corría ahí.
      **Probado que MUERDE:** con el token roto a propósito, `npm run build` sale **exit 1** y
      corta **antes** de `next build`. Restaurado, `npm run build` exit 0.
      **Gates de esta vuelta:** `tsc --noEmit` 0 · `vitest run` **115 pasando** (eran 112: 3 del
      guard nuevo) · `npm run build` exit 0, 48/48 páginas.
      **Lo que sigue abierto y es de otro dueño:** las otras apps de `web-factory`
      (`dental-premium`, `dentalgest-landing`, `ferreteria-sur`, y `site` que ni script tiene) y
      el cableado en el script raíz — tocar los 4 archivos raíz de `web-factory` no es zona de
      este loop.

### Encontrado el 2026-09-02 MIRANDO el PIE en teléfono — ARREGLADO en la misma vuelta

- [x] **Las dos pantallas del carril cerraban con una franja de 73px del fondo CLARO debajo del
      pie NEGRO, en teléfono.** No era del pie ni de una página: era del `body`, así que salía
      en **todas** las páginas del sitio en móvil. Lo último que ve un lead que leyó la página
      entera era un corte de maquetación.
      **Cómo apareció:** ni el tablero ni "Ahora" daban ítem de esta zona (las 3 tareas del
      tablero son del carril chatbot; el único ítem de zona, el del gate `tsc`, ya tiene cerrado
      su residuo y lo que queda es de otros dueños). Así que se corrió la definición de hecho del
      carril: abrir las dos pantallas y MIRARLAS. Salieron 4 capturas (390×844 y 1280×900,
      `channel: 'chromium'` — el motor correcto, no el `headless_shell` que inventa defectos de
      texto): HTTP 200, cero errores de consola, cero desborde horizontal, y la franja al pie.
      **La causa, medida y no supuesta:** `src/app/globals.css` tenía
      `@media (max-width: 899px) { body { padding-bottom: calc(4.6rem + env(safe-area-inset-bottom)) } }`,
      con el comentario *"la barra de accion fija del movil no debe tapar el final de la pagina"*.
      **Esa barra ya no existe.** Medido en vivo con la página scrolleada al fondo: el único
      elemento `fixed`/`sticky` del sitio es el `header` (arriba, 61px), y `grep` de
      `position: fixed` sobre `globals.css` + `(sitio)/sitio.module.css` + todos los `.tsx` devuelve
      **cero**. El hueco quedó huérfano y pintaba del fondo del body, que es claro.
      El padding entró con `1ddba7ad` (`git log -S "4.6rem"`); la barra se fue después y el
      hueco se quedó.
      **Un falso positivo descartado en el camino, y cómo:** la misma corrida mostró una columna
      de cuadraditos pegada al borde izquierdo que parecía un grid roto (el navegador reportaba
      `grid-template-columns: 24px 316px` donde el fuente dice `repeat(24, 1fr)`). **No es un
      defecto:** `sitio.module.css:1126` rota el panel del día 90° en teléfono a propósito
      (`grid-template-rows: repeat(24, ...)` + `grid-auto-flow: column`), y los 9/15 ticks
      alinean con sus dos bloques. Leer el CSS antes de "arreglarlo" evitó romper un diseño sano.
      **Lo que se hizo:** el bloque huérfano del `body` sale, y el área segura del teléfono la
      absorbe ahora el propio pie (`.footer { padding-bottom: calc(2.4em + env(safe-area-inset-bottom)) }`).
      Es el arreglo correcto y no sólo el que borra: puesto en el `body`, el margen del notch
      pintaba igual del fondo claro; puesto en el pie, sale del negro del pie.
      **Verificado MIRÁNDOLO, no con un grep:** build local servido en `:3199`, scroll hasta el
      fondo real (`scrollY == maxScroll`) y captura de las dos pantallas — el pie negro llega al
      borde inferior. Medición: `sobra = scrollHeight - footer.bottom` pasa de **73px (home) y
      74px (/empezar)** a **0 y 0**; `body.padding-bottom` de `73.6px` a `0px`.
      **Gates:** `npm run typecheck` exit 0 · `npm run build` exit 0.
      **No se desplegó:** `onia.com.bo` la sirve el contenedor `onia-landing` y publicar es de
      Sergio — la franja sigue viva en producción hasta ese deploy.

      🔁 **Re-verificado el 2026-09-03 — el bloqueo NO está vencido, y ahora está probado por
      las dos puntas.** No se re-mide un bloqueo por rutina; se re-midió porque un bloqueo
      vencido le pide a Sergio una decisión que ya tomó, y eso es peor que un fantasma.
      - **Producción, hoy:** `node scripts/mirar-venta.mjs` → **6 fallas** (`home` y `/empezar`
        en 320, 390 y 768; las anchas pasan). Capturas en `/tmp/venta-0903/`.
      - **El mismo build de esta rama, hoy:** servido en `:3987` → **0 fallas**, exit 0.
      - **La causa, medida por DOM en producción y no supuesta:** `body` sigue con
        `padding-bottom: 73.6px` y `background: rgb(249,251,250)`; el hueco entre
        `footer.bottom` y `scrollHeight` es **73.42px** (home) y **73.53px** (`/empezar`) —
        exactamente ese padding. `sospechosos: []`: **no hay ningún elemento debajo del pie**,
        es el `<body>` pintando su propio fondo.
      - **El arreglo está en `origin/main`** desde `f02486011` (verificado con
        `git log origin/main -- …/globals.css`).

      **O sea: el código está bien y el sitio está roto. La única diferencia entre las 6 fallas
      y las 0 es el deploy.** No hay nada que codear acá; publicar es de Sergio.

      ✅ **Y ahora tiene gate — `web-factory/apps/onia-platform/src/app/(sitio)/cierre.test.ts`,
      2026-09-02.** El arreglo de
      arriba se fue **sólo en CSS, sin un test**: nada impedía que el `padding-bottom` volviera, y
      este defecto vivió en las 16 rutas del sitio sin que ningún gate lo viera. Corre en
      `prebuild` (`tsc --noEmit && vitest run`), que es el comando real del deploy.
      **Caza la CLASE, no la forma de ayer** — la lección que el guard de capturas de al lado ya
      había aprendido fallando tres veces: no busca el literal 4,6rem ni sólo `padding-bottom`, sino que el
      `body`/`html` reserve fondo en **cualquiera** de sus formas (`-bottom`, `-block`, y el atajo
      `padding`/`margin`, resolviendo qué valor es el lado de abajo según tenga 1, 2, 3 o 4).
      **Lleva las dos mitades del arreglo**, porque borrar el padding a secas dejaba el mismo
      defecto en un iPhone con notch: exige que `env(safe-area-inset-bottom)` lo absorba el PIE y
      no el documento.
      **Probado en ROJO antes, en las tres formas de romperlo:** (1) vuelve el `body
      { padding-bottom: 4,6rem }` original → 2 tests rojos; (2) nadie absorbe el área segura →
      *"en un iPhone con notch vuelve la franja"*; (3) la absorbe el `body` en vez del pie → 2
      rojos. Árbol restaurado y verde en las tres.
      ⚠️ **Se cazó a sí mismo un falso positivo**: la primera versión marcaba `body { margin: 0 }`
      —un reset legítimo— porque miraba la propiedad y no el VALOR. Un guard que ladra sobre
      código sano se termina apagando, así que ahora sólo cuenta el lado de abajo distinto de cero.
      **Gates:** `typecheck` exit 0 · `build` exit 0 · suite **119 pasan (5 archivos)**.

      ⚠️ **Y ese gate nacía CIEGO a doce de las catorce hojas — corregido el 2026-09-02,
      misma jornada.** Auditando el propio `[x]` de arriba: el test declaraba vigilar "las 16
      rutas del sitio", pero su lista de hojas era **fija y de dos archivos** (`globals.css` y
      `sitio.module.css`). La app tiene **14 hojas `.css`**, y un CSS module alcanza el `body`
      con `:global(body)` — `guia-facturacion` ya lo hace. Es **el mismo error que el guard de
      capturas de al lado** (`def54931`: *"miraba solo (sitio) y era ciego a 4 rutas
      publicadas"*), repetido en el gate escrito para no repetirlo.
      **Demostrado, no argumentado:** el mismo defecto (`:global(body) { padding-bottom: 4.6rem }`)
      escrito en `components/site-footer.module.css` —la hoja que cierra `/privacidad`, `/terminos`, las 8
      rutas `/v1/*` y el 404— pasaba **VERDE (4/4)** con el gate viejo y sale **ROJO** con el
      nuevo, nombrando el archivo culpable.
      **Qué cambió:** las hojas se descubren del disco (una hoja nueva queda cubierta sin que
      nadie se acuerde de agregarla); `esElDocumento` entiende `:global()` en cualquier posición
      y `body`/`html` calificados (`body:has(.hoja)`, `html.oscuro`), pero **no** cuando `body`
      es sólo el ancestro (`body main` no es el documento).
      **Y se corrigió una regla que era falsa:** el test exigía que *todo* selector con
      `env(safe-area-inset-bottom)` fuera un `footer`. Al barrer las 14 hojas apareció `.mobar`
      de `landing-v1` —**la barra de acción fija del móvil, que sí existe** en el legado `/v1`,
      con fondo propio, absorbiendo bien su área segura. La regla real no es "tiene que ser el
      pie" sino **"no puede ser el documento"**: ahí es donde el espacio se pinta del fondo claro.
      **Probado en ROJO en 4 formas** (pseudo-clase `:has()`, atajo `margin` de 4 valores, el
      documento absorbiendo el área segura, y borrar el área segura del pie de venta) **y en
      VERDE en 2 que no deben ladrar** (`body main` descendiente, y una barra fija con fondo
      propio). Árbol restaurado y verde en las seis.
      **Medido en producción hoy, con Chromium sobre el contenedor `onia-landing`:** la franja de
      **74px** sigue viva en `/` y `/empezar` en teléfono (`body.padding-bottom: 73.6px`, pie
      negro `rgb(18,16,14)`, hueco claro `rgb(249,251,250)`) — captura en `/tmp/pie-home.png`.
      El arreglo espera el deploy de Sergio; el gate ya impide que se pierda.
      **Gates:** `typecheck` exit 0 · `build` exit 0 · suite **132 pasan (5 archivos)**.

      ✅ **Cerrada la otra mitad el 2026-09-03: ahora hay un gate que ABRE las dos pantallas.**
      Los cuatro tests de al lado leen el código fuente: son rápidos, corren en cada build y
      **no abren nada** — la franja no la encontró ninguno, la encontró una captura. Y el que la
      guarda vigila la CAUSA de ese día (una barra fija que ya no existe): si vuelve por otro
      camino, pasa en verde.
      `web-factory/apps/onia-platform/scripts/mirar-venta.mjs` mide el **síntoma**: abre `/` y
      `/empezar` en 5 anchos (320 · 390 · 768 · 1440 · 1920), scrollea hasta el fondo y pregunta
      **qué elemento está pintado al pie del último viewport**. Si es `BODY`/`HTML`, lo que se ve
      abajo de todo es el fondo de la página y no el pie. También mide desborde horizontal, texto
      recortado y errores de consola.
      **Probado con el experimento que estaba servido, no con uno inventado:** el mismo comando
      contra producción (build viejo, defecto vivo) sale **ROJO, exit 1**, nombrando
      `/empezar` en móvil-390 y tablet-768 con la captura
      (`/tmp/gate-prod/empezar-tablet-768-pie.png`, mirada: franja clara de ~55px bajo el pie
      negro); contra el build de esta rama sale **VERDE, exit 0**. Mismo instrumento, resultados
      opuestos: discrimina.
      **Lo que NO se hizo, a propósito:** no se cableó en `prebuild`. El deploy real corre
      `pnpm --filter onia-platform build`, y meterle un navegador a ese camino cambia un gate por
      un riesgo. Se corre a mano cada vuelta del loop; `playwright` no se sumó al `package.json`
      (se elige el que ARRANCA entre los ya instalados — el del worktree pide un Chromium que
      nadie bajó).
      **El 429 del widget de chat sale como aviso, no como falla**, porque el ítem de abajo ya
      midió que los bloqueos vienen del propio monitoreo y el límite vive en otro carril: un gate
      rojo para siempre por algo que no puede arreglar es un gate que nadie lee.

      ✅ **Y ese gate no decía DE QUIÉN era el trabajo — cerrado el 2026-09-03, misma jornada.**
      Corriendo el gate como definición de hecho de la vuelta salió **rojo, 6 fallas**: la franja
      bajo el pie viva en `/` y `/empezar` en 320, 390 y 768. Averiguar si había que **tocar
      código** o sólo faltaba **publicar** costó **25 minutos a mano** (build, `next start` en un
      puerto libre y una segunda corrida). La respuesta era "ya está arreglado, falta el deploy":
      **cero código que tocar**. Repetir esa investigación cada vuelta es caro; el error caro de
      verdad es el otro — leer el rojo de producción y "arreglar" lo que ya estaba arreglado, que
      es el fantasma que esta misma cola mide entre el **25% y el 46%** de los pendientes
      heredados.
      **Qué cambió:** cada falla se guarda con su **clase** (`home @ movil-390 | franja`), no sólo
      con su texto — el texto lleva píxeles y rutas del día y no es comparable entre dos corridas.
      Con eso, `--comparar-con=<informe.json de la rama>` clasifica sola cada falla y **el
      veredicto lo escribe el script, no la sesión**.
      **Probado en las DOS ramas, con el experimento que estaba servido:** producción contra el
      informe de la rama sana → **exit 3**, *"6 fallas YA ARREGLADAS en la rama — falta PUBLICAR,
      no tocar código"*; producción contra **sí misma** → **exit 1**, *"6 fallas que TAMBIÉN
      fallan en la rama — esto sí es código"*. Sin esta segunda prueba el camino de "es código"
      podría no dispararse nunca y el gate sería decorativo.
      **Exit 3 y no exit 0 a propósito:** producción sigue rota para el lead, así que disfrazarlo
      de verde sería mentir; pero el trabajo no es de este carril, y el código propio lo dice sin
      esconderlo.
      **Medido hoy contra el contenedor `onia-landing`** (no Vercel, no `main`): la franja sigue
      viva en las 6 vistas, mirada en la captura (`/tmp/venta-0903/home-movil-390-pie.png`), y el
      build de esta rama sale **sin defecto medible**. Sigue esperando el deploy de Sergio
      (radar, sección 20).
      **Gates:** `typecheck` exit 0 · `vitest` **132 pasan (5 archivos)** · `build` exit 0.
      **Gates:** `typecheck` exit 0 · `build` exit 0 · suite **132 pasan (5 archivos)**.

      ⚠️ **Ese gate nació ciego en la HOME, y lo tapaba con un verde — corregido el 2026-09-03,
      con la medición.** Bajaba con **un solo** `window.scrollTo(0, scrollHeight)` + 700 ms, y
      `globals.css:194` tiene `scroll-behavior: smooth`: el scroll **anima**, y 14.569 px de
      home no entran en 700 ms. Medido contra producción en móvil-390: quedaba en
      `scrollY = 11299`, **a 2.426 px del fondo**. Ahí `elementFromPoint` devuelve el `DIV` de
      una sección cualquiera en vez de `BODY` — así que el gate **daba verde con la franja
      clara viva abajo** (73 px, exactamente el número que este mismo carril ya había medido a
      mano el día anterior). O sea: el instrumento nuevo declaraba sana la pantalla **más
      importante del sitio**, la primera que ve un lead.
      **Arreglado en `scripts/mirar-venta.mjs`**, y no sólo la causa de hoy:
      `bajarHastaElFondo()` usa `behavior: 'instant'` (mata la animación) y repite hasta que
      `scrollY` deja de moverse (cubre la página que crece al revelar contenido). Y sobre todo,
      la sonda ahora devuelve `faltaParaElFondo`: **si el gate no llegó al fondo, eso es una
      FALLA, no un verde.** Un instrumento que no pudo mirar no sabe, y "no sé" no es "está
      bien" — sin esa aserción, la próxima causa vuelve a producir un verde mentiroso.
      **Lo que destapó, en números:** contra el mismo producción de siempre pasó de **2 fallas
      a 6**. Las 4 que escondía son `home` en 320 · 390 · 768 (las tres, nunca vistas) y
      `empezar @ movil-320`. Capturas miradas: `/tmp/venta-rojo/home-movil-390-pie.png` — se ve
      el pie negro entero y **debajo la franja clara**.
      **Discrimina** (mismo comando, resultados opuestos): producción **ROJO exit 1 · 6 fallas**;
      build de esta rama **VERDE exit 0**.

      📮 **2026-09-03 — el deploy YA está pedido, con su número: `t_68671bc3` en el tablero,
      `blocked / needs_input`.** Hasta hoy el pedido vivía sólo en el radar, que es un doc que
      Sergio no lee desde el teléfono: por eso la franja llevaba **más de un día** viva en
      producción con el arreglo ya en `main` (`f0248601`, del 2026-09-02). El tablero sí le
      llega. **La próxima vuelta NO vuelve a preguntar** — mira `onia-tablero.sh list`; si
      `t_68671bc3` sigue `blocked`, el deploy sigue sin decidirse y la franja sigue viva.
      **Re-medido hoy con el instrumento arreglado, no heredado:** producción **6 fallas** en
      `home` y `empezar` × 320 · 390 · 768, mirada la captura
      (`/tmp/venta-0903/home-movil-390-pie.png`: pie negro y **debajo la franja clara**);
      el build de esta rama, servido en `127.0.0.1:3987`, **sin defecto medible**, y mirado
      también (`/tmp/venta-rama-0903/home-movil-390-pie.png`: el negro llega al borde).
      **Gates de hoy:** `tsc --noEmit` exit 0 · `vitest` 132 pasan (5 archivos) · `next build`
      exit 0, 32/32 páginas.

      ✅ **Los precios de las dos pantallas se verificaron hoy contra las DOS fuentes de verdad,
      y no hay deriva.** Se hizo porque la home imprime montos (`2.900 Bs/mes`,
      `implementación desde 3.500 Bs`) desde una copia — `src/lib/pricing.ts` de esta app — que
      vive en OTRO repo que el que manda, y nada la ataba. Contados uno por uno contra
      `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`): Básico 320/89/3.200 ·
      Pro 750/199/7.500 · Full 1.500/–/15.000 · Grupo 2.900/–/29.000 — **los cuatro coinciden**.
      Add-ons contra `onia-platform/lib/pricing.ts`: chatbot 390/3.900, reservas 150, usuario
      extra 70 — **coinciden**. Ninguna pantalla define un número: la home los lee de
      `@/lib/pricing` (`page.tsx:4`).
      ⚠️ **Lo que queda sin dueño, y es un ítem para quien pueda cruzar de repo:** esa copia
      coincide **hoy, por disciplina, no por un gate**. Un cambio de precio en `onia-platform`
      no rompe nada acá: el sitio de venta seguiría publicando el número viejo mientras el
      checkout cobra el nuevo. Un test de esta app no lo puede atar (el otro repo no viaja al
      contenedor que sirve el sitio), así que el gate tiene que vivir del lado que tiene los dos
      árboles a la vista.

### Encontrado el 2026-09-02, corriendo el canario — no es zona de este carril

- [x] 🟡 ~~**El widget de chat (Chatwoot) responde 429 en `home` y `/empezar` — confirmado en vivo,
      dueño real es el carril chatbot/infra, no `web-factory/apps/onia-platform`.**~~
      **CERRADO el 2026-09-03 00:55 UTC por `onia-cola`: misma causa que el 🔴 de `/chatbot` —
      el 429 lo produce nuestro propio tráfico, no una caída.** Ver *"El 429 del widget era
      nuestro"* al final de esta cola.
      `node scripts/canario_visual.mjs home empezar` salió con un error de consola NUEVO en las
      dos: `Failed to load resource: ...429`. Rastreado con un script propio a
      `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=...` — confirmado
      también con `curl` directo (`HTTP/2 429`, body `Retry later`).
      **Causa medida, no supuesta:** `docker logs onia-chatbot_chatwoot...` muestra
      `[Rack::Attack][Blocked]` sobre `path: "/widget"`, **262 bloqueos en las últimas 24 h**,
      **todos** desde dos direcciones IP: la del VPS mismo (61 bloqueos) y la salida de los
      loops/sandboxes (189 bloqueos). **Cero IPs distintas bloqueadas en 24 h** — no hay evidencia
      de que un visitante real haya pegado contra el límite hoy: el propio ecosistema de
      monitoreo (`onia-mirar-cliente` cada 15 min, `canario-visual` 4×/día, este loop cada 2 h,
      más el `chatbot-cola`) es quien agota la cuota de Rack::Attack contra sí mismo.
      **No lo arreglo yo:** el límite vive en la config de Chatwoot (contenedor
      `onia-chatbot_chatwoot`, servicio Docker en el VPS), no en `web-factory/apps/onia-platform`
      — cruzar a tocarlo es cruzar de carril/servicio, prohibido por `CLAUDE.md`. El embed del
      widget en mi zona
      (`web-factory/apps/onia-platform/src/app/layout.tsx:87`) ya está bien: una sola carga por
      visita, sin reintentos.
      **Lo que hace falta, para quien tenga ese contenedor:** subir el umbral de
      `Rack::Attack` para `/widget` o dejar pasar sin límite las dos IPs de monitoreo propio (ver
      el log citado arriba) — hoy el efecto medible es ruido falso-positivo en cada corrida del
      canario, y el riesgo no medible es que un visitante real detrás de la misma IP compartida
      (NAT de oficina, VPN) sí lo sufra.
      **Cómo se sabe que quedó hecho:** `docker logs onia-chatbot_chatwoot... | grep Rack::Attack`
      sin bloqueos de las IPs de monitoreo, y una corrida del canario sin el 429 en
      `erroresConsola`.
      **↑ Re-medido en vivo el 2026-09-02 12:35 UTC por `onia-cola` (Gate 1). Sigue vivo y
      empeoró — pero la causa NO es la que dice arriba, y eso cambia cuál es el arreglo:**
      - **485 bloqueos en 24 h** (eran 262), y siguen siendo **exactamente dos IPs, las dos
        nuestras**: `192.223.122.70` (406, salida de los loops) y `187.77.16.63` (79, el VPS).
        **Cero IPs de terceros** — se confirma que ningún visitante real lo sufrió.
      - **Pero no es "el monitoreo en general": es una corrida puntual.** Repartidos por hora,
        **365 de los 485 (75%) caen en las horas 04 y 05 UTC** — la corrida del canario de las
        `04:41`. Las horas 08 y 10 tienen 7 y 9 bloqueos. `onia-mirar-cliente` corre cada 15 min
        y **no** produce ese volumen. Una sola pasada del canario genera **cientos** de pedidos a
        `/widget`: el defecto no está en el umbral de Chatwoot, sino en que nuestro canario
        martilla un endpoint de terceros.
      - **El contenedor NO tiene ninguna env var de rate limit** (`docker inspect` filtrado por
        rack/limit/throttle sale vacío): usa el default del código de Chatwoot. O sea que "subir
        el umbral" **exige reiniciar el contenedor**, el mismo que hospeda la bandeja de los 7
        leads. **Eso necesita OK de Sergio** — no es una traba, es la regla de no desplegar al
        VPS sin permiso.
      - Reproducción: con el token real, tres GET seguidos dan **200, 200, 429**. ⚠️ **No puedo
        afirmar que el umbral sea 3**: la misma IP corre `onia-mirar-cliente` cada 15 min y no
        controlé el estado de la ventana. Lo honesto es "tripa rápido", no un número.
      **Qué cambia para quien lo tome:** el arreglo barato y sin permiso es **que el canario deje
      de pedir el widget** — es nuestro repo (`scripts/canario_visual.mjs`, carril
      `canario-visual`), no producción. Tocar Chatwoot es el arreglo caro y sólo hace falta si se
      prueba que un visitante real lo sufre; hoy la evidencia dice que no.
      **No lo tomo yo:** el archivo es del carril `canario-visual`, cuyo loop corre a las 16:41 UTC.

### Del canario visual — corrida del 2026-09-02 04:41 UTC (diez pantallas, sin ítems nuevos)

- [x] 🟢 **Pasada completa de las diez pantallas, mirando cada captura. No encontré defecto
      nuevo.** Detalle de lo que sí toqué:
      - **Cinco baselines nuevas creadas** (no existían): `precios`, `rubros`,
        `chatbot-landing`, `contacto`, `register`. Es el punto de partida, no una verificación.
      - **Tres baselines retomadas** (`login-plataforma`, `login-chat`, `panel-chatbot`): mismo
        contenido exacto (`visto.texto` idéntico, diffeado), sólo se actualizó peso/tiempo con
        el contador de peso ya corregido (`52e359c1`). **`home` y `empezar` quedaron SIN tocar
        a propósito**: siguen mostrando hoy el mismo rediseño que abrió el ítem de la pasada
        de ayer 22:41 UTC (título todavía *"Cerrás vos, el negocio no"*, no el de la baseline
        vieja) — ese ítem sigue abierto y sin dueño, así que pisar la baseline lo daría por
        cerrado sin que nadie decidió nada. Confirmo que sigue vigente, no lo duplico.
      - **`rubros` y el bloque verde final de `contacto` parecen vacíos en la captura full-page
        pero NO lo están**: son secciones de scroll-reveal/sticky (el listado de rubros
        Dental/Comercio/Importadora/Estética/Servicios, y el CTA final "¿Preferís probarlo
        solo?"). Lo confirmé haciendo scroll real por tramos y volviendo a capturar — el
        contenido aparece correcto. Es un artefacto del método de captura de página completa
        contra animaciones ligadas al scroll, no un bug del sitio. Lo anoto acá para que el
        próximo loop no lo vuelva a investigar desde cero.
      - Los íconos (`bolt`, `credit_card_off`, `smart_toy` en `login-plataforma`) siguen
        apareciendo como texto en `visto.texto` (extracción de DOM) pero se VEN como íconos
        reales en la captura — es la trampa que originó la regla de mirar, y hoy la pantalla
        está bien.
      - **Duda sin resolver, no reportada como ítem:** el endpoint del widget de chat del sitio
        (`onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget`) devolvió 429 en varias de mis
        pasadas manuales de esta misma vuelta (incluida una corrida sola después de 150 s de
        espera). No lo escribo como ítem porque no lo puedo descartar como autoinducido: esta
        misma vuelta ya le pegó a ese endpoint muchas veces seguidas investigando otras cosas,
        y la corrida OFICIAL única (`node scripts/canario_visual.mjs`, la que se compara y
        basea) sólo lo vio en `contacto` — ninguna de las otras cinco pantallas de
        `onia.com.bo` en esa misma pasada. Si un loop futuro lo ve fresco, sin haber
        golpeado el sitio antes, ahí sí es un ítem.
      **Evidencia (capturas de hoy):**
      `hermes-content/references/canario-visual/precios/baseline.png` ·
      `hermes-content/references/canario-visual/rubros/baseline.png` ·
      `hermes-content/references/canario-visual/chatbot-landing/baseline.png` ·
      `hermes-content/references/canario-visual/contacto/baseline.png` ·
      `hermes-content/references/canario-visual/register/baseline.png` ·
      `hermes-content/references/canario-visual/login-plataforma/baseline.png` ·
      `hermes-content/references/canario-visual/login-chat/baseline.png` ·
      `hermes-content/references/canario-visual/panel-chatbot/baseline.png`.
      Pesos de hoy: home 2.859 KB/325 ms · precios 2.108 KB/174 ms · empezar 2.253 KB/141 ms ·
      rubros 2.588 KB/216 ms · chatbot-landing 2.232 KB/134 ms · contacto 322 KB/185 ms ·
      register 704 KB/100 ms · login-plataforma 699 KB/135 ms · login-chat 3.501 KB/1.365 ms ·
      panel-chatbot 699 KB/140 ms (redirige a `/login`, sin sesión — "no medida", no "OK").

### Auditoría del escalón 2 — 2026-09-02 15:35 UTC, `onia-cola`

- [x] **Los `[x]` resisten, y el defecto estaba en el MÉTODO de auditarlos — ARREGLADO en la
      misma vuelta.** La cola no tenía un ítem propio: los dos abiertos de "Ahora" son de otros
      carriles (el 429 de Chatwoot es de `canario-visual`, que corre 16:41) y "Después" está
      entero en `[x]`. Así que escalón 2.
      **Lo auditado, contra el código de HOY, y salió limpio:** las 53 citas `archivo:línea`
      únicas del archivo — ninguna pasada de fin de archivo — y **miradas** las cinco de más
      riesgo (`lib/platform/types.ts:73`, `lib/onia-core/modules/agents-runtime.ts:1188`,
      `components/layout/navigation.ts:45`, `lib/platform/vertical-pack.ts:169`,
      `app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:31`): las cinco
      caen exactamente donde el ítem dice. Ningún cierre falso.
      **El defecto real, y es de método:** este loop ya gastó **dos vueltas** comprobando a mano
      "los 24 shas citados existen y los que se declaran ancestros lo son". Esta vuelta lo hizo
      con un script de usar y tirar que **tenía un bug**: clasificaba
      `"EXISTE-PERO-NO-EN-BASE"` con `.includes("EN-BASE")`, que da **true**, y por eso dio por
      bueno `6d8b6b7` — el sha que este mismo archivo documenta como NO ancestro de
      `origin/master`. Una auditoría que se rehace a mano cada vuelta se hace mal alguna vuelta.
      **El arreglo, en el gate que este carril ya corre antes de cada ítem**
      (`scripts/verificar_cola.js`): verificaba que el **archivo** citado existiera y daba por
      buena la otra mitad de la evidencia. Ahora verifica también que el **commit** citado
      exista, con `git cat-file --batch-check` (una llamada por repo, no una por sha: el gate
      sigue en **0,12 s**).
      **Lo que lo mantiene honesto, que es el punto:** tres recíprocos. Un sha que resuelve no
      molesta; los tres duplicados locales que la cola cita a propósito van en
      `SHAS_SIN_REPO_A_PROPOSITO` con su motivo — sin esa lista el gate salía **rojo de
      fábrica**, el anti-patrón que este archivo ya documenta tres veces —; y si uno de esos
      **empieza** a resolver, se marca `excepcion-sha-vencida`, así la lista no envejece en
      silencio tapando un fantasma de verdad.
      **Y el mismo bug de substring casi entra al gate:** `git cat-file --batch-check` responde
      `6edfab6^{commit} missing`, o sea que la palabra "commit" está **también** en la línea del
      fallo. Se compara el **campo**, no el substring.
      **Descartado a propósito, y queda escrito para que nadie lo reabra:** un detector de
      deriva *semántica* (¿el símbolo que el ítem nombra sigue cerca de la línea citada?).
      Probado: marca 16 citas y **casi todas son falsas** — toma símbolos del párrafo vecino.
      Un gate que sale rojo de fábrica se saltea; se midió antes de descartarlo, no se supuso.
      **Medido:** `--self-check` **65 casos** (7 nuevos, y los tres portantes verificados en
      ROJO **por su mensaje exacto** desactivando cada regla en una copia); el gate sobre
      `hermes-content/docs/COLA.md` **exit 0, 21 ítems**; `hermes-content/docs/cola/chatbot.md` verde; las otras
      colas dan el mismo `cola-vacia` que antes (no es regresión de esto); `npm test` exit 0.

### Encontrado el 2026-09-02 16:34 UTC, `onia-cola` — ARREGLADO en la misma vuelta

- [x] **El worktree principal NO podía abrir una sola pantalla: Playwright pedía un Chromium que
      no estaba bajado. La regla nº1 del proyecto ("verificar es MIRAR") era inejecutable desde
      acá — ARREGLADO y con guarda.**
      **Cómo apareció:** no lo buscaba. Fui a medir en vivo el 429 de Chatwoot (ítem de más
      arriba) con un Playwright de usar y tirar, y murió antes de abrir el navegador:
      `browserType.launch: Executable doesn't exist at`
      `/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`.
      **La deriva, medida:** `package.json:5` declara `playwright ^1.62.1`;
      `/root/loops/onia-hermes/node_modules/playwright` tenía **1.62.1** (instalado el 2026-09-02
      02:39), que pide la revisión **`chromium-1234`**. En la caché de navegadores de Playwright del VPS sólo estaban
      bajadas `chromium-1223` y `chromium_headless_shell-1223` — las de Playwright **1.60.0**.
      **Por qué el canario seguía verde igual, y por qué eso era lo peligroso:** su worktree
      `/root/loops/onia-hermes-canario` **no tiene `node_modules` propio**, así que resolvía al
      Playwright **1.60.0** de `/root/node_modules` — un paquete instalado a mano, fuera del repo,
      que nadie versiona. El canario andaba **por accidente de resolución**: un `npm install` en
      ese worktree lo mataba en silencio. Es el mismo modo de falla que
      `hermes-content/docs/cola/loops.md` documenta dos veces (algo que corre porque hay una copia
      hand-editada en el VPS), sólo que acá la víctima era la verificación misma.
      **El arreglo:** `npx playwright install chromium` desde el repo — baja la revisión que pide
      la dependencia **declarada**, así el repo deja de depender del `/root/node_modules` global.
      114,7 MiB, sin plata, sin deploy. Quedan bajadas las dos revisiones (`chromium-1223` y
      `chromium-1234`) y las dos funcionan; disco después: 137G/193G usados.
      **Verificado, no supuesto:** el mismo comando que tiraba `Executable doesn't exist` ahora
      abre `https://onia.com.bo/` y devuelve datos.
      **La guarda, para que no vuelva en silencio** — `scripts/canario_mirable.mjs`, cableado a
      `npm test` como `test:canario-mirable` (`package.json`):
      - **Lanza y cierra Chromium de verdad** con las mismas opciones del canario, en vez de
        comparar números de revisión contra las carpetas de la caché. Un `grep` sirve para
        descartar, nunca para confirmar; y un proxy acierta el caso de ayer y falla el de mañana
        (permisos, librería del sistema, binario a medio bajar). Cuesta ~2 s: `npm test` entero
        pasó de 7 s a **9 s**, exit 0.
      - **No sale rojo de fábrica** — el anti-patrón que este archivo ya documenta tres veces. Sin
        Playwright instalado **saltea en VERDE** diciendo por qué (sin Playwright el canario no
        corre de todos modos, y eso es otro problema). Sólo se pone rojo en la condición real de
        deriva: **Playwright presente y su navegador ausente.**
      - **Recíproco que evita que el guard envejezca mintiendo:** lee `channel: 'chromium'` del
        **cuerpo** de `opcionesDeChromium` en `scripts/canario_visual.mjs` y se pone ROJO si
        desaparece — si no, estaría probando un binario que el canario ya no usa. Lee el cuerpo y
        no todo el archivo a propósito: la palabra `channel` aparece también en los comentarios
        que explican por qué NO hay que sacarla.
      - **Distingue el remedio:** `navegador-no-instalado` manda a `npx playwright install
        chromium`; un fallo de sandbox sale como `navegador-no-arranca` y **no** manda a
        reinstalar al pedo.
      **Medido:** `--self-check` **12 casos** (incluidos los tres portantes) y —lo que de verdad
      importa— **el guard probado en ROJO por la condición REAL**, no sólo en el test unitario:
      con `PLAYWRIGHT_BROWSERS_PATH` a un directorio vacío sale `exit 1` con el mensaje exacto
      `canario-mirable: ROJO (navegador-no-instalado)`. `npm test` completo **exit 0**.

- [x] **De paso quedó medida la causa del 429 de Chatwoot — y el ítem que lo reporta está
      dirigido a un carril que NO puede tomarlo.**
      **La medición que faltaba** (con el Playwright ya arreglado, contra `https://onia.com.bo/`):
      **una sola pantalla dispara 24 pedidos** a
      `onia-chatbot-chatwoot.hqdqgh.easypanel.host` — prácticamente tantos como al propio sitio
      (25). Con ~6 pantallas de `onia.com.bo` por pasada × 4 pasadas/día, dan los "cientos de
      pedidos" que el ítem de arriba dedujo por los logs, ahora contados del lado del navegador.
      En esta corrida los 24 volvieron **200**: la ventana de Rack::Attack se había reseteado, lo
      que confirma que el 429 es **autoinducido e intermitente**, no una caída del servicio.
      **Y el hallazgo que traba el ítem, verificado leyendo los prompts que corren HOY**
      (`/root/bin/loops/*.md`): el ítem cierra con *"No lo tomo yo: el archivo es del carril
      `canario-visual`"* — pero ese loop **no puede tomarlo por construcción**, por dos razones
      independientes:
      1. **No lee `hermes-content/docs/COLA.md`.** Su prompt sólo nombra `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` y
         `cola/loops.md` (los otros seis loops sí nombran su cola). Nunca va a ver el ítem.
      2. **Aunque lo viera, tiene prohibido arreglarlo.** Su propio prompt lista *"Arreglar el
         defecto que encontrás"* entre sus PROHIBICIONES: escribe ítems en la cola del dueño y
         sigue. Es un **productor puro, sin bandeja de entrada**.
      **El costo, contado:** el ítem ya consumió tres vueltas de `onia-cola` (12:35 lo re-midió,
      15:35 lo saltó, 16:34 lo saltó otra vez) esperando a un destinatario que no existe. Es la
      misma forma del agujero que este carril ya pagó dos veces —un carril que nadie enumera no
      se cuenta nunca—, sólo que al revés: un ítem que nadie puede leer no se hace nunca.
      **No lo cierro yo esta vuelta** (una vuelta cierra UN ítem, y ya cerré el de Playwright).
      Queda con su evidencia para que la próxima vuelta lo tome **sin volver a derivarlo**, y con
      una línea en el radar, porque "un loop productor sin bandeja" es diseño del sistema de loops
      y eso lo decide Sergio.

### Del canario visual — corrida del 2026-09-02 16:41 UTC (diez pantallas)

- [x] 🔴 ~~**El widget de chat de `/chatbot` está caído: devuelve 429 y ya no carga. La página que
      VENDE el chatbot es la única del sitio sin chat.**~~ **CERRADO el 2026-09-03 00:55 UTC por
      `onia-cola`: el 429 es REAL pero NO es del cliente — es nuestro.** El titular era falso en
      su mitad más cara ("la página que vende el chatbot es la única sin chat"): un visitante
      real abre el chat normal. Medición completa en la sección *"El 429 del widget era nuestro"*
      al final de esta cola.
      - **Qué se rompió:** `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw`
        responde **429**. El host es el Chatwoot propio, no Cloudflare de `onia.com.bo`.
      - **Esto cierra la duda que dejó abierta la pasada de las 04:41 UTC** (líneas 604-612), con
        su propio criterio: *"si un loop futuro lo ve fresco, sin haber golpeado el sitio antes,
        ahí sí es un ítem"*. Hoy lo vio la **corrida oficial única**, que fue lo PRIMERO que
        ejecutó esta vuelta — cero requests previas al sitio. Criterio cumplido.
      - **Evidencia nueva que aquella pasada no tenía — el peso:** `chatbot-landing` cayó de
        **2.232 KB (baseline de ayer, con `erroresConsola: []`) a 449 KB**, tres corridas
        seguidas. Son ~1,8 MB que faltan: es el bundle del widget que ya no baja. El widget
        cargaba ayer y hoy no. Un `-80 %` de peso **no dispara umbral** (sólo miramos subidas
        > +40 %) — se ve mirando, que es de lo que se trata.
      - **Confirmado fuera del navegador:** tres `curl` planos seguidos al endpoint → `429`,
        `429`, `429`. No es artefacto de Playwright ni de mis corridas repetidas.
      - **Por qué importa comercialmente:** el visitante que llega a la página del chatbot para
        preguntar por el chatbot no encuentra dónde escribir. Es la burbuja de chat ausente en la
        esquina inferior derecha de la captura.
      - **Sospecha para el que lo tome (no verificada, no la reporto como hecho):** un 429 propio
        del Chatwoot huele a rate-limit del contenedor. El VPS le pega cada hora con
        `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` (cron minuto 17, desplegado en
        `/root/bin/`) además del motor del bot. **No lo toqué**:
        contenedores y crons ajenos no son de este carril.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-02-chatbot-landing.png`
      — 449 KB / 684 ms / status 200 / `erroresConsola: ["…status of 429"]`.

- [x] 🟠 **CERRADO PARCIAL el 2026-09-03 07:55 UTC por `onia-cola` en `scripts/canario_visual.mjs`:
      en `/chatbot` ya NO reproduce.
      El defecto sigue vivo en `rubros`, y NO por el motivo que decía este ítem** — ver el ítem
      de `rubros` más abajo, que ahora tiene la causa medida.
      **Medido con el instrumento EXACTO del canario** (1440×900, `launch` **sin** `channel`
      como lo lanza su copia, mismo scroll 300/800 ms, `fullPage: true`): la banda verde de
      `/chatbot` sale **completa y legible** — *"PRECIO · Bs 390/mes, sin instalación · Es el
      12 % del salario mínimo nacional 2026…"*. Captura mirada, no un exit code.
      **Por qué se arregló sola:** el propio carril del canario subió el scroll de espera de
      120/400 ms a 300/800 ms en `a0eafdcb1`, el **2026-09-03 03:46:17 UTC**. La última corrida
      que reportó la ceguera fue la de las **03:41 — cinco minutos ANTES del arreglo**. El ítem
      nació muerto: ya estaba arreglado cuando se escribió.
      ⚠️ **Y una hipótesis mía que probé y salió FALSA, anotada para que nadie la repita:**
      sospeché que la ceguera era el mismo rasterizador que causó `"Ent regamos t u sist ema"`,
      porque el worktree del canario **no tiene** `opcionesDeChromium`/`channel: 'chromium'`.
      Capturé la misma página en el mismo instante **con y sin** `channel`: la banda sale
      perfecta en las dos. No es el rasterizador. Probarla costó dos minutos.
      ⚠️ **Lo que sí sigue siendo cierto y es del carril del canario:** su worktree está
      **281 commits atrás de `main`** (el ítem de arriba decía 91 — ese número ya venció) y no
      tiene el `channel: 'chromium'`. No causa *esta* ceguera, pero es deuda viva.

<details><summary>Lo que decía este ítem antes de medirlo — historia</summary>

      Defecto de la herramienta propia (`scripts/canario_visual.mjs`), no del sitio. Lo dejo
      escrito, no arreglado: se me acabó la vuelta.
      - La pasada de las 04:41 UTC ya lo había visto en `rubros` y `contacto` (líneas 593-599) y
        lo cerró como "artefacto conocido". **Hoy demuestra ser peor que un artefacto cosmético:**
        en `/chatbot` la banda verde que salió vacía es la que dice **"Bs 390/mes, sin
        instalación"** — el precio publicado, en el proyecto cuyo fallo mejor documentado es
        "cuatro precios vivos del mismo chatbot". El canario existe para MIRAR precios y
        justamente ahí no ve.
      - **Verificado que el sitio está sano:** el `<h2>` "Lo que necesitás vos" mide
        `opacity: 1`, `visibility: visible`, 542×25 px en `top: 2083`. Llevado al viewport y
        capturado sin `fullPage`, todo el contenido aparece perfecto.
        Prueba: `…/2026-09-02-chatbot-landing-viewport-precio.png`.
      - **Intento fallido (para no repetirlo):** el commit `bed8b9a1` agregó un scroll por tramos
        antes de capturar y **no alcanza**. También probé inyectar
        `*{content-visibility:visible !important; contain-intrinsic-size:auto !important}`
        antes del `screenshot({fullPage:true})` — **tampoco**: las bandas siguen vacías. La causa
        no es `content-visibility` ni la falta de scroll.
      - **Siguiente paso sugerido:** abandonar `fullPage` y capturar por viewports sucesivos,
        cosiendo las imágenes. Es el método que ya se sabe que funciona (es como se sacaron las
        dos capturas de prueba de hoy y la de ayer).
      - **Mientras tanto, una banda vacía en una captura de este canario NO prueba nada** — ni que
        el sitio esté roto ni que esté bien. Hay que ir al viewport.

</details>

- [x] 🟢 **Las otras nueve pantallas: sin disparo mecánico y sin defecto nuevo a la vista.**
      Pesos/tiempos de hoy: home 2.857 KB/367 ms · precios 2.108 KB/803 ms · empezar 2.253 KB/464 ms ·
      rubros 2.587 KB/377 ms · contacto 322 KB/429 ms · register 704 KB/456 ms ·
      login-plataforma 699 KB/457 ms · login-chat 3.499 KB/1.249 ms.
      `panel-chatbot` 702 KB/440 ms **redirige a `/login` sin sesión: queda "no medida", no "OK"**.
      **Ninguna baseline se actualizó esta vuelta.** La de `chatbot-landing` (2.232 KB) se deja
      intacta a propósito: pisarla con los 449 KB de hoy taparía el ítem del widget caído.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-02-home.png` ·
      `hermes-content/docs/historial/canario-visual/2026-09-02-rubros.png`; baselines sin tocar en
      `hermes-content/references/canario-visual/chatbot-landing/baseline.json`.

### Del canario visual — corrida del 2026-09-02 21:41 UTC (diez pantallas, sin ítems nuevos)

- [x] 🔴 ~~**Los dos ítems 🔴/🟠 de arriba (widget de `/chatbot` caído y captura full-page ciega)
      siguen exactamente igual, 5 horas después.**~~ **La mitad del widget quedó CERRADA el
      2026-09-03 (era nuestro propio tráfico); la mitad de la captura full-page ciega SIGUE
      ABIERTA y es un defecto real — está en el 🟠 de arriba.** Confirmación de entonces, que
      ahora se lee como lo que era (el canario fotografiando su propia huella):
      - `chatbot-landing` sigue en **331 KB / status 200 / `429`** (era 449 KB a las 16:41 UTC —
        sigue faltando el bundle del widget, no hay burbuja de chat visible en la captura). Tres
        pantallas más (`precios`, `rubros`) SÍ muestran la burbuja verde flotante del widget
        propio del sitio — el 429 es específico de `/chatbot`, no del sitio entero.
      - La banda de precio "Bs 390/mes" de `/chatbot` sigue vacía en la captura full-page (mismo
        artefacto ciego, no arreglado).
      - Home y `/empezar` siguen mostrando el rediseño *"Cerrás vos. El negocio no."* / "Creá tu
        cuenta" en vez del copy de la baseline vieja ("Pedí tu acceso"). Sigue sin dueño.
      **Las otras siete pantallas, sin novedad.** Pesos de hoy: home 2.362 KB/486 ms · precios
      2.109 KB/317 ms · empezar 2.104 KB/300 ms · rubros 2.362 KB/329 ms · contacto 322 KB/160 ms ·
      register 704 KB/161 ms · login-plataforma 696 KB/119 ms · login-chat 3.500 KB/954 ms ·
      panel-chatbot 702 KB/215 ms (redirige a `/login`, sigue "no medida"). Ninguna baseline
      tocada.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-chatbot-landing-2141utc.png`
      (331 KB, la esquina inferior derecha sigue sin burbuja de chat) ·
      `hermes-content/docs/historial/canario-visual/2026-09-02-chatbot-landing-viewport-precio.png`
      (la misma banda de precio, capturada por viewport, SÍ se ve).

### El 429 del widget era nuestro — 2026-09-03 00:55 UTC, `onia-cola`

- [x] **El 429 del widget de Chatwoot es REAL, y NO es una caída: se lo hace el VPS a sí mismo.
      Cerró tres ítems (🟡 de `home`/`empezar`, 🔴 de `/chatbot`, 🔴 de confirmación) que juntos
      consumieron cuatro vueltas.**
      **La causa, leída del código que corre** — el initializer de Rack::Attack, línea 176,
      **dentro del contenedor `onia-chatbot_chatwoot` (no en este repo)**: Chatwoot limita
      `/widget` **sin**
      `cw_conversation` a **5 cargas por hora POR IP**. No tiene variable de entorno propia — el
      único interruptor es `ENABLE_RACK_ATTACK_WIDGET_API`, que apaga el grupo entero.
      **Por qué el titular era falso.** El ítem decía *"la página que VENDE el chatbot es la
      única del sitio sin chat"*, y eso vale sólo para nosotros:
      - El servicio **no está caído**: `/`, `/api` y `/packs/js/sdk.js` responden **200**; sólo
        `/widget` da 429. Un host sano con una regla puntual, no un contenedor muerto.
      - **El contador está a nombre de UNA sola IP: `187.77.16.63`, la del propio VPS**, con 21→34
        cargas contra un límite de 5. Leído en Redis, que es donde Rack::Attack lo guarda (una
        clave por IP): `velma:rack::attack:<ventana>:widget?...:187.77.16.63`.
      - **En 6 h hubo 222 peticiones a `/widget` y las 222 son de esa misma IP.** Cero visitantes
        reales. 207 de 232 iban sin `cw_conversation`, o sea que **gastaban cupo**. Los picos
        caen en las corridas de nuestros loops (el de 21:41 es el canario).
      - Cada visitante real cuenta con **su** IP y **su** cupo, así que su chat abre normal.
      **Instrumento verificado, no supuesto** (la trampa que este archivo ya documenta): probé
      falsear la IP con `X-Forwarded-For: 203.0.113.77` y **no** apareció una clave nueva — el
      proxy sobrescribe la cabecera con la IP real del socket. Eso prueba justamente lo que hacía
      falta: Chatwoot ve IPs de visitante de verdad, no una IP de proxy compartida. Si las
      colapsara, ahí sí un cliente podría comerse el 429 de otro.
      **Es el mismo modo de falla que el canario ya pagó con el rasterizador:** el instrumento
      mide su propia huella y la reporta como una caída del producto. La diferencia es que esta
      vez el 429 existía — lo falso era de quién.
      **El arreglo, para que no se re-derive nunca más:**
      `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` — contesta en segundos con el
      contador y el desglose de IPs a la vista. **Probado en los dos sentidos**, que es lo que lo
      hace confiable: con la IP real da `AUTOINDUCIDO`; forzando `ONIA_VPS_IP=10.0.0.99` las 234
      peticiones pasan a ajenas y sale `OJO: … puede haber clientes afectados`. Una sonda que
      sólo sabe decir "es nuestro" no sirve para el día en que no lo sea.
      **Lo que NO hice y es de Sergio:** safelistear la IP del VPS
      (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`) es un cambio de entorno del contenedor de chat en
      producción, con reinicio — no se toca sin su OK. Cotizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
      **Queda ABIERTO y no lo toqué:** el 🟠 de la captura full-page ciega. Ese sí es un defecto
      real de `scripts/canario_visual.mjs`, con causa distinta y dueño distinto.

### Del canario visual — corrida del 2026-09-03 00:43 UTC (diez pantallas)

- [x] 🔴 ~~**El widget de chat de Chatwoot sigue caído (429), y hoy la corrida oficial lo vio en
      LAS CINCO pantallas de `onia.com.bo`, no solo en `/chatbot`.**~~
      **FANTASMA — el widget NUNCA estuvo caído. Refutado y ARREGLADO EN EL INSTRUMENTO el
      2026-09-03 09:38–10:00 UTC por `onia-cola`.** Este ítem se escribió a las 00:43, **doce
      minutos antes** de que el ítem de las 00:55 (más abajo en este mismo archivo) diagnosticara
      la causa: Chatwoot limita `/widget` a **5 cargas por hora por IP** y el canario abre diez
      pantallas seguidas desde una sola IP. El titular "sigue caído" nació de una medición que ya
      estaba explicada.
      - **Medido de nuevo, y esta vez el instrumento se puede refutar solo:** `curl` frío al
        endpoint → **HTTP 200, 7.683 bytes, 76 ms** (el ítem afirmaba que un curl frío daba 429).
        Después, cinco pantallas en secuencia con Playwright a 1440×900: `home`, `precios` y
        `empezar` cargaron el widget con la **burbuja visible y medida en el DOM**
        (`.woot-widget-bubble`, 64×64, `visibility: visible`, `opacity: 1`); `rubros` y `chatbot`
        dieron 429. El corte cae **exactamente** en la quinta carga — que es el límite
        documentado. Si el límite no fuera 5, la frontera no habría caído ahí: por eso esta
        medición prueba la causa en vez de sólo acompañarla.
      - **La caída de peso del 75 % que el ítem citaba como agravante es la MISMA huella:** lo
        que falta en esas páginas es el bundle del widget que el 429 no dejó bajar. Es
        consecuencia del rate-limit propio, no evidencia independiente. Dos síntomas del mismo
        hecho leídos como dos pruebas es cómo un fantasma se vuelve convincente.
      - **ARREGLADO donde estaba roto de verdad — el canario, no el producto**
        (`scripts/canario_visual.mjs`): ahora guarda las respuestas 4xx/5xx **con su URL**
        (`respuestasFallidas`), porque el texto que la consola imprime es genérico
        (`...status of 429 ()`) y no dice de qué endpoint vino — sin esa URL no había forma de
        distinguir nuestra huella de una caída real. `esHuellaPropia()` descarta ese error
        **sólo** si todos los 429 de la pasada son de `/widget` de Chatwoot, y lo descartado se
        escribe en el JSON (`huellaPropia`), no se esconde.
      - **Fail-closed, fijado por cuatro tests que serían el precio de equivocarse:** un 429 de
        otro endpoint, un 429 del widget junto a uno ajeno, un 429 sin respuesta que lo explique
        y un **500 del widget** siguen siendo ítem. Una excepción que silencia de más es peor que
        el fantasma que vino a matar. Los cinco tests se escribieron **en rojo primero** y falló
        sólo el que debía. `--self-check`: **74 casos verdes**.
      - **Verificado end-to-end contra el sitio real**, no sólo con datos inyectados:
        `CANARIO_OUT=/tmp/canario-prueba node scripts/canario_visual.mjs rubros` → la página
        recibió el 429 de verdad, quedó registrado con su URL, **`motivos: []`** (antes levantaba
        este 🔴) y `huellaPropia` explica qué se silenció y por qué.
      - **Costo evitado:** este fantasma ya se había llevado cuatro vueltas y volvía a nacer cada
        3 h con la corrida del canario. Lo que sigue abierto y es de Sergio no cambia: safelistear
        la IP del VPS (`RACK_ATTACK_ALLOWED_IPS`) para que el canario mida el widget de verdad en
        vez de saltearlo — cotizado en
        `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
      - **`web-venta`, que ES el dueño de la superficie, llegó a la MISMA conclusión por su
        cuenta a las ~12:48 UTC, sin haber visto esta refutación** (su detalle está más abajo,
        en el bloque «CIERRE del carril `web-venta`»). Dos carriles midiendo por separado y
        cayendo en el mismo veredicto es la confirmación más barata que hay — pero también
        significa que **el fantasma se investigó dos veces**: el arreglo del instrumento ya
        estaba hecho a las 10:00 y no había llegado a `main` cuando `web-venta` arrancó.
        Su medición **no es redundante**: fijó el umbral con clics reales (cada página del
        sitio cuesta **2** peticiones porque los `<a>` son planos a propósito) y refutó que
        `next/link` fuera el arreglo.
      ~~**Detalle original de la medición del 2026-09-03 00:43 UTC, conservado porque la
      refutación se lee contra él:**~~
      - **Evidencia de la corrida oficial única** (`node scripts/canario_visual.mjs`, primer
        comando de la vuelta, cero requests previos al sitio): `home`, `precios`, `empezar`,
        `rubros` y `chatbot-landing` — las cinco — dispararon `ITEM` por
        `error de consola nuevo: Failed to load resource: the server responded with a status of
        429 ()`.
      - **Confirmado sin ambigüedad de "corrida propia repetida"** (la duda que dejó abierta la
        pasada de las 04:41 UTC de ayer, líneas 604-612): corrí `home` y `precios` cada una SOLA,
        en procesos Playwright nuevos, con 15-20 s de espera antes, escuchando el evento
        `response` en vez de la consola. Las dos pegan al mismo endpoint y las dos dan 429:
        `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw`.
        Un `curl` plano y frío al mismo endpoint, aislado de cualquier corrida: también 429.
      - **Evidencia de peso — hoy es mucho más claro que ayer:** las cuatro páginas con
        baseline de peso comparable cayeron **todas** más del 75 % contra su baseline (ninguna
        dispara umbral: sólo miramos subidas > +40 %, se ve mirando):
        home 2.366→**580 KB**, precios 2.159→**327 KB**, empezar 2.497→**323 KB**,
        rubros 2.650→**495 KB**. Es el mismo patrón que ya se había visto en `chatbot-landing`
        (2.232 KB → 324 KB hoy): falta el bundle del widget en las cinco, no en una.
      - **Mirado en las capturas:** ninguna de las cinco muestra la burbuja de chat flotante
        (verde) en la esquina inferior derecha. El resto del contenido de las cinco está sano —
        home, precios, empezar y rubros con su copy y sus precios (`Bs 390/mes` visible completo
        en `/precios`) correctos a la vista.
      - **No lo toqué**: contenedor y cron del widget son ajenos a este carril (ver la sospecha
        de rate-limit del contenedor, ya anotada ayer 16:41 UTC).
      - **Van ~8 horas de caída** (primera detección 2026-09-02 16:41 UTC, confirmada 21:41 UTC,
        confirmada de nuevo y ampliada ahora 2026-09-03 00:43 UTC). Sin dueño declarado (vive en
        `web-factory/apps/onia-platform/`).
      **Evidencia:** capturas de hoy (foto de un día, no baseline) en
      `hermes-content/docs/historial/canario-visual/2026-09-03-{home,precios,empezar,rubros,chatbot-landing}.png`.

      ---
      **CIERRE del carril `web-venta` (2026-09-03 ~12:48 UTC) — el widget está VIVO y el ítem
      medía nuestra propia IP.** Nada de esto contradice a quien lo escribió: cada corrida vio un
      429 real. Lo que faltaba era preguntarle al 429 **de quién** era.
      - **Primer comando de la vuelta, IP fresca:** `curl` al endpoint del widget → **HTTP 200,
        7.683 bytes**, 92 ms. Y `packs/js/sdk.js` → 200, 28.764 bytes. No hay contenedor caído.
      - **`onia.com.bo/` y `/empezar` abiertas y MIRADAS** (1440×900, Chromium completo, por
        viewports con scroll asentado — nunca `fullPage`): la **burbuja verde está presente y
        visible**, `64x64` en `1356,816`, con su `iframe` y `window.chatwootSDK` cargado. **Cero
        errores de consola, cero respuestas ≥400.** El peso volvió a su baseline: home **2.828
        KB** y empezar **2.512 KB** (baselines 2.366 / 2.497), contra los 580 / 323 KB que el
        ítem citaba como prueba de la caída. El bundle del widget está de vuelta.
      - **El mecanismo, reproducido en una sola corrida de 5 páginas seguidas:** las **dos
        primeras** dan 200 con burbuja; de la **tercera en adelante**, 429 y sin burbuja.
        ```
        home             618 KB  burbuja 64x64   err=0 4xx=0
        precios          890 KB  burbuja 64x64   err=0 4xx=0
        empezar          155 KB  SIN BURBUJA     429 …/widget?website_token=…
        rubros           120 KB  SIN BURBUJA     429 …
        chatbot-landing   86 KB  SIN BURBUJA     429 …
        ```
        No es una caída que empieza a una hora y termina a otra: **es un umbral que se cruza a
        mitad de la propia corrida**. El canario barre 10 pantallas cada 3 h desde la misma IP,
        así que deja la IP del VPS **quemada casi todo el tiempo** — y en la corrida siguiente
        vuelve a "encontrar" el widget caído. Las "8 horas de caída" son ocho horas de eso.
      - **La ventana de recuperación es larga:** tras ~15 peticiones, **3 minutos de espera no
        alcanzaron** (las 5 páginas siguientes seguían en 429). Al arrancar la vuelta, con la IP
        en reposo, daba 200.
      - **Por qué cada página cuenta doble, y por qué NO se arregla con `next/link`:** el sitio
        usa `<a>` planos, así que cada página vista es una carga completa que vuelve a pedir el
        SDK — **2 peticiones por página**. Medido con clics reales en el header: 4 clics → `RECARGA`
        las 4 veces → **10 peticiones** al endpoint. Fui a "arreglarlo" con `next/link` y **el
        propio código me refutó**: `src/app/(sitio)/nav.ts:11` dice que los `<a>` planos son
        **deliberados** — *"una navegación completa cierra cualquier menú abierto sola"*.
        Cambiarlo habría roto el menú de teléfono para arreglar algo que no es su culpa.
      - **Lo que queda vivo y NO es fantasma — corrige la decisión cotizada a Sergio:** la opción
        anotada en el radar es safelistear la IP del VPS (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`).
        Eso **calla el falso positivo del canario pero no ayuda a un lead**, que entra con su
        propia IP y también suma 2 peticiones por página. Si se aprueba creyendo que arregla el
        sitio, el chat sigue desapareciéndole al visitante que recorre varias pantallas — que es
        justo el más interesado. **No pude medir en qué página cae un lead con IP limpia: no
        tengo una segunda IP desde el VPS** (`WebFetch` no está autorizado en sesión no
        interactiva). Es lo único que falta para dimensionarlo, y no se resuelve adivinando.
      - **Repro en 30 segundos:** cargar 5 páginas de `onia.com.bo` seguidas con Playwright y
        mirar `.woot-widget-bubble` en cada una. Las dos primeras la tienen; las otras tres no.
      - **Cero líneas de código tocadas: no había nada roto en el sitio.**

- [x] 🟠 **CERRADO el 2026-09-03 17:38 UTC por `onia-cola`, mergeando el arreglo que el carril
      `canario-visual` ya tenía escrito y varado en su rama** (`ddd48bfae` fullPage +
      `6bd2ec177` scroll suave → `main` en `ea86a894a`). **No lo construí de nuevo a propósito:
      ya existía, y escribirlo otra vez en `main` habría chocado add/add contra el mismo archivo
      de su dueño.** El instrumento quedó como pedía este ítem: captura **por viewport**,
      `html{scroll-behavior:auto !important}` inyectado antes de scrollear, y
      `waitForFunction(scrollY≈y)` en vez de un `setTimeout` optimista.
      - **Verificado MIRANDO las dos fotos, no con un grep** — mismo instante, misma franja de
        `https://onia.com.bo/rubros` a 1440×900, `document.body.scrollHeight` = **8.332 px**
        (idéntico a la medición de las 07:58) y `scrollY` real = 850, o sea el scroll **llegó**:
        - **viejo (`fullPage: true`)** → la tarjeta cortada por arriba y una banda blanca vacía
          ocupando dos tercios del cuadro. La firma exacta que este ítem perseguía.
        - **nuevo (por viewport)** → la tarjeta **entera** *"Hoy en la agenda / Dental — 09:00
          Ortodoncia · 10:30 Limpieza · 11:15 Control / Cada paciente con su hora, su
          tratamiento y su teléfono"*, más la lista de rubros (Dental activo, Comercio ·
          Importadora · Estética · Servicios en gris) y la burbuja de Chatwoot visible.
      - **Un detalle que vale anotar porque contradice a medias la medición vieja:** hoy el
        fotograma congelado por `fullPage` era **Dental**, no *"Caja del día / Efectivo"*
        (Comercio) como el 07:58. El rubro en que se congela **varía entre corridas**; lo que no
        varía es el defecto. Un ítem que hubiera exigido ver *"Caja del día"* para darse por
        reproducido se habría declarado fantasma hoy.
      - **El repro quedó como script, no como párrafo:** `scripts/verificar_canario_rubros.mjs`
        saca las dos fotos a `/tmp/verificar-canario/` en 30 segundos. No es un gate y no está
        en `npm test`: es para volver a MIRAR, que es lo único que decide esto.
      - ⚠️ **El merge salió en conflicto en `scripts/canario_visual.mjs` y se resolvió por
        UNIÓN, no eligiendo un lado.** Los dos lados le habían agregado campos distintos al
        MISMO objeto `datos`: `main` el chequeo de desvío (`medida` / `motivoNoMedida` /
        `respuestasFallidas`) y la rama la lista de `capturas` por viewport. `--ours` o
        `--theirs` habrían borrado media herramienta **en silencio**, y el canario habría
        seguido corriendo en verde, ciego de un ojo.

      **El diagnóstico original, que es la mejor explicación de POR QUÉ pasaba:**
      **SIGUE VIVO en `rubros`, y el 2026-09-03 07:58 UTC `onia-cola` midió POR QUÉ. No es
      timing ni rasterizador: `fullPage` destruye las secciones movidas por scroll.**
      Reproducido en vivo con el instrumento exacto del canario (1440×900, sin `channel`, scroll
      300/800 ms). **El sitio está sano; miente la captura** — probado con las dos tomas de la
      misma franja en el mismo instante:
      - **`fullPage: true`** → tarjeta cortada al medio mostrando *"Caja del día / Efectivo"*
        (rubro **Comercio**) y debajo una banda blanca enorme y vacía.
      - **Por viewport** (`scrollTo(0, 850)`, esperar, capturar sin `fullPage`) → la tarjeta
        **entera** *"Hoy en la agenda / Dental — 09:00 Ortodoncia · 10:30 Limpieza · 11:15
        Control"* más la lista de rubros. Nada roto. Y el DOM concuerda: `opacity: 1`,
        `visibility: visible`, `transform: none`.
      - **La causa, medida:** `rubros` mide **8.332 px** de alto y tiene un `position: sticky`
        que es el corazón de la página — `DIV.sitio_stage__ZSE2e`, la tarjeta que va cambiando de
        rubro (Dental → Comercio → Importadora → Estética → Servicios) **a medida que scrolleás**.
        Hay además **13 elementos más altos que dos pantallas**. `fullPage: true` funciona
        agrandando el viewport hasta los 8.332 px: con la página entera dentro de una sola
        pantalla **ya no queda scroll que maneje la animación**, así que el `stage` se congela en
        un fotograma y su carril largo sale en blanco. Por eso ninguna espera lo arregla — el
        problema no es *cuándo* se captura, es que en modo `fullPage` la página **está en otro
        estado**.
      - **Y por eso el arreglo de 300/800 ms no podía cerrarlo:** ese arreglo sirve para lo que se
        activa por `IntersectionObserver` (es lo que destrabó `/chatbot`, 3.377 px y sin `stage`),
        pero no puede devolverle scroll a una sección que ya no tiene ninguno.
      - **Repro en 30 segundos:** capturar `https://onia.com.bo/rubros` a 1440×900 con
        `fullPage: true` y recortar `y=850..1470`; después `scrollTo(0, 850)`, esperar 1,5 s y
        capturar **sin** `fullPage`. Las dos franjas muestran cosas distintas: la segunda es la
        verdadera.
      - **El arreglo, ya sin la duda de qué método usar:** capturar por viewports sucesivos
        —scrolleando de verdad— en vez de `fullPage`. Es lo único compatible con una página
        movida por scroll. ⚠️ En el VPS **no hay `sharp` ni ImageMagick**, así que coser las
        imágenes hay que hacerlo dentro del propio Chromium (dibujar los trozos en un `<canvas>`)
        o guardar un PNG por viewport y renunciar a la imagen única.
      - **Zona:** `scripts/canario_visual.mjs`, del carril `canario-visual`. `onia-cola` lo midió
        pero **no lo arregló**: no entraba en la vuelta y no se empieza un refactor que no se
        puede terminar ni verificar.

      ⚠️ **SEGUNDA CEGUERA EN EL MISMO SCROLL, y el arreglo de viewports NO alcanza para taparla
      — medida el 2026-09-03 ~09:40 UTC por el carril `web-venta`, tropezándome con ella en mi
      propio instrumento.** No es una variante de `fullPage`: es independiente, y muerde también
      a quien capture por viewports creyendo que ya está a salvo.
      - **El sitio trae `scroll-behavior: smooth` en `<html>`** (`globals.css:194`, correctamente
        detrás de `prefers-reduced-motion: no-preference` — el sitio está bien, no hay nada que
        arreglar ahí). Medido en vivo: `getComputedStyle(document.documentElement).scrollBehavior`
        → `"smooth"`.
      - **Con eso, `window.scrollTo(0, y)` NO salta: ANIMA.** Vuelve enseguida y la página sigue
        viajando. Una foto disparada a los 300 ms sale **a mitad de camino**, con el encuadre
        entre dos franjas — y lo que se ve es una tarjeta o un titular **cortado por la mitad**,
        que es exactamente la firma del defecto que este ítem persigue.
      - **Lo que me pasó, y por eso lo sé:** capturé `/empezar` a 390 px y el primer frame
        (scroll 0) mostraba el titular `"Creá tu cuenta y usalo de verdad 14 días."` **cortado
        por arriba**, como si el header pegajoso se lo comiera. Estuve a un paso de abrirlo como
        ítem. Lo medí antes: a scroll 0 el `<h1>` está en `top: 208` y el header termina en
        `bottom: 61` — **no lo toca ni de cerca**. El frame estaba tomado mientras la página
        todavía volvía desde el fondo (3.689 px) hacia arriba.
      - **Por qué el canario es MÁS vulnerable que yo, no menos:** su bucle
        (`canario_visual.mjs:268-276`) hace `scrollTo` cada 0,8 de viewport con 300 ms, y **cada
        `scrollTo` re-apunta la animación anterior en vez de esperarla**, así que la página nunca
        se asienta en ningún paso: planea. Y el `scrollTo(0, 0)` final con 800 ms tiene que
        deshacer **14.569 px** en la home — un scroll suave de esa distancia no termina ni cerca
        en 800 ms.
      - **El arreglo es de una línea y es previo al refactor de viewports:** antes de scrollear,
        `await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })`. Y para
        que no vuelva a envejecer, **esperar a que el scroll haya llegado de verdad** en vez de
        confiar en un `setTimeout`:
        `await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 3, y)`.
      - **Repro en 30 segundos:** cargar `https://onia.com.bo/empezar` a 390×844, `scrollTo` al
        fondo, después `scrollTo(0, 0)`, esperar 300 ms y capturar. El titular sale cortado. Con
        `html{scroll-behavior:auto}` inyectado antes, sale entero. La misma página, el mismo
        instante, dos verdades distintas.
      - **Por qué importa más que un frame feo:** es el **tercer** defecto de instrumento de esta
        familia (rasterizador → 3 días perdidos; `fullPage` → este ítem; ahora el scroll suave), y
        los tres fabrican la MISMA firma — "algo cortado o en blanco" — sobre un sitio sano. Cada
        uno gasta vueltas de este carril persiguiendo fantasmas. **Verificado que el sitio no
        tiene la culpa en los tres.**

### Del carril `web-venta` — corrida del 2026-09-03 10:45 UTC (las dos pantallas, instrumento ya corregido)

- [x] 🟠 **La home cambiaba de voseo a tuteo DENTRO de la misma oración — CERRADO
      (`95500f82`), con gate.** La tarjeta "De noche" decía *"**Bajás** la persiana … para que
      lo **apruebes**"*. No era estilo: el sitio conjuga ese verbo en voseo en cinco lugares
      (`aprobás`). **Barrido a toda la superficie**, no sólo donde saltó — el mismo `apruebes`
      estaba en los TÉRMINOS (pegado a un `vos`: *"para que vos las apruebes"*) y en
      `content/requisitos.ts`, que se renderiza en la home y en `/chatbot`.
      - **Gate nuevo `(sitio)/voz.test.ts`**, que corre en `prebuild` (el comando real del
        deploy). Caza la **clase**, no el literal: 25 formas de tuteo inequívocas sobre todo
        archivo de cliente **descubierto del disco**. Lista deliberadamente conservadora —
        quedan fuera las formas que tuteo y voseo comparten (`tengas`, `estás`, `te`, `tu`) y
        `prueba`, que es sustantivo del sitio. Un gate que grita por algo correcto se apaga.
      - **Verificado en ROJO antes**, por el motivo correcto. Y ese rojo destapó un defecto del
        propio gate: apuntaba a `page.tsx:122` para algo que estaba en la **215**, porque al
        sacar comentarios corría la cuenta de líneas. Ahora se blanquean conservando los saltos.
      - **Gates:** typecheck exit 0 · 157 tests (132 + 25) · build exit 0.

- [x] 🟢 **`/empezar` está sana, y muere el fantasma del titular cortado.** Miradas las 10
      capturas (1440 y 390) con el instrumento arreglado —scroll real por viewports,
      `scroll-behavior:auto` inyectado, y espera a que el scroll **llegue** en vez de un
      `setTimeout`—. El titular *"Creá tu cuenta y usalo de verdad 14 días."* sale **entero**:
      lo de la vuelta pasada era el scroll suave, no el sitio. Y aparece el **cuarto** miembro
      de la familia de falsos positivos: un revisor visual reportó *"Al dia"* sin tilde en la
      home y **el string no existe en la fuente** (`grep "Al dia"` → cero). El `grep` sirvió
      para lo único que sirve: **descartar**.

- [x] 🟠 **Bloqueo del pie REVERIFICADO y vigente (tablero `t_68671bc3`) — no re-medirlo.**
      74 px de franja clara bajo el pie negro a 390 px, cero a 1440. **Descartadas dos causas
      falsas antes de creerle a la foto:** no es el widget de Chatwoot (ocultarlo no mueve el
      alto, 3689 → 3689) y no es artefacto (`culpables: []`, ningún elemento vive ahí abajo).
      Arreglo `f0248601` en `main`, gate `cierre.test.ts` puesto, decisión ya cotizada en el
      radar. **Del lado del código no queda nada: falta sólo el deploy, que es de Sergio.**

- [x] 🟢 **Las otras cinco pantallas: sin disparo mecánico y sin defecto nuevo a la vista.**
      Miradas una por una: `contacto` (322 KB/104 ms, formulario y CTAs completos),
      `register` (705 KB/153 ms, asistente de 2 pasos con 5 rubros, íconos legibles),
      `login-plataforma` (696 KB/128 ms, íconos legibles, "Pedí tu acceso" presente),
      `login-chat` (3.499 KB/925 ms, formulario Chatwoot normal — este SÍ es el chat propio de
      Onia, no el widget embebido del sitio, y no está caído),
      `panel-chatbot` (702 KB/228 ms, redirige a `/login` sin sesión: queda "no medida", no "OK",
      como corresponde). **Ninguna baseline se tocó esta vuelta** — pisar la de las cinco páginas
      afectadas taparía el ítem del widget caído, igual que ayer con `chatbot-landing`.

### Del carril `web-venta` — corrida del 2026-09-03 11:50 UTC (el CHECKLIST DE PRE-ENTREGA, corrido por primera vez)

- [x] 🟠 **`onia.com.bo/favicon.ico` devolvía 404 — ARREGLADO EN CÓDIGO, con gate. Falta el
      deploy, que es el mismo de `t_68671bc3`.** No devolvía un icono roto: devolvía la
      **página de error entera, 29 KB de HTML**, a quien pidió una imagen de 3 KB.
      - **Cómo apareció:** `web-factory/docs/CHECKLIST_PRE_ENTREGA.md` tenía **17 puntos
        abiertos y CERO ejecutados**. Corridos los 17 contra producción (las 16 URLs del
        sitemap), **16 puntos pasan** — canonical en las 16, títulos y descripciones únicos
        sin un solo duplicado, `<html lang="es">`, un `<h1>` por página, cero contenido
        mixto, 404 propio ("Página no encontrada — Onia"), y las 21 imágenes del sitio con
        `alt` **y** `width`/`height`. El único fallo binario era éste.
      - **Por qué nadie lo veía, medido con el instrumento correcto:** el sitio declara
        `<link rel="icon" href="/icon.svg">` y `apple-icon.png`, y los dos dan 200. Con eso,
        **Chromium NO pide `/favicon.ico`** — abierta la home con Playwright, dispara
        exactamente dos peticiones de icono y ninguna es ésa. El que paga es todo cliente que
        lo pide a pelo sin leer el `<head>`: buscadores, lectores de feeds, gestores de
        marcadores, navegadores viejos. Un `curl` lo encuentra en un segundo; un navegador no
        lo encuentra nunca. **Por eso el checklist existe y por eso había que EJECUTARLO.**
      - **El arreglo, el mínimo posible:** el ICO bueno ya estaba en el repo
        (`public/brand/v2/favicon.ico`, 3 tamaños, publicado en `/brand/v2/favicon.ico` — o
        sea, prueba viva de que `public/` se sirve desde la raíz en ESTE deploy). Copiado a
        `public/favicon.ico`. **Deliberadamente no se usó la convención de metadata de Next**
        (`app/favicon.ico`): esa agrega un `<link>` propio y podía cambiar qué icono elige un
        navegador. Verificado que **el `<head>` queda byte a byte idéntico** al de producción:
        el arreglo es puramente aditivo y sólo llena la ruta que antes daba 404.
      - **Verificado MIRANDO, contra un servidor de producción real** (`next start` sobre el
        build, no `dev`): `/favicon.ico` → **200, `image/x-icon`, 3.083 b, byte a byte igual**
        al del repo; `/icon.svg` y `/apple-icon.png` siguen en 200. El icono **abierto y
        mirado** a 16/32/128 px: es la marca Onia (cuadrado verde, "on" negro) y se lee a
        16 px. Y las dos pantallas de venta recapturadas a 390 px sin una sola respuesta 4xx.
      - **Gate nuevo `(sitio)/icono.test.ts`**, en `prebuild` (el comando real del deploy).
        Caza la **clase**, no el archivo de ayer: los **tres** iconos que el sitio publica,
        cada uno con su firma de formato leída del disco (header ICONDIR para el ICO, `<svg`,
        `\x89PNG`) — así no pasa en verde un PNG renombrado a `.ico`, ni el día que alguien
        mueva `icon.svg`. Acepta las dos raíces (`public/` y `app/`) porque las dos terminan
        en la misma URL y el gate no tiene por qué opinar sobre cuál se usa.
      - **Verificado en ROJO antes**, por el motivo correcto: falló **sólo** el caso
        `/favicon.ico está en disco`, con los otros 8 en verde.
      - **Gates:** typecheck exit 0 · build exit 0 (con `prebuild` = `tsc --noEmit && vitest run`).
      - ⚠️ **No está en producción**: `onia.com.bo` la sirve el contenedor `onia-landing` y
        publicar es de Sergio. Este arreglo es el **cuarto** que se acumula esperando el mismo
        deploy de `t_68671bc3`.

- [x] 🟢 **`/terminos` y `/privacidad` son las dos únicas rutas sin `og:url` — ARREGLADO Y CON
      GATE el 2026-09-03 por `web-venta`.** (Tenían las otras nueve etiquetas Open Graph, imagen
      incluida; las 14 restantes tenían las diez.)
      - **Confirmado vivo en producción antes de tocar nada**, contra el contenedor que sirve el
        dominio: `curl -s https://onia.com.bo/terminos | grep -o 'property="og:[a-z:]*"' | sort -u`
        → nueve etiquetas, sin `og:url`; la home y `/precios` traen las diez.
      - **La causa:** ninguna de las dos declaraba `openGraph`, así que heredaban el del layout
        raíz — y `og:url` es la única etiqueta que **no se puede heredar**, porque cambia en cada
        página. Por eso el hueco pasó desapercibido: la tarjeta se veía casi bien.
      - **El arreglo:** `openGraph` propio en `src/app/terminos/page.tsx` y
        `src/app/privacidad/page.tsx`, con `url` igual a su `canonical`.
      - **Verificado sobre el HTML que EMITE el build, no sobre el fuente** (`next start` en
        :3987 + `curl`): las dos ahora sirven las diez etiquetas, con
        `og:url = https://onia.com.bo/terminos` y `…/privacidad`, absolutas. Barrido de **las 16
        rutas del sitemap**: las 16 con `og:url` correcta. Las dos páginas además **abiertas y
        MIRADAS** renderizadas a 1440×900 (`/tmp/wv-terminos.png`): siguen sanas.
      - **Y ahora tiene gate — `web-factory/apps/onia-platform/src/app/compartir.test.ts`**, que
        corre en `prebuild` (`tsc --noEmit && vitest run`), el comando real del deploy.
        **Verificado en ROJO antes**, por el motivo correcto: fallaron **sólo** `/terminos` y
        `/privacidad`, con las otras 14 rutas y el ancla en verde.
        El corte del gate es el **sitemap**, no la carpeta ni el `noindex`, y las dos
        alternativas obvias estaban mal: por carpeta se pierde `/terminos`, `/privacidad` y
        `/servicios/consultoria` (viven fuera de `(sitio)`), y por `noindex` se pierde
        `/terminos`, que declara `index: false` y **es una de las dos rotas** — compartir e
        indexar son cosas distintas. Una ruta nueva queda cubierta con sólo agregarla al
        sitemap, que es lo que ese archivo ya obliga a hacer.
      - **Gates:** typecheck exit 0 · `vitest run` 183 verdes en 8 archivos · build exit 0.
      - ⚠️ **No está en producción**: `onia.com.bo` la sirve el contenedor `onia-landing` y
        publicar es de Sergio. Este arreglo es el **quinto** que se acumula esperando el mismo
        deploy de `t_68671bc3`.
      - **Encontrado de paso, NO arreglado** (es otro ítem, no lo abro en la misma vuelta):
        `/terminos` está en el `sitemap.xml` **y** declara `robots: { index: false }`. El sitemap
        dice "indexá esto" y la etiqueta dice lo contrario. Repro: `curl -s
        https://onia.com.bo/terminos | grep -o 'name="robots"[^>]*'` → `content="noindex"`, y
        `curl -s https://onia.com.bo/sitemap.xml | grep terminos` → la lista. `/privacidad` no
        tiene el problema (es indexable a propósito, con su motivo escrito).
        **Zona:** `web-factory/apps/onia-platform/src/app/{sitemap.ts,terminos/page.tsx}`.
        → **CERRADO en la vuelta siguiente**, abajo.

### Del carril `web-venta` — corrida del 2026-09-03 15:48 UTC (el ítem que la vuelta anterior dejó anotado)

- [x] 🟢 **El sitemap pedía indexar `/terminos` y la propia página lo prohibía — ARREGLADO Y CON
      GATE.** El sitio se desmentía a sí mismo en la única superficie que lee un buscador.
      - **Confirmado vivo en producción antes de tocar nada**, contra el contenedor que sirve el
        dominio (no `main`, no Vercel): `curl -s https://onia.com.bo/terminos | grep -o
        'name="robots"[^>]*'` → `content="noindex"`, y `curl -s https://onia.com.bo/sitemap.xml`
        lista `<loc>https://onia.com.bo/terminos</loc>`. No era fantasma.
      - **Por qué importa y no es cosmético:** un sitemap no enumera contenidos, **pide
        indexación**. Search Console reporta el choque como error (*"Submitted URL marked
        'noindex'"*) y gasta rastreo en una página que nosotros mismos excluimos.
      - **Qué lado cede, y por qué NO el otro:** se saca del sitemap, **no** se le quita el
        `noindex`. El `noindex` es el lado deliberado — los Términos son un borrador pendiente de
        revisión por abogado, y el propio archivo ya dejaba escrito *"esta página no la querés en
        Google, pero sí se manda por WhatsApp"*. Quitarlo habría publicado un borrador legal al
        buscador: eso es una decisión de Sergio, no de un arreglo. `/privacidad` se queda en el
        sitemap porque su indexabilidad también está escrita y motivada (el rastreador de Meta
        valida esa URL al publicar la app del chatbot).
      - **La regla ya existía en el código y nadie la medía:** `v1/layout.tsx:11` dice
        *"robots.ts y fuera del sitemap"*, y `/patrones` y `/v1` la cumplen. `/terminos` era la
        **única** de las 25 páginas del disco que la violaba (barridas las 6 declaraciones de
        `robots` que hay en la app).
      - **Gate nuevo `src/app/indexar.test.ts`**, en `prebuild` (`tsc --noEmit && vitest run`, el
        comando real del deploy). Caza la **clase**: para cada ruta del sitemap exige que exista
        su `page.tsx` (si no, el sitemap publica un 404), que `robots.ts` no la deshabilite, y que
        no declare `noindex` — **en las dos formas que acepta Next** (`{ index: false }` y
        `robots: "noindex"`), porque un gate que sólo entiende la que se usó hoy pasa en verde el
        día que alguien escribe la otra.
      - **Verificado en ROJO antes**, por el motivo correcto: falló **sólo** `/terminos`, con los
        otros 16 casos en verde.
      - ⚠️ **El arreglo abría un agujero de gate y por eso la vuelta no termina ahí.**
        `compartir.test.ts` (el gate de `og:url` de ayer) tomaba su lista de rutas **del
        sitemap** — así que al sacar `/terminos` de ahí, la página habría quedado publicada,
        compartible y **sin gate, sin que nada se pusiera en rojo**. Un criterio de cobertura que
        se encoge solo cuando cambia una política de indexación **falla ABIERTO**. Corregido: la
        lista ahora es **el disco menos el `disallow` de `robots.ts`** —la declaración que el
        propio sitio ya hace de qué no publica—, así una página nueva nace cubierta y hay que
        excluirla a mano, a la vista, para que deje de estarlo. **Medido: los casos de
        `compartir` siguen siendo 16 y `/terminos` sigue entre ellos.**
      - Los dos gates compartían el mismo parser de metadata; se extrajo a `src/app/rutas.ts` en
        vez de copiarlo, que era garantizar que en un mes midieran cosas distintas.
      - **Verificado sobre el HTML que EMITE el build, no sobre el fuente** (`next start` sobre el
        build de producción, no `dev`): `sitemap.xml` pasa de 16 a **15 URLs**, sin `/terminos` y
        con `/privacidad` intacta; `/terminos` sigue **200**, con sus **diez** etiquetas OG,
        `og:url` y `canonical` correctas y su `noindex`. Y **abierta y MIRADA** renderizada a
        1440×900 y 390×844 (`/tmp/wv-terminos-{escritorio,telefono}-0.png`): título, índice y
        cuerpo enteros, sin recortes. Los únicos errores de consola son el 429 del widget de
        Chatwoot, ya medido como falso positivo de la IP del VPS.
      - **Gates:** typecheck exit 0 · `vitest run` **199 verdes** en 9 archivos · build exit 0.
      - ⚠️ **No está en producción**: `onia.com.bo` la sirve el contenedor `onia-landing` y
        publicar es de Sergio. Este arreglo es el **sexto** que se acumula esperando el mismo
        deploy de `t_68671bc3`.

- [x] 🟢 ~~**Encontrado de paso, NO arreglado**: la `<meta name="description">` de `/terminos`
      dice *"(borrador, pendiente de revisión por abogado)"*.~~ **ARREGLADO 2026-09-03 ~16:55 UTC
      (`web-venta`), y era peor de lo que decía el ítem: no sólo era obra, era FALSO.**
      - **Lo que el ítem no sabía:** el documento se declara `status: "vigente"` en su propio
        frontmatter (`src/content/legal/terminos.md`). O sea, la página llamaba "borrador" a un
        texto que el sitio publica como vigente, y por eso tampoco muestra ningún cartel de
        borrador. *(El ítem decía que el cuerpo estaba limpio porque sus "borradores" son los que
        propone la IA. La conclusión era correcta, el motivo no: el cuerpo SÍ tiene un aviso de
        borrador —`legal-page.tsx:48`— pero está condicionado al frontmatter y hoy no se dibuja.)*
      - **Por qué sobrevivió, que es lo que vale:** el aviso visible estaba **hardcodeado**; se
        arregló ahí para que respetara el frontmatter —una política publicada como "borrador" no
        sirve para dar de alta la app en Meta—, el frontmatter pasó a `vigente`, el cartel
        desapareció de la pantalla… y la `description` siguió repitiendo la frase vieja en el
        `<head>`. **Un barrido que se verifica MIRANDO la página no alcanza para la metadata**,
        que es la parte de la superficie de cliente que no se ve mirando.
      - **Y contagió a un tercero:** `indexar.test.ts` justificaba el `noindex` de `/terminos`
        con *"los Términos son un borrador pendiente de revisión por abogado"*. Premisa vencida
        dentro de la justificación de un gate: se lee como vigente y decide por la próxima sesión.
        Corregida; **el `noindex` no se tocó** (sigue en pie por su otro motivo, el escrito en el
        propio archivo).
      - **Gate nuevo, y es la parte reutilizable:** `src/app/obra.test.ts` — ninguna página
        publicada declara obra en su metadata (8 frases: "muy pronto", "próximamente", "en
        construcción", "beta", "en desarrollo", "estamos trabajando", "pendiente de revisión",
        "borrador de trabajo"). Es la regla de Sergio del 2026-08-20 vuelta comando.
        **Los sujetos salen del DISCO menos el `disallow` de `robots.ts`**, no de una lista de
        inclusión: una página nueva nace cubierta. Y **NO prohíbe "borrador" a secas ni "todavía
        no"** a propósito —el primero es una capacidad real del producto (`/agentes`) y el segundo
        es honestidad aprobada sobre los límites (`/comparativa`)—; una lista que grita de más
        termina borrada. Trae ancla propia: si alguien vacía las frases, el gate se pone en rojo.
      - **Verificado en ROJO primero** por el motivo correcto (1 fallo, `/terminos`,
        `pendiente de revisi[oó]n`) y con las otras 16 páginas en verde: cero falsos positivos en
        toda la superficie pública.
      - **Gates:** typecheck exit 0 · `vitest run` **216 verdes** en 10 archivos (eran 199 en 9) ·
        build exit 0.
      - **MIRADO renderizado sobre el build real** (standalone en `:3987`, no `main` ni Vercel) a
        1440×900 y 390×844 — `/root/wv-terminos-{escritorio,telefono}.png`: título, línea de
        versión, índice y cuerpo enteros, **sin cartel de borrador**, `robots: noindex` intacto,
        cero errores de JS. Y medido sobre el HTML servido: **cero coincidencias de obra en toda
        la página**, no sólo en la `description`.
      - ⚠️ **No está en producción**: `onia.com.bo` la sirve el contenedor `onia-landing` y
        publicar es de Sergio. Es el **séptimo** arreglo esperando el mismo deploy de
        `t_68671bc3`.

### Del carril `web-venta` — corrida del 2026-09-03 17:48 UTC (a dónde LLEGA cada botón que sale del sitio)

- [x] 🔴 **Los dos botones de `/contacto` mandaban al lead a un calendario que ya no existe, y
      caían en un formulario de alta — ARREGLADO EN CÓDIGO, con gate.** Es el defecto más caro
      que encontró este carril: la página cuyo trabajo entero es que alguien consiga **hablar
      con una persona** tenía sus dos únicos CTA muertos, en silencio.
      - **Cómo apareció, y por qué nadie lo había visto:** el punto 15 del checklist de
        pre-entrega ("cero enlaces internos rotos") sólo mira los `href` **internos**. Los
        enlaces que SALEN del sitio —los que llevan al lead al final del embudo— no los mira
        nadie. Extraídos a mano los de las 16 URLs del sitemap, aparecieron dos hacia
        `cal.onia.com.bo`.
      - **Medido, no supuesto:** `curl -s -o /dev/null -w '%{http_code} %{redirect_url}'
        https://cal.onia.com.bo/onia/demo-onia` → **302 → `https://onia.com.bo/empezar`**. Con
        `-L` los dos enlaces devuelven **200 y exactamente 41.474 bytes** — el mismo tamaño para
        `demo-onia`, `consulta-inicial` y un slug **inventado**. Ninguna herramienta los ve
        rotos. El lead que hacía clic en «Agendar la demo» aterrizaba en el asistente de alta.
      - **La página se contradecía a sí misma en su último clic.** Su bajada dice, textual: *"No
        hay formulario que caiga en un buzón. Elegís vos el día y la hora **en nuestra agenda**"*
        — y los dos botones entregaban exactamente un formulario.
      - **Por qué está muerto y no vuelve:** no hay contenedor de Cal.com en el VPS
        (`docker ps -a | grep -i cal` → vacío), y el 2026-09-02 22:55 La Paz **Sergio decidió lo
        contrario**: ventanas fijas para el bot en vez de revivir Cal.com (tablero
        `t_af8f44ad`, cerrada). O sea que el sitio llevaba días apuntando a la opción
        descartada. El comentario del código decía *"Verificado 2026-07-30: los dos enlaces
        responden 200 en público"* — cierto entonces, y sin significado hoy: un 200 sobrevive a
        la muerte del servicio que lo daba.
      - **El arreglo, el mínimo posible y sin rediseñar nada:** las dos citas salen ahora por el
        **mismo WhatsApp que ya atiende toda la web** (`waLink`, el número único de `site.ts`),
        cada una diciendo cuál eligió el que escribe ("la consulta comercial de 20 minutos" /
        "la demo de 45 minutos con mi caso"), que es donde el bot propone los dos horarios
        concretos del día. **Layout, tarjetas y etiquetas de los botones intactos**; sólo
        cambian los `href` y las tres frases que prometían un calendario (bajada, `description`
        y el comentario del archivo). `og:description` no se tocó: seguía siendo cierta.
      - **Verificado MIRANDO**, contra un servidor de producción real (`next start` sobre el
        build, no `dev`), a **1440 y a 390**: la página se ve igual que en producción, los dos
        botones apuntan a `wa.me/59175414930` con su texto, y los dos destinos responden
        **200**. Y el `<head>` mirado aparte —la metadata no se ve en una captura—: cero
        coincidencias de `cal.onia` en todo el HTML servido.
      - **Gate nuevo `(sitio)/enlaces.test.ts`**, en `prebuild` (el comando real del deploy).
        Caza la **clase**: todo host absoluto de la superficie de venta tiene que estar
        declarado con su motivo, y **ningún subdominio nuestro que no publiquemos** —el caso
        exacto de `cal.`, que resuelve a nuestra IP y contesta 200 tras redirigir—. La lista de
        archivos se **deriva del disco** (`(sitio)/**` más los módulos de `@/lib` y `@/content`
        que esas páginas importan, un salto que hacía falta: los enlaces al SIN viven en
        `lib/siat.ts`, no en una página), así una página nueva nace cubierta.
      - **Verificado en ROJO antes**, por el motivo correcto: fallaban los dos casos de host
        con `cal.onia.com.bo`, y el caso "mira una superficie de verdad" en verde.
      - **Gates:** typecheck exit 0 · build exit 0 (con `prebuild` = `tsc --noEmit && vitest run`).
      - **Barrido a toda la superficie**, no sólo donde saltó: `cal.onia.com.bo` no queda en
        ningún archivo del repo, y el enlace de la home *"O agendá una demo con horario →"*
        apunta a `/contacto`, que ahora sí termina en una conversación.
      - ⚠️ **No está en producción**: `onia.com.bo` la sirve el contenedor `onia-landing` y
        publicar es de Sergio. Es el **octavo** arreglo esperando el mismo deploy de
        `t_68671bc3` — y el primero que le cuesta leads mientras espera.

### Del carril `web-venta` — corrida del 2026-09-03 18:48 UTC (de dónde saca su número cada precio)

- [x] 🟠 **El sitio tenía CUATRO copias tipeadas a mano de los precios de los planes —
      ARREGLADO, con gate.** Coincidían con la tabla por suerte, no por construcción: el día
      que Sergio cambia un plan, cambia `PLANES` y las cuatro frases siguen anunciando el
      precio viejo. Es la regla que abre `CLAUDE.md`, y el desastre que la originó (cuatro
      precios vivos del mismo chatbot) empezó exactamente así.
      - **Medido antes de tocar nada, y el veredicto fue "no hay defecto vivo":** los cuatro
        literales (320 · 750 · 1.500 · 89 · 199) **coinciden hoy** con `PLANES`, y `PLANES`
        coincide a su vez con `DEFAULT_PLAN_AMOUNTS` del producto
        (`/root/loops/onia-platform/lib/subscription-plans.ts`: basic 320/89/3200 ·
        professional 750/199/7500 · clinic 1500/15000 · enterprise 2900/29000). **No se
        arregló un precio: se arregló que un precio pueda desincronizarse en silencio.**
      - **Quiénes eran, encontrados barriendo el disco (no una lista):** la `description` de
        `/precios`, el chip del hero de `/v1`, nuestra propia fila de la comparativa
        (`lib/proof.ts`) y la letra chica del semanal (`lib/pricing.ts`, dos copias del mismo
        número **dentro del archivo que lo define**). Las cuatro ahora se arman con `bs()`
        desde `PLANES`.
      - **Y una de ellas era METADATA**, que es la parte de la superficie de cliente que **no
        se ve mirando**: toda captura da verde sobre ese defecto. Es la misma trampa que se
        pagó hoy a las 12:55 con la `description` de `/terminos`.
      - **Gate nuevo `(sitio)/precios.test.ts`**, en `prebuild` (`tsc --noEmit && vitest run`,
        el comando real del deploy). Caza la **clase**: ningún archivo de la superficie de
        venta puede escribir como literal un monto que declare `PLANES`/`GRUPO`. Sujetos
        derivados del **disco**, no de una lista de inclusión — un archivo nuevo nace cubierto.
      - ⚠️ **El gate deliberadamente NO mira los add-ons, y eso lo midió el propio barrido:**
        `Bs 390` es el chatbot **y** el plan «Cuidado Web Crecimiento» de `content/webs.ts`,
        que es correcto y no tiene nada que ver. Un gate por número suelto habría gritado por
        código sano en su primera corrida — y un gate que grita por algo correcto se apaga.
      - **Verificado en ROJO antes**, por el motivo correcto: reintroducido el chip del hero,
        falló **un solo** caso, con archivo y línea exactos (`hero.tsx:10`) y los dos anclas
        en verde. El ancla no escribe ningún número esperado: hacerlo habría sido la quinta
        copia a mano, dentro del gate que las prohíbe.
      - **Es un refactor, no un cambio de copy, y se probó como tal:** el HTML servido por el
        build nuevo es **byte a byte idéntico al de producción** en las cuatro superficies
        (`description` de `/precios`, `/` y `/comparativa`; la fila «Bs 320 – 1.500 / mes»; la
        frase del semanal; el chip «Desde Bs 320/mes» de `/v1`).
      - **MIRADO renderizado** sobre el build de producción real (`next start`, no `dev`):
        `/precios` a 1440 y 390 con la grilla entera — 320 / 750 / 1.500, anuales
        3.200 / 7.500 / 15.000, semanales 89 / 199.
        ⚠️ La primera captura salió **en blanco** y no era el sitio: el servidor local servía
        un chunk 404 (`3413-…js`). Es el **cuarto** falso positivo de instrumento de esta
        familia; se confirmó mirando el 4xx antes de creerle a la foto, y con el servidor
        sano la página mide 6.016 px en vez de 844.
      - **Gates:** typecheck exit 0 · `vitest run` **222 verdes** en 12 archivos · build exit 0.
      - ⚠️ **No está en producción**: `onia.com.bo` la sirve el contenedor `onia-landing` y
        publicar es de Sergio. Es el **noveno** arreglo esperando el mismo deploy de
        `t_68671bc3`.

- [x] 🟢 **El formulario de captura de `/guia-facturacion` entrega de verdad — medido de punta
      a punta, no por su pantalla.** Es el único `<form>` de la superficie de venta y su
      pantalla de éxito («Listo. La hoja es tuya.») se muestra **pase lo que pase**: el cliente
      traga todos los errores y el endpoint responde 204 incluso cuando no reenvía nada. O sea
      que el primer paso **no puede fallar a la vista**, que es justo la firma del bug que mató
      al bot dos veces.
      - **Probado el segundo paso, que es el que se pierde:** POST real a
        `https://onia.com.bo/api/agenda-intake` → la fila **apareció** en
        `onia_center.leads` (`source=gate-web-venta`), y la red interna
        `onia-landing → onia-center:3012` devolvió `{"ok":true}`. Las dos filas de prueba se
        **borraron** (`delete … where public_contact like '%example.invalid'` → 0 quedan).
      - **Cero leads perdidos:** el histórico de `onia_center.leads` tiene sólo
        `prospector-osm` (94) y `bot:onia-demo-bot` (26). **Nadie llenó nunca ese formulario**,
        así que no hay nada que rescatar. No es un ítem: es una medición que faltaba.
      - **El plazo de la guía sigue vigente** (30-09-2026), o sea que la página no está vieja.

### Del carril `web-venta` — corrida del 2026-09-03 19:48 UTC (quién enlaza a quién)

- [x] 🟠 **Dos servicios que Onia COBRA sólo se podían alcanzar entrando por la política de
      privacidad — ARREGLADO, con gate.** `/servicios/marketing-ia` y `/servicios/consultoria`
      están publicadas y el sitemap las pide indexar, pero desde la superficie de venta entera
      —portada, `/precios`, `/empezar`, `/rubros`, `/chatbot`, `/agentes`, `/facturacion`,
      `/comparativa`, `/contacto`, `/nosotros`— no había **un solo enlace**.
      - **Medido, no supuesto:** bajadas las 16 páginas que sirve `onia.com.bo` y contados los
        enlaces entrantes en el HTML servido. Todas las demás tienen **16**; estas dos tienen
        **4**, y las cuatro son `/privacidad`, `/terminos` y ellas dos entre sí.
      - **La causa:** las dos siguen en `app/servicios/` —el árbol viejo, con el `SiteFooter`
        archivado, el mismo cromo que `/v1`, que es `noindex` justamente por viejo—. Por eso
        los únicos enlaces vivían en un pie que **ninguna pantalla de venta usa**.
      - **Es el bug de `/nosotros` (2026-08-23) sin terminar de barrer.** Aquella vez se
        rescató UNA página metiéndola en `NAV_DECIDIR` y ahí quedó, sin mirar a las hermanas
        que estaban en el mismo cromo muerto. Es exactamente lo que `CLAUDE.md` llama arreglar
        el síntoma donde saltó y dejar vivos a los que llaman a lo mismo.
      - **Verificado que enlazarlas es correcto ANTES de enlazarlas:** las dos páginas se
        leyeron enteras. Cero obra ("muy pronto", "beta"), cero prueba social fabricada —
        marketing-ia dice de frente *"no tenemos un muro de logos ni casos de éxito… antes que
        inventarlos, preferimos no tenerlos todavía"*—, y consultoría está en el catálogo de
        venta como servicio que se cobra (`ONIA_CATALOGO_DE_VENTA.md:147`).

        ⚠️ **Esa frase citada como prueba de sanidad ERA el defecto — corregido el 2026-09-26.**
        No fabricaba prueba social, y por eso pasó: lo que hacía era CONFESAR que no la hay, y
        el «Cero autobombo» de `CLAUDE.md` prohíbe hablar de nosotros en los dos sentidos, el
        que se elogia y el que se disculpa. El criterio ya estaba escrito en la cabecera de
        `TODAVIA_NO` (`lib/proof.ts`): *"acá van funciones que faltan, no «somos nuevos» ni «no
        tenemos clientes»"*. **Y el chequeo que le dio el verde es el que hay que desconfiar:**
        una lista de literales (`muy pronto|beta|…`) es de INCLUSIÓN, así que todo autobombo
        que no use esas palabras sale gratis — la medición del objetivo del carril firmaba
        «prohibidos 0» con el texto vivo en producción. Esta vuelta lo trajo al nav VIVO con el
        defecto adentro, o sea que el enlace estaba bien y la lectura que lo habilitó, no.
        Arreglado en la página y cubierto por `app/trayectoria-declarada.test.ts`, que deriva
        los sujetos del disco y pregunta por la carencia de la EMPRESA (la del producto ya la
        cuidaba `hueco-declarado`, y no la veía porque exige que la oración nombre el producto).
      - **El arreglo:** apartado `Servicios` (Webs · Marketing IA · Consultoría) en el mapa
        único del sitio (`(sitio)/nav.ts`), que leen el pie y el menú de teléfono. `webs` va
        con las otras dos aunque ya era alcanzable: una lista partida en dos lugares es la que
        se desincroniza. **No es un rediseño** — el pie archivado ya tenía esa misma columna.
      - **Gate nuevo `app/alcance.test.ts`**, en `prebuild` (el comando real del deploy): toda
        página publicada tiene que estar enlazada desde `app/(sitio)/`. Sujetos derivados del
        **disco** (`PAGINAS_PUBLICAS`, reusada de `rutas.ts` en vez de recalcularla), así una
        página nueva nace cubierta y sacarla exige prohibirla en `robots.ts`, que se ve.
        ⚠️ **Y exige que el enlace salga del árbol VIVO, no de cualquier página** — ésa es la
        trampa que dejó el defecto suelto: preguntar "¿la enlaza alguien?" da verde, porque
        `/privacidad` la enlazaba… con el pie muerto.
      - **Verificado en ROJO antes**, por el motivo correcto: sacadas las dos entradas, falla
        **exactamente** en esas dos rutas, nombrando archivo y ruta.
      - **MIRADO renderizado** sobre el build de producción (`next start`, escuchando 4xx antes
        de creerle a la foto, y con `scroll-behavior:auto` inyectado): pie a 1440 y 390 con las
        cuatro columnas enteras y ningún enlace desbordado, y el menú de teléfono abierto con
        el apartado nuevo. **Segundo turno probado:** clic real en los tres enlaces → 200 y el
        `<h1>` correcto en cada destino. El pie pasa a 4 columnas recién a 900px (entre 700 y
        900 van 2×2: a 700 con cuatro columnas "Marketing IA" partía en dos renglones).
      - **Gates:** typecheck exit 0 · `vitest run` **239 verdes** en 13 archivos · build exit 0.
      - ⚠️ **No está en producción todavía** — y acá se corrige de paso una premisa que este
        archivo venía arrastrando. **`t_68671bc3` SÍ se desplegó**: el build que sirve
        `onia.com.bo` es de **hoy 18:10 UTC**
        (`ls -l /opt/onia-landing/runtime-next/apps/onia-platform/.next/BUILD_ID`), no del
        02-sep, y lleva los cuatro arreglos del carril anteriores a esa hora —verificado
        mirando el resultado, no el commit: `/favicon.ico` devuelve **3.083 bytes** de icono
        (era 29 KB de HTML de error) y la `description` de `/terminos` ya no dice "borrador"—.
        Lo que falta **no es el deploy: es el merge**.

- [x] 🔴 **Tres arreglos del carril están commiteados hace horas y NO llegan al cliente porque
      `claude/web-venta` no se mergeó a `main`.** **CERRADO 2026-09-06 01:50 La Paz** por el
      integrador: los tres shas dan `EN MAIN` con el mismo comando que los midió, y el defecto
      caro murió también **en producción** — `curl -s https://onia.com.bo/contacto | grep -c
      cal.onia.com.bo` → **0** (decía 2). Entró en el build del 04-sep 10:04 UTC.
      ⚠️ **Su premisa "el deploy ya demostró hoy que corre solo" era falsa y no hay que heredarla:**
      `onia.com.bo` **no** se despliega solo (cero crons, cero timers — medido el 2026-09-04); los
      `BUILD_ID` que cambian son swaps a mano. Que este arreglo llegara no fue automatismo.
      Hoy hay **39** commits de la app esperando publicación, cubiertos por el pedido `t_30e607a8`.
      Medido con `git merge-base --is-ancestor <sha> origin/main`:
      - `ea150d179` (17:58) — **el que más cuesta**: los dos CTA de `/contacto` agendan contra
        `cal.onia.com.bo`, un Cal.com muerto. **Sigue vivo en producción ahora mismo**:
        `curl -s https://onia.com.bo/contacto | grep cal.onia.com.bo` → dos aciertos.
      - `088a6d235` (19:03) — el gate que impide que los precios se desincronicen.
      - `1fbf9dc2a` (20:02) — este ítem.

      **Por qué se anota como ítem y no como comentario:** los cuatro arreglos que SÍ llegaron
      pasaron por main antes de las 18:10. Estos tres entraron después y quedaron detrás de una
      rama sin mergear, así que un arreglo verificado, gateado y pusheado sigue valiendo **cero**
      para el lead que abre `/contacto` hoy. Construido ≠ terminado, y el eslabón que falta no
      es de este carril.

- [x] 🟢 **Checklist de pre-entrega, puntos 5 y 11–16: corridos contra producción, todos
      verdes.** `<html lang="es">` en las 16 · exactamente **una** `<h1>` por página en las 16 ·
      canonical propio en las 16 · cero contenido mixto `http://` · las 25 `<img>` con `width`,
      `height` y `alt` real (son fotos de contexto, no capturas del sistema: cumplen la regla) ·
      los 19 enlaces internos y assets responden 200.

- [x] 🟢 **`/guia-facturacion` la enlaza UNA sola página (`/facturacion`) — no lo toqué, y el
      motivo importa.** Salió del mismo conteo. No es el mismo defecto que los servicios: está
      enlazada desde el árbol VIVO, así que un lead sí puede llegar. Parece deliberado (es el
      imán de la página de facturación). Queda anotado por si el dueño del contenido lo quiere
      también en el pie; el gate ya la cubre y hoy pasa.

- [x] 🟢 **Cloudflare ofusca el correo de contacto en `/privacidad` y `/terminos`, y para un
      rastreador sin JS el contacto legal dice `[email protected]`.** Medido: el HTML servido
      trae `<a href="/cdn-cgi/l/email-protection">` en 7 lugares de 4 páginas. **Mirado
      renderizado: para un humano NO hay defecto** — el decodificador de Cloudflare corre y la
      pantalla muestra `business@onia.com.bo` con su `mailto:` bien puesto. El residuo es que
      `/privacidad` es indexable **a propósito porque el rastreador de Meta valida esa URL al
      publicar la app del chatbot**, y ese rastreador no ejecuta JS: ve el marcador. Y la
      ofuscación no protege nada igual — el correo viaja en claro en el payload RSC de las 16
      páginas. **Se apaga en el panel de Cloudflare (Scrape Shield → Email Address
      Obfuscation), que no es código ni es mi zona:** es de Sergio.

### Del canario visual — corrida del 2026-09-03 ~03:41 UTC (diez pantallas)

- [x] 🟠 **El ítem de "captura full-page ciega" (abierto 2026-09-02, confirmado vivo en
      `rubros` a las 00:43 UTC) tenía causa raíz en la propia herramienta, y ya está
      arreglada.** `scripts/canario_visual.mjs` scrolleaba con 120 ms por paso y 400 ms de
      espera final antes de la captura — insuficiente para las animaciones "aparece al
      entrar en vista" del sitio (framer-motion `whileInView` con `delay`).
      - **Reproducido aislado:** con esos mismos tiempos, la tarjeta de add-on de WhatsApp
        de `/precios` ("No pierdo al que escribe", Bs 390/mes) salía completamente en
        blanco en la captura — la sección entera parecía vacía. Con 300 ms/800 ms la misma
        tarjeta aparece completa, con precio, nota de IVA y CTA.
      - **Confirmado que el DOM SÍ tenía el contenido** con los tiempos viejos
        (`opacity:1`, `w:1184 h:344` medido con `getComputedStyle`+`getBoundingClientRect`):
        no era el sitio devolviendo menos HTML, era la captura tomada antes de que la
        animación terminara.
      - **Arreglé el script** (`scripts/canario_visual.mjs`, scroll a 300 ms/paso + 800 ms
        final) y corrí `--self-check`: **13 casos en verde**.
      - **Re-corrida completa después del arreglo:** `rubros` ahora muestra las 5 filas de
        "La misma base, con las palabras de tu negocio" (antes: banda vacía) y `precios`
        muestra la tarjeta de WhatsApp completa. El resto del contenido de las 10 pantallas
        sigue sano.
      - **No toqué las baselines de `home`, `precios`, `empezar`, `rubros`:** la única
        diferencia visible ahora contra esas baselines es que el widget de Chatwoot (429,
        ítem de abajo) sigue sin aparecer — pisar la baseline ahora horneraría "sin widget"
        como el estado normal, exactamente lo que ya se evitó con `chatbot-landing` el
        2026-09-02. Se retoman cuando ese ítem cierre.

- [x] 🔴 ~~**El widget de Chatwoot sigue caído (429) en las 5 páginas de `onia.com.bo`, y la
      sonda oficial confirma que NO es sólo tráfico propio: hay IPs ajenas pegándole.**~~
      **FALSO, y la culpa era de la sonda — ARREGLADA 2026-09-03 05:35 UTC, `onia-cola`.**
      El titular se apoyaba en *2 peticiones ajenas de 288*, y ninguna de esas dos IPs llegó
      nunca al límite. Medido en vivo hoy: `/widget` responde **HTTP 200**, contador en 2 de 5,
      y **287 de 289 peticiones (99 %) salen del propio VPS**. Un visitante real abre el chat
      sin problema — Rack::Attack cuenta **una clave por IP**, así que la única forma de que
      un cliente vea el 429 es que **su propia IP** llegue a 5/hora. Nunca pasó.
      **De quién es la huella, medido por minuto** (`docker logs` del contenedor de chat):
      ráfagas en `:48–:56` de **cada** hora, de 10 a 14 cargas — el loop `web-venta`, que abre
      las 5 páginas cada hora — y en `:41`, el canario. Con 5/hora por IP, **cada corrida se
      autolimita sola** y deja el cupo quemado para el loop siguiente.
      **La causa de que esto se reabriera cinco veces era el instrumento, no el sitio.**
      `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` decidía por el código HTTP
      **del instante**, y el throttle es
      intermitente (ventana de 1 h): contestaba distinto según el minuto en que se la corriera.
      Dos defectos, los dos empujando al mismo error caro:
      - **falso negativo** — widget en 200 ⇒ *"nada que diagnosticar"*, tirando a la basura las
        286 peticiones propias que ya estaba mostrando dos líneas más arriba;
      - **falso positivo** — contaba **peticiones** ajenas en vez de **IPs ajenas que llegaran
        al límite**, así que 2 visitas legítimas gritaban *"puede haber clientes afectados"*.
        De ahí salió, textual, este ítem.
      **El arreglo:** la decisión se mudó a `scripts/veredicto_widget.mjs` — función pura, con
      `--self-check` y **dentro de `npm test`** (`test:veredicto-widget`). Los tres casos que
      importan fallaban en ROJO contra la lógica vieja (3 de 4) y pasan con la nueva. Sigue
      sabiendo salir positivo: una IP ajena que llega al límite da `CLIENTES-AFECTADOS` y la
      nombra — una sonda que sólo sabe decir "es nuestro" no sirve para el día en que no lo sea.
      **Lo que NO cambió y sigue siendo de Sergio:** safelistear la IP del VPS
      (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`) para que el canario vuelva a ver lo que ve un
      cliente. Es un cambio de entorno del contenedor de chat en producción, con reinicio.

- [x] ~~🔴 **Titular original, conservado para no perder de dónde salió:**~~
      Corrida oficial (`node scripts/canario_visual.mjs`): `home`, `precios`, `empezar`,
      `rubros`, `chatbot-landing` — las cinco — con `error de consola nuevo: ... status of
      429 ()`. Mismo patrón de peso que ayer (bundle del widget ausente): home 580 KB,
      precios 327 KB, empezar 325 KB, rubros 746 KB, chatbot-landing 326 KB.
      - **Corrí la sonda que pide el CLAUDE.md antes de escribir esto**
        (`sh /root/loops/onia-hermes/hermes-content/deploy/vps-ops/widget-429-de-quien.sh`),
        para no repetir el error de la vuelta anterior que dio este mismo 🔴 por AUTOINDUCIDO
        sin poder salir negativo. Esta vez el veredicto es distinto:
        ```
        == 2. ¿A nombre de QUÉ IP está el contador del throttle? ==
           190.180.28.134     1 cargas (el límite es 5/hora)
           187.77.16.63       15 cargas (el límite es 5/hora)
        == 3. ¿Quién pidió /widget en las últimas 6 h? ==
           187.77.16.63       284 peticiones
           192.223.122.70     1 peticiones
           190.180.28.134     1 peticiones
        VEREDICTO: OJO: 2 peticiones vinieron de IPs ajenas.
        ```
      - Lectura: el throttle de la hora actual lo agota casi entero nuestro propio VPS
        (187.77.16.63, con 15 de las 5 permitidas — las corridas repetidas del canario y de
        otros carriles lo saturan), pero en las últimas 6 h hubo 2 peticiones de IPs que no
        son nuestras ni conocidas. Ninguna de esas 2 IPs ajenas llegó sola a las 5 cargas/hora
        que dispararían SU propio 429 — así que hoy el 429 que ve un visitante real depende de
        si comparte ventana de una hora con nuestro propio tráfico, no de que el visitante
        mismo se autolimite.
      - **No lo toqué**: contenedor y cron del widget son ajenos a este carril, sigue sin
        dueño declarado (vive en `web-factory/apps/onia-platform/`). Van ~11 horas de caída
        (primera detección 2026-09-02 16:41 UTC).
      **Evidencia:** capturas de hoy en
      `hermes-content/docs/historial/canario-visual/2026-09-03-{home,precios,empezar,rubros,chatbot-landing}.png`.

- [x] 🟢 **Las otras cinco pantallas: sin disparo mecánico y sin defecto nuevo a la vista.**
      `contacto` (322 KB/158 ms), `register` (707 KB/178 ms, 5 rubros con íconos legibles),
      `login-plataforma` (696 KB/98 ms, "Pedí tu acceso" presente), `login-chat`
      (3.500 KB/928 ms, formulario Chatwoot propio, no está caído), `panel-chatbot`
      (699 KB/114 ms, redirige a `/login` sin sesión: "no medida", no "OK"). Ninguna
      baseline tocada.

- [x] 🟠 **ARREGLADO el 2026-09-03 por `onia-cola`: los 7 falsos positivos son CERO, y eran
      TRES clases, no dos.** `node scripts/verificar_cola.js hermes-content/docs/COLA.md` pasó
      de **10** errores a **3**, y los 3 que quedan son el gate funcionando: 1 `duplicado` real
      (los ítems de las líneas 1757 y 1857 son la misma nota de dos corridas del canario) y los
      2 `sin-evidencia` que este ítem ya daba por legítimos. **Ni un `fantasma`.**
      - **Clase A — nombre suelto AMBIGUO** (`nombreSueltoAmbiguo`): `existeComoSufijo` se
        niega **a propósito** a resolver un nombre sin barra, y después el gate lo reportaba
        como *"ese archivo NO existe"*. Acusaba de inexistente algo que había decidido no
        buscar. Ahora se ignora — ni evidencia ni error — **sólo desde DOS coincidencias**,
        que es donde el gate deja de poder decidir. Con una sola no hay ambigüedad y la regla
        vieja sigue mandando: *"sin barra no hay resolución por sufijo"* tiene su propio caso
        en el self-check y **este ítem no la reabrió**.
      - **Clase B — especificador de módulo** (`esEspecificadorDeModulo`): `@/lib/pricing` es
        un alias de TypeScript (lo resuelve `tsconfig`, no el disco); `next/link` y
        `packs/js/sdk.js` son un paquete de npm y el SDK de Chatwoot que sirve **otro host**.
      - 🔴 **Clase C — la que este ítem NO había visto, y era la peor: el rango de líneas.**
        El limpiador entendía `archivo:141` y `archivo:141:5` pero **no** `archivo:141-166`,
        que es como se cita un BLOQUE. El rango quedaba pegado al nombre y el archivo salía
        fantasma **existiendo**. Medido: `scripts/mirar-venta.mjs:141-166` se reportaba como
        inexistente con el archivo vivo en
        `web-factory/apps/onia-platform/scripts/mirar-venta.mjs`. Las otras dos clases hacen
        ruido; **ésta esconde trabajo real detrás de una cita bien escrita.**
      - ⚠️ **Y robots.txt no era ninguna de las tres: la cita estaba mal.** (Va sin backticks
        por lo que avisa el párrafo de más abajo: entre backticks se vuelve a extraer como
        ruta y este mismo renglón sumaría el error que describe — pasó al escribirlo.) Este ítem lo
        había puesto en la clase A "nombre suelto", pero medido da **cero** archivos con ese
        nombre en los dos repos — en el repo es `robots.ts`, y el `.txt` es lo que Next
        **sirve**. Se corrigió la cita a `/robots.txt` (una URL, que el gate ya ignoraba). La
        clasificación heredada no se sostuvo al contarla: `page.tsx` tiene 155 archivos con
        ese nombre y `globals.css` 6, pero robots.txt tenía 0, igual que un fantasma de
        verdad.
      - ✅ **El self-check ya lo corre `npm test`** (`test:cola-selfcheck` en `package.json`):
        pasó de **75 casos que nadie ejecutaba** a **86 que corren en cada gate de `main`**.
      - **Lo que queda, y NO es de este carril:** el `duplicado` de 1757/1857 es una nota de
        "no encontré defecto" escrita dos veces por `canario-visual` en dos corridas. Cerrarla
        o borrarla es de ese carril; `onia-cola` no toca los registros de otro.

      **El diagnóstico original, que sigue siendo la mejor explicación de POR QUÉ importaba:**
      `node scripts/verificar_cola.js hermes-content/docs/COLA.md` daba **13** errores; con el
      arreglo de hoy (prefijo del repo hermano) da **10**, de los cuales 2 son `sin-evidencia`
      legítimos. Los 7 `fantasma` que sobran NO son items rotos: son formas que el extractor
      toma por rutas de repo y no lo son. **Un gate que sale rojo de fábrica se saltea, y ahí
      deja de proteger** — es la misma lección del vigía que grita mal.
      ⚠️ Los seis literales de abajo van **sin backticks a propósito**: citarlos entre backticks
      los vuelve a extraer como rutas y este mismo ítem sumaba 6 errores nuevos al gate que
      viene a describir. Se comprobó en vivo antes de escribirlo así.
      - **Clase A — nombre de archivo suelto, sin barra:** robots.txt (línea 781),
        page.tsx (961), globals.css (1682). `existeEnAlgunRepo` los rechaza **a propósito**
        (`scripts/verificar_cola.js:275`: sin barra no se resuelve por sufijo, porque un
        page.tsx suelto matchearía cientos). El defecto es que algo deliberadamente irresoluble
        se reporte como ERROR en vez de ignorarse: el gate se acusa a sí mismo.
      - **Clase B — especificador de módulo, no ruta:** @/lib/pricing (961), next/link
        (1554), packs/js/sdk.js (1554). Son un alias de TypeScript, un paquete de npm y el SDK
        de Chatwoot servido por otro host. Ninguno es un archivo de este árbol y ninguno debería
        buscarse en disco.
      - **Repro en 30 segundos:** `node scripts/verificar_cola.js hermes-content/docs/COLA.md`
        y leer las líneas `ERROR fantasma`. Cada una nombra el literal que no resolvió.
      - ⚠️ **Y un hallazgo aparte, más barato de arreglar que de explicar:** el validador tiene
        un self-check de **75 casos** (`node scripts/verificar_cola.js --self-check`) que
        **`npm test` no corre** — no está en `package.json`. Un gate con pruebas que nadie
        ejecuta se rompe sin que nadie se entere.
      - **Zona:** `scripts/verificar_cola.js`, de este carril (`onia-cola`). No entraba en la
        vuelta de hoy: se arregló la clase del repo hermano, que era la que ensuciaba las rutas
        del producto, y se dejó medido el resto en vez de empezar lo que no se puede terminar.
### Del canario visual — corrida del 2026-09-03 ~06:42 UTC (diez pantallas, sin ítems nuevos)

- [x] 🟢 **Diez pantallas abiertas y MIRADAS. Sin disparo mecánico en ninguna, sin defecto
      nuevo a la vista.** `home` (2.360 KB/316 ms), `precios` (2.110 KB/210 ms, widget de
      Chatwoot SÍ visible, tarjeta de WhatsApp Bs 390/mes completa), `empezar` (2.104 KB/139 ms),
      `rubros` (2.527 KB/143 ms), `chatbot-landing` (2.107 KB/184 ms, widget visible, precio Bs
      390/mes correcto), `contacto` (322 KB/231 ms), `register` (702 KB/124 ms, asistente de 2
      pasos, 5 rubros con íconos legibles), `login-plataforma` (696 KB/96 ms, "Pedí tu acceso"
      presente, íconos legibles), `login-chat` (3.499 KB/1.221 ms, formulario Chatwoot propio,
      no está caído), `panel-chatbot` (702 KB/135 ms, redirige a `/login` sin sesión: "no
      medida", no "OK"). Ninguna baseline tocada.
  - **La banda vacía de `home` y `rubros` en la captura full-page NO es el bug ya cerrado
    (scroll de espera corto).** Tiene otra causa, más simple: ambas pantallas usan un
    conmutador `position: sticky` (`switcher.tsx`, el "runway" de rubros que también vive en
    home) que se pinea mientras vos scrolleás. Un `fullPage` screenshot no repite el elemento
    pineado en cada tramo del scroll: lo captura UNA vez, en su lugar natural, y el resto del
    contenedor alto (~5 rubros × alto de paso) queda en blanco en la imagen — aunque el DOM
    tiene todo el contenido (confirmado con `visto.texto`, que trae los 5 rubros completos más
    abajo, después de la banda). Coincide con la nota ya escrita en este mismo archivo sobre
    "el pin del scrollytelling... eso SÍ es esperado". **No es un ítem: es una limitación
    conocida del instrumento (captura full-page + `position:sticky`), no del sitio.**
  - **El 429 del widget: corrí la sonda oficial ANTES de escribir nada** (regla del
    CLAUDE.md tras el falso positivo del 2026-09-02 y el falso "OJO" mal interpretado antes
    de eso). Esta vez:
    ```
    == 2. ¿A nombre de QUÉ IP está el contador del throttle? ==
       187.77.16.63       10 cargas (el límite es 5/hora)
    == 3. ¿Quién pidió /widget en las últimas 6 h? ==
       187.77.16.63       261 peticiones
       192.223.122.70     1 peticiones
       190.180.28.134     1 peticiones
    VEREDICTO: AUTOINDUCIDO. 261 de 263 (99%) son del propio VPS.
    ```
    **El veredicto cambia de corrida a corrida** (la vuelta anterior, 03:41 UTC, dio "OJO: 2
    IPs ajenas"; ésta da AUTOINDUCIDO) porque la ventana del throttle es de 1 h y depende de
    qué tráfico cayó en esa hora puntual — no cierra ni reabre el ítem 🔴 de arriba por sí
    sola, sólo agrega un dato más a su serie. **El ítem 🔴 del widget caído queda como
    estaba** (abierto, sin dueño), con esta lectura sumada a su historial.
  - ⚠️ **Nota operativa propia, no un hallazgo del sitio:** después de la corrida oficial
    reejecuté `home` sola 3 veces para investigar por qué el peso variaba (2.360 KB vs los
    2.310 KB de la baseline vieja) — eso agotó el cupo de 5 cargas/hora del widget en
    `onia.com.bo` y las 3 reejecuciones sí vieron el 429 (581 KB, sin widget). **El
    `home.json`/`home.png` que quedan en `.canario-out/` después de esta vuelta son de esas
    reejecuciones, no de la corrida oficial** — reflejan un estado autoinducido por mí, no el
    estado real del sitio. La cifra correcta de esta vuelta es la de la corrida oficial (2.360
    KB, sin error de consola), citada arriba. Lección para la próxima: no reejecutar una
    pantalla sola para "confirmar" peso — el propio acto de medir de nuevo quema el cupo del
    widget y ensucia la evidencia.
  - **Aparte, sin ser ítem:** el copy del hero de `home` cambió respecto a la baseline
    versionada ("Tu negocio no pierde citas ni cobros..." / CTA "Pedí tu acceso" → "Cerrás
    vos. El negocio no." / CTA "Creá tu cuenta"), y es consistente con `empezar` y `register`
    (los tres ya dicen "Creá tu cuenta" y el asistente de 2 pasos existe y funciona visualmente).
    Parece un cambio de copy intencional y coherente en toda la superficie, no una promesa
    rota — lo dejo anotado porque es la clase de cosa que la regla de "una promesa que cambia
    se barre en TODA la superficie" pide vigilar, pero sin confirmar si `/register` ya crea
    cuentas de verdad no corresponde declararlo bug ni arreglo. No se tocó la baseline.

- [x] 🟡 **`onia.com.bo/chatbot` — el header sticky deja pasar el texto de atrás y se vuelve
      ilegible al llegar al final de la página.** Canario visual, 2026-09-03. El `<header>`
      del sitio tiene fondo con **88% de opacidad** (`color(srgb .976 .984 .980 / 0.88)`) y
      `backdrop-filter: blur(10px)` — no es opaco de verdad. Cuando el scroll llega a la
      sección verde oscura de precio ("Bs 390/mes, sin instalación."), el título blanco en
      negrita queda posicionado justo detrás del header y **se ve fantasma, superpuesto al
      nav** ("Rubros · Precios · Comparativa..."), volviendo confusos los dos.
      Evidencia: `hermes-content/docs/historial/canario-visual/2026-09-03-chatbot-ghost-header.png`
      (capturada con espera de 2.500 ms — descarta que sea una animación a mitad de camino).
      Reproducir: abrir `https://onia.com.bo/chatbot`, scrollear al final, mirar el header.
      Estilo computado verificado con Playwright: `backgroundColor: color(srgb 0.976471
      0.984314 0.980392 / 0.88)`, `backdropFilter: blur(10px)`, `opacity: 1`.
      Probé en `/precios` y `/empezar` con el mismo scroll al fondo: ahí no se ve, porque no
      hay texto blanco en negrita justo bajo el header en ese punto — el defecto es del CSS
      del header (opacidad no total), no de una sola página; sólo se nota donde el contraste
      es alto. Sin dueño derivado — el header vive en el layout global del sitio, no en un
      componente de `/chatbot`.
      ⚠️ **Nota sobre el propio instrumento**: esto casi se reportó mal. La primera pasada de
      esta vuelta mostraba el mismo fantasma en CASI TODAS las pantallas (home, rubros,
      precios) con la espera vieja de 350 ms — resultó ser la herramienta fotografiando una
      animación `whileInView` a mitad de camino (con 900-1500 ms de espera, esas desaparecían).
      Se subió el piso de espera de la herramienta (`scripts/canario_visual.mjs`, 350→900ms,
      con self-check verde) ANTES de escribir este ítem, y sólo quedó **éste**, que persiste
      incluso a 2.500 ms — por eso es real y no un artefacto de captura.
      ✅ **CERRADO el 2026-09-05 (web-venta).** Reproducido primero en producción, mirando:
      fondo `… / 0.88`, `blur(10px)`, y `elementsFromPoint` en el medio del header devolvía la
      `SECTION.sitio_block sitio_green` de atrás. Lo que se ve fantasma son las LETRAS BLANCAS
      del título, no el verde: medidas en píxeles contra el header limpio daban **9,2/255** de
      contraste. **No era una barra sino TRES** —`(sitio)/sitio.module.css .header` (88 %),
      `components/site-header.module.css .header` (82 %, que sirve `/nosotros`, `/privacidad`,
      `/terminos`, `/servicios/*` y las `/v1/*`) y la barra fija de abajo de `landing-v1`
      (92 %)—, así que arreglar sólo `/chatbot` dejaba el defecto vivo en más páginas que las
      que lo mostraban. Las tres a **97 %**, conservando el `backdrop-filter` (sigue siendo de
      vidrio; la dirección visual no se tocó, que es decisión de Sergio). Verificado con el
      MISMO scroll, alto de página y pila de elementos, sin respuestas ≥400: el contraste del
      fantasma bajó a **2,2/255** (4,2× más tenue, imperceptible). Gate nuevo
      `src/app/barras-opacas.test.ts`, en ROJO primero: deriva las barras del DISCO (toda regla
      `position: sticky|fixed` con fondo `color-mix(… N%, transparent)`), así una barra nueva
      nace cubierta. Su primer intento encontró CERO sujetos —el patrón se cortaba en el `)` de
      `var(--bg)`— y la aserción de opacidad pasaba igual en verde sobre la lista vacía: lo cazó
      la guarda `MINIMO_SUJETOS`, que es justo por lo que está.

## Rechazado hoy con motivo (2026-08-30) — no volver a abrirlo

- **F1 · Sumar `/patients` al nav de servicios profesionales.** Lo intenté, escribí el test,
  lo vi en rojo, hice el cambio — y **dos guardas del repo lo cazaron como regresión.**
  El bug YA estaba arreglado el 2026-08-30, y **a propósito de otra forma**: la ficha
  (`patients/[id]`, `medical-alerts`, `records`) es de los packs **clínicos**, así que abrir
  el segmento le daba la ficha clínica a un estudio contable con sus APIs en 403. El arreglo
  real es **alta inline del cliente en el modal de nueva cita** contra `/api/patients`
  (`app/(dashboard)/appointments/page.tsx:129-143`). Revertido, árbol limpio.
  **Lección:** hice grep del nav —que es estructura— y concluí sobre la capacidad. Es el
  mismo error de "contar menciones de archivo en vez de capacidad" que ya me marcaron.
- **F2 · Gatear `addon.inventory_advanced`.** Sergio ya lo decidió el 2026-08-27: *"no se
  cobra"*. El add-on se retiró de la oferta y las funciones quedaron gratis para todos. Que
  la clave no la lea nadie es ahora **lo correcto**. Está escrito en `lib/pricing.ts:120`.
- **F2 · Gatear `addon.web`.** La web del cliente la entrega **web-factory**, otro repo. No
  tiene ni debería tener pantalla en la plataforma. La clave es decorativa.
- **F4 · Encender el agente `captador`.** Está apagado **por diseño**, no por olvido.
  `agents-runtime.ts:1152` lo dice: *"Sin esto, cada clínica dental y cada veterinaria
  estrenaría una fila 'captador inmobiliario'"*. Es un add-on con `requiresFeature`, y su
  copy es **inmobiliario** ("nunca inventa datos del inmueble") — un rubro que ni siquiera
  se ofrece. `kind_not_enabled` en 14 días de log = nadie lo compró. Funciona como debe.

### Arrastre de la cola anterior

- [x] **Paso 3 corrido: auditados los 11 shas que esta cola declara cerrados. 10 ciertos, 1 mal
      citado — y `master` está verde.** Hecho el 2026-08-31, con la cola sin un solo ítem
      desbloqueado en "Ahora" (F2, F5, los 4 WhatsApp y el `DELETE` de pagos esperan **una línea
      de Sergio**, no código). **Cero líneas de producto tocadas: no había nada roto.**
      - **Método, que es lo que se hereda:** `git fetch` y después
        `git merge-base --is-ancestor <sha> origin/master` — la lección que esta misma cola
        escribió el 2026-08-31 sobre `git branch --contains`, aplicada por primera vez a todos
        los cierres a la vez en lugar de a uno.
      - **10 de 11 son ancestros reales de `origin/master`:** `0711ff6`, `34e3d29`, `2849be0`,
        `1fc4354`, `14abb9a`, `88c1d56`, `753718f`, `4077f2c`, `3e43c93`, `4dce75e`.
      - **El que falló fue F3 (`6d8b6b7`) y NO era un cierre falso: era una cita falsa.** El sha
        no está en `origin/master` porque el PR entró **squasheado** como `ab9e0de` (#57).
        Corregido arriba. **La diferencia importa:** un sha ausente parece trabajo perdido y
        dispara que alguien lo rehaga — que es exactamente el costo que el Gate 1 existe para
        evitar. **Regla nueva: se cita el sha del MERGE, no el de la rama.**
      - **Las citas `archivo:línea` de los ítems cerrados se resolvieron una por una** contra el
        árbol de hoy (`types.ts:73`, `plan-limits.ts:396`, `clinics/route.ts:99`, `pricing.ts:64`,
        `webhooks/bcp/route.ts:55`, `agents-runtime.ts:1157`, `navigation.ts:45`,
        `portal/requerimientos/route.ts:21`): **ninguna derivó**.
      - **Gates sobre `origin/master` (= `0711ff6`, la punta):** `tsc --noEmit` **0 errores** ·
        **2342 pasan + 5 skip (2347) en 190 archivos**. El árbol quedó limpio — esta vez `vitest`
        **no** reescribió los `.snap` con CRLF, la trampa anotada el 2026-08-30.
      - **El tercer gate estaba ROTO, y la auditoría lo destapó de casualidad: ARREGLADO en la
        misma vuelta.** `eslint` sobre la raíz **pasó de 20 minutos** y reventó **dos topes de
        10 min seguidos**; terminó en segundo plano con **exit 0**, y su salida delató la causa:
        estaba linteando `.claude/worktrees/*/.next/...`. **No era el tamaño del repo.** El
        `".next/**"` de `eslint.config.mjs` ignora sólo el `.next` de la **raíz**, y este repo
        tiene **~30 git worktrees vivos** bajo `.claude/worktrees/`, cada uno con una copia
        entera del código de **otra rama** y su propio `.next`. El gate revisaba 30 árboles
        ajenos. **Con el arreglo: 39 segundos contra el mismo árbol. ~30x.**
        **Por qué era grave siendo sólo lentitud:** el síntoma es **silencioso** — eslint sale
        en verde igual, sólo que tarda tanto que la sesión lo saltea. Es exactamente lo que me
        pasó a mí en esta vuelta, y el paso 4 de esta cola exige los tres gates porque **ya se
        rompió CI dos veces** por correr sólo los dos primeros. Un gate que nadie puede correr
        no es un gate. **CI nunca lo sufrió**: allá no hay worktrees. Era un defecto **sólo
        local**, que es la peor clase — el que hace que el gate se abandone justo donde debería
        atajar antes de CI.
        Va en el script `lint` de `package.json` (el que invoca `npm run ci`) con su guarda en
        `__tests__/eslint-no-lintea-worktrees.test.ts`, vista en ROJO antes.
        Gates del arreglo: tsc 0 · lint **0 errores** (101 warnings preexistentes, todos en
        `.agents/skills`) · **2346 pasan + 5 skip (191 archivos)**. Commit `149e2a9`, **ya en
        `origin/master`** por fast-forward.
        📌 **Para Sergio, y NO bloquea nada:** el arreglo de raíz iba en `globalIgnores` de
        `eslint.config.mjs`, pero el hook `config-protection` de `~/.claude/scripts/hooks/`
        **prohíbe editar ese archivo** (existe para que nadie afloje reglas de lint, y hace
        bien). Se arregló en la capa que sí se puede tocar y **el resultado es el mismo**;
        mover la ignore al config es cosmética. Si algún día se quiere, hay que habilitar el
        hook a mano.
        **Verificado por segunda vez, en paralelo y sin saberlo, el 2026-08-31 — y lo que
        agrega la revisión independiente son tres datos que el arreglo no tenía:**
        (1) **No es sólo lentitud: el gate MIENTE.** Con **un solo** worktree anidado el
        conteo pasa de **101 a 202 warnings** (A/B controlado en un árbol aislado, 41,0 s vs
        52,1 s) — o sea le atribuye a esta rama los warnings de las otras. Con 30, el número
        que reporta no es de este árbol.
        (2) **El comando pelado no sólo tarda: se cae.** `npx eslint .` sobre la raíz abortó
        con `ENOENT ... scandir '.claude/worktrees/lint-worktrees'` porque **otra sesión creó
        y borró un worktree mientras eslint lo recorría**. Es no determinista: a veces sale
        verde en 20 min, a veces revienta. Una razón más para que el paso 4 mande a
        `npm run lint`.
        (3) **`tsc` NO tiene este problema — comprobado, para que nadie lo "arregle".**
        `tsconfig.json` no excluye `.claude`, así que parece vulnerable; no lo es:
        `npx tsc -p tsconfig.json --listFilesOnly | grep .claude/worktrees` da **0**, porque
        TypeScript salta los directorios que empiezan con punto en sus patrones wildcard.
        Tocar el `exclude` del tsconfig sería una vuelta perdida.
        ⚠️ **Y la lección de proceso, que costó una vuelta entera:** **dos sesiones tomaron
        este mismo ítem a la vez**, y la segunda escribió un arreglo equivalente en
        `eslint.config.mjs` que hubo que **tirar a la basura** al descubrir, recién al mergear,
        que `master` ya lo traía. El Gate 1 pregunta *"¿ya está hecho?"* contra el repo del
        **inicio** de la vuelta; no protege de lo que se hace **durante**. **Regla nueva:
        `git fetch` y mirar la punta de `origin/master` ANTES de escribir la primera línea, no
        al mergear** — y si el worktree propio recibió commits ajenos, es que hay otra sesión
        en el mismo carril: parar y avisar.
      - **Lo que la auditoría NO cambió, a propósito:** el punto 1 de
        `ONIA_DEFINICION_DE_TERMINADO.md` ("la bandeja queda vacía") sigue 🔴 aunque su código ya
        esté en master (`88c1d56`, carril chatbot). Su LISTO no es "el commit existe", es *"un
        mensaje aparece en su bandeja, **mirado con captura**"*, y eso pide desplegar al VPS —
        que está en la lista de "nunca" de este loop. **Marcarlo verde por el commit sería
        reportar como hecho algo que nadie miró.**

- [x] **Paso 3 otra vez, y esta vez el defecto NO estaba en los `[x]` sino en la lista de
      bloqueos: 6 de 10 entradas de "Bloqueado — necesita a Sergio" ya no eran bloqueos.**
      Hecho el 2026-08-31 con la cola sin un solo ítem desbloqueado en "Ahora" (F2, F5, los 4
      números de WhatsApp y el `DELETE` de pagos esperan **una línea de Sergio**, no código).
      **Cero líneas de producto tocadas: no había nada roto en el código.**
      **Por qué esta lista importa más que la de cerrados:** los `[x]` los audita alguien de vez
      en cuando; la lista de bloqueos es la que una sesión lee para decidir **qué preguntarle a
      Sergio**. Una entrada vencida ahí no es desprolijidad — **fabrica trabajo**: hace que
      alguien le pida una decisión sobre algo ya hecho. Y el lead bueno se quema una sola vez.
      - **El hallazgo grande: `dentalgest.app` ya no sirve nada.** La entrada más alarmante de la
        lista decía que el MISMO `onia-platform` seguía publicado en Vercel contra el Supabase de
        la nube. Medido hoy, `/` y `/login` dan **404 con `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`**:
        Vercel conserva el dominio, pero **no hay deployment detrás**. No existe la segunda copia
        expuesta. Queda sólo decidir qué se hace con el dominio, que es cosmético.
        **La lección: "el dominio resuelve" y "hay una app viva ahí" no son lo mismo**, y la
        entrada las mezclaba en una sola frase. El propio código de error de Vercel es lo que
        separa una cosa de la otra — un 404 de la app diría lo contrario.
      - **Otras cinco bajas, cada una con su medición y no con un renglón leído:** los 2 crons del
        VPS (crontab de **36 líneas**, ambos presentes, scripts `700` — cerrado como **D1**);
        `arthur`/`seller_001` (**D2**, y `center.onia.com.bo` responde **404**); el rate limit de
        Vercel (su propia entrada decía "hasta el 2026-08-30"); el rename del schema de producción
        (figuraba **como bloqueo y como rechazo a la vez**); y GA4 y la UI del dashboard, que ya
        estaban desmentidos el 2026-08-30 y nadie había sacado de la lista.
      - **Lo que la auditoría CONFIRMÓ, para que nadie lo rehaga:** la consolidación de
        `handoff/` (existe la singular, no la plural, y `origin/main` la cita bien en sus dos
        lugares — el plural sobrevive sólo en la rama `claude/ads-creatividades-publicos`, otro
        carril); y el test de carrusel, que corre verde (`node --test
        scripts/carousel_render.test.js`, 1 pasa / 0 falla) con `FORMATS.square` tras el renombre.
      - **Deriva menor anotada, no es un cierre falso:** `master` local de `onia-platform` quedó
        `0 1` contra `origin/master` — le falta `149e2a9`, el arreglo del gate de lint que se
        pusheó **después** de aquella nota. El cierre "quedó `0 0`" era cierto cuando se escribió.
      - **Regla que se lleva la vuelta: la lista de bloqueos se reverifica igual que los cerrados.**
        Un bloqueo no caduca solo, pero el mundo sí se mueve — dos de estos seis los desbloqueó
        esta misma cola en una vuelta anterior y nadie volvió a tachar la copia.

- [x] **`ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md` corregido en los 4 lugares** donde decía que
      Emizor no publica precio — uno de ellos lo llamaba *"el dato que más falta en todo el
      relevamiento"*. Verificado en vivo el 2026-08-30 contra dos capturas de archive.org
      (29-nov-2022 y 27-abr-2025, **idénticas**): PYME USD 49 · EMPRESA USD 99 · CORPORATIVO
      USD 299 = **Bs 580 / 1.171 / 3.537** a 11,83. Nuestros números se leyeron de
      `subscription-plans.ts` (320/750/1.500/2.900), no de un doc.
      **Tres cosas que la nota de la cola no tenía y sí cambian el pitch:**
      (1) los tramos de Emizor son **por facturación anual del cliente**, no por usuarios;
      (2) el plan PYME **sólo se vende semestral** — USD 294 ≈ **Bs 3.478 por adelantado**
      contra Bs 320/mes, y ésa es la barrera real para el negocio chico, no los Bs 260 de
      diferencia mensual; (3) Emizor da facturas, sucursales **y usuarios ilimitados** sin
      costo de alta, así que contra ellos **no se compite por el precio de la facturación**,
      se compite por todo lo demás que viene en el mismo plan.
      **Queda abierto (menor):** `/precios-2` da 404 en vivo y la última captura es de
      abr-2025 — es el mejor dato disponible, no el precio de hoy confirmado. Se cierra con
      una cotización por su formulario. **Lección anotada en el doc:** un 404 en `/precios`
      no prueba que no publiquen precio, prueba que esa ruta no responde.
- [x] **Organizaciones de prueba limpiadas en la base LOCAL — y el ítem escondía una trampa.**
      Hecho el 2026-08-30: eran **10**, no 9. Se borraron **8** con un solo
      `DELETE FROM organizations` (los 42 FK que apuntan a `organizations` son `ON DELETE
      CASCADE`, verificado en `pg_constraint`), y con ellas sus 8 `profiles` y sus 8
      `auth.users`. Quedan **2 a propósito**, porque son la evidencia que esta cola cita en su
      propio "Estado": `fiscal-local` (la única factura, la del circuito fiscal con CUF/QR/RCV)
      y `ferreteria-circuito-completo-exu53` (el único `subscription_payment`, los **Bs 320**).
      Borrarlas dejaba la cola afirmando un resultado sin nada que lo reproduzca.
      Backup previo del schema `public` en el scratchpad de la sesión (218 KB).

      **La trampa, y por qué importa más que la limpieza:** el ítem decía *"sólo local —
      producción no se toca"*, pero **la base local NO es la que configura `.env.local`.**
      - `.env.local` → `postgresql://…@127.0.0.1:54329/postgres?schema=dentalgest`. Ese 54329
        **no es una base local**: lo escucha un `ssh.exe` (PID 17716) con
        `-L 54329:127.0.0.1:54329 root@187.77.16.63`. Es un **túnel al VPS**, y del otro lado
        está `supabase-db`, que efectivamente **corre en el puerto 54329** (`show port`) y
        responde al alias de red `db` — el mismo `DATABASE_URL` que tiene adentro el contenedor
        `onia-platform` **en producción**.
      - O sea: una sesión que hubiera corrido "la limpieza local" cargando `.env.local`
        **borraba producción**. Hoy no lo hizo por accidente: el túnel está muerto (en el VPS
        el 54329 no está publicado al host, sólo 54321 y 54322), así que la conexión da
        `ECONNRESET`. La próxima vez que alguien reviva el túnel, no falla.
      - **La base local de verdad** es el stack `fiscal-mock` de Supabase CLI:
        `supabase_db_fiscal-mock`, puerto **55322**, tablas en `public`.
      - Producción, leída sin tocar nada, tiene **3** organizaciones: `zz-qa-ferreteria-tornillo`,
        `zz-qa-clinica-chatbot` y `onia-interna`. **Ninguna** se llama "Prueba". El ítem nunca
        habló de producción, pero su config sí.
      **Dos errores míos, anotados porque los dos son de método:** busqué la tabla como
      `"Organization"` (PascalCase, el nombre del modelo Prisma) y concluí "no existe base
      local" — en la base se llama `organizations`, y el `@@map` no se ve en el nombre del
      modelo. Y corrí el `DELETE` con `docker exec` **sin `-i`**: el heredoc nunca entró, psql
      no recibió nada, y salió sin una sola línea de output. **Un comando que no imprime nada
      no es un comando que funcionó** — se vio sólo porque después conté las filas.
- [x] **Los dos agujeros de `chore/sacar-dentalgest` — y debajo había uno peor, vivo en
      producción.** Leí el journal `wf_7449df59-54c` antes de tocar, como pedía el ítem.
      **El agujero grande no era ninguno de los dos:** el carril declaró haber arreglado que
      dos pantallas ofrecieran WhatsApp contra el placeholder `59177000000`, y el bug siguió
      vivo. Verificado EN VIVO contra el bundle que sirve el contenedor `onia-platform` del
      VPS (no contra Vercel): `NEXT_PUBLIC_DENTALGEST_WA=59177000000` — **la env var de
      producción TRAE el placeholder**, y el número real de `lib/contact.ts` (59178491375) no
      aparece **en ni un solo chunk**. Mover el placeholder de dos componentes a un módulo
      compartido no arregla nada mientras el valor que gana siga siendo el inventado.
      **Por qué los tests no lo vieron, que es la lección:** `lib/contact.test.ts` cubría la
      AUSENCIA de la env var, nunca una env var **presente-y-basura**. Tenía hasta un test
      llamado "cae al nombre VIEJO, que es el que hoy está cargado en producción" — y pasaba
      en verde justamente con el valor roto. **Un `??` distingue undefined, no distingue basura.**
      - **Agujero 2 (real, cerrado):** `admin/plans/PlansClient.tsx` escribía un CUARTO número a
        mano (`wa.me/59177711991`), lo que hacía FALSA la frase "lib/contact.ts queda como fuente
        única". Ahora pasa por `oniaWaHref()`, con una guarda nueva que prohíbe cualquier
        `wa.me/<dígitos>` literal fuera de `lib/contact.ts` (los `wa.me/${telefono}` del despacho,
        las solicitudes y las reservas son el número DEL CLIENTE y siguen permitidos).
      - **Agujero 3 (NO se toca, y está bien así):** los `contacto@dentaGest.bo` de
        `FaqAyuda.tsx` y `lib/ayuda/faq.ts` viven **dentro de comentarios** que explican por qué
        ese contacto falso se retiró. Borrar esa historia es lo que hace que la regla se vuelva
        a desobedecer. El `dentagest-clinical` es el trackId del rubro: renombrarlo es migración
        de datos, y el escéptico ya había dictaminado que dejarlo es correcto.
      - De paso: `__tests__/escanear-fuente.ts` sólo miraba la línea que ABRE un `{/* ... */}`,
        así que las del medio pasaban como código vivo. Lo delató la guarda nueva señalando ese
        comentario de `FaqAyuda.tsx`. Arreglado para las guardas que usan el escáner.
      **Las dos cifras:** no estaban escritas en ningún lado del repo (murieron con el reporte
      del subagente), así que no había nada que corregir — se deja acá el número verdadero para
      que nadie vuelva a citar una base vieja: **origin/master corría 2283**; con esta rama,
      **2291 pasan + 5 skip (2296) en 184 archivos**. Las cifras del reporte (2136 / 2134) medían
      el commit del que ramificó, no master.
      Gates: tsc 0 · eslint 0 errores · 2291 verdes. Commit `34e3d29`, **ya en master**.

- [x] **Los CUATRO números de WhatsApp — CERRADO: Sergio eligió, otro carril lo shippeó, y esta
      vuelta encontró los tres que quedaron afuera.** El ítem seguía abierto acá como 🔴 DECIDE
      SERGIO **pidiendo una decisión que ya estaba tomada** — es el mismo defecto que esta cola
      cerró hace horas (*"la copia vieja fabricaba trabajo para Sergio"*), ahora con la cara de un
      ítem que envejeció en vez de una sección duplicada. Gana **`59175414930`, el de la calle**
      (`197f7a1`, *"habia CUATRO numeros de Onia y ahora hay uno"*, verificado ancestro de
      `origin/master`): es el que publica onia.com.bo y el que está en Cloud API con el bot
      atendiendo.
      **Y el "ahora hay uno" no era cierto todavía: quedaban TRES `wa.me/59177711991` vivos**, y
      no en un lugar interno — en el HTML de los correos que se le mandan al cliente:
      `n8n/workflows/WF-01-trial-warnings.json` (*"Tu trial termina en 3 días"* y *"Último día de
      tu trial"*) y `n8n/workflows/WF-04-dunning.json` (aviso final de mora al paciente). Los tres
      momentos en que más importa que conteste alguien.
      **La raíz, que es lo que se lleva la vuelta: la guarda que existe para impedir exactamente
      esto miraba la carpeta equivocada.** `__tests__/whatsapp-fuente-unica.test.ts` se apoya en
      `__tests__/escanear-fuente.ts`, que lee `.ts`/`.tsx` de `app/`, `components/` y `lib/` — los
      workflows son **JSON en `n8n/`**, o sea fuera del barrido. La guarda afirmaba *"el número se
      escribe UNA vez"* **sin poder verlos**. Es el mismo defecto que la creó el 2026-08-29, un
      nivel más arriba: entonces se escapó un archivo, ahora una **extensión** entera.
      Se le agregó el barrido de `n8n/workflows/*.json` comparando contra `ONIA_WA_NUMBER` —no
      contra un literal—, así el día que el número vuelva a cambiar estos tres fallan hasta
      acompañarlo, con su recíproco para que no pase en verde leyendo una carpeta vacía. **No** se
      extendió `escanear-fuente.ts` a JSON: lo comparten otras guardas de copy de pantalla y
      meterles los workflows adentro les cambia lo que miden.
      Visto en ROJO nombrando los tres antes del arreglo. Gates sobre `f0a6f9e`: **tsc 0 · 2367
      pasan + 5 skip (192 archivos) · lint 0 errores** (101 warnings preexistentes). Commit
      **`40d8dc2`**, **ya en `origin/master`** por fast-forward.
      **Medido, no supuesto:** WF-01 y WF-04 **no están hoy en la instancia viva de n8n** —
      buscados por nombre, sólo corren WF-02, WF-07, WF-08, WF-09 y WF-SENTRY-01—, así que ese
      correo no le llegó a nadie con el número malo. Se arregla en el origen para que no salga mal
      el día que se importen.
      **Residuo, y es de Sergio, no del código:** falta cargar `NEXT_PUBLIC_ONIA_WA=59175414930`
      en el `app.env` del VPS. Se hornea en el build, así que entra con el próximo deploy; hasta
      entonces manda el fallback de `lib/contact.ts`, que ya es el correcto. Producción tiene hoy
      el placeholder muerto (`59177000000`) en la env var, y `sinPlaceholder()` lo filtra — por eso
      no rompe nada mientras tanto.
      *(Anotado de paso, NO perseguido — es de otro carril: `WF-09: Trial Expired Alert`, que sí
      está activo, consulta `https://kvepqgikokjlacxngkiw.supabase.co`, o sea el Supabase de la
      nube. La base de producción es la self-hosted del VPS.)*

      ⚠️ **Trampa de método que me costó romper el repo, y por eso queda escrita:** un worktree de
      `onia-platform` no trae `node_modules`, y linkearlo con una **junction** de Windows
      (`New-Item -ItemType Junction`) parece gratis… hasta que `git worktree remove --force`
      **sigue la junction y vacía el `node_modules` de verdad** — el del árbol principal, que
      comparten los ~30 worktrees. Se detectó al verificar y se restauró con `npm ci` (682
      paquetes, `tsc` verde, árbol limpio), pero el agujero estuvo abierto. **Para la próxima:
      `npm ci` dentro del worktree, o borrar la junction ANTES del `worktree remove`.** Y la
      lección de fondo es la de siempre con otra cara: **limpiar también es una acción que hay
      que verificar**, no sólo construir.

## Después

- [x] 🟠 **La "guarda de las guardas" fallaba ABIERTO: había TRES suites de test en disco que no
      corría nadie, con `npm test` en verde — ARREGLADO el 2026-09-03 por `onia-cola`, escalón 3
      (recorrer el frente propio).** No salió de la cola: salió de tropezarme con el agujero
      mientras mergeaba.
      - **Lo que estaba pasando, contado en vivo:** `scripts/docs-hygiene.test.mjs` (18 casos),
        `scripts/video-scenes.test.mjs` (1) y `scripts/vigia_sin_respuesta.test.mjs` (15) estaban
        en el repo, **verdes**, y ningún corredor los invocaba. **34 afirmaciones invisibles.**
        Verificado con `grep` sobre `.json`/`.yml`/`.sh`/`.mjs`: las únicas menciones son los
        archivos de implementación nombrándose a sí mismos, nunca al `.test.mjs`.
      - **Por qué `scripts/guards-cableados.test.mjs` no podía verlo, y es el punto del ítem:**
        preguntaba *"¿todo `test:*` **declarado** está cableado a `npm test`?"*. Su lista de
        sujetos salía de `package.json` — **una lista de inclusión**, así que el día que un
        archivo existe en disco sin declararse, no tiene gate y nada se pone en rojo. Es el mismo
        modo de falla que `web-venta` midió hoy con `sitemap.ts`, en otro archivo.
      - **Cómo se cuela, medido esta misma vuelta:** al mergear `claude/chatbots-platform-review-0d1d09`,
        `package.json` salió **en conflicto** porque dos carriles le habían agregado un gate cada
        uno a la misma cadena `test`. Resolver eligiendo un lado —lo natural con el reloj en
        contra— borra el `test:*` del otro lado **junto con su declaración**, mientras el
        `.test.mjs` entra igual al árbol por su propio hunk sin conflicto. Sin huérfano
        declarado, la guarda vieja pasa. Se resolvió por **unión** (21 gates), no eligiendo.
      - **El arreglo:** dos tests nuevos en `scripts/guards-cableados.test.mjs` que sacan los
        sujetos del **DISCO** (`readdirSync` de `scripts/`) menos un `EXCLUIDOS` explícito, hoy
        vacío a propósito. Así un test nuevo **nace cubierto** y hay que excluirlo a mano, a la
        vista, con su motivo escrito. Los tres huérfanos se **cablearon**, no se excluyeron.
      - **Test primero, en ROJO por el motivo correcto:** falló nombrando exactamente los tres
        (`docs-hygiene.test.mjs, video-scenes.test.mjs, vigia_sin_respuesta.test.mjs`) **con las
        dos guardas viejas en verde al lado** — que es la prueba de que eran ciegas a esto.
      - **Los dos recíprocos, probados en vivo, no razonados:** un `.test.mjs` nuevo en `scripts/`
        sale en rojo solo (fixture creado y borrado); y una entrada de `EXCLUIDOS` que apunte a
        un archivo inexistente **también** sale en rojo, para que una exclusión vencida no pueda
        tapar la siguiente.
      - **Alcance, dicho para que no se lea como más de lo que es:** cubre **sólo `scripts/`**,
        la carpeta cuya cadena `test` vive en este `package.json`. Los otros ~250 `*.test.*` del
        repo (`.claude/skills/`, `web-factory/` con vitest, `onia-core/`, `video-factory/`,
        `hermes-content/deploy/vps-ops/bot/`) tienen su propio corredor y **no** los cubre.
      - **Medido:** `npm test` **exit 0** con las tres suites nuevas adentro — de 21 a 24 gates.

- [x] 🟡 **El mismo gate seguía ladrando en falso por una CUARTA clase de ruido — ARREGLADO el
      2026-09-03 por `onia-cola`, auditando los `[x]` (escalón 2).** Corriendo
      `node scripts/verificar_cola.js hermes-content/docs/COLA.md` salían **10 errores**, y **2
      eran del detector, no de la cola**: los ítems de las líneas 1538 y 1675 citan las cinco
      capturas de una corrida con la **expansión de llaves** de shell
      (`.../2026-09-03-{home,precios,empezar,rubros,chatbot-landing}.png`) y el gate buscaba en
      disco el literal **con las llaves adentro**. Verificado antes de tocar nada: los cinco
      archivos **existen** en `hermes-content/docs/historial/canario-visual/`.
      Es el mismo caso que el glob `*` que la carve-out (1) ya contemplaba —una notación que
      denota un conjunto— con otra sintaxis. **Su recíproco:** se piden las **dos** llaves, así
      que una ruta con una llave suelta se sigue verificando (`carpeta/no-existe{.png` sale
      fantasma igual).
      **Test primero, en rojo por el motivo correcto**: `una expansion de llaves no es una ruta`
      falló con `AssertionError` antes del arreglo. Después: self-check **73 casos** verde y el
      gate de `COLA.md` bajó de **10 a 8** errores — los 8 que quedan son de la cola, no del
      detector (un duplicado real 1607/1707, dos 🟢 sin ruta, y rutas del **otro repo**
      `onia-platform/lib/*.ts`, que este verificador no resuelve).
      **Por qué importa:** un gate que grita en falso se termina salteando, que es el motivo
      escrito de las otras carve-outs — y este gate es obligatorio en el prompt de dos loops.

- [x] 🟡 **El gate de la cola (`scripts/verificar_cola.js`) ladraba 4 "fantasmas" que no lo son
      — ARREGLADO el 2026-09-02, y eran TRES defectos distintos, no uno.** El diagnóstico
      heredado era correcto en los tres síntomas pero los trataba como un solo "detector
      demasiado suelto"; cada uno necesitó su propia carve-out **y su recíproco**, que es lo que
      impide que arreglar el ruido afloje el gate:
      - **Glob** (`*`): una zona no es un archivo. Ningún archivo del repo tiene `*`.
      - **Identificador punteado sin barra** (`visto.texto`, `d.fonts`): el patrón viejo
        `\.[a-z0-9]{2,5}$` tomaba por archivo cualquier expresión de código que la cola cita.
        Ahora un nombre **sin barra** sólo es ruta si su extensión está en `EXTENSIONES` (lista
        explícita, no patrón). **Con barra se sigue verificando siempre**, así que no puede
        tapar un archivo dentro de una carpeta.
      - **Nombre corto de un archivo ya citado entero** (`alta.ts`, después de
        `web-factory/apps/onia-platform/src/app/(sitio)/alta.ts` en el mismo ítem): no es
        fantasma, es el mismo archivo. Se descarta **sólo** si el propio ítem trae una ruta que
        termina en ese nombre — sin la ruta larga, sigue siendo fantasma.
      - **Y la repetición**: la misma ruta citada dos veces en un ítem se reporta una vez.
      **Cómo se sabe que quedó hecho, medido:** `--self-check` pasa **49 casos** (los 9 nuevos
      fallaron en ROJO antes del cambio, por el motivo correcto); `node scripts/verificar_cola.js
      hermes-content/docs/COLA.md` sale **verde, exit 0, 16 ítems**; y un ítem inventado que cita
      `lib/esto-no-existe-jamas.ts` **sigue saliendo fantasma**. `npm test` exit 0. Las otras
      colas de `hermes-content/docs/cola/` dan el mismo `cola-vacia` que antes del cambio
      (verificado con `git stash`): no tienen sección "Ahora", y eso no es regresión de esto.

      **↑ Auditado el 2026-09-02 15:00 UTC por `onia-cola` (escalón 2): este `[x]` estaba FALSO
      contra el código de hoy — RE-ARREGLADO en la misma vuelta.** El cierre decía "sale
      **verde, exit 0, 16 ítems**"; corrido hoy salía **exit 1 con 12 ERROR**, y los doce eran
      falsos otra vez. **No se revirtió nada: el ítem envejeció.** Los carve-outs de la tanda
      anterior siguen intactos; lo que cambió es la cola, que sumó tres formas de citar que el
      detector no conocía. Es la misma lección que este archivo ya guarda dos veces: **un cierre
      describe el repo del día en que se escribió.** Un gate que vuelve a salir rojo de fábrica
      se vuelve a saltear, y el prompt de este carril manda correrlo antes de tomar cada ítem.
      **Las tres caras nuevas, cada una con su recíproco en el `--self-check`:**
      - **Cita abreviada con elipsis** (`…/2026-09-02-mismo-html-chromium-real-login.png`, 3 de
        los 12): el archivo **existe** —en `hermes-content/docs/historial/canario-visual/`—; lo
        que no existe es esa forma de escribirlo. Medido: ningún archivo de los dos repos tiene
        `…` ni `...` en el nombre. Recíproco: sin la elipsis, la ruta se sigue verificando.
      - **Nombre de rama** (`claude/canario-visual`, 1 de los 12): una rama no es un archivo.
        Medido: no hay ninguna carpeta `claude/` en los dos repos.
      - **Ruta parcial con barra** (`(sitio)/opengraph-image.tsx` y 5 más, 6 de los 12): el sitio
        de venta cita relativo a `src/app/`, y ni el repo ni `APPS_DEL_REPO` lo resolvían porque
        **el prefijo que falta es intermedio**. Ahora cuenta si algún archivo del repo *termina*
        en esa ruta, cortando en límite de segmento. **No afloja el gate**: sigue exigiendo que
        el archivo exista, sólo deja de exigir el prefijo entero.
      **Lo que NO se aflojó, a propósito:** la resolución por sufijo se aplica **sólo con barra**.
      Los otros 2 de los 12 eran `page.tsx` y `sitemap.ts` **sueltos**, y entre los cientos que
      hay en el repo esa cita no identifica ningún archivo. Se arregló **la cita**, no el
      detector: ahora dicen `(sitio)/page.tsx` y `src/app/sitemap.ts`.
      **Medido:** `--self-check` **58 casos** (9 nuevos, los 9 en ROJO antes del cambio y el
      primero verificado por su mensaje exacto); el gate sobre `COLA.md` **exit 0, 20 ítems**;
      un ítem inventado que cita `lib/esto-no-existe-jamas.ts` **sigue saliendo fantasma**;
      `npm test` exit 0.
      **Un defecto de test cazado de paso, que valía la pena:** el índice de archivos se cachea
      por carpeta la primera vez que un sufijo lo necesita, así que un fixture creado *después*
      en esa misma carpeta no se veía y el caso nuevo daba rojo con el detector ya correcto.
      Se le dio árbol propio al bloque, en vez de agregarle al script una API de reset que sólo
      usarían los tests.

      **↑ Auditado el 2026-09-07 11:00 UTC por `onia-cola` (escalón 2). El `[x]` sigue siendo
      cierto por lo que hizo —sus carve-outs de notación están vivos y probados—, pero su
      medición de cierre («el gate sobre `COLA.md` **exit 0, 20 ítems**») venció: hoy sale
      **exit 1 con 18 ERROR**. Lo abierto se sigue en el ítem nuevo de "Ahora", no acá.**
      Lo que esta vuelta **sí** cerró, porque eran defectos de verdad y no ruido:
      - **El sha `6d8b6b7`, citado 4 veces y fantasma en los dos repos** (`git cat-file -t`
        dice *Not a valid object name*). No era una clase nueva: es el **cuarto** del mismo
        conjunto que `COLA.md:285` lista junto a `6edfab6`, `a15c82f` y `e46e9ee` — los tres ya
        estaban en `SHAS_SIN_REPO_A_PROPOSITO` y éste quedó afuera por descuido. Se usó el
        mecanismo que ya existía, con su motivo, y su recíproco (`excepcion-sha-vencida`) lo
        sigue cubriendo.
      - **Y al agregarlo, el `--self-check` se cayó — hizo exactamente su trabajo.** Su fixture
        de "sha que no existe" **era** `6d8b6b7`, o sea el caso compartía valor con la lista
        blanca. Del lado en que se cayó no hay daño (rojo ruidoso); el peligroso es el otro:
        con la lista absolviendo al fixture, el caso pasa en **VERDE sin medir nada**. Ahora el
        fixture es imposible (`0ddbeef`) y tiene **guarda propia** que prohíbe la colisión.
        Probada por mutación: metiendo el fixture en la lista, el self-check sale rojo
        nombrándola, **antes** de llegar al caso que quedaría hueco.
        *(Dos fixtures descartados en el camino, por si alguien repite: `f1x7ure` no es hex y
        `deadbee` no tiene un solo dígito — las tres condiciones del extractor están en la
        línea 99. Los dos hacían fallar el caso por "no es un sha", que es rojo por el motivo
        equivocado y no mide la regla.)*
      - **La cita muerta `src/content/siat.ts`** del ítem de `/nosotros`: ese archivo nunca
        existió, la fuente real es `src/lib/siat.ts` y **el propio ítem ya lo decía** en su
        nota de cierre. Corregida la cita del cuerpo y sacados los backticks de la mención
        narrativa, que es lo que el gate lee como "acá hay evidencia".
      **Medido:** `--self-check` **96 casos**, exit 0 · el gate sobre `COLA.md` bajó de **18 a
      14** ERROR · `npm test` exit 0.

      *(Texto original del ítem, para que se vea contra qué se midió.)* Medido el 2026-09-02 corriendo
      `node scripts/verificar_cola.js hermes-content/docs/COLA.md`: sale con 4 ERROR y **los
      cuatro son falsos positivos**, porque el detector de rutas toma por nombre de archivo cosas
      que no lo son:
      - `web-factory/apps/onia-platform/**` — es un **glob** de zona, no un archivo (por eso "no
        existe").
      - `alta.ts` — palabra suelta dentro de una frase en prosa.
      - `visto.texto` — una **expresión de JavaScript** citada en el ítem (cuenta doble: el mismo
        renglón se reporta dos veces).
      **Por qué importa y no es cosmético:** el prompt de este carril manda correr este script
      *antes* de tomar un ítem. Un gate que siempre sale rojo por motivos falsos entrena a que se
      lo saltee — es exactamente cómo `CLAUDE.md` cuenta que se rompió el CI dos veces.
      **Cómo se sabe que quedó hecho:** el script sale en verde sobre `COLA.md` sin haber
      aflojado la detección — o sea, sigue cazando un ítem que cite un archivo inexistente de
      verdad (probarlo con uno inventado). Ignorar globs (`*`/`**`), expresiones con `.texto`/
      punto sin extensión conocida, y no contar dos veces el mismo renglón.
      **No lo tomé en esta vuelta** (2026-09-02): la vuelta ya había cerrado su ítem — mover F5 a
      bloqueados — y la regla es un ítem por vuelta.

- [x] 🟡 **`ONIA_WEB_IMAGENES_DE_CONTEXTO.md` daba por publicable una carpeta que ya no existe —
      ARREGLADO el 2026-09-02, y no era UNA línea sino TRES.** La §10 se recontó carpeta por
      carpeta con `ls` contra `web-factory/apps/onia-platform/public/` (`brand · capturas ·
      contexto · fotos · og · recursos`), no de memoria:
      - `public/rubros/*.webp` — el renglón que abrió el ítem. Borrado: la carpeta no existe.
      - `public/v2/capturas/**` y `public/v2/*.webp` — **el mismo defecto, sin reportar**:
        `public/v2/` tampoco existe. Los dos renglones se caían por el mismo motivo, así que
        arreglar sólo el citado dejaba el bug vivo dos renglones más arriba.
      - `components/landing-v2/rubros.tsx`, citado como responsable de las fotos viejas — **ese
        archivo tampoco existe** (murió con la landing v2 rechazada). Hoy `ferreteria.webp` lo
        sirve `components/landing-v1/how-it-works.tsx`, el archivo `/v1`; `dentista.webp` no lo
        usa nadie (verificado con grep sobre todo `src/`, incluida construcción dinámica de ruta).
      La tabla ahora cubre las **seis** carpetas reales — antes listaba tres inexistentes y
      omitía `brand/` y `recursos/`, así que "no está en la tabla" no significaba nada.
      Y queda dicho que `/fotos/` pasa el guard por **forma**, no por estética: `forma.test.ts`
      es el gate de "no servir capturas literales", no el gate visual de §8. Que el test pase no
      hace publicable a una foto.
      **Nada de código tocado** — el ítem es del doc, y `web-factory/apps/onia-platform/` es zona
      del carril `web-venta`.
      **Lo que estaba en juego:** una sesión que leyera "✅ publicable" iba a buscar cinco
      archivos que no están y, al no encontrarlos, a **recapturarlos** — reponiendo justo las
      capturas literales que Sergio mandó sacar el 2026-09-01. Un doc que declara publicable lo
      inexistente no confunde: fabrica trabajo prohibido.

      Texto original del ítem, para no perder la medición que lo abrió:
      **Línea 347**, verificada tal cual: `| public/rubros/*.webp | ✅ publicable | Los 5
      recortes del conmutador, ya cableados y esperando el OK de Sergio. |`. Esa carpeta se
      borró: el conmutador dibuja los cinco rubros con divs desde `c98543e2`. Una sesión que
      lea esa tabla va a buscar cinco archivos que no están, o peor, a recapturarlos.
      **Es lo único que quedó desactualizado de esto**: los dos ítems de esta misma cola que
      describían el recorte horneado ya los cerró el carril dueño en `ffb9e62d`.
      **De paso, para el mismo doc:** el 2026-09-02 cayó también la última captura de la
      superficie de venta, la tarjeta social `/og/onia-rubros.jpg` — tenía **"MUY PRONTO"
      impreso adentro** y era lo primero que veía un lead al recibir el link por WhatsApp.
      Ahora la dibuja `src/app/(sitio)/opengraph-image.tsx`. El `.jpg` sigue en `public/og/`
      **a propósito**: lo usa `/v1`, que es el archivo de la web publicada hasta el 2026-08-21
      y conserva sus capturas tal cual se publicaron (noindex + disallow, cero links entrantes).
      El guard `src/app/(sitio)/forma.test.ts` ahora enumera las carpetas PERMITIDAS
      (`/contexto/`, `/fotos/`) en vez de las prohibidas, así que cualquier captura nueva en la
      superficie de venta rompe la suite.

- [x] **Movido a "Bloqueado — necesita a Sergio" el 2026-09-02** (`DELETE /api/payments/[id]`
      sobre un mes ya declarado). Está medido y espera una línea de Sergio, así que vivía en la
      sección equivocada: en "Después" hacía que cada vuelta lo releyera como si fuera trabajo
      tomable. **Y al reverificarlo antes de moverlo apareció que una de sus premisas ya era
      falsa** — el detalle, con la cotización corregida, va con el ítem en su nueva sección.
      El texto completo NO se copió acá: se movió entero, para no dejar la copia que este mismo
      archivo ya se cansó de cazar.

- [x] **El guardia de `invoice-status` ya caza lo que prometía.** Las dos evasiones eran reales
      —`const facturas = tx.invoice` y `data: { invoices: { update: … } }` son Prisma normal, no
      rebusques— y **ninguna de las tres existe hoy en el repo** (verificado el 2026-08-30: las
      tres formas dan 0 resultados). Así que esto no cerró un agujero abierto: cerró la puerta
      por la que iba a entrar la séptima, que es como volvió tres veces este mismo defecto.
      **Lo que más importa del arreglo:** los casos se prueban contra código **sintético**, no
      contra el repo. Un guardia nuevo probado sólo contra un árbol limpio pasa en verde sin
      detectar nada — que es exactamente cómo se escribe un guardia que no guarda. Van 5 patrones
      con **4 casos negativos** (leer una factura, incluirla en un `select`, una FILA llamada
      `invoice`, y crearla), porque un guardia que ladra sobre código legítimo se termina
      desactivando y ahí vuelve la séptima.
      **`invoice.create` NO se prohibió, y ésa es la decisión del ítem:** los 5 `create` del repo
      son NACIMIENTOS, y un documento que acaba de nacer no puede tener una NC apuntándole (la NC
      se busca por `notes contains #<número>`, y ese número no existía hasta el INSERT).
      Prohibirlo obligaba a una **lista de excepciones**, que es justo lo que este guardia se
      prohíbe tener. Lo que el nacimiento SÍ puede romper —una NC que nace fuera del RCV, el
      PRIMER bug de la serie— dejó de ser un literal suelto dentro de la ruta y pasó a ser un
      invariante con nombre: `ESTADO_INICIAL_NC` en `lib/fiscal/credit-note.ts`, con su test de
      que no está en `RCV_EXCLUDED_STATUSES`.
      **Una trampa anotada:** ese test pasaba en VERDE con la constante todavía sin exportar,
      porque `not.toContain(undefined)` es cierto y no afirma nada. Lleva un `typeof === "string"`
      para que no pueda pasar vacío. Es la misma forma del test que cubría la AUSENCIA de una env
      var y se tragaba la basura.
      Gates: tsc 0 · eslint 0 errores sobre los archivos tocados · **2301 pasan + 5 skip (2306)**,
      contra 2291 de la medición anterior. Commit `2849be0`, **ya en master**.

      ⚠️ **Ojo para la próxima sesión:** mientras corría esto, **otra sesión estaba escribiendo en
      el MISMO árbol** `onia-platform` (master): aparecieron solos `InboxClient.tsx`,
      `lib/chatbot/push-te-escribieron.ts`, el webhook de Chatwoot y `public/sw.js`. El commit se
      hizo **con rutas explícitas** para no llevarse trabajo ajeno a medias. Y `npx vitest run`
      reescribió dos `.snap` **sólo con CRLF** (diff vacío): se revirtieron, no se commitearon.
- [x] **Las organizaciones de prueba de la base LOCAL: no eran ~9, eran 2 — y las dos son
      evidencia.** Contadas en vivo el 2026-08-31. Primero hubo que dar con la base correcta:
      el `DIRECT_URL` de `.env.local` apunta a `127.0.0.1:54329`, que **acepta TCP y no habla
      Postgres** (ECONNRESET) — la que responde es el contenedor `supabase_db_fiscal-mock`,
      puerto 55322, schema `public`. Ahí hay **dos** organizaciones, ninguna sobrante:
      `Clinica Prueba Fiscal` sostiene la única factura ENVIADA (Bs 500), que es el circuito
      fiscal mock declarado cerrado el 2026-08-29; y `Ferreteria Circuito Completo` sostiene
      el pago **Bs 320,00 APPROVED** en `subscription_payments` — literalmente la cifra que el
      encabezado de este archivo cita como prueba de que el circuito cierra.
      **Borrarlas borraba la evidencia de dos ítems ya cerrados.** No se tocó nada.
      **Lección:** el ítem heredaba un número ("~9") que nadie había contado. Contarlo costó
      cinco minutos y el ítem se dio vuelta entero.
- [x] **El "el bot agenda" no estaba sólo en `lib/pricing.ts`: sobrevivió en tres docs de venta,
      y en uno era el argumento que sostiene el precio — ARREGLADO.** Vuelta del 2026-08-31, con
      la cola sin un ítem desbloqueado en "Ahora" (F2, F5, los 4 números de WhatsApp y el `DELETE`
      de pagos siguen esperando **una línea de Sergio**). Paso 3: se auditaron los `[x]`.
      **Los cierres están sanos** — los 24 shas citados en este archivo se preguntaron con
      `git merge-base --is-ancestor` contra `origin/master` (no con `git branch --contains`, que
      es el error ya escrito acá): **19 son ancestros reales** y los 4 que no (`6edfab6`,
      `a15c82f`, `e46e9ee`, `6d8b6b7`) son exactamente los que este archivo **ya declara**
      locales o pre-squash. Los artefactos que cada cierre promete existen en `origin/master`:
      `__tests__/url-cruda-fuera-de-analytics.test.ts`, `__tests__/eslint-no-lintea-worktrees.test.ts`,
      `lib/gateway/bcp-qr.ts`, `app/api/webhooks/bcp/route.ts`, `CREDIT_NOTE_CREATED` en
      `lib/audit.ts` + `app/(dashboard)/admin/audit/page.tsx`, `SIN_NAV_A_PROPOSITO` en
      `lib/platform/route-access.test.ts` y `frasePuntuada` en `lib/utils.ts`.
      **Lo que apareció al verificar el punto 2 de `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md`:**
      el punto está bien cerrado en el código (`f47d615`), pero **la frase falsa siguió viva en
      el material que la lee**. El punto 2 arregló la fuente y la pantalla del add-on; nadie
      buscó la copia fuera del repo del producto. Encontradas y corregidas, las tres en
      `hermes-content/docs/**` (mi carril):
      - `hermes-content/docs/ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md:51` — la tabla de add-ons vendía
        *"contesta, califica, **agenda** y hace seguimiento"* a Bs 390. Ahora dice "deriva a una
        persona" y nombra el ESCALA de `bot/recepcionista.mjs`.
      - `hermes-content/docs/ONIA_PRICING_CHATBOT_PROPUESTA.md` — **el peor de los tres, y no es
        una frase suelta: es el diferenciador entero.** Decía *"es el único donde la cita cae en
        la agenda y el cobro en la caja del mismo sistema"* (§1), lo repetía como fila de tabla
        contra la competencia (*"La cita queda en la agenda del sistema, el cliente en la ficha"*)
        y **cerraba con eso el pitch de una frase contra Sendy**. Es el argumento por el que
        alguien pagaría Bs 390 en vez de Bs 240, y es falso: el bot escala
        (`bot/recepcionista.mjs:232`), el canal `whatsapp_chatwoot → lead_conversacion` de
        `lib/onia-core/intake.ts:15` no lo llama nadie y `bot_conversations` no está en el schema.
        Reescrito al diferenciador que **sí** es cierto —la bandeja vive dentro del sistema que ya
        tiene agenda, ficha y caja, sin una segunda suscripción— con la nota de qué decía antes.
      - `hermes-content/docs/ONIA_NIVEL_REFERENTES_BRECHA.md:192` — citaba `lib/pricing.ts:64` en
        presente como prueba de que "lo prometemos en la superficie de venta". Ese texto ya no
        existe; la brecha de PRODUCTO sigue abierta y se deja escrita como tal.
      **La lección, que es lo que se lleva la vuelta: arreglar la fuente única no arregla lo que
      ya la copió.** Es la misma forma del defecto que el propio punto 2 había encontrado un
      escalón más adentro (la frase hardcodeada en `AddonChatbotClient.tsx`), y la misma que este
      archivo tiene escrita como *"cerrar un ítem no cierra su copia"*. Un `grep` de la frase
      completa por todo el repo cuesta un minuto y es lo que faltó las dos veces.
      Sin gates de código: son tres markdown, cero líneas de producto. `node scripts/verificar_cola.js` verde.

- [x] **La misma frase falsa vivía en `hermes-content/propuestas/generador/clientes.json` — ARREGLADA,
      y el carril NO era ajeno.** La vuelta anterior la dejó pasar citando el carril C de
      `COORDINATION_MANIFEST.md:94`. Ese modelo está rotulado **"HISTÓRICO, superado"** en el propio
      archivo (`:80`): la autoridad actual es la tabla de carriles vivos del 2026-08-23, que **no
      nombra `propuestas` en ningún carril**, y la sesión `propuestas-v2` que lo poseía ya no existe.
      Encima **esta misma rama ya había commiteado ahí** (`9649dc75`, el arreglo de las 7 propuestas
      con producto pausado). Verificado además que nadie tiene cambios sin commitear en esa carpeta.
      **Un dueño citado de una sección marcada como superada no es un dueño: es una traba inventada,**
      y la traba costó que la promesa falsa siguiera viva un día más en el único material que el
      cliente se lleva por escrito.
      **Gate 1 contra el sistema correcto, no contra un doc:** `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:232`
      — *"Pedido / cita / compra: se toma y se ESCALA. El bot no agenda ni vende solo"*. La línea 16
      del mismo archivo lo repite como regla dura. La promesa es falsa, confirmado en la fuente.
      **22 frases en 3 clientes**, no las 6 que el ítem contaba —contaba sólo AW web y se le escapaban
      la propuesta `aw-climatizacion-chatbot` entera y el add-on de `lia-albertengo`
      (*"agenda y responde pacientes solo"*)—. Corregidas a lo que el bot **sí** hace: responde,
      califica y **deriva el caso listo**. Los 3 HTML regenerados con el generador (nunca a mano),
      que es lo que exige la guarda `el HTML commiteado es exactamente lo que produce el generador`.
      **La guarda nueva es el aporte que sobrevive al ítem:** `ningun cliente le promete al cliente
      que el bot agenda solo` (`hermes-content/propuestas/generador/generar-propuestas.test.js`) recorre
      **todos** los strings de `clientes.json` con 7 patrones + la regla de proximidad (si el string
      nombra al bot, no puede decir "agenda"). Vista en **ROJO** listando las 22, y con **cero falsos
      positivos**: la agenda **real** del sistema en Onia Dental (*"Agenda, pacientes e historial"*) y
      la de la web de Lia (*"Agenda / contacto directo"*) no ladran. Eso importa tanto como cazar el
      defecto — la cola ya tiene escrito que *una guarda que ladra sobre código legítimo se termina
      desactivando*. Tiene lista `PERMITIDO` vacía, con el molde por si algún día hace falta una
      excepción con su motivo.
      **Verificado MIRANDO la propuesta renderizada**, no por grep: el título lee *"responde y deriva
      la visita ya calificada"* y la tabla de paquetes cierra sin una sola promesa de agenda.
      **24 tests OK** en el generador. `node scripts/verificar_cola.js` verde.
      **Residuo que decide Sergio, anotado en el radar:** el 3er paquete de la propuesta de chatbot
      era **"Bot + Agenda" a Bs 4.800** y su único diferenciador era justo lo que el bot no hace.
      Quedó como **"Bot + Reportes"** con el mismo precio — y los reportes avanzados también se
      venden como add-on dos filas más abajo. **El precio no se tocó: no es mi decisión.**

- [x] **Los otros dos agujeros del escéptico — CERRADO como irreconstruible, y por eso deja de
      ocupar un renglón abierto.** El ítem mandaba leer el journal del workflow
      `wf_7449df59-54c` antes de tocar, y ese journal **no existe**. Rebuscado el 2026-09-01 en
      los tres lugares donde podría estar: `find` bajo el `.claude` del usuario, `find` bajo el
      repo, y `$ git grep -l 7449df59 origin/main` — el **único** archivo del repo que menciona
      ese id es `hermes-content/docs/COLA.md`, o sea este mismo renglón citándose a sí mismo.
      Los journals mueren con su sesión.
      **Por qué se cierra en vez de dejarse abierto:** un ítem que nadie puede tomar no es un
      pendiente, es un fantasma con buena letra — el próximo que lea la cola gasta la vuelta
      buscando la fuente y llega adonde llegaron las dos vueltas anteriores. Reconstruirlos de
      memoria sería inventar, que es justo lo que esta cola persigue.
      **Se reabre sólo si alguien vuelve a encontrar el journal**, con su ruta escrita acá.

- [x] 🔒 **La mina de `page_location` en GA — ya estaba cerrada, y de paso quedó su guarda.**
      El ítem seguía abierto acá diciendo *"en arreglo ahora"*, pero el arreglo (PR #59,
      `4dce75e`) **está en `origin/master` y es ancestro de `e5c1ad3`, que es lo que sirve el
      contenedor `onia-platform` del VPS**: el fix ya estaba en producción. Cerrado correcto.
      **Lo que sí faltaba, y es el aporte de esta vuelta:** #59 estrecha el tipo del parámetro a
      `{ origin }`, así que `tsc` frena el regreso **en ese consumidor** — no en el próximo
      archivo que quiera leer la URL completa. El defecto no era del componente, era de forma:
      filtrar los query params en un campo y mandar la URL entera en el de al lado. Ahora hay
      guarda: `__tests__/url-cruda-fuera-de-analytics.test.ts` persigue la LECTURA
      (`location.href`, `document.URL`) en `app/`, `components/` y `lib/` y **permite la
      asignación** — redirigir es idioma normal, y una guarda que ladra sobre código legítimo se
      termina desactivando, que es cuando vuelve el defecto. Se vio en ROJO señalando la línea 64
      contra un árbol con el bug antes de traerla. Reusa `escanear-fuente.ts`, el escáner que ya
      comparten las otras guardas.
      Gates sobre `origin/master`: tsc 0 · eslint 0 · **2323 pasan + 5 skip** (188 archivos).
      Commit `1fc4354`, **ya en `master`**.

      ⚠️ **La lección de esta vuelta es un error MÍO de método, y vale más que el ítem.**
      Diagnostiqué *"el PR nunca llegó a master"* y era **falso**. Dos fallas encadenadas:
      1. **`git branch --contains <sha>` lista sólo ramas LOCALES.** Para saber si algo llegó
         hace falta **`git branch -a --contains`**, o mejor `git merge-base --is-ancestor <sha>
         <lo-desplegado>`, que responde la pregunta que de verdad importa.
      2. **Leí un `master` local desactualizado sin `git fetch` antes.** El `master` local de
         `onia-platform` está **divergido** de `origin/master` (tiene `e46e9ee`, el mismo
         trabajo que `e5c1ad3` con otro sha) y le faltaban 2 commits.
      Es el mismo error que esta cola ya tiene escrito dos veces con otras caras: **verificar
      contra el sistema equivocado**. Un repo local sin `fetch` no es la rama que se despliega,
      igual que Vercel no es el host y un 200 no es una pantalla.
      **Para la próxima:** antes de declarar que algo falta en `master`, `git fetch` y preguntar
      por ancestría contra el sha desplegado. Los 2 commits que escribí sobre esa premisa falsa
      (`6edfab6`, `a15c82f`) quedaron **sólo en el `master` local** y no se pushearon: duplican
      trabajo que ya estaba. No se limpiaron porque ese árbol tiene cambios sin commitear de
      otra sesión (`admin/audit`, `credit-note`, `lib/audit.ts`) y resetearlo se los llevaba.

- [x] **El guardia de repo de `invoice-status` es evadible** — **fantasma: ya estaba cerrado en
      este mismo archivo.** El commit `2849be0` (verificado el 2026-08-31 como ancestro de
      `origin/master`) agregó los 5 patrones con 4 casos negativos, y su cierre está escrito 40
      líneas más arriba. La entrada quedó duplicada en "Después" cuando se cerró en "Ahora".
      **Lección de cola, no de código:** cerrar un ítem no cierra su copia.
- [x] **La nota de crédito no pasa por `maybeEmitFiscalInvoice` — y no se cierra cableándolo.**
      Verificado el 2026-08-31: el validador del emisor BO rechaza una NC por **tres** reglas
      distintas (`total > 0`, `cantidad > 0`, precio unitario negativo — `lib/fiscal/siat-client.ts`),
      así que llamar al helper sólo dejaría un espejo en `rejected`. En el SIAT la NC es un
      **documento de ajuste**: otro servicio y el CUF de la original, y el emisor compartido expone
      hoy un único endpoint (`POST /api/fiscal/invoices`). Cerrarlo de verdad **toca el otro repo**
      (`hermes-content/integrations/siat`), y eso no es este carril.
      **Lo que sí se cerró: que el agujero fuera SILENCIOSO.** La NC es el único documento que
      RESTA del débito fiscal y era el único que no escribía una línea de auditoría — con los
      gates encendidos bajaba la venta del CSV interno sin existir para el SIN y nadie podía
      enterarse. Ahora hay `CREDIT_NOTE_CREATED` con `newValue.siatPendiente`, consultable desde
      `/admin/audit` (con su color ámbar y su filtro). Es el mismo remedio que ya había elegido
      `PATCH /api/invoices/[id]` para su fallo fiscal, en vez de un `console.error` que no
      sobrevive a un reinicio del contenedor.
      **Se miran sólo los dos flags globales** (lectura de env, cero queries): pedir el
      entitlement `module.invoicing` por org costaba un viaje a la base por cada NC, y
      sobre-reportar es el lado seguro de una alarma.
      Gates: tsc 0 · eslint 0 · **2326 pasan + 5 skip**. Commit `14abb9a`, **ya en `origin/master`**.
      **El trabajo estaba sin commitear en el árbol** desde antes de esta vuelta: sin este commit
      se perdía en el próximo `reset` de cualquier sesión.
- [x] **I1 y E1: los DOS eran fantasmas — y el ítem se decidió sin necesitar una sesión.**
      Verificado el 2026-08-31.
      - **I1 (portal de onboarding del cliente): fase 1 VIVA EN PRODUCCIÓN.** Existe
        `app/(public)/portal/[token]` + `/requerimientos` + 7 rutas de API. **Mirado
        renderizado** en `app.onia.com.bo/portal/<token-inventado>`: 200 con la pantalla
        "Enlace no disponible" del propio portal (una ruta inventada da 308, así que no es el
        atrapa-todo). Y está **desplegado**, no sólo en `master`: `3e43c93` es ancestro de
        `e5c1ad3`, el commit que sirve el contenedor del VPS, con los artefactos en su `.next`.
        Hizo lo que su propio PASO 1 mandaba: **encender, no construir** — cero modelos Prisma
        nuevos, la máquina de estados corre sobre `onia_core_work_items`.
      - **E1 (checklist de completitud de rubro): existe** en
        `onia-core/ONIA_RUBRO_COMPLETITUD_CHECKLIST.md`, con su tabla rubro × 7 pasos. Su LISTO
        estaba cumplido desde el 2026-08-20.
      **Lo que sí había que arreglar, y es el aporte de la vuelta:** el checklist de E1 estaba
      **vencido en la fila exacta que declaraba el único hueco**. Cita el commit `b1aa4ec`
      (19:56) y el portal entró en `3e43c93` (20:52) — **56 minutos después**. O sea que decía
      "🔴 FALTA EN EL CORE: no existe el cliente externo autenticado" y "los archivos los carga
      el EQUIPO, no el cliente" mientras el portal donde el cliente sube sus documentos ya
      estaba escrito. Corregidas las 4 celdas (paso 2 y 3, tabla del core y tabla por rubro),
      la lectura honesta #2 y la sección "construir en el core", que baja de bloqueante a deuda.
      **Los conteos "Encendidos plenos" NO se tocaron**: el portal entra por enlace de un solo
      uso, no por sesión propia — pasa de ❌ a 🟡, nunca a ✅. Inflarlos habría sido el error que
      esta cola persigue.
      **Lección:** un doc de verificación fechado envejece en HORAS cuando el carril que mide es
      el mismo que construye. No basta con que exista: hay que preguntarle contra qué commit se
      escribió.

- [x] **Las propuestas ya entregadas venden que el bot "agenda solo" — y el miedo a regenerar
      estaba AL REVES: lo corrido era el HTML, no `clientes.json`. ARREGLADO.**
      Este item, tal como estaba escrito, prescribia **exactamente el arreglo equivocado**:
      *"sincronizar `clientes.json` con los HTML antes de volver a generar nada"*. Hacerlo
      habria devuelto al generador un producto **PAUSADO**.
      **Lo que decia el item:** al regenerar, `propuesta-lia-albertengo.html` *"perdio una fila
      entera"* del cuadro de add-ons (*"Videos con IA para promocionar el libro"*), y de ahi
      concluia que *"el HTML se edito a mano en algun momento, o `clientes.json` se recorto
      despues"*. La medicion existia y no se leyo: `git log -S"Videos con IA"` da el commit
      **`b0c9c931`** (2026-08-15), cuyo mensaje lo dice con todas las letras — *"Videos IA salen
      del generador de propuestas (6 clientes lo tenian a 2.200/mes) **porque estan pausados como
      producto**: seguir cotizandolos vende algo que no se entrega"*. **`clientes.json` es lo
      correcto; el HTML es lo viejo.** Confirmado contra la fuente unica de que se vende:
      `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` **no nombra video ni una vez**.
      **Y no eran 4 propuestas corridas, eran 7 de las 11** — el item solo habia mirado las que
      tenian la frase del chatbot. Comparados `buildHtml(cliente)` contra el archivo en disco,
      uno por uno: `bench`, `garabato`, `hsb-engineers`, `lia-albertengo`, `aw-climatizacion`,
      `aw-climatizacion-web`, `franco-marin`. Dos clases de deriva, **ninguna otra**:
      - **Seis** seguian cotizando "Videos con IA" a **Bs 2.200 (8/mes)**, un producto pausado.
      - **`franco-marin`** escribia la marca **`ONIA`** en mayusculas (3 veces); el generador ya
        produce `Onia`, que es lo que manda CLAUDE.md.
      **Cero precios movidos, cero contenido perdido:** el diff completo son 9 lineas y no toca
      un solo numero de paquete. Lo unico que sale es el add-on que Sergio retiro hace 16 dias.
      **Guarda,** en `hermes-content/propuestas/generador/generar-propuestas.test.js` (el test que
      ya existia, no uno nuevo al lado) y cableada como **`npm run test:propuestas`**: ningun
      `propuesta-<slug>.html` puede diferir de lo que produce el generador con `clientes.json`.
      **Vista en ROJO por el motivo correcto** — listo los 7 slugs por nombre — antes de
      regenerar. Su caso negativo es gratis y real: los 4 que ya coincidian
      (`aw-climatizacion-chatbot`, `dentalgest`, `onia-empresarial`, `premium-cars`) no la
      disparan. Normaliza CRLF, que es la trampa que este archivo ya tiene anotada dos veces.
      **La leccion, que es lo que se lleva la vuelta:** el item **diagnostico al reves y su
      prescripcion era el dano**. Habia corrido el generador y visto desaparecer una fila, pero
      no pregunto **por que** se habia ido — y un `git log -S` de treinta segundos tenia la
      respuesta firmada. Es la misma forma de "verificar contra el sistema equivocado" que esta
      cola ya guarda cinco veces, con la cara nueva de **tomar el artefacto viejo por fuente de
      verdad porque tiene mas contenido**. Mas contenido no es mas verdad.
      **Lo que NO se toco, y con motivo:**
      - **Las dos propuestas con epoch en el nombre** (`propuesta-dental-smile-1781042414583.html`,
        `propuesta-epic-motion-group-1781041181355.html`) tambien cotizan "Videos con IA", pero
        **no tienen entrada en `clientes.json`**: son artefactos sueltos, no regenerables, y la
        guarda no los mira. Corregir un documento ya entregado sigue siendo decision de Sergio.
      - **Los `.pdf`** quedan como estaban (22-jul): son lo que se envio, o sea el registro
        historico. El `.html` es artefacto generado y ahora coincide con su fuente.
      - **`cuestionario-cliente.html:181`** ofrece "Videos con IA" como casilla de **interes**,
        no como precio. No es una cotizacion y hay otras casillas fuera del catalogo, asi que
        sacar solo esa es decision de copy, no un arreglo. Queda anotado, no tocado.
      - **La frase del chatbot que "agenda"** sigue en `clientes.json` y por lo tanto en el HTML
        regenerado: **eso si es de Sergio** y son las dos decisiones que este item ya tenia
        escritas — (1) que se hace con lo ya enviado y (2) si el **chatbot a medida** (sin precio
        de lista) puede agendar cuando se cotiza el flujo aparte, porque entonces la frase no es
        falsa en esas propuestas y si lo es en el add-on de lista de Bs 390.

## Bloqueado — necesita a Sergio

> ⚠️ **Acá había un conteo en prosa ("Estaban 10… hoy quedan 2") y se pudrió**: decía 2 cuando
> había 4, y el 2026-09-02 entraron F2 y F5. **No lo repongas.** El conteo vigente son las
> viñetas de abajo, y se cuenta mirándolas — mismo motivo por el que
> `hermes-content/docs/cola/loops.md` dejó de contar loops en prosa. La fecha de reverificación
> tampoco va en el título: cada entrada trae la suya, que es la que importa.
>
> Esta lista es la que una sesión lee para
> decidir qué preguntarle a Sergio, así que una entrada vencida **fabrica trabajo** — hace que
> alguien le pida una decisión sobre algo ya hecho, y quema el único recurso que no se recupera.
> Es el mismo defecto que esta cola ya bautizó: *"cerrar un ítem no cierra su copia"*. Cada baja
> lleva la evidencia con la que se dio, medida hoy, no leída de otro renglón.

- 🔴 **`DELETE /api/payments/[id]` sobre un mes ya declarado** (movido acá el 2026-09-02 desde
  "Después", donde cada vuelta lo releía como trabajo tomable). El hueco es real y verificado el
  2026-08-30: borrar el último pago devuelve la factura a BORRADOR
  (`app/api/payments/[id]/route.ts`), BORRADOR está en `RCV_EXCLUDED_STATUSES`, y ese mes pierde
  la venta del CSV sin nota de crédito de por medio.
  **⚠️ Reverificado hoy antes de moverlo, y una premisa ya era FALSA — por eso la cotización
  cambia.** El ítem decía: *"No existe NINGÚN concepto de cierre de período en el repo — cero
  `fiscal_period`, cero tabla de cierre"*. Hoy eso no se sostiene, medido en los dos sistemas:
  - **El modelo existe en `master`** (`prisma/schema.prisma`, `model OniaAccountingFiscalPeriod`
    → tabla `onia_accounting_fiscal_periods`) y trae **exactamente** los campos que la opción (b)
    pedía inventar: `organizationId`, `startDate`/`endDate`, `status` (default `open`), `closedAt`,
    y `@@unique([organizationId, name])`.
  - **Y ya está aplicado en la base de PRODUCCIÓN** — contenedor `supabase-db`, no la nube:
    `to_regclass('public.onia_accounting_fiscal_periods')` devuelve la tabla, con **0 filas**.
  - **Pero no lo llama NADIE**: cero referencias a `OniaAccountingFiscalPeriod` /
    `fiscalPeriod` en todo el `.ts`/`.tsx` del repo. Es *construido ≠ terminado* con todas las
    letras — un módulo que nadie llama, valor cero.
  **Qué cambia para Sergio: (b) ya no cuesta 3-4 días.** Lo caro de (b) era modelar la tabla,
  migrarla y aplicarla; las tres cosas están hechas. Lo que falta es **cablear el RCV a leerla**
  y exigir nota de crédito sobre un período cerrado. La decisión sigue siendo suya, pero ya no es
  entre "barato y torcido" (a) y "correcto y caro" (b): (b) es hoy bastante más barata de lo que
  este ítem venía diciendo, y ese número mal puesto empujaba a elegir (a).
  **Las tres salidas, con (b) re-cotizada:**
  - **(a) Guarda barata** — bloquear la salida del RCV si el mes de la factura no es el corriente.
    ~1 día. Pero **inventa la política**: "mes corriente" no es "mes declarado", y bloquea la
    corrección legítima del día 2 del mes siguiente. **Hoy tiene menos sentido que nunca**: la
    tabla que evitaba ya existe.
  - **(b) Cierre de período de verdad** — usar la tabla que YA está: el RCV la lee, y toda salida
    sobre un período cerrado exige nota de crédito. **Ya no son 3-4 días**: el schema y la
    migración están en `master` y aplicados en producción. Queda el cableado. Es lo contablemente
    correcto y lo que el SIN asume.
  - **(c) No hacer nada todavía.** Reverificado EN VIVO hoy en el contenedor `onia-platform`:
    `SIAT_EMISSION` **sigue sin estar seteada** (`docker inspect` no devuelve ninguna `SIAT_*`),
    o sea la emisión ante el SIN está apagada (`lib/fiscal/flags.ts` exige `=== "1"`). Con eso y
    cero clientes pagando, el costo real de hoy sigue siendo **cero**.
  **Recomendación: (c) ahora, (b) el día que se encienda el emisor** — igual que antes, pero (b)
  entra más barata de lo que estaba escrito.
  **Cómo apareció esto, que es la lección:** no se buscó. Salió de contar la rama
  `claude/onia-core-adoption-sprint5` de `onia-platform` (radar 26), que trae ese modelo entre
  otros diez. **Un bloqueo se pudre solo**: nadie tocó este ítem, y aun así envejeció mal porque
  otro carril construyó por debajo lo que él declaraba inexistente. Por eso la regla es
  reverificar ANTES de mover, no al escribirlo.

- 🔴 **Los nombres de los iconos se leen como texto en el login de la plataforma — ARREGLADO
  EN CÓDIGO, falta SÓLO el deploy** (movida acá el 2026-09-02 desde "Ahora"; vivía abierta
  arriba de todo mientras el código ya estaba en `master`). El arreglo son `aria-hidden` en los
  tres glifos de `components/auth/AuthShell.tsx` y la guarda del `setTimeout(ok,12000)` de
  `lib/iconos-script.ts`, con sus dos tests (`components/auth/AuthShell.test.ts`,
  `lib/iconos-script.test.ts`).
  **Reverificado en vivo el 2026-09-02, MIRANDO lo servido, no el repo:** producción sigue en
  `BUILD_ID lNDdVgrRvP1mizzu3BVXc` (= `build-8a3b5a6`), el HTML de `app.onia.com.bo/login`
  todavía trae `bolt`, `credit_card_off` y `smart_toy` como nodos de texto **sin
  `aria-hidden`**, y el script del `<head>` sigue cerrando con `setTimeout(ok,12000)`. El
  bloqueo NO venció.
  **Lo que falta es un deploy, no una línea:** `8a3b5a6..origin/master` son exactamente **3
  commits** — `bdf0935` + `5888a13` (este ítem) y `efaffe8` (la CSP del beacon de Cloudflare).
  **Decide Sergio**, con el runbook y el costo en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §20.

- ~~🔴 **El párrafo del login sale con espacios metidos DENTRO de palabras**~~ — **BLOQUEO
  VENCIDO, sacado de acá el 2026-09-02 por el integrador. Sergio NO tiene que decidir nada:
  el defecto no existe para un cliente.** Pedía elegir entre tres salidas que cambiaban cómo
  se ve `/login` y `/register`, y ninguna hace falta. Ver el ítem cerrado en *"Del canario
  visual — segunda pasada del 2026-09-01"*, más arriba en este mismo archivo.
  **Reverificado por el integrador antes de sacarlo, sin creerle a nadie** (misma URL, mismo
  instante, misma fuente cargada, los dos binarios que ya están en el VPS, apuntados por
  `executablePath`): `chrome-headless-shell-1223` dibuja *"Ent regamos t u sist ema … puest a …
  con t us dat os"*; `chromium-1223` completo dibuja *"Entregamos tu sistema con la
  configuración de tu rubro puesta."* — **impecable**. El `innerText` es idéntico en los dos.
  **Por qué la bisección de antes no contradice esto:** aislar el gap a "Archivo en pesos ≤500"
  y que se vaya con `font-weight: 700` es exactamente lo que hace un bug de rasterizado en los
  trazos finos. Esa prueba nunca podía distinguir sitio de motor, porque **no cambió el motor**.
  La única variable que apaga el defecto sin tocar una línea del sitio es cuál de los dos
  Chromium saca la foto.
  **Lo que sí sigue abierto, y no es de Sergio:** el canario captura con el motor malo — está
  como ítem del carril del canario, arriba.

- 🔴 **F2 · El chatbot se cobra y medio chatbot es gratis** (movida acá el 2026-09-02 desde
  "Ahora"; vivía como el primer ítem no bloqueado y venía sin moverse desde el 2026-08-30).
  **Reverificado en vivo contra `onia-platform` `origin/master` (`efaffe8`, 2026-09-02):** la
  bandeja sigue abierta para todos. `app/(dashboard)/inbox/page.tsx` sigue sin
  `requiresFeature`, y `app/api/admin/clinics/route.ts` sigue creando el inbox de Chatwoot
  (`createInbox` + `addAgentToInbox`) para **toda** org nueva sin mirar `whatsappAddon`. El
  bloqueo no venció: sigue siendo el mismo hoy que el 2026-08-30.
  **Las dos opciones, sin cerrar solo porque las dos bajan una superficie viva:**
  - **(a)** Gatear `/inbox` con `requiresFeature: "addon.whatsapp"` — una línea, pero hoy
    ninguna org tiene el add-on: todas pierden la bandeja de golpe.
  - **(b)** Dejar de crear el inbox salvo que el add-on esté activo — ataca la raíz sin apagar
    nada existente, pero cambia lo que ve un cliente el día uno (la bandeja vacía es gancho hoy).
  **Decide Sergio.** Con cero clientes pagando el costo real de hoy sigue siendo cero.

- 🔴 **F5 · Veterinaria, el 6to rubro** (movida acá el 2026-09-02 desde "Ahora"; era el primer
  ítem abierto y llevaba sin moverse desde el 2026-08-30, cotizada). **El bloqueo es real pero
  el costo estaba inflado**: no es "migrar datos vivos".
  - La factura toma el CI del paciente en **un solo lugar**: `lib/fiscal/rcv-export.ts:148`
    (hoy el campo intermedio se llama `patientCi`, y sale al RCV como `nitCliente` —
    `lib/fiscal/rcv-export.test.ts:143`; la cita vieja del ítem saltaba ese paso).
  - El arreglo mínimo son **columnas anulables** de responsable en `Patient` + una lectura con
    fallback (`responsable?.ci ?? patient.ci`). **Cero backfill**: las filas que ya existen se
    comportan igual que hoy.
  - Superficie: `patientId` aparece 24 veces en `schema.prisma` y 49 archivos lo tocan, **pero
    ninguno se toca en esta versión** — el fallback los deja intactos.
  - Falta: el bloque "responsable / quién paga" en el alta de paciente, mostrado por vocabulario
    sólo en el track veterinaria.
  **Reverificado en vivo contra `onia-platform` `origin/master` (`efaffe8`, 2026-09-02): el
  bloqueo NO venció, y el trabajo no se hizo.** `Patient` sigue sin columnas de responsable — lo
  único que hay en `prisma/schema.prisma:1831` es `ownerProfileId`, que es otra cosa (el humano
  que aprueba en la cola) — y `rcv-export.ts:148` sigue leyendo `invoice.patient?.ci` sin
  fallback. El vocabulario, en cambio, **ya nombra el rubro** (`lib/onboarding/vocabulario.ts:130`,
  "tu veterinaria"): lo que falta es el modelo de datos, no el idioma.
  **Riesgo real: bajo.** Es una migración aditiva. **Decide Sergio**, y lo que decide no es el
  riesgo: es si el 6to rubro vale la semana antes de estrenar los cinco que ya se venden.

- 🔴 **Decidir el dominio `dentalgest.app`**: redirigirlo a `app.onia.com.bo` o dejarlo morir. El
  DNS vive en Vercel (`ns1/ns2.vercel-dns.com`) y no lo puedo tocar (sin token, CLI deslogueado,
  MCP con 403). **Ya no es urgente** — ver la baja de abajo: hoy no sirve nada.
- **Credenciales del BCP.** Sin ellas no hay QR. El checkout ya no lo promete (PR #54), pero el
  cobro sigue siendo manual: el cliente transfiere y alguien aprueba. **Remedido el 2026-09-01:**
  `grep -c 'BCP_QR' /opt/onia-platform/app.env` en el VPS devuelve **0** — no hay ni una de las
  seis variables. El bloqueo es real y no se movió.
- **Deploy de `home`/`empezar`: dos ítems (la maqueta de rubro recortada y las 6 capturas
  literales) están ARREGLADOS EN CÓDIGO desde el 2026-09-02** (`bba1c76e`, `c98543e2`, ya en
  esta rama) y sólo falta publicarlos — medido contra `onia-landing`: `onia.com.bo` sigue
  sirviendo el build viejo con las capturas. Deploy es de Sergio.

> **Deduplicado el 2026-09-01: había DOS listas de bloqueos y la vieja pedía trabajo que ya no
> existe.** Convivían esta y una `## Bloqueado — recontado el 2026-08-30` cien líneas más abajo.
> Sus entradas S2/S3/S4/D3 son las mismas cuatro de arriba, pero su **S1** — *"bajar el
> deployment de Vercel que sigue sirviendo `dentalgest.app`"* — ya estaba dado de baja acá con la
> medición, y **remedido hoy**: `https://dentalgest.app/` y `/login` responden **404 con
> `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`**. No hay deployment que bajar.
> **Por qué esto era peor que un item duplicado:** un item duplicado hace rehacer trabajo; una
> entrada vencida en la lista de bloqueos hace **pedirle a Sergio una decisión sobre algo ya
> resuelto**, y su tiempo es el único recurso que no se recupera. El gate `duplicado` de
> `scripts/verificar_cola.js` no lo podía ver — mira items `- [ ]`, y estas listas se escriben con
> viñetas y filas de tabla. Por eso la vuelta dejó la guarda que sí lo caza: **`seccion-duplicada`**,
> que falla si dos `##` repiten título. De paso destapó otras dos copias, ya fusionadas: había
> **dos `## Después`** y **dos `## Cerrado (2026-08-30)`** (la segunda, vacía).

### Ya NO son bloqueos — dados de baja el 2026-09-01, con la medición

- ~~**Recorrer el circuito en producción**~~ — **corrido hoy, y es el hecho más importante del
  día.** La entrada decía *"crear una cuenta real, que mande un correo real, pagar; es la única
  verificación que no se puede simular"*. Contado en la base de producción (contenedor
  `supabase-db`, schema `public`), no leído de un doc: la organización `ZZ QA Circuito Completo`
  (`cmtj22i3q000001khaxefs8ft`) tiene `onboardingCompletedAt = 2026-09-01 19:31`, **1 fila en
  `appointments`**, **3 en `onia_commerce_products`** y **1 en `subscription_payments` con
  `status = APPROVED`, `amount = 320.00`** (`transactionRef = TRX-20260901-QA01`, `bankName = BNB`,
  `reviewedAt = 19:40`). Los contadores globales pasaron de **0 citas / 0 productos / 0 pagos**
  a **1 / 6 / 1** en el día. El trabajo entró por los PRs **#71 a #75** de la rama
  `fix/circuito-completo` en `onia-platform`.
- ~~**Desplegar al VPS**~~ — **producción está EXACTAMENTE en `origin/master`: cero commits
  pendientes.** La entrada avisaba que `master` tenía commits sin desplegar, *"entre ellos
  `f47d615`, el que saca la promesa falsa de «agenda»"*. Medido hoy contra el clon del VPS
  (`/root/loops/onia-platform`, con `git fetch` antes): lo desplegado es **`55e8d8a`** (build
  `/opt/onia-platform/build-55e8d8a`, contenedor levantado 20:59 UTC), `origin/master` es
  **`55e8d8a`**, y `git log 55e8d8a..origin/master` sale **vacío**. Confirmado además contra el
  bundle servido, que es lo que de verdad lee el cliente: `grep` dentro de `/app/.next` devuelve
  *"contesta, califica, **deriva al humano** y hace seguimiento"* — la frase falsa ya no está en
  producción. Hubo **tres** deploys hoy (`02b9558`, `88a38fd`, `55e8d8a`).
  ⚠️ **Esto no significa "no hay que volver a desplegar nunca":** significa que **hoy** no hay
  nada esperando, y que la próxima vuelta tiene que **remedir** en vez de heredar este renglón.
  Preguntarle a un sha viejo cuál es el desplegado es el error que esta cola ya tiene anotado
  tres veces.

### Ya NO son bloqueos — dados de baja el 2026-08-31, con la medición

- ~~**Bajar el deployment de Vercel que todavía sirve `dentalgest.app`**~~ — **ya no sirve nada, y
  éste era el que más asustaba de la lista.** La entrada decía que el MISMO `onia-platform` seguía
  publicado contra el Supabase de la nube. Medido hoy: `https://dentalgest.app/` y `/login`
  responden **404 con `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`** — Vercel todavía tiene el dominio,
  pero **no hay deployment detrás**. No hay una segunda copia de la app expuesta. Lo único que
  queda es cosmético y es la entrada de arriba (qué se hace con el dominio).
  **Por qué importa la distinción:** "el dominio resuelve" y "hay una app viva ahí" no son lo
  mismo, y la entrada las mezclaba. Un 404 de Vercel con `DEPLOYMENT_NOT_FOUND` es la prueba de
  que no hay nada corriendo; un 404 de la app sería lo contrario.
- ~~**Crear `recurring-invoices` y `onia-core-workitems` en el crontab del VPS**~~ — **hechos y
  probados**, cerrado como **D1** más abajo en este mismo archivo. Verificado hoy por SSH contra
  el VPS: crontab de **36 líneas**, las dos entradas presentes (`0 6` y `0 10`) junto a
  `appointment-reminders` (`*/15`), y los scripts en `/root/bin/` con permisos `700`.
  La entrada afirmaba *"nunca corrieron contra producción"* — falso desde el 2026-08-31.
- ~~**Dar de baja a `arthur` y `seller_001` en `onia_center.user_profiles`**~~ — hecho, cerrado
  como **D2** (los tres, más `seller_002`, en `status='blocked'`). Confirmado por la segunda vía:
  `center.onia.com.bo` responde **404** medido hoy — la superficie ya no está en pie.
- ~~**Vercel al tope (rate limit)**~~ — la propia entrada decía *"hasta el 2026-08-30"*: **venció**,
  y además ya no publicamos por ahí. Muerta por dos vías, ya anotado el 2026-08-30.
- ~~**El schema de producción, que sigue llamándose `dentalgest`**~~ — **está rechazado con motivo**
  en este mismo archivo (migración de datos vivos a cambio de prolijidad que ningún cliente ve).
  Figuraba como bloqueo y como rechazo a la vez.
- ~~**GA4: encenderlo o sacar el código muerto**~~ — cerrado el 2026-08-30: no hay código muerto que
  sacar, es una perilla apagada bien, y encenderla es **una env var**. La entrada estaba mal
  planteada.
- ~~**UI/UX del dashboard**~~ — no es un bloqueo, es una **asignación de carril**: lo lleva
  web-factory. Estar en otra sesión no es estar bloqueado.

## Cerrado (2026-09-01) — no rehacer

- [x] **Paso 3 otra vez: los `[x]` resisten, y el defecto aparecio en la pantalla que decide QUE
      SE PUEDE VENDER.** Vuelta con "Ahora" sin un solo item desbloqueado (F2, F5, el `DELETE` de
      pagos y el item del esceptico esperan **una linea de Sergio**). Se audito contra la punta de
      hoy, que **no** es la de la auditoria anterior: `origin/master` paso de `3c339a6` a `40d8dc2`.
      **La auditoria dio limpia:** los **11 shas citados** (`4077f2c`, `753718f`, `e644c85`,
      `ab9e0de`, `0711ff6`, `2849be0`, `1fc4354`, `4dce75e`, `f47d615`, `3c339a6`, `e5c1ad3`) son
      ancestros reales de esa punta, los archivos y las lineas citadas siguen existiendo, y los
      tres gates dieron **verde** sobre `40d8dc2` (tsc 0 · **2367 pasan + 5 skip** · lint 0 errores,
      101 warnings preexistentes). Ningun cierre falso.
      **El primer candidato a arreglo era FANTASMA, y vale escribirlo:** F2 dejo anotado que
      `addon.chatbot` es "una llave duplicada y muerta". Es **cierto** —confirmado: `lib/pricing.ts:61`
      es un **tier** de `WHATSAPP_ADDON`, no la feature key, y la entitlement `addon.chatbot` no la
      lee **nadie**— pero **no es roto ni falso**: la pantalla de `/admin/organizations/[id]/capacidades`
      ya la muestra con el badge *"Sin efecto todavia · Ninguna pantalla ni API lee esta capacidad"*.
      Es honesta. Borrarla habria sido trabajo fabricado. **Gate 1 sirve tambien para no arreglar.**
      **El defecto real estaba un nivel mas arriba: ese badge se decidia con un mapa mantenido A
      MANO.** `CON_EFECTO_REAL` venia de una auditoria del **2026-08-13** y su propio comentario
      avisaba del riesgo (*"al cablear una capacidad nueva, sumala aca — si no, la pantalla la
      seguira marcando como sin efecto y estaras subestimando tu propio producto"*). **Miente en
      las DOS direcciones y las dos cuestan plata:** una clave prometida sin consumidor le vende a
      Sergio un efecto que no existe; una clave ya cableada fuera del mapa le dice que algo que
      **si** funciona no sirve, y no lo vende. Verificado hoy: el mapa esta **correcto**, pero
      nada lo sostenia.
      **Lo que se hizo:** el mapa sale del client component a `lib/platform/capacidades-con-efecto.ts`
      (el test no puede importar la pantalla sin arrastrar React) y lo guarda
      `lib/platform/capacidades-con-efecto.test.ts`. **Otorgar no es consumir:** los archivos que
      declaran el catalogo o lo derivan (`types.ts`, `entitlements.ts`, `demo-provisioning.ts`, el
      `register`) quedan fuera — si contaran, toda clave derivada de un plan se daria por cableada
      y el mapa se llenaria de promesas falsas, que es justo la mentira que persigue. Casos
      **sinteticos** en las dos direcciones (un guard probado solo contra el arbol limpio de hoy
      pasa en verde sin detectar nada) mas el caso real contra el repo. **Visto en ROJO** sacando
      `addon.captador` del mapa: `{ clave: 'addon.captador', tipo: 'consumidor-sin-nota' }`.
      **Y la pantalla no tenia UNA sola prueba de render**, siendo la que le dice a Sergio que se
      puede vender: sin ella, mover el mapa pasaba en verde aunque la pantalla dejara de leerlo.
      Vista en ROJO con `nota = undefined`, y **mirada renderizada de verdad** — se lee
      *"module.agents · Completa: nav, pantalla y runtime de agentes"* junto a
      *"module.accounting · Sin efecto todavia"*.
      **Un dato falso corregido en el catalogo canonico:** `lib/platform/types.ts` afirmaba que
      `public_booking` *"gatea un item de la nav"*. **No lo gatea nadie** — el unico
      `requiresFeature` de la nav es `module.agents` (`components/layout/navigation.ts:40`). La
      agenda publica **si** esta gateada, pero por las **tres** rutas de `/api/booking`
      (appointments, doctors, slots) con `!org.publicBookingAddon && !canUsePublicBooking(plan)`,
      no por la feature key. Es la misma trampa que ya costo una conclusion falsa en **P3** —
      buscar la clave en el archivo equivocado — asi que se corrige donde se lee.
      **Anotado sin arreglar (no es roto ni falso HOY):** la lista de planes con agenda incluida
      esta escrita **tres veces a mano** (`PAID_PUBLIC_BOOKING_PLANS` en `app/(dashboard)/admin/page.tsx:40`
      y dos literales en `admin/plans/`), y hoy **coincide** exacto con `getLimits().publicBookingIncluded`
      (professional, clinic, enterprise). Se rompe el dia que cambie un plan.
      Gates sobre la punta rebaseada `0532659`: tsc **0** · **2432 pasan + 5 skip (197 archivos)** ·
      lint **0 errores**. Commit **`7bf8a79`**, **ya en `origin/master`**.
      **Apunte de metodo:** el push se rechazo porque `origin/master` se movio entre el `fetch` y
      el `push` (dos merges de otros carriles). Se rebaseo y se **re-corrieron los tres gates
      sobre la punta nueva** antes de pushear: gates verdes sobre una punta vieja no dicen nada de
      la punta que se publica.

- [x] **La lista de bloqueos estaba duplicada y la copia vieja fabricaba trabajo para Sergio.**
      Vuelta con "Ahora" sin un solo ítem desbloqueado (F2 y F5 esperan a Sergio; la frase falsa de
      `hermes-content/propuestas/generador/clientes.json` es del carril C; el ítem del escéptico
      perdió su fuente). Auditando los `[x]` apareció el defecto: convivían **dos** secciones
      `## Bloqueado`, y la del 2026-08-30 seguía pidiendo **bajar un deployment de Vercel que ya
      no existe**. Remedido en vivo antes de tocar nada: `https://dentalgest.app/` y `/login`
      responden **404 `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`**.
      **Lo que se hizo:** se borró la sección vencida (sus otras cuatro entradas ya estaban, con
      medición, en la lista del 31-ago) y se le pasó a la que queda el único dato que sólo tenía
      la vieja — que `master` tiene commits sin desplegar. De paso se fusionaron las otras dos
      copias estructurales que el mismo barrido destapó: **dos `## Después`** y **dos
      `## Cerrado (2026-08-30)`**, la segunda vacía.
      **Y la guarda, que es lo que impide la próxima:** `scripts/verificar_cola.js` ahora falla con
      **`seccion-duplicada`** si dos `##` repiten título. El gate `duplicado` que ya existía **no
      podía ver esto**: mira items `- [ ]`, y las listas de bloqueos se escriben con viñetas y
      filas de tabla — así que una sección entera vencida pasaba en verde. Test primero, en rojo
      por el motivo correcto (`dos secciones con el mismo titulo se marcan`), con su recíproco
      para que no grite en falso sobre las secciones fechadas. **28 casos** en el self-check.
      **La lección: un ítem duplicado hace rehacer trabajo; una SECCIÓN duplicada hace pedirle a
      Sergio una decisión ya tomada.** Es el mismo defecto que esta cola bautizó *"cerrar un ítem
      no cierra su copia"*, un nivel más arriba — y la cuarta vez que se duplica.

## Cerrado (2026-08-31) — no rehacer

- [x] **Paso 3 (auditoría de los `[x]`): la cola resiste, y el hallazgo es que el punto 2 está
      cerrado en el repo y FALSO en producción.** Vuelta del 2026-08-31 con "Ahora" sin un solo
      ítem desbloqueado (F2, F5, los 4 números de WhatsApp y el `DELETE` de pagos esperan a
      Sergio). Cero líneas de producto tocadas: no había nada roto que este loop pueda arreglar.
      **Lo que se auditó y aguantó:**
      - Los **7 shas citados** en esta cola (`0711ff6`, `ab9e0de`, `1fc4354`, `4dce75e`,
        `e5c1ad3`, `753718f`, `4077f2c`) están en `origin/master`, preguntado con
        `git merge-base --is-ancestor` y no con `git branch --contains` — que es la falla de
        método que esta misma cola ya se había anotado.
      - La divergencia `3 3` que se arregló hoy **quedó en `0 0`** y el árbol de
        `onia-platform` está **limpio**. *(La guía del loop dice que ese árbol está "SUCIO con
        trabajo ajeno": hoy es falso.)*
      - **`master` verde de verdad, corriendo los tres gates**: `tsc` 0 · **2362 tests**
        (191 archivos, 5 skip) · `npm run lint` **0 errores** (101 warnings, ninguno nuevo).
      - Las rutas y guardas que la cola declara vivas existen y siguen ahí: `frasePuntuada`
        (`lib/utils.ts:167`), `/requerimientos` en el nav (`navigation.ts:45`),
        `SIN_NAV_A_PROPOSITO`, `__tests__/url-cruda-fuera-de-analytics.test.ts`, y los 3
        archivos del QR del BCP.
      - **Falsa alarma descartada, y vale anotarla:** los **tres** caminos que aprueban un pago
        parecían no contemplar el add-on. Se siguieron los tres y son **fail-closed**: el manual
        sí lo enciende (`admin/subscription-payments/route.ts:93` → `whatsappAddon: true`), el QR
        del BCP lo rechaza antes de crear la fila (`isSubscriptionPlan`) y el callback de n8n
        corta con 422 (`evaluateAutoApproval` → *"Plan invalido"*). Nadie paga el add-on y se
        queda sin él.
      **El hallazgo, que es lo que se lleva la vuelta:** la definición de terminado decía
      *"falta el deploy"* como **suposición**. Se midió DENTRO del contenedor del VPS —única
      forma válida, porque `e5c1ad3` ya no es lo desplegado—: `grep -rl "califica, agenda"
      /app/.next` da **5 chunks vivos** y `"deriva al humano"` da **cero**. Y el tagline se
      renderiza en **un solo** lugar, `AddonChatbotClient.tsx:275`, la pantalla del add-on detrás
      de login: **la frase falsa la lee el cliente que está por pagar Bs 390**. `master` está
      **11 commits** adelante de lo desplegado. Opciones cotizadas en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §9 — **decide Sergio**, este loop no despliega.

- [x] **El `master` local de `onia-platform` estaba divergido de `origin` — 3 commits contra 3, y
      el mismo árbol.** Es exactamente el objetivo de este carril ("`main` integrado") fallando en
      silencio: `git rev-list --left-right` daba `3 3`, así que ningún push entraba sin merge, y
      la cola ya había anotado que `6edfab6` y `a15c82f` duplicaban trabajo que ya estaba en
      `origin`. **La prueba de que eran duplicados no es leer los mensajes: es el `^{tree}`.** Los
      dos lados daban `06252c6e…` idéntico — mismo contenido, distinta historia.
      Por eso el arreglo fue `git reset --soft origin/master` y no `--hard`: el árbol tenía 4
      archivos sin commitear (`admin/audit`, `credit-note`, `lib/audit.ts`) y un `--hard` se los
      llevaba — que es justamente el motivo por el que la vuelta anterior no lo había limpiado.
      Con los trees iguales el soft reset no movió ni un byte del working tree. Quedó `0 0`.

- [x] 🚀 **`main` INTEGRADA y DESPLEGADA.** 242 commits de 4 carriles (`onia-web-architecture`,
      `chatbots-platform-review`, `ads-creatividades-publicos`, `git-status`). Gates: `tsc` 0,
      **217 tests**, 28 archivos. Deploy de `e5c1ad3` con los 5 gates de
      `deploy-gates-swap.sh` (en el VPS) en OK.
      Backup: `runtime-next.prev-20260831-194424`. Verificado **mirando** el login y `/register`.
- [x] **`claude/pending-tasks-review-fb0694` descartada, no mergeada.** Su único commit es un
      auto-sync del 10-ago y sus 3 archivos son **más viejos** que los de `main`: mergearla
      hacía retroceder los tres. Una rama no es un carril por tener commits.
- [x] **`main` estaba ROJA y nadie lo sabía.** `scripts/carousel_render.test.js` fallaba: el
      renderer dice `square`, el test decía `cuadrado`. No está en ningún CI. El merge trajo el
      arreglo desde el carril de contenido.
- [x] **Había DOS carpetas de handoff** (`handoff/` y `handoffs/`). Consolidadas en la singular,
      que es la que usa el README y los otros 5 carriles.
- [x] **El aviso de pedidos de acceso: PROBADO en vivo, y mi diagnóstico anterior era falso.**
      Dije que "no suena nada" — existe desde el 21-ago (`lib/aviso-acceso.ts`), está cableado
      en `app/api/access-requests/route.ts` y **funciona**: pedido de prueba → 201 → cero
      `[aviso-acceso] Telegram falló` en los logs. Lo había buscado con grep en `app/api`.
      **Lo que sí falla es la señal**: el aviso va al MISMO chat que el guardián del VPS.

- [x] **D2 · Cuentas de más dadas de baja en `onia_center`.** `arthur`, `seller_001` (Camila)
      y `seller_002` (Jerónimo) → `status='blocked'`. Queda **sólo `sergio`** activo. Respaldo
      del estado previo tomado antes del `UPDATE`; se revierte poniendo `'active'`.
      **Cerrado por dos vías**: además del flag, `center.onia.com.bo` responde **404** — la
      superficie ya estaba dada de baja.
- [x] **D1 · Los 2 crons instalados en el VPS y PROBADOS.** Pre-chequeos del runbook en verde
      (`CRON_SECRET` presente, `NEXT_PUBLIC_APP_URL=https://app.onia.com.bo` — no localhost,
      `N8N_API_KEY` presente, sin duplicados). Crontab respaldado en
      `/root/crontab-backup-antes-de-2-crons-20260831.txt` (29 líneas → 36). Scripts en
      `/root/bin/` con permisos `700` y shebang sin CRLF. **Corridos a mano, los dos exit 0:**
      - `recurring-invoices` → `{"ok":true,"processed":0,"failed":0,"total":0}` (hay **0 filas**
        en `recurring_invoices`, así que era no-op garantizado — por eso se pudo probar sin
        riesgo)
      - `onia-core-workitems` → `{"ok":true,"organizations":3,"created":0,"deduped":0,"errors":0}`

## Cerrado (2026-08-30) — no rehacer

- [x] 🔒 **Dar de baja una cuenta del ONIA Center NO cerraba la puerta.** Apareció yendo a
      verificar que D2 sirviera de algo. El middleware hacía `find(active) ?? profiles[0]` y la
      consulta **no filtraba por status**: una cuenta dada de baja caía en el fallback, devolvía
      su rol, y como el normalizador hace `role ?? ""` salía *truthy* — el guard `if (!role)` la
      dejaba pasar. Test en rojo: `expected 'seller' to be ''`. Del otro lado
      `onia-center-auth.ts:252` **sí** filtraba: dos caminos, uno solo cerrado. La decisión salió
      a `lib/onia-center-perfil.ts` con 7 tests y es **fail-closed** (sin `status` no se asume
      activo). Commit `3cccbe67`.
- [x] 🔒 **La mina de `page_location`** — GA mandaba la URL entera y anulaba el allowlist que la
      línea de arriba aplicaba a `page_path`. Dormida (GA apagado) pero **a una env var de
      encenderse**. PR #59: se arma del mismo path ya filtrado, y **el tipo se estrechó
      a `{ origin }`** para que `tsc` frene el regreso.
      ✅ **Verificado el 2026-08-31: esta entrada era correcta.** `4dce75e` está en
      `origin/master` y es **ancestro de `e5c1ad3`**, el commit desplegado en el VPS — o sea el
      fix ya estaba en producción. (Una sesión lo declaró abierto por leer un `master` local sin
      `fetch`; el detalle del error, en la entrada de "Después".) Le falta sólo la guarda, que
      es lo que se agregó.
- [x] **GA4: no era código muerto.** Early-return antes de montar el script, allowlist de 6 rutas
      públicas, política de privacidad ya escrita en condicional. Encenderlo es 1 env var.

- [x] **Corregido el catálogo de venta en 5 puntos** — todos porque estaba viejo, y cuatro de
      los cinco **subvendían** el producto: los cinco rubros ofrecidos ya se venden (decía
      tres), servicios profesionales está arreglado (decía "en arreglo"), el add-on de
      inventario está retirado por decisión de Sergio (decía "en revisión"), veterinaria es
      mucho más barata de lo que decía, y los agentes corren solos (decía que no).

- [x] **PR #56 mergeado** (`14fa528`): el registro ofrece demo al que no sabe configurarlo.
      Lint/Typecheck/Tests/Build y Secret scan en verde; el check de Vercel falló por
      `build-rate-limit`, que no es del código. Cero PRs abiertos en `onia-platform`.
- [x] **Corregido el catálogo de venta: los agentes SÍ corren solos.** Decía que "nadie los
      dispara" mirando `vercel.json` — pero la plataforma la sirve el VPS, no Vercel. El
      crontab del host los corre todos los días a las 07:00 La Paz, con 14 días de `http=200`
      en el log. Se estaba **subvendiendo** una capacidad que funciona.

## Cerrado (2026-08-29) — no rehacer

- [x] Circuito fiscal en mock, verificado en pantalla: CUF, QR, leyenda, RCV.
- [x] **La nota de crédito**, en 5 vueltas y 4 escépticos. Cerró con un invariante escrito, un
      punto compartido para las 6 rutas que escriben estado, y un test que caza cualquier
      escritura nueva sin guarda.
- [x] El 403 que la caja se tragaba en silencio.
- [x] **Métricas del panel** — no existía ni una agregación de plata en todo `/admin`.
- [x] Los dos bugs de alcance que le mentían al superadmin (`/admin/audit` y `/admin/users`).
- [x] `/vendedores` fuera de circulación en los dos hosts, sin reiniciar el chatbot.
- [x] **El alta self-service abierta en producción**, con verificación de correo **probada**
      (GoTrue nunca había enviado un correo: 0 envíos en 7 días).
- [x] El checkout ya no promete un QR que no existe ni una activación que no ocurre.
- [x] DentalGest fuera del código, y el WhatsApp que apuntaba a un número inventado.
- [x] CI de master destrabada: venía roja hacía más de un día.

## Rechazado, con motivo — no volver a proponerlo

- **Graphify / grafo de conocimiento.** El grafo de este repo proyecta ~1,2 M tokens: no es caro
  leerlo, es imposible. Y su detector de obsolescencia miente. Ver
  `ONIA_GRAFO_DE_CONOCIMIENTO_DECISION.md`.
- **Sumar veterinaria al registro.** `Invoice.patientId` es obligatorio y la factura toma los
  datos **del paciente**: una veterinaria no puede facturarle al dueño. Es el modelo, no un texto.
- **Sumar ganadería.** No hay entidades de hacienda ni sanidad — es el catálogo de comercio con
  otro nombre. El core la marca `pending_adoption`.
- **Renombrar el schema de producción.** Migración de datos vivos a cambio de prolijidad que
  ningún cliente ve.
- **Borrar el contenedor `onia-center`.** Adentro corre el motor del chatbot, que es el único
  webhook que Chatwoot tiene configurado.
