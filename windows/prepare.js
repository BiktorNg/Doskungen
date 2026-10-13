// Gör spelet helt offline: kopierar three.js, PeerJS och typsnitten från node_modules
// till app/vendor och skriver app/index.html med lokala länkar.
const fs = require('fs');
const path = require('path');
const { SWAPS, offlineHtml, base } = require('./rewrite');
const root = __dirname, out = path.join(root, 'app'), vend = path.join(out, 'vendor');
fs.mkdirSync(vend, { recursive: true });
const nm = p => path.join(root, 'node_modules', p);
const copy = src => { fs.copyFileSync(nm(src), path.join(vend, base(src))); return base(src); };
for (const [, src] of SWAPS) copy(src);
copy('peerjs/dist/peerjs.min.js');
const fonts = [
  ['Lilita One', 400, '@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2'],
  ['Nunito', 500, '@fontsource/nunito/files/nunito-latin-500-normal.woff2'],
  ['Nunito', 700, '@fontsource/nunito/files/nunito-latin-700-normal.woff2'],
  ['Nunito', 800, '@fontsource/nunito/files/nunito-latin-800-normal.woff2']
];
let css = '';
for (const [fam, w, src] of fonts) {
  if (!fs.existsSync(nm(src))) { console.warn('Saknar typsnitt', src); continue; }
  css += `@font-face{font-family:"${fam}";font-weight:${w};font-style:normal;font-display:swap;src:url(${copy(src)}) format("woff2")}\n`;
}
fs.writeFileSync(path.join(vend, 'fonts.css'), css);
const html = offlineHtml(fs.readFileSync(path.join(root, '..', 'spel', 'index.html'), 'utf8'));
if (/(src|href)="https:\/\/(cdnjs|cdn\.jsdelivr|fonts\.googleapis)/.test(html)) console.warn('Varning: det finns fortfarande webblänkar kvar i spelet.');
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.copyFileSync(path.join(root, 'build', 'icon.png'), path.join(out, 'icon.png'));
console.log('Klart: app/index.html är offline-redo.');
