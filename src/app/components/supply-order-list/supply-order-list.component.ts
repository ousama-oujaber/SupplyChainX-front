import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SupplyOrderService } from '../../services/supply-order.service';
import { SupplyOrder } from '../../models/models';

@Component({
    selector: 'app-supply-order-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule, TagModule,
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
                    <div class="stat-icon blue"><i class="pi pi-shopping-cart"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Pending</div>
                        <div class="stat-value">{{ getPendingCount() }}</div>
                    </div>
                    <div class="stat-icon amber"><i class="pi pi-clock"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">In Progress</div>
                        <div class="stat-value">{{ getInProgressCount() }}</div>
                    </div>
                    <div class="stat-icon purple"><i class="pi pi-spin pi-spinner"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Received</div>
                        <div class="stat-value">{{ getReceivedCount() }}</div>
                    </div>
                    <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
                </div>
            </div>

            <!-- Main Card -->
            <div class="card-content">
                <div class="page-header">
                    <div>
                        <h2 class="page-title">Supply Orders</h2>
                        <p class="page-subtitle">Manage procurement orders from suppliers</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <p-dropdown [options]="statusOptions" [(ngModel)]="selectedStatus" 
                            placeholder="Filter by Status" (onChange)="onStatusFilter()"
                            [showClear]="true" styleClass="w-48"></p-dropdown>
                        <p-button label="New Order" icon="pi pi-plus" routerLink="/supply-orders/new"
                            styleClass="p-button-rounded"></p-button>
                    </div>
                </div>

                <p-table [value]="orders" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th class="w-[60px]">ID</th>
                            <th>Supplier</th>
                            <th class="w-[120px]">Order Date</th>
                            <th class="w-[140px]">Expected Delivery</th>
                            <th class="w-[80px]">Items</th>
                            <th class="w-[120px]">Status</th>
                            <th class="w-[140px] text-center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-order>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="text-gray-500 font-mono">#{{ order.idOrder }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400">
                                        <i class="pi pi-building"></i>
                                    </div>
                                    <span class="font-semibold text-white">{{ order.supplierName }}</span>
                                </div>
                            </td>
                            <td class="text-gray-300">{{ order.orderDate }}</td>
                            <td class="text-gray-300">{{ order.expectedDeliveryDate }}</td>
                            <td class="text-center">
                                <span class="status-badge info">{{ order.items?.length || 0 }}</span>
                            </td>
                            <td>
                                <span class="status-badge" [ngClass]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
                            </td>
                            <td class="text-center">
                                <div class="action-btn-group justify-center">
                                    <button [routerLink]="['/supply-orders/view', order.idOrder]" class="action-btn view" pTooltip="View">
                                        <i class="pi pi-eye text-sm"></i>
                                    </button>
                                    <button [routerLink]="['/supply-orders/edit', order.idOrder]" class="action-btn edit" pTooltip="Edit">
                                        <i class="pi pi-pencil text-sm"></i>
                                    </button>
                                    <button *ngIf="order.status !== 'RECUE'" (click)="markAsReceived(order)" class="action-btn" 
                                        style="background: rgba(34, 197, 94, 0.1); color: #4ade80;" pTooltip="Mark Received">
                                        <i class="pi pi-check text-sm"></i>
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
                            <td colspan="7" class="text-center py-8">
                                <div class="flex flex-col items-center gap-3 text-gray-400">
                                    <i class="pi pi-inbox text-4xl"></i>
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
export class SupplyOrderListComponent implements OnInit {
    orders: SupplyOrder[] = [];
    selectedStatus: string | null = null;
    statusOptions = [
        { label: 'Pending', value: 'EN_ATTENTE' },
        { label: 'In Progress', value: 'EN_COURS' },
        { label: 'Received', value: 'RECUE' }
    ];

    constructor(
        private orderService: SupplyOrderService,
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

    getPendingCount(): number { return this.orders.filter(o => o.status === 'EN_ATTENTE').length; }
    getInProgressCount(): number { return this.orders.filter(o => o.status === 'EN_COURS').length; }
    getReceivedCount(): number { return this.orders.filter(o => o.status === 'RECUE').length; }

    getStatusClass(status: string): string {
        switch (status) {
            case 'RECUE': return 'success';
            case 'EN_COURS': return 'info';
            case 'EN_ATTENTE': return 'warning';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'RECUE': return 'Received';
            case 'EN_COURS': return 'In Progress';
            case 'EN_ATTENTE': return 'Pending';
            default: return status;
        }
    }

    markAsReceived(order: SupplyOrder): void {
        this.orderService.updateOrderStatus(order.idOrder!, 'RECUE').subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order marked as received. Stock updated.' });
                this.loadOrders();
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update order status' })
        });
    }

    confirmDelete(order: SupplyOrder): void {
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
                    error: (err) => {
                        let msg = 'Failed to delete order';
                        if (err.status === 409) msg = 'Cannot delete - order has related records';
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
                    }
                });
            }
        });
    }
}
