// Placas de texto del reel, con el MISMO tipo y el MISMO terracota que sus carruseles.
// Se renderizan con Chrome headless igual que el motor de carrusel: usar PIL con una
// fuente del sistema daria otra tipografia y la pieza dejaria de parecer de ella.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const VERDE = '#00D26A'; // Sergio 2026-08-28: "usa color verde siempre"
const PLACAS = [
  ['Esta cara', 'no existe'],
  ['No empieza con un texto.<br>Empieza con', 'una cara'],
  ['Se entrenó con 8 fotos.<br>Una era de', 'otra mujer'],
  ['El arreglo no fue un truco.<br>Fue', 'mirar'],
  ['Soy Lucía y soy IA.', 'No lo escondo'],
];

const html = (normal, marcado) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75,800;100,700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent}
.wrap{width:1080px;height:1920px;display:flex;align-items:flex-end;padding:0 76px 300px;
  background:linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,.45) 26%,rgba(0,0,0,0) 46%)}
p{font-family:'Archivo',sans-serif;font-variation-settings:'wdth' 75,'wght' 800;
  font-size:96px;line-height:1.02;color:#fff;letter-spacing:-.02em;
  text-shadow:0 4px 40px rgba(0,0,0,.55)}
mark{background:${VERDE};color:#fff;padding:.02em .14em;border-radius:6px;
  box-decoration-break:clone;-webkit-box-decoration-break:clone}
</style><div class="wrap"><p>${normal} <mark>${marcado}</mark></p></div>`;

mkdirSync('placas', { recursive: true });
PLACAS.forEach(([n, m], i) => {
  const f = path.resolve(`placas/tmp${i + 1}.html`);
  writeFileSync(f, html(n, m));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--default-background-color=00000000', '--window-size=1080,1920',
    // Sin esto la captura sale antes de que baje la fuente de Google.
    '--virtual-time-budget=6000',
    `--screenshot=${path.resolve(`placas/p${i + 1}.png`)}`, `file://${f}`],
    { stdio: 'ignore' });
  console.log(`placa ${i + 1}: ${m}`);
});
