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
    { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/edit/:id', component: ProductFormComponent },
    { path: 'production-orders', component: ProductionOrderListComponent },
    { path: 'production-orders/new', component: ProductionOrderFormComponent },
    { path: 'production-orders/edit/:id', component: ProductionOrderFormComponent },
    { path: 'bom', component: BomListComponent },
    { path: 'bom/new', component: BomFormComponent },
    { path: 'bom/edit/:id', component: BomFormComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
