import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ProductionOrderListComponent } from '../production-order-list/production-order-list.component';
import { ProductService } from '../../services/product.service';
import { ProductionOrderService } from '../../services/production-order.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ProductionOrderListComponent, ChartModule],
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

    chartData: any;
    chartOptions: any;
    pieData: any;
    pieOptions: any;

    constructor(
        private productService: ProductService,
        private orderService: ProductionOrderService
    ) { }

    ngOnInit(): void {
        this.loadStats();
        this.initCharts();
    }

    loadStats(): void {
        this.productService.getAllProducts().subscribe(products => {
            this.totalProducts = products.length;
        });

        this.orderService.getAllProductionOrders().subscribe(orders => {
            this.totalOrders = orders.length;
            this.activeOrders = orders.filter(o => o.status === 'EN_PRODUCTION' || o.status === 'EN_ATTENTE').length;
            this.updatePieChart(orders);
        });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                {
                    label: 'Production Costs',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.pieOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    updatePieChart(orders: any[]) {
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        const documentStyle = getComputedStyle(document.documentElement);

        this.pieData = {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        };
    }
}
