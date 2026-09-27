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
  conversacionesDeAvisos,
  clasificarEventos,
  lecturaDeEventos,
  resolverBotDesplegado,
  motorProduceAviso,
  RAMAS_QUE_AVISAN,
  asegurarTransporteQueAguanta,
  lineasDelLog,
  inboxPorConversacion,
  conciliarAvisos,
  salteadosYaDesmentidos,
  ventanaDelAviso,
  ESTADOS_QUE_AVISAN,
  ESTADO_POR_RAMA,
  BOT_DIR,
  CONVERSACION_DEL_GATE,
  avisoEsAccionable,
} from "./avisos-vivo.mjs";

/** El bot de ESTE repo. Es el espejo del desplegado y no sale a la red: el gate sigue hermetico. */
const DIR_BOT = dirname(fileURLToPath(import.meta.url));

const CIRCUITO_SANO = {
  flagEncendido: true,
  credencialesOk: true,
  motorEmiteNotify: true,
  textoAccionable: true,
};

/**
 * Le preguntamos a la base y no hay ningun evento sin aviso. Los casos que afirman VERDE lo
 * pasan explicito a proposito: desde el 2026-09-26 `diagnosticar` no puede firmar `ok` sin
 * saber que ocurrio en la base, porque el log solo no distingue "nadie pidio" de "alguien
 * pidio y no se registro el aviso". Omitirlo aca daria `no_medido`, que es la respuesta
 * correcta para un gate que no pregunto.
 */
const BASE_SIN_PENDIENTES = { medido: true, sinAviso: [], fueraDeAlcance: [], conAviso: [] };

test("cero avisos con el circuito SANO no es lo mismo que cero con el circuito ROTO", () => {
  const sinEventos = diagnosticar({
    circuito: CIRCUITO_SANO,
    eventos: contarEventos([]),
    conciliacion: BASE_SIN_PENDIENTES,
  });
  const roto = diagnosticar({
    circuito: { ...CIRCUITO_SANO, flagEncendido: false },
    eventos: contarEventos([]),
    conciliacion: BASE_SIN_PENDIENTES,
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

// ---------------------------------------------------------------------------
// Vigencia del salteo — el log es append-only y NUNCA se rota (51.774 lineas el
// 2026-09-12). Contar todos los salteos de la historia deja este gate en rojo PARA
// SIEMPRE por dos lineas del 4-sep, y un rojo que no puede volver a verde deja de
// mirarse: el dia que el circuito se rompa de verdad, su rojo va a ser identico al
// rojo de siempre. La cura NO es dejar de contarlos —eso apaga al detector— es
// preguntar si la causa SIGUE VIVA.
// ---------------------------------------------------------------------------

test("un salteo por el flag apagado queda CURADO si el circuito volvio a mandar despues", () => {
  // Medido en produccion el 2026-09-12: los dos `skipped` estan en las lineas 50803 y
  // 50819 del log, y el primer `sent` en la 50851. O sea el flag se encendio DESPUES y
  // el circuito ya demostro que manda. Seguir rojo por eso es reportar un fallo viejo
  // como activo.
  const lineas = [
    "[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
  ];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas), conciliacion: BASE_SIN_PENDIENTES });
  assert.equal(d.eventos.salteados, 1, "el total historico se sigue informando");
  assert.equal(d.eventos.salteadosVigentes, 0);
  assert.equal(d.veredicto, "ok");
});

test("el ORDEN manda: un salteo POSTERIOR al ultimo envio sigue siendo rojo", () => {
  // La baranda anti-apagon del detector. Si el flag se apaga hoy, el salteo es posterior
  // al ultimo envio y nada lo desmiente: rojo hasta que el circuito vuelva a mandar.
  const lineas = [
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
    "[aviso] skipped conv=61 (handoff): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
  ];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.salteadosVigentes, 1);
  assert.equal(d.veredicto, "roto");
});

test("un salteo que NO es del flag global no lo cura un envio posterior", () => {
  // La curacion vale solo para una causa GLOBAL del circuito (el flag apagado apaga TODOS
  // los avisos, asi que un envio posterior prueba que ya no esta). Un salteo por cualquier
  // otro motivo es propio de ESE aviso: que otro haya salido despues no dice nada de el.
  const lineas = [
    "[aviso] skipped conv=61 (handoff): sin chat para esta conversacion",
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
  ];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.salteadosVigentes, 1);
  assert.equal(d.veredicto, "roto");
});

test("el motivo cita lo que dice el log, no inventa un pedido de humano", () => {
  // El 2026-09-12 este gate firmaba "alguien pidio un humano y nadie se entero" con sus
  // propios datos refutandolo: los dos salteados eran `cuota_agotada` y
  // `pregunta_precio_recepcion`, y el UNICO `pidio_humano_recepcion` del log salio bien.
  // Un instrumento que acusa con una causa falsa manda a arreglar lo que no esta roto.
  const lineas = ["[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.veredicto, "roto");
  const texto = d.motivos.join(" | ");
  assert.match(texto, /cuota_agotada/, "el motivo real del log tiene que aparecer");
  assert.doesNotMatch(texto, /pidio un humano/);
});

test("avisos enviados con el circuito sano es verde, y cuenta los eventos", () => {
  const lineas = [
    "[aviso] sent conv=57 (handoff): ok",
    "[aviso] sent conv=58 (demo_agendada): ok",
  ];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas), conciliacion: BASE_SIN_PENDIENTES });
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

