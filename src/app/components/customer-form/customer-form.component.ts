import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/models';

@Component({
    selector: 'app-customer-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="form-page">
            <div class="form-card">
                <!-- Header -->
                <div class="form-header">
                    <div class="form-header-icon amber">
                        <i class="pi pi-users"></i>
                    </div>
                    <div class="form-header-content">
                        <h1>{{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}</h1>
                        <p>{{ isEditMode ? 'Update customer information' : 'Register a new customer account' }}</p>
                    </div>
                </div>

                <!-- Form Body -->
                <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
                    <div class="form-body">
                        
                        <!-- Customer Information Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-user"></i>
                                Customer Information
                            </div>
                            <div class="form-grid cols-1">
                                <div class="form-field">
                                    <label for="name">Customer Name <span class="required">*</span></label>
                                    <input pInputText id="name" formControlName="name" placeholder="Enter customer name">
                                    <span class="form-error" *ngIf="customerForm.get('name')?.invalid && customerForm.get('name')?.touched">
                                        Name is required
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Location Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-map-marker"></i>
                                Location
                            </div>
                            <div class="form-grid">
                                <div class="form-field full-width">
                                    <label for="address">Address <span class="required">*</span></label>
                                    <input pInputText id="address" formControlName="address" placeholder="Street address">
                                    <span class="form-error" *ngIf="customerForm.get('address')?.invalid && customerForm.get('address')?.touched">
                                        Address is required
                                    </span>
                                </div>
                                <div class="form-field">
                                    <label for="city">City <span class="required">*</span></label>
                                    <input pInputText id="city" formControlName="city" placeholder="City name">
                                    <span class="form-error" *ngIf="customerForm.get('city')?.invalid && customerForm.get('city')?.touched">
                                        City is required
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" routerLink="/customers">
                            <i class="pi pi-times"></i>
                            Cancel
                        </button>
                        <button type="submit" class="btn-save" [disabled]="customerForm.invalid">
                            <i class="pi pi-check"></i>
                            {{ isEditMode ? 'Update Customer' : 'Add Customer' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    styles: [`:host { display: block; }`]
})
export class CustomerFormComponent implements OnInit {
    customerForm!: FormGroup;
    isEditMode = false;
    customerId?: number;

    constructor(
        private fb: FormBuilder,
        private customerService: CustomerService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required]
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.customerId = +params['id'];
                this.loadCustomer();
            }
        });
    }

    loadCustomer(): void {
        this.customerService.getCustomerById(this.customerId!).subscribe({
            next: (customer) => this.customerForm.patchValue(customer),
            error: () => this.router.navigate(['/customers'])
        });
    }

    onSubmit(): void {
        if (this.customerForm.invalid) return;

        const customer: Customer = this.customerForm.value;

        const operation = this.isEditMode
            ? this.customerService.updateCustomer(this.customerId!, customer)
            : this.customerService.createCustomer(customer);

        operation.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Customer ${this.isEditMode ? 'updated' : 'created'} successfully` });
                setTimeout(() => this.router.navigate(['/customers']), 1000);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save customer' })
        });
    }
}
