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
import { Delivery, CustomerOrder } from '../../models/models';

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
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Delivery' : 'Schedule New Delivery' }}</h2>
            
            <form [formGroup]="deliveryForm" (ngSubmit)="onSubmit()">
                <div class="grid">
                    <div class="col-12 md:col-6 field">
                        <label for="orderId" class="block mb-2">Customer Order *</label>
                        <p-dropdown id="orderId" formControlName="orderId" [options]="orders"
                                    optionValue="idOrder" placeholder="Select Order"
                                    styleClass="w-full">
                            <ng-template let-order pTemplate="item">
                                #{{ order.idOrder }} - {{ order.customerName }} ({{ order.productName }})
                            </ng-template>
                            <ng-template let-order pTemplate="selectedItem">
                                #{{ order.idOrder }} - {{ order.customerName }}
                            </ng-template>
                        </p-dropdown>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="status" class="block mb-2">Status *</label>
                        <p-dropdown id="status" formControlName="status" [options]="statusOptions"
                                    styleClass="w-full"></p-dropdown>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="vehicle" class="block mb-2">Vehicle *</label>
                        <input pInputText id="vehicle" formControlName="vehicle" class="w-full" placeholder="e.g., Van-001" />
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="driver" class="block mb-2">Driver *</label>
                        <input pInputText id="driver" formControlName="driver" class="w-full" />
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="deliveryDate" class="block mb-2">Delivery Date *</label>
                        <p-calendar id="deliveryDate" formControlName="deliveryDate" dateFormat="yy-mm-dd"
                                    styleClass="w-full"></p-calendar>
                    </div>
                    
                    <div class="col-12 md:col-6 field">
                        <label for="cost" class="block mb-2">Cost</label>
                        <p-inputNumber id="cost" formControlName="cost" [min]="0" mode="currency" currency="USD" styleClass="w-full"></p-inputNumber>
                    </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                    <button pButton type="submit" label="Save" icon="pi pi-check" [disabled]="deliveryForm.invalid"></button>
                    <button pButton type="button" label="Cancel" icon="pi pi-times" class="p-button-secondary" routerLink="/deliveries"></button>
                </div>
            </form>
        </div>
        
        <p-toast></p-toast>
    `,
    styles: [`
        :host { display: block; padding: 2rem; }
        .card { background: var(--surface-card); border-radius: 12px; padding: 1.5rem; max-width: 900px; }
        .field { margin-bottom: 1rem; }
    `]
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
