// Gate del AVISO a Sergio. Nace del 2026-09-05, midiendo el objetivo del carril:
//
//   `avisos demo/handoff 0` llevaba turnos en 0 y NADIE podia decir si eso significaba
//   "el circuito esta roto" o "no hubo ni un handoff real". Es un numero que no puede
//   ponerse rojo: decoracion. Medido ese dia, el circuito estaba ENTERO —flag `true` en
//   el proceso vivo, token y chat validos contra `getMe`/`getChat`, el motor emitiendo
//   `notify_sergio` y `construirAviso` devolviendo un texto accionable— y el 0 era, todo
//   ese tiempo, "no hubo eventos".
//
// La invariante que se prueba aca es esa distincion, no el conteo: un 0 con el circuito
// sano y un 0 con el circuito roto tienen que dar VEREDICTOS DISTINTOS. Si dan el mismo,
// el gate volvio a ser decoracion.
//
// La otra mitad del gate —que no se puede medir sin el VPS— es que NO mienta cuando no
// puede medir: sin `/opt/onia/bot` el veredicto es `no_medido`, nunca `ok`. Esa direccion
// es la cara: un gate que dice "al dia" desde una maquina que no ve produccion apaga al
// unico instrumento que miraba el problema.

import test from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  diagnosticar,
  contarEventos,
  resolverBotDesplegado,
  motorProduceAviso,
  RAMAS_QUE_AVISAN,
  asegurarTransporteQueAguanta,
  lineasDelLog,
  BOT_DIR,
} from "./avisos-vivo.mjs";

/** El bot de ESTE repo. Es el espejo del desplegado y no sale a la red: el gate sigue hermetico. */
const DIR_BOT = dirname(fileURLToPath(import.meta.url));

const CIRCUITO_SANO = {
  flagEncendido: true,
  credencialesOk: true,
  motorEmiteNotify: true,
  textoAccionable: true,
};

test("cero avisos con el circuito SANO no es lo mismo que cero con el circuito ROTO", () => {
  const sinEventos = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]) });
  const roto = diagnosticar({
    circuito: { ...CIRCUITO_SANO, flagEncendido: false },
    eventos: contarEventos([]),
  });

  // Los dos cuentan 0 avisos. Ese era exactamente el problema.
  assert.equal(sinEventos.eventos.enviados, 0);
  assert.equal(roto.eventos.enviados, 0);

  // Y aun asi el veredicto tiene que separarlos.
  assert.notEqual(sinEventos.veredicto, roto.veredicto);
  assert.equal(sinEventos.veredicto, "ok");
  assert.equal(roto.veredicto, "roto");
});

test("el circuito se rompe por CUALQUIERA de sus eslabones, no solo por el flag", () => {
  for (const eslabon of ["flagEncendido", "credencialesOk", "motorEmiteNotify", "textoAccionable"]) {
    const d = diagnosticar({
      circuito: { ...CIRCUITO_SANO, [eslabon]: false },
      eventos: contarEventos([]),
    });
    assert.equal(d.veredicto, "roto", `${eslabon} en false tiene que dar rojo`);
    assert.ok(d.motivos.some((m) => m.includes(eslabon)), `el motivo tiene que nombrar ${eslabon}`);
  }
});

test("un aviso que sale FALLIDO es rojo aunque el circuito parezca sano", () => {
  // El modo de falla mas caro: el circuito responde bien a las preguntas de configuracion
  // y aun asi el envio real muere. Una persona esperando que Sergio le escriba, y nadie
  // se entera. Un `failed` en el log manda sobre cualquier chequeo de configuracion.
  const lineas = ["[aviso] failed conv=57 (handoff): fetch timeout"];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.fallidos, 1);
  assert.equal(d.veredicto, "roto");
});

