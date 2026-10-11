// Lista única de frases prohibidas (editor-videos § «Reels de Lucía» + plan v5 §2 + marcas de terceros). La usan build.mjs (guion-voz.txt, pie.txt)
// y grep-prohibidas.mjs (todo el texto en pantalla, el pie y el guion de voz).
export const PROHIBIDAS = [
  // decisión 3-oct: nunca se identifica con el rubro de salud
  'hoy soy odontóloga', 'soy doctora', 'como odontóloga', 'mis pacientes', 'mi consultorio', 'mi estudio', 'me pasó con un paciente',
  'odontólog', 'doctora', 'paciente', 'consultorio', 'clínica', 'médic', 'dentista',
  // promesas y resultados
  'agenda llena', 'cero ausencias', 'garantiz', 'resultado', 'aument', 'ahorr', 'ganá', 'ventas', 'clientes', '%',
  // el chiste va con «soy IA», nunca con «no sé»
  'no sé',
  // afirmación ya verificada como FALSA en G3 (la mano NO está tapada)
  'tapada',
  // marcas de terceros (modelos, plataformas, competidores). D-N1 (11-oct, Sergio Urcullo): se nombran SOLO Kling 3.0 std, Seedance 2.0 Mini y Kling O3 (y, en el README,
  // Kling 3.0 pro, Seedance 2.0 Mini + referencias y Cinematic Studio 3.0) como uso propio: «kling», «seedance» y «cinematic» ya no están prohibidas; el resto sigue igual.
  'seedream', 'higgsfield', 'soul', 'nano banana', 'cinema studio', 'veo', 'midjourney', 'runway', 'elevenlabs', 'sora', 'gpt', 'claude', 'chatgpt', 'omni', 'flux', 'start_image', 'start image', 'sync.so', 'sync_so', 'buffalo', 'insightface', 'arcface', 'scrfd', 'instagram', 'meta ', 'tiktok', 'buffer',
  // Sergio Urcullo no sale (cara ni voz) y el producto de Onia no se muestra en esta pieza
  'sergio', 'urcullo', 'onia platform', 'dentalgest', 'gestios',
];
// D-N1: ninguna frase que suene a «el mejor» o a recomendación general (son una prueba, una toma, no una regla). La única mención permitida de «recomendación» es el aviso del pie.
export const AVISO_PIE = 'Nombro lo que uso; no es una recomendación pagada.';
export const RECOMENDACION = ['el mejor', 'la mejor', 'lo mejor', 'mejor ', 'recomend', 'te conviene', 'conviene', 'ganador', 'campeón', 'imbatible', 'el único'];
export const buscarRecomendacion = (txt) => {
  const low = String(txt).replace(AVISO_PIE, '').toLowerCase();
  return RECOMENDACION.filter((f) => low.includes(f));
};
export const buscarProhibidas = (txt) => {
  const low = String(txt).toLowerCase();
  return PROHIBIDAS.filter((f) => low.includes(f.toLowerCase()));
};

// Revisión 1 (11-oct): el PIE nombra la plataforma de los créditos (Higgsfield) y con qué se mide (ArcFace): en el pie, y solo en el pie, esas dos dejan de estar prohibidas.
// En la pantalla y en la voz siguen prohibidas (la pantalla muestra los tres nombres de herramienta; la voz dice «Kling», «Seedance Mini», «Kling O tres»).
export const PERMITIDAS_EN_EL_PIE = ['higgsfield', 'arcface'];
export const buscarProhibidasPie = (txt) => {
  const low = String(txt).toLowerCase();
  return PROHIBIDAS.filter((f) => !PERMITIDAS_EN_EL_PIE.includes(f.toLowerCase()) && low.includes(f.toLowerCase()));
};
// Revisión 1 (H4): ni el video, ni la voz, ni el pie afirman una REGLA general sobre la foto sola. Cinematic Studio 3.0 con la foto sola (20 cr) dio 0,79 a 0,77, dentro del ruido (±0,03).
export const GENERALES = ['la foto sola pierde', 'foto sola siempre', 'siempre pierde', 'siempre baja', 'pagar más no', 'pagar mas no', 'pagar más nunca', 'toda foto sola'];
export const buscarGenerales = (txt) => {
  const low = String(txt).toLowerCase();
  return GENERALES.filter((f) => low.includes(f));
};
