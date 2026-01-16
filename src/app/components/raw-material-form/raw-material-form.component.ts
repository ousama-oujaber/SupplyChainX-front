import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RawMaterialService } from '../../services/raw-material.service';
import { RawMaterial } from '../../models/models';

@Component({
    selector: 'app-raw-material-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="form-page">
            <div class="form-card">
                <!-- Header -->
                <div class="form-header">
                    <div class="form-header-icon green">
                        <i class="pi pi-box"></i>
                    </div>
                    <div class="form-header-content">
                        <h1>{{ isEditMode ? 'Edit Material' : 'Add New Material' }}</h1>
                        <p>{{ isEditMode ? 'Update material details' : 'Add a new raw material to inventory' }}</p>
                    </div>
                </div>

                <!-- Form Body -->
                <form [formGroup]="materialForm" (ngSubmit)="onSubmit()">
                    <div class="form-body">
                        
                        <!-- Material Details Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-info-circle"></i>
                                Material Details
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="name">Material Name <span class="required">*</span></label>
                                    <input pInputText id="name" formControlName="name" placeholder="Enter material name">
                                    <span class="form-error" *ngIf="materialForm.get('name')?.invalid && materialForm.get('name')?.touched">
                                        Name is required
                                    </span>
                                </div>
                                <div class="form-field">
                                    <label for="unit">Unit of Measure <span class="required">*</span></label>
                                    <input pInputText id="unit" formControlName="unit" placeholder="e.g., kg, pcs, liters">
                                </div>
                            </div>
                        </div>

                        <!-- Stock Information Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-chart-bar"></i>
                                Stock Information
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="stock">Current Stock <span class="required">*</span></label>
                                    <p-inputNumber id="stock" formControlName="stock" [min]="0" 
                                                   [showButtons]="true" placeholder="0"></p-inputNumber>
                                    <span class="form-hint">Available quantity in inventory</span>
                                </div>
                                <div class="form-field">
                                    <label for="stockMin">Minimum Stock Level <span class="required">*</span></label>
                                    <p-inputNumber id="stockMin" formControlName="stockMin" [min]="0" 
                                                   [showButtons]="true" placeholder="0"></p-inputNumber>
                                    <span class="form-hint">Alert when stock falls below this level</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" routerLink="/raw-materials">
                            <i class="pi pi-times"></i>
                            Cancel
                        </button>
                        <button type="submit" class="btn-save" [disabled]="materialForm.invalid">
                            <i class="pi pi-check"></i>
                            {{ isEditMode ? 'Update Material' : 'Add Material' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    styles: [`:host { display: block; }`]
})
export class RawMaterialFormComponent implements OnInit {
    materialForm!: FormGroup;
    isEditMode = false;
    materialId?: number;

    constructor(
        private fb: FormBuilder,
        private materialService: RawMaterialService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.materialForm = this.fb.group({
            name: ['', Validators.required],
            unit: ['', Validators.required],
            stock: [0, [Validators.required, Validators.min(0)]],
            stockMin: [0, [Validators.required, Validators.min(0)]]
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.materialId = +params['id'];
                this.loadMaterial();
            }
        });
    }

    loadMaterial(): void {
        this.materialService.getMaterialById(this.materialId!).subscribe({
            next: (material) => this.materialForm.patchValue(material),
            error: () => this.router.navigate(['/raw-materials'])
        });
    }

    onSubmit(): void {
        if (this.materialForm.invalid) return;

        const material: RawMaterial = this.materialForm.value;

        const operation = this.isEditMode
            ? this.materialService.updateMaterial(this.materialId!, material)
            : this.materialService.createMaterial(material);

        operation.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Material ${this.isEditMode ? 'updated' : 'created'} successfully` });
                setTimeout(() => this.router.navigate(['/raw-materials']), 1000);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save material' })
        });
    }
}