// ---------------------------------------------------------------------------
// La linea `[aviso]` YA se fecha, y este parseo lo sobrevivio
// ---------------------------------------------------------------------------
//
// POR QUE EXISTE. Se escribio el 2026-09-26, cuando `webhook-server.mjs` todavia escribia estas
// lineas con un `process.stdout.write` pelado mientras su hermana `[onia-webhook]` se fechaba a
// si misma. Eso dejaba al objetivo de este carril —"una linea de aviso por cada demo_agendada /
// handoff_humano"— sin poder contarse por dia: `10 [aviso] sent conv=49` se lee como un evento
// disparando diez avisos, y son diez corridas de la sonda. La hora llego el 2026-09-27
// (`lineaDeAviso`), asi que estos casos pasaron de preparar un cambio futuro a ser la guarda de
// un formato vivo: el emisor los tiene del otro lado en `webhook-server.test.mjs`
// ("AVISO FECHADO"), y se quedan los dos porque el modo de falla es que UNO de los dos cambie.
//
// El arreglo natural es estampar la hora igual que la hermana: tag, hora, estado. Y ahi
// estaba la trampa, que es la razon de este test: los SEIS anclajes que leen estas lineas
// exigian `[aviso]` seguido INMEDIATAMENTE de la palabra de estado, asi que con la hora en
// el medio el `\w+` captura `2026` — el `estado` pasa a ser "2026", el `conv=` propio deja
// de matchear y cae al vecino, el motivo queda "sin motivo en el log" y los contadores se
// van a CERO. Sin un solo error, y en el unico lugar donde este carril cuenta si el aviso
// le llego a Sergio Urcullo.
//
// La cola daba esto por CINCO anclajes (`:136`, `:158`, `:163`, `:203`, `:210`) y son SEIS:
// `conEstado` (`:152`) es el que alimenta enviados/salteados/fallidos, o sea el numero que
// se publica. Contarlos de menos era publicar un arreglo a medias.
//
// Aceptar los DOS formatos —y no cambiar de uno a otro— es lo que desacopla el arreglo: hoy
// `webhook-server.mjs` esta congelado detras de un pedido de deploy de 13 archivos que no lo
// incluye, y este archivo SI es uno de los 13. Con el parseo tolerante, el dia que la hora
// llegue no hay "los dos archivos o ninguno" ni un parser roto en el medio.

const FECHADO = "2026-09-26T19:15:18.021Z";

test("un `[aviso]` FECHADO se lee igual que uno pelado: los seis anclajes toleran la hora", () => {
  const pelado = "[aviso] sent conv=49 (demo_agendada): aviso enviado";
  const fechado = `[aviso] ${FECHADO} sent conv=49 (demo_agendada): aviso enviado`;

  // Los contadores (anclajes `conEstado` :152 y `sent` :158) no pueden depender del formato.
  assert.equal(contarEventos([fechado]).total, 1);
  assert.equal(contarEventos([fechado]).enviados, contarEventos([pelado]).enviados);
  assert.equal(contarEventos([fechado]).enviados, 1);

  // El sujeto y su motivo (anclajes `conv=` :203, `estado` :210, `motivoDelAviso` :136).
  const [conFecha] = conversacionesDeAvisos([fechado]);
  const [sinFecha] = conversacionesDeAvisos([pelado]);
  assert.equal(conFecha.estado, "sent");
  assert.equal(conFecha.conv, 49);
  assert.equal(conFecha.motivo, "demo_agendada");
  assert.deepEqual(conFecha, sinFecha);
});

test("el `conv` de un aviso FECHADO sale de la linea propia, no del vecino de arriba", () => {
  // La direccion cara del bug: con el anclaje roto el `conv=` propio no matchea y cae al
  // webhook anterior, que es OTRA conversacion. Un aviso atribuido a quien no es manda a
  // buscar a la persona equivocada — es el caso que `conversacionesDeAvisos` existe para
  // evitar, y la hora en el medio lo reintroducia.
  const lineas = [
    "[onia-webhook] 2026-09-26T19:15:17.900Z conv=11 msg=497 estado=200 rama=respondio",
    `[aviso] ${FECHADO} sent conv=49 (demo_agendada): aviso enviado`,
  ];
  assert.equal(conversacionesDeAvisos(lineas)[0].conv, 49);
});

