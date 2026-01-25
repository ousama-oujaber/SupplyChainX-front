import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Customer } from '../models/customer.model';
import * as CustomerActions from '../store/customer.actions';
import * as CustomerSelectors from '../store/customer.selectors';

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        CardModule,
        TagModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService],
    template: `
    <div class="detail-page" *ngIf="customer$ | async as customer">
      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
           <button pButton icon="pi pi-arrow-left" [routerLink]="['/delivery/customers']" label="Back to List" class="p-button-text p-button-secondary"></button>
           <h1>{{ customer.name }}</h1>
        </div>
        <div class="header-actions">
           <button pButton icon="pi pi-pencil" [routerLink]="['/delivery/customers', customer.id, 'edit']" label="Edit" class="p-button-outlined"></button>
           <button pButton icon="pi pi-trash" (click)="confirmDelete(customer)" label="Delete" class="p-button-danger"></button>
        </div>
      </div>

      <!-- Content -->
      <div class="detail-content grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <!-- Info Card -->
        <p-card header="Information">
           <div class="info-item mb-3">
             <span class="text-gray-500 block text-sm">Customer ID</span>
             <span class="font-medium">#{{ customer.id }}</span>
           </div>
           <div class="info-item mb-3">
             <span class="text-gray-500 block text-sm">Address</span>
             <span class="font-medium">{{ customer.address }}</span>
           </div>
           <div class="info-item mb-3">
             <span class="text-gray-500 block text-sm">City</span>
             <span class="font-medium">{{ customer.city }}</span>
           </div>
        </p-card>

        <!-- Stats Card -->
        <p-card header="Statistics">
           <div class="stats-grid grid grid-cols-2 gap-4">
              <div class="stat-box p-4 bg-purple-50 rounded-lg text-center">
                 <div class="text-purple-500 text-xl font-bold">{{ customer.ordersCount || 0 }}</div>
                 <div class="text-gray-600 text-sm">Total Orders</div>
              </div>
              <div class="stat-box p-4 bg-green-50 rounded-lg text-center">
                 <div class="text-green-500 text-xl font-bold">
                    <i class="pi" [ngClass]="customer.hasActiveOrders ? 'pi-check-circle' : 'pi-minus-circle'"></i>
                 </div>
                 <div class="text-gray-600 text-sm">Active Orders</div>
              </div>
           </div>
        </p-card>
      </div>
    </div>
    
    <!-- Loading State -->
    <div *ngIf="loading$ | async" class="flex justify-center items-center h-64">
       <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `,
    styles: [`
    .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header-left { display: flex; align-items: center; gap: 1rem; }
  `]
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
    customer$: Observable<Customer | null>;
    loading$: Observable<boolean>;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.customer$ = this.store.select(CustomerSelectors.selectSelectedCustomer);
        this.loading$ = this.store.select(CustomerSelectors.selectLoadingDetail);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.store.dispatch(CustomerActions.loadCustomerById({ id: +params['id'] }));
            }
        });
    }

    ngOnDestroy(): void {
        this.store.dispatch(CustomerActions.clearSelectedCustomer());
    }

    confirmDelete(customer: Customer): void {
        if (customer.hasActiveOrders) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cannot Delete',
                detail: `Alert: Client has ${customer.ordersCount} active order(s). Deletion is impossible.`
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${customer.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.store.dispatch(CustomerActions.deleteCustomer({ id: customer.id }));
            }
        });
    }
}
