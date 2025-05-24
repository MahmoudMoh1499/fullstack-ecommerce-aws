import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  searchQuery = '';
  filteredProducts: Product[] = [];

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private toastr: ToastrService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (response: { products: Product[] }) => {
        this.products = response.products;
        this.filteredProducts = [...response.products];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.toastr.error('Failed to load products');
        this.isLoading = false;
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id);
  }

  filterProducts(): void {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }
}
