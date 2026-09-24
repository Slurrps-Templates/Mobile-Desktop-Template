import { Injectable } from '@angular/core';
import { ElectronNotificationService } from './electronNotification.service';
import { MobileNotificationService } from './capacitorNotification.service';
import { PlatformService } from '../platform.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private platformService: PlatformService,
    private electron: ElectronNotificationService,
    private mobile: MobileNotificationService,
  ) {}

  async alert(type: string, message: string): Promise<void> {
    switch (this.platformService.getPlatform()) {
      case 'electron':
        await this.electron.alert(type, message);
        return;

      default:
        await this.mobile.alert(type, message);
        return;
    }
  }
}
