export interface IElectronAPI {
    showMessageBox: (options: {
      type: string;
      title: string;
      message: string;
    }) => Promise<{ response: number } | void>;
  }

//Declares the global Window interface to include the optional Electron API bridge.
declare global {
    interface Window {
      electronApi?: IElectronAPI;
    }
  }
  
export {};