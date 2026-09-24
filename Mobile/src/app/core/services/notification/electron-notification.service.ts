import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ElectronNotificationService {
  async alert(type: string, message: string): Promise<void> {
    if (!window.electronApi) {
      throw new Error('electronApi bridge is not available');
    }

    await window.electronApi.showMessageBox({
      type: type.toLowerCase(),
      title: type,
      message,
    });
  }
}
