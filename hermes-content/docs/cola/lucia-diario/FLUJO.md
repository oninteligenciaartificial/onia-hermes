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
| **Feed** (1/día) | carrusel, foto o reel, según `S*-PIEZAS.md` | Fotos: Seedream + ancla espejo · b-roll: Kling 3.0 · **reels: se editan con `editor-videos` § «Reels de Lucía»** (guion en `S*-GUIONES.md`, instrucción por pieza en `videos/lucia-lNN/INSTRUCCION.md`; Higgsfield solo genera el clip) | 1–12 |
| **Historias** (2–3/día) | recortes del mismo lote + placa de texto | `editor-videos` → `story-batch.mjs`, zona segura .20 | 0 |
| **Yap a Trial** (solo reels) | mismo reel con otro gancho | recorte del mismo video | 0 |

Semana tipo (S1): 3 carruseles (5 cr c/u) + 2 fotos (1 cr) + 1 reel hablando (12 cr) + 1 reel
b-roll (6 cr) ≈ **35 cr/semana ≈ 150 cr/mes**. La bolsa de Higgsfield es una sola para todos los
carriles: este es el techo que pido aprobar.

## Continuidad autónoma vigente —6-oct

La madre ejecuta el preflight al retomar; Lucía toma el siguiente paso reversible sin pedir un permiso por borrador. El selector no genera, renderiza, publica ni gasta: sus resultados guían al carril y no sustituyen la ejecución. La automatización de madre sigue siendo local hasta comprobar cloud.

Desde la raíz del repositorio:

```powershell
node .claude/skills/editor-videos/scripts/lucia-preflight.mjs --repo . --state hermes-content/references/modelos/lucia/v4/kit/estado-montaje.json --out "$env:TEMP/lucia-preflight.json"
```

Estado canónico en `hermes-content/references/modelos/lucia/v4/kit/estado-montaje.json`; activos reutilizados, contratos por pieza, capturas requieren fuente/aprobación registrada. El preview K1 y cutlist/hoja de revisión quedaron versionados en esa misma carpeta; son BORRADOR, sin audio y con CAPTURA PENDIENTE. Revisión de madre por muestra de12fotogramas, no QA exhaustiva de video ni aprobación de identidad. Se ata al SHA256 del video: un cambio invalida la revisión.

Verificado6-oct15:40UTC: K1 y K2 revisados como borradores por muestra visual y SHA; K2 dura36s y tiene12tarjetas, sin audio. K4 ya tiene cutlist validada (35s,11tarjetas); K3 carece del raw registrado y cutlist, con búsqueda en16raíces sin coincidencias documentada en kit/k3-k4-entrega-20261006.md. El selector ahora elige previewK4; sólo procede si renderer, salidas y temporales pueden permanecer enE con dependencias existentes, porqueC está casi lleno. P1/P2, CORREO, EXTRACCION/CONFIGURACION siguen a cargo de madre/producto. Si falta una entrada, registrar bloqueo y continuar otra acción local segura; no fabricar UI ni pasarle la edición a Sergio. Master bloqueado por alcance de este selector; publicación y generación pagada conservan permisos separados.

`listo_para_preview` significa borrador con entradas válidas, nunca listo para publicar. Metadatos no validan claims, watermark ni identidad. El JSON registra la evidencia declarada; no consulta cuentas. Actualizarlo al entregar cutlists/activos y conservar un único dueño por pieza.

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

## Se lanza recién cuando esto está cerrado (Sergio Urcullo, 30-sep)

1. **Identidad para imágenes decidida:** Soul v5 (entrenado con las fotos v4 aprobadas) contra
   Seedream + ancla, mismo QA. Gana el que mida más.
2. **Receta de b-roll aprobada:** 3–4 planos de prueba (Cinema Studio 3.0, Kling 3.0, Seedance
   Mini y un preset viral) sobre el mismo still, mirados por Sergio Urcullo.
3. **Tendencias entrando por Hermes** (formatos, audios, ganchos del nicho), no de memoria.
4. Los puntos de la tabla de abajo.

Estado al 30-sep 19:50 UTC (lote de prueba, tope 75 cr aprobado por Sergio Urcullo):
1. Soul v5 entrenando (`cd42c065…`, 25 cr); el A/B se hace cuando esté `ready`.
2. B-roll: Kling 3.0 ganador provisorio por medición (7,5 cr / 6 s); falta el OK de Sergio Urcullo
   mirando el comparativo. Cinema Studio 3.0 sin probar (bloqueado por permisos, 0 cr).
3. Tendencias: pedido hecho a control (manifest); el loop `tendencias` sigue congelado.

La mayoría de los reels son **b-roll + voz o texto**; Lucía hablando a cámara es la excepción.

## Dónde se publica (decidido 1-oct)

- **Instagram (feed, reels, historias) y Facebook:** por la app propia `OnIA Social API`, igual que
  Sergio Urcullo (`ig-reel.mjs --cuenta lucia`, `ig-carrusel.mjs`, `agendar-publicacion.sh` en el VPS).
  Gratis y ya probado con `sergio` y `oniahq`.
- **TikTok:** por **Buffer**, con un canal nuevo para Lucía (crear la cuenta TikTok de Lucía y conectarla
  a Buffer es trabajo de la madre en la PC). Los reels salen 9:16 y sirven igual.
- No hace falta un Buffer aparte para Instagram: duplicaría el canal propio.

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
- **Lucía nunca es clienta, odontóloga ni testimonio.** Puede llevar el ambo como vestuario, pero nunca dice ni da a
  entender que es del rubro (Sergio Urcullo, 3-oct). No promete resultados («agenda llena»).
- **Lip sync:** medido el 30-sep, MiniMax H3 gana a Seedance Mini pero ninguno sincroniza fino.
  Reels hablando: frases cortas, subtítulos grandes, y `sync_so` (~22 cr) sólo en la pieza que lo pida.
