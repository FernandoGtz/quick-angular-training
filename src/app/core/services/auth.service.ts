import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

/*
 * Authentication service.
 * Wraps the Firebase Auth API to expose the current user state as an
 * observable and provides methods to sign in and sign out.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  /* Observable that emits the currently authenticated user or null. */
  public authState$: Observable<User | null> = authState(this.auth);

  /*
   * Signs a user in with email and password credentials.
   * Returns a promise that resolves with the Firebase credentials.
   */
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /*
   * Signs out the current authenticated user.
   * Returns a promise that resolves when the session is closed.
   */
  async logout() {
    return signOut(this.auth);
  }
}
