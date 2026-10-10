# Entrega de Lucía — G1, G3, G2, G4, G5 y los carruseles L01, C1, C2 (9-oct-2026)

Videos finales de Lucía listos para publicar. **Cualquiera con la llave del VPS los publica en un paso**; esta sesión de la
nube no tiene cliente `ssh` y la decisión de la madre (8-oct) es que la llave vive solo en la sesión «Onia».

| Orden | Pieza | Archivo | Duración | Pie | Preview 360p (la mirada de la madre) |
|---|---|---|---:|---|---|
| 1 | G1 «Este video no fue grabado: así se hace, en 3 pasos» | `g1-final-1080x1920.mp4` | 56 s | `../lucia-g1/pie.txt` | `../lucia-g1/qa/g1-preview-360p.mp4` |
| 2 | G3 «Tres errores de la IA que atrapé antes de publicar» | `g3-final-1080x1920.mp4` | 58 s | `../lucia-g3/pie.txt` | `../lucia-g3/qa/g3-preview-360p.mp4` |
| 3 | G2 «La misma foto, seis clips: ¿quién pierde la cara?» | `g2-final-1080x1920.mp4` | 58 s | `../lucia-g2/pie.txt` | `../lucia-g2/qa/g2-preview-360p.mp4` |
| 4 | G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» (**guion APROBADO por la madre el 10-oct**; sale solo con «mostrada, publicá G4») | `g4-final-1080x1920.mp4` | 59,75 s | `../lucia-g4/pie.txt` | `../lucia-g4/qa/g4-preview-360p.mp4` |
| 5 | G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» (**guion APROBADO por la madre el 10-oct**; sale solo con «mostrada, publicá G5»; guion: `hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md`) | `g5-final-1080x1920.mp4` | 57,5 s | `../lucia-g5/pie.txt` | `../lucia-g5/qa/g5-preview-360p.mp4` |

SHA-256 de lo entregado:

```
5903cd9c6c65bc134ca8c0faf83432007197399b95a8cb31ff901bdca7516ca7  g1-final-1080x1920.mp4
75642fd093569109a4adb3346dda13afe5991dcd0e3eb430b62c1c080c17a3e3  g3-final-1080x1920.mp4
429793f0ff2f544cc2185f29c83916d76c47adf632ab9df6fb7c95a2448d46e6  g2-final-1080x1920.mp4
ec4c450f3e0c4f682b675b65ef913a2e1e0400d31b29c35aa948119bf702f997  g4-final-1080x1920.mp4
6eed3adecbaf2eea5b31cfc00edf0fad41cdaa3a70200c2424ea5e0e4931f136  g5-final-1080x1920.mp4
```

- G1 y G3 son **byte por byte** el render que pasó el QA (`../lucia-gN/out/`, ignorado en git).
- G2 es el mismo render recodificado a 6 Mbps máx. para que entre en git (61 → 16,7 MB): PSNR contra el original 47,9 dB
  de promedio y 43,8 dB en el peor cuadro, o sea sin diferencia visible; misma duración (58,00 s), 24 fps, audio silencioso copiado.
- G4 también está recodificado a 6 Mbps máx., crf 18 (60,4 → 21 MB; PSNR 49,2 dB de promedio, 44,2 dB en el peor cuadro).
- G5 (3ra pasada, 9-oct: «cabe en ±0,03», «el medidor avisa: lo reviso a ojo», «lo inventó el motor») también está recodificado a 6 Mbps máx., crf 18 (37,8 → 13,1 MB; master SHA-256 `133346a5fbec4ebfe2f523ca2a4598ee0d9cd6f232d2ee654a4d85ba7564aaea`; PSNR 50,6 dB de promedio (53,0 dB promediando los cuadros), 43,97 dB en el peor cuadro).
- Todos son 1080×1920, H.264 + AAC (silencioso: D4, sin voz ni música), 24 fps.

## Orden y ritmo (plan v5 §5: hasta 3 piezas por semana, 19:00 La Paz)

| Semana | Pieza | Por qué en ese orden |
|---|---|---|
| 1 · día 1 | **G1** (reel) | Abre la cuenta: enseña el método y declara la IA en el cuadro 0 |
| 1 · día 1-2 | **L01** (carrusel, se fija) | Presentación; va **después** de G1 y se fija al perfil |
| 1 · día 3-4 | **G3** (reel) | Errores que atrapé: confianza y el dato que más se guarda |
| 2 · día 1 | **C1** (carrusel) | Repite G1 en formato guardable con la orden real |
| 2 · día 3 | **G2** (reel) | La prueba de los seis clips; usa lo aprendido en G1/G3 |
| 2 · día 5 | **G4** (reel; guion aprobado el 10-oct, falta «mostrada, publicá G4») | Seis motores de imagen |
| 2 · día 5 / 3 · día 1 | **G5** (reel; guion aprobado el 10-oct, falta «mostrada, publicá G5») | Cómo se mide una cara y cuándo no creerle al número; cierra la serie de pruebas |
| 3 · día 1 | **C2** (carrusel) | Formato guardable de G4: `hermes-content/carousels/out/lucia-c2-seis-motores-de-imagen/`, pie en `briefs/lucia/c2-seis-motores-de-imagen.json`. Sale después de G4 |

El token de Instagram de Lucía vence entre el 13 y el 18-oct: **la primera pieza tiene que salir antes**, o hay que renovarlo.

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

> Los dos publicadores ya pasaron `--selftest` en el repo (9-oct, esta sesión): `node ig-reel.mjs --selftest` y `node ig-carrusel.mjs --selftest` dicen
> «selftest ok». En el VPS hay que repetirlo después de copiarlos.

1. Token de Lucía en `/root/.config/onia-publicar/ig-lucia.env` (no se midió desde el 4-sep; vencía entre el 13 y el 18-oct).
   Pasos exactos para ponerlo y renovarlo (camino A si no venció, camino B si venció): `hermes-content/docs/cola/loop/lucia.md`,
   ítem «Renovar el token de Lucía». Una vez puesto, `ig-refrescar.sh` lo renueva cada lunes.
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

Ninguna muestra ni promete una función de Onia, ninguna nombra marcas de terceros (los motores de video van como «Motor 1 a 6» y los de imagen como «Imagen A a F»), no
hay voz, no hay testimonio, no hay cliente. Greps contra la lista de frases prohibidas en `../lucia-gN/qa/grep-prohibidas.txt`
y control de cara en `../lucia-gN/qa/face-gate.txt`.

## Si se pierde el contenedor

Los renders de `out/` se reconstruyen: `videos/lucia-gN/README.md` dice cómo (clips con `job_display` a 0 créditos, `node
scripts/build.mjs`, render de 3 a 4 min). Esta carpeta es la copia que sobrevive.
