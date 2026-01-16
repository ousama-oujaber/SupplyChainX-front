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
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}</h2>
            
            <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
                <div class="grid">
                    <div class="col-12 field">
                        <label for="name" class="block mb-2">Name *</label>
                        <input pInputText id="name" formControlName="name" class="w-full" />
                        <small class="p-error" *ngIf="customerForm.get('name')?.invalid && customerForm.get('name')?.touched">
                            Name is required
                        </small>
                    </div>
                    
                    <div class="col-12 md:col-8 field">
                        <label for="address" class="block mb-2">Address *</label>
                        <input pInputText id="address" formControlName="address" class="w-full" />
                        <small class="p-error" *ngIf="customerForm.get('address')?.invalid && customerForm.get('address')?.touched">
                            Address is required
                        </small>
                    </div>
                    
                    <div class="col-12 md:col-4 field">
                        <label for="city" class="block mb-2">City *</label>
                        <input pInputText id="city" formControlName="city" class="w-full" />
                        <small class="p-error" *ngIf="customerForm.get('city')?.invalid && customerForm.get('city')?.touched">
                            City is required
                        </small>
                    </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                    <button pButton type="submit" label="Save" icon="pi pi-check" [disabled]="customerForm.invalid"></button>
                    <button pButton type="button" label="Cancel" icon="pi pi-times" class="p-button-secondary" routerLink="/customers"></button>
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
