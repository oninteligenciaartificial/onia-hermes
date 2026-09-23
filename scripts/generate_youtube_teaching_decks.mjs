import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const outRoot = path.join(repoRoot, "hermes-content", "carousels", "out");

const decks = [
  {
    slug: "yt-07-hyperframes",
    series: "Sistemas con IA · 07",
    title: "HyperFrames desde cero: videos programables con HTML",
    thumbnail: "HTML → VIDEO",
    promise:
      "Al terminar, la persona podrá construir una composición mínima, validarla y decidir cuándo usar present frente a render.",
    keyword: "HYPERFRAMES",
    slides: [
      {
        eyebrow: "El cambio de modelo mental",
        title: "Un video puede ser una interfaz reproducible, no una edición manual.",
        body: "HyperFrames convierte HTML, CSS y una línea de tiempo determinista en una composición que se puede revisar, versionar y renderizar.",
        visual: flow(["HTML + CSS", "GSAP timeline", "check", "MP4 / deck"]),
        notes:
          "Abrí con una comparación concreta: en un editor tradicional movés capas a mano; acá describís el visual como un sistema. No prometas que reemplaza toda edición. La ventaja aparece cuando necesitás repetir formatos, cambiar datos o validar que una animación siga funcionando.",
      },
      {
        eyebrow: "Cuándo sí usarlo",
        title: "HyperFrames gana cuando el mismo formato cambia muchas veces.",
        body: "Con Node.js 22+ y FFmpeg instalados, reportes, comparativas, demos y series repetibles son mejores candidatos que un vlog improvisado.",
        visual: cards([
          ["REPETIBLE", "Mismo diseño, nuevos datos"],
          ["VERIFICABLE", "Layout, contraste y runtime"],
          ["VERSIONABLE", "El cambio queda en Git"],
        ]),
        notes:
          "Antes de la demo verificá Node.js 22 o superior con node --version y FFmpeg con ffmpeg -version. Después da ejemplos reales: un ranking semanal, una comparativa de modelos o un changelog de producto. Para una entrevista emocional o un vlog, CapCut o Premiere siguen siendo más directos.",
      },
      {
        eyebrow: "La composición mínima",
        title: "El contrato empieza con tamaño, duración y una escena identificable.",
        body: "Sin estos atributos, el motor no sabe qué superficie debe reproducir ni cuánto tiempo existe.",
        visual: code(`&lt;div id="root"
  data-composition-id="main"
  data-start="0"
  data-width="1920"
  data-height="1080"
  data-duration="5"&gt;
  &lt;section data-start="0"
    data-duration="5"
    data-track-index="1"&gt;...&lt;/section&gt;
&lt;/div&gt;`),
        notes:
          "Mostrá el archivo index.html. Explicá cada atributo literalmente: composition-id identifica la pieza; start es el inicio; width y height fijan el canvas; duration limita el tiempo; data-track-index ubica el clip en una pista. No pases todavía a animación.",
      },
      {
        eyebrow: "Movimiento determinista",
        title: "La línea de tiempo queda pausada porque el motor controla cada fotograma.",
        body: "La regla evita que preview y render produzcan estados distintos según la velocidad de la computadora.",
        visual: code(`window.__timelines = {};
const id = "main";

const tl = gsap.timeline({ paused: true });
tl.from("#title", {
  y: 48,
  opacity: 0,
  duration: 0.6
}, 0.2);

window.__timelines[id] = tl;`),
        notes:
          "Subrayá paused: true y el registro en window.__timelines. El motor hace seek a un tiempo exacto. Evitá requestAnimationFrame o temporizadores de pared para contenido que deba renderizarse igual cada vez.",
      },
      {
        eyebrow: "Flujo de trabajo exacto",
        title: "Construí, auditá y recién después decidí si renderizar.",
        body: "Cada comando responde una pregunta distinta; saltarse check convierte un fallo visual en un archivo final.",
        visual: terminal([
          "$ npx hyperframes init mi-video",
          "$ cd mi-video",
          "$ npx hyperframes lint",
          "$ npx hyperframes check --snapshots",
          "$ npx hyperframes preview",
          "$ npx hyperframes render --quality high --output out.mp4",
        ]),
        notes:
          "Ejecutá los comandos en pantalla, no los leas solamente. Lint encuentra errores estructurales rápido. Check abre el navegador y revisa runtime, layout, motion y contraste. Preview es la revisión humana. Render aparece al final y sólo después de aprobación.",
      },
      {
        eyebrow: "La prueba real",
        title: "Que abra en Chrome no demuestra que el render sea correcto.",
        body: "Una composición puede verse bien quieta y fallar al hacer seek, cortar texto, perder contraste o cargar un recurso tarde.",
        visual: compare(
          ["SE VE BIEN", "Un frame", "Tu pantalla", "Sin errores visibles"],
          ["ESTÁ VALIDADO", "Varios tiempos", "Canvas real", "Runtime + layout + contraste"],
        ),
        notes:
          "Mostrá una captura de check. Explicá un error fácil de reconocer: texto que entra desde fuera y queda cortado, o una animación que sólo funciona al reproducir desde cero. La validación automática no reemplaza mirar; hace que la revisión humana tenga mejores señales.",
      },
      {
        eyebrow: "Deck o video",
        title: "Una presentación navegable usa present; un video lineal usa render.",
        body: "Un deck tiene diapositivas discretas, notas y navegación. Renderizar su primera composición puede truncar todo el resto.",
        visual: compare(
          ["PRESENTACIÓN", "npx hyperframes present .", "Flechas + notas", "No genera MP4"],
          ["VIDEO", "npx hyperframes render", "Timeline lineal", "Genera MP4/WebM"],
        ),
        notes:
          "Este deck es el ejemplo: usalo con present y notas de orador. Si querés un MP4, creá una composición principal lineal. No uses render sobre varias slides esperando que las una; actualmente puede resolver sólo la primera.",
      },
      {
        eyebrow: "La parte honesta",
        title: "HyperFrames no elimina el criterio visual ni la revisión final.",
        body: "Automatiza repetición y controles; todavía necesitás jerarquía, ritmo, evidencia y una persona que vea las capturas antes de publicar.",
        visual: checklist([
          "Una idea por escena",
          "Una prueba visible",
          "check sin errores",
          "capturas revisadas",
        ]),
        notes:
          "Contá la limitación sin vender humo: código limpio puede producir una pieza fea, y un check verde no decide si la historia es interesante. Nuestro estándar combina reglas automáticas, snapshots y una revisión humana antes de renderizar o publicar.",
      },
      {
        eyebrow: "En una línea",
        title: "Programá el formato, validá la composición y renderizá sólo al final.",
        body: "Comentá HYPERFRAMES para recibir la composición mínima y el checklist de validación. El siguiente video construye un workflow real en n8n.",
        visual: stamp("COMENTÁ", "HYPERFRAMES"),
        notes:
          "Cerrá repitiendo la secuencia: contrato, timeline, lint, check, preview y render. El recurso está preparado en el repositorio; no digas que ya está automatizada la entrega si todavía se responde manualmente.",
      },
    ],
  },
  {
    slug: "yt-08-n8n-leads",
    series: "Sistemas con IA · 08",
    title: "n8n paso a paso: clasificá leads sin construir un agente",
    thumbnail: "NO USES AGENTE",
    promise:
      "Al terminar, la persona podrá construir un workflow determinista que clasifica un lead, valida JSON y deriva casos sensibles a una persona.",
    keyword: "N8N",
    slides: [
      {
        eyebrow: "La decisión correcta",
        title: "Clasificar un lead no necesita un agente si la ruta ya está definida.",
        body: "La IA interpreta el mensaje; n8n conserva el control de cada paso y de cada salida.",
        visual: flow(["Webhook", "LLM", "Parser", "Switch", "Registro"]),
        notes:
          "Abrí con la polémica: usar AI Agent para todo añade libertad donde no hace falta. En este caso conocemos la entrada, el formato de salida y las rutas. Eso es exactamente lo que un workflow determinista hace bien.",
      },
      {
        eyebrow: "Entrada de prueba",
        title: "Una demo segura empieza con datos ficticios y un contrato pequeño.",
        body: "El Webhook sólo recibe los campos necesarios; no grabes teléfonos, correos, tokens ni conversaciones reales.",
        visual: code(`{
  "name": "Ana Demo",
  "service": "automatizacion",
  "message": "Quiero ordenar los leads que llegan por Instagram"
}`),
        notes:
          "Mandá este JSON al Webhook de prueba. Explicá por qué no usamos información real: una grabación se copia, se recorta y se distribuye. El contrato mínimo también reduce errores posteriores.",
      },
      {
        eyebrow: "Los nodos exactos",
        title: "Siete nodos separan entrada, interpretación, validación, registro y aviso.",
        body: "Cada responsabilidad queda visible; cuando algo falla, sabés dónde mirar.",
        visual: code(`Webhook
  → Basic LLM Chain
      + OpenAI Chat Model
      + Structured Output Parser
  → Google Sheets
  → Switch
      → humano → Telegram
      → web | automatizacion | otro
      → fallback`, true),
        notes:
          "Construí el canvas en vivo. Conectá OpenAI Chat Model y Structured Output Parser como subnodos de Basic LLM Chain. Después Google Sheets registra, Switch distribuye y Telegram avisa sólo en la ruta humana. Si tu versión de n8n cambia una etiqueta, mostrala como aparece en tu pantalla.",
      },
      {
        eyebrow: "Prompt operativo",
        title: "El modelo recibe una tarea cerrada, no permiso para inventar el proceso.",
        body: "La instrucción define categorías válidas y cuándo debe escalar a una persona.",
        visual: code(`Clasificá el mensaje del lead.

Categoría: web | automatizacion | otro
Urgencia: baja | normal | alta
requiere_humano = true si pide precio,
contrato, garantía o una promesa comercial.

Mensaje: {{ $json.message }}`),
        notes:
          "Pegá el prompt y explicá los límites. No le pedimos responder al cliente ni fijar precio. Sólo clasifica. Separar análisis de acción evita que una salida creativa se convierta directamente en una promesa comercial.",
      },
      {
        eyebrow: "Salida obligatoria",
        title: "Structured Output Parser convierte texto libre en datos verificables.",
        body: "El siguiente nodo no debería adivinar si el modelo escribió una lista, una frase o un JSON incompleto.",
        visual: code(`{
  "type": "object",
  "properties": {
    "categoria": { "enum": ["web", "automatizacion", "otro"] },
    "urgencia": { "enum": ["baja", "normal", "alta"] },
    "requiere_humano": { "type": "boolean" }
  },
  "required": ["categoria", "urgencia", "requiere_humano"],
  "additionalProperties": false
}`),
        notes:
          "Pegá este JSON Schema en el parser. Si la salida no cumple la estructura, el nodo falla; si cumple, todavía puede estar mal clasificada. Ejecutá una vez y abrí la salida. Un error visible enseña más que una demo fingidamente perfecta.",
      },
      {
        eyebrow: "Reglas del Switch",
        title: "La ruta la decide una regla auditable, no otra respuesta del modelo.",
        body: "Primero escalamos lo sensible; después distribuimos web, automatización y otros casos.",
        visual: decision([
          ["requiere_humano = true", "Revisión"],
          ["categoria = web", "Pipeline web"],
          ["categoria = automatizacion", "Pipeline automatización"],
          ["categoria = otro", "Bandeja general"],
          ["default", "Bandeja general"],
        ]),
        notes:
          "Mostrá el orden de las reglas. Los casos sensibles salen antes de cualquier automatización comercial. En producción, agregá una ruta default; nunca dejes caer una categoría nueva silenciosamente.",
      },
      {
        eyebrow: "Cuándo sí usar AI Agent",
        title: "El agente aparece cuando el modelo debe elegir la próxima herramienta.",
        body: "Consultar CRM, buscar documentación o pedir un dato faltante son decisiones dinámicas; registrar y avisar siguen siendo workflows.",
        visual: hub("AI Agent", ["get_lead_by_id", "search_docs", "request_missing_field"]),
        notes:
          "Cambiá el problema: ahora el sistema no sabe de antemano qué información falta. Ahí AI Agent puede elegir entre tools pequeñas. Mantené fuera fijar precios, enviar propuestas o prometer disponibilidad sin revisión humana.",
      },
      {
        eyebrow: "Prueba mínima",
        title: "Tres casos revelan más que veinte ejecuciones idénticas.",
        body: "Probá una solicitud normal, una ambigua y una sensible; verificá salida, ruta y registro en cada una.",
        visual: checklist([
          "Web clara → web",
          "Mensaje ambiguo → otro",
          "Precio o contrato → humano",
          "Default nunca se pierde",
        ]),
        notes:
          "Prepará tres payloads antes de grabar. Mostrá la ejecución completa de cada uno o al menos el resultado y la ruta iluminada. No presentes una sola ejecución exitosa como prueba suficiente.",
      },
      {
        eyebrow: "La parte honesta",
        title: "Un JSON válido todavía puede contener una decisión equivocada.",
        body: "El parser valida forma, no verdad. Registrá entradas y salidas, revisá muestras y mantené aprobación humana en acciones sensibles.",
        visual: compare(
          ["FORMA", "Campos presentes", "Tipos correctos", "JSON parseable"],
          ["NEGOCIO", "Categoría correcta", "Riesgo aceptable", "Humano cuando corresponde"],
        ),
        notes:
          "Esta es la limitación central. Structured Output Parser evita formatos rotos, pero no garantiza que la categoría sea correcta. La calidad se mide con casos reales anonimizados y una revisión periódica, no sólo con ejecuciones verdes.",
      },
      {
        eyebrow: "En una línea",
        title: "Usá IA para interpretar y reglas para controlar lo que ocurre después.",
        body: "Comentá N8N para recibir el mapa de nodos, el prompt y los tres casos de prueba. Después construiremos la versión con herramientas.",
        visual: stamp("COMENTÁ", "N8N"),
        notes:
          "Cerrá con la pregunta de arquitectura: ¿quién decide el próximo paso, una regla o el modelo? Recordá que el recurso es el mapa y el schema, no un workflow importable todavía.",
      },
    ],
  },
  {
    slug: "yt-09-mcp-agentes-loops",
    series: "Sistemas con IA · 09",
    title: "MCP, agentes, loops y n8n: cómo se conectan de verdad",
    thumbnail: "NO ES LO MISMO",
    promise:
      "Al terminar, la persona podrá decidir si su caso necesita un workflow, una llamada a un modelo, un agente o MCP, y dibujar límites seguros.",
    keyword: "MAPA",
    slides: [
      {
        eyebrow: "El problema",
        title: "Llamar “agente” a todo produce sistemas más caros y menos controlables.",
        body: "Workflow, modelo, agente, loop y MCP resuelven problemas distintos; mezclarlos oculta quién decide y cómo se detiene.",
        visual: stack(["WORKFLOW", "MODELO", "AGENTE", "LOOP", "MCP"]),
        notes:
          "Abrí diciendo que la diferencia no es semántica. Si elegís una arquitectura con más autonomía de la necesaria, aumentás costo, permisos y superficie de error. El objetivo del video es decidir con un mapa simple.",
      },
      {
        eyebrow: "Workflow",
        title: "Un workflow sigue un camino que existe antes de ejecutarse.",
        body: "Puede tener condiciones, esperas y una llamada a IA; mientras las rutas estén dibujadas, sigue siendo determinista.",
        visual: flow(["A", "B", "IF", "C / D"]),
        notes:
          "Usá el ejemplo de n8n: Webhook, modelo, parser y Switch. La IA puede interpretar lenguaje, pero el Switch conserva la decisión de ruta. Eso no lo hace inferior; lo hace más fácil de probar.",
      },
      {
        eyebrow: "Agente",
        title: "Un agente recibe un objetivo y el modelo elige la siguiente herramienta.",
        body: "La ruta aparece durante la ejecución según lo que observa, siempre dentro de permisos y límites definidos.",
        visual: hub("Modelo", ["CRM", "Documentos", "Pedir dato", "Escalar"]),
        notes:
          "Marcá la diferencia: el modelo decide entre herramientas. No alcanza con poner un nodo llamado AI Agent; las tools deben representar capacidades reales y tener contratos claros.",
      },
      {
        eyebrow: "Loop",
        title: "Repetir una ruta no convierte un workflow en agente.",
        body: "HTTP Request → IF → Wait es determinista; el loop es agentivo cuando el modelo observa y elige la próxima tool.",
        visual: cycle(["PLAN", "ACT", "OBSERVE", "ADJUST"]),
        notes:
          "Explicá la distinción con una consulta de pago. Si reglas fijas revisan status, esperan y vuelven a consultar, es un loop determinista. Es agentivo sólo si el modelo observa el resultado y decide qué herramienta usar después.",
      },
      {
        eyebrow: "Frenos obligatorios",
        title: "Todo loop necesita éxito, máximo de pasos, timeout, presupuesto y salida humana.",
        body: "Las escrituras además necesitan permisos claros y confirmación; sin límites, el sistema repite costo y error.",
        visual: code(`done = status === "paid"
maxAttempts = 3
wait = 10 minutes
timeout = 35 minutes
writeRequiresApproval = true

if attempts >= 3:
  notify_human()`),
        notes:
          "En n8n mostrá HTTP Request, IF, Wait y Telegram. Aclarar que los números son un ejemplo, no una regla universal. Lo permanente es definir éxito, pasos máximos, timeout, presupuesto, aprobación para escrituras y salida humana.",
      },
      {
        eyebrow: "Contrato de una tool",
        title: "Una herramienta bien nombrada reduce decisiones ambiguas del agente.",
        body: "Separá leer de escribir y declarale al modelo input, output y efecto secundario.",
        visual: code(`{
  "name": "get_lead_by_id",
  "description": "Lee un lead por ID exacto; no modifica datos.",
  "inputSchema": {
    "type": "object",
    "properties": { "lead_id": { "type": "string" } },
    "required": ["lead_id"],
    "additionalProperties": false
  },
  "annotations": { "readOnlyHint": true }
}`, true),
        notes:
          "Compará get_lead_by_id con una tool genérica llamada buscar. Explicá que readOnlyHint describe intención, no impone seguridad. Actualizar debe ser otra tool y los permisos reales viven en host, credenciales y servidor.",
      },
      {
        eyebrow: "MCP",
        title: "MCP estandariza la conexión; no decide la arquitectura ni los permisos.",
        body: "Una aplicación de IA puede descubrir tools y datos con un contrato común, pero vos seguís definiendo qué puede leer, escribir y aprobar.",
        visual: bridge("Aplicación IA", "MCP", ["tools", "resources", "prompts"]),
        notes:
          "Mostrá la documentación oficial o una lista saneada de tools. No enseñes tokens. Aclarar: MCP no es un agente, no es memoria y no reemplaza n8n. Es el puente estándar de conexión.",
      },
      {
        eyebrow: "Mapa de decisión",
        title: "La pregunta clave es quién decide el próximo paso.",
        body: "Elegí la pieza mínima que resuelva el problema y agregá autonomía sólo cuando exista una razón verificable.",
        visual: decision([
          ["Ruta conocida", "Workflow"],
          ["Interpretar lenguaje", "Llamada a modelo"],
          ["Elegir herramientas", "Agente + loop"],
          ["Conectar tools estándar", "MCP"],
        ]),
        notes:
          "Recorré cuatro preguntas: ¿la ruta ya está definida?, ¿sólo necesito convertir lenguaje en datos?, ¿el modelo debe elegir la próxima tool?, ¿necesito compartir tools, resources o prompts mediante un protocolo? Podés combinar piezas, pero la combinación no borra responsabilidades.",
      },
      {
        eyebrow: "La parte honesta",
        title: "Más autonomía también significa más permisos, costo y formas de fallar.",
        body: "Para registro, facturación, avisos y rutas conocidas, lo predecible suele ser la decisión profesional.",
        visual: compare(
          ["MÁS AUTONOMÍA", "Decide rutas", "Tolera ambigüedad", "Más superficie de riesgo"],
          ["MÁS CONTROL", "Rutas visibles", "Pruebas simples", "Errores localizables"],
        ),
        notes:
          "No conviertas el video en una defensa contra agentes. Hay problemas que sí los necesitan. La parte honesta es reconocer que autonomía es un costo que se justifica con valor, no una característica que siempre hay que maximizar.",
      },
      {
        eyebrow: "En una línea",
        title: "Workflow define la ruta; agente decide; loop repite; MCP conecta.",
        body: "Comentá MAPA para recibir el árbol de decisión y el checklist de permisos. El siguiente paso es construir un agente pequeño con tres tools.",
        visual: stamp("COMENTÁ", "MAPA"),
        notes:
          "Cerrá pidiendo un caso concreto: clasificación de leads, soporte o investigación con fuentes. Esa respuesta alimenta el siguiente video y el próximo encuentro de la comunidad.",
      },
    ],
  },
];

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function flow(items) {
  return `<div class="flow">${items
    .map(
      (item, index) =>
        `${index ? '<span class="arrow">→</span>' : ""}<span class="flow-node">${escapeText(item)}</span>`,
    )
    .join("")}</div>`;
}

