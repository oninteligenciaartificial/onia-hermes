#!/usr/bin/env node
"use strict";

const url = process.env.N8N_MCP_URL;
const token = process.env.N8N_MCP_TOKEN;

function fail(message, extra = {}) {
  console.log(JSON.stringify({ ok: false, error: message, ...extra }, null, 2));
  process.exitCode = 1;
}

function parseSseJson(text) {
  const line = text.split(/\r?\n/).find((entry) => entry.startsWith("data: "));
  if (!line) return null;
  return JSON.parse(line.slice(6));
}

async function rpc(method, params, id) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });

  const text = await res.text();
  return {
    status: res.status,
    ok: res.ok,
    contentType: res.headers.get("content-type"),
    data: parseSseJson(text),
    preview: text.slice(0, 200),
  };
}

async function main() {
  if (!url) return fail("Missing env var N8N_MCP_URL");
  if (!token) return fail("Missing env var N8N_MCP_TOKEN");

  const init = await rpc(
    "initialize",
    {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: {
        name: "hermes-n8n-mcp-healthcheck",
        version: "1.0.0",
      },
    },
    1,
  );

  if (!init.ok || init.data?.error) {
    return fail("n8n MCP initialize failed", {
      status: init.status,
      contentType: init.contentType,
      response: init.data?.error || init.preview,
    });
  }

  const tools = await rpc("tools/list", {}, 2);
  if (!tools.ok || tools.data?.error) {
    return fail("n8n MCP tools/list failed", {
      status: tools.status,
      contentType: tools.contentType,
      response: tools.data?.error || tools.preview,
    });
  }

  const toolList = tools.data?.result?.tools || [];
  console.log(
    JSON.stringify(
      {
        ok: true,
        url,
        server: init.data?.result?.serverInfo || null,
        tool_count: toolList.length,
        tools_preview: toolList.slice(0, 12).map((tool) => tool.name),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => fail(error.message));
