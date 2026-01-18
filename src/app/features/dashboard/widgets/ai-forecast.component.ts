import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

export interface ForecastData {
    labels: string[];
    actual: number[];
    predicted: number[];
    upperBound: number[];
    lowerBound: number[];
}

export interface Insight {
    id: string;
    title: string;
    description: string;
    confidence: number; // 0-100
    impact: 'high' | 'medium' | 'low';
    category: string;
    recommendation?: string;
}

@Component({
    selector: 'app-ai-forecast',
    standalone: true,
    imports: [CommonModule, ChartModule],
    template: `
    <div class="ai-forecast">
      <!-- Chart Section -->
      <div class="forecast-chart-container">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="pi pi-chart-line"></i>
            Demand Forecast
          </h3>
          <div class="chart-legend">
            <span class="legend-item actual"><span class="legend-dot"></span> Actual</span>
            <span class="legend-item predicted"><span class="legend-dot"></span> Predicted</span>
            <span class="legend-item confidence"><span class="legend-dot"></span> Confidence Band</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <p-chart type="line" [data]="chartData" [options]="chartOptions" height="250px"></p-chart>
        </div>
      </div>
      
      <!-- Insights Section -->
      <div class="insights-section">
        <h4 class="insights-title">
          <i class="pi pi-lightbulb"></i>
          AI-Driven Insights
        </h4>
        
        <div class="insights-grid">
          <div class="insight-card" *ngFor="let insight of insights" [class]="'impact-' + insight.impact">
            <div class="insight-header">
              <span class="insight-category">{{ insight.category }}</span>
              <span class="confidence-badge" [attr.title]="'AI Confidence: ' + insight.confidence + '%'">
                {{ insight.confidence }}% confidence
              </span>
            </div>
            
            <h5 class="insight-title">{{ insight.title }}</h5>
            <p class="insight-description">{{ insight.description }}</p>
            
            <div class="insight-recommendation" *ngIf="insight.recommendation">
              <i class="pi pi-arrow-right"></i>
              {{ insight.recommendation }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .ai-forecast {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .forecast-chart-container {
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 1rem;
      padding: 1.25rem;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .chart-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .chart-title i {
      color: #60a5fa;
    }
    
    .chart-legend {
      display: flex;
      gap: 1rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.7rem;
      color: #94a3b8;
    }
    
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
    }
    
    .legend-item.actual .legend-dot { background: #4ade80; }
    .legend-item.predicted .legend-dot { background: #60a5fa; }
    .legend-item.confidence .legend-dot { background: rgba(96, 165, 250, 0.2); }
    
    .chart-wrapper {
      height: 250px;
    }
    
    .insights-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .insights-title i {
      color: #fbbf24;
    }
    
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .insight-card {
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 0.75rem;
      padding: 1rem;
      transition: all 0.2s ease;
    }
    
    .insight-card:hover {
      background: rgba(30, 41, 59, 0.5);
      border-color: rgba(255, 255, 255, 0.08);
    }
    
    .insight-card.impact-high { border-left: 3px solid #f87171; }
    .insight-card.impact-medium { border-left: 3px solid #fbbf24; }
    .insight-card.impact-low { border-left: 3px solid #4ade80; }
    
    .insight-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .insight-category {
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }
    
    .confidence-badge {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      background: rgba(96, 165, 250, 0.15);
      color: #60a5fa;
      cursor: help;
    }
    
    .insight-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 0.375rem 0;
    }
    
    .insight-description {
      font-size: 0.75rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }
    
    .insight-recommendation {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.7rem;
      color: #4ade80;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
  `]
})
export class AiForecastComponent implements OnInit {
    @Input() forecastData!: ForecastData;
    @Input() insights: Insight[] = [];

    chartData: any;
    chartOptions: any;

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        if (!this.forecastData) return;

        this.chartData = {
            labels: this.forecastData.labels,
            datasets: [
                {
                    label: 'Actual',
                    data: this.forecastData.actual,
                    borderColor: '#4ade80',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: '#4ade80'
                },
                {
                    label: 'Predicted',
                    data: this.forecastData.predicted,
                    borderColor: '#60a5fa',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: '#60a5fa'
                },
                {
                    label: 'Upper Bound',
                    data: this.forecastData.upperBound,
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    fill: '+1',
                    tension: 0.3,
                    pointRadius: 0
                },
                {
                    label: 'Lower Bound',
                    data: this.forecastData.lowerBound,
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#64748b', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#64748b', font: { size: 10 } }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };
    }
}
