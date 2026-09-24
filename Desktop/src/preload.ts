import { contextBridge, ipcRenderer, type MessageBoxOptions } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
  showMessageBox: (options: MessageBoxOptions) =>
    ipcRenderer.invoke('desktop-show-message-box', options),
});
