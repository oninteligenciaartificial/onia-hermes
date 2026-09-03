#!/usr/bin/env node
// Decide el VEREDICTO del 429 del widget de Chatwoot a partir de datos ya medidos.
//
// POR QUE EXISTE (medido el 2026-09-03 por el carril `onia-cola`): la sonda
// `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` decidia el veredicto mirando el
// codigo HTTP **del instante**, y con eso contestaba distinto segun el minuto en que se la
// corriera. El throttle de Chatwoot es de 5 cargas por hora y por IP, asi que el 429 es
// INTERMITENTE: aparece durante la rafaga de nuestros propios loops y se va cuando vence la
// ventana. Los dos errores que producia, y que costaron cinco vueltas de carril:
//
//   1. FALSO NEGATIVO. Widget en 200 -> "no hay throttle activo. Nada que diagnosticar",
//      ignorando que en 6 h hubo 286 peticiones y 286 eran nuestras. El que la corria en un
//      hueco se iba convencido de que no habia nada, y el siguiente carril volvia a abrir el
//      item desde cero.
//   2. FALSO POSITIVO, el caro. `AJENAS` contaba PETICIONES de IPs ajenas, no IPs que hubieran
//      llegado al limite. Con 2 visitas legitimas sueltas gritaba "puede haber clientes
//      afectados": asi nacio el item rojo del 2026-09-03 03:41 UTC, que decia "NO es solo
//      trafico propio" apoyado en 2 peticiones de 288.
//
// El unico modo de que un visitante real vea el 429 es que **su propia IP** llegue al limite,
// porque Rack::Attack cuenta una clave por IP. Ese, y no "hubo trafico ajeno", es el criterio.
//
//   node scripts/veredicto_widget.mjs --widget 200 --peticiones "1.2.3.4:286,5.6.7.8:1"
//   node scripts/veredicto_widget.mjs --self-check   (prueba la logica, sin tocar el sistema)
//
// Sale 0 siempre en modo veredicto: es un diagnostico, no un gate. Con --self-check sale != 0
// si algun caso falla.

const NUESTRA_IP_POR_DEFECTO = '187.77.16.63';
const LIMITE_POR_HORA = 5;

// --- la decision -------------------------------------------------------------

// peticiones/contadores: Map o array de pares [ip, n]. `contadores` son las claves vivas de
// Rack::Attack (ventana de 1 h); `peticiones` es el desglose de las ultimas 6 h.
export function veredicto({
  widgetStatus,
  nuestraIp = NUESTRA_IP_POR_DEFECTO,
  peticiones = [],
  contadores = [],
  limite = LIMITE_POR_HORA,
}) {
  const pares = (x) => (x instanceof Map ? [...x.entries()] : [...x]);
  const ajenas = pares(peticiones).filter(([ip]) => ip !== nuestraIp);
  const nuestras = pares(peticiones)
    .filter(([ip]) => ip === nuestraIp)
    .reduce((a, [, n]) => a + Number(n), 0);
  const totalAjenas = ajenas.reduce((a, [, n]) => a + Number(n), 0);
  const total = nuestras + totalAjenas;

  // Una IP ajena SOLO puede ver el 429 si ella misma llego al limite en su ventana.
  const ajenasAlLimite = [...pares(contadores), ...ajenas]
    .filter(([ip]) => ip !== nuestraIp)
    .filter(([, n]) => Number(n) >= limite)
    .map(([ip]) => ip);
  const afectadas = [...new Set(ajenasAlLimite)];

  if (afectadas.length > 0) {
    return {
      codigo: 'CLIENTES-AFECTADOS',
      titulo: `OJO: ${afectadas.length} IP(s) ajenas llegaron al limite de ${limite}/hora`,
      detalle:
        `${afectadas.join(', ')} — esas SI pueden haber visto el chat caido. ` +
        'Es un item de producto: mirar el desglose antes de descartarlo.',
      esNuestro: false,
    };
  }

  if (total === 0) {
    return {
      codigo: 'SIN-DATOS',
      titulo: 'No hubo ni una peticion a /widget en la ventana medida',
      detalle: 'Sin trafico no se puede concluir nada. No medir NO es estar bien.',
      esNuestro: null,
    };
  }

  // Con o sin 429 en este instante: si toda la huella es nuestra, el diagnostico es el mismo.
  // Esta es la rama que antes se saltaba cuando el widget respondia 200.
  const pct = Math.round((nuestras / total) * 100);
  return {
    codigo: 'AUTOINDUCIDO',
    titulo:
      `AUTOINDUCIDO. ${nuestras} de ${total} peticiones (${pct}%) son del propio VPS ` +
      `(${nuestraIp})`,
    detalle:
      (widgetStatus === 429
        ? 'El 429 esta activo ahora y se lo hizo el VPS solo. '
        : `El widget responde ${widgetStatus} en este instante, pero eso NO cierra el caso: ` +
          'el throttle es de 1 hora y se enciende en cada rafaga de nuestros loops. ') +
      `Ninguna IP ajena llego a ${limite}/hora, asi que un visitante real abre el chat sin ` +
      'problema. NO es un item de producto. Lo que si conviene: safelistear nuestra IP para ' +
      'que el canario vuelva a ver lo que ve un cliente (radar, decision de Sergio).',
    esNuestro: true,
  };
}

