import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../../../shared/models/models';

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
                </div>
            </div>

            <!-- Stats -->
            <div class="list-stats">
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #a78bfa;">
                        <i class="pi pi-users"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ customers.length }}</div>
                        <div class="list-stat-label">Total Customers</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(74, 222, 128, 0.15); color: #4ade80;">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ customers.length }}</div>
                        <div class="list-stat-label">Active</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(96, 165, 250, 0.15); color: #60a5fa;">
                        <i class="pi pi-map-marker"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getUniqueCities() }}</div>
                        <div class="list-stat-label">Cities</div>
                    </div>
                </div>
            </div>

            <!-- Table Container -->
            <div class="table-container">
                <div class="table-toolbar" style="padding: 1rem;">
                    <div class="toolbar-left">
                        <div class="toolbar-search">
                            <i class="pi pi-search"></i>
                            <input type="text" placeholder="Search customers..." 
                                   (input)="dt.filterGlobal($any($event.target).value, 'contains')">
                        </div>
                    </div>
                </div>

                <p-table #dt [value]="customers" [globalFilterFields]="['name', 'address', 'city']" 
                         [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 60px">ID</th>
                            <th>Customer</th>
                            <th>Address</th>
                            <th style="width: 120px">City</th>
                            <th style="width: 100px">Status</th>
                            <th style="width: 100px; text-align: center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-customer>
                        <tr>
                            <td class="text-slate-500">#{{ customer.idCustomer }}</td>
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
                                <span class="status-pill success">
                                    <span class="status-dot"></span>
                                    Active
                                </span>
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="row-action edit" [routerLink]="['/customers/edit', customer.idCustomer]" title="Edit">
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
    customers: Customer[] = [];

    constructor(
        private customerService: CustomerService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.customerService.getAllCustomers().subscribe({
            next: (data) => this.customers = data,
            error: (err) => console.error('Error loading customers:', err)
        });
    }

    getUniqueCities(): number {
        const cities = new Set(this.customers.map(c => c.city).filter(c => c));
        return cities.size;
    }

    confirmDelete(customer: Customer): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${customer.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerService.deleteCustomer(customer.idCustomer!).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Customer deleted successfully' });
                        this.loadCustomers();
                    },
                    error: (err) => {
                        let msg = 'Failed to delete customer';
                        if (err.status === 409) msg = 'Cannot delete - customer has active orders';
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
                    }
                });
            }
        });
    }
}