test("un aviso SALTEADO tambien es rojo: es una persona esperando que nadie atendio", () => {
  // Medido en produccion el 2026-09-04: `[aviso] skipped (cuota_agotada)` sobre handoffs
  // reales. El circuito estaba "bien configurado" y el aviso no salia igual.
  const lineas = ["[aviso] skipped conv=53 (handoff): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.salteados, 1);
  assert.equal(d.veredicto, "roto");
});

test("avisos enviados con el circuito sano es verde, y cuenta los eventos", () => {
  const lineas = [
    "[aviso] sent conv=57 (handoff): ok",
    "[aviso] sent conv=58 (demo_agendada): ok",
  ];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.enviados, 2);
  assert.equal(d.veredicto, "ok");
});

test("contarEventos ignora las lineas que no son del aviso", () => {
  // El log del webhook mezcla `[n8n]`, `[aviso]` y las lineas por mensaje. Contar de mas
  // aca inventa avisos que nunca existieron.
  const lineas = [
    "[onia-webhook] conv=49 msg=497 estado=200 rama=respondio",
    "[n8n] no se pudo disparar el evento",
    "[aviso] sent conv=57 (handoff): ok",
  ];
  assert.equal(contarEventos(lineas).enviados, 1);
  assert.equal(contarEventos(lineas).total, 1);
});

test("sin poder medir, el veredicto es no_medido — NUNCA ok", () => {
  // La direccion cara. Ya paso en este carril el 2026-09-05: un gate que leia una ruta
  // absoluta del VPS dejo de medir al mudarse el loop, y el objetivo siguio firmando
  // "meta cumplida" con el problema vivo.
  const d = diagnosticar({ circuito: null, eventos: contarEventos([]) });
  assert.equal(d.veredicto, "no_medido");
  assert.notEqual(d.veredicto, "ok");
});

// ---------------------------------------------------------------------------
// De donde sale el codigo que se mide — el escalon que faltaba
// ---------------------------------------------------------------------------
//
// Este gate importa el bot DESPLEGADO (no el del repo) a proposito: su unico valor es
// probar que las piezas que CORREN encajan entre si. Eso lo ataba a `/opt/onia/bot`, una
// ruta que existe en el VPS y NO en nodo-casa, adonde se mudo este carril el 2026-09-06.
// Desde entonces el tercer numero del objetivo salia `no_medido` en cada vuelta.
//
// Es la MISMA clase que el falso verde del simulador arreglado el 2026-09-07, un escalon
// mas arriba: alla faltaba UNA variable y alcanzaba con `ssh cat`; aca hay que traerse el
// artefacto entero. Apuntar al repo en vez de traerlo seria mas facil y ROMPERIA lo que el
// gate existe para probar.

const MOTOR = "bot-engine.mjs";

/**
 * Un `spawnSync` de mentira que ANOTA lo que le pidieron en vez de salir a la red.
 *
 * El estado se da POR COMANDO a proposito: uno solo para todos hace que el `tar` tape al
 * `ssh` y el caso pase por el motivo equivocado — asi quedo hueco el chequeo del `ssh` en
 * el primer intento de este escalon (visto por mutacion, no leyendo).
 */
function espia({ status = 0, stdout = "", porComando = {} } = {}) {
  const llamadas = [];
  const fn = (cmd, args) => {
    llamadas.push({ cmd, args: args || [] });
    return { status: cmd in porComando ? porComando[cmd] : status, stdout, stderr: "" };
  };
  return { fn, llamadas };
}

