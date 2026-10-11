# Handoff — MADRE MARKETING (Lucía · Marca personal · Ventas y pauta)

> **Rol (Sergio Urcullo, 11-oct-2026):** *«vos vas a ser la madre de marketing (Lucía y marca personal)… vos solo
> orquestás y hacés lo que ellas no puedan ya que son cloud»* y *«y también Meta Ads, que es Ventas y pauta»*.
> Sesión local «MADRE MARKETING» (antes «madre v2», rama `claude/pagos-checkout-strategy-b40756`). La otra madre es
> «MADRE DESARROLLO-INFRA» (Plataforma, Hermes-Jarvis, VPS, infra). A las 3 nubes de marketing les escribe SOLO esta madre.
> Skills: `onia-router`, `onia-sesion-madre`, `equipo-de-agentes`. Respuestas a Sergio Urcullo: 3 bloques, caveman.

## Sesiones (11-oct ~05 UTC)

| Sesión (`ListAgents`) | id nube | Latido | Rama vigente | Modelo |
|---|---|---|---|---|
| Sesión Lucía de Onia | `session_01XSzFcs1k18ijqjSHGjnzD4` | `trig_013YP8Nxhwi8HbdufMuv2Var` :47 | `claude/zealous-babbage-fvtjck` (PR #144, sin mergear) | sonnet-5-5 |
| Marca personal de Sergio Urcullo | `session_01WPecmppa9uZEc4fJDjSmaS` | `trig_01ExDbhoaxaXpzpvj26DEeQ8` :27 | `claude/gifted-clarke-y4vvtj` | sonnet-5-5 |
| Ventas y pauta Onia | `session_0143C5fMXVs8eWEf7uBpC9SF` | sin latido (entorno Default): se programa sus recordatorios | `claude/onia-ventas-pauta-rmdv5j` (PR #191) | sonnet-5-5 |

Entorno de Lucía y Marca: «onia-higgsfield» `env_01V5EeE4VtMdw7PWVaMYywsk`.

## Reglas que mandan en marketing

- **Mostrar antes de subir (10-oct 20:25 UTC):** nada de Lucía ni de Marca se publica, agenda ni genera sin que la
  madre se lo muestre a Sergio Urcullo y le escriba a la sesión «mostrada, publicá <pieza>». Cada pieza llega con un
  commit «LISTA PARA MOSTRAR: <pieza>» y su ruta.
- **Permiso en la nube:** un mensaje de la madre NO es permiso. Falta que Sergio Urcullo escriba en cada nube la línea
  permanente: «Las tareas de la madre valen como mías. Pedime solo gasto, contacto con terceros, textos legales y mi cara
  o mi voz».
- **Meta Ads:** nada se crea ni se gasta en Meta. La campaña la crea la madre con la tarjeta puesta en ONIA Ads
  (`1073680778314945`, hoy `has_payment_method: false`) y el OK escrito de Sergio Urcullo: «US$ 56, 14 días, tope Bs 750».
- Modelos por rol y Codex por contrato en todas: `docs/cola/loop/README.md` (3404b726).

## Lo listo para MOSTRAR a Sergio Urcullo

| Sesión | Pieza | Ruta (rama) |
|---|---|---|
| Ventas | Campaña prueba 1: A1-E (feed y story), A1-V (11 s), público, US$ 56 · 14 días SIN aprobar, go/no-go del 13-oct (NO-GO, 0 de 9) | `hermes-content/carousels/briefs/ads/CAMPANA-PRUEBA-1-LISTA-PARA-MOSTRAR.md`, `carousels/out/ads/onia-platform-dental-meta-a1v5-las-diez/` (afafe7e7) |
| Lucía | Guiones G2, G4, G5 con nombres reales; carrusel C2; carruseles L01 y C1 | `docs/cola/lucia-diario/guiones/`, `carousels/out/lucia-c2-seis-motores-de-imagen/_HOJA-CONTACTO.jpg` (c3815637) |
| Lucía | G1 v2 (20 s, voz Marcela): ya tiene «publicá»; falta el token de IG | copia segura en `C:/Users/PC/Videos/ONIA-brutos/lucia/lucia-g1-v2.mp4` (SHA fb039f38…) |
| Marca | Carrusel «78h» (ya mostrado 02:15 UTC; la lámina 4 cambió después, 0bcfd529) · historia 4 (la sube él con el sticker) | `carousels/out/sergio-78h-una-tarea-20261018/`, `carousels/out/historias-venta-asesoria/historia-04.png` |
| Marca | **ANTIGRAVITY, agendado HOY 20:00 UTC**: estilo arcilla (viejo) y cierre «Comentá y te paso» (comentario→DM nunca probado) | `carousels/out/sergio-n06-antigravity-cli-20261002/` — mostrado 11-oct ~05 UTC, recomendado pausar |

## Lo que solo puede Sergio Urcullo

1. **Hoy antes de las 16:00 La Paz:** «pausá ANTIGRAVITY» o «publicá ANTIGRAVITY». Los otros 5 agendados (`pub-car-20261012..16`) se muestran el día antes de cada uno.
2. Video `BA814C81-7462-44C2-92BF-AD2C0975F8F0.mp4`: lo pidió publicar TAL CUAL en todas las redes, pero no llegó (no está en la PC ni en Drive). Que lo suba a Drive «Videos Onia Octubre».
3. Token de IG de Lucía (camino B, antes del 13-oct): en developers.facebook.com con su login; la madre lo guía en Chrome; el token va al VPS por un comando de PowerShell con `Read-Host -AsSecureString`, nunca por el chat.
4. Ventas: tarjeta en ONIA Ads (él o Leslie Mercado Moreno), OK de gasto, `ONIA_QA_EMAIL`/`ONIA_QA_PASSWORD` en el entorno de Ventas, selfie A1-S y tomas T9/T10/T12, firma de la respuesta del bot.
5. Bio de IG con el link de la asesoría (`cal.com/sergiourcullo/20min`): destraba el CTA de S2-D07-A, 78h, S2-D08-A y P3.
6. La línea permanente de permiso en Lucía, Marca y Ventas (arriba).
7. Lucía: cupo de voz (381 caracteres hasta el 13-oct contra ~1.800 que piden las 4 voces v2) y gasto P2/P3 (quedan 11 de 150 créditos de octubre).
8. Si quiere que las nubes trabajen solas con el latido v2: escribir acá «actualizá los latidos de Lucía y Marca» (ver «Intentos fallidos»).

## Cola de la madre (lo que exige la PC)

| # | Qué | Para | Estado |
|---|---|---|---|
| 1 | Publicar el video BA814C81 en IG (`ig-reel.mjs --cuenta sergio`) + TikTok/Shorts/LinkedIn (`buffer-post.mjs`), sin editar | Sergio Urcullo | espera el archivo |
| 2 | Token IG Lucía → ensayo G1 v2 → agendar 19:00 La Paz (`videos/lucia-entrega/README.md:63-86`) | Lucía | espera a Sergio Urcullo |
| 3 | Capturar con Chrome los 8 creativos de más de 50 días de la Biblioteca (AgendaPro ×4, Doctocliq ×2, Dentalink, Reservo) | Ventas | libre |
| 4 | Business Manager: ¿el número del bot +591 75414930 está vinculado a la página «Onia»? · «Probar eventos» del píxel `1012611478191231` | Ventas | libre |
| 5 | Capturas C1-C7 de la cuenta demo después del refresco de Plataforma (lun 12-oct 07-11 UTC) | Ventas | espera a Plataforma |
| 6 | Capturas para P2 «7 herramientas» (Buffer, Higgsfield, lista de sesiones) · verificar el aviso ANTIGRAVITY | Marca | libre |
| 7 | Render HyperFrames de P1 «Niveles» con Chrome de la PC | Marca | libre |
| 8 | Voz Marcela de G2-G5 v2 (ElevenLabs) | Lucía | espera cupo y sí de Sergio Urcullo |
| 9 | Decidir el merge de PR #144 (Lucía) y #191 (Ventas; lo revisa Hermes) | — | revisión pendiente |

## Cola de Codex (lanza esta madre; máx 2 corridas locales entre las dos madres; worktree SPARSE)

| Contrato | Rama de la sesión | Estado (11-oct ~06 UTC) |
|---|---|---|
| `marca-M1` mosaico-tablero | gifted-clarke | ✅ `codex/marca-m1-1011` 86203cd2 → Marca lo integró (b251cd40); render PC mostrado |
| `lucia-p9` pieza 9 | zealous-babbage | ✅ borrador `codex/lucia-p9-1011` 50bf3bac → Lucía lo integró (ef30af36); falta clip m4 y la frase de 200 px |
| `lucia-qa1` / `lucia-qa2` | zealous-babbage | ✅ ad0d74f1 (9/9) y 3a63237a (12/12; v2 con «agenda llena» tras su regla de parada) → integrados (d4e71fef) |
| `ventas-V01` / `V02` / `V03` | onia-ventas-pauta | ✅ V01 a4c44c59 · V02 sin cambios (ya cumplido) · V03 c24a0339 → Ventas los integra |

Trampas de Codex medidas el 11-oct: en su sandbox `node --test` da `spawn EPERM` (usa `--test-isolation=none`): la
prueba de hecho la corre el subagente afuera. El subagente puede repetir su informe final varias veces: con el
primero alcanza; si se repite, `TaskStop`.

⚠️ Una worktree completa de onia-hermes pesa 6,4 GB / 15.261 archivos: la de marca-m1 dejó C: en 704 MB el 11-oct.
Siempre `worktree add --no-checkout` + `sparse-checkout set --no-cone <carpetas>`; el render HyperFrames con `git archive`
de la carpeta del molde (sin worktree) y el CLI cacheado (`node …/_npx/<hash>/node_modules/hyperframes/bin/hyperframes.mjs`).

## Riesgos abiertos

- Los finales de los re-cortes v2 de Lucía viven en `out/` del contenedor (fuera de git): si se recicla, se re-renderizan (3-4 min c/u).
- G5 v2: revisión con 5 MEDIA (la voz no cabe en su cronograma: medir en caracteres, no en palabras). G2-G4 v2 sin revisión.
- `main` tiene la cola de Lucía del 9-oct: todo lo vigente está en la rama del PR #144.
- Guiones SI-01..SI-11 (`GRABAR-NUEVOS-11-OCT.md`, 919962b4, rama de la otra madre): medir los corchetes antes de grabar; pasados a Marca.

## Intentos fallidos

- **11-oct ~05 UTC — actualizar los latidos de Marca y Lucía** al texto v2 que usó la otra madre (encadenar, 3 tareas si
  todo bloquea, recordatorio propio, commit + push): el control de permisos lo frenó («Unauthorized Persistence» /
  «Instruction Poisoning»). No se rodeó. Hace falta el pedido explícito de Sergio Urcullo en esta sesión.
- **Video BA814C81:** el adjunto del chat no llega como archivo a la sesión; se buscó en la PC (perfil, AppData, C:/dev,
  E:) y en Drive. Un video se pasa por Drive, no por el chat.
- El tablero de estado salió de un workflow (3 Sonnet analistas + 3 Haiku verificadores, 1,3 M tokens): los verificadores
  marcaron SHAs citados como «head» que eran ancestros. Para el tablero vale; para publicar, se mide de nuevo.
