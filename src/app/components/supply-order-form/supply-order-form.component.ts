import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { SupplyOrderService } from '../../services/supply-order.service';
import { SupplierService } from '../../services/supplier.service';
import { RawMaterialService } from '../../services/raw-material.service';
import { SupplyOrder, RawMaterial } from '../../models/models';
import { Supplier } from '../../models/supplier.model';

@Component({
    selector: 'app-supply-order-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        ToastModule,
        DropdownModule,
        CalendarModule
    ],
    providers: [MessageService],
    template: `
        <div class="form-page" style="max-width: 1000px;">
            <div class="form-card">
                <!-- Header -->
                <div class="form-header">
                    <div class="form-header-icon blue">
                        <i class="pi pi-shopping-cart"></i>
                    </div>
                    <div class="form-header-content">
                        <h1>{{ isEditMode ? 'Edit Supply Order' : 'Create Supply Order' }}</h1>
                        <p>{{ isEditMode ? 'Update order details' : 'Create a new procurement order' }}</p>
                    </div>
                </div>

                <!-- Form Body -->
                <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
                    <div class="form-body">
                        
                        <!-- Supplier & Status Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-building"></i>
                                Supplier & Status
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="supplierId">Supplier <span class="required">*</span></label>
                                    <p-dropdown id="supplierId" formControlName="supplierId" [options]="suppliers"
                                                optionLabel="name" optionValue="idSupplier" placeholder="Select supplier"
                                                [filter]="true" filterBy="name"></p-dropdown>
                                </div>
                                <div class="form-field">
                                    <label for="status">Order Status <span class="required">*</span></label>
                                    <p-dropdown id="status" formControlName="status" [options]="statusOptions"
                                                placeholder="Select status"></p-dropdown>
                                </div>
                            </div>
                        </div>

                        <!-- Dates Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-calendar"></i>
                                Schedule
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="orderDate">Order Date <span class="required">*</span></label>
                                    <p-calendar id="orderDate" formControlName="orderDate" dateFormat="yy-mm-dd"
                                                [showIcon]="true" placeholder="Select date"></p-calendar>
                                </div>
                                <div class="form-field">
                                    <label for="expectedDeliveryDate">Expected Delivery <span class="required">*</span></label>
                                    <p-calendar id="expectedDeliveryDate" formControlName="expectedDeliveryDate" 
                                                dateFormat="yy-mm-dd" [minDate]="minDeliveryDate" 
                                                [showIcon]="true" placeholder="Select date"></p-calendar>
                                </div>
                            </div>
                        </div>

                        <!-- Order Items Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-list"></i>
                                Order Items
                            </div>
                            
                            <div formArrayName="items">
                                <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" 
                                     style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem;">
                                    <div class="form-grid cols-3" style="gap: 1rem; align-items: end;">
                                        <div class="form-field">
                                            <label>Material <span class="required">*</span></label>
                                            <p-dropdown formControlName="materialId" [options]="materials"
                                                        optionLabel="name" optionValue="idMaterial" 
                                                        placeholder="Select material" [filter]="true"></p-dropdown>
                                        </div>
                                        <div class="form-field">
                                            <label>Quantity <span class="required">*</span></label>
                                            <p-inputNumber formControlName="quantity" [min]="1" [showButtons]="true"></p-inputNumber>
                                        </div>
                                        <div class="form-field">
                                            <label>Unit Price <span class="required">*</span></label>
                                            <p-inputNumber formControlName="unitPrice" [min]="0" mode="currency" currency="USD"></p-inputNumber>
                                        </div>
                                    </div>
                                    <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                                        <button type="button" class="row-action delete" (click)="removeItem(i)" title="Remove">
                                            <i class="pi pi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="button" class="btn-secondary" style="margin-top: 0.5rem;" (click)="addItem()">
                                <i class="pi pi-plus"></i>
                                Add Item
                            </button>
                        </div>

                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" routerLink="/supply-orders">
                            <i class="pi pi-times"></i>
                            Cancel
                        </button>
                        <button type="submit" class="btn-save" [disabled]="orderForm.invalid">
                            <i class="pi pi-check"></i>
                            {{ isEditMode ? 'Update Order' : 'Create Order' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    styles: [`:host { display: block; }`]
})
export class SupplyOrderFormComponent implements OnInit {
    orderForm!: FormGroup;
    isEditMode = false;
    orderId?: number;
    suppliers: Supplier[] = [];
    materials: RawMaterial[] = [];
    minDeliveryDate: Date = new Date();
    statusOptions = [
        { label: 'Pending', value: 'EN_ATTENTE' },
        { label: 'In Progress', value: 'EN_COURS' },
        { label: 'Received', value: 'RECUE' }
    ];

    constructor(
        private fb: FormBuilder,
        private orderService: SupplyOrderService,
        private supplierService: SupplierService,
        private materialService: RawMaterialService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        // Set expected delivery to 7 days from now by default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const defaultDeliveryDate = new Date();
        defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 7);

        this.orderForm = this.fb.group({
            supplierId: [null, Validators.required],
            status: ['EN_ATTENTE', Validators.required],
            orderDate: [new Date(), Validators.required],
            expectedDeliveryDate: [defaultDeliveryDate, Validators.required],
            items: this.fb.array([])
        });

        // Store minDate for template
        this.minDeliveryDate = tomorrow;

        this.loadSuppliers();
        this.loadMaterials();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.orderId = +params['id'];
                this.loadOrder();
            } else {
                this.addItem();
            }
        });
    }

    get items(): FormArray {
        return this.orderForm.get('items') as FormArray;
    }

    loadSuppliers(): void {
        this.supplierService.getAllSuppliers().subscribe(data => this.suppliers = data);
    }

    loadMaterials(): void {
        this.materialService.getAllMaterials().subscribe(data => this.materials = data);
    }

    loadOrder(): void {
        this.orderService.getOrderById(this.orderId!).subscribe({
            next: (order) => {
                this.orderForm.patchValue({
                    supplierId: order.supplierId,
                    status: order.status,
                    orderDate: new Date(order.orderDate),
                    expectedDeliveryDate: new Date(order.expectedDeliveryDate)
                });
                order.items?.forEach(item => {
                    this.items.push(this.fb.group({
                        materialId: [item.materialId, Validators.required],
                        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
                        unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]]
                    }));
                });
            },
            error: () => this.router.navigate(['/supply-orders'])
        });
    }

    addItem(): void {
        this.items.push(this.fb.group({
            materialId: [null, Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            unitPrice: [0, [Validators.required, Validators.min(0)]]
        }));
    }

    removeItem(index: number): void {
        this.items.removeAt(index);
    }

    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    onSubmit(): void {
        if (this.orderForm.invalid) return;

        const formValue = this.orderForm.value;

        // Ensure status is a string value, not an object
        const statusValue = typeof formValue.status === 'object' ? formValue.status.value : formValue.status;

        const order: SupplyOrder = {
            supplierId: formValue.supplierId,
            status: statusValue,
            orderDate: this.formatDate(formValue.orderDate),
            expectedDeliveryDate: this.formatDate(formValue.expectedDeliveryDate),
            items: formValue.items.map((item: any) => ({
                materialId: item.materialId,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            }))
        };

        console.log('Submitting order:', JSON.stringify(order, null, 2));

        const operation = this.isEditMode
            ? this.orderService.updateOrder(this.orderId!, order)
            : this.orderService.createOrder(order);

        operation.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Order ${this.isEditMode ? 'updated' : 'created'} successfully` });
                setTimeout(() => this.router.navigate(['/supply-orders']), 1000);
            },
            error: (err) => {
                console.error('Error creating order:', err);
                console.error('Error response body:', err.error);
                console.error('Validation errors:', err.error?.errors);

                // Build error message from validation errors
                let errorMessage = 'Failed to save order';
                if (err.error?.errors) {
                    const errorDetails = Object.entries(err.error.errors)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join(', ');
                    errorMessage = errorDetails || err.error?.message || errorMessage;
                }

                this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: errorMessage });
            }
        });
    }
}