test("un salteo FECHADO por la causa global lo sigue curando un envio posterior", () => {
  // El anclaje `skipped` (:163) es el que decide si un salteo esta VIGENTE. Roto por la
  // hora, ningun salteo se reconoce: `salteadosVigentes` cae a 0 y el gate firma verde
  // sobre una persona que nadie atendio.
  const lineas = [
    `[aviso] ${FECHADO} skipped (handoff): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)`,
    `[aviso] 2026-09-26T19:20:00.000Z sent conv=49 (demo_agendada): aviso enviado`,
  ];
  const eventos = contarEventos(lineas);
  assert.equal(eventos.salteados, 1);
  assert.equal(eventos.enviados, 1);
  assert.equal(eventos.salteadosVigentes, 0);
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

// Los dos tests del LECTOR inyectan un `docker` falso — un script bash sin extension, metido
// por PATH con `:` — y eso es inejecutable en win32 por construccion (spawn de Windows no corre
// shebangs, y un `.cmd` intermedio mediria MI copia del comando, que es justo lo que el propio
// test prohibe). El sujeto (docker + grep sobre el log vivo) solo existe en el VPS/WSL: alla
// corren SIEMPRE. El skip es explicito y sale contado en el resumen, no es un gate apagado.
const SOLO_POSIX =
  process.platform === "win32" ? "shim bash por PATH: inejecutable en win32; corre en VPS/WSL" : false;

test("el log se lee ENTERO: un aviso mas viejo que las ultimas 50 lineas tiene que contarse", { skip: SOLO_POSIX }, () => {
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

// ---------------------------------------------------------------------------
// De QUIEN es cada aviso. Nace del 2026-09-12, midiendo el objetivo del carril
// contra el log vivo: los CINCO eventos que este gate contaba eran conv 53, 55 y 57
// —inbox 7, `ZZ QA Clinica Chatbot`, el banco de pruebas, contactos `wandering-water-74`,
// `dry-cherry-292` y `zz-qa-deploy-2026-09-04-1438`— y conv 11, inbox 5, contacto
// `Sergio` (+59171654992), o sea Sergio Urcullo probando su propio bot. CERO desconocidos.
//
// Y el gate firmaba `VEREDICTO: ok · avisos enviados 3 — circuito sano y avisando`.
// Esa frase es cierta sobre el circuito y FALSA sobre lo que el carril tiene que saber:
// su definicion de hecho es "que un DESCONOCIDO escriba y esa conversacion se vea".
// Un instrumento que vigila si un lead real queda sin atender y nunca vio uno tiene que
// DECIRLO, no firmar verde — es la misma familia que el 0 que no distinguia "roto" de
// "sin eventos", que es justo por lo que este archivo existe.
//
// No se pone rojo por no haber leads: no hay trafico, y un rojo que nadie puede curar
// se deja de mirar. Se pone HONESTO.

test("conversacionesDeAvisos atribuye el aviso sin conv= a la linea que lo produjo", () => {
  // Asi salieron las dos del 4-sep: el `[aviso]` no traia `conv=` (lo trae desde que se
  // arreglo el formato), pero el log esta EN ORDEN y la linea de arriba es la suya.
  const lineas = [
    '[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 msg=423 estado=200 rama=respondio etapa=nuevo->handoff_humano enviados=1/1 entrada="hola, quiero una limpieza dental"',
    "[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
  ];
  const ev = conversacionesDeAvisos(lineas);
  assert.equal(ev.length, 1);
  assert.equal(ev[0].conv, 53, "sin este numero no se puede ir a buscar a la persona: era todo el problema del item");
  assert.equal(ev[0].estado, "skipped");
});

test("conversacionesDeAvisos prefiere el conv= de la propia linea, no el de la anterior", () => {
  const lineas = [
    "[onia-webhook] 2026-09-10T20:12:09.990Z conv=99 msg=881 estado=200 rama=ignorado",
    "[aviso] sent conv=11 (demo_agendada): aviso enviado",
  ];
  assert.equal(conversacionesDeAvisos(lineas)[0].conv, 11, "la linea propia manda sobre la vecina");
});

test("conversacionesDeAvisos deja conv en null cuando no hay de donde sacarlo, nunca inventa", () => {
  const ev = conversacionesDeAvisos(["[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"]);
  assert.equal(ev[0].conv, null, "atribuir un aviso a la conversacion equivocada es peor que no atribuirlo");
});

test("clasificarEventos separa lo nuestro de los leads, y no adivina el que no puede ubicar", () => {
  const eventos = [{ conv: 53 }, { conv: 48 }, { conv: 777 }];
  // inbox 7 es `ZZ QA Clinica Chatbot`; 4 es `Onia Web`, por donde entran los leads del widget.
  const c = clasificarEventos(
    eventos,
    new Map([
      [53, { inbox: 7, contacto: null, telefono: null }],
      [48, { inbox: 4, contacto: "cold-pond-731", telefono: null }],
    ]),
  );
  assert.deepEqual(c.nuestros, [53]);
  assert.deepEqual(c.reales, [48]);
  assert.deepEqual(c.sinUbicar, [777], "un conv que la base no conoce no es un lead: es no medido");
});

test("clasificarEventos sin mapa no puede afirmar que haya leads reales", () => {
  const c = clasificarEventos([{ conv: 53 }, { conv: 11 }], null);
  assert.deepEqual(c.reales, [], "sin poder preguntarle a la base, 'es un lead real' es una suposicion");
  assert.equal(c.medido, false, "tri-estado: no medido no es cero");
});

test("la lectura del veredicto no dice 'avisando' cuando todos los avisos son del banco de pruebas", () => {
  const eventos = contarEventos([
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
    "[aviso] sent conv=11 (demo_agendada): aviso enviado",
  ]);
  const soloPruebas = lecturaDeEventos({
    veredicto: "ok",
    eventos,
    circuitoSano: true,
    origen: { medido: true, nuestros: [57, 11], reales: [], sinUbicar: [] },
  });
  // El assert es sobre la NEGACION, no sobre el rotulo: lo que no puede pasar es que la linea
  // afirme que el circuito esta avisando cuando ningun aviso vino de afuera.
  assert.match(
    soloPruebas,
    /ningun (aviso es de un lead|lead)|sin leads|nunca se probo/i,
    "con 2 envios y 0 leads reales, 'circuito sano y avisando' esconde que nunca se probo con un desconocido",
  );

  const conLeadReal = lecturaDeEventos({
    veredicto: "ok",
    eventos,
    circuitoSano: true,
    origen: { medido: true, nuestros: [57], reales: [11], sinUbicar: [] },
  });
  assert.match(conLeadReal, /avisando/, "con un lead real de verdad, el gate si puede decir que esta avisando");
});

test("clasificarEventos cuenta CONVERSACIONES, no eventos: dos avisos de la misma no son dos leads", () => {
  // Medido el 2026-09-12: la primera version imprimio `leads 2 (conv 11, 11)` — un solo
  // interesado, que ademas era Sergio Urcullo probando su bot, contado dos veces.
  const c = clasificarEventos(
    [{ conv: 48 }, { conv: 48 }, { conv: 53 }, { conv: 53 }],
    new Map([
      [48, { inbox: 4, contacto: "cold-pond-731", telefono: null }],
      [53, { inbox: 7, contacto: null, telefono: null }],
    ]),
  );
  assert.deepEqual(c.reales, [48]);
  assert.deepEqual(c.nuestros, [53]);
});

test("un mapa sin contacto ya no alcanza para llamar lead a nadie fuera del banco de pruebas", () => {
  // La forma vieja del mapa (`conv -> inbox` pelado) es la que hacia que el criterio fuera el
  // numero de inbox. Se sigue aceptando, pero un dato incompleto no puede AFIRMAR que hay un
  // lead: sin contacto no hay con que descartar que seamos nosotros. Fixture a proposito con
  // la conv 11, que es el caso que estuvo mal clasificado en produccion.
  const c = clasificarEventos([{ conv: 11 }], new Map([[11, 5]]));
  assert.deepEqual(c.reales, [], "sin el contacto, 'es un lead' vuelve a ser la suposicion optimista");
  assert.deepEqual(c.sinUbicar, [11], "no medido no es cero, y tampoco es un lead");
});

test("clasificarEventos entiende el mapa con contacto y lo conserva para que se pueda leer de quien es", () => {
  // El inbox dice si es del banco de pruebas; el NOMBRE dice si es un desconocido. Conv 11
  // es `Sergio` (+59171654992) y sin el nombre la linea dice "1 lead" sobre el propio dueño.
  const c = clasificarEventos([{ conv: 11 }], new Map([[11, { inbox: 5, contacto: "Sergio", telefono: "+59171654992" }]]));
  assert.equal(c.contactos.get(11), "Sergio", "el nombre viaja: es lo unico que distingue un lead de una prueba propia");
});

// ───────────────────────────────────────────────────────────────────────────────────────
// "¿SOMOS NOSOTROS?" SE PREGUNTA UNA SOLA VEZ, Y NO ES UN NUMERO DE INBOX
//
// Medido en produccion el 2026-09-13, con este gate en verde:
//
//   de quien: leads 1 (conv 11 · Sergio) · banco de pruebas 3
//   VEREDICTO: ok · avisos enviados 3 — circuito sano y avisando
//
// La conv 11 es `Sergio` / `+59171654992`: el DUEÑO probando su propio bot. O sea que el
// unico "lead" que sostenia el "y avisando" no existe, y la linea que corresponde es la que
// este mismo archivo ya sabe escribir — *"NINGUN aviso es de un lead ... nunca se probo con
// un desconocido"*. Es el falso verde que `clasificarEventos` nacio para no dar (ver la
// cabecera del modulo), cerrado sobre la INSTANCIA (inbox 7) y abierto sobre la CLASE.
//
// La clase tiene dos mitades y las dos estaban abiertas:
//   1. `inbox === 7` es una lista de inclusion de UN elemento. Produccion tiene CUATRO
//      inboxes: el 3 es `ONIA Demo` (Channel::Api) y sus 8 conversaciones son todas
//      nuestras (`Prospecto Prueba ONIA`, `Prueba Audio Prod`, `Prueba Final`...). Un aviso
//      de ahi se cuenta como lead real y nada se pone rojo.
//   2. El dueño escribiendo desde su celular no esta en NINGUN inbox de pruebas, y el
//      objetivo del carril lo excluye con todas las letras: *"una persona que no somos
//      nosotros — ni una org QA, ni el probador, ni Sergio desde su celular"*.
//
// Y la respuesta ya estaba escrita en el repo: `esNuestra()` de `scripts/objetivo_visible.mjs`
// cruza telefono propio Y nombre de prueba, con la conv 11 citada en su comentario como
// caso medido. Este modulo tenia su propia version pobre del mismo juicio — el par clasico
// que diverge y se arregla de un solo lado. Se importa, no se copia.
test("el dueño probando su propio bot NO es un lead, aunque escriba por el inbox de leads", () => {
  // Conv 11 del inbox 5 (`Onia WhatsApp`, por donde entran los leads de verdad).
  const c = clasificarEventos([{ conv: 11 }], new Map([[11, { inbox: 5, contacto: "Sergio", telefono: "+59171654992" }]]));
  assert.deepEqual(c.reales, [], "el telefono es NUESTRO: contarlo como lead es el falso verde que este gate existe para no dar");
  assert.deepEqual(c.nuestros, [11]);
});

test("un inbox de pruebas que no es el 7 tampoco produce leads: el criterio no es el numero de inbox", () => {
  // Inbox 3 = `ONIA Demo` (Channel::Api), vivo en produccion con 8 conversaciones nuestras.
  // Si el sujeto fuera el inbox, este caso pasa como lead y el gate firma verde.
  const c = clasificarEventos([{ conv: 4 }], new Map([[4, { inbox: 3, contacto: "Prueba En Vivo", telefono: null }]]));
  assert.deepEqual(c.reales, [], "una lista de inclusion de inboxes falla abierto en el inbox nuevo");
  assert.deepEqual(c.nuestros, [4]);
});

test("un desconocido de verdad SI es un lead: el arreglo no puede fallar cerrado", () => {
  // La direccion contraria. `cold-pond-731` es un visitante real del widget (conv 48,
  // 2-sep): si el gate lo contara como nuestro, apagaria el unico dato que el carril busca.
  const c = clasificarEventos(
    [{ conv: 48 }, { conv: 53 }],
    new Map([
      [48, { inbox: 4, contacto: "cold-pond-731", telefono: null }],
      [53, { inbox: 7, contacto: null, telefono: null }],
    ]),
  );
  assert.deepEqual(c.reales, [48], "un desconocido en un inbox de leads, sin marca nuestra, es exactamente lo que el carril persigue");
  assert.deepEqual(c.nuestros, [53], "el inbox del banco de pruebas sigue alcanzando cuando el contacto no tiene nombre");
});

test("el juicio '¿somos nosotros?' se importa de una sola fuente, no se reimplementa aca", () => {
  // Anti-duplicacion. Dos detectores del MISMO hecho divergen y se arreglan de un solo lado:
  // eso es lo que dejo a `avisos-vivo` clasificando por inbox mientras `objetivo_visible` ya
  // cruzaba telefono y nombre. Si alguien vuelve a escribir el criterio aca, esto se pone rojo.
  const fuente = readFileSync(join(DIR_BOT, "avisos-vivo.mjs"), "utf8");
  assert.match(fuente, /import\s*\{[^}]*\besNuestra\b[^}]*\}\s*from\s*["'][^"']*objetivo_visible\.mjs["']/,
    "el criterio vive en scripts/objetivo_visible.mjs — aca se importa");
  const sinComentarios = fuente.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  assert.doesNotMatch(sinComentarios, /NUESTROS_TELEFONOS\s*=|NOMBRE_DE_PRUEBA\s*=/,
    "una copia local de la lista es la forma en que este par vuelve a divergir");
});

test("la consulta a la base trae lo que el criterio necesita para descartarnos", { skip: SOLO_POSIX }, () => {
  // El gate del CABLEADO, hermano del de `lineasDelLog` que esta abajo. `clasificarEventos`
  // sabe que el telefono delata al dueño, pero si el SQL no lo pide el dato llega `null`, el
  // criterio no tiene con que descartarnos y la conv 11 vuelve a contar como lead — con la
  // suite ENTERA en verde. Medido por mutacion el 2026-09-13: sacarle `ct.phone_number` a la
  // consulta dejaba los 38 tests pasando. El nucleo puro y su lector se prueban juntos.
  //
  // El `docker` falso se comporta como psql y por eso el caso no es tautologico: devuelve las
  // columnas QUE EL SQL PIDE. Un SQL sin telefono produce aca la misma fila corta que
  // produciria la base de verdad.
  const tmp = mkdtempSync(join(tmpdir(), "avisos-inbox-"));
  const PATH_ORIGINAL = process.env.PATH;
  try {
    const bin = join(tmp, "bin");
    mkdirSync(bin);
    // Datos REALES de produccion: conv 11 del inbox 5 es `Sergio` / `+59171654992`.
    const falso = [
      "#!/usr/bin/env bash",
      '[ "$1" = ps ] && { echo onia-chatbot_chatwoot-db.1.abc; exit 0; }',
      '[ "$1" = exec ] || exit 0',
      'sql="${@: -1}"',
      'case "$sql" in',
      '  *phone_number*) echo "11|5|Sergio|+59171654992" ;;',
      '  *) echo "11|5|Sergio" ;;',
      "esac",
      "",
    ].join("\n");
    writeFileSync(join(bin, "docker"), falso, { mode: 0o755 });
    process.env.PATH = `${bin}:${PATH_ORIGINAL}`;

    const mapa = inboxPorConversacion([11]);
    assert.ok(mapa instanceof Map, "sin mapa no hay nada que clasificar");
    const c = clasificarEventos([{ conv: 11 }], mapa);
    assert.deepEqual(c.reales, [], "el dueño llego a `reales`: la consulta no trajo con que descartarlo");
    assert.deepEqual(c.nuestros, [11]);
  } finally {
    process.env.PATH = PATH_ORIGINAL;
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("lineasDelLog trae la linea que produjo cada aviso, o el conv no se puede recuperar", { skip: SOLO_POSIX }, () => {
  // El gate del CABLEADO. `conversacionesDeAvisos` sabe leer el `conv` de la linea vecina,
  // pero si el lector filtra solo `[aviso]` esa linea nunca llega y la atribucion vuelve a
  // ser imposible EN VERDE: medido el 2026-09-12, sacarle el `-B 1` al grep dejaba los 32
  // tests pasando. El nucleo puro y su lector se prueban juntos o el cableado no existe.
  const tmp = mkdtempSync(join(tmpdir(), "avisos-origen-"));
  const PATH_ORIGINAL = process.env.PATH;
  try {
    copyFileSync(join(DIR_BOT, "webhook-server.sh"), join(tmp, "webhook-server.sh"));
    writeFileSync(join(tmp, "webhook-server.mjs"), "// vacio: el script solo exige que exista\n");

    const log = join(tmp, "webhook.log");
    writeFileSync(
      log,
      [
        "[onia-webhook] 2026-09-04T03:41:44.000Z conv=53 msg=422 estado=200 rama=ignorado",
        '[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 msg=423 estado=200 rama=respondio etapa=nuevo->handoff_humano entrada="hola, quiero una limpieza dental"',
        // Sin `conv=`: asi salieron los dos del 4-sep, que es el caso que hay que recuperar.
        "[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
      ].join("\n") + "\n",
    );

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

    const eventos = conversacionesDeAvisos(lineasDelLog(tmp));
    assert.equal(eventos.length, 1, "el lector se comio el aviso");
    assert.equal(eventos[0].conv, 53, "el lector no trajo la linea vecina: el aviso queda sin dueño");
  } finally {
    process.env.PATH = PATH_ORIGINAL;
    rmSync(tmp, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// La conciliacion con la base: la clase de fallo en la que este gate era ciego.
//
// Todo lo de arriba deriva el universo de eventos del LOG. Un handoff que ocurrio y no
// llego a la linea de aviso no se veia como fallo: se veia como que no hubo evento, y la
// cabecera de este archivo firmaba `circuito=ok eventos=0 -> nadie pidio un humano hoy`.
// Medido contra produccion el 2026-09-26: DOCE filas `handoff_humano` en la base, avisos de
// TRES conversaciones en el log, veredicto `ok · circuito sano`.
// ---------------------------------------------------------------------------

const VENTANA = { desde: "2026-08-28T22:22:51", hasta: "2026-09-26T10:53:21" };

test("un handoff que la base registra y el log no nombra pone el gate ROJO", () => {
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 45, estado: "handoff_humano", desde: "2026-09-01T10:00:00" }],
    convsConAviso: [],
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 1, "el conciliador no vio el evento sin aviso");

  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion });
  assert.equal(d.veredicto, "roto", "circuito sano + un pedido de humano sin aviso NO puede ser verde");
  assert.match(d.motivos.join(" "), /conv 45/, "el rojo tiene que NOMBRAR a quien se perdio");
});

test("la lectura no puede decir 'sin eventos reales todavia' cuando la base dice que si hubo", () => {
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 45, estado: "handoff_humano", desde: "2026-09-01T10:00:00" }],
    convsConAviso: [],
    ventana: VENTANA,
  });
  const lectura = lecturaDeEventos({
    veredicto: "roto",
    eventos: contarEventos([]),
    circuitoSano: true,
    conciliacion,
  });
  assert.doesNotMatch(lectura, /sin eventos reales/, "la frase que tapaba el agujero sigue viva");
  assert.match(lectura, /1 pedido/, "la lectura tiene que decir cuantos se perdieron");
});

