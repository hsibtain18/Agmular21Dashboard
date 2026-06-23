import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Single source of truth for session state.
  // signal() instead of BehaviorSubject — no subscription, no pipe, no takeUntil.
  readonly isLoggedIn = signal(false);

  // Optional: persist session across hard reloads.
  // In a real app this would read a JWT/cookie; here it checks localStorage.
  constructor() {
    const persisted = typeof localStorage !== 'undefined'
      && localStorage.getItem('pulse_session') === 'active';
    if (persisted) this.isLoggedIn.set(true);
  }

  login(): void {
    this.isLoggedIn.set(true);
    localStorage.setItem('pulse_session', 'active');
  }

  logout(): void {
    this.isLoggedIn.set(false);
    localStorage.removeItem('pulse_session');
  }
}