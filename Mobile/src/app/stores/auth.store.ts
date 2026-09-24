// EXAMPLE — replace with your app logic
import { computed, Injectable, signal } from '@angular/core';
import type { User } from 'src/app/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly userSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  setSession(user: User, token: string): void {
    this.userSignal.set(user);
    this.tokenSignal.set(token);
  }

  clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
  }
}
