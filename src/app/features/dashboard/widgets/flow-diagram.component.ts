import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FlowNode {
    id: string;
    label: string;
    type: 'source' | 'hub' | 'destination';
    value?: number;
}

export interface FlowLink {
    source: string;
    target: string;
    value: number;
    status?: 'normal' | 'delayed' | 'critical';
}

@Component({
    selector: 'app-flow-diagram',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flow-diagram">
      <div class="flow-header">
        <h3 class="flow-title">
          <i class="pi pi-sitemap"></i>
          Transport Flow Overview
        </h3>
        <div class="flow-legend">
          <span class="legend-item normal"><span class="legend-line"></span> On Schedule</span>
          <span class="legend-item delayed"><span class="legend-line"></span> Delayed</span>
          <span class="legend-item critical"><span class="legend-line"></span> Critical</span>
        </div>
      </div>
      
      <div class="flow-content">
        <!-- Simplified Flow Visualization -->
        <div class="flow-columns">
          <!-- Sources Column -->
          <div class="flow-column">
            <span class="column-label">SUPPLIERS</span>
            <div class="flow-nodes">
              <div class="flow-node source" *ngFor="let node of getNodesByType('source')">
                <div class="node-icon"><i class="pi pi-building"></i></div>
                <div class="node-info">
                  <span class="node-label">{{ node.label }}</span>
                  <span class="node-value" *ngIf="node.value">{{ node.value | number }} units</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Flow Lines -->
          <div class="flow-lines">
            <div class="flow-line" *ngFor="let link of links" [class]="'status-' + (link.status || 'normal')">
              <div class="line-path">
                <div class="line-particle"></div>
              </div>
              <span class="line-value">{{ link.value | number }}</span>
            </div>
          </div>
          
          <!-- Hub Column -->
          <div class="flow-column">
            <span class="column-label">DISTRIBUTION</span>
            <div class="flow-nodes">
              <div class="flow-node hub" *ngFor="let node of getNodesByType('hub')">
                <div class="node-icon"><i class="pi pi-inbox"></i></div>
                <div class="node-info">
                  <span class="node-label">{{ node.label }}</span>
                  <span class="node-value" *ngIf="node.value">{{ node.value | number }} units</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Flow Lines 2 -->
          <div class="flow-lines">
            <div class="flow-line status-normal" *ngFor="let i of [1,2,3]">
              <div class="line-path">
                <div class="line-particle"></div>
              </div>
            </div>
          </div>
          
          <!-- Destinations Column -->
          <div class="flow-column">
            <span class="column-label">CUSTOMERS</span>
            <div class="flow-nodes">
              <div class="flow-node destination" *ngFor="let node of getNodesByType('destination')">
                <div class="node-icon"><i class="pi pi-users"></i></div>
                <div class="node-info">
                  <span class="node-label">{{ node.label }}</span>
                  <span class="node-value" *ngIf="node.value">{{ node.value | number }} orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Summary Stats -->
        <div class="flow-summary">
          <div class="summary-stat">
            <span class="stat-value">{{ getTotalFlow() | number }}</span>
            <span class="stat-label">Units in Transit</span>
          </div>
          <div class="summary-stat">
            <span class="stat-value">{{ getOnTimePercentage() }}%</span>
            <span class="stat-label">On-Time Rate</span>
          </div>
          <div class="summary-stat">
            <span class="stat-value">{{ getDelayedCount() }}</span>
            <span class="stat-label">Delayed Shipments</span>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .flow-diagram {
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 1rem;
      padding: 1.25rem;
      height: 100%;
    }
    
    .flow-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .flow-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .flow-title i { color: #a78bfa; }
    
    .flow-legend {
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
    
    .legend-line {
      width: 20px;
      height: 3px;
      border-radius: 2px;
    }
    
    .legend-item.normal .legend-line { background: #4ade80; }
    .legend-item.delayed .legend-line { background: #fbbf24; }
    .legend-item.critical .legend-line { background: #f87171; }
    
    .flow-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .flow-columns {
      display: flex;
      align-items: stretch;
      gap: 0.5rem;
    }
    
    .flow-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .column-label {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #64748b;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    
    .flow-nodes {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .flow-node {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .node-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }
    
    .flow-node.source .node-icon { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
    .flow-node.hub .node-icon { background: rgba(167, 139, 250, 0.15); color: #a78bfa; }
    .flow-node.destination .node-icon { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
    
    .node-info {
      display: flex;
      flex-direction: column;
    }
    
    .node-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    .node-value {
      font-size: 0.65rem;
      color: #64748b;
    }
    
    .flow-lines {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
      width: 60px;
      padding: 0 0.5rem;
    }
    
    .flow-line {
      position: relative;
      height: 3px;
      border-radius: 2px;
      overflow: hidden;
    }
    
    .line-path {
      position: absolute;
      inset: 0;
    }
    
    .flow-line.status-normal .line-path { background: rgba(74, 222, 128, 0.3); }
    .flow-line.status-delayed .line-path { background: rgba(251, 191, 36, 0.3); }
    .flow-line.status-critical .line-path { background: rgba(248, 113, 113, 0.3); }
    
    .line-particle {
      position: absolute;
      width: 10px;
      height: 100%;
      border-radius: 2px;
      animation: flowParticle 2s linear infinite;
    }
    
    .status-normal .line-particle { background: #4ade80; }
    .status-delayed .line-particle { background: #fbbf24; }
    .status-critical .line-particle { background: #f87171; }
    
    @keyframes flowParticle {
      0% { left: -10px; }
      100% { left: 100%; }
    }
    
    .line-value {
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.6rem;
      color: #64748b;
      white-space: nowrap;
    }
    
    .flow-summary {
      display: flex;
      justify-content: center;
      gap: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .summary-stat {
      text-align: center;
    }
    
    .summary-stat .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: #e2e8f0;
    }
    
    .summary-stat .stat-label {
      font-size: 0.65rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `]
})
export class FlowDiagramComponent {
    @Input() nodes: FlowNode[] = [];
    @Input() links: FlowLink[] = [];

    getNodesByType(type: 'source' | 'hub' | 'destination'): FlowNode[] {
        return this.nodes.filter(n => n.type === type);
    }

    getTotalFlow(): number {
        return this.links.reduce((sum, link) => sum + link.value, 0);
    }

    getOnTimePercentage(): number {
        const total = this.links.length;
        if (total === 0) return 100;
        const onTime = this.links.filter(l => l.status === 'normal' || !l.status).length;
        return Math.round((onTime / total) * 100);
    }

    getDelayedCount(): number {
        return this.links.filter(l => l.status === 'delayed' || l.status === 'critical').length;
    }
}
