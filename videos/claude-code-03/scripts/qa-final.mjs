// QA integral del video final con Gemini (video+audio nativos).
import { seeLocalVideo } from 'file:///C:/dev/proyectos/onia-hermes/.claude/skills/ver-videos/scripts/gemini-see-video.mjs';
const PROMPT = `Sos el control de calidad FINAL de este video de YouTube ya editado. Miralo y escuchalo COMPLETO y reporta SOLO fallos, con timestamp MM:SS. Revisa en este orden:
1. AUDIO: palabras cortadas en empalmes, frases repetidas (retakes vivos), saltos bruscos, desincronizacion labios/voz, efectos de sonido mal puestos o muy fuertes, musica que tapa la voz.
2. VIDEO: cuadros negros o congelados, saltos de zoom bruscos, elementos graficos cortados por el borde, texto ilegible o con errores de ortografia (lee TODOS los textos en pantalla), overlays que tapan la cara, transiciones rotas.
3. COHERENCIA: graficos que aparecen en momentos que no corresponden con lo que se dice, la camarita de la esquina apareciendo/desapareciendo de forma rara.
4. CIERRE: que el video termine limpio (endcard completo, sin cortes a mitad de frase).
Si una categoria esta limpia, decilo en una linea. Se ESPECIFICO y no inventes.`;
const out = await seeLocalVideo(process.argv[2], PROMPT);
console.log(out);
