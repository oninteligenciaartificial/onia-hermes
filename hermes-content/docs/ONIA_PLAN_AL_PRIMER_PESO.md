# Plan — de acá al primer peso cobrado

> **Fuente viva del ORDEN de trabajo del carril de contenido. Sin fecha: se EDITA, no se duplica.**
> Producido el 2026-08-30 por 26 agentes en paralelo, cada hallazgo pasado por un refutador
> adversarial. Lo que no sobrevivió NO está acá. El orden que sigue viene de
> `ONIA_ADDON_CONTENIDO.md`; este doc lo aterriza en pasos con dueño y costo.

Rama `claude/ads-creatividades-publicos`. Sesión de solo lectura: no publiqué, no edité, no toqué el VPS ni n8n. Todo lo que digo abajo está verificado hoy o citado con su archivo.

---

## 1. Qué destraban de verdad las capacidades nuevas

Cinco frentes se investigaron. Ninguno pasó la revisión adversarial entero. Sin adornos:

| Capacidad | Qué destraba |
|---|---|
| **Grabación de pantalla (ffmpeg)** | **Los 4 screencasts de App Review, gratis.** Verificado hoy: `ffmpeg -devices` devuelve `gdigrab` y `dshow` en esta máquina. Ya no hace falta comprar ni instalar nada para grabarlos. Pero el cuello nunca fue grabar: es el guion por permiso, la interfaz en inglés, los subtítulos y tu OK. Baja el costo de la herramienta a cero, no el del trabajo. |
| **Chrome MCP (manejar el navegador)** | Casi nada acá. Sirve para *mirar* pantallas renderizadas, que es la regla del proyecto. No lo vamos a usar en la app de Meta: el 29-ago un intento de tantear el DOM cayó en el campo equivocado y se abortó. Esos 4 campos los cargás vos a mano. |
| **computer-use (control del escritorio)** | **Nada. Descartar.** Los navegadores le quedan en modo "solo mirar" — no puede hacer clic en una web — y todo lo que falta de Meta pasa por su web. Además no graba video. |
| **Skills `ads` y `ad-creative`** | **Nada hoy. Descartar.** `ads` cuelga entero de un costo objetivo por lead calificado, y con cero clientes pagando no hay con qué anclarlo. `ad-creative` trae una página de aprobación linda que solo muestra imágenes 4:5 — 13 de nuestras 19 piezas son video vertical, así que no las muestra. Y ya existe `scripts/mara_visual_board.js` en el repo, que sí muestra video. |
| **Skill `abogado-del-diablo`** | **Nada. Descartar**, y por un motivo que importa: opina sin abrir la pantalla. Los cuatro errores que costaron plata en este carril (el Workflow lanzado con premisas falsas, SISTEMA casi apagada, 8 de 12 rojos falsos, cuatro hipótesis muertas) son todos de la familia "opinar sin mirar". Una skill de opinión reproduce la enfermedad con cara de rigor. |

**Traducción:** de todo lo nuevo, lo único que mueve la aguja es que podemos grabar los screencasts sin gastar un peso.

Un cambio que sí se dio desde el último handoff y ordena el paso 1: **el hueco de pilar B en el feed está tapado.** `render-l11` (tres lugares) existe con sus 7 láminas, 0 créditos, gate verde (commit `7daeee58`). El calendario ya no tiene el casillero rojo.

---

## 2. El plan, en orden

El orden no lo invento: está escrito en `ONIA_ADDON_CONTENIDO.md` §"El orden, y por qué es ese" — medir demanda gratis, destrabar lo terminado, pedir el permiso que tarda, demo, precio, automatizar.

### Paso 0 — Tus siete respuestas. Vos. 10 minutos.
Están en la sección 5. **Sin esto no arranca nada**: el paso 1 entero está esperando un OK desde el 23 de agosto.

