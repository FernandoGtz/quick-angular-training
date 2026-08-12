import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import Trash2 from 'lucide/dist/esm/icons/trash-2.mjs';

/*
 * Confirm modal component.
 * Reusable confirmation dialog controlled by its parent. Visibility,
 * title and message are provided through inputs, and the confirm/cancel
 * actions are emitted back to the parent for handling.
 */
@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
  // Visibility control dictated by the parent
  @Input() isOpen: boolean = false;

  // Customizable texts to reuse it anywhere
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Estás seguro?';

  // Event emitters towards the parent
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /* Exposed icon reference for the template. */
  protected readonly Trash2 = Trash2;

  /* Emits the confirm event to the parent. */
  onConfirm() {
    this.confirm.emit()
  }

  /* Emits the cancel event to the parent. */
  onCancel() {
    this.cancel.emit();
  }
}
