# Doskungen i Västmyra

Ett svenskt förstapersonsspel om att odla, smaksätta och packa egna (påhittade) koffeinpåsar i den lilla staden Västmyra.
Spela direkt i webbläsaren eller ladda ned som Windows-app. Co-op för upp till 4 spelare.

- **Spela:** `https://<ditt-namn>.github.io/<repo>/spel/`
- **Startsida:** `https://<ditt-namn>.github.io/<repo>/`
- **Windows:** under *Releases* → `Doskungen-Setup.exe` eller `Doskungen-Portabel.exe`

## Så publicerar du (första gången, ca 10 minuter)

1. Skapa ett nytt **publikt** repo på github.com (t.ex. `doskungen`).
2. Ladda upp allt i den här mappen – även de dolda `.github` och `.nojekyll`.
   Enklast: *Add file → Upload files* och dra in hela innehållet, eller använd GitHub Desktop.
3. **Startsidan:** *Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.*
   Efter en minut ligger sidan på `https://<ditt-namn>.github.io/<repo>/`.
4. **Windows-appen:** *Actions → "Bygg Windows-app" → Run workflow.* Efter ca 5–8 minuter finns en ny release
   med `.exe`-filerna, och knappen "Ladda ned för Windows" på startsidan fungerar.

## Uppdatera spelet

Byt ut `spel/index.html` mot den nya spelfilen och committa. Startsidan uppdateras direkt.
Kör sedan "Bygg Windows-app" igen för en ny Windows-version (eller pusha en tagg som `v1.2.0`).

## Multiplayer

- På claude.ai används claude.ai:s egna rum.
- På GitHub Pages och i Windows-appen används WebRTC via PeerJS: den som skapar lobbyn blir värd,
  de andra går med med koden på fyra tecken. Kräver internet. Webbläsare och app kan spela ihop.
- Max 4 spelare per lobby. Om värden lämnar stängs lobbyn.

## Bygga Windows-appen på egen dator

Installera [Node.js LTS](https://nodejs.org), gå till mappen `windows` och dubbelklicka på `BYGG.bat`.
Filerna hamnar i `windows/dist`.

## Struktur

```
index.html            startsida (GitHub Pages)
spel/index.html       hela spelet i en fil
windows/              Electron-app: main.js, prepare.js (gör spelet offline), package.json
.github/workflows/    bygger Windows-appen och skapar en release
```

Allt i spelet är fiktivt: inga riktiga märken, ingen nikotin.
