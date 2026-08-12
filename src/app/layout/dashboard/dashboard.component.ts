import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';

/*
 * Dashboard layout component.
 * Provides the authenticated shell of the application: a responsive
 * sidebar navigation, a filter bar, and the RouterOutlet that renders
 * the child routes. Also handles the logout action.
 */
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FilterBarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // Inject the service to handle the logout
  private authService = inject(AuthService);
  private router = inject(Router);

  public isSidebarOpen: boolean = false;

  /*
   * Logs the user out and redirects to the login page.
   */
  async logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  /* Toggles the sidebar visibility (mobile). */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /* Closes the sidebar. */
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  /*
   * Closes the sidebar when the window is resized to desktop width.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth >= 1024) {
      this.isSidebarOpen = false;
    }
  }
}
