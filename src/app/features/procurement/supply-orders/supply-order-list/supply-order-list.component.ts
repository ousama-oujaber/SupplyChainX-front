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
import { SupplyOrder } from '../../../../shared/models/models';

@Component({
    selector: 'app-supply-order-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule, TagModule,
        TooltipModule, ConfirmDialogModule, ToastModule, DropdownModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="list-page">
            <!-- Header -->
            <div class="list-header">
                <div class="list-header-left">
                    <div class="list-icon blue">
                        <i class="pi pi-shopping-cart"></i>
                    </div>
                    <div>
                        <h1 class="list-title">Supply Orders</h1>
                        <p class="list-subtitle">Manage procurement orders from suppliers</p>
                    </div>
                </div>
                <div class="list-actions">
                    <button class="btn-primary" routerLink="/supply-orders/new">
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
                        <i class="pi pi-clock"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getPendingCount() }}</div>
                        <div class="list-stat-label">Pending</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #a78bfa;">
                        <i class="pi pi-sync"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getInProgressCount() }}</div>
                        <div class="list-stat-label">In Progress</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(74, 222, 128, 0.15); color: #4ade80;">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getReceivedCount() }}</div>
                        <div class="list-stat-label">Received</div>
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
                            <th>Supplier</th>
                            <th style="width: 120px">Order Date</th>
                            <th style="width: 140px">Expected Delivery</th>
                            <th style="width: 80px">Items</th>
                            <th style="width: 120px">Status</th>
                            <th style="width: 130px; text-align: center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-order>
                        <tr>
                            <td class="text-slate-500">#{{ order.idOrder }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400">
                                        <i class="pi pi-building"></i>
                                    </div>
                                    <span class="font-medium text-white">{{ order.supplierName }}</span>
                                </div>
                            </td>
                            <td class="text-slate-400">{{ order.orderDate }}</td>
                            <td class="text-slate-400">{{ order.expectedDeliveryDate }}</td>
                            <td class="text-center">
                                <span class="status-pill info">{{ order.items?.length || 0 }}</span>
                            </td>
                            <td>
                                <span class="status-pill" [ngClass]="getStatusClass(order.status)">
                                    <span class="status-dot"></span>
                                    {{ getStatusLabel(order.status) }}
                                </span>
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="row-action view" [routerLink]="['/supply-orders/view', order.idOrder]" title="View">
                                        <i class="pi pi-eye"></i>
                                    </button>
                                    <button class="row-action edit" [routerLink]="['/supply-orders/edit', order.idOrder]" title="Edit">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button *ngIf="order.status !== 'RECUE'" class="row-action" 
                                        style="background: rgba(74, 222, 128, 0.1); color: #4ade80;" 
                                        (click)="markAsReceived(order)" title="Mark Received">
                                        <i class="pi pi-check"></i>
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
                            <td colspan="7">
                                <div class="empty-state">
                                    <i class="pi pi-inbox"></i>
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
