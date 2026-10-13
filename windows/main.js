// Doskungen i Västmyra – Windows-app (Electron).
// Vid start hämtas senaste versionen av spelet från GitHub-sidan. Utan internet används
// den senast hämtade versionen, och annars den som följde med installationen.
// Alla versioner körs som lokala filer, så sparfilerna är desamma oavsett version.
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { offlineHtml } = require('./rewrite');

const ONLINE = 'https://biktorng.github.io/Doskungen/spel/index.html';
const BUNDLED = path.join(__dirname, 'app');
const gameDir = () => path.join(app.getPath('userData'), 'game');
const metaFile = () => path.join(gameDir(), 'meta.json');

function readMeta() { try { return JSON.parse(fs.readFileSync(metaFile(), 'utf8')); } catch (e) { return {}; } }
function copyVendor() {
  const src = path.join(BUNDLED, 'vendor'), dst = path.join(gameDir(), 'vendor');
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const d = path.join(dst, f), data = fs.readFileSync(path.join(src, f));
    try { if (!fs.existsSync(d) || fs.statSync(d).size !== data.length) fs.writeFileSync(d, data); } catch (e) {}
  }
}
async function updateGame() {
  const meta = readMeta(), ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const headers = meta.etag && fs.existsSync(path.join(gameDir(), 'index.html')) ? { 'If-None-Match': meta.etag } : {};
    const r = await fetch(ONLINE + '?t=' + Date.now(), { signal: ctrl.signal, headers });
    if (r.status === 304) return 'senaste';
    if (!r.ok) return 'fel';
    const html = await r.text();
    if (html.length < 100000 || !html.includes('<script')) return 'fel';
    fs.mkdirSync(gameDir(), { recursive: true });
    copyVendor();
    fs.writeFileSync(path.join(gameDir(), 'index.html'), offlineHtml(html));
    fs.writeFileSync(metaFile(), JSON.stringify({ etag: r.headers.get('etag') || '', at: Date.now() }));
    return 'uppdaterad';
  } catch (e) { return 'offline'; } finally { clearTimeout(timer); }
}
const splash = text => 'data:text/html;charset=utf-8,' + encodeURIComponent(`<!doctype html><meta charset="utf-8"><body style="margin:0;height:100vh;display:grid;place-items:center;background:#141724;color:#fff6e6;font:600 18px system-ui"><div style="text-align:center"><div style="font:900 56px system-ui;color:#ffd23f;letter-spacing:2px">DOSKUNGEN</div><p>${text}</p></div></body>`);

async function createWindow() {
  const win = new BrowserWindow({
    width: 1366, height: 820, minWidth: 960, minHeight: 600, backgroundColor: '#141724', fullscreen: true,
    title: 'Doskungen i Västmyra', icon: path.join(BUNDLED, 'icon.png'), autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, backgroundThrottling: false }
  });
  win.setMenuBarVisibility(false);
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  await win.loadURL(splash('Söker efter senaste versionen…'));
  const status = await updateGame();
  const latest = path.join(gameDir(), 'index.html');
  try { if (fs.existsSync(latest)) { copyVendor(); await win.loadFile(latest); } else await win.loadFile(path.join(BUNDLED, 'index.html')); }
  catch (e) { await win.loadFile(path.join(BUNDLED, 'index.html')); }
  if (status === 'offline') win.setTitle('Doskungen i Västmyra (offline – senast hämtade versionen)');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
