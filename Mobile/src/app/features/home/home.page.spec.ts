import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { PlatformService } from '@app/core/services/platform/platform.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        {
          provide: NotificationService,
          useValue: { alert: jasmine.createSpy('alert').and.resolveTo() },
        },
        {
          provide: PlatformService,
          useValue: { getPlatform: () => 'web' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
