import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
    selector: 'app-supplier-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, RatingModule, FloatLabelModule],
    templateUrl: './supplier-form.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class SupplierFormComponent implements OnInit {
    supplier: Supplier = {
        name: '',
        contact: '',
        rating: 0,
        leadTime: 0
    };
    isEditMode = false;

    constructor(
        private supplierService: SupplierService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.supplierService.getSupplierById(+id).subscribe({
                next: (data) => this.supplier = data,
                error: (e) => console.error(e)
            });
        }
    }

    onSubmit(): void {
        if (this.isEditMode && this.supplier.idSupplier) {
            this.supplierService.updateSupplier(this.supplier.idSupplier, this.supplier).subscribe({
                next: () => this.router.navigate(['/suppliers']),
                error: (e) => console.error(e)
            });
        } else {
            this.supplierService.createSupplier(this.supplier).subscribe({
                next: () => this.router.navigate(['/suppliers']),
                error: (e) => console.error(e)
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/suppliers']);
    }
}
