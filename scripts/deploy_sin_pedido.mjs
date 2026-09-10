#!/usr/bin/env node
/**
 * deploy_sin_pedido.mjs — trabajo varado para un destino y NINGÚN pedido vivo que lo cubra.
 *
 *   node scripts/deploy_sin_pedido.mjs              # medición viva (0 cubierto · 1 descubierto · 2 no medido)
 *   node scripts/deploy_sin_pedido.mjs --self-check # casos puros, sin red ni tablero
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * NACE DEL 2026-09-07, y de que nada se puso rojo.
 *
 * `onia.com.bo` llevaba horas sirviendo un build viejo con TRES arreglos detrás, y uno de
 * ellos era de venta: la portada y `/v1` ofrecían «agentes que revisan tu negocio cada día»
 * pegado a «Desde Bs 320 al mes», y los agentes recién vienen desde Pro (Bs 750). No existía
 * ni un pedido de deploy de `landing` en el tablero — el último había quedado en `done`. Se
 * encontró contando los pedidos A MANO en una vuelta del integrador; si esa vuelta no se
 * hacía, el arreglo seguía sin llegar al cliente y ningún instrumento lo decía.
 *
 * POR QUÉ NO LO VE NINGUNO DE LOS QUE YA EXISTEN, que es lo que lo hace caro:
 *
 *   - `deploy-vivo.mjs` (web-venta) cuenta lo que falta publicar y lo imprime. Nunca
 *     pregunta si alguien lo PIDIÓ: su salida es la misma con pedido y sin pedido.
 *   - `pedido_deploy_entregado.mjs` mide los pedidos que EXISTEN y ya se publicaron
 *     («dice pendiente sobre lo resuelto»). Un destino sin ninguna tarea no tiene sujeto
 *     ahí: no hay pedido que clasificar, así que sale del barrido sin decir nada.
 *   - Los publicadores en seco dicen «hay que publicar: N arreglo(s)» y nadie los corre
 *     salvo cuando ya se sospecha.
 *
 * Es el hueco ENTRE dos gates que tienen razón por separado: uno mira el trabajo sin el
 * pedido, el otro el pedido sin el trabajo. La firma es la tercera de la familia —ni «dice
 * resuelto sobre lo pendiente» ni «dice pendiente sobre lo resuelto», sino **no dice nada
 * sobre lo pendiente**— y es la única que no deja rastro en el tablero.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * QUÉ MIDE. Para cada destino de la lista blanca (`DESTINOS` de `publicar-aprobado.mjs`, que
 * es de donde salen y adonde van los `ok` de Sergio Urcullo): ¿hay trabajo sin publicar? y
 * ¿hay un pedido vivo con `DESPLEGAR: <ese destino>`?
 *
 *   trabajo > 0 y sin pedido → DESCUBIERTO. Es el ítem: hay que abrir el pedido.
 *   trabajo > 0 y con pedido → cubierto.
 *   trabajo 0                → cubierto (no hay nada que pedir).
 *
 * EL UNIVERSO SE DERIVA, LA MEDICIÓN NO SE PUEDE DERIVAR. Los destinos salen de la lista
 * blanca, así que uno nuevo nace vigilado. Pero *cómo* se le pregunta «¿te falta publicar?»
 * es distinto en cada uno (la plataforma nombra su sha, la landing no, el bot se despliega
 * por copia), y esa parte es un mapa escrito a mano. Por eso un destino SIN detector sale
 * NO_MEDIDO **y con su nombre**: es la única forma de que la lista escrita a mano no se
 * vuelva una lista de inclusión que falla abierto un nivel más arriba.
 *
 * FALLA CONSERVADOR HACIA «NO MEDIDO», y la dirección importa por un motivo que ya está
 * medido: un barrido incompleto del tablero se ve IDÉNTICO a un tablero sin pedidos, y de
 * ahí sale la conclusión cara —«este destino no tiene pedido»— que hace abrir un pedido
 * DUPLICADO. Ese duplicado es el ruido que hace que Sergio Urcullo deje de creerle a los
 * avisos. Así que si alguna tarea abierta no contesta el `show`, esto no concluye nada.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { DESTINOS } from './kanban/publicar-aprobado.mjs';
import { barrerPedidos } from './pedido_deploy_entregado.mjs';

const TABLERO = '/root/bin/onia-tablero.sh';
/** El nodo de casa no tiene `/opt`, pero sí llega al VPS por SSH. Ver `pendienteEnVivo`. */
const VPS = '/root/bin/onia-vps.sh';

