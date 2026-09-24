import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ElectronNotificationService } from './electron-notification.service';
import { CapacitorNotificationService } from './capacitor-notification.service';
import { PlatformService } from '../platform/platform.service';

describe('NotificationService', () => {
  it('routes to electron implementation on electron platform', async () => {
    const electron = { alert: jasmine.createSpy('electronAlert').and.resolveTo() };
    const capacitor = { alert: jasmine.createSpy('capacitorAlert').and.resolveTo() };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ElectronNotificationService, useValue: electron },
        { provide: CapacitorNotificationService, useValue: capacitor },
        { provide: PlatformService, useValue: { getPlatform: () => 'electron' } },
      ],
    });

    await TestBed.inject(NotificationService).alert('Info', 'hello');
    expect(electron.alert).toHaveBeenCalledWith('Info', 'hello');
    expect(capacitor.alert).not.toHaveBeenCalled();
  });

  it('routes to capacitor implementation by default', async () => {
    const electron = { alert: jasmine.createSpy('electronAlert').and.resolveTo() };
    const capacitor = { alert: jasmine.createSpy('capacitorAlert').and.resolveTo() };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ElectronNotificationService, useValue: electron },
        { provide: CapacitorNotificationService, useValue: capacitor },
        { provide: PlatformService, useValue: { getPlatform: () => 'web' } },
      ],
    });

    await TestBed.inject(NotificationService).alert('Info', 'hello');
    expect(capacitor.alert).toHaveBeenCalledWith('Info', 'hello');
    expect(electron.alert).not.toHaveBeenCalled();
  });
});
