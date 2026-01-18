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
import { DeliveryService } from '../../services/delivery.service';
import { Delivery } from '../../../../shared/models/models';

@Component({
    selector: 'app-delivery-list',
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
                    <div class="list-icon cyan">
                        <i class="pi pi-truck"></i>
                    </div>
                    <div>
                        <h1 class="list-title">Deliveries</h1>
                        <p class="list-subtitle">Track and manage delivery operations</p>
                    </div>
                </div>
                <div class="list-actions">
                    <button class="btn-primary" routerLink="/deliveries/new">
                        <i class="pi pi-plus"></i>
                        New Delivery
                    </button>
                </div>
            </div>

            <!-- Stats -->
            <div class="list-stats">
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(6, 182, 212, 0.15); color: #22d3ee;">
                        <i class="pi pi-truck"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ deliveries.length }}</div>
                        <div class="list-stat-label">Total Deliveries</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(251, 191, 36, 0.15); color: #fbbf24;">
                        <i class="pi pi-calendar"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getScheduledCount() }}</div>
                        <div class="list-stat-label">Scheduled</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(96, 165, 250, 0.15); color: #60a5fa;">
                        <i class="pi pi-send"></i>
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

                <p-table [value]="deliveries" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 60px">ID</th>
                            <th>Order</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th style="width: 120px">Date</th>
                            <th style="width: 100px">Cost</th>
                            <th style="width: 120px">Status</th>
                            <th style="width: 120px; text-align: center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-delivery>
                        <tr>
                            <td class="text-slate-500">#{{ delivery.idDelivery }}</td>
                            <td>
                                <span class="status-pill info">Order #{{ delivery.orderId }}</span>
                            </td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400">
                                        <i class="pi pi-car"></i>
                                    </div>
                                    <span class="font-medium text-white">{{ delivery.vehicle }}</span>
                                </div>
                            </td>
                            <td class="text-slate-400">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-user text-xs text-slate-500"></i>
                                    {{ delivery.driver }}
                                </div>
                            </td>
                            <td class="text-slate-400">{{ delivery.deliveryDate }}</td>
                            <td class="font-semibold text-white">{{ delivery.cost | currency }}</td>
                            <td>
                                <span class="status-pill" [ngClass]="getStatusClass(delivery.status)">
                                    <span class="status-dot"></span>
                                    {{ getStatusLabel(delivery.status) }}
                                </span>
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="row-action edit" [routerLink]="['/deliveries/edit', delivery.idDelivery]" title="Edit">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button class="row-action calculate" (click)="calculateCost(delivery)" title="Calculate Cost">
                                        <i class="pi pi-calculator"></i>
                                    </button>
                                    <button class="row-action delete" (click)="confirmDelete(delivery)" title="Delete">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="8">
                                <div class="empty-state">
                                    <i class="pi pi-truck"></i>
                                    <p>No deliveries found</p>
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
export class DeliveryListComponent implements OnInit {
    deliveries: Delivery[] = [];
    selectedStatus: string | null = null;
    statusOptions = [
        { label: 'Scheduled', value: 'PLANIFIEE' },
        { label: 'In Transit', value: 'EN_COURS' },
        { label: 'Delivered', value: 'LIVREE' }
    ];

    constructor(
        private deliveryService: DeliveryService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadDeliveries();
    }

    loadDeliveries(): void {
        this.deliveryService.getAllDeliveries().subscribe({
            next: (data) => this.deliveries = data,
            error: (err) => console.error('Error loading deliveries:', err)
        });
    }

    onStatusFilter(): void {
        if (this.selectedStatus) {
            this.deliveryService.getDeliveriesByStatus(this.selectedStatus).subscribe({
                next: (data) => this.deliveries = data
            });
        } else {
            this.loadDeliveries();
        }
    }

    getScheduledCount(): number { return this.deliveries.filter(d => d.status === 'PLANIFIEE').length; }
    getInTransitCount(): number { return this.deliveries.filter(d => d.status === 'EN_COURS').length; }
    getDeliveredCount(): number { return this.deliveries.filter(d => d.status === 'LIVREE').length; }

    getStatusClass(status: string): string {
        switch (status) {
            case 'LIVREE': return 'success';
            case 'EN_COURS': return 'info';
            case 'PLANIFIEE': return 'warning';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'LIVREE': return 'Delivered';
            case 'EN_COURS': return 'In Transit';
            case 'PLANIFIEE': return 'Scheduled';
            default: return status;
        }
    }

    calculateCost(delivery: Delivery): void {
        this.deliveryService.calculateDeliveryCost(delivery.idDelivery!).subscribe({
            next: (updated) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Cost calculated: ${updated.cost}` });
                this.loadDeliveries();
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to calculate cost' })
        });
    }

    confirmDelete(delivery: Delivery): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete delivery #${delivery.idDelivery}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deliveryService.deleteDelivery(delivery.idDelivery!).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Delivery deleted successfully' });
                        this.loadDeliveries();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete delivery' })
                });
            }
        });
    }
}
