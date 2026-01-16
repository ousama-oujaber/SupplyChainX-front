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
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Material' : 'Add New Material' }}</h2>
            
            <form [formGroup]="materialForm" (ngSubmit)="onSubmit()">
                <div class="grid">
                    <div class="col-12 md:col-6 field">
                        <label for="name" class="block mb-2">Name *</label>
                        <input pInputText id="name" formControlName="name" class="w-full" />
                        <small class="p-error" *ngIf="materialForm.get('name')?.invalid && materialForm.get('name')?.touched">
                            Name is required
                        </small>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="unit" class="block mb-2">Unit *</label>
                        <input pInputText id="unit" formControlName="unit" class="w-full" placeholder="e.g., kg, pcs, liters" />
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="stock" class="block mb-2">Current Stock *</label>
                        <p-inputNumber id="stock" formControlName="stock" [min]="0" styleClass="w-full"></p-inputNumber>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="stockMin" class="block mb-2">Minimum Stock *</label>
                        <p-inputNumber id="stockMin" formControlName="stockMin" [min]="0" styleClass="w-full"></p-inputNumber>
                    </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                    <button pButton type="submit" label="Save" icon="pi pi-check" [disabled]="materialForm.invalid"></button>
                    <button pButton type="button" label="Cancel" icon="pi pi-times" class="p-button-secondary" routerLink="/raw-materials"></button>
                </div>
            </form>
        </div>
        
        <p-toast></p-toast>
    `,
    styles: [`
        :host { display: block; padding: 2rem; }
        .card { background: var(--surface-card); border-radius: 12px; padding: 1.5rem; max-width: 800px; }
        .field { margin-bottom: 1rem; }
    `]
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
