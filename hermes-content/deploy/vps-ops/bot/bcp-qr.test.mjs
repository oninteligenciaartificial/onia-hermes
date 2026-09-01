// Tests del adaptador BCP QR (mock + contrato real) y de sus dos rutas.
// El banco todavia no entrego credenciales (decision Sergio 2026-08-28: "armalo
// con credenciales falsas solo para probar") — el modo mock ejercita el circuito
// completo (generar QR → imagen al chat → callback → aviso de pago) con el MISMO
// shape que la API real (ONIA_BCP_API_QR_INTEGRACION.md §2, §3.1, §3.3).

import test from "node:test";
import assert from "node:assert/strict";

import { crearClienteBcp, handleBcpCobrar, handleBcpCallback, mockQrPng } from "./bcp-qr.mjs";

const ENV_MOCK = { BCP_MODE: "mock", ONIA_BOT_PREVIEW_SECRET: "secreto-test" };

// ---------------------------------------------------------------------------
// Cliente
// ---------------------------------------------------------------------------

test("bcp: sin BCP_MODE el cliente esta APAGADO y lo dice claro", async () => {
  const cliente = crearClienteBcp({});
  assert.equal(cliente.mode, "off");
  const out = await cliente.generarQr({ amount: 100, gloss: "Pedido", correlationId: "c-1" });
  assert.equal(out.ok, false);
  assert.match(out.error, /BCP_MODE/);
});

test("bcp mock: genera un QR con el shape de la API real (id int, qrImage base64 PNG, expiracion)", async () => {
  const cliente = crearClienteBcp(ENV_MOCK);
  assert.equal(cliente.mode, "mock");
  const out = await cliente.generarQr({ amount: 150.5, gloss: "Pedido ferreteria", correlationId: "onia-7-1" });
  assert.equal(out.ok, true);
  assert.ok(Number.isInteger(out.id) && out.id > 0, "data.id es int como en la API real");
  const png = Buffer.from(out.qrImage, "base64");
  assert.equal(png.subarray(0, 4).toString("latin1"), "\x89PNG", "qrImage decodifica a un PNG real");
  assert.match(out.expirationDate, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, "yyyy-MM-dd HH:mm como el banco");
});

