import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/models';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-form.component.html',
    styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; margin-right: 10px; }
    button:disabled { background-color: #ccc; }
    button.cancel { background-color: #6c757d; }
  `]
})
export class ProductFormComponent implements OnInit {
    product: Product = {
        name: '',
        productionTime: 0,
        cost: 0,
        stock: 0,
        billOfMaterialIds: [],
        activeOrdersCount: 0
    };
    isEditMode = false;

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.productService.getProductById(+id).subscribe({
                next: (data) => this.product = data,
                error: (e) => console.error(e)
            });
        }
    }

    onSubmit(): void {
        if (this.isEditMode && this.product.idProduct) {
            this.productService.updateProduct(this.product.idProduct, this.product).subscribe({
                next: () => this.router.navigate(['/products']),
                error: (e) => console.error(e)
            });
        } else {
            this.productService.createProduct(this.product).subscribe({
                next: () => this.router.navigate(['/products']),
                error: (e) => console.error(e)
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/products']);
    }
}
