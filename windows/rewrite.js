// Byter spelets webblänkar (three.js, typsnitt) mot lokala filer i vendor/.
// Används både när appen byggs (prepare.js) och när appen hämtar senaste versionen (main.js).
const SWAPS = [
  ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three/build/three.min.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js', 'three/examples/js/shaders/CopyShader.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js', 'three/examples/js/shaders/LuminosityHighPassShader.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js', 'three/examples/js/postprocessing/EffectComposer.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js', 'three/examples/js/postprocessing/RenderPass.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js', 'three/examples/js/postprocessing/ShaderPass.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js', 'three/examples/js/postprocessing/UnrealBloomPass.js']
];
const base = p => p.split('/').pop();
function offlineHtml(html) {
  for (const [url, src] of SWAPS) html = html.split(url).join('vendor/' + base(src));
  return html
    .replace(/<link rel="preconnect"[^>]*>\s*/g, '')
    .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="vendor/fonts.css">');
}
module.exports = { SWAPS, offlineHtml, base };