test("sin el bot en el disco local, se lo trae del VPS y SI se puede medir", () => {
  // La brecha que este escalon cierra. Antes de esto el resolvedor no existia y el gate
  // salia `no_medido` en nodo-casa con produccion sana del otro lado.
  const { fn, llamadas } = espia();
  const r = resolverBotDesplegado({
    existsSync: (p) => p !== BOT_DIR && String(p).endsWith(MOTOR),
    spawnSync: fn,
  });

  assert.ok(r, "con el VPS respondiendo, el resolvedor tiene que devolver un directorio");
  assert.equal(r.origen, "remoto");
  assert.notEqual(r.dir, BOT_DIR, "el remoto se copia a un temporal, no se finge la ruta del VPS");
  assert.ok(
    llamadas.some((l) => l.cmd === "ssh"),
    "tiene que haberle preguntado al VPS",
  );

  // El caso feliz devuelve un temporal REAL y el que limpia es quien lo pidio (`medir`), asi
  // que aca lo limpia el test: en WSL `/tmp` es un tmpfs que vive en RAM, y un directorio por
  // corrida se acumula para siempre. Los caminos que fallan ya se limpian solos.
  rmSync(r.dir, { recursive: true, force: true });
});

test("ni el disco ni el VPS: el resolvedor devuelve null y el veredicto sigue siendo no_medido", () => {
  // La direccion cara, y la que NO se puede perder al agregar el escalon remoto: un gate
  // que firma "al dia" sin ver produccion apaga al unico instrumento que miraba el problema.
  const { fn } = espia({ status: 255 });
  const r = resolverBotDesplegado({ existsSync: () => false, spawnSync: fn });

  assert.equal(r, null);
  assert.equal(diagnosticar({ circuito: null, eventos: contarEventos([]) }).veredicto, "no_medido");
});

test("un ssh CORTADO A LA MITAD no se acepta aunque el motor haya alcanzado a llegar", () => {
  // Este caso es el que sostiene el chequeo de estado del `ssh`, y sin el ese guardia era
  // HUECO: con el ssh caido el destino queda vacio, asi que la verificacion del artefacto ya
  // lo tapaba y quitar el chequeo no ponia nada en rojo (medido por mutacion el 2026-09-07).
  //
  // El caso real que solo ve el estado: la transferencia se corta en el medio. `tar` extrae
  // lo que alcanzo a bajar —puede incluir `bot-engine.mjs` y faltarle `config.mjs`— y el
  // gate importaria un arbol truncado, que falla como si el bot estuviera roto.
  // El `tar` sale 0 —extrajo lo que llego— y el motor esta en el destino: los dos guardias
  // hermanos dan por bueno el arbol, y el ESTADO DEL SSH es lo unico que queda para verlo.
  const { fn } = espia({ porComando: { ssh: 255, tar: 0 } });
  const r = resolverBotDesplegado({
    existsSync: (p) => p !== BOT_DIR && String(p).endsWith(MOTOR),
    spawnSync: fn,
  });

  assert.equal(r, null, "si el ssh no salio 0, lo que haya quedado en el destino no es confiable");
});

test("el ssh puede salir 0 y no traer nada: sin el motor en el destino, NO se da por traido", () => {
  // `ssh ... | tar -x` en una tuberia devuelve el estado del ULTIMO comando, asi que un ssh
  // caido puede terminar en exit 0 con el destino VACIO. Se verifica el ARTEFACTO, no el
  // codigo de salida: sin `bot-engine.mjs` no hay nada que medir.
  const { fn } = espia({ status: 0, stdout: "" });
  assert.equal(resolverBotDesplegado({ existsSync: () => false, spawnSync: fn }), null);
});

test("cuando el bot esta en el disco local, NO se sale a la red", () => {
  // Hermeticidad. El testigo se ANOTA y se afirma DESPUES: afirmar TIRANDO adentro del
  // doble no sirve, porque el resolvedor envuelve la llamada en try/catch para sobrevivir
  // a un `ssh` ausente y se comeria el assert — el caso pasaria en verde con el gate roto.
  // Es la misma trampa que se cazo por mutacion en `simulate.test.mjs` el 2026-09-07.
  const { fn, llamadas } = espia();
  const r = resolverBotDesplegado({ existsSync: () => true, spawnSync: fn });

  assert.equal(r.dir, BOT_DIR);
  assert.equal(r.origen, "local");
  assert.deepEqual(llamadas, [], "con el artefacto en el disco no hay por que preguntarle al VPS");
});