// ── núcleo puro ────────────────────────────────────────────────────────────────────────

/**
 * PURA: el veredicto por destino.
 *
 * @param destinos  nombres de la lista blanca (`Object.keys(DESTINOS)`).
 * @param pendiente `(destino) => true | false | null` — null es «no se sabe».
 * @param pedidos   los del barrido del tablero: `[{ id, destino }]`.
 *
 * ⚠️ El sujeto son los DESTINOS, no los pedidos. Recorrer los pedidos —que es lo natural
 * cuando ya tenés el barrido en la mano— hace que un destino sin ninguna tarea no tenga
 * fila, y ése es exactamente el caso que este gate existe para cazar: el que no deja rastro.
 */
export function clasificarCobertura({ destinos, pendiente, pedidos }) {
  const filas = [];
  for (const destino of destinos) {
    const cubiertoPor = (pedidos || []).filter((p) => p.destino === destino).map((p) => p.id);
    const p = pendiente(destino);
    if (p === null || p === undefined) {
      filas.push({ destino, estado: 'NO_MEDIDO', motivo: 'no pude preguntarle si le falta publicar', pedidos: cubiertoPor });
      continue;
    }
    if (p === false) {
      filas.push({ destino, estado: 'AL_DIA', pedidos: cubiertoPor });
      continue;
    }
    filas.push({
      destino,
      estado: cubiertoPor.length > 0 ? 'CUBIERTO' : 'DESCUBIERTO',
      pedidos: cubiertoPor,
    });
  }
  return filas;
}

/**
 * PURA: `true` si al publicador en seco le falta publicar algo, `false` si está al día,
 * `null` si su salida no dice ni una cosa ni la otra.
 *
 * ⚠️ El `null` no es prolijidad: si el publicador cambia su texto, lo barato es que este
 * gate se calle, no que declare AL_DIA un destino con arreglos varados — que es la única
 * conclusión de acá que le cuesta plata a alguien.
 */
export function leerPendienteDelSeco(salida) {
  const t = String(salida ?? '');
  if (/YA\s+EST[AÁ]\s+PUBLICADO/i.test(t)) return false;
  const m = t.match(/hay que publicar:\s*(\d+)\s*arreglo/i);
  if (m) return Number(m[1]) > 0;
  return null;
}

/**
 * PURA: lo mismo para el bot, que no se mide por commits sino por espejo — se despliega
 * copiando archivos, así que «lo que falta» es la diferencia entre el repo y `/opt/onia/bot`.
 */
export function leerPendienteDelEspejo(salida) {
  const t = String(salida ?? '');
  if (/ESPEJO\s+DESINCRONIZADO/i.test(t)) return true;
  if (/ESPEJO\s+OK/i.test(t)) return false;
  return null;
}

// ── medición viva ──────────────────────────────────────────────────────────────────────

function sh(cmd, args, opts = {}) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
  } catch (e) {
    // Un publicador en seco puede salir con código != 0 y aun así haber dicho lo que hace
    // falta. Se conserva su salida: descartarla nos dejaría en NO_MEDIDO por un detalle.
    const out = e && (e.stdout || e.output?.[1]);
    return out ? String(out).trim() : null;
  }
}

/** Corre un comando donde vive `/opt`: acá si existe, y si no, en el VPS por SSH. */
function dondeVive(guion, timeout = 300_000) {
  if (existsSync('/opt/onia-landing') || existsSync('/opt/onia-platform')) {
    return sh('bash', ['-lc', guion], { timeout });
  }
  if (!existsSync(VPS)) return null;
  return sh('bash', [VPS, 'bash', '-lc', guion], { timeout });
}

