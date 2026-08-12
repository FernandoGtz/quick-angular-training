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

  /*
   * Shows a toast with the given message.
   * Updates the state to display the message and schedules an automatic
   * cleanup that hides the toast again after five seconds.
   */
  showToast(message: string) {
    // Update the state to show the message
    this.state.next({ show: true, message });

    // Implement the automatic cleanup
    setTimeout(() => {
      // Return the state to hidden, emptying the message
      this.state.next({ show: false, message: '' });
    }, 5000);
  }
}
