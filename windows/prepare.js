// Gör spelet helt offline: kopierar three.js och typsnitten från node_modules
// och byter ut webblänkarna i game/index.html mot lokala filer i app/.
const fs = require('fs');
const path = require('path');
const root = __dirname, out = path.join(root, 'app'), vend = path.join(out, 'vendor');
fs.mkdirSync(vend, { recursive: true });
const nm = p => path.join(root, 'node_modules', p);
const copy = (src, name) => { fs.copyFileSync(nm(src), path.join(vend, name)); return 'vendor/' + name; };

let html = fs.readFileSync(path.join(root, '..', 'spel', 'index.html'), 'utf8');
const swaps = [
  ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three/build/three.min.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js', 'three/examples/js/shaders/CopyShader.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js', 'three/examples/js/shaders/LuminosityHighPassShader.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js', 'three/examples/js/postprocessing/EffectComposer.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js', 'three/examples/js/postprocessing/RenderPass.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js', 'three/examples/js/postprocessing/ShaderPass.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js', 'three/examples/js/postprocessing/UnrealBloomPass.js']
];
for (const [url, src] of swaps) {
  if (!html.includes(url)) { console.warn('Hittade inte', url); continue; }
  html = html.split(url).join(copy(src, path.basename(src)));
}
// PeerJS för multiplayer (spelet letar först i vendor/)
copy('peerjs/dist/peerjs.min.js', 'peerjs.min.js');
// Typsnitt lokalt i stället för Google Fonts
const fonts = [
  ['Lilita One', 400, '@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2'],
  ['Nunito', 500, '@fontsource/nunito/files/nunito-latin-500-normal.woff2'],
  ['Nunito', 700, '@fontsource/nunito/files/nunito-latin-700-normal.woff2'],
  ['Nunito', 800, '@fontsource/nunito/files/nunito-latin-800-normal.woff2']
];
let css = '';
for (const [fam, w, src] of fonts) {
  if (!fs.existsSync(nm(src))) { console.warn('Saknar typsnitt', src); continue; }
  css += `@font-face{font-family:"${fam}";font-weight:${w};font-style:normal;font-display:swap;src:url(${copy(src, path.basename(src))}) format("woff2")}\n`;
}
html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, `<style>${css}</style>`);
if (/(src|href)="https:\/\/(cdnjs|cdn\.jsdelivr|fonts\.googleapis)/.test(html)) console.warn('Varning: det finns fortfarande webblänkar kvar i spelet.');
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.copyFileSync(path.join(root, 'build', 'icon.png'), path.join(out, 'icon.png'));
console.log('Klart: app/index.html är offline-redo.');
