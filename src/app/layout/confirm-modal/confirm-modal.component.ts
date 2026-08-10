import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  // Control de visibilidad dictado por el padre
  @Input() isOpen: boolean = false;

  // Textos personalizables para reutilizar en cualquier parte
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Estás seguro?';

  // Emisores de eventos hacia el padre
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit()
  }
  onCancel() {
    this.cancel.emit();
  }
}
