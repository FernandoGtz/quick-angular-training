import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { AsyncPipe } from '@angular/common';

/*
 * Toast component.
 * Renders the global notification message by subscribing to the
 * ToastService state. It uses OnPush change detection and an AsyncPipe
 * to keep the view in sync with the reactive state.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  // Inject the service
  public toastService = inject(ToastService);
}
