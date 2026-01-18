import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductListComponent } from './features/production/products/product-list/product-list.component';
import { ProductFormComponent } from './features/production/products/product-form/product-form.component';
import { ProductionOrderListComponent } from './features/production/production-orders/production-order-list/production-order-list.component';
import { ProductionOrderFormComponent } from './features/production/production-orders/production-order-form/production-order-form.component';
import { BomListComponent } from './features/production/bom/bom-list/bom-list.component';
import { BomFormComponent } from './features/production/bom/bom-form/bom-form.component';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard, procurementGuard, productionGuard, deliveryGuard } from './core/auth/role.guard';

export const routes: Routes = [
    // Public routes
    {
        path: 'login',
        loadComponent: () => import('./layout/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'access-denied',
        loadComponent: () => import('./layout/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
    },

    // Protected routes - Dashboard (accessible to all authenticated users)
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },

    // User Management - Admin only
    {
        path: 'users',
        loadComponent: () => import('./features/admin/users/user-list/user-list.component').then(m => m.UserListComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'users/new',
        loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'users/edit/:id',
        loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [adminGuard]
    },

    // Production Module - Production roles + Admin
    {
        path: 'products',
        component: ProductListComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'products/new',
        component: ProductFormComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'products/edit/:id',
        component: ProductFormComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'production-orders',
        component: ProductionOrderListComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'production-orders/new',
        component: ProductionOrderFormComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'production-orders/edit/:id',
        component: ProductionOrderFormComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'bom',
        component: BomListComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'bom/new',
        component: BomFormComponent,
        canActivate: [productionGuard]
    },
    {
        path: 'bom/edit/:id',
        component: BomFormComponent,
        canActivate: [productionGuard]
    },

    // Procurement Module - Procurement roles + Admin
    {
        path: 'suppliers',
        loadComponent: () => import('./features/procurement/suppliers/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'suppliers/new',
        loadComponent: () => import('./features/procurement/suppliers/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'suppliers/edit/:id',
        loadComponent: () => import('./features/procurement/suppliers/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'raw-materials',
        loadComponent: () => import('./features/procurement/raw-materials/raw-material-list/raw-material-list.component').then(m => m.RawMaterialListComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'raw-materials/new',
        loadComponent: () => import('./features/procurement/raw-materials/raw-material-form/raw-material-form.component').then(m => m.RawMaterialFormComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'raw-materials/edit/:id',
        loadComponent: () => import('./features/procurement/raw-materials/raw-material-form/raw-material-form.component').then(m => m.RawMaterialFormComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'supply-orders',
        loadComponent: () => import('./features/procurement/supply-orders/supply-order-list/supply-order-list.component').then(m => m.SupplyOrderListComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'supply-orders/new',
        loadComponent: () => import('./features/procurement/supply-orders/supply-order-form/supply-order-form.component').then(m => m.SupplyOrderFormComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'supply-orders/edit/:id',
        loadComponent: () => import('./features/procurement/supply-orders/supply-order-form/supply-order-form.component').then(m => m.SupplyOrderFormComponent),
        canActivate: [procurementGuard]
    },
    {
        path: 'supply-orders/view/:id',
        loadComponent: () => import('./features/procurement/supply-orders/supply-order-detail/supply-order-detail.component').then(m => m.SupplyOrderDetailComponent),
        canActivate: [procurementGuard]
    },

    // Delivery Module - Delivery roles + Admin
    {
        path: 'customers',
        loadComponent: () => import('./features/delivery/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'customers/new',
        loadComponent: () => import('./features/delivery/customers/customer-form/customer-form.component').then(m => m.CustomerFormComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'customers/edit/:id',
        loadComponent: () => import('./features/delivery/customers/customer-form/customer-form.component').then(m => m.CustomerFormComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'customer-orders',
        loadComponent: () => import('./features/delivery/customer-orders/customer-order-list/customer-order-list.component').then(m => m.CustomerOrderListComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'customer-orders/new',
        loadComponent: () => import('./features/delivery/customer-orders/customer-order-form/customer-order-form.component').then(m => m.CustomerOrderFormComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'customer-orders/edit/:id',
        loadComponent: () => import('./features/delivery/customer-orders/customer-order-form/customer-order-form.component').then(m => m.CustomerOrderFormComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'deliveries',
        loadComponent: () => import('./features/delivery/deliveries/delivery-list/delivery-list.component').then(m => m.DeliveryListComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'deliveries/new',
        loadComponent: () => import('./features/delivery/deliveries/delivery-form/delivery-form.component').then(m => m.DeliveryFormComponent),
        canActivate: [deliveryGuard]
    },
    {
        path: 'deliveries/edit/:id',
        loadComponent: () => import('./features/delivery/deliveries/delivery-form/delivery-form.component').then(m => m.DeliveryFormComponent),
        canActivate: [deliveryGuard]
    },

    // Home Page (Landing)
    {
        path: '',
        loadComponent: () => import('./layout/home/home.component').then(m => m.HomeComponent)
    }
];
