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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerOrderService } from '../../services/customer-order.service';
import { CustomerOrder } from '../../models/models';

@Component({
    selector: 'app-customer-order-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule,
        TooltipModule, ConfirmDialogModule, ToastModule, DropdownModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="page-container">
            <!-- Stats Section -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Total Orders</div>
                        <div class="stat-value">{{ orders.length }}</div>
                    </div>
                    <div class="stat-icon blue"><i class="pi pi-shopping-bag"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Preparing</div>
                        <div class="stat-value">{{ getPreparingCount() }}</div>
                    </div>
                    <div class="stat-icon amber"><i class="pi pi-box"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">In Transit</div>
                        <div class="stat-value">{{ getInTransitCount() }}</div>
                    </div>
                    <div class="stat-icon purple"><i class="pi pi-truck"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Delivered</div>
                        <div class="stat-value">{{ getDeliveredCount() }}</div>
                    </div>
                    <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
                </div>
            </div>

            <!-- Main Card -->
            <div class="card-content">
                <div class="page-header">
                    <div>
                        <h2 class="page-title">Customer Orders</h2>
                        <p class="page-subtitle">Track and manage customer orders</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <p-dropdown [options]="statusOptions" [(ngModel)]="selectedStatus" 
                            placeholder="Filter by Status" (onChange)="onStatusFilter()"
                            [showClear]="true" styleClass="w-48"></p-dropdown>
                        <p-button label="New Order" icon="pi pi-plus" routerLink="/customer-orders/new"
                            styleClass="p-button-rounded"></p-button>
                    </div>
                </div>

                <p-table [value]="orders" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th class="w-[60px]">ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th class="w-[80px]">Qty</th>
                            <th class="w-[120px]">Status</th>
                            <th class="w-[100px] text-center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-order>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="text-gray-500 font-mono">#{{ order.idOrder }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-orange-400 font-bold">
                                        {{ order.customerName?.charAt(0) || 'C' }}
                                    </div>
                                    <span class="font-semibold text-white">{{ order.customerName }}</span>
                                </div>
                            </td>
                            <td class="text-gray-300">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-tag text-gray-500 text-xs"></i>
                                    {{ order.productName }}
                                </div>
                            </td>
                            <td class="text-center font-medium text-white">{{ order.quantity }}</td>
                            <td>
                                <span class="status-badge" [ngClass]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
                            </td>
                            <td class="text-center">
                                <div class="action-btn-group justify-center">
                                    <button [routerLink]="['/customer-orders/edit', order.idOrder]" class="action-btn edit" pTooltip="Edit">
                                        <i class="pi pi-pencil text-sm"></i>
                                    </button>
                                    <button (click)="confirmDelete(order)" class="action-btn delete" pTooltip="Delete">
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
                                    <i class="pi pi-shopping-bag text-4xl"></i>
                                    <p>No orders found</p>
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
export class CustomerOrderListComponent implements OnInit {
    orders: CustomerOrder[] = [];
    selectedStatus: string | null = null;
    statusOptions = [
        { label: 'Preparing', value: 'EN_PREPARATION' },
        { label: 'In Transit', value: 'EN_ROUTE' },
        { label: 'Delivered', value: 'LIVREE' }
    ];

    constructor(
        private orderService: CustomerOrderService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.orderService.getAllOrders().subscribe({
            next: (data) => this.orders = data,
            error: (err) => console.error('Error loading orders:', err)
        });
    }

    onStatusFilter(): void {
        if (this.selectedStatus) {
            this.orderService.getOrdersByStatus(this.selectedStatus).subscribe({
                next: (data) => this.orders = data
            });
        } else {
            this.loadOrders();
        }
    }

    getPreparingCount(): number { return this.orders.filter(o => o.status === 'EN_PREPARATION').length; }
    getInTransitCount(): number { return this.orders.filter(o => o.status === 'EN_ROUTE').length; }
    getDeliveredCount(): number { return this.orders.filter(o => o.status === 'LIVREE').length; }

    getStatusClass(status: string): string {
        switch (status) {
            case 'LIVREE': return 'success';
            case 'EN_ROUTE': return 'info';
            case 'EN_PREPARATION': return 'warning';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'LIVREE': return 'Delivered';
            case 'EN_ROUTE': return 'In Transit';
            case 'EN_PREPARATION': return 'Preparing';
            default: return status;
        }
    }

    confirmDelete(order: CustomerOrder): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete order #${order.idOrder}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.orderService.deleteOrder(order.idOrder!).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Order deleted successfully' });
                        this.loadOrders();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete order' })
                });
            }
        });
    }
}
