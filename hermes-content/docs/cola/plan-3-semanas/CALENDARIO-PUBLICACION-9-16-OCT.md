# Calendario de publicación · viernes 9 → viernes 16 de octubre

Pedido de Sergio Urcullo, 8-oct: *«ordenemos a qué hora publicarás más los trial reels y recordá tus carruseles»*.
Horas en La Paz. Los horarios son iniciales (reglas de `FLUJO-DIARIO.md`) y se ajustan con datos de Instagram:
primera revisión el **lunes 19-oct**.

## Reglas fijas del día

| Hora | Qué sale | Dónde | Cómo |
|---|---|---|---|
| antes de 12:30 | Aviso del día en la comunidad | WhatsApp, Avisos | lo pega Sergio Urcullo |
| **12:30** | **Video A** | Instagram | `ig-reel.mjs` |
| 12:35 | el mismo video | TikTok · YouTube Shorts · LinkedIn | Buffer |
| **13:30** | **Yap de A** (otro gancho, 30-45 s) | Instagram **Trial** | `ig-reel.mjs --trial auto` |
| 13:35 | el mismo yap | TikTok · YouTube Shorts | Buffer |
| **16:00** | **Carrusel** | Instagram | `ig-carrusel.mjs` (timer) |
| 16:01 · 16:02 | el mismo carrusel | LinkedIn · TikTok | Buffer (timer) |
| 16:05 | el carrusel, compartido a su historia, con sticker de la comunidad | Instagram historias | lo hace Sergio Urcullo |
| **18:30** | **Video B** | Instagram | `ig-reel.mjs` |
| 18:35 | el mismo video | TikTok · YouTube Shorts · LinkedIn | Buffer |
| **19:30** | **Yap de B** | Instagram **Trial** | `ig-reel.mjs --trial auto` |
| 19:35 | el mismo yap | TikTok · YouTube Shorts | Buffer |
| 21:00 | **Paquete del día siguiente** para Sergio Urcullo: tabla de cortes, preview y captions | su chat | lo manda Claude |

- **Por día:** 2 videos + 2 yaps = 4 reels, más el carrusel.
- **Yaps:** uno por video esta semana, a +1 h del principal. El segundo yap se suma cuando veamos qué gancho rinde.
- **Trial** es solo de Instagram. Los yaps también salen en **TikTok y YouTube Shorts** como videos normales, con su
  otro gancho. A **LinkedIn** no: ahí repetir el mismo tema el mismo día cansa.
- **Regla de oro:** nada se corta sin que Sergio Urcullo vea antes la tabla de cortes. Si el bruto sube hasta las
  18:00, el paquete llega ese día a las 21:00 y sale al día siguiente.

## Calendario

Carrusel de todos los días: 16:00 · 16:01 · 16:02, ya agendado.

| Día | Carrusel 16:00 | Video A · 12:30 (yap 13:30) | Video B · 18:30 (yap 19:30) |
|---|---|---|---|
| **Jue 8** | HISTORIA (K3) | — | — |
| **Vie 9** | COMUNIDAD (N03) | — | **N03 modo auto** (v2, agendado) |
| **Sáb 10** | HOOK (K11) | **N07** Haiku 5.5 | **D03-A** hook que commitea |
| **Dom 11** | ANTIGRAVITY (N06) | **N06** Antigravity | **N04** skill verify |
| **Lun 12** | PRUEBAS (K4) | **S2-D08-A** promesa del bot | **DD-A** caché de OpenAI |
| **Mar 13** | PROMPT (K8) | **D01-C** YouTube Opus o Sonnet (lo sube Sergio Urcullo) | — |
| **Mié 14** | BRIEF (K7) | **S2-D07-A** ventana de 24 h | **N02** Sonnet 4.5 se apaga |
| **Jue 15** | SKILL (K2) | **D01-A** primera skill | **D02-A** esfuerzo |
| **Vie 16** | PROMESA (K6) | **D04-C** verificar es mirar | **D05-A** dos sesiones |

- **Por qué este orden:**
  - lo perecedero va primero: Haiku 5.5 salió el 7-oct;
  - cada video cae el mismo día que un carrusel del mismo tema, o al lado: HOOK sáb, ANTIGRAVITY dom, SKILL jue;
  - el martes queda liviano: el YouTube es el trabajo del día.
- **Mar 13:** del YouTube salen 2 cortes verticales de ~45 s. Van de reel A el mié 14 o de yap.

## Qué ya está agendado en el servidor

- **Carruseles:** 27 timers del 8 al 16-oct (IG · LinkedIn · TikTok).
- **N03:** vie 9, 18:30 IG y 18:31-18:33 TikTok, YouTube Shorts y LinkedIn.

## Qué falta agendar

- Cada video y su yap, cuando Sergio Urcullo vea su tabla de cortes. Se agendan con `agendar-publicacion.sh`
  (hora UTC = La Paz + 4).
- Yap de N03: no existe. Se hace con el bruto cuando haga falta el hueco del vie 9 a las 19:30.
- Los 7 carruseles en espera (K1, N02, K9, K12, K5, K13, K10) entran del 17-oct en adelante, cuando se rehagan las
  láminas.
