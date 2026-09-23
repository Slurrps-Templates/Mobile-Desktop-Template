# Mobile + Desktop Template

A skeleton for a fully cross-platform application built on a single shared Angular + Ionic codebase targeting three platforms:

| Platform | Stack | Directory |
|----------|-------|-----------|
| **Web** | Angular + Ionic (browser) | `Mobile/` |
| **Mobile** | Angular + Ionic + Capacitor (Android / iOS) | `Mobile/` |
| **Desktop** | Electron (loads the Ionic web build) | `Desktop/` |

Platform-specific behaviour (e.g. notifications) is routed at runtime by `PlatformService`, which detects the current environment and delegates to the appropriate service implementation each service uses platformservice to determine where to route to such as NotificationService routing to either (`ElectronNotificationService`, `MobileNotificationService`) depending on the platform.

---

This repository includes:

1. Mobile/Web app in `Mobile/` (Angular + Ionic + Capacitor)
2. Desktop app in `Desktop/` (Electron shell)

## Prerequisites

1. Install Node.js and npm
2. Install Ionic CLI globally:

```bash
npm install -g @ionic/cli
```

3. For Android builds:
	- Android Studio
	- Android SDK
	- Java 17+

## Install Dependencies

1. Install mobile dependencies:

```bash
cd Mobile
npm install
```

2. Install desktop dependencies:

```bash
cd ../Desktop
npm install
```

## Run Desktop App

1. Build the Ionic app for Electron file loading:

```bash
cd ../Mobile
ionic build -- --base-href ./ --deploy-url ./
```

2. Start Electron:

```bash
cd ../Desktop
npm start
```

## Debug Desktop App

1. Rebuild web assets after mobile code changes:

```bash
cd ../Mobile
ionic build -- --base-href ./ --deploy-url ./
```

2. Relaunch Electron:

```bash
cd ../Desktop
npm start
```

3. Open Electron DevTools:
	- `Ctrl+Shift+I` on Linux/Windows
	- Menu: `View -> Toggle Developer Tools`

### Desktop Troubleshooting

If the window is blank/black:

1. Confirm `Desktop/main.js` loads `../Mobile/www/index.html`
2. Confirm the mobile build used `--base-href ./ --deploy-url ./`

## Run Mobile App (Browser)

```bash
cd Mobile
ionic serve
```

## Build and Run Mobile App (Android)

1. Build web assets:

```bash
cd Mobile
ionic build
```

2. Add Android platform (first time only):

```bash
npx cap add android
```

```bash
export CAPACITOR_ANDROID_STUDIO_PATH="$HOME/Documents/Applications/android-studio/bin/studio.sh"
```

3. Sync assets into native Android project:

```bash
npx cap sync android
```

4. Open in Android Studio:

```bash
source ~/.bashrc
echo "$CAPACITOR_ANDROID_STUDIO_PATH"
npx cap open android
```

## Debug Mobile App

### Browser Debug

1. Run `ionic serve`
2. Use browser DevTools

### Android Debug

1. Open Android Studio with `npx cap open android`
2. Run on emulator/device
3. Use Logcat and Chrome remote debugging for WebView

## Package Desktop App

1. Build mobile web assets for Electron first:

```bash
cd ../Mobile
ionic build -- --base-href ./ --deploy-url ./
```

2. Package Electron app:

```bash
cd ../Desktop
npm run package
```

3. Find packaged output in `Desktop/out` (or `Desktop/out/make` depending on maker).

## Package Mobile App (Android)

### Option 1: Build from Android Studio (recommended)

1. Build and sync web assets:

```bash
cd Mobile
ionic build
npx cap sync android
```

2. Open Android Studio:

```bash
npx cap open android
```

3. In Android Studio:
	- For APK: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
	- For Play Store: `Build > Generate Signed Bundle / APK > Android App Bundle`

### Option 2: Build from CLI with Gradle

1. Build and sync web assets:

```bash
cd Mobile
ionic build
npx cap sync android
```

2. Build debug APK:

```bash
cd android
./gradlew assembleDebug
```

3. Build release AAB:

```bash
./gradlew bundleRelease
```

4. Output locations:
	- Debug APK: `Mobile/android/app/build/outputs/apk/debug/`
	- Release AAB: `Mobile/android/app/build/outputs/bundle/release/`

## Adding Cross-Platform Services

This template uses a **delegate pattern** — a single shared service routes calls to platform-specific implementations at runtime. Follow these steps to add a new cross-platform capability (e.g. storage, file access, share sheet).

### 1. Create the platform-specific implementations

**`Mobile/src/app/services/MyService/ElectronMy.Service.ts`** — Electron behaviour, communicating with the main process via IPC:

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ElectronMyService {
  async doSomething(value: string): Promise<void> {
    if (!window.electronApi) throw new Error('electronApi bridge is not available');
    await window.electronApi.doSomething(value);
  }
}
```

**`Mobile/src/app/services/MyService/MobileMy.Service.ts`** — Mobile/web behaviour using Capacitor plugins or Angular APIs:

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MobileMyService {
  async doSomething(value: string): Promise<void> {
    // e.g. use a Capacitor plugin or browser API
  }
}
```

### 2. Create the shared facade service

**`Mobile/src/app/services/MyService/My.Service.ts`** — injects `PlatformService` and delegates to the right implementation:

```typescript
import { Injectable } from '@angular/core';
import { PlatformService } from '../platform.service';
import { ElectronMyService } from './ElectronMy.Service';
import { MobileMyService } from './MobileMy.Service';

@Injectable({ providedIn: 'root' })
export class MyService {
  constructor(
    private platformService: PlatformService,
    private electron: ElectronMyService,
    private mobile: MobileMyService
  ) {}

  async doSomething(value: string): Promise<void> {
    switch (this.platformService.getPlatform()) {
      case 'electron':
        await this.electron.doSomething(value);
        return;
      default:
        await this.mobile.doSomething(value);
        return;
    }
  }
}
```

`getPlatform()` returns one of: `'electron'` | `'android'` | `'ios'` | `'capacitor'` | `'cordova'` | `'hybrid'` | `'web'` | `'unknown'`

The `default` branch handles all mobile and web targets.

### 3. Expose the IPC handler in Electron (if needed)

If the Electron implementation needs main-process APIs (filesystem, dialogs, etc.), add a handler in **`Desktop/main.js`**:

```javascript
ipcMain.handle('desktop-do-something', async (_event, value) => {
  // use Node.js / Electron APIs here
});
```

Then expose it through the preload bridge in **`Desktop/preload.cjs`**:

```javascript
contextBridge.exposeInMainWorld('electronApi', {
  // ...existing entries...
  doSomething: (value) => ipcRenderer.invoke('desktop-do-something', value),
});
```

### 4. Inject the facade service in your component

```typescript
constructor(private myService: MyService) {}

async handleAction(): Promise<void> {
  await this.myService.doSomething('hello');
}
```

Only ever inject the shared facade (`MyService`) in components — never the platform-specific implementations directly.

---

## Useful Paths

1. Mobile source: `Mobile/src`
2. Mobile web build: `Mobile/www`
3. Electron main process: `Desktop/main.js`
4. Electron preload script: `Desktop/preload.cjs`