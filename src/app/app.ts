import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './layout/toast/toast.component';

/*
 * Root component of the application.
 * Renders the active route through the RouterOutlet and globally mounts
 * the Toast component so notifications can be shown from any page.
 */
@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('gym-crud');
}