function cards(items) {
  return `<div class="cards">${items
    .map(
      ([title, text]) =>
        `<article class="card"><strong>${escapeText(title)}</strong><span>${escapeText(text)}</span></article>`,
    )
    .join("")}</div>`;
}

function code(value, compact = false) {
  return `<pre class="code${compact ? " compact" : ""}"><code>${value}</code></pre>`;
}

function terminal(lines) {
  return `<div class="terminal"><div class="terminal-top"><i></i><i></i><i></i><span>terminal</span></div><pre>${lines
    .map(escapeText)
    .join("\n")}</pre></div>`;
}

function compare(left, right) {
  const column = (items, accent) => `<div class="compare-col ${accent ? "accent" : ""}">
    <strong>${escapeText(items[0])}</strong>
    ${items.slice(1).map((item) => `<span>${escapeText(item)}</span>`).join("")}
  </div>`;
  return `<div class="compare">${column(left, false)}${column(right, true)}</div>`;
}

function checklist(items) {
  return `<div class="checklist">${items
    .map((item) => `<div><b>✓</b><span>${escapeText(item)}</span></div>`)
    .join("")}</div>`;
}

function decision(items) {
  return `<div class="decision">${items
    .map(
      ([question, answer]) =>
        `<div><span>${escapeText(question)}</span><b>${escapeText(answer)}</b></div>`,
    )
    .join("")}</div>`;
}

