// ONIA — BENCH DE HUMO: las plantillas por rubro del editor contra el MOTOR REAL.
//
// Que prueba: cada plantilla de `onia-platform/lib/chatbot/plantillas.ts` (el doc
// pre-armado que ve un cliente nuevo en /settings/chatbot) (1) pasa validateKnowledge
// del motor tal cual, y (2) un "hola" por /preview contesta en modo RECEPCIONISTA
// (M0R con botones), nunca el funnel de venta de Onia. Si una plantilla se rompe al
// editar plantillas.ts o el validador del motor, esto lo caza ANTES que un cliente.
//
// Fixture: plantillas-humo.json (este directorio). Regenerarlo cuando cambie
// plantillas.ts, desde el repo onia-platform:
//   npx -y tsx -e "const m=require('./lib/chatbot/plantillas');const o={};for(const t of m.TRACKS_CON_CHATBOT)o[t]=m.plantillaDeTrack(t,'Negocio Humo');process.stdout.write(JSON.stringify(o))" > <ruta>/plantillas-humo.json
//
// Correr (local en el espejo, o en el VPS dentro de /tmp/onia-bot):
//   ONIA_BOT_PREVIEW_SECRET=x node humo-plantillas.mjs [ruta-al-fixture]
// Exit 0 = las 6 verdes; exit 1 = detalle del fallo por track.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { handlePreviewRequest } from "./preview-route.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUTA = process.argv[2] || join(HERE, "plantillas-humo.json");

process.env.ONIA_BOT_PREVIEW_SECRET = process.env.ONIA_BOT_PREVIEW_SECRET || "humo";
const AUTH = { authorization: `Bearer ${process.env.ONIA_BOT_PREVIEW_SECRET}` };

const plantillas = JSON.parse(readFileSync(RUTA, "utf8"));
const tracks = Object.keys(plantillas);
let fallos = 0;

for (const track of tracks) {
  const doc = plantillas[track];
  const out = await handlePreviewRequest({
    rawBody: JSON.stringify({ message: "hola", knowledge: doc }),
    headers: AUTH,
  });
  const r0 = out.body?.respuestas?.[0];
  const problemas = [];
  if (out.status !== 200) problemas.push(`status ${out.status}: ${JSON.stringify(out.body?.errores || out.body).slice(0, 200)}`);
  if (out.status === 200 && out.body?.conocimiento?.fuente !== "borrador") problemas.push(`fuente ${out.body?.conocimiento?.fuente}`);
  if (out.status === 200 && r0?.plantilla !== "M0R") problemas.push(`contesto ${r0?.plantilla} (esperaba M0R recepcionista)`);
  if (out.status === 200 && !(Array.isArray(r0?.opciones) && r0.opciones.length)) problemas.push("sin botones");
  if (out.status === 200 && !(r0?.texto || "").includes("Negocio Humo")) problemas.push("no se presenta con el nombre del negocio");

  if (problemas.length) {
    fallos++;
    console.error(`✗ ${track}: ${problemas.join(" · ")}`);
  } else {
    console.log(`✓ ${track}: M0R, ${r0.opciones.length} botones, "${r0.texto.slice(0, 60)}..."`);
  }
}

console.log(`\n${tracks.length - fallos}/${tracks.length} plantillas verdes`);
process.exit(fallos ? 1 : 0);
