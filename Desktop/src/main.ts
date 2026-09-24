import { app, BrowserWindow, ipcMain, dialog, type MessageBoxOptions } from 'electron';
import path from 'path';

function createWindow(): void {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Compiled output lives in Desktop/dist — Mobile/www is two levels up from there.
  win.loadFile(path.join(__dirname, '../../Mobile/www/index.html'));
}

app.whenReady().then(() => {
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

ipcMain.handle('desktop-show-message-box', async (_event, options: MessageBoxOptions) => {
  await dialog.showMessageBox(options);
});

// Add more methods here for the electronApi bridge so that Angular can use them
// Example:
// ipcMain.handle('desktop-show-message-box', async (_event, options: MessageBoxOptions) => {
//   await dialog.showMessageBox(options);
// });