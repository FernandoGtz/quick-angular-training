import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaz para definir la forma de tu estado
export interface ToastState {
  show: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Iniciamos el estado oculto y vacío
  private state = new BehaviorSubject<ToastState>({ show: false, message: '' });

  // Exponemos el estado como un observable para que el componente lo lea
  public state$ = this.state.asObservable();

  showToast(message: string) {
    // Actualizamos el estado para mostrar el mensaje
    this.state.next({ show: true, message });

    // Implementamos la limpieza automática
    setTimeout(() => {
      // Regresamos el estado a oculto, vaciando el mensaje
      this.state.next({ show: false, message: '' });
    }, 5000); // 3 segundos
  }
}