function hub(center, items) {
  return `<div class="hub"><div class="hub-center">${escapeText(center)}</div>${items
    .map((item, index) => `<div class="hub-orbit orbit-${index + 1}">${escapeText(item)}</div>`)
    .join("")}</div>`;
}

function cycle(items) {
  return `<div class="cycle">${items
    .map(
      (item, index) =>
        `<div class="cycle-step"><b>0${index + 1}</b><span>${escapeText(item)}</span></div>${
          index < items.length - 1 ? '<i>→</i>' : '<i>↺</i>'
        }`,
    )
    .join("")}</div>`;
}

function bridge(left, center, rightItems) {
  return `<div class="bridge"><div class="bridge-side">${escapeText(left)}</div><div class="bridge-center">${escapeText(center)}</div><div class="bridge-side small">${rightItems
    .map((item) => `<span>${escapeText(item)}</span>`)
    .join("")}</div></div>`;
}

function stack(items) {
  return `<div class="stack">${items
    .map((item, index) => `<span style="--i:${index}">${escapeText(item)}</span>`)
    .join("")}</div>`;
}

function stamp(kicker, keyword) {
  return `<div class="stamp"><span>${escapeText(kicker)}</span><strong>${escapeText(keyword)}</strong><small>Recurso práctico · @sergiourcullo</small></div>`;
}

