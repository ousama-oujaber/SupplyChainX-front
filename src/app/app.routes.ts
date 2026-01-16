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

    // Suppliers
    {
        path: 'suppliers',
        loadComponent: () => import('./components/supplier-list/supplier-list.component').then(m => m.SupplierListComponent)
    },
    {
        path: 'suppliers/new',
        loadComponent: () => import('./components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent)
    },
    {
        path: 'suppliers/edit/:id',
        loadComponent: () => import('./components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent)
    },

    // Raw Materials (Procurement)
    {
        path: 'raw-materials',
        loadComponent: () => import('./components/raw-material-list/raw-material-list.component').then(m => m.RawMaterialListComponent)
    },
    {
        path: 'raw-materials/new',
        loadComponent: () => import('./components/raw-material-form/raw-material-form.component').then(m => m.RawMaterialFormComponent)
    },
    {
        path: 'raw-materials/edit/:id',
        loadComponent: () => import('./components/raw-material-form/raw-material-form.component').then(m => m.RawMaterialFormComponent)
    },

    // Supply Orders (Procurement)
    {
        path: 'supply-orders',
        loadComponent: () => import('./components/supply-order-list/supply-order-list.component').then(m => m.SupplyOrderListComponent)
    },
    {
        path: 'supply-orders/new',
        loadComponent: () => import('./components/supply-order-form/supply-order-form.component').then(m => m.SupplyOrderFormComponent)
    },
    {
        path: 'supply-orders/edit/:id',
        loadComponent: () => import('./components/supply-order-form/supply-order-form.component').then(m => m.SupplyOrderFormComponent)
    },
    {
        path: 'supply-orders/view/:id',
        loadComponent: () => import('./components/supply-order-detail/supply-order-detail.component').then(m => m.SupplyOrderDetailComponent)
    },

    // Customers (Delivery)
    {
        path: 'customers',
        loadComponent: () => import('./components/customer-list/customer-list.component').then(m => m.CustomerListComponent)
    },
    {
        path: 'customers/new',
        loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
    },
    {
        path: 'customers/edit/:id',
        loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
    },

    // Customer Orders (Delivery)
    {
        path: 'customer-orders',
        loadComponent: () => import('./components/customer-order-list/customer-order-list.component').then(m => m.CustomerOrderListComponent)
    },
    {
        path: 'customer-orders/new',
        loadComponent: () => import('./components/customer-order-form/customer-order-form.component').then(m => m.CustomerOrderFormComponent)
    },
    {
        path: 'customer-orders/edit/:id',
        loadComponent: () => import('./components/customer-order-form/customer-order-form.component').then(m => m.CustomerOrderFormComponent)
    },

    // Deliveries (Delivery)
    {
        path: 'deliveries',
        loadComponent: () => import('./components/delivery-list/delivery-list.component').then(m => m.DeliveryListComponent)
    },
    {
        path: 'deliveries/new',
        loadComponent: () => import('./components/delivery-form/delivery-form.component').then(m => m.DeliveryFormComponent)
    },
    {
        path: 'deliveries/edit/:id',
        loadComponent: () => import('./components/delivery-form/delivery-form.component').then(m => m.DeliveryFormComponent)
    },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