### Paso 1 — Publicar lo de Lucía. Es el test de demanda y nunca se corrió.
- **Qué hay listo, pago y sin publicar:** 7 carruseles renderizados — las carpetas que se suben son `FIJADO`, `L09`, `L6`, `render-l10`, `L08`, `render-l11` (`render-fijado`/`render-l6`/`render-l08` quedaron superadas el 31-ago: ver el handoff del carril, § 1-sexies; `render-l07` es la pieza archivada), el reel v7, y 12 historias (H01-H12). Cero créditos nuevos.
- **Quién:** vos das el OK y publicás. Esta sesión no publica — es la regla.
- **Costo:** cero.
- **Cadencia:** pediste 1/día. La recomendación sigue siendo **3 por semana las dos primeras semanas**, y ahí sí 1/día. Las historias sí, diarias desde el día 1.
- **Aviso operativo verificado hoy:** Postiz está caído. `postiz.onia.com.bo/` responde 307 pero `/api/user/self` da **502**, y el MCP de Postiz de esta sesión también falló con 502. **Programar por Postiz hoy no se puede.** Se publica a mano desde el teléfono, que además baja el riesgo de bot. Arreglar Postiz es del carril de infra, no de este.
- **Qué se cae si no se hace:** todo lo demás. El propio doc dice que si el lanzamiento de Lucía no trae nada, *la decisión del add-on se revisa antes de construir*. Sin el test, la ficha de marca, el proponedor y el precio se construyen a ciegas.

### Paso 2 — Advanced Access de Meta. Arranca en paralelo con el 1. Es lo único con reloj.
**2a. Los cuatro campos de la app. Vos, 60 segundos.**
Ícono (el archivo ya está: `hermes-content/assets/onia/onia-app-icon-1024.png`) · Dominios: `onia.com.bo` · Plataforma: Sitio web → `https://onia.com.bo` · Dirección y país: Calle Tulipanes Nro. 9, Zona Norte, Santa Cruz de la Sierra, Santa Cruz, **Bolivia**.
Van los cuatro **antes** de enviar: editarlos después dispara re-verificación.

**2b. Los cuatro screencasts. El trabajo real.**
Uno por permiso, de punta a punta, interfaz en inglés y con subtítulos, más instrucciones de prueba paso a paso para el revisor. Yo escribo los guiones y el texto de los casos de uso; grabar necesita tu sesión iniciada en tus cuentas. La herramienta ya la tenemos.
**Qué se cae si no se hace:** el add-on de Bs 390 no se puede cumplir en la cuenta de un cliente, por buenas que sean las piezas. No hay producto vendible sin esto.
**Ojo:** el "~20 días" que veníamos citando no está en la documentación de Meta. Es estimación nuestra, no dato.

### Paso 3 — FACTURA. Vos, 30 segundos en la UI de n8n.
El cambio exacto ya está escrito en `ONIA_IG_CARGAR_FACTURA.md`. El recurso está vivo: `onia.com.bo/guia-facturacion` responde **200** (verificado hoy). No se aplicó por API porque el MCP de n8n solo sabe reescribir el workflow entero — reescribir 18 nodos de producción para agregar una palabra es desproporcionado.
**Qué se cae:** la pieza O03 sigue bloqueada.

### Paso 4 — STACK. Esta sesión, costo cero.
Doble bloqueo: no existe el PDF y el mapa de @sergio_urcullo está vacío a propósito. La salida barata es la misma que se usó con SISTEMA: **cambiar la promesa de S05 y S06** por algo que ya exista, en vez de escribir un PDF nuevo.
**Qué se cae:** dos piezas escritas quedan en rojo para siempre.

### Paso 5 — Demo de Marketing Studio. Bloqueado por vos.
Sirve dos veces: es la pieza de venta del Higgsfield cotizado y material para el screencast de App Review. Falta que digas **con qué producto**. Y va en un teléfono, no en una laptop — la laptop de la prueba del 29-ago salió inventada.

### Paso 6 — El precio. Otro carril, y hay una trampa.
`onia-platform/lib/pricing.ts` no tiene fila de contenido — lo verifiqué: `grep -c -i "contenido\|content"` devuelve **0**. Hasta que exista, el precio no es real.
**La trampa, sin confirmar todavía:** el propio archivo registra que los tres niveles del chatbot eran *infacturables* porque la organización guardaba un booleano y no el nivel. Una fila de precio que solo se muestra no cobra nada. Antes de escribirla hay que ver si hace falta un campo de facturación nuevo. Eso lo resuelve el carril del producto.
Y el número que se dice en la reunión no es 390: es **710** (plan básico 320 + add-on 390).

