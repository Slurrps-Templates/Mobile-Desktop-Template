import { Injectable } from '@angular/core';
import { Dialog } from '@capacitor/dialog';

@Injectable({
  providedIn: 'root',
})
export class MobileNotificationService {
  async alert(title: string, message: string) {
    await Dialog.alert({ title, message, buttonTitle: 'OK' });
  }
}
