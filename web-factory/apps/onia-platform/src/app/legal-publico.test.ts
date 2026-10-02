import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PRUEBA, RETENCION } from "@/lib/pricing";
import { CONTENDIENTES, FECHA_CONSULTA, HUECO } from "@/lib/proof";
import { PIXEL_DE_META, origenDeCampanaInit } from "@/lib/origen-de-campana";

/**
 * Lo que la ley boliviana le exige a quien vende por internet, medido en la
 * superficie publicada (auditoría 2026-09-25, carril W).
 *
 * Cada caso es un hallazgo confirmado contra producción:
 *  - La privacidad decía que las notas de voz no salían del servidor y que
 *    «nadie más recibe estos datos», con el bot mandando audio, fotos y parte
 *    de las respuestas a OpenAI (DS 1793: consentimiento informado).
 *  - Los Términos no nombraban a la titular de la empresa unipersonal, no
 *    decían que se factura, no tenían vía de reclamo ni precio con impuestos
 *    (Ley 453 arts. 14, 26 y 40), describían una renovación automática que no
 *    existe y callaban la prueba gratis, que es la puerta de entrada.
 *  - El pie no exhibía NIT ni «EMITE FACTURA» (CTB, 150 UFV).
 *  - La comparativa nombraba competidores con precios de julio sin fecha al
 *    lado y afirmaba en absoluto sobre todo el mercado.
 */

const SRC = path.resolve(__dirname, "..");
const crudo = (rel: string) => readFileSync(path.join(SRC, rel), "utf8");
const plano = (texto: string) => texto.replace(/\s+/g, " ");

const TERMINOS = plano(crudo("content/legal/terminos.md"));
const PRIVACIDAD_CRUDA = crudo("content/legal/privacidad.md");
const PRIVACIDAD = plano(PRIVACIDAD_CRUDA);

const NIT = "5371375010";
const TITULAR = "Leslie Mercado Moreno";

