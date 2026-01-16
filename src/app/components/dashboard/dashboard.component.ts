import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

// Widget Components
import { KpiCardComponent, KpiData } from './widgets/kpi-card.component';
import { AlertListComponent, Alert } from './widgets/alert-list.component';
import { WarehouseStatusComponent, Warehouse } from './widgets/warehouse-status.component';
import { AiForecastComponent, ForecastData, Insight } from './widgets/ai-forecast.component';
import { FlowDiagramComponent, FlowNode, FlowLink } from './widgets/flow-diagram.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        ChartModule,
        KpiCardComponent,
        AlertListComponent,
        WarehouseStatusComponent,
        AiForecastComponent,
        FlowDiagramComponent
    ],
    templateUrl: './dashboard.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class DashboardComponent implements OnInit {
    // Active tab for the right panel
    activeTab: 'warehouses' | 'alerts' = 'alerts';

    // Time range selection
    selectedTimeRange = '7d';
    timeRanges = [
        { label: '24h', value: '24h' },
        { label: '7d', value: '7d' },
        { label: '30d', value: '30d' },
        { label: '90d', value: '90d' }
    ];

    // KPI Data
    kpis: KpiData[] = [];

    // Alerts
    alerts: Alert[] = [];

    // Warehouses
    warehouses: Warehouse[] = [];

    // AI Forecast
    forecastData!: ForecastData;
    insights: Insight[] = [];

    // Flow Diagram
    flowNodes: FlowNode[] = [];
    flowLinks: FlowLink[] = [];

    ngOnInit() {
        this.loadMockData();
    }

    loadMockData() {
        // KPI Data
        this.kpis = [
            {
                label: 'On-Time Delivery',
                value: 94.2,
                suffix: '%',
                trend: 2.1,
                trendDirection: 'up',
                status: 'healthy',
                icon: 'pi-truck',
                sparklineData: [88, 90, 91, 89, 93, 92, 94]
            },
            {
                label: 'Inventory Turnover',
                value: 8.4,
                suffix: 'x',
                trend: -0.3,
                trendDirection: 'down',
                status: 'risk',
                icon: 'pi-sync',
                sparklineData: [8.8, 8.6, 8.5, 8.7, 8.5, 8.3, 8.4]
            },
            {
                label: 'Service Level',
                value: 98.7,
                suffix: '%',
                trend: 0.5,
                trendDirection: 'up',
                status: 'healthy',
                icon: 'pi-star',
                sparklineData: [97, 97.5, 98, 98.2, 98.5, 98.6, 98.7]
            },
            {
                label: 'Active Orders',
                value: 1247,
                trend: 12,
                trendDirection: 'up',
                status: 'healthy',
                icon: 'pi-shopping-cart',
                sparklineData: [980, 1020, 1100, 1150, 1180, 1220, 1247]
            }
        ];

        // Alerts
        this.alerts = [
            {
                id: '1',
                title: 'Critical Stock Level',
                description: 'SKU-4421 (Industrial Bearings) below minimum threshold. Current: 24 units, Min: 100 units.',
                priority: 'critical',
                timestamp: new Date(Date.now() - 15 * 60000),
                source: 'Warehouse A - Berlin'
            },
            {
                id: '2',
                title: 'Shipment Delayed',
                description: 'Container MSKU-7721456 delayed at Rotterdam port. ETA pushed by 48 hours.',
                priority: 'warning',
                timestamp: new Date(Date.now() - 2 * 3600000),
                source: 'Logistics Partner - Maersk'
            },
            {
                id: '3',
                title: 'Quality Hold',
                description: 'Batch QC-2024-0892 placed on quality hold pending inspection results.',
                priority: 'warning',
                timestamp: new Date(Date.now() - 5 * 3600000),
                source: 'Quality Control - Munich'
            },
            {
                id: '4',
                title: 'Supplier Capacity Update',
                description: 'Key supplier (Acme Corp) reported 15% capacity reduction for Q2.',
                priority: 'info',
                timestamp: new Date(Date.now() - 24 * 3600000),
                source: 'Procurement Team'
            }
        ];

        // Warehouses
        this.warehouses = [
            {
                id: 'wh1',
                name: 'Central Distribution Hub',
                location: 'Frankfurt, Germany',
                capacity: 78,
                status: 'operational',
                itemCount: 45200,
                lastUpdated: new Date(Date.now() - 5 * 60000)
            },
            {
                id: 'wh2',
                name: 'Northern Fulfillment',
                location: 'Hamburg, Germany',
                capacity: 92,
                status: 'operational',
                itemCount: 28400,
                lastUpdated: new Date(Date.now() - 12 * 60000)
            },
            {
                id: 'wh3',
                name: 'Southern Logistics',
                location: 'Munich, Germany',
                capacity: 45,
                status: 'maintenance',
                itemCount: 18900,
                lastUpdated: new Date(Date.now() - 30 * 60000)
            },
            {
                id: 'wh4',
                name: 'Eastern Hub',
                location: 'Prague, Czech Republic',
                capacity: 67,
                status: 'operational',
                itemCount: 22100,
                lastUpdated: new Date(Date.now() - 8 * 60000)
            }
        ];

        // AI Forecast Data
        this.forecastData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            actual: [1200, 1350, 1280, 1420, 1380, null, null, null] as any,
            predicted: [1200, 1350, 1280, 1420, 1380, 1450, 1520, 1580],
            upperBound: [1250, 1400, 1350, 1500, 1450, 1550, 1650, 1720],
            lowerBound: [1150, 1300, 1210, 1340, 1310, 1350, 1390, 1440]
        };

        this.insights = [
            {
                id: 'i1',
                title: 'Demand Surge Expected',
                description: 'ML model predicts 15% increase in orders for next week based on seasonal patterns and current trends.',
                confidence: 92,
                impact: 'high',
                category: 'Demand Planning',
                recommendation: 'Increase safety stock for top 20 SKUs by 20%'
            },
            {
                id: 'i2',
                title: 'Supplier Risk Detected',
                description: 'Payment delays from supplier ACME-001 correlate with historical fulfillment issues.',
                confidence: 78,
                impact: 'medium',
                category: 'Risk Management',
                recommendation: 'Consider activating backup supplier for critical components'
            },
            {
                id: 'i3',
                title: 'Route Optimization Available',
                description: 'Analysis shows potential 12% reduction in delivery costs by consolidating EU-West shipments.',
                confidence: 88,
                impact: 'medium',
                category: 'Logistics',
                recommendation: 'Review proposed route changes in Logistics module'
            }
        ];

        // Flow Diagram Nodes
        this.flowNodes = [
            { id: 's1', label: 'Asia Pacific', type: 'source', value: 4500 },
            { id: 's2', label: 'Europe', type: 'source', value: 2800 },
            { id: 's3', label: 'Americas', type: 'source', value: 1900 },
            { id: 'h1', label: 'Central Hub', type: 'hub', value: 5200 },
            { id: 'h2', label: 'Regional DC', type: 'hub', value: 4000 },
            { id: 'd1', label: 'Enterprise', type: 'destination', value: 320 },
            { id: 'd2', label: 'Mid-Market', type: 'destination', value: 890 },
            { id: 'd3', label: 'SMB Retail', type: 'destination', value: 1540 }
        ];

        this.flowLinks = [
            { source: 's1', target: 'h1', value: 4500, status: 'normal' },
            { source: 's2', target: 'h1', value: 2800, status: 'delayed' },
            { source: 's3', target: 'h2', value: 1900, status: 'normal' },
            { source: 'h1', target: 'd1', value: 2100, status: 'normal' },
            { source: 'h1', target: 'd2', value: 3100, status: 'normal' },
            { source: 'h2', target: 'd3', value: 4000, status: 'critical' }
        ];
    }

    getUnacknowledgedAlertCount(): number {
        return this.alerts.filter(a => !a.acknowledged).length;
    }

    getCriticalAlertCount(): number {
        return this.alerts.filter(a => a.priority === 'critical').length;
    }
}
