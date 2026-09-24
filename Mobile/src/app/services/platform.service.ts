import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private detectedPlatform:
    'electron' | 'android' | 'ios' | 'capacitor' | 'cordova' | 'hybrid' | 'web' | 'unknown' =
    'unknown';

  constructor(private platform: Platform) {}

  async init(): Promise<void> {
    await this.platform.ready();

    if (this.platform.is('electron')) {
      this.detectedPlatform = 'electron';
    } else if (this.platform.is('android')) {
      this.detectedPlatform = 'android';
    } else if (this.platform.is('ios')) {
      this.detectedPlatform = 'ios';
    } else if (this.platform.is('capacitor')) {
      this.detectedPlatform = 'capacitor';
    } else if (this.platform.is('cordova')) {
      this.detectedPlatform = 'cordova';
    } else if (this.platform.is('hybrid')) {
      this.detectedPlatform = 'hybrid';
    } else if (
      this.platform.is('desktop') ||
      this.platform.is('mobileweb') ||
      this.platform.is('pwa')
    ) {
      this.detectedPlatform = 'web';
    } else {
      this.detectedPlatform = 'unknown';
    }

    console.log('[PlatformService] Running on:', this.detectedPlatform);
  }

  getPlatforms(): string[] {
    return [this.detectedPlatform];
  }

  getPlatform(): string {
    return this.detectedPlatform;
  }

  is(platformName: string): boolean {
    return this.detectedPlatform === platformName;
  }
}
