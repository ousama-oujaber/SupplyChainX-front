import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { RawMaterialService } from '../../services/raw-material.service';
import { RawMaterial } from '../../../../shared/models/models';

@Component({
    selector: 'app-raw-material-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="list-page">
            <!-- Header -->
            <div class="list-header">
                <div class="list-header-left">
                    <div class="list-icon green">
                        <i class="pi pi-box"></i>
                    </div>
                    <div>
                        <h1 class="list-title">Raw Materials</h1>
                        <p class="list-subtitle">Manage raw material inventory and stock levels</p>
                    </div>
                </div>
                <div class="list-actions">
                    <button class="btn-primary" routerLink="/raw-materials/new">
                        <i class="pi pi-plus"></i>
                        Add Material
                    </button>
                </div>
            </div>

            <!-- Stats -->
            <div class="list-stats">
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
                        <i class="pi pi-box"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ materials.length }}</div>
                        <div class="list-stat-label">Total Materials</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(74, 222, 128, 0.15); color: #4ade80;">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getInStockCount() }}</div>
                        <div class="list-stat-label">In Stock</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(251, 191, 36, 0.15); color: #fbbf24;">
                        <i class="pi pi-exclamation-triangle"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getLowStockCount() }}</div>
                        <div class="list-stat-label">Low Stock</div>
                    </div>
                </div>
                <div class="list-stat">
                    <div class="list-stat-icon" style="background: rgba(248, 113, 113, 0.15); color: #f87171;">
                        <i class="pi pi-times-circle"></i>
                    </div>
                    <div class="list-stat-content">
                        <div class="list-stat-value">{{ getOutOfStockCount() }}</div>
                        <div class="list-stat-label">Out of Stock</div>
                    </div>
                </div>
            </div>

            <!-- Table Container -->
            <div class="table-container">
                <div class="table-toolbar" style="padding: 1rem;">
                    <div class="toolbar-left">
                        <div class="toolbar-search">
                            <i class="pi pi-search"></i>
                            <input type="text" placeholder="Search materials..." 
                                   (input)="dt.filterGlobal($any($event.target).value, 'contains')">
                        </div>
                    </div>
                </div>

                <p-table #dt [value]="materials" [globalFilterFields]="['name', 'unit']" 
                         [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 60px">ID</th>
                            <th>Material</th>
                            <th style="width: 100px">Stock</th>
                            <th style="width: 100px">Min Stock</th>
                            <th style="width: 80px">Unit</th>
                            <th style="width: 120px">Status</th>
                            <th style="width: 100px; text-align: center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-material>
                        <tr>
                            <td class="text-slate-500">#{{ material.idMaterial }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400">
                                        <i class="pi pi-box"></i>
                                    </div>
                                    <span class="font-medium text-white">{{ material.name }}</span>
                                </div>
                            </td>
                            <td class="font-semibold" [ngClass]="{'text-red-400': material.stock <= 0, 'text-amber-400': material.stock < material.stockMin && material.stock > 0, 'text-white': material.stock >= material.stockMin}">
                                {{ material.stock }}
                            </td>
                            <td class="text-slate-400">{{ material.stockMin }}</td>
                            <td class="text-slate-400">{{ material.unit }}</td>
                            <td>
                                <span class="status-pill" [ngClass]="getStockClass(material)">
                                    <span class="status-dot"></span>
                                    {{ getStockLabel(material) }}
                                </span>
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="row-action edit" [routerLink]="['/raw-materials/edit', material.idMaterial]" title="Edit">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button class="row-action delete" (click)="confirmDelete(material)" title="Delete">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7">
                                <div class="empty-state">
                                    <i class="pi pi-box"></i>
                                    <p>No materials found</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
        <p-confirmDialog header="Confirm Deletion" icon="pi pi-exclamation-triangle"></p-confirmDialog>
        <p-toast position="bottom-right"></p-toast>
    `,
    styles: [`:host { display: block; }`]
})
export class RawMaterialListComponent implements OnInit {
    materials: RawMaterial[] = [];

    constructor(
        private materialService: RawMaterialService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadMaterials();
    }

    loadMaterials(): void {
        this.materialService.getAllMaterials().subscribe({
            next: (data) => this.materials = data,
            error: (err) => console.error('Error loading materials:', err)
        });
    }

    getLowStockCount(): number {
        return this.materials.filter(m => m.stock > 0 && m.stock < m.stockMin).length;
    }

    getOutOfStockCount(): number {
        return this.materials.filter(m => m.stock <= 0).length;
    }

    getInStockCount(): number {
        return this.materials.filter(m => m.stock >= m.stockMin).length;
    }

    getStockClass(material: RawMaterial): string {
        if (material.stock <= 0) return 'danger';
        if (material.stock < material.stockMin) return 'warning';
        return 'success';
    }

    getStockLabel(material: RawMaterial): string {
        if (material.stock <= 0) return 'Out of Stock';
        if (material.stock < material.stockMin) return 'Low Stock';
        return 'In Stock';
    }

    confirmDelete(material: RawMaterial): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${material.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.materialService.deleteMaterial(material.idMaterial!).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Material deleted successfully' });
                        this.loadMaterials();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete material' })
                });
            }
        });
    }
}