test("bcp mock: la glosa se sanea como exige el banco (max 60, sin caracteres especiales)", async () => {
  const cliente = crearClienteBcp(ENV_MOCK);
  const out = await cliente.generarQr({
    amount: 10,
    gloss: "Pedido @#$% con simbolos y un texto larguisimo que se pasa de los sesenta caracteres permitidos",
    correlationId: "c-2",
  });
  assert.equal(out.ok, true);
  assert.ok(out.gloss.length <= 60, "recortada a 60");
  assert.ok(!/[@$%#&]/.test(out.gloss), "sin caracteres especiales");
});

test("bcp mock: monto invalido se rechaza (el QR es una orden de cobro)", async () => {
  const cliente = crearClienteBcp(ENV_MOCK);
  for (const amount of [0, -5, NaN, "12"]) {
    const out = await cliente.generarQr({ amount, gloss: "x", correlationId: "c-3" });
    assert.equal(out.ok, false, `monto ${amount} no puede generar QR`);
  }
});

test("bcp: el PNG mock es determinista por correlationId (testeable, sin Math.random)", () => {
  const a = mockQrPng("onia-7-123");
  const b = mockQrPng("onia-7-123");
  const c = mockQrPng("onia-8-999");
  assert.ok(a.equals(b), "misma semilla, mismo PNG");
  assert.ok(!a.equals(c), "semilla distinta, PNG distinto");
});

// ---------------------------------------------------------------------------
// Ruta /bcp/cobrar — la dispara UN HUMANO (regla: el bot jamas cobra solo)
// ---------------------------------------------------------------------------

function clienteChatwootFake() {
  const llamadas = { attachments: [], mensajes: [] };
  return {
    llamadas,
    enabled: true,
    // Contrato REAL del adapter: devuelve el mensaje creado (objeto) o null.
    async sendAttachment(conversationId, opts) {
      llamadas.attachments.push({ conversationId, ...opts });
      return { id: 1 };
    },
    async sendMessage(conversationId, content) {
      llamadas.mensajes.push({ conversationId, content });
      return { id: 2 };
    },
  };
}

test("cobrar: sin Bearer valido devuelve 401 (apagado por defecto)", async () => {
  const out = await handleBcpCobrar(
    { rawBody: "{}", headers: {} },
    { env: ENV_MOCK, client: clienteChatwootFake() },
  );
  assert.equal(out.status, 401);
});

test("cobrar: monto invalido o conversacion faltante devuelven 400 con motivo", async () => {
  const casos = [
    { conversationId: 7 }, // sin monto
    { monto: 50 }, // sin conversacion
    { conversationId: 7, monto: -1 },
  ];
  for (const caso of casos) {
    const out = await handleBcpCobrar(
      { rawBody: JSON.stringify(caso), headers: { authorization: "Bearer secreto-test" } },
      { env: ENV_MOCK, client: clienteChatwootFake() },
    );
    assert.equal(out.status, 400, JSON.stringify(caso));
  }
});

test("cobrar (mock): genera el QR y lo manda como IMAGEN a la conversacion, con el monto en el caption", async () => {
  const client = clienteChatwootFake();
  const out = await handleBcpCobrar(
    {
      rawBody: JSON.stringify({ conversationId: 7, monto: 150.5, glosa: "Pedido tornillos" }),
      headers: { authorization: "Bearer secreto-test" },
    },
    { env: ENV_MOCK, client },
  );
  assert.equal(out.status, 200);
  assert.equal(out.body.ok, true);
  assert.equal(out.body.mode, "mock");
  assert.ok(out.body.correlationId.includes("7"), "la correlacion lleva la conversacion");
  assert.equal(client.llamadas.attachments.length, 1);
  const att = client.llamadas.attachments[0];
  assert.equal(att.conversationId, 7);
  assert.equal(att.contentType, "image/png");
  assert.match(att.caption, /150[.,]50?/, "el caption dice el monto");
  assert.match(att.caption, /PRUEBA/i, "en mock el caption avisa que es de prueba");
});

// ---------------------------------------------------------------------------
// Ruta /bcp/callback — la llama el banco (Basic user:publicToken), contrato §3.3
// ---------------------------------------------------------------------------

const ENV_CALLBACK = { ...ENV_MOCK, BCP_CALLBACK_USER: "bcp-user", BCP_CALLBACK_TOKEN: "tok-123" };
const BASIC_OK = "Basic " + Buffer.from("bcp-user:tok-123").toString("base64");

function bodyCallback(extra = {}) {
  return JSON.stringify({
    IdCorrelation: "onia-7-999",
    Id: 12345,
    Amount: 150.5,
    Currency: "BOB",
    Gloss: "Pedido tornillos",
    Status: "P",
    OperationNumber: "OP-777",
    Collectors: [{ name: "conversationId", parameter: "conversationId", value: "7" }],
    ...extra,
  });
}

test("callback: credenciales incorrectas responden State 003 con Data.id E- (contrato del banco)", async () => {
  const out = await handleBcpCallback(
    { rawBody: bodyCallback(), headers: { authorization: "Basic bm86bm8=" } },
    { env: ENV_CALLBACK, client: clienteChatwootFake() },
  );
  assert.equal(out.status, 401);
  assert.equal(out.body.State, "003");
  assert.match(String(out.body.Data.id), /^E-/);
});

test("callback OK: avisa el pago EN la conversacion (via Collectors) y responde State 000 con el Id eco", async () => {
  const client = clienteChatwootFake();
  const out = await handleBcpCallback(
    { rawBody: bodyCallback(), headers: { authorization: BASIC_OK } },
    { env: ENV_CALLBACK, client },
  );
  assert.equal(out.status, 200);
  assert.equal(out.body.State, "000");
  assert.equal(out.body.Mensaje, "COMPLETADO");
  assert.equal(out.body.Data.Id, 12345);
  assert.equal(client.llamadas.mensajes.length, 1);
  assert.equal(client.llamadas.mensajes[0].conversationId, 7);
  assert.match(client.llamadas.mensajes[0].content, /150[.,]50?/);
  assert.match(client.llamadas.mensajes[0].content, /OP-777/);
});

test("callback sin Collectors mapeables: responde 000 IGUAL (la plata ya entro; reintentos del banco no la arreglan) y avisa posted:false", async () => {
  const client = clienteChatwootFake();
  const out = await handleBcpCallback(
    { rawBody: bodyCallback({ Collectors: [] }), headers: { authorization: BASIC_OK } },
    { env: ENV_CALLBACK, client },
  );
  assert.equal(out.status, 200);
  assert.equal(out.body.State, "000", "nunca hacer reintentar al banco por un problema NUESTRO de mapeo");
  assert.equal(client.llamadas.mensajes.length, 0);
});

test("callback con JSON roto: State 099 + Data.id E- (error nuestro, el banco reintenta)", async () => {
  const out = await handleBcpCallback(
    { rawBody: "{{{", headers: { authorization: BASIC_OK } },
    { env: ENV_CALLBACK, client: clienteChatwootFake() },
  );
  assert.equal(out.body.State, "099");
  assert.match(String(out.body.Data.id), /^E-/);
});
