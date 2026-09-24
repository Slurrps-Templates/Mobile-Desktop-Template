import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular';
import { NotificationService } from 'src/app/services/NotificationService/notification.service';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  platform = 'detecting...';

  constructor(
    public notificationService: NotificationService,
    private platformService: PlatformService,
  ) {
    this.platform = this.platformService.getPlatform();
  }

  async showPlatformNotification(): Promise<void> {
    await this.notificationService.alert('Info', `Current platform is ${this.platform}`);
  }
}
