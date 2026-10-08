# Publicador de videos — de tus brutos a Instagram, sin Postiz

Montado el 29-sep-2026 a pedido de Sergio Urcullo: *«que de que te los pase, tú mismo edites y
publiques, hagas el yap y los publiques a trial o donde haga falta»*.

## El circuito

```
1. Sergio graba y deja los brutos      C:\Users\PC\Videos\ONIA-brutos\<AAAA-MM-DD>\
                                         (FUERA del repo: adentro, el autosync los subiría a git)
2. Claude edita                         skill editor-videos (cortes, subtítulos leídos a ojo)
3. Claude arma el PAQUETE DEL DÍA        por pieza: video final + caption + destino + el YAP
4. Sergio dice «ok» (o corrige)          UNA aprobación por paquete (regla: publicar es acción pública)
5. Claude publica                        ig-reel.mjs en el VPS → link en /root/publicar/publicado.jsonl
6. Claude verifica                        abre el link y lo MIRA publicado
```

- **Reel normal** → feed y seguidores de `@sergiourcullo` (o `@oniahq` si es pieza de producto).
- **Yap** = otra edición del video del día (otro gancho, otro orden, otra duración) publicada
  como **Trial reel**: Instagram se lo muestra solo a quienes NO te siguen. `--trial auto` lo pasa
  a tus seguidores si rinde; `--trial manual` espera a que vos lo pases desde la app.
- La tabla de cortes sigue siendo regla de oro (`editor-videos`): va DENTRO del paquete, así hay
  una sola aprobación y no dos.

## Comandos (los corre Claude)

```bash
# en la PC: copiar la pieza al VPS
scp -i ~/.ssh/onia_hermes_vps_ed25519 final.mp4 caption.txt root@187.77.16.63:/root/publicar/<pieza>/
# TikTok / Shorts / LinkedIn por Buffer: ver canales, ensayar y publicar
node /root/bin/buffer-post.mjs --listar
node /root/bin/buffer-post.mjs --canal <id> --video ... --texto caption.txt --cuando 2026-10-01T16:30:00Z [--publicar]
#   YouTube pide título: --meta yt.json con {"youtube":{"title":"…","privacy":"public","madeForKids":false,"categoryId":"28"}}
#   --borrador lo deja en Buffer sin publicar · --estado <postId> da status y link publicado · --borrar <postId> lo saca
# en el VPS: ensayo de Instagram (lo procesa, NO publica)
node /root/bin/ig-reel.mjs --cuenta sergio --video /root/publicar/<pieza>/final.mp4 --caption /root/publicar/<pieza>/caption.txt
# con el OK de Sergio sobre esa pieza
node /root/bin/ig-reel.mjs ... --publicar                 # reel normal
node /root/bin/ig-reel.mjs ... --trial auto --publicar    # yap a Trial
# Instagram a hora fija (UTC; responde con la hora de La Paz). Timer transitorio de systemd, sin cola
# persistente: si el VPS se reinicia lo agendado NO sale (falla segura). Si falla, avisa por onia-tg.sh.
/root/bin/agendar-publicacion.sh a-0930 "2026-09-30 16:30:00" node /root/bin/ig-reel.mjs ... --publicar
/root/bin/agendar-publicacion.sh --lista          # · --cancelar a-0930
```

**Carruseles de @sergiourcullo (desde la nube o la PC, con `ssh onia-vps`):** `agendar-carruseles.sh --ensayo <slug>`
sube uno y lo deja listo en Instagram SIN publicar; `--agendar` sube y agenda todo el calendario `CAL` del script (uno
por día, 20:00 UTC = 16:00 La Paz). El calendario se edita en el script, que no lleva fechas en el nombre. Volver a
correr `--agendar` falla en el día que ya tiene timer: cancelalo antes con `--cancelar car-AAAAMMDD`.

> **Medido el 5-oct:** desde una sesión de la nube en modo «Auto», el ensayo y `--agendar` de 11 carruseles pasaron el
> control de permisos cuando Sergio Urcullo lo pidió EN ESA MISMA sesión («agendemos los carruseles para empezar a
> postear»). El 2 y el 3-oct se frenaron cuando el pedido venía de la madre o de un mensaje viejo. En la nube falta
> `ssh`: `apt-get install -y openssh-client`.

## Cómo funciona por dentro (y por qué)

- **API oficial de Instagram (Instagram Login)**, app `OnIA Social API`. Los tokens de
  `@sergiourcullo` y `@oniahq` salieron de la base de Postiz (dormido) y viven SOLO en el VPS:
  `/root/.config/onia-publicar/ig-<cuenta>.env` (600). Renovados el 29-sep (vencían el 18-oct);
  `ig-refrescar.sh` los renueva cada lunes y, solo si falla, avisa por la aduana `onia-tg.sh` (sistema).
