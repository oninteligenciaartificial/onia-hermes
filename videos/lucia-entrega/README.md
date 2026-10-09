# Entrega de Lucía — G1, G3, G2 (9-oct-2026)

Videos finales de Lucía listos para publicar. **Cualquiera con la llave del VPS los publica en un paso**; esta sesión de la
nube no tiene cliente `ssh` y la decisión de la madre (8-oct) es que la llave vive solo en la sesión «Onia».

| Orden | Pieza | Archivo | Duración | Pie | Preview 360p (la mirada de la madre) |
|---|---|---|---:|---|---|
| 1 | G1 «Este video no fue grabado: así se hace, en 3 pasos» | `g1-final-1080x1920.mp4` | 56 s | `../lucia-g1/pie.txt` | `../lucia-g1/qa/g1-preview-360p.mp4` |
| 2 | G3 «Tres errores de la IA que atrapé antes de publicar» | `g3-final-1080x1920.mp4` | 58 s | `../lucia-g3/pie.txt` | `../lucia-g3/qa/g3-preview-360p.mp4` |
| 3 | G2 «La misma foto, seis clips: ¿quién pierde la cara?» | `g2-final-1080x1920.mp4` | 58 s | `../lucia-g2/pie.txt` | `../lucia-g2/qa/g2-preview-360p.mp4` |

SHA-256 de lo entregado:

```
5903cd9c6c65bc134ca8c0faf83432007197399b95a8cb31ff901bdca7516ca7  g1-final-1080x1920.mp4
75642fd093569109a4adb3346dda13afe5991dcd0e3eb430b62c1c080c17a3e3  g3-final-1080x1920.mp4
429793f0ff2f544cc2185f29c83916d76c47adf632ab9df6fb7c95a2448d46e6  g2-final-1080x1920.mp4
```

- G1 y G3 son **byte por byte** el render que pasó el QA (`../lucia-gN/out/`, ignorado en git).
- G2 es el mismo render recodificado a 6 Mbps máx. para que entre en git (61 → 16,7 MB): PSNR contra el original 47,9 dB
  de promedio y 43,8 dB en el peor cuadro, o sea sin diferencia visible; misma duración (58,00 s), 24 fps, audio silencioso copiado.
- Todos son 1080×1920, H.264 + AAC (silencioso: D4, sin voz ni música), 24 fps.

## Carrusel L01 «Hola, soy Lucía. No existo.» (presentación, va fijado después de G1)

- Láminas: `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png` (1080×1350). Pie: campo `caption` +
  `hashtags` de `hermes-content/carousels/briefs/lucia/l01-hola-no-existo.json`.
- En el VPS: `node /root/bin/ig-carrusel.mjs --cuenta lucia --dir <carpeta con las 5 láminas> --caption <pie>`; el ensayo debe decir
  «listo en Instagram … etiqueta IA».

## Carrusel C1 «Un video sin grabar, en 3 pasos» (la versión carrusel de G1)

- Láminas: `hermes-content/carousels/out/lucia-c1-un-video-sin-grabar/slide-01..05.png` (1080×1350). Pie: `caption` + `hashtags` de
  `hermes-content/carousels/briefs/lucia/c1-un-video-sin-grabar.json`. Mismo comando que L01.
- Sale **después** de G1 (repite su enseñanza en otro formato y guarda la «orden real» para el que quiera copiarla).

## Antes de publicar (una vez)

1. Token de Lucía en `/root/.config/onia-publicar/ig-lucia.env` (no se midió desde el 4-sep; vencía entre el 13 y el 18-oct).
2. `hermes-content/deploy/vps-ops/publicar/ig-reel.mjs` **e** `ig-carrusel.mjs` copiados **juntos** a `/root/bin`, con
   `--selftest` en los dos (el carrusel importa del reel; copiar uno solo rompe los de `@sergiourcullo`).
3. La madre mira los previews 360p de arriba (regla de oro de `CLAUDE.md` § Video).

## Por pieza (en el VPS)

```bash
# ensayo: Instagram procesa y valida, NO publica; debe decir FINISHED
node /root/bin/ig-reel.mjs --cuenta lucia --video g1-final-1080x1920.mp4 --caption pie.txt
# agendado a las 19:00 de La Paz (23:00 UTC) y publicación real
agendar-publicacion.sh lucia-g1 "AAAA-MM-DD 23:00:00" node /root/bin/ig-reel.mjs --cuenta lucia \
  --video g1-final-1080x1920.mp4 --caption pie.txt --publicar
```

Después: abrir el permalink, confirmar «Información de IA» y que `is_ai_generated` quedó en `true` en
`/root/publicar/publicado.jsonl`. El aviso a Sergio Urcullo lleva el enlace.

## Qué NO tocan estas piezas (por eso salen sin el OK pieza por pieza)

Ninguna muestra ni promete una función de Onia, ninguna nombra marcas de terceros (los motores van como «Motor 1 a 6»), no
hay voz, no hay testimonio, no hay cliente. Greps contra la lista de frases prohibidas en `../lucia-gN/qa/grep-prohibidas.txt`
y control de cara en `../lucia-gN/qa/face-gate.txt`.

## Si se pierde el contenedor

Los renders de `out/` se reconstruyen: `videos/lucia-gN/README.md` dice cómo (clips con `job_display` a 0 créditos, `node
scripts/build.mjs`, render de 3 a 4 min). Esta carpeta es la copia que sobrevive.
