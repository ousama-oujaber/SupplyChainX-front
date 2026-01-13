import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductionOrderService } from '../../services/production-order.service';
import { ProductionOrder } from '../../models/models';

@Component({
    selector: 'app-production-order-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './production-order-form.component.html',
    styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, select { width: 100%; padding: 8px; box-sizing: border-box; }
    button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; margin-right: 10px; }
    button:disabled { background-color: #ccc; }
    button.cancel { background-color: #6c757d; }
  `]
})
export class ProductionOrderFormComponent implements OnInit {
    order: ProductionOrder = {
        productId: 0,
        productName: '',
        quantity: 0,
        status: 'EN_ATTENTE',
        startDate: '',
        endDate: '',
        isPriority: false,
        estimatedProductionTime: 0,
        materialsAvailable: false
    };
    isEditMode = false;

    constructor(
        private orderService: ProductionOrderService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.orderService.getProductionOrderById(+id).subscribe({
                next: (data) => this.order = data,
                error: (e) => console.error(e)
            });
        }
    }

    onSubmit(): void {
        if (this.isEditMode && this.order.idOrder) {
            this.orderService.updateProductionOrder(this.order.idOrder, this.order).subscribe({
                next: () => this.router.navigate(['/production-orders']),
                error: (e) => console.error(e)
            });
        } else {
            this.orderService.createProductionOrder(this.order).subscribe({
                next: () => this.router.navigate(['/production-orders']),
                error: (e) => console.error(e)
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/production-orders']);
    }
}
