import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { CustomerOrderService } from '../../services/customer-order.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { CustomerOrder, Customer, Product } from '../../models/models';

@Component({
    selector: 'app-customer-order-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        InputNumberModule,
        CardModule,
        ToastModule,
        DropdownModule
    ],
    providers: [MessageService],
    template: `
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Order' : 'Create Customer Order' }}</h2>
            
            <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
                <div class="grid">
                    <div class="col-12 md:col-6 field">
                        <label for="customerId" class="block mb-2">Customer *</label>
                        <p-dropdown id="customerId" formControlName="customerId" [options]="customers"
                                    optionLabel="name" optionValue="idCustomer" placeholder="Select Customer"
                                    styleClass="w-full"></p-dropdown>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="productId" class="block mb-2">Product *</label>
                        <p-dropdown id="productId" formControlName="productId" [options]="products"
                                    optionLabel="name" optionValue="idProduct" placeholder="Select Product"
                                    styleClass="w-full"></p-dropdown>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="quantity" class="block mb-2">Quantity *</label>
                        <p-inputNumber id="quantity" formControlName="quantity" [min]="1" styleClass="w-full"></p-inputNumber>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="status" class="block mb-2">Status *</label>
                        <p-dropdown id="status" formControlName="status" [options]="statusOptions"
                                    styleClass="w-full"></p-dropdown>
                    </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                    <button pButton type="submit" label="Save" icon="pi pi-check" [disabled]="orderForm.invalid"></button>
                    <button pButton type="button" label="Cancel" icon="pi pi-times" class="p-button-secondary" routerLink="/customer-orders"></button>
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
export class CustomerOrderFormComponent implements OnInit {
    orderForm!: FormGroup;
    isEditMode = false;
    orderId?: number;
    customers: Customer[] = [];
    products: Product[] = [];
    statusOptions = [
        { label: 'Preparing', value: 'EN_PREPARATION' },
        { label: 'In Transit', value: 'EN_ROUTE' },
        { label: 'Delivered', value: 'LIVREE' }
    ];

    constructor(
        private fb: FormBuilder,
        private orderService: CustomerOrderService,
        private customerService: CustomerService,
        private productService: ProductService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.orderForm = this.fb.group({
            customerId: [null, Validators.required],
            productId: [null, Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            status: ['EN_PREPARATION', Validators.required]
        });

        this.loadCustomers();
        this.loadProducts();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.orderId = +params['id'];
                this.loadOrder();
            }
        });
    }

    loadCustomers(): void {
        this.customerService.getAllCustomers().subscribe(data => this.customers = data);
    }

    loadProducts(): void {
        this.productService.getAllProducts().subscribe(data => this.products = data);
    }

    loadOrder(): void {
        this.orderService.getOrderById(this.orderId!).subscribe({
            next: (order) => this.orderForm.patchValue(order),
            error: () => this.router.navigate(['/customer-orders'])
        });
    }

    onSubmit(): void {
        if (this.orderForm.invalid) return;

        const order: CustomerOrder = this.orderForm.value;

        const operation = this.isEditMode
            ? this.orderService.updateOrder(this.orderId!, order)
            : this.orderService.createOrder(order);

        operation.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Order ${this.isEditMode ? 'updated' : 'created'} successfully` });
                setTimeout(() => this.router.navigate(['/customer-orders']), 1000);
            },
            error: (err) => {
                console.error('Error creating order:', err);
                let errorMessage = 'Failed to save order';

                if (err.status === 409) {
                    // Business conflict - usually insufficient stock
                    errorMessage = err.error?.message || 'Insufficient product stock or business rule conflict';
                } else if (err.status === 400) {
                    // Validation error
                    if (err.error?.errors) {
                        const errorDetails = Object.entries(err.error.errors)
                            .map(([field, msg]) => `${field}: ${msg}`)
                            .join(', ');
                        errorMessage = errorDetails;
                    } else {
                        errorMessage = err.error?.message || 'Invalid input data';
                    }
                } else if (err.error?.message) {
                    errorMessage = err.error.message;
                }

                this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
            }
        });
    }
}