test("un evento ANTERIOR al log no acusa al circuito: es fuera de alcance, no un rojo", () => {
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 11, estado: "handoff_humano", desde: "2026-08-06T09:00:00" }],
    convsConAviso: [],
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 0, "falso rojo: el log no pudo haber visto ese evento");
  assert.equal(conciliacion.fueraDeAlcance.length, 1, "y tampoco se descarta en silencio: se cuenta");

  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion });
  assert.equal(d.veredicto, "ok");
});

test("sin base la respuesta es no_medido, nunca verde", () => {
  const conciliacion = conciliarAvisos({ eventosEnLaBase: null, convsConAviso: [], ventana: VENTANA });
  assert.equal(conciliacion.medido, false, "no poder preguntar no es haber preguntado");

  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion });
  assert.equal(d.veredicto, "no_medido", "un gate que no vio la base no puede firmar al dia");
});

test("sin ventana tampoco hay verde: sin saber que alcanza el log no se concilia nada", () => {
  const conciliacion = conciliarAvisos({ eventosEnLaBase: [], convsConAviso: [], ventana: null });
  assert.equal(conciliacion.medido, false);
  assert.equal(diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion }).veredicto, "no_medido");
});

test("un aviso SALTEADO no cubre a su conversacion: nombrarla no es avisarle", () => {
  // El log nombra la conv 51, pero el aviso no salio. Usar esa linea como cobertura seria
  // tapar el fallo con la evidencia del fallo.
  const deQuien = conversacionesDeAvisos(["[aviso] skipped conv=51 (pidio_hablar_con_humano): aviso por Telegram apagado"]);
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 51, estado: "handoff_humano", desde: "2026-09-03T10:00:00" }],
    convsConAviso: deQuien.filter((e) => e.estado === "sent").map((e) => e.conv),
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 1, "un skipped se contó como si la persona hubiera sido avisada");
});

