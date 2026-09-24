//Defines the interface for the Electron API bridge and extends the Window object to include it.
export interface IElectronAPI {
  showMessageBox: (options: { type: string; title: string; message: string }) => Promise<void>;

  // Add more methods here for the electronApi bridge so that Angular can use them
  // Example:
  // showMessageBox: (options: { type: string; title: string; message: string }) => Promise<void>;
}

//Declares the global Window interface to include the optional Electron API bridge.
//Used to declare the desktop API available on the window object in an Electron environment.
declare global {
  interface Window {
    electronApi?: IElectronAPI;
  }
}
