import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Customer } from '../models/customer.model';
import * as CustomerActions from '../store/customer.actions';
import * as CustomerSelectors from '../store/customer.selectors';

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule,
        TooltipModule, ConfirmDialogModule, ToastModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="list-page">
            <!-- Header -->
            <div class="list-header">
                <div class="list-header-left">
                    <div class="list-icon purple">
                        <i class="pi pi-users"></i>
                    </div>
                    <div>
                        <h1 class="list-title">Customer Management</h1>
                        <p class="list-subtitle">Manage customer information and relationships</p>
                    </div>
                </div>
                <div class="list-actions">
                    <button class="btn-primary" routerLink="/customers/new">
                        <i class="pi pi-plus"></i>
                        Add Customer
                    </button>
                    <!-- Debug buttons if needed -->
                    <!-- <button class="btn-secondary" (click)="reload()">Reload</button> -->
                </div>
            </div>

            <!-- Stats -->
            <div class="list-stats">
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #a78bfa;">
                        <i class="pi pi-users"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ (pagination$ | async)?.totalElements || 0 }}</div>
                        <div class="list-stat-label">Total Elements</div>
                    </div>
                </div>
                <!-- Other stats could be derived from store or separate API calls. 
                     For now, we remove "Active" and "Cities" or keep them if we can calculate them. 
                     Since we only load one page, calculating unique cities for ALL customers is not possible client-side accurately without a specific stats endpoint. 
                     We will hide them or show current page stats. 
                     Let's hide them to be accurate, or keep placeholder. -->
            </div>

            <!-- Table Container -->
            <div class="table-container">
                <div class="table-toolbar" style="padding: 1rem;">
                    <div class="toolbar-left">
                        <div class="toolbar-search">
                            <i class="pi pi-search"></i>
                            <input type="text" pInputText placeholder="Search customers..." 
                                   (input)="onSearch($event)">
                        </div>
                    </div>
                </div>

                <p-table #dt 
                         [value]="(customers$ | async) || []" 
                         [lazy]="true"
                         (onLazyLoad)="loadCustomers($event)"
                         [paginator]="true" 
                         [rows]="10" 
                         [totalRecords]="(pagination$ | async)?.totalElements || 0"
                         [loading]="(loading$ | async) || false"
                         [rowsPerPageOptions]="[10, 20, 50]"
                         styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 60px" pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
                            <th pSortableColumn="name">Customer <p-sortIcon field="name"></p-sortIcon></th>
                            <th pSortableColumn="address">Address <p-sortIcon field="address"></p-sortIcon></th>
                            <th style="width: 150px" pSortableColumn="city">City <p-sortIcon field="city"></p-sortIcon></th>
                            <th style="width: 100px">Orders</th>
                            <th style="width: 100px; text-align: center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-customer>
                        <tr>
                            <td class="text-slate-500">#{{ customer.id }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                                        {{ customer.name?.charAt(0) || 'C' }}
                                    </div>
                                    <span class="font-medium text-white">{{ customer.name }}</span>
                                </div>
                            </td>
                            <td class="text-slate-400">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-home text-xs text-slate-500"></i>
                                    {{ customer.address }}
                                </div>
                            </td>
                            <td>
                                <span class="status-pill info">{{ customer.city }}</span>
                            </td>
                            <td>
                                <span class="text-slate-400 text-sm">{{ customer.ordersCount || 0 }}</span>
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="row-action edit" [routerLink]="['/delivery/customers', customer.id, 'edit']" title="Edit">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button class="row-action delete" (click)="confirmDelete(customer)" title="Delete">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="6">
                                <div class="empty-state">
                                    <i class="pi pi-users"></i>
                                    <p>No customers found</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
        <p-confirmDialog header="Confirm Deletion" icon="pi pi-exclamation-triangle"></p-confirmDialog>
        <p-toast position="bottom-right"></p-toast>
    `,
    styles: [`:host { display: block; }`]
})
export class CustomerListComponent implements OnInit {
    customers$: Observable<Customer[]>;
    loading$: Observable<boolean>;
    pagination$: Observable<any>;

    constructor(
        private store: Store,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.customers$ = this.store.select(CustomerSelectors.selectCustomers);
        this.loading$ = this.store.select(CustomerSelectors.selectLoadingList);
        this.pagination$ = this.store.select(CustomerSelectors.selectPaginationInfo);
    }

    ngOnInit(): void {
        // Initial load is triggered by p-table lazy load or we can trigger default here.
        // p-table lazy triggers onInit usually.
    }

    loadCustomers(event: TableLazyLoadEvent): void {
        const page = (event.first || 0) / (event.rows || 10);
        const size = event.rows || 10;
        let sort = 'name,asc';
        if (event.sortField) {
            sort = `${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`;
        }

        this.store.dispatch(CustomerActions.setSearchParams({
            params: { page, size, sort }
        }));
    }

    onSearch(event: any): void {
        const value = event.target.value;
        this.store.dispatch(CustomerActions.setSearchParams({
            params: { search: value, page: 0 }
        }));
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

    reload() {
        this.store.dispatch(CustomerActions.loadCustomers());
    }
}
