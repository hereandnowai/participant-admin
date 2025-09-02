import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Participant Admin');
  protected readonly brand = environment.brand;

  constructor(private router: Router) {}

  /**
   * Check if the current route is active
   */
  isRouteActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  /**
   * Navigate to a specific route
   */
  navigateTo(route: string): void {
    // debug log to verify click handlers are firing
    // and use navigateByUrl for clearer navigation semantics
    console.log('[App] navigateTo', route);
    this.router.navigateByUrl(route).catch(err => {
      console.error('[App] navigation error', err);
    });
  }
}
