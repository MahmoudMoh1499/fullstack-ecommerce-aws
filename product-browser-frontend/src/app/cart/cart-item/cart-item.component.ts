// src/app/cart/cart-item/cart-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<{ productId: string, quantity: number }>();
  @Output() removeItem = new EventEmitter<string>();

  updateQuantity(newQuantity: number): void {
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.quantityChange.emit({
        productId: this.item.productId,
        quantity: newQuantity
      });
    }
  }

  handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    if (!isNaN(newQuantity)) {
      this.updateQuantity(newQuantity);
    }
  }
}