### Paso 7 — El proponedor. Recién cuando haya tercer cliente.
La viabilidad es tajante: a mano son ~5 h por cliente por mes, Bs 78/h — un empleo mal pago. Con el proponedor, 0,5 h y Bs 780/h. No se construye antes porque puede que no haga falta nunca.

---

## 3. Lo que NO vamos a hacer

1. **No producimos más contenido.** Hay 7 carruseles, 1 reel y 12 historias hechos y sin publicar. Producir dejó de ser el cuello hace dos semanas; el cuello es publicar.
2. **No terminamos los reels RL01 y RL02** para "tapar el hueco de formato". Sus propias tablas de cortes dicen que salen de los carruseles L08 y L09 — o sea, sería publicar el mismo contenido dos veces, que es exactamente el defecto que ya detectamos con L07/L08. Y el hueco que sí dolía (pilar B en el feed) lo tapó L11.
3. **No usamos las skills nuevas de ads, ad-creative ni abogado-del-diablo.** Razones en la sección 1. Ninguna destraba un bloqueo real y las tres consumen tiempo.
4. **No tocamos Postiz, el VPS ni n8n desde este carril.** Infra tiene un dueño a la vez. Lo de Postiz se reporta, no se arregla acá.
5. **No volvemos a proponer eliminar las integraciones de Meta.** Lo decidiste el 29-ago y quedó cerrado.
6. **No reabrimos el orden de lanzamiento.** Está decidido y verificado el 29-ago. Lo tachado no se rehace.

---

## 4. Los riesgos reales

1. **Que Instagram cierre la cuenta de Lucía justo cuando arranca.** Es el que más duele: se lleva puesto el test de demanda y las piezas ya pagas. Es una cuenta nueva, y una cuenta joven que empieza a publicar seguido por API se ve como un bot. Encima el aviso de cierre que te llega a la cuenta personal viene de tener seis apps conectadas. **Mitigación: 3 por semana las dos primeras semanas, publicación a mano** (que además es lo único posible hoy, con Postiz caído).
2. **Que Meta rebote la revisión por el país.** La app dice Estados Unidos y el negocio verificado es boliviano (SEPREC 5371375010). Meta pide que coincida exacto con la entidad legal. Ya nos rebotó en julio por algo parecido, y no siempre dicen por qué.
3. **Concentración en una sola app de Meta.** Si un cliente la usa de forma abusiva y Meta la restringe, caen todos los clientes juntos. Por eso el sistema nunca ofrece envío masivo, aunque un cliente lo pida.
4. **Churn.** Un abono de contenido se cancela el primer mes sin leads. El circuito comentario→DM→panel es lo que lo defiende, pero **nunca corrió en la cuenta de un cliente** — solo en las nuestras. Se vende diciendo eso, no otra cosa.
5. **Postiz se muere solo y nadie se entera.** Es la tercera vez con el mismo patrón. Hoy: frontend 307, API 502. Sin monitoreo, va a volver a pasar el día que lo necesites.
6. **Construir el add-on antes de la señal.** Si el paso 1 no trae comentarios de gente real, la ficha de marca y el proponedor son trabajo tirado. Por eso el paso 1 va primero.

---

## 5. Lo que depende de vos

1. **¿Arrancamos a publicar?** Sí / No.
2. **¿Cadencia?** 3 por semana las dos primeras semanas, o 1/día desde el día 1.
3. **¿L07 o L08?** Son la misma pieza reescrita; una se archiva.
4. **¿Se publica L10?** Sí / No.
5. **¿Cargás los cuatro campos de la app de Meta esta semana?** Sí / cuándo.
6. **¿OK para grabar los cuatro screencasts?** Sí / No.
7. **¿Pegás FACTURA en n8n?** Sí / No. (30 segundos, el texto ya está escrito.)
8. **Demo de Marketing Studio: ¿qué producto?** Una palabra.
9. **"¿Y si quiero solo el contenido, sin plan?"** — va a aparecer en la primera reunión porque el add-on (390) cuesta más que el plan de entrada (320). Decidilo ahora: se desempaqueta / no se desempaqueta.