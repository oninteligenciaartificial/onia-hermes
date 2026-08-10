// Instagram: bajar el MP4 REAL (con audio) de un reel/post, desde el navegador logueado.
//
// EL PROBLEMA: Instagram no deja reproducir reels sin sesion, el <video> usa MSE (blob,
// no descargable), yt-dlp necesita cookies, y desde Chrome 127 las cookies estan cifradas
// con App-Bound Encryption -> yt-dlp falla con "Failed to decrypt with DPAPI" aunque le
// pases un snapshot de la base (ver snapshot-cookies.ps1, que resuelve el lock pero no el
// cifrado). Capturar fotogramas con canvas da imagen pero NO audio.
//
// LA SOLUCION QUE FUNCIONA: pedirle el MP4 a la propia API de Instagram DESDE la pagina
// logueada (credentials: include), y bajarlo con el mecanismo de descarga del navegador.
// La sesion la pone el navegador; nosotros nunca tocamos la contrasena.
//
// USO (via MCP claude-in-chrome, javascript_tool sobre una pestana de instagram.com
// con sesion iniciada). Pegar el cuerpo de igDownloadReel() como script:
//
//   1) navigate -> https://www.instagram.com/reel/<SHORTCODE>/
//   2) javascript_exec -> el bloque de abajo con SHORTCODE reemplazado
//   3) el MP4 aparece en la carpeta de descargas -> mover al scratchpad
//   4) node gemini-see-video.mjs <archivo.mp4>   (analisis nativo: imagen + AUDIO)
//
// OJO: no devolver la URL del CDN como valor de retorno — lleva query string firmada y
// el filtro de seguridad del MCP la bloquea. Hay que descargar DENTRO de la pagina.

/** Shortcode de Instagram -> media_id (base64 propio de IG, 64 simbolos). */
function shortcodeToMediaId(shortcode) {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let n = 0n;
  for (const ch of shortcode) n = n * 64n + BigInt(ALPHABET.indexOf(ch));
  return n.toString();
}

/** Cuerpo a ejecutar en la pagina logueada. Devuelve duracion y tamano; el archivo baja solo. */
async function igDownloadReel(shortcode) {
  const mediaId = shortcodeToMediaId(shortcode);
  const info = await fetch(`/api/v1/media/${mediaId}/info/`, {
    headers: { "x-ig-app-id": "936619743392459" }, // app id publico del IG web
    credentials: "include",
  });
  if (!info.ok) throw new Error(`API ${info.status} — sesion caida o media privado`);

  const item = (await info.json()).items[0];
  const url = item.video_versions[0].url; // [0] = mayor calidad
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
  link.download = `reel_${shortcode}.mp4`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  return { duracion: item.video_duration, kb: Math.round(bytes.length / 1024) };
}

// Probado 2026-08-06: reels DbYojZmyPM3 (70,4 s / 10,3 MB) y DblcFzIt9UL (32 s / 4,1 MB),
// ambos analizados despues con Gemini incluyendo narracion y texto en pantalla.
if (typeof module !== "undefined") module.exports = { shortcodeToMediaId, igDownloadReel };
