// ONIA — un destino de TERCERO se mide por si AUTORIZA, no por si el host resuelve.
//
// EL AGUJERO QUE CIERRA (medido el 2026-09-19 contra produccion). `destinos-vivos.mjs` nacio
// para cazar la caida de Speaches, que es un contenedor de NUESTRA red: ahi la pregunta correcta
// es "hay alguien del otro lado", y por eso su cabecera declara "un 401 prueba que el servicio
// existe". Cierto para un vecino de la red de docker; FALSO para un tercero con credencial.
//
// `api.openai.com` nunca se cae del DNS y siempre contesta HTTP. Es el UNICO respaldo que le
// queda a "el prospecto manda una NOTA DE VOZ y el bot la entiende" —el primario, Speaches,
// esta MUERTO desde hace dias (`wget` desde onia-center: "bad address")— y el catalogo de venta
// marca esa capacidad ✅ viva. O sea: la unica red de una capacidad que se vende estaba vigilada
// por un gate que NO PODIA reportarla rota nunca. Gate apagado con cara de encendido.
//
// Y el modo de falla no es hipotetico: la tarea t_ac3aa802 lleva 200 h bloqueada pidiendole plata
// a Sergio Urcullo por "OpenAI SIN CREDITO desde el 9-sep". Con esta pregunta hecha, un gate
// contesta eso solo en cada corrida en vez de dejar la afirmacion congelada nueve dias.
//
// LA DISTINCION NO ES EL STATUS, ES QUIEN TIENE QUE APORTAR LA LLAVE. Para un destino interno
// (litellm, chatwoot) un 401 sigue siendo "contesta": prueba que hay alguien y el bot ya le habla
// con su key por otro camino. Para un destino cuya credencial declaramos NOSOTROS, un 401/403 es
// "existe, y el bot no lo puede usar" — que para el prospecto es idéntico a que no exista.
//
// Validado por mutacion (2026-09-19): quitarle a `destinoContesta` la clasificacion por status
// deja el caso 1 en rojo; quitarle el header, el caso 4; y devolver la credencial en el motivo,
// el caso 5.

import assert from "node:assert/strict";
import test from "node:test";

import { cadenaDeDestinos, destinoContesta } from "./destinos-vivos.mjs";
import { getFallbackConfig } from "./audio-transcribe.mjs";

const KEY = "sk-secreto-que-no-se-loguea-jamas";

/** Un `wget` falso que contesta la cabecera HTTP que le pidan, y anota el comando recibido. */
function wgetQueContesta(status, cuerpo = "") {
  const vistos = [];
  const ejecutar = (cmd) => {
    vistos.push(cmd);
    return `  HTTP/1.1 ${status}\n  content-type: application/json\n${cuerpo}\n__rc=0`;
  };
  return { ejecutar, vistos };
}

test("con credencial declarada, un 401 NO es 'contesta': el bot no puede usar ese destino", () => {
  const { ejecutar } = wgetQueContesta("401 Unauthorized");
  const r = destinoContesta("https://api.openai.com/v1/models", ejecutar, KEY);
  assert.equal(r.contesta, false, "un 401 sobre un destino con credencial propia es la capacidad ROTA");
  assert.match(r.motivo, /401/);
});

test("con credencial declarada, un 429 por cuota tampoco es 'contesta'", () => {
  const { ejecutar } = wgetQueContesta("429 Too Many Requests", '{"error":{"code":"insufficient_quota"}}');
  const r = destinoContesta("https://api.openai.com/v1/models", ejecutar, KEY);
  assert.equal(r.contesta, false, "sin cuota el prospecto recibe exactamente lo mismo que si el host no existiera");
  assert.match(r.motivo, /429|cuota/i);
});

test("con credencial declarada, un 200 sigue siendo 'contesta'", () => {
  const { ejecutar } = wgetQueContesta("200 OK");
  assert.equal(destinoContesta("https://api.openai.com/v1/models", ejecutar, KEY).contesta, true);
});

// La direccion SIMETRICA, y la mitad que un arreglo apresurado rompe: si un 401 pasara a ser
// `false` para TODOS, litellm y chatwoot —que contestan 401 estando sanos— se reportarian rotos y
// el gate mandaria a levantar servicios que andan. El sujeto es la credencial, no el numero.
test("SIN credencial declarada, un 401 sigue probando que el destino existe", () => {
  const { ejecutar } = wgetQueContesta("401 Unauthorized");
  const r = destinoContesta("http://onia_selfhosted-litellm-1:4000/v1/models", ejecutar);
  assert.equal(r.contesta, true, "un destino interno que pide auth esta VIVO: el bot le habla con su key por otro camino");
});

test("la credencial VIAJA en el pedido: preguntar sin ella siempre daria 401 y el gate mentiria al reves", () => {
  const { ejecutar, vistos } = wgetQueContesta("200 OK");
  destinoContesta("https://api.openai.com/v1/models", ejecutar, KEY);
  assert.equal(vistos.length, 1);
  assert.match(vistos[0], /Authorization:\s*Bearer/i);
  assert.ok(vistos[0].includes(KEY), "sin la key en el header el destino contestaria 401 y el gate lo llamaria roto estando sano");
});

test("la credencial NUNCA sale en el motivo: el informe se pega en tareas y logs", () => {
  const { ejecutar } = wgetQueContesta("401 Unauthorized");
  const r = destinoContesta("https://api.openai.com/v1/models", ejecutar, KEY);
  assert.ok(!JSON.stringify(r).includes(KEY), "el veredicto de un gate viaja a un tablero compartido");
});

// Caso ancla: el sujeto que motivo el gate tiene que estar en el universo. Si `cadenaDeDestinos`
// no devolviera la credencial, todo lo de arriba seria correcto y NADIE lo llamaria con ella.
test("el eslabon de respaldo lleva la credencial que resolvio el PRODUCTO, no una copia", () => {
  const env = {
    ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai",
    OPENAI_ONIA_CENTER_API_KEY: KEY,
  };
  const cap = {
    env: "ONIA_AUDIO_STT_BASE_URL",
    defecto: "http://speaches:8000/v1",
    probe: "/models",
    respaldo: { resuelve: "getFallbackConfig", con: getFallbackConfig, probe: "/models" },
  };
  const cadena = cadenaDeDestinos(cap, env, true);
  const respaldo = cadena.find((e) => e.rol === "respaldo");
  assert.ok(respaldo, "el respaldo declarado tiene que estar en la cadena");
  assert.equal(respaldo.credencial, getFallbackConfig(env).apiKey);
  assert.equal(cadena.find((e) => e.rol === "primario").credencial ?? null, null, "Speaches es de la red propia: no lleva llave nuestra");
});

// Dos eslabones pueden compartir URL y NO compartir respuesta: preguntar con llave y sin llave son
// dos preguntas distintas. Una cache por URL pelada le daria a uno el veredicto del otro.
// Por que la cache de `medir()` no puede keyear por URL pelada: LA MISMA url contestando LO MISMO
// da veredictos OPUESTOS segun quien tenga que aportar la llave. Con una clave por URL, el primero
// que preguntara le dejaria su respuesta al otro.
test("la misma URL y el mismo 401 dan veredictos opuestos segun si declaramos credencial", () => {
  const url = "https://api.openai.com/v1/models";
  const conLlave = destinoContesta(url, wgetQueContesta("401 Unauthorized").ejecutar, KEY);
  const sinLlave = destinoContesta(url, wgetQueContesta("401 Unauthorized").ejecutar);
  assert.equal(conLlave.contesta, false);
  assert.equal(sinLlave.contesta, true);
});
