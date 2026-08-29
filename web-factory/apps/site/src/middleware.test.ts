import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

// El punto de este test: /vendedores tiene que fallar CERRADO.
// Sin las variables de auth del center, `oniaCenterAuthConfigured()` da false y
// /onia-center se deja pasar a proposito (asi estaba y asi sigue). /vendedores NO:
// es una superficie con precios muertos y publicos, y quedaba indexable.
// NextRequest y no Request: el middleware usa request.nextUrl, que Request no tiene.
function pedido(path: string) {
  return new NextRequest(`https://center.onia.com.bo${path}`, {
    headers: { host: "center.onia.com.bo" },
  });
}

describe("/vendedores queda cerrada", () => {
  it("sin sesion devuelve 404, no la pagina", async () => {
    const r = await middleware(pedido("/vendedores/cotizador"));
    expect(r.status).toBe(404);
  });

  it("la raiz /vendedores tambien", async () => {
    expect((await middleware(pedido("/vendedores"))).status).toBe(404);
  });

  it("el 404 pide que no lo indexen", async () => {
    const r = await middleware(pedido("/vendedores/ingresos"));
    expect(r.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("no rompe una ruta publica", async () => {
    expect((await middleware(pedido("/"))).status).not.toBe(404);
  });

  it("no cambia el comportamiento de /onia-center", async () => {
    expect((await middleware(pedido("/onia-center/next/hoy"))).status).not.toBe(404);
  });
});
