
import { Product } from '../models/product.model';
export interface CartItem {
  productId: string;
  quantity: number;
  productDetails?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  userId?: string;
}