/** Una sección `## N.` del markdown, hasta la siguiente. */
function seccion(md: string, n: number): string {
  const partes = md.split(/^## /m);
  const hallada = partes.find((p) => p.startsWith(`${n}.`));
  expect(hallada, `no existe la sección ${n}`).toBeDefined();
  return plano(hallada!);
}

describe("quien vende está identificado", () => {
  for (const [nombre, texto] of [
    ["terminos.md", TERMINOS],
    ["privacidad.md", PRIVACIDAD],
  ] as const) {
    it(`${nombre} nombra a la titular de la empresa unipersonal y su NIT`, () => {
      // Una unipersonal no tiene personalidad propia: la parte del contrato es
      // su titular, y es su nombre el que sale en la factura.
      expect(texto).toContain(TITULAR);
      expect(texto).toMatch(/empresa unipersonal/i);
      expect(texto).toContain(NIT);
    });
  }

  it("los dos pies del sitio exhiben NIT y «EMITE FACTURA»", () => {
    for (const pie of ["app/(sitio)/ui.tsx", "components/site-footer.tsx"]) {
      const texto = crudo(pie);
      expect(texto, `${pie} no muestra el NIT`).toContain(NIT);
      expect(texto, `${pie} no muestra «EMITE FACTURA»`).toContain("EMITE FACTURA");
    }
  });
});

describe("la privacidad declara a quien de verdad recibe los datos", () => {
  it("nombra a OpenAI como encargado, en la tabla y en el bot", () => {
    expect(seccion(PRIVACIDAD_CRUDA, 5)).toMatch(/OpenAI/);
    expect(seccion(PRIVACIDAD_CRUDA, 13)).toMatch(/OpenAI/);
  });

  it("nombra a Telegram, por donde el bot avisa a Onia con tu último mensaje", () => {
    // aviso-telegram.mjs manda sin redactar rubro, tamaño, ciudad y los
    // últimos 200 caracteres del prospecto al derivar, agendar o enfriarse.
    expect(seccion(PRIVACIDAD_CRUDA, 5)).toMatch(/Telegram/);
    expect(seccion(PRIVACIDAD_CRUDA, 13)).toMatch(/Telegram/);
  });

  it("nombra a Meta, a quien el sitio le avisa las visitas y los toques al alta", () => {
    // `origen-de-campana.ts` manda al píxel de Meta la vista de cada página y
    // el toque a «Creá tu cuenta» o a WhatsApp. Si el sitio lo manda, la
    // privacidad lo dice, con la salida que el snippet respeta (GPC).
    expect(origenDeCampanaInit).toContain(PIXEL_DE_META);
    const recogemos = seccion(PRIVACIDAD_CRUDA, 2);
    expect(recogemos).toMatch(/píxel de Meta/);
    expect(recogemos).toMatch(/Global Privacy Control/);
  });

  it("lo que va a Meta está también en «para qué» y en la tabla de proveedores, sin promesas que el píxel no cumple", () => {
    // El `fbclid` guardado sale a Meta como `fbc` en cada aviso, y las claves
    // de campaña viajan en la dirección de la página: «no sale de tu equipo
    // hasta que tocás el botón» era falso. Y un §3 que no nombra la publicidad
    // mientras dice «no hacemos minería de tus datos» contradice al §2.6.
    expect(seccion(PRIVACIDAD_CRUDA, 2)).not.toMatch(/no sale de tu equipo/i);
    const paraQue = seccion(PRIVACIDAD_CRUDA, 3);
    expect(paraQue).toMatch(/anuncios del sitio p[uú]blico \(§2\.6\)/);
    expect(paraQue).not.toMatch(/miner[ií]a de tus datos/i);
    expect(seccion(PRIVACIDAD_CRUDA, 5)).toMatch(/\| \*\*Meta\*\* \(píxel del sitio público\)/);
  });

  it("nombra a Cloudflare, por donde pasa todo el tráfico y el correo de datos", () => {
    // onia.com.bo y app.onia.com.bo resuelven a IPs de Cloudflare (proxy TLS),
    // y el MX de business@ —la vía del §12— es Cloudflare Email Routing.
    expect(seccion(PRIVACIDAD_CRUDA, 5)).toMatch(/Cloudflare/);
  });

  it("no promete que el audio no sale ni que nadie más recibe los datos", () => {
    expect(PRIVACIDAD).not.toMatch(/nadie m[aá]s recibe/i);
    expect(PRIVACIDAD).not.toMatch(/no se env[ií]a a servicios de transcripci[oó]n/i);
  });

  it("no presenta como tercero a la base que Onia opera en su propio servidor", () => {
    // §4.1: Supabase corre auto-hospedado. Nombrarlo entre los terceros del
    // bot lo vuelve un proveedor externo que no es.
    expect(seccion(PRIVACIDAD_CRUDA, 13)).not.toMatch(/Supabase/);
  });

  it("declara los mensajes que el bot manda por su cuenta", () => {
    expect(seccion(PRIVACIDAD_CRUDA, 13)).toMatch(/seguimiento/i);
    expect(seccion(PRIVACIDAD_CRUDA, 13)).toMatch(/recordatorio/i);
  });
});

describe("los Términos dicen lo que la ley pide y lo que el producto hace", () => {
  it("se factura cada pago", () => {
    expect(TERMINOS).toMatch(/factura por cada pago/i);
  });

  it("el precio es final, en bolivianos, con impuestos incluidos", () => {
    expect(TERMINOS).toMatch(/precios finales en bolivianos, impuestos incluidos/i);
  });

  it("hay una vía de reclamo con plazo y la autoridad del consumidor", () => {
    expect(TERMINOS).toMatch(/reclamo/i);
    expect(TERMINOS).toMatch(/5 días hábiles/);
    expect(TERMINOS).toMatch(/Ley N\.º 453/);
  });

  it("la prueba gratis está en el contrato, con los números del producto", () => {
    expect(TERMINOS).toContain(`${PRUEBA.dias} días de prueba`);
    expect(TERMINOS).toContain(`${PRUEBA.diasDeGracia} día adicional de gracia`);
    // PRUEBA.copy promete la ventana de exportación: el contrato no puede ser
    // más angosto que el aviso de venta.
    expect(TERMINOS).toContain(`${RETENCION.diasParaExportar} días para exportar tus datos`);
  });

  it("no describe una renovación automática que no existe", () => {
    // El pago es QR manual: no hay medio guardado con que cobrar solo.
    expect(TERMINOS).not.toMatch(/se renueva por un per[ií]odo igual/i);
    expect(TERMINOS).not.toMatch(/\bmora\b/i);
  });

  it("pagar antes suma al período vigente, no lo pisa", () => {
    // extendPlanEnd (onia-platform lib/subscription/plan-state.ts) extiende
    // desde el fin vigente si todavía no venció, y desde el pago si ya venció.
    expect(TERMINOS).not.toMatch(/al vencer, Onia te avisa con anticipaci[oó]n/i);
    expect(TERMINOS).toMatch(/Si pagás antes, el nuevo período se suma al vigente/);
    expect(TERMINOS).toMatch(/si pagás después, empieza el día que se confirma el pago/);
  });

  it("no reclama la propiedad de una marca que no está registrada", () => {
    expect(TERMINOS).not.toMatch(/las marcas/i);
    expect(TERMINOS).toMatch(/nombre comercial y los signos distintivos de Onia/);
  });
});

describe("/precios dice que el precio es final", () => {
  it("con impuestos incluidos", () => {
    expect(plano(crudo("app/(sitio)/precios/page.tsx"))).toMatch(
      /Precios finales en bolivianos, impuestos incluidos\./,
    );
  });
});

describe("la comparativa sólo afirma lo que se puede comprobar, con fecha", () => {
  const TERCEROS = CONTENDIENTES.filter((c) => !c.esOnia);

  it("hay terceros que medir", () => {
    expect(TERCEROS.length).toBeGreaterThan(0);
  });

  it("cada precio de un tercero lleva su fecha de consulta al lado", () => {
    for (const c of TERCEROS) {
      expect(c.precioNota ?? "", `${c.quien}: precio sin fecha`).toContain(FECHA_CONSULTA);
    }
  });

  it("ningún titular dice «hoy» sobre datos consultados en otra fecha", () => {
    for (const f of [
      "app/(sitio)/comparativa/page.tsx",
      "app/v1/comparativa/page.tsx",
      "components/landing-v1/comparativa-teaser.tsx",
    ]) {
      expect(crudo(f), `${f}: «hoy» sobre datos del ${FECHA_CONSULTA}`).not.toMatch(
        /\bhoy(<\/em>)? se vende/,
      );
    }
  });

  it("ninguna afirmación sobre el mercado es absoluta", () => {
    const ABSOLUTA = /\bno existe\b|\bninguno\b|\bnadie\b/i;
    expect(HUECO).not.toMatch(ABSOLUTA);
    expect(HUECO).toContain(FECHA_CONSULTA);
    for (const c of TERCEROS) {
      expect(c.veredicto, `${c.quien}: veredicto absoluto`).not.toMatch(ABSOLUTA);
    }
  });
});
