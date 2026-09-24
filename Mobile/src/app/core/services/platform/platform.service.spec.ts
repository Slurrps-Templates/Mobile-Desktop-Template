import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformService } from './platform.service';
import { LoggerService } from '../logger.service';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlatformService,
        { provide: LoggerService, useValue: { info: () => undefined, debug: () => undefined } },
        {
          provide: Platform,
          useValue: {
            ready: () => Promise.resolve(),
            is: () => false,
          },
        },
      ],
    });
    service = TestBed.inject(PlatformService);
  });

  it('detects electron when electronApi is present', async () => {
    (window as Window).electronApi = {
      showMessageBox: async () => undefined,
    };
    await service.init();
    expect(service.getPlatform()).toBe('electron');
    delete (window as Window).electronApi;
  });
});
