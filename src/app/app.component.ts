import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { UserProfile } from './models/auth.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  items: MenuItem[] = [];
  userProfile: UserProfile | null = null;
  isAuthenticated = false;
  showLayout = true; // Controls visibility of sidebar and header

  // Public routes that should not show the main layout
  private publicRoutes = ['/login', '/access-denied'];

  ngOnInit() {
    // Subscribe to authentication state
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.buildNavigation();
      }
    });

    // Subscribe to user profile
    this.authService.userProfile$.subscribe(profile => {
      this.userProfile = profile;
    });

    // Check current route on init
    this.checkRoute(this.router.url);

    // Subscribe to route changes to show/hide layout
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string): void {
    // Check if it's the root path (Home Page)
    if (url === '/' || url === '') {
      this.showLayout = false;
      return;
    }

    // Check other public routes (prefix match, e.g. /login, /access-denied)
    this.showLayout = !this.publicRoutes.some(route => url.startsWith(route));
  }

  private buildNavigation(): void {
    const isAdmin = this.authService.isAdmin();
    const hasProcurement = this.authService.hasProcurementAccess();
    const hasProduction = this.authService.hasProductionAccess();
    const hasDelivery = this.authService.hasDeliveryAccess();

    this.items = [
      // Dashboard - always visible for authenticated users
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      }
    ];

    // User Management - Admin only
    if (isAdmin) {
      this.items.push({
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users'
      });
    }

    // Production Module
    if (hasProduction) {
      this.items.push(
        {
          label: 'Products',
          icon: 'pi pi-box',
          routerLink: '/products'
        },
        {
          label: 'Production Orders',
          icon: 'pi pi-cog',
          routerLink: '/production-orders'
        },
        {
          label: 'Bill of Materials',
          icon: 'pi pi-list',
          routerLink: '/bom'
        }
      );
    }

    // Procurement Module
    if (hasProcurement) {
      this.items.push(
        {
          label: 'Suppliers',
          icon: 'pi pi-building',
          routerLink: '/suppliers'
        },
        {
          label: 'Raw Materials',
          icon: 'pi pi-database',
          routerLink: '/raw-materials'
        },
        {
          label: 'Supply Orders',
          icon: 'pi pi-shopping-cart',
          routerLink: '/supply-orders'
        }
      );
    }

    // Delivery Module
    if (hasDelivery) {
      this.items.push(
        {
          label: 'Customers',
          icon: 'pi pi-id-card',
          routerLink: '/customers'
        },
        {
          label: 'Customer Orders',
          icon: 'pi pi-file',
          routerLink: '/customer-orders'
        },
        {
          label: 'Deliveries',
          icon: 'pi pi-truck',
          routerLink: '/deliveries'
        }
      );
    }
  }

  getDisplayName(): string {
    return this.authService.getDisplayName();
  }

  getInitials(): string {
    return this.authService.getInitials();
  }

  getEmail(): string {
    return this.userProfile?.email || '';
  }

  logout(): void {
    this.authService.logout();
  }
}
