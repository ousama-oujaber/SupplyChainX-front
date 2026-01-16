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
import { Customer } from '../../models/models';

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule,
        TooltipModule, ConfirmDialogModule, ToastModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="page-container">
            <!-- Stats Section -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Total Customers</div>
                        <div class="stat-value">{{ customers.length }}</div>
                    </div>
                    <div class="stat-icon blue"><i class="pi pi-users"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Active</div>
                        <div class="stat-value">{{ customers.length }}</div>
                    </div>
                    <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Cities</div>
                        <div class="stat-value">{{ getUniqueCities() }}</div>
                    </div>
                    <div class="stat-icon purple"><i class="pi pi-map-marker"></i></div>
                </div>
            </div>

            <!-- Main Card -->
            <div class="card-content">
                <div class="page-header">
                    <div>
                        <h2 class="page-title">Customers</h2>
                        <p class="page-subtitle">Manage customer information</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="search-box">
                            <i class="pi pi-search search-icon"></i>
                            <input pInputText type="text" (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                                placeholder="Search customers..." class="w-64" />
                        </div>
                        <p-button label="Add Customer" icon="pi pi-plus" routerLink="/customers/new"
                            styleClass="p-button-rounded"></p-button>
                    </div>
                </div>

                <p-table #dt [value]="customers" [globalFilterFields]="['name', 'address', 'city']" [paginator]="true" 
                    [rows]="10" [rowsPerPageOptions]="[5, 10, 25]" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th class="w-[60px]">ID</th>
                            <th>Customer</th>
                            <th>Address</th>
                            <th class="w-[120px]">City</th>
                            <th class="w-[100px]">Status</th>
                            <th class="w-[100px] text-center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-customer>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="text-gray-500 font-mono">#{{ customer.idCustomer }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-400 font-bold">
                                        {{ customer.name?.charAt(0) || 'C' }}
                                    </div>
                                    <span class="font-semibold text-white">{{ customer.name }}</span>
                                </div>
                            </td>
                            <td class="text-gray-300">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-home text-gray-500 text-xs"></i>
                                    {{ customer.address }}
                                </div>
                            </td>
                            <td>
                                <span class="status-badge info">{{ customer.city }}</span>
                            </td>
                            <td>
                                <span class="status-badge success">Active</span>
                            </td>
                            <td class="text-center">
                                <div class="action-btn-group justify-center">
                                    <button [routerLink]="['/customers/edit', customer.idCustomer]" class="action-btn edit" pTooltip="Edit">
                                        <i class="pi pi-pencil text-sm"></i>
                                    </button>
                                    <button (click)="confirmDelete(customer)" class="action-btn delete" pTooltip="Delete">
                                        <i class="pi pi-trash text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="6" class="text-center py-8">
                                <div class="flex flex-col items-center gap-3 text-gray-400">
                                    <i class="pi pi-users text-4xl"></i>
                                    <p>No customers found</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
        <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
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
