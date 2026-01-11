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
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
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
    ];
  }
}
