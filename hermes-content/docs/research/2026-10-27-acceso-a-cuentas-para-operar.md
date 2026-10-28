# Que los agentes vean y operen las cuentas de Sergio Urcullo (27-oct-2026)

Pedido de Sergio Urcullo: *«quiero que pueda ver mis perfiles, páginas o lo que sea para que pueda operar sin mí,
investigá y decime qué se necesita»*. Esto lo investiga; no instala, no inicia sesión ni lee claves. El procedimiento
que manda es `hermes-content/skills/seguridad-credenciales.md`.

## 1. Lo que hay hoy (medido el 27-oct)

| Pieza | Estado |
|---|---|
| Bóveda KeePassXC | No está en `C:/Users/PC/BovedaPrivada/Agentes.kdbx`. Esa carpeta solo tiene `BrowserProfiles/`, vacía, y otros archivos. Buscarla en otras carpetas lo frenó el control de permisos (exploración de credenciales): dónde está lo dice Sergio Urcullo |
| Perfil de navegador dedicado | `BrowserProfiles/` existe y está vacía: no hay ningún perfil armado |
| Registro de accesos (`hermes-content/config/accesos-personales.json`) | 11 apps, ninguna verificada. Google: entrada informada. Higgsfield: pendiente tras el cierre de sesión del 28-sep. SIAT: solo manual |
| Conectores de las sesiones de Claude Code en la PC | Meta Ads (ve ONIA Ads, sin método de pago), Gmail, Calendar, Drive, Notion, Figma y TikTok Ads |
| Claude in Chrome | Instalado según el 28-sep; hoy sin ningún Chrome conectado |
| Hermes de la PC | Sin logins prestados (26-oct). Su navegador local arranca limpio, sin ninguna sesión |
| Buffer | Solo Instagram conectado (la clave vence el 29-sep-2027). Faltan YouTube, TikTok, LinkedIn y Facebook (`handoff/hermes-local.md`) |
| `agent-browser` 0.39.1 (instalado) | Abre un perfil persistente propio con `--profile <carpeta>`, sin copiar cookies |

**Lo que no se usa:** el «real profile browsing» de Hermes (`browser.use_real_profile`, documentación de Hermes
`browser.md`). Copia el perfil activo de Chrome con todas sus cookies y contraseñas guardadas, y eso choca con
`AGENTS.md` §5 («no se copian cookies»). Además arrastraría el correo personal, el banco y el SIAT.

## 2. Diseño: tres capas, de la más firme a la más frágil

1. **API oficial o conector.** No se rompe cuando la página cambia y no viola los términos de la plataforma. Siempre
   primero.
2. **Un perfil de navegador dedicado, «ONIA Agentes»,** solo con las cuentas de trabajo. Sirve para lo que no tiene
   API: leer X, los mensajes directos, la web de Higgsfield, las pantallas de los competidores. Corre en la PC, de a
   un agente por vez y fuera del repo y de OneDrive (`C:/Users/PC/BovedaPrivada/BrowserProfiles/onia`).
3. **Navegador en la nube,** para operar con la laptop apagada. Ya está anotado como pendiente futuro en
   `seguridad-credenciales.md`. Tiene costo y pide su decisión: no entra ahora.

## 3. Cuenta por cuenta

| Cuenta | Para qué | Vía | Qué falta |
|---|---|---|---|
| Instagram (Onia y marca personal) | Publicar · métricas y comentarios · mensajes | Publicar: Buffer (ya). Métricas y comentarios: API de Meta con la app de Onia. Mensajes: perfil dedicado, solo para leer | Medir los permisos del token de Meta del VPS (`META_*`; no se midieron) e iniciar sesión en el perfil dedicado |
| Facebook / Meta Business | Pauta · página | Pauta: MCP de Meta Ads (ya). Página: Buffer y la API de Meta | La tarjeta en ONIA Ads y conectar Facebook en Buffer |
| WhatsApp Business | Mensajes del bot y plantillas | Hoy, el bot con Chatwoot. Después, el MCP oficial de Meta (beta), en solo lectura | Conectarlo en claude.ai; no está confirmado que la beta esté abierta para la cuenta |
| X | Leer lo que pasa · publicar | Leer: perfil dedicado (la API es de pago). Publicar: Buffer | Iniciar sesión en el perfil y conectar X en Buffer |
| TikTok, YouTube, LinkedIn | Publicar · métricas | Buffer, y las métricas de YouTube por la API de Google | Conectar los tres en Buffer |
| Buffer | Programar y medir | El conector oficial (`mcp.buffer.com/mcp`, OAuth) | Conectarlo en claude.ai |
| Gmail, Calendar, Drive | Correo, agenda y archivos | Conectores ya activos en las sesiones de Claude | Nada para las sesiones. Hermes no los tiene, a propósito |
| Higgsfield | Imagen y video | La CLI oficial (con la regla de gasto) | La web queda manual |
| cal.com, Hostinger y otras | Según la tarea | Perfil dedicado | Iniciar sesión cuando haga falta |
| SIAT | — | **Nunca** un agente | — |

