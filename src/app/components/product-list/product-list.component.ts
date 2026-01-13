import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/models';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    templateUrl: './product-list.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];

    constructor(private productService: ProductService, private router: Router) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getAllProducts().subscribe({
            next: (data) => {
                this.products = data;
            },
            error: (e) => console.error(e)
        });
    }

    addProduct(): void {
        this.router.navigate(['/products/new']);
    }

    editProduct(id: number): void {
        this.router.navigate(['/products/edit', id]);
    }

    deleteProduct(id: number): void {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe({
                next: () => this.loadProducts(),
                error: (e) => console.error(e)
            });
        }
    }
}
