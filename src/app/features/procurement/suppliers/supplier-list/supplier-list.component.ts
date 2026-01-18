import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../../../shared/models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

import { InputTextModule } from 'primeng/inputtext';

import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-supplier-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, RatingModule, FormsModule, InputTextModule, TooltipModule],
    providers: [ConfirmationService, MessageService],
    templateUrl: './supplier-list.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class SupplierListComponent implements OnInit {
    suppliers: Supplier[] = [];

    constructor(
        private supplierService: SupplierService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadSuppliers();
    }

    loadSuppliers(): void {
        this.supplierService.getAllSuppliers().subscribe({
            next: (data) => this.suppliers = data,
            error: (e) => {
                console.error(e);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load suppliers' });
            }
        });
    }

    addSupplier(): void {
        this.router.navigate(['/suppliers/new']);
    }

    editSupplier(id: number): void {
        this.router.navigate(['/suppliers/edit', id]);
    }

    deleteSupplier(id: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this supplier?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.supplierService.deleteSupplier(id).subscribe({
                    next: () => {
                        this.loadSuppliers();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier deleted successfully' });
                    },
                    error: (e) => {
                        console.error(e);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete supplier' });
                    }
                });
            }
        });
    }

    // Stats helper methods
    getTopRatedCount(): number {
        return this.suppliers.filter(s => s.rating >= 4).length;
    }

    getAvgLeadTime(): number {
        if (this.suppliers.length === 0) return 0;
        const total = this.suppliers.reduce((sum, s) => sum + (s.leadTime || 0), 0);
        return Math.round(total / this.suppliers.length);
    }

    getAvgRating(): string {
        if (this.suppliers.length === 0) return '0.0';
        const total = this.suppliers.reduce((sum, s) => sum + (s.rating || 0), 0);
        return (total / this.suppliers.length).toFixed(1);
    }

    getLeadTimeClass(leadTime: number): string {
        if (leadTime <= 3) return 'success';
        if (leadTime <= 7) return 'warning';
        return 'danger';
    }
}