function renderDeck(deck) {
  const duration = 8;
  const manifest = {
    slides: deck.slides.map((slide, index) => ({
      sceneId: `slide-${index + 1}`,
      notes: slide.notes,
    })),
    slideSequences: [],
  };

  const scenes = deck.slides
    .map((slide, index) => {
      const start = index * duration;
      const id = `slide-${index + 1}`;
      return `<div
        id="scene-${id}"
        class="scene"
        data-composition-id="${id}"
        data-start="${start}"
        data-duration="${duration}"
        data-label="${escapeText(slide.eyebrow)}"
        data-width="1920"
        data-height="1080"
      >
        <section id="clip-${id}" class="frame clip" data-start="${start}" data-duration="${duration}" data-track-index="1">
          <div class="grain" data-layout-ignore></div>
          <div class="topline"><span>${escapeText(deck.series)}</span><span>${String(index + 1).padStart(2, "0")} / ${String(deck.slides.length).padStart(2, "0")}</span></div>
          <main id="content-${index + 1}" class="content">
            <div class="copy">
              <p class="eyebrow">${escapeText(slide.eyebrow)}</p>
              <h1>${escapeText(slide.title)}</h1>
              <p class="body">${escapeText(slide.body)}</p>
            </div>
            <div class="visual">${slide.visual}</div>
          </main>
          <div class="footer"><span>@sergiourcullo</span><span>ONIA · construir, probar, documentar</span></div>
          <div id="progress-${index + 1}" class="progress" data-layout-ignore></div>
        </section>
      </div>`;
    })
    .join("\n");

  const totalDuration = deck.slides.length * duration;
  const sceneRanges = deck.slides.map((_, index) => ({
    id: `slide-${index + 1}`,
    elementId: `scene-slide-${index + 1}`,
    start: index * duration,
    duration,
    end: (index + 1) * duration,
  }));

  const notesJson = JSON.stringify(deck.slides.map((slide) => slide.notes));

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeText(deck.title)}</title>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    :root { --paper:#f4f0e8; --ink:#1d1d1f; --muted:#716d65; --accent:#c76549; --line:#d8d1c4; --dark:#20201f; }
    * { box-sizing:border-box; }
    html, body { margin:0; min-height:100%; background:#171716; color:var(--ink); font-family:Inter, Arial, system-ui, sans-serif; }
    body { overflow:auto; }
    .scene { position:absolute; inset:0; width:1920px; height:1080px; overflow:hidden; background:var(--paper); opacity:0; visibility:hidden; pointer-events:none; }
    .frame { position:absolute; inset:0; overflow:hidden; padding:62px 76px 54px; }
    .grain { position:absolute; inset:0; pointer-events:none; opacity:.22; background-image:radial-gradient(rgba(29,29,31,.15) .7px, transparent .7px); background-size:8px 8px; mask-image:linear-gradient(to bottom, black, transparent 85%); }
    .topline, .footer { position:relative; z-index:2; display:flex; justify-content:space-between; align-items:center; font-size:24px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
    .topline { padding-bottom:22px; border-bottom:2px solid var(--line); }
    .footer { position:absolute; left:76px; right:420px; bottom:31px; font-size:20px; text-transform:none; }
    .content { position:relative; z-index:2; height:850px; display:grid; grid-template-columns:minmax(0,1.08fr) minmax(620px,.92fr); gap:68px; align-items:center; }
    .copy { align-self:center; }
    .eyebrow { margin:0 0 24px; color:var(--accent); font-weight:800; font-size:28px; letter-spacing:.12em; text-transform:uppercase; }
    h1 { margin:0; max-width:1040px; font-size:78px; line-height:1.02; letter-spacing:-.045em; font-weight:760; text-wrap:balance; }
    .body { margin:36px 0 0; max-width:900px; font-size:40px; line-height:1.28; color:#4e4a44; text-wrap:pretty; }
    .visual { min-width:0; display:flex; align-items:center; justify-content:center; }
    .flow { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:18px; }
    .flow-node { padding:24px 26px; border:3px solid var(--ink); border-radius:22px; background:#fffdf8; font-size:34px; font-weight:750; box-shadow:8px 8px 0 var(--accent); }
    .arrow { font-size:52px; color:var(--accent); font-weight:800; }
    .cards { width:100%; display:grid; gap:20px; }
    .card { padding:28px 32px; border:2px solid var(--line); border-radius:24px; background:#fffdf8; }
    .card strong { display:block; margin-bottom:10px; color:var(--accent); font-size:30px; letter-spacing:.08em; }
    .card span { font-size:38px; line-height:1.2; }
    .code, .terminal { width:100%; margin:0; border-radius:26px; background:var(--dark); color:#f9f5ec; box-shadow:18px 18px 0 rgba(217,119,87,.30); overflow:hidden; }
    .code { padding:38px 42px; font:40px/1.34 ui-monospace, SFMono-Regular, Consolas, monospace; white-space:pre-wrap; }
    .code.compact { padding:30px 34px; font-size:31px; line-height:1.28; }
    .terminal-top { display:flex; align-items:center; gap:12px; height:62px; padding:0 26px; background:#2c2c2a; color:#aaa59d; font-size:24px; }
    .terminal-top i { width:16px; height:16px; border-radius:50%; background:var(--accent); }
    .terminal-top i:nth-child(2) { background:#d7b35f; }
    .terminal-top i:nth-child(3) { background:#7fb27a; }
    .terminal-top span { margin-left:auto; }
    .terminal pre { margin:0; padding:30px 36px 38px; font:34px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; white-space:pre-wrap; }
    .compare { width:100%; display:grid; grid-template-columns:1fr 1fr; gap:22px; }
    .compare-col { min-height:430px; display:flex; flex-direction:column; gap:24px; padding:34px; border:3px solid var(--ink); border-radius:28px; background:#fffdf8; }
    .compare-col.accent { background:var(--accent); color:#fff; border-color:var(--accent); }
    .compare-col strong { font-size:34px; letter-spacing:.08em; }
    .compare-col span { padding-top:22px; border-top:2px solid currentColor; font-size:32px; line-height:1.2; }
    .checklist { width:100%; display:grid; gap:18px; }
    .checklist div { display:grid; grid-template-columns:58px 1fr; align-items:center; gap:18px; padding:24px 28px; border:2px solid var(--line); border-radius:20px; background:#fffdf8; font-size:36px; }
    .checklist b { display:grid; width:50px; height:50px; place-items:center; border-radius:50%; background:var(--accent); color:white; }
    .decision { width:100%; display:grid; gap:14px; }
    .decision div { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:24px 28px; border-bottom:2px solid var(--line); font-size:32px; }
    .decision b { padding:16px 20px; border-radius:999px; background:var(--ink); color:white; white-space:nowrap; }
    .hub { position:relative; width:650px; height:580px; }
    .hub-center { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); display:grid; width:210px; height:210px; place-items:center; border-radius:50%; background:var(--accent); color:white; font-size:38px; font-weight:800; text-align:center; box-shadow:0 0 0 28px rgba(217,119,87,.17); }
    .hub-orbit { position:absolute; padding:22px 26px; border:3px solid var(--ink); border-radius:18px; background:#fffdf8; font-size:29px; font-weight:700; }
    .orbit-1 { left:0; top:40px; } .orbit-2 { right:0; top:78px; } .orbit-3 { left:16px; bottom:52px; } .orbit-4 { right:4px; bottom:28px; }
    .cycle { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:12px; }
    .cycle-step { display:flex; flex-direction:column; align-items:center; gap:10px; padding:28px 24px; border:3px solid var(--ink); border-radius:50%; width:190px; height:190px; justify-content:center; background:#fffdf8; }
    .cycle-step b { color:var(--accent); font-size:28px; } .cycle-step span { font-size:30px; font-weight:800; }
    .cycle i { font-size:48px; color:var(--accent); font-style:normal; }
    .bridge { width:100%; display:grid; grid-template-columns:1fr 180px 1fr; align-items:center; gap:24px; }
    .bridge-side { min-height:250px; display:grid; place-items:center; padding:28px; border:3px solid var(--ink); border-radius:28px; background:#fffdf8; font-size:38px; font-weight:800; text-align:center; }
    .bridge-side.small { gap:14px; }
    .bridge-side.small span { width:100%; padding:12px; border-bottom:2px solid var(--line); font-size:30px; }
    .bridge-center { display:grid; place-items:center; width:180px; height:180px; border-radius:50%; background:var(--accent); color:#fff; font-size:42px; font-weight:900; }
    .stack { position:relative; width:640px; height:610px; }
    .stack span { position:absolute; left:calc(var(--i) * 34px); right:calc((4 - var(--i)) * 34px); top:calc(var(--i) * 104px); height:112px; display:grid; place-items:center; border:3px solid var(--ink); border-radius:22px; background:#fffdf8; font-size:38px; font-weight:850; box-shadow:12px 12px 0 rgba(217,119,87,.22); }
    .stamp { width:620px; min-height:440px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:5px solid var(--accent); border-radius:40px; transform:rotate(-2deg); background:#fffdf8; box-shadow:22px 22px 0 var(--ink); text-align:center; }
    .stamp span { font-size:36px; letter-spacing:.14em; color:var(--accent); font-weight:800; }
    .stamp strong { margin:16px 0 28px; font:italic 86px/1 Georgia, serif; color:var(--ink); }
    .stamp small { font-size:27px; color:var(--muted); }
    .progress { position:absolute; left:0; bottom:0; width:100%; height:10px; background:var(--accent); transform-origin:left center; }
    .direct-nav, .notes-panel { display:none; }
    body.direct-mode { overflow:hidden; }
    body.direct-mode .scene { position:fixed; inset:0; width:1920px; height:1080px; transform-origin:top left; opacity:0; visibility:hidden; pointer-events:none; }
    body.direct-mode .scene.is-active { opacity:1; visibility:visible; pointer-events:auto; }
    body.direct-mode .content, body.direct-mode .visual { opacity:1 !important; transform:none !important; }
    body.direct-mode .direct-nav { position:fixed; z-index:30; right:22px; bottom:18px; display:flex; align-items:center; gap:10px; padding:10px; border-radius:999px; background:rgba(29,29,31,.92); color:white; box-shadow:0 12px 40px rgba(0,0,0,.28); }
    .direct-nav button { border:0; border-radius:999px; padding:11px 17px; background:#f4f0e8; color:#1d1d1f; font-size:16px; font-weight:800; cursor:pointer; }
    .direct-nav output { min-width:70px; text-align:center; font-size:15px; }
    body.direct-mode.notes-open .notes-panel { display:block; position:fixed; z-index:29; left:22px; right:22px; bottom:86px; max-height:230px; overflow:auto; padding:20px 24px; border-radius:18px; background:rgba(29,29,31,.95); color:#f4f0e8; font-size:22px; line-height:1.45; }
  </style>
</head>
<body>
  <script type="application/hyperframes-slideshow+json">${JSON.stringify(manifest, null, 2)}</script>
  ${scenes}
  <aside class="notes-panel" aria-live="polite"></aside>
  <nav class="direct-nav" aria-label="Navegación de la presentación">
    <button type="button" data-action="prev">←</button>
    <output>1 / ${deck.slides.length}</output>
    <button type="button" data-action="notes">Notas</button>
    <button type="button" data-action="next">→</button>
  </nav>
  <script>
    window.__timelines = window.__timelines || {};

    (function standaloneSlideshowBridge() {
      const totalDuration = ${totalDuration};
      const sceneRanges = ${JSON.stringify(sceneRanges)};
      const rootTimeline = gsap.timeline({ paused: true });
      rootTimeline.from("#content-1", { opacity: 0, y: 28, duration: 0.42, ease: "power2.out" }, 0.12);
      rootTimeline.from("#content-1 .visual", { opacity: 0, x: 28, duration: 0.5, ease: "power2.out" }, 0.3);
      rootTimeline.fromTo("#progress-1", { scaleX: 0.04 }, { scaleX: 1, duration: 6.8, ease: "none" }, 0.6);
      rootTimeline.to({}, { duration: Math.max(0, totalDuration - rootTimeline.duration()) });
      window.__timelines["slide-1"] = rootTimeline;
      let activeId = null;

      function activateScene(time) {
        const boundedTime = Math.max(0, Math.min(totalDuration - 0.001, time));
        sceneRanges.forEach((range) => {
          const element = document.getElementById(range.elementId);
          if (!element) return;
          const active = boundedTime >= range.start && boundedTime < range.end;
          element.style.opacity = active ? "1" : "0";
          element.style.visibility = active ? "visible" : "hidden";
          element.style.pointerEvents = active ? "auto" : "none";
          if (active && activeId !== range.id) {
            activeId = range.id;
            if (range.id === "slide-1") return;
            const content = element.querySelector(".content");
            const visual = element.querySelector(".visual");
            const progress = element.querySelector(".progress");
            if (content) gsap.from(content, { opacity: 0, y: 28, duration: 0.42, ease: "power2.out", overwrite: true });
            if (visual) gsap.from(visual, { opacity: 0, x: 28, duration: 0.5, ease: "power2.out", overwrite: true });
            if (progress) gsap.fromTo(progress, { scaleX: 0.04 }, { scaleX: 1, duration: 0.8, ease: "power2.out", overwrite: true });
          }
        });
      }

      window.__hfSetTime = activateScene;
      rootTimeline.eventCallback("onUpdate", () => activateScene(rootTimeline.time()));
      activateScene(0);

      function postTimeline() {
        parent.postMessage(
          {
            source: "hf-preview",
            type: "timeline",
            durationInFrames: totalDuration * 30,
            scenes: sceneRanges.map(({ id, start, duration }) => ({ id, start, duration })),
          },
          "*",
        );
      }
      if (document.readyState === "complete") setTimeout(postTimeline, 300);
      else addEventListener("load", () => setTimeout(postTimeline, 300), { once: true });
    })();

    (function directDeckMode() {
      if (window.top !== window.self) return;
      const query = new URLSearchParams(location.search);
      if (location.protocol !== "file:" && !query.has("slide")) return;
      const scenes = [...document.querySelectorAll(".scene")];
      const notes = ${notesJson};
      const notesPanel = document.querySelector(".notes-panel");
      const counter = document.querySelector(".direct-nav output");
      const requestedSlide = Number(query.get("slide"));
      let current = Number.isFinite(requestedSlide) && requestedSlide > 0 ? requestedSlide - 1 : 0;

      document.body.classList.add("direct-mode");
      function fit() {
        const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
        const x = (innerWidth - 1920 * scale) / 2;
        const y = (innerHeight - 1080 * scale) / 2;
        scenes.forEach((scene) => {
          scene.style.transform = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
        });
      }
      function show(index) {
        current = Math.max(0, Math.min(scenes.length - 1, index));
        scenes.forEach((scene, sceneIndex) => {
          const active = sceneIndex === current;
          scene.classList.toggle("is-active", active);
          scene.style.opacity = active ? "1" : "0";
          scene.style.visibility = active ? "visible" : "hidden";
          scene.style.pointerEvents = active ? "auto" : "none";
        });
        counter.value = (current + 1) + " / " + scenes.length;
        notesPanel.textContent = notes[current];
      }
      function toggleNotes() { document.body.classList.toggle("notes-open"); }
      document.querySelector('[data-action="prev"]').addEventListener("click", () => show(current - 1));
      document.querySelector('[data-action="next"]').addEventListener("click", () => show(current + 1));
      document.querySelector('[data-action="notes"]').addEventListener("click", toggleNotes);
      addEventListener("keydown", (event) => {
        if (["ArrowRight", " ", "PageDown"].includes(event.key)) { event.preventDefault(); show(current + 1); }
        if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); show(current - 1); }
        if (event.key.toLowerCase() === "n") toggleNotes();
      });
      addEventListener("resize", fit);
      fit();
      show(current);
    })();
  </script>
</body>
</html>`;
}

function renderReadme(deck) {
  return `# ${deck.title}

Deck navegable de ${deck.slides.length} láminas para grabar una clase de YouTube.

## Promesa

${deck.promise}

## Abrir

Desde esta carpeta:

\`\`\`powershell
npx hyperframes present .
\`\`\`

También se puede abrir \`index.html\` directamente. Flechas cambian de lámina y \`N\`
muestra u oculta las notas.

## Orden de grabación

1. Grabar A-roll siguiendo las notas del deck.
2. Grabar las pantallas indicadas en \`GUION.md\` con datos ficticios.
3. Revisar que no aparezcan credenciales, clientes ni notificaciones.
4. Hacer un primer corte antes de añadir B-roll o animaciones.

## CTA

Palabra: **${deck.keyword}**. La entrega inicial es manual; no afirmar que existe una
automatización de comentarios hasta que esté conectada y probada.
`;
}

function renderScript(deck) {
  const blocks = deck.slides
    .map(
      (slide, index) => `## ${String(index + 1).padStart(2, "0")} · ${slide.eyebrow}

**Lámina:** ${slide.title}

**Guion:** ${slide.notes}

**Pantalla / prueba:** ${visualInstruction(deck.slug, index)}
`,
    )
    .join("\n");

  return `# Guion de grabación · ${deck.title}

**Título público:** ${deck.title}

**Miniatura:** ${deck.thumbnail}

**Resultado prometido:** ${deck.promise}

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

${blocks}
## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
`;
}

function visualInstruction(slug, index) {
  const maps = {
    "yt-07-hyperframes": [
      "Deck a pantalla completa y un archivo HTML real.",
      "Ejemplos visuales: reporte, comparativa y demo; sin B-roll genérico.",
      "Abrir index.html y resaltar los atributos data-*.",
      "Resaltar paused: true y window.__timelines.",
      "Ejecutar los comandos en terminal con el proyecto saneado.",
      "Mostrar salida de check y sus snapshots.",
      "Abrir present y contrastarlo con preview/render.",
      "Mostrar el checklist de publicación.",
      "Cerrar con la palabra HYPERFRAMES visible.",
    ],
    "yt-08-n8n-leads": [
      "Canvas completo del workflow.",
      "Enviar el payload ficticio al Webhook de prueba.",
      "Construir los nodos en el canvas y hacer zoom suficiente.",
      "Abrir el prompt dentro de Basic LLM Chain.",
      "Abrir la configuración y salida de Structured Output Parser.",
      "Mostrar las reglas y ramas del nodo Switch.",
      "Mostrar AI Agent con tres tools ficticias o saneadas.",
      "Ejecutar tres casos de prueba y mostrar la ruta tomada.",
      "Comparar salida válida con revisión de negocio.",
      "Cerrar con la palabra N8N visible.",
    ],
    "yt-09-mcp-agentes-loops": [
      "Mapa completo de los cinco conceptos.",
      "Workflow lineal en n8n.",
      "AI Agent con tools pequeñas y saneadas.",
      "Diagrama circular del loop.",
      "Workflow HTTP Request → IF → Wait → Telegram.",
      "Contrato JSON de get_lead_by_id.",
      "Documentación oficial de MCP y lista de tools sin tokens.",
      "Árbol de decisión a pantalla completa.",
      "Comparativa control/autonomía.",
      "Cerrar con la palabra MAPA visible.",
    ],
  };
  return maps[slug][index];
}

for (const deck of decks) {
  const outDir = path.join(outRoot, deck.slug);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), renderDeck(deck), "utf8");
  await writeFile(
    path.join(outDir, "deck.html"),
    '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=index.html"><title>Abrir deck</title><a href="index.html">Abrir presentación</a>',
    "utf8",
  );
  await writeFile(path.join(outDir, "README.md"), renderReadme(deck), "utf8");
  await writeFile(path.join(outDir, "GUION.md"), renderScript(deck), "utf8");
  await writeFile(
    path.join(outDir, "package.json"),
    `${JSON.stringify(
      {
        name: deck.slug,
        private: true,
        scripts: {
          dev: "hyperframes present .",
          lint: "hyperframes lint .",
          check: "hyperframes check . --snapshots",
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

console.log(`Generated ${decks.length} teaching decks in ${outRoot}`);
