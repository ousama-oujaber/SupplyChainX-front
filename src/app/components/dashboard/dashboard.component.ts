import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProductionOrderListComponent } from '../production-order-list/production-order-list.component';
import { ProductService } from '../../services/product.service';
import { ProductionOrderService } from '../../services/production-order.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ProductionOrderListComponent],
    templateUrl: './dashboard.component.html',
    styles: [`
    :host { display: block; padding: 2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { text-align: center; }
    .stat-value { font-size: 2.5rem; font-weight: bold; color: var(--primary-color); }
    .stat-label { font-size: 1rem; color: var(--text-color-secondary); }
  `]
})
export class DashboardComponent implements OnInit {
    totalProducts = 0;
    activeOrders = 0;
    totalOrders = 0;

    constructor(
        private productService: ProductService,
        private orderService: ProductionOrderService
    ) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.productService.getAllProducts().subscribe(products => {
            this.totalProducts = products.length;
        });

        this.orderService.getAllProductionOrders().subscribe(orders => {
            this.totalOrders = orders.length;
            this.activeOrders = orders.filter(o => o.status === 'EN_PRODUCTION' || o.status === 'EN_ATTENTE').length;
        });
    }
}
