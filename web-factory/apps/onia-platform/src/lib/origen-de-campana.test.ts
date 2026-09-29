import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { REGISTRO_URL, registroConPlan } from "@/app/(sitio)/nav";
import {
  CLAVE_DE_SESION,
  LARGO_MAXIMO,
  PARAMETROS_DE_CAMPANA,
  origenDeCampanaInit,
} from "./origen-de-campana";

/**
 * El origen de campaña con el que alguien llega a onia.com.bo viaja hasta el
 * alta de la app.
 *
 * **El defecto que este gate deja rojo.** Hasta el 2026-09-29 los botones de
 * alta del sitio mandaban a `app.onia.com.bo/register` pelado (o con `?plan=`
 * y nada más): el `?src=` y los `utm_*` con los que el lead llegó desde un
 * anuncio se perdían en el primer clic. De los tres registros de la base, sólo
 * uno tenía `src`, y porque se puso a mano (handoff meta-ads-prospeccion §3.2).
 * Con la pauta encendida así, ningún alta se puede atribuir a su campaña.
 *
 * **Por qué se EJECUTA el snippet.** Lo que hay que afirmar es un
 * comportamiento —"el href que sale al tocar lleva el origen guardado"— y el
 * HTML servido NO lo tiene a propósito: el enlace se decora recién en el clic,
 * para no tocar el HTML estático ni pelearse con la hidratación.
 */

type Enlace = { href: string };

type Entorno = {
  guardado: Map<string, string>;
  tocar: (enlace: Enlace, tipo?: string) => void;
};

/** DOM mínimo, como `chat-diferido.test.ts`: sólo lo que el snippet toca. */
function correr(
  url: string,
  guardadoPrevio: Record<string, string> = {},
): Entorno {
  const guardado = new Map(Object.entries(guardadoPrevio));
  const oyentes = new Map<string, Array<(e: unknown) => void>>();
  const ubicacion = new URL(url);

  const documento = {
    readyState: "loading",
    addEventListener: (tipo: string, fn: (e: unknown) => void) => {
      oyentes.set(tipo, [...(oyentes.get(tipo) ?? []), fn]);
    },
  };
  const almacen = {
    getItem: (k: string) => guardado.get(k) ?? null,
    setItem: (k: string, v: string) => void guardado.set(k, v),
  };
  const ventana = { addEventListener: () => {} };

  new Function(
    "window",
    "document",
    "location",
    "sessionStorage",
    "navigator",
    "fetch",
    origenDeCampanaInit,
  )(ventana, documento, ubicacion, almacen, {}, () => {});

  return {
    guardado,
    tocar: (enlace, tipo = "click") => {
      const objetivo = { closest: () => enlace };
      for (const fn of oyentes.get(tipo) ?? []) fn({ type: tipo, target: objetivo });
    },
  };
}

const ENTRADA = "https://onia.com.bo/?utm_source=facebook&utm_medium=paid&utm_campaign=onia-etapa1-dental&utm_content=d1&src=ad-d1&fbclid=IwAR0abc_DEF-123";

