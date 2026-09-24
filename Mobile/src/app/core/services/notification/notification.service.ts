import { Injectable, inject } from '@angular/core';
import { ElectronNotificationService } from './electron-notification.service';
import { CapacitorNotificationService } from './capacitor-notification.service';
import { PlatformService } from '../platform.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly platformService = inject(PlatformService);
  private readonly electron = inject(ElectronNotificationService);
  private readonly capacitor = inject(CapacitorNotificationService);

  async alert(type: string, message: string): Promise<void> {
    switch (this.platformService.getPlatform()) {
      case 'electron':
        await this.electron.alert(type, message);
        return;
      default:
        await this.capacitor.alert(type, message);
        return;
    }
  }
}
