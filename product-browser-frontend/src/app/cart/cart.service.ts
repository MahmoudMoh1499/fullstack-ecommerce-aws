// src/app/cart/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/auth.service';
import { Product } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loadCart();
  }

  private get apiUrl(): string {
    return 'YOUR_API_BASE_URL/cart';
  }

  private loadCart(): void {
    if (this.authService.isLoggedIn()) {
      this.http.get<Cart>(this.apiUrl).subscribe({
        next: (cart) => this.cartSubject.next(cart),
        error: () => this.toastr.error('Failed to load cart')
      });
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please login to add items to cart');
      return;
    }

    this.http.post<Cart>(this.apiUrl, {
      productId: product.id,
      quantity
    }).subscribe({
      next: (updatedCart) => {
        this.cartSubject.next(updatedCart);
        this.toastr.success(`${product.name} added to cart`);
      },
      error: () => this.toastr.error('Failed to add item to cart')
    });
  }

  removeFromCart(productId: string): void {
    this.http.delete<Cart>(`${this.apiUrl}/${productId}`).subscribe({
      next: (updatedCart) => {
        this.cartSubject.next(updatedCart);
        this.toastr.info('Item removed from cart');
      },
      error: () => this.toastr.error('Failed to remove item from cart')
    });
  }

  updateQuantity(productId: string, newQuantity: number): void {
    this.http.patch<Cart>(`${this.apiUrl}/${productId}`, {
      quantity: newQuantity
    }).subscribe({
      next: (updatedCart) => this.cartSubject.next(updatedCart),
      error: () => this.toastr.error('Failed to update quantity')
    });
  }

  clearCart(): void {
    this.http.delete<Cart>(this.apiUrl).subscribe({
      next: (emptyCart) => {
        this.cartSubject.next(emptyCart);
        this.toastr.info('Cart cleared');
      },
      error: () => this.toastr.error('Failed to clear cart')
    });
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }
}
