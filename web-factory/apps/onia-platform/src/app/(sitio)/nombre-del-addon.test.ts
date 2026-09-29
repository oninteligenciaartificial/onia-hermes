import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CHATBOT_PLAN } from "@/content/chatbot-precios";
import { ADDONS, CHATBOT_EN_LA_CARTA } from "@/lib/pricing";
import { NAV_PRODUCTO } from "./nav";

/**
 * El add-on se llama «Agente conversacional de WhatsApp» (Sergio Urcullo,
 * 2026-09-28). Se llamaba «Chatbot de WhatsApp con IA», y las respuestas del bot
 * del cliente salen de lo que el negocio cargó, no de un modelo
 * (`bot/recepcionista.mjs`: "SIN LLM"). La IA real se dice donde es real y
 * concreta: entiende las fotos. Los audios NO se prometen: el respaldo de
 * transcripción depende de una variable de entorno que nadie verificó en vivo.
 *
 * El producto tiene su gemelo en `lib/pricing-honestidad.test.ts`.
 */
const SRC = join(fileURLToPath(import.meta.url), "..", "..", "..");

/**
 * Fuera del barrido, cada una con su motivo:
 *  - `app/v1`, `components/landing-v1`, `app/servicios/{marketing-ia,consultoria}`:
 *    redirigidas con 308 a la portada (`archivo-redirigido.test.ts`); nadie las sirve.
 *  - `content/legal` y `app/privacidad`: describen el bot de VENTAS de la propia
 *    Onia (§13 de la política), no el add-on; cambiar un texto legal es otra decisión.
 */
const FUERA = [
  "app/v1/",
  "components/landing-v1/",
  "app/servicios/marketing-ia/",
  "app/servicios/consultoria/",
  "content/legal/",
  "app/privacidad/",
];

const VIEJO = /chatbot\s+(?:de\s+)?whatsapp|whatsapp\s+chatbot|chatbot\s+(?:con\s+ia|\(ia\))/i;
const COMENTARIO = /^\s*(?:\/\/|\*|\/\*|\{\/\*)/;

describe("el add-on se llama «Agente conversacional de WhatsApp»", () => {
  it("la carta de add-ons lo nombra con la constante", () => {
    expect(CHATBOT_EN_LA_CARTA).toBe("Agente conversacional de WhatsApp");
    expect(ADDONS.map((a) => a.nombre)).toContain(CHATBOT_EN_LA_CARTA);
    expect(NAV_PRODUCTO.find((n) => n.href === "/chatbot")?.label).toBe("Agente conversacional");
  });

  it("la IA se nombra donde es real: fotos sí, audios no", () => {
    const addon = ADDONS.find((a) => a.nombre === CHATBOT_EN_LA_CARTA)!;
    expect(addon.copy).toMatch(/entiende las fotos/);
    expect(CHATBOT_PLAN.incluye.join(" ")).toMatch(/Entiende las fotos/);
    expect(`${addon.copy} ${CHATBOT_PLAN.incluye.join(" ")}`).not.toMatch(/audio/i);
  });

  it("ninguna superficie servida vuelve al nombre viejo", () => {
    const ofensores: string[] = [];
    let barridos = 0;
    for (const rel of readdirSync(SRC, { recursive: true }) as string[]) {
      const posix = rel.replace(/\\/g, "/");
      if (!/\.(ts|tsx|md)$/.test(posix) || /\.(test|spec)\.tsx?$/.test(posix)) continue;
      if (FUERA.some((f) => posix.startsWith(f))) continue;
      barridos++;
      readFileSync(join(SRC, rel), "utf8")
        .split("\n")
        .forEach((linea, i) => {
          if (!COMENTARIO.test(linea) && VIEJO.test(linea)) ofensores.push(`${posix}:${i + 1}  ${linea.trim()}`);
        });
    }
    expect(ofensores, "el nombre viejo del add-on sigue en una superficie").toEqual([]);
    expect(barridos, "no barrió nada: el recorrido del disco se rompió").toBeGreaterThan(50);
  });
});

describe("la bajada honesta de «Agentes con IA»", () => {
  it("la página de agentes dice qué hace la IA y qué decide el sistema", () => {
    const pagina = readFileSync(join(SRC, "app", "(sitio)", "agentes", "page.tsx"), "utf8").replace(/\s+/g, " ");
    expect(pagina).toContain("<Kicker>Agentes con IA</Kicker>");
    expect(pagina).toMatch(/La IA te escribe los mensajes; a quién y cuándo lo decide el sistema con tus datos, y vos aprobás\./);
  });
});