// ---------------------------------------------------------------------------
// Las DOS ramas que avisan. Nace del 2026-09-07.
//
// El objetivo del carril dice "cada demo agendada O handoff le llega a Sergio", y este gate
// manejaba el motor SOLO hasta un handoff — su propio encabezado lo declaraba ("ante un
// pedido de humano"). Medido por mutacion ese dia: borrando entero el `notify_sergio` de la
// rama de agendar, el gate seguia dando VERDE. O sea que el dia que se rompa el aviso de la
// demo —la rama que lleva la plata, un prospecto que YA eligio horario— el unico instrumento
// que mira este objetivo dice "circuito: ok" y ningun numero se mueve.
//
// Son hermanas y se emiten desde funciones DISTINTAS del motor, con payloads de forma
// distinta (el handoff trae `reason`, la demo no): probar una no dice nada de la otra.
// ---------------------------------------------------------------------------

test("las ramas que avisan son las DOS que nombra el objetivo, no una", () => {
  // Ancla contra el olvido: si alguien saca una rama de la lista, el gate vuelve a ser
  // ciego de ese lado y nada mas se pondria rojo.
  assert.deepEqual([...RAMAS_QUE_AVISAN].sort(), ["demo_agendada", "handoff"]);
});

test("el motor desplegado avisa en las DOS ramas", async () => {
  const r = await motorProduceAviso(DIR_BOT);
  assert.ok(r, "no se pudo manejar el motor del propio repo");
  for (const kind of RAMAS_QUE_AVISAN) {
    assert.equal(r.ramas[kind]?.emite, true, `la rama ${kind} no emite notify_sergio`);
    assert.equal(r.ramas[kind]?.accionable, true, `el aviso de ${kind} no nombra la conversacion`);
  }
  assert.equal(r.emite, true);
  assert.equal(r.accionable, true);
});

