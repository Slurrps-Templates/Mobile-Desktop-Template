import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoggerService } from './logger.service';

export type AppPlatform =
  'electron' | 'android' | 'ios' | 'capacitor' | 'cordova' | 'hybrid' | 'web' | 'unknown';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private detectedPlatform: AppPlatform = 'unknown';
  private readonly platform = inject(Platform);
  private readonly logger = inject(LoggerService);

  async init(): Promise<void> {
    await this.platform.ready();

    // Prefer the Electron preload bridge — Ionic may not expose an 'electron' platform.
    if (typeof window !== 'undefined' && window.electronApi) {
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

    this.logger.info('Running on platform:', this.detectedPlatform);
  }

  getPlatforms(): AppPlatform[] {
    return [this.detectedPlatform];
  }

  getPlatform(): AppPlatform {
    return this.detectedPlatform;
  }

  is(platformName: AppPlatform | string): boolean {
    return this.detectedPlatform === platformName;
  }
}
