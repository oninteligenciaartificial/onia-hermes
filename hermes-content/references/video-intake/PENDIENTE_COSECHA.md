# Cosecha del DM — lo que falta analizar

**2026-08-23.** El lote se cortó por costo, no por error. Todo el material pesado ya está
bajado y medido: retomar cuesta poco.

## Estado

| | |
|---|---|
| Posts en el hilo de DM | 143 |
| Nuevos (no estaban en el corpus) | 93 |
| Pasaron el triaje por caption | 32 |
| Con ficha escrita | **15** → [prompts P1–P15](PROMPTS_LOTE_2026-08-23-COSECHA.md) |
| **Faltan** | **17** |

## Los 17 que faltan

| Item | Cuenta | Por qué entró al triaje |
|---|---|---|
| [`DbwYVdakguX`](https://www.instagram.com/p/DbwYVdakguX/) | @cormacbuilds | founder-led + herramienta de build en pantalla |
| [`DcHLI8BhG7q`](https://www.instagram.com/p/DcHLI8BhG7q/) | @rafa_padelcoach | lead magnet = curso gratis por DM; molde de conversión |
| [`DcIQi2Rzqo5`](https://www.instagram.com/p/DcIQi2Rzqo5/) | @seangstewart | estructura de guion para reel |
| [`DcJ9DjtvHOP`](https://www.instagram.com/p/DcJ9DjtvHOP/) | @juancereigido | agente de voz que se deja interrumpir — producto IA |
| [`DcRJMuuR7wK`](https://www.instagram.com/p/DcRJMuuR7wK/) | @abigaildaniellla | banco de hooks |
| [`DcXDtDgpWfN`](https://www.instagram.com/p/DcXDtDgpWfN/) | @bbprgastro360 | venta B2B por resultados, rubro gastronomía (rubro nuestro) |
| [`DU8c85bjaHu`](https://www.instagram.com/p/DU8c85bjaHu/) | @bolivianelectricoficial | Bolivian Electric — empresa vinculada |
| [`DY0V6yLvXji`](https://www.instagram.com/p/DY0V6yLvXji/) | @soy_leobut | idea de negocio: lavadero automático como vertical |
| [`DY7ZMNAGyvE`](https://www.instagram.com/p/DY7ZMNAGyvE/) | @frostechgmz | homelab rack — toca Onia Box on-premise |
| [`DYHlcMRPz2D`](https://www.instagram.com/p/DYHlcMRPz2D/) | @lorenzoenchina | estaciones de batería en China — importación + EV |
| [`DZGnnBcN9PR`](https://www.instagram.com/p/DZGnnBcN9PR/) | @importaya.internacional | estación de carga móvil EV — el negocio, no la caja |
| [`DZszIEyvfPU`](https://www.instagram.com/p/DZszIEyvfPU/) | @realmarcomachado | founder-led content para marca personal 2026 — toca el frente bloqueado |
| [`Da7vectlOhD`](https://www.instagram.com/p/Da7vectlOhD/) | @htx_studio | producción creativa (177 s, 81 cortes) |
| [`Db4JfpxJI5B`](https://www.instagram.com/p/Db4JfpxJI5B/) | @joaquin_janeiro | sin caption — se decide mirando |
| [`DbZUECCvLTh`](https://www.instagram.com/p/DbZUECCvLTh/) | @imagenes_3ddy | 3D, sin caption — se decide mirando |
| [`DcOWECjxFom`](https://www.instagram.com/p/DcOWECjxFom/) | @nicktarmo | sin caption — se decide mirando |
| [`DKlDCsaStx2`](https://www.instagram.com/p/DKlDCsaStx2/) | @collinskey | sin caption — se decide mirando |

## Lo que YA está hecho y no hay que repetir

En el scratchpad de la sesión (fuera del repo, se pierde al limpiarlo):

- los 32 MP4 / láminas bajados
- 24–40 fotogramas por densidad de texto de cada video
- los captions de los 93
- **duración y cortes medidos con ffmpeg** de los 26 videos

Si el scratchpad ya se limpió, se rehace corriendo el cosechador otra vez: la sesión de
Instagram queda guardada en `.hermes/ig-session/profile-dm`.

## Por qué se cortó

Costo. Cada agente lee 30–50 fotogramas JPEG a 1080px, y una imagen así cuesta del orden de
1.000–1.500 tokens: ~50.000 tokens por agente **sólo en mirar**. Las dos tandas anteriores
gastaron 3,20 M y 2,00 M; ésta iba camino a 4–5 M.

**Antes de retomar, aplicar el abaratamiento** (ver `2026-08-23-costo-del-analisis.md`):
fotogramas a 640px y leer 12 densos en vez de 40 baja el costo a ~1/5 sin perder el texto
en pantalla, que es lo único que hay que leer.

## Y los 61 descartados

De los 93 nuevos, 61 se descartaron en el triaje por caption: memes, fútbol, autos, humor,
música y noticias. Un DM personal trae de todo. La lista completa quedó en el scratchpad;
no se versiona porque no aporta.
