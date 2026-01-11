import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BomService } from '../../services/bom.service';
import { BillOfMaterial } from '../../models/models';

@Component({
    selector: 'app-bom-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './bom-form.component.html',
    styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; margin-right: 10px; }
    button:disabled { background-color: #ccc; }
    button.cancel { background-color: #6c757d; }
  `]
})
export class BomFormComponent implements OnInit {
    bom: BillOfMaterial = {
        productId: 0,
        productName: '',
        materialId: 0,
        materialName: '',
        quantity: 0,
        materialAvailable: false
    };
    isEditMode = false;

    constructor(
        private bomService: BomService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.bomService.getBillOfMaterialById(+id).subscribe({
                next: (data) => this.bom = data,
                error: (e) => console.error(e)
            });
        }
    }

    onSubmit(): void {
        if (this.isEditMode && this.bom.idBOM) {
            this.bomService.updateBillOfMaterial(this.bom.idBOM, this.bom).subscribe({
                next: () => this.router.navigate(['/bom']),
                error: (e) => console.error(e)
            });
        } else {
            this.bomService.createBillOfMaterial(this.bom).subscribe({
                next: () => this.router.navigate(['/bom']),
                error: (e) => console.error(e)
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/bom']);
    }
}
