import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SupplyOrderService } from '../../services/supply-order.service';
import { SupplyOrder } from '../../models/models';

@Component({
    selector: 'app-supply-order-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule, TableModule, ButtonModule, TagModule],
    template: `
        <div class="card" *ngIf="order">
            <div class="flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold m-0">Supply Order #{{ order.idOrder }}</h2>
                    <p class="text-slate-400 mt-1">{{ order.supplierName }}</p>
                </div>
                <div class="flex gap-2">
                    <p-tag [severity]="getStatusSeverity(order.status)" [value]="getStatusLabel(order.status)"></p-tag>
                    <button pButton icon="pi pi-arrow-left" label="Back" class="p-button-secondary" routerLink="/supply-orders"></button>
                </div>
            </div>
            
            <div class="grid mb-4">
                <div class="col-12 md:col-4">
                    <div class="info-box">
                        <span class="label">Order Date</span>
                        <span class="value">{{ order.orderDate }}</span>
                    </div>
                </div>
                <div class="col-12 md:col-4">
                    <div class="info-box">
                        <span class="label">Expected Delivery</span>
                        <span class="value">{{ order.expectedDeliveryDate }}</span>
                    </div>
                </div>
                <div class="col-12 md:col-4">
                    <div class="info-box">
                        <span class="label">Total Items</span>
                        <span class="value">{{ order.items.length || 0 }}</span>
                    </div>
                </div>
            </div>
            
            <h3 class="text-xl font-semibold mb-3">Order Items</h3>
            <p-table [value]="order.items || []" styleClass="p-datatable-striped">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-item>
                    <tr>
                        <td>{{ item.materialName || 'Material #' + item.materialId }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.unitPrice | currency }}</td>
                        <td>{{ (item.subTotal || item.quantity * item.unitPrice) | currency }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="footer">
                    <tr>
                        <td colspan="3" class="text-right font-bold">Total:</td>
                        <td class="font-bold">{{ calculateTotal() | currency }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="4" class="text-center p-4">No items in this order.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        
        <div class="card" *ngIf="loading">
            <p class="text-center p-4">Loading order details...</p>
        </div>
    `,
    styles: [`
        :host { display: block; padding: 2rem; }
        .card { background: var(--surface-card); border-radius: 12px; padding: 1.5rem; }
        .info-box {
            background: var(--surface-ground);
            border-radius: 8px;
            padding: 1rem;
            display: flex;
            flex-direction: column;
        }
        .info-box .label {
            font-size: 0.85rem;
            color: var(--text-color-secondary);
            margin-bottom: 0.25rem;
        }
        .info-box .value {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-color);
        }
    `]
})
export class SupplyOrderDetailComponent implements OnInit {
    order: SupplyOrder | null = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private orderService: SupplyOrderService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.loadOrder(+params['id']);
            }
        });
    }

    loadOrder(id: number): void {
        this.loading = true;
        this.orderService.getOrderById(id).subscribe({
            next: (order) => {
                this.order = order;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case 'RECUE': return 'success';
            case 'EN_COURS': return 'info';
            case 'EN_ATTENTE': return 'warning';
            default: return 'secondary';
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

    calculateTotal(): number {
        if (!this.order?.items) return 0;
        return this.order.items.reduce((sum, item) =>
            sum + (item.subTotal || (item.quantity * item.unitPrice)), 0);
    }
}
