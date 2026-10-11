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
  // marcas de terceros (modelos, plataformas, competidores) y nombres de motores
  'kling', 'seedream', 'seedance', 'higgsfield', 'soul', 'nano banana', 'cinema', 'veo', 'midjourney', 'runway', 'elevenlabs', 'sora', 'gpt', 'claude', 'chatgpt', 'omni', 'flux', 'cinematic', 'start_image', 'start image', 'sync.so', 'sync_so', 'buffalo', 'insightface', 'arcface', 'scrfd', 'instagram', 'meta ', 'tiktok', 'buffer',
  // Sergio Urcullo no sale (cara ni voz) y el producto de Onia no se muestra en esta pieza
  'sergio', 'urcullo', 'onia platform', 'dentalgest', 'gestios',
];
export const buscarProhibidas = (txt) => {
  const low = String(txt).toLowerCase();
  return PROHIBIDAS.filter((f) => low.includes(f.toLowerCase()));
};