test("un handoff avisado no es un rojo", () => {
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 57, estado: "handoff_humano", desde: "2026-09-04T10:00:00" }],
    convsConAviso: [57],
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 0);
  assert.equal(conciliacion.conAviso.length, 1);
  assert.equal(diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion }).veredicto, "ok");
});

test("cada rama que avisa tiene su estado en la base: si no, el conciliador busca lo que nadie escribe", () => {
  // Agregar una rama a RAMAS_QUE_AVISAN sin su traduccion no sale rojo: sale VACIO, que es
  // el modo de falla caro. Se ata por propiedad, no por lista escrita a mano.
  for (const rama of RAMAS_QUE_AVISAN) {
    assert.ok(ESTADO_POR_RAMA[rama], `la rama ${rama} avisa y no tiene estado en la base`);
  }
  assert.equal(ESTADOS_QUE_AVISAN.length, RAMAS_QUE_AVISAN.length);
  assert.ok(ESTADOS_QUE_AVISAN.every(Boolean), "una rama sin traducir deja al conciliador sin sujetos");
});

// ---------------------------------------------------------------------------
// EL BORDE IZQUIERDO DE LA VENTANA. Nace del 2026-09-26, midiendo el rojo de este
// propio gate contra produccion.
//
// El bloque de arriba fue conservador con el borde izquierdo y eligio la referencia
// EQUIVOCADA: la ventana del LOG. La pregunta que el conciliador contesta es "¿el circuito
// perdio este evento?", y para poder perderlo el codigo que escribe la linea `[aviso]` tiene
// que haber estado corriendo. Los dos numeros medidos:
//
//   ventana del log         desde 2026-08-28T22:22:51  (primera marca del propio log)
//   primera linea [aviso]         2026-09-04T03:41:45  (linea 50803 del log vivo)
//
// Seis dias y ~250 lineas de diferencia, y DIEZ de los eventos que el gate acusaba vivian
// en esa brecha: son handoffs anteriores al aviso mismo, estructuralmente inavisables. El
// veredicto decia `roto — 10 pedidos que NINGUN aviso nombra, ya se perdieron, hay que ir a
// buscar a esas personas`. Un rojo permanente que nadie puede curar se lee como el ambiental
// de siempre — y el dia que el circuito se rompa DE VERDAD, el veredicto sera idéntico al de
// hoy. Un rojo por el motivo equivocado es un verde futuro.
// ---------------------------------------------------------------------------

