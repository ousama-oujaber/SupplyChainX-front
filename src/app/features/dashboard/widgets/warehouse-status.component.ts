import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    capacity: number;  // 0-100 percentage
    status: 'operational' | 'maintenance' | 'critical';
    itemCount: number;
    lastUpdated: Date;
}

@Component({
    selector: 'app-warehouse-status',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="warehouse-list">
      <div class="warehouse-item" *ngFor="let wh of warehouses" 
           [class]="'status-' + wh.status">
        
        <div class="warehouse-header">
          <div class="warehouse-info">
            <h4 class="warehouse-name">{{ wh.name }}</h4>
            <span class="warehouse-location">
              <i class="pi pi-map-marker"></i>
              {{ wh.location }}
            </span>
          </div>
          <div class="warehouse-status-badge">
            <span class="status-dot"></span>
            {{ wh.status | titlecase }}
          </div>
        </div>
        
        <div class="warehouse-capacity">
          <div class="capacity-header">
            <span class="capacity-label">Capacity</span>
            <span class="capacity-value">{{ wh.capacity }}%</span>
          </div>
          <div class="capacity-bar">
            <div class="capacity-fill" 
                 [style.width.%]="wh.capacity"
                 [class]="getCapacityClass(wh.capacity)">
            </div>
          </div>
        </div>
        
        <div class="warehouse-footer">
          <span class="item-count">
            <i class="pi pi-box"></i>
            {{ wh.itemCount | number }} items
          </span>
          <span class="last-updated">
            Updated {{ getTimeAgo(wh.lastUpdated) }}
          </span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .warehouse-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .warehouse-item {
      padding: 1rem;
      border-radius: 0.75rem;
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      transition: all 0.2s ease;
    }
    
    .warehouse-item:hover {
      background: rgba(30, 41, 59, 0.5);
      border-color: rgba(255, 255, 255, 0.08);
    }
    
    .warehouse-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    
    .warehouse-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 0.25rem 0;
    }
    
    .warehouse-location {
      font-size: 0.7rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .warehouse-status-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
    }
    
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    
    .status-operational .status-dot { background: #4ade80; }
    .status-maintenance .status-dot { background: #fbbf24; }
    .status-critical .status-dot { background: #f87171; }
    
    .warehouse-capacity {
      margin-bottom: 0.75rem;
    }
    
    .capacity-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.375rem;
    }
    
    .capacity-label {
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .capacity-value {
      font-size: 0.75rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    .capacity-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .capacity-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }
    
    .capacity-fill.low { background: #4ade80; }
    .capacity-fill.medium { background: #fbbf24; }
    .capacity-fill.high { background: #f87171; }
    
    .warehouse-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .item-count {
      font-size: 0.75rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .last-updated {
      font-size: 0.65rem;
      color: #64748b;
    }
  `]
})
export class WarehouseStatusComponent {
    @Input() warehouses: Warehouse[] = [];

    getCapacityClass(capacity: number): string {
        if (capacity >= 90) return 'high';
        if (capacity >= 70) return 'medium';
        return 'low';
    }

    getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
    
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
    
        return 'yesterday';
    }
}
