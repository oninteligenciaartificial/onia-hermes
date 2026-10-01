import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { REGISTRO_URL, registroConPlan } from "@/app/(sitio)/nav";
import {
  CLAVE_DE_SESION,
  LARGO_MAXIMO,
  PARAMETROS_DE_CAMPANA,
  PIXEL_DE_META,
  PIXEL_DESTINO,
  origenDeCampanaInit,
} from "./origen-de-campana";
import { WA_URL } from "./site";

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

type Pedido = { url: URL; opciones: RequestInit };

type Entorno = {
  guardado: Map<string, string>;
  tocar: (enlace: Enlace, tipo?: string) => void;
  /** Lo que el snippet le pidió a la red con `fetch`. */
  pedidos: Pedido[];
  /** Dispara un evento sobre `window` (el `load`). */
  disparar: (evento: string) => void;
  /** Corre lo que el snippet dejó para cuando el navegador esté ocioso. */
  ocioso: () => void;
};

/** DOM mínimo, como `chat-diferido.test.ts`: sólo lo que el snippet toca. */
function correr(
  url: string,
  guardadoPrevio: Record<string, string> = {},
  { gpc = false }: { gpc?: boolean } = {},
): Entorno {
  const guardado = new Map(Object.entries(guardadoPrevio));
  const oyentes = new Map<string, Array<(e: unknown) => void>>();
  const deVentana = new Map<string, Array<() => void>>();
  const enOcio: Array<() => void> = [];
  const pedidos: Pedido[] = [];
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
  const ventana = {
    addEventListener: (tipo: string, fn: () => void) => {
      deVentana.set(tipo, [...(deVentana.get(tipo) ?? []), fn]);
    },
    requestIdleCallback: (fn: () => void) => {
      enOcio.push(fn);
      return 0;
    },
  };
  const fetchFalso = (destino: string, opciones: RequestInit) => {
    pedidos.push({ url: new URL(destino), opciones });
    return Promise.resolve();
  };

  new Function(
    "window",
    "document",
    "location",
    "sessionStorage",
    "navigator",
    "fetch",
    origenDeCampanaInit,
  )(ventana, documento, ubicacion, almacen, { globalPrivacyControl: gpc }, fetchFalso);

  return {
    guardado,
    pedidos,
    tocar: (enlace, tipo = "click") => {
      const objetivo = { closest: () => enlace };
      for (const fn of oyentes.get(tipo) ?? []) fn({ type: tipo, target: objetivo });
    },
    disparar: (evento) => {
      for (const fn of deVentana.get(evento) ?? []) fn();
    },
    ocioso: () => {
      for (const fn of enOcio.splice(0)) fn();
    },
  };
}

const ENTRADA = "https://onia.com.bo/?utm_source=facebook&utm_medium=paid&utm_campaign=onia-etapa1-dental&utm_content=d1&utm_id=120210000000&utm_term=clinica+dental&src=ad-d1&fbclid=IwAR0abc_DEF-123";

