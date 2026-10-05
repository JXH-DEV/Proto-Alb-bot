# Asistenti Digjital

Albanian-language chat assistant for syntax (kryefjala, kallëzuesi, përcaktori, kundrinori, rrethanori).
Fully offline: no CDN, no network calls.

| Path | Purpose |
|---|---|
| `src/data.js` | All chat text (grammar content, quotes, glossary) — edit grammar here |
| `src/engine.js` | Conversation logic (pure functions, unit-tested) |
| `src/app.js`, `src/index.html`, `src/input.css` | UI |
| `www/` | Built app (output of `npm run build`) — open `www/index.html` or deploy this folder |
| `android/` | Capacitor Android project |
| `dist/` | Built APKs |
| `_original/index.html` | The original single-file version |

## Commands
```
npm install
npm test            # unit tests
npm run build       # builds www/
npm run serve       # http://127.0.0.1:5173
```

## Rebuild the APK (Windows)
Needs JDK 21 and the Android SDK (platform 36). After `npm run build && npx cap sync android`:
```
cd android
set JAVA_HOME=<path to JDK 21>
gradlew assembleDebug assembleRelease
```
Release signing reads `keystore.properties` + `release.keystore` in the project root.
**Back up both files and never commit them** — without them you cannot publish updates that install over the old app.