describe("el origen de campaña viaja al alta", () => {
  it("guarda los seis parámetros al entrar", () => {
    const v = correr(ENTRADA);
    const guardado = JSON.parse(v.guardado.get(CLAVE_DE_SESION)!);

    expect(Object.keys(guardado).sort()).toEqual([...PARAMETROS_DE_CAMPANA].sort());
    expect(guardado.src).toBe("ad-d1");
  });

  it("al tocar «Creá tu cuenta» el enlace sale con el origen", () => {
    const v = correr(ENTRADA);
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.origin + destino.pathname).toBe(REGISTRO_URL);
    expect(destino.searchParams.get("src")).toBe("ad-d1");
    expect(destino.searchParams.get("utm_campaign")).toBe("onia-etapa1-dental");
    expect(destino.searchParams.get("fbclid")).toBe("IwAR0abc_DEF-123");
  });

  it("se SUMA al ?plan= de la tarjeta, no lo pisa", () => {
    const v = correr(ENTRADA);
    const enlace = { href: registroConPlan("pro") };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("plan")).toBe("professional");
    expect(destino.searchParams.get("utm_source")).toBe("facebook");
  });

  it("el clic con la rueda (pestaña nueva) también lo lleva", () => {
    const v = correr(ENTRADA);
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace, "auxclick");

    expect(new URL(enlace.href).searchParams.get("src")).toBe("ad-d1");
  });

  it("sobrevive a la navegación interna: entra por la portada, se registra desde /precios", () => {
    const portada = correr(ENTRADA);
    const precios = correr("https://onia.com.bo/precios", Object.fromEntries(portada.guardado));
    const enlace = { href: registroConPlan("crece") };
    precios.tocar(enlace);

    expect(new URL(enlace.href).searchParams.get("src")).toBe("ad-d1");
  });

  it("no toca enlaces que no son el alta", () => {
    const v = correr(ENTRADA);
    for (const href of [
      "https://app.onia.com.bo/login",
      "https://onia.com.bo/precios",
      "https://app.onia.com.bo/registerx",
      "https://wa.me/59175414930?text=hola",
    ]) {
      const enlace = { href };
      v.tocar(enlace);
      expect(enlace.href).toBe(href);
    }
  });

  it("sin origen guardado, el enlace sale idéntico", () => {
    const v = correr("https://onia.com.bo/");
    const enlace = { href: registroConPlan("basico") };
    v.tocar(enlace);

    expect(enlace.href).toBe(registroConPlan("basico"));
  });
});

describe("sólo pasa lo que está en la lista blanca, y corto", () => {
  it("una clave que no es de campaña no se guarda ni viaja", () => {
    const v = correr("https://onia.com.bo/?src=ad-d1&email=alguien%40correo.com&next=https://malo.example");
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("src")).toBe("ad-d1");
    expect(destino.searchParams.has("email")).toBe(false);
    expect(destino.searchParams.has("next")).toBe(false);
  });

  it("un valor con caracteres raros se descarta", () => {
    const v = correr("https://onia.com.bo/?src=%3Cscript%3E&utm_source=ok");
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.has("src")).toBe(false);
    expect(destino.searchParams.get("utm_source")).toBe("ok");
  });

  it("un valor más largo que el máximo se descarta", () => {
    const largo = "a".repeat(LARGO_MAXIMO + 1);
    const v = correr(`https://onia.com.bo/?src=${largo}&utm_medium=paid`);
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.has("src")).toBe(false);
    expect(destino.searchParams.get("utm_medium")).toBe("paid");
  });

  it("lo guardado también se revalida: un sessionStorage adulterado no viaja", () => {
    const v = correr("https://onia.com.bo/precios", {
      [CLAVE_DE_SESION]: JSON.stringify({ src: "<b>", otro: "x", utm_source: "ok" }),
    });
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.has("src")).toBe(false);
    expect(destino.searchParams.has("otro")).toBe(false);
    expect(destino.searchParams.get("utm_source")).toBe("ok");
  });

  it("un sessionStorage que tira (modo privado estricto) no rompe el sitio", () => {
    expect(() =>
      new Function("window", "document", "location", "sessionStorage", "navigator", "fetch", origenDeCampanaInit)(
        { addEventListener: () => {} },
        { readyState: "loading", addEventListener: () => {} },
        new URL(ENTRADA),
        {
          getItem: () => {
            throw new Error("SecurityError");
          },
          setItem: () => {
            throw new Error("SecurityError");
          },
        },
        {},
        () => {},
      ),
    ).not.toThrow();
  });

  it("la última campaña manda: una entrada nueva reemplaza la vieja entera", () => {
    const primera = correr(ENTRADA);
    const segunda = correr(
      "https://onia.com.bo/?utm_source=instagram",
      Object.fromEntries(primera.guardado),
    );
    const enlace = { href: REGISTRO_URL };
    segunda.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("utm_source")).toBe("instagram");
    expect(destino.searchParams.has("src")).toBe(false);
  });
});

describe("el layout publica ESTE snippet", () => {
  const layout = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "app", "layout.tsx"),
    "utf8",
  );

  it("lo importa del módulo y lo cuelga inline", () => {
    expect(layout).toMatch(/from\s+"@\/lib\/origen-de-campana"/);
    expect(layout).toContain("__html: origenDeCampanaInit");
  });
});
