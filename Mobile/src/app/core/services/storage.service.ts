// EXAMPLE — replace with your app logic
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Thin key/value storage. Uses Capacitor Preferences on native;
 * falls back to localStorage in the browser / Electron renderer.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  async get(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      return localStorage.getItem(key);
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({ key, value });
    } catch {
      localStorage.setItem(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {
      localStorage.removeItem(key);
    }
  }
}
