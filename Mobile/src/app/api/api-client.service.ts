import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { joinUrl } from '@app/shared/utils/url.util';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  url: string;
  method: HttpMethod;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  headers?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  request<T>(options: ApiRequestOptions): Observable<T> {
    const url = /^https?:\/\//i.test(options.url)
      ? options.url
      : joinUrl(environment.apiUrl, options.url);

    let params = new HttpParams();
    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        params = params.set(key, String(value));
      }
    }

    let headers = new HttpHeaders();
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        headers = headers.set(key, value);
      }
    }

    return this.http.request<T>(options.method, url, {
      body: options.body,
      headers,
      params,
    });
  }
}
