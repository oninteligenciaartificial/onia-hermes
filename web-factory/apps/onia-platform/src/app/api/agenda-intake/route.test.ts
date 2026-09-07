import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

/**
 * El CAMINO DE FALLO del único formulario de captura de `onia.com.bo`.
 *
 * `seguimiento-prometido.test.ts` mira la FORMA del código (que el endpoint
 * distinga y que la pantalla condicione la promesa). Esto mide la CONDUCTA:
 * que los tres caminos devuelvan de verdad lo que dicen devolver.
 *
 * Hace falta separado porque el camino feliz anda en producción —probado de
 * punta a punta con un lead sellado, que aterrizó en `onia_center.leads`— y
 * por eso el fallo nunca se ve mirando. Los dos caminos que pierden el lead
 * sólo existen cuando el pipeline está caído, que es justo cuando nadie está
 * mirando la pantalla.
 */

function pedido(cuerpo: unknown = { email: "alguien@ejemplo.com" }): Request {
  return new Request("https://onia.com.bo/api/agenda-intake", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("agenda-intake dice si el lead quedó registrado", () => {
  it("sin las env vars contesta 202: el lead se perdió y hay que decirlo", async () => {
    vi.stubEnv("ONIA_CENTER_INTAKE_URL", "");
    vi.stubEnv("ONIA_CENTER_INTAKE_SECRET", "");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const respuesta = await POST(pedido());

    // 204 acá era el bug: la pantalla le prometía el aviso a alguien cuyo
    // correo se acababa de tirar. Es la misma firma que SEARXNG_URL en el alta.
    expect(respuesta.status).toBe(202);
  });

  it("si Onia Center no contesta, contesta 202 y no rompe el flujo", async () => {
    vi.stubEnv("ONIA_CENTER_INTAKE_URL", "http://onia-center:3012/x");
    vi.stubEnv("ONIA_CENTER_INTAKE_SECRET", "secreto");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("ECONNREFUSED"))),
    );

    const respuesta = await POST(pedido());

    expect(respuesta.status).toBe(202);
  });

  it("si Onia Center rechaza el lead, contesta 202 (no lo da por registrado)", async () => {
    vi.stubEnv("ONIA_CENTER_INTAKE_URL", "http://onia-center:3012/x");
    vi.stubEnv("ONIA_CENTER_INTAKE_SECRET", "secreto-viejo");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 401 }))),
    );

    const respuesta = await POST(pedido());

    // Un secreto rotado deja el 401 del otro lado: antes se leía como éxito.
    expect(respuesta.status).toBe(202);
  });

  it("cuando Onia Center lo registra, contesta 204 y la promesa es verdadera", async () => {
    vi.stubEnv("ONIA_CENTER_INTAKE_URL", "http://onia-center:3012/x");
    vi.stubEnv("ONIA_CENTER_INTAKE_SECRET", "secreto");
    const espia = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 201 })),
    );
    vi.stubGlobal("fetch", espia);

    const respuesta = await POST(pedido());

    expect(respuesta.status).toBe(204);
    expect(espia).toHaveBeenCalledOnce();
  });

  it("nunca lanza: la hoja del lead no depende del pipeline", async () => {
    vi.stubEnv("ONIA_CENTER_INTAKE_URL", "http://onia-center:3012/x");
    vi.stubEnv("ONIA_CENTER_INTAKE_SECRET", "secreto");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("explota sincrónicamente");
      }),
    );

    await expect(POST(pedido())).resolves.toBeInstanceOf(Response);
  });
});