/** La ventana del log vivo el 2026-09-26, y la primera evidencia de que el aviso emitia. */
const LOG_VIVO = { desde: "2026-08-28T22:22:51", hasta: "2026-09-26T10:53:21" };
const PRIMER_AVISO = "2026-09-04T03:41:45";

test("la ventana del aviso arranca cuando el AVISO empezo a emitir, no donde arranca el log", () => {
  const v = ventanaDelAviso({ ventana: LOG_VIVO, primerAviso: PRIMER_AVISO });
  assert.equal(v.desde, PRIMER_AVISO, "el borde sigue siendo el del log: acusa por lo que el aviso no pudo hacer");
  assert.equal(v.hasta, LOG_VIVO.hasta, "el borde derecho no se toca: lo manda el log");
  assert.equal(v.borde, "primer_aviso", "el reporte tiene que poder decir CUAL borde uso");
});

test("el borde nunca se ADELANTA: con el log arrancando despues del primer aviso, manda el log", () => {
  // El dia que alguien rote el log, la ventana se achica sola. Tomar el primer aviso ahi
  // seria ensanchar el alcance hacia atras sobre lineas que ya no existen.
  const v = ventanaDelAviso({ ventana: { desde: "2026-09-10T00:00:00", hasta: "2026-09-26T00:00:00" }, primerAviso: PRIMER_AVISO });
  assert.equal(v.desde, "2026-09-10T00:00:00");
  assert.equal(v.borde, "log");
});

test("un handoff de ANTES de que el aviso emitiera no acusa al circuito, aunque el log lo cubra", () => {
  // conv 46: `created_at` 2026-09-01T02:03:01, DENTRO de la ventana del log y SEIS DIAS antes
  // de que existiera una linea `[aviso]`. Este es el caso que ponia el gate rojo para siempre.
  const evento = { conv: 46, estado: "handoff_humano", desde: "2026-09-01T02:03:01" };
  const ventana = ventanaDelAviso({ ventana: LOG_VIVO, primerAviso: PRIMER_AVISO });
  const conciliacion = conciliarAvisos({ eventosEnLaBase: [evento], convsConAviso: [], ventana });

  assert.equal(conciliacion.sinAviso.length, 0, "falso rojo: el aviso no existia cuando ese handoff paso");
  assert.equal(conciliacion.fueraDeAlcance.length, 1, "y no se descarta en silencio: se cuenta y se nombra");
  assert.equal(diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion }).veredicto, "ok");

  // El hermano, que es la mitad que no puede fallar: DESPUES del primer aviso sigue rojo.
  const despues = conciliarAvisos({
    eventosEnLaBase: [{ conv: 55, estado: "handoff_humano", desde: "2026-09-04T06:37:54" }],
    convsConAviso: [],
    ventana,
  });
  assert.equal(despues.sinAviso.length, 1, "el arreglo del borde no puede apagar el rojo que SI corresponde");
  assert.equal(diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion: despues }).veredicto, "roto");
});

test("un log SIN una sola linea de aviso no habilita el verde: no hay evidencia de que la capacidad viviera", () => {
  const v = ventanaDelAviso({ ventana: LOG_VIVO, primerAviso: null });
  assert.equal(v.desde, null, "sin una sola linea [aviso] no hay borde del que colgar la acusacion");
  assert.equal(v.borde, "sin_evidencia");

  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 46, estado: "handoff_humano", desde: "2026-09-01T02:03:01" }],
    convsConAviso: [],
    ventana: v,
  });
  assert.equal(conciliacion.medido, false, "no poder distinguir 'no habia codigo' de 'se perdio' no es cero");
  assert.equal(
    diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion }).veredicto,
    "no_medido",
    "ni verde ni un rojo inventado: la ignorancia se reporta como ignorancia",
  );
});

test("sin ventana del log, el borde tampoco se inventa", () => {
  assert.equal(ventanaDelAviso({ ventana: null, primerAviso: PRIMER_AVISO }), null);
  assert.equal(ventanaDelAviso({ ventana: { desde: "2026-09-01T00:00:00" }, primerAviso: PRIMER_AVISO }), null);
});

// ---------------------------------------------------------------------------
// DE QUIEN son los perdidos. La otra mitad del mismo rojo inflado, medida el mismo dia.
//
// El veredicto cerraba con "ya se perdieron, hay que ir a buscar a esas personas" sobre los
// diez sujetos. Consultados en la base de Chatwoot: los DIEZ son nuestros — inbox 7 (el banco
// de pruebas) o contacto `Sonda QA` / `Cliente Prueba` en el inbox 4. El gate mandaba a
// perseguir a sus propias sondas. `clasificarEventos` ya sabia hacer esta distincion; la
// conciliacion no la usaba porque sus sujetos salen de la base y nunca pasaron por el log.
// ---------------------------------------------------------------------------

