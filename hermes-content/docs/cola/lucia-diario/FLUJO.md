# Lucía a diario — el mismo formato que Sergio Urcullo, sin cámara

Propuesta del carril Lucía v4 (30-sep-2026), para que Sergio Urcullo la corrija. Copia el
esqueleto de `../plan-3-semanas/FLUJO-DIARIO.md`, con una diferencia: **Lucía no graba; genero
todo yo**. Lo único que pone Sergio Urcullo es el «ok» sobre el paquete.

Quién es y qué vende: `hermes-content/references/modelos/lucia/LUCIA.md` §1 (vende Onia Platform,
tiene lifestyle, métrica única = demos con `src=lucia-*`, etiqueta IA obligatoria, nunca testimonia).
Cómo se genera la cara: `LUCIA-HIGGSFIELD-IDENTITY.json` → `v4.metodo_diario` y
`v4.prompt_clausula_belleza` (la luz la decide la escena).

## Qué sale cada día

| Pieza | Qué es | Cómo se hace | Créditos |
|---|---|---|---:|
| **Feed** (1/día) | carrusel, foto o reel, según `S*-PIEZAS.md` | Seedream + ancla espejo (fotos) · MiniMax H3 (habla a cámara) · Seedance Mini (b-roll) | 1–12 |
| **Historias** (2–3/día) | recortes del mismo lote + placa de texto | `editor-videos` → `story-batch.mjs`, zona segura .20 | 0 |
| **Yap a Trial** (solo reels) | mismo reel con otro gancho | recorte del mismo video | 0 |

Semana tipo (S1): 3 carruseles (5 cr c/u) + 2 fotos (1 cr) + 1 reel hablando (12 cr) + 1 reel
b-roll (6 cr) ≈ **35 cr/semana ≈ 150 cr/mes**. La bolsa de Higgsfield es una sola para todos los
carriles: este es el techo que pido aprobar.

## Un día normal

| Hora (La Paz) | Qué pasa |
|---|---|
| día anterior | Genero las piezas, las mido (`face_identity_qa.py` ≥ 0,70) y las MIRO |
| 21:00 | Paquete del día siguiente: piezas, captions, horario. Sergio Urcullo responde «ok» o corrige |
| 19:00 | Publica el feed (hora propuesta; se ajusta con datos) |
| feed + 1 h / + 3 h | Historias |

Publicación: igual que Sergio, `ig-reel.mjs --cuenta lucia` / `ig-carrusel.mjs` y
`agendar-publicacion.sh` en el VPS, **después del «ok»**. Links a Onia con
`?utm_source=instagram&utm_medium=organico&utm_campaign=lucia-<pieza>`.

## Lo que falta para encender (y de quién es)

| # | Qué | Quién |
|---|---|---|
| 1 | Token de `@lucia.antelo.oficial` en la app `OnIA Social API` (hoy solo hay `sergio` y `oniahq` en `/root/.config/onia-publicar/`). Es un login de Instagram, una vez | Sergio Urcullo (login) + carril infra (guardar el token) |
| 2 | Etiqueta de IA activada en el perfil + «IA creada por @oniahq» en la bio + link con utm | Sergio Urcullo |
| 3 | Voz de Marcela: vive en ElevenLabs con la clave en el VPS. Desde la nube no se genera (Higgsfield da «Voice not found»). O se guarda la clave como secreto del entorno `onia-higgsfield`, o el VPS genera el mp3 | Sergio Urcullo decide |
| 4 | Techo de ~150 cr/mes aprobado | Sergio Urcullo |
| 5 | Lucía en el paquete de las 21:00 y en el resumen de las 06:30 | sesión de control |

## Límites que no se cruzan

- **Venta:** sólo lo que producción cumple hoy (`ONIA_ADQUISICION_Y_PAUTA.md` §5.4). El «paciente
  con tratamiento a medias» recién con la 1.0 publicada. Pieza que vende = captura REAL de Onia.
- **Lucía nunca es clienta, odontóloga ni testimonio.** Escenifica, rotulado.
- **Lip sync:** medido el 30-sep, MiniMax H3 gana a Seedance Mini pero ninguno sincroniza fino.
  Reels hablando: frases cortas, subtítulos grandes, y `sync_so` (~22 cr) sólo en la pieza que lo pida.
