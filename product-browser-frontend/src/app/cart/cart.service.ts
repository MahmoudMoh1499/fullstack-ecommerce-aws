// src/app/cart/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../models/cart.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.loadCart();
  }

  private loadCart(): void {
    if (this.auth.isLoggedIn()) {
      this.api.getCart().subscribe({
        next: cart => this.cartSubject.next(cart),
        error: () => this.toastr.error('Failed to load cart')
      });
    }
  }

  addToCart(productId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.toastr.warning('Please login to add items to cart');
      return;
    }

    this.api.addToCart(productId).subscribe({
      next: cart => {
        this.cartSubject.next(cart);
        this.toastr.success('Item added to cart');
      },
      error: () => this.toastr.error('Failed to add item to cart')
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (!this.auth.isLoggedIn()) {
      this.toastr.warning('Please login to update cart');
      return;
    }

    this.api.updateCartQuantity(productId, quantity).subscribe({
      next: cart => {
        this.cartSubject.next(cart);
        this.toastr.success('Cart updated');
      },
      error: () => this.toastr.error('Failed to update cart')
    });
  }

  removeFromCart(productId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.toastr.warning('Please login to update cart');
      return;
    }

    this.api.removeFromCart(productId).subscribe({
      next: cart => {
        this.cartSubject.next(cart);
        this.toastr.success('Item removed from cart');
      },
      error: () => this.toastr.error('Failed to remove item from cart')
    });
  }

  clearCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.toastr.warning('Please login to clear cart');
      return;
    }

    this.api.clearCart().subscribe({
      next: cart => {
        this.cartSubject.next(cart);
        this.toastr.success('Cart cleared');
      },
      error: () => this.toastr.error('Failed to clear cart')
    });
  }


  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }
}
