import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProductionOrderService } from '../../services/production-order.service';
import { ProductionOrder } from '../../models/models';

@Component({
    selector: 'app-production-order-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule],
    templateUrl: './production-order-list.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class ProductionOrderListComponent implements OnInit {
    orders: ProductionOrder[] = [];

    constructor(private orderService: ProductionOrderService, private router: Router) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.orderService.getAllProductionOrders().subscribe({
            next: (data) => {
                this.orders = data;
            },
            error: (e) => console.error(e)
        });
    }

    addOrder(): void {
        this.router.navigate(['/production-orders/new']);
    }

    editOrder(id: number): void {
        this.router.navigate(['/production-orders/edit', id]);
    }

    deleteOrder(id: number): void {
        if (confirm('Are you sure you want to cancel this order?')) {
            this.orderService.cancelProductionOrder(id).subscribe({
                next: () => this.loadOrders(),
                error: (e) => console.error(e)
            });
        }
    }

    getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | undefined {
        switch (status) {
            case 'TERMINE':
                return 'success';
            case 'EN_PRODUCTION':
                return 'info';
            case 'EN_ATTENTE':
                return 'warning';
            default:
                return undefined;
        }
    }

    getInProgressCount(): number {
        return this.orders.filter(o => o.status === 'EN_PRODUCTION').length;
    }

    getCompletedCount(): number {
        return this.orders.filter(o => o.status === 'TERMINE').length;
    }

    getPriorityCount(): number {
        return this.orders.filter(o => o.isPriority).length;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'TERMINE': return 'success';
            case 'EN_PRODUCTION': return 'info';
            case 'EN_ATTENTE': return 'warning';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'TERMINE': return 'Completed';
            case 'EN_PRODUCTION': return 'In Progress';
            case 'EN_ATTENTE': return 'Pending';
            default: return status;
        }
    }
}
