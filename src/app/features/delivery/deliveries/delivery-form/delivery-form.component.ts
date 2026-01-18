import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { DeliveryService } from '../../services/delivery.service';
import { CustomerOrderService } from '../../services/customer-order.service';
import { Delivery, CustomerOrder } from '../../../../shared/models/models';

@Component({
    selector: 'app-delivery-form',
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
        <div class="form-page">
            <div class="form-card">
                <!-- Header -->
                <div class="form-header">
                    <div class="form-header-icon cyan">
                        <i class="pi pi-truck"></i>
                    </div>
                    <div class="form-header-content">
                        <h1>{{ isEditMode ? 'Edit Delivery' : 'Schedule New Delivery' }}</h1>
                        <p>{{ isEditMode ? 'Update delivery details' : 'Schedule a new delivery for a customer order' }}</p>
                    </div>
                </div>

                <!-- Form Body -->
                <form [formGroup]="deliveryForm" (ngSubmit)="onSubmit()">
                    <div class="form-body">
                        
                        <!-- Order & Status Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-shopping-cart"></i>
                                Order & Status
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="orderId">Customer Order <span class="required">*</span></label>
                                    <p-dropdown id="orderId" formControlName="orderId" [options]="orders"
                                                optionValue="idOrder" placeholder="Select order" [filter]="true">
                                        <ng-template let-order pTemplate="item">
                                            #{{ order.idOrder }} - {{ order.customerName }} ({{ order.productName }})
                                        </ng-template>
                                        <ng-template let-order pTemplate="selectedItem">
                                            #{{ order.idOrder }} - {{ order.customerName }}
                                        </ng-template>
                                    </p-dropdown>
                                </div>
                                <div class="form-field">
                                    <label for="status">Delivery Status <span class="required">*</span></label>
                                    <p-dropdown id="status" formControlName="status" [options]="statusOptions"
                                                placeholder="Select status"></p-dropdown>
                                </div>
                            </div>
                        </div>

                        <!-- Logistics Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-car"></i>
                                Logistics
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="vehicle">Vehicle <span class="required">*</span></label>
                                    <input pInputText id="vehicle" formControlName="vehicle" placeholder="e.g., Van-001">
                                </div>
                                <div class="form-field">
                                    <label for="driver">Driver <span class="required">*</span></label>
                                    <input pInputText id="driver" formControlName="driver" placeholder="Driver name">
                                </div>
                            </div>
                        </div>

                        <!-- Schedule & Cost Section -->
                        <div class="form-section">
                            <div class="form-section-title">
                                <i class="pi pi-calendar"></i>
                                Schedule & Cost
                            </div>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="deliveryDate">Delivery Date <span class="required">*</span></label>
                                    <p-calendar id="deliveryDate" formControlName="deliveryDate" dateFormat="yy-mm-dd"
                                                [showIcon]="true" placeholder="Select date"></p-calendar>
                                </div>
                                <div class="form-field">
                                    <label for="cost">Delivery Cost</label>
                                    <p-inputNumber id="cost" formControlName="cost" [min]="0" mode="currency" 
                                                   currency="USD" placeholder="0.00"></p-inputNumber>
                                    <span class="form-hint">Optional delivery fee</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" routerLink="/deliveries">
                            <i class="pi pi-times"></i>
                            Cancel
                        </button>
                        <button type="submit" class="btn-save" [disabled]="deliveryForm.invalid">
                            <i class="pi pi-check"></i>
                            {{ isEditMode ? 'Update Delivery' : 'Schedule Delivery' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    styles: [`:host { display: block; }`]
})
export class DeliveryFormComponent implements OnInit {
    deliveryForm!: FormGroup;
    isEditMode = false;
    deliveryId?: number;
    orders: CustomerOrder[] = [];
    statusOptions = [
        { label: 'Scheduled', value: 'PLANIFIEE' },
        { label: 'In Progress', value: 'EN_COURS' },
        { label: 'Delivered', value: 'LIVREE' }
    ];

    constructor(
        private fb: FormBuilder,
        private deliveryService: DeliveryService,
        private orderService: CustomerOrderService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.deliveryForm = this.fb.group({
            orderId: [null, Validators.required],
            vehicle: ['', Validators.required],
            driver: ['', Validators.required],
            status: ['PLANIFIEE', Validators.required],
            deliveryDate: [new Date(), Validators.required],
            cost: [0]
        });

        this.loadOrders();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.deliveryId = +params['id'];
                this.loadDelivery();
            }
        });
    }

    loadOrders(): void {
        this.orderService.getAllOrders().subscribe(data => this.orders = data);
    }

    getOrderLabel(order: CustomerOrder): string {
        return `#${order.idOrder} - ${order.customerName}`;
    }

    loadDelivery(): void {
        this.deliveryService.getDeliveryById(this.deliveryId!).subscribe({
            next: (delivery) => {
                this.deliveryForm.patchValue({
                    ...delivery,
                    deliveryDate: new Date(delivery.deliveryDate)
                });
            },
            error: () => this.router.navigate(['/deliveries'])
        });
    }

    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    onSubmit(): void {
        if (this.deliveryForm.invalid) return;

        const formValue = this.deliveryForm.value;
        const delivery: Delivery = {
            ...formValue,
            deliveryDate: this.formatDate(formValue.deliveryDate)
        };

        const operation = this.isEditMode
            ? this.deliveryService.updateDelivery(this.deliveryId!, delivery)
            : this.deliveryService.createDelivery(delivery);

        operation.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Delivery ${this.isEditMode ? 'updated' : 'scheduled'} successfully` });
                setTimeout(() => this.router.navigate(['/deliveries']), 1000);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save delivery' })
        });
    }
}
