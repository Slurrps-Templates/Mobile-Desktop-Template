import { Injectable } from '@angular/core';
import { Dialog } from '@capacitor/dialog';

@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationService {
  async alert(title: string, message: string): Promise<void> {
    await Dialog.alert({ title, message, buttonTitle: 'OK' });
  }
}
