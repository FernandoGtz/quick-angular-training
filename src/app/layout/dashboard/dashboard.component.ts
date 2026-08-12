import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { IconComponent } from '../icon/icon.component';
import Dumbbell from 'lucide/dist/esm/icons/dumbbell.mjs';
import ListChecks from 'lucide/dist/esm/icons/list-checks.mjs';
import LogOut from 'lucide/dist/esm/icons/log-out.mjs';
import Menu from 'lucide/dist/esm/icons/menu.mjs';
import Users from 'lucide/dist/esm/icons/users.mjs';
import X from 'lucide/dist/esm/icons/x.mjs';

/*
 * Dashboard layout component.
 * Provides the authenticated shell of the application: a responsive
 * sidebar navigation, a filter bar, and the RouterOutlet that renders
 * the child routes. Also handles the logout action.
 */
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, FilterBarComponent, IconComponent,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  // Inject the service to handle the logout
  private authService = inject(AuthService);
  private router = inject(Router);

  public isSidebarOpen: boolean = false;

  /* Icon references exposed to the template. */
  protected readonly icons = {
    Dumbbell,
    ListChecks,
    LogOut,
    Menu,
    Users,
    X,
  } as const;

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
