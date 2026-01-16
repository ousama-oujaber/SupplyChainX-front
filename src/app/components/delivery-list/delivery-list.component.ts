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
import { Delivery } from '../../models/models';

@Component({
    selector: 'app-delivery-list',
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
                        <div class="stat-label">Total Deliveries</div>
                        <div class="stat-value">{{ deliveries.length }}</div>
                    </div>
                    <div class="stat-icon blue"><i class="pi pi-truck"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Scheduled</div>
                        <div class="stat-value">{{ getScheduledCount() }}</div>
                    </div>
                    <div class="stat-icon amber"><i class="pi pi-calendar"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">In Transit</div>
                        <div class="stat-value">{{ getInTransitCount() }}</div>
                    </div>
                    <div class="stat-icon purple"><i class="pi pi-send"></i></div>
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
                        <h2 class="page-title">Deliveries</h2>
                        <p class="page-subtitle">Track and manage delivery operations</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <p-dropdown [options]="statusOptions" [(ngModel)]="selectedStatus" 
                            placeholder="Filter by Status" (onChange)="onStatusFilter()"
                            [showClear]="true" styleClass="w-48"></p-dropdown>
                        <p-button label="New Delivery" icon="pi pi-plus" routerLink="/deliveries/new"
                            styleClass="p-button-rounded"></p-button>
                    </div>
                </div>

                <p-table [value]="deliveries" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th class="w-[60px]">ID</th>
                            <th>Order</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th class="w-[120px]">Date</th>
                            <th class="w-[100px]">Cost</th>
                            <th class="w-[120px]">Status</th>
                            <th class="w-[140px] text-center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-delivery>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="text-gray-500 font-mono">#{{ delivery.idDelivery }}</td>
                            <td>
                                <span class="status-badge info">Order #{{ delivery.orderId }}</span>
                            </td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400">
                                        <i class="pi pi-car"></i>
                                    </div>
                                    <span class="font-medium text-white">{{ delivery.vehicle }}</span>
                                </div>
                            </td>
                            <td class="text-gray-300">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-user text-gray-500 text-xs"></i>
                                    {{ delivery.driver }}
                                </div>
                            </td>
                            <td class="text-gray-300">{{ delivery.deliveryDate }}</td>
                            <td class="font-medium text-white">{{ delivery.cost | currency }}</td>
                            <td>
                                <span class="status-badge" [ngClass]="getStatusClass(delivery.status)">{{ getStatusLabel(delivery.status) }}</span>
                            </td>
                            <td class="text-center">
                                <div class="action-btn-group justify-center">
                                    <button [routerLink]="['/deliveries/edit', delivery.idDelivery]" class="action-btn edit" pTooltip="Edit">
                                        <i class="pi pi-pencil text-sm"></i>
                                    </button>
                                    <button (click)="calculateCost(delivery)" class="action-btn" 
                                        style="background: rgba(168, 85, 247, 0.1); color: #a78bfa;" pTooltip="Calculate Cost">
                                        <i class="pi pi-calculator text-sm"></i>
                                    </button>
                                    <button (click)="confirmDelete(delivery)" class="action-btn delete" pTooltip="Delete">
                                        <i class="pi pi-trash text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="8" class="text-center py-8">
                                <div class="flex flex-col items-center gap-3 text-gray-400">
                                    <i class="pi pi-truck text-4xl"></i>
                                    <p>No deliveries found</p>
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