test("si el motor deja de avisar la DEMO, el gate se pone ROJO y el handoff no lo tapa", async () => {
  // Este es el caso que NINGUN otro guardia puede ver, y por eso existe: con el handoff sano
  // el veredicto global tiene que caer igual. Es la mutacion del 2026-09-07 hecha permanente.
  const dir = mkdtempSync(join(tmpdir(), "avisos-rama-"));
  try {
    for (const f of readdirSync(DIR_BOT)) {
      if (f.endsWith(".mjs") || f.endsWith(".json")) copyFileSync(join(DIR_BOT, f), join(dir, f));
    }

    const motor = join(dir, "bot-engine.mjs");
    const fuente = readFileSync(motor, "utf8");
    const avisoDeLaDemo = /\{\s*type: "notify_sergio",\s*payload: \{ kind: "demo_agendada",[\s\S]*?\},\s*\},\n/;
    assert.match(fuente, avisoDeLaDemo, "cambio la forma del aviso de la demo: reescribi la mutacion");
    writeFileSync(motor, fuente.replace(avisoDeLaDemo, ""));

    const r = await motorProduceAviso(dir);
    assert.ok(r, "la mutacion tiene que dejar el motor importable, si no no prueba nada");
    assert.equal(r.ramas.handoff?.emite, true, "el handoff sigue sano: por eso el gate viejo daba verde");
    assert.equal(r.ramas.demo_agendada?.emite, false, "la demo dejo de avisar y el gate no lo vio");
    assert.equal(r.emite, false, "una rama rota tiene que romper el circuito entero");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// "No pude preguntar" NO es "me contestaron que no" — 2026-09-08
//
// Nace de una medicion de este carril: el gate dio `roto` con el motivo
// "credencialesOk: el token o el chat de Telegram no responden" y remato con
// "EL PROXIMO QUE PIDA UN HUMANO SE PIERDE". El token y el chat estaban SANOS
// (`getMe` -> aalfredhq_bot, `getChat` -> ok, los dos http 200): lo que fallaba
// era el INSTRUMENTO. Desde nodo-casa, `fetch` a api.telegram.org muere en
// ~350 ms con ETIMEDOUT porque Node corta cada intento de conexion a los 250 ms
// (`autoSelectFamilyAttemptTimeout`), la ruta IPv6 es ENETUNREACH y la IPv4
// tarda mas que eso. `curl` a la misma URL da 200.
//
// El defecto de fondo no es el timeout: es que `credencialesResponden`
// devolvia un BOOLEANO, asi que "no pude preguntar" y "Telegram me dijo que no"
// colapsaban en el mismo `false`. Es la ambiguedad de `buscarNegocio()` otra
// vez, y va en la direccion cara: manda a rotar un token sano o —peor— entrena
// a leer como falso el unico aviso que dice que alguien esta esperando.
// ---------------------------------------------------------------------------

test("credencialesOk en null es NO MEDIDO, no roto: nadie rota un token sano", () => {
  const d = diagnosticar({
    circuito: { ...CIRCUITO_SANO, credencialesOk: null },
    eventos: contarEventos([]),
  });

  assert.equal(d.veredicto, "no_medido", "no poder preguntarle a Telegram no prueba que el token este muerto");
  assert.ok(
    d.motivos.some((m) => /no se pudo preguntar/i.test(m)),
    `el motivo tiene que decir que no se pudo PREGUNTAR, no que "no responden": ${JSON.stringify(d.motivos)}`,
  );
});

test("null y false dan veredictos DISTINTOS: es toda la invariante", () => {
  const noSePudo = diagnosticar({ circuito: { ...CIRCUITO_SANO, credencialesOk: null }, eventos: contarEventos([]) });
  const contestoQueNo = diagnosticar({ circuito: { ...CIRCUITO_SANO, credencialesOk: false }, eventos: contarEventos([]) });

  assert.notEqual(noSePudo.veredicto, contestoQueNo.veredicto);
  assert.equal(contestoQueNo.veredicto, "roto", "si Telegram contesta que el token no sirve, eso SI es rojo");
});

test("una rotura REAL manda sobre un eslabon que no se pudo medir", () => {
  // Prioridad: evidencia de fallo > imposibilidad de preguntar. Si el flag esta apagado
  // o hay un aviso FALLIDO en el log, el rojo no lo tapa un `no_medido`.
  const conFlagApagado = diagnosticar({
    circuito: { ...CIRCUITO_SANO, credencialesOk: null, flagEncendido: false },
    eventos: contarEventos([]),
  });
  assert.equal(conFlagApagado.veredicto, "roto");

  const conAvisoFallido = diagnosticar({
    circuito: { ...CIRCUITO_SANO, credencialesOk: null },
    eventos: contarEventos(["[aviso] failed conversacion 61"]),
  });
  assert.equal(conAvisoFallido.veredicto, "roto", "un aviso FALLIDO es una persona esperando: eso es rojo medido");
});

test("el transporte aguanta un host mas lento que el corte por defecto de Node", () => {
  // Sin esto el gate no llega ni a preguntar: 250 ms no le alcanzan a api.telegram.org
  // desde nodo-casa. Se sube el piso; nunca se baja lo que ya estaba mas alto.
  const bajo = { valor: 250 };
  asegurarTransporteQueAguanta({
    getDefaultAutoSelectFamilyAttemptTimeout: () => bajo.valor,
    setDefaultAutoSelectFamilyAttemptTimeout: (v) => (bajo.valor = v),
  });
  assert.ok(bajo.valor >= 2000, `250 ms es el corte que causo el falso rojo, quedo en ${bajo.valor}`);

  const alto = { valor: 9000 };
  asegurarTransporteQueAguanta({
    getDefaultAutoSelectFamilyAttemptTimeout: () => alto.valor,
    setDefaultAutoSelectFamilyAttemptTimeout: (v) => (alto.valor = v),
  });
  assert.equal(alto.valor, 9000, "no se pisa un timeout mas generoso que el nuestro");
});

test("el log se lee ENTERO: un aviso mas viejo que las ultimas 50 lineas tiene que contarse", () => {
  // Medido el 2026-09-12 contra produccion: el log vivo tenia CINCO lineas `[aviso]` —tres
  // `sent` y dos `skipped`— y este gate imprimio `eventos: 0 avisos` con el veredicto
  // "circuito sano, sin eventos reales todavia". Los dos salteados son dos personas que
  // pidieron un humano y a Sergio Urcullo nunca le llego nada; `diagnosticar` YA se pone
  // rojo con un salteado (el test de arriba lo prueba), asi que el nucleo estaba sano.
  //
  // El agujero estaba en el LECTOR, que hasta hoy no probaba nadie: `webhook-server.sh
  // logs` hace `tail -n ${2:-50}` y `lineasDelLog` lo llamaba sin ese argumento. O sea que
  // el gate miraba las ultimas 50 lineas de un log de 2,7 MB y los avisos —que son raros
  // por definicion, 5 entre cientos de lineas por mensaje— caian siempre fuera. Una
  // ventana tapando un rojo medido, que es la forma mas cara de verde.
  //
  // Se corre el `webhook-server.sh` REAL con un `docker` falso en el PATH, no una copia del
  // `tail`: lo que se mide tiene que ser el contrato de produccion, y una copia mia del
  // comando se desincroniza sin que nada se ponga rojo.
  const tmp = mkdtempSync(join(tmpdir(), "avisos-log-"));
  const PATH_ORIGINAL = process.env.PATH;
  try {
    copyFileSync(join(DIR_BOT, "webhook-server.sh"), join(tmp, "webhook-server.sh"));
    writeFileSync(join(tmp, "webhook-server.mjs"), "// vacio: el script solo exige que exista\n");

    // El log con la forma del vivo: el aviso viejo, sepultado bajo lineas por mensaje.
    const log = join(tmp, "webhook.log");
    const lineas = ["[aviso] skipped conv=53 (handoff): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"];
    for (let i = 0; i < 200; i += 1) lineas.push(`[onia-webhook] conv=49 msg=${i} estado=200 rama=respondio`);
    writeFileSync(log, lineas.join("\n") + "\n");

    // `docker exec <contenedor> sh -c "<cmd>"` corrido aca, con el log del contenedor
    // apuntado al temporal. No toca produccion ni la red.
    const bin = join(tmp, "bin");
    mkdirSync(bin);
    const falso = [
      "#!/usr/bin/env bash",
      '[ "$1" = exec ] || exit 0',
      "shift 2",
      '[ "$1" = sh ] && shift',
      '[ "$1" = -c ] && shift',
      `cmd=$(printf '%s' "$1" | sed "s#/tmp/onia-bot-webhook.log#RUTA_DEL_LOG#g")`,
      'exec sh -c "$cmd"',
      "",
    ].join("\n").replace("RUTA_DEL_LOG", log);
    writeFileSync(join(bin, "docker"), falso, { mode: 0o755 });
    process.env.PATH = `${bin}:${PATH_ORIGINAL}`;

    const leidas = lineasDelLog(tmp);
    const ev = contarEventos(leidas);
    assert.equal(ev.salteados, 1, "el aviso salteado quedo fuera de la ventana del log: el gate no puede verlo");
    assert.equal(
      diagnosticar({ circuito: CIRCUITO_SANO, eventos: ev }).veredicto,
      "roto",
      "con un salteado en el log el veredicto es rojo; si sale ok, el lector se lo comio",
    );
  } finally {
    process.env.PATH = PATH_ORIGINAL;
    rmSync(tmp, { recursive: true, force: true });
  }
});
