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
import { ProductService } from '../../../production/services/product.service';
import { CustomerOrder, Customer, Product } from '../../../../shared/models/models';

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
        <div class="form-page">
            <div class="form-card">
                <!-- Header -->
                <div class="form-header">
                    <div class="form-header-icon amber">
                        <i class="pi pi-shopping-cart"></i>
                    </div>
                    <div class="form-header-content">
                        <h1>{{ isEditMode ? 'Edit Order' : 'Create Customer Order' }}</h1>
                        <p>{{ isEditMode ? 'Update order details' : 'Create a new customer order' }}</p>
                    </div>
                </div>

                <!-- Form Body -->
                <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
                    <div class="form-body">
                        
                        <!-- Order Details Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-info-circle"></i>
                                Order Details
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="customerId">Customer <span class="required">*</span></label>
                                    <p-dropdown id="customerId" formControlName="customerId" [options]="customers"
                                                optionLabel="name" optionValue="idCustomer" placeholder="Select customer"
                                                [filter]="true" filterBy="name"></p-dropdown>
                                </div>
                                <div class="form-field">
                                    <label for="productId">Product <span class="required">*</span></label>
                                    <p-dropdown id="productId" formControlName="productId" [options]="products"
                                                optionLabel="name" optionValue="idProduct" placeholder="Select product"
                                                [filter]="true" filterBy="name"></p-dropdown>
                                </div>
                            </div>
                        </div>

                        <!-- Quantity & Status Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-sliders-h"></i>
                                Quantity & Status
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="quantity">Quantity <span class="required">*</span></label>
                                    <p-inputNumber id="quantity" formControlName="quantity" [min]="1" 
                                                   [showButtons]="true" placeholder="1"></p-inputNumber>
                                </div>
                                <div class="form-field">
                                    <label for="status">Order Status <span class="required">*</span></label>
                                    <p-dropdown id="status" formControlName="status" [options]="statusOptions"
                                                placeholder="Select status"></p-dropdown>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" routerLink="/customer-orders">
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
