import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductionOrderListComponent } from './components/production-order-list/production-order-list.component';
import { ProductionOrderFormComponent } from './components/production-order-form/production-order-form.component';
import { BomListComponent } from './components/bom-list/bom-list.component';
import { BomFormComponent } from './components/bom-form/bom-form.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },

    // User Management
    {
        path: 'users',
        loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
    },
    {
        path: 'users/new',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
    },
    {
        path: 'users/edit/:id',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
    },

    // Products
    { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/edit/:id', component: ProductFormComponent },

    // Production Orders
    { path: 'production-orders', component: ProductionOrderListComponent },
    { path: 'production-orders/new', component: ProductionOrderFormComponent },
    { path: 'production-orders/edit/:id', component: ProductionOrderFormComponent },

    // BOM
    { path: 'bom', component: BomListComponent },
    { path: 'bom/new', component: BomFormComponent },
    { path: 'bom/edit/:id', component: BomFormComponent },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
