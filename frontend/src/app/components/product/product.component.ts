import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product = { name: '', price: 0, description: '' };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
  }

  saveProduct(): void {
    console.log('Saving product:', this.selectedProduct);
    if (this.selectedProduct.id!) {
      this.productService
        .updateProduct(this.selectedProduct.id, this.selectedProduct)
        .subscribe(() => this.loadProducts());
    } else {
      this.productService.createProduct(this.selectedProduct).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product. Please check the console for details.');
        },
      });
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }
}