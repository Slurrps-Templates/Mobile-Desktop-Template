# Mobile + Desktop Template

A cross-platform application template: one Angular + Ionic UI for web, Capacitor (Android/iOS), and Electron desktop.

| Platform | Stack | Directory |
|----------|-------|-----------|
| **Web** | Angular + Ionic | `Mobile/` |
| **Mobile** | Angular + Ionic + Capacitor | `Mobile/` |
| **Desktop** | Electron shell loading `Mobile/www` | `Desktop/` |

Platform behaviour is routed by `PlatformService` (Electron is detected via `window.electronApi`). Facades such as `NotificationService` delegate to Electron or Capacitor implementations.

**App ID:** `com.mobiledesktop.template` · **Name:** Mobile Desktop Template

---

## Prerequisites

- Node.js `^22.22.3` (Angular 22)
- npm (workspaces)
- Android Studio, Android SDK, JDK 17+ (for APK builds)

Install from the **repo root** only (do not run `npm install` inside `Desktop/` — there is no workspace-local lockfile):

```bash
npm install
```

iOS: on a Mac, `npx cap add ios --workspace=Mobile` then sync.

---

## Project layout (`Mobile/src/app`)

```text
core/           # singletons: platform, logger, auth, storage, notification, guards, interceptors
shared/         # utils + shared components
features/       # feature pages (e.g. home)
api/            # ApiClientService + feature API services
stores/         # signal stores (e.g. auth.store)
interfaces/     # models + electronApi typings (global.d.ts)
```

Files marked `// EXAMPLE — replace with your app logic` are stubs meant to be replaced.

Path alias: `@app/*` → `src/app/*`.

---

## Scripts (repo root)

| Goal | Command |
|------|---------|
| Dev browser | `npm run start:mobile` |
| Dev desktop | `npm run start:desktop` (builds mobile with electron config, then Electron) |
| Format | `npm run format` / `format:mobile` / `format:desktop` |
| Build | `npm run build:mobile` / `build:mobile:electron` / `build:desktop` |
| Package | `npm run package:mobile` / `package:desktop` |
| Lint / test | `npm run lint:mobile` / `test:mobile` (requires Chrome; set `CHROME_BIN` if needed) |

- **`package:mobile`** — `ng build && cap sync` (does not produce an APK).
- **`package:desktop`** — electron web build + Forge package (`Mobile/www` copied as `extraResource`).
- **`build:mobile:electron`** — production build with `baseHref: ./` for `file://`.

---

## Development

### Electron API bridge

```text
Angular → window.electronApi → Desktop/src/preload.ts → Desktop/src/main.ts → Electron APIs
```

1. Add `ipcMain.handle` in `Desktop/src/main.ts`
2. Expose on `electronApi` in `Desktop/src/preload.ts`
3. Extend `IElectronAPI` in `Mobile/src/app/interfaces/global.d.ts`

### Capacitor (web + mobile)

Use Capacitor plugins in the Capacitor service implementation (see `capacitor-notification.service.ts`). No preload bridge.

### Cross-platform services

Under `core/services/<feature>/`: facade + `electron-*.service.ts` + `capacitor-*.service.ts`. Facade switches on `PlatformService.getPlatform()`.

### API calls

Use `ApiClientService.request({ url, method, params, body, headers })`. Add feature APIs under `api/` (see `example-api.service.ts`). Do not call `HttpClient` from pages.

### Auth stubs (examples)

- `AuthStore` (signals), `AuthService`, `authGuard` / `guestGuard`, `authInterceptor` / `errorInterceptor`
- Guards are **not** applied to home by default; wire with `canActivate: [authGuard]` in `app.routes.ts`

### Secrets

Environments hold **public** config only (`apiUrl`, flags). Do not put API secrets in the client. Use auth tokens + a backend for private data.

### CSP

CSP is set in `index.html`, `ng serve` headers (`angular.json`), and Electron session headers. Adjust `connect-src` when changing `apiUrl`.

---

## Dev / test

**Browser:** `npm run start:mobile` → http://localhost:4200

**Desktop:** `npm run start:desktop` → DevTools `Ctrl+Shift+I`

Routing uses **hash URLs** (`index.html#/home`) so Electron/Capacitor `file://` reloads keep working.

**Android:** `npm run package:mobile` then `npx cap open android --workspace=Mobile`

---

## Package Android APK

```bash
npm run package:mobile
npx cap open android --workspace=Mobile
```

Android Studio: **Build → Build APK(s)** or signed bundle. Or `cd Mobile/android && ./gradlew assembleDebug`.

---

## Package Desktop

```bash
npm run package:desktop
```

Output under `Desktop/out`. Packaged apps load `resources/www/index.html`.

---

## Useful paths

| Path | Purpose |
|------|---------|
| `Mobile/src/app` | App source (core / features / api) |
| `Mobile/src/app/interfaces/global.d.ts` | `window.electronApi` types |
| `Mobile/www` | Web build output |
| `Mobile/android` | Capacitor Android project |
| `Desktop/src/main.ts` | Electron main / IPC |
| `Desktop/src/preload.ts` | Preload bridge |
| `Desktop/dist` | Compiled Electron |
