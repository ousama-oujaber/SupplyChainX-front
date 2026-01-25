import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { Customer } from '../models/customer.model';
import * as CustomerActions from '../store/customer.actions';
import * as CustomerSelectors from '../store/customer.selectors';

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
                                        Name is required (3-100 characters)
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
                                        Address is required (10-255 characters)
                                    </span>
                                </div>
                                <div class="form-field">
                                    <label for="city">City <span class="required">*</span></label>
                                    <input pInputText id="city" formControlName="city" placeholder="City name">
                                    <span class="form-error" *ngIf="customerForm.get('city')?.invalid && customerForm.get('city')?.touched">
                                        City is required (2-50 characters)
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" routerLink="/delivery/customers">
                            <i class="pi pi-times"></i>
                            Cancel
                        </button>
                        <button type="submit" class="btn-save" [disabled]="customerForm.invalid || (isLoading$ | async)">
                            <i class="pi" [ngClass]="{'pi-check': !(isLoading$ | async), 'pi-spin pi-spinner': (isLoading$ | async)}"></i>
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
export class CustomerFormComponent implements OnInit, OnDestroy {
    customerForm!: FormGroup;
    isEditMode = false;
    customerId?: number;
    isLoading$: Observable<boolean>;

    private subscription: Subscription = new Subscription();

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private route: ActivatedRoute,
    ) {
        this.isLoading$ = this.store.select(CustomerSelectors.selectIsLoading);
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
            city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.customerId = +params['id'];
                this.store.dispatch(CustomerActions.loadCustomerById({ id: this.customerId }));

                // Subscribe to selected customer to patch form
                this.subscription.add(
                    this.store.select(CustomerSelectors.selectSelectedCustomer)
                        .pipe(filter(c => !!c && c.id === this.customerId))
                        .subscribe(customer => {
                            if (customer) {
                                this.customerForm.patchValue(customer);
                            }
                        })
                );
            } else {
                this.store.dispatch(CustomerActions.clearSelectedCustomer());
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(CustomerActions.clearSelectedCustomer());
    }

    onSubmit(): void {
        if (this.customerForm.invalid) {
            this.customerForm.markAllAsTouched();
            return;
        }

        const customerData = this.customerForm.value;

        if (this.isEditMode && this.customerId) {
            this.store.dispatch(CustomerActions.updateCustomer({
                id: this.customerId,
                customer: customerData
            }));
        } else {
            this.store.dispatch(CustomerActions.createCustomer({
                customer: customerData
            }));
        }
    }
}