- **Con Instagram Login no hay subida directa** (rupload es solo para Facebook Login): la API pide
  `video_url` pública. El video se copia con nombre aleatorio a `/root/publicar/public/`, que sirve
  el contenedor `onia-assets` (nginx, solo lectura, sin listado) por la ruta que YA existía en
  Traefik: `https://onia.com.bo/hermes-assets/<aleatorio>.mp4`. Se borra apenas Instagram termina
  de procesar, aunque falle.
- **Trial reels**: `trial_params.graduation_strategy` = `MANUAL` | `SS_PERFORMANCE` (doc
  `ig-user/media`, verificada 29-sep). Ensayo real el 29-sep: contenedor con trial auto → FINISHED.
- **Buffer (activo desde el 29-sep):** cuenta `oninteligenciaartificial@gmail.com`, plan Free. Canales:
  TikTok `6abc2906ea19ca0bde28cf75` (sergiourcullom, con `video.publish`), YouTube `6abc2995ea19ca0bde28df15`
  y LinkedIn `6abc2a1aea19ca0bde28eda6`. Clave `onia-vps-publicador` solo en el VPS
  (`/root/.config/onia-publicar/buffer.env`, 600), **vence el 29-sep-2027**, con permisos mínimos:
  `account:read`, `posts:read`, `posts:write`, `insights:read`. Probado de punta a punta el 29-sep con un
  borrador por red: el video quedó adjunto y YouTube lo reconoce como Short. Los borradores se borraron.
- **`createPost` exige `needsApproval` (Boolean!)** aunque la guía no lo muestre: sin él, falla.
- **Los videos NO se comprimen.** La ruta `https-onia-assets-manual` tenía el middleware `comprimir` y
  servía el MP4 con `Content-Encoding: gzip`. Instagram lo toleraba; Buffer no («Video could not be read
  from its URL»). Se le sacó `comprimir` solo a esa ruta el 29-sep (respaldo en
  `/root/onia-manual-routes.bak-hermes-assets-20260929212725`). No volver a ponérselo.
- **Por qué no Postiz:** el 27-sep estaba sin contenedores, y su motor (Temporal) guarda una cola
  vieja que el 4-sep publicó 5 posts sin OK al encenderlo. Para Instagram no hace falta.

## Lo que falta: el resto de las redes

Análisis con fuentes primarias (29-sep): [`REDES-ANALISIS.md`](REDES-ANALISIS.md). Lo decisivo:

- **TikTok con app propia NO sirve:** sin auditoría publica solo en PRIVADO, y la auditoría rechaza por
  escrito las «herramientas para subir contenido a cuentas que vos manejás». El modo borrador (a tu
  bandeja) permite 5 por día y lo terminás vos en el celular.
- **YouTube con API propia NO sirve para publicar:** todo video subido por un proyecto no auditado
  (creado después del 28-jul-2020) queda PRIVADO y no se puede pasar a público: hay que volver a
  subirlo. `yt-video.mjs` y `yt-auth.mjs` quedan listos para cuando haya auditoría, pero **no se usan
  para publicar hoy**.
- **Instagram:** 100 publicaciones por API cada 24 h; los Trial reels no tienen tope propio documentado.

| Destino | Ruta | Qué hace falta |
|---|---|---|
| Instagram `@sergiourcullo` / `@oniahq` (reel + trial) | ✅ API propia (`ig-reel.mjs`) | nada |
| Facebook (perfil y Página) | compartido automático desde el Centro de cuentas de Instagram | Sergio lo activa (1 min); se verifica con el primer reel publicado por API |
| TikTok · YouTube **Shorts** · LinkedIn perfil | ✅ **Buffer GRATIS** (auditado; 3 canales, 10 en cola por canal, API con 100 consultas por día) con `buffer-post.mjs` | nada: activo y probado el 29-sep (ver arriba) |
| YouTube **largos** (lun · mié · vie) | Buffer no los sube: por ahora los subís vos con el paquete listo (archivo, título, descripción con capítulos, miniatura); en paralelo se pide la **auditoría de la API de YouTube** (gratis) para que `yt-video.mjs` publique solo | 3 min por video; el formulario lo preparo yo y lo enviás vos |
| Descartadas | Metricool (pago; Sergio pidió gratis) · Upload-Post (gratis sin TikTok ni API) · Ayrshare (sin plan gratis) · Postiz propio (mismo bloqueo: TikTok y YouTube quedan privados) | — |

