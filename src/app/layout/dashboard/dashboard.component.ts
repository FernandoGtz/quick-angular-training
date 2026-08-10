import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FilterBarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // Inyectamos el servicio para emplear el cierre de sesión
  private authService = inject(AuthService);
  private router = inject(Router);

  public isSidebarOpen: boolean = false;

  // Metodo para el cierre de sesión
  async logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Cierra el sidebar si se redimensiona a desktop
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth >= 1024) {
      this.isSidebarOpen = false;
    }
  }
}