describe("el origen de campaña viaja al alta", () => {
  it("guarda los ocho parámetros al entrar", () => {
    const v = correr(ENTRADA);
    const guardado = JSON.parse(v.guardado.get(CLAVE_DE_SESION)!);

    expect(Object.keys(guardado).sort()).toEqual([...PARAMETROS_DE_CAMPANA].sort());
    expect(guardado.src).toBe("ad-d1");
  });

  /**
   * La 1.0 de la app guarda `utm_id` y `utm_term` con la cuenta. Si el sitio
   * no los pasa al registro, la app no tiene qué guardar: el id de campaña de
   * Meta y el término de búsqueda se perdían en el primer clic.
   */
  it("utm_id y utm_term viajan al alta", () => {
    const v = correr(ENTRADA);
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("utm_id")).toBe("120210000000");
    expect(destino.searchParams.get("utm_term")).toBe("clinica dental");
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

  it("un valor con marcado (< o >) se descarta", () => {
    const v = correr("https://onia.com.bo/?src=%3Cscript%3E&utm_source=ok");
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.has("src")).toBe(false);
    expect(destino.searchParams.get("utm_source")).toBe("ok");
  });

  it("un nombre de campaña con tildes, ñ y espacios pasa", () => {
    const v = correr("https://onia.com.bo/?utm_campaign=Campa%C3%B1a+Cl%C3%ADnica+SCZ");
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    expect(new URL(enlace.href).searchParams.get("utm_campaign")).toBe("Campaña Clínica SCZ");
  });

  /**
   * El defecto que este caso deja rojo: hasta el 2026-10-01 la lista blanca
   * de caracteres no aceptaba `(`, `)`, `/` ni `%`, y una campaña con esos
   * nombres —los que Meta Ads arma solo— se descartaba ENTERA, en silencio.
   */
  it("una campaña con paréntesis, barra y % llega entera", () => {
    const nombre = "Clínicas SCZ (sep)/v2";
    const v = correr(
      `https://onia.com.bo/?utm_campaign=${encodeURIComponent(nombre)}&utm_content=${encodeURIComponent("50% off")}`,
    );
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("utm_campaign")).toBe(nombre);
    expect(destino.searchParams.get("utm_content")).toBe("50% off");
  });

  it("también llega entera si viene sin codificar en la dirección", () => {
    const v = correr("https://onia.com.bo/?utm_campaign=Cl%C3%ADnicas SCZ (sep)/v2");
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    expect(new URL(enlace.href).searchParams.get("utm_campaign")).toBe("Clínicas SCZ (sep)/v2");
  });

  it("los caracteres de control se borran, el resto del valor se queda", () => {
    const v = correr("https://onia.com.bo/?utm_campaign=%20dental%0A%0D%00sep%09%7F%20&utm_term=%0A%00");
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("utm_campaign")).toBe("dentalsep");
    // Si no queda nada después de sanear, no viaja una clave vacía.
    expect(destino.searchParams.has("utm_term")).toBe(false);
  });

  it("un valor más largo que el máximo se corta al máximo, no se pierde", () => {
    const largo = "a".repeat(LARGO_MAXIMO + 40);
    const v = correr(`https://onia.com.bo/?src=${largo}&utm_medium=paid`);
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    const destino = new URL(enlace.href);
    expect(destino.searchParams.get("src")).toBe("a".repeat(LARGO_MAXIMO));
    expect(destino.searchParams.get("utm_medium")).toBe("paid");
  });

  it("el corte no deja media pareja sustituta (un emoji partido)", () => {
    const valor = "a".repeat(LARGO_MAXIMO - 1) + "😀";
    const v = correr(`https://onia.com.bo/?utm_campaign=${encodeURIComponent(valor)}`);
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    expect(new URL(enlace.href).searchParams.get("utm_campaign")).toBe("a".repeat(LARGO_MAXIMO - 1));
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

/**
 * El píxel de Meta avisa, sin cargar la librería de Meta.
 *
 * **Por qué nunca disparó.** No estaba instalado: cero `fbq` en todo el sitio
 * (y en la app), y la CSP de la landing tampoco lo habría dejado salir
 * (`connect-src` sin ningún origen de Meta). El píxel `1012611478191231`
 * existía sólo del lado de Meta, con `last_fired_time` vacío.
 *
 * **Por qué sin `fbevents.js`.** Medido el 2026-09-29: la librería pesa
 * 112,6 KB comprimidos (428 KB de JS a parsear) y su configuración otros
 * 33,5 KB (134,6 KB). Son ~146 KB más por visita sobre una portada cuyo LCP
 * en celular lento ya pasa el presupuesto (2,9 s contra 2,5 s,
 * `ONIA_VELOCIDAD_Y_ESTABILIDAD.md` §5). El mismo aviso sale como un pedido
 * GET de ~0 KB a `/tr`, la forma sin script que Meta documenta.
 */
describe("el píxel de Meta", () => {
  const avisos = (v: Entorno) => v.pedidos.map((p) => p.url.searchParams.get("ev"));

  it("PageView sale recién con la página cargada y el navegador ocioso", () => {
    const v = correr(ENTRADA);
    expect(v.pedidos).toHaveLength(0);

    v.disparar("load");
    expect(v.pedidos, "no compite con la carga: espera al ocio").toHaveLength(0);

    v.ocioso();
    expect(avisos(v)).toEqual(["PageView"]);

    const [pedido] = v.pedidos;
    expect(pedido.url.origin + pedido.url.pathname).toBe(PIXEL_DESTINO);
    expect(pedido.url.searchParams.get("id")).toBe(PIXEL_DE_META);
    expect(pedido.url.searchParams.get("dl")).toBe(ENTRADA);
    // keepalive: el aviso sobrevive a que el clic se lleve la página.
    expect(pedido.opciones).toMatchObject({ mode: "no-cors", keepalive: true });
  });

  /**
   * Un toque no es un lead. `Lead` le dice a Meta «esto es lo que busco»: si
   * una campaña optimiza por él, Meta sale a buscar gente que hace clic, y el
   * reporte cuenta leads que nunca se registraron. El toque a WhatsApp es el
   * estándar `Contact`; el toque al alta es un evento propio, `ClicAlta`.
   * `Lead` y `CompleteRegistration` quedan para el alta confirmada, del lado
   * del producto.
   */
  it("WhatsApp avisa Contact y el alta avisa ClicAlta, nunca Lead", () => {
    const alta = correr(ENTRADA);
    alta.tocar({ href: registroConPlan("pro") });
    expect(avisos(alta)).toEqual(["ClicAlta"]);

    const wa = correr(ENTRADA);
    wa.tocar({ href: WA_URL });
    expect(avisos(wa)).toEqual(["Contact"]);
  });

  it("cada toque avisa una vez por página, aunque se repita", () => {
    const v = correr(ENTRADA);
    v.tocar({ href: WA_URL });
    v.tocar({ href: WA_URL });
    v.tocar({ href: REGISTRO_URL });
    v.tocar({ href: REGISTRO_URL });

    expect(avisos(v)).toEqual(["Contact", "ClicAlta"]);
  });

  it("otros enlaces no avisan nada", () => {
    const v = correr(ENTRADA);
    v.tocar({ href: "https://onia.com.bo/precios" });
    v.tocar({ href: "https://app.onia.com.bo/login" });

    expect(v.pedidos).toHaveLength(0);
  });

  /**
   * Lo que viaja a Meta pasa por la MISMA lista blanca que lo que viaja al
   * alta. La dirección de la página no se manda entera: el formulario de
   * /guia-facturacion, si se envía antes de que cargue React (celular lento),
   * recarga la página con `?email=...&whatsapp=...`, y la privacidad promete
   * que el aviso no lleva correo ni teléfono.
   */
  it("la dirección que va a Meta lleva sólo las claves de campaña", () => {
    const v = correr(
      "https://onia.com.bo/guia-facturacion?src=ad-d1&email=a%40b.com&whatsapp=70000000#hoja",
    );
    v.disparar("load");
    v.ocioso();
    v.tocar({ href: WA_URL });

    expect(v.pedidos).toHaveLength(2);
    for (const { url } of v.pedidos) {
      expect(url.searchParams.get("dl")).toBe("https://onia.com.bo/guia-facturacion?src=ad-d1");
      expect(url.toString()).not.toMatch(/email|whatsapp=|a%2540b|70000000/);
    }
  });

  it("en una página sin campaña en la dirección, va la dirección sola", () => {
    const portada = correr(ENTRADA);
    const precios = correr("https://onia.com.bo/precios?email=a%40b.com", Object.fromEntries(portada.guardado));
    precios.disparar("load");
    precios.ocioso();

    expect(precios.pedidos[0].url.searchParams.get("dl")).toBe("https://onia.com.bo/precios");
  });

  it("con el fbclid del anuncio, manda el fbc que lo ata al clic", () => {
    const v = correr(ENTRADA);
    v.tocar({ href: REGISTRO_URL });

    expect(v.pedidos[0].url.searchParams.get("fbc")).toMatch(/^fb\.1\.\d+\.IwAR0abc_DEF-123$/);
  });

  it("sin fbclid no inventa un fbc", () => {
    const v = correr("https://onia.com.bo/?utm_source=google");
    v.tocar({ href: REGISTRO_URL });

    expect(v.pedidos[0].url.searchParams.has("fbc")).toBe(false);
  });

  it("fuera de onia.com.bo no avisa nada: ni local ni vistas previas ensucian el píxel", () => {
    const v = correr("http://localhost:3000/?utm_source=facebook");
    v.disparar("load");
    v.ocioso();
    v.tocar({ href: REGISTRO_URL });

    expect(v.pedidos).toHaveLength(0);
  });

  it("con Global Privacy Control no avisa nada, pero el origen igual viaja al alta", () => {
    const v = correr(ENTRADA, {}, { gpc: true });
    v.disparar("load");
    v.ocioso();
    const enlace = { href: REGISTRO_URL };
    v.tocar(enlace);

    expect(v.pedidos).toHaveLength(0);
    expect(new URL(enlace.href).searchParams.get("src")).toBe("ad-d1");
  });

  it("no descarga ningún script de Meta", () => {
    expect(origenDeCampanaInit).not.toContain("connect.facebook.net");
    expect(origenDeCampanaInit).not.toContain("createElement");
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
