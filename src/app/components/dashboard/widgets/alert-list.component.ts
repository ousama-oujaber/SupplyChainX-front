import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'warning' | 'info';
    timestamp: Date;
    source: string;
    acknowledged?: boolean;
}

@Component({
    selector: 'app-alert-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="alert-list">
      <div class="alert-item" *ngFor="let alert of alerts" 
           [class]="'priority-' + alert.priority"
           [class.acknowledged]="alert.acknowledged">
        
        <div class="alert-indicator"></div>
        
        <div class="alert-content">
          <div class="alert-header">
            <span class="alert-priority-badge">{{ alert.priority | uppercase }}</span>
            <span class="alert-time">{{ getTimeAgo(alert.timestamp) }}</span>
          </div>
          
          <h4 class="alert-title">{{ alert.title }}</h4>
          <p class="alert-description">{{ alert.description }}</p>
          
          <div class="alert-footer">
            <span class="alert-source">
              <i class="pi pi-map-marker"></i>
              {{ alert.source }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="alert-empty" *ngIf="!alerts.length">
        <i class="pi pi-check-circle"></i>
        <p>No active alerts</p>
      </div>
    </div>
  `,
    styles: [`
    .alert-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .alert-item {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      transition: all 0.2s ease;
    }
    
    .alert-item:hover {
      background: rgba(30, 41, 59, 0.5);
      border-color: rgba(255, 255, 255, 0.08);
    }
    
    .alert-item.priority-critical {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.2);
    }
    
    .alert-item.priority-warning {
      background: rgba(245, 158, 11, 0.08);
      border-color: rgba(245, 158, 11, 0.2);
    }
    
    .alert-item.priority-info {
      background: rgba(59, 130, 246, 0.05);
      border-color: rgba(59, 130, 246, 0.1);
    }
    
    .alert-item.acknowledged {
      opacity: 0.5;
    }
    
    .alert-indicator {
      width: 4px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    
    .priority-critical .alert-indicator { background: #f87171; }
    .priority-warning .alert-indicator { background: #fbbf24; }
    .priority-info .alert-indicator { background: #60a5fa; }
    
    .alert-content {
      flex: 1;
      min-width: 0;
    }
    
    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .alert-priority-badge {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
    }
    
    .priority-critical .alert-priority-badge {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    
    .priority-warning .alert-priority-badge {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }
    
    .priority-info .alert-priority-badge {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }
    
    .alert-time {
      font-size: 0.7rem;
      color: #64748b;
    }
    
    .alert-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 0.25rem 0;
    }
    
    .alert-description {
      font-size: 0.75rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.4;
    }
    
    .alert-footer {
      margin-top: 0.5rem;
    }
    
    .alert-source {
      font-size: 0.7rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .alert-empty {
      text-align: center;
      padding: 2rem;
      color: #64748b;
    }
    
    .alert-empty i {
      font-size: 2rem;
      color: #4ade80;
      margin-bottom: 0.5rem;
    }
    
    .alert-empty p {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class AlertListComponent {
    @Input() alerts: Alert[] = [];

    getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
    
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
    
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }
}
