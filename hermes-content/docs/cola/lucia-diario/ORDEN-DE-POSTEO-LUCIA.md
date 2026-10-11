# Orden de posteo de Lucía — calendario único

> Creado el 11-oct-2026 por la sesión Lucía (nube), por orden de la madre marketing (pedido de Sergio Urcullo: «orquestás vos la edición y los posteos»).
> **Es un calendario, no un permiso.** Nada se publica sin que la madre escriba **«mostrada, publicá <pieza>»** (regla del 10-oct, `cola/loop/lucia.md`).
> Estructura de la semana: `PLAN.md` §4-bis (lun reel «La prueba», mié carrusel «Para guardar», vie reel corto «El error»). Orden de las piezas: `PLAN.md` §5.
> Hora: **19:00 La Paz = 23:00 UTC** (restar 4 h; en el agendador se escribe en UTC). Red: Instagram (`@lucia.antelo.oficial`); TikTok no tiene cuenta todavía.

## Calendario (fechas si el token existe el lunes 12-oct; si no, se corre entero, ver «Si se atrasa»)

| # | Día · hora La Paz | Pieza | Red | Archivo (entrega) | Estado al 11-oct | Qué falta antes |
|---|---|---|---|---|---|---|
| 1 | Lun 12-oct · 19:00 | **G1 v2** «Este video no fue grabado» (reel 20 s, voz Marcela) | IG | lo envía la madre (la armó ella) | **BLOQUEADA** | Token IG (`ig-lucia.env`) · SHA de G1 v2 · «mostrada, publicá G1 v2» |
| 2 | Mié 14-oct · 19:00 | **L01** «Hola, soy Lucía. No existo.» (carrusel, se fija) | IG | `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png` | Lista | Después de G1; «mostrada, publicá L01» |
| 3 | Vie 16-oct · 19:00 | **G3 v2** «Tres errores que casi publico» (reel 27,9 s) | IG | `videos/lucia-entrega/g3-v2-final-1080x1920.mp4` (mudo) → versión con voz | Lista **muda** | **Voz** (412 car, cupo hoy 381; ver `LOTE-VOZ-MARCELA.md`) · SHA con voz · «mostrada» |
| 4 | Lun 19-oct · 19:00 | **G2 v2** «Misma orden, seis clips: ¿quién pierde la cara?» (27,8 s) | IG | `videos/lucia-entrega/g2-v2-final-1080x1920.mp4` | Lista **muda** | Voz (415 car) · decisiones abiertas de la madre sobre G2 en `lucia-entrega/README.md` · «mostrada» |
| 5 | Mié 21-oct · 19:00 | **C1** «Un video sin grabar, en 3 pasos» (carrusel) | IG | `hermes-content/carousels/out/lucia-c1-un-video-sin-grabar/slide-01..05.png` | Lista | Después de G1 (repite su enseñanza) |
| 6 | Vie 23-oct · 19:00 | **G5 v2** «Cómo mido si una cara es la de Lucía» (26,6 s) | IG | `videos/lucia-entrega/g5-v2-final-1080x1920.mp4` | Lista **muda** | Voz (418 car) · decisión de la madre sobre el 0,35 de Kling O1 Image |
| 7 | Lun 26-oct · 19:00 | **G4 v2** «Seis motores de imagen, una cara» (28,0 s) | IG | `videos/lucia-entrega/g4-v2-final-1080x1920.mp4` | Lista **muda** | Voz (444 car) |
| 8 | Mié 28-oct · 19:00 | **C2** «Seis motores de imagen: cuánto cuesta y cuánto se parece» (carrusel) | IG | `hermes-content/carousels/out/lucia-c2-seis-motores-de-imagen/slide-01..05.png` | Lista | Después de G4 |
| 9 | Vie 30-oct · 19:00 | **P9** «¿La cara o la escena?» (reel 20 s) | IG | `videos/lucia-entrega/p9-final-1080x1920.mp4` (mudo, SHA `49b40ea5…9e04`) | **LISTA PARA MOSTRAR** muda (11-oct, v3.1) | Voz (311 car; cupo 381) · «mostrada, publicá P9» |
| 10+ | desde Lun 2-nov | Pruebas nuevas (rotación de 4 semanas: P1, P2, P3, L2, L3) | IG | — | Sin producir | Cada una pide su sí de gasto en esta sesión (`PLAN.md` §5, punto 4) |

Cada fila sale como **máximo una por día** y **hasta tres por semana**. La historia de IG es un extra que se suma cuando haya seguidores.

## Qué hago yo con cada «mostrada, publicá <pieza>» (y qué no)

1. Verifico que el archivo sea el mostrado: SHA-256 contra `videos/lucia-entrega/README.md`; paso `node scripts/lucia-prohibidas.mjs <pie.txt>` (exit 0); el pie abre con «Personaje hecho con IA».
2. Dejo el comando EXACTO para el VPS. **Esta nube no tiene `ssh`** (comprobado el 11-oct: no hay binario), así que lo corre la madre:

```bash
# ensayo (Instagram procesa y valida, NO publica; el reel debe decir FINISHED, el carrusel «listo en Instagram … etiqueta IA»)
node /root/bin/ig-reel.mjs --cuenta lucia --video <archivo>.mp4 --caption <pie>.txt
# agendado a las 19:00 de La Paz (23:00 UTC); la fecha va en UTC
agendar-publicacion.sh lucia-<pieza> "AAAA-MM-DD 23:00:00" node /root/bin/ig-reel.mjs --cuenta lucia --video <archivo>.mp4 --caption <pie>.txt --publicar
# carrusel (cinco láminas en una carpeta)
node /root/bin/ig-carrusel.mjs --cuenta lucia --dir <carpeta con las 5 láminas> --caption <pie>.txt --publicar
```

3. Después de publicar, la madre abre el permalink, confirma «Información de IA» y que `is_ai_generated` quedó en `true` en `/root/publicar/publicado.jsonl`; yo anoto el enlace aquí, en la columna Estado.
4. **No** publico, no agendo ni genero voz o video por mi cuenta. Voz: `LOTE-VOZ-MARCELA.md` (pide un sí escrito). Gasto en Higgsfield: cotizo antes y espero el sí.

## Si se atrasa (el token todavía no existe)

- El token vence entre el 13 y el 18-oct (sin medir). La primera pieza tiene que salir **antes**, o hay que sacar uno nuevo (opción B de `cola/loop/lucia.md`, la que recomiendo).
- Si el lunes 12 no hay token, **se corre toda la secuencia el mismo número de días** y se mantiene el orden. No se publican dos piezas juntas para ponerse al día: eso quema la cuenta nueva y confunde la medición de guardados.
- Los reels mudos (G2–G5, P9) pueden salir sin voz si la madre así lo decide, pero la receta de la semana dice «con voz»; está anotado en `LOTE-VOZ-MARCELA.md`.

## Qué se mide en cada fila

Guardados y envíos (señal de que enseñó algo), seguidores nuevos y que la cuenta siga «apta para recomendaciones». El día 14 de la serie Sergio Urcullo decide con los números delante (`PLAN.md` §5, «Día 14»). La puerta de medición de demos (`onia.com.bo/llamada`) da 404: sin definir.