/**
 * Cómo se le pregunta a cada destino si le falta publicar. Escrito a mano a propósito y
 * NOMBRADO: un destino de la lista blanca que no esté acá sale NO_MEDIDO con su nombre.
 */
const DETECTORES = {
  landing: () => leerPendienteDelSeco(dondeVive(`bash ${DESTINOS.landing} --dry-run 2>&1`)),
  plataforma: () => leerPendienteDelSeco(dondeVive(`bash ${DESTINOS.plataforma} --dry-run 2>&1`)),
  bot: () => leerPendienteDelEspejo(
    dondeVive('node /root/loops/onia-hermes/hermes-content/deploy/vps-ops/bot/espejo-check.mjs 2>&1'),
  ),
  // El emisor SIAT se despliega copiando archivos, como el bot, pero su publicador
  // imprime el MISMO formato que los de landing y plataforma ("YA ESTA PUBLICADO" /
  // "hay que publicar: N arreglo(s)") justamente para reusar este parser: un
  // detector nuevo por destino es otra fuente que se desincroniza.
  siat: () => leerPendienteDelSeco(dondeVive(`bash ${DESTINOS.siat} --dry-run 2>&1`)),
};

function pedidosVivos() {
  const lista = sh('bash', [TABLERO, 'list'], { timeout: 180_000 });
  if (lista === null) return null;
  return barrerPedidos({
    lista,
    leerCuerpo: (id) => sh('bash', [TABLERO, 'show', id], { timeout: 60_000 }),
  });
}

function medirEnVivo() {
  const barrido = pedidosVivos();
  if (barrido === null) {
    console.log(`NO MEDIDO: no pude leer el tablero (${TABLERO})`);
    return 2;
  }
  const { pedidos, ilegibles } = barrido;

  // Ver la cabecera: un barrido incompleto y un tablero sin pedidos se ven igual, y la
  // conclusión equivocada hace abrir un pedido duplicado.
  if (ilegibles.length > 0) {
    console.log(`NO MEDIDO: ${ilegibles.length} tarea(s) abiertas no contestaron el show — ${ilegibles.join(', ')}`);
    console.log('  Con el barrido incompleto no puedo decir que a un destino le falte pedido.');
    return 2;
  }

  const destinos = Object.keys(DESTINOS);
  const filas = clasificarCobertura({
    destinos,
    pedidos,
    pendiente: (d) => (DETECTORES[d] ? DETECTORES[d]() : null),
  });

  for (const f of filas) {
    const quien = f.pedidos.length ? ` — pedido ${f.pedidos.join(', ')}` : '';
    if (f.estado === 'DESCUBIERTO') {
      console.log(`DESCUBIERTO ${f.destino}: tiene arreglos sin publicar y NINGUN pedido vivo los pide.`);
    } else if (f.estado === 'NO_MEDIDO') {
      console.log(`NO MEDIDO ${f.destino}: ${f.motivo}${quien}`);
    } else if (f.estado === 'AL_DIA') {
      console.log(`OK ${f.destino}: al dia, no hay nada que pedir${quien}`);
    } else {
      console.log(`OK ${f.destino}: falta publicar y ya hay pedido${quien}`);
    }
  }

  if (filas.some((f) => f.estado === 'DESCUBIERTO')) {
    console.log('');
    console.log('Abrir UN pedido por destino descubierto, con la linea "DESPLEGAR: <destino>" en el');
    console.log('cuerpo y bloqueado con --kind needs_input. La cifra se cita del publicador en seco.');
    return 1;
  }
  if (filas.some((f) => f.estado === 'NO_MEDIDO')) return 2;
  return 0;
}

// ── self-check ─────────────────────────────────────────────────────────────────────────

