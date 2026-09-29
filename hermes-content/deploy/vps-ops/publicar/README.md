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
# en el VPS: ensayo (Instagram lo procesa, NO publica)
node /root/bin/ig-reel.mjs --cuenta sergio --video /root/publicar/<pieza>/final.mp4 --caption /root/publicar/<pieza>/caption.txt
# con el OK de Sergio sobre esa pieza
node /root/bin/ig-reel.mjs ... --publicar                 # reel normal
node /root/bin/ig-reel.mjs ... --trial auto --publicar    # yap a Trial
```

## Cómo funciona por dentro (y por qué)

- **API oficial de Instagram (Instagram Login)**, app `OnIA Social API`. Los tokens de
  `@sergiourcullo` y `@oniahq` salieron de la base de Postiz (dormido) y viven SOLO en el VPS:
  `/root/.config/onia-publicar/ig-<cuenta>.env` (600). Renovados el 29-sep (vencían el 18-oct);
  `ig-refrescar.sh` los renueva cada lunes y avisa por Telegram solo si falla.
- **Con Instagram Login no hay subida directa** (rupload es solo para Facebook Login): la API pide
  `video_url` pública. El video se copia con nombre aleatorio a `/root/publicar/public/`, que sirve
  el contenedor `onia-assets` (nginx, solo lectura, sin listado) por la ruta que YA existía en
  Traefik: `https://onia.com.bo/hermes-assets/<aleatorio>.mp4`. Se borra apenas Instagram termina
  de procesar, aunque falle.
- **Trial reels**: `trial_params.graduation_strategy` = `MANUAL` | `SS_PERFORMANCE` (doc
  `ig-user/media`, verificada 29-sep). Ensayo real el 29-sep: contenedor con trial auto → FINISHED.
- **Por qué no Postiz:** el 27-sep estaba sin contenedores, y su motor (Temporal) guarda una cola
  vieja que el 4-sep publicó 5 posts sin OK al encenderlo. Para Instagram no hace falta.

## Lo que falta

| Destino | Estado | Qué hace falta |
|---|---|---|
| Instagram `@sergiourcullo` (reel + trial) | ✅ listo; el paso «publicar» se estrena con el primer video aprobado | nada |
| Instagram `@oniahq` | ✅ listo (token renovado) | nada |
| YouTube `@sergiourcullo` | ⏳ | 10 min de Sergio: crear el cliente OAuth en Google Cloud y apretar «Permitir» una vez (ver abajo) |
| LinkedIn / Facebook | fuera por ahora | — |

**YouTube, paso a paso (Sergio):**
1. En Google Cloud, crear el proyecto «ONIA publicar».
2. Activar la *YouTube Data API v3*.
3. Crear una pantalla de consentimiento externa.
4. Pasar la app a **Producción**. En modo prueba, el permiso de subida vence cada 7 días.
5. Crear un cliente OAuth tipo *App de escritorio* y guardar el JSON en tu PC.

Claude hace el resto: el flujo de consentimiento, en el que vos apretás «Permitir»; guarda el
permiso en el VPS y arma el `yt-video.mjs` equivalente.
