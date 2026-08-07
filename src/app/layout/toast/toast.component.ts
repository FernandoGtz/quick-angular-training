import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  // Inyectamos el servicio
  public toastService = inject(ToastService);
}