function selfCheck() {
  let fallos = 0;
  const ok = (cond, nombre) => {
    if (cond) return;
    fallos++;
    console.log(`FALLO: ${nombre}`);
  };

  const sinPedidos = [];
  const conLanding = [{ id: 't_x', destino: 'landing' }];

  // El caso que motivó el gate: falta publicar y no hay pedido.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => true })[0].estado === 'DESCUBIERTO',
    'falta publicar y sin pedido tiene que ser DESCUBIERTO',
  );
  // El caso que YA CUMPLE. Sin él, un gate que devolviera DESCUBIERTO siempre pasaría.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: conLanding, pendiente: () => true })[0].estado === 'CUBIERTO',
    'falta publicar y con pedido vivo NO puede ser DESCUBIERTO',
  );
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => false })[0].estado === 'AL_DIA',
    'sin trabajo pendiente no hay nada que pedir',
  );
  // No se sabe nunca puede acusar: es la dirección que hace abrir pedidos duplicados.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => null })[0].estado === 'NO_MEDIDO',
    'sin poder medir NO puede salir DESCUBIERTO',
  );
  // Un pedido de OTRO destino no cubre a éste.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: [{ id: 't_y', destino: 'bot' }], pendiente: () => true })[0].estado === 'DESCUBIERTO',
    'un pedido de otro destino no cubre a landing',
  );
  // El sujeto son los DESTINOS: uno sin ninguna tarea tiene que tener fila igual.
  const filas = clasificarCobertura({ destinos: ['landing', 'plataforma', 'bot'], pedidos: conLanding, pendiente: () => true });
  ok(filas.length === 3, 'tiene que haber una fila por destino, tenga tareas o no');
  ok(filas.filter((f) => f.estado === 'DESCUBIERTO').length === 2, 'los dos destinos sin pedido tienen que salir descubiertos');

  // El universo se deriva de la lista blanca, no se copia.
  ok(Object.keys(DESTINOS).length >= 3, 'la lista blanca tiene que traer los destinos');
  const sinDetector = Object.keys(DESTINOS).filter((d) => !DETECTORES[d]);
  ok(sinDetector.length === 0, `hay destinos sin detector y saldrian NO_MEDIDO: ${sinDetector.join(', ')}`);

  // Lectura de las salidas reales de los publicadores.
  ok(leerPendienteDelSeco('== hay que publicar: 3 arreglo(s) que el cliente no ve ==') === true, 'seco: 3 arreglos es pendiente');
  ok(leerPendienteDelSeco('== hay que publicar: 0 arreglo(s) ==') === false, 'seco: 0 arreglos no es pendiente');
  ok(leerPendienteDelSeco('YA ESTA PUBLICADO — produccion corre 2045ff1') === false, 'seco: ya publicado no es pendiente');
  ok(leerPendienteDelSeco('cualquier otra cosa') === null, 'seco: una salida que no dice nada es NO se sabe');
  ok(leerPendienteDelEspejo('ESPEJO DESINCRONIZADO — ...') === true, 'espejo: desincronizado es pendiente');
  ok(leerPendienteDelEspejo('ESPEJO OK') === false, 'espejo: ok no es pendiente');
  ok(leerPendienteDelEspejo('') === null, 'espejo: sin salida es NO se sabe');

  // El barrido del tablero es el del hermano, no una copia: si cambia allá, se ve acá.
  const b = barrerPedidos({
    lista: '⊘ t_a  blocked  Publicar\n▶ t_b  ready  Otra cosa\n',
    leerCuerpo: (id) => (id === 't_a' ? 'DESPLEGAR: landing' : 'sin nada'),
  });
  ok(b.pedidos.length === 1 && b.pedidos[0].destino === 'landing', 'el barrido compartido tiene que reconocer el pedido');
  ok(b.ilegibles.length === 0, 'sin fallos de lectura no puede haber ilegibles');

  console.log(fallos === 0 ? 'self-check OK' : `self-check con ${fallos} fallo(s)`);
  return fallos === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes('--self-check') ? selfCheck() : medirEnVivo());
}
