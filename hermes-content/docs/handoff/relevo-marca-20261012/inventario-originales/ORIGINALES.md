# Reconciliación de originales · 12-oct-2026

Sergio Urcullo corrigió el alcance: **seis grabaciones originales anteriores**, además del nuevo video de motivación. Cuatro montajes mostrados no equivalen a seis originales. Calificó la edición existente como muy buena: se conserva.

## Matriz anterior

| Original | Drive ID fuente | Bytes | Fecha fuente UTC | Montaje existente y música |
|---|---|---:|---|---|
| N06 · Gemini CLI → Antigravity | `1rlbdA9zLE9SZJInPmFjd1jP3S8r8yk08` |69.843.125|11-oct 04:47:06.789|Claude 45,504 s; limpio exacto y música local con QA técnico/licencia PASS. Root transfiere preview privado. |
| DD-A · Sol/caché | `1rHY7WjqjRaEnfIqgdDMOXXfMhF2oZ3Ae` |92.453.888|11-oct 04:50:03.826|Claude 58,433 s; limpio/música con QA PASS. Marcador y duda fonética intactos. |
| S2-D07-A · ventana WhatsApp | `18DnUVL_i99QN6DQdc7XqO_RTEtT9T2eQ` |122.622.390|11-oct 04:51:21.242|**Quinto montaje**, Erik 90,752 s; limpio/música con QA PASS. No es DD-A de 58 s; variables pendientes. |
| N02 · retiro/migración Sonnet | `1QAAvFbQXPK64z5VmcnP2sq0iv6hsSniY` |184.354.882|11-oct 04:52:47.199|Claude original 111,300 s conservado; Work privado 109,033333 s recibido, usado para limpio/música con QA PASS. No reemplazar uno por otro. |
| N07 · Haiku | `1stEjNjp48QMn1u8FnUVeF9opX6-3uX98` |212.776.631|11-oct 05:01:31.769|Claude 81,733 s; limpio/música con QA PASS. Bruto de unos 180 s es N07 según mapeo previo; no etiquetarlo como nuevo MOTIVACIÓN. |
| BA814C81 · **candidata documental a la sexta** | `1P1KaDTfmtxbjuGqRzSWDru0HROjGg_iO` |250.517.135|11-oct 05:05:02.012|Cola/calendario lo citan como archivo adicional del 11-oct, **tal cual, sin editar**. No hay montaje Claude, versión con música o yap recibido. Tema/toma y pertenencia definitiva a las seis no se inventan. |

Fuentes: `hermes-content/docs/cola/loop/marca-personal.md`, blob `b7082b17414ac81b7bf7baca151553320bd061b4`, y `ORDEN-DE-POSTEO-11-17-OCT.md`, ambos en `claude/gifted-clarke-y4vvtj`, commit `781df7d87b53913ac9790fa1df88e53357408bc3`. La cola enumera cinco brutos mapeados y después «Además BA814C81…» con el ID de raíz. Esto sustenta su candidatura; no sustituye identidad/toma si la madre conoce otro sexto original.

BA tiene también upload en Videos Onia Octubre: ID `1e0ceYYrKy4mlscC-XEODRtMji1eJGeEj`, creado 12-oct 19:13:23.586 UTC, mismo nombre/tamaño, compartido por enlace. El viejo de raíz sigue owner-only. **No se ha comprobado igualdad binaria**: se solicitaron MD5/SHA256 y metadata de video, pero el conector no devuelve esos campos. No confundir una copia subida hoy con una grabación nueva ni revocar «sin editar» por inferencia.

`A0550B92-EFE3-43E7-A7A3-065A57365A1F.mp4`, ID `1fOVS40NXa25ZBt-b_3gJkBXfCCOcs-3q`, fue creado el 1-oct. La fuente lo identifica como histórico: no cuenta como sexto del 11-oct ni como nueva motivación.

## Links, versiones y hashes

`ORIGINALES.json` contiene, por pieza, URL Drive del bruto, SHA de origen si existe y su autoridad, montaje Claude con URL Git canónica y SHA256 medido, variante Work N02, paths/hashes de música y limpio. Los dos hashes de bruto N06/DD-A provienen del manifiesto **de origen Work**; los brutos todavía no llegaron al destino nativo, por lo que no se presentan como hashes medidos localmente.

Cinco mezclas y cinco limpios existen localmente en `/workspace/work/onia-marca-musica-20261012/previews/`. QA independiente comprobó video, paquetes/timestamps, duración, decodificación y licencia: **5/5 PASS técnico**, sin aprobar al oído ni contenido/publicación. Las URLs nuevas de Drive quedarán registradas cuando root complete la transferencia; no se inventan links ni se duplican uploads.

## Los tres yaps

Petición de tres yaps registrada, **cero archivos/links de yap verificados** en las fuentes recuperadas. La cola, calendario, árbol de MP4 y lote Work no aportan tres derivados recibidos. El calendario de origen dice que N06, DD-A y S2-D07-A terminan en CTA y no tienen yap; sacar un gancho alternativo de su bruto era una tarea posterior.

Por eso la matriz no inventa tres cortes ni fechas. Deben localizarse los archivos reales si existen en otra fuente o ejecutarse el contrato de recorte autorizado cuando estén disponibles sus brutos/cortes. No presentar «3 yaps» como resultado ya hecho.

## Nuevo video de motivación

Tema y duración aproximada de tres minutos son **declaración directa de Sergio Urcullo**, no inferencia por tamaño/duración de un archivo conocido. Necesita un ID distinto y timestamp posterior al inventario anterior.

La lectura propia `google_drive_list_folder(top_k=500)` y la lectura independiente `google_drive_fetch(folder)` devolvieron los mismos siete objetos conocidos; no se recibió aún un ID posterior al upload BA de las 19:13. `LISTING-FOLDER.json` conserva esa observación, sin afirmar ausencia global de un video que puede estar terminando de subir o no ser visible todavía por este acceso.

Se comunicó a root/madre el bloqueo concreto: comprobar la finalización del upload en su UI actual ya autorizada y transmitir el nuevo ID. **No se solicita folder, login ni otra respuesta a Sergio Urcullo.** Cuando aparezca el ID se comprobarán metadata y acceso propio; si supera 32 MiB, la madre exportará el archivo existente en partes de **20 MiB**, con orden, bytes y SHA256 de cada parte y del original. No reenviar por URLs firmadas a logs ni evitar el proxy.

Hasta recibir el ID/bytes no existe transcripción ni audio local nuevo: no se inventa hablado, silencios, cutplan o storyboard de motivación. El carril permanece autorizado para edición privada con molde existente, licencia musical presente y preview; se ejecutará al disponer del material real, sin rehacer los montajes anteriores.

## Continuidad

Instrucciones audit locales vigentes: `d48a06fceee811fcd16a9d3e8b36e16cc96e8cff`; delta CODEX/AGENTS leído, hasta cinco frentes útiles si capacidad lo permite, sin simular agentes ni busywork. Este contrato no pide nuevos subagentes. Lote Work **43/59** y partes pendientes se mantienen intactos. Sin publicación, main/merge, gasto, instalación, generación de cara/voz ni modificación de los originales.
