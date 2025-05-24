import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../core/config/api.config';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private config = API_CONFIG;
  private apiUrl = this.config;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    console.log(`${this.apiUrl.baseUrl}${this.apiUrl.endpoints.products}`);

    return this.http.get(`${this.apiUrl.baseUrl}${this.apiUrl.endpoints.products}`);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(
      `${this.config.baseUrl}${this.config.endpoints.cart.get}`
    );
  }

  addToCart(productId: string): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.config.baseUrl}${this.config.endpoints.cart.add}`,
      { productId }
    );
  }

  updateCartQuantity(productId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.config.baseUrl}${this.config.endpoints.cart.updateQuantity}`,
      { productId, quantity }
    );
  }


  removeFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(
      `${this.config.baseUrl}${this.config.endpoints.cart.remove}/${productId}`
    );
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(
      `${this.config.baseUrl}${this.config.endpoints.cart}`
    );
  }



  // Admin functions
  addProduct(productData: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('image', image);

    return this.http.post(`${this.apiUrl}/products`, formData);
  }
}
