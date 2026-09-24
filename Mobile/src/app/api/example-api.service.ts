// EXAMPLE — replace with your app logic
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import type { ApiResponse } from '@app/interfaces/api-response.model';
import type { User } from '@app/interfaces/user.model';

/** Example feature API — call ApiClientService from here, not from pages. */
@Injectable({ providedIn: 'root' })
export class ExampleApiService {
  private readonly api = inject(ApiClientService);

  getProfile(userId: string): Observable<ApiResponse<User>> {
    return this.api.request<ApiResponse<User>>({
      url: `users/${userId}`,
      method: 'GET',
    });
  }
}
