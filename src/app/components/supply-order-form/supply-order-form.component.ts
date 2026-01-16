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
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Supply Order' : 'Create Supply Order' }}</h2>
            
            <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
                <div class="grid">
                    <div class="col-12 md:col-6 field">
                        <label for="supplierId" class="block mb-2">Supplier *</label>
                        <p-dropdown id="supplierId" formControlName="supplierId" [options]="suppliers"
                                    optionLabel="name" optionValue="idSupplier" placeholder="Select Supplier"
                                    styleClass="w-full"></p-dropdown>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="status" class="block mb-2">Status *</label>
                        <p-dropdown id="status" formControlName="status" [options]="statusOptions"
                                    styleClass="w-full"></p-dropdown>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="orderDate" class="block mb-2">Order Date *</label>
                        <p-calendar id="orderDate" formControlName="orderDate" dateFormat="yy-mm-dd"
                                    styleClass="w-full"></p-calendar>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="expectedDeliveryDate" class="block mb-2">Expected Delivery *</label>
                        <p-calendar id="expectedDeliveryDate" formControlName="expectedDeliveryDate" 
                                    dateFormat="yy-mm-dd" [minDate]="minDeliveryDate" styleClass="w-full"></p-calendar>
                    </div>
                </div>
                
                <h3 class="mt-4 mb-3">Order Items</h3>
                <div formArrayName="items">
                    <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" class="grid surface-ground border-round p-3 mb-2">
                        <div class="col-12 md:col-4 field">
                            <label class="block mb-2">Material</label>
                            <p-dropdown formControlName="materialId" [options]="materials"
                                        optionLabel="name" optionValue="idMaterial" placeholder="Select Material"
                                        styleClass="w-full"></p-dropdown>
                        </div>
                        <div class="col-12 md:col-3 field">
                            <label class="block mb-2">Quantity</label>
                            <p-inputNumber formControlName="quantity" [min]="1" styleClass="w-full"></p-inputNumber>
                        </div>
                        <div class="col-12 md:col-3 field">
                            <label class="block mb-2">Unit Price</label>
                            <p-inputNumber formControlName="unitPrice" [min]="0" mode="currency" currency="USD" styleClass="w-full"></p-inputNumber>
                        </div>
                        <div class="col-12 md:col-2 flex align-items-end">
                            <button pButton type="button" icon="pi pi-trash" class="p-button-danger" (click)="removeItem(i)"></button>
                        </div>
                    </div>
                </div>
                <button pButton type="button" label="Add Item" icon="pi pi-plus" class="p-button-outlined mb-4" (click)="addItem()"></button>
                
                <div class="flex gap-2 mt-4">
                    <button pButton type="submit" label="Save" icon="pi pi-check" [disabled]="orderForm.invalid"></button>
                    <button pButton type="button" label="Cancel" icon="pi pi-times" class="p-button-secondary" routerLink="/supply-orders"></button>
                </div>
            </form>
        </div>
        
        <p-toast></p-toast>
    `,
    styles: [`
        :host { display: block; padding: 2rem; }
        .card { background: var(--surface-card); border-radius: 12px; padding: 1.5rem; max-width: 1000px; }
        .field { margin-bottom: 1rem; }
    `]
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
