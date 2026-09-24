import { contextBridge, ipcRenderer, type MessageBoxOptions } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
  showMessageBox: (options: MessageBoxOptions) =>
    ipcRenderer.invoke('desktop-show-message-box', options),
});

// Add more methods here for the electronApi bridge so that Angular can use them
// Example:
// contextBridge.exposeInMainWorld('electronApi', {
//   showMessageBox: (options: MessageBoxOptions) =>
//     ipcRenderer.invoke('desktop-show-message-box', options),
// });
