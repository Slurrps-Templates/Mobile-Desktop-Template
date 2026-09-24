// EXAMPLE — replace with your app logic
import { Injectable, inject } from '@angular/core';
import { AuthStore } from '@app/stores/auth.store';
import { StorageService } from './storage.service';
import type { User } from '@app/interfaces/user.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(AuthStore);
  private readonly storage = inject(StorageService);

  async restoreSession(): Promise<void> {
    const token = await this.storage.get(TOKEN_KEY);
    const rawUser = await this.storage.get(USER_KEY);
    if (!token || !rawUser) {
      return;
    }
    try {
      const user = JSON.parse(rawUser) as User;
      this.store.setSession(user, token);
    } catch {
      await this.logout();
    }
  }

  /** Stub login — replace with a real API call via a feature API service. */
  async login(email: string, password: string): Promise<void> {
    void password;
    const user: User = { id: 'example-user', email, displayName: 'Example User' };
    const token = 'example-token';
    await this.storage.set(TOKEN_KEY, token);
    await this.storage.set(USER_KEY, JSON.stringify(user));
    this.store.setSession(user, token);
  }

  async logout(): Promise<void> {
    await this.storage.remove(TOKEN_KEY);
    await this.storage.remove(USER_KEY);
    this.store.clearSession();
  }

  getToken(): string | null {
    return this.store.token();
  }

  isAuthenticated(): boolean {
    return this.store.isAuthenticated();
  }
}