test("el rojo no manda a buscar a nadie cuando los perdidos son del banco de pruebas", () => {
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [
      { conv: 53, estado: "handoff_humano", desde: "2026-09-04T03:41:45" },
      { conv: 55, estado: "handoff_humano", desde: "2026-09-04T06:37:54" },
    ],
    convsConAviso: [],
    ventana: ventanaDelAviso({ ventana: LOG_VIVO, primerAviso: PRIMER_AVISO }),
  });
  assert.equal(conciliacion.sinAviso.length, 2, "los dos eventos del 4-sep si caen dentro del alcance");

  // Los inboxes REALES de esas dos conversaciones, medidos el 2026-09-26 en la base de Chatwoot.
  const origenPerdidos = clasificarEventos(conciliacion.sinAviso, new Map([
    [53, { inbox: 7, contacto: "wandering-water-74", telefono: "" }],
    [55, { inbox: 7, contacto: "dry-cherry-292", telefono: "" }],
  ]));
  assert.equal(origenPerdidos.reales.length, 0, "el banco de pruebas no es un lead");

  const lectura = lecturaDeEventos({
    veredicto: "roto", eventos: contarEventos([]), circuitoSano: true, conciliacion, origenPerdidos,
  });
  // El literal se busca SIN su negacion: el mensaje correcto termina en "no hay a quien ir a
  // buscar", y un /ir a buscar/ pelado lo lee como la orden contraria.
  assert.doesNotMatch(lectura, /hay que ir a buscar/, "manda a perseguir a nuestras propias sondas");
  assert.match(lectura, /banco de pruebas/, "y tiene que DECIR por que no hay a quien buscar");

  // Perder un evento sigue siendo perder un evento: esto no puede volverse verde.
  assert.equal(diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]), conciliacion }).veredicto, "roto");
});

test("con un lead de verdad entre los perdidos, la lectura SIGUE mandando a buscarlo", () => {
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 70, estado: "handoff_humano", desde: "2026-09-20T15:00:00" }],
    convsConAviso: [],
    ventana: ventanaDelAviso({ ventana: LOG_VIVO, primerAviso: PRIMER_AVISO }),
  });
  const origenPerdidos = clasificarEventos(conciliacion.sinAviso, new Map([
    [70, { inbox: 5, contacto: "Marcela Rojas", telefono: "+59177712345" }],
  ]));
  assert.equal(origenPerdidos.reales.length, 1, "un desconocido por el inbox de leads ES un lead");

  const lectura = lecturaDeEventos({
    veredicto: "roto", eventos: contarEventos([]), circuitoSano: true, conciliacion, origenPerdidos,
  });
  assert.match(lectura, /hay que ir a buscar/, "el arreglo no puede fallar cerrado: a un lead perdido hay que ir a buscarlo");
  assert.match(lectura, /conv 70/, "y tiene que nombrarlo");
});

test("sin poder ubicar a los perdidos, la lectura no afirma que no haya nadie a quien buscar", () => {
  // Tri-estado: `clasificarEventos` sin mapa devuelve `medido:false`. Leerlo como "0 leads"
  // seria firmar "no hay a quien buscar" sobre una pregunta que no se hizo.
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 70, estado: "handoff_humano", desde: "2026-09-20T15:00:00" }],
    convsConAviso: [],
    ventana: ventanaDelAviso({ ventana: LOG_VIVO, primerAviso: PRIMER_AVISO }),
  });
  const lectura = lecturaDeEventos({
    veredicto: "roto", eventos: contarEventos([]), circuitoSano: true, conciliacion,
    origenPerdidos: clasificarEventos(conciliacion.sinAviso, null),
  });
  assert.doesNotMatch(lectura, /banco de pruebas/, "no se pudo preguntar de quien son: no se puede absolver");
  assert.match(lectura, /hay que ir a buscar/, "en la duda, se va a buscar");
});

// ---------------------------------------------------------------------------
// Las dos mitades de este archivo juzgaban los MISMOS eventos al reves
//
// Medido en produccion el 2026-09-26: conv 53 y 55 (4-sep) salian a la vez
// "salteados 2 (2 ya desmentido(s) por un envio posterior)" por `contarEventos`
// —o sea absueltos, la causa esta muerta— y "SIN un aviso que los nombre ... el
// circuito perdio eventos" por `conciliarAvisos`. La mitad que acusa gana el
// veredicto, asi que el gate quedaba en un rojo que NADIE puede curar: el flag ya
// esta encendido y esas dos lineas del 4-sep no se van del log append-only.
// Un rojo permanente se lee como el ambiental de siempre, y el dia que el circuito
// se rompa de verdad el veredicto sera identico al de hoy.

test("un salteo por la causa GLOBAL con un envio posterior no es 'el circuito perdio': la causa ya esta muerta", () => {
  const lineas = [
    '[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 rama=respondio etapa=nuevo->handoff_humano',
    "[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
  ];
  const deQuien = conversacionesDeAvisos(lineas);
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 53, estado: "handoff_humano", desde: "2026-09-04T03:41:45" }],
    convsConAviso: deQuien.filter((e) => e.estado === "sent").map((e) => e.conv),
    convsDesmentidos: salteadosYaDesmentidos(deQuien),
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 0, "se acusa al circuito de perder un evento que el propio log da por desmentido");
  assert.equal(conciliacion.causaMuerta.length, 1, "el evento tiene que quedar NOMBRADO en su propio balde, no desaparecer");
  assert.equal(
    diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas), conciliacion }).veredicto,
    "ok",
    "rojo que nadie puede curar: el flag ya esta encendido y la linea del 4-sep no se va del log",
  );
});

test("un salteo por la causa global SIN envio posterior sigue ROJO: la causa esta viva", () => {
  const lineas = [
    '[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 rama=respondio etapa=nuevo->handoff_humano',
    "[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
  ];
  const deQuien = conversacionesDeAvisos(lineas);
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 53, estado: "handoff_humano", desde: "2026-09-04T03:41:45" }],
    convsConAviso: [],
    convsDesmentidos: salteadosYaDesmentidos(deQuien),
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 1, "sin un envio posterior el flag sigue apagado: es rojo y se arregla encendiendolo");
  assert.equal(conciliacion.causaMuerta.length, 0);
});

test("un salteo por causa PROPIA no lo cura un envio ajeno posterior", () => {
  // `contarEventos` ya usa esta regla: solo la causa GLOBAL la desmiente otro envio, porque
  // esa linea no es de ningun aviso en particular. Un `cupo_agotado` de ESTA conversacion
  // sigue siendo suyo aunque despues salga el aviso de otra.
  const lineas = [
    '[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 rama=respondio etapa=nuevo->handoff_humano',
    "[aviso] skipped (pidio_hablar_con_humano): no habia texto accionable",
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
  ];
  const deQuien = conversacionesDeAvisos(lineas);
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [{ conv: 53, estado: "handoff_humano", desde: "2026-09-04T03:41:45" }],
    convsConAviso: deQuien.filter((e) => e.estado === "sent").map((e) => e.conv),
    convsDesmentidos: salteadosYaDesmentidos(deQuien),
    ventana: VENTANA,
  });
  assert.equal(conciliacion.sinAviso.length, 1, "un envio ajeno no cura el salteo propio de otra conversacion");
});

