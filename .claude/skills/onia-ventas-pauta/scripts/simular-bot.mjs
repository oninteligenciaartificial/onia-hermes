// Simula lo que ve un lead que hace clic en un anuncio, con el MOTOR REAL del bot (bot-engine.mjs) y la config «como producción».
//
//   node .claude/skills/onia-ventas-pauta/scripts/simular-bot.mjs "<mensaje 1>" "<mensaje 2>" …
//   node .claude/skills/onia-ventas-pauta/scripts/simular-bot.mjs "Hola, vi el anuncio de Onia (D10). Tengo una clínica dental." "¿Cuánto cuesta?"
//
// Cada respuesta del guion se pasa por el detector de promesas de la web (`promesasEn`) y se marca con ⚠ si dice algo que el catálogo no deja.
// Lo que NO mide: la rama del LLM (sale como [[LLM_PENDIENTE]]: el prompt solo reformula la pregunta pendiente y los guardrails descartan promesas), el primer
// mensaje de la plantilla de Chatwoot (ADQ §5.5) y los horarios reales del VPS (acá salen los de config). Nace del 11-oct, para revisar D7-D11 sin teléfono ajeno.
import { promesasEn } from "../../../../web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs";
import { createState, step } from "../../../../hermes-content/deploy/vps-ops/bot/bot-engine.mjs";
import { configComoProduccion } from "../../../../hermes-content/deploy/vps-ops/bot/config-como-produccion.mjs";

const T0 = Date.parse("2026-10-14T15:00:00Z");
const HORARIOS = "jueves 16 de octubre, 14:00@2026-10-16T18:00:00Z|viernes 17 de octubre, 15:00@2026-10-17T19:00:00Z";
const config = configComoProduccion({ horarios: HORARIOS, now: T0 });
const guion = process.argv.slice(2);
if (!guion.length) { console.error('Uso: simular-bot.mjs "<mensaje del lead>" …'); process.exit(2); }

let state = createState({ channel: "chatwoot", contactRef: "sim" });
let t = T0;
let promesas = 0;
for (const texto of guion) {
  const r = step(state, { text: texto, receivedAt: new Date(t).toISOString() }, { config });
  console.log(`\n>>> LEAD: ${texto}`);
  for (const x of r.replies) {
    const txt = String(x.text ?? x.body ?? JSON.stringify(x));
    console.log(`<<< BOT [${x.templateKey ?? "?"}]: ${txt.replace(/\n/g, " ⏎ ")}`);
    if (x.options) console.log(`    botones: ${x.options.map((o) => o.title).join(" | ")}`);
    const p = promesasEn(txt);
    if (p.length) { promesas += 1; console.log(`    ⚠ PROMESA DETECTADA: ${JSON.stringify(p)}`); }
  }
  console.log(`    pieza: ${r.nextState.pieceKey ?? null}`);
  state = r.nextState;
  t += 60000;
}
process.exit(promesas ? 1 : 0);
