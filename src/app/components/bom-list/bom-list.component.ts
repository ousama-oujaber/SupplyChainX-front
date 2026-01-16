import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BomService } from '../../services/bom.service';
import { BillOfMaterial } from '../../models/models';

@Component({
    selector: 'app-bom-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    templateUrl: './bom-list.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class BomListComponent implements OnInit {
    boms: BillOfMaterial[] = [];

    constructor(private bomService: BomService, private router: Router) { }

    ngOnInit(): void {
        this.loadBoms();
    }

    loadBoms(): void {
        this.bomService.getAllBillOfMaterials().subscribe({
            next: (data) => {
                this.boms = data;
            },
            error: (e) => console.error(e)
        });
    }

    addBom(): void {
        this.router.navigate(['/bom/new']);
    }

    editBom(id: number): void {
        this.router.navigate(['/bom/edit', id]);
    }

    deleteBom(id: number): void {
        if (confirm('Are you sure you want to delete this BOM?')) {
            this.bomService.deleteBillOfMaterial(id).subscribe({
                next: () => this.loadBoms(),
                error: (e) => console.error(e)
            });
        }
    }

    getAvailableCount(): number {
        return this.boms.filter(b => b.materialAvailable).length;
    }

    getUnavailableCount(): number {
        return this.boms.filter(b => !b.materialAvailable).length;
    }
}
