import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*
 * Interface that defines the shape of the toast state.
 */
export interface ToastState {
  show: boolean;
  message: string;
}

/*
 * Toast notification service.
 * Keeps a reactive state holding the current message and visibility,
 * so any component can trigger a temporary on-screen notification
 * that auto-hides after a few seconds.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // The state starts hidden and empty
  private state = new BehaviorSubject<ToastState>({ show: false, message: ' ' });

  // Expose the state as an observable so the component can read it
  public state$ = this.state.asObservable();

  /* Reference to the pending auto-hide timeout, if any. */
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  /*
   * Shows a toast with the given message.
   * Updates the state to display the message and schedules an automatic
   * cleanup that hides the toast again after five seconds. If a toast is
   * already visible, the previous timeout is cancelled so the new message
   * is not hidden prematurely.
   */
  showToast(message: string) {
    // Cancel any pending auto-hide so the new toast gets its full duration
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Update the state to show the message
    this.state.next({ show: true, message });

    // Implement the automatic cleanup
    this.hideTimeout = setTimeout(() => {
      // Return the state to hidden, emptying the message
      this.state.next({ show: false, message: '' });
      this.hideTimeout = null;
    }, 5000);
  }
}
