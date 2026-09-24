import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { PlatformService } from '@app/core/services/platform/platform.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  private readonly notificationService = inject(NotificationService);
  private readonly platformService = inject(PlatformService);

  platform = this.platformService.getPlatform();

  async showPlatformNotification(): Promise<void> {
    await this.notificationService.alert('Info', `Current platform is ${this.platform}`);
  }
}
