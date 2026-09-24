import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  session,
  type MessageBoxOptions,
  type MessageBoxReturnValue,
} from 'electron';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const RENDERER_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:* https://localhost:* https://api.example.com; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";

function resolveIndexHtml(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'www', 'index.html');
  }
  return path.join(__dirname, '../../Mobile/www/index.html');
}

/** Recover SPA reloads that landed on .../www/#/route instead of .../www/index.html#/route. */
function loadIndexWithHash(win: BrowserWindow, indexHtml: string, hash = '/'): void {
  const normalized = hash.startsWith('/') ? hash : `/${hash}`;
  void win.loadFile(indexHtml, { hash: normalized });
}

function attachSpaFileProtocolGuards(win: BrowserWindow, indexHtml: string): void {
  const indexUrl = pathToFileURL(indexHtml).href;

  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file:')) {
      return;
    }
    // Reload/navigate hit the www directory (or a non-html path) with a hash route.
    if (url.includes('/www/#') || (url.includes('/www/') && !url.includes('index.html'))) {
      event.preventDefault();
      let hash = '/';
      try {
        hash = new URL(url).hash.replace(/^#/, '') || '/';
      } catch {
        /* keep default */
      }
      loadIndexWithHash(win, indexHtml, hash);
    }
  });

  win.webContents.on('did-fail-load', (_event, _code, _desc, validatedURL) => {
    if (!validatedURL.startsWith('file:')) {
      return;
    }
    if (validatedURL.startsWith(indexUrl)) {
      return;
    }
    let hash = '/';
    try {
      hash = new URL(validatedURL).hash.replace(/^#/, '') || '/';
    } catch {
      /* keep default */
    }
    loadIndexWithHash(win, indexHtml, hash);
  });
}

function createWindow(): void {
  const indexHtml = resolveIndexHtml();
  if (!fs.existsSync(indexHtml)) {
    void dialog.showErrorBox(
      'Missing web build',
      `Could not find ${indexHtml}.\n\nRun: npm run build:mobile:electron`,
    );
    app.quit();
    return;
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  attachSpaFileProtocolGuards(win, indexHtml);
  loadIndexWithHash(win, indexHtml, '/home');
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [RENDERER_CSP],
        'X-Content-Type-Options': ['nosniff'],
      },
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle(
  'desktop-show-message-box',
  async (_event, options: MessageBoxOptions): Promise<MessageBoxReturnValue> => {
    return dialog.showMessageBox(options);
  },
);
