import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  let api: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiClientService],
    });
    api = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('prefixes relative urls with environment.apiUrl', () => {
    api.request({ url: 'users/1', method: 'GET' }).subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('users/1'));
    expect(req.request.method).toBe('GET');
    req.flush({ id: '1' });
  });
});
