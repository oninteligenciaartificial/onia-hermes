/*
 * Tests de la capa de TRANSPORTE HTTP del cliente SOAP del SIAT (Bolivia).
 * fetchImpl es un MOCK: NO se toca la red real. Se verifica el header
 * Authorization, la logica de reintentos (5xx si, 4xx no), el manejo de timeout
 * como error de red y la clasificacion en 5 casos. El SOAPAction exacto queda
 * [VERIFICAR] contra el WSDL -- ver cabecera de src/soap-transport.mjs.
 * Run: node --test hermes-content/integrations/siat/test/soap-transport.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_BACKOFF_MS,
  DEFAULT_RETRIES,
  DEFAULT_TIMEOUT_MS,
  SOAP_CONTENT_TYPE,
  classifyResponse,
  isRetryable,
  postSoap,
} from "../src/soap-transport.mjs";

// Sleep no-op: los tests no esperan el backoff real.
const noSleep = async () => {};

// Mock de fetch que responde SIEMPRE lo mismo y cuenta las llamadas.
function fixedFetch(status, body = "") {
  const calls = [];
  const impl = async (url, opts) => {
    calls.push({ url, opts });
    return { status, text: async () => body };
  };
  impl.calls = calls;
  return impl;
}

describe("postSoap: headers", () => {
  it("el header Authorization sale 'Token XYZ' (via buildAuthHeader)", async () => {
    const fetchImpl = fixedFetch(200, "<r><transaccion>true</transaccion></r>");
    await postSoap({
      endpoint: "https://siat.example/v2/FacturacionCodigos",
      envelope: "<soapenv:Envelope/>",
      token: "XYZ",
      soapAction: "cuis",
      fetchImpl,
      sleepImpl: noSleep,
    });
    assert.equal(fetchImpl.calls.length, 1);
    assert.equal(fetchImpl.calls[0].opts.headers.Authorization, "Token XYZ");
  });

  it("manda Content-Type SOAP 1.1, SOAPAction entrecomillado y method POST", async () => {
    const fetchImpl = fixedFetch(200, "<r><transaccion>true</transaccion></r>");
    await postSoap({
      endpoint: "https://siat.example/v2/FacturacionCodigos",
      envelope: "<soapenv:Envelope/>",
      token: "T",
      soapAction: "cuis",
      fetchImpl,
      sleepImpl: noSleep,
    });
    const { opts } = fetchImpl.calls[0];
    assert.equal(opts.method, "POST");
    assert.equal(opts.headers["Content-Type"], SOAP_CONTENT_TYPE);
    assert.equal(opts.headers.SOAPAction, '"cuis"'); // [VERIFICAR valor exacto vs WSDL]
    assert.equal(opts.body, "<soapenv:Envelope/>");
  });

  it("SOAPAction vacio -> '\"\"' (SOAP 1.1 exige el header presente)", async () => {
    const fetchImpl = fixedFetch(200, "<r><transaccion>true</transaccion></r>");
    await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      fetchImpl,
      sleepImpl: noSleep,
    });
    assert.equal(fetchImpl.calls[0].opts.headers.SOAPAction, '""');
  });

  it("token vacio hace lanzar (lo enforce buildAuthHeader)", async () => {
    await assert.rejects(
      () =>
        postSoap({
          endpoint: "https://siat.example/v2/x",
          envelope: "<e/>",
          token: "",
          fetchImpl: fixedFetch(200),
          sleepImpl: noSleep,
        }),
      /token/,
    );
  });
});

describe("postSoap: reintentos", () => {
  it("reintenta ante 503 y se detiene tras el numero de retries", async () => {
    const fetchImpl = fixedFetch(503, "<html>Service Unavailable</html>");
    const r = await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      retries: 3,
      backoffMs: 0,
      fetchImpl,
      sleepImpl: noSleep,
    });
    assert.equal(fetchImpl.calls.length, 3); // 3 intentos, luego se detiene
    assert.equal(r.attempts, 3);
    assert.equal(r.ok, false);
    assert.equal(r.status, 503);
    assert.equal(r.error, "server");
  });

  it("cuenta bien los backoffs (retries-1 sleeps) con backoff exponencial", async () => {
    const fetchImpl = fixedFetch(500);
    const delays = [];
    const spySleep = async (ms) => {
      delays.push(ms);
    };
    await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      retries: 3,
      backoffMs: 100,
      fetchImpl,
      sleepImpl: spySleep,
    });
    // Entre 3 intentos hay 2 esperas: 100 * 2^0 y 100 * 2^1.
    assert.deepEqual(delays, [100, 200]);
  });

  it("NO reintenta ante 400 (4xx no es reintentable)", async () => {
    const fetchImpl = fixedFetch(400, "<error>bad request</error>");
    const r = await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      retries: 3,
      backoffMs: 0,
      fetchImpl,
      sleepImpl: noSleep,
    });
    assert.equal(fetchImpl.calls.length, 1); // un solo intento
    assert.equal(r.attempts, 1);
    assert.equal(r.ok, false);
    assert.equal(r.status, 400);
  });

  it("exito al primer intento -> ok:true, attempts:1, parsed presente", async () => {
    const body = "<R><transaccion>true</transaccion><codigoEstado>908</codigoEstado></R>";
    const fetchImpl = fixedFetch(200, body);
    const r = await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      fetchImpl,
      sleepImpl: noSleep,
    });
    assert.equal(r.ok, true);
    assert.equal(r.attempts, 1);
    assert.equal(r.error, null);
    assert.equal(r.status, 200);
    assert.equal(r.parsed.transaccion, true);
    assert.equal(r.parsed.codigoEstado, 908);
  });

  it("recupera si el primer intento es 503 y el segundo 200", async () => {
    let i = 0;
    const seq = [
      { status: 503, body: "" },
      { status: 200, body: "<R><transaccion>true</transaccion></R>" },
    ];
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push(opts);
      const r = seq[i];
      i += 1;
      return { status: r.status, text: async () => r.body };
    };
    const r = await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      retries: 3,
      backoffMs: 0,
      fetchImpl,
      sleepImpl: noSleep,
    });
    assert.equal(calls.length, 2);
    assert.equal(r.attempts, 2);
    assert.equal(r.ok, true);
  });
});

describe("postSoap: timeout como error de red", () => {
  it("un timeout se maneja, se reintenta y cuenta como error de red", async () => {
    let aborts = 0;
    // Nunca resuelve por si mismo: rechaza cuando el AbortController dispara.
    const hangingFetch = async (url, opts) =>
      new Promise((_, reject) => {
        opts.signal.addEventListener("abort", () => {
          aborts += 1;
          reject(new Error("The operation was aborted"));
        });
      });
    const r = await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      timeoutMs: 5,
      retries: 2,
      backoffMs: 0,
      fetchImpl: hangingFetch,
      sleepImpl: noSleep,
    });
    assert.equal(aborts, 2); // aborta en cada intento
    assert.equal(r.attempts, 2);
    assert.equal(r.ok, false);
    assert.equal(r.status, null);
    assert.equal(r.body, null);
    assert.equal(r.error, "network");
  });

  it("un fetch que rechaza (DNS/conexion) cuenta como error de red", async () => {
    const failFetch = async () => {
      throw new Error("ENOTFOUND siat.example");
    };
    const r = await postSoap({
      endpoint: "https://siat.example/v2/x",
      envelope: "<e/>",
      token: "T",
      retries: 1,
      backoffMs: 0,
      fetchImpl: failFetch,
      sleepImpl: noSleep,
    });
    assert.equal(r.attempts, 1);
    assert.equal(r.ok, false);
    assert.equal(r.error, "network");
  });
});

describe("postSoap: validacion de entrada", () => {
  it("lanza sin endpoint, sin envelope o sin fetchImpl", async () => {
    await assert.rejects(
      () => postSoap({ envelope: "<e/>", token: "T", fetchImpl: fixedFetch(200) }),
      /endpoint/,
    );
    await assert.rejects(
      () => postSoap({ endpoint: "u", token: "T", fetchImpl: fixedFetch(200) }),
      /envelope/,
    );
    await assert.rejects(
      () => postSoap({ endpoint: "u", envelope: "<e/>", token: "T" }),
      /fetchImpl/,
    );
  });
});

describe("classifyResponse: distingue los 5 casos", () => {
  it("ok: HTTP 2xx sin fault y sin transaccion:false", () => {
    assert.equal(classifyResponse(200, "<R><transaccion>true</transaccion></R>"), "ok");
  });

  it("network: sin respuesta (status null o 0)", () => {
    assert.equal(classifyResponse(null, ""), "network");
    assert.equal(classifyResponse(0, ""), "network");
  });

  it("server: HTTP 5xx", () => {
    assert.equal(classifyResponse(503, ""), "server");
    assert.equal(classifyResponse(500, "<html>oops</html>"), "server");
  });

  it("soap_fault: el body trae un soap:Fault (aun con HTTP 500)", () => {
    const fault =
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>' +
      "<soap:Fault><faultcode>soap:Server</faultcode><faultstring>error</faultstring></soap:Fault>" +
      "</soap:Body></soap:Envelope>";
    assert.equal(classifyResponse(500, fault), "soap_fault");
    assert.equal(classifyResponse(200, fault), "soap_fault");
  });

  it("business: transaccion:false (rechazo de negocio)", () => {
    assert.equal(classifyResponse(200, "<R><transaccion>false</transaccion></R>"), "business");
  });
});

describe("isRetryable", () => {
  it("5xx y sin respuesta (null/0) son reintentables; 4xx y 2xx no", () => {
    assert.equal(isRetryable(500), true);
    assert.equal(isRetryable(503), true);
    assert.equal(isRetryable(null), true);
    assert.equal(isRetryable(0), true);
    assert.equal(isRetryable(400), false);
    assert.equal(isRetryable(404), false);
    assert.equal(isRetryable(200), false);
  });
});

describe("defaults exportados", () => {
  it("coinciden con la spec (30000 / 3 / 500)", () => {
    assert.equal(DEFAULT_TIMEOUT_MS, 30000);
    assert.equal(DEFAULT_RETRIES, 3);
    assert.equal(DEFAULT_BACKOFF_MS, 500);
  });
});
