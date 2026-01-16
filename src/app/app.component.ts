import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      // Overview
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users'
      },
      // Production Module
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
      },
      // Procurement Module
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
      },
      // Delivery Module
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
    ];
  }
}
