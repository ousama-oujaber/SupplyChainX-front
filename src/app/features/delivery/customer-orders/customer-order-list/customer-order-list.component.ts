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
import { CustomerOrder } from '../../../../shared/models/models';

@Component({
    selector: 'app-customer-order-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule,
        TooltipModule, ConfirmDialogModule, ToastModule, DropdownModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="list-page">
            <!-- Header -->
            <div class="list-header">
                <div class="list-header-left">
                    <div class="list-icon amber">
                        <i class="pi pi-shopping-cart"></i>
                    </div>
                    <div>
                        <h1 class="list-title">Customer Orders</h1>
                        <p class="list-subtitle">Track and manage customer purchase orders</p>
                    </div>
                </div>
                <div class="list-actions">
                    <button class="btn-primary" routerLink="/customer-orders/new">
                        <i class="pi pi-plus"></i>
                        New Order
                    </button>
                </div>
            </div>

            <!-- Stats -->
            <div class="list-stats">
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
                        <i class="pi pi-shopping-cart"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ orders.length }}</div>
                        <div class="list-stat-label">Total Orders</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(251, 191, 36, 0.15); color: #fbbf24;">
                        <i class="pi pi-box"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getPreparingCount() }}</div>
                        <div class="list-stat-label">Preparing</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #a78bfa;">
                        <i class="pi pi-truck"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getInTransitCount() }}</div>
                        <div class="list-stat-label">In Transit</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(74, 222, 128, 0.15); color: #4ade80;">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getDeliveredCount() }}</div>
                        <div class="list-stat-label">Delivered</div>
                    </div>
                </div>
            </div>

            <!-- Table Container -->
            <div class="table-container">
                <div class="table-toolbar" style="padding: 1rem;">
                    <div class="toolbar-left">
                        <p-dropdown [options]="statusOptions" [(ngModel)]="selectedStatus" 
                            placeholder="Filter by Status" (onChange)="onStatusFilter()"
                            [showClear]="true" styleClass="w-48"></p-dropdown>
                    </div>
                </div>

                <p-table [value]="orders" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 60px">ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th style="width: 80px">Qty</th>
                            <th style="width: 120px">Status</th>
                            <th style="width: 100px; text-align: center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-order>
                        <tr>
                            <td class="text-slate-500">#{{ order.idOrder }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                                        {{ order.customerName?.charAt(0) || 'C' }}
                                    </div>
                                    <span class="font-medium text-white">{{ order.customerName }}</span>
                                </div>
                            </td>
                            <td class="text-slate-400">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-tag text-xs text-slate-500"></i>
                                    {{ order.productName }}
                                </div>
                            </td>
                            <td class="text-center font-semibold text-white">{{ order.quantity }}</td>
                            <td>
                                <span class="status-pill" [ngClass]="getStatusClass(order.status)">
                                    <span class="status-dot"></span>
                                    {{ getStatusLabel(order.status) }}
                                </span>
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="row-action edit" [routerLink]="['/customer-orders/edit', order.idOrder]" title="Edit">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button class="row-action delete" (click)="confirmDelete(order)" title="Delete">
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
                                    <i class="pi pi-shopping-cart"></i>
                                    <p>No orders found</p>
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