test("las dos mitades no pueden volver a contradecirse: lo que contarEventos da por desmentido no queda en sinAviso", () => {
  // El log REAL del 4-sep, con las dos lineas anonimas y el envio que las desmiente.
  const lineas = [
    '[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 rama=respondio etapa=nuevo->handoff_humano',
    "[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
    '[onia-webhook] 2026-09-04T06:38:24.196Z conv=55 rama=respondio etapa=nuevo->handoff_humano',
    "[aviso] skipped (pregunta_precio_recepcion): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)",
    "[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado",
  ];
  const eventos = contarEventos(lineas);
  const deQuien = conversacionesDeAvisos(lineas);
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: [
      { conv: 53, estado: "handoff_humano", desde: "2026-09-04T03:41:45" },
      { conv: 55, estado: "handoff_humano", desde: "2026-09-04T06:37:54" },
    ],
    convsConAviso: deQuien.filter((e) => e.estado === "sent").map((e) => e.conv),
    convsDesmentidos: salteadosYaDesmentidos(deQuien),
    ventana: VENTANA,
  });
  // La invariante, escrita como invariante y no como numero: los dos salteos que
  // `contarEventos` NO cuenta como vigentes no pueden aparecer como perdidos del otro lado.
  assert.equal(eventos.salteados - eventos.salteadosVigentes, 2, "el log de referencia tiene 2 salteos ya desmentidos");
  assert.equal(conciliacion.sinAviso.length, 0, "la mitad que absuelve y la que acusa juzgan al reves el mismo evento");
  assert.equal(
    diagnosticar({ circuito: CIRCUITO_SANO, eventos, conciliacion }).veredicto,
    "ok",
    "el veredicto tiene que poder volver a verde, o no puede decir 'se rompio HOY'",
  );
});

test("el reporte NOMBRA los desmentidos: un alcance que no se imprime se re-descubre", () => {
  const lectura = lecturaDeEventos({
    veredicto: "ok",
    eventos: contarEventos(["[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado"]),
    circuitoSano: true,
    conciliacion: { medido: true, sinAviso: [], conAviso: [], fueraDeAlcance: [], causaMuerta: [{ conv: 53, estado: "handoff_humano" }] },
  });
  assert.match(lectura, /53/, "el evento absuelto queda sin nombre y nadie puede auditar la absolucion");
});

// ---------------------------------------------------------------------------------------------
// `accionable` medía el dato que el propio gate inyecta, no el que escribe el MOTOR.
//
// Medido el 2026-09-26: el gate `textoAccionable` armaba el aviso con `conversationId: 4242`
// y lo juzgaba con `aviso.texto.includes("4242") && aviso.conversationId === 4242`. Las dos
// mitades miran el MISMO argumento: `construirAviso` estampa ese numero en la cabecera y lo
// devuelve tal cual, asi que el juicio es tautologico — no puede ponerse rojo por nada que
// haga el motor, que es justo lo que dice medir ("el aviso nombra la conversacion").
//
// Y su sintoma estaba impreso a la vista: el ejemplo de "lo que recibiria Sergio" salia con
// DOS identidades para la misma conversacion —cabecera `conversacion 4242`, cuerpo
// `Conversación chatwoot:0`— una combinacion que ningun aviso real puede tener, porque en
// produccion los dos lados salen del mismo evento de Chatwoot. Un ejemplo infiel apaga al
// instrumento: quien lo compare con un aviso real no puede distinguir bug de artefacto.
test("accionable mira el CUERPO que escribe el motor, no solo la cabecera que el gate inyecta", () => {
  const conv = CONVERSACION_DEL_GATE;

  // El caso real: el motor nombra la conversacion en su texto (`bot-engine.mjs` lo arma con
  // `state.conversationKey`), asi que cabecera y cuerpo coinciden.
  assert.equal(
    avisoEsAccionable({
      aviso: { texto: `🔔 <b>Bot Onia</b> — conversacion ${conv} · web\n\nConversación chatwoot:${conv} (web). Motivo: x`, conversationId: conv },
      conversationId: conv,
    }),
    true,
    "el aviso bien formado tiene que seguir pasando, o el gate se vuelve inutil por el otro lado",
  );

  // El fallo que la version tautologica dejaba pasar EN VERDE: el motor nombra OTRA
  // conversacion. Sergio Urcullo abre la que dice el cuerpo y encuentra a otro prospecto.
  assert.equal(
    avisoEsAccionable({
      aviso: { texto: `🔔 <b>Bot Onia</b> — conversacion ${conv} · web\n\nConversación chatwoot:0 (web). Motivo: x`, conversationId: conv },
      conversationId: conv,
    }),
    false,
    "cabecera y cuerpo nombran conversaciones distintas y el gate lo aprueba: es el falso verde que este test existe para morder",
  );

  // Y el que el comentario del gate dice medir: el motor no nombra ninguna conversacion.
  assert.equal(
    avisoEsAccionable({
      aviso: { texto: `🔔 <b>Bot Onia</b> — conversacion ${conv} · web\n\n<b>te esperan a vos</b>`, conversationId: conv },
      conversationId: conv,
    }),
    false,
    "un aviso cuyo cuerpo no dice a que conversacion contestar es un timbre sin puerta",
  );
});

// El ejemplo que el instrumento IMPRIME es lo unico que un humano compara contra un aviso
// real. Si el gate arma su estado sintetico con una conversacion distinta de la que le pasa a
// `construirAviso`, el ejemplo miente sobre el producto sin que nada se ponga rojo.
test("el ejemplo impreso es FIEL: la conversacion de la cabecera es la del cuerpo", async () => {
  const motor = await motorProduceAviso(DIR_BOT);
  assert.ok(motor, "sin motor no hay nada que medir");
  assert.ok(motor.ejemplo, "el gate dejo de imprimir el ejemplo: el instrumento ya no muestra lo que mide");
  assert.match(
    motor.ejemplo,
    new RegExp(`conversacion ${CONVERSACION_DEL_GATE}`),
    "la cabecera del ejemplo no nombra la conversacion del gate",
  );
  assert.match(
    motor.ejemplo,
    new RegExp(`chatwoot:${CONVERSACION_DEL_GATE}`),
    "el cuerpo del ejemplo nombra OTRA conversacion que la cabecera: el ejemplo no es un aviso posible",
  );
  assert.equal(motor.accionable, true, "el gate tiene que seguir verde con el ejemplo fiel");
});