// --- parseo de la linea de comandos -----------------------------------------

// "ip:n,ip:n" -> [[ip, n], ...]. Tolera vacio y espacios: lo alimenta un shell.
export function parsearPares(texto) {
  if (!texto) return [];
  return texto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const i = t.lastIndexOf(':');
      if (i === -1) throw new Error(`par sin ':' -> ${t}`);
      return [t.slice(0, i).trim(), Number(t.slice(i + 1))];
    });
}

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? porDefecto : process.argv[i + 1];
}

// --- self-check --------------------------------------------------------------

function selfCheck() {
  let fallos = 0;
  const ok = (nombre, cond) => {
    console.log(`  ${cond ? 'ok' : 'FALLA'} - ${nombre}`);
    if (!cond) fallos++;
  };

  // El caso REAL del 2026-09-03 05:35 UTC, con los numeros medidos en vivo.
  const hoy = veredicto({
    widgetStatus: 200,
    peticiones: [['187.77.16.63', 286], ['192.223.122.70', 1], ['190.180.28.134', 1]],
    contadores: [['187.77.16.63', 1]],
  });
  ok(
    'widget en 200 con la huella entera nuestra NO es "nada que diagnosticar"',
    hoy.codigo === 'AUTOINDUCIDO',
  );
  ok('y lo dice con el porcentaje, no en abstracto', /99%/.test(hoy.titulo));

  // El falso positivo que genero el item rojo: 2 peticiones ajenas, ninguna al limite.
  const dosSueltas = veredicto({
    widgetStatus: 429,
    peticiones: [['187.77.16.63', 284], ['192.223.122.70', 1], ['190.180.28.134', 1]],
    contadores: [['187.77.16.63', 15], ['190.180.28.134', 1]],
  });
  ok(
    'dos visitas ajenas sueltas NO son "clientes afectados"',
    dosSueltas.codigo === 'AUTOINDUCIDO',
  );

  // Y el dia que SI pase, tiene que salir positivo: una sonda que solo sabe decir
  // "es nuestro" no sirve.
  const ajenaAlLimite = veredicto({
    widgetStatus: 429,
    peticiones: [['187.77.16.63', 10], ['200.1.1.9', 7]],
    contadores: [['200.1.1.9', 6]],
  });
  ok('una IP ajena que llega al limite SI es un item de producto',
    ajenaAlLimite.codigo === 'CLIENTES-AFECTADOS');
  ok('y la nombra', /200\.1\.1\.9/.test(ajenaAlLimite.detalle));

  ok(
    'tambien la detecta por el desglose de 6 h si no quedo contador vivo',
    veredicto({
      widgetStatus: 429,
      peticiones: [['187.77.16.63', 10], ['200.1.1.9', 9]],
      contadores: [],
    }).codigo === 'CLIENTES-AFECTADOS',
  );

  ok(
    'sin trafico no inventa un veredicto',
    veredicto({ widgetStatus: 200, peticiones: [], contadores: [] }).codigo === 'SIN-DATOS',
  );

  ok(
    'la IP nuestra se puede cambiar, y entonces el trafico pasa a ser ajeno',
    veredicto({
      widgetStatus: 429,
      nuestraIp: '10.0.0.99',
      peticiones: [['187.77.16.63', 286]],
      contadores: [['187.77.16.63', 34]],
    }).codigo === 'CLIENTES-AFECTADOS',
  );

  ok('parsea los pares que le pasa el shell',
    JSON.stringify(parsearPares('1.2.3.4:286, 5.6.7.8:1')) ===
      JSON.stringify([['1.2.3.4', 286], ['5.6.7.8', 1]]));
  ok('y tolera el vacio', parsearPares('').length === 0);

  console.log(fallos === 0 ? '\nself-check verde' : `\nself-check ROJO (${fallos})`);
  return fallos;
}

// --- entrada -----------------------------------------------------------------

if (process.argv.includes('--self-check')) {
  process.exit(selfCheck() === 0 ? 0 : 1);
} else {
  const r = veredicto({
    widgetStatus: arg('widget', '?'),
    nuestraIp: arg('nuestra-ip', NUESTRA_IP_POR_DEFECTO),
    peticiones: parsearPares(arg('peticiones', '')),
    contadores: parsearPares(arg('contadores', '')),
  });
  console.log(`   ${r.titulo}`);
  for (const linea of r.detalle.match(/.{1,86}(\s|$)/g) ?? []) {
    console.log(`   ${linea.trim()}`);
  }
}
