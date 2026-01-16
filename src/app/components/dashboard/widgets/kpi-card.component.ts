import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KpiData {
    value: number | string;
    label: string;
    trend?: number; // percentage change
    trendDirection?: 'up' | 'down' | 'neutral';
    status?: 'healthy' | 'risk' | 'critical';
    sparklineData?: number[];
    icon?: string;
    suffix?: string;
    prefix?: string;
}

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="kpi-card" [class]="'status-' + (data.status || 'healthy')">
      <div class="kpi-header">
        <span class="kpi-label">{{ data.label }}</span>
        <div class="kpi-icon" *ngIf="data.icon">
          <i [class]="'pi ' + data.icon"></i>
        </div>
      </div>
      
      <div class="kpi-body">
        <div class="kpi-value-container">
          <span class="kpi-prefix" *ngIf="data.prefix">{{ data.prefix }}</span>
          <span class="kpi-value">{{ data.value }}</span>
          <span class="kpi-suffix" *ngIf="data.suffix">{{ data.suffix }}</span>
        </div>
        
        <div class="kpi-trend" *ngIf="data.trend !== undefined" 
             [class.positive]="data.trendDirection === 'up'"
             [class.negative]="data.trendDirection === 'down'"
             [class.neutral]="data.trendDirection === 'neutral'">
          <i class="pi" [class.pi-arrow-up]="data.trendDirection === 'up'"
                        [class.pi-arrow-down]="data.trendDirection === 'down'"
                        [class.pi-minus]="data.trendDirection === 'neutral'"></i>
          <span>{{ data.trend > 0 ? '+' : '' }}{{ data.trend }}%</span>
        </div>
      </div>
      
      <!-- Sparkline -->
      <div class="kpi-sparkline" *ngIf="data.sparklineData?.length">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline 
            [attr.points]="getSparklinePoints(data.sparklineData!)"
            fill="none"
            [attr.stroke]="getSparklineColor()"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  `,
    styles: [`
    .kpi-card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 1.25rem;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.3);
    }
    
    .kpi-card.status-healthy { border-left: 3px solid #4ade80; }
    .kpi-card.status-risk { border-left: 3px solid #fbbf24; }
    .kpi-card.status-critical { border-left: 3px solid #f87171; }
    
    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    
    .kpi-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      font-weight: 600;
    }
    
    .kpi-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }
    
    .kpi-body {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }
    
    .kpi-value-container {
      display: flex;
      align-items: baseline;
    }
    
    .kpi-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: #f8fafc;
      line-height: 1;
    }
    
    .kpi-prefix, .kpi-suffix {
      font-size: 1.25rem;
      font-weight: 600;
      color: #94a3b8;
    }
    
    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
    }
    
    .kpi-trend.positive {
      color: #4ade80;
      background: rgba(74, 222, 128, 0.1);
    }
    
    .kpi-trend.negative {
      color: #f87171;
      background: rgba(248, 113, 113, 0.1);
    }
    
    .kpi-trend.neutral {
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.1);
    }
    
    .kpi-sparkline {
      margin-top: 1rem;
      height: 30px;
      opacity: 0.7;
    }
    
    .kpi-sparkline svg {
      width: 100%;
      height: 100%;
    }
  `]
})
export class KpiCardComponent {
    @Input() data!: KpiData;

    getSparklinePoints(values: number[]): string {
        if (!values.length) return '';
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;

        return values.map((v, i) => {
            const x = (i / (values.length - 1)) * 100;
            const y = 30 - ((v - min) / range) * 28;
            return `${x},${y}`;
        }).join(' ');
    }

    getSparklineColor(): string {
        switch (this.data.status) {
            case 'critical': return '#f87171';
            case 'risk': return '#fbbf24';
            default: return '#4ade80';
        }
    }
}
