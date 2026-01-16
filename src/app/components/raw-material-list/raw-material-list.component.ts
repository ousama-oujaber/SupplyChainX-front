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
import { RawMaterial } from '../../models/models';

@Component({
    selector: 'app-raw-material-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule, TableModule, ButtonModule,
        TagModule, TooltipModule, ConfirmDialogModule, ToastModule, InputTextModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="page-container">
            <!-- Stats Section -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Total Materials</div>
                        <div class="stat-value">{{ materials.length }}</div>
                    </div>
                    <div class="stat-icon blue"><i class="pi pi-box"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Low Stock</div>
                        <div class="stat-value">{{ getLowStockCount() }}</div>
                    </div>
                    <div class="stat-icon amber"><i class="pi pi-exclamation-triangle"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">Out of Stock</div>
                        <div class="stat-value">{{ getOutOfStockCount() }}</div>
                    </div>
                    <div class="stat-icon red"><i class="pi pi-times-circle"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div class="stat-label">In Stock</div>
                        <div class="stat-value">{{ getInStockCount() }}</div>
                    </div>
                    <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
                </div>
            </div>

            <!-- Main Card -->
            <div class="card-content">
                <div class="page-header">
                    <div>
                        <h2 class="page-title">Raw Materials</h2>
                        <p class="page-subtitle">Manage raw material inventory</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="search-box">
                            <i class="pi pi-search search-icon"></i>
                            <input pInputText type="text" (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                                placeholder="Search materials..." class="w-64" />
                        </div>
                        <p-button label="Add Material" icon="pi pi-plus" routerLink="/raw-materials/new"
                            styleClass="p-button-rounded"></p-button>
                    </div>
                </div>

                <p-table #dt [value]="materials" [globalFilterFields]="['name', 'unit']" [paginator]="true" [rows]="10"
                    [rowsPerPageOptions]="[5, 10, 25]" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th class="w-[60px]">ID</th>
                            <th>Material</th>
                            <th class="w-[100px]">Stock</th>
                            <th class="w-[100px]">Min Stock</th>
                            <th class="w-[100px]">Unit</th>
                            <th class="w-[120px]">Status</th>
                            <th class="w-[100px] text-center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-material>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="text-gray-500 font-mono">#{{ material.idMaterial }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400">
                                        <i class="pi pi-box"></i>
                                    </div>
                                    <span class="font-semibold text-white">{{ material.name }}</span>
                                </div>
                            </td>
                            <td class="font-medium" [ngClass]="{'text-red-400': material.stock <= 0, 'text-amber-400': material.stock < material.stockMin, 'text-white': material.stock >= material.stockMin}">
                                {{ material.stock }}
                            </td>
                            <td class="text-gray-400">{{ material.stockMin }}</td>
                            <td class="text-gray-300">{{ material.unit }}</td>
                            <td>
                                <span class="status-badge" [ngClass]="getStockClass(material)">{{ getStockLabel(material) }}</span>
                            </td>
                            <td class="text-center">
                                <div class="action-btn-group justify-center">
                                    <button [routerLink]="['/raw-materials/edit', material.idMaterial]" class="action-btn edit" pTooltip="Edit">
                                        <i class="pi pi-pencil text-sm"></i>
                                    </button>
                                    <button (click)="confirmDelete(material)" class="action-btn delete" pTooltip="Delete">
                                        <i class="pi pi-trash text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="text-center py-8">
                                <div class="flex flex-col items-center gap-3 text-gray-400">
                                    <i class="pi pi-inbox text-4xl"></i>
                                    <p>No materials found</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
        <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
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
