// Cronograma de la voz por CARACTERES (no por palabras) — revisión 1, H1 (12-oct-2026).
// Por qué: el cronograma v2 contaba 3,6 palabras por segundo, pero este guion tiene 5,0 caracteres por palabra (18 car/s): +6 % sobre los ≈ 17 car/s que PLAN §4-bis
// midió en G1 v2 (320 car ≈ 19 s). Así una línea (L5) se pisaba con la siguiente y tres dejaban hueco de más. Aquí cada línea dura caracteres ÷ car_por_s y arranca
// donde dice plan.voz.inicios (su costura o hasta `desfase_max` después). NO se genera audio: son estimaciones hasta que haya voz real.
// Lo usan build.mjs (valida) y voz-tramos.mjs (imprime la tabla de qa/voz-tramos.txt).
export const nw = (t) => String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => x && !/^[·→—]$/.test(x)).length;

export function tramosDeVoz(plan, vozTxt, DUR) {
  const V = plan.voz;
  const lineas = vozTxt.split('\n');
  const [lo, hi] = V.car_por_s_sensibilidad;
  const ini = V.inicios;
  const tramos = lineas.map((texto, i) => {
    const car = [...texto].length;
    const s = ini[i];
    const d = (r) => car / r;
    const siguiente = i + 1 < lineas.length ? ini[i + 1] : DUR;
    const hueco = (r) => siguiente - (s + d(r));            // + = pausa antes de la línea siguiente (o cola hasta el final del video); − = solape
    const costura = plan.costuras.find((c) => c.seg === i + 1) || null;
    return {
      i: i + 1, texto, car, palabras: nw(texto), ini: s, dur: d(V.car_por_s), fin: s + d(V.car_por_s),
      siguiente, tramo: siguiente - s,
      hueco: hueco(V.car_por_s), hueco_lo: hueco(lo), hueco_hi: hueco(hi),
      costura: costura ? costura.t : null, desfase: costura ? s - costura.t : null,
    };
  });
  return { lineas, tramos, V };
}