## 4. Lo que pone Sergio Urcullo (una sola vez)

1. Decir dónde está la bóveda, o moverla a `C:\Users\PC\BovedaPrivada\Agentes.kdbx`.
2. Abrir el perfil «ONIA Agentes» (Claude le pasa el comando) e iniciar sesión, una por una, en las cuentas de
   trabajo: Instagram de Onia y de la marca personal, Facebook/Meta Business, X, TikTok, YouTube, LinkedIn,
   Higgsfield, Buffer y cal.com. **Nada personal:** ni el correo personal, ni el banco, ni el SIAT. La verificación en
   dos pasos y los CAPTCHA los resuelve él.
3. En Buffer, conectar YouTube, TikTok, LinkedIn, Facebook y X. En claude.ai, conectar el conector de Buffer.
4. Cargar la tarjeta en ONIA Ads. Conectar el MCP de WhatsApp Business en claude.ai, si la beta está disponible.
5. Decidir qué hace el sistema sin él (§6).

## 5. Lo que arma Claude, por PR y sin instalar nada

- Un lanzador del perfil dedicado sobre `agent-browser --profile`, con candado (uno por vez) y bitácora de qué páginas
  abrió. Solo corre en la PC.
- Los trabajadores de la PC lo usan para leer métricas, comentarios, mensajes y la Biblioteca de Anuncios. Puede ser el
  carril `investigacion` con `donde: pc` o un carril nuevo «cuentas».
- Hermes no abre el perfil: lo pide como tarea de la cola y lee el resultado. Así sigue siendo el que planifica, no
  las manos.
- El registro de accesos queda al día con la prueba de cada cuenta: abre y lee, sin escribir nada.

## 6. Qué puede hacer sin él y qué no (con las reglas de hoy)

- **Sin su OK:**
  - leer perfiles, métricas, comentarios, mensajes y la Biblioteca;
  - preparar borradores y dejarlos como borrador en Buffer;
  - avisarle lo que pasó.
- **Con su OK** (desde el celular: una etiqueta o un «ok» en el issue): publicar, responder a un cliente o a un
  tercero, y gastar (pauta, Higgsfield).
- Para que publique o responda solo hay que cambiar la regla «Qué se publica sin preguntar» de `CLAUDE.md` (19-oct).
  Eso lo decide Sergio Urcullo.

## 7. Riesgos

- **Detección de automatización.** Instagram, X y LinkedIn detectan la navegación automática con sesión iniciada y
  pueden trabar la cuenta, incluida la de la marca personal. Por eso: API primero, el perfil solo para leer, poca
  frecuencia y nunca desde el VPS.
- **La restricción del perfil es de contenido y de regla, no técnica.** `agent-browser` no deja combinar `--profile`
  con `--allowed-domains` (lo dice su `--help`). Un agente con el perfil puede hacer todo lo que esas cuentas permiten.
  La barrera es que el perfil tenga solo cuentas de trabajo, que la tarea sea de lectura y que la revise otro modelo.
- **El perfil guarda sesiones vivas.** Va fuera del repo y de OneDrive. Que el disco esté cifrado no se pudo
  verificar.
- **Sin la laptop prendida no corre la capa 2.** Operar 24/7 es la capa 3: otra decisión, con costo.

## 8. Fuentes

- `hermes-content/skills/seguridad-credenciales.md` (procedimiento canónico y estado del 28-sep).
- `AGENTS.md` §5 y `CLAUDE.md` §«Qué se publica sin preguntar».
- Documentación de Hermes en la PC: `user-guide/features/browser.md` («Real profile browsing»).
- `agent-browser --help` (0.39.1), medido el 27-oct.
- `hermes-content/docs/research/2026-10-27-github-que-falta.md` (conectores oficiales de Buffer y de WhatsApp).
- `hermes-content/docs/handoff/hermes-local.md` (Buffer y el perfil de X).
